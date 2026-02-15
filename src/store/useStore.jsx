import { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import { defaultConfig, defaultTeamMembers, historicalEntries } from './initialData';
import {
  subscribeToWorkspace,
  subscribeToEntries,
  saveConfig,
  saveTeamMembers,
  saveEntry,
  deleteEntry,
  workspaceExists,
  seedWorkspace,
  importAll,
} from './firestoreService';

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

// ─── Reducer (operates on in-memory state only) ──────────────────────

function reducer(state, action) {
  switch (action.type) {
    // Firestore pushed new workspace data
    case '_SYNC_WORKSPACE': {
      return {
        ...state,
        config: action.payload.config ?? state.config,
        teamMembers: action.payload.teamMembers ?? state.teamMembers,
      };
    }
    // Firestore pushed new entries
    case '_SYNC_ENTRIES': {
      return { ...state, entries: action.payload };
    }

    // ---- CONFIG ----
    case 'ADD_METRIC': {
      const newMetric = {
        id: generateId(),
        name: action.payload.name,
        weight: action.payload.weight ?? 1,
      };
      const newConfig = {
        ...state.config,
        metrics: [...state.config.metrics, newMetric],
      };
      saveConfig(newConfig);
      return { ...state, config: newConfig };
    }
    case 'UPDATE_METRIC': {
      const newConfig = {
        ...state.config,
        metrics: state.config.metrics.map((m) =>
          m.id === action.payload.id ? { ...m, ...action.payload.updates } : m
        ),
      };
      saveConfig(newConfig);
      return { ...state, config: newConfig };
    }
    case 'REMOVE_METRIC': {
      const newConfig = {
        ...state.config,
        metrics: state.config.metrics.filter((m) => m.id !== action.payload.id),
      };
      saveConfig(newConfig);
      return { ...state, config: newConfig };
    }
    case 'ADD_SUBJECTIVE_METRIC': {
      const newMetric = {
        id: generateId(),
        name: action.payload.name,
        weight: action.payload.weight ?? 1,
        min: action.payload.min ?? 1,
        max: action.payload.max ?? 5,
      };
      const newConfig = {
        ...state.config,
        subjectiveMetrics: [...state.config.subjectiveMetrics, newMetric],
      };
      saveConfig(newConfig);
      return { ...state, config: newConfig };
    }
    case 'UPDATE_SUBJECTIVE_METRIC': {
      const newConfig = {
        ...state.config,
        subjectiveMetrics: state.config.subjectiveMetrics.map((m) =>
          m.id === action.payload.id ? { ...m, ...action.payload.updates } : m
        ),
      };
      saveConfig(newConfig);
      return { ...state, config: newConfig };
    }
    case 'REMOVE_SUBJECTIVE_METRIC': {
      const newConfig = {
        ...state.config,
        subjectiveMetrics: state.config.subjectiveMetrics.filter(
          (m) => m.id !== action.payload.id
        ),
      };
      saveConfig(newConfig);
      return { ...state, config: newConfig };
    }
    case 'UPDATE_LOAD_SCORE_WEIGHT': {
      const newConfig = { ...state.config, loadScoreWeight: action.payload };
      saveConfig(newConfig);
      return { ...state, config: newConfig };
    }

    // ---- TEAM ----
    case 'ADD_TEAM_MEMBER': {
      if (state.teamMembers.includes(action.payload)) return state;
      const newMembers = [...state.teamMembers, action.payload];
      saveTeamMembers(newMembers);
      return { ...state, teamMembers: newMembers };
    }
    case 'REMOVE_TEAM_MEMBER': {
      const newMembers = state.teamMembers.filter((m) => m !== action.payload);
      saveTeamMembers(newMembers);
      return { ...state, teamMembers: newMembers };
    }

    // ---- ENTRIES ----
    case 'SAVE_ENTRY': {
      const { date, label, data } = action.payload;
      saveEntry({ date, label, data });
      // Optimistic update
      const existingIdx = state.entries.findIndex((e) => e.date === date);
      let newEntries;
      if (existingIdx >= 0) {
        newEntries = [...state.entries];
        newEntries[existingIdx] = { date, label, data };
      } else {
        newEntries = [...state.entries, { date, label, data }].sort(
          (a, b) => a.date.localeCompare(b.date)
        );
      }
      return { ...state, entries: newEntries };
    }
    case 'DELETE_ENTRY': {
      deleteEntry(action.payload);
      return {
        ...state,
        entries: state.entries.filter((e) => e.date !== action.payload),
      };
    }

    // ---- RESET ----
    case 'RESET_ALL': {
      seedWorkspace(defaultConfig, defaultTeamMembers, historicalEntries);
      return {
        config: defaultConfig,
        teamMembers: defaultTeamMembers,
        entries: historicalEntries,
      };
    }
    case 'IMPORT_STATE': {
      const { config, teamMembers, entries } = action.payload;
      importAll(config, teamMembers, entries);
      return { config, teamMembers, entries };
    }

    default:
      return state;
  }
}

// ─── Initial state (shown while Firestore loads) ──────────────────────

const initialState = {
  config: defaultConfig,
  teamMembers: defaultTeamMembers,
  entries: [],
};

// ─── Context ──────────────────────────────────────────────────────────

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [firestoreReady, setFirestoreReady] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // On mount: check if Firestore is empty and seed if needed, then subscribe
  useEffect(() => {
    let unsubWorkspace;
    let unsubEntries;
    let cancelled = false;

    async function init() {
      try {
        const exists = await workspaceExists();

        if (!exists && !cancelled) {
          setSeeding(true);
          await seedWorkspace(defaultConfig, defaultTeamMembers, historicalEntries);
          setSeeding(false);
        }

        if (cancelled) return;

        // Subscribe to real-time updates
        unsubWorkspace = subscribeToWorkspace((data) => {
          if (data) {
            dispatch({ type: '_SYNC_WORKSPACE', payload: data });
          }
        });

        unsubEntries = subscribeToEntries((entries) => {
          dispatch({ type: '_SYNC_ENTRIES', payload: entries });
        });

        // Give a brief moment for first snapshot to arrive
        setTimeout(() => {
          if (!cancelled) setFirestoreReady(true);
        }, 500);
      } catch (error) {
        console.error('Firestore init error:', error);
        // Fall back to showing default data
        if (!cancelled) setFirestoreReady(true);
      }
    }

    init();

    return () => {
      cancelled = true;
      if (unsubWorkspace) unsubWorkspace();
      if (unsubEntries) unsubEntries();
    };
  }, []);

  const value = { state, dispatch, firestoreReady, seeding };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export function useConfig() {
  const { state } = useStore();
  return state.config;
}

export function useTeamMembers() {
  const { state } = useStore();
  return state.teamMembers;
}

export function useEntries() {
  const { state } = useStore();
  return state.entries;
}

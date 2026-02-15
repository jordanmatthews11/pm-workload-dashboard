import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { defaultConfig, defaultTeamMembers, historicalEntries } from './initialData';

const STORAGE_KEY = 'pm-workload-data';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load state', e);
  }
  // Return default seeded state
  return {
    config: defaultConfig,
    teamMembers: defaultTeamMembers,
    entries: historicalEntries,
  };
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state', e);
  }
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function reducer(state, action) {
  switch (action.type) {
    // ---- CONFIG ----
    case 'ADD_METRIC': {
      const newMetric = {
        id: generateId(),
        name: action.payload.name,
        weight: action.payload.weight ?? 1,
      };
      return {
        ...state,
        config: {
          ...state.config,
          metrics: [...state.config.metrics, newMetric],
        },
      };
    }
    case 'UPDATE_METRIC': {
      return {
        ...state,
        config: {
          ...state.config,
          metrics: state.config.metrics.map((m) =>
            m.id === action.payload.id ? { ...m, ...action.payload.updates } : m
          ),
        },
      };
    }
    case 'REMOVE_METRIC': {
      return {
        ...state,
        config: {
          ...state.config,
          metrics: state.config.metrics.filter((m) => m.id !== action.payload.id),
        },
      };
    }
    case 'ADD_SUBJECTIVE_METRIC': {
      const newMetric = {
        id: generateId(),
        name: action.payload.name,
        weight: action.payload.weight ?? 1,
        min: action.payload.min ?? 1,
        max: action.payload.max ?? 5,
      };
      return {
        ...state,
        config: {
          ...state.config,
          subjectiveMetrics: [...state.config.subjectiveMetrics, newMetric],
        },
      };
    }
    case 'UPDATE_SUBJECTIVE_METRIC': {
      return {
        ...state,
        config: {
          ...state.config,
          subjectiveMetrics: state.config.subjectiveMetrics.map((m) =>
            m.id === action.payload.id ? { ...m, ...action.payload.updates } : m
          ),
        },
      };
    }
    case 'REMOVE_SUBJECTIVE_METRIC': {
      return {
        ...state,
        config: {
          ...state.config,
          subjectiveMetrics: state.config.subjectiveMetrics.filter(
            (m) => m.id !== action.payload.id
          ),
        },
      };
    }
    case 'UPDATE_LOAD_SCORE_WEIGHT': {
      return {
        ...state,
        config: { ...state.config, loadScoreWeight: action.payload },
      };
    }

    // ---- TEAM ----
    case 'ADD_TEAM_MEMBER': {
      if (state.teamMembers.includes(action.payload)) return state;
      return {
        ...state,
        teamMembers: [...state.teamMembers, action.payload],
      };
    }
    case 'REMOVE_TEAM_MEMBER': {
      return {
        ...state,
        teamMembers: state.teamMembers.filter((m) => m !== action.payload),
      };
    }

    // ---- ENTRIES ----
    case 'SAVE_ENTRY': {
      const { date, label, data } = action.payload;
      const existingIdx = state.entries.findIndex((e) => e.date === date);
      let newEntries;
      if (existingIdx >= 0) {
        newEntries = [...state.entries];
        newEntries[existingIdx] = { date, label, data };
      } else {
        newEntries = [...state.entries, { date, label, data }].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
      }
      return { ...state, entries: newEntries };
    }
    case 'DELETE_ENTRY': {
      return {
        ...state,
        entries: state.entries.filter((e) => e.date !== action.payload),
      };
    }

    // ---- RESET ----
    case 'RESET_ALL': {
      return {
        config: defaultConfig,
        teamMembers: defaultTeamMembers,
        entries: historicalEntries,
      };
    }
    case 'IMPORT_STATE': {
      return action.payload;
    }

    default:
      return state;
  }
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadState);

  // Persist on every change
  useEffect(() => {
    saveState(state);
  }, [state]);

  const value = { state, dispatch };

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

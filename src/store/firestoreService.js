import {
  doc,
  collection,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';

const WORKSPACE_DOC = 'main';
const WORKSPACE_COLLECTION = 'workspaces';
const ENTRIES_COLLECTION = 'entries';

// ──────────────────────────────────────────────
// References
// ──────────────────────────────────────────────

function workspaceRef() {
  return doc(db, WORKSPACE_COLLECTION, WORKSPACE_DOC);
}

function entriesCollectionRef() {
  return collection(db, WORKSPACE_COLLECTION, WORKSPACE_DOC, ENTRIES_COLLECTION);
}

function entryRef(date) {
  return doc(db, WORKSPACE_COLLECTION, WORKSPACE_DOC, ENTRIES_COLLECTION, date);
}

// ──────────────────────────────────────────────
// Real-time Subscriptions
// ──────────────────────────────────────────────

/**
 * Subscribe to the workspace document (config + teamMembers).
 * Returns an unsubscribe function.
 */
export function subscribeToWorkspace(callback) {
  return onSnapshot(workspaceRef(), (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Workspace subscription error:', error);
  });
}

/**
 * Subscribe to all entries (one document per week).
 * Returns an unsubscribe function.
 */
export function subscribeToEntries(callback) {
  return onSnapshot(entriesCollectionRef(), (snapshot) => {
    const entries = [];
    snapshot.forEach((doc) => {
      entries.push({ ...doc.data(), _id: doc.id });
    });
    // Sort by date ascending
    entries.sort((a, b) => a.date.localeCompare(b.date));
    callback(entries);
  }, (error) => {
    console.error('Entries subscription error:', error);
  });
}

// ──────────────────────────────────────────────
// Write Operations
// ──────────────────────────────────────────────

/**
 * Save workspace config (metrics, subjectiveMetrics, loadScoreWeight)
 */
export async function saveConfig(config) {
  await setDoc(workspaceRef(), { config }, { merge: true });
}

/**
 * Save team members list
 */
export async function saveTeamMembers(teamMembers) {
  await setDoc(workspaceRef(), { teamMembers }, { merge: true });
}

/**
 * Save or update a single weekly entry
 */
export async function saveEntry(entry) {
  const { date, label, data } = entry;
  await setDoc(entryRef(date), { date, label, data });
}

/**
 * Delete a weekly entry by date
 */
export async function deleteEntry(date) {
  await deleteDoc(entryRef(date));
}

// ──────────────────────────────────────────────
// Seeding / Bulk Operations
// ──────────────────────────────────────────────

/**
 * Check if the workspace exists in Firestore
 */
export async function workspaceExists() {
  const snapshot = await getDoc(workspaceRef());
  return snapshot.exists();
}

/**
 * Seed Firestore with initial data (config, teamMembers, entries).
 * Used on first load when the database is empty.
 */
export async function seedWorkspace(config, teamMembers, entries) {
  // Write workspace doc
  await setDoc(workspaceRef(), { config, teamMembers });

  // Write entries in batches (Firestore limit: 500 per batch)
  const batchSize = 400;
  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = writeBatch(db);
    const chunk = entries.slice(i, i + batchSize);
    chunk.forEach((entry) => {
      batch.set(entryRef(entry.date), {
        date: entry.date,
        label: entry.label,
        data: entry.data,
      });
    });
    await batch.commit();
  }
}

/**
 * Bulk import: replace workspace config + teamMembers and all entries
 */
export async function importAll(config, teamMembers, entries) {
  await seedWorkspace(config, teamMembers, entries);
}

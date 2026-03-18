const DB_NAME = 'ai-storytelling';
const DB_VERSION = 1;
const STORE_NAME = 'sessions';

export interface SessionData {
  storyId: string;
  nodeId: string;
  timestamp: number;
}

export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'storyId' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveSession(storyId: string, nodeId: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ storyId, nodeId, timestamp: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadSession(storyId: string): Promise<string | null> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(storyId);
      request.onsuccess = () => resolve(request.result?.nodeId ?? null);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error('Failed to load session from IndexedDB:', e);
    return null;
  }
}

export async function deleteSession(storyId: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(storyId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

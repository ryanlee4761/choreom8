import { openDB } from 'idb';

const DB_NAME = 'choreom8-library';
const STORE_NAME = 'uploads';

export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

// Save a file (as {id, name, type, data})
export async function saveFile({ name, type, file }) {
  const db = await getDB();
  return db.add(STORE_NAME, {
    name,
    type,
    data: file, // File or Blob object
    created: new Date(),
  });
}

// List all files
export async function getAllFiles() {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

// Remove file by id
export async function deleteFile(id) {
  const db = await getDB();
  return db.delete(STORE_NAME, id);
}
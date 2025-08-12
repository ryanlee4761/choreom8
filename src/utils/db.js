import Dexie from 'dexie';

export const db = new Dexie('choreom8-library');

db.version(1).stores({
  uploads: '++id,name,type',           // auto-incrementing id, name, type
  comments: '++id,fileId,timestamp,text' // auto-increment, indexed by fileId/timestamp/text
});

// ------- FILE CRUD -------

// Save a file (returns new file's id)
export async function saveFile({ name, type, file }) {
  return db.uploads.add({
    name,
    type,
    data: file,     // File or Blob object
    // No created property
  });
}

// Get all files
export async function getAllFiles() {
  return db.uploads.toArray();
}

// Get a single file by id (if you need it)
export async function getFile(id) {
  return db.uploads.get(id);
}

// Rename a file
export async function updateFileName(id, newName) {
  await db.uploads.update(id, {name: newName});
}

// Delete a file by id
export async function deleteFile(id) {
  // Optionally delete associated comments, too!
  await db.comments.where('fileId').equals(id).delete();
  return db.uploads.delete(id);
}

// ------- PER-FILE COMMENTS CRUD -------

// Add a comment for a file (returns comment's id)
export async function addComment({ fileId, timestamp, text }) {
  return db.comments.add({
    fileId,
    timestamp,
    text,
    // No created property
  });
}

// Get all comments for a file (sorted)
export async function getCommentsForFile(fileId) {
  return db.comments
    .where('fileId')
    .equals(fileId)
    .sortBy('timestamp');
}

// Edit (update) a comment's text
export async function editComment(id, newText) {
  return db.comments.update(id, { text: newText });
}

// Delete a comment by id
export async function deleteComment(id) {
  return db.comments.delete(id);
}

// (Optional) Get a single comment by id
export async function getComment(id) {
  return db.comments.get(id);
}

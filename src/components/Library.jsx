import { useState } from 'react';

export default function Library({ files, onPlay, onDelete, onRename }) {
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");

  function startEditing(file) {
    setEditingId(file.id);
    setNewName(file.name);
  }

  function saveEdit(id) {
    onRename(id, newName.trim());
    setEditingId(null);
  }

  return (
    <ul>
      {files.map((file) => (
        <li key={file.id} className="flex items-center mb-2">
          {editingId === file.id ? (
            <>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border px-1"
              />
              <button
                onClick={() => saveEdit(file.id)}
                className="ml-2 px-2 py-1 bg-green-600 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="ml-2 px-2 py-1 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <span className="mr-2">{file.name}</span>
              <button
                onClick={() => onPlay(file)}
                className="ml-2 px-2 py-1 bg-blue-600 text-white rounded"
              >
                Play
              </button>
              <button
                onClick={() => startEditing(file)}
                className="ml-2 px-2 py-1 bg-yellow-500 text-white rounded"
              >
                Rename
              </button>
              <button
                onClick={() => onDelete(file.id)}
                className="ml-2 px-2 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

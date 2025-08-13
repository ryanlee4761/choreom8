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

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (newName.trim()) saveEdit(editingId);
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setEditingId(false);
    }
  }

  return (
    <div className="divide-y divide-gray-300">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between py-2"
        >
          {/* File name or edit field */}
          <div className="flex-1 mr-4">
            {editingId === file.id ? (
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border px-2 py-1 w-full"
                onKeyDown={handleKeyDown}
              />
            ) : (
              <span>{file.name}</span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex-shrink-0 flex gap-2">
            {editingId === file.id ? (
              <>
                <button
                  onClick={() => saveEdit(file.id)}
                  className="px-2 py-1 bg-green-600 text-white rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-2 py-1 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onPlay(file)}
                  className="px-2 py-1 bg-blue-600 text-white rounded"
                >
                  Play
                </button>
                <button
                  onClick={() => startEditing(file)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Rename
                </button>
                <button
                  onClick={() => onDelete(file.id)}
                  className="px-2 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

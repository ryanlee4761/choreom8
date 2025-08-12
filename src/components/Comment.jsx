import React, { forwardRef } from "react";

function formatTimestamp(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    // pad single digit seconds with a leading zero
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

const Comment = forwardRef(function Comment(
    { comment, isActive, onSeek, onEdit, onDelete },
    ref
) {
    return (
        <div
            ref={ref}
            className={`p-2 my-2 flex items-center rounded group ${isActive ? "bg-yellow-200 font-bold" : "bg-white"
                }`}
        // Optionally, only seek if clicking timestamp:
        // onClick={onSeek}
        >
            <button
                className="text-xs text-gray-600 mr-2 underline hover:text-blue-700"
                onClick={e => {
                    e.stopPropagation();
                    onSeek();
                }}
                title="Jump to time"
                tabIndex={0}
            >
                {formatTimestamp(comment.timestamp)}
            </button>

            <span className="flex-1 text-gray-800 text-sm">{comment.text}</span>

            <button
                className="ml-2 px-1 text-xs text-green-600 hover:text-green-900 opacity-80 group-hover:opacity-100"
                title="Edit"
                onClick={e => {
                    e.stopPropagation();
                    if (onEdit) onEdit();
                }}
                tabIndex={0}
            >
                ✎
            </button>
            <button
                className="px-1 text-xs text-red-600 hover:text-red-900 opacity-80 group-hover:opacity-100"
                title="Delete"
                onClick={e => {
                    e.stopPropagation();
                    if (onDelete) onDelete();
                }}
                tabIndex={0}
            >
                🗑
            </button>
        </div>
    );
});

export default Comment;

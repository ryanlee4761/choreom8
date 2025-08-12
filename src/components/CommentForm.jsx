import { useState } from "react";

export default function CommentForm({ currentTime, onAddComment }) {
    const [text, setText] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        if (!text.trim()) return;

        // Pass the comment up (timestamp is current playback position)
        onAddComment({
            timestamp: currentTime,
            text: text.trim()
            // Add user info/date later if we want
        });

        setText("");
        // No need to reset timestamp since it's always from currentTime prop
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-3 items-center w-full">
            <input
                type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                className="flex-grow p-1 border rounded text-sm"
                placeholder="Add a comment…"
                maxLength={300}
                required
            />
            <button
                type="submit"
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
                Add
            </button>
        </form>
    );
}

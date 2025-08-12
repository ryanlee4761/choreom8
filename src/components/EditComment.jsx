// EditComment.jsx
import { useState, useRef, useEffect } from "react";

export default function EditComment({ initialText, onSave, onCancel }) {
    const [text, setText] = useState(initialText || "");
    const inputRef = useRef(null);

    // Autofocus the text input on mount
    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    // Optionally submit on Enter; Escape cancels
    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (text.trim()) onSave(text.trim());
        }
        if (e.key === "Escape") {
            e.preventDefault();
            onCancel();
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (text.trim()) onSave(text.trim());
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 mb-2"
        >
            <input
                ref={inputRef}
                className="flex-grow p-1 border rounded text-sm"
                type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={300}
                autoFocus
                aria-label="Edit comment"
            />
            <button
                className="bg-green-600 text-white px-2 py-1 rounded text-sm"
                type="submit"
                disabled={!text.trim()}
                title="Save"
            >
                Save
            </button>
            <button
                className="px-2 py-1 text-sm text-gray-700"
                type="button"
                onClick={onCancel}
                title="Cancel"
            >
                Cancel
            </button>
        </form>
    );
}

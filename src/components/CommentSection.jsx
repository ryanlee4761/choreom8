// CommentSection.jsx
import { useRef, useEffect, useState } from "react";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import EditComment from "./EditComment"; // re-usable inline edit form
import {
    getCommentsForFile,
    addComment,
    editComment,
    deleteComment,
} from "../utils/db"; // Your Dexie helpers

function formatTimestamp(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    // pad single digit seconds with a leading zero
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function CommentSection({ fileId, currentTime, onSeek }) {
    const refs = useRef({});
    const [comments, setComments] = useState([]);
    const [editingCommentId, setEditingCommentId] = useState(null);

    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    // 1. Load comments on mount or when fileId changes
    useEffect(() => {
        if (!fileId) return;
        getCommentsForFile(fileId).then(setComments);
    }, [fileId]);

    // 2. Add new comment
    async function handleAddComment({ timestamp, text }) {
        await addComment({ fileId, timestamp, text });
        setComments(await getCommentsForFile(fileId));
    }

    // 3. Edit (update) comment
    async function handleEditComment(commentId, newText) {
        await editComment(commentId, newText);
        setEditingCommentId(null);
        setComments(await getCommentsForFile(fileId));
    }

    // 4. Delete comment
    async function handleDeleteComment(commentId) {
        const confirm = window.confirm("Are you sure you want to delete this comment?");
        if (!confirm) return;
        await deleteComment(commentId);
        setComments(await getCommentsForFile(fileId));
    }

    // 5. Sorting for display
    const sortedComments = [...comments].sort((a, b) => a.timestamp - b.timestamp);

    // 6. Scroll active comment into view
    useEffect(() => {
        const active = sortedComments.find(
            c => Math.abs(c.timestamp - currentTime) < 1
        );
        if (active && refs.current[active.id]) {
            refs.current[active.id].scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [currentTime, sortedComments]);

    async function summarizeLLM({ sortedComments, setSummary, setError, setLoading }) {
        setLoading(true);
        setError(null);

        // Prepare comments string for API
        const commentsStr = sortedComments
            .map(c => `[${formatTimestamp(c.timestamp)}] ${c.text}`)
            .join('\n');

        try {
            const response = await fetch(
                'https://noggin.rea.gent/resulting-moth-4975',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer rg_v1_3dotipbx5430q6oswu2gmsx8eqvc71s6pooy_ngk',
                    },
                    body: JSON.stringify({
                        comments: commentsStr,                        // multi-line string
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("LLM summarization failed");
            }
            const summary = await response.text();
            setSummary(summary);
        } catch (err) {
            setError("Failed to summarize comments.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="overflow-y-auto max-h-64 mt-4 w-full border rounded p-3 bg-gray-50">
            {/* Add new comment form */}
            <CommentForm
                currentTime={currentTime}
                onAddComment={handleAddComment}
            />
            {/* Display comments */}
            {sortedComments.length === 0 && (
                <div className="text-gray-500 text-sm text-center py-4">No comments yet.</div>
            )}
            {sortedComments.map(comment =>
                editingCommentId === comment.id ? (
                    <EditComment
                        key={comment.id}
                        initialText={comment.text}
                        onSave={newText => handleEditComment(comment.id, newText)}
                        onCancel={() => setEditingCommentId(null)}
                    />
                ) : (
                    <Comment
                        key={comment.id}
                        ref={el => (refs.current[comment.id] = el)}
                        comment={comment}
                        isActive={Math.abs(comment.timestamp - currentTime) < 1}
                        onSeek={() => onSeek(comment.timestamp)}
                        onEdit={() => setEditingCommentId(comment.id)}
                        onDelete={() => handleDeleteComment(comment.id)}
                    />
                )
            )}
            <button
                onClick={() =>
                    summarizeLLM({
                        sortedComments,
                        setSummary,
                        setError,
                        setLoading
                    })
                }
                disabled={loading || sortedComments.length === 0}
            >
                {loading ? "Summarizing..." : "Summarize Comments"}
            </button>
            {summary && (
                <div className="my-2 p-2 border rounded bg-yellow-50 text-sm flex flex-row justify-between items-center">
                    <span>{summary}</span>
                    <button
                        className="ml-2 text-xs text-gray-600 hover:underline"
                        onClick={() => setSummary(null)}
                        title="Dismiss summary"
                    >✕</button>
                </div>
            )}

        </div>
    );
}

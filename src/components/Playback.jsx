import { useRef, useEffect, useState } from "react";

export default function Playback({ file, onBack }) {
    const mediaRef = useRef(null);                        // lets us control the media directly :)
    const [src, setSrc] = useState(null);                 // used to store the "object URL" for the file
    const [isPlaying, setIsPlaying] = useState(false);    // for the play + pause button

    // Generate and clean up a temporary object URL safely
    useEffect(() => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setSrc(objectUrl);
            setIsPlaying(false);

            // Clean up when the modal unmounts or file changes
            return () => {
                URL.revokeObjectURL(objectUrl);
                setSrc(null);
                setIsPlaying(false);
            };
        }
    }, [file]);

    // Sync the isPlaying state with actual media events
    useEffect(() => {
        const mediaElement = mediaRef.current;
        if (!mediaElement) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        mediaElement.addEventListener("play", handlePlay);
        mediaElement.addEventListener("pause", handlePause);

        return () => {
            mediaElement.removeEventListener("play", handlePlay);
            mediaElement.removeEventListener("pause", handlePause);
        };
    }, [src]);

    // Check that BOTH the file and the URL are valid just in case
    if (!file || !src) {
        return null;
    }

    // Checks whether the file is audio or video (used later in the UI)
    const isAudio = file.type.startsWith("audio");
    const isVideo = file.type.startsWith("video");

    function togglePlayPause() {
        if (!mediaRef.current) return;

        if (isPlaying) {
            mediaRef.current.pause();
        } else {
            mediaRef.current.play();
        }
        // Do not manually setIsPlaying here; let the events below handle sync for best accuracy.
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="relative bg-white p-6 rounded shadow-lg w-full max-w-2xl flex flex-col items-center">
                <button
                    onClick={onBack}
                    className="absolute top-4 left-4 px-3 py-1 bg-gray-800 text-white rounded text-lg"
                >
                    ← Back
                </button>
                <h2 className="text-xl font-bold mb-4 text-center">{file.name}</h2>
                {isAudio && (
                    <audio
                        ref={mediaRef}
                        controls
                        src={src}
                        className="mb-4 w-full"
                        preload="auto"
                    />
                )}
                {isVideo && (
                    <video
                        ref={mediaRef}
                        controls
                        src={src}
                        className="mb-4 w-full"
                        preload="auto"
                    />
                )}
                <div className="flex gap-4 mt-2">
                    <button
                        onClick={togglePlayPause}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        {isPlaying ? "⏸ Pause" : "▶ Play"}
                    </button>
                </div>
            </div>
        </div>
    );
}

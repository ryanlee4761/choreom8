import { useRef, useEffect, useState } from "react";

export default function Playback({ file, onBack }) {
    const mediaRef = useRef(null);                        // lets us control the media directly :)
    const [src, setSrc] = useState(null);                 // used to store the "object URL" for the file
    const [isPlaying, setIsPlaying] = useState(false);    // for the play + pause button
    const [loopStart, setLoopStart] = useState(null);
    const [loopEnd, setLoopEnd] = useState(null);
    // const [rate, setRate] = useState(1);
    const [isMirrored, setIsMirrored] = useState(false);
    // const [isCountingDown, setIsCountingDown] = useState(false);
    const [isLooping, setIsLooping] = useState(true);


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
        const media = mediaRef.current;
        if (!media) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        media.addEventListener("play", handlePlay);
        media.addEventListener("pause", handlePause);

        return () => {
            media.removeEventListener("play", handlePlay);
            media.removeEventListener("pause", handlePause);
        };
    }, [src]);

    useEffect(() => {
        const media = mediaRef.current;
        if (!media) return;

        function onTimeUpdate() {
            // Use the media duration for defaults
            const duration = media.duration;
            const start = loopStart ?? 0;
            const end = loopEnd ?? duration;

            if (media.currentTime < start) {
                media.currentTime = start;
            }
            if (media.currentTime >= end) {
                // If you want smooth looping after endpoint, also call play()
                if (isLooping && media.paused) {
                    media.currentTime = start;
                    media.play();
                } else { 
                    media.pause();
                };
            }
        }

        media.addEventListener('timeupdate', onTimeUpdate);
        return () => {
            media.removeEventListener('timeupdate', onTimeUpdate);
        };
    }, [src, loopStart, loopEnd, isLooping]);

    /* Check that BOTH the file and the URL are valid just in case. Sometimes, apparently
    the render cycle might be in the middle of making the URL, so this catches that case. */
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
        // Do not manually setIsPlaying here; let the events above handle sync for best accuracy.
    }

    function handleLoopStart() {
        if (loopStart === null) {
            setLoopStart(mediaRef.current?.currentTime ?? 0);
        } else {
            setLoopStart(null); // unset (defaults to the start of the file using logic later)
        }
    }
    function handleLoopEnd() {
        if (loopEnd === null) {
            setLoopEnd(mediaRef.current?.currentTime ?? 0);
        } else {
            setLoopEnd(null); // unset (defaults to the end of the file using logic later)
        }
    }
    function handleLoopingUpdate() {
        setIsLooping(!isLooping);
    }
    function handleMirroringUpdate() {
        setIsMirrored(!isMirrored);
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
                        style={{ transform: isMirrored ? 'scaleX(-1)' : 'scaleX(1)' }}
                    />
                )}
                <div className="flex gap-4 mt-2">
                    <button
                        onClick={togglePlayPause}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        {isPlaying ? "⏸ Pause" : "▶ Play"}
                    </button>
                    <button
                        onClick={handleLoopStart}
                        className={loopStart !== null
                            ? "bg-red-600 text-white px-4 py-2 rounded"
                            : "bg-green-600 text-white px-4 py-2 rounded"}
                    >
                        {loopStart !== null ? "Clear Loop Start" : "Set Loop Start"}
                    </button>
                    <button
                        onClick={handleLoopEnd}
                        className={loopEnd !== null
                            ? "bg-red-600 text-white px-4 py-2 rounded"
                            : "bg-green-600 text-white px-4 py-2 rounded"}
                    >
                        {loopEnd !== null ? "Clear Loop End" : "Set Loop End"}
                    </button>
                    <button 
                        onClick={handleLoopingUpdate}
                        className={isLooping
                            ? "bg-green-600 text-white px-4 py-2 rounded"
                            : "bg-red-600 text-white px-4 py-2 rounded"}
                    >
                        {isLooping ? "🔁" : <s>🔁</s>}
                    </button>
                    <button
                        onClick={handleMirroringUpdate}
                        className={isMirrored
                            ? "bg-red-600 text-white px-4 py-2 rounded"
                            : "bg-green-600 text-white px-4 py-2 rounded"}
                    >
                        🪞
                    </button>
                </div>
                {/* OPTIONAL: Show current loop points */}
                <div className="mt-4 text-gray-700 flex gap-8 text-sm">
                    <div>
                        <strong>Loop Start:</strong>{" "}
                        {loopStart !== null ? loopStart.toFixed(2) + "s" : "Not Set"}
                    </div>
                    <div>
                        <strong>Loop End:</strong>{" "}
                        {loopEnd !== null ? loopEnd.toFixed(2) + "s" : "Not Set"}
                    </div>
                    <div>
                        <strong>Looping:</strong>{" "}
                        {isLooping ? "Yes" : "No"}
                    </div>
                </div>
            </div>
        </div>
    );
}

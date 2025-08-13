import { useRef, useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
import Settings from "./Settings";
import SpeedModal from "./SpeedModal";
import CommentSection from "./CommentSection";

export default function Playback({ file, fileInfo, onBack }) {
    const mediaRef = useRef(null);                        // lets us control the media directly :)
    const [src, setSrc] = useState(null);                 // used to store the "object URL" for the file
    const [isPlaying, setIsPlaying] = useState(false);    // for the play + pause button
    const [loopStart, setLoopStart] = useState(null);
    const [loopEnd, setLoopEnd] = useState(null);
    const [isMirrored, setIsMirrored] = useState(false);
    const [isCountingDown, setIsCountingDown] = useState(false);
    const [isLooping, setIsLooping] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);

    const [playbackRate, setPlaybackRate] = useState(1);
    const [isSpeedModalOpen, setIsSpeedModalOpen] = useState(false);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [startCountDown, setStartCountDown] = useState(false);
    const [count, setCount] = useState(3);
    const countDownSeconds = 3;

    useEffect(() => {
        function handleEsc(e) {
            if (e.key === 'Escape') onBack();
        }
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

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

            if (media.currentTime <= start) {
                media.currentTime = start;
            }

            if (media.currentTime >= end) {
                // If you want smooth looping after endpoint, also call play()
                if (isLooping) {
                    media.currentTime = start;
                    media.play();
                } else {
                    media.pause();
                };
            }

            setCurrentTime(media.currentTime); // for the sake of comment syncing
        }

        media.addEventListener('timeupdate', onTimeUpdate);
        return () => {
            media.removeEventListener('timeupdate', onTimeUpdate);
        };
    }, [src, loopStart, loopEnd, isLooping]);

    useEffect(() => {
        const media = mediaRef.current;
        if (media) {
            media.playbackRate = playbackRate;
        }
    }, [playbackRate]);

    /* Check that BOTH the file and the URL are valid just in case. Sometimes, apparently
    the render cycle might be in the middle of making the URL, so this catches that case. */
    if (!file || !src) {
        return null;
    }

    // Checks whether the file is audio or video (used later in the UI)
    const isAudio = file.type.startsWith("audio");
    const isVideo = file.type.startsWith("video");

    const countDown = async () => {
        setStartCountDown(true);
        for (let i = countDownSeconds; i > 0; i--) {
            setCount(i);
            await new Promise(res => setTimeout(res, 1000));
        }
        setStartCountDown(false);
        setCount(countDownSeconds);
    };

    async function togglePlayPause() {
        const media = mediaRef.current;
        if (!media) return;

        const start = loopStart ?? 0;
        const duration = media.duration || 0;
        const end = loopEnd ?? duration;

        if (isPlaying) {
            media.pause();
        } else {
            // If NOT looping, and at (or after) end, reset to loop start on play
            if (
                !isLooping &&                   // Loop toggle is off
                (Math.abs(media.currentTime - end) < 0.1 || media.currentTime >= end)
            ) {
                media.currentTime = start;      // Rewind to the start breakpoint (or 0)
            }
            if (isCountingDown) {
                await countDown();
            }
            media.play();
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div
                className="relative bg-white p-6 rounded shadow-lg w-full max-w-2xl flex flex-col items-center
                h-[90vh] max-h-[90vh]"
                style={{
                    maxHeight: "90vh",
                    width: "100%",
                    maxWidth: "1200px",
                }}
            >
                <button
                    onClick={onBack}
                    className="absolute top-4 left-4 px-3 py-1 bg-gray-800 text-white rounded text-lg"
                >
                    ← Back
                </button>

                <h2 className="text-xl font-bold mb-4 text-center">{file.name}</h2>

                <div className="flex flex-col md:flex-row flex-1 w-full gap-8">
                    <div className="flex-1 flex flex-col items-center">

                        {/* Media element at top, with large margin for stacking separation */}
                        {isAudio && (
                            <audio
                                ref={mediaRef}
                                src={src}
                                preload="auto"
                            />
                        )}
                        {isVideo && (
                            <video
                                ref={mediaRef}
                                src={src}
                                className="mb-4 w-full flex-1 object-contain rounded max-w-[800px] max-h-[40vh]"
                                preload="auto"
                                style={{ transform: isMirrored ? 'scaleX(-1)' : 'scaleX(1)' }}
                            />
                        )}

                        {/* ---- Progres Bar ---- */}
                        <ProgressBar
                            currentTime={currentTime}
                            duration={mediaRef.current?.duration || 0}
                            loopStart={loopStart}
                            loopEnd={loopEnd}
                            onSeek={ts => { mediaRef.current.currentTime = ts; }}
                        />

                        {/* --- Controls row below ProgressBar --- */}
                        <div className="flex gap-4 mt-8 items-center justify-center flex-wrap">
                            <button
                                onClick={handleLoopStart}
                                className={loopStart !== null
                                    ? "bg-red-600 text-white px-4 py-2 rounded"
                                    : "bg-green-600 text-white px-4 py-2 rounded"}
                            >
                                {loopStart !== null ? "Reset Start" : "Set Start"}
                            </button>
                            <button
                                onClick={handleLoopEnd}
                                className={loopEnd !== null
                                    ? "bg-red-600 text-white px-4 py-2 rounded"
                                    : "bg-green-600 text-white px-4 py-2 rounded"}
                            >
                                {loopEnd !== null ? "Reset End" : "Set End"}
                            </button>
                            <button
                                onClick={togglePlayPause}
                                className={`
                                    bg-blue-600 text-white rounded-full
                                    w-20 h-20 flex items-center justify-center
                                    text-4xl shadow-lg transition
                                    hover:bg-blue-700 focus:outline-none
                                    `}
                                aria-label={isPlaying ? "Pause" : "Play"}
                            >
                                {isPlaying ? (
                                    // Pause Icon (SVG)
                                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                                        <rect x="8" y="8" width="6" height="20" fill="currentColor" />
                                        <rect x="22" y="8" width="6" height="20" fill="currentColor" />
                                    </svg>
                                ) : (
                                    // Play Icon (SVG)
                                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                                        <polygon points="10,8 30,18 10,28" fill="currentColor" />
                                    </svg>
                                )}
                            </button>
                            <button
                                onClick={() => setIsSpeedModalOpen(true)}
                                className="bg-purple-600 text-white px-4 py-2 rounded"
                            >
                                Speed:&nbsp;<span className="font-bold">{playbackRate.toFixed(2)}x</span>
                            </button>
                            <button
                                onClick={() => setIsSettingsOpen(true)}
                                className="bg-gray-600 text-white px-4 py-2 rounded"
                            >
                                ⚙️
                            </button>
                        </div>

                        {/* --- Modals and extra UI --- */}

                        {isSettingsOpen && (
                            <Settings
                                onClose={() => setIsSettingsOpen(false)}
                                isLooping={isLooping}
                                setIsLooping={setIsLooping}
                                isMirrored={isMirrored}
                                setIsMirrored={setIsMirrored}
                                isCountingDown={isCountingDown}
                                setIsCountingDown={setIsCountingDown}
                            />
                        )}

                        {isSpeedModalOpen && (
                            <SpeedModal
                                playbackRate={playbackRate}
                                setPlaybackRate={setPlaybackRate}
                                onClose={() => setIsSpeedModalOpen(false)}
                            />
                        )}

                    </div>

                    <div className="w-full md:w-80 flex-shrink-0 overflow-auto">
                        <CommentSection
                            fileId={fileInfo.id}
                            currentTime={currentTime}
                            onSeek={ts => mediaRef.current.currentTime = ts}
                        />
                    </div>

                    {isCountingDown && startCountDown && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                            <div className="text-white text-5xl font-bold">{count}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}

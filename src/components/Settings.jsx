// PlaybackSettingsModal.jsx
export default function Settings({
    onClose,
    isLooping, setIsLooping,
    isMirrored, setIsMirrored,
    // isCountingDown, setIsCountingDown, // Add when ready
}) {
    function handleContentClick(e) {
        e.stopPropagation();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div className="bg-white p-6 rounded shadow-lg min-w-[300px] relative"
                onClick={handleContentClick}
            >
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-black"
                    onClick={onClose}
                >✕</button>
                <h2 className="text-lg font-bold mb-4">Playback Settings</h2>

                <div className="mb-3 flex items-center justify-between">
                    <span>Looping:</span>
                    <button
                        className={`px-3 py-1 rounded ${isLooping ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        onClick={() => setIsLooping(!isLooping)}
                    >{isLooping ? "On" : "Off"}</button>
                </div>
                <div className="mb-3 flex items-center justify-between">
                    <span>Mirror Video:</span>
                    <button
                        className={`px-3 py-1 rounded ${isMirrored ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        onClick={() => setIsMirrored(!isMirrored)}
                    >{isMirrored ? "On" : "Off"}</button>
                </div>
                {/* Later, add Timer Toggle here */}
            </div>
        </div>
    );
}

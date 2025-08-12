export default function SpeedModal({
    playbackRate, setPlaybackRate,
    onClose
}) {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-60"
            onClick={e => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white p-6 rounded shadow-lg min-w-[300px] flex flex-col items-center">
                <h3 className="text-lg font-bold mb-4">Change Playback Speed</h3>
                <div className="w-full flex flex-col items-center mb-6">
                    <input
                        type="range"
                        min="0.25"
                        max="1.75"
                        step="0.05"
                        value={playbackRate}
                        onChange={e => setPlaybackRate(Number(e.target.value))}
                        className="w-52 mb-2"
                    />
                    <span className="text-2xl font-bold text-purple-700">{playbackRate.toFixed(2)}x</span>
                </div>
                <button
                    onClick={() => setPlaybackRate(1)}
                    className="bg-gray-600 text-white px-4 py-2 rounded mb-3"
                >
                    Reset to 1x
                </button>
                <button
                    onClick={onClose}
                    className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                    Close
                </button>
            </div>
        </div>
    );
}

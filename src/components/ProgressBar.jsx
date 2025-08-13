export default function ProgressBar({
    currentTime,
    duration,
    loopStart,
    loopEnd,
    onSeek,
}) {
    // Guards
    const normStart = Math.min(loopStart ?? 0, duration);
    const normEnd = Math.max(normStart, Math.min(loopEnd ?? duration, duration));

    // Percentages
    const loopStartPercent = duration ? (normStart / duration) * 100 : 0;
    const loopEndPercent = duration ? (normEnd / duration) * 100 : 100;

    // Progress within loop
    const progressEnd =
        duration
            ? Math.max(loopStartPercent,
                Math.min((currentTime / duration) * 100, loopEndPercent)
            )
            : 0;

    function handleBarClick(e) {
        if (!onSeek || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;

        console.log("Progress Bar clicked");
        // Clamp seeking to loop region if desired (optional UX)
        const rawTime = percent * duration;
        if (rawTime < normStart) onSeek(normStart);
        else if (rawTime > normEnd) onSeek(normEnd);
        else onSeek(rawTime);
    }

    return (
        <div
            className="relative h-10 w-full mt-4 rounded cursor-pointer flex-shrink-0"
            style={{ minWidth: 180, maxWidth: 850 }}
            onClick={handleBarClick}
        >
            {/* Light/translucent bar for entire duration */}
            <div className="absolute h-10 w-full rounded bg-blue-200 pointer-events-none" style={{ opacity: 0.5 }} />

            {/* Highlighted region: ONLY between breakpoints */}
            <div
                className="absolute h-10 rounded bg-blue-600 pointer-events-none"
                style={{
                    left: `${loopStartPercent}%`,
                    width: `${progressEnd - loopStartPercent}%`, // only fills from start to played position, clamped to loopEnd
                    transition: "width 0.1s linear",
                }}
            />

            {/* Loop start marker */}
            <div
                className="absolute top-0 h-10 w-1 bg-red-700 pointer-events-none"
                style={{
                    left: `calc(${loopStartPercent}% - 2px)`,
                }}
                title={`Loop Start (${normStart.toFixed(2)}s)`}
            />

            {/* Loop end marker */}
            <div
                className="absolute top-0 h-10 w-1 bg-red-700 pointer-events-none"
                style={{
                    left: `calc(${loopEndPercent}% - 2px)`,
                }}
                title={`Loop End (${normEnd.toFixed(2)}s)`}
            />

            {/* Current position marker (optional) */}
            <div
                className="absolute top-0 h-10 w-3 bg-black rounded-full pointer-events-none"
                style={{
                    left: `calc(${progressEnd}% - 6px)`,
                }}
            />
        </div>
    );
}

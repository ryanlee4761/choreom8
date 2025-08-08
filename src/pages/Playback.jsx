import React, { useState, useRef, useEffect } from 'react';

export default function Playback() {
    const [buttonText, setButtonText] = useState('Play'); 
    const [rate, setRate] = useState(1);
    const [isMirrored, setIsMirrored] = useState(false);
    const [isCountingDown, setIsCountingDown] = useState(false);
    const [count, setCount] = useState(3);
    const [error, setError] = useState('');

    const videoRef = useRef(null);
    const countDownSeconds = 3;

    // have database folder for videos

    useEffect(() => {
        const handlePlay = () => {
            setButtonText("Pause");
        };
        const handlePause = () => {
            setButtonText("Play");
        };
        const handleLoaded = () => {
            videoRef.current.PlaybackRate = rate;
        }

        // Add event listener to the referenced element
        if (videoRef.current) {
            videoRef.current.addEventListener('play', handlePlay);
            videoRef.current.addEventListener('pause', handlePause);
            videoRef.current.addEventListener('loadedmetadata', handleLoaded);
            videoRef.current.PlaybackRate = rate;
        }

        // Clean up the event listener when the component unmounts
        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener('play', handlePlay);
                videoRef.current.removeEventListener('pause', handlePause);
                videoRef.current.removeEventListener('loadedmetadata', handleLoaded);

            }
        };
    }, []);

    useEffect(() => {
       if (videoRef.current) {
        videoRef.current.Playback = rate;
       } 
    }, [rate]);

    const playPause = () => {    
        if (videoRef.current.paused) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
            self.innerHTML = "Play";
        }
    }

    const countDown = async () => {
        if (!videoRef.current) return;
        setError('');
        setIsCountingDown(true);
        for (let i = countDownSeconds; i>0; i--) {
            setCount(i);
            await new Promise(res => setTimeout(res,1000));
        }
        setIsCountingDown(false);
        try {await videoRef.current.play();}
        catch {setError('Autoplay blocked. Tap play');}
    };

    return (
        <div>
            <h1 className="text-3xl font-bold">Playback</h1>
            <div className="flex items-center gap-2 my-2">
                <label className="text-sm">Speed</label>
                <select className="border rounded px-2 py-1 text-sm" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))}>
                {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].map(r => (
                    <option key={r} value={r}>{r}x</option>
                ))}
                </select>

                <button type="button" onClick={() => setIsMirrored(s => !s)} className="bg-gray-100 hover:bg-gray-200 text-black font-semibold py-1 px-3 rounded"> {isMirrored ? 'Unmirror' : 'Mirror'} </button>
                <button type="button" onClick={countDown} className="bg-slate-100 hover:bg-slate-200 text-black font-semibold py-2 px-3 rounded"> Start (3-2-1) </button>
            
            </div>
                
            <video ref={videoRef} src="src/assets/katseye.mp4" width="200px" id="playbackvid" style={{transform: isMirrored ? 'scaleX(-1)' : 'scaleX(1)' }} controls>video here</video>
            <button type="submit" value="submit" id="playpause" onClick={playPause} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{buttonText}</button>
            {isCountingDown && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <div className="text-white text-5xl font-bold">{count}</div>
                </div>
            )}
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            <p>variable src video file? need to make some way for users to upload :/</p>
            <p>Add buttons for stuff!</p>
        </div>
    );
}

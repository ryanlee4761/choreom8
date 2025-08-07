import React, { useState, useRef, useEffect } from 'react';

export default function Playback() {
    const [buttonText, setButtonText] = useState('Play'); 
    const videoRef = useRef(null);

    // have database folder for videos

    useEffect(() => {
        const handlePlay = () => {
            setButtonText("Pause");
        };
        const handlePause = () => {
            setButtonText("Play");
        };

        // Add event listener to the referenced element
        if (videoRef.current) {
            videoRef.current.addEventListener('play', handlePlay);
            videoRef.current.addEventListener('pause', handlePause);
        }

        // Clean up the event listener when the component unmounts
        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener('play', handlePlay);
                videoRef.current.removeEventListener('pause', handlePause);
            }
        };
    }, []);

    const playPause = () => {    
        if (videoRef.current.paused) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
            self.innerHTML = "Play";
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold">Playback</h1>

            <video ref={videoRef} src="src/assets/katseye.mp4" width="200px" id="playbackvid" controls>video here</video>
            <button type="submit" value="submit" id="playpause" onClick={playPause} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{buttonText}</button>

            <p>variable src video file? need to make some way for users to upload :/</p>
            <p>Add buttons for stuff!</p>
        </div>
    );
}

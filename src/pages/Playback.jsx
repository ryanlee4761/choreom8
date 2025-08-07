import React, { useState, useRef, useEffect } from 'react';

export default function Playback() {
    const [playButtonText, setplayButtonText] = useState('Play');

    const videoRef = useRef(null);

    // have database folder for videos
    const updatePlayText = () => {
        if (videoRef.current.paused) {
            setplayButtonText("Play");
        } else {
            setplayButtonText("Pause");
        }
    }
    const togglePlay = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setplayButtonText("Play");
        } else {
            videoRef.current.pause();
            setplayButtonText("Pause");
        }
    };

    // update button text when video controls are used
    useEffect(() => {
        // Add event listener to the referenced element
        if (videoRef.current) {
            videoRef.current.addEventListener("click", updatePlayText);
            videoRef.current.addEventListener('play', updatePlayText);
            videoRef.current.addEventListener('pause', updatePlayText);
        }

        // Clean up the event listener when the component unmounts
        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener('play', updatePlayText); 
                videoRef.current.removeEventListener('play', updatePlayText);
                videoRef.current.removeEventListener('pause', updatePlayText);
            }
        };
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold">Playback</h1>

            <video ref={videoRef} src="src/assets/katseye.mp4" width="200px" id="playbackvid" controls>video here</video>
            <button type="submit" value="submit" id="playpause" onClick={togglePlay} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{playButtonText}</button>

            {/* <button type="submit" value="submit" id="togglestart" onClick={} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{buttonText}</button> */}

            <p>variable src video file? need to make some way for users to upload :/</p>
            <p>Add buttons for stuff!</p>
        </div>
    );
}

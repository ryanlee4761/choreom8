import React, { useState, useRef, useEffect } from 'react';

// have database folder for videos
export default function Playback() {
    const [PlayButtonText, setPlayButtonText] = useState('Play');
    // const [Start, setStart] = useState(0);
    // const [End, setEnd] = useState(5);
    // const [Looping, setLooping] = useState(false);
    const [VideoTime, setVideoTime] = useState(0);

    const videoRef = useRef(null);
    const EndRef = useRef(-1);
    const StartRef = useRef(0);
    const LoopRef = useRef(false);

    // change play/pause button text whenever the video updates
    const updatePlayText = () => {
        if (videoRef.current.paused) {
            setPlayButtonText("Play");
        } else {
            setPlayButtonText("Pause");
        }
    };

    // play/pause video when button clicked
    const togglePlay = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
        updatePlayText();
    };

    // update button text when video controls are used
    // add event listener for looping
    useEffect(() => {
        // Add event listener to the referenced element
        const handleTimeUpdate = () => {
            const currentTime = videoRef.current.currentTime;
            setVideoTime(currentTime);

            if (EndRef.current != -1 && currentTime >= EndRef.current - 0.10 && !videoRef.current.paused) {  // 0.05s = 50ms margin
                if (LoopRef.current) {
                    videoRef.current.currentTime = StartRef.current;
                } else {
                    videoRef.current.pause();
                    videoRef.current.currentTime = EndRef.current;
                }
            }
        }

        if (videoRef.current) {
            videoRef.current.addEventListener('click', updatePlayText);
            videoRef.current.addEventListener('play', updatePlayText);
            videoRef.current.addEventListener('pause', updatePlayText);
            videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
        }

        // Clean up the event listener when the component unmounts
        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener('click', updatePlayText);
                videoRef.current.removeEventListener('play', updatePlayText); 
                videoRef.current.removeEventListener('pause', updatePlayText);
                videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
            }
        };
    }, [VideoTime, EndRef, StartRef, LoopRef]);

    // add an start/end point to the video on button click
    const toggleStart = () => {
        StartRef.current = videoRef.current.currentTime;
    }
    const toggleEnd = () => {
        // setEnd(videoRef.current.currentTime);
        EndRef.current = videoRef.current.currentTime;
    };

    // toggle looping
    const toggleLoop = () => {
        LoopRef.current = !LoopRef.current;
    }


    return (
        <div>
            <h1 className="text-3xl font-bold">Playback</h1>

            <video ref={videoRef} src="src/assets/katseye.mp4" width="200px" id="playbackvid" controls>video here</video>
            <button type="submit" value="submit" id="playpause" onClick={togglePlay} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{PlayButtonText}</button>
            <button type="submit" value="submit" id="togglestart" onClick={toggleStart} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add start</button>
            <button type="submit" value="submit" id="toggleend" onClick={toggleEnd} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add end</button>
            <button type="submit" value="submit" id="toggleloop" onClick={toggleLoop} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Toggle Loop</button>

            <p>variable src video file? need to make some way for users to upload :/</p>    

            <h2 className="text-2xl mb-4 mt-6">Status of video playback!</h2>
            <p>Start of Video: {StartRef.current}</p>
            <p>End of Video: {EndRef.current}</p>
            <p>Looping?: {LoopRef.current ? "yes" : "no"}</p>
            <p>Current Time: {VideoTime}</p>
        </div>
    );
}

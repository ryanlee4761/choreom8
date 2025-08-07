import React, { useState } from 'react';

export default function Playback() {
    const [buttonText, setButtonText] = useState('Play'); 
    var video = document.getElementById("playbackvid");
    // have database folder for videos
    video.addEventListener("play", () => {
        setButtonText("Pause");
    })
    video.addEventListener("pause", () => {
        setButtonText("Play");
    })

    const playPause = () => {    
        if (video.paused) {
            video.play();
        } else {
            video.pause();
            self.innerHTML = "Play";
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold">Playback</h1>

            <video src="src/assets/katseye.mp4" width="200px" id="playbackvid" controls>video here</video>
            <button type="submit" value="submit" id="playpause" onClick={playPause} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{buttonText}</button>

            <p>variable src video file? need to make some way for users to upload :/</p>
            <p>Add buttons for stuff!</p>
        </div>
    );
}

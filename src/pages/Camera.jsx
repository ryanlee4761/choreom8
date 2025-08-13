import React, { useRef, useState } from "react";
import Settings from "../components/Settings";

export default function WebcamRecorder() {
    const previewRef = useRef(null);
    const recordedRef = useRef(null);

    const [stream, setStream] = useState(null);
    const [recorder, setRecorder] = useState(null);
    const [status, setStatus] = useState("Not recording");
    const [includeAudio, setIncludeAudio] = useState(true);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [isRecording, setisRecording] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isMirrored, setIsMirrored] = useState(false);
    const [isCountingDown, setIsCountingDown] = useState(false);
    const [isLooping, setIsLooping] = useState(true);
    const [startCountDown, setStartCountDown] = useState(false);
    const [count, setCount] = useState(3);
    const countDownSeconds = 3;


    const chunksRef = useRef([]);

    const startCamera = async () => {
        try {
            const constraints = {
                video: { width: 1280, height: 720 },
                audio: includeAudio,
            };
            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            previewRef.current.srcObject = mediaStream;
            setStream(mediaStream);
            setStatus("Camera started — ready to record");
        } catch (err) {
            console.error("getUserMedia error", err);
            setStatus("Error: " + err.message);
        }
    };

    const countDown = async () => {
        setStartCountDown(true);
        for (let i = countDownSeconds; i > 0; i--) {
            setCount(i);
            await new Promise(res => setTimeout(res, 1000));
        }
        setStartCountDown(false);
        setCount(countDownSeconds);
    };

    const toggleRecording = () => {
            if (!isRecording) {
                startRecording();
            } else {
                stopRecording();
            }
            setisRecording(!isRecording);
        }

    const startRecording = async () => {
        if (!stream) {
            alert("Start camera first");
            return;
        }
        chunksRef.current = []; // reset chunks

        let options = {};
        if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
            options.mimeType = "video/webm;codecs=vp9";
        } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
            options.mimeType = "video/webm;codecs=vp8";
        } else if (MediaRecorder.isTypeSupported("video/webm")) {
            options.mimeType = "video/webm";
        }

        try {
            const mediaRecorder = new MediaRecorder(stream, options);

            mediaRecorder.ondataavailable = (e) => {
                if (e.data && e.data.size) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstart = () => {
                setStatus("Recording...");
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, {
                    type: chunksRef.current[0]?.type || "video/webm",
                });
                setRecordedBlob(blob);
                recordedRef.current.src = URL.createObjectURL(blob);
                setStatus("Recording stopped — preview ready");
            };
            
            if (isCountingDown) {
                await countDown();
            }
            mediaRecorder.start();
            setRecorder(mediaRecorder);
        } catch (e) {
            console.error("MediaRecorder creation failed:", e);
            setStatus("Recording not supported: " + e.message);
        }
    };

    const stopRecording = () => {
        if (recorder && recorder.state !== "inactive") {
            recorder.stop();
        }
    };

    const downloadRecording = () => {
        if (!recordedBlob) return;
        const a = document.createElement("a");
        const filename =
            "recording_" + new Date().toISOString().replace(/[:.]/g, "-") + ".webm";
        a.href = URL.createObjectURL(recordedBlob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    const addDraft = () => {
        alert("This will be implemented later!");
    }

    const toggleAudio = () => {
        setIncludeAudio((prev) => !prev);
        if (stream) {
            stream.getTracks().forEach((t) => t.stop());
            setStream(null);
            previewRef.current.srcObject = null;
            setStatus(
                "Camera stopped. Click 'Start Camera' to restart with new settings."
            );
        }
    };

    return (
        <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
            {/* Live Preview */}
            <div>
                <h3>Live preview</h3>
                <video ref={previewRef} autoPlay playsInline muted style={{
                    ...videoStyle, // keep your existing video styles
                    transform: isMirrored ? 'scaleX(-1)' : 'scaleX(1)',
                }} />
                <div>
                    <small>{status}</small>
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button className="px-4 py-2 bg-green-600 text-white rounded mb-4" onClick={startCamera}>Start Camera</button>
                {isRecording 
                    ? <button className="px-4 py-2 bg-red-600 text-white rounded mb-4" onClick={toggleRecording} disabled={!stream}>
                        Stop Recording
                    </button>
                    : <button className="px-4 py-2 bg-green-600 text-white rounded mb-4" onClick={toggleRecording} disabled={!stream}>
                        Start Recording
                    </button>
                }
                <button className="px-4 py-2 bg-green-600 text-white rounded mb-4" onClick={downloadRecording} disabled={!recordedBlob}>
                    Download
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded mb-4" onClick={addDraft} disabled={!recordedBlob}>
                    Add to Drafts
                </button>

                <label>
                    <input
                        type="checkbox"
                        checked={includeAudio}
                        onChange={toggleAudio}
                    />{" "}
                    Include audio
                </label>
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="bg-gray-600 text-white px-4 py-2 rounded"
                >
                    ⚙️
                </button>

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
            </div>

            <div>
                <h3>Recorded</h3>
                <video ref={recordedRef} controls style={videoStyle} />
            </div>
            {isCountingDown && startCountDown && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <div className="text-white text-5xl font-bold">{count}</div>
                </div>
            )}
        </div>
    );
}

const videoStyle = {
    border: "1px solid #ddd",
    borderRadius: "6px",
    maxWidth: "480px",
    width: "100%",
    height: "auto",
    background: "#000",
};

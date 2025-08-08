import { useState, useEffect, useRef } from "react";
import Library from "../components/Library";
import Playback from "../components/Playback";
import { saveFile, getAllFiles } from "../utils/db"

export default function Uploads() {
    const [files, setFiles] = useState([]); // makes an empty array called "files" to add files to later
    const [isPlaybackOpen, setIsPlaybackOpen] = useState(false);
    const [currentFile, setCurrentFile] = useState(null);
    const uploadButton = useRef(null);

    // Load files on mount
    useEffect(() => {
        getAllFiles().then(setFiles);
    }, []);

    async function handleUpload(event) {
        const uploadedFiles = Array.from(event.target.files);
        for (const file of uploadedFiles) {
            await saveFile({ name: file.name, type: file.type, file });
        }
        const updated = await getAllFiles();
        setFiles(updated);
    }

    // Handler for "Play" button, passed to Library (and then File)
    function handlePlay(file) {
        setCurrentFile(file);
        setIsPlaybackOpen(true);
    }

    function handleClosePlayback() {
        setIsPlaybackOpen(false);
        setCurrentFile(null);
    }

    function handleUploadClick() {
        uploadButton.current.click();
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Uploads</h1>

            <input
                type="file"
                accept=".mp3,.wav,.aac,.flac,.m4a,.ogg,.wma,.aiff,.mp4,
                        .mov,.avi,.wmv,.mkv,.webm,.mpeg,.mpg"
                multiple
                onChange={handleUpload}
                ref={uploadButton}
                style={{ display: "none" }}
            />

            <button
                type="button"
                onClick={handleUploadClick}
                className="px-4 py-2 bg-green-600 text-white rounded mb-4"
            >
                + Import
            </button>

            <Library files={files} onPlay={handlePlay} />

            {isPlaybackOpen && currentFile && (
                <Playback file={currentFile.data} fileInfo={currentFile} onBack={handleClosePlayback} />
            )}
        </div>
    );
}

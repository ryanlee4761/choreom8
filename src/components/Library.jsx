export default function Library({ files, onPlay }) {
  return (
    <ul>
      {files.map((file, idx) => (
        <li key={file.name + idx} className="flex items-center mb-2">
          <span className="mr-2">{file.name}</span>
          <button 
            onClick={() => onPlay(file)} 
            className="ml-2 px-2 py-1 bg-blue-600 text-white rounded"
          >
            Play
          </button>
        </li>
      ))}
    </ul>
  );
}
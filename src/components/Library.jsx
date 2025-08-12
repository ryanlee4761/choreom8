export default function Library({ files, onPlay, onDelete }) {
  return (
    <ul>
      {files.map((file) => (
        <li key={file.id} className="flex items-center mb-2">
          <span className="mr-2">{file.name}</span>
          <button
            onClick={() => onPlay(file)}
            className="ml-2 px-2 py-1 bg-blue-600 text-white rounded"
          >
            Play
          </button>
          <button
            onClick={() => onDelete(file.id)}
            className="ml-2 px-2 py-1 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function File({ file, onPlay }) {
  return (
    <li className="flex items-center mb-2">
      <span className="mr-2">{file.name}</span>
      <button onClick={() => onPlay(file)} className="ml-2 px-2 py-1 bg-blue-600 text-white rounded">
        Play
      </button>
    </li>
  );
}
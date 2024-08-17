import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import PlusIcon from "../assets/plus_icon.png";

interface AIProps {
  addNote: () => void;
  activeNoteContent: string;
  handleChange: (content: string) => void;
}

const AI: React.FC<AIProps> = ({ addNote, activeNoteContent, handleChange }) => {
  return (
    <div className="flex w-full">
      <div className="w-1/3 bg-gray-100 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">SmApps</h2>
          <button
            className="flex items-center bg-blue-500 text-white px-3 py-2 rounded"
            onClick={addNote}
          >
            <img src={PlusIcon} alt="Add New Note Icon" className="w-4 h-4 mr-2" />
            New
          </button>
        </div>
        <div>
          <p>No SmApps available</p>
        </div>
      </div>
      <div className="w-2/3 p-4">
        <div className="flex justify-end mb-2">
          <select className="border border-gray-300 rounded p-2">
            <option value="all">Apply to all Notes</option>
            <option value="selected">Apply to selected Notes</option>
          </select>
        </div>
        <ReactQuill
          value={activeNoteContent}
          onChange={handleChange}
          placeholder="AI interaction will be here..."
          className="h-full"
        />
      </div>
    </div>
  );
};

export default AI;

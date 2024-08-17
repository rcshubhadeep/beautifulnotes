import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import PlusIcon from "../assets/plus_icon.png";
import DeleteIcon from "../assets/delete_icon.png";
import { useState } from "react";

interface NotesProps {
  notes: Array<Record<string, string>>;
  activeNote: number;
  setActiveNote: (index: number) => void;
  setActiveNoteContent: (content: string) => void;
  addNote: () => void;
  deleteNote: (index: number) => void;
  handleChange: (content: string) => void;
  activeNoteContent: string;
  setActiveNoteData: (index: number) => void;
}

const Notes: React.FC<NotesProps> = ({
  notes,
  activeNote,
  setActiveNote,
  setActiveNoteContent,
  addNote,
  deleteNote,
  handleChange,
  activeNoteContent,
  setActiveNoteData,
}) => {
  return (
    <div className="flex w-full">
      <div className="w-1/3 bg-gray-100 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My Notes</h2>
          <button
            className="flex items-center bg-blue-500 text-white px-3 py-2 rounded"
            onClick={addNote}
          >
            <img src={PlusIcon} alt="Add New Note Icon" className="w-4 h-4 mr-2" />
            New
          </button>
        </div>
        <div>
          {notes.map((item, index) => (
            <div
              key={`${item.title}_${index}`}
              className={`flex justify-between items-center p-2 cursor-pointer rounded ${
                index === activeNote ? "bg-blue-100" : "bg-white"
              } hover:bg-gray-200`}
              onClick={() => setActiveNoteData(index)}
            >
              <div>
                <p className="font-semibold">{item.title || "Untitled"}</p>
                <p className="text-sm text-gray-600">{item.created_at}</p>
              </div>
              <img
                src={DeleteIcon}
                alt="Delete Note Icon"
                className="w-4 h-4 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(index);
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="w-2/3 p-4">
        <p className="text-sm text-gray-600 mb-2">{notes[activeNote]?.created_at}</p>
        <ReactQuill
          value={activeNoteContent}
          onChange={handleChange}
          placeholder="Write Your Note Here"
          className="h-full"
        />
      </div>
    </div>
  );
};

export default Notes;

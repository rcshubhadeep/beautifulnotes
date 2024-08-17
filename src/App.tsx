import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./AppFinal.css";
import NotesIcon from "./assets/note_icon1.png";
import KbIcon from "./assets/kb_icon.png";
import AiIcon from "./assets/ai_icon.png";
import PlusIcon from "./assets/plus_icon.png";
import DeleteIcon from "./assets/delete_icon.png";
import SettingIcon from "./assets/setting_icon.png";
import { useEffect, useState } from "react";
import {
  getNotes,
  setNotes as setNotesOnLocalStorage,
} from "./helpers/getFromLocalStorage";
import dayjs from "dayjs";
import { writeTextFile, readTextFile, removeFile } from "@tauri-apps/api/fs";
import { save } from "@tauri-apps/api/dialog";

enum ViewMode {
  Notes,
  AI,
  KnowledgeBase,
  Settings,
}

function App() {
  const [notes, setNotes] = useState<Array<Record<string, string>>>([]);
  const [activeNote, setActiveNote] = useState(0);
  const [activeNoteContent, setActiveNoteContent] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Notes);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Apply dark mode class to body
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const updateNotes = (notes: Array<Record<string, string>>) => {
    setNotes([...notes]);
    setNotesOnLocalStorage(JSON.stringify(notes));
  };

  const deleteNote = async (noteID: number) => {
    await removeFile(notes[noteID].location);

    notes.splice(noteID, 1);
    updateNotes(notes);

    if (activeNote >= noteID) {
      setActiveNoteData(activeNote >= 1 ? activeNote - 1 : 0);
    }
  };

  const addNote = async () => {
    const savePath = await save();
    if (!savePath) return;

    await writeTextFile(`${savePath}.txt`, "");

    const myNewNote = {
      title: "New note",
      created_at: `${dayjs().format("ddd, DD MMMM YYYY")} at ${dayjs().format(
        "hh:mm A"
      )}`,
      location: `${savePath}.txt`,
    };

    updateNotes([{ ...myNewNote }, ...notes]);
    setActiveNote(0);
    setActiveNoteContent("");
  };

  const handleChange = (content: string) => {
    if (notes.length === 0) return;

    const header = content.split(/\r?\n/)[0];
    if (notes.length !== 0 && notes[activeNote].title !== header) {
      notes[activeNote].title = header;
      updateNotes([...notes]);
    }

    setActiveNoteContent(content);
    writeTextFile(notes[activeNote].location, content);
  };

  const setActiveNoteData = async (index: number) => {
    setActiveNote(index);

    if (notes.length === 0) setActiveNoteContent("");
    else {
      const contents = await readTextFile(notes[index].location);
      setActiveNoteContent(contents);
    }
  };

  useEffect(() => {
    const getNotesFromStorage = async () => {
      const myNotes = await getNotes();

      setNotes(myNotes);
    };

    getNotesFromStorage();
  }, []);

  const renderContent = () => {
    switch (viewMode) {
      case ViewMode.Notes:
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
      case ViewMode.AI:
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
      case ViewMode.KnowledgeBase:
        return (
          <div className="flex w-full p-4">
            {/* Knowledge Base content will be implemented here */}
          </div>
        );
      case ViewMode.Settings:
        return (
          <div className="flex w-full p-4 flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="token" className="text-lg font-semibold">OpenAI Token:</label>
              <input
                type="text"
                id="token"
                className="border border-gray-300 p-2 rounded flex-grow"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            </div>
            <hr className="border-gray-300" />
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Dark Mode:</span>
              <label className="inline-flex relative items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isDarkMode}
                  onChange={() => setIsDarkMode(!isDarkMode)}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-gray-900">Toggle</span>
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-16 bg-gray-200 text-gray-800 flex flex-col items-center py-4 space-y-4">
        <img
          src={NotesIcon}
          alt="Notes Icon"
          onClick={() => setViewMode(ViewMode.Notes)}
          className={`w-8 h-8 cursor-pointer ${
            viewMode === ViewMode.Notes ? "opacity-100" : "opacity-50"
          }`}
        />
        <img
          src={KbIcon}
          alt="Knowledge Base Icon"
          onClick={() => setViewMode(ViewMode.KnowledgeBase)}
          className={`w-8 h-8 cursor-pointer ${
            viewMode === ViewMode.KnowledgeBase ? "opacity-100" : "opacity-50"
          }`}
        />
        <img
          src={AiIcon}
          alt="AI Icon"
          onClick={() => setViewMode(ViewMode.AI)}
          className={`w-8 h-8 cursor-pointer ${
            viewMode === ViewMode.AI ? "opacity-100" : "opacity-50"
          }`}
        />
        <img
          src={SettingIcon}
          alt="Settings Icon"
          onClick={() => setViewMode(ViewMode.Settings)}
          className={`w-8 h-8 cursor-pointer ${
            viewMode === ViewMode.Settings ? "opacity-100" : "opacity-50"
          }`}
        />
      </div>
      <div className="flex-grow flex flex-row">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;

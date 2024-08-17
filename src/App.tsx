import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./AppFinal.css";
import NotesIcon from "./assets/note_icon1.png";
import KbIcon from "./assets/kb_icon.png";
import AiIcon from "./assets/ai_icon.png";
import SettingIcon from "./assets/setting_icon.png";
import { useEffect, useState } from "react";
import Notes from './views/Notes';
import AI from './views/AI';
import KnowledgeBase from './views/KnowledgeBase';
import Settings from './views/Settings';
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
          <Notes
            notes={notes}
            activeNote={activeNote}
            setActiveNote={setActiveNote}
            setActiveNoteContent={setActiveNoteContent}
            addNote={addNote}
            deleteNote={deleteNote}
            handleChange={handleChange}
            activeNoteContent={activeNoteContent}
            setActiveNoteData={setActiveNoteData}
          />
        );
      case ViewMode.AI:
        return (
          <AI
            addNote={addNote}
            activeNoteContent={activeNoteContent}
            handleChange={handleChange}
          />
        );
      case ViewMode.KnowledgeBase:
        return <KnowledgeBase />;
      case ViewMode.Settings:
        return (
          <Settings
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
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

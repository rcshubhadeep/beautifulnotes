import "./App.scss";
import NotesIcon from "./assets/note_icon.png";
import KbIcon from "./assets/kb_icon.png";
import AiIcon from "./assets/ai_icon.png";
import PlusIcon from "./assets/plus_icon.png";
import DeleteIcon from "./assets/delete_icon.png";
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
}

function App() {
  const [notes, setNotes] = useState<Array<Record<string, string>>>([]);
  const [activeNote, setActiveNote] = useState(0);
  const [activeNoteContent, setActiveNoteContent] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Notes);

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

  const handleChange = ({
    target: { value },
  }: {
    target: { value: string };
  }) => {
    if (notes.length === 0) return;

    const header = value.split(/\r?\n/)[0];
    if (notes.length !== 0 && notes[activeNote].title !== header) {
      notes[activeNote].title = header;
      updateNotes([...notes]);
    }

    setActiveNoteContent(value);
    writeTextFile(notes[activeNote].location, value);
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
          <>
            <div className="container__middle">
              <div className="container__middle__header">
                <div className="container__middle__header__title_and_logo">
                  <p>My Notes</p>
                </div>
                <div className="container__middle__header__action" onClick={addNote}>
                  <img src={PlusIcon} alt="Add New Note Icon" />
                  <p>New</p>
                </div>
              </div>
              <div className="container__middle__content">
                {notes.map((item, index) => (
                  <div
                    key={`${item.title}_${index}`}
                    className={`container__middle__content__row ${
                      index === activeNote && "active"
                    }`}
                    onClick={() => setActiveNoteData(index)}
                  >
                    <div className="container__middle__content__row__left">
                      <p className="container__middle__content__row__left__title">
                        {item.title || "Untitled"}
                      </p>
                      <p className="container__middle__content__row__left__date">
                        {item.created_at}
                      </p>
                    </div>

                    <img
                      src={DeleteIcon}
                      alt="Delete Note Icon"
                      className="container__middle__content__row__action"
                      onClick={() => deleteNote(index)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="container__right">
              <p className="container__right__date">{notes[activeNote]?.created_at}</p>
              <textarea
                name="note_input"
                placeholder="Write Your Note Here"
                onChange={handleChange}
                value={activeNoteContent}
              ></textarea>
            </div>
          </>
        );
      case ViewMode.AI:
        return (
          <>
            <div className="container__middle">
              <div className="container__middle__header">
                <div className="container__middle__header__title_and_logo">
                  <p>SmApps</p>
                </div>
                <div className="container__middle__header__action" onClick={addNote}>
                  <img src={PlusIcon} alt="Add New Note Icon" />
                  <p>New</p>
                </div>
              </div>
              <div className="container__middle__content">
                {/* Placeholder for SmApps List */}
                <p>No SmApps available</p>
              </  div>
            </div>
            <div className="container__right">
              <div className="container__right__controls">
                <select className="container__right__dropdown">
                  <option value="all">Apply to all Notes</option>
                  <option value="selected">Apply to selected Notes</option>
                </select>
              </div>
              <textarea
                name="smapp_input"
                placeholder="AI interaction will be here..."
              ></textarea>
            </div>
          </>
        );
      case ViewMode.KnowledgeBase:
        return (
          <div className="container__knowledgebase">
            {/* Knowledge Base content will be implemented here */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <div className="container__icons">
        <img
          src={NotesIcon}
          alt="Notes Icon"
          onClick={() => setViewMode(ViewMode.Notes)}
          className={`icon ${viewMode === ViewMode.Notes ? "active" : ""}`}
        />
        <img
          src={KbIcon}
          alt="Knowledge Base Icon"
          onClick={() => setViewMode(ViewMode.KnowledgeBase)}
          className={`icon ${viewMode === ViewMode.KnowledgeBase ? "active" : ""}`}
        />
        <img
          src={AiIcon}
          alt="AI Icon"
          onClick={() => setViewMode(ViewMode.AI)}
          className={`icon ${viewMode === ViewMode.AI ? "active" : ""}`}
        />
      </div>
      {renderContent()}
    </div>
  );
}

export default App;

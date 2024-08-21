import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import PlusIcon from "../assets/plus_icon.png";
import DeleteIcon from "../assets/delete_icon.png";
import { useEffect, useState } from "react";
// import { writeTextFile, readTextFile, removeFile } from "@tauri-apps/api/fs";
// import { save } from "@tauri-apps/api/dialog";
import dayjs from "dayjs";
import { getNotes, setNotes as storeNoteMetadata } from "../api/storage";

const stripHtml = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Array<Record<string, string>>>([]);
  const [activeNote, setActiveNote] = useState(0);
  const [activeNoteContent, setActiveNoteContent] = useState("");

  useEffect(() => {
    const getNotesFromStorage = async () => {
      let myNotes = await getNotes();
      myNotes = myNotes.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); 
      });
      setNotes(myNotes);
    };

    getNotesFromStorage();
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      setActiveNoteData(activeNote);
    } else {
      setActiveNoteContent("");
    }
  }, [notes]);

  const updateNotes = async (updatedNotes: Array<Record<string, string>>) => {
    setNotes([...updatedNotes]);
    // console.log(notes);
    // console.log(JSON.stringify(updatedNotes))
    // setNotesOnLocalStorage(JSON.stringify(updatedNotes));
    await storeNoteMetadata(updatedNotes);
  };

  const deleteNote = async (noteID: number) => {
    // await removeFile(notes[noteID].location);
    const updatedNotes = notes.filter((_, index) => index !== noteID);
    updateNotes(updatedNotes);
    if (activeNote >= noteID) {
      setActiveNoteData(Math.max(activeNote - 1, 0));
    }
  };

  const addNote = async () => {
    // const savePath = await save({
    //   defaultPath: "note", // this ensures a new file is created each time
    //   filters: [{
    //     name: "Text Files",
    //     extensions: ["txt"]
    //   }]
    // });
    // if (!savePath) return;

    const myNewNote = {
      title: "New note",
      created_at: `${dayjs().format("ddd, DD MMMM YYYY")} at ${dayjs().format(
        "hh:mm A"
      )}`,
      // location: `${savePath}.txt`, // Ensure unique savePath
    };

    const updatedNotes = [myNewNote, ...notes]; // Append new note at the end
    // await writeTextFile(`${savePath}.txt`, "");
    // console.log(updatedNotes);
    await updateNotes(updatedNotes);
    // console.log(notes);
    await setActiveNoteData(0); // Set the newly created note as active
    setActiveNoteContent("");
  };

  const handleChange = (content: string) => {
    if (notes.length === 0) return;
    // console.log(activeNote);

    const header = content.split(/\r?\n/)[0];
    const updatedNotes = [...notes];
    if (notes[activeNote].title !== header) {
      updatedNotes[activeNote].title = header;
      updateNotes(updatedNotes);
    }

    setActiveNoteContent(content);
    // writeTextFile(notes[activeNote].location, content);
    // console.log(activeNote);
  };

  const setActiveNoteData = async (index: number) => {
    console.log(index);
    setActiveNote(index);
    // console.log(notes[index]);
    // const contents = await readTextFile(notes[index].location);
    const contents = notes[index].title
    setActiveNoteContent(contents);
  };

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
        <div className="flex flex-col gap-[20px]">
        {notes.map((item, index) => (
          <div
            key={`${item.title}_${index}`}
            className={`flex justify-between items-center p-2 cursor-pointer rounded ${
              index === activeNote ? "bg-blue-100" : "bg-white"
            } hover:bg-gray-200`}
            onClick={() => setActiveNoteData(index)}
          >
            <div>
              <p className="from-neutral-300">
                {truncate(stripHtml(item.title || "Untitled"), 20)}
              </p>
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
        {notes.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-center font-bold">No notes to display, please select one</p>
          </div>
        ) : (
          <div className="h-full">
            <p className="text-xs text-gray-500 mb-2">{notes[activeNote]?.created_at}</p>
            <ReactQuill
              value={activeNoteContent}
              onChange={handleChange}
              placeholder="Write Your Note Here"
              className="h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;

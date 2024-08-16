import { useState, useEffect } from "react";
import { getNotes, setNotes as saveNotesToStorage } from "../helpers/getFromLocalStorage";
import { removeFile } from "@tauri-apps/api/fs";

export function useNotes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const storedNotes = getNotes();
    setNotes(storedNotes);
  }, []);

  const updateNotes = (newNotes) => {
    setNotes(newNotes);
    saveNotesToStorage(newNotes);
  };

  const deleteNote = async (noteID) => {
    await removeFile(notes[noteID].location);
    const updatedNotes = notes.filter((_, index) => index !== noteID);
    updateNotes(updatedNotes);
  };

  return {
    notes,
    updateNotes,
    deleteNote,
  };
}

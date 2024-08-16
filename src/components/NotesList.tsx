import React from "react";
import DeleteIcon from "../assets/delete_icon.png";

interface Note {
  id: string;
  title: string;
}

interface NotesListProps {
  notes: Note[];
  onNoteSelect: (index: number) => void;
  onDelete: (index: number) => void;
}

const NotesList: React.FC<NotesListProps> = ({ notes, onNoteSelect, onDelete }) => {
  return (
    <div className="notes-list">
      {notes.map((note, index) => (
        <div key={note.id} className="note-item">
          <div onClick={() => onNoteSelect(index)} className="note-title">
            {note.title}
          </div>
          <img
            src={DeleteIcon}
            alt="Delete"
            onClick={() => onDelete(index)}
            className="delete-icon"
          />
        </div>
      ))}
    </div>
  );
};

export default NotesList;

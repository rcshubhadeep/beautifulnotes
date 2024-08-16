import React, { useState, useEffect } from "react";
import { writeTextFile } from "@tauri-apps/api/fs";
import { save } from "@tauri-apps/api/dialog";

interface NoteEditorProps {
  note: { id: string; title: string; content: string };
  onSave: (updatedNotes: { id: string; title: string; content: string }[]) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave }) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
  }, [note]);

  const handleSave = async () => {
    const filePath = await save({
      defaultPath: `${note.title}.txt`,
    });

    if (filePath) {
      await writeTextFile(filePath, content);
      onSave([{ ...note, title, content }]);
    }
  };

  return (
    <div className="note-editor">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="note-title-input"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing your note..."
        className="note-content-input"
      />
      <button onClick={handleSave} className="save-button">
        Save
      </button>
    </div>
  );
};

export default NoteEditor;

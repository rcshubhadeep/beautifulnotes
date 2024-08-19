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

enum ViewMode {
  Notes,
  AI,
  KnowledgeBase,
  Settings,
}

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Notes);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const renderContent = () => {
    switch (viewMode) {
      case ViewMode.Notes:
        return <Notes />;
      case ViewMode.AI:
        return <AI />;
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

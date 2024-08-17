interface SettingsProps {
    isDarkMode: boolean;
    setIsDarkMode: (value: boolean) => void;
  }
  
  const Settings: React.FC<SettingsProps> = ({ isDarkMode, setIsDarkMode }) => {
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
  };
  
  export default Settings;
  
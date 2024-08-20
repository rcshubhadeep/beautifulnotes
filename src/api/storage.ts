import { Store } from "tauri-plugin-store-api";

// Initialize the store (you can change the file name/path as needed)
const store = new Store(".notes_app_store.dat");

export const getNotes = async () => {
  const notes = await store.get<Array<Record<string, string>>>("simple_notes_app");
  return notes || [];
};

export const setNotes = async (newValue: Array<Record<string, string>>) => {
  await store.set("simple_notes_app", newValue);
  await store.save(); // Ensure the store is saved after updating
};


// export const getNotes = async () => {
//     return JSON.parse(localStorage.getItem("simple_notes_app") || "");
//   };
  
// export const setNotes = async (newValue: string) => {
//     await getDocumentDir();
//     localStorage.setItem("simple_notes_app", newValue);
// };
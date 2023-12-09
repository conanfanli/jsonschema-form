export interface ViewStore {
  getView: (key: string) => string | null;
  deleteView: (key: string) => void;
  saveView: (k: string, v: string) => void;
  listViews: () => string[];
}

export function LocalStorageViewStore(): ViewStore {
  const LOCAL_STORAGE_PREFIX = "savedViews:";

  function listViews() {
    return Array.from({ length: localStorage.length }, (v, i) => i)
      .map((i) => localStorage.key(i) || "")
      .filter((key) => key.includes(LOCAL_STORAGE_PREFIX))
      .map((key) => key.replace(LOCAL_STORAGE_PREFIX, ""));
  }
  function saveToLocalStorage(key: string, content: string) {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${key}`, content);
  }
  function deleteFromLocalStorage(key: string) {
    localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}${key}`);
  }
  function getFromLocalStorage(key: string) {
    const name = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${key}`);
    if (!name) {
      return null;
    }
    return name.replace(LOCAL_STORAGE_PREFIX, "");
  }

  return {
    deleteView: deleteFromLocalStorage,
    getView: getFromLocalStorage,
    saveView: saveToLocalStorage,
    listViews,
  };
}

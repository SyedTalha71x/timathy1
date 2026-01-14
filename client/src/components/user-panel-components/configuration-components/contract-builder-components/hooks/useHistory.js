import { useState, useCallback } from 'react';

export const useHistory = (contractPages, folders, setContractPages, setFolders) => {
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveToHistory = useCallback((pages, folders, action) => {
    const newHistory = [...history];
    newHistory.splice(historyIndex + 1);
    newHistory.push({
      pages: JSON.parse(JSON.stringify(pages)),
      folders: JSON.parse(JSON.stringify(folders)),
      action,
      timestamp: new Date().toISOString()
    });
    setHistory(newHistory.slice(-50));
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      const historyEntry = history[historyIndex - 1];
      setContractPages(JSON.parse(JSON.stringify(historyEntry.pages)));
      if (historyEntry.folders) {
        setFolders(JSON.parse(JSON.stringify(historyEntry.folders)));
      }
    }
  }, [history, historyIndex, setContractPages, setFolders]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      const historyEntry = history[historyIndex + 1];
      setContractPages(JSON.parse(JSON.stringify(historyEntry.pages)));
      if (historyEntry.folders) {
        setFolders(JSON.parse(JSON.stringify(historyEntry.folders)));
      }
    }
  }, [history, historyIndex, setContractPages, setFolders]);

  return {
    saveToHistory,
    undo,
    redo,
    history,
    historyIndex
  };
};

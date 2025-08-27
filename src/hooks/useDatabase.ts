import { useState, useEffect } from 'react';
import { Link } from '../types';
import { 
  saveLinks, 
  loadLinks, 
  saveFolders, 
  loadFolders, 
  saveSettings, 
  loadSettings,
  DatabaseSettings 
} from '../utils/database';
import { saveState, loadState } from '../utils/storage';
import { mockLinks } from '../data/mockData';

export const useDatabase = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize database on first load
  useEffect(() => {
    const initializeDatabase = () => {
      try {
        // فحص ما إذا كان هذا أول تشغيل للتطبيق
        const isFirstRun = !loadState('app_initialized', false);
        
        // Check if this is the first time loading the app
        const existingLinks = loadLinks();
        const existingFolders = loadFolders();
        
        // If no data exists or first run, load mock data
        if (existingLinks.length === 0 || isFirstRun) {
          saveLinks(mockLinks);
          saveState('app_initialized', true);
        }
        
        // Ensure default folders exist
        const defaultFolders = ['Work', 'Study', 'Fun', 'Personal'];
        const allFolders = Array.from(new Set([...defaultFolders, ...existingFolders]));
        saveFolders(allFolders);
        
        // Ensure settings have language property for backward compatibility
        const currentSettings = loadSettings();
        if (!currentSettings.language) {
          saveSettings({
            ...currentSettings,
            language: 'ar'
          });
        }
        
        // حفظ وقت آخر تشغيل
        saveState('last_startup', new Date().toISOString());
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing database:', error);
        setIsInitialized(true);
      }
    };

    initializeDatabase();
  }, []);

  // Auto-save functions
  const saveLinksToDatabase = (links: Link[]) => {
    saveLinks(links);
    // حفظ وقت آخر تحديث
    saveState('last_links_update', new Date().toISOString());
  };

  const saveFoldersToDatabase = (folders: string[]) => {
    saveFolders(folders);
    saveState('last_folders_update', new Date().toISOString());
  };

  const saveSettingsToDatabase = (settings: DatabaseSettings) => {
    saveSettings(settings);
    saveState('last_settings_update', new Date().toISOString());
  };

  return {
    isInitialized,
    loadLinks,
    saveLinks: saveLinksToDatabase,
    loadFolders,
    saveFolders: saveFoldersToDatabase,
    loadSettings,
    saveSettings: saveSettingsToDatabase
  };
};
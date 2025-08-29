import React from 'react';
import { Folder, Tag, Bookmark, Heart, Settings, Plus, X, Trash2, Info, RotateCcw } from 'lucide-react';
import { t } from '../utils/translations';

interface SidebarProps {
  darkMode: boolean;
  currentView: string;
  onViewChange: (view: string) => void;
  folders: string[];
  tags: string[];
  trashCount: number;
  language: 'ar' | 'en';
  onAddFolder: (folderName: string) => void;
  onDeleteFolder: (folderName: string) => void;
  onReorderFolders: (folders: string[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  darkMode,
  currentView,
  onViewChange,
  folders,
  tags,
  trashCount,
  language,
  onAddFolder,
  onDeleteFolder,
  onReorderFolders,
  isOpen,
  onClose,
}) => {
  const [showAddFolder, setShowAddFolder] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState('');
  const [draggedOverFolder, setDraggedOverFolder] = React.useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);
  const [draggedFolder, setDraggedFolder] = React.useState<string | null>(null);

  const menuItems = [
    { id: 'all', label: t(language, 'allLinks'), icon: Folder, count: null },
    { id: 'favorites', label: t(language, 'favorites'), icon: Heart, count: null },
    { id: 'read-later', label: t(language, 'readLater'), icon: Bookmark, count: null },
    { id: 'trash', label: t(language, 'trash'), icon: Trash2, count: trashCount },
  ];

  const handleAddFolder = () => {
    if (newFolderName.trim() && !folders.includes(newFolderName.trim())) {
      onAddFolder(newFolderName.trim());
      setNewFolderName('');
      setShowAddFolder(false);
    }
  };

  const handleDeleteFolder = (folderName: string) => {
    if (window.confirm(t(language, 'deleteFolderConfirm', { folder: folderName }))) {
      onDeleteFolder(folderName);
    }
  };

  const handleDragStart = (e: React.DragEvent, folderName: string) => {
    const folderIndex = folders.indexOf(folderName);
    setDraggedIndex(folderIndex);
    setDraggedFolder(folderName);
    e.dataTransfer.setData('text/plain', folderName);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedFolder(null);
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDraggedOverFolder(null);
  };

  const handleFolderDragOver = (e: React.DragEvent, targetFolder: string) => {
    e.preventDefault();
    const targetIndex = folders.indexOf(targetFolder);
    if (draggedFolder && draggedFolder !== targetFolder && draggedIndex !== null) {
      setDraggedOverFolder(targetFolder);
      setDragOverIndex(targetIndex);
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleFolderDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDraggedOverFolder(null);
      setDragOverIndex(null);
    }
  };

  const handleFolderDrop = (e: React.DragEvent, targetFolder: string) => {
    e.preventDefault();
    const draggedFolderName = e.dataTransfer.getData('text/plain');
    const targetIndex = folders.indexOf(targetFolder);
    
    if (draggedFolderName && draggedFolderName !== targetFolder && draggedIndex !== null) {
      // Create new array with reordered folders
      const newFolders = [...folders];
      newFolders.splice(draggedIndex, 1);
      newFolders.splice(targetIndex, 0, draggedFolderName);
      
      onReorderFolders(newFolders);
    }
    
    setDraggedOverFolder(null);
    setDragOverIndex(null);
    setDraggedFolder(null);
    setDraggedIndex(null);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed md:relative top-0 left-0 z-50 md:z-auto
        w-72 sm:w-80 md:w-64 h-full md:h-auto
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        border-r transition-colors
        ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
      `}>
        {/* Mobile Close Button */}
        <div className="md:hidden flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <img 
              src="/logo3.png" 
              alt="MyWaslat Logo" 
              className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
            />
            <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              MyWaslat
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
      <div className="p-4 md:p-6">
        {/* Main Navigation */}
        <nav className="space-y-1 mb-6 md:mb-8">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  // Close sidebar on mobile after selection
                  if (window.innerWidth < 768) {
                    onClose();
                  }
                  // Close sidebar on mobile after selection
                  if (window.innerWidth < 768) {
                    onClose();
                  }
                  // Close sidebar on mobile after selection
                  if (window.innerWidth < 768) {
                    onClose();
                  }
                }}
                className={`w-full flex items-center space-x-3 px-3 md:px-4 py-3 rounded-lg text-right transition-all duration-200 ${
                  currentView === item.id
                    ? darkMode 
                      ? 'bg-blue-900 text-blue-200' 
                      : 'bg-blue-100 text-blue-900'
                    : darkMode 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-6 h-6 shrink-0" />
                <div className="flex items-center justify-between flex-1">
                  <span className="font-medium text-sm md:text-base">{item.label}</span>
                  {item.count !== null && item.count > 0 && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.id === 'trash'
                        ? darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                        : darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Folders Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-semibold ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t(language, 'folders')}
            </h3>
            <button
              onClick={() => setShowAddFolder(true)}
              className={`p-1 rounded-lg transition-colors hover:scale-110 ${
                darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title={t(language, 'addNewFolder')}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {/* Add Folder Input */}
          {showAddFolder && (
            <div className="mb-3 p-2 md:p-3 rounded-lg border border-dashed border-gray-300">
              <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFolder()}
                  placeholder={t(language, 'newFolderPlaceholder')}
                  className={`flex-1 px-2 py-2 text-sm border rounded ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddFolder}
                    className="flex-1 md:flex-none px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    {t(language, 'save')}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddFolder(false);
                      setNewFolderName('');
                    }}
                    className={`flex-1 md:flex-none px-3 py-2 rounded text-sm transition-colors ${
                      darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {t(language, 'cancel')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Scrollable Folders Container */}
          <div className="relative">
            {/* Folders List with Scroll */}
            <div className={`space-y-1 max-h-48 md:max-h-56 overflow-y-auto ${
              darkMode 
                ? 'scrollbar-w-2 scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500' 
                : 'scrollbar-w-2 scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400'
            }`}>
            {folders.map((folder, index) => (
              <div
                key={folder}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, folder)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleFolderDragOver(e, folder)}
                onDragLeave={handleFolderDragLeave}
                onDrop={(e) => handleFolderDrop(e, folder)}
                className={`group flex items-center justify-between px-3 md:px-4 py-2.5 md:py-2 rounded-lg transition-all duration-200 cursor-move ${
                  draggedIndex === index 
                    ? 'opacity-50 scale-95 rotate-2' 
                    : ''
                } ${
                  dragOverIndex === index && draggedIndex !== null && draggedIndex !== index
                    ? darkMode 
                      ? 'bg-blue-800/50 border-2 border-blue-500 border-dashed transform scale-105' 
                      : 'bg-blue-50 border-2 border-blue-300 border-dashed transform scale-105'
                    : ''
                } ${
                  currentView === `folder:${folder}`
                    ? darkMode 
                      ? 'bg-green-900 text-green-200' 
                      : 'bg-green-100 text-green-900'
                    : darkMode 
                      ? 'text-gray-400 hover:bg-gray-700' 
                      : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {/* Drag Handle */}
                <div className={`flex items-center mr-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  <div className="flex flex-col space-y-0.5">
                    <div className="w-1 h-1 bg-current rounded-full"></div>
                    <div className="w-1 h-1 bg-current rounded-full"></div>
                    <div className="w-1 h-1 bg-current rounded-full"></div>
                    <div className="w-1 h-1 bg-current rounded-full"></div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    onViewChange(`folder:${folder}`);
                    // Close sidebar on mobile after selection
                    if (window.innerWidth < 768) {
                      onClose();
                    }
                  }}
                  className="flex items-center space-x-3 flex-1 text-right"
                >
                  <Folder className="w-5 h-5 shrink-0" />
                  <span className="font-medium text-sm">
                    {['Work', 'Study', 'Fun', 'Personal'].includes(folder) 
                      ? t(language, folder.toLowerCase()) 
                      : folder
                    }
                  </span>
                </button>
                {!['Work', 'Study', 'Fun', 'Personal'].includes(folder) && (
                  <button
                    onClick={() => handleDeleteFolder(folder)}
                    className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-all duration-200 hover:scale-110 ${
                      darkMode ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-600'
                    }`}
                    title={t(language, 'deleteFolder')}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            </div>
            
          </div>
        </div>

        {/* Popular Tags */}
        <div>
          <h3 className={`text-sm font-semibold mb-4 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {t(language, 'popularTags')}
          </h3>
          
          {/* Scrollable Tags Container */}
          <div className="relative">
            {/* Tags List with Scroll */}
            <div className={`max-h-32 md:max-h-40 overflow-y-auto ${
              darkMode 
                ? 'scrollbar-w-2 scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500' 
                : 'scrollbar-w-2 scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400'
            }`}>
              <div className="flex flex-wrap gap-1.5 md:gap-2 pb-2">
                {tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      onViewChange(`tag:${tag}`);
                      // Close sidebar on mobile after selection
                      if (window.innerWidth < 768) {
                        onClose();
                      }
                      // Close sidebar on mobile after selection
                      if (window.innerWidth < 768) {
                        onClose();
                      }
                    }}
                    className={`px-2.5 md:px-3 py-1.5 md:py-1 text-xs rounded-full transition-all duration-200 hover:scale-105 ${
                      currentView === `tag:${tag}`
                        ? darkMode 
                          ? 'bg-purple-900 text-purple-200' 
                          : 'bg-purple-100 text-purple-900'
                        : darkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};
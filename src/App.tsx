import React, { useState, useMemo } from 'react';
import { Plus, Grid3X3, List, Grid2X2 } from 'lucide-react';
import { Layout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import { LinkCard } from './components/LinkCard';
import { AddLinkModal } from './components/AddLinkModal';
import { EditLinkModal } from './components/EditLinkModal';
import { AboutModal } from './components/AboutModal';
import { DataManagementModal } from './components/DataManagementModal';
import { Link } from './types';
import { useDatabase } from './hooks/useDatabase';
import { t } from './utils/translations';

type ViewLayout = 'grid' | 'list' | 'compact';
function App() {
  const { 
    isInitialized, 
    loadLinks, 
    saveLinks: saveLinksToDb, 
    loadFolders, 
    saveFolders: saveFoldersToDb,
    loadSettings,
    saveSettings: saveSettingsToDb
  } = useDatabase();

  // Load initial data from database
  const initialSettings = loadSettings();
  const [darkMode, setDarkMode] = useState(initialSettings.darkMode);
  const [language, setLanguage] = useState<'ar' | 'en'>(initialSettings.language);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState(initialSettings.currentView);
  const [viewLayout, setViewLayout] = useState<ViewLayout>(initialSettings.viewLayout);
  const [links, setLinks] = useState<Link[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isDataManagementModalOpen, setIsDataManagementModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [customFolders, setCustomFolders] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Close sidebar when clicking outside on mobile
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSidebarOpen && window.innerWidth < 768) {
        const sidebar = document.querySelector('[data-sidebar]');
        const menuButton = document.querySelector('[data-menu-button]');
        
        if (sidebar && !sidebar.contains(event.target as Node) && 
            menuButton && !menuButton.contains(event.target as Node)) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Load data when database is initialized
  React.useEffect(() => {
    if (isInitialized) {
      setLinks(loadLinks());
      setCustomFolders(loadFolders());
    }
  }, [isInitialized, loadLinks, loadFolders]);

  // Auto-save settings when they change
  React.useEffect(() => {
    if (isInitialized) {
      saveSettingsToDb({
        darkMode,
        language,
        viewLayout,
        currentView
      });
    }
  }, [darkMode, language, viewLayout, currentView, isInitialized, saveSettingsToDb]);

  // Auto-save links when they change
  React.useEffect(() => {
    if (isInitialized && links.length > 0) {
      saveLinksToDb(links);
    }
  }, [links, isInitialized, saveLinksToDb]);

  // Auto-save folders when they change
  React.useEffect(() => {
    if (isInitialized && customFolders.length > 0) {
      saveFoldersToDb(customFolders);
    }
  }, [customFolders, isInitialized, saveFoldersToDb]);
  const folders = Array.from(new Set([...customFolders, ...links.map(link => link.folder)]));
  const allTags = Array.from(new Set(links.flatMap(link => link.tags)));

  const filteredLinks = useMemo(() => {
    let filtered = [...links];

    // Apply trash filter first
    if (currentView === 'trash') {
      filtered = filtered.filter(link => link.isDeleted);
    } else {
      // For all other views, exclude deleted links
      filtered = filtered.filter(link => !link.isDeleted);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(link =>
        link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply view filter
    switch (currentView) {
      case 'favorites':
        filtered = filtered.filter(link => link.isFavorite);
        break;
      case 'read-later':
        filtered = filtered.filter(link => link.readLater);
        break;
      case 'trash':
        // Already filtered above
        break;
      default:
        if (currentView.startsWith('folder:')) {
          const folder = currentView.split(':')[1];
          filtered = filtered.filter(link => link.folder === folder);
        } else if (currentView.startsWith('tag:')) {
          const tag = currentView.split(':')[1];
          filtered = filtered.filter(link => link.tags.includes(tag));
        }
    }

    // Sort by creation date (newest first)
    if (currentView === 'trash') {
      return filtered.sort((a, b) => {
        const aDate = a.deletedAt || a.createdAt;
        const bDate = b.deletedAt || b.createdAt;
        return bDate.getTime() - aDate.getTime();
      });
    } else {
      return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
  }, [links, searchTerm, currentView]);

  // Calculate trash count
  const trashCount = links.filter(link => link.isDeleted).length;

  const handleAddFolder = (folderName: string) => {
    if (!customFolders.includes(folderName)) {
      setCustomFolders(prev => [...prev, folderName]);
    }
  };

  const handleDeleteFolder = (folderName: string) => {
    // Don't allow deleting default folders
    const defaultFolders = ['Work', 'Study', 'Fun', 'Personal'];
    if (defaultFolders.includes(folderName)) {
      alert('لا يمكن حذف المجلدات الافتراضية');
      return;
    }

    // Move links from deleted folder to 'Personal'
    setLinks(prev => prev.map(link => 
      link.folder === folderName ? { ...link, folder: 'Personal' } : link
    ));
    
    // Remove folder from custom folders
    setCustomFolders(prev => prev.filter(folder => folder !== folderName));
    
    // If currently viewing the deleted folder, switch to 'all'
    if (currentView === `folder:${folderName}`) {
      setCurrentView('all');
    }
  };

  const handleReorderFolders = (reorderedFolders: string[]) => {
    // Update custom folders order (excluding default folders)
    const defaultFolders = ['Work', 'Study', 'Fun', 'Personal'];
    const customFoldersOnly = reorderedFolders.filter(folder => !defaultFolders.includes(folder));
    setCustomFolders(customFoldersOnly);
  };

  const handleToggleFavorite = (id: string) => {
    setLinks(prev => prev.map(link =>
      link.id === id ? { ...link, isFavorite: !link.isFavorite } : link
    ));
  };

  const handleToggleReadLater = (id: string) => {
    setLinks(prev => prev.map(link =>
      link.id === id ? { ...link, readLater: !link.readLater } : link
    ));
  };

  const handleShare = (link: Link) => {
    if (navigator.share) {
      navigator.share({
        title: link.title,
        text: link.description,
        url: link.url
      });
    } else {
      navigator.clipboard.writeText(link.url);
      alert(t(language, 'linkCopied'));
    }
  };

  const handleAddLink = (linkData: Omit<Link, 'id' | 'createdAt'>) => {
    const newLink: Link = {
      ...linkData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setLinks(prev => [newLink, ...prev]);
  };

  const handleEditLink = (link: Link) => {
    setEditingLink(link);
    setIsEditModalOpen(true);
  };

  const handleUpdateLink = (id: string, linkData: Omit<Link, 'id' | 'createdAt'>) => {
    setLinks(prev => prev.map(link =>
      link.id === id ? { ...link, ...linkData } : link
    ));
    setIsEditModalOpen(false);
    setEditingLink(null);
  };

  const handleDeleteLink = (id: string) => {
    const link = links.find(l => l.id === id);
    if (!link) return;

    if (currentView === 'trash') {
      // If we're in trash view, delete permanently
      if (window.confirm(t(language, 'deleteForeverConfirm', { title: link.title }))) {
        setLinks(prev => {
          const updatedLinks = prev.filter(link => link.id !== id);
          saveLinksToDb(updatedLinks);
          return updatedLinks;
        });
        
        // Clear any cached data
        if (typeof window !== 'undefined') {
          try {
            sessionStorage.removeItem(`link_${id}`);
          } catch (e) {
            // Ignore errors
          }
          
          if (window.gc) {
            window.gc();
          }
        }
      }
    } else {
      // Move to trash
      if (window.confirm(t(language, 'moveToTrashConfirm', { title: link.title }))) {
        setLinks(prev => prev.map(link => 
          link.id === id 
            ? { 
                ...link, 
                isDeleted: true, 
                deletedAt: new Date(),
                originalFolder: link.folder
              } 
            : link
        ));
      }
    }
  };

  const handleRestoreLink = (id: string) => {
    const link = links.find(l => l.id === id);
    if (!link) return;

    const targetFolder = link.originalFolder || 'Personal';
    if (window.confirm(t(language, 'restoreConfirm', { 
      title: link.title, 
      folder: ['Work', 'Study', 'Fun', 'Personal'].includes(targetFolder) 
        ? t(language, targetFolder.toLowerCase()) 
        : targetFolder 
    }))) {
      setLinks(prev => prev.map(link => 
        link.id === id 
          ? { 
              ...link, 
              isDeleted: false, 
              deletedAt: undefined,
              folder: targetFolder,
              originalFolder: undefined
            } 
          : link
      ));
    }
  };

  const handleEmptyTrash = () => {
    const trashedLinks = links.filter(link => link.isDeleted);
    if (trashedLinks.length === 0) return;

    if (window.confirm(t(language, 'emptyTrashConfirm'))) {
      setLinks(prev => {
        const updatedLinks = prev.filter(link => !link.isDeleted);
        saveLinksToDb(updatedLinks);
        return updatedLinks;
      });
      
      // Clear cached data for deleted links
      if (typeof window !== 'undefined') {
        trashedLinks.forEach(link => {
          try {
            sessionStorage.removeItem(`link_${link.id}`);
          } catch (e) {
            // Ignore errors
          }
        });
        
        if (window.gc) {
          window.gc();
        }
      }
    }
  };

  const handleToggleSelection = (id: string) => {
    setSelectedLinks(prev => 
      prev.includes(id) 
        ? prev.filter(linkId => linkId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedLinks.length === filteredLinks.length) {
      setSelectedLinks([]);
    } else {
      setSelectedLinks(filteredLinks.map(link => link.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedLinks.length === 0) return;
    
    if (currentView === 'trash') {
      // Delete forever
      const confirmMessage = t(language, 'deleteForeverSelectedConfirm', { count: selectedLinks.length.toString() });
      
      if (window.confirm(confirmMessage)) {
        setLinks(prev => {
          const updatedLinks = prev.filter(link => !selectedLinks.includes(link.id));
          saveLinksToDb(updatedLinks);
          return updatedLinks;
        });
        
        // Clear cached data for deleted links
        if (typeof window !== 'undefined') {
          selectedLinks.forEach(id => {
            try {
              sessionStorage.removeItem(`link_${id}`);
            } catch (e) {
              // Ignore errors
            }
          });
          
          if (window.gc) {
            window.gc();
          }
        }
        
        setSelectedLinks([]);
        setIsSelectionMode(false);
      }
    } else {
      // Move to trash
      const confirmMessage = selectedLinks.length === 1 
        ? t(language, 'moveToTrashConfirm', { title: links.find(l => l.id === selectedLinks[0])?.title || '' })
        : t(language, 'deleteSelectedLinksConfirm', { count: selectedLinks.length.toString() });
      
      if (window.confirm(confirmMessage)) {
        setLinks(prev => prev.map(link => 
          selectedLinks.includes(link.id) 
            ? { 
                ...link, 
                isDeleted: true, 
                deletedAt: new Date(),
                originalFolder: link.folder
              } 
            : link
        ));
        
        setSelectedLinks([]);
        setIsSelectionMode(false);
      }
    }
  };

  const handleBulkShare = () => {
    if (selectedLinks.length === 0) return;
    
    const selectedLinksData = links.filter(link => selectedLinks.includes(link.id));
    const shareText = selectedLinksData.map(link => `${link.title}\n${link.url}`).join('\n\n');
    
    if (navigator.share) {
      navigator.share({
        title: t(language, 'selectedLinks'),
        text: shareText
      }).catch(error => {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      });
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        alert(t(language, 'selectedLinksCopied'));
      }).catch(() => {
        alert(shareText);
      });
    }
  };

  const handleBulkRestore = () => {
    if (selectedLinks.length === 0) return;
    
    const confirmMessage = t(language, 'restoreSelectedConfirm', { count: selectedLinks.length.toString() });
    
    if (window.confirm(confirmMessage)) {
      setLinks(prev => prev.map(link => 
        selectedLinks.includes(link.id) 
          ? { 
              ...link, 
              isDeleted: false, 
              deletedAt: undefined,
              folder: link.originalFolder || 'Personal',
              originalFolder: undefined
            } 
          : link
      ));
      
      setSelectedLinks([]);
      setIsSelectionMode(false);
    }
  };

  const handleCancelSelection = () => {
    setSelectedLinks([]);
    setIsSelectionMode(false);
  };

  const handleDataImported = () => {
    // Reload all data after import
    setLinks(loadLinks());
    setCustomFolders(loadFolders());
    const newSettings = loadSettings();
    setDarkMode(newSettings.darkMode);
    setLanguage(newSettings.language);
    setViewLayout(newSettings.viewLayout);
    setCurrentView(newSettings.currentView);
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'all': return t(language, 'allLinks');
      case 'favorites': return t(language, 'favorites');
      case 'read-later': return t(language, 'readLater');
      case 'trash': return t(language, 'trash');
      default:
        if (currentView.startsWith('folder:')) {
          const folderName = currentView.split(':')[1];
          return ['Work', 'Study', 'Fun', 'Personal'].includes(folderName) 
            ? t(language, folderName.toLowerCase()) 
            : folderName;
        } else if (currentView.startsWith('tag:')) {
          return `${t(language, 'tagPrefix')}${currentView.split(':')[1]}`;
        }
        return t(language, 'allLinks');
    }
  };

  // Show loading state while database initializes
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <img 
            src="/logo3.png" 
            alt="MyWaslat Logo" 
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 mb-4 mx-auto animate-pulse shadow-lg"
          />
          <h2 className="text-xl font-bold text-gray-900 mb-1">MyWaslat</h2>
          <p className="text-sm text-blue-600 font-medium mb-3">{t(language, 'tagline')}</p>
          <p className="text-gray-600">{t(language, 'loadingData')}</p>
        </div>
      </div>
    );
  }

  return (
    <Layout
      darkMode={darkMode}
      onToggleDarkMode={() => setDarkMode(!darkMode)}
      language={language}
      onToggleLanguage={() => setLanguage(prev => prev === 'ar' ? 'en' : 'ar')}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      onOpenAbout={() => setIsAboutModalOpen(true)}
      onOpenDataManagement={() => setIsDataManagementModalOpen(true)}
    >
      <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]">
        <Sidebar
          darkMode={darkMode}
          currentView={currentView}
          onViewChange={setCurrentView}
          folders={folders}
          tags={allTags}
          trashCount={trashCount}
          language={language}
          onAddFolder={handleAddFolder}
          onDeleteFolder={handleDeleteFolder}
          onReorderFolders={handleReorderFolders}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onOpenAbout={() => setIsAboutModalOpen(true)}
        />

        <div className="flex-1 overflow-auto w-full md:w-auto">
          <div className="p-3 sm:p-4 md:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className={`text-lg sm:text-xl md:text-2xl font-bold mb-1 md:mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {getViewTitle()}
                </h1>
                <p className={`text-xs sm:text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {isSelectionMode 
                    ? `${selectedLinks.length} ${t(language, 'selected')} / ${filteredLinks.length} ${t(language, 'links')}`
                    : currentView === 'trash' && filteredLinks.length > 0
                      ? t(language, 'itemsInTrash', { count: filteredLinks.length.toString() })
                      : filteredLinks.length === 0 && currentView === 'trash'
                        ? t(language, 'noItemsInTrash')
                        : `${filteredLinks.length} ${t(language, 'links')}`
                  }
                </p>
              </div>
              
              {/* Selection Mode or View Layout Options */}
              <div className="flex items-center space-x-2">
                {isSelectionMode ? (
                  /* Selection Mode Controls */
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSelectAll}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        selectedLinks.length === filteredLinks.length
                          ? darkMode 
                            ? 'bg-orange-900 text-orange-200 hover:bg-orange-800' 
                            : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                          : darkMode 
                            ? 'bg-blue-900 text-blue-200 hover:bg-blue-800' 
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    >
                      {selectedLinks.length === filteredLinks.length 
                        ? t(language, 'deselectAll') 
                        : t(language, 'selectAll')
                      }
                    </button>
                    
                    {selectedLinks.length > 0 && (
                      <>
                        {currentView !== 'trash' && (
                          <button
                            onClick={handleBulkShare}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                              darkMode 
                                ? 'bg-green-900 text-green-200 hover:bg-green-800' 
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                          >
                            {t(language, 'shareSelected')}
                          </button>
                        )}
                        
                        {currentView === 'trash' ? (
                          <>
                            <button
                              onClick={handleBulkRestore}
                              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                darkMode 
                                  ? 'bg-green-900 text-green-200 hover:bg-green-800' 
                                  : 'bg-green-100 text-green-800 hover:bg-green-200'
                              }`}
                            >
                              {t(language, 'restoreSelected')}
                            </button>
                            
                            <button
                              onClick={handleBulkDelete}
                              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                darkMode 
                                  ? 'bg-red-900 text-red-200 hover:bg-red-800' 
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              {t(language, 'deleteForeverSelected')}
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={handleBulkDelete}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                              darkMode 
                                ? 'bg-red-900 text-red-200 hover:bg-red-800' 
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {t(language, 'deleteSelected')}
                          </button>
                        )}
                      </>
                    )}
                    
                    <button
                      onClick={handleCancelSelection}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {t(language, 'cancel')}
                    </button>
                  </div>
                ) : (
                  /* Normal Mode Controls */
                  <>
                    {/* Empty Trash Button */}
                    {currentView === 'trash' && filteredLinks.length > 0 && (
                      <button
                        onClick={handleEmptyTrash}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          darkMode 
                            ? 'bg-red-900 text-red-200 hover:bg-red-800' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {t(language, 'emptyTrash')}
                      </button>
                    )}
                    
                    {filteredLinks.length > 0 && (
                      <button
                        onClick={() => setIsSelectionMode(true)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          darkMode 
                            ? 'bg-purple-900 text-purple-200 hover:bg-purple-800' 
                            : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                        }`}
                      >
                        {t(language, 'selectLinks')}
                      </button>
                    )}
                    
                    {/* View Layout Options */}
                    {currentView !== 'trash' && (
                      <div className={`flex rounded-lg border ${
                        darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'
                      }`}>
                        <button
                          onClick={() => setViewLayout('grid')}
                          className={`p-1.5 sm:p-2 rounded-l-lg transition-colors ${
                            viewLayout === 'grid'
                              ? 'bg-blue-600 text-white'
                              : darkMode 
                                ? 'text-gray-300 hover:bg-gray-600' 
                                : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          title={t(language, 'gridView')}
                        >
                          <Grid3X3 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setViewLayout('compact')}
                          className={`p-1.5 sm:p-2 transition-colors ${
                            viewLayout === 'compact'
                              ? 'bg-blue-600 text-white'
                              : darkMode 
                                ? 'text-gray-300 hover:bg-gray-600' 
                                : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          title={t(language, 'compactView')}
                        >
                          <Grid2X2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setViewLayout('list')}
                          className={`p-1.5 sm:p-2 rounded-r-lg transition-colors ${
                            viewLayout === 'list'
                              ? 'bg-blue-600 text-white'
                              : darkMode 
                                ? 'text-gray-300 hover:bg-gray-600' 
                                : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          title={t(language, 'listView')}
                        >
                          <List className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {filteredLinks.length === 0 ? (
              <div className="text-center py-12 md:py-16">
                <div className={`text-6xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  📚
                </div>
                <h3 className={`text-lg md:text-xl font-semibold mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {t(language, 'noLinks')}
                </h3>
                <p className={`text-sm md:text-base ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {searchTerm ? t(language, 'noLinksFound') : t(language, 'startAddingLinks')}
                </p>
              </div>
            ) : (
              <div className={`${
                viewLayout === 'grid' 
                  ? 'grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : viewLayout === 'compact'
                  ? 'grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
                  : 'space-y-3 sm:space-y-4'
              }`}>
                {filteredLinks.map(link => (
                  <LinkCard
                    key={link.id}
                    link={link}
                    darkMode={darkMode}
                    viewLayout={viewLayout}
                    language={language}
                    isTrashView={currentView === 'trash'}
                    isSelectionMode={isSelectionMode}
                    isSelected={selectedLinks.includes(link.id)}
                    onToggleSelection={handleToggleSelection}
                    onToggleFavorite={handleToggleFavorite}
                    onToggleReadLater={handleToggleReadLater}
                    onShare={handleShare}
                    onEdit={handleEditLink}
                    onDelete={handleDeleteLink}
                    onRestore={handleRestoreLink}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      {currentView !== 'trash' && (
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 lg:bottom-8 lg:right-8 w-14 h-14 md:w-16 md:h-16 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 transition-all duration-200 flex items-center justify-center z-30"
        >
          <Plus className="w-7 h-7 md:w-8 md:h-8" />
        </button>
      )}

      <AddLinkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddLink={handleAddLink}
        onAddFolder={handleAddFolder}
        darkMode={darkMode}
        language={language}
        availableFolders={folders}
        allTags={allTags}
      />

      <EditLinkModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingLink(null);
        }}
        onUpdateLink={handleUpdateLink}
        onAddFolder={handleAddFolder}
        darkMode={darkMode}
  language={language}
        link={editingLink}
        availableFolders={folders}
        allTags={allTags}
      />

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        darkMode={darkMode}
        language={language}
      />

      <DataManagementModal
        isOpen={isDataManagementModalOpen}
        onClose={() => setIsDataManagementModalOpen(false)}
        darkMode={darkMode}
        language={language}
        onDataImported={handleDataImported}
      />
    </Layout>
  );
}

export default App;
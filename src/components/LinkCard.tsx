import React from 'react';
import { ExternalLink, Heart, Bookmark, Share2, MoreVertical, Edit, Trash2, RotateCcw, Clock } from 'lucide-react';
import { Link } from '../types';
import { t } from '../utils/translations';

interface LinkCardProps {
  link: Link;
  darkMode: boolean;
  viewLayout: 'grid' | 'list' | 'compact';
  language: 'ar' | 'en';
  isTrashView: boolean;
  isSelectionMode: boolean;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleReadLater: (id: string) => void;
  onShare: (link: Link) => void;
  onEdit: (link: Link) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({ 
  link, 
  darkMode, 
  viewLayout,
  language,
  isTrashView,
  isSelectionMode,
  isSelected,
  onToggleSelection,
  onToggleFavorite, 
  onToggleReadLater, 
  onShare,
  onEdit,
  onDelete,
  onRestore
}) => {
  const [showActions, setShowActions] = React.useState(false);

  const handleOpenLink = () => {
    if (!isTrashView) {
      window.open(link.url, '_blank');
    }
  };

  const handleDelete = () => {
    onDelete(link.id);
  };

  const handleRestore = () => {
    onRestore(link.id);
  };

  // List View Layout
  if (viewLayout === 'list') {
    return (
      <div 
        className={`group relative flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 ${
          isSelected 
            ? darkMode 
              ? 'bg-blue-900 border-blue-600 shadow-blue-900/20' 
              : 'bg-blue-50 border-blue-300 shadow-blue-900/10'
            : darkMode 
              ? 'bg-gray-800 border-gray-700 hover:shadow-gray-900/20' 
              : 'bg-white border-gray-200 hover:shadow-gray-900/10'
        } ${
          darkMode 
            ? 'bg-gray-800 border-gray-700 hover:shadow-gray-900/20' 
            : 'bg-white border-gray-200 hover:shadow-gray-900/10'
        }`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Selection Checkbox */}
        {isSelectionMode && (
          <div className="flex-shrink-0">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelection(link.id)}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
          </div>
        )}

        {/* Action Menu */}
        {!isSelectionMode && (
          <div className={`absolute top-2 right-2 z-10 transition-opacity duration-200 ${
            showActions ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="flex space-x-0.5 sm:space-x-1">
              {isTrashView ? (
                <button
                  onClick={handleRestore}
                  className={`p-1 sm:p-1.5 rounded-lg transition-all duration-200 hover:scale-110 ${
                    darkMode ? 'bg-gray-700 text-gray-300 hover:text-green-400' : 'bg-white text-gray-600 hover:text-green-600'
                  } shadow-sm`}
                  title={t(language, 'restoreFromTrash')}
                >
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              ) : (
                <button
                  onClick={() => onEdit(link)}
                  className={`p-1 sm:p-1.5 rounded-lg transition-all duration-200 hover:scale-110 ${
                    darkMode ? 'bg-gray-700 text-gray-300 hover:text-blue-400' : 'bg-white text-gray-600 hover:text-blue-600'
                  } shadow-sm`}
                  title={t(language, 'editLink')}
                >
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
              <button
                onClick={handleDelete}
                className={`p-1 sm:p-1.5 rounded-lg transition-all duration-200 hover:scale-110 ${
                  darkMode ? 'bg-gray-700 text-gray-300 hover:text-red-400' : 'bg-white text-gray-600 hover:text-red-600'
                } shadow-sm`}
                title={isTrashView ? t(language, 'deleteForever') : t(language, 'moveToTrash')}
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Image */}
        {link.image && (
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={link.image}
              alt={link.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-sm sm:text-base md:text-lg leading-tight mb-1 truncate ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {link.title}
              </h3>
              {link.description && (
                <p className={`text-xs sm:text-sm line-clamp-2 mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {link.description}
                </p>
              )}
              
              {/* Trash Info */}
              {isTrashView && (
                <div className={`text-xs mb-2 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <div className="flex items-center space-x-1 mb-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {t(language, 'deletedOn', { 
                        date: link.deletedAt ? new Date(link.deletedAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US') : '' 
                      })}
                    </span>
                  </div>
                  {link.originalFolder && (
                    <div>
                      {t(language, 'originalFolder', { 
                        folder: ['Work', 'Study', 'Fun', 'Personal'].includes(link.originalFolder) 
                          ? t(language, link.originalFolder.toLowerCase()) 
                          : link.originalFolder 
                      })}
                    </div>
                  )}
                </div>
              )}
              
              {/* Tags and Folder */}
              {!isTrashView && (
                <div className="flex items-center space-x-1 sm:space-x-2 flex-wrap gap-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    link.folder === 'Work' 
                      ? darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                      : link.folder === 'Study'
                      ? darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
                      : darkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {['Work', 'Study', 'Fun', 'Personal'].includes(link.folder) 
                      ? t(language, link.folder.toLowerCase()) 
                      : link.folder
                    }
                  </span>
                  
                  {link.tags.slice(0, 1).map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-1 text-xs rounded-full ${
                        darkMode 
                          ? 'bg-blue-900 text-blue-200' 
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                  {link.tags.length > 1 && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      +{link.tags.length - 1}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {!isSelectionMode && (
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            {isTrashView ? (
              <button
                onClick={handleRestore}
                className={`p-1 sm:p-1.5 rounded-lg transition-all duration-200 hover:scale-110 ${
                  darkMode ? 'text-gray-400 hover:text-green-400' : 'text-gray-500 hover:text-green-500'
                }`}
                title={t(language, 'restore')}
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onToggleFavorite(link.id)}
                  className={`p-1 sm:p-1.5 rounded-lg transition-all duration-200 hover:scale-110 ${
                    link.isFavorite
                      ? 'text-red-500 hover:text-red-600'
                      : darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${link.isFavorite ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={() => onToggleReadLater(link.id)}
                  className={`p-1 sm:p-1.5 rounded-lg transition-all duration-200 hover:scale-110 ${
                    link.readLater
                      ? 'text-blue-500 hover:text-blue-600'
                      : darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-500'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${link.readLater ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={() => onShare(link)}
                  className={`p-1 sm:p-1.5 rounded-lg transition-all duration-200 hover:scale-110 ${
                    darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Share2 className="w-5 h-5 sm:w-5 sm:h-5" />
                </button>
              </>
            )}

            <button
              onClick={handleOpenLink}
              className={`p-1 sm:p-1.5 rounded-lg transition-all duration-200 hover:scale-110 ${
                isTrashView 
                  ? darkMode 
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              disabled={isTrashView}
            >
              <ExternalLink className="w-5 h-5 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Compact View Layout
  if (viewLayout === 'compact') {
    return (
      <div 
        className={`group relative rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden ${
          isSelected 
            ? darkMode 
              ? 'bg-blue-900 border-blue-600 shadow-blue-900/20' 
              : 'bg-blue-50 border-blue-300 shadow-blue-900/10'
            : darkMode 
              ? 'bg-gray-800 border-gray-700 hover:shadow-gray-900/20' 
              : 'bg-white border-gray-200 hover:shadow-gray-900/10'
        }`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Selection Checkbox */}
        {isSelectionMode && (
          <div className="absolute top-2 left-2 z-20">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelection(link.id)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
          </div>
        )}

        {/* Action Menu */}
        {!isSelectionMode && (
          <div className={`absolute top-2 right-2 z-10 transition-opacity duration-200 ${
            showActions ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="flex space-x-0.5">
              {isTrashView ? (
                <button
                  onClick={handleRestore}
                  className={`p-0.5 sm:p-1 rounded transition-all duration-200 hover:scale-110 ${
                    darkMode ? 'bg-gray-700 text-gray-300 hover:text-green-400' : 'bg-white text-gray-600 hover:text-green-600'
                  } shadow-sm`}
                  title={t(language, 'restoreFromTrash')}
                >
                  <RotateCcw className="w-4 h-4 sm:w-4 sm:h-4" />
                </button>
              ) : (
                <button
                  onClick={() => onEdit(link)}
                  className={`p-0.5 sm:p-1 rounded transition-all duration-200 hover:scale-110 ${
                    darkMode ? 'bg-gray-700 text-gray-300 hover:text-blue-400' : 'bg-white text-gray-600 hover:text-blue-600'
                  } shadow-sm`}
                  title={t(language, 'editLink')}
                >
                  <Edit className="w-4 h-4 sm:w-4 sm:h-4" />
                </button>
              )}
              <button
                onClick={handleDelete}
                className={`p-0.5 sm:p-1 rounded transition-all duration-200 hover:scale-110 ${
                  darkMode ? 'bg-gray-700 text-gray-300 hover:text-red-400' : 'bg-white text-gray-600 hover:text-red-600'
                } shadow-sm`}
                title={isTrashView ? t(language, 'deleteForever') : t(language, 'moveToTrash')}
              >
                <Trash2 className="w-4 h-4 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Image */}
        {link.image && (
          <div className="aspect-square sm:aspect-video bg-gray-100 overflow-hidden">
            <img
              src={link.image}
              alt={link.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="p-2 sm:p-3">
          <h3 className={`font-semibold text-xs sm:text-sm leading-tight mb-1 line-clamp-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {link.title}
          </h3>
          
          {/* Trash Info for Compact View */}
          {isTrashView && (
            <div className={`text-xs mb-1 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <div className="flex items-center space-x-1">
                <Clock className="w-2.5 h-2.5" />
                <span>
                  {link.deletedAt ? new Date(link.deletedAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US') : ''}
                </span>
              </div>
            </div>
          )}
          
          {/* Folder */}
          <div className="flex items-center justify-between mt-1 sm:mt-2">
            {!isTrashView && (
              <span className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${
                link.folder === 'Work' 
                  ? darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                  : link.folder === 'Study'
                  ? darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
                  : darkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-800'
              }`}>
                {['Work', 'Study', 'Fun', 'Personal'].includes(link.folder) 
                  ? t(language, link.folder.toLowerCase()) 
                  : link.folder
                }
              </span>
            )}

            {!isSelectionMode && (
              <div className="flex items-center space-x-0.5 sm:space-x-1">
                {isTrashView ? (
                  <button
                    onClick={handleRestore}
                    className={`p-0.5 sm:p-1 rounded transition-all duration-200 hover:scale-110 ${
                      darkMode ? 'text-gray-400 hover:text-green-400' : 'text-gray-500 hover:text-green-500'
                    }`}
                    title={t(language, 'restore')}
                  >
                    <RotateCcw className="w-4 h-4 sm:w-4 sm:h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => onToggleFavorite(link.id)}
                    className={`p-0.5 sm:p-1 rounded transition-all duration-200 hover:scale-110 ${
                      link.isFavorite
                        ? 'text-red-500 hover:text-red-600'
                        : darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 sm:w-4 sm:h-4 ${link.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                )}

                <button
                  onClick={handleOpenLink}
                  className={`p-0.5 sm:p-1 rounded transition-all duration-200 hover:scale-110 ${
                    isTrashView 
                      ? darkMode 
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                        : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  disabled={isTrashView}
                >
                  <ExternalLink className="w-4 h-4 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default Grid View Layout
  return (
    <div 
      className={`group relative bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden ${
        isSelected 
          ? darkMode 
            ? 'bg-blue-900 border-blue-600 shadow-blue-900/20' 
            : 'bg-blue-50 border-blue-300 shadow-blue-900/10'
          : darkMode 
            ? 'bg-gray-800 border-gray-700 hover:shadow-gray-900/20' 
            : 'bg-white border-gray-200 hover:shadow-gray-900/10'
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Selection Checkbox */}
      {isSelectionMode && (
        <div className="absolute top-3 left-3 z-20">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelection(link.id)}
            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
        </div>
      )}

      {/* Action Menu */}
      {!isSelectionMode && (
        <div className={`absolute top-2 right-2 z-10 transition-opacity duration-200 ${
          showActions ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex space-x-0.5 sm:space-x-1">
            {isTrashView ? (
              <button
                onClick={handleRestore}
                className={`p-1 sm:p-1.5 rounded-lg transition-all duration-200 hover:scale-110 ${
                  darkMode ? 'bg-gray-700 text-gray-300 hover:text-green-400' : 'bg-white text-gray-600 hover:text-green-600'
                } shadow-sm`}
                title={t(language, 'restoreFromTrash')}
              >
                <RotateCcw className="w-5 h-5 sm:w-5 sm:h-5" />
              </button>
            ) : (
              <button
                onClick={() => onEdit(link)}
                className={`p-1 sm:p-1.5 rounded-lg transition-all duration-200 hover:scale-110 ${
                  darkMode ? 'bg-gray-700 text-gray-300 hover:text-blue-400' : 'bg-white text-gray-600 hover:text-blue-600'
                } shadow-sm`}
                title={t(language, 'editLink')}
              >
                <Edit className="w-5 h-5 sm:w-5 sm:h-5" />
              </button>
            )}
            <button
              onClick={handleDelete}
              className={`p-1 sm:p-1.5 rounded-lg transition-all duration-200 hover:scale-110 ${
                darkMode ? 'bg-gray-700 text-gray-300 hover:text-red-400' : 'bg-white text-gray-600 hover:text-red-600'
              } shadow-sm`}
              title={isTrashView ? t(language, 'deleteForever') : t(language, 'moveToTrash')}
            >
              <Trash2 className="w-5 h-5 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      )}
      
      {/* Link Image */}
      {link.image && (
        <div className="aspect-video bg-gray-100 overflow-hidden">
          <img
            src={link.image}
            alt={link.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-3 sm:p-4 md:p-6">
        {/* Header with actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className={`font-semibold text-sm sm:text-base md:text-lg leading-tight mb-2 line-clamp-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {link.title}
            </h3>
            {link.description && (
              <p className={`text-xs sm:text-sm line-clamp-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {link.description}
              </p>
            )}
          </div>
        </div>

        {/* Tags */}
        {!isTrashView && link.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
            {link.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded-full ${
                  darkMode 
                    ? 'bg-blue-900 text-blue-200' 
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {tag}
              </span>
            ))}
            {link.tags.length > 2 && (
              <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded-full ${
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                +{link.tags.length - 2}
              </span>
            )}
          </div>
        )}
        
        {/* Trash Info for Grid View */}
        {isTrashView && (
          <div className={`text-xs mb-3 p-2 rounded-lg ${
            darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
          }`}>
            <div className="flex items-center space-x-1 mb-1">
              <Clock className="w-3 h-3" />
              <span>
                {t(language, 'deletedOn', { 
                  date: link.deletedAt ? new Date(link.deletedAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US') : '' 
                })}
              </span>
            </div>
            {link.originalFolder && (
              <div>
                {t(language, 'originalFolder', { 
                  folder: ['Work', 'Study', 'Fun', 'Personal'].includes(link.originalFolder) 
                    ? t(language, link.originalFolder.toLowerCase()) 
                    : link.originalFolder 
                })}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {!isTrashView && (
              <span className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${
                link.folder === 'Work' 
                  ? darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                  : link.folder === 'Study'
                  ? darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
                  : darkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-800'
              }`}>
                {['Work', 'Study', 'Fun', 'Personal'].includes(link.folder) 
                  ? t(language, link.folder.toLowerCase()) 
                  : link.folder
                }
              </span>
            )}
          </div>

          {!isSelectionMode && (
            <div className="flex items-center space-x-1 sm:space-x-2">
              {isTrashView ? (
                <button
                  onClick={handleRestore}
                  className={`p-1 sm:p-1.5 rounded-lg transition-all duration-200 hover:scale-110 ${
                    darkMode ? 'text-gray-400 hover:text-green-400' : 'text-gray-500 hover:text-green-500'
                  }`}
                  title={t(language, 'restore')}
                >
                  <RotateCcw className="w-5 h-5 sm:w-5 sm:h-5" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onToggleFavorite(link.id)}
                    className={`p-1 sm:p-1.5 rounded-lg transition-all duration-200 hover:scale-110 ${
                      link.isFavorite
                        ? 'text-red-500 hover:text-red-600'
                        : darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 sm:w-5 sm:h-5 ${link.isFavorite ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={() => onToggleReadLater(link.id)}
                    className={`p-1 sm:p-1.5 rounded-lg transition-all duration-200 hover:scale-110 ${
                      link.readLater
                        ? 'text-blue-500 hover:text-blue-600'
                        : darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-500'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 sm:w-5 sm:h-5 ${link.readLater ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={() => onShare(link)}
                    className={`p-1 sm:p-1.5 rounded-lg transition-all duration-200 hover:scale-110 ${
                      darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Share2 className="w-5 h-5 sm:w-5 sm:h-5" />
                  </button>
                </>
              )}

              <button
                onClick={handleOpenLink}
                className={`p-1 sm:p-1.5 rounded-lg transition-all duration-200 hover:scale-110 ${
                  isTrashView 
                    ? darkMode 
                      ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                      : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={isTrashView}
              >
                <ExternalLink className="w-5 h-5 sm:w-5 sm:h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
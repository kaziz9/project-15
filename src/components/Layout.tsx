import React from 'react';
import { Search, Moon, Sun, Menu, X, Languages, Info, Database } from 'lucide-react';
import { t } from '../utils/translations';

interface LayoutProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  language: 'ar' | 'en';
  onToggleLanguage: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenAbout: () => void;
  onOpenDataManagement: () => void;
  children: React.ReactNode;
}

export function Layout({
  darkMode,
  onToggleDarkMode,
  language,
  onToggleLanguage,
  searchTerm,
  onSearchChange,
  isSidebarOpen,
  onToggleSidebar,
  onOpenAbout,
  onOpenDataManagement,
  children
}: LayoutProps) {
  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 border-b transition-colors duration-200 ${
        darkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
            {/* Left side - Menu button and Logo */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={onToggleSidebar}
                data-menu-button
                className={`p-1.5 sm:p-2 rounded-lg transition-colors md:hidden ${
                  darkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {isSidebarOpen ? (
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
              
              <div className="flex items-center space-x-2 sm:space-x-3">
                <img 
                  src="/logo3.png" 
                  alt="MyWaslat Logo" 
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-blue-500 hover:border-blue-600 transition-all duration-300 hover:scale-110 hover:rotate-12 cursor-pointer shadow-md hover:shadow-lg"
                />
                <div className="hidden xs:block">
                  <h1 className={`text-lg sm:text-xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    MyWaslat
                  </h1>
                  <p className={`text-xs sm:text-sm font-medium ${
                    darkMode ? 'text-blue-300' : 'text-blue-600'
                  }`}>
                    {t(language, 'tagline')}
                  </p>
                </div>
              </div>
            </div>

            {/* Center - Search */}
            <div className="flex-1 max-w-md mx-3 sm:mx-4 md:mx-6">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  placeholder={t(language, 'searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border transition-colors ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                />
              </div>
            </div>

            {/* Right side - Language and Dark mode toggles */}
            <div className="flex items-center space-x-2">
              {/* Language Toggle */}
              <button
                onClick={onToggleLanguage}
                className={`relative p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                  darkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title={t(language, 'switchToEnglish')}
              >
                <div className="relative">
                  <Languages className="w-6 h-6 sm:w-7 sm:h-7" />
                  <span className={`absolute -bottom-1 -right-1 text-xs font-bold px-1 py-0.5 rounded-full text-white ${
                    language === 'ar' ? 'bg-green-600' : 'bg-blue-600'
                  }`}>
                    {language === 'ar' ? 'ع' : 'EN'}
                  </span>
                </div>
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={onToggleDarkMode}
                className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                  darkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title={darkMode ? t(language, 'lightMode') : t(language, 'darkMode')}
              >
                {darkMode ? (
                  <Sun className="w-6 h-6 sm:w-7 sm:h-7" />
                ) : (
                  <Moon className="w-6 h-6 sm:w-7 sm:h-7" />
                )}
              </button>

              {/* About Button */}
              <button
                onClick={onOpenAbout}
                className={`relative p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                  darkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title={t(language, 'about')}
              >
                <Info className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>

              {/* Data Management Button */}
              <button
                onClick={onOpenDataManagement}
                className={`relative p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                  darkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title={t(language, 'dataManagement')}
              >
                <Database className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {children}
    </div>
  );
}
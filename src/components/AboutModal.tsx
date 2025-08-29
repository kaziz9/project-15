import React from 'react';
import { X, Heart, Star, Shield, Smartphone, Share2 } from 'lucide-react';
import { t } from '../utils/translations';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  language: 'ar' | 'en';
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  darkMode,
  language
}) => {
  if (!isOpen) return null;

  const features = [
    'feature1',
    'feature2', 
    'feature3',
    'feature4',
    'feature5',
    'feature6',
    'feature7',
    'feature8'
  ];

  const handleShare = async () => {
    const shareData = {
      title: 'MyWaslat - Link Management App',
      text: language === 'ar' 
        ? 'اكتشف MyWaslat - تطبيق ذكي لحفظ وتنظيم روابطك في مكان واحد آمن وسهل الاستخدام!'
        : 'Discover MyWaslat - A smart app to save and organize all your links in one safe and easy place!',
      url: window.location.origin
    };

    // Check if native sharing is available and supported
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Only handle actual errors, not user cancellation
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
        // Don't attempt clipboard fallback here as document may not be focused
      }
    } else {
      // Fallback: copy to clipboard when native share is not available
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        alert(language === 'ar' 
          ? 'تم نسخ معلومات التطبيق إلى الحافظة!' 
          : 'App information copied to clipboard!'
        );
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError);
        // Final fallback: show the information to user
        alert(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b bg-inherit rounded-t-xl">
          <div className="flex items-center space-x-3">
            <img 
              src="/logo3.png" 
              alt="MyWaslat Logo" 
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
            />
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t(language, 'appTitle')}
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

        <div className="p-6 space-y-6">
          {/* Description */}
          <div className={language === 'ar' ? 'text-right' : 'text-left'} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className={`text-base leading-relaxed whitespace-pre-line ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t(language, 'aboutDescription')}
            </div>
          </div>

          {/* Features */}
          <div className={language === 'ar' ? 'text-right' : 'text-left'} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              {t(language, 'features')}
            </h3>
            
            <div className="grid gap-3 sm:grid-cols-2">
              {features.map((feature, index) => (
                <div
                  key={feature}
                  className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                    language === 'ar' ? 'space-x-reverse' : ''
                  } ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {t(language, feature)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className={`pt-4 border-t ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            {/* Share Button */}
            <div className="text-center mb-4">
              <button
                onClick={handleShare}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  language === 'ar' ? 'space-x-reverse' : ''
                } ${
                  darkMode 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <Share2 className="w-5 h-5" />
                <span className="font-medium">
                  {language === 'ar' ? 'شارك التطبيق' : 'Share App'}
                </span>
              </button>
            </div>
            
            {/* Copyright */}
            <div className={`text-center text-xs mb-3 ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {t(language, 'copyright')}
            </div>
            
            <div className="text-center">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t(language, 'closeAbout')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
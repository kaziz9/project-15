import React, { useState, useEffect } from 'react';
import { X, Plus, Globe, Upload, Image } from 'lucide-react';
import { Link } from '../types';
import { t } from '../utils/translations';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLink: (link: Omit<Link, 'id' | 'createdAt'>) => void;
  onAddFolder: (folderName: string) => void;
  darkMode: boolean;
  language: 'ar' | 'en';
  availableFolders: string[];
  allTags: string[];
}

export const AddLinkModal: React.FC<AddLinkModalProps> = ({
  isOpen,
  onClose,
  onAddLink,
  onAddFolder,
  darkMode,
  language,
  availableFolders,
  allTags
}) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [folder, setFolder] = useState('Work');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploadMethod, setImageUploadMethod] = useState<'url' | 'upload'>('url');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');


  const normalizeUrl = (inputUrl: string): string => {
    if (!inputUrl) return '';
    
    // Remove whitespace
    const cleanUrl = inputUrl.trim();
    
    // If it already has a protocol, return as is
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      return cleanUrl;
    }
    
    // Add https:// if missing
    return `https://${cleanUrl}`;
  };

  useEffect(() => {
    if (!isOpen) {
      setUrl('');
      setTitle('');
      setDescription('');
      setImage('');
      setFolder('Work');
      setTags([]);
      setNewTag('');
    } else {
      // Set default folder to first available folder
      if (availableFolders.length > 0) {
        setFolder(availableFolders[0]);
      }
    }
  }, [isOpen, availableFolders]);

  const fetchPreview = async () => {
    if (!url) return;
    
    const normalizedUrl = normalizeUrl(url);
    setUrl(normalizedUrl);
    
    setIsLoading(true);
    
    try {
      const urlObj = new URL(normalizedUrl);
      const domain = urlObj.hostname;
      
      // Check if it's a YouTube URL
      if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
        let videoId = '';
        
        if (domain.includes('youtube.com')) {
          const urlParams = new URLSearchParams(urlObj.search);
          videoId = urlParams.get('v') || '';
        } else if (domain.includes('youtu.be')) {
          videoId = urlObj.pathname.slice(1);
        }
        
        if (videoId) {
          setTitle(`${language === 'ar' ? 'فيديو يوتيوب' : 'YouTube Video'} - ${videoId}`);
          setDescription(language === 'ar' ? 'فيديو من يوتيوب - يمكنك تعديل العنوان والوصف' : 'YouTube video - you can edit the title and description');
          setImage(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
        }
      } else {
        // For other websites, use a generic preview
        setTitle(`${language === 'ar' ? 'مقال من' : 'Article from'} ${domain}`);
        setDescription(language === 'ar' ? 'يمكنك تعديل العنوان والوصف والصورة حسب رغبتك' : 'You can edit the title, description and image as you wish');
        setImage('https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800');
      }
    } catch (error) {
      setTitle(language === 'ar' ? 'رابط جديد' : 'New Link');
      setDescription(language === 'ar' ? 'يرجى إضافة عنوان ووصف مخصص' : 'Please add a custom title and description');
      setImage('');
    }
    
    setIsLoading(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert(language === 'ar' ? 'يرجى اختيار ملف صورة صالح' : 'Please select a valid image file');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(language === 'ar' ? 'حجم الصورة كبير جداً. يرجى اختيار صورة أصغر من 5 ميجابايت' : 'Image size is too large. Please select an image smaller than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImage(result);
      };
      reader.readAsDataURL(file);
    }
  };
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url || !title) return;

    const normalizedUrl = normalizeUrl(url);

    // If folder doesn't exist in available folders, create it
    if (!availableFolders.includes(folder)) {
      onAddFolder(folder);
    }
    onAddLink({
      url: normalizedUrl,
      title,
      description,
      image,
      folder,
      tags,
      isFavorite: false,
      readLater: false
    });

    onClose();
  };

  const handleAddNewFolder = () => {
    if (newFolderName.trim() && !availableFolders.includes(newFolderName.trim())) {
      onAddFolder(newFolderName.trim());
      setFolder(newFolderName.trim());
      setNewFolderName('');
      setShowNewFolderInput(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="sticky top-0 flex items-center justify-between p-6 border-b bg-inherit rounded-t-xl">
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t(language, 'addNewLink')}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* URL Input */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {t(language, 'urlLabel')}
            </label>
            <div className="flex space-x-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={(e) => setUrl(normalizeUrl(e.target.value))}
                placeholder={t(language, 'urlPlaceholder')}
                className={`flex-1 px-3 py-2 border rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                required
              />
              <button
                type="button"
                onClick={fetchPreview}
                disabled={!url || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? t(language, 'loading') : t(language, 'preview')}
              </button>
            </div>
          </div>

          {/* Preview Card */}

          {/* Custom Image URL */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {t(language, 'customImage')}
            </label>
            
            {/* Image Upload Method Toggle */}
            <div className="flex space-x-2 mb-3">
              <button
                type="button"
                onClick={() => setImageUploadMethod('url')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  imageUploadMethod === 'url'
                    ? 'bg-blue-600 text-white'
                    : darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Globe className="w-5 h-5" />
                <span>{t(language, 'imageUrl')}</span>
              </button>
              <button
                type="button"
                onClick={() => setImageUploadMethod('upload')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  imageUploadMethod === 'upload'
                    ? 'bg-blue-600 text-white'
                    : darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Upload className="w-5 h-5" />
                <span>{t(language, 'uploadFromDevice')}</span>
              </button>
            </div>

            {/* Image URL Input */}
            {imageUploadMethod === 'url' && (
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder={t(language, 'imageUrlPlaceholder')}
                className={`w-full px-3 py-2 border rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            )}

            {/* Image Upload Input */}
            {imageUploadMethod === 'upload' && (
              <div>
                {image && imageUploadMethod === 'upload' ? (
                  <div className="space-y-3">
                    {/* Image Preview */}
                    <div className={`relative rounded-lg overflow-hidden border-2 ${
                      darkMode ? 'border-green-600' : 'border-green-500'
                    }`}>
                      <img
                        src={image}
                        alt={language === 'ar' ? 'معاينة الصورة' : 'Image Preview'}
                        className="w-full h-48 object-cover"
                      />
                      <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                        darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                      }`}>
                        {t(language, 'imageUploaded')}
                      </div>
                    </div>
                    
                    {/* Change Image Button */}
                    <div className="flex space-x-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload-change"
                      />
                      <label
                        htmlFor="image-upload-change"
                        className={`flex-1 flex items-center justify-center px-4 py-2 border border-dashed rounded-lg cursor-pointer transition-colors ${
                          darkMode 
                            ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300' 
                            : 'border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Image className="w-5 h-5 mr-2" />
                        <span className="text-sm">{t(language, 'changeImage')}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setImage('')}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                          darkMode 
                            ? 'bg-red-900 text-red-200 hover:bg-red-800' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {t(language, 'delete')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className={`flex items-center justify-center w-full px-4 py-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300' 
                          : 'border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <div className="text-center">
                        <Image className="w-10 h-10 mx-auto mb-2" />
                        <p className="text-sm font-medium">{t(language, 'clickToSelectImage')}</p>
                        <p className="text-xs mt-1">{t(language, 'imageFormats')}</p>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            )}
            
            <p className={`text-xs mt-1 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {t(language, 'imageDescription')}
            </p>
          </div>

          {/* Custom Title */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {t(language, 'customTitle')}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t(language, 'titlePlaceholder')}
              className={`w-full px-3 py-2 border rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              required
            />
          </div>

          {/* Custom Description */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {t(language, 'customDescription')}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t(language, 'descriptionPlaceholder')}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg resize-none ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          {/* Folder Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {t(language, 'folder')}
            </label>
            
            {showNewFolderInput ? (
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddNewFolder()}
                    placeholder={t(language, 'newFolderPlaceholder')}
                    className={`flex-1 px-3 py-2 border rounded-lg ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleAddNewFolder}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {t(language, 'save')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewFolderInput(false);
                      setNewFolderName('');
                    }}
                    className={`px-4 py-2 border rounded-lg transition-colors ${
                      darkMode 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {t(language, 'cancel')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <select
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {availableFolders.map(f => (
                    <option key={f} value={f}>
                      {['Work', 'Study', 'Fun', 'Personal'].includes(f) 
                        ? t(language, f.toLowerCase()) 
                        : f
                      }
                    </option>
                  ))}
                </select>
                
                <button
                  type="button"
                  onClick={() => setShowNewFolderInput(true)}
                  className={`w-full flex items-center justify-center space-x-2 px-3 py-2 border border-dashed rounded-lg transition-colors ${
                    darkMode 
                      ? 'border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-300' 
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">{t(language, 'addNewFolder')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {t(language, 'tags')}
            </label>
            
            {/* Existing Tags Suggestions */}
            {allTags.length > 0 && (
              <div className="mb-3">
                <p className={`text-xs mb-2 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {t(language, 'savedTags')}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {allTags.filter(tag => !tags.includes(tag)).slice(0, 8).map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (!tags.includes(tag)) {
                          setTags([...tags, tag]);
                        }
                      }}
                      className={`px-2 py-1 text-xs rounded-full transition-all duration-200 hover:scale-105 ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-blue-700 hover:text-blue-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-800'
                      }`}
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder={t(language, 'addTag')}
                className={`flex-1 px-3 py-2 border rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                      darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {t(language, 'cancel')}
            </button>
            <button
              type="submit"
              disabled={!url || !title}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {t(language, 'saveLink')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
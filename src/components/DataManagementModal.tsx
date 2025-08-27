import React, { useState } from 'react';
import { X, Download, Upload, Database, Trash2, Info, FileText, HardDrive } from 'lucide-react';
import { t } from '../utils/translations';
import { exportData, importData, clearDatabase, getDatabaseStats } from '../utils/database';
import * as XLSX from 'xlsx';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  language: 'ar' | 'en';
  onDataImported: () => void;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  darkMode,
  language,
  onDataImported
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [pendingImportData, setPendingImportData] = useState<any>(null);
  const [showImportPreview, setShowImportPreview] = useState(false);

  const stats = getDatabaseStats();

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const data = JSON.parse(exportData());
      
      // Create workbook
      const workbook = XLSX.utils.book_new();
      
      // Prepare links data for Excel
      const linksData = data.links.map((link: any) => ({
        'العنوان / Title': link.title,
        'الرابط / URL': link.url,
        'الوصف / Description': link.description,
        'المجلد / Folder': link.folder,
        'الوسوم / Tags': link.tags.join(', '),
        'مفضل / Favorite': link.isFavorite ? 'نعم / Yes' : 'لا / No',
        'قراءة لاحقاً / Read Later': link.readLater ? 'نعم / Yes' : 'لا / No',
        'تاريخ الإنشاء / Created': new Date(link.createdAt).toLocaleDateString('ar-SA'),
        'رابط الصورة / Image URL': link.image || ''
      }));
      
      // Prepare folders data
      const foldersData = data.folders.map((folder: string) => ({
        'اسم المجلد / Folder Name': folder
      }));
      
      // Prepare settings data
      const settingsData = [
        { 'الإعداد / Setting': 'الوضع المظلم / Dark Mode', 'القيمة / Value': data.settings.darkMode ? 'مفعل / Enabled' : 'معطل / Disabled' },
        { 'الإعداد / Setting': 'اللغة / Language', 'القيمة / Value': data.settings.language === 'ar' ? 'العربية / Arabic' : 'الإنجليزية / English' },
        { 'الإعداد / Setting': 'تخطيط العرض / View Layout', 'القيمة / Value': data.settings.viewLayout },
        { 'الإعداد / Setting': 'العرض الحالي / Current View', 'القيمة / Value': data.settings.currentView }
      ];
      
      // Add worksheets
      const linksWorksheet = XLSX.utils.json_to_sheet(linksData);
      const foldersWorksheet = XLSX.utils.json_to_sheet(foldersData);
      const settingsWorksheet = XLSX.utils.json_to_sheet(settingsData);
      
      // Set column widths for better readability
      linksWorksheet['!cols'] = [
        { width: 30 }, // Title
        { width: 50 }, // URL
        { width: 40 }, // Description
        { width: 15 }, // Folder
        { width: 25 }, // Tags
        { width: 15 }, // Favorite
        { width: 15 }, // Read Later
        { width: 15 }, // Created
        { width: 50 }  // Image URL
      ];
      
      foldersWorksheet['!cols'] = [{ width: 25 }];
      settingsWorksheet['!cols'] = [{ width: 30 }, { width: 20 }];
      
      // Add sheets to workbook
      XLSX.utils.book_append_sheet(workbook, linksWorksheet, 'الروابط - Links');
      XLSX.utils.book_append_sheet(workbook, foldersWorksheet, 'المجلدات - Folders');
      XLSX.utils.book_append_sheet(workbook, settingsWorksheet, 'الإعدادات - Settings');
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `mywaslat-backup-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert(t(language, 'exportError'));
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    const isJson = file.name.endsWith('.json');
    
    if (!isExcel && !isJson) {
      setImportStatus('error');
      setIsImporting(false);
      return;
    }
    setIsImporting(true);
    setImportStatus('idle');


    if (isExcel) {
      // Handle Excel file
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Read links sheet
          const linksSheetName = workbook.SheetNames.find(name => 
            name.includes('Links') || name.includes('الروابط')
          ) || workbook.SheetNames[0];
          
          if (!linksSheetName) {
            throw new Error('No links sheet found');
          }
          
          const linksSheet = workbook.Sheets[linksSheetName];
          const linksData = XLSX.utils.sheet_to_json(linksSheet);
          
          // Convert Excel data back to app format
          const convertedLinks = linksData.map((row: any, index: number) => ({
            id: Date.now().toString() + index,
            title: row['العنوان / Title'] || row['Title'] || '',
            url: row['الرابط / URL'] || row['URL'] || '',
            description: row['الوصف / Description'] || row['Description'] || '',
            folder: row['المجلد / Folder'] || row['Folder'] || 'Personal',
            tags: (row['الوسوم / Tags'] || row['Tags'] || '').split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag),
            isFavorite: (row['مفضل / Favorite'] || row['Favorite'] || '').includes('نعم') || (row['مفضل / Favorite'] || row['Favorite'] || '').includes('Yes'),
            readLater: (row['قراءة لاحقاً / Read Later'] || row['Read Later'] || '').includes('نعم') || (row['قراءة لاحقاً / Read Later'] || row['Read Later'] || '').includes('Yes'),
            image: row['رابط الصورة / Image URL'] || row['Image URL'] || '',
            createdAt: new Date().toISOString()
          }));
          
          // Read folders sheet if exists
          const foldersSheetName = workbook.SheetNames.find(name => 
            name.includes('Folders') || name.includes('المجلدات')
          );
          
          let folders = ['Work', 'Study', 'Fun', 'Personal'];
          if (foldersSheetName) {
            const foldersSheet = workbook.Sheets[foldersSheetName];
            const foldersData = XLSX.utils.sheet_to_json(foldersSheet);
            const customFolders = foldersData.map((row: any) => 
              row['اسم المجلد / Folder Name'] || row['Folder Name'] || ''
            ).filter((folder: string) => folder);
            folders = Array.from(new Set([...folders, ...customFolders]));
          }
          
          // Create import data structure
          const importDataStructure = {
            links: convertedLinks,
            folders: folders,
            settings: {
              darkMode: false,
              language: 'ar',
              viewLayout: 'grid',
              currentView: 'all'
            },
            exportDate: new Date().toISOString(),
            version: '1.0'
          };
          
          // Show preview instead of importing directly
          setPendingImportData(importDataStructure);
          setShowImportPreview(true);
          setIsImporting(false);
        } catch (error) {
          console.error('Error importing Excel data:', error);
          setImportStatus('error');
          setIsImporting(false);
        } finally {
          // Reset file input
          event.target.value = '';
        }
      };
      
      reader.onerror = () => {
        setImportStatus('error');
        setIsImporting(false);
        event.target.value = '';
      };
      
      reader.readAsArrayBuffer(file);
    } else {
      // Handle JSON file (backward compatibility)
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = e.target?.result as string;
          const parsedData = JSON.parse(jsonData);
          
          // Show preview instead of importing directly
          setPendingImportData(parsedData);
          setShowImportPreview(true);
          setIsImporting(false);
        } catch (error) {
          console.error('Error importing data:', error);
          setImportStatus('error');
          setIsImporting(false);
        } finally {
          // Reset file input
          event.target.value = '';
        }
      };

      reader.onerror = () => {
        setImportStatus('error');
        setIsImporting(false);
        event.target.value = '';
      };

      reader.readAsText(file);
    }
  };
  const handleConfirmImport = () => {
    if (!pendingImportData) return;
    
    setIsImporting(true);
    try {
      const success = importData(JSON.stringify(pendingImportData));
      
      if (success) {
        setImportStatus('success');
        onDataImported();
        setShowImportPreview(false);
        setPendingImportData(null);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setImportStatus('error');
      }
    } catch (error) {
      console.error('Error confirming import:', error);
      setImportStatus('error');
    } finally {
      setIsImporting(false);
    }
  };

  const handleCancelImport = () => {
    setPendingImportData(null);
    setShowImportPreview(false);
    setImportStatus('idle');
  };

  const handleClearData = () => {
    const confirmMessage = t(language, 'clearDataConfirm');
    if (window.confirm(confirmMessage)) {
      clearDatabase();
      onDataImported();
      onClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b bg-inherit rounded-t-xl">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-blue-500" />
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t(language, 'dataManagement')}
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
          {/* Statistics */}
          <div className={`p-4 rounded-lg border ${
            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-3 flex items-center ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <Info className="w-5 h-5 mr-2 text-blue-500" />
              {t(language, 'dataStatistics')}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {stats.totalLinks}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t(language, 'totalLinks')}
                </div>
              </div>
              
              <div className="text-center">
                <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {stats.totalFolders}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t(language, 'totalFolders')}
                </div>
              </div>
              
              <div className="text-center">
                <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  {stats.totalTags}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t(language, 'totalTags')}
                </div>
              </div>
              
              <div className="text-center">
                <div className={`text-2xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                  {formatFileSize(stats.storageUsed)}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t(language, 'storageUsed')}
                </div>
              </div>
            </div>
          </div>

          {/* Export Data */}
          <div className={`p-4 rounded-lg border ${
            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-3 flex items-center ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <Download className="w-5 h-5 mr-2 text-green-500" />
              {t(language, 'exportData')}
            </h3>
            
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t(language, 'exportDescription')}
            </p>
            
            <button
              onClick={handleExportData}
              disabled={isExporting}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isExporting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              <FileText className="w-5 h-5" />
              <span>
                {isExporting ? t(language, 'exporting') : t(language, 'exportToFile')}
              </span>
            </button>
          </div>

          {/* Import Data */}
          <div className={`p-4 rounded-lg border ${
            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-3 flex items-center ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <Upload className="w-5 h-5 mr-2 text-blue-500" />
              {t(language, 'importData')}
            </h3>
            
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t(language, 'importDescription')}
            </p>
            
            {/* Import Preview */}
            {showImportPreview && pendingImportData && (
              <div className={`p-4 rounded-lg mb-4 border-2 ${
                darkMode ? 'bg-gray-800 border-blue-600' : 'bg-blue-50 border-blue-300'
              }`}>
                <h4 className={`font-semibold mb-3 flex items-center ${
                  darkMode ? 'text-blue-300' : 'text-blue-800'
                }`}>
                  <Info className="w-5 h-5 mr-2" />
                  {t(language, 'importPreview')}
                </h4>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="text-center">
                    <div className={`text-xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      {pendingImportData.links?.length || 0}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {t(language, 'totalLinks')}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className={`text-xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                      {pendingImportData.folders?.length || 0}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {t(language, 'totalFolders')}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className={`text-xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                      {Array.from(new Set(pendingImportData.links?.flatMap((link: any) => link.tags) || [])).length}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {t(language, 'totalTags')}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className={`text-xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                      {pendingImportData.links?.filter((link: any) => link.isFavorite).length || 0}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {t(language, 'favorites')}
                    </div>
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg mb-4 ${
                  darkMode ? 'bg-yellow-900/20 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  <p className="text-sm font-medium">
                    ⚠️ {t(language, 'importWarning')}
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleConfirmImport}
                    disabled={isImporting}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isImporting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white`}
                  >
                    <span>
                      {isImporting ? t(language, 'importing') : t(language, 'confirmImport')}
                    </span>
                  </button>
                  
                  <button
                    onClick={handleCancelImport}
                    disabled={isImporting}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {t(language, 'cancel')}
                  </button>
                </div>
              </div>
            )}
            
            {importStatus === 'success' && (
              <div className={`p-3 rounded-lg mb-4 ${
                darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
              }`}>
                {t(language, 'importSuccess')}
              </div>
            )}
            
            {importStatus === 'error' && (
              <div className={`p-3 rounded-lg mb-4 ${
                darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
              }`}>
                {t(language, 'importError')}
              </div>
            )}
            
            {!showImportPreview && (
            <div>
              <input
                type="file"
                accept=".xlsx,.xls,.json"
                onChange={handleImportData}
                disabled={isImporting}
                className="hidden"
                id="import-file"
              />
              <label
                htmlFor="import-file"
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  isImporting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : darkMode
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                <HardDrive className="w-5 h-5" />
                <span>
                  {isImporting ? t(language, 'importing') : t(language, 'selectFile')}
                </span>
              </label>
            </div>
            )}
          </div>

          {/* Clear Data */}
          <div className={`p-4 rounded-lg border border-red-300 ${
            darkMode ? 'bg-red-900/20' : 'bg-red-50'
          }`}>
            <h3 className={`text-lg font-semibold mb-3 flex items-center ${
              darkMode ? 'text-red-400' : 'text-red-700'
            }`}>
              <Trash2 className="w-5 h-5 mr-2" />
              {t(language, 'clearAllData')}
            </h3>
            
            <p className={`text-sm mb-4 ${
              darkMode ? 'text-red-300' : 'text-red-600'
            }`}>
              {t(language, 'clearDataWarning')}
            </p>
            
            <button
              onClick={handleClearData}
              className={`px-4 py-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'bg-red-800 hover:bg-red-700 text-red-200' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {t(language, 'clearData')}
            </button>
          </div>

          {/* Close Button */}
          <div className="text-center pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t(language, 'close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
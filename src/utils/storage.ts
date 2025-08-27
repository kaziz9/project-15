// نظام التخزين الدائم المحسّن
const STORAGE_KEY = "app:data:v1";

// حفظ البيانات
export const saveState = (key: string, value: any): boolean => {
  try {
    // تحميل البيانات الحالية
    const currentData = loadAllData();
    
    // تحديث المفتاح المحدد
    currentData[key] = value;
    
    // حفظ البيانات المحدثة
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
    return true;
  } catch (error) {
    console.error(`خطأ في حفظ البيانات للمفتاح "${key}":`, error);
    return false;
  }
};

// تحميل البيانات
export const loadState = <T>(key: string, defaultVal: T): T => {
  try {
    const allData = loadAllData();
    
    // إرجاع القيمة إذا وُجدت، وإلا القيمة الافتراضية
    return allData.hasOwnProperty(key) ? allData[key] : defaultVal;
  } catch (error) {
    console.error(`خطأ في تحميل البيانات للمفتاح "${key}":`, error);
    return defaultVal;
  }
};

// تحميل جميع البيانات من localStorage
const loadAllData = (): Record<string, any> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    
    const parsed = JSON.parse(stored);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (error) {
    console.error('خطأ في تحميل البيانات من localStorage:', error);
    return {};
  }
};

// حذف مفتاح محدد
export const removeState = (key: string): boolean => {
  try {
    const currentData = loadAllData();
    delete currentData[key];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
    return true;
  } catch (error) {
    console.error(`خطأ في حذف المفتاح "${key}":`, error);
    return false;
  }
};

// مسح جميع البيانات
export const clearAllState = (): boolean => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('خطأ في مسح جميع البيانات:', error);
    return false;
  }
};

// فحص وجود مفتاح
export const hasState = (key: string): boolean => {
  try {
    const allData = loadAllData();
    return allData.hasOwnProperty(key);
  } catch (error) {
    console.error(`خطأ في فحص وجود المفتاح "${key}":`, error);
    return false;
  }
};

// الحصول على جميع المفاتيح
export const getAllKeys = (): string[] => {
  try {
    const allData = loadAllData();
    return Object.keys(allData);
  } catch (error) {
    console.error('خطأ في الحصول على المفاتيح:', error);
    return [];
  }
};

// الحصول على حجم البيانات المخزنة
export const getStorageSize = (): number => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Blob([stored]).size : 0;
  } catch (error) {
    console.error('خطأ في حساب حجم التخزين:', error);
    return 0;
  }
};
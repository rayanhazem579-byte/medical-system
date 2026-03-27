import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, Save, UserPlus, Shield, Lock, Palette, Type, Phone, Mail,
  Upload, Trash2, CheckCircle2, XCircle, MoreVertical, X,
  UserCheck, ShieldAlert, User, Globe, Edit3, Facebook, Twitter,
  Instagram, Linkedin, Youtube, Languages, Banknote, Landmark,
  AlertCircle, FileText, ChevronLeft, ChevronRight, Plus
} from 'lucide-react';

/* ───────── Types ───────── */
export interface SystemSettings { 
  hospitalNameAr: string; 
  hospitalNameEn: string; 
  themeColor: string; 
  fontStyle: string; 
  logoUrl: string; 
  currencyAr: string;
  currencyEn: string;
  hospitalEmail: string;
  hospitalPhone: string;
  companyEmail: string;
  companyPassword: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  senderName: string;
  displayMode: 'light' | 'dark';
  supportEmail: string;
  hrEmail: string;
  accountsEmail: string;
  whatsapp: string;
  facebook: string;
  twitter: string;
  welcomeEmailTemplate: string;
}

export interface AdminUser { 
  id: number; 
  name: string; 
  email: string; 
  role: 'admin' | 'manager'; 
  status: 'active' | 'inactive'; 
  permissions: string[]; 
}

interface SettingsPageProps {
  isAr: boolean;
  settings: SystemSettings;
  adminUsers: AdminUser[];
  onUpdateSettings: (s: SystemSettings) => void;
  onAddUser: (e: React.FormEvent) => void;
  isAddUserModalOpen: boolean;
  setIsAddUserModalOpen: (o: boolean) => void;
  newUser: any;
  setNewUser: (u: any) => void;
  onToggleLang: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  isAr, settings, adminUsers, onUpdateSettings, onAddUser,
  isAddUserModalOpen, setIsAddUserModalOpen, newUser, setNewUser, onToggleLang
}) => {
  const [localSettings, setLocalSettings] = useState<SystemSettings>(settings);
  const [activeQuickField, setActiveQuickField] = useState<'whatsapp' | 'email' | 'password' | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Live theme preview
  useEffect(() => {
    if (localSettings.themeColor) {
      const root = document.documentElement;
      root.style.setProperty('--primary-50', `${localSettings.themeColor}10`);
      root.style.setProperty('--primary-100', `${localSettings.themeColor}20`);
      root.style.setProperty('--primary-500', localSettings.themeColor);
      root.style.setProperty('--primary-600', `${localSettings.themeColor}dd`);
      root.style.setProperty('--primary-700', `${localSettings.themeColor}ee`);
    }
  }, [localSettings.themeColor]);

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setLocalSettings(prev => ({ ...prev, logoUrl: event.target?.result as string }));
    };
    reader.readAsDataURL(file);

    // Real upload to server
    setIsUploadingLogo(true);
    const formData = new FormData();
    formData.append('logo', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/settings/logo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setLocalSettings(prev => ({ ...prev, logoUrl: data.logo_url }));
        // Also update parent state if possible, though handleSaveSettings will do it anyway
      } else {
        alert(isAr ? 'فشل رفع الشعار' : 'Failed to upload logo');
      }
    } catch (err) {
      console.error('Logo upload error:', err);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const textAlign = isAr ? 'text-right' : 'text-left';

  const themeColors = [
    { name: 'Sky Blue', hex: '#0ea5e9' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Indigo', hex: '#6366f1' },
    { name: 'Rose', hex: '#f43f5e' },
    { name: 'Amber', hex: '#f59e0b' },
  ];

  const fontStyles = [
    { name: 'Cairo (Default)', value: 'Cairo' },
    { name: 'Tajawal', value: 'Tajawal' },
    { name: 'Almarai', value: 'Almarai' },
    { name: 'Inter', value: 'Inter' },
  ];

  const handleTestEmail = async () => {
    if (!localSettings.hospitalEmail) {
       alert(isAr ? 'الرجاء إدخال البريد أولاً' : 'Please enters email first');
       return;
    }
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/settings/test-email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: localSettings.hospitalEmail })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
      } else {
        alert(data.message || (isAr ? 'فشل الاتصال' : 'Connection failed'));
      }
    } catch (e) {
      alert(isAr ? 'خطأ في الاتصال' : 'Connection error');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(localSettings);
    setActiveQuickField(null);
    alert(isAr ? 'تم حفظ الإعدادات بنجاح!' : 'Settings saved successfully!');
  };

  return (
    <div className="pb-20">
      <form onSubmit={handleSaveSettings} className="space-y-8 animate-in fade-in duration-500">
        
        {/* ─────── Section 1: Hospital Identity & Branding ─────── */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border-2 border-gray-50 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50/50 to-white px-8 py-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-50 rounded-2xl text-primary-500 shadow-inner">
                <Settings size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-800 tracking-tight">{isAr ? 'هوية المستشفى والمكان' : 'Hospital Identity & Style'}</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{isAr ? 'تعديل البيانات الأساسية والمظهر' : 'Basic info & branding'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={onToggleLang} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-primary-500 shadow-sm border border-gray-100" title={isAr ? 'تبديل اللغة' : 'Switch Language'}>
                 <Globe size={18} />
              </button>
              <button type="submit" className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl text-xs font-black hover:bg-primary-600 transition-all shadow-xl active:scale-95">
                <Save size={16} />
                {isAr ? 'حفظ كافة الإعدادات' : 'Save All Settings'}
              </button>
            </div>
          </div>
          
          <div className="p-10 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {/* Identity Fields */}
               <div className="space-y-8">
                  <div className="flex items-center gap-2 mb-2">
                     <User size={18} className="text-primary-500" />
                     <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">{isAr ? 'الأسماء الرسمية' : 'Official Names'}</h3>
                  </div>
                  <div className="space-y-6 bg-gray-50/50 p-6 rounded-3xl border border-gray-50">
                     <div className="space-y-2">
                       <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'اسم المستشفى (عربي)' : 'Hospital Name (Arabic)'}</label>
                       <input type="text" value={localSettings.hospitalNameAr} onChange={e => setLocalSettings({...localSettings, hospitalNameAr: e.target.value})} className="w-full bg-white border-2 border-transparent focus:border-primary-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-800 shadow-sm focus:ring-4 focus:ring-primary-50 outline-none transition-all" />
                     </div>
                     <div className="space-y-2">
                       <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'اسم المستشفى (إنجليزي)' : 'Hospital Name (English)'}</label>
                       <input type="text" value={localSettings.hospitalNameEn} onChange={e => setLocalSettings({...localSettings, hospitalNameEn: e.target.value})} className="w-full bg-white border-2 border-transparent focus:border-primary-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-800 shadow-sm focus:ring-4 focus:ring-primary-50 outline-none transition-all text-left" dir="ltr" />
                     </div>
                  </div>
               </div>

               {/* Logo Section */}
               <div className="bg-white p-6 rounded-[2rem] border-2 border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary-500" />
                  <label className="block text-sm font-black text-gray-800 mb-6 flex items-center gap-2">
                     <Upload size={18} className="text-primary-500" />
                     {isAr ? 'شعار المستشفى' : 'Hospital Logo'}
                  </label>
                  <div className="flex flex-col items-center gap-6">
                    <div 
                      onClick={handleLogoClick}
                      className="relative w-full cursor-pointer group aspect-video rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all hover:border-primary-200 hover:bg-primary-50/10"
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/*" 
                      />
                      {isUploadingLogo && (
                        <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                      {localSettings.logoUrl ? (
                         <div className="relative w-full h-full">
                            <img src={localSettings.logoUrl} className="w-full h-full object-contain p-4 transition-transform group-hover:scale-110" alt="Logo" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                               <div className="p-3 bg-white rounded-2xl text-primary-600 shadow-lg"><Edit3 size={20} /></div>
                               <button 
                                 type="button" 
                                 onClick={(e) => { e.stopPropagation(); setLocalSettings({...localSettings, logoUrl: ''}); }} 
                                 className="p-3 bg-white rounded-2xl text-rose-600 hover:scale-110 transition-transform shadow-lg"
                               >
                                 <Trash2 size={20} />
                               </button>
                            </div>
                         </div>
                      ) : (
                         <div className="text-center space-y-2 py-8">
                           <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto text-gray-300 group-hover:text-primary-400 group-hover:scale-110 transition-all"><Upload size={32} /></div>
                           <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'اضغط لرفع الشعار' : 'Click to Upload Logo'}</div>
                         </div>
                      )}
                    </div>
                  </div>
               </div>
            </div>

            {/* Visual Branding: Color & Font */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-gray-100">
               <div className="space-y-6">
                  <div className="flex items-center gap-2">
                     <Palette size={18} className="text-primary-500" />
                     <label className="text-xs font-black text-gray-800 uppercase tracking-widest">{isAr ? 'لون السمة البصرية' : 'Brand Theme Color'}</label>
                  </div>
                  <div className="flex flex-wrap gap-5 bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                    {themeColors.map(color => (
                      <button key={color.hex} type="button" onClick={() => setLocalSettings({...localSettings, themeColor: color.hex})} 
                        className={`w-12 h-12 rounded-2xl border-4 transition-all flex items-center justify-center ${localSettings.themeColor === color.hex ? 'border-white ring-4 ring-primary-500 scale-110 shadow-lg' : 'border-white ring-1 ring-gray-200 shadow-sm'}`} 
                        style={{ backgroundColor: color.hex }}>
                        {localSettings.themeColor === color.hex && <CheckCircle2 size={24} className="text-white drop-shadow-md" />}
                      </button>
                    ))}
                  </div>
               </div>
               
               <div className="space-y-6">
                 <div className="flex items-center gap-2">
                    <Type size={18} className="text-primary-500" />
                    <label className="text-xs font-black text-gray-800 uppercase tracking-widest">{isAr ? 'نمط الخط للواجهة' : 'System Interface Font'}</label>
                 </div>
                 <div className="relative">
                    <select value={localSettings.fontStyle} onChange={e => setLocalSettings({...localSettings, fontStyle: e.target.value})} 
                      className="w-full appearance-none bg-gray-50 border-2 border-transparent focus:border-primary-100 rounded-[2rem] px-8 py-5 text-sm font-bold text-gray-800 outline-none transition-all shadow-sm cursor-pointer">
                      {fontStyles.map(font => <option key={font.value} value={font.value}>{font.name}</option>)}
                    </select>
                    <div className={`absolute ${isAr ? 'left-8' : 'right-8'} top-1/2 -translate-y-1/2 text-primary-500 pointer-events-none`}><Edit3 size={18} /></div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* ─────── Section 2: Security & Main Contacts ─────── */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border-2 border-gray-50 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-emerald-50/20">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 shadow-inner"><Lock size={24} /></div>
               <div>
                  <h2 className="text-xl font-black text-gray-800 tracking-tight">{isAr ? 'الأمان والاتصال الرسمي' : 'Security & Core Communication'}</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{isAr ? 'قنوات التواصل الرئيسية وكلمات المرور' : 'Communication channels & access'}</p>
               </div>
            </div>
          </div>
          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="space-y-8 bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100">
                <div>
                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">{isAr ? 'بريد المستشفى الرسمي' : 'Primary Hospital Email'}</label>
                   <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input type="email" value={localSettings.hospitalEmail} onChange={e => setLocalSettings({...localSettings, hospitalEmail: e.target.value})} className="w-full pl-14 pr-6 py-4 bg-white border-2 border-transparent focus:border-primary-100 rounded-2xl text-sm font-bold shadow-sm outline-none transition-all" dir="ltr" />
                   </div>
                </div>
                <div>
                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">{isAr ? 'رقم الواتساب للتواصل' : 'WhatsApp Contact'}</label>
                   <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                      <input type="text" value={localSettings.whatsapp} onChange={e => setLocalSettings({...localSettings, whatsapp: e.target.value})} className="w-full pl-14 pr-6 py-4 bg-white border-2 border-transparent focus:border-emerald-100 rounded-2xl text-sm font-bold shadow-sm outline-none transition-all" dir="ltr" />
                   </div>
                </div>
                <div>
                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">{isAr ? 'هاتف المستشفى العام' : 'Public Phone Line'}</label>
                   <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input type="text" value={localSettings.hospitalPhone} onChange={e => setLocalSettings({...localSettings, hospitalPhone: e.target.value})} className="w-full pl-14 pr-6 py-4 bg-white border-2 border-transparent focus:border-primary-100 rounded-2xl text-sm font-bold shadow-sm outline-none transition-all" dir="ltr" />
                   </div>
                </div>
                <div>
                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">{isAr ? 'كلمة سر النظام / البريد' : 'System / Email Access Password'}</label>
                   <div className="relative">
                      <Shield className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input type="password" value={localSettings.smtpPass} onChange={e => setLocalSettings({...localSettings, smtpPass: e.target.value})} className="w-full pl-14 pr-6 py-4 bg-white border-2 border-transparent focus:border-primary-100 rounded-2xl text-sm font-bold shadow-sm outline-none transition-all" dir="ltr" />
                   </div>
                </div>
                <div className="flex items-center justify-between gap-4 pt-4 mt-4 border-t border-gray-100">
                   <p className="text-[10px] font-bold text-gray-400 max-w-xs">{isAr ? 'تأكد من استخدام كلمة مرور التطبيقات في حال استخدام Gmail' : 'Use App Passwords for Gmail/Outlook hosts'}</p>
                   <button type="button" onClick={handleTestEmail} className="px-6 py-3 bg-primary-50 text-primary-600 rounded-xl text-[10px] font-black hover:bg-primary-100 transition-all shadow-sm">
                      {isAr ? 'تجربة الاتصال بالبريد' : 'Test SMTP Connection'}
                   </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">{isAr ? 'خادم SMTP' : 'SMTP Host'}</label>
                      <input type="text" value={localSettings.smtpHost} onChange={e => setLocalSettings({...localSettings, smtpHost: e.target.value})} className="w-full px-6 py-4 bg-white border-2 border-transparent focus:border-primary-100 rounded-2xl text-[10px] font-bold shadow-sm outline-none transition-all" dir="ltr" placeholder="smtp.gmail.com" />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">{isAr ? 'اسم المستخدم SMTP' : 'SMTP Username'}</label>
                      <input type="text" value={localSettings.smtpUser} onChange={e => setLocalSettings({...localSettings, smtpUser: e.target.value})} className="w-full px-6 py-4 bg-white border-2 border-transparent focus:border-primary-100 rounded-2xl text-[10px] font-bold shadow-sm outline-none transition-all" dir="ltr" placeholder="user@gmail.com" />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">{isAr ? 'منفذ SMTP' : 'SMTP Port'}</label>
                      <input type="text" value={localSettings.smtpPort} onChange={e => setLocalSettings({...localSettings, smtpPort: e.target.value})} className="w-full px-6 py-4 bg-white border-2 border-transparent focus:border-primary-100 rounded-2xl text-[10px] font-bold shadow-sm outline-none transition-all" dir="ltr" placeholder="587" />
                   </div>
                </div>
             </div>

             <div className="bg-gray-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/20 transition-all" />
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-primary-400"><UserCheck size={20} /></div>
                   <h3 className="text-sm font-black text-white uppercase tracking-widest">{isAr ? 'هوية المسؤول والنظام (Root)' : 'System Root Manager'}</h3>
                </div>
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">{isAr ? 'اسم المدير المسجل' : 'Manager Registered Name'}</label>
                      <input type="text" value={localSettings.senderName} onChange={e => setLocalSettings({...localSettings, senderName: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 focus:border-primary-500 text-white rounded-2xl text-sm font-bold outline-none transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">{isAr ? 'كلمة مرور الروت' : 'Root Access Password'}</label>
                      <input type="password" value={localSettings.companyPassword} onChange={e => setLocalSettings({...localSettings, companyPassword: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 focus:border-primary-500 text-white rounded-2xl text-sm font-bold outline-none transition-all" dir="ltr" />
                   </div>
                   <div className="space-y-2">
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">{isAr ? 'كلمة مرور الدخول للمشرف' : 'Admin Login Password'}</label>
                      <input type="password" placeholder="••••••••" className="w-full px-6 py-4 bg-white/5 border border-white/10 focus:border-primary-500 text-white rounded-2xl text-sm font-bold outline-none transition-all" dir="ltr" />
                   </div>
                   <div className="pt-4">
                      <button type="submit" className="w-full bg-primary-500 text-white rounded-2xl py-5 text-xs font-black shadow-xl hover:bg-primary-600 transition-all uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95">
                         <Shield size={18} />
                         {isAr ? 'تحديث صلاحيات الوصول' : 'Update Credentials'}
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>



        {/* ─────── Section 3: Departmental Emails & Socials ─────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Detailed Contacts */}
           <div className="bg-white rounded-[2.5rem] shadow-sm border-2 border-gray-50 p-10 space-y-10">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-6 -mt-2">
                 <div className="p-3 bg-blue-50 rounded-2xl text-blue-500 shadow-inner"><Languages size={24} /></div>
                 <div>
                    <h3 className="text-xl font-black text-gray-800 tracking-tight">{isAr ? 'قنوات التواصل والأقسام' : 'Departmental Communication'}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{isAr ? 'تحديد البريد الإلكتروني لكل قسم' : 'Assign specific emails for departments'}</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                 <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'بريد الدعم الفني' : 'Technical Support Email'}</label>
                    <div className="relative">
                       <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                       <input type="email" value={localSettings.supportEmail} onChange={e => setLocalSettings({...localSettings, supportEmail: e.target.value})} className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border-2 border-transparent focus:border-primary-100 rounded-2xl text-sm font-bold outline-none transition-all" dir="ltr" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'بريد الموارد البشرية (HR)' : 'HR Department Email'}</label>
                    <div className="relative">
                       <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                       <input type="email" value={localSettings.hrEmail} onChange={e => setLocalSettings({...localSettings, hrEmail: e.target.value})} className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border-2 border-transparent focus:border-primary-100 rounded-2xl text-sm font-bold outline-none transition-all" dir="ltr" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'بريد الحسابات والمالية' : 'Accounts & Finance Email'}</label>
                    <div className="relative">
                       <Banknote className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                       <input type="email" value={localSettings.accountsEmail} onChange={e => setLocalSettings({...localSettings, accountsEmail: e.target.value})} className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border-2 border-transparent focus:border-primary-100 rounded-2xl text-sm font-bold outline-none transition-all" dir="ltr" />
                    </div>
                 </div>
              </div>
           </div>

           {/* Social Media Links */}
           <div className="bg-white rounded-[2.5rem] shadow-sm border-2 border-gray-50 p-10 space-y-10">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-6 -mt-2">
                 <div className="p-3 bg-red-50 rounded-2xl text-red-500 shadow-inner"><Globe size={24} /></div>
                 <div>
                    <h3 className="text-xl font-black text-gray-800 tracking-tight">{isAr ? 'التواصل الاجتماعي' : 'Social Presence'}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{isAr ? 'ربط حسابات المستشفى الرسمية' : 'Connect official social handle'}</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                 <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'فيسبوك' : 'Facebook Page URL'}</label>
                    <div className="relative">
                       <Facebook className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
                       <input type="text" placeholder="https://facebook.com/..." value={localSettings.facebook} onChange={e => setLocalSettings({...localSettings, facebook: e.target.value})} className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border-2 border-transparent focus:border-blue-100 rounded-2xl text-sm font-bold outline-none transition-all" dir="ltr" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'تويتر (X)' : 'Twitter (X) URL'}</label>
                    <div className="relative">
                       <Twitter className="absolute left-5 top-1/2 -translate-y-1/2 text-sky-400" size={18} />
                       <input type="text" placeholder="https://twitter.com/..." value={localSettings.twitter} onChange={e => setLocalSettings({...localSettings, twitter: e.target.value})} className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border-2 border-transparent focus:border-sky-100 rounded-2xl text-sm font-bold outline-none transition-all" dir="ltr" />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                    <div className="space-y-2">
                       <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'العملة (عربي)' : 'الرمز (مثل ج.م)'}</label>
                       <input type="text" value={localSettings.currencyAr} onChange={e => setLocalSettings({...localSettings, currencyAr: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-100 rounded-2xl text-sm font-black outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'العملة (إنجليزي)' : 'Symbol (Ex: EGP)'}</label>
                       <input type="text" value={localSettings.currencyEn} onChange={e => setLocalSettings({...localSettings, currencyEn: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-100 rounded-2xl text-sm font-bold outline-none transition-all text-center" dir="ltr" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </form>

      {/* ─────── User Management ─────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-12">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><Shield size={20} /></div>
             <h2 className="text-lg font-bold text-gray-800">{isAr ? 'إدارة مدراء النظام' : 'System Managers Management'}</h2>
          </div>
          <button onClick={() => setIsAddUserModalOpen(true)} className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl text-xs font-black hover:bg-primary-600 transition-all shadow-lg active:scale-95">
            <UserPlus size={16} /> {isAr ? 'إضافة مسؤول جديد' : 'New Admin'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className={`${textAlign} px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest`}>{isAr ? 'المسؤول' : 'Administrator'}</th>
                <th className={`${textAlign} px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest`}>{isAr ? 'الدور' : 'System Role'}</th>
                <th className="text-center px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest">{isAr ? 'الحالة' : 'Account Status'}</th>
                <th className="text-center px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest">{isAr ? 'التحكم' : 'Operations'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {adminUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center text-primary-600 font-black border border-primary-200">
                         {user.name.charAt(0)}
                       </div>
                       <div>
                         <p className="text-sm font-black text-gray-800 tracking-tight">{user.name}</p>
                         <p className="text-[10px] font-bold text-gray-400 tracking-widest" dir="ltr">{user.email}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                      {user.role === 'admin' ? <Shield size={12} /> : <UserCheck size={12} />}
                      {user.role === 'admin' ? (isAr ? 'مدير كامل' : 'Full Admin') : (isAr ? 'مدير تطبيق' : 'App Manager')}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                     <div className="flex flex-col items-center gap-1">
                        <span className={`w-2.5 h-2.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-gray-300'}`} />
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{user.status === 'active' ? (isAr ? 'نشط' : 'Active') : (isAr ? 'معطل' : 'Offline')}</span>
                     </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex items-center justify-center gap-3">
                       <button className="w-9 h-9 flex items-center justify-center hover:bg-primary-50 rounded-xl text-gray-400 hover:text-primary-600 transition-all border border-transparent hover:border-primary-100" title={isAr ? 'تعديل الصلاحيات' : 'Edit Permissions'}>
                          <Edit3 size={16} />
                       </button>
                       <button className="w-9 h-9 flex items-center justify-center hover:bg-rose-50 rounded-xl text-gray-400 hover:text-rose-500 transition-all" title={isAr ? 'حذف الحساب' : 'Delete Account'}>
                          <Trash2 size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─────── Add User Modal ─────── */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-xl p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-500 border border-white/20">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-900 text-white shrink-0">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center"><UserPlus size={24} /></div>
                 <div>
                    <h3 className="text-xl font-black tracking-tight">{isAr ? 'إضافة مسؤول جديد' : 'Invite New Admin'}</h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{isAr ? 'منح صلاحيات الإدارة للآخرين' : 'Delegate system management'}</p>
                 </div>
              </div>
              <button onClick={() => setIsAddUserModalOpen(false)} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-transform active:rotate-90"><X size={24} /></button>
            </div>
            <form onSubmit={onAddUser} className="p-10 space-y-8 overflow-y-auto custom-scrollbar flex-1">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'الاسم الكامل' : 'Full Admin Name'}</label>
                <div className="relative">
                   <input required type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full bg-gray-50/50 border-2 border-transparent focus:border-primary-100 rounded-2xl px-6 py-4 text-sm font-bold shadow-sm outline-none transition-all" />
                   <User size={18} className={`absolute ${isAr ? 'left-6' : 'right-6'} top-1/2 -translate-y-1/2 text-gray-300`} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'عنوان البريد الإلكتروني' : 'Admin Email Address'}</label>
                <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full bg-gray-50/50 border-2 border-transparent focus:border-primary-100 rounded-2xl px-6 py-4 text-sm font-bold shadow-sm outline-none transition-all text-left" dir="ltr" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'الدور الوظيفي' : 'System Role'}</label>
                   <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full bg-gray-50/50 border-2 border-transparent focus:border-primary-100 rounded-2xl px-6 py-4 text-sm font-black outline-none cursor-pointer">
                      <option value="manager">{isAr ? 'مدير تطبيق' : 'Manager'}</option>
                      <option value="admin">{isAr ? 'مدير كامل' : 'Full Admin'}</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'كلمة السر المؤقتة' : 'Temporary Password'}</label>
                   <div className="relative">
                      <input required type="password" placeholder="••••••••" className="w-full bg-gray-50/50 border-2 border-transparent focus:border-primary-100 rounded-2xl px-6 py-4 text-sm font-bold shadow-sm outline-none transition-all" />
                      <Lock size={18} className={`absolute ${isAr ? 'left-6' : 'right-6'} top-1/2 -translate-y-1/2 text-gray-300`} />
                   </div>
                </div>
              </div>

              <div className="p-6 bg-amber-50 rounded-[2rem] border-2 border-amber-100 flex gap-4">
                 <ShieldAlert size={24} className="text-amber-500 shrink-0" />
                 <p className="text-[11px] text-amber-700 font-bold leading-relaxed">
                    {isAr ? 'تنبيه: سيحصل هذا الشخص على صلاحيات كاملة لإدارة النظام والبيانات الحساسة. تأكد من ثقتك به.' : 'Critical: This user will gain full administrative control over sensitive system data. Grant access only to trusted personnel.'}
                 </p>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <button type="button" onClick={() => setIsAddUserModalOpen(false)} className="px-8 py-4 text-sm font-black text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest">{isAr ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" className="px-10 py-5 text-sm font-black text-white bg-gray-900 rounded-[2rem] hover:bg-primary-600 shadow-xl hover:shadow-primary-100 transition-all active:scale-95">
                   {isAr ? 'اعتماد الحساب' : 'Finalize & Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

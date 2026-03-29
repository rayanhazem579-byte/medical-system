import React, { useState } from 'react';
import {
  UserCircle, Shield, Key, Search,
  RefreshCcw, Eye, EyeOff, CheckCircle2,
  XCircle, Filter, Edit3, Trash2,
  UserMinus, UserCheck, Lock, Unlock, Mail, Copy, AlertCircle, ShieldAlert, Award, FileText, User, RefreshCw, Globe, Check, ShieldCheck
} from 'lucide-react';

interface Account {
  id: number;
  nameAr: string;
  nameEn: string;
  role: 'doctor' | 'receptionist' | 'admin' | 'nurse' | 'hr' | 'finance';
  username: string;
  email: string;
  status: 'active' | 'suspended';
  lastLogin: string;
  hasUser: boolean;
  staffId: string;
}

interface AccountsPageProps {
  isAr: boolean;
  tx: any;
  doctors: any[];
  employees: any[];
  nurses: any[];
  hospitalName?: string;
  hospitalEmail?: string;
  hospitalPhone?: string;
  welcomeEmailTemplate?: string;
  supportEmail?: string;
  onDelete?: (id: number, role: string) => void;
}

export const AccountsPage: React.FC<AccountsPageProps> = ({
  isAr, tx, doctors, employees, nurses,
  hospitalName = 'مستشفى ريان',
  hospitalEmail = 'ryanhazem27@gmail.com',
  hospitalPhone = '+249 123 456 789',
  welcomeEmailTemplate = '',
  supportEmail = '',
  onDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'doctor' | 'employee'>('all');
  const [isSending, setIsSending] = useState<number | null>(null);
  const [generatedResult, setGeneratedResult] = useState<{ password?: string, email: string, userId: number, username: string, nameAr: string, nameEn: string, role: string, hasUser: boolean, staffId: string } | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [welcomeMsg, setWelcomeMsg] = useState('');
  const [sentAccounts, setSentAccounts] = useState<number[]>([]);
  const [confirmActivation, setConfirmActivation] = useState<{ id: number, username: string, name: string, password?: string } | null>(null);
  const [showPassword, setShowPassword] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const allAccounts: Account[] = [
    ...employees.map((e) => ({
      id: e.id, 
      nameAr: e.nameAr,
      nameEn: e.nameEn,
      role: e.role as any,
      username: e.user?.username || e.staffId || e.nameEn.toLowerCase().replace(/\s/g, '.'),
      email: e.user?.email || e.email || `${e.nameEn.toLowerCase().replace(/\s/g, '.')}@hospital.com`,
      status: (e.status === 'active' ? 'active' : 'suspended') as 'active' | 'suspended',
      lastLogin: 'Never',
      hasUser: !!e.user,
      staffId: e.staff_id || e.staffId || ''
    })),
    ...doctors.map((d) => ({
      id: d.id, 
      nameAr: d.nameAr,
      nameEn: d.nameEn,
      role: 'doctor' as any,
      username: d.user?.username || d.medicalId || d.staff_id || d.nameEn.toLowerCase().replace(/\s/g, '.'),
      email: d.user?.email || d.email || `${d.nameEn.toLowerCase().replace(/\s/g, '.')}@hospital.com`,
      status: (d.status === 'active' ? 'active' : 'suspended') as 'active' | 'suspended',
      lastLogin: 'Never',
      hasUser: !!d.user,
      staffId: d.medicalId || d.staff_id || ''
    })),
    ...nurses.map((n) => ({
      id: n.id, 
      nameAr: n.nameAr,
      nameEn: n.nameEn,
      role: 'nurse' as any,
      username: n.user?.username || n.medical_id || n.staff_id || n.nameEn.toLowerCase().replace(/\s/g, '.'),
      email: n.user?.email || n.email || `${n.nameEn.toLowerCase().replace(/\s/g, '.')}@hospital.com`,
      status: (n.status === 'active' ? 'active' : 'suspended') as 'active' | 'suspended',
      lastLogin: 'Never',
      hasUser: !!n.user,
      staffId: n.medical_id || n.staff_id || ''
    }))
  ];

  const filteredAccounts = allAccounts.filter(acc => {
    const matchesSearch = acc.nameAr.includes(searchTerm) ||
      acc.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.username.includes(searchTerm);
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'doctor') return matchesSearch && (acc.role === 'doctor' || acc.role === 'nurse');
    if (filterType === 'employee') return matchesSearch && (acc.role !== 'doctor' && acc.role !== 'nurse');
    return matchesSearch;
  });
  const updateWelcomeMessage = (newPass: string, name: string, role: string, username: string, email: string) => {
    const roleStr = getRoleLabel(role);

    let msg = welcomeEmailTemplate || (isAr
      ? `مرحباً بك في مستشفى {hospital_name}
 
 عزيزي {name}،
 لقد تم إنشاء حسابك بنجاح في نظام المستشفى.
 
 بيانات التعريف:
 الدور الوظيفي: {role}
 الايميل: {email}
 كلمة المرور المؤقتة: {password}
 
 تنبيه أمني: يرجى تغيير كلمة المرور بعد تسجيل الدخول لأول مرة فوراً لضمان أمان حسابك الشخصي.
 
 ويرجى الرد على هذا البريد الإلكتروني أو التواصل مع {support_contact} للتأكد من استلامك لهذه البيانات.
 
 مع تحيات إدارة تقنية المعلومات،
 مستشفى {hospital_name}.`
      : `Welcome to {hospital_name}
 
 Dear {name},
 Your account has been successfully created in the hospital system.
 
 Identity data:
 Job Role: {role}
 Email: {email}
 Temporary Password: {password}
 
 IMPORTANT SECURITY NOTICE:
 Please change your password immediately after your first login to ensure your account's security.
 
 Please reply to this email or contact us at {support_contact} if you have any questions.
 
 Best Regards,
 IT Department,
 {hospital_name}.`);

    msg = msg.replace(/{hospital_name}/g, hospitalName)
             .replace(/{name}/g, name)
             .replace(/{role}/g, roleStr)
             .replace(/{username}/g, username) 
             .replace(/{email}/g, email)
             .replace(/{password}/g, newPass)
             .replace(/{support_contact}/g, supportEmail || hospitalEmail);

    setWelcomeMsg(msg);
  };

  const getRoleLabel = (role: string) => {
    const roleLabels: any = {
      'doctor': isAr ? 'طبيب' : 'Doctor',
      'nurse': isAr ? 'ممرض/ة' : 'Nurse',
      'receptionist': isAr ? 'موظف استقبال' : 'Receptionist',
      'admin': isAr ? 'مدير نظام' : 'System Admin',
      'finance': isAr ? 'محاسب' : 'Accountant',
      'hr': isAr ? 'مدير موارد بشرية' : 'HR Manager',
      'staff': isAr ? 'موظف' : 'Staff'
    };
    return roleLabels[role] || (role ? role.toUpperCase() : '');
  };

  const handleSendPasswordToEmail = async (account: Account) => {
    if (!account.hasUser) {
        setGeneratedResult({ password: '', email: account.email, userId: account.id, username: account.username, nameAr: account.nameAr, nameEn: account.nameEn, role: account.role, hasUser: false, staffId: account.staffId });
        setWelcomeMsg(isAr ? 'الرجاء توليد مفتاح الوصول الرقمي عبر زر التحديث لبدء عملية الاعتماد...' : 'Please generate a digital access key using the update button to start the authorization process...');
        setShowPassword(false);
        setIsResultModalOpen(true);
    } else {
        setGeneratedResult({ email: account.email, userId: account.id, username: account.username, nameAr: account.nameAr, nameEn: account.nameEn, role: account.role, hasUser: true, staffId: account.staffId });
        setWelcomeMsg(isAr ? `تنبيه: هذا الحساب ( @${account.username} ) يمتلك هوية مفعلة مسبقاً. تم حجب المفتاح لأسباب أمنية. يمكنكم إعادة التوليد يدوياً عبر زر التدوير.` : `NOTICE: Account ( @${account.username} ) already has a verified identity. Master key hidden for security. Use the rotate button to issue a new one.`);
        setShowPassword(false);
        setIsResultModalOpen(true);
    }
  };

  const handleRegeneratePassword = async () => {
    if (!generatedResult) return;
    setIsRegenerating(true);
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/api/employees/${generatedResult.userId}/reset-password`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json', 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (response.ok) {
            setGeneratedResult({ ...generatedResult, password: data.password, hasUser: true });
            updateWelcomeMessage(data.password, isAr ? generatedResult.nameAr : generatedResult.nameEn, generatedResult.role, generatedResult.username, generatedResult.email);
            setShowPassword(true);
        }
    } catch (e) { alert('Err'); } finally { setIsRegenerating(false); }
  };

  const handleFinalizeAccount = async (id: number, username: string, password?: string) => {
    try {
      setIsSending(id);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/employees/${id}/finalize-account`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
        const data = await response.json();
        if (response.ok) {
          if (!sentAccounts.includes(id)) setSentAccounts([...sentAccounts, id]);
          
          // Correct name for success message
          const finalName = generatedResult?.userId === id 
            ? (isAr ? generatedResult.nameAr : generatedResult.nameEn)
            : (confirmActivation?.id === id ? confirmActivation.name : username);

          const successMsg = (data.message || (isAr ? 'تم تفعيل الحساب بنجاح' : 'Account activated successfully')) + 
            (password ? ` (${finalName})` : '');
          
          alert(successMsg);
          setIsResultModalOpen(false);
          setConfirmActivation(null);
          window.location.reload();
        } else {
          alert(data.message || 'An error occurred');
        }
    } catch (error) { alert('Err'); } finally { setIsSending(null); }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-700 font-cairo">
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 relative overflow-hidden space-y-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-3"><Shield className="text-primary-600" size={28} /> {isAr ? 'إدارة الوصول والحسابات' : 'Access & Accounts Hub'}</h1>
            <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">{isAr ? 'إصدار المفاتيح البرمجية وتفعيل هويات الموظفين' : 'Issue system keys and activate employee identities'}</p>
          </div>
          <div className="w-full md:w-80 relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
             <input value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder={isAr ? 'بحث في الهويات...' : 'Search identities...'} className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-primary-100 transition-all shadow-inner" />
          </div>
        </div>

        <div className="flex bg-slate-50 p-1.5 rounded-[1.8rem] border border-gray-100 w-fit relative z-10 shadow-inner">
           {[
             { id: 'all', labelAr: 'الكل', labelEn: 'All Accounts' },
             { id: 'doctor', labelAr: 'الأطباء والتمريض', labelEn: 'Medical Staff' },
             { id: 'employee', labelAr: 'الموظفون الإداريون', labelEn: 'Administrative' }
           ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`flex items-center gap-2 px-8 py-3 rounded-[1.4rem] text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${filterType === tab.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 ring-2 ring-primary-100' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {isAr ? tab.labelAr : tab.labelEn}
              </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
         <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-right" dir={isAr ? 'rtl' : 'ltr'}>
                  <thead className="bg-gray-50/50 border-b border-gray-100 font-cairo">
                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                      <th className="px-8 py-6">{isAr ? 'صاحب الحساب / الدور' : 'Owner / Role'}</th>
                      <th className="px-8 py-6">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</th>
                      <th className="px-8 py-6 text-center">{isAr ? 'اسم المستخدم' : 'Username'}</th>
                      <th className="px-8 py-6 text-center">{isAr ? 'الحساب' : 'Account Status'}</th>
                      <th className="px-8 py-6 text-center">{isAr ? 'إجراءات الأمان' : 'Security'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {filteredAccounts.map(acc => (
                        <tr key={acc.id} className="hover:bg-primary-50/10 transition-colors group">
                           <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center font-black text-sm border border-slate-200 shadow-inner group-hover:scale-110 transition-transform">{acc.nameEn.charAt(0)}</div>
                                  <div className="flex flex-col">
                                     <div className="flex items-center gap-2"><p className="text-sm font-black text-gray-800 leading-none">{isAr ? acc.nameAr : acc.nameEn}</p>{acc.hasUser && <UserCheck size={14} className="text-emerald-500 animate-pulse"/>}</div>
                                     <span className="text-[9px] font-black text-primary-600 bg-primary-50 px-2 py-0.5 rounded uppercase tracking-widest w-fit mt-2 border border-primary-100">{getRoleLabel(acc.role)}</span>
                                  </div>
                              </div>
                           </td>
                           <td className="px-8 py-5">
                              <div className="flex items-center gap-2">
                                 <Mail size={14} className="text-indigo-400" />
                                 <span className="text-xs font-bold text-slate-600">{acc.email}</span>
                              </div>
                           </td>
                           <td className="px-8 py-5 text-center"><span className="text-xs font-mono font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100">@{acc.username}</span></td>
                           <td className="px-8 py-5 text-center">
                              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 mx-auto w-fit border shadow-sm ${acc.hasUser ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                 <div className={`w-1.5 h-1.5 rounded-full ${acc.hasUser ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                 {acc.hasUser ? (isAr ? 'مفعل' : 'Active') : (isAr ? 'غير مفعل' : 'Idle')}
                              </span>
                           </td>
                           <td className="px-8 py-5 text-center">
                              <div className="flex items-center justify-center gap-2">
                                 <button onClick={() => handleSendPasswordToEmail(acc)} className="w-10 h-10 rounded-xl bg-slate-900 text-white hover:bg-primary-600 transition-all shadow-xl shadow-black/5 flex items-center justify-center active:scale-95 group relative overflow-hidden">
                                     <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                                     <Key size={16} className="relative z-10"/>
                                 </button>
                                 <button onClick={() => setConfirmActivation({ id: acc.id, username: acc.username, name: isAr ? acc.nameAr : acc.nameEn, password: acc.hasUser ? undefined : '12345678' })} title={isAr ? 'تفعيل سريع (كلمة المرور: 12345678)' : 'Quick Activate (Password: 12345678)'} className="w-10 h-10 rounded-xl bg-white text-emerald-600 border border-emerald-100 hover:bg-emerald-50 transition-all shadow-sm flex items-center justify-center active:scale-90"><CheckCircle2 size={16}/></button>
                                 <button onClick={() => onDelete?.(acc.id, acc.role)} className="w-10 h-10 rounded-xl bg-white text-rose-500 border border-rose-100 hover:bg-rose-50 transition-all shadow-sm flex items-center justify-center active:scale-90" title={isAr ? 'حذف' : 'Delete'}><Trash2 size={16}/></button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>

      {isResultModalOpen && generatedResult && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-500 font-cairo text-right overflow-y-auto">
            <div className="bg-white rounded-[3rem] shadow-[0_48px_96px_-12px_rgba(15,23,42,0.25)] w-full max-w-2xl my-auto overflow-hidden transform animate-in zoom-in-95 duration-300 border border-white relative max-h-[90vh] overflow-y-auto custom-scrollbar flex">
              
              {/* Left Bar (Stick-like) */}
              <div className="w-20 bg-slate-900 flex flex-col items-center py-10 gap-10 shrink-0 border-r border-white/5 shadow-2xl z-20">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner"><Shield size={24} className="text-primary-400" /></div>
                 <div className="flex flex-col gap-8">
                    <div className="w-10 h-10 rounded-[14px] bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/10"><Check size={20}/></div>
                    <div className="w-10 h-10 rounded-[14px] bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/10"><Mail size={20}/></div>
                    <div className="w-10 h-10 rounded-[14px] bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/10"><Lock size={20}/></div>
                 </div>
              </div>

              <div className="flex-1 flex flex-col bg-white">
                  <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white relative overflow-hidden shrink-0">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                      <div>
                          <h3 className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                              {isAr ? generatedResult.nameAr : generatedResult.nameEn}
                          </h3>
                          <div className="flex items-center gap-3 mt-3">
                              <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-[10px] font-black tracking-widest border border-indigo-100 shadow-sm flex items-center gap-2">
                                 <Mail size={12} className="text-indigo-500"/> {generatedResult.email}
                              </span>
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">@{generatedResult.username}</span>
                          </div>
                      </div>
                      <button onClick={() => setIsResultModalOpen(false)} className="w-10 h-10 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-2xl transition-all flex items-center justify-center active:scale-90 border border-slate-100 shadow-sm"><XCircle size={24}/></button>
                  </div>

                  <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
                      {/* Section 1: Digital Master Key */}
                      <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><Key size={16}/></div>
                             <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">{isAr ? 'كلمة السر (Password)' : 'Access Password'}</h4>
                          </div>
                          
                          <div className="flex items-center gap-3 p-2 bg-slate-900 rounded-[2rem] border-[4px] border-slate-100 shadow-xl group/pass">
                              <div className="bg-white/5 px-6 py-4 rounded-2xl text-[16px] font-mono font-black text-white flex-1 text-center tracking-[0.3em] group-hover/pass:tracking-[0.4em] transition-all">
                                 {generatedResult.password ? (showPassword ? generatedResult.password : '••••••••') : (isAr ? '(اضغط للتوليد)' : '(Generate)')}
                              </div>
                              <div className="flex gap-1.5 pr-2">
                                 <button onClick={() => setShowPassword(!showPassword)} className="w-11 h-11 bg-white/5 text-slate-400 hover:text-white rounded-xl transition-all border border-white/5 flex items-center justify-center hover:bg-white/10 shadow-sm active:scale-90">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                                  <button disabled={isRegenerating} onClick={handleRegeneratePassword} className="w-11 h-11 bg-white/5 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl transition-all border border-emerald-500/20 flex items-center justify-center group/rv shadow-sm active:scale-90" title={isAr ? 'تحديث المفتاح' : 'Rotate Key'}>
                                     <RefreshCw size={18} className={`group-hover/rv:rotate-180 transition-transform duration-700 ${isRegenerating ? 'animate-spin' : ''}`}/>
                                  </button>
                                 <button onClick={() => { navigator.clipboard.writeText(generatedResult.password || ''); alert('Password Copied!'); }} className="w-11 h-11 bg-white/5 text-primary-400 hover:bg-primary-500 hover:text-white rounded-xl transition-all border border-primary-500/20 flex items-center justify-center shadow-sm active:scale-90"><Copy size={18}/></button>
                              </div>
                          </div>
                      </div>

                      {/* Section 2: Email Template */}
                      {generatedResult.password && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><FileText size={16}/></div>
                               <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">{isAr ? 'قالب البريد الإلكتروني' : 'Email Content Template'}</h4>
                            </div>
                            <div className="bg-white rounded-[2.8rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                                <textarea 
                                   value={welcomeMsg}
                                   onChange={(e) => setWelcomeMsg(e.target.value)}
                                   className="w-full bg-transparent p-8 text-[12.5px] font-bold text-slate-700 leading-relaxed outline-none resize-none h-64 custom-scrollbar text-right font-cairo"
                                   dir="rtl"
                                />
                                <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[9px] font-black text-emerald-500 uppercase tracking-widest"><CheckCircle2 size={12}/> {isAr ? 'جاهزة للإرسال' : 'READY FOR DISPATCH'}</div>
                                    <button onClick={() => { navigator.clipboard.writeText(welcomeMsg); alert('Memorandum Copied!'); }} className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm active:scale-95">
                                       <Copy size={14}/> {isAr ? 'نسخ النص' : 'Copy Text'}
                                    </button>
                                </div>
                            </div>
                        </div>
                      )}

                      {!generatedResult.password && (
                         <div className="p-12 text-center space-y-4">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                               <RefreshCw size={32} className="animate-pulse" />
                            </div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{isAr ? 'بانتظار توليد المفتاح...' : 'Awaiting Key Generation...'}</p>
                         </div>
                      )}

                      <div className="flex items-center gap-3 p-5 bg-amber-50 rounded-[2rem] border border-amber-100 shadow-sm">
                         <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0"><AlertCircle className="text-amber-600" size={20}/></div>
                         <p className="text-[11px] font-bold text-amber-700 leading-relaxed">{isAr ? 'تنبيه: سيطلب من صاحب الحساب تغيير كلمة المرور فور دخوله النظام لضمان الخصوصية.' : 'Notice: User will be forced to change this password upon first login for security.'}</p>
                      </div>
                  </div>

                  <div className="p-8 bg-white border-t border-slate-100 grid grid-cols-2 gap-4 shrink-0">
                      <button 
                         disabled={!generatedResult.password}
                         onClick={() => {
                            const subject = encodeURIComponent(isAr ? `بيانات تسجيل الدخول - ${hospitalName}` : `Access Credentials - ${hospitalName}`);
                            const body = encodeURIComponent(welcomeMsg);
                            window.open(`mailto:${generatedResult.email}?subject=${subject}&body=${body}`);
                         }}
                         className="h-16 bg-white border-2 border-slate-100 text-slate-500 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:border-primary-400 hover:text-primary-600 transition-all active:scale-95 group shadow-sm"
                      >
                         <Mail size={22} className="group-hover:scale-110 transition-transform"/> {isAr ? 'إرسال بريد' : 'Send via Mail'}
                      </button>
                      <button 
                         disabled={isSending === generatedResult.userId || !generatedResult.password}
                         onClick={() => handleFinalizeAccount(generatedResult.userId, generatedResult.username, generatedResult.password)} 
                         className="h-16 bg-emerald-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50"
                      >
                         {isSending === generatedResult.userId ? <RefreshCw size={22} className="animate-spin" /> : <ShieldCheck size={22}/>} 
                         {isAr ? 'اعتماد الحساب' : 'Authorize Identity'}
                      </button>
                  </div>
              </div>
            </div>
        </div>
      )}

      {confirmActivation && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-500 font-cairo">
             <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-sm w-full text-center space-y-8 border border-white/20 transform animate-in zoom-in-95 duration-300 relative overflow-hidden">
                <img src="/hospital_logo.png" alt="Hospital" className="w-16 h-16 object-contain mx-auto" />
                <div className="space-y-2">
                   <h4 className="text-xl font-black text-slate-800 tracking-tight">{isAr ? 'تفعيل الحساب ؟' : 'Activate Account?'}</h4>
                   <p className="text-[12px] font-bold text-slate-400 leading-relaxed px-4">
                     {isAr 
                       ? `سيتم تسجيل بيانات الدخول (اسم المستخدم: @${confirmActivation.username}) في قاعدة البيانات ومنح ${confirmActivation.name} صلاحية الوصول.` 
                       : `Registering credentials (Username: @${confirmActivation.username}) in the user table for ${confirmActivation.name}.`}
                   </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <button onClick={() => setConfirmActivation(null)} className="h-12 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">{isAr ? 'تراجع' : 'Cancel'}</button>
                   <button disabled={isSending === confirmActivation.id} onClick={() => handleFinalizeAccount(confirmActivation.id, confirmActivation.username, confirmActivation.password)} className="h-12 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                      {isSending === confirmActivation.id && <RefreshCw size={14} className="animate-spin"/>}
                      {isAr ? 'تأكيد' : 'Confirm'}
                   </button>
                </div>
             </div>
          </div>
      )}
    </div>
  );
};

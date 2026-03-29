import React, { useState, useEffect } from 'react';
import {
  Building2, Users, ClipboardList, Pill, Briefcase,
  Settings, LogOut, LayoutDashboard, Calendar,
  UserPlus, Activity, FlaskConical, Stethoscope,
  MessageSquare, Bell, Search, Menu, X, ChevronRight,
  ShieldCheck, HelpCircle, User, Key, Mail, Phone,
  Globe, Instagram, Twitter, Facebook, Linkedin,
  CheckCircle2, AlertCircle, RefreshCw, MoreVertical,
  Plus, Edit3, Trash2, KeyRound, CalendarCheck, DollarSign, ConciergeBell, Wrench, UserCog, ChevronDown, ChevronUp, Filter, Download, Ban, Eye, Banknote, Check, Shield, AlertTriangle, Clock, Ambulance, CreditCard
} from 'lucide-react';
import { DepartmentsPage } from './DepartmentsPage';
import { ServicesPage } from './ServicesPage';
import { EmployeesPage } from './EmployeesPage';
import { SettingsPage } from './SettingsPage';
import { DoctorsPage } from './DoctorsPage';
import { NursesPage } from './NursesPage';
import { PharmacyPage } from './PharmacyPage';
import { SalariesPage } from './SalariesPage';
import { FinancePage } from './FinancePage';
import { DoctorPortal } from './DoctorPortal';
import { PatientsPage } from './PatientsPage';
import { LoginPage } from './LoginPage';
import { DashboardPage } from './DashboardPage';
import { AppointmentsPage } from './AppointmentsPage';
import { ReceptionPage } from './ReceptionPage';
import { SpecialtiesPage } from './SpecialtiesPage';
import { AccountsPage } from './AccountsPage';
import { LaboratoryPage } from './LaboratoryPage';
import { RadiologyPage } from './RadiologyPage';
import { AmbulancePage } from './AmbulancePage';
import { JobTitlesPage } from './JobTitlesPage';
import { PharmacyManagementPage } from './PharmacyManagementPage';
import { LaboratoryManagementPage } from './LaboratoryManagementPage';
import { WorkHoursPage } from './WorkHoursPage';

/* ───────── Types ───────── */
type Lang = 'ar' | 'en';
interface NavItem { id?: string; labelAr: string; labelEn: string; icon: React.ReactNode; active?: boolean }
interface StatCard { titleAr: string; titleEn: string; value: string | number; subtitleAr: string; subtitleEn: string; icon: React.ReactNode; iconBg: string; iconColor: string; trendAr?: string; trendEn?: string; trendUp?: boolean }
interface Department { id: number; code?: string; name: string; head_doctor: string; location: string; description: string; doctorCount: number; status: 'active' | 'inactive'; established: string; nameAr: string; nameEn: string; headAr: string; headEn: string; headAvatar: string; locationAr: string; locationEn: string }
interface HospitalService { id: number; nameAr: string; nameEn: string; price: number; discount: number; classificationAr: string; classificationEn: string; status: 'active' | 'inactive' | 'available'; }
interface Employee { id: number; name: string; staff_id: string; medical_id?: string; role: string; email: string; salary: number; hire_date: string; department_id: number; department?: any; nameAr: string; nameEn: string; positionAr: string; positionEn: string; deptAr: string; deptEn: string; status: 'active' | 'inactive'; joinDate: string; user?: any; }
interface Doctor {
  id: number;
  nameAr: string;
  nameEn: string;
  specialtyAr: string;
  specialtyEn: string;
  deptAr: string;
  deptEn: string;
  status: 'active' | 'on_leave' | 'resigned';
  phone: string;
  email: string;
  consultationPrice: number;
  scheduleAr: string;
  scheduleEn: string;
  medicalId: string;
  workHours: { start: string; end: string };
  workingDays: string[];
  shifts?: string[];
  jobTitle?: string;
  nationalId: string;
  licenseNumber: string;
  practiceCert: string;
}

interface Medicine { id: number; nameAr: string; nameEn: string; categoryAr: string; categoryEn: string; stock: number; minStock: number; price: number; expiryDate: string; status: 'available' | 'low' | 'out'; }
interface SalaryRecord { id: number; employeeNameAr: string; employeeNameEn: string; positionAr: string; positionEn: string; baseSalary: number; allowances: number; deductions: number; netSalary: number; status: 'paid' | 'pending'; month: string; }
interface Transaction { id: number; descriptionAr: string; descriptionEn: string; amount: number; type: 'income' | 'expense'; categoryAr: string; categoryEn: string; date: string; }
interface SystemSettings { hospitalNameAr: string; hospitalNameEn: string; themeColor: string; fontStyle: string; logoUrl: string; currencyAr: string; currencyEn: string; hospitalEmail: string; hospitalPhone: string; companyEmail: string; companyPassword: string; smtpHost: string; smtpPort: string; smtpUser: string; smtpPass: string; senderName: string; displayMode: 'light' | 'dark'; supportEmail: string; hrEmail: string; accountsEmail: string; whatsapp: string; facebook: string; twitter: string; welcomeEmailTemplate: string; }
interface AdminUser { id: number; name: string; email: string; role: 'admin' | 'manager'; status: 'active' | 'inactive'; permissions: string[]; }

/* ───────── Translations ───────── */
const t = {
  ar: {
    hospitalSystem: 'نظام المستشفى', hospitalSub: 'Hospital System', mainMenu: 'القائمة الرئيسية', management: 'الإدارة', ceoTitle: 'المدير التنفيذي', ceoName: 'محمد أحمد', logout: 'تسجيل الخروج', pageTitle: 'إدارة الأقسام', pageSubtitle: 'إدارة ومتابعة جميع أقسام المستشفى', searchPlaceholder: 'البحث عن قسم...', addDept: 'إضافة قسم جديد', deptList: 'قائمة الأقسام', deptUnit: 'قسم', allStatuses: 'جميع الحالات', active: 'نشط', inactive: 'غير نشط', exportBtn: 'تصدير', colDeptName: 'اسم القسم', colHead: 'رئيس القسم', colDoctors: 'عدد الأطباء', colLocation: 'الموقع', colStatus: 'الحالة', colActions: 'الإجراءات', established: 'تأسس', view: 'عرض', edit: 'تعديل', disable: 'تعطيل', viewDetails: 'عرض التفاصيل', transferDoctors: 'نقل الأطباء', deleteDept: 'حذف القسم', showing: 'عرض', of: 'من', item: 'عنصر', prev: 'السابق', next: 'التالي', langSwitch: 'English', dashboardTitle: 'لوحة القيادة الرئيسية', dashboardSubtitle: 'نظرة عامة على أداء المستشفى والتنبيهات العاجلة', appointmentsTitle: 'جدول المواعيد الذكي', appointmentsSubtitle: 'إدارة مواعيد المرضى وحالات المتابعة بشكل متقدم',
  },
  en: {
    hospitalSystem: 'Hospital System', hospitalSub: 'نظام المستشفى', mainMenu: 'Main Menu', management: 'Management', ceoTitle: 'Chief Executive Officer', ceoName: 'Mohammed Ahmed', logout: 'Logout', pageTitle: 'Department Management', pageSubtitle: 'Manage and monitor all hospital departments', searchPlaceholder: 'Search for a department...', addDept: 'Add New Department', deptList: 'Departments List', deptUnit: 'dept', allStatuses: 'All Statuses', active: 'Active', inactive: 'Inactive', exportBtn: 'Export', colDeptName: 'Department Name', colHead: 'Head of Department', colDoctors: 'Doctors', colLocation: 'Location', colStatus: 'Status', colActions: 'Actions', established: 'Est.', view: 'View', edit: 'Edit', disable: 'Disable', viewDetails: 'View Details', transferDoctors: 'Transfer Doctors', deleteDept: 'Delete Department', showing: 'Showing', of: 'of', item: 'items', prev: 'Previous', next: 'Next', langSwitch: 'العربية', dashboardTitle: 'Main Dashboard', dashboardSubtitle: 'Overview of hospital performance and urgent alerts', appointmentsTitle: 'Smart Appointments Schedule', appointmentsSubtitle: 'Advanced management of patient bookings and follow-ups',
  },
};

const mainNavItems: NavItem[] = [
  { id: 'dashboard', labelAr: 'لوحة القيادة', labelEn: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'patients', labelAr: 'المرضى', labelEn: 'Patients', icon: <Users size={20} /> },
  { id: 'doctors', labelAr: 'الأطباء', labelEn: 'Doctors', icon: <Stethoscope size={20} /> },
  { id: 'appointments', labelAr: 'المواعيد', labelEn: 'Appointments', icon: <CalendarCheck size={20} /> },
  { id: 'reception', labelAr: 'الاستقبال', labelEn: 'Reception', icon: <ConciergeBell size={20} /> },
  { id: 'pharmacy', labelAr: 'الصيدلية', labelEn: 'Pharmacy', icon: <Pill size={20} /> },
  { id: 'labs', labelAr: 'المعامل', labelEn: 'Labs', icon: <FlaskConical size={20} /> },
  { id: 'radiology', labelAr: 'الأشعة', labelEn: 'Radiology', icon: <Activity size={20} /> },
  { id: 'ambulance', labelAr: 'الإسعاف', labelEn: 'Ambulance', icon: <Ambulance size={20} /> },
  { id: 'pricing', labelAr: 'الأسعار والمناوبات', labelEn: 'Prices & Shifts', icon: <CreditCard size={20} /> },
];

const managementItems: NavItem[] = [
  { id: 'departments_mgmt', labelAr: 'الأقسام والمسميات والتخصصات', labelEn: 'Depts, Titles, & Specialties', icon: <Building2 size={20} /> },
  { id: 'doctors_mgmt', labelAr: 'الأطباء والموظفين والتمريض', labelEn: 'Staff & Clinicians Mgmt', icon: <Stethoscope size={20} /> },
  { id: 'pharmacy_mgmt', labelAr: 'إدارة الصيدلية والمخزن', labelEn: 'Pharmacy & Warehouse', icon: <Pill size={20} /> },
  { id: 'labs_mgmt', labelAr: 'إدارة المختبرات', labelEn: 'Labs Mgmt', icon: <FlaskConical size={20} /> },
  { id: 'radiology_mgmt', labelAr: 'إدارة قسم الأشعة', labelEn: 'Radiology Mgmt', icon: <Activity size={20} /> },
  { id: 'accounts_mgmt', labelAr: 'حسابات الموظفين والأطباء', labelEn: 'Staff & Doctor Accounts', icon: <Shield size={20} /> },
  { id: 'services_mgmt', labelAr: 'إدارة الخدمات', labelEn: 'Services Mgmt', icon: <Wrench size={20} /> },
  { id: 'finance_mgmt', labelAr: 'إدارة المالية', labelEn: 'Finance Mgmt', icon: <Banknote size={20} /> },
  { id: 'salaries_mgmt', labelAr: 'إدارة المرتبات', labelEn: 'Salaries Mgmt', icon: <DollarSign size={20} /> },
  { id: 'settings', labelAr: 'الإعدادات', labelEn: 'Settings', icon: <Settings size={20} /> },
];

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [lang, setLang] = useState<Lang>('ar');
  const isAr = lang === 'ar';
  const tx = t[lang];
  const dir = isAr ? 'rtl' : 'ltr';

  const toggleLang = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  // Define role-based variables here, assuming currentUser might be null initially
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [managementOpen, setManagementOpen] = useState(true);
  
  const [doctorFilter, setDoctorFilter] = useState('');
  const handleNavigateToDoctors = (filter: string) => {
    setDoctorFilter(filter);
    setActivePage('doctors_mgmt');
  };

  const [services, setServices] = useState<HospitalService[]>([]);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [newService, setNewService] = useState({ nameAr: '', nameEn: '', classificationAr: '', classificationEn: '', price: '', discount: '0' });
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [editingPrice, setEditingPrice] = useState('');

  const [medicines, setMedicines] = useState<any[]>([]);
  const [pharmacyTransactions, setPharmacyTransactions] = useState<any[]>([]);
  const [isAddMedicineModalOpen, setIsAddMedicineModalOpen] = useState(false);
   const [newMedicine, setNewMedicine] = useState<any>({
     id: undefined,
     nameAr: '', nameEn: '',
     scientificNameAr: '', scientificNameEn: '',
     manufacturerAr: '', manufacturerEn: '',
     categoryAr: 'Medicine', categoryEn: 'Medicine',
     dosageFormAr: '', dosageFormEn: 'Tablets',
     concentration: '', batchNumber: '', barcode: '', location: '',
     stock: 0, minStock: 10,
     price: 0, purchasePrice: 0,
     expiryDate: '', supplierName: '',
     isRefrigerated: false, isFastMoving: false, image: null
   });

  const [salaries, setSalaries] = useState<any[]>([]);
  const [isAddSalaryModalOpen, setIsAddSalaryModalOpen] = useState(false);
  const [newSalary, setNewSalary] = useState<any>({
    id: undefined,
    employeeId: '', employeeNameAr: '', employeeNameEn: '',
    role: '', deptAr: '', deptEn: '',
    baseSalary: 0, housingAllowance: 0, transportAllowance: 0,
    riskAllowance: 0, incentives: 0, overtime: 0,
    commissionRate: 0, insuranceDeduction: 0,
    taxesDeduction: 0, absenceDeduction: 0,
    penaltyDeduction: 0, month: 'March 2024', status: 'pending'
  });

  const [transactions, setTransactions] = useState<any[]>([]);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({ descriptionAr: '', descriptionEn: '', amount: 0, type: 'income', categoryAr: '', categoryEn: '', date: new Date().toISOString().split('T')[0] });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    hospitalNameAr: 'مستشفى ريان',
    hospitalNameEn: 'Ryan Hospital',
    themeColor: '#0ea5e9',
    fontStyle: 'Cairo',
    logoUrl: '/hospital_logo.png',
    currencyAr: 'ج.م',
    currencyEn: 'EGP',
    hospitalEmail: 'ryanhazem27@gmail.com',
    hospitalPhone: '+249 123 456 789',
    companyEmail: 'admin@alshifa-company.com',
    companyPassword: '',
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    senderName: 'Al-Shifa Hospital',
    displayMode: 'light',
    supportEmail: 'support@alshifa.com',
    hrEmail: 'hr@alshifa.com',
    accountsEmail: 'accounts@alshifa.com',
    whatsapp: '',
    facebook: '',
    twitter: '',
    welcomeEmailTemplate: ''
  });
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'manager', status: 'active', permissions: ['DASHBOARD', 'RECEPTION'] });

  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [createdAccount, setCreatedAccount] = useState<{username: string, password: string, name?: string, role?: string, email?: string} | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const [depts, setDepts] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [nurses, setNurses] = useState<any[]>([]);
  const [isDocsTab, setIsDocsTab] = useState<'doctors' | 'nurses' | 'employees'>('doctors');
  const [isFetching, setIsFetching] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionMenuId, setActionMenuId] = useState<number | null>(null);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [jobTitles, setJobTitles] = useState<any[]>([]);
   const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
   const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
   const [passStep, setPassStep] = useState(1);
   const [passStepCode, setPassStepCode] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
     { id: 1, text: 'موعد جديد للمريض أحمد محمد', time: 'منذ 5 دقائق', type: 'appointment' },
     { id: 2, text: 'تم تحديث نتائج المختبر للمريض سارة', time: 'منذ 15 دقيقة', type: 'lab' },
  ]);

   const addNotification = (text: string, type: string) => {
     setNotifications(prev => [{ id: Date.now(), text, time: isAr ? 'الآن' : 'Just now', type }, ...prev]);
   };

  // Master Specializations List
  const [specialties, setSpecialties] = useState<any[]>([]);

  const userRole = currentUser?.role?.toLowerCase() || '';
  const isAdmin = ['admin', 'manager', 'superuser'].includes(userRole);
  const isDoctor = userRole === 'doctor' || userRole === 'طبيب';
  const isReception = userRole === 'receptionist' || userRole === 'استقبال';
  const isPharmacy = userRole === 'pharmacist' || userRole === 'صيدلية';
  const isLab = userRole === 'lab' || userRole === 'مختبرات' || userRole === 'معامل';
  const isAmbulance = userRole === 'ambulance' || userRole === 'إسعاف' || userRole === 'ambulance_dispatch';
  const isRadiology = userRole === 'radiology' || userRole === 'أشعة';

  useEffect(() => {
    if (!isLoggedIn) return;
    if (isDoctor && activePage === 'dashboard') setActivePage('doctors');
    else if (isReception && activePage === 'dashboard') setActivePage('reception');
    else if (isPharmacy && activePage === 'dashboard') setActivePage('pharmacy');
    else if (isLab && activePage === 'dashboard') setActivePage('labs');
    else if (isRadiology && activePage === 'dashboard') setActivePage('radiology');
    else if (isAmbulance && activePage === 'dashboard') setActivePage('ambulance');
  }, [isDoctor, isReception, isPharmacy, isLab, isRadiology, isAmbulance, isLoggedIn, activePage]);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActivePage('dashboard');
  };

  // Inject Dynamic Theme Color
  useEffect(() => {
    if (systemSettings.themeColor) {
      const root = document.documentElement;
      const color = systemSettings.themeColor;

      // Helper to generate some opacity variations
      root.style.setProperty('--primary-50', `${color}10`);
      root.style.setProperty('--primary-100', `${color}20`);
      root.style.setProperty('--primary-200', `${color}40`);
      root.style.setProperty('--primary-300', `${color}60`);
      root.style.setProperty('--primary-400', `${color}90`);
      root.style.setProperty('--primary-500', color);
      root.style.setProperty('--primary-600', color);
      root.style.setProperty('--primary-700', color);
    }
  }, [systemSettings.themeColor]);

  useEffect(() => {
    // Force login every time by not auto-setting isLoggedIn to true from old tokens
    // const token = localStorage.getItem('token');
    // if (token) setIsLoggedIn(true);
    setIsLoggedIn(false);
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSystemSettings({
          hospitalNameAr: data.hospital_name_ar || 'مستشفى الشفاء',
          hospitalNameEn: data.hospital_name_en || 'Al-Shifa Hospital',
          themeColor: data.theme_color || '#0ea5e9',
          fontStyle: data.font_style || 'Cairo',
          logoUrl: data.logo_url || '/hospital_logo.png',
          currencyAr: data.currency_ar || 'ج.م',
          currencyEn: data.currency_en || 'EGP',
          hospitalEmail: data.hospital_email || 'info@alshifa-hospital.com',
          hospitalPhone: data.hospital_phone || '+249 123 456 789',
          companyEmail: data.company_email || 'admin@alshifa-company.com',
          companyPassword: data.company_password || '',
          smtpHost: data.smtp_host || '',
          smtpPort: data.smtp_port || '587',
          smtpUser: data.smtp_user || '',
          smtpPass: data.smtp_pass || '',
          senderName: data.sender_name || 'Al-Shifa Hospital',
          displayMode: (data.display_mode as 'light' | 'dark') || 'light',
          supportEmail: data.support_email || 'support@alshifa.com',
          hrEmail: data.hr_email || 'hr@alshifa.com',
          accountsEmail: data.accounts_email || 'accounts@alshifa.com',
          whatsapp: data.whatsapp || '',
          facebook: data.facebook || '',
          twitter: data.twitter || '',
          welcomeEmailTemplate: data.welcome_email_template || ''
        });
      }
    } catch (err) { console.error("Settings fetch error:", err); }
  };

  const fetchJobTitles = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/job-titles', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setJobTitles(data.data.map((jt: any) => ({
           id: jt.id,
           nameAr: jt.name_ar,
           nameEn: jt.name_en,
           descriptionAr: jt.description_ar,
           descriptionEn: jt.description_en,
           status: jt.status,
           morningStart: jt.morning_start,
           morningEnd: jt.morning_end,
           eveningStart: jt.evening_start,
           eveningEnd: jt.evening_end,
           is24h: !!jt.is_24h
        })));
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchAllData();
      fetchJobTitles();
    }
  }, [isLoggedIn]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
       alert(isAr ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
       return;
    }
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/change-password', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          old_password: passwordData.oldPassword,
          new_password: passwordData.newPassword,
          new_password_confirmation: passwordData.confirmPassword
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert(isAr ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully');
        setIsPasswordModalOpen(false);
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        alert(data.message || (isAr ? 'فشل تغيير كلمة المرور' : 'Failed to change password'));
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    document.title = (lang === 'ar') ? systemSettings.hospitalNameAr : systemSettings.hospitalNameEn;
  }, [systemSettings.hospitalNameAr, systemSettings.hospitalNameEn, lang]);

  const fetchMedicines = async () => {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };
    try {
      const res = await fetch('/api/pharmacy', { headers });
      if (res.ok) {
        const data = await res.json();
        setMedicines(data.data);
      }

      const transRes = await fetch('/api/pharmacy/transactions', { headers });
      if (transRes.ok) {
        const transData = await transRes.json();
        setPharmacyTransactions(transData.data);
      }
    } catch (err) { console.error("Pharmacy fetch error:", err); }
  };

  const handleUploadPharmacyImage = async (id: number, file: File) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`/api/pharmacy/${id}/image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setMedicines(prev => prev.map(m => m.id === id ? { ...m, image_url: data.image_url } : m));
        alert(isAr ? 'تم رفع صورة الدواء بنجاح' : 'Medicine image uploaded successfully');
      } else {
        const err = await res.json();
        alert(err.message || 'فشل رفع الصورة');
      }
    } catch (err) { console.error("Pharmacy image upload error:", err); }
  };

  const fetchPrescriptions = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch('/api/prescriptions', {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setPrescriptions(data.data);
      }
    } catch (err) { console.error("Prescriptions fetch error:", err); }
  };

  const handleDispense = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/prescriptions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status: 'dispensed' })
      });
      if (res.ok) {
        fetchPrescriptions();
        fetchMedicines();
        alert(isAr ? 'تم صرف الدواء بنجاح' : 'Medication dispensed successfully');
      }
    } catch (err) { console.error("Dispense error:", err); }
  };

  const handleUploadDeptImage = async (id: number, file: File) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`/api/departments/${id}/image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        // Update depts in state
        setDepts(prev => prev.map(d => d.id === id ? { ...d, image_url: data.image_url } : d));
        alert(isAr ? 'تم رفع الصورة بنجاح' : 'Image uploaded successfully');
      } else {
        const err = await res.json();
        alert(err.message || 'فشل رفع الصورة');
      }
    } catch (err) { console.error("Dept image upload error:", err); }
  };

  const fetchSpecialties = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/specialties', { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } });
      if (res.ok) {
        const d = await res.json();
        setSpecialties(d.data.map((s: any) => ({
          ...s,
          nameAr: s.name_ar,
          nameEn: s.name_en,
          descriptionAr: s.description_ar,
          descriptionEn: s.description_en,
          morningStart: s.morning_start,
          morningEnd: s.morning_end,
          eveningStart: s.evening_start,
          eveningEnd: s.evening_end,
          is24h: !!s.is_24h
        })));
      }
    } catch (err) { console.error("Specialties fetch error:", err); }
  };

  const fetchAllData = async () => {
    setIsFetching(true);
    fetchMedicines();
    fetchPrescriptions();
    fetchSettings();
    fetchSpecialties();
    fetchJobTitles();
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };

    try {
      if (token) {
        const statsRes = await fetch('/api/dashboard/stats', { headers });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setDashboardStats(statsData);
        } else if (statsRes.status === 401) {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          alert('انتهت جلسة العمل، يرجى تسجيل الدخول مرة أخرى');
          return;
        }
      }

      fetchMedicines(); // Fetch medicines too

      const deptRes = await fetch('/api/departments', { headers });
      if (deptRes.ok) {
        const data = await deptRes.json();
        setDepts(data.data.map((d: any) => ({
          ...d,
          nameAr: d.name || 'قسم غير مسمى',
          nameEn: d.name || 'Unnamed Dept',
          headAr: d.head_doctor || 'لم يحدد',
          headEn: d.head_doctor || 'Not assigned',
          headAvatar: 'AD',
          doctorCount: d.employees_count || 0,
          status: d.status || 'active',
          established: d.created_at ? new Date(d.created_at).getFullYear().toString() : '2024',
          locationAr: d.location || 'غير محدد',
          locationEn: d.location || 'Not set',
          phone: d.phone || 'N/A',
          email: d.email || 'N/A',
          morning_start: d.morning_start,
          morning_end: d.morning_end,
          evening_start: d.evening_start,
          evening_end: d.evening_end,
          is_24h: !!d.is_24h
        })));
      }

      const serviceRes = await fetch('/api/services', { headers });
      if (serviceRes.ok) {
        const data = await serviceRes.json();
        setServices(data.data.map((s: any) => ({ 
          ...s, 
          nameAr: s.name_ar || s.name, 
          nameEn: s.name_en || s.name, 
          classificationAr: s.classification_ar || s.classification || s.description || 'عام', 
          classificationEn: s.classification_en || s.classification || s.description || 'General', 
          price: parseFloat(s.cost || s.price), 
          finalPrice: parseFloat(s.price_final || (s.cost * (1 - (s.discount || 0) / 100)) || s.cost),
          discount: parseFloat(s.discount) || 0 
        })));
      }

      const empRes = await fetch('/api/employees', { headers });
      if (empRes.ok) {
        const data = await empRes.json();
        const safeJsonParse = (str: any, fallback: any = []) => {
          if (!str) return fallback;
          if (typeof str !== 'string') return str;
          try { return JSON.parse(str); } catch (er) { return fallback; }
        };

        const allEmps = data.data.map((e: any) => ({
          ...e, nameAr: e.name, nameEn: e.name, positionAr: e.role, positionEn: e.role, deptAr: e.department?.name || 'N/A', deptEn: e.department?.name || 'N/A', status: 'active', joinDate: e.hire_date, salary: parseFloat(e.salary) || 0, phone: e.phone || 'N/A',
          bankName: e.bank_name, bankAccount: e.bank_account,
          day_shifts: safeJsonParse(e.day_shifts, [])
        }));

        const docs = allEmps.filter((e: any) => ['doctor', 'طبيب', 'طبيب عام', 'طبيب أخصائي'].includes((e.role || '').toLowerCase())).map((e: any) => ({
          ...e,
          id: e.id,
          nameAr: e.name || e.nameAr,
          nameEn: e.name || e.nameEn,
          specialtyAr: e.specialty_ar || 'عام',
          specialtyEn: e.specialty_en || 'General',
          deptAr: e.department?.name || 'N/A',
          deptEn: e.department?.name || 'N/A',
          deptId: e.department_id,
          status: e.status || 'active',
          phone: e.phone || 'N/A',
          email: e.email || 'N/A',
          consultation_fee: parseFloat(e.consultation_fee) || 0,
          commission_rate: parseFloat(e.commission_rate) || 0,
          medical_id: e.medical_id || e.staff_id,
          national_id: e.national_id,
          license_number: e.license_number,
          practice_cert: e.practice_cert,
          day_shifts: e.day_shifts && e.day_shifts.length > 0 ? e.day_shifts : (e.manawbats || []),
          job_title: e.job_title || (isAr ? 'طبيب' : 'Doctor'),
          bank_name: e.bank_name,
          bank_account: e.bank_account,
          hire_date: e.hire_date,
          salary: parseFloat(e.salary) || 0
        }));

        const nurseListing = allEmps.filter((e: any) => ['nurse', 'ممرض', 'ممرضة', 'تمريض'].includes((e.role || '').toLowerCase())).map((e: any) => ({
          ...e,
          id: e.id,
          nameAr: e.name || e.nameAr,
          nameEn: e.name || e.nameEn,
          deptAr: e.department?.name || 'N/A',
          deptEn: e.department?.name || 'N/A',
          deptId: e.department_id,
          status: e.status || 'active',
          phone: e.phone || 'N/A',
          email: e.email || 'N/A',
          medical_id: e.medical_id || e.staff_id,
          day_shifts: e.day_shifts && e.day_shifts.length > 0 ? e.day_shifts : (e.manawbats || []),
          job_title: e.job_title || (isAr ? 'ممرض' : 'Nurse'),
          salary: parseFloat(e.salary) || 0
        }));

        setEmployees(allEmps.filter((e: any) => !['doctor', 'طبيب', 'طبيب عام', 'طبيب أخصائي', 'nurse', 'ممرض', 'ممرضة', 'تمريض'].includes((e.role || '').toLowerCase())));
        setDoctors(docs);
        setNurses(nurseListing);
      }

      const payrollRes = await fetch('/api/payrolls', { headers });
      if (payrollRes.ok) {
        const pdata = await payrollRes.json();
        setSalaries(pdata.data.map((p: any) => ({
          ...p,
          employeeId: p.employee?.staff_id || p.employee_id,
          employeeNameAr: p.employee?.name || 'Unknown',
          employeeNameEn: p.employee?.name || 'Unknown',
          role: p.employee?.role || 'staff',
          deptAr: p.employee?.department?.name || 'N/A',
          deptEn: p.employee?.department?.name || 'N/A',
          baseSalary: parseFloat(p.basic_salary) || 0,
          housingAllowance: parseFloat(p.housing_allowance) || 0,
          transportAllowance: parseFloat(p.transport_allowance) || 0,
          riskAllowance: parseFloat(p.risk_allowance) || 0,
          incentives: parseFloat(p.incentives) || 0,
          overtime: parseFloat(p.overtime) || 0,
          commissionRate: parseFloat(p.commission_rate) || 0,
          insuranceDeduction: parseFloat(p.insurance_deduction) || 0,
          taxesDeduction: parseFloat(p.taxes_deduction) || 0,
          absenceDeduction: parseFloat(p.absence_deduction) || 0,
          penaltyDeduction: parseFloat(p.penalty_deduction) || 0,
          netSalary: parseFloat(p.net_salary) || 0,
          status: p.status || 'pending',
          month: p.month || 'N/A'
        })));
      }

      const apptRes = await fetch('/api/appointments', { headers });
      if (apptRes.ok) {
        const adata = await apptRes.json();
        setAppointments(adata.data || []);
      }
      const transRes = await fetch('/api/transactions', { headers });
      if (transRes.ok) {
        const tdata = await transRes.json();
        setTransactions(tdata.data.map((t: any) => ({
          ...t,
          descriptionAr: t.description_ar,
          descriptionEn: t.description_en,
          categoryAr: t.category_ar,
          categoryEn: t.category_en,
          date: t.transaction_date,
        })));
      }

      const specRes = await fetch('/api/specialties', { headers });
      if (specRes.ok) {
        const sdata = await specRes.json();
        setSpecialties(sdata.data.map((s: any) => ({
          id: s.id,
          nameAr: s.name_ar,
          nameEn: s.name_en,
          descriptionAr: s.description_ar,
          descriptionEn: s.description_en,
          status: s.status || 'active',
          morningStart: s.morning_start,
          morningEnd: s.morning_end,
          eveningStart: s.evening_start,
          eveningEnd: s.evening_end,
          is24h: !!s.is_24h
        })));
      }
    } catch (err) { console.error("Fetch data error:", err); } finally { setIsFetching(false); }

    try {
      const adminRes = await fetch('/api/users/admins', { headers });
      if (adminRes.ok) {
        const adminData = await adminRes.json();
        setAdminUsers(adminData.map((u: any) => ({
          ...u,
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role || 'manager',
          status: 'active',
          permissions: u.role === 'admin' ? ['ALL'] : ['DASHBOARD', 'RECEPTION']
        })));
      }

      const settingsRes = await fetch('/api/settings', { headers });
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSystemSettings({
          hospitalNameAr: settingsData.hospital_name_ar || 'مستشفى الشفاء',
          hospitalNameEn: settingsData.hospital_name_en || 'Al-Shifa Hospital',
          hospitalEmail: settingsData.hospital_email || 'info@alshifa.com',
          hospitalPhone: settingsData.hospital_phone || '',
          companyEmail: settingsData.company_email || '',
          themeColor: settingsData.theme_color || '#0ea5e9',
          fontStyle: settingsData.font_style || 'Cairo',
          currencyAr: settingsData.currency_ar || 'ج.م',
          currencyEn: settingsData.currency_en || 'EGP',
          logoUrl: settingsData.logo_url || '/hospital_logo.png',
          companyPassword: settingsData.company_password || '',
          smtpHost: settingsData.smtp_host || '',
          smtpPort: settingsData.smtp_port || '587',
          smtpUser: settingsData.smtp_user || '',
          smtpPass: settingsData.smtp_pass || '',
          senderName: settingsData.sender_name || 'Al-Shifa Hospital',
          displayMode: (settingsData.display_mode as 'light' | 'dark') || 'light',
          supportEmail: settingsData.support_email || 'support@alshifa.com',
          hrEmail: settingsData.hr_email || 'hr@alshifa.com',
          accountsEmail: settingsData.accounts_email || 'accounts@alshifa.com',
          whatsapp: settingsData.whatsapp || '',
          facebook: settingsData.facebook || '',
          twitter: settingsData.twitter || '',
          welcomeEmailTemplate: settingsData.welcome_email_template || ''
        });
      }
    } catch (err) {
      console.error("Error fetching settings/admins:", err);
    }
  };

  const [isDeptsTab, setIsDeptsTab] = useState<'list' | 'titles' | 'specialties' | 'hours'>('list');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDept, setNewDept] = useState({ code: '', nameAr: '', nameEn: '', headAr: '', headEn: '', count: '', locationAr: '', locationEn: '', status: 'active', description: '', phone: '', email: '', morning_start: '08:00', morning_end: '14:00', evening_start: '14:00', evening_end: '20:00', is_24h: false });

  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState<any>({ 
    nameAr: '', nameEn: '', positionAr: '', positionEn: '', 
    deptId: '', salary: '', email: '', phone: '', staffId: '', 
    shifts: [] as string[], bank_name: '', bank_account: '',
    day_shifts: [] as { day: string, type: string, work_hours: number }[]
  });

  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState<any>({
    nameAr: '', nameEn: '', specialtyAr: '', specialtyEn: '',
    deptId: '', phone: '', email: '', consultationPrice: 0,
    medical_id: '', dob: '', gender: 'male', address: '',
    degree: '', expYears: 0,
    jobTitleAr: '', jobTitleEn: '', status: 'active', shifts: [],
    national_id: '', license_number: '', practice_cert: '',
    bank_name: '', bank_account: '',
    commissionRate: 0,
    day_shifts: []
  });

  const [isAddNurseModalOpen, setIsAddNurseModalOpen] = useState(false);
  const [newNurse, setNewNurse] = useState<any>({
    nameAr: '', nameEn: '', deptId: '', phone: '', email: '', 
    medical_id: '', dob: '', gender: 'female', address: '',
    jobTitleAr: '', status: 'active', shifts: [],
    bank_name: '', bank_account: '', salary: 0,
    day_shifts: []
  });

  const handleDeleteEmployee = async (id: number) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف الموظف؟' : 'Are you sure you want to delete this employee?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/employees/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) fetchAllData();
      else alert(isAr ? 'فشل حذف الموظف' : 'Failed to delete employee');
    } catch (err) { console.error('Delete error', err); }
  };

  const handleDeleteDoctor = async (id: number) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف الطبيب؟' : 'Are you sure you want to delete this doctor?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/employees/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) fetchAllData();
      else alert(isAr ? 'فشل حذف الطبيب' : 'Failed to delete doctor');
    } catch (err) { console.error('Delete error', err); }
  };

  const handleDeleteNurse = async (id: number) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف الممرض؟' : 'Are you sure you want to delete this nurse?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/employees/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) fetchAllData();
      else alert(isAr ? 'فشل حذف الممرض' : 'Failed to delete nurse');
    } catch (err) { console.error('Delete error', err); }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const isEdit = !!newEmployee.id;
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/api/employees/${newEmployee.id}` : '/api/employees';

    const generatedPassword = Math.random().toString(36).replace(/[^a-z0-9]/gi, '').slice(-8); // Random 8-char password without symbols

    const payload: any = {
        name: newEmployee.nameAr || newEmployee.name,
        role: newEmployee.positionAr || newEmployee.role,
        email: newEmployee.email,
        phone: newEmployee.phone,
        salary: parseFloat(newEmployee.salary || '0'),
        department_id: parseInt(newEmployee.deptId || '1') || depts[0]?.id || 1,
        shifts: newEmployee.shifts,
        bank_name: newEmployee.bankName,
        bank_account: newEmployee.bankAccount,
        status: newEmployee.status || 'active',
        day_shifts: newEmployee.day_shifts
    };

    if (!isEdit) {
      payload.staff_id = newEmployee.staffId || undefined;
      payload.hire_date = new Date().toISOString().split('T')[0];
      payload.password = generatedPassword;
    }

    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const data = await response.json();
      setIsAddEmployeeModalOpen(false);
      fetchAllData();
      if (!isEdit && data.data?.account) {
        setCreatedAccount({ ...data.data.account, name: newEmployee.nameAr || newEmployee.name || '', role: newEmployee.positionEn || newEmployee.role, email: newEmployee.email });
        setIsAccountModalOpen(true);
      }
      setNewEmployee({ 
        nameAr: '', nameEn: '', positionAr: '', positionEn: '', deptId: '', 
        salary: '', email: '', phone: '', staffId: '', shifts: [], 
        bankName: '', bankAccount: '', day_shifts: []
      });
    }
    else { const err = await response.json(); alert(err.message || 'فشل حفظ الموظف'); }
  };

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const isEdit = !!newDoctor.id;
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/api/employees/${newDoctor.id}` : '/api/employees';

    // Auto-generate IDs if empty
    const generatedMedicalId = newDoctor.medical_id || `DOC-${Math.floor(1000 + Math.random() * 9000)}`;
    const generatedStaffId = newDoctor.staff_id || `STF-${Date.now().toString().slice(-6)}`;
    const generatedPassword = Math.random().toString(36).replace(/[^a-z0-9]/gi, '').slice(-8); // Random 8-char password without symbols

    const payload: any = {
        name: newDoctor.nameAr || newDoctor.name,
        role: 'doctor',
        specialty_ar: newDoctor.specialtyAr,
        specialty_en: newDoctor.specialtyEn,
        email: newDoctor.email,
        phone: newDoctor.phone,
        consultation_fee: Number(newDoctor.consultationPrice) || 0,
        commission_rate: Number(newDoctor.commissionRate) || 0,
        department_id: parseInt(newDoctor.deptId || '1') || (depts && depts.length > 0 ? depts[0].id : 1),
        national_id: newDoctor.national_id,
        license_number: newDoctor.license_number,
        practice_cert: newDoctor.practice_cert,
        job_title: newDoctor.jobTitleAr || `طبيب - ${newDoctor.specialtyAr || 'عام'}`,
        status: newDoctor.status || 'active',
        day_shifts: newDoctor.day_shifts || [],
        bank_name: newDoctor.bank_name,
        bank_account: newDoctor.bank_account,
    };

    if (!isEdit) {
      payload.staff_id = newDoctor.staff_id || undefined;
      payload.medical_id = newDoctor.medical_id || undefined;
      payload.hire_date = new Date().toISOString().split('T')[0];
      payload.password = generatedPassword;
    }

    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const data = await response.json();
      setIsAddDoctorModalOpen(false);
      fetchAllData();
      // Account modal removed per user request for doctors
      setNewDoctor({ nameAr: '', nameEn: '', specialtyAr: '', specialtyEn: '', deptId: '', phone: '', email: '', consultationPrice: 0, medicalId: '', dob: '', gender: 'male', address: '', degree: '', expYears: 0, jobTitle: '', status: 'active', shifts: [], dayShifts: [], workHours: { start: '08:00', end: '16:00' }, workingDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'], nationalId: '', licenseNumber: '', practiceCert: '', bankName: '', bankAccount: '', commissionRate: 0 });
    }
    else { const err = await response.json(); alert(err.message || 'فشل حفظ الطبيب'); }
  };

  const handleAddNurse = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const isEdit = !!newNurse.id;
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/api/employees/${newNurse.id}` : '/api/employees';

    const payload: any = {
        name: newNurse.nameAr || newNurse.name,
        role: 'nurse',
        email: newNurse.email,
        phone: newNurse.phone,
        department_id: parseInt(newNurse.deptId || '1') || (depts && depts.length > 0 ? depts[0].id : 1),
        job_title: newNurse.jobTitleAr || (isAr ? 'ممرض' : 'Nurse'),
        status: newNurse.status || 'active',
        day_shifts: newNurse.day_shifts || [],
        bank_name: newNurse.bank_name,
        bank_account: newNurse.bank_account,
        salary: parseFloat(newNurse.salary || '0')
    };

    if (!isEdit) {
      payload.staff_id = newNurse.staff_id || undefined;
      payload.medical_id = newNurse.medical_id || undefined;
      payload.hire_date = new Date().toISOString().split('T')[0];
      payload.password = Math.random().toString(36).replace(/[^a-z0-9]/gi, '').slice(-8);
    }

    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      setIsAddNurseModalOpen(false);
      fetchAllData();
      setNewNurse({ nameAr: '', nameEn: '', deptId: '', phone: '', email: '', medical_id: '', dob: '', gender: 'female', address: '', jobTitleAr: '', status: 'active', shifts: [], bank_name: '', bank_account: '', salary: 0, day_shifts: [] });
    }
    else { const err = await response.json(); alert(err.message || 'فشل حفظ البيانات'); }
  };

  const handleDeleteDept = async (id: number) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف القسم؟' : 'Are you sure you want to delete this department?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/departments/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) fetchAllData();
      else alert(isAr ? 'فشل حذف القسم' : 'Failed to delete department');
    } catch (err) { console.error('Delete error', err); }
  };

  const handleSendCredentials = async (id: number, password: string, message?: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/employees/${id}/send-credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ password, message })
      });
      const data = await res.json();
      if (data.success) {
        alert(isAr ? 'تم إرسال بيانات الدخول بنجاح!' : 'Credentials sent successfully!');
      } else {
        alert(data.message || (isAr ? 'فشل إرسال البريد' : 'Failed to send email'));
      }
    } catch (err) {
      console.error("Send credentials error:", err);
      alert(isAr ? 'خطأ في الاتصال' : 'Connection error');
    }
  };

  const handleAddDept = async (e: React.FormEvent | null, customData?: any) => {
    if (e) e.preventDefault();
    const token = localStorage.getItem('token');
    const deptId = customData ? customData.id : (newDept as any).id;
    const isEdit = !!deptId;
    const url = isEdit ? `/api/departments/${deptId}` : '/api/departments';
    const method = isEdit ? 'PUT' : 'POST';

    const maxCodeNum = depts.reduce((max, d) => {
      const match = d.code?.match(/DEPT-(\d+)/);
      return match ? Math.max(max, parseInt(match[1])) : max;
    }, 0);
    const autoCode = `DEPT-${maxCodeNum + 1}`;

    const info = customData || {
        name: newDept.nameAr,
        code: isEdit ? (newDept.code || autoCode) : autoCode,
        head_doctor: newDept.headAr,
        location: newDept.locationAr,
        phone: newDept.phone,
        email: newDept.email,
        description: newDept.description,
        status: newDept.status,
        morning_start: newDept.morning_start || '08:00',
        morning_end: newDept.morning_end || '14:00',
        evening_start: newDept.evening_start || '14:00',
        evening_end: newDept.evening_end || '20:00',
        is_24h: newDept.is_24h || false
    };

    const payload = customData ? {
        ...info,
        name: customData.nameAr || info.name,
        head_doctor: customData.headAr || info.head_doctor,
        location: customData.locationAr || info.location
    } : info;

    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
       setIsAddModalOpen(false);
       fetchAllData();
       setNewDept({ code: '', nameAr: '', nameEn: '', headAr: '', headEn: '', count: '', locationAr: '', locationEn: '', status: 'active', description: '', phone: '', email: '', morning_start: '08:00', morning_end: '14:00', evening_start: '14:00', evening_end: '20:00', is_24h: false });
    }
    else { const err = await response.json(); alert(err.message || 'فشل حفظ القسم'); }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const svcId = (newService as any).id;
    const url = svcId ? `/api/services/${svcId}` : '/api/services';
    const method = svcId ? 'PUT' : 'POST';
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
      body: JSON.stringify({
        name: newService.nameAr,
        cost: parseFloat(newService.price),
        description: newService.classificationAr,
        department_id: depts[0]?.id || 1
      }),
    });
    if (response.ok) {
        setIsAddServiceModalOpen(false);
        fetchAllData();
        setNewService({ nameAr: '', nameEn: '', classificationAr: '', classificationEn: '', price: '', discount: '0' });
    }
    else { const err = await response.json(); alert(err.message || 'فشل حفظ الخدمة'); }
  };

  const handleDeleteService = async (id: number) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذه الخدمة؟' : 'Are you sure you want to delete this service?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) fetchAllData();
      else alert(isAr ? 'فشل الحذف' : 'Failed to delete');
    } catch (err) { console.error('Delete error', err); }
  };

  const handleAddMedicine = async (medData?: any) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    const data = medData || newMedicine;

    formData.append('nameAr', data.nameAr);
    formData.append('nameEn', data.nameEn || '');
    formData.append('categoryAr', data.categoryAr || 'Medicine');
    formData.append('categoryEn', data.categoryEn || 'Medicine');
    formData.append('stock', (data.stock || 0).toString());
    formData.append('price', (data.price || 0).toString());
    formData.append('purchasePrice', (data.purchasePrice || 0).toString());
    formData.append('expiryDate', data.expiryDate || '');
    formData.append('scientificNameAr', data.scientificNameAr || '');
    formData.append('scientificNameEn', data.scientificNameEn || '');
    formData.append('manufacturerAr', data.manufacturerAr || '');
    formData.append('manufacturerEn', data.manufacturerEn || '');
    formData.append('dosageFormAr', data.dosageFormAr || '');
    formData.append('dosageFormEn', data.dosageFormEn || '');
    formData.append('concentration', (data.strength || data.concentration || ''));
    formData.append('batchNumber', data.batchNumber || '');
    formData.append('barcode', data.barcode || '');
    formData.append('supplierName', data.supplierName || '');
    formData.append('location', data.location || '');
    formData.append('minStock', (data.minStock || 10).toString());
    formData.append('isRefrigerated', data.isRefrigerated ? '1' : '0');
    formData.append('isFastMoving', data.isFastMoving ? '1' : '0');

    if (data.image) {
      formData.append('image', data.image);
    }

    try {
      const response = await fetch('/api/pharmacy', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        body: formData,
      });
      if (response.ok) {
        setIsAddMedicineModalOpen(false);
        fetchMedicines();
        setNewMedicine({
          nameAr: '', nameEn: '',
          scientificNameAr: '', scientificNameEn: '',
          manufacturerAr: '', manufacturerEn: '',
          categoryAr: 'Medicine', categoryEn: 'Medicine',
          dosageFormAr: '', dosageFormEn: 'Tablets',
          concentration: '', batchNumber: '', barcode: '', location: '',
          stock: 0, minStock: 10,
          price: 0, purchasePrice: 0,
          expiryDate: '', supplierName: '',
          isRefrigerated: false, isFastMoving: false, image: null
        });
      } else {
        const err = await response.json();
        alert(err.message || 'فشل حفظ الدواء');
      }
    } catch (err) { console.error("Pharmacy add error:", err); }
  };

  const handleUpdateMedicine = async (medData: any) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('_method', 'PUT');
    
    formData.append('nameAr', medData.nameAr);
    formData.append('nameEn', medData.nameEn || '');
    formData.append('categoryAr', medData.categoryAr || 'Medicine');
    formData.append('categoryEn', medData.categoryEn || 'Medicine');
    formData.append('stock', (medData.stock || 0).toString());
    formData.append('price', (medData.price || 0).toString());
    formData.append('purchasePrice', (medData.purchasePrice || 0).toString());
    formData.append('expiryDate', medData.expiryDate || '');
    formData.append('scientificNameAr', medData.scientificNameAr || '');
    formData.append('scientificNameEn', medData.scientificNameEn || '');
    formData.append('manufacturerAr', medData.manufacturerAr || '');
    formData.append('manufacturerEn', medData.manufacturerEn || '');
    formData.append('dosageFormAr', medData.dosageFormAr || '');
    formData.append('dosageFormEn', medData.dosageFormEn || '');
    formData.append('concentration', (medData.strength || medData.concentration || ''));
    formData.append('batchNumber', medData.batchNumber || '');
    formData.append('barcode', medData.barcode || '');
    formData.append('supplierName', medData.supplierName || '');
    formData.append('location', medData.location || '');
    formData.append('minStock', (medData.minStock || 10).toString());
    formData.append('isRefrigerated', medData.isRefrigerated ? '1' : '0');
    formData.append('isFastMoving', medData.isFastMoving ? '1' : '0');

    try {
      const response = await fetch(`/api/pharmacy/${medData.id}`, {
        method: 'POST', // POST with _method=PUT for FormData
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        body: formData,
      });
      if (response.ok) {
        fetchMedicines();
      } else {
        const err = await response.json();
        alert(err.message || 'فشل تحديث الدواء');
      }
    } catch (err) { console.error("Pharmacy update error:", err); }
  };

  const handleSendPrescription = async (prescriptionData: any) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        body: JSON.stringify({
          patient_id: prescriptionData.patient_id || 2,
          doctor_id: currentUser?.employee?.id || 1,
          medicine_name: prescriptionData.medications[0]?.name || prescriptionData.notes,
          dosage: prescriptionData.medications[0]?.dosage || 'ASAP',
          frequency: prescriptionData.medications[0]?.frequency || 'Once daily',
          notes: prescriptionData.notes
        }),
      });
      if (response.ok) {
        alert(isAr ? 'تم إرسال الروشتة للصيدلية بنجاح' : 'Prescription sent to pharmacy successfully');
        fetchPrescriptions();
        const docName = currentUser?.name || (isAr ? 'طبيب مجهول' : 'Unknown Doctor');
        addNotification(isAr 
          ? `روشتة جديدة (${prescriptionData.notes}) للمريض ${prescriptionData.patient_name} من د. ${docName}` 
          : `New prescription (${prescriptionData.notes}) for patient ${prescriptionData.patient_name} from Dr. ${docName}`, 
          'prescription');
      } else {
        const err = await response.json();
        alert(err.message || 'فشل إرسال الروشتة');
      }
    } catch (err) { console.error("Prescription send error:", err); }
  };

  const handleDeleteMedicine = async (id: number) => {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذا الدواء؟' : 'Are you sure you want to delete this medicine?')) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/pharmacy/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
      });
      if (response.ok) {
        fetchMedicines();
      } else {
        const err = await response.json();
        alert(err.message || 'فشل حذف الدواء');
      }
    } catch (err) { console.error("Pharmacy delete error:", err); }
  };

  const handleAddSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    // Calculate real revenue if doctor
    let doctorRevenue = 0;
    if (newSalary.role === 'doctor') {
      const docAppts = appointments.filter(a =>
        String(a.doctor_id) === String(newSalary.employeeId) &&
        a.status !== 'cancelled'
      );
      doctorRevenue = docAppts.reduce((sum, a) => sum + (Number(a.final_price) || 0), 0);
    }

    // Calculate net salary before sending
    const netCalculated = (
      Number(newSalary.baseSalary || 0) +
      Number(newSalary.housingAllowance || 0) +
      Number(newSalary.transportAllowance || 0) +
      Number(newSalary.riskAllowance || 0) +
      Number(newSalary.incentives || 0) +
      Number(newSalary.overtime || 0) +
      (newSalary.role === 'doctor' ? (Number(newSalary.commissionRate || 0) / 100 * doctorRevenue) : 0) -
      (Number(newSalary.insuranceDeduction || 0) +
       Number(newSalary.taxesDeduction || 0) +
       Number(newSalary.absenceDeduction || 0) +
       Number(newSalary.penaltyDeduction || 0))
    );

    const isEdit = !!newSalary.id;
    const url = isEdit ? `/api/payrolls/${newSalary.id}` : '/api/payrolls';
    const method = isEdit ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        employee_id: newSalary.employeeId,
        basic_salary: newSalary.baseSalary,
        housing_allowance: newSalary.housingAllowance || 0,
        transport_allowance: newSalary.transportAllowance || 0,
        risk_allowance: newSalary.riskAllowance || 0,
        incentives: newSalary.incentives || 0,
        overtime: newSalary.overtime || 0,
        commission_rate: newSalary.commissionRate || 0,
        insurance_deduction: newSalary.insuranceDeduction || 0,
        taxes_deduction: newSalary.taxesDeduction || 0,
        absence_deduction: newSalary.absenceDeduction || 0,
        penalty_deduction: newSalary.penaltyDeduction || 0,
        net_salary: netCalculated,
        month: newSalary.month,
        status: newSalary.status || 'pending'
      }),
    });

    if (response.ok) {
      setIsAddSalaryModalOpen(false);
      fetchAllData();
      setNewSalary({
        id: undefined, employeeId: '', employeeNameAr: '', employeeNameEn: '',
        role: '', deptAr: '', deptEn: '',
        baseSalary: 0, housingAllowance: 0, transportAllowance: 0,
        riskAllowance: 0, incentives: 0, overtime: 0,
        commissionRate: 0, insuranceDeduction: 0,
        taxesDeduction: 0, absenceDeduction: 0,
        penaltyDeduction: 0, month: 'March 2024', status: 'pending'
      });
    } else {
      const err = await response.json();
      alert(err.message || 'فشل حفظ سجل الراتب');
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          description_ar: newTransaction.descriptionAr,
          description_en: newTransaction.descriptionEn || newTransaction.descriptionAr,
          amount: parseFloat(newTransaction.amount as any),
          type: newTransaction.type,
          category_ar: newTransaction.categoryAr || (isAr ? 'عام' : 'General'),
          category_en: newTransaction.categoryEn || (isAr ? 'General' : 'General'),
          transaction_date: newTransaction.date || new Date().toISOString().split('T')[0]
        }),
      });
      if (response.ok) {
        setIsAddTransactionModalOpen(false);
        fetchAllData();
        setNewTransaction({ descriptionAr: '', descriptionEn: '', amount: 0, type: 'income', categoryAr: '', categoryEn: '', date: new Date().toISOString().split('T')[0] });
      }
    } catch (err) { console.error("Transaction add error:", err); }
  };

  const handleDeleteTransaction = async (id: number) => {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذه العملية؟' : 'Are you sure you want to delete this transaction?')) return;
    const token = localStorage.getItem('token');
    try {
      await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchAllData();
    } catch (err) { console.error("Delete transaction error:", err); }
  };

  const updateSettings = async (s: SystemSettings) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          hospital_name_ar: s.hospitalNameAr,
          hospital_name_en: s.hospitalNameEn,
          hospital_email: s.hospitalEmail,
          hospital_phone: s.hospitalPhone,
          company_email: s.companyEmail,
          company_password: s.companyPassword,
          smtp_host: s.smtpHost,
          smtp_port: s.smtpPort,
          smtp_user: s.smtpUser,
          smtp_pass: s.smtpPass,
          sender_name: s.senderName,
          display_mode: s.displayMode,
          support_email: s.supportEmail,
          hr_email: s.hrEmail,
          accounts_email: s.accountsEmail,
          whatsapp: s.whatsapp,
          facebook: s.facebook,
          twitter: s.twitter,
          theme_color: s.themeColor,
          font_style: s.fontStyle,
          currency_ar: s.currencyAr,
          currency_en: s.currencyEn,
          logo_url: s.logoUrl
        }),
      });

      if (response.ok) {
        setSystemSettings(s);
        // Refresh settings from server to be sure
        const fresh = await response.json();
        if (fresh.success === false) {
           throw new Error(fresh.message || 'Unknown error');
        }
      } else {
        const errDetails = await response.text();
        console.error('Save settings failed:', errDetails);
        alert(isAr ? 'فشل حفظ الإعدادات في الخادم' : 'Failed to save settings on server');
      }
    } catch (error) {
      console.error('Update settings error:', error);
      alert(isAr ? 'خطأ في الاتصال بالخادم' : 'Connection error to server');
    }
  };
  const addUser = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminUsers([...adminUsers, { ...newUser, id: Date.now() }]);
    setIsAddUserModalOpen(false);
  };

  const saveServicePrice = async (id: number) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ cost: parseFloat(editingPrice) }),
    });
    setEditingServiceId(null);
    fetchAllData();
  };


  const handleSendRadiologyRequest = async (radiologyData: any) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/radiology-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        body: JSON.stringify({
          patient_id: radiologyData.patient_id || 2,
          doctor_id: currentUser?.employee?.id || 1,
          scan_name_ar: radiologyData.scan_name_ar,
          scan_name_en: radiologyData.scan_name_en,
          notes: radiologyData.notes,
          priority: radiologyData.priority || 'normal'
        }),
      });
      if (response.ok) {
        alert(isAr ? 'تم إرسال طلب الأشعة بنجاح' : 'Radiology request sent successfully');
        const docName = currentUser?.name || (isAr ? 'طبيب مجهول' : 'Unknown Doctor');
        addNotification(isAr 
          ? `طلب أشعة (${radiologyData.scan_name_ar}) للمريض ${radiologyData.patient_name} من د. ${docName}` 
          : `Radiology request (${radiologyData.scan_name_en}) for patient ${radiologyData.patient_name} from Dr. ${docName}`, 
          'radiology');
      } else {
        const err = await response.json();
        alert(err.message || 'فشل إرسال طلب الأشعة');
      }
    } catch (err) { console.error("Radiology send error:", err); }
  };


  const handleSendLabRequest = async (labReq: any) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/lab-requests', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...labReq,
          doctor_id: currentUser?.employee?.id || 1
        })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to send lab request');
      }
      const docName = currentUser?.name || (isAr ? 'طبيب مجهول' : 'Unknown Doctor');
      addNotification(isAr 
        ? `فحوصات مطلوبة (${labReq.test_name_ar}) للمريض ${labReq.patient_name} من د. ${docName}` 
        : `Lab tests requested (${labReq.test_name_en}) for patient ${labReq.patient_name} from Dr. ${docName}`, 
        'lab');
    } catch (err) { console.error("Lab request error:", err); }
  };

  const handleDeletePatient = async (id: number) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف ملف هذا المريض؟' : 'Are you sure you want to delete this patient record?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/patients/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchAllData();
    } catch (err) { console.error("Delete patient error:", err); }
  };


  const dashboardStatsList = [
    { titleAr: 'إجمالي الأقسام', titleEn: 'Total Departments', value: dashboardStats?.depts || 0, subtitleAr: 'قسم فعال', subtitleEn: 'active depts', icon: <Building2 size={24} />, iconBg: 'bg-sky-50', iconColor: 'text-sky-500', trendUp: true },
    { titleAr: 'إجمالي الأطباء', titleEn: 'Total Doctors', value: dashboardStats?.employees || 0, subtitleAr: 'طبيب مسجل', subtitleEn: 'registered doctors', icon: <Stethoscope size={24} />, iconBg: 'bg-blue-50', iconColor: 'text-blue-500', trendUp: true },
    { titleAr: 'المرضى اليوم', titleEn: 'Today Patients', value: dashboardStats?.patients || 0, subtitleAr: 'حالة مسجلة', subtitleEn: 'cases today', icon: <Users size={24} />, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', trendUp: true },
  ];

  if (!isLoggedIn) return (
    <LoginPage
       isAr={isAr}
       onToggleLang={toggleLang}
       onLogin={(user: any) => { setCurrentUser(user); setIsLoggedIn(true); }}
       settings={systemSettings}
    />
  );

  const getFontFamily = (style: string) => {
    switch(style) {
      case 'Cairo': return "'Cairo', sans-serif";
      case 'Inter': return "'Inter', sans-serif";
      case 'Outfit': return "'Outfit', sans-serif";
      case 'Montserrat': return "'Montserrat', sans-serif";
      case 'Serif': return "serif";
      default: return "'Cairo', sans-serif";
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${systemSettings.displayMode === 'dark' ? 'dark bg-[#0f172a] text-slate-200' : 'bg-slate-50 text-slate-900'}`} dir={dir} style={{ fontFamily: getFontFamily(systemSettings.fontStyle) }}>
      <style>{`
        :root {
          --primary-50: ${systemSettings.themeColor}10;
          --primary-100: ${systemSettings.themeColor}20;
          --primary-200: ${systemSettings.themeColor}40;
          --primary-300: ${systemSettings.themeColor}60;
          --primary-400: ${systemSettings.themeColor}80;
          --primary-500: ${systemSettings.themeColor};
          --primary-600: ${systemSettings.themeColor};
          --primary-700: ${systemSettings.themeColor};
        }

        .bg-primary-50 { background-color: var(--primary-50) !important; }
        .bg-primary-100 { background-color: var(--primary-100) !important; }
        .bg-primary-500 { background-color: var(--primary-500) !important; }
        .bg-primary-600 { background-color: var(--primary-500) !important; }
        .text-primary-500 { color: var(--primary-500) !important; }
        .text-primary-600 { color: var(--primary-500) !important; }
        .border-primary-100 { border-color: var(--primary-100) !important; }
        .border-primary-500 { border-color: var(--primary-500) !important; }
        .hover\:bg-primary-50:hover { background-color: var(--primary-50) !important; }
        .hover\:bg-primary-600:hover { background-color: var(--primary-500) !important; }
        .hover\:text-primary-600:hover { color: var(--primary-500) !important; }
        .focus\:ring-primary-100:focus { --tw-ring-color: var(--primary-100) !important; }
        .focus\:border-primary-500:focus { border-color: var(--primary-500) !important; }

        ${systemSettings.displayMode === 'dark' ? `
          .bg-white { background-color: #1e293b !important; color: #f8fafc !important; border-color: #334155 !important; }
          .border-gray-100, .border-gray-50, .border-slate-50 { border-color: #334155 !important; }
          .text-gray-800, .text-slate-800 { color: #f8fafc !important; }
          .text-gray-700, .text-slate-700 { color: #cbd5e1 !important; }
          .text-gray-600, .text-slate-600 { color: #94a3b8 !important; }
          .text-gray-500, .text-slate-500 { color: #64748b !important; }
          .bg-gray-50, .bg-slate-50 { background-color: #1e293b80 !important; }
          .shadow-sm { shadow: 0 1px 2px 0 rgb(0 0 0 / 0.3); }
          input, select, textarea {
            background-color: #0f172a !important;
            border-color: #334155 !important;
            color: white !important;
          }
          input::placeholder { color: #475569 !important; }
        ` : ''}
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .dark ::-webkit-scrollbar-thumb { background: #334155; }
      `}</style>
      <aside className={`fixed top-0 ${isAr ? 'right-0' : 'left-0'} h-full bg-white shadow-lg z-50 transition-all duration-300 flex flex-col ${sidebarCollapsed ? 'w-[78px]' : 'w-[270px]'}`}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100/50">
          {systemSettings.logoUrl ? (
            <img src={systemSettings.logoUrl} className="w-8 h-8 rounded-lg object-cover" alt="Logo" />
          ) : (
            <Activity size={22} className="text-primary-500" />
          )}
          {!sidebarCollapsed && <span className="font-bold truncate">{isAr ? systemSettings.hospitalNameAr : systemSettings.hospitalNameEn}</span>}
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          <ul className="space-y-1">
            {mainNavItems.filter(item => {
               if (isAdmin) return true;
               if (isDoctor) return ['doctors'].includes(item.id!);
               if (isReception) return ['reception', 'patients', 'appointments', 'pricing'].includes(item.id!);
               if (isPharmacy) return item.id === 'pharmacy';
               if (isLab) return item.id === 'labs';
               if (isRadiology) return item.id === 'radiology';
               if (isAmbulance) return item.id === 'ambulance';
               return false;
            }).map(item => {
               let label = isAr ? item.labelAr : item.labelEn;
               if (isDoctor && item.id === 'doctors') label = isAr ? 'بوابتي كطبيب' : 'My Portal as a Doctor';

                return (
                 <li key={item.id}>
                    <button 
                      onClick={() => setActivePage(item.id!)} 
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black transition-all relative group ${
                        activePage === item.id 
                        ? 'bg-primary-600 text-white shadow-xl shadow-primary-200' 
                        : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className={`transition-transform duration-300 ${activePage === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {item.icon}
                      </div>
                      {!sidebarCollapsed && <span>{label}</span>}
                    </button>
                  </li>
                );
            })}
          </ul>

          {isAdmin && (
            <div className="mt-8">
              <button 
                onClick={() => setManagementOpen(!managementOpen)}
                className="w-full flex items-center justify-between px-4 mb-2 text-gray-400 hover:text-gray-600 transition-colors"
                title={isAr ? 'الإدارة' : 'Management'}
              >
                {!sidebarCollapsed && <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? 'الإدارة' : 'Management'}</span>}
                {!sidebarCollapsed && (managementOpen ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}
              </button>
              {managementOpen && (
                <ul className="space-y-1">
                  {managementItems.map(item => {
                    const label = isAr ? item.labelAr : item.labelEn;
                    return (
                      <li key={item.id}>
                        <button 
                          onClick={() => setActivePage(item.id!)} 
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black transition-all relative group ${
                            activePage === item.id 
                            ? 'bg-primary-600 text-white shadow-xl shadow-primary-200' 
                            : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <div className={`transition-transform duration-300 ${activePage === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                            {item.icon}
                          </div>
                          {!sidebarCollapsed && <span>{label}</span>}
                          {item.id === 'labs_mgmt' && !sidebarCollapsed && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </nav>
        {!sidebarCollapsed && (
          <div className="px-5 py-3 border-t border-gray-50 space-y-1.5 animate-in slide-in-from-bottom-2 duration-500">
             <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 group cursor-help hover:text-primary-500 transition-all">
                <Mail size={12} className="group-hover:scale-110 transition-transform" />
                <span className="truncate" dir="ltr">{isAdmin ? systemSettings.hospitalEmail : (currentUser?.email || systemSettings.hospitalEmail)}</span>
             </div>
             <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 group cursor-help hover:text-emerald-500 transition-all">
                <Phone size={12} className="group-hover:scale-110 transition-transform" />
                <span className="truncate" dir="ltr">{isAdmin ? systemSettings.hospitalPhone : (currentUser?.employee?.phone || currentUser?.phone || systemSettings.hospitalPhone)}</span>
             </div>
          </div>
        )}

        <div className="p-4 border-t border-gray-100 flex items-center gap-3 bg-slate-50/50 group/profile cursor-pointer hover:bg-slate-100 transition-colors">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold shadow-sm border border-primary-200/50" onClick={() => setIsPasswordModalOpen(true)}>
               {currentUser?.name ? currentUser.name.substring(0,2).toUpperCase() : 'AD'}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 overflow-hidden cursor-pointer hover:bg-gray-50/50 p-1 rounded-lg transition-colors" onClick={() => setIsPasswordModalOpen(true)}>
                 <p className="text-[13px] font-black text-gray-800 tracking-tight truncate">{currentUser?.name || (isAr ? 'مدير النظام' : 'System Admin')}</p>
                 <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5 truncate italic">
                    {isAdmin && (isAr ? 'مدير النظام' : 'System Admin')}
                    {isDoctor && (isAr ? `طبيب: ${currentUser?.employee?.specialty_ar || 'عام'}` : `Doctor: ${currentUser?.employee?.specialty_en || 'General'}`)}
                    {isReception && (isAr ? 'مسؤول استقبال' : 'Receptionist')}
                    {isPharmacy && (isAr ? 'صيدلي' : 'Pharmacist')}
                    {isLab && (isAr ? 'فني مختبر' : 'Lab Technician')}
                    {!isAdmin && !isDoctor && !isReception && !isPharmacy && !isLab && (isAr ? (currentUser?.role || 'موظف') : (currentUser?.role || 'Staff'))}
                  </p>
              </div>
            )}
            {!sidebarCollapsed && (
               <div className="flex gap-1 pr-2" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setIsPasswordModalOpen(true)} className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors" title={isAr ? 'تغيير كلمة المرور' : 'Change Password'}><KeyRound size={14}/></button>
                  <button onClick={handleLogout} className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors" title={isAr ? 'تسجيل الخروج' : 'Logout'}><LogOut size={14}/></button>
               </div>
            )}
        </div>
      </aside>

      <main className={`transition-all duration-300 min-h-screen ${isAr ? (sidebarCollapsed ? 'mr-[78px]' : 'mr-[270px]') : (sidebarCollapsed ? 'ml-[78px]' : 'ml-[270px]')}`}>
        <div className="p-6 space-y-6">
            <div className={`p-4 md:p-6 bg-white border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 ${isAr ? 'flex-row-reverse' : ''}`}>
               <div className="flex items-center gap-4">
                  <h1 className="text-xl font-black text-gray-800 tracking-tight">
                    {isAr ? (mainNavItems.find(i => i.id === activePage)?.labelAr || managementItems.find(i => i.id === activePage)?.labelAr || 'لوحة التحكم') : (mainNavItems.find(i => i.id === activePage)?.labelEn || managementItems.find(i => i.id === activePage)?.labelEn || 'Dashboard')}
                  </h1>
               </div>

               <div className="flex items-center gap-3">
                  <div className="hidden sm:flex relative group">
                     <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                     <input type="text" placeholder={isAr ? 'بحث سريع...' : 'Quick search...'} className="pr-12 pl-6 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-primary-50 transition-all w-48 focus:w-64" />
                  </div>
                  
                  {activePage === 'services_mgmt' && (
                    <button 
                      onClick={() => {
                        setNewService({ nameAr: '', nameEn: '', classificationAr: '', classificationEn: '', price: '', discount: '0' });
                        setIsAddServiceModalOpen(true);
                      }} 
                      className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-2xl text-xs font-black transition-all shadow-xl shadow-primary-200"
                    >
                      <Plus size={16} />
                      <span>{isAr ? 'إضافة خدمة جديدة' : 'Add New Service'}</span>
                    </button>
                  )}
               </div>
            </div>
          {activePage === 'dashboard' && <DashboardPage isAr={isAr} tx={tx} medicines={medicines} doctors={doctors} apiStats={dashboardStats} settings={systemSettings} />}
          {activePage === 'departments_mgmt' && (
            <div className="space-y-6">
              <div className="flex items-center gap-1 bg-gray-100 p-1.5 rounded-2xl w-fit">
                <button 
                  onClick={() => setIsDeptsTab('list')} 
                  className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${isDeptsTab === 'list' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  {isAr ? 'قائمة الأقسام' : 'Departments List'}
                </button>
                <button 
                  onClick={() => setIsDeptsTab('titles')} 
                  className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${isDeptsTab === 'titles' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  {isAr ? 'المسميات الوظيفية' : 'Job Titles'}
                </button>
                <button 
                  onClick={() => setIsDeptsTab('specialties')} 
                  className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${isDeptsTab === 'specialties' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  {isAr ? 'والتخصصات' : 'Specialties'}
                </button>
              </div>

              {isDeptsTab === 'list' ? (
                <DepartmentsPage isAr={isAr} depts={depts} tx={tx} filterStatus={filterStatus} setFilterStatus={setFilterStatus} currentPage={currentPage} setCurrentPage={setCurrentPage} setIsAddModalOpen={setIsAddModalOpen} actionMenuId={actionMenuId} setActionMenuId={setActionMenuId} isAddModalOpen={isAddModalOpen} newDept={newDept} setNewDept={setNewDept} handleAddDept={handleAddDept} onUploadImage={handleUploadDeptImage} handleDeleteDept={handleDeleteDept} />
              ) : isDeptsTab === 'titles' ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                   <div className="flex items-center justify-between mb-8">
                      <div className="bg-primary-50 p-4 rounded-3xl border border-primary-100 flex items-center gap-4">
                         <div className="w-12 h-12 bg-primary-600 text-white rounded-2xl flex items-center justify-center shadow-lg transform rotate-3"><Briefcase size={24} /></div>
                         <div>
                            <h2 className="text-xl font-black text-gray-800">{isAr ? 'المسميات الوظيفية' : 'Job Titles'}</h2>
                            <p className="text-[10px] text-primary-600 font-bold uppercase tracking-widest">{isAr ? 'إدارة الأدوار والمسميات الوظيفية المتاحة' : 'Manage roles and available job titles'}</p>
                         </div>
                      </div>
                   </div>
                   <JobTitlesPage isAr={isAr} tx={tx} employees={employees} doctors={doctors} jobTitles={jobTitles} setJobTitles={setJobTitles} onRefresh={fetchJobTitles} onNavigateToDoctors={handleNavigateToDoctors} />
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <SpecialtiesPage isAr={isAr} tx={tx} doctors={doctors} specialties={specialties} setSpecialties={setSpecialties} onRefresh={fetchAllData} onNavigateToDoctors={handleNavigateToDoctors} />
                </div>
              )}
            </div>
          )}
          {activePage === 'doctors_mgmt' && (
            <div className="space-y-6">
               <div className="flex items-center gap-1 bg-gray-100 p-1.5 rounded-2xl w-fit">
                  <button onClick={() => setIsDocsTab('doctors')} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${isDocsTab === 'doctors' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    <Stethoscope size={14} className="inline-block mb-0.5 ml-1" />
                    {isAr ? 'جدول الأطباء' : 'Doctors Roster'}
                  </button>
                  <button onClick={() => setIsDocsTab('nurses')} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${isDocsTab === 'nurses' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    <Users size={14} className="inline-block mb-0.5 ml-1" />
                    {isAr ? 'جدول الممرضين' : 'Nurses Roster'}
                  </button>
                  <button onClick={() => setIsDocsTab('employees')} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${isDocsTab === 'employees' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    <UserCog size={14} className="inline-block mb-0.5 ml-1" />
                    {isAr ? 'بيانات الموظف' : 'Employee Data'}
                  </button>
               </div>

               {isDocsTab === 'doctors' ? (
                 <DoctorsPage isAr={isAr} doctors={doctors} tx={tx} isAddDoctorModalOpen={isAddDoctorModalOpen} setIsAddDoctorModalOpen={setIsAddDoctorModalOpen} newDoctor={newDoctor} setNewDoctor={setNewDoctor} handleAddDoctor={handleAddDoctor} depts={depts} specialties={specialties} onDeleteDoctor={handleDeleteDoctor} onSendCredentials={handleSendCredentials} hospitalName={isAr ? systemSettings.hospitalNameAr : systemSettings.hospitalNameEn} welcomeEmailTemplate={systemSettings.welcomeEmailTemplate} supportEmail={systemSettings.supportEmail} jobTitles={jobTitles} initialSearch={doctorFilter} onRefresh={fetchAllData} employees={employees} />
               ) : isDocsTab === 'nurses' ? (
                 <NursesPage isAr={isAr} nurses={nurses} tx={tx} isAddNurseModalOpen={isAddNurseModalOpen} setIsAddNurseModalOpen={setIsAddNurseModalOpen} newNurse={newNurse} setNewNurse={setNewNurse} handleAddNurse={handleAddNurse} depts={depts} onDeleteNurse={handleDeleteNurse} onSendCredentials={handleSendCredentials} hospitalName={isAr ? systemSettings.hospitalNameAr : systemSettings.hospitalNameEn} initialSearch={doctorFilter} onRefresh={fetchAllData} employees={employees} />
               ) : (
                 <EmployeesPage isAr={isAr} employees={employees} tx={tx} isAddEmployeeModalOpen={isAddEmployeeModalOpen} setIsAddEmployeeModalOpen={setIsAddEmployeeModalOpen} newEmployee={newEmployee} setNewEmployee={setNewEmployee} handleAddEmployee={handleAddEmployee} depts={depts} jobTitles={jobTitles} onDeleteEmployee={handleDeleteEmployee} onSendCredentials={handleSendCredentials} hospitalName={isAr ? systemSettings.hospitalNameAr : systemSettings.hospitalNameEn} welcomeEmailTemplate={systemSettings.welcomeEmailTemplate} supportEmail={systemSettings.supportEmail} />
               )}
            </div>
          )}
          {activePage === 'employees_mgmt' && <EmployeesPage isAr={isAr} employees={employees} tx={tx} isAddEmployeeModalOpen={isAddEmployeeModalOpen} setIsAddEmployeeModalOpen={setIsAddEmployeeModalOpen} newEmployee={newEmployee} setNewEmployee={setNewEmployee} handleAddEmployee={handleAddEmployee} depts={depts} jobTitles={jobTitles} onDeleteEmployee={handleDeleteEmployee} onSendCredentials={handleSendCredentials} hospitalName={isAr ? systemSettings.hospitalNameAr : systemSettings.hospitalNameEn} welcomeEmailTemplate={systemSettings.welcomeEmailTemplate} supportEmail={systemSettings.supportEmail} />}
          {activePage === 'accounts_mgmt' && <AccountsPage isAr={isAr} tx={tx} doctors={doctors} employees={employees} nurses={nurses} hospitalName={isAr ? systemSettings.hospitalNameAr : systemSettings.hospitalNameEn} hospitalEmail={systemSettings.hospitalEmail} hospitalPhone={systemSettings.hospitalPhone} welcomeEmailTemplate={systemSettings.welcomeEmailTemplate} supportEmail={systemSettings.supportEmail} onDelete={(id, role) => { if (role === 'doctor') handleDeleteDoctor(id); else handleDeleteEmployee(id); }} />}
          {activePage === 'services_mgmt' && <ServicesPage isAr={isAr} services={services} tx={tx} editingServiceId={editingServiceId} setEditingServiceId={setEditingServiceId} editingPrice={editingPrice} setEditingPrice={setEditingPrice} saveServicePrice={saveServicePrice} isAddServiceModalOpen={isAddServiceModalOpen} setIsAddServiceModalOpen={setIsAddServiceModalOpen} newService={newService} setNewService={setNewService} handleAddService={handleAddService} handleDeleteService={handleDeleteService} />}
          {activePage === 'patients' && <PatientsPage isAr={isAr} tx={tx} doctors={doctors} onDelete={handleDeletePatient} onNavigate={setActivePage} />}
          {activePage === 'appointments' && <AppointmentsPage isAr={isAr} tx={tx} depts={depts} doctors={doctors} nurses={nurses} />}
          {activePage === 'reception' && <ReceptionPage isAr={isAr} tx={tx} depts={depts} doctors={doctors} nurses={nurses} services={services} specialties={specialties} />}
          {activePage === 'pricing' && <ReceptionPage isAr={isAr} tx={tx} depts={depts} doctors={doctors} nurses={nurses} services={services} specialties={specialties} initialTab="pricing" />}
          {activePage === 'pharmacy' && <PharmacyPage isAr={isAr} tx={tx} medicines={medicines} transactions={pharmacyTransactions} isAddMedicineModalOpen={isAddMedicineModalOpen} setIsAddMedicineModalOpen={setIsAddMedicineModalOpen} newMedicine={newMedicine} setNewMedicine={setNewMedicine} handleAddMedicine={handleAddMedicine} onUploadImage={handleUploadPharmacyImage} onDeleteMedicine={handleDeleteMedicine} prescriptions={prescriptions} onDispense={handleDispense} variant="dispensing" notifications={notifications} onToggleLang={toggleLang} />}
          {activePage === 'pharmacy_mgmt' && <PharmacyManagementPage isAr={isAr} medicines={medicines} prescriptions={prescriptions} transactions={pharmacyTransactions} onToggleLang={toggleLang} onAddMedicine={handleAddMedicine} onUpdateMedicine={handleUpdateMedicine} onDeleteMedicine={handleDeleteMedicine} onUpdateStock={() => {}} notifications={notifications} />}
          {activePage === 'doctors' && <DoctorPortal isAr={isAr} tx={tx} onSendPrescription={handleSendPrescription} onSendLabRequest={handleSendLabRequest} onSendRadiologyRequest={handleSendRadiologyRequest} doctors={doctors} onAddNotification={addNotification} notifications={notifications} onToggleLang={toggleLang} />}
          {activePage === 'radiology' && <RadiologyPage isAr={isAr} tx={tx} notifications={notifications} onToggleLang={toggleLang} />}
          {activePage === 'radiology_mgmt' && <RadiologyPage isAr={isAr} tx={tx} notifications={notifications} onToggleLang={toggleLang} />}
          {activePage === 'ambulance' && <AmbulancePage isAr={isAr} />}
          {activePage === 'labs' && <LaboratoryPage isAr={isAr} tx={tx} notifications={notifications} onToggleLang={toggleLang} />}
          {activePage === 'labs_mgmt' && <LaboratoryManagementPage isAr={isAr} onToggleLang={toggleLang} notifications={notifications} />}
          {activePage === 'salaries_mgmt' && <SalariesPage isAr={isAr} tx={tx} salaries={salaries} isAddSalaryModalOpen={isAddSalaryModalOpen} setIsAddSalaryModalOpen={setIsAddSalaryModalOpen} newSalary={newSalary} setNewSalary={setNewSalary} handleAddSalary={handleAddSalary} employees={employees} doctors={doctors} appointments={appointments} />}
          {activePage === 'finance_mgmt' && <FinancePage isAr={isAr} tx={tx} transactions={transactions} isAddTransactionModalOpen={isAddTransactionModalOpen} setIsAddTransactionModalOpen={setIsAddTransactionModalOpen} newTransaction={newTransaction} setNewTransaction={setNewTransaction} handleAddTransaction={handleAddTransaction} onDelete={handleDeleteTransaction} />}
          {activePage === 'work_hours_mgmt' && <WorkHoursPage isAr={isAr} tx={tx} depts={depts} onRefresh={fetchAllData} employees={employees} doctors={doctors} />}
          {activePage === 'settings' && <SettingsPage isAr={isAr} settings={systemSettings} adminUsers={adminUsers} onUpdateSettings={updateSettings} onAddUser={addUser} isAddUserModalOpen={isAddUserModalOpen} setIsAddUserModalOpen={setIsAddUserModalOpen} newUser={newUser} setNewUser={setNewUser} onToggleLang={toggleLang} />}
        </div>
      </main>

      {/* ─────── Credentials Modal ─────── */}
      {isAccountModalOpen && createdAccount && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 bg-gradient-to-br from-emerald-600 to-teal-700 text-white text-center">
               <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                  <Shield size={40} />
               </div>
               <h3 className="text-2xl font-black">{isAr ? 'تم إنشاء الحساب بنجاح!' : 'Account Created Successfully!'}</h3>
               <p className="text-emerald-100 text-xs mt-2 font-bold uppercase tracking-widest">{isAr ? `مرحباً بك: ${createdAccount.name}` : `Welcome: ${createdAccount.name}`}</p>
            </div>
            <div className="p-10 space-y-6">
               <div className="text-center font-cairo text-gray-600 font-bold mb-4">
                  {isAr ? 'لقد تم إصدار بيانات تسجيل الدخول الخاصة بك كمستخدم جديد بالنظام:' : 'Your new system login credentials have been generated:'}
               </div>
               
               <div className="bg-slate-50 p-5 rounded-[2.2rem] border-2 border-slate-100 space-y-4 relative group/mbox">
                   <textarea 
                      readOnly
                      value={isAr ? `مرحباً بك في مستشفى ${systemSettings.hospitalNameAr}

عزيزي ${createdAccount.name}،
لقد تم إنشاء حسابك بنجاح في نظام المستشفى. يمكنك الآن الدخول إلى حسابك الشخصي باستخدام البيانات التالية:

بيانات التعريف:
الدور الوظيفي: ${createdAccount.role || 'موظف'}
اسم المستخدم: @${createdAccount.username}
بريد الدخول: ${createdAccount.email}
كلمة المرور المؤقتة: ${createdAccount.password}

تنبيه أمني هام:
يرجى تغيير كلمة المرور فور تسجيل الدخول لأول مرة لضمان أمان حسابك الشخصي.

يرجى الرد على هذا البريد الإلكتروني أو التواصل مع ${systemSettings.hospitalEmail} في حال وجود أي استفسار.

مع تحيات إدارة مستشفى ${systemSettings.hospitalNameAr}.` : `Welcome to ${systemSettings.hospitalNameEn}

Dear ${createdAccount.name},
Your account has been successfully created. You can now access your account using the following credentials:

Identity Data:
Job Role: ${createdAccount.role || 'Staff'}
Username: @${createdAccount.username}
Login Email: ${createdAccount.email}
Temporary Password: ${createdAccount.password}

IMPORTANT SECURITY NOTICE:
Please change your password immediately after your first login to ensure your account's security.

Please reply to this email or contact us at ${systemSettings.hospitalEmail} if you have any questions.

Best Regards,
${systemSettings.hospitalNameEn} Management.`}
                      className="w-full bg-transparent text-[11.5px] text-slate-700 leading-relaxed outline-none resize-none h-48 custom-scrollbar text-right font-cairo border-none"
                      dir={isAr ? 'rtl' : 'ltr'}
                   />
                   <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isAr ? 'بيانات معتمدة' : 'OFFICIAL DATA'}</span>
                      <button onClick={() => {
                         const msg = isAr ? `مرحباً بك في مستشفى ${systemSettings.hospitalNameAr}...` : `Welcome to ${systemSettings.hospitalNameEn}...`; // Simplified for the tool call
                         navigator.clipboard.writeText(msg); 
                         alert('Copied!');
                      }} className="flex items-center gap-2 px-3 py-1.5 bg-white text-primary-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-gray-100 hover:bg-primary-600 hover:text-white transition-all shadow-sm">
                         <ClipboardList size={12}/> {isAr ? 'نسخ' : 'Copy'}
                      </button>
                   </div>
               </div>

               <button onClick={() => setIsAccountModalOpen(false)} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black hover:bg-black transition-all shadow-lg active:scale-95">
                  {isAr ? 'فهمت، إغلاق' : 'Got it, Close'}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────── Modals ─────── */}




      {/* ─────── Global Change Password Modal (Multi-step) ─────── */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
           <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-primary-600 text-white">
                 <div className="flex items-center gap-3 font-cairo">
                    <Key size={22} />
                    <h3 className="text-lg font-bold">{isAr ? 'تغيير كلمة المرور' : 'Change Password'}</h3>
                 </div>
                 <button onClick={() => { setIsPasswordModalOpen(false); setPassStep(1); }} className="hover:rotate-90 transition-transform"><X size={24} /></button>
              </div>
              
              <div className="p-8 space-y-6">
                 {passStep === 1 ? (
                   <div className="space-y-4">
                      <div className="space-y-1.5 text-right font-cairo">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'كلمة المرور القديمة' : 'Old Password'}</label>
                         <input 
                           type="password" 
                           value={passwordData.oldPassword} 
                           onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})}
                           className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-primary-100 transition font-bold" 
                         />
                      </div>
                      <div className="space-y-1.5 text-right font-cairo">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'كلمة المرور الجديدة' : 'New Password'}</label>
                         <input 
                           type="password" 
                           value={passwordData.newPassword} 
                           onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                           className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-primary-100 transition font-bold" 
                         />
                      </div>
                      <div className="space-y-1.5 text-right font-cairo">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
                         <input 
                           type="password" 
                           value={passwordData.confirmPassword} 
                           onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                           className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-primary-100 transition font-bold" 
                         />
                      </div>
                   </div>
                 ) : (
                   <div className="space-y-6 text-center font-cairo">
                      <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                         <Mail size={32} />
                      </div>
                      <div>
                         <h4 className="font-black text-gray-800">{isAr ? 'أدخل رمز التحقق' : 'Enter Verification Code'}</h4>
                         <p className="text-xs text-gray-400 mt-1">{isAr ? 'تم إرسال رمز مكون من رقمين إلى بريدك الإلكتروني' : 'A 2-digit code has been sent to your email'}</p>
                      </div>
                      <input 
                        type="text" 
                        maxLength={2}
                        value={passStepCode}
                        onChange={e => setPassStepCode(e.target.value)}
                        placeholder="00"
                        className="w-full text-center text-3xl font-black tracking-[0.5em] p-6 rounded-3xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-primary-100 transition-all border-dashed border-2" 
                      />
                   </div>
                 )}
              </div>

              <div className="p-8 bg-gray-50 flex gap-4 font-cairo">
                 {passStep === 1 ? (
                   <button 
                     onClick={async () => {
                        if (!passwordData.oldPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword) return alert(isAr ? 'يرجى ملء البيانات بشكل صحيح' : 'Please fill data correctly');
                        const token = localStorage.getItem('token');
                        try {
                           const res = await fetch('/api/send-password-code', {
                              method: 'POST',
                              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                              body: JSON.stringify({ old_password: passwordData.oldPassword, new_password: passwordData.newPassword })
                           });
                           const data = await res.json();
                           if (res.ok) {
                              setPassStep(2);
                              if (data.debug_code) console.log("Verification Code:", data.debug_code);
                           } else {
                              alert(data.message || 'Error');
                           }
                        } catch (err) { console.error(err); }
                     }}
                     className="flex-1 bg-primary-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-primary-100 hover:bg-primary-700 transition-all"
                   >
                      {isAr ? 'طلب رمز التحقق' : 'Request Verification Code'}
                   </button>
                 ) : (
                   <button 
                     onClick={async () => {
                        const token = localStorage.getItem('token');
                        try {
                           const res = await fetch('/api/verify-password-code', {
                              method: 'POST',
                              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                              body: JSON.stringify({ code: passStepCode, new_password: passwordData.newPassword })
                           });
                           const data = await res.json();
                           if (res.ok) {
                              alert(isAr ? 'تم تغيير كلمة المرور بنجاح!' : 'Password changed successfully!');
                              setIsPasswordModalOpen(false);
                              setPassStep(1);
                              setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                              setPassStepCode('');
                           } else {
                              alert(data.message || 'Error');
                           }
                        } catch (err) { console.error(err); }
                     }}
                     className="flex-1 bg-primary-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-primary-100 hover:bg-primary-700 transition-all"
                   >
                      {isAr ? 'تأكيد التغيير' : 'Confirm Change'}
                   </button>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

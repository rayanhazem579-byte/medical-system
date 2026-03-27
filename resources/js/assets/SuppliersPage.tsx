import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Search, Filter, Download, 
  MoreVertical, Phone, Mail, MapPin, 
  Clock, CreditCard, Package, UserCircle,
  CheckCircle2, AlertTriangle, X, Edit3, Trash2
} from 'lucide-react';

export interface Supplier {
  id: number;
  supplier_id: string;
  name: string;
  responsible_person: string;
  phone: string;
  email: string;
  address: string;
  product_types: string;
  lead_time: string;
  payment_method: string;
  payment_terms: string;
  status: 'active' | 'inactive';
  notes?: string;
}

interface SuppliersPageProps {
  isAr: boolean;
  tx: any;
}

export const SuppliersPage: React.FC<SuppliersPageProps> = ({ isAr, tx }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    supplier_id: '',
    name: '',
    responsible_person: '',
    phone: '',
    email: '',
    address: '',
    product_types: '',
    lead_time: '',
    payment_method: 'Cash',
    payment_terms: '',
    status: 'active',
    notes: ''
  });
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    name_ar: '',
    description: ''
  });

  const [activeTab, setActiveTab] = useState<'suppliers' | 'categories'>('suppliers');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/pharmacy-suppliers', {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setSuppliers(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/pharmacy-product-categories', {
         headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
         const data = await res.json();
         // If no categories in DB, add the defaults
         if (data.data.length === 0) {
            const defaults = [
               { id: 1001, name: 'Human Medicines', name_ar: 'أدوية بشرية', created_at: new Date().toISOString() },
               { id: 1002, name: 'Cosmetics', name_ar: 'مستحضرات تجميل', created_at: new Date().toISOString() },
               { id: 1003, name: 'Nutritional Supplements', name_ar: 'مكملات غذائية', created_at: new Date().toISOString() },
               { id: 1004, name: 'Medical Supplies', name_ar: 'مستلزمات طبية', created_at: new Date().toISOString() },
            ];
            setCategories(defaults);
         } else {
            setCategories(data.data);
         }
      }
    } catch (err) {
       console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchSuppliers();
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = editingSupplier ? 'PUT' : 'POST';
    const url = editingSupplier ? `/api/pharmacy-suppliers/${editingSupplier.id}` : '/api/pharmacy-suppliers';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setEditingSupplier(null);
        setFormData({
            supplier_id: '', name: '', responsible_person: '', phone: '', email: '', 
            address: '', product_types: '', lead_time: '', payment_method: 'Cash', 
            payment_terms: '', status: 'active', notes: ''
        });
        fetchSuppliers();
      } else {
          const err = await res.json();
          alert(err.message || 'Error saving supplier');
      }
    } catch (err) {
      console.error("Error saving supplier:", err);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/pharmacy-product-categories', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(categoryFormData)
      });
      if (res.ok) {
        setIsCategoryModalOpen(false);
        setCategoryFormData({ name: '', name_ar: '', description: '' });
        fetchCategories();
        setActiveTab('categories'); // Switch to categories tab to see it
      } else {
          const err = await res.json();
          alert(err.message || 'Error saving category');
      }
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  const getNextSupplierId = () => {
    const existingIds = suppliers
      .map(s => {
        const match = s.supplier_id.match(/SUB-(\d+)/i);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(num => num > 0)
      .sort((a, b) => a - b);
      
    let nextNum = 1;
    for (const num of existingIds) {
      if (num === nextNum) {
        nextNum++;
      } else if (num > nextNum) {
        break; // found a gap
      }
    }
    
    return `SUB-${nextNum}`;
  };

  const openAddModal = () => {
    setEditingSupplier(null); 
    setFormData({ 
      supplier_id: getNextSupplierId(), 
      name: '', 
      responsible_person: '', 
      phone: '', 
      email: '', 
      address: '', 
      product_types: '', 
      lead_time: '', 
      payment_method: 'Cash', 
      payment_terms: '', 
      status: 'active', 
      notes: '' 
    }); 
    setIsModalOpen(true);
  };

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      supplier_id: supplier.supplier_id,
      name: supplier.name,
      responsible_person: supplier.responsible_person || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      product_types: supplier.product_types || '',
      lead_time: supplier.lead_time || '',
      payment_method: supplier.payment_method || 'Cash',
      payment_terms: supplier.payment_terms || '',
      status: supplier.status,
      notes: supplier.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذا المورد؟' : 'Are you sure you want to delete this supplier?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/pharmacy-suppliers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchSuppliers();
    } catch (err) {
      console.error("Error deleting supplier:", err);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(isAr ? `هل أنت متأكد من حذف ${selectedIds.length} من الموردين المحددين؟` : `Are you sure you want to delete ${selectedIds.length} selected suppliers?`)) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/pharmacy-suppliers/batch', {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ ids: selectedIds })
      });
      if (res.ok) {
        setSelectedIds([]);
        fetchSuppliers();
      }
    } catch (err) {
      console.error("Error deleting selected suppliers:", err);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredSuppliers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSuppliers.map(s => s.id));
    }
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذا التصنيف؟' : 'Are you sure you want to delete this category?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/pharmacy-product-categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.supplier_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter(c => 
     c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (c.name_ar && c.name_ar.includes(searchTerm))
  );

  const textAlign = isAr ? 'text-right' : 'text-left';

  return (
    <div className="space-y-6">
      {/* Tab Selectors */}
      <div className="flex items-center gap-1 p-1 bg-gray-50/50 rounded-2xl w-fit border border-gray-100">
         <button 
            onClick={() => setActiveTab('suppliers')}
            className={`px-6 py-2 rounded-xl text-[11px] font-black transition-all ${activeTab === 'suppliers' ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
         >
            {isAr ? 'قائمة الموردين' : 'Suppliers List'}
         </button>
         <button 
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-2 rounded-xl text-[11px] font-black transition-all ${activeTab === 'categories' ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
         >
            {isAr ? 'قائمة التصنيفات' : 'Categories List'}
         </button>
      </div>

      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center"><Users size={24}/></div>
           <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'إجمالي الموردين' : 'Total Suppliers'}</p>
              <h4 className="text-2xl font-black text-gray-800 tracking-tight">{suppliers.length}</h4>
           </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center"><CheckCircle2 size={24}/></div>
           <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'الموردين النشطين' : 'Active Suppliers'}</p>
              <h4 className="text-2xl font-black text-gray-800 tracking-tight">{suppliers.filter(s => s.status === 'active').length}</h4>
           </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center"><Package size={24}/></div>
           <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'إجمالي التصنيفات' : 'Total Categories'}</p>
              <h4 className="text-2xl font-black text-gray-800 tracking-tight">{categories.length}</h4>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* The "Stick Bar" Search Area */}
        <div className="sticky top-0 z-10 p-4 border-b border-gray-50 bg-white/80 backdrop-blur-md flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" size={14} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text" 
              placeholder={isAr ? 'البحث عن مورد...' : 'Search supplier...'} 
              className={`w-full ${isAr ? 'pr-3.5 pl-9' : 'pl-9 pr-3.5'} py-2 bg-gray-50/50 border border-gray-100 rounded-full text-[11px] font-bold focus:bg-white focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none`}
            />
          </div>
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && activeTab === 'suppliers' && (
              <button 
                onClick={handleDeleteSelected}
                className="bg-rose-500 text-white px-4 py-2 rounded-lg text-[11px] font-black flex items-center gap-2 hover:bg-rose-600 transition-all active:scale-95 shadow-lg shadow-rose-200 animate-in slide-in-from-top-2 duration-300"
              >
                <Trash2 size={16} />
                {isAr ? `حذف المحدد (${selectedIds.length})` : `Delete Selected (${selectedIds.length})`}
              </button>
            )}
            <button className="p-2 text-gray-400 hover:text-primary-500 hover:bg-gray-50 rounded-lg transition-all"><Filter size={16}/></button>
            <button 
              onClick={() => setIsCategoryModalOpen(true)}
              className="bg-white border border-gray-100 text-gray-800 px-4 py-2 rounded-lg text-[11px] font-black flex items-center gap-2 hover:bg-slate-50 transition-all active:scale-95 shadow-lg shadow-black/5"
            >
              <Package size={16} className="text-primary-500"/>
              {isAr ? 'إضافة منتجات' : 'Add Products'}
            </button>
            <button 
              onClick={openAddModal}
              className="bg-black text-white px-4 py-2 rounded-lg text-[11px] font-black flex items-center gap-2 hover:bg-primary-600 transition-all active:scale-95 shadow-lg shadow-black/5"
            >
              <Plus size={16} />
              {isAr ? 'إضافة مورد' : 'Add Supplier'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/30">
                {activeTab === 'suppliers' ? (
                  <>
                    <th className="px-5 py-3 border-b border-gray-50 w-10">
                      <div className="flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.length === filteredSuppliers.length && filteredSuppliers.length > 0} 
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer transition-all"
                        />
                      </div>
                    </th>
                    <th className={`${textAlign} px-5 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50`}>{isAr ? 'المورد' : 'Supplier'}</th>
                    <th className={`${textAlign} px-5 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50`}>{isAr ? 'المسؤول' : 'Person'}</th>
                    <th className={`${textAlign} px-5 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50`}>{isAr ? 'الاتصال' : 'Contact'}</th>
                    <th className={`${textAlign} px-5 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50`}>{isAr ? 'المنتجات' : 'Products'}</th>
                    <th className={`${textAlign} px-5 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50`}>{isAr ? 'الدفع' : 'Payment'}</th>
                    <th className={`${textAlign} px-5 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50`}>{isAr ? 'المدة' : 'Lead'}</th>
                    <th className={`${textAlign} px-5 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50`}>{isAr ? 'الحالة' : 'Status'}</th>
                  </>
                ) : (
                  <>
                    <th className={`${textAlign} px-5 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50`}>ID</th>
                    <th className={`${textAlign} px-5 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50`}>{isAr ? 'اسم التصنيف (EN)' : 'Category Name (EN)'}</th>
                    <th className={`${textAlign} px-5 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50`}>{isAr ? 'اسم التصنيف (AR)' : 'Category Name (AR)'}</th>
                    <th className={`${textAlign} px-5 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50`}>{isAr ? 'التاريخ' : 'Date Created'}</th>
                    <th className={`${textAlign} px-5 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50`} colSpan={3}></th>
                  </>
                )}
                <th className="px-5 py-3 border-b border-gray-50"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={8} className="py-12 text-center text-xs font-bold text-gray-400">{isAr ? 'جاري التحميل...' : 'Loading...'}</td></tr>
              ) : activeTab === 'suppliers' ? (
                filteredSuppliers.length === 0 ? (
                  <tr><td colSpan={8} className="py-12 text-center text-xs font-bold text-gray-400">{isAr ? 'لا يوجد موردين' : 'No suppliers found'}</td></tr>
                ) : filteredSuppliers.map((supplier) => (
                  <tr 
                    key={supplier.id} 
                    className={`group hover:bg-slate-50/20 transition-colors ${selectedIds.includes(supplier.id) ? 'bg-primary-50/30' : ''}`}
                  >
                    <td className="px-5 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(supplier.id)} 
                          onChange={() => toggleSelectOne(supplier.id)}
                          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer transition-all"
                        />
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center text-[9px] text-gray-400 font-black group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                          {supplier.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black text-gray-800 leading-none">{supplier.name}</span>
                          <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest mt-0.5">{supplier.supplier_id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[10px] font-bold text-gray-600">
                      {supplier.responsible_person || '---'}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-500">{supplier.phone}</span>
                        {supplier.email && <span className="text-[8px] text-gray-400 leading-none">{supplier.email}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-block px-1.5 py-0.5 bg-gray-50 text-gray-500 rounded text-[8px] font-black uppercase">
                        {supplier.product_types || 'General'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-700">{supplier.payment_method}</span>
                        <span className="text-[8px] text-gray-400">{supplier.payment_terms || 'Immediate'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[10px] font-bold text-gray-700">
                      {supplier.lead_time || '3d'}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${supplier.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {supplier.status === 'active' ? (isAr ? 'نشط' : 'Active') : (isAr ? 'غير نشط' : 'Inactive')}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-2 transition-all">
                        <button onClick={() => openEditModal(supplier)} className="p-2 hover:bg-primary-50 text-gray-400 hover:text-primary-600 rounded-xl transition-all shadow-sm border border-gray-100/50 hover:border-primary-100 hover:scale-110 active:scale-95" title={isAr ? 'تعديل' : 'Edit'}><Edit3 size={14}/></button>
                        <button onClick={() => handleDelete(supplier.id)} className="p-2 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-xl transition-all shadow-sm border border-gray-100/50 hover:border-rose-100 hover:scale-110 active:scale-95" title={isAr ? 'حذف' : 'Delete'}><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                filteredCategories.length === 0 ? (
                  <tr><td colSpan={8} className="py-12 text-center text-xs font-bold text-gray-400">{isAr ? 'لا يوجد تصنيفات' : 'No categories found'}</td></tr>
                ) : filteredCategories.map((cat) => (
                  <tr key={cat.id} className="group hover:bg-slate-50/20 transition-colors">
                    <td className="px-5 py-3 text-[10px] font-black text-gray-400">#{cat.id}</td>
                    <td className="px-5 py-3 text-[11px] font-black text-gray-800">{cat.name}</td>
                    <td className="px-5 py-3 text-[11px] font-black text-gray-800">{cat.name_ar || '---'}</td>
                    <td className="px-5 py-3 text-[10px] font-bold text-gray-400">{new Date(cat.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-3" colSpan={3}></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleDeleteCategory(cat.id)} className="p-1 hover:bg-rose-50 text-rose-500 rounded transition-colors"><Trash2 size={12}/></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Upgrade - Even more compact */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-[1.5rem] shadow-2xl w-full max-w-2xl my-auto animate-in zoom-in-95 duration-300 flex overflow-hidden border border-gray-100">
            {/* The "Stick Bar" Side Nav */}
            <div className="w-16 bg-slate-50 border-r border-gray-100 flex flex-col items-center py-8 gap-6">
               <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center shadow-lg shadow-black/10"><Users size={16}/></div>
               <div className="flex flex-col gap-4">
                  <div className="w-7 h-7 rounded bg-blue-100 text-blue-600 flex items-center justify-center"><Package size={14}/></div>
                  <div className="w-7 h-7 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center"><Phone size={14}/></div>
                  <div className="w-7 h-7 rounded bg-amber-100 text-amber-600 flex items-center justify-center"><CreditCard size={14}/></div>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col max-h-[90vh]">
               <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                  <div>
                     <h3 className="text-lg font-black text-gray-800 tracking-tight">{editingSupplier ? (isAr ? 'تعديل مورد' : 'Edit Supplier') : (isAr ? 'إضافة مورد' : 'Add Supplier')}</h3>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isAr ? 'أدخل بيانات التوريد بدقة' : 'Enter supply details accurately'}</p>
                  </div>
                  <button type="button" onClick={() => { setIsModalOpen(false); setEditingSupplier(null); }} className="p-2 hover:bg-rose-50 text-gray-400 hover:text-rose-500 rounded-xl transition-all group"><X size={20}/></button>
               </div>

               <div className="p-8 flex-1 overflow-y-auto space-y-8 scrollbar-hide">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                     <div className="md:col-span-2 flex items-center gap-3">
                        <span className="text-[10px] font-black text-primary-500 bg-primary-50 px-2 py-0.5 rounded uppercase">01. {isAr ? 'التعريف' : 'Identity'}</span>
                        <div className="flex-1 h-px bg-gray-100"></div>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'كود المورد' : 'Supplier ID'}</label>
                        <input 
                           required
                           value={formData.supplier_id}
                           onChange={(e) => setFormData({...formData, supplier_id: e.target.value})}
                           className="w-full px-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl text-xs font-black focus:bg-white focus:border-primary-500 transition-all outline-none"
                        />
                     </div>
                     <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'اسم شركة المورد' : 'Supplier Company Name'}</label>
                        <input 
                           required
                           value={formData.name}
                           onChange={(e) => setFormData({...formData, name: e.target.value})}
                           className="w-full px-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl text-xs font-black focus:bg-white focus:border-primary-500 transition-all outline-none"
                           placeholder={isAr ? 'اسم الشركة' : 'Company Name'}
                        />
                     </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                     <div className="md:col-span-2 flex items-center gap-3 pt-2">
                        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded uppercase">02. {isAr ? 'الاتصال' : 'Contact'}</span>
                        <div className="flex-1 h-px bg-gray-100"></div>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'المندوب / المسؤول' : 'Representative / Responsible'}</label>
                        <input 
                           value={formData.responsible_person}
                           onChange={(e) => setFormData({...formData, responsible_person: e.target.value})}
                           className="w-full px-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl text-xs font-black focus:bg-white focus:border-primary-500 transition-all outline-none"
                           placeholder={isAr ? 'اسم المندوب' : 'Representative Name'}
                        />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'الهاتف' : 'Phone'}</label>
                        <input 
                           value={formData.phone}
                           onChange={(e) => setFormData({...formData, phone: e.target.value})}
                           className="w-full px-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl text-xs font-black focus:bg-white focus:border-primary-500 transition-all outline-none"
                        />
                     </div>
                     <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'العنوان' : 'Address'}</label>
                        <textarea 
                           rows={2}
                           value={formData.address}
                           onChange={(e) => setFormData({...formData, address: e.target.value})}
                           className="w-full px-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl text-xs font-black focus:bg-white focus:border-primary-500 transition-all outline-none resize-none"
                        ></textarea>
                     </div>
                  </div>

                  {/* Policy Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                     <div className="md:col-span-2 flex items-center gap-3 pt-2">
                        <span className="text-[10px] font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded uppercase">03. {isAr ? 'السياسة' : 'Agreements'}</span>
                        <div className="flex-1 h-px bg-gray-100"></div>
                     </div>
                     <div className="space-y-1.5 single-select">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'نوع وتصنيف المنتجات' : 'Product Classification'}</label>
                        <select 
                           value={formData.product_types}
                           onChange={(e) => setFormData({...formData, product_types: e.target.value})}
                           className="w-full px-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl text-xs font-black focus:bg-white focus:border-primary-500 transition-all outline-none appearance-none"
                        >
                           <option value="">{isAr ? 'اختر النوع...' : 'Select Type...'}</option>
                           {categories.map((cat) => (
                             <option key={cat.id} value={isAr && cat.name_ar ? cat.name_ar : cat.name}>
                               {isAr && cat.name_ar ? cat.name_ar : cat.name}
                             </option>
                           ))}
                           {/* Keep defaults if none exist */}
                           {categories.length === 0 && (
                             <>
                               <option value="Human Medicines">{isAr ? 'أدوية بشرية' : 'Human Medicines'}</option>
                               <option value="Cosmetics">{isAr ? 'مستحضرات تجميل' : 'Cosmetics'}</option>
                               <option value="Nutritional Supplements">{isAr ? 'مكملات غذائية' : 'Nutritional Supplements'}</option>
                               <option value="Medical Supplies">{isAr ? 'مستلزمات طبية' : 'Medical Supplies'}</option>
                             </>
                           )}
                        </select>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'مدة التوريد' : 'Lead Time'}</label>
                        <input 
                           value={formData.lead_time}
                           onChange={(e) => setFormData({...formData, lead_time: e.target.value})}
                           className="w-full px-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl text-xs font-black focus:bg-white focus:border-primary-500 transition-all outline-none"
                        />
                     </div>
                     <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'شروط السداد' : 'Payment Terms'}</label>
                        <input 
                           value={formData.payment_terms}
                           onChange={(e) => setFormData({...formData, payment_terms: e.target.value})}
                           className="w-full px-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl text-xs font-black focus:bg-white focus:border-primary-500 transition-all outline-none"
                        />
                     </div>
                  </div>
               </div>

               <div className="p-6 bg-slate-50 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-black text-gray-400 hover:text-rose-500 transition-all uppercase tracking-widest">{isAr ? 'إلغاء' : 'Cancel'}</button>
                  <button 
                     type="submit" 
                     className="bg-primary-600 text-white px-8 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-primary-500/10 active:scale-95 transition-all flex items-center gap-2"
                  >
                     <CheckCircle2 size={16} />
                     {editingSupplier ? (isAr ? 'تحديث' : 'Update') : (isAr ? 'حفظ' : 'Save')}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
      {/* Add Product Category Modal (The "Add Product" button) */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-[1.5rem] shadow-2xl w-full max-w-lg my-auto animate-in zoom-in-95 duration-300 border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black text-gray-800 tracking-tight">{isAr ? 'إضافة تصنيف منتجات' : 'Add Product Category'}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isAr ? 'هذا التصنيف سيظهر في قائمة الموردين' : 'This category will appear in supplier list'}</p>
              </div>
              <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="p-2 hover:bg-rose-50 text-gray-400 hover:text-rose-500 rounded-xl transition-all"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'اسم التصنيف (EN)' : 'Category Name (EN)'}</label>
                <input 
                  required
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl text-xs font-black focus:bg-white focus:border-primary-500 transition-all outline-none"
                  placeholder="e.g. Antibiotics"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'اسم التصنيف (AR)' : 'Category Name (AR)'}</label>
                <input 
                  value={categoryFormData.name_ar}
                  onChange={(e) => setCategoryFormData({...categoryFormData, name_ar: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl text-xs font-black focus:bg-white focus:border-primary-500 transition-all outline-none"
                  placeholder="مثلاً: مضادات حيوية"
                />
              </div>
              
              <div className="pt-4 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 text-xs font-black text-gray-400 hover:text-rose-500 transition-all uppercase tracking-widest">{isAr ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" className="bg-black text-white px-8 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-black/5 active:scale-95 transition-all">
                  {isAr ? 'إضافة التصنيف' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

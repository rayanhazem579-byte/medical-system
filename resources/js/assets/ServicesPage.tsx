import React from 'react';
import { Plus, Check, X, Edit3, Tag, Percent, Layers, ShieldCheck } from 'lucide-react';

/* ───────── Types ───────── */
export interface HospitalService { 
  id: number; 
  nameAr: string; 
  nameEn: string; 
  price: number; 
  discount: number;
  classificationAr: string;
  classificationEn: string;
  status: 'active' | 'inactive'; 
}

interface ServicesPageProps {
  isAr: boolean;
  services: HospitalService[];
  tx: any;
  editingServiceId: number | null;
  setEditingServiceId: (id: number | null) => void;
  editingPrice: string;
  setEditingPrice: (price: string) => void;
  saveServicePrice: (id: number) => void;
  setIsAddServiceModalOpen: (open: boolean) => void;
  isAddServiceModalOpen: boolean;
  newService: any;
  setNewService: (service: any) => void;
  handleAddService: (e: React.FormEvent) => void;
  handleDeleteService?: (id: number) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  isAr, services, tx, editingServiceId, setEditingServiceId,
  editingPrice, setEditingPrice, saveServicePrice,
  setIsAddServiceModalOpen, isAddServiceModalOpen, 
  newService, setNewService, handleAddService, handleDeleteService
}) => {
  const textAlign = isAr ? 'text-right' : 'text-left';

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-800">{isAr ? 'قائمة الخدمات والأسعار' : 'Services and Prices List'}</h2>
            <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2.5 py-1 rounded-lg">{services.length} {isAr ? 'خدمة' : 'service'}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/70">
                <th className={`${textAlign} text-xs font-semibold text-gray-400 uppercase px-6 py-3.5`}>#</th>
                <th className={`${textAlign} text-xs font-semibold text-gray-400 uppercase px-6 py-3.5`}>{isAr ? 'الخدمة' : 'Service'}</th>
                <th className={`${textAlign} text-xs font-semibold text-gray-400 uppercase px-6 py-3.5`}>{isAr ? 'التصنيف' : 'Classification'}</th>
                <th className={`${textAlign} text-xs font-semibold text-gray-400 uppercase px-6 py-3.5`}>{isAr ? 'السعر الأصلي' : 'Base Price'}</th>
                <th className={`${textAlign} text-xs font-semibold text-gray-400 uppercase px-6 py-3.5`}>{isAr ? 'الخصم' : 'Discount'}</th>
                <th className={`${textAlign} text-xs font-semibold text-gray-400 uppercase px-6 py-3.5`}>{isAr ? 'السعر النهائي' : 'Final Price'}</th>
                <th className="text-center text-xs font-semibold text-gray-400 uppercase px-6 py-3.5">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="text-center text-xs font-semibold text-gray-400 uppercase px-6 py-3.5">{tx.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {services.map((service) => {
                const finalPrice = service.price * (1 - (service.discount || 0) / 100);
                return (
                  <tr key={service.id} className="hover:bg-sky-50/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-400">{service.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-500">
                           <Tag size={16} />
                        </div>
                        <p className="text-sm font-semibold text-gray-800">{isAr ? service.nameAr : service.nameEn}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                        <Layers size={12} />
                        {isAr ? service.classificationAr : service.classificationEn}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-500 line-through decoration-gray-300">{service.price} {isAr ? 'ج.س' : 'SDG'}</span>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center gap-1 text-xs font-bold ${service.discount > 0 ? 'text-red-500 bg-red-50' : 'text-gray-400 bg-gray-50'} px-2 py-0.5 rounded`}>
                         <Percent size={12} />
                         {service.discount}%
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">{finalPrice.toFixed(2)} {isAr ? 'ج.س' : 'SDG'}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${service.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                         <ShieldCheck size={12} />
                         {service.status === 'active' ? (isAr ? 'نشط' : 'Active') : (isAr ? 'متوقف' : 'Inactive')}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => { 
                            setNewService({...service, price: service.price.toString(), discount: service.discount?.toString() || '0'}); 
                            setIsAddServiceModalOpen(true); 
                          }} className="w-8 h-8 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500 flex items-center justify-center transition-colors cursor-pointer" title={tx.edit}><Edit3 size={16} /></button>
                          <button onClick={() => handleDeleteService?.(service.id)} className="w-8 h-8 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer" title={isAr ? 'حذف' : 'Delete'}><X size={16} /></button>
                        </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isAddServiceModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">{newService.id ? (isAr ? 'تعديل الخدمة' : 'Edit Service') : (isAr ? 'إضافة خدمة جديدة' : 'Add New Service')}</h3>
              <button onClick={() => setIsAddServiceModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddService} className="p-6 space-y-4 text-right">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? 'اسم الخدمة بالعربي' : 'Service Name (Ar)'}</label>
                  <input required type="text" value={newService.nameAr} onChange={e => setNewService({...newService, nameAr: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all" placeholder={isAr ? 'مثال: فحص نظر' : 'e.g. Eye Test'} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? 'تصنيف الخدمة (عربي)' : 'Classification (Ar)'}</label>
                  <input required type="text" value={newService.classificationAr} onChange={e => setNewService({...newService, classificationAr: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all" placeholder={isAr ? 'مثال: مختبر' : 'e.g. Lab'} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? 'تصنيف الخدمة (En)' : 'Classification (En)'}</label>
                  <input required type="text" value={newService.classificationEn} onChange={e => setNewService({...newService, classificationEn: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all text-left" dir="ltr" placeholder="Radiology" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? 'السعر (ج.س)' : 'Price (SDG)'}</label>
                  <input required type="number" step="0.01" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all text-left" placeholder="0.00" dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? 'نسبة الخصم (%)' : 'Discount (%)'}</label>
                  <input required type="number" min="0" max="100" value={newService.discount} onChange={e => setNewService({...newService, discount: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all text-left" placeholder="0" dir="ltr" />
                </div>
              </div>
              <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => setIsAddServiceModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">{isAr ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-l from-primary-500 to-sky-500 rounded-xl hover:from-primary-600 hover:to-sky-600 shadow-md shadow-primary-200 transition-colors cursor-pointer">{isAr ? 'حفظ الخدمة' : 'Save Service'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

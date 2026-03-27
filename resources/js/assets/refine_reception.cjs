const fs = require('fs');
const path = require('path');

const filePath = 'c:\\xampp\\htdocs\\my-first-app\\backend\\resources\\js\\assets\\ReceptionPage.tsx';

let content = fs.readFileSync(filePath, 'utf8');

// Replacement 1: Sub-tabs and roster section
const target1 = `          {activeTab === 'pricing' ? (
            <div className="space-y-12">
               <div className="flex flex-wrap items-center justify-between gap-6 p-4 bg-gray-50/50 rounded-[40px] border border-gray-100">`;

const replacement1 = `          {activeTab === 'pricing' ? (
            <div className="space-y-12">
               {/* Sub-tabs for Pricing Section */}
               <div className="flex items-center justify-between">
                  <div className="flex bg-gray-50/50 p-1.5 rounded-3xl border border-gray-100 shadow-sm">
                    <button 
                      onClick={() => setPricingSubTab('roster')} 
                      className={\`px-10 py-3 rounded-2xl text-[10px] font-black transition-all flex items-center gap-3 \${pricingSubTab === 'roster' ? 'bg-primary-600 text-white shadow-xl shadow-primary-50' : 'text-gray-400 hover:text-gray-600'}\`}
                    >
                      <Clock size={16} className={pricingSubTab === 'roster' ? 'animate-pulse' : ''} />
                      <span className="uppercase tracking-widest">{isArLocal ? 'جدول المناوبات' : 'Shift Schedule'}</span>
                    </button>
                    <button 
                      onClick={() => setPricingSubTab('prices')} 
                      className={\`px-10 py-3 rounded-2xl text-[10px] font-black transition-all flex items-center gap-3 \${pricingSubTab === 'prices' ? 'bg-primary-600 text-white shadow-xl shadow-primary-50' : 'text-gray-400 hover:text-gray-600'}\`}
                    >
                      <DollarSign size={16} />
                      <span className="uppercase tracking-widest">{isArLocal ? 'أسعار الخدمات' : 'Service Catalogue'}</span>
                    </button>
                  </div>
               </div>

               {pricingSubTab === 'roster' ? (
                  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                     <div className="flex flex-wrap items-center justify-between gap-6 p-6 bg-gray-50/50 rounded-[40px] border border-gray-100">`;

if (content.includes(target1)) {
    content = content.replace(target1, replacement1);
} else {
    console.log("Target 1 not found");
}

// Replacement 2: "All Departments" label
const target2 = "{isArLocal ? 'الكل' : 'All Departments'}";
const replacement2 = "{isArLocal ? 'كل الأقسام' : 'All Departments'}";
content = content.split(target2).join(replacement2);

// Replacement 3: Split between roster and prices
const target3 = `               {/* Department Doctors & Shifts Section */}
               {selectedPricingDeptId && (`;

const replacement3 = `                      </div>
                  </div>
               ) : (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">`;

if (content.includes(target3)) {
    content = content.replace(target3, replacement3);
} else {
    console.log("Target 3 not found");
}

// Replacement 4: Doctor filter in roster
const target4 = "{(doctors || []).filter(d => String(d.department_id) === String(selectedPricingDeptId)).map(doc => (";
const replacement4 = "{(doctors || []).filter(d => !selectedPricingDeptId || String(d.department_id) === String(selectedPricingDeptId)).map(doc => (";
content = content.split(target4).join(replacement4);

// Replacement 5: Remove "Add Service" button
const target5 = `                        <div className="flex items-center gap-4">
                           <div className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-[2rem] border border-emerald-100 flex items-center gap-3">
                              <Activity size={16}/>
                              <span className="text-xs font-black uppercase tracking-tighter">
                                 {services.length} {isArLocal ? 'خدمة مفعلة' : 'Active Services'}
                              </span>
                           </div>
                           <button onClick={() => setIsAddServiceModalOpen(true)} className="bg-primary-600 text-white px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary-100">
                              <Plus size={18}/>
                              {isArLocal ? 'إضافة خدمة' : 'Add Service'}
                           </button>
                        </div>`;

const replacement5 = `                           <div className="flex items-center gap-4">
                              <div className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-[2rem] border border-emerald-100 flex items-center gap-3">
                                 <Activity size={16}/>
                                 <span className="text-xs font-black uppercase tracking-tighter">
                                    {services.length} {isArLocal ? 'خدمة مفعلة' : 'Active Services'}
                                 </span>
                              </div>
                           </div>`;

if (content.includes(target5)) {
    content = content.replace(target5, replacement5);
} else {
    console.log("Target 5 not found");
}

// Replacement 6: Fix service filtering in registration
const target6 = `                               <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none" onChange={e => {
                                  const srv = services.find(s => s.id === Number(e.target.value));
                                  // Add service to newPatient or handle as needed
                               }}>`;

const replacement6 = `                               <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none" onChange={e => {
                                  const srv = services.find(s => s.id === Number(e.target.value));
                                  setSelectedBookingService(srv);
                               }}>`;

if (content.includes(target6)) {
    content = content.replace(target6, replacement6);
} else {
    console.log("Target 6 not found");
}

// Replacement 7: Booking Modal Improvements (Specialty Filter)
const target7 = `                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isArLocal ? 'القسم' : 'Department'}</label>
                       <select className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none appearance-none outline-none focus:ring-4 focus:ring-primary-50" value={newPatient.departmentId} onChange={e => setNewPatient({...newPatient, departmentId: e.target.value})}>
                         <option value="">{isArLocal ? 'اختر القسم...' : 'Dept'}</option>
                         {depts.map(d => <option key={d.id} value={d.id}>{isArLocal ? d.nameAr : d.nameEn}</option>)}
                       </select>
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isArLocal ? 'الطبيب' : 'Physician'}</label>
                       <select className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none appearance-none outline-none focus:ring-4 focus:ring-primary-50" onChange={e => setSelectedBookingDoctor(e.target.value)}>
                         <option value="">{isArLocal ? 'اختر الطبيب...' : 'Doctor'}</option>
                                                  {doctors.filter(d => {
                            const matchesDept = !newPatient.departmentId || d.department_id === Number(newPatient.departmentId);
                            const matchesShift = !bookingShift || (d.day_shifts || []).some((s: any) => s.type === bookingShift);
                            return matchesDept && matchesShift;
                         }).map(d => <option key={d.id} value={d.id}>{isArLocal ? d.nameAr : (d.nameEn || d.name)}</option>)}
                       </select>
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isArLocal ? 'الخدمة' : 'Service'}</label>
                       <select className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none appearance-none outline-none focus:ring-4 focus:ring-primary-50" onChange={e => {
                          const srv = services.find(s => s.id === Number(e.target.value));
                          setSelectedBookingService(srv);
                       }}>
                         <option value="">{isArLocal ? 'اختر الخدمة...' : 'Service'}</option>
                         {services.map(s => <option key={s.id} value={s.id}>{isArLocal ? s.nameAr : (s.nameEn || s.name)} ({s.finalPrice || s.price})</option>)}
                       </select>
                     </div>
                  </div>`;

const replacement7 = `                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isArLocal ? 'القسم' : 'Department'}</label>
                       <select className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none appearance-none outline-none focus:ring-4 focus:ring-primary-50" value={selectedBookingDeptId} onChange={e => {
                          setSelectedBookingDeptId(e.target.value);
                          setSelectedBookingDoctor('');
                       }}>
                         <option value="">{isArLocal ? 'اختر القسم...' : 'Dept'}</option>
                         {depts.map(d => <option key={d.id} value={d.id}>{isArLocal ? d.nameAr : d.nameEn}</option>)}
                       </select>
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isArLocal ? 'التخصص' : 'Specialty'}</label>
                       <select className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none appearance-none outline-none focus:ring-4 focus:ring-primary-50" value={selectedBookingSpecialty} onChange={e => {
                          setSelectedBookingSpecialty(e.target.value);
                          setSelectedBookingDoctor('');
                       }}>
                         <option value="">{isArLocal ? 'الكل' : 'All Specialties'}</option>
                         {specialties.map(s => <option key={s.id} value={isArLocal ? s.nameAr : s.nameEn}>{isArLocal ? s.nameAr : s.nameEn}</option>)}
                       </select>
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isArLocal ? 'الطبيب' : 'Physician'}</label>
                       <select className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none appearance-none outline-none focus:ring-4 focus:ring-primary-50" value={selectedBookingDoctor} onChange={e => setSelectedBookingDoctor(e.target.value)}>
                         <option value="">{isArLocal ? 'اختر الطبيب...' : 'Doctor'}</option>
                         {doctors.filter(d => {
                            const matchesDept = !selectedBookingDeptId || String(d.department_id) === String(selectedBookingDeptId);
                            const matchesSpecialty = !selectedBookingSpecialty || d.specialtyAr === selectedBookingSpecialty || d.specialtyEn === selectedBookingSpecialty;
                            const matchesShift = !bookingShift || (d.day_shifts || []).some((s: any) => s.type === bookingShift);
                            return matchesDept && matchesSpecialty && matchesShift;
                         }).map(d => <option key={d.id} value={d.id}>{isArLocal ? d.nameAr : (d.nameEn || d.name)}</option>)}
                       </select>
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isArLocal ? 'الخدمة' : 'Service'}</label>
                       <select className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none appearance-none outline-none focus:ring-4 focus:ring-primary-50" onChange={e => {
                          const srv = services.find(s => s.id === Number(e.target.value));
                          setSelectedBookingService(srv);
                       }}>
                         <option value="">{isArLocal ? 'اختر الخدمة...' : 'Service'}</option>
                         {services.filter(s => !selectedBookingDeptId || String(s.department_id) === String(selectedBookingDeptId)).map(s => 
                            <option key={s.id} value={s.id}>{isArLocal ? s.nameAr : (s.nameEn || s.name)} ({s.finalPrice || s.price})</option>
                         )}
                       </select>
                     </div>
                  </div>`;

if (content.includes(target7)) {
    content = content.replace(target7, replacement7);
} else {
    console.log("Target 7 not found");
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Replacement complete");

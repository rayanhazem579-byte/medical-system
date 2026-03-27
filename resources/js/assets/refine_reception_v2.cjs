const fs = require('fs');
const path = require('path');

const filePath = 'c:\\xampp\\htdocs\\my-first-app\\backend\\resources\\js\\assets\\ReceptionPage.tsx';

let content = fs.readFileSync(filePath, 'utf8');

// Function to replace with regex
function replaceWithRegex(targetPattern, replacement) {
    const regex = new RegExp(targetPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+'), 'g');
    if (regex.test(content)) {
        content = content.replace(regex, replacement);
        console.log("Replaced target pattern successfully.");
    } else {
        console.log("Target pattern not found.");
    }
}

// 1. Update Pricing Tab with Sub-tabs
const target1 = `{activeTab === 'pricing' ? (
    <div className="space-y-12">
       <div className="flex flex-wrap items-center justify-between gap-6 p-4 bg-gray-50/50 rounded-[40px] border border-gray-100">`;

const replacement1 = `{activeTab === 'pricing' ? (
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

replaceWithRegex(target1, replacement1);

// 2. Split Roster and Prices
const target2 = `{/* Department Doctors & Shifts Section */}
       {selectedPricingDeptId && (`;

const replacement2 = `              </div>
          </div>
       ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">`;

replaceWithRegex(target2, replacement2);

// 3. Update Register Modal Doctor Selection
// This is more complex, I'll just look for the specific filter line
const target3 = `d.department_id === Number(newPatient.departmentId)) &&
                                    (!(newPatient as any).specialty || d.specialtyAr === (newPatient as any).specialty || d.specialtyEn === (newPatient as any).specialty)`;
const replacement3 = `String(d.department_id) === String(newPatient.departmentId)) &&
                                    (!(newPatient as any).specialty || d.specialtyAr === (newPatient as any).specialty || d.specialtyEn === (newPatient as any).specialty)`;
replaceWithRegex(target3, replacement3);

// 4. Update Booking Modal (Specialty Filter)
const target4 = `<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isArLocal ? 'القسم' : 'Department'}</label>
                       <select className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none appearance-none outline-none focus:ring-4 focus:ring-primary-50" value={newPatient.departmentId} onChange={e => setNewPatient({...newPatient, departmentId: e.target.value})}>
                         <option value="">{isArLocal ? 'اختر القسم...' : 'Dept'}</option>
                         {depts.map(d => <option key={d.id} value={d.id}>{isArLocal ? d.nameAr : d.nameEn}</option>)}
                       </select>
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isArLocal ? 'الطبيب' : 'Physician'}</label>
                       <select className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none appearance-none outline-none focus:ring-4 focus:ring-primary-50" onChange={e => setSelectedBookingDoctor(e.target.value)}>`;

const replacement4 = `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                       <select className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none appearance-none outline-none focus:ring-4 focus:ring-primary-50" value={selectedBookingDoctor} onChange={e => setSelectedBookingDoctor(e.target.value)}>`;

replaceWithRegex(target4, replacement4);

// Additional Doctor Selection Logic in Booking Modal
const target5 = `doctors.filter(d => {
                            const matchesDept = !newPatient.departmentId || d.department_id === Number(newPatient.departmentId);
                            const matchesShift = !bookingShift || (d.day_shifts || []).some((s: any) => s.type === bookingShift);
                            return matchesDept && matchesShift;
                         })`;
const replacement5 = `doctors.filter(d => {
                            const matchesDept = !selectedBookingDeptId || String(d.department_id) === String(selectedBookingDeptId);
                            const matchesSpecialty = !selectedBookingSpecialty || d.specialtyAr === selectedBookingSpecialty || d.specialtyEn === selectedBookingSpecialty;
                            const matchesShift = !bookingShift || (d.day_shifts || []).some((s: any) => s.type === bookingShift);
                            return matchesDept && matchesSpecialty && matchesShift;
                         })`;
replaceWithRegex(target5, replacement5);

// Add service filtering to Booking Modal
const target6 = `{services.map(s => <option key={s.id} value={s.id}>{isArLocal ? s.nameAr : (s.nameEn || s.name)} ({s.finalPrice || s.price})</option>)}`;
const replacement6 = `{services.filter(s => !selectedBookingDeptId || String(s.department_id) === String(selectedBookingDeptId)).map(s => <option key={s.id} value={s.id}>{isArLocal ? s.nameAr : (s.nameEn || s.name)} ({s.finalPrice || s.price})</option>)}`;
replaceWithRegex(target6, replacement6);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Cleanup complete.");

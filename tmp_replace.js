const fs = require('fs');
const file = 'c:/xampp/htdocs/my-first-app/backend/resources/js/assets/ReceptionPage.tsx';
let content = fs.readFileSync(file, 'utf8');

// The replacement logic: let's just find the start and end of the booking block.
const startMarker = "{modalSection === 'booking' && (";
const endMarker = "\n                           {modalSection === 'medical' && (";

let newBookingBlock = `                           {modalSection === 'booking' && (
                              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                 {/* Row 1: Dept & Specialty */}
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isArLocal ? 'القسم المختص' : 'Target Department'}</label>
                                       <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-50" value={newPatient.departmentId} onChange={e => setNewPatient({ ...newPatient, departmentId: e.target.value, doctorId: '', specialty: '', shift: '' })}>
                                          <option value="">{isArLocal ? 'اختر القسم...' : 'Select Dept...'}</option>
                                          {depts.map(d => <option key={d.id} value={d.id}>{isArLocal ? d.nameAr : d.nameEn}</option>)}
                                       </select>
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isArLocal ? 'التخصص' : 'Specialty'}</label>
                                       <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none" value={(newPatient as any).specialty || ''} onChange={e => setNewPatient({ ...newPatient, specialty: e.target.value, doctorId: '' } as any)}>
                                          <option value="">{isArLocal ? 'الكل' : 'All Specialties'}</option>
                                          {specialties.map(s => <option key={s.id} value={isArLocal ? s.nameAr : s.nameEn}>{isArLocal ? s.nameAr : s.nameEn}</option>)}
                                       </select>
                                    </div>
                                 </div>

                                 {/* Row 2: Shift & Service */}
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isArLocal ? 'فترة العمل (الموعد)' : 'Appointment Slot'}</label>
                                       <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                                          {[
                                             { id: 'morning', ar: 'صباحي', en: 'Morning' },
                                             { id: 'evening', ar: 'مسائي', en: 'Evening' }
                                          ].map(shift => (
                                             <button
                                                key={shift.id}
                                                type="button"
                                                onClick={() => setNewPatient({ ...newPatient, shift: shift.id, doctorId: '' })}
                                                className={\`flex-1 py-4 rounded-xl transition-all font-black text-xs uppercase tracking-widest \${newPatient.shift === shift.id ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}\`}
                                             >
                                                {isArLocal ? shift.ar : shift.en}
                                             </button>
                                          ))}
                                       </div>
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isArLocal ? 'الخدمة المطلوبة' : 'Service Required'}</label>
                                       <select 
                                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-emerald-50" 
                                          value={newPatient.serviceId}
                                          onChange={e => {
                                             const srv = services.find(s => s.id === Number(e.target.value));
                                             setNewPatient({ ...newPatient, serviceId: e.target.value, selectedService: srv });
                                          }}
                                       >
                                          <option value="">{isArLocal ? 'اختر الخدمة...' : 'Select Service...'}</option>
                                          {services.filter(s => !newPatient.departmentId || String(s.department_id) === String(newPatient.departmentId)).map(s =>
                                             <option key={s.id} value={s.id}>{isArLocal ? s.nameAr : (s.nameEn || s.name)} ({s.finalPrice || s.price})</option>
                                          )}
                                       </select>
                                    </div>
                                 </div>

                                 {newPatient.selectedService && (
                                    <div className="p-6 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 flex items-center justify-between animate-in slide-in-from-top-4 duration-300">
                                       <div className="flex items-center gap-4">
                                          <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><CreditCard size={24} /></div>
                                          <div>
                                             <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{isArLocal ? 'رسوم الخدمة' : 'Service Fee'}</p>
                                             <h4 className="font-black text-gray-800 text-lg">{isArLocal ? newPatient.selectedService.nameAr : (newPatient.selectedService.nameEn || newPatient.selectedService.name)}</h4>
                                          </div>
                                       </div>
                                       <div className="text-left" dir="ltr">
                                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-right">{isArLocal ? 'المجموع' : 'Total'}</p>
                                          <h2 className="text-3xl font-black text-emerald-600 tracking-tighter">{newPatient.selectedService.finalPrice || newPatient.selectedService.price} <span className="text-xs uppercase">SDG</span></h2>
                                       </div>
                                    </div>
                                 )}

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Physician (Searchable) */}
                                    <div className="space-y-4">
                                       <div className="space-y-2">
                                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isArLocal ? 'الطبيب المعالج' : 'Assigned Physician'}</label>
                                          <div className="relative group/search-physician-modern">
                                             <Search className={\`absolute \${isArLocal ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none\`} size={14} />
                                             <input
                                                type="text"
                                                className={\`w-full p-4 \${isArLocal ? 'pl-10 text-right' : 'pr-10'} bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-primary-50 transition-all\`}
                                                placeholder={isArLocal ? 'ابحث عن طبيب...' : 'Search for physician...'}
                                                value={doctorSearchTerm}
                                                onChange={e => {
                                                   setDoctorSearchTerm(e.target.value);
                                                   if (!e.target.value) setNewPatient({ ...newPatient, doctorId: '' });
                                                }}
                                                onFocus={() => { if (!doctorSearchTerm) setDoctorSearchTerm(' '); setTimeout(() => setDoctorSearchTerm(''), 10); }}
                                             />
                                             
                                             {doctorSearchTerm.length > 0 && (
                                                <div className="absolute top-full left-0 right-0 z-[100] mt-2 p-2 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 max-h-[300px] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-200">
                                                   {(() => {
                                                      const filteredDocs = doctors.filter(d => {
                                                         const matchSearch = (isArLocal ? (d.nameAr || d.name) : (d.nameEn || d.name)).toLowerCase().includes(doctorSearchTerm.toLowerCase().trim());
                                                         const matchDept = !newPatient.departmentId || String(d.department_id) === String(newPatient.departmentId);
                                                         const matchSpecialty = !(newPatient as any).specialty || d.specialtyAr === (newPatient as any).specialty || d.specialtyEn === (newPatient as any).specialty || d.specialty_ar === (newPatient as any).specialty || d.specialty_en === (newPatient as any).specialty;
                                                         const matchShift = !newPatient.shift || (d.day_shifts && Array.isArray(d.day_shifts) && d.day_shifts.some((s: any) => {
                                                            const sType = typeof s === 'string' ? s : s.type;
                                                            return sType && sType.toLowerCase() === newPatient.shift.toLowerCase();
                                                         }));
                                                         const matchShiftsArr = !newPatient.shift || (d.shifts && Array.isArray(d.shifts) && d.shifts.some((s: any) => {
                                                            const sType = typeof s === 'string' ? s : s.type;
                                                            return sType && sType.toLowerCase() === newPatient.shift.toLowerCase();
                                                         }));
                                                         
                                                         return matchSearch && matchDept && matchSpecialty && (matchShift || matchShiftsArr);
                                                      });

                                                      if (filteredDocs.length === 0) {
                                                         return (
                                                            <div className="p-4 text-center text-gray-400 font-bold text-sm">
                                                               {isArLocal ? 'لا يوجد أطباء متاحين بهذه المواصفات أو في هذه الفترة' : 'No doctors available matching these criteria or shift'}
                                                            </div>
                                                         );
                                                      }

                                                      return filteredDocs.map(d => (
                                                         <button
                                                            key={d.id}
                                                            type="button"
                                                            onClick={() => {
                                                               setNewPatient({ ...newPatient, doctorId: String(d.id) });
                                                               setDoctorSearchTerm(isArLocal ? (d.nameAr || d.name) : (d.nameEn || d.name));
                                                            }}
                                                            className={\`w-full \${isArLocal ? 'text-right' : 'text-left'} p-4 hover:bg-primary-50 rounded-2xl transition-all flex items-center justify-between group/doc-find-final mb-1\`}
                                                         >
                                                            <div className="flex items-center gap-3">
                                                               <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary-600 font-black group-hover:bg-white transition-colors">{(isArLocal ? (d.nameAr || d.name) : (d.nameEn || d.name)).charAt(0)}</div>
                                                               <div>
                                                                  <h6 className="font-extrabold text-gray-800 text-sm group-hover:text-primary-700">{isArLocal ? (d.nameAr || d.name) : (d.nameEn || d.name)}</h6>
                                                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{isArLocal ? (d.specialtyAr || d.specialty_ar) : (d.specialtyEn || d.specialty_en)}</p>
                                                               </div>
                                                            </div>
                                                            <ChevronRight size={14} className={isArLocal ? 'rotate-180 text-gray-300' : 'text-gray-300'} />
                                                         </button>
                                                      ));
                                                   })()}
                                                </div>
                                             )}
                                          </div>
                                       </div>

                                       {newPatient.doctorId && (
                                          <div className="p-5 bg-primary-50 rounded-[2.5rem] border border-primary-100 flex items-center gap-4 animate-in slide-in-from-right-4 duration-300">
                                             <div className="w-12 h-12 bg-primary-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><Stethoscope size={24} /></div>
                                             <div>
                                                <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1">{isArLocal ? 'بيانات الطبيب' : 'Doctor Details'}</p>
                                                <h5 className="font-extrabold text-gray-800 text-sm">
                                                   {(() => {
                                                      const doc = doctors.find(d => String(d.id) === String(newPatient.doctorId));
                                                      return doc ? (isArLocal ? doc.nameAr : (doc.nameEn || doc.name)) : '';
                                                   })()}
                                                </h5>
                                                <span className="px-2 py-0.5 bg-white/50 text-primary-700 rounded-lg text-[9px] font-black uppercase tracking-widest border border-primary-100 mt-1 inline-block">
                                                   {(() => {
                                                      const doc = doctors.find(d => String(d.id) === String(newPatient.doctorId));
                                                      return doc ? (doc.grade || (isArLocal ? 'أخصائي' : 'Specialist')) : '';
                                                   })()}
                                                </span>
                                             </div>
                                          </div>
                                       )}
                                    </div>

                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isArLocal ? 'نوع الزيارة' : 'Visit Type'}</label>
                                       <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                                          {[
                                             { id: 'regular', ar: 'كشف', en: 'Consultation' },
                                             { id: 'follow-up', ar: 'متابعة', en: 'Follow-up' },
                                             { id: 'emergency', ar: 'طوارئ', en: 'Emergency' }
                                          ].map(type => (
                                             <button
                                                key={type.id}
                                                type="button"
                                                onClick={() => {
                                                   const isEmerg = type.id === 'emergency';
                                                   const emergencyDept = depts.find(d => d.nameEn?.toLowerCase().includes('emergency') || d.nameAr?.includes('طوارئ'));
                                                   setNewPatient({
                                                      ...newPatient,
                                                      visitType: type.id,
                                                      departmentId: isEmerg && emergencyDept ? String(emergencyDept.id) : newPatient.departmentId
                                                   });
                                                }}
                                                className={\`flex-1 py-4 rounded-xl transition-all font-black text-xs uppercase tracking-widest \${newPatient.visitType === type.id ? 'bg-primary-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}\`}
                                             >
                                                {isArLocal ? type.ar : type.en}
                                             </button>
                                          ))}
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           )}`;

let startIndex = content.indexOf(startMarker);
let endIndex = content.indexOf(endMarker);

if(startIndex > -1 && endIndex > -1) {
    let before = content.substring(0, startIndex);
    let after = content.substring(endIndex);
    fs.writeFileSync(file, before + newBookingBlock + after, 'utf8');
    console.log("Successfully fixed and replaced booking UI block.");
} else {
    console.log("Could not find markers.");
}

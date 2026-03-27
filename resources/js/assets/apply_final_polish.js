const fs = require('fs');
const path = require('path');

const targetFile = 'c:\\xampp\\htdocs\\my-first-app\\backend\\resources\\js\\assets\\DoctorsPage.tsx';

if (!fs.existsSync(targetFile)) {
    console.error(`File not found: ${targetFile}`);
    process.exit(1);
}

let content = fs.readFileSync(targetFile, 'utf8');

// 1. Expand handleBatchSave payload
const payloadPattern = /const payload = \{[\s\S]*?working_days: editDoc\.workingDays,[\s\S]*?day_shifts: editDoc\.dayShifts,[\s\S]*?shift_type: editDoc\.shiftType \|\| editDoc\.dayShifts\?\.\[0\]\?\.type \|\| 'morning'[\s\S]*?\};/;
const newPayload = `const payload = {
         name: editDoc.nameAr || editDoc.nameEn,
         email: editDoc.email,
         phone: editDoc.phone,
         medical_id: editDoc.medicalId,
         work_hours: editDoc.workHours,
         working_days: editDoc.workingDays,
         day_shifts: editDoc.dayShifts,
         shift_type: editDoc.shiftType || editDoc.dayShifts?.[0]?.type || 'morning',
         status: editDoc.status,
         exp_years: editDoc.expYears
      };`;
content = content.replace(payloadPattern, newPayload);

// 2. Update Roster Off-day indicator (Plus to X)
const offDayPattern = /if \(!isWorking\) \{[\s\S]*?return \([\s\S]*?<td key=\{day\} className="px-4 py-5 border-gray-50 relative group\/cell cursor-pointer" onClick=\{cycleShift\} title=\{getTooltip\(\)\}>[\s\S]*?<div className="flex flex-col items-center justify-center py-4 opacity-5 group-hover\/cell:opacity-60 transition-all transform hover:scale-125">[\s\S]*?<Plus size=\{16\} className="text-primary-600" strokeWidth=\{3\} \/>[\s\S]*?<\/div>[\s\S]*?<\/td>[\s\S]*?\);[\s\S]*?\}/;
const newOffDay = `if (!isWorking) {
                                     return (
                                        <td key={day} className="px-4 py-5 border-gray-50 text-center relative group/cell cursor-pointer" onClick={cycleShift}>
                                           <div className="flex items-center justify-center py-4 w-full h-full">
                                              <div className="w-10 h-10 rounded-2xl bg-gray-50 text-gray-200 border border-gray-100 flex items-center justify-center shadow-inner group-hover/cell:text-rose-500 group-hover/cell:bg-rose-50 transition-all">
                                                 <X size={20} />
                                              </div>
                                           </div>
                                        </td>
                                     );
                                  }`;
content = content.replace(offDayPattern, newOffDay);

// 3. Enhance Update Button
const updateBtnPattern = /<button[\s\S]*?onClick=\{handleBatchSave\}[\s\S]*?className="flex-1 bg-primary-600 text-white py-4 rounded-2xl text-\[11px\] font-black uppercase tracking-widest hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-100 hover:-translate-y-0\.5 transition-all flex items-center justify-center gap-3 shadow-lg"[\s\S]*?>[\s\S]*?<Activity size=\{18\} \/>[\s\S]*?\{isAr \? 'تعديل البيانات' : 'Update Physician'\}[\s\S]*?<\/button>/;
const newUpdateBtn = `<button 
                   onClick={handleBatchSave}
                   className="flex-1 bg-primary-600 text-white py-4 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] hover:bg-primary-700 hover:shadow-2xl hover:shadow-primary-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-4 shadow-xl border-2 border-white/20"
                >
                   <CheckCircle2 size={22} />
                   {isAr ? 'حفظ وتأكيد التعديلات' : 'Save & Confirm Changes'}
                </button>`;
content = content.replace(updateBtnPattern, newUpdateBtn);

fs.writeFileSync(targetFile, content);
console.log('Final Physician Management refinements applied successfully.');

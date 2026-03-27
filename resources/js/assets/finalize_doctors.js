const fs = require('fs');
const path = 'c:\\xampp\\htdocs\\my-first-app\\backend\\resources\\js\\assets\\DoctorsPage.tsx';
let content = fs.readFileSync(path, 'utf8');

// Update Save Payload
content = content.replace(
    /payload = \{\s+working_days: editDoc.workingDays,\s+day_shifts: editDoc.dayShifts,\s+shift_type: editDoc.shiftType \|\| editDoc.dayShifts\?\.\[0\]\?\.type \|\| 'morning'\s+\};/,
    `payload = {
        name: editDoc.nameAr || editDoc.nameEn,
        email: editDoc.email,
        phone: editDoc.phone,
        medical_id: editDoc.medicalId,
        work_hours: editDoc.workHours,
        working_days: editDoc.workingDays,
        day_shifts: editDoc.dayShifts,
        shift_type: editDoc.shiftType || editDoc.dayShifts?.[0]?.type || 'morning',
        status: editDoc.status
      };`
);

// Update Off-day indicator to X
content = content.replace(
    /if \(!isWorking\) \{\s+return \(\s+<td key=\{day\} className="px-4 py-5 border-gray-50 relative group\/cell cursor-pointer" onClick=\{cycleShift\} title=\{getTooltip\(\)\}>\s+<div className="flex flex-col items-center justify-center py-4 opacity-5 group-hover\/cell:opacity-60 transition-all transform hover:scale-125">\s+<Plus size=\{16\} className="text-primary-600" strokeWidth=\{3\} \/>\s+<\/div>\s+<\/td>\s+\);\s+\}/,
    `if (!isWorking) {
                                     return (
                                        <td key={day} className="px-4 py-5 border-gray-50 text-center relative group/cell cursor-pointer" onClick={cycleShift}>
                                           <div className="flex items-center justify-center py-4 w-full h-full">
                                              <div className="w-10 h-10 rounded-2xl bg-gray-50 text-gray-200 border border-gray-100 flex items-center justify-center shadow-inner group-hover/cell:text-rose-500 group-hover/cell:bg-rose-50 transition-all">
                                                 <X size={20} />
                                              </div>
                                           </div>
                                        </td>
                                     );
                                  }`
);

fs.writeFileSync(path, content);
console.log('Final Physician Roster and Profile sync applied.');

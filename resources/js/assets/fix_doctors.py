import sys

file_path = r'c:\xampp\htdocs\my-first-app\backend\resources\js\assets\DoctorsPage.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    # 1. Update payload
    if 'working_days: editDoc.workingDays,' in line:
        # Keep indentation but replace/add lines
        indent = line[:line.find('working_days')]
        new_lines.append(f"{indent}name: editDoc.nameAr || editDoc.nameEn,\n")
        new_lines.append(f"{indent}email: editDoc.email,\n")
        new_lines.append(f"{indent}phone: editDoc.phone,\n")
        new_lines.append(f"{indent}medical_id: editDoc.medicalId,\n")
        new_lines.append(f"{indent}work_hours: editDoc.workHours,\n")
        new_lines.append(line) # original working_days line
    elif 'shift_type: editDoc.shiftType || editDoc.dayShifts?.[0]?.type || \'morning\'' in line:
        indent = line[:line.find('shift_type')]
        new_lines.append(line)
        new_lines.append(f"{indent}status: editDoc.status\n")
    # 2. Update off-day rendering (X instead of Plus)
    elif '<Plus size={16} className="text-primary-600" strokeWidth={3} />' in line:
        indent = line[:line.find('<Plus')]
        new_lines.append(f"{indent}<X size={20} className=\"text-gray-200 group-hover/cell:text-rose-500\" />\n")
    elif 'opacity-5 group-hover/cell:opacity-60 transition-all transform hover:scale-125' in line:
        indent = line[:line.find('opacity-5')]
        new_lines.append(f"{indent}flex items-center justify-center w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 shadow-inner group-hover/cell:bg-rose-50 transition-all\n")
    else:
        new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Applied sync and UI fixes successfully.")

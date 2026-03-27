import os

path = r"c:\xampp\htdocs\my-first-app\backend\resources\js\assets\ReceptionPage.tsx"
if not os.path.exists(path):
    print("File not found")
    exit(1)

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip_mode = False

# We will build a new Pricing tab block and re-balance the entire tree.
# We know the markers: 
# pricing marker: activeTab === 'pricing' ? (
# waiting marker: ) : activeTab === 'waiting' ? (

for i, line in enumerate(lines):
    if "activeTab === 'pricing' ?" in line:
        # Start of pricing block - usually around line 368
        new_lines.append(line)
        # We start skipping the old broken pricing content until the waiting marker
        skip_mode = True
        
        # Inject our NEW, CLEAN, STABLE pricing tab structure
        new_lines.append("            <div className=\"space-y-12 animate-in fade-in duration-500\">\n")
        new_lines.append("               {/* Catalogue Header with Add Service Button */}\n")
        new_lines.append("               <div className=\"flex flex-wrap items-center justify-between gap-6\">\n")
        new_lines.append("                  <div className=\"space-y-1\">\n")
        new_lines.append("                     <h4 className=\"text-xl font-black text-gray-800 flex items-center gap-3\"><DollarSign className=\"text-emerald-500\" size={24}/>{isArLocal ? '\u0643\u062a\u0627\u0644\u0648\u062c \u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0648\u0627\u0644\u062a\u0631\u064a\u0641\u0629 \u0627\u0644\u0637\u0628\u064a\u0629' : 'Service Catalogue & Tariff'}</h4>\n")
        new_lines.append("                     <p className=\"text-[10px] font-bold text-gray-400 uppercase tracking-widest\">{isArLocal ? '\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0645\u0639\u062a\u0645\u062f\u0629 \u0644\u0644\u0639\u064a\u0627\u062f\u0627\u062a \u0648\u0627\u0644\u0645\u062e\u062a\u0628\u0631\u0627\u062a' : 'Board-Approved Standard Pricing for Clinical Operations'}</p>\n")
        new_lines.append("                  </div>\n")
        new_lines.append("                  <div className=\"flex items-center gap-4\">\n")
        new_lines.append("                     <div className=\"px-6 py-3 bg-emerald-50 text-emerald-600 rounded-[2rem] border border-emerald-100 flex items-center gap-3\">\n")
        new_lines.append("                        <Database size={16}/>\n")
        new_lines.append("                        <span className=\"text-xs font-black uppercase tracking-tighter\">{(services || []).length} {isArLocal ? '\u062e\u062f\u0645\u0629 \u0645\u0641\u0631\u0633\u062a' : 'Catalogued Services'}</span>\n")
        new_lines.append("                     </div>\n")
        new_lines.append("                     <button onClick={() => setIsAddServiceModalOpen(true)} className=\"px-8 py-3 bg-emerald-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-3\">\n")
        new_lines.append("                        <Plus size={16}/>\n")
        new_lines.append("                        {isArLocal ? '\u0625\u0636\u0627\u0641\u0629 \u062e\u062f\u0645\u0629' : 'Add Service'}\n")
        new_lines.append("                     </button>\n")
        new_lines.append("                  </div>\n")
        new_lines.append("               </div>\n")
        new_lines.append("\n")
        new_lines.append("               {/* Services Catalog Table (High Density) */}\n")
        new_lines.append("               <div className=\"bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden whitespace-nowrap overflow-x-auto custom-scrollbar\">\n")
        new_lines.append("                  <table className=\"w-full text-right\" dir={isArLocal ? 'rtl' : 'ltr'}>\n")
        new_lines.append("                     <thead>\n")
        new_lines.append("                        <tr className=\"bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase text-gray-400 tracking-widest\">\n")
        new_lines.append("                           <th className=\"p-6\">{isArLocal ? '\u0643\u0648\u062f' : 'Code'}</th>\n")
        new_lines.append("                           <th className=\"p-6\">{isArLocal ? '\u0627\u0644\u062e\u062f\u0645\u0629 \u0627\u0644\u0637\u0628\u064a\u0629' : 'Clinical Service'}</th>\n")
        new_lines.append("                           <th className=\"p-6\">{isArLocal ? '\u0627\u0644\u0642\u0633\u0645' : 'Department'}</th>\n")
        new_lines.append("                           <th className=\"p-6\">{isArLocal ? '\u0627\u0644\u0633\u0639\u0631' : 'Base'}</th>\n")
        new_lines.append("                           <th className=\"p-6\">{isArLocal ? '\u0627\u0644\u062e\u0635\u0645' : 'Disc'}</th>\n")
        new_lines.append("                           <th className=\"p-6 text-emerald-600 font-black\">{isArLocal ? '\u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a' : 'Total'}</th>\n")
        new_lines.append("                           <th className=\"p-6 text-center\">{isArLocal ? '\u0625\u062c\u0631\u0627\u0621\u0627\u062a' : 'Ops'}</th>\n")
        new_lines.append("                        </tr>\n")
        new_lines.append("                     </thead>\n")
        new_lines.append("                     <tbody className=\"divide-y divide-gray-50\">\n")
        new_lines.append("                        {(services || []).filter(s => !selectedPricingDeptId || (s?.department_id && String(s.department_id) === String(selectedPricingDeptId))).map(s => (\n")
        new_lines.append("                           <tr key={s.id} className=\"hover:bg-gray-50/70 transition-colors group\">\n")
        new_lines.append("                              <td className=\"p-6\"><div className=\"p-2.5 bg-gray-100 rounded-xl text-[10px] font-black text-gray-500 w-fit\">SER-{s.id}</div></td>\n")
        new_lines.append("                              <td className=\"p-6\">\n")
        new_lines.append("                                 <p className=\"text-sm font-black text-gray-800\">{isArLocal ? (s.nameAr || s.name) : (s.nameEn || s.name)}</p>\n")
        new_lines.append("                                 <p className=\"text-[10px] font-bold text-gray-400 uppercase tracking-widest uppercase\">{isArLocal ? (s.classificationAr || '\u0639\u0627\u0645') : (s.classificationEn || 'General')}</p>\n")
        new_lines.append("                              </td>\n")
        new_lines.append("                              <td className=\"p-6\"><span className=\"text-[10px] font-black uppercase tracking-tighter text-blue-500\">{isArLocal ? (s.department?.nameAr || '\u0639\u0627\u0645') : (s.department?.nameEn || 'General')}</span></td>\n")
        new_lines.append("                              <td className=\"p-6 text-sm font-black text-gray-600\">{s.price || s.cost} <span className=\"text-[8px] text-gray-300\">EGP</span></td>\n")
        new_lines.append("                              <td className=\"p-6 text-sm font-black text-rose-500\">-{s.discount || 0} <span className=\"text-[8px] text-rose-200\">EGP</span></td>\n")
        new_lines.append("                              <td className=\"p-6 text-sm font-black text-emerald-600\">{s.finalPrice || s.price || s.cost} <span className=\"text-[8px]\">EGP</span></td>\n")
        new_lines.append("                              <td className=\"p-6\">\n")
        new_lines.append("                                 <div className=\"flex justify-center gap-2\">\n")
        new_lines.append("                                    <button onClick={() => handleEditService(s)} className=\"w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-amber-500 hover:border-amber-200 transition-all shadow-sm active:scale-90\"><Edit3 size={14}/></button>\n")
        new_lines.append("                                    <button className=\"w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center text-gray-200 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm active:scale-90\"><Trash2 size={14}/></button>\n")
        new_lines.append("                                 </div>\n")
        new_lines.append("                              </td>\n")
        new_lines.append("                           </tr>\n")
        new_lines.append("                        ))}\n")
        new_lines.append("                     </tbody>\n")
        new_lines.append("                  </table>\n")
        new_lines.append("               </div>\n")
        new_lines.append("            </div>\n")
        continue

    if skip_mode:
        if "activeTab === 'waiting' ?" in line:
            skip_mode = False
            # Before the waiting block, we MUST close the pricing container and its condition
            new_lines.append("         ) : activeTab === 'waiting' ? (\n")
            continue
        else:
            # Skip old broken content
            continue

    new_lines.append(line)

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Surgery successful - ReceptionPage.tsx restored and enhanced.")

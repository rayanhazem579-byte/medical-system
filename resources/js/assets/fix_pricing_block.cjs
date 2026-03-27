const fs = require('fs');
const filePath = 'c:\\xampp\\htdocs\\my-first-app\\backend\\resources\\js\\assets\\ReceptionPage.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const startMarker = "          {activeTab === 'pricing' ? (";
const endMarker = ") : activeTab === 'waiting' ? (";

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    const replacement = `{activeTab === 'pricing' ? (
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
                     <div className="flex flex-wrap items-center justify-between gap-6 p-6 bg-gray-50/50 rounded-[40px] border border-gray-100">
                        <div className="flex flex-wrap gap-2">
                           <button 
                            onClick={() => setSelectedPricingDeptId(null)} 
                            className={\`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black transition-all \${selectedPricingDeptId === null ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-gray-400 border border-gray-50 hover:border-indigo-100'}\`}
                           >
                              <Globe size={14}/>
                              {isArLocal ? 'كل الأقسام' : 'All Departments'}
                           </button>
                           {(depts || []).filter(d => d).map(d => {
                              const name = (d.nameAr || '').toLowerCase();
                              const nameEn = (d.nameEn || '').toLowerCase();
                              let icon = <Stethoscope size={14}/>;
                              
                              if (name.includes('قلب') || nameEn.includes('heart')) {
                                 icon = <Heart size={14} className={selectedPricingDeptId === d.id ? 'fill-white' : 'text-rose-500'}/>;
                              } else if (name.includes('طوارئ') || nameEn.includes('emergency')) {
                                 icon = <LifeBuoy size={14} className={selectedPricingDeptId === d.id ? 'animate-pulse' : 'text-orange-500'}/>;
                              } else if (name.includes('أطفال') || nameEn.includes('pediatr')) {
                                 icon = <Baby size={14} className={selectedPricingDeptId === d.id ? '' : 'text-blue-400'}/>;
                              } else if (name.includes('باطنة') || nameEn.includes('medicin') || nameEn.includes('general')) {
                                 icon = <Activity size={14} className={selectedPricingDeptId === d.id ? '' : 'text-emerald-500'}/>;
                              }

                              return (
                                <button 
                                  key={d.id} 
                                  onClick={() => setSelectedPricingDeptId(d.id)} 
                                  className={\`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black transition-all \${selectedPricingDeptId === d.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-gray-400 border border-gray-100 hover:border-indigo-100'}\`}
                                >
                                   {icon}
                                   {isArLocal ? d.nameAr : d.nameEn}
                                </button>
                              );
                           })}
                        </div>
                     </div>

                     <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 overflow-hidden">
                        <div className="flex items-center justify-between">
                           <div className="space-y-1">
                              <h4 className="text-xl font-black text-gray-800 flex items-center gap-3">
                                 <Clock className="text-primary-500" size={24}/>
                                 {isArLocal ? 'جدول المناوبات العيادية' : 'Clinical Shift Schedule'}
                              </h4>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                 {isArLocal ? 'توزيع الأطباء الاستشاريين والأخصائيين على مدار الأسبوع' : 'Weekly distribution of clinical specialists and consultants'}
                              </p>
                           </div>
                           <div className="px-6 py-3 bg-primary-50 text-primary-600 rounded-[2rem] border border-primary-100 flex items-center gap-3">
                              <Users size={16}/>
                              <span className="text-xs font-black uppercase tracking-tighter">
                                 {(doctors || []).filter(d => !selectedPricingDeptId || String(d.department_id) === String(selectedPricingDeptId)).length} {isArLocal ? 'طبيب متاح' : 'Active Clinicians'}
                              </span>
                           </div>
                        </div>
                         
                         <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden whitespace-nowrap overflow-x-auto custom-scrollbar">
                            <table className="w-full text-right" dir={isArLocal ? 'rtl' : 'ltr'}>
                               <thead>
                                  <tr className="bg-gray-50 border-b border-gray-100">
                                     <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest min-w-[200px]">{isArLocal ? 'الطبيب' : 'Physician'}</th>
                                     {days.map(d => (
                                        <th key={d.en} className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">{isArLocal ? d.ar : d.en}</th>
                                     ))}
                                  </tr>
                               </thead>
                               <tbody className="divide-y divide-gray-50">
                                  {(doctors || []).filter(d => !selectedPricingDeptId || String(d.department_id) === String(selectedPricingDeptId)).map(doc => (
                                     <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-6">
                                           <div className="flex items-center gap-4">
                                              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-xs">{(doc.nameAr || doc.nameEn || 'D').charAt(0)}</div>
                                              <div>
                                                 <p className="text-sm font-black text-gray-800">{isArLocal ? doc.nameAr : (doc.nameEn || doc.name)}</p>
                                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{isArLocal ? doc.specialtyAr : doc.specialtyEn}</p>
                                              </div>
                                           </div>
                                        </td>
                                        {days.map(day => {
                                           const shifts = (doc.day_shifts || doc.manawbats || []).filter((s) => s.dayEn === day.en || s.dayAr === day.ar);
                                           return (
                                              <td key={day.en} className="p-6 text-center">
                                                 {shifts.length > 0 ? (
                                                    <div className="flex flex-col gap-1 items-center">
                                                       {shifts.map((s, idx) => (
                                                          <span key={idx} className={\`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter \${s.type === 'morning' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}\`}>
                                                             {isArLocal ? (s.type === 'morning' ? 'صباحي' : 'مسائي') : s.type}
                                                          </span>
                                                       ))}
                                                    </div>
                                                 ) : (
                                                    <span className="text-[9px] font-black text-gray-200 uppercase tracking-widest">---</span>
                                                 )}
                                              </td>
                                           );
                                        })}
                                     </tr>
                                  ))}
                               </tbody>
                            </table>
                         </div>
                      </div>
                  </div>
               ) : (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex flex-wrap items-center justify-between gap-6">
                         <div className="space-y-1">
                            <h4 className="text-xl font-black text-gray-800 flex items-center gap-3"><DollarSign className="text-emerald-500" size={24}/>{isArLocal ? 'كتالوج الخدمات والتعريفة الطبية' : 'Service Catalogue & Tariff'}</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isArLocal ? 'قائمة الأسعار المعتمدة للعيادات والمختبرات' : 'Board-Approved Standard Pricing for Clinical Operations'}</p>
                         </div>
                           <div className="flex items-center gap-4">
                              <div className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-[2rem] border border-emerald-100 flex items-center gap-3">
                                 <Activity size={16}/>
                                 <span className="text-xs font-black uppercase tracking-tighter">
                                    {services.length} {isArLocal ? 'خدمة مفعلة' : 'Active Services'}
                                 </span>
                              </div>
                           </div>
                        </div>
                        
                        {/* Services Management Table (High Density) */}
                        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden whitespace-nowrap overflow-x-auto custom-scrollbar">
                           <table className="w-full text-right" dir={isArLocal ? 'rtl' : 'ltr'}>
                              <thead>
                                 <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                    <th className="p-6">{isArLocal ? 'كود' : 'Code'}</th>
                                    <th className="p-6">{isArLocal ? 'الخدمة الطبية' : 'Clinical Service'}</th>
                                    <th className="p-6">{isArLocal ? 'القسم' : 'Department'}</th>
                                    <th className="p-6">{isArLocal ? 'السعر' : 'Base'}</th>
                                    <th className="p-6">{isArLocal ? 'الخصم' : 'Disc'}</th>
                                    <th className="p-6 text-emerald-600 font-black">{isArLocal ? 'الإجمالي' : 'Total'}</th>
                                    <th className="p-6 text-center">{isArLocal ? 'إجراءات' : 'Ops'}</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50">
                                 {(services || []).filter(s => !selectedPricingDeptId || (s?.department_id && String(s.department_id) === String(selectedPricingDeptId))).map(s => (
                                    <tr key={s.id} className="hover:bg-gray-50/70 transition-colors group">
                                       <td className="p-6">
                                          <div className="p-2.5 bg-gray-100 rounded-xl text-[10px] font-black text-gray-500 w-fit">SER-{s.id}</div>
                                       </td>
                                       <td className="p-6">
                                          <p className="text-sm font-black text-gray-800">{isArLocal ? (s.nameAr || s.name) : (s.nameEn || s.name)}</p>
                                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isArLocal ? (s.classificationAr || 'عام') : (s.classificationEn || 'General')}</p>
                                       </td>
                                       <td className="p-6">
                                          <span className="text-[10px] font-black uppercase tracking-tighter text-blue-500">{isArLocal ? (s.department?.nameAr || 'عام') : (s.department?.nameEn || 'General')}</span>
                                       </td>
                                       <td className="p-6 text-sm font-black text-gray-600">{s.price || s.cost} <span className="text-[8px] text-gray-300">EGP</span></td>
                                       <td className="p-6 text-sm font-black text-rose-500">-{s.discount || 0} <span className="text-[8px] text-rose-200">EGP</span></td>
                                       <td className="p-6 text-sm font-black text-emerald-600">
                                          {s.finalPrice || s.price || s.cost} <span className="text-[8px]">EGP</span>
                                       </td>
                                       <td className="p-6">
                                          <div className="flex justify-center gap-2">
                                             <button onClick={() => handleEditService(s)} className="w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-amber-500 hover:border-amber-200 transition-all shadow-sm active:scale-90"><Edit3 size={14}/></button>
                                             <button className="w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center text-gray-200 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm active:scale-90"><Trash2 size={14}/></button>
                                          </div>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
               )}
            </div>`;
    
    const newContent = content.substring(0, startIndex) + replacement + "\n          " + content.substring(endIndex);
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log("Pricing section replaced successfully.");
} else {
    console.log("Could not find start or end marker.");
    console.log("Start marker index:", startIndex);
    console.log("End marker index:", endIndex);
}

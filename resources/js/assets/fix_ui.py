import re
import os

path = r'c:\xampp\htdocs\my-first-app\backend\resources\js\assets\AccountsPage.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# The UI we want to inject
new_ui = """
                     <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-5 space-y-3 text-left">
                        <div className="flex justify-between items-center bg-white p-3.5 rounded-2xl border border-slate-50 shadow-sm transition-all hover:bg-slate-50/50">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{isAr ? 'اسم المستخدم' : 'Username'}}</span>
                           <span className="text-xs font-black text-slate-800 tracking-tight">{{confirmActivation.username}}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-3.5 rounded-2xl border border-slate-50 shadow-sm transition-all hover:bg-slate-50/50">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{isAr ? 'كلمة المرور' : 'Password'}}</span>
                           <div className="flex items-center gap-3">
                              <span className="text-xs font-black text-emerald-600 font-mono tracking-widest bg-emerald-50/50 px-2 py-0.5 rounded-md">
                                 {{confirmActivation.password || (isAr ? '[تلقائية]' : '[Auto-Generated]')}}
                              </span>
                              <button 
                                 type="button"
                                 onClick={(e) => {{
                                    e.stopPropagation();
                                    const newPass = Math.random().toString(36).slice(-10).toUpperCase();
                                    setConfirmActivation({{...confirmActivation, password: newPass}});
                                 }}}
                                 className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all transform active:scale-90"
                                 title={{isAr ? 'توليد كلمة مرور جديدة' : 'Regenerate Password'}}
                              >
                                 <RefreshCcw size={14} className="hover:rotate-180 transition-transform" />
                              </button>
                           </div>
                        </div>
                     </div>
""".replace('{{', '{').replace('}}', '}')

# Regex to find the question paragraph and inject below it
# We match the <p> block and everything until its closing </p>
pattern = r'(<p className="text-gray-600 font-bold text-sm leading-relaxed">.*?</p>\s*)'
modified = re.sub(pattern, r'\1' + new_ui, content, count=1, flags=re.DOTALL)

if modified != content:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(modified)
    print("UI fixed successfully!")
else:
    print("Could not match the pattern.")

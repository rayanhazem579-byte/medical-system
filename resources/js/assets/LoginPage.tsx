import React, { useState, useEffect } from 'react';
import { 
  Mail, Lock, Eye, EyeOff, Activity, Globe, 
  Stethoscope, ShieldCheck, ChevronRight, 
  Facebook, Twitter, Instagram, HelpCircle,
  Cpu, Zap, Sparkles, Orbit, MessageCircle
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: any) => void;
  isAr: boolean;
  onToggleLang: () => void;
  settings: any;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, isAr, onToggleLang, settings }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('root');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 20, y: (e.clientY / window.innerHeight - 0.5) * 20 });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        onLogin(data.user);
      } else {
        setError(data.message || (isAr ? 'بيانات الاعتماد غير صحيحة' : 'Invalid credentials'));
      }
    } catch (err) {
      setError(isAr ? 'خطأ في الاتصال بالخادم' : 'Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  const primaryColor = settings.themeColor || '#0ea5e9';

  return (
    <div className={`min-h-screen relative flex items-center justify-center overflow-hidden font-cairo bg-[#020617]`} dir={isAr ? 'rtl' : 'ltr'}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&family=Outfit:wght@100;300;400;600;900&display=swap');
        
        :root {
          --primary-main: ${primaryColor};
          --primary-glow: ${primaryColor}30;
        }

        .premium-glass {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(40px) saturate(200%);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.5);
        }

        .floating-artifact {
          animation: float 10s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-30px) rotate(10deg); }
        }

        .shimmer-text {
            background: linear-gradient(90deg, #fff 0%, ${primaryColor} 50%, #fff 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: textShimmer 4s linear infinite;
        }

        @keyframes textShimmer {
            to { background-position: 200% center; }
        }

        .beam {
            position: absolute;
            width: 2px;
            height: 100px;
            background: linear-gradient(to top, transparent, ${primaryColor}, transparent);
            filter: blur(1px);
            animation: drop-beam 6s infinite ease-in-out;
        }

        @keyframes drop-beam {
            0% { transform: translateY(-200px); opacity: 0; }
            10% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { transform: translateY(120vh); opacity: 0; }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          15% { transform: scale(1.15); opacity: 1; }
          30% { transform: scale(1); opacity: 0.8; }
          45% { transform: scale(1.25); opacity: 1; }
        }
        .animate-heart { animation: heartbeat 2s ease-in-out infinite; }
      `}</style>

      {/* ─── DYNAMIC BACKGROUND ─── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         {/* Animated Hub Glow */}
         <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full opacity-20 blur-[150px] transition-all duration-1000"
            style={{ 
                background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
                transform: `translate(calc(-50% + ${mousePos.x}px), calc(-50% + ${mousePos.y}px))`
            }} 
         />
         
         {/* Kinetic Beams */}
         {[...Array(12)].map((_, i) => (
             <div key={i} className="beam" style={{ left: `${i * 8.5}%`, animationDelay: `${i * 0.7}s`, opacity: Math.random() }} />
         ))}

         {/* Grid Perspective */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] scale-150" />
      </div>

      {/* ─── MAIN HUB ─── */}
      <div className="relative z-10 w-full max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center py-10">
         
         {/* INFO SECTION */}
         <div className="hidden lg:block space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-2.5 shadow-xl relative group overflow-hidden">
                      <div className="absolute inset-0 bg-primary-600 scale-0 group-hover:scale-110 transition-transform duration-700"></div>
                      <img src={settings.logoUrl || "/hospital_logo.png"} className="w-full h-full object-contain relative z-10" alt="Seal" />
                   </div>
                   <div className="h-8 w-px bg-white/10" />
                   <div className="space-y-0">
                      <h3 className="text-white text-base font-black tracking-tight uppercase leading-none">{isAr ? settings.hospitalNameAr : settings.hospitalNameEn}</h3>
                      <p className="text-primary-400 text-[9px] font-black uppercase tracking-[0.3em] opacity-80">{isAr ? 'مستقبل الرعاية الصحية' : 'THE FUTURE OF HEALTHCARE'}</p>
                   </div>
                </div>

                <div className="space-y-5">
                   <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tighter text-white drop-shadow-xl">
                      {isAr ? (
                         <span className="font-cairo block">نعتني بمستقبلكم الطبي</span>
                      ) : (
                         <span className="font-outfit uppercase block">Care For Your Future</span>
                      )}
                   </h1>
                   <div className="flex items-center gap-6 pt-2">
                      <div className="h-1 w-24 bg-primary-500 rounded-full" />
                      <div className="flex items-center gap-3 animate-heart text-primary-400">
                         <Activity size={24} />
                         <span className="text-[10px] font-black uppercase tracking-[0.3em]">{isAr ? 'المركز متصل' : 'CORE ONLINE'}</span>
                      </div>
                   </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-10">
                <div className="space-y-3 group cursor-pointer">
                   <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-primary-500 group-hover:bg-primary-500/10 transition-all duration-500"><ShieldCheck className="text-primary-400" /></div>
                   <p className="text-xs font-black text-white uppercase tracking-widest">{isAr ? 'أمان فائق' : 'Cyber Security'}</p>
                   <p className="text-[10px] text-slate-500 leading-relaxed">{isAr ? 'حماية بيانات مشفرة' : 'Encrypted patient records'}</p>
                </div>
                <div className="space-y-3 group cursor-pointer">
                   <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-primary-500 group-hover:bg-primary-500/10 transition-all duration-500"><Cpu className="text-primary-400" /></div>
                   <p className="text-xs font-black text-white uppercase tracking-widest">{isAr ? 'معالجة ذكية' : 'AI Analysis'}</p>
                   <p className="text-[10px] text-slate-500 leading-relaxed">{isAr ? 'تشخيص مدعوم بالذكاء' : 'Smart clinical insights'}</p>
                </div>
                <div className="space-y-3 group cursor-pointer">
                   <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-primary-500 group-hover:bg-primary-500/10 transition-all duration-500"><Orbit className="text-primary-400" /></div>
                   <p className="text-xs font-black text-white uppercase tracking-widest">{isAr ? 'ربط موحد' : 'Seamless Hub'}</p>
                   <p className="text-[10px] text-slate-500 leading-relaxed">{isAr ? 'تكامل تام للخدمات' : 'Unified service mesh'}</p>
                </div>
            </div>
         </div>

         <div className="flex justify-center perspective-[2000px] w-full lg:w-auto">
            <div 
               className="w-full max-w-[420px] premium-glass rounded-[3rem] p-10 relative group animate-in zoom-in-95 duration-700 transition-transform duration-200"
               style={{ transform: `rotateY(${mousePos.x * 0.15}deg) rotateX(${-mousePos.y * 0.15}deg)` }}
            >
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-600/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
               
               <div className="flex justify-between items-center mb-10 relative z-10">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">{isAr ? 'النظام متاح' : 'Core Ready'}</span>
                  </div>
                  <button onClick={onToggleLang} className="text-[9px] font-black text-primary-400 hover:text-white uppercase tracking-widest transition-all glass-panel px-4 py-2 rounded-xl border border-white/5 flex items-center gap-2">
                     <Globe size={12} />
                     {isAr ? 'English' : 'تحويل للعربية'}
                  </button>
               </div>

               <div className="mb-10 relative z-10">
                  <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter mb-2 shimmer-text shadow-2xl">{isAr ? 'البطاقة الذكية' : 'Digital Hub'}</h2>
                  <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.3em]">{isAr ? 'التحقق من الهوية الرقمية' : 'IDENTITY VERIFICATION PROTOCOL'}</p>
               </div>

               <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="space-y-2.5">
                     <div className="flex justify-between px-2">
                        <label className="text-[9px] font-black text-primary-400 uppercase tracking-widest leading-none mb-1">{isAr ? 'البريد، الاسم، أو رقم الهوية' : 'Email, Name, or ID Number'}</label>
                     </div>
                     <div className="relative group/input">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-primary-400 transition-colors" size={18} />
                        <input 
                           type="text" 
                           value={username} 
                           onChange={e => setUsername(e.target.value)}
                           className="w-full pl-14 pr-6 py-4.5 bg-white/5 border border-white/10 rounded-[1.8rem] text-xs focus:bg-white/10 focus:border-primary-500/50 outline-none transition-all font-black text-white placeholder-slate-700 relative z-10"
                           placeholder={isAr ? "البريد الإلكتروني..." : "Email address..."}
                        />
                     </div>
                  </div>

                  <div className="space-y-2.5">
                     <div className="flex justify-between px-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{isAr ? 'الرمز المشفر' : 'Encrypted Vault Key'}</label>
                     </div>
                     <div className="relative group/input">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-primary-400 transition-colors" size={18} />
                        <input 
                           type={showPassword ? 'text' : 'password'} 
                           value={password} 
                           onChange={e => setPassword(e.target.value)}
                           className="w-full pl-14 pr-14 py-4.5 bg-white/5 border border-white/10 rounded-[1.8rem] text-xs focus:bg-white/10 focus:border-primary-500/50 outline-none transition-all font-black text-white placeholder-slate-700 relative z-10"
                           placeholder="••••••••"
                        />
                        <button 
                           type="button" 
                           onClick={() => setShowPassword(!showPassword)}
                           className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-all z-20"
                        >
                           {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                     </div>
                  </div>

                  {error && (
                     <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-[9px] font-black text-center uppercase tracking-widest animate-in slide-in-from-top-2">
                        {error}
                     </div>
                  )}

                  <button 
                     type="submit" 
                     disabled={isLoading}
                     className="w-full h-16 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-2xl shadow-[0_15px_30px_rgba(0,186,255,0.2)] transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-70 group overflow-hidden relative"
                  >
                     <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                     <span className="tracking-[0.2em] text-xs uppercase relative z-10">{isLoading ? (isAr ? 'جاري التحقق...' : 'Decrypting...') : (isAr ? 'تسجيل الدخول' : 'Login Now')}</span>
                     {!isLoading && <ChevronRight size={20} className={`relative z-10 transform ${isAr ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`} />}
                  </button>

                  <div className="text-center pt-6 opacity-30">
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Global Clinical Infrastructure Core v4.0</p>
                  </div>
               </form>
            </div>
         </div>
      </div>
    </div>
  );
};

import React, { FC } from 'react';
import { 
  AlertTriangle, Cpu, Monitor, Zap, Settings, HelpCircle, 
  CheckCircle2, XCircle, RefreshCcw, Layers, MousePointer2, Type
} from 'lucide-react';

interface TroubleshootPageProps {
  isAr: boolean;
}

export const TroubleshootPage: FC<TroubleshootPageProps> = ({ isAr }) => {
  const textAlign = isAr ? 'text-right' : 'text-left';

  const commonIssues = [
    {
      titleAr: 'مشكلة في كرت الشاشة (GPU)',
      titleEn: 'Graphics Card (GPU) Issues',
      icon: <Monitor className="text-blue-500" />,
      causes: [
        { ar: 'تعريف قديم أو غير متوافق', en: 'Outdated or incompatible drivers' },
        { ar: 'ضغط عالي أثناء البث', en: 'High load during streaming' },
        { ar: 'خلل في برنامج البث (مثل OBS)', en: 'OBS or streaming software glitch' }
      ]
    },
    {
      titleAr: 'مشاكل إعدادات المشهد',
      titleEn: 'Scene & Overlay Issues',
      icon: <Layers className="text-purple-500" />,
      causes: [
        { ar: 'إعدادات المشهد (Scenes) فيها تراكب عناصر فوق بعض', en: 'Overlapping scene elements' },
        { ar: 'فلتر أو Transition فيه مشكلة', en: 'Faulty filters or transitions' },
        { ar: 'ملفات Overlay أو Template تالفة', en: 'Corrupted overlay/template files' },
        { ar: 'خطوط (Fonts) غير محمّلة بشكل صحيح', en: 'Fonts not loaded correctly' }
      ]
    },
    {
      titleAr: 'مشاكل الترميز والجودة',
      titleEn: 'Encoding & Quality Issues',
      icon: <Cpu className="text-amber-500" />,
      causes: [
        { ar: 'مشكلة في الترميز (Encoding)', en: 'Encoding errors' },
        { ar: 'إعداد Bitrate أو Encoder غير مناسب', en: 'Incorrect Bitrate/Encoder settings' },
        { ar: 'تعارض بين NVENC و x264', en: 'NVENC vs x264 conflict' }
      ]
    },
    {
      titleAr: 'موارد النظام',
      titleEn: 'System Resources',
      icon: <Zap className="text-rose-500" />,
      causes: [
        { ar: 'الرام أو المعالج مضغوط أثناء التشغيل', en: 'CPU or RAM under heavy load' }
      ]
    }
  ];

  const solutions = [
    { ar: 'تحديث تعريف كرت الشاشة', en: 'Update GPU drivers' },
    { ar: 'تجربة تغيير الـ Encoder (مثلاً من NVENC إلى x264 أو العكس)', en: 'Change Encoder (e.g., NVENC to x264)' },
    { ar: 'إيقاف أي Plugins أو Overlays مؤقتًا', en: 'Temporarily disable Plugins/Overlays' },
    { ar: 'التأكد من ترتيب العناصر داخل المشهد في برنامج البث', en: 'Verify scene element order' },
    { ar: 'إعادة تشغيل البرنامج أو الجهاز', en: 'Restart software or device' },
    { ar: 'تجربة بث بدون إضافات لمعرفة السبب', en: 'Try clean stream without add-ons' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="p-4 bg-rose-50 text-rose-600 rounded-3xl shadow-inner">
               <AlertTriangle size={32} />
            </div>
            <div>
               <h1 className="text-3xl font-black text-gray-800">{isAr ? 'مركز الدعم الفني وتصحيح الأخطاء' : 'Technical Support & Troubleshooting'}</h1>
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
                 {isAr ? 'دليل شامل لحل مشاكل البث والأداء الفني' : 'Comprehensive guide for streaming and performance issues'}
               </p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Issues List */}
        <div className="lg:col-span-2 space-y-6">
           <h2 className={`text-xl font-black text-gray-800 flex items-center gap-2 ${isAr ? 'flex-row-reverse' : ''}`}>
              <HelpCircle className="text-primary-500" />
              {isAr ? 'المشاكل الشائعة وأسبابها' : 'Common Issues & Causes'}
           </h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {commonIssues.map((issue, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 bg-gray-50 rounded-xl group-hover:scale-110 transition-transform">
                         {issue.icon}
                      </div>
                      <h3 className="text-sm font-black text-gray-800">{isAr ? issue.titleAr : issue.titleEn}</h3>
                   </div>
                   <ul className={`space-y-2 ${textAlign}`}>
                      {issue.causes.map((cause, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-2 text-xs text-gray-500 font-medium">
                           <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-200 shrink-0" />
                           <span>{isAr ? cause.ar : cause.en}</span>
                        </li>
                      ))}
                   </ul>
                </div>
              ))}
           </div>
        </div>

        {/* Solutions Sidebar */}
        <div className="space-y-6">
           <h2 className={`text-xl font-black text-gray-800 flex items-center gap-2 ${isAr ? 'flex-row-reverse' : ''}`}>
              <CheckCircle2 className="text-emerald-500" />
              {isAr ? 'الحلول المقترحة' : 'Suggested Solutions'}
           </h2>
           
           <div className="bg-gradient-to-br from-gray-900 to-indigo-950 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><RefreshCcw size={80} /></div>
              <div className="relative z-10 space-y-4">
                 {solutions.map((sol, idx) => (
                   <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-black text-[10px]">
                         {idx + 1}
                      </div>
                      <p className="text-xs font-bold leading-relaxed">{isAr ? sol.ar : sol.en}</p>
                   </div>
                 ))}
                 
                 <div className="pt-4 mt-6 border-t border-white/10">
                    <button className="w-full bg-primary-600 hover:bg-primary-500 text-white font-black py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2">
                       <RefreshCcw size={16} />
                       {isAr ? 'إعادة طلب الدعم' : 'Request Extra Support'}
                    </button>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { 
  Plus, Search, DollarSign, ArrowUpCircle, ArrowDownCircle, 
  Wallet, PieChart, Activity, MoreVertical, Filter, Download, 
  TrendingUp, TrendingDown, Receipt, X, Trash2
} from 'lucide-react';

/* ───────── Types ───────── */
export interface Transaction {
  id: number;
  descriptionAr: string;
  descriptionEn: string;
  amount: number;
  type: 'income' | 'expense';
  categoryAr: string;
  categoryEn: string;
  date: string;
}

interface FinancePageProps {
  isAr: boolean;
  transactions: Transaction[];
  tx: any;
  setIsAddTransactionModalOpen: (open: boolean) => void;
  isAddTransactionModalOpen: boolean;
  newTransaction: any;
  setNewTransaction: (t: any) => void;
  handleAddTransaction: (e: React.FormEvent) => void;
  onDelete?: (id: number) => void;
}

export const FinancePage: React.FC<FinancePageProps> = ({
  isAr, transactions, tx, setIsAddTransactionModalOpen, isAddTransactionModalOpen,
  newTransaction, setNewTransaction, handleAddTransaction, onDelete
}) => {
  const textAlign = isAr ? 'text-right' : 'text-left';

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const today = new Date().toISOString().split('T')[0];
  const todayTransactions = transactions.filter(t => t.date === today);
  const todayIncome = todayTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const todayExpense = todayTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* ─────── Financial Hero Overview ─────── */}
      <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -mr-48 -mt-48" />
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -ml-48 -mb-48" />
         
         <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            <div className="space-y-4">
               <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em]">{isAr ? 'الرصيد الكلي الحالي' : 'CURRENT TOTAL BALANCE'}</p>
               <div className="flex items-baseline gap-3">
                  <h1 className="text-5xl font-black tracking-tight">{balance.toLocaleString()}</h1>
                  <span className="text-xl font-bold text-gray-400">SDG</span>
               </div>
               <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold bg-white/5 w-fit px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                  <TrendingUp size={16} />
                  <span>+24.5% {isAr ? 'هذا الشهر' : 'this month'}</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-8 md:col-span-2">
               <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl"><ArrowUpCircle size={24} /></div>
                     <span className="text-xs font-black text-gray-400 uppercase tracking-wider">{isAr ? 'إجمالي الدخل' : 'Total Income'}</span>
                  </div>
                  <p className="text-2xl font-black">{totalIncome.toLocaleString()} <span className="text-[10px] text-gray-400">SDG</span></p>
               </div>
               <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl"><ArrowDownCircle size={24} /></div>
                     <span className="text-xs font-black text-gray-400 uppercase tracking-wider">{isAr ? 'إجمالي المصروفات' : 'Total Expenses'}</span>
                  </div>
                  <p className="text-2xl font-black">{totalExpense.toLocaleString()} <span className="text-[10px] text-gray-400">SDG</span></p>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* ─────── Recent Transactions ─────── */}
         <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
               <div>
                  <h2 className="text-lg font-black text-gray-800">{isAr ? 'آخر العمليات المالية' : 'Recent Transactions'}</h2>
                  <p className="text-xs text-gray-400 font-bold">{isAr ? 'سجل العمليات اليومية' : 'Daily activity log'}</p>
               </div>
               <button onClick={() => setIsAddTransactionModalOpen(true)} className="p-2.5 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all cursor-pointer">
                  <Plus size={20} />
               </button>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full">
                  <tbody className="divide-y divide-gray-50">
                     {transactions.map((t) => (
                        <tr key={t.id} className="hover:bg-gray-50/50 transition-all group">
                           <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                 <div className={`p-3 rounded-2xl ${t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} transition-transform group-hover:scale-110 shadow-sm border ${t.type === 'income' ? 'border-emerald-100' : 'border-rose-100'}`}>
                                    {t.type === 'income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                                 </div>
                                 <div className="text-right">
                                    <p className="text-sm font-bold text-gray-800">{isAr ? t.descriptionAr : t.descriptionEn}</p>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">{isAr ? t.categoryAr : t.categoryEn}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-5 text-center text-xs text-gray-400 font-bold">{t.date}</td>
                           <td className={`px-8 py-5 text-right font-black ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()}
                           </td>
                           <td className="px-6 py-5">
                              <button onClick={() => onDelete?.(t.id)} className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                                <Trash2 size={16} />
                              </button>
                           </td>
                        </tr>
                     ))}
                     {transactions.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-8 py-20 text-center text-gray-300 font-black uppercase tracking-widest text-xs">{isAr ? 'لا توجد عمليات مالية' : 'No transactions recorded'}</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         {/* ─────── Quick Analytics ─────── */}
         <div className="space-y-6">
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">{isAr ? 'ملخص اليوم' : 'Today Summary'}</h3>
                  <Activity size={20} className="text-primary-500" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">{isAr ? 'دخل اليوم' : 'Today Income'}</p>
                    <p className="text-lg font-black text-emerald-700">{todayIncome.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                    <p className="text-[10px] font-black text-rose-600 uppercase mb-1">{isAr ? 'صرف اليوم' : 'Today Expense'}</p>
                    <p className="text-lg font-black text-rose-700">{todayExpense.toLocaleString()}</p>
                  </div>
               </div>
            </div>
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
               <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">{isAr ? 'أداء الأسبوع' : 'Weekly Performance'}</h3>
                     <TrendingUp size={20} className="text-emerald-500" />
                  </div>
                  <div className="flex items-end justify-between gap-2 h-32 pt-4">
                     {[45, 78, 52, 90, 65, 85, 40].map((h, i) => (
                        <div key={i} className="flex-1 bg-gray-50 rounded-full h-full relative group/bar">
                           <div 
                              className="absolute bottom-0 left-0 right-0 bg-primary-500 rounded-full transition-all duration-1000 delay-300 group-hover/bar:bg-primary-600 cursor-pointer" 
                              style={{ height: `${h}%` }}
                           >
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                                 {h}%
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
                  <div className="flex justify-between mt-4 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                     <span>{isAr ? 'السبت' : 'Sat'}</span>
                     <span>{isAr ? 'الجمعة' : 'Fri'}</span>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">{isAr ? 'توزيع النفقات' : 'Expense Allocation'}</h3>
                  <PieChart size={20} className="text-gray-300" />
               </div>
               <div className="space-y-6">
                  {(() => {
                     const expenses = transactions.filter(t => t.type === 'expense');
                     const totalExp = expenses.reduce((acc, curr) => acc + curr.amount, 0);
                     const groups = expenses.reduce((acc: any, curr) => {
                        const cat = isAr ? curr.categoryAr : (curr.categoryEn || curr.categoryAr);
                        acc[cat] = (acc[cat] || 0) + curr.amount;
                        return acc;
                     }, {});
                     
                     const items = Object.entries(groups).map(([label, val]: [string, any]) => ({
                        label,
                        val: totalExp > 0 ? Math.round((val / totalExp) * 100) : 0,
                        color: 'bg-indigo-500' // Generic color for now or map categories
                     }));

                     return items.sort((a,b) => b.val - a.val).slice(0, 5).map(item => (
                        <div key={item.label} className="space-y-2">
                           <div className="flex justify-between text-xs font-bold text-gray-600">
                              <span>{item.label}</span>
                              <span>{item.val}%</span>
                           </div>
                           <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                              <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.val}%` }} />
                           </div>
                        </div>
                     ));
                  })()}
               </div>
            </div>
            <div className="bg-primary-600 rounded-[2rem] p-8 text-white shadow-xl shadow-primary-100 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
               <Receipt size={32} className="mb-4 opacity-50" />
               <h3 className="text-lg font-black mb-2">{isAr ? 'التقارير المالية' : 'Financial Reports'}</h3>
               <p className="text-xs text-white/60 font-medium mb-6 leading-relaxed">{isAr ? 'قم بتحميل ملفات الإدارة المالية التفصيلية بضغطة واحدة.' : 'Download detailed financial reports with one click.'}</p>
               <button className="w-full py-4 bg-white text-primary-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-lg active:scale-95 shadow-primary-700/20">{isAr ? 'تحميل التقارير' : 'Download PDF'}</button>
            </div>
         </div>
      </div>

      {isAddTransactionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="p-4 bg-primary-50 text-primary-600 rounded-3xl"><Wallet size={28} /></div>
                 <div>
                    <h3 className="text-2xl font-black text-gray-800">{isAr ? 'عملية مالية جديدة' : 'New Transaction'}</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{isAr ? 'إضافة دخل أو مصروف' : 'Add income or expense'}</p>
                 </div>
              </div>
              <button onClick={() => setIsAddTransactionModalOpen(false)} className="p-3 hover:bg-gray-50 rounded-full transition-all text-gray-300 hover:text-gray-600"><X size={28} /></button>
            </div>
            <form onSubmit={handleAddTransaction} className="p-12 space-y-8 text-right">
              <div className="grid grid-cols-2 gap-8">
                 <div className="col-span-2">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">{isAr ? 'وصف العملية' : 'Description'}</label>
                    <input required type="text" value={newTransaction.descriptionAr} onChange={e => setNewTransaction({...newTransaction, descriptionAr: e.target.value})} className="w-full border-2 border-gray-100 rounded-3xl px-8 py-5 text-sm font-bold focus:ring-8 focus:ring-primary-50 focus:border-primary-400 outline-none transition-all" placeholder={isAr ? "مثال: شراء معدات طبية" : "e.g. Purchase of medical gear"} />
                 </div>
                 <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">{isAr ? 'نوع العملية' : 'Type'}</label>
                    <select value={newTransaction.type} onChange={e => setNewTransaction({...newTransaction, type: e.target.value})} className="w-full appearance-none border-2 border-gray-100 rounded-3xl px-8 py-5 text-sm font-bold focus:ring-8 focus:ring-primary-50 focus:border-primary-400 outline-none cursor-pointer">
                       <option value="income">{isAr ? 'دخل (+)' : 'Income (+)'}</option>
                       <option value="expense">{isAr ? 'مصروف (-)' : 'Expense (-)'}</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">{isAr ? 'التصنيف' : 'Category'}</label>
                    <select value={newTransaction.categoryAr} onChange={e => setNewTransaction({...newTransaction, categoryAr: e.target.value})} className="w-full appearance-none border-2 border-gray-100 rounded-3xl px-8 py-5 text-sm font-bold focus:ring-8 focus:ring-primary-50 focus:border-primary-400 outline-none cursor-pointer">
                       <option value="عام">{isAr ? 'عام' : 'General'}</option>
                       <option value="رواتب">{isAr ? 'رواتب' : 'Salaries'}</option>
                       <option value="أدوية">{isAr ? 'أدوية' : 'Medicines'}</option>
                       <option value="صيانة">{isAr ? 'صيانة' : 'Maintenance'}</option>
                       <option value="فواتير">{isAr ? 'فواتير' : 'Invoices'}</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">{isAr ? 'المبلغ (SDG)' : 'Amount'}</label>
                    <input required type="number" value={newTransaction.amount} onChange={e => setNewTransaction({...newTransaction, amount: e.target.value})} className="w-full border-2 border-gray-100 rounded-3xl px-8 py-5 text-sm font-bold focus:ring-8 focus:ring-primary-50 focus:border-primary-400 outline-none text-left" dir="ltr" />
                 </div>
                 <div className="col-span-2">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">{isAr ? 'التاريخ' : 'Date'}</label>
                    <input type="date" value={newTransaction.date} onChange={e => setNewTransaction({...newTransaction, date: e.target.value})} className="w-full border-2 border-gray-100 rounded-3xl px-8 py-5 text-sm font-bold focus:ring-8 focus:ring-primary-50 focus:border-primary-400 outline-none" />
                 </div>
              </div>
              <div className="flex items-center justify-end gap-6 pt-10">
                <button type="button" onClick={() => setIsAddTransactionModalOpen(false)} className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest">{isAr ? 'تراجع' : 'Discard'}</button>
                <button type="submit" className="px-16 py-5 text-sm font-black text-white bg-primary-600 rounded-3xl hover:shadow-2xl hover:shadow-primary-100 hover:-translate-y-1 transition-all shadow-xl">
                   {isAr ? 'تسجيل العملية' : 'Process Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

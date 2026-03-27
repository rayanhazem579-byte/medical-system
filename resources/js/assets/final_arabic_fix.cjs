const fs = require('fs');
const path = 'c:\\xampp\\htdocs\\my-first-app\\backend\\resources\js\\assets\\ReceptionPage.tsx';

let content = fs.readFileSync(path, 'utf8');

// 1. Fix the days array
content = content.replace(/\{ en: 'Sunday', ar: '[^']+' \}/g, "{ en: 'Sunday', ar: 'الأحد' }");
content = content.replace(/\{ en: 'Monday', ar: '[^']+' \}/g, "{ en: 'Monday', ar: 'الاثنين' }");
content = content.replace(/\{ en: 'Tuesday', ar: '[^']+' \}/g, "{ en: 'Tuesday', ar: 'الثلاثاء' }");
content = content.replace(/\{ en: 'Wednesday', ar: '[^']+' \}/g, "{ en: 'Wednesday', ar: 'الأربعاء' }");
content = content.replace(/\{ en: 'Thursday', ar: '[^']+' \}/g, "{ en: 'Thursday', ar: 'الخميس' }");
content = content.replace(/\{ en: 'Friday', ar: '[^']+' \}/g, "{ en: 'Friday', ar: 'الجمعة' }");
content = content.replace(/\{ en: 'Saturday', ar: '[^']+' \}/g, "{ en: 'Saturday', ar: 'السبت' }");

// 2. Fix metrics labels
content = content.replace(/'Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù…Ø±Ø¶Ù‰'/g, "'إجمالي المرضى'");
content = content.replace(/'Ù‚ÙŠØ¯ Ø§Ù„انتظار'/g, "'قيد الانتظار'");
content = content.replace(/'Ù…Ø¹Ø§ÙŠÙ†Ø© Ø§Ù„ÙŠÙˆÙ…'/g, "'معاينة اليوم'");
content = content.replace(/'Ø¥ÙŠØ±Ø§Ø¯Ø§Øª Ø§Ù„ÙŠÙˆÙ…'/g, "'إيرادات اليوم'");

// 3. Fix main title and subtitle
content = content.replace(/'Ø§Ù„Ø§Ø³ØªÙ‚Ø¨Ø§Ù„ ÙˆØ¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹ÙŠÙ†'/g, "'الاستقبال وإدارة المراجعين'");
content = content.replace(/'Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù…ÙˆØ§Ø¹ÙŠØ¯ ÙˆØ§Ù„Ø£Ø³Ø¹Ø§Ø± ÙˆØ§Ù„Ù…Ù„Ù Ø§Øª Ø§Ù„Ø·Ø¨ÙŠØ©'/g, "'إدارة المواعيد والأسعار والملفات الطبية'");

// 4. Fix Tab names
content = content.replace(/t === 'waiting' \? 'Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø§Øª' : t === 'all' \? 'Ø§Ù„Ù…Ø±Ø¶Ù‰' : 'Ø§Ù„Ø£Ø³Ø¹Ø§Ø±'/g, "t === 'waiting' ? 'المراجعات' : t === 'all' ? 'المرضى' : 'الأسعار'");
content = content.replace(/'Ø¨Ø­Ø« Ø¹Ù† Ù…Ø±ÙŠØ¶...'/g, "'بحث عن مريض...'");

// 5. Force Arabic default
content = content.replace(/const \[isArLocal, setIsArLocal\] = useState\(isAr\);/g, "const [isArLocal, setIsArLocal] = useState(true);");

// 6. Set default pricing sub-tab to 'roster'
content = content.replace(/useState<'roster' \| 'prices'>\('prices'\)/g, "useState<'roster' | 'prices'>('roster')");

// 7. Fix patient flow labels in Queue Management
content = content.replace(/'Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø·Ø§Ø¨ÙˆØ±'/g, "'إدارة الطابور'");
content = content.replace(/sub === 'waiting' \? 'Ø§Ù†ØªØ¸Ø§Ø±' : sub === 'in-consult' \? 'Ù…Ø¹ Ø§Ù„Ø·Ø¨ÙŠØ¨' : 'Ù…ÙƒØªÙ…Ù„'/g, "sub === 'waiting' ? 'انتظار' : sub === 'in-consult' ? 'مع الطبيب' : 'مكتمل'");
content = content.replace(/'Ø§Ù„Ø·Ø¨ÙŠØ¨'/g, "'الطبيب'");
content = content.replace(/'Ø§Ù„Ø­Ø§Ù„Ø©'/g, "'الحالة'");
content = content.replace(/'Ù…Ø¹Ø§ÙŠÙ†Ø©'/g, "'معاينة'");
content = content.replace(/'Ø°Ø®ÙˆÙ„'/g, "'دخول'");

// 8. Fix Patient Records section
content = content.replace(/'Ù‚Ø§Ø¹Ø¯Ø© Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù…Ø±Ø¶Ù‰'/g, "'قاعدة بيانات المرضى'");
content = content.replace(/'Ø­Ø¬Ø² Ù…ÙˆØ¹Ø¯'/g, "'حجز موعد'");
content = content.replace(/'ØªØ³Ø¬ÙŠÙ„ Ù…Ø±ÙŠØ¶'/g, "'تسجيل مريض'");
content = content.replace(/'Ø§Ù„Ù…Ø±ÙŠØ¶'/g, "'المريض'");
content = content.replace(/'Ø§Ù„Ù‡Ø§ØªÙ '/g, "'الهاتف'");
content = content.replace(/'Ø¥Ø¬Ø±Ø§Ø¡Ø§Øª'/g, "'إجراءات'");
content = content.replace(/'Ø¢Ø®Ø± Ø²ÙŠØ§Ø±Ø©: '/g, "'آخر زيارة: '");

// 9. Fix Modals labels
content = content.replace(/'ØªØ¹Ø¯ÙŠÙ„ Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø·Ø¨ÙŠØ©'/g, "'تعديل البيانات الطبية'");
content = content.replace(/'Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø´Ø®ØµÙŠØ©'/g, "'البيانات الشخصية'");
content = content.replace(/'Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ø§ØªØµØ§Ù„'/g, "'معلومات الاتصال'");
content = content.replace(/'Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø­Ø¬Ø²'/g, "'بيانات الحجز'");
content = content.replace(/'Ø§Ù„Ø§Ø³Ù… \(Ø¹\)'/g, "'الاسم (ع)'");
content = content.replace(/'ØªØ§Ø±ÙŠØ® Ø§Ù„Ù…ÙŠÙ„Ø§Ø¯'/g, "'تاريخ الميلاد'");
content = content.replace(/'Ø°ÙƒØ±'/g, "'ذكر'");
content = content.replace(/'Ø£Ù†Ø«Ù‰'/g, "'أنثى'");
content = content.replace(/'Ø§Ù„Ø³Ø§Ø¨Ù‚'/g, "'السابق'");
content = content.replace(/'Ø§Ù„ØªØ§Ù„ÙŠ'/g, "'التالي'");
content = content.replace(/'Ø­Ù Ø¸ Ø§Ù„ØªØ¹Ø¯ÙŠÙ„Ø§Øª'/g, "'حفظ التعديلات'");

fs.writeFileSync(path, content, 'utf8');
console.log('Arabic cleanup and defaults updated successfully.');

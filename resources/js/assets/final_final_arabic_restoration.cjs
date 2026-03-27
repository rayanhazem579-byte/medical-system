const fs = require('fs');
const path = 'c:/xampp/htdocs/my-first-app/backend/resources/js/assets/ReceptionPage.tsx';

let content = fs.readFileSync(path, 'utf8');

// Title section
content = content.replace(/'Ø¥Ø¯Ø§Ø±Ø© المواعيد Ùˆالأسعار ÙˆØ§Ù„Ù…Ù„Ù Ø§Øª Ø§Ù„Ø·Ø¨ÙŠØ©'/g, "'إدارة المواعيد والأسعار والملفات الطبية'");
content = content.replace(/'معاينة Ø§Ù„ÙŠÙˆÙ…'/g, "'معاينة اليوم'");

// Queue Management
content = content.replace(/'Ø§Ù„Ø·Ø¨ÙŠØ¨'/g, "'الطبيب'");
content = content.replace(/'Ø§Ù„Ø­Ø§Ù„Ø©'/g, "'الحالة'");
content = content.replace(/'Ù…Ø¹Ø§ÙŠÙ†Ø©'/g, "'معاينة'");
content = content.replace(/'Ø¯Ø®ÙˆÙ„'/g, "'دخول'");

// Patient Records
content = content.replace(/'Ø§Ù„Ù…Ø±ÙŠØ¶'/g, "'المريض'");
content = content.replace(/'Ø§Ù„Ù‡Ø§ØªÙ '/g, "'الهاتف'");
content = content.replace(/'Ø¢Ø®Ø± Ø²ÙŠØ§Ø±Ø©: '/g, "'آخر زيارة: '");

// Modals
content = content.replace(/'ØªØ¹Ø¯ÙŠÙ„ Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø·Ø¨ÙŠØ¨'/g, "'تعديل بيانات الطبيب'");
content = content.replace(/'Ø§Ù„Ø§Ø³Ù… \(En\)'/g, "'الاسم (En)'");
content = content.replace(/'Ø§Ù„Ù…ÙˆØ§Ø¹ÙŠØ¯'/g, "'المواعيد'");
content = content.replace(/'ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª'/g, "'تعديل البيانات'");
content = content.replace(/'Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ '/g, "'رقم الهاتف'");
content = content.replace(/'Ù ØµÙŠÙ„Ø© Ø§Ù„Ø¯Ù…'/g, "'فصيلة الدم'");
content = content.replace(/'Ø§Ù„Ø£Ù…Ø±Ø§Ø¶ Ø§Ù„Ù…Ø²Ù…Ù†Ø©'/g, "'الأمراض المزمنة'");
content = content.replace(/'ÙƒØ´Ù '/g, "'كشف'");
content = content.replace(/'Ø§Ù„Ù…ÙˆØ¹Ø¯ \(Ù ØªØ±Ø© Ø§Ù„Ø¹Ù…Ù„\)'/g, "'الموعد (فترة العمل)'");
content = content.replace(/'Ø­Ù Ø¸ Ø§Ù„ØªØ¹Ø¯ÙŠÙ„Ø§Øª'/g, "'حفظ التعديلات'");
content = content.replace(/'Ø¥Ø¶Ø§Ù Ø© Ø®Ø¯Ù…Ø© Ø¬Ø¯ÙŠØ¯Ø©'/g, "'إضافة خدمة جديدة'");
content = content.replace(/'Ø§Ø³Ù… Ø§Ù„Ø®Ø¯Ù…Ø©...'/g, "'اسم الخدمة...'");
content = content.replace(/'ØªØ³Ø¬ÙŠÙ„ Ù…Ø±ÙŠØ¶'/g, "'تسجيل مريض'");
content = content.replace(/'Ù…Ù„Ù  Ø¬Ø¯ÙŠØ¯'/g, "'ملف جديد'");
content = content.replace(/'Ø§Ù„ÙƒÙ„'/g, "'الكل'");
content = content.replace(/'Ù„Ø­Ù Ø¸ Ø§Ù„Ù†Ù‡Ø§Ø¦ÙŠ'/g, "'للحفظ النهائي'");
content = content.replace(/'ØªÙ… ØªØ¹ÙŠÙŠÙ† Ø±Ù‚Ù… Ù…Ù„Ù  Ø·Ø¨ÙŠ Ø¬Ø¯ÙŠØ¯ Ù„Ù„Ù…Ø±ÙŠØ¶'/g, "'تم تعيين رقم ملف طبي جديد للمريض'");
content = content.replace(/'Ø§Ù„Ø¨Ø­Ø« Ø¨Ø§Ù„Ø±Ù‚Ù… Ø§Ù„Ø·Ø¨ÙŠ Ø£Ùˆ Ø§Ù„Ø§Ø³Ù…'/g, "'البحث بالرقم الطبي أو الاسم'");
content = content.replace(/'Ø­Ø¬Ø² Ù…ÙˆØ¹Ø¯ Ù Ù Ø­Øµ'/g, "'حجز موعد فحص'");
content = content.replace(/'Ø§Ù„Ø¨Ø­Ø« Ø¨Ø§Ù„Ø±Ù‚Ù…'/g, "'البحث بالرقم'");

fs.writeFileSync(path, content, 'utf8');
console.log('Final Final Restoration Successful.');

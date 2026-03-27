const fs = require('fs');
const f = 'c:\\xampp\\htdocs\\my-first-app\\backend\\resources\\js\\assets\\ReceptionPage.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
lines[706] = "                                   {isAr ? (p.status === 'waiting' ? 'في الانتظار' : p.status === 'in-consult' ? 'عند الطبيب' : 'مكتمل') : p.status}";
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('Fixed 707');

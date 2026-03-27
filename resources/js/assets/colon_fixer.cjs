const fs = require('fs');
const f = 'c:\\xampp\\htdocs\\my-first-app\\backend\\resources\\js\\assets\\ReceptionPage.tsx';
let c = fs.readFileSync(f, 'utf8');

// Fix missing colons between quotes in isAr ternaries
c = c.replace(/\{isAr \? '([^']+)'\s*'([^']+)'\}/g, "{isAr ? '$1' : '$2'}");
c = c.replace(/\{modalIsAr \? '([^']+)'\s*'([^']+)'\}/g, "{modalIsAr ? '$1' : '$2'}");

// Additional fix for the nested ternary at 707 if needed
c = c.replace(/p\.status === 'in-consult' \? '([^']+)'\s*'([^']+)'\)/g, "p.status === 'in-consult' ? '$1' : '$2')");

fs.writeFileSync(f, c, 'utf8');
console.log('Colons restored.');

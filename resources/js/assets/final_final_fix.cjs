const fs = require('fs');
const f = 'c:\\xampp\\htdocs\\my-first-app\\backend\\resources\\js\\assets\\ReceptionPage.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace(/'Current Status'\}\/\}/g, "'Current Status'}");
fs.writeFileSync(f, c, 'utf8');
console.log('Fixed final slash.');

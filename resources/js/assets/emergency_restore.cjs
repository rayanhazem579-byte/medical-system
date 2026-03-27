const fs = require('fs');
const path = 'c:/xampp/htdocs/my-first-app/backend/resources/js/assets/raw_reception.txt';
const target = 'c:/xampp/htdocs/my-first-app/backend/resources/js/assets/ReceptionPage.tsx';

try {
    const buffer = fs.readFileSync(path);
    // Convert from UTF-16LE to UTF-8 string
    const content = buffer.toString('utf16le');
    
    if (content.length > 50000) {
        fs.writeFileSync(target, content, 'utf8');
        console.log('RECOVERY SUCCESS: ReceptionPage.tsx restored from raw_reception.txt (' + content.length + ' chars)');
    } else {
        console.error('RECOVERY FAILED: Content too small (' + content.length + ')');
    }
} catch (e) {
    console.error('RECOVERY ERROR: ' + e.message);
}

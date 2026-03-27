const fs = require('fs');
const path = require('path');

function fixMojibake(text) {
    const cp1252Map = {
        0x20AC: 0x80, 0x201A: 0x82, 0x0192: 0x83, 0x201E: 0x84, 0x2026: 0x85,
        0x2020: 0x86, 0x2021: 0x87, 0x02C6: 0x88, 0x2030: 0x89, 0x0160: 0x8A,
        0x2039: 0x8B, 0x0152: 0x8C, 0x017D: 0x8E, 0x2118: 0x90, 0x2018: 0x91,
        0x2019: 0x92, 0x201C: 0x93, 0x201D: 0x94, 0x2022: 0x95, 0x2013: 0x96,
        0x2014: 0x97, 0x02DC: 0x98, 0x2122: 0x99, 0x0161: 0x9A, 0x203A: 0x9B,
        0x0153: 0x9C, 0x017E: 0x9E, 0x0178: 0x9F
    };

    let bytes = [];
    for (let i = 0; i < text.length; i++) {
        let code = text.charCodeAt(i);
        if (cp1252Map[code]) {
            bytes.push(cp1252Map[code]);
        } else if (code < 256) {
            bytes.push(code);
        } else {
            // Already high Unicode, encode to UTF-8 bytes to preserve it
            let buf = Buffer.from(text[i], 'utf8');
            for (let b of buf) bytes.push(b);
        }
    }
    return Buffer.from(bytes).toString('utf8');
}

const inputPath = 'c:\\xampp\\htdocs\\my-first-app\\backend\\resources\\js\\assets\\raw_utf8.txt';
const outputPath = 'c:\\xampp\\htdocs\\my-first-app\\backend\\resources\\js\\assets\\ReceptionPage.tsx';

if (fs.existsSync(inputPath)) {
    const input = fs.readFileSync(inputPath, 'utf8');
    const fixed = fixMojibake(input);
    fs.writeFileSync(outputPath, fixed);
    console.log('Successfully fixed ReceptionPage.tsx using raw_utf8.txt as source.');
} else {
    console.error('Source file not found!');
}

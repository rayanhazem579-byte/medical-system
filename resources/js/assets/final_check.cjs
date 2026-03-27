const fs = require('fs');

const content = fs.readFileSync('c:\\xampp\\htdocs\\my-first-app\\backend\\resources\\js\\assets\\ReceptionPage.tsx', 'utf8');

function countTags(text) {
    let divCount = 0;
    let braceCount = 0;
    let parenCount = 0;
    
    // Simple but effective counter
    for (let i = 0; i < text.length; i++) {
        if (text.substr(i, 4) === '<div') divCount++;
        if (text.substr(i, 6) === '</div>') divCount--;
        if (text[i] === '{') braceCount++;
        if (text[i] === '}') braceCount--;
        if (text[i] === '(') parenCount++;
        if (text[i] === ')') parenCount--;
    }
    
    console.log(`Balance Report:`);
    console.log(`Divs: ${divCount} ${divCount === 0 ? '(OK)' : '(FAIL)'}`);
    console.log(`Braces: ${braceCount} ${braceCount === 0 ? '(OK)' : '(FAIL)'}`);
    console.log(`Parens: ${parenCount} ${parenCount === 0 ? '(OK)' : '(FAIL)'}`);
}

countTags(content);

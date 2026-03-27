const fs = require('fs');

const content = fs.readFileSync('c:\\xampp\\htdocs\\my-first-app\\backend\\resources\\js\\assets\\ReceptionPage.tsx', 'utf8');

function checkBalance(text) {
    let stack = [];
    let regex = /<(\/?)(div|span|h[1-6]|p|table|thead|tbody|tr|th|td|button|select|option|input|textarea|h2|h3|h4|h5|h6|Activity|Plus|DollarSign|Clock|Users|CheckCircle2|CreditCard|Search|User|Mail|MapPin|Hash|Shield|Baby|LifeBuoy|Scissors|EyeOff|Filter|Download|Check|XCircle|History|Globe|Languages|Database|X|Phone|ArrowLeft|Sun|Moon|Stethoscope|Ambulance|Eye|Edit3|Trash2|Calendar|ChevronRight|MoreVertical|UserPlus|AlertCircle|Activity|Heart)(?:\s+[^>]*?)?(\/?)>/g;
    
    let match;
    while ((match = regex.exec(text)) !== null) {
        let isClosing = match[1] === '/';
        let tagName = match[2];
        let selfClosing = match[3] === '/';
        
        if (selfClosing) continue;
        
        if (isClosing) {
            if (stack.length === 0) {
                console.log(`Extra closing tag </${tagName}> at index ${match.index}`);
            } else {
                let last = stack.pop();
                if (last.name !== tagName) {
                    console.log(`Mismatched tag: expected </${last.name}> but found </${tagName}> at index ${match.index} (opened at ${last.index})`);
                }
            }
        } else {
            stack.push({name: tagName, index: match.index});
        }
    }
    
    while (stack.length > 0) {
        let last = stack.pop();
        console.log(`Unclosed tag <${last.name}> at index ${last.index}`);
    }
}

checkBalance(content);

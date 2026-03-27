const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'resources', 'js', 'assets', 'ReceptionPage.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update text
content = content.replace(
    "'إدارة المواعيد والأسعار والملفات الطبية' : 'Manage Appointments, Pricing & Medical Records'",
    "'إدارة المواعيد والملفات الطبية' : 'Manage Appointments & Medical Records'"
);

// 2. Remove 'pricing' from tabs array
content = content.replace(
    "{['waiting', 'all', 'pricing'].map(t => (",
    "{['waiting', 'all'].map(t => ("
);

content = content.replace(
    "isArLocal ? (t === 'waiting' ? 'المراجعات' : t === 'all' ? 'المرضى' : 'الأسعار') : t.toUpperCase()",
    "isArLocal ? (t === 'waiting' ? 'المراجعات' : 'المرضى') : t.toUpperCase()"
);

// 3. Remove the block: {activeTab === 'pricing' ? (...) : activeTab === 'waiting' ? (
const startMatch = "     {activeTab === 'pricing' ? (";
const endMatch = "          ) : activeTab === 'waiting' ? (";

const startIndex = content.indexOf(startMatch);
const endIndex = content.indexOf(endMatch);

if (startIndex !== -1 && endIndex !== -1) {
    const stringToRemove = content.substring(startIndex, endIndex);
    content = content.replace(stringToRemove + "          ) : activeTab === 'waiting' ? (", "     {activeTab === 'waiting' ? (");
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Removed pricing tab successful!');

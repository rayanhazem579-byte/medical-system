const fs = require('fs');
const path = 'c:\\xampp\\htdocs\\my-first-app\\backend\\resources\\js\\assets\\ReceptionPage.tsx';

let text = fs.readFileSync(path, 'utf8');

// The replacement logic is to restore the missing conditional expression
// and ensure the correct number of closing tags are present for the Pricing tab.

// Find the end of the services table and the beginning of the waiting tab
const marker = /<\/tbody>\s+<\/table>\s+<\/div>\s+<\/div>\s+<\/div>\s+<div className="space-y-8 animate-in fade-in duration-500">/;

if (marker.test(text)) {
    const replacement = `</tbody>
                        </table>
                     </div>
                  </div>
               </div>
             ) : activeTab === 'waiting' ? (
                <div className="space-y-8 animate-in fade-in duration-500">`;
    text = text.replace(marker, replacement);
    fs.writeFileSync(path, text);
    console.log('Successfully restored tab conditions and balanced tags.');
} else {
    // If exact regex fails, try a slightly looser one
    const looserMarker = /<\/tbody>\s+<\/table>(?:\s+<\/div>){3}\s+<div className="space-y-8 animate-in fade-in duration-500">/;
    if (looserMarker.test(text)) {
        const replacement = `</tbody>
                        </table>
                     </div>
                  </div>
               </div>
             ) : activeTab === 'waiting' ? (
                <div className="space-y-8 animate-in fade-in duration-500">`;
        text = text.replace(looserMarker, replacement);
        fs.writeFileSync(path, text);
        console.log('Successfully restored tab conditions (loose match).');
    } else {
        console.error('Could not find the target corrupted section to fix.');
    }
}

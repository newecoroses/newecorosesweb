const fs = require('fs');
const path = 'c:/Users/thene/newecorosesweb/app/admin/page.tsx';
let c = fs.readFileSync(path, 'utf8');

// Replace all 7 demo chart rows with zeros
// Pattern: }) : [ ... { label: 'Sun'...}, \n    ];
const oldPattern = /\}\) : \[\s*[\s\S]*?\{ label: 'Sun'[^\n]*\},?\s*\];/;
const newBlock = `]) : [
        { label: 'Mon', revenue: 0, orders: 0, enquiries: 0, clicks: 0 },
        { label: 'Tue', revenue: 0, orders: 0, enquiries: 0, clicks: 0 },
        { label: 'Wed', revenue: 0, orders: 0, enquiries: 0, clicks: 0 },
        { label: 'Thu', revenue: 0, orders: 0, enquiries: 0, clicks: 0 },
        { label: 'Fri', revenue: 0, orders: 0, enquiries: 0, clicks: 0 },
        { label: 'Sat', revenue: 0, orders: 0, enquiries: 0, clicks: 0 },
        { label: 'Sun', revenue: 0, orders: 0, enquiries: 0, clicks: 0 },
    ];`;

const updated = c.replace(oldPattern, newBlock);
if (updated === c) {
    console.log('NO MATCH');
} else {
    fs.writeFileSync(path, updated, 'utf8');
    console.log('Done - replaced demo chart rows with zeros');
}

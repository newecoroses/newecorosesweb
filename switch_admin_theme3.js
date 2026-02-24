const fs = require('fs');
const path = require('path');

const targetDirs = [
    path.join(__dirname, 'app', 'admin'),
    path.join(__dirname, 'components', 'admin')
];

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // Fix broken background highlights from previous script
            content = content.replace(/bg-zinc-100 text-zinc-900\/10 border border-zinc-100\/20/g, 'bg-zinc-800/50 border border-zinc-700/50');
            content = content.replace(/hover:bg-zinc-100 text-zinc-900\/5/g, 'hover:bg-zinc-800');
            content = content.replace(/bg-zinc-100 text-zinc-900\/5/g, 'bg-zinc-800/50');
            content = content.replace(/bg-zinc-100 text-zinc-900\/10 text-zinc-100/g, 'bg-zinc-800 text-zinc-300 border border-zinc-700');
            content = content.replace(/bg-zinc-100 text-zinc-900\/10/g, 'bg-zinc-800/80');
            content = content.replace(/text-zinc-100 text-gray-900/g, 'text-gray-900');
            content = content.replace(/bg-zinc-100 text-zinc-900 text-gray-900/g, 'bg-zinc-100 text-gray-900');

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Fixed:', fullPath);
            }
        }
    }
}

targetDirs.forEach(processDir);
console.log('Theme repair round 3 complete.');

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

            // Catch the rest
            content = content.replace(/accent-yellow-500/g, 'accent-zinc-400');
            content = content.replace(/fill-yellow-400/g, 'fill-zinc-300');
            content = content.replace(/text-yellow-300/g, 'text-zinc-300');
            content = content.replace(/bg-yellow-100/g, 'bg-zinc-200');
            content = content.replace(/text-yellow-700/g, 'text-zinc-700');
            content = content.replace(/text-zinc-100\/80/g, 'text-zinc-300/80');

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated:', fullPath);
            }
        }
    }
}

targetDirs.forEach(processDir);
console.log('Theme conversion round 2 complete.');

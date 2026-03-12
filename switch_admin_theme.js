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

            // Map yellow utility classes to zinc/charcoal dark-mode ones
            // Action Buttons
            content = content.replace(/bg-yellow-500 hover:bg-yellow-400 text-gray-900/g, 'bg-zinc-100 hover:bg-white text-zinc-900');
            content = content.replace(/bg-yellow-400/g, 'bg-zinc-200');
            content = content.replace(/bg-yellow-500/g, 'bg-zinc-100 text-zinc-900');
            content = content.replace(/bg-yellow-600/g, 'bg-zinc-300');

            // Text Accents
            content = content.replace(/text-yellow-400/g, 'text-zinc-100');
            content = content.replace(/text-yellow-500/g, 'text-zinc-300');

            // Gradients
            content = content.replace(/from-yellow-400 to-yellow-600/g, 'from-zinc-200 to-zinc-400 text-zinc-900');
            content = content.replace(/from-yellow-500 to-yellow-600/g, 'from-zinc-200 to-zinc-400 text-zinc-900');
            content = content.replace(/hover:from-yellow-400 hover:to-yellow-500/g, 'hover:from-white hover:to-zinc-200');
            content = content.replace(/from-yellow-400 to-orange-500/g, 'from-zinc-500 to-zinc-700');

            // Background Tints & Borders
            content = content.replace(/bg-yellow-500\/10/g, 'bg-zinc-100/10');
            content = content.replace(/bg-yellow-500\/5/g, 'bg-zinc-100/5');
            content = content.replace(/border-yellow-500\/20/g, 'border-zinc-100/20');
            content = content.replace(/border-yellow-500/g, 'border-zinc-400');
            content = content.replace(/hover:border-yellow-500/g, 'hover:border-zinc-400');

            // Rings & Spinners
            content = content.replace(/ring-yellow-500/g, 'ring-zinc-300');
            content = content.replace(/border-yellow-500/g, 'border-zinc-400');

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated:', fullPath);
            }
        }
    }
}

targetDirs.forEach(processDir);
console.log('Theme conversion complete.');

const fs = require('fs');
let content = fs.readFileSync('app/admin/products/page.tsx', 'utf8');

// 1. Add ExternalLink to lucide-react
content = content.replace(
    'Plus, Search, Edit2, Trash2, Eye, EyeOff, X, Save, ChevronDown, AlertCircle, UploadCloud, Loader2',
    'Plus, Search, Edit2, Trash2, Eye, EyeOff, X, Save, ChevronDown, AlertCircle, UploadCloud, Loader2, ExternalLink'
);

// 2. Make toggleVisibility optimistic
content = content.replace(
    /const toggleVisibility = async \(p: DBProduct\) => \{[\s\S]*?fetchProducts\(\);\s*\};/,
    `const toggleVisibility = async (p: DBProduct) => {
        const nextState = !p.is_visible;
        setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, is_visible: nextState } : prod));
        await supabase.from('products').update({ is_visible: nextState }).eq('id', p.id);
    };`
);

// 3. Add View link in product info
content = content.replace(
    /<div>\s*<p className="text-white font-medium">\{product\.name\}<\/p>\s*<p className="text-gray-500 text-xs truncate max-w-48">\{product\.slug\}<\/p>\s*<\/div>/,
    `<div>
        <p className="text-white font-medium">{product.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
            <span className="text-gray-500 text-xs truncate max-w-48">{product.slug}</span>
            <a
                href={\`/product/\${product.slug}\`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-1.5 py-0.5 rounded border border-zinc-700 transition-colors"
                title="View product live on website"
            >
                <ExternalLink size={10} />
                <span>View</span>
            </a>
        </div>
    </div>`
);

fs.writeFileSync('app/admin/products/page.tsx', content, 'utf8');
console.log('Admin products updated successfully');

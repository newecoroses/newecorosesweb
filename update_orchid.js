const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function run() {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const supabaseUrlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
    const supabaseKeyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

    if (!supabaseUrlMatch || !supabaseKeyMatch) {
        console.error('Supabase credentials not found in .env.local');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrlMatch[1].trim(), supabaseKeyMatch[1].trim());

    const oldPath = path.join(__dirname, 'public', 'images', 'products', 'orchid replacement.webp');
    const newFileName = `orchids-${Date.now()}.webp`;
    const newPath = path.join(__dirname, 'public', 'images', 'products', newFileName);
    const newUrl = `/images/products/${newFileName}`;

    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed to ${newFileName}`);
    } else {
        console.error(`File not found: ${oldPath}`);
        process.exit(1);
    }

    const { data: products, error } = await supabase.from('products').select('*').eq('name', 'Orchids').single();
    if (error) {
        console.error('Error fetching orchids:', error);
        process.exit(1);
    }

    // Update the main image and images array. If the old image 'orchids.webp' was in there, replace it.
    let updatedImages = products.images || [];
    updatedImages = updatedImages.filter(img => img !== '/images/products/orchids.webp');
    if (!updatedImages.includes(newUrl)) {
        updatedImages.unshift(newUrl); // push new image as main
    }

    const { error: updateError } = await supabase.from('products').update({
        image_url: newUrl,
        images: updatedImages
    }).eq('id', products.id);

    if (updateError) {
        console.error('Error updating product:', updateError);
        process.exit(1);
    }

    console.log(`Updated Supabase for product ID ${products.id}`);

    try {
        execSync(`git add "public/images/products/${newFileName}"`);
        execSync(`git rm "public/images/products/orchid replacement.webp" || true`);
        execSync(`git commit -m "Update Orchids product image to new replacement"`);
        execSync(`git push`);
        console.log('Successfully pushed new image to git!');
    } catch (e) {
        console.error('Git error:', e.message);
    }
}

run();

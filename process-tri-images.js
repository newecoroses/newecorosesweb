const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'public', 'images', 'products', 'tri');
const destDir = path.join(__dirname, 'public', 'images', 'products');

const products = [
    {
        name: 'Chips & Chocolate Hamper',
        slug: 'chips-chocolate-hamper',
        description: 'A delightful hamper filled with premium chips and chocolates.',
        collection: 'Hamper',
        files: ['Chips and drink hamper.jpg', 'chips and chocolate hamper2.jpg']
    },
    {
        name: 'Big Mix Hamper',
        slug: 'big-mix-hamper',
        description: 'An oversized mix hamper perfect for huge celebrations.',
        collection: 'Hamper',
        files: ['big mix hamper.jpg', 'mix hamper.jpg']
    },
    {
        name: 'Scented Candle Gift',
        slug: 'scented-candle-gift',
        description: 'A single, perfectly made scented candle for creating a warm mood.',
        collection: 'Personalized',
        files: ['candle1.jpg', '7429ec2f-2bd5-4881-97cd-070eee41c82e.jpg']
    },
    {
        name: 'Celebrations Gift Box',
        slug: 'celebrations-gift-box',
        description: 'A beautiful gift box filled with celebrations chocolates and joy.',
        collection: 'Chocolate Bouquet',
        files: ['celebrationn gift.jpg', 'celebrations gift.jpg', 'celebrations gift2.jpg']
    },
    {
        name: 'Premium Chocolate Gift Set',
        slug: 'premium-chocolate-gift-set',
        description: 'A luxurious chocolate gift arrangement.',
        collection: 'Chocolate Bouquet',
        files: ['chocolate gift.jpg', 'chocolate gift2.jpg', 'chocolate.jpg']
    },
    {
        name: 'Gourmet Chocolate Hamper',
        slug: 'gourmet-chocolate-hamper',
        description: 'A beautiful hamper basket with carefully arranged gourmet chocolates.',
        collection: 'Hamper',
        files: ['chocolate hamper image.jpg', 'chocolate hamperr new.jpg']
    },
    {
        name: 'Printed Coffee Mug Bundle',
        slug: 'printed-coffee-mug-bundle',
        description: 'A wonderful coffee mug bundle to start the day right.',
        collection: 'Personalized',
        files: ['coffee mug printed .jpg', 'coffee mug printer.jpg', 'printer coffee mug1.jpg', 'printer mom coffee mug.jpg']
    },
    {
        name: 'Dairy Milk Silk Bouquet',
        slug: 'dairy-milk-silk-bouquet',
        description: 'A delicious arrangement of Dairy Milk Silk chocolates wrapped beautifully.',
        collection: 'Chocolate Bouquet',
        files: ['dairy milk bouquet.jpg', 'dairy milk silk chocolate.jpg']
    },
    {
        name: 'Ferrero Rocher Bouquet',
        slug: 'ferrero-rocher-bouquet',
        description: 'Golden Ferrero Rocher chocolates presented in a wonderful bouquet style.',
        collection: 'Chocolate Bouquet',
        files: ['ferraro rocket bouquet.jpg', 'ferraro rocket bouquet 2.jpg']
    },
    {
        name: 'Friends Forever Rose Bouquet',
        slug: 'friends-forever-rose-bouquet',
        description: 'A meaningful rose bouquet to celebrate everlasting friendship.',
        collection: 'Fresh Flower',
        files: ['friends forever rose bouquet.jpg', 'friends forever bouquet 2.jpg']
    },
    {
        name: 'Happy Birthday Rose Bouquet',
        slug: 'happy-birthday-rose-bouquet',
        description: 'A vibrant rose bouquet perfectly crafted for birthday gifting.',
        collection: 'Fresh Flower',
        files: ['happy birthday rose bouquet.jpg', 'happy birthday rose bouquet2.jpg']
    },
    {
        name: 'Kinder Joy Surprise Bouquet',
        slug: 'kinder-joy-surprise-bouquet',
        description: 'A fun bouquet packed with Kinder Joy eggs, perfect for kids or the young at heart.',
        collection: 'Teddy and Bouquet',
        files: ['kinder joy bouquet.jpg', 'kinderjoy hamper.jpg']
    },
    {
        name: 'White Lily Elegance Bouquet',
        slug: 'white-lily-elegance-bouquet',
        description: 'A wonderfully elegant bouquet of pure white lilies.',
        collection: 'Fresh Flower',
        files: ['white lily bouquet.jpg', 'white lily bouquet2.jpg', 'white lily bouquet3.jpg', 'lilybouquet1.jpg']
    },
    {
        name: 'Mix Chocolate Bouquet',
        slug: 'mix-chocolate-bouquet',
        description: 'A mix of various beloved chocolates curated into an impressive bouquet.',
        collection: 'Chocolate Bouquet',
        files: ['mix chocolate bouqett.jpg', 'mix chocolate bouquet.jpg', 'new chocolare bouquet.jpg', 'new chocolate bouquet2.jpg', 'small chocolate bouquet.jpg']
    },
    {
        name: 'Orchid Dream Bouquet',
        slug: 'orchid-dream-bouquet',
        description: 'Striking, exotic orchids arranged elegantly in a bouquet.',
        collection: 'Fresh Flower',
        files: ['orchid bouquet.jpg', 'orchid1.jpg']
    },
    {
        name: 'Plant & Chocolate Hamper',
        slug: 'plant-chocolate-hamper',
        description: 'The perfect combination of a serene live plant and delicious chocolates.',
        collection: 'Hamper',
        files: ['plant and chocolate hamper.jpg']
    },
    {
        name: 'Classic Red Rose Mix',
        slug: 'classic-red-rose-mix',
        description: 'Dazzling classic red roses bundled perfectly into a beautiful bouquet.',
        collection: 'Fresh Flower',
        files: ['red rose.jpg', 'red rose2.jpg', 'rose bouquet.jpg', 'red and pink rose happy bd bouquet.jpg', 'mix flower bouquet.jpg']
    },
    {
        name: 'Teddy & Chocolate Mix Hamper',
        slug: 'teddy-chocolate-mix-hamper',
        description: 'A cuddly teddy bear together with assorted chocolates gracefully packed in a hamper.',
        collection: 'Teddy and Bouquet',
        files: ['teddy and chocolate mix hamper.jpg', 'chocolate and teddy bouyquet.jpg']
    },
    {
        name: 'Sunshine Yellow Rose Bouquet',
        slug: 'sunshine-yellow-rose-bouquet',
        description: 'Bright and cheerful yellow roses to instantly lift someone\'s spirits.',
        collection: 'Fresh Flower',
        files: ['yellow rose.jpg', 'yellow rose2.jpg', 'single yellow rose bouquet.jpg']
    },
    {
        name: 'Classic Gift Hamper Set',
        slug: 'classic-gift-hamper-set',
        description: 'A beautiful collection of classic gifts arranged for any fine occasion.',
        collection: 'Hamper',
        files: ['gift 2.jpg', 'giftset.jpg', 'hamper.jpg', 'mixx hamperrr.jpg']
    }
];

// Helper to determine collection slug
const getCollectionSlug = (name) => {
    return name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
}

let sqlInserts = [];
let sortOrderStart = 50;

products.forEach(p => {
    let finalImages = [];

    p.files.forEach((file, idx) => {
        const srcPath = path.join(srcDir, file);
        if (fs.existsSync(srcPath)) {
            const ext = path.extname(file);
            const newName = `${p.slug}-${idx + 1}${ext}`;
            const destPath = path.join(destDir, newName);
            fs.renameSync(srcPath, destPath);
            finalImages.push(`/images/products/${newName}`);
        } else {
            console.warn(`File missing: ${srcPath}`);
        }
    });

    if (finalImages.length > 0) {
        // Build SQL
        const imagesArrStr = "ARRAY[" + finalImages.map(d => `'${d}'`).join(', ') + "]";
        const mainImage = finalImages[0];
        const collectionSlug = getCollectionSlug(p.collection);

        const sql = `(
    '${p.name.replace(/'/g, "''")}', 
    '${p.slug}', 
    '${p.description.replace(/'/g, "''")}', 
    '${p.collection}', 
    '${collectionSlug}', 
    ARRAY['Friend', 'Family', 'Girlfriend'], 
    ARRAY['Birthday', 'Anniversary'], 
    'New Arrival', 
    '${mainImage}', 
    ${imagesArrStr}, 
    10, 
    ${Math.floor(Math.random() * 20) + 5}, 
    true, 
    ${sortOrderStart++}
  )`;
        sqlInserts.push(sql);
    }
});

const finalSql = `
-- Run this SQL in your Supabase SQL Editor to add the 20 newly bulk imported products to your live database!

INSERT INTO products (name, slug, description, collection_name, collection_slug, relationships, celebrations, tag, image_url, images, stock, item_count, is_visible, sort_order)
VALUES
${sqlInserts.join(',\n')}
ON CONFLICT (slug) DO UPDATE 
SET 
  description = EXCLUDED.description,
  collection_name = EXCLUDED.collection_name,
  collection_slug = EXCLUDED.collection_slug,
  tag = EXCLUDED.tag,
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  item_count = EXCLUDED.item_count;
`;

fs.writeFileSync(path.join(__dirname, 'add_tri_products.sql'), finalSql);
console.log('Successfully organized products and generated add_tri_products.sql');

// Clean up tri dir
fs.rmdirSync(srcDir, { recursive: true });
console.log('Deleted tri folder');

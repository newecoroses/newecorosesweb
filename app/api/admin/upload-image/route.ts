import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

let serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!serviceRoleKey) {
    try {
        const envContent = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf-8');
        const match = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=([^\r\n]+)/);
        if (match) serviceRoleKey = match[1].trim();
    } catch (e) { }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const productSlug = formData.get('productSlug') as string;
        const folder = (formData.get('folder') as string) || 'products';
        const originalExt = file.name.split('.').pop() || 'jpg';
        const rawFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
        const uniqueFileName = productSlug ? `${productSlug}-${Date.now()}.${originalExt}` : `${Date.now()}-${rawFileName}`;
        const relativePath = `${folder}/${uniqueFileName}`;

        // Upload to Supabase 'images' bucket
        const { data, error } = await supabase.storage
            .from('images')
            .upload(relativePath, buffer, {
                contentType: file.type || 'application/octet-stream',
                upsert: true
            });

        if (error) {
            console.error('Supabase Storage Error:', error);
            throw error;
        }

        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(relativePath);

        // Return path immediately
        return NextResponse.json({ url: publicUrl, success: true });
    } catch (error: any) {
        console.error('Upload API Error:', error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}

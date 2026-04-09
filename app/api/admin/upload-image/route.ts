import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

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

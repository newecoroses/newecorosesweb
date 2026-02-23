import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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
        const relativePath = `/images/${folder}/${uniqueFileName}`;

        // Write the file to the local public folder
        const absolutePath = join(process.cwd(), 'public', 'images', folder, uniqueFileName);
        await writeFile(absolutePath, buffer);

        // Attempt to auto-commit to the git repository (silently catch if errors)
        try {
            await execAsync(`git add "public/images/${folder}/${uniqueFileName}"`);
            await execAsync(`git commit -m "Admin panel auto-upload: ${folder}/${uniqueFileName}"`);
            await execAsync(`git push`);
        } catch (gitErr) {
            console.error('Git auto-commit failed during upload:', gitErr);
        }

        // Return path immediately
        return NextResponse.json({ url: relativePath, success: true });
    } catch (error: any) {
        console.error('Upload API Error:', error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}

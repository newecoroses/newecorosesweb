import { useState } from 'react';
import { UploadCloud, Loader2, X, Eye, EyeOff } from 'lucide-react';

interface SingleImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    folder: string;
    slug?: string;
    className?: string;
}

export default function SingleImageUpload({ value, onChange, folder, slug, className = "w-24 h-24" }: SingleImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', folder);
            if (slug) formData.append('productSlug', slug);

            const res = await fetch('/api/admin/upload-image', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Upload failed');

            onChange(data.url);
        } catch (err: any) {
            setError(err.message || 'Image upload failed.');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const isHidden = (value || '').startsWith('HIDDEN::');
    const displayUrl = (value || '').replace('HIDDEN::', '');

    return (
        <div>
            {value ? (
                <div className={`relative rounded-xl overflow-hidden bg-gray-800 border-2 border-transparent hover:border-zinc-400 transition-all group ${isHidden ? 'opacity-50 grayscale' : ''} ${className}`}>
                    <img src={displayUrl} alt="Preview" className="w-full h-full object-cover" />

                    {isHidden && (
                        <div className="absolute top-1 left-1 bg-gray-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">HIDDEN</div>
                    )}

                    <button
                        type="button"
                        onClick={() => onChange('')}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X size={12} />
                    </button>

                    <button
                        type="button"
                        onClick={() => onChange(isHidden ? displayUrl : `HIDDEN::${displayUrl}`)}
                        className="absolute bottom-1 right-1 bg-gray-900 shadow-xl border border-gray-700 hover:bg-gray-800 text-white rounded-md p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        title={isHidden ? "Unhide Image" : "Hide Image"}
                    >
                        {isHidden ? <Eye size={12} /> : <EyeOff size={12} />}
                    </button>
                </div>
            ) : (
                <label className={`rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${className} ${uploading ? 'border-gray-600 bg-gray-800' : 'border-gray-600 hover:border-zinc-400 hover:bg-gray-800/50'}`}>
                    {uploading ? (
                        <Loader2 size={24} className="text-gray-400 animate-spin" />
                    ) : (
                        <>
                            <UploadCloud size={24} className="text-gray-400 mb-2" />
                            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider text-center px-2">Upload</span>
                        </>
                    )}
                    <input type="file" className="hidden" accept="image/*" disabled={uploading} onChange={handleFileUpload} />
                </label>
            )}
            {error && <div className="text-red-400 text-xs mt-2">{error}</div>}
        </div>
    );
}

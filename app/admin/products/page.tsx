'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, DBProduct, DBCollection } from '@/lib/supabase';
import {
    Plus, Search, Edit2, Trash2, Eye, EyeOff, X, Save, ChevronDown, AlertCircle, UploadCloud, Loader2
} from 'lucide-react';

const TAGS = ['Best Seller', 'New Arrival', 'Seasonal', 'Standard'];

interface ProductFormData {
    name: string;
    slug: string;
    description: string;
    collection_name: string;
    collection_slug: string;
    relationships: string;
    celebrations: string;
    tag: string;
    image_url: string;
    images: string[];
    stock: number;
    is_visible: boolean;
    is_featured: boolean;
    sort_order: number;
    image_scale: number;
    item_count: number;
}

const DEFAULT_FORM: ProductFormData = {
    name: '', slug: '', description: '', collection_name: '', collection_slug: '',
    relationships: '', celebrations: '', tag: 'Standard', image_url: '', images: [],
    stock: 10, is_visible: true, is_featured: false, sort_order: 0, image_scale: 1.0,
    item_count: 0,
};

function slugify(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">{children}</div>
            </div>
            <div className="fixed inset-0 -z-10" onClick={onClose} />
        </div>
    );
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<DBProduct[]>([]);
    const [collections, setCollections] = useState<DBCollection[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterTag, setFilterTag] = useState('All');
    const [filterVisible, setFilterVisible] = useState('All');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<DBProduct | null>(null);
    const [form, setForm] = useState<ProductFormData>(DEFAULT_FORM);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase.from('products').select('*').order('sort_order');
        setProducts(data ?? []);
        setLoading(false);
    }, []);

    const fetchCollections = useCallback(async () => {
        const { data } = await supabase.from('collections').select('*').order('sort_order');
        setCollections(data ?? []);
    }, []);

    useEffect(() => {
        fetchProducts();
        fetchCollections();
    }, [fetchProducts, fetchCollections]);

    const openAdd = () => {
        setEditingProduct(null);
        setForm(DEFAULT_FORM);
        setError('');
        setModalOpen(true);
    };

    const openEdit = (p: DBProduct) => {
        setEditingProduct(p);
        setForm({
            name: p.name,
            slug: p.slug,
            description: p.description ?? '',
            collection_name: p.collection_name ?? '',
            collection_slug: p.collection_slug ?? '',
            relationships: (p.relationships ?? []).join(', '),
            celebrations: (p.celebrations ?? []).join(', '),
            tag: p.tag ?? 'Standard',
            image_url: p.image_url ?? '',
            images: p.images ?? (p.image_url ? [p.image_url] : []),
            stock: p.stock ?? 10,
            is_visible: p.is_visible ?? true,
            is_featured: p.is_featured ?? false,
            sort_order: p.sort_order ?? 0,
            image_scale: p.image_scale ?? 1.0,
            item_count: p.item_count ?? 0,
        });
        setError('');
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!form.name.trim()) { setError('Product name is required'); return; }
        setSaving(true);
        setError('');

        const selectedCollection = collections.find(c => c.slug === form.collection_slug);

        const payload = {
            name: form.name.trim(),
            slug: form.slug || slugify(form.name),
            description: form.description,
            collection_name: selectedCollection?.name ?? form.collection_name,
            collection_slug: form.collection_slug,
            relationships: form.relationships.split(',').map(s => s.trim()).filter(Boolean),
            celebrations: form.celebrations.split(',').map(s => s.trim()).filter(Boolean),
            tag: form.tag,
            image_url: form.images.filter(i => !i.startsWith('HIDDEN::'))[0] || form.images[0] || '',
            images: form.images,
            stock: form.stock,
            is_visible: form.is_visible,
            is_featured: form.is_featured,
            sort_order: form.sort_order,
            image_scale: form.image_scale,
            item_count: form.item_count,
            updated_at: new Date().toISOString(),
        };

        const { error: err } = editingProduct
            ? await supabase.from('products').update(payload).eq('id', editingProduct.id)
            : await supabase.from('products').insert(payload);

        if (err) {
            setError(err.message);
        } else {
            setSuccess(editingProduct ? 'Product updated!' : 'Product added!');
            setModalOpen(false);
            fetchProducts();
            setTimeout(() => setSuccess(''), 3000);
        }
        setSaving(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('productSlug', form.slug || slugify(form.name) || 'unnamed');

            const res = await fetch('/api/admin/upload-image', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Upload failed');

            setForm(f => ({
                ...f,
                images: [...f.images, data.url],
            }));
            setSuccess('Image uploaded securely to Git repository');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message || 'Image upload failed.');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (indexToRemove: number) => {
        setForm(f => ({
            ...f,
            images: f.images.filter((_, idx) => idx !== indexToRemove)
        }));
    };

    const toggleImageHidden = (index: number) => {
        setForm(f => ({
            ...f,
            images: f.images.map((img, idx) => {
                if (idx !== index) return img;
                return img.startsWith('HIDDEN::') ? img.replace('HIDDEN::', '') : `HIDDEN::${img}`;
            })
        }));
    };

    const handleDelete = async (id: string) => {
        const { error: err } = await supabase.from('products').delete().eq('id', id);
        if (!err) { fetchProducts(); setDeleteId(null); }
    };

    const toggleVisibility = async (p: DBProduct) => {
        await supabase.from('products').update({ is_visible: !p.is_visible }).eq('id', p.id);
        fetchProducts();
    };

    const filtered = products.filter(p => {
        const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.collection_name?.toLowerCase().includes(search.toLowerCase());
        const matchTag = filterTag === 'All' || p.tag === filterTag;
        const matchVisible = filterVisible === 'All' || (filterVisible === 'Visible' ? p.is_visible : !p.is_visible);
        return matchSearch && matchTag && matchVisible;
    });

    const handleCollectionChange = (slug: string) => {
        const col = collections.find(c => c.slug === slug);
        setForm(f => ({ ...f, collection_slug: slug, collection_name: col?.name ?? '' }));
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Products</h1>
                    <p className="text-gray-400 text-sm mt-0.5">{products.length} total products</p>
                </div>
                <button onClick={openAdd} className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
                    <Plus size={16} /> Add Product
                </button>
            </div>

            {/* Alerts */}
            {success && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                    <AlertCircle size={14} /> {success}
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
                <div className="relative flex-1 min-w-48">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
                        className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors placeholder:text-gray-600" />
                </div>
                <select value={filterTag} onChange={e => setFilterTag(e.target.value)}
                    className="bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors">
                    <option value="All">All Tags</option>
                    {TAGS.map(t => <option key={t}>{t}</option>)}
                </select>
                <select value={filterVisible} onChange={e => setFilterVisible(e.target.value)}
                    className="bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors">
                    <option value="All">All Visibility</option>
                    <option value="Visible">Visible</option>
                    <option value="Hidden">Hidden</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-800">
                                <th className="text-left text-gray-500 text-xs uppercase tracking-wider font-medium px-5 py-4">Product</th>
                                <th className="text-left text-gray-500 text-xs uppercase tracking-wider font-medium px-5 py-4">Collection</th>
                                <th className="text-left text-gray-500 text-xs uppercase tracking-wider font-medium px-5 py-4">Tag</th>
                                <th className="text-left text-gray-500 text-xs uppercase tracking-wider font-medium px-5 py-4">Stock</th>
                                <th className="text-left text-gray-500 text-xs uppercase tracking-wider font-medium px-5 py-4">Visible</th>
                                <th className="text-right text-gray-500 text-xs uppercase tracking-wider font-medium px-5 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="border-b border-gray-800/50">
                                        <td colSpan={6} className="px-5 py-4">
                                            <div className="h-4 bg-gray-800 rounded animate-pulse" />
                                        </td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={6} className="text-center text-gray-500 py-12">No products found</td></tr>
                            ) : (
                                filtered.map(product => (
                                    <tr key={product.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {product.image_url && (
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                                                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-white font-medium">{product.name}</p>
                                                    <p className="text-gray-500 text-xs truncate max-w-48">{product.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-gray-400">{product.collection_name ?? '—'}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${product.tag === 'Best Seller' ? 'bg-zinc-100 text-zinc-900/10 text-zinc-100' :
                                                product.tag === 'New Arrival' ? 'bg-blue-500/10 text-blue-400' :
                                                    product.tag === 'Seasonal' ? 'bg-green-500/10 text-green-400' :
                                                        'bg-gray-700 text-gray-400'
                                                }`}>{product.tag}</span>
                                        </td>
                                        <td className="px-5 py-4 text-gray-400">{product.stock}</td>
                                        <td className="px-5 py-4">
                                            <button onClick={() => toggleVisibility(product)} className={`w-10 h-5 rounded-full transition-colors relative ${product.is_visible ? 'bg-green-500' : 'bg-gray-700'}`}>
                                                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${product.is_visible ? 'left-5.5 left-[22px]' : 'left-0.5'}`} />
                                            </button>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEdit(product)} className="text-gray-500 hover:text-zinc-100 transition-colors p-1.5 hover:bg-zinc-200/10 rounded-lg">
                                                    <Edit2 size={15} />
                                                </button>
                                                <button onClick={() => setDeleteId(product.id)} className="text-gray-500 hover:text-red-400 transition-colors p-1.5 hover:bg-red-400/10 rounded-lg">
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white text-lg font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                    <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-white p-1">
                        <X size={18} />
                    </button>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl px-4 py-3 mb-4">{error}</div>}

                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1.5">Product Name *</label>
                        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors" />
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1.5">Slug</label>
                        <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors" />
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1.5">Tag</label>
                        <select value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors">
                            {TAGS.map(t => <option key={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1.5">Description</label>
                        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors resize-none" />
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1.5">Collection</label>
                        <select value={form.collection_slug} onChange={e => handleCollectionChange(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors">
                            <option value="">Select collection</option>
                            {collections.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1.5">Stock</label>
                        <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: parseInt(e.target.value) || 0 }))}
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors" />
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1.5">Item Count (e.g. 12 Roses)</label>
                        <input type="number" value={form.item_count} onChange={e => setForm(f => ({ ...f, item_count: parseInt(e.target.value) || 0 }))}
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors" />
                    </div>
                    <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-4">
                        <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-3">Product Images (Hover Slider)</label>

                        {/* Image Gallery */}
                        <div className="flex flex-wrap gap-4 mb-4">
                            {form.images.map((img, idx) => (
                                <div key={idx} className={`relative w-24 h-24 rounded-xl overflow-hidden bg-gray-800 border-2 border-transparent hover:border-zinc-400 transition-all group ${img.startsWith('HIDDEN::') ? 'opacity-50 grayscale' : ''}`}>
                                    <img src={img.replace('HIDDEN::', '')} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                    {/* Main Image Badge */}
                                    {idx === 0 && !img.startsWith('HIDDEN::') && (
                                        <div className="absolute top-1 left-1 bg-zinc-100 text-zinc-900 text-gray-900 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">MAIN</div>
                                    )}
                                    {/* Hidden Badge */}
                                    {img.startsWith('HIDDEN::') && (
                                        <div className="absolute top-1 left-1 bg-gray-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">HIDDEN</div>
                                    )}
                                    {/* Remove button */}
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                    {/* Toggle Hide button */}
                                    <button
                                        type="button"
                                        onClick={() => toggleImageHidden(idx)}
                                        className="absolute bottom-1 right-1 bg-gray-900 shadow-xl border border-gray-700 hover:bg-gray-800 text-white rounded-md p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title={img.startsWith('HIDDEN::') ? "Unhide Image" : "Hide Image"}
                                    >
                                        {img.startsWith('HIDDEN::') ? <Eye size={12} /> : <EyeOff size={12} />}
                                    </button>
                                </div>
                            ))}

                            {/* Upload Button */}
                            <label className={`w-24 h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${uploading ? 'border-gray-600 bg-gray-800' : 'border-gray-600 hover:border-zinc-400 hover:bg-gray-800/50'}`}>
                                {uploading ? (
                                    <Loader2 size={24} className="text-gray-400 animate-spin" />
                                ) : (
                                    <>
                                        <UploadCloud size={24} className="text-gray-400 mb-2" />
                                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Upload</span>
                                    </>
                                )}
                                <input type="file" className="hidden" accept="image/*" disabled={uploading} onChange={handleFileUpload} />
                            </label>
                        </div>

                        <div className="text-xs text-gray-500 leading-tight">
                            The first image is the main display. Any additional images will appear in the premium hover-slider on the website. Uploaded images instantly sync to the GitHub codebase.
                        </div>
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1.5">Relationships (comma-separated)</label>
                        <input value={form.relationships} onChange={e => setForm(f => ({ ...f, relationships: e.target.value }))}
                            placeholder="Wife, Girlfriend, Him"
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors placeholder:text-gray-600" />
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1.5">Celebrations (comma-separated)</label>
                        <input value={form.celebrations} onChange={e => setForm(f => ({ ...f, celebrations: e.target.value }))}
                            placeholder="Anniversary, Birthday"
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors placeholder:text-gray-600" />
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1.5">Sort Order</label>
                        <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors" />
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1.5">Image Scale (1.0 = normal)</label>
                        <input type="number" step="0.05" value={form.image_scale} onChange={e => setForm(f => ({ ...f, image_scale: parseFloat(e.target.value) || 1.0 }))}
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors" />
                    </div>
                    <div className="col-span-2 flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={form.is_visible} onChange={e => setForm(f => ({ ...f, is_visible: e.target.checked }))} className="w-4 h-4 accent-zinc-400" />
                            <span className="text-gray-300 text-sm">Visible on website</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="w-4 h-4 accent-zinc-400" />
                            <span className="text-gray-300 text-sm">Featured product</span>
                        </label>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button onClick={() => setModalOpen(false)} className="flex-1 bg-gray-800 text-gray-300 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors">Cancel</button>
                    <button onClick={handleSave} disabled={saving} className="flex-1 bg-zinc-100 hover:bg-white text-zinc-900 font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                        {saving ? <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" /> : <Save size={14} />}
                        {saving ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </Modal>

            {/* Delete Confirm */}
            <Modal open={!!deleteId} onClose={() => setDeleteId(null)}>
                <div className="text-center">
                    <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Trash2 size={24} className="text-red-400" />
                    </div>
                    <h3 className="text-white text-lg font-bold mb-2">Delete Product?</h3>
                    <p className="text-gray-400 text-sm mb-6">This action cannot be undone. The product will be permanently removed.</p>
                    <div className="flex gap-3">
                        <button onClick={() => setDeleteId(null)} className="flex-1 bg-gray-800 text-gray-300 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors">Cancel</button>
                        <button onClick={() => deleteId && handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

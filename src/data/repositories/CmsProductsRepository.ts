// src/data/repositories/CmsProductsRepository.ts
import { cmsAuth } from '../../lib/cmsAuth';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

export type CmsProduct = {
  id: number;
  name: string;
  category: string;
  brand: string;
  image?: string | null;
  image_url?: string | null;
  price: number | null;   // ← nos aseguramos de usar number | null
  oferta: boolean;
};

export type ListProductsResponse = {
  total: number;
  items: CmsProduct[];
  page: number;
  limit: number;
};

export class CmsProductsRepository {
  async list(params: { search?: string; sortBy?: string; order?: 'asc'|'desc'; page?: number; limit?: number } = {}): Promise<ListProductsResponse> {
    const token = cmsAuth.getAccess();
    const qs = new URLSearchParams();
    if (params.search) qs.set('search', params.search);
    if (params.sortBy) qs.set('sortBy', params.sortBy);
    if (params.order) qs.set('order', params.order);
    if (params.page) qs.set('page', String(params.page));
    if (params.limit) qs.set('limit', String(params.limit));

    const url = `${API_BASE}/cms/products${qs.toString() ? `?${qs}` : ''}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }});
    if (res.status === 401 || res.status === 403) throw new Error('UNAUTHORIZED');
    if (!res.ok) throw new Error('Error al cargar productos.');

    const data = await res.json();

    // Acepta varias formas: {items: [...]}, {results: [...]}, o [...]
    let rawItems: any[] = [];
    if (Array.isArray(data)) rawItems = data;
    else if (Array.isArray(data.items)) rawItems = data.items;
    else if (Array.isArray(data.results)) rawItems = data.results;

    // Normaliza campos y price → number|null
    const items: CmsProduct[] = rawItems.map((p: any) => ({
      id: Number(p.id),
      name: String(p.name ?? ''),
      category: String(p.category ?? ''),
      brand: String(p.brand ?? ''),
      image: p.image ?? null,
      image_url: (p.image_url ?? p.image) ?? null,
      price: p.price == null ? null : Number(p.price),
      oferta: Boolean(p.oferta),
    }));

    const total =
      typeof data?.total === 'number' ? data.total :
      typeof data?.count === 'number' ? data.count :
      items.length;

    const page = typeof data?.page === 'number' ? data.page : 1;
    const limit = typeof data?.limit === 'number' ? data.limit : items.length || (params.limit ?? 100);

    return { total, items, page, limit };
  }

  async update(id: number, patch: Partial<Pick<CmsProduct, 'name'|'category'|'brand'|'image_url'|'price'|'oferta'|'image'>>): Promise<CmsProduct> {
    const token = cmsAuth.getAccess();
    const res = await fetch(`${API_BASE}/cms/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(patch),
    });
    if (res.status === 401 || res.status === 403) throw new Error('UNAUTHORIZED');
    if (!res.ok) throw new Error('No se pudo actualizar el producto.');
    const p = await res.json();
    return {
      id: Number(p.id),
      name: String(p.name ?? ''),
      category: String(p.category ?? ''),
      brand: String(p.brand ?? ''),
      image: p.image ?? null,
      image_url: (p.image_url ?? p.image) ?? null,
      price: p.price == null ? null : Number(p.price),
      oferta: Boolean(p.oferta),
    };
  }
}

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
  price: number | null;
  oferta: boolean;

  // Campos extra que añadimos
  model_code?: string | null;
  oem_code?: string | null;
  description?: string | null;
  voltage?: string | null;
  amp_rating?: number | null;
  watt_rating?: number | null;
  led_count?: number | null;
  kelvin?: number | null;
  color?: string | null;
  beam_pattern?: string | null;
  series?: string | null;
  lens_color?: string | null;
  attributes?: any | null;
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

    let rawItems: any[] = [];
    if (Array.isArray(data)) rawItems = data;
    else if (Array.isArray(data.items)) rawItems = data.items;
    else if (Array.isArray(data.results)) rawItems = data.results;

    const items: CmsProduct[] = rawItems.map((p: any) => ({
      id: Number(p.id),
      name: String(p.name ?? ''),
      category: String(p.category ?? ''),
      brand: String(p.brand ?? ''),
      image: p.image ?? null,
      image_url: (p.image_url ?? p.image) ?? null,
      price: p.price == null ? null : Number(p.price),
      oferta: Boolean(p.oferta),

      model_code: p.model_code ?? null,
      oem_code: p.oem_code ?? null,
      description: p.description ?? null,
      voltage: p.voltage ?? null,
      amp_rating: p.amp_rating == null ? null : Number(p.amp_rating),
      watt_rating: p.watt_rating == null ? null : Number(p.watt_rating),
      led_count: p.led_count == null ? null : Number(p.led_count),
      kelvin: p.kelvin == null ? null : Number(p.kelvin),
      color: p.color ?? null,
      beam_pattern: p.beam_pattern ?? null,
      series: p.series ?? null,
      lens_color: p.lens_color ?? null,
      attributes: p.attributes ?? null,
    }));

    const total =
      typeof data?.total === 'number' ? data.total :
      typeof data?.count === 'number' ? data.count :
      items.length;

    const page = typeof data?.page === 'number' ? data.page : 1;
    const limit = typeof data?.limit === 'number' ? data.limit : items.length || (params.limit ?? 100);

    return { total, items, page, limit };
  }

  async update(id: number, patch: Partial<Pick<CmsProduct, any>>): Promise<CmsProduct> {
    const token = cmsAuth.getAccess();
    const res = await fetch(`${API_BASE}/cms/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(patch),
    });
    if (res.status === 401 || res.status === 403) throw new Error('UNAUTHORIZED');
    if (!res.ok) {
      const txt = await res.text().catch(() => null);
      throw new Error(txt || 'No se pudo actualizar el producto.');
    }
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

      model_code: p.model_code ?? null,
      oem_code: p.oem_code ?? null,
      description: p.description ?? null,
      voltage: p.voltage ?? null,
      amp_rating: p.amp_rating == null ? null : Number(p.amp_rating),
      watt_rating: p.watt_rating == null ? null : Number(p.watt_rating),
      led_count: p.led_count == null ? null : Number(p.led_count),
      kelvin: p.kelvin == null ? null : Number(p.kelvin),
      color: p.color ?? null,
      beam_pattern: p.beam_pattern ?? null,
      series: p.series ?? null,
      lens_color: p.lens_color ?? null,
      attributes: p.attributes ?? null,
    };
  }

  async create(payload: Partial<Pick<CmsProduct, any>>): Promise<CmsProduct> {
    const token = cmsAuth.getAccess();
    const res = await fetch(`${API_BASE}/cms/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    if (res.status === 401 || res.status === 403) throw new Error('UNAUTHORIZED');
    if (!res.ok) {
      const txt = await res.text().catch(() => null);
      throw new Error(txt || 'No se pudo crear el producto.');
    }
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

      model_code: p.model_code ?? null,
      oem_code: p.oem_code ?? null,
      description: p.description ?? null,
      voltage: p.voltage ?? null,
      amp_rating: p.amp_rating == null ? null : Number(p.amp_rating),
      watt_rating: p.watt_rating == null ? null : Number(p.watt_rating),
      led_count: p.led_count == null ? null : Number(p.led_count),
      kelvin: p.kelvin == null ? null : Number(p.kelvin),
      color: p.color ?? null,
      beam_pattern: p.beam_pattern ?? null,
      series: p.series ?? null,
      lens_color: p.lens_color ?? null,
      attributes: p.attributes ?? null,
    };
  }
}

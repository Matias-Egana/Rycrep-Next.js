import { getCsrfToken } from '../../lib/csrf';
import { resolveMediaUrl } from '../../lib/media';

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
  async list(params: {
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  } = {}): Promise<ListProductsResponse> {
    const qs = new URLSearchParams();

    const term = (params.search ?? '').trim();
    if (term) {
      qs.set('search', term);
      qs.set('q', term); // compat opcional
    }

    if (params.page && params.page > 1) {
      qs.set('page', String(params.page));
    }

    if (params.limit && params.limit > 0) {
      qs.set('limit', String(params.limit));
      qs.set('pageSize', String(params.limit)); // compat opcional
    }

    if (params.sortBy) qs.set('sortBy', params.sortBy);
    if (params.order) qs.set('order', params.order);

    const queryString = qs.toString();
    const url = `${API_BASE}/cms/products${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url, {
      credentials: 'include',
    });
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
      // Normaliza a URL absoluta para que el <img> funcione en prod
      image_url: resolveMediaUrl((p.image_url ?? p.image) ?? null),
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
      typeof data?.total === 'number'
        ? data.total
        : typeof data?.count === 'number'
        ? data.count
        : items.length;

    const page =
      typeof data?.page === 'number'
        ? data.page
        : params.page ?? 1;

    const limit =
      typeof data?.limit === 'number'
        ? data.limit
        : params.limit ?? (items.length || 100);

    return { total, items, page, limit };
  }

  async update(id: number, patch: Partial<Pick<CmsProduct, any>>): Promise<CmsProduct> {
    const csrfToken = await getCsrfToken();

    const res = await fetch(`${API_BASE}/cms/products/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify(patch),
      credentials: 'include',
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
      image_url: resolveMediaUrl((p.image_url ?? p.image) ?? null),
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
    const csrfToken = await getCsrfToken();

    const res = await fetch(`${API_BASE}/cms/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify(payload),
      credentials: 'include',
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
      image_url: resolveMediaUrl((p.image_url ?? p.image) ?? null),
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

  /**
   * Sube una imagen al backend y retorna el path relativo (/data/products/...)
   * listo para guardar en BD.
   *
   * Importante: usa JSON (data URL base64) para evitar depender de multipart en hosting.
   */
  async uploadProductImage(file: File): Promise<{ path: string; filename: string }> {
    const csrfToken = await getCsrfToken();

    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(reader.error || new Error('No se pudo leer el archivo.'));
      reader.readAsDataURL(file);
    });

    const res = await fetch(`${API_BASE}/cms/media/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({
        dataUrl,
        filename: file.name,
      }),
      credentials: 'include',
    });

    if (res.status === 401 || res.status === 403) throw new Error('UNAUTHORIZED');

    const data = await res.json().catch(() => null as any);
    if (!res.ok) {
      const msg = data?.detail || data?.message || 'No se pudo subir la imagen.';
      throw new Error(String(msg));
    }

    return {
      path: String(data.path || ''),
      filename: String(data.filename || ''),
    };
  }

}

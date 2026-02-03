// src/screens/CMS/productos/Productos.tsx
import { useEffect, useMemo, useRef, useState, useCallback, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import CmsNavbar from '../../../components/cms/CmsNavbar';
import { cmsAuth } from '../../../lib/cmsAuth';
import { CmsProductsRepository, type CmsProduct } from '../../../data/repositories/CmsProductsRepository';
import { resolveProductImageUrl, normalizeProductImageUrlForDb } from '../../../lib/resolveProductImageUrl';
import './Productos.css';

const repo = new CmsProductsRepository();

type SortBy = 'name' | 'brand' | 'category' | 'price' | 'oferta';
type Order = 'asc' | 'desc';

const fmtCLP = (v: number | string | null | undefined) => {
  const n = typeof v === 'string' ? Number(v) : (v ?? 0);
  return Number.isFinite(n)
    ? n.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })
    : '$0';
};

// Placeholder SVG inline para imágenes rotas o ausentes
const placeholderImg = (w = 100, h = 66, text = 'sin imagen') =>
  `data:image/svg+xml;utf8,` +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <rect width="100%" height="100%" fill="#f2f2f2"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            fill="#9aa0a6" font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="11">${text}</text>
    </svg>`
  );

export default function Productos() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [items, setItems] = useState<CmsProduct[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [order, setOrder] = useState<Order>('asc');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Partial<CmsProduct>>({});

  // NEW: creación (hemos añadido campos avanzados aquí)
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [uploadingCreateImage, setUploadingCreateImage] = useState(false);
  const [uploadingEditFor, setUploadingEditFor] = useState<number | null>(null);
  const [newDraft, setNewDraft] = useState<Partial<CmsProduct>>({
    name: '',
    category: '',
    brand: '',
    image_url: '',
    price: 0,
    oferta: false,
    // campos avanzados iniciales
    model_code: '',
    oem_code: '',
    description: '',
    voltage: '',
    amp_rating: undefined,
    watt_rating: undefined,
    led_count: undefined,
    kelvin: undefined,
    color: '',
    beam_pattern: '',
    series: '',
    lens_color: '',
    attributes: undefined,
  });

  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const urlInputRef = useRef<HTMLInputElement | null>(null);

  // 🔒 Guard de ruta: exige login + MFA antes de mostrar productos
  useEffect(() => {
    // sin sesión → login
    if (!cmsAuth.isLoggedIn()) {
      nav('/cms/login', { replace: true });
      return;
    }
    // con sesión pero sin MFA → pantalla de setup MFA
    if (!cmsAuth.isMfaEnabled()) {
      nav('/cms/mfa', { replace: true });
    }
  }, [nav]);

  // Carga con pequeño debounce (ya no revisa login aquí)
  useEffect(() => {
    const h = setTimeout(() => {
      (async () => {
        setLoading(true);
        setErr(null);
        try {
          const res = await repo.list({ search, sortBy, order, limit: 100 });
          setItems(res.items || []);
        } catch (e: any) {
          if (e?.message === 'UNAUTHORIZED') {
            // si el backend dice UNAUTHORIZED, limpiamos y mandamos al login
            cmsAuth.clear();
            nav('/cms/login', { replace: true });
            return;
          }
          setErr(e?.message || 'Error al cargar productos.');
        } finally {
          setLoading(false);
        }
      })();
    }, 250);
    return () => clearTimeout(h);
  }, [search, sortBy, order, nav]);

  const toggleSort = (key: SortBy) => {
    if (sortBy === key) setOrder(order === 'asc' ? 'desc' : 'asc');
    else {
      setSortBy(key);
      setOrder('asc');
    }
  };

  const startEdit = (p: CmsProduct) => {
    setEditingId(p.id);
    setDraft({
      id: p.id,
      name: p.name,
      category: p.category,
      brand: p.brand,
      image_url: p.image_url ?? '',
      price: p.price ?? 0,
      oferta: p.oferta,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = async () => {
    if (editingId == null || saving) return;
    try {
      setSaving(true);
      setErr(null);
      const patch: Partial<CmsProduct> = {
        name: draft.name,
        category: draft.category,
        brand: draft.brand,
        image_url: normalizeProductImageUrlForDb((draft.image_url ?? '')?.toString().trim()),
        price: Number(draft.price ?? 0),
        oferta: !!draft.oferta,
      };
      const updated = await repo.update(editingId, patch as any);
      setItems(prev => prev.map(x => x.id === updated.id ? updated : x));
      cancelEdit();
    } catch (e: any) {
      setErr(e?.message || 'No se pudo actualizar.');
    } finally {
      setSaving(false);
    }
  };



  const uploadImageIntoNewDraft = async (file: File) => {
    if (!file) return;
    try {
      setUploadingCreateImage(true);
      setErr(null);
      const { path } = await repo.uploadProductImage(file);
      setNewDraft((d) => ({ ...d, image_url: path }));
    } catch (e: any) {
      if (e?.message === 'UNAUTHORIZED') {
        cmsAuth.clear();
        nav('/cms/login', { replace: true });
        return;
      }
      setErr(e?.message || 'No se pudo subir la imagen.');
    } finally {
      setUploadingCreateImage(false);
    }
  };

  const uploadImageIntoEditDraft = async (file: File) => {
    if (!file || editingId == null) return;
    try {
      setUploadingEditFor(editingId);
      setErr(null);
      const { path } = await repo.uploadProductImage(file);
      setDraft((d) => ({ ...d, image_url: path }));
    } catch (e: any) {
      if (e?.message === 'UNAUTHORIZED') {
        cmsAuth.clear();
        nav('/cms/login', { replace: true });
        return;
      }
      setErr(e?.message || 'No se pudo subir la imagen.');
    } finally {
      setUploadingEditFor(null);
    }
  };

  // NUEVO: crear producto (ahora admite campos avanzados)
  const onCreate = async () => {
    if (creating) return;
    setErr(null);
    // Validaciones mínimas
    if (!newDraft.name || !newDraft.category || !newDraft.brand) {
      setErr('Nombre, categoría y marca son obligatorios.');
      return;
    }
    try {
      setCreating(true);
      const payload: any = {
        name: (newDraft.name ?? '').toString(),
        category: (newDraft.category ?? '').toString(),
        brand: (newDraft.brand ?? '').toString(),
        image_url: normalizeProductImageUrlForDb((newDraft.image_url ?? '')?.toString().trim()) || undefined,
        price: newDraft.price == null ? undefined : Number(newDraft.price),
        oferta: !!newDraft.oferta,
      };

      // añadimos campos avanzados si están presentes
      const extras = [
        'model_code','oem_code','description','voltage','amp_rating','watt_rating',
        'led_count','kelvin','color','beam_pattern','series','lens_color','attributes'
      ] as const;
      for (const k of extras) {
        const v = (newDraft as any)[k];
        if (v !== undefined) payload[k] = v;
      }

      const created = await repo.create(payload as any);
      // Insertar al inicio y ocultar form
      setItems(prev => [created, ...prev]);
      setShowCreate(false);
      setNewDraft({
        name: '',
        category: '',
        brand: '',
        image_url: '',
        price: 0,
        oferta: false,
        model_code: '',
        oem_code: '',
        description: '',
        voltage: '',
        amp_rating: undefined,
        watt_rating: undefined,
        led_count: undefined,
        kelvin: undefined,
        color: '',
        beam_pattern: '',
        series: '',
        lens_color: '',
        attributes: undefined,
      });
    } catch (e: any) {
      setErr(e?.message || 'No se pudo crear el producto.');
    } finally {
      setCreating(false);
    }
  };

  // Foco al iniciar edición
  useEffect(() => {
    if (editingId != null) {
      const t = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 0);
      return () => clearTimeout(t);
    }
  }, [editingId]);

  const onEditorKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  }, [saveEdit]);

  const rows = useMemo(() => (Array.isArray(items) ? items : []), [items]);
  const resultCount = rows?.length ?? 0;

  return (
    <div className="cms-page nice-surface">
      <CmsNavbar />

      <div className="cms-container">
        <header className="cms-header">
          <div className="title-wrap">
            <h1>Productos</h1>
            <div className="subtitle muted" aria-live="polite">
              {loading ? 'Cargando…' : `${resultCount} resultado${resultCount === 1 ? '' : 's'}`}
            </div>
          </div>

          <div className="cms-actions">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                className="cms-btn primary"
                onClick={() => { setShowCreate(s => !s); if (!showCreate) setTimeout(() => nameInputRef.current?.focus(), 0); }}
                title="Agregar nuevo producto"
              >
                {showCreate ? 'Cerrar' : 'Agregar producto'}
              </button>

              <div className="search-wrap">
                <input
                  className="cms-input search"
                  placeholder="Buscar por nombre, marca o categoría…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Buscar productos"
                />
                {search && (
                  <button
                    className="clear-btn"
                    aria-label="Limpiar búsqueda"
                    title="Limpiar"
                    onClick={() => setSearch('')}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className="sort-pill" role="status" aria-live="polite">
              Orden: <strong>{sortBy}</strong> {order === 'asc' ? '↑' : '↓'}
            </div>
          </div>
        </header>

        {err && <div className="cms-alert error" role="alert">{err}</div>}

        {/* Formulario de creación (colapsable) */}
        {showCreate && (
          <div className="create-card">
            <div className="create-grid">
              <input
                ref={nameInputRef}
                className="cms-input"
                placeholder="Nombre del producto *"
                value={newDraft.name ?? ''}
                onChange={(e) => setNewDraft(d => ({ ...d, name: e.target.value }))}
                aria-label="Nombre del nuevo producto"
              />
              <input
                className="cms-input"
                placeholder="Categoría *"
                value={newDraft.category ?? ''}
                onChange={(e) => setNewDraft(d => ({ ...d, category: e.target.value }))}
                aria-label="Categoría del nuevo producto"
              />
              <input
                className="cms-input"
                placeholder="Marca *"
                value={newDraft.brand ?? ''}
                onChange={(e) => setNewDraft(d => ({ ...d, brand: e.target.value }))}
                aria-label="Marca del nuevo producto"
              />
              <input
                className="cms-input"
                placeholder="Imagen (nombre o /data/products/...)"
                value={newDraft.image_url ?? ''}
                onChange={(e) => setNewDraft(d => ({ ...d, image_url: e.target.value }))}
                aria-label="URL de imagen"
              />

              <div className="img-upload">
                <label
                  className={`cms-btn file-btn ${uploadingCreateImage || creating ? 'disabled' : ''}`}
                  aria-disabled={uploadingCreateImage || creating}
                  title="Subir imagen y guardar en /data/products"
                >
                  {uploadingCreateImage ? 'Subiendo…' : 'Subir imagen'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.currentTarget.files?.[0];
                      e.currentTarget.value = '';
                      if (f) uploadImageIntoNewDraft(f);
                    }}
                    disabled={uploadingCreateImage || creating}
                  />
                </label>
                <div className="small">Se guardará en <code>/data/products</code></div>
              </div>
              <input
                className="cms-input"
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                placeholder="Precio (CLP)"
                value={newDraft.price ?? 0}
                onChange={(e) => setNewDraft(d => ({ ...d, price: Number(e.target.value) }))}
                aria-label="Precio"
              />
              <label className="switch" title="Marcar como oferta" style={{ alignSelf: 'center' }}>
                <input
                  type="checkbox"
                  checked={!!newDraft.oferta}
                  onChange={(e) => setNewDraft(d => ({ ...d, oferta: e.target.checked }))}
                  aria-label="En oferta"
                />
                <span className="slider" aria-hidden="true" />
                <span className="switch-label">En oferta</span>
              </label>
            </div>

            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button
                className="cms-btn primary"
                onClick={onCreate}
                disabled={creating}
                aria-busy={creating}
              >
                {creating ? 'Creando…' : 'Crear producto'}
              </button>
              <button
                className="cms-btn ghost"
                onClick={() => { setShowCreate(false); setNewDraft({ name: '', category: '', brand: '', image_url: '', price: 0, oferta: false }); }}
                disabled={creating}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="table-wrap">
          <table className="bw-table" aria-label="Listado de productos">
            <colgroup>
              <col style={{ width: 140 }} />
              <col style={{ width: '30%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: 120 }} />
              <col style={{ width: 100 }} />
              <col style={{ width: 'var(--actions-col-w)' }} />
            </colgroup>

            <thead className="sticky-header">
              <tr>
                <th scope="col">Imagen</th>
                <th
                  scope="col"
                  className={`sortable ${sortBy === 'name' ? `sorted ${order}` : ''}`}
                  onClick={() => toggleSort('name')}
                  title="Ordenar por nombre"
                >
                  Nombre
                </th>
                <th
                  scope="col"
                  className={`sortable ${sortBy === 'category' ? `sorted ${order}` : ''}`}
                  onClick={() => toggleSort('category')}
                  title="Ordenar por categoría"
                >
                  Categoría
                </th>
                <th
                  scope="col"
                  className={`sortable ${sortBy === 'brand' ? `sorted ${order}` : ''}`}
                  onClick={() => toggleSort('brand')}
                  title="Ordenar por marca"
                >
                  Marca
                </th>
                <th
                  scope="col"
                  className={`sortable ${sortBy === 'price' ? `sorted ${order}` : ''}`}
                  onClick={() => toggleSort('price')}
                  title="Ordenar por precio"
                >
                  Precio
                </th>
                <th
                  scope="col"
                  className={`sortable ${sortBy === 'oferta' ? `sorted ${order}` : ''}`}
                  onClick={() => toggleSort('oferta')}
                  title="Ordenar por oferta"
                >
                  Oferta
                </th>
                <th scope="col" className="sticky-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="loading-row">
                    <div className="skeleton-row" />
                    <div className="skeleton-row" />
                    <div className="skeleton-row" />
                  </td>
                </tr>
              )}

              {!loading && (rows ?? []).map(p => {
                const isEdit = editingId === p.id;
                const imgRaw = (isEdit ? draft.image_url : (p.image_url || '')) || '';
                const img = resolveProductImageUrl(imgRaw) || '';
                const oferta = isEdit ? !!draft.oferta : !!p.oferta;

                return (
                  <tr key={p.id} className={isEdit ? 'row-editing' : ''}>
                    <td className="cell-image">
                      <div className="thumb-wrap">
                        <img
                          src={img || placeholderImg()}
                          alt={p.name ? `Imagen de ${p.name}` : 'Imagen de producto'}
                          onError={(e) => { e.currentTarget.src = placeholderImg(); }}
                        />
                        {!isEdit && img && (
                          <a
                            className="thumb-view"
                            href={img}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Abrir imagen en una nueva pestaña"
                          >
                            Ver
                          </a>
                        )}
                      </div>

                      {isEdit && (
                        <div className="img-edit">
                          <input
                            ref={urlInputRef}
                            className="cms-input url-input"
                            placeholder="Imagen (nombre o /data/products/...)"
                            value={draft.image_url ?? ''}
                            onChange={(e) => setDraft(d => ({ ...d, image_url: e.target.value }))}
                            onKeyDown={onEditorKeyDown}
                            aria-label="URL de la imagen"
                          />
                          {draft.image_url && (
                            <a
                              className="open-link"
                              href={img}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Abrir URL de imagen"
                            >
                              ↗
                            </a>
                          )}

                          <div className="img-upload-row">
                            <label
                              className={`cms-btn file-btn ${uploadingEditFor === p.id || saving ? 'disabled' : ''}`}
                              aria-disabled={uploadingEditFor === p.id || saving}
                              title="Subir imagen y luego guardar cambios"
                            >
                              {uploadingEditFor === p.id ? 'Subiendo…' : 'Subir'}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const f = e.currentTarget.files?.[0];
                                  e.currentTarget.value = '';
                                  if (f) uploadImageIntoEditDraft(f);
                                }}
                                disabled={uploadingEditFor === p.id || saving}
                              />
                            </label>
                            <span className="small">Después presiona “Guardar”</span>
                          </div>
                        </div>
                      )}
                    </td>

                    <td>
                      {isEdit ? (
                        <input
                          ref={nameInputRef}
                          className="cms-input"
                          placeholder="Nombre del producto"
                          value={draft.name ?? ''}
                          onChange={(e) => setDraft(d => ({ ...d, name: e.target.value }))}
                          onKeyDown={onEditorKeyDown}
                          aria-label="Nombre"
                        />
                      ) : (
                        <span className="text-ellipsis" title={p.name}>{p.name}</span>
                      )}
                    </td>

                    <td>
                      {isEdit ? (
                        <input
                          className="cms-input"
                          placeholder="Categoría"
                          value={draft.category ?? ''}
                          onChange={(e) => setDraft(d => ({ ...d, category: e.target.value }))}
                          onKeyDown={onEditorKeyDown}
                          aria-label="Categoría"
                        />
                      ) : (
                        <span className="text-ellipsis" title={p.category}>{p.category}</span>
                      )}
                    </td>

                    <td>
                      {isEdit ? (
                        <input
                          className="cms-input"
                          placeholder="Marca"
                          value={draft.brand ?? ''}
                          onChange={(e) => setDraft(d => ({ ...d, brand: e.target.value }))}
                          onKeyDown={onEditorKeyDown}
                          aria-label="Marca"
                        />
                      ) : (
                        <span className="text-ellipsis" title={p.brand}>{p.brand}</span>
                      )}
                    </td>

                    <td>
                      {isEdit ? (
                        <input
                          className="cms-input"
                          type="number"
                          inputMode="numeric"
                          min={0}
                          step={1}
                          value={Number(draft.price ?? 0)}
                          onChange={(e) => setDraft(d => ({ ...d, price: Number(e.target.value) }))}
                          onKeyDown={onEditorKeyDown}
                          aria-label="Precio en CLP"
                        />
                      ) : (
                        <span>{fmtCLP(p.price)}</span>
                      )}
                    </td>

                    <td>
                      {isEdit ? (
                        <label className="switch" title="Marcar como oferta">
                          <input
                            type="checkbox"
                            checked={!!draft.oferta}
                            onChange={(e) => setDraft(d => ({ ...d, oferta: e.target.checked }))}
                            onKeyDown={onEditorKeyDown}
                            aria-label="En oferta"
                          />
                          <span className="slider" aria-hidden="true" />
                          <span className="switch-label">En oferta</span>
                        </label>
                      ) : (
                        <span className={`status-pill ${oferta ? 'on' : 'off'}`} aria-label={oferta ? 'En oferta' : 'Sin oferta'}>
                          {oferta ? 'Sí' : 'No'}
                        </span>
                      )}
                    </td>

                    <td className="row-actions sticky-right">
                      {isEdit ? (
                        <>
                          <button
                            className="cms-btn primary"
                            onClick={saveEdit}
                            disabled={saving}
                            aria-busy={saving}
                            title="Guardar cambios (Enter)"
                          >
                            {saving ? 'Guardando…' : 'Guardar'}
                          </button>
                          <button
                            className="cms-btn ghost"
                            onClick={cancelEdit}
                            disabled={saving}
                            title="Cancelar cambios (Esc)"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <button
                          className="cms-btn outline"
                          onClick={() => startEdit(p)}
                          title="Editar fila"
                        >
                          Editar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {!loading && (!rows || rows.length === 0) && (
                <tr>
                  <td colSpan={7} className="muted empty-state">
                    <div className="empty-card">
                      <div className="empty-title">Sin resultados</div>
                      <div className="empty-desc">Prueba ajustando la búsqueda o el orden.</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

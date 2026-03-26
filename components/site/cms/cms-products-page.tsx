"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { CmsNavbar } from "@/components/site/cms/cms-navbar";
import { cmsAuth } from "@/lib/cms-auth";
import { CmsProductsRepository, type CmsProduct } from "@/lib/cms-products";
import { normalizeProductImageUrlForDb } from "@/lib/cms-media";

type SortBy = "name" | "brand" | "category" | "price" | "oferta";
type Order = "asc" | "desc";

const repo = new CmsProductsRepository();

const initialDraft: Partial<CmsProduct> = {
  name: "",
  category: "",
  brand: "",
  image_url: "",
  price: 0,
  oferta: false,
  model_code: "",
  oem_code: "",
  description: "",
  voltage: "",
  amp_rating: undefined,
  watt_rating: undefined,
  led_count: undefined,
  kelvin: undefined,
  color: "",
  beam_pattern: "",
  series: "",
  lens_color: "",
  attributes: undefined,
};

const PAGE_SIZE = 10;

function fmtCLP(value: number | string | null | undefined) {
  const numberValue = typeof value === "string" ? Number(value) : (value ?? 0);
  return Number.isFinite(numberValue)
    ? numberValue.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 })
    : "$0";
}

function placeholderImg(text = "sin imagen") {
  return (
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="110"><rect width="100%" height="100%" fill="#f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-family="Arial" font-size="14">${text}</text></svg>`,
    )
  );
}

export function CmsProductsPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [uploadingCreateImage, setUploadingCreateImage] = useState(false);
  const [uploadingEditFor, setUploadingEditFor] = useState<number | null>(null);
  const [items, setItems] = useState<CmsProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [order, setOrder] = useState<Order>("asc");
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Partial<CmsProduct>>({});
  const [showCreate, setShowCreate] = useState(false);
  const [newDraft, setNewDraft] = useState<Partial<CmsProduct>>(initialDraft);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!cmsAuth.isLoggedIn()) {
      router.replace("/cms/login");
      return;
    }
    if (!cmsAuth.isMfaEnabled()) {
      router.replace("/cms/mfa");
      return;
    }
    setReady(true);
  }, [router]);

  useEffect(() => {
    setPage(1);
  }, [search, sortBy, order]);

  useEffect(() => {
    if (!ready) return;
    const timeout = window.setTimeout(() => {
      void (async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await repo.list({
            search,
            sortBy,
            order,
            page,
            limit: PAGE_SIZE,
          });
          setItems(response.items || []);
          setTotal(response.total || 0);
        } catch (listError) {
          if (listError instanceof Error && listError.message === "UNAUTHORIZED") {
            cmsAuth.clear();
            router.replace("/cms/login");
            return;
          }
          setError(listError instanceof Error ? listError.message : "Error al cargar productos.");
        } finally {
          setLoading(false);
        }
      })();
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [ready, router, search, sortBy, order, page]);

  useEffect(() => {
    if (!editingId) return;
    const timeout = window.setTimeout(() => nameInputRef.current?.focus(), 0);
    return () => window.clearTimeout(timeout);
  }, [editingId]);

  const rows = useMemo(() => (Array.isArray(items) ? items : []), [items]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageNumbers = useMemo(() => {
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    const adjustedStart = Math.max(1, end - 4);
    return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index);
  }, [page, totalPages]);

  function startEdit(product: CmsProduct) {
    setEditingId(product.id);
    setDraft({
      id: product.id,
      name: product.name,
      category: product.category,
      brand: product.brand,
      image_url: product.image_url ?? "",
      price: product.price ?? 0,
      oferta: product.oferta,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft({});
  }

  async function saveEdit() {
    if (!editingId || saving) return;
    try {
      setSaving(true);
      setError(null);
      const updated = await repo.update(editingId, {
        name: draft.name,
        category: draft.category,
        brand: draft.brand,
        image_url: normalizeProductImageUrlForDb(String(draft.image_url ?? "")),
        price: Number(draft.price ?? 0),
        oferta: !!draft.oferta,
      });
      setItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      cancelEdit();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "No se pudo actualizar.");
    } finally {
      setSaving(false);
    }
  }

  async function uploadImageIntoNewDraft(file: File) {
    try {
      setUploadingCreateImage(true);
      const { path } = await repo.uploadProductImage(file);
      setNewDraft((current) => ({ ...current, image_url: path }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "No se pudo subir la imagen.");
    } finally {
      setUploadingCreateImage(false);
    }
  }

  async function uploadImageIntoEditDraft(productId: number, file: File) {
    try {
      setUploadingEditFor(productId);
      const { path } = await repo.uploadProductImage(file);
      const normalizedPath = normalizeProductImageUrlForDb(path);
      const updated = await repo.update(productId, {
        image_url: normalizedPath,
      });
      setItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setDraft((current) => ({ ...current, image_url: normalizedPath }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "No se pudo subir la imagen.");
    } finally {
      setUploadingEditFor(null);
    }
  }

  async function handleCreate() {
    if (creating) return;
    if (!newDraft.name || !newDraft.category || !newDraft.brand) {
      setError("Nombre, categoría y marca son obligatorios.");
      return;
    }

    try {
      setCreating(true);
      setError(null);
      const created = await repo.create({
        ...newDraft,
        image_url: normalizeProductImageUrlForDb(String(newDraft.image_url ?? "")) || undefined,
        price: newDraft.price == null ? undefined : Number(newDraft.price),
        oferta: !!newDraft.oferta,
      });
      if (page === 1) {
        setItems((current) => [created, ...current].slice(0, PAGE_SIZE));
      }
      setTotal((current) => current + 1);
      setShowCreate(false);
      setNewDraft(initialDraft);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "No se pudo crear el producto.");
    } finally {
      setCreating(false);
    }
  }

  function onEditorKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void saveEdit();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      cancelEdit();
    }
  }

  if (!ready) return <div className="min-h-screen bg-[#0d132b]" />;

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <CmsNavbar />
      <div className="mx-auto w-full max-w-[1320px] px-4 py-8 sm:px-6">
        <div className="rounded-[32px] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h1 className="text-[2.1rem] font-black tracking-[-0.05em] text-[#111827]">Productos</h1>
              <p className="mt-2 text-sm text-slate-500">
                {loading
                  ? "Cargando..."
                  : `${total} producto${total === 1 ? "" : "s"} • pagina ${page} de ${totalPages}`}
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#e63a39] px-5 text-sm font-black text-white shadow-[0_16px_30px_rgba(230,58,57,0.2)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d63231]"
                onClick={() => setShowCreate((current) => !current)}
              >
                {showCreate ? "Cerrar formulario" : "Agregar producto"}
              </button>
              <div className="flex min-w-[260px] items-center rounded-2xl border border-slate-200 bg-white px-3 shadow-[0_6px_18px_rgba(15,23,42,0.04)]">
                <input
                  className="h-12 w-full bg-transparent text-sm font-medium text-slate-900 outline-none"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar por nombre, marca o categoría..."
                />
                {search ? (
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    onClick={() => setSearch("")}
                    aria-label="Limpiar búsqueda"
                  >
                    ×
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {error ? <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</div> : null}
          {showCreate ? (
            <div className="mt-6 rounded-[28px] border border-slate-200 bg-[#fafbff] p-5">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {[
                  ["name", "Nombre del producto *"],
                  ["category", "Categoría *"],
                  ["brand", "Marca *"],
                  ["image_url", "Ruta imagen (/data/products/...)"],
                  ["model_code", "Model code"],
                  ["oem_code", "OEM code"],
                  ["voltage", "Voltaje"],
                  ["color", "Color"],
                  ["beam_pattern", "Beam pattern"],
                  ["series", "Serie"],
                  ["lens_color", "Color lente"],
                ].map(([key, label]) => (
                  <input
                    key={key}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-[#1d2f6f] focus:shadow-[0_0_0_4px_rgba(29,47,111,0.1)]"
                    placeholder={label}
                    value={String(newDraft[key as keyof CmsProduct] ?? "")}
                    onChange={(event) => setNewDraft((current) => ({ ...current, [key]: event.target.value }))}
                  />
                ))}
              </div>

              <textarea
                className="mt-3 min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-[#1d2f6f] focus:shadow-[0_0_0_4px_rgba(29,47,111,0.1)]"
                placeholder="Descripción"
                value={String(newDraft.description ?? "")}
                onChange={(event) => setNewDraft((current) => ({ ...current, description: event.target.value }))}
              />

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#1d2f6f] transition hover:border-[#1d2f6f]">
                  {uploadingCreateImage ? "Subiendo JPG..." : "Seleccionar JPG"}
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,image/jpeg"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      event.target.value = "";
                      if (file) void uploadImageIntoNewDraft(file);
                    }}
                  />
                </label>
                {newDraft.image_url ? (
                  <span className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700">
                    Ruta asignada: {String(newDraft.image_url)}
                  </span>
                ) : (
                  <span className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-medium text-slate-500">
                    El JPG se guarda en backend y esa ruta se enviara a image_url al crear el producto.
                  </span>
                )}
                <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={!!newDraft.oferta}
                    onChange={(event) => setNewDraft((current) => ({ ...current, oferta: event.target.checked }))}
                  />
                  Marcar como oferta
                </label>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#e63a39] px-5 text-sm font-black text-white shadow-[0_16px_30px_rgba(230,58,57,0.2)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d63231] disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={creating}
                  onClick={handleCreate}
                >
                  {creating ? "Creando..." : "Crear producto"}
                </button>
                <button
                  type="button"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-[#1d2f6f] transition hover:border-[#1d2f6f] hover:bg-[#f5f7ff]"
                  onClick={() => {
                    setShowCreate(false);
                    setNewDraft(initialDraft);
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : null}

          <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm text-slate-700">
                <thead className="bg-[#f8fbff] text-xs font-black uppercase tracking-[0.18em] text-[#1d2f6f]">
                  <tr>
                    <th className="px-4 py-4">Imagen</th>
                    <th className="px-4 py-4">Nombre</th>
                    <th className="px-4 py-4">Categoría</th>
                    <th className="px-4 py-4">Marca</th>
                    <th className="px-4 py-4">Precio</th>
                    <th className="px-4 py-4">Oferta</th>
                    <th className="px-4 py-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                        Cargando productos...
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                        No hay resultados para la búsqueda actual.
                      </td>
                    </tr>
                  ) : (
                    rows.map((product, index) => {
                      const isEdit = editingId === product.id;
                      const imageUrl = String((isEdit ? draft.image_url : product.image_url) ?? "");
                      return (
                        <tr key={product.id} className={`border-t border-slate-200 ${index % 2 === 0 ? "bg-white" : "bg-[#fcfdff]"}`}>
                          <td className="px-4 py-4 align-top">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imageUrl || placeholderImg()}
                              alt={product.name}
                              className="h-[86px] w-[126px] rounded-2xl border border-slate-200 object-cover"
                              onError={(event) => {
                                event.currentTarget.src = placeholderImg();
                              }}
                            />
                            {isEdit ? (
                              <div className="mt-3 space-y-2">
                                <input
                                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none transition focus:border-[#1d2f6f] focus:shadow-[0_0_0_4px_rgba(29,47,111,0.1)]"
                                  value={String(draft.image_url ?? "")}
                                  placeholder="Ruta imagen"
                                  onChange={(event) => setDraft((current) => ({ ...current, image_url: event.target.value }))}
                                  onKeyDown={onEditorKeyDown}
                                />
                                <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#1d2f6f] transition hover:border-[#1d2f6f]">
                                  {uploadingEditFor === product.id ? "Subiendo JPG..." : "Explorar JPG"}
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept=".jpg,.jpeg,image/jpeg"
                                    onChange={(event) => {
                                      const file = event.target.files?.[0];
                                      event.target.value = "";
                                      if (file) void uploadImageIntoEditDraft(product.id, file);
                                    }}
                                  />
                                </label>
                                <p className="text-[11px] font-medium text-slate-500">
                                  La ruta se guarda automaticamente en image_url del producto.
                                </p>
                              </div>
                            ) : null}
                          </td>
                          <td className="px-4 py-4 align-top">
                            {isEdit ? (
                              <input
                                ref={nameInputRef}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-[#1d2f6f] focus:shadow-[0_0_0_4px_rgba(29,47,111,0.1)]"
                                value={String(draft.name ?? "")}
                                onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                                onKeyDown={onEditorKeyDown}
                              />
                            ) : (
                              <span className="font-semibold text-slate-900">{product.name}</span>
                            )}
                          </td>
                          <td className="px-4 py-4 align-top">
                            {isEdit ? (
                              <input
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-[#1d2f6f] focus:shadow-[0_0_0_4px_rgba(29,47,111,0.1)]"
                                value={String(draft.category ?? "")}
                                onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
                                onKeyDown={onEditorKeyDown}
                              />
                            ) : (
                              product.category
                            )}
                          </td>
                          <td className="px-4 py-4 align-top">
                            {isEdit ? (
                              <input
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-[#1d2f6f] focus:shadow-[0_0_0_4px_rgba(29,47,111,0.1)]"
                                value={String(draft.brand ?? "")}
                                onChange={(event) => setDraft((current) => ({ ...current, brand: event.target.value }))}
                                onKeyDown={onEditorKeyDown}
                              />
                            ) : (
                              product.brand
                            )}
                          </td>
                          <td className="px-4 py-4 align-top">
                            {isEdit ? (
                              <input
                                type="number"
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-[#1d2f6f] focus:shadow-[0_0_0_4px_rgba(29,47,111,0.1)]"
                                value={Number(draft.price ?? 0)}
                                onChange={(event) => setDraft((current) => ({ ...current, price: Number(event.target.value) }))}
                                onKeyDown={onEditorKeyDown}
                              />
                            ) : (
                              fmtCLP(product.price)
                            )}
                          </td>
                          <td className="px-4 py-4 align-top">
                            {isEdit ? (
                              <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600">
                                <input
                                  type="checkbox"
                                  checked={!!draft.oferta}
                                  onChange={(event) => setDraft((current) => ({ ...current, oferta: event.target.checked }))}
                                />
                                En oferta
                              </label>
                            ) : (
                              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${product.oferta ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                                {product.oferta ? "Sí" : "No"}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 align-top">
                            <div className="flex flex-wrap gap-2">
                              {isEdit ? (
                                <>
                                  <button
                                    type="button"
                                    className="inline-flex h-10 items-center justify-center rounded-xl bg-[#e63a39] px-4 text-xs font-black text-white transition hover:bg-[#d63231] disabled:opacity-70"
                                    disabled={saving}
                                    onClick={() => void saveEdit()}
                                  >
                                    {saving ? "Guardando..." : "Guardar"}
                                  </button>
                                  <button
                                    type="button"
                                    className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-[#1d2f6f] transition hover:border-[#1d2f6f] hover:bg-[#f5f7ff]"
                                    disabled={saving}
                                    onClick={cancelEdit}
                                  >
                                    Cancelar
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-[#1d2f6f] transition hover:border-[#1d2f6f] hover:bg-[#f5f7ff]"
                                  onClick={() => startEdit(product)}
                                >
                                  Editar
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {rows.length > 0 ? (
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Mostrando {Math.min((page - 1) * PAGE_SIZE + 1, total)} - {Math.min(page * PAGE_SIZE, total)} de {total}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-[#1d2f6f] transition hover:border-[#1d2f6f] hover:bg-[#f5f7ff] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Anterior
                </button>
                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-bold transition ${
                      pageNumber === page
                        ? "bg-[#1d2f6f] text-white"
                        : "border border-slate-200 bg-white text-[#1d2f6f] hover:border-[#1d2f6f] hover:bg-[#f5f7ff]"
                    }`}
                    disabled={loading}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-[#1d2f6f] transition hover:border-[#1d2f6f] hover:bg-[#f5f7ff] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                >
                  Siguiente
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

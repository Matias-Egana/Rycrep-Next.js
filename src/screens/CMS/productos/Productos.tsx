import React, { useEffect, useState } from "react";
import "./Productos.css";
import { cmsAuth } from "../../../lib/cmsAuth";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

type ProductRow = {
  id: number | string;
  name: string;
  code: string;
  oferta: boolean;
  price: number | null;
  imageUrl?: string | null;

  // snapshot original para "Deshacer"
  _origOferta: boolean;
  _origPrice: number | null;

  // estado UI
  priceInput: string;
  dirty: boolean;
  saving: boolean;
  error: string | null;
};

function toRow(p: any): ProductRow {
  const id = p.id ?? p.pk ?? String(p.model_code ?? Math.random());
  const name = p.name ?? p.title ?? "Producto";
  const code = p.model_code ?? p.modelCode ?? "";
  const oferta = Boolean(p.oferta);
  const price = p.price ?? null;
  const imageUrl = p.image_url ?? p.image ?? null;

  return {
    id,
    name,
    code,
    oferta,
    price,
    imageUrl,

    _origOferta: oferta,
    _origPrice: price,

    priceInput: price != null ? String(price) : "",
    dirty: false,
    saving: false,
    error: null,
  };
}

function pickListPayload(json: any): any[] {
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.results)) return json.results;
  return [];
}

const fmtCLP = (n: number | null | undefined) =>
  n == null
    ? "—"
    : new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
      }).format(n);

const parseCLP = (s: string): number | null => {
  if (!s || !s.trim()) return null;
  const normalized = s.replace(/\./g, "").replace(/,/g, "");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
};

// ✅ Construye headers como Record<string,string>
function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  try {
    const token = cmsAuth?.getAccess?.();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  } catch {
    // noop
  }
  return headers;
}

export default function Productos() {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // 🧹 FIX: limpia backdrops/overlays o <dialog> abiertos que bloquean la UI
  useEffect(() => {
    document.documentElement.classList.remove("modal-open", "drawer-open");
    document.body.classList.remove("modal-open", "drawer-open");
    document.body.style.overflow = "";

    document
      .querySelectorAll(
        ".modal-backdrop, .backdrop, [data-backdrop], .overlay, .drawer-overlay"
      )
      .forEach((el) => el.remove());

    document.querySelectorAll("dialog[open]").forEach((d) => {
      try {
        (d as HTMLDialogElement).close();
      } catch {}
    });
  }, []);

  async function load() {
    setLoading(true);
    setGlobalError(null);
    try {
      const res = await fetch(`${API_BASE}/products/?ordering=-created_at`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("No se pudo obtener el listado.");
      const json = await res.json();
      const list = pickListPayload(json).map(toRow);
      setRows(list);
    } catch (e: any) {
      setGlobalError(e?.message || "Error al cargar productos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onToggleOferta(id: ProductRow["id"]) {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              oferta: !r.oferta,
              priceInput: !r.oferta
                ? r.priceInput || (r.price != null ? String(r.price) : "")
                : r.priceInput,
              dirty: true,
              error: null,
            }
          : r
      )
    );
  }

  function onChangePrice(id: ProductRow["id"], value: string) {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, priceInput: value, dirty: true, error: null } : r
      )
    );
  }

  function resetRow(id: ProductRow["id"]) {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              oferta: r._origOferta,
              price: r._origPrice,
              priceInput: r._origPrice != null ? String(r._origPrice) : "",
              dirty: false,
              error: null,
            }
          : r
      )
    );
  }

  async function saveRow(id: ProductRow["id"]) {
    const current = rows.find((r) => r.id === id);
    if (!current) return;

    if (current.oferta) {
      const parsed = parseCLP(current.priceInput);
      if (parsed == null || parsed <= 0) {
        setRows((prev) =>
          prev.map((r) =>
            r.id === id
              ? { ...r, error: "El precio es obligatorio y debe ser mayor a 0." }
              : r
          )
        );
        return;
      }
    }

    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, saving: true, error: null } : r))
    );

    const body = {
      oferta: current.oferta,
      price: current.oferta ? parseCLP(current.priceInput) : null,
    };

    try {
      const res = await fetch(`${API_BASE}/products/${id}/`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        const msg =
          detail?.price?.[0] ||
          detail?.detail ||
          "No se pudo guardar. Verifica los datos.";
        throw new Error(msg);
      }

      const newPrice = body.price ?? null;
      const newOferta = Boolean(body.oferta);
      setRows((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                price: newPrice,
                oferta: newOferta,
                _origPrice: newPrice,
                _origOferta: newOferta,
                priceInput: newPrice != null ? String(newPrice) : "",
                dirty: false,
                saving: false,
                error: null,
              }
            : r
        )
      );
    } catch (e: any) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, saving: false, error: e?.message || "Error al guardar." }
            : r
        )
      );
    }
  }

  const filtered = rows.filter((r) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(s) ||
      r.code.toLowerCase().includes(s) ||
      String(r.id).includes(s)
    );
  });

  return (
    <div className="cms-products">
      <header className="toolbar">
        <h1 className="title">CMS — Productos</h1>
        <div className="controls">
          <input
            className="input"
            placeholder="Buscar nombre, código o ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn ghost" onClick={load}>
            Recargar
          </button>
        </div>
      </header>

      {loading && <div className="notice">Cargando…</div>}
      {globalError && <div className="error">{globalError}</div>}

      {!loading && !globalError && (
        <>
          <div className="meta">
            Mostrando <strong>{filtered.length}</strong> / {rows.length}
          </div>

          <div className="table">
            <div className="thead">
              <div>Producto</div>
              <div>Código</div>
              <div className="center">Oferta</div>
              <div>Precio (CLP)</div>
              <div>Precio actual</div>
              <div className="right">Acciones</div>
            </div>

            <div className="tbody">
              {filtered.map((r) => (
                <div key={String(r.id)} className={`trow ${r.dirty ? "dirty" : ""}`}>
                  <div className="cell name">
                    <div className="stack">
                      {r.imageUrl ? (
                        <img className="thumb" src={r.imageUrl} alt={r.name} />
                      ) : (
                        <div className="thumb placeholder" />
                      )}
                      <div className="text">
                        <div className="pname">{r.name}</div>
                        <div className="muted">
                          ID: {r.id} · <span className="mono">{r.code || "—"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="cell code">
                    <span className="mono">{r.code || "—"}</span>
                  </div>

                  <div className="cell center">
                    <input
                      type="checkbox"
                      checked={r.oferta}
                      onChange={() => onToggleOferta(r.id)}
                    />
                  </div>

                  <div className="cell">
                    <input
                      className={`input ${r.error ? "error" : ""}`}
                      placeholder={r.oferta ? "Ej: 49990" : "—"}
                      value={r.priceInput}
                      onChange={(e) => onChangePrice(r.id, e.target.value)}
                      disabled={!r.oferta}
                      inputMode="numeric"
                    />
                    {r.error && <div className="error small">{r.error}</div>}
                  </div>

                  <div className="cell">
                    <span className="mono">{fmtCLP(r.price)}</span>
                  </div>

                  <div className="cell right">
                    <div className="actions">
                      <button
                        className="btn"
                        disabled={r.saving || !r.dirty}
                        onClick={() => saveRow(r.id)}
                      >
                        {r.saving ? "Guardando…" : "Guardar"}
                      </button>
                      <button
                        className="btn ghost"
                        disabled={r.saving || !r.dirty}
                        onClick={() => resetRow(r.id)}
                      >
                        Deshacer
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="trow empty">
                  <div className="cell span">Sin coincidencias.</div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

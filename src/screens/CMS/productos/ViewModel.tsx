// src/screens/CMS/productos/ViewModel.tsx
import { useEffect, useMemo, useState } from "react";
import { GetAllProducts } from "../../../domain/usecases/GetAllProducts";
import { ProductRepository } from "../../../data/repositories/ProductRepository";
import type { RycrepProduct } from "../../../domain/entities/RycrepProduct";
import { cmsAuth } from "../../../lib/cmsAuth";

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

export type ProductRow = {
  id: number;
  name: string;
  code: string;
  oferta: boolean;
  price: number | null;
  imageUrl?: string | null;

  // estado original (para reset)
  _origOferta: boolean;
  _origPrice: number | null;

  // UI state
  dirty: boolean;
  saving: boolean;
  error?: string | null;
  priceInput: string;
};

const toRow = (p: RycrepProduct): ProductRow => {
  const id = (p as any).id;
  const name = (p as any).name ?? (p as any).title ?? "Producto";
  const code = (p as any).model_code ?? (p as any).modelCode ?? "";
  const oferta = Boolean((p as any).oferta);
  const price = (p as any).price ?? null;
  const imageUrl = (p as any).image_url ?? (p as any).image ?? null;

  return {
    id,
    name,
    code,
    oferta,
    price,
    imageUrl,

    _origOferta: oferta,
    _origPrice: price,

    dirty: false,
    saving: false,
    error: null,
    priceInput: price != null ? String(price) : "",
  };
};

const parseCLP = (s: string): number | null => {
  if (!s?.trim()) return null;
  const n = Number(s.replace(/\./g, "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
};

export function useProductosVM() {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "oferta" | "sin_oferta">("all");
  const [search, setSearch] = useState("");

  const useCase = useMemo(() => new GetAllProducts(new ProductRepository()), []);

  async function load() {
    setLoading(true);
    setGlobalError(null);
    try {
      const list = await useCase.execute({ category: "all" });
      setRows(list.map(toRow));
    } catch (e: any) {
      setGlobalError(e?.message || "No se pudo cargar el listado.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []); // eslint-disable-line

  function toggleOferta(id: number) {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const nueva = !r.oferta;
        return {
          ...r,
          oferta: nueva,
          // si activamos, prellenar con precio existente o dejar vacío
          priceInput: nueva ? (r.priceInput || (r.price != null ? String(r.price) : "")) : "",
          dirty: true,
          error: null,
        };
      })
    );
  }

  function changePrice(id: number, value: string) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, priceInput: value, dirty: true, error: null } : r))
    );
  }

  function validateRow(r: ProductRow): string | null {
    if (r.oferta) {
      const parsed = parseCLP(r.priceInput);
      if (parsed == null || parsed <= 0) return "El precio es obligatorio y debe ser mayor a 0.";
    }
    return null;
  }

  async function saveRow(id: number) {
    // Marcar guardando
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, saving: true, error: null } : r)));

    // Tomamos snapshot actual del row
    const current = rows.find((x) => x.id === id);
    if (!current) return;

    const validation = validateRow(current);
    if (validation) {
      setRows((prev) =>
        prev.map((x) => (x.id === id ? { ...x, saving: false, error: validation } : x))
      );
      return;
    }

    const oferta = current.oferta;
    const price = oferta ? parseCLP(current.priceInput) : null;

    try {
      const res = await fetch(`${API_BASE}/products/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(cmsAuth.getAccess() && { Authorization: `Bearer ${cmsAuth.getAccess()}` }),
        },
        body: JSON.stringify({ oferta, price }),
      });

      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        const msg =
          detail?.price?.[0] ||
          detail?.detail ||
          "No se pudo guardar. Verifica los datos.";
        throw new Error(msg);
      }

      // Sincronizamos nuevo estado como "original"
      setRows((prev) =>
        prev.map((x) =>
          x.id === id
            ? {
                ...x,
                price: price,
                _origPrice: price,
                _origOferta: oferta,
                priceInput: price != null ? String(price) : "",
                dirty: false,
                saving: false,
                error: null,
              }
            : x
        )
      );
    } catch (e: any) {
      setRows((prev) =>
        prev.map((x) =>
          x.id === id ? { ...x, saving: false, error: e?.message || "Error al guardar." } : x
        )
      );
    }
  }

  function resetRow(id: number) {
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

  const filtered = rows.filter((r) => {
    if (filter === "oferta" && !r.oferta) return false;
    if (filter === "sin_oferta" && r.oferta) return false;
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      const ok = r.name.toLowerCase().includes(s) || r.code.toLowerCase().includes(s);
      if (!ok) return false;
    }
    return true;
  });

  return {
    state: {
      loading,
      globalError,
      rows: filtered,
      total: rows.length,
      filter,
      search,
    },
    actions: {
      reload: load,
      toggleOferta,
      changePrice,
      saveRow,
      resetRow,
      setFilter,
      setSearch,
    },
  };
}

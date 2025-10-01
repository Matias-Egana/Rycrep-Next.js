import { useEffect, useMemo, useState } from "react";
import { GetAllProductsUseCase } from "../../../domain/usecases/GetAllProducts";
import { UpdateProductUseCase } from "../../../domain/usecases/UpdateProduct";
import { ProductRepository as DataProductRepository } from "../../../data/repositories/ProductRepository";
import type { RycrepProduct } from "../../../domain/entities/RycrepProduct";

const getAll = new GetAllProductsUseCase(new DataProductRepository());
const updateUC = new UpdateProductUseCase(new DataProductRepository());

export type EditableRow = {
  id: number | string;
  name: string;
  brand?: string | null;
  model_code?: string | null;
  oferta: boolean;
  price: number;
  discount_price?: number | null;

  // UI helpers
  saving?: boolean;
  error?: string | null;
  dirty?: boolean;
};

export function useCmsProductsVM() {
  const [rows, setRows] = useState<EditableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    try {
      const items = await getAll.execute({ search: q || undefined });
      setRows(items.map(mapToRow));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (!q) return rows;
    const needle = q.toLowerCase();
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        (r.brand || "").toLowerCase().includes(needle) ||
        (r.model_code || "").toLowerCase().includes(needle)
    );
  }, [rows, q]);

  function onToggleOferta(id: EditableRow["id"], next: boolean) {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              oferta: next,
              // si recién activas oferta y no hay discount_price, propón 10% off
              discount_price:
                next && (r.discount_price == null || r.discount_price <= 0)
                  ? Math.max(0, Math.round(r.price * 0.9))
                  : r.discount_price ?? null,
              dirty: true,
              error: null,
            }
          : r
      )
    );
  }

  function onChangePrice(id: EditableRow["id"], price: number) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, price, dirty: true, error: null } : r))
    );
  }

  function onChangeDiscountPrice(id: EditableRow["id"], discount_price: number) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, discount_price, dirty: true, error: null } : r))
    );
  }

  async function saveRow(id: EditableRow["id"]) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, saving: true, error: null } : r)));
    try {
      const row = rows.find((r) => r.id === id)!;

      // Reglas:
      // - Siempre puedes editar "price".
      // - Si oferta = true, discount_price es requerido y debe ser < price.
      // - Si oferta = false, discount_price se ignora (puedes enviarlo undefined).
      if (row.oferta) {
        if (row.discount_price == null || row.discount_price <= 0) {
          throw new Error("Ingresa un precio de oferta válido.");
        }
        if (row.discount_price >= row.price) {
          throw new Error("El precio de oferta debe ser menor al precio normal.");
        }
      }

      const patch = {
        id: row.id,
        price: Number(row.price),
        oferta: row.oferta,
        ...(row.oferta ? { discount_price: Number(row.discount_price) } : { discount_price: null }),
      };

      const updated = await updateUC.execute(patch);

      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...mapToRow(updated), saving: false, dirty: false } : r))
      );
    } catch (e: any) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, saving: false, error: e?.message || "Error al guardar." } : r
        )
      );
    }
  }

  return {
    state: { rows: filtered, total: rows.length, loading, q },
    actions: { setQ, load, onToggleOferta, onChangePrice, onChangeDiscountPrice, saveRow },
  };
}

function mapToRow(p: RycrepProduct): EditableRow {
  // Ajusta estos campos según tu mapper RycrepProduct
  return {
    id: (p as any).id ?? (p as any).pk ?? (p as any).product_id ?? (p as any).product_code, // robusto
    name: (p as any).name,
    brand: (p as any).brand ?? null,
    model_code: (p as any).model_code ?? null,
    price: Number((p as any).price ?? 0),
    oferta: Boolean((p as any).oferta ?? false),
    discount_price:
      (p as any).discount_price != null
        ? Number((p as any).discount_price)
        : (p as any).discountPrice != null
        ? Number((p as any).discountPrice)
        : null,
    dirty: false,
    saving: false,
    error: null,
  };
}

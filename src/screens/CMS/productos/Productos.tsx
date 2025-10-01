// src/screens/CMS/productos/Productos.tsx
import { useCmsProductsVM } from "./ViewModel";
import "./Productos.css";

export default function CmsProductos() {
  const { state, actions } = useCmsProductsVM();

  return (
    <div className="cms-products">
      <div className="cms-products__header">
        <h1>Productos</h1>
        <input
          className="cms-products__search"
          placeholder="Buscar por nombre, marca o modelo…"
          value={state.q}
          onChange={(e) => actions.setQ(e.target.value)}
        />
      </div>

      {state.loading ? (
        <div className="cms-products__loading">Cargando…</div>
      ) : (
        <>
          <div className="cms-products__count">
            {state.rows.length} de {state.total} resultados
          </div>

          <div className="cms-products__table">
            <div className="tbl-row tbl-head">
              <div className="tbl-cell name">Producto</div>
              <div className="tbl-cell brand">Marca</div>
              <div className="tbl-cell code">Modelo</div>
              <div className="tbl-cell price">Precio</div>
              <div className="tbl-cell oferta">Oferta</div>
              <div className="tbl-cell actions">Acciones</div>
            </div>

            {state.rows.map((r) => (
              <div key={r.id} className={`tbl-row tbl-body ${r.dirty ? "is-dirty" : ""}`}>
                <div className="tbl-cell name">{r.name}</div>
                <div className="tbl-cell brand">{r.brand || "—"}</div>
                <div className="tbl-cell code">{r.model_code || "—"}</div>

                <div className="tbl-cell price">
                  <input
                    type="number"
                    min={0}
                    step="1"
                    value={Number.isFinite(r.price) ? r.price : 0}
                    onChange={(e) => actions.onChangePrice(r.id, Number(e.target.value))}
                  />
                </div>

                <div className="tbl-cell oferta">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={r.oferta}
                      onChange={(e) => actions.onToggleOferta(r.id, e.target.checked)}
                    />
                    <span className="slider" />
                  </label>
                </div>

                <div className="tbl-cell actions">
                  <button
                    className="btn"
                    disabled={!!r.saving}
                    onClick={() => actions.saveRow(r.id)}
                  >
                    {r.saving ? "Guardando…" : r.dirty ? "Guardar" : "OK"}
                  </button>
                  {/* Si quieres, muestra error por fila aquí */}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

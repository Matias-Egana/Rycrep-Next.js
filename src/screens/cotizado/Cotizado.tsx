import React, { useContext, useState } from 'react';
import './Cotizado.css';
import { CartContext } from '../../domain/entities/context/CartContext';
import type { CartProduct } from '../../domain/entities/context/CartContext';

const Cotizado: React.FC = () => {
  const cartContext = useContext(CartContext);
  const cart: CartProduct[] = cartContext?.cart || [];

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    empresa: '',
    ciudad: '',
    region: '',
    mensaje: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const parseNumber = (value: any) => {
    const n = Number(value);
    return isNaN(n) ? 0 : n;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const cartData = cart.map(p => ({
        name: p.name,
        product_code: p.product_code,
        quantity: parseNumber(p.quantity),
        // price removido del payload visible, pero si el backend lo requiere puedes dejarlo en 0
        price: 0,
      }));

      const res = await fetch(`${API_BASE_URL}/send-cotizacion/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userData: formData, productos: cartData }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Error desconocido del servidor');
      }

      setStatus('✅ Cotización enviada correctamente.');
      setFormData({
        nombre: '',
        apellidos: '',
        email: '',
        telefono: '',
        empresa: '',
        ciudad: '',
        region: '',
        mensaje: '',
      });

      cartContext?.clearCart();

    } catch (err: any) {
      setStatus(err.message || '❌ Ocurrió un error al enviar la cotización');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="formSection">
        <h2 className="title">Solicita tu cotización</h2>
        <p className="subtitle">
          Completa tus datos y revisa los productos en el carrito. <br />
          <strong>
            Los productos que están en el carrito se enviarán a la empresa para su cotización y nos pondremos en contacto contigo.
          </strong>
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
          <input type="text" name="apellidos" placeholder="Apellidos" value={formData.apellidos} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Correo electrónico" className="fullWidth" value={formData.email} onChange={handleChange} required />
          <input type="tel" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} required />
          <input type="text" name="empresa" placeholder="Empresa" value={formData.empresa} onChange={handleChange} />
          <input type="text" name="ciudad" placeholder="Ciudad" value={formData.ciudad} onChange={handleChange} />
          <select name="region" value={formData.region} onChange={handleChange}>
            <option value="">Región</option>
            <option value="Arica y Parinacota">Arica y Parinacota</option>
            <option value="Tarapacá">Tarapacá</option>
            <option value="Antofagasta">Antofagasta</option>
            <option value="Atacama">Atacama</option>
            <option value="Coquimbo">Coquimbo</option>
            <option value="Valparaíso">Valparaíso</option>
            <option value="Metropolitana">Metropolitana de Santiago</option>
            <option value="O'Higgins">O'Higgins</option>
            <option value="Maule">Maule</option>
            <option value="Ñuble">Ñuble</option>
            <option value="Biobío">Biobío</option>
            <option value="La Araucanía">La Araucanía</option>
            <option value="Los Ríos">Los Ríos</option>
            <option value="Los Lagos">Los Lagos</option>
            <option value="Aysén">Aysén</option>
            <option value="Magallanes">Magallanes</option>
          </select>
          <textarea name="mensaje" placeholder="Mensaje" className="fullWidth" value={formData.mensaje} onChange={handleChange} required />
          <button type="submit" className="button" disabled={loading}>{loading ? 'Enviando...' : 'Enviar Cotización'}</button>
        </form>

        {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
      </div>

      <div className="cartSection">
        <h3 className="cartTitle">Carrito de Cotización</h3>
        <div className="cartProducts">
          {cart.length === 0 ? (
            <p>No hay productos en el carrito.</p>
          ) : (
            cart.map(producto => (
              <div key={producto.product_code} className="productCard">
                <h4 className="productName">{producto.name}</h4>
                <p className="productCode"><strong>Código:</strong> {producto.product_code}</p>
                <span className="productQty"><strong>Cantidad:</strong> {parseNumber(producto.quantity)}</span>
                {producto.images && producto.images.length > 0 && (
                  <img src={producto.images[0]} alt={producto.name} className="productImage" />
                )}
              </div>
            ))
          )}
        </div>
        {/* Campos de precio/subtotal/total removidos a pedido */}
        {cart.length > 0 && (
          <button className="button clearCartBtn" onClick={() => cartContext?.clearCart()}>Vaciar Carrito</button>
        )}
      </div>
    </div>
  );
};

export default Cotizado;

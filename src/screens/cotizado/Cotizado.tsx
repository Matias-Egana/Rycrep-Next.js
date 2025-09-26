import React, { useContext } from 'react';
import './Cotizado.css';
import { CartContext } from '../../domain/entities/context/CartContext';
import type { CartProduct } from '../../domain/entities/context/CartContext';

const Cotizado: React.FC = () => {
  const cartContext = useContext(CartContext);
  const cart: CartProduct[] = cartContext?.cart || [];

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

  const parseNumber = (value: any) => {
    const n = Number(value);
    return isNaN(n) ? 0 : n;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const userData = {
      nombre: formData.get('nombre') as string,
      apellidos: formData.get('apellidos') as string,
      email: formData.get('email') as string,
      telefono: formData.get('telefono') as string,
      empresa: formData.get('empresa') as string,
      ciudad: formData.get('ciudad') as string,
      region: formData.get('region') as string,
      mensaje: formData.get('mensaje') as string,
    };

    try {
      const cartData = cart.map(p => ({
        name: p.name,
        product_code: p.product_code,
        quantity: parseNumber(p.quantity),
        price: parseNumber(p.price),
      }));

      let total = 0;
      const detalleProductos = cartData.map(p => {
        const subtotal = p.quantity * p.price;
        total += subtotal;
        return `- ${p.name} (Código: ${p.product_code}) x${p.quantity} - $${p.price.toLocaleString()} c/u = $${subtotal.toLocaleString()}`;
      }).join('\n');

      // Enviar al backend
      await fetch(`${API_BASE_URL}/send-cotizacion/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userData, productos: cartData }),
      });

      // Abrir WhatsApp
      const mensajeWhatsapp = `
Hola, mi nombre es ${userData.nombre} ${userData.apellidos}.
Quisiera cotizar los siguientes productos:

${detalleProductos}

TOTAL: $${total.toLocaleString()}

Teléfono: ${userData.telefono}
Email: ${userData.email}
      `;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensajeWhatsapp)}`, '_blank');

      e.currentTarget.reset();
      cartContext?.clearCart();
    } catch (err) {
      console.error('Error al enviar cotización:', err);
    }
  };

  const totalCarrito = cart.reduce((acc, p) => acc + parseNumber(p.quantity) * parseNumber(p.price), 0);

  return (
    <div className="container">
      {/* Formulario */}
      <div className="formSection">
        <h2 className="title">Solicita tu cotización</h2>
        <p className="subtitle">
          Completa tus datos y revisa los productos en el carrito. <br />
          <strong>
            Los productos que están en el carrito se enviarán a la empresa para su
            cotización y nos pondremos en contacto contigo.
          </strong>
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <input type="text" name="nombre" placeholder="Nombre" required />
          <input type="text" name="apellidos" placeholder="Apellidos" required />
          <input type="email" name="email" placeholder="Correo electrónico" className="fullWidth" required />
          <input type="tel" name="telefono" placeholder="Teléfono" required />
          <input type="text" name="empresa" placeholder="Empresa" />
          <input type="text" name="ciudad" placeholder="Ciudad" />
          <select name="region">
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
          <textarea name="mensaje" placeholder="Mensaje" className="fullWidth" />
          <button type="submit" className="button">Enviar Cotización</button>
        </form>
      </div>

      {/* Carrito */}
      <div className="cartSection">
        <h3 className="cartTitle">Carrito de Cotización</h3>
        <div className="cartProducts">
          {cart.length === 0 ? (
            <p>No hay productos en el carrito.</p>
          ) : (
            cart.map(producto => (
              <div key={producto.product_code} className="productCard">
                <h4>{producto.name}</h4>
                <p>Código: {producto.product_code}</p>
                <span>Cantidad: {parseNumber(producto.quantity)}</span>
                <span>Precio: ${parseNumber(producto.price).toLocaleString()}</span>
                <span>Subtotal: ${(parseNumber(producto.quantity) * parseNumber(producto.price)).toLocaleString()}</span>
                {producto.images && producto.images.length > 0 && (
                  <img src={producto.images[0]} alt={producto.name} className="productImage" />
                )}
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <>
            <p className="totalCarrito">TOTAL: ${totalCarrito.toLocaleString()}</p>
            <button className="button clearCartBtn" onClick={() => cartContext?.clearCart()}>
              Vaciar Carrito
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cotizado;

import React, { useContext } from 'react';
import './Cotizado.css';
import { CartContext } from '../../domain/entities/context/CartContext';
import type { CartProduct } from '../../domain/entities/context/CartContext';

const Cotizado: React.FC = () => {
  const cartContext = useContext(CartContext);
  const cart: CartProduct[] = cartContext?.cart || [];

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

        <form className="form">
          <input type="text" placeholder="Nombre" />
          <input type="text" placeholder="Apellidos" />
          <input type="email" placeholder="Correo electrónico" className="fullWidth" />
          <input type="tel" placeholder="Teléfono" />
          <input type="text" placeholder="Empresa" />
          <input type="text" placeholder="Ciudad" />
          <select>
            <option value="">Región</option>
            <option value="Arica y Parinacota">Arica y Parinacota</option>
            <option value="Tarapacá">Tarapacá</option>
            <option value="Antofagasta">Antofagasta</option>
            <option value="Atacama">Atacama</option>
            <option value="Coquimbo">Coquimbo</option>
            <option value="Valparaíso">Valparaíso</option>
            <option value="Metropolitana">Metropolitana de Santiago</option>
            <option value="O'Higgins">Libertador General Bernardo O'Higgins</option>
            <option value="Maule">Maule</option>
            <option value="Ñuble">Ñuble</option>
            <option value="Biobío">Biobío</option>
            <option value="La Araucanía">La Araucanía</option>
            <option value="Los Ríos">Los Ríos</option>
            <option value="Los Lagos">Los Lagos</option>
            <option value="Aysén">Aysén del General Carlos Ibáñez del Campo</option>
            <option value="Magallanes">Magallanes y de la Antártica Chilena</option>
          </select>
          <textarea placeholder="Mensaje" className="fullWidth" />
          <button type="submit" className="button">Enviar Cotización</button>
        </form>
      </div>

      {/* Carrito */}
      <div className="cartSection">
        <h3 className="cartTitle">Carrito de Cotización</h3>

        {/* Contenedor scrollable de productos */}
        <div className="cartProducts">
          {cart.length === 0 ? (
            <p>No hay productos en el carrito.</p>
          ) : (
            cart.map((producto) => (
              <div key={producto.product_code} className="productCard">
                <h4>{producto.name}</h4>
                <p>Código: {producto.product_code}</p>
                <span>Cantidad: {producto.quantity}</span>
                {producto.images && producto.images.length > 0 && (
                  <img src={producto.images[0]} alt={producto.name} className="productImage" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Botón Vaciar Carrito fuera del scroll */}
        {cart.length > 0 && (
          <button className="button clearCartBtn" onClick={() => cartContext?.clearCart?.()}>
            Vaciar Carrito
          </button>
        )}
      </div>
    </div>
  );
};

export default Cotizado;

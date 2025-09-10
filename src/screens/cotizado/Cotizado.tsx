import React from 'react';
import './Cotizado.css';

const productos = [
  {
    id: 1,
    nombre: 'Viga IPN 100',
    descripcion: 'Viga de acero estructural para construcciones industriales.',
    cantidad: 10,
  },
  {
    id: 2,
    nombre: 'Chapa Galvanizada 1mm',
    descripcion: 'Chapa resistente a la corrosión para cubiertas metálicas.',
    cantidad: 20,
  },
  {
    id: 3,
    nombre: 'Tubería de Acero 2"',
    descripcion: 'Tubería para conducción de fluidos a alta presión.',
    cantidad: 15,
  },
  {
    id: 4,
    nombre: 'Perfil C 80x40x2',
    descripcion: 'Perfil conformado en frío para estructuras livianas.',
    cantidad: 25,
  },
];

const Cotizado: React.FC = () => {
  return (
    <div className="container">
      {/* Formulario */}
      <div className="formSection">
        <h2 className="title">Solicita tu cotización</h2>
        <p className="subtitle">
          Completa tus datos y revisa los productos en el carrito. <br />
          <strong>
            Los productos que están en el carrito de la derecha se enviarán a la empresa para su
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

        {productos.map((producto) => (
          <div key={producto.id} className="productCard">
            <h4>{producto.nombre}</h4>
            <p>{producto.descripcion}</p>
            <span>Cantidad: {producto.cantidad}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cotizado;

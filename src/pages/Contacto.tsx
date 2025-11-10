import React from 'react';

export default function Contacto() {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mensaje enviado. ¡Gracias por contactarnos!');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <main className="container my-5">
      <h1 className="text-center mb-4">Contáctanos</h1>
      <p className="text-center texto-secundario">
        ¿Tienes alguna pregunta, sugerencia o necesitas ayuda? Envíanos un mensaje.
      </p>
      <div className="row justify-content-center mt-4">
        <div className="col-md-8">
          <div className="card p-4">
            <form id="formularioContacto" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nombreContacto" className="form-label">Nombre</label>
                <input type="text" className="form-control" id="nombreContacto" required />
              </div>
              <div className="mb-3">
                <label htmlFor="correoContacto" className="form-label">Email</label>
                <input type="email" className="form-control" id="correoContacto" required />
              </div>
              <div className="mb-3">
                <label htmlFor="asuntoContacto" className="form-label">Asunto</label>
                <input type="text" className="form-control" id="asuntoContacto" required />
              </div>
              <div className="mb-3">
                <label htmlFor="mensajeContacto" className="form-label">Mensaje</label>
                <textarea className="form-control" id="mensajeContacto" rows={4} required></textarea>
              </div>
              <button type="submit" className="btn btn-primario w-100">Enviar Mensaje</button>
            </form>
          </div>
        </div>
      </div>
      <div className="row text-center mt-5">
        <div className="col-12">
          <h4>Nuestra Información</h4>
          <p>
            Email: contacto@huertohogar.com<br />
            Teléfono: +56 9 1234 5678<br />
            Dirección: Av. Principal 123, Santiago, Chile
          </p>
        </div>
      </div>
    </main>
  );
}
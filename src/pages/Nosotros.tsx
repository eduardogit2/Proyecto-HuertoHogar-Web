import { Link } from 'react-router-dom';

export default function Nosotros() {

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <h1 className="text-center mb-4">Nuestra Historia</h1>
          <p className="lead text-center texto-secundario">
            En HuertoHogar, creemos en el poder de la naturaleza para nutrir a las familias y comunidades.
            Nuestro viaje comenzó con una simple idea: llevar la frescura de los huertos directamente a tu
            hogar.
          </p>
          <hr className="my-5" />
          <div className="row align-items-center mb-5">
            <div className="col-md-6 order-md-2">
              <img src="/img/equipo.jpg" alt="Equipo de HuertoHogar"
                className="img-fluid rounded shadow-sm mb-3 mb-md-0" />
            </div>
            <div className="col-md-6 order-md-1">
              <h2>Nuestra Misión</h2>
              <p>
                Nos dedicamos a ofrecer productos orgánicos y sostenibles de la más alta calidad, cultivados
                con amor y respeto por la tierra. Buscamos promover un estilo de vida saludable y
                consciente, apoyando a los pequeños agricultores locales y minimizando nuestra huella
                ecológica.
              </p>
            </div>
          </div>
          <div className="row align-items-center mb-5">
            <div className="col-md-6">
              <img src="/img/valores.jpg" alt="Valores de la empresa"
                className="img-fluid rounded shadow-sm mb-3 mb-md-0" />
            </div>
            <div className="col-md-6">
              <h2>Nuestros Valores</h2>
              <ul className="list-unstyled">
                <li className="mb-2"><strong>Sostenibilidad:</strong> Cuidamos el planeta en cada paso, desde la
                  siembra hasta el empaque.</li>
                <li className="mb-2"><strong>Calidad:</strong> Solo ofrecemos lo mejor, con productos frescos y
                  nutritivos.</li>
                <li className="mb-2"><strong>Comunidad:</strong> Fomentamos la conexión entre productores y
                  consumidores.</li>
                <li className="mb-2"><strong>Transparencia:</strong> Te contamos de dónde vienen tus alimentos y
                  cómo los cultivamos.</li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-5">
            <h2 className="mb-3">¡Únete a la familia HuertoHogar!</h2>
            <p>Descubre la frescura y el sabor de la naturaleza en nuestra tienda o inspírate con nuestro blog.
            </p>
            <Link to="/blog" className="btn btn-primario me-2">Ir al Blog</Link>
            <Link to="/productos" className="btn btn-acento">Ver Productos</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
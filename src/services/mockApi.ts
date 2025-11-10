import type { Producto, PublicacionBlog, Usuario, Pedido, ComentarioBlog, Resena } from '../types';

const PRODUCTOS_KEY = 'productos';
const BLOG_KEY = 'publicacionesBlog';
const USUARIOS_KEY = 'usuarios';
const PEDIDOS_KEY = 'pedidos';
const BLOG_COMMENTS_KEY = 'comentariosBlog';

const productosIniciales: Producto[] = [
  { id: 100, nombre: "Manzana Fuji", precio: 1200, categoria: "Frutas", imagen: "img/prod1.jpg", etiqueta: "Fresco", descripcion: "Manzanas Fuji crujientes y dulces, cultivadas en el fértil Valle del Maule. Son perfectas para consumir como un snack saludable, o para usar en postres horneados y jugos naturales. Su textura firme y su sabor equilibrado entre dulce y ácido las hacen irresistibles.", stock: 150, origen: "Valle del Maule, Chile", unidad: "kg", stockCritico: null, resenas: [{ usuario: "Ana M.", calificacion: 5, texto: "Excelente calidad." }, { usuario: "Pedro V.", calificacion: 4, texto: "Muy buenas." }] },
  { id: 200, nombre: "Naranjas Valencia", precio: 1000, categoria: "Frutas", imagen: "img/prod2.jpg", etiqueta: "Fresco", descripcion: "Naranjas Valencia excepcionalmente jugosas y ricas en vitamina C. Provenientes de la soleada Región de Coquimbo, estas naranjas son ideales para zumos frescos y revitalizantes. Su sabor dulce y cítrico las hace perfectas para cualquier momento del día.", stock: 200, origen: "Región de Coquimbo, Chile", unidad: "kg", stockCritico: null, resenas: [{ usuario: "María P.", calificacion: 5, texto: "Muy jugosas." }, { usuario: "Juan F.", calificacion: 4, texto: "Sabor muy bueno." }] },
  { id: 300, nombre: "Plátano Cavendish", precio: 800, categoria: "Frutas", imagen: "img/prod3.jpg", descripcion: "Plátanos Cavendish maduros y naturally dulces, cultivados en la región de Guayas, Ecuador. Son el snack energético ideal para el desayuno o después de entrenar. Ricos en potasio y vitaminas esenciales, te ayudarán a mantener tu energía a lo largo del día.", stock: 250, origen: "Guayas, Ecuador", unidad: "kg", stockCritico: null, resenas: [{ usuario: "Sofía G.", calificacion: 5, texto: "Muy frescos." }] },
  { id: 400, nombre: "Zanahoria Orgánica", precio: 900, categoria: "Verduras", imagen: "img/prod4.jpg", descripcion: "Zanahorias orgánicas y crujientes, cultivadas sin pesticidas en la Región de O'Higgins. Son una excelente fuente de vitamina A y fibra. Ideales para ensaladas, sopas o para disfrutar como un snack saludable. Su sabor natural y dulce es incomparable.", stock: 100, origen: "Región de O'Higgins, Chile", unidad: "kg", stockCritico: null, resenas: [{ usuario: "Carolina V.", calificacion: 5, texto: "Frescas y con un sabor intenso." }] },
  { id: 500, nombre: "Espinaca Fresca", precio: 700, categoria: "Verduras", imagen: "img/prod5.jpg", descripcion: "Espinacas frescas y nutritivas, cultivadas con prácticas orgánicas en la región de Ñuble, Chile. Son perfectas para ensaladas, batidos verdes y salteados. Su textura tierna y su alto valor nutricional las convierten en un ingrediente esencial para una dieta sana.", stock: 80, origen: "Ñuble, Chile", unidad: "bolsa", stockCritico: null, resenas: [{ usuario: "Roberta A.", calificacion: 4, texto: "Buena cantidad." }] },
  { id: 600, nombre: "Pimiento Tricolores", precio: 1500, categoria: "Orgánicos", imagen: "img/prod6.jpg", descripcion: "Pimientos rojos, amarillos y verdes, seleccionados por su calidad y frescura. Cultivados en la Región de Valparaíso, son ideales para salteados, ensaladas y guisos. Añaden un toque vibrante de color, sabor y antioxidantes a cualquier receta.", stock: 120, origen: "Región de Valparaíso, Chile", unidad: "kg", stockCritico: null, resenas: [{ usuario: "Diego B.", calificacion: 5, texto: "Colores vibrantes y muy frescos." }] },
  { id: 700, nombre: "Miel Orgánica", precio: 5000, precioConDescuento: 4500, categoria: "Orgánicos", imagen: "img/prod7.jpg", etiqueta: "Oferta", descripcion: "Miel pura y 100% orgánica, producida por apicultores locales de la Región de Aysén, Chile. Con un sabor y aroma inigualables, es un endulzante natural perfecto para tés, yogures y postres. Es rica en antioxidantes y propiedades saludables.", stock: 50, origen: "Aysén, Chile", unidad: "frasco", stockCritico: null, resenas: [{ usuario: "Antonia D.", calificacion: 5, texto: "Un sabor exquisito." }] },
  { id: 800, nombre: "Quínoa Orgánica", precio: 4500, precioConDescuento: 4000, categoria: "Orgánicos", imagen: "img/prod8.jpg", etiqueta: "Oferta", descripcion: "Quínoa orgánica de alta calidad, proveniente de Cajamarca, Perú. Un superalimento versátil y libre de gluten, ideal para ensaladas, guisos o como sustituto de arroz. Es una fuente completa de proteínas y fibra que te ayudará a mantener una dieta equilibrada y nutritiva.", stock: 75, origen: "Cajamarca, Perú", unidad: "bolsa", stockCritico: null, resenas: [{ usuario: "Fernanda L.", calificacion: 5, texto: "Excelente para mis ensaladas." }] },
  { id: 900, nombre: "Leche Entera", precio: 1400, precioConDescuento: 1250, categoria: "Lácteos", imagen: "img/prod9.jpg", etiqueta: "Oferta", descripcion: "Leche entera fresca y cremosa, producida en la Región de Los Lagos, Chile. Con un sabor auténtico y completa en nutrientes esenciales como calcio y proteínas, es ideal para el desayuno o para preparar tus recetas favoritas.", stock: 90, origen: "Los Lagos, Chile", unidad: "litro", stockCritico: null, resenas: [{ usuario: "Pablo Q.", calificacion: 5, texto: "Muy buena y fresca." }] }
];
function inicializarProductos() {
  const productosGuardados = localStorage.getItem(PRODUCTOS_KEY);
  if (!productosGuardados || JSON.parse(productosGuardados).length === 0) {
    localStorage.setItem(PRODUCTOS_KEY, JSON.stringify(productosIniciales));
  }
}
const publicacionesIniciales: PublicacionBlog[] = [
  { id: 1, titulo: "5 Prácticas Sostenibles para tu Huerto", imagen: "img/blog-sostenibilidad.jpg", fecha: "2025-06-20", categoria: "Sostenibilidad", contenido: `<p>Crear un huerto es un acto de conexión con la naturaleza...</p><h4>1. Haz tu propio compost</h4><p>El compostaje es una forma fantástica...</p><h4>2. Recoge agua de lluvia</h4><p>Instalar un sistema sencillo...</p><h4>3. Cultiva especies nativas</h4><p>Las plantas nativas...</p><h4>4. Controla las plagas de forma natural</h4><p>Olvídate de los pesticidas agresivos...</p><h4>5. Rota tus cultivos</h4><p>No plantes la misma especie...</p><p>¡Un huerto sostenible es un huerto feliz y productivo!</p>` },
  { id: 2, titulo: "Receta: Ensalada de Quínoa y Pimientos", imagen: "img/blog-recetas.jpg", fecha: "2025-06-18", categoria: "Recetas", contenido: `<p>¿Buscas una comida fresca, nutritiva y llena de sabor?...</p><h3>Ingredientes:</h3><ul><li>1 taza de quínoa</li><li>2 tazas de agua</li><li>1 pimiento tricolor</li><li>...</li></ul><h3>Preparación:</h3><ol><li>Enjuaga bien la quínoa...</li><li>En un tazón grande, mezcla...</li><li>...</li></ol><p>¡Disfruta de una comida deliciosa y saludable!</p>` },
  { id: 3, titulo: "Nuestra Huella de Carbono", imagen: "img/blog-huella.jpg", fecha: "2025-06-15", categoria: "Sostenibilidad", contenido: `<p>En <strong>HuertoHogar</strong>, estamos comprometidos...</p><h4>Apoyamos a proveedores locales</h4><p>Al trabajar con agricultores locales...</p><h4>Usamos empaques biodegradables</h4><p>Hemos eliminado por completo...</p><h4>Optimizamos los sistemas de reparto</h4><p>Nuestro equipo de logística optimiza...</p>` },
  { id: 4, titulo: "Apoyando a Productores Locales", imagen: "img/blog-comunidad.jpg", fecha: "2025-06-10", categoria: "Comunidad", contenido: `<p>En <strong>HuertoHogar</strong>, creemos en el poder de la comunidad...</p><p>Trabajamos de la mano con agricultores...</p><p>Cada compra que haces tiene un impacto real...</p>` },
  { id: 5, titulo: "Cómo Cultivar un Huerto Urbano", imagen: "img/blog-huerto-urbano.jpg", fecha: "2025-06-05", categoria: "Sostenibilidad", contenido: `<p>¿Sueñas con cultivar tus propias verduras y hierbas?...</p><h4>Consejos clave:</h4><ul><li><strong>Elige el lugar adecuado:</strong>...</li><li><strong>Macetas y drenaje:</strong>...</li><li>...</li></ul><p>El proceso es una recompensa en sí misma...</p>` },
  { id: 6, titulo: "Batido Verde Desintoxicante", imagen: "img/blog-batido-verde.jpg", fecha: "2025-05-30", categoria: "Recetas", contenido: `<p>¿Te sientes con poca energía?...</p><h3>Ingredientes:</h3><ul><li>1 taza de espinacas</li><li>...</li></ul><h3>Preparación:</h3><p>Simplemente coloca todos los ingredientes...</p><p>¡Sirve de inmediato y a disfrutar!</p>` }
];
const comentariosIniciales: Record<string, ComentarioBlog[]> = {
  '1': [{ usuario: "Ana", texto: "¡Muy buenos consejos! Empezaré a hacer mi propio compost." }, { usuario: "Carlos", texto: "La rotación de cultivos es clave, ¡gracias!" }],
  '4': [{ usuario: "Pedro", texto: "Es genial saber que apoyan a los pequeños productores." }, { usuario: "María", texto: "Me encanta este tipo de iniciativas." }],
  '5': [{ usuario: "Javier", texto: "Excelente guía, justo lo que necesitaba para mi balcón." }]
};
function inicializarBlog() {
  const postsGuardados = localStorage.getItem(BLOG_KEY);
  if (!postsGuardados || JSON.parse(postsGuardados).length === 0) {
    localStorage.setItem(BLOG_KEY, JSON.stringify(publicacionesIniciales));
  }
}
function inicializarBlogComentarios() {
  const comentariosGuardados = localStorage.getItem(BLOG_COMMENTS_KEY);
  if (!comentariosGuardados) {
    localStorage.setItem(BLOG_COMMENTS_KEY, JSON.stringify(comentariosIniciales));
  }
}
function inicializarAdmin() {
  const usuariosGuardados = localStorage.getItem(USUARIOS_KEY);
  let usuarios: Usuario[] = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];
  if (!usuariosGuardados || usuarios.length === 0) {
    const nuevoAdmin: Usuario = {
      id: 1,
      nombre: 'Admin',
      rut: '1-9',
      correo: 'admin@huertohogar.cl',
      contrasena: 'admin',
      esAdmin: true
    };
    usuarios = [nuevoAdmin];
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
  } else {
    const usuarioAdmin = usuarios.find(u => u.esAdmin);
    if (!usuarioAdmin) {
      const nuevoAdmin: Usuario = {
        id: 1,
        nombre: 'Admin',
        rut: '1-9',
        correo: 'admin@huertohogar.cl',
        contrasena: 'admin',
        esAdmin: true
      };
      usuarios.push(nuevoAdmin);
      localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
    }
  }
}
const regionesYComunas = {
  "Región de Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
  "Región de Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
  "Región de Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
  "Región de Atacama": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"],
  "Región de Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
  "Región de Valparaíso": ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Catemu", "Llay-Llay", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Putaendo", "Santa María", "Panquehue", "Quilpué", "Limache", "Olmué", "Villa Alemana"],
  "Región Metropolitana de Santiago": ["Santiago", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"],
  "Región del Libertador General Bernardo O'Higgins": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "La Estrella", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Paredones", "Peralillo", "Peumo", "Pichilemu", "Pichidegua", "Placilla", "Requínoa", "Rengo", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Pumanque", "San Vicente", "Santa Cruz", "Litueche"],
  "Región del Maule": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier de Loncomilla", "Villa Alegre", "Yerbas Buenas"],
  "Región de Ñuble": ["Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Quirihue", "Ránquil", "Treguaco", "Bulnes", "Chillán Viejo", "Chillán", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay", "San Carlos", "Coihueco", "Ñiquén", "San Fabián", "San Nicolás"],
  "Región del Biobío": ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"],
  "Región de la Araucanía": ["Temuco", "Carahue", "Cholchol", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"],
  "Región de los Ríos": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"],
  "Región de los Lagos": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao"],
  "Región de Aysén del General Carlos Ibáñez del Campo": ["Coyhaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez"],
  "Región de Magallanes y de la Antártica Chilena": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos (Ex Navarino)", "Antártica", "Porvenir", "Primavera", "Timaukel", "Torres del Paine"],
};
inicializarProductos();
inicializarAdmin();
inicializarBlog();
inicializarBlogComentarios();

const getProductosDB = (): Producto[] => JSON.parse(localStorage.getItem(PRODUCTOS_KEY) || '[]');
const saveProductosDB = (productos: Producto[]) => localStorage.setItem(PRODUCTOS_KEY, JSON.stringify(productos));
const getUsuariosDB = (): Usuario[] => JSON.parse(localStorage.getItem(USUARIOS_KEY) || '[]');
const saveUsuariosDB = (usuarios: Usuario[]) => localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
const getPedidosDB = (): Pedido[] => JSON.parse(localStorage.getItem(PEDIDOS_KEY) || '[]');
const savePedidosDB = (pedidos: Pedido[]) => localStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidos));
const getBlogDB = (): PublicacionBlog[] => JSON.parse(localStorage.getItem(BLOG_KEY) || '[]');
const saveBlogDB = (posts: PublicacionBlog[]) => localStorage.setItem(BLOG_KEY, JSON.stringify(posts));
const getComentariosDB = (): Record<string, ComentarioBlog[]> => JSON.parse(localStorage.getItem(BLOG_COMMENTS_KEY) || '{}');
const saveComentariosDB = (comentarios: Record<string, ComentarioBlog[]>) => localStorage.setItem(BLOG_COMMENTS_KEY, JSON.stringify(comentarios));

export const api = {

  getProductos: async (): Promise<Producto[]> => getProductosDB(),
  getProductoById: async (id: number): Promise<Producto | undefined> => getProductosDB().find(p => p.id === id),
  getCategoriasUnicas: async (): Promise<string[]> => Array.from(new Set(getProductosDB().map(p => p.categoria))).filter(Boolean),
  createProducto: async (nuevoProducto: Producto): Promise<Producto> => {
    const productos = getProductosDB();
    productos.push(nuevoProducto);
    saveProductosDB(productos);
    return nuevoProducto;
  },
  updateProducto: async (productoActualizado: Producto): Promise<Producto> => {
    const productos = getProductosDB();
    const indice = productos.findIndex(p => p.id === productoActualizado.id);
    if (indice === -1) throw new Error("Producto no encontrado");
    productos[indice] = productoActualizado;
    saveProductosDB(productos);
    return productoActualizado;
  },
  deleteProducto: async (id: number): Promise<void> => {
    const productos = getProductosDB();
    const productosFiltrados = productos.filter(p => p.id !== id);
    saveProductosDB(productosFiltrados);
  },
  addResena: async (productoId: number, resena: Resena): Promise<Producto> => {
    const productos = getProductosDB();
    const indice = productos.findIndex(p => p.id === productoId);
    if (indice === -1) throw new Error("Producto no encontrado");

    productos[indice].resenas.push(resena);
    saveProductosDB(productos);
    return productos[indice];
  },

  getBlogPosts: async (): Promise<PublicacionBlog[]> => {
    return getBlogDB().sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  },
  getBlogPostById: async (id: number): Promise<PublicacionBlog | undefined> => {
    return getBlogDB().find(p => p.id === id);
  },
  createBlogPost: async (post: Omit<PublicacionBlog, 'id'>): Promise<PublicacionBlog> => {
    const posts = getBlogDB();
    const nuevoPost: PublicacionBlog = {
      ...post,
      id: Date.now()
    };
    posts.push(nuevoPost);
    saveBlogDB(posts);
    return nuevoPost;
  },
  updateBlogPost: async (postActualizado: PublicacionBlog): Promise<PublicacionBlog> => {
    const posts = getBlogDB();
    const indice = posts.findIndex(p => p.id === postActualizado.id);
    if (indice === -1) throw new Error("Publicación no encontrada");
    posts[indice] = postActualizado;
    saveBlogDB(posts);
    return postActualizado;
  },
  deleteBlogPost: async (id: number): Promise<void> => {
    const posts = getBlogDB();
    const postsFiltrados = posts.filter(p => p.id !== id);
    saveBlogDB(postsFiltrados);
    const comentarios = getComentariosDB();
    delete comentarios[id];
    saveComentariosDB(comentarios);
  },
  getBlogComments: async (postId: number): Promise<ComentarioBlog[]> => {
    const comentarios = getComentariosDB();
    return comentarios[postId] || [];
  },
  addBlogComment: async (postId: number, comentario: ComentarioBlog): Promise<ComentarioBlog> => {
    const comentarios = getComentariosDB();
    if (!comentarios[postId]) {
      comentarios[postId] = [];
    }
    comentarios[postId].push(comentario);
    saveComentariosDB(comentarios);
    return comentario;
  },

  login: async (correo: string, contrasena: string): Promise<Usuario> => {
    const usuarios = getUsuariosDB();
    const usuario = usuarios.find(u => u.correo === correo && u.contrasena === contrasena);
    if (usuario) {
      localStorage.setItem('usuarioActual', JSON.stringify(usuario));
      localStorage.setItem('sesionIniciada', 'true');
      return usuario;
    } else {
      throw new Error('Credenciales incorrectas');
    }
  },
  register: async (nuevoUsuario: Omit<Usuario, 'id' | 'esAdmin'>): Promise<Usuario> => {
    const usuarios = getUsuariosDB();
    if (usuarios.find(u => u.correo === nuevoUsuario.correo)) {
      throw new Error('El correo electrónico ya está registrado.');
    }
    const usuarioConId: Usuario = { ...nuevoUsuario, id: Date.now(), esAdmin: false, historial: [], puntos: 0 };
    usuarios.push(usuarioConId);
    saveUsuariosDB(usuarios);
    return usuarioConId;
  },
  updateUser: async (usuarioActualizado: Usuario): Promise<Usuario> => {
    const usuarios = getUsuariosDB();
    const indiceUsuario = usuarios.findIndex(u => u.correo === usuarioActualizado.correo);
    if (indiceUsuario === -1) throw new Error("Usuario no encontrado para actualizar");
    usuarios[indiceUsuario] = usuarioActualizado;
    saveUsuariosDB(usuarios);
    localStorage.setItem('usuarioActual', JSON.stringify(usuarioActualizado));
    return usuarioActualizado;
  },
  getUsuarios: async (): Promise<Usuario[]> => getUsuariosDB(),
  getUsuarioByCorreo: async (correo: string): Promise<Usuario | undefined> => getUsuariosDB().find(u => u.correo === correo),
  createUsuario: async (nuevoUsuario: Usuario): Promise<Usuario> => {
    const usuarios = getUsuariosDB();
    if (usuarios.some(u => u.correo === nuevoUsuario.correo)) throw new Error('El correo electrónico ya está registrado.');
    usuarios.push(nuevoUsuario);
    saveUsuariosDB(usuarios);
    return nuevoUsuario;
  },
  updateUsuarioAdmin: async (correoOriginal: string, usuarioActualizado: Usuario): Promise<Usuario> => {
    const usuarios = getUsuariosDB();
    const indice = usuarios.findIndex(u => u.correo === correoOriginal);
    if (indice === -1) throw new Error("Usuario no encontrado");

    if (!usuarioActualizado.contrasena) {
      usuarioActualizado.contrasena = usuarios[indice].contrasena;
    }

    usuarioActualizado.correo = correoOriginal;
    usuarios[indice] = usuarioActualizado;
    saveUsuariosDB(usuarios);
    return usuarioActualizado;
  },
  deleteUsuario: async (correo: string): Promise<void> => {
    const usuarios = getUsuariosDB();
    if (correo === 'admin@huertohogar.cl') throw new Error('No se puede eliminar al administrador principal.');
    const usuariosFiltrados = usuarios.filter(u => u.correo !== correo);
    saveUsuariosDB(usuariosFiltrados);
  },
  getRegionesYComunas: async (): Promise<Record<string, string[]>> => regionesYComunas,

  crearPedido: async (pedido: Pedido, guardarDireccion: boolean, nuevaDireccion?: { calle: string, ciudad: string, region: string }): Promise<Pedido> => {
    const pedidos = getPedidosDB();
    pedidos.push(pedido);
    savePedidosDB(pedidos);
    const usuarios = getUsuariosDB();
    const indiceUsuario = usuarios.findIndex(u => u.correo === pedido.correoCliente);
    if (indiceUsuario !== -1) {
      const usuarioActual = usuarios[indiceUsuario];
      usuarioActual.puntos = usuarioActual.puntos || 0;
      if (pedido.puntosUsados > 0) usuarioActual.puntos = 0;
      usuarioActual.puntos += pedido.puntosGanados;
      if (guardarDireccion && nuevaDireccion && pedido.tipoEntrega === 'domicilio') {
        if (!usuarioActual.direcciones) {
          usuarioActual.direcciones = [];
        }
        const dirExiste = usuarioActual.direcciones.some(d =>
          d.calle === nuevaDireccion.calle && d.ciudad === nuevaDireccion.ciudad
        );
        if (!dirExiste) {
          usuarioActual.direcciones.push(nuevaDireccion);
        }
      }
      usuarios[indiceUsuario] = usuarioActual;
      saveUsuariosDB(usuarios);
      localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));
    }
    localStorage.removeItem('carrito');
    return pedido;
  },
  getPedidosByCliente: async (correo: string): Promise<Pedido[]> => getPedidosDB().filter(p => p.correoCliente === correo).sort((a, b) => b.id - a.id),
  getAllPedidos: async (): Promise<Pedido[]> => getPedidosDB().sort((a, b) => b.id - a.id),
  updatePedido: async (pedidoId: number, nuevoEstado: Pedido['estado']): Promise<Pedido> => {
    const pedidos = getPedidosDB();
    const indicePedido = pedidos.findIndex(p => p.id === pedidoId);
    if (indicePedido === -1) throw new Error("Pedido no encontrado");
    pedidos[indicePedido].estado = nuevoEstado;
    savePedidosDB(pedidos);
    return pedidos[indicePedido];
  }
};

/* ==========================================
   1. BASE DE DATOS DE PRODUCTOS
   ========================================== */
const PRODUCTOS = [
    { id: 1, nombre: "Jersey Real Madrid 2026", precio: 95, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe2qc0SvDcXLk-UHObkDkRyS30BbW6v4JEzQ&s0" },
    { id: 2, nombre: "Jersey FC Barcelona Away", precio: 90, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwm3DB8steiOcRzyUcIzzC7Spr_sTCl1GUaw&s" },
    { id: 3, nombre: "Jersey Selección Vinotinto", precio: 85, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfKDdvrwTMlFkltpwvig4AaCyKiQnit8iKLQ&s" },
    { id: 4, nombre: "Jersey Argentina Home", precio: 95, img: "https://afaar.vtexassets.com/arquivos/ids/158644/JM5897_1_APPAREL_Photography_Front-Center-View_white.jpg?v=638979860679030000" },
    { id: 5, nombre: "Botas Mercurial Elite", precio: 220, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThU540mqFN3IkU5RrfmMQsAuFe0ouvHtUfKA&s" },
    { id: 6, nombre: "Balón Oficial Copa", precio: 45, img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgSY1I7lKUKroymM7ieDkOH-rWcLWpyehKhY9-HKFwpsVqOgP3u6ztsn8FPLlqkvXNObodIIz3XqRAQnOTRZ2syJr0lsPyclqpO9ryWteyWpH8S-OO-gzZ3wvpthOqOrOgCHj35UZQonHKq4UseLXZjKR-IiZ0UqoxF3BGznzXm9HqpykAHzZd4QTQ1WYCe/s1600/se-presenta-el-balon-adidas-trionda-para-la-copa-mundial-de-2026.jpg" },
    { id: 7, nombre: "Chaqueta Anthem Tech", precio: 110, img: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500" },
    { id: 8, nombre: "Guantes de Portero Pro", precio: 65, img: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=500" }
];

// Estado de la aplicación
let carrito = [];
let tallaSeleccionadaGlobal = {}; // Guarda la talla por cada ID de producto

// Elementos del DOM
const grid = document.getElementById('product-grid');
const drawer = document.getElementById('cart-drawer');
const cartItemsCont = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const newsGrid = document.getElementById('news-grid');

/* ==========================================
   2. FUNCIONES DE LA TIENDA
   ========================================== */

function initApp() {
    renderTienda();
    obtenerNoticias();
    
    // Eventos para abrir y cerrar carrito
    document.getElementById('open-cart').onclick = () => drawer.classList.add('open');
    document.getElementById('close-cart').onclick = () => drawer.classList.remove('open');
    document.getElementById('close-cart-secondary').onclick = () => drawer.classList.remove('open');
}

// Dibuja los productos en la cuadrícula
function renderTienda() {
    grid.innerHTML = PRODUCTOS.map((p, i) => `
        <div class="card" style="opacity:0; transform:translateY(20px); animation: fadeInUp 0.5s forwards ${i * 0.1}s">
            <img src="${p.img}" alt="${p.nombre}">
            <div class="card-info">
                <h3>${p.nombre}</h3>
                <p class="price">$${p.precio}</p>
                
                <p style="font-size:0.7rem; color:#888; margin-top:10px; font-weight:bold;">SELECCIONA TALLA:</p>
                <div class="size-selector">
                    <button class="size-btn" onclick="seleccionarTalla(${p.id}, 'S', this)">S</button>
                    <button class="size-btn" onclick="seleccionarTalla(${p.id}, 'M', this)">M</button>
                    <button class="size-btn" onclick="seleccionarTalla(${p.id}, 'L', this)">L</button>
                    <button class="size-btn" onclick="seleccionarTalla(${p.id}, 'XL', this)">XL</button>
                </div>

                <button class="btn-add" onclick="validarYAgregar(${p.id})">AÑADIR A LA BOLSA</button>
            </div>
        </div>
    `).join('');
}

// Maneja el clic en los botoncitos de talla
function seleccionarTalla(productoId, talla, elemento) {
    tallaSeleccionadaGlobal[productoId] = talla;

    // Resaltar visualmente el botón seleccionado
    const botones = elemento.parentElement.querySelectorAll('.size-btn');
    botones.forEach(btn => btn.classList.remove('selected'));
    elemento.classList.add('selected');
}

// Verifica si eligió talla antes de meter al carro
function validarYAgregar(id) {
    const talla = tallaSeleccionadaGlobal[id];
    
    if (!talla) {
        alert("¡Atención! Por favor selecciona una talla antes de añadir el producto.");
        return;
    }

    const productoBase = PRODUCTOS.find(p => p.id === id);
    // Creamos un nuevo objeto que incluye la talla elegida
    const productoParaCarrito = { ...productoBase, tallaElegida: talla };
    
    carrito.push(productoParaCarrito);
    actualizarCarritoUI();
    drawer.classList.add('open'); // Abrir carrito automáticamente
    
    // Opcional: limpiar selección para que no se quede marcada
    tallaSeleccionadaGlobal[id] = null;
    renderTienda();
}

function actualizarCarritoUI() {
    // Actualizar burbuja del contador
    cartCount.innerText = carrito.length;
    
    // Renderizar lista de items en el drawer
    cartItemsCont.innerHTML = carrito.map((p, i) => `
        <div class="cart-item">
            <img src="${p.img}">
            <div style="flex-grow:1">
                <p><strong>${p.nombre}</strong></p>
                <span class="cart-item-size">Talla: ${p.tallaElegida}</span>
                <p style="margin-top:5px;">$${p.precio}</p>
                <button onclick="eliminarDelCarrito(${i})" class="btn-remove">ELIMINAR</button>
            </div>
        </div>
    `).join('');

    const total = carrito.reduce((sum, p) => sum + p.precio, 0);
    cartTotal.innerText = `$${total}`;
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarritoUI();
}

/* ==========================================
   3. SECCIÓN DE NOTICIAS (API + FALLBACK)
   ========================================== */

const API_KEY = 'TU_API_KEY_AQUI'; // <--- Pon tu llave de newsapi.org aquí

const NOTICIAS_DE_RESPALDO = [
    {
        source: { name: "Futbol News" },
        title: "El mercado europeo se mueve",
        description: "Los grandes equipos de Europa ya preparan sus ofertas para el mercado de verano 2026.",
        urlToImage: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500",
        url: "#"
    },
    {
        source: { name: "Deportes 24" },
        title: "La Champions League estrena formato",
        description: "Se revelan los detalles del nuevo sistema de competición que promete más emoción.",
        urlToImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500",
        url: "#"
    }
];

async function obtenerNoticias() {
    const query = 'futbol "Champions League" OR "Real Madrid"';
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=es&sortBy=publishedAt&pageSize=4&apiKey=${API_KEY}`;

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (datos.articles && datos.articles.length > 0) {
            renderizarNoticias(datos.articles);
        } else {
            renderizarNoticias(NOTICIAS_DE_RESPALDO);
        }
    } catch (error) {
        console.warn("API falló o bloqueada por CORS. Usando noticias de respaldo.");
        renderizarNoticias(NOTICIAS_DE_RESPALDO);
    }
}

function renderizarNoticias(articulos) {
    newsGrid.innerHTML = articulos.map(art => `
        <article class="news-card">
            <div class="badge">${art.source.name}</div>
            <img src="${art.urlToImage || 'https://via.placeholder.com/500x300'}" alt="${art.title}">
            <div class="news-content">
                <h3>${art.title}</h3>
                <p>${art.description ? art.description.substring(0, 90) + '...' : 'Haz clic para leer más.'}</p>
                <a href="${art.url}" target="_blank" class="read-more">Leer noticia completa</a>
            </div>
        </article>
    `).join('');
}

// Iniciar todo al cargar
document.addEventListener('DOMContentLoaded', initApp);
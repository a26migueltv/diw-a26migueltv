/* =========================================================
   NAMI RAMEN · JavaScript común a todas las páginas
   - Menú desplegable en móvil
   - Cabecera que se compacta al hacer scroll
   - Animación de aparición de elementos (.revelar)
   - Botón "volver arriba"
   - Aviso de "abierto / cerrado ahora" según el horario
   - Ventana de créditos de las fotografías
   Autor: Miguel Tubío Vidal
   ========================================================= */

'use strict';

/* ---------- Menú en pantallas pequeñas ---------- */
const botonMenu = document.getElementById('boton-menu');
const navegacion = document.getElementById('navegacion-principal');

function cerrarMenu() {
    navegacion.classList.remove('abierto');
    botonMenu.setAttribute('aria-expanded', 'false');
    botonMenu.setAttribute('aria-label', 'Abrir el menú');
}

botonMenu.addEventListener('click', () => {
    const abierto = navegacion.classList.toggle('abierto');
    botonMenu.setAttribute('aria-expanded', String(abierto));
    botonMenu.setAttribute('aria-label', abierto ? 'Cerrar el menú' : 'Abrir el menú');
});

// Se cierra al elegir un enlace, al pulsar Escape o al volver a pantalla grande
navegacion.querySelectorAll('a').forEach(enlace => enlace.addEventListener('click', cerrarMenu));
document.addEventListener('keydown', ev => {
    if (ev.key === 'Escape') cerrarMenu();
});
window.matchMedia('(min-width: 881px)').addEventListener('change', cerrarMenu);

/* ---------- Cabecera compacta al bajar ---------- */
const cabecera = document.getElementById('cabecera');
const botonSubir = document.getElementById('boton-subir');

function alHacerScroll() {
    const y = window.scrollY;
    cabecera.classList.toggle('compacta', y > 120);
    cabecera.classList.toggle('con-sombra', y > 10);
    botonSubir.classList.toggle('visible', y > 600);
}
window.addEventListener('scroll', alHacerScroll, { passive: true });
alHacerScroll();

botonSubir.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- Aparición de elementos al entrar en pantalla ---------- */
const elementosRevelar = document.querySelectorAll('.revelar');

if ('IntersectionObserver' in window) {
    const observador = new IntersectionObserver((entradas, obs) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visible');
                obs.unobserve(entrada.target); // solo se anima una vez
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    elementosRevelar.forEach(el => observador.observe(el));
} else {
    elementosRevelar.forEach(el => el.classList.add('visible'));
}

/* ---------- Horario: abierto o cerrado ahora ---------- */
// Turnos por día de la semana (0 = domingo ... 6 = sábado). Lunes cerrado.
const TURNOS = [['13:00', '16:00'], ['20:00', '23:30']];
const HORARIO = { 0: TURNOS, 1: [], 2: TURNOS, 3: TURNOS, 4: TURNOS, 5: TURNOS, 6: TURNOS };
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

function aMinutos(hora) {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
}

/** Devuelve un texto con el estado actual del restaurante. */
function estadoRestaurante(fecha = new Date()) {
    const dia = fecha.getDay();
    const ahora = fecha.getHours() * 60 + fecha.getMinutes();

    for (const [inicio, fin] of HORARIO[dia]) {
        if (ahora >= aMinutos(inicio) && ahora < aMinutos(fin)) {
            return { abierto: true, texto: `Abierto ahora · cerramos a las ${fin}` };
        }
    }
    // Busca el próximo turno (hoy más tarde o en los días siguientes)
    for (let i = 0; i < 7; i++) {
        const d = (dia + i) % 7;
        for (const [inicio] of HORARIO[d]) {
            if (i > 0 || aMinutos(inicio) > ahora) {
                const cuando = i === 0 ? 'hoy' : i === 1 ? 'mañana' : `el ${DIAS[d]}`;
                return { abierto: false, texto: `Cerrado ahora · abrimos ${cuando} a las ${inicio}` };
            }
        }
    }
    return { abierto: false, texto: 'Cerrado' };
}

const etiquetaEstado = document.getElementById('estado-abierto');
if (etiquetaEstado) {
    const estado = estadoRestaurante();
    etiquetaEstado.textContent = estado.texto;
    etiquetaEstado.classList.toggle('cerrado', !estado.abierto);
}

/* ---------- Año actual en el pie ---------- */
document.getElementById('anho-actual').textContent = new Date().getFullYear();

/* ---------- Créditos de las fotografías ---------- */
const CREDITOS = [
    ['Portada', 'Gyoza Tonkotsu Ramen Lunch Set', 'avlxyz', 'CC BY-SA 2.0', 'https://www.flickr.com/photos/10559879@N00/4691847082'],
    ['Especialidad', 'Gyoza Tonkotsu Ramen Lunch Set (close-up)', 'avlxyz', 'CC BY-SA 2.0', 'https://www.flickr.com/photos/10559879@N00/4691214345'],
    ['Cómo pedir', 'Shoyu Ramen', 'B.2010', 'CC BY 2.0', 'https://www.flickr.com/photos/51365484@N06/9615297629'],
    ['Cocinero', 'Ramen Chef at Work', 'City Foodsters', 'CC BY 2.0', 'https://www.flickr.com/photos/89060048@N03/16652945778'],
    ['Farol', 'Ramen shop lantern', 'Shinryo Kanagawa', 'CC BY 2.0', 'https://www.flickr.com/photos/140638531@N08/27333849168'],
    ['Tonkotsu', 'Tonkotsu Ramen - Momotaro Rahmen', 'avlxyz', 'CC BY-SA 2.0', 'https://www.flickr.com/photos/10559879@N00/4392218102'],
    ['Shoyu', 'Shoyu Ramen with Gyoza - Ramen Ya', 'avlxyz', 'CC BY-SA 2.0', 'https://www.flickr.com/photos/10559879@N00/4778414926'],
    ['Miso', 'Miso Ramen, Otaru Kuraya', 'bryan...', 'CC BY-SA 2.0', 'https://www.flickr.com/photos/91049143@N00/16514938617'],
    ['Shio', 'Yuzu Shio Ramen', 'City Foodsters', 'CC BY 2.0', 'https://www.flickr.com/photos/89060048@N03/15961045390'],
    ['Tantanmen', 'Tantanmen with soup @ Kisin', '*_*', 'CC BY 2.0', 'https://www.flickr.com/photos/22539273@N00/30621289992'],
    ['Yasai vegano', 'Spicy vegetable ramen at Totto Ramen', 'Kaeru', 'CC BY 2.0', 'https://www.flickr.com/photos/51035756584@N01/10725019083'],
    ['Gyozas', 'Gyoza, Jiaozi', 'ivva', 'CC BY-SA 2.0', 'https://www.flickr.com/photos/92842970@N00/8737522058'],
    ['Edamame', 'Edamame', 'Ruth and Dave', 'CC BY 2.0', 'https://www.flickr.com/photos/95142644@N00/2752715213'],
    ['Takoyaki', 'Takoyaki with wasabi mayonaise - Cafe Uzu', 'avlxyz', 'CC BY-SA 2.0', 'https://www.flickr.com/photos/10559879@N00/4466536700'],
    ['Mochi', 'mochi ice cream', 'flyingroc', 'CC BY-SA 2.0', 'https://www.flickr.com/photos/8962549@N02/3374300138'],
    ['Dorayaki', 'Dorayakis', 'parap', 'CC BY 2.0', 'https://www.flickr.com/photos/22281620@N00/2704060104'],
    ['Cabecera de la carta', 'Ramen chef.', 'adactio', 'CC BY 2.0', 'https://www.flickr.com/photos/74105777@N00/16262016431'],
    ['Historia 1962', 'Ramen Shop Owner', 'jamesfischer', 'CC BY 2.0', 'https://www.flickr.com/photos/77971723@N00/2123469057'],
    ['Historia 1998', 'ramen shop takahashi', 'keroyama', 'CC BY 2.0', 'https://www.flickr.com/photos/100144693@N08/14594537944'],
    ['Cabecera de Conócenos', 'Ramen Shop (Colorsplash)', 'Hikosaemon', 'CC BY 2.0', 'https://www.flickr.com/photos/43120948@N04/5714956701'],
    ['El local', 'Ramen restaurant', 'mdid', 'CC BY 2.0', 'https://www.flickr.com/photos/58246614@N00/1936789234'],
    ['La mesa', 'Condiments - Ramen Ya', 'avlxyz', 'CC BY-SA 2.0', 'https://www.flickr.com/photos/10559879@N00/3023980747'],
    ['Cabecera de Contacto', 'Ramen restaurant', 'Japanexperterna.se', 'CC BY-SA 2.0', 'https://www.flickr.com/photos/68532869@N08/14169119300'],
    ['Vídeo de la carta', 'Hand holding chopsticks and stirs ramen with them', 'Mixkit', 'Licencia gratuita de Mixkit', 'https://mixkit.co/free-stock-video/hand-holding-chopsticks-and-stirs-ramen-with-them-46789/'],
    ['Iconos de alérgenos (carta)', 'Iconos de los 14 alérgenos', 'Francisco José Ortega Reina (Ingeniería de Menú)', 'Descarga gratuita', 'https://ingenieriademenu.com/'],
];

const dialogoCreditos = document.getElementById('dialogo-creditos');
const listaCreditos = document.getElementById('lista-creditos');

CREDITOS.forEach(([uso, titulo, autor, licencia, url]) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${uso}:</strong> <a href="${url}" target="_blank" rel="noopener">«${titulo}»</a>, de ${autor} (${licencia}).`;
    listaCreditos.appendChild(li);
});
const notaFotos = document.createElement('li');
notaFotos.textContent = 'Fotografías recomprimidas para la web (vídeo recortado de resolución y sin sonido). Logotipo, iconos SVG (cuenco, palillos, sushi, naruto, dango, olas) y textos: Miguel Tubío Vidal. Tipografías Shippori Mincho B1 y Zen Kaku Gothic New (SIL Open Font License).';
listaCreditos.appendChild(notaFotos);

document.getElementById('boton-creditos').addEventListener('click', () => dialogoCreditos.showModal());
document.getElementById('cerrar-creditos').addEventListener('click', () => dialogoCreditos.close());
// Cerrar al hacer clic fuera de la ventana
dialogoCreditos.addEventListener('click', ev => {
    if (ev.target === dialogoCreditos) dialogoCreditos.close();
});

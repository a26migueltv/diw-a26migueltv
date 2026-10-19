/* =========================================================
   NAMI RAMEN · JavaScript de la Carta
   - Filtros por categoría, vegano y sin picante
   - Contador de platos visibles
   - El vídeo se reproduce solo cuando está en pantalla
   Autor: Miguel Tubío Vidal
   ========================================================= */

'use strict';

const botonesFiltro = document.querySelectorAll('.filtro');
const platos = document.querySelectorAll('.plato');
const seccionesCarta = document.querySelectorAll('.seccion-carta');
const textoResultado = document.getElementById('resultado-filtro');
const avisoSinResultados = document.getElementById('sin-resultados');
const CATEGORIAS = ['aperitivos', 'ramen', 'postres'];

function cumpleFiltro(plato, filtro) {
    if (filtro === 'todo') return true;
    if (CATEGORIAS.includes(filtro)) return plato.dataset.categoria === filtro;
    // vegano / sin-picante se buscan en las etiquetas del plato
    return plato.dataset.etiquetas.split(' ').includes(filtro);
}

function aplicarFiltro(filtro) {
    let visibles = 0;

    platos.forEach(plato => {
        const mostrar = cumpleFiltro(plato, filtro);
        plato.classList.toggle('oculto', !mostrar);
        if (mostrar) {
            visibles++;
            plato.classList.add('visible'); // por si aún no había aparecido con el scroll
        }
    });

    // Oculta las secciones que se quedan sin platos
    seccionesCarta.forEach(seccion => {
        const conPlatos = seccion.querySelectorAll('.plato:not(.oculto)').length > 0;
        seccion.classList.toggle('oculto', !conPlatos);
    });

    botonesFiltro.forEach(boton => {
        const activo = boton.dataset.filtro === filtro;
        boton.classList.toggle('activo', activo);
        boton.setAttribute('aria-pressed', String(activo));
    });

    textoResultado.textContent = filtro === 'todo'
        ? `Mostrando los ${platos.length} platos de la carta.`
        : `Mostrando ${visibles} de ${platos.length} platos.`;
    avisoSinResultados.hidden = visibles > 0;
}

botonesFiltro.forEach(boton => {
    boton.addEventListener('click', () => {
        aplicarFiltro(boton.dataset.filtro);
        // Lleva al usuario al principio de la carta filtrada
        const primera = document.querySelector('.seccion-carta:not(.oculto)');
        if (primera && window.scrollY > primera.offsetTop) {
            primera.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

document.getElementById('quitar-filtro').addEventListener('click', () => aplicarFiltro('todo'));

/* ---------- Vídeo: play al entrar en pantalla, pausa al salir ---------- */
const video = document.getElementById('video-ramen');

if ('IntersectionObserver' in window && video) {
    let pausadoPorUsuario = false;
    let estaEnPantalla = false;

    video.addEventListener('pause', () => {
        // Si el vídeo se pausa mientras está a la vista, lo ha pausado el usuario
        if (estaEnPantalla) pausadoPorUsuario = true;
    });
    video.addEventListener('play', () => { pausadoPorUsuario = false; });

    new IntersectionObserver(([entrada]) => {
        estaEnPantalla = entrada.isIntersecting;
        if (estaEnPantalla && !pausadoPorUsuario) {
            video.play().catch(() => { /* el navegador puede bloquear el autoplay */ });
        } else if (!estaEnPantalla) {
            video.pause();
        }
    }, { threshold: 0.5 }).observe(video);
}

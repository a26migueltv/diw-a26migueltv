/* =========================================================
   NAMI RAMEN · JavaScript de la portada
   - Contadores que suben desde 0 cuando aparecen en pantalla
   Autor: Miguel Tubío Vidal
   ========================================================= */

'use strict';

const contadores = document.querySelectorAll('[data-contador]');

function animarContador(elemento) {
    const destino = Number(elemento.dataset.contador);
    // Los años empiezan cerca del valor final para que no tarde demasiado
    const inicio = destino > 1000 ? destino - 40 : 0;
    const duracion = 1400;
    const t0 = performance.now();

    function paso(t) {
        const progreso = Math.min((t - t0) / duracion, 1);
        const suavizado = 1 - Math.pow(1 - progreso, 3); // easeOutCubic
        elemento.textContent = Math.round(inicio + (destino - inicio) * suavizado);
        if (progreso < 1) requestAnimationFrame(paso);
    }
    requestAnimationFrame(paso);
}

if ('IntersectionObserver' in window) {
    const observadorCifras = new IntersectionObserver((entradas, obs) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                animarContador(entrada.target);
                obs.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.6 });

    contadores.forEach(c => observadorCifras.observe(c));
}

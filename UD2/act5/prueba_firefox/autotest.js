/* Pruebas automáticas (solo para comprobar en Firefox; no forma parte de la entrega) */
(function () {
  const errores = window.__erroresJS || [];
  const pagina = location.pathname.split('/').pop().replace('.html', '');
  const res = [];
  const ok = (nombre, cond, extra) => res.push({ nombre, ok: !!cond, extra: extra || '' });
  const espera = ms => new Promise(r => setTimeout(r, ms));
  const visibles = () => [...document.querySelectorAll('.plato')].filter(p => !p.classList.contains('oculto')).length;

  async function comunes() {
    await document.fonts.ready;
    const f1 = await document.fonts.load('800 20px "Shippori Mincho B1"', 'Nami Ramen');
    const f2 = await document.fonts.load('400 16px "Zen Kaku Gothic New"', 'Nami Ramen');
    ok('Fuente Shippori Mincho B1 cargada', f1.length > 0 && document.fonts.check('800 20px "Shippori Mincho B1"', 'Nami Ramen'));
    ok('Fuente Zen Kaku Gothic New cargada', f2.length > 0 && document.fonts.check('400 16px "Zen Kaku Gothic New"', 'Nami Ramen'));
    const imgs = [...document.images];
    imgs.forEach(i => { i.loading = 'eager'; });
    await Promise.all(imgs.map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
    const rotas = imgs.filter(i => !i.naturalWidth).map(i => i.getAttribute('src'));
    ok('Imágenes cargadas (' + imgs.length + ')', rotas.length === 0, rotas.join(', '));
    ok('Sin scroll horizontal (' + innerWidth + ' px)', document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
       document.documentElement.scrollWidth + ' > ' + document.documentElement.clientWidth);
    // Aparición al hacer scroll
    for (let y = 0; y < document.body.scrollHeight; y += 200) { scrollTo(0, y); await espera(70); }
    await espera(900);
    const sinVer = [...document.querySelectorAll('.revelar')].filter(e => !e.classList.contains('visible') && e.offsetParent);
    ok('Animación de aparición al hacer scroll', sinVer.length === 0, sinVer.length + ' sin aparecer');
    ok('Botón volver arriba aparece', document.getElementById('boton-subir').classList.contains('visible'));
    ok('Cabecera compacta al bajar', document.getElementById('cabecera').classList.contains('compacta'));
    scrollTo(0, 0); await espera(200);
    // Menú móvil
    const bm = document.getElementById('boton-menu');
    if (getComputedStyle(bm).display !== 'none') {
      bm.click(); await espera(100);
      ok('Menú hamburguesa se abre', document.getElementById('navegacion-principal').classList.contains('abierto'));
      bm.click();
    }
    // Créditos
    const d = document.getElementById('dialogo-creditos');
    document.getElementById('boton-creditos').click(); await espera(100);
    ok('Ventana de créditos (dialog)', d.open && document.querySelectorAll('#lista-creditos li').length === 25);
    d.close();
    ok('Aviso abierto/cerrado (horario)', /Abierto|Cerrado/.test(document.getElementById('estado-abierto').textContent));
  }

  async function porPagina() {
    if (pagina === 'index') {
      await espera(1600);
      const v = [...document.querySelectorAll('[data-contador]')].map(e => e.textContent).join(',');
      ok('Contadores animados terminan en 18,6,22,2014', v === '18,6,22,2014', v);
    }
    if (pagina === 'conocenos') {
      const v = document.getElementById('visor');
      document.querySelector('.foto-galeria').click(); await espera(150);
      ok('Visor de fotos se abre', !v.hidden);
      const antes = document.getElementById('visor-pie').textContent;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' })); await espera(100);
      ok('Flecha derecha cambia de foto', document.getElementById('visor-pie').textContent !== antes);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); await espera(100);
      ok('Esc cierra el visor', v.hidden);
    }
    if (pagina === 'carta') {
      const esperado = { aperitivos: 3, ramen: 6, postres: 2, vegano: 2, 'sin-picante': 8, todo: 11 };
      for (const [f, n] of Object.entries(esperado)) {
        document.querySelector(`.filtro[data-filtro="${f}"]`).click(); await espera(80);
        ok('Filtro «' + f + '» muestra ' + n + ' platos', visibles() === n, 'muestra ' + visibles());
      }
      const vid = document.getElementById('video-ramen');
      ok('Vídeo: el navegador admite WebM o MP4', vid.canPlayType('video/webm') || vid.canPlayType('video/mp4'));
      vid.preload = 'auto'; vid.load();
      await new Promise(r => { if (vid.readyState >= 1) r(); vid.onloadedmetadata = r; vid.onerror = r; setTimeout(r, 4000); });
      ok('Vídeo carga (' + (vid.currentSrc || '').split('/').pop() + ')', vid.readyState >= 1 && !vid.error, vid.error ? 'error ' + vid.error.code : '');
    }
    if (pagina === 'contacto') {
      const f = document.getElementById('form-contacto');
      const set = (id, v) => { const e = document.getElementById(id); e.value = v; e.dispatchEvent(new Event('input')); e.dispatchEvent(new Event('change')); };
      const errores = () => [...document.querySelectorAll('.mensaje-error')].filter(e => e.textContent).length;
      document.getElementById('campo-motivo').value = ''; document.getElementById('campo-motivo').dispatchEvent(new Event('change'));
      f.requestSubmit(); await espera(100);
      ok('Enviar vacío marca 5 errores', errores() === 5, errores() + ' errores');
      set('campo-nombre', 'J4'); set('campo-email', 'juan@'); set('campo-telefono', '123');
      f.requestSubmit(); await espera(100);
      ok('Nombre, correo y teléfono incorrectos dan error',
         ['error-nombre', 'error-email', 'error-telefono'].every(id => document.getElementById(id).textContent));
      set('campo-motivo', 'reserva'); await espera(50);
      ok('Reserva muestra día, hora y personas', !document.getElementById('campos-reserva').hidden);
      const hoy = new Date(); const lunes = new Date(hoy); lunes.setDate(hoy.getDate() + ((8 - hoy.getDay()) % 7 || 7));
      const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
      set('campo-fecha', iso(lunes)); document.getElementById('campo-fecha').dispatchEvent(new Event('blur'));
      ok('No deja reservar en lunes', /lunes/i.test(document.getElementById('error-fecha').textContent));
      const martes = new Date(lunes); martes.setDate(lunes.getDate() + 1);
      set('campo-nombre', 'Uxía Pérez Varela'); set('campo-email', 'uxia@ejemplo.com'); set('campo-telefono', '600 123 456');
      set('campo-fecha', iso(martes)); set('campo-hora', '21:00'); set('campo-personas', '4');
      set('campo-mensaje', 'Somos cuatro, una persona es vegana.');
      document.getElementById('campo-privacidad').checked = true;
      f.requestSubmit(); await espera(1100);
      ok('Envío correcto muestra la confirmación', !document.getElementById('mensaje-enviado').hidden,
         document.getElementById('texto-enviado').textContent.slice(0, 60));
    }
  }

  window.addEventListener('load', async () => {
    try { await comunes(); await porPagina(); } catch (e) { ok('Error durante la prueba', false, String(e)); }
    ok('Sin errores de JavaScript', errores.length === 0, errores.join(' | '));
    parent.postMessage({ autotest: true, pagina, ancho: innerWidth, res, ua: navigator.userAgent }, '*');
  });
})();

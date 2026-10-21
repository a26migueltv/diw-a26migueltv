/* =========================================================
   NAMI RAMEN · desplegables propios (contacto.html)
   La lista de un <select> nativo la dibuja el sistema operativo
   (en macOS marca la opción en azul) y no se puede cambiar con CSS.
   Este script crea encima un desplegable accesible con los colores
   de Nami y mantiene sincronizado el <select> original, que sigue
   siendo el que se valida y se envía. Sin JavaScript se usa el nativo.
   Teclado: ↑ ↓ Inicio Fin para moverse, Intro o Espacio para elegir,
   Esc para cerrar y una letra para saltar a la opción que empieza por ella.
   ========================================================= */
document.querySelectorAll('.campo select').forEach(crearDesplegable);

function crearDesplegable(select) {
    const id = select.id;
    const etiqueta = document.querySelector(`label[for="${id}"]`);
    if (etiqueta && !etiqueta.id) etiqueta.id = `etiqueta-${id}`;

    const caja = document.createElement('div');
    caja.className = 'desplegable';

    const boton = document.createElement('button');
    boton.type = 'button';
    boton.id = `${id}-boton`;
    boton.className = 'desplegable-boton';
    boton.setAttribute('aria-haspopup', 'listbox');
    boton.setAttribute('aria-expanded', 'false');
    boton.setAttribute('aria-controls', `${id}-lista`);
    boton.setAttribute('aria-labelledby', `${etiqueta ? etiqueta.id + ' ' : ''}${id}-boton`);
    if (select.getAttribute('aria-describedby')) boton.setAttribute('aria-describedby', select.getAttribute('aria-describedby'));
    const valor = document.createElement('span');
    valor.className = 'desplegable-valor';
    boton.appendChild(valor);

    const lista = document.createElement('ul');
    lista.id = `${id}-lista`;
    lista.className = 'desplegable-lista';
    lista.setAttribute('role', 'listbox');
    lista.setAttribute('tabindex', '-1');
    if (etiqueta) lista.setAttribute('aria-labelledby', etiqueta.id);
    lista.hidden = true;

    // Copia las opciones (y los grupos <optgroup>) del select nativo
    const opciones = [];
    [...select.children].forEach(hijo => {
        if (hijo.tagName === 'OPTGROUP') {
            const grupo = document.createElement('li');
            grupo.className = 'desplegable-grupo';
            grupo.setAttribute('role', 'presentation');
            grupo.textContent = hijo.label;
            lista.appendChild(grupo);
            [...hijo.children].forEach(o => anadir(o));
        } else {
            anadir(hijo);
        }
    });
    function anadir(opcion) {
        const li = document.createElement('li');
        li.id = `${id}-opcion-${opciones.length}`;
        li.className = 'desplegable-opcion';
        li.setAttribute('role', 'option');
        li.dataset.valor = opcion.value;
        li.textContent = opcion.textContent;
        if (opcion.value === '') li.classList.add('desplegable-opcion--vacia');
        lista.appendChild(li);
        opciones.push(li);
    }

    // El select nativo se queda en la página, oculto, para la validación y el envío
    select.classList.add('select-mejorado');
    select.tabIndex = -1;
    select.setAttribute('aria-hidden', 'true');
    select.after(caja);
    caja.append(boton, lista);

    let activa = -1;
    let busqueda = '';
    let temporizador;

    function sincronizar() {
        const i = opciones.findIndex(li => li.dataset.valor === select.value);
        opciones.forEach((li, n) => li.setAttribute('aria-selected', String(n === i)));
        valor.textContent = i >= 0 ? opciones[i].textContent : '';
        caja.classList.toggle('desplegable--vacio', !select.value);
    }

    function marcar(i) {
        if (i < 0 || i >= opciones.length) return;
        opciones.forEach(li => li.classList.remove('activa'));
        activa = i;
        opciones[i].classList.add('activa');
        lista.setAttribute('aria-activedescendant', opciones[i].id);
        opciones[i].scrollIntoView({ block: 'nearest' });
    }

    function abrir() {
        document.querySelectorAll('.desplegable--abierto').forEach(c => c !== caja && c.cerrar && c.cerrar());
        lista.hidden = false;
        caja.classList.add('desplegable--abierto');
        boton.setAttribute('aria-expanded', 'true');
        const actual = opciones.findIndex(li => li.dataset.valor === select.value);
        marcar(actual >= 0 ? actual : 0);
        lista.focus();
    }

    function cerrar(devolverFoco = true) {
        lista.hidden = true;
        caja.classList.remove('desplegable--abierto');
        boton.setAttribute('aria-expanded', 'false');
        if (devolverFoco) boton.focus();
    }
    caja.cerrar = () => cerrar(false);

    function elegir(i) {
        const nuevo = opciones[i].dataset.valor;
        if (select.value !== nuevo) {
            select.value = nuevo;
            select.dispatchEvent(new Event('input', { bubbles: true }));
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }
        sincronizar();
        cerrar();
    }

    function saltarA(letra) {
        clearTimeout(temporizador);
        busqueda += letra.toLowerCase();
        temporizador = setTimeout(() => { busqueda = ''; }, 600);
        const i = opciones.findIndex(li => li.textContent.toLowerCase().startsWith(busqueda));
        if (i >= 0) marcar(i);
    }

    boton.addEventListener('click', () => (lista.hidden ? abrir() : cerrar()));
    boton.addEventListener('keydown', e => {
        if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
            e.preventDefault();
            abrir();
        }
    });

    lista.addEventListener('keydown', e => {
        const teclas = {
            ArrowDown: () => marcar(Math.min(activa + 1, opciones.length - 1)),
            ArrowUp: () => marcar(Math.max(activa - 1, 0)),
            Home: () => marcar(0),
            End: () => marcar(opciones.length - 1),
            Enter: () => elegir(activa),
            ' ': () => elegir(activa),
            Escape: () => cerrar(),
            Tab: () => cerrar(false)
        };
        if (teclas[e.key]) {
            if (e.key !== 'Tab') e.preventDefault();
            teclas[e.key]();
        } else if (e.key.length === 1) {
            saltarA(e.key);
        }
    });

    lista.addEventListener('mousemove', e => {
        const li = e.target.closest('.desplegable-opcion');
        if (li) marcar(opciones.indexOf(li));
    });
    lista.addEventListener('click', e => {
        const li = e.target.closest('.desplegable-opcion');
        if (li) elegir(opciones.indexOf(li));
    });

    // Al salir del desplegable se valida como si fuera el select (evento blur)
    caja.addEventListener('focusout', e => {
        if (caja.contains(e.relatedTarget)) return;
        if (!lista.hidden) cerrar(false);
        select.dispatchEvent(new FocusEvent('blur'));
    });
    document.addEventListener('click', e => {
        if (!caja.contains(e.target) && !lista.hidden) cerrar(false);
    });

    // Si el código pone el foco o cambia el valor del select, se refleja aquí
    select.addEventListener('focus', () => boton.focus());
    select.addEventListener('change', sincronizar);
    if (etiqueta) etiqueta.addEventListener('click', e => { e.preventDefault(); boton.focus(); });
    select.form && select.form.addEventListener('reset', () => setTimeout(sincronizar));

    // El estado de error del select (aria-invalid) también lo tiene el botón
    new MutationObserver(() => {
        boton.setAttribute('aria-invalid', select.getAttribute('aria-invalid') || 'false');
    }).observe(select, { attributes: true, attributeFilter: ['aria-invalid'] });

    sincronizar();
}

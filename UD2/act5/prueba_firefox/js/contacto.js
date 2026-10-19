/* =========================================================
   NAMI RAMEN · JavaScript de Contacto
   - Validación del formulario en el cliente (campo a campo
     mientras se escribe y completa al enviar)
   - Campos de reserva que aparecen solo si hacen falta
   - Contador de caracteres y selector de personas
   - Día de hoy resaltado en el horario
   Autor: Miguel Tubío Vidal
   ========================================================= */

'use strict';

const formulario = document.getElementById('form-contacto');
const campos = {
    nombre: document.getElementById('campo-nombre'),
    email: document.getElementById('campo-email'),
    telefono: document.getElementById('campo-telefono'),
    motivo: document.getElementById('campo-motivo'),
    fecha: document.getElementById('campo-fecha'),
    hora: document.getElementById('campo-hora'),
    personas: document.getElementById('campo-personas'),
    mensaje: document.getElementById('campo-mensaje'),
    privacidad: document.getElementById('campo-privacidad'),
};
const bloqueReserva = document.getElementById('campos-reserva');
const marcaTelefono = document.getElementById('telefono-obligatorio');
const resumenErrores = document.getElementById('resumen-errores');
const contador = document.getElementById('contador-mensaje');
const confirmacion = document.getElementById('mensaje-enviado');

const LIMITE_MENSAJE = 500;
const MIN_MENSAJE = 10;
const EXP_NOMBRE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñÇç' -]+$/;
const EXP_EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
// Teléfono español: 9 cifras empezando por 6, 7, 8 o 9, con +34 opcional
const EXP_TELEFONO = /^(\+34|0034)?[6789]\d{8}$/;

const esReserva = () => campos.motivo.value === 'reserva';

/* ---------- Funciones de comprobación ----------
   Cada una devuelve el texto del error o una cadena vacía si es correcto. */
const reglas = {
    nombre(valor) {
        valor = valor.trim();
        if (!valor) return 'Escribe tu nombre.';
        if (valor.length < 3) return 'El nombre debe tener al menos 3 letras.';
        if (!EXP_NOMBRE.test(valor)) return 'Usa solo letras y espacios.';
        return '';
    },
    email(valor) {
        valor = valor.trim();
        if (!valor) return 'Necesitamos tu correo para responderte.';
        if (!EXP_EMAIL.test(valor)) return 'El correo no parece válido (ej.: nombre@dominio.com).';
        return '';
    },
    telefono(valor) {
        const limpio = valor.replace(/[\s.-]/g, '');
        if (!limpio) return esReserva() ? 'Para reservar necesitamos un teléfono.' : '';
        if (!EXP_TELEFONO.test(limpio)) return 'Escribe un teléfono de 9 cifras (ej.: 600 123 456).';
        return '';
    },
    motivo(valor) {
        return valor ? '' : 'Elige el motivo de tu mensaje.';
    },
    fecha(valor) {
        if (!esReserva()) return '';
        if (!valor) return 'Elige el día de la reserva.';
        const elegida = new Date(valor + 'T12:00:00');
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const limite = new Date(hoy);
        limite.setDate(limite.getDate() + 60);
        if (elegida < hoy) return 'La fecha ya ha pasado.';
        if (elegida > limite) return 'Solo aceptamos reservas con 60 días de antelación como máximo.';
        if (elegida.getDay() === 1) return 'Los lunes cerramos. Elige otro día.';
        return '';
    },
    hora(valor) {
        if (!esReserva()) return '';
        if (!valor) return 'Elige una hora.';
        // Si la reserva es para hoy, la hora no puede haber pasado
        if (campos.fecha.value) {
            const momento = new Date(`${campos.fecha.value}T${valor}:00`);
            if (momento < new Date()) return 'Esa hora ya ha pasado hoy.';
        }
        return '';
    },
    personas(valor) {
        if (!esReserva()) return '';
        const n = Number(valor);
        if (!Number.isInteger(n) || n < 1) return 'Indica cuántas personas venís.';
        if (n > 8) return 'Para más de 8 personas elige «Comida o cena de grupo».';
        return '';
    },
    mensaje(valor) {
        const largo = valor.trim().length;
        if (!largo) return 'Escribe tu mensaje.';
        if (largo < MIN_MENSAJE) return `Escribe al menos ${MIN_MENSAJE} caracteres (llevas ${largo}).`;
        return '';
    },
    privacidad(_valor, campo) {
        return campo.checked ? '' : 'Debes aceptar el uso de tus datos para que podamos responderte.';
    },
};

/** Valida un campo, pinta su estado y devuelve true si es correcto. */
function validarCampo(nombre) {
    const campo = campos[nombre];
    const error = reglas[nombre](campo.value, campo);
    const grupo = campo.closest('.campo');
    const salida = document.getElementById(`error-${nombre}`);

    salida.textContent = error;
    grupo.classList.toggle('error', Boolean(error));
    grupo.classList.toggle('correcto', !error && campo.value !== '' && campo.type !== 'checkbox');
    campo.setAttribute('aria-invalid', String(Boolean(error)));
    return !error;
}

/* ---------- Validación mientras se escribe ----------
   Para no molestar, un campo solo muestra errores después de haberlo
   abandonado una vez (blur) o de haber intentado enviar. */
const tocados = new Set();

Object.keys(campos).forEach(nombre => {
    const campo = campos[nombre];
    const evento = campo.tagName === 'SELECT' || campo.type === 'checkbox' || campo.type === 'date' ? 'change' : 'input';

    campo.addEventListener('blur', () => {
        tocados.add(nombre);
        validarCampo(nombre);
    });
    campo.addEventListener(evento, () => {
        if (tocados.has(nombre)) validarCampo(nombre);
    });
});

/* ---------- Campos de reserva ---------- */
function actualizarReserva() {
    const reserva = esReserva();
    bloqueReserva.hidden = !reserva;
    marcaTelefono.hidden = !reserva;
    campos.telefono.required = reserva;
    ['fecha', 'hora', 'personas'].forEach(n => {
        campos[n].required = reserva;
        if (!reserva) {
            // Limpia los errores de campos que ya no se ven
            document.getElementById(`error-${n}`).textContent = '';
            campos[n].closest('.campo').classList.remove('error', 'correcto');
        }
    });
    if (tocados.has('telefono')) validarCampo('telefono');
}
campos.motivo.addEventListener('change', actualizarReserva);

// La fecha mínima es hoy (ayuda al usuario en el calendario del navegador)
function fechaISO(fecha) {
    const local = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
}
const hoy = new Date();
const maximo = new Date();
maximo.setDate(maximo.getDate() + 60);
campos.fecha.min = fechaISO(hoy);
campos.fecha.max = fechaISO(maximo);
campos.fecha.addEventListener('change', () => {
    if (campos.hora.value) validarCampo('hora');
});

// Botones − y + para el número de personas
function cambiarPersonas(diferencia) {
    const actual = Number(campos.personas.value) || 0;
    campos.personas.value = Math.min(8, Math.max(1, actual + diferencia));
    tocados.add('personas');
    validarCampo('personas');
}
document.getElementById('menos-personas').addEventListener('click', () => cambiarPersonas(-1));
document.getElementById('mas-personas').addEventListener('click', () => cambiarPersonas(1));

/* ---------- Contador de caracteres ---------- */
function actualizarContador() {
    const largo = campos.mensaje.value.length;
    contador.textContent = `${largo} / ${LIMITE_MENSAJE}`;
    contador.classList.toggle('casi-lleno', largo > LIMITE_MENSAJE - 50);
}
campos.mensaje.addEventListener('input', actualizarContador);

/* ---------- Envío ---------- */
formulario.addEventListener('submit', ev => {
    ev.preventDefault();

    const nombres = Object.keys(campos);
    nombres.forEach(n => tocados.add(n));
    const incorrectos = nombres.filter(n => !validarCampo(n));

    if (incorrectos.length) {
        resumenErrores.hidden = false;
        resumenErrores.textContent = incorrectos.length === 1
            ? 'Hay 1 campo por revisar. Te lo hemos marcado en rojo.'
            : `Hay ${incorrectos.length} campos por revisar. Te los hemos marcado en rojo.`;
        campos[incorrectos[0]].focus();
        return;
    }

    resumenErrores.hidden = true;

    // No hay servidor: se simula el envío y se muestra la confirmación
    const boton = document.getElementById('boton-enviar');
    boton.disabled = true;
    boton.textContent = 'Enviando…';

    setTimeout(() => {
        const nombre = campos.nombre.value.trim().split(' ')[0];
        let texto = `Gracias, ${nombre}. Te responderemos a ${campos.email.value.trim()} en menos de 24 horas.`;
        if (esReserva()) {
            const fecha = new Date(campos.fecha.value + 'T12:00:00').toLocaleDateString('es-ES', {
                weekday: 'long', day: 'numeric', month: 'long',
            });
            texto = `Gracias, ${nombre}. Hemos apuntado tu solicitud de mesa para ${campos.personas.value} ` +
                `${campos.personas.value === '1' ? 'persona' : 'personas'} el ${fecha} a las ${campos.hora.value}. ` +
                `Te la confirmaremos por teléfono o en ${campos.email.value.trim()}.`;
        }
        document.getElementById('texto-enviado').textContent = texto;

        formulario.hidden = true;
        confirmacion.hidden = false;
        confirmacion.focus();
        boton.disabled = false;
        boton.textContent = 'Enviar mensaje';
    }, 700);
});

// Volver a mostrar el formulario vacío
document.getElementById('nuevo-mensaje').addEventListener('click', () => {
    formulario.reset();
    tocados.clear();
    document.querySelectorAll('.campo').forEach(g => g.classList.remove('error', 'correcto'));
    document.querySelectorAll('.mensaje-error').forEach(e => { e.textContent = ''; });
    actualizarReserva();
    actualizarContador();
    confirmacion.hidden = true;
    formulario.hidden = false;
    campos.nombre.focus();
});

/* ---------- Horario: resaltar el día de hoy ---------- */
const filaHoy = document.querySelector(`#tabla-horario tr[data-dia="${new Date().getDay()}"]`);
if (filaHoy) filaHoy.classList.add('hoy');

const estadoHorario = document.getElementById('estado-horario');
if (typeof estadoRestaurante === 'function') {
    const estado = estadoRestaurante(); // definida en comun.js
    estadoHorario.textContent = estado.texto;
    estadoHorario.classList.toggle('cerrado', !estado.abierto);
}

// Si se llega con #formulario-contacto desde "Reservar mesa", se preselecciona la reserva
if (location.hash === '#formulario-contacto' && !campos.motivo.value) {
    campos.motivo.value = 'reserva';
    actualizarReserva();
}

const enlaces = document.querySelectorAll(".enlace");
const secciones = document.querySelectorAll(".seccion");

enlaces.forEach((enlace) => {
  enlace.addEventListener("click", (evento) => {
    evento.preventDefault();

    // Quitamos el resaltado de todos los enlaces y lo ponemos en el pulsado
    enlaces.forEach((e) => e.classList.remove("activo"));
    enlace.classList.add("activo");

    // Ocultamos todas las secciones y mostramos solo la que toca
    secciones.forEach((s) => s.classList.remove("visible"));
    const idSeccion = enlace.dataset.seccion;
    document.getElementById(idSeccion).classList.add("visible");
  });
});

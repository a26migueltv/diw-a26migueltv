const selectActividad = document.getElementById("actividad");
const btnCargar = document.getElementById("btnCargar");
const marco = document.getElementById("marco");
const vacio = document.getElementById("vacio");
const aviso = document.getElementById("aviso");

// Actividades cuyo resultado sale por la consola
const usanConsola = ["ej01", "ej02", "ej03", "ej07"];

btnCargar.addEventListener("click", () => {
  const ruta = selectActividad.value;

  if (ruta === "") {
    aviso.textContent = "Primero elige una actividad del desplegable.";
    return;
  }

  // Cargamos la actividad dentro del iframe
  marco.src = ruta;
  marco.hidden = false;
  vacio.hidden = true;

  const carpeta = ruta.split("/")[0];
  if (usanConsola.includes(carpeta)) {
    aviso.textContent = "Esta actividad muestra su resultado en la consola del navegador (F12).";
  } else {
    aviso.textContent = "";
  }
});

const inputNombre = document.getElementById("nombre");
const btnMostrar = document.getElementById("btnMostrar");

btnMostrar.addEventListener("click", () => {
  const nombre = inputNombre.value.trim();

  if (nombre === "") {
    console.log("No has escrito ningún nombre.");
  } else {
    console.log("Nombre introducido: " + nombre);
  }
});

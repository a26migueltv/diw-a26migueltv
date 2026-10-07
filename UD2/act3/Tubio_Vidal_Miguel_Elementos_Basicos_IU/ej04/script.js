const inputNombre = document.getElementById("nombre");
const inputApellidos = document.getElementById("apellidos");
const btnEnviar = document.getElementById("btnEnviar");
const saludo = document.getElementById("saludo");

btnEnviar.addEventListener("click", () => {
  const nombre = inputNombre.value.trim();
  const apellidos = inputApellidos.value.trim();

  if (nombre === "" || apellidos === "") {
    saludo.textContent = "Rellena el nombre y los apellidos.";
    saludo.classList.add("error");
    return;
  }

  saludo.classList.remove("error");
  saludo.textContent = "¡Hola, " + nombre + " " + apellidos + "! Encantado de saludarte.";
});

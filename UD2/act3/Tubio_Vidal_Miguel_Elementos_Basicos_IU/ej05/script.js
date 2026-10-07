const btnEdad = document.getElementById("btnEdad");

btnEdad.addEventListener("click", () => {
  const respuesta = prompt("¿Cuántos años tienes?");

  // prompt() devuelve null si el usuario pulsa "Cancelar"
  if (respuesta === null) {
    alert("Has cancelado la operación.");
    return;
  }

  const edad = Number(respuesta.trim());

  if (respuesta.trim() === "" || !Number.isInteger(edad) || edad < 0) {
    alert("Eso no es una edad válida.");
    return;
  }

  alert("Tienes " + edad + " años.");
});

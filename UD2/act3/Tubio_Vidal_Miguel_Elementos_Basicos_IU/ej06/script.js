const selectColor = document.getElementById("color");
const btnAplicar = document.getElementById("btnAplicar");
const resultado = document.getElementById("resultado");
const muestra = document.getElementById("muestra");

btnAplicar.addEventListener("click", () => {
  const valor = selectColor.value;

  if (valor === "") {
    resultado.textContent = "No has elegido ningún color.";
    muestra.className = "muestra";
    return;
  }

  // Texto visible de la opción elegida (Rojo, Verde, Azul)
  const texto = selectColor.options[selectColor.selectedIndex].text;
  resultado.textContent = "Color seleccionado: " + texto;

  // Mejora opcional: pintar la caja con el color elegido
  muestra.className = "muestra " + valor;
});

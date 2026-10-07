const btnConfirmar = document.getElementById("btnConfirmar");
const resultado = document.getElementById("resultado");

btnConfirmar.addEventListener("click", () => {
  // Busca el radio del grupo "pago" que esté marcado
  const seleccionado = document.querySelector('input[name="pago"]:checked');

  if (seleccionado === null) {
    resultado.textContent = "No has seleccionado ningún método de pago.";
  } else {
    resultado.textContent = "Método de pago seleccionado: " + seleccionado.value;
  }
});

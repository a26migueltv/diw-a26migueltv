const btnOrdenar = document.getElementById("btnOrdenar");
const resultado = document.getElementById("resultado");

btnOrdenar.addEventListener("click", () => {
  // Todas las casillas marcadas (puede haber varias o ninguna)
  const marcados = document.querySelectorAll('input[name="ingrediente"]:checked');

  // Vaciamos el resultado anterior
  resultado.textContent = "";

  if (marcados.length === 0) {
    resultado.textContent = "Pizza sin ingredientes extra.";
    return;
  }

  const titulo = document.createElement("p");
  titulo.textContent = "Has pedido una pizza con:";
  resultado.appendChild(titulo);

  const lista = document.createElement("ul");
  marcados.forEach((casilla) => {
    const item = document.createElement("li");
    item.textContent = casilla.value;
    lista.appendChild(item);
  });
  resultado.appendChild(lista);
});

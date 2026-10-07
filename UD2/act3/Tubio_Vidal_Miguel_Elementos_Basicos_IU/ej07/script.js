const formLogin = document.getElementById("formLogin");
const inputUsuario = document.getElementById("usuario");
const inputContrasena = document.getElementById("contrasena");

formLogin.addEventListener("submit", (evento) => {
  // Evita que el formulario recargue la página
  evento.preventDefault();

  console.log("Usuario: " + inputUsuario.value);
  console.log("Contraseña: " + inputContrasena.value);
});

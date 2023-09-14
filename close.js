/* Función para cerrar sesión y eliminar toda la información */
function cerrarSesion() {
  sessionStorage.clear();
  window.location.replace("../index.html");
}

document
  .getElementById("cerrarSesionButton")
  .addEventListener("click", cerrarSesion);

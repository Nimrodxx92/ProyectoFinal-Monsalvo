/* Para iniciar sesion en la página */
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Verificar las creedenciales del JSON e iniciar sesión
    fetch("./JSON/usuarios.json")
      .then((response) => response.json())
      .then((usuarios) => {
        const usuarioEncontrado = usuarios.find(
          (user) => user.username === username && user.password === password
        );

        if (usuarioEncontrado) {
          window.location.href = "./html/catalogo.html";
        } else {
          Swal.fire({
            icon: "error",
            title: "Usuario y/o contraseña incorrecto",
            text: "No se encontraron creedenciales",
          });
        }
      })
      .catch((error) => {
        console.error("Error al cargar usuarios.json:", error);
      });
  });

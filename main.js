const listaProducts = document.getElementById("product-list"); // Obtener el elemento de la lista de productos
let products = []; // Para almacenar los productos

// Función para mostrar los elementos
function mostrarProductos(productosAMostrar) {
  listaProducts.innerHTML = productosAMostrar
    .map(
      (product) => `
        <div class="product">
            <img src="${product.imagen}" alt="${product.nombre}">
            <h3>${product.nombre}</h3>
            <p>Precio: $${product.precio}</p>
            <button class="add-to-cart" data-id="${product.id}">Agregar al Carrito</button>
        </div>
    `
    )
    .join("");
}

// Traer los productos del .JSON
fetch("../JSON/productos.json")
  .then((response) =>
    response.ok
      ? response.json()
      : Promise.reject("La solicitud no se pudo completar.")
  )
  .then((data) => {
    products = data.productos; // Almacena los productos en la variable products
    mostrarProductos(products);
  })
  .catch((error) => {
    console.error("Error al cargar los datos desde el archivo JSON:", error);
  });

// Obtener el elemento del carrito y mostrar el total
const cartElement = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");

const carritoAlmacenado = localStorage.getItem("cart"); // Obtener los datos del carrito almacenado

const cartItems = carritoAlmacenado ? JSON.parse(carritoAlmacenado) : []; // Array de productos en el carrito, usando los datos del almacenamiento

listaProducts.addEventListener("click", (event) => {
  if (event.target.classList.contains("add-to-cart")) {
    const productId = parseInt(event.target.getAttribute("data-id"));
    const productToAdd = products.find((product) => product.id === productId);
    if (productToAdd) {
      cartItems.push(productToAdd);
      actualizarCarrito();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Agregado al carrito de compras",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
});

// Evento para los clicks en el carrito
cartElement.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-from-cart")) {
    const productId = parseInt(event.target.getAttribute("data-id"));
    const productIndex = cartItems.findIndex((item) => item.id === productId);
    if (productIndex !== -1) {
      cartItems.splice(productIndex, 1);
      actualizarCarrito();
      Swal.fire("Producto eliminado");
    }
  }
});

// Actualizar la presentación del carrito y calcular el total
function crearCartItem(item) {
  const cartItem = document.createElement("li");
  cartItem.innerHTML = `
        <span>${item.nombre}</span> - $${item.precio}
        <button class="remove-from-cart" data-id="${item.id}">Eliminar</button>
    `;
  return cartItem;
}

function actualizarCarrito() {
  cartElement.innerHTML = "";
  let total = 0;
  cartItems.forEach((item) => {
    const cartItem = crearCartItem(item);
    cartElement.appendChild(cartItem);
    total += item.precio;
  });

  const cartBadge = document.getElementById("cart-cant");
  cartBadge.textContent = cartItems.length;
  cartTotalElement.textContent = "$" + total;
  localStorage.setItem("cart", JSON.stringify(cartItems));
}

// Evento antes de que la ventana se cierre
window.addEventListener("beforeunload", () => {
  localStorage.setItem("products", JSON.stringify(products)); // Almacenar los productos en el almacenamiento local como JSON antes de cerrar
});

// Evento de filtro de nombres
const nameFilter = document.getElementById("nameFilter");
nameFilter.addEventListener("change", actualizarProducts);

// Función para actualizar los productos según el filtro
function actualizarProducts() {
  const selectedName = nameFilter.value;
  const filteredProducts = products.filter((product) => {
    const nameMatch =
      selectedName === "all" || product.nombre.includes(selectedName);
    return nameMatch;
  });

  mostrarProductos(filteredProducts); // Mostrar los productos filtrados en la página
}

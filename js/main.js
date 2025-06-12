const menuItems = {
  "City Bell": [
    { nombre: "Ceviche", precio: 3500 },
    { nombre: "Lomo Saltado", precio: 4000 },
    { nombre: "Anticuchos", precio: 3000 },
  ],
  Centro: [
    { nombre: "Ají de Gallina", precio: 3700 },
    { nombre: "Pollo a la Brasa", precio: 4200 },
  ],
  Tolosa: [
    { nombre: "Papa a la Huancaína", precio: 3200 },
    { nombre: "Chaufa", precio: 3800 },
  ],
};

const carrito = [];

if (document.getElementById("menu")) {
  const sucursal = document.title.split(" - ")[1].split("Sucursal ")[1];
  const menu = document.getElementById("menu");
  menuItems[sucursal].forEach((item, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>${item.nombre}</strong> - $${item.precio}</p>
      <button onclick="agregarAlCarrito('${item.nombre}', ${item.precio})">Agregar</button>
    `;
    menu.appendChild(div);
  });
}

function agregarAlCarrito(nombre, precio) {
  carrito.push({ nombre, precio });
  renderCarrito();
}

function renderCarrito() {
  const lista = document.getElementById("carrito-lista");
  lista.innerHTML = "";
  carrito.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} - $${item.precio}`;
    lista.appendChild(li);
  });
}

function finalizarPedido(sucursal) {
  const numeroPedido = Math.floor(1000 + Math.random() * 9000);
  let mensaje = `¡Hola! Quiero hacer un pedido en la sucursal ${sucursal}.\nPedido N°${numeroPedido}:\n`;
  let total = 0;
  carrito.forEach((item) => {
    mensaje += `- ${item.nombre}: $${item.precio}\n`;
    total += item.precio;
  });
  mensaje += `Total: $${total}`;
  const url = `https://wa.me/5492210000000?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}
function mostrarContenido() {
  document.getElementById("pantalla-bienvenida").style.display = "none";
  document.getElementById("contenido-principal").style.display = "block";
}

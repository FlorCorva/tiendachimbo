const carrito = [];

document.addEventListener("DOMContentLoaded", () => {
  const finalizarBtn = document.getElementById("finalizar-btn");
  if (finalizarBtn) {
    finalizarBtn.addEventListener("click", finalizarPedido);
  }
});

function agregarAlCarrito(nombre, precio) {
  carrito.push({ nombre, precio });
  renderCarrito();
}

function renderCarrito() {
  const lista = document.getElementById("carrito-lista");
  lista.innerHTML = "";
  let total = 0;
  carrito.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} - $${item.precio}`;
    lista.appendChild(li);
    total += item.precio;
  });
  const totalCarrito = document.getElementById("total-carrito");
  if (totalCarrito) {
    totalCarrito.textContent = total;
  }
}

function generarNumeroPedido() {
  const ahora = new Date();
  const numero = ahora.getFullYear().toString().slice(-2) +
    (ahora.getMonth() + 1).toString().padStart(2, '0') +
    ahora.getDate().toString().padStart(2, '0') +
    ahora.getHours().toString().padStart(2, '0') +
    ahora.getMinutes().toString().padStart(2, '0') +
    ahora.getSeconds().toString().padStart(2, '0');
  return `#PED${numero}`;
}

function finalizarPedido() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  // Detección de sucursal desde el <title>
  let sucursal = "Casamadre";
  const titulo = document.title.toLowerCase();
  if (titulo.includes("city bell")) sucursal = "City Bell";
  else if (titulo.includes("baxar")) sucursal = "Baxar";
  else if (titulo.includes("casa madre")) sucursal = "Casamadre";

  const numerosWhatsApp = {
    "Casamadre": "5492213091466",
    "City Bell": "5492215980622",
    "Baxar": "5492216815851"
  };

  const numeroPedido = generarNumeroPedido();
  let mensaje = `¡Hola! Quiero hacer un pedido en la sucursal ${sucursal}.\nNúmero de pedido: ${numeroPedido}\n`;
  let total = 0;

  carrito.forEach((item) => {
    mensaje += `- ${item.nombre}: $${item.precio}\n`;
    total += item.precio;
  });

  mensaje += `Total: $${total}`;

  const numeroWA = numerosWhatsApp[sucursal];
  const url = `https://wa.me/${numeroWA}?text=${encodeURIComponent(mensaje)}`;

  window.location.href = url;
}

// Función extra (no relacionada con carrito)
function mostrarContenido() {
  const bienvenida = document.getElementById("pantalla-bienvenida");
  const contenido = document.getElementById("contenido-principal");
  if (bienvenida && contenido) {
    bienvenida.style.display = "none";
    contenido.style.display = "block";
  }
}

// subirProductos.ts
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { productosCityBell } from "./dataCityBell";

async function subirProductos() {
  const sucursalRef = collection(db, "sucursales", "citybell", "productos");

  for (const producto of productosCityBell) {
    await addDoc(sucursalRef, producto);
  }

  console.log("Productos subidos correctamente.");
}

subirProductos();
export default subirProductos;

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

type Producto = {
  id: string;
  nombre: string;
  precio: number;
};

type Sucursal = {
  id: string;
  nombre: string;
  productos: Producto[];
};

const sucursalesData: Sucursal[] = [
  { id: "citybell", nombre: "City Bell", productos: [] },
  { id: "local2", nombre: "Sucursal 2", productos: [] },
  { id: "local3", nombre: "Sucursal 3", productos: [] },
];

export default function App() {
  const [sucursales, setSucursales] = useState<Sucursal[]>(sucursalesData);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<string>(
    sucursalesData[0].id
  );
  const [loading, setLoading] = useState<boolean>(false);

  // Cargar productos de Firestore al cambiar sucursal
  useEffect(() => {
    async function cargarProductos() {
      setLoading(true);
      try {
        const productosRef = collection(
          db,
          "sucursales",
          sucursalSeleccionada,
          "productos"
        );
        const snapshot = await getDocs(productosRef);
        const productos: Producto[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Producto, "id">),
        }));
        setSucursales((prev) =>
          prev.map((suc) =>
            suc.id === sucursalSeleccionada ? { ...suc, productos } : suc
          )
        );
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
      setLoading(false);
    }
    cargarProductos();
  }, [sucursalSeleccionada]);

  // Función para cambiar precio localmente y en Firestore
  const cambiarPrecio = async (productoId: string, nuevoPrecio: number) => {
    setSucursales((prev) =>
      prev.map((suc) =>
        suc.id === sucursalSeleccionada
          ? {
              ...suc,
              productos: suc.productos.map((p) =>
                p.id === productoId ? { ...p, precio: nuevoPrecio } : p
              ),
            }
          : suc
      )
    );

    // Actualizar en Firestore
    try {
      const productoDocRef = doc(
        db,
        "sucursales",
        sucursalSeleccionada,
        "productos",
        productoId
      );
      await updateDoc(productoDocRef, { precio: nuevoPrecio });
    } catch (error) {
      console.error("Error actualizando precio:", error);
    }
  };

  const sucursalActual = sucursales.find((s) => s.id === sucursalSeleccionada);

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Panel de Precios</h1>

      <label>
        Elegir Sucursal:{" "}
        <select
          value={sucursalSeleccionada}
          onChange={(e) => setSucursalSeleccionada(e.target.value)}
        >
          {sucursales.map((suc) => (
            <option key={suc.id} value={suc.id}>
              {suc.nombre}
            </option>
          ))}
        </select>
      </label>

      {loading && <p>Cargando productos...</p>}

      <div style={{ marginTop: 20 }}>
        {sucursalActual?.productos.map((producto) => (
          <div
            key={producto.id}
            style={{
              marginBottom: 15,
              borderBottom: "1px solid #ccc",
              paddingBottom: 10,
            }}
          >
            <strong>{producto.nombre}</strong>
            <br />
            Precio:{" "}
            <input
              type="number"
              value={producto.precio}
              min={0}
              onChange={(e) =>
                cambiarPrecio(producto.id, Number(e.target.value))
              }
              style={{ width: 100 }}
            />
          </div>
        ))}
        {!loading && sucursalActual?.productos.length === 0 && (
          <p>No hay productos para esta sucursal.</p>
        )}
      </div>
    </div>
  );
}

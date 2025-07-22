import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

type ProductoPlano = {
  idCategoria: string; // ej: "ceviches"
  nombre: string; // ej: "chimbotana"
  precio: number;
};

const sucursales = ["city bell", "centro", "casa madre"];

export default function App() {
  const [sucursal, setSucursal] = useState("city bell");
  const [productos, setProductos] = useState<ProductoPlano[]>([]);

  useEffect(() => {
    const fetchProductos = async () => {
      const colRef = collection(db, sucursal);
      const docsSnap = await getDocs(colRef);

      const productosPlano: ProductoPlano[] = [];

      for (const docSnap of docsSnap.docs) {
        const categoria = docSnap.id;
        const data = docSnap.data(); // contiene los productos como campos

        Object.entries(data).forEach(([nombre, precio]) => {
          productosPlano.push({
            idCategoria: categoria,
            nombre,
            precio: Number(precio),
          });
        });
      }

      setProductos(productosPlano);
    };

    fetchProductos();
  }, [sucursal]);

  const cambiarPrecio = async (
    idCategoria: string,
    nombreProducto: string,
    nuevoPrecio: number
  ) => {
    const docRef = doc(db, sucursal, idCategoria);
    await updateDoc(docRef, {
      [nombreProducto]: nuevoPrecio,
    });

    setProductos((prev) =>
      prev.map((p) =>
        p.idCategoria === idCategoria && p.nombre === nombreProducto
          ? { ...p, precio: nuevoPrecio }
          : p
      )
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Editar precios - {sucursal}</h1>

      <label>
        Elegí sucursal:
        <select value={sucursal} onChange={(e) => setSucursal(e.target.value)}>
          {sucursales.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <div>
        {productos.map((producto) => (
          <div key={`${producto.idCategoria}-${producto.nombre}`} style={{ marginBottom: 10 }}>
            <strong>{producto.nombre}</strong> ({producto.idCategoria}):{" "}
            <input
              type="number"
              value={producto.precio}
              onChange={(e) =>
                cambiarPrecio(
                  producto.idCategoria,
                  producto.nombre,
                  Number(e.target.value)
                )
              }
              style={{ width: 100 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

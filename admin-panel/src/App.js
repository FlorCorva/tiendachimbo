import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState("");
  const [preciosEditados, setPreciosEditados] = useState({});

  useEffect(() => {
    fetch("http://localhost:4000/precios")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        const primerasSucursales = Object.keys(data);
        if (primerasSucursales.length > 0) {
          setSucursalSeleccionada(primerasSucursales[0]);
        }
      })
      .catch((err) => console.error("Error cargando precios:", err));
  }, []);

  const handlePrecioChange = (producto, nuevoPrecio) => {
    setPreciosEditados((prev) => ({
      ...prev,
      [producto]: nuevoPrecio,
    }));
  };

  const guardarCambios = () => {
    const nuevosPrecios = {
      ...data[sucursalSeleccionada],
      ...preciosEditados,
    };

    const nuevoData = {
      ...data,
      [sucursalSeleccionada]: nuevosPrecios,
    };

    fetch("http://localhost:4000/precios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoData),
    })
      .then((res) => res.json())
      .then(() => {
        // 🚀 Después de guardar, pedimos los datos actualizados
        fetch("http://localhost:4000/precios")
          .then((res) => res.json())
          .then((dataActualizada) => {
            setData(dataActualizada);
            setPreciosEditados({});
            alert("Precios guardados y actualizados correctamente.");
          });
      })
      .catch((err) => console.error("Error guardando precios:", err));
  };

  if (!data) return <div>Cargando precios...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Panel de precios</h1>

      <label>Sucursal: </label>
      <select
        value={sucursalSeleccionada}
        onChange={(e) => setSucursalSeleccionada(e.target.value)}
      >
        {Object.keys(data).map((sucursal) => (
          <option key={sucursal} value={sucursal}>
            {sucursal}
          </option>
        ))}
      </select>

      <h2>{sucursalSeleccionada}</h2>
      <ul>
        {Object.entries(data[sucursalSeleccionada]).map(
          ([producto, precio]) => (
            <li key={producto}>
              {producto} - $
              <input
                type="number"
                value={
                  preciosEditados[producto] !== undefined
                    ? preciosEditados[producto]
                    : precio
                }
                onChange={(e) =>
                  handlePrecioChange(producto, Number(e.target.value))
                }
                style={{ width: "80px", marginLeft: "5px" }}
              />
            </li>
          )
        )}
      </ul>

      <button
        onClick={guardarCambios}
        style={{
          backgroundColor: "lightgreen",
          padding: "10px 20px",
          marginTop: "20px",
          fontSize: "16px",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Guardar precios
      </button>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";

function SquareRace({setProbabilidades}) {
  const [message, setMessage] = useState("");
  const [quadrados, setQuadrados] = useState([
    { id: 1, posX: 0, ativo: true, nitroAtivo: false, cor: "#3498db" },
  ]);

  const LARGURA_QUADRADOS = 30;

  const styles = {
    container: {
      position: "relative",
      height: "70vh",
      backgroundColor: "green",
      overflow: "hidden",
    },
    quadrado: {
      width: `${LARGURA_QUADRADOS}px`,
      aspectRatio: 1,
      position: "absolute",
    },
  };

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8765");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setQuadrados(data.quadrados)
      setProbabilidades(data.probabilidades)
      setMessage(data.message);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div style={styles.container}>
      {quadrados.map((quadrado) => (
        <div
          key={quadrado.id}
          style={{
            ...styles.quadrado,
            top: `${LARGURA_QUADRADOS + quadrado.id * 60}px`,
            transform: `translateX(${quadrado.posX}px)`,
            opacity: quadrado.ativo ? 1 : 0.5,
            backgroundColor: quadrado.nitroAtivo ? "#e74c3c" : quadrado.cor,
          }}
        />
      ))}
    </div>
  );
}

export default SquareRace;

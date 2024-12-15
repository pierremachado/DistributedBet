import React, { useEffect, useState } from "react";

interface SquareRaceProps {
  setOdds: React.Dispatch<React.SetStateAction<number[]>>
  quadrados: Quadrado[]
  setQuadrados: React.Dispatch<React.SetStateAction<Quadrado[]>>
  setIsClosedForBets: React.Dispatch<React.SetStateAction<boolean>>
  setCampeao: React.Dispatch<React.SetStateAction<Quadrado | undefined>>
}

function SquareRace({ setOdds, quadrados, setQuadrados, setIsClosedForBets, setCampeao }: SquareRaceProps) {
  const [, setMessage] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);

  const LARGURA_QUADRADOS = 30;

  const styles = {
    container: {
      position: "relative",
      height: "70vh",
      backgroundColor: "green",
      overflow: "hidden",
    } as React.CSSProperties,
    quadrado: {
      width: `${LARGURA_QUADRADOS}px`,
      aspectRatio: 1,
      position: "absolute",
    } as React.CSSProperties,
  };

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8765");
    setWs(socket);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setQuadrados(data.quadrados)
      setOdds(data.odds)
      setIsClosedForBets(data.closedForBets)
      setMessage(data.message);
      setCampeao(data.winner);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  const start = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send("start");
      setMessage(""); // Limpar o campo de entrada após o envio
    } else {
      console.error("WebSocket não está conectado.");
    }
  };


  return (
    <>
      <button onClick={start}>iniciar</button>
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
    </>
  );
}

export default SquareRace;

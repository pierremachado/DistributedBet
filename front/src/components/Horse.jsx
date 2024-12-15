import React, { useEffect, useState } from "react";

const Horse = ({ start, setStart, probabilidades, setProbabilidades }) => {
  const [quadrados, setQuadrados] = useState([]);

  const LARGURA_QUADRADOS = 30;
  const DELAY_MS = 32;
  const QUANTIDADE_QUADRADOS = 3;

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
    if (!start) return;

    const larguraTela = window.innerWidth;
    const cores = ["#3498db", "#059669", "#b45309", "#3b0764", "#facc15"];

    const inicializarQuadrados = () => {
      const novosQuadrados = Array.from({ length: QUANTIDADE_QUADRADOS }, (_, index) => ({
        id: index,
        posX: 0,
        velocidade: Math.random() + 1,
        ativo: true,
        nitroAtivo: false,
        tempoNitro: 0,
        cor: cores[index],
      }));
      setQuadrados(novosQuadrados);
    };

    inicializarQuadrados();

    const ativarNitro = () => {
      const quadradoAleatorio = Math.floor(Math.random() * QUANTIDADE_QUADRADOS);
      setQuadrados((prevQuadrados) =>
        prevQuadrados.map((quadrado, index) => {
          if (index === quadradoAleatorio) {
            const duracaoNitro = Math.random() * 1000 + 1000;
            return {
              ...quadrado,
              nitroAtivo: quadrado.ativo,
              tempoNitro: duracaoNitro,
            };
          }
          return quadrado;
        })
      );
    };

    const moverQuadrados = () => {
      setQuadrados((prevQuadrados) => {
        const distanciasRestantes = prevQuadrados.map((quadrado) => {
          const distanciaRestante = larguraTela - quadrado.posX;
          const tempoRestante = distanciaRestante / quadrado.velocidade;
          return tempoRestante;
        });

        // Inverter a lógica: quadrado que leva menos tempo tem mais chance de ganhar
        const totalTempo = distanciasRestantes.reduce(
          (acc, tempo) => acc + tempo,
          0
        );

        // Calcular a probabilidade de cada quadrado com base no tempo necessário para percorrer a distância
        const novasProbabilidades = distanciasRestantes.map(
          (tempo) => (totalTempo - tempo) / totalTempo
        );

        // Garantir que a soma das probabilidades seja 100% (ou 1)
        const somaProbabilidades = novasProbabilidades.reduce(
          (acc, prob) => acc + prob,
          0
        );
        const probabilidadesNormalizadas = novasProbabilidades.map(
          (prob) => prob / somaProbabilidades
        );

        setProbabilidades(probabilidadesNormalizadas);

        return prevQuadrados.map((quadrado) => {
          if (!quadrado.ativo) return quadrado;

          let novaVelocidade = quadrado.velocidade;
          if (quadrado.nitroAtivo) {
            novaVelocidade *= 2;
          }

          let novaPosX = quadrado.posX + novaVelocidade;

          if (novaPosX > larguraTela - LARGURA_QUADRADOS) {
            novaPosX = larguraTela - LARGURA_QUADRADOS;
            setStart(false);
            return {
              ...quadrado,
              posX: novaPosX,
              ativo: false,
              nitroAtivo: false,
              tempoNitro: 0,
            };
          }

          if (quadrado.nitroAtivo) {
            const tempoRestante = quadrado.tempoNitro - DELAY_MS;
            if (tempoRestante <= 0) {
              return { ...quadrado, nitroAtivo: false, tempoNitro: 0 };
            }
            return { ...quadrado, tempoNitro: tempoRestante, posX: novaPosX };
          }

          return { ...quadrado, posX: novaPosX };
        });
      });
    };

    const intervaloNitro = setInterval(ativarNitro, Math.random() * 5000 + 5000);
    const intervaloMovimento = setInterval(moverQuadrados, DELAY_MS);

    return () => {
      clearInterval(intervaloMovimento);
      clearInterval(intervaloNitro);
    };
  }, [start]);

  // Evitar renderizar antes dos quadrados estarem inicializados
  if (!quadrados.length) return null;

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
};

export default Horse;

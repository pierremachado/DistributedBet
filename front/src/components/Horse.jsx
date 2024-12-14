import React, { useEffect, useState } from "react";

const Horse = ({ start, setStart, probabilidades, setProbabilidades }) => {
  const [quadrados, setQuadrados] = useState([]);
  const [intervalo, setIntervalo] = useState(Math.random() * 5000 + 5000);

  useEffect(() => {
    if (!start) return;
    const larguraTela = window.innerWidth;
    const cores = ["#3498db", "#059669", "#b45309", "#3b0764", "#facc15"];
    const inicializarQuadrados = () => {
      const novosQuadrados = Array.from({ length: 5 }, (_, index) => ({
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

    const calcularProbabilidades = () => {
      const distanciasRestantes = quadrados.map((quadrado) => {
        const distanciaRestante = larguraTela - quadrado.posX;
        const tempoRestante = distanciaRestante / quadrado.velocidade;
        return tempoRestante;
      });

      const totalTempo = distanciasRestantes.reduce(
        (acc, tempo) => acc + tempo,
        0
      );

      const novasProbabilidades = distanciasRestantes.map(
        (tempo) => tempo / totalTempo
      );
      setProbabilidades(novasProbabilidades);
    };

    const ativarNitro = () => {
      const quadradoAleatorio = Math.floor(Math.random() * 5);
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
      setIntervalo(Math.random() * 5000 + 5000);
    };

    const moverQuadrados = () => {
      setQuadrados((prevQuadrados) =>
        prevQuadrados.map((quadrado) => {
          if (!quadrado.ativo) return quadrado;

          let novaVelocidade = quadrado.velocidade;
          if (quadrado.nitroAtivo) {
            novaVelocidade *= 2;
          }

          let novaPosX = quadrado.posX + novaVelocidade;

          if (novaPosX > larguraTela - 50) {
            novaPosX = larguraTela - 50;
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
            const tempoRestante = quadrado.tempoNitro - 16;
            if (tempoRestante <= 0) {
              return { ...quadrado, nitroAtivo: false, tempoNitro: 0 };
            }
            return { ...quadrado, tempoNitro: tempoRestante, posX: novaPosX };
          }

          return { ...quadrado, posX: novaPosX };
        })
      );
    };

    const intervaloNitro = setInterval(ativarNitro, intervalo);
    const intervaloMovimento = setInterval(moverQuadrados, 32);
    const intervaloProb = setInterval(calcularProbabilidades, 32);

    return () => {
      clearInterval(intervaloMovimento);
      clearInterval(intervaloNitro);
      clearInterval(intervaloProb);
    };
  }, [start]);

  return (
    <div style={styles.container}>
      {quadrados.map((quadrado) => (
        <div
          key={quadrado.id}
          style={{
            ...styles.quadrado,
            top: `${50 + quadrado.id * 60}px`,
            transform: `translateX(${quadrado.posX}px)`,
            opacity: quadrado.ativo ? 1 : 0.5,
            backgroundColor: quadrado.nitroAtivo ? "#e74c3c" : quadrado.cor,
          }}
        />
      ))}
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    height: "70vh",
    backgroundColor: "green",
    overflow: "hidden",
  },
  quadrado: {
    width: "50px",
    height: "50px",
    position: "absolute",
  },
};

export default Horse;

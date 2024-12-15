import { useState } from "react";
import SquareRace from "../components/SquareRace";
function Event() {
  const [odds, setOdds] = useState<number[]>([]);
  const [quadrados, setQuadrados] = useState<Quadrado[]>([]);
  const [closedForBets, setClosedForBets] = useState<boolean>(false)
  const [campeao, setCampeao] = useState<Quadrado | undefined>()
  const [openModal, setOpenModal] = useState(false)
  const [selectedOdd, setSelectedOdd] = useState(0)
  const [selectedSquare, seSelectedSquare] = useState<Quadrado | undefined>()
  const [betMade, setBetMade] = useState<boolean>(false)

  function handleClick(value: number, q: Quadrado) {
    setOpenModal(true)
    setSelectedOdd(value)
    seSelectedSquare(q)
  }

  function sendBet(value: number, q: Quadrado) {
    setOpenModal(false)
    setBetMade(true)
    console.log(value, q)
  }

  return (
    <>
      {openModal && (
        <div className="modal">
          <h4>Odd: {selectedOdd}</h4>
          <h4>Quadrado número: {selectedSquare?.id}</h4>
          <div style={{ width: "50px", aspectRatio: 1, backgroundColor: selectedSquare?.cor }}></div>
          <h4>Valor da aposta:</h4>
          <input type="number" />
          <button onClick={() => sendBet(selectedOdd, selectedSquare!)} style={{ backgroundColor: "green" }}>APOSTAR</button>
        </div>
      )}
      <SquareRace
        setOdds={setOdds}
        quadrados={quadrados}
        setQuadrados={setQuadrados}
        setIsClosedForBets={setClosedForBets}
        setCampeao={setCampeao}
      />
      {odds.length > 0 && (
        <ul>
          {odds.map((odd, index) => (
            <li key={index}>
              Quadrado {index + 1}: Odd: {odd}
            </li>
          ))}
        </ul>
      )}
      {quadrados.length > 0 &&
        quadrados.map((q, i) => {
          const value = odds[i];
          return (
            <button onClick={() => handleClick(value, q)} disabled={closedForBets || betMade} style={{ backgroundColor: q.cor }}>
              {q.id} : {odds[i]}
            </button>
          )
        })}
      {betMade && <>
        <h1>SUA APOSTA</h1>
        <h4>Odd: {selectedOdd}</h4>
        <h4>Quadrado número: {selectedSquare?.id}</h4>
        <div style={{ width: "50px", aspectRatio: 1, backgroundColor: selectedSquare?.cor }}></div>
      </>}
      {campeao && <h1>CAMPEÃO: {campeao.id + 1}° QUADRADO</h1>}
    </>
  );
}

export default Event;

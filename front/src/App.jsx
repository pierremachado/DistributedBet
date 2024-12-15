import { useState } from "react";
import "./App.css";
import SquareRace from "./components/SquareRace";
function App() {
  const [odds, setOdds] = useState([]);
  const [quadrados, setQuadrados] = useState([]);

  return (
    <>
      <SquareRace
        setOdds={setOdds}
        quadrados={quadrados}
        setQuadrados={setQuadrados}
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
        quadrados.map((q, i) => (
          <button style={{ backgroundColor: q.cor }}>
            {q.id} : {odds[i]}
          </button>
        ))}
      <h4>Valor da aposta:</h4>
      <input type="number" />
      <button style={{ backgroundColor: "green" }}>APOSTAR</button>
    </>
  );
}

export default App;

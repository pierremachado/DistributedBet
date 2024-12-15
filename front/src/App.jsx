import { useState } from "react";
import "./App.css";
import SquareRace from "./components/SquareRace"
function App() {
  const [start, setStart] = useState(false);
  const [probabilidades, setProbabilidades] = useState([]);

  return (
    <>
      <button onClick={() => setStart(true)}>iniciar</button>
      <SquareRace
        setProbabilidades={setProbabilidades}
      />
      {probabilidades.length > 0 && (
        <ul>
          {probabilidades.map((probabilidade, index) => (
            <li key={index}>
              Quadrado {index + 1}: {Math.round(probabilidade * 100)}% de chance
              de ganhar
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default App;

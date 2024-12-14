import { useState } from "react";
import "./App.css";
import Horse from "./components/Horse";
function App() {
  const [start, setStart] = useState(false);
  const [probabilidades, setProbabilidades] = useState([]);


  const styles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "green",
  };
  // console.log(probabilidades)

  return (
    <>
      <button onClick={() => setStart(true)}>iniciar</button>
      <Horse
        start={start}
        setStart={setStart}
        probabilidades={probabilidades}
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

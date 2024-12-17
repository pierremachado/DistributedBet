import React, { useState } from "react";
import { ethers } from "ethers";
import { ContractService } from "../services/ContractService";

interface Odd {
  prediction: string; // Usar string no input e converter para number ao enviar
  odd: string; // Usar string no input e converter para BigNumber ao enviar
}

const CreateEventForm: React.FC = () => {
  const [eventType, setEventType] = useState<string>("");
  const [eventOdds, setEventOdds] = useState<Odd[]>([{ prediction: "", odd: "" }]);
  const [status, setStatus] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Enviando transação...");

    try {
      // Formatar odds para o formato esperado pelo contrato
      const formattedOdds = eventOdds.map((odd) => ({
        prediction: parseInt(odd.prediction, 10),
        odd: ethers.toBigInt(odd.odd),
      }));

      // Chamar a função do contrato
      const tx = await ContractService.getInstance().getContract().createEvent(eventType, formattedOdds);
      await tx.wait(); // Aguarda a confirmação da transação

      setStatus("Evento criado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao criar evento:", error);
      console.log(error.message)
      setStatus("Erro ao criar evento.");
    }
  };

  const addOdd = () => {
    setEventOdds((prevOdds) => [...prevOdds, { prediction: "", odd: "" }]);
  };

  const updateOdd = (index: number, field: keyof Odd, value: string) => {
    setEventOdds((prevOdds) =>
      prevOdds.map((odd, i) =>
        i === index ? { ...odd, [field]: value } : odd
      )
    );
  };

  return (
    <div>
      <h2>Criar Evento</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="eventType">Tipo de Evento:</label>
          <input
            id="eventType"
            type="text"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            required
          />
        </div>
        <div>
          <h3>Odds</h3>
          {eventOdds.map((odd, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <label htmlFor={`prediction-${index}`}>Prediction:</label>
              <input
                id={`prediction-${index}`}
                type="number"
                value={odd.prediction}
                onChange={(e) =>
                  updateOdd(index, "prediction", e.target.value)
                }
                required
              />
              <label htmlFor={`odd-${index}`}>Odd:</label>
              <input
                id={`odd-${index}`}
                type="number"
                step="0.01"
                value={odd.odd}
                onChange={(e) => updateOdd(index, "odd", e.target.value)}
                required
              />
            </div>
          ))}
          <button type="button" onClick={addOdd}>
            Adicionar Odd
          </button>
        </div>
        <button type="submit">Criar Evento</button>
      </form>
      <p>{status}</p>
    </div>
  );
};

export default CreateEventForm;

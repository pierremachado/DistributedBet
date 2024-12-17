import { useEffect, useState } from "react"
import { ContractService } from "../services/ContractService";
import CreateEventForm from "../components/Form"
import { BetContract } from "../../../typechain-types/BetContract";
import "./Home.css"
import { useNavigate } from "react-router-dom";
const Home = () => {
    const nav = useNavigate()
    const [wallet, setWallet] = useState(0)
    const [events, setEvents] = useState<BetContract.EventStructOutput[]>([])
    useEffect(() => {
        const fetchEvents = async () => {
            const service = ContractService.getInstance()
            const contract = service.getContract()
            try {
                if (contract) {
                    const tx2 = await contract.getBalance();
                    console.log(tx2)
                    setWallet(wallet)

                    const tx = await contract.getEvents()
                    console.log(tx[0])
                    setEvents(tx)
                }
            } catch (error) {

                console.error();

            }
        };

        fetchEvents();
    }
        , []
    )

    return (
        <>
            {wallet}
            <CreateEventForm />
            <h1>Eventos: </h1>
            {events.map(e => {
                if (!e[3])
                    return (
                    <div className="event" onClick={() => nav("/event")}>
                        <p>Nome: {e[1]}</p>
                        <p>Evento em aberto!</p>
                    </div>
                )
            })}
        </>
    )
}

export default Home
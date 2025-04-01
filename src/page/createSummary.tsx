import { useNavigate } from "react-router-dom"
import NavBar from "../components/NavBar"
import ProgressBar from "../components/progressBar"
import '../styles/createSummary.css'
import check from '/images/check.png'
import { useForm } from "../providers/FormProvider"
import { useEffect } from "react"

const CreateSummary = () => {

    const navigate = useNavigate()
    const { status, setStatus } = useForm()

    useEffect(() => {
        if(!status[1]) {
            navigate('/home')
        }
        setStatus([false, false, false])
    }, [])

    return (
        <>
            <NavBar />
            <div className="createSummaryContainer">
                <div>
                    <img src={check} />
                    <h1>Utworzono nowe wydarzenie!</h1>
                    <button onClick={() => navigate('/home')}>Strona główna</button>
                </div>
            </div>
            <ProgressBar />
        </>

    )
}

export default CreateSummary
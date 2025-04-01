import { useState, useRef, useEffect } from "react"
import NavBar from "../components/NavBar"
import '../styles/createLabs.css'
import ProgressBar from "../components/progressBar"
import rightArrow from '/images/right.png'
import LabTable from "../components/labTable"
import { useNavigate } from "react-router-dom"
import { useForm } from "../providers/FormProvider"
import { useCreateLab } from "../api/lab/lab"
import { useAnnouncers } from "../api/user/user"

const CreateLabs = () => {

    const [data, setData] = useState<string[][]>([])
    const navigate = useNavigate()
    const { eventID, status, setStatus } = useForm()
    const { mutate: createLabs } = useCreateLab()
    const { data: users } = useAnnouncers()

    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Symulacja kliknięcia na input, co otwiera dialog wyboru pliku
        }
    }

    const handleFileUpload = (event: any) => {
        const file = event.target.files[0]
        const reader = new FileReader()

        reader.onload = (e: ProgressEvent<FileReader>) => {
            const text = e?.target?.result as string
            const rows = text?.split('\n').map(row => row.split(','))
            const newData = data.concat(rows)
            setData(newData)
        }

        reader.readAsText(file)
    }

    const handleCreateLabs = () => {
        if (data.length > 0) { // > 0
            const ConvertedData = data
                .filter((lab) => lab[0] !== undefined)
                .map((lab) => ({
                    ID_wydarzenia: eventID,
                    nazwa: lab[0],
                    rodzaj: lab[1],
                    numer_sali: lab[2],
                    max_liczba: Number(lab[3]),
                    czas: Number(lab[4]),
                    ID_prowadzacego: users?.find((user) => user.full_name === lab[5])?.id,
                    opis: lab[6]
                }))
            //console.log(ConvertedData)

            createLabs(ConvertedData)
            setStatus([true, true, false])
            navigate('/create-summary')
        }
    }

    useEffect(() => {
        if (!status[0]) {
            navigate('/home')
        }
        //console.log("create-labs", status, eventID)
    }, [])

    return (
        <>
            <NavBar />
            <div className="createLabsContainer">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                />
                <button onClick={handleButtonClick}>Dodaj z pliku</button>
                <LabTable
                    data={data}
                    setData={setData}
                    create={true}
                />
            </div>
            <button className="arrowButton" onClick={handleCreateLabs}>
                <img src={rightArrow} />
            </button>
            <ProgressBar />
        </>
    )
}

export default CreateLabs

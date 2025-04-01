import NavBar from "../components/NavBar"
import ProgressBar from "../components/progressBar"
import '../styles/createEvent.css'
import rightArrow from '/images/right.png'
import { useState } from 'react'
import { useCreateEvent } from "../api/event/event"

const CreateEvent = () => {

    const [nazwa, setNazwa] = useState<string>('')
    const [data, setData] = useState<string>('')
    const [godzina, setGodzina] = useState<string>('')
    const [miejsce, setMiejsce] = useState<string>('')
    const [opis, setOpis] = useState<string>('')
    const [harmonogram, setHarmonogram] = useState<string>('')
    const [extrainfo, setExtrainfo] = useState<string>('')
    const { mutate: createEvent } = useCreateEvent()

    const handleCreateEvent = () => {
        console.log("Formularz został wysłany!")
        createEvent({
            title: nazwa,
            date: data,
            time_start: godzina,
            place: miejsce,
            description: opis,
            schedule: harmonogram,
            extra_info: extrainfo,
        })
    }

    return (
        <>
            <NavBar />
            <div className="createContainer">
                <form className="createForm" id="eventForm" onSubmit={handleCreateEvent}>
                    <div className="left">
                        <div>
                            <label htmlFor="nazwa">Nazwa wydarzenia</label>
                            <input
                                id="nazwa"
                                value={nazwa}
                                onChange={(e) => setNazwa(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="data">Data</label>
                            <input
                                id="data"
                                type="date"
                                value={data}
                                onChange={(e) => setData(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="godzina">Godzina</label>
                            <input
                                id="godzina"
                                type="time"
                                value={godzina}
                                onChange={(e) => setGodzina(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="miejsce">Miejsce</label>
                            <input
                                id="miejsce"
                                value={miejsce}
                                onChange={(e) => setMiejsce(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="middle">
                        <div>
                            <label htmlFor="opis">Opis</label>
                            <textarea
                                id="opis"
                                value={opis}
                                onChange={(e) => setOpis(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="harmonogram">Harmonogram</label>
                            <textarea
                                id="harmonogram"
                                value={harmonogram}
                                onChange={(e) => setHarmonogram(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="right">
                        <div>
                            <label htmlFor="extrainfo">Dodatkowe informacje</label>
                            <textarea
                                id="extrainfo"
                                value={extrainfo}
                                onChange={(e) => setExtrainfo(e.target.value)}
                            />
                        </div>
                    </div>
                </form>
            </div>
            {/* <button className="arrowButton" form='eventForm' type='submit'> */}
            <button className="arrowButton" onClick={() => handleCreateEvent()}>
                <img src={rightArrow} />
            </button>
            <ProgressBar />
        </>
    )
}

export default CreateEvent
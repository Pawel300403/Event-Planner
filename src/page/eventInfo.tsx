import { useNavigate, useParams } from "react-router-dom"
import NavBar from "../components/NavBar"
import "../styles/eventInfo.css"
import LabTable from "../components/labTable"
import { useEffect, useState } from "react"
import { useDeleteEvent, useEventByID, useUpdateEvent } from "../api/event/event"
import { useLabByEvent } from "../api/lab/lab"

const EventInfo = () => {

    const { eventID } = useParams()
    const { data: event } = useEventByID(Number(eventID))
    const { data: labs } = useLabByEvent(Number(eventID))
    const { mutate: updateEvent } = useUpdateEvent()
    const navigate = useNavigate()
    const { mutate: deleteEvent } = useDeleteEvent()

    const [data, setData] = useState<string[][]>([])
    const [eventInfo, setEventInfo] = useState({
        title: event?.title,
        date: event?.date,
        time_start: event?.time_start,
        place: event?.place,
        description: event?.description,
        schedule: event?.schedule,
        extra_info: event?.extra_info
    })

    useEffect(() => {
        let Tab: string[][] = []
        labs?.map((lab) => {
            const Row: string[] = [lab?.nazwa, lab?.rodzaj, lab?.numer_sali, lab?.max_liczba.toString(), lab?.czas.toString(), lab?.profiles?.full_name || '', lab?.opis || '', lab.ID.toString(), eventID?.toString() || '']
            Tab = [...Tab, Row]
        })
        setData(Tab)
    }, [labs])


    return (
        <>
            <NavBar />
            <div className="eventInfoContainer">
                <div>
                    <div className="eventInfo">

                        <span
                            className="edit-title"
                            role="textbox"
                            contentEditable
                            suppressContentEditableWarning
                            onInput={(e) => setEventInfo({ ...eventInfo, title: e.currentTarget.innerText })}
                            onBlur={() => updateEvent({ id: eventID, value: { title: eventInfo.title } })}
                        >
                            {event?.title}
                        </span>

                        <div>
                            <label htmlFor='data'>Data</label>
                            <input
                                id='data'
                                type='date'
                                defaultValue={event?.date || ''}
                                onChange={e => setEventInfo({ ...eventInfo, date: e.target.value })}
                                onBlur={() => updateEvent({ id: eventID, value: { date: eventInfo.date } })}
                            />
                        </div>

                        <div>
                            <label htmlFor='godzina'>Godzina</label>
                            <input
                                id='godzina'
                                type='time'
                                defaultValue={event?.time_start || ''}
                                onChange={e => setEventInfo({ ...eventInfo, time_start: e.target.value })}
                                onBlur={() => updateEvent({ id: eventID, value: { time_start: eventInfo.time_start } })}
                            />
                        </div>

                        <div>
                            <label htmlFor='miejsce'>Miejsce</label>
                            <input
                                id='miejsce'
                                defaultValue={event?.place || ''}
                                onChange={e => setEventInfo({ ...eventInfo, place: e.target.value })}
                                onBlur={() => updateEvent({ id: eventID, value: { place: eventInfo.place } })}
                            />
                        </div>

                        <div>
                            <label htmlFor='opis'>Opis</label>
                            <textarea
                                id='opis'
                                defaultValue={event?.description || ''}
                                onChange={e => setEventInfo({ ...eventInfo, description: e.target.value })}
                                onBlur={() => updateEvent({ id: eventID, value: { description: eventInfo.description } })}
                            />
                        </div>

                        <div>
                            <label htmlFor='harmonogram'>Harmonogram</label>
                            <textarea
                                id='harmonogram'
                                defaultValue={event?.schedule || ''}
                                onChange={e => setEventInfo({ ...eventInfo, schedule: e.target.value })}
                                onBlur={() => updateEvent({ id: eventID, value: { schedule: eventInfo.schedule } })}
                            />
                        </div>

                        <div>
                            <label htmlFor='info'>Dodatkowe informacje</label>
                            <textarea
                                id='info'
                                defaultValue={event?.extra_info || ''}
                                onChange={e => setEventInfo({ ...eventInfo, extra_info: e.target.value })}
                                onBlur={() => updateEvent({ id: eventID, value: { extra_info: eventInfo.extra_info } })}
                            />
                        </div>

                    </div>
                    <div className="labInfo">
                        <button className="delete-event" onClick={() => {
                            deleteEvent(Number(eventID))
                            navigate('/home')
                        }}>Usuń wydarzenie</button>
                        <LabTable data={data} setData={setData} edit={true} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default EventInfo
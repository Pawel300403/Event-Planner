import { useNavigate } from 'react-router-dom'
import '../styles/event.css'
import { useAuth } from '../providers/AuthProvider';

type EventType = {
    id: number;
    title: string;
    date: string; // ISO format: YYYY-MM-DD
    description: string;
    extra_info: string; // Możesz zamienić na typ `string[]`, jeśli chcesz przetwarzać informacje jako tablicę wierszy
    place: string;
    schedule: string; // Możesz zamienić na typ `string[]`, jeśli chcesz przetwarzać harmonogram jako tablicę wierszy
    time_start: string; // Format: HH:mm
    time_end: string;   // Format: HH:mm
}

const Month = [
    'Stycznia',
    'Lutego',
    'Marca',
    'Kwietnia',
    'Maja',
    'Czerwca',
    'Lipca',
    'Sierpnia',
    'Września',
    'Października',
    'Listopada',
    'Grudnia'
]

const Day = [
    'Poniedziałek',
    'Wtorek',
    'Środa',
    'Czwartek',
    'Piątek',
    'Sobota',
    'Niedziela'
]

const Event = ({ prop }: { prop: EventType }) => {

    const navigate = useNavigate()
    const { profile } = useAuth()

    const date = new Date(prop.date)
    const day = date.getDate()
    const dayName = Day[date.getDay()]
    const month = Month[date.getMonth()]
    const year = date.getFullYear()

    return (
        <div
            className='eventContainer'
            onClick={() => {
                if (profile === 'Admin') {
                    navigate(`/event/${prop.id}`)
                } else {
                    navigate(`/tracks/${prop.id}`)
                }
            }}
        >
            <div id='box'>
                <div id='leftBox'>
                    <p className='eventFont' id="d">{day}</p>
                    <p className='eventFont' id='msc'>{month}</p>
                </div>
                <div id='rightBox'>
                    <p className='eventFont' id='dname'>{dayName}</p>
                    {/* <p className='eventFont' id='time'>{prop.time_start} - {prop.time_end}</p> */}
                    <p className='eventFont' id='time'>{prop.time_start}</p>
                </div>
            </div>
            <div id='boxTitle' >
                <p className='eventFont' id='title'>{prop.title} <br></br> {year}</p>
            </div>
        </div>
    )
}

export default Event
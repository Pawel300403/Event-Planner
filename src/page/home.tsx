import NavBar from "../components/NavBar"
import Event from '../components/event'
import '../styles/home.css'
import add from '/images/add.png'
import { useNavigate } from 'react-router-dom'
import { useEvent } from "../api/event/event"
import { useAuth } from "../providers/AuthProvider"

const Home = () => {

    const navigate = useNavigate()
    const { data: events } = useEvent()
    const { profile } = useAuth()

    return (
        <>
            <NavBar />
            <div className="home-container">
                <div className="eventList">
                    {events && events
                        .map((item, index) => {
                            return (
                                <Event prop={item} key={index} />
                            )
                        })}
                    {profile === 'Admin' &&
                        <div className="addEvent">
                            <img src={add} onClick={() => navigate('/create')} />
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default Home
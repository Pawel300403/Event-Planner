import NavBar from '../components/NavBar'
import '../styles/tracks.css'
import edit from '/images/pen.png'
import bin from '/images/delete.png'
import { useDeleteTrack, useTrack } from '../api/track/track'
import { useUserById } from '../api/user/user'
import { useNavigate, useParams } from 'react-router-dom'

const Tracks = () => {

    const navigate = useNavigate()
    const { eventID } = useParams()

    const { data: tracks} = useTrack(Number(eventID))

    // if (isLoading && !tracks)
    //     return <></>

    return (
        <>
            <NavBar />
            <div className='tracksContainer'>
                {Array.isArray(tracks) && tracks?.map((track, index) => {
                    return <Track trackProp={track} key={index} />
                })}

            </div>
            <button className='addTrackButton' onClick={() => navigate(`/create-track/${eventID}`)}>+</button>
        </>
    )
}

export default Tracks

type TrackType = {
    czas: number
    id_lab: number
    kolejnosc: number
    nazwa: string
    opoznienie: string
    poczatek: string
    rodzaj: string
}

type TracksType = {
    guide: string,
    id: number,
    tracks: TrackType[]
}

const Rodzaj = {
    "informatyka": 't3',
    "elektronika": 't1',
    "biotechnologia": 't2',
    "automatyka": 't4'
} as { [key: string]: string }

const Track = ({ trackProp }: { trackProp: TracksType }) => {

    const { data: user } = useUserById(trackProp.guide)
    const { mutate: deleteTrack } = useDeleteTrack()
    const navigate = useNavigate()
    const { eventID } = useParams()

    const endTime = () => {
        const lab = trackProp.tracks[trackProp.tracks.length - 1]
        const startTime = lab.poczatek.split(':').map((num) => Number(num))
        const time = lab.czas
        let h = startTime[0]
        let m = startTime[1]
        m = m + time
        h = h + Math.floor(m / 60)
        m = m % 60
        return h + ':' + m.toString().padStart(2, '0')
    }

    return (
        <div className='trackWidget'>
            <div className='trackBar'>
                <div>
                    <a>{trackProp.tracks[0].poczatek} - {endTime()}</a>
                    <a>{user?.full_name}</a>
                </div>
                <div>
                    <button onClick={() => navigate(`/create-track/${eventID}/edit/${trackProp.id}`)}><img src={edit} /></button>
                    <button onClick={() => deleteTrack(trackProp.id)}><img src={bin} /></button>
                </div>
            </div>
            <div className='trackList'>
                {trackProp.tracks.map((lab, index) => (
                    <div id={Rodzaj[lab.rodzaj.toLowerCase()]} key={index}>{lab.nazwa}</div>
                ))}
            </div>
        </div>
    )
}
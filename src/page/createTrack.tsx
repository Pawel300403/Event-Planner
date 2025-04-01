import { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import '../styles/createTrack.css'
import add from '/images/add.png'
import { useAddLab, useDeleteTrackDetails, useLabs } from '../api/lab/lab'
import { useGuides } from '../api/user/user'
import { useCreateTrack, useTrackByID, useUpdateTrack } from '../api/track/track'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { sendPushNotification } from '../api/notification'

type Schedule = {
    start: string,
    end: string
}

type Track = {
    id: string,
    name: string,
    time: string,
    type: string,
    schedule: Schedule[],
    people: number
}

type Guide = {
    id: string,
    name: string,
    TimeTable: { [key: string]: boolean }
}

const Rodzaj = {
    "informatyka": 't3',
    "elektronika": 't1',
    "biotechnologia": 't2',
    "automatyka": 't4'
} as { [key: string]: string }

const CreateTrack = () => {

    const { eventID: eventID, trackID: trackID } = useParams()
    const { data: LabTable } = useLabs(Number(eventID), Number(trackID))
    const { data: guides } = useGuides()
    const { mutateAsync: createTrack } = useCreateTrack()
    const { mutateAsync: addLab } = useAddLab()
    const { mutate: updateTrack } = useUpdateTrack()
    const { mutateAsync: deleteTrackDetails } = useDeleteTrackDetails()
    const { data: editTrack } = useTrackByID(Number(trackID) || 0)
    //useEffect(() => { console.log(editTrack) }, [editTrack])

    const [trackList, setTrackList] = useState<string[]>([])
    const [trackLen, setTrackLen] = useState<number>(3)
    const [timeList, setTimeList] = useState<string[]>([])
    const [guide, setGuide] = useState<string>('')
    const [guideList, setGuideList] = useState<Guide[]>([])
    const [enableGuides, setEnableGuides] = useState<Guide[]>([])
    const [disabled, setDisabled] = useState(true)
    const [selectedLab, setSelectedLab] = useState<Schedule[]>([])
    const [visibleInfo, setVisibleInfo] = useState(false)

    useEffect(() => {
        if (editTrack && LabTable) {
            const list: string[] = []
            const time: string[] = []
            editTrack.labs?.map((lab, index) => {
                const res = LabTable?.filter((l) => l.id === lab.ID_lab)[0]
                list[index] = JSON.stringify(res)
                time[index] = lab.godzina_rozpoczecia
            })
            setGuide(editTrack.przewodnik)
            setTrackList(list)
            setTimeList(time)
        }
    }, [editTrack, LabTable])

    useEffect(() => {
        setEnableGuides(guideList.filter((g) => testRange(g.TimeTable, g.id, timeList[0], timeList[timeList.length - 1])))
        if (
            trackList.length === timeList.length &&
            !trackList.includes('') &&
            !timeList.includes('') &&
            isSorted(timeList) &&
            guide !== ''
        ) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [trackList, timeList, guide, guides])

    useEffect(() => {
        if (guides) {
            const Table = makeTimeTable(8, 16)
            const list = guides.map((guide) => ({
                id: guide.id,
                name: guide.name,
                TimeTable: setEnableTime(Table, guide.list)
            })) as Guide[]
            setGuideList(list)
            setEnableGuides(list)
        }

    }, [guides])

    const makeTimeTable = (start: number, end: number) => {
        let Dics: { [key: string]: boolean } = {}
        const timeStart = start * 60
        const timeEnd = end * 60

        for (let i = timeStart; i <= timeEnd; i++) {
            const time = String(Math.floor(i / 60)) + ':' + String(i % 60).padStart(2, '0')
            Dics[time] = true
        }
        return Dics
    }

    const setEnableTime = (Dics: { [key: string]: boolean }, List: { poczatek: string, koniec: string }[]) => {
        const dics = { ...Dics }
        List && List.map((item) => {
            for (const time in dics) {
                // if (editTrack && time >= editTrack.poczatek && time <= editTrack.koniec) {
                //     continue
                // }
                if (time >= item.poczatek && time <= item.koniec) {
                    dics[time] = false
                }
            }
        })
        return dics
    }

    function testRange(dict: { [key: string]: boolean }, guideId: string, startKey: string, endKey: string) {
        // console.log('poczatek edytowanej trasy', editTrack?.poczatek,
        //     'poczatek trasy', startKey,
        //     'koniec edytowanej trasy', editTrack?.koniec,
        //     'koniec trasy', endKey
        // )

        if (editTrack && guideId === editTrack.przewodnik && editTrack.poczatek <= startKey && editTrack.koniec >= endKey) {
            return true
        }

        const entries = Object.entries(dict);

        // Filtruj pary klucz-wartość w podanym zakresie
        const filteredEntries = entries.filter(([key]) => {
            return key >= startKey && key <= endKey;
        });

        // Sprawdź, czy choć jedna wartość w zakresie jest `false`
        const hasFalseValue = filteredEntries.some(([_, value]) => value === false);

        if (hasFalseValue) {
            return false;
        }

        return true
    }

    const isSorted = (arr: string[]) => {
        return arr.every((value, index) => index === 0 || arr[index - 1] <= value)
    }

    const timeValidate = (time: string, labTime: string, start: string, end: string): Boolean => {

        const s1 = time.split(':').reduce((acc, el, i) => acc + parseInt(el, 10) * (i === 0 ? 60 : 1), 0)
        const e1 = s1 + parseInt(labTime, 10)
        const s2 = start.split(':').reduce((acc, el, i) => acc + parseInt(el, 10) * (i === 0 ? 60 : 1), 0)
        const e2 = end.split(':').reduce((acc, el, i) => acc + parseInt(el, 10) * (i === 0 ? 60 : 1), 0)

        return (s1 > s2 && s1 < e2) || (e1 > s2 && e1 < e2)
    }

    const endTime = (start: string, time: number): string => {
        const startTime = start.split(':').map((num) => Number(num))
        let h = startTime[0]
        let m = startTime[1]
        m = m + time
        h = h + Math.floor(m / 60)
        m = m % 60
        return h + ':' + m.toString().padStart(2, '0')
    }

    const trackTime = (firstLab: string, lastLab: string, time: string): number => {
        const fl = firstLab.split(':').reduce((acc, el, i) => acc + parseInt(el, 10) * (i === 0 ? 60 : 1), 0)
        const lb = lastLab.split(':').reduce((acc, el, i) => acc + parseInt(el, 10) * (i === 0 ? 60 : 1), 0)
        return lb + Number(time) - fl
    }

    const limitPeople = (): number => {
        const track = trackList.map((t) => JSON.parse(t)) as Track[]
        track.sort((a, b) => a.people - b.people)
        return track[0].people
    }

    function updateTimeList(time: string, index: number) {
        const lab: Track = trackList[index] && JSON.parse(trackList[index])

        // dodanie czasu trwania laboratorium
        const prevLab: Track = trackList[index - 1] && JSON.parse(trackList[index - 1])
        const prevEndLab = prevLab ? endTime(timeList[index - 1], Number(prevLab.time)).split(':').reduce((acc, el, i) => acc + parseInt(el, 10) * (i === 0 ? 60 : 1), 0) : 0
        const test = time.split(':').reduce((acc, el, i) => acc + parseInt(el, 10) * (i === 0 ? 60 : 1), 0)

        if (!lab?.schedule.find((item) => timeValidate(time, lab.time, item.start, item.end)) && test > prevEndLab) {
            const updateData = [...timeList]
            updateData[index] = time
            setTimeList(updateData)
        }
    }

    function removeTrack(removeIndex: number) {
        if (trackLen > 1) {
            const updateData = trackList.filter((_, index) => index != removeIndex)
            const updateTime = timeList.filter((_, index) => index != removeIndex)
            setTimeList(updateTime)
            setTrackList(updateData)
            setTrackLen(trackLen - 1)
        }
    }

    function handleOnDrag(e: React.DragEvent, trackType: string) {
        e.dataTransfer.setData('trackType', trackType)
    }

    function handleOnDrop(e: React.DragEvent, index: number) {
        const trackType = e.dataTransfer.getData('trackType') as string
        console.log('track', trackType)
        const updateData = [...trackList]
        if (updateData[index] !== trackType) {
            const newTimeList = [...timeList]
            newTimeList[index] = ''
            setTimeList(newTimeList)
        }
        updateData[index] = trackType
        setTrackList(updateData)
    }

    function handleDragOver(e: React.DragEvent) {
        e.preventDefault()
    }

    async function handleCreateTrack() {
        //dane do track
        const trackDB = {
            ID_przewodnika: guide,
            ilosc_osob: limitPeople(),
            poczatek: timeList[0],
            czas: trackTime(timeList[0], timeList[timeList.length - 1], JSON.parse(trackList[trackList.length - 1])?.time)
        }

        const newTrack = await createTrack(trackDB)

        //dane do lab_list
        const lab_listDB = trackList.map((track, index) => {
            const t = JSON.parse(track) as Track
            return ({
                ID_trasy: newTrack.ID,
                ID_lab: Number(t.id),
                godzina_rozpoczecia: timeList[index],
                kolejnosc: index + 1
            })
        })

        await addLab(lab_listDB)

        showInfo()

        const { data, error } = await supabase
            .from("profiles")
            .select("expo_push_token")
            .eq("id", guide)
            .single();

        if (error) {
            console.error("Błąd pobierania tokena:", error);
            return;
        }

        if (!data?.expo_push_token) {
            console.warn("Brak tokena Expo dla użytkownika!");
            return;
        }

        await sendPushNotification(data.expo_push_token, newTrack.ID)

        //console.log(trackDB, lab_listDB)
    }

    function handleEditTrack() {
        const trackDB = {
            ID_przewodnika: guide,
            ilosc_osob: limitPeople(),
            poczatek: timeList[0],
            czas: trackTime(timeList[0], timeList[timeList.length - 1], JSON.parse(trackList[trackList.length - 1])?.time)
        }
        updateTrack({ id: Number(trackID), data: trackDB })

        const lab_listDB = trackList.map((track, index) => {
            const t = JSON.parse(track) as Track
            return ({
                ID_trasy: Number(trackID),
                ID_lab: Number(t.id),
                godzina_rozpoczecia: timeList[index],
                kolejnosc: index + 1
            })
        })
        deleteTrackDetails(Number(trackID))
            .then(async () => {
                await addLab(lab_listDB)
            })
    }

    const showInfo = () => {
        setVisibleInfo(true);
        setTimeout(() => {
          setVisibleInfo(false);
        }, 3000);
      };

    return (
        <>
            <NavBar />
            <div className='createTrackContainer'>
                {
                    visibleInfo &&
                    <div className='blur-bg'>
                        <div className='info-widget'>
                            Dodano nową trasę!
                        </div>
                    </div>
                }
                <div>
                    <div className='left'>

                        {LabTable?.map((track, index) => {
                            return (
                                <div
                                    key={index}
                                    id={Rodzaj[track.type.toLowerCase()]}
                                    draggable
                                    onDragStart={(e) => handleOnDrag(e, JSON.stringify(track))}
                                    onClick={() => setSelectedLab(track.schedule)}
                                >
                                    {track.name}
                                </div>
                            )
                        })}
                    </div>
                    <div className='right'>
                        <div className='right-container'>
                            <h3>Zajęte terminy</h3>
                            <div>
                                {selectedLab && selectedLab.map((lab, index) => {
                                    return (
                                        <p key={index}>{lab.start} - {lab.end}</p>
                                    )
                                })}
                            </div>
                        </div>

                        {/* funkcja anonimowa */}
                        {(() => {
                            const dropArea = []
                            for (let index = 0; index < trackLen; index++) {
                                dropArea.push(
                                    <div key={index}>
                                        <input
                                            type='time'
                                            value={timeList[index] || ''}
                                            onChange={(e) => updateTimeList(e.target.value, index)}
                                        />
                                        <div className='dropArea' onDrop={(e) => handleOnDrop(e, index)} onDragOver={handleDragOver}>
                                            {trackList[index] &&
                                                <div className='dropedTrack'>
                                                    {JSON.parse(trackList[index])?.name}
                                                </div>
                                            }
                                        </div>
                                        <button onClick={() => removeTrack(index)}>X</button>
                                    </div>
                                )
                            }
                            return dropArea
                        })()}

                        <button className='addFieldBtn' onClick={() => setTrackLen(trackLen + 1)}>
                            <img src={add} />
                        </button>

                        <select
                            value={guide || ''}
                            onChange={(e) => setGuide(e.target.value)}
                        >
                            <option value=''>Wybierz przewodnika</option>
                            {
                                enableGuides && enableGuides.map((user, index) => {
                                    return (
                                        <option key={index} value={user.id}>{user.name}</option>
                                    )
                                })
                            }
                        </select>

                        <button
                            className='createBtn'
                            onClick={
                                trackID
                                    ? () => handleEditTrack()
                                    : () => handleCreateTrack()
                            }
                            disabled={disabled}
                        >
                            {trackID ? 'Edytuj trasę' : 'Dodaj trasę'}
                        </button>

                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateTrack
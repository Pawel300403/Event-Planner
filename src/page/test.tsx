import { useEffect, useState } from "react"
import '../styles/test.css'
import { useTrack } from "../api/track/track"

// const Subject = [
//     { nazwa: "1", długość: 1 },
//     { nazwa: "2", długość: 2 },
//     { nazwa: "3", długość: 3 },
//     { nazwa: "4", długość: 4 },
// ]

// type Schedule = {
//     start: string,
//     end: string
// }

// type Lab = {
//     id: string,
//     name: string,
//     time: string,
//     type: string,
//     schedule: Schedule[],
//     people: number
// }

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

// const Tracks: Lab[] = [
//     {
//         id: "1",
//         name: "Siłownia - Trening Siłowy",
//         time: "15",
//         type: "Siłownia",
//         schedule: [
//             { start: "06:00", end: "07:00" }
//         ],
//         people: 20
//     },
//     {
//         id: "2",
//         name: "Boks",
//         time: "20",
//         type: "Sport Walki",
//         schedule: [
//             { start: "10:00", end: "11:00" }
//         ],
//         people: 15
//     },
//     {
//         id: "3",
//         name: "CrossFit",
//         time: "10",
//         type: "Trening Funkcjonalny",
//         schedule: [
//             { start: "8:00", end: "8:10" },
//             { start: "9:30", end: "9:40" }
//         ],
//         people: 25
//     },
//     {
//         id: "4",
//         name: "Strzelnica",
//         time: "15",
//         type: "Precyzja & Taktyka",
//         schedule: [
//             { start: "20:00", end: "21:00" }
//         ],
//         people: 10
//     }
// ];

const PERIOD = 5
const TIME = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00"
]

export const Test = () => {

    // const [draggedItem, setDraggedItem] = useState<number | null>();
    // const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    // const [Table, setTable] = useState(Array(84).fill({ nazwa: 'empty', długość: 1 }))
    const { data: tracks } = useTrack(1)
    const [Schedule, setSchedule] = useState<any[][]>()

    useEffect(() => {
        if (Array.isArray(tracks)) {
            const mapedTrack = tracks.map((track: TracksType) => {
                let TableLab = Array(84).fill({ nazwa: 'empty', długość: 1 })
                track.tracks.map(lab => {
                    const startIndex = calculateStartIndex(lab.poczatek)
                    const labLength = lab.czas / PERIOD
                    for (let start = startIndex; start < startIndex + labLength; start++) {
                        TableLab[start] = { nazwa: lab.nazwa, długość: labLength }
                    }
                })
                return TableLab
            })
            console.log(mapedTrack)
            setSchedule(mapedTrack)
        }
    }, [tracks])

    // Funkcja uruchamiana podczas przeciągania
    // const handleDragStart = (index: number) => {
    //     //console.log(index)
    //     setDraggedItem(index);
    // };

    // Pozwala na upuszczenie w danym miejscu
    // const handleDragOver = (event: React.DragEvent, index: number) => {
    //     event.preventDefault(); // Bez tego drop nie zadziała!
    //     setHoverIndex(index)
    // };

    // const handleDragLeave = () => {
    //     setHoverIndex(null); // Usuwamy podświetlenie po opuszczeniu kratki
    // };

    // const emptyTest = (index: number, length: number): boolean => {
    //     const result = Table
    //         .slice(index, index + length)
    //         .filter(el => el.nazwa !== 'empty')
    //     //console.log('wynik testu', result)
    //     return result.length == 0 ? true : false
    // }

    // const lengthTest = (index: number, length: number): boolean => {
    //     return index + length - 1 < Table.length
    // }

    // const repeatTest = (nazwa: string): boolean => {
    //     return Table.filter(el => el.nazwa === nazwa).length == 0
    // }

    // const isBookedTest = (index: number): boolean => {
    //     const hours = calculateHours(index)
    //     if (draggedItem !== null && draggedItem !== undefined) {
    //         return Tracks[draggedItem].schedule.filter(el => el.start <= hours && el.end >= hours).length > 0
    //     }
    //     return false
    // }

    // Obsługa upuszczenia i aktualizacja kolejności
    // const handleDrop = (index: number) => {
    //     if (draggedItem !== undefined && draggedItem !== null) {
    //         const insertItem = Tracks[draggedItem]
    //         const labLength = Number(insertItem.time) / PERIOD
    //         if (emptyTest(index, labLength) &&
    //             lengthTest(index, labLength) &&
    //             repeatTest(insertItem.name) &&
    //             !isBookedTest(index + labLength - 1)) {
    //             const updatedItems = Table.map((el, nr) => {
    //                 if (nr >= index && nr <= index + labLength - 1) {
    //                     return { nazwa: insertItem.name, długość: labLength }; // Nowy obiekt
    //                 }
    //                 return el; // Pozostaw niezmienione
    //             })
    //             console.log(updatedItems)
    //             setTable(updatedItems)
    //         }
    //     }
    //     setHoverIndex(null)
    // };

    // const deleteSubjcet = (index: number, length: number) => {
    //     const updatedItems = Table.map((el, nr) => {
    //         if (nr >= index && nr <= index + length - 1) {
    //             return { nazwa: 'empty', długość: 1 }; // Tworzymy nowy obiekt, nie modyfikujemy istniejącego
    //         }
    //         return el;
    //     });

    //     //console.log(updatedItems);
    //     setTable([...updatedItems]);
    // };

    const calculateStartIndex = (start: string): number => {
        const [startHours, startMinutes] = start.split(":").map(Number);
        const startTotalMinutes = startHours * 60 + startMinutes;

        return (startTotalMinutes - 480) / PERIOD;
    };

    // const calculateHours = (index: number): String => {
    //     const min = 480 + index * PERIOD
    //     return String(Math.floor(min / 60)) + ':' + String(min % 60).padStart(2, '0')
    // }

    return (
        <div className="test">
            <h1>Test</h1>
            {/* <div className="subjects">
                {
                    Tracks.map((el, index) => {
                        return <div
                            key={index}
                            className="sub"
                            draggable={true}
                            onDragStart={() => handleDragStart(index)}
                        >
                            {el.name}
                        </div>
                    })
                }
            </div> */}
            <div className="grid-container">
                <div className="grid">
                    {
                        TIME.map((el, index) => {
                            return <div key={index} style={{ gridColumn: 'span 12', padding: '10px 0px', fontWeight: 'bold' }}>{el}</div>
                        })
                    }
                    {
                        Array.isArray(Schedule) && Schedule.map(lab => {
                            return lab.map((el, index) => {
                                if (lab[index - 1]?.nazwa === el?.nazwa && el?.nazwa !== 'empty') {
                                    return
                                }

                                // const isHighlighted =
                                //     hoverIndex !== null &&
                                //     draggedItem !== null &&
                                //     draggedItem !== undefined &&
                                //     index >= hoverIndex &&
                                //     index < hoverIndex + Number(Tracks[draggedItem].time) / PERIOD &&
                                //     Table[hoverIndex].nazwa == 'empty' &&
                                //     Table[hoverIndex + (Number(Tracks[draggedItem].time) / PERIOD) - 1]?.nazwa == 'empty' &&
                                //     hoverIndex + Number(Tracks[draggedItem].time) / PERIOD <= Table.length &&
                                //     !isBookedTest(hoverIndex) &&
                                //     !isBookedTest(hoverIndex + (Number(Tracks[draggedItem].time) / PERIOD) - 1)

                                // const hours = calculateHours(index)

                                return (
                                    <div
                                        // className={
                                        //     `item 
                                        //     ${isHighlighted ? "highlight" : ""} 
                                        //     ${isBookedTest(index) ? "booked" : ""}`
                                        // }
                                        className={
                                            `item`
                                        }
                                        key={index}
                                        style={{ gridColumn: `span ${el.długość}`, borderLeft: index % 12 != 0 ? 'none' : '4px solid #e9ecef', borderBottom: '4px solid #e9ecef' }}
                                    // onDragOver={e => handleDragOver(e, index)}
                                    // onDragLeave={handleDragLeave}
                                    // onDrop={isBookedTest(index) ? () => { } : () => handleDrop(index)}
                                    >
                                        {/* {el.nazwa !== 'empty' ? (
                                            <>
                                                <div>
                                                    {el.nazwa}
                                                </div>
                                                <FontAwesomeIcon icon={faCircleXmark} height={30} width={30} color="red" onClick={() => deleteSubjcet(index, el.długość)} />
                                            </>
                                        ) : (
                                            hoverIndex == index && isHighlighted &&
                                            <a style={{ transition: '0.5s ease' }}>{hours}</a>
                                        )
                                        } */}
                                        {el.nazwa !== 'empty' &&
                                            <div>
                                                {el.nazwa}
                                            </div>
                                        }
                                    </div>
                                )
                            })
                        })
                    }
                    <div style={{ gridColumn: 'span 84', height: '10px' }} />
                </div>
            </div>
        </div>
    )
}
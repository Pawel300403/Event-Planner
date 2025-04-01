import { useState } from "react"
import '../styles/test.css'
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useLabs } from "../api/lab/lab"


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

export const TrackList = (props: { nazwa: string, length: number }[]) => {

    const [draggedItem, setDraggedItem] = useState<number | null>();
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const [Table, setTable] = useState(props)
    const { data: Labs } = useLabs(1, undefined)

    // Funkcja uruchamiana podczas przeciągania
    const handleDragStart = (index: number) => {
        //console.log(index)
        setDraggedItem(index);
    };

    // Pozwala na upuszczenie w danym miejscu
    const handleDragOver = (event: React.DragEvent, index: number) => {
        event.preventDefault(); // Bez tego drop nie zadziała!
        setHoverIndex(index)
    };

    const handleDragLeave = () => {
        setHoverIndex(null); // Usuwamy podświetlenie po opuszczeniu kratki
    };

    const emptyTest = (index: number, length: number): boolean => {
        const result = Table
            .slice(index, index + length)
            .filter(el => el.nazwa !== 'empty')
        //console.log('wynik testu', result)
        return result.length == 0 ? true : false
    }

    const lengthTest = (index: number, length: number): boolean => {
        return index + length - 1 < Table.length
    }

    const repeatTest = (nazwa: string): boolean => {
        return Table.filter(el => el.nazwa === nazwa).length == 0
    }

    const isBookedTest = (index: number): boolean => {
        const hours = calculateHours(index)
        if (draggedItem !== null && draggedItem !== undefined && Array.isArray(Labs)) {
            return Labs[draggedItem].schedule.filter(el => el.start <= hours && el.end >= hours).length > 0
        }
        return false
    }

    // Obsługa upuszczenia i aktualizacja kolejności
    const handleDrop = (index: number) => {
        if (draggedItem !== undefined && draggedItem !== null && Array.isArray(Labs)) {
            const insertItem = Labs[draggedItem]
            const labLength = Number(insertItem.time) / PERIOD
            if (emptyTest(index, labLength) &&
                lengthTest(index, labLength) &&
                repeatTest(insertItem.name) &&
                !isBookedTest(index + labLength - 1)) {
                const updatedItems = Table.map((el, nr) => {
                    if (nr >= index && nr <= index + labLength - 1) {
                        return { nazwa: insertItem.name, length: labLength }; // Nowy obiekt
                    }
                    return el; // Pozostaw niezmienione
                })
                console.log(updatedItems)
                setTable(updatedItems)
            }
        }
        setHoverIndex(null)
    };

    const deleteSubjcet = (index: number, length: number) => {
        const updatedItems = Table.map((el, nr) => {
            if (nr >= index && nr <= index + length - 1) {
                return { nazwa: 'empty', length: 1 }; // Tworzymy nowy obiekt, nie modyfikujemy istniejącego
            }
            return el;
        });

        //console.log(updatedItems);
        setTable([...updatedItems]);
    };

    const calculateHours = (index: number): String => {
        const min = 480 + index * PERIOD
        return String(Math.floor(min / 60)) + ':' + String(min % 60).padStart(2, '0')
    }

    return (
        <div className="test">
            <h1>Test</h1>
            <div className="subjects">
                {
                    Array.isArray(Labs) && Labs.map((el, index) => {
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
            </div>
            <div className="grid-container">
                <div className="grid">
                    {
                        TIME.map((el, index) => {
                            return <div key={index} style={{ gridColumn: 'span 12', padding: '10px 0px', fontWeight: 'bold' }}>{el}</div>
                        })
                    }
                    {
                        Array.isArray(Table) && Table.map((el, index) => {
                            if (Table[index - 1]?.nazwa === el?.nazwa && el?.nazwa !== 'empty') {
                                return
                            }

                            const isHighlighted =
                                hoverIndex !== null &&
                                draggedItem !== null &&
                                draggedItem !== undefined &&
                                index >= hoverIndex &&
                                index < hoverIndex + Number(Labs?.[draggedItem].time) / PERIOD &&
                                Table[hoverIndex].nazwa == 'empty' &&
                                Table[hoverIndex + (Number(Labs?.[draggedItem].time) / PERIOD) - 1]?.nazwa == 'empty' &&
                                hoverIndex + Number(Labs?.[draggedItem].time) / PERIOD <= Table.length &&
                                !isBookedTest(hoverIndex) &&
                                !isBookedTest(hoverIndex + (Number(Labs?.[draggedItem].time) / PERIOD) - 1)

                            const hours = calculateHours(index)

                            return (
                                <div className={`item ${isHighlighted ? "highlight" : ""} ${isBookedTest(index) ? "booked" : ""}`}
                                    key={index}
                                    style={{ gridColumn: `span ${el.length}`, borderLeft: index % 12 != 0 ? 'none' : '4px solid #e9ecef', borderBottom: '4px solid #e9ecef' }}
                                    onDragOver={e => handleDragOver(e, index)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={isBookedTest(index) ? () => { } : () => handleDrop(index)}
                                >
                                    {el.nazwa !== 'empty' ? (
                                        <>
                                            <div>
                                                {el.nazwa}
                                            </div>
                                            <FontAwesomeIcon icon={faCircleXmark} height={30} width={30} color="red" onClick={() => deleteSubjcet(index, el.length)} />
                                        </>
                                    ) : (
                                        hoverIndex == index && isHighlighted &&
                                        <a style={{ transition: '0.5s ease' }}>{hours}</a>
                                    )
                                    }
                                </div>
                            )
                        })
                    }
                    <div style={{ gridColumn: 'span 84', height: '10px' }} />
                </div>
            </div>
        </div>
    )
}
import { useEffect, useState } from "react"
import { useAnnouncers } from "../api/user/user"
import bin from '/images/delete.png'
import check from '/images/check.png'
import { useDeleteLab } from "../api/lab/lab"

const Lab = ({ row, rowIndex, updateValue, extraCreate, extraCreateFn }: { row: string[], rowIndex: number, updateValue: (rowIndex: number, colIndex: number, value: string) => void, extraCreate?: boolean, extraCreateFn?: () => void }) => {

    const { data: users, isLoading } = useAnnouncers()
    const { mutate: deleteLab } = useDeleteLab()
    const [lab, setLab] = useState({
        nazwa: row[0],
        rodzaj: row[1],
        nr: row[2],
        osoby: row[3],
        czas: row[4],
        prowadzacy: row[5],
        opis: row[6]
    })

    useEffect(() => {
        if (!users?.find((user) => user?.full_name === row[5]) && !isLoading) {
            updateValue(rowIndex, 5, '')
        }
    }, [isLoading])

    return (
        <>
            <input
                type="text"
                value={lab.nazwa}
                onChange={(e) => setLab({ ...lab, nazwa: e.target.value })}
                onBlur={() => updateValue(rowIndex, 0, lab.nazwa)}
            />

            <input
                type="text"
                value={lab.rodzaj}
                onChange={(e) => setLab({ ...lab, rodzaj: e.target.value })}
                onBlur={() => updateValue(rowIndex, 1, lab.rodzaj)}
            />

            <input
                type="text"
                value={lab.nr}
                onChange={(e) => setLab({ ...lab, nr: e.target.value })}
                onBlur={() => updateValue(rowIndex, 2, lab.nr)}
            />

            <input
                type="text"
                value={lab.osoby}
                onChange={(e) => setLab({ ...lab, osoby: e.target.value })}
                onBlur={() => updateValue(rowIndex, 3, lab.osoby)}
            />

            <input
                type='text'
                value={lab.czas}
                onChange={(e) => setLab({ ...lab, czas: e.target.value })}
                onBlur={() => updateValue(rowIndex, 4, lab.czas)}
            />

            <select
                value={lab.prowadzacy}
                onChange={(e) => setLab({ ...lab, prowadzacy: e.target.value })}
                onBlur={() => updateValue(rowIndex, 5, lab.prowadzacy)}

            >
                <option value=''>---</option>
                {users && users.map((user, index) => (
                    <option value={user?.full_name} key={index}>{user?.full_name}</option>
                ))}
            </select>

            <textarea
                value={lab.opis}
                onChange={(e) => setLab({ ...lab, opis: e.target.value })}
                onBlur={() => updateValue(rowIndex, 6, lab.opis)}
            />

            {extraCreate &&
                <img className='delete-lab-btn'
                    src={check}
                    height={20}
                    width={20}
                    onClick={() => extraCreateFn?.()}
                />
            }

            {row[7] ?
                <img className='delete-lab-btn'
                    src={bin}
                    height={20}
                    width={20}
                    onClick={() => deleteLab(Number(row[7]))}
                />
                : <div />
            }
        </>
    )
}

export default Lab
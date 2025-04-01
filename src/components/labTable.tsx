import { useCreateLab, useUpdateLab } from "../api/lab/lab";
import { useAnnouncers } from "../api/user/user";
import Lab from "./lab";
import add from '/images/add.png'
import { useState } from "react";

const LabTable = ({ data, setData, edit, create }: { data: string[][], setData: (update: string[][]) => void, edit?: boolean, create?: boolean }) => {

    const { data: users } = useAnnouncers()
    const { mutate: updateLab } = useUpdateLab()
    const { mutate: createLab } = useCreateLab()
    const [newLab, setNewLab] = useState<string[]>(['', '', '', '', '', '', ''])
    const [showForm, setShowForm] = useState(false)

    const handleEditCell = (rowIndex: number, colIndex: number, newValue: string) => {
        const updatedData = [...data];

        if (edit && updatedData[rowIndex][colIndex] !== newValue) {

            updatedData[rowIndex][colIndex] = newValue;
            const change = {
                id: Number(updatedData[rowIndex][7]),
                nazwa: updatedData[rowIndex][0],
                rodzaj: updatedData[rowIndex][1],
                numer_sali: updatedData[rowIndex][2],
                max_liczba: Number(updatedData[rowIndex][3]),
                czas: Number(updatedData[rowIndex][4]),
                ID_prowadzacego: users?.find((user) => user.full_name === updatedData[rowIndex][5])?.id,
                opis: updatedData[rowIndex][6]
            }
            updateLab(change)
        } else {
            updatedData[rowIndex][colIndex] = newValue;
        }

        setData(updatedData);
    }

    const handleNewCell = (rowIndex: number, colIndex: number, newValue: string) => {
        rowIndex
        const updatedData = [...newLab]
        updatedData[colIndex] = newValue
        setNewLab(updatedData)
    }

    const handleCreateLab = () => {
        const change = {
            ID_wydarzenia: Number(data[0][8]),
            nazwa: newLab[0],
            rodzaj: newLab[1],
            numer_sali: newLab[2],
            max_liczba: Number(newLab[3]),
            czas: Number(newLab[4]),
            ID_prowadzacego: users?.find((user) => user.full_name === newLab[5])?.id,
            opis: newLab[6]
        }
        createLab(change)
    }

    return (
        <div className="table-container">
            <div className="header">Nazwa</div>
            <div className="header">Rodzaj</div>
            <div className="header">Nr sali</div>
            <div className="header">Liczba osób</div>
            <div className="header">Czas</div>
            <div className="header">Prowadzący</div>
            <div className="header" id='last'>Opis</div>

            {data.map((row, rowIndex) => (
                <Lab row={row} rowIndex={rowIndex} updateValue={handleEditCell} key={rowIndex} />
            ))}

            {showForm &&
                <Lab row={newLab} rowIndex={0} updateValue={handleNewCell} extraCreate={edit} extraCreateFn={handleCreateLab} />
            }

            <div className='footer'>
                <img src={add} onClick={() => {
                    if (create) {
                        const newData = data.concat([[]])
                        setData(newData)
                    } else {
                        setShowForm(!showForm)
                    }
                }}
                />
            </div>

        </div>
    )

}

export default LabTable
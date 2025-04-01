import { useEffect, useState } from "react"
import NavBar from "../components/NavBar"
import '../styles/user.css'
import add from '/images/add.png'
import edit from '/images/pen.png'
import bin from '/images/delete.png'
import { useCreateUser, useDeleteUser, useUpdateUser, useUsers } from "../api/user/user"
import { useAuth } from "../providers/AuthProvider"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"


const User = () => {

    const { profile } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const [userID, setUserID] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [pass, setPass] = useState<string>('')
    const [confPass, setConfPass] = useState<string>('')
    const [role, setRole] = useState<string>(profile === 'RSW' ? 'Guide' : '')
    const [disabled, setDisabled] = useState(true)
    const [isEdit, setIsEdit] = useState(false)
    const [search, setSearch] = useState('.')

    const { data: Users } = useUsers()
    const { mutate: createUser } = useCreateUser()
    const { mutate: deleteUser } = useDeleteUser()
    const { mutate: updateUser } = useUpdateUser()

    useEffect(() => {
        if (
            (
                name != '' &&
                email != '' &&
                pass != '' &&
                pass == confPass &&
                role != '' &&
                !isEdit
            ) ||
            (
                name != '' &&
                email != '' &&
                isEdit
            )
        ) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }

    }, [name, email, pass, confPass, role])

    useEffect(() => {
        if (!isOpen) {
            setName('')
            setEmail('')
            setPass('')
            setConfPass('')
            setIsEdit(false)
        }
    }, [isOpen])

    const setEditUser = (name: string, email: string, group: string, id: string) => {
        setName(name)
        setEmail(email)
        setRole(group)
        setUserID(id)
        setIsEdit(true)
        setIsOpen(true)
    }

    const handleEditUser = () => {
        updateUser({
            id: userID,
            full_name: name,
            email: email,
            group: role
        })
    }

    const handleCreateUser = () => {
        createUser({ email: email, group: role, name: name, password: pass })
        setName('')
        setEmail('')
        setPass('')
        setConfPass('')
        setRole(profile === 'Admin' ? '' : 'Guide')
    }

    const searchUser = (text: string) => {
        setSearch(`.?${text.toLowerCase()}.`)
    }

    return (
        <>
            <NavBar />
            <div className="user-container">
                <button onClick={() => setIsOpen(!isOpen)}>
                    <img src={add} />
                </button>
                <div className="search">
                    <input
                        //value={search}
                        placeholder="Wyszukaj..."
                        onChange={(e) => searchUser(e.target.value)}
                    />
                    <FontAwesomeIcon icon={faSearch} />
                </div>

                <div className="user-list">
                    {Users && Users.filter((user) => String(user.full_name).toLowerCase().match(search))
                        .map((user, index) => {
                            return (
                                <div key={index}>
                                    <p id='nazwa'>{user.full_name}</p>
                                    <p id='email'>{user.email}</p>
                                    {/* <p id='haslo'>{user.password}</p> */}
                                    <div className="button-container">
                                        <img src={edit} onClick={() => setEditUser(user.full_name, user.email || '', user.group, user.id || '')} />
                                        <img src={bin} onClick={() => deleteUser(user.id || '')} />
                                    </div>
                                </div>
                            )
                        })}
                </div>
                <div className={`create-user ${isOpen && 'open'}`} >
                    <label>Nazwa</label>
                    <input
                        id='nazwa'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <label>Email</label>
                    <input
                        id='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {!isEdit &&
                        <>
                            <label>Hasło</label>
                            <input
                                id='haslo'
                                value={pass}
                                onChange={(e) => setPass(e.target.value)}
                            />
                            <label>Potwierdź hasło</label>
                            <input
                                id='confhaslo'
                                value={confPass}
                                onChange={(e) => setConfPass(e.target.value)}
                            />
                        </>
                    }
                    {profile === 'Admin' &&
                        <>
                            <label htmlFor="rola">Rola</label>
                            <select
                                id='rola'
                                value={role}
                                onChange={(e) => setRole(e.target.value)}>
                                <option value=''>Wybierz rolę</option>
                                <option value='RSW'>Samorząd</option>
                                <option value='Guide'>Przewodnik</option>
                                <option value='Announcer'>Prowadzący</option>
                            </select>
                        </>
                    }
                    <button
                        disabled={disabled}
                        onClick={isEdit
                            ? () => handleEditUser()
                            : () => handleCreateUser()
                        }
                    >
                        {isEdit ? 'Edytuj' : 'Utwórz'} użytkownika
                    </button>
                </div>
                {isOpen && <div className="overlay" onClick={() => setIsOpen(!isOpen)}></div>}
            </div>
        </>
    )

}

export default User
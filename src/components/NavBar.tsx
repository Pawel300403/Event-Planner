import { NavLink, useNavigate } from 'react-router-dom'
import '../styles/NavBar.css'
import user from '/images/user.png'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../providers/AuthProvider'
// import Dropdown from 'react-bootstrap/Dropdown';
// import 'bootstrap/dist/css/bootstrap.min.css';

const NavBar = () => {

    const [isOpen, setIsOpen] = useState(false)
    const { session, profile, loading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!loading) {
            if (!session) {
                navigate('/')
            }
        }
    }, [session, loading])

    if (loading) {
        return <></>
    }

    return (
        <>
            <div className={`navbar ${profile !== 'Admin' ? 'rsw-color' : ''}`}>
                <div style={{ margin: 'auto' }}>
                    <NavLink to={'/home'} className={({ isActive }) => (isActive ? 'active-link' : '')}>Home</NavLink>
                    <NavLink to={'/user'} className={({ isActive }) => (isActive ? 'active-link' : '')}>Użytkownicy</NavLink>
                    {/* <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Dropdown Button
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown> */}
                </div>
                <div>
                    <p>{profile === 'Admin' ? 'Koordynator' : 'Samorząd'}</p>
                    <div className='circle' onClick={() => setIsOpen(!isOpen)}>
                        <img src={user} />
                    </div>
                </div>
            </div>
            <div
                className={isOpen ? `${profile !== 'Admin' ? 'logout-open rsw-color' : 'logout-open'}` : 'logout-close'}
                onClick={async () => await supabase.auth.signOut()}
            >
                Log out
            </div>
        </>
    )
}

export default NavBar
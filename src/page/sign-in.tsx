import { FormEvent, useEffect, useState } from 'react'
import '../styles/sign-in.css'
import experiment from '/images/experiment.png'
import microscope from '/images/microscope.png'
import roboticarm from '/images/robotic-arm.png'
import satellite from '/images/satellite.png'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import { supabase } from '../lib/supabase'

const SignIn = () => {

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const { session } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (session) {
            navigate('/home')
        }
    }, [session])

    const login = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await supabase.auth.signInWithPassword({
            email,
            password
        })
        // console.log(data, error)
        setEmail('')
        setPassword('')
        // navigate('/home')
    }

    return (
        <div className='main'>
            <div className='signContainer'>
                <p>Sign in</p>
                <img src={experiment} height={100} width={100} id='img2' />
                <img src={microscope} height={100} width={100} id='img3' />
                <img src={roboticarm} height={100} width={100} id='img1' />
                <img src={satellite} height={100} width={100} id='img4' />
                <form onSubmit={login}>
                    <input
                        id='email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        id='password'
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button>Log in</button>
                </form>
            </div>
        </div>
    )
}

export default SignIn
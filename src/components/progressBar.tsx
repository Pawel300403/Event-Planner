import { useLocation } from 'react-router-dom'
import '../styles/progressBar.css'
import { useEffect, useState } from 'react'
import check from '/images/check2.png'

const ProgressBar = () => {

    const location = useLocation()
    const [state, setState] = useState<string[]>([])

    useEffect(() => {
        switch (location.pathname) {
            case '/create':
                setState(['state2', 'state1', 'state1'])
                break;
            case '/create-labs':
                setState(['state3', 'state2', 'state1'])
                break;
            case '/create-summary':
                setState(['state3', 'state3', 'state3'])
                break;
            default:
                break;
        }
    }, [])

    return (
        <div className='progressBar'>
            <div className='circle' id={state[0]}><img src={check} /></div>
            <div className='line'></div>
            <div className='circle' id={state[1]}><img src={check} /></div>
            <div className='line'></div>
            <div className='circle' id={state[2]}><img src={check} /></div>
        </div>
    )
}

export default ProgressBar
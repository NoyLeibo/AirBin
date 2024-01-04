import { Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import routes from '../routes'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { login, logout, signup } from '../store/user.actions.js'
import { LoginSignup } from './LoginSignup.jsx'
import { useState } from 'react'
const LOGO = '../../public/img/airbnb.png'
const LOGO_ICON = '../../public/img/airbnb-icon.png'

export function AppHeader() {
    const user = useSelector(storeState => storeState.userModule.user)

    const [selectedButton, setSelectedButton] = useState('stays');

    const handleButtonClick = (buttonName) => {
        setSelectedButton(buttonName);
    };


    async function onLogin(credentials) {
        try {
            const user = await login(credentials)
            showSuccessMsg(`Welcome: ${user.fullname}`)
        } catch (err) {
            showErrorMsg('Cannot login')
        }
    }
    async function onSignup(credentials) {
        try {
            const user = await signup(credentials)
            showSuccessMsg(`Welcome new user: ${user.fullname}`)
        } catch (err) {
            showErrorMsg('Cannot signup')
        }
    }
    async function onLogout() {
        try {
            await logout()
            showSuccessMsg(`Bye now`)
        } catch (err) {
            showErrorMsg('Cannot logout')
        }
    }

    return (
        <header className="app-header full flex justify-between ">
            <NavLink to='/'>
                <div className='logo-container flex right-header'>
                    <img src={LOGO_ICON} alt='logo icon' />
                    <img src={LOGO} alt='logo name' />
                </div>
            </NavLink>

            <nav className='flex mid-header'>
                <button
                    className={`header-btns ${selectedButton === 'stays' ? 'selected' : ''}`}
                    onClick={() => handleButtonClick('stays')}>
                    Stays
                </button>
                <button
                    className={`header-btns ${selectedButton === 'experiences' ? 'selected' : ''}`}
                    onClick={() => handleButtonClick('experiences')}>
                    Experiences
                </button>
                <button
                    className={`header-btns ${selectedButton === 'onlineExperiences' ? 'selected' : ''}`}
                    onClick={() => handleButtonClick('onlineExperiences')}>
                    Online Experiences
                </button>
            </nav>

            <div className='flex left-header'>
                <div className=''> Airbnb your home</div>
                🌐
                <div className='burger-manu'>manu</div>
            </div>
            {/* 
                {user &&
                    <span className="user-info">
                        <Link to={`user/${user._id}`}>
                            {user.imgUrl && <img src={user.imgUrl} />}
                            {user.fullname}
                        </Link>
                        <span className="score">{user.score?.toLocaleString()}</span>
                        <button onClick={onLogout}>Logout</button>
                    </span>
                }
                {!user &&
                    <section className="user-info">
                        <LoginSignup onLogin={onLogin} onSignup={onSignup} />
                    </section>
                } */}
        </header>
    )
}
import { Link, NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import routes from '../routes'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { login, logout, signup } from '../store/user.actions.js'
import { LoginSignup } from './LoginSignup.jsx'
import { useState, useEffect, useRef } from 'react'
import { Calendar } from './Calendar'
import { Guests } from './Guests.jsx'
import { DatePicker, Space } from 'antd';
import { setSelectedDates as setSelectedDatesAction } from '../store/stay.actions';

const { RangePicker } = DatePicker;
const LOGO = '/img/airbnb.png'
const LOGO_ICON = '/img/airbnb-icon.png'


export function AppHeader() {
    const dispatch = useDispatch();

    const [selectedButton, setSelectedButton] = useState('stays')
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isOpenDates, setIsOpenDates] = useState(false)
    const [isOpenGuests, setIsOpenGuests] = useState(false)
    const [isScrolledDown, setIsScrolledDown] = useState(false);
    const [showScreenShadow, setShowScreenShadow] = useState(false);
    const selectedDates = useSelector((storeState) => storeState.stayModule.selectedDates)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY === 0) {
                setIsScrolledDown(true);
                // console.log('פתח את התפריט של 3 האופציות')
            }
            if (window.scrollY > 0) {
                // התפריט אמור לעלות למעלה כל התפריטים ולהתכווץ

                // console.log('סגור את התפריטים של 3 האופציות')
                // console.log('סגור את התפריטים של הguest dates destinations')
                setIsScrolledDown(false)
                setIsOpenDates(false)
                // dispatch(setSelectedDatesAction({ checkIn: null, checkOut: null })) // תאפס את התאריכים
                setIsOpenGuests(false)
            }
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (window.scrollY > 0 & isOpenDates) {
            setShowScreenShadow(true)
            // להכניס פה את הקוד שזה הופך בחזרה למרכז התפריט של הפילטור לפי תאריכים והכל
            setIsScrolledDown(true);
        }
        if (isOpenDates === false) {
            console.log('isOpenDates === false', isOpenDates === false);
            setShowScreenShadow(false)
        }
    }, [isOpenDates])

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const handleButtonClick = (buttonName) => {
        setSelectedButton(buttonName)
    }


    const toggleCalendarModal = () => {
        setIsOpenGuests(false);
        setIsOpenDates(!isOpenDates);

    };
    const toggleGuestModal = () => {
        setIsOpenDates(false);
        setIsOpenGuests(!isOpenGuests);
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
        <header className="app-header grid">
            <div className='flex justify-between'>
                <NavLink to='/'>
                    <div className='logo-container flex justify-center align-center right-header'>
                        <img src={LOGO_ICON} alt='logo icon' className='logo-header-img' />
                        <img src={LOGO} alt='logo name' className='logo-header-txt' />
                    </div>
                </NavLink>

                {isScrolledDown && <nav className='mid-three-menu flex column justify-center mid-header'>
                    <div>
                        <button
                            className={`header-btns clean-btn ${selectedButton === 'stays' ? 'selected' : ''}`}
                            onClick={() => handleButtonClick('stays')}>
                            Stays
                        </button>
                        <button
                            className={`header-btns clean-btn ${selectedButton === 'experiences' ? 'selected' : ''}`}
                            onClick={() => handleButtonClick('experiences')}>
                            Experiences
                        </button>
                        <button
                            className={`header-btns clean-btn ${selectedButton === 'onlineExperiences' ? 'selected' : ''}`}
                            onClick={() => handleButtonClick('onlineExperiences')}>
                            Online Experiences
                        </button>
                    </div>
                </nav>}
                <div className='flex left-header justify-center align-center'>
                    <button className='clean-btn moveto-host'>Airbnb your home</button>
                    <div className="lx138ae atm_h_1h6ojuz atm_9s_1txwivl atm_e2_1osqo2v atm_mk_h2mmj6 atm_wq_kb7nvz dir dir-ltr">
                        <div className="_z5mecy" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '16px', width: '16px', fill: 'currentColor' }}>
                                <path d="M8 .25a7.77 7.77 0 0 1 7.75 7.78 7.75 7.75 0 0 1-7.52 7.72h-.25A7.75 7.75 0 0 1 .25 8.24v-.25A7.75 7.75 0 0 1 8 .25zm1.95 8.5h-3.9c.15 2.9 1.17 5.34 1.88 5.5H8c.68 0 1.72-2.37 1.93-5.23zm4.26 0h-2.76c-.09 1.96-.53 3.78-1.18 5.08A6.26 6.26 0 0 0 14.17 9zm-9.67 0H1.8a6.26 6.26 0 0 0 3.94 5.08 12.59 12.59 0 0 1-1.16-4.7l-.03-.38zm1.2-6.58-.12.05a6.26 6.26 0 0 0-3.83 5.03h2.75c.09-1.83.48-3.54 1.06-4.81zm2.25-.42c-.7 0-1.78 2.51-1.94 5.5h3.9c-.15-2.9-1.18-5.34-1.89-5.5h-.07zm2.28.43.03.05a12.95 12.95 0 0 1 1.15 5.02h2.75a6.28 6.28 0 0 0-3.93-5.07z"></path>
                            </svg>
                        </div>
                    </div>
                    <button className='burger-menu clean-btn flex align-center' onClick={toggleMenu}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentColor', strokeWidth: 3, overflow: 'visible' }}>
                            <g fill="none">
                                <path d="M2 16h28M2 24h28M2 8h28"></path>
                            </g>
                        </svg>

                        <svg className='avatar' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ fill: 'currentColor' }}>
                            <path d="M16 .7C7.56.7.7 7.56.7 16S7.56 31.3 16 31.3 31.3 24.44 31.3 16 24.44.7 16 .7zm0 28c-4.02 0-7.6-1.88-9.93-4.81a12.43 12.43 0 0 1 6.45-4.4A6.5 6.5 0 0 1 9.5 14a6.5 6.5 0 0 1 13 0 6.51 6.51 0 0 1-3.02 5.5 12.42 12.42 0 0 1 6.45 4.4A12.67 12.67 0 0 1 16 28.7z"></path>
                        </svg>
                    </button>
                    {isMenuOpen && (
                        <div className="hamburger-menu">
                            <div className='manu-one flex column'>
                                <NavLink to="/login" >Log in</NavLink>
                                <NavLink to="/signup" >Sign up</NavLink>
                            </div><div className='flex column'>
                                <a href="#item3">Gift cards</a>
                                <a href="#item4">Airbnb your home</a>
                                <a href="#item5">Help center</a>
                            </div>
                        </div>
                    )} {/* will open the isMenuOpen modal if true */}
                </div>
            </div>

            {isScrolledDown && <div className='flex justify-center'>
                <form className="search-form justify-center flex row">
                    <div className='form-control flex column'>
                        <div className='destination-title fs12 blacktxt fw600'>Where</div>
                        <input type="text" placeholder="Search destinations" className='destination-input'></input>
                    </div>
                    <span className="splitter"></span>
                    <div className='form-dates flex column' onClick={toggleCalendarModal}>
                        <div className='fs12 blacktxt fw600'>check in</div>
                        {selectedDates.checkIn === null && <div className='fs14 blacktxt fw600'>Add guests</div>}
                        {selectedDates.checkIn && <div className='fs14 blacktxt fw600'>{selectedDates.checkIn.toLocaleDateString()}</div>}                    </div>
                    {isOpenDates && <div className="calendar-modal">
                        <Calendar />
                    </div>}
                    <div className='form-dates flex column' onClick={toggleCalendarModal}>
                        <div className='fs12 blacktxt fw600'>check out</div>
                        {selectedDates.checkOut === null && <div className='fs14 blacktxt fw600'>Add guests</div>}
                        {selectedDates.checkOut && <div className='fs14 blacktxt fw600'>{selectedDates.checkOut.toLocaleDateString()}</div>}
                    </div>
                    {isOpenDates && <Calendar />} {/* will open the Calendar modal if true */}

                    <span className="splitter"></span>
                    <div className='form-dates flex column' onClick={toggleGuestModal}>
                        <div className='fs12 blacktxt'>Who</div>
                        <div className='fs14 graytxt'>Add guests</div>
                        {isOpenGuests && <Guests />}
                    </div>
                    {isOpenGuests && <Guests />} {/* will open the guests modal if true */}
                    <button className="header-search-btn">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </form>
            </div>}
            {!isScrolledDown &&
                <div className="small-search-form">
                    <h1>test</h1>
                </div>}
            <div className="screen-shadow" style={{ display: showScreenShadow ? 'block' : 'none' }}></div>
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


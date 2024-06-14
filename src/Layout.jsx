import { Outlet } from 'react-router-dom'
import Main from './components/Main/Main';

const Layout = () => {
    return (
        <>
            <main className='App' style={{backgroundColor:'#ECECEC'}}>
                <Outlet />
                {/* <Main/> */}
            </main>
        </>
    )
}

export default Layout
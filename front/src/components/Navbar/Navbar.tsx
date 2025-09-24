import {ReactComponent as Apps} from 'assets/svg/category.svg';
import {ReactComponent as Setting} from 'assets/svg/setting.svg';
import {ReactComponent as Profile} from 'assets/svg/profile.svg';
import SearchBar from 'components/SearchBar/Searchbar';
const Navbar = () => {
    return (
        <nav className="bg-[--color-grafito] p-10 flex justify-between">
            <img src="/images/logo-blanco.png" alt="Logo Concha y Toro" className="h-7" />
                <SearchBar />
            <div className='flex gap-5'>
                <Apps />
                <Setting />
                <Profile />
            </div> 
        </nav>
    )
}

export default Navbar;
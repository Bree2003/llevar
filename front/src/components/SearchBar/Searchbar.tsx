import {ReactComponent as Search} from 'assets/svg/search-normal.svg';

const SearchBar = () => {
    return (
        <div className="flex gap-5 relative">
            <Search className='absolute self-center' />
            <input type="text" name="search" id="search" placeholder="Buscar Producto o Dataset" className="rounded-lg w-[400px]" />
                <button type="submit" className="bg-[--color-naranjo] text-white px-4 py-2 rounded-lg">Buscar</button>
        </div>
    )
}

export default SearchBar;
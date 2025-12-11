import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Navbar() {
    const [query, setQuery] = useState('')
    const navigate = useNavigate()

    const handleSearch = () => {
        if(query.trim()) {
             navigate(`/search?q=${query}`)
        }
    }

    return (
        <nav className="bg-slate-800 shadow-md py-4 px-6 flex flex-col md:flex-row justify-between items-center mb-5 gap-4">
            <div className='flex gap-4 items-center'>
                 <Link to={'/admin'} className="text-white hover:text-cyan-400 font-bold uppercase text-sm">Administrar Perfil</Link>
                 <h1 className="text-2xl font-black text-white cursor-pointer hover:text-cyan-400 transition-colors" onClick={() => navigate('/')}>Mi Linktree</h1>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
                <input 
                    type="text" 
                    className="flex-1 md:w-80 p-2 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="Buscar por nombre o email..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button 
                    onClick={handleSearch}
                    className="bg-cyan-400 text-slate-800 px-5 py-2 rounded-lg font-bold uppercase hover:bg-cyan-500 transition-colors"
                >
                    Buscar
                </button>
            </div>
        </nav>
    )
}

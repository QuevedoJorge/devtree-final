import { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { searchUsers } from '../api/DevTreeAPI'
import { User } from '../types'
import Navbar from '../components/Navbar'

export default function SearchResultsView() {
    const location = useLocation()
    const query = new URLSearchParams(location.search).get('q')
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(query) {
            setLoading(true)
            searchUsers(query).then(data => {
                setUsers(data || [])
            }).catch(() => {
                setUsers([])
            }).finally(() => {
                 setLoading(false)
            })
        }
    }, [query])

    return (
        <div className="bg-slate-100 min-h-screen">
            <Navbar />
            <div className="max-w-5xl mx-auto p-5 md:p-10">
                <h2 className="text-3xl font-black mb-8 text-slate-800">
                    Resultados para: <span className="text-cyan-500">{query}</span>
                </h2>
                
                {loading ? <p className="text-center text-xl text-slate-500">Cargando resultados...</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.map(user => (
                            <div key={user._id || user.handle} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-slate-100 group">
                                <div className="p-6 flex flex-col items-center">
                                    {user.image ? (
                                        <img src={user.image} alt={user.name} className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-slate-100 group-hover:border-cyan-400 transition-colors" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-slate-200 mb-4 flex items-center justify-center text-2xl font-bold text-slate-400 group-hover:bg-cyan-100 group-hover:text-cyan-600 transition-colors">
                                            {user.name.charAt(0)}
                                        </div>
                                    )}
                                    <h3 className="font-bold text-xl text-slate-800 mb-1">{user.name}</h3>
                                    <p className="text-sm text-slate-500 mb-4 truncate w-full text-center">@{user.handle || 'usuario'}</p>
                                    
                                    <Link 
                                        to={`/u/${user._id}`} 
                                        className="w-full text-center bg-slate-800 text-white py-2 rounded-lg font-bold hover:bg-cyan-500 hover:text-slate-900 transition-all duration-300"
                                    >
                                        Ver Perfil
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {users.length === 0 && !loading && (
                            <div className="col-span-full text-center py-20">
                                <p className="text-slate-400 text-lg">No se encontraron usuarios que coincidan con tu búsqueda.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

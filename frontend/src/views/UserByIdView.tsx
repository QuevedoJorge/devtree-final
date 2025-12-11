import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { getUserById, registerVisit } from '../api/DevTreeAPI'
import { User, SocialNetwork } from '../types'
import Navbar from '../components/Navbar'


export default function UserByIdView() {
    const { userId } = useParams()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const hasVisited = useRef(false)

    useEffect(() => {
        if(userId) {
            getUserById(userId).then(data => {
                if(data) {
                    setUser(data)
                    // Ensure we visit only once per component mount (fixes StrictMode double-call in dev)
                    if (!hasVisited.current) {
                        registerVisit(userId).then(() => {
                            setUser(prev => prev ? {...prev, visitas: (prev.visitas || 0) + 1} : prev)
                        })
                        hasVisited.current = true
                    }
                }
                setLoading(false)
            })
        }
    }, [userId])

    if(loading) return <p className="text-center mt-10">Cargando...</p>
    if(!user) return <div className="text-center mt-10"><p>Usuario no encontrado</p></div>

    let links: SocialNetwork[] = []
    try {
        links = typeof user.links === 'string' ? JSON.parse(user.links) : user.links
    } catch(e) { links = [] }

    return (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 min-h-screen">
             <Navbar />
             <div className="max-w-md mx-auto py-10 px-5">
                 <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-10 text-center border-t-8 border-cyan-400">
                    {user.image ? (
                        <img src={user.image} alt={user.name} className="w-28 h-28 rounded-full mx-auto mb-6 object-cover border-4 border-slate-100 shadow-lg" />
                    ) : (
                        <div className="w-28 h-28 rounded-full mx-auto mb-6 bg-slate-200 flex items-center justify-center text-4xl font-bold text-slate-400">
                            {user.name.charAt(0)}
                        </div>
                    )}
                    
                    <h1 className="text-3xl font-black text-slate-800 mb-1">{user.name}</h1>
                    <p className="text-slate-500 font-medium mb-4 text-lg">@{user.handle}</p>
                    <p className="text-slate-700 mb-8 max-w-sm mx-auto leading-relaxed">{user.description}</p>
                    
                    <div className="flex justify-center mb-8">
                         <div className="bg-slate-100 px-5 py-2 rounded-full flex items-center gap-2 shadow-inner">
                            <span className="text-slate-500 text-sm font-bold uppercase tracking-wide">Visitas</span>
                            <span className="bg-cyan-400 text-slate-900 px-2 py-0.5 rounded-md font-black text-sm min-w-[2rem]">{user.visitas}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {Array.isArray(links) && links.filter(l => l.enabled).map((link, i) => (
                             <a 
                                key={i} 
                                href={link.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="block bg-slate-800 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-cyan-500 hover:text-slate-900 hover:scale-[1.02] transform transition-all duration-300 shadow-md hover:shadow-cyan-500/50"
                            >
                                {link.name}
                            </a>
                        ))}
                        {links.length === 0 && <p className="text-slate-400 italic">No hay enlaces públicos</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

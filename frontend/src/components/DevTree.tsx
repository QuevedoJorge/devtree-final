import { Link, Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove} from '@dnd-kit/sortable'
import NavigationTabs from "./NavigationTabs"
import { SocialNetwork, User } from '../types'
import { useEffect, useState } from 'react'
import DevTreeLink from './DevTreeLink'
import { useQueryClient } from '@tanstack/react-query'
import Header from './Header'
import Navbar from './Navbar'

type DevTreeProps = {
    data: User
}

export default function DevTree({ data }: DevTreeProps) {

    const [enabledLinks, setEnabledLinks] = useState<SocialNetwork[]>(JSON.parse(data.links).filter((item: SocialNetwork) => item.enabled))

    useEffect(() => {
        setEnabledLinks(JSON.parse(data.links).filter((item: SocialNetwork) => item.enabled))
    }, [data])

    const queryClient = useQueryClient()
    const handleDragEnd = (e: DragEndEvent) => {
        const {active, over} = e

        if(over && over.id) {
            const prevIndex = enabledLinks.findIndex(link => link.name === active.id) //Cambio 3: usamos name
            const newIndex = enabledLinks.findIndex(link => link.name === over.id) //Cambio 4: usamos name
            const order = arrayMove(enabledLinks, prevIndex, newIndex)
            setEnabledLinks(order)

            const disabledLinks : SocialNetwork[] = JSON.parse(data.links).filter((item: SocialNetwork) => !item.enabled)
            const links = order.concat(disabledLinks)
            queryClient.setQueryData(['user'], (prevData: User) => {
                return {
                    ...prevData,
                    links: JSON.stringify(links)
                }
            })
            
        }
    }
    
    return (
        <>
            <Navbar />
            <Header />
            
            <div className="bg-slate-100 min-h-screen py-10">
                <main className="mx-auto max-w-5xl p-10 md:p-0">
                    
                    <NavigationTabs />

                    <div className="flex justify-end mt-5 mb-5">
                        <Link
                            className="font-bold text-right text-slate-800 text-lg hover:text-cyan-500 transition-colors flex items-center gap-2"
                            to={`/u/${data._id}`}
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            <span>Visitar Mi Perfil Público</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                        </Link>
                    </div>

                    <div className="flex flex-col md:flex-row gap-10">
                        <div className="flex-1 bg-white shadow-lg rounded-2xl p-8">
                            <Outlet />
                        </div>
                        <div className="w-full md:w-96 bg-slate-800 border-[10px] border-slate-900 rounded-[3rem] px-5 py-8 space-y-4 shadow-2xl overflow-hidden relative max-h-[700px] shrink-0">
                             {/* Phone Notch/Header Mockup */}
                             <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-10"></div>

                            <div className="mt-4 overflow-y-auto h-full pb-10 scrollbar-hide">
                                <div className="mt-2">
                                    {data.image ? (
                                        <img src={data.image} alt='Imagen Perfil' className='mx-auto w-24 h-24 rounded-full object-cover border-2 border-slate-600' />
                                    ) : (
                                        <div className="w-24 h-24 mx-auto rounded-full bg-slate-600 flex items-center justify-center text-3xl font-bold text-slate-300">
                                            {data.name.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                <p className='text-2xl font-bold text-center text-white mt-4'>{data.name}</p>
                                <p className='text-center text-slate-400 mb-4'>@{data.handle}</p>
                                <p className='text-center text-sm text-slate-300 leading-relaxed px-5 mb-8'>{data.description}</p>

                                <DndContext
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <div className='flex flex-col gap-4 px-2'>
                                        <SortableContext
                                            items={enabledLinks.map((l) => l.name)} 
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {enabledLinks.map(link => (
                                                <DevTreeLink key={link.name} link={link} /> 
                                            ))}
                                        </SortableContext>
                                    </div>
                                </DndContext>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Toaster position="top-right" />
        </>
    )
}

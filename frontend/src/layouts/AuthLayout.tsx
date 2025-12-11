import {Outlet} from 'react-router-dom'
import {Toaster} from 'sonner'
import Logo from '../components/Logo'

export default function AuthLayout() {
  return (
    <>
        <div className='bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen flex flex-col justify-center'>
            <div className='max-w-lg mx-auto w-full px-5 py-10'>
                <div className="flex justify-center mb-8">
                     <Logo />
                </div>

                <div className=''>
                    <Outlet />
                </div>
            </div>
        </div>

        <Toaster position='top-right' />
    </>
  )
}

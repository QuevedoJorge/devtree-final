import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import type { RegisterForm } from '../types'
import ErrorMessage from '../components/ErrorMessage'
import api from '../config/axios'

export default function RegisterView() {
    const location = useLocation()
    const navigate = useNavigate()
    const initialValues : RegisterForm = {
        name: '',
        email: '',
        handle:  location?.state?.handle || '',
        password: '',
        password_confirmation: ''
    }

    const { register, watch, reset, handleSubmit, formState: { errors } } = useForm({defaultValues : initialValues})

    const password = watch('password')

    const handleRegister = async (formData : RegisterForm) => {
        try {
            const {data} = await api.post(`/auth/register`, formData)
            toast.success(data)
            reset()
            navigate('/auth/login')
        } catch (error) {
            if(isAxiosError(error) && error.response ) {
                toast.error(error.response.data.error)
            }
        }
    }


    return (
        <>
            <h1 className='text-4xl text-white font-black text-center mb-6'>Crear Cuenta</h1>

            <form
                onSubmit={handleSubmit(handleRegister)}
                className="bg-white px-8 py-10 rounded-2xl shadow-2xl space-y-8"
            >
                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-xl font-bold text-slate-700">Nombre</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Tu Nombre"
                        className="w-full bg-slate-100 border border-slate-200 p-4 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all"
                        {...register('name', {
                            required: "El nombre es obligatorio"
                        })}
                    />
                    {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-xl font-bold text-slate-700">E-mail</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email de Registro"
                        className="w-full bg-slate-100 border border-slate-200 p-4 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all"
                        {...register('email', {
                            required: "El Email es obligatorio", 
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "E-mail no válido",
                            },
                        })}
                    />
                    {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="handle" className="text-xl font-bold text-slate-700">Handle (Usuario)</label>
                    <input
                        id="handle"
                        type="text"
                        placeholder="Nombre de usuario: sin espacios"
                        className="w-full bg-slate-100 border border-slate-200 p-4 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all"
                        {...register('handle', {
                            required: "El Handle es obligatorio"
                        })}
                    />
                    {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-xl font-bold text-slate-700">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password de Registro"
                        className="w-full bg-slate-100 border border-slate-200 p-4 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all"
                        {...register('password', {
                            required: "El Password es obligatorio",
                            minLength: {
                                value: 8,
                                message: "El password debe ser mínimo de 8 caracteres"
                            }
                        })}
                    />
                    {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="password_confirmation" className="text-xl font-bold text-slate-700">Repetir Password</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        placeholder="Repetir Password"
                        className="w-full bg-slate-100 border border-slate-200 p-4 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all"
                        {...register('password_confirmation', {
                            required: "Repetir Password es obligatorio",
                            validate: (value) => value === password || 'Los passwords no son iguales'
                        })}
                    />

                    {errors.password_confirmation && <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>}
                </div>

                <input
                    type="submit"
                    className="bg-cyan-400 w-full p-4 text-slate-800 uppercase rounded-xl font-black text-lg cursor-pointer hover:bg-cyan-500 hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-cyan-400/50"
                    value='Crear Cuenta'
                />
            </form>

            <nav className='mt-10 flex justify-center'>
                <Link
                    className='text-slate-300 text-lg hover:text-white transition-colors underline decoration-cyan-400/30 hover:decoration-cyan-400'
                    to="/auth/login"
                >¿Ya tienes una cuenta? Inicia Sesión</Link>
            </nav>
        </>
    )
}

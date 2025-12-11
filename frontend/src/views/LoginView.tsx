import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import ErrorMessage from '../components/ErrorMessage'
import { LoginForm } from '../types'
import api from '../config/axios'

export default function LoginView() {
  const navigate = useNavigate()
  const initialValues: LoginForm = {
    email: '',
    password: ''
  }

  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

  const handleLogin = async (formData: LoginForm) => {
    try {
      const { data } = await api.post(`/auth/login`, formData)
      localStorage.setItem('AUTH_TOKEN', data)
      navigate('/admin')
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.error)
      }
    }
  }

  return (
    <>
      <h1 className='text-4xl text-white font-black text-center mb-6'>Iniciar Sesión</h1>

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="bg-white px-8 py-10 rounded-2xl shadow-2xl space-y-8"
        noValidate
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-xl font-bold text-slate-700">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full bg-slate-100 border border-slate-200 p-4 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all"
            {...register("email", {
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && (
            <ErrorMessage>{errors.email.message}</ErrorMessage>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-xl font-bold text-slate-700">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password de Registro"
            className="w-full bg-slate-100 border border-slate-200 p-4 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all"
            {...register("password", {
              required: "El Password es obligatorio",
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          className="bg-cyan-400 w-full p-4 text-slate-800 uppercase rounded-xl font-black text-lg cursor-pointer hover:bg-cyan-500 hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-cyan-400/50"
          value='Iniciar Sesión'
        />
      </form>


      <nav className='mt-10 flex justify-center'>
        <Link
          className='text-slate-300 text-lg hover:text-white transition-colors underline decoration-cyan-400/30 hover:decoration-cyan-400'
          to="/auth/register"
        >¿No tienes cuenta? Crea una aquí</Link>
      </nav>
    </>
  )
}

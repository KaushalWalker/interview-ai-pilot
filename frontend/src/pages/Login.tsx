import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

type LoginForm = { username: string; password: string }

export function Login() {
  const { login } = useAuth()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>()
  const onSubmit = async (values: LoginForm) => {
    try { await login(values.username, values.password); toast.success('Signed in successfully') }
    catch { toast.error('Invalid email or password') }
  }

  return (
    <section className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Welcome back</h1>
        <p className="mt-2 text-slate-400">Sign in to continue your preparation.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <input {...register('username', { required: 'Email is required' })} placeholder="Email" className="w-full rounded-lg bg-slate-800 p-3" />
        {errors.username && <p className="text-sm text-red-400">{errors.username.message}</p>}
        <input {...register('password', { required: 'Password is required' })} type="password" placeholder="Password" className="w-full rounded-lg bg-slate-800 p-3" />
        {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
        <button disabled={isSubmitting} className="w-full rounded-lg bg-cyan-500 p-3 font-semibold text-slate-950 disabled:opacity-50">{isSubmitting ? 'Signing in...' : 'Sign in'}</button>
      </form>
      <p className="text-sm text-slate-400">New here? <Link className="text-cyan-400" to="/register">Create an account</Link></p>
    </section>
  )
}

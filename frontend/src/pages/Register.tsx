import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { registerRequest } from '../api/auth'

type RegisterForm = { name: string; email: string; password: string }

export function Register() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>()
  const onSubmit = async (values: RegisterForm) => {
    try { await registerRequest(values.name, values.email, values.password); toast.success('Account created'); window.location.href = '/login' }
    catch { toast.error('Unable to create account') }
  }
  return (
    <section className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Create your account</h1>
        <p className="mt-2 text-slate-400">Start building interview confidence.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <input {...register('name', { required: 'Name is required' })} placeholder="Name" className="w-full rounded-lg bg-slate-800 p-3" />
        <input {...register('email', { required: 'Email is required' })} type="email" placeholder="Email" className="w-full rounded-lg bg-slate-800 p-3" />
        <input {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Use at least 8 characters' } })} type="password" placeholder="Password" className="w-full rounded-lg bg-slate-800 p-3" />
        {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
        <button disabled={isSubmitting} className="w-full rounded-lg bg-cyan-500 p-3 font-semibold text-slate-950 disabled:opacity-50">{isSubmitting ? 'Creating...' : 'Create account'}</button>
      </form>
      <p className="text-sm text-slate-400">Already registered? <Link className="text-cyan-400" to="/login">Sign in</Link></p>
    </section>
  )
}

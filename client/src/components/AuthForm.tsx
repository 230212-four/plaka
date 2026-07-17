import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

interface AuthFormProps {
    onAuthSuccess: (token: string) => void
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
    const [isLogin, setIsLogin] = useState(true)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    // React Query Mutation pipeline to make requests to our Node backend
    const authMutation = useMutation({
        mutationFn: async () => {
            setErrorMessage('')
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
            const payload = isLogin ? { email, password } : { username, email, password }

            console.log('🚀 [PLAKA Dispatch] Sending payload to backend...', { endpoint, payload: { ...payload, password: '••••' } })

            // Abort the request if no response within 10 seconds
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 10_000)

            let response: Response
            try {
                response = await fetch(`http://127.0.0.1:3000${endpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    signal: controller.signal,
                })
            } catch (err) {
                if (err instanceof DOMException && err.name === 'AbortError') {
                    throw new Error('Request timed out. Is the server running?')
                }
                console.error('[AuthForm] Fetch error:', err)
                throw new Error('Could not reach the server. Check your connection.')
            } finally {
                clearTimeout(timeoutId)
            }

            const data = await response.json()
            console.log(`📡 [PLAKA Response] ${response.status} ${response.statusText}`, data)
            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong.')
            }
            return data
        },
        onSuccess: (data) => {
            console.log('✅ [PLAKA Success] Token stored:', data.token)
            console.log('✅ [PLAKA Success] User:', data.user)
            localStorage.setItem('plaka_token', data.token)
            onAuthSuccess(data.token)
        },
        onError: (error: Error) => {
            console.error('❌ [PLAKA Error]', error.message)
            setErrorMessage(error.message)
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        authMutation.mutate()
    }

    /* ─── Shared input field classes (Neo-Brutalist: sharp edges, thick borders) ─── */
    const inputClasses = [
        'w-full px-4 py-3',
        'border-[3px] border-[#1E352F] bg-[#FDFBF7]',
        'text-[#1E352F] font-semibold text-sm',
        'focus:outline-none focus:border-[#D96B43]',
        'focus:shadow-[4px_4px_0px_0px_rgba(217,107,67,0.4)]',
        'transition-all duration-150',
        'placeholder:text-[#4A6B5D]/50 placeholder:font-medium',
    ].join(' ')

    return (
        <div className="w-full max-w-md bg-[#FDFBF7] border-[3px] border-[#1E352F] shadow-[8px_8px_0px_0px_rgba(30,53,47,1)]">

            {/* ═══════ Record Label Header Strip ═══════ */}
            <div className="bg-[#1E352F] px-8 py-6 flex flex-col items-center gap-2">

                {/* Circular Frog Mascot Frame */}
                <div className="w-16 h-16 rounded-full bg-[#FDFBF7] border-[3px] border-[#4A6B5D] flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(74,107,93,0.6)]">
                    <span className="text-3xl leading-none select-none" role="img" aria-label="PLAKA frog mascot">
                        🐸
                    </span>
                </div>

                <h1 className="text-[#FDFBF7] font-black uppercase tracking-[0.25em] text-2xl mt-1 leading-none">
                    PLAKA
                </h1>
                <p className="text-[#4A6B5D] text-[11px] font-bold uppercase tracking-[0.2em]">
                    Vinyl Crate Manager
                </p>
            </div>

            {/* ═══════ Card Body ═══════ */}
            <div className="p-8">

                {/* Mode Title Block */}
                <div className="mb-6 border-b-[3px] border-dashed border-[#4A6B5D]/50 pb-4">
                    <h2 className="text-2xl font-black text-[#1E352F] uppercase tracking-tight leading-none">
                        {isLogin ? 'Welcome Back' : 'Join the Pond'}
                    </h2>
                    <p className="text-[#4A6B5D] font-semibold text-sm mt-2">
                        {isLogin
                            ? 'Spin your collection forever.'
                            : 'Start managing your crate library.'}
                    </p>
                </div>

                {/* Error Alert Card (Neo-Brutalist flat box) */}
                {errorMessage && (
                    <div className="bg-red-50 border-[3px] border-[#1E352F] p-3 mb-5 font-bold text-red-700 text-sm shadow-[4px_4px_0px_0px_rgba(30,53,47,1)] flex items-start gap-2">
                        <span className="shrink-0 text-base leading-none mt-px">⚠️</span>
                        <span>{errorMessage}</span>
                    </div>
                )}

                {/* ═══════ Auth Form ═══════ */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Username (Registration only) */}
                    {!isLogin && (
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="plaka-username"
                                className="text-[10px] font-black text-[#1E352F] uppercase tracking-[0.2em]"
                            >
                                Username
                            </label>
                            <input
                                id="plaka-username"
                                type="text"
                                required
                                className={inputClasses}
                                placeholder="your_username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="plaka-email"
                            className="text-[10px] font-black text-[#1E352F] uppercase tracking-[0.2em]"
                        >
                            Email Address
                        </label>
                        <input
                            id="plaka-email"
                            type="email"
                            required
                            className={inputClasses}
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="plaka-password"
                            className="text-[10px] font-black text-[#1E352F] uppercase tracking-[0.2em]"
                        >
                            Password
                        </label>
                        <input
                            id="plaka-password"
                            type="password"
                            required
                            className={inputClasses}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* ═══════ Neo-Brutalist CTA Button ═══════ */}
                    <button
                        id="plaka-auth-submit"
                        type="submit"
                        disabled={authMutation.isPending}
                        className={[
                            'w-full mt-3 py-3.5',
                            'bg-[#D96B43] text-[#FDFBF7]',
                            'font-black text-sm uppercase tracking-[0.2em]',
                            'border-[3px] border-[#1E352F]',
                            'shadow-[8px_8px_0px_0px_rgba(30,53,47,1)]',
                            // Hover: subtle shift inward
                            'hover:shadow-[6px_6px_0px_0px_rgba(30,53,47,1)]',
                            'hover:translate-x-[1px] hover:translate-y-[1px]',
                            // Press: clean compress (per design spec)
                            'active:translate-x-[2px] active:translate-y-[2px]',
                            'active:shadow-[2px_2px_0px_0px_rgba(30,53,47,1)]',
                            'transition-all duration-100',
                            'disabled:opacity-60 disabled:cursor-not-allowed',
                            'cursor-pointer',
                            'flex items-center justify-center gap-2.5',
                        ].join(' ')}
                    >
                        {authMutation.isPending ? (
                            <>
                                {/* Spinning Vinyl Record Icon */}
                                <svg
                                    className="animate-spin h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >
                                    {/* Outer disc */}
                                    <circle cx="12" cy="12" r="10" fill="#FDFBF7" opacity="0.25" />
                                    {/* Grooves */}
                                    <circle cx="12" cy="12" r="10" stroke="#FDFBF7" strokeWidth="2" opacity="0.3" fill="none" />
                                    <circle cx="12" cy="12" r="7" stroke="#FDFBF7" strokeWidth="0.5" opacity="0.2" fill="none" />
                                    <circle cx="12" cy="12" r="4.5" stroke="#FDFBF7" strokeWidth="0.5" opacity="0.2" fill="none" />
                                    {/* Center label */}
                                    <circle cx="12" cy="12" r="3" fill="#D96B43" stroke="#FDFBF7" strokeWidth="1" />
                                    {/* Spindle hole */}
                                    <circle cx="12" cy="12" r="1" fill="#FDFBF7" />
                                    {/* Arc segment for spin visual */}
                                    <path
                                        d="M12 2a10 10 0 0 1 10 10"
                                        stroke="#FDFBF7"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        opacity="0.9"
                                    />
                                </svg>
                                <span>Connecting...</span>
                            </>
                        ) : isLogin ? (
                            '→ Sign In'
                        ) : (
                            '→ Create Account'
                        )}
                    </button>
                </form>

                {/* ═══════ Mode Toggle Link ═══════ */}
                <div className="text-center mt-7 pt-5 border-t-[3px] border-dashed border-[#4A6B5D]/30">
                    <button
                        id="plaka-auth-toggle"
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin)
                            setErrorMessage('')
                        }}
                        className="text-[#4A6B5D] hover:text-[#1E352F] font-bold text-sm underline decoration-[#D96B43] decoration-2 underline-offset-4 cursor-pointer transition-colors duration-150"
                    >
                        {isLogin
                            ? "Don't have an account? Register here"
                            : 'Already a collector? Log in here'}
                    </button>
                </div>
            </div>
        </div>
    )
}
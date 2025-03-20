"use client"

import { useState } from "react"
import GoogleAuthButton from "../components/GoogleAuthButton"

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const toggleAuthMode = () => {
        setIsLogin(!isLogin)
        setError(null)
        setSuccess(null)
    }

    const handleGoogleAuth = async () => {
        setIsLoading(true)
        setError(null)

        try {
            // Simulación de autenticación exitosa
            // En una implementación real, aquí llamarías a la API de Firebase o similar
            await new Promise((resolve) => setTimeout(resolve, 1500))

            setSuccess(isLogin ? "¡Inicio de sesión exitoso!" : "¡Cuenta creada exitosamente!")

            // Aquí redirigirías al usuario a la página de dashboard
            // window.location.href = "/dashboard"
        } catch (err) {
            setError("Error en la autenticación. Por favor intenta de nuevo.")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
                <h1 className="text-center text-2xl font-bold">{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</h1>
                <p className="mt-2 text-center text-sm opacity-90">
                    {isLogin ? "Accede a tu cuenta con Google" : "Regístrate usando tu cuenta de Google"}
                </p>
            </div>

            {/* Body */}
            <div className="px-8 py-6">
                {/* Error message */}
                {error && <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-600">{error}</div>}

                {/* Success message */}
                {success && <div className="mb-6 rounded-md bg-green-50 p-4 text-sm text-green-600">{success}</div>}

                {/* Google Auth Button */}
                <div className="mb-6 flex flex-col items-center justify-center space-y-4">
                    <div className="flex w-full items-center justify-center">
                        <div className="h-px flex-1 bg-gray-300"></div>
                        <p className="mx-4 text-sm text-gray-500">{isLogin ? "Inicia sesión con" : "Regístrate con"}</p>
                        <div className="h-px flex-1 bg-gray-300"></div>
                    </div>

                    <GoogleAuthButton onClick={handleGoogleAuth} isLoading={isLoading} mode={isLogin ? "login" : "signup"} />
                </div>

                {/* Toggle Auth Mode */}
                <div className="text-center text-sm">
                    {isLogin ? (
                        <p>
                            ¿No tienes una cuenta?{" "}
                            <button onClick={toggleAuthMode} className="font-medium text-blue-600 hover:text-blue-800">
                                Regístrate
                            </button>
                        </p>
                    ) : (
                        <p>
                            ¿Ya tienes una cuenta?{" "}
                            <button onClick={toggleAuthMode} className="font-medium text-blue-600 hover:text-blue-800">
                                Inicia sesión
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}


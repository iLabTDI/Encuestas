"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../backend/supabaseClient" // Archivo TS que exporta el cliente de Supabase
import GoogleAuthButton from "../components/GoogleAuthButton"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [session, setSession] = useState(null)

  // Función para validar que el correo sea institucional
  const validarDominio = (email) => {
    if (!email.endsWith("@alumnos.udg.mx")) {
      setError("Solo se aceptan cuentas institucionales (@alumnos.udg.mx)")
      // Si no es el dominio correcto, cierra la sesión
      supabase.auth.signOut()
    } else {
      setSuccess("¡Inicio de sesión exitoso!")
    }
  }

  useEffect(() => {
    // Obtén la sesión actual al montar el componente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        validarDominio(session.user.email)
      }
    })

    // Escucha los cambios en la sesión (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        validarDominio(session.user.email)
      }
    })

    // Limpieza del listener
    return () => {
      if (authListener && typeof authListener.unsubscribe === "function") {
        authListener.unsubscribe()
      }
    }
  }, [])

  // Función para iniciar sesión con Google
  const handleGoogleAuth = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin, // Redirige a la URL actual
        },
      })
      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError("Error en la autenticación. Por favor, intenta de nuevo.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
        <h1 className="text-center text-2xl font-bold">Iniciar Sesión</h1>
        <p className="mt-2 text-center text-sm opacity-90">
          Accede a tu cuenta con Google
        </p>
      </div>

      {/* Body */}
      <div className="px-8 py-6">
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-md bg-green-50 p-4 text-sm text-green-600">
            {success}
          </div>
        )}

        {/* Google Auth Button */}
        <div className="mb-6 flex flex-col items-center justify-center space-y-4">
          <div className="flex w-full items-center justify-center">
            <div className="h-px flex-1 bg-gray-300"></div>
            <p className="mx-4 text-sm text-gray-500">Inicia sesión con</p>
            <div className="h-px flex-1 bg-gray-300"></div>
          </div>
          <GoogleAuthButton onClick={handleGoogleAuth} isLoading={isLoading} mode="login" />
        </div>
      </div>
    </div>
  )
}

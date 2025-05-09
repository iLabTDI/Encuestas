import { useState, useEffect } from "react";
import { supabase } from "../../backend/supabaseClient"; // Archivo TS que exporta el cliente de Supabase
import GoogleAuthButton from "../components/GoogleAuthButton";
import {
  Info,
  X,
  AlertCircle,
  CheckCircle,
  Shield,
  ShieldCheck,
} from "lucide-react";
// Importa useNavigate desde React Router
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [session, setSession] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Función para validar el correo
  const validarDominio = (email) => {
    if (
      email === "hector.rivera2888@alumnos.udg.mx" ||
      email === "lizeth.crisosto9230@alumnos.udg.mx"
    ) {
      setSuccess("¡Inicio de sesión exitoso como administrador!");
      localStorage.setItem("token", "admin-token");
      localStorage.setItem("role", "admin");
      localStorage.setItem("email", email);
      login("admin"); // Actualiza el estado global
      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } else if (email.endsWith("@alumnos.udg.mx")) {
      setSuccess("¡Inicio de sesión exitoso!");
      localStorage.setItem("token", "user-token");
      localStorage.setItem("role", "user");
      localStorage.setItem("email", email);
      login("user"); // Actualiza el estado global
      setTimeout(() => {
        navigate("/formulario");
      }, 1500);
    } else if (email.endsWith("@academicos.udg.mx")) {
      setSuccess("¡Inicio de sesión exitoso!");
      localStorage.setItem("token", "user-token");
      localStorage.setItem("role", "user");
      localStorage.setItem("email", email);
      login("user"); // Actualiza el estado global
      setTimeout(() => {
        navigate("/formulario");
      }, 1500);
    } else {
      setError("Solo se aceptan cuentas institucionales de UDG.");
      supabase.auth.signOut();
    }
  };

  useEffect(() => {
    // Obtén la sesión actual al montar el componente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) validarDominio(session.user.email);
    });

    // Escucha los cambios en la sesión (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) validarDominio(session.user.email);
      }
    );

    // Limpieza del listener
    return () => {
      if (authListener?.unsubscribe) authListener.unsubscribe();
    };
  }, []);

  // Función para iniciar sesión con Google
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      if (error) setError(error.message);
    } catch (err) {
      setError("Error en la autenticación. Por favor, intenta de nuevo.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 hover:shadow-[0_20px_60px_-10px_rgba(107,70,193,0.3)]">
        {/* Header con diseño mejorado */}
        <div className="relative bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-8 text-white">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzAgMGMxNi41NjkgMCAzMCAxMy40MzEgMzAgMzAgMCAxNi41NjktMTMuNDMxIDMwLTMwIDMwQzEzLjQzMSA2MCAwIDQ2LjU2OSAwIDMwIDAgMTMuNDMxIDEzLjQzMSAwIDMwIDB6bTAgNGMxNC4zNiAwIDI2IDExLjY0IDI2IDI2UzQ0LjM2IDU2IDMwIDU2IDQgNDQuMzYgNCAzMCAxNS42NCA0IDMwIDR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
          <h1 className="text-center text-3xl font-bold tracking-tight">
            Iniciar Sesión
          </h1>
          <p className="mt-2 text-center text-sm font-medium text-white/80">
            Accede a tu cuenta con Google
          </p>

          {/* Botón de información interactivo */}
          <button
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
            onClick={() => setShowInfo(!showInfo)}
            aria-label="Más información"
          >
            <Info className="h-5 w-5" />
          </button>
        </div>

        {/* Body con diseño mejorado */}
        <div className="px-8 py-8">
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 shadow-sm border border-red-100 animate-fadeIn">
              <div className="flex">
                <AlertCircle className="h-5 w-5 mr-2 text-red-500 flex-shrink-0" />
                {error}
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-lg bg-green-50 p-4 text-sm text-green-600 shadow-sm border border-green-100 animate-fadeIn">
              <div className="flex">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
                {success}
              </div>
            </div>
          )}

          {/* Google Auth Button */}
          <div className="mb-8 flex flex-col items-center justify-center space-y-6">
            <div className="flex w-full items-center justify-center">
              <div className="h-px flex-1 bg-gray-200"></div>
              <p className="mx-4 text-sm font-medium text-gray-500">
                Inicia sesión con
              </p>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            <div className="w-full transform transition-transform duration-300 hover:scale-[1.02]">
              <GoogleAuthButton
                onClick={handleGoogleAuth}
                isLoading={isLoading}
                mode="login"
              />
            </div>
          </div>

          {/* Mensaje informativo mejorado */}
          <div className="mt-6 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 shadow-sm">
            <div className="p-5 relative">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full p-2 shadow-md">
                  <Info className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <h4 className="text-md font-semibold text-gray-900">
                    Importante:
                  </h4>
                  <p className="mt-1 text-sm text-gray-700">
                    Esta encuesta está dirigida exclusivamente a estudiantes con
                    correo institucional{" "}
                    <span className="font-medium text-indigo-700">
                      (@alumnos.udg.mx)
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de información mejorado */}
        {showInfo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={() => setShowInfo(false)}
          >
            <div
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Encabezado del modal */}
              <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Info className="h-6 w-6 mr-2 text-white" />
                  <h3 className="text-lg font-semibold text-white">
                    Información Importante
                  </h3>
                </div>
                <button
                  onClick={() => setShowInfo(false)}
                  className="text-white/80 hover:text-white transition-colors focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Contenido del modal */}
              <div className="px-6 py-5">
                <div className="flex items-start mb-5">
                  <div className="flex-shrink-0 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full p-2">
                    <Shield className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-md font-medium text-gray-900">
                      Acceso Exclusivo para Estudiantes
                    </h4>
                    <p className="mt-1 text-sm text-gray-600">
                      Solo se aceptan correos institucionales{" "}
                      <span className="font-medium text-indigo-700">
                        (@alumnos.udg.mx)
                      </span>
                      .
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border-l-4 border-indigo-500 shadow-inner">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Esta restricción garantiza la{" "}
                    <span className="font-medium text-indigo-700">
                      transparencia
                    </span>{" "}
                    en las encuestas y evita la participación de bots o cuentas
                    no autorizadas, asegurando que solo los estudiantes de la
                    institución puedan participar.
                  </p>
                  <div className="mt-3 flex items-center text-sm text-indigo-700">
                    <ShieldCheck className="h-5 w-5 mr-1" />
                    <span className="font-medium">
                      Tu información está segura con nosotros
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowInfo(false)}
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;

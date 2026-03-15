"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log("Intentando iniciar sesión para:", email);
    
    // Verificar si las variables de entorno están cargadas en el cliente
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!url || !key) {
      console.error("Faltan variables de entorno de Supabase");
      setError("Error de configuración: Faltan llaves de Supabase.");
      setLoading(false);
      return;
    }

    try {
      console.log("Llamando a signInWithPassword...");
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Respuesta de Supabase:", { data, error });

      if (error) {
        setError(error.message === "Invalid login credentials" ? "Credenciales inválidas" : error.message);
        setLoading(false);
      } else {
        console.log("Login exitoso, redirigiendo con window.location...");
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      console.error("Login Catch Error:", err);
      setError("Error de comunicación: " + (err.message || "Error desconocido"));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white p-8 rounded-lg border border-border">
          <div className="mb-8 flex flex-col items-center">
            <h1 className="text-2xl font-bold text-primary">Vaultly</h1>
            <p className="text-sm text-text-secondary mt-1">Acceso Administrativo</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-text-secondary uppercase tracking-wider mb-1.5">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="admin@ejemplo.com"
                required
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-text-secondary uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-alert-text bg-alert-bg p-2 rounded text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary mt-2"
            >
              {loading ? "Iniciando sesión..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

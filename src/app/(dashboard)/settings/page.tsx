"use client";

import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Settings, Download, Smartphone, Laptop, CheckCircle2, Share, Moon, Sun, Palette, Check, User, Camera, Save, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAccent, ACCENT_COLORS } from "@/components/accent-provider";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNotification } from "@/components/Notification";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function SettingsPage() {
  const { isInstallable, isInstalled, isIOS, isChromium, handleInstallClick } = usePWAInstall();
  const { color, setColor } = useAccent();
  const { showNotification, hideNotification } = useNotification();
  
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setFullName(user.user_metadata?.full_name || "");
        setAvatarUrl(user.user_metadata?.avatar_url || "");
      }
    }
    getProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingId = showNotification("Guardando cambios...", "loading");

    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          full_name: fullName,
          avatar_url: avatarUrl 
        }
      });

      if (error) throw error;
      
      await supabase.auth.getUser();
      hideNotification(loadingId);
      showNotification("Perfil actualizado correctamente", "success");
    } catch (error: any) {
      hideNotification(loadingId);
      showNotification("Error: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const PREDEFINED_AVATARS = [
    "https://api.dicebear.com/7.x/lorelei/svg?seed=Lily",
    "https://api.dicebear.com/7.x/lorelei/svg?seed=Jasper",
    "https://api.dicebear.com/7.x/lorelei/svg?seed=Buddy",
    "https://api.dicebear.com/7.x/lorelei/svg?seed=Lucky",
    "https://api.dicebear.com/7.x/lorelei/svg?seed=Willow",
    "https://api.dicebear.com/7.x/lorelei/svg?seed=Peanut",
    "https://api.dicebear.com/7.x/lorelei/svg?seed=Muffin",
    "https://api.dicebear.com/7.x/lorelei/svg?seed=Oscar",
    "https://api.dicebear.com/7.x/lorelei/svg?seed=Zoe",
    "https://api.dicebear.com/7.x/lorelei/svg?seed=Coco"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">Configuración</h1>
        <p className="text-text-secondary">
          Personaliza tu perfil y gestiona las preferencias de la aplicación.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Perfil Section */}
        <section className="card p-6 bg-white dark:bg-surface shadow-sm hover:shadow-md transition-all border-border relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden shadow-inner">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    ) : (
                      <User className="w-12 h-12 text-primary/40" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
                <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold opacity-70">Foto de Perfil</p>
              </div>

              <div className="flex-1 w-full space-y-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-text-primary">O elige un avatar predefinido:</h4>
                  <div className="flex flex-wrap gap-3">
                    {PREDEFINED_AVATARS.map((avatar) => (
                      <button
                        key={avatar}
                        onClick={() => setAvatarUrl(avatar)}
                        className={cn(
                          "w-12 h-12 rounded-full border-2 transition-all hover:scale-110 active:scale-95 overflow-hidden",
                          avatarUrl === avatar ? "border-primary ring-2 ring-primary/20 scale-110" : "border-transparent opacity-70 hover:opacity-100"
                        )}
                      >
                        <img src={avatar} alt="Avatar option" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-text-primary">Nombre Completo</label>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-text-primary">Correo Electrónico</label>
                    <input 
                      type="email" 
                      value={user?.email || ""} 
                      disabled
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl opacity-60 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Apariencia Section */}
        <section className="card p-6 bg-white dark:bg-surface shadow-sm hover:shadow-md transition-all border-border">
          <div className="flex items-center justify-between gap-4">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                   <Sun className="w-6 h-6 dark:hidden" />
                   <Moon className="w-6 h-6 hidden dark:block" />
                </div>
                <div>
                   <h3 className="text-xl font-semibold text-text-primary">Apariencia</h3>
                   <p className="text-sm text-text-secondary">Selecciona entre el modo claro o el modo oscuro para el sistema.</p>
                </div>
             </div>
             <ThemeToggle />
          </div>

          <div className="mt-6 pt-6 border-t border-border flex flex-col gap-4">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-surface rounded-xl border border-border text-text-secondary">
                   <Palette className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="font-semibold text-text-primary">Color de Acento</h3>
                   <p className="text-sm text-text-secondary">Personaliza el color principal de Kardix a tu gusto.</p>
                </div>
             </div>
             
             <div className="flex flex-wrap gap-3 pl-[3.25rem]">
                {ACCENT_COLORS.map((accent) => {
                   const isActive = color === accent.hex;
                   return (
                     <button
                       key={accent.hex}
                       onClick={() => setColor(accent.hex)}
                       className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm ${
                         isActive ? "ring-2 ring-offset-2 ring-offset-surface scale-110" : "opacity-80 hover:opacity-100"
                       }`}
                       style={{ 
                         backgroundColor: accent.hex,
                         ...(isActive ? { "--tw-ring-color": accent.hex } as any : {})
                       }}
                       title={accent.name}
                       aria-label={`Seleccionar color ${accent.name}`}
                     >
                       {isActive && <Check className="w-5 h-5 text-white" />}
                     </button>
                   );
                })}
             </div>
          </div>
        </section>

        {/* PWA Section */}
        <section className="card overflow-hidden bg-white dark:bg-surface shadow-sm hover:shadow-md transition-all border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-text-primary">Instalar Aplicación (PWA)</h2>
                <p className="text-sm text-text-secondary max-w-md">
                  Instala Kardix en tu dispositivo para usarlo sin navegador, con acceso directo y mejor rendimiento.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 shrink-0">
              {isInstalled ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-sm font-medium border border-green-100 dark:border-green-900/30">
                  <CheckCircle2 className="w-4 h-4" />
                  Ya instalada
                </div>
              ) : isInstallable ? (
                <button
                  onClick={handleInstallClick}
                  className="btn-primary flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5 whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  Instalar App
                </button>
              ) : isIOS ? (
                <div className="text-right">
                  <p className="text-xs font-medium text-text-primary mb-2 flex items-center justify-end gap-1">
                    <Share className="w-3 h-3" /> Cómo instalar en iOS:
                  </p>
                  <p className="text-[11px] text-text-secondary">
                    Presiona el botón <span className="font-bold">Compartir</span> y luego <br />
                    <span className="font-bold">"Agregar a inicio"</span>
                  </p>
                </div>
              ) : isChromium ? (
                <div className="text-right">
                  <p className="text-xs font-medium text-text-primary mb-1">Esperando al navegador...</p>
                  <p className="text-[11px] text-text-secondary max-w-[180px]">
                    Si no aparece el botón, puedes instalar desde el menú de Chrome/Edge (ícono de instalar en la barra de búsqueda).
                  </p>
                </div>
              ) : (
                <div className="text-right">
                  <span className="text-sm text-text-secondary italic">
                    Instalación no compatible en este navegador
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface/30 p-4 border-t border-border flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-text-secondary overflow-hidden">
               <div className="flex items-center gap-1.5" title="Escritorio">
                  <Laptop className="w-3.5 h-3.5" />
                  Escritorio
               </div>
               <div className="flex items-center gap-1.5" title="Móvil">
                  <Smartphone className="w-3.5 h-3.5" />
                  Móvil
               </div>
            </div>
            
            {!isInstalled && (
              <p className="text-[11px] text-text-secondary/80">
                Funciona en Chrome, Safari, Edge y navegadores modernos.
              </p>
            )}
          </div>
        </section>

        {/* Other Settings Placeholder */}
        <section className="card p-6 bg-white dark:bg-surface shadow-sm border-dashed border-2 opacity-70">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-400">
                <Settings className="w-6 h-6" />
             </div>
             <div>
                <h3 className="font-medium text-text-primary">Opciones del Sistema</h3>
                <p className="text-sm text-text-secondary">Más configuraciones de la cuenta y el negocio estarán disponibles pronto.</p>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}

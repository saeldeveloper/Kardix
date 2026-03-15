"use client";

import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Settings, Download, Smartphone, Laptop, CheckCircle2, Share, Moon, Sun, Palette, Check } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAccent, ACCENT_COLORS } from "@/components/accent-provider";

export default function SettingsPage() {
  const { isInstallable, isInstalled, isIOS, isChromium, handleInstallClick } = usePWAInstall();
  const { color, setColor } = useAccent();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">Configuración</h1>
        <p className="text-text-secondary">
          Gestiona las preferencias de tu aplicación y la configuración de instalación.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Personalización Section */}
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

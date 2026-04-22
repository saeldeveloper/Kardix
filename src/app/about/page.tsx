"use client";

import LandingPage from "@/components/LandingPage/LandingPage";
import { ShoppingBag, BarChart3, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AboutPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      {/* Navbar */}
      <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border py-4" : "bg-transparent py-6"}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <ShoppingBag className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-text-primary">Kardix</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Volver al Inicio
            </Link>
            <Link href="/login" className="btn-primary shadow-lg shadow-primary/25">
              Ir al Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        <section className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-20 animate-in fade-in slide-in-from-bottom-4">
            <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-4 block">Nuestra Startup</span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-text-primary to-text-secondary">
              Innovación en <br />
              <span className="text-primary">Gestión de Inventarios</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
              Kardix nació de la necesidad de simplificar lo complejo. En un mundo donde el tiempo es el recurso más valioso, 
              nuestra misión es devolverle ese tiempo a los dueños de negocios mediante automatización e inteligencia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-24 animate-in fade-in slide-in-from-bottom-4 delay-200">
            <div className="card p-10 bg-surface/50 backdrop-blur-sm border-primary/10">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold mb-6">Misión</h2>
              <p className="text-lg text-text-secondary leading-relaxed">
                Empoderar a las empresas con herramientas tecnológicas que antes solo estaban al alcance de grandes corporaciones. 
                Buscamos democratizar la eficiencia operativa a través de una interfaz que cualquiera pueda dominar en minutos.
              </p>
            </div>

            <div className="card p-10 bg-surface/50 backdrop-blur-sm border-blue-500/10">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-8">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold mb-6">Visión</h2>
              <p className="text-lg text-text-secondary leading-relaxed">
                Ser la plataforma líder en el ecosistema comercial digital, donde cada transacción e inventario se gestione con 
                precisión absoluta, permitiendo a los negocios escalar sin fricciones tecnológicas.
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 delay-300">
            <h2 className="text-4xl font-bold mb-12 text-center">Nuestros Valores</h2>
            <div className="grid sm:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="text-3xl mb-4">✨</div>
                <h3 className="text-xl font-bold mb-2">Simplicidad</h3>
                <p className="text-text-secondary">Menos es más. Diseñamos para la claridad y la facilidad de uso.</p>
              </div>
              <div className="p-6">
                <div className="text-3xl mb-4">🚀</div>
                <h3 className="text-xl font-bold mb-2">Innovación</h3>
                <p className="text-text-secondary">Buscamos constantemente mejores formas de resolver problemas antiguos.</p>
              </div>
              <div className="p-6">
                <div className="text-3xl mb-4">🤝</div>
                <h3 className="text-xl font-bold mb-2">Compromiso</h3>
                <p className="text-text-secondary">El éxito de nuestros usuarios es nuestra prioridad número uno.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-surface/50 mt-auto">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ShoppingBag className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">Kardix</span>
          </div>
          <p className="text-text-secondary text-sm">© {new Date().getFullYear()} Kardix. Hecho con pasión por el control.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-text-secondary hover:text-primary transition-colors">Inicio</Link>
            <a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Privacidad</a>
            <a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Términos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

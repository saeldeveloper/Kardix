"use client";

import { ShoppingBag, BarChart3, AlertCircle, LayoutDashboard, Smartphone, CheckCircle2, ArrowLeft, Users, Target, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
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
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <ShoppingBag className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-text-primary">Kardix</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Características</a>
            <a href="#about" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Nosotros</a>
            <a href="#pwa" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Instalación</a>
            <Link href="/login" className="btn-primary shadow-lg shadow-primary/25">
              Ir al Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full -z-10 opacity-30 blur-[120px] pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full" />
        </div>

        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16 animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-text-primary to-text-secondary">
              Gestión de inventario <br />
              <span className="text-primary">elevada a otro nivel</span>
            </h1>
            <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
              Kardix es la plataforma moderna diseñada para optimizar tu flujo de trabajo, 
              controlar tus existencias y potenciar tus ventas con elegancia y precisión.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
                Empezar ahora
              </Link>
              <a href="#demo" className="btn-outline text-lg px-8 py-4 w-full sm:w-auto flex items-center justify-center gap-2">
                Ver Demo
              </a>
            </div>
          </div>

          {/* Video Mockup */}
          <div id="demo" className="relative max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 delay-200">
            <div className="relative rounded-2xl border border-border bg-surface/50 backdrop-blur-sm p-2 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <video 
                className="w-full rounded-xl shadow-inner border border-border/50"
                autoPlay 
                muted 
                loop 
                playsInline
                preload="metadata"
              >
                <source src="/564998474-74dfd0ad-af4c-48e2-baaa-fd53e2b6c7c0.mp4" type="video/mp4" />
                Tu navegador no soporta el tag de video.
              </video>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 md:-top-12 md:-right-12 p-6 bg-surface border border-border rounded-2xl shadow-xl hidden md:block animate-bounce duration-[3000ms]">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success-bg flex items-center justify-center">
                    <CheckCircle2 className="text-success-text w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary font-medium">Venta Registrada</p>
                    <p className="text-sm font-bold">Q 13.75</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-surface/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Todo lo que necesitas</h2>
            <p className="text-text-secondary text-lg">Diseñado para ser intuitivo, rápido y eficiente.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<LayoutDashboard className="w-6 h-6" />}
              title="Panel Inteligente"
              description="Vigila el estado de tu negocio en tiempo real con métricas clave de productos y ventas."
            />
            <FeatureCard 
              icon={<ShoppingBag className="w-6 h-6" />}
              title="Gestión de Productos"
              description="Administra stock, precios y categorías con una interfaz fluida y visual."
            />
            <FeatureCard 
              icon={<AlertCircle className="w-6 h-6" />}
              title="Alertas de Stock"
              description="Nunca te quedes sin suministros. Recibe avisos automáticos cuando el stock esté bajo."
            />
            <FeatureCard 
              icon={<CheckCircle2 className="w-6 h-6" />}
              title="Punto de Venta"
              description="Registra transacciones al instante con un buscador de productos ultrarrápido."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-6 h-6" />}
              title="Reportes Detallados"
              description="Analiza tu rendimiento diario y mensual con gráficos y tablas automáticas."
            />
            <FeatureCard 
              icon={<Smartphone className="w-6 h-6" />}
              title="Experiencia Mobile"
              description="Totalmente adaptado para dispositivos móviles, tablets y computadoras."
            />
          </div>
        </div>
      </section>

      {/* PWA Section */}
      <section id="pwa" className="py-24 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="bg-primary rounded-[32px] p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 -skew-x-12 translate-x-1/2" />
            
            <div className="flex-1 text-white relative z-10">
              <span className="inline-block px-4 py-1 rounded-full bg-white/20 text-sm font-medium mb-6 backdrop-blur-sm">Instalable como App</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Lleva Kardix a donde quieras</h2>
              <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
                Instala Kardix en tu dispositivo directamente desde tu navegador para usarlo sin barras de navegación, con acceso directo y mejor rendimiento. 
                Kardix funciona exclusivamente en el navegador, aprovechando lo último en tecnología web.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Acceso Directo</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Modo Pantalla Completa</span>
                </div>
              </div>
            </div>

            <div className="flex-1 relative z-10 w-full max-w-sm animate-in fade-in slide-in-from-bottom-4">
                <div className="relative bg-surface rounded-[40px] p-6 shadow-2xl border-8 border-background/20 aspect-[9/19] overflow-hidden">
                  <div className="absolute inset-0">
                    <img src="/kardix.vercel.app_reports(iPhone 12 Pro).png" alt="Kardix Mobile Reports" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-border/50 rounded-full z-10" />
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 bg-background relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
            <div className="flex-1 text-left">
              <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block animate-in fade-in">Sobre Nosotros</span>
              <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                Reinventando el <br />
                <span className="text-primary">control comercial</span>
              </h2>
              <p className="text-xl text-text-secondary leading-relaxed mb-8">
                Kardix no es solo software; es la culminación de años entendiendo los desafíos reales de los negocios modernos. 
                Nuestra pasión es transformar el caos del inventario en una ventaja competitiva estratégica para ti.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4 group">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1 group-hover:bg-primary group-hover:text-white transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-primary group-hover:text-white" />
                  </div>
                  <p className="text-lg text-text-secondary"><span className="font-bold text-text-primary">Empatía:</span> Diseñamos pensando en tus retos diarios y necesidades reales.</p>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1 group-hover:bg-primary group-hover:text-white transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-primary group-hover:text-white" />
                  </div>
                  <p className="text-lg text-text-secondary"><span className="font-bold text-text-primary">Excelencia:</span> Cada pixel y cada línea de código busca la perfección técnica.</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full max-w-2xl">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-surface border border-border rounded-[2rem] p-4 shadow-2xl overflow-hidden">
                  <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                    <video 
                      className="w-full h-full object-cover"
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                    >
                      <source src="/7287924-uhd_3840_2160_25fps.mp4" type="video/mp4" />
                      Tu navegador no soporta el tag de video.
                    </video>
                  </div>
                </div>
                {/* Floating Stats */}
                <div className="absolute -bottom-6 -left-6 bg-surface p-6 rounded-2xl shadow-xl border border-border animate-in fade-in slide-in-from-left-4 duration-700">
                  <p className="text-3xl font-bold text-primary">99.9%</p>
                  <p className="text-sm text-text-secondary font-medium">Uptime Garantizado</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard 
              icon={<Users className="w-8 h-8" />}
              title="Enfoque Humano"
              description="Nuestra tecnología se adapta a las personas, no al revés. Creamos interfaces que se sienten naturales desde el primer uso."
            />
            <ValueCard 
              icon={<Zap className="w-8 h-8" />}
              title="Velocidad Extrema"
              description="Optimizado para darte respuestas en milisegundos. Tu tiempo es el recurso más valioso de tu negocio."
            />
            <ValueCard 
              icon={<ShieldCheck className="w-8 h-8" />}
              title="Seguridad Total"
              description="Tus datos están protegidos con los estándares más altos de cifrado y respaldos automáticos constantes."
            />
          </div>

          <div className="mt-20 text-center">
            <Link href="/about" className="btn-outline px-10 py-4 text-lg inline-flex items-center gap-3 group transition-all hover:bg-primary hover:text-white hover:border-primary">
              Conoce nuestra historia completa 
              <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-surface/50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ShoppingBag className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">Kardix</span>
          </div>
          <p className="text-text-secondary text-sm">© {new Date().getFullYear()} Kardix. Hecho con pasión por el control.</p>
          <div className="flex items-center gap-6">
            <a href="#about" className="text-sm text-text-secondary hover:text-primary transition-colors">Nosotros</a>
            <a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Privacidad</a>
            <a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Términos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="card hover:shadow-xl hover:-translate-y-1 group duration-300">
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-text-secondary leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-[2rem] bg-surface/50 border border-border hover:border-primary/50 transition-all group">
      <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-text-secondary leading-relaxed text-lg">
        {description}
      </p>
    </div>
  );
}

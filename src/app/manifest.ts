import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TrakerApp - Gestión de Negocio",
    short_name: "TrakerApp",
    description: "Sistema eficiente para el control de inventario y ventas.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1A56DB",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      }
    ],
  };
}

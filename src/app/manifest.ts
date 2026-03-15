import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kardix - Gestión de Negocio",
    short_name: "Kardix",
    description: "Sistema eficiente para el control de inventario y ventas.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1A56DB",
    icons: [
      {
        src: "/icon.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      }
    ],
  };
}

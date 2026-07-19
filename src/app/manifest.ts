import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Matos TDF",
    short_name: "Matos TDF",
    description: "Inventaire du matériel pour le tour de France en live IRL",
    lang: "fr",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#171717",
    icons: [
      {
        src: "/icon.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}

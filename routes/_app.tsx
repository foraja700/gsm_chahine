import { AppProps } from "$fresh/server.ts";

export default function App({ Component }: AppProps) {
  return (
    <html lang="fr" class="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>GSM CHAHINE | Vente & Réparation Électronique au Maroc</title>
        <meta name="description" content="Catalogue officiel GSM Chahine. Smartphones, tablettes, écouteurs et accessoires au meilleur prix. Commandez rapidement sur WhatsApp." />
        
        {/* Tailwind CSS CDN fallback for rapid execution */}
        <script src="https://cdn.tailwindcss.com"></script>

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

        <style>{`
          body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: #030712;
            color: #f3f4f6;
          }
          /* Custom Scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          ::-webkit-scrollbar-track {
            background: #090d16;
          }
          ::-webkit-scrollbar-thumb {
            background: #1e293b;
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #003882;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </head>
      <body class="min-h-screen bg-[#030712] text-slate-100 flex flex-col antialiased">
        <Component />
      </body>
    </html>
  );
}

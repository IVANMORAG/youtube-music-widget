// api/index.js - Endpoint principal para Vercel
const fetch = require('node-fetch');

// Configuración
const YOUTUBE_API_KEY = 'AIzaSyAARR7nrde1tPrL4BOQlhb8S26XUiMCx_I';
const PLAYLIST_ID = 'PLlHhWhyPeWs7qJtNiUH3f8Z3oSO8CgiH-';

module.exports = async (req, res) => {
  try {
    // Obtener datos de la playlist
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!playlistResponse.ok) {
      throw new Error(`Error al obtener la playlist: ${playlistResponse.status}`);
    }
    
    const data = await playlistResponse.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('No se encontraron canciones en la playlist');
    }
    
    const track = data.items[0].snippet;
    const videoTitle = track.title;
    
    // Extraer título y artista
    let title = videoTitle;
    let artist = track.videoOwnerChannelTitle || 'Unknown Artist';
    
    // Intentar separar título y artista si el formato es "Título - Artista"
    if (videoTitle.includes(' - ')) {
      const parts = videoTitle.split(' - ');
      title = parts[0].trim();
      artist = parts[1].trim();
    }
    
    // Obtener thumbnail de la canción
    const thumbnail = track.thumbnails?.high?.url || 
                     track.thumbnails?.medium?.url || 
                     track.thumbnails?.default?.url;
    
    // Sanitizar texto para SVG (escapar caracteres especiales)
    const sanitizeForSvg = (text) => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };
    
    const safeTitle = sanitizeForSvg(title);
    const safeArtist = sanitizeForSvg(artist);
    
    // Generar SVG
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="130" viewBox="0 0 400 130">
  <style>
    @keyframes sound {
      0% { height: 5px; }
      50% { height: 25px; }
      100% { height: 5px; }
    }
    
    .bar {
      animation: sound 1.2s ease-in-out infinite;
      background-color: #FF0000;
      bottom: 1px;
      width: 4px;
      border-radius: 2px;
    }
    
    .bar1 { animation-delay: 0.1s; }
    .bar2 { animation-delay: 0.2s; }
    .bar3 { animation-delay: 0.3s; }
    .bar4 { animation-delay: 0.4s; }
    .bar5 { animation-delay: 0.5s; }
    
    .text {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
  </style>
  
  <rect width="400" height="130" rx="10" fill="#212121"/>
  
  <!-- Thumbnail -->
  <clipPath id="albumArtClip">
    <rect x="15" y="15" width="100" height="100" rx="5"/>
  </clipPath>
  <image href="${thumbnail}" x="15" y="15" width="100" height="100" clip-path="url(#albumArtClip)"/>
  
  <!-- Track info -->
  <text x="130" y="40" class="text" fill="#ffffff" font-size="16" font-weight="bold">${safeTitle}</text>
  <text x="130" y="65" class="text" fill="#aaaaaa" font-size="14">${safeArtist}</text>
  
  <!-- Sound bars -->
  <g transform="translate(130, 85)">
    <rect class="bar bar1" x="0" y="-25" height="25" />
    <rect class="bar bar2" x="7" y="-25" height="15" />
    <rect class="bar bar3" x="14" y="-25" height="25" />
    <rect class="bar bar4" x="21" y="-25" height="20" />
    <rect class="bar bar5" x="28" y="-25" height="15" />
  </g>
  
  <!-- Logo -->
  <text x="15" y="115" class="text" fill="#aaaaaa" font-size="12" font-weight="bold">YouTube Music</text>
</svg>
    `.trim();
    
    // Configurar cabeceras para la respuesta
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'max-age=30, s-maxage=60');
    res.status(200).send(svg);

  } catch (error) {
    console.error('Error:', error);
    
    // SVG de error (fallback)
    const errorSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="130" viewBox="0 0 400 130">
  <rect width="400" height="130" rx="10" fill="#212121"/>
  <text x="50%" y="50%" fill="#ffffff" text-anchor="middle" 
        font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif">
    ⚠️ Error cargando música
  </text>
  <text x="50%" y="70%" fill="#aaaaaa" text-anchor="middle" 
        font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="12">
    ${error.message || 'Unknown error'}
  </text>
</svg>
    `.trim();
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(500).send(errorSvg);
  }
};
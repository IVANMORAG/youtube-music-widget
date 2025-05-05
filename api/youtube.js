const fetch = require('node-fetch');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const PLAYLIST_ID = 'PLlHhWhyPeWs7qJtNiUH3f8Z3oSO8CgiH-';

module.exports = async (req, res) => {
  try {
    if (!YOUTUBE_API_KEY) {
      throw new Error('YOUTUBE_API_KEY no configurada');
    }

    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`
    );

    if (!playlistResponse.ok) {
      throw new Error(`Error API YouTube: ${playlistResponse.status}`);
    }

    const data = await playlistResponse.json();
    if (!data.items || data.items.length === 0) {
      throw new Error('Playlist vacía');
    }

    const randomIndex = Math.floor(Math.random() * data.items.length);
    const track = data.items[randomIndex].snippet;

    const title = (track.title.split(' - ')[0] || 'Título Desconocido').replace(/[<>&"']/g, '');
    const artist = (track.title.split(' - ')[1] || track.videoOwnerChannelTitle || 'Artista Desconocido').replace(/[<>&"']/g, '');

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100">
        <style>
          .title { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            font-size: 14px; 
            font-weight: 600; 
            fill: #4A4A4A;
          }
          .artist { 
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 12px; 
            fill: #7D7D7D; 
          }
        </style>
        
        <!-- Fondo transparente (sin rectángulo de fondo) -->
        
        <!-- Texto centrado -->
        <text x="50%" y="30%" class="title" text-anchor="middle">${title}</text>
        <text x="50%" y="45%" class="artist" text-anchor="middle">${artist}</text>
        
        <!-- Barritas animadas centradas -->
        <g transform="translate(85, 55)">
          <rect width="4" height="30" fill="#FF6B6B" rx="2">
            <animate attributeName="height" values="30;10;30" dur="1s" repeatCount="indefinite" begin="0.1s"/>
          </rect>
          <rect x="12" width="4" height="30" fill="#4ECDC4" rx="2">
            <animate attributeName="height" values="30;15;30" dur="1s" repeatCount="indefinite" begin="0.3s"/>
          </rect>
          <rect x="24" width="4" height="30" fill="#45B7D1" rx="2">
            <animate attributeName="height" values="30;20;30" dur="1s" repeatCount="indefinite" begin="0.5s"/>
          </rect>
        </g>
        
        <!-- Pequeño texto de crédito -->
        <text x="50%" y="95%" font-size="8" fill="#AAA" text-anchor="middle" font-family="Arial">YouTube Music</text>
      </svg>
    `;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache, max-age=0');
    res.send(svg);
  } catch (error) {
    const errorSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100">
      <text x="50%" y="50%" fill="#FF6B6B" font-family="Arial" text-anchor="middle" font-size="10">${error.message}</text>
    </svg>`;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(errorSvg);
  }
};
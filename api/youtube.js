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
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="150" viewBox="0 0 300 150">
        <style>
          .title { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            font-size: 18px; 
            font-weight: 600; 
            fill: #FFFFFF;
            text-shadow: 0 0 8px rgba(255,255,255,0.7);
          }
          .artist { 
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 14px; 
            fill: #E0E0E0;
            text-shadow: 0 0 5px rgba(255,255,255,0.5);
          }
        </style>
        
        <!-- Texto con brillo -->
        <text x="50%" y="35%" class="title" text-anchor="middle">${title}</text>
        <text x="50%" y="50%" class="artist" text-anchor="middle">${artist}</text>
        
        <!-- Barritas moradas gigantes (90px de altura = 3x30px) -->
        <g transform="translate(120, 70)">
          <rect width="6" height="90" fill="#9C27B0" rx="3">
            <animate attributeName="height" values="90;30;90" dur="1s" repeatCount="indefinite" begin="0.1s"/>
          </rect>
          <rect x="15" width="6" height="90" fill="#7B1FA2" rx="3">
            <animate attributeName="height" values="90;45;90" dur="1s" repeatCount="indefinite" begin="0.3s"/>
          </rect>
          <rect x="30" width="6" height="90" fill="#6A1B9A" rx="3">
            <animate attributeName="height" values="90;60;90" dur="1s" repeatCount="indefinite" begin="0.5s"/>
          </rect>
        </g>
        
        <!-- Crédito casi invisible -->
        <text x="50%" y="97%" font-size="8" fill="#333" text-anchor="middle" font-family="Arial">YouTube Music</text>
      </svg>
    `;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache, max-age=0');
    res.send(svg);
  } catch (error) {
    const errorSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150">
      <text x="50%" y="50%" fill="#9C27B0" font-family="Arial" text-anchor="middle" font-size="12">${error.message}</text>
    </svg>`;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(errorSvg);
  }
};
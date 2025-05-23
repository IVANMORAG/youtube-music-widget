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
      <svg xmlns="http://www.w3.org/2000/svg" width="350" height="200" viewBox="0 0 350 200">
        <style>
          .title { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            font-size: 22px; 
            font-weight: 600; 
            fill: #FFFFFF;
            text-shadow: 0 0 8px rgba(255,255,255,0.7);
          }
          .artist { 
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 16px; 
            fill: #E0E0E0;
            text-shadow: 0 0 5px rgba(255,255,255,0.5);
          }
        </style>
        
        <!-- Texto superior bien espaciado -->
        <text x="50%" y="30%" class="title" text-anchor="middle">${title}</text>
        <text x="50%" y="40%" class="artist" text-anchor="middle">${artist}</text>
        
        <!-- 10 barritas moradas compactas -->
        <g transform="translate(100, 90)">
          <!-- Generamos 10 barritas con animaciones alternadas -->
          ${Array.from({length: 10}).map((_, i) => `
            <rect 
              x="${i * 15}" 
              width="4" 
              height="45" 
              fill="#${['9C27B0','8E24AA','7B1FA2','6A1B9A','5C1A99','4A148C','3F0D7A','311B92','1A237E','0D0D61'][i]}" 
              rx="2"
            >
              <animate 
                attributeName="height" 
                values="45;${5 + (i * 4)};45" 
                dur="${0.8 + (i * 0.1)}s" 
                repeatCount="indefinite" 
                begin="${i * 0.1}s"
              />
            </rect>
          `).join('')}
        </g>
        
        <!-- Crédito casi invisible abajo -->
        <text x="50%" y="95%" font-size="9" fill="#444" text-anchor="middle" font-family="Arial">YouTube Music</text>
      </svg>
    `;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache, max-age=0');
    res.send(svg);
  } catch (error) {
    const errorSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="350" height="200">
      <text x="50%" y="50%" fill="#9C27B0" font-family="Arial" text-anchor="middle" font-size="14">${error.message}</text>
    </svg>`;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(errorSvg);
  }
};
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
    const videoId = track.resourceId?.videoId || 'dQw4w9WgXcQ'; // ID de respaldo

    const title = (track.title.split(' - ')[0] || 'Título Desconocido').replace(/[<>&"']/g, '');
    const artist = (track.title.split(' - ')[1] || track.videoOwnerChannelTitle || 'Artista Desconocido').replace(/[<>&"']/g, '');

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="340" height="180" viewBox="0 0 340 180">
        <style>
          .title { font-family: Arial; font-size: 16px; font-weight: bold; fill: #fff; }
          .artist { font-family: Arial; font-size: 14px; fill: #aaa; }
        </style>
        <rect width="340" height="180" rx="10" fill="#212121"/>
        <image href="https://img.youtube.com/vi/${videoId}/mqdefault.jpg" x="20" y="20" width="120" height="120"/>
        <text x="150" y="50" class="title">${title}</text>
        <text x="150" y="70" class="artist">${artist}</text>
        <text x="20" y="160" font-family="Arial" font-size="12" fill="#aaa">YouTube Music</text>
      </svg>
    `;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache, max-age=0');
    res.send(svg);
  } catch (error) {
    const errorSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="340" height="180">
      <rect width="100%" height="100%" fill="#212121"/>
      <text x="50%" y="50%" fill="white" font-family="Arial" text-anchor="middle">${error.message}</text>
    </svg>`;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(errorSvg);
  }
};
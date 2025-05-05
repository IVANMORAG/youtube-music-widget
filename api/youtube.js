const fetch = require('node-fetch');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyAARR7nrde1tPrL4BOQlhb8S26XUiMCx_I'; // Use env var for security
const PLAYLIST_ID = 'PLlHhWhyPeWs7qJtNiUH3f8Z3oSO8CgiH-';

module.exports = async (req, res) => {
  try {
    // Fetch playlist data
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`
    );

    if (!playlistResponse.ok) {
      throw new Error(`YouTube API error: ${playlistResponse.status} ${playlistResponse.statusText}`);
    }

    const data = await playlistResponse.json();
    if (!data.items || data.items.length === 0) {
      throw new Error('No items found in playlist');
    }

    const track = data.items[0].snippet;
    const thumbnail = track.thumbnails?.high?.url || track.thumbnails?.default?.url || 'https://via.placeholder.com/120'; // Fallback image
    const title = (track.title.split(' - ')[0] || 'Unknown Title').replace(/[<>&"']/g, ''); // Sanitize
    const artist = (track.title.split(' - ')[1] || track.videoOwnerChannelTitle || 'Unknown Artist').replace(/[<>&"']/g, '');

    // Generate SVG
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="340" height="180" viewBox="0 0 340 180">
        <style>
          .widget { font-family: Arial, sans-serif; }
          .title { font-size: 16px; font-weight: bold; fill: #fff; }
          .artist { font-size: 14px; fill: #aaa; }
          .logo { font-size: 12px; fill: #aaa; font-weight: bold; }
        </style>
        <rect width="340" height="180" rx="10" fill="#212121"/>
        <!-- Album art -->
        <image href="${thumbnail}" x="20" y="20" width="120" height="120" rx="5"/>
        <!-- Track info -->
        <text x="150" y="50" class="title">${title}</text>
        <text x="150" y="70" class="artist">${artist}</text>
        <!-- Sound bars -->
        <rect x="150" y="90" width="4" height="30" fill="#FF0000" rx="2">
          <animate attributeName="height" values="30;10;30" dur="1s" repeatCount="indefinite" begin="0.1s"/>
        </rect>
        <rect x="160" y="90" width="4" height="30" fill="#FF0000" rx="2">
          <animate attributeName="height" values="30;15;30" dur="1s" repeatCount="indefinite" begin="0.3s"/>
        </rect>
        <rect x="170" y="90" width="4" height="30" fill="#FF0000" rx="2">
          <animate attributeName="height" values="30;20;30" dur="1s" repeatCount="indefinite" begin="0.5s"/>
        </rect>
        <!-- YouTube Music logo -->
        <text x="20" y="160" class="logo">YouTube Music</text>
      </svg>
    `;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).send(svg);
  } catch (error) {
    console.error('Error:', error.message);
    const errorSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="340" height="180">
        <rect width="340" height="180" fill="#212121"/>
        <text x="50%" y="50%" fill="white" text-anchor="middle">Error: ${error.message}</text>
      </svg>
    `;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(500).send(errorSvg);
  }
};
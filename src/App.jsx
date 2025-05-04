import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';
import './App.css';

const App = () => {
  const [playlist, setPlaylist] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const YOUTUBE_API_KEY = 'AIzaSyAARR7nrde1tPrL4BOQlhb8S26XUiMCx_I';
  const PLAYLIST_ID = 'PLlHhWhyPeWs7qJtNiUH3f8Z3oSO8CgiH-';

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`
        );
        setPlaylist(response.data.items);
      } catch (error) {
        console.error('Error fetching playlist:', error);
      }
    };

    fetchPlaylist();
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying && playlist) {
      interval = setInterval(() => {
        setCurrentTrack((prev) => (prev + 1) % playlist.length);
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playlist]);

  if (!playlist) {
    return <div className="loading">Loading playlist...</div>;
  }

  const track = playlist[currentTrack].snippet;
  const thumbnail = track.thumbnails?.high?.url || track.thumbnails?.default?.url;
  const title = track.title.split(' - ')[0];
  const artist = track.title.split(' - ')[1] || track.videoOwnerChannelTitle;

  return (
    <div className="widget">
      <div className="album-art">
        <img src={thumbnail} alt={title} />
      </div>
      <div className="track-info">
        <h3>{title}</h3>
        <p>{artist}</p>
      </div>
      <div className="player-controls">
        <button onClick={() => setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length)}>
          <FaStepBackward />
        </button>
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button onClick={() => setCurrentTrack((prev) => (prev + 1) % playlist.length)}>
          <FaStepForward />
        </button>
      </div>
      <div className="sound-bars">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`bar bar-${i + 1} ${isPlaying ? 'animate' : ''}`}></div>
        ))}
      </div>
      <div className="youtube-logo">
        <span>YouTube Music</span>
      </div>
    </div>
  );
};

export default App;

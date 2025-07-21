import React, { useState, useRef } from 'react';
import './MusicPlayer.css';
import QueueDisplay from './components/QueueDisplay';

const tracks = [
  {
    id: 1,
    title: 'Anti-Hero',
    artist: 'Taylor Swift',
    album: 'Midnights',
    duration: 200, // in seconds
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    albumArt: 'https://picsum.photos/seed/track1/300',
    year: 2022,
    genre: 'Pop',
  },
  {
    id: 2,
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 203,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    albumArt: 'https://picsum.photos/seed/track2/300',
    year: 2020,
    genre: 'Pop/R&B',
  },
  {
    id: 3,
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    duration: 234,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    albumArt: 'https://picsum.photos/seed/track3/300',
    year: 2017,
    genre: 'Pop',
  },
  {
    id: 4,
    title: 'Dance The Night',
    artist: 'Dua Lipa',
    album: 'Barbie The Album',
    duration: 176,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    albumArt: 'https://picsum.photos/seed/track4/300',
    year: 2023,
    genre: 'Pop/Dance',
  },
  {
    id: 5,
    title: 'Karma',
    artist: 'Taylor Swift',
    album: 'Midnights',
    duration: 205,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    albumArt: 'https://picsum.photos/seed/track5/300',
    year: 2022,
    genre: 'Pop',
  }
];

function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: no repeat, 1: repeat all, 2: repeat one
  const [showQueue, setShowQueue] = useState(false);
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  const playPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    setIsPlaying(false);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(false);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e) => {
    const progressBar = progressRef.current;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => (prev + 1) % 3);
  };

  const toggleQueue = () => {
    setShowQueue(!showQueue);
  };

  const handleTrackEnd = () => {
    if (repeatMode === 2) {
      // Repeat one
      audioRef.current.play();
    } else if (repeatMode === 1) {
      // Repeat all
      nextTrack();
    } else if (isShuffled) {
      // Shuffle
      const nextIndex = Math.floor(Math.random() * tracks.length);
      setCurrentTrack(nextIndex);
      setIsPlaying(true);
    } else {
      // Normal next
      nextTrack();
    }
  };

  return (
    <div className="music-player">
      <div className="music-player-left">
        <div className="track-info">
          <img src={tracks[currentTrack].albumArt} alt="Album cover" />
          <div className="track-details">
            <h4>{tracks[currentTrack].title}</h4>
            <div className="track-metadata">
              <span className="artist">{tracks[currentTrack].artist}</span>
              <span className="bullet">•</span>
              <span className="album">{tracks[currentTrack].album}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="music-player-center">
        <div className="controls">
          <button 
            onClick={toggleShuffle} 
            title="Shuffle" 
            className={isShuffled ? 'active' : ''}
          >
            <i className="fas fa-random"></i>
          </button>
          <button onClick={prevTrack} title="Previous">
            <i className="fas fa-step-backward"></i>
          </button>
          <button className="play-pause" onClick={playPause} title={isPlaying ? "Pause" : "Play"}>
            <i className={`fas ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
          </button>
          <button onClick={nextTrack} title="Next">
            <i className="fas fa-step-forward"></i>
          </button>
          <button 
            onClick={toggleRepeat} 
            title={repeatMode === 0 ? "Enable repeat" : repeatMode === 1 ? "Enable repeat one" : "Disable repeat"}
            className={repeatMode > 0 ? 'active' : ''}
          >
            <i className={`fas ${repeatMode === 2 ? "fa-repeat-1" : "fa-redo"}`}></i>
          </button>
        </div>
        
        <div className="progress-container">
          <span>{formatTime(currentTime)}</span>
          <div 
            className="progress-bar" 
            ref={progressRef}
            onClick={handleProgressClick}
          >
            <div 
              className="progress" 
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="music-player-right">
        <button 
          onClick={toggleQueue} 
          className={`queue-button ${showQueue ? 'active' : ''}`}
          title="Queue"
        >
          <i className="fas fa-list"></i>
        </button>
        <div className="volume-controls">
          <button title="Volume">
            <i className="fas fa-volume-up"></i>
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>

      {showQueue && (
        <QueueDisplay
          tracks={tracks}
          currentTrack={currentTrack}
          onTrackSelect={(index) => {
            setCurrentTrack(index);
            setIsPlaying(true);
          }}
        />
      )}

      <audio
        ref={audioRef}
        src={tracks[currentTrack].src}
        onEnded={handleTrackEnd}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
    </div>
  );
}

export default MusicPlayer;

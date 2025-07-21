import React from 'react';
import './QueueDisplay.css';

function QueueDisplay({ tracks, currentTrack, onTrackSelect }) {
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="queue-display">
      <div className="queue-header">
        <h3>Queue</h3>
        <span>Now Playing</span>
      </div>
      
      <div className="queue-list">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className={`queue-item ${index === currentTrack ? 'active' : ''}`}
            onClick={() => onTrackSelect(index)}
          >
            <div className="queue-item-left">
              <img src={track.albumArt} alt={track.title} />
              <div className="queue-item-info">
                <span className="track-title">{track.title}</span>
                <div className="track-details">
                  <span className="track-artist">{track.artist}</span>
                  <span className="track-album">{track.album}</span>
                </div>
              </div>
            </div>
            <div className="queue-item-right">
              <span className="track-genre">{track.genre}</span>
              <span className="track-duration">{formatDuration(track.duration)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QueueDisplay;

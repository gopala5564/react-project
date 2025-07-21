import React from 'react';
import './Sidebar.css';

const playlists = [
  { id: 1, name: 'My Playlist #1' },
  { id: 2, name: 'Discover Weekly' },
  { id: 3, name: 'Release Radar' },
  { id: 4, name: 'Liked Songs' },
];

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h1>Spotify</h1>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li className="active">
            <i className="fas fa-home"></i>
            Home
          </li>
          <li>
            <i className="fas fa-search"></i>
            Search
          </li>
          <li>
            <i className="fas fa-book"></i>
            Your Library
          </li>
        </ul>
      </nav>

      <div className="sidebar-playlists">
        <h2>PLAYLISTS</h2>
        <ul>
          {playlists.map(playlist => (
            <li key={playlist.id}>{playlist.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;

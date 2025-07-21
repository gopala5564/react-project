import React, { useState, useRef, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Mock suggestions based on search term
  const getSuggestions = (term) => {
    const suggestions = {
      artists: [
        { name: 'Taylor Swift', type: 'Artist', image: 'https://i.pravatar.cc/200?img=1' },
        { name: 'The Weeknd', type: 'Artist', image: 'https://i.pravatar.cc/200?img=5' },
        { name: 'Ed Sheeran', type: 'Artist', image: 'https://i.pravatar.cc/200?img=2' }
      ],
      songs: [
        { name: 'Anti-Hero', artist: 'Taylor Swift', type: 'Song' },
        { name: 'Blinding Lights', artist: 'The Weeknd', type: 'Song' },
        { name: 'Shape of You', artist: 'Ed Sheeran', type: 'Song' }
      ],
      playlists: [
        { name: 'Today\'s Top Hits', type: 'Playlist' },
        { name: 'RapCaviar', type: 'Playlist' },
        { name: 'All Out 2010s', type: 'Playlist' }
      ]
    };

    if (!term) return suggestions;

    const filter = (items) => 
      items.filter(item => 
        item.name.toLowerCase().includes(term.toLowerCase()) ||
        (item.artist && item.artist.toLowerCase().includes(term.toLowerCase()))
      );

    return {
      artists: filter(suggestions.artists),
      songs: filter(suggestions.songs),
      playlists: filter(suggestions.playlists)
    };
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = getSuggestions(searchTerm);

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-bar">
        <i className="fas fa-search search-icon"></i>
        <input
          type="text"
          placeholder="What do you want to listen to?"
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => setShowSuggestions(true)}
        />
        {searchTerm && (
          <button className="clear-button" onClick={() => setSearchTerm('')}>
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      {showSuggestions && (
        <div className="search-suggestions">
          {/* Recent Searches - show only if no search term */}
          {!searchTerm && (
            <div className="suggestion-section">
              <h3>Recent Searches</h3>
              <div className="recent-searches">
                <div className="recent-item">
                  <i className="fas fa-history"></i>
                  <span>Taylor Swift - Anti-Hero</span>
                </div>
                <div className="recent-item">
                  <i className="fas fa-history"></i>
                  <span>Today's Top Hits</span>
                </div>
              </div>
            </div>
          )}

          {/* Artists */}
          {suggestions.artists.length > 0 && (
            <div className="suggestion-section">
              <h3>Artists</h3>
              {suggestions.artists.map((artist, index) => (
                <div className="suggestion-item" key={`artist-${index}`}>
                  <img src={artist.image} alt={artist.name} />
                  <div className="suggestion-info">
                    <span className="name">{artist.name}</span>
                    <span className="type">{artist.type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Songs */}
          {suggestions.songs.length > 0 && (
            <div className="suggestion-section">
              <h3>Songs</h3>
              {suggestions.songs.map((song, index) => (
                <div className="suggestion-item" key={`song-${index}`}>
                  <i className="fas fa-music suggestion-icon"></i>
                  <div className="suggestion-info">
                    <span className="name">{song.name}</span>
                    <span className="type">Song • {song.artist}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Playlists */}
          {suggestions.playlists.length > 0 && (
            <div className="suggestion-section">
              <h3>Playlists</h3>
              {suggestions.playlists.map((playlist, index) => (
                <div className="suggestion-item" key={`playlist-${index}`}>
                  <i className="fas fa-list suggestion-icon"></i>
                  <div className="suggestion-info">
                    <span className="name">{playlist.name}</span>
                    <span className="type">{playlist.type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

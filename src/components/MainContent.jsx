import React from 'react';
import './MainContent.css';
import SearchBar from './SearchBar';

const artists = [
  {
    id: 1,
    name: 'Taylor Swift',
    imageUrl: 'https://i.pravatar.cc/200?img=1',
    type: 'Artist',
    genre: 'Pop'
  },
  {
    id: 2,
    name: 'Ed Sheeran',
    imageUrl: 'https://i.pravatar.cc/200?img=2',
    type: 'Artist',
    genre: 'Pop/Folk'
  },
  {
    id: 3,
    name: 'Drake',
    imageUrl: 'https://i.pravatar.cc/200?img=3',
    type: 'Artist',
    genre: 'Hip-Hop'
  },
  {
    id: 4,
    name: 'Dua Lipa',
    imageUrl: 'https://i.pravatar.cc/200?img=4',
    type: 'Artist',
    genre: 'Pop'
  },
  {
    id: 5,
    name: 'The Weeknd',
    imageUrl: 'https://i.pravatar.cc/200?img=5',
    type: 'Artist',
    genre: 'R&B/Pop'
  },
  {
    id: 6,
    name: 'Billie Eilish',
    imageUrl: 'https://i.pravatar.cc/200?img=6',
    type: 'Artist',
    genre: 'Pop/Alternative'
  }
];

const featuredPlaylists = [
  {
    id: 1,
    name: 'Today\'s Top Hits',
    description: 'The biggest hits right now',
    imageUrl: 'https://picsum.photos/seed/playlist1/200',
    songs: ['Anti-Hero', 'Cruel Summer', 'Vampire']
  },
  {
    id: 2,
    name: 'Discover Weekly',
    description: 'Your weekly mix of fresh music',
    imageUrl: 'https://picsum.photos/seed/playlist2/200',
    songs: ['Shape of You', 'Dance The Night', 'Blinding Lights']
  },
  {
    id: 3,
    name: 'Chill Hits',
    description: 'Kick back to the best new and recent chill hits',
    imageUrl: 'https://picsum.photos/seed/playlist3/200',
    songs: ['What Was I Made For?', 'Flowers', 'Say Yes To Heaven']
  },
  {
    id: 4,
    name: 'RapCaviar',
    description: 'Hip-hop\'s heavy hitters and rising stars',
    imageUrl: 'https://picsum.photos/seed/playlist4/200',
    songs: ['Last Night', 'Karma', 'Rich Flex']
  },
  {
    id: 5,
    name: 'Hot Hits',
    description: 'The hottest tracks in your region',
    imageUrl: 'https://picsum.photos/seed/playlist5/200',
    songs: ['Barbie World', 'Vampire', 'Last Night']
  },
  {
    id: 6,
    name: 'All Out 2010s',
    description: 'The biggest songs of the 2010s',
    imageUrl: 'https://picsum.photos/seed/playlist6/200',
    songs: ['Someone Like You', 'Uptown Funk', 'Shape of You']
  }
];

function MainContent() {
  return (
    <div className="main-content">
      <header className="main-header">
        <SearchBar />
      </header>

      <section className="featured-artists">
        <h2>Popular Artists</h2>
        <div className="grid-container">
          {artists.map(artist => (
            <div key={artist.id} className="grid-item">
              <img src={artist.imageUrl} alt={artist.name} />
              <h3>{artist.name}</h3>
              <p className="artist-type">{artist.type}</p>
              <p className="artist-genre">{artist.genre}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="featured-playlists">
        <h2>Featured Playlists</h2>
        <div className="grid-container">
          {featuredPlaylists.map(playlist => (
            <div key={playlist.id} className="grid-item">
              <img src={playlist.imageUrl} alt={playlist.name} />
              <h3>{playlist.name}</h3>
              <p className="playlist-description">{playlist.description}</p>
              <div className="playlist-songs">
                <p className="songs-preview">{playlist.songs.join(' • ')}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default MainContent;

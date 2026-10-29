import { useEffect, useState } from 'react'

const getValidAccessToken = () => {
  const accessToken = localStorage.getItem('spotify_access_token')
  const expiresInSeconds = parseInt(localStorage.getItem('spotify_token_expires_in') || '0', 10)
  const receivedAtMs = parseInt(localStorage.getItem('spotify_token_received_at') || '0', 10)
  if (!accessToken || !expiresInSeconds || !receivedAtMs) return null
  const safetyWindowSeconds = 60
  const expiryMs = receivedAtMs + (expiresInSeconds - safetyWindowSeconds) * 1000
  if (Date.now() >= expiryMs) return null
  return accessToken
}

const TopArtists = () => {
  const [artists, setArtists] = useState([])
  const [error, setError] = useState('')
  const [timeRange, setTimeRange] = useState('medium_term')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check authentication status on mount and when localStorage changes
  useEffect(() => {
    const token = getValidAccessToken()
    setIsLoggedIn(!!token)
  }, [])

  // Listen for storage changes (logout events)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = getValidAccessToken()
      setIsLoggedIn(!!token)
    }

    // Listen for storage events (when logout clears localStorage)
    window.addEventListener('storage', handleStorageChange)
    
    // Also check periodically in case storage event doesn't fire
    const interval = setInterval(handleStorageChange, 1000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const token = getValidAccessToken()
    if (!token) {
      setError('')
      setArtists([])
      return
    }

    setError('')
    setArtists([])

    fetch(`https://api.spotify.com/v1/me/top/artists?limit=10&time_range=${timeRange}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || 'Failed to load top artists')
        }
        return res.json()
      })
      .then((data) => {
        setArtists(Array.isArray(data?.items) ? data.items : [])
      })
      .catch((e) => setError(typeof e?.message === 'string' ? e.message : 'Unknown error'))
  }, [timeRange, isLoggedIn])

  // Check if user is logged in
  if (!isLoggedIn) {
    return (
      <div>
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          Please log in with Spotify to see your top artists.
        </p>
      </div>
    )
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div className="top-artists">
      <div className="artists-controls">
        <label htmlFor="artists-range" className="range-label">Time Range</label>
        <select
          id="artists-range"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="range-select"
        >
          <option value="short_term">Last 4 weeks</option>
          <option value="medium_term">Last 6 months</option>
          <option value="long_term">All time</option>
        </select>
      </div>
      {!artists.length ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your top artists...</p>
        </div>
      ) : (
        <div className="artists-list">
          {artists.map((artist, index) => (
            <div key={artist.id} className="artist-item">
              <div className="artist-rank">#{index + 1}</div>
              <div className="artist-image">
                {artist.images?.[0]?.url ? (
                  <img 
                    src={artist.images[0].url} 
                    alt={artist.name}
                    className="artist-avatar"
                  />
                ) : (
                  <div className="artist-avatar-placeholder">
                    {artist.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="artist-info">
                <div className="artist-name">{artist.name}</div>
                <div className="artist-genres">
                  {artist.genres?.slice(0, 2).join(', ') || 'Various genres'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TopArtists



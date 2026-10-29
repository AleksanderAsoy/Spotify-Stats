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

const TopTracks = () => {
  const [tracks, setTracks] = useState([])
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
      setTracks([])
      return
    }

    setError('')
    setTracks([])

    fetch(`https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=${timeRange}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || 'Failed to load top tracks')
        }
        return res.json()
      })
      .then((data) => {
        setTracks(Array.isArray(data?.items) ? data.items : [])
      })
      .catch((e) => setError(typeof e?.message === 'string' ? e.message : 'Unknown error'))
  }, [timeRange, isLoggedIn])

  // Check if user is logged in
  if (!isLoggedIn) {
    return (
      <div>
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          Please log in with Spotify to see your top tracks.
        </p>
      </div>
    )
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div className="top-tracks">
      <div className="tracks-controls">
        <label htmlFor="tracks-range" className="range-label">Time Range</label>
        <select
          id="tracks-range"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="range-select"
        >
          <option value="short_term">Last 4 weeks</option>
          <option value="medium_term">Last 6 months</option>
          <option value="long_term">All time</option>
        </select>
      </div>
      {!tracks.length ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your top tracks...</p>
        </div>
      ) : (
        <div className="tracks-list">
          {tracks.map((track, index) => (
            <div key={track.id} className="track-item">
              <div className="track-rank">#{index + 1}</div>
              <div className="track-image">
                {track.album?.images?.[0]?.url ? (
                  <img 
                    src={track.album.images[0].url} 
                    alt={track.album.name}
                    className="track-cover"
                  />
                ) : (
                  <div className="track-cover-placeholder">
                    🎵
                  </div>
                )}
              </div>
              <div className="track-info">
                <div className="track-name">{track.name}</div>
                <div className="track-artist">
                  {track.artists?.map((a) => a.name).join(', ')}
                </div>
                <div className="track-album">{track.album?.name}</div>
              </div>
              <div className="track-duration">
                {Math.floor(track.duration_ms / 60000)}:{(Math.floor(track.duration_ms / 1000) % 60).toString().padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TopTracks



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

const RecentlyPlayed = () => {
  const [recentlyPlayed, setRecentlyPlayed] = useState([])
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null)
  const [error, setError] = useState('')
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


  // Fetch recently played tracks and currently playing (with real-time updates)
  useEffect(() => {
    const fetchRecentlyPlayed = async () => {
      const token = getValidAccessToken()
      if (!token) {
        setRecentlyPlayed([])
        setCurrentlyPlaying(null)
        return
      }

      try {
        // Fetch recently played tracks
        const recentResponse = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=12', {
          headers: { Authorization: `Bearer ${token}` }
        })

        console.log('Recently played response status:', recentResponse.status)
        
        if (recentResponse.ok) {
          const recentData = await recentResponse.json()
          console.log('Recently played data:', recentData)
          setRecentlyPlayed(recentData.items || [])
        } else {
          const errorText = await recentResponse.text()
          console.error('Recently played error:', recentResponse.status, errorText)
        }

        // Also fetch currently playing to show it at the top
        const currentlyPlayingResponse = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (currentlyPlayingResponse.ok) {
          const currentlyPlayingData = await currentlyPlayingResponse.json()
          if (currentlyPlayingData.item) {
            setCurrentlyPlaying(currentlyPlayingData.item)
          } else {
            setCurrentlyPlaying(null)
          }
        }
      } catch (e) {
        console.error('Failed to load recently played:', e)
      }
    }

    if (isLoggedIn) {
      // Fetch immediately
      fetchRecentlyPlayed()
      
      // Then update every 15 seconds to catch new listening activity faster
      const interval = setInterval(fetchRecentlyPlayed, 15000)
      
      return () => clearInterval(interval)
    }
  }, [isLoggedIn])

  // Check if user is logged in
  if (!isLoggedIn) {
    return (
      <div>
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          Please log in with Spotify to see your recently played tracks.
        </p>
      </div>
    )
  }

  if (error) {
    return <p>{error}</p>
  }

  if (!recentlyPlayed.length && !currentlyPlaying) {
    return <p>Loading your recently played tracks...</p>
  }

  return (
    <div className="recently-played-component">
      <div className="recently-played-list">
        {/* Show currently playing track at the top if it exists */}
        {currentlyPlaying && (
          <div className="recent-track currently-playing-track">
            <div className="recent-track-image">
              {currentlyPlaying.album?.images?.[0]?.url ? (
                <img 
                  src={currentlyPlaying.album.images[0].url} 
                  alt={currentlyPlaying.album.name}
                  className="recent-track-cover"
                />
              ) : (
                <div className="recent-track-placeholder">🎵</div>
              )}
            </div>
            <div className="recent-track-info">
              <div className="recent-track-name">{currentlyPlaying.name}</div>
              <div className="recent-track-artist">
                {currentlyPlaying.artists?.map(a => a.name).join(', ')}
              </div>
            </div>
            <div className="recent-track-time">
              <span className="now-playing"> Now</span>
            </div>
          </div>
        )}
        
        {/* Show recently played tracks */}
        {recentlyPlayed.map((item, index) => (
          <div key={`${item.track.id}-${item.played_at}`} className="recent-track">
            <div className="recent-track-image">
              {item.track.album?.images?.[0]?.url ? (
                <img 
                  src={item.track.album.images[0].url} 
                  alt={item.track.album.name}
                  className="recent-track-cover"
                />
              ) : (
                <div className="recent-track-placeholder">🎵</div>
              )}
            </div>
            <div className="recent-track-info">
              <div className="recent-track-name">{item.track.name}</div>
              <div className="recent-track-artist">
                {item.track.artists?.map(a => a.name).join(', ')}
              </div>
            </div>
            <div className="recent-track-time">
              {new Date(item.played_at).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentlyPlayed

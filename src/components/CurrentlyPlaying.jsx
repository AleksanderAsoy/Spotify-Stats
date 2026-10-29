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

const formatTime = (ms) => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const CurrentlyPlaying = () => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null)
  const [playbackState, setPlaybackState] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [currentProgress, setCurrentProgress] = useState(0)

  const fetchCurrentlyPlaying = async () => {
    const token = getValidAccessToken()
    if (!token) {
      setError('')
      setCurrentlyPlaying(null)
      setPlaybackState(null)
      setCurrentProgress(0)
      setIsLoading(false)
      return
    }

    try {
      setError('')
      
      // Fetch currently playing track
      const currentlyPlayingResponse = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (currentlyPlayingResponse.status === 204) {
        // No content - nothing is currently playing
        setCurrentlyPlaying(null)
        setPlaybackState(null)
        setIsLoading(false)
        return
      }

      if (!currentlyPlayingResponse.ok) {
        throw new Error('Failed to fetch currently playing')
      }

      const currentlyPlayingData = await currentlyPlayingResponse.json()
      setCurrentlyPlaying(currentlyPlayingData)
      
      // Update current progress for smooth animation
      if (currentlyPlayingData.progress_ms) {
        setCurrentProgress(currentlyPlayingData.progress_ms)
      }

      // Fetch playback state for additional info
      const playbackResponse = await fetch('https://api.spotify.com/v1/me/player', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (playbackResponse.ok) {
        const playbackData = await playbackResponse.json()
        setPlaybackState(playbackData)
      }

      setIsLoading(false)
    } catch (e) {
      setError(typeof e?.message === 'string' ? e.message : 'Failed to load currently playing')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCurrentlyPlaying()
    
    // Update every 5 seconds
    const interval = setInterval(fetchCurrentlyPlaying, 5000)
    
    return () => clearInterval(interval)
  }, [])

  // Smooth progress animation - update every second
  useEffect(() => {
    if (!playbackState?.is_playing || !currentlyPlaying?.item) return

    const progressInterval = setInterval(() => {
      setCurrentProgress(prev => {
        const newProgress = prev + 1000 // Add 1 second
        const duration = currentlyPlaying.item.duration_ms
        return duration ? Math.min(newProgress, duration) : prev
      })
    }, 1000)

    return () => clearInterval(progressInterval)
  }, [playbackState?.is_playing, currentlyPlaying?.item])

  if (isLoading) {
    return (
      <div className="currently-playing-widget">
        <div className="loading">Loading currently playing...</div>
      </div>
    )
  }

  // Check if user is logged in
  const token = getValidAccessToken()
  if (!token) {
    return (
      <div className="currently-playing-widget">
        <div className="no-track">
          <div className="no-track-icon">🔒</div>
          <div className="no-track-text">
            <h3>Login Required</h3>
            <p>Please log in with Spotify to see what's currently playing!</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="currently-playing-widget">
        <div className="error">{error}</div>
      </div>
    )
  }

  if (!currentlyPlaying || !currentlyPlaying.item) {
    return (
      <div className="currently-playing-widget">
        <div className="no-track">
          <div className="no-track-icon">🎵</div>
          <div className="no-track-text">
            <h3>Nothing playing</h3>
            <p>Start playing something on Spotify to see it here!</p>
          </div>
        </div>
      </div>
    )
  }

  const track = currentlyPlaying.item
  const duration = track.duration_ms || 0
  const progressPercent = duration > 0 ? (currentProgress / duration) * 100 : 0

  return (
    <div className="currently-playing-widget">
      <div className="track-info">
        <div className="track-image">
          {track.album?.images?.[0]?.url ? (
            <img 
              src={track.album.images[0].url} 
              alt={track.album.name}
              className="album-art"
            />
          ) : (
            <div className="no-image">🎵</div>
          )}
        </div>
        
        <div className="track-details">
          <div className="track-name">{track.name}</div>
          <div className="track-artist">
            {track.artists?.map(artist => artist.name).join(', ')}
          </div>
          <div className="track-album">{track.album?.name}</div>
        </div>
      </div>

      <div className="playback-info">
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="time-info">
            <span className="current-time">{formatTime(currentProgress)}</span>
            <span className="total-time">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="playback-status">
          <div className="status-text">
            {playbackState?.is_playing ? "Now Playing" : "Paused"}
          </div>
          
          {playbackState?.device && (
            <div className="device-info">
              <span className="device-label">Listening on:</span>
              <span className="device-name">{playbackState.device.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CurrentlyPlaying

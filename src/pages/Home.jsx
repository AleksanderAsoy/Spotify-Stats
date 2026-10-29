// Home Page Component
// The main landing page featuring hero section and feature highlights
// Receives setCurrentPage function for navigation
import { useEffect, useState } from 'react'
import SpotifyLogin from '../components/SpotifyLogin'
import TopArtists from '../components/TopArtists'
import TopTracks from '../components/TopTracks'
import CurrentlyPlaying from '../components/CurrentlyPlaying'
import RecentlyPlayed from '../components/RecentlyPlayed'

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

const Home = ({ setCurrentPage }) => {
  const [userName, setUserName] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = getValidAccessToken()
      if (!token) {
        setIsLoggedIn(false)
        setUserName('')
        return
      }

      try {
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (response.ok) {
          const userData = await response.json()
          setUserName(userData.display_name || userData.id || 'User')
          setIsLoggedIn(true)
        } else {
          setIsLoggedIn(false)
          setUserName('')
        }
      } catch (error) {
        setIsLoggedIn(false)
        setUserName('')
      }
    }

    fetchUserProfile()
    
    // Check for auth changes
    const checkAuth = () => {
      const token = getValidAccessToken()
      if (!token) {
        setIsLoggedIn(false)
        setUserName('')
      }
    }

    const interval = setInterval(checkAuth, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="page home-page">
      {/* Hero Section - Main banner with call-to-action */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Spotify Stats Wrapped</h1>
              <p className="hero-subtitle">
                A modern application for analyzing your Spotify data
              </p>
              {/* Call-to-action buttons that navigate to other pages */}
              <div className="hero-actions">
                <SpotifyLogin />
              </div>
            </div>
            <div className="hero-widget">
              <CurrentlyPlaying />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Highlights key features of the website */}
      <section className="features">
        <div className="container">
          <h2>
            {isLoggedIn && userName 
              ? `Here is the available stats for you, ${userName}!`
              : 'Features'
            }
          </h2>
          {/* Grid layout for feature cards */}
          <div className="features-grid">
            <div className="feature-card">
              <h3>Top Artists</h3>
              <TopArtists />
            </div>
            <div className="feature-card">
              <h3>Top Tracks</h3>
              <TopTracks />
            </div>
            <div className="feature-card">
              <h3>Recently Played</h3>
              <RecentlyPlayed />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

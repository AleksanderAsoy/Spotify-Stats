// Simple Spotify Login Button using Authorization Code with PKCE
// Redirects user to Spotify's authorize endpoint and handles PKCE locally
import { useEffect, useState } from 'react'

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
// Build redirect dynamically to match current origin (avoids localhost vs 127.0.0.1 mismatch)
const REDIRECT_URI = `${window.location.origin}/callback`
const SCOPES = [
  // Add more scopes later as needed
  'user-read-email',
  'user-top-read',
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-read-recently-played'
]

function base64UrlEncode(arrayBuffer) {
  const uint8Array = new Uint8Array(arrayBuffer)
  let binaryString = ''
  for (let i = 0; i < uint8Array.byteLength; i++) {
    binaryString += String.fromCharCode(uint8Array[i])
  }
  const base64String = btoa(binaryString)
  return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  let text = ''
  const possibleLength = possible.length
  const randomValues = new Uint8Array(length)
  if (window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(randomValues)
  } else {
    for (let i = 0; i < length; i++) randomValues[i] = Math.floor(Math.random() * 256)
  }
  for (let i = 0; i < length; i++) {
    text += possible.charAt(randomValues[i] % possibleLength)
  }
  return text
}

async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const digest = await window.crypto.subtle.digest('SHA-256', data)
  return base64UrlEncode(digest)
}

async function beginSpotifyLogin() {
  const codeVerifier = generateRandomString(128)
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  const state = generateRandomString(16)

  sessionStorage.setItem('spotify_pkce_code_verifier', codeVerifier)
  sessionStorage.setItem('spotify_auth_state', state)

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope: SCOPES.join(' '),
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    state
  })

  const authorizeUrl = `https://accounts.spotify.com/authorize?${params.toString()}`
  window.location.assign(authorizeUrl)
}

const SpotifyLogin = () => {
  const computeIsLoggedIn = () => {
    const accessToken = localStorage.getItem('spotify_access_token')
    const expiresInSeconds = parseInt(localStorage.getItem('spotify_token_expires_in') || '0', 10)
    const receivedAtMs = parseInt(localStorage.getItem('spotify_token_received_at') || '0', 10)
    if (!accessToken || !expiresInSeconds || !receivedAtMs) return false
    const safetyWindowSeconds = 60
    const expiryMs = receivedAtMs + (expiresInSeconds - safetyWindowSeconds) * 1000
    return Date.now() < expiryMs
  }

  const [isLoggedIn, setIsLoggedIn] = useState(computeIsLoggedIn())

  useEffect(() => {
    const interval = setInterval(() => setIsLoggedIn(computeIsLoggedIn()), 30000)
    // Also update immediately on mount in case storage changed just before mount
    setIsLoggedIn(computeIsLoggedIn())
    return () => clearInterval(interval)
  }, [])

  const logout = () => {
    localStorage.removeItem('spotify_access_token')
    localStorage.removeItem('spotify_refresh_token')
    localStorage.removeItem('spotify_token_expires_in')
    localStorage.removeItem('spotify_token_received_at')
    sessionStorage.removeItem('spotify_pkce_code_verifier')
    sessionStorage.removeItem('spotify_auth_state')
    setIsLoggedIn(false)
  }

  if (isLoggedIn) {
    return (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button className="btn btn-primary" disabled>
          Logged in with Spotify
        </button>
        <button className="btn btn-primary" onClick={logout}>
          Log out
        </button>
      </div>
    )
  }

  return (
    <button className="btn btn-primary" onClick={beginSpotifyLogin}>
      Login with Spotify
    </button>
  )
}

export default SpotifyLogin



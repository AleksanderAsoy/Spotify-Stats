// Handles Spotify redirect: exchanges authorization code for access/refresh tokens

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const REDIRECT_URI = `${window.location.origin}/callback`

async function exchangeCodeForToken(code, codeVerifier) {
  const body = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier
  })

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText)
  }

  return await response.json()
}

const SpotifyCallback = ({ onAuthSuccess }) => {
  // Immediately process URL params on render (simple app without effects)
  const url = new URL(window.location.href)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  const state = url.searchParams.get('state')

  // Optional CSRF protection: ensure returned state matches what we set
  const expectedState = sessionStorage.getItem('spotify_auth_state')
  if (state && expectedState && state !== expectedState) {
    return (
      <div className="container">
        <h2>Invalid state</h2>
        <p>Please try logging in again.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <h2>Spotify Login Error</h2>
        <p>{error}</p>
      </div>
    )
  }

  if (!code) {
    return (
      <div className="container">
        <h2>Invalid callback</h2>
        <p>Missing authorization code.</p>
      </div>
    )
  }

  const codeVerifier = sessionStorage.getItem('spotify_pkce_code_verifier')
  if (!codeVerifier) {
    return (
      <div className="container">
        <h2>Session expired</h2>
        <p>Please try logging in again.</p>
      </div>
    )
  }

  // Kick off the exchange (simple inline promise since no hooks here)
  exchangeCodeForToken(code, codeVerifier)
    .then((tokenResponse) => {
      // Persist minimal tokens to localStorage for future use
      localStorage.setItem('spotify_access_token', tokenResponse.access_token)
      if (tokenResponse.refresh_token) {
        localStorage.setItem('spotify_refresh_token', tokenResponse.refresh_token)
      }
      localStorage.setItem('spotify_token_expires_in', String(tokenResponse.expires_in))
      localStorage.setItem('spotify_token_received_at', String(Date.now()))

      if (onAuthSuccess) onAuthSuccess()
      // Navigate to home after success
      window.location.replace('/')
    })
    .catch((err) => {
      console.error('Spotify token exchange failed:', err)
      const message = typeof err?.message === 'string' ? err.message : 'Unknown error'
      const encoded = encodeURIComponent(message)
      window.location.replace(`/callback?error=${encoded}`)
    })

  return (
    <div className="container">
      <h2>Completing Spotify Login…</h2>
      <p>Please wait while we finish signing you in.</p>
    </div>
  )
}

export default SpotifyCallback



let accessToken

const clientID = 'b047b381ce4444729ad17c7d13f70917'
const redirectURI = 'http://localhost:3000'

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken
    }
    //check for access token match
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/)
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1]
      const expiresIn = Number(expiresInMatch[1])
      //This clears the parameters, allowing us to grab a new access token when it expires.
      window.setTimeout(() => (accessToken = ''), expiresIn * 1000)
      window.history.pushState('Access Token', null, '/')
      return accessToken
    } else {
      const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
      window.location = accessURL
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken()
    return fetch(`https://api.spotify.com/v1/search?q=${term}&type=track`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((response) => {
        return response.json()
      })
      .then((jsonResponse) => {
        console.log(jsonResponse)
        return jsonResponse.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artists: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
        }))
      })
  },

  savePlaylist(name, trackURIs) {
    if (!name || !trackURIs.length) {
      return
    }
    const accessToken = Spotify.getAccessToken()
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    let userID

    return fetch('https://api.spotify.com/v1/me', { headers: headers })
      .then((response) => response.json())
      .then((jsonResponse) => {
        userID = jsonResponse.id
        console.log('retrieved user id')
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({ name: name }),
        })
          .then((response) => response.json())
          .then((jsonResponse) => {
            const playlistID = jsonResponse.id
            console.log('empty playlist created')
            return fetch(
              `https://api.spotify.com/v1/playlists/${playlistID}/tracks `,
              {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ uris: trackURIs }),
              }
            )
          })
          .then(() => {
            console.log('tracks added to playlist')
          })
      })
  },
}

export default Spotify

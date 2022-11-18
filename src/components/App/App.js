import React from 'react'
import './App.css'
// import './Playlist'
// import './SearchBar'
// import './SearchResults'

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          {/* <SearchBar /> */}
          <div className="App-playlist">
            {/* <SearchResults /> */}
            {/* <Playlist /> */}
          </div>
        </div>
      </div>
    )
  }
}

export default App

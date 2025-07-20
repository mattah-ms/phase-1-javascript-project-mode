# Music Player Web Application

A single-page web application that allows users to search and play music tracks using the Deezer API, view synchronized lyrics, and play local tracks from a `songs.json` file.

## Features

- **Deezer API Integration**: Search and stream 30-second previews of tracks via the public Deezer API.  
- **Lyrics Display**: Retrieve and display lyrics using the lyrics.ovh API.  
- **Local Music Playback**: Play songs stored in a local JSON file with custom metadata.  
- **Playback Controls**: Play, pause, previous, and next track functionality.  
- **Progress Bar**: Visual timeline with current time and duration display, including click-to-seek functionality.  
- **Responsive Design**: Works across different screen sizes and devices.  

## Technologies Used

- HTML5  
- CSS3  
- JavaScript (ES6+)  
- [Deezer API](https://developers.deezer.com/api)  
- [lyrics.ovh API](https://lyricsovh.docs.apiary.io)  
- Font Awesome (for icons)  

## Project Requirements Met

- ✅ Single-page application with no redirects  
- ✅ Uses a public API (Deezer, no authentication required)  
- ✅ Implements local songs using a `songs.json` file with at least five tracks  
- ✅ Includes at least three distinct event listeners (e.g., `click`, `keypress`, `timeupdate`)  
- ✅ Uses array iteration methods (`forEach`) for displaying search results  
- ✅ Uses `async/await` for asynchronous API calls  
- ✅ Follows DRY (Don't Repeat Yourself) coding principles  

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/mattah-ms/phase-1-javascript-project-mode
```

### 2. Navigate to the Project Directory

```bash
cd music-player
```

### 3. (Optional) Install Dependencies

This project is static and does not require external packages. However, you may install a development server if needed:

```bash
npm install
```

### 4. Run the Application

Open `index.html` in your browser, or run it with a live server such as VS Code Live Server.

## Usage

- **Search Music**: Enter a song title or artist name in the search bar.  
- **Play Tracks**: Click on a search result to start playback.  
- **Local Songs**: Use the navigation buttons to switch between locally loaded tracks.  
- **View Lyrics**: If available, lyrics will appear below the player.  
- **Control Playback**: Use the play/pause, previous, and next buttons to navigate tracks.  

## File Structure

```
music-player/
├── index.html          # Main HTML structure
├── style.css           # All styles and responsive design
├── script.js           # Core JavaScript logic
├── songs.json          # Custom local song database
└── README.md           # Project documentation
```

## Future Improvements

- Add volume control  
- Allow users to create and manage playlists  
- Implement dark/light theme toggle  
- Enable favoriting and saving preferred tracks  
- Improve error handling and loading states for API failures  

## Credits

- **Deezer API** – Music metadata and preview streaming  
- **lyrics.ovh API** – Lyrics data  
- **Font Awesome** – Icons used throughout the UI  

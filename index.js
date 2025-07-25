
// Music Player Configuration

let songs = [];
let musicIndex = 0;
let isPlaying = false;
const music = new Audio();

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');
const image = document.getElementById('cover');
const title = document.getElementById('music-title');
const artist = document.getElementById('music-artist');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const progress = document.getElementById('progress');
const playerProgress = document.getElementById('player-progress');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const playBtn = document.getElementById('play');
const background = document.getElementById('bg-img');
const lyricsText = document.getElementById('lyrics-text');


// 1. Deezer Music Search

async function searchDeezer(query) {
    try {
        searchResults.innerHTML = '<div class="loading">Searching...</div>';
        
        const proxy = 'https://corsproxy.io/?';
        const url = `https://api.deezer.com/search?q=${encodeURIComponent(query)}`;
        
        const res = await fetch(proxy + encodeURIComponent(url));
        const data = await res.json();
        
        if (!data.data?.length) {
            searchResults.innerHTML = '<div class="no-results">No results found</div>';
            return;
        }
        
        displaySearchResults(data.data);
    } catch (err) {
        console.error('Search failed:', err);
        searchResults.innerHTML = `
            <div class="error">
                Search failed: ${err.message}<br>
                <small>Try again later or refresh</small>
            </div>
        `;
    }
}

function displaySearchResults(tracks) {
    searchResults.innerHTML = '';
    
    tracks.slice(0, 10).forEach(track => {
        const item = document.createElement('div');
        item.classList.add('result-item');
        item.innerHTML = `
            <img src="${track.album.cover_small}" alt="${track.title}">
            <div>
                <strong>${track.title_short || track.title}</strong>
                <small>${track.artist.name}</small>
            </div>
        `;
        item.addEventListener('click', () => playDeezerTrack(track));
        searchResults.appendChild(item);
    });
}


// 2. WORKING DEEZER LYRICS FETCHER

async function fetchLyrics(artist, title) {
    try {
        // Clean the track title for better matching
        const cleanTitle = title
            .replace(/ *\([^)]*\) */g, '')  // Remove anything in parentheses
            .replace(/ *\[[^\]]*\] */g, '') // Remove anything in brackets
            .replace(/ft\.|feat\./gi, '')   // Remove featured artists
            .replace(/- .*/, '')             // Remove text after hyphen
            .trim();

        // Search for the track on Deezer
        const searchUrl = `https://api.deezer.com/search?q=artist:"${encodeURIComponent(artist)}" track:"${encodeURIComponent(cleanTitle)}"`;
        const searchResponse = await fetch(`https://corsproxy.io/?${encodeURIComponent(searchUrl)}`);
        const searchData = await searchResponse.json();
        
        const track = searchData.data?.[0];
        if (!track) return "Track not found on Deezer";

        // Fetch full track details including lyrics
        const trackResponse = await fetch(`https://corsproxy.io/?https://api.deezer.com/track/${track.id}`);
        const trackData = await trackResponse.json();

        // Return lyrics if available
        return trackData.lyrics?.lyrics || "No lyrics available for this track";

    } catch (err) {
        console.error("Lyrics error:", err);
        return "Couldn't load lyrics";
    }
}


// 3. IMPROVED PLAY TRACK FUNCTION

async function playDeezerTrack(track) {
    try {
        // Set up audio
        music.src = track.preview;
        isPlaying = true;
        
        // Update UI
        title.textContent = track.title;
        artist.textContent = track.artist.name;
        image.src = track.album.cover_medium;
        background.style.backgroundImage = `url(${track.album.cover_big})`;
        playBtn.classList.replace('fa-play', 'fa-pause');
        
        // Load lyrics with better feedback
        lyricsText.innerHTML = `
            <div class="lyrics-loading">
                <i class="fas fa-spinner fa-spin"></i>
                Loading lyrics...
            </div>
        `;
        
        // Fetch lyrics in background
        setTimeout(async () => {
            try {
                const lyrics = await fetchLyrics(track.artist.name, track.title);
                lyricsText.innerHTML = lyrics.includes("No lyrics") 
                    ? `<div class="no-lyrics">${lyrics}</div>`
                    : `<div class="lyrics-content">${lyrics.replace(/\n/g, '<br>')}</div>`;
            } catch (err) {
                lyricsText.textContent = "Error loading lyrics";
            }
        }, 0);
        
        // Play audio
        await music.play();
    } catch (err) {
        console.error('Playback error:', err);
        lyricsText.textContent = "Error playing track";
    }
}


// 4. Local Music Playback

async function loadSongs() {
    try {
        const res = await fetch('songs.json');
        songs = await res.json();
        loadMusic(songs[musicIndex]);
    } catch (err) {
        console.error('Failed to load songs:', err);
    }
}

function loadMusic(song) {
    music.src = song.path;
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    image.src = song.cover;
    background.style.backgroundImage = `url(${song.cover})`;
    lyricsText.textContent = song.lyrics || "No lyrics available";
}


// 5. Player Controls

function togglePlay() {
    isPlaying ? pauseMusic() : playMusic();
}

function playMusic() {
    isPlaying = true;
    playBtn.classList.replace('fa-play', 'fa-pause');
    music.play();
}

function pauseMusic() {
    isPlaying = false;
    playBtn.classList.replace('fa-pause', 'fa-play');
    music.pause();
}

function changeMusic(direction) {
    musicIndex = (musicIndex + direction + songs.length) % songs.length;
    loadMusic(songs[musicIndex]);
    if (isPlaying) playMusic();
}


// 6. Progress Bar & Time Handling

function updateProgressBar() {
    const { duration, currentTime } = music;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    const formatTime = (time) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    durationEl.textContent = duration ? formatTime(duration) : '0:00';
    currentTimeEl.textContent = formatTime(currentTime);
}

function setProgressBar(e) {
    const width = playerProgress.clientWidth;
    const clickX = e.offsetX;
    music.currentTime = (clickX / width) * music.duration;
}


// 7. Event Listeners

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim()) {
        searchDeezer(searchInput.value.trim());
    }
});

searchBtn.addEventListener('click', () => {
    if (searchInput.value.trim()) {
        searchDeezer(searchInput.value.trim());
    }
});

playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeMusic(-1));
nextBtn.addEventListener('click', () => changeMusic(1));
music.addEventListener('ended', () => changeMusic(1));
music.addEventListener('timeupdate', updateProgressBar);
playerProgress.addEventListener('click', setProgressBar);

// Initialize
loadSongs();
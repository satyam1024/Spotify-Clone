// Initialize variables
let curSong = new Audio();
let songs = ["song1", "song2", "song3"];  // Use actual song names without .mp3
let currFolder = "Justin-Bieber";
let songUL;
let isMuted = false;
let curVol = 0.5;

// 🎵 Function to format time
function secondToMinuteSecond(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// 🎵 Function to play song directly without fetch()
function playSong(track, pause = false) {
    const songPath = `/songs/${currFolder}/${track}.mp3`;
    curSong.src = songPath;

    const playBtn = document.getElementById("play");
    playBtn.src = "img/play-button2.svg";

    if (!pause) {
        curSong.play();
        playBtn.src = "img/pause.svg";
    }

    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

// 🎵 Function to display song list
function displaySongs() {
    songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML += `
            <li>
                <div class="info">
                    <div>${song}</div>
                </div>
                <div class="playNow">
                    <span>Play Now</span>
                </div>
            </li>`;
    }

    // Add event listeners to each song
    document.querySelectorAll(".songList li").forEach((li, index) => {
        li.addEventListener("click", () => {
            playSong(songs[index]);
        });
    });
}

// 🎵 Main player controls
function setupPlayer() {
    const playBtn = document.getElementById("play");
    const previousBtn = document.getElementById("previous");
    const nextBtn = document.getElementById("next");

    // Play/pause functionality
    playBtn.addEventListener("click", () => {
        if (curSong.paused) {
            curSong.play();
            playBtn.src = "img/pause.svg";
        } else {
            curSong.pause();
            playBtn.src = "img/play-button2.svg";
        }
    });

    // Previous song
    previousBtn.addEventListener("click", () => {
        let index = songs.indexOf(curSong.src.split('/').pop().replace('.mp3', ''));
        if (index > 0) {
            playSong(songs[index - 1]);
        }
    });

    // Next song
    nextBtn.addEventListener("click", () => {
        let index = songs.indexOf(curSong.src.split('/').pop().replace('.mp3', ''));
        if (index < songs.length - 1) {
            playSong(songs[index + 1]);
        }
    });

    // Seekbar
    const rangeInp = document.getElementById("rangeInp");
    rangeInp.addEventListener("input", (e) => {
        curSong.currentTime = (curSong.duration * e.target.value) / 100;
    });

    curSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondToMinuteSecond(curSong.currentTime)} / ${secondToMinuteSecond(curSong.duration)}`;
        rangeInp.value = (curSong.currentTime / curSong.duration) * 100;
    });

    // Volume control
    const volumeBtn = document.getElementById("volumeBtn");
    volumeBtn.addEventListener("click", () => {
        if (!isMuted) {
            curVol = curSong.volume;
            curSong.volume = 0;
            volumeBtn.src = "img/mute.svg";
        } else {
            curSong.volume = curVol;
            volumeBtn.src = "img/volume.svg";
        }
        isMuted = !isMuted;
    });

    // Set initial volume
    curSong.volume = curVol;
}

// 🎵 Initialize the music player
function main() {
    displaySongs();
    setupPlayer();
}

main();

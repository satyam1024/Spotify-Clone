let curSong = new Audio();
let songs;
let currFolder;
let songUL;

let curVol = 0;
let is = false;
let isMuted = false;

function secondToMinuteSecond(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

// Utility function to load content using XMLHttpRequest
function loadContent(url, responseType = "text") {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = responseType;

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(`Failed to load ${url}: ${xhr.status}`);
      }
    };

    xhr.onerror = () => reject(`Error loading ${url}`);
    xhr.send();
  });
}

// Get songs from folder using AJAX
async function getSongs(folder) {
  currFolder = folder;

  try {
    let response = await loadContent(`songs/${folder}/`, "document");

    let anchors = response.getElementsByTagName("a");
    let songs = [];

    for (let i = 0; i < anchors.length; i++) {
      const element = anchors[i];
      if (element.href.endsWith(".mp3")) {
        songs.push(element.href.split(`${folder}/`)[1]);
      }
    }
    return songs;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Play a song
function playSong(track, pause = false) {
  track = track.replaceAll("%20", " ").replaceAll(".mp3", "");
  curSong.src = `songs/${currFolder}/` + track + ".mp3";

  document.getElementById("play").src = "img/play-button2.svg";
  if (!pause) {
    curSong.play();
    document.getElementById("play").src = "img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

// Initialize songs and display them in the UI
async function helper() {
  if (!is) {
    songs = await getSongs("Justin-Bieber");
  }

  playSong(songs[0], true);
  songUL = document.querySelector(".songList ul");

  for (const song of songs) {
    songUL.innerHTML += `
      <li>
        <img class="invert" src="img/music.svg" alt="Music">
        <div class="info">
          <div>${song.replaceAll("%20", " ").replaceAll(".mp3", "")}</div>
          <div>Akash</div>
        </div>
        <div class="playNow">
          <span>Play Now</span>
          <img class="invert" src="img/play-button.svg" alt="Play">
        </div>
      </li>`;
  }

  // Add click event listener to each song
  Array.from(document.querySelectorAll(".songList li")).forEach((e) => {
    e.addEventListener("click", () => {
      document.querySelector(".circle").style.left = "-0.8%";
      playSong(e.querySelector(".info div").innerText.trim());
    });
  });
}

// Display album covers and metadata
async function displayAlbum() {
  try {
    let response = await loadContent(`songs/`, "document");
    let anchors = response.getElementsByTagName("a");

    let array = Array.from(anchors);
    let cardContainer = document.querySelector(".cardContainer");

    for (let i = 0; i < array.length; i++) {
      const e = array[i];
      if (e.href.includes("songs")) {
        let folder = e.href.split("/").splice(-2)[0];

        try {
          let meta = await loadContent(`songs/${folder}/info.json`, "json");

          cardContainer.innerHTML += `
            <div class="card rounded" data-folder="${folder}">
              <div class="play">
                <img src="img/playButton2.svg" alt="">
              </div>
              <img class="rounded" width="160px" height="160px" src="songs/${folder}/cover.jpg" alt="card">
              <h2>${meta.title}</h2>
              <p>${meta.description}</p>
            </div>`;
        } catch (error) {
          console.error(error);
        }
      }
    }

    // Add event listeners to album cards
    Array.from(document.getElementsByClassName("card")).forEach((e) => {
      e.addEventListener("click", async () => {
        songs = await getSongs(e.dataset.folder);
        songUL.innerHTML = "";
        is = true;
        helper();
        playSong(songs[0]);
      });
    });
  } catch (error) {
    console.error(error);
  }
}

// Main function
async function main() {
  displayAlbum();

  if (!is) {
    helper();
  }

  let play = document.getElementById("play");

  play.addEventListener("click", () => {
    if (curSong.paused) {
      curSong.play();
      play.src = "img/pause.svg";
    } else {
      curSong.pause();
      play.src = "img/play-button2.svg";
    }
  });

  // Time update event
  curSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondToMinuteSecond(
      curSong.currentTime
    )}/${secondToMinuteSecond(curSong.duration)}`;

    document.querySelector(".circle").style.left =
      (curSong.currentTime / curSong.duration) * 100 + "%";
  });

  // Seekbar handling
  const seekbar = document.querySelector(".seekbar");
  const circle = document.querySelector(".circle");

  let isDragging = false;

  seekbar.addEventListener("mousedown", (e) => {
    isDragging = true;
    updateSeekbar(e);
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) updateSeekbar(e);
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  function updateSeekbar(e) {
    const rect = seekbar.getBoundingClientRect();
    let percent = ((e.clientX - rect.left) / rect.width) * 100;

    percent = Math.max(0, Math.min(100, percent));

    circle.style.left = percent + "%";
    curSong.currentTime = (curSong.duration * percent) / 100;
  }

  // Volume control
  document.querySelector("#rangeInp").addEventListener("change", (e) => {
    if (!isMuted) curSong.volume = parseInt(e.target.value) / 100;
  });

  document.querySelector(".volume img").addEventListener("click", (e) => {
    if (e.target.src.includes("volume.svg")) {
      curVol = curSong.volume;
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      curSong.volume = 0;
      isMuted = true;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      curSong.volume = parseInt(document.querySelector("#rangeInp").value) / 100;
      isMuted = false;
    }
  });
}

main();

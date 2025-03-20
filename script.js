let curSong = new Audio();
let songs;
function secondToMinuteSecond(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";

    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formatedMinutes = String(minutes).padStart(2, '0');
    const formatedSeconds = String(remainingSeconds).padStart(2, '0');

    // console.log(formatedMinutes);
    // console.log(formatedSeconds)

    return `${formatedMinutes}:${formatedSeconds} `;

}
async function getSongs() {


    let a = await fetch("https://akashbhardwaj0703.github.io/Spotify-Clone/songs/")
    let responses = await a.text();


    // console.log(responses)

    let div = document.createElement("div")

    div.innerHTML = responses;
    let as = div.getElementsByTagName("a");
    // console.log(as);

    let len = as.length;

    let songs = []
    for (let i = 0; i < len; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}

function playSong(track, pause = false) {


    track = track.replaceAll("%20", " ").replaceAll(".mp3", "")
    curSong.src = "/songs/" + track + ".mp3";

    play.src = "img/play-button2.svg"
    if (!pause) {
        curSong.play();
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}
async function main() {
    songs = await getSongs();
    // console.log(songs);

    //playing first song

    // let currSong;
    playSong(songs[0], true);
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];

    for (const song of songs) {

        songUL.innerHTML = songUL.innerHTML + `<li>
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


    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {

            // console.log(element.target.classList)
            // if(element.target.classList.contains("playNow") || ){
            document.querySelector(".circle").style.left = "-0.8%";
            playSong(e.querySelector(".info").firstElementChild.innerHTML.trim())
            // }
            // console.log(e.querySelector(".info").firstElementChild.innerHTML.trim())

            // document.querySelector(".circle").style.left = "-0.8%";


        })
    })

    let play = document.getElementById("play")

    play.addEventListener("click", () => {

        curSong.p
        if (curSong.paused) {
            curSong.play();
            play.src = "img/pause.svg"
        }
        else {
            curSong.pause();
            play.src = "img/play-button2.svg"
        }
    })

    //Listen for timeupdate event

    curSong.addEventListener("timeupdate", () => {
        // console.log(curSong.currentTime,curSong.duration)
        document.querySelector(".songtime").innerHTML = `${secondToMinuteSecond(curSong.currentTime)}/${secondToMinuteSecond(curSong.duration)}`


        document.querySelector(".circle").style.left = (curSong.currentTime / curSong.duration) * 100 + "%";
    })

    //Add an event listener to seekbar
    const seekbar = document.querySelector(".seekbar");
    const circle = document.querySelector(".circle");

    let isDragging = false; // Track dragging state

    seekbar.addEventListener("mousedown", (e) => {
        isDragging = true;
        updateSeekbar(e); // Update position immediately on click
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

        // console.log(percent)

        // Ensure percent stays within bounds (0% to 100%)
        percent = Math.max(0, Math.min(100, percent));

        circle.style.left = percent + "%";
        curSong.currentTime = (curSong.duration * percent) / 100;
    }


    //adding eventlistener for hamburger

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
        // document.querySelector(".close").style.display = "inline"; 
    })

    //Event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-140%";
    })

    //Event Listeners for previous and next button

    previous.addEventListener("click", () => {
        let index = songs.indexOf(curSong.src.split('/').splice("-1")[0])
        if (index - 1 >= 0) {
            document.querySelector(".circle").style.left = "-0.8%";
            playSong(songs[index - 1])
        }

    })
    next.addEventListener("click", () => {

        let index = songs.indexOf(curSong.src.split('/').splice("-1")[0])
        if (index + 1 < songs.length) {
            document.querySelector(".circle").style.left = "-0.8%";
            playSong(songs[index + 1])
            

        }
    })

}
main()



const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'Quan Player'; 

const heading = $('header h2');
const singer = $('header h3');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const player = $('.player');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');



const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {}

    , songs: [
        {
            name: 'Hoa Hải Đường',
            singer: 'Jack',
            path: './assets/audio/song1.mp3',
            img: './assets/img/img1.jpeg',
        },
        {
            name: 'Hoa Sữa',
            singer: 'Justatee',
            path: './assets/audio/song2.mp3',
            img: './assets/img/img2.jpg',
        },
        {
            name: 'Rồi Tới Luôn',
            singer: 'Nal',
            path: './assets/audio/song3.m4a',
            img: './assets/img/img3.jpeg',
        },
        {
            name: 'Bước Qua Nhau',
            singer: 'Vũ',
            path: './assets/audio/song4.mp3',
            img: './assets/img/img4.jpg',
        },
        {
            name: 'Đế Vương',
            singer: 'Đình Dũng',
            path: './assets/audio/song5.mp3',
            img: './assets/img/img5.jpg',
        }, {
            name: 'Thức Giấc',
            singer: 'Da Lab',
            path: './assets/audio/song6.mp3',
            img: './assets/img/img6.jpg',
        },
        {
            name: 'Có Hẹn Với Thanh Xuân',
            singer: 'Moonstar',
            path: './assets/audio/song7.mp3',
            img: './assets/img/img7.jpg',
        },
    
    
    ],
    
    setConfig(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    }
        
    , render() {
        const songs = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.img}')">
                    </div>
                    <div class="body">
                    <h2 class="title">${song.name}</h2>
                    <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        });
        playlist.innerHTML = songs.join('')
    },
    
    eventHandlers() {
        const _this = this;
        const cdWidth = cd.offsetWidth;


        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000,
            iterations: Infinity,
        });
        cdThumbAnimate.pause();

        //handle the size of CD on action scroll up/down 
        document.onscroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;

            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        audio.onplay = () => {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        audio.onpause = () => {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();

        }

        //Handle the play action
        playBtn.onclick = () => {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        //when song ended, play again
        audio.onended = () => {
            nextBtn.click();
        }


        audio.ontimeupdate = () => {
            const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
            progress.value = progressPercent;
        
        }
        progress.onchange = (e) => {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        nextBtn.onclick = () => {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }

            audio.play();
            _this.render();

        }
        prevBtn.onclick = () => {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }

            audio.play();
            _this.render();
            

        }
        //handle when the random button is clicked
        randomBtn.onclick = () => {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }
        //handle when repeat button is clicked
        repeatBtn.onclick = () => {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);

        }
        //handle the click action onto playlist
        playlist.onclick = (e) => {
            const songClicked = e.target.closest('.song:not(.active)')
            if (songClicked) {
                _this.currentIndex = Number(songClicked.dataset.index);
                _this.loadCurrentSong();
                audio.play();
                _this.render();
            }
        }

    },
    defineProperties() {
        Object.defineProperty(this, 'currentSong', {
            get() {
                return this.songs[this.currentIndex];
            }
        })
    },
    loadConfig() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    }
    ,

    loadCurrentSong() {
        heading.innerHTML = `<h1>${this.currentSong.name}</h1>`;
        singer.innerHTML = `<h3>${this.currentSong.singer}</h3>`;
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.path;
    },
    prevSong() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length-1;
        }
        this.loadCurrentSong();
    },
    nextSong() {
        this.currentIndex++;
        if (this.currentIndex == this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    playRandomSong(){
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start() {
        
        this.loadConfig();
        this.defineProperties();
        this.eventHandlers();
        
        this.loadCurrentSong();
        this.render();
        
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    },


}

app.start();
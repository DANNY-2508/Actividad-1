const audioPlayer = document.querySelector('.music-player audio');
const playButton = document.querySelector('.play-button');
const pauseButton = document.querySelector('.pause-button');

playButton.addEventListener('click', () => {
  audioPlayer.play();
});

pauseButton.addEventListener('click', () => {
  audioPlayer.pause();
});

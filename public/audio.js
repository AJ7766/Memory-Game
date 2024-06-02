var menuSound = new Howl({
    src: ['sounds/menu.mp3']
  });

var clickSound = new Howl({
    src: ['sounds/buttonClick.mp3']
  });
  
  var hoverSound = new Howl({
    src: ['sounds/buttonHover.mp3']
  });
  
  var flipCardSound = new Howl({
    src: ['sounds/cardFlip.mp3']
  });
  
  var cardMatchSound = new Howl({
    src: ['sounds/cardMatch.mp3']
  });
  
  var recordSound = new Howl({
    src: ['sounds/recordSound.mp3']
  });

function baseSetVolume(){
    flipCardSound.volume(0.3);
    cardMatchSound.volume(0.2);
    recordSound.volume(0.8);
    hoverSound.volume(0.3);
    clickSound.volume(0.6);
}

baseSetVolume();

function lowVolume(){
    menuSound.volume(0.1);
    console.log("volume set to low!");
}

function highVolume(){
    menuSound.volume(0.3);
    console.log("volume set to high!");
}

export function playClickSound() {
    if (!clickSound.paused) {
        clickSound.currentTime = 0;
    }
    clickSound.play();
}

export function playHoverSound() {
    hoverSound.play();
}

export function stopHoverSound() {
    hoverSound.stop();
    hoverSound.currentTime = 0;
}

function playMenuSound() {
    menuSound.play();
}

export function playFlipCardSound(){
    flipCardSound.play();
}

export function playCardMatchSound(){
    flipCardSound.currentTime = 0;
    cardMatchSound.play();
}

export function playRecordSound() {
    recordSound.play();
}

export function replayMenuSound(menuSound) {
    menuSound.currentTime = 0;
    menuSound.play();
}

export function toggleMenuSound() {
    const toggleSounds = document.querySelectorAll('.toggleSound');
    toggleSounds.forEach(toggleSound => {
        const iconElement = toggleSound.querySelector('i');

        if (toggleSound.id.includes("muted")) {
            playMenuSound();
            lowVolume();
            toggleSound.id ="lowSound";
            iconElement.classList = "fa-solid fa-volume-low";
        } else if (toggleSound.id.includes("lowSound")) {
            highVolume();
            toggleSound.id = "highSound";
            iconElement.classList = "fa-solid fa-volume-high";
        } else {
            menuSound.stop();
            toggleSound.id = "muted";
            iconElement.classList = "fa-solid fa-volume-xmark";
            baseSetVolume();
        }
    });
}
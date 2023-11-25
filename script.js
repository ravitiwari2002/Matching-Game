let minute = 0;
let second = 0;
let millisecond = 0;

let cron;

//timer function
function timer() {
    if ((millisecond += 1) == 100) {
        millisecond = 0;
        second++;
    }
    if (second == 60) {
        second = 0;
        minute++;
    }
    document.getElementById('minute').innerText = returnData(minute);
    document.getElementById('second').innerText = returnData(second);
    document.getElementById('millisecond').innerText = returnData(millisecond);
}

function returnData(input) {
    return input > 10 ? input : `0${input}`
}

//start the timer
function start() {
    pause();
    cron = setInterval(() => { timer(); }, 10);
}

//pause the timer
function pause() {
    clearInterval(cron);
}

//reset the timer
function reset() {
    minute = 0;
    second = 0;
    millisecond = 0;

    document.getElementById('minute').innerText = '00';
    document.getElementById('second').innerText = '00';
    document.getElementById('millisecond').innerText = '00';
}

function createNewCard() {
    let cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.innerHTML = `<div class="card-down"></div>
      <div class="card-up"></div>`;

    return cardElement;
}
createNewCardTest();

function appendNewCard(parentElement) {
    let card = createNewCard();
    parentElement.appendChild(card);
    return card;
}
appendNewCardTest();

function shuffleCardImageClasses() {
    let array = ["image-1", "image-1", "image-2", "image-2", "image-3", "image-3", "image-4", "image-4", "image-5", "image-5", "image-6", "image-6"]
    let shuffledArray = _.shuffle(array);
    return shuffledArray;
}
shuffleCardImageClassesTest()


function createCards(parentElement, shuffledImageClasses) {
    let array = [];

    for (var i = 0; i < 12; i++) {
        let card = appendNewCard(parentElement);
        card.classList.add(shuffledImageClasses[i]);

        let newCard = {
            index: i,
            element: card,
            imageClass: shuffledImageClasses[i]
        };
        array.push(newCard);
    }
    return array;
}
createCardsTest();


function doCardsMatch(cardObject1, cardObject2) {
    let card1 = cardObject1.imageClass;
    let card2 = cardObject2.imageClass;
    if (card1 === card2) {
        return true;
    }
    else {
        return false;
    }
}
doCardsMatchTest();

let counters = {};


function incrementCounter(counterName, parentElement) {
    if (counters[counterName] == undefined) {
        counters[counterName] = 0;
    }
    counters[counterName]++;
    parentElement.innerHTML = counters[counterName];
}
incrementCounterTest();

//game result
function result(id) {
    let win = document.getElementById(id);
    if (win != null) {
        win.classList.remove("hidden");
    }
}

let lastCardFlipped = null;


function onCardFlipped(newlyFlippedCard) {
    incrementCounter("flips", document.getElementById("flip-count"));

    start();    //start the timer 

    //if total flips > 30 then you lose
    if (counters["flips"] > 30) {
        if (typeof loseAudio.loop == 'boolean')
            loseAudio.loop = true;
        else {
            loseAudio.addEventListener('ended', function () {
                this.currentTime = 0;
                this.play();
            }, false);
        }
        loseAudio.play();
        loseAudio.volume = 0.8;
        pause();
        result("lose");
    }

    //start bgm on first flip
    if (lastCardFlipped === null) {
        if (typeof bgm.loop == 'boolean')
            bgm.loop = true;
        else {
            bgm.addEventListener('ended', function () {
                this.currentTime = 0;
                this.play();
            }, false);
        }
        bgm.play();
        bgm.volume = 0.5;
        lastCardFlipped = newlyFlippedCard;
        return;
    }

    if ((doCardsMatch(lastCardFlipped, newlyFlippedCard) == false)) {
        newlyFlippedCard.element.classList.remove("flipped");
        lastCardFlipped.element.classList.remove("flipped");
        lastCardFlipped = null;
        return;
    }
    else {
        incrementCounter("matches", document.getElementById("match-count"));
        matchAudio.play();
        newlyFlippedCard.element.classList.add("glow");
        lastCardFlipped.element.classList.add("glow");
        lastCardFlipped = null;
    }

    //if matches == 6 then you win
    if (counters["matches"] == 6) {
        if (typeof winAudio.loop == 'boolean')
            winAudio.loop = true;
        else {
            winAudio.addEventListener('ended', function () {
                this.currentTime = 0;
                this.play();
            }, false);
        }
        winAudio.play();
        winAudio.volume = 0.8;
        pause();
        result("win");
    }
    lastCardFlipped = null;
}

function resetGame() {

    let cardContainer = document.getElementsByClassName("card");

    while (cardContainer.length > 0) {
        cardContainer[0].parentNode.removeChild(cardContainer[0]);
    }

    counters["flips"] = 0;
    document.getElementById("flip-count").innerHTML = 0;
    counters["matches"] = 0;
    document.getElementById("match-count").innerHTML = 0;

    counters = {}

    lastCardFlipped = null;

    document.getElementById("win").classList.add("hidden");
    document.getElementById("lose").classList.add("hidden");

    setUpGame();

    winAudio.pause();
    winAudio.currentTime = 0;

    loseAudio.pause();
    loseAudio.currentTime = 0;

    reset();
    pause();
}

setUpGame();

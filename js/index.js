// timer const
const timerText = document.querySelector('.timer');

// De constante van de knoppen die de value verhogen
const feedKnop = document.querySelector('#Feed');
const affectionKnop = document.querySelector('#Affection');
const energyKnop = document.querySelector('#Energy');
const sleepKnop = document.querySelector('#Sleep');
const shopKnop = document.querySelector('#Shop');

// De constante die de pijlen op het scherm verwerken
const leftArrow = document.querySelector('#Left');
const rightArrow = document.querySelector('#Right');

// Alle hamster states in een array
const hamsterStates = ["img/HamsterImages/Hamster.png", "img/HamsterImages/HamsterEating.png", "img/HamsterImages/HamsterExcercise.png", "img/HamsterImages/HamsterLoved.png"];
const hamsterCurrentImg = document.getElementById("hamsterStatus");

// de constante van de value bars boven in het scherm
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

// De constante die de achtergrond onderhoudt en verandert
const background = document.body

// De constante voor het toevoegen en zetten van een naam voor de hamster
const nameInput = document.getElementById("nameInput");
const confirmName = document.getElementById("confirmName")
const startScreen = document.getElementById("startScreen")

// De constante die de currency vanuit de html aanroepen en de totale currency reguleren
const currencyBox = document.getElementById('currencyBox')
const hamsterCurrency = document.getElementById('currency')
const currentEnergy = document.getElementById('currentEnergy')

// Images vam de buttons in de footer van de html
const feedImage = document.getElementById('foodIcon')
const energyImage = document.getElementById('energyIcon')

// Alle buttons in de shop overlay in eenn Array
const shopButton = [document.getElementById("foodItem1"), 
                    document.getElementById("foodItem2"), 
                    document.getElementById("foodItem3"), 
                    document.getElementById("foodItem4"),
                    document.getElementById("foodItem5"),
                    document.getElementById("foodItem6"),
                    document.getElementById("foodItem7"),
                    document.getElementById("foodItem8"),
                    document.getElementById("foodItem9"),
                    document.getElementById("foodItem10")]

// Alle foto's van de shop items in een Array
const shopItems = ["img/Items/ZonnebloemPit.png", 
                    "img/Items/Appel.png", 
                    "img/Items/Komkommer.png", 
                    "img/Items/Mais.png", 
                    "img/Items/Wortel.png", 
                    "img/Items/Snoepje.png", 
                    "img/Items/Pinda.png", 
                    "img/Items/Ball.png"]

// De constante die ervoor zorgt dat er frames worden aangemaakt voor de valuebars
const frame = function(){
    context.clearRect(0, 0, width, height);
    feedBar.show(context);
    energyBar.show(context);
    affectionBar.show(context);
    requestAnimationFrame(frame);
}

// De values voor de Feed, Affection en Exercise bar, deze variabelen geven de waarde van de huidige honger, affection en excercise niveaus van de hamster
let hungerValue = 100;
let affectionValue = 100;
let energyValue = 100;

let hungerValueIncrease = 3;
let energyDecrease = 20;

// Hamster sleep status
let hamsterSleepStatus = false;

// Shop overlay status
let shopActive = false;

// Background value
let backgroundChoice = 0;

// Timer let
let timeLeft = 30;
let timerActive = false;
let gameOver = false;

// lets voor de hamster states
let inActive = true;
let isExcercising = false;
let isEating = false;
let isLoved = false;
let isSleeping = false;

let eatingAudio = new Audio("sounds/eating-sound.mp3")
let sleepingAudio = new Audio("sounds/ticking-clock.mp3")
let lovedAudio = new Audio("sounds/loved-sound.mp3")

// lets die ervoor zorgen dat de naam en de status van de naam worden gecontroleerd
let hamsterName;
let nameIsChosen = false;

// deze lets berekenen en reguleren de currency die wij later berekenen vanuit de gebruikte energy
let foodCurrency = 0;
let chargedEnergy = 0;
let itemUnlocked = false;
let itemLocked = true;

// De breedte en hoogte van de canvas voor de value bars
let width = canvas.width = 220;
let height = canvas.height = 220;
let valueBarwidth = 180;
let valueBarHeight = 30;
let x = width / 2 - valueBarwidth / 2;

// de constante van de value bars, hier worden de dimensies aangeroepen en bepaald
let feedBar;
let energyBar;
let affectionBar;

/* Credit and source code from https://youtu.be/Wh2kVSPi_sE?si=cZQ6R1wQ8Q0zlcaY */
// De class die value bars met preset parameters meegeeft
class ValueBar {
    constructor(x, y, w, h, maxValue, color){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.maxValue = maxValue;
        this.maxWidth = w;
        this.value = maxValue;
        this.color = color;
    }

    show(context){
        context.lineWidth = 3.5;
        context.strokeStyle = "#333";
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.w, this.h);
        context.strokeRect(this.x, this.y, this.maxWidth, this.h);
    }

    updateValue(val){
        if(val >= 0) {
            this.value = val;
            this.w = (this.value / this.maxValue) * this.maxWidth;
        }
    }
}

// de constante van de value bars, hier worden de dimensies aangeroepen en bepaald
feedBar = new ValueBar(x, 40, valueBarwidth, valueBarHeight, hungerValue, "blue");
energyBar = new ValueBar(x, 90, valueBarwidth, valueBarHeight, energyValue, "red");
affectionBar = new ValueBar(x, 140, valueBarwidth, valueBarHeight, affectionValue, "yellow");

// De functie die ervoor zorgt dat de naam wordt opgeslagen en wordt gebruikt door de hele game heen
function saveName() {
    hamsterName = nameInput.value;
    if(nameInput.value == ""){
        nameIsChosen = false;
    } else {
        nameIsChosen = true;
        startScreen.style.display = "none"
        currencyBox.style.display = "block";
    }
}

// Timer function
function Timer(){
    if(timerActive == true){
        timerText.textContent = timeLeft;
        timeLeft--;
    } 
    resetTimer();
    endGame();
}

// Reset de timer
function resetTimer(){
    if (timerActive == false){
        timeLeft = 30;
        timerText.textContent = null;
    } 
}

// De hamsterStateChange() functie zorgt ervoor dat de plaatjes van de hamster daadwerkelijk veranderen als je op een knop klikt
function hamsterStateChange() {
    if (inActive == true){
        hamsterCurrentImg.src = hamsterStates[0];
    } else if(isSleeping == true){
        hamsterAsleep();
    } else if(isEating == true){
        inActive = false;
        hamsterCurrentImg.src = hamsterStates[1];
    } else if(isExcercising == true){
        hamsterCurrentImg.src = hamsterStates[2];
        inActive = false;
    } else if(isLoved == true){
        hamsterCurrentImg.src = hamsterStates[3];
        inActive = false;
    }
}

// Deze functie zorgt ervoor dat er constant een value van de valuebars af gaat
function updateValues() {
    if(nameIsChosen == true){
        if(hungerValue <= 100){
            hungerValue -= Math.floor(Math.random() * 2);
        } else if (hungerValue <= 10){
            hungerValue--
        }
    
        if(affectionValue <= 100 && hamsterSleepStatus == false){
            affectionValue -= Math.floor(Math.random() * 2);
        } else if (affectionValue <= 10 && hamsterSleepStatus == false){
            affectionValue--
        }
    }
}

// Deze functie houdt de valuebars bij en zorgt ervoor dat de values ook daadwerkelijk worden ge-update
function updateBar(){
    feedBar.updateValue(hungerValue);
    energyBar.updateValue(energyValue);
    affectionBar.updateValue(affectionValue);

    if(hungerValue == 0){
        document.getElementById("foodProblem").style.display = "block";
        document.getElementById("foodProblem").textContent = hamsterName + " is very hungry...";
        timerActive = true;
    } else if(hungerValue >= 0){
        document.getElementById("foodProblem").style.display = "none";
    }

    if(energyValue == 0){
        document.getElementById("excerciseProblem").style.display = "block";
        document.getElementById("excerciseProblem").textContent = hamsterName + " is becoming less active...";
        timerActive = true;
    } else if(energyValue >= 0) {
        document.getElementById("excerciseProblem").style.display = "none";
    }

    if(affectionValue == 0){
        document.getElementById("LoveProblem").style.display = "block";
        document.getElementById("LoveProblem").textContent = hamsterName + " is very sad...";
        timerActive = true;
    } else if(affectionValue >= 0) {
        document.getElementById("LoveProblem").style.display = "none";
    }
}

// De Setlimit() functie zorgt ervoor dat de value bars niet boven en onder bepaalde values kunnen komen
function setLimit() {
    if (hungerValue >= 100){
        hungerValue = 100;
    } else if (hungerValue <= 0){
        hungerValue = 0;
    } 

    if (energyValue >= 100){
        energyValue = 100;
    } else if(energyValue <= 0){
        energyValue = 0;
    } else if (isSleeping == true){
        energyValue++;
    }

    if (affectionValue >= 100){
        affectionValue = 100;
    } else if (affectionValue <= 0){
        affectionValue = 0;
    }

    if(timeLeft == 0){
        gameOver = true;
    } else if(timeLeft <= 0){
        timeLeft = 0;
    }
}

// De komende drie functies zorgen ervoor dat de valuebuttons functioneel zijn en dat er een value af of bij komt
// De code lijkt super veel op elkaar, maar als ik ze gebruik via parameters kloppen de functies niet meer :(
function increaseHunger() {
    hungerValue += Math.floor(Math.random() * hungerValueIncrease);
    disableButton(feedKnop, "feed", "disabledfeed", 2000);
    eatingAudio.play();
    inActive = false;
    isEating = true;
    timerActive = false;
    setTimeout(function(){
        isEating = false;
        inActive = true;
     },2000);
}

function increaseAffection() {
    affectionValue += Math.floor(Math.random() * 8);
    disableButton(affectionKnop, "affection", "disabledaffection", 2000);
    lovedAudio.play();
    isLoved = true;
    inActive = false;
    timerActive = false;
    setTimeout(function(){
        isLoved = false;
        inActive = true;
     },2000);
}

function decreaseEnergy() {
    energyValue -= Math.floor(Math.random() * energyDecrease);
    disableButton(energyKnop, "energy", "disabledeenergy", 3500);
    isExcercising = true;
    inActive = false;
    timerActive = false;
    setTimeout(function(){
        isExcercising = false;
        inActive = true;
     },3500);
}

// Veranderdt de classes en update de buttons doro de updateButtons() functie aan te roepen en toe te passen
function arrowUpdate(){
    background.removeAttribute("class");
    if(backgroundChoice == 0){
        background.classList.add("homebackground");
        updateButtons("Feed", "Energy", "Affection", "Left", "Right", "inline-block", "inline-block");
    } else if(backgroundChoice == 1){
        background.classList.add("foodbackground");
        updateButtons("Affection", "Energy", "Feed", "Left", "Right", "none", "inline-block");
    } else if(backgroundChoice == -1){
        background.classList.add("excercisebackground");
        updateButtons("Feed", "Affection", "Energy", "Left", "Right", "inline-block", "none");
    } 
}

// Een functie die de rechter de pijl aan de rechter kant van het scherm aanroept en funcitoneel maakt
function increaseArrow(){
    backgroundChoice += 1;
    if(backgroundChoice >= 1){
        backgroundChoice = 1;
    }
    arrowUpdate();
}

// Een functie die de rechter de pijl aan de linker kant van het scherm aanroept en funcitoneel maakt
function decreaseArrow(){
    backgroundChoice -= 1;
    if(backgroundChoice <= -1){
        backgroundChoice = -1;
    }
    arrowUpdate();
}

// Opent de "Hamster Asleep" overlay in de html file past de status van de hamster aan
function hamsterAsleep(){
    document.getElementById("asleepOverlay").style.display = 'block';
    hamsterCurrentImg.src="img/HamsterImages/HamsterAsleep.png";
    sleepingAudio.play();
    isSleeping = true;
    inActive = false;
    chargedEnergy++;
    if(energyValue == 100){
        document.getElementById("asleepOverlay").style.display = 'none';
        hamsterCurrentImg.src="img/HamsterImages/Hamster.png";
        isSleeping = false;
        sleepingAudio.pause()
        sleepingAudio.currentTime = 0
    }
}

// De functies die ervoor zorgen dat de currency werkt
function updateCurrency(){
    hamsterCurrency.textContent = "FoodPoints:  " + foodCurrency;
    currentEnergy.textContent = "Charged Energy:  " + chargedEnergy;
    if(chargedEnergy == 100 || chargedEnergy > 100){
        foodCurrency += 1;
        chargedEnergy -= 100;
    }
}
// Opent de Shop overlay in de html file
function openShop(){
    shopActive = !shopActive;
    if(shopActive == true){
        document.getElementById("shopOverlay").style.display = 'block';
    } else {
        document.getElementById("shopOverlay").style.display = 'none';
    }
}

// Door gebruik te maken van let energyDecrease reguleer ik de decrease die van de EnergyValue wordt gehaald, ik verander ook de source van een foto
function energyDrainBuff(){
    if(foodCurrency == 5 || foodCurrency > 5){
        energyDecrease = 40;
        foodCurrency -= 5;
        energyImage.src = "img/Icons/Ball.png"
    }
}

// Deze functie zorgt ervoor dat als de hamster niet goed wordt verzorgt, dat de game eindigt.
function endGame(){
    if(gameOver == true){
        document.getElementById("endScreen").style.display = 'block';
        setTimeout(function(){
            location.reload();
         },5000);
    }
}

// Een simpele functie die ervoor zorgt dat de HungerValue in één keer gebuffed wordt naar 100%
function valueBuff(currencyInput){
    if(foodCurrency == currencyInput || foodCurrency > currencyInput){
        foodCurrency -= currencyInput;
    }
}

// Deze functie houdt buttons bij per pagina en zorgt ervoor dat de visuals veranderd als je op een button clickt
function updateButtons(notactive, notactive2, activebutton, arrowLeft, arrowRight, status, status2){
    document.getElementById(notactive).style.display = 'none';
    document.getElementById(notactive2).style.display = 'none';
    document.getElementById(activebutton).style.display = 'inline-block';
    document.getElementById(arrowLeft).style.display = status;
    document.getElementById(arrowRight).style.display = status2;
}

// Een preset function die ervoor zorgt dat ik makkelijk knoppen kan bedienen die de values aanpassen en kunnen disablen
function disableButton(buttonContext, css, cssDisabled, timeDisabled){
    buttonContext.disabled = true;
    buttonContext.classList.add(cssDisabled) 
    setTimeout(function(){
        buttonContext.disabled = false; 
        buttonContext.removeAttribute("class");
        buttonContext.classList.add(css) },timeDisabled);
}

// Creeërt de frames binnen de canvas
frame();

// Zorgt ervoor dat bepaalde functies met inverallenn worden uitgevoerd, value van 1000ms = 1 seconde
setInterval(updateCurrency, 10)
setInterval(updateValues, 1250);
setInterval(setLimit, 100)
setInterval(updateBar, 10)
setInterval(Timer, 1000)
setInterval(hamsterStateChange, 10)


// Alle EventListeners in een rijtje
feedKnop.addEventListener('click', increaseHunger);
affectionKnop.addEventListener('click', increaseAffection);
energyKnop.addEventListener('click', decreaseEnergy);
sleepKnop.addEventListener('click', hamsterAsleep);
shopKnop.addEventListener('click', openShop);
leftArrow.addEventListener('click', increaseArrow);
rightArrow.addEventListener('click', decreaseArrow);
confirmName.addEventListener('click', saveName);

// Deze laatste eventlisteners zijn anders dan de standaard, deze eventlisteners reguleren de shop buttons in de shop overlay, elke eeft zijn eigen berekening
shopButton[7].addEventListener("click", energyDrainBuff);
shopButton[8].addEventListener("click", () => { valueBuff(8); hungerValue = 100;});
shopButton[9].addEventListener("click", () => { valueBuff(8); affectionValue = 100;});

for (let i = 0; i < 7; i++) {
    shopButton[i].addEventListener("click", function(){
        if(foodCurrency == (i + 1) || foodCurrency > (i + 1)){
            foodCurrency -= (i + 1)
            feedImage.src = shopItems[i];
            hungerValueIncrease = Math.floor(Math.random() * 10) + (i * 2);
        }
    });
}
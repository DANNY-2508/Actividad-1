const cards = document.querySelectorAll(".card");
let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;
function flipCard({target: clickedCard}) {
	/*Logica de las cartas para que tengan una cara frontal y otra trasera, de esta*/
    if(cardOne !== clickedCard && !disableDeck) {
        clickedCard.classList.add("flip");
        if(!cardOne) {
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;
        disableDeck = true;
        let cardOneImg = cardOne.querySelector(".back-view img").src,
        cardTwoImg = cardTwo.querySelector(".back-view img").src;
        matchCards(cardOneImg, cardTwoImg);
    }
}
/*Logica para cuando las cartas coinciden*/
function matchCards(img1, img2) {
    if(img1 === img2) {
        matched++;
        if(matched == 8) {
            setTimeout(() => {
                return shuffleCard();
            }, 1000);
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return disableDeck = false;
    }
	/*Animaciones para cuando las cartas son incorrectas*/
    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 400);
    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = "";
        disableDeck = false;
    }, 1200);
}
/*Cuando el memorama se resuelve las cartas se revuelven de manera aleatoria bajo el algoritmo de abajo*/
function shuffleCard() {
    matched = 0;
    disableDeck = false;
    cardOne = cardTwo = "";
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);
    cards.forEach((card, i) => {
        card.classList.remove("flip");
        let imgTag = card.querySelector(".back-view img");
       // imgTag.src = `./Multimedia/img-${arr[i]}.png`;
        imgTag.src = `/Memorama/imagenes/${arr[i]}.png`;
        card.addEventListener("click", flipCard);
    });
}
shuffleCard();
    
cards.forEach(card => {
    card.addEventListener("click", flipCard);
});

/*Modo oscuro*/
function toggleDarkMode() {
	var body = document.body;
	body.classList.toggle("dark-mode");
}

//Variables globales, Inicio del Contador

let milisegundos = 0;
let segundos = 0;
let minutos = 0;
let intervalId = null;
let tiempos = [];

// Función para actualizar el cronómetro
function actualizarCronometro() {
	milisegundos++;
	if (milisegundos >= 100) {
		milisegundos = 0;
		segundos++;
		if (segundos >= 60) {
			segundos = 0;
			minutos++;
		}
	}

	// Agregar ceros a la izquierda si el valor es menor a 10
	let strMilisegundos = milisegundos.toString().padStart(2, '0');
	let strSegundos = segundos.toString().padStart(2, '0');
	let strMinutos = minutos.toString().padStart(2, '0');

	// Actualizar el display del cronómetro
	//document.getElementById("milisegundos").textContent = strMilisegundos;
	document.getElementById("segundos").textContent = strSegundos;
	document.getElementById("minutos").textContent = strMinutos;
}

// Función para iniciar o detener el cronómetro
function startStop() {
	let btnStartStop = document.getElementById("btn-start-stop");
	if (intervalId === null) {
		// Iniciar el cronómetro
		intervalId = setInterval(actualizarCronometro, 10);
		btnStartStop.textContent = "Detener";
	} else {
		// Detener el cronómetro y guardar el tiempo
		clearInterval(intervalId);
		intervalId = null;
		btnStartStop.textContent = "Iniciar";
		let tiempoActual = `${minutos}:${segundos.toString().padStart(2, '0')}.${milisegundos.toString().padStart(2, '0')}`;
		tiempos.push(tiempoActual);
		tiempos.sort();
		let tabla = document.getElementById("tabla").getElementsByTagName('tbody')[0];
		tabla.innerHTML = "";
		for (let i = 0; i < tiempos.length; i++) {
			let row = tabla.insertRow(i);
			let posicion = row.insertCell(0);
			let tiempo = row.insertCell(1);
			posicion.innerHTML = i + 1;
			tiempo.innerHTML = tiempos[i];
		}
		milisegundos = 0;
		segundos = 0;
		minutos = 0;
		actualizarCronometro();
	}
}

// Función para reiniciar el cronómetro y la tabla
function reset() {
	clearInterval(intervalId);
	intervalId = null;
	document.getElementById("btn-start-stop").textContent = "Iniciar";
	milisegundos = 0;
	segundos = 0;
	minutos = 0;
	actualizarCronometro();
	tiempos = [];
	document.getElementById("tabla").getElementsByTagName('tbody')[0].innerHTML = "";
}
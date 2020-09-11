const score = document.querySelector(".score"),
      start = document.querySelector(".start"),
      gameArea = document.querySelector(".gameArea"),
      car = document.createElement('div');

car.classList.add('car');
      

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
   ArrowUp: false,
   ArrowDown: false,
   ArrowRight: false,
   ArrowLeft: false
}

const setting = {
   start: false,
   score: 0,
   speed: 3,
   traffic: 3
}

function getQuantityElements(heightElement) {
   return document.documentElement.clientHeight / heightElement + 1;
}


function startGame() {
   start.classList.add("hide");
   gameArea.innerHTML = '';

   for (let i = 0; i < getQuantityElements(100); i++) {  // 20 линий
      const line = document.createElement('div'); // создаем элемент линии
      line.classList.add('line'); // добавляем класс со стилями
      line.style.top = (i * 75) + 'px'; // добавим стиль top: i*50px
      line.y = i * 100;
      gameArea.appendChild(line); // расположем линии на экране
   }

   for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
      const enemy = document.createElement('div');
      enemy.classList.add('enemy');
      enemy.y = -100 * setting.traffic * (i + 1); // автомобили распологались друг от друга
      enemy.style.top = enemy.y + 'px';
      enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
      enemy.style.background = "transparent url('image/enemy.png') center / cover no-repeat"
      gameArea.appendChild(enemy); // расположем автомобили на игровой области
   }

   setting.score = 0;
   setting.start = true;
   gameArea.appendChild(car);
   
   car.style.left = gameArea.offsetWidth/2 - car.offsetWidth/2;
   car.style.bottom = '10px';
   car.style.top = 'auto';
   
   setting.x = car.offsetLeft; // смещение относительно левого края родителя
   setting.y = car.offsetTop; // смещение относительно верхнего края родителя
   requestAnimationFrame(playGame);
}

function playGame() {
   setting.score += setting.speed;
   score.innerHTML = 'SCORE<br>' + setting.score;
   moveRoad();
   moveEnemy();
   if (setting.start === true) { // проверяем если игра запущена
      if (keys.ArrowLeft && setting.x > 0) { // если клавиша "влево" зажата И смещение больше нуля
         setting.x -= setting.speed; // присвоение с вычитанием
      }
      if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) { // если клавиша "влево" зажата И смещение по иксу меньше чем "ширина дороги - ширина автомобиля"
         setting.x += setting.speed; // присвоение со сложением
      }

      if (keys.ArrowUp && setting.y > 0) { // если клавиша "вверх" зажата И смещение больше нуля
         setting.y -= setting.speed; // присвоение со сложением
      }
      if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) { // если клавиша "вниз" зажата
         setting.y += setting.speed; // присвоение со сложением
      }

      car.style.left = setting.x + 'px'; // передаем значение setting.x в стили позиции автомобиля
      car.style.top = setting.y + 'px'; // передаем значение setting.y в стили позиции автомобиля
      requestAnimationFrame(playGame); // рекурсия
   }
   
}


function startRun(event) {
   if (event.key !== 'F5' || event.key !== F12) {
      event.preventDefault();
      keys[event.key] = true;
   }
}

function stopRun() {
   keys[event.key] = false;
}

function moveRoad() {
   let lines = document.querySelectorAll('.line');
   lines.forEach(function(line) {
      line.y += setting.speed;
      line.style.top = line.y + 'px';

      if (line.y >= document.documentElement.clientHeight) {
         line.y = -100;
      }
   }) // перебрать все элементы, запускается столько, сколько у нас элементов
}

function moveEnemy() {
   let enemy = document.querySelectorAll('.enemy');

   enemy.forEach(function(item) {
      let carRect = car.getBoundingClientRect();
      let enemyRect = item.getBoundingClientRect();

      if (carRect.top <= enemyRect.bottom && 
         carRect.right >= enemyRect.left &&
         carRect.left <= enemyRect.right &&
         carRect.bottom >= enemyRect.top) { // столкновения
            console.warn("ДТП");
            setting.start = false;
            start.classList.remove('hide');
            start.style.top = start.offsetHeight;
      }

      item.y += setting.speed / 2;
      item.style.top = item.y + 'px';
      if (item.y >= document.documentElement.clientHeight) {
         item.y = -100 * setting.traffic;
         item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
      }
   });
}
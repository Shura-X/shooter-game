export default class Shots {
	constructor(player, enemies, context) {
		this._ctx = context;
		//[{enemies.x, enemies.y}, {...}]
		this._enemies = enemies.enemies;
		//radius, pos, mouse
		this._player = player;
		//let the radius of enemies = the radius of the player

		this._speed = 7.5; //7.5
		this._shots = [];
		this._radius = 5; //5 //radius of shots
		/*each shot has: {
			x, y,
			sin, cos
		}*/

		this._height = document.documentElement.clientHeight;
		this._width = document.documentElement.clientWidth;
	}

	//метод берёт координаты игрока и мыши, и на их
	//основе высчитывает sin и cos
	on_click(event) {
		let a = this._player.pos.y - event.clientY;
		let b = event.clientX - this._player.pos.x;

		let c = Math.sqrt( a**2 + b**2 );

		let sin = a/c;
		let cos = b/c;

		let x = this._player.pos.x + this._player.radius * cos;
		let y = this._player.pos.y + this._player.radius * (-sin);

		this._shots.push({x, y, sin, cos});
	};


	//метод перебирает массив выстрелов и домножает х и у
	//на нужный коэффициент  
	_move() {
		if (this._shots.length > 0) {	
			this._shots.forEach((shot, index) => {
				shot.x += shot.cos * this._speed;
				shot.y -= shot.sin * this._speed;
			
				//проверка на соприкосновение выстрела с врагом
				/*let check_for_touch = () => {
					return this._enemies.some(enemy => {
						return Math.abs(shot.x-enemy.x) < this._radius + this._player.radius ||
						Math.abs(shot.y-enemy.y) < this._radius + this._player.radius;
					});
				}*/

				//ф-ия для перебора массива врагов:
				//возвращает true, если враг поражён выстрелом

				//проблема в том, что мы возвращаем значение по катетам, а не по гипотенузе,
				//поэтому удаляются случайные шары. та же проблема и в enemies.js
				let check_for_touch = (enemy, index) => {
					/*return Math.abs(enemy.x-shot.x) < this._radius + this._player.radius ||
					Math.abs(shot.y-enemy.y) < this._radius + this._player.radius;*/

					let a = Math.abs(shot.y - enemy.y);
					let b = Math.abs(shot.x - enemy.x);
					let c = Math.sqrt( a**2 + b**2 );

					return (c < this._radius + this._player.radius) ? true : false;
				}

				if ( this._enemies.some( check_for_touch ) ) {
					//удалить текущий выстрел из массива
					this._shots.splice(index, 1);

					//массив элементов врагов, которые нужно удалить:
					let to_delete = this._enemies.map((item, index) => {
						return {
							x: item.x,
							y: item.y,
							index
						};
					}).filter( check_for_touch );
				
					for (let item of to_delete) {
						this._enemies.splice(item.index, 1);
					}
				};

				//проверка на то, чтобы выстрелы удалялись за экраном:
				if (shot.x > this._width - this._radius || //выпал вправо
					shot.x < this._radius || //выпад влево
					shot.y > this._height - this._radius || //выпал вниз
					shot.y < this._radius) { //выпал вверх
					this._shots.splice(index, 1);
				}

				console.log(this._shots.length);
			});
		}
	}


	//метод рендерит уже вычисленыне значения выстрелов
	_render() {
		this._ctx.fillStyle = '#05deff';
		if (this._shots.length > 0) {
			this._shots.forEach(item => {
				this._ctx.beginPath();
				this._ctx.arc(item.x, item.y, this._radius, 0, Math.PI*2);
				this._ctx.fill();
			});
		}
	}


	go() {
		this._move();
		this._render();
	}
}
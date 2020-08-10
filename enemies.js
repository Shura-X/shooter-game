export default class Enemies {
	constructor(player, context) {
		this.enemies = [];
		this._ctx = context;
		this.radius = 25;
		this._player = player;
		this._speed = 1.5;

		this._height = document.documentElement.clientHeight;
		this._width = document.documentElement.clientWidth;
	}


	//метод асинхронно генерирует через каждую 
	//секунду по врагу если необходимо
	_generate() {
		//асинхронная ф-ия:
		let func = () => {
			if (this.enemies.length < 10) {
				let generate_coords = () => {
					x = Math.random() * this._width;
					y = Math.random() * this._height;

					//проверка, чтобы враг не герерировался за экраном
					if (x < this.radius) {
						x = this.radius;
					}

					if (x > this._width - this.radius) {
						x = this._width - this.radius;
					}

					if (y < this.radius) {
						y = this.radius;
					}

					if (y > this._height - this.radius) {
						y = this._height - this.radius;
					}
				}

				let x, y;
				generate_coords()

				//проверка на то, что новый враг не будет сливаться с другими:
				while (this.enemies.some(item => { //true, если пересекается хоть с одним
					return Math.abs(x-item.x) < this.radius*2 || 
						Math.abs(y-item.y) < this.radius*2;
				})) {
					generate_coords();
				};

				let check_for_player = () => {
					let a = Math.abs( this._player.pos.x - x );
					let b = Math.abs( this._player.pos.y - y );
					let c = Math.sqrt( a**2 + b**2 );

					//true если "слипается"
					return c < this.radius + this._player.radius;
				}

				//проверка на то, что новый враг не будет сливаться с игроком:
				while ( check_for_player() ) {
					generate_coords();
				}

				let direction = Math.floor(Math.random() * 4);

				switch (direction) {
					case 0:
						this.enemies.push({
							from: 'top',
							x, 
							y: this.radius
						});
						break;

					case 1:
						this.enemies.push({
							from: 'left',
							y,
							x: this.radius
						});
						break;

					case 2:
						this.enemies.push({
							from: 'bottom',
							x,
							y: this._height - this.radius
						});
						break;

					case 3:
						this.enemies.push({
							from: 'right',
							y,
							x: this._width - this.radius
						})
						break;
				}

				setTimeout(func.bind(this), 2500);
			};
		};

		func();
	}

	//метод, высчитывающий (ко)синус угла м-ду игроком и каждым врагом
	_calc_angle(item) {
		//находим катет:
		let a = this._player.pos.y - item.y;
		let b = item.x - this._player.pos.x; 
		//находим гипотенузу:
		let c = Math.sqrt( a**2 + b**2 );

		let sin = a/c;
		let cos = b/c;

		return {sin, cos};
	}


	//метод заставляет всех врагов двигаться
	_move() {
		for (let i = 0; i < this.enemies.length; i++) {
			let {sin, cos} = this._calc_angle(this.enemies[i]);

			//(ко)синус угла помогает врагам двигаться свободно
			this.enemies[i].x -= cos * this._speed;
			this.enemies[i].y -= (-sin) * this._speed;

			//скрипт смотрит, есть ли такие враги, которые слиплись с текущим:
			let bumped = this.enemies.filter(item => { //true, если пересекается хоть с одним
				//console.log('from filter');
				/*return Math.abs(this.enemies[i].x-item.x) <= this.radius*2 || 
					Math.abs(this.enemies[i].y-item.y) <= this.radius*2;*/
				//проверка на равенство item и текущего элемента
				if (item === this.enemies[i]) return false;

				let a = Math.abs( this.enemies[i].x - item.x );
				let b = Math.abs( this.enemies[i].y - item.y );
				let c = Math.sqrt( a**2 + b**2 );

				return (c < this.radius*2) ? true : false;
			}); //проблема такого скрипта в том, что при проверке в filter 
			//итерируется тот же самый элемент врага, из-за этого он сам себя удаляет

			if ( bumped.length > 0 ) {
				for (let j = 0; j < bumped.length; j++) {
					let a = this.enemies[i].y - bumped[j].y;
					let b = bumped[j].x - this.enemies[i].x;

					//console.log('coords: ' + a + ' ' + b);

					let c = Math.sqrt( a**2 + b**2 );

					let sin = a/c;
					let cos = b/c;

					this.enemies[i].x -= cos * this._speed;
					this.enemies[i].y += sin * this._speed;

					//console.log( this.enemies[i] );
				}
			}
		};
	}


	//метод рендерит врагов из их координат
	_render() {
		this.enemies.forEach((item) => {
			this._ctx.fillStyle = 'red';
			this._ctx.beginPath();
			this._ctx.arc(item.x, item.y, this.radius, 0, Math.PI*2);
			this._ctx.fill();
		});
	}


	//основной метод, запускающий все остальные
	go() {
		this._generate();
		this._move();
		this._render();
		this._stop();
	}

	_stop() {
		this.enemies.forEach(item => {
			let a = this._player.pos.y - item.y;
			let b = item.x - this._player.pos.x; 
			//находим гипотенузу:
			let c = Math.sqrt( a**2 + b**2 );

			if ( Math.abs(c) < this.radius + this._player.radius ) {
				window.requestAnimationFrame = null;
				alert('Game Over!');
				location.reload();
			};
		});
	}
}
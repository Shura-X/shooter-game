export default class Player {
	constructor(position, context) {
		//document of {x, y}
		this.pos = position;
		this.ctx = context;
		this.radius = 25;
		this.mouse = {
			x: 0,
			y: 0
		}
	
		/*объект действий, показывающий,
		какие клавиши зажаты и какие действия нужно выполнять*/
		this._map = {
			'KeyW': false,
			'KeyA': false,
			'KeyS': false,
			'KeyD': false,
		};
		//this._x = x;
		//this._y = y;
	}


	//статичная переменная нужна для того, чтобы другие классы и ф-ии
	//могли взять данные о местонахождении игрока
	/*static mouse = {
		x: 0,
		y: 0,
	}


	static pos = {
		y: this._y,
		x: this._x,
	}*/


	/*при нажатии происходит wasd_down.
	Тогда объекту действий передаёт true для соотв. действия.*/
	wasd_down(event) {
		//если нажата была другая клавиша, то прервать действие
		if (event.code != 'KeyW' &&
			event.code != 'KeyA' &&
			event.code != 'KeyS' &&
			event.code != 'KeyD') return;

		if ( !Object.values(this._map).some(item => item) ) {
			this._map[event.code] = true;
			this._process_events(this._map);
		} else {
			this._map[event.code] = true;
		}
	}


	//метод считывает, какая клавиша была отжата и в объекте действий 
	//ставит false на соответствующее действие
	wasd_up(event) {
		if (event.code != 'KeyW' &&
			event.code != 'KeyA' &&
			event.code != 'KeyS' &&
			event.code != 'KeyD') return;

		this._map[event.code] = false;
	}


	/*метод проверяет, есть ли в объекте действий хоть одно true.
	Тогда создаётся масссив с текущими действиями (sorted).
	Далее вызывается каждое действие, и в зависимости от его названия 
	изменяется соответствующая координата игрока.*/
	_process_events() {
		let move = () => {
			if ( Object.values(this._map).some(item => item) ) {
				let sorted = {}
				//сортировка объекта на трушные
				for (let item in this._map) {
					if (this._map[item] == true) sorted[item] = this._map[item];
				}

				for (let item of Object.keys(sorted)) {
					let speed = 1.5;
					switch (item) {
						case 'KeyW':
							this.pos.y-=speed;
							break;
						case 'KeyA':
							this.pos.x-=speed;
							break;
						case 'KeyS':
							this.pos.y+=speed;
							break;
						case 'KeyD':
							this.pos.x+=speed;
							break;
					}
				}

				//набор условий, чтобы игрок не выпадал за экран
				if (this.radius + this.pos.y > document.documentElement.clientHeight) {
					this.pos.y = document.documentElement.clientHeight - this.radius;
				}

				if (this.pos.y < this.radius) {
					this.pos.y = this.radius;
				}

				if (this.pos.x < this.radius) {
					this.pos.x = this.radius;
				}

				if (this.radius + this.pos.x > document.documentElement.clientWidth) {
					this.pos.x = document.documentElement.clientWidth - this.radius;
				}

				setTimeout(move, 5);
			}	
		}

		move();
 	}


 	//ф-ия трекерит движения мыши, нужно для движения ствола
 	mousemove(event) {
 		this.mouse = {
 			x: event.clientX,
 			y: event.clientY,
 		}
 	}


 	//метод отменяет все нажатия (всем элем-ам false в _map)
 	//когда страница не активна
 	doc_unfocus(event) {
 		for (let item in this._map) {
 			this._map[item] = false;
 		}
	}


 	//ф-ия высчитывает из текущего положения мыши угол,
 	//на который нужно отклонить пушку от горизонтальной оси 
 	_calc_angle() {
 		//чертежи угла см. в блокноте
 		//находим катеты тр-ка
 		let a = this.pos.y - this.mouse.y;
 		let b = this.mouse.x - this.pos.x;
 		//находим гипотенузу тр-ка
 		let c = Math.sqrt( a**2 + b**2 );

 		let sin = a/c;
 		let cos = b/c;

 		//console.log(sin);
 		//console.log(cos);

 		//если в угол в 1 четверти:
 		if (sin > 0 && cos > 0) {
 			return Math.asin(sin);
 		}
 		//если угол во 2 четверти:
 		if (sin > 0 && cos < 0) { //problem here
 			return Math.abs(Math.acos(cos));
 		}
 		//если угол в 3 четверти:
 		if (sin < 0 && cos < 0) {
 			return Math.abs(Math.asin(sin)) + Math.PI;
 		}
 		//если угол в 4 четверти:
 		if (sin < 0 && cos > 0) {
 			return Math.PI/2 - Math.acos(cos) + Math.PI*1.5;
 		}
 	}


	render() {
		this.ctx.fillStyle = '#17FF00';
		this.ctx.beginPath();
		this.ctx.arc(this.pos.x, this.pos.y, 25, 0, Math.PI*2);
		this.ctx.fill();

		let angle = this._calc_angle();

		this.ctx.beginPath();
		this.ctx.lineWidth = 25;
		this.ctx.strokeStyle = '#17FF00';
		this.ctx.arc(this.pos.x, this.pos.y, this.radius, -angle-Math.PI/24, -angle+Math.PI/24);
		this.ctx.stroke();
	}
}
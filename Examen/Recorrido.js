class Recorrido extends THREE.Object3D {
	constructor(gui, titleGui) {
		super();

		// Se crea la parte de la interfaz que corresponde a la caja
		// Se crea primero porque otros métodos usan las variables que se definen para la interfaz
		this.createGUI(gui, titleGui);

		// Se crean los materiales
		this.createMaterials();

		//this.cargarModelo();
		this.pacman=this.crearPacman();
		this.add(this.pacman);
		this.crearSpline();
		this.crearTween();

		var geometriaLinea = new THREE.Geometry();
		geometriaLinea.vertices = this.spline.getPoints(100);
		var line_spline = new THREE.Line(geometriaLinea, this.lines_material);
		this.add(line_spline);


	}

	crearPacman(){
		var geometria = new THREE.SphereBufferGeometry(3, 16, 16, Math.PI / 2, Math.PI * 2, 0, 0.5 * Math.PI);
		var bola1 = new THREE.Mesh(geometria, this.material_amarillo);
		this.bola2=bola1.clone()
		this.bola2.rotation.x=Math.PI*1.2;
		this.bola2.translate.y=-3;
		this.pacman = new THREE.Object3D();
		this.pacman.add(bola1);
		this.pacman.add(this.bola2);

		return this.pacman;

	}


	crearSpline(){
		var altura = 15;
        this.spline = new THREE.CatmullRomCurve3([


			new THREE.Vector3(+0, altura, +0),
			new THREE.Vector3(+0, altura, 10),
			new THREE.Vector3(40, altura, 10),
			new THREE.Vector3(40, altura, -10),
			new THREE.Vector3(30, altura, -10),
			new THREE.Vector3(30, altura, 0),
			new THREE.Vector3(+0, altura, +0)

		]);
	};
	
	crearTween(){
		this.parametro = 0;
		
        var destino = {x: 0.5};
        var origen = {x: 0};
        this.loop1 = 4000;
        this.movimiento = new TWEEN.Tween(origen).to(destino, this.loop1);
        this.movimiento.easing(TWEEN.Easing.Quadratic.InOut);

        var that = this;
        this.movimiento.onUpdate(function () {
            that.parametro = origen.x;
            var posicion = that.spline.getPointAt(that.parametro);
			that.pacman.position.copy(posicion);

            var tangente = that.spline.getTangentAt(that.parametro);
            posicion.add(tangente);
			that.pacman.lookAt(posicion);
        });
		var origen2 = { x: 0.5 };
		var destino2 = { x: 1 };
		this.loop2 = 6000;
		this.movimiento2 = new TWEEN.Tween(origen2).to(destino2, this.loop2);
		this.movimiento2.easing(TWEEN.Easing.Quadratic.InOut);

		this.movimiento2.onUpdate(function () {
			that.parametro = origen2.x;
			var posicion = that.spline.getPointAt(that.parametro);
			that.pacman.position.copy(posicion);

			var tangente = that.spline.getTangentAt(that.parametro);
			posicion.add(tangente);
			that.pacman.lookAt(posicion);

		});


		this.movimiento2.chain(this.movimiento);
		this.movimiento.chain(this.movimiento2);

		this.movimiento2.start();


    };

	createMaterials() {
		// Material de los puntos
		this.points_material = new THREE.PointsMaterial({
			color: 0xda1719,
			size: 0.2,
		});

		this.material_amarillo = new THREE.MeshPhongMaterial({
			color: 0xffff00 ,
			side: THREE.DoubleSide,
			flatShading: true, //Sombreado plano
		});

		this.material_azul = new THREE.MeshPhongMaterial({
			color: 0x0b2fd4,
			side: THREE.DoubleSide,
			flatShading: true, //Sombreado plano
		});

		// Material de las lineas
		this.lines_material = new THREE.LineBasicMaterial({
			color: 0xffffff,
			linewidth: 1.5,
			// linecap: 'round', //ignored by WebGLRenderer
			// linejoin:  'round' //ignored by WebGLRenderer
		});

		// Material del objeto
		this.object_material = new THREE.MeshPhongMaterial({
			color: 0xda1719,
			side: THREE.DoubleSide,
			flatShading: true,
		});

		this.material_normal = new THREE.MeshNormalMaterial();
		this.material_normal.flatShading = true;
		this.material_normal.needsUpdate = true;
	};

	createGUI(gui, titleGui) {
		// Controles para el tamaño, la orientación y la posición de la caja

		this.guiControls = new function () {
			this.ver = true;

			// Un botón para dejarlo todo en su posición inicial
			// Cuando se pulse se ejecutará esta función.
			this.reset = function () {
				this.ver = true;
			}
		}

		var folder = gui.addFolder(titleGui);
		folder.add(this.guiControls, 'ver').name('Ver Objeto: ');
		folder.add(this.guiControls, 'reset').name('[ Reset ]');
	};

	update() {
		// this.getObjectByName("ironman").visible = this.guiControls.ver;
		this.pacman.visible = this.guiControls.ver;
		/*if (true) {
			if (this.bola2.rotation.x >= Math.PI * 0.25) gui.cambio_p2 = true;
			if (this.bola2.rotation.x <= -Math.PI * 0.25) gui.cambio_p2 = false;

			if (gui.cambio_p2) {
				this.bola2.rotation.z -= gui.velocidad_p2 * 0.05;
			} else {
				this.bola2.rotation.z += gui.velocidad_p2 * 0.05;
			}*/
		TWEEN.update();
		
		// Primero, el escalado
		// Segundo, la rotación en Z
		// Después, la rotación en Y
		// Luego, la rotación en X
		// Y por último la traslación
	};
}
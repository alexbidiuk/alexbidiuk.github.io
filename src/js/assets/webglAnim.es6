global.THREE = require('../lib/Three.js');
require('../lib/Projector.js');
require('../lib/CanvasRenderer.js');
let OrbitControls = require('three-orbit-controls')(THREE);
let webglAnimInstance = null;
module.exports = class WebglAnim {
    constructor() {
        this.isPaused = true;
        this.pause = this.pause.bind(this);
        this.container = document.querySelector('#home');
        this.mouseX = 0;
        this.mouseY = 0;
        this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.z = 200;
        this.camera.position.x = 600;
        this.camera.position.y = 600;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.CanvasRenderer({alpha: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        this.controls = new OrbitControls( this.camera );
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        document.addEventListener('pause_webgl', this.pause.bind(this));        
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.container.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
        this.container.addEventListener( 'touchstart', this.onDocumentTouchStart.bind(this), false );
        this.container.addEventListener( 'touchmove', this.onDocumentTouchMove.bind(this), false );
        this.drawAbstraction();
        this.start();
    }

    pause(event) {
        event.detail.pause ? this.isPaused = true : this.restart();
        this.controls.enabled = event.detail.pause ? false : true;   
    }

    drawAbstraction() {
        let points = this.pointDrawer();
        this.lineDrawer(points);
    }

    lineDrawer(pointsGeometry) {
        let line = new THREE.Line(pointsGeometry, new THREE.LineBasicMaterial({
            color: '#a75065',
            linewidth: 2,
            opacity: 1
        }));
        this.scene.add(line);
    }

    pointDrawer() {
        let PI2 = Math.PI * 2;
        let material = new THREE.SpriteCanvasMaterial({

            color: 0xffffff,
            program: function (context) {
                context.beginPath();
                context.arc(0, 0, 0, 0, PI2, true);
                context.fill();
            }
        });
        let geometry = new THREE.Geometry();

        for (let i = 0; i < 500; i++) {

            let particle = new THREE.Sprite(material);
            particle.position.x = Math.random() * 2 - 1;
            particle.position.y = Math.random() * 2 - 1;
            particle.position.z = Math.random() * 2 - 1;
            particle.position.normalize();
            particle.position.multiplyScalar(Math.random() * 10 + 450);
            particle.scale.x = particle.scale.y = 10;
            this.scene.add(particle);

            geometry.vertices.push(particle.position);

        }
        return geometry;
    }

    requestAnimFrame() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    }

    onWindowResize() {

        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);

    }

    onDocumentMouseMove(event) {
        this.mouseX = (event.clientX - this.windowHalfX);
        this.mouseY = (event.clientY - this.windowHalfY);
    }

    onDocumentTouchStart(event) {
        if (event.touches.length > 1) {
            this.mouseX = event.touches[0].pageX - this.windowHalfX;
            this.mouseY = event.touches[0].pageY - this.windowHalfY;
        }
    }

    onDocumentTouchMove(event) {
        if (event.touches.length == 1) {
            this.mouseX = event.touches[0].pageX - this.windowHalfX;
            this.mouseY = event.touches[0].pageY - this.windowHalfY;
        }
    }


    start() {
        if (this.isPaused) return;
        this.render();
        window.requestAnimationFrame(this.start.bind(this));
    }
    restart() {
        this.isPaused = false;
        this.start();
    }

    render() {
        this.camera.position.x += (this.mouseX - this.camera.position.x) * .0015;
        this.camera.position.y += (this.mouseY - this.camera.position.y) * .002;

        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }
}
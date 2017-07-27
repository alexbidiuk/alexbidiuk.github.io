global.THREE = require('../lib/Three.js');
require('../lib/Projector.js');
require('../lib/CanvasRenderer.js');
module.exports = class WebglAnim {
    constructor() {
        this.isPaused = false;
        this.pause = this.pause.bind(this);
        this.container = document.querySelectorAll('#home')[0];
        this.mouseX = 0;
        this.mouseY = 0;
        this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.z = 100;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.CanvasRenderer({ alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
        document.addEventListener('touchstart', this.onDocumentTouchStart.bind(this), false);
        document.addEventListener('touchmove', this.onDocumentTouchMove.bind(this), false);
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.drawAbstraction();
        this.start();
    }
    pause() {
        this.isPaused = !this.isPaused;
    }
    drawAbstraction() {
        let points = this.pointDrawer();
        this.lineDrawer(points);
    }
    lineDrawer(pointsGeometry) {
        let line = new THREE.Line(pointsGeometry, new THREE.LineBasicMaterial({ color: '#a75065', linewidth: 2, opacity: 1 }));
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

            event.preventDefault();

            this.mouseX = event.touches[0].pageX - windowHalfX;
            this.mouseY = event.touches[0].pageY - windowHalfY;

        }
    }

    onDocumentTouchMove(event) {

        if (event.touches.length == 1) {

            event.preventDefault();

            this.mouseX = event.touches[0].pageX - this.windowHalfX;
            this.mouseY = event.touches[0].pageY - this.windowHalfY;
        }
    }

    start() {
        if (!this.isPaused) {
            this.render();
        }
        window.requestAnimationFrame(this.start.bind(this));
    }

    render() {
        this.camera.position.x += (this.mouseX - this.camera.position.x) * .001;
        this.camera.position.y += (this.mouseY - this.camera.position.y) * .001;
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
    }
}
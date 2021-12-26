class Dot {
    constructor (main, deg) {
        this.main = main;
        this.rad = deg * Math.PI / 180;

        this.mouseX = this.main.mouseX;
        this.mouseY = this.main.mouseY;
        this.x = 0;
        this.y = 0;
        this.h = 0;
        this.g = 0;
        this.opacityFadeSpeed = 0.04;
        this.opacity = 1.0;
        this.gravity = this.main.gravity;
    }

    update () {
        // Update opacity
        this.opacity -= this.opacityFadeSpeed;
        if (this.opacity <= 0) this.reset();

        // Update Position
        this.x = Math.cos(this.rad) * this.h;
        this.y = Math.sin(this.rad) * this.h;

        this.y += this.g;

        this.h += this.main.speed;
        this.g += this.gravity;
        this.gravity += this.gravity / 5;

        // Draw
        this.main.ctx.beginPath();
        this.main.ctx.fillStyle = `hsla(${this.main.hue}, 100%, 80%, ${this.opacity})`;
        this.main.ctx.arc(this.mouseX + this.x, this.mouseY + this.y, 2, 0, 6.283185307179586);
        this.main.ctx.fill();
    }

    reset () {
        this.x = 0;
        this.y = 0;
        this.h = 0;
        this.g = 0;
        this.mouseX = this.main.mouseX;
        this.mouseY = this.main.mouseY;
        this.opacity = 1.0;
        this.gravity = this.main.gravity;

        // Random
        this.rad = Math.round(Math.random() * 360) * Math.PI / 180;
        this.opacityFadeSpeed = Math.random() * 0.5 + 0.025;
    }
}

class Main {
    constructor () {
        this.canvas = null;
        this.ctx = null;

        this.vw = 0;
        this.vh = 0;

        this.mouseX = 0;
        this.mouseY = 0;

        this.gravity = .25;
        this.hue = 0;
        this.speed = 7;

        this.dots = [];

        this.createCanvas();
        this.createDots();
        this.playBgMusic();
        this.updateMousePos();
        this.update();

        window.addEventListener('resize', () => this.resize());
    }

    createCanvas () {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.vw = this.canvas.width = window.innerWidth;
        this.vh = this.canvas.height = window.innerHeight;

        this.mouseX = this.vw / 2;
        this.mouseY = this.vh / 2;

        document.body.appendChild(this.canvas);
    }

    createDots () {
        for (let i = 0; i < 1000; i++) {
            this.dots.push(new Dot(this, i));
        }
    }

    playBgMusic () {
        let music = document.getElementById('music');
        
        window.addEventListener('mousedown', () => music.play());
    }

    updateMousePos () {
        window.addEventListener('mousemove', e => {
            let rect = this.canvas.getBoundingClientRect();

            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });
    }

    update () {
        // Clear
        this.ctx.clearRect(0, 0, this.vw, this.vh);

        // Update dots
        for (let i = 0; i < this.dots.length; i++) {
            this.dots[i].update();
        }

        // Update hue
        this.hue += 2;
        if (this.hue > 360) this.hue = 0;

        // Loop
        requestAnimationFrame(() => this.update());
    }

    resize () {
        this.vw = this.canvas.width = window.innerWidth;
        this.vh = this.canvas.height = window.innerHeight;
    }
}

let main = new Main();
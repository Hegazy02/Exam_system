class Beam {
    constructor(canvas) {
        this.canvas = canvas;
        this.direction = this.getRandomDirection();
        this.length = 50 + Math.random() * 100;
        this.setInitialPosition();
        this.opacity = 0.3 + Math.random() * 0.4;
        this.speed = 2 + Math.random() * 3;
        this.life = 0;
        this.maxLife = 100 + Math.random() * 200;
    }

    getRandomDirection() {
        const directions = ['up', 'down', 'left', 'right'];
        return directions[Math.floor(Math.random() * directions.length)];
    }

    setInitialPosition() {
        switch (this.direction) {
            case 'right':
                this.x = -this.length;
                this.y = Math.random() * this.canvas.height;
                break;
            case 'left':
                this.x = this.canvas.width + this.length;
                this.y = Math.random() * this.canvas.height;
                break;
            case 'down':
                this.x = Math.random() * this.canvas.width;
                this.y = -this.length;
                break;
            case 'up':
                this.x = Math.random() * this.canvas.width;
                this.y = this.canvas.height + this.length;
                break;
        }
    }

    update() {
        this.life++;

        const fadeInDuration = 20;
        const fadeOutDuration = 30;
        const lifeProgress = this.life / this.maxLife;

        let opacity = this.opacity;

        if (this.life < fadeInDuration) {
            // Fade In
            opacity *= this.life / fadeInDuration;
        } else if (this.life > this.maxLife - fadeOutDuration) {
            // Fade Out
            opacity *= (this.maxLife - this.life) / fadeOutDuration;
        }

        switch (this.direction) {
            case 'right':
                this.x += this.speed;
                break;
            case 'left':
                this.x -= this.speed;
                break;
            case 'down':
                this.y += this.speed;
                break;
            case 'up':
                this.y -= this.speed;
                break;
        }

        return opacity;
    }

    isOutOfBounds() {
        return (
            this.life >= this.maxLife ||
            this.x < -this.length ||
            this.x > this.canvas.width + this.length ||
            this.y < -this.length ||
            this.y > this.canvas.height + this.length
        );
    }

    draw(ctx, opacity) {
        let endX = this.x;
        let endY = this.y;

        switch (this.direction) {
            case 'right':
                endX += this.length;
                break;
            case 'left':
                endX -= this.length;
                break;
            case 'down':
                endY += this.length;
                break;
            case 'up':
                endY -= this.length;
                break;
        }

        ctx.beginPath();
        ctx.strokeStyle = `rgba(68, 138, 255, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
}

class BeamAnimation {
    constructor() {
        this.canvas = document.getElementById('beamsCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.beams = [];
        this.resize();
        this.init();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        for (let i = 0; i < 40; i++) {
            this.beams.push(new Beam(this.canvas));
        }
    }

    animate() {
        this.ctx.fillStyle = "rgba(7, 7, 33, 0.2)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.beams.forEach((beam, index) => {
            const opacity = beam.update();
            beam.draw(this.ctx, opacity);

            if (beam.isOutOfBounds()) {
                this.beams[index] = new Beam(this.canvas);
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

window.addEventListener('load', () => {
    new BeamAnimation();
});
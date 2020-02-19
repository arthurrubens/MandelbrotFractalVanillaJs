class Fractal {
    constructor(container) {
        this.container = container;

        this.canvasWidth = 800;
        this.canvasHeight = 600;
        this.fillStyleRgbColor = '#000';
        this.color = 137;
        this.magnificationFactor = 351;
        this.panX = 1.92;
        this.panY = 1.08;
        this.iterations = 80;
        this.numberOfWorkers = 200;
        this.workers = [];
        this.xWidth = 100;
    }

    initCanvas() {
        if (this.myCanvas) {
            this.container.removeChild(this.myCanvas);
        }
        this.myCanvas = document.createElement("canvas");
        this.myCanvas.width = this.canvasWidth;
        this.myCanvas.height = this.canvasHeight;
        this.container.appendChild(this.myCanvas);
        this.ctx = this.myCanvas.getContext("2d", { alpha: false });
        console.log('Init Canvas', this.canvasWidth, this.canvasHeight);
        return this;

    }

    createWorkers() {
        for (let i = 0; i < this.numberOfWorkers; i++) {
            this.workers[i] = new Worker('./FractalColumnWorker.js');
        }
        return this;
    }

    terminateWorkers() {
        for (let i = 0; i < this.numberOfWorkers; i++) {
            if (this.workers[i] && this.workers[i].terminate) {
                this.workers[i].terminate();
            }
        }
        return this;
    }

    draw() {
        console.log('Draw');
        let xWidth = this.xWidth;
        if (!this.myCanvas) {
            this.initCanvas();
        }
        this.terminateWorkers().createWorkers();
        this.workersX = 0;
        
        for (let i = 0; i < this.numberOfWorkers; i++) {
            this.workers[i].onerror = this.onWorkerError.bind(this);
            this.workers[i].onmessageerror = this.onWorkerMessageError.bind(this);
            this.workers[i].onmessage = this.workersOnMessage.bind(this);
            this.workers[i].postMessage({
                workerId: i,
                x: this.workersX,
                xWidth: xWidth,
                yFrom: 0,
                yTo: this.myCanvas.height,
                magnificationFactor: this.magnificationFactor,
                panX: this.panX,
                panY: this.panY,
                iterations: this.iterations
            });
            if(this.workersX + this.xWidth > this.myCanvas.width) {
                xWidth = this.myCanvas.width - this.workersX;
            }
            this.workersX += xWidth;
            if (this.workersX >= this.myCanvas.width) {
                return;
            }
        }
        console.log('Draw END');
    }

    workersOnMessage(e) {
        let xWidth = this.xWidth;
        this.drawData(e.data);

        if (this.workersX >= this.myCanvas.width) {
            return;
        }
        if(this.workersX + e.data.xWidth > this.myCanvas.width) {
            xWidth = this.myCanvas.width - this.workersX;
        }
        this.workersX += xWidth;
        e.currentTarget.postMessage({
            workerId: i,
            x: this.workersX,
            xWidth: xWidth,
            yFrom: 0,
            yTo: this.myCanvas.height,
            magnificationFactor: this.magnificationFactor,
            panX: this.panX,
            panY: this.panY,
            iterations: this.iterations
        });
    }

    drawData(data) {
        for (let x = data.x; x < data.x + data.xWidth; x++) {
            for (let y = 0; y < this.myCanvas.height; y++) {
                let belongsToSet = data.columns[x][y];
                if (belongsToSet === 0) {
                    this.ctx.fillStyle = this.fillStyleRgbColor;
                } else {
                    this.ctx.fillStyle = 'hsl(' + this.color + ', 100%, ' + belongsToSet + '%)';
                }
                this.ctx.fillRect(x, y, 1, 1);
            }
        }
        return this;
    }

    onWorkerMessageError() {
        console.log('There is a message error with your worker!');
    }
    onWorkerError() {
        console.log('There is a worker error with your worker!');
    }
}
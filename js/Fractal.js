export default class Fractal {
    constructor(container) {
        this.container = container;
        this.canvasWidth = 800;
        this.canvasHeight = 600;
        this.magnificationFactor = 351;
        this.panX = 1.92;
        this.panY = 1.08;
        this.iterations = 25;
        this.numberOfWorkers = 20;
        this.workers = [];
        this.numberOfBusyWorkers = 0;
        this.xWidth = 100;
        this.colors = this.getColors();
        this.colorPointer = 0;
        this.randomFlyOn = false;

        this.createWorkers();
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
        this.imageData = this.ctx.getImageData(
            0,
            0,
            this.canvasWidth,
            this.canvasHeight
        );
        return this;

    }

    createWorkers() {
        for (let i = 0; i < this.numberOfWorkers; i++) {
            this.workers[i] = new Worker('./js/FractalColumnWorker.js');
            this.workers[i].onmessage = this.workersOnMessage.bind(this);
            this.workers[i].onerror = this.onWorkerError.bind(this);
            this.workers[i].onmessageerror = this.onWorkerMessageError.bind(this);
        }
        return this;
    }

    getColors() {
        let colors = [
            (belongsToSet) => [
                Math.round(255 * belongsToSet),
                0,
                0
            ],
            (belongsToSet) => [
                0,
                Math.round(255 * belongsToSet),
                0
            ],
            (belongsToSet) => [
                0,
                0,
                Math.round(255 * belongsToSet)
            ],
            (belongsToSet) => [
                0,
                Math.round(255 * belongsToSet),
                Math.round(255 * belongsToSet)
            ],
            (belongsToSet) => [
                Math.round(255 * belongsToSet),
                Math.round(87 * belongsToSet),
                Math.round(51 * belongsToSet)
            ]
        ]
        return colors;
    }

    terminateWorkers() {
        for (let i = 0; i < this.workers.length; i++) {
            if (this.workers[i] && this.workers[i].terminate) {
                this.workers[i].terminate();
            }
        }
        return this;
    }

    draw() {
        if(this.numberOfBusyWorkers > 0) {
            return;
        }
        let workerId = 0,
            xWidth = this.xWidth;
        if (!this.myCanvas) {
            this.initCanvas();
        }
        this.workersX = 0;

        while (
            workerId < this.numberOfWorkers
            && this.workersX < this.myCanvas.width
        ) {
            if (this.workersX + this.xWidth > this.myCanvas.width) {
                xWidth = this.myCanvas.width - this.workersX;
            }
            this.incrementBusyWorkerCounter();
            this.workers[workerId].postMessage({
                method: 'calculate',
                params: {
                    workerId: workerId,
                    x: this.workersX,
                    xWidth: xWidth,
                    yFrom: 0,
                    yTo: this.myCanvas.height,
                    magnificationFactor: this.magnificationFactor,
                    panX: this.panX,
                    panY: this.panY,
                    iterations: this.iterations    
                }
            });
            this.workersX += xWidth;
            workerId++;
        }
    }

    workersOnMessage(e) {
        let xWidth = this.xWidth;
        this.decrementBusyWokerCounter(e.data);
        this.drawData(e.data);
        if (this.workersX >= this.myCanvas.width) {
            return;
        }
        if (this.workersX + e.data.xWidth > this.myCanvas.width) {
            xWidth = this.myCanvas.width - this.workersX;
        }
        this.workersX += xWidth;
        e.currentTarget.postMessage({
            method: 'calculate',
            params: {
                workerId: e.data.workerId,
                x: this.workersX,
                xWidth: xWidth,
                yFrom: 0,
                yTo: this.myCanvas.height,
                magnificationFactor: this.magnificationFactor,
                panX: this.panX,
                panY: this.panY,
                iterations: this.iterations
    
            }
        });
        this.incrementBusyWorkerCounter();
    }

    incrementBusyWorkerCounter() {
        this.numberOfBusyWorkers++;
    }

    decrementBusyWokerCounter(data) {
        this.numberOfBusyWorkers--;
    }

    async drawData(data) {
        for (let x = data.x; x < data.x + data.xWidth; x++) {
            for (let y = 0; y < this.myCanvas.height; y++) {
                let belongsToSet = data.columns[x][y];
                if (belongsToSet === 0) {
                    this.imageData.data[(x + y * this.canvasWidth) * 4] = 0;
                    this.imageData.data[(x + y * this.canvasWidth) * 4 + 1] = 0;
                    this.imageData.data[(x + y * this.canvasWidth) * 4 + 2] = 0;
                    this.imageData.data[(x + y * this.canvasWidth) * 4 + 3] = 255;
                } else {
                    let [r, g, b] = this.colors[this.colorPointer](belongsToSet);
                    this.imageData.data[(x + y * this.canvasWidth) * 4] = r;
                    this.imageData.data[(x + y * this.canvasWidth) * 4 + 1] = g;
                    this.imageData.data[(x + y * this.canvasWidth) * 4 + 2] = b;
                    this.imageData.data[(x + y * this.canvasWidth) * 4 + 3] = 255;
                }
            }
        }
        if (this.numberOfBusyWorkers == 0) {
            this.ctx.putImageData(this.imageData, 0, 0);
        }
        return this;
    }

    switchColor() {
        if (this.colorPointer >= this.colors.length - 1) {
            this.colorPointer = 0;
        } else {
            this.colorPointer++;
        }
        return this;
    }

    onWorkerMessageError() {
        console.log('There is a message error with your worker!');
    }
    onWorkerError() {
        console.log('There is a worker error with your worker!');
    }

    randomFlySwitch() {
        this.randomFlyOn = !this.randomFlyOn;
        while (this.randomFlyOn) {
            switch (Math.round(Math.random() * 2)) {
                case 0:
                    for (let i = 0; i < Math.round(Math.random() * 10); i++) {
                        this.magnificationFactor += 3;
                        this.draw();
                    }
                    break;
                case 1:
                    for (let i = 0; i < Math.round(Math.random() * 10); i++) {
                        this.panX += 0.01;
                        this.draw();
                    }
                    break;
                case 2:
                    for (let i = 0; i < Math.round(Math.random() * 10); i++) {
                        this.panX -= 0.01;
                        this.draw();
                    }
                    break;
            }
        }
    }
}
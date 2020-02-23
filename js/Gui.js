import Fractal from './Fractal.js';

export default class Gui {
    constructor(conf) {
        this.movingStep = 0.01;
        this.magnificationFactorStep = 1;
        this.iterationsStep = 1;
        this.fractalContainer = document.getElementById(conf.fractalContainerId);
        this.initFractal();

        this.initEvents();
        this.fractal.draw();
    }

    initFractal() {
        this.fractal = new Fractal(this.fractalContainer);
        this.fractal.canvasWidth = this.getContainerInnerWidth();
        this.fractal.canvasHeight = this.getContainerInnerHeight();
    }

    initEvents() {
        window.addEventListener('resize', this.onFractalContainerResize.bind(this));

        // Keyboard events
        document.onkeydown = this.onKeyDown.bind(this);
    }

    onFractalContainerResize() {
        this.fractal.canvasWidth = this.getContainerInnerWidth();
        this.fractal.canvasHeight = this.getContainerInnerHeight();
        this.fractal.initCanvas().draw();
    }

    getContainerInnerWidth() {
        return window.getComputedStyle(this.fractalContainer).width.replace('px', '');
    }

    getContainerInnerHeight() {
        return window.getComputedStyle(this.fractalContainer).height.replace('px', '');
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case 37: // Left
                this.fractal.panX -= this.movingStep;
                break;
            case 38: // Up
                this.fractal.panY -= this.movingStep;
                break;
            case 39: // Right
                this.fractal.panX += this.movingStep;
                break;
            case 40: // Down
                this.fractal.panY += this.movingStep;
                break;
            case 171: // Firefox +
            case 187: // +
            if(event.ctrlKey) {
                this.fractal.iterations += this.iterationsStep;
            } else {
                this.fractal.magnificationFactor += this.magnificationFactorStep;
            }
            break;
            case 173: // Firefox -
            case 189: // -
                if(event.ctrlKey) {
                    if(this.fractal.iterations > 1) {
                        this.fractal.iterations -= this.iterationsStep
                    }
                } else {
                    if(this.fractal.magnificationFactor > 0) {
                        this.fractal.magnificationFactor -= this.magnificationFactorStep
                    }
                }
                break;
            case 67: // c
                this.fractal.switchColor();
                break;
            case 82:
                this.fractal.randomFlySwitch();
                break;
            default:
                console.log('Unknown key: ' + event.keyCode);
                return;
        }
        console.log('Draw');
        this.fractal.draw();
    };
}
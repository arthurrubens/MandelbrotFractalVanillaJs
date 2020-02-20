class Gui {
    constructor(conf) {
        this.movingStep = 0.01;
        this.magnificationFactorStep = 1;
        this.fractalContainer = document.getElementById(conf.fractalContainerId);
        this.initFractal();
        this.iterationsSliderSlider = document.getElementById(conf.iterationsSliderId);


        this.initEvents();
        this.setControlParams();
        this.fractal.draw();
    }

    initFractal() {
        this.fractal = new Fractal(this.fractalContainer);
        this.fractal.canvasWidth = this.getContainerInnerWidth();
        this.fractal.canvasHeight = this.getContainerInnerHeight();
    }

    initEvents() {
        window.addEventListener('resize', this.onFractalContainerResize.bind(this));
        this.iterationsSliderSlider.addEventListener('change', this.onIterationsSliderSliderChange.bind(this));

        // Keyboard events
        document.onkeydown = this.onKeyDown.bind(this);
    }

    setControlParams() {
        this.iterationsSliderSlider.value = this.fractal.iterations;
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

    onIterationsSliderSliderChange() {
        this.fractal.iterations = this.iterationsSliderSlider.value;
        this.fractal.draw();
    }

    consoleLogState() {
        console.log(
            'panX: ' + this.fractal.panX + '\n',
            'panY: ' + this.fractal.panY + '\n'
        );
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
                this.fractal.magnificationFactor += this.magnificationFactorStep;
                break;
            case 173: // Firefox +
            case 189: // -
                this.fractal.magnificationFactor -= this.magnificationFactorStep;
                break;
            case 67: // c
                this.fractal.switchColor();
                break;
            default:
                console.log('Unknown key: ' + event.keyCode);
                return;
        }
        this.fractal.draw();
    };
}
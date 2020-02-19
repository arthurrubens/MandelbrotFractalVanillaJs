class Gui {
    constructor(conf) {
        this.fractalContainer = document.getElementById(conf.fractalContainerId);
        this.initFractal();
        this.colorSlider = document.getElementById(conf.colorSliderId);
        this.iterationsSliderSlider = document.getElementById(conf.iterationsSliderId);
        this.magnificationFactorSlider = document.getElementById(conf.magnificationFactorSliderId);
        this.canvasXSlider = document.getElementById(conf.canvasXSliderId);
        this.canvasYSlider = document.getElementById(conf.canvasYSliderId);
        

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
        this.magnificationFactorSlider.addEventListener('change', this.onMagnificationFactorSliderChange.bind(this));
        this.canvasXSlider.addEventListener('change', this.onPanXChange.bind(this));
        this.canvasYSlider.addEventListener('change', this.onPanYChange.bind(this));
        this.colorSlider.addEventListener('change', this.onCcolorSlider.bind(this));
    }

    setControlParams() {
        this.iterationsSliderSlider.value = this.fractal.iterations;
        this.magnificationFactorSlider.value = this.fractal.magnificationFactor;
        this.canvasXSlider.value = this.fractal.panX;
        this.canvasYSlider.value = this.fractal.panY;
        this.colorSlider.value = this.fractal.color;
    }

    onFractalContainerResize() {
        this.fractal.canvasWidth = this.getContainerInnerWidth();
        this.fractal.canvasHeight = this.getContainerInnerHeight();
        console.log(this.fractal.canvasWidth, this.fractal.canvasHeight);
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
        console.log('I: ' + this.fractal.iterations);
        this.fractal.draw();
    }

    onMagnificationFactorSliderChange() {
        this.fractal.magnificationFactor = this.magnificationFactorSlider.value;
        console.log('M: ' + this.fractal.magnificationFactor);
        this.fractal.draw();
    }

    onCcolorSlider() {
        this.fractal.color = this.colorSlider.value;
        console.log('C: ' + this.colorSlider.value);
        this.fractal.draw();
    }

    getPanX() {
        return this.fractal.panX;
    }

    getPanY() {
        return this.fractal.panY;
    }

    onPanXChange() {
        this.fractal.panX = this.canvasXSlider.value;
        this.fractal.draw();
    }

    onPanYChange() {
        this.fractal.panY = this.canvasYSlider.value;
        this.fractal.draw();
    }
}
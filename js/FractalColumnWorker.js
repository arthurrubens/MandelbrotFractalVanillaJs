class FactorialCalculator {
    onMessage(e) {
        if (typeof this[e.data.method] === "function") {
            this[e.data.method](e.data.params);
        }
    }
    
    calculate(data) {
        const message = {
            workerId: data.workerId,
            x: data.x,
            xWidth: data.xWidth,
            columns: []
        }
        
        console.log('Worker: ', data.workerId, data.x);
        const xUntil = data.x + data.xWidth;
        for (let x = data.x; x < xUntil; x++) {
            message.columns[x] = [];
            for (let y = data.yFrom; y < data.yTo; y++) {
                message.columns[x][y] = this.checkIfBelongsToMandelbrotSet(
                    data.iterations,
                    x / data.magnificationFactor - data.panX,
                    y / data.magnificationFactor - data.panY
                );
            }
        }
        postMessage(message);

    }

    checkIfBelongsToMandelbrotSet(iterations, x, y) {
        let realComponentOfResult = x;
        let imaginaryComponentOfResult = y;
        for (let i = 0; i < iterations; i++) {
            let tempRealComponent = realComponentOfResult * realComponentOfResult - imaginaryComponentOfResult * imaginaryComponentOfResult + x;
            let tempImaginaryComponent = 2 * realComponentOfResult * imaginaryComponentOfResult + y;
            realComponentOfResult = tempRealComponent;
            imaginaryComponentOfResult = tempImaginaryComponent;
            if (realComponentOfResult * imaginaryComponentOfResult > 5) {
                return (i / iterations);
            }
        }
        return 0;
    }


}

factorialCalculator = new FactorialCalculator();

onmessage = factorialCalculator.onMessage.bind(factorialCalculator);
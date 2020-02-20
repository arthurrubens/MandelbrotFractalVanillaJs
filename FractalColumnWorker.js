function checkIfBelongsToMandelbrotSet(x, y, iterations) {
    let realComponentOfResult = x;
    let imaginaryComponentOfResult = y;
    for (let i = 0; i < iterations; i++) {
        let tempRealComponent = realComponentOfResult * realComponentOfResult - imaginaryComponentOfResult * imaginaryComponentOfResult + x;
        let tempImaginaryComponent = 2 * realComponentOfResult * imaginaryComponentOfResult + y;
        realComponentOfResult = tempRealComponent;
        imaginaryComponentOfResult = tempImaginaryComponent;

        // Return a number as a percentage
        if (realComponentOfResult * imaginaryComponentOfResult > 5) {
            return (i / iterations);
        }
    }
    return 0;   // Return zero if in set    
}

onmessage = function (e) {
    const message = {
        workerId: e.data.workerId,
        x: e.data.x,
        xWidth: e.data.xWidth,
        columns: []
    }
    const xUntil = e.data.x + e.data.xWidth;
    for (let x = e.data.x; x < xUntil; x++) {
        message.columns[x] = [];
        for (let y = e.data.yFrom; y < e.data.yTo; y++) {
            message.columns[x][y] = checkIfBelongsToMandelbrotSet(
                x / e.data.magnificationFactor - e.data.panX,
                y / e.data.magnificationFactor - e.data.panY,
                e.data.iterations
            );
        }
    }
    postMessage(message);
}
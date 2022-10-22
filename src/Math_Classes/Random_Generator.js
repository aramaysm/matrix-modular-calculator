"use strict";
exports.__esModule = true;
exports.Random_Generator = void 0;
var Random_Generator = /** @class */ (function () {
    function Random_Generator() {
    }
    Random_Generator.Generate_Zeros_Array = function (size) {
        var array_result = new Array(size);
        for (var i = 0; i < size; i++) {
            array_result[i] = 0;
        }
        console.log("Zeros array is :", array_result);
        return array_result;
    };
    Random_Generator.GCDExt = function (a, b, x, y) {
        var result, a1 = a, b1 = b, x0, x1, x2, y0, y1, y2, q, r;
        if (b > a) {
            a1 = b;
            b1 = a;
        }
        if (b1 == 0) {
            result = a1;
            x = b > a ? 0 : 1;
            y = b > a ? 1 : 0;
        }
        else {
            x2 = 1;
            x1 = 0;
            y2 = 0;
            y1 = 1;
            while (b1 > 0) {
                q = Math.floor(a1 / b1);
                r = a1 - q * b1;
                x0 = x2 - q * x1;
                y0 = y2 - q * y1;
                a1 = b1;
                b1 = r;
                x2 = x1;
                x1 = x0;
                y2 = y1;
                y1 = y0;
            }
            result = a1;
            x = b > a ? y2 : x2;
            y = b > a ? x2 : y2;
        }
        return x;
    };
    Random_Generator.RandomValue = function () {
        var result = Math.ceil(Math.random() * 100);
        while (!result)
            result = Math.ceil(Math.random() * 100);
        return result;
    };
    Random_Generator.RandomValueLessThan = function (bound) {
        var result = Math.ceil(Math.random() * 100) % bound;
        while (result == 0)
            result = Math.ceil(Math.random() * 100) % bound;
        return result;
    };
    return Random_Generator;
}());
exports.Random_Generator = Random_Generator;

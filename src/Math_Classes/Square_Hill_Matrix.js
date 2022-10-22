"use strict";
exports.__esModule = true;
var Modular_Data_1 = require("./Modular_Data");
var Random_Generator_1 = require("./Random_Generator");
var MODULUS = 251;
var Square_Hill_Matrix = /** @class */ (function () {
    function Square_Hill_Matrix(orderNew, matrixNew) {
        this._order = orderNew;
        if (matrixNew !== null && matrixNew !== undefined && matrixNew.length > 0) {
            this._matrix = matrixNew.map(function (item) { return new Modular_Data_1.Modular_Data(item); });
        }
        else {
            this._matrix = new Array(orderNew * orderNew);
        }
    }
    Square_Hill_Matrix.prototype.get_matrix = function () {
        return this._matrix;
    };
    Square_Hill_Matrix.prototype.get_order = function () {
        return this._order;
    };
    Square_Hill_Matrix.prototype.set_matrix = function (newMatrix) {
        this._matrix = newMatrix;
    };
    Square_Hill_Matrix.prototype.set_order = function (newOrder) {
        this._order = newOrder;
    };
    Square_Hill_Matrix.prototype.getItem = function (row, col) {
        return this._matrix[row * this._order + col].get_data();
    };
    Square_Hill_Matrix.prototype.setItem = function (row, col, dataNew) {
        this._matrix[row * this._order + col] = new Modular_Data_1.Modular_Data(dataNew);
    };
    /* --mType es el tipo de matriz--
  0 - matriz de identidad,
  1 - matriz null,
  2 - matriz de valores random
  3 - matriz de valores random sin duplicados
  */
    Square_Hill_Matrix.AreEquals = function (mat1, mat2) {
        var order = mat1._order;
        var areEquals = false;
        var idx = 0;
        while (idx < order * order && areEquals)
            if (mat1._matrix[idx]._data != mat2._matrix[idx]._data)
                areEquals = false;
            else
                idx++;
        return areEquals;
    };
    Square_Hill_Matrix.prototype.InitializeAs = function (mtype, order) {
        var matrix = new Array(order * order);
        if (order == 0)
            return new Array(0);
        switch (mtype) {
            case 0:
                for (var i = 0; i < order * order; i++)
                    if (i % (order + 1) != 0)
                        matrix[i] = new Modular_Data_1.Modular_Data(0);
                    else
                        matrix[i] = new Modular_Data_1.Modular_Data(1);
                break;
            case 1:
                for (var i = 0; i < order * order; i++)
                    matrix[i] = new Modular_Data_1.Modular_Data(0);
                break;
            case 2: {
                var data = new Modular_Data_1.Modular_Data(0);
                for (var i = 0; i < order * order; i++) {
                    data._data =
                        ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                    while (data._data == 0)
                        data._data =
                            ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                    matrix[i] = data;
                }
                break;
            }
            default: {
                //console.log("Into default option");
                var data = new Modular_Data_1.Modular_Data(0);
                var valid = false, found = false;
                var j = 0;
                for (var i = 0; i < order * order; i++) {
                    valid = false;
                    while (valid === false) {
                        data = new Modular_Data_1.Modular_Data(0);
                        data._data =
                            ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                        while (data._data === 0)
                            data._data =
                                ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                                    MODULUS;
                        j = 0;
                        found = false;
                        while (j < i && found === false) {
                            found = matrix[j]._data === data._data ? true : false;
                            if (found === false)
                                j++;
                        }
                        if (found === false) {
                            valid = true;
                        }
                        else {
                            valid = false;
                        }
                    }
                    matrix[i] = data;
                }
            }
        }
        return matrix;
    };
    Square_Hill_Matrix.prototype.GaussianEliminationOf = function () {
        var order = this._order;
        var array = Random_Generator_1.Random_Generator.Generate_Zeros_Array(order);
        var gaussMat = new Square_Hill_Matrix(this._order, array);
        gaussMat.set_matrix(this._matrix);
        var diagData = new Modular_Data_1.Modular_Data(0);
        var quotient = new Modular_Data_1.Modular_Data(0);
        for (var col = 0; col < order - 1; col++) {
            diagData._data = gaussMat._matrix[col * order + col]._data;
            for (var row = col + 1; row < order; row++) {
                quotient = Modular_Data_1.Modular_Data.operator_div(gaussMat._matrix[row * order + col], diagData);
                console.log("Quotient is: ", quotient, ", diagonal_data is : ", diagData, " and matrix gauss mat is ", gaussMat._matrix[row * order + col]);
                gaussMat.setItem(row, col, 0);
                for (var k = col + 1; k < order; k++)
                    gaussMat._matrix[row * order + k]._data -=
                        quotient._data * gaussMat._matrix[col * order + k]._data;
            }
            console.log("Triangular matrix in gauss elimination: ", gaussMat);
        }
        return gaussMat;
    };
    Square_Hill_Matrix.prototype.DeterminantByGaussOf = function () {
        var order = this._order;
        var array = Random_Generator_1.Random_Generator.Generate_Zeros_Array(order);
        var result = new Modular_Data_1.Modular_Data(0);
        var triangMat = new Square_Hill_Matrix(order, array);
        triangMat = this.GaussianEliminationOf();
        console.log("Triangular matrix: ", triangMat);
        result._data = triangMat.get_matrix()[0]._data;
        for (var i = 1; i < order; i++) {
            result = Modular_Data_1.Modular_Data.operator_mult(result, triangMat._matrix[i * order + i]);
            console.log("Determinante ahora: ", result);
        }
        return result;
    };
    Square_Hill_Matrix.prototype.InverseOf = function (matrix) {
        var luFactors = this.LuFactorizationOf(matrix);
        var inverse = this.InverseOfWithLU(matrix, luFactors);
        return inverse;
    };
    Square_Hill_Matrix.prototype.InverseOfWithLU = function (matrix, luFactors) {
        var order = matrix._order, index;
        var inverse = new Square_Hill_Matrix(order, []);
        inverse._matrix = this.InitializeAs(0, order);
        for (var r = 1; r < order; r++)
            for (var c = 0; c < r; c++) {
                index = r * order + c;
                for (var k = c; k < r; k++)
                    inverse._matrix[index] = Modular_Data_1.Modular_Data.operator_sub(inverse._matrix[index], Modular_Data_1.Modular_Data.operator_mult(luFactors._matrix[r * order + k], inverse._matrix[k * order + c]));
            }
        var sum = new Modular_Data_1.Modular_Data(0);
        for (var c = 0; c < order; c++)
            for (var r = order - 1; r >= 0; r--) {
                index = r * order + c;
                sum = new Modular_Data_1.Modular_Data(0);
                for (var k = r + 1; k < order; k++)
                    sum = Modular_Data_1.Modular_Data.operator_add(sum, Modular_Data_1.Modular_Data.operator_mult(luFactors._matrix[r * order + k], inverse._matrix[k * order + c]));
                inverse._matrix[index] = Modular_Data_1.Modular_Data.operator_div(Modular_Data_1.Modular_Data.operator_sub(inverse._matrix[index], sum), luFactors._matrix[r * order + r]);
            }
        return inverse;
    };
    Square_Hill_Matrix.prototype.LuFactorizationOf = function (matrix) {
        var luFactors = new Square_Hill_Matrix(matrix._order, []);
        luFactors.set_matrix(matrix._matrix);
        var diagValue = new Modular_Data_1.Modular_Data(0);
        var order = matrix._order;
        for (var k = 0; k < order - 1; k++) {
            diagValue._data = luFactors._matrix[k * order + k]._data;
            for (var row = k + 1; row < order; row++)
                luFactors._matrix[row * order + k] = Modular_Data_1.Modular_Data.operator_div(luFactors._matrix[row * order + k], diagValue);
            for (var row = k + 1; row < order; row++)
                for (var col = k + 1; col < order; col++)
                    luFactors._matrix[row * order + col] = Modular_Data_1.Modular_Data.operator_sub(luFactors._matrix[row * order + col], Modular_Data_1.Modular_Data.operator_mult(luFactors._matrix[row * order + k], luFactors._matrix[k * order + col]));
        }
        return luFactors;
    };
    Square_Hill_Matrix.prototype.MultiplyHillMatricesSquareByDiagonal = function (matrix, dMat) {
        var order = matrix._order, index = 0;
        var product = new Square_Hill_Matrix(order, []);
        var matData = matrix._matrix;
        var dMatData = dMat._matrix;
        var prodData = product._matrix;
        for (var col = 0; col < order; col++)
            for (var row = 0; row < order; row++) {
                index = row * order + col;
                prodData[index] = Modular_Data_1.Modular_Data.operator_mult(dMatData[col], matData[index]);
            }
        return product;
    };
    Square_Hill_Matrix.MultiplyHillMatrices = function (matrix1, matrix2) {
        var order = matrix1._order;
        var sum = new Modular_Data_1.Modular_Data(0);
        var product = new Square_Hill_Matrix(order, []);
        for (var row = 0; row < order; row++)
            for (var col = 0; col < order; col++) {
                sum = new Modular_Data_1.Modular_Data(0);
                for (var k = 0; k < order; k++)
                    sum = Modular_Data_1.Modular_Data.operator_add(sum, Modular_Data_1.Modular_Data.operator_mult(matrix1._matrix[row * order + k], matrix2._matrix[k * order + col]));
                product._matrix[row * order + col] = sum;
            }
        return product;
    };
    Square_Hill_Matrix.prototype.PowerOf = function (mat, power) {
        var matPower = new Square_Hill_Matrix(mat._order, []);
        matPower.set_matrix(mat._matrix);
        if (power != 0) {
            for (var i = 0; i < Math.floor(power) - 1; i++)
                matPower = Square_Hill_Matrix.MultiplyHillMatrices(matPower, mat);
            if (power < 0)
                matPower = this.InverseOf(matPower);
        }
        else
            matPower._matrix = this.InitializeAs(0, mat._order);
        return matPower;
    };
    Square_Hill_Matrix.prototype.PowerOfValueByValue = function (mat, power) {
        var matPower = new Square_Hill_Matrix(mat._order, []);
        matPower.set_matrix(mat._matrix);
        for (var i = 0; i < 64; i++)
            matPower._matrix[i] = Modular_Data_1.Modular_Data.PowerOf(mat._matrix[i], power);
        if (power < 0)
            matPower = this.InverseOf(matPower);
        return matPower;
    };
    Square_Hill_Matrix.ExportInitializeMatrix_Square = function (arrayModular) {
        var arrayNumber = new Array();
        var square = new Square_Hill_Matrix(8, []);
        arrayNumber = arrayModular.map(function (item) {
            return item._data;
        });
        return arrayNumber;
    };
    Square_Hill_Matrix.ImportInitializeMatrix_Square = function (arrayNumber) {
        var arrayModular = new Array();
        var square = new Square_Hill_Matrix(8, []);
        arrayModular = arrayModular.map(function (item) {
            return new Modular_Data_1.Modular_Data(item._data);
        });
        square.set_matrix(arrayModular);
        return square;
    };
    return Square_Hill_Matrix;
}());
/*let hill_v = new Square_Hill_Matrix(2, [1547, 5478, 8746, 4578]);

console.log("Determinant of square matrix:", hill_v.DeterminantByGaussOf());
*/
/*
let square1: Square_Hill_Matrix = new Square_Hill_Matrix(8, []);
let square2: Square_Hill_Matrix = new Square_Hill_Matrix(8, []);
let squareResult: Square_Hill_Matrix = new Square_Hill_Matrix(8, []);

let matrix1: Array<Modular_Data> = square1.InitializeAs(3, 8);
square1._matrix = matrix1;
let matrix2: Array<Modular_Data> = square2.InitializeAs(3, 8);
square2._matrix = matrix2;

console.log("First matrix is:");
console.table(square1._matrix);
console.log("Second matrix is:");
console.table(square2._matrix);

squareResult = Square_Hill_Matrix.MultiplyHillMatrices(square1, square2);

console.log("Result matrix is:");
console.table(squareResult._matrix);
*/
exports["default"] = Square_Hill_Matrix;
//tsc Square_Hill_Matrix.ts
// node Square_Hill_Matrix.js
//tsc src/Math_Classes/Square_Hill_Matrix.ts
//  node src/Math_Classes/Square_Hill_Matrix.js

"use strict";
exports.__esModule = true;
var Modular_Data_1 = require("./Modular_Data");
var Square_Hill_Matrix_1 = require("./Square_Hill_Matrix");
var Random_Generator_1 = require("./Random_Generator");
var MODULUS = 251;
var Diagonal_Hill_Matrix = /** @class */ (function () {
    function Diagonal_Hill_Matrix(orderNew, matrixNew) {
        this._order = orderNew;
        if (matrixNew !== null && matrixNew !== undefined && matrixNew.length > 0) {
            this._matrix = matrixNew.map(function (item) { return new Modular_Data_1.Modular_Data(item); });
        }
        else {
            this._matrix = new Array(orderNew);
        }
    }
    Diagonal_Hill_Matrix.prototype.get_matrix = function () {
        return this._matrix;
    };
    Diagonal_Hill_Matrix.prototype.get_order = function () {
        return this._order;
    };
    Diagonal_Hill_Matrix.prototype.set_matrix = function (newMatrix) {
        this._matrix = newMatrix;
    };
    Diagonal_Hill_Matrix.prototype.set_order = function (newOrder) {
        this._order = newOrder;
    };
    Diagonal_Hill_Matrix.prototype.getItem = function (row) {
        return this._matrix[row].get_data();
    };
    Diagonal_Hill_Matrix.prototype.setItem = function (row, dataNew) {
        this._matrix[row] = new Modular_Data_1.Modular_Data(dataNew);
    };
    Diagonal_Hill_Matrix.prototype.InitializeAs = function (mtype, order) {
        var matrix = new Array(order);
        if (order == 0)
            return new Array(0);
        var data = new Modular_Data_1.Modular_Data(0);
        switch (mtype) {
            case 0:
                for (var i = 0; i < order; i++)
                    matrix[i] = new Modular_Data_1.Modular_Data(1);
                break;
            case 1:
                for (var i = 0; i < order; i++)
                    matrix[i] = new Modular_Data_1.Modular_Data(0);
                break;
            case 2:
                for (var i = 0; i < order; i++) {
                    data._data =
                        ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                    while (data._data == 0)
                        data._data =
                            ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                    matrix[i] = data;
                }
                break;
            default: {
                var valid = false, found = false;
                var j = 0;
                var _loop_1 = function (i) {
                    data = new Modular_Data_1.Modular_Data(0);
                    valid = false;
                    while (valid === false) {
                        data._data =
                            ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                        while (data._data === 0)
                            data._data =
                                ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                                    MODULUS;
                        //console.log("Data:", data._data);
                        var filtredArray = matrix.filter(function (item, index) { return item === data && index < i; });
                        if (filtredArray.length === 0)
                            valid = true;
                        else
                            valid = false;
                        //console.log("Filtred array", filtredArray);
                        /* j = 0;
                        found = false;
                        while (j < i && found === false) {
                          if (matrix[j]._data === data._data) found = false;
                          else found = true;
            
                          if (found === false) j++;
            
                          console.log("Found and j", found, j);
                        }
                        console.log("Finish j and found loop");
                        if (found === false) valid = true;
                        else valid = false;*/
                    }
                    matrix[i] = data;
                };
                for (var i = 0; i < order; i++) {
                    _loop_1(i);
                }
                break;
            }
        }
        //console.log("Diagonal matrix initializated is ", matrix);
        return matrix;
    };
    Diagonal_Hill_Matrix.prototype.InverseOf = function (matrix) {
        var order = matrix._order;
        var inverse = new Diagonal_Hill_Matrix(order, []);
        for (var i = 0; i < order; i++)
            inverse._matrix[i]._data = Modular_Data_1.Modular_Data.operator_inverseOf(matrix._matrix[i])._data;
        return inverse;
    };
    Diagonal_Hill_Matrix.prototype.MultiplyHillMatrices = function (matrix1, matrix2) {
        var order = matrix1._order;
        var product = new Diagonal_Hill_Matrix(order, []);
        var mat1Data = matrix1._matrix;
        var mat2Data = matrix2._matrix;
        var prodData = product._matrix;
        for (var i = 0; i < order; i++)
            prodData[i] = Modular_Data_1.Modular_Data.operator_mult(mat1Data[i], mat2Data[i]);
        return product;
    };
    Diagonal_Hill_Matrix.PowerOf = function (matrix, p) {
        var order = matrix._order;
        var power = new Diagonal_Hill_Matrix(order, []);
        for (var i = 0; i < order; i++)
            power._matrix[i] = Modular_Data_1.Modular_Data.PowerOf(matrix._matrix[i], p);
        return power;
    };
    Diagonal_Hill_Matrix.prototype.ToSquareHillMatrix = function (matrix) {
        var order = matrix._order;
        var result = new Square_Hill_Matrix_1["default"](order, []);
        result._matrix = this.InitializeAs(1, order);
        for (var rowCol = 0; rowCol < order; rowCol++)
            result._matrix[rowCol * order + rowCol] =
                matrix._matrix[rowCol];
        return result;
    };
    return Diagonal_Hill_Matrix;
}());
exports["default"] = Diagonal_Hill_Matrix;
//   tsc src/Math_Classes/Diagonal_Hill_Matrix.ts

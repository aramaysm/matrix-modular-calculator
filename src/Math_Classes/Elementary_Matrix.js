"use strict";
exports.__esModule = true;
var Hill_Vector_1 = require("./Hill_Vector");
var Modular_Data_1 = require("./Modular_Data");
var Square_Hill_Matrix_1 = require("./Square_Hill_Matrix");
var Random_Generator_1 = require("./Random_Generator");
var MODULUS = 251;
var Elementary_Matrix = /** @class */ (function () {
    function Elementary_Matrix(order) {
        if (order === void 0) { order = 0; }
        this._initialized = false;
        this._vector1 = new Hill_Vector_1["default"](order, []);
        this._vector2 = new Hill_Vector_1["default"](order, []);
        this._order = order;
        this._equalVectors = false;
        this._factorForInverse = new Modular_Data_1.Modular_Data(0);
    }
    Elementary_Matrix.prototype.get_vector1 = function () {
        return this._vector1;
    };
    Elementary_Matrix.prototype.get_vector2 = function () {
        return this._vector2;
    };
    Elementary_Matrix.prototype.get_order = function () {
        return this._order;
    };
    Elementary_Matrix.prototype.is_equalVectors = function () {
        return this._equalVectors;
    };
    Elementary_Matrix.prototype.get_factorForInverse = function () {
        return this._factorForInverse;
    };
    Elementary_Matrix.prototype.set_vector1 = function (vector1) {
        this._vector1 = vector1;
    };
    Elementary_Matrix.prototype.set_vector2 = function (vector2) {
        this._vector2 = vector2;
    };
    Elementary_Matrix.prototype.set_order = function (order) {
        this._order = order;
    };
    Elementary_Matrix.prototype.set_equalVectors = function (equalsVectors) {
        this._equalVectors = equalsVectors;
    };
    Elementary_Matrix.prototype.set_factorForInverse = function (factorForI) {
        this._factorForInverse = factorForI;
    };
    Elementary_Matrix.prototype.ElementaryTransformationUsing1 = function (dMat, eMat) {
        var order = eMat._order, k = 0;
        var result = new Square_Hill_Matrix_1["default"](order, []);
        var u = eMat._vector1._vector;
        var vT = eMat._vector2._vector;
        var d = dMat._matrix;
        var eMatInvFactor = new Modular_Data_1.Modular_Data(0);
        var s = new Modular_Data_1.Modular_Data(0);
        var u1Item = new Modular_Data_1.Modular_Data(0);
        eMatInvFactor._data = eMat._factorForInverse._data;
        for (var i = 0; i < order; i++)
            s = Modular_Data_1.Modular_Data.operator_add(s, Modular_Data_1.Modular_Data.operator_mult(Modular_Data_1.Modular_Data.operator_mult(d[i], u[i]), Modular_Data_1.Modular_Data.operator_mult(eMatInvFactor, vT[i])));
        // s += eMatInvFactor * vT[i] * d[i] * u[i];
        for (var row = 0; row < order; row++) {
            u1Item = Modular_Data_1.Modular_Data.operator_mult(Modular_Data_1.Modular_Data.operator_sub(s, Modular_Data_1.Modular_Data.operator_mult(eMatInvFactor, d[row])), u[row]);
            for (var col = 0; col < order; col++)
                result._matrix[k++] = Modular_Data_1.Modular_Data.operator_add(row == col ? d[row] : new Modular_Data_1.Modular_Data(0), Modular_Data_1.Modular_Data.operator_mult(Modular_Data_1.Modular_Data.operator_sub(u1Item, Modular_Data_1.Modular_Data.operator_mult(u[row], d[col])), vT[col]));
        }
        return result;
    };
    /*
   ElementaryTransformationUsing2(DiagonalHillMatrix& dMat, const let p1, ElementaryHillMatrix& eMat):Square_Hill_Matrix
  { let order = eMat._order, k = 0;
     result = *(new Square_Hill_Matrix(order));
    ModularData* u = eMat._vector1->_data;
    ModularData* vT = eMat._vector2->_data;
    ModularData* d = dMat._data;
    ModularData dItem, eMatInvFactor, s, uItem, u1Item, vTItem, itemPower;
    eMatInvFactor._data = eMat._factorForInverse._data;
    for (let i = 0; i < order; i++)
      s += eMatInvFactor * vT[i] * PowerOf(d[i], p1) * u[i];
    for (let row = 0; row < order; row++)
    { itemPower._data = PowerOf(d[row], p1)._data;
      u1Item = (s - eMatInvFactor * itemPower) * u[row];
      for (let col = 0; col < order; col++)
        result._data[k++] = (row == col ? itemPower : ModularData(0)) + (u1Item - u[row] * PowerOf(d[col], p1)) * vT[col];
    }
    result._initialized = true;
    return result;
  }
  
   ElementaryTransformationUsing3(DiagonalHillMatrix& dMat, const let p1, const let p2,
                                                   result2, ElementaryHillMatrix& eMat):Square_Hill_Matrix
  { let order = eMat._order, k = 0;
     result1 = *(new Square_Hill_Matrix(order));
    if (result2._order != order)
    { if (result2._data)
        delete [] result2._data;
      result2._data = 0;
      result2._order = order;
    }
    if (!result2._data)
      result2._data = new ModularData[order * order];
    ModularData* u = eMat._vector1->_data;
    ModularData* vT = eMat._vector2->_data;
    ModularData* d = dMat._data;
    ModularData data, dItem1, dItem2, dMatItem, eMatInvFactor, s1, s2, uItem, u1Item1, u1Item2, vTItem, itemPower1, itemPower2;
    eMatInvFactor._data = eMat._factorForInverse._data;
    for (let i = 0; i < order; i++)
    { data = eMatInvFactor * vT[i] * u[i];
      s1 += data * PowerOf(d[i], p1);
      s2 += data * PowerOf(d[i], p2);
    }
    for (let row = 0; row < order; row++)
    { itemPower1._data = PowerOf(d[row], p1)._data;
      itemPower2._data = PowerOf(d[row], p2)._data;
      u1Item1 = (s1 - eMatInvFactor * itemPower1) * u[row];
      u1Item2 = (s2 - eMatInvFactor * itemPower2) * u[row];
      for (let col = 0; col < order; col++)
      { result1._data[k] = (row == col ? itemPower1 : ModularData(0)) + (u1Item1 - u[row] * PowerOf(d[col], p1)) * vT[col];
        result2._data[k++] = (row == col ? itemPower2 : ModularData(0)) + (u1Item2 - u[row] * PowerOf(d[col], p2)) * vT[col];
      }
    }
    result1._initialized = result2._initialized = true;
    return result1;
  }*/
    /*
  0 - etIdentity,
  1 - etRandom,
  2 - etRandomWithoutDuplicates
  */
    Elementary_Matrix.prototype.InitializeAs = function (emType, order, equalVectors) {
        var matrix = new Elementary_Matrix(order);
        if (order == 0)
            return new Elementary_Matrix(0);
        var data = new Modular_Data_1.Modular_Data(0);
        var data1 = new Modular_Data_1.Modular_Data(0);
        var valid = false, found = false;
        var j = 0;
        matrix._equalVectors = equalVectors;
        if (matrix._vector1._vector === undefined ||
            matrix._vector1._vector === null ||
            matrix._vector1._vector.length === 0)
            matrix._vector1._vector = matrix._vector1.InitializeAs(3, order);
        var matVect1Data = matrix._vector1._vector;
        var invFactor = matrix._factorForInverse;
        if (equalVectors) {
            switch (emType) {
                case 0: {
                    for (var i = 0; i < order; i++)
                        matVect1Data[i] = new Modular_Data_1.Modular_Data(0);
                    invFactor._data = Modular_Data_1.Modular_Data.operator_inverseOfWithValue(MODULUS - 1)._data;
                    break;
                }
                case 1: {
                    invFactor._data = 0;
                    for (var i = 0; i < order - 1; i++) {
                        data._data =
                            ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                        while (data._data == 0 || (data._data * data._data) % MODULUS == 1)
                            data._data =
                                ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                                    MODULUS;
                        matVect1Data[i] = data;
                        invFactor = Modular_Data_1.Modular_Data.operator_add(invFactor, Modular_Data_1.Modular_Data.operator_mult(data, data));
                    }
                    data._data =
                        ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                    while (data._data == 0 ||
                        (data._data * data._data) % MODULUS == 1 ||
                        Modular_Data_1.Modular_Data.operator_add(invFactor, Modular_Data_1.Modular_Data.operator_mult(data, data))._data == 1)
                        data._data =
                            ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                    matVect1Data[order - 1] = data;
                    invFactor._data = Modular_Data_1.Modular_Data.operator_inverseOfWithValue(Modular_Data_1.Modular_Data.operator_add(invFactor, Modular_Data_1.Modular_Data.operator_mult(data, data))._data - 1)._data;
                    break;
                }
                default: {
                    invFactor._data = 0;
                    var _loop_1 = function (i) {
                        valid = false;
                        data = new Modular_Data_1.Modular_Data(0);
                        while (valid === false) {
                            data._data =
                                ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                                    MODULUS;
                            while (data._data === 0)
                                data._data =
                                    ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                                        MODULUS;
                            //console.log("Data:", data._data);
                            var filtredArray = matVect1Data.filter(function (item, index) { return item._data === data._data && index < i; });
                            if (filtredArray.length === 0)
                                valid = true;
                            else
                                valid = false;
                        }
                        /* while (!valid) {
                          data._data =
                            ((Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                            MODULUS;
                          while (
                            data._data == 0 ||
                            (data._data * data._data) % MODULUS == 1
                          )
                            data._data =
                              ((Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                              MODULUS;
                          j = 0;
                          found = false;
                          while (j < i && !found) {
                            found = matVect1Data[j]._data == data._data ? true : false;
                            if (!found) j++;
                          }
                          valid = !found;
                        }*/
                        matVect1Data[i] = data;
                        invFactor = Modular_Data_1.Modular_Data.operator_add(invFactor, Modular_Data_1.Modular_Data.operator_mult(data, data));
                    };
                    for (var i = 0; i < order - 1; i++) {
                        _loop_1(i);
                    }
                    valid = false;
                    while (!valid) {
                        data._data =
                            ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                        while (data._data == 0 || (data._data * data._data) % MODULUS == 1)
                            data._data =
                                ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                                    MODULUS;
                        j = 0;
                        found = false;
                        while (j < order - 1 && !found) {
                            found = matVect1Data[j]._data == data._data;
                            if (!found)
                                j++;
                        }
                        valid =
                            !found &&
                                Modular_Data_1.Modular_Data.operator_add(invFactor, Modular_Data_1.Modular_Data.operator_mult(data, data))._data != 1;
                    }
                    matVect1Data[order - 1] = data;
                    invFactor._data = Modular_Data_1.Modular_Data.operator_inverseOfWithValue(Modular_Data_1.Modular_Data.operator_add(invFactor, Modular_Data_1.Modular_Data.operator_mult(data, data))._data - 1)._data;
                }
            }
            matrix._vector2 = matrix._vector1;
        }
        else {
            if (!matrix._vector2)
                matrix._vector2 = new Hill_Vector_1["default"](order, []);
            var matVect2Data = matrix._vector2._vector;
            switch (emType) {
                case 0: {
                    for (var i = 0; i < order; i++)
                        matVect1Data[i] = matVect2Data[i] = new Modular_Data_1.Modular_Data(0);
                    invFactor = Modular_Data_1.Modular_Data.operator_inverseOfWithValue(MODULUS - 1);
                    break;
                }
                case 1: {
                    invFactor._data = 0;
                    for (var i = 0; i < order - 1; i++) {
                        data._data =
                            ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                        while (data._data == 0)
                            data._data =
                                ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                                    MODULUS;
                        data1._data =
                            ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                        while (data1._data == 0 ||
                            (data1._data * data._data) % MODULUS == 1)
                            data1._data =
                                ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                                    MODULUS;
                        matVect1Data[i] = data;
                        matVect2Data[i] = data1;
                        invFactor._data = Modular_Data_1.Modular_Data.operator_inverseOfWithValue(Modular_Data_1.Modular_Data.operator_add(invFactor, Modular_Data_1.Modular_Data.operator_mult(data, data1))._data - 1)._data;
                    }
                    data._data =
                        ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                    while (data._data == 0)
                        data._data =
                            ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                    data1._data =
                        ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                    while (data1._data == 0 ||
                        (data1._data * data._data) % MODULUS == 1 ||
                        Modular_Data_1.Modular_Data.operator_add(invFactor, Modular_Data_1.Modular_Data.operator_mult(data, data1))._data == 1)
                        data1._data =
                            ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                    matVect1Data[order - 1] = data;
                    matVect2Data[order - 1] = data1;
                    // invFactor._data = InverseOf(invFactor + data * data1 - 1)._data;
                    invFactor._data = Modular_Data_1.Modular_Data.operator_inverseOf(Modular_Data_1.Modular_Data.operator_add(invFactor, Modular_Data_1.Modular_Data.operator_sub_value(Modular_Data_1.Modular_Data.operator_mult(data, data1), 1)))._data;
                    break;
                }
                default: {
                    invFactor._data = 0;
                    var _loop_2 = function (i) {
                        valid = false;
                        data = new Modular_Data_1.Modular_Data(0);
                        data1 = new Modular_Data_1.Modular_Data(0);
                        while (valid === false) {
                            data._data =
                                ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                                    MODULUS;
                            while (data._data === 0)
                                data._data =
                                    ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                                        MODULUS;
                            //console.log("Data:", data._data);
                            var filtredArray = matVect1Data.filter(function (item, index) { return item._data === data._data && index < i; });
                            if (filtredArray.length === 0)
                                valid = true;
                            else
                                valid = false;
                        }
                        matVect1Data[i] = data;
                        valid = false;
                        while (valid === false) {
                            data1._data =
                                ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                                    MODULUS;
                            while (data1._data === 0)
                                data1._data =
                                    ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                                        MODULUS;
                            //console.log("Data:", data._data);
                            var filtredArray = matVect2Data.filter(function (item, index) { return item._data === data1._data && index < i; });
                            if (filtredArray.length === 0)
                                valid = true;
                            else
                                valid = false;
                        }
                        matVect2Data[i] = data1;
                        invFactor = Modular_Data_1.Modular_Data.operator_add(invFactor, Modular_Data_1.Modular_Data.operator_mult(data, data1));
                    };
                    for (var i = 0; i < order - 1; i++) {
                        _loop_2(i);
                    }
                    valid = false;
                    data = new Modular_Data_1.Modular_Data(0);
                    data1 = new Modular_Data_1.Modular_Data(0);
                    while (valid === false) {
                        data._data =
                            ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                        while (data._data === 0)
                            data._data =
                                ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                                    MODULUS;
                        //console.log("Data:", data._data);
                        var filtredArray = matVect1Data.filter(function (item, index) { return item._data === data._data && index < order - 1; });
                        if (filtredArray.length === 0)
                            valid = true;
                        else
                            valid = false;
                    }
                    matVect1Data[order - 1] = data;
                    valid = false;
                    while (valid === false) {
                        data1._data =
                            ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                        while (data1._data === 0)
                            data1._data =
                                ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                                    MODULUS;
                        //console.log("Data:", data._data);
                        var filtredArray = matVect2Data.filter(function (item, index) { return item._data === data1._data && index < order - 1; });
                        valid =
                            !found &&
                                Modular_Data_1.Modular_Data.operator_add(invFactor, Modular_Data_1.Modular_Data.operator_mult(data, data1))._data != 1;
                    }
                    matVect2Data[order - 1] = data1;
                    invFactor = Modular_Data_1.Modular_Data.operator_inverseOf(Modular_Data_1.Modular_Data.operator_add(invFactor, Modular_Data_1.Modular_Data.operator_sub_value(Modular_Data_1.Modular_Data.operator_mult(data, data1), 1)));
                    matrix._factorForInverse = invFactor;
                    matrix._vector1._vector = matVect1Data;
                    matrix._vector2._vector = matVect2Data;
                }
            }
        }
        this._initialized = true;
        return matrix;
    };
    Elementary_Matrix.InverseOf = function (matrix) {
        var order = matrix._order, j = 0;
        var result = new Elementary_Matrix(order);
        if (matrix._initialized) {
            var rFactor = result._factorForInverse;
            rFactor._data = 0;
            // result->_equalVectors = matrix._equalVectors;
            var factor = matrix._factorForInverse;
            var mV1Data = matrix._vector1._vector;
            var mV2Data = matrix._vector2._vector;
            var rV1Data = result._vector1._vector;
            var rV2Data = result._vector2._vector;
            for (var i = 0; i < order; i++) {
                rV1Data[i] = Modular_Data_1.Modular_Data.operator_mult(factor, mV1Data[i]);
                rV2Data[i]._data = mV2Data[i]._data;
                if (rV1Data[i]._data == rV2Data[i]._data)
                    j++;
                rFactor = Modular_Data_1.Modular_Data.operator_add(rFactor, Modular_Data_1.Modular_Data.operator_mult(rV1Data[i], rV2Data[i]));
            }
            rFactor._data = Modular_Data_1.Modular_Data.operator_inverseOf(Modular_Data_1.Modular_Data.operator_sub_value(rFactor, 1))._data;
            if (j === order)
                result._equalVectors = true;
            else
                result._equalVectors = false;
            if (result._equalVectors) {
                result._vector2 = result._vector1;
            }
        }
        return result;
    };
    Elementary_Matrix.prototype.MultiplyHillMatrices = function (matrix1, matrix2) {
        var order = matrix1._order;
        var result = new Square_Hill_Matrix_1["default"](order, []);
        if (matrix1._initialized && matrix2._initialized) {
            var mat1V1 = matrix1._vector1;
            var mat1V2 = matrix1._vector2;
            var mat2V1 = matrix2._vector1;
            var mat2V2 = matrix2._vector2;
            var factor = Hill_Vector_1["default"].operator_mult(mat1V2, mat2V1);
            var mat1V1Data = mat1V1._vector;
            var mat1V2Data = mat1V2._vector;
            var mat2V1Data = mat2V1._vector;
            var mat2V2Data = mat2V2._vector;
            var resData = result._matrix;
            var zero = new Modular_Data_1.Modular_Data(0);
            var one = new Modular_Data_1.Modular_Data(1);
            for (var r = 0; r < order; r++)
                for (var c = 0; c < order; c++)
                    /*resData[r * order + c] = (r == c ? one : zero) - (mat2V1Data[r] * mat2V2Data[c])
                   - (mat1V1Data[r] * mat1V2Data[c]) +   (factor * (mat1V1Data[r] * mat2V2Data[c]));*/
                    resData[r * order + c] = Modular_Data_1.Modular_Data.operator_sub(r == c ? one : zero, Modular_Data_1.Modular_Data.operator_sub(Modular_Data_1.Modular_Data.operator_mult(mat2V1Data[r], mat2V2Data[c]), Modular_Data_1.Modular_Data.operator_add(Modular_Data_1.Modular_Data.operator_mult(mat1V1Data[r], mat1V2Data[c]), Modular_Data_1.Modular_Data.operator_mult(factor, Modular_Data_1.Modular_Data.operator_mult(mat1V1Data[r], mat2V2Data[c])))));
        }
        return result;
    };
    Elementary_Matrix.ToSquare_Hill_Matrix = function (matrix) {
        var order = matrix._order;
        var resPtr = new Square_Hill_Matrix_1["default"](order, []);
        var iMatItem = new Modular_Data_1.Modular_Data(0);
        for (var row = 0; row < order; row++)
            for (var col = 0; col < order; col++) {
                if (row === col)
                    iMatItem._data = 1;
                else
                    iMatItem._data = 0;
                //resPtr._matrix[row * order + col] = iMatItem - matrix._vector1._vector[row] * matrix._vector2.vector[col];
                resPtr._matrix[row * order + col] = Modular_Data_1.Modular_Data.operator_sub(iMatItem, Modular_Data_1.Modular_Data.operator_mult(matrix._vector1._vector[row], matrix._vector2._vector[col]));
            }
        return resPtr;
    };
    return Elementary_Matrix;
}());
exports["default"] = Elementary_Matrix;
/*
let matrix: Elementary_Matrix = new Elementary_Matrix(8);
matrix = matrix.InitializeAs(3, 8, false);
console.log("Matrix elem", matrix);
console.log("Square matrix is", Elementary_Matrix.ToSquare_Hill_Matrix(matrix));*/ 

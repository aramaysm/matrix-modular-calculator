"use strict";
exports.__esModule = true;
var Modular_Data_1 = require("./Modular_Data");
var Random_Generator_1 = require("./Random_Generator");
var MODULUS = 251;
var Hill_Vector = /** @class */ (function () {
    function Hill_Vector(orderNew, newVector) {
        if ((orderNew === null || orderNew === 0) &&
            (newVector === null || newVector.length === 0)) {
            this._order = 0;
            this._vector = new Array(0);
        }
        else {
            this._order = newVector.length;
            this._vector = newVector.map(function (item) { return new Modular_Data_1.Modular_Data(item); });
        }
    }
    Hill_Vector.prototype.get_vector = function () {
        return this._vector;
    };
    Hill_Vector.prototype.set_vector = function (newVector) {
        this._vector = newVector;
    };
    Hill_Vector.prototype.get_order = function () {
        return this._order;
    };
    /* ---Types of vectors
    0 - vtNull,
    1 - vtRandom,
    2 - vtRandomWithoutDuplicates,
    3 - vtRandomForElementaryMatrix,
    4 - vtRandomForElementaryMatrixWithoutDuplicates,
    5 - vtUnit
  
  
    */
    Hill_Vector.prototype.InitializeAs = function (vType, order) {
        var vectData = new Array(order);
        switch (vType) {
            case 0:
                for (var i = 0; i < order; i++)
                    vectData[i]._data = 0;
                break;
            case 1: {
                var data = new Modular_Data_1.Modular_Data(0);
                for (var i = 0; i < order; i++) {
                    data._data =
                        ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                    while (data._data == 0)
                        data._data =
                            ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                    vectData[i] = data;
                }
                break;
            }
            case 2: {
                var data = new Modular_Data_1.Modular_Data(0);
                var valid = void 0, found = void 0;
                var j = void 0;
                for (var i = 0; i < order; i++) {
                    valid = false;
                    while (!valid) {
                        data._data =
                            ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                        while (data._data == 0)
                            data._data =
                                ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                        j = 0;
                        found = false;
                        while (j < i && !found) {
                            found = (vectData[j]._data == data._data);
                            if (!found)
                                j++;
                        }
                        valid = !found;
                    }
                    vectData[i] = data;
                }
                break;
            }
            case 3: {
                var data = new Modular_Data_1.Modular_Data(0);
                var sum = new Modular_Data_1.Modular_Data(0);
                for (var i = 0; i < order - 1; i++) {
                    data._data =
                        ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                    while (data._data == 0)
                        data._data =
                            ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                    vectData[i] = data;
                    sum = Modular_Data_1.Modular_Data.operator_add(sum, Modular_Data_1.Modular_Data.operator_mult(data, data));
                }
                data._data =
                    ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                while (data._data == 0 ||
                    Modular_Data_1.Modular_Data.operator_add(sum, Modular_Data_1.Modular_Data.operator_mult(data, data))
                        ._data == 1)
                    data._data =
                        ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                vectData[order - 1] = data;
                break;
            }
            case 4: {
                var data = new Modular_Data_1.Modular_Data(0);
                var sum = new Modular_Data_1.Modular_Data(0);
                var valid = void 0, found = void 0;
                var j = void 0;
                for (var i = 0; i < order - 1; i++) {
                    valid = false;
                    while (!valid) {
                        data._data =
                            ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                        while (data._data == 0)
                            data._data =
                                ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                        j = 0;
                        found = false;
                        while (j < i && !found) {
                            found = vectData[j]._data == data._data;
                            if (!found)
                                j++;
                        }
                        valid = !found;
                    }
                    vectData[i] = data;
                    sum = Modular_Data_1.Modular_Data.operator_add(sum, Modular_Data_1.Modular_Data.operator_mult(data, data));
                }
                valid = false;
                while (!valid) {
                    data._data =
                        ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                    while (data._data == 0)
                        data._data =
                            ((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
                    j = 0;
                    found = false;
                    while (j < order - 1 && !found) {
                        found = vectData[j]._data == data._data;
                        if (!found)
                            j++;
                    }
                    valid =
                        !found &&
                            Modular_Data_1.Modular_Data.operator_add(sum, Modular_Data_1.Modular_Data.operator_mult(data, data))
                                ._data != 1;
                }
                vectData[order - 1] = data;
                break;
            }
            default:
                for (var i = 0; i < order; i++)
                    vectData[i] = new Modular_Data_1.Modular_Data(1);
        }
        return vectData;
    };
    //Producto cruz ------El resultado es un vector
    Hill_Vector.prototype.MultiplyHillVectors = function (vector1, vector2) {
        var order = vector1._order;
        var productHill_Vector = new Hill_Vector(order, []);
        var v1Data = vector1._vector;
        var v2Data = vector2._vector;
        var prodData = productHill_Vector._vector;
        for (var i = 0; i < order; i++)
            prodData[i] = Modular_Data_1.Modular_Data.operator_mult(v1Data[i], v2Data[i]);
        console.log("Product by operator_mult is:", prodData);
        productHill_Vector._vector = prodData;
        return productHill_Vector;
    };
    //Producto punto ------El resultado es un escalar
    Hill_Vector.operator_mult = function (vector1, vector2) {
        var result = new Modular_Data_1.Modular_Data(0);
        for (var i = 0; i < vector1._order; i++)
            result = Modular_Data_1.Modular_Data.operator_add(result, Modular_Data_1.Modular_Data.operator_mult(vector1._vector[i], vector2._vector[i]));
        return result;
    };
    Hill_Vector.prototype.PartnerForElementaryHillMatrixFor = function (vector, value) {
        var order = vector._order;
        var partner = new Hill_Vector(order, []);
        var data = new Modular_Data_1.Modular_Data(0);
        var sum = new Modular_Data_1.Modular_Data(0);
        var vectData = vector._vector;
        var partData = partner._vector;
        for (var i = 0; i < order - 1; i++) {
            data._data = (((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS);
            while (data._data == 0)
                data._data = (((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS);
            partData[i]._data = data._data;
            sum = Modular_Data_1.Modular_Data.operator_add(sum, Modular_Data_1.Modular_Data.operator_mult(vectData[i], data));
        }
        var saved = false;
        data._data = (((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS);
        while ((data._data == 0) || ((Modular_Data_1.Modular_Data.operator_add(sum, Modular_Data_1.Modular_Data.operator_mult(vectData[order - 1], data)))._data == 1)) { // *** Después de probar que funiona, quitar el siguiente if, la variable saved y el parámetro value.
            if (!saved) {
                saved = true;
                value._data = data._data;
            }
            data._data = (((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS);
        }
        partData[order - 1]._data = data._data;
        partner._vector = partData;
        return partner;
    };
    Hill_Vector.prototype.PartnerForElementaryHillMatrixWithoutDuplicatesFor = function (vector, value) {
        var order = vector._order;
        var partner = new Hill_Vector(order, []);
        var data = new Modular_Data_1.Modular_Data(0);
        var sum = new Modular_Data_1.Modular_Data(0);
        var vectData = vector._vector;
        var partData = partner._vector;
        var valid = false, found = false;
        var j = 0;
        for (var i = 0; i < order - 1; i++) {
            valid = false;
            while (!valid) {
                data._data = (((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS);
                while (data._data == 0)
                    data._data = (((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS);
                j = 0;
                found = false;
                while ((j < i) && !found) {
                    found = (partData[j]._data == data._data);
                    if (!found)
                        j++;
                }
                valid = !found;
            }
            partData[i]._data = data._data;
            sum = Modular_Data_1.Modular_Data.operator_add(sum, Modular_Data_1.Modular_Data.operator_mult(vectData[i], data));
        }
        var saved = false;
        valid = false;
        while (!valid) {
            data._data = (((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS);
            while (data._data == 0)
                data._data = (((Random_Generator_1.Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS);
            j = 0;
            found = false;
            while ((j < order - 1) && !found) {
                found = (partData[j]._data == data._data);
                if (!found)
                    j++;
            }
            valid = !found && ((Modular_Data_1.Modular_Data.operator_add(sum, Modular_Data_1.Modular_Data.operator_mult(vectData[order - 1], data)))._data != 1);
            // *** Después de probar que funciona, quitar el siguiente if, la variable saved y el parámetro value.
            if (!saved && !valid && !found) {
                saved = true;
                value._data = data._data;
            }
        }
        partData[order - 1]._data = data._data;
        partner._vector = partData;
        return partner;
    };
    return Hill_Vector;
}());
exports["default"] = Hill_Vector;
var vector1 = new Hill_Vector(4, [1547, 5478, 8746, 58744]);
var vector2 = new Hill_Vector(4, [797, 457, 421, 4454]);
console.log(Hill_Vector.operator_mult(vector1, vector2));

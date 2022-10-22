"use strict";
exports.__esModule = true;
exports.Modular_Data = void 0;
var Random_Generator_1 = require("./Random_Generator");
var MODULUS = 251;
var Modular_Data = /** @class */ (function () {
    function Modular_Data(newData) {
        this._data = 0;
        this._data = newData % MODULUS;
    }
    Modular_Data.prototype.get_data = function () {
        return this._data;
    };
    Modular_Data.prototype.set_data = function (value) {
        this._data = ((value % MODULUS) + MODULUS) % MODULUS;
    };
    Modular_Data.operator_mult = function (data1, data2) {
        if (data1 === undefined || data2 === undefined)
            return new Modular_Data(0);
        else
            return new Modular_Data(data1._data * data2._data);
    };
    Modular_Data.operator_div = function (data1, data2) {
        return this.operator_mult(data1, this.operator_inverseOf(data2));
    };
    Modular_Data.operator_add = function (data1, data2) {
        var result = new Modular_Data(0);
        var d = 0, d1 = 0;
        if (data1 !== undefined && data2 !== undefined) {
            d = data1._data;
            d1 = data2._data;
        }
        result._data = d + d1 >= MODULUS ? d + d1 - MODULUS : d + d1;
        return result;
    };
    Modular_Data.operator_sub = function (data1, data2) {
        var result = new Modular_Data(0);
        var d = 0, d1 = 0;
        if (data1 !== undefined && data2 !== undefined) {
            d = data1._data;
            d1 = data2._data;
        }
        result._data = d >= d1 ? d - d1 : d + MODULUS - d1;
        return result;
    };
    Modular_Data.operator_sub_value = function (data, value) {
        var result = new Modular_Data(0);
        var d = 0;
        if (data !== undefined)
            d = data._data;
        var x = ((value % MODULUS) + MODULUS) % MODULUS;
        result._data = d >= x ? d - x : d - x + MODULUS;
        return result;
    };
    Modular_Data.operator_inverseOf = function (data) {
        var result = new Modular_Data(0);
        var x = 0, y = 0;
        x = Random_Generator_1.Random_Generator.GCDExt(data._data, MODULUS, x, y);
        result._data = ((x % MODULUS) + MODULUS) % MODULUS;
        return result;
    };
    Modular_Data.operator_inverseOfWithValue = function (value) {
        var result = new Modular_Data(0);
        var x = 0, y = 0;
        x = Random_Generator_1.Random_Generator.GCDExt(value, MODULUS, x, y);
        result._data = ((x % MODULUS) + MODULUS) % MODULUS;
        return result;
    };
    Modular_Data.PowerOf = function (data, power) {
        var result = data;
        //  result._data = (power == 0 ? 1 : (power == 1 ? data._data :
        //                  (power > 0 ? (int)((((qCeil(qPow(data._data, power))) % MODULUS) + MODULUS) % MODULUS) :
        //                  (int)((((qCeil(qPow(InverseOf(data)._data, -power))) % MODULUS) + MODULUS) % MODULUS))))
        for (var i = 2; i <= power; i++) {
            result = this.operator_mult(result, data);
        }
        return result;
    };
    Modular_Data.InitializeArray = function (order) {
        var array = new Array(order);
        array = array.map(function () { return new Modular_Data(1); });
        console.log("array init: ", array);
        return array;
    };
    return Modular_Data;
}());
exports.Modular_Data = Modular_Data;
/******** Proof area ************/
/*
let valueToProof = 5487;
let modulardta = new Modular_Data(valueToProof);
console.log(
  "Modular data of - ",
  valueToProof,
  " is : ",
  modulardta.get_data_modular
);
valueToProof = 9857;
modulardta.set_data_modular(valueToProof);
console.log(
  "New modular data of - ",
  valueToProof,
  " is : ",
  modulardta.get_data_modular
);
*/
/****************************** */
var valueToProof = 98;
var modulardta = new Modular_Data(98);
var modulardta1 = new Modular_Data(150);
var result = Modular_Data.PowerOf(modulardta, 6);
console.log("Result of operator_add is : ", result);

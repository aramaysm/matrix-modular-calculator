import { Random_Generator } from "./Random_Generator";

const MODULUS = 251;

export class Modular_Data {
  _data: number = 0;

  constructor(newData: number) {
    this._data = newData % MODULUS;
  }

  get_data(): number {
    return this._data;
  }
  set_data(value: number) {
    this._data = ((value % MODULUS) + MODULUS) % MODULUS;
  }

  static operator_mult(data1: Modular_Data, data2: Modular_Data): Modular_Data {
    if (data1 === undefined || data2 === undefined) return new Modular_Data(0);
    else return new Modular_Data(data1._data * data2._data);
  }
  static operator_div(data1: Modular_Data, data2: Modular_Data): Modular_Data {
    return this.operator_mult(data1, this.operator_inverseOf(data2));
  }
  static operator_add(data1: Modular_Data, data2: Modular_Data) {
    let result: Modular_Data = new Modular_Data(0);
    let d:number=0,d1:number=0;
    if(data1!==undefined && data2!==undefined){
       d = data1._data;
       d1 = data2._data;
    }

   
    result._data = d + d1 >= MODULUS ? d + d1 - MODULUS : d + d1;
    return result;
  }
  static operator_sub(data1: Modular_Data, data2: Modular_Data): Modular_Data {
    let result: Modular_Data = new Modular_Data(0);
    
    
   let d: number = 0,
     d1: number = 0;
   if (data1 !== undefined && data2 !== undefined) {
     d = data1._data;
     d1 = data2._data;
   }
    result._data = d >= d1 ? d - d1 : d + MODULUS - d1;
    return result;
  }
  static operator_sub_value(data: Modular_Data, value: number): Modular_Data {
    let result: Modular_Data = new Modular_Data(0);
    let d: number=0;
    if (data !== undefined)  d = data._data;
    let x = ((value % MODULUS) + MODULUS) % MODULUS;
    result._data = d >= x ? d - x : d - x + MODULUS;
    return result;
  }
  static operator_inverseOf(data: Modular_Data) {
    let result: Modular_Data = new Modular_Data(0);
    let x: number = 0,
      y: number = 0;

    x = Random_Generator.GCDExt(data._data, MODULUS, x, y);
    result._data = ((x % MODULUS) + MODULUS) % MODULUS;

    return result;
  }
  static operator_inverseOfWithValue(value: number) {
    let result: Modular_Data = new Modular_Data(0);
    let x: number = 0,
      y: number = 0;

    x = Random_Generator.GCDExt(value, MODULUS, x, y);
    result._data = ((x % MODULUS) + MODULUS) % MODULUS;
    return result;
  }
  static PowerOf(data: Modular_Data, power: number): Modular_Data {
    let result: Modular_Data = data;
    //  result._data = (power == 0 ? 1 : (power == 1 ? data._data :
    //                  (power > 0 ? (int)((((qCeil(qPow(data._data, power))) % MODULUS) + MODULUS) % MODULUS) :
    //                  (int)((((qCeil(qPow(InverseOf(data)._data, -power))) % MODULUS) + MODULUS) % MODULUS))))
    for (let i = 2; i <= power; i++) {
      result = this.operator_mult(result, data);
    }
    return result;
  }

  static InitializeArray(order: number): Array<Modular_Data> {
    let array: Array<Modular_Data> = new Array<Modular_Data>(order);

    array = array.map(() => new Modular_Data(1));

    console.log("array init: ", array);
    return array;
  }
}

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
let valueToProof = 98;
let modulardta = new Modular_Data(98);
let modulardta1 = new Modular_Data(150);
let result = Modular_Data.PowerOf(modulardta,6);
console.log("Result of operator_add is : ", result);

import { Modular_Data } from "./Modular_Data";
import { Random_Generator } from "./Random_Generator";


const MODULUS = 251;

export default class Hill_Vector {
  _order: number;
  _vector: Array<Modular_Data>;

  constructor(orderNew: number, newVector: Array<number>) {
   
    if (
      (orderNew === null || orderNew === 0) &&
      (newVector === null || newVector.length === 0)
    ) {
      this._order = 0;
      this._vector = new Array<Modular_Data>(0);
    } else {
      this._order = newVector.length;
      this._vector = newVector.map((item) => new Modular_Data(item));
    }
  }

  get_vector(): Array<Modular_Data> {
    return this._vector;
  }
  set_vector(newVector: Array<Modular_Data>) {
    this._vector = newVector;
  }

  get_order(): number {
    return this._order;
  }


  /* ---Types of vectors
  0 - vtNull,
  1 - vtRandom,
  2 - vtRandomWithoutDuplicates,
  3 - vtRandomForElementaryMatrix,
  4 - vtRandomForElementaryMatrixWithoutDuplicates,
  5 - vtUnit


  */
InitializeAs(vType:number, order:number):Array<Modular_Data>
{ 
  
  
  let vectData:Array<Modular_Data> =  new Array<Modular_Data>(order);
  

 

  switch (vType) {
    case 0:
      for (let i = 0; i < order; i++) vectData[i]._data = 0;
      break;
    case 1: {
      let data: Modular_Data = new Modular_Data(0);

      for (let i = 0; i < order; i++) {
        data._data =
          ((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
        while (data._data == 0)
          data._data =
            ((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
        vectData[i] = data;
      }
      break;
    }
    case 2: {
      let data: Modular_Data = new Modular_Data(0);
      let valid: boolean, found: boolean;
      let j;
      for (let i = 0; i < order; i++) {
        valid = false;
        while (!valid) {
          data._data =
            ((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
          while (data._data == 0)
            data._data =
              ((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
          j = 0;
          found = false;
          while (j < i && !found) {
            found = (vectData[j]._data == data._data);
            if (!found) j++;
          }
          valid = !found;
        }
        vectData[i] = data;
      }
      break;
    }
    case 3: {
      let data: Modular_Data = new Modular_Data(0);
      let sum: Modular_Data = new Modular_Data(0);
      for (let i = 0; i < order - 1; i++) {
        data._data =
          ((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
        while (data._data == 0)
          data._data =
            ((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
        vectData[i] = data;

        sum = Modular_Data.operator_add(
          sum,
          Modular_Data.operator_mult(data, data)
        );
      }
      data._data =
        ((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
      while (
        data._data == 0 ||
        Modular_Data.operator_add(sum, Modular_Data.operator_mult(data, data))
          ._data == 1
      )
        data._data =
          ((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
      vectData[order - 1] = data;

      
      break;
    }
    case 4: {
      let data: Modular_Data = new Modular_Data(0);
      let sum: Modular_Data = new Modular_Data(0);
      let valid: boolean, found: boolean;
      let j;
      for (let i = 0; i < order - 1; i++) {
        valid = false;
        while (!valid) {
          data._data =
            ((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
          while (data._data == 0)
            data._data =
              ((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
          j = 0;
          found = false;
          while (j < i && !found) {
            found = vectData[j]._data == data._data;
            if (!found) j++;
          }
          valid = !found;
        }
        vectData[i] = data;
        sum = Modular_Data.operator_add(
          sum,
          Modular_Data.operator_mult(data, data)
        );
      }
      valid = false;
      while (!valid) {
        data._data =
          ((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
        while (data._data == 0)
          data._data =
            ((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
        j = 0;
        found = false;
        while (j < order - 1 && !found) {
          found = vectData[j]._data == data._data;
          if (!found) j++;
        }
        valid =
          !found &&
          Modular_Data.operator_add(sum, Modular_Data.operator_mult(data, data))
            ._data != 1;
      }
      vectData[order - 1] = data;
      break;
    }
    default:
      for (let i = 0; i < order; i++) vectData[i] = new Modular_Data(1);
  }
  return vectData;
}

//Producto cruz ------El resultado es un vector
MultiplyHillVectors(vector1:Hill_Vector,vector2:Hill_Vector):Hill_Vector
{ 
  let order = vector1._order;
  let productHill_Vector = new Hill_Vector(order,[]);
  let v1Data:Array<Modular_Data> = vector1._vector;
  let v2Data:Array<Modular_Data> = vector2._vector;
  let prodData:Array<Modular_Data> = productHill_Vector._vector;

  

 for (let i = 0; i < order; i++)
    prodData[i] = Modular_Data.operator_mult(v1Data[i] ,v2Data[i]);

  console.log("Product by operator_mult is:",prodData);


    productHill_Vector._vector = prodData;
  return productHill_Vector;
}

//Producto punto ------El resultado es un escalar
static operator_mult(vector1:Hill_Vector, vector2:Hill_Vector):Modular_Data{ 
  let result:Modular_Data = new Modular_Data(0);
  for (let i = 0; i < vector1._order; i++)
    result = Modular_Data.operator_add(result,Modular_Data.operator_mult( vector1._vector[i],vector2._vector[i]));
  return result;
}

PartnerForElementaryHillMatrixFor(vector:Hill_Vector,  value:Modular_Data):Hill_Vector{ 
  let order = vector._order;

  let partner:Hill_Vector = new Hill_Vector(order,[]);

  let data:Modular_Data = new Modular_Data(0);
  let sum:Modular_Data = new Modular_Data(0);
  let vectData:Array<Modular_Data> = vector._vector;
  let partData:Array<Modular_Data> = partner._vector;

  for (let i = 0; i < order - 1; i++)
  { data._data = (((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS);
    while (data._data == 0)
      data._data = (((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS);
    partData[i]._data = data._data;
    sum = Modular_Data.operator_add(sum,Modular_Data.operator_mult(vectData[i],data));
   
  }
  let saved:boolean = false;
  data._data = (((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS);
  while ((data._data == 0) || ((Modular_Data.operator_add(sum,Modular_Data.operator_mult(vectData[order-1],data)))._data == 1))
  { // *** Después de probar que funiona, quitar el siguiente if, la variable saved y el parámetro value.
    if (!saved)
    { saved = true;
      value._data = data._data;
    }
    data._data = (((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS);
  }
  partData[order - 1]._data = data._data;
  
  partner._vector = partData;

  return partner;
}

PartnerForElementaryHillMatrixWithoutDuplicatesFor( vector:Hill_Vector,  value:Modular_Data):Hill_Vector{
  
  let order = vector._order;
  let partner:Hill_Vector = new Hill_Vector(order,[]);
  let data:Modular_Data = new Modular_Data(0);
  let sum:Modular_Data = new Modular_Data(0);

  let vectData:Array<Modular_Data> = vector._vector;
  let partData:Array<Modular_Data> = partner._vector;

  let valid:boolean = false, found:boolean=false;
  let j:number=0;
  for (let i = 0; i < order - 1; i++)
  { valid = false;
    while (!valid)
    { data._data = (((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS);
      while (data._data == 0)
        data._data = (((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS);
      j = 0;
      found = false;
      while ((j < i) && !found)
      { found = (partData[j]._data == data._data);
        if (!found)
          j++;
      }
      valid = !found;
    }
    partData[i]._data = data._data;
    sum = Modular_Data.operator_add(sum,Modular_Data.operator_mult(vectData[i],data));
  }
  let saved:boolean = false;
  valid = false;
  while (!valid)
  { data._data = (((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS);
    while (data._data == 0)
      data._data = (((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS);
    j = 0;
    found = false;
    while ((j < order - 1) && !found)
    { found = (partData[j]._data == data._data);
      if (!found)
        j++;
    }
    valid = !found && ((Modular_Data.operator_add(sum,Modular_Data.operator_mult(vectData[order-1],data)))._data != 1);
    // *** Después de probar que funciona, quitar el siguiente if, la variable saved y el parámetro value.
    if (!saved && !valid && !found)
    { saved = true;
      value._data = data._data;
    }
  }
  partData[order - 1]._data = data._data;

 partner._vector = partData;

  return partner;
}

  
}

const vector1 = new Hill_Vector(4, [1547, 5478, 8746, 58744]);
const vector2 = new Hill_Vector(4, [797, 457, 421, 4454]);
console.log(Hill_Vector.operator_mult(vector1, vector2));

import Hill_Vector from "./Hill_Vector";
import { Modular_Data } from "./Modular_Data";
import Square_Hill_Matrix from "./Square_Hill_Matrix";
import { Random_Generator } from "./Random_Generator";
import Diagonal_Hill_Matrix from "./Diagonal_Hill_Matrix"

const MODULUS = 251;

export default class Elementary_Matrix {
  _equalVectors: boolean;
  _factorForInverse: Modular_Data;
  _initialized: boolean = false;
  _order: number;
  _vector1: Hill_Vector;
  _vector2: Hill_Vector;

  constructor(order: number = 0) {
    this._vector1 = new Hill_Vector(order, []);
    this._vector2 = new Hill_Vector(order, []);
    this._order = order;
    this._equalVectors = false;
    this._factorForInverse = new Modular_Data(0);
  }

  get_vector1() {
    return this._vector1;
  }
  get_vector2() {
    return this._vector2;
  }
  get_order() {
    return this._order;
  }
  is_equalVectors() {
    return this._equalVectors;
  }
  get_factorForInverse() {
    return this._factorForInverse;
  }

  set_vector1(vector1: Hill_Vector) {
    this._vector1 = vector1;
  }
  set_vector2(vector2: Hill_Vector) {
    this._vector2 = vector2;
  }
  set_order(order: number) {
    this._order = order;
  }
  set_equalVectors(equalsVectors: boolean) {
    this._equalVectors = equalsVectors;
  }
  set_factorForInverse(factorForI: Modular_Data) {
    this._factorForInverse = factorForI;
  }

  ElementaryTransformationUsing1(
    dMat: Diagonal_Hill_Matrix,
    eMat: Elementary_Matrix
  ): Square_Hill_Matrix {
    let order = eMat._order,
      k = 0;
    let result: Square_Hill_Matrix = new Square_Hill_Matrix(order, []);
    let u: Array<Modular_Data> = eMat._vector1._vector;
    let vT: Array<Modular_Data> = eMat._vector2._vector;
    let d: Array<Modular_Data> = dMat._matrix;
    let eMatInvFactor: Modular_Data = new Modular_Data(0);
    let s: Modular_Data = new Modular_Data(0);
    let u1Item: Modular_Data = new Modular_Data(0);

    eMatInvFactor._data = eMat._factorForInverse._data;
    for (let i = 0; i < order; i++)
      s = Modular_Data.operator_add(
        s,
        Modular_Data.operator_mult(
          Modular_Data.operator_mult(d[i], u[i]),
          Modular_Data.operator_mult(eMatInvFactor, vT[i])
        )
      );
    // s += eMatInvFactor * vT[i] * d[i] * u[i];
    for (let row = 0; row < order; row++) {
      u1Item = Modular_Data.operator_mult(
        Modular_Data.operator_sub(
          s,
          Modular_Data.operator_mult(eMatInvFactor, d[row])
        ),
        u[row]
      );
      for (let col = 0; col < order; col++)
        result._matrix[k++] = Modular_Data.operator_add(
          row == col ? d[row] : new Modular_Data(0),
          Modular_Data.operator_mult(
            Modular_Data.operator_sub(
              u1Item,
              Modular_Data.operator_mult(u[row], d[col])
            ),
            vT[col]
          )
        );
    }

    return result;
  }
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
  InitializeAs(
    emType: number,
    order: number,
    equalVectors: boolean
  ): Elementary_Matrix {
    let matrix: Elementary_Matrix = new Elementary_Matrix(order);

    if (order == 0) return new Elementary_Matrix(0);

    let data: Modular_Data = new Modular_Data(0);
    let data1: Modular_Data = new Modular_Data(0);
    let valid: boolean = false,
      found: boolean = false;
    let j: number = 0;

    matrix._equalVectors = equalVectors;

    if (
      matrix._vector1._vector === undefined ||
      matrix._vector1._vector === null ||
      matrix._vector1._vector.length === 0
    )
      matrix._vector1._vector = matrix._vector1.InitializeAs(3, order);

    let matVect1Data: Array<Modular_Data> = matrix._vector1._vector;
    let invFactor: Modular_Data = matrix._factorForInverse;

    if (equalVectors) {
      switch (emType) {
        case 0: {
          for (let i = 0; i < order; i++) matVect1Data[i] = new Modular_Data(0);
          invFactor._data = Modular_Data.operator_inverseOfWithValue(
            MODULUS - 1
          )._data;
          break;
        }
        case 1: {
          invFactor._data = 0;
          for (let i = 0; i < order - 1; i++) {
            data._data =
              ((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
            while (data._data == 0 || (data._data * data._data) % MODULUS == 1)
              data._data =
                ((Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                MODULUS;
            matVect1Data[i] = data;
            invFactor = Modular_Data.operator_add(
              invFactor,
              Modular_Data.operator_mult(data, data)
            );
          }
          data._data =
            ((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
          while (
            data._data == 0 ||
            (data._data * data._data) % MODULUS == 1 ||
            Modular_Data.operator_add(
              invFactor,
              Modular_Data.operator_mult(data, data)
            )._data == 1
          )
            data._data =
              ((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
          matVect1Data[order - 1] = data;
          invFactor._data = Modular_Data.operator_inverseOfWithValue(
            Modular_Data.operator_add(
              invFactor,
              Modular_Data.operator_mult(data, data)
            )._data - 1
          )._data;
          break;
        }
        default: {
          invFactor._data = 0;
          for (let i = 0; i < order - 1; i++) {
            valid = false;
            data = new Modular_Data(0);
            while (valid === false) {
              data._data =
                ((Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                MODULUS;
              while (data._data === 0)
                data._data =
                  ((Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                  MODULUS;
              //console.log("Data:", data._data);
              let filtredArray = matVect1Data.filter(
                (item, index) => item._data === data._data && index < i
              );

              if (filtredArray.length === 0) valid = true;
              else valid = false;
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
            invFactor = Modular_Data.operator_add(
              invFactor,
              Modular_Data.operator_mult(data, data)
            );
          }
          valid = false;
          while (!valid) {
            data._data =
              ((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
            while (data._data == 0 || (data._data * data._data) % MODULUS == 1)
              data._data =
                ((Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                MODULUS;
            j = 0;
            found = false;
            while (j < order - 1 && !found) {
              found = matVect1Data[j]._data == data._data;
              if (!found) j++;
            }
            valid =
              !found &&
              Modular_Data.operator_add(
                invFactor,
                Modular_Data.operator_mult(data, data)
              )._data != 1;
          }
          matVect1Data[order - 1] = data;
          invFactor._data = Modular_Data.operator_inverseOfWithValue(
            Modular_Data.operator_add(
              invFactor,
              Modular_Data.operator_mult(data, data)
            )._data - 1
          )._data;
        }
      }
      matrix._vector2 = matrix._vector1;
    } else {
      if (!matrix._vector2) matrix._vector2 = new Hill_Vector(order, []);
      let matVect2Data: Array<Modular_Data> = matrix._vector2._vector;
      switch (emType) {
        case 0: {
          for (let i = 0; i < order; i++)
            matVect1Data[i] = matVect2Data[i] = new Modular_Data(0);
          invFactor = Modular_Data.operator_inverseOfWithValue(MODULUS - 1);
          break;
        }
        case 1: {
          invFactor._data = 0;
          for (let i = 0; i < order - 1; i++) {
            data._data =
              ((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
            while (data._data == 0)
              data._data =
                ((Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                MODULUS;
            data1._data =
              ((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
            while (
              data1._data == 0 ||
              (data1._data * data._data) % MODULUS == 1
            )
              data1._data =
                ((Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                MODULUS;
            matVect1Data[i] = data;
            matVect2Data[i] = data1;
            invFactor._data = Modular_Data.operator_inverseOfWithValue(
              Modular_Data.operator_add(
                invFactor,
                Modular_Data.operator_mult(data, data1)
              )._data - 1
            )._data;
          }
          data._data =
            ((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
          while (data._data == 0)
            data._data =
              ((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
          data1._data =
            ((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
          while (
            data1._data == 0 ||
            (data1._data * data._data) % MODULUS == 1 ||
            Modular_Data.operator_add(
              invFactor,
              Modular_Data.operator_mult(data, data1)
            )._data == 1
          )
            data1._data =
              ((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
          matVect1Data[order - 1] = data;
          matVect2Data[order - 1] = data1;
          // invFactor._data = InverseOf(invFactor + data * data1 - 1)._data;
          invFactor._data = Modular_Data.operator_inverseOf(
            Modular_Data.operator_add(
              invFactor,
              Modular_Data.operator_sub_value(
                Modular_Data.operator_mult(data, data1),
                1
              )
            )
          )._data;
          break;
        }
        default: {
          invFactor._data = 0;

          for (let i = 0; i < order - 1; i++) {
            valid = false;
            data = new Modular_Data(0);
            data1 = new Modular_Data(0);
            while (valid === false) {
              data._data =
                ((Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                MODULUS;
              while (data._data === 0)
                data._data =
                  ((Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                  MODULUS;
              //console.log("Data:", data._data);
              const filtredArray = matVect1Data.filter(
                (item, index) => item._data === data._data && index < i
              );

              if (filtredArray.length === 0) valid = true;
              else valid = false;
            }
            matVect1Data[i] = data;
            valid = false;

            while (valid === false) {
              data1._data =
                ((Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                MODULUS;
              while (data1._data === 0)
                data1._data =
                  ((Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                  MODULUS;
              //console.log("Data:", data._data);
              const filtredArray = matVect2Data.filter(
                (item, index) => item._data === data1._data && index < i
              );

              if (filtredArray.length === 0) valid = true;
              else valid = false;
            }
            matVect2Data[i] = data1;
            invFactor = Modular_Data.operator_add(
              invFactor,
              Modular_Data.operator_mult(data, data1)
            );
          }
          valid = false;
          data = new Modular_Data(0);
          data1 = new Modular_Data(0);
          while (valid === false) {
            data._data =
              ((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
            while (data._data === 0)
              data._data =
                ((Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                MODULUS;
            //console.log("Data:", data._data);
            const filtredArray = matVect1Data.filter(
              (item, index) => item._data === data._data && index < order - 1
            );

            if (filtredArray.length === 0) valid = true;
            else valid = false;
          }

          matVect1Data[order - 1] = data;
          valid = false;

          while (valid === false) {
            data1._data =
              ((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
            while (data1._data === 0)
              data1._data =
                ((Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                MODULUS;
            //console.log("Data:", data._data);
            const filtredArray = matVect2Data.filter(
              (item, index) => item._data === data1._data && index < order - 1
            );

            valid =
              !found &&
              Modular_Data.operator_add(
                invFactor,
                Modular_Data.operator_mult(data, data1)
              )._data != 1;
          }

          matVect2Data[order - 1] = data1;
          invFactor = Modular_Data.operator_inverseOf(
            Modular_Data.operator_add(
              invFactor,
              Modular_Data.operator_sub_value(
                Modular_Data.operator_mult(data, data1),
                1
              )
            )
          );
          matrix._factorForInverse = invFactor;

          matrix._vector1._vector = matVect1Data;
          matrix._vector2._vector = matVect2Data;
        }
      }
    }
    this._initialized = true;

    return matrix;
  }

  static InverseOf(matrix: Elementary_Matrix): Elementary_Matrix {
    let order = matrix._order,
      j = 0;

    let result: Elementary_Matrix = new Elementary_Matrix(order);
    if (matrix._initialized) {
      let rFactor: Modular_Data = result._factorForInverse;
      rFactor._data = 0;
      // result->_equalVectors = matrix._equalVectors;
      let factor: Modular_Data = matrix._factorForInverse;
      let mV1Data: Array<Modular_Data> = matrix._vector1._vector;
      let mV2Data: Array<Modular_Data> = matrix._vector2._vector;
      let rV1Data: Array<Modular_Data> = result._vector1._vector;
      let rV2Data: Array<Modular_Data> = result._vector2._vector;
      for (let i = 0; i < order; i++) {
        rV1Data[i] = Modular_Data.operator_mult(factor, mV1Data[i]);
        rV2Data[i]._data = mV2Data[i]._data;
        if (rV1Data[i]._data == rV2Data[i]._data) j++;

        rFactor = Modular_Data.operator_add(
          rFactor,
          Modular_Data.operator_mult(rV1Data[i], rV2Data[i])
        );
      }
      rFactor._data = Modular_Data.operator_inverseOf(
        Modular_Data.operator_sub_value(rFactor, 1)
      )._data;

      if (j === order) result._equalVectors = true;
      else result._equalVectors = false;
      if (result._equalVectors) {
        result._vector2 = result._vector1;
      }
    }
    return result;
  }

  MultiplyHillMatrices(
    matrix1: Elementary_Matrix,
    matrix2: Elementary_Matrix
  ): Square_Hill_Matrix {
    let order = matrix1._order;
    let result: Square_Hill_Matrix = new Square_Hill_Matrix(order, []);
    if (matrix1._initialized && matrix2._initialized) {
      let mat1V1: Hill_Vector = matrix1._vector1;
      let mat1V2: Hill_Vector = matrix1._vector2;
      let mat2V1: Hill_Vector = matrix2._vector1;
      let mat2V2: Hill_Vector = matrix2._vector2;

      let factor: Modular_Data = Hill_Vector.operator_mult(mat1V2, mat2V1);

      let mat1V1Data: Array<Modular_Data> = mat1V1._vector;
      let mat1V2Data: Array<Modular_Data> = mat1V2._vector;
      let mat2V1Data: Array<Modular_Data> = mat2V1._vector;
      let mat2V2Data: Array<Modular_Data> = mat2V2._vector;
      let resData: Array<Modular_Data> = result._matrix;
      let zero: Modular_Data = new Modular_Data(0);
      let one: Modular_Data = new Modular_Data(1);

      for (let r = 0; r < order; r++)
        for (let c = 0; c < order; c++)
          /*resData[r * order + c] = (r == c ? one : zero) - (mat2V1Data[r] * mat2V2Data[c])
         - (mat1V1Data[r] * mat1V2Data[c]) +   (factor * (mat1V1Data[r] * mat2V2Data[c]));*/
          resData[r * order + c] = Modular_Data.operator_sub(
            r == c ? one : zero,
            Modular_Data.operator_sub(
              Modular_Data.operator_mult(mat2V1Data[r], mat2V2Data[c]),
              Modular_Data.operator_add(
                Modular_Data.operator_mult(mat1V1Data[r], mat1V2Data[c]),
                Modular_Data.operator_mult(
                  factor,
                  Modular_Data.operator_mult(mat1V1Data[r], mat2V2Data[c])
                )
              )
            )
          );
    }
    return result;
  }

  static ToSquare_Hill_Matrix(matrix: Elementary_Matrix): Square_Hill_Matrix {
    let order = matrix._order;
    let resPtr: Square_Hill_Matrix = new Square_Hill_Matrix(order, []);

    let iMatItem: Modular_Data = new Modular_Data(0);

    for (let row = 0; row < order; row++)
      for (let col = 0; col < order; col++) {
        if (row === col) iMatItem._data = 1;
        else iMatItem._data = 0;
        //resPtr._matrix[row * order + col] = iMatItem - matrix._vector1._vector[row] * matrix._vector2.vector[col];
        resPtr._matrix[row * order + col] = Modular_Data.operator_sub(
          iMatItem,
          Modular_Data.operator_mult(
            matrix._vector1._vector[row],
            matrix._vector2._vector[col]
          )
        );
      }
    return resPtr;
  }
}
/*
let matrix: Elementary_Matrix = new Elementary_Matrix(8);
matrix = matrix.InitializeAs(3, 8, false);
console.log("Matrix elem", matrix);
console.log("Square matrix is", Elementary_Matrix.ToSquare_Hill_Matrix(matrix));*/
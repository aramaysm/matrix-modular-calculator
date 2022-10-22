import Diagonal_Hill_Matrix from "./Diagonal_Hill_Matrix";
import { Modular_Data } from "./Modular_Data";
import { Random_Generator } from "./Random_Generator";

const MODULUS = 251;

class Square_Hill_Matrix {
  _order: number;
  _matrix: Array<Modular_Data>;

  constructor(orderNew: number, matrixNew: Array<number>) {
    this._order = orderNew;
    if (matrixNew !== null && matrixNew !== undefined && matrixNew.length > 0) {
      this._matrix = matrixNew.map((item) => new Modular_Data(item));
    } else {
      this._matrix = new Array<Modular_Data>(orderNew * orderNew);
    }
  }

  get_matrix() {
    return this._matrix;
  }
  get_order() {
    return this._order;
  }

  set_matrix(newMatrix: Array<Modular_Data>) {
    this._matrix = newMatrix;
  }

  set_order(newOrder: number) {
    this._order = newOrder;
  }

  getItem(row: number, col: number): number {
    return this._matrix[row * this._order + col].get_data();
  }
  setItem(row: number, col: number, dataNew: number) {
    this._matrix[row * this._order + col] = new Modular_Data(dataNew);
  }

  /* --mType es el tipo de matriz--
0 - matriz de identidad,
1 - matriz null,
2 - matriz de valores random
3 - matriz de valores random sin duplicados
*/
  static AreEquals(
    mat1: Square_Hill_Matrix,
    mat2: Square_Hill_Matrix
  ): boolean {
    let order = mat1._order;
    let areEquals = false;
    let idx = 0;
    while (idx < order * order && areEquals)
      if (mat1._matrix[idx]._data != mat2._matrix[idx]._data) areEquals = false;
      else idx++;
    return areEquals;
  }

  InitializeAs(mtype: number, order: number): Array<Modular_Data> {
    let matrix: Array<Modular_Data> = new Array<Modular_Data>(order * order);

    if (order == 0) return new Array<Modular_Data>(0);

    switch (mtype) {
      case 0:
        for (let i = 0; i < order * order; i++)
          if (i % (order + 1) != 0) matrix[i] = new Modular_Data(0);
          else matrix[i] = new Modular_Data(1);
        break;
      case 1:
        for (let i = 0; i < order * order; i++) matrix[i] = new Modular_Data(0);
        break;
      case 2: {
        let data: Modular_Data = new Modular_Data(0);
        for (let i = 0; i < order * order; i++) {
          data._data =
            ((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
          while (data._data == 0)
            data._data =
              ((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
          matrix[i] = data;
        }
        break;
      }
      default: {
        //console.log("Into default option");

        let data: Modular_Data = new Modular_Data(0);
        let valid: boolean = false,
          found: boolean = false;
        let j: number = 0;

        for (let i = 0; i < order * order; i++) {
          valid = false;
          while (valid === false) {
            data = new Modular_Data(0);
            data._data =
              ((Random_Generator.RandomValue() % MODULUS) + MODULUS) % MODULUS;
            while (data._data === 0)
              data._data =
                ((Random_Generator.RandomValue() % MODULUS) + MODULUS) %
                MODULUS;
            j = 0;
            found = false;

            while (j < i && found === false) {
              found = matrix[j]._data === data._data ? true : false;

              if (found === false) j++;
            }

            if (found === false) {
              valid = true;
            } else {
              valid = false;
            }
          }
          matrix[i] = data;
        }
      }
    }

    return matrix;
  }

  GaussianEliminationOf(): Square_Hill_Matrix {
    let order: number = this._order;
    let array: Array<number> = Random_Generator.Generate_Zeros_Array(order);

    let gaussMat = new Square_Hill_Matrix(this._order, array);
    gaussMat.set_matrix(this._matrix);
    let diagData: Modular_Data = new Modular_Data(0);
    let quotient: Modular_Data = new Modular_Data(0);

    for (let col = 0; col < order - 1; col++) {
      diagData._data = gaussMat._matrix[col * order + col]._data;
      for (let row = col + 1; row < order; row++) {
        quotient = Modular_Data.operator_div(
          gaussMat._matrix[row * order + col],
          diagData
        );
        console.log(
          "Quotient is: ",
          quotient,
          ", diagonal_data is : ",
          diagData,
          " and matrix gauss mat is ",
          gaussMat._matrix[row * order + col]
        );
        gaussMat.setItem(row, col, 0);
        for (let k = col + 1; k < order; k++)
          gaussMat._matrix[row * order + k]._data -=
            quotient._data * gaussMat._matrix[col * order + k]._data;
      }

      console.log("Triangular matrix in gauss elimination: ", gaussMat);
    }

    return gaussMat;
  }

  DeterminantByGaussOf(): Modular_Data {
    let order: number = this._order;
    let array: Array<number> = Random_Generator.Generate_Zeros_Array(order);
    let result: Modular_Data = new Modular_Data(0);

    let triangMat: Square_Hill_Matrix = new Square_Hill_Matrix(order, array);
    triangMat = this.GaussianEliminationOf();
    console.log("Triangular matrix: ", triangMat);

    result._data = triangMat.get_matrix()[0]._data;

    for (let i = 1; i < order; i++) {
      result = Modular_Data.operator_mult(
        result,
        triangMat._matrix[i * order + i]
      );
      console.log("Determinante ahora: ", result);
    }

    return result;
  }

  InverseOf(matrix: Square_Hill_Matrix): Square_Hill_Matrix {
    let luFactors: Square_Hill_Matrix = this.LuFactorizationOf(matrix);
    let inverse: Square_Hill_Matrix = this.InverseOfWithLU(matrix, luFactors);

    return inverse;
  }

  InverseOfWithLU(
    matrix: Square_Hill_Matrix,
    luFactors: Square_Hill_Matrix
  ): Square_Hill_Matrix {
    let order = matrix._order,
      index;
    let inverse: Square_Hill_Matrix = new Square_Hill_Matrix(order, []);
    inverse._matrix = this.InitializeAs(0, order);
    for (let r = 1; r < order; r++)
      for (let c = 0; c < r; c++) {
        index = r * order + c;
        for (let k = c; k < r; k++)
          inverse._matrix[index] = Modular_Data.operator_sub(
            inverse._matrix[index],
            Modular_Data.operator_mult(
              luFactors._matrix[r * order + k],
              inverse._matrix[k * order + c]
            )
          );
      }
    let sum: Modular_Data = new Modular_Data(0);
    for (let c = 0; c < order; c++)
      for (let r = order - 1; r >= 0; r--) {
        index = r * order + c;
        sum = new Modular_Data(0);
        for (let k = r + 1; k < order; k++)
          sum = Modular_Data.operator_add(
            sum,
            Modular_Data.operator_mult(
              luFactors._matrix[r * order + k],
              inverse._matrix[k * order + c]
            )
          );

        inverse._matrix[index] = Modular_Data.operator_div(
          Modular_Data.operator_sub(inverse._matrix[index], sum),
          luFactors._matrix[r * order + r]
        );
      }

    return inverse;
  }

  LuFactorizationOf(matrix: Square_Hill_Matrix): Square_Hill_Matrix {
    let luFactors: Square_Hill_Matrix = new Square_Hill_Matrix(
      matrix._order,
      []
    );
    luFactors.set_matrix(matrix._matrix);

    let diagValue: Modular_Data = new Modular_Data(0);
    let order = matrix._order;
    for (let k = 0; k < order - 1; k++) {
      diagValue._data = luFactors._matrix[k * order + k]._data;
      for (let row = k + 1; row < order; row++)
        luFactors._matrix[row * order + k] = Modular_Data.operator_div(
          luFactors._matrix[row * order + k],
          diagValue
        );
      for (let row = k + 1; row < order; row++)
        for (let col = k + 1; col < order; col++)
          luFactors._matrix[row * order + col] = Modular_Data.operator_sub(
            luFactors._matrix[row * order + col],
            Modular_Data.operator_mult(
              luFactors._matrix[row * order + k],
              luFactors._matrix[k * order + col]
            )
          );
    }

    return luFactors;
  }

  MultiplyHillMatricesSquareByDiagonal(
    matrix: Square_Hill_Matrix,
    dMat: Diagonal_Hill_Matrix
  ): Square_Hill_Matrix {
    let order = matrix._order,
      index = 0;
    let product = new Square_Hill_Matrix(order, []);
    let matData: Array<Modular_Data> = matrix._matrix;
    let dMatData: Array<Modular_Data> = dMat._matrix;
    let prodData: Array<Modular_Data> = product._matrix;

    for (let col = 0; col < order; col++)
      for (let row = 0; row < order; row++) {
        index = row * order + col;
        prodData[index] = Modular_Data.operator_mult(
          dMatData[col],
          matData[index]
        );
      }

    return product;
  }

  static MultiplyHillMatrices(
    matrix1: Square_Hill_Matrix,
    matrix2: Square_Hill_Matrix
  ): Square_Hill_Matrix {
    let order = matrix1._order;
    let sum: Modular_Data = new Modular_Data(0);

    let product: Square_Hill_Matrix = new Square_Hill_Matrix(order, []);
    for (let row = 0; row < order; row++)
      for (let col = 0; col < order; col++) {
        sum = new Modular_Data(0);
        for (let k = 0; k < order; k++)
          sum = Modular_Data.operator_add(
            sum,
            Modular_Data.operator_mult(
              matrix1._matrix[row * order + k],
              matrix2._matrix[k * order + col]
            )
          );
        product._matrix[row * order + col] = sum;
      }

    return product;
  }

  PowerOf(mat: Square_Hill_Matrix, power: number): Square_Hill_Matrix {
    let matPower: Square_Hill_Matrix = new Square_Hill_Matrix(mat._order, []);
    matPower.set_matrix(mat._matrix);

    if (power != 0) {
      for (let i = 0; i < Math.floor(power) - 1; i++)
        matPower = Square_Hill_Matrix.MultiplyHillMatrices(matPower, mat);
      if (power < 0) matPower = this.InverseOf(matPower);
    } else matPower._matrix = this.InitializeAs(0, mat._order);
    return matPower;
  }

  PowerOfValueByValue(
    mat: Square_Hill_Matrix,
    power: number
  ): Square_Hill_Matrix {
    let matPower: Square_Hill_Matrix = new Square_Hill_Matrix(mat._order, []);
    matPower.set_matrix(mat._matrix);

    for (let i = 0; i < 64; i++)
      matPower._matrix[i] = Modular_Data.PowerOf(mat._matrix[i], power);

    if (power < 0) matPower = this.InverseOf(matPower);

    return matPower;
  }

  static ExportInitializeMatrix_Square(arrayModular:Array<Modular_Data>): Array<number> {
    let arrayNumber: Array<number> = new Array<number>();
    let square: Square_Hill_Matrix = new Square_Hill_Matrix(8, []);
    
    arrayNumber = arrayModular.map((item) => {
      return item._data;
    });

    return arrayNumber;
  }
  static ImportInitializeMatrix_Square(arrayNumber:Array<number>): Square_Hill_Matrix {
    let arrayModular: Array<Modular_Data> = new Array<Modular_Data>();
    let square: Square_Hill_Matrix = new Square_Hill_Matrix(8, []);
    
    arrayModular = arrayModular.map((item) => {
      
      return new Modular_Data(item._data);
    });

    square.set_matrix(arrayModular);

    return square;
  }
}

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
export default Square_Hill_Matrix;

//tsc Square_Hill_Matrix.ts
// node Square_Hill_Matrix.js
//tsc src/Math_Classes/Square_Hill_Matrix.ts
//  node src/Math_Classes/Square_Hill_Matrix.js

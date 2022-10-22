export class Random_Generator {
  static Generate_Zeros_Array(size: number): Array<number> {
    let array_result: Array<number> = new Array<number>(size);

    for (let i = 0; i < size; i++) {
      array_result[i] = 0;
    }

    console.log("Zeros array is :", array_result);

    return array_result;
  }

  static GCDExt(a: number, b: number, x: number, y: number): number {
    let result,
      a1 = a,
      b1 = b,
      x0,
      x1,
      x2,
      y0,
      y1,
      y2,
      q,
      r;
    if (b > a) {
      a1 = b;
      b1 = a;
    }
    if (b1 == 0) {
      result = a1;
      x = b > a ? 0 : 1;
      y = b > a ? 1 : 0;
    } else {
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
  }
  static RandomValue(): number {
    let result = Math.ceil(Math.random()*100);
    while (!result) result = Math.ceil(Math.random()*100);
    return result;
  }
  
  static RandomValueLessThan(bound: number): number {
    let result: number = Math.ceil(Math.random() * 100) % bound;
    while (result == 0) result = Math.ceil(Math.random() * 100) % bound;
    return result;
  }
}

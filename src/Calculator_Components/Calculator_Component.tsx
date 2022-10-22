import React, { FunctionComponent, useState } from "react";
import Matrix_Component from "./Matrix_Component";
import Square_Hill_Matrix from "../Math_Classes/Square_Hill_Matrix";
import Button from "@mui/material/Button";
import Card_Operations from "./Card_Operations";
import { Add, ExpandLess, Percent, Maximize, Close } from "@mui/icons-material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";

const Calculator_Component: FunctionComponent = () => {
  let square: Square_Hill_Matrix = new Square_Hill_Matrix(8, []);

  let operations = [
    {
      label: <Close sx={{ fontSize: 40 }} className="color-Primary" />,
      operation: "Multiplicar",
      id: 0,
    },
    {
      label: <ExpandLess sx={{ fontSize: 40 }} className="color-Primary" />,
      operation: "Potencia",
      id: 1,
    },
    {
      label: <Add sx={{ fontSize: 40 }} className="color-Primary" />,
      operation: "Sumar",
      id: 2,
    },
    {
      label: <Maximize sx={{ fontSize: 40 }} className="color-Primary" />,
      operation: "Restar",
      id: 3,
    },
  ];

  const [areTwo, setAreTwo] = useState<boolean>(true);
  const [matrix1, setMatrix1] = useState<Array<number>>(
    Square_Hill_Matrix.ExportInitializeMatrix_Square(square.InitializeAs(3, 8))
  );
  const [matrix2, setMatrix2] = useState<Array<number>>(
    Square_Hill_Matrix.ExportInitializeMatrix_Square(square.InitializeAs(3, 8))
  );

  const [matrixResult, setMatrixResult] = useState<Array<number>>([]);

  const [elementA, setElementA] = useState<any>(null);
  const [elementB, setElementB] = useState<any>(null);
  const [operationSelected, setOperationSelected] = useState<number>(0);

  const elements: any = {
    A: [
      { label: "A", value: matrix1 },
      { label: "B", value: matrix2 },
      { label: "Result", value: matrixResult },
    ],
    B: [
      { label: "A", value: matrix1 },
      { label: "B", value: matrix2 },
      { label: "Result", value: matrixResult },
    ],
  };

  const setValueMatrix1 = (count: number, value: number, index: number) => {
    if (count === 1) {
      let tempMatrix = matrix1;
      tempMatrix[index] = value;
      setMatrix1(tempMatrix);
    } else {
      let tempMatrix = matrix2;
      tempMatrix[index] = value;
      setMatrix2(tempMatrix);
    }
  };

  const OnCalculate = () => {
    let itemA = elements["A"].find(
      (item: any) => item.label === elementA
    ).value;

    let matrixA: Square_Hill_Matrix =
      Square_Hill_Matrix.ImportInitializeMatrix_Square(itemA);
    console.log("Element A: ", matrixA);

    if (operationSelected !== 1) {
      let itemB = elements["B"].find(
        (item: any) => item.label === elementB
      ).value;
      let matrixB: Square_Hill_Matrix =
        Square_Hill_Matrix.ImportInitializeMatrix_Square(itemB);

      //No es exponenciacion
      switch (operationSelected) {
        case 0:
          //Multiplicacion
          setMatrixResult(
            Square_Hill_Matrix.ExportInitializeMatrix_Square(
              Square_Hill_Matrix.MultiplyHillMatrices(matrixA, matrixB)._matrix
            )
          );
          break;

        case 2:
          //Suma
          console.log("Sumo");
          break;

        //setMatrixResult(Square_Hill_Matrix.ExportInitializeMatrix_Square(Square_Hill_Matrix.AddHillMatrices(matrixA,matrixB)._matrix));
      }
    } else {
      //Exponenciacion
      let elemB: number = elementB;
      console.log("Exponencio");
      setMatrixResult(
        Square_Hill_Matrix.ExportInitializeMatrix_Square(
          matrixA.PowerOf(matrixA, elemB)._matrix
        )
      );
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-11 col-lg-6 col-sm-11 ">
          <div className="card m-1">
            <div className="card-header m-1">
              <Matrix_Component
                isResult={false}
                onHandleCleanButton={() =>
                  setMatrix1(
                    Square_Hill_Matrix.ExportInitializeMatrix_Square(
                      square.InitializeAs(1, 8)
                    )
                  )
                }
                count={1}
                matrixName="Matrix 1"
                matrix={matrix1}
                setValueMatrix={setValueMatrix1}
              />
            </div>
            <div className="card-body m-1">
              {areTwo ? (
                <Matrix_Component
                  isResult={false}
                  onHandleCleanButton={() =>
                    setMatrix2(
                      Square_Hill_Matrix.ExportInitializeMatrix_Square(
                        square.InitializeAs(1, 8)
                      )
                    )
                  }
                  count={2}
                  matrixName="Matrix 2"
                  matrix={matrix2}
                  setValueMatrix={setValueMatrix1}
                />
              ) : null}
            </div>
          </div>
        </div>
        <div className="col-11 col-lg-6 col-sm-11 ">
          <div className="card m-1">
            <div className="card-header m-1">
              <div className="card m-1">
                <div className="card-title m-1 text-center">
                  <h4>Operaciones</h4>
                </div>
                <div className="card-header">
                  <div className="row justify-content-around align-content-around d-flex">
                    {operations.map((operation) => (
                      <div className="col-6 col-lg-4 col-sm-6 m-1">
                        <Card_Operations
                          id={operation.id}
                          label={operation.operation}
                          operation={operation.label}
                          onHandleOperatButton={(idSelected) => {
                            setElementB(null);
                            setOperationSelected(idSelected);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="card-body justify-content-center align-content-center d-flex">
                    <div className="row col-9 justify-content-around align-content-around d-flex">
                      <div className="col-4">
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Elemento A
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={elementA}
                            label="Elemento A"
                            onChange={(event) =>
                              {setElementA(event.target.value);}
                            }
                          >
                            {elements["A"].map((element: any) => (
                              <MenuItem value={element.label}>
                                {element.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                      <div className="col-4">
                        {operationSelected === 1 ? (
                          <TextField
                            variant="outlined"
                            value={elementB}
                            onChange={(event) =>
                              {setElementB(Number.parseInt(event.target.value));}
                            }
                          />
                        ) : (
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                              Elemento B
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={elementB}
                              label="Elemento B"
                              onChange={(event) =>
                                setElementB(event.target.value)
                              }
                            >
                              {elements["B"].map((element: any) => (
                                <MenuItem value={element.label}>
                                  {element.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="card-footer bg-transparent justify-content-center align-content-center d-flex">
                    <Button
                      onClick={() => OnCalculate}
                      className="button-Secondary w-100"
                      variant="contained"
                    >
                      Calcular
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body m-1">
              <Matrix_Component
                isResult={true}
                count={0}
                matrixName="Resultado"
                onHandleCleanButton={() => {}}
                matrix={matrixResult}
                setValueMatrix={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

//<Matrix_Component matrix={[[1,2,3],[4,5,6],[7,8,9]]} />
export default Calculator_Component;

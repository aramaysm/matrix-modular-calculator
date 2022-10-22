import React, { FunctionComponent, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface IProps {
  matrixName: string;
  matrix: Array<number>;
  count: number;
  onHandleCleanButton: () => void;
  setValueMatrix: (count: number, value: number, index: number) => void;
  isResult: boolean;
}

const Matrix_Component: FunctionComponent<IProps> = (props) => {
  const [count1, setCount1] = useState<number>(0);
  const [count2, setCount2] = useState<number>(1);

  return (
    <div className="card">
      <div className="card-header text-center">
        <h4>{props.matrixName}</h4>
      </div>
      <div className="card-body">
        <div>
          <div className="row">
            {props.matrix.map((row, index) => (
              <div className="col-1-5 ">
                {props.isResult ? (
                  <h6>{row}</h6>
                ) : (
                  <TextField
                    label={index + 1}
                    variant="outlined"
                    value={row}
                    onChange={(event) =>
                      props.setValueMatrix(
                        props.count,
                        Number.parseInt(event.target.value),
                        index
                      )
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-footer justify-content-center align-content-center d-flex">
        
      {props.isResult 
      ?
      null
      : 
        <Button
          onClick={() => props.onHandleCleanButton()}
          className="button-Primary"
          variant="contained"
        >
          Limpiar
        </Button>
}
      </div>
    </div>
  );
};

export default Matrix_Component;

/*
 <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableBody>

              {
              props.matrix.slice(count1*8,count2*8).map((row, index) => (
                <TableRow key={row}>
                  {props.matrix.map((row, index) => (
                    <TableCell component="th" scope="row">
                      <TextField label={index} variant="outlined" value={row} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

*/

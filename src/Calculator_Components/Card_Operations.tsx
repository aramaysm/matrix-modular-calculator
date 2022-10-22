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
  label: string;
  operation: any;
  onHandleOperatButton: (id:number) => void;
  id:number
}

const Card_Operations: FunctionComponent<IProps> = (props) => {
  const [count1, setCount1] = useState<number>(0);
  const [count2, setCount2] = useState<number>(1);

  return (
    <div
      className="card m-1 cursor-pointer mt-2 border-none shadow-Secondary"
      onClick={(event) => {
        props.onHandleOperatButton(props.id);
        
    }}
    >
      <div className="card-header bg-transparent border-none text-center">
        {props.operation}
      </div>
      <div className="card-body text-center">
        <h6>{props.label}</h6>
      </div>
    </div>
  );
};

export default Card_Operations;

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

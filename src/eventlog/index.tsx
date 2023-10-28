import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Link } from "@mui/material";

interface IFieldInfo {
  name: string;
  show: boolean;
  type: any;
  anyOf?: any;
}
function getFields(schema): Array<IFieldInfo> {
  return Object.keys(schema.properties).map((name) => {
    let show = true;
    const field = schema.properties[name];
    if (field.is_hidden || field.format === "uuid") {
      show = false;
    }
    return {
      name,
      show,
      ...field,
    };
  });
}

function formatField(obj, columnName: string, fieldInfo: IFieldInfo) {
  const fieldType = fieldInfo.type;
  const fieldValue = obj[columnName];
  if (["string", "integer", "null"].includes(fieldType)) {
    return fieldValue;
  }

  if (fieldType === "array") {
    return fieldValue.map((item) => (
      <div>
        <Link component="button" onClick={() => console.log(111)}>
          {item}
        </Link>
      </div>
    ));
    // return fieldValue.join(",");
  }

  if (fieldType === undefined && fieldInfo.anyOf) {
    return JSON.stringify(fieldValue);
  }

  console.warn("undefined attribute", obj, columnName, fieldInfo);
  return "";
}

function Row({ columns, row, schema }) {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {columns.map((c) => (
          <TableCell key={c}>
            {formatField(row, c, schema.properties[c])}
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Tags
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {columns.map((tag) => (
                    <TableRow key={tag}>
                      <TableCell component="th" scope="row">
                        {tag}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export function EventLogTable({ schema, items }) {
  const columns = getFields(schema)
    .filter((f) => f.show)
    .map((f) => f.name);
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            {columns.map((column) => (
              <TableCell key={column}>
                {schema.properties[column]?.title || column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((row, i: number) => (
            <Row key={i} columns={columns} row={row} schema={schema} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

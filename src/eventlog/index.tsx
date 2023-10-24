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

function getFields(schema) {
  return Object.keys(schema.properties).map((name) => {
    let show = true;
    const field = schema.properties[name];
    if (field.is_auto_generated || field.format == "uuid") {
      show = false;
    }
    return {
      name: name,
      show,
    };
  });
}

/*
const schema = {
  properties: {
    id: { title: "Id", type: "string" },
    created_ts: { format: "date-time", title: "Created Ts", type: "string" },
    description: { title: "Description", type: "string" },
    tags: { title: "Tags", type: "string" },
  },
  required: ["created_ts", "description", "tags"],
  title: "barnie_eventlog1",
  type: "object",
};

function createLog(
  id: string,
  description: string,
  tags: string = "",
  created_ts: string = "",
) {
  return {
    id,
    created_ts,
    description,
    tags,
  };
}
  */

function Row({ columns, row }) {
  console.log("colum", columns);
  console.log(row);
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
        {columns.map((p) => (
          <TableCell key={p}>{row[p]}</TableCell>
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
                  {row.tags.split(" ").map((tag) => (
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

/*
const rows = [
createLog("1", "bench 150LBs X 5", "#workout"),
createLog("2", "medidation 10 min", "#meditation"),
createLog("3", "ido portal", ""),
];
*/

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
            {columns.map((c) => (
              <TableCell key={c}>{c}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((row) => (
            <Row key={row.id} columns={columns} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

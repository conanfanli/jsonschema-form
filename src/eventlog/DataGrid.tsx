import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Schema } from "../types";

/*
const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];
*/
function getColumns(schema: Schema): GridColDef[] {
  return Object.keys(schema.properties).map((fieldName: string) => {
    const property = schema.properties[fieldName];
    return {
      field: fieldName,
      headerName: property.title || fieldName,
      isHidden: property.is_hidden,
    };
  });
}

export function EventLogDataGrid({
  schema,
  rows,
}: {
  schema: Schema;
  rows: any[];
}) {
  const columns = getColumns(schema);
  const visibleColumns = columns.filter((f) => !f["isHidden"]);
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={visibleColumns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}

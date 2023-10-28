import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { Box, Button, TextField } from "@mui/material";
import "./App.css";
// import { ListRows } from "./List";
import { CreateForm } from "./Create";
import { EventLogTable } from "./eventlog";

function SchemaPicker() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = React.useState([]);

  const [schemaUrl, setSchemaUrl] = React.useState(
    searchParams.get("schema_url") || "",
  );
  const [submitUrl, setSubmitUrl] = React.useState(
    searchParams.get("submit_url") || "",
  );

  const [schema, setSchema] = React.useState(null);

  return (
    <div>
      <Box noValidate component="form">
        <TextField
          onChange={(e) => {
            setSchemaUrl(e.target.value);
          }}
          value={schemaUrl}
          fullWidth
          helperText="Schema URL"
        />
        <TextField
          onChange={(e) => setSubmitUrl(e.target.value)}
          value={submitUrl}
          fullWidth
          helperText="Put URL"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            setSearchParams({ schema_url: schemaUrl, submit_url: submitUrl });

            const res = await fetch(schemaUrl);
            const body = await res.json();
            setSchema(body);
          }}
        >
          Render
        </Button>
        <Button
          variant="contained"
          disabled={!schema}
          color="primary"
          onClick={async () => {
            const res = await fetch(`${submitUrl}`, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            });
            const body = await res.json();
            if (body.error) {
              console.error("Got error response", body);
              setItems([]);
            } else {
              setItems(body);
            }
          }}
        >
          Get Items
        </Button>
        <Button
          variant="contained"
          color="inherit"
          onClick={() => {
            setSchemaUrl("");
            setSearchParams({});
          }}
        >
          clear
        </Button>
      </Box>
      {schema ? <CreateForm schema={schema} submitUrl={submitUrl} /> : null}
      {schema ? <EventLogTable schema={schema} items={items} /> : null}
    </div>
  );
  // {schema ? <ListRows schema={schema} items={items} /> : null}
}

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <SchemaPicker />,
    },
    /*
    {
      path: "/eventlog",
      element: <EventLogTable />,
    },
    */
  ],
  { basename: "/jsonschema-form" },
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

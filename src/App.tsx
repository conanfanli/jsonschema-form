import React from 'react';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RJSFSchema } from '@rjsf/utils';
import { useSearchParams } from 'react-router-dom';
import { Box, Button, TextField } from "@mui/material";
import './App.css';


const defaultSchema: RJSFSchema = {
  type: 'object',
  properties: {
    schemaUrl: {
      type: 'string',
    },
    schemaDefinition: {
      type: 'string',
    },
    submitUrl: {
      type: 'string',
    },
  },
}


function SchemaPicker() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [url, setUrl] = React.useState(searchParams.get("schema_url") || "")
  const [schema, setSchema] = React.useState(null)


  return (
    <div>
      <TextField onChange={(e) => { setUrl(e.target.value) }} value={url} fullWidth helperText="Schema URL" />
      <Button
        variant="contained"
        onClick={async () => {
          setSearchParams({ schema_url: url })

          const res = await fetch(url)
          const body = await res.json()
          console.log('body', body)
          setSchema(body)
        }}
        fullWidth
      >
        Render
      </Button>
      <Button
        variant="contained"
        onClick={() => { setUrl(""); setSearchParams({}) }}
        fullWidth
      >
        clear
      </Button>
      {schema ? <Form schema={schema} validator={validator} /> : null}
    </div>
  )
}

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <SchemaPicker />,
    },
  ],
  { basename: "/jsonschema-form" }
);


function App() {
  return <RouterProvider router={router} />;
}

export default App;

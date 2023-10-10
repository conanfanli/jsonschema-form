import React from 'react';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';
import { Box, Button, TextField } from "@mui/material";
import './App.css';




function SchemaPicker() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [schemaUrl, setSchemaUrl] = React.useState(searchParams.get("schema_url") || "")
  const [submitUrl, setSubmitUrl] = React.useState(searchParams.get("submit_url") || "")
  // const [submitUrl, setSubmitUrl] = React.useState(searchParams.get("submit_url") || "")

  const [schema, setSchema] = React.useState(null)


  return (
    <div>
      <Box noValidate component="form">
        <TextField onChange={(e) => { setSchemaUrl(e.target.value) }} value={schemaUrl} fullWidth helperText="Schema URL" />
        <TextField onChange={(e) => setSubmitUrl(e.target.value)} value={submitUrl} fullWidth helperText="Post to" />
        <Button
          variant="contained"
          onClick={async () => {
            setSearchParams({ schema_url: schemaUrl, submit_url: submitUrl })

            const res = await fetch(schemaUrl)
            const body = await res.json()
            setSchema(body)
          }}
        >
          Render
        </Button>
        <Button
          variant="contained"
          onClick={() => { setSchemaUrl(""); setSearchParams({}) }}
        >
          clear
        </Button>
      </Box>
      {schema ? <SubmissionForm schema={schema} submitUrl={submitUrl} /> : null}
    </div>
  )
}

function SubmissionForm({ schema, submitUrl }) {
  const [formData, setFormData] = React.useState(null);
  return (
    <div>
      <Form
        schema={schema}
        validator={validator}
        formData={formData}
        onChange={(e) => setFormData(e.formData)}
        onSubmit={async (e) => {
          const res = await fetch(submitUrl, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          })
          const body = await res.json()
          console.log('body', body)
        }}
      />
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

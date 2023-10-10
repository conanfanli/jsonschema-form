import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RJSFSchema } from '@rjsf/utils';
import { useSearchParams } from 'react-router-dom';
import { Box } from "@mui/material";
import { DebouncedTextField as Field } from "./DebouncedTextField";
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
  const [searchParams] = useSearchParams()
  const [schema, setSchema] = React.useState(defaultSchema)

  return (
    <Box noValidate component="form">
      <Field name='Schema URL' onPatch={e => { }} value='' />
    </Box>
  )

  /*
React.useEffect(() => {
  async function fetchData() {
    const schemaUrl = searchParams.get("schema_url")
    if (schemaUrl) {
      const res = await fetch(schemaUrl)
      const body = await res.json()
      console.log('body', body)
      setSchema(body)
    } else {
      setSchema(defaultSchema)
    }
  }
  fetchData();
}, [searchParams]);
*/

  // return <Form schema={schema} validator={validator} />
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

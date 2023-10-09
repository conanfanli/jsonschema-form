import React from 'react';
import Form from '@rjsf/mui';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}


/*
const schema: RJSFSchema = {
title: 'Test form',
type: 'string',
};
*/


const schema: RJSFSchema = {
  "$defs": {
    "Property": {
      "properties": {
        "name": {
          "title": "Name",
          "type": "string"
        },
        "attribute_type": {
          "enum": [
            "N",
            "S"
          ],
          "title": "Attribute Type",
          "type": "string"
        },
        "key_type": {
          "default": null,
          "enum": [
            "HASH",
            "RANGE",
            null
          ],
          "title": "Key Type"
        }
      },
      "required": [
        "name",
        "attribute_type"
      ],
      "title": "Property",
      "type": "object"
    }
  },
  "properties": {
    "name": {
      "title": "Name",
      "type": "string"
    },
    "properties": {
      "type": "array",
      "items": {
        "$ref": "#/$defs/Property"
      },
      "minItems": 1,
      "title": "Properties"
    }
  },
  "required": [
    "name",
    "properties"
  ],
  "title": "TableDef",
  "type": "object"
}
function MyForm() {
  return <Form schema={schema} validator={validator} />
}

export default MyForm;

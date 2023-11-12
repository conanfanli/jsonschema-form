import * as React from "react";
import { Property } from "../types";

export function formatField(obj, columnName: string, fieldInfo: Property) {
  const fieldType = fieldInfo.type;
  const fieldValue = obj[columnName];
  if (!fieldValue) {
    return "";
  }

  if (["string", "integer", "null"].includes(fieldType)) {
    return fieldValue;
  }

  if (fieldType === "boolean") {
    return fieldValue.toString();
  }

  if (fieldType === "array") {
    return fieldValue.map((item, index) => (
      <div key={index}>
        {typeof item === "string" ? item : JSON.stringify(item)}
      </div>
    ));
  }

  if (fieldType === undefined && fieldInfo.anyOf) {
    return JSON.stringify(fieldValue);
  }

  console.warn("cannot format field", columnName, obj, fieldInfo);
  return JSON.stringify(fieldValue);
}

import { FieldType, IFieldInfo, Property, Schema } from "../types";
function getAutoCompleteOptions(prop: Property) {
  if (!prop.auto_complete) {
    throw new Error(`missing auto_complete for ${prop.type}`);
  }
  return async () => {
    const res = await fetch(prop?.auto_complete || "", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const resData = await res.json();
    if (resData) {
      return resData.map((res) => res.name);
    }
    return [];
  };
}

/**
 * Given a schema, return an array of IFieldInfo
 *
 */
export function getFieldInfosFromSchema(schema: Schema): Array<IFieldInfo> {
  if (!schema.properties) {
    return [];
  }
  const keys = Object.keys(schema.properties);
  keys.sort((k) => (k.toLowerCase().includes("date") ? 0 : 1));
  return keys.map((name) => {
    const field = schema.properties[name];
    let type: FieldType = field.type;
    if (name === "id") {
      field.is_hidden = true;
    }

    if (field.auto_complete) {
      field.getAutoCompleteOptions = getAutoCompleteOptions(field);
    }

    if (!field.type) {
      // e.g. hash_key: {allOf: [{$ref: "#/$defs/Field"}]}
      if (field.allOf) {
        const ref = field.allOf[0]["$ref"].split("/");
        type = "composite";
        field.$ref = schema.$defs[ref[ref.length - 1]];
      }
      // e.g. range_key: {anyOf: [{$ref: "#/$defs/Field"}, {type: "null"}]}
      if (field.anyOf) {
        if (field.anyOf.find((t) => t.type === "null")) {
          field.nullable = true;
        }

        const refField = field.anyOf.find((r) => r.$ref);
        if (refField) {
          type = "composite";
          const ref = refField["$ref"].split("/");
          field.$ref = schema.$defs[ref[ref.length - 1]];
        } else if (field.anyOf.find((f) => f.type)) {
          type = field.anyOf.find((f) => f.type).type;
        }
      }
    }
    return {
      ...field,
      name,
      type,
    };
  });
}

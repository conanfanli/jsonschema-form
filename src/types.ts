type FieldType =
  | "array"
  | "string"
  | "integer"
  | "boolean"
  | "composite"
  | "null"
  | "enum";
export interface Property {
  $ref?: Schema;
  allOf?: any[];
  anyOf?: any[];
  auto_complete?: string;
  format?: string;
  freeze_after_creation?: boolean;
  is_hidden?: boolean;
  nullable?: boolean;
  properties?: { [key: string]: Property };
  readOnly?: boolean;
  required: string[];
  title?: string;
  type: FieldType;
}
export interface Schema {
  type: FieldType;
  title: string;
  properties: { [key: string]: Property };
  $defs: any;
}
export interface IFieldInfo extends Property {
  name: string;
}
export function getFields(schema: Schema): Array<IFieldInfo> {
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
export interface AppConfig {
  name: string;
  schemaUrl?: string;
  itemsUrl?: string;
  itemsFilters?: string; // This is a json string like {"label": "abc"}
}

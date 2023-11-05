type FieldType =
  | "array"
  | "string"
  | "integer"
  | "boolean"
  | "composite"
  | "null"
  | "enum";
export interface Property {
  type: FieldType;
  title?: string;
  required: string[];
  readOnly?: boolean;
  is_hidden?: boolean;
  freeze_after_creation?: boolean;
  format?: string;
  properties?: { [key: string]: Property };
  anyOf?: any[];
  allOf?: any[];
  $ref?: Schema;
  nullable?: boolean;
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
  const keys = Object.keys(schema.properties);
  keys.sort((k) => (k.toLowerCase().includes("date") ? 0 : 1));
  return keys.map((name) => {
    const field = schema.properties[name];
    let type: FieldType = "string";
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

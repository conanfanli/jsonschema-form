export interface Property {
  type: string;
  title?: string;
  required: string[];
  readOnly?: boolean;
  is_hidden?: boolean;
  freeze_after_creation?: boolean;
  format?: string;
  properties?: { [key: string]: Property };
  anyOf?: any;
}
export interface Schema {
  type: string;
  title: string;
  properties: { [key: string]: Property };
}
export interface IFieldInfo extends Property {
  name: string;
}
export function getFields(schema: Schema): Array<IFieldInfo> {
  const keys = Object.keys(schema.properties);
  keys.sort((k) => (k.toLowerCase().includes("date") ? 0 : 1));
  return keys.map((name) => {
    const field = schema.properties[name];
    return {
      name,
      ...field,
    };
  });
}
export interface AppConfig {
  name: string;
  schemaUrl?: string;
  itemsUrl?: string;
  itemsFilters?: string; // This is a json string like {"label": "abc"}
}

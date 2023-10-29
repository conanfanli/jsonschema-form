export interface Property {
  type: string;
  title?: string;
  required: string[];
  readOnly?: boolean;
  is_hidden?: boolean;
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
  return Object.keys(schema.properties).map((name) => {
    const field = schema.properties[name];
    return {
      name,
      ...field,
    };
  });
}

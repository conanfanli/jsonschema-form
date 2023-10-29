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
    // let show = true;
    const field = schema.properties[name];
    /*
    if (field.is_hidden || field.format === "uuid") {
      show = false;
    }
      */
    return {
      name,
      ...field,
    };
  });
}

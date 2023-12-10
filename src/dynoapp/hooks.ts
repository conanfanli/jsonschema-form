import React from "react";
import { ConfigContext } from "../ConfigApp";
import { TaggedItem, Schema, IResourceClient } from "../types";

function onDeleteItem<T extends TaggedItem>(
  deleteRow: (row: T) => void,
  setFocusedRow: (i: T | null) => void,
  client: IResourceClient,
) {
  return async (item: T) => {
    await client.deleteItem(item);
    deleteRow(item);
    setFocusedRow(null);
  };
}

function onSubmitItem<T extends TaggedItem>(
  items: T[],
  setItems: (items: T[]) => void,
  setFocusedRow: (i: T | null) => void,
  client: IResourceClient,
) {
  function createOrUpdateItem(newRow: any) {
    let existing = false;
    const newItems = items.map((item) => {
      if (item.id === newRow.id) {
        existing = true;
        return newRow;
      }
      return item;
    });
    if (existing) {
      setItems(newItems);
    } else {
      setItems([newRow, ...items]);
    }
  }

  return async (data: T) => {
    const [newItem] = await client.putItem(data);
    createOrUpdateItem(newItem);
    setFocusedRow(null);
  };
}

export function useShit() {
  const [focusedRow, setFocusedRow] = React.useState<any>(null);
  const [items, setItems] = React.useState<any[]>([]);

  const [options] = React.useState<string[]>([]);
  const { resourceClient, config } = React.useContext(ConfigContext);
  const [schema, setSchema] = React.useState<Schema | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      if (!resourceClient) {
        return;
      }

      const [res] = await resourceClient.getSchema();
      if (res) {
        setSchema(res);
      }

      const [items] = await resourceClient.getItems({
        queryFilters: config?.itemsFilters || "",
      });
      if (items && items.length) {
        setItems(items);
      } else {
        setItems([]);
      }
    };

    fetchData();
  }, [config?.schemaUrl, config?.itemsFilters, config?.name, resourceClient]);

  function deleteRow(row) {
    setItems(items.filter((item) => item.id !== row.id));
  }

  return {
    schema,
    items,
    onSubmitItem: resourceClient
      ? onSubmitItem(items, setItems, setFocusedRow, resourceClient)
      : null,
    onDeleteItem: resourceClient
      ? onDeleteItem(deleteRow, setFocusedRow, resourceClient)
      : null,
    options,
    focusedRow,
    setFocusedRow,
  };
}

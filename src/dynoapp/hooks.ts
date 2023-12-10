import React from "react";
import { TaggedItem, Schema, IResourceClient } from "../types";
import { useQuery } from "@tanstack/react-query";
import { useQueryString } from "../common/hooks";
import { ResourceClient } from "../clients";

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
  const { queryObject, queryString } = useQueryString();
  console.log(222, queryString);

  const { isLoading, error, data } = useQuery({
    queryKey: [queryObject.schemaUrl, "items", queryString],
    queryFn: async () => {
      const res = await fetch(queryObject.schemaUrl + "/items?" + queryString);
      const ret = await res.json();
      setItems(ret);
      return ret;
    },
  });

  const { data: schema } = useQuery({
    queryKey: [queryObject.schemaUrl],
    queryFn: async () => {
      const res = await fetch(queryObject.schemaUrl);
      return await res.json();
    },
  });

  const [options] = React.useState<string[]>([]);
  const resourceClient = ResourceClient<any>(queryObject.schemaUrl);

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
    isLoading,
    error,
    setFocusedRow,
  };
}

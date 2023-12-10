import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LocalStorageViewStore } from "./viewStore";

/*
 *  Redirect a saved view to another URL with search parameters
 *  For example: /views/:viewName -> /myapp?filters=xxxx
 */
export function SavedViewRedirect({
  redirectTo,
  addViewNameToPath,
  getViewSearchParams = LocalStorageViewStore().getView,
}: {
  redirectTo: string;
  addViewNameToPath: boolean;
  getViewSearchParams?: (k: string) => string | null;
}) {
  const { viewName } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!viewName) {
      return;
    }
    const queryString = getViewSearchParams(viewName);

    const newUrl =
      `${redirectTo}${addViewNameToPath ? "/" + viewName : ""}?` + queryString;

    function redirect() {
      navigate(newUrl);
    }
    setTimeout(redirect, 1000);
  }, [viewName, navigate, addViewNameToPath, getViewSearchParams, redirectTo]);

  return <div>loading ...</div>;
}

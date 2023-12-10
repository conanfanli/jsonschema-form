import { useSearchParams } from "react-router-dom";

export function useQueryString() {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryObject = Object.fromEntries(searchParams);
  function setQueryObject(p: { [key: string]: string }) {
    setSearchParams(new URLSearchParams(p));
  }
  return { queryString: searchParams.toString(), queryObject, setQueryObject };
}

import { useEffect, useState } from "react";

export const useDebounce = (text: string, delay = 1000) => {
  const [value, setValue] = useState<string>("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setValue(text);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [text]);

  return value;
};

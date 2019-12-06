import { useState, useEffect } from "react";

export const useInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    props.getAccount()
  }, []);

  return {
    value,
    setValue,
    reset: () => setValue(""),
    bind: {
      value,
      onChange: event => {
        setValue(event.target.value);
      }
    }
  };
};
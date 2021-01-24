import { RefObject, useEffect, useRef } from "react";

const useInputFocus = (): RefObject<HTMLInputElement | undefined> => {
  const inputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    console.log('test')
    if (inputRef.current) {
      (inputRef?.current)?.focus();
    }
  }, [])

  return inputRef;
};

export default useInputFocus;

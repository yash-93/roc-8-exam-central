import { createContext, useState } from 'react';

const URLContext = createContext();

export const URLContextProvider = (props) => {
  const [url, setUrl] = useState('/');

  return (
    <URLContext.Provider value={{ url, setUrl }}>
      {props.children}
    </URLContext.Provider>
  );
}

export default URLContext;

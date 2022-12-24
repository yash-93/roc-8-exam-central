import { createContext, useState } from 'react';

const UniversityListContext = createContext();

export const UniversityListContextProvider = (props) => {
  const [universityList, setUniversityList] = useState([]);

  return (
    <UniversityListContext.Provider value={{ universityList, setUniversityList }}>
      {props.children}
    </UniversityListContext.Provider>
  );
}

export default UniversityListContext;

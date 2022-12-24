import { createContext, useState } from 'react';

const CompetitivePapersListContext = createContext();

export const CompetitivePapersListContextProvider = (props) => {
  const [competitivePapersList, setCompetitivePapersList] = useState([]);

  return (
    <CompetitivePapersListContext.Provider value={{ competitivePapersList, setCompetitivePapersList }}>
      {props.children}
    </CompetitivePapersListContext.Provider>
  );
}

export default CompetitivePapersListContext;

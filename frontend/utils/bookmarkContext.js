import { createContext, useState } from 'react';

const BookmarkContext = createContext();

export const BookmarkContextProvider = (props) => {
  const [bookmarkCount, setBookmarkCount] = useState(0);

  return (
    <BookmarkContext.Provider value={{ bookmarkCount, setBookmarkCount }}>
      {props.children}
    </BookmarkContext.Provider>
  );
}

export default BookmarkContext;

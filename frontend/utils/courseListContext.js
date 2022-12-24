import { createContext, useState } from 'react';

const CourseListContext = createContext();

export const CourseListContextProvider = (props) => {
  const [courseList, setCourseList] = useState([]);

  return (
    <CourseListContext.Provider value={{ courseList, setCourseList }}>
      {props.children}
    </CourseListContext.Provider>
  );
}

export default CourseListContext;

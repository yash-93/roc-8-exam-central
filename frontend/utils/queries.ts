import { gql } from '@apollo/client';

export const GET_UNIVERSITY = gql`
  query GET_UNIVERSITY($where: UniversityWhereUniqueInput!) {
    university(where: $where) {
      id
      name
      city
      state
      country
      status
      banner {
        url
      }
      logo {
        url
      }
      courses {
        id
        name
        status
        courseCode
        duration
        noOfSemester
        semesterSystem
        papers(orderBy: {year: desc}) {
          id
          year
        }
      }
    }
  }
`;

export const GET_UNIVERSITIES = gql`
  query GET_UNIVERSITIES {
    universities {
      id
      name
    }
  }
`;

export const GET_UNIVERSITY_COURSES = gql`
  query GET_UNIVERSITY_COURSES($where: UniversityWhereInput!) {
    universities(where: $where) {
      id
      courses {
        id
        name
      }
    }
  }
`;

export const GET_COURSE = gql`
  query GET_COURSE($where: CourseWhereUniqueInput!) {
    course(where: $where) {
      id
      name
      status
      courseCode
      duration
      noOfSemester
      semesterSystem
      university {
        id
        name
      }
      papers(orderBy: {year: desc}) {
        id
        name
        paperCode
        year
        semester
        status
        university {
          id
          name
        }
        course {
          id
          name
        }
      }
    }
  }
`;

export const GET_COURSE_SEMESTER = gql`
  query GET_COURSE_SEMESTER($where: CourseWhereInput!) {
    courses(where: $where) {
      id
      semesterSystem
      duration
    }
  }
`;

export const GET_USERS = gql`
  query GET_USERS {
    users {
      id
    }
  }
`;


export const GET_PAPERS = gql`
  query GET_PAPERS {
    papers {
      id
    }
  }
`;

export const GET_PAPER_BY_ID = gql`
  query GET_SITE($where: PaperWhereUniqueInput!) {
    paper(where: $where) {
      id
      source {
        url
      }
    }
  }
`;

export const GET_PAPERS_BY_USER_ID = gql`
query GET_PAPERS_BY_USER_ID($where: UserWhereUniqueInput!) {
  user(where: $where) {
    id
    papers {
      id
      name
      paperCode
      year
      semester
      status
      university {
        id
        name
      }
      course {
        id
        name
      }
    }
  }
}
`;

export const ADD_BOOKMARK = gql`
  mutation ADD_BOOKMARK($where: UserWhereUniqueInput!, $data: UserUpdateInput!) {
    updateUser(where: $where, data: $data) {
      id
      name
      role
      bookmarks {
        id
        name
        semester
        year
        university {
          id
          name
        }
        course {
          id
          name
        }
      }
    }
  }
`;

export const REMOVE_BOOKMARK = gql`
  mutation REMOVE_BOOKMARK($where: UserWhereUniqueInput!, $data: UserUpdateInput!) {
    updateUser(where: $where, data: $data) {
      id
      name
      role
      bookmarks {
        id
        name
        semester
        year
        university {
          id
          name
        }
        course {
          id
          name
        }
      }
    }
  }
`;

export const CURRENT_USER_QUERY = gql`
  query {
    authenticatedItem {
      ... on User {
        id
        name
        role
        avatar {
          url
        }
        bookmarks {
          id
          name
          paperCode
          year
          semester
          status
          university {
            id
            name
          }
          course {
            id
            name
          }
        }
        papers {
          id
          name
          paperCode
          year
          semester
          university {
            id
            name
          }
          course {
            id
            name
          }
        }
      }
    }
  }
`;

export const GET_USER = gql`
  query GET_USER($where: UserWhereInput!) {
    users(where: $where) {
      id
      name
      role
      bookmarks {
        id
        name
        paperCode
        year
        semester
        university {
          id
          name
        }
        course {
          id
          name
        }
      }
      papers {
        id
        name
        paperCode
        year
        semester
        university {
          id
          name
        }
        course {
          id
          name
        }
      }
    }
  }
`;

export const SIGN_OUT_MUTATION = gql`
  mutation {
    endSession
  }
`;

export const GET_COMPETITIVE_PAPERS = gql`
  query GET_COMPETITIVE_PAPERS {
    competitivePapers {
        id
        name
        slug
        papers(orderBy: {year: desc}) {
          id
          name
          year
          status
        }
    }
  }
`;

export const GET_CATEGORIZED_COMPETITIVE_PAPERS = gql`
  query GET_CATEGORIZED_COMPETITIVE_PAPERS($where: CompetitivePaperWhereInput!) {
    competitivePapers(where: $where) {
        id
        name
        slug
        papers(orderBy: {year: desc}) {
          id
          name
          year
          status
        }
    }
  }
`;

export const GET_COMPETITIVE_PAPERS_BY_NAME = gql`
  query GET_COMPETITIVE_PAPERS_BY_NAME($where: CompetitivePaperWhereInput!) {
    competitivePapers(where: $where) {
        id
        name
        slug
        papers {
          id
          name
          year
          status
        }
    }
  }
`;

export const GET_COMPETITIVE_PAPERS_BY_NAME_YEAR = gql`
  query GET_COMPETITIVE_PAPERS_BY_NAME_YEAR($where: CompetitivePaperWhereInput!, $year: Int!) {
    competitivePapers(where: $where) {
        id
        name
        slug
        papers(where: {year: { equals: $year }}) {
          id
          name
          year
          status
        }
    }
  }
`;

export const GET_PAPERS_BY_UNIVERSITY_NAME = gql`
  query GET_PAPERS_BY_UNIVERSITY_NAME($where: PaperWhereInput!) {
    papers(where: $where) {
        id
        name
        paperCode
        year
        semester
        status
        university {
          name
        }
        course {
          name
        }
    }
  }
`;

export const GET_PAPERS_BY_UNIVERSITY_COURSE_NAME = gql`
  query GET_PAPERS_BY_UNIVERSITY_COURSE_NAME($where: PaperWhereInput!) {
    papers(where: $where) {
      id
      name
      paperCode
      year
      semester
      status
      university {
        name
      }
      course {
        name
      }
    }
  }
`;

export const GET_PAPERS_BY_UNIVERSITY_COURSE_NAME_SEMESTER = gql`
  query GET_PAPERS_BY_UNIVERSITY_COURSE_NAME_SEMESTER($where: PaperWhereInput!) {
    papers(where: $where) {
      id
      name
      paperCode
      year
      semester
      status
      university {
        name
      }
      course {
        name
      }
    }
  }
`;

export const GET_PAPERS_BY_UNIVERSITY_COURSE_YEAR = gql`
  query GET_PAPERS_BY_UNIVERSITY_COURSE_YEAR($where: PaperWhereInput!) {
    papers(where: $where) {
        id
        name
        paperCode
        year
        semester
        status
        university {
          name
        }
        course {
          name
        }
    }
  }
`;

export const GET_PAPERS_BY_UNIVERSITY_COURSE_SEMESTER_YEAR = gql`
  query GET_PAPERS_BY_UNIVERSITY_COURSE_SEMESTER_YEAR($where: PaperWhereInput!) {
    papers(where: $where) {
      id
      name
      paperCode
      year
      semester
      status
      university {
        name
      }
      course {
        name
      }
    }
  }
`;

export const CREATE_PAPER = gql`
  mutation CREATE_PAPER($data: PaperCreateInput!) {
    createPaper(data: $data) {
      id
      name
    }
  }
`;

export const CREATE_UNIVERSITY = gql`
  mutation CREATE_UNIVERSITY($data: UniversityCreateInput!) {
    createUniversity(data: $data) {
      id
      name
    }
  }
`;

export const CREATE_COURSE = gql`
  mutation CREATE_COURSE($data: CourseCreateInput!) {
    createCourse(data: $data) {
      id
      name
    }
  }
`;

export const CREATE_COMPETITIVE = gql`
  mutation CREATE_COMPETITIVE($data: CompetitivePaperCreateInput!) {
    createCompetitivePaper(data: $data) {
      id
      name
    }
  }
`;

// export const GET_PAGINATED_UNIVERSITY_COURSES = gql`
//   query GET_PAGINATED_UNIVERSITY_COURSES($first: Int!, $skip: Int!, $uName: String!) {
//     allCourses(first: $first, skip: $skip, where: { university: {name: $uName}}) {
//       id
//       name
//       status
//       courseCode
//       duration
//       noOfSemester
//       semesterSystem
//       papers(orderBy: {year: desc}) {
//         id
//         year
//       }
//     }
//   }
// `;

export const GET_PAGINATED_UNIVERSITY_COURSES = gql`
  query GET_PAGINATED_UNIVERSITY_COURSES($where: CourseWhereInput!) {
    courses(where: $where) {
      id
      name
      status
      courseCode
      duration
      noOfSemester
      semesterSystem
      papers(orderBy: {year: desc}) {
        id
        year
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UPDATE_USER($where: UserWhereUniqueInput!, $data: UserUpdateInput!) {
    updateUser(where: $where, data: $data) {
      id
      avatar {
        url
      }
    }
  }
`;

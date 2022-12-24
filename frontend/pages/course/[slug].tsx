import { ApolloClient, InMemoryCache } from '@apollo/client';
import { GetServerSideProps } from 'next';

import Navbar from '../../components/Navbar';
import AccessDenied from '../../components/AccessDenied';
import parseCookies from '../../lib/cookieParser';
import PaddedContainer from '../../components/PaddedContainer';
import PapersSection from '../../components/Course/PapersSection';
import CourseDetailsSection from '../../components/Course/CourseDetailsSection';
import { GET_COURSE, CURRENT_USER_QUERY } from '../../utils/queries';

interface PropTypes {
  course?: any;
  user?: any;
}

const Course = ({ course, user }: PropTypes) => {
  console.log(course)

  if (course === null) {
    return (
      <>
        <Navbar />
        <AccessDenied code='404' />
      </>
    )
  }

  return (
    <>
      <Navbar />
      {
        course.status === 'draft' && (
          <div style={{ width: '100%', backgroundColor: '#3B82F6', textAlign: 'center', paddingTop: '0.25rem', paddingBottom: '0.25rem', color: 'white', fontWeight: 'bold' }}>
            This is draft.
          </div>
        )
      }
      <PaddedContainer>
        <CourseDetailsSection course={course} />
      </PaddedContainer>
      <PaddedContainer customStyles={{ paddingTop: '0px' }}>
        <PapersSection
          course={course}
          semesters={parseInt(course?.semesterSystem) * parseFloat(course?.duration)}
          minYear={course?.papers[course?.papers?.length - 1]?.year}
          maxYear={course?.papers[0]?.year}
        />
      </PaddedContainer>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookieData = parseCookies(ctx.req);
  const client = new ApolloClient({
    // uri: 'http://localhost:3000/api/graphql',
    uri: `${process.env.GRAPHQL_URL}`,
    cache: new InMemoryCache()
  });

  let course = null;
  let currUser = null;
  if (cookieData['keystonejs-session']) {
    currUser = await client.query({
      query: CURRENT_USER_QUERY,
      context: {
        headers: {
          Cookie: `keystonejs-session=${cookieData['keystonejs-session']}`
        }
      }
    })
    currUser = currUser.data.authenticatedItem;

    await client.query({
      query: GET_COURSE,
      context: {
        headers: {
          Cookie: `keystonejs-session=${cookieData['keystonejs-session']}`
        }
      },
      variables: {
        where: {
          id: ctx.query.id
        }
      }
    })
      .then(({ data }) => {
        course = data.course;
      })
      .catch(err => console.log(err))
  } else {
    await client.query({
      query: GET_COURSE,
      variables: {
        where: {
          id: ctx.query.id
        }
      }
    })
      .then(({ data }) => {
        course = data.course;
      })
      .catch(err => console.log(err))
  }

  return {
    props: {
      course: course || null,
      user: currUser
    }
  }
}

export default Course;

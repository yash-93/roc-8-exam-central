import { ApolloClient, InMemoryCache } from '@apollo/client';
import xw from 'xwind';
import { GetServerSideProps } from 'next';

import Navbar from '../../components/Navbar';
import AccessDenied from '../../components/AccessDenied';
import parseCookies from '../../lib/cookieParser';
import PaddedContainer from '../../components/PaddedContainer';
import CoursesSection from '../../components/University/CoursesSection';
import { GET_UNIVERSITY, CURRENT_USER_QUERY } from '../../utils/queries';

const styles = {
  universityNameContainer: xw`
    absolute
    bg-gray-500
    px-8
    py-2
  `,
  universityName: xw`
    font-bold
    text-4xl
    sm:text-5xl
    lg:text-6xl
    text-white
  `,
  contentSection: xw`
    w-full
    flex
    flex-col
    md:flex-row
    text-center
    justify-center
    items-center
    p-6
    shadow
  `,
  logoContainer: xw`
    object-cover
    md:mr-8
  `
};

interface PropTypes {
  university?: any;
  user?: any;
}

const University = ({ university, user }: PropTypes) => {
  if (university === null) {
    return (
      <>
        <Navbar />
        <AccessDenied code='404' />
      </>
    )
  }

  const maxCourses = university.courses.length;

  return (
    <>
      <Navbar />
      {
        university.status === 'draft' && (
          <div style={{ width: '100%', backgroundColor: '#3B82F6', textAlign: 'center', paddingTop: '0.25rem', paddingBottom: '0.25rem', color: 'white', fontWeight: 'bold' }}>
            This is draft.
          </div>
        )
      }
      <div style={{ width: '100%', height: '60vh', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: -1 }}>
        {
          university.banner &&
          <img
            // src={`http://localhost:3000${university.banner.src}`}
            src={`${process.env.SERVER_URL}${university.banner.url}`}
            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
          />
        }
        <div style={{ position: 'absolute', height: '100%', width: '100%', backgroundColor: 'black', opacity: '0.25' }}></div>
        <div css={styles.universityNameContainer}>
          <span css={styles.universityName}>{university.name}</span>
        </div>
      </div>
      <PaddedContainer customStyles={{ paddingTop: '0px', paddingBottom: '0px' }}>
        <div style={{ width: '100%', backgroundImage: 'linear-gradient(#F1F7FF, #CEE4FE)', color: 'gray' }}>
          <div css={styles.contentSection} style={{ width: '100%', display: 'flex' }}>
            <div css={styles.logoContainer}>
              {
                university.logo &&
                // <img src={`http://localhost:3000${university.logo.src}`} style={{ backgroundColor: 'white', borderRadius: '50%', width: '150px', height: '150px' }} />
                <img src={`${process.env.SERVER_URL}${university.logo.url}`} style={{ backgroundColor: 'white', borderRadius: '50%', width: '150px', height: '150px' }} />
              }
            </div>
            <div>
              <span style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
                {university.name}
              </span>
              <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: '1rem' }} xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
                {`${university.city}, ${university.state}, ${university.country}`}
              </p>
            </div>
          </div>
        </div>
      </PaddedContainer>
      <PaddedContainer customStyles={{ paddingTop: '0px' }}>
        <CoursesSection chunkSize={20} universityName={university.name} />
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

  let university = null;
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
      query: GET_UNIVERSITY,
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
        university = data.university;
      })
      .catch(err => console.log(err))
  } else {
    await client.query({
      query: GET_UNIVERSITY,
      variables: {
        where: {
          id: ctx.query.id
        }
      }
    })
      .then(({ data }) => {
        university = data.university;
      })
      .catch(err => console.log(err))
  }

  return {
    props: {
      university: university || null,
      user: currUser
    }
  }
}

export default University;

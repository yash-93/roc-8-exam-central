import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';
import { useContext } from 'react';
import { GetServerSideProps } from 'next';

import Navbar from '../components/Navbar';
import Home from '../components/Home';
import parseCookies from '../lib/cookieParser';
import {
  CURRENT_USER_QUERY,
  GET_COMPETITIVE_PAPERS,
  GET_PAPERS,
  GET_USERS
} from '../utils/queries';
import BookmarkContext from '../utils/bookmarkContext';

const GET_UNIVERSITIES = gql`
  query GET_UNIVERSITIES {
    universities {
      id
      name
    }
  }
`;

interface PropTypes {
  allUniversities?: any;
  allCompetitivePapers?: any;
  allPapers?: any;
  allUsers?: any;
}

const Index = ({ allUniversities, allCompetitivePapers, allPapers, allUsers }: PropTypes) => {
  const { setBookmarkCount } = useContext(BookmarkContext);

  const { data } = useQuery(CURRENT_USER_QUERY);
  if (data && data.authenticatedItem) {
    setBookmarkCount(data.authenticatedItem.bookmarks.length)
  }

  return (
    <>
      <Navbar customStyles={{ color: 'white', border: '0px' }} />
      <Home
        allUniversities={allUniversities}
        allCompetitivePapers={allCompetitivePapers}
        allPapers={allPapers}
        allUsers={allUsers}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookieData = parseCookies(ctx.req);
  const client = new ApolloClient({
    // uri: 'http://localhost:3000/api/graphql',
    uri: `${process.env.GRAPHQL_URL}`,
    cache: new InMemoryCache()
  });

  let allUniversities = null;
  let allCompetitivePapers = null;
  let allPapers = null;
  let allUsers = null;

  let cookie = cookieData['keystonejs-session'];
  if (cookieData['keystonejs-session']) {
    const { data } = await client.query({
      query: GET_UNIVERSITIES,
      context: {
        headers: {
          Cookie: `keystonejs-session=${cookieData['keystonejs-session']}`
        }
      }
    });
    allUniversities = data.universities;

    const { data: competitivePapers } = await client.query({
      query: GET_COMPETITIVE_PAPERS,
      context: {
        headers: {
          Cookie: `keystonejs-session=${cookieData['keystonejs-session']}`
        }
      }
    });
    allCompetitivePapers = competitivePapers.competitivePapers;

    const { data: papers } = await client.query({
      query: GET_PAPERS,
      context: {
        headers: {
          Cookie: `keystonejs-session=${cookieData['keystonejs-session']}`
        }
      }
    });
    allPapers = papers.papers;

    const { data: users } = await client.query({
      query: GET_USERS,
      context: {
        headers: {
          Cookie: `keystonejs-session=${cookieData['keystonejs-session']}`
        }
      }
    });
    allUsers = users.users;
  } else {
    const { data } = await client.query({
      query: GET_UNIVERSITIES
    });
    allUniversities = data.universities;

    const { data: competitivePapers } = await client.query({
      query: GET_COMPETITIVE_PAPERS
    });
    allCompetitivePapers = competitivePapers.competitivePapers;

    const { data: papers } = await client.query({
      query: GET_PAPERS
    });
    allPapers = papers.papers;

    const { data: users } = await client.query({
      query: GET_USERS
    });
    allUsers = users.users;
  }

  return {
    props: {
      allUniversities: allUniversities || null,
      allCompetitivePapers: allCompetitivePapers || null,
      allPapers: allPapers || null,
      allUsers: allUsers || null,
      cookie: cookie || null
    }
  }
}

export default Index;

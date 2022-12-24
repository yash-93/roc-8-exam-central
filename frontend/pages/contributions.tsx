import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import xw from 'xwind';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next'

import Navbar from '../components/Navbar';
import PaddedContainer from '../components/PaddedContainer';
import ResultCard from '../components/ResultCard';
import SignInRequired from '../components/SignInRequired';
import parseCookies from '../lib/cookieParser';
import { GET_PAPERS_BY_USER_ID } from '../utils/queries';

const styles = {
  header: xw`
    w-full
    flex
    justify-between
    items-center
    py-2
    px-4
    bg-blue-500
    text-white
    font-bold
    tracking-wide
  `,
  contentSection: xw`
    w-full
    justify-center
    items-center
    p-6
    mb-8
    shadow
    border-1 border-solid border-gray-100
  `,
};

const CURRENT_USER_QUERY = gql`
  query {
    authenticatedItem {
      ... on User {
        id
        name
      }
    }
  }
`;

interface PropTypes {
  papers?: any;
  user?: any;
}

const Contributions = ({ papers, user }: PropTypes) => {
  if (user === null) {
    return (
      <>
        <Navbar />
        <SignInRequired />
      </>
    )
  }

  const router = useRouter();

  //@ts-ignore
  const drafts = [];
  //@ts-ignore
  const published = [];

  if (papers !== null || papers.length > 0) {
    papers?.map((paper: any) => {
      if (paper.status === 'published')
        published.push(paper)
      else
        drafts.push(paper);
    })
  }

  return (
    <>
      <Navbar />
      <PaddedContainer>
        <div style={{ width: '100%' }}>
          <div css={styles.header}>
            <span>Drafts</span>
            <svg
              style={{ width: '2rem', cursor: 'pointer' }}
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              onClick={() => {
                router.push('/addPaper');
              }}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 6v6m0 0v6m0-6h6m-6 0H6'
              />
            </svg>
          </div>
          <div css={styles.contentSection} style={{ maxHeight: '350px', overflowY: 'scroll' }}>
            {
              drafts.length > 0 ?
                //@ts-ignore
                drafts.map((paper, index) => (
                  <ResultCard key={index} paper={paper} isDraft={true} />
                )) :
                <span>No papers to show.</span>
            }
          </div>
        </div>

        <div style={{ width: '100%' }}>
          <div css={styles.header}>
            <span>Published</span>
            <svg style={{ width: '2rem', cursor: 'pointer', opacity: 0, pointerEvents: 'none' }} xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
            </svg>
          </div>
          <div css={styles.contentSection} style={{ maxHeight: '350px', overflowY: 'scroll' }}>
            {
              published.length > 0 ?
                //@ts-ignore
                published.map((paper, index) => (
                  <ResultCard key={index} paper={paper} isDraft={false} />
                )) :
                <span>No papers to show.</span>
            }
          </div>
        </div>
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
  let papers = null;
  let currUser = null;

  let cookie = cookieData['keystonejs-session'];
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

    const { data } = await client.query({
      query: GET_PAPERS_BY_USER_ID,
      context: {
        headers: {
          Cookie: `keystonejs-session=${cookieData['keystonejs-session']}`
        }
      },
      variables: {
        where: {
          id: currUser.id
        }
      }
    });
    papers = data.user.papers;
  }

  return {
    props: {
      papers: papers || null,
      user: currUser
    }
  }
}

export default Contributions;

import { ApolloClient, InMemoryCache, useMutation, useQuery } from '@apollo/client';
import xw from 'xwind';
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { GetServerSideProps } from 'next';

import Navbar from '../../components/Navbar';
import PaddedContainer from '../../components/PaddedContainer';
import RenderPDF from '../../components/RenderPDF';
import UserContext from '../../utils/userContext';
import BookmarkContext from '../../utils/bookmarkContext';
import parseCookies from '../../lib/cookieParser';
import { GET_PAPER_BY_ID, ADD_BOOKMARK, CURRENT_USER_QUERY } from '../../utils/queries';

const styles = {
  container: xw`
    w-full
    border-1
    border-solid
    border-gray-200
    shadow-xl
    overflow-hidden
  `,
  headingContainer: xw`
    w-full
    flex
    flex-col
    justify-center
    items-center
    p-4
    border-b-1
    border-solid
    border-gray-200
  `,
  heading: xw`
    font-bold
    text-xl
    sm:text-2xl
    tracking-wide
    text-center
  `,
  button: xw`
    flex
    justify-center
    items-center
    py-2
    px-4
    my-2
    md:my-0
    whitespace-nowrap
    rounded
    bg-blue-500
    border-blue-500
    border-2
    border-solid
    text-white
    font-bold
    cursor-pointer
  `,
  transparentButton: xw`
    flex
    justify-center
    items-center
    py-2
    px-4
    my-2
    md:my-0
    whitespace-nowrap
    rounded
    text-blue-500
    border-blue-500
    border-2
    border-solid
    font-bold
    cursor-pointer
    hover:text-white
    hover:bg-blue-500
    transition-all
  `,
  btnsContainer: xw`
    w-full
    py-4
    flex
    flex-col
    md:flex-row
    justify-center
    items-center
  `,
};

const uploadedBy = 'Manoj Rathi';

interface PropTypes {
  slug?: any;
  paper?: any;
}

const Home = ({ slug, paper }: PropTypes) => {
  const { user, setUser } = useContext(UserContext);

  const { bookmarkCount, setBookmarkCount } = useContext(BookmarkContext);

  let found = false;

  const [isBookmark, setIsBookmark] = useState(found);

  useEffect(() => {
    function checkIsBookmark() {
      if (user) {
        let bookmarks = [];
        bookmarks = user.bookmarks;
        found = bookmarks.some((bookmark: any) => bookmark?.id === paper?.id);
        setIsBookmark(found);
      }
    }
    checkIsBookmark();
  }, [user, isBookmark]);

  const [addBookmark] = useMutation(ADD_BOOKMARK);

  const handleAddBookmark = () => {
    if (!isBookmark) {
      addBookmark({
        variables: {
          where: {
            id: user.id
          },
          data: {
            bookmarks: {
              connect: {
                id: paper.id
              }
            }
          }
        }
      })
        .then(({ data }) => {
          console.log('Bookmark Added');
          setUser(data.updateUser);
          setIsBookmark(true);
          setBookmarkCount(bookmarkCount + 1);
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      addBookmark({
        variables: {
          where: {
            id: user.id
          },
          data: {
            bookmarks: {
              disconnect: {
                id: paper.id
              }
            }
          }
        }
      })
        .then(({ data }) => {
          console.log('Bookmark removed');
          setUser(data.updateUser);
          setIsBookmark(false);
          setBookmarkCount(bookmarkCount - 1);
        })
        .catch(err => {
          console.log(err);
          console.log("Unable to remove bookmark")
        })
    }
  }

  return (
    <>
      <Navbar />
      <PaddedContainer>
        <div css={styles.container}>
          <div css={styles.headingContainer}>
            <span css={styles.heading}>{slug}</span>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingTop: '1rem' }}>
              {`Uploaded by - `}
              {/* <Link href={`/user/${uploadedBy}`}> */}
              <span style={{ fontWeight: 'bold' }}>{` ${uploadedBy}`}</span>
              {/* </Link> */}
            </div>
          </div>

          <RenderPDF paper={paper} />

          <div css={styles.btnsContainer}>
            {/* {
              user && (
                <div css={styles.button} style={{ marginLeft: '1rem', marginRight: '1rem' }}>
                  Download
                  <svg style={{ width: '1.25rem', marginLeft: '0.5rem' }} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
              )
            } */}

            {
              user && (
                <div css={isBookmark ? styles.button : styles.transparentButton} style={{ marginLeft: '1rem', marginRight: '1rem' }} onClick={handleAddBookmark}>
                  {isBookmark ? 'Remove Bookmark' : 'Bookmark'}
                  <svg style={{ width: '1.25rem', marginLeft: '0.5rem' }} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
              )
            }

            <div css={styles.transparentButton} style={{ marginLeft: '1rem', marginRight: '1rem' }}>
              Share
              <svg style={{ width: '1.25rem', marginLeft: '0.5rem' }} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
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

  let paper = null;
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

    const { data } = await client.query({
      query: GET_PAPER_BY_ID,
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
    });
    paper = data.paper;
  } else {
    const { data } = await client.query({
      query: GET_PAPER_BY_ID,
      variables: {
        where: {
          id: ctx.query.id
        }
      }
    });
    paper = data.paper;
  }

  return {
    props: {
      slug: ctx.query.slug,
      paper,
      user: currUser
    }
  }
}

export default Home;

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { useQuery } from '@apollo/client';
import xw from 'xwind';
import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { css } from '@emotion/css';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next'

import Navbar from '../components/Navbar';
import PaddedContainer from '../components/PaddedContainer';
import ResultCard from '../components/ResultCard';
import parseCookies from '../lib/cookieParser';
import { CURRENT_USER_QUERY } from '../utils/queries';

const styles = {
  container: xw`
      w-full
      border-1
      border-solid
      border-gray-200
      shadow-xl
      overflow-hidden
    `,
  header: xw`
      w-full
      py-2
      px-4
      bg-blue-500
      text-white
      font-bold
      tracking-wide
    `,
  contentSection: xw`
      w-full
      flex
      flex-col
      md:flex-row
      justify-center
      items-center
      p-6
      mb-8
      shadow
      border-1 border-solid border-gray-100
    `,
  label: xw`
      font-bold
      text-2xl
    `,
}

const pagination = css`
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 1%;
    padding-bottom: 1%;
    a {
      color: gray;
    }
  `;

const pageClass = css`
    font-weight: bold;
    height: 40px;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  `;

const pagination__link__classname = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 40px;
    border-bottom: 3px solid white;
    &:hover {
      border-bottom: 3px solid #3B82F6;
    }
  `;

const pagination__link = css`
    font-weight: bold;
    cursor: pointer;
    margin-right: 20px;
    margin-left: 20px;
  `;

const pagination__link__active = css`
    a {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      width: 40px;
      border-bottom: 3px solid #3B82F6;
      & {
        color: #3B82F6;
      }
    }
  `;

const pagination__link__disabled = css`
    a {
      color: rgb(198, 197, 202);
    }
  `;

interface PropTypes {
  papers?: any;
  selected?: any;
}

const Bookmarks = ({ papers }: PropTypes) => {
  const [allBookmarkedPapers, setAllBookmarkedPapers] = useState(papers);
  const [currentPagePapers, setCurrentPagePapers] = useState([]);

  const PER_PAGE = 5;

  useEffect(() => {
    let newPapers = allBookmarkedPapers?.slice(0, 0 + PER_PAGE);
    setCurrentPagePapers(newPapers);
  }, [allBookmarkedPapers]);

  const handlePaginationClick = ({ selected: selectedPage }: PropTypes) => {
    const offset = selectedPage * PER_PAGE;
    let newPapers = allBookmarkedPapers?.slice(offset, offset + PER_PAGE);
    setCurrentPagePapers(newPapers);
  }

  const pageCount = Math.ceil(allBookmarkedPapers?.length / PER_PAGE);

  return (
    <>
      <Navbar />
      <PaddedContainer>
        <div style={{ width: '100%' }}>
          <div css={styles.header}>
            Bookmarks
          </div>
          <div css={styles.container}>
            {
              allBookmarkedPapers?.map((paper: any, index: number) => (
                <ResultCard
                  key={index}
                  paper={paper}
                  isDraft={paper.status === 'draft' ? true : false}
                  isBookmark={true}
                  allBookmarkedPapers={allBookmarkedPapers}
                  setAllBookmarkedPapers={setAllBookmarkedPapers}
                />
              ))
            }
            <div style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
              {/* @ts-ignore */}
              <ReactPaginate
                previousLabel={`<`}
                nextLabel={'>'}
                pageCount={pageCount}
                onPageChange={handlePaginationClick}
                containerClassName={`${pagination}`}
                pageClassName={`${pageClass}`}
                pageLinkClassName={`${pagination__link__classname}`}
                previousLinkClassName={`${pagination__link}`}
                nextLinkClassName={`${pagination__link}`}
                disabledClassName={`${pagination__link__disabled}`}
                activeClassName={`${pagination__link__active}`}
              />
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

  let papers = null;
  if (cookieData['keystonejs-session']) {
    await client.query({
      query: CURRENT_USER_QUERY,
      context: {
        headers: {
          Cookie: `keystonejs-session=${cookieData['keystonejs-session']}`
        }
      }
    })
      .then(({ data }) => {
        console.log(data);
        papers = data.authenticatedItem.bookmarks;
      })
      .catch(err => {
        console.log(err);
      })
  }

  return {
    props: {
      papers: papers || null
    }
  }
}

export default Bookmarks;

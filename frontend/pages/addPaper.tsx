import { ApolloClient, InMemoryCache } from '@apollo/client';
import xw from 'xwind';
import { useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { GetServerSideProps } from 'next'

import Navbar from '../components/Navbar';
import PaddedContainer from '../components/PaddedContainer';
import { loadScriptByURL } from '../lib/addRecaptchaScript';
import AddPaperForm from '../components/DraggableUploadedFiles/AddPaperForm';
import SignInRequired from '../components/SignInRequired';
import parseCookies from '../lib/cookieParser';
import {
  CURRENT_USER_QUERY,
  GET_UNIVERSITIES,
  GET_COMPETITIVE_PAPERS
} from '../utils/queries';
import UniversityListContext from '../utils/universityListContext';
import CompetitivePapersListContext from '../utils/competitivePapersListContext';

toast.configure();

const styles = {
  header: xw`
    w-full
    lg:w-4/5
    xl:w-4/6
    2xl:w-4/5
    flex
    justify-between
    items-center
    py-2
    px-4
    bg-blue-500
    text-white
    font-bold
    tracking-wide
    shadow-lg
  `
};

interface PropTypes {
  user?: any;
  universities?: any;
  competitivePapers?: any;
}

const AddPaper = ({ user, universities, competitivePapers }: PropTypes) => {
  if (user === null) {
    return (
      <>
        <Navbar />
        <SignInRequired />
      </>
    )
  }

  const { setUniversityList } = useContext(UniversityListContext);
  const { setCompetitivePapersList } = useContext(CompetitivePapersListContext);

  //@ts-ignore
  let universitiesList = [];
  universities?.map((university: any) => {
    universitiesList.push({ label: university.name, value: university.name, id: university.id });
  });

  //@ts-ignore
  let competitivePapersList = [];
  competitivePapers?.map((paper: any) => {
    competitivePapersList.push({ label: paper.name, value: paper.name, id: paper.id });
  })

  useEffect(() => {
    //@ts-ignore
    setUniversityList(universitiesList);
    //@ts-ignore
    setCompetitivePapersList(competitivePapersList);
  }, []);

  useEffect(() => {
    loadScriptByURL('recaptcha-key', `https://www.google.com/recaptcha/api.js?render=${process.env.RECAPTCHA_SITE_KEY_V3}`, function () {
    });
  }, []);

  return (
    <>
      <Navbar />
      <PaddedContainer>
        <div css={styles.header} style={{ justifyContent: 'center' }}>
          <span style={{ fontSize: '1.5rem' }}>Add Paper</span>
        </div>
        <AddPaperForm />
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
  let currUser = null;
  let universities = null;
  let competitivePapers = null;

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
      query: GET_UNIVERSITIES,
      context: {
        headers: {
          Cookie: `keystonejs-session=${cookieData['keystonejs-session']}`
        }
      }
    })
      .then(({ data }) => {
        universities = data.universities;
      })
      .catch(err => {
      })

    await client.query({
      query: GET_COMPETITIVE_PAPERS,
      context: {
        headers: {
          Cookie: `keystonejs-session=${cookieData['keystonejs-session']}`
        }
      }
    })
      .then(({ data }) => {
        competitivePapers = data.competitivePapers;
      })
      .catch(err => {
      })
  }

  return {
    props: {
      user: currUser,
      universities: universities,
      competitivePapers: competitivePapers
    }
  }
}

export default AddPaper;

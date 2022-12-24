import { useQuery, useMutation } from '@apollo/client';
import { useState, useEffect } from 'react';
import xw from 'xwind';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Loader from 'react-loader-spinner';

import Navbar from '../../components/Navbar';
import AccessDenied from '../../components/AccessDenied';
import PaddedContainer from '../../components/PaddedContainer';
import { CURRENT_USER_QUERY, UPDATE_USER } from '../../utils/queries';

import 'react-toastify/dist/ReactToastify.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

toast.configure();

const styles = {
  container: xw`
    w-full
    min-h-full
    flex
  `,
  sectionsContainer: xw`
    w-full
    flex
    flex-col
    lg:flex-row
    pt-8
  `,
  userContainer: xw`
    w-9/12
    p-10
  `,
  profileSectionContainer: xw`
    w-full
    flex
    flex-col
    justify-center
    items-center
    lg:flex-col
    h-full
  `,
  profilePicContainer: xw`
    relative
    w-72
    h-72
    lg:w-96
    lg:h-96
  `,
  profilePic: xw`
    w-full
    h-full
    object-cover
  `,
  userDetailsSection: xw`
    py-8
  `,
  iconsContainer: xw`
    pt-2
    flex
  `,
  contentSectionContainerParent: xw`
    w-full
    flex
    justify-center
    lg:justify-start
  `,
  contentSectionContainer: xw`
    w-full
  `,
  cover: xw`
    object-cover
  `,
  tabsContainer: xw`
    w-full
    pt-2
    flex
    flex-wrap
    rounded-tr
    rounded-tl
    bg-gray-100
    dark:bg-gray-700
  `,
  tab: xw`
    px-4
    mx-2
    pb-1
    font-bold
    tracking-wide
    cursor-pointer
    dark:text-gray-400
    hover:border-b-2
    hover:border-solid
    hover:border-gray-500
  `,
  tabActive: xw`
    px-4
    mx-2
    pb-1
    font-bold
    tracking-wide
    cursor-pointer
    border-b-2 border-solid border-blue-500
  `,
  tabDataContainer: xw`
    w-full
    p-4
    flex
    flex-col
    flex-wrap
    border-1 border-solid border-gray-100
    dark:border-gray-700
  `,
  siteName: xw`
    text-black
    dark:text-white
  `,
  card: xw`
    w-full
    shadow
    flex flex-col
    px-4
    m-1
    cursor-pointer
  `
};

const tabs = ['Papers', 'Bookmarks'];

const User = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [avatar, setAvatar] = useState(null);

  const { data, loading } = useQuery(CURRENT_USER_QUERY);

  const [updateUser] = useMutation(UPDATE_USER);

  useEffect(() => {
    if (avatar !== null) {
      updateUser({
        variables: {
          where: {
            id: data?.authenticatedItem?.id,
          },
          data: {
            avatar: {
              upload: avatar
            }
          }
        }
      })
        .then(({ data }) => {
          console.log(data);
        })
        .catch(err => {
          console.log(err);
        })
    }
  }, [avatar]);

  const handleAvatar = () => {
    //@ts-ignore
    document.getElementById('avatar').click();
  }

  if (loading) {
    return (
      <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Loader
          type='TailSpin'
          color='#000000'
          height={75}
          width={75}
        />
      </div>
    )
  }

  if (router.query?.slug !== 'me') {
    return (
      <>
        <Navbar />
        <AccessDenied code='404' />
      </>
    )
  }

  if (data?.authenticatedItem === null) {
    return (
      <>
        <Navbar />
        <AccessDenied code='404' />
      </>
    )
  }

  const myPapers = data?.authenticatedItem?.papers?.map((paper: any, index: number) => {
    return (
      <Link href={`/paper/${paper.name}?id=${paper.id}`} key={paper.id}>
        <section css={styles.card} >
          <span css={styles.siteName} style={{ fontWeight: 'bold', fontSize: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
            {`${paper.name} | ${paper.paperCode} | ${paper.semester} | ${paper.year}`}
          </span>
        </section>
      </Link>
    )
  });

  const myBookmarks = data?.authenticatedItem?.bookmarks?.map((bookmark: any) => {
    return (
      <Link href={`/paper/${bookmark.name}?id=${bookmark.id}`} key={bookmark.id}>
        <section css={styles.card} >
          <span css={styles.siteName} style={{ fontWeight: 'bold', fontSize: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
            {`${bookmark.name} | ${bookmark.paperCode} | ${bookmark.semester} | ${bookmark.year}`}
          </span>
        </section>
      </Link>
    )
  });

  return (
    <>
      <Navbar />
      <PaddedContainer customStyles={{ paddingTop: '2.5rem' }}>
        <div style={{ width: '100%' }}>
          <div css={styles.container}>
            <div css={styles.sectionsContainer}>

              <section css={styles.profileSectionContainer}>
                <div css={styles.profilePicContainer} >
                  {
                    data.authenticatedItem &&
                    <img src={data.authenticatedItem.avatar?.url ? `${process.env.SERVER_URL}${data.authenticatedItem.avatar.url}` : '/profile.jpg'} css={styles.profilePic} />
                  }
                  <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', paddingTop: '1rem', paddingRight: '1rem', position: 'absolute', left: 0, top: 0 }}>
                    <div style={{ cursor: 'pointer' }}>
                      <input
                        type='file'
                        name='avatar'
                        id='avatar'
                        accept='image/png, image/gif, image/jpeg'
                        //@ts-ignore
                        onChange={(e) => setAvatar(e.target.files[0])}
                        hidden
                      />
                      <svg style={{ width: '2rem', color: 'gray' }} onClick={handleAvatar} xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' />
                      </svg>
                    </div>
                  </div>
                </div>
                <div css={styles.userDetailsSection}>
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingBottom: '1rem' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{data?.authenticatedItem?.name}</span>
                  </div>
                </div>
              </section>

              <section css={styles.contentSectionContainerParent}>
                <div css={styles.contentSectionContainer}>
                  <div css={styles.tabsContainer}>
                    {
                      tabs.map((tab, index) => {

                        return (
                          <div key={index}>
                            {
                              tab === activeTab ?
                                (
                                  <div css={styles.tabActive} onClick={() => setActiveTab(tab)}>
                                    {tab}
                                  </div>
                                ) :
                                (
                                  <div css={styles.tab} onClick={() => setActiveTab(tab)}>
                                    {tab}
                                  </div>
                                )
                            }
                          </div>
                        )
                      })
                    }
                  </div>
                  <div css={styles.tabDataContainer}>
                    {
                      activeTab === 'Papers' && (
                        myPapers.length > 0 ? myPapers : <span>No papers to show.</span>
                      )
                    }
                    {
                      activeTab === 'Bookmarks' && (
                        myBookmarks.length > 0 ? myBookmarks : <span>No bookmarks to show.</span>
                      )
                    }
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </PaddedContainer>
    </>
  )
}

export default User;

import { useMutation, useQuery } from '@apollo/client';
import { css } from '@emotion/css';
import { Global } from '@emotion/react';
import xw from 'xwind';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useContext, useEffect } from 'react';

import UserContext from '../utils/userContext';
import URLContext from '../utils/urlContext';
import BookmarkContext from '../utils/bookmarkContext';
import { CURRENT_USER_QUERY, SIGN_OUT_MUTATION } from '../utils/queries';

const styles = {
  navContainer: xw`
    w-full
    flex
    flex-row-reverse
    lg:flex-row
    justify-between
    items-center
    py-4
    px-8
    2xl:px-8
    lg:px-16
    sm:px-12
    border-b-2
    border-gray-200
    border-solid
    transition-all
    z-50
  `,
  navBrand: xw`
    w-auto
    flex
    items-center
    cursor-pointer
  `,
  navBrandText: xw`
    font-bold
    text-sm
    sm:text-xl
    pl-2
  `,
  navLinksContainer: xw``,
  navLinks: xw`
    flex
    hidden
    lg:block
    lg:flex
  `,
  link: xw`
    p-2
    mx-3
    font-bold
    text-sm
    sm:text-lg
    cursor-pointer
  `,
  profileLink: xw`
    p-2
    mx-3
    flex
    font-bold
    text-sm
    sm:text-lg
    rounded
  `,
  button: xw`
    flex
    justify-center
    items-center
    text-sm
    sm:text-lg
    py-2
    px-2
    sm:px-4
    ml-4
    sm:ml-6
    whitespace-nowrap
    rounded
    bg-blue-500
    text-white
    font-bold
    cursor-pointer
  `,
  transparentButton: xw`
    flex
    justify-center
    items-center
    py-1
    px-2
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
    hover:bg-blue-500
    hover:text-white
    transition-all
  `,
  dropDownContainer: xw`
    absolute
    bg-white
    font-bold
    text-lg
    text-black
    shadow-xl
    border-1 border-solid border-gray-100
    rounded
    py-2
    mt-12
  `,
  sliderMenuContainer: xw`
    block
    lg:hidden
  `,
  slider: xw`
    fixed
    h-screen
    bg-white
    shadow
  `,
  sliderItem: xw`
    w-full
    font-bold
    py-2
    px-4
    flex
    items-center
    justify-between
  `
};

interface PropTypes {
  customStyles?: any;
}

const Navbar = ({ customStyles }: PropTypes) => {
  const { user, setUser } = useContext(UserContext);
  const { setUrl } = useContext(URLContext);
  const { bookmarkCount, setBookmarkCount } = useContext(BookmarkContext);
  const [showDropDown, setShowDropDown] = useState(false);
  const [showSliderMenu, setShowSliderMenu] = useState(false);

  const { data: currentUser } = useQuery(CURRENT_USER_QUERY);

  useEffect(() => {
    if (currentUser?.authenticatedItem) {
      setUser(currentUser?.authenticatedItem);
      setBookmarkCount(currentUser?.authenticatedItem?.bookmarks.length);
    }
  }, [currentUser]);

  const router = useRouter();

  const [signout] = useMutation(SIGN_OUT_MUTATION);

  const logout = async (e: any) => {
    e.preventDefault();
    await signout();
    setUser(null);
  }

  const brandIcon = <svg style={{ width: '2.5rem', height: '2.5rem' }} version='1.0' xmlns='http://www.w3.org/2000/svg'
    width='100.000000pt' height='100.000000pt' viewBox='0 0 100.000000 100.000000'
    preserveAspectRatio='xMidYMid meet' stroke='currentColor'>

    <g transform='translate(0.000000,100.000000) scale(0.100000,-0.100000)'
      fill={`${showSliderMenu ? '#000' : customStyles ? '#fff' : '#000'}`} stroke='none'>
      <path d='M120 571 l0 -348 79 -7 c85 -7 211 -37 266 -63 33 -16 37 -16 70 0
55 26 181 56 266 63 l79 7 0 348 0 349 -42 0 c-68 0 -166 -19 -256 -49 l-82
-27 -83 27 c-89 30 -187 49 -254 49 l-43 0 0 -349z m215 283 c33 -9 79 -22
103 -31 l42 -16 0 -308 0 -308 -54 19 c-58 20 -130 35 -213 45 l-53 7 0 310 0
309 58 -6 c31 -4 84 -13 117 -21z m505 -283 l0 -309 -52 -7 c-84 -10 -156 -25
-214 -45 l-54 -19 0 308 0 308 43 16 c76 28 183 52 255 56 l22 1 0 -309z'/>
      <path d='M40 482 l0 -339 94 -6 c105 -7 222 -29 309 -58 56 -19 58 -19 115 0
86 29 203 51 308 58 l94 6 0 339 c0 331 0 338 -20 338 -20 0 -20 -7 -20 -319
l0 -319 -72 -7 c-104 -9 -226 -32 -292 -55 -55 -19 -57 -19 -112 0 -66 23
-188 46 -291 55 l-73 7 0 319 c0 312 0 319 -20 319 -20 0 -20 -7 -20 -338z'/>
    </g>
  </svg>

  const menuIcon = <svg style={{ width: '2rem' }} onClick={() => setShowSliderMenu(!showSliderMenu)} xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16m-7 6h7' />
  </svg>

  const moveRight = css`
      animation: moveright 700ms ease;
      animation-fill-mode: forwards;
      @keyframes moveright {
        from {left: -230px;}
        to {left: 0px;}
      }
  `;

  const moveLeft = css`
      animation: moveleft 700ms ease;
      animation-fill-mode: forwards;
      @keyframes moveleft {
        from {left: 0px;}
        to {left: -230px;}
      }
  `;

  interface PropTypes {
    text?: any;
    link?: any;
    onClick?: any;
  }

  const SliderItem = ({ text, link, onClick }: PropTypes) => <Link href={link} >
    <li css={styles.sliderItem} onClick={onClick}>
      {text}
      {
        text === 'Bookmarks' &&
        <div style={{ backgroundColor: 'red', color: 'white', borderRadius: '999px', minWidth: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {bookmarkCount}
        </div>
      }
    </li>
  </Link>

  const slider = <div css={styles.slider} style={{ width: '230px', left: '-230px', zIndex: 50 }} className={showSliderMenu ? moveRight : moveLeft}>
    {
      user && <>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
          <img src={`${process.env.SERVER_URL}${currentUser.authenticatedItem?.avatar?.url}`} width={100} height={100} style={{ borderRadius: '50%', marginRight: '0.5rem' }} />
        </div>
        <Link href='/user/me'>
          <div style={{ width: '100%', textAlign: 'center', marginTop: '1rem', fontWeight: 'bold', fontSize: '1.5rem' }}>
            {user?.name || ''}
          </div>
        </Link>
        <div style={{ width: '100%', marginTop: '1rem', borderBottom: '1px solid #F4F4F5' }}></div>
      </>
    }
    <ul style={{ width: '100%', marginTop: '1rem' }}>
      <SliderItem text='Home' link='/' />
      {
        user &&
        <>
          <SliderItem text='My Contributions' link='/contributions' />
          <SliderItem text='Bookmarks' link='/bookmarks' />
        </>
      }
      {!user && <SliderItem text='Sign In' link='/signIn' onClick={() => setUrl(router.asPath)} />}
      {
        user && (
          <li css={styles.sliderItem} onClick={(e) => {
            logout(e);
            setShowSliderMenu(false);
          }}>
            Sign Out
            <svg style={{ width: '1.25rem', marginLeft: '0.5rem' }} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </li>
        )
      }
    </ul>
  </div>

  return (
    <>
      <Global
        styles={{
          'body': {
            overflow: showSliderMenu ? 'hidden' : 'auto'
          },
        }}
      />
      <div css={styles.navContainer} style={showSliderMenu ? { color: 'black', backgroundColor: 'white' } : customStyles}>
        <Link href='/'>
          <div css={styles.navBrand} style={customStyles}>
            {brandIcon}
            <span css={styles.navBrandText} style={showSliderMenu ? { color: 'black' } : {}} >Exam Central</span>
          </div>
        </Link>
        <div css={styles.navLinksContainer}>
          <div css={styles.sliderMenuContainer}>
            {menuIcon}
          </div>
          <ul css={styles.navLinks}>
            <Link href='/'>
              <li css={styles.link} style={customStyles}>Home</li>
            </Link>
            {
              user && (
                <Link href='/contributions'>
                  <li css={styles.link} style={customStyles}>My Contributions</li>
                </Link>
              )
            }
            {
              user && (
                <>
                  <li css={styles.profileLink} style={customStyles} >
                    <img src={`${process.env.SERVER_URL}${currentUser?.authenticatedItem?.avatar?.url}`} width={30} height={30} style={{ borderRadius: '50%', marginRight: '0.5rem' }} />
                    <span onClick={() => setShowDropDown(!showDropDown)} style={{ cursor: 'pointer' }}>
                      {user.name}
                    </span>
                    {
                      showDropDown && (
                        <div css={styles.dropDownContainer} style={{ width: '250px', marginLeft: '-8%' }}>
                          <Link href='/user/me'>
                            <div style={{ width: '100%', paddingTop: '0.5rem', paddingBottom: '0.5rem', paddingRight: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                              <div style={{ height: '35px', padding: '2.5px', backgroundColor: '#3B82F6' }}></div>
                              <span style={{ paddingLeft: '1rem' }}>My Profile</span>
                            </div>
                          </Link>
                          <div style={{ width: '100%', paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>
                            <div style={{ backgroundColor: '#E4E4E7', height: '1px', }}></div>
                          </div>
                          <Link href='/bookmarks'>
                            <div style={{ width: '100%', paddingTop: '0.5rem', paddingBottom: '0.5rem', paddingRight: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ height: '35px', padding: '2.5px', backgroundColor: '#fff' }}></div>
                                <span style={{ paddingLeft: '1rem' }}>Bookmarks</span>
                              </div>
                              <div style={{ backgroundColor: 'red', color: 'white', paddingLeft: '0.25rem', paddingRight: '0.25rem', fontSize: '0.75rem', borderRadius: '999px', minWidth: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {bookmarkCount}
                              </div>
                            </div>
                          </Link>
                          <div style={{ width: '100%', paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>
                            <div style={{ backgroundColor: '#E4E4E7', height: '1px', }}></div>
                          </div>
                          {/* <div style={{ width: '100%', paddingTop: '0.5rem', paddingBottom: '0.5rem', paddingRight: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <div style={{ height: '35px', padding: '2.5px', backgroundColor: '#fff' }}></div>
                              <span style={{ paddingLeft: '1rem' }}>Notifications</span>
                            </div>
                            <div style={{ backgroundColor: 'red', color: 'white', paddingLeft: '0.25rem', paddingRight: '0.25rem', fontSize: '0.75rem', borderRadius: '999px', minWidth: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              04
                            </div>
                          </div> */}
                          <div style={{ width: '100%', paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>
                            <div style={{ backgroundColor: '#E4E4E7', height: '1px', }}></div>
                          </div>
                          <div style={{ width: '100%', paddingTop: '1rem', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {
                              user && (
                                <div css={styles.transparentButton} onClick={logout}>
                                  Sign Out
                                  <svg style={{ width: '1.25rem', marginLeft: '0.5rem' }} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                  </svg>
                                </div>
                              )
                            }
                          </div>
                        </div>
                      )
                    }
                  </li>
                </>
              )
            }
            {
              user === null && (
                <Link href='/signIn'>
                  <div css={styles.button} onClick={() => setUrl(router.asPath)}>
                    Sign In
                  </div>
                </Link>
              )
            }
          </ul>
        </div>
      </div>
      {
        showSliderMenu &&
        <div style={{
          position: 'fixed',
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: 'black',
          opacity: '0.7',
          zIndex: 50
        }}
          onClick={() => setShowSliderMenu(false)}
        >
        </div>
      }
      {
        showSliderMenu && (
          <div css={styles.sliderMenuContainer}>
            {slider}
          </div>
        )
      }
    </>
  )
}

export default Navbar;

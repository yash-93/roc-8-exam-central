import { ApolloClient, InMemoryCache, gql, useMutation } from '@apollo/client';
import { useContext, useState } from 'react';
import xw from 'xwind';
import router from 'next/router';
import { toast } from 'react-toastify';
import isEmail from 'validator/lib/isEmail';
import { GetServerSideProps } from 'next'

import Navbar from '../components/Navbar';
import PaddedContainer from '../components/PaddedContainer';
import AlreadySignedIn from '../components/AlreadySignedIn';
import UserContext from '../utils/userContext';
import URLContext from '../utils/urlContext';
import parseCookies from '../lib/cookieParser';
import { CURRENT_USER_QUERY } from '../utils/queries';

import 'react-toastify/dist/ReactToastify.css';

toast.configure();

const styles = {
  container: xw`
    relative
    w-full
    flex
    shadow-xl
  `,
  imagePart: xw`
    hidden
    md:w-1/2
    py-6
    flex
    flex-col
    justify-center
    items-center
  `,
  part: xw`
    w-full
    md:w-1/2
    py-6
    flex
    flex-col
    justify-center
    items-center
  `,
  navBrand: xw`
    w-auto
    flex
    items-center
  `,
  navBrandText: xw`
    font-bold
    text-sm
    sm:text-xl
    pl-2
  `,
  tabContainer: xw`
    w-full
    flex
    justify-center
    my-8
  `,
  tab: xw`
    flex
    justify-center
    font-bold
    text-lg
    pb-1
    border-b-2
    border-gray-400
    text-gray-400
    cursor-pointer
    `,
  tabActive: xw`
    flex
    justify-center
    font-bold
    text-lg
    pb-1
    border-b-2
    border-blue-500
    text-blue-500
    cursor-pointer
  `,
  formContainer: xw`
    w-full
    flex
    justify-center
  `,
  input: xw`
    p-2
    bg-gray-200
    my-2
    font-bold
    outline-none
    rounded
  `,
  submitInput: xw`
    p-2
    bg-blue-500
    mt-4
    mb-2
    font-bold
    text-white
    tracking-wide
    outline-none
    rounded
    cursor-pointer
  `
}

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        item {
          id
          name
          role
          bookmarks {
            id
            name
          }
          avatar {
            url
          }
        }
        sessionToken
      }
      ... on UserAuthenticationWithPasswordFailure {
        message
      }
    }
  }
`;

const SIGN_UP_MUTATION = gql`
  mutation SIGN_UP_MUTATION($data: UserCreateInput!) {
    createUser(data: $data) {
      id
      name
    }
  }
`;

const brandIcon = <svg style={{ width: '2.5rem', height: '2.5rem' }} version='1.0' xmlns='http://www.w3.org/2000/svg'
  width='100.000000pt' height='100.000000pt' viewBox='0 0 100.000000 100.000000'
  preserveAspectRatio='xMidYMid meet' stroke='currentColor'>

  <g transform='translate(0.000000,100.000000) scale(0.100000,-0.100000)'
    fill='#000000' stroke='none'>
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

const initialValues: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatar: any;
} = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  avatar: null
};

const SignIn = ({ user }: any) => {
  if (user) {
    return (
      <>
        <Navbar />
        <AlreadySignedIn />
      </>
    )
  }

  const { setUser } = useContext(UserContext);
  const { url } = useContext(URLContext);
  const [formData, setFormData] = useState(initialValues);

  const [signInForm, setSignInForm] = useState(true);

  const createAvatar = () => {
    let nameChunks = formData.name.split(' ');
    let canvasText = '';
    for (let i = 0; i < nameChunks.length; i++) {
      canvasText += nameChunks[i][0]?.toUpperCase();
    }

    var canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    var ctx = canvas.getContext('2d');
    //@ts-ignore
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    //@ts-ignore
    ctx.fillStyle = '#F4C9C3';
    //@ts-ignore
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    //@ts-ignore
    ctx.font = 'bold 150px Calibri';
    //@ts-ignore
    ctx.textAlign = 'center';
    //@ts-ignore
    ctx.textBaseline = 'middle';
    //@ts-ignore
    ctx.fillStyle = '#6B6B69';
    //@ts-ignore
    ctx.fillText(canvasText, canvas.width / 2, canvas.height / 2);

    let byteString;
    let mimeString;
    let ia;

    var dataURI = canvas.toDataURL('image/jpeg', 1);
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = encodeURI(dataURI.split(',')[1]);
    }
    // separate out the mime component
    mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
    // setAvatar(new Blob([ia], { type: mimeString }));
  }

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [signin] = useMutation(SIGNIN_MUTATION, {
    variables: {
      email: formData.email,
      password: formData.password
    }
  });

  const [signup] = useMutation(SIGN_UP_MUTATION);

  const submitHandler = async (e: any) => {
    e.preventDefault();
    if (signInForm) {
      if (formData.email.length === 0 || formData.password.length === 0) {
        toast.error('Please fill required fields!', {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
      if (!isEmail(formData.email)) {
        toast.error('Invalid email!', {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
      const res = await signin();
      if (res.data.authenticateUserWithPassword.item) {
        setUser(res.data.authenticateUserWithPassword.item);
        router.push(url);
      } else {
        toast.error('Login failed!', {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } else {
      if (formData.name.length === 0 || formData.email.length === 0 || formData.password.length === 0) {
        toast.error('Please fill required fields!', {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match!', {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
      let tempAvatar;
      if (!formData.avatar) {
        tempAvatar = createAvatar();
      }
      const res = await signup({
        variables: {
          data: {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            avatar: {
              upload: formData.avatar || tempAvatar
            }
          }
        }
      });
      if (res.data?.createUser) {
        const res = await signin();
        if (res.data.authenticateUserWithPassword.item) {
          setUser(res.data.authenticateUserWithPassword.item);
        }
        router.push(url);
      }
    }
  }

  return (
    <>
      <Navbar />
      <PaddedContainer>
        <div css={styles.container}>
          <div css={styles.imagePart} style={{ backgroundColor: 'yellow', background: `url(/background.jpg) center no-repeat` }}></div>
          <div css={styles.part} style={{ borderLeft: '1px solid #E4E4E7', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div css={styles.navBrand}>
              {brandIcon}
              <span css={styles.navBrandText}>Exam Central</span>
            </div>
            <div css={styles.tabContainer}>
              <div css={signInForm ? styles.tabActive : styles.tab} style={{ minWidth: '100px' }} onClick={() => setSignInForm(true)}>
                Sign In
              </div>
              <div css={signInForm ? styles.tab : styles.tabActive} style={{ minWidth: '100px' }} onClick={() => setSignInForm(false)}>
                Register
              </div>
            </div>
            <div css={styles.formContainer}>
              <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', width: '70%' }}>
                {
                  !signInForm && <input type='test' name='name' placeholder='Name' css={styles.input} onChange={handleInputChange} />
                }
                <input type='email' name='email' placeholder='E-Mail' css={styles.input} onChange={handleInputChange} />
                <input type='password' name='password' placeholder='Password' css={styles.input} onChange={handleInputChange} />
                {
                  !signInForm && <input type='password' name='confirmPassword' placeholder='Confirm Password' css={styles.input} onChange={handleInputChange} />
                }
                {
                  !signInForm && <input type='file' name='avatar' css={styles.input} accept='image/png, image/jpeg' onChange={(e) => {
                    setFormData({
                      ...formData,
                      //@ts-ignore
                      'avatar': e.target.files[0]
                    })
                  }} />
                }
                <input type='submit' value={signInForm ? 'Sign In' : 'Register'} css={styles.submitInput} />
              </form>
            </div>
            {
              signInForm && (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <span style={{ fontWeight: 'bold', color: 'GrayText' }}>Forgot password?</span>
                </div>
              )
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
  }

  return {
    props: {
      user: currUser
    }
  }
}

export default SignIn;

import Link from 'next/link';
import xw from 'xwind';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import URLContext from '../utils/urlContext';

const styles = {
  container: xw`
    w-full
    flex
    flex-col
    bg-gray-100
    justify-center
    items-center
    font-bold
    text-lg
    tracking-wide
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
    whitespace-nowrap
    rounded
    bg-blue-500
    text-white
    font-bold
    cursor-pointer
  `,
};

const SignInRequired = () => {
  const { setUrl } = useContext(URLContext);
  const router = useRouter();
  return (
    <div css={styles.container} style={{ height: '92.5vh' }}>
      <span>
        You are not logged in.
      </span>
      <div
        css={styles.button}
        onClick={() => {
          setUrl(router.asPath);
        }}
        style={{ marginTop: '1rem' }}
      >
        <Link href='/signIn'>
          <a>Sign In</a>
        </Link>
      </div>
    </div>
  );
}

export default SignInRequired;

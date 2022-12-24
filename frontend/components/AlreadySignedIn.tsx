import { useEffect, useContext } from 'react';
import xw from 'xwind';

import URLContext from '../utils/urlContext';

const styles = {
  container: xw`
    w-full
    flex
    flex-col
    pt-20
    bg-gray-100
    justify-center
    items-center
    font-bold
    text-lg
    tracking-wide
    dark:bg-gray-900
    dark:text-white
  `
};

const AlreadySignedIn = () => {
  const { url } = useContext(URLContext);

  useEffect(() => {
    location.replace(url);
  }, []);

  return (
    <div css={styles.container} style={{ height: '92.5vh' }}>
      <span>
        You are already logged in.
      </span>
      <span>
        Redirecting to Home page.
      </span>
    </div>
  );
}

export default AlreadySignedIn;

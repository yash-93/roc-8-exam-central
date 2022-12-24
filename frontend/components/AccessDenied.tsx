import Link from 'next/link';
import xw from 'xwind';

const styles = {
  container: xw`
    w-screen
    h-screen
    flex
    flex-col
    justify-center
    items-center
  `,
  statusCode: xw`
    font-bold
    text-5xl
    md:text-7xl
  `,
  line: xw`
  tracking-wider
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
}

const AccessDenied = ({ code }:any) => {
  return (
    <div css={styles.container}>
      <div>
        <span css={styles.statusCode}>{code}</span>
      </div>
      <div style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <span css={styles.line}>{code === '401' ? 'Your are not authorized to access this page.' : 'This page does not exist.'}</span>
      </div>
      <div css={styles.button}>
        <Link href='/'>
          <a>Home</a>
        </Link>
      </div>
    </div>
  )
}

export default AccessDenied;

import xw from 'xwind';

const styles = {
  backdrop: xw`
    fixed
    top-0
    left-0
    w-full
    h-screen
    bg-black
    z-50
  `
}

interface PropTypes {
  children?: any;
  hide?: any;
  customStyles?: any;
}

const Backdrop = ({ children, hide, customStyles }: PropTypes) => {
  const cross = <svg
    style={{ width: '1.5rem', color: 'white', cursor: 'pointer' }}
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
    onClick={hide}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>

  return (
    <div css={styles.backdrop} onClick={hide} style={customStyles}>
      <div id='close' style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', paddingRight: '1rem' }}>
        {cross}
      </div>
      {children}
    </div>
  )
}

export default Backdrop;

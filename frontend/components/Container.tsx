import xw from 'xwind';

const styles = {
  container: xw`
    w-full
    flex
    flex-col
    justify-center
    items-center
    pt-20
    pb-20
  `
}

interface PropTypes {
  children?: any;
  customStyles?: any;
}

const Container = ({ children, customStyles }: PropTypes) => {
  return (
    <div css={styles.container} style={customStyles}>
      {children}
    </div>
  )
}

export default Container;

import xw from 'xwind';

const styles = {
  paddedContainer: xw`
    w-full
    px-8
    sm:px-16
    md:px-28
    xl:px-52
    2xl:px-96
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

const PaddedContainer = ({ children, customStyles }: PropTypes) => {
  return (
    <div css={styles.paddedContainer} style={customStyles}>
      {children}
    </div>
  )
}

export default PaddedContainer;

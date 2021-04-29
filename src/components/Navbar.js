import React from 'react';
import classes from '../styles/Navbar.module.scss';

const Navbar = () => {
  return (
    <div className={classes.navbar}>
      <div className={classes.navbar__title}>Crypto Arbitrage</div> 
    </div>
  );
};

export default Navbar;

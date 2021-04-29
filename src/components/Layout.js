import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import classes from '../styles/Layout.module.scss';

const Layout = ({ children }) => {
  return (
    <div className={classes.layout}>
      <Navbar />
      <main className={classes.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;

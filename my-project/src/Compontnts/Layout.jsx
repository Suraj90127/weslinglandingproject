import React from 'react';
import MobileFooter from "./MobileFooter";

const Layout = ({ children }) => {
  return (
    <>
      <div className="min-h-screen">
        {children}
      </div>
      <MobileFooter />
    </>
  );
};

export default Layout;
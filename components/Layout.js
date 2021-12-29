import React, { useState } from "react";
import SideNav from "./SideNav";
import Header from "./Header";

const Layout = ({ children, className, pageTitle, centerSlot, rightSlot }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <div className={`${className} min-h-full bg-white dark:bg-black`}>
        <SideNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* Main column */}
        <div className="lg:pl-64 flex flex-col">
          <Header
            centerSlot={centerSlot}
            setSidebarOpen={setSidebarOpen}
            pageTitle={pageTitle}
            rightSlot={rightSlot}
          />
          <main className="flex-1 bg-white dark:bg-black">{children}</main>
        </div>
      </div>
    </>
  );
};

export default Layout;

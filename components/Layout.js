import React, { useState } from "react";
import SideNav from "./SideNav";
import SearchHeader from "./SearchHeader";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <div className="min-h-full bg-white dark:bg-black">
        <SideNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* Main column */}
        <div className="lg:pl-64 flex flex-col">
          <SearchHeader setSidebarOpen={setSidebarOpen} />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </>
  );
};

export default Layout;

// import { Fragment, useState, useEffect } from "react";
import { MenuAlt1Icon } from "@heroicons/react/outline";

import RenderCurrentThemeChanger from "./RenderCurrentThemeChanger";

const Header = ({ setSidebarOpen, pageTitle, rightSlot }) => {
  return (
    <div className="sticky top-0 z-10 flex-shrink-0 flex items-center h-16 bg-white dark:bg-black border-b border-gray-200 dark:border-nftGray">
      <button
        type="button"
        className="px-4 border-r border-gray-200 dark:border-nftGray text-gray-500 focus:outline-none lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="min-w-0 pl-4 flex-1">
        <h1 className="text-lg font-medium leading-6 text-gray-900 dark:text-white sm:truncate">
          {pageTitle}
        </h1>
      </div>
      <div className="flex items-center space-x-3 px-4 sm:px-6 lg:px-8">
        <div>{rightSlot}</div>
        {RenderCurrentThemeChanger()}
      </div>
    </div>
  );
};

export default Header;

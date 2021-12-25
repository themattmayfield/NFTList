// import { Fragment, useState, useEffect } from "react";
import { MenuAlt1Icon } from "@heroicons/react/outline";
import { SearchIcon } from "@heroicons/react/solid";
import RenderCurrentThemeChanger from "./RenderCurrentThemeChanger";

const SearchHeader = ({ setSidebarOpen }) => {
  return (
    <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white dark:bg-black border-b border-gray-200 dark:border-nftGray lg:hidden">
      <button
        type="button"
        className="px-4 border-r border-gray-200 dark:border-nftGray text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="flex-1 flex justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex-1 flex">
          <form className="w-full flex md:ml-0" action="#" method="GET">
            <label htmlFor="search-field" className="sr-only">
              Search
            </label>
            <div className="relative w-full text-gray-400 focus-within:text-gray-600 ">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <input
                id="search-field"
                name="search-field"
                className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400 sm:text-sm dark:bg-black"
                placeholder="Search"
                type="search"
              />
            </div>
          </form>
        </div>
        <div className="flex items-center pl-3">
          {RenderCurrentThemeChanger()}
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;

import React from "react";
import RenderCurrentThemeChanger from "./RenderCurrentThemeChanger";
import Link from "next/link";

const Header = ({ title, share, create }) => (
  <div className="border-b border-gray-200 dark:border-nftGray bg-white dark:bg-black px-4 py-4 flex items-center justify-between sm:px-6 lg:px-8">
    <div className="flex-1 min-w-0">
      <h1 className="text-lg font-medium leading-6 text-gray-900 dark:text-white sm:truncate">
        {title}
      </h1>
    </div>
    <div className="flex sm:ml-4">
      {share ? (
        <button
          type="button"
          className="order-1 ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white dark:bg-nftGray dark:text-white dark:border-nftGray dark:hover:bg-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:order-0 sm:ml-0"
        >
          Share
        </button>
      ) : null}
      {create ? (
        <Link href="/create">
          <button
            type="button"
            className="order-0 inline-flex items-center px-4 py-2 border-2 border-nftGray shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-nftGray focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:order-1 sm:ml-3"
          >
            Create
          </button>
        </Link>
      ) : null}
    </div>
    <div className="hidden lg:block ml-3">{RenderCurrentThemeChanger()}</div>
  </div>
);

export default Header;

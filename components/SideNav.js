import { Fragment, useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  ClockIcon,
  HomeIcon,
  ViewListIcon,
  XIcon,
} from "@heroicons/react/outline";
import { SearchIcon, SelectorIcon } from "@heroicons/react/solid";
import MetaMaskLogo from "public/MetaMaskLogo.png";
import Image from "next/image";
import { Logo, GeneralTextClass } from "./PageUtils";

const navigation = [
  { name: "Home", href: "#", icon: HomeIcon, current: true },
  { name: "My tasks", href: "#", icon: ViewListIcon, current: false },
  { name: "Recent", href: "#", icon: ClockIcon, current: false },
];
const teams = [
  { name: "Engineering", href: "#", bgColorClass: "bg-indigo-500" },
  { name: "Human Resources", href: "#", bgColorClass: "bg-green-500" },
  { name: "Customer Success", href: "#", bgColorClass: "bg-yellow-500" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SideNav = ({ sidebarOpen, setSidebarOpen }) => {
  const { logout, user } = useMoralis();

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 flex z-40 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-min w-full pt-5 pb-4 bg-white dark:bg-black">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <NavGuts user={user} logout={logout} />
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <NavGuts desktop user={user} logout={logout} />
    </>
  );
};

export default SideNav;

const NavGuts = ({ user, desktop, logout }) => (
  <div
    className={`${
      desktop ? "hidden lg:flex" : "flex"
    }  flex-col w-64 fixed inset-y-0 dark:border-nftGray lg:border-r lg:border-gray-200 pt-5 pb-4 bg-gray-100 dark:bg-black`}
  >
    <div className="flex items-center flex-shrink-0 px-6">
      <Logo />
    </div>
    {/* Sidebar component, swap this element with another sidebar if you like */}
    <div className="mt-6 h-0 flex-1 flex flex-col overflow-y-auto">
      {/* User account dropdown */}
      <Menu as="div" className="px-3 relative inline-block text-left">
        <div>
          <Menu.Button className="group w-full bg-gray-100 dark:bg-nftGray hover:dark:bg-nftGray/70 rounded-md px-3.5 py-2 text-sm text-left font-medium text-gray-700 dark:text-white hover:bg-gray-200 focus:outline-none">
            <span className="flex w-full justify-between items-center">
              <span className="flex min-w-0 items-center justify-between space-x-3">
                <div className="relative w-10 h-10">
                  <Image
                    src={MetaMaskLogo}
                    alt="Picture of the author"
                    layout="fill"
                    objectFit="cover"
                    // width={500} automatically provided
                    // height={500} automatically provided
                    // blurDataURL="data:..." automatically provided
                    // placeholder="blur" // Optional blur-up while loading
                  />
                </div>
                <span className="flex-1 flex flex-col min-w-0">
                  <span className="text-gray-900 dark:text-white group-hover:text-gray-500 font-medium text-sm truncate">
                    {`${user?.attributes?.ethAddress.substring(
                      0,
                      5
                    )}...${user?.attributes?.ethAddress.substr(
                      user?.attributes?.ethAddress.length - 4
                    )}`}
                  </span>
                </span>
              </span>
              <SelectorIcon
                className="flex-shrink-0 h-5 w-5 text-gray-400 dark:text-white group-hover:text-gray-500"
                aria-hidden="true"
              />
            </span>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="z-10 mx-3 origin-top absolute right-0 left-0 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    View profile
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Settings
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Notifications
                  </a>
                )}
              </Menu.Item>
            </div>
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Support
                  </a>
                )}
              </Menu.Item>
            </div>
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    onClick={logout}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Logout
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      {/* Sidebar Search */}
      <div className="px-3 mt-5 ">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div
            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            aria-hidden="true"
          >
            <SearchIcon
              className="mr-3 h-4 w-4 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            className="focus:ring-indigo-500 dark:bg-nftGray focus:border-indigo-500 block w-full pl-9 sm:text-sm border-gray-300 rounded-md"
            placeholder="Search"
          />
        </div>
      </div>
      {/* Navigation */}
      <nav className="px-3 mt-6">
        <div className="space-y-1">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={classNames(
                item.current
                  ? "bg-gray-200 dark:bg-nftGray text-gray-900 dark:text-white"
                  : "text-gray-700 hover:text-gray-900 hover:dark:text-white hover:bg-gray-50 hover:dark:bg-nftGray/70",
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              )}
              aria-current={item.current ? "page" : undefined}
            >
              <item.icon
                className={classNames(
                  item.current
                    ? "text-gray-500"
                    : "text-gray-400 group-hover:text-gray-500",
                  "mr-3 flex-shrink-0 h-6 w-6"
                )}
                aria-hidden="true"
              />
              {item.name}
            </a>
          ))}
        </div>
      </nav>
    </div>
  </div>
);

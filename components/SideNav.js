import { Fragment, useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  ClockIcon,
  HomeIcon,
  ViewListIcon,
  XIcon,
} from "@heroicons/react/outline";
import { SelectorIcon } from "@heroicons/react/solid";
import MetaMaskLogo from "public/MetaMaskLogo.png";
import Image from "next/image";
import { Logo } from "./PageUtils";
import Link from "next/link";
import { useRouter } from "next/router";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "My tasks", href: "/tasks", icon: ViewListIcon },
  { name: "Recent", href: "/recent", icon: ClockIcon },
];

const menuItems = [
  {
    label: "Profile",
    href: "/",
  },
  {
    label: "Settings",
    href: "/settings",
  },
  {
    label: "Notifications",
    href: "/",
  },
  {
    label: "Support",
    href: "/",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SideNav = ({ sidebarOpen, setSidebarOpen }) => {
  const { logout, user } = useMoralis();
  const router = useRouter();

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
            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-100 dark:bg-black">
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
              <NavGuts user={user} logout={logout} router={router} />
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <NavGuts desktop user={user} logout={logout} router={router} />
    </>
  );
};

export default SideNav;

const NavGuts = ({ user, desktop, logout, router }) => (
  <div
    className={`${
      desktop ? "hidden lg:flex" : "flex"
    }  flex-col w-full relative lg:w-64 lg:fixed inset-y-0 dark:border-nftGray lg:border-r lg:border-gray-200 pt-5 pb-4 `}
  >
    <div className="flex items-center flex-shrink-0 px-6">
      <Logo />
    </div>
    {/* Sidebar component, swap this element with another sidebar if you like */}
    <div className="mt-6 h-0 flex-1 flex flex-col">
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
          <Menu.Items className="z-10 mx-3 origin-top absolute right-0 left-0 mt-1 rounded-md shadow-lg bg-white dark:bg-black ring-1 ring-black dark:ring-nftGray ring-opacity-5 divide-y divide-gray-200 dark:divide-nftGray focus:outline-none">
            <div className="py-1">
              {[
                ...menuItems.map((item, itemIndex) => (
                  <Link href={item.href} key={itemIndex}>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          className={classNames(
                            active
                              ? "bg-gray-100 dark:bg-nftGray text-gray-900"
                              : "text-gray-700 ",
                            "block px-4 py-2 text-sm dark:text-white cursor-pointer"
                          )}
                        >
                          {item?.label}
                        </a>
                      )}
                    </Menu.Item>
                  </Link>
                )),
              ]}
            </div>

            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    onClick={logout}
                    className={classNames(
                      active
                        ? "bg-gray-100 dark:bg-nftGray text-gray-900"
                        : "text-gray-700",
                      "block px-4 py-2 text-sm dark:text-white"
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

      {/* Navigation */}
      <nav className="px-3 mt-5">
        <div className="space-y-1">
          {navigation.map((item, idx) => (
            <Link href={item.href} key={idx}>
              <a
                key={item.name}
                className={classNames(
                  item.href === router.asPath
                    ? "bg-gray-200 dark:bg-nftGray text-gray-900 dark:text-white"
                    : "text-gray-700 dark:text-gray-500 hover:text-gray-900 hover:dark:text-white hover:bg-gray-50 hover:dark:bg-nftGray/70",
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                )}
                aria-current={item.href === router.asPath ? "page" : undefined}
              >
                <item.icon
                  className="mr-3 flex-shrink-0 h-6 w-6"
                  aria-hidden="true"
                />
                {item.name}
              </a>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  </div>
);

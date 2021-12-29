import { useMoralis } from "react-moralis";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { projects } from "components/DUMMY_DATA";
import { ChevronRightIcon, DotsVerticalIcon } from "@heroicons/react/solid";
import Layout from "components/Layout";
import Link from "next/link";

const pinnedProjects = projects.filter((project) => project.pinned);

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dashboard() {
  const { user } = useMoralis();
  console.log(user);
  return (
    <>
      <Layout pageTitle="Dashboard" rightSlot={<RightSlot />}>
        <RecentProjects />

        {/* Projects list (only on smallest breakpoint) */}
        <ProjectList />

        {/* Projects table (small breakpoint and up) */}
        <ProjectTable />
      </Layout>
    </>
  );
}

const RecentProjects = () => (
  <div className="px-4 mt-6 sm:px-6 lg:px-8">
    <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
      Pinned Projects
    </h2>
    <ul
      role="list"
      className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4 mt-3"
    >
      {pinnedProjects.map((project) => (
        <li
          key={project.id}
          className="relative col-span-1 flex shadow-sm rounded-md"
        >
          <div
            className={classNames(
              project.bgColorClass,
              "flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md"
            )}
          >
            {project.initials}
          </div>
          <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 dark:border-nftGray bg-white dark:bg-black rounded-r-md truncate">
            <div className="flex-1 px-4 py-2 text-sm truncate">
              <a
                href="#"
                className="text-gray-900 dark:text-white font-medium hover:text-gray-600"
              >
                {project.title}
              </a>
              <p className="text-gray-500">{project.totalMembers} Members</p>
            </div>
            <Menu as="div" className="flex-shrink-0 pr-2">
              <Menu.Button className="w-8 h-8 inline-flex items-center justify-center text-gray-400 rounded-full hover:text-gray-500 focus:outline-none">
                <span className="sr-only">Open options</span>
                <DotsVerticalIcon className="w-5 h-5" aria-hidden="true" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="z-10 mx-3 origin-top-right absolute right-10 top-3 w-48 mt-1 rounded-md shadow-lg bg-white dark:bg-black dark:border dark:border-nftGray ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 dark:divide-nftGray focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? "bg-gray-100 dark:bg-nftGray text-gray-900 dark:text-white"
                              : "text-gray-700 dark:text-white",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          View
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
                            active
                              ? "bg-gray-100 dark:bg-nftGray text-gray-900 dark:text-white"
                              : "text-gray-700 dark:text-white",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          Removed from pinned
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? "bg-gray-100 dark:bg-nftGray text-gray-900 dark:text-white"
                              : "text-gray-700 dark:text-white",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          Share
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const ProjectList = () => (
  <div className="mt-10 sm:hidden">
    <div className="px-4 sm:px-6">
      <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
        Projects
      </h2>
    </div>
    <ul
      role="list"
      className="mt-3 border-t border-gray-200 divide-y divide-gray-100"
    >
      {projects.map((project) => (
        <li key={project.id}>
          <a
            href="#"
            className="group flex items-center justify-between px-4 py-4 hover:bg-gray-50 sm:px-6"
          >
            <span className="flex items-center truncate space-x-3">
              <span
                className={classNames(
                  project.bgColorClass,
                  "w-2.5 h-2.5 flex-shrink-0 rounded-full"
                )}
                aria-hidden="true"
              />
              <span className="font-medium truncate text-sm leading-6">
                {project.title}{" "}
                <span className="truncate font-normal text-gray-500">
                  in {project.team}
                </span>
              </span>
            </span>
            <ChevronRightIcon
              className="ml-4 h-5 w-5 text-gray-400 group-hover:text-gray-500"
              aria-hidden="true"
            />
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const ProjectTable = () => (
  <div className="hidden mt-8 sm:block">
    <div className="align-middle inline-block min-w-full border-b border-gray-200 dark:border-nftGray">
      <table className="min-w-full">
        <thead>
          <tr className="border-t border-gray-200 dark:border-nftGray">
            <th className="px-6 py-3 border-b border-gray-200 dark:border-nftGray bg-gray-50 dark:bg-nftGray text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span className="lg:pl-2">Project</span>
            </th>
            <th className="px-6 py-3 border-b border-gray-200 dark:border-nftGray bg-gray-50 dark:bg-nftGray text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Members
            </th>
            <th className="hidden md:table-cell px-6 py-3 border-b border-gray-200 dark:border-nftGray bg-gray-50 dark:bg-nftGray text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last updated
            </th>
            <th className="pr-6 py-3 border-b border-gray-200 bg-gray-50 dark:border-nftGray dark:bg-nftGray text-right text-xs font-medium text-gray-500 uppercase tracking-wider" />
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-black divide-y divide-gray-100 dark:divide-nftGray">
          {projects.map((project) => (
            <tr key={project.id}>
              <td className="px-6 py-3 max-w-0 w-full whitespace-nowrap text-sm font-medium text-gray-900">
                <div className="flex items-center space-x-3 lg:pl-2">
                  <div
                    className={classNames(
                      project.bgColorClass,
                      "flex-shrink-0 w-2.5 h-2.5 rounded-full"
                    )}
                    aria-hidden="true"
                  />
                  <a
                    href="#"
                    className="truncate hover:text-gray-600 dark:text-white"
                  >
                    <span>
                      {project.title}{" "}
                      <span className="text-gray-500 font-normal">
                        in {project.team}
                      </span>
                    </span>
                  </a>
                </div>
              </td>
              <td className="px-6 py-3 text-sm text-gray-500 font-medium">
                <div className="flex items-center space-x-2">
                  {project.totalMembers > project.members.length ? (
                    <span className="flex-shrink-0 text-xs leading-5 font-medium">
                      +{project.totalMembers - project.members.length}
                    </span>
                  ) : null}
                </div>
              </td>
              <td className="hidden md:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                {project.lastUpdated}
              </td>
              <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                <a href="#" className="text-indigo-600 hover:text-indigo-900">
                  Edit
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const RightSlot = () => (
  <Link href="/create">
    <button
      type="button"
      className="order-0 inline-flex items-center px-4 py-2 border-2 border-nftGray shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-nftGray focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:order-1 sm:ml-3"
    >
      Create
    </button>
  </Link>
);

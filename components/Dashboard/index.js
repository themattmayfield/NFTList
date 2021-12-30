import { useMoralis } from "react-moralis";
import { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
// import { projects } from "components/DUMMY_DATA";
import { ChevronRightIcon, DotsVerticalIcon } from "@heroicons/react/solid";
import Layout from "components/Layout";
import Link from "next/link";
import getInitials from "lib/getInitials";
import EmptyProjects from "./EmptyProjects";
import pluralize from "pluralize";
import { classNames } from "components/PageUtils";
import { BsPinAngle, BsPinAngleFill } from "react-icons/bs";
import _ from "lodash";
import { useRouter } from "next/router";

export default function Dashboard() {
  const { user, Moralis } = useMoralis();
  const router = useRouter();

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    user && fetchProjects();
  }, [user]);

  const pinnedProjects = projects.filter((project) => project.pinned);

  const fetchProjects = async () => {
    try {
      const Projects = Moralis.Object.extend("Projects");
      const query = new Moralis.Query(Projects);
      query.equalTo("user", user.id);
      const results = await query.find();
      const formattedResults = results.map((item) => ({
        id: item.id,
        ...item.attributes,
      }));

      setProjects(formattedResults);
    } catch (error) {
      //TODO
      //TOast
      console.log(error);
    }
  };

  const handlePin = async (type, id) => {
    try {
      console.log(id);
      const Projects = Moralis.Object.extend("Projects");
      const query = new Moralis.Query(Projects);
      query.equalTo("user", user.id);
      query.equalTo("objectId", id);
      const results = await query.first();

      const updatedProject = await results.save({
        pinned: type === "pin" ? true : false,
      });
      const { updatedAt } = updatedProject.attributes;
      console.log(updatedAt);
      setProjects(
        projects.map((item) =>
          item.id === id
            ? { ...item, pinned: !item.pinned, updatedAt: updatedAt }
            : item
        )
      );
    } catch (error) {
      // TODO
      // Toast with error message.
      console.log(error);
    }
  };

  return (
    <>
      <Layout pageTitle="Dashboard" rightSlot={<RightSlot />}>
        {!projects.length ? (
          <div className="pt-12">
            <EmptyProjects />
          </div>
        ) : (
          <>
            <RecentProjects
              router={router}
              projects={projects}
              pinnedProjects={pinnedProjects}
              handlePin={handlePin}
            />

            {/* Projects list (only on smallest breakpoint) */}
            <ProjectList
              projects={projects}
              router={router}
              handlePin={handlePin}
            />

            {/* Projects table (small breakpoint and up) */}
            <ProjectTable
              projects={projects}
              router={router}
              handlePin={handlePin}
            />
          </>
        )}
      </Layout>
    </>
  );
}

const RecentProjects = ({ pinnedProjects, handlePin, router }) => (
  <div className="px-4 mt-6 sm:px-6 lg:px-8">
    <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
      Pinned Projects
    </h2>
    <ul
      role="list"
      className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4 mt-3"
    >
      {_.orderBy(pinnedProjects, ["updatedAt"], ["desc"]).map((project) => (
        <li
          key={project.id}
          className="relative col-span-1 flex shadow-sm rounded-md"
        >
          <div
            style={{ backgroundColor: project.backgroundColor }}
            className={classNames(
              "flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md"
            )}
          >
            {getInitials(project.projectName)}
          </div>
          <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 dark:border-nftGray bg-white dark:bg-black rounded-r-md truncate">
            <div className="flex-1 px-4 py-2 text-sm truncate">
              <a
                href="#"
                className="text-gray-900 dark:text-white font-medium hover:text-gray-600"
              >
                {project.projectName}
              </a>
              <p className="text-gray-500">
                {pluralize("Member", project.members.length, true)}
              </p>
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
                          onClick={() => handlePin("unpin", project.id)}
                          className={classNames(
                            active
                              ? "bg-gray-100 dark:bg-nftGray text-gray-900 dark:text-white"
                              : "text-gray-700 dark:text-white",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          Remove from pinned
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

const ProjectList = ({ projects, handlePin, router }) => (
  <div className="mt-10 sm:hidden">
    <div className="px-4 sm:px-6">
      <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
        Projects
      </h2>
    </div>
    <ul
      role="list"
      className="mt-3 border-t border-gray-200 dark:border-nftGray divide-y divide-gray-100 dark:divide-nftGray"
    >
      {_.orderBy(projects, ["pinned", "updatedAt"], ["desc", "desc"]).map(
        (project) => (
          <li
            onClick={() => router.push(`projectDetails/${project.id}`)}
            key={project.id}
          >
            <a
              href="#"
              className="group flex items-center justify-between px-4 py-4 hover:bg-gray-50 dark:hover:bg-nftGray sm:px-6"
            >
              <span className="flex items-center truncate space-x-3">
                <span aria-hidden="true">
                  {project.pinned ? (
                    <BsPinAngleFill
                      onClick={() => handlePin("unpin", project.id)}
                      className="text-black dark:text-white cursor-pointer"
                    />
                  ) : (
                    <BsPinAngle
                      onClick={() => handlePin("pin", project.id)}
                      className="text-black dark:text-white cursor-pointer"
                    />
                  )}
                </span>
                <span className="font-medium truncate text-sm leading-6">
                  {project.projectName}
                </span>
              </span>
              <ChevronRightIcon
                className="ml-4 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
            </a>
          </li>
        )
      )}
    </ul>
  </div>
);

const ProjectTable = ({ projects, handlePin, router }) => (
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
          {_.orderBy(projects, ["pinned", "updatedAt"], ["desc", "desc"]).map(
            (project) => (
              <tr key={project.id}>
                <td className="px-6 py-3 max-w-0 w-full whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center space-x-3">
                    {project.pinned ? (
                      <BsPinAngleFill
                        onClick={() => handlePin("unpin", project.id)}
                        className="text-black dark:text-white text-base cursor-pointer"
                      />
                    ) : (
                      <BsPinAngle
                        onClick={() => handlePin("pin", project.id)}
                        className="text-black dark:text-white text-base cursor-pointer"
                      />
                    )}
                    <a
                      href="#"
                      className="truncate hover:text-gray-600 dark:text-white"
                    >
                      <span>{project.projectName}</span>
                    </a>
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-gray-500 font-medium">
                  <div className="flex items-center space-x-2">
                    <span className="flex-shrink-0 text-xs leading-5 font-medium">
                      +{project.members.length}
                    </span>
                  </div>
                </td>
                <td className="hidden md:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                  {project.lastUpdated}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <a href="#" className="text-indigo-600 hover:text-indigo-900">
                    View
                  </a>
                </td>
              </tr>
            )
          )}
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

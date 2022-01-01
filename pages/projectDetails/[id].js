import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Layout from "components/Layout";
import {
  classNames,
  CustomButton,
  RedButton,
  DarkButton,
} from "components/PageUtils";
import {
  FilterIcon,
  PencilIcon,
  TrashIcon,
  SearchIcon,
  EyeIcon,
} from "@heroicons/react/solid";
import Loading from "components/Loading";
import _ from "lodash";
import NoProject from "components/ProjectDetails/NoProject";
import useToast from "lib/useToast";
import DeleteModal from "components/DeleteModal";
import { Tab } from "@headlessui/react";
import { wallets } from "components/DUMMY_DATA";

const walletsFormatted = _.groupBy(wallets, "address[0]");
const tabs = [
  { name: "Info", href: "#", current: true },
  { name: "Members", href: "#", current: false },
];

const directory = {
  A: [
    {
      id: 1,
      name: "Leslie Abbott",
      role: "Co-Founder / CEO",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      id: 2,
      name: "Hector Adams",
      role: "VP, Marketing",
      imageUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      id: 3,
      name: "Blake Alexander",
      role: "Account Coordinator",
      imageUrl:
        "https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      id: 4,
      name: "Fabricio Andrews",
      role: "Senior Art Director",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  ],
  B: [
    {
      id: 5,
      name: "Angela Beaver",
      role: "Chief Strategy Officer",
      imageUrl:
        "https://images.unsplash.com/photo-1501031170107-cfd33f0cbdcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      id: 6,
      name: "Yvette Blanchard",
      role: "Studio Artist",
      imageUrl:
        "https://images.unsplash.com/photo-1506980595904-70325b7fdd90?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      id: 7,
      name: "Lawrence Brooks",
      role: "Content Specialist",
      imageUrl:
        "https://images.unsplash.com/photo-1513910367299-bce8d8a0ebf6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  ],
  C: [
    {
      id: 8,
      name: "Jeffrey Clark",
      role: "Senior Art Director",
      imageUrl:
        "https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      id: 9,
      name: "Kathryn Cooper",
      role: "Associate Creative Director",
      imageUrl:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  ],
  E: [
    {
      id: 10,
      name: "Alicia Edwards",
      role: "Junior Copywriter",
      imageUrl:
        "https://images.unsplash.com/photo-1509783236416-c9ad59bae472?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      id: 11,
      name: "Benjamin Emerson",
      role: "Director, Print Operations",
      imageUrl:
        "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      id: 12,
      name: "Jillian Erics",
      role: "Designer",
      imageUrl:
        "https://images.unsplash.com/photo-1504703395950-b89145a5425b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      id: 13,
      name: "Chelsea Evans",
      role: "Human Resources Manager",
      imageUrl:
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  ],
  G: [
    {
      id: 14,
      name: "Michael Gillard",
      role: "Co-Founder / CTO",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      id: 15,
      name: "Dries Giuessepe",
      role: "Manager, Business Relations",
      imageUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  ],
  M: [
    {
      id: 16,
      name: "Jenny Harrison",
      role: "Studio Artist",
      imageUrl:
        "https://images.unsplash.com/photo-1507101105822-7472b28e22ac?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      id: 17,
      name: "Lindsay Hatley",
      role: "Front-end Developer",
      imageUrl:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      id: 18,
      name: "Anna Hill",
      role: "Partner, Creative",
      imageUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  ],
  S: [
    {
      id: 19,
      name: "Courtney Samuels",
      role: "Designer",
      imageUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      id: 20,
      name: "Tom Simpson",
      role: "Director, Product Development",
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  ],
  T: [
    {
      id: 21,
      name: "Floyd Thompson",
      role: "Principal Designer",
      imageUrl:
        "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      id: 22,
      name: "Leonard Timmons",
      role: "Senior Designer",
      imageUrl:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      id: 23,
      name: "Whitney Trudeau",
      role: "Copywriter",
      imageUrl:
        "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  ],
  W: [
    {
      id: 24,
      name: "Kristin Watson",
      role: "VP, Human Resources",
      imageUrl:
        "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      id: 25,
      name: "Emily Wilson",
      role: "VP, User Experience",
      imageUrl:
        "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  ],
  Y: [
    {
      id: 26,
      name: "Emma Young",
      role: "Senior Front-end Developer",
      imageUrl:
        "https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  ],
};

const ProjectDetails = () => {
  const { user, Moralis } = useMoralis();
  const router = useRouter();
  const { id } = router.query;

  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(true);

  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);

  useEffect(async () => {
    if (id) {
      try {
        const Whitelists = Moralis.Object.extend("Whitelists");
        const query = new Moralis.Query(Whitelists);
        query.equalTo("user", user.id);
        query.equalTo("objectId", id);
        const result = await query.first();
        console.log(result);
        const formattedProject = {
          id: result.id,
          ...result.attributes,
        };
        console.log(formattedProject);
        setProject(formattedProject);
      } catch (error) {
        useToast({ type: "error", message: error.message });
      } finally {
        setLoading(false);
      }
    }
  }, [id]);

  const deleteProject = async () => {
    try {
      const Whitelists = Moralis.Object.extend("Whitelists");
      const query = new Moralis.Query(Whitelists);
      query.equalTo("user", user.id);
      query.equalTo("objectId", id);
      const object = await query.first();

      await object.destroy();
      useToast({ type: "success", message: "Project Deleted" });
      router.push("/");
    } catch (error) {
      setShowDeleteProjectModal(false);
      useToast({ type: "error", message: error.message });
    }
  };

  const profile = {
    about: project?.about,
    fields: {
      "Project Name": project?.projectName,
      Website: project?.website,
      "Whitelist Limit": project?.whitelistLimit,
      Public: JSON.stringify(project?.isPublic),
      "Display Name": project?.displayName,
      "Redirect Url": project?.redirect,

      "Project Background Color": project?.backgroundColor,
      "Project Text Color": project?.textColor,
      "Receive Notifications For Signups": JSON.stringify(
        project?.notifications?.signups
      ),
    },
  };

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (_.isEmpty(project)) {
    return (
      <Layout>
        <NoProject />
      </Layout>
    );
  }
  return (
    <Layout>
      <>
        <DeleteModal
          open={showDeleteProjectModal}
          setOpen={setShowDeleteProjectModal}
          action={() => deleteProject()}
          cancel={() => setShowDeleteProjectModal(false)}
          title="Delete Project"
          description="Are you sure you want to permenantly delete this project? All of
          your data will be permanently removed. This action
          cannot be undone."
          actionText="Delete"
        />
        <div className="h-full flex">
          <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
            <div className="flex-1 relative z-0 flex overflow-hidden">
              <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last">
                <article className="pb-12">
                  {/* Profile header */}
                  {(project?.headerPhoto?._url && project?.default?._url && (
                    <HeaderDefault router={router} project={project} />
                  )) ||
                    (project?.headerPhoto?._url && !project?.default?._url && (
                      <HeaderOnly router={router} project={project} />
                    )) ||
                    (!project?.headerPhoto?._url && project?.default?._url && (
                      <DefaultOnly router={router} project={project} />
                    )) || <HeaderOnly router={router} project={project} />}
                  <Tab.Group>
                    {/* Tabs */}
                    <div className="mt-6 sm:mt-2 2xl:mt-5">
                      <div className="border-b border-gray-200 dark:border-nftGray">
                        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                          <Tab.List
                            className="-mb-px flex space-x-8"
                            aria-label="Tabs"
                          >
                            {tabs.map((tab) => (
                              <Tab
                                key={tab.name}
                                // href={tab.href}
                                className={({ selected }) =>
                                  classNames(
                                    selected
                                      ? "border-indigo-600 text-gray-900 dark:text-white"
                                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                                    "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                                  )
                                }
                                aria-current={({ selected }) =>
                                  selected ? "page" : undefined
                                }
                              >
                                {tab.name}
                              </Tab>
                            ))}
                          </Tab.List>
                        </div>
                      </div>
                    </div>

                    {/* Description list */}
                    <Tab.Panel>
                      <div className="mt-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                          {Object.keys(profile.fields).map((field) => (
                            <div key={field} className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500 dark:text-white">
                                {field}
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-500">
                                {profile.fields[field]}
                              </dd>
                            </div>
                          ))}
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500 dark:text-white">
                              About
                            </dt>
                            <dd
                              className="mt-1 max-w-prose text-sm text-gray-900 dark:text-gray-500 space-y-5"
                              dangerouslySetInnerHTML={{
                                __html: profile.about,
                              }}
                            />
                          </div>
                        </dl>
                      </div>

                      {/* Delete Project Button */}
                      <div className="pt-6 px-4 sm:px-6 lg:px-8 text-right border-t border-gray-200 dark:border-nftGray mt-6">
                        <RedButton
                          action={() => setShowDeleteProjectModal(true)}
                          text="Permenantly Delete Project"
                        />
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>
                      <Directory />
                    </Tab.Panel>
                  </Tab.Group>
                </article>
              </main>
            </div>
          </div>
        </div>
      </>
    </Layout>
  );
};

export default ProjectDetails;

const HeaderDefault = ({ project, router }) => (
  <div>
    <div>
      <img
        className="h-32 w-full object-cover lg:h-48"
        src={project?.headerPhoto?._url}
        alt=""
      />
    </div>

    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className={`-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5`}>
        <div className="flex">
          <img
            className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32 object-cover"
            src={project?.default?._url}
            alt=""
          />
        </div>

        <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
          <div className="sm:hidden 2xl:block mt-6 min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
              {project.projectName}
            </h1>
          </div>
          <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
            <CustomButton
              text="Edit"
              icon={<PencilIcon />}
              action={() => router.push(`/create?id=${project.id}`)}
            />

            <DarkButton text="Preview Website" icon={<EyeIcon />} />
          </div>
        </div>
      </div>
      <div className="hidden sm:block 2xl:hidden mt-6 min-w-0 flex-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
          {project.projectName}
        </h1>
      </div>
    </div>
  </div>
);

const HeaderOnly = ({ project, router }) => (
  <div>
    <div>
      <img
        className="h-32 w-full object-cover lg:h-48"
        src={project?.headerPhoto?._url}
        alt=""
      />
    </div>

    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
        <div className="2xl:block mt-6 min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
            {project.projectName}
          </h1>
        </div>
        <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
          <CustomButton
            text="Edit"
            icon={<PencilIcon />}
            action={() => router.push(`/create?id=${project.id}`)}
          />
          <DarkButton text="Preview Website" icon={<EyeIcon />} />
        </div>
      </div>
    </div>
  </div>
);

const DefaultOnly = ({ project, router }) => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className={`pt-4 sm:flex items-center sm:space-x-5`}>
      <div className="flex">
        <img
          className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32 object-cover"
          src={project?.default?._url}
          alt=""
        />
      </div>

      <div className="sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 ">
        <div className="sm:hidden 2xl:block mt-6 min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
            {project.projectName}
          </h1>
        </div>
        <div className="mt-6 sm:mt-0 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
          <CustomButton
            text="Edit"
            icon={<PencilIcon />}
            action={() => router.push(`/create?id=${project.id}`)}
          />
          <DarkButton text="Preview Website" icon={<EyeIcon />} />
        </div>
      </div>
    </div>
    <div className="hidden sm:block 2xl:hidden mt-6 min-w-0 flex-1">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
        {project.projectName}
      </h1>
    </div>
  </div>
);

const Directory = () => (
  <aside className="flex flex-col flex-shrink-0 w-full border-r border-gray-200">
    <div className="px-6 pt-6 pb-4">
      <p className="mt-1 text-sm text-gray-600">Search 3,018 members</p>
      <form className="mt-6 flex space-x-4" action="#">
        <div className="flex-1 min-w-0">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              type="search"
              name="search"
              id="search"
              className="focus:ring-pink-500 focus:border-pink-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search"
            />
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex justify-center px-3.5 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          <FilterIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          <span className="sr-only">Search</span>
        </button>
      </form>
    </div>
    {/* Directory list */}
    <nav className="flex-1 min-h-0 overflow-y-auto" aria-label="Directory">
      {Object.keys(walletsFormatted).map((letter) => (
        <div key={letter} className="relative">
          <div className="z-10 sticky top-0 border-t border-b border-gray-200 bg-gray-50 px-6 py-1 text-sm font-medium text-gray-500">
            <h3>{letter}</h3>
          </div>
          <ul role="list" className="relative z-0 divide-y divide-gray-200">
            {walletsFormatted[letter].map((wallet, idx) => (
              <li key={idx}>
                <div className="relative px-6 py-5 flex items-center space-x-3 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-pink-500">
                  {/* <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={person.imageUrl}
                      alt=""
                    />
                  </div> */}
                  <div className="flex-1 min-w-0">
                    <a
                      onClick={() => null}
                      className="focus:outline-none cursor-pointer"
                    >
                      {/* Extend touch target to entire panel */}
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-sm font-medium text-gray-900">
                        {wallet.address}
                      </p>
                      {/* <p className="text-sm text-gray-500 truncate">
                        {person.role}
                      </p> */}
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  </aside>
);

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Layout from "components/Layout";
import {
  classNames,
  CustomButton,
  RedButton,
  DarkButton,
  CustomSearch,
  CustomInput,
} from "components/PageUtils";
import { PencilIcon, EyeIcon } from "@heroicons/react/solid";
import numeral from "numeral";
import Loading from "components/Loading";
import _ from "lodash";
import NoProject from "components/ProjectDetails/NoProject";
import useToast from "lib/useToast";
import DeleteModal from "components/DeleteModal";
import { Tab } from "@headlessui/react";
// import { wallets } from "components/DUMMY_DATA";

const tabs = [
  { name: "Info", href: "#", current: true },
  { name: "Members", href: "#", current: false },
];

const ProjectDetails = () => {
  const { user, Moralis } = useMoralis();
  const router = useRouter();
  const { id } = router.query;

  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState([]);
  const [searchTerm, setSearchTerm] = useState([]);
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);
  const [walletInput, setWalletInput] = useState("");

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

  const filter = (e) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      const results = project.members.filter((member) => {
        return member.address
          .toString()
          .toLowerCase()
          .startsWith(keyword.toLowerCase());
      });
      setFound(results);
    } else {
      setFound([]);
      // If the text field is empty, show all users
    }

    setSearchTerm(keyword);
  };

  const addWallet = () => {
    alert(walletInput);
  };

  const profile = {
    about: project?.about || "N/A",
    fields: {
      "Project Name": project?.projectName,
      Website: project?.website || "N/A",
      "Whitelist Limit":
        numeral(project?.whitelistLimit || 0).format("0,0") || "N/A",
      Public: JSON.stringify(project?.isPublic) || "N/A",
      "Display Name": project?.displayName || "N/A",
      "Redirect Url": project?.redirect || "N/A",

      "Project Background Color": (
        <div
          style={{ backgroundColor: project?.backgroundColor }}
          className="w-6 h-6 flex items-center justify-center"
        />
      ),
      "Project Text Color": (
        <div
          style={{
            backgroundColor:
              project?.textColor === "#000000" ||
              project?.textColor === "#ffffff"
                ? null
                : project?.textColor,
          }}
          className="w-6 h-6 flex items-center justify-center"
        >
          {project?.textColor === "#000000" ? "black" : null}
          {project?.textColor === "#ffffff" ? "white" : null}
        </div>
      ),
      "Receive Notifications For Signups": JSON.stringify(
        project?.notifications?.signups
      ),
    },
  };

  const walletsFormatted = _.groupBy(found, "address[0]");

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
    <Layout pageTitle="Project View">
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

                    {/* Info */}
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

                    {/* Members */}
                    <Tab.Panel>
                      {project?.members?.length ? (
                        <Directory
                          walletsFormatted={walletsFormatted}
                          filter={filter}
                          searchTerm={searchTerm}
                          memberCount={project.members.length}
                          addWallet={addWallet}
                          walletInput={walletInput}
                          setWalletInput={setWalletInput}
                        />
                      ) : (
                        <AddWalletComponent
                          addWallet={addWallet}
                          walletInput={walletInput}
                          setWalletInput={setWalletInput}
                        />
                      )}
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
    {project?.headerPhoto?._url ? (
      <div>
        <img
          className="h-32 w-full object-cover lg:h-48"
          src={project?.headerPhoto?._url}
          alt=""
        />
      </div>
    ) : null}

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

const AddWalletComponent = ({ addWallet, walletInput, setWalletInput }) => (
  <div className="max-w-xl space-y-2 mt-6 px-4 sm:px-6 lg:px-8 sm:flex sm:space-y-0 sm:space-x-2 items-end w-full">
    <div className="flex-1">
      <CustomInput
        htmlFor="addWallet"
        label="Add Wallet"
        type="text"
        name="addWallet"
        id="addWallet"
        value={walletInput}
        onChange={(e) => setWalletInput(e.target.value)}
      />
    </div>
    <CustomButton text="Add Wallet" action={addWallet} />
  </div>
);

const Directory = ({
  walletsFormatted,
  filter,
  searchTerm,
  memberCount,
  setWalletInput,
  walletInput,
  addWallet,
}) => (
  <aside className="flex flex-col flex-shrink-0 w-full border-r border-gray-200">
    <div className="px-6 pt-6 pb-4">
      <p className="mt-1 text-sm text-gray-600">
        Search {numeral(memberCount).format("0,0")} members
      </p>
      <form className="mt-6 flex space-x-4" action="#">
        <CustomSearch
          placeholder="Search wallet address"
          value={searchTerm}
          onChange={filter}
        />
      </form>
    </div>
    {/* Directory list */}
    <nav className="flex-1 min-h-0 overflow-y-auto" aria-label="Directory">
      {Object.keys(walletsFormatted).length ? (
        Object.keys(walletsFormatted).map((letter) => (
          <div key={letter} className="relative">
            <div className="z-10 sticky top-0 border-t border-b border-gray-200 dark:border-nftGray bg-gray-50 dark:bg-nftGray px-6 py-1 text-sm font-medium text-gray-500">
              <h3>{letter}</h3>
            </div>
            <ul
              role="list"
              className="relative z-0 divide-y divide-gray-200 dark:divide-nftGray"
            >
              {walletsFormatted[letter].map((wallet, idx) => (
                <li key={idx}>
                  <div className="relative px-6 py-5 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-nftGray focus-within:ring-2 focus-within:ring-inset focus-within:ring-pink-500">
                    <div className="flex-1 min-w-0">
                      <a
                        onClick={() => null}
                        className="focus:outline-none cursor-pointer"
                      >
                        {/* Extend touch target to entire panel */}
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {wallet.address}
                        </p>
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <div className="pb-2">
          <AddWalletComponent
            addWallet={addWallet}
            walletInput={walletInput}
            setWalletInput={setWalletInput}
          />
        </div>
      )}
    </nav>
  </aside>
);

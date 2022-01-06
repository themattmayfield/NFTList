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
import { ChevronLeftIcon } from "@heroicons/react/solid";
import Link from "next/link";

const ProjectDetails = () => {
  const { user, Moralis } = useMoralis();
  const router = useRouter();
  const { id } = router.query;

  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(true);
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
    <div
      style={{
        backgroundColor: project.backgroundColor,
        color: project.textColor,
      }}
      className="flex flex-col h-full"
    >
      <PreviewMode />

      <div className="px-6 flex-1">
        <DisplayName name={project?.displayName} />
        <MainGrid>
          {/* col1 */}
          <div>
            <img
              className=" max-w-3xl mx-auto w-full object-cover"
              src={project?.headerPhoto?._url}
              alt=""
            />
          </div>

          {/* col2 */}
          <div className="text-center flex flex-col justify-center space-y-8 max-w-xl">
            <p className="text-xl">{project.about}</p>
            <button className="text-white font-black text-lg w-full mx-auto bg-blue-600 py-7 rounded-full ">
              Connect Metamask
            </button>
          </div>
        </MainGrid>
      </div>
      <Plug />
    </div>
  );
};

export default ProjectDetails;

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
    <CustomButton
      disabled={!walletInput.length}
      text="Add Wallet"
      action={addWallet}
    />
  </div>
);

const DisplayName = ({ name }) => (
  <p className="text-center text-wrap text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black mt-6 p-3 top-0">
    {name}
  </p>
);

const PreviewMode = () => {
  const router = useRouter();
  return (
    <div
      href="#"
      className="px-4 sm:px-12 text-sm font-medium flex-shrink-0 flex items-center h-6 bg-white dark:bg-black border-b border-gray-200 dark:border-nftGray justify-between"
    >
      <a
        className="hover:text-indigo-500 transition duration-300 ease-in-out flex cursor-pointer"
        onClick={() => router.back()}
      >
        <ChevronLeftIcon
          className="h-5 w-5 text-blue-gray-100"
          aria-hidden="true"
        />
        Back
      </a>
      <p>Preview</p>
    </div>
  );
};

const MainGrid = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 pt-10">
    {children}
  </div>
);

const Plug = () => (
  <div className="h-16 bg-black text-white flex items-center justify-center">
    <Link href="/">
      <p className="font-normal text-lg hover:text-nftGray transition duration-300 ease-in-out">
        Powered by <span className="font-black">NFTList</span>
      </p>
    </Link>
  </div>
);

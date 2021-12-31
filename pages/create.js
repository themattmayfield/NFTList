import { useMoralis, useMoralisFile } from "react-moralis";
import { useState, useEffect } from "react";
import { useImmer } from "use-immer";
import Layout from "components/Layout";
import {
  Panel,
  Label,
  MainContentWrapper,
  CustomInput,
  CustomPrefixInput,
  Toggle,
  DescriptiveText,
  DarkButton,
  LightButton,
  RedButton,
  CustomButton,
} from "components/PageUtils";
import { ChromePicker } from "react-color";
import { useRouter } from "next/router";
import getRandomColor from "lib/getRandomColor";
import useToast from "lib/useToast";
import { Spinner } from "components/Loading";
import { TrashIcon } from "@heroicons/react/solid";
import _ from "lodash";

const Create = () => {
  const { user, Moralis } = useMoralis();
  const { error, isUploading, moralisFile, saveFile } = useMoralisFile();

  const router = useRouter();
  const { id } = router.query;

  const [state, setState] = useImmer({
    projectName: "",
    website: "",
    whitelistLimit: undefined,
    isPublic: false,
    displayName: "",
    redirect: "",
    backgroundColor: getRandomColor(),
    textColor: "#000000",
    notifications: {
      signups: false,
    },
    headerPhoto: null,
    default: null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    if (id) {
      setLoading(true);
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
        setState(formattedProject);
      } catch (error) {
        useToast({ type: "error", message: error.message });
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    }
  }, [id]);

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (target.type === "checkbox") {
      setState((draft) => {
        draft["notifications"]["signups"] = value;
      });
      return true;
    }

    setState((draft) => {
      draft[name] = value;
    });
  };

  const handleChangeCompleteBg = (color, name) => {
    setState((draft) => {
      draft.backgroundColor = color.hex;
    });
  };

  const handleChangeCompleteTx = (color, name) => {
    setState((draft) => {
      draft.textColor = color.hex;
    });
  };

  const handleHeaderFileUpload = async (e) => {
    const file = e.target.files[0];
    const data = await saveFile("whitelistHeader", file);

    setState((draft) => {
      draft.headerPhoto = data;
    });
  };

  const handleDefaultFileUpload = async (e) => {
    const file = e.target.files[0];
    const data = await saveFile("whitelistDefault", file);

    setState((draft) => {
      draft.default = data;
    });
  };

  const disableForm = !state?.projectName;

  if (!user) {
    return <p>go to sign in</p>;
  }

  return (
    <>
      <Layout pageTitle={"Create"}>
        <MainContentWrapper>
          <form
            className="space-y-6"
            onSubmit={async function handleSubmit(event) {
              event.preventDefault();
              console.log(state);
              try {
                const Whitelists = Moralis.Object.extend("Whitelists");

                const query = id ? new Moralis.Query(Whitelists) : null;
                if (query) {
                  query.equalTo("user", user.id);
                  query.equalTo("objectId", id);
                }

                const whitelists = id ? await query.first() : new Whitelists();

                await whitelists.save({
                  ...state,
                  user: user.id,
                });
                router.push("/"); //Maybe go to the view????
              } catch (error) {
                useToast({ type: "error", message: error.message });
                console.log(error.message);
              }
            }}
          >
            <Panel>
              <TitleDescription
                title="Basic Info"
                description="This information will only be seen by you."
              />

              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-6 sm:col-span-4">
                      <CustomInput
                        htmlFor="project-name"
                        label="Project Name"
                        type="text"
                        name="projectName"
                        id="projectName"
                        value={state?.projectName}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                      <CustomPrefixInput
                        htmlFor="website"
                        label="Website"
                        type="text"
                        name="website"
                        id="website"
                        placeholder="www.example.com"
                        value={state?.website}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                      <div className="w-1/2">
                        <CustomInput
                          htmlFor="whitelistLimit"
                          label="Whitelist Limit"
                          type="number"
                          min="0"
                          name="whitelistLimit"
                          id="whitelistLimit"
                          value={state?.whitelistLimit}
                          onChange={handleInputChange}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        If you do not know the max, just leave empty.
                      </p>
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                      <Label htmlFor="isPublic" label="Public" />

                      <div className="relative mt-1">
                        <Toggle
                          state={state?.isPublic}
                          setState={() =>
                            setState((draft) => {
                              draft.isPublic = !draft.isPublic;
                            })
                          }
                          description="Do you want to make your whitelist public? This will allow you to create a simple webpage for people to join your whitelist themselves."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>

            {state?.isPublic ? (
              <>
                <Panel>
                  <TitleDescription
                    title="Project Details"
                    description="This information is public."
                  />

                  <div className="mt-5 md:mt-0 md:col-span-2">
                    <div>
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6">
                          <CustomInput
                            htmlFor="display-name"
                            label="Display Name"
                            type="text"
                            name="displayName"
                            id="displayName"
                            value={state?.displayName}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="col-span-6">
                          <CustomPrefixInput
                            htmlFor="redirect"
                            label="Redirect Url"
                            type="text"
                            name="redirect"
                            id="redirect"
                            placeholder="www.example.com"
                            value={state?.redirect}
                            onChange={handleInputChange}
                          />
                          <DescriptiveText text="This link will be where the user goes after succesfully signing up to the whitelist." />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <Label
                            htmlFor="project-backgroundColor"
                            label="Project Background Color"
                          />

                          <div className="mt-1">
                            <ChromePicker
                              color={state?.backgroundColor}
                              onChange={handleChangeCompleteBg}
                              disableAlpha={true}
                            />
                          </div>
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <Label
                            htmlFor="project-textColor"
                            label="Project Text Color"
                          />

                          <div className="mt-1">
                            <ChromePicker
                              color={state?.textColor}
                              onChange={handleChangeCompleteTx}
                              disableAlpha={true}
                            />
                          </div>
                        </div>

                        <div className="col-span-6">
                          <Label htmlFor="defaultphoto" label="Default Photo" />

                          <div className="mt-1 flex items-center space-x-5">
                            {(isUploading && (
                              <div className="grid h-32 place-items-center mt-6">
                                <Spinner />
                              </div>
                            )) ||
                              (_.isEmpty(state?.default) && (
                                <div className="flex items-center space-x-2">
                                  <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                  >
                                    <path
                                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <label
                                    htmlFor="default"
                                    className="inline-flex cursor-pointer justify-center items-center px-4 py-2 shadow-sm text-sm font-medium rounded-md text-black dark:text-white bg-white hover:bg-gray-100 dark:bg-black border border-gray-300 dark:border-black dark:hover:bg-nftGray transition duration-300 ease-in-out focus:outline-none"
                                  >
                                    <span>Upload Default Photo</span>
                                    <input
                                      id="default"
                                      name="default"
                                      type="file"
                                      className="sr-only"
                                      onChange={handleDefaultFileUpload}
                                    />
                                  </label>
                                </div>
                              )) || (
                                <div className="flex items-center space-x-2">
                                  <img
                                    className="w-32"
                                    src={state.default?._url}
                                  />
                                  <RedButton
                                    text="Delete Default Photo"
                                    icon={<TrashIcon />}
                                    action={() =>
                                      setState((draft) => {
                                        draft.default = null;
                                      })
                                    }
                                  />
                                </div>
                              )}

                            {/* <CustomButton text="Change" /> */}
                          </div>
                        </div>

                        <div className="col-span-6">
                          <Label htmlFor="cover-photo" label="Cover photo" />
                          {!_.isEmpty(state?.headerPhoto) ? (
                            <div className="mt-1">
                              <RedButton
                                text="Delete Cover Photo"
                                icon={<TrashIcon />}
                                action={() =>
                                  setState((draft) => {
                                    draft.headerPhoto = null;
                                  })
                                }
                              />
                            </div>
                          ) : (
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                              <div className="space-y-1 text-center">
                                <svg
                                  className="mx-auto h-12 w-12 text-gray-400"
                                  stroke="currentColor"
                                  fill="none"
                                  viewBox="0 0 48 48"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                  <label
                                    htmlFor="headerPhoto"
                                    className="relative cursor-pointer rounded-md underline font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                  >
                                    <span>Upload a file</span>
                                    <input
                                      id="headerPhoto"
                                      name="headerPhoto"
                                      type="file"
                                      className="sr-only"
                                      onChange={handleHeaderFileUpload}
                                    />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, GIF up to 10MB
                                </p>
                              </div>
                            </div>
                          )}

                          {isUploading ? (
                            <div className="grid h-32 place-items-center mt-6">
                              <Spinner />
                            </div>
                          ) : (
                            <img
                              className="pt-4"
                              src={state.headerPhoto?._url}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Panel>
                <Panel>
                  <TitleDescription
                    title="Notifications"
                    description="Decide which communications about this project you'd like to receive."
                  />

                  <div className="mt-5 md:mt-0 md:col-span-2">
                    <div className="space-y-6">
                      <fieldset>
                        <div className="space-y-4">
                          <NotificationItems
                            inputProps={{
                              id: "signups",
                              name: "signups",
                              type: "checkbox",
                              onChange: handleInputChange,
                              checked: state?.notifications?.signups,
                            }}
                            label="New Signups"
                            description="Get notified when someone signs up to your whitelis"
                          />
                        </div>
                      </fieldset>
                    </div>
                  </div>
                </Panel>
              </>
            ) : null}

            <div className="flex justify-end px-4 space-x-3">
              <DarkButton text="Cancel" action={() => router.push("/")} />
              <LightButton disabled={disableForm} text="Save" type="submit" />
            </div>
          </form>
        </MainContentWrapper>
      </Layout>
    </>
  );
};

export default Create;

const TitleDescription = ({ title, description, rightSlot }) => (
  <div className="md:col-span-1">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
        {title}
      </h3>
      {rightSlot}
    </div>
    <DescriptiveText text={description} />
  </div>
);

const NotificationItems = ({ label, description, inputProps }) => (
  <div className="flex items-start">
    <div className="h-5 flex items-center">
      <input
        {...inputProps}
        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
      />
    </div>
    <div className="ml-3 text-sm">
      <label htmlFor="comments" className="font-medium text-gray-700">
        {label}
      </label>
      <p className="text-gray-500">{description}</p>
    </div>
  </div>
);

const ideas = [
  "whitelist limit",
  "add fields",
  "isPublic",
  "redirecturl",
  "simple yet custom design of site",
  "connect with metamask",
  "i can create an api so people can connect to it",
  "public and private mint, private connects directly to whitelist",
];

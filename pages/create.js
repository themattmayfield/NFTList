import { useMoralis } from "react-moralis";
import { useState } from "react";
import { useImmer } from "use-immer";
import Layout from "components/Layout";
import {
  Panel,
  Label,
  MainContentWrapper,
  CustomInput,
  CustomPrefixInput,
  Toggle,
} from "components/PageUtils";
import { ChromePicker } from "react-color";
import { useRouter } from "next/router";

const Create = () => {
  const { user, Moralis } = useMoralis();
  const router = useRouter();
  console.log(user);
  const [state, setState] = useImmer({
    projectName: "",
    website: "",
    public: false,
    displayName: "",
    backgroundColor: "#ffffff",
    textColor: "#000000",
  });

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

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

  const disableForm = !state.projectName;

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

              try {
                const Projects = Moralis.Object.extend("Projects");
                const projects = new Projects();

                await projects.save({ ...state, user: user.id, members: [] });
                router.push("/");
              } catch (error) {
                // TODO
                // Toast with error message.
                console.log(error);
              }

              // I need to be able to check if the response is not good

              //   onClick={() =>
              //     setUserData({
              //       test: false,
              //       //   username: "Batman",
              //       //   email: "batman@marvel.com",
              //       numberOfCats: 12,
              //     })
              //   }

              // try {
              //   const response = await fetchJson("/api/register", {
              //     method: "POST",
              //     headers: { "Content-Type": "application/json" },
              //     body: JSON.stringify(body),
              //   });
              //   const { success, errors } = response;

              //   if (errors.length) {
              //     console.log(errors);
              //     setErrorMsg(errors[0]);
              //     return true;
              //   }
              //   localStorage.removeItem("LCRegister");
              //   Router.push("/login");
              // } catch (error) {
              //   console.log(error);
              //   if (error instanceof FetchError) {
              //     setErrorMsg(error.data.message);
              //   } else {
              //     console.error("An unexpected error happened:", error);
              //   }
              // }
            }}
          >
            <Panel>
              <TitleDescription
                title="Basic Info"
                description="This information is what will initialize the project."
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
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-span-3 sm:col-span-2">
                      <CustomPrefixInput
                        htmlFor="website"
                        label="Website"
                        type="text"
                        name="website"
                        id="website"
                        placeholder="www.example.com"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Panel>

            <Panel>
              <TitleDescription
                title="Project Details"
                description="Use a permanent address where you can receive mail."
              />

              <div className="mt-5 md:mt-0 md:col-span-2">
                <div>
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-4">
                      <Label htmlFor="public" label="Public" />

                      <div className="relative mt-1">
                        <Toggle
                          state={state.public}
                          setState={() =>
                            setState((draft) => {
                              draft.public = !draft.public;
                            })
                          }
                          description="Do you want to make your whitelist public?"
                        />
                      </div>
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                      <CustomInput
                        htmlFor="display-name"
                        label="Display Name"
                        type="text"
                        name="displayName"
                        id="displayName"
                        onChange={handleInputChange}
                      />
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

                    <div className="col-span-6 sm:col-span-4">
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
                      <Label htmlFor="default" label="Default Photo" />

                      <div className="mt-1 flex items-center space-x-5">
                        <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                          <svg
                            className="h-full w-full text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </span>
                        <button
                          type="button"
                          className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Change
                        </button>
                      </div>
                    </div>

                    <div className="col-span-6">
                      <Label htmlFor="cover-photo" label="Cover photo" />

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
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                            >
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
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
                      <div className="flex items-start">
                        <div className="h-5 flex items-center">
                          <input
                            id="comments"
                            name="comments"
                            type="checkbox"
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="comments"
                            className="font-medium text-gray-700"
                          >
                            Comments
                          </label>
                          <p className="text-gray-500">
                            Get notified when someones posts a comment on a
                            posting.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="candidates"
                            name="candidates"
                            type="checkbox"
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="candidates"
                            className="font-medium text-gray-700"
                          >
                            Candidates
                          </label>
                          <p className="text-gray-500">
                            Get notified when a candidate applies for a job.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="offers"
                            name="offers"
                            type="checkbox"
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="offers"
                            className="font-medium text-gray-700"
                          >
                            Offers
                          </label>
                          <p className="text-gray-500">
                            Get notified when a candidate accepts or rejects an
                            offer.
                          </p>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </Panel>

            <div className="flex justify-end px-4">
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                disabled={disableForm}
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save
              </button>
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
    <p className="mt-1 text-sm text-gray-500">{description}</p>
  </div>
);

const Input = ({ type, name, id, autoComplete }) => (
  <input
    type={type || "text"}
    name={name}
    id={id}
    autoComplete={autoComplete || false}
    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
  />
);

const ideas = [
  "whitelist limit",
  "add fields",
  "isPublic",
  "redirecturl",
  "simple yet custom design of site",
  "connect with metamask",
];

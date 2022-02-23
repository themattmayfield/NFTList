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
  CustomTextArea,
} from "components/PageUtils";
import { ChromePicker } from "react-color";
import { useRouter } from "next/router";
import getRandomColor from "lib/getRandomColor";
import useToast from "lib/useToast";
import { Spinner } from "components/Loading";
import { TrashIcon } from "@heroicons/react/solid";
import _ from "lodash";
import Breadcrumb from "components/Breadcrumb";
import Loading from "components/Loading";
import { Formik, Form } from "formik";
import useValidator from "lib/useValidator";
import FocusError from "lib/FocusError";

const Create = () => {
  const { user, Moralis } = useMoralis();
  const { error, isUploading, moralisFile, saveFile } = useMoralisFile();
  const { validateWebsite, validateNumeric, required } = useValidator();

  const router = useRouter();

  const { id } = router.query;

  const [state, setState] = useImmer({
    projectName: "",
    website: "",
    whitelistLimit: undefined,
    isPublic: false,
    displayName: "",
    redirect: "",
    about: "",
    backgroundColor: getRandomColor(),
    textColor: "#000000",
    buttonColor: "#000000",
    notifications: {
      signups: false,
    },
    displayPhoto: null,
  });

  const [loading, setLoading] = useState(true);

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
        setState(formattedProject);
      } catch (error) {
        useToast({ type: "error", message: error.message });
        console.log(error.message);
      }
    }
    setLoading(false);
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

  const handleChangeCompleteButton = (color, name) => {
    setState((draft) => {
      draft.buttonColor = color.hex;
    });
  };

  const handleHeaderFileUpload = async (e) => {
    const file = e.target.files[0];
    const data = await saveFile("whitelistHeader", file);

    setState((draft) => {
      draft.displayPhoto = data;
    });
  };

  const disableForm = !state?.projectName;

  if (!user) {
    return <p>go to sign in</p>;
  }

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <>
      <Layout pageTitle={id ? "Update" : "Create"}>
        <Breadcrumb
          text={
            id ? <span>Back to Whitelist View</span> : <span>Dashboard</span>
          }
        />

        <MainContentWrapper>
          <Formik
            enableReinitialize
            initialValues={state}
            onSubmit={async (values) => {
              try {
                const Whitelists = Moralis.Object.extend("Whitelists");

                const query = id ? new Moralis.Query(Whitelists) : null;
                if (query) {
                  query.equalTo("user", user.id);
                  query.equalTo("objectId", id);
                }

                const whitelists = id ? await query.first() : new Whitelists();

                const response = await whitelists.save({
                  ...values,
                  user: user.id,
                });
                useToast({
                  type: "success",
                  message: `${
                    id ? "Updated successfully" : "Whilist project created"
                  }`,
                });
                console.log(response);
                router.push(`/projectDetails/${response.id}`); //Maybe go to the view????
              } catch (error) {
                useToast({ type: "error", message: error.message });
                console.log(error.message);
              }
            }}
          >
            {({ errors, touched, dirty, isValid }) => (
              <Form className="space-y-6">
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
                            validate={required}
                            error={
                              errors.projectName &&
                              touched.projectName &&
                              errors.projectName
                            }
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-4">
                          <CustomInput
                            htmlFor="website"
                            label="Website"
                            type="text"
                            name="website"
                            id="website"
                            placeholder="www.example.com"
                            value={state?.website}
                            validate={validateWebsite}
                            error={
                              errors.website &&
                              touched.website &&
                              errors.website
                            }
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
                              // validate={validateNumeric}
                              // error={
                              //   errors.whitelistLimit &&
                              //   touched.whitelistLimit &&
                              //   errors.whitelistLimit
                              // }
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
                                validate={required}
                                error={
                                  errors.displayName &&
                                  touched.displayName &&
                                  errors.displayName
                                }
                              />
                            </div>

                            <div className="col-span-6">
                              <CustomInput
                                htmlFor="redirect"
                                label="Redirect Url"
                                type="text"
                                name="redirect"
                                id="redirect"
                                placeholder="www.example.com"
                                value={state?.redirect}
                                onChange={handleInputChange}
                                validate={validateWebsite}
                                error={
                                  errors.redirect &&
                                  touched.redirect &&
                                  errors.redirect
                                }
                              />
                              <DescriptiveText text="This link will be where the user goes after succesfully signing up to the whitelist." />
                            </div>

                            <div className="col-span-6">
                              <CustomTextArea
                                rows={3}
                                htmlFor="about"
                                label="About This Project"
                                type="text"
                                name="about"
                                id="about"
                                value={state?.about}
                                onChange={handleInputChange}
                                validate={required}
                                error={
                                  errors.about && touched.about && errors.about
                                }
                              />
                              <DescriptiveText text="Let people know more about what they are whitelisting to." />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Panel>
                    <Panel>
                      <TitleDescription
                        title="Project Appearance"
                        description="Make your website more appealing by adding customized color patterns. Not required but helps!"
                      />

                      <div className="mt-5 md:mt-0 md:col-span-2">
                        <div>
                          <div className="grid grid-cols-6 gap-6">
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
                                {/* <style jsx>{`
                                  #rc-editable-input-1 {
                                    color: red !important;
                                  }
                                `}</style> */}
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

                            <div className="col-span-6 sm:col-span-3">
                              <Label
                                htmlFor="project-buttonColor"
                                label="Project Button Color"
                              />

                              <div className="mt-1">
                                <ChromePicker
                                  color={state?.buttonColor}
                                  onChange={handleChangeCompleteButton}
                                  disableAlpha={true}
                                />
                              </div>
                            </div>

                            <div className="col-span-6">
                              <Label
                                htmlFor="cover-photo"
                                label="Cover photo"
                              />
                              {!_.isEmpty(state?.displayPhoto) ? (
                                <div className="mt-1">
                                  <RedButton
                                    text="Delete Cover Photo"
                                    icon={<TrashIcon />}
                                    action={() =>
                                      setState((draft) => {
                                        draft.displayPhoto = null;
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
                                        htmlFor="displayPhoto"
                                        className="relative cursor-pointer rounded-md underline font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                      >
                                        <span>Upload a file</span>
                                        <input
                                          id="displayPhoto"
                                          name="displayPhoto"
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
                                  src={state.displayPhoto?._url}
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

                <div className="flex justify-end px-4">
                  <LightButton
                    // disabled={disableForm}
                    disabled={!isValid}
                    text="Save"
                    type="submit"
                  />
                </div>
                <FocusError />
              </Form>
            )}
          </Formik>
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

import { useMoralis } from "react-moralis";
import { useState, useEffect } from "react";

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
import { useRouter } from "next/router";
import getRandomColor from "lib/getRandomColor";
import useToast from "lib/useToast";
import { TrashIcon, ChevronLeftIcon } from "@heroicons/react/solid";
import Loading from "components/Loading";

const Create = () => {
  const { user, Moralis } = useMoralis();

  const router = useRouter();

  const disableForm = false;
  return (
    <>
      <Layout pageTitle="Settings">
        <MainContentWrapper>
          <form
            className="space-y-6"
            // onSubmit={async function handleSubmit(event) {
            //   event.preventDefault();
            //   console.log(state);
            //   try {
            //     const Whitelists = Moralis.Object.extend("Whitelists");

            //     const query = id ? new Moralis.Query(Whitelists) : null;
            //     if (query) {
            //       query.equalTo("user", user.id);
            //       query.equalTo("objectId", id);
            //     }

            //     const whitelists = id ? await query.first() : new Whitelists();

            //     const response = await whitelists.save({
            //       ...state,
            //       user: user.id,
            //     });
            //     useToast({
            //       type: "success",
            //       message: `${
            //         id ? "Updated successfully" : "Whilist project created"
            //       }`,
            //     });
            //     console.log(response);
            //     router.push(`/projectDetails/${response.id}`); //Maybe go to the view????
            //   } catch (error) {
            //     useToast({ type: "error", message: error.message });
            //     console.log(error.message);
            //   }
            // }}
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
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        If you do not know the max, just leave empty.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>

            <div className="flex justify-end px-4">
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

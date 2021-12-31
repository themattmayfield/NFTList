import { Fragment, useState } from "react";
import { Switch } from "@headlessui/react";

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export const Logo = () => (
  <p className="text-3xl font-black text-black dark:text-white">NFTList</p>
);

export const Panel = ({ children }) => (
  <div className="bg-gray-100 dark:bg-nftGray border border:nftGray dark:border-none shadow px-4 py-5 md:rounded-lg sm:p-6">
    <div className="md:grid md:grid-cols-3 md:gap-6">{children}</div>
  </div>
);

export const CustomInput = (props) => {
  return (
    <>
      <label
        htmlFor={props.htmlFor}
        className="block text-sm font-medium text-gray-700 dark:text-white"
      >
        {props.label}
      </label>
      <input
        {...props}
        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-black rounded-md "
      />
    </>
  );
};

export const Label = ({ label, htmlFor }) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-medium text-gray-700 dark:text-white"
  >
    {label}
  </label>
);

export const CustomSelect = () => (
  <select
    id="country"
    name="country"
    autoComplete="country-name"
    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  >
    <option>United States</option>
    <option>Canada</option>
    <option>Mexico</option>
  </select>
);

export const CustomPrefixInput = (props) => {
  return (
    <>
      <label
        htmlFor={props.htmlFor}
        className="block text-sm font-medium text-gray-700 dark:text-white"
      >
        {props.label}
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm dark:border-gray-700 dark:bg-black">
          http://
        </span>
        <input
          {...props}
          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-black"
        />
      </div>
    </>
  );
};

export const CustomTextArea = ({
  type,
  name,
  id,
  autoComplete,
  htmlFor,
  label,
  placeholder,
}) => {
  return (
    <>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700 dark:text-white"
      >
        {label}
      </label>
      <div className="mt-1">
        <textarea
          id="about"
          name="about"
          rows={3}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 dark:border-gray-700 dark:bg-black rounded-md"
          placeholder="About this project"
          defaultValue={""}
        />
      </div>
    </>
  );
};

export const MainContentWrapper = ({ children, className }) => (
  <div className={`${className} max-w-5xl md:p-4 mx-auto lg:pt-6 pb-6`}>
    {children}
  </div>
);

export const Toggle = ({ state, setState, description }) => {
  return (
    <Switch.Group as="div" className="flex items-center">
      <Switch
        checked={state}
        onChange={setState}
        className={classNames(
          state
            ? "bg-indigo-600 dark:bg-black"
            : "bg-gray-200 dark:bg-gray-700",
          "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            state ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
          )}
        />
      </Switch>
      <Switch.Label as="span" className="ml-3">
        <span className="text-sm text-gray-500">{description}</span>
      </Switch.Label>
    </Switch.Group>
  );
};

export const CustomButton = ({ text, icon, action }) => (
  <button
    onClick={() => action()}
    type="button"
    className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
  >
    <span className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true">
      {icon}
    </span>
    <span>{text}</span>
  </button>
);

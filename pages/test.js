import { useMoralis } from "react-moralis";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { projects } from "components/DUMMY_DATA";
import { ChevronRightIcon, DotsVerticalIcon } from "@heroicons/react/solid";
import Layout from "components/Layout";
import Link from "next/link";

const Test = () => {
  const { Moralis, setUserData, userError, isUserUpdating, user } =
    useMoralis();

  const test = () => {
    // const Child = Moralis.Object.extend("Child");
    // const child = new Child();

    const Parent = Moralis.Object.extend("Parent");
    const parent = new Parent();
    parent.save({ cool: "this is cool" });
    // parent.save({ child: child });
    // Automatically the object Child is created on the server
    // just before saving the Parent
  };
  return (
    <Layout pageTitle="Test">
      <div>
        {userError && <p>{userError.message}</p>}

        <div className="px-12 max-w-min">
          <p>{JSON.stringify(user, null, 2)}</p>
        </div>

        <button
          onClick={test}
          //   onClick={() =>
          //     setUserData({
          //       test: false,
          //       //   username: "Batman",
          //       //   email: "batman@marvel.com",
          //       numberOfCats: 12,
          //     })
          //   }
          disabled={isUserUpdating}
        >
          Set user data
        </button>
      </div>
    </Layout>
  );
};

export default Test;

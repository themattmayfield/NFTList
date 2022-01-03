import { useRouter } from "next/router";
import { ChevronLeftIcon } from "@heroicons/react/solid";
const Breadcrumb = ({ text }) => {
  const router = useRouter();
  return (
    <nav
      aria-label="Breadcrumb"
      className="bg-white dark:bg-black md:border-b dark:border-nftGray"
    >
      <div className="max-w-5xl mx-auto py-3 px-4 flex items-start sm:px-6 lg:px-8">
        <a
          onClick={() => router.back()}
          href="#"
          className="-ml-1 inline-flex items-center space-x-3 text-sm font-medium hover:text-indigo-500 transition duration-300 ease-in-out"
        >
          <ChevronLeftIcon
            className="h-5 w-5 text-blue-gray-100"
            aria-hidden="true"
          />
          {text}
        </a>
      </div>
    </nav>
  );
};

export default Breadcrumb;

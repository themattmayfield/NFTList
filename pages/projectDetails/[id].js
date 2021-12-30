import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

const ProjectDetails = () => {
  const { user, Moralis } = useMoralis();
  const router = useRouter();
  const { id } = router.query;

  const [project, setProject] = useState({});
  useEffect(async () => {
    if (id) {
      try {
        const Projects = Moralis.Object.extend("Projects");
        const query = new Moralis.Query(Projects);
        query.equalTo("user", user.id);
        query.equalTo("objectId", id);
        const result = await query.first();
        console.log(result);
        const formattedProject = {
          id: result.id,
          ...result.attributes,
        };

        setProject(formattedProject);
      } catch (error) {
        // TODO
        // Toast with error message.
        console.log(error);
      }
    }
  }, [id]);

  return <div>{JSON.stringify(project)}</div>;
};

export default ProjectDetails;

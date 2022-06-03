import { Box, Link } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import * as api from "strateegia-api";
import JourneysIndicators from "../components/JourneysIndicators";
import Loading from "../components/Loading";
import MapList from "../components/MapList";
import ProjectList from "../components/ProjectList";
import { i18n } from "../translate/i18n";


export default function Main() {
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedMap, setSelectedMap] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [projectData, setProjectData] = useState(null);
  const [mapDetails, setMapDetails] = useState(null);

  const handleSelectChange = (e) => {
    setSelectedProject(e.target.value);
    setIsLoading(true);
    async function fetchMapList() {
      try {
        const project = await api.getProjectById(accessToken, e.target.value);
        setProjectData(project);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchMapList();
  };

  const handleMapSelectChange = (e) => {
    setSelectedMap(e.target.value);
    setMapDetails(e.target.value);
    // async function fetchMapList() {
    //   try {
    //     const project = await api.getProjectById(accessToken, e.target.value);
    //     setProjectData(project);
    //     setIsLoading(false);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
    // fetchMapList();
  };

  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken"));
  }, []);

  useEffect(() => {
    console.log('sp', selectedProject == '')
  }, [selectedProject]);


  return (
    <Box padding={10}>
      <Box display='flex' >
        <ProjectList handleSelectChange={handleSelectChange} />
        <Link 
          pointerEvents={selectedProject ? '' : 'none'}
          // _disabled={selectedProject ? false : true}
          // href={`https://app.strateegia.digital/journey/${selectedProject}/map/${projectData?.maps[0].id}`}
          target='_blank'
          bg='#E9ECEF'
          borderRadius={' 0 6px 6px 0 '}
          fontSize={16}
          w={200} h='40px'
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          {i18n.t('main.link')}
        </Link>
      </Box>
        <MapList
          projectId={selectedProject}
          handleSelectChange={handleMapSelectChange}
        />
      <Loading active={isLoading} /> 
      <JourneysIndicators project={projectData} mapId={mapDetails}/>
    </Box>
  );
}


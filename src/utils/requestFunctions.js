import api from "./api";

export const fetchJourneyStatistics = async (token, projectId) => {
    const {data} = await api("/projects/v1/project/"+ projectId +"/statistics",
    {
      method: "GET", 
      headers: {
        Authorization: `Bearer ${token}`,
    },
  })
   return data;
};

export const fetchMapStatistics = async (token, mapId) => {
    const {data} = await api("/projects/v1/map/"+ mapId +"/statistics",
    {
      method: "GET", 
      headers: {
        Authorization: `Bearer ${token}`,
    },
  })
   return data;
};
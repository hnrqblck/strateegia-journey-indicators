import { useState, useEffect } from 'react';
import { Select } from '@chakra-ui/react';
import * as api from 'strateegia-api';
import { i18n } from "../translate/i18n";

export default function MapList({ projectId, handleSelectChange }) {
  const [mapList, setMapList] = useState(null);

  useEffect(() => {
    async function fetchMapList() {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const project = await api.getProjectById(accessToken, projectId);
        
        const maps = project.maps;
        const allOption = {id: 0, title: i18n.t('mapList.list')};

        maps.unshift(allOption);
        setMapList(maps);
      } catch (error) {
        console.log(error);
      }
    }
    fetchMapList();
  }, [projectId]);
 

  return projectId ? (
    <Select placeholder="escolha o mapa" onChange={handleSelectChange} mt={1}>
      {mapList
        ? mapList.map(mapItem => {
            return (
              <option key={mapItem.id} value={mapItem.id}>
                {mapItem.title}
              </option>
            );
          })
        : null}
    </Select>
  ) : (
    ''
  );
}

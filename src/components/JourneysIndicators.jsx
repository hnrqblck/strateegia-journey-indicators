import React from 'react';
import { Box, Text, Heading } from '@chakra-ui/react';
import { fetchJourneyStatistics, fetchMapStatistics } from '../utils/requestFunctions';
import { saveFile } from './FileContent';
import { saveAs } from 'file-saver';
import { Packer } from 'docx';
import { CSVLink } from 'react-csv';
import { i18n } from '../translate/i18n';
import { fetchStatistics } from './statistics';
import { ExportsButtons } from './ExportsButtons';

const JourneysIndicators = ({project, mapId}) => {
    const [statistics, setStatistics] = React.useState(null);
    const [doc, setDoc] = React.useState(null);
    const [csv, setCsv] = React.useState({headers: '', data: ''});
    const accessToken = localStorage.getItem('accessToken');

    const usersCount = project?.users?.length;
    const activeUsers = statistics?.people_active_count
    const inactiveUsers = usersCount - activeUsers;
    const activeUsersEngagement = Math.round(statistics?.participation * 100);

    const questionsCount = statistics?.question_count;
    const answersCount = statistics?.parent_comments_count;
    const expectedComments = activeUsers * questionsCount;
    const questionsEngagement = answersCount / (questionsCount * activeUsers) * 100;

    const commentsCount = statistics?.reply_comments_count;
    const agreementsCount = statistics?.agreements_comments_count;
    const interactionsCount = commentsCount + agreementsCount;
    const reducedAnswers = answersCount / 2;
    const expectedInteraction = activeUsers * reducedAnswers;
    const debateEngagement = (interactionsCount / expectedInteraction) * 100;

    const divergenceEngagement = (questionsEngagement + debateEngagement) / 2;
    
    React.useEffect(() => {
        async function getStats() {
            const stats = await fetchStatistics(accessToken, mapId, project);
            setStatistics(stats)
        }
        mapId !== null && getStats();
    }, [project, mapId]);
    
    React.useEffect(() => {
        
        console.log("🚀 ~ file: JourneysIndicators.jsx ~ line 48 ~ React.useEffect ~ statistics", statistics)
    }, [statistics]);



    React.useEffect(() => {
        const {doc, csvHeaders, csvData} = saveFile(
            activeUsersEngagement,
            usersCount, 
            inactiveUsers, 
            questionsEngagement,
            questionsCount, 
            answersCount, 
            expectedComments, 
            debateEngagement, 
            commentsCount, 
            agreementsCount,
            interactionsCount,
            expectedInteraction,
            divergenceEngagement
        );
        setDoc(doc);
        setCsv({headers: csvHeaders, data: csvData});

    }, [statistics]);

    function saveDocx() {
        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, 'indicadores da jornada.docx');
        });
    }

    React.useEffect(() => {
    }, [csv]);
    

    return (
      <>
        <ExportsButtons project={project} saveFile={saveDocx} data={csv.data} headers={csv.headers || ''}/>
        <Heading as="h3" size="lg" mb={12} mt={3} >
            {i18n.t('main.heading')}
        </Heading>
        {mapId && mapId?.length !== 0 && 
        <>
            <Box>
                <Text>{i18n.t('main.p1p4p7p11_1')} <b>{i18n.t('main.p1bold1')}</b> {i18n.t('main.p1_2')}<b> {activeUsersEngagement.toFixed(2)}%</b></Text>
                <br/>
                <Text>{i18n.t('main.p2')} {usersCount}</Text>
                <Text>{i18n.t('main.p3')} {inactiveUsers.toFixed(2)}</Text>
                <br/>
                <Text>{i18n.t('main.p1p4p7p11_1')} <b>{i18n.t('main.p4bold1')}</b> {i18n.t('main.p4p7p11_3')} 
                    <b>{isNaN(questionsEngagement) ? '0.00' : questionsEngagement.toFixed(2)}%</b>
                </Text>
                <br/>
                <Text>{i18n.t('main.p5')} {questionsCount?.toFixed(2)}</Text>
                <Text>{i18n.t('main.p6_1')} {answersCount?.toFixed(2)} {i18n.t('main.p6p10_2')} {expectedComments?.toFixed(2)} {i18n.t('main.p6p10_3')}</Text>
                <br/>
                <Text>{i18n.t('main.p1p4p7p11_1')} <b>{i18n.t('main.p7bold')}</b> {i18n.t('main.p4p7p11_3')} 
                    <b>{isNaN(debateEngagement) ? '0.00' : debateEngagement.toFixed(2)}%</b>
                </Text>
                <br/>
                <Text>{i18n.t('main.p8')} {commentsCount?.toFixed(2)}</Text>
                <Text>{i18n.t('main.p9')} {agreementsCount?.toFixed(2)}</Text>
                <Text>{i18n.t('main.p10_1')} {interactionsCount?.toFixed(2)} {i18n.t('main.p6p10_2')} {expectedInteraction?.toFixed(2)} {i18n.t('main.p6p10_3')}</Text>
                <br/>
                <Text>{i18n.t('main.p1p4p7p11_1')} <b>{i18n.t('main.p11bold')}</b> {i18n.t('main.p4p7p11_3')} 
                    <b>{isNaN(divergenceEngagement) ? '0.00' : divergenceEngagement.toFixed(2)}%</b>
                </Text>
            </Box>
      </>
        }
      </>
    
    
  )
};

export default JourneysIndicators;
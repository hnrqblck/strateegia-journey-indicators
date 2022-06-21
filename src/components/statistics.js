import { fetchJourneyStatistics, fetchMapStatistics } from '../utils/requestFunctions';

export async function fetchStatistics(accessToken, mapId, project) {
    if (project?.maps.length === 1 || mapId?.length === project?.maps.length) {

        console.log('entrei no 1º');
        const result = fetchJourneyStatistics(accessToken, project?.id);
        return result;
    } else if (mapId?.length < project.maps.length && mapId?.length > 1) {
        console.log('entrei no 2º');
        const allStatistics = await Promise.all(
            mapId.map(({value}) => {
                return fetchMapStatistics(accessToken, value);
            })
        )
        const result = allStatistics.reduce(calculateStastics, [])
        .map(stats => calculateStatisticsMean(stats, mapId));
        return result[0];
    } else {
        console.log('entrei no 3º');
        const result = fetchMapStatistics(accessToken, mapId[0].value)
        return result;
    }
}

function calculateStastics(acc, { 
    title, 
    id,
    people_active_count, 
    participation, 
    question_count, 
    parent_comments_count,
    reply_comments_count,
    agreements_comments_count,
    }) 
{

    const calculate = (value, key) => {
      return value + (acc[0]?.[key] || 0)
    }
  
    return [{
        'title': title, 
        'id': id,
        'people_active_count': calculate(people_active_count, 'people_active_count'),
        'participation': calculate(participation, 'participation'),
        'question_count': calculate(question_count, 'question_count'),
        'parent_comments_count': calculate(parent_comments_count, 'parent_comments_count'),
        'reply_comments_count': calculate(reply_comments_count, 'reply_comments_count'),
        'agreements_comments_count': calculate(agreements_comments_count, 'agreements_comments_count'),
    }]
}

function calculateStatisticsMean(stats, mapId) {
    const allMapsIds = mapId.length;
    const getMean = (key) => (stats[key] / allMapsIds);
    const meanStatistics = {
        'people_active_count': getMean('people_active_count'),
        'participation': getMean('participation'),
        'question_count': getMean('question_count'),
        'parent_comments_count': getMean('parent_comments_count'),
        'reply_comments_count': getMean('reply_comments_count'),
        'agreements_comments_count': getMean('agreements_comments_count'),
    }
    return meanStatistics
}
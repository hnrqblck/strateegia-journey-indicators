import { Document, Paragraph, AlignmentType, TabStopPosition, HeadingLevel, TextRun, LineRuleType } from "docx";
import { i18n } from "../translate/i18n";

export function saveFile(
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
    ) 
    {

        const csvHeaders = [
            {label: 'pessoas', key: 'users'},
            {label: 'pessoas inativas', key: 'inactiveUsers'},
            {label: 'índice de pessoas ativas', key: 'activeUsersEngagement'},
            {label: 'questões', key: 'questionsCount'},
            {label: 'respostas', key: 'answersCount'},
            {label: 'respostas esperadas', key: 'expectedComments'},
            {label: 'índice de engajamento nas questões', key: 'questionsEngagement'},
            {label: 'comentários', key: 'commentsCount'},
            {label: 'concordar', key: 'agreementsCount'},
            {label: 'interações', key: 'interactionsCount'},
            {label: 'interações esperadas', key: 'expectedInteraction'},
            {label: 'índice de engajamento nos debates', key: 'debateEngagement'},
            {label: 'índice de engajamento nas divergênccias', key: 'divergenceEngagement'},
        ];

        const csvData = [
            {
                users: usersCount,
                inactiveUsers: inactiveUsers,
                activeUsersEngagement: activeUsersEngagement.toFixed(2) + '%',
                questionsCount: questionsCount,
                answersCount: answersCount,
                expectedComments: expectedComments,
                questionsEngagement: questionsEngagement.toFixed(2) + '%',
                commentsCount: commentsCount,
                agreementsCount: agreementsCount,
                interactionsCount: interactionsCount,
                expectedInteraction: expectedInteraction,
                debateEngagement: debateEngagement.toFixed(2) + '%',
                divergenceEngagement: divergenceEngagement.toFixed(2) + '%',
            }
        ]

    
        const doc = new Document({
            styles: {
                default: {
                    heading1: {
                        run: {
                            font: "Montserrat Bold",
                            size: 32,
                            bold: true,
                            color: "000000",
                        },
                        paragraph: {
                            alignment: AlignmentType.CENTER,
                            spacing: { line: 340 },
                        },
                    },
                },
                paragraphStyles: [
                    {
                        id: "normalPara",
                        name: "Normal Para",
                        basedOn: "Normal",
                        next: "Normal",
                        quickFormat: true,
                        run: {
                            font: "Montserrat",
                            size: 24,
                            bold: false,
                        },
                        paragraph: {
                            spacing: { before: 0, after: 0 },
                            rightTabStop: TabStopPosition.MAX,
                            leftTabStop: 453.543307087,
                        },
                    },
                    
                ],
            },
            sections: [
                {
                    properties: {
                        page: {
                            margin: {
                                top: 700,
                                right: 700,
                                bottom: 700,
                                left: 700,
                            },
                        },
                    },
                    children: [
                        // heading
                        new Paragraph({
                            text: i18n.t('main.heading'),
                            heading: HeadingLevel.HEADING_1,
                            alignment: AlignmentType.LEFT,
                            break: 2,
                            
                        }),
                        new Paragraph({text: '', style: "normalPara"}),
                        new Paragraph({text: '', style: "normalPara"}),
                        // 1st paragraph
                        new Paragraph({
                            text: i18n.t('main.p1p4p7p11_1'),
                            style: "normalPara",
                            children: [
                                new TextRun({
                                    text: i18n.t('main.p1bold1'),
                                    bold: true,
                                }),
                                new TextRun({
                                    text: i18n.t('main.p1_2'),
                                    bold: false,
                                }),
                                new TextRun({
                                    text: activeUsersEngagement.toFixed(2) + '%',
                                    bold: true,
                                }),
                                
                            ],
                        }),
                        new Paragraph({text: '', style: "normalPara"}),
                        // 2nd paragraph
                        new Paragraph({
                            text: i18n.t('main.p2'),
                            style: "normalPara",
                            children: [
                                new TextRun({
                                    text: usersCount,
                                    bold: false,
                                }),
                            ]
                        }),
                        // 3rd paragraph
                        new Paragraph({
                            text: i18n.t('main.p3'),
                            style: "normalPara",
                            children: [
                                new TextRun({
                                    text: inactiveUsers,
                                    bold: false,
                                }),
                                ,
                            ]
                        }),
                        new Paragraph({text: '', style: "normalPara"}),
                        // 4th paragraph
                        new Paragraph({
                            text: i18n.t('main.p1p4p7p11_1'),
                            style: "normalPara",
                            children: [
                                new TextRun({
                                    text: i18n.t('main.p4bold1'),
                                    bold: true,
                                }),
                                new TextRun({
                                    text: i18n.t('main.p4p7p11_3'),
                                    bold: false,
                                }),
                                new TextRun({
                                    text: questionsEngagement.toFixed(2) + '%',
                                    bold: true,
                                }),
                                
                            ]
                        }),
                        new Paragraph({text: '', style: "normalPara"}),
                        // 5th paragraph
                        new Paragraph({
                            text: i18n.t('main.p5'),
                            style: "normalPara",
                            children: [
                                new TextRun({
                                    text: questionsCount,
                                    bold: false,
                                }),
                            ]
                        }),
                        // 6th paragraph
                        new Paragraph({
                            text: i18n.t('main.p6_1'),
                            style: "normalPara",
                            children: [
                                new TextRun({
                                    text: answersCount,
                                    bold: false,
                                }),
                                new TextRun({
                                    text: i18n.t('main.p6p10_2'),
                                    bold: false,
                                }),
                                new TextRun({
                                    text: expectedComments,
                                    bold: false,
                                }),
                                new TextRun({
                                    text: i18n.t('main.p6p10_3'),
                                    bold: false,
                                }),
                                ,
                            ]
                        }),
                        new Paragraph({text: '', style: "normalPara"}),
                        // 7th paragraph
                        new Paragraph({
                            text: i18n.t('main.p1p4p7p11_1'),
                            style: "normalPara",
                            children: [
                                new TextRun({
                                    text: i18n.t('main.p7bold'),
                                    bold: true,
                                }),
                                new TextRun({
                                    text: i18n.t('main.p4p7p11_3'),
                                    bold: false,
                                }),
                                new TextRun({
                                    text: debateEngagement.toFixed(2) + '%',
                                    bold: true,
                                }),
                                
                            ]
                        }),
                        new Paragraph({text: '', style: "normalPara"}),
                        // 8th paragraph
                        new Paragraph({
                            text: i18n.t('main.p8'),
                            style: "normalPara",
                            children: [
                                new TextRun({
                                    text: commentsCount,
                                    bold: false,
                                }),
                            ]
                        }),
                        // 9th paragraph
                        new Paragraph({
                            text: i18n.t('main.p9'),
                            style: "normalPara",
                            children: [
                                new TextRun({
                                    text: agreementsCount,
                                    bold: false,
                                }),
                            ]
                        }),
                        // 10th paragraph
                        new Paragraph({
                            text: i18n.t('main.p10_1'),
                            style: "normalPara",
                            children: [
                                new TextRun({
                                    text: interactionsCount,
                                    bold: false,
                                }),
                                new TextRun({
                                    text: i18n.t('main.p6p10_2'),
                                    bold: false,
                                }),
                                new TextRun({
                                    text: expectedInteraction,
                                    bold: false,
                                }),
                                new TextRun({
                                    text: i18n.t('main.p6p10_3'),
                                    bold: false,
                                }),
                                ,
                            ]
                        }),
                        new Paragraph({text: '', style: "normalPara"}),
                        // 11th paragraph
                        new Paragraph({
                            text: i18n.t('main.p1p4p7p11_1'),
                            style: "normalPara",
                            children: [
                                new TextRun({
                                    text: i18n.t('main.p11bold'),
                                    bold: true,
                                }),
                                new TextRun({
                                    text: i18n.t('main.p4p7p11_3'),
                                    bold: false,
                                }),
                                new TextRun({
                                    text: divergenceEngagement.toFixed(2) + '%',
                                    bold: true,
                                }),
                                
                            ]
                        }),
                        new Paragraph({text: '', style: "normalPara"}),
                    ],
                },
            ],
        });

    return {doc, csvHeaders, csvData}

}

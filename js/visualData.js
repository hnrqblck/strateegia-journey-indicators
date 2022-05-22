import { gatherGraphData } from "../../js/data/graphData.js";

const access_token = localStorage.getItem("strateegiaAccessToken");
console.log(localStorage);


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const global_selected_mode = urlParams.get('mode') || "projeto";
console.log("MODE IS: " + global_selected_mode);

let cData = {
    "nodes": [],
    "links": []
};

let fData = {};

let counter = [
    { "id": "users", "title": "usuários", "quant": 0, "color": "#636c77" },
    { "id": "active_users", "title": "usuários ativos", "quant": 0, "color": "#636c77" },
    { "id": "inactive_users", "title": "usuários inativos", "quant": 0, "color": "#636c77" },
    { "id": "comments", "title": "respostas", "quant": 0, "color": "#e51d1d" },
    { "id": "replies", "title": "comentários", "quant": 0, "color": "#377eb8" },
    { "id": "agreements", "title": "concordar", "quant": 0, "color": "#4eaf49" },
    { "id": "divpoints", "title": "pontos divergência", "quant": 0, "color": "#ff8000" },
    { "id": "questions", "title": "questões", "quant": 0, "color": "#974da2" },
];

let filters = {};

async function drawProject(projectId, s_mode) {

    cData = {
        "nodes": [],
        "links": []
    }

    fData = {
        "nodes": [],
        "links": []
    }

    let promisses = [];

    const selected_mode = s_mode;

    if (selected_mode === "usuário") {
        filters = {
            group: group => ["comment", "reply", "agreement", "users", "user"].includes(group),
            // group: group => ["project", "map", "kit", "question", "comment", "reply", "agreement", "users", "user"].includes(group),
        };
    } else if (selected_mode === "projeto") {
        filters = {
            // group: group => ["comment", "reply", "agreement", "users", "user"].includes(group),
            group: group => ["project", "map", "divpoint", "question", "comment", "reply", "agreement"].includes(group),
        };
    } else if (selected_mode === "indicadores") {
        filters = {
            group: group => ["project", "map", "divpoint", "question", "comment", "reply", "agreement", "users", "user"].includes(group),
        };
    }

    cData = await gatherGraphData(access_token, projectId, selected_mode);
    console.log(cData);

    if (selected_mode !== "indicadores") {
        initializeGraph();
    } else {
        const filteredData = applyFilters(cData);
        fData = filteredData;
        countStatistics(fData);
    }

}

function initializeProjectList() {
    getAllProjects(access_token).then(async labs => {
        console.log("getAllProjects()");
        console.log(labs);
        // Initial project
        let listProjects = [];
        for (let i = 0; i < labs.length; i++) {
            let currentLab = labs[i];
            if (currentLab.lab.name == null) {
                currentLab.lab.name = "Personal";
            }
            for (let j = 0; j < currentLab.projects.length; j++) {
                const project = currentLab.projects[j];
                console.log(`${currentLab.lab.name} -> ${project.title}`);
                listProjects.push({
                    "id": project.id,
                    "title": project.title,
                    "lab_id": currentLab.lab.id,
                    "lab_title": currentLab.lab.name
                });
            }
        }
        let options = d3.select("#projects-list")
            .on("change", () => {
                let selected_project = d3.select("#projects-list").property('value');
                // let selected_mode = d3.select("#modes-list").property('value');
                d3.select("#project-link").attr("href", `https://app.strateegia.digital/journey/${selected_project}`);
                drawProject(selected_project, global_selected_mode);
            })
            .selectAll("option")
            .data(listProjects, d => d.id);

        options.enter()
            .append("option")
            .attr("value", (d) => { return d.id })
            .text((d) => { return `${d.lab_title} -> ${d.title}` });

        let modes = ["indicadores", "projeto", "usuário"];
        d3.select("#modes-list")
            .on("change", () => {
                let selected_project = d3.select("#projects-list").property('value');
                // let selected_mode = d3.select("#modes-list").property('value');
                drawProject(selected_project, global_selected_mode);

            })
            .selectAll("option")
            .data(modes)
            .enter()
            .append("option")
            .attr("value", (d) => { return d })
            .text((d) => { return d });

        const defaultSelectedProject = labs[0].projects[0].id;
        //const project = await getProjectById(access_token, defaultSelectedProject);
        //const mapId = project.maps[0].id;
        d3.select("#project-link").attr("href", `https://app.strateegia.digital/journey/${defaultSelectedProject}`);
        drawProject(defaultSelectedProject, global_selected_mode);
    });
}


/* 
    =============================
    Functions for manipulating the graph
    =============================
 */

function commonUpdate() {
    const filteredData = applyFilters(cData);
    fData = filteredData;
    countStatistics(fData);
    buildGraph(filteredData.nodes, filteredData.links);
    return filteredData;
}

function initializeGraph() {
    const filteredData = commonUpdate();
    initializeSimulation(filteredData.nodes, filteredData.links);
    updateAll(filteredData.links);
}

function updateGraph() {
    const filteredData = commonUpdate();
    updateAll(filteredData.links);
}

/* 
    =============================
    Functions for filtering data for graph
    =============================
 */

/**
 * Filters an array of objects using custom predicates.
 *
 * @param  {Array}  array: the array to filter
 * @param  {Object} filters: an object with the filter criteria
 * @return {Array}
 * REFERENCE: https://gist.github.com/jherax/f11d669ba286f21b7a2dcff69621eb72
 */
function filterArray(array, filters) {
    const filterKeys = Object.keys(filters);
    return array.filter(item => {
        // validates all filter criteria
        return filterKeys.every(key => {
            // ignores non-function predicates
            if (typeof filters[key] !== 'function') return true;
            return filters[key](item[key]);
        });
    });
}

function applyFilters(inputData) {
    const otherData = {
        "nodes": [...inputData.nodes],
        "links": [...inputData.links]
    }
    let filteredData = {
        "nodes": [],
        "links": []
    };
    filteredData.nodes = filterArray(inputData.nodes, filters);
    let nodeIDs = [];
    for (let index = 0; index < filteredData.nodes.length; index++) {
        const element = filteredData.nodes[index].id;
        nodeIDs.push(element);
    }
    filteredData.links = inputData.links.filter(d => {
        const isDSource = nodeIDs.includes(d.source);
        const isDTarget = nodeIDs.includes(d.target);
        const condition1 = isDSource && isDTarget;
        return condition1;
    });
    fData = filteredData;
    return filteredData;
}

function filterByTime(inputDate) {
    let parseTime = d3.timeFormat("%d/%m/%Y - %H:%M:%S");

    let timeScale = d3.scaleTime().domain([0, 50])
        .range([d3.min(cData.nodes, d => d.created_at), d3.max(cData.nodes, d => d.created_at)]);
    let dateLimit = timeScale(inputDate);

    filters.created_at = created_at => created_at <= dateLimit;
    d3.select("#choose_date").text(parseTime(dateLimit))

    updateGraph();
}

/* 
    =============================
    Counter
    =============================
 */

function countStatistics(input_data) {

    const selected_mode = global_selected_mode;
    counter.forEach(function (d, i) {
        d.quant = 0;
    });
    for (let i = 0; i < input_data.nodes.length; i++) {
        const e = input_data.nodes[i];
        if (e.group === "user") {
            const c = counter.find(x => x.id === "users");
            c.quant = c.quant + 1;
            // Check if user has links in input_data.links
            let user_links = input_data.links.filter(d => {
                return d.source === e.id;
            });
            if (user_links.length > 0) {
                const c = counter.find(x => x.id === "active_users");
                c.quant = c.quant + 1;
            } else {
                const c = counter.find(x => x.id === "inactive_users");
                c.quant = c.quant + 1;
            }
        } else if (e.group === "comment") {
            const c = counter.find(x => x.id === "comments");
            c.quant = c.quant + 1;
        } else if (e.group === "reply") {
            const c = counter.find(x => x.id === "replies");
            c.quant = c.quant + 1;
        } else if (e.group === "agreement") {
            const c = counter.find(x => x.id === "agreements");
            c.quant = c.quant + 1;
        } else if (e.group === "divpoint") {
            const c = counter.find(x => x.id === "divpoints");
            c.quant = c.quant + 1;
        } else if (e.group === "question") {
            const c = counter.find(x => x.id === "questions");
            c.quant = c.quant + 1;
        }
    }

    let filter = {};

    if (selected_mode === "projeto") {
        filter = {
            id: id => ["comments", "replies", "agreements", "divpoints", "questions"].includes(id),
        };
    } else if (selected_mode === "usuário") {
        filter = {
            id: id => ["comments", "replies", "agreements", "users", "active_users"].includes(id),
        };
    } else if (selected_mode === "indicadores") {
        filter = {
            id: id => ["comments", "replies", "agreements", "users", "questions", "active_users", "inactive_users"].includes(id),
        };
    }

    let data = filterArray(counter, filter);
    console.log("data %o", data);

    if (selected_mode === "usuário" || selected_mode === "projeto") {
        d3.select("#indicators").style("display", "none");
        d3.select("#stat_list").style("display", "block");
        d3.select("#graph_view").style("display", "block");
        let ul_ = d3.select("#stat_list")
            .selectAll("li")
            .data(data, d => d.id);
        ul_
            .enter()
            .append("li")
            .style("color", d => d.color)
            .text(d => `${d.title} ${d.quant}`);
        ul_
            .style("color", d => d.color)
            .text(d => `${d.title} ${d.quant}`);
        ul_
            .exit()
            .remove();
    } else if (selected_mode === "indicadores") {
        // Make sure the list is visible
        d3.select("#indicators").style("display", "block");
        d3.select("#stat_list").style("display", "none");
        d3.select("#graph_view").style("display", "none");


        let usuarios = data.find(d => d.id === "users").quant;
        let usuarios_ativos = data.find(d => d.id === "active_users").quant;
        let usuarios_inativos = data.find(d => d.id === "inactive_users").quant;
        let indice_atividade = (usuarios_ativos / usuarios) * 100;

        let questoes_num = data.find(d => d.id === "questions").quant;
        let respostas_num = data.find(d => d.id === "comments").quant;
        let comentarios_num = data.find(d => d.id === "replies").quant;
        let concordar_num = data.find(d => d.id === "agreements").quant;
        let interacoes_num = comentarios_num + concordar_num;

        let respostas_reduzidas = respostas_num / 2;

        let respostas_potenciais = usuarios_ativos * questoes_num;
        let interacoes_potenciais = usuarios_ativos * respostas_reduzidas;

        let engajamento_questoes = (respostas_num / respostas_potenciais) * 100;
        let engajamento_interacoes = (interacoes_num / interacoes_potenciais) * 100;

        let engajamento_media = (engajamento_questoes + engajamento_interacoes) / 2;

        engajamento_questoes = engajamento_questoes.toFixed(2);
        engajamento_interacoes = engajamento_interacoes.toFixed(2);
        d3.select("#pessoas_num").text(usuarios);
        d3.select("#pessoas_inativas_num").text(usuarios_inativos);
        d3.select("#indice_atividade_num").text(indice_atividade.toFixed(2) + "%");
        d3.select("#questoes_num").text(questoes_num);
        d3.select("#respostas_num").text(respostas_num);
        d3.select("#respostas_potenciais_num").text(respostas_potenciais);
        d3.select("#engajamento_questoes_num").text(engajamento_questoes + "%");
        d3.select("#comentarios_num").text(comentarios_num);
        d3.select("#concordar_num").text(concordar_num);
        d3.select("#interacoes_num").text(interacoes_num);
        d3.select("#interacoes_potenciais_num").text(interacoes_potenciais);
        d3.select("#engajamento_interacoes_num").text(engajamento_interacoes + "%");
        d3.select("#engajamento_media_num").text(engajamento_media.toFixed(2) + "%");
    }

}


/* 
    =============================
    Execute!
    =============================
 */

initializeProjectList();

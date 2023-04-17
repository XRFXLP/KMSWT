const URLPrefix = 'https://www.wikidata.org/wiki/Special:EntityPage'

let wikidataID = null;
let graph = {
    nodes: [],
    edges: []
}

let container = document.getElementById('mynetwork');

// Add button for visualizing
let button = document.createElement('button')
let firstheading = document.getElementById('firstHeading');
let mwouttext = document.getElementById("mw-content-text");

button.innerText = "Visualize"
button.style.backgroundColor = '#111150';
button.style.border = 'none';
button.style.color = 'white';
button.style.padding = '10px 28px';
button.style.textAlign = 'center';
button.style.textDecoration = 'none';
button.style.display = 'inline-block';
button.style.fontSize = '14px';
button.style.margin = '4px 2px';
button.style.cursor = 'pointer';

let div = document.createElement("div")
div.appendChild(button)
firstheading.appendChild(div)

button.addEventListener('click', function() {
    let mynetwork = document.createElement('div');
    mynetwork.id = "mynetwork";
    mynetwork.style.height = "400px";

    let script = document.createElement("script");
    script.src = "https://unpkg.com/vis-network/standalone/umd/vis-network.min.js";
    script.type = 'text/javascript'

    mwouttext.prepend(mynetwork);
    mwouttext.prepend(script);

    for (let urlElement of document.links) {
        if (urlElement.href.startsWith(URLPrefix)) {
            wikidataID = urlElement.href.match(/Q\d+/)[0];
            break;
        }
    }

    const wikidataURL = `https://www.wikidata.org/wiki/${wikidataID}`

    fetch(wikidataURL)
        .then(response => response.text())
        .then(data => {

            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(data, 'text/html');
            let statementGroups = htmlDoc.getElementsByClassName("wikibase-statementgrouplistview");
            let variables = [...statementGroups].map(x => [...x.getElementsByClassName("wikibase-statementgroupview")]);

            let mainNode = {
                id: 0,
                label: wikidataID
            }
            graph.nodes.push(mainNode)

            let nodeID = 1;
            for (let stuffs of variables) {
                let randomColor = `rgb(${255*Math.random()|0},${255*Math.random()|0},${255*Math.random()|0})`;
                for (let item of stuffs) {
                    if (item.children == undefined) {
                        continue;
                    }

                    let predicate = item.children[0].getElementsByTagName('a');

                    if (predicate == undefined)
                        continue;

                    predicate = predicate[0];

                    let propertyID = predicate['title'],
                        propertyName = predicate.innerText;

                    let values = [...item.children[1].children[0].children].map(x => x.children[1]
                        .children[0]
                        .children[0]
                        .children[1]
                        .children[1]
                        .children[0].innerHTML);

                    graph['nodes'].push({
                        id: nodeID,
                        label: values,
                        color: randomColor
                    })
                    graph['edges'].push({
                        from: 0,
                        to: nodeID,
                        label: propertyName,
                        arrows: {
                            to: {
                                enabled: true,
                                type: 'arrow'
                            }
                        }
                    })
                    nodeID += 1;
                }
            }

            let grapher = document.createElement("script");
            grapher.textContent = `
        let data = ${JSON.stringify(graph)};
        let options = {
              nodes: {
                shape:"dot"
              }
            }
        let mynetwork = document.getElementById('mynetwork');
        let network = new vis.Network(mynetwork, data, options);
      `
            grapher.type = 'text/javascript'
            mwouttext.appendChild(grapher);

            return data
        })
        .catch(error => {
            console.log(error);
        });
});
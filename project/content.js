const URLPrefix = 'https://www.wikidata.org/wiki/Special:EntityPage'

let wikidataID = null;
// let container = document.getElementById('mynetwork');

// Add button for visualizing
// let button = document.createElement('button')
// button.innerText = "Visualize"
// button.style.backgroundColor = '#111150';
// button.style.border = 'none';
// button.style.color = 'white';
// button.style.padding = '10px 28px';
// button.style.textAlign = 'center';
// button.style.textDecoration = 'none';
// button.style.display = 'inline-block';
// button.style.fontSize = '14px';
// button.style.margin = '4px 2px';
// button.style.cursor = 'pointer';

// button.addEventListener('click', function() {
//   chrome.runtime.sendMessage({greeting: 'openPopup', action: 'openPopup'});
//   console.log("button clicked");
// });


let div = document.createElement("div")
div.appendChild(button)
document.getElementById('firstHeading').appendChild(div )


for(let urlElement of document.links){
    if(urlElement.href.startsWith(URLPrefix)){
        wikidataID = urlElement.href.match(/Q\d+/)[0];
        break;
    }
}

const wikidataURL = `https://www.wikidata.org/wiki/${wikidataID}`

chrome.runtime.onMessage.addListener(receiver);

// Handle the message
function receiver(request, sender, sendResponse) {
  if (request.message === "browser action") {    
    
  }
}

fetch(wikidataURL)
  .then(response => response.text())
  .then(data => {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(data, 'text/html');
    let statementGroups = htmlDoc.getElementsByClassName("wikibase-statementgrouplistview");
    let stuffs = [...statementGroups].map(x=>[...x.getElementsByClassName("wikibase-statementgroupview")]);

    let mainNode = {id: 0, label: wikidataURL}
    let graph = {
        nodes: [mainNode],
        edges: [] 
    }
    let nodeID = 1;
    for(let item of stuffs){
        let predicate = item.children[0].getElementsByTagName('a')[0];
        let propertyID = predicate['title'], propertyName = predicate.innerText;

        let values = [...item.children[1].children[0].children].map(x=>x.children[1]
                                                                        .children[0]
                                                                        .children[0]
                                                                        .children[1]
                                                                        .children[1]
                                                                        .children[0].innerHTML);
        console.log(propertyID, propertyName, values)
        graph['nodes'].push({id: nodeID, label: values})
        graph['edges'].push({from: 0, to: nodeID, label: propertyName})
    }
    const options = {};
    // const network = new vis.Network(container, graph, options);
  })
  .catch(error => {
    console.log(error);
  });
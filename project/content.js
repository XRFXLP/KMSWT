const URLPrefix = 'https://www.wikidata.org/wiki/Special:EntityPage'

let wikidataID = null;

for(let urlElement of document.links){
    if(urlElement.href.startsWith(URLPrefix)){
        wikidataID = urlElement.href.match(/Q\d+/)[0];
        break;
    }
}

fetch(`https://www.wikidata.org/wiki/${wikidataID}`)
  .then(response => response.text())
  .then(data => {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(data, 'text/html');
    let statementGroups = htmlDoc.getElementsByClassName("wikibase-statementgrouplistview");
    let [statements, idenitifers] = [...statementGroups].map(x=>x.getElementsByClassName("wikibase-statementgroupview"));
    console.log(statements)
  })
  .catch(error => {
    console.log(error);
  });
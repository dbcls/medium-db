Stanza(function(stanza, params){
  const query = params["query"];

  let options = {
    method: "POST",
    mode: "cors",
    body: "",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };

  // console.log(query);
  let api_url = "http://ep.dbcls.jp/sparqlist/api/";
  let api_name = `gmdb_organism_by_taxid?taxid=${query}`;
  // let api_name = `gmdb_organism_by_taxid`;

  let q = fetch(api_url + api_name, options).then(res => res.json());

  q.then(function(json){
    let data = {};
    data.body = {};
    data.body.type_material = [];
    data.body.lineage = [];

    data.body.scientific_name = json.scientific_name;
    data.body.taxid = json.taxid;
    if(json.authority_name){
      data.body.authority_name = json.authority_name;
    }
    if(json.type_material){
      for(let i = 0; i < json.type_material.length; i++){
        data.body.type_material.push(json.type_material[i]);
      }
    }
    if(json.lineage){
      json.lineage.forEach(elm => data.body.lineage.push(elm));
    }
    /*
     ;
     data.body.phylum = {};
     data.body.phylum.uri = json.phylum.uri;
     data.body.phylum.label = json.phylum.label;
     data.body.phylum.taxid = json.phylum.taxid;
     data.body.order = {};
     data.body.order.uri = json.order.uri;
     data.body.order.label = json.order.label;
     data.body["class"] = {};
     data.body["class"].uri = json["class"].uri;
     data.body["class"].label = json["class"].label;
     data.body.family = {};
     data.body.family.uri = json.family.uri;
     data.body.family.label = json.family.label;
     */

    stanza.render({
      template: "stanza.html",
      parameters: {
        result: data
      }
    });
  });
});

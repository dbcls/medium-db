Stanza(function(stanza, params){
  const query = params["query"];
  const options = {
    method: "POST",
    mode: "cors",
    body: "",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
  const api_url = "http://ep.dbcls.jp/sparqlist/api/";
  const api_name = `gmdb_organism_by_taxid?taxid=${query}`;
  const data = {};
  let msg = "";
  let error = false;


  fetch(`${api_url}${api_name}`, options)
    .then(res => success(res.json()))
    .catch(e => fail(e))
    .finally(() => {
      stanza.render({
        template: "stanza.html",
        parameters: {
          result: data,
          msg: msg,
          error: error
        }
      });
    });


  function success(json){
    data.type_material = [];
    data.lineage = [];

    data.scientific_name = json.scientific_name;
    data.taxid = json.taxid;
    if(json.authority_name){
      data.authority_name = json.authority_name;
    }
    if(json.type_material){
      for(let i = 0; i < json.type_material.length; i++){
        data.type_material.push(json.type_material[i]);
      }
    }
    if(json.lineage){
      json.lineage.forEach(elm => data.lineage.push(elm));
    }
  }

  function fail(e){
    error = true;
    msg = "make a query such as 315405";
  }
});




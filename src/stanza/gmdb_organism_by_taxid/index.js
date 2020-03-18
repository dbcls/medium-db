Stanza(function(stanza, params){
  const api_url = "http://ep.dbcls.jp/sparqlist/api/";
  const api_name = `gmdb_organism_by_taxid`;
  const options = makeOptions(params);
  const data = {};
  let msg = "";
  let error = false;

  if(!params["taxid"]) {
    error = true;
    msg = "taxid (e.g. 315405) is required"
  }


  fetch(`${api_url}${api_name}`, options)
    .then(res => res.json())
    .then(json => success(json))
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
    const taxID = params["taxid"];
    error = true;
    msg = `Not found. taxid: ${taxID}`;
  }
});



function makeOptions(params){
  let formBody = [];

  for (let key in params) {
    if (params[key]) {
      formBody.push(key + "=" + encodeURIComponent(params[key]));
    }
  }

  return  {
    method: "POST",
    mode: "cors",
    body: formBody.join("&"),
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
}


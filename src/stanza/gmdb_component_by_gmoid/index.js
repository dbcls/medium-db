Stanza(function(stanza, params){

  const api_url = "http://ep.dbcls.jp/sparqlist/api/";
  const api_name = "gmdb_component_by_gmoid";
  const options = makeOptions(params);
  const data = {};
  let msg = "";
  let error = false;

  if(!params["gmo_id"]){
    error = true;
    msg = "gmo_id (e.g. GMO_001010) is required";
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
    if(json.length === 0){
      const gmoID = params["gmo_id"];
      error = true;
      msg = `Not found. gmo_id: ${gmoID}`;
      return;
    }

    data.alt_labels_en = [];
    data.alt_labels_ja = [];
    data.super_classes = [];
    data.sub_classes = [];
    data.links = [];
    data.properties = [];
    data.roles = [];
    const host = location.host;


    data.gmo_id = json.id;
    data.pref_label = json.pref_label;
    data.json_label_ja = json.label_ja;

    if(json.alt_labels_en){
      data.alt_labels_en = json.alt_labels_en.map(str => ({value: str}));
    }

    if(json.super_classes){
      data.super_classes = json.super_classes.map(obj => ({
        gmo_id: obj.gmo_id,
        uri: obj.uri,
        label_en: obj.label_en
      }));
    }

    if(json.sub_classes){
      data.sub_classes = json.sub_classes.map(obj => ({
        gmo_id: obj.gmo_id,
        uri: obj.uri,
        label_en: obj.label_en
      }));
    }

    if(json.links){
      for(let i = 0; i < json.links.length; i++){
        let link = json.links[i];
        switch(true){
          case /pccompound/.test(link):
            data.links.push({
              "label": "PubChem",
              "uri": json.links[i]
            });
            break;
          case /wikipedia/.test(link):
            data.links.push({
              "label": "Wikipedia",
              "uri": json.links[i]
            });
            break;
          case /ncicb/.test(link):
            data.links.push({
              "label": "NCI Thesaurus",
              "uri": json.links[i]
            });
            break;
          case /CHEBI/.test(link):
            data.links.push({
              "label": "ChEBI",
              "uri": json.links[i]
            });
            break;
          case /SNOMEDCT/.test(link):
            data.links.push({
              "label": "SNOMED-CT",
              "uri": json.links[i]
            });
            break;
        }
      }
    }

    if(json.properties){
      data.properties = json.properties.map(obj => {
        obj.host = host;
        return obj;
      });

    }

    if(json.roles){
      data.roles = json.roles.map(obj => obj);
    }
  }

  function fail(e){
    error = true;
    msg = `Server Error: ${e}`;
  }

});


function makeOptions(params){
  let formBody = [];

  for(let key in params){
    if(params[key]){
      formBody.push(key + "=" + encodeURIComponent(params[key]));
    }
  }

  return {
    method: "POST",
    mode: "cors",
    body: formBody.join("&"),
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
}

Stanza(function(stanza, params){

  const api_name = "gmdb_component_by_gmoid";
  const api_url = "http://ep.dbcls.jp/sparqlist/api/";
  const options = makeOptions(params);
  const data = {};
  let msg = "";
  let error = false;

  if(!params["gmo_id"]){
    error = true;
    msg = "gmo_id (e.g. GMO_001010) is required";
  }


  fetch(api_url + api_name, options)
    .then(res => res.json())
    .then(json => success(json))
    .catch(error => fail())
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
    data.alt_labels_en = [];
    data.alt_labels_ja = [];
    data.super_classes = [];
    data.sub_classes = [];
    data.links = [];
    data.properties = [];
    data.roles = [];

    data.gmo_id = json.id;
    data.pref_label = json.pref_label;
    data.json_label_ja = json.label_ja;

    /*
     if(json.alt_labels_en){
     for(let i = 0; i < json.alt_labels_en.length; i++){
     if(i == 0){
     data.alt_labels_en.push({
     "label": "Alternative label",
     "value": json.alt_labels_en[i]
     });
     }else{
     data.alt_labels_en.push({
     "label": "",
     "value": json.alt_labels_en[i]
     });
     }
     }
     }*/
    if(json.alt_labels_en){
      data.alt_labels_en = json.alt_labels_en.map(str => ({value: str}));
    }
    if(json.super_classes){
      for(let i = 0; i < json.super_classes.length; i++){
        if(i == 0){
          data.super_classes.push({
            "label": "Super class",
            "gmo_id": json.super_classes[i].gmo_id,
            "uri": json.super_classes[i].uri,
            "label_en": json.super_classes[i].label_en
          });
        }else{
          data.super_classes.push({
            "label": "",
            "gmo_id": json.super_classes[i].gmo_id,
            "uri": json.super_classes[i].uri,
            "label_en": json.super_classes[i].label_en
          });
        }
      }
    }
    /*
     if(json.super_classes){
     data.super_classes = json.super_classes.map(obj => ({
     gmo_id: obj.gmo_id,
     uri: obj.uri,
     label_en: obj.label_en
     }));
     }

     */
    if(json.sub_classes){
      for(let i = 0; i < json.sub_classes.length; i++){
        if(i == 0){
          data.sub_classes.push({
            "label": "Sub class",
            "gmo_id": json.sub_classes[i].gmo_id,
            "uri": json.sub_classes[i].uri,
            "label_en": json.sub_classes[i].label_en
          });
        }else{
          data.sub_classes.push({
            "label": "",
            "gmo_id": json.sub_classes[i].gmo_id,
            "uri": json.sub_classes[i].uri,
            "label_en": json.sub_classes[i].label_en
          });
        }
      }
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
      for(let i = 0; i < json.properties.length; i++){
        data.properties.push(json.properties[i]);
      }
    }
    if(json.roles){
      for(let i = 0; i < json.roles.length; i++){
        data.roles.push(json.roles[i]);
      }
    }


  }

  function fail(){
    error = true;
    const gmo_id = params["gmo_id"];
    msg = `Not found. gmo_id: ${gmo_id}`;
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

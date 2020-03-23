Stanza(function(stanza, params){
  const api_url = "http://ep.dbcls.jp/sparqlist/api/";
  const api_name = `gmdb_medium_by_gmid`;
  const options = makeOptions(params);
  const data = {};
  let msg = "";
  let error = false;

  if(!params["gm_id"]){
    error = true;
    msg = "gm_id (e.g. XXXXX) is required";
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
    data.id = json.gm.toString().split("/").pop();
    data.name = json.name;
    data.components = json.components;
    data.components.forEach(elm => elm.can_wrap = elm.label_en.length >= 20);
    data.src_url = json.src_url;
    data.src_label = getSrcLabel(json.src_url);
  }

  function fail(e){
    const taxID = params["taxid"];
    error = true;
    msg = `Error: ${e}`;
  }
});

function getSrcLabel(str){
  console.log(str);
  switch(true){
    case str.match(/jcm\.riken/) !== null:
      return "JCM";
    case str.match(/nbrc\.nite/) !== null:
      return "NBRC";
    case str.match(/dsmz\.de/) !== null:
      return "DSMZ";
    case str.match(/atcc\.org/) !== null:
      return "ATCC";
    default:
      return "SRC";

  }
}

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


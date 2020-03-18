Stanza(function(stanza, params){

  const api_url = "http://ep.dbcls.jp/sparqlist/api/";
  const api_name = "gmdb_media_by_taxid";
  const options = makeOptions(params);
  const data = {};

  let msg = "";
  let error = false;

  if(!params["tax_id"]){
    error = true;
    msg = "tax_id (e.g. 203404) is required";
  }

  fetch(`${api_url}${api_name}`, options)
    .then(res => res.json())
    .then(json => success(json))
    .catch(error => fail(error))
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
      error = true;
      msg = `Not found. tax_id: ${params["tax_id"]}`;
      return;
    }

    data.body = {};
    data.body.media = [];

    for(let i = 0; i < json.length; i++){
      data.body.media.push({
        "gm_id": json[i].gm_id,
        "uri": json[i].uri,
        "label": json[i].label
      });
    }
  }

  function fail(e){
    error = true;
    msg = `Server Error ${e}`;
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

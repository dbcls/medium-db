Stanza(function(stanza, params){

  const api_url = "http://ep.dbcls.jp/sparqlist/api/";
  const api_name = "gmdb_media_by_taxid";
  const queryKey = "gmo_ids";
  const data = {};
  //
  let msg = "";
  let error = false;
  let q;


  if(!params[queryKey]){
    q = new Promise((resolve, error) => {
      error(`No Parameter. ${queryKey} (e.g. XXXXXXX) is required`);
    });
  }else{
    q = fetch(`${api_url}${api_name}`, makeOptions(params));
  }


  q.then(res => res.json())
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
      throw new Error(`Not found. ${queryKey}: ${params[queryKey]}`);
    }

    data.query = params[queryKey]
      .split(",")
      .map(str => `${str.trim()}`)
      .filter(str => !!str);
  }

  function fail(e){
    error = true;
    if(e.toString().match(/No Parameter/) !== null){
      msg = ``;
    }else{
      msg = `${e}`;
    }
  }
});


function makeOptions(params){
  let formBody = [];

  for(let key in params){
    if(params[key]){
      const value = params[key]
        .split(",")
        .map(str => str.trim())
        .filter(str => !!str)
        .join(",");
      formBody.push(key + "=" + encodeURIComponent(value));
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

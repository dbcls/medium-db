Stanza(function(stanza, params){

  const api_url = "http://ep.dbcls.jp/sparqlist/api/";
  const api_name = "gmdb_list_organisms_by_keyword";
  const queryKey = "keyword";
  const data = {};
  //
  data.query = params[queryKey]
    .split(",")
    .map(str => `${str.trim()}`)
    .filter(str => !!str);
  //
  let msg = "searching...";
  let error = false;
  stanza.render({
    template: "stanza.html",
    parameters: {
      result: data,
      msg: msg,
      error: error
    }
  });


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
      msg = "not found";
    }

    data.items = json;

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

Stanza(function(stanza, params) {

  let formBody = [];

  for (let key in params) {
    if (params[key]) {
      formBody.push(key + "=" + endocdeURIComponent(params[key]));
    }
  };

  let options = {
    method: "POST",
    mode: "cors",
    body: formBody.join("&"),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  let api_url = "http://ep.dbcls.jp/sparqlist/api/";
  let api_name = "gmdb_media_by_taxid";

  let q = fetch(api_url + api_name, options).then(res=>res.json());

  q.then(function(json) {
    let data = {};
    data.body = {};
    data.body.media = [];

    for (let i =0; i < json.length; i++) {
      data.body.media.push({"gm_id": json[i].gm_id,
                            "uri": json[i].uri,
                            "label": json[i].label});
    }

    stanza.render({
      template: "stanza.html",
      parameters: {
        result: data
      }
    });
  });
});

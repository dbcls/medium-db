Stanza(function(stanza, params) {

  let formBody = [];

  for (let key in params) {
    if (params[key]) {
      formBody.push(key + "=" + encodeURIComponent(params[key]));
    }
  }

  let options = {
    method: "POST",
    mode: "cors",
    body: formBody.join("&"),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  let apiUrl = "http://ep.dbcls.jp/sparqlist/api/";
  let apiName = "growth_medium";

  let q = fetch(apiUrl + apiName, options).then(res => res.json());
 
  q.then(function(json) {
    let data = {};
    data.body = {};
    data.body.components = [];

    data.body.uri = json.gm ;
    data.body.id  = json.gm.replace("http://purl.jp/bio/10/gm/", "");
    if (json.name)    data.body.name    = json.name;
    if (json.src_url) data.body.src_url = json.src_url;

    let sorted_components = Object.keys(json.components).sort();
    for (let i = 0; i < sorted_components.length; i++) {
      let component = json.components[sorted_components[i]];
      let c = {}; 
      c.id  = sorted_components[i];
      c.url = component.url;
      c.label = component.label;
      if (component.role) {
        c.role_label = component.role.label;
        c.role_url   = component.role.url;
      } else {
        c.role_label = "";
        c.role       = "";
      }
      data.body.components.push(c);
    }

    console.log(data);

    stanza.render({
      template: "stanza.html",
      parameters: {
        result: data
      }
    });
  });
});


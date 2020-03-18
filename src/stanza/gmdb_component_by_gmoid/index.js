Stanza(function(stanza, params) {

  let formBody = [];

  for (let key in params) {
    if (params[key]) {
      formBody.push(key + "=" + endocdeURIComponent(params[key]));
    }
  };

  const options = {
    method: "POST",
    mode: "cors",
    body: formBody.join("&"),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  let api_url = "http://ep.dbcls.jp/sparqlist/api/";
  let api_name = "gmdb_component_by_gmoid";

  let q = fetch(api_url + api_name, options).then(res=>res.json());

  console.log(q);
  q.then(function(json) {
    let data = {};
    data.body = {};
    data.body.alt_labels_en = [];
    data.body.alt_labels_ja = [];
    data.body.super_classes = [];
    data.body.sub_classes = [];
    data.body.links = [];
    data.body.properties = [];
    data.body.roles = [];

    data.body.gmo_id = json.id;
    data.body.pref_label = json.pref_label;
    data.body.json_label_ja = json.label_ja;

    if (json.alt_labels_en) {
      for (let i = 0; i < json.alt_labels_en.length; i++) {
        if (i == 0) {
          data.body.alt_labels_en.push({"label": "Alternative label",
                                        "value": json.alt_labels_en[i]});
        } else {
          data.body.alt_labels_en.push({"label": "",
                                        "value": json.alt_labels_en[i]});
        }
      }
    }
    if (json.super_classes) { 
      for (let i = 0; i < json.super_classes.length; i++) {
        if (i == 0) {
          data.body.super_classes.push({"label": "Super class",
                                        "gmo_id": json.super_classes[i].gmo_id,
                                        "uri": json.super_classes[i].uri,
                                        "label_en": json.super_classes[i].label_en});
        } else {
          data.body.super_classes.push({"label": "",
                                        "gmo_id": json.super_classes[i].gmo_id,
                                        "uri": json.super_classes[i].uri,
                                        "label_en": json.super_classes[i].label_en});
        }
      }
    }
    if (json.sub_classes) {
      for (let i = 0; i < json.sub_classes.length; i++) {
        if (i == 0) {
          data.body.sub_classes.push({"label": "Sub class",
                                      "gmo_id": json.sub_classes[i].gmo_id,
                                      "uri": json.sub_classes[i].uri,
                                      "label_en": json.sub_classes[i].label_en});
        } else {
          data.body.sub_classes.push({"label": "",
                                      "gmo_id": json.sub_classes[i].gmo_id,
                                      "uri": json.sub_classes[i].uri,
                                      "label_en": json.sub_classes[i].label_en});
        }
      }
    }
    if (json.links) {
      for (let i = 0; i < json.links.length; i++) {
        let link = json.links[i];
        switch(true) {
        case /pccompound/.test(link):
          data.body.links.push({"label": "PubChem",
                                "uri": json.links[i]});
          break;
        case /wikipedia/.test(link):
          data.body.links.push({"label": "Wikipedia",
                                "uri": json.links[i]});
          break;
        case /ncicb/.test(link):
          data.body.links.push({"label": "NCI Thesaurus",
                                "uri": json.links[i]});
          break;
        case /CHEBI/.test(link):
          data.body.links.push({"label": "ChEBI",
                                "uri": json.links[i]});
          break;
        case /SNOMEDCT/.test(link):
          data.body.links.push({"label": "SNOMED-CT",
                                "uri": json.links[i]});
          break;
        }
      }
    }
    if (json.properties) {
      for (let i = 0; i < json.properties.length; i++) {
        data.body.properties.push(json.properties[i]);
      }
    }
    if (json.roles) { 
      for (let i = 0; i < json.roles.length; i++) {
        data.body.roles.push(json.roles[i]);
      }
    }

    stanza.render({
      template: "stanza.html",
      parameters: {
        result: data
      }
    });
  });
});

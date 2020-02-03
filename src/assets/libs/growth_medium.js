(function(){
  const descriptor = {
    "templates": {"stanza.html": "\u003clink rel=\"stylesheet\" type=\"text/css\" href=\"https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.2.2/css/bootstrap.min.css\"\u003e\n\n\n\u003ch3\u003e{{result.body.id}}\u003c/h3\u003e\n\u003cdiv class=\"container\"\u003e\n  \u003cp class=\"mb-0\"\u003eName: {{result.body.name}}\u003c/p\u003e\n  \u003cp class=\"mb-0\"\u003e\u003ca href=\"{{result.body.src_url}}\"\u003eOriginal source\u003c/a\u003e\u003c/p\u003e\n\u003c/div\u003e\n\n\u003cdiv class=\"container\"\u003e\n\u003ch4\u003eMedium components\u003c/h4\u003e\n\u003ctable class=\"table\"\u003e\n  \u003cthead class=\"thead-light\"\u003e\n    \u003ctr\u003e\n      \u003cth\u003eGMO ID\u003c/th\u003e\n      \u003cth\u003eName\u003c/th\u003e\n      \u003cth\u003eRole\u003c/th\u003e\n    \u003c/tr\u003e\n  \u003c/thead\u003e\n  \u003ctbody\u003e\n    {{#each result.body.components}}\n    \u003ctr\u003e\n      \u003ctd\u003e{{id}}\u003c/td\u003e\n      \u003ctd\u003e{{label}}\u003c/td\u003e\n      \u003ctd\u003e{{role_label}}\u003c/td\u003e\n    \u003c/tr\u003e\n    {{/each}}\n  \u003c/tbody\u003e\n\u003c/table\u003e\n\u003c/div\u003e\n"},
    "parameters": ["gm_id"],
    "elementName": "togostanza-growth_medium",
    "development": true
  };

  if("Promise" in window && "URLSearchParams" in window && "fetch" in window){
    const Stanza = TogoStanza.initialize(descriptor);

    Stanza(function(stanza, params){

      let formBody = [];

      for(let key in params){
        if(params[key]){
          formBody.push(key + "=" + encodeURIComponent(params[key]));
        }
      }

      let options = {
        method: "POST",
        mode: "cors",
        body: formBody.join("&"),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        }
      };

      let apiUrl = "http://ep.dbcls.jp/sparqlist/api/";
      let apiName = "growth_medium";

      let q = fetch(apiUrl + apiName, options).then(res => res.json());

      q.then(function(json){
        let data = {};
        data.body = {};
        data.body.components = [];

        data.body.uri = json.gm;
        data.body.id = json.gm.replace("http://purl.jp/bio/10/gm/", "");
        if(json.name){
          data.body.name = json.name;
        }
        if(json.src_url){
          data.body.src_url = json.src_url;
        }

        let sorted_components = Object.keys(json.components).sort();
        for(let i = 0; i < sorted_components.length; i++){
          let component = json.components[sorted_components[i]];
          let c = {};
          c.id = sorted_components[i];
          c.url = component.url;
          c.label = component.label;
          if(component.role){
            c.role_label = component.role.label;
            c.role_url = component.role.url;
          }else{
            c.role_label = "";
            c.role = "";
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


  }else{
    const element = document.querySelector(descriptor.elementName);

    element.innerHTML =
      "<p>Your Web browser does not support the features required for the stanza to work. If you are using Internet Explorer 11, placing the following snippet before loading webcomponents-loader.js may resolve this issue:</p>\n<pre><code>&lt;script src=\"https://cdn.jsdelivr.net/combine/npm/@babel/polyfill@7.2.5/dist/polyfill.min.js,npm/@ungap/url-search-params@0.1.2/min.js,npm/whatwg-fetch@3.0.0/dist/fetch.umd.js\" crossorigin&gt;&lt;/script&gt;</code></pre>";
  }
})();

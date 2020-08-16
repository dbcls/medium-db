

Stanza(function(stanza, params) {

    let formBody = [];
    for (let key in params) {
        if(params[key]) formBody.push(key + "=" + encodeURIComponent(params[key]));
    }

    let options = {
        method: "POST",
        mode:  "cors",
        body: formBody.join("&"),
        headers: {
            "Accept": "application/json",
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    let apiUrl = "http://ep.dbcls.jp/sparqlist/api/";
    let apiName = "gms_by_tids";

    let q = fetch(apiUrl + apiName, options).then(res => res.json());

    q.then(function(json){

	let data = {};
	let component = {};
	let keys = Object.keys(json);

	for(let i = 0; i < keys.length; i++){
	    if(json[keys[i]].component){
		for(let j = 0; j < json[keys[i]].component.length; j++){
		    component[json[keys[i]].component[j]] = 1;
		}
	    }
	}
	let sortedComponent = Object.keys(component);
	data.head = [{text: "Organism", cols: 1, rows: 2}, {text: "Growth medium", cols: 1, rows: 2}, {text: "Components", cols: sortedComponent.length, rows: 1}];
	data.subHead = [];
	for(let i = 0; i < sortedComponent.length; i++){
	    data.subHead.push({text: sortedComponent[i].replace("http://purl.jp/bio/10/gmo/", "")});
	}
	data.body = [];

	for(let i = 0; i < keys.length; i++){
	    if(keys[i].match(/^T\d{5}$/)){
		let list = [];
		for(let j = 0; j < json[keys[i]].gm.length; j++){
		    let exist = [];
		    for(let k = 0; k < sortedComponent.length; k++){
			if(json[json[keys[i]].gm[j]].component.includes(sortedComponent[k])) exist.push({color: "mediumaquamarine"});
			else exist.push({color: "transparent"});
		    }
		    list.push({label: json[keys[i]].gm[j].replace("http://purl.jp/bio/10/gm/", ""), exist: exist});
		}
		data.body.push({organism: keys[i], rows: json[keys[i]].gm.length, gm: list})
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

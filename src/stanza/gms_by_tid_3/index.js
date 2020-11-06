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
  let apiName = "gms_by_kegg_tids_3";
  let q = fetch(apiUrl + apiName, options).then(res => res.json());

  let mouseX = 0;
  let mouseY = 0;
  document.body.addEventListener("mousemove", function(e){
    // console.log(e);
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  q.then(function(json){

    let group_count = {};
    let group_label = {};
    for(let gm of json.growth_media){
      let groups = Object.keys(gm.components_group);
      for(let group of groups){
        if(!group_count[group]){
          group_count[group] = 0;
          group_label[group] = gm.components_group[group].label;
        }
        group_count[group]++;
      }
    }

    // sort component_group by component count
    let groups = Object.keys(group_count)
      .map(function(group){ return {uri: group, count: group_count[group], label: group_label[group]}; });
    let sorted_groups = groups.sort(function(a, b){
      if(a.count > b.count){
        return -1;
      }
      if(a.count < b.count){
        return 1;
      }
      return 0;
    });

    // hash to list 'components_group'
    for(let gm of json.growth_media){
      gm.components_group_list = [];
      for(let group of sorted_groups){
        if(gm.components_group[group.uri]){
          gm.components_group_list.push(
            {elements: gm.components_group[group.uri].elements});
        }else{
          gm.components_group_list.push({elements: []});
        }
      }
    }


    stanza.render({
      template: "stanza.html"
    });

    let makeTable = function(){
      let renderDiv = d3.select(stanza.select("#table_area"));
      let mainTable = renderDiv.append("table");
      let popup = renderDiv.append("div")
        .attr("id", "popup")
        .style("display", "none")
        .style("position", "fixed")
        .style("padding", "10px")
        .style("background-color", "rgba(255,255,255,0.75)")
        .style("border", "solid 2px #888888")
        .style("max-width", "300px")
        .style("z-index",10);

      // thead
      let thead = mainTable.append("thead");
      let tr = thead.append("tr");
      tr.append("th").attr("class", "header").text("Medium");
      tr.append("th").attr("class", "header").text("Organisms");
      tr.append("th").attr("class", "header").attr("colspan", sorted_groups.length).text("Components");
      tr = thead.append("tr");
      tr.append("th");
      tr.append("th");
      tr.selectAll(".role_component")
        .data(sorted_groups)
        .enter()
        .append("th").attr("class", "role_component")
        .append("a").attr("href", function(d){ return "/component/" + d.uri.replace("http://purl.jp/bio/10/gmo/", "");})
        .append("div").attr("class", "entypo-db-shape role_component_style")
        .on("mouseover", function(d){
          renderDiv.select("#popup")
            .style("left", (mouseX + 10) + "px").style("top", (mouseY - 10) + "px").style("display", "block")
            .text(d.label);
        })
        .on("mouseout", function(d){
          renderDiv.select("#popup").style("display", "none");
        });

      // tbody
      let tbody = mainTable.append("tbody");
      tr = tbody.selectAll(".organism_line")
        .data(json.growth_media)
        .enter()
        .append("tr").attr("class", "organism_line");
      tr.append("td").attr("class", "medium")
        .append("a").attr("href", function(d){ return "/medium/" + d.uri.replace("http://purl.jp/bio/10/gm/", "");})
        .text(function(d){ return d.uri.replace("http://purl.jp/bio/10/gm/", "");})
        .on("mouseover", function(d){
          renderDiv.select("#popup")
            .style("left", (mouseX + 10) + "px").style("top", (mouseY - 10) + "px").style("display", "block")
            .text(d.label);
        })
        .on("mouseout", function(d){
          renderDiv.select("#popup").style("display", "none");
        });
      tr.append("td")
        .attr("class", "organism")
        .html(function(d){ return d.species.map(x => x.tid).join("<br>"); })
        .on("mouseover", function(d){
          renderDiv.select("#popup")
            .style("left", (mouseX + 10) + "px").style("top", (mouseY - 10) + "px").style("display", "block")
            .html(d.species.map(x => x.label).join("<br>"));
        })
        .on("mouseout", function(d){
          renderDiv.select("#popup").style("display", "none");
        });

      let td = tr.selectAll(".component")
        .data(function(d){ return d.components_group_list; })
        .enter()
        .append("td").attr("class", "component")
        .filter(function(d){ return d.elements[0];})
        .selectAll(".medium_list")
        .data(function(d){ return d.elements; })
        .enter()
        .append("a").attr("class", "medium_list")
        .attr("href", function(d){ return "/component/" + d.component.uri.replace("http://purl.jp/bio/10/gmo/", "");})
        .append("div").attr("class", "entypo-db-shape component_style")
        .on("mouseover", function(d){
          renderDiv.select("#popup")
            .style("left", (mouseX + 10) + "px").style("top", (mouseY - 10) + "px").style("display", "block")
            .text(d.component.label);
        })
        .on("mouseout", function(d){
          renderDiv.select("#popup").style("display", "none");
        });

      // tfoot
      let tfoot = mainTable.append("tfoot");
      tr = tfoot.append("tr");
      tr.append("td");
      tr.append("td");
      tr.selectAll(".component_label")
        .data(sorted_groups)
        .enter()
        .append("td")
        .attr("class", "component_label")
        .append("p")
        .text(function(d){ return d.label; });


      const subTable = makeSubTable(renderDiv, json);
      fitSubTableHeight(mainTable.node(), subTable.node());
      makeScrollable(renderDiv.node(), mainTable.node(), subTable.node());
    };

    makeTable();

  });

  const makeSubTable = (renderDiv, json) => {
    const subTable = renderDiv.append("table");
    subTable.classed("sub-table", true);

    let thead = subTable.append("thead");
    let tr = thead.append("tr");
    tr.append("th").attr("class", "header").text("Medium");
    tr.append("th").attr("class", "header").text("Organisms");
    tr = thead.append("tr");
    tr.append("th");
    tr.append("th");


    // tbody
    let tbody = subTable.append("tbody");
    tr = tbody.selectAll(".organism_line")
      .data(json.growth_media)
      .enter()
      .append("tr").attr("class", "organism_line");
    tr.append("td").attr("class", "medium")
      .append("a").attr("href", function(d){ return "/medium/" + d.uri.replace("http://purl.jp/bio/10/gm/", "");})
      .text(function(d){ return d.uri.replace("http://purl.jp/bio/10/gm/", "");})
      .on("mouseover", function(d){
        renderDiv.select("#popup")
          .style("left", (mouseX + 10) + "px").style("top", (mouseY - 10) + "px").style("display", "block")
          .text(d.label);
      })
      .on("mouseout", function(d){
        renderDiv.select("#popup").style("display", "none");
      });
    tr.append("td")
      .attr("class", "organism")
      .html(function(d){ return d.species.map(x => x.tid).join("<br>"); })
      .on("mouseover", function(d){
        renderDiv.select("#popup")
          .style("left", (mouseX + 10) + "px").style("top", (mouseY - 10) + "px").style("display", "block")
          .html(d.species.map(x => x.label).join("<br>"));
      })
      .on("mouseout", function(d){
        renderDiv.select("#popup").style("display", "none");
      });

    let tfoot = subTable.append("tfoot");
    tr = tfoot.append("tr");
    tr.append("td");
    tr.append("td");


    return subTable;

  };
  const fitSubTableHeight = (main, sub) => {
    const header2Height = main.querySelector("thead tr:nth-child(2) th").getBoundingClientRect().height;
    sub.querySelector("thead tr:nth-child(2) th").style.height = `${header2Height}px`;
    const footerHeight = main.querySelector("tfoot td").getBoundingClientRect().height;
    sub.querySelector("tfoot td").style.height = `${footerHeight}px`;
    const mainBodyRows = main.querySelectorAll("tbody tr");
    const subBodyRows = sub.querySelectorAll("tbody tr");
    mainBodyRows.forEach((elm, i) => {
      const bound = elm.getBoundingClientRect();
      subBodyRows[i].style.width = `${bound.width}px`;
      subBodyRows[i].style.height = `${bound.height}px`;
    });
  };
  const makeScrollable = (wrapper, main, sub) => {
    const scroller = document.createElement("div");
    scroller.classList.add("scroller");
    wrapper.prepend(scroller);
    scroller.append(main);

    wrapper.style.position = "relative";
    scroller.style.overflowX="auto";
    sub.style.position = "absolute";
    sub.style.left = "0";
    sub.style.top = "0";
  };

});

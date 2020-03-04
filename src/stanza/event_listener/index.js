Stanza(function(stanza, params) {
  var q = stanza.query({
      endpoint: "http://integbio.jp/rdf/sparql",
      template: "stanza.rq",
      parameters: params
  });

  q.then(function(data) {
    stanza.render({
      template: "stanza.html",
    });
    //プルダウンリストを初期値の値にセット
    $(stanza.select('#current_value')).html(stanza.select('#select1').value);

    //use plain javascript
    stanza.select('#button1').addEventListener("click", function(e) {
      alert('button is clicked!');
    });

    //use jQuery 
    $(stanza.select('#select1')).on('change', function(e) {
      $(stanza.select('#current_value')).empty();
      $(stanza.select('#current_value')).html(stanza.select('#select1').value);
    });
  });
});

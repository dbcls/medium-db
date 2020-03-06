Stanza(function(stanza, params){
  const query = params["query"];
  stanza.render({
    template: "stanza.html",
    parameters: {
      query: query,
      greeting: "Hello, Organisms!"
    }
  });
});

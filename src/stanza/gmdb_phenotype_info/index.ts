Stanza(function(stanza, params) {
  stanza.render({
    template: "stanza.html",
    parameters: {
      greeting: "Hello, world!"
    }
  });
});


const dummyData: PhenotypeInfo = {
  cell_shape: "Show cell shape",
  temperature_range: "Mesophilic",
  motility: "Nonmotile",
  staining: "Gram negative",
  energy_source: "Photosynthetic",
};


interface PhenotypeInfo {
  cell_shape: string;
  temperature_range: string;
  motility: string;
  staining: string;
  energy_source: string;
}

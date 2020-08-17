declare function Stanza<T = any>(func: (stanza: StanzaInstance, params: T) => void): void;

interface StanzaInstance {
  render: (opts: StanzaOptions) => void;
}

interface StanzaOptions {
  template: string;
  parameters: any;
}

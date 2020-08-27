declare function Stanza<T = any>(func: (stanza: StanzaInstance, params: T) => void): void;

interface StanzaInstance {
  render: (opts: StanzaOptions) => void;
  select: (query: string) => HTMLElement;
}

interface StanzaOptions {
  template: string;
  parameters: any;
}

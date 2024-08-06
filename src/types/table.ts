export type Header = {
  name: JSX.Element | string;
  data: string;
  size?: string;
  action?: JSX.Element;
};

export type Body = {
  name: JSX.Element | string;
  action?: JSX.Element;
};

export interface TableHelper {
  head: Array<Header>;
  body: Array<Array<Body>>;
}

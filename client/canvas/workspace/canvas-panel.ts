import { bindable } from 'aurelia-framework';

export class CanvasPanel {
  @bindable links: Link[];
  @bindable nodes: XXNode[];

  constructor() {
    this.links = [
      new Link({ x: 560, y: 126.5, w: 681 - 560, h: 151 - 126.5 }),
      new Link({ x: 233, y: 163, w: 360 - 233, h: 107 - 166 }),
    ];

    console.log('hi');
    this.nodes = [
      new XXNode("705907dc.e84de8", { x: 360, y: 62, w: 200, h: 90 }, "Subflow XXYZABCD", 1, 6),
      new XXNode("b68864bd.95a268", { x: 73, y: 148, w: 160, h: 30 }, "time:timestamp", 0, 1),
      new XXNode("7a258035.5286c", { x: 96, y: 53, w: 130, h: 30 }, "timestamp", 0, 1),
      new XXNode("767bbbc0.b80e94", { x: 681, y: 136, w: 100, h: 30 }, "msg", 1, 0),
    ]
  }
}

export class Link {
  constructor(params: { x: number, y: number, w: number, h: number }) {
    let { x, y, w, h } = params;

    this.x = x; this.y = y; this.w = w; this.h = h;
  }

  x: number;
  y: number;
  w: number;
  h: number;

  get svgcurve(): string {
    let s = 'M ' + this.x + " " + this.y;
    s += " C";
    s += " " + (this.x + this.w * .62);
    s += " " + (this.y + this.h * .5);
    s += " " + (this.x + this.w * .38);
    s += " " + (this.y + this.h * 1);

    s += " " + (this.x + this.w * 1);
    s += " " + (this.y + this.h * 1);

    return s;
  }
}

export class XXNode {
  constructor(id: string, params: { x: number, y: number, w: number, h: number }, label: string, nIn: number, nOut: number) {
    let { x, y, w, h } = params;

    console.log('hi');

    this.x = x; this.y = y; this.w = w; this.h = h;
    this.id = id;
    this.label = label;
    this.nIn = nIn;
    this.nOut = nOut;
    this.r = (nOut == 0);
    this.col = (nIn == 0) ? "#a6bbcf"
      : (nOut == 0) ? "#87a980" : "#da9"
  }

  id: string;
  label: string;
  nIn: number;
  nOut: number;
  col: string;

  x: number;
  y: number;
  w: number;
  h: number;

  icon: string = 'subflow.png';
  r: boolean;
}

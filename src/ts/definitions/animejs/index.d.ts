import AnimeStatic = anime.AnimeStatic;
import AnimeTimeLine = anime.Timeline;
import AnimeParams = anime.Params;
import AnimeInstance = anime.Params;
import AnimePathInfo = anime.PathInfo;

declare const anime: AnimeStatic;

declare namespace anime {

  interface AnimeStatic {
    <T>(params?: AnimeParams<T>): AnimeInstance;

    stagger(value: number | [number, number], opts?: StaggeringOptions): StaggeringObject;

    timeline<T>(params?: Params<T>): AnimeTimeLine;

    path(target: Target): AnimePathInfo;

    setDashoffset: number;

    remove(target: Targets): void;

    get(target: Targets, propName: string, unit?: string): number

    set(target: Targets, values: ValueParameters): void;

    random(min: number, max: number): number;

    tick(time: number): void;

    running: Instance[];
  }

  interface Instance extends AnimationControl {
  }

  interface Timeline extends AnimationControl {
    add<T>(params?: Params<T>, offset?: number | string): Timeline;
  }

  type Target = string | Element | null;
  type Targets = Target | Target[] | NodeList;

  type BasicValueTypes = number | string;
  type FunctionBasedParameters = (el: Element, index: number, targetsLength: number) => BasicValueTypes;
  type FromToValues = [BasicValueTypes, BasicValueTypes];
  type PointValue = { value: string | string[] };
  type ValueTypes =
    BasicValueTypes |
    FromToValues |
    FunctionBasedParameters |
    SpecificPropertyParameters |
    SpecificPropertyParameters[] |
    PointValue |
    PointValue [];

  interface Params<T = any> extends ValueParameters, PropertyParameters, AnimationParameters, CallBacks {
    targets?: Targets | T;
    keyframes?: (ValueParameters | PropertyParameters)[]
  }

  interface SpecificPropertyParameters extends PropertyParameters {
    value?: number;
  }

  interface PropertyParameters {
    duration?: number | FunctionBasedParameters | StaggeringObject;
    delay?: number | FunctionBasedParameters | StaggeringObject;
    elasticity?: number | FunctionBasedParameters | StaggeringObject;
    endDelay?: number | FunctionBasedParameters | StaggeringObject;
    easing?: Easing | Function;
    round?: number;
  }

  interface AnimationParameters {
    direction?: 'normal' | 'reverse' | 'alternate';
    loop?: number | boolean;
    autoplay?: boolean;
  }

  interface ValueParameters {
    // Transformations
    translateX?: ValueTypes;
    translateY?: ValueTypes;
    translateZ?: ValueTypes;
    rotate?: ValueTypes;
    rotateX?: ValueTypes;
    rotateY?: ValueTypes;
    rotateZ?: ValueTypes;
    scale?: ValueTypes;
    scaleX?: ValueTypes;
    scaleY?: ValueTypes;
    scaleZ?: ValueTypes;
    skew?: ValueTypes;
    skewX?: ValueTypes;
    skewY?: ValueTypes;
    perspective?: ValueTypes;

    // CSS
    opacity?: ValueTypes;
    color?: ValueTypes;
    backgroundColor?: ValueTypes;
    left?: ValueTypes;
    top?: ValueTypes;
    border?: ValueTypes;

    // SVG
    points?: ValueTypes;
    baseFrequency?: ValueTypes;
    strokeDashoffset?: ValueTypes;

    // DOM
    value?: ValueTypes;

    // Custom Props
    [prop: string]: any
  }

  interface CallBacks {
    update?: (info: AnimationInfo) => void;
    begin?: (info: AnimationInfo) => void;
    complete?: (info: AnimationInfo) => void;
    loopBegan?: (info: AnimationInfo) => void;
    loopComplete?: (info: AnimationInfo) => void;
    changeBegan?: (info: AnimationInfo) => void;
    changeComplete?: (info: AnimationInfo) => void;
  }

  interface PathInfo {
    (val: 'x' | 'y' | 'angle'): number;
  }

  interface AnimationInfo {
    progress: number;
    updates: number;
    began: boolean;
    completed: boolean;
  }

  interface AnimationControl {
    play(): void;

    pause(): void;

    restart(): void;

    reverse(): void;

    seek(val: number): void;

    finished: Promise<any>;
  }

  interface StaggeringObject {
  }

  interface StaggeringOptions {
    start?:number;
    from?: 'first' | 'last' | 'center' | number;
    direction?: 'normal' | 'reverse';
    easing?: Easing;
    grid?: [number, number];
    axis?: 'x' | 'y';
  }


  type Easing =
    'easeInSine' |
    'easeOutSine' |
    'easeInOutSine' |
    'easeInCirc' |
    'easeOutCirc' |
    'easeInOutCirc' |
    'easeInElastic' |
    'easeOutElastic' |
    'easeInOutElastic' |
    'easeInBack' |
    'easeOutBack' |
    'easeInOutBack' |
    'easeInBounce' |
    'easeOutBounce' |
    'easeInOutBounce' |
    'easeInQuad' |
    'easeOutQuad' |
    'easeInOutQuad' |
    'easeInCubic' |
    'easeOutCubic' |
    'easeInOutCubic' |
    'easeInQuart' |
    'easeOutQuart' |
    'easeInOutQuart' |
    'easeInQuint' |
    'easeOutQuint' |
    'easeInOutQuint' |
    'easeInExpo' |
    'easeOutExpo' |
    'easeInOutExpo' |
    'linear' |
    'spring' |
    CustomEasingFunction |
    string |
    [number, number, number, number];


  type CustomEasingFunction =
    (el: Element, index: number, targetsLength: number) =>
      (time: number) => number;
}


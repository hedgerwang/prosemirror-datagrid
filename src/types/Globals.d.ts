// https://stackoverflow.com/questions/41336858/how-to-import-css-modules-with-typescript-react-and-webpack
declare module '*.css';

// This turns image file into valid ES6 module so they can be safely imported
// into TypeScript file.
// https://duncanleung.com/typescript-module-declearation-svg-img-assets/

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const content: any;
  export default content;
}

// https://github.com/wes566/sample-react-ts-consumes-web-component/blob/20a236e2d54ef10a23e7688db336a41f50e9594f/README.md
declare namespace JSX {
  interface IntrinsicElements {
    'pm-data-grid': any;
  }
}

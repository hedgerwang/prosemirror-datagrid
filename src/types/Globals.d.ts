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


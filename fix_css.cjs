const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

// Replace body background
css = css.replace(
`html,
body {
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  background-color: var(--color-brand-bg);
  color: #fff;
  overflow-x: hidden;
  width: 100%;
  min-height: 100vh;
}`,
`@custom-variant dark (&:where(.dark, .dark *));

html,
body {
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  background-color: #FAFAFE;
  color: #1E293B;
  overflow-x: hidden;
  width: 100%;
  min-height: 100vh;
}

html.dark body {
  background-color: var(--color-brand-bg);
  color: #fff;
}

html.dark ::-webkit-scrollbar-track {
  background: #0F0C15;
}
html.dark ::-webkit-scrollbar-thumb {
  background: #2D243F;
}
`
);

css = css.replace(
`::-webkit-scrollbar-track {
  background: #0F0C15;
}
::-webkit-scrollbar-thumb {
  background: #2D243F;
  border-radius: 4px;
}`,
`::-webkit-scrollbar-track {
  background: #F1F5F9;
}
::-webkit-scrollbar-thumb {
  background: #CBD5E1;
  border-radius: 4px;
}`
);

fs.writeFileSync('src/index.css', css);

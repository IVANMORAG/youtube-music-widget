import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export default async (req, res) => {
  const { createServer } = require('vite');
  const react = require('@vitejs/plugin-react');
  const { renderToString } = require('react-dom/server');
  const React = require('react');
  const App = require('../../src/App').default;

  const server = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    plugins: [react()]
  });

  const app = React.createElement(App);
  const html = await renderToString(app);

  res.setHeader('Content-Type', 'image/svg+xml');
  res.status(200).send(`
    <svg xmlns="http://www.w3.org/2000/svg" width="340" height="240" viewBox="0 0 340 240">
      <foreignObject width="340" height="240">
        <div xmlns="http://www.w3.org/1999/xhtml">
          <style>
            body { margin: 0; }
            ${require('fs').readFileSync('./src/App.css', 'utf8')}
          </style>
          ${html}
        </div>
      </foreignObject>
    </svg>
  `);
};

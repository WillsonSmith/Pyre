import { html, css, isServer } from 'lit';
export const title = 'Home page';
export const links = [
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
  },
];

export const styles = css`
  body {
    font-family: 'Roboto', sans-serif;
  }
`;

export const initialData = {
  pageContent: 'Hello!',
};

export default ({ pageContent } = initialData) => {
  if (isServer) {
    // perform some build time logic
  }
  return html`
    <main>
      <h1>Pyre</h1>
      <p>${pageContent}</p>
    </main>
  `;
};

export const update = async () => {
  // perform some client-side data hydration
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ pageContent: 'Asychronously updated!' });
    }, 2000);
  });
};

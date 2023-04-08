import { html, css } from 'lit';
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
    margin: 0;
  }
  h1 {
    margin: 0;
  }
`;

export const initialData = {
  pageContent: 'Hello!',
};

export default () => {
  return html`
    <main>
      <h1>Pyre</h1>
      <div>
        <p>Building websites the <s>new</s> old way.</p>
      </div>
    </main>
  `;
};

import { html, css } from 'lit';
export const title = 'Home page';

export const links = [
  {
    rel: 'stylesheet',
    href: './css/resets.css',
  },
];

export const initialData = {
  pageContent: 'Hello!',
};

export const styles = css`
  .hero {
    height: 50vh;
    width: 100%;
    background: var(--sl-color-orange-300);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .content {
    max-width: calc(60ch * 1.5);
    margin: 0 auto;
    padding-inline: var(--spacing-lg);
    margin-block-start: var(--spacing-lg);
  }
`;

import './components/home-block.js';

export default () => {
  return html`
    <main>
      <div class="hero">
        <h1>Pyre</h1>
        <p>Building websites the <s>new</s> old way.</p>
      </div>
      <div class="content">
        <home-block url="https://via.placeholder.com/300" image-alt="Static">
          <div>
            <h2>Static</h2>
            <p>
              Pyre is a static site generator. It doesn't use a database, and it doesn't need a
              server.
            </p>
          </div>
        </home-block>
        <home-block>
          <div>
            <h2>Fast</h2>
            <p>
              Pyre is fast. It uses the latest web technologies to deliver a fast and responsive
              experience.
            </p>
          </div>
          <div slot="image">
            <img width="300" height="300" src="https://via.placeholder.com/300" alt="Fast" />
          </div>
        </home-block>
        <home-block>
          <div>
            <h2>Simple</h2>
            <p>
              Pyre is simple. It uses a simple templating language, and it doesn't require any
              configuration.
            </p>
          </div>
          <div slot="image">
            <img width="300" height="300" src="https://via.placeholder.com/300" alt="Simple" />
          </div>
        </home-block>
      </div>
    </main>
  `;
};

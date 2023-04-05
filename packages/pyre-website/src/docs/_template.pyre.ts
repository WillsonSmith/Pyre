import { html } from 'lit';

export default async ({ title }) => {
  return html`
    <h1>${title}</h1>
    <p><!-- PYRE:MARKDOWN --></p>
  `;
};

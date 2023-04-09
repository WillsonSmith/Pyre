import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('home-block')
export class HomeBlock extends LitElement {
  @property({ type: String }) url?: string;
  @property({ type: String }) imageAlt?: string;

  render() {
    return html`
      <div class="home-block">
        <div class="detail"><slot></slot></div>
        <div class="image">
          ${this.url ? html`<img src="${this.url}" alt=${this.imageAlt} />` : html``}
        </div>
      </div>
    `;
  }
  static styles = css`
    :host {
      display: block;
    }

    .home-block {
      display: flex;

      align-items: center;
      gap: var(--spacing-lg);
    }

    .image {
      aspect-ratio: 1 / 1;
    }

    .image img {
      display: block;
      aspect-ratio: 1;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'home-block': HomeBlock;
  }
}

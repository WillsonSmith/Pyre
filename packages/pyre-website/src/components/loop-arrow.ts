import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('loop-arrow')
export class LoopArrow extends LitElement {
  @property({ type: Object }) curves: { x: number; y: number }[] = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];

  render() {
    return html` ➰ `;
  }

  static styles = css`
    :host {
      display: block;
    }
    svg {
      display: block;
      width: 100%;
      height: 100%;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'loop-arrow': LoopArrow;
  }
}

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
console.log('test');
@customElement('scribble-arrow')
export class ScribbleArrow extends LitElement {
  @property({ type: Number }) startX = 0;
  @property({ type: Number }) startY = 0;
  @property({ type: Number }) endX = 100;
  @property({ type: Number }) endY = 100;
  @property({ type: String }) strokeColor = 'black';
  @property({ type: Number }) strokeWidth = 2;
  @property({ type: Number }) arrowSize = 10;

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

  render() {
    const path = this.generateScribbledPath();
    return html`
      <svg width="100%" height="100%">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="${this.arrowSize}"
            markerHeight="${this.arrowSize}"
            refX="${this.arrowSize / 2}"
            refY="${this.arrowSize / 2}"
            orient="auto"
          >
            <polygon points="0 0, ${this.arrowSize} ${this.arrowSize / 2}, 0 ${this.arrowSize}" />
          </marker>
        </defs>
        <path
          d="${path}"
          stroke="${this.strokeColor}"
          stroke-width="${this.strokeWidth}"
          fill="none"
          marker-end="url(#arrowhead)"
        />
      </svg>
    `;
  }

  generateScribbledPath() {
    const segments = 30;
    const amplitude = 25;
    const wavelength = Math.sqrt(
      Math.pow(this.endX - this.startX, 2) + Math.pow(this.endY - this.startY, 2),
    );
    const frequency = segments / wavelength;
    const points = [{ x: this.startX, y: this.startY }];
    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      const x =
        this.startX * (1 - t) +
        this.endX * t +
        Math.sin(frequency * t * Math.PI * 2) * amplitude * (Math.random() - 0.5);
      const y =
        this.startY * (1 - t) +
        this.endY * t +
        Math.cos(frequency * t * Math.PI * 2) * amplitude * (Math.random() - 0.5);
      points.push({ x, y });
    }
    points.push({ x: this.endX, y: this.endY });
    let pathData = `M ${points[0].x} ${points[0].y} `;
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const curPoint = points[i];
      const midPoint = {
        x: (prevPoint.x + curPoint.x) / 2,
        y: (prevPoint.y + curPoint.y) / 2,
      };
      pathData += `Q ${prevPoint.x} ${prevPoint.y} ${midPoint.x} ${midPoint.y} `;
    }
    return pathData;
  }
}

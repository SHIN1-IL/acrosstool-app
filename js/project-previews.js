function projectPreviewMarkup(kind, label) {
  const name = previewEscape(label || "");
  if (kind === "wall") return wallPreview(name);
  if (kind === "lab") return labPreview(name);
  if (kind === "monitor") return monitorPreview(name);
  return "";
}

function previewEscape(str) {
  return String(str).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[ch]));
}

function wallPreview(label) {
  return `
    <svg class="project-card__preview preview-wall" viewBox="0 0 640 400" role="img" aria-label="${label}">
      <defs>
        <linearGradient id="wall-meteor-tail" gradientUnits="userSpaceOnUse" x1="4" y1="0" x2="-120" y2="0">
          <stop offset="0" stop-color="#000000"></stop>
          <stop offset="0.72" stop-color="#000000"></stop>
          <stop offset="1" stop-color="#000000" stop-opacity="0"></stop>
        </linearGradient>
      </defs>
      <rect class="preview-wall__sky" width="640" height="400"></rect>
      <path class="preview-wall__hill preview-wall__hill--far" d="M0 146 C90 86 170 118 236 168 C292 210 262 258 186 292 C96 334 0 292 0 292 Z"></path>
      <path class="preview-wall__hill preview-wall__hill--mid" d="M210 240 C310 150 410 118 496 146 C566 168 612 132 640 116 L640 400 L248 372 Z"></path>
      <path class="preview-wall__hill preview-wall__hill--near" d="M0 228 C110 186 176 224 236 286 C286 334 246 378 150 400 L0 400 Z"></path>
      <path class="preview-wall__route" d="M200 308 C236 292 258 260 286 226 C314 192 336 172 368 162"></path>
      <path class="preview-wall__route preview-wall__route--far" d="M456 146 C500 128 548 114 590 102 C614 94 636 84"></path>
      <path class="preview-wall__fill" d="M42 386 L42 334 L198 306 L214 352 Z"></path>
      ${wallMerlons()}
      <g class="preview-wall__tower">
        <rect x="0" y="286" width="44" height="114"></rect>
        <rect x="2" y="272" width="11" height="16"></rect>
        <rect x="17" y="272" width="11" height="16"></rect>
        <rect x="32" y="272" width="11" height="16"></rect>
        <rect class="preview-wall__window" x="12" y="318" width="8" height="14"></rect>
        <rect class="preview-wall__window" x="26" y="318" width="8" height="14"></rect>
      </g>
      <g class="preview-wall__tower">
        <rect x="348" y="118" width="36" height="50"></rect>
        <rect x="348" y="106" width="9" height="14"></rect>
        <rect x="361" y="106" width="9" height="14"></rect>
        <rect x="374" y="106" width="9" height="14"></rect>
        <rect class="preview-wall__window" x="358" y="136" width="7" height="12"></rect>
        <rect class="preview-wall__window" x="370" y="136" width="7" height="12"></rect>
      </g>
      <g class="preview-wall__tower">
        <rect x="548" y="62" width="30" height="44"></rect>
        <rect x="548" y="52" width="8" height="12"></rect>
        <rect x="559" y="52" width="8" height="12"></rect>
        <rect x="570" y="52" width="8" height="12"></rect>
      </g>
      <path class="preview-wall__shield" d="M470 206 l16-7 v20 c0 14-16 22-16 22 s-16-8-16-22 v-20 z"></path>
      <g class="preview-wall__meteor" transform="translate(346 170)">
        <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.08;0.62;0.74;1" dur="2.6s" repeatCount="indefinite"></animate>
        <animateTransform attributeName="transform" type="translate" values="128 294; 564 46; 564 46" keyTimes="0;0.7;1" dur="2.6s" repeatCount="indefinite"></animateTransform>
        <g transform="rotate(-29.6)">
          <polygon points="6,-2.4 -118,0 6,2.4" fill="url(#wall-meteor-tail)"></polygon>
          <circle r="7" fill="#ffffff" stroke="#000000" stroke-width="1.2"></circle>
          <circle r="3.4" fill="#000000"></circle>
        </g>
      </g>
    </svg>
  `;
}

function wallMerlons() {
  let marks = "";
  for (let i = 0; i < 5; i += 1) {
    const x = 58 + i * 26;
    const t = (x - 42) / (198 - 42);
    const top = 334 + (306 - 334) * t;
    marks += `<rect class="preview-wall__fill" x="${x.toFixed(1)}" y="${(top - 11).toFixed(1)}" width="12" height="12"></rect>`;
  }
  return marks;
}

function labPreview(label) {
  const codeWidths = [82, 48, 66, 34, 90, 54, 72, 40, 61, 86, 38, 70];
  const fileWidths = [78, 64, 88, 52, 73, 60, 84, 46];
  return `
    <div class="project-card__preview preview-lab" role="img" aria-label="${label}">
      <div class="preview-lab__window">
        <div class="preview-lab__chrome" aria-hidden="true"><span></span><span></span><span></span></div>
        <div class="preview-lab__body">
          ${previewMarquee("preview-lab__code", "preview-lab__bar", codeWidths, "6.8s")}
          <div class="preview-lab__plotwrap" aria-hidden="true">
            <svg class="preview-lab__plot" viewBox="0 0 240 280">
              <path class="preview-lab__axis" d="M36 132 V36 M36 132 H168"></path>
              <g class="preview-lab__dots">
                ${labDots()}
              </g>
              <path class="preview-lab__axis" d="M36 252 V156 M36 252 H214"></path>
              <path class="preview-lab__guide" d="M36 214 C72 206 98 176 128 168 C162 158 184 152 210 146"></path>
              <path class="preview-lab__guide" d="M36 170 C68 184 96 210 132 226 C164 240 186 246 210 250"></path>
              <path class="preview-lab__series preview-lab__series--a" pathLength="100" d="M36 214 C72 206 98 176 128 168 C162 158 184 152 210 146"></path>
              <path class="preview-lab__series preview-lab__series--b" pathLength="100" d="M36 170 C68 184 96 210 132 226 C164 240 186 246 210 250"></path>
            </svg>
          </div>
          ${previewMarquee("preview-lab__files", "preview-lab__file", fileWidths, "9.5s")}
        </div>
      </div>
    </div>
  `;
}

function labDots() {
  const spots = [
    [72, 58], [90, 50], [108, 68], [126, 46], [142, 64],
    [80, 82], [100, 90], [120, 80], [146, 92], [158, 72],
    [88, 70], [114, 58], [134, 78], [98, 46], [152, 56],
  ];
  return spots
    .map(([x, y], index) => `<circle class="preview-lab__dot preview-lab__dot--${index % 3}" cx="${x}" cy="${y}" r="${index % 4 === 0 ? 3.2 : 2.4}" style="animation-delay:${(index * 0.17).toFixed(2)}s"></circle>`)
    .join("");
}

function monitorPreview(label) {
  const line = '<span class="preview-monitor__line"></span>';
  const column = (modifier) => `<div class="preview-monitor__col${modifier}" aria-hidden="true">${line.repeat(8)}</div>`;
  return `
    <div class="project-card__preview preview-desk" role="img" aria-label="${label}">
      <span class="preview-badge preview-badge--html">html</span>
      <span class="preview-badge preview-badge--php">php</span>
      <span class="preview-badge preview-badge--js">Js</span>
      <span class="preview-badge preview-badge--css">CSS</span>
      <div class="preview-monitor" aria-hidden="true">
        <div class="preview-monitor__bezel">
          <div class="preview-monitor__screen">
            ${column("")}
            ${column(" preview-monitor__col--main")}
            ${column(" preview-monitor__col--side")}
          </div>
        </div>
        <div class="preview-monitor__neck"></div>
        <div class="preview-monitor__base"></div>
      </div>
      <div class="preview-keyboard" aria-hidden="true"></div>
      <div class="preview-mouse" aria-hidden="true"></div>
      <div class="preview-plant" aria-hidden="true"><span></span></div>
    </div>
  `;
}

function previewMarquee(regionClass, barClass, widths, duration) {
  const bars = widths
    .map((width, index) => {
      return `<span class="${barClass}" style="width:${width}%"></span>`;
    })
    .join("");
  return `
    <div class="${regionClass}" aria-hidden="true">
      <div class="preview-marquee">
        <div class="preview-marquee__track" style="animation-duration:${duration}">
          <div class="preview-marquee__copy">${bars}</div>
          <div class="preview-marquee__copy">${bars}</div>
        </div>
      </div>
    </div>
  `;
}

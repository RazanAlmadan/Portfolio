// Static markup for the journey scene (ids are used by engine.ts).
export const JOURNEY_HTML = `<section class="stage" id="stage">
  <div class="frame" id="frame">
    <div class="ambient"></div>
    <div class="stars" id="stars"></div>

    <div class="world" id="world">
      <div class="world-aura"></div>
      <canvas id="gl"></canvas><canvas id="glow"></canvas>
      <div class="mist" id="mist"></div>
      <div class="vignette"></div>
    </div>
    <canvas class="fx" id="fx"></canvas>

    <div class="gateway" id="gateway">
      <div class="copy" id="copy">
        <p class="hero-label">WELCOME TO MY WORLD</p>
        <h1 class="hero-title">Hi, I'm <span>Razan.</span></h1>
        <h2 class="hero-role">Full Stack Developer</h2>
        <div class="hero-actions">
          <a class="button" href="#story" id="enter">Enter my world <span aria-hidden="true">↓</span></a>
          <a class="text-link" href="#projects">Skip Journey ↗</a>
        </div>
      </div>
      <div class="gateway-portal" id="portal" aria-hidden="true">
        <div class="portal-scene" id="scene">
          <div class="portal-halo pg-fx"></div>
          <div class="portal-stars portal-stars--far pg-fx" id="starsFar"></div>
          <!-- static glow: has blur filters, never repaints -->
          <svg class="pg pg-glow pg-fx" viewBox="100 52 400 420" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pgLineG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ff0ff"/><stop offset=".45" stop-color="#8f7dff"/><stop offset="1" stop-color="#ff7fdc"/></linearGradient>
              <filter id="pgB" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="8"/></filter>
            </defs>
            <path d="M175 452 V190 A125 125 0 0 1 425 190 V452" fill="none" stroke="url(#pgLineG)" stroke-width="12" opacity=".5" filter="url(#pgB)"/>
            <ellipse cx="300" cy="452" rx="150" ry="10" fill="#9d86ff" opacity=".35" filter="url(#pgB)"/>
          </svg>
          <!-- dive layer: pure vector, no filters (re-rasterises crisply while scaling) -->
          <svg class="pg pg-dive" viewBox="100 52 400 420" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pgLine" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ff0ff"/><stop offset=".45" stop-color="#8f7dff"/><stop offset="1" stop-color="#ff7fdc"/></linearGradient>
              <linearGradient id="pgSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050419"/><stop offset=".5" stop-color="#1d1560"/><stop offset="1" stop-color="#4a38c0"/></linearGradient>
              <radialGradient id="pgGlow" cx=".5" cy=".9" r=".6"><stop offset="0" stop-color="#9f8bff" stop-opacity=".85"/><stop offset=".5" stop-color="#6a5cf0" stop-opacity=".35"/><stop offset="1" stop-color="#6a5cf0" stop-opacity="0"/></radialGradient>
              <linearGradient id="pgFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".78" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
              <mask id="pgMask"><rect x="150" y="50" width="300" height="420" fill="url(#pgFade)"/></mask>
              <clipPath id="pgClip"><path d="M175 452 V190 A125 125 0 0 1 425 190 V452 Z"/></clipPath>
            </defs>
            <g clip-path="url(#pgClip)"><g mask="url(#pgMask)">
              <rect x="150" y="50" width="300" height="410" fill="url(#pgSky)"/>
              <circle cx="261" cy="130" r="1.4" fill="#e6eeff" class="pg-tw" style="animation-delay:-0.3s"/><circle cx="308" cy="181" r="0.9" fill="#e6eeff" class="pg-tw" style="animation-delay:-2.0s"/><circle cx="198" cy="197" r="0.9" fill="#e6eeff" class="pg-tw" style="animation-delay:-0.4s"/><circle cx="283" cy="289" r="0.9" fill="#e6eeff" class="pg-tw" style="animation-delay:-0.9s"/><circle cx="328" cy="318" r="1.3" fill="#e6eeff" class="pg-tw" style="animation-delay:-1.6s"/><circle cx="405" cy="106" r="1.6" fill="#e6eeff" class="pg-tw" style="animation-delay:-1.2s"/><circle cx="222" cy="123" r="1.1" fill="#e6eeff" class="pg-tw" style="animation-delay:-3.3s"/><circle cx="230" cy="232" r="1.4" fill="#e6eeff" class="pg-tw" style="animation-delay:-1.5s"/><circle cx="311" cy="110" r="0.9" fill="#e6eeff" class="pg-tw" style="animation-delay:-0.8s"/><circle cx="340" cy="195" r="1.1" fill="#e6eeff" class="pg-tw" style="animation-delay:-2.3s"/><circle cx="290" cy="165" r="1.5" fill="#e6eeff" class="pg-tw" style="animation-delay:-2.8s"/><circle cx="244" cy="230" r="1.3" fill="#e6eeff" class="pg-tw" style="animation-delay:-3.5s"/><circle cx="350" cy="163" r="1.7" fill="#e6eeff" class="pg-tw" style="animation-delay:-0.5s"/><circle cx="282" cy="273" r="0.9" fill="#e6eeff" class="pg-tw" style="animation-delay:-2.0s"/><circle cx="199" cy="252" r="1.5" fill="#e6eeff" class="pg-tw" style="animation-delay:-2.3s"/><circle cx="383" cy="169" r="1.4" fill="#e6eeff" class="pg-tw" style="animation-delay:-2.4s"/>
              <ellipse cx="300" cy="320" rx="150" ry="150" fill="url(#pgGlow)"/>
              <rect x="150" y="340" width="300" height="120" fill="url(#pgGlow)"/>
            </g></g>
            <path d="M175 452 V190 A125 125 0 0 1 425 190 V452" fill="none" stroke="url(#pgLine)" stroke-opacity=".95" stroke-width="2.4" stroke-linecap="round"/>
            <path d="M185 440 V190 A115 115 0 0 1 415 190 V440" fill="none" stroke="#dff6ff" stroke-opacity=".28" stroke-width="1"/>
          </svg>
          <div class="pg-mist pg-fx m1"></div><div class="pg-mist pg-fx m2"></div><div class="pg-mist pg-fx m3"></div>
          <div class="pg-dust pg-fx"><i style="--x:28px;--dx:18px;--d:6.3s;--dl:-1.0s;--s:2.6px;--c:#5ee8ff"></i><i style="--x:-105px;--dx:-1px;--d:9.2s;--dl:-10.9s;--s:3.8px;--c:#9d5cff"></i><i style="--x:63px;--dx:9px;--d:10.4s;--dl:-3.8s;--s:4.1px;--c:#9d5cff"></i><i style="--x:-77px;--dx:38px;--d:6.6s;--dl:-0.6s;--s:3.7px;--c:#4d73ff"></i><i style="--x:69px;--dx:-9px;--d:8.0s;--dl:-10.1s;--s:3.1px;--c:#4d73ff"></i><i style="--x:-6px;--dx:11px;--d:8.7s;--dl:-9.7s;--s:3.8px;--c:#7fb2ff"></i><i style="--x:-49px;--dx:13px;--d:10.9s;--dl:-7.5s;--s:2.8px;--c:#4d73ff"></i><i style="--x:-82px;--dx:-30px;--d:6.9s;--dl:-2.6s;--s:2.5px;--c:#ff73d9"></i><i style="--x:92px;--dx:35px;--d:6.9s;--dl:-3.1s;--s:2.3px;--c:#7fb2ff"></i><i style="--x:-26px;--dx:38px;--d:8.8s;--dl:-10.5s;--s:3.5px;--c:#7fb2ff"></i><i style="--x:38px;--dx:-34px;--d:8.3s;--dl:-9.6s;--s:4.1px;--c:#7fb2ff"></i><i style="--x:-20px;--dx:10px;--d:8.0s;--dl:-1.1s;--s:3.4px;--c:#5ee8ff"></i><i style="--x:-72px;--dx:-32px;--d:10.9s;--dl:-4.8s;--s:2.2px;--c:#7fb2ff"></i><i style="--x:-107px;--dx:-27px;--d:6.0s;--dl:-1.7s;--s:2.2px;--c:#9d5cff"></i><i style="--x:37px;--dx:-37px;--d:6.4s;--dl:-2.3s;--s:2.8px;--c:#9d5cff"></i><i style="--x:-32px;--dx:37px;--d:7.8s;--dl:-1.4s;--s:3.9px;--c:#ff73d9"></i><i style="--x:2px;--dx:21px;--d:7.6s;--dl:-1.6s;--s:3.6px;--c:#9d5cff"></i><i style="--x:2px;--dx:-20px;--d:8.6s;--dl:-2.3s;--s:4.1px;--c:#9d5cff"></i></div>
          <div class="portal-stars portal-stars--near pg-fx" id="starsNear"></div>
        </div>
      </div>
    </div>

    <div class="flash" id="flash"></div>

    <article class="card card--left" id="c0">
      <p class="eyebrow">Chapter 01 / The Roots</p>
      <h2>Where It All Began</h2>
      <p class="lead">Every great journey begins with curiosity.</p>
      <p class="body">Computer Science gave me the foundation. Curiosity led me to combine software engineering with artificial intelligence.</p>
      <span class="milestone">Computer Science Graduate</span>
    </article>

    <article class="card card--right" id="c1">
      <p class="eyebrow">Chapter 02 / The Turning Point</p>
      <h2>Where Knowledge Became Creation</h2>
      <p class="lead">Tuwaiq Academy · Java &amp; AI Bootcamp</p>
      <p class="body">From learning to building: full-stack applications with Java and Spring Boot.</p>
      <div class="tags"><span>Full Stack</span><span>Spring Boot</span><span>REST APIs</span><span>AI Integration</span></div>
    </article>

    <article class="card card--left" id="c2">
      <p class="eyebrow">Chapter 03 / The Technologies</p>
      <h2>The Technologies Behind My Creations</h2>
      <p class="lead">Languages, frameworks, and intelligence, each in its place.</p>
      <div class="tags"><span data-logo="java">Java</span><span data-logo="springboot">Spring Boot</span><span data-logo="python">Python</span><span data-logo="javascript">JavaScript</span><span data-logo="react">React</span><span data-logo="mysql">MySQL</span><span data-logo="googlegemini">Gemini</span><span data-logo="ultralytics">YOLOv8</span></div>
    </article>

    <article class="card card--right" id="c3">
      <p class="eyebrow">Chapter 04 / The Tools</p>
      <h2>The Tools That Support My Work</h2>
      <p class="lead">The daily tools of building, testing, and collaborating.</p>
      <div class="tags"><span data-logo="intellijidea">IntelliJ IDEA</span><span data-logo="vscode">VS Code</span><span data-logo="git github">Git &amp; GitHub</span><span data-logo="postman">Postman</span><span data-logo="figma">Figma</span><span data-logo="n8n">n8n</span></div>
    </article>

    <article class="card card--left" id="c4">
      <p class="eyebrow">Chapter 05 / The Creations · I</p>
      <h2>Ideas Brought to Life</h2>
      <p class="proj" data-p="sana"><strong>SANA</strong><br>A planning workspace that turns scattered creative ideas into structured blueprints.</p>
      <p class="proj" data-p="mergab"><strong>Mergab</strong><br>A crowd-management platform that simulates exhibition visitor flow to spot congestion.</p>
      <p class="proj" data-p="sahl"><strong>Sahl Darbak</strong><br>An AI-powered travel platform for discovering destinations, planning full trips, and connecting with other travelers.</p>
    </article>
    <article class="card card--right" id="c5">
      <p class="eyebrow">Chapter 05 / The Creations · II</p>
      <h2>Where It Began to Take Shape</h2>
      <p class="proj" data-p="tasmeem"><strong>TasmeemHub</strong><br>A platform that connects clients with designers, from the first request to final delivery.</p>
      <p class="proj" data-p="waste"><strong>WasteWise</strong><br>Real-time waste detection with a custom-trained YOLOv8 model, reaching 92.19% mAP@50.</p>
      <p class="proj" style="color:#9d93b8;font-size:12px">Full stories below ↓</p>
    </article>

    <div class="pstars" id="pstars" aria-label="Project stars">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" id="starLines"></svg>
      <p class="stars-hint">Not every star is just a star</p>
    </div>
    <div class="ending" id="ending">
      <p class="eyebrow">Chapter 06 / The Crown</p>
      <h2>And the Journey Continues...</h2>
      <p class="sub">Every branch tells a story. And mine is still growing.</p>
      <a class="text-link" href="#projects">Explore my work ↓</a>
    </div>

    <canvas class="fx2" id="fx2"></canvas>
    <div class="guide" id="guide" aria-hidden="true">
      <span class="guide-halo"></span>
      <svg viewBox="0 0 120 108" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gw1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#e5fcff" stop-opacity=".95"/>
            <stop offset=".45" stop-color="#9fc8fa" stop-opacity=".65"/>
            <stop offset="1" stop-color="#d5a7ff" stop-opacity=".88"/>
          </linearGradient>
          <linearGradient id="gw2" x1="0" y1="0" x2=".8" y2="1">
            <stop offset="0" stop-color="#eaf8ff" stop-opacity=".88"/>
            <stop offset="1" stop-color="#bd9bea" stop-opacity=".73"/>
          </linearGradient>
        </defs>
        <g class="wing-l">
          <path d="M59 50 C42 18 17 0 8 14 C-2 37 19 56 58 56 Z" fill="url(#gw1)" stroke="#e7faff" stroke-width="1.4"/>
          <path d="M58 57 C38 52 21 61 25 76 C31 87 42 82 38 98 C52 91 60 76 60 60 Z" fill="url(#gw2)" stroke="#e9e0ff" stroke-width="1.2"/>
          <path d="M56 52 Q39 27 12 18 M53 54 Q35 42 17 40 M56 58 Q38 65 31 76 M54 63 Q48 78 39 88" fill="none" stroke="#f1ffff" stroke-width=".9" opacity=".72"/>
          <path d="M14 16 Q28 15 39 27 M16 40 Q24 51 38 52" fill="none" stroke="#f1d7ff" stroke-width="1.1" opacity=".7"/>
        </g>
        <g class="wing-r">
          <path d="M61 50 C78 18 103 0 112 14 C122 37 101 56 62 56 Z" fill="url(#gw1)" stroke="#e7faff" stroke-width="1.4"/>
          <path d="M62 57 C82 52 99 61 95 76 C89 87 78 82 82 98 C68 91 60 76 60 60 Z" fill="url(#gw2)" stroke="#e9e0ff" stroke-width="1.2"/>
          <path d="M64 52 Q81 27 108 18 M67 54 Q85 42 103 40 M64 58 Q82 65 89 76 M66 63 Q72 78 81 88" fill="none" stroke="#f1ffff" stroke-width=".9" opacity=".72"/>
          <path d="M106 16 Q92 15 81 27 M104 40 Q96 51 82 52" fill="none" stroke="#f1d7ff" stroke-width="1.1" opacity=".7"/>
        </g>
        <path d="M59.5 34 Q55 51 59.5 76 Q64 51 60.5 34Z" fill="#f3fcff"/>
        <circle cx="60" cy="34" r="3.5" fill="#fff"/>
        <path d="M59 33 Q47 17 45 19 M61 33 Q73 17 75 19" fill="none" stroke="#e7faff" stroke-linecap="round" stroke-width="1.2"/>
      </svg>
    </div>

    <div class="hud"><span>✦ A JOURNEY THROUGH MY STORY</span><a href="#projects">Skip Journey ↗</a><span>SCROLL TO FOLLOW THE BUTTERFLY</span></div>
    <div class="progress"><span id="progressBar"></span></div>
  </div>
</section>
<button class="snd" id="snd" type="button" aria-pressed="false" aria-label="Sound">
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path class="on" d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12"/><path class="off" d="M17 9l5 6M22 9l-5 6"/></svg>
</button><span class="snd-tip" id="sndTip">Sound on for the full experience</span>
<div class="spanel" id="spanel" role="dialog" aria-modal="true" aria-labelledby="spT">
  <div class="box"><button class="x" id="spX" aria-label="Close">×</button>
    <p class="cat" id="spC"></p><h3 id="spT"></h3><div id="spB"></div>
    <div class="acts"><a href="#projects" id="spMore">Full story ↓</a></div>
  </div>
</div>
`;

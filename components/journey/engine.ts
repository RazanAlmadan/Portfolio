/* eslint-disable */
// @ts-nocheck
/**
 * Enter My World: the cinematic journey engine (Three.js).
 * It drives the DOM rendered by <JourneyScene/> and returns a cleanup function,
 * so React Strict Mode / route changes never leave listeners, loops or GL contexts behind.
 */
import * as THREE from 'three';

export function startJourney() {
  const offs = [];
  const listen = (target, type, fn, opts) => { target.addEventListener(type, fn, opts); offs.push(() => target.removeEventListener(type, fn, opts)); };
  let raf = 0, stopped = false, tipT = 0, warmT = 0, glowOff = false, glowCost = 0, glowN = 0;
  if (THREE.ColorManagement && !('legacyMode' in THREE.ColorManagement)) THREE.ColorManagement.enabled = false;

/* ================= Utilities ================= */
const TAU = Math.PI * 2;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const lerpPt = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
/* ---- Tech logos: simple-icons (CC0), path data inline, no CDN. Java and VS Code have no logo in simple-icons: text only. ---- */
const TECH = {
  java: {name:"Java"},
  vscode: {name:"VS Code"},
  springboot: {name:"Spring Boot",hex:"6DB33F",d:"m23.693 10.7058-4.73-8.1844c-.4094-.7106-1.4166-1.2942-2.2402-1.2942H7.2725c-.819 0-1.8308.5836-2.2402 1.2942L.307 10.7058c-.4095.7106-.4095 1.873 0 2.5837l4.7252 8.189c.4094.7107 1.4166 1.2943 2.2402 1.2943h9.455c.819 0 1.826-.5836 2.2402-1.2942l4.7252-8.189c.4095-.7107.4095-1.8732 0-2.5838zM10.9763 5.7547c0-.5365.4377-.9742.9742-.9742s.9742.4377.9742.9742v5.8217c0 .5366-.4377.9742-.9742.9742s-.9742-.4376-.9742-.9742zm.9742 12.4294c-3.6427 0-6.6077-2.965-6.6077-6.6077.0047-2.0896.993-4.0521 2.6685-5.304a.8657.8657 0 0 1 1.2142.1788.8657.8657 0 0 1-.1788 1.2143c-2.1602 1.6048-2.612 4.6592-1.0072 6.8194 1.6049 2.1603 4.6593 2.612 6.8195 1.0072 1.2378-.9177 1.9673-2.372 1.9673-3.9157a4.8972 4.8972 0 0 0-1.9861-3.925c-.386-.2824-.466-.8284-.1836-1.2143.2824-.386.8283-.466 1.2143-.1835 1.6895 1.2471 2.6826 3.2238 2.6873 5.3228 0 3.6474-2.965 6.6077-6.6077 6.6077z"},
  python: {name:"Python",hex:"3776AB",d:"M11.858 0c-.978.005-1.913.088-2.736.234C6.7.662 6.26 1.558 6.26 3.21v2.182h5.725v.727H4.111c-1.664 0-3.121 1-3.577 2.903-.526 2.181-.549 3.542 0 5.82.407 1.694 1.379 2.902 3.043 2.902h1.969v-2.616c0-1.89 1.635-3.557 3.576-3.557h5.72c1.591 0 2.862-1.31 2.862-2.91v-5.45c0-1.553-1.309-2.718-2.863-2.977A18 18 0 0 0 11.858 0M8.762 1.755c.591 0 1.074.491 1.074 1.095 0 .601-.483 1.087-1.074 1.087A1.08 1.08 0 0 1 7.688 2.85c0-.604.48-1.095 1.074-1.095m9.656 4.364v2.543c0 1.971-1.671 3.63-3.577 3.63H9.122c-1.566 0-2.862 1.34-2.862 2.91v5.452c0 1.551 1.349 2.464 2.862 2.91 1.813.532 3.55.628 5.72 0 1.44-.418 2.862-1.258 2.862-2.91V18.47h-5.719v-.727h8.582c1.664 0 2.284-1.16 2.862-2.903.598-1.793.573-3.518 0-5.819-.41-1.656-1.196-2.903-2.862-2.903zm-3.216 13.807a1.08 1.08 0 0 1 1.074 1.088c0 .604-.48 1.094-1.074 1.094-.592 0-1.075-.49-1.075-1.094 0-.601.483-1.088 1.075-1.088"},
  javascript: {name:"JavaScript",hex:"F7DF1E",d:"M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"},
  react: {name:"React",hex:"61DAFB",d:"M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"},
  mysql: {name:"MySQL",hex:"4479A1",d:"M16.405 5.501c-.115 0-.193.014-.274.033v.013h.014c.054.104.146.18.214.273.054.107.1.214.154.32l.014-.015c.094-.066.14-.172.14-.333-.04-.047-.046-.094-.08-.14-.04-.067-.126-.1-.18-.153zM5.77 18.695h-.927a50.854 50.854 0 00-.27-4.41h-.008l-1.41 4.41H2.45l-1.4-4.41h-.01a72.892 72.892 0 00-.195 4.41H0c.055-1.966.192-3.81.41-5.53h1.15l1.335 4.064h.008l1.347-4.064h1.095c.242 2.015.384 3.86.428 5.53zm4.017-4.08c-.378 2.045-.876 3.533-1.492 4.46-.482.716-1.01 1.073-1.583 1.073-.153 0-.34-.046-.566-.138v-.494c.11.017.24.026.386.026.268 0 .483-.075.647-.222.197-.18.295-.382.295-.605 0-.155-.077-.47-.23-.944L6.23 14.615h.91l.727 2.36c.164.536.233.91.205 1.123.4-1.064.678-2.227.835-3.483zm12.325 4.08h-2.63v-5.53h.885v4.85h1.745zm-3.32.135l-1.016-.5c.09-.076.177-.158.255-.25.433-.506.648-1.258.648-2.253 0-1.83-.718-2.746-2.155-2.746-.704 0-1.254.232-1.65.697-.43.508-.646 1.256-.646 2.245 0 .972.19 1.686.574 2.14.35.41.877.615 1.583.615.264 0 .506-.033.725-.098l1.325.772.36-.622zM15.5 17.588c-.225-.36-.337-.94-.337-1.736 0-1.393.424-2.09 1.27-2.09.443 0 .77.167.977.5.224.362.336.936.336 1.723 0 1.404-.424 2.108-1.27 2.108-.445 0-.77-.167-.978-.5zm-1.658-.425c0 .47-.172.856-.516 1.156-.344.3-.803.45-1.384.45-.543 0-1.064-.172-1.573-.515l.237-.476c.438.22.833.328 1.19.328.332 0 .593-.073.783-.22a.754.754 0 00.3-.615c0-.33-.23-.61-.648-.845-.388-.213-1.163-.657-1.163-.657-.422-.307-.632-.636-.632-1.177 0-.45.157-.81.47-1.085.315-.278.72-.415 1.22-.415.512 0 .98.136 1.4.41l-.213.476a2.726 2.726 0 00-1.064-.23c-.283 0-.502.068-.654.206a.685.685 0 00-.248.524c0 .328.234.61.666.85.393.215 1.187.67 1.187.67.433.305.648.63.648 1.168zm9.382-5.852c-.535-.014-.95.04-1.297.188-.1.04-.26.04-.274.167.055.053.063.14.11.214.08.134.218.313.346.407.14.11.28.216.427.31.26.16.555.255.81.416.145.094.293.213.44.313.073.05.12.14.214.172v-.02c-.046-.06-.06-.147-.105-.214-.067-.067-.134-.127-.2-.193a3.223 3.223 0 00-.695-.675c-.214-.146-.682-.35-.77-.595l-.013-.014c.146-.013.32-.066.46-.106.227-.06.435-.047.67-.106.106-.027.213-.06.32-.094v-.06c-.12-.12-.21-.283-.334-.395a8.867 8.867 0 00-1.104-.823c-.21-.134-.476-.22-.697-.334-.08-.04-.214-.06-.26-.127-.12-.146-.19-.34-.275-.514a17.69 17.69 0 01-.547-1.163c-.12-.262-.193-.523-.34-.763-.69-1.137-1.437-1.826-2.586-2.5-.247-.14-.543-.2-.856-.274-.167-.008-.334-.02-.5-.027-.11-.047-.216-.174-.31-.235-.38-.24-1.364-.76-1.644-.072-.18.434.267.862.422 1.082.115.153.26.328.34.5.047.116.06.235.107.356.106.294.207.622.347.897.073.14.153.287.247.413.054.073.146.107.167.227-.094.136-.1.334-.154.5-.24.757-.146 1.693.194 2.25.107.166.362.534.703.393.3-.12.234-.5.32-.835.02-.08.007-.133.048-.187v.015c.094.188.188.367.274.555.206.328.566.668.867.895.16.12.287.328.487.402v-.02h-.015c-.043-.058-.1-.086-.154-.133a3.445 3.445 0 01-.35-.4 8.76 8.76 0 01-.747-1.218c-.11-.21-.202-.436-.29-.643-.04-.08-.04-.2-.107-.24-.1.146-.247.273-.32.453-.127.288-.14.642-.188 1.01-.027.007-.014 0-.027.014-.214-.052-.287-.274-.367-.46-.2-.475-.233-1.238-.06-1.785.047-.14.247-.582.167-.716-.042-.127-.174-.2-.247-.303a2.478 2.478 0 01-.24-.427c-.16-.374-.24-.788-.414-1.162-.08-.173-.22-.354-.334-.513-.127-.18-.267-.307-.368-.52-.033-.073-.08-.194-.027-.274.014-.054.042-.075.094-.09.088-.072.335.022.422.062.247.1.455.194.662.334.094.066.195.193.315.226h.14c.214.047.455.014.655.073.355.114.675.28.962.46a5.953 5.953 0 012.085 2.286c.08.154.115.295.188.455.14.33.313.663.455.982.14.315.275.636.476.897.1.14.502.213.682.286.133.06.34.115.46.188.23.14.454.3.67.454.11.076.443.243.463.378z"},
  googlegemini: {name:"Google Gemini",hex:"8E75B2",d:"M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"},
  n8n: {name:"n8n",hex:"EA4B71",d:"M21.4737 5.6842c-1.1772 0-2.1663.8051-2.4468 1.8947h-2.8955c-1.235 0-2.289.893-2.492 2.111l-.1038.623a1.263 1.263 0 0 1-1.246 1.0555H11.289c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947s-2.1663.8051-2.4467 1.8947H4.973c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947C1.1311 9.4737 0 10.6047 0 12s1.131 2.5263 2.5263 2.5263c1.1772 0 2.1663-.8051 2.4468-1.8947h1.4223c.2804 1.0896 1.2696 1.8947 2.4467 1.8947 1.1772 0 2.1663-.8051 2.4468-1.8947h1.0008a1.263 1.263 0 0 1 1.2459 1.0555l.1038.623c.203 1.218 1.257 2.111 2.492 2.111h.3692c.2804 1.0895 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263c-1.1772 0-2.1664.805-2.4468 1.8947h-.3692a1.263 1.263 0 0 1-1.246-1.0555l-.1037-.623A2.52 2.52 0 0 0 13.9607 12a2.52 2.52 0 0 0 .821-1.4794l.1038-.623a1.263 1.263 0 0 1 1.2459-1.0555h2.8955c.2805 1.0896 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263m0 1.2632a1.263 1.263 0 0 1 1.2631 1.2631 1.263 1.263 0 0 1-1.2631 1.2632 1.263 1.263 0 0 1-1.2632-1.2632 1.263 1.263 0 0 1 1.2632-1.2631M2.5263 10.7368A1.263 1.263 0 0 1 3.7895 12a1.263 1.263 0 0 1-1.2632 1.2632A1.263 1.263 0 0 1 1.2632 12a1.263 1.263 0 0 1 1.2631-1.2632m6.3158 0A1.263 1.263 0 0 1 10.1053 12a1.263 1.263 0 0 1-1.2632 1.2632A1.263 1.263 0 0 1 7.579 12a1.263 1.263 0 0 1 1.2632-1.2632m10.1053 3.7895a1.263 1.263 0 0 1 1.2631 1.2632 1.263 1.263 0 0 1-1.2631 1.2631 1.263 1.263 0 0 1-1.2632-1.2631 1.263 1.263 0 0 1 1.2632-1.2632"},
  ultralytics: {name:"YOLOv8",hex:"111F68",d:"m12.736 7.341-.002 2.897c.012 3.953-3.188 7.177-7.098 7.171-1.553-.003-2.967-.48-4.112-1.313 2.056 3.725 5.999 6.24 10.48 6.245 6.511-.003 11.891-5.343 11.992-11.91l-.002-.027c.006-.151 0-2.951.006-3.075-.01-3.116-2.538-5.677-5.63-5.67-3.105-.006-5.645 2.54-5.634 5.683zM5.629 4.573C2.525 4.573 0 7.118 0 10.246s2.525 5.673 5.63 5.673c3.103 0 5.629-2.545 5.629-5.673s-2.526-5.673-5.63-5.673"},
  intellijidea: {name:"IntelliJ IDEA",hex:"000000",d:"M0 0v24h24V0zm3.723 3.111h5v1.834h-1.39v6.277h1.39v1.834h-5v-1.834h1.444V4.945H3.723zm11.055 0H17v6.5c0 .612-.055 1.111-.222 1.556-.167.444-.39.777-.723 1.11-.277.279-.666.557-1.11.668a3.933 3.933 0 0 1-1.445.278c-.778 0-1.444-.167-1.944-.445a4.81 4.81 0 0 1-1.279-1.056l1.39-1.555c.277.334.555.555.833.722.277.167.611.278.945.278.389 0 .721-.111 1-.389.221-.278.333-.667.333-1.278zM2.222 19.5h9V21h-9z"},
  webstorm: {name:"WebStorm",hex:"000000",d:"M0 0v24h24V0H0zm17.889 2.889c1.444 0 2.667.444 3.667 1.278l-1.111 1.667c-.889-.611-1.722-1-2.556-1s-1.278.389-1.278.889v.056c0 .667.444.889 2.111 1.333 2 .556 3.111 1.278 3.111 3v.056c0 2-1.5 3.111-3.611 3.111-1.5-.056-3-.611-4.167-1.667l1.278-1.556c.889.722 1.833 1.222 2.944 1.222.889 0 1.389-.333 1.389-.944v-.056c0-.556-.333-.833-2-1.278-2-.5-3.222-1.056-3.222-3.056v-.056c0-1.833 1.444-3 3.444-3zm-16.111.222h2.278l1.5 5.778 1.722-5.778h1.667l1.667 5.778 1.5-5.778h2.333l-2.833 9.944H9.723L8.112 7.277l-1.667 5.778H4.612L1.779 3.111zm.5 16.389h9V21h-9v-1.5z"},
  androidstudio: {name:"Android Studio",hex:"3DDC84",d:"M19.2693 10.3368c-.3321 0-.6026.2705-.6026.6031v9.8324h-1.7379l-3.3355-6.9396c.476-.5387.6797-1.286.5243-2.0009a2.2862 2.2862 0 0 0-1.2893-1.6248v-.8124c.0121-.2871-.1426-.5787-.4043-.7407-.1391-.0825-.2884-.1234-.4402-.1234a.8478.8478 0 0 0-.4318.1182c-.2701.1671-.4248.4587-.4123.7662l-.0003.721c-1.0149.3668-1.6619 1.4153-1.4867 2.5197a2.282 2.282 0 0 0 .5916 1.2103l-3.2096 6.9064H4.0928c-1.0949-.007-1.9797-.8948-1.9832-1.9896V5.016c-.0055 1.1024.8836 2.0006 1.9859 2.0062a2.024 2.024 0 0 0 .1326-.0037h14.7453s2.5343-.2189 2.8619 1.5392c-.2491.0287-.4449.2321-.4449.4889 0 .7115-.5791 1.2901-1.3028 1.2901h-.8183zM17.222 22.5366c.2347.4837.0329 1.066-.4507 1.3007-.1296.0629-.2666.0895-.4018.0927a.9738.9738 0 0 1-.3194-.0455c-.024-.0078-.046-.0209-.0694-.0305a.9701.9701 0 0 1-.2277-.1321c-.0247-.0192-.0495-.038-.0724-.0598-.0825-.0783-.1574-.1672-.21-.2757l-1.2554-2.6143-1.5585-3.2452a.7725.7725 0 0 0-.6995-.4443h-.0024a.792.792 0 0 0-.7083.4443l-1.5109 3.2452-1.2321 2.6464a.9722.9722 0 0 1-.7985.5795c-.0626.0053-.1238-.0024-.185-.0087-.0344-.0036-.069-.0053-.1025-.0124-.0489-.0103-.0954-.0278-.142-.0452-.0301-.0113-.0613-.0197-.0901-.0339-.0496-.0244-.0948-.0565-.1397-.0889-.0217-.0156-.0457-.0275-.0662-.045a.9862.9862 0 0 1-.1695-.1844.9788.9788 0 0 1-.0708-.9852l.8469-1.8223 3.2676-7.0314a1.7964 1.7964 0 0 1-.7072-1.1637c-.1555-.9799.5129-1.9003 1.4928-2.0559V9.3946a.3542.3542 0 0 1 .1674-.3155.3468.3468 0 0 1 .3541 0 .354.354 0 0 1 .1674.3155v1.159l.0129.0064a1.8028 1.8028 0 0 1 1.2878 1.378 1.7835 1.7835 0 0 1-.6439 1.7836l3.3889 7.0507.8481 1.7643zM12.9841 12.306c.0042-.6081-.4854-1.1044-1.0935-1.1085a1.1204 1.1204 0 0 0-.7856.3219 1.101 1.101 0 0 0-.323.7716c-.0042.6081.4854 1.1044 1.0935 1.1085h.0077c.6046 0 1.0967-.488 1.1009-1.0935zm-1.027 5.2768c-.1119.0005-.2121.0632-.2571.1553l-1.4127 3.0342h3.3733l-1.4564-3.0328a.274.274 0 0 0-.2471-.1567zm8.1432-6.7459l-.0129-.0001h-.8177a.103.103 0 0 0-.103.103v12.9103a.103.103 0 0 0 .0966.103h.8435c.9861-.0035 1.7836-.804 1.7836-1.79V9.0468c0 .9887-.8014 1.7901-1.7901 1.7901zM2.6098 5.0161v.019c.0039.816.6719 1.483 1.4874 1.4869a12.061 12.061 0 0 1 .1309-.0034h1.1286c.1972-1.315.7607-2.525 1.638-3.4859H4.0993c-.9266.0031-1.6971.6401-1.9191 1.4975.2417.0355.4296.235.4296.4859zm6.3381-2.8977L7.9112.3284a.219.219 0 0 1 0-.2189A.2384.2384 0 0 1 8.098 0a.219.219 0 0 1 .1867.1094l1.0496 1.8158a6.4907 6.4907 0 0 1 5.3186 0L15.696.1094a.2189.2189 0 0 1 .3734.2189l-1.0302 1.79c1.6671.9125 2.7974 2.5439 3.0975 4.4018l-12.286-.0014c.3004-1.8572 1.4305-3.488 3.0972-4.4003zm5.3774 2.6202a.515.515 0 0 0 .5271.5028.515.515 0 0 0 .5151-.5151.5213.5213 0 0 0-.8885-.367.5151.5151 0 0 0-.1537.3793zm-5.7178-.0067a.5151.5151 0 0 0 .5207.5095.5086.5086 0 0 0 .367-.1481.5215.5215 0 1 0-.734-.7341.515.515 0 0 0-.1537.3727z"},
  apachenetbeanside: {name:"NetBeans",hex:"1B6AC6",d:"M22.8575 6.1211c-.0092-.0866-.0486-.1598-.121-.2104C22.7381 5.9098 12.1194.032 12.1185.03a.2487.2487 0 00-.2372 0c-.003 0-10.6129 5.8784-10.6145 5.8797-.0744.0497-.1156.1241-.1243.2124v11.8365c.0149.0565.0178.1253.071.161.0183.0788 10.6175 5.7985 10.6694 5.8507a.2456.2456 0 00.2343 0c.0025-.0017 10.6135-5.7957 10.6147-5.7984.0748-.0489.115-.1262.1256-.2133V6.1211zm-17.633 9.3292L1.6323 17.534V6.5401l3.5922 2.011zm13.551-6.8993l3.5922-2.0109v10.9938l-3.5922-2.0836zm-.7407-.1455c-2.0115 1.1316-4.0232 2.263-6.0348 3.3943a125706.698 125706.698 0 01-6.0349-3.3943L12 4.9349zM5.7143 15.4473V8.8265l6.0408 3.398v6.5444l-6.0408-3.3216zm6.5305 3.3216v-6.5444l6.0409-3.398v6.6208c-2.0135 1.1074-4.0272 2.2145-6.0408 3.3216zM12 .5247l10.1094 5.5984-3.5771 2.003-6.4104-3.6858a.2418.2418 0 00-.2439 0L5.4676 8.126l-3.577-2.003L12 .5248zM5.4728 15.8731l6.2823 3.4547v4.014L1.8868 17.952zm6.772 7.4686v-4.014l6.2824-3.4546 3.586 2.0789z"},
  figma: {name:"Figma",hex:"F24E1E",d:"M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z"},
  postman: {name:"Postman",hex:"FF6C37",d:"M13.527.099C6.955-.744.942 3.9.099 10.473c-.843 6.572 3.8 12.584 10.373 13.428 6.573.843 12.587-3.801 13.428-10.374C24.744 6.955 20.101.943 13.527.099zm2.471 7.485a.855.855 0 0 0-.593.25l-4.453 4.453-.307-.307-.643-.643c4.389-4.376 5.18-4.418 5.996-3.753zm-4.863 4.861l4.44-4.44a.62.62 0 1 1 .847.903l-4.699 4.125-.588-.588zm.33.694l-1.1.238a.06.06 0 0 1-.067-.032.06.06 0 0 1 .01-.073l.645-.645.512.512zm-2.803-.459l1.172-1.172.879.878-1.979.426a.074.074 0 0 1-.085-.039.072.072 0 0 1 .013-.093zm-3.646 6.058a.076.076 0 0 1-.069-.083.077.077 0 0 1 .022-.046h.002l.946-.946 1.222 1.222-2.123-.147zm2.425-1.256a.228.228 0 0 0-.117.256l.203.865a.125.125 0 0 1-.211.117h-.003l-.934-.934-.294-.295 3.762-3.758 1.82-.393.874.874c-1.255 1.102-2.971 2.201-5.1 3.268zm5.279-3.428h-.002l-.839-.839 4.699-4.125a.952.952 0 0 0 .119-.127c-.148 1.345-2.029 3.245-3.977 5.091zm3.657-6.46l-.003-.002a1.822 1.822 0 0 1 2.459-2.684l-1.61 1.613a.119.119 0 0 0 0 .169l1.247 1.247a1.817 1.817 0 0 1-2.093-.343zm2.578 0a1.714 1.714 0 0 1-.271.218h-.001l-1.207-1.207 1.533-1.533c.661.72.637 1.832-.054 2.522zM18.855 6.05a.143.143 0 0 0-.053.157.416.416 0 0 1-.053.45.14.14 0 0 0 .023.197.141.141 0 0 0 .084.03.14.14 0 0 0 .106-.05.691.691 0 0 0 .087-.751.138.138 0 0 0-.194-.033z"},
  git: {name:"Git",hex:"F03C2E",d:"M13.09 23.549a1.54 1.54 0 0 1-2.18 0L.451 13.089a1.54 1.54 0 0 1 0-2.179l7.191-7.19 2.733 2.733a1.85 1.85 0 0 0 .964 2.326v6.66a1.849 1.849 0 1 0 1.54 0V8.957l2.508 2.508a1.85 1.85 0 1 0 1.09-1.09l-2.634-2.634a1.85 1.85 0 0 0-2.378-2.377L8.73 2.63 10.91.451a1.54 1.54 0 0 1 2.179 0l10.459 10.46a1.54 1.54 0 0 1 0 2.179z"},
  github: {name:"GitHub",hex:"181717",d:"M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"},
  roboflow: {name:"Roboflow",hex:"6706CE",d:"M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0m.512 3.6a9.6 9.6 0 0 1 2.594.39c1.764.52 3.511 1.747 3.823 3.68.066.41.065.829.007 1.24-.208 1.466-1.09 2.777-2.09 3.83-1.063 1.122-2.417 1.854-3.54 2.898-.657.611-.925 1.36-.132 1.995 1.084.553 1.986.266 2.97-.332.582-.353 1.08-.823 1.511-1.345.219-.264.422-.542.617-.825.164-.24.317-.517.537-.716a.8.8 0 0 1 .502-.267.69.69 0 0 1 .7.406c.118.28.013.64-.113.9-.652 1.346-1.368 2.25-1.867 2.78-1.486 1.653-3.809 2.736-5.955 1.846-1.234-.51-2.198-1.658-2.37-2.998-.32-2.502 2.588-3.95 4.12-5.368.937-.868 1.965-2.203 1.486-3.562-.459-1.302-1.988-1.868-3.246-2-1.24-.128-2.5.128-3.624.654-.882.412-1.625 1.038-2.32 1.711-.23.223-.45.46-.688.673-.206.184-.453.352-.732.39-.417.056-.813-.248-.76-.688.086-.712.592-1.332 1.036-1.862q.412-.493.884-.928a9.3 9.3 0 0 1 2.397-1.6 9.9 9.9 0 0 1 4.253-.901m-2.22 5.264c1.558-.055 1.92 1.034.882 1.843-1.763 1.372-3.997 2.745-4.224 4.95-.092.887.352 2.293.89 3.24.04.07.061.153.058.24-.01.231-.19.42-.428.409-.162-.008-.311-.09-.45-.176-.639-.395-1.238-.89-1.705-1.481a5 5 0 0 1-.665-1.116 4.6 4.6 0 0 1-.323-1.196 4.6 4.6 0 0 1 .011-1.238q.045-.315.128-.62c.673-2.49 3.377-4.564 5.498-4.828q.172-.021.328-.027"},
};
const inkFor = hex => {
  const c = [0, 2, 4].map(i => parseInt(hex.substr(i, 2), 16) / 255).map(v => v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4));
  return .2126 * c[0] + .7152 * c[1] + .0722 * c[2] < .1 ? '#eee8ff' : '#' + hex;
};
const logoSvg = key => { const t = TECH[key]; return t && t.d ? `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path fill="${inkFor(t.hex)}" d="${t.d}"/></svg>` : ''; };
document.querySelectorAll('[data-logo]').forEach(el => !el.querySelector('svg') && el.insertAdjacentHTML('afterbegin', el.dataset.logo.split(' ').map(logoSvg).join('')));
const hsla = (h, s, l, a) => `hsla(${h},${s}%,${l}%,${a})`;
let seed = 21;
function rnd() { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
const R = (a, b) => a + (b - a) * rnd();
const gauss = () => (rnd() + rnd() + rnd() + rnd() - 2) / 2;

/* ================= Page stars + gateway stars (approved) ================= */
const starsEl = document.getElementById('stars');
for (let i = 0; i < 32; i++) {
  const s = document.createElement('i');
  s.style.left = `${(i * 37.37 + 11) % 100}%`; s.style.top = `${(i * 19.93 + 7) % 100}%`;
  s.style.opacity = String(.23 + (i % 4) * .17);
  s.style.width = s.style.height = (i % 6 === 0 ? 3 : 2) + 'px';
  starsEl.appendChild(s);
}
const portalStars = [
  { top: "10%", left: "15%", size: 2, delay: 0, depth: "far" }, { top: "20%", left: "35%", size: 3, delay: 1, depth: "near" },
  { top: "12%", left: "65%", size: 2, delay: 2, depth: "far" }, { top: "28%", left: "85%", size: 3, delay: 0.5, depth: "near" },
  { top: "42%", left: "10%", size: 2, delay: 1.5, depth: "far" }, { top: "55%", left: "28%", size: 3, delay: 2.5, depth: "near" },
  { top: "68%", left: "90%", size: 2, delay: 0.8, depth: "far" }, { top: "75%", left: "18%", size: 3, delay: 1.8, depth: "near" },
  { top: "35%", left: "55%", size: 2, delay: 2.2, depth: "far" }, { top: "18%", left: "92%", size: 2, delay: 0.3, depth: "near" },
  { top: "82%", left: "72%", size: 3, delay: 1.3, depth: "far" }, { top: "48%", left: "75%", size: 2, delay: 2.7, depth: "near" },
  { top: "8%", left: "48%", size: 2, delay: 0.7, depth: "far" }, { top: "62%", left: "48%", size: 2, delay: 1.9, depth: "near" },
  { top: "88%", left: "42%", size: 2, delay: 2.4, depth: "far" },
];
for (const s of portalStars) {
  const el = document.createElement('span');
  el.className = 'portal-star';
  el.style.top = s.top; el.style.left = s.left;
  el.style.width = el.style.height = s.size + 'px';
  el.style.animationDelay = s.delay + 's';
  document.getElementById(s.depth === 'far' ? 'starsFar' : 'starsNear').appendChild(el);
}
const scene = document.getElementById('scene');
scene.addEventListener('pointermove', e => {
  const r = scene.getBoundingClientRect();
  const x = ((e.clientX - r.left) / r.width - .5) * 2, y = ((e.clientY - r.top) / r.height - .5) * 2;
  scene.style.setProperty('--near-x', `${x * 18}px`); scene.style.setProperty('--near-y', `${y * 14}px`);
  scene.style.setProperty('--far-x', `${-x * 6}px`); scene.style.setProperty('--far-y', `${-y * 5}px`);
});
scene.addEventListener('pointerleave', () => { for (const v of ['--near-x', '--near-y', '--far-x', '--far-y']) scene.style.setProperty(v, '0px'); });
let mx = .5, my = .5;
let lastMoveT = 0;
listen(window, 'pointermove', e => { mx = e.clientX / innerWidth; my = e.clientY / innerHeight; lastMoveT = performance.now(); });


/* ================= Layout ================= */
const frame = document.getElementById('frame'), guide = document.getElementById('guide');
/* The butterfly lives on <body> (fixed), so after the story ends it can leave the tree and keep following the visitor down the page. */
document.body.appendChild(guide);
const root = document.documentElement; root.dataset.journey = '1'; /* the portfolio's own butterfly stays hidden: this is the only one */
const gateway = document.getElementById('gateway'), portal = document.getElementById('portal'), flashEl = document.getElementById('flash');
const stage = document.getElementById('stage'), world = document.getElementById('world'), ending = document.getElementById('ending');
const progressBar = document.getElementById('progressBar'), mist = document.getElementById('mist');
const fxCanvas = document.getElementById('fx'), fx = fxCanvas.getContext('2d');
const fx2c = document.getElementById('fx2'), fx2 = fx2c.getContext('2d');
const glCanvas = document.getElementById('gl'), glowCanvas = document.getElementById('glow'), gctx = glowCanvas.getContext('2d');
let FW = 0, FH = 0, narrow = false, renderer, camera, curDpr = 0, maxDpr = 1;
const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
const lite = (innerWidth < 800 || matchMedia('(pointer:coarse)').matches) && ((navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4);
function layout() {
  FW = frame.clientWidth; FH = frame.clientHeight; narrow = FW < 800;
  fxCanvas.width = FW; fxCanvas.height = FH; fx2c.width = FW; fx2c.height = FH;
  glowCanvas.width = Math.max(2, FW >> 3); glowCanvas.height = Math.max(2, FH >> 3);
  if (renderer) { maxDpr = Math.min(devicePixelRatio || 1, narrow ? (lite ? .85 : 1.5) : 1.25); curDpr = Math.min(curDpr || maxDpr, maxDpr); renderer.setPixelRatio(curDpr); renderer.setSize(FW, FH, false); camera.aspect = FW / FH; camera.updateProjectionMatrix(); }
}
listen(window, 'resize', layout);
layout();

/* ================= 3D scene ================= */
const V3 = THREE.Vector3;
const BG = new THREE.Color(0x06031a);
renderer = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setClearColor(0x000000, 0);
camera = new THREE.PerspectiveCamera(40, FW / FH, .25, 400);
const scene3 = new THREE.Scene();
layout();

function hash3(x, y, z) { const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return h - Math.floor(h); }
function vnoise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf); let r = 0;
  for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) for (let c = 0; c < 2; c++) r += hash3(xi + a, yi + b, zi + c) * (a ? u : 1 - u) * (b ? v : 1 - v) * (c ? w : 1 - w);
  return r;
}

/* ---- Tree growth (3D space colonization) ---- */
const C = new V3(0, 11.4, 0), CR = [8.6, 6.2, 8.6], TH = 5.0, TSTEPS = 9;
const nodes = [];
for (let i = 0; i <= TSTEPS; i++) { const y = TH * i / TSTEPS; nodes.push({ p: new V3(.22 * Math.sin(y * .5 + .4), y, .16 * Math.sin(y * .4 + 1.3)), par: i - 1, kr: 0, sum: 0 }); }
const TRUNKN = nodes.length;
let att = [];
while (att.length < 1500) {
  const x = R(-1, 1), y = R(-1, 1), z = R(-1, 1);
  if (x * x + y * y + z * z > 1) continue;
  const p = new V3(C.x + x * CR[0], C.y + y * CR[1], C.z + z * CR[2]);
  if (p.y < 6.6) continue;
  att.push(p);
}
const STEP = .5, DI = 3.6, DK = .8;
const grid = new Map(), cell = DI;
const gk = (a, b, c) => a * 73856093 ^ b * 19349663 ^ c * 83492791;
const gadd = i => { const p = nodes[i].p, k = gk(Math.floor(p.x / cell), Math.floor(p.y / cell), Math.floor(p.z / cell)); let l = grid.get(k); if (!l) grid.set(k, l = []); l.push(i); };
nodes.forEach((_, i) => gadd(i));
function nearestNode(p, maxD) {
  const cx = Math.floor(p.x / cell), cy = Math.floor(p.y / cell), cz = Math.floor(p.z / cell); let best = -1, bd = maxD * maxD;
  for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (let c = -1; c <= 1; c++) {
    const l = grid.get(gk(cx + a, cy + b, cz + c)); if (!l) continue;
    for (const i of l) { const d = nodes[i].p.distanceToSquared(p); if (d < bd) { bd = d; best = i; } }
  } return best;
}
for (let it = 0; it < 220 && att.length && nodes.length < 6500; it++) {
  const acc = new Map();
  for (const a of att) { const n = nearestNode(a, DI); if (n < 0) continue; const d = a.clone().sub(nodes[n].p).normalize(); const e = acc.get(n); if (e) e.add(d); else acc.set(n, d); }
  if (!acc.size) break;
  const born = [];
  acc.forEach((d, n) => {
    d.normalize(); d.y += .1; d.x += R(-.06, .06); d.z += R(-.06, .06); d.normalize();
    nodes.push({ p: nodes[n].p.clone().addScaledVector(d, STEP), par: n, kr: 0, sum: 0 }); born.push(nodes.length - 1);
  });
  born.forEach(gadd);
  att = att.filter(a => { const n = nearestNode(a, DK); return n < 0; });
}
/* smooth the zig-zag: relax single-child chains */
{ const kc = new Array(nodes.length).fill(0), ch = new Array(nodes.length).fill(-1);
  nodes.forEach((n, i) => { if (n.par >= 0) { kc[n.par]++; ch[n.par] = i; } });
  for (let pass = 0; pass < 4; pass++) {
    const np = nodes.map(n => n.p.clone());
    for (let i = TRUNKN; i < nodes.length; i++) if (kc[i] === 1) np[i].copy(nodes[i].p).multiplyScalar(.5).addScaledVector(nodes[nodes[i].par].p, .25).addScaledVector(nodes[ch[i]].p, .25);
    for (let i = TRUNKN; i < nodes.length; i++) nodes[i].p.copy(np[i]);
  } }
/* pipe model radii */
const RTIP = .026;
for (let i = nodes.length - 1; i >= 0; i--) {
  const n = nodes[i]; n.r = n.sum > 0 ? Math.pow(n.sum, 1 / 2.3) : RTIP;
  if (n.par >= 0) nodes[n.par].sum += Math.pow(n.r, 2.3);
}
const kScale = .30 / nodes[TRUNKN - 1].r;
nodes.forEach((n, i) => { n.r = Math.max(.022, n.r * kScale); });
for (let i = 0; i < TRUNKN; i++) { const y = nodes[i].p.y; nodes[i].r = Math.max(nodes[i].r, .30 * (1 + .45 * (1 - y / TH)) + .3 * Math.exp(-y / .5)); }
nodes[0].r = Math.max(nodes[0].r, .55);

/* ---- Stops and routes ---- */
const nearestTo = (p, from) => { let b = from, bd = 1e9; for (let i = from; i < nodes.length; i++) { const d = nodes[i].p.distanceTo(p); if (d < bd) { bd = d; b = i; } } return b; };
const STOP_NODE = [
  nearestTo(new V3(0, 2.4, 0), 0), nearestTo(new V3(0, 6.2, 0), 0),
  nearestTo(new V3(-3.8, 10.0, 1.2), TRUNKN), nearestTo(new V3(4.0, 9.6, 1.0), TRUNKN),
  nearestTo(new V3(-3.0, 13.6, -.4), TRUNKN), nearestTo(new V3(3.6, 13.2, 1.0), TRUNKN), nearestTo(new V3(.2, 16.6, .3), TRUNKN)
];
const chain = i => { const a = []; for (; i >= 0; i = nodes[i].par) a.push(i); return a; };
function nodePath(a, b) {
  const A = chain(a), B = chain(b), setB = new Set(B); let li = 0;
  while (!setB.has(A[li])) li++;
  const lca = A[li], pa = A.slice(0, li + 1), pb = B.slice(0, B.indexOf(lca)).reverse();
  return pa.concat(pb);
}
const ROUTE_NODES = [], ROUTE_ARC = [], ROUTE_LEN = [], ROUTE_CURVE = [];
const OFFV = new V3(.0, .12, .55);
function chaikin(pts, n) { for (let k = 0; k < n; k++) { const o = [pts[0]]; for (let i = 0; i < pts.length - 1; i++) { o.push(pts[i].clone().lerp(pts[i + 1], .25), pts[i].clone().lerp(pts[i + 1], .75)); } o.push(pts[pts.length - 1]); pts = o; } return pts; }
for (let i = 0; i < 7; i++) {
  const path = i === 0 ? nodePath(0, STOP_NODE[0]) : nodePath(STOP_NODE[i - 1], STOP_NODE[i]);
  const pts = path.map(n => nodes[n].p); ROUTE_NODES.push(pts);
  const arc = [0]; for (let k = 1; k < pts.length; k++) arc.push(arc[k - 1] + pts[k].distanceTo(pts[k - 1]));
  ROUTE_ARC.push(arc); ROUTE_LEN.push(Math.max(.8, arc[arc.length - 1]));
  const sm = chaikin(pts.map(p => p.clone().add(OFFV)), 2), al = [0];
  for (let k = 1; k < sm.length; k++) al.push(al[k - 1] + sm[k].distanceTo(sm[k - 1]));
  ROUTE_CURVE.push({ pts: sm, al, len: al[al.length - 1] || 1 });
}
function routeAt(i, s) {
  const c = ROUTE_CURVE[i], d = clamp(s) * c.len; let k = 1; while (k < c.al.length - 1 && c.al[k] < d) k++;
  const sp = c.al[k] - c.al[k - 1] || 1; return c.pts[k - 1].clone().lerp(c.pts[k], clamp((d - c.al[k - 1]) / sp));
}
function assign(p, maxD) {
  let bi = 7, bd = 1e9, bk = 0;
  for (let i = 0; i < 7; i++) { const pts = ROUTE_NODES[i]; for (let k = 0; k < pts.length; k++) { const d = p.distanceTo(pts[k]); if (d < bd) { bd = d; bi = i; bk = k; } } }
  if (bd > maxD) return [7, 0, 1];
  return [bi, ROUTE_ARC[bi][bk] + bd, ROUTE_LEN[bi], bd];
}

/* ---- Branch mesh ---- */
const SIDES = 9;
function buildBranches() {
  const nn = nodes.length, asg = nodes.map(n => assign(n.p, 3.0));
  const pos = [], nor = [], aS = [], aD = [], aL = [], idx = [];
  const Y = new V3(0, 1, 0), tmp = new V3();
  let base = 0;
  for (let i = 1; i < nn; i++) {
    const c = nodes[i], p = nodes[c.par], d = c.p.clone().sub(p.p), len = d.length(); if (len < 1e-4) continue; d.divideScalar(len);
    let u = new V3().crossVectors(d, Math.abs(d.y) > .95 ? new V3(0, 0, 1) : Y).normalize(), v = new V3().crossVectors(d, u).normalize();
    const r0 = Math.min(p.r, c.r * 1.5), r1 = c.r;
    for (let ring = 0; ring < 2; ring++) {
      const cen = ring ? c.p : p.p, rr = ring ? r1 : r0, a = asg[ring ? i : c.par];
      for (let s = 0; s < SIDES; s++) {
        const an = s / SIDES * Math.PI * 2, cs = Math.cos(an), sn = Math.sin(an);
        tmp.set(u.x * cs + v.x * sn, u.y * cs + v.y * sn, u.z * cs + v.z * sn);
        const bump = 1 + (c.r > .12 ? .16 : .06) * (vnoise(cen.x * 3 + cs * 1.7, cen.y * 2.2, cen.z * 3 + sn * 1.7) - .5);
        pos.push(cen.x + tmp.x * rr * bump, cen.y + tmp.y * rr * bump, cen.z + tmp.z * rr * bump); nor.push(tmp.x, tmp.y, tmp.z);
        aS.push(a[0]); aD.push(a[1]); aL.push(a[2]);
      }
    }
    for (let s = 0; s < SIDES; s++) { const s1 = (s + 1) % SIDES; idx.push(base + s, base + SIDES + s, base + s1, base + s1, base + SIDES + s, base + SIDES + s1); }
    base += SIDES * 2;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('aStop', new THREE.Float32BufferAttribute(aS, 1)); g.setAttribute('aDist', new THREE.Float32BufferAttribute(aD, 1)); g.setAttribute('aLen', new THREE.Float32BufferAttribute(aL, 1));
  g.setIndex(idx); return g;
}

const uni = { uProg: { value: [0, 0, 0, 0, 0, 0, 0, 0] }, uAll: { value: 0 }, uOpen: { value: 0 }, uTime: { value: 0 }, uCenter: { value: C.clone() }, uFog: { value: .017 }, uBg: { value: BG } };
const LIT_GLSL = `
attribute float aStop; attribute float aDist; attribute float aLen;
uniform float uProg[8]; uniform float uAll;
float litAt(){ float prog = uProg[int(aStop + .5)]; float reach = prog * (aLen + 3.4); return max(clamp((reach - aDist) / 1.1, 0., 1.), uAll); }`;
const branchMat = new THREE.ShaderMaterial({
  uniforms: uni,
  vertexShader: LIT_GLSL + `
  uniform float uFog; varying vec3 vN; varying vec3 vW; varying float vLit; varying float vFog;
  void main(){ vN = normal; vW = position; vLit = litAt(); vec4 mv = viewMatrix * vec4(position,1.); vFog = 1. - exp(-pow(length(mv.xyz) * uFog, 2.)); gl_Position = projectionMatrix * mv; }`,
  fragmentShader: `
  uniform vec3 uBg; varying vec3 vN; varying vec3 vW; varying float vLit; varying float vFog;
  void main(){
    vec3 N = normalize(vN), V = normalize(cameraPosition - vW);
    float bark = .7 + .55 * abs(sin(vW.y * 7. + sin(vW.x * 11. + vW.z * 9.) * 2.2)) * (.6 + .4 * sin(vW.x * 23. + vW.z * 19.));
    float f = pow(1. - abs(dot(N, V)), 2.2), up = .5 + .5 * N.y;
    vec3 dorm = vec3(.03,.028,.09) * (.7 + .8 * up) * bark + vec3(.10,.12,.45) * f * .38;
    vec3 lit = vec3(.09,.10,.28) * (.5 + up) * bark + vec3(.30,.42,1.0) * f * .6 + vec3(.55,.75,1.) * pow(f, 5.) * .6;
    vec3 col = mix(dorm, lit * (.45 + .95 * bark), vLit);
    gl_FragColor = vec4(mix(col, uBg, vFog), 1.);
  }`
});
const branchMesh = new THREE.Mesh(buildBranches(), branchMat); branchMesh.frustumCulled = false; scene3.add(branchMesh);

/* ---- Leaves (instanced) ---- */
function leafGeo() {
  const pos = [], uv = [], idx = [], N = 7;
  const wd = t => .30 * Math.pow(Math.sin(Math.PI * Math.pow(t, .78)), .85);
  for (let i = 0; i <= N; i++) {
    const t = i / N, y = t, w = wd(t);
    if (i === 0 || i === N) { pos.push(0, y, -.14 * y * y); uv.push(.5, y); }
    else { pos.push(-w, y, -.14 * y * y + .05 * w); uv.push(.5 - w, y); pos.push(w, y, -.14 * y * y + .05 * w); uv.push(.5 + w, y); }
  }
  // rows: 0 -> (1,2) -> (3,4) ... -> last
  const row = i => i === 0 ? [0] : i === N ? [pos.length / 3 - 1] : [1 + (i - 1) * 2, 2 + (i - 1) * 2];
  for (let i = 0; i < N; i++) {
    const a = row(i), b = row(i + 1);
    if (a.length === 1) idx.push(a[0], b[0], b[1]);
    else if (b.length === 1) idx.push(a[0], a[1], b[0]);
    else idx.push(a[0], a[1], b[0], a[1], b[1], b[0]);
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); return g;
}
const leafList = [];
const qA = new THREE.Quaternion(), qB = new THREE.Quaternion(), Y_ = new V3(0, 1, 0);
function addLeaf(p, dir, size, shell) {
  leafList.push({ p, dir, size, shell });
}
for (let i = 1; i < nodes.length; i++) {
  const n = nodes[i]; if (n.r > .13 || n.p.y < 6.2) continue;
  const cnt = n.sum === 0 ? 6 : 3;
  for (let k = 0; k < cnt; k++) {
    if (rnd() > .8) continue;
    const dir = new V3(R(-1, 1), R(-.5, 1), R(-1, 1)).normalize();
    addLeaf(n.p.clone().add(new V3(R(-.5, .5), R(-.4, .5), R(-.5, .5))), dir, R(.2, .36), 0);
  }
}
const innerCount = leafList.length;
for (let k = 0; k < (lite ? 1900 : 3400); k++) {
  const d = new V3(gauss(), gauss(), gauss()).normalize(); if (d.y < -.35) { k--; continue; }
  const p = new V3(C.x + d.x * CR[0] * R(.97, 1.07), C.y + d.y * CR[1] * R(.97, 1.07), C.z + d.z * CR[2] * R(.97, 1.07));
  addLeaf(p, d, R(.5, .8), 1);
}
const LN = leafList.length;
const lgeo = leafGeo(), igeo = new THREE.InstancedBufferGeometry();
igeo.index = lgeo.index; igeo.attributes.position = lgeo.attributes.position; igeo.attributes.uv = lgeo.attributes.uv;
const aCol = new Float32Array(LN * 3), aSt = new Float32Array(LN), aDi = new Float32Array(LN), aLe = new Float32Array(LN), aSh = new Float32Array(LN), aSe = new Float32Array(LN);
const lmesh = new THREE.InstancedMesh(lgeo.clone(), null, LN);
const col = new THREE.Color(), M4 = new THREE.Matrix4(), sc = new V3();
leafList.forEach((l, i) => {
  qA.setFromUnitVectors(Y_, l.dir); qB.setFromAxisAngle(Y_, rnd() * 6.28); qA.multiply(qB);
  M4.compose(l.p, qA, sc.set(l.size, l.size, l.size)); lmesh.setMatrixAt(i, M4);
  const p = l.p, mag = vnoise(p.x * .3 + 5, p.y * .3, p.z * .3) > .68 && !l.shell ? 1 : 0, topv = p.y > C.y + 3.6;
  if (mag) col.setHSL(R(.80, .88), .78, R(.5, .62));
  else if (topv) col.setHSL(R(.52, .6), .8, R(.52, .66));
  else col.setHSL(R(.61, .72), .82, R(.44, .6));
  aCol[i * 3] = col.r; aCol[i * 3 + 1] = col.g; aCol[i * 3 + 2] = col.b;
  let a = assign(p, l.shell ? -1 : 6.5); if (!l.shell) { if (a[0] === 6 && a[3] > 3.2) a = [6, a[1], a[2] + 3.4]; else if (a[3] > 3.2) a = [7, 0, 1]; } aSt[i] = a[0]; aDi[i] = a[1]; aLe[i] = a[2]; aSh[i] = l.shell; aSe[i] = rnd();
});
const IA = (arr, n) => new THREE.InstancedBufferAttribute(arr, n);
lmesh.geometry.setAttribute('aColor', IA(aCol, 3)); lmesh.geometry.setAttribute('aStop', IA(aSt, 1)); lmesh.geometry.setAttribute('aDist', IA(aDi, 1));
lmesh.geometry.setAttribute('aLen', IA(aLe, 1)); lmesh.geometry.setAttribute('aShell', IA(aSh, 1)); lmesh.geometry.setAttribute('aSeed', IA(aSe, 1));
lmesh.material = new THREE.ShaderMaterial({
  uniforms: uni, side: THREE.DoubleSide,
  vertexShader: LIT_GLSL + `
  attribute vec3 aColor; attribute float aShell; attribute float aSeed;
  uniform float uOpen; uniform float uTime; uniform vec3 uCenter; uniform float uFog;
  varying vec3 vCol; varying float vLit; varying vec2 vUv; varying float vFog;
  void main(){
    vec3 ctr0 = (modelMatrix * instanceMatrix * vec4(0.,0.,0.,1.)).xyz; float nd = length((viewMatrix * vec4(ctr0,1.)).xyz);
    vec3 lp = position * (1. - aShell * uOpen * .92) * smoothstep(1.3, 3.6, nd);
    vec4 wp = modelMatrix * instanceMatrix * vec4(lp, 1.);
    vec3 ctr = (modelMatrix * instanceMatrix * vec4(0.,0.,0.,1.)).xyz;
    wp.xyz += normalize(ctr - uCenter) * aShell * uOpen * 5.;
    wp.x += sin(uTime * 1.1 + ctr.y * .7 + aSeed * 6.28) * .06 * uv.y;
    wp.z += cos(uTime * .9 + ctr.x * .6 + aSeed * 6.28) * .05 * uv.y;
    vec4 mv = viewMatrix * wp; vFog = 1. - exp(-pow(length(mv.xyz) * uFog, 2.));
    vLit = aShell > .5 ? uAll : litAt(); vCol = aColor; vUv = uv; gl_Position = projectionMatrix * mv;
  }`,
  fragmentShader: `
  uniform vec3 uBg; varying vec3 vCol; varying float vLit; varying vec2 vUv; varying float vFog;
  void main(){
    float mid = abs(vUv.x - .5) * 3.4, rib = smoothstep(.12, .0, mid) * .22, edge = .8 + .3 * (1. - mid * mid);
    float grad = .72 + .55 * vUv.y;
    vec3 dark = vCol * .21 * (.8 + .5 * vUv.y) * edge;
    vec3 lit = vCol * (.62 + .95 * grad) * edge + vec3(.07,.1,.25) + rib * vCol + pow(vUv.y, 3.) * vec3(.2,.26,.5) * .5;
    vec3 c = mix(dark, lit, vLit);
    gl_FragColor = vec4(mix(c, uBg, vFog), 1.);
  }`
});
lmesh.frustumCulled = false; scene3.add(lmesh);

/* ---- Ground glow + stars + stop halos ---- */
function radTex(a, b) {
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, a); r.addColorStop(1, b); g.fillStyle = r; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
}
const ground = new THREE.Mesh(new THREE.PlaneGeometry(46, 46), new THREE.MeshBasicMaterial({ map: radTex('rgba(70,55,190,.55)', 'rgba(20,10,70,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: .55 }));
ground.rotation.x = -Math.PI / 2; ground.position.y = .02; scene3.add(ground);
const contact = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 4.6), new THREE.MeshBasicMaterial({ map: radTex('rgba(4,2,16,.95)', 'rgba(4,2,16,0)'), transparent: true, depthWrite: false }));
contact.rotation.x = -Math.PI / 2; contact.position.y = .04; scene3.add(contact);
const starGeo = new THREE.BufferGeometry(), sp = [];
for (let i = 0; i < 520; i++) { const d = new V3(gauss(), Math.abs(gauss()) * .8 + .05, gauss() - .6).normalize().multiplyScalar(170); sp.push(d.x, d.y + 5, d.z); }
starGeo.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
const stars3 = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xdfeaff, size: 1.7, sizeAttenuation: false, transparent: true, opacity: .75, depthWrite: false }));
stars3.frustumCulled = false; scene3.add(stars3);
const haloTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, 'rgba(190,215,255,.8)'); r.addColorStop(.25, 'rgba(160,170,255,.35)'); r.addColorStop(.6, 'rgba(120,100,255,.1)'); r.addColorStop(1, 'rgba(120,100,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })(), halos = [];
for (let i = 0; i < 7; i++) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0 }));
  s.position.copy(nodes[STOP_NODE[i]].p).add(new V3(0, 0, .9)); s.scale.setScalar(i === 6 ? 9 : 4.4); scene3.add(s); halos.push(s);
}

/* ================= Timeline ================= */
const STOP_P = [.30, .39, .48, .57, .66, .74, .83];
const WIN = [[.255, .345], [.345, .435], [.435, .525], [.525, .615], [.615, .70], [.70, .785]];

const CW = new V3(0, 9.4, 0);
const S = i => nodes[STOP_NODE[i]].p;
const KEYS = [];
const K = (p, stop, off, fx, fy, kn, fyn) => KEYS.push({ p, stop, off: new V3(...off), fx, fy, kn, fyn });
K(0, CW, [0, 2.5, 36], .5, .5, 1.85, .5);
K(.22, CW, [0, 1.6, 31], .5, .5, 1.85, .5);
const OFFS = [[3.2, 1.0, 11.5, .64], [-2.0, .5, 7.0, .36], [2.4, .8, 5.8, .64], [-2.4, .6, 5.6, .36], [2.2, .5, 5.6, .64], [-2.0, .5, 5.4, .36], [0, -1.2, 6.2, .5]];
for (let i = 0; i < 7; i++) {
  const o = OFFS[i], fy = i === 6 ? .38 : .5;
  K(STOP_P[i] - .02, S(i), [o[0], o[1], o[2]], o[3], fy, 1.3, .27);
  K(STOP_P[i] + .02, S(i), [o[0], o[1], o[2]], o[3], fy, 1.3, .27);
}
K(.965, CW, [0, 2.6, 47], .5, .40, 1.4, .40);
K(1, CW, [0, 2.6, 47], .5, .40, 1.4, .40);
const lookV = new V3(), posV = new V3(), rightV = new V3(), upV = new V3(), dirV = new V3();
function camAt(p) {
  let k = 0; while (k < KEYS.length - 2 && p > KEYS[k + 1].p) k++;
  const a = KEYS[k], b = KEYS[k + 1], t = smooth(a.p, b.p, p);
  const stop = a.stop.clone().lerp(b.stop, t), off = a.off.clone().lerp(b.off, t);
  const kn = lerp(a.kn, b.kn, t), fx = narrow ? .5 : lerp(a.fx, b.fx, t), fy = narrow ? lerp(a.fyn, b.fyn, t) : lerp(a.fy, b.fy, t);
  return { stop, off, kn, fx, fy };
}
function placeCamera(p) {
  const c = camAt(p); posV.copy(c.stop).addScaledVector(c.off, narrow ? c.kn : 1);
  dirV.copy(c.stop).sub(posV); const dist = dirV.length(); dirV.normalize();
  rightV.crossVectors(dirV, new V3(0, 1, 0)).normalize(); upV.crossVectors(rightV, dirV).normalize();
  const tv = Math.tan(camera.fov * Math.PI / 360), th = tv * camera.aspect;
  lookV.copy(c.stop).addScaledVector(rightV, -(c.fx - .5) * 2 * th * dist).addScaledVector(upV, -(.5 - c.fy) * 2 * tv * dist);
  const sway = reduced ? 0 : 1;
  posV.addScaledVector(rightV, ((mx - .5) * .9 + Math.sin(t * .35) * .12) * sway).addScaledVector(upV, ((.5 - my) * .5 + Math.cos(t * .3) * .08) * sway);
  camera.position.copy(posV); camera.up.set(0, 1, 0); camera.lookAt(lookV);
}

/* ================= FX + cards ================= */
const petals = Array.from({ length: 26 }, (_, i) => ({ x: Math.random(), y: Math.random(), v: .00006 + Math.random() * .00012, ph: Math.random() * TAU, sz: 3 + Math.random() * 4, h: 250 + Math.random() * 70 }));
const dust = [];
const cards = [0, 1, 2, 3, 4, 5].map(i => document.getElementById('c' + i));
let t = 0, bx = null, by = null, tilt = 0, lastX = null, portalC = [0, 0], frameN = 0;
document.getElementById('enter').addEventListener('click', e => {
  e.preventDefault(); const range = stage.offsetHeight - innerHeight;
  scrollTo({ top: stage.offsetTop + .27 * range, behavior: 'smooth' });
});
const proj = new V3();
function toScreen(v) { proj.copy(v).project(camera); return [(proj.x * .5 + .5) * FW, (-proj.y * .5 + .5) * FH, proj.z]; }
function butterflyWorld(p) {
  const W1 = ST => ST;
  if (p < STOP_P[0] + .02) return S(0).clone().add(OFFV);
  for (let i = 1; i < 7; i++) {
    const a = STOP_P[i - 1] + .02, b = STOP_P[i] - .02;
    if (p < b) return routeAt(i, smooth(a, b, p));
    if (p < STOP_P[i] + .02) return routeAt(i, 1);
  }
  const top = new V3(.1, 18.6, .6), e = smooth(.86, .96, p);
  return routeAt(6, 1).lerp(top, e);
}
/* ================= FX2: fairy-dust trail + logo dust (cheap, batched) ================= */
const hexRgb = h => [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16));
function shapePts(keys) {
  const H = 64, c = document.createElement('canvas'); c.width = Math.max(220, 70 * keys.length); c.height = H;
  const g = c.getContext('2d'); g.fillStyle = '#fff';
  keys.forEach((k, i) => {
    const t = TECH[k];
    if (t && t.d) { g.save(); g.translate(i * 70 + 5, 5); g.scale(54 / 24, 54 / 24); g.fill(new Path2D(t.d)); g.restore(); }
    else { g.font = '700 40px Arial,sans-serif'; g.textBaseline = 'middle'; g.textAlign = 'left'; g.fillText((t && t.name) || k, 5, 34); }
  });
  const im = g.getImageData(0, 0, c.width, H).data, pts = []; let x0 = 1e9, x1 = -1e9;
  for (let y = 0; y < H; y++) for (let x = 0; x < c.width; x++) if (im[(y * c.width + x) * 4 + 3] > 140) { pts.push([x, y]); if (x < x0) x0 = x; if (x > x1) x1 = x; }
  const cx = (x0 + x1) / 2;
  for (let i = pts.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pts[i], pts[j]] = [pts[j], pts[i]]; }
  const wPx = (x1 - x0) * .75;
  const out = pts.slice(0, 420).map(p => ({ x: (p[0] - cx) * .75, y: (p[1] - H / 2) * .75, cx: (Math.random() - .5) * 130, cy: (Math.random() - .5) * 130, sx: (Math.random() - .5) * 10, sy: (Math.random() - .5) * 10, j: Math.random(), dx: (Math.random() - .5) * .6, dy: (Math.random() - .5) * .5 }));
  out.w = wPx; return out;
}
const DUST_ITEMS = [];
[[2, '#c2'], [3, '#c3']].forEach(([stop, sel]) => {
  const list = [...document.querySelectorAll(sel + ' .tags span[data-logo]')];
  list.forEach((el, idx) => {
    const keys = el.dataset.logo.split(' ').filter(Boolean), t0 = TECH[keys[0]];
    DUST_ITEMS.push({ el, idx, n: list.length, pts: shapePts(keys), g0: STOP_P[stop] - .040 + idx * .0012, f0: STOP_P[stop] - .006 + idx * .0012, brand: hexRgb(t0 && t0.hex ? inkFor(t0.hex).slice(1) : 'f1ecf8'), rect: null });
  });
});
if (reduced) document.querySelectorAll('.card .tags span[data-logo]').forEach(e => e.classList.add('lit'));
const GDUR = .010, FDUR = .012;
const ease3 = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
function readRects(p) { for (const it of DUST_ITEMS) if (p > it.g0 - .005 && p < it.f0 + FDUR + .005) it.rect = it.el.getBoundingClientRect(); }
const sprites = [[150, 230, 255], [215, 195, 255], [255, 255, 255]].map(rgb => {
  const c = document.createElement('canvas'); c.width = c.height = 32; const g = c.getContext('2d'), r = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  r.addColorStop(0, `rgba(${rgb},1)`); r.addColorStop(.3, `rgba(${rgb},.55)`); r.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = r; g.fillRect(0, 0, 32, 32); return c;
});
const fairy = []; let emitAcc = 0, lastPos = null, fxMode = '';
function drawFx2(p, pos, scale, mode, bw, dt) {
  fx2.clearRect(0, 0, FW, FH);
  if (reduced) return;
  for (const it of DUST_ITEMS) it.el.classList.toggle('lit', p >= it.f0 + FDUR * .92);
  if (p < .1) return;
  /* ---- fairy dust that trails the butterfly ---- */
  if (fxMode !== mode) { fairy.length = 0; fxMode = mode; }
  const speed = lastPos ? Math.min(40, Math.hypot(pos[0] - lastPos[0], pos[1] - lastPos[1])) : 0; lastPos = pos.slice();
  emitAcc += dt * (22 + speed * 4.5);
  const world = mode === 'world' && bw;
  while (emitAcc >= 1 && fairy.length < 260) {
    emitAcc -= 1;
    const life = 1.1 + Math.random() * 1.1, sp = sprites[(Math.random() * 3) | 0];
    if (world) fairy.push({ w: bw.clone().add(new V3((Math.random() - .5) * .22, (Math.random() - .5) * .22, (Math.random() - .5) * .22)), vx: (Math.random() - .5) * .3, vy: -.03 - Math.random() * .16, vz: (Math.random() - .5) * .25, life, age: 0, sz: 2 + Math.random() * 4.5, ph: Math.random() * 6.28, sp });
    else fairy.push({ x: pos[0] + (Math.random() - .5) * 12, y: pos[1] + 6 + Math.random() * 8, vx: (Math.random() - .5) * 26, vy: 6 + Math.random() * 22, life, age: 0, sz: 2 + Math.random() * 4.5, ph: Math.random() * 6.28, sp });
  }
  emitAcc = Math.min(emitAcc, 3);
  fx2.globalCompositeOperation = 'lighter';
  const tt = performance.now() / 1000, kk = (narrow ? .8 : 1) * clamp(scale, .5, 1.4);
  for (let i = fairy.length - 1; i >= 0; i--) {
    const f = fairy[i]; f.age += dt; if (f.age >= f.life) { fairy.splice(i, 1); continue; }
    let x, y;
    if (f.w) { f.w.x += (f.vx + Math.sin(tt * 1.7 + f.ph) * .05) * dt; f.w.y += f.vy * dt; f.w.z += f.vz * dt; const s = toScreen(f.w); if (s[2] > 1) continue; x = s[0]; y = s[1]; }
    else { f.x += f.vx * dt; f.y += f.vy * dt; x = f.x; y = f.y; }
    const a = f.age / f.life, tw = .65 + .35 * Math.sin(tt * 9 + f.ph), al = Math.pow(1 - a, 1.4) * tw * .9, sz = f.sz * kk * (1 - a * .4) * (.8 + .4 * tw);
    fx2.globalAlpha = al; fx2.drawImage(f.sp, x - sz, y - sz, sz * 2, sz * 2);
  }
  fx2.globalAlpha = 1;
  /* ---- logo dust: gathers around the butterfly in a tidy grid, then flies into its chip ---- */
  const sc = narrow ? .62 : 1.15, cols = n => narrow ? 4 : (n > 6 ? 4 : 3), cw = narrow ? Math.min(88, (FW - 24) / 4) : 128, ch = narrow ? 62 : 100;
  for (const it of DUST_ITEMS) {
    if (p < it.g0 || p > it.f0 + FDUR || !it.rect) continue;
    const C = cols(it.n), R = Math.ceil(it.n / C), col = it.idx % C, row = Math.floor(it.idx / C);
    const inRow = row < R - 1 ? C : it.n - (R - 1) * C, colOff = narrow ? col - (inRow - 1) / 2 : col - (C - 1) / 2;
    const fit = Math.min(1, (cw * .86) / Math.max(1, it.pts.w * sc));
    // Phones: a tidy block at the top of the screen (rows never collapse onto each other); desktop: above the butterfly.
    const gx = narrow ? FW / 2 + colOff * cw : clamp(pos[0] + colOff * cw, 60, FW - 60);
    const roomAbove = pos[1] - 56 - R * ch - 56, wBelow = 1 - smooth(-20, 20, roomAbove);
    const topAbove = clamp(pos[1] - 56 - R * ch, 56, FH * .45), topBelow = clamp(pos[1] + 62, 56, FH * .58 - R * ch);
    const gy = narrow ? lerp(topAbove, topBelow, wBelow) + row * ch : clamp(pos[1] - 96 - (R - 1 - row) * ch, 50, FH - 80);
    const rc = it.rect, gq = clamp((p - it.g0) / GDUR), fq = clamp((p - it.f0) / FDUR);
    const rgbA = [205, 220, 255], rgbB = [225, 208, 255];
    const draw = (cnt, fill, size) => {
      fx2.fillStyle = fill; fx2.beginPath();
      for (let k = 0; k < it.pts.length; k++) { const pt = it.pts[k], xy = pt._xy; fx2.rect(xy[0] - size / 2, xy[1] - size / 2, size, size); }
      fx2.fill();
    };
    let alpha = 1, rgb = rgbA;
    for (const pt of it.pts) {
      const fxp = gx + pt.x * sc * fit, fyp = gy + pt.y * sc * fit; let x, y;
      if (fq <= 0) {
        const ep = clamp(ease3(gq) * 1.35 - .35 * pt.j), sw = Math.sin(ep * Math.PI);
        x = lerp(pos[0] + pt.sx, fxp, ep) + sw * pt.cx * .7; y = lerp(pos[1] + pt.sy, fyp, ep) + sw * pt.cy * .7;
      } else {
        const ep = clamp(ease3(fq) * 1.35 - .35 * pt.j), sw = Math.sin(ep * Math.PI);
        const dxp = rc.left + rc.width / 2 + pt.dx * rc.width, dyp = rc.top + rc.height / 2 + pt.dy * rc.height;
        x = lerp(fxp, dxp, ep) + sw * pt.cx * .5; y = lerp(fyp, dyp, ep) + sw * pt.cy * .5;
      }
      pt._xy = [x, y];
    }
    const fade = fq > 0 ? 1 - smooth(.8, 1, fq) : Math.min(1, gq * 3);
    const mixc = fq > 0 ? ease3(fq) : 0, col2 = rgbA.map((v, i) => Math.round(lerp(v, it.brand[i], mixc)));
    draw(0, `rgba(${col2[0]},${col2[1]},${col2[2]},${(.16 * fade).toFixed(3)})`, 3.4);
    draw(0, `rgba(${Math.min(255, col2[0] + 30)},${Math.min(255, col2[1] + 30)},${Math.min(255, col2[2] + 30)},${(.95 * fade).toFixed(3)})`, 1.5);
  }
  fx2.globalCompositeOperation = 'source-over';
}
let psm = null, lastNow = performance.now(), lastRenderP = -1, lastPR = portal.getBoundingClientRect(), dtAvg = .016, adaptN = 0;

/* ================= Project stars ================= */
const PROJ = [
 { n:'SANA', s:'sana', c:'AI-Powered Creative Workspace · Full-Stack · Team Project', d:[['What it is',"A creative workspace where ideas become structured plans, with an AI assistant that suggests and the user approves."],['What I built',"The whole Creativity domain with its AI, from story maps and dialogue trees to characters and moodboards, plus the complete frontend."],['Highlight',"AI never changes a project without the user's approval."]], xy:[[74,7],[90,40]], pl:['#c8fbff','#3cc4dc','#124a63','#6fe0f088',12,'']  },
 { n:'Mergab', s:'mergab', c:'Simulation · Expo Hackathon · Team Project', d:[['What it is',"A smart system for Expo visitors that simulates crowds minute by minute and predicts where congestion will happen."],['What I built',"The Java and Spring Boot simulation: how visitors move between zones, and how events and prayer times change the flow."],['Highlight',"Models real crowd behavior, including prayer-time flow and scheduled events."]], xy:[[90,52],[10,52]], pl:['#dac8ff','#8d63e0','#2f1a63','#a47df088',16,'moon']  },
 { n:'Sahl Darbak', s:'sahl-darbak', c:'AI Travel Planning · Capstone 3 · Team Project', d:[['What it is',"An AI-powered travel platform for discovering destinations, planning full trips, and connecting with other travelers."],['What I built',"The Discover area: AI destination picks, country comparison, packing list, transport and the travel community."],['Highlight',"Recommendations use real weather and holiday data."]], xy:[[25,12],[30,8]], pl:['#ffd9a8','#e8883a','#6a2f12','#f0a05a88',15,'']  },
 { n:'TasmeemHub', s:'tasmeemhub', c:'Full-Stack · AI Integration · Capstone 2 · Solo Project', d:[['What it is',"A marketplace that connects clients with designers, from the first request to the final delivery."],['What I built',"Everything, solo: backend, APIs, workflows, frontend and the AI features."],['Highlight',"AI-assisted proposals and designer matching."]], xy:[[86,20],[80,12]], pl:['#ffd3ef','#d86bb0','#5a1f52','#e17bc088',17,'ring']  },
 { n:'WasteWise', s:'wastewise', c:'Computer Vision · Graduation Project', d:[['What it is',"A real-time waste detection system that recognizes plastic, metal and trash through the camera."],['What I built',"Dataset preparation, YOLOv8s training and fine-tuning, and evaluation."],['Highlight',"92.19% mAP@50 on the project's evaluation."]], xy:[[16,30],[12,30]], pl:['#9ff0d8','#2fa58f','#0e3f40','#47d1b588',13,'']  }
];
const pEl = document.getElementById('pstars'), starLines = document.getElementById('starLines');
const spanel = document.getElementById('spanel'); let lastStarBtn = null;
const starBtns = PROJ.map((pr, i) => {
  const b = document.createElement('button'); b.className = 'star'; b.type = 'button'; b.style.setProperty('--d', (-i * 3.7) + 's');
  b.innerHTML = '<i class="' + pr.pl[5] + '" style="--c1:' + pr.pl[0] + ';--c2:' + pr.pl[1] + ';--c3:' + pr.pl[2] + ';--g:' + pr.pl[3] + ';width:' + pr.pl[4] + 'px;height:' + pr.pl[4] + 'px;--dur:' + (14 + i * 3) + 's">' + (pr.pl[5] === 'moon' ? '<b class="m"></b>' : '') + '</i><span>' + pr.n + '</span>'; b.setAttribute('aria-label', 'Open ' + pr.n);
  b.addEventListener('click', () => openStar(i, b)); pEl.appendChild(b); return b;
});
function placeStars() {
  const k = narrow ? 1 : 0; let html = '';
  PROJ.forEach((pr, i) => { starBtns[i].style.left = pr.xy[k][0] + '%'; starBtns[i].style.top = pr.xy[k][1] + '%'; });
  const order = narrow ? [0, 1, 2, 3, 4] : [0, 1, 2, 3, 4];
  for (let i = 0; i < order.length - 1; i++) { const a = PROJ[order[i]].xy[k], b = PROJ[order[i + 1]].xy[k]; html += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"/>'; }
  starLines.innerHTML = html;
}
placeStars(); listen(window, 'resize', placeStars);
function openStar(i, btn) {
  const pr = PROJ[i]; lastStarBtn = btn;
  document.getElementById('spC').textContent = pr.c; document.getElementById('spT').textContent = pr.n;
  document.getElementById('spB').innerHTML = pr.d.map(x => '<p><b>' + x[0] + '</b>' + x[1] + '</p>').join('') + (pr.stat ? '<span class="stat">' + pr.stat + '</span>' : '');
  const more = document.getElementById('spMore'); more.setAttribute('href', '/projects/' + pr.s);
  spanel.classList.add('open'); document.getElementById('spX').focus();
}
function closeStar() { spanel.classList.remove('open'); if (lastStarBtn) lastStarBtn.focus(); }
document.getElementById('spX').addEventListener('click', closeStar);
document.getElementById('spMore').addEventListener('click', () => { spanel.classList.remove('open'); });
spanel.addEventListener('click', e => { if (e.target === spanel) closeStar(); });
listen(window, 'keydown', e => { if (e.key === 'Escape' && spanel.classList.contains('open')) closeStar(); });
function updateStars(p) {
  pEl.style.setProperty('--stars', smooth(.89, .93, p).toFixed(3));
  starBtns.forEach((b, i) => { const v = smooth(.915 + i * .008, .945 + i * .008, p); b.style.setProperty('--s', v.toFixed(3)); b.classList.toggle('on', v > .6); });
}

/* ================= Sound (Web Audio, procedural, muted by default) ================= */
const SND = (() => {
  let tipT = 0; let ac = null, master, padG, nextTw = 0, on = false, padOsc = [], lastP = 0;
  const btn = document.getElementById('snd'), tip = document.getElementById('sndTip');
  const PENT = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99];
  function init() {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
    ac = new AC(); master = ac.createGain(); master.gain.value = 0; master.connect(ac.destination);
    // soft reverb-ish echo
    const dly = ac.createDelay(1); dly.delayTime.value = .32; const fb = ac.createGain(); fb.gain.value = .38; const dl = ac.createBiquadFilter(); dl.type = 'lowpass'; dl.frequency.value = 2200;
    dly.connect(dl); dl.connect(fb); fb.connect(dly); const wet = ac.createGain(); wet.gain.value = .35; dl.connect(wet); wet.connect(master);
    fx = ac.createGain(); fx.connect(master); fx.connect(dly);
    // pad: Am add9 drone
    padG = ac.createGain(); padG.gain.value = .0; const pf = ac.createBiquadFilter(); pf.type = 'lowpass'; pf.frequency.value = 900; pf.Q.value = .6; padG.connect(pf); pf.connect(master); padF = pf;
    [130.81, 196, 261.63, 329.63, 392, 523.25].forEach((f, i) => { const o = ac.createOscillator(); o.type = i % 2 ? 'sine' : 'triangle'; o.frequency.value = f; o.detune.value = (i - 2) * 4; const g = ac.createGain(); g.gain.value = i < 2 ? .35 : .22; o.connect(g); g.connect(padG); o.start(); padOsc.push(o);
      const l = ac.createOscillator(), lg = ac.createGain(); l.frequency.value = .05 + i * .021; lg.gain.value = 3; l.connect(lg); lg.connect(o.detune); l.start(); });
    return true;
  }
  let fx, padF;
  function bell(freq, vol = .16, dur = 2.6, when = 0) {
    if (!on || !ac) return; const t0 = ac.currentTime + when;
    [[1, 1], [2.76, .22], [5.4, .08]].forEach(([m, a]) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.value = freq * m; g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vol * a, t0 + .012); g.gain.exponentialRampToValueAtTime(.0001, t0 + dur / (m > 1 ? m * .6 : 1)); o.connect(g); g.connect(fx); o.start(t0); o.stop(t0 + dur + .1); });
  }
  function whoosh() {
    if (!on || !ac) return; const t0 = ac.currentTime, n = ac.sampleRate * 2, buf = ac.createBuffer(1, n, ac.sampleRate), d = buf.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const s = ac.createBufferSource(); s.buffer = buf; const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.2; f.frequency.setValueAtTime(300, t0); f.frequency.exponentialRampToValueAtTime(3200, t0 + .7); f.frequency.exponentialRampToValueAtTime(500, t0 + 1.8);
    const g = ac.createGain(); g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(.32, t0 + .55); g.gain.exponentialRampToValueAtTime(.001, t0 + 1.9); s.connect(f); f.connect(g); g.connect(fx); s.start(t0); s.stop(t0 + 2);
    bell(PENT[0] / 2, .2, 4);
  }
  function shimmer() { [0, 2, 4, 5, 7, 8].forEach((k, i) => bell(PENT[k] * (i > 3 ? 2 : 1), .1, 3, i * .16)); }
  function setOn(v) {
    if (v && !ac && !init()) return; on = v; if (ac) { if (v) ac.resume(); master.gain.cancelScheduledValues(ac.currentTime); master.gain.linearRampToValueAtTime(v ? .9 : 0, ac.currentTime + (v ? 1.2 : .4)); }
    btn.setAttribute('aria-pressed', v); tip.classList.remove('show'); try { localStorage.setItem('emw-sound', v ? '1' : '0'); } catch (e) {}
    if (v) bell(PENT[2], .12, 3);
  }
  btn.addEventListener('click', () => setOn(!on));
  tipT = setTimeout(() => { if (!on) tip.classList.add('show'); setTimeout(() => tip.classList.remove('show'), 5000); }, 1800);
  listen(document, 'visibilitychange', () => { if (!ac) return; if (document.hidden) ac.suspend(); else if (on) ac.resume(); });
  return {
    get on() { return on; },
    bell, shimmer,
    dispose() { clearTimeout(tipT); try { if (ac) ac.close(); } catch (err) {} },
    update(p, inStage) {
      btn.classList.toggle('gone', !inStage);
      if (!ac || !on) { lastP = p; return; }
      const tt = ac.currentTime;
      const scene = smooth(.17, .26, p);
      padG.gain.setTargetAtTime(.025 + .04 * scene + .03 * smooth(.86, .95, p), tt, .8);
      padF.frequency.setTargetAtTime(700 + 900 * smooth(.2, .9, p), tt, .8);
      if (tt > nextTw && p > .2) { bell(PENT[(Math.random() * 9) | 0] * 2, .03, 2.2); nextTw = tt + 2.5 + Math.random() * 4; }
      if (p > lastP) {
        if (lastP < .19 && p >= .19 && p < .3) whoosh();
        STOP_P.forEach((sp, i) => { if (lastP < sp - .03 && p >= sp - .03 && p < sp + .06) bell(PENT[Math.min(8, i + 2)], .14, 3.2); });
        if (lastP < .9 && p >= .9 && p < .98) shimmer();
      }
      lastP = p;
    }
  };
})();
const _openStar = openStar; openStar = function (i, b) { _openStar(i, b); SND.bell([523.25, 587.33, 659.25, 783.99, 880][i], .13, 2.8); };
starBtns.forEach((b, i) => b.addEventListener('pointerenter', () => { if (matchMedia('(hover:hover)').matches) SND.bell([1046.5, 1174.7, 1318.5, 1568, 1760][i], .04, 1.6); }));

/* ---- companion mode: when the story ends the butterfly leaves the tree-top, circles the crown once, comes to the cursor,
        and from then on follows the visitor through the portfolio. It is the only butterfly on the page. ---- */
let glFilter = '', fol = 0, fpx = 0, fpy = 0, sv = 0, lastSY = 0, lastTree = null, orbitT = -1, orbitEnd = 0, ORB = null, perch = null, perchN = 0, heads = [];
const ORB_DUR = 2.5;
const followTarget = () => {
  const m = narrow ? 18 : 56, now = performance.now();
  let tx, ty;
  if (matchMedia('(hover:hover)').matches && lastMoveT > 0 && (now - lastMoveT < 2600 || now - orbitEnd < 2600)) { tx = mx * innerWidth + 70; ty = my * innerHeight + 46; }
  else {
    if (++perchN % 12 === 1) {
      if (perchN % 120 === 1) heads = [...document.querySelectorAll('.pf-hero h2, .pf-h, .case-head h1')];
      perch = null; let best = 1e9;
      for (const h of heads) { const r = h.getBoundingClientRect(); if (r.top > innerHeight * .18 && r.top < innerHeight * .48 && r.top < best) { best = r.top; perch = [clamp(r.left + Math.min(r.width, 720) + 46, 60, innerWidth - 60), r.top + Math.min(r.height * .25, 30)]; } }
    }
    if (perch && !narrow) { tx = perch[0]; ty = perch[1]; } else { tx = narrow ? innerWidth - 20 : innerWidth * .82; ty = narrow ? innerHeight * .46 : innerHeight * .62; }
    if (!reduced) { tx += Math.sin(t * .9) * 24; ty += Math.cos(t * 1.3) * 15; }
    // phones: no cursor, so the butterfly answers the scroll instead: it flutters inward and dips with the swipe, then settles on the edge
    if (narrow && !reduced) { tx -= clamp(Math.abs(sv) * 1.6, 0, 46); ty += clamp(sv * 5, -80, 110) + Math.sin(scrollY * .006) * 34; }
  }
  return [clamp(tx, m, innerWidth - m), clamp(ty + (narrow ? 0 : clamp(sv * 3, -30, 80)), m, innerHeight - m)];
};
/* where the crown is on screen, so the butterfly can circle it (call while the camera is placed) */
const orbitSetup = () => {
  const c = toScreen(C), x = toScreen(C.clone().add(new V3(CR[0], 0, 0))), y = toScreen(C.clone().add(new V3(0, CR[1], 0)));
  return { cx: c[0], cy: c[1], rx: Math.abs(x[0] - c[0]) * 1.12, ry: Math.abs(y[1] - c[1]) * 1.1 };
};
function companionStep(dtS, treeScreen, folGoal, canOrbit) {
  fol += (folGoal - fol) * (1 - Math.exp(-dtS * 6));
  if (folGoal === 0) { orbitT = -1; if (fol < .01) { fol = 0; if (treeScreen) { fpx = treeScreen[0]; fpy = treeScreen[1]; } return treeScreen; } }
  if (folGoal === 1 && orbitT < 0) {
    if (canOrbit && !reduced) { ORB = orbitSetup(); orbitT = 0; } else { orbitT = ORB_DUR; orbitEnd = performance.now(); if (!treeScreen) { const g = followTarget(); fpx = g[0]; fpy = g[1]; fol = 1; } }
  }
  if (orbitT >= 0 && orbitT < ORB_DUR && ORB && treeScreen) {
    orbitT += dtS; const u = clamp(orbitT / ORB_DUR), ang = -Math.PI / 2 + ease3(u) * TAU * 1.1, sh = 1 - .25 * u;
    const op = [ORB.cx + Math.cos(ang) * ORB.rx * sh, ORB.cy + Math.sin(ang) * ORB.ry * sh + u * ORB.ry * .25], w = smooth(0, .12, u);
    fpx = lerp(treeScreen[0], op[0], w); fpy = lerp(treeScreen[1], op[1], w);
    if (orbitT >= ORB_DUR) orbitEnd = performance.now();
    return [fpx, fpy];
  }
  if (orbitT < ORB_DUR) { orbitT = ORB_DUR; orbitEnd = performance.now(); }
  const tg = followTarget(), kc = 1 - Math.exp(-dtS * 2.8);
  fpx += (tg[0] - fpx) * kc; fpy += (tg[1] - fpy) * kc;
  return [fpx, fpy];
}
function placeGuide(pos, scale) {
  if (lastX !== null) tilt += (clamp((pos[0] - lastX) * .6, -14, 14) - tilt) * .12;
  lastX = pos[0];
  guide.style.transform = `translate3d(${pos[0].toFixed(1)}px,${pos[1].toFixed(1)}px,0) translate(-50%,-50%) rotate(${tilt.toFixed(1)}deg) scale(${(scale * (narrow ? lerp(.8, .5, fol) : 1)).toFixed(3)})`;
}

function loop() {
  if (stopped) return;
  t += .016; frameN++;
  const nowT = performance.now(), dtS = Math.min(.1, (nowT - lastNow) / 1000); lastNow = nowT;
  const range = stage.offsetHeight - innerHeight, pTarget = clamp(scrollY / range);
  sv += ((scrollY - lastSY) - sv) * .15; lastSY = scrollY;
  if (scrollY > stage.offsetTop + stage.offsetHeight - 2) {
    SND.update(1, false);
    const ft = frame.getBoundingClientRect().top, ts = lastTree ? [lastTree[0], lastTree[1] + ft] : null;
    guide.style.opacity = narrow ? lerp(1, .55, fol).toFixed(2) : '1';
    const cp = companionStep(dtS, ts, 1, false); placeGuide(cp, lerp(lastTree ? lastTree[2] : .6, .6, fol));
    raf = requestAnimationFrame(loop); return;
  }
  if (psm === null) psm = pTarget; psm += reduced ? (pTarget - psm) : (pTarget - psm) * (1 - Math.exp(-dtS * 6.5)); if (Math.abs(pTarget - psm) < 1e-5) psm = pTarget;
  const p = psm;
  readRects(p); if (p < .26) lastPR = portal.getBoundingClientRect();
  dtAvg += (dtS - dtAvg) * .05; if (++adaptN > 50) { adaptN = 0; if (dtAvg > .028 && curDpr > .7) { curDpr = Math.max(.7, curDpr - .15); renderer.setPixelRatio(curDpr); renderer.setSize(FW, FH, false); } else if (dtAvg < .0185 && curDpr < maxDpr) { curDpr = Math.min(maxDpr, curDpr + .1); renderer.setPixelRatio(curDpr); renderer.setSize(FW, FH, false); } }
  gateway.style.setProperty('--gateway-scale', Math.exp(Math.log(9) * smooth(.04, .19, p)).toFixed(3)); gateway.style.setProperty('--copy-op', (1 - smooth(.01, .075, p)).toFixed(3)); gateway.style.setProperty('--gate-fx', (1 - smooth(.03, .11, p)).toFixed(3));
  gateway.style.setProperty('--gateway-opacity', (1 - smooth(.15, .225, p)).toFixed(3));
  world.style.setProperty('--world-opacity', smooth(.175, .255, p).toFixed(3));
  flashEl.style.setProperty('--flash', (smooth(.19, .213, p) * (1 - smooth(.213, .248, p)) * .5).toFixed(3));
  progressBar.style.setProperty('--journey', p.toFixed(4));
  if (narrow) { // phones: the crown is small on screen, so give the final "everything lights up" a little extra punch
    const eb = smooth(.86, .95, p), f = eb > .01 ? `brightness(${(1 + .32 * eb).toFixed(2)}) saturate(${(1 + .35 * eb).toFixed(2)})` : '';
    if (f !== glFilter) { glFilter = f; glCanvas.style.filter = f; }
  } else if (glFilter) { glFilter = ''; glCanvas.style.filter = ''; }
  ending.style.setProperty('--ending', smooth(.86, .92, p).toFixed(3)); updateStars(p); SND.update(p, scrollY < stage.offsetTop + stage.offsetHeight);
  gateway.style.pointerEvents = p < .2 ? 'auto' : 'none';
  mist.style.setProperty('--mist', (.45 + smooth(.88, .97, p) * .5).toFixed(3));

  if (ready) {
    // light per stop
    const u = uni.uProg.value;
    u[0] = smooth(.24, .31, p);
    for (let i = 1; i < 7; i++) u[i] = smooth(STOP_P[i - 1] + .02, STOP_P[i] + .03, p);
    uni.uAll.value = smooth(.86, .95, p);
    uni.uOpen.value = clamp(smooth(.40, .50, p) - smooth(.86, .95, p));
    uni.uTime.value = reduced ? 1 : t;
    halos.forEach((h, i) => { h.material.opacity = (u[i] * (1 - smooth(STOP_P[i] + .04, STOP_P[i] + .09, p) * .6) * (i === 0 ? .35 : .85)) + (i === 6 ? uni.uAll.value * .5 : 0); });
    ground.material.opacity = .45 + u[0] * .12 + uni.uAll.value * .3;
    if (p > .16 && (frameN % 2 === 0 || Math.abs(p - lastRenderP) > 1e-5)) {
      lastRenderP = p; placeCamera(p); renderer.render(scene3, camera);
      if (!glowOff && frameN % 2 === 0) { const g0 = performance.now(); gctx.clearRect(0, 0, glowCanvas.width, glowCanvas.height); gctx.drawImage(glCanvas, 0, 0, glowCanvas.width, glowCanvas.height); glowCost += (performance.now() - g0 - glowCost) * .1; if (++glowN > 40 && glowCost > 4) { glowOff = true; glowCanvas.style.display = 'none'; } }
    }
  }

  cards.forEach((el, k) => {
    const [a, b] = WIN[k], en = smooth(a, a + .03, p), dep = 1 - smooth(b - .03, b, p), o = en * dep;
    el.style.opacity = o.toFixed(3);
    const dy = ((1 - en) * 17) - ((1 - dep) * 12);
    el.style.transform = narrow ? `translate3d(0,${dy.toFixed(1)}px,0)` : `translate3d(0,${dy.toFixed(1)}px,0) translateY(-50%)`;
  });

  // butterfly (SVG overlay, positioned from the 3D route)
  const pr = lastPR, pcx = pr.left + pr.width / 2, pcy = pr.top + pr.height * .45;
  const orb = [pcx + Math.cos(t * .6) * pr.width * .45 + (mx - .5) * 80, pcy + Math.sin(t * .9) * pr.height * .12 + (my - .5) * 50];
  let pos, scale = 1, bwv = null, fxmode = 'screen';
  const wsc = v => { const s = toScreen(v); const d = camera.position.distanceTo(v); return { s, k: clamp(7.4 / d, .32, 1.7) }; };
  if (p < .2) {
    const e = smooth(.10, .19, p);
    const tx = orb[0] * (1 - e) + pcx * e, ty = orb[1] * (1 - e) + pcy * e;
    if (bx === null) { bx = pcx; by = pcy; }
    bx += (tx - bx) * .06; by += (ty - by) * .06; pos = [bx, by]; scale = 1 - .55 * e; portalC = [bx, by];
  } else {
    placeCamera(p); camera.updateMatrixWorld();
    const bw = butterflyWorld(p), w = wsc(bw); bwv = bw; fxmode = p < STOP_P[0] - .02 ? 'screen' : 'world';
    if (p < STOP_P[0] - .02) { const s = smooth(.21, STOP_P[0] - .02, p); pos = [lerp(portalC[0], w.s[0], s), lerp(portalC[1], w.s[1], s)]; scale = lerp(.45, w.k, s); }
    else { pos = [w.s[0], w.s[1]]; scale = w.k; }
    pos = [pos[0] + Math.sin(t * 1.3) * 4, pos[1] + Math.cos(t * 1.1) * 3];
  }
  const emS = (t < 3 && !reduced) ? .25 + .75 * smooth(.2, 2.6, t) : 1; guide.style.opacity = (((t < 3.1 && !reduced) ? smooth(.1, 1.4, t) : 1) * (narrow ? 1 - .45 * fol : 1)).toFixed(3);
  lastTree = [pos[0], pos[1], scale * emS];
  const cpos = companionStep(dtS, pos, p > .975 ? 1 : 0, true), cs = lerp(scale * emS, .6, fol);
  placeGuide(cpos, cs); pos = cpos; scale = cs;

  drawFx2(p, pos, scale, fxmode, bwv, dtS);
  fx.clearRect(0, 0, FW, FH);
  const wo = smooth(.2, .3, p);
  if (wo > .01 && !reduced) {
    fx.globalCompositeOperation = 'lighter';
    for (const q of petals) {
      q.y += q.v * 16; q.ph += .01; if (q.y > 1.05) { q.y = -.05; q.x = Math.random(); }
      const x = (q.x + Math.sin(q.ph) * .02) * FW, y = q.y * FH;
      fx.fillStyle = hsla(q.h.toFixed(0), 60, 62, .22 * wo);
      fx.save(); fx.translate(x, y); fx.rotate(q.ph * 2); fx.beginPath(); fx.ellipse(0, 0, q.sz, q.sz * .45, 0, 0, TAU); fx.fill(); fx.restore();
    }
    fx.globalCompositeOperation = 'source-over';
  }
  raf = requestAnimationFrame(loop);
}
document.getElementById('replay').addEventListener('click', e => { e.preventDefault(); scrollTo({ top: 0, behavior: 'auto' }); });
// Warm-up: compile shaders / upload geometry while the world is still invisible, so entering the portal never hitches.
warmT = setTimeout(() => {
  if (stopped) return;
  const warm = () => { if (stopped) return; try { placeCamera(.3); renderer.render(scene3, camera); } catch (err) {} };
  if (renderer.compileAsync) renderer.compileAsync(scene3, camera).then(warm, warm); else { try { renderer.compile(scene3, camera); } catch (err) {} warm(); }
}, 450);
let ready = false;
ready = true; window.__ready = true; window.__stats = { nodes: nodes.length, leaves: LN, inner: innerCount };
raf = requestAnimationFrame(loop);


  return () => {
    stopped = true; guide.remove(); delete root.dataset.journey; cancelAnimationFrame(raf); clearTimeout(warmT); offs.forEach(f => f());
    SND.dispose();
    try { renderer.dispose(); renderer.forceContextLoss(); } catch (err) {}
    window.__ready = false;
  };
}

import{e as at,i as T,a as A,n as l,t as ne,b as nt,c as lt,d as re,E as ce,r as y,f as R,g as c,A as p,D as Pt,h as mi,p as vi,w as M}from"./index-CcMIDHTB.js";import{Transport as zt,HardReset as gi,ESPLoader as bi}from"./index-CJ_l-qHG.js";/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let yi;function xi(r){return(e,t)=>at(e,t,{get(){return(this.renderRoot??yi??(yi=document.createDocumentFragment())).querySelectorAll(r)}})}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ee(r){return(e,t)=>{const{slot:i,selector:o}=r??{},s="slot"+(i?`[name=${i}]`:":not([name])");return at(e,t,{get(){var h;const n=(h=this.renderRoot)==null?void 0:h.querySelector(s),d=(n==null?void 0:n.assignedElements(r))??[];return o===void 0?d:d.filter(f=>f.matches(o))}})}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function _i(r){return(e,t)=>{const{slot:i}=r??{},o="slot"+(i?`[name=${i}]`:":not([name])");return at(e,t,{get(){var n;const s=(n=this.renderRoot)==null?void 0:n.querySelector(o);return(s==null?void 0:s.assignedNodes(r))??[]}})}}function a(r,e,t,i){var o=arguments.length,s=o<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,t):i,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(r,e,t,i);else for(var d=r.length-1;d>=0;d--)(n=r[d])&&(s=(o<3?n(s):o>3?n(e,t,s):n(e,t))||s);return o>3&&s&&Object.defineProperty(e,t,s),s}/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const wi=T`:host{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end);box-sizing:border-box;cursor:pointer;display:inline-flex;gap:8px;min-height:var(--_container-height);outline:none;padding-block:calc((var(--_container-height) - max(var(--_label-text-line-height),var(--_icon-size)))/2);padding-inline-start:var(--_leading-space);padding-inline-end:var(--_trailing-space);place-content:center;place-items:center;position:relative;font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);text-overflow:ellipsis;text-wrap:nowrap;user-select:none;-webkit-tap-highlight-color:rgba(0,0,0,0);vertical-align:top;--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}:host(:is([disabled],[soft-disabled])){cursor:default;pointer-events:none}.button{border-radius:inherit;cursor:inherit;display:inline-flex;align-items:center;justify-content:center;border:none;outline:none;-webkit-appearance:none;vertical-align:middle;background:rgba(0,0,0,0);text-decoration:none;min-width:calc(64px - var(--_leading-space) - var(--_trailing-space));width:100%;z-index:0;height:100%;font:inherit;color:var(--_label-text-color);padding:0;gap:inherit;text-transform:inherit}.button::-moz-focus-inner{padding:0;border:0}:host(:hover) .button{color:var(--_hover-label-text-color)}:host(:focus-within) .button{color:var(--_focus-label-text-color)}:host(:active) .button{color:var(--_pressed-label-text-color)}.background{background:var(--_container-color);border-radius:inherit;inset:0;position:absolute}.label{overflow:hidden}:is(.button,.label,.label slot),.label ::slotted(*){text-overflow:inherit}:host(:is([disabled],[soft-disabled])) .label{color:var(--_disabled-label-text-color);opacity:var(--_disabled-label-text-opacity)}:host(:is([disabled],[soft-disabled])) .background{background:var(--_disabled-container-color);opacity:var(--_disabled-container-opacity)}@media(forced-colors: active){.background{border:1px solid CanvasText}:host(:is([disabled],[soft-disabled])){--_disabled-icon-color: GrayText;--_disabled-icon-opacity: 1;--_disabled-container-opacity: 1;--_disabled-label-text-color: GrayText;--_disabled-label-text-opacity: 1}}:host([has-icon]:not([trailing-icon])){padding-inline-start:var(--_with-leading-icon-leading-space);padding-inline-end:var(--_with-leading-icon-trailing-space)}:host([has-icon][trailing-icon]){padding-inline-start:var(--_with-trailing-icon-leading-space);padding-inline-end:var(--_with-trailing-icon-trailing-space)}::slotted([slot=icon]){display:inline-flex;position:relative;writing-mode:horizontal-tb;fill:currentColor;flex-shrink:0;color:var(--_icon-color);font-size:var(--_icon-size);inline-size:var(--_icon-size);block-size:var(--_icon-size)}:host(:hover) ::slotted([slot=icon]){color:var(--_hover-icon-color)}:host(:focus-within) ::slotted([slot=icon]){color:var(--_focus-icon-color)}:host(:active) ::slotted([slot=icon]){color:var(--_pressed-icon-color)}:host(:is([disabled],[soft-disabled])) ::slotted([slot=icon]){color:var(--_disabled-icon-color);opacity:var(--_disabled-icon-opacity)}.touch{position:absolute;top:50%;height:48px;left:0;right:0;transform:translateY(-50%)}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_container-height))/2) 0}:host([touch-target=none]) .touch{display:none}
`;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ft=Symbol("attachableController");let Oe;Oe=new MutationObserver(r=>{var e;for(const t of r)(e=t.target[Ft])==null||e.hostConnected()});class Nt{get htmlFor(){return this.host.getAttribute("for")}set htmlFor(e){e===null?this.host.removeAttribute("for"):this.host.setAttribute("for",e)}get control(){return this.host.hasAttribute("for")?!this.htmlFor||!this.host.isConnected?null:this.host.getRootNode().querySelector(`#${this.htmlFor}`):this.currentControl||this.host.parentElement}set control(e){e?this.attach(e):this.detach()}constructor(e,t){this.host=e,this.onControlChange=t,this.currentControl=null,e.addController(this),e[Ft]=this,Oe==null||Oe.observe(e,{attributeFilter:["for"]})}attach(e){e!==this.currentControl&&(this.setCurrentControl(e),this.host.removeAttribute("for"))}detach(){this.setCurrentControl(null),this.host.setAttribute("for","")}hostConnected(){this.setCurrentControl(this.control)}hostDisconnected(){this.setCurrentControl(null)}setCurrentControl(e){this.onControlChange(this.currentControl,e),this.currentControl=e}}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ci=["focusin","focusout","pointerdown"];class dt extends A{constructor(){super(...arguments),this.visible=!1,this.inward=!1,this.attachableController=new Nt(this,this.onControlChange.bind(this))}get htmlFor(){return this.attachableController.htmlFor}set htmlFor(e){this.attachableController.htmlFor=e}get control(){return this.attachableController.control}set control(e){this.attachableController.control=e}attach(e){this.attachableController.attach(e)}detach(){this.attachableController.detach()}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-hidden","true")}handleEvent(e){var t;if(!e[gt]){switch(e.type){default:return;case"focusin":this.visible=((t=this.control)==null?void 0:t.matches(":focus-visible"))??!1;break;case"focusout":case"pointerdown":this.visible=!1;break}e[gt]=!0}}onControlChange(e,t){for(const i of Ci)e==null||e.removeEventListener(i,this),t==null||t.addEventListener(i,this)}update(e){e.has("visible")&&this.dispatchEvent(new Event("visibility-changed")),super.update(e)}}a([l({type:Boolean,reflect:!0})],dt.prototype,"visible",void 0);a([l({type:Boolean,reflect:!0})],dt.prototype,"inward",void 0);const gt=Symbol("handledByFocusRing");/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ei=T`:host{animation-delay:0s,calc(var(--md-focus-ring-duration, 600ms)*.25);animation-duration:calc(var(--md-focus-ring-duration, 600ms)*.25),calc(var(--md-focus-ring-duration, 600ms)*.75);animation-timing-function:cubic-bezier(0.2, 0, 0, 1);box-sizing:border-box;color:var(--md-focus-ring-color, var(--md-sys-color-secondary, #625b71));display:none;pointer-events:none;position:absolute}:host([visible]){display:flex}:host(:not([inward])){animation-name:outward-grow,outward-shrink;border-end-end-radius:calc(var(--md-focus-ring-shape-end-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-end-start-radius:calc(var(--md-focus-ring-shape-end-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-start-end-radius:calc(var(--md-focus-ring-shape-start-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-start-start-radius:calc(var(--md-focus-ring-shape-start-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));inset:calc(-1*var(--md-focus-ring-outward-offset, 2px));outline:var(--md-focus-ring-width, 3px) solid currentColor}:host([inward]){animation-name:inward-grow,inward-shrink;border-end-end-radius:calc(var(--md-focus-ring-shape-end-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-end-start-radius:calc(var(--md-focus-ring-shape-end-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-start-end-radius:calc(var(--md-focus-ring-shape-start-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-start-start-radius:calc(var(--md-focus-ring-shape-start-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border:var(--md-focus-ring-width, 3px) solid currentColor;inset:var(--md-focus-ring-inward-offset, 0px)}@keyframes outward-grow{from{outline-width:0}to{outline-width:var(--md-focus-ring-active-width, 8px)}}@keyframes outward-shrink{from{outline-width:var(--md-focus-ring-active-width, 8px)}}@keyframes inward-grow{from{border-width:0}to{border-width:var(--md-focus-ring-active-width, 8px)}}@keyframes inward-shrink{from{border-width:var(--md-focus-ring-active-width, 8px)}}@media(prefers-reduced-motion){:host{animation:none}}
`;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Ge=class extends dt{};Ge.styles=[Ei];Ge=a([ne("md-focus-ring")],Ge);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const U=nt(class extends lt{constructor(r){var e;if(super(r),r.type!==re.ATTRIBUTE||r.name!=="class"||((e=r.strings)==null?void 0:e.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(r){return" "+Object.keys(r).filter(e=>r[e]).join(" ")+" "}update(r,[e]){var i,o;if(this.st===void 0){this.st=new Set,r.strings!==void 0&&(this.nt=new Set(r.strings.join(" ").split(/\s/).filter(s=>s!=="")));for(const s in e)e[s]&&!((i=this.nt)!=null&&i.has(s))&&this.st.add(s);return this.render(e)}const t=r.element.classList;for(const s of this.st)s in e||(t.remove(s),this.st.delete(s));for(const s in e){const n=!!e[s];n===this.st.has(s)||(o=this.nt)!=null&&o.has(s)||(n?(t.add(s),this.st.add(s)):(t.remove(s),this.st.delete(s)))}return ce}});/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const j={STANDARD:"cubic-bezier(0.2, 0, 0, 1)",EMPHASIZED:"cubic-bezier(.3,0,0,1)",EMPHASIZED_ACCELERATE:"cubic-bezier(.3,0,.8,.15)"};function ki(){let r=null;return{start(){return r==null||r.abort(),r=new AbortController,r.signal},finish(){r=null}}}/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ii=450,bt=225,Ti=.2,Si=10,Ai=75,Ri=.35,$i="::after",Oi="forwards";var F;(function(r){r[r.INACTIVE=0]="INACTIVE",r[r.TOUCH_DELAY=1]="TOUCH_DELAY",r[r.HOLDING=2]="HOLDING",r[r.WAITING_FOR_CLICK=3]="WAITING_FOR_CLICK"})(F||(F={}));const Li=["click","contextmenu","pointercancel","pointerdown","pointerenter","pointerleave","pointerup"],Di=150,qe=window.matchMedia("(forced-colors: active)");class ye extends A{constructor(){super(...arguments),this.disabled=!1,this.hovered=!1,this.pressed=!1,this.rippleSize="",this.rippleScale="",this.initialSize=0,this.state=F.INACTIVE,this.attachableController=new Nt(this,this.onControlChange.bind(this))}get htmlFor(){return this.attachableController.htmlFor}set htmlFor(e){this.attachableController.htmlFor=e}get control(){return this.attachableController.control}set control(e){this.attachableController.control=e}attach(e){this.attachableController.attach(e)}detach(){this.attachableController.detach()}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-hidden","true")}render(){const e={hovered:this.hovered,pressed:this.pressed};return c`<div class="surface ${U(e)}"></div>`}update(e){e.has("disabled")&&this.disabled&&(this.hovered=!1,this.pressed=!1),super.update(e)}handlePointerenter(e){this.shouldReactToEvent(e)&&(this.hovered=!0)}handlePointerleave(e){this.shouldReactToEvent(e)&&(this.hovered=!1,this.state!==F.INACTIVE&&this.endPressAnimation())}handlePointerup(e){if(this.shouldReactToEvent(e)){if(this.state===F.HOLDING){this.state=F.WAITING_FOR_CLICK;return}if(this.state===F.TOUCH_DELAY){this.state=F.WAITING_FOR_CLICK,this.startPressAnimation(this.rippleStartEvent);return}}}async handlePointerdown(e){if(this.shouldReactToEvent(e)){if(this.rippleStartEvent=e,!this.isTouch(e)){this.state=F.WAITING_FOR_CLICK,this.startPressAnimation(e);return}this.state=F.TOUCH_DELAY,await new Promise(t=>{setTimeout(t,Di)}),this.state===F.TOUCH_DELAY&&(this.state=F.HOLDING,this.startPressAnimation(e))}}handleClick(){if(!this.disabled){if(this.state===F.WAITING_FOR_CLICK){this.endPressAnimation();return}this.state===F.INACTIVE&&(this.startPressAnimation(),this.endPressAnimation())}}handlePointercancel(e){this.shouldReactToEvent(e)&&this.endPressAnimation()}handleContextmenu(){this.disabled||this.endPressAnimation()}determineRippleSize(){const{height:e,width:t}=this.getBoundingClientRect(),i=Math.max(e,t),o=Math.max(Ri*i,Ai),s=this.currentCSSZoom??1,n=Math.floor(i*Ti/s),h=Math.sqrt(t**2+e**2)+Si;this.initialSize=n;const f=(h+o)/n;this.rippleScale=`${f/s}`,this.rippleSize=`${n}px`}getNormalizedPointerEventCoords(e){const{scrollX:t,scrollY:i}=window,{left:o,top:s}=this.getBoundingClientRect(),n=t+o,d=i+s,{pageX:h,pageY:f}=e,v=this.currentCSSZoom??1;return{x:(h-n)/v,y:(f-d)/v}}getTranslationCoordinates(e){const{height:t,width:i}=this.getBoundingClientRect(),o=this.currentCSSZoom??1,s={x:(i/o-this.initialSize)/2,y:(t/o-this.initialSize)/2};let n;return e instanceof PointerEvent?n=this.getNormalizedPointerEventCoords(e):n={x:i/o/2,y:t/o/2},n={x:n.x-this.initialSize/2,y:n.y-this.initialSize/2},{startPoint:n,endPoint:s}}startPressAnimation(e){var n;if(!this.mdRoot)return;this.pressed=!0,(n=this.growAnimation)==null||n.cancel(),this.determineRippleSize();const{startPoint:t,endPoint:i}=this.getTranslationCoordinates(e),o=`${t.x}px, ${t.y}px`,s=`${i.x}px, ${i.y}px`;this.growAnimation=this.mdRoot.animate({top:[0,0],left:[0,0],height:[this.rippleSize,this.rippleSize],width:[this.rippleSize,this.rippleSize],transform:[`translate(${o}) scale(1)`,`translate(${s}) scale(${this.rippleScale})`]},{pseudoElement:$i,duration:Ii,easing:j.STANDARD,fill:Oi})}async endPressAnimation(){this.rippleStartEvent=void 0,this.state=F.INACTIVE;const e=this.growAnimation;let t=1/0;if(typeof(e==null?void 0:e.currentTime)=="number"?t=e.currentTime:e!=null&&e.currentTime&&(t=e.currentTime.to("ms").value),t>=bt){this.pressed=!1;return}await new Promise(i=>{setTimeout(i,bt-t)}),this.growAnimation===e&&(this.pressed=!1)}shouldReactToEvent(e){if(this.disabled||!e.isPrimary||this.rippleStartEvent&&this.rippleStartEvent.pointerId!==e.pointerId)return!1;if(e.type==="pointerenter"||e.type==="pointerleave")return!this.isTouch(e);const t=e.buttons===1;return this.isTouch(e)||t}isTouch({pointerType:e}){return e==="touch"}async handleEvent(e){if(!(qe!=null&&qe.matches))switch(e.type){case"click":this.handleClick();break;case"contextmenu":this.handleContextmenu();break;case"pointercancel":this.handlePointercancel(e);break;case"pointerdown":await this.handlePointerdown(e);break;case"pointerenter":this.handlePointerenter(e);break;case"pointerleave":this.handlePointerleave(e);break;case"pointerup":this.handlePointerup(e);break}}onControlChange(e,t){for(const i of Li)e==null||e.removeEventListener(i,this),t==null||t.addEventListener(i,this)}}a([l({type:Boolean,reflect:!0})],ye.prototype,"disabled",void 0);a([y()],ye.prototype,"hovered",void 0);a([y()],ye.prototype,"pressed",void 0);a([R(".surface")],ye.prototype,"mdRoot",void 0);/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Pi=T`:host{display:flex;margin:auto;pointer-events:none}:host([disabled]){display:none}@media(forced-colors: active){:host{display:none}}:host,.surface{border-radius:inherit;position:absolute;inset:0;overflow:hidden}.surface{-webkit-tap-highlight-color:rgba(0,0,0,0)}.surface::before,.surface::after{content:"";opacity:0;position:absolute}.surface::before{background-color:var(--md-ripple-hover-color, var(--md-sys-color-on-surface, #1d1b20));inset:0;transition:opacity 15ms linear,background-color 15ms linear}.surface::after{background:radial-gradient(closest-side, var(--md-ripple-pressed-color, var(--md-sys-color-on-surface, #1d1b20)) max(100% - 70px, 65%), transparent 100%);transform-origin:center center;transition:opacity 375ms linear}.hovered::before{background-color:var(--md-ripple-hover-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-ripple-hover-opacity, 0.08)}.pressed::after{opacity:var(--md-ripple-pressed-opacity, 0.12);transition-duration:105ms}
`;/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Ye=class extends ye{};Ye.styles=[Pi];Ye=a([ne("md-ripple")],Ye);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Bt=["role","ariaAtomic","ariaAutoComplete","ariaBusy","ariaChecked","ariaColCount","ariaColIndex","ariaColSpan","ariaCurrent","ariaDisabled","ariaExpanded","ariaHasPopup","ariaHidden","ariaInvalid","ariaKeyShortcuts","ariaLabel","ariaLevel","ariaLive","ariaModal","ariaMultiLine","ariaMultiSelectable","ariaOrientation","ariaPlaceholder","ariaPosInSet","ariaPressed","ariaReadOnly","ariaRequired","ariaRoleDescription","ariaRowCount","ariaRowIndex","ariaRowSpan","ariaSelected","ariaSetSize","ariaSort","ariaValueMax","ariaValueMin","ariaValueNow","ariaValueText"],zi=Bt.map(Mt);function Ue(r){return zi.includes(r)}function Mt(r){return r.replace("aria","aria-").replace(/Elements?/g,"").toLowerCase()}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const ke=Symbol("privateIgnoreAttributeChangesFor");function te(r){var e;class t extends r{constructor(){super(...arguments),this[e]=new Set}attributeChangedCallback(o,s,n){if(!Ue(o)){super.attributeChangedCallback(o,s,n);return}if(this[ke].has(o))return;this[ke].add(o),this.removeAttribute(o),this[ke].delete(o);const d=je(o);n===null?delete this.dataset[d]:this.dataset[d]=n,this.requestUpdate(je(o),s)}getAttribute(o){return Ue(o)?super.getAttribute(Ze(o)):super.getAttribute(o)}removeAttribute(o){super.removeAttribute(o),Ue(o)&&(super.removeAttribute(Ze(o)),this.requestUpdate())}}return e=ke,Fi(t),t}function Fi(r){for(const e of Bt){const t=Mt(e),i=Ze(t),o=je(t);r.createProperty(e,{attribute:t,noAccessor:!0}),r.createProperty(Symbol(i),{attribute:i,noAccessor:!0}),Object.defineProperty(r.prototype,e,{configurable:!0,enumerable:!0,get(){return this.dataset[o]??null},set(s){const n=this.dataset[o]??null;s!==n&&(s===null?delete this.dataset[o]:this.dataset[o]=s,this.requestUpdate(e,n))}})}}function Ze(r){return`data-${r}`}function je(r){return r.replace(/-\w/,e=>e[1].toUpperCase())}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const N=Symbol("internals"),Ve=Symbol("privateInternals");function xe(r){class e extends r{get[N](){return this[Ve]||(this[Ve]=this.attachInternals()),this[Ve]}}return e}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function qt(r){r.addInitializer(e=>{const t=e;t.addEventListener("click",async i=>{const{type:o,[N]:s}=t,{form:n}=s;if(!(!n||o==="button")&&(await new Promise(d=>{setTimeout(d)}),!i.defaultPrevented)){if(o==="reset"){n.reset();return}n.addEventListener("submit",d=>{Object.defineProperty(d,"submitter",{configurable:!0,enumerable:!0,get:()=>t})},{capture:!0,once:!0}),s.setFormValue(t.value),n.requestSubmit()}})})}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function Ut(r){const e=new MouseEvent("click",{bubbles:!0});return r.dispatchEvent(e),e}function Vt(r){return r.currentTarget!==r.target||r.composedPath()[0]!==r.target||r.target.disabled?!1:!Ni(r)}function Ni(r){const e=Xe;return e&&(r.preventDefault(),r.stopImmediatePropagation()),Bi(),e}let Xe=!1;async function Bi(){Xe=!0,await null,Xe=!1}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Mi=te(xe(A));class B extends Mi{get name(){return this.getAttribute("name")??""}set name(e){this.setAttribute("name",e)}get form(){return this[N].form}constructor(){super(),this.disabled=!1,this.softDisabled=!1,this.href="",this.download="",this.target="",this.trailingIcon=!1,this.hasIcon=!1,this.type="submit",this.value="",this.addEventListener("click",this.handleClick.bind(this))}focus(){var e;(e=this.buttonElement)==null||e.focus()}blur(){var e;(e=this.buttonElement)==null||e.blur()}render(){var o;const e=this.disabled||this.softDisabled,t=this.href?this.renderLink():this.renderButton(),i=this.href?"link":"button";return c`
      ${(o=this.renderElevationOrOutline)==null?void 0:o.call(this)}
      <div class="background"></div>
      <md-focus-ring part="focus-ring" for=${i}></md-focus-ring>
      <md-ripple
        part="ripple"
        for=${i}
        ?disabled="${e}"></md-ripple>
      ${t}
    `}renderButton(){const{ariaLabel:e,ariaHasPopup:t,ariaExpanded:i}=this;return c`<button
      id="button"
      class="button"
      ?disabled=${this.disabled}
      aria-disabled=${this.softDisabled||p}
      aria-label="${e||p}"
      aria-haspopup="${t||p}"
      aria-expanded="${i||p}">
      ${this.renderContent()}
    </button>`}renderLink(){const{ariaLabel:e,ariaHasPopup:t,ariaExpanded:i}=this;return c`<a
      id="link"
      class="button"
      aria-label="${e||p}"
      aria-haspopup="${t||p}"
      aria-expanded="${i||p}"
      aria-disabled=${this.disabled||this.softDisabled||p}
      tabindex="${this.disabled&&!this.softDisabled?-1:p}"
      href=${this.href}
      download=${this.download||p}
      target=${this.target||p}
      >${this.renderContent()}
    </a>`}renderContent(){const e=c`<slot
      name="icon"
      @slotchange="${this.handleSlotChange}"></slot>`;return c`
      <span class="touch"></span>
      ${this.trailingIcon?p:e}
      <span class="label"><slot></slot></span>
      ${this.trailingIcon?e:p}
    `}handleClick(e){if(this.softDisabled||this.disabled&&this.href){e.stopImmediatePropagation(),e.preventDefault();return}!Vt(e)||!this.buttonElement||(this.focus(),Ut(this.buttonElement))}handleSlotChange(){this.hasIcon=this.assignedIcons.length>0}}qt(B);B.formAssociated=!0;B.shadowRootOptions={mode:"open",delegatesFocus:!0};a([l({type:Boolean,reflect:!0})],B.prototype,"disabled",void 0);a([l({type:Boolean,attribute:"soft-disabled",reflect:!0})],B.prototype,"softDisabled",void 0);a([l()],B.prototype,"href",void 0);a([l()],B.prototype,"download",void 0);a([l()],B.prototype,"target",void 0);a([l({type:Boolean,attribute:"trailing-icon",reflect:!0})],B.prototype,"trailingIcon",void 0);a([l({type:Boolean,attribute:"has-icon",reflect:!0})],B.prototype,"hasIcon",void 0);a([l()],B.prototype,"type",void 0);a([l({reflect:!0})],B.prototype,"value",void 0);a([R(".button")],B.prototype,"buttonElement",void 0);a([ee({slot:"icon",flatten:!0})],B.prototype,"assignedIcons",void 0);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class qi extends B{}/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ui=T`:host{--_container-height: var(--md-text-button-container-height, 40px);--_disabled-label-text-color: var(--md-text-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-text-button-disabled-label-text-opacity, 0.38);--_focus-label-text-color: var(--md-text-button-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-label-text-color: var(--md-text-button-hover-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-color: var(--md-text-button-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-opacity: var(--md-text-button-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-text-button-label-text-color, var(--md-sys-color-primary, #6750a4));--_label-text-font: var(--md-text-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-text-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-text-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-text-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_pressed-label-text-color: var(--md-text-button-pressed-label-text-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-color: var(--md-text-button-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity: var(--md-text-button-pressed-state-layer-opacity, 0.12);--_disabled-icon-color: var(--md-text-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-text-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-text-button-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-icon-color: var(--md-text-button-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-color: var(--md-text-button-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-size: var(--md-text-button-icon-size, 18px);--_pressed-icon-color: var(--md-text-button-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_container-shape-start-start: var(--md-text-button-container-shape-start-start, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-text-button-container-shape-start-end, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-text-button-container-shape-end-end, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-text-button-container-shape-end-start, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_leading-space: var(--md-text-button-leading-space, 12px);--_trailing-space: var(--md-text-button-trailing-space, 12px);--_with-leading-icon-leading-space: var(--md-text-button-with-leading-icon-leading-space, 12px);--_with-leading-icon-trailing-space: var(--md-text-button-with-leading-icon-trailing-space, 16px);--_with-trailing-icon-leading-space: var(--md-text-button-with-trailing-icon-leading-space, 16px);--_with-trailing-icon-trailing-space: var(--md-text-button-with-trailing-icon-trailing-space, 12px);--_container-color: none;--_disabled-container-color: none;--_disabled-container-opacity: 0}
`;class Ht extends qi{}Ht.styles=[wi,Ui];customElements.define("ew-text-button",Ht);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function Wt(r,e=ie){const t=ct(r,e);return t&&(t.tabIndex=0,t.focus()),t}function Kt(r,e=ie){const t=Gt(r,e);return t&&(t.tabIndex=0,t.focus()),t}function ve(r,e=ie){for(let t=0;t<r.length;t++){const i=r[t];if(i.tabIndex===0&&e(i))return{item:i,index:t}}return null}function ct(r,e=ie){for(const t of r)if(e(t))return t;return null}function Gt(r,e=ie){for(let t=r.length-1;t>=0;t--){const i=r[t];if(e(i))return i}return null}function Vi(r,e,t=ie,i=!0){for(let o=1;o<r.length;o++){const s=(o+e)%r.length;if(s<e&&!i)return null;const n=r[s];if(t(n))return n}return r[e]?r[e]:null}function Hi(r,e,t=ie,i=!0){for(let o=1;o<r.length;o++){const s=(e-o+r.length)%r.length;if(s>e&&!i)return null;const n=r[s];if(t(n))return n}return r[e]?r[e]:null}function yt(r,e,t=ie,i=!0){if(e){const o=Vi(r,e.index,t,i);return o&&(o.tabIndex=0,o.focus()),o}else return Wt(r,t)}function xt(r,e,t=ie,i=!0){if(e){const o=Hi(r,e.index,t,i);return o&&(o.tabIndex=0,o.focus()),o}else return Kt(r,t)}function Wi(){return new Event("request-activation",{bubbles:!0,composed:!0})}function ie(r){return!r.disabled}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const P={ArrowDown:"ArrowDown",ArrowLeft:"ArrowLeft",ArrowUp:"ArrowUp",ArrowRight:"ArrowRight",Home:"Home",End:"End"};class Yt{constructor(e){this.handleKeydown=v=>{const m=v.key;if(v.defaultPrevented||!this.isNavigableKey(m))return;const w=this.items;if(!w.length)return;const g=ve(w,this.isActivatable);v.preventDefault();const $=this.isRtl(),x=$?P.ArrowRight:P.ArrowLeft,_=$?P.ArrowLeft:P.ArrowRight;let k=null;switch(m){case P.ArrowDown:case _:k=yt(w,g,this.isActivatable,this.wrapNavigation());break;case P.ArrowUp:case x:k=xt(w,g,this.isActivatable,this.wrapNavigation());break;case P.Home:k=Wt(w,this.isActivatable);break;case P.End:k=Kt(w,this.isActivatable);break}k&&g&&g.item!==k&&(g.item.tabIndex=-1)},this.onDeactivateItems=()=>{const v=this.items;for(const m of v)this.deactivateItem(m)},this.onRequestActivation=v=>{this.onDeactivateItems();const m=v.target;this.activateItem(m),m.focus()},this.onSlotchange=()=>{const v=this.items;let m=!1;for(const g of v){if(!g.disabled&&g.tabIndex>-1&&!m){m=!0,g.tabIndex=0;continue}g.tabIndex=-1}if(m)return;const w=ct(v,this.isActivatable);w&&(w.tabIndex=0)};const{isItem:t,getPossibleItems:i,isRtl:o,deactivateItem:s,activateItem:n,isNavigableKey:d,isActivatable:h,wrapNavigation:f}=e;this.isItem=t,this.getPossibleItems=i,this.isRtl=o,this.deactivateItem=s,this.activateItem=n,this.isNavigableKey=d,this.isActivatable=h,this.wrapNavigation=f??(()=>!0)}get items(){const e=this.getPossibleItems(),t=[];for(const i of e){if(this.isItem(i)){t.push(i);continue}const s=i.item;s&&this.isItem(s)&&t.push(s)}return t}activateNextItem(){const e=this.items,t=ve(e,this.isActivatable);return t&&(t.item.tabIndex=-1),yt(e,t,this.isActivatable,this.wrapNavigation())}activatePreviousItem(){const e=this.items,t=ve(e,this.isActivatable);return t&&(t.item.tabIndex=-1),xt(e,t,this.isActivatable,this.wrapNavigation())}}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ki=new Set(Object.values(P));class Zt extends A{get items(){return this.listController.items}constructor(){super(),this.listController=new Yt({isItem:e=>e.hasAttribute("md-list-item"),getPossibleItems:()=>this.slotItems,isRtl:()=>getComputedStyle(this).direction==="rtl",deactivateItem:e=>{e.tabIndex=-1},activateItem:e=>{e.tabIndex=0},isNavigableKey:e=>Ki.has(e),isActivatable:e=>!e.disabled&&e.type!=="text"}),this.internals=this.attachInternals(),this.internals.role="list",this.addEventListener("keydown",this.listController.handleKeydown)}render(){return c`
      <slot
        @deactivate-items=${this.listController.onDeactivateItems}
        @request-activation=${this.listController.onRequestActivation}
        @slotchange=${this.listController.onSlotchange}>
      </slot>
    `}activateNextItem(){return this.listController.activateNextItem()}activatePreviousItem(){return this.listController.activatePreviousItem()}}a([ee({flatten:!0})],Zt.prototype,"slotItems",void 0);/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Gi=T`:host{background:var(--md-list-container-color, var(--md-sys-color-surface, #fef7ff));color:unset;display:flex;flex-direction:column;outline:none;padding:8px 0;position:relative}
`;class jt extends Zt{}jt.styles=[Gi];customElements.define("ew-list",jt);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class ht extends A{constructor(){super(...arguments),this.multiline=!1}render(){return c`
      <slot name="container"></slot>
      <slot class="non-text" name="start"></slot>
      <div class="text">
        <slot name="overline" @slotchange=${this.handleTextSlotChange}></slot>
        <slot
          class="default-slot"
          @slotchange=${this.handleTextSlotChange}></slot>
        <slot name="headline" @slotchange=${this.handleTextSlotChange}></slot>
        <slot
          name="supporting-text"
          @slotchange=${this.handleTextSlotChange}></slot>
      </div>
      <slot class="non-text" name="trailing-supporting-text"></slot>
      <slot class="non-text" name="end"></slot>
    `}handleTextSlotChange(){let e=!1,t=0;for(const i of this.textSlots)if(Yi(i)&&(t+=1),t>1){e=!0;break}this.multiline=e}}a([l({type:Boolean,reflect:!0})],ht.prototype,"multiline",void 0);a([xi(".text slot")],ht.prototype,"textSlots",void 0);function Yi(r){var e;for(const t of r.assignedNodes({flatten:!0})){const i=t.nodeType===Node.ELEMENT_NODE,o=t.nodeType===Node.TEXT_NODE&&((e=t.textContent)==null?void 0:e.match(/\S/));if(i||o)return!0}return!1}/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Zi=T`:host{color:var(--md-sys-color-on-surface, #1d1b20);font-family:var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-body-large-size, 1rem);font-weight:var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400));line-height:var(--md-sys-typescale-body-large-line-height, 1.5rem);align-items:center;box-sizing:border-box;display:flex;gap:16px;min-height:56px;overflow:hidden;padding:12px 16px;position:relative;text-overflow:ellipsis}:host([multiline]){min-height:72px}[name=overline]{color:var(--md-sys-color-on-surface-variant, #49454f);font-family:var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-label-small-size, 0.6875rem);font-weight:var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500));line-height:var(--md-sys-typescale-label-small-line-height, 1rem)}[name=supporting-text]{color:var(--md-sys-color-on-surface-variant, #49454f);font-family:var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-body-medium-size, 0.875rem);font-weight:var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400));line-height:var(--md-sys-typescale-body-medium-line-height, 1.25rem)}[name=trailing-supporting-text]{color:var(--md-sys-color-on-surface-variant, #49454f);font-family:var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-label-small-size, 0.6875rem);font-weight:var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500));line-height:var(--md-sys-typescale-label-small-line-height, 1rem)}[name=container]::slotted(*){inset:0;position:absolute}.default-slot{display:inline}.default-slot,.text ::slotted(*){overflow:hidden;text-overflow:ellipsis}.text{display:flex;flex:1;flex-direction:column;overflow:hidden}
`;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Je=class extends ht{};Je.styles=[Zi];Je=a([ne("md-item")],Je);/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Xt=Symbol.for(""),ji=r=>{if((r==null?void 0:r.r)===Xt)return r==null?void 0:r._$litStatic$},oe=(r,...e)=>({_$litStatic$:e.reduce((t,i,o)=>t+(s=>{if(s._$litStatic$!==void 0)return s._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${s}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`)})(i)+r[o+1],r[0]),r:Xt}),_t=new Map,Xi=r=>(e,...t)=>{const i=t.length;let o,s;const n=[],d=[];let h,f=0,v=!1;for(;f<i;){for(h=e[f];f<i&&(s=t[f],(o=ji(s))!==void 0);)h+=o+e[++f],v=!0;f!==i&&d.push(s),n.push(h),f++}if(f===i&&n.push(e[i]),v){const m=n.join("$$lit$$");(e=_t.get(m))===void 0&&(n.raw=n,_t.set(m,e=n)),t=d}return r(e,...t)},Pe=Xi(c);/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ji=te(A);class se extends Ji{constructor(){super(...arguments),this.disabled=!1,this.type="text",this.isListItem=!0,this.href="",this.target=""}get isDisabled(){return this.disabled&&this.type!=="link"}willUpdate(e){this.href&&(this.type="link"),super.willUpdate(e)}render(){return this.renderListItem(c`
      <md-item>
        <div slot="container">
          ${this.renderRipple()} ${this.renderFocusRing()}
        </div>
        <slot name="start" slot="start"></slot>
        <slot name="end" slot="end"></slot>
        ${this.renderBody()}
      </md-item>
    `)}renderListItem(e){const t=this.type==="link";let i;switch(this.type){case"link":i=oe`a`;break;case"button":i=oe`button`;break;default:case"text":i=oe`li`;break}const o=this.type!=="text",s=t&&this.target?this.target:p;return Pe`
      <${i}
        id="item"
        tabindex="${this.isDisabled||!o?-1:0}"
        ?disabled=${this.isDisabled}
        role="listitem"
        aria-selected=${this.ariaSelected||p}
        aria-checked=${this.ariaChecked||p}
        aria-expanded=${this.ariaExpanded||p}
        aria-haspopup=${this.ariaHasPopup||p}
        class="list-item ${U(this.getRenderClasses())}"
        href=${this.href||p}
        target=${s}
        @focus=${this.onFocus}
      >${e}</${i}>
    `}renderRipple(){return this.type==="text"?p:c` <md-ripple
      part="ripple"
      for="item"
      ?disabled=${this.isDisabled}></md-ripple>`}renderFocusRing(){return this.type==="text"?p:c` <md-focus-ring
      @visibility-changed=${this.onFocusRingVisibilityChanged}
      part="focus-ring"
      for="item"
      inward></md-focus-ring>`}onFocusRingVisibilityChanged(e){}getRenderClasses(){return{disabled:this.isDisabled}}renderBody(){return c`
      <slot></slot>
      <slot name="overline" slot="overline"></slot>
      <slot name="headline" slot="headline"></slot>
      <slot name="supporting-text" slot="supporting-text"></slot>
      <slot
        name="trailing-supporting-text"
        slot="trailing-supporting-text"></slot>
    `}onFocus(){this.tabIndex===-1&&this.dispatchEvent(Wi())}focus(){var e;(e=this.listItemRoot)==null||e.focus()}click(){if(!this.listItemRoot){super.click();return}this.listItemRoot.click()}}se.shadowRootOptions={...A.shadowRootOptions,delegatesFocus:!0};a([l({type:Boolean,reflect:!0})],se.prototype,"disabled",void 0);a([l({reflect:!0})],se.prototype,"type",void 0);a([l({type:Boolean,attribute:"md-list-item",reflect:!0})],se.prototype,"isListItem",void 0);a([l()],se.prototype,"href",void 0);a([l()],se.prototype,"target",void 0);a([R(".list-item")],se.prototype,"listItemRoot",void 0);/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Qi=T`:host{display:flex;-webkit-tap-highlight-color:rgba(0,0,0,0);--md-ripple-hover-color: var(--md-list-item-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-hover-opacity: var(--md-list-item-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-list-item-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-pressed-opacity: var(--md-list-item-pressed-state-layer-opacity, 0.12)}:host(:is([type=button]:not([disabled]),[type=link])){cursor:pointer}md-focus-ring{z-index:1;--md-focus-ring-shape: 8px}a,button,li{background:none;border:none;cursor:inherit;padding:0;margin:0;text-align:unset;text-decoration:none}.list-item{border-radius:inherit;display:flex;flex:1;max-width:inherit;min-width:inherit;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0);width:100%}.list-item.interactive{cursor:pointer}.list-item.disabled{opacity:var(--md-list-item-disabled-opacity, 0.3);pointer-events:none}[slot=container]{pointer-events:none}md-ripple{border-radius:inherit}md-item{border-radius:inherit;flex:1;height:100%;color:var(--md-list-item-label-text-color, var(--md-sys-color-on-surface, #1d1b20));font-family:var(--md-list-item-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-list-item-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));line-height:var(--md-list-item-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));font-weight:var(--md-list-item-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));min-height:var(--md-list-item-one-line-container-height, 56px);padding-top:var(--md-list-item-top-space, 12px);padding-bottom:var(--md-list-item-bottom-space, 12px);padding-inline-start:var(--md-list-item-leading-space, 16px);padding-inline-end:var(--md-list-item-trailing-space, 16px)}md-item[multiline]{min-height:var(--md-list-item-two-line-container-height, 72px)}[slot=supporting-text]{color:var(--md-list-item-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-list-item-supporting-text-font, var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-list-item-supporting-text-size, var(--md-sys-typescale-body-medium-size, 0.875rem));line-height:var(--md-list-item-supporting-text-line-height, var(--md-sys-typescale-body-medium-line-height, 1.25rem));font-weight:var(--md-list-item-supporting-text-weight, var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400)))}[slot=trailing-supporting-text]{color:var(--md-list-item-trailing-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-list-item-trailing-supporting-text-font, var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-list-item-trailing-supporting-text-size, var(--md-sys-typescale-label-small-size, 0.6875rem));line-height:var(--md-list-item-trailing-supporting-text-line-height, var(--md-sys-typescale-label-small-line-height, 1rem));font-weight:var(--md-list-item-trailing-supporting-text-weight, var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500)))}:is([slot=start],[slot=end])::slotted(*){fill:currentColor}[slot=start]{color:var(--md-list-item-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}[slot=end]{color:var(--md-list-item-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}@media(forced-colors: active){.disabled slot{color:GrayText}.list-item.disabled{color:GrayText;opacity:1}}
`;class Jt extends se{}Jt.styles=[Qi];customElements.define("ew-list-item",Jt);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class _e extends A{constructor(){super(...arguments),this.inset=!1,this.insetStart=!1,this.insetEnd=!1}}a([l({type:Boolean,reflect:!0})],_e.prototype,"inset",void 0);a([l({type:Boolean,reflect:!0,attribute:"inset-start"})],_e.prototype,"insetStart",void 0);a([l({type:Boolean,reflect:!0,attribute:"inset-end"})],_e.prototype,"insetEnd",void 0);/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Qt=T`:host{box-sizing:border-box;color:var(--md-divider-color, var(--md-sys-color-outline-variant, #cac4d0));display:flex;height:var(--md-divider-thickness, 1px);width:100%}:host([inset]),:host([inset-start]){padding-inline-start:16px}:host([inset]),:host([inset-end]){padding-inline-end:16px}:host::before{background:currentColor;content:"";height:100%;width:100%}@media(forced-colors: active){:host::before{background:CanvasText}}
`;class ei extends _e{}ei.styles=[Qt];customElements.define("ew-divider",ei);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function ze(r,e){e.bubbles&&(!r.shadowRoot||e.composed)&&e.stopPropagation();const t=Reflect.construct(e.constructor,[e.type,e]),i=r.dispatchEvent(t);return i||e.preventDefault(),i}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const ge=Symbol("createValidator"),be=Symbol("getValidityAnchor"),He=Symbol("privateValidator"),Q=Symbol("privateSyncValidity"),Ie=Symbol("privateCustomValidationMessage");function pt(r){var e;class t extends r{constructor(){super(...arguments),this[e]=""}get validity(){return this[Q](),this[N].validity}get validationMessage(){return this[Q](),this[N].validationMessage}get willValidate(){return this[Q](),this[N].willValidate}checkValidity(){return this[Q](),this[N].checkValidity()}reportValidity(){return this[Q](),this[N].reportValidity()}setCustomValidity(o){this[Ie]=o,this[Q]()}requestUpdate(o,s,n){super.requestUpdate(o,s,n),this[Q]()}firstUpdated(o){super.firstUpdated(o),this[Q]()}[(e=Ie,Q)](){this[He]||(this[He]=this[ge]());const{validity:o,validationMessage:s}=this[He].getValidity(),n=!!this[Ie],d=this[Ie]||s;this[N].setValidity({...o,customError:n},d,this[be]()??void 0)}[ge](){throw new Error("Implement [createValidator]")}[be](){throw new Error("Implement [getValidityAnchor]")}}return t}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const pe=Symbol("getFormValue"),Qe=Symbol("getFormState");function ut(r){class e extends r{get form(){return this[N].form}get labels(){return this[N].labels}get name(){return this.getAttribute("name")??""}set name(i){this.setAttribute("name",i)}get disabled(){return this.hasAttribute("disabled")}set disabled(i){this.toggleAttribute("disabled",i)}attributeChangedCallback(i,o,s){if(i==="name"||i==="disabled"){const n=i==="disabled"?o!==null:o;this.requestUpdate(i,n);return}super.attributeChangedCallback(i,o,s)}requestUpdate(i,o,s){super.requestUpdate(i,o,s),this[N].setFormValue(this[pe](),this[Qe]())}[pe](){throw new Error("Implement [getFormValue]")}[Qe](){return this[pe]()}formDisabledCallback(i){this.disabled=i}}return e.formAssociated=!0,a([l({noAccessor:!0})],e.prototype,"name",null),a([l({type:Boolean,noAccessor:!0})],e.prototype,"disabled",null),e}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class ft{constructor(e){this.getCurrentState=e,this.currentValidity={validity:{},validationMessage:""}}getValidity(){const e=this.getCurrentState();if(!(!this.prevState||!this.equals(this.prevState,e)))return this.currentValidity;const{validity:i,validationMessage:o}=this.computeValidity(e);return this.prevState=this.copy(e),this.currentValidity={validationMessage:o,validity:{badInput:i.badInput,customError:i.customError,patternMismatch:i.patternMismatch,rangeOverflow:i.rangeOverflow,rangeUnderflow:i.rangeUnderflow,stepMismatch:i.stepMismatch,tooLong:i.tooLong,tooShort:i.tooShort,typeMismatch:i.typeMismatch,valueMissing:i.valueMissing}},this.currentValidity}}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class er extends ft{computeValidity(e){return this.checkboxControl||(this.checkboxControl=document.createElement("input"),this.checkboxControl.type="checkbox"),this.checkboxControl.checked=e.checked,this.checkboxControl.required=e.required,{validity:this.checkboxControl.validity,validationMessage:this.checkboxControl.validationMessage}}equals(e,t){return e.checked===t.checked&&e.required===t.required}copy({checked:e,required:t}){return{checked:e,required:t}}}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const tr=te(pt(ut(xe(A))));class X extends tr{constructor(){super(),this.checked=!1,this.indeterminate=!1,this.required=!1,this.value="on",this.prevChecked=!1,this.prevDisabled=!1,this.prevIndeterminate=!1,this.addEventListener("click",e=>{!Vt(e)||!this.input||(this.focus(),Ut(this.input))})}update(e){(e.has("checked")||e.has("disabled")||e.has("indeterminate"))&&(this.prevChecked=e.get("checked")??this.checked,this.prevDisabled=e.get("disabled")??this.disabled,this.prevIndeterminate=e.get("indeterminate")??this.indeterminate),super.update(e)}render(){const e=!this.prevChecked&&!this.prevIndeterminate,t=this.prevChecked&&!this.prevIndeterminate,i=this.prevIndeterminate,o=this.checked&&!this.indeterminate,s=this.indeterminate,n=U({disabled:this.disabled,selected:o||s,unselected:!o&&!s,checked:o,indeterminate:s,"prev-unselected":e,"prev-checked":t,"prev-indeterminate":i,"prev-disabled":this.prevDisabled}),{ariaLabel:d,ariaInvalid:h}=this;return c`
      <div class="container ${n}">
        <input
          type="checkbox"
          id="input"
          aria-checked=${s?"mixed":p}
          aria-label=${d||p}
          aria-invalid=${h||p}
          ?disabled=${this.disabled}
          ?required=${this.required}
          .indeterminate=${this.indeterminate}
          .checked=${this.checked}
          @input=${this.handleInput}
          @change=${this.handleChange} />

        <div class="outline"></div>
        <div class="background"></div>
        <md-focus-ring part="focus-ring" for="input"></md-focus-ring>
        <md-ripple for="input" ?disabled=${this.disabled}></md-ripple>
        <svg class="icon" viewBox="0 0 18 18" aria-hidden="true">
          <rect class="mark short" />
          <rect class="mark long" />
        </svg>
      </div>
    `}handleInput(e){const t=e.target;this.checked=t.checked,this.indeterminate=t.indeterminate}handleChange(e){ze(this,e)}[pe](){return!this.checked||this.indeterminate?null:this.value}[Qe](){return String(this.checked)}formResetCallback(){this.checked=this.hasAttribute("checked")}formStateRestoreCallback(e){this.checked=e==="true"}[ge](){return new er(()=>this)}[be](){return this.input}}X.shadowRootOptions={...A.shadowRootOptions,delegatesFocus:!0};a([l({type:Boolean})],X.prototype,"checked",void 0);a([l({type:Boolean})],X.prototype,"indeterminate",void 0);a([l({type:Boolean})],X.prototype,"required",void 0);a([l()],X.prototype,"value",void 0);a([y()],X.prototype,"prevChecked",void 0);a([y()],X.prototype,"prevDisabled",void 0);a([y()],X.prototype,"prevIndeterminate",void 0);a([R("input")],X.prototype,"input",void 0);/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const ir=T`:host{border-start-start-radius:var(--md-checkbox-container-shape-start-start, var(--md-checkbox-container-shape, 2px));border-start-end-radius:var(--md-checkbox-container-shape-start-end, var(--md-checkbox-container-shape, 2px));border-end-end-radius:var(--md-checkbox-container-shape-end-end, var(--md-checkbox-container-shape, 2px));border-end-start-radius:var(--md-checkbox-container-shape-end-start, var(--md-checkbox-container-shape, 2px));display:inline-flex;height:var(--md-checkbox-container-size, 18px);position:relative;vertical-align:top;width:var(--md-checkbox-container-size, 18px);-webkit-tap-highlight-color:rgba(0,0,0,0);cursor:pointer}:host([disabled]){cursor:default}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--md-checkbox-container-size, 18px))/2)}md-focus-ring{height:44px;inset:unset;width:44px}input{appearance:none;height:48px;margin:0;opacity:0;outline:none;position:absolute;width:48px;z-index:1;cursor:inherit}:host([touch-target=none]) input{height:100%;width:100%}.container{border-radius:inherit;display:flex;height:100%;place-content:center;place-items:center;position:relative;width:100%}.outline,.background,.icon{inset:0;position:absolute}.outline,.background{border-radius:inherit}.outline{border-color:var(--md-checkbox-outline-color, var(--md-sys-color-on-surface-variant, #49454f));border-style:solid;border-width:var(--md-checkbox-outline-width, 2px);box-sizing:border-box}.background{background-color:var(--md-checkbox-selected-container-color, var(--md-sys-color-primary, #6750a4))}.background,.icon{opacity:0;transition-duration:150ms,50ms;transition-property:transform,opacity;transition-timing-function:cubic-bezier(0.3, 0, 0.8, 0.15),linear;transform:scale(0.6)}:where(.selected) :is(.background,.icon){opacity:1;transition-duration:350ms,50ms;transition-timing-function:cubic-bezier(0.05, 0.7, 0.1, 1),linear;transform:scale(1)}md-ripple{border-radius:var(--md-checkbox-state-layer-shape, var(--md-sys-shape-corner-full, 9999px));height:var(--md-checkbox-state-layer-size, 40px);inset:unset;width:var(--md-checkbox-state-layer-size, 40px);--md-ripple-hover-color: var(--md-checkbox-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-hover-opacity: var(--md-checkbox-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-checkbox-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--md-ripple-pressed-opacity: var(--md-checkbox-pressed-state-layer-opacity, 0.12)}.selected md-ripple{--md-ripple-hover-color: var(--md-checkbox-selected-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--md-ripple-hover-opacity: var(--md-checkbox-selected-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-checkbox-selected-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-pressed-opacity: var(--md-checkbox-selected-pressed-state-layer-opacity, 0.12)}.icon{fill:var(--md-checkbox-selected-icon-color, var(--md-sys-color-on-primary, #fff));height:var(--md-checkbox-icon-size, 18px);width:var(--md-checkbox-icon-size, 18px)}.mark.short{height:2px;transition-property:transform,height;width:2px}.mark.long{height:2px;transition-property:transform,width;width:10px}.mark{animation-duration:150ms;animation-timing-function:cubic-bezier(0.3, 0, 0.8, 0.15);transition-duration:150ms;transition-timing-function:cubic-bezier(0.3, 0, 0.8, 0.15)}.selected .mark{animation-duration:350ms;animation-timing-function:cubic-bezier(0.05, 0.7, 0.1, 1);transition-duration:350ms;transition-timing-function:cubic-bezier(0.05, 0.7, 0.1, 1)}.checked .mark,.prev-checked.unselected .mark{transform:scaleY(-1) translate(7px, -14px) rotate(45deg)}.checked .mark.short,.prev-checked.unselected .mark.short{height:5.6568542495px}.checked .mark.long,.prev-checked.unselected .mark.long{width:11.313708499px}.indeterminate .mark,.prev-indeterminate.unselected .mark{transform:scaleY(-1) translate(4px, -10px) rotate(0deg)}.prev-unselected .mark{transition-property:none}.prev-unselected.checked .mark.long{animation-name:prev-unselected-to-checked}@keyframes prev-unselected-to-checked{from{width:0}}:where(:hover) .outline{border-color:var(--md-checkbox-hover-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-hover-outline-width, 2px)}:where(:hover) .background{background:var(--md-checkbox-selected-hover-container-color, var(--md-sys-color-primary, #6750a4))}:where(:hover) .icon{fill:var(--md-checkbox-selected-hover-icon-color, var(--md-sys-color-on-primary, #fff))}:where(:focus-within) .outline{border-color:var(--md-checkbox-focus-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-focus-outline-width, 2px)}:where(:focus-within) .background{background:var(--md-checkbox-selected-focus-container-color, var(--md-sys-color-primary, #6750a4))}:where(:focus-within) .icon{fill:var(--md-checkbox-selected-focus-icon-color, var(--md-sys-color-on-primary, #fff))}:where(:active) .outline{border-color:var(--md-checkbox-pressed-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-pressed-outline-width, 2px)}:where(:active) .background{background:var(--md-checkbox-selected-pressed-container-color, var(--md-sys-color-primary, #6750a4))}:where(:active) .icon{fill:var(--md-checkbox-selected-pressed-icon-color, var(--md-sys-color-on-primary, #fff))}:where(.disabled,.prev-disabled) :is(.background,.icon,.mark){animation-duration:0s;transition-duration:0s}:where(.disabled) .outline{border-color:var(--md-checkbox-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-disabled-outline-width, 2px);opacity:var(--md-checkbox-disabled-container-opacity, 0.38)}:where(.selected.disabled) .outline{visibility:hidden}:where(.selected.disabled) .background{background:var(--md-checkbox-selected-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-checkbox-selected-disabled-container-opacity, 0.38)}:where(.disabled) .icon{fill:var(--md-checkbox-selected-disabled-icon-color, var(--md-sys-color-surface, #fef7ff))}@media(forced-colors: active){.background{background-color:CanvasText}.selected.disabled .background{background-color:GrayText;opacity:1}.outline{border-color:CanvasText}.disabled .outline{border-color:GrayText;opacity:1}.icon{fill:Canvas}}
`;class ti extends X{}ti.styles=[ir];customElements.define("ew-checkbox",ti);class rr{constructor(e){this.targetElement=e,this.state={bold:!1,italic:!1,underline:!1,strikethrough:!1,foregroundColor:null,backgroundColor:null,carriageReturn:!1,lines:[],secret:!1}}logs(){return this.targetElement.innerText}processLine(e){const t=/(?:\033|\\033)(?:\[(.*?)[@-~]|\].*?(?:\007|\033\\))/g;let i=0;const o=document.createElement("span");o.classList.add("line");const s=n=>{if(n==="")return;const d=document.createElement("span");if(this.state.bold&&d.classList.add("log-bold"),this.state.italic&&d.classList.add("log-italic"),this.state.underline&&d.classList.add("log-underline"),this.state.strikethrough&&d.classList.add("log-strikethrough"),this.state.secret&&d.classList.add("log-secret"),this.state.foregroundColor!==null&&d.classList.add(`log-fg-${this.state.foregroundColor}`),this.state.backgroundColor!==null&&d.classList.add(`log-bg-${this.state.backgroundColor}`),d.appendChild(document.createTextNode(n)),o.appendChild(d),this.state.secret){const h=document.createElement("span");h.classList.add("log-secret-redacted"),h.appendChild(document.createTextNode("[redacted]")),o.appendChild(h)}};for(;;){const n=t.exec(e);if(n===null)break;const d=n.index;if(s(e.substring(i,d)),i=d+n[0].length,n[1]!==void 0)for(const h of n[1].split(";"))switch(parseInt(h)){case 0:this.state.bold=!1,this.state.italic=!1,this.state.underline=!1,this.state.strikethrough=!1,this.state.foregroundColor=null,this.state.backgroundColor=null,this.state.secret=!1;break;case 1:this.state.bold=!0;break;case 3:this.state.italic=!0;break;case 4:this.state.underline=!0;break;case 5:this.state.secret=!0;break;case 6:this.state.secret=!1;break;case 9:this.state.strikethrough=!0;break;case 22:this.state.bold=!1;break;case 23:this.state.italic=!1;break;case 24:this.state.underline=!1;break;case 29:this.state.strikethrough=!1;break;case 30:this.state.foregroundColor="black";break;case 31:this.state.foregroundColor="red";break;case 32:this.state.foregroundColor="green";break;case 33:this.state.foregroundColor="yellow";break;case 34:this.state.foregroundColor="blue";break;case 35:this.state.foregroundColor="magenta";break;case 36:this.state.foregroundColor="cyan";break;case 37:this.state.foregroundColor="white";break;case 39:this.state.foregroundColor=null;break;case 41:this.state.backgroundColor="red";break;case 42:this.state.backgroundColor="green";break;case 43:this.state.backgroundColor="yellow";break;case 44:this.state.backgroundColor="blue";break;case 45:this.state.backgroundColor="magenta";break;case 46:this.state.backgroundColor="cyan";break;case 47:this.state.backgroundColor="white";break;case 40:case 49:this.state.backgroundColor=null;break}}return s(e.substring(i)),o}processLines(){const e=this.targetElement.scrollTop>this.targetElement.scrollHeight-this.targetElement.offsetHeight-50,t=this.state.carriageReturn,i=document.createDocumentFragment();if(this.state.lines.length!=0){for(const o of this.state.lines)this.state.carriageReturn&&o!==`
`&&i.childElementCount&&i.removeChild(i.lastChild),i.appendChild(this.processLine(o)),this.state.carriageReturn=o.includes("\r");t&&this.state.lines[0]!==`
`?this.targetElement.replaceChild(i,this.targetElement.lastChild):this.targetElement.appendChild(i),this.state.lines=[],e&&(this.targetElement.scrollTop=this.targetElement.scrollHeight)}}addLine(e){this.state.lines.length==0&&setTimeout(()=>this.processLines(),0),this.state.lines.push(e)}}const or=`
  .log {
    flex: 1;
    background-color: #1c1c1c;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier,
      monospace;
    font-size: 12px;
    padding: 16px;
    overflow: auto;
    line-height: 1.45;
    border-radius: 3px;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    color: #ddd;
  }

  .log-bold {
    font-weight: bold;
  }
  .log-italic {
    font-style: italic;
  }
  .log-underline {
    text-decoration: underline;
  }
  .log-strikethrough {
    text-decoration: line-through;
  }
  .log-underline.log-strikethrough {
    text-decoration: underline line-through;
  }
  .log-secret {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .log-secret-redacted {
    opacity: 0;
    width: 1px;
    font-size: 1px;
  }
  .log-fg-black {
    color: rgb(128, 128, 128);
  }
  .log-fg-red {
    color: rgb(255, 0, 0);
  }
  .log-fg-green {
    color: rgb(0, 255, 0);
  }
  .log-fg-yellow {
    color: rgb(255, 255, 0);
  }
  .log-fg-blue {
    color: rgb(0, 0, 255);
  }
  .log-fg-magenta {
    color: rgb(255, 0, 255);
  }
  .log-fg-cyan {
    color: rgb(0, 255, 255);
  }
  .log-fg-white {
    color: rgb(187, 187, 187);
  }
  .log-bg-black {
    background-color: rgb(0, 0, 0);
  }
  .log-bg-red {
    background-color: rgb(255, 0, 0);
  }
  .log-bg-green {
    background-color: rgb(0, 255, 0);
  }
  .log-bg-yellow {
    background-color: rgb(255, 255, 0);
  }
  .log-bg-blue {
    background-color: rgb(0, 0, 255);
  }
  .log-bg-magenta {
    background-color: rgb(255, 0, 255);
  }
  .log-bg-cyan {
    background-color: rgb(0, 255, 255);
  }
  .log-bg-white {
    background-color: rgb(255, 255, 255);
  }
`,ue=r=>new Promise(e=>setTimeout(e,r));class sr{constructor(){this.chunks=""}transform(e,t){this.chunks+=e;const i=this.chunks.split(/\r?\n/);this.chunks=i.pop(),i.forEach(o=>t.enqueue(o+`\r
`))}flush(e){e.enqueue(this.chunks)}}class ar{transform(e,t){const i=new Date,o=i.getHours().toString().padStart(2,"0"),s=i.getMinutes().toString().padStart(2,"0"),n=i.getSeconds().toString().padStart(2,"0");t.enqueue(`[${o}:${s}:${n}]${e}`)}}class nr extends HTMLElement{constructor(){super(...arguments),this.allowInput=!0}logs(){var e;return((e=this._console)===null||e===void 0?void 0:e.logs())||""}connectedCallback(){if(this._console)return;const e=this.attachShadow({mode:"open"});if(e.innerHTML=`
      <style>
        :host, input {
          background-color: #1c1c1c;
          color: #ddd;
          font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier,
            monospace;
          line-height: 1.45;
          display: flex;
          flex-direction: column;
        }
        form {
          display: flex;
          align-items: center;
          padding: 0 8px 0 16px;
        }
        input {
          flex: 1;
          padding: 4px;
          margin: 0 8px;
          border: 0;
          outline: none;
        }
        ${or}
      </style>
      <div class="log"></div>
      ${this.allowInput?`<form>
                >
                <input autofocus>
              </form>
            `:""}
    `,this._console=new rr(this.shadowRoot.querySelector("div")),this.allowInput){const o=this.shadowRoot.querySelector("input");this.addEventListener("click",()=>{var s;((s=getSelection())===null||s===void 0?void 0:s.toString())===""&&o.focus()}),o.addEventListener("keydown",s=>{s.key==="Enter"&&(s.preventDefault(),s.stopPropagation(),this._sendCommand())})}const t=new AbortController,i=this._connect(t.signal);this._cancelConnection=()=>(t.abort(),i)}async _connect(e){this.logger.debug("Starting console read loop");try{await this.port.readable.pipeThrough(new TextDecoderStream,{signal:e}).pipeThrough(new TransformStream(new sr)).pipeThrough(new TransformStream(new ar)).pipeTo(new WritableStream({write:t=>{this._console.addLine(t.replace("\r",""))}})),e.aborted||(this._console.addLine(""),this._console.addLine(""),this._console.addLine("Terminal disconnected"))}catch(t){this._console.addLine(""),this._console.addLine(""),this._console.addLine(`Terminal disconnected: ${t}`)}finally{await ue(100),this.logger.debug("Finished console read loop")}}async _sendCommand(){const e=this.shadowRoot.querySelector("input"),t=e.value,i=new TextEncoder,o=this.port.writable.getWriter();await o.write(i.encode(t+`\r
`)),this._console.addLine(`> ${t}\r
`),e.value="",e.focus();try{o.releaseLock()}catch(s){console.error("Ignoring release lock error",s)}}async disconnect(){this._cancelConnection&&(await this._cancelConnection(),this._cancelConnection=void 0)}async reset(){this.logger.debug("Triggering reset");const e=new zt(this.port);await e.setRTS(!0),await ue(100),await new gi(e).reset()}}customElements.define("ewt-console",nr);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let et=class extends _e{};et.styles=[Qt];et=a([ne("md-divider")],et);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const lr={dialog:[[[{transform:"translateY(-50px)"},{transform:"translateY(0)"}],{duration:500,easing:j.EMPHASIZED}]],scrim:[[[{opacity:0},{opacity:.32}],{duration:500,easing:"linear"}]],container:[[[{opacity:0},{opacity:1}],{duration:50,easing:"linear",pseudoElement:"::before"}],[[{height:"35%"},{height:"100%"}],{duration:500,easing:j.EMPHASIZED,pseudoElement:"::before"}]],headline:[[[{opacity:0},{opacity:0,offset:.2},{opacity:1}],{duration:250,easing:"linear",fill:"forwards"}]],content:[[[{opacity:0},{opacity:0,offset:.2},{opacity:1}],{duration:250,easing:"linear",fill:"forwards"}]],actions:[[[{opacity:0},{opacity:0,offset:.5},{opacity:1}],{duration:300,easing:"linear",fill:"forwards"}]]},dr={dialog:[[[{transform:"translateY(0)"},{transform:"translateY(-50px)"}],{duration:150,easing:j.EMPHASIZED_ACCELERATE}]],scrim:[[[{opacity:.32},{opacity:0}],{duration:150,easing:"linear"}]],container:[[[{height:"100%"},{height:"35%"}],{duration:150,easing:j.EMPHASIZED_ACCELERATE,pseudoElement:"::before"}],[[{opacity:"1"},{opacity:"0"}],{delay:100,duration:50,easing:"linear",pseudoElement:"::before"}]],headline:[[[{opacity:1},{opacity:0}],{duration:100,easing:"linear",fill:"forwards"}]],content:[[[{opacity:1},{opacity:0}],{duration:100,easing:"linear",fill:"forwards"}]],actions:[[[{opacity:1},{opacity:0}],{duration:100,easing:"linear",fill:"forwards"}]]};/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const cr=te(A);class D extends cr{get open(){return this.isOpen}set open(e){e!==this.isOpen&&(this.isOpen=e,e?(this.setAttribute("open",""),this.show()):(this.removeAttribute("open"),this.close()))}constructor(){super(),this.quick=!1,this.returnValue="",this.noFocusTrap=!1,this.getOpenAnimation=()=>lr,this.getCloseAnimation=()=>dr,this.isOpen=!1,this.isOpening=!1,this.isConnectedPromise=this.getIsConnectedPromise(),this.isAtScrollTop=!1,this.isAtScrollBottom=!1,this.nextClickIsFromContent=!1,this.hasHeadline=!1,this.hasActions=!1,this.hasIcon=!1,this.escapePressedWithoutCancel=!1,this.treewalker=document.createTreeWalker(this,NodeFilter.SHOW_ELEMENT),this.addEventListener("submit",this.handleSubmit)}async show(){var i;this.isOpening=!0,await this.isConnectedPromise,await this.updateComplete;const e=this.dialog;if(e.open||!this.isOpening){this.isOpening=!1;return}if(!this.dispatchEvent(new Event("open",{cancelable:!0}))){this.open=!1,this.isOpening=!1;return}e.showModal(),this.open=!0,this.scroller&&(this.scroller.scrollTop=0),(i=this.querySelector("[autofocus]"))==null||i.focus(),await this.animateDialog(this.getOpenAnimation()),this.dispatchEvent(new Event("opened")),this.isOpening=!1}async close(e=this.returnValue){if(this.isOpening=!1,!this.isConnected){this.open=!1;return}await this.updateComplete;const t=this.dialog;if(!t.open||this.isOpening){this.open=!1;return}const i=this.returnValue;if(this.returnValue=e,!this.dispatchEvent(new Event("close",{cancelable:!0}))){this.returnValue=i;return}await this.animateDialog(this.getCloseAnimation()),t.close(e),this.open=!1,this.dispatchEvent(new Event("closed"))}connectedCallback(){super.connectedCallback(),this.isConnectedPromiseResolve()}disconnectedCallback(){super.disconnectedCallback(),this.isConnectedPromise=this.getIsConnectedPromise()}render(){const e=this.open&&!(this.isAtScrollTop&&this.isAtScrollBottom),t={"has-headline":this.hasHeadline,"has-actions":this.hasActions,"has-icon":this.hasIcon,scrollable:e,"show-top-divider":e&&!this.isAtScrollTop,"show-bottom-divider":e&&!this.isAtScrollBottom},i=this.open&&!this.noFocusTrap,o=c`
      <div
        class="focus-trap"
        tabindex="0"
        aria-hidden="true"
        @focus=${this.handleFocusTrapFocus}></div>
    `,{ariaLabel:s}=this;return c`
      <div class="scrim"></div>
      <dialog
        class=${U(t)}
        aria-label=${s||p}
        aria-labelledby=${this.hasHeadline?"headline":p}
        role=${this.type==="alert"?"alertdialog":p}
        @cancel=${this.handleCancel}
        @click=${this.handleDialogClick}
        @close=${this.handleClose}
        @keydown=${this.handleKeydown}
        .returnValue=${this.returnValue||p}>
        ${i?o:p}
        <div class="container" @click=${this.handleContentClick}>
          <div class="headline">
            <div class="icon" aria-hidden="true">
              <slot name="icon" @slotchange=${this.handleIconChange}></slot>
            </div>
            <h2 id="headline" aria-hidden=${!this.hasHeadline||p}>
              <slot
                name="headline"
                @slotchange=${this.handleHeadlineChange}></slot>
            </h2>
            <md-divider></md-divider>
          </div>
          <div class="scroller">
            <div class="content">
              <div class="top anchor"></div>
              <slot name="content"></slot>
              <div class="bottom anchor"></div>
            </div>
          </div>
          <div class="actions">
            <md-divider></md-divider>
            <slot name="actions" @slotchange=${this.handleActionsChange}></slot>
          </div>
        </div>
        ${i?o:p}
      </dialog>
    `}firstUpdated(){this.intersectionObserver=new IntersectionObserver(e=>{for(const t of e)this.handleAnchorIntersection(t)},{root:this.scroller}),this.intersectionObserver.observe(this.topAnchor),this.intersectionObserver.observe(this.bottomAnchor)}handleDialogClick(){if(this.nextClickIsFromContent){this.nextClickIsFromContent=!1;return}this.dispatchEvent(new Event("cancel",{cancelable:!0}))&&this.close()}handleContentClick(){this.nextClickIsFromContent=!0}handleSubmit(e){const t=e.target,{submitter:i}=e;t.getAttribute("method")!=="dialog"||!i||this.close(i.getAttribute("value")??this.returnValue)}handleCancel(e){if(e.target!==this.dialog)return;this.escapePressedWithoutCancel=!1;const t=!ze(this,e);e.preventDefault(),!t&&this.close()}handleClose(){var e;this.escapePressedWithoutCancel&&(this.escapePressedWithoutCancel=!1,(e=this.dialog)==null||e.dispatchEvent(new Event("cancel",{cancelable:!0})))}handleKeydown(e){e.key==="Escape"&&(this.escapePressedWithoutCancel=!0,setTimeout(()=>{this.escapePressedWithoutCancel=!1}))}async animateDialog(e){var _;if((_=this.cancelAnimations)==null||_.abort(),this.cancelAnimations=new AbortController,this.quick)return;const{dialog:t,scrim:i,container:o,headline:s,content:n,actions:d}=this;if(!t||!i||!o||!s||!n||!d)return;const{container:h,dialog:f,scrim:v,headline:m,content:w,actions:g}=e,$=[[t,f??[]],[i,v??[]],[o,h??[]],[s,m??[]],[n,w??[]],[d,g??[]]],x=[];for(const[k,u]of $)for(const C of u){const E=k.animate(...C);this.cancelAnimations.signal.addEventListener("abort",()=>{E.cancel()}),x.push(E)}await Promise.all(x.map(k=>k.finished.catch(()=>{})))}handleHeadlineChange(e){const t=e.target;this.hasHeadline=t.assignedElements().length>0}handleActionsChange(e){const t=e.target;this.hasActions=t.assignedElements().length>0}handleIconChange(e){const t=e.target;this.hasIcon=t.assignedElements().length>0}handleAnchorIntersection(e){const{target:t,isIntersecting:i}=e;t===this.topAnchor&&(this.isAtScrollTop=i),t===this.bottomAnchor&&(this.isAtScrollBottom=i)}getIsConnectedPromise(){return new Promise(e=>{this.isConnectedPromiseResolve=e})}handleFocusTrapFocus(e){var m;const[t,i]=this.getFirstAndLastFocusableChildren();if(!t||!i){(m=this.dialog)==null||m.focus();return}const o=e.target===this.firstFocusTrap,s=!o,n=e.relatedTarget===t,d=e.relatedTarget===i,h=!n&&!d;if(s&&d||o&&h){t.focus();return}if(o&&n||s&&h){i.focus();return}}getFirstAndLastFocusableChildren(){if(!this.treewalker)return[null,null];let e=null,t=null;for(this.treewalker.currentNode=this.treewalker.root;this.treewalker.nextNode();){const i=this.treewalker.currentNode;hr(i)&&(e||(e=i),t=i)}return[e,t]}}a([l({type:Boolean})],D.prototype,"open",null);a([l({type:Boolean})],D.prototype,"quick",void 0);a([l({attribute:!1})],D.prototype,"returnValue",void 0);a([l()],D.prototype,"type",void 0);a([l({type:Boolean,attribute:"no-focus-trap"})],D.prototype,"noFocusTrap",void 0);a([R("dialog")],D.prototype,"dialog",void 0);a([R(".scrim")],D.prototype,"scrim",void 0);a([R(".container")],D.prototype,"container",void 0);a([R(".headline")],D.prototype,"headline",void 0);a([R(".content")],D.prototype,"content",void 0);a([R(".actions")],D.prototype,"actions",void 0);a([y()],D.prototype,"isAtScrollTop",void 0);a([y()],D.prototype,"isAtScrollBottom",void 0);a([R(".scroller")],D.prototype,"scroller",void 0);a([R(".top.anchor")],D.prototype,"topAnchor",void 0);a([R(".bottom.anchor")],D.prototype,"bottomAnchor",void 0);a([R(".focus-trap")],D.prototype,"firstFocusTrap",void 0);a([y()],D.prototype,"hasHeadline",void 0);a([y()],D.prototype,"hasActions",void 0);a([y()],D.prototype,"hasIcon",void 0);function hr(r){var s;const e=":is(button,input,select,textarea,object,:is(a,area)[href],[tabindex],[contenteditable=true])",t=":not(:disabled,[disabled])";return r.matches(e+t+':not([tabindex^="-"])')?!0:!r.localName.includes("-")||!r.matches(t)?!1:((s=r.shadowRoot)==null?void 0:s.delegatesFocus)??!1}/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const pr=T`:host{border-start-start-radius:var(--md-dialog-container-shape-start-start, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));border-start-end-radius:var(--md-dialog-container-shape-start-end, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));border-end-end-radius:var(--md-dialog-container-shape-end-end, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));border-end-start-radius:var(--md-dialog-container-shape-end-start, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));display:contents;margin:auto;max-height:min(560px,100% - 48px);max-width:min(560px,100% - 48px);min-height:140px;min-width:280px;position:fixed;height:fit-content;width:fit-content}dialog{background:rgba(0,0,0,0);border:none;border-radius:inherit;flex-direction:column;height:inherit;margin:inherit;max-height:inherit;max-width:inherit;min-height:inherit;min-width:inherit;outline:none;overflow:visible;padding:0;width:inherit}dialog[open]{display:flex}::backdrop{background:none}.scrim{background:var(--md-sys-color-scrim, #000);display:none;inset:0;opacity:32%;pointer-events:none;position:fixed;z-index:1}:host([open]) .scrim{display:flex}h2{all:unset;align-self:stretch}.headline{align-items:center;color:var(--md-dialog-headline-color, var(--md-sys-color-on-surface, #1d1b20));display:flex;flex-direction:column;font-family:var(--md-dialog-headline-font, var(--md-sys-typescale-headline-small-font, var(--md-ref-typeface-brand, Roboto)));font-size:var(--md-dialog-headline-size, var(--md-sys-typescale-headline-small-size, 1.5rem));line-height:var(--md-dialog-headline-line-height, var(--md-sys-typescale-headline-small-line-height, 2rem));font-weight:var(--md-dialog-headline-weight, var(--md-sys-typescale-headline-small-weight, var(--md-ref-typeface-weight-regular, 400)));position:relative}slot[name=headline]::slotted(*){align-items:center;align-self:stretch;box-sizing:border-box;display:flex;gap:8px;padding:24px 24px 0}.icon{display:flex}slot[name=icon]::slotted(*){color:var(--md-dialog-icon-color, var(--md-sys-color-secondary, #625b71));fill:currentColor;font-size:var(--md-dialog-icon-size, 24px);margin-top:24px;height:var(--md-dialog-icon-size, 24px);width:var(--md-dialog-icon-size, 24px)}.has-icon slot[name=headline]::slotted(*){justify-content:center;padding-top:16px}.scrollable slot[name=headline]::slotted(*){padding-bottom:16px}.scrollable.has-headline slot[name=content]::slotted(*){padding-top:8px}.container{border-radius:inherit;display:flex;flex-direction:column;flex-grow:1;overflow:hidden;position:relative;transform-origin:top}.container::before{background:var(--md-dialog-container-color, var(--md-sys-color-surface-container-high, #ece6f0));border-radius:inherit;content:"";inset:0;position:absolute}.scroller{display:flex;flex:1;flex-direction:column;overflow:hidden;z-index:1}.scrollable .scroller{overflow-y:scroll}.content{color:var(--md-dialog-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-dialog-supporting-text-font, var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-dialog-supporting-text-size, var(--md-sys-typescale-body-medium-size, 0.875rem));line-height:var(--md-dialog-supporting-text-line-height, var(--md-sys-typescale-body-medium-line-height, 1.25rem));flex:1;font-weight:var(--md-dialog-supporting-text-weight, var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400)));height:min-content;position:relative}slot[name=content]::slotted(*){box-sizing:border-box;padding:24px}.anchor{position:absolute}.top.anchor{top:0}.bottom.anchor{bottom:0}.actions{position:relative}slot[name=actions]::slotted(*){box-sizing:border-box;display:flex;gap:8px;justify-content:flex-end;padding:16px 24px 24px}.has-actions slot[name=content]::slotted(*){padding-bottom:8px}md-divider{display:none;position:absolute}.has-headline.show-top-divider .headline md-divider,.has-actions.show-bottom-divider .actions md-divider{display:flex}.headline md-divider{bottom:0}.actions md-divider{top:0}@media(forced-colors: active){dialog{outline:2px solid WindowText}}
`;class ii extends D{}ii.styles=[pr];customElements.define("ew-dialog",ii);/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function wt(r,e=!0){return e&&getComputedStyle(r).getPropertyValue("direction").trim()==="rtl"}/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const ur=te(xe(A));class z extends ur{get name(){return this.getAttribute("name")??""}set name(e){this.setAttribute("name",e)}get form(){return this[N].form}get labels(){return this[N].labels}constructor(){super(),this.disabled=!1,this.softDisabled=!1,this.flipIconInRtl=!1,this.href="",this.download="",this.target="",this.ariaLabelSelected="",this.toggle=!1,this.selected=!1,this.type="submit",this.value="",this.flipIcon=wt(this,this.flipIconInRtl),this.addEventListener("click",this.handleClick.bind(this))}willUpdate(){this.href&&(this.disabled=!1,this.softDisabled=!1)}render(){const e=this.href?oe`div`:oe`button`,{ariaLabel:t,ariaHasPopup:i,ariaExpanded:o}=this,s=t&&this.ariaLabelSelected,n=this.toggle?this.selected:p;let d=p;return this.href||(d=s&&this.selected?this.ariaLabelSelected:t),Pe`<${e}
        class="icon-button ${U(this.getRenderClasses())}"
        id="button"
        aria-label="${d||p}"
        aria-haspopup="${!this.href&&i||p}"
        aria-expanded="${!this.href&&o||p}"
        aria-pressed="${n}"
        aria-disabled=${!this.href&&this.softDisabled||p}
        ?disabled="${!this.href&&this.disabled}"
        @click="${this.handleClickOnChild}">
        ${this.renderFocusRing()}
        ${this.renderRipple()}
        ${this.selected?p:this.renderIcon()}
        ${this.selected?this.renderSelectedIcon():p}
        ${this.href?this.renderLink():this.renderTouchTarget()}
  </${e}>`}renderLink(){const{ariaLabel:e}=this;return c`
      <a
        class="link"
        id="link"
        href="${this.href}"
        download="${this.download||p}"
        target="${this.target||p}"
        aria-label="${e||p}">
        ${this.renderTouchTarget()}
      </a>
    `}getRenderClasses(){return{"flip-icon":this.flipIcon,selected:this.toggle&&this.selected}}renderIcon(){return c`<span class="icon"><slot></slot></span>`}renderSelectedIcon(){return c`<span class="icon icon--selected"
      ><slot name="selected"><slot></slot></slot
    ></span>`}renderTouchTarget(){return c`<span class="touch"></span>`}renderFocusRing(){return c`<md-focus-ring
      part="focus-ring"
      for=${this.href?"link":"button"}></md-focus-ring>`}renderRipple(){const e=!this.href&&(this.disabled||this.softDisabled);return c`<md-ripple
      for=${this.href?"link":p}
      ?disabled="${e}"></md-ripple>`}connectedCallback(){this.flipIcon=wt(this,this.flipIconInRtl),super.connectedCallback()}handleClick(e){if(!this.href&&this.softDisabled){e.stopImmediatePropagation(),e.preventDefault();return}}async handleClickOnChild(e){await 0,!(!this.toggle||this.disabled||this.softDisabled||e.defaultPrevented)&&(this.selected=!this.selected,this.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0})),this.dispatchEvent(new Event("change",{bubbles:!0})))}}qt(z);z.formAssociated=!0;z.shadowRootOptions={mode:"open",delegatesFocus:!0};a([l({type:Boolean,reflect:!0})],z.prototype,"disabled",void 0);a([l({type:Boolean,attribute:"soft-disabled",reflect:!0})],z.prototype,"softDisabled",void 0);a([l({type:Boolean,attribute:"flip-icon-in-rtl"})],z.prototype,"flipIconInRtl",void 0);a([l()],z.prototype,"href",void 0);a([l()],z.prototype,"download",void 0);a([l()],z.prototype,"target",void 0);a([l({attribute:"aria-label-selected"})],z.prototype,"ariaLabelSelected",void 0);a([l({type:Boolean})],z.prototype,"toggle",void 0);a([l({type:Boolean,reflect:!0})],z.prototype,"selected",void 0);a([l()],z.prototype,"type",void 0);a([l({reflect:!0})],z.prototype,"value",void 0);a([y()],z.prototype,"flipIcon",void 0);/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const fr=T`:host{display:inline-flex;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0);height:var(--_container-height);width:var(--_container-width);justify-content:center}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_container-height))/2) max(0px,(48px - var(--_container-width))/2)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}:host(:is([disabled],[soft-disabled])){pointer-events:none}.icon-button{place-items:center;background:none;border:none;box-sizing:border-box;cursor:pointer;display:flex;place-content:center;outline:none;padding:0;position:relative;text-decoration:none;user-select:none;z-index:0;flex:1;border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}.icon ::slotted(*){font-size:var(--_icon-size);height:var(--_icon-size);width:var(--_icon-size);font-weight:inherit}md-ripple{z-index:-1;border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}.flip-icon .icon{transform:scaleX(-1)}.icon{display:inline-flex}.link{display:grid;height:100%;outline:none;place-items:center;position:absolute;width:100%}.touch{position:absolute;height:max(48px,100%);width:max(48px,100%)}:host([touch-target=none]) .touch{display:none}@media(forced-colors: active){:host(:is([disabled],[soft-disabled])){--_disabled-icon-color: GrayText;--_disabled-icon-opacity: 1}}
`;/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const mr=T`:host{--_disabled-icon-color: var(--md-icon-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-icon-button-disabled-icon-opacity, 0.38);--_icon-size: var(--md-icon-button-icon-size, 24px);--_selected-focus-icon-color: var(--md-icon-button-selected-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-icon-color: var(--md-icon-button-selected-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-state-layer-color: var(--md-icon-button-selected-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-state-layer-opacity: var(--md-icon-button-selected-hover-state-layer-opacity, 0.08);--_selected-icon-color: var(--md-icon-button-selected-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-icon-color: var(--md-icon-button-selected-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-state-layer-color: var(--md-icon-button-selected-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-state-layer-opacity: var(--md-icon-button-selected-pressed-state-layer-opacity, 0.12);--_state-layer-height: var(--md-icon-button-state-layer-height, 40px);--_state-layer-shape: var(--md-icon-button-state-layer-shape, var(--md-sys-shape-corner-full, 9999px));--_state-layer-width: var(--md-icon-button-state-layer-width, 40px);--_focus-icon-color: var(--md-icon-button-focus-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-icon-color: var(--md-icon-button-hover-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-icon-button-hover-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-opacity: var(--md-icon-button-hover-state-layer-opacity, 0.08);--_icon-color: var(--md-icon-button-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-icon-color: var(--md-icon-button-pressed-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-color: var(--md-icon-button-pressed-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-opacity: var(--md-icon-button-pressed-state-layer-opacity, 0.12);--_container-shape-start-start: 0;--_container-shape-start-end: 0;--_container-shape-end-end: 0;--_container-shape-end-start: 0;--_container-height: 0;--_container-width: 0;height:var(--_state-layer-height);width:var(--_state-layer-width)}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_state-layer-height))/2) max(0px,(48px - var(--_state-layer-width))/2)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_state-layer-shape);--md-focus-ring-shape-start-end: var(--_state-layer-shape);--md-focus-ring-shape-end-end: var(--_state-layer-shape);--md-focus-ring-shape-end-start: var(--_state-layer-shape)}.standard{background-color:rgba(0,0,0,0);color:var(--_icon-color);--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.standard:hover{color:var(--_hover-icon-color)}.standard:focus{color:var(--_focus-icon-color)}.standard:active{color:var(--_pressed-icon-color)}.standard:is(:disabled,[aria-disabled=true]){color:var(--_disabled-icon-color)}md-ripple{border-radius:var(--_state-layer-shape)}.standard:is(:disabled,[aria-disabled=true]){opacity:var(--_disabled-icon-opacity)}.selected{--md-ripple-hover-color: var(--_selected-hover-state-layer-color);--md-ripple-hover-opacity: var(--_selected-hover-state-layer-opacity);--md-ripple-pressed-color: var(--_selected-pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_selected-pressed-state-layer-opacity)}.selected:not(:disabled,[aria-disabled=true]){color:var(--_selected-icon-color)}.selected:not(:disabled,[aria-disabled=true]):hover{color:var(--_selected-hover-icon-color)}.selected:not(:disabled,[aria-disabled=true]):focus{color:var(--_selected-focus-icon-color)}.selected:not(:disabled,[aria-disabled=true]):active{color:var(--_selected-pressed-icon-color)}
`;class ri extends z{}ri.styles=[fr,mr];customElements.define("ew-icon-button",ri);/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const vr=T`:host{--_active-indicator-color: var(--md-filled-text-field-active-indicator-color, var(--md-sys-color-on-surface-variant, #49454f));--_active-indicator-height: var(--md-filled-text-field-active-indicator-height, 1px);--_caret-color: var(--md-filled-text-field-caret-color, var(--md-sys-color-primary, #6750a4));--_container-color: var(--md-filled-text-field-container-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_disabled-active-indicator-color: var(--md-filled-text-field-disabled-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-active-indicator-height: var(--md-filled-text-field-disabled-active-indicator-height, 1px);--_disabled-active-indicator-opacity: var(--md-filled-text-field-disabled-active-indicator-opacity, 0.38);--_disabled-container-color: var(--md-filled-text-field-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-opacity: var(--md-filled-text-field-disabled-container-opacity, 0.04);--_disabled-input-text-color: var(--md-filled-text-field-disabled-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-input-text-opacity: var(--md-filled-text-field-disabled-input-text-opacity, 0.38);--_disabled-label-text-color: var(--md-filled-text-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-filled-text-field-disabled-label-text-opacity, 0.38);--_disabled-leading-icon-color: var(--md-filled-text-field-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-icon-opacity: var(--md-filled-text-field-disabled-leading-icon-opacity, 0.38);--_disabled-supporting-text-color: var(--md-filled-text-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-supporting-text-opacity: var(--md-filled-text-field-disabled-supporting-text-opacity, 0.38);--_disabled-trailing-icon-color: var(--md-filled-text-field-disabled-trailing-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-trailing-icon-opacity: var(--md-filled-text-field-disabled-trailing-icon-opacity, 0.38);--_error-active-indicator-color: var(--md-filled-text-field-error-active-indicator-color, var(--md-sys-color-error, #b3261e));--_error-focus-active-indicator-color: var(--md-filled-text-field-error-focus-active-indicator-color, var(--md-sys-color-error, #b3261e));--_error-focus-caret-color: var(--md-filled-text-field-error-focus-caret-color, var(--md-sys-color-error, #b3261e));--_error-focus-input-text-color: var(--md-filled-text-field-error-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_error-focus-label-text-color: var(--md-filled-text-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-leading-icon-color: var(--md-filled-text-field-error-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-focus-supporting-text-color: var(--md-filled-text-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-trailing-icon-color: var(--md-filled-text-field-error-focus-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_error-hover-active-indicator-color: var(--md-filled-text-field-error-hover-active-indicator-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-input-text-color: var(--md-filled-text-field-error-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-label-text-color: var(--md-filled-text-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-leading-icon-color: var(--md-filled-text-field-error-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-hover-state-layer-color: var(--md-filled-text-field-error-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-state-layer-opacity: var(--md-filled-text-field-error-hover-state-layer-opacity, 0.08);--_error-hover-supporting-text-color: var(--md-filled-text-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-hover-trailing-icon-color: var(--md-filled-text-field-error-hover-trailing-icon-color, var(--md-sys-color-on-error-container, #410e0b));--_error-input-text-color: var(--md-filled-text-field-error-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_error-label-text-color: var(--md-filled-text-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_error-leading-icon-color: var(--md-filled-text-field-error-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-supporting-text-color: var(--md-filled-text-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-trailing-icon-color: var(--md-filled-text-field-error-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_focus-active-indicator-color: var(--md-filled-text-field-focus-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_focus-active-indicator-height: var(--md-filled-text-field-focus-active-indicator-height, 3px);--_focus-input-text-color: var(--md-filled-text-field-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_focus-label-text-color: var(--md-filled-text-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_focus-leading-icon-color: var(--md-filled-text-field-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-supporting-text-color: var(--md-filled-text-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-trailing-icon-color: var(--md-filled-text-field-focus-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-active-indicator-color: var(--md-filled-text-field-hover-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-active-indicator-height: var(--md-filled-text-field-hover-active-indicator-height, 1px);--_hover-input-text-color: var(--md-filled-text-field-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-label-text-color: var(--md-filled-text-field-hover-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-leading-icon-color: var(--md-filled-text-field-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-filled-text-field-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-state-layer-opacity: var(--md-filled-text-field-hover-state-layer-opacity, 0.08);--_hover-supporting-text-color: var(--md-filled-text-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-trailing-icon-color: var(--md-filled-text-field-hover-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-color: var(--md-filled-text-field-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_input-text-font: var(--md-filled-text-field-input-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_input-text-line-height: var(--md-filled-text-field-input-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_input-text-placeholder-color: var(--md-filled-text-field-input-text-placeholder-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-prefix-color: var(--md-filled-text-field-input-text-prefix-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-size: var(--md-filled-text-field-input-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_input-text-suffix-color: var(--md-filled-text-field-input-text-suffix-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-weight: var(--md-filled-text-field-input-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_label-text-color: var(--md-filled-text-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-font: var(--md-filled-text-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-filled-text-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_label-text-populated-line-height: var(--md-filled-text-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_label-text-populated-size: var(--md-filled-text-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_label-text-size: var(--md-filled-text-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_label-text-weight: var(--md-filled-text-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_leading-icon-color: var(--md-filled-text-field-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_leading-icon-size: var(--md-filled-text-field-leading-icon-size, 24px);--_supporting-text-color: var(--md-filled-text-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_supporting-text-font: var(--md-filled-text-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_supporting-text-line-height: var(--md-filled-text-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_supporting-text-size: var(--md-filled-text-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_supporting-text-weight: var(--md-filled-text-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_trailing-icon-color: var(--md-filled-text-field-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_trailing-icon-size: var(--md-filled-text-field-trailing-icon-size, 24px);--_container-shape-start-start: var(--md-filled-text-field-container-shape-start-start, var(--md-filled-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-start-end: var(--md-filled-text-field-container-shape-start-end, var(--md-filled-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-end: var(--md-filled-text-field-container-shape-end-end, var(--md-filled-text-field-container-shape, var(--md-sys-shape-corner-none, 0px)));--_container-shape-end-start: var(--md-filled-text-field-container-shape-end-start, var(--md-filled-text-field-container-shape, var(--md-sys-shape-corner-none, 0px)));--_icon-input-space: var(--md-filled-text-field-icon-input-space, 16px);--_leading-space: var(--md-filled-text-field-leading-space, 16px);--_trailing-space: var(--md-filled-text-field-trailing-space, 16px);--_top-space: var(--md-filled-text-field-top-space, 16px);--_bottom-space: var(--md-filled-text-field-bottom-space, 16px);--_input-text-prefix-trailing-space: var(--md-filled-text-field-input-text-prefix-trailing-space, 2px);--_input-text-suffix-leading-space: var(--md-filled-text-field-input-text-suffix-leading-space, 2px);--_with-label-top-space: var(--md-filled-text-field-with-label-top-space, 8px);--_with-label-bottom-space: var(--md-filled-text-field-with-label-bottom-space, 8px);--_focus-caret-color: var(--md-filled-text-field-focus-caret-color, var(--md-sys-color-primary, #6750a4));--_with-leading-icon-leading-space: var(--md-filled-text-field-with-leading-icon-leading-space, 12px);--_with-trailing-icon-trailing-space: var(--md-filled-text-field-with-trailing-icon-trailing-space, 12px);--md-filled-field-active-indicator-color: var(--_active-indicator-color);--md-filled-field-active-indicator-height: var(--_active-indicator-height);--md-filled-field-bottom-space: var(--_bottom-space);--md-filled-field-container-color: var(--_container-color);--md-filled-field-container-shape-end-end: var(--_container-shape-end-end);--md-filled-field-container-shape-end-start: var(--_container-shape-end-start);--md-filled-field-container-shape-start-end: var(--_container-shape-start-end);--md-filled-field-container-shape-start-start: var(--_container-shape-start-start);--md-filled-field-content-color: var(--_input-text-color);--md-filled-field-content-font: var(--_input-text-font);--md-filled-field-content-line-height: var(--_input-text-line-height);--md-filled-field-content-size: var(--_input-text-size);--md-filled-field-content-space: var(--_icon-input-space);--md-filled-field-content-weight: var(--_input-text-weight);--md-filled-field-disabled-active-indicator-color: var(--_disabled-active-indicator-color);--md-filled-field-disabled-active-indicator-height: var(--_disabled-active-indicator-height);--md-filled-field-disabled-active-indicator-opacity: var(--_disabled-active-indicator-opacity);--md-filled-field-disabled-container-color: var(--_disabled-container-color);--md-filled-field-disabled-container-opacity: var(--_disabled-container-opacity);--md-filled-field-disabled-content-color: var(--_disabled-input-text-color);--md-filled-field-disabled-content-opacity: var(--_disabled-input-text-opacity);--md-filled-field-disabled-label-text-color: var(--_disabled-label-text-color);--md-filled-field-disabled-label-text-opacity: var(--_disabled-label-text-opacity);--md-filled-field-disabled-leading-content-color: var(--_disabled-leading-icon-color);--md-filled-field-disabled-leading-content-opacity: var(--_disabled-leading-icon-opacity);--md-filled-field-disabled-supporting-text-color: var(--_disabled-supporting-text-color);--md-filled-field-disabled-supporting-text-opacity: var(--_disabled-supporting-text-opacity);--md-filled-field-disabled-trailing-content-color: var(--_disabled-trailing-icon-color);--md-filled-field-disabled-trailing-content-opacity: var(--_disabled-trailing-icon-opacity);--md-filled-field-error-active-indicator-color: var(--_error-active-indicator-color);--md-filled-field-error-content-color: var(--_error-input-text-color);--md-filled-field-error-focus-active-indicator-color: var(--_error-focus-active-indicator-color);--md-filled-field-error-focus-content-color: var(--_error-focus-input-text-color);--md-filled-field-error-focus-label-text-color: var(--_error-focus-label-text-color);--md-filled-field-error-focus-leading-content-color: var(--_error-focus-leading-icon-color);--md-filled-field-error-focus-supporting-text-color: var(--_error-focus-supporting-text-color);--md-filled-field-error-focus-trailing-content-color: var(--_error-focus-trailing-icon-color);--md-filled-field-error-hover-active-indicator-color: var(--_error-hover-active-indicator-color);--md-filled-field-error-hover-content-color: var(--_error-hover-input-text-color);--md-filled-field-error-hover-label-text-color: var(--_error-hover-label-text-color);--md-filled-field-error-hover-leading-content-color: var(--_error-hover-leading-icon-color);--md-filled-field-error-hover-state-layer-color: var(--_error-hover-state-layer-color);--md-filled-field-error-hover-state-layer-opacity: var(--_error-hover-state-layer-opacity);--md-filled-field-error-hover-supporting-text-color: var(--_error-hover-supporting-text-color);--md-filled-field-error-hover-trailing-content-color: var(--_error-hover-trailing-icon-color);--md-filled-field-error-label-text-color: var(--_error-label-text-color);--md-filled-field-error-leading-content-color: var(--_error-leading-icon-color);--md-filled-field-error-supporting-text-color: var(--_error-supporting-text-color);--md-filled-field-error-trailing-content-color: var(--_error-trailing-icon-color);--md-filled-field-focus-active-indicator-color: var(--_focus-active-indicator-color);--md-filled-field-focus-active-indicator-height: var(--_focus-active-indicator-height);--md-filled-field-focus-content-color: var(--_focus-input-text-color);--md-filled-field-focus-label-text-color: var(--_focus-label-text-color);--md-filled-field-focus-leading-content-color: var(--_focus-leading-icon-color);--md-filled-field-focus-supporting-text-color: var(--_focus-supporting-text-color);--md-filled-field-focus-trailing-content-color: var(--_focus-trailing-icon-color);--md-filled-field-hover-active-indicator-color: var(--_hover-active-indicator-color);--md-filled-field-hover-active-indicator-height: var(--_hover-active-indicator-height);--md-filled-field-hover-content-color: var(--_hover-input-text-color);--md-filled-field-hover-label-text-color: var(--_hover-label-text-color);--md-filled-field-hover-leading-content-color: var(--_hover-leading-icon-color);--md-filled-field-hover-state-layer-color: var(--_hover-state-layer-color);--md-filled-field-hover-state-layer-opacity: var(--_hover-state-layer-opacity);--md-filled-field-hover-supporting-text-color: var(--_hover-supporting-text-color);--md-filled-field-hover-trailing-content-color: var(--_hover-trailing-icon-color);--md-filled-field-label-text-color: var(--_label-text-color);--md-filled-field-label-text-font: var(--_label-text-font);--md-filled-field-label-text-line-height: var(--_label-text-line-height);--md-filled-field-label-text-populated-line-height: var(--_label-text-populated-line-height);--md-filled-field-label-text-populated-size: var(--_label-text-populated-size);--md-filled-field-label-text-size: var(--_label-text-size);--md-filled-field-label-text-weight: var(--_label-text-weight);--md-filled-field-leading-content-color: var(--_leading-icon-color);--md-filled-field-leading-space: var(--_leading-space);--md-filled-field-supporting-text-color: var(--_supporting-text-color);--md-filled-field-supporting-text-font: var(--_supporting-text-font);--md-filled-field-supporting-text-line-height: var(--_supporting-text-line-height);--md-filled-field-supporting-text-size: var(--_supporting-text-size);--md-filled-field-supporting-text-weight: var(--_supporting-text-weight);--md-filled-field-top-space: var(--_top-space);--md-filled-field-trailing-content-color: var(--_trailing-icon-color);--md-filled-field-trailing-space: var(--_trailing-space);--md-filled-field-with-label-bottom-space: var(--_with-label-bottom-space);--md-filled-field-with-label-top-space: var(--_with-label-top-space);--md-filled-field-with-leading-content-leading-space: var(--_with-leading-icon-leading-space);--md-filled-field-with-trailing-content-trailing-space: var(--_with-trailing-icon-trailing-space)}
`;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class O extends A{constructor(){super(...arguments),this.disabled=!1,this.error=!1,this.focused=!1,this.label="",this.noAsterisk=!1,this.populated=!1,this.required=!1,this.resizable=!1,this.supportingText="",this.errorText="",this.count=-1,this.max=-1,this.hasStart=!1,this.hasEnd=!1,this.isAnimating=!1,this.refreshErrorAlert=!1,this.disableTransitions=!1}get counterText(){const e=this.count??-1,t=this.max??-1;return e<0||t<=0?"":`${e} / ${t}`}get supportingOrErrorText(){return this.error&&this.errorText?this.errorText:this.supportingText}reannounceError(){this.refreshErrorAlert=!0}update(e){e.has("disabled")&&e.get("disabled")!==void 0&&(this.disableTransitions=!0),this.disabled&&this.focused&&(e.set("focused",!0),this.focused=!1),this.animateLabelIfNeeded({wasFocused:e.get("focused"),wasPopulated:e.get("populated")}),super.update(e)}render(){var s,n,d,h;const e=this.renderLabel(!0),t=this.renderLabel(!1),i=(s=this.renderOutline)==null?void 0:s.call(this,e),o={disabled:this.disabled,"disable-transitions":this.disableTransitions,error:this.error&&!this.disabled,focused:this.focused,"with-start":this.hasStart,"with-end":this.hasEnd,populated:this.populated,resizable:this.resizable,required:this.required,"no-label":!this.label};return c`
      <div class="field ${U(o)}">
        <div class="container-overflow">
          ${(n=this.renderBackground)==null?void 0:n.call(this)}
          <slot name="container"></slot>
          ${(d=this.renderStateLayer)==null?void 0:d.call(this)} ${(h=this.renderIndicator)==null?void 0:h.call(this)} ${i}
          <div class="container">
            <div class="start">
              <slot name="start"></slot>
            </div>
            <div class="middle">
              <div class="label-wrapper">
                ${t} ${i?p:e}
              </div>
              <div class="content">
                <slot></slot>
              </div>
            </div>
            <div class="end">
              <slot name="end"></slot>
            </div>
          </div>
        </div>
        ${this.renderSupportingText()}
      </div>
    `}updated(e){(e.has("supportingText")||e.has("errorText")||e.has("count")||e.has("max"))&&this.updateSlottedAriaDescribedBy(),this.refreshErrorAlert&&requestAnimationFrame(()=>{this.refreshErrorAlert=!1}),this.disableTransitions&&requestAnimationFrame(()=>{this.disableTransitions=!1})}renderSupportingText(){const{supportingOrErrorText:e,counterText:t}=this;if(!e&&!t)return p;const i=c`<span>${e}</span>`,o=t?c`<span class="counter">${t}</span>`:p,n=this.error&&this.errorText&&!this.refreshErrorAlert?"alert":p;return c`
      <div class="supporting-text" role=${n}>${i}${o}</div>
      <slot
        name="aria-describedby"
        @slotchange=${this.updateSlottedAriaDescribedBy}></slot>
    `}updateSlottedAriaDescribedBy(){for(const e of this.slottedAriaDescribedBy)Pt(c`${this.supportingOrErrorText} ${this.counterText}`,e),e.setAttribute("hidden","")}renderLabel(e){if(!this.label)return p;let t;e?t=this.focused||this.populated||this.isAnimating:t=!this.focused&&!this.populated&&!this.isAnimating;const i={hidden:!t,floating:e,resting:!e},o=`${this.label}${this.required&&!this.noAsterisk?"*":""}`;return c`
      <span class="label ${U(i)}" aria-hidden=${!t}
        >${o}</span
      >
    `}animateLabelIfNeeded({wasFocused:e,wasPopulated:t}){var s,n,d;if(!this.label)return;e??(e=this.focused),t??(t=this.populated);const i=e||t,o=this.focused||this.populated;i!==o&&(this.isAnimating=!0,(s=this.labelAnimation)==null||s.cancel(),this.labelAnimation=(n=this.floatingLabelEl)==null?void 0:n.animate(this.getLabelKeyframes(),{duration:150,easing:j.STANDARD}),(d=this.labelAnimation)==null||d.addEventListener("finish",()=>{this.isAnimating=!1}))}getLabelKeyframes(){const{floatingLabelEl:e,restingLabelEl:t}=this;if(!e||!t)return[];const{x:i,y:o,height:s}=e.getBoundingClientRect(),{x:n,y:d,height:h}=t.getBoundingClientRect(),f=e.scrollWidth,v=t.scrollWidth,m=v/f,w=n-i,g=d-o+Math.round((h-s*m)/2),$=`translateX(${w}px) translateY(${g}px) scale(${m})`,x="translateX(0) translateY(0) scale(1)",_=t.clientWidth,u=v>_?`${_/m}px`:"";return this.focused||this.populated?[{transform:$,width:u},{transform:x,width:u}]:[{transform:x,width:u},{transform:$,width:u}]}getSurfacePositionClientRect(){return this.containerEl.getBoundingClientRect()}}a([l({type:Boolean})],O.prototype,"disabled",void 0);a([l({type:Boolean})],O.prototype,"error",void 0);a([l({type:Boolean})],O.prototype,"focused",void 0);a([l()],O.prototype,"label",void 0);a([l({type:Boolean,attribute:"no-asterisk"})],O.prototype,"noAsterisk",void 0);a([l({type:Boolean})],O.prototype,"populated",void 0);a([l({type:Boolean})],O.prototype,"required",void 0);a([l({type:Boolean})],O.prototype,"resizable",void 0);a([l({attribute:"supporting-text"})],O.prototype,"supportingText",void 0);a([l({attribute:"error-text"})],O.prototype,"errorText",void 0);a([l({type:Number})],O.prototype,"count",void 0);a([l({type:Number})],O.prototype,"max",void 0);a([l({type:Boolean,attribute:"has-start"})],O.prototype,"hasStart",void 0);a([l({type:Boolean,attribute:"has-end"})],O.prototype,"hasEnd",void 0);a([ee({slot:"aria-describedby"})],O.prototype,"slottedAriaDescribedBy",void 0);a([y()],O.prototype,"isAnimating",void 0);a([y()],O.prototype,"refreshErrorAlert",void 0);a([y()],O.prototype,"disableTransitions",void 0);a([R(".label.floating")],O.prototype,"floatingLabelEl",void 0);a([R(".label.resting")],O.prototype,"restingLabelEl",void 0);a([R(".container")],O.prototype,"containerEl",void 0);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class gr extends O{renderBackground(){return c` <div class="background"></div> `}renderStateLayer(){return c` <div class="state-layer"></div> `}renderIndicator(){return c`<div class="active-indicator"></div>`}}/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const br=T`@layer styles{:host{--_active-indicator-color: var(--md-filled-field-active-indicator-color, var(--md-sys-color-on-surface-variant, #49454f));--_active-indicator-height: var(--md-filled-field-active-indicator-height, 1px);--_bottom-space: var(--md-filled-field-bottom-space, 16px);--_container-color: var(--md-filled-field-container-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_content-color: var(--md-filled-field-content-color, var(--md-sys-color-on-surface, #1d1b20));--_content-font: var(--md-filled-field-content-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_content-line-height: var(--md-filled-field-content-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_content-size: var(--md-filled-field-content-size, var(--md-sys-typescale-body-large-size, 1rem));--_content-space: var(--md-filled-field-content-space, 16px);--_content-weight: var(--md-filled-field-content-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_disabled-active-indicator-color: var(--md-filled-field-disabled-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-active-indicator-height: var(--md-filled-field-disabled-active-indicator-height, 1px);--_disabled-active-indicator-opacity: var(--md-filled-field-disabled-active-indicator-opacity, 0.38);--_disabled-container-color: var(--md-filled-field-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-opacity: var(--md-filled-field-disabled-container-opacity, 0.04);--_disabled-content-color: var(--md-filled-field-disabled-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-content-opacity: var(--md-filled-field-disabled-content-opacity, 0.38);--_disabled-label-text-color: var(--md-filled-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-filled-field-disabled-label-text-opacity, 0.38);--_disabled-leading-content-color: var(--md-filled-field-disabled-leading-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-content-opacity: var(--md-filled-field-disabled-leading-content-opacity, 0.38);--_disabled-supporting-text-color: var(--md-filled-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-supporting-text-opacity: var(--md-filled-field-disabled-supporting-text-opacity, 0.38);--_disabled-trailing-content-color: var(--md-filled-field-disabled-trailing-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-trailing-content-opacity: var(--md-filled-field-disabled-trailing-content-opacity, 0.38);--_error-active-indicator-color: var(--md-filled-field-error-active-indicator-color, var(--md-sys-color-error, #b3261e));--_error-content-color: var(--md-filled-field-error-content-color, var(--md-sys-color-on-surface, #1d1b20));--_error-focus-active-indicator-color: var(--md-filled-field-error-focus-active-indicator-color, var(--md-sys-color-error, #b3261e));--_error-focus-content-color: var(--md-filled-field-error-focus-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-focus-label-text-color: var(--md-filled-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-leading-content-color: var(--md-filled-field-error-focus-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-focus-supporting-text-color: var(--md-filled-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-trailing-content-color: var(--md-filled-field-error-focus-trailing-content-color, var(--md-sys-color-error, #b3261e));--_error-hover-active-indicator-color: var(--md-filled-field-error-hover-active-indicator-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-content-color: var(--md-filled-field-error-hover-content-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-label-text-color: var(--md-filled-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-leading-content-color: var(--md-filled-field-error-hover-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-hover-state-layer-color: var(--md-filled-field-error-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-state-layer-opacity: var(--md-filled-field-error-hover-state-layer-opacity, 0.08);--_error-hover-supporting-text-color: var(--md-filled-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-hover-trailing-content-color: var(--md-filled-field-error-hover-trailing-content-color, var(--md-sys-color-on-error-container, #410e0b));--_error-label-text-color: var(--md-filled-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_error-leading-content-color: var(--md-filled-field-error-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-supporting-text-color: var(--md-filled-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-trailing-content-color: var(--md-filled-field-error-trailing-content-color, var(--md-sys-color-error, #b3261e));--_focus-active-indicator-color: var(--md-filled-field-focus-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_focus-active-indicator-height: var(--md-filled-field-focus-active-indicator-height, 3px);--_focus-content-color: var(--md-filled-field-focus-content-color, var(--md-sys-color-on-surface, #1d1b20));--_focus-label-text-color: var(--md-filled-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_focus-leading-content-color: var(--md-filled-field-focus-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-supporting-text-color: var(--md-filled-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-trailing-content-color: var(--md-filled-field-focus-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-active-indicator-color: var(--md-filled-field-hover-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-active-indicator-height: var(--md-filled-field-hover-active-indicator-height, 1px);--_hover-content-color: var(--md-filled-field-hover-content-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-label-text-color: var(--md-filled-field-hover-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-leading-content-color: var(--md-filled-field-hover-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-filled-field-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-state-layer-opacity: var(--md-filled-field-hover-state-layer-opacity, 0.08);--_hover-supporting-text-color: var(--md-filled-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-trailing-content-color: var(--md-filled-field-hover-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-color: var(--md-filled-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-font: var(--md-filled-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-filled-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_label-text-populated-line-height: var(--md-filled-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_label-text-populated-size: var(--md-filled-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_label-text-size: var(--md-filled-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_label-text-weight: var(--md-filled-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_leading-content-color: var(--md-filled-field-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_leading-space: var(--md-filled-field-leading-space, 16px);--_supporting-text-color: var(--md-filled-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_supporting-text-font: var(--md-filled-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_supporting-text-leading-space: var(--md-filled-field-supporting-text-leading-space, 16px);--_supporting-text-line-height: var(--md-filled-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_supporting-text-size: var(--md-filled-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_supporting-text-top-space: var(--md-filled-field-supporting-text-top-space, 4px);--_supporting-text-trailing-space: var(--md-filled-field-supporting-text-trailing-space, 16px);--_supporting-text-weight: var(--md-filled-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_top-space: var(--md-filled-field-top-space, 16px);--_trailing-content-color: var(--md-filled-field-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_trailing-space: var(--md-filled-field-trailing-space, 16px);--_with-label-bottom-space: var(--md-filled-field-with-label-bottom-space, 8px);--_with-label-top-space: var(--md-filled-field-with-label-top-space, 8px);--_with-leading-content-leading-space: var(--md-filled-field-with-leading-content-leading-space, 12px);--_with-trailing-content-trailing-space: var(--md-filled-field-with-trailing-content-trailing-space, 12px);--_container-shape-start-start: var(--md-filled-field-container-shape-start-start, var(--md-filled-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-start-end: var(--md-filled-field-container-shape-start-end, var(--md-filled-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-end: var(--md-filled-field-container-shape-end-end, var(--md-filled-field-container-shape, var(--md-sys-shape-corner-none, 0px)));--_container-shape-end-start: var(--md-filled-field-container-shape-end-start, var(--md-filled-field-container-shape, var(--md-sys-shape-corner-none, 0px)))}.background,.state-layer{border-radius:inherit;inset:0;pointer-events:none;position:absolute}.background{background:var(--_container-color)}.state-layer{visibility:hidden}.field:not(.disabled):hover .state-layer{visibility:visible}.label.floating{position:absolute;top:var(--_with-label-top-space)}.field:not(.with-start) .label-wrapper{margin-inline-start:var(--_leading-space)}.field:not(.with-end) .label-wrapper{margin-inline-end:var(--_trailing-space)}.active-indicator{inset:auto 0 0 0;pointer-events:none;position:absolute;width:100%;z-index:1}.active-indicator::before,.active-indicator::after{border-bottom:var(--_active-indicator-height) solid var(--_active-indicator-color);inset:auto 0 0 0;content:"";position:absolute;width:100%}.active-indicator::after{opacity:0;transition:opacity 150ms cubic-bezier(0.2, 0, 0, 1)}.focused .active-indicator::after{opacity:1}.field:not(.with-start) .content ::slotted(*){padding-inline-start:var(--_leading-space)}.field:not(.with-end) .content ::slotted(*){padding-inline-end:var(--_trailing-space)}.field:not(.no-label) .content ::slotted(:not(textarea)){padding-bottom:var(--_with-label-bottom-space);padding-top:calc(var(--_with-label-top-space) + var(--_label-text-populated-line-height))}.field:not(.no-label) .content ::slotted(textarea){margin-bottom:var(--_with-label-bottom-space);margin-top:calc(var(--_with-label-top-space) + var(--_label-text-populated-line-height))}:hover .active-indicator::before{border-bottom-color:var(--_hover-active-indicator-color);border-bottom-width:var(--_hover-active-indicator-height)}.active-indicator::after{border-bottom-color:var(--_focus-active-indicator-color);border-bottom-width:var(--_focus-active-indicator-height)}:hover .state-layer{background:var(--_hover-state-layer-color);opacity:var(--_hover-state-layer-opacity)}.disabled .active-indicator::before{border-bottom-color:var(--_disabled-active-indicator-color);border-bottom-width:var(--_disabled-active-indicator-height);opacity:var(--_disabled-active-indicator-opacity)}.disabled .background{background:var(--_disabled-container-color);opacity:var(--_disabled-container-opacity)}.error .active-indicator::before{border-bottom-color:var(--_error-active-indicator-color)}.error:hover .active-indicator::before{border-bottom-color:var(--_error-hover-active-indicator-color)}.error:hover .state-layer{background:var(--_error-hover-state-layer-color);opacity:var(--_error-hover-state-layer-opacity)}.error .active-indicator::after{border-bottom-color:var(--_error-focus-active-indicator-color)}.resizable .container{bottom:var(--_focus-active-indicator-height);clip-path:inset(var(--_focus-active-indicator-height) 0 0 0)}.resizable .container>*{top:var(--_focus-active-indicator-height)}}@layer hcm{@media(forced-colors: active){.disabled .active-indicator::before{border-color:GrayText;opacity:1}}}
`;/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const yr=T`:host{display:inline-flex;resize:both}.field{display:flex;flex:1;flex-direction:column;writing-mode:horizontal-tb;max-width:100%}.container-overflow{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-end-radius:var(--_container-shape-end-end);border-end-start-radius:var(--_container-shape-end-start);display:flex;height:100%;position:relative}.container{align-items:center;border-radius:inherit;display:flex;flex:1;max-height:100%;min-height:100%;min-width:min-content;position:relative}.field,.container-overflow{resize:inherit}.resizable:not(.disabled) .container{resize:inherit;overflow:hidden}.disabled{pointer-events:none}slot[name=container]{border-radius:inherit}slot[name=container]::slotted(*){border-radius:inherit;inset:0;pointer-events:none;position:absolute}@layer styles{.start,.middle,.end{display:flex;box-sizing:border-box;height:100%;position:relative}.start{color:var(--_leading-content-color)}.end{color:var(--_trailing-content-color)}.start,.end{align-items:center;justify-content:center}.with-start .start{margin-inline:var(--_with-leading-content-leading-space) var(--_content-space)}.with-end .end{margin-inline:var(--_content-space) var(--_with-trailing-content-trailing-space)}.middle{align-items:stretch;align-self:baseline;flex:1}.content{color:var(--_content-color);display:flex;flex:1;opacity:0;transition:opacity 83ms cubic-bezier(0.2, 0, 0, 1)}.no-label .content,.focused .content,.populated .content{opacity:1;transition-delay:67ms}:is(.disabled,.disable-transitions) .content{transition:none}.content ::slotted(*){all:unset;color:currentColor;font-family:var(--_content-font);font-size:var(--_content-size);line-height:var(--_content-line-height);font-weight:var(--_content-weight);width:100%;overflow-wrap:revert;white-space:revert}.content ::slotted(:not(textarea)){padding-top:var(--_top-space);padding-bottom:var(--_bottom-space)}.content ::slotted(textarea){margin-top:var(--_top-space);margin-bottom:var(--_bottom-space)}:hover .content{color:var(--_hover-content-color)}:hover .start{color:var(--_hover-leading-content-color)}:hover .end{color:var(--_hover-trailing-content-color)}.focused .content{color:var(--_focus-content-color)}.focused .start{color:var(--_focus-leading-content-color)}.focused .end{color:var(--_focus-trailing-content-color)}.disabled .content{color:var(--_disabled-content-color)}.disabled.no-label .content,.disabled.focused .content,.disabled.populated .content{opacity:var(--_disabled-content-opacity)}.disabled .start{color:var(--_disabled-leading-content-color);opacity:var(--_disabled-leading-content-opacity)}.disabled .end{color:var(--_disabled-trailing-content-color);opacity:var(--_disabled-trailing-content-opacity)}.error .content{color:var(--_error-content-color)}.error .start{color:var(--_error-leading-content-color)}.error .end{color:var(--_error-trailing-content-color)}.error:hover .content{color:var(--_error-hover-content-color)}.error:hover .start{color:var(--_error-hover-leading-content-color)}.error:hover .end{color:var(--_error-hover-trailing-content-color)}.error.focused .content{color:var(--_error-focus-content-color)}.error.focused .start{color:var(--_error-focus-leading-content-color)}.error.focused .end{color:var(--_error-focus-trailing-content-color)}}@layer hcm{@media(forced-colors: active){.disabled :is(.start,.content,.end){color:GrayText;opacity:1}}}@layer styles{.label{box-sizing:border-box;color:var(--_label-text-color);overflow:hidden;max-width:100%;text-overflow:ellipsis;white-space:nowrap;z-index:1;font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);width:min-content}.label-wrapper{inset:0;pointer-events:none;position:absolute}.label.resting{position:absolute;top:var(--_top-space)}.label.floating{font-size:var(--_label-text-populated-size);line-height:var(--_label-text-populated-line-height);transform-origin:top left}.label.hidden{opacity:0}.no-label .label{display:none}.label-wrapper{inset:0;position:absolute;text-align:initial}:hover .label{color:var(--_hover-label-text-color)}.focused .label{color:var(--_focus-label-text-color)}.disabled .label{color:var(--_disabled-label-text-color)}.disabled .label:not(.hidden){opacity:var(--_disabled-label-text-opacity)}.error .label{color:var(--_error-label-text-color)}.error:hover .label{color:var(--_error-hover-label-text-color)}.error.focused .label{color:var(--_error-focus-label-text-color)}}@layer hcm{@media(forced-colors: active){.disabled .label:not(.hidden){color:GrayText;opacity:1}}}@layer styles{.supporting-text{color:var(--_supporting-text-color);display:flex;font-family:var(--_supporting-text-font);font-size:var(--_supporting-text-size);line-height:var(--_supporting-text-line-height);font-weight:var(--_supporting-text-weight);gap:16px;justify-content:space-between;padding-inline-start:var(--_supporting-text-leading-space);padding-inline-end:var(--_supporting-text-trailing-space);padding-top:var(--_supporting-text-top-space)}.supporting-text :nth-child(2){flex-shrink:0}:hover .supporting-text{color:var(--_hover-supporting-text-color)}.focus .supporting-text{color:var(--_focus-supporting-text-color)}.disabled .supporting-text{color:var(--_disabled-supporting-text-color);opacity:var(--_disabled-supporting-text-opacity)}.error .supporting-text{color:var(--_error-supporting-text-color)}.error:hover .supporting-text{color:var(--_error-hover-supporting-text-color)}.error.focus .supporting-text{color:var(--_error-focus-supporting-text-color)}}@layer hcm{@media(forced-colors: active){.disabled .supporting-text{color:GrayText;opacity:1}}}
`;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let tt=class extends gr{};tt.styles=[yr,br];tt=a([ne("md-filled-field")],tt);/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ct=nt(class extends lt{constructor(r){if(super(r),r.type!==re.PROPERTY&&r.type!==re.ATTRIBUTE&&r.type!==re.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!mi(r))throw Error("`live` bindings can only contain a single expression")}render(r){return r}update(r,[e]){if(e===ce||e===p)return e;const t=r.element,i=r.name;if(r.type===re.PROPERTY){if(e===t[i])return ce}else if(r.type===re.BOOLEAN_ATTRIBUTE){if(!!e===t.hasAttribute(i))return ce}else if(r.type===re.ATTRIBUTE&&t.getAttribute(i)===e+"")return ce;return vi(r),e}});/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const oi="important",xr=" !"+oi,Le=nt(class extends lt{constructor(r){var e;if(super(r),r.type!==re.ATTRIBUTE||r.name!=="style"||((e=r.strings)==null?void 0:e.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(r){return Object.keys(r).reduce((e,t)=>{const i=r[t];return i==null?e:e+`${t=t.includes("-")?t:t.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${i};`},"")}update(r,[e]){const{style:t}=r.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(e)),this.render(e);for(const i of this.ft)e[i]==null&&(this.ft.delete(i),i.includes("-")?t.removeProperty(i):t[i]=null);for(const i in e){const o=e[i];if(o!=null){this.ft.add(i);const s=typeof o=="string"&&o.endsWith(xr);i.includes("-")||s?t.setProperty(i,s?o.slice(0,-11):o,s?oi:""):t[i]=o}}return ce}});/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const _r={fromAttribute(r){return r??""},toAttribute(r){return r||null}};/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const De=Symbol("onReportValidity"),Te=Symbol("privateCleanupFormListeners"),Se=Symbol("privateDoNotReportInvalid"),Ae=Symbol("privateIsSelfReportingValidity"),Re=Symbol("privateCallOnReportValidity");function si(r){var e,t,i;class o extends r{constructor(...n){super(...n),this[e]=new AbortController,this[t]=!1,this[i]=!1,this.addEventListener("invalid",d=>{this[Se]||!d.isTrusted||this.addEventListener("invalid",()=>{this[Re](d)},{once:!0})},{capture:!0})}checkValidity(){this[Se]=!0;const n=super.checkValidity();return this[Se]=!1,n}reportValidity(){this[Ae]=!0;const n=super.reportValidity();return n&&this[Re](null),this[Ae]=!1,n}[(e=Te,t=Se,i=Ae,Re)](n){const d=n==null?void 0:n.defaultPrevented;d||(this[De](n),!(!d&&(n==null?void 0:n.defaultPrevented)))||(this[Ae]||Er(this[N].form,this))&&this.focus()}[De](n){throw new Error("Implement [onReportValidity]")}formAssociatedCallback(n){super.formAssociatedCallback&&super.formAssociatedCallback(n),this[Te].abort(),n&&(this[Te]=new AbortController,wr(this,n,()=>{this[Re](null)},this[Te].signal))}}return o}function wr(r,e,t,i){const o=Cr(e);let s=!1,n,d=!1;o.addEventListener("before",()=>{d=!0,n=new AbortController,s=!1,r.addEventListener("invalid",()=>{s=!0},{signal:n.signal})},{signal:i}),o.addEventListener("after",()=>{d=!1,n==null||n.abort(),!s&&t()},{signal:i}),e.addEventListener("submit",()=>{d||t()},{signal:i})}const We=new WeakMap;function Cr(r){if(!We.has(r)){const e=new EventTarget;We.set(r,e);for(const t of["reportValidity","requestSubmit"]){const i=r[t];r[t]=function(){e.dispatchEvent(new Event("before"));const o=Reflect.apply(i,this,arguments);return e.dispatchEvent(new Event("after")),o}}}return We.get(r)}function Er(r,e){if(!r)return!0;let t;for(const i of r.elements)if(i.matches(":invalid")){t=i;break}return t===e}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class kr extends ft{computeValidity({state:e,renderedControl:t}){let i=t;fe(e)&&!i?(i=this.inputControl||document.createElement("input"),this.inputControl=i):i||(i=this.textAreaControl||document.createElement("textarea"),this.textAreaControl=i);const o=fe(e)?i:null;if(o&&(o.type=e.type),i.value!==e.value&&(i.value=e.value),i.required=e.required,o){const s=e;s.pattern?o.pattern=s.pattern:o.removeAttribute("pattern"),s.min?o.min=s.min:o.removeAttribute("min"),s.max?o.max=s.max:o.removeAttribute("max"),s.step?o.step=s.step:o.removeAttribute("step")}return(e.minLength??-1)>-1?i.setAttribute("minlength",String(e.minLength)):i.removeAttribute("minlength"),(e.maxLength??-1)>-1?i.setAttribute("maxlength",String(e.maxLength)):i.removeAttribute("maxlength"),{validity:i.validity,validationMessage:i.validationMessage}}equals({state:e},{state:t}){const i=e.type===t.type&&e.value===t.value&&e.required===t.required&&e.minLength===t.minLength&&e.maxLength===t.maxLength;return!fe(e)||!fe(t)?i:i&&e.pattern===t.pattern&&e.min===t.min&&e.max===t.max&&e.step===t.step}copy({state:e}){return{state:fe(e)?this.copyInput(e):this.copyTextArea(e),renderedControl:null}}copyInput(e){const{type:t,pattern:i,min:o,max:s,step:n}=e;return{...this.copySharedState(e),type:t,pattern:i,min:o,max:s,step:n}}copyTextArea(e){return{...this.copySharedState(e),type:e.type}}copySharedState({value:e,required:t,minLength:i,maxLength:o}){return{value:e,required:t,minLength:i,maxLength:o}}}function fe(r){return r.type!=="textarea"}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ir=te(si(pt(ut(xe(A)))));class b extends Ir{constructor(){super(...arguments),this.error=!1,this.errorText="",this.label="",this.noAsterisk=!1,this.required=!1,this.value="",this.prefixText="",this.suffixText="",this.hasLeadingIcon=!1,this.hasTrailingIcon=!1,this.supportingText="",this.textDirection="",this.rows=2,this.cols=20,this.inputMode="",this.max="",this.maxLength=-1,this.min="",this.minLength=-1,this.noSpinner=!1,this.pattern="",this.placeholder="",this.readOnly=!1,this.multiple=!1,this.step="",this.type="text",this.autocomplete="",this.dirty=!1,this.focused=!1,this.nativeError=!1,this.nativeErrorText=""}get selectionDirection(){return this.getInputOrTextarea().selectionDirection}set selectionDirection(e){this.getInputOrTextarea().selectionDirection=e}get selectionEnd(){return this.getInputOrTextarea().selectionEnd}set selectionEnd(e){this.getInputOrTextarea().selectionEnd=e}get selectionStart(){return this.getInputOrTextarea().selectionStart}set selectionStart(e){this.getInputOrTextarea().selectionStart=e}get valueAsNumber(){const e=this.getInput();return e?e.valueAsNumber:NaN}set valueAsNumber(e){const t=this.getInput();t&&(t.valueAsNumber=e,this.value=t.value)}get valueAsDate(){const e=this.getInput();return e?e.valueAsDate:null}set valueAsDate(e){const t=this.getInput();t&&(t.valueAsDate=e,this.value=t.value)}get hasError(){return this.error||this.nativeError}select(){this.getInputOrTextarea().select()}setRangeText(...e){this.getInputOrTextarea().setRangeText(...e),this.value=this.getInputOrTextarea().value}setSelectionRange(e,t,i){this.getInputOrTextarea().setSelectionRange(e,t,i)}showPicker(){const e=this.getInput();e&&e.showPicker()}stepDown(e){const t=this.getInput();t&&(t.stepDown(e),this.value=t.value)}stepUp(e){const t=this.getInput();t&&(t.stepUp(e),this.value=t.value)}reset(){this.dirty=!1,this.value=this.getAttribute("value")??"",this.nativeError=!1,this.nativeErrorText=""}attributeChangedCallback(e,t,i){e==="value"&&this.dirty||super.attributeChangedCallback(e,t,i)}render(){const e={disabled:this.disabled,error:!this.disabled&&this.hasError,textarea:this.type==="textarea","no-spinner":this.noSpinner};return c`
      <span class="text-field ${U(e)}">
        ${this.renderField()}
      </span>
    `}updated(e){const t=this.getInputOrTextarea().value;this.value!==t&&(this.value=t)}renderField(){return Pe`<${this.fieldTag}
      class="field"
      count=${this.value.length}
      ?disabled=${this.disabled}
      ?error=${this.hasError}
      error-text=${this.getErrorText()}
      ?focused=${this.focused}
      ?has-end=${this.hasTrailingIcon}
      ?has-start=${this.hasLeadingIcon}
      label=${this.label}
      ?no-asterisk=${this.noAsterisk}
      max=${this.maxLength}
      ?populated=${!!this.value}
      ?required=${this.required}
      ?resizable=${this.type==="textarea"}
      supporting-text=${this.supportingText}
    >
      ${this.renderLeadingIcon()}
      ${this.renderInputOrTextarea()}
      ${this.renderTrailingIcon()}
      <div id="description" slot="aria-describedby"></div>
      <slot name="container" slot="container"></slot>
    </${this.fieldTag}>`}renderLeadingIcon(){return c`
      <span class="icon leading" slot="start">
        <slot name="leading-icon" @slotchange=${this.handleIconChange}></slot>
      </span>
    `}renderTrailingIcon(){return c`
      <span class="icon trailing" slot="end">
        <slot name="trailing-icon" @slotchange=${this.handleIconChange}></slot>
      </span>
    `}renderInputOrTextarea(){const e={direction:this.textDirection},t=this.ariaLabel||this.label||p,i=this.autocomplete,o=(this.maxLength??-1)>-1,s=(this.minLength??-1)>-1;if(this.type==="textarea")return c`
        <textarea
          class="input"
          style=${Le(e)}
          aria-describedby="description"
          aria-invalid=${this.hasError}
          aria-label=${t}
          autocomplete=${i||p}
          name=${this.name||p}
          ?disabled=${this.disabled}
          maxlength=${o?this.maxLength:p}
          minlength=${s?this.minLength:p}
          placeholder=${this.placeholder||p}
          ?readonly=${this.readOnly}
          ?required=${this.required}
          rows=${this.rows}
          cols=${this.cols}
          .value=${Ct(this.value)}
          @change=${this.redispatchEvent}
          @focus=${this.handleFocusChange}
          @blur=${this.handleFocusChange}
          @input=${this.handleInput}
          @select=${this.redispatchEvent}></textarea>
      `;const n=this.renderPrefix(),d=this.renderSuffix(),h=this.inputMode;return c`
      <div class="input-wrapper">
        ${n}
        <input
          class="input"
          style=${Le(e)}
          aria-describedby="description"
          aria-invalid=${this.hasError}
          aria-label=${t}
          autocomplete=${i||p}
          name=${this.name||p}
          ?disabled=${this.disabled}
          inputmode=${h||p}
          max=${this.max||p}
          maxlength=${o?this.maxLength:p}
          min=${this.min||p}
          minlength=${s?this.minLength:p}
          pattern=${this.pattern||p}
          placeholder=${this.placeholder||p}
          ?readonly=${this.readOnly}
          ?required=${this.required}
          ?multiple=${this.multiple}
          step=${this.step||p}
          type=${this.type}
          .value=${Ct(this.value)}
          @change=${this.redispatchEvent}
          @focus=${this.handleFocusChange}
          @blur=${this.handleFocusChange}
          @input=${this.handleInput}
          @select=${this.redispatchEvent} />
        ${d}
      </div>
    `}renderPrefix(){return this.renderAffix(this.prefixText,!1)}renderSuffix(){return this.renderAffix(this.suffixText,!0)}renderAffix(e,t){return e?c`<span class="${U({suffix:t,prefix:!t})}">${e}</span>`:p}getErrorText(){return this.error?this.errorText:this.nativeErrorText}handleFocusChange(){var e;this.focused=((e=this.inputOrTextarea)==null?void 0:e.matches(":focus"))??!1}handleInput(e){this.dirty=!0,this.value=e.target.value}redispatchEvent(e){ze(this,e)}getInputOrTextarea(){return this.inputOrTextarea||(this.connectedCallback(),this.scheduleUpdate()),this.isUpdatePending&&this.scheduleUpdate(),this.inputOrTextarea}getInput(){return this.type==="textarea"?null:this.getInputOrTextarea()}handleIconChange(){this.hasLeadingIcon=this.leadingIcons.length>0,this.hasTrailingIcon=this.trailingIcons.length>0}[pe](){return this.value}formResetCallback(){this.reset()}formStateRestoreCallback(e){this.value=e}focus(){this.getInputOrTextarea().focus()}[ge](){return new kr(()=>({state:this,renderedControl:this.inputOrTextarea}))}[be](){return this.inputOrTextarea}[De](e){var i;e==null||e.preventDefault();const t=this.getErrorText();this.nativeError=!!e,this.nativeErrorText=this.validationMessage,t===this.getErrorText()&&((i=this.field)==null||i.reannounceError())}}b.shadowRootOptions={...A.shadowRootOptions,delegatesFocus:!0};a([l({type:Boolean,reflect:!0})],b.prototype,"error",void 0);a([l({attribute:"error-text"})],b.prototype,"errorText",void 0);a([l()],b.prototype,"label",void 0);a([l({type:Boolean,attribute:"no-asterisk"})],b.prototype,"noAsterisk",void 0);a([l({type:Boolean,reflect:!0})],b.prototype,"required",void 0);a([l()],b.prototype,"value",void 0);a([l({attribute:"prefix-text"})],b.prototype,"prefixText",void 0);a([l({attribute:"suffix-text"})],b.prototype,"suffixText",void 0);a([l({type:Boolean,attribute:"has-leading-icon"})],b.prototype,"hasLeadingIcon",void 0);a([l({type:Boolean,attribute:"has-trailing-icon"})],b.prototype,"hasTrailingIcon",void 0);a([l({attribute:"supporting-text"})],b.prototype,"supportingText",void 0);a([l({attribute:"text-direction"})],b.prototype,"textDirection",void 0);a([l({type:Number})],b.prototype,"rows",void 0);a([l({type:Number})],b.prototype,"cols",void 0);a([l({reflect:!0})],b.prototype,"inputMode",void 0);a([l()],b.prototype,"max",void 0);a([l({type:Number})],b.prototype,"maxLength",void 0);a([l()],b.prototype,"min",void 0);a([l({type:Number})],b.prototype,"minLength",void 0);a([l({type:Boolean,attribute:"no-spinner"})],b.prototype,"noSpinner",void 0);a([l()],b.prototype,"pattern",void 0);a([l({reflect:!0,converter:_r})],b.prototype,"placeholder",void 0);a([l({type:Boolean,reflect:!0})],b.prototype,"readOnly",void 0);a([l({type:Boolean,reflect:!0})],b.prototype,"multiple",void 0);a([l()],b.prototype,"step",void 0);a([l({reflect:!0})],b.prototype,"type",void 0);a([l({reflect:!0})],b.prototype,"autocomplete",void 0);a([y()],b.prototype,"dirty",void 0);a([y()],b.prototype,"focused",void 0);a([y()],b.prototype,"nativeError",void 0);a([y()],b.prototype,"nativeErrorText",void 0);a([R(".input")],b.prototype,"inputOrTextarea",void 0);a([R(".field")],b.prototype,"field",void 0);a([ee({slot:"leading-icon"})],b.prototype,"leadingIcons",void 0);a([ee({slot:"trailing-icon"})],b.prototype,"trailingIcons",void 0);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Tr extends b{constructor(){super(...arguments),this.fieldTag=oe`md-filled-field`}}/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Sr=T`:host{display:inline-flex;outline:none;resize:both;text-align:start;-webkit-tap-highlight-color:rgba(0,0,0,0)}.text-field,.field{width:100%}.text-field{display:inline-flex}.field{cursor:text}.disabled .field{cursor:default}.text-field,.textarea .field{resize:inherit}slot[name=container]{border-radius:inherit}.icon{color:currentColor;display:flex;align-items:center;justify-content:center;fill:currentColor;position:relative}.icon ::slotted(*){display:flex;position:absolute}[has-start] .icon.leading{font-size:var(--_leading-icon-size);height:var(--_leading-icon-size);width:var(--_leading-icon-size)}[has-end] .icon.trailing{font-size:var(--_trailing-icon-size);height:var(--_trailing-icon-size);width:var(--_trailing-icon-size)}.input-wrapper{display:flex}.input-wrapper>*{all:inherit;padding:0}.input{caret-color:var(--_caret-color);overflow-x:hidden;text-align:inherit}.input::placeholder{color:currentColor;opacity:1}.input::-webkit-calendar-picker-indicator{display:none}.input::-webkit-search-decoration,.input::-webkit-search-cancel-button{display:none}@media(forced-colors: active){.input{background:none}}.no-spinner .input::-webkit-inner-spin-button,.no-spinner .input::-webkit-outer-spin-button{display:none}.no-spinner .input[type=number]{-moz-appearance:textfield}:focus-within .input{caret-color:var(--_focus-caret-color)}.error:focus-within .input{caret-color:var(--_error-focus-caret-color)}.text-field:not(.disabled) .prefix{color:var(--_input-text-prefix-color)}.text-field:not(.disabled) .suffix{color:var(--_input-text-suffix-color)}.text-field:not(.disabled) .input::placeholder{color:var(--_input-text-placeholder-color)}.prefix,.suffix{text-wrap:nowrap;width:min-content}.prefix{padding-inline-end:var(--_input-text-prefix-trailing-space)}.suffix{padding-inline-start:var(--_input-text-suffix-leading-space)}
`;class ai extends Tr{constructor(){super(...arguments),this.fieldTag=oe`md-filled-field`}}ai.styles=[Sr,vr];customElements.define("ew-filled-text-field",ai);/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Ar extends A{connectedCallback(){super.connectedCallback(),this.setAttribute("aria-hidden","true")}render(){return c`<span class="shadow"></span>`}}/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Rr=T`:host,.shadow,.shadow::before,.shadow::after{border-radius:inherit;inset:0;position:absolute;transition-duration:inherit;transition-property:inherit;transition-timing-function:inherit}:host{display:flex;pointer-events:none;transition-property:box-shadow,opacity}.shadow::before,.shadow::after{content:"";transition-property:box-shadow,opacity;--_level: var(--md-elevation-level, 0);--_shadow-color: var(--md-elevation-shadow-color, var(--md-sys-color-shadow, #000))}.shadow::before{box-shadow:0px calc(1px*(clamp(0,var(--_level),1) + clamp(0,var(--_level) - 3,1) + 2*clamp(0,var(--_level) - 4,1))) calc(1px*(2*clamp(0,var(--_level),1) + clamp(0,var(--_level) - 2,1) + clamp(0,var(--_level) - 4,1))) 0px var(--_shadow-color);opacity:.3}.shadow::after{box-shadow:0px calc(1px*(clamp(0,var(--_level),1) + clamp(0,var(--_level) - 1,1) + 2*clamp(0,var(--_level) - 2,3))) calc(1px*(3*clamp(0,var(--_level),2) + 2*clamp(0,var(--_level) - 2,3))) calc(1px*(clamp(0,var(--_level),4) + 2*clamp(0,var(--_level) - 4,1))) var(--_shadow-color);opacity:.15}
`;/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let it=class extends Ar{};it.styles=[Rr];it=a([ne("md-elevation")],it);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function $r(r,e){return new CustomEvent("close-menu",{bubbles:!0,composed:!0,detail:{initiator:r,reason:e,itemPath:[r]}})}const Et=$r,rt={SPACE:"Space",ENTER:"Enter"},kt={CLICK_SELECTION:"click-selection",KEYDOWN:"keydown"},Or={ESCAPE:"Escape",SPACE:rt.SPACE,ENTER:rt.ENTER};function ni(r){return Object.values(Or).some(e=>e===r)}function Lr(r){return Object.values(rt).some(e=>e===r)}function ot(r,e){const t=new Event("md-contains",{bubbles:!0,composed:!0});let i=[];const o=n=>{i=n.composedPath()};return e.addEventListener("md-contains",o),r.dispatchEvent(t),e.removeEventListener("md-contains",o),i.length>0}const G={NONE:"none",LIST_ROOT:"list-root",FIRST_ITEM:"first-item",LAST_ITEM:"last-item"};/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const It={END_START:"end-start",START_START:"start-start"};class Dr{constructor(e,t){this.host=e,this.getProperties=t,this.surfaceStylesInternal={display:"none"},this.lastValues={isOpen:!1},this.host.addController(this)}get surfaceStyles(){return this.surfaceStylesInternal}async position(){const{surfaceEl:e,anchorEl:t,anchorCorner:i,surfaceCorner:o,positioning:s,xOffset:n,yOffset:d,disableBlockFlip:h,disableInlineFlip:f,repositionStrategy:v}=this.getProperties(),m=i.toLowerCase().trim(),w=o.toLowerCase().trim();if(!e||!t)return;const g=window.innerWidth,$=window.innerHeight,x=document.createElement("div");x.style.opacity="0",x.style.position="fixed",x.style.display="block",x.style.inset="0",document.body.appendChild(x);const _=x.getBoundingClientRect();x.remove();const k=window.innerHeight-_.bottom,u=window.innerWidth-_.right;this.surfaceStylesInternal={display:"block",opacity:"0"},this.host.requestUpdate(),await this.host.updateComplete,e.popover&&e.isConnected&&e.showPopover();const C=e.getSurfacePositionClientRect?e.getSurfacePositionClientRect():e.getBoundingClientRect(),E=t.getSurfacePositionClientRect?t.getSurfacePositionClientRect():t.getBoundingClientRect(),[I,q]=w.split("-"),[Y,ae]=m.split("-"),Ce=getComputedStyle(e).direction==="ltr";let{blockInset:le,blockOutOfBoundsCorrection:Z,surfaceBlockProperty:mt}=this.calculateBlock({surfaceRect:C,anchorRect:E,anchorBlock:Y,surfaceBlock:I,yOffset:d,positioning:s,windowInnerHeight:$,blockScrollbarHeight:k});if(Z&&!h){const Be=I==="start"?"end":"start",Me=Y==="start"?"end":"start",J=this.calculateBlock({surfaceRect:C,anchorRect:E,anchorBlock:Me,surfaceBlock:Be,yOffset:d,positioning:s,windowInnerHeight:$,blockScrollbarHeight:k});Z>J.blockOutOfBoundsCorrection&&(le=J.blockInset,Z=J.blockOutOfBoundsCorrection,mt=J.surfaceBlockProperty)}let{inlineInset:Ee,inlineOutOfBoundsCorrection:de,surfaceInlineProperty:vt}=this.calculateInline({surfaceRect:C,anchorRect:E,anchorInline:ae,surfaceInline:q,xOffset:n,positioning:s,isLTR:Ce,windowInnerWidth:g,inlineScrollbarWidth:u});if(de&&!f){const Be=q==="start"?"end":"start",Me=ae==="start"?"end":"start",J=this.calculateInline({surfaceRect:C,anchorRect:E,anchorInline:Me,surfaceInline:Be,xOffset:n,positioning:s,isLTR:Ce,windowInnerWidth:g,inlineScrollbarWidth:u});Math.abs(de)>Math.abs(J.inlineOutOfBoundsCorrection)&&(Ee=J.inlineInset,de=J.inlineOutOfBoundsCorrection,vt=J.surfaceInlineProperty)}v==="move"&&(le=le-Z,Ee=Ee-de),this.surfaceStylesInternal={display:"block",opacity:"1",[mt]:`${le}px`,[vt]:`${Ee}px`},v==="resize"&&(Z&&(this.surfaceStylesInternal.height=`${C.height-Z}px`),de&&(this.surfaceStylesInternal.width=`${C.width-de}px`)),this.host.requestUpdate()}calculateBlock(e){const{surfaceRect:t,anchorRect:i,anchorBlock:o,surfaceBlock:s,yOffset:n,positioning:d,windowInnerHeight:h,blockScrollbarHeight:f}=e,v=d==="fixed"||d==="document"?1:0,m=d==="document"?1:0,w=s==="start"?1:0,g=s==="end"?1:0,x=(o!==s?1:0)*i.height+n,_=w*i.top+g*(h-i.bottom-f),k=w*window.scrollY-g*window.scrollY,u=Math.abs(Math.min(0,h-_-x-t.height));return{blockInset:v*_+m*k+x,blockOutOfBoundsCorrection:u,surfaceBlockProperty:s==="start"?"inset-block-start":"inset-block-end"}}calculateInline(e){const{isLTR:t,surfaceInline:i,anchorInline:o,anchorRect:s,surfaceRect:n,xOffset:d,positioning:h,windowInnerWidth:f,inlineScrollbarWidth:v}=e,m=h==="fixed"||h==="document"?1:0,w=h==="document"?1:0,g=t?1:0,$=t?0:1,x=i==="start"?1:0,_=i==="end"?1:0,u=(o!==i?1:0)*s.width+d,C=x*s.left+_*(f-s.right-v),E=x*(f-s.right-v)+_*s.left,I=g*C+$*E,q=x*window.scrollX-_*window.scrollX,Y=_*window.scrollX-x*window.scrollX,ae=g*q+$*Y,Ce=Math.abs(Math.min(0,f-I-u-n.width)),le=m*I+u+w*ae;let Z=i==="start"?"inset-inline-start":"inset-inline-end";return(h==="document"||h==="fixed")&&(i==="start"&&t||i==="end"&&!t?Z="left":Z="right"),{inlineInset:le,inlineOutOfBoundsCorrection:Ce,surfaceInlineProperty:Z}}hostUpdate(){this.onUpdate()}hostUpdated(){this.onUpdate()}async onUpdate(){const e=this.getProperties();let t=!1;for(const[n,d]of Object.entries(e))if(t=t||d!==this.lastValues[n],t)break;const i=this.lastValues.isOpen!==e.isOpen,o=!!e.anchorEl,s=!!e.surfaceEl;t&&o&&s&&(this.lastValues.isOpen=e.isOpen,e.isOpen?(this.lastValues=e,await this.position(),e.onOpen()):i&&(await e.beforeClose(),this.close(),e.onClose()))}close(){this.surfaceStylesInternal={display:"none"},this.host.requestUpdate();const e=this.getProperties().surfaceEl;e!=null&&e.popover&&(e!=null&&e.isConnected)&&e.hidePopover()}}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const V={INDEX:0,ITEM:1,TEXT:2};class Pr{constructor(e){this.getProperties=e,this.typeaheadRecords=[],this.typaheadBuffer="",this.cancelTypeaheadTimeout=0,this.isTypingAhead=!1,this.lastActiveRecord=null,this.onKeydown=t=>{this.isTypingAhead?this.typeahead(t):this.beginTypeahead(t)},this.endTypeahead=()=>{this.isTypingAhead=!1,this.typaheadBuffer="",this.typeaheadRecords=[]}}get items(){return this.getProperties().getItems()}get active(){return this.getProperties().active}beginTypeahead(e){this.active&&(e.code==="Space"||e.code==="Enter"||e.code.startsWith("Arrow")||e.code==="Escape"||(this.isTypingAhead=!0,this.typeaheadRecords=this.items.map((t,i)=>[i,t,t.typeaheadText.trim().toLowerCase()]),this.lastActiveRecord=this.typeaheadRecords.find(t=>t[V.ITEM].tabIndex===0)??null,this.lastActiveRecord&&(this.lastActiveRecord[V.ITEM].tabIndex=-1),this.typeahead(e)))}typeahead(e){if(e.defaultPrevented)return;if(clearTimeout(this.cancelTypeaheadTimeout),e.code==="Enter"||e.code.startsWith("Arrow")||e.code==="Escape"){this.endTypeahead(),this.lastActiveRecord&&(this.lastActiveRecord[V.ITEM].tabIndex=-1);return}e.code==="Space"&&e.preventDefault(),this.cancelTypeaheadTimeout=setTimeout(this.endTypeahead,this.getProperties().typeaheadBufferTime),this.typaheadBuffer+=e.key.toLowerCase();const t=this.lastActiveRecord?this.lastActiveRecord[V.INDEX]:-1,i=this.typeaheadRecords.length,o=h=>(h[V.INDEX]+i-t)%i,s=this.typeaheadRecords.filter(h=>!h[V.ITEM].disabled&&h[V.TEXT].startsWith(this.typaheadBuffer)).sort((h,f)=>o(h)-o(f));if(s.length===0){clearTimeout(this.cancelTypeaheadTimeout),this.lastActiveRecord&&(this.lastActiveRecord[V.ITEM].tabIndex=-1),this.endTypeahead();return}const n=this.typaheadBuffer.length===1;let d;this.lastActiveRecord===s[0]&&n?d=s[1]??s[0]:d=s[0],this.lastActiveRecord&&(this.lastActiveRecord[V.ITEM].tabIndex=-1),this.lastActiveRecord=d,d[V.ITEM].tabIndex=0,d[V.ITEM].focus()}}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const li=200,di=new Set([P.ArrowDown,P.ArrowUp,P.Home,P.End]),zr=new Set([P.ArrowLeft,P.ArrowRight,...di]);function Fr(r=document){var t;let e=r.activeElement;for(;e&&((t=e==null?void 0:e.shadowRoot)!=null&&t.activeElement);)e=e.shadowRoot.activeElement;return e}class L extends A{get openDirection(){return this.menuCorner.split("-")[0]==="start"?"DOWN":"UP"}get anchorElement(){return this.anchor?this.getRootNode().querySelector(`#${this.anchor}`):this.currentAnchorElement}set anchorElement(e){this.currentAnchorElement=e,this.requestUpdate("anchorElement")}constructor(){super(),this.anchor="",this.positioning="absolute",this.quick=!1,this.hasOverflow=!1,this.open=!1,this.xOffset=0,this.yOffset=0,this.noHorizontalFlip=!1,this.noVerticalFlip=!1,this.typeaheadDelay=li,this.anchorCorner=It.END_START,this.menuCorner=It.START_START,this.stayOpenOnOutsideClick=!1,this.stayOpenOnFocusout=!1,this.skipRestoreFocus=!1,this.defaultFocus=G.FIRST_ITEM,this.noNavigationWrap=!1,this.typeaheadActive=!0,this.isSubmenu=!1,this.pointerPath=[],this.isRepositioning=!1,this.openCloseAnimationSignal=ki(),this.listController=new Yt({isItem:e=>e.hasAttribute("md-menu-item"),getPossibleItems:()=>this.slotItems,isRtl:()=>getComputedStyle(this).direction==="rtl",deactivateItem:e=>{e.selected=!1,e.tabIndex=-1},activateItem:e=>{e.selected=!0,e.tabIndex=0},isNavigableKey:e=>{if(!this.isSubmenu)return zr.has(e);const i=getComputedStyle(this).direction==="rtl"?P.ArrowLeft:P.ArrowRight;return e===i?!0:di.has(e)},wrapNavigation:()=>!this.noNavigationWrap}),this.lastFocusedElement=null,this.typeaheadController=new Pr(()=>({getItems:()=>this.items,typeaheadBufferTime:this.typeaheadDelay,active:this.typeaheadActive})),this.currentAnchorElement=null,this.internals=this.attachInternals(),this.menuPositionController=new Dr(this,()=>({anchorCorner:this.anchorCorner,surfaceCorner:this.menuCorner,surfaceEl:this.surfaceEl,anchorEl:this.anchorElement,positioning:this.positioning==="popover"?"document":this.positioning,isOpen:this.open,xOffset:this.xOffset,yOffset:this.yOffset,disableBlockFlip:this.noVerticalFlip,disableInlineFlip:this.noHorizontalFlip,onOpen:this.onOpened,beforeClose:this.beforeClose,onClose:this.onClosed,repositionStrategy:this.hasOverflow&&this.positioning!=="popover"?"move":"resize"})),this.onWindowResize=()=>{this.isRepositioning||this.positioning!=="document"&&this.positioning!=="fixed"&&this.positioning!=="popover"||(this.isRepositioning=!0,this.reposition(),this.isRepositioning=!1)},this.handleFocusout=async e=>{const t=this.anchorElement;if(this.stayOpenOnFocusout||!this.open||this.pointerPath.includes(t))return;if(e.relatedTarget){if(ot(e.relatedTarget,this)||this.pointerPath.length!==0&&ot(e.relatedTarget,t))return}else if(this.pointerPath.includes(this))return;const i=this.skipRestoreFocus;this.skipRestoreFocus=!0,this.close(),await this.updateComplete,this.skipRestoreFocus=i},this.onOpened=async()=>{this.lastFocusedElement=Fr();const e=this.items,t=ve(e);t&&this.defaultFocus!==G.NONE&&(t.item.tabIndex=-1);let i=!this.quick;switch(this.quick?this.dispatchEvent(new Event("opening")):i=!!await this.animateOpen(),this.defaultFocus){case G.FIRST_ITEM:const o=ct(e);o&&(o.tabIndex=0,o.focus(),await o.updateComplete);break;case G.LAST_ITEM:const s=Gt(e);s&&(s.tabIndex=0,s.focus(),await s.updateComplete);break;case G.LIST_ROOT:this.focus();break;default:case G.NONE:break}i||this.dispatchEvent(new Event("opened"))},this.beforeClose=async()=>{var e,t;this.open=!1,this.skipRestoreFocus||(t=(e=this.lastFocusedElement)==null?void 0:e.focus)==null||t.call(e),this.quick||await this.animateClose()},this.onClosed=()=>{this.quick&&(this.dispatchEvent(new Event("closing")),this.dispatchEvent(new Event("closed")))},this.onWindowPointerdown=e=>{this.pointerPath=e.composedPath()},this.onDocumentClick=e=>{if(!this.open)return;const t=e.composedPath();!this.stayOpenOnOutsideClick&&!t.includes(this)&&!t.includes(this.anchorElement)&&(this.open=!1)},this.internals.role="menu",this.addEventListener("keydown",this.handleKeydown),this.addEventListener("keydown",this.captureKeydown,{capture:!0}),this.addEventListener("focusout",this.handleFocusout)}get items(){return this.listController.items}willUpdate(e){if(e.has("open")){if(this.open){this.removeAttribute("aria-hidden");return}this.setAttribute("aria-hidden","true")}}update(e){e.has("open")&&(this.open?this.setUpGlobalEventListeners():this.cleanUpGlobalEventListeners()),e.has("positioning")&&this.positioning==="popover"&&!this.showPopover&&(this.positioning="fixed"),super.update(e)}connectedCallback(){super.connectedCallback(),this.open&&this.setUpGlobalEventListeners()}disconnectedCallback(){super.disconnectedCallback(),this.cleanUpGlobalEventListeners()}getBoundingClientRect(){return this.surfaceEl?this.surfaceEl.getBoundingClientRect():super.getBoundingClientRect()}getClientRects(){return this.surfaceEl?this.surfaceEl.getClientRects():super.getClientRects()}render(){return this.renderSurface()}renderSurface(){return c`
      <div
        class="menu ${U(this.getSurfaceClasses())}"
        style=${Le(this.menuPositionController.surfaceStyles)}
        popover=${this.positioning==="popover"?"manual":p}>
        ${this.renderElevation()}
        <div class="items">
          <div class="item-padding"> ${this.renderMenuItems()} </div>
        </div>
      </div>
    `}renderMenuItems(){return c`<slot
      @close-menu=${this.onCloseMenu}
      @deactivate-items=${this.onDeactivateItems}
      @request-activation=${this.onRequestActivation}
      @deactivate-typeahead=${this.handleDeactivateTypeahead}
      @activate-typeahead=${this.handleActivateTypeahead}
      @stay-open-on-focusout=${this.handleStayOpenOnFocusout}
      @close-on-focusout=${this.handleCloseOnFocusout}
      @slotchange=${this.listController.onSlotchange}></slot>`}renderElevation(){return c`<md-elevation part="elevation"></md-elevation>`}getSurfaceClasses(){return{open:this.open,fixed:this.positioning==="fixed","has-overflow":this.hasOverflow}}captureKeydown(e){e.target===this&&!e.defaultPrevented&&ni(e.code)&&(e.preventDefault(),this.close()),this.typeaheadController.onKeydown(e)}async animateOpen(){const e=this.surfaceEl,t=this.slotEl;if(!e||!t)return!0;const i=this.openDirection;this.dispatchEvent(new Event("opening")),e.classList.toggle("animating",!0);const o=this.openCloseAnimationSignal.start(),s=e.offsetHeight,n=i==="UP",d=this.items,h=500,f=50,v=250,m=(h-v)/d.length,w=e.animate([{height:"0px"},{height:`${s}px`}],{duration:h,easing:j.EMPHASIZED}),g=t.animate([{transform:n?`translateY(-${s}px)`:""},{transform:""}],{duration:h,easing:j.EMPHASIZED}),$=e.animate([{opacity:0},{opacity:1}],f),x=[];for(let u=0;u<d.length;u++){const C=n?d.length-1-u:u,E=d[C],I=E.animate([{opacity:0},{opacity:1}],{duration:v,delay:m*u});E.classList.toggle("md-menu-hidden",!0),I.addEventListener("finish",()=>{E.classList.toggle("md-menu-hidden",!1)}),x.push([E,I])}let _=u=>{};const k=new Promise(u=>{_=u});return o.addEventListener("abort",()=>{w.cancel(),g.cancel(),$.cancel(),x.forEach(([u,C])=>{u.classList.toggle("md-menu-hidden",!1),C.cancel()}),_(!0)}),w.addEventListener("finish",()=>{e.classList.toggle("animating",!1),this.openCloseAnimationSignal.finish(),_(!1)}),await k}animateClose(){let e;const t=new Promise(I=>{e=I}),i=this.surfaceEl,o=this.slotEl;if(!i||!o)return e(!1),t;const n=this.openDirection==="UP";this.dispatchEvent(new Event("closing")),i.classList.toggle("animating",!0);const d=this.openCloseAnimationSignal.start(),h=i.offsetHeight,f=this.items,v=150,m=50,w=v-m,g=50,$=50,x=.35,_=(v-$-g)/f.length,k=i.animate([{height:`${h}px`},{height:`${h*x}px`}],{duration:v,easing:j.EMPHASIZED_ACCELERATE}),u=o.animate([{transform:""},{transform:n?`translateY(-${h*(1-x)}px)`:""}],{duration:v,easing:j.EMPHASIZED_ACCELERATE}),C=i.animate([{opacity:1},{opacity:0}],{duration:m,delay:w}),E=[];for(let I=0;I<f.length;I++){const q=n?I:f.length-1-I,Y=f[q],ae=Y.animate([{opacity:1},{opacity:0}],{duration:g,delay:$+_*I});ae.addEventListener("finish",()=>{Y.classList.toggle("md-menu-hidden",!0)}),E.push([Y,ae])}return d.addEventListener("abort",()=>{k.cancel(),u.cancel(),C.cancel(),E.forEach(([I,q])=>{q.cancel(),I.classList.toggle("md-menu-hidden",!1)}),e(!1)}),k.addEventListener("finish",()=>{i.classList.toggle("animating",!1),E.forEach(([I])=>{I.classList.toggle("md-menu-hidden",!1)}),this.openCloseAnimationSignal.finish(),this.dispatchEvent(new Event("closed")),e(!0)}),t}handleKeydown(e){this.pointerPath=[],this.listController.handleKeydown(e)}setUpGlobalEventListeners(){document.addEventListener("click",this.onDocumentClick,{capture:!0}),window.addEventListener("pointerdown",this.onWindowPointerdown),document.addEventListener("resize",this.onWindowResize,{passive:!0}),window.addEventListener("resize",this.onWindowResize,{passive:!0})}cleanUpGlobalEventListeners(){document.removeEventListener("click",this.onDocumentClick,{capture:!0}),window.removeEventListener("pointerdown",this.onWindowPointerdown),document.removeEventListener("resize",this.onWindowResize),window.removeEventListener("resize",this.onWindowResize)}onCloseMenu(){this.close()}onDeactivateItems(e){e.stopPropagation(),this.listController.onDeactivateItems()}onRequestActivation(e){e.stopPropagation(),this.listController.onRequestActivation(e)}handleDeactivateTypeahead(e){e.stopPropagation(),this.typeaheadActive=!1}handleActivateTypeahead(e){e.stopPropagation(),this.typeaheadActive=!0}handleStayOpenOnFocusout(e){e.stopPropagation(),this.stayOpenOnFocusout=!0}handleCloseOnFocusout(e){e.stopPropagation(),this.stayOpenOnFocusout=!1}close(){this.open=!1,this.slotItems.forEach(t=>{var i;(i=t.close)==null||i.call(t)})}show(){this.open=!0}activateNextItem(){return this.listController.activateNextItem()??null}activatePreviousItem(){return this.listController.activatePreviousItem()??null}reposition(){this.open&&this.menuPositionController.position()}}a([R(".menu")],L.prototype,"surfaceEl",void 0);a([R("slot")],L.prototype,"slotEl",void 0);a([l()],L.prototype,"anchor",void 0);a([l()],L.prototype,"positioning",void 0);a([l({type:Boolean})],L.prototype,"quick",void 0);a([l({type:Boolean,attribute:"has-overflow"})],L.prototype,"hasOverflow",void 0);a([l({type:Boolean,reflect:!0})],L.prototype,"open",void 0);a([l({type:Number,attribute:"x-offset"})],L.prototype,"xOffset",void 0);a([l({type:Number,attribute:"y-offset"})],L.prototype,"yOffset",void 0);a([l({type:Boolean,attribute:"no-horizontal-flip"})],L.prototype,"noHorizontalFlip",void 0);a([l({type:Boolean,attribute:"no-vertical-flip"})],L.prototype,"noVerticalFlip",void 0);a([l({type:Number,attribute:"typeahead-delay"})],L.prototype,"typeaheadDelay",void 0);a([l({attribute:"anchor-corner"})],L.prototype,"anchorCorner",void 0);a([l({attribute:"menu-corner"})],L.prototype,"menuCorner",void 0);a([l({type:Boolean,attribute:"stay-open-on-outside-click"})],L.prototype,"stayOpenOnOutsideClick",void 0);a([l({type:Boolean,attribute:"stay-open-on-focusout"})],L.prototype,"stayOpenOnFocusout",void 0);a([l({type:Boolean,attribute:"skip-restore-focus"})],L.prototype,"skipRestoreFocus",void 0);a([l({attribute:"default-focus"})],L.prototype,"defaultFocus",void 0);a([l({type:Boolean,attribute:"no-navigation-wrap"})],L.prototype,"noNavigationWrap",void 0);a([ee({flatten:!0})],L.prototype,"slotItems",void 0);a([y()],L.prototype,"typeaheadActive",void 0);/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Nr=T`:host{--md-elevation-level: var(--md-menu-container-elevation, 2);--md-elevation-shadow-color: var(--md-menu-container-shadow-color, var(--md-sys-color-shadow, #000));min-width:112px;color:unset;display:contents}md-focus-ring{--md-focus-ring-shape: var(--md-menu-container-shape, var(--md-sys-shape-corner-extra-small, 4px))}.menu{border-radius:var(--md-menu-container-shape, var(--md-sys-shape-corner-extra-small, 4px));display:none;inset:auto;border:none;padding:0px;overflow:visible;background-color:rgba(0,0,0,0);color:inherit;opacity:0;z-index:20;position:absolute;user-select:none;max-height:inherit;height:inherit;min-width:inherit;max-width:inherit;scrollbar-width:inherit}.menu::backdrop{display:none}.fixed{position:fixed}.items{display:block;list-style-type:none;margin:0;outline:none;box-sizing:border-box;background-color:var(--md-menu-container-color, var(--md-sys-color-surface-container, #f3edf7));height:inherit;max-height:inherit;overflow:auto;min-width:inherit;max-width:inherit;border-radius:inherit;scrollbar-width:inherit}.item-padding{padding-block:var(--md-menu-top-space, 8px) var(--md-menu-bottom-space, 8px)}.has-overflow:not([popover]) .items{overflow:visible}.has-overflow.animating .items,.animating .items{overflow:hidden}.has-overflow.animating .items{pointer-events:none}.animating ::slotted(.md-menu-hidden){opacity:0}slot{display:block;height:inherit;max-height:inherit}::slotted(:is(md-divider,[role=separator])){margin:8px 0}@media(forced-colors: active){.menu{border-style:solid;border-color:CanvasText;border-width:1px}}
`;/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let st=class extends L{};st.styles=[Nr];st=a([ne("md-menu")],st);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Br extends ft{computeValidity(e){return this.selectControl||(this.selectControl=document.createElement("select")),Pt(c`<option value=${e.value}></option>`,this.selectControl),this.selectControl.value=e.value,this.selectControl.required=e.required,{validity:this.selectControl.validity,validationMessage:this.selectControl.validationMessage}}equals(e,t){return e.value===t.value&&e.required===t.required}copy({value:e,required:t}){return{value:e,required:t}}}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function Mr(r){const e=[];for(let t=0;t<r.length;t++){const i=r[t];i.selected&&e.push([i,t])}return e}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */var Tt;const $e=Symbol("value"),qr=te(si(pt(ut(xe(A)))));class S extends qr{get value(){return this[$e]}set value(e){this.lastUserSetValue=e,this.select(e)}get options(){var e;return((e=this.menu)==null?void 0:e.items)??[]}get selectedIndex(){const[e,t]=(this.getSelectedOptions()??[])[0]??[];return t??-1}set selectedIndex(e){this.lastUserSetSelectedIndex=e,this.selectIndex(e)}get selectedOptions(){return(this.getSelectedOptions()??[]).map(([e])=>e)}get hasError(){return this.error||this.nativeError}constructor(){super(),this.quick=!1,this.required=!1,this.errorText="",this.label="",this.noAsterisk=!1,this.supportingText="",this.error=!1,this.menuPositioning="popover",this.clampMenuWidth=!1,this.typeaheadDelay=li,this.hasLeadingIcon=!1,this.displayText="",this.menuAlign="start",this[Tt]="",this.lastUserSetValue=null,this.lastUserSetSelectedIndex=null,this.lastSelectedOption=null,this.lastSelectedOptionRecords=[],this.nativeError=!1,this.nativeErrorText="",this.focused=!1,this.open=!1,this.defaultFocus=G.NONE,this.prevOpen=this.open,this.selectWidth=0,this.addEventListener("focus",this.handleFocus.bind(this)),this.addEventListener("blur",this.handleBlur.bind(this))}select(e){const t=this.options.find(i=>i.value===e);t&&this.selectItem(t)}selectIndex(e){const t=this.options[e];t&&this.selectItem(t)}reset(){for(const e of this.options)e.selected=e.hasAttribute("selected");this.updateValueAndDisplayText(),this.nativeError=!1,this.nativeErrorText=""}showPicker(){this.open=!0}[(Tt=$e,De)](e){var i;e==null||e.preventDefault();const t=this.getErrorText();this.nativeError=!!e,this.nativeErrorText=this.validationMessage,t===this.getErrorText()&&((i=this.field)==null||i.reannounceError())}update(e){if(this.hasUpdated||this.initUserSelection(),this.prevOpen!==this.open&&this.open){const t=this.getBoundingClientRect();this.selectWidth=t.width}this.prevOpen=this.open,super.update(e)}render(){return c`
      <span
        class="select ${U(this.getRenderClasses())}"
        @focusout=${this.handleFocusout}>
        ${this.renderField()} ${this.renderMenu()}
      </span>
    `}async firstUpdated(e){var t;await((t=this.menu)==null?void 0:t.updateComplete),this.lastSelectedOptionRecords.length||this.initUserSelection(),!this.lastSelectedOptionRecords.length&&!this.options.length&&setTimeout(()=>{this.updateValueAndDisplayText()}),super.firstUpdated(e)}getRenderClasses(){return{disabled:this.disabled,error:this.error,open:this.open}}renderField(){const e=this.ariaLabel||this.label;return Pe`
      <${this.fieldTag}
          aria-haspopup="listbox"
          role="combobox"
          part="field"
          id="field"
          tabindex=${this.disabled?"-1":"0"}
          aria-label=${e||p}
          aria-describedby="description"
          aria-expanded=${this.open?"true":"false"}
          aria-controls="listbox"
          class="field"
          label=${this.label}
          ?no-asterisk=${this.noAsterisk}
          .focused=${this.focused||this.open}
          .populated=${!!this.displayText}
          .disabled=${this.disabled}
          .required=${this.required}
          .error=${this.hasError}
          ?has-start=${this.hasLeadingIcon}
          has-end
          supporting-text=${this.supportingText}
          error-text=${this.getErrorText()}
          @keydown=${this.handleKeydown}
          @click=${this.handleClick}>
         ${this.renderFieldContent()}
         <div id="description" slot="aria-describedby"></div>
      </${this.fieldTag}>`}renderFieldContent(){return[this.renderLeadingIcon(),this.renderLabel(),this.renderTrailingIcon()]}renderLeadingIcon(){return c`
      <span class="icon leading" slot="start">
        <slot name="leading-icon" @slotchange=${this.handleIconChange}></slot>
      </span>
    `}renderTrailingIcon(){return c`
      <span class="icon trailing" slot="end">
        <slot name="trailing-icon" @slotchange=${this.handleIconChange}>
          <svg height="5" viewBox="7 10 10 5" focusable="false">
            <polygon
              class="down"
              stroke="none"
              fill-rule="evenodd"
              points="7 10 12 15 17 10"></polygon>
            <polygon
              class="up"
              stroke="none"
              fill-rule="evenodd"
              points="7 15 12 10 17 15"></polygon>
          </svg>
        </slot>
      </span>
    `}renderLabel(){return c`<div id="label">${this.displayText||c`&nbsp;`}</div>`}renderMenu(){const e=this.label||this.ariaLabel;return c`<div class="menu-wrapper">
      <md-menu
        id="listbox"
        .defaultFocus=${this.defaultFocus}
        role="listbox"
        tabindex="-1"
        aria-label=${e||p}
        stay-open-on-focusout
        part="menu"
        exportparts="focus-ring: menu-focus-ring"
        anchor="field"
        style=${Le({"--__menu-min-width":`${this.selectWidth}px`,"--__menu-max-width":this.clampMenuWidth?`${this.selectWidth}px`:void 0})}
        no-navigation-wrap
        .open=${this.open}
        .quick=${this.quick}
        .positioning=${this.menuPositioning}
        .typeaheadDelay=${this.typeaheadDelay}
        .anchorCorner=${this.menuAlign==="start"?"end-start":"end-end"}
        .menuCorner=${this.menuAlign==="start"?"start-start":"start-end"}
        @opening=${this.handleOpening}
        @opened=${this.redispatchEvent}
        @closing=${this.redispatchEvent}
        @closed=${this.handleClosed}
        @close-menu=${this.handleCloseMenu}
        @request-selection=${this.handleRequestSelection}
        @request-deselection=${this.handleRequestDeselection}>
        ${this.renderMenuContent()}
      </md-menu>
    </div>`}renderMenuContent(){return c`<slot></slot>`}handleKeydown(e){var s,n;if(this.open||this.disabled||!this.menu)return;const t=this.menu.typeaheadController,i=e.code==="Space"||e.code==="ArrowDown"||e.code==="ArrowUp"||e.code==="End"||e.code==="Home"||e.code==="Enter";if(!t.isTypingAhead&&i){switch(e.preventDefault(),this.open=!0,e.code){case"Space":case"ArrowDown":case"Enter":this.defaultFocus=G.NONE;break;case"End":this.defaultFocus=G.LAST_ITEM;break;case"ArrowUp":case"Home":this.defaultFocus=G.FIRST_ITEM;break}return}if(e.key.length===1){t.onKeydown(e),e.preventDefault();const{lastActiveRecord:d}=t;if(!d)return;(n=(s=this.labelEl)==null?void 0:s.setAttribute)==null||n.call(s,"aria-live","polite"),this.selectItem(d[V.ITEM])&&this.dispatchInteractionEvents()}}handleClick(){this.open=!this.open}handleFocus(){this.focused=!0}handleBlur(){this.focused=!1}handleFocusout(e){e.relatedTarget&&ot(e.relatedTarget,this)||(this.open=!1)}getSelectedOptions(){if(!this.menu)return this.lastSelectedOptionRecords=[],null;const e=this.menu.items;return this.lastSelectedOptionRecords=Mr(e),this.lastSelectedOptionRecords}async getUpdateComplete(){var e;return await((e=this.menu)==null?void 0:e.updateComplete),super.getUpdateComplete()}updateValueAndDisplayText(){const e=this.getSelectedOptions()??[];let t=!1;if(e.length){const[i]=e[0];t=this.lastSelectedOption!==i,this.lastSelectedOption=i,this[$e]=i.value,this.displayText=i.displayText}else t=this.lastSelectedOption!==null,this.lastSelectedOption=null,this[$e]="",this.displayText="";return t}async handleOpening(e){var s,n,d;if((n=(s=this.labelEl)==null?void 0:s.removeAttribute)==null||n.call(s,"aria-live"),this.redispatchEvent(e),this.defaultFocus!==G.NONE)return;const t=this.menu.items,i=(d=ve(t))==null?void 0:d.item;let[o]=this.lastSelectedOptionRecords[0]??[null];i&&i!==o&&(i.tabIndex=-1),o=o??t[0],o&&(o.tabIndex=0,o.focus())}redispatchEvent(e){ze(this,e)}handleClosed(e){this.open=!1,this.redispatchEvent(e)}handleCloseMenu(e){const t=e.detail.reason,i=e.detail.itemPath[0];this.open=!1;let o=!1;t.kind==="click-selection"?o=this.selectItem(i):t.kind==="keydown"&&Lr(t.key)?o=this.selectItem(i):(i.tabIndex=-1,i.blur()),o&&this.dispatchInteractionEvents()}selectItem(e){return(this.getSelectedOptions()??[]).forEach(([i])=>{e!==i&&(i.selected=!1)}),e.selected=!0,this.updateValueAndDisplayText()}handleRequestSelection(e){const t=e.target;this.lastSelectedOptionRecords.some(([i])=>i===t)||this.selectItem(t)}handleRequestDeselection(e){const t=e.target;this.lastSelectedOptionRecords.some(([i])=>i===t)&&this.updateValueAndDisplayText()}initUserSelection(){this.lastUserSetValue&&!this.lastSelectedOptionRecords.length?this.select(this.lastUserSetValue):this.lastUserSetSelectedIndex!==null&&!this.lastSelectedOptionRecords.length?this.selectIndex(this.lastUserSetSelectedIndex):this.updateValueAndDisplayText()}handleIconChange(){this.hasLeadingIcon=this.leadingIcons.length>0}dispatchInteractionEvents(){this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0})),this.dispatchEvent(new Event("change",{bubbles:!0}))}getErrorText(){return this.error?this.errorText:this.nativeErrorText}[pe](){return this.value}formResetCallback(){this.reset()}formStateRestoreCallback(e){this.value=e}click(){var e;(e=this.field)==null||e.click()}[ge](){return new Br(()=>this)}[be](){return this.field}}S.shadowRootOptions={...A.shadowRootOptions,delegatesFocus:!0};a([l({type:Boolean})],S.prototype,"quick",void 0);a([l({type:Boolean})],S.prototype,"required",void 0);a([l({type:String,attribute:"error-text"})],S.prototype,"errorText",void 0);a([l()],S.prototype,"label",void 0);a([l({type:Boolean,attribute:"no-asterisk"})],S.prototype,"noAsterisk",void 0);a([l({type:String,attribute:"supporting-text"})],S.prototype,"supportingText",void 0);a([l({type:Boolean,reflect:!0})],S.prototype,"error",void 0);a([l({attribute:"menu-positioning"})],S.prototype,"menuPositioning",void 0);a([l({type:Boolean,attribute:"clamp-menu-width"})],S.prototype,"clampMenuWidth",void 0);a([l({type:Number,attribute:"typeahead-delay"})],S.prototype,"typeaheadDelay",void 0);a([l({type:Boolean,attribute:"has-leading-icon"})],S.prototype,"hasLeadingIcon",void 0);a([l({attribute:"display-text"})],S.prototype,"displayText",void 0);a([l({attribute:"menu-align"})],S.prototype,"menuAlign",void 0);a([l()],S.prototype,"value",null);a([l({type:Number,attribute:"selected-index"})],S.prototype,"selectedIndex",null);a([y()],S.prototype,"nativeError",void 0);a([y()],S.prototype,"nativeErrorText",void 0);a([y()],S.prototype,"focused",void 0);a([y()],S.prototype,"open",void 0);a([y()],S.prototype,"defaultFocus",void 0);a([R(".field")],S.prototype,"field",void 0);a([R("md-menu")],S.prototype,"menu",void 0);a([R("#label")],S.prototype,"labelEl",void 0);a([ee({slot:"leading-icon",flatten:!0})],S.prototype,"leadingIcons",void 0);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Ur extends S{constructor(){super(...arguments),this.fieldTag=oe`md-filled-field`}}/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Vr=T`:host{--_text-field-active-indicator-color: var(--md-filled-select-text-field-active-indicator-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-active-indicator-height: var(--md-filled-select-text-field-active-indicator-height, 1px);--_text-field-container-color: var(--md-filled-select-text-field-container-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_text-field-disabled-active-indicator-color: var(--md-filled-select-text-field-disabled-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-active-indicator-height: var(--md-filled-select-text-field-disabled-active-indicator-height, 1px);--_text-field-disabled-active-indicator-opacity: var(--md-filled-select-text-field-disabled-active-indicator-opacity, 0.38);--_text-field-disabled-container-color: var(--md-filled-select-text-field-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-container-opacity: var(--md-filled-select-text-field-disabled-container-opacity, 0.04);--_text-field-disabled-input-text-color: var(--md-filled-select-text-field-disabled-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-input-text-opacity: var(--md-filled-select-text-field-disabled-input-text-opacity, 0.38);--_text-field-disabled-label-text-color: var(--md-filled-select-text-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-label-text-opacity: var(--md-filled-select-text-field-disabled-label-text-opacity, 0.38);--_text-field-disabled-leading-icon-color: var(--md-filled-select-text-field-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-leading-icon-opacity: var(--md-filled-select-text-field-disabled-leading-icon-opacity, 0.38);--_text-field-disabled-supporting-text-color: var(--md-filled-select-text-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-supporting-text-opacity: var(--md-filled-select-text-field-disabled-supporting-text-opacity, 0.38);--_text-field-disabled-trailing-icon-color: var(--md-filled-select-text-field-disabled-trailing-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-trailing-icon-opacity: var(--md-filled-select-text-field-disabled-trailing-icon-opacity, 0.38);--_text-field-error-active-indicator-color: var(--md-filled-select-text-field-error-active-indicator-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-active-indicator-color: var(--md-filled-select-text-field-error-focus-active-indicator-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-input-text-color: var(--md-filled-select-text-field-error-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-focus-label-text-color: var(--md-filled-select-text-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-leading-icon-color: var(--md-filled-select-text-field-error-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-error-focus-supporting-text-color: var(--md-filled-select-text-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-trailing-icon-color: var(--md-filled-select-text-field-error-focus-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_text-field-error-hover-active-indicator-color: var(--md-filled-select-text-field-error-hover-active-indicator-color, var(--md-sys-color-on-error-container, #410e0b));--_text-field-error-hover-input-text-color: var(--md-filled-select-text-field-error-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-hover-label-text-color: var(--md-filled-select-text-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_text-field-error-hover-leading-icon-color: var(--md-filled-select-text-field-error-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-error-hover-state-layer-color: var(--md-filled-select-text-field-error-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-hover-state-layer-opacity: var(--md-filled-select-text-field-error-hover-state-layer-opacity, 0.08);--_text-field-error-hover-supporting-text-color: var(--md-filled-select-text-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-hover-trailing-icon-color: var(--md-filled-select-text-field-error-hover-trailing-icon-color, var(--md-sys-color-on-error-container, #410e0b));--_text-field-error-input-text-color: var(--md-filled-select-text-field-error-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-label-text-color: var(--md-filled-select-text-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-leading-icon-color: var(--md-filled-select-text-field-error-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-error-supporting-text-color: var(--md-filled-select-text-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-trailing-icon-color: var(--md-filled-select-text-field-error-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_text-field-focus-active-indicator-color: var(--md-filled-select-text-field-focus-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_text-field-focus-active-indicator-height: var(--md-filled-select-text-field-focus-active-indicator-height, 3px);--_text-field-focus-input-text-color: var(--md-filled-select-text-field-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-focus-label-text-color: var(--md-filled-select-text-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_text-field-focus-leading-icon-color: var(--md-filled-select-text-field-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-focus-supporting-text-color: var(--md-filled-select-text-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-focus-trailing-icon-color: var(--md-filled-select-text-field-focus-trailing-icon-color, var(--md-sys-color-primary, #6750a4));--_text-field-hover-active-indicator-color: var(--md-filled-select-text-field-hover-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-active-indicator-height: var(--md-filled-select-text-field-hover-active-indicator-height, 1px);--_text-field-hover-input-text-color: var(--md-filled-select-text-field-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-label-text-color: var(--md-filled-select-text-field-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-leading-icon-color: var(--md-filled-select-text-field-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-hover-state-layer-color: var(--md-filled-select-text-field-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-state-layer-opacity: var(--md-filled-select-text-field-hover-state-layer-opacity, 0.08);--_text-field-hover-supporting-text-color: var(--md-filled-select-text-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-hover-trailing-icon-color: var(--md-filled-select-text-field-hover-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-input-text-color: var(--md-filled-select-text-field-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-input-text-font: var(--md-filled-select-text-field-input-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_text-field-input-text-line-height: var(--md-filled-select-text-field-input-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_text-field-input-text-size: var(--md-filled-select-text-field-input-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_text-field-input-text-weight: var(--md-filled-select-text-field-input-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_text-field-label-text-color: var(--md-filled-select-text-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-label-text-font: var(--md-filled-select-text-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_text-field-label-text-line-height: var(--md-filled-select-text-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_text-field-label-text-populated-line-height: var(--md-filled-select-text-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_text-field-label-text-populated-size: var(--md-filled-select-text-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_text-field-label-text-size: var(--md-filled-select-text-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_text-field-label-text-weight: var(--md-filled-select-text-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_text-field-leading-icon-color: var(--md-filled-select-text-field-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-leading-icon-size: var(--md-filled-select-text-field-leading-icon-size, 24px);--_text-field-supporting-text-color: var(--md-filled-select-text-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-supporting-text-font: var(--md-filled-select-text-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_text-field-supporting-text-line-height: var(--md-filled-select-text-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_text-field-supporting-text-size: var(--md-filled-select-text-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_text-field-supporting-text-weight: var(--md-filled-select-text-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_text-field-trailing-icon-color: var(--md-filled-select-text-field-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-trailing-icon-size: var(--md-filled-select-text-field-trailing-icon-size, 24px);--_text-field-container-shape-start-start: var(--md-filled-select-text-field-container-shape-start-start, var(--md-filled-select-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_text-field-container-shape-start-end: var(--md-filled-select-text-field-container-shape-start-end, var(--md-filled-select-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_text-field-container-shape-end-end: var(--md-filled-select-text-field-container-shape-end-end, var(--md-filled-select-text-field-container-shape, var(--md-sys-shape-corner-none, 0px)));--_text-field-container-shape-end-start: var(--md-filled-select-text-field-container-shape-end-start, var(--md-filled-select-text-field-container-shape, var(--md-sys-shape-corner-none, 0px)));--md-filled-field-active-indicator-color: var(--_text-field-active-indicator-color);--md-filled-field-active-indicator-height: var(--_text-field-active-indicator-height);--md-filled-field-container-color: var(--_text-field-container-color);--md-filled-field-container-shape-end-end: var(--_text-field-container-shape-end-end);--md-filled-field-container-shape-end-start: var(--_text-field-container-shape-end-start);--md-filled-field-container-shape-start-end: var(--_text-field-container-shape-start-end);--md-filled-field-container-shape-start-start: var(--_text-field-container-shape-start-start);--md-filled-field-content-color: var(--_text-field-input-text-color);--md-filled-field-content-font: var(--_text-field-input-text-font);--md-filled-field-content-line-height: var(--_text-field-input-text-line-height);--md-filled-field-content-size: var(--_text-field-input-text-size);--md-filled-field-content-weight: var(--_text-field-input-text-weight);--md-filled-field-disabled-active-indicator-color: var(--_text-field-disabled-active-indicator-color);--md-filled-field-disabled-active-indicator-height: var(--_text-field-disabled-active-indicator-height);--md-filled-field-disabled-active-indicator-opacity: var(--_text-field-disabled-active-indicator-opacity);--md-filled-field-disabled-container-color: var(--_text-field-disabled-container-color);--md-filled-field-disabled-container-opacity: var(--_text-field-disabled-container-opacity);--md-filled-field-disabled-content-color: var(--_text-field-disabled-input-text-color);--md-filled-field-disabled-content-opacity: var(--_text-field-disabled-input-text-opacity);--md-filled-field-disabled-label-text-color: var(--_text-field-disabled-label-text-color);--md-filled-field-disabled-label-text-opacity: var(--_text-field-disabled-label-text-opacity);--md-filled-field-disabled-leading-content-color: var(--_text-field-disabled-leading-icon-color);--md-filled-field-disabled-leading-content-opacity: var(--_text-field-disabled-leading-icon-opacity);--md-filled-field-disabled-supporting-text-color: var(--_text-field-disabled-supporting-text-color);--md-filled-field-disabled-supporting-text-opacity: var(--_text-field-disabled-supporting-text-opacity);--md-filled-field-disabled-trailing-content-color: var(--_text-field-disabled-trailing-icon-color);--md-filled-field-disabled-trailing-content-opacity: var(--_text-field-disabled-trailing-icon-opacity);--md-filled-field-error-active-indicator-color: var(--_text-field-error-active-indicator-color);--md-filled-field-error-content-color: var(--_text-field-error-input-text-color);--md-filled-field-error-focus-active-indicator-color: var(--_text-field-error-focus-active-indicator-color);--md-filled-field-error-focus-content-color: var(--_text-field-error-focus-input-text-color);--md-filled-field-error-focus-label-text-color: var(--_text-field-error-focus-label-text-color);--md-filled-field-error-focus-leading-content-color: var(--_text-field-error-focus-leading-icon-color);--md-filled-field-error-focus-supporting-text-color: var(--_text-field-error-focus-supporting-text-color);--md-filled-field-error-focus-trailing-content-color: var(--_text-field-error-focus-trailing-icon-color);--md-filled-field-error-hover-active-indicator-color: var(--_text-field-error-hover-active-indicator-color);--md-filled-field-error-hover-content-color: var(--_text-field-error-hover-input-text-color);--md-filled-field-error-hover-label-text-color: var(--_text-field-error-hover-label-text-color);--md-filled-field-error-hover-leading-content-color: var(--_text-field-error-hover-leading-icon-color);--md-filled-field-error-hover-state-layer-color: var(--_text-field-error-hover-state-layer-color);--md-filled-field-error-hover-state-layer-opacity: var(--_text-field-error-hover-state-layer-opacity);--md-filled-field-error-hover-supporting-text-color: var(--_text-field-error-hover-supporting-text-color);--md-filled-field-error-hover-trailing-content-color: var(--_text-field-error-hover-trailing-icon-color);--md-filled-field-error-label-text-color: var(--_text-field-error-label-text-color);--md-filled-field-error-leading-content-color: var(--_text-field-error-leading-icon-color);--md-filled-field-error-supporting-text-color: var(--_text-field-error-supporting-text-color);--md-filled-field-error-trailing-content-color: var(--_text-field-error-trailing-icon-color);--md-filled-field-focus-active-indicator-color: var(--_text-field-focus-active-indicator-color);--md-filled-field-focus-active-indicator-height: var(--_text-field-focus-active-indicator-height);--md-filled-field-focus-content-color: var(--_text-field-focus-input-text-color);--md-filled-field-focus-label-text-color: var(--_text-field-focus-label-text-color);--md-filled-field-focus-leading-content-color: var(--_text-field-focus-leading-icon-color);--md-filled-field-focus-supporting-text-color: var(--_text-field-focus-supporting-text-color);--md-filled-field-focus-trailing-content-color: var(--_text-field-focus-trailing-icon-color);--md-filled-field-hover-active-indicator-color: var(--_text-field-hover-active-indicator-color);--md-filled-field-hover-active-indicator-height: var(--_text-field-hover-active-indicator-height);--md-filled-field-hover-content-color: var(--_text-field-hover-input-text-color);--md-filled-field-hover-label-text-color: var(--_text-field-hover-label-text-color);--md-filled-field-hover-leading-content-color: var(--_text-field-hover-leading-icon-color);--md-filled-field-hover-state-layer-color: var(--_text-field-hover-state-layer-color);--md-filled-field-hover-state-layer-opacity: var(--_text-field-hover-state-layer-opacity);--md-filled-field-hover-supporting-text-color: var(--_text-field-hover-supporting-text-color);--md-filled-field-hover-trailing-content-color: var(--_text-field-hover-trailing-icon-color);--md-filled-field-label-text-color: var(--_text-field-label-text-color);--md-filled-field-label-text-font: var(--_text-field-label-text-font);--md-filled-field-label-text-line-height: var(--_text-field-label-text-line-height);--md-filled-field-label-text-populated-line-height: var(--_text-field-label-text-populated-line-height);--md-filled-field-label-text-populated-size: var(--_text-field-label-text-populated-size);--md-filled-field-label-text-size: var(--_text-field-label-text-size);--md-filled-field-label-text-weight: var(--_text-field-label-text-weight);--md-filled-field-leading-content-color: var(--_text-field-leading-icon-color);--md-filled-field-supporting-text-color: var(--_text-field-supporting-text-color);--md-filled-field-supporting-text-font: var(--_text-field-supporting-text-font);--md-filled-field-supporting-text-line-height: var(--_text-field-supporting-text-line-height);--md-filled-field-supporting-text-size: var(--_text-field-supporting-text-size);--md-filled-field-supporting-text-weight: var(--_text-field-supporting-text-weight);--md-filled-field-trailing-content-color: var(--_text-field-trailing-icon-color)}[has-start] .icon.leading{font-size:var(--_text-field-leading-icon-size);height:var(--_text-field-leading-icon-size);width:var(--_text-field-leading-icon-size)}.icon.trailing{font-size:var(--_text-field-trailing-icon-size);height:var(--_text-field-trailing-icon-size);width:var(--_text-field-trailing-icon-size)}
`;/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Hr=T`:host{color:unset;min-width:210px;display:flex}.field{cursor:default;outline:none}.select{position:relative;flex-direction:column}.icon.trailing svg,.icon ::slotted(*){fill:currentColor}.icon ::slotted(*){width:inherit;height:inherit;font-size:inherit}.icon slot{display:flex;height:100%;width:100%;align-items:center;justify-content:center}.icon.trailing :is(.up,.down){opacity:0;transition:opacity 75ms linear 75ms}.select:not(.open) .down,.select.open .up{opacity:1}.field,.select,md-menu{min-width:inherit;width:inherit;max-width:inherit;display:flex}md-menu{min-width:var(--__menu-min-width);max-width:var(--__menu-max-width, inherit)}.menu-wrapper{width:0px;height:0px;max-width:inherit}md-menu ::slotted(:not[disabled]){cursor:pointer}.field,.select{width:100%}:host{display:inline-flex}:host([disabled]){pointer-events:none}
`;class ci extends Ur{}ci.styles=[Hr,Vr];customElements.define("ew-filled-select",ci);/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Wr=T`:host{display:flex;--md-ripple-hover-color: var(--md-menu-item-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-hover-opacity: var(--md-menu-item-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-menu-item-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-pressed-opacity: var(--md-menu-item-pressed-state-layer-opacity, 0.12)}:host([disabled]){opacity:var(--md-menu-item-disabled-opacity, 0.3);pointer-events:none}md-focus-ring{z-index:1;--md-focus-ring-shape: 8px}a,button,li{background:none;border:none;padding:0;margin:0;text-align:unset;text-decoration:none}.list-item{border-radius:inherit;display:flex;flex:1;max-width:inherit;min-width:inherit;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.list-item:not(.disabled){cursor:pointer}[slot=container]{pointer-events:none}md-ripple{border-radius:inherit}md-item{border-radius:inherit;flex:1;color:var(--md-menu-item-label-text-color, var(--md-sys-color-on-surface, #1d1b20));font-family:var(--md-menu-item-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-menu-item-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));line-height:var(--md-menu-item-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));font-weight:var(--md-menu-item-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));min-height:var(--md-menu-item-one-line-container-height, 56px);padding-top:var(--md-menu-item-top-space, 12px);padding-bottom:var(--md-menu-item-bottom-space, 12px);padding-inline-start:var(--md-menu-item-leading-space, 16px);padding-inline-end:var(--md-menu-item-trailing-space, 16px)}md-item[multiline]{min-height:var(--md-menu-item-two-line-container-height, 72px)}[slot=supporting-text]{color:var(--md-menu-item-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-menu-item-supporting-text-font, var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-menu-item-supporting-text-size, var(--md-sys-typescale-body-medium-size, 0.875rem));line-height:var(--md-menu-item-supporting-text-line-height, var(--md-sys-typescale-body-medium-line-height, 1.25rem));font-weight:var(--md-menu-item-supporting-text-weight, var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400)))}[slot=trailing-supporting-text]{color:var(--md-menu-item-trailing-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-menu-item-trailing-supporting-text-font, var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-menu-item-trailing-supporting-text-size, var(--md-sys-typescale-label-small-size, 0.6875rem));line-height:var(--md-menu-item-trailing-supporting-text-line-height, var(--md-sys-typescale-label-small-line-height, 1rem));font-weight:var(--md-menu-item-trailing-supporting-text-weight, var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500)))}:is([slot=start],[slot=end])::slotted(*){fill:currentColor}[slot=start]{color:var(--md-menu-item-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}[slot=end]{color:var(--md-menu-item-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}.list-item{background-color:var(--md-menu-item-container-color, transparent)}.list-item.selected{background-color:var(--md-menu-item-selected-container-color, var(--md-sys-color-secondary-container, #e8def8))}.selected:not(.disabled) ::slotted(*){color:var(--md-menu-item-selected-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b))}@media(forced-colors: active){:host([disabled]),:host([disabled]) slot{color:GrayText;opacity:1}.list-item{position:relative}.list-item.selected::before{content:"";position:absolute;inset:0;box-sizing:border-box;border-radius:inherit;pointer-events:none;border:3px double CanvasText}}
`;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Kr{constructor(e,t){this.host=e,this.internalTypeaheadText=null,this.onClick=()=>{this.host.keepOpen||this.host.dispatchEvent(Et(this.host,{kind:kt.CLICK_SELECTION}))},this.onKeydown=i=>{if(this.host.href&&i.code==="Enter"){const s=this.getInteractiveElement();s instanceof HTMLAnchorElement&&s.click()}if(i.defaultPrevented)return;const o=i.code;this.host.keepOpen&&o!=="Escape"||ni(o)&&(i.preventDefault(),this.host.dispatchEvent(Et(this.host,{kind:kt.KEYDOWN,key:o})))},this.getHeadlineElements=t.getHeadlineElements,this.getSupportingTextElements=t.getSupportingTextElements,this.getDefaultElements=t.getDefaultElements,this.getInteractiveElement=t.getInteractiveElement,this.host.addController(this)}get typeaheadText(){if(this.internalTypeaheadText!==null)return this.internalTypeaheadText;const e=this.getHeadlineElements(),t=[];return e.forEach(i=>{i.textContent&&i.textContent.trim()&&t.push(i.textContent.trim())}),t.length===0&&this.getDefaultElements().forEach(i=>{i.textContent&&i.textContent.trim()&&t.push(i.textContent.trim())}),t.length===0&&this.getSupportingTextElements().forEach(i=>{i.textContent&&i.textContent.trim()&&t.push(i.textContent.trim())}),t.join(" ")}get tagName(){switch(this.host.type){case"link":return"a";case"button":return"button";default:case"menuitem":case"option":return"li"}}get role(){return this.host.type==="option"?"option":"menuitem"}hostConnected(){this.host.toggleAttribute("md-menu-item",!0)}hostUpdate(){this.host.href&&(this.host.type="link")}setTypeaheadText(e){this.internalTypeaheadText=e}}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function Gr(){return new Event("request-selection",{bubbles:!0,composed:!0})}function Yr(){return new Event("request-deselection",{bubbles:!0,composed:!0})}class Zr{get role(){return this.menuItemController.role}get typeaheadText(){return this.menuItemController.typeaheadText}setTypeaheadText(e){this.menuItemController.setTypeaheadText(e)}get displayText(){return this.internalDisplayText!==null?this.internalDisplayText:this.menuItemController.typeaheadText}setDisplayText(e){this.internalDisplayText=e}constructor(e,t){this.host=e,this.internalDisplayText=null,this.firstUpdate=!0,this.onClick=()=>{this.menuItemController.onClick()},this.onKeydown=i=>{this.menuItemController.onKeydown(i)},this.lastSelected=this.host.selected,this.menuItemController=new Kr(e,t),e.addController(this)}hostUpdate(){this.lastSelected!==this.host.selected&&(this.host.ariaSelected=this.host.selected?"true":"false")}hostUpdated(){this.lastSelected!==this.host.selected&&!this.firstUpdate&&(this.host.selected?this.host.dispatchEvent(Gr()):this.host.dispatchEvent(Yr())),this.lastSelected=this.host.selected,this.firstUpdate=!1}}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const jr=te(A);class H extends jr{constructor(){super(...arguments),this.disabled=!1,this.isMenuItem=!0,this.selected=!1,this.value="",this.type="option",this.selectOptionController=new Zr(this,{getHeadlineElements:()=>this.headlineElements,getSupportingTextElements:()=>this.supportingTextElements,getDefaultElements:()=>this.defaultElements,getInteractiveElement:()=>this.listItemRoot})}get typeaheadText(){return this.selectOptionController.typeaheadText}set typeaheadText(e){this.selectOptionController.setTypeaheadText(e)}get displayText(){return this.selectOptionController.displayText}set displayText(e){this.selectOptionController.setDisplayText(e)}render(){return this.renderListItem(c`
      <md-item>
        <div slot="container">
          ${this.renderRipple()} ${this.renderFocusRing()}
        </div>
        <slot name="start" slot="start"></slot>
        <slot name="end" slot="end"></slot>
        ${this.renderBody()}
      </md-item>
    `)}renderListItem(e){return c`
      <li
        id="item"
        tabindex=${this.disabled?-1:0}
        role=${this.selectOptionController.role}
        aria-label=${this.ariaLabel||p}
        aria-selected=${this.ariaSelected||p}
        aria-checked=${this.ariaChecked||p}
        aria-expanded=${this.ariaExpanded||p}
        aria-haspopup=${this.ariaHasPopup||p}
        class="list-item ${U(this.getRenderClasses())}"
        @click=${this.selectOptionController.onClick}
        @keydown=${this.selectOptionController.onKeydown}
        >${e}</li
      >
    `}renderRipple(){return c` <md-ripple
      part="ripple"
      for="item"
      ?disabled=${this.disabled}></md-ripple>`}renderFocusRing(){return c` <md-focus-ring
      part="focus-ring"
      for="item"
      inward></md-focus-ring>`}getRenderClasses(){return{disabled:this.disabled,selected:this.selected}}renderBody(){return c`
      <slot></slot>
      <slot name="overline" slot="overline"></slot>
      <slot name="headline" slot="headline"></slot>
      <slot name="supporting-text" slot="supporting-text"></slot>
      <slot
        name="trailing-supporting-text"
        slot="trailing-supporting-text"></slot>
    `}focus(){var e;(e=this.listItemRoot)==null||e.focus()}}H.shadowRootOptions={...A.shadowRootOptions,delegatesFocus:!0};a([l({type:Boolean,reflect:!0})],H.prototype,"disabled",void 0);a([l({type:Boolean,attribute:"md-menu-item",reflect:!0})],H.prototype,"isMenuItem",void 0);a([l({type:Boolean})],H.prototype,"selected",void 0);a([l()],H.prototype,"value",void 0);a([R(".list-item")],H.prototype,"listItemRoot",void 0);a([ee({slot:"headline"})],H.prototype,"headlineElements",void 0);a([ee({slot:"supporting-text"})],H.prototype,"supportingTextElements",void 0);a([_i({slot:""})],H.prototype,"defaultElements",void 0);a([l({attribute:"typeahead-text"})],H.prototype,"typeaheadText",null);a([l({attribute:"display-text"})],H.prototype,"displayText",null);class hi extends H{}hi.styles=[Wr];customElements.define("ew-select-option",hi);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Xr=te(A);class we extends Xr{constructor(){super(...arguments),this.value=0,this.max=1,this.indeterminate=!1,this.fourColor=!1}render(){const{ariaLabel:e}=this;return c`
      <div
        class="progress ${U(this.getRenderClasses())}"
        role="progressbar"
        aria-label="${e||p}"
        aria-valuemin="0"
        aria-valuemax=${this.max}
        aria-valuenow=${this.indeterminate?p:this.value}
        >${this.renderIndicator()}</div
      >
    `}getRenderClasses(){return{indeterminate:this.indeterminate,"four-color":this.fourColor}}}a([l({type:Number})],we.prototype,"value",void 0);a([l({type:Number})],we.prototype,"max",void 0);a([l({type:Boolean})],we.prototype,"indeterminate",void 0);a([l({type:Boolean,attribute:"four-color"})],we.prototype,"fourColor",void 0);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Jr extends we{renderIndicator(){return this.indeterminate?this.renderIndeterminateContainer():this.renderDeterminateContainer()}renderDeterminateContainer(){const e=(1-this.value/this.max)*100;return c`
      <svg viewBox="0 0 4800 4800">
        <circle class="track" pathLength="100"></circle>
        <circle
          class="active-track"
          pathLength="100"
          stroke-dashoffset=${e}></circle>
      </svg>
    `}renderIndeterminateContainer(){return c` <div class="spinner">
      <div class="left">
        <div class="circle"></div>
      </div>
      <div class="right">
        <div class="circle"></div>
      </div>
    </div>`}}/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Qr=T`:host{--_active-indicator-color: var(--md-circular-progress-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_active-indicator-width: var(--md-circular-progress-active-indicator-width, 10);--_four-color-active-indicator-four-color: var(--md-circular-progress-four-color-active-indicator-four-color, var(--md-sys-color-tertiary-container, #ffd8e4));--_four-color-active-indicator-one-color: var(--md-circular-progress-four-color-active-indicator-one-color, var(--md-sys-color-primary, #6750a4));--_four-color-active-indicator-three-color: var(--md-circular-progress-four-color-active-indicator-three-color, var(--md-sys-color-tertiary, #7d5260));--_four-color-active-indicator-two-color: var(--md-circular-progress-four-color-active-indicator-two-color, var(--md-sys-color-primary-container, #eaddff));--_size: var(--md-circular-progress-size, 48px);display:inline-flex;vertical-align:middle;width:var(--_size);height:var(--_size);position:relative;align-items:center;justify-content:center;contain:strict;content-visibility:auto}.progress{flex:1;align-self:stretch;margin:4px}.progress,.spinner,.left,.right,.circle,svg,.track,.active-track{position:absolute;inset:0}svg{transform:rotate(-90deg)}circle{cx:50%;cy:50%;r:calc(50%*(1 - var(--_active-indicator-width)/100));stroke-width:calc(var(--_active-indicator-width)*1%);stroke-dasharray:100;fill:rgba(0,0,0,0)}.active-track{transition:stroke-dashoffset 500ms cubic-bezier(0, 0, 0.2, 1);stroke:var(--_active-indicator-color)}.track{stroke:rgba(0,0,0,0)}.progress.indeterminate{animation:linear infinite linear-rotate;animation-duration:1568.2352941176ms}.spinner{animation:infinite both rotate-arc;animation-duration:5332ms;animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.left{overflow:hidden;inset:0 50% 0 0}.right{overflow:hidden;inset:0 0 0 50%}.circle{box-sizing:border-box;border-radius:50%;border:solid calc(var(--_active-indicator-width)/100*(var(--_size) - 8px));border-color:var(--_active-indicator-color) var(--_active-indicator-color) rgba(0,0,0,0) rgba(0,0,0,0);animation:expand-arc;animation-iteration-count:infinite;animation-fill-mode:both;animation-duration:1333ms,5332ms;animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.four-color .circle{animation-name:expand-arc,four-color}.left .circle{rotate:135deg;inset:0 -100% 0 0}.right .circle{rotate:100deg;inset:0 0 0 -100%;animation-delay:-666.5ms,0ms}@media(forced-colors: active){.active-track{stroke:CanvasText}.circle{border-color:CanvasText CanvasText Canvas Canvas}}@keyframes expand-arc{0%{transform:rotate(265deg)}50%{transform:rotate(130deg)}100%{transform:rotate(265deg)}}@keyframes rotate-arc{12.5%{transform:rotate(135deg)}25%{transform:rotate(270deg)}37.5%{transform:rotate(405deg)}50%{transform:rotate(540deg)}62.5%{transform:rotate(675deg)}75%{transform:rotate(810deg)}87.5%{transform:rotate(945deg)}100%{transform:rotate(1080deg)}}@keyframes linear-rotate{to{transform:rotate(360deg)}}@keyframes four-color{0%{border-top-color:var(--_four-color-active-indicator-one-color);border-right-color:var(--_four-color-active-indicator-one-color)}15%{border-top-color:var(--_four-color-active-indicator-one-color);border-right-color:var(--_four-color-active-indicator-one-color)}25%{border-top-color:var(--_four-color-active-indicator-two-color);border-right-color:var(--_four-color-active-indicator-two-color)}40%{border-top-color:var(--_four-color-active-indicator-two-color);border-right-color:var(--_four-color-active-indicator-two-color)}50%{border-top-color:var(--_four-color-active-indicator-three-color);border-right-color:var(--_four-color-active-indicator-three-color)}65%{border-top-color:var(--_four-color-active-indicator-three-color);border-right-color:var(--_four-color-active-indicator-three-color)}75%{border-top-color:var(--_four-color-active-indicator-four-color);border-right-color:var(--_four-color-active-indicator-four-color)}90%{border-top-color:var(--_four-color-active-indicator-four-color);border-right-color:var(--_four-color-active-indicator-four-color)}100%{border-top-color:var(--_four-color-active-indicator-one-color);border-right-color:var(--_four-color-active-indicator-one-color)}}
`;class pi extends Jr{}pi.styles=[Qr];customElements.define("ew-circular-progress",pi);class Fe extends A{render(){return c`
      <div>
        <ew-circular-progress
          active
          ?indeterminate=${this.progress===void 0}
          .value=${this.progress!==void 0?this.progress/100:void 0}
        ></ew-circular-progress>
        ${this.progress!==void 0?c`<div>${this.progress}%</div>`:""}
      </div>
      ${this.label}
    `}}Fe.styles=T`
    :host {
      display: flex;
      flex-direction: column;
      text-align: center;
    }
    ew-circular-progress {
      margin-bottom: 16px;
    }
  `;a([l()],Fe.prototype,"label",void 0);a([l()],Fe.prototype,"progress",void 0);customElements.define("ewt-page-progress",Fe);class Ne extends A{render(){return c`
      <div class="icon">${this.icon}</div>
      ${this.label}
    `}}Ne.styles=T`
    :host {
      display: flex;
      flex-direction: column;
      text-align: center;
    }
    .icon {
      font-size: 50px;
      line-height: 80px;
      color: black;
    }
  `;a([l()],Ne.prototype,"icon",void 0);a([l()],Ne.prototype,"label",void 0);customElements.define("ewt-page-message",Ne);const eo=M`
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
    />
  </svg>
`,to=M`
  <svg viewBox="0 -960 960 960">
    <path
      fill="currentColor"
      d="M480-120 0-600q95-97 219.5-148.5T480-800q137 0 261 51t219 149L480-120ZM174-540q67-48 145-74t161-26q83 0 161 26t145 74l58-58q-79-60-172-91t-192-31q-99 0-192 31t-172 91l58 58Z"
    />
  </svg>
`,io=M`
  <svg viewBox="0 -960 960 960">
    <path
      fill="currentColor"
      d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM232-482q53-38 116-59.5T480-563q69 0 132 21.5T728-482l116-116q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l116 116Z"
    />
  </svg>
`,ro=M`
  <svg viewBox="0 -960 960 960">
    <path
      fill="currentColor"
      d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM299-415q38-28 84-43.5t97-15.5q51 0 97 15.5t84 43.5l183-183q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l183 183Z"
    />
  </svg>
`,oo=M`
  <svg viewBox="0 -960 960 960">
    <path
      fill="currentColor"
      d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM361-353q25-18 55.5-28t63.5-10q33 0 63.5 10t55.5 28l245-245q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l245 245Z"
    />
  </svg>
`,so=M`
  <svg viewBox="0 -960 960 960">
    <path
      fill="currentColor"
      d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"
    />
  </svg>
`,ao=M`
  <svg viewBox="0 -960 960 960">
    <path
      fill="currentColor"
      d="M240-160h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM240-160v-400 400Zm0 80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h280v-80q0-83 58.5-141.5T720-920q83 0 141.5 58.5T920-720h-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80h120q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Z"
    />
  </svg>
`,St=M`
  <svg slot="start" viewBox="0 0 24 24">
    <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
  </svg>
`,no=M`
  <svg slot="start" viewBox="0 0 24 24">
    <path d="M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z" />
  </svg>
`,At=M`
  <svg slot="start" viewBox="0 0 24 24">
    <path d="M20,19V7H4V19H20M20,3A2,2 0 0,1 22,5V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V5C2,3.89 2.9,3 4,3H20M13,17V15H18V17H13M9.58,13L5.57,9H8.4L11.7,12.3C12.09,12.69 12.09,13.33 11.7,13.72L8.42,17H5.59L9.58,13Z" />
  </svg>
`,Rt=M`
  <svg slot="start" viewBox="0 0 24 24">
  <path d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
  </svg>
`,$t=M`
  <svg slot="start" viewBox="0 0 24 24">
    <path d="m12.151 1.5882c-.3262 0-.6523.1291-.8996.3867l-8.3848 8.7354c-.0619.0644-.1223.1368-.1807.2154-.0588.0789-.1151.1638-.1688.2534-.2593.4325-.4552.9749-.5232 1.4555-.0026.018-.0076.0369-.0094.0548-.0121.0987-.0184.1944-.0184.2857v8.0124a1.2731 1.2731 0 001.2731 1.2731h7.8313l-3.4484-3.593a1.7399 1.7399 0 111.0803-1.125l2.6847 2.7972v-10.248a1.7399 1.7399 0 111.5276-0v7.187l2.6702-2.782a1.7399 1.7399 0 111.0566 1.1505l-3.7269 3.8831v2.7299h8.174a1.2471 1.2471 0 001.2471-1.2471v-8.0375c0-.0912-.0059-.1868-.0184-.2855-.0603-.4935-.2636-1.0617-.5326-1.5105-.0537-.0896-.1101-.1745-.1684-.253-.0588-.079-.1191-.1513-.181-.2158l-8.3848-8.7363c-.2473-.2577-.5735-.3866-.8995-.3864" />
  </svg>
`,lo=M`
  <svg slot="start" viewBox="0 0 24 24">
    <path d="M15,14C17.67,14 23,15.33 23,18V20H7V18C7,15.33 12.33,14 15,14M15,12A4,4 0 0,1 11,8A4,4 0 0,1 15,4A4,4 0 0,1 19,8A4,4 0 0,1 15,12M5,9.59L7.12,7.46L8.54,8.88L6.41,11L8.54,13.12L7.12,14.54L5,12.41L2.88,14.54L1.46,13.12L3.59,11L1.46,8.88L2.88,7.46L5,9.59Z" />
  </svg>
`,co=M`
  <svg slot="start" viewBox="0 0 24 24">
    <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
  </svg>
`,ho=[73,77,80,82,79,86,1];var he;(function(r){r[r.CURRENT_STATE=1]="CURRENT_STATE",r[r.ERROR_STATE=2]="ERROR_STATE",r[r.RPC=3]="RPC",r[r.RPC_RESULT=4]="RPC_RESULT"})(he||(he={}));var K;(function(r){r[r.STOPPED=0]="STOPPED",r[r.READY=2]="READY",r[r.PROVISIONING=3]="PROVISIONING",r[r.PROVISIONED=4]="PROVISIONED"})(K||(K={}));const po={0:"NO_ERROR",1:"INVALID_RPC_PACKET",2:"UNKNOWN_RPC_COMMAND",3:"UNABLE_TO_CONNECT",5:"BAD_HOSTNAME",254:"TIMEOUT",255:"UNKNOWN_ERROR"};class ui extends Error{constructor(){super("Port is not ready")}}const uo=(r,e=2)=>{let t=r.toString(16).toUpperCase();return t.startsWith("-")?"-0x"+t.substring(1).padStart(e,"0"):"0x"+t.padStart(e,"0")},Ot=r=>"["+r.map(e=>uo(e)).join(", ")+"]",fi=r=>r.sort((e,t)=>e.name.toLocaleLowerCase().localeCompare(t.name.toLocaleLowerCase())),fo=(r,e)=>{const t=new Map;for(const i of r)t.set(i.name,i);for(const i of e)t.set(i.name,i);return fi(Array.from(t.values()))},mo=3e3,vo=3e4,Lt=3e4,go=(r,e)=>r.length!==e.length?!0:r.some((t,i)=>t.name!==e[i].name||t.rssi!==e[i].rssi||t.secured!==e[i].secured);class bo extends EventTarget{get error(){return this._error}set error(e){this._error=e,this.dispatchEvent(new CustomEvent("error-changed",{detail:this._error}))}constructor(e,t){if(super(),this.port=e,this.logger=t,this._error=0,this._rpcLock=Promise.resolve(),e.readable===null)throw new Error("Port is not readable");if(e.writable===null)throw new Error("Port is not writable")}async initialize(e=1e3){if(this.logger.log("Initializing Improv Serial"),this._processInput(),this._reader===void 0)throw new ui;let t;try{await new Promise(async(i,o)=>{setTimeout(()=>o(new Error("Improv Wi-Fi Serial not detected")),e),t=setInterval(()=>this._sendRPC(2,[]),1e3),await this.requestCurrentState(),i(void 0)}),clearInterval(t),await this.requestInfo()}catch(i){throw await this.close(),i}finally{clearInterval(t)}return this.info}async close(){this._reader&&await new Promise(e=>{this._reader.cancel(),this.addEventListener("disconnect",e,{once:!0})})}async requestCurrentState(){var e;const t=new AbortController;let i;try{await new Promise((o,s)=>{this.addEventListener("state-changed",()=>o(),{once:!0,signal:t.signal}),i=this._sendRPCWithResponse(2,[]),i.catch(s)})}catch(o){throw new Error(`Error fetching current state: ${o}`)}finally{t.abort()}if(this.state!==K.PROVISIONED){(e=this._rpcFeedback)===null||e===void 0||e.resolve([]);return}this.nextUrl=(await i)[0]}async requestInfo(e){const t=await this._sendRPCWithResponse(3,[],e);this.info={firmware:t[0],version:t[1],name:t[3],chipFamily:t[2],osName:t.length>4?t[4]:null,osVersion:t.length>5?t[5]:null}}async provision(e,t,i){const o=new TextEncoder,s=o.encode(e),n=o.encode(t),d=[s.length,...s,n.length,...n],h=await this._sendRPCWithResponse(1,d,i);this.nextUrl=h[0]}async scan(e){const i=(await this._sendRPCWithMultipleResponses(4,[],e)).map(([o,s,n])=>({name:o,rssi:parseInt(s),secured:n!=="NO"}));return fi(i)}subscribeSSIDs(e){let t=!0,i,o;const s=(async()=>{for(;t;){let n;try{n=await this.scan(vo)}catch(h){this.logger.error("Error while scanning for Wi-Fi networks",h),t&&i===void 0&&e(null);break}if(!t)break;const d=i===void 0?n:fo(i,n);(i===void 0||go(i,d))&&(i=d,e(d)),await new Promise(h=>{o=h,setTimeout(h,mo)})}})();return()=>(t=!1,o==null||o(),s)}async getHostname(e){return(await this._sendRPCWithResponse(5,[],e))[0]}async setHostname(e,t){const i=new TextEncoder;return(await this._sendRPCWithResponse(5,[...i.encode(e)],t))[0]}async getDeviceName(e){return(await this._sendRPCWithResponse(6,[],e))[0]}async setDeviceName(e,t){const i=new TextEncoder,o=await this._sendRPCWithResponse(6,[...i.encode(e)],t);return this.info&&(this.info.name=o[0]),o[0]}async requestNetworkState(e){const t=await this._sendRPCWithResponse(7,[],e),i=parseInt(t[0]);return{online:(i&1)!==0,supportsWifi:(i&2)!==0,supportsEthernet:(i&4)!==0,supportsThread:(i&8)!==0,supportsModem:(i&16)!==0,urls:t.slice(1)}}_sendRPC(e,t){this.writePacketToStream(he.RPC,[e,t.length,...t])}_enqueueRPC(e,t){const i=()=>this._awaitRPCResultWithTimeout(e(),t).finally(()=>{this._rpcFeedback=void 0}),o=this._rpcLock.then(i,i);return this._rpcLock=o.catch(()=>{}),o}_sendRPCWithResponse(e,t,i=Lt){return this._enqueueRPC(()=>new Promise((o,s)=>{this._rpcFeedback={command:e,resolve:o,reject:s},this._sendRPC(e,t)}),i)}_sendRPCWithMultipleResponses(e,t,i=Lt){return this._enqueueRPC(()=>new Promise((o,s)=>{this._rpcFeedback={command:e,resolve:o,reject:s,receivedData:[]},this._sendRPC(e,t)}),i)}async _awaitRPCResultWithTimeout(e,t){if(!t)return await e;const i=setTimeout(()=>this._setError(254),t);try{return await e}finally{clearTimeout(i)}}async _processInput(){this.logger.debug("Starting read loop"),this._reader=this.port.readable.getReader();try{let e=[],t,i=0;for(;;){const{value:o,done:s}=await this._reader.read();if(s)break;if(!(!o||o.length===0))for(const n of o){if(t===!1){n===10&&(t=void 0);continue}if(t===!0){e.push(n),e.length===i&&(this._handleIncomingPacket(e),t=void 0,e=[]);continue}if(n===10){e=[];continue}if(e.push(n),e.length!==9)continue;if(t=String.fromCharCode(...e.slice(0,6))==="IMPROV",!t){e=[];continue}i=9+e[8]+1}}}catch(e){this.logger.error("Error while reading serial port",e)}finally{this._reader.releaseLock(),this._reader=void 0}this.logger.debug("Finished read loop"),this.dispatchEvent(new Event("disconnect"))}_handleIncomingPacket(e){const t=e.slice(6),i=t[0],o=t[1],s=t[2],n=t.slice(3,3+s);if(this.logger.debug("PROCESS",{version:i,packetType:o,packetLength:s,data:Ot(n)}),i!==1){this.logger.error("Received unsupported version",i);return}let d=t[3+s],h=0;for(let f=0;f<e.length-1;f++)h+=e[f];if(h=h&255,h!==d){this.logger.error(`Received invalid checksum ${d}. Expected ${h}`);return}if(o===he.CURRENT_STATE)this.state=n[0],this.dispatchEvent(new CustomEvent("state-changed",{detail:this.state}));else if(o===he.ERROR_STATE)this._setError(n[0]);else if(o===he.RPC_RESULT){if(!this._rpcFeedback){this.logger.error("Received result while not waiting for one");return}const f=n[0];if(f!==this._rpcFeedback.command){this.logger.error(`Received result for command ${f} but expected ${this._rpcFeedback.command}`);return}const v=[],m=n[1],w=new TextDecoder("utf-8");let g=2;for(;g<2+m;)v.push(w.decode(new Uint8Array(n.slice(g+1,g+n[g]+1)))),g+=n[g]+1;"receivedData"in this._rpcFeedback?v.length>0?this._rpcFeedback.receivedData.push(v):this._rpcFeedback.resolve(this._rpcFeedback.receivedData):this._rpcFeedback.resolve(v)}else this.logger.error("Unable to handle packet",t)}async writePacketToStream(e,t){const i=new Uint8Array([...ho,e,t.length,...t,0,0]);i[i.length-2]=i.reduce((s,n)=>s+n,0)&255,i[i.length-1]=10,this.logger.debug("Writing to stream:",Ot(new Array(...i)));const o=this.port.writable.getWriter();await o.write(i);try{o.releaseLock()}catch(s){console.error("Ignoring release lock error",s)}}_setError(e){e>0&&this._rpcFeedback&&this._rpcFeedback.reject(po[e]||`UNKNOWN_ERROR (${e})`),this.error=e}}const me=async(r,e)=>{await r.setRTS(!0),await ue(100),await e.after()},yo=async(r,e,t,i,o)=>{let s,n;const d=u=>r({...u,manifest:i,build:s,chipFamily:n}),h=new zt(e),f=e.getInfo(),v=f&&f.usbVendorId===12346&&f.usbProductId!==void 0&&[4097,4098,4099,2,3].includes(f.usbProductId),m=new bi({transport:h,baudrate:115200,enableTracing:!1});window.esploader=m,d({state:"initializing",message:"Initializing...",details:{done:!1}});try{await m.main(),await m.flashId()}catch(u){console.error(u),d({state:"error",message:"Failed to initialize. Try resetting your device or holding the BOOT button while clicking INSTALL.",details:{error:"failed_initialize",details:u}}),await me(h,m),await h.disconnect();return}n=m.chip.CHIP_NAME,d({state:"initializing",message:`Initialized. Found ${n}`,details:{done:!0}});const w=v?"cdc":"uart";if(s=i.builds.find(u=>u.chipFamily===n&&u.serialType===w)||i.builds.find(u=>u.chipFamily===n&&u.serialType===void 0),!s){d({state:"error",message:`Your ${n} board is not supported.`,details:{error:"not_supported",details:n}}),await me(h,m),await h.disconnect();return}d({state:"preparing",message:"Preparing installation...",details:{done:!1}});const g=t.startsWith("blob:")||t.startsWith("data:")?location.toString():new URL(t,location.toString()).toString(),$=s.parts.map(async u=>{const C=new URL(u.path,g).toString(),E=await fetch(C);if(!E.ok)throw new Error(`Downloading firmware ${u.path} failed: ${E.status}`);const I=new FileReader,q=await E.blob();return new Promise(Y=>{I.addEventListener("load",()=>Y(I.result)),I.readAsArrayBuffer(q)})}),x=[];let _=0;for(let u=0;u<$.length;u++)try{const C=await $[u],E=new Uint8Array(C,0,C.byteLength);x.push({data:E,address:s.parts[u].offset}),_+=E.length}catch(C){d({state:"error",message:C.message,details:{error:"failed_firmware_download",details:C.message}}),await me(h,m),await h.disconnect();return}d({state:"preparing",message:"Installation prepared",details:{done:!0}}),o&&(d({state:"erasing",message:"Erasing device...",details:{done:!1}}),await m.eraseFlash(),d({state:"erasing",message:"Device erased",details:{done:!0}})),d({state:"writing",message:"Writing progress: 0%",details:{bytesTotal:_,bytesWritten:0,percentage:0}});let k=0;try{await m.writeFlash({fileArray:x,flashSize:"keep",flashMode:"keep",flashFreq:"keep",eraseAll:!1,compress:!0,reportProgress:(u,C,E)=>{const I=C/E*x[u].data.length,q=Math.floor((k+I)/_*100);if(C===E){k+=I;return}d({state:"writing",message:`Writing progress: ${q}%`,details:{bytesTotal:_,bytesWritten:k+C,percentage:q}})}})}catch(u){d({state:"error",message:u.message,details:{error:"write_failed",details:u}}),await me(h,m),await h.disconnect();return}d({state:"writing",message:"Writing complete",details:{bytesTotal:_,bytesWritten:k,percentage:100}}),await me(h,m),console.log("DISCONNECT"),await h.disconnect(),d({state:"finished",message:"All done!"})},xo=(r,e="")=>{const t=document.createElement("a");t.target="_blank",t.href=r,t.download=e,document.body.appendChild(t),t.dispatchEvent(new MouseEvent("click")),document.body.removeChild(t)},_o=(r,e="")=>{const t=new Blob([r],{type:"text/plain"}),i=URL.createObjectURL(t);xo(i,e),setTimeout(()=>URL.revokeObjectURL(i),0)},wo=(r,e,t,i)=>{i=i||{};const o=new CustomEvent(e,{bubbles:i.bubbles===void 0?!0:i.bubbles,cancelable:!!i.cancelable,composed:i.composed===void 0?!0:i.composed,detail:t});r.dispatchEvent(o)},Co=async r=>{const e=new URL(r,location.toString()).toString(),i=await(await fetch(e)).json();return"new_install_skip_erase"in i&&(console.warn('Manifest option "new_install_skip_erase" is deprecated. Use "new_install_prompt_erase" instead.'),i.new_install_skip_erase&&(i.new_install_prompt_erase=!0)),i},Eo=T`
  :host {
    --roboto-font: Roboto, system-ui;
    --text-color: rgba(0, 0, 0, 0.6);
    --danger-color: #db4437;

    --md-sys-color-primary: #03a9f4;
    --md-sys-color-on-primary: #fff;
    --md-ref-typeface-brand: var(--roboto-font);
    --md-ref-typeface-plain: var(--roboto-font);

    --md-sys-color-surface: #fff;
    --md-sys-color-surface-container: #fff;
    --md-sys-color-surface-container-high: #fff;
    --md-sys-color-surface-container-highest: #f5f5f5;
    --md-sys-color-secondary-container: #e0e0e0;

    --md-sys-typescale-headline-font: var(--roboto-font);
    --md-sys-typescale-title-font: var(--roboto-font);
  }

  a {
    color: var(--md-sys-color-primary);
  }
`,ko="10.4.0";console.log(`ESP Web Tools ${ko} by Open Home Foundation; https://esphome.github.io/esp-web-tools/`);const Ke="⚠️",Dt="🎉",Io=9100,To=r=>r.length?r.reduce((e,t)=>t.rssi>e.rssi?t:e).name:null,So=r=>r>=-50?{icon:to,class:"signal-excellent"}:r>=-60?{icon:io,class:"signal-good"}:r>=-70?{icon:ro,class:"signal-fair"}:{icon:oo,class:"signal-weak"};class W extends A{constructor(){super(...arguments),this.logger=console,this._state="DASHBOARD",this._installErase=!1,this._installConfirmed=!1,this._provisionForce=!1,this._wasProvisioned=!1,this._busy=!1,this._selectedSsid=null,this._manualSsid="",this._bodyOverflow=null,this._handleDisconnect=()=>{this._state="ERROR",this._error="Disconnected"}}render(){if(!this.port)return c``;let e,t,i=!1;return this._client===void 0&&this._state!=="INSTALL"&&this._state!=="LOGS"?this._error?[e,t]=this._renderError(this._error):t=this._renderProgress("Connecting"):this._state==="INSTALL"?[e,t,i]=this._renderInstall():this._state==="ASK_ERASE"?[e,t]=this._renderAskErase():this._state==="ERROR"?[e,t]=this._renderError(this._error):this._state==="DASHBOARD"?[e,t,i]=this._client?this._renderDashboard():this._renderDashboardNoImprov():this._state==="PROVISION"?[e,t]=this._renderProvision():this._state==="LOGS"&&([e,t]=this._renderLogs()),c`
      <ew-dialog
        open
        .heading=${e}
        @cancel=${this._preventDefault}
        @closed=${this._handleClose}
      >
        ${e?c`<div slot="headline">${e}</div>`:""}
        ${i?c`
              <ew-icon-button slot="headline" @click=${this._closeDialog}>
                ${eo}
              </ew-icon-button>
            `:""}
        ${t}
      </ew-dialog>
    `}_renderProgress(e,t){return c`
      <ewt-page-progress
        slot="content"
        .label=${e}
        .progress=${t}
      ></ewt-page-progress>
    `}_renderError(e){const t="Error",i=c`
      <ewt-page-message
        slot="content"
        .icon=${Ke}
        .label=${e}
      ></ewt-page-message>
      <div slot="actions">
        <ew-text-button @click=${this._closeDialog}>Close</ew-text-button>
      </div>
    `;return[t,i]}_renderDashboard(){const e=this._manifest.name;let t,i=!0;return t=c`
      <div slot="content">
        <ew-list>
          <ew-list-item>
            <div slot="headline">Connected to ${this._info.name}</div>
            <div slot="supporting-text">
              ${this._info.firmware}&nbsp;${this._info.version}
              (${this._info.chipFamily})
            </div>
          </ew-list-item>
          ${this._isSameVersion?"":c`
                <ew-list-item
                  type="button"
                  @click=${()=>{this._isSameFirmware?this._startInstall(!1):this._manifest.new_install_prompt_erase?this._state="ASK_ERASE":this._startInstall(!0)}}
                >
                  ${St}
                  <div slot="headline">
                    ${this._isSameFirmware?`Update ${this._manifest.name}`:`Install ${this._manifest.name}`}
                  </div>
                </ew-list-item>
              `}
          ${this._client.nextUrl===void 0?"":c`
                <ew-list-item
                  type="link"
                  href=${this._client.nextUrl}
                  target="_blank"
                >
                  ${Rt}
                  <div slot="headline">Visit Device</div>
                </ew-list-item>
              `}
          ${!this._manifest.home_assistant_domain||this._client.state!==K.PROVISIONED?"":c`
                <ew-list-item
                  type="link"
                  href=${`https://my.home-assistant.io/redirect/config_flow_start/?domain=${this._manifest.home_assistant_domain}`}
                  target="_blank"
                >
                  ${$t}
                  <div slot="headline">Add to Home Assistant</div>
                </ew-list-item>
              `}
          <ew-list-item
            type="button"
            @click=${()=>{this._state="PROVISION",this._client.state===K.PROVISIONED&&(this._provisionForce=!0)}}
          >
            ${no}
            <div slot="headline">
              ${this._client.state===K.PROVISIONED?"Change Wi-Fi":"Connect to Wi-Fi"}
            </div>
          </ew-list-item>
          <ew-list-item
            type="button"
            @click=${async()=>{const o=this._client;o&&(await this._closeClientWithoutEvents(o),await ue(100)),this._client=void 0,this._state="LOGS"}}
          >
            ${At}
            <div slot="headline">Logs & Console</div>
          </ew-list-item>
          ${this._isSameFirmware&&this._manifest.funding_url?c`
                <ew-list-item
                  type="link"
                  href=${this._manifest.funding_url}
                  target="_blank"
                >
                  ${co}
                  <div slot="headline">Fund Development</div>
                </ew-list-item>
              `:""}
          ${this._isSameVersion?c`
                <ew-list-item
                  type="button"
                  class="danger"
                  @click=${()=>this._startInstall(!0)}
                >
                  ${lo}
                  <div slot="headline">Erase User Data</div>
                </ew-list-item>
              `:""}
        </ew-list>
      </div>
    `,[e,t,i]}_renderDashboardNoImprov(){const e=this._manifest.name;let t,i=!0;return t=c`
      <div slot="content">
        <ew-list>
          <ew-list-item
            type="button"
            @click=${()=>{this._manifest.new_install_prompt_erase?this._state="ASK_ERASE":this._startInstall(!0)}}
          >
            ${St}
            <div slot="headline">${`Install ${this._manifest.name}`}</div>
          </ew-list-item>
          <ew-list-item
            type="button"
            @click=${async()=>{this._client=void 0,this._state="LOGS"}}
          >
            ${At}
            <div slot="headline">Logs & Console</div>
          </ew-list-item>
        </ew-list>
      </div>
    `,[e,t,i]}_renderProvision(){var e;let t="Configure Wi-Fi",i;if(this._busy)return[t,this._renderProgress("Trying to connect")];if(this._client.state===K.STOPPED)t=void 0,i=c`
        <div slot="content">
          <ewt-page-message
            .icon=${Ke}
            .label=${c`The connected device has Wi-Fi turned off, so it can't
              be configured right now.<br />Enable the device's Wi-Fi, then try
              again.`}
          ></ewt-page-message>
        </div>
        <div slot="actions">
          <ew-text-button
            @click=${()=>{this._state="DASHBOARD"}}
          >
            Back
          </ew-text-button>
        </div>
      `;else if(!this._provisionForce&&this._client.state===K.PROVISIONED){t=void 0;const o=!this._wasProvisioned&&(this._client.nextUrl!==void 0||"home_assistant_domain"in this._manifest);i=c`
        <div slot="content">
          <ewt-page-message
            .icon=${Dt}
            label="Device connected to the network!"
          ></ewt-page-message>
          ${o?c`
                <ew-list>
                  ${this._client.nextUrl===void 0?"":c`
                        <ew-list-item
                          type="link"
                          href=${this._client.nextUrl}
                          target="_blank"
                          @click=${()=>{this._state="DASHBOARD"}}
                        >
                          ${Rt}
                          <div slot="headline">Visit Device</div>
                        </ew-list-item>
                      `}
                  ${this._manifest.home_assistant_domain?c`
                        <ew-list-item
                          type="link"
                          href=${`https://my.home-assistant.io/redirect/config_flow_start/?domain=${this._manifest.home_assistant_domain}`}
                          target="_blank"
                          @click=${()=>{this._state="DASHBOARD"}}
                        >
                          ${$t}
                          <div slot="headline">Add to Home Assistant</div>
                        </ew-list-item>
                      `:""}
                  <ew-list-item
                    type="button"
                    @click=${()=>{this._state="DASHBOARD"}}
                  >
                    <div slot="start" class="fake-icon"></div>
                    <div slot="headline">Skip</div>
                  </ew-list-item>
                </ew-list>
              `:""}
        </div>

        ${o?"":c`
              <div slot="actions">
                <ew-text-button
                  @click=${()=>{this._state="DASHBOARD"}}
                >
                  Continue
                </ew-text-button>
              </div>
            `}
      `}else if(this._ssids===void 0)i=this._renderProgress("Scanning for networks");else{let o;switch(this._client.error){case 3:o="Unable to connect";break;case 254:o="Timeout";break;case 0:case 2:break;default:o=`Unknown error (${this._client.error})`}const s=(e=this._ssids)===null||e===void 0?void 0:e.find(n=>n.name===this._selectedSsid);i=c`
        <div slot="content">
          <div>Connect your device to the network to start using it.</div>
          ${o?c`<p class="error">${o}</p>`:""}
          ${this._ssids!==null?c`
                <ew-filled-select
                  menu-positioning="fixed"
                  label="Network"
                  @change=${n=>{const d=n.target.selectedIndex;this._selectedSsid=d===this._ssids.length?null:this._ssids[d].name,this._manualSsid=""}}
                >
                  ${this._ssids.map(n=>{const d=So(n.rssi);return c`
                      <ew-select-option
                        .selected=${s===n}
                        .value=${n.name}
                      >
                        <span slot="start" class=${d.class}>
                          ${d.icon}
                        </span>
                        <span slot="headline">${n.name}</span>
                        <span slot="end" class="network-details">
                          <span class="signal-strength">${n.rssi}dB</span>
                          <span
                            class=${n.secured?"lock-secured":"lock-unsecured"}
                          >
                            ${n.secured?so:ao}
                          </span>
                        </span>
                      </ew-select-option>
                    `})}
                  <ew-divider></ew-divider>
                  <ew-select-option .selected=${!s}>
                    Join other…
                  </ew-select-option>
                </ew-filled-select>
              `:""}
          ${s?"":c`
                  <ew-filled-text-field
                    label="Network Name"
                    name="ssid"
                    .value=${this._manualSsid}
                  ></ew-filled-text-field>
                `}
          ${!s||s.secured?c`
                <ew-filled-text-field
                  label="Password"
                  name="password"
                  type="password"
                  @keydown=${n=>{n.key==="Enter"&&this._doProvision()}}
                ></ew-filled-text-field>
              `:""}
        </div>
        <div slot="actions">
          <ew-text-button
            @click=${()=>{this._state="DASHBOARD"}}
          >
            ${this._installState&&this._installErase?"Skip":"Back"}
          </ew-text-button>
          <ew-text-button @click=${this._doProvision}>Connect</ew-text-button>
        </div>
      `}return[t,i]}_renderAskErase(){const e="Erase device",t=c`
      <div slot="content">
        <div>
          Do you want to erase the device before installing
          ${this._manifest.name}? All data on the device will be lost.
        </div>
        <label class="formfield">
          <ew-checkbox touch-target="wrapper" class="danger"></ew-checkbox>
          Erase device
        </label>
      </div>
      <div slot="actions">
        <ew-text-button
          @click=${()=>{this._state="DASHBOARD"}}
        >
          Back
        </ew-text-button>
        <ew-text-button
          @click=${()=>{const i=this.shadowRoot.querySelector("ew-checkbox");this._startInstall(i.checked)}}
        >
          Next
        </ew-text-button>
      </div>
    `;return[e,t]}_renderInstall(){let e,t;const o=!this._installErase&&this._isSameFirmware;if(!this._installConfirmed&&this._isSameVersion)e="Erase User Data",t=c`
        <div slot="content">
          Do you want to reset your device and erase all user data from your
          device?
        </div>
        <div slot="actions">
          <ew-text-button class="danger" @click=${this._confirmInstall}>
            Erase User Data
          </ew-text-button>
        </div>
      `;else if(this._installConfirmed)if(!this._installState||this._installState.state==="initializing"||this._installState.state==="preparing")e="Installing",t=this._renderProgress("Preparing installation");else if(this._installState.state==="erasing")e="Installing",t=this._renderProgress("Erasing");else if(this._installState.state==="writing"||this._installState.state==="finished"&&this._client===void 0){e="Installing";let s,n;this._installState.state==="finished"?n="Wrapping up":this._installState.details.percentage<4?n="Installing":s=this._installState.details.percentage,t=this._renderProgress(c`
          ${n?c`${n}<br />`:""}
          <br />
          This will take
          ${this._installState.chipFamily==="ESP8266"?"a minute":"2 minutes"}.<br />
          Keep this page visible to prevent slow down
        `,s)}else if(this._installState.state==="finished"){e=void 0;const s=this._client!==null;t=c`
        <ewt-page-message
          slot="content"
          .icon=${Dt}
          label="Installation complete!"
        ></ewt-page-message>

        <div slot="actions">
          <ew-text-button
            @click=${()=>{this._state=s&&this._installErase?"PROVISION":"DASHBOARD"}}
          >
            Next
          </ew-text-button>
        </div>
      `}else this._installState.state==="error"&&(e="Installation failed",t=c`
        <ewt-page-message
          slot="content"
          .icon=${Ke}
          .label=${this._installState.message}
        ></ewt-page-message>
        <div slot="actions">
          <ew-text-button
            @click=${async()=>{this._initialize(),this._state="DASHBOARD"}}
          >
            Back
          </ew-text-button>
        </div>
      `);else{e="Confirm Installation";const s=o?"update to":"install";t=c`
        <div slot="content">
          ${o?c`Your device is running
                ${this._info.firmware}&nbsp;${this._info.version}.<br /><br />`:""}
          Do you want to ${s}
          ${this._manifest.name}&nbsp;${this._manifest.version}?
          ${this._installErase?c`<br /><br />All data on the device will be erased.`:""}
        </div>
        <div slot="actions">
          <ew-text-button
            @click=${()=>{this._state="DASHBOARD"}}
          >
            Back
          </ew-text-button>
          <ew-text-button @click=${this._confirmInstall}>
            Install
          </ew-text-button>
        </div>
      `}return[e,t,!1]}_renderLogs(){let e="Logs",t;return t=c`
      <div slot="content">
        <ewt-console .port=${this.port} .logger=${this.logger}></ewt-console>
      </div>
      <div slot="actions">
        <ew-text-button
          @click=${async()=>{await this.shadowRoot.querySelector("ewt-console").reset()}}
        >
          Reset Device
        </ew-text-button>
        <ew-text-button
          @click=${()=>{_o(this.shadowRoot.querySelector("ewt-console").logs(),"esp-web-tools-logs.txt"),this.shadowRoot.querySelector("ewt-console").reset()}}
        >
          Download Logs
        </ew-text-button>
        <ew-text-button
          @click=${async()=>{await this.shadowRoot.querySelector("ewt-console").disconnect(),this._state="DASHBOARD",this._initialize()}}
        >
          Back
        </ew-text-button>
      </div>
    `,[e,t]}willUpdate(e){e.has("_state")&&(this._state!=="ERROR"&&(this._error=void 0),this._state==="PROVISION"?this._ssids=void 0:this._provisionForce=!1,this._state==="INSTALL"&&(this._installConfirmed=!1,this._installState=void 0))}get _showsProvisionForm(){var e;const t=(e=this._client)===null||e===void 0?void 0:e.state;return t!==void 0&&t!==K.STOPPED&&(this._provisionForce||t!==K.PROVISIONED)}_syncScanning(){const e=this._state==="PROVISION"&&!this._busy&&this._showsProvisionForm;if(e!==!!this._unsubSSIDs){if(!e){this._stopScanning();return}this._scanGraceTimeout=setTimeout(()=>{this._scanGraceTimeout=void 0,this._ssids===void 0&&(this._ssids=[],this._selectedSsid=null)},Io),this._unsubSSIDs=this._client.subscribeSSIDs(t=>{this._ssids===void 0&&(t==null?void 0:t.length)===0&&this._scanGraceTimeout||t===null&&this._ssids||(this._ssids===void 0?this._selectedSsid=t===null?null:To(t):this._selectedSsid!==null&&!(t!=null&&t.some(i=>i.name===this._selectedSsid))&&(this._manualSsid=this._selectedSsid,this._selectedSsid=null),this._ssids=t)})}}async _stopScanning(){clearTimeout(this._scanGraceTimeout),this._scanGraceTimeout=void 0;const e=this._unsubSSIDs;e&&(this._unsubSSIDs=void 0,await e())}firstUpdated(e){super.firstUpdated(e),this._bodyOverflow=document.body.style.overflow,document.body.style.overflow="hidden",this._initialize()}updated(e){super.updated(e),e.has("_state")&&this.setAttribute("state",this._state),this._syncScanning(),this._state==="PROVISION"&&(e.has("_selectedSsid")&&this._selectedSsid===null?this._focusFormElement("ew-filled-text-field[name=ssid]"):e.has("_ssids")&&e.get("_ssids")===void 0&&this._focusFormElement())}_focusFormElement(e="ew-filled-text-field, ew-filled-select"){const t=this.shadowRoot.querySelector(e);t&&t.updateComplete.then(()=>setTimeout(()=>t.focus(),100))}async _initialize(e=!1){if(this.port.readable===null||this.port.writable===null){this._state="ERROR",this._error="Serial port is not readable/writable. Close any other application using it and try again.";return}try{this._manifest=await Co(this.manifestPath)}catch{this._state="ERROR",this._error="Failed to download manifest";return}if(this._manifest.new_install_improv_wait_time===0){this._client=null;return}const t=new bo(this.port,this.logger);t.addEventListener("state-changed",()=>{this.requestUpdate()}),t.addEventListener("error-changed",()=>this.requestUpdate());try{const i=e?this._manifest.new_install_improv_wait_time!==void 0?this._manifest.new_install_improv_wait_time*1e3:1e4:1500;this._info=await t.initialize(i),this._client=t,t.addEventListener("disconnect",this._handleDisconnect)}catch(i){this._info=void 0,i instanceof ui?(this._state="ERROR",this._error="Serial port is not ready. Close any other application using it and try again."):(this._client=null,this.logger.error("Improv initialization failed.",i))}}_startInstall(e){this._state="INSTALL",this._installErase=e,this._installConfirmed=!1}async _confirmInstall(){this._installConfirmed=!0,this._installState=void 0,this._client&&await this._closeClientWithoutEvents(this._client),this._client=void 0,await this.port.close(),yo(e=>{this._installState=e,e.state==="finished"?ue(100).then(()=>this.port.open({baudRate:115200,bufferSize:8192})).then(()=>this._initialize(!0)).then(()=>this.requestUpdate()):e.state==="error"&&ue(100).then(()=>this.port.open({baudRate:115200,bufferSize:8192}))},this.port,this.manifestPath,this._manifest,this._installErase)}async _doProvision(){var e;const t=this._selectedSsid===null?this.shadowRoot.querySelector("ew-filled-text-field[name=ssid]").value:this._selectedSsid,i=((e=this.shadowRoot.querySelector("ew-filled-text-field[name=password]"))===null||e===void 0?void 0:e.value)||"";this._busy=!0,this._wasProvisioned=this._client.state===K.PROVISIONED,await this._stopScanning();try{await this._client.provision(t,i,45e3)}catch{return}finally{this._busy=!1,this._provisionForce=!1}}_closeDialog(){this.shadowRoot.querySelector("ew-dialog").close()}async _handleClose(){this._client&&await this._closeClientWithoutEvents(this._client),wo(this,"closed"),document.body.style.overflow=this._bodyOverflow,this.parentNode.removeChild(this)}get _isSameFirmware(){var e;return this._info?!((e=this.overrides)===null||e===void 0)&&e.checkSameFirmware?this.overrides.checkSameFirmware(this._manifest,this._info):this._info.firmware===this._manifest.name:!1}get _isSameVersion(){return this._isSameFirmware&&this._info.version===this._manifest.version}async _closeClientWithoutEvents(e){await this._stopScanning(),e.removeEventListener("disconnect",this._handleDisconnect),await e.close()}_preventDefault(e){e.preventDefault()}}W.styles=[Eo,T`
      :host {
        --mdc-dialog-max-width: 390px;
      }
      div[slot="headline"] {
        padding-right: 48px;
      }
      ew-icon-button[slot="headline"] {
        position: absolute;
        right: 4px;
        top: 8px;
      }
      ew-icon-button[slot="headline"] svg {
        padding: 8px;
        color: var(--text-color);
      }
      .dialog-nav svg {
        color: var(--text-color);
      }
      .table-row {
        display: flex;
      }
      .table-row.last {
        margin-bottom: 16px;
      }
      .table-row svg {
        width: 20px;
        margin-right: 8px;
      }
      ew-filled-text-field,
      ew-filled-select {
        display: block;
        margin-top: 16px;
      }
      ew-select-option svg {
        width: 24px;
        height: 24px;
        display: block;
      }
      .network-details {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: 16px;
        color: var(--text-color);
        font-size: 12px;
      }
      .signal-excellent,
      .signal-good,
      .lock-secured {
        color: #34a853;
      }
      .signal-fair {
        color: #fbbc04;
      }
      .signal-weak,
      .lock-unsecured {
        color: var(--danger-color);
      }
      label.formfield {
        display: inline-flex;
        align-items: center;
        padding-right: 8px;
      }
      ew-list {
        margin: 0 -24px;
        padding: 0;
      }
      ew-list-item svg {
        height: 24px;
      }
      ewt-page-message + ew-list {
        padding-top: 16px;
      }
      .fake-icon {
        width: 24px;
      }
      .error {
        color: var(--danger-color);
      }
      .danger {
        --mdc-theme-primary: var(--danger-color);
        --mdc-theme-secondary: var(--danger-color);
        --md-sys-color-primary: var(--danger-color);
        --md-sys-color-on-surface: var(--danger-color);
      }
      button.link {
        background: none;
        color: inherit;
        border: none;
        padding: 0;
        font: inherit;
        text-align: left;
        text-decoration: underline;
        cursor: pointer;
      }
      :host([state="LOGS"]) ew-dialog {
        max-width: 90vw;
        max-height: 90vh;
      }
      ewt-console {
        width: calc(80vw - 48px);
        height: calc(90vh - 168px);
      }
    `];a([y()],W.prototype,"_client",void 0);a([y()],W.prototype,"_state",void 0);a([y()],W.prototype,"_installErase",void 0);a([y()],W.prototype,"_installConfirmed",void 0);a([y()],W.prototype,"_installState",void 0);a([y()],W.prototype,"_provisionForce",void 0);a([y()],W.prototype,"_error",void 0);a([y()],W.prototype,"_busy",void 0);a([y()],W.prototype,"_ssids",void 0);a([y()],W.prototype,"_selectedSsid",void 0);customElements.define("ewt-install-dialog",W);export{W as EwtInstallDialog};
//# sourceMappingURL=install-dialog-DoNUK8X1.js.map

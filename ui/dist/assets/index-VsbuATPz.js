(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function i(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=i(r);fetch(r.href,n)}})();/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const sn=globalThis,rl=sn.ShadowRoot&&(sn.ShadyCSS===void 0||sn.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,nl=Symbol(),ic=new WeakMap;let Sd=class{constructor(e,i,s){if(this._$cssResult$=!0,s!==nl)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=i}get styleSheet(){let e=this.o;const i=this.t;if(rl&&e===void 0){const s=i!==void 0&&i.length===1;s&&(e=ic.get(i)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&ic.set(i,e))}return e}toString(){return this.cssText}};const qp=t=>new Sd(typeof t=="string"?t:t+"",void 0,nl),we=(t,...e)=>{const i=t.length===1?t[0]:e.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[n+1],t[0]);return new Sd(i,t,nl)},Vp=(t,e)=>{if(rl)t.adoptedStyleSheets=e.map(i=>i instanceof CSSStyleSheet?i:i.styleSheet);else for(const i of e){const s=document.createElement("style"),r=sn.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=i.cssText,t.appendChild(s)}},sc=rl?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let i="";for(const s of e.cssRules)i+=s.cssText;return qp(i)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Qp,defineProperty:jp,getOwnPropertyDescriptor:Kp,getOwnPropertyNames:Xp,getOwnPropertySymbols:Jp,getPrototypeOf:Yp}=Object,ni=globalThis,rc=ni.trustedTypes,Gp=rc?rc.emptyScript:"",go=ni.reactiveElementPolyfillSupport,Hs=(t,e)=>t,pn={toAttribute(t,e){switch(e){case Boolean:t=t?Gp:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=t!==null;break;case Number:i=t===null?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch{i=null}}return i}},ol=(t,e)=>!Qp(t,e),nc={attribute:!0,type:String,converter:pn,reflect:!1,useDefault:!1,hasChanged:ol};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),ni.litPropertyMetadata??(ni.litPropertyMetadata=new WeakMap);let Ji=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,i=nc){if(i.state&&(i.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((i=Object.create(i)).wrapped=!0),this.elementProperties.set(e,i),!i.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(e,s,i);r!==void 0&&jp(this.prototype,e,r)}}static getPropertyDescriptor(e,i,s){const{get:r,set:n}=Kp(this.prototype,e)??{get(){return this[i]},set(o){this[i]=o}};return{get:r,set(o){const a=r==null?void 0:r.call(this);n==null||n.call(this,o),this.requestUpdate(e,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??nc}static _$Ei(){if(this.hasOwnProperty(Hs("elementProperties")))return;const e=Yp(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Hs("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Hs("properties"))){const i=this.properties,s=[...Xp(i),...Jp(i)];for(const r of s)this.createProperty(r,i[r])}const e=this[Symbol.metadata];if(e!==null){const i=litPropertyMetadata.get(e);if(i!==void 0)for(const[s,r]of i)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[i,s]of this.elementProperties){const r=this._$Eu(i,s);r!==void 0&&this._$Eh.set(r,i)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const i=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const r of s)i.unshift(sc(r))}else e!==void 0&&i.push(sc(e));return i}static _$Eu(e,i){const s=i.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(i=>i(this))}addController(e){var i;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((i=e.hostConnected)==null||i.call(e))}removeController(e){var i;(i=this._$EO)==null||i.delete(e)}_$E_(){const e=new Map,i=this.constructor.elementProperties;for(const s of i.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Vp(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostConnected)==null?void 0:s.call(i)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostDisconnected)==null?void 0:s.call(i)})}attributeChangedCallback(e,i,s){this._$AK(e,s)}_$ET(e,i){var n;const s=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,s);if(r!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:pn).toAttribute(i,s.type);this._$Em=e,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(e,i){var n,o;const s=this.constructor,r=s._$Eh.get(e);if(r!==void 0&&this._$Em!==r){const a=s.getPropertyOptions(r),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((n=a.converter)==null?void 0:n.fromAttribute)!==void 0?a.converter:pn;this._$Em=r;const c=l.fromAttribute(i,a.type);this[r]=c??((o=this._$Ej)==null?void 0:o.get(r))??c,this._$Em=null}}requestUpdate(e,i,s,r=!1,n){var o;if(e!==void 0){const a=this.constructor;if(r===!1&&(n=this[e]),s??(s=a.getPropertyOptions(e)),!((s.hasChanged??ol)(n,i)||s.useDefault&&s.reflect&&n===((o=this._$Ej)==null?void 0:o.get(e))&&!this.hasAttribute(a._$Eu(e,s))))return;this.C(e,i,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,i,{useDefault:s,reflect:r,wrapped:n},o){s&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,o??i??this[e]),n!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(i=void 0),this._$AL.set(e,i)),r===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(i){Promise.reject(i)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r){const{wrapped:a}=o,l=this[n];a!==!0||this._$AL.has(n)||l===void 0||this.C(n,void 0,o,l)}}let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),(s=this._$EO)==null||s.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(i)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(i)}willUpdate(e){}_$AE(e){var i;(i=this._$EO)==null||i.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(i=>this._$ET(i,this[i]))),this._$EM()}updated(e){}firstUpdated(e){}};Ji.elementStyles=[],Ji.shadowRootOptions={mode:"open"},Ji[Hs("elementProperties")]=new Map,Ji[Hs("finalized")]=new Map,go==null||go({ReactiveElement:Ji}),(ni.reactiveElementVersions??(ni.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ws=globalThis,oc=t=>t,gn=Ws.trustedTypes,ac=gn?gn.createPolicy("lit-html",{createHTML:t=>t}):void 0,Cd="$lit$",ti=`lit$${Math.random().toFixed(9).slice(2)}$`,Od="?"+ti,Zp=`<${Od}>`,Hi=document,Gs=()=>Hi.createComment(""),Zs=t=>t===null||typeof t!="object"&&typeof t!="function",al=Array.isArray,eg=t=>al(t)||typeof(t==null?void 0:t[Symbol.iterator])=="function",mo=`[ 	
\f\r]`,Ds=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,lc=/-->/g,cc=/>/g,Si=RegExp(`>|${mo}(?:([^\\s"'>=/]+)(${mo}*=${mo}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),hc=/'/g,dc=/"/g,Ad=/^(?:script|style|textarea|title)$/i,tg=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),g=tg(1),ps=Symbol.for("lit-noChange"),y=Symbol.for("lit-nothing"),fc=new WeakMap,Mi=Hi.createTreeWalker(Hi,129);function $d(t,e){if(!al(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return ac!==void 0?ac.createHTML(e):e}const ig=(t,e)=>{const i=t.length-1,s=[];let r,n=e===2?"<svg>":e===3?"<math>":"",o=Ds;for(let a=0;a<i;a++){const l=t[a];let c,h,d=-1,f=0;for(;f<l.length&&(o.lastIndex=f,h=o.exec(l),h!==null);)f=o.lastIndex,o===Ds?h[1]==="!--"?o=lc:h[1]!==void 0?o=cc:h[2]!==void 0?(Ad.test(h[2])&&(r=RegExp("</"+h[2],"g")),o=Si):h[3]!==void 0&&(o=Si):o===Si?h[0]===">"?(o=r??Ds,d=-1):h[1]===void 0?d=-2:(d=o.lastIndex-h[2].length,c=h[1],o=h[3]===void 0?Si:h[3]==='"'?dc:hc):o===dc||o===hc?o=Si:o===lc||o===cc?o=Ds:(o=Si,r=void 0);const u=o===Si&&t[a+1].startsWith("/>")?" ":"";n+=o===Ds?l+Zp:d>=0?(s.push(c),l.slice(0,d)+Cd+l.slice(d)+ti+u):l+ti+(d===-2?a:u)}return[$d(t,n+(t[i]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]};class er{constructor({strings:e,_$litType$:i},s){let r;this.parts=[];let n=0,o=0;const a=e.length-1,l=this.parts,[c,h]=ig(e,i);if(this.el=er.createElement(c,s),Mi.currentNode=this.el.content,i===2||i===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=Mi.nextNode())!==null&&l.length<a;){if(r.nodeType===1){if(r.hasAttributes())for(const d of r.getAttributeNames())if(d.endsWith(Cd)){const f=h[o++],u=r.getAttribute(d).split(ti),p=/([.?@])?(.*)/.exec(f);l.push({type:1,index:n,name:p[2],strings:u,ctor:p[1]==="."?rg:p[1]==="?"?ng:p[1]==="@"?og:Yn}),r.removeAttribute(d)}else d.startsWith(ti)&&(l.push({type:6,index:n}),r.removeAttribute(d));if(Ad.test(r.tagName)){const d=r.textContent.split(ti),f=d.length-1;if(f>0){r.textContent=gn?gn.emptyScript:"";for(let u=0;u<f;u++)r.append(d[u],Gs()),Mi.nextNode(),l.push({type:2,index:++n});r.append(d[f],Gs())}}}else if(r.nodeType===8)if(r.data===Od)l.push({type:2,index:n});else{let d=-1;for(;(d=r.data.indexOf(ti,d+1))!==-1;)l.push({type:7,index:n}),d+=ti.length-1}n++}}static createElement(e,i){const s=Hi.createElement("template");return s.innerHTML=e,s}}function gs(t,e,i=t,s){var o,a;if(e===ps)return e;let r=s!==void 0?(o=i._$Co)==null?void 0:o[s]:i._$Cl;const n=Zs(e)?void 0:e._$litDirective$;return(r==null?void 0:r.constructor)!==n&&((a=r==null?void 0:r._$AO)==null||a.call(r,!1),n===void 0?r=void 0:(r=new n(t),r._$AT(t,i,s)),s!==void 0?(i._$Co??(i._$Co=[]))[s]=r:i._$Cl=r),r!==void 0&&(e=gs(t,r._$AS(t,e.values),r,s)),e}class sg{constructor(e,i){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:i},parts:s}=this._$AD,r=((e==null?void 0:e.creationScope)??Hi).importNode(i,!0);Mi.currentNode=r;let n=Mi.nextNode(),o=0,a=0,l=s[0];for(;l!==void 0;){if(o===l.index){let c;l.type===2?c=new wr(n,n.nextSibling,this,e):l.type===1?c=new l.ctor(n,l.name,l.strings,this,e):l.type===6&&(c=new ag(n,this,e)),this._$AV.push(c),l=s[++a]}o!==(l==null?void 0:l.index)&&(n=Mi.nextNode(),o++)}return Mi.currentNode=Hi,r}p(e){let i=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,i),i+=s.strings.length-2):s._$AI(e[i])),i++}}class wr{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,i,s,r){this.type=2,this._$AH=y,this._$AN=void 0,this._$AA=e,this._$AB=i,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const i=this._$AM;return i!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=i.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,i=this){e=gs(this,e,i),Zs(e)?e===y||e==null||e===""?(this._$AH!==y&&this._$AR(),this._$AH=y):e!==this._$AH&&e!==ps&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):eg(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==y&&Zs(this._$AH)?this._$AA.nextSibling.data=e:this.T(Hi.createTextNode(e)),this._$AH=e}$(e){var n;const{values:i,_$litType$:s}=e,r=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=er.createElement($d(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===r)this._$AH.p(i);else{const o=new sg(r,this),a=o.u(this.options);o.p(i),this.T(a),this._$AH=o}}_$AC(e){let i=fc.get(e.strings);return i===void 0&&fc.set(e.strings,i=new er(e)),i}k(e){al(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,r=0;for(const n of e)r===i.length?i.push(s=new wr(this.O(Gs()),this.O(Gs()),this,this.options)):s=i[r],s._$AI(n),r++;r<i.length&&(this._$AR(s&&s._$AB.nextSibling,r),i.length=r)}_$AR(e=this._$AA.nextSibling,i){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,i);e!==this._$AB;){const r=oc(e).nextSibling;oc(e).remove(),e=r}}setConnected(e){var i;this._$AM===void 0&&(this._$Cv=e,(i=this._$AP)==null||i.call(this,e))}}class Yn{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,i,s,r,n){this.type=1,this._$AH=y,this._$AN=void 0,this.element=e,this.name=i,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=y}_$AI(e,i=this,s,r){const n=this.strings;let o=!1;if(n===void 0)e=gs(this,e,i,0),o=!Zs(e)||e!==this._$AH&&e!==ps,o&&(this._$AH=e);else{const a=e;let l,c;for(e=n[0],l=0;l<n.length-1;l++)c=gs(this,a[s+l],i,l),c===ps&&(c=this._$AH[l]),o||(o=!Zs(c)||c!==this._$AH[l]),c===y?e=y:e!==y&&(e+=(c??"")+n[l+1]),this._$AH[l]=c}o&&!r&&this.j(e)}j(e){e===y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class rg extends Yn{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===y?void 0:e}}class ng extends Yn{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==y)}}class og extends Yn{constructor(e,i,s,r,n){super(e,i,s,r,n),this.type=5}_$AI(e,i=this){if((e=gs(this,e,i,0)??y)===ps)return;const s=this._$AH,r=e===y&&s!==y||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==y&&(s===y||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var i;typeof this._$AH=="function"?this._$AH.call(((i=this.options)==null?void 0:i.host)??this.element,e):this._$AH.handleEvent(e)}}class ag{constructor(e,i,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){gs(this,e)}}const bo=Ws.litHtmlPolyfillSupport;bo==null||bo(er,wr),(Ws.litHtmlVersions??(Ws.litHtmlVersions=[])).push("3.3.2");const lg=(t,e,i)=>{const s=(i==null?void 0:i.renderBefore)??e;let r=s._$litPart$;if(r===void 0){const n=(i==null?void 0:i.renderBefore)??null;s._$litPart$=r=new wr(e.insertBefore(Gs(),n),n,void 0,i??{})}return r._$AI(t),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ri=globalThis;let de=class extends Ji{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var i;const e=super.createRenderRoot();return(i=this.renderOptions).renderBefore??(i.renderBefore=e.firstChild),e}update(e){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=lg(i,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return ps}};var kd;de._$litElement$=!0,de.finalized=!0,(kd=Ri.litElementHydrateSupport)==null||kd.call(Ri,{LitElement:de});const vo=Ri.litElementPolyfillSupport;vo==null||vo({LitElement:de});(Ri.litElementVersions??(Ri.litElementVersions=[])).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ke=t=>(e,i)=>{i!==void 0?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const cg={attribute:!0,type:String,converter:pn,reflect:!1,hasChanged:ol},hg=(t=cg,e,i)=>{const{kind:s,metadata:r}=i;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),s==="setter"&&((t=Object.create(t)).wrapped=!0),n.set(i.name,t),s==="accessor"){const{name:o}=i;return{set(a){const l=e.get.call(this);e.set.call(this,a),this.requestUpdate(o,l,t,!0,a)},init(a){return a!==void 0&&this.C(o,void 0,t,a),a}}}if(s==="setter"){const{name:o}=i;return function(a){const l=this[o];e.call(this,a),this.requestUpdate(o,l,t,!0,a)}}throw Error("Unsupported decorator location: "+s)};function Q(t){return(e,i)=>typeof i=="object"?hg(t,e,i):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(t,e,i)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function v(t){return Q({...t,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const dg=(t,e,i)=>(i.configurable=!0,i.enumerable=!0,Reflect.decorate&&typeof e!="object"&&Object.defineProperty(t,e,i),i);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Pd(t,e){return(i,s,r)=>{const n=o=>{var a;return((a=o.renderRoot)==null?void 0:a.querySelector(t))??null};return dg(i,s,{get(){return n(this)}})}}const fg=(()=>{const t=document.querySelector('meta[name="x-ingress-path"]');return t&&t.getAttribute("content")?t.getAttribute("content").replace(/\/+$/,""):""})(),ug=15e3,pg=3e4;let Er=null,yo=null;function Ht(t){const e=fg||"";return t.startsWith("/")?e+t:e+"/"+t}function gg(t,e){if(!t)return null;if(e!=null&&e.includes("application/json"))return JSON.parse(t);try{return JSON.parse(t)}catch{return t}}async function T(t,e){const i=new AbortController,s=setTimeout(()=>i.abort("timeout"),ug);try{const r=await fetch(Ht(t),{...e,signal:i.signal,headers:(e==null?void 0:e.body)instanceof FormData?e.headers:{"Content-Type":"application/json",...(e==null?void 0:e.headers)||{}}});clearTimeout(s);const n=await r.text(),o=gg(n,r.headers.get("content-type"));if(!r.ok){let a=`${r.status} ${r.statusText}`;if(o&&typeof o=="object"){const l=o,c=l.detail,h=l.error;typeof c=="string"&&c?a=c:typeof h=="string"&&h&&(a=h)}else typeof o=="string"&&o&&(a=o);throw new Error(a)}return o}catch(r){if(clearTimeout(s),r instanceof DOMException&&r.name==="AbortError"){const n=i.signal.reason;throw new Error(n==="timeout"?"timeout":"cancelled")}throw r}}const S={config:()=>T("/api/config"),updateConfig:t=>T("/api/config",{method:"PUT",body:JSON.stringify(t)}),discoverBridges:()=>T("/api/bridge/discover").then(t=>Array.isArray(t)?{bridges:t,scanning:!0}:{bridges:t.bridges??[],scanning:!!t.scanning}),triggerScan:()=>T("/api/bridge/scan",{method:"POST"}),getScanLog:()=>T("/api/bridge/scan-log"),getBridges:()=>T("/api/bridges"),scanSerialPorts:()=>T("/api/serial/ports").then(t=>t.ports),addBridge:(t,e=80,i,s,r,n="wifi",o,a=460800)=>T("/api/bridges",{method:"POST",body:JSON.stringify({host:t,port:e,name:i,api_key:s,hostname:r,transport:n,serial_port:o,baud:a})}),updateBridge:(t,e,i,s,r)=>T(`/api/bridges/${t}`,{method:"PUT",body:JSON.stringify({name:e,host:i,port:s,api_key:r})}),deleteBridge:t=>T(`/api/bridges/${t}`,{method:"DELETE"}),activateBridge:t=>T(`/api/bridges/${t}/activate`,{method:"PUT"}),deactivateBridge:t=>T(`/api/bridges/${t}/deactivate`,{method:"PUT"}),bridgeReconnect:t=>T(`/api/bridges/${t}/reconnect`,{method:"POST"}),selectBridge:(t,e,i,s,r,n,o)=>T("/api/bridge/select",{method:"POST",body:JSON.stringify({host:t,port:e,name:i,version:s,api_key:r,network_id:n,hostname:o})}),topology:(t=!1)=>{const e=Date.now();return!t&&Er&&e-Er.ts<pg?Promise.resolve(Er.data):T("/api/bridge/topology.json").then(i=>(Er={data:i,ts:e},i))},hideDevice:t=>T(`/api/topology/hide/${encodeURIComponent(t)}`,{method:"DELETE"}),removeRemote:t=>T(`/api/topology/remote/${encodeURIComponent(t)}`,{method:"DELETE"}),unhideDevice:t=>T(`/api/topology/unhide/${encodeURIComponent(t)}`,{method:"POST"}),devices:()=>T("/api/devices"),device:t=>T(`/api/devices/${encodeURIComponent(t)}`),currentOta:()=>T("/api/ota/current"),currentOtaForDevice:t=>T(`/api/ota/current?mac=${encodeURIComponent(t)}`),uploadFirmware:(t,e)=>{const i=new FormData;return i.set("mac",t),i.set("file",e),T("/api/ota/upload",{method:"POST",body:i})},startOta:t=>T(`/api/ota/start/${t}`,{method:"POST"}),abortOta:()=>T("/api/ota/abort",{method:"POST"}),cancelPending:t=>T(`/api/ota/pending/${t}`,{method:"DELETE"}),getQueue:()=>T("/api/ota/queue"),getQueuePaused:()=>T("/api/ota/queue/paused"),pauseQueue:()=>T("/api/ota/queue/pause",{method:"POST"}),resumeQueue:()=>T("/api/ota/queue/resume",{method:"POST"}),abortQueuedJob:t=>T(`/api/ota/queue/${t}/abort`,{method:"POST"}),reorderJobUp:t=>T(`/api/ota/queue/${t}/up`,{method:"POST"}),reorderJobDown:t=>T(`/api/ota/queue/${t}/down`,{method:"POST"}),history:t=>T(`/api/ota/history/${encodeURIComponent(t)}`),jobLog:t=>T(`/api/ota/jobs/${t}/log`),retained:()=>T("/api/firmware/retained"),reflash:t=>T(`/api/ota/reflash/${t}`,{method:"POST"}),deleteRetained:t=>T(`/api/firmware/retained/${t}`,{method:"DELETE"}),getConfig:t=>T(`/api/devices/${encodeURIComponent(t)}/config`),saveConfig:(t,e,i)=>T(`/api/devices/${encodeURIComponent(t)}/config`,{method:"PUT",body:JSON.stringify({content:e,scaffold:i})}),deleteConfig:t=>T(`/api/devices/${encodeURIComponent(t)}/config`,{method:"DELETE"}),checkSecrets:t=>T("/api/secrets/check",{method:"POST",body:JSON.stringify({content:t})}),importConfig:(t,e)=>{if(typeof e=="string")return T(`/api/devices/${encodeURIComponent(t)}/config/import`,{method:"POST",body:JSON.stringify({content:e})});const i=new FormData;return i.set("file",e),T(`/api/devices/${encodeURIComponent(t)}/config/import`,{method:"POST",body:i})},getConfigStatus:t=>T(`/api/devices/${encodeURIComponent(t)}/config/status`),compileDevice:(t,e=!1)=>{const i=e?"?auto_flash=true":"";return T(`/api/devices/${encodeURIComponent(t)}/compile${i}`,{method:"POST"})},getCompileStatus:t=>T(`/api/devices/${encodeURIComponent(t)}/compile/status`),cancelCompile:t=>T(`/api/devices/${encodeURIComponent(t)}/compile/cancel`,{method:"POST"}),startCompileFlash:t=>T(`/api/devices/${encodeURIComponent(t)}/compile/start-flash`,{method:"POST"}),getCompileHistory:t=>T(`/api/devices/${encodeURIComponent(t)}/compile/history`),rebootDevice:t=>T(`/api/devices/${encodeURIComponent(t)}/reboot`,{method:"POST"}),setHeartbeatInterval:(t,e)=>T(`/api/devices/${encodeURIComponent(t)}/heartbeat`,{method:"POST",body:JSON.stringify({interval_seconds:e})}),forceRediscover:t=>T(`/api/devices/${encodeURIComponent(t)}/rediscover`,{method:"POST"}),setParentMac:(t,e,i=!0)=>T(`/api/devices/${encodeURIComponent(t)}/parent`,{method:"POST",body:JSON.stringify({parent_mac:e,clear:i})}),setRelay:(t,e)=>T(`/api/devices/${encodeURIComponent(t)}/relay`,{method:"POST",body:JSON.stringify({enable:e})}),getCompileQueue:()=>T("/api/compile/queue"),getCompileHistoryAll:(t=100)=>T(`/api/compile/history?limit=${t}`),abortCompileJob:t=>T(`/api/compile/queue/${t}/abort`,{method:"POST"}),getAllHistory:async(t=100)=>{const[e,i]=await Promise.all([T(`/api/ota/history?limit=${t}`),T(`/api/compile/history?limit=${t}`)]),s=[...e.jobs,...i.jobs];return s.sort((r,n)=>(n.created_at??0)-(r.created_at??0)),{jobs:s.slice(0,t)}},getSecrets:()=>T("/api/secrets"),getChips:()=>T("/api/chips"),getBridgeNetworkCredentials:()=>T("/api/bridge/network-credentials"),saveSecrets:t=>T("/api/secrets",{method:"PUT",body:JSON.stringify({content:t})}),getContainerStatus:()=>T("/api/compile/container/status"),cleanArtifacts:()=>T("/api/compile/artifacts",{method:"DELETE"}),getSerialPorts:()=>T("/api/serial/ports"),startSerialFlash:(t,e)=>T(`/api/devices/${encodeURIComponent(t)}/flash/serial`,{method:"POST",body:JSON.stringify({port:e})}),getSerialFlashStatus:t=>T(`/api/devices/${encodeURIComponent(t)}/flash/serial/status`),cancelSerialFlash:t=>T(`/api/devices/${encodeURIComponent(t)}/flash/serial/cancel`,{method:"POST"}),restartRequired:()=>T("/api/restart-required"),requestRestart:()=>T("/api/restart",{method:"POST"}),setupStatus:()=>T("/api/setup-status"),integrationSetup:()=>T("/api/integration/setup",{method:"POST"}),detectChip:t=>T("/api/bridge/flash-wizard/detect-chip",{method:"POST",body:JSON.stringify({port:t})}),submitFlashWizard:t=>T("/api/bridge/flash-wizard/submit",{method:"POST",body:JSON.stringify(t)}),getFlashWizardStatus:()=>T("/api/bridge/flash-wizard/status"),finalizeFlashWizard:()=>T("/api/bridge/flash-wizard/finalize",{method:"POST"}),streamCompileLogs(t,e,i){const s=Ht(`/api/devices/${encodeURIComponent(t)}/compile/logs`),r=new EventSource(s);return r.onmessage=n=>{e(n.data)},r.addEventListener("status",n=>{e(`[status: ${n.data}]`)}),r.addEventListener("exit",n=>{e(`[build exited with code ${n.data}]`)}),r.addEventListener("queue_position",n=>{e(`[queue position: ${n.data}]`)}),r.onerror=i,r},streamSerialFlashLogs(t,e,i,s){const r=Ht(`/api/devices/${encodeURIComponent(t)}/flash/serial/logs`),n=new EventSource(r);return n.onmessage=o=>{e(o.data)},n.addEventListener("status",o=>{i(o.data)}),n.onerror=s,n},downloadFactoryBinary(t){return Ht(`/api/devices/${encodeURIComponent(t)}/firmware/download`)},downloadCompileBinary(t){return Ht(`/api/devices/${encodeURIComponent(t)}/compile/firmware/download`)},downloadJobBinary(t){return Ht(`/api/jobs/${t}/firmware/download`)},activityLog(t,e,i){const s=Ht("/api/integration/activity"),r=new EventSource(s);return r.addEventListener("line",n=>{t(n.data)}),r.addEventListener("end",()=>{e()}),r.addEventListener("error",n=>{i(n)}),r.onerror=i,r}};function mg(t){let e=null,i=!1,s=1e3;const r=()=>{if(i)return;const n=Ht("/ws/topology");e=new WebSocket(n),e.onopen=()=>{s=1e3},e.onmessage=o=>{try{const a=JSON.parse(o.data);a.type==="bridge.connection"&&typeof a.payload=="object"&&a.payload!==null&&t(a.payload.connected)}catch{}},e.onclose=()=>{i||(setTimeout(r,s),s=Math.min(s*2,1e4))},e.onerror=()=>{e==null||e.close()}};return r(),{close(){i=!0,e==null||e.close()}}}function bg(t){let e=null,i=!1,s=1e3;const r=()=>{if(i)return;const n=Ht("/ws/topology");e=new WebSocket(n),e.onopen=()=>{s=1e3},e.onmessage=o=>{try{const a=JSON.parse(o.data);a&&a.type==="server_id"&&typeof a.value=="string"&&(yo!==null&&yo!==a.value&&location.reload(),yo=a.value),t(a)}catch{}},e.onclose=()=>{i||(setTimeout(r,s),s=Math.min(s*2,1e4))},e.onerror=()=>{e==null||e.close()}};return r(),{close(){i=!0,e==null||e.close()}}}function ae(t){const e=t.replace(/[^0-9A-Fa-f]/g,"");return e.length!==12?t.trim().toUpperCase():e.match(/.{2}/g).join(":").toUpperCase()}function Li(t){const e=t||0;return e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/1024/1024).toFixed(2)} MB`}function ms(t){return t?new Date(t*1e3).toLocaleString():"-"}function mn(t){if(!t)return"-";const e=Math.max(0,Math.floor((Date.now()-t*1e3)/1e3));return e<60?`${e}s ago`:e<3600?`${Math.floor(e/60)}m ago`:e<86400?`${Math.floor(e/3600)}h ago`:`${Math.floor(e/86400)}d ago`}function pt(t){if(t==null||t<0)return"";const e=Number(t);if(e<60)return`${Math.round(e)}s`;if(e<3600)return`${Math.floor(e/60)}m ${Math.round(e%60)}s`;if(e<86400){const n=Math.floor(e/3600),o=Math.floor(e%3600/60);return`${n}h ${o}m`}const i=Math.floor(e/86400);if(i<7){const n=e%86400,o=Math.floor(n/3600);return`${i}d ${o}h`}const s=Math.floor(i/7),r=i%7;return`${s}w ${r}d`}var vg=Object.defineProperty,yg=Object.getOwnPropertyDescriptor,Lt=(t,e,i,s)=>{for(var r=s>1?void 0:s?yg(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&vg(e,i,r),r};let at=class extends de{constructor(){super(...arguments),this.childNodesData=[],this.childMap=new Map,this.jobForMac=()=>null,this.configForMac=()=>null,this.onHideDevice=()=>{},this.onRemoveDevice=()=>{},this.isRoot=!1,this.isLast=!1}selectNode(){this.node.ha_device_id?window.open(`/config/devices/device/${this.node.ha_device_id}`,"_blank"):this.dispatchEvent(new CustomEvent("node-selected",{detail:this.node.mac,bubbles:!0,composed:!0}))}navigateTo(t){window.location.hash=t}rssiBars(t){return t==null?"-":t>=-50?"▂▄▆█":t>=-65?"▂▄▆":t>=-80?"▂▄":t>=-90?"▂":"▁"}childKey(t){return ae(t.mac||"")}render(){const t=this.jobForMac(this.node.mac),e=!!t&&["starting","transferring","verifying","transfer_success_waiting_rejoin"].includes(t.status),i=!!t&&t.status==="queued",s=(t==null?void 0:t.percent)??0,r=this.childNodesData.length>0,n=!this.isRoot&&!this.node.is_bridge,o=this.configForMac(this.node.mac),a=(o==null?void 0:o.config_state)??"no_config",l=a==="compiling",c=a==="compile_queued",h=(o==null?void 0:o.queue_position)??1;return g`
      <div class="tree-row">
        <div class="branch ${this.isRoot?"root":""}" aria-hidden="true"></div>
        <div class="tree-node ${this.node.online?"online":"offline"}" @click=${this.selectNode}>
          ${n?g`
            <span class="config-badge config-${a}">
              ${a==="no_config"?"—":a==="has_config"?"✓":a==="compiled_ready"?"↑":"—"}
            </span>
          `:this.isRoot?g`
            <span class="bridge-badge">B</span>
          `:g`<span></span>`}
          <span class="status-dot ${this.node.online?"online":"offline"}"></span>
          <span class="identity">
            <span class="bridge-name-line">${this.isRoot&&this.node.network_id?g`<strong>${this.node.friendly_name||this.node.esphome_name||this.node.label||this.node.mac}</strong><span class="network-id">${this.node.network_id}</span>`:g`<strong>${this.node.friendly_name||this.node.esphome_name||this.node.label||this.node.mac}</strong>`}</span>
            <small>${this.node.mac}</small>
          </span>
          <span class="metrics">
            ${this.node.online?g`<span>${pt(this.node.uptime_s)}</span>`:g`<button class="hide-pill" title="hide until back online" @click=${d=>{d.stopPropagation(),this.onHideDevice(this.node.mac)}}>✕ hide</button>`}
            ${this.isRoot||this.node.last_seen_ago==null?g`<span class="pill-placeholder">—</span>`:g`<span class="last-seen">${pt(this.node.last_seen_ago)} ago</span>`}
            ${this.isRoot?g`<span class="pill-placeholder">—</span>`:this.node.online?g`<span title="${this.node.rssi!=null?`${this.node.rssi} dBm`:""}">${this.rssiBars(this.node.rssi)}${(this.node.hops??0)>0?`  ${this.node.hops}↷`:""}</span>`:g`<span class="offline-metric">${this.node.offline_reason||"offline"}</span>`}
            <span class="chip-name">${this.node.chip_name||"-"}</span>
          </span>
          ${n?g`
            ${this.node.online?g`
                  ${l?g`<span class="ota-badge compile-active" title="Compiling firmware..."
                           @click=${d=>{d.stopPropagation(),this.navigateTo(`/device/${encodeURIComponent(this.node.mac)}`)}}><span class="compile-spinner">⚙</span></span>`:c?g`<span class="ota-badge queued compile" title="Compile queued (#${h})"
                             @click=${d=>{d.stopPropagation(),this.navigateTo(`/device/${encodeURIComponent(this.node.mac)}`)}}>⏳ #${h}</span>`:e?g`<span class="ota-badge active" title="OTA in progress"
                               @click=${d=>{d.stopPropagation(),this.navigateTo(`/device/${encodeURIComponent(this.node.mac)}`)}}>📡 ${s}%</span>`:i?g`<span class="ota-badge queued" title="OTA queued"
                                 @click=${d=>{d.stopPropagation(),this.navigateTo(`/device/${encodeURIComponent(this.node.mac)}`)}}>⏳ #${t.queue_position??1}</span>`:g`<button class="icon-btn" title="View device"
                                 @click=${d=>{d.stopPropagation(),this.navigateTo(`/device/${encodeURIComponent(this.node.mac)}`)}}>⚙ Settings</button>`}
                `:g`<button class="icon-btn" title="View device"
                     @click=${d=>{d.stopPropagation(),this.navigateTo(`/device/${encodeURIComponent(this.node.mac)}`)}}>⚙ Settings</button>`}
          `:g`<span></span>`}
          ${n?g`
            <span class="action-buttons">
              <button class="icon-btn" title="Edit YAML config" @click=${d=>{d.stopPropagation(),this.navigateTo(`/device/${encodeURIComponent(this.node.mac)}/config`)}}>Edit YAML</button>
              ${this.node.online?y:g`<button class="icon-btn danger" title="Forget this remote (removes it from the network and Home Assistant)"
                       @click=${d=>{d.stopPropagation(),this.onRemoveDevice(this.node.mac)}}>Remove</button>`}
            </span>
          `:y}
        </div>
      </div>
      ${r?g`
            <div class="tree-child">
              ${this.childNodesData.map((d,f)=>g`
                  <esp-topology-node
                    .node=${d}
                    .childNodesData=${this.childMap.get(this.childKey(d))||[]}
                    .childMap=${this.childMap}
                    .jobForMac=${this.jobForMac}
                    .configForMac=${this.configForMac}
                    .onHideDevice=${this.onHideDevice}
                    .onRemoveDevice=${this.onRemoveDevice}
                    .isLast=${f===this.childNodesData.length-1}
                  ></esp-topology-node>
                `)}
            </div>
          `:y}
    `}};at.styles=we`
    :host {
      display: block;
      position: relative;
      margin-left: 10px;
    }

    :host([is-root]) {
      margin-left: 0;
    }

    .tree-row {
      display: flex;
      align-items: stretch;
      position: relative;
      padding: 6px 0;
    }

    .branch {
      position: relative;
      width: 22px;
      flex: 0 0 22px;
      margin-right: 2px;
    }

    .branch.root {
      width: 0;
      flex-basis: 0;
      margin-right: 0;
    }

    /* For last child, stop the vertical line at the horizontal connector */
    :host([is-last])::before {
      display: none;
    }

    /* Don't show continuation line on the root */
    :host([is-root])::before {
      display: none;
    }

    .tree-node {
      width: 100%;
      display: grid;
      /* Fixed trailing tracks keep every box - bridge or remote - on the same
         column grid. With auto tracks each row sized its own columns, so the
         bridge (which has no OTA/action cells) never aligned with a remote. The
         trailing widths fit the widest remote content: the Settings button, and
         the Edit YAML + Remove pair. */
      /* The metrics column must hold all four pills on ONE line, and the identity
         column yields to it. It was minmax(0, 1fr), which lets the track collapse
         to whatever is left over: at a 913px row that is ~245px, while four 76px
         pills plus 3x6px gaps need ~322px. So the chip pill wrapped to a second
         line on every row and each box grew ~20px taller, leaving the metrics
         stranded above the buttons. max-content gives the pills exactly what they
         need; the identity takes the slack and truncates rather than pushing the
         track wider.

         The pills need ~394px of fixed chrome (badges, buttons, gaps) plus ~304px
         of pills, so a two-column row needs ~860px before the name has any width.
         The single-column layout below takes over at 960px, before that bites. */
      grid-template-columns: 14px 10px minmax(0, 1fr) minmax(0, max-content) 120px 190px;
      gap: 12px;
      align-items: center;
      border: 1px solid var(--line);
      border-radius: 10px;
      background: #fafbfc;
      color: var(--ink);
      padding: 12px 14px;
      cursor: pointer;
      font: inherit;
      transition: all 0.12s;
    }

    .tree-node:hover {
      border-color: var(--primary);
      background: #f0f7fa;
    }

    .tree-node.offline {
      background: #fef2f2;
      border-color: #fecaca;
    }

    .tree-node.offline .status-dot {
      background: var(--danger);
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--ok);
    }

    .config-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      font-size: 9px;
      font-weight: 700;
      border: 1px solid var(--line);
      border-radius: 4px;
    }

    .config-badge.config-has_config {
      border-color: var(--ok);
      color: var(--ok);
      background: #dcfce7;
    }

    .config-badge.config-compiled_ready {
      border-color: var(--primary);
      color: var(--primary);
      background: #d5f0f3;
    }

    .config-badge.config-no_config {
      border-color: var(--line);
      color: var(--muted);
    }

    .bridge-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      font-size: 9px;
      font-weight: 700;
      border-radius: 4px;
      background: var(--primary);
      color: #fff;
      flex-shrink: 0;
    }

    .ota-badge.compile-active {
      background: #5b9bd5;
      color: #fff;
      font-size: 16px;
    }

    .ota-badge.compile-active .compile-spinner {
      display: inline-block;
      animation: compile-spin 1s linear infinite;
    }

    .action-buttons {
      display: flex;
      gap: 12px;
    }

    .icon-btn {
      border: 1px solid #0f766e;
      background: #0f766e;
      color: #fff;
      padding: 0 14px;
      font: inherit;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.12s;
    }

    .icon-btn:hover {
      background: #0d5f58;
      border-color: #0d5f58;
      transform: translateY(-1px);
    }

    .icon-btn.danger {
      background: #fff;
      border-color: #fecaca;
      color: #b91c1c;
    }

    .icon-btn.danger:hover {
      background: #fef2f2;
      border-color: #fca5a5;
      transform: translateY(-1px);
    }

    .identity {
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 0;
    }

    .bridge-name-line {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .network-id {
      color: var(--primary);
      font-weight: 500;
      font-size: 14px;
      flex-shrink: 0;
    }

    strong,
    small {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    small {
      color: var(--muted);
      font-size: 12px;
    }

    .metrics {
      display: flex;
      /* wrap, not nowrap: the track above is sized to fit all four pills on one
         line at any desktop width (>=961px), so wrapping only engages as a
         graceful fallback. nowrap would overflow invisibly instead. */
      flex-wrap: wrap;
      gap: 6px;
      min-width: 0;
      font-size: 12px;
      color: var(--muted);
      justify-content: flex-end;
    }

    /* One pill language for the row. Every pill and badge shares the same height,
       radius and horizontal padding so a row reads as a single band. box-sizing is
       set here because nothing sets it globally: without it a width:76px pill
       actually rendered 92px (76 plus 2x8px padding), so each pill's real width
       depended on its own padding rather than a shared column. */
    .metrics span,
    .metrics .hide-pill,
    .pill-placeholder,
    .config-badge,
    .bridge-badge,
    .ota-badge,
    .icon-btn {
      box-sizing: border-box;
      min-height: 26px;
      border-radius: 999px;
      font-size: 12px;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
    }

    .metrics span {
      background: #f1f5f9;
      padding: 0 10px;
      /* min-width, not width: the cells line up but a long value can still grow
         instead of overflowing. */
      min-width: 76px;
      text-align: center;
    }

    .metrics span.offline-metric {
      background: var(--danger);
      color: #fff;
    }

    .hide-pill {
      padding: 0 10px;
      border: none;
      background: var(--danger);
      color: #fff;
      font: inherit;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.12s;
    }

    .hide-pill:hover {
      background: #dc2626;
    }

    .metrics .chip-name {
      min-width: 76px;
    }

    .pill-placeholder {
      background: #f1f5f9;
      padding: 0 10px;
      min-width: 76px;
      text-align: center;
      color: var(--muted);
    }

    .tree-node.offline .last-seen {
      background: var(--danger);
      color: #fff;
    }

    .metrics .last-seen {
      color: var(--muted, #888);
      font-size: 11px;
    }

    .ota-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 11px;
      font-weight: 600;
      padding: 0 10px;
      cursor: pointer;
      transition: all 0.12s;
    }

    .ota-badge.active {
      position: relative;
      overflow: hidden;
      background: #5b9bd5;
    }

    .ota-badge.active::before {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 4px,
        rgba(255, 255, 255, 0.2) 4px,
        rgba(255, 255, 255, 0.2) 8px
      );
      background-size: 12px 12px;
      animation: ota-stripes 0.6s linear infinite;
    }

    .ota-badge.idle {
      background: #fff;
      color: var(--ink);
      border: 1px solid var(--line);
      font-size: 16px;
    }

    .ota-badge.queued {
      background: #5b9bd5;
    }

    .ota-badge:hover {
      opacity: 0.85;
    }

    @keyframes ota-stripes {
      0% { background-position: 0 0; }
      100% { background-position: 12px 0; }
    }

    @keyframes compile-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .tree-child {
      position: relative;
      margin-left: 6px;
      padding-left: 0;
    }

    /* The single-column layout has to start above the point where the four pills
       stop fitting next to a name. Fixed chrome (badges + Settings + actions +
       5 gaps) is ~394px and the pills need ~304px, so a two-column row needs
       ~860px before the name gets any width at all. Starting the collapse at 840px
       left a ~90px band where the name was squeezed to 0px and the row overflowed
       invisibly. 960px hands over while there is still room. */
    @media (max-width: 960px) {
      :host {
        margin-left: 0;
      }
      .branch {
        display: none;
      }
      .tree-node {
        grid-template-columns: 1fr auto;
        grid-auto-flow: row;
        align-items: start;
        gap: 6px 10px;
        padding: 12px 12px;
      }
      .config-badge {
        display: none;
      }
      .status-dot {
        grid-column: 2;
        grid-row: 1;
        justify-self: end;
        margin-top: 8px;
      }
      .identity {
        grid-column: 1;
        grid-row: 1;
        align-self: start;
        gap: 2px;
      }
      strong,
      small {
        white-space: normal;
      }
      strong {
        font-size: 14px;
        line-height: 1.25;
      }
      small {
        font-size: 11px;
        line-height: 1.3;
      }
      .metrics,
      .ota-badge,
      .offline-note {
        grid-column: 1 / -1;
      }
      .metrics {
        display: flex;
        flex-wrap: wrap;
        grid-row: 2;
        gap: 6px;
      }
      .ota-badge,
      .offline-note {
        grid-row: 3;
      }
      .action-buttons {
        display: none;
      }
    }
  `;Lt([Q({type:Object})],at.prototype,"node",2);Lt([Q({type:Array})],at.prototype,"childNodesData",2);Lt([Q({attribute:!1})],at.prototype,"childMap",2);Lt([Q({attribute:!1})],at.prototype,"jobForMac",2);Lt([Q({attribute:!1})],at.prototype,"configForMac",2);Lt([Q({attribute:!1})],at.prototype,"onHideDevice",2);Lt([Q({attribute:!1})],at.prototype,"onRemoveDevice",2);Lt([Q({type:Boolean})],at.prototype,"isRoot",2);Lt([Q({type:Boolean,reflect:!0})],at.prototype,"isLast",2);at=Lt([ke("esp-topology-node")],at);var xg=Object.defineProperty,wg=Object.getOwnPropertyDescriptor,yi=(t,e,i,s)=>{for(var r=s>1?void 0:s?wg(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&xg(e,i,r),r};let Bt=class extends de{constructor(){super(...arguments),this.topology=[],this.currentJob=null,this.queueData=null,this.configStatuses=new Map,this.loading=!0,this.error="",this.hiddenExpanded=!1}connectedCallback(){super.connectedCallback(),this.load(),this.stream=bg(t=>{(t.type==="topology.snapshot"||t.type==="topology.changed"||t.type==="remote.availability"||t.type==="bridge.heartbeat")&&this.load(!1,!0)})}disconnectedCallback(){var t;(t=this.stream)==null||t.close(),super.disconnectedCallback()}async load(t=!0,e=!1){t&&(this.loading=!0);try{const[i,s,r]=await Promise.all([S.topology(e),S.currentOta(),S.getQueue()]);this.topology=i,this.currentJob=s.job,this.queueData=r,this.error="";const n=i.filter(l=>(l.hops??0)>0).map(l=>S.getConfigStatus(l.mac).catch(()=>null)),o=await Promise.all(n),a=new Map;o.forEach(l=>{l&&a.set(ae(l.mac),l)}),this.configStatuses=a}catch(i){this.error=i instanceof Error?i.message:String(i)}finally{this.loading=!1}}async handleHideDevice(t){try{await S.hideDevice(t),await this.load(!1,!0)}catch(e){console.error("Failed to hide device:",e)}}async handleUnhideDevice(t){try{await S.unhideDevice(t),await this.load(!1,!0)}catch(e){console.error("Failed to unhide device:",e)}}async handleRemoveDevice(t){const e=this.topology.find(s=>s.mac===t),i=(e==null?void 0:e.friendly_name)||(e==null?void 0:e.esphome_name)||(e==null?void 0:e.label)||t;if(window.confirm(`Remove ${i} permanently?

This deletes it from the add-on and from Home Assistant, including any retained history. It cannot be undone from here. If the device is still powered on it will simply reappear.`))try{await S.removeRemote(t),await this.load(!1,!0)}catch(s){console.error("Failed to remove device:",s)}}jobForMac(t){var s;const e=ae(t);return this.currentJob&&ae(this.currentJob.mac)===e?this.currentJob:(((s=this.queueData)==null?void 0:s.queued_jobs)??[]).find(r=>ae(r.mac)===e)??null}configForMac(t){return this.configStatuses.get(ae(t))??null}childKey(t){return ae(t||"")}buildChildren(){const t=new Map;for(const i of this.topology){const s=this.childKey(i.parent_mac);if(!s)continue;const r=t.get(s)||[];r.push(i),t.set(s,r)}for(const i of t.values())i.sort((s,r)=>(s.friendly_name||s.label||s.esphome_name||s.mac).localeCompare(r.friendly_name||r.label||r.esphome_name||r.mac));return{root:this.topology.find(i=>(i.hops??0)===0)||this.topology.find(i=>!i.parent_mac)||this.topology[0]||null,childMap:t}}render(){const{root:t}=this.buildChildren(),e=this.childKey((t==null?void 0:t.mac)||""),i=this.topology.filter(o=>o.hidden?!1:(o.hops??0)>0?!0:!o.is_bridge&&this.childKey(o.mac)!==e),s=this.topology.filter(o=>o.hidden),r=new Set(i.map(o=>this.childKey(o.mac))),n=new Map;for(const o of i){if(this.childKey(o.mac)===e)continue;let a=this.childKey(o.parent_mac);(!a||!r.has(a))&&(a=e);const l=n.get(a)||[];l.push(o),n.set(a,l)}for(const o of n.values())o.sort((a,l)=>(a.friendly_name||a.label||a.esphome_name||a.mac).localeCompare(l.friendly_name||l.label||l.esphome_name||l.mac));return g`
      ${this.error?g`<div class="error">${this.error}</div>`:y}
      ${this.loading?g`<div class="loading">Reading bridge topology...</div>`:y}
      ${!this.loading&&!t&&!this.error?g`<div class="loading">No topology data returned by the bridge.</div>`:y}
      ${t?g`
            <section class="card">
              <div class="card-header">
                <h2>${t.friendly_name||t.label||t.esphome_name||"Bridge"} Topology</h2>
                <div class="header-actions">
                  <button class="btn primary" @click=${()=>{window.location.hash="/add-remote"}}>+ Add Remote</button>
                  <button class="btn" @click=${()=>void this.load()}>Refresh</button>
                </div>
              </div>
              <div class="card-body">
                <div class="tree-root">
                  <esp-topology-node
                    .node=${t}
                    .childNodesData=${n.get(this.childKey(t.mac))||[]}
                    .childMap=${n}
                    .jobForMac=${o=>this.jobForMac(o)}
                    .configForMac=${o=>this.configForMac(o)}
                    .onHideDevice=${o=>this.handleHideDevice(o)}
                    .onRemoveDevice=${o=>this.handleRemoveDevice(o)}
                    .isRoot=${!0}
                  ></esp-topology-node>
                </div>
              </div>
            </section>
          `:y}
      ${s.length>0?g`
            <section class="card hidden-section">
              <div class="card-header collapsible" @click=${()=>{this.hiddenExpanded=!this.hiddenExpanded}}>
                <h2>Hidden Devices (${s.length})</h2>
                <span class="expand-icon">${this.hiddenExpanded?"▼":"▶"}</span>
              </div>
              ${this.hiddenExpanded?g`
                    <div class="card-body">
                      <div class="hidden-devices">
                        ${s.map(o=>g`
                          <div class="hidden-device-row" @click=${()=>{window.location.hash=`/device/${encodeURIComponent(o.mac)}`}}>
                            <span class="status-dot offline"></span>
                            <span class="device-name">${o.friendly_name||o.esphome_name||o.label||o.mac}</span>
                            <span class="device-mac">${o.mac}</span>
                            <span class="device-status">${o.offline_reason||"offline"}</span>
                            <button class="restore-btn" @click=${a=>{a.stopPropagation(),this.handleUnhideDevice(o.mac)}}>Restore</button>
                          </div>
                        `)}
                      </div>
                    </div>
                  `:y}
            </section>
          `:y}
    `}};Bt.styles=we`
    .card {
      background: var(--surface);
      border-radius: 12px;
      box-shadow: var(--shadow);
      border: 1px solid var(--line);
      margin-bottom: 20px;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--line);
    }

    .card-header h2 {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
    }

    .card-body {
      padding: 16px 10px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: inherit;
      font-size: 13px;
      font-weight: 500;
      padding: 5px 10px;
      border-radius: 8px;
      border: 1px solid var(--line);
      background: var(--surface);
      color: var(--ink);
      cursor: pointer;
      transition: all 0.12s;
      min-height: 32px;
    }

    .btn:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    .btn.primary {
      background: #0f766e;
      border-color: #0f766e;
      color: #fff;
    }

    .btn.primary:hover {
      background: #0d5f58;
      border-color: #0d5f58;
    }

    .tree-root {
      margin: 0;
      padding: 0;
      overflow: hidden;
    }

    .error,
    .loading {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 20px;
      color: var(--muted);
      font-size: 14px;
    }

    .error {
      border-color: var(--danger);
      color: var(--danger);
      background: #fef2f2;
    }

    .hidden-section {
      margin-top: 0;
    }

    .hidden-section .card-header {
      cursor: pointer;
      user-select: none;
    }

    .hidden-section .card-header:hover {
      background: #f8fafc;
    }

    .expand-icon {
      font-size: 12px;
      color: var(--muted);
    }

    .hidden-devices {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .hidden-device-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.12s;
    }

    .hidden-device-row:hover {
      background: #fee2e2;
      border-color: var(--danger);
    }

    .hidden-device-row .status-dot {
      flex-shrink: 0;
    }

    .hidden-device-row .device-name {
      flex: 1;
      font-weight: 500;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .hidden-device-row .device-mac {
      color: var(--muted);
      font-size: 12px;
    }

    .hidden-device-row .device-status {
      color: var(--danger);
      font-size: 12px;
    }

    .hidden-device-row .restore-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border: 1px solid var(--line);
      background: #fff;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      color: var(--ink);
      transition: all 0.12s;
      white-space: nowrap;
    }

    .hidden-device-row .restore-btn:hover {
      background: var(--ok);
      color: #fff;
      border-color: var(--ok);
    }

    @media (max-width: 720px) {
      .summary {
        display: none;
      }

      .card {
        margin-bottom: 14px;
      }

      .card-header {
        align-items: flex-start;
        gap: 12px;
        flex-direction: column;
        padding: 14px 16px;
      }

      .card-header h2 {
        font-size: 15px;
      }

      .card-body {
        padding: 12px 14px;
      }
    }
  `;yi([v()],Bt.prototype,"topology",2);yi([v()],Bt.prototype,"currentJob",2);yi([v()],Bt.prototype,"queueData",2);yi([v()],Bt.prototype,"configStatuses",2);yi([v()],Bt.prototype,"loading",2);yi([v()],Bt.prototype,"error",2);yi([v()],Bt.prototype,"hiddenExpanded",2);Bt=yi([ke("esp-topology-map")],Bt);var kg=Object.defineProperty,Sg=Object.getOwnPropertyDescriptor,Te=(t,e,i,s)=>{for(var r=s>1?void 0:s?Sg(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&kg(e,i,r),r};let xe=class extends de{constructor(){super(...arguments),this.mac="",this.online=!1,this.isRemote=!1,this.relayNodes=[],this.relayEnabled=!1,this.busy="",this.heartbeatSeconds=60,this.selectedParent="",this.customParentMac="",this.showRelayModal=!1,this.showHeartbeatModal=!1,this.showParentModal=!1,this.parentDropdownOpen=!1,this.showConfirmModal="",this.confirmAction=null,this.toast=null}disconnectedCallback(){this.toastTimer&&window.clearTimeout(this.toastTimer),super.disconnectedCallback()}disabled(t=""){return!this.online||!!this.busy||!!t&&this.busy!==t}notify(t,e){this.toast={message:t,tone:e},this.toastTimer&&window.clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>{this.toast=null},4500)}configError(t,e,i){if(e===void 0){console.error("Unexpected config response:",i),this.notify(`${t} returned an unexpected response`,"error");return}const r={rejected:"Config Fail Device Rejected",busy:"Config Fail Device Busy",timeout:"Config Fail Device Timeout",no_session:"Config Fail No Session",not_remote:"Config Fail Not Remote",invalid_payload:"Config Fail Invalid Payload",unsupported:"Config Fail Unsupported"}[e]??`${t} returned ${e}`;this.notify(r,"error")}dispatchChanged(){this.dispatchEvent(new CustomEvent("config-changed",{bubbles:!0,composed:!0}))}reboot(){this.showConfirmModal="Reboot",this.confirmAction=()=>{this.busy="reboot",S.rebootDevice(this.mac).then(t=>{t.result==="ok"?(this.notify("Reboot command accepted","ok"),this.dispatchChanged()):this.configError(t.command,t.result,t)}).catch(t=>{this.notify(t instanceof Error?t.message:String(t),"error")}).finally(()=>{this.busy=""})}}rediscover(){this.showConfirmModal="Rediscover",this.confirmAction=()=>{this.busy="rediscover",S.forceRediscover(this.mac).then(t=>{t.result==="ok"?(this.notify("Rediscover command accepted","ok"),this.dispatchChanged()):this.configError(t.command,t.result,t)}).catch(t=>{this.notify(t instanceof Error?t.message:String(t),"error")}).finally(()=>{this.busy=""})}}applyHeartbeat(){const t=Math.trunc(Number(this.heartbeatSeconds));return t<5||t>3600?(this.notify("Heartbeat must be 5-3600 seconds","error"),Promise.resolve()):(console.log("[debug-modal] applyHeartbeat setting showHeartbeatModal=false"),this.showHeartbeatModal=!1,this.busy="heartbeat",S.setHeartbeatInterval(this.mac,t).then(e=>{e.result==="ok"?(this.notify("Heartbeat interval set","ok"),this.dispatchChanged()):this.configError(e.command,e.result,e)}).catch(e=>{this.notify(e instanceof Error?e.message:String(e),"error")}).finally(()=>{this.busy=""}))}applyParent(t){const e=ae((this.customParentMac||this.selectedParent).trim());if(!/^[0-9A-F]{2}(:[0-9A-F]{2}){5}$/.test(e)){this.notify("Parent MAC is invalid","error");return}this.showParentModal=!1,this.busy="parent",S.setParentMac(this.mac,e,t).then(i=>{i.result==="ok"?(this.notify("Parent set","ok"),this.dispatchChanged()):this.configError(i.command,i.result,i)}).catch(i=>{this.notify(i instanceof Error?i.message:String(i),"error")}).finally(()=>{this.busy=""})}openRelayModal(){this.showRelayModal=!0}closeRelayModal(){this.showRelayModal=!1}applyRelayModal(t){this.showRelayModal=!1,this.busy="relay",S.setRelay(this.mac,t).then(e=>{if(e.result!==void 0&&!["no_session","timeout","rejected","busy","invalid_payload","not_remote"].includes(e.result)){const s=e.result==="ok"?t?"Relay Enabled Successfully":"Relay Disabled Successfully":e.result;this.notify(s,"ok"),this.dispatchChanged()}else this.configError(e.command,e.result,e)}).catch(e=>{this.notify(e instanceof Error?e.message:String(e),"error")}).finally(()=>{this.busy=""})}render(){return this.isRemote?g`
      <section class="config-panel">
        <div class="title-row">
          <div>
            <h2>Device Controls</h2>
          </div>
          ${this.busy?g`<small class="busy">${this.busy}</small>`:y}
        </div>

        ${this.online?y:g`<div class="offline">Device offline</div>`}

        <div class="command-row three">
          <button class="danger" ?disabled=${this.disabled()} @click=${this.reboot}>Reboot</button>
          <button ?disabled=${this.disabled()} @click=${this.rediscover}>Force Rediscover</button>
          <button ?disabled=${this.disabled()} @click=${this.openRelayModal}>Relay Config</button>
        </div>

        <div class="command-row three">
          <button class="config-btn" ?disabled=${this.disabled()} @click=${()=>{console.log("[debug-modal] Set Heartbeat button clicked"),this.showHeartbeatModal=!0}}>Set Heartbeat</button>
          <div></div>
          <button class="config-btn" ?disabled=${this.disabled()} @click=${()=>{this.showParentModal=!0}}>Set Parent</button>
        </div>

        ${this.showRelayModal?this.renderRelayModal():y}
        ${this.showHeartbeatModal?this.renderHeartbeatModal():y}
        ${this.showParentModal?this.renderParentModal():y}
        ${this.showConfirmModal?this.renderConfirmModal():y}

        ${this.toast?g`<div class="toast ${this.toast.tone}">${this.toast.message}</div>`:y}
      </section>
    `:y}renderRelayModal(){return g`
      <div class="modal-backdrop" @click=${this.handleBackdropClick}>
        <div class="modal" @click=${t=>t.stopPropagation()}>
          <h3>Relay Config</h3>
          <p>Configure relay mode for this device.</p>
          <div class="modal-actions">
            <button @click=${()=>this.applyRelayModal(!0)} ?disabled=${this.disabled()}>Enable Relay</button>
            <button @click=${()=>this.applyRelayModal(!1)} ?disabled=${this.disabled()}>Disable Relay</button>
            <button class="cancel" @click=${this.closeRelayModal}>Cancel</button>
          </div>
        </div>
      </div>
    `}renderHeartbeatModal(){return g`
      <div class="modal-backdrop" @click=${this.handleBackdropClick}>
        <div class="modal" @click=${t=>t.stopPropagation()}>
          <h3>Set Heartbeat</h3>
          <label>
            <span>Interval (seconds)</span>
            <input
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
              min="5"
              max="3600"
              .value=${String(this.heartbeatSeconds)}
              @input=${t=>{this.heartbeatSeconds=Number(t.target.value)}}
              @keydown=${t=>{t.key==="Enter"&&this.applyHeartbeatFromModal()}}
              @click=${t=>t.stopPropagation()}
            />
          </label>
          <div class="modal-actions">
            <button @click=${this.applyHeartbeatFromModal} ?disabled=${this.disabled()||this.heartbeatSeconds<5||this.heartbeatSeconds>3600}>Set</button>
            <button class="cancel" @click=${()=>{this.showHeartbeatModal=!1}}>Cancel</button>
          </div>
        </div>
      </div>
    `}handleBackdropClick(t){t.composedPath().some(i=>{var s;return(s=i.classList)==null?void 0:s.contains("modal")})||(this.showHeartbeatModal=!1,this.showParentModal=!1,this.showConfirmModal="")}renderParentModal(){const t=!!(this.customParentMac.trim()||this.selectedParent),e=this.relayNodes.filter(i=>ae(i.mac)!==ae(this.mac));return g`
      <div class="modal-backdrop" @click=${this.handleBackdropClick}>
        <div class="modal" @click=${i=>i.stopPropagation()}>
          <h3>Set Parent</h3>
          <p class="callout">Configures the remote device's preferred parent - is not blocking so if remote cannot reach the parent it may select an alternate</p>
          <label>
            <span>Parent</span>
            <select
              .value=${this.selectedParent}
              ?disabled=${this.disabled()}
              @click=${i=>i.stopPropagation()}
              @change=${i=>{const s=i.target.value;s==="__custom__"?(this.parentDropdownOpen=!0,this.selectedParent=""):(this.selectedParent=s,this.customParentMac="",this.parentDropdownOpen=!1)}}
            >
              <option value="">Select parent</option>
              ${e.map(i=>g`
                <option value=${ae(i.mac)}>
                  ${i.friendly_name||i.esphome_name||i.label||ae(i.mac)}
                </option>
              `)}
              <option value="__custom__">Custom MAC...</option>
            </select>
          </label>
          ${this.parentDropdownOpen?g`
            <label class="custom-mac-label">
              <span>Custom MAC</span>
              <input
                type="text"
                autocomplete="off"
                placeholder="AA:BB:CC:DD:EE:FF"
                .value=${this.customParentMac}
                ?disabled=${this.disabled()}
                @input=${i=>{this.customParentMac=i.target.value}}
                @click=${i=>i.stopPropagation()}
              />
            </label>
          `:y}
          ${this.customParentMac?g`<div class="custom-mac-display">Custom: ${this.customParentMac}</div>`:y}
          <div class="modal-actions two">
            <button @click=${()=>this.applyParentFromModal(!0)} ?disabled=${this.disabled()||!t}>Set Parent Replace All Parents</button>
            <button @click=${()=>this.applyParentFromModal(!1)} ?disabled=${this.disabled()||!t}>Set Parent Add to List</button>
          </div>
          <div class="modal-actions">
            <button class="cancel" @click=${()=>{this.showParentModal=!1}}>Cancel</button>
          </div>
        </div>
      </div>
    `}applyHeartbeatFromModal(){this.applyHeartbeat()}applyParentFromModal(t){this.showParentModal=!1,this.parentDropdownOpen=!1,this.applyParent(t)}renderConfirmModal(){const t=this.showConfirmModal==="Reboot";return g`
      <div class="modal-backdrop" @click=${this.handleBackdropClick}>
        <div class="modal" @click=${e=>e.stopPropagation()}>
          <h3>${t?"Reboot Device":"Force Rediscover"}</h3>
          <p class="callout">${t?"Are you sure you want to reboot this device?":"Force this device to rediscover its parent route?"}</p>
          <div class="modal-actions two">
            <button @click=${()=>{const e=this.confirmAction;this.showConfirmModal="",this.confirmAction=null,e&&e()}} ?disabled=${this.disabled()}>Go</button>
            <button class="cancel" @click=${()=>{this.showConfirmModal="",this.confirmAction=null}}>Cancel</button>
          </div>
        </div>
      </div>
    `}};xe.styles=we`
    .config-panel {
      position: relative;
      display: grid;
      gap: 16px;
    }

    .title-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: start;
    }

    .title-row span,
    label > span {
      display: block;
      color: #64748b;
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      margin-bottom: 5px;
    }

    h2 {
      margin: 0;
      color: #0f172a;
      font-size: 20px;
      line-height: 1.1;
    }

    .busy {
      color: #0f766e;
      font-weight: 700;
      text-transform: uppercase;
    }

    .offline {
      border: 1px solid #fecaca;
      background: #fef2f2;
      color: #991b1b;
      border-radius: 8px;
      padding: 9px 11px;
      font-size: 13px;
      font-weight: 700;
    }

    .command-row,
    .field-row,
    .config-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      align-items: end;
    }

    .command-row.three {
      grid-template-columns: 1fr 1fr 1fr;
    }

    .config-btn {
      width: 100%;
    }

    input,
    select,
    button {
      width: 100%;
      min-height: 38px;
      box-sizing: border-box;
      border-radius: 8px;
      font: inherit;
      font-size: 13px;
    }

    input,
    select {
      border: 1px solid #cbd5e1;
      background: #fff;
      padding: 0 10px;
    }

    button {
      border: 1px solid #0f766e;
      background: #0f766e;
      color: #fff;
      padding: 0 12px;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.12s, background 0.12s, border-color 0.12s;
    }

    button:hover:not(:disabled) {
      background: #115e59;
      border-color: #115e59;
      transform: translateY(-1px);
    }

    button.danger {
      background: #b91c1c;
      border-color: #b91c1c;
    }

    button.danger:hover:not(:disabled) {
      background: #991b1b;
      border-color: #991b1b;
    }

    button:disabled,
    input:disabled,
    select:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }

    .check {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      min-height: 38px;
    }

    .check input {
      width: 42px;
      min-height: 22px;
      accent-color: #0f766e;
    }

    .check span {
      margin: 0;
      color: #334155;
      font-size: 13px;
      font-weight: 700;
      text-transform: none;
    }

    .toast {
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 13px;
      font-weight: 700;
      border: 1px solid;
    }

    .toast.ok {
      background: #ecfdf5;
      color: #065f46;
      border-color: #a7f3d0;
    }

    .toast.error {
      background: #fff7ed;
      color: #9a3412;
      border-color: #fed7aa;
    }

    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: #fff;
      border-radius: 12px;
      padding: 24px;
      width: 90%;
      max-width: 380px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    }

    .modal h3 {
      margin: 0 0 16px 0;
      color: #0f172a;
      font-size: 18px;
    }

    .modal label {
      display: block;
    }

    .modal label span {
      display: block;
      color: #64748b;
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      margin-bottom: 5px;
    }

    .modal input {
      width: 100%;
      min-height: 38px;
      box-sizing: border-box;
      border-radius: 8px;
      font: inherit;
      font-size: 13px;
      border: 1px solid #cbd5e1;
      background: #fff;
      padding: 0 10px;
    }

    .modal-actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
      justify-content: flex-end;
    }

    .modal-actions button {
      width: auto;
      min-width: 80px;
      padding: 0 16px;
    }

    .modal-actions button.cancel {
      background: #fff;
      border-color: #cbd5e1;
      color: #64748b;
    }

    .modal-actions button.cancel:hover:not(:disabled) {
      background: #f1f5f9;
      border-color: #94a3b8;
      transform: none;
    }

    .modal-actions.two {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 20px;
    }

    .modal-actions.two button {
      width: 100%;
      min-width: auto;
    }

    .callout {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 12px;
      color: #64748b;
      margin: 0 0 16px 0;
    }

    .custom-mac-label {
      display: block;
      margin-top: 10px;
    }

    .custom-mac-display {
      font-size: 12px;
      color: #64748b;
      padding: 4px 0;
    }

    @media (max-width: 760px) {
      .command-row,
      .field-row,
      .command-row.three {
        grid-template-columns: 1fr;
      }
    }
  `;Te([Q({type:String})],xe.prototype,"mac",2);Te([Q({type:Boolean})],xe.prototype,"online",2);Te([Q({type:Boolean})],xe.prototype,"isRemote",2);Te([Q({type:Array})],xe.prototype,"relayNodes",2);Te([Q({type:Boolean})],xe.prototype,"relayEnabled",2);Te([v()],xe.prototype,"busy",2);Te([v()],xe.prototype,"heartbeatSeconds",2);Te([v()],xe.prototype,"selectedParent",2);Te([v()],xe.prototype,"customParentMac",2);Te([v()],xe.prototype,"showRelayModal",2);Te([v()],xe.prototype,"showHeartbeatModal",2);Te([v()],xe.prototype,"showParentModal",2);Te([v()],xe.prototype,"parentDropdownOpen",2);Te([v()],xe.prototype,"showConfirmModal",2);Te([v()],xe.prototype,"confirmAction",2);Te([v()],xe.prototype,"toast",2);xe=Te([ke("esp-device-config")],xe);var Cg=Object.defineProperty,Og=Object.getOwnPropertyDescriptor,ll=(t,e,i,s)=>{for(var r=s>1?void 0:s?Og(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&Cg(e,i,r),r};let tr=class extends de{constructor(){super(...arguments),this.showAbort=!1}abort(){this.dispatchEvent(new CustomEvent("abort",{bubbles:!0,composed:!0}))}render(){const t=Math.max(0,Math.min(100,Number(this.job.percent||0))),i=["success","failed","aborted","rejoin_timeout","version_mismatch"].includes(this.job.status)?this.job.status==="success"?"progress-panel success":"progress-panel failure":"progress-panel",s=this.job.parsed_esphome_name||this.job.esphome_name||this.job.firmware_name||"firmware.ota.bin";return g`
      <section class="${i}">
        <div class="progress-header">
          <div>
            <span class="label">Current flash</span>
            <h3>${s}</h3>
          </div>
          <strong class="state">${this.job.status.replaceAll("_"," ")}</strong>
        </div>
        <div class="bar" style="--bar-percent: ${t}%" aria-label="OTA progress">
          <span>${t}%</span>
        </div>
        <dl>
          <div><dt>Chunks</dt><dd>${this.job.chunks_sent??0} / ${this.job.total_chunks??"-"}</dd></div>
          <div><dt>Bridge</dt><dd>${this.job.bridge_state||"-"}</dd></div>
          <div><dt>Increment</dt><dd>${this.job.current_increment!=null&&this.job.total_increments!=null?`${this.job.current_increment}/${this.job.total_increments}`:"-"}</dd></div>
          <div><dt>Round</dt><dd>${this.job.retransmit_round??0}</dd></div>
          <div><dt>Size</dt><dd>${Li(this.job.firmware_size)}</dd></div>
          <div><dt>Started</dt><dd>${ms(this.job.started_at)}</dd></div>
        </dl>
        ${this.job.error_msg?g`<p class="error">${this.job.error_msg}</p>`:y}
        ${this.showAbort?g`<button class="abort-btn" @click=${this.abort}>Abort</button>`:y}
      </section>
    `}};tr.styles=we`
    .progress-panel {
      position: relative;
      border: 1px solid var(--line);
      background: #fffbeb;
      border-radius: 8px;
      padding: 16px;
    }

    .progress-panel.success {
      border-color: var(--ok);
      background: #dcfce7;
    }

    .progress-panel.failure {
      border-color: var(--danger);
      background: #fef2f2;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: start;
      margin-bottom: 12px;
    }

    .label {
      color: var(--muted);
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    h3 {
      margin: 4px 0 0;
      font-size: 16px;
      font-weight: 600;
      overflow-wrap: anywhere;
    }

    .state {
      color: var(--accent);
      text-transform: uppercase;
      font-size: 12px;
      font-weight: 500;
      text-align: right;
    }

    .bar {
      position: relative;
      height: 8px;
      background: var(--line);
      border-radius: 4px;
      margin-bottom: 12px;
      overflow: hidden;
    }

    .bar::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: var(--bar-percent, 0%);
      background: var(--primary);
      border-radius: 4px;
      transition: width 180ms ease;
    }

    .bar::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: var(--bar-percent, 0%);
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.35) 50%,
        transparent 100%
      );
      border-radius: 4px;
      transition: width 180ms ease;
      animation: ota-shimmer 1.4s ease-in-out infinite;
    }

    @keyframes ota-shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(200%); }
    }

    .bar span {
      display: none;
    }

    dl {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 8px;
      margin: 0;
    }

    dt {
      color: var(--muted);
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
    }

    dd {
      margin: 3px 0 0;
      overflow-wrap: anywhere;
      font-size: 12px;
    }

    .error {
      color: var(--danger);
      margin: 10px 0 0;
      font-size: 12px;
    }

    @media (max-width: 760px) {
      dl {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    .abort-btn {
      position: absolute;
      bottom: 12px;
      right: 12px;
      background: var(--danger);
      color: #fff;
      border: none;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
    }

    .abort-btn:hover {
      background: #dc2626;
    }
  `;ll([Q({type:Object})],tr.prototype,"job",2);ll([Q({type:Boolean})],tr.prototype,"showAbort",2);tr=ll([ke("esp-ota-progress")],tr);var Ag=Object.defineProperty,$g=Object.getOwnPropertyDescriptor,mt=(t,e,i,s)=>{for(var r=s>1?void 0:s?$g(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&Ag(e,i,r),r};const uc=new Set(["success","failed","aborted","rejoin_timeout","version_mismatch"]);let Ze=class extends de{constructor(){super(...arguments),this.mac="",this.showEditYaml=!1,this.currentJob=null,this.pendingJob=null,this.preflight=null,this.acceptedWarnings=!1,this.busy=!1,this.error="",this.showAbortModal=!1}async upload(t){var s;const e=t.target,i=(s=e.files)==null?void 0:s[0];if(i){this.busy=!0,this.error="",this.acceptedWarnings=!1;try{const r=await S.uploadFirmware(this.mac,i);this.pendingJob=r.job,this.preflight=r.preflight||null,this.dispatchChanged()}catch(r){this.error=r instanceof Error?r.message:String(r)}finally{this.busy=!1,e.value=""}}}async start(){if(this.pendingJob){this.busy=!0,this.error="";try{(await S.startOta(this.pendingJob.id)).job.status==="queued"?(this.pendingJob=null,this.preflight=null,this.dispatchChanged()):(this.pendingJob=null,this.preflight=null,this.dispatchChanged())}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busy=!1}}}goToConfig(){window.location.hash=`/device/${encodeURIComponent(this.mac)}/config`}async abort(){var e,i,s;const t=((e=this.pendingJob)==null?void 0:e.id)??(((i=this.currentJob)==null?void 0:i.status)==="pending_confirm"?(s=this.currentJob)==null?void 0:s.id:null);if(t){this.pendingJob=null,this.preflight=null,this.acceptedWarnings=!1,this.busy=!0,this.error="";try{await S.cancelPending(t),this.dispatchChanged()}catch(r){this.error=r instanceof Error?r.message:String(r)}finally{this.busy=!1}return}try{if((await S.getQueue()).count>0){this.showAbortModal=!0;return}}catch{}this.pendingJob=null,this.preflight=null,this.acceptedWarnings=!1,this.busy=!0,this.error="";try{await S.abortOta(),this.dispatchChanged()}catch(r){this.error=r instanceof Error?r.message:String(r)}finally{this.busy=!1}}async abortQueued(){if(this.currentJob){this.busy=!0,this.error="";try{await S.abortQueuedJob(this.currentJob.id),this.dispatchChanged()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busy=!1}}}isJobDismissed(t){return sessionStorage.getItem(`esp_tree_ota_dismissed_${t}`)==="1"}dismissAndClear(){var t;((t=this.currentJob)==null?void 0:t.id)!=null&&sessionStorage.setItem(`esp_tree_ota_dismissed_${this.currentJob.id}`,"1"),this.requestUpdate()}dispatchChanged(){this.dispatchEvent(new CustomEvent("ota-changed",{bubbles:!0,composed:!0}))}render(){var c,h,d,f;const t=this.currentJob&&ae(this.currentJob.mac)===ae(this.mac),e=t&&this.currentJob&&uc.has(this.currentJob.status)?this.currentJob:null,i=t&&((c=this.currentJob)==null?void 0:c.status)==="compile_queued",s=t&&((h=this.currentJob)==null?void 0:h.status)==="compiling",r=t&&((d=this.currentJob)==null?void 0:d.status)==="queued",n=t&&this.currentJob&&!r&&!i&&!s&&this.currentJob.status!=="pending_confirm"&&!uc.has(this.currentJob.status),o=this.pendingJob,a=!!o&&(!((f=this.preflight)!=null&&f.has_warnings)||this.acceptedWarnings)&&!this.busy,l=!!e&&!this.isJobDismissed(e.id);return g`
      <section class="ota">
        <div class="title-row">
          <div>
            <h2>Firmware</h2>
          </div>
          ${t&&this.currentJob&&!e&&!l&&!r&&!i&&!s&&!o&&!n?g`<button class="btn btn-danger" ?disabled=${this.busy} @click=${this.abort}>Abort</button>`:y}
        </div>

        ${l&&e?this.renderFlashResult(e):g`
              ${i&&this.currentJob?this.renderCompileQueued(this.currentJob):y}
              ${s&&this.currentJob?this.renderCompiling(this.currentJob):y}
              ${r&&this.currentJob?this.renderQueued(this.currentJob):n&&this.currentJob?g`<esp-ota-progress .job=${this.currentJob} .showAbort=${!0} @abort=${this.abort}></esp-ota-progress>`:y}

              ${!o&&!r&&!n&&!i&&!s?g`
                    <div class="idle-controls">
                      ${this.showEditYaml?g`<button class="btn btn-edit-yaml" @click=${this.goToConfig}>Edit Firmware YAML</button>`:y}
                      <label class="upload ${this.busy?"busy":""}">
                        <input type="file" accept=".ota.bin" ?disabled=${this.busy} @change=${this.upload} />
                        <strong>${this.busy?"Processing firmware...":"Upload .ota.bin firmware to flash"}</strong>
                      </label>
                    </div>
                  `:y}

              ${o?this.renderPending(o,a):y}
            `}
        ${this.showAbortModal?this.renderAbortModal():y}
        ${this.error?g`<p class="error">${this.error}</p>`:y}
      </section>
    `}renderQueued(t){const e=t.queue_position??1;return g`
      <div class="queued-wrapper">
        <esp-ota-progress .job=${t}></esp-ota-progress>
        <div class="queued-overlay">
          <span class="queued-icon">⏳</span>
          <strong>Firmware Update Queued</strong>
          <small>#${e} in queue</small>
          <button class="btn btn-danger" ?disabled=${this.busy} @click=${this.abortQueued}>Abort</button>
        </div>
      </div>
    `}renderCompileQueued(t){const e=(t.queue_position??0)+1;return g`
      <div class="queued-wrapper">
        <div class="queued-overlay compile-overlay">
          <span class="queued-icon">⏳</span>
          <strong>Compiling Firmware...</strong>
          <small>#${e} in compile queue</small>
          <button class="btn btn-danger" ?disabled=${this.busy} @click=${this.abortCompileQueuedJob}>Cancel</button>
        </div>
      </div>
    `}renderCompiling(t){return g`
      <div class="queued-wrapper">
        <div class="queued-overlay compile-overlay compiling-overlay">
          <span class="queued-icon">⚙</span>
          <strong>Building Firmware...</strong>
          <a class="view-logs-link" href=${`#/device/${encodeURIComponent(this.mac)}/config`}>View compile logs →</a>
          <button class="btn btn-danger" ?disabled=${this.busy} @click=${this.cancelCompile}>Cancel</button>
        </div>
      </div>
    `}async abortCompileQueuedJob(){if(this.currentJob){this.busy=!0,this.error="";try{await S.cancelCompile(this.mac),this.dispatchChanged()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busy=!1}}}async cancelCompile(){this.busy=!0,this.error="";try{await S.cancelCompile(this.mac),this.dispatchChanged()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busy=!1}}renderAbortModal(){return g`
      <div class="modal-backdrop" @click=${()=>{this.showAbortModal=!1,this.pendingJob=null,this.preflight=null}}>
        <div class="modal" @click=${t=>t.stopPropagation()}>
          <h3>Other queued jobs waiting</h3>
          <p>Continue running the next queued job after aborting this one?</p>
          <div class="actions">
            <button class="start" @click=${this.abortAndContinue}>Yes, continue queue</button>
            <button class="btn btn-danger" @click=${this.abortAndPause}>No, pause queue</button>
            <button @click=${()=>{this.showAbortModal=!1,this.pendingJob=null,this.preflight=null}}>Cancel</button>
          </div>
        </div>
      </div>
    `}async abortAndContinue(){this.showAbortModal=!1,this.pendingJob=null,this.preflight=null,this.busy=!0;try{await S.abortOta(),this.dispatchChanged()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busy=!1}}async abortAndPause(){this.showAbortModal=!1,this.pendingJob=null,this.preflight=null,this.busy=!0;try{await S.abortOta(),await S.pauseQueue(),this.dispatchChanged()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busy=!1}}renderPending(t,e){const i=this.preflight,s=t.parsed_esphome_name||t.esphome_name||t.firmware_name||"Selected firmware",n=`tag ${i!=null&&i.name.match?"match":"mismatch"}`,o=i!=null&&i.name.match?"MATCH":"MISMATCH",l=`tag ${i!=null&&i.chip.match?"match":"mismatch"}`,c=i!=null&&i.chip.match?"MATCH":"MISMATCH",h=(i==null?void 0:i.build_date.status)||"unknown";let d="tag ",f="";return h==="same"?(d+="same",f="SAME"):h==="newer"?(d+="newer",f=`NEWER ${i==null?void 0:i.build_date.delta}`):h==="older"&&(d+="older",f=`OLDER ${i==null?void 0:i.build_date.delta}`),i!=null&&i.metadata_unavailable?g`
        <div class="pending">
          <h3>${s}</h3>
          <p class="meta-unavailable">Metadata not available for ESP8266 Arduino firmware.</p>
          <div class="meta-info">
            <span>Size: ${Li(t.firmware_size)}</span>
            <span>MD5: ${t.firmware_md5||"-"}</span>
          </div>
          <div class="actions">
            <button class="btn btn-primary" ?disabled=${!e} @click=${this.start}>Flash</button>
            <button class="btn" ?disabled=${this.busy} @click=${this.abort}>Cancel</button>
          </div>
        </div>
      `:g`
      <div class="pending">
        <h3>${s}</h3>
        <table class="compare-table">
          <thead>
            <tr><th>Field</th><th>Current (Remote)</th><th>New (Firmware)</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Name</td>
              <td>${(i==null?void 0:i.name.current)||"-"}</td>
              <td>${(i==null?void 0:i.name.new)||"-"}<br><span class="${n}">${o}</span></td>
            </tr>
            <tr>
              <td>Build Date</td>
              <td>${(i==null?void 0:i.build_date.current)||"-"}</td>
              <td>${(i==null?void 0:i.build_date.new)||"-"}<br><span class="${d}">${f}</span></td>
            </tr>
            <tr>
              <td>Chip Type</td>
              <td>${(i==null?void 0:i.chip.current)||"-"}</td>
              <td>${(i==null?void 0:i.chip.new)||"-"}<br><span class="${l}">${c}</span></td>
            </tr>
          </tbody>
        </table>
        <div class="meta-info">
          <span>Size: ${Li(t.firmware_size)}</span>
          <span>MD5: ${t.firmware_md5||"-"}</span>
        </div>
        ${i!=null&&i.has_warnings?g`
              <div class="warnings">
                ${i.warnings.map(u=>g`<p>${u}</p>`)}
                <label>
                  <input type="checkbox" .checked=${this.acceptedWarnings} @change=${u=>this.acceptedWarnings=u.target.checked} />
                  Flash anyway
                </label>
              </div>
            `:y}
        <div class="actions">
          <button class="btn btn-primary" ?disabled=${!e} @click=${this.start}>Flash</button>
          <button class="btn" ?disabled=${this.busy} @click=${this.abort}>Cancel</button>
        </div>
      </div>
    `}renderFlashResult(t){const e=t.status==="success",i=e?"success":"failure",s=e?"FLASH SUCCESSFUL":t.status.replaceAll("_"," ").toUpperCase(),r=e?"The device accepted the new firmware and rejoined the network.":t.error_msg||"The firmware update did not complete successfully.",n=t.parsed_esphome_name||t.esphome_name||t.firmware_name||"-",o=this.node.esphome_name||"-",a=n===o||n==="-"&&o==="-",l=t.parsed_build_date||"-",c=this.node.firmware_build_date||"-",h=l===c||l==="-"&&c==="-",d=t.parsed_chip_name||"-",f=this.node.chip_name||"-",u=d===f||d==="-"&&f==="-",p=t.firmware_md5||"-",m=this.node.firmware_md5||"-",b=p===m||p==="-"&&m==="-";return e?g`
        <div class="flash-result ${i}">
          <div class="result-banner">
            <span class="result-icon">✓</span>
            <span class="result-label">${s}</span>
          </div>
          <h3>${n}</h3>
          <p class="result-message">${r}</p>
          <div class="actions">
            <button class="btn btn-primary" @click=${this.dismissAndClear}>Done</button>
          </div>
        </div>
      `:g`
      <div class="flash-result ${i}">
        <div class="result-banner">
          <span class="result-icon">✗</span>
          <span class="result-label">${s}</span>
        </div>
        <h3>${n}</h3>
        <p class="result-message">${r}</p>
        <table class="compare-table">
          <thead>
            <tr><th>Field</th><th>Flashed</th><th>Device Now</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Name</td>
              <td>${n}</td>
              <td>${o} ${a?y:g`<span class="tag mismatch">CHANGED</span>`}</td>
            </tr>
            <tr>
              <td>Build Date</td>
              <td>${l}</td>
              <td>${c} ${h?y:g`<span class="tag mismatch">CHANGED</span>`}</td>
            </tr>
            <tr>
              <td>Chip Type</td>
              <td>${d}</td>
              <td>${f} ${u?y:g`<span class="tag mismatch">CHANGED</span>`}</td>
            </tr>
            <tr>
              <td>Firmware MD5</td>
              <td>${p}</td>
              <td>${m} ${b?y:g`<span class="tag mismatch">CHANGED</span>`}</td>
            </tr>
          </tbody>
        </table>
        <div class="meta-info">
          <span>Size: ${Li(t.firmware_size)}</span>
          ${t.completed_at?g`<span>Completed: ${ms(t.completed_at)}</span>`:y}
        </div>
        <div class="actions">
          <button class="btn btn-primary" @click=${this.dismissAndClear}>Done</button>
        </div>
      </div>
    `}};Ze.styles=we`
    .ota {
      display: grid;
      gap: 16px;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .card-header h2 {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
    }

    .title-row {
      display: flex;
      align-items: start;
      justify-content: space-between;
      gap: 12px;
    }

    .title-row span {
      color: var(--primary);
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .title-row h2 {
      margin: 0;
      font-size: 20px;
      line-height: 1.1;
    }

    .upload {
      display: grid;
      gap: 6px;
      place-items: center;
      min-height: 42px;
      border: 2px dashed var(--line);
      background: #fafbfc;
      border-radius: 8px;
      cursor: pointer;
      padding: 6px 18px;
      text-align: center;
      font-family: inherit;
      font-size: 14px;
      font-weight: 700;
      transition: all 0.12s;
    }

    .upload:hover {
      border-color: var(--primary);
      background: #f0f7fa;
    }

    .idle-controls {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    button.btn-edit-yaml {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #0f766e;
      background: #0f766e;
      color: #fff;
      font-family: inherit;
      font-size: 14px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.12s, border-color 0.12s;
      width: 100%;
      min-height: 38px;
      box-sizing: border-box;
      padding: 0 12px;
    }

    button.btn-edit-yaml:hover {
      background: #115e59;
      border-color: #115e59;
    }

    input[type='file'] {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      opacity: 0;
      pointer-events: none;
    }

    small,
    .meta {
      color: var(--muted);
      font-size: 12px;
    }

    .pending {
      border: 1px solid var(--line);
      background: var(--surface);
      border-radius: 8px;
      padding: 16px;
    }

    .pending h3 {
      margin: 0 0 12px;
    }

    .meta-unavailable {
      color: var(--muted);
      font-style: italic;
      margin: 0 0 12px;
    }

    .compare-table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 13px;
    }

    .compare-table th,
    .compare-table td {
      border: 1px solid var(--line);
      padding: 8px 10px;
      text-align: left;
    }

    .compare-table th {
      background: #f8fafc;
      font-size: 11px;
      text-transform: uppercase;
      color: var(--muted);
      font-weight: 600;
    }

    .compare-table td:first-child {
      font-weight: 500;
      color: var(--muted);
    }

    .tag {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      margin-top: 4px;
    }

    .tag.match {
      background: #dcfce7;
      color: #166534;
    }

    .tag.same {
      background: #f1f5f9;
      color: var(--muted);
    }

    .tag.mismatch,
    .tag.newer {
      background: #fef2f2;
      color: #991b1b;
    }

    .tag.older {
      background: #dcfce7;
      color: #166534;
    }

    .meta-info {
      display: flex;
      gap: 16px;
      font-size: 11px;
      color: var(--muted);
      margin-bottom: 12px;
    }

    .warnings {
      border-left: 4px solid var(--accent);
      background: #fffbeb;
      padding: 12px;
      display: grid;
      gap: 8px;
      margin-bottom: 12px;
      border-radius: 6px;
    }

    .warnings p {
      margin: 0;
      font-size: 13px;
    }

    .warnings label {
      font-weight: 500;
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .flash-result {
      border: 1px solid var(--line);
      background: var(--surface);
      border-radius: 8px;
      padding: 16px;
    }

    .result-message {
      margin: 0 0 12px;
      color: var(--ink);
      font-size: 13px;
      line-height: 1.45;
    }

    .flash-result.failure {
      border-color: var(--danger);
    }

    .result-banner {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      margin: -16px -16px 12px -16px;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 14px;
      border-radius: 8px 8px 0 0;
    }

    .flash-result.success .result-banner {
      background: #dcfce7;
      color: #166534;
    }

    .flash-result.failure .result-banner {
      background: #fef2f2;
      color: #991b1b;
    }

    .result-icon {
      font-size: 18px;
      line-height: 1;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: inherit;
      font-size: 13px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
      border: 1px solid var(--line);
      background: var(--surface);
      color: var(--ink);
      cursor: pointer;
      transition: all 0.12s;
      min-height: 38px;
    }

    .btn:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    .btn-primary {
      background: var(--primary);
      color: #fff;
      border-color: var(--primary);
    }

    .btn-primary:hover {
      background: #0d4d5e;
    }

    .btn-danger {
      background: var(--danger);
      color: #fff;
      border-color: var(--danger);
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    button:disabled,
    .btn:disabled {
      opacity: 0.48;
      cursor: not-allowed;
    }

    .notice,
    .error {
      margin: 0;
      padding: 10px 12px;
      border: 1px solid var(--accent);
      background: #fffbeb;
      color: #7c3f00;
      font-weight: 500;
      border-radius: 6px;
    }

    .error {
      border-color: var(--danger);
      background: #fef2f2;
      color: #991b1b;
    }

    .queued-wrapper {
      position: relative;
      overflow: visible;
    }

    .queued-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      background: rgba(255, 247, 223, 0.92);
      z-index: 2;
      text-align: center;
      padding: 8px;
      overflow: visible;
      border-radius: 8px;
    }

    .queued-icon {
      font-size: 24px;
    }

    .queued-overlay strong {
      font-size: 14px;
    }

    .queued-overlay small {
      color: var(--muted);
      font-size: 11px;
    }

    .queued-overlay .btn-danger {
      margin-top: 8px;
    }

    .compile-overlay {
      background: rgba(255, 249, 230, 0.95);
    }

    .compiling-overlay {
      background: rgba(232, 248, 245, 0.95);
    }

    .view-logs-link {
      color: var(--primary);
      font-size: 12px;
      font-weight: 500;
      text-decoration: underline;
    }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 20px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .modal h3 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .modal p {
      margin: 0 0 16px 0;
      font-size: 14px;
      color: var(--muted);
    }

    @media (max-width: 760px) {
      .compare-table {
        font-size: 11px;
      }
    }
  `;mt([Q({type:String})],Ze.prototype,"mac",2);mt([Q({type:Object})],Ze.prototype,"node",2);mt([Q({type:Boolean})],Ze.prototype,"showEditYaml",2);mt([Q({type:Object})],Ze.prototype,"currentJob",2);mt([v()],Ze.prototype,"pendingJob",2);mt([v()],Ze.prototype,"preflight",2);mt([v()],Ze.prototype,"acceptedWarnings",2);mt([v()],Ze.prototype,"busy",2);mt([v()],Ze.prototype,"error",2);mt([v()],Ze.prototype,"showAbortModal",2);Ze=mt([ke("esp-ota-box")],Ze);var Pg=Object.defineProperty,Tg=Object.getOwnPropertyDescriptor,kr=(t,e,i,s)=>{for(var r=s>1?void 0:s?Tg(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&Pg(e,i,r),r};let Wi=class extends de{constructor(){super(...arguments),this.jobs=[],this.mac="",this.busyJob=null,this.error=""}retained(t){return!!t.firmware_path&&!!t.retained_until&&t.retained_until>Math.floor(Date.now()/1e3)}viewLog(t){const e=`/device/${encodeURIComponent(this.mac||t.mac)}`;window.location.hash=`/job/${t.id}?from=${encodeURIComponent(e)}`}async reflash(t){this.busyJob=t.id,this.error="";try{const e=await S.reflash(t.id);this.dispatchEvent(new CustomEvent("ota-reflash-result",{bubbles:!0,composed:!0,detail:{job:e.job,preflight:e.preflight}})),this.dispatchChanged()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.busyJob=null}}async deleteRetained(t){this.busyJob=t.id,this.error="";try{await S.deleteRetained(t.id),this.dispatchChanged()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.busyJob=null}}dispatchChanged(){this.dispatchEvent(new CustomEvent("ota-changed",{bubbles:!0,composed:!0}))}statusLabel(t){return t.status==="success"?"OTA Upload Success":t.status.replaceAll("_"," ")}statusStyle(t){return{success:"background:#dcfce7;color:#15803d;",failed:"background:#fef2f2;color:#dc2626;",aborted:"background:#fef3c7;color:#b45309;",rejoin_timeout:"background:#fef3c7;color:#b45309;",version_mismatch:"background:#fef3c7;color:#b45309;"}[t]||"background:#f1f5f9;color:#475569;"}render(){return g`
      <section>
        <div class="title-row">
          <div>
            <h2>Flash Log</h2>
          </div>
        </div>
        ${this.error?g`<p class="error">${this.error}</p>`:y}
        ${this.jobs.length?g`
              <div class="table">
                ${this.jobs.map(t=>{const e=t.completed_at&&t.started_at?pt(t.completed_at-t.started_at):"";return g`
                      <article>
                        <span class="device-info">
                          <strong>${t.parsed_esphome_name||t.esphome_name||t.firmware_name||"firmware.ota.bin"}</strong>
                          <span class="device-meta">${t.parsed_build_date||t.firmware_name||""}${t.firmware_size?g` · ${Li(t.firmware_size)}`:y}</span>
                          ${t.error_msg?g`<span class="error-msg" title=${t.error_msg}>!</span>`:y}
                        </span>
                        <span class="status-pill" style=${this.statusStyle(t.status)}>${this.statusLabel(t)}</span>
                        <span class="timestamp">${mn(t.created_at)}</span>
                        <span class="duration">${e}</span>
                        <div class="actions">
                          <button class="btn" @click=${()=>this.viewLog(t)}>View log</button>
                          ${this.retained(t)?g`
                                <button class="btn" ?disabled=${this.busyJob===t.id} @click=${()=>this.reflash(t)}>Flash again</button>
                                <button class="btn" ?disabled=${this.busyJob===t.id} @click=${()=>this.deleteRetained(t)}>Delete binary</button>
                              `:y}
                        </div>
                      </article>
                    `})}
              </div>
            `:g`<p class="empty">No flash history for this node yet.</p>`}
      </section>
    `}};Wi.styles=we`
    section {
      display: grid;
      gap: 12px;
    }

    .title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .title-row span {
      color: var(--primary);
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    h2 {
      margin: 2px 0 0;
      font-size: 16px;
      font-weight: 600;
    }

    .table {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    article {
      display: grid;
      grid-template-columns: 1fr auto auto auto auto;
      gap: 8px;
      align-items: center;
      border: 1px solid var(--line);
      background: var(--surface);
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 13px;
    }

    .device-info {
      display: inline-flex;
      align-items: baseline;
      gap: 6px;
      overflow: hidden;
    }

    .device-info strong {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 13px;
      font-weight: 600;
    }

    .device-meta {
      color: var(--muted);
      font-size: 11px;
      white-space: nowrap;
    }

    .error-msg {
      color: var(--danger);
      font-weight: 700;
      font-size: 13px;
      cursor: help;
    }

    .status-pill {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .timestamp {
      color: var(--muted);
      font-size: 12px;
      white-space: nowrap;
    }

    .duration {
      color: var(--muted);
      font-size: 12px;
      white-space: nowrap;
    }

    .actions {
      display: flex;
      gap: 6px;
      justify-content: flex-end;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-family: inherit;
      font-size: 11px;
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid var(--line);
      background: var(--surface);
      color: var(--ink);
      cursor: pointer;
      transition: all 0.12s;
      min-height: 26px;
    }

    .btn:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    .empty,
    .error {
      margin: 0;
      color: var(--muted);
      font-size: 13px;
    }

    .error {
      color: var(--danger);
      font-weight: 500;
    }

    @media (max-width: 880px) {
      article {
        grid-template-columns: 1fr;
        align-items: stretch;
      }
      .actions {
        justify-content: flex-start;
      }
    }
  `;kr([Q({type:Array})],Wi.prototype,"jobs",2);kr([Q({type:String})],Wi.prototype,"mac",2);kr([v()],Wi.prototype,"busyJob",2);kr([v()],Wi.prototype,"error",2);Wi=kr([ke("esp-flash-history")],Wi);var Mg=Object.defineProperty,Eg=Object.getOwnPropertyDescriptor,cl=(t,e,i,s)=>{for(var r=s>1?void 0:s?Eg(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&Mg(e,i,r),r};let ir=class extends de{constructor(){super(...arguments),this.jobs=[],this.mac=""}viewJobLog(t){const e=`/device/${encodeURIComponent(this.mac)}`;window.location.hash=`/job/${t.id}?from=${encodeURIComponent(e)}`}statusLabel(t){return t.status==="compile_success"?"compile success":t.status.replaceAll("_"," ")}statusStyle(t){return{compile_success:"background:#dcfce7;color:#15803d;",success:"background:#dcfce7;color:#15803d;",failed:"background:#fef2f2;color:#dc2626;"}[t]||"background:#f1f5f9;color:#475569;"}render(){const t=this.jobs.filter(e=>e.status==="compile_success"||e.status==="failed");return g`
      <section>
        <div class="title-row">
          <h2>Compile Log</h2>
        </div>
        ${t.length?g`
              <div class="table">
                ${t.map(e=>{const i=e.completed_at&&e.started_at?pt(e.completed_at-e.started_at):"";return g`
                      <article>
                        <span class="device-info">
                          <strong>${e.parsed_esphome_name||e.firmware_name||"compile"}</strong>
                          <span class="device-meta">v${e.parsed_version||"-"} / ${e.parsed_build_date||"-"}</span>
                          ${e.error_msg?g`<span class="error-msg" title=${e.error_msg}>!</span>`:y}
                        </span>
                        <span class="status-pill" style=${this.statusStyle(e.status)}>${this.statusLabel(e)}</span>
                        <span class="timestamp">${mn(e.created_at)}</span>
                        <span class="duration">${i}</span>
                        <div class="actions">
                          <button class="btn" @click=${()=>this.viewJobLog(e)}>View log</button>
                          <a class="btn" href=${S.downloadJobBinary(e.id)} target="_blank" rel="noopener">Download .bin</a>
                        </div>
                      </article>
                    `})}
              </div>
            `:g`<p class="empty">No compile history for this node yet.</p>`}
      </section>
    `}};ir.styles=we`
    section {
      display: grid;
      gap: 12px;
    }

    .title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    h2 {
      margin: 2px 0 0;
      font-size: 16px;
      font-weight: 600;
    }

    .table {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    article {
      display: grid;
      grid-template-columns: 1fr auto auto auto auto;
      gap: 8px;
      align-items: center;
      border: 1px solid var(--line);
      background: var(--surface);
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 13px;
    }

    .device-info {
      display: inline-flex;
      align-items: baseline;
      gap: 6px;
      overflow: hidden;
    }

    .device-info strong {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 13px;
      font-weight: 600;
    }

    .device-meta {
      color: var(--muted);
      font-size: 11px;
      white-space: nowrap;
    }

    .error-msg {
      color: var(--danger);
      font-weight: 700;
      font-size: 13px;
      cursor: help;
    }

    .status-pill {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .timestamp {
      color: var(--muted);
      font-size: 12px;
      white-space: nowrap;
    }

    .duration {
      color: var(--muted);
      font-size: 12px;
      white-space: nowrap;
    }

    .actions {
      display: flex;
      gap: 6px;
      justify-content: flex-end;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-family: inherit;
      font-size: 11px;
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid var(--line);
      background: var(--surface);
      color: var(--ink);
      cursor: pointer;
      transition: all 0.12s;
      min-height: 26px;
    }

    .btn:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    .empty {
      margin: 0;
      color: var(--muted);
      font-size: 13px;
    }

    @media (max-width: 880px) {
      article {
        grid-template-columns: 1fr;
        align-items: stretch;
      }
      .actions {
        justify-content: flex-start;
      }
    }
  `;cl([Q({type:Array})],ir.prototype,"jobs",2);cl([Q({type:String})],ir.prototype,"mac",2);ir=cl([ke("esp-compile-history")],ir);/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Dg=t=>t.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const _g={CHILD:2},Bg=t=>(...e)=>({_$litDirective$:t,values:e});let Rg=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,i,s){this._$Ct=e,this._$AM=i,this._$Ci=s}_$AS(e,i){return this.update(e,i)}update(e,i){return this.render(...i)}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Us=(t,e)=>{var s;const i=t._$AN;if(i===void 0)return!1;for(const r of i)(s=r._$AO)==null||s.call(r,e,!1),Us(r,e);return!0},bn=t=>{let e,i;do{if((e=t._$AM)===void 0)break;i=e._$AN,i.delete(t),t=e}while((i==null?void 0:i.size)===0)},Td=t=>{for(let e;e=t._$AM;t=e){let i=e._$AN;if(i===void 0)e._$AN=i=new Set;else if(i.has(t))break;i.add(t),Fg(e)}};function Lg(t){this._$AN!==void 0?(bn(this),this._$AM=t,Td(this)):this._$AM=t}function Ig(t,e=!1,i=0){const s=this._$AH,r=this._$AN;if(r!==void 0&&r.size!==0)if(e)if(Array.isArray(s))for(let n=i;n<s.length;n++)Us(s[n],!1),bn(s[n]);else s!=null&&(Us(s,!1),bn(s));else Us(this,t)}const Fg=t=>{t.type==_g.CHILD&&(t._$AP??(t._$AP=Ig),t._$AQ??(t._$AQ=Lg))};class Ng extends Rg{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,i,s){super._$AT(e,i,s),Td(this),this.isConnected=e._$AU}_$AO(e,i=!0){var s,r;e!==this.isConnected&&(this.isConnected=e,e?(s=this.reconnected)==null||s.call(this):(r=this.disconnected)==null||r.call(this)),i&&(Us(this,e),bn(this))}setValue(e){if(Dg(this._$Ct))this._$Ct._$AI(e,this);else{const i=[...this._$Ct._$AH];i[this._$Ci]=e,this._$Ct._$AI(i,this,0)}}disconnected(){}reconnected(){}}const xo=new WeakMap,zg=Bg(class extends Ng{render(t){return y}update(t,[e]){var s;const i=e!==this.G;return i&&this.G!==void 0&&this.rt(void 0),(i||this.lt!==this.ct)&&(this.G=e,this.ht=(s=t.options)==null?void 0:s.host,this.rt(this.ct=t.element)),y}rt(t){if(this.isConnected||(t=void 0),typeof this.G=="function"){const e=this.ht??globalThis;let i=xo.get(e);i===void 0&&(i=new WeakMap,xo.set(e,i)),i.get(this.G)!==void 0&&this.G.call(this.ht,void 0),i.set(this.G,t),t!==void 0&&this.G.call(this.ht,t)}else this.G.value=t}get lt(){var t,e;return typeof this.G=="function"?(t=xo.get(this.ht??globalThis))==null?void 0:t.get(this.G):(e=this.G)==null?void 0:e.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var Hg=Object.defineProperty,Wg=Object.getOwnPropertyDescriptor,As=(t,e,i,s)=>{for(var r=s>1?void 0:s?Wg(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&Hg(e,i,r),r};const Ug=100;let li=class extends de{constructor(){super(...arguments),this.mac="",this.visible=!0,this.stopped=!1,this.logs=[],this.autoScroll=!0,this.eventSource=null,this._macObserved="",this.reconnectAttempts=0,this.reconnectDelay=1e3,this.pendingLogs=[],this.flushTimer=null,this.scrollTarget=null}connectedCallback(){super.connectedCallback(),this.visible&&this.connect()}disconnectedCallback(){this.disconnect(),super.disconnectedCallback()}updated(t){this.hidden=!this.visible,t.has("visible")&&(this.visible?this.connect():(this.flushLogs(),this.disconnect())),t.has("stopped")&&this.stopped&&(this.flushLogs(),this.disconnect()),t.has("mac")&&this.mac!==this._macObserved&&(this.logs=[],this.pendingLogs=[],this.reconnectAttempts=0,this.visible&&this.connect())}connect(){this.stopped||!this.visible||(this.disconnect(),this.mac&&(this._macObserved=this.mac,this.eventSource=S.streamCompileLogs(this.mac,t=>{if(this.pendingLogs.push(t),t==="[build exited with code 0]"||t==="[build exited with code 1]"||t==="[status: idle]"){this.flushLogs(),this.stopped=!0,this.disconnect();return}this.scheduleFlush()},t=>{this.handleStreamError(t)})))}handleStreamError(t){if(this.stopped||!this.visible)return;this.eventSource&&(this.eventSource.close(),this.eventSource=null),this.reconnectAttempts++;const e=this.reconnectDelay*Math.pow(2,Math.min(this.reconnectAttempts-1,10));setTimeout(()=>this.connect(),e)}disconnect(){this.eventSource&&(this.eventSource.close(),this.eventSource=null),this.reconnectAttempts=0}scrollToBottom(){this.scrollTarget&&(this.scrollTarget.scrollTop=this.scrollTarget.scrollHeight)}toggleAutoScroll(){this.autoScroll=!this.autoScroll}clearLogs(){this.logs=[],this.pendingLogs=[]}scheduleFlush(){this.flushTimer||(this.flushTimer=setTimeout(()=>this.flushLogs(),Ug))}flushLogs(){if(this.flushTimer&&(clearTimeout(this.flushTimer),this.flushTimer=null),this.pendingLogs.length===0)return;const t=[...this.logs,...this.pendingLogs].slice(-800);this.pendingLogs=[],this.logs=t,this.autoScroll&&this.visible&&this.updateComplete.then(()=>this.scrollToBottom())}render(){return g`
      <div class="log-header">
        <span class="label">Build Log</span>
        <div class="controls">
          <button class="ctrl-btn" @click=${this.clearLogs}>Clear</button>
          <button class="ctrl-btn ${this.autoScroll?"active":""}" @click=${this.toggleAutoScroll}>
            ${this.autoScroll?"Auto-scroll ↓":"Scroll lock"}
          </button>
        </div>
      </div>
      <div class="log-body" ${zg(t=>{this.scrollTarget=t})}>
        ${this.logs.length===0?g`<span class="empty">Waiting for build output...</span>`:g`<pre>${this.logs.join(`
`)}</pre>`}
      </div>
    `}};li.styles=we`
    :host {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--line);
      background: #1a1b1e;
      border-radius: 8px;
      overflow: hidden;
      margin-top: 8px;
    }
    :host([hidden]) {
      display: none;
    }
    .log-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      border-bottom: 1px solid var(--line);
      background: #25262b;
      font-size: 11px;
    }
    .label {
      color: var(--muted);
      font-weight: 600;
      text-transform: uppercase;
    }
    .controls {
      display: flex;
      gap: 4px;
    }
    .ctrl-btn {
      border: 1px solid rgba(255,255,255,0.08);
      background: transparent;
      color: var(--muted);
      font: inherit;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.12s;
    }
    .ctrl-btn:hover,
    .ctrl-btn.active {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }
    .log-body {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      padding: 10px;
    }
    pre {
      margin: 0;
      color: #c0c5ce;
      font-family: ui-monospace, "SFMono-Regular", "Cascadia Code", "Liberation Mono", monospace;
      font-size: 12px;
      line-height: 1.4;
      white-space: pre-wrap;
      word-break: break-all;
    }
    .empty {
      color: var(--muted);
      font-style: italic;
      font-size: 12px;
    }
  `;As([Q({type:String})],li.prototype,"mac",2);As([Q({type:Boolean})],li.prototype,"visible",2);As([Q({type:Boolean})],li.prototype,"stopped",2);As([v()],li.prototype,"logs",2);As([v()],li.prototype,"autoScroll",2);li=As([ke("esp-compile-log-viewer")],li);var qg=Object.defineProperty,Vg=Object.getOwnPropertyDescriptor,bt=(t,e,i,s)=>{for(var r=s>1?void 0:s?Vg(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&qg(e,i,r),r};const Qg=["queued","starting","transferring","verifying","transfer_success_waiting_rejoin"],wo=["compile_queued","compiling"];let et=class extends de{constructor(){super(...arguments),this.mac="",this.node=null,this.topology=[],this.currentJob=null,this.history=[],this.compileHistoryList=[],this.compileStatus="idle",this.loading=!0,this.error="",this.compileTimer=null}connectedCallback(){super.connectedCallback(),this.load(),this.schedulePoll()}disconnectedCallback(){this.timer&&window.clearInterval(this.timer),this.compileTimer&&window.clearInterval(this.compileTimer),super.disconnectedCallback()}schedulePoll(){this.timer&&window.clearInterval(this.timer);const e=this.currentJob&&Qg.includes(this.currentJob.status)?2e3:5e3;this.timer=window.setInterval(()=>void this.load(!1),e)}pollCompileStatus(){S.getCompileStatus(this.mac).then(t=>{this.compileStatus=t.status,wo.includes(t.status)?this.compileTimer||(this.compileTimer=setInterval(()=>this.pollCompileStatus(),3e3)):this.compileTimer&&(clearInterval(this.compileTimer),this.compileTimer=null)}).catch(()=>{})}handleReflashResult(t){this.otaBox.preflight=t.detail.preflight,this.load(!1)}updated(){this.schedulePoll()}async load(t=!0){t&&(this.loading=!0);try{const[e,i,s,r,n]=await Promise.all([S.topology(),S.currentOtaForDevice(this.mac),S.getQueue(),S.history(this.mac),S.getCompileHistory(this.mac)]);this.topology=e,this.node=e.find(c=>ae(c.mac)===ae(this.mac))||null;const o=ae(this.mac),a=(s.queued_jobs??[]).find(c=>ae(c.mac)===o)??null;i&&i.job&&ae(i.job.mac)===o?this.currentJob=i.job:a?this.currentJob=a:this.currentJob=null,this.history=r.jobs,this.compileHistoryList=n.jobs,this.error="";const l=await S.getCompileStatus(this.mac).catch(()=>null);l&&(this.compileStatus=l.status),wo.includes(this.compileStatus)&&this.pollCompileStatus()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.loading=!1}}goBack(){window.location.hash="/"}render(){if(this.loading)return g`<div class="card">Loading device...</div>`;if(this.error)return g`<div class="card error">${this.error}</div>`;if(!this.node)return g`
        <div class="card">
          <button class="back" @click=${this.goBack}>Back</button>
          <p>Device ${this.mac} is not present in the current bridge topology.</p>
        </div>
      `;const t=!this.node.is_bridge&&(this.node.hops??0)>0,e=this.topology.filter(i=>!i.online||ae(i.mac)===ae(this.node.mac)?!1:!!i.is_bridge||!!i.can_relay||(i.hops??0)>0);return g`
      <button class="back" @click=${this.goBack}>Back to topology</button>
      <section class="hero">
        <div class="hero-left">
          <h2>${this.node.friendly_name||this.node.esphome_name||this.node.label||this.node.mac}<span class="mac-suffix"> ${this.node.mac}</span></h2>
          <div class="hero-stats">
            <div class="hero-box sm ${this.node.online?"box-online":"box-offline"}" title="${this.node.firmware_md5?`firmware MD5: ${this.node.firmware_md5}`:"firmware MD5: —"}"><span class="lbl">Status</span><span class="val">${this.node.online?"Online":this.node.offline_reason||"Offline"}</span></div>
            <div class="hero-box sm"><span class="lbl">Hops</span><span class="val">${this.node.hops??0}</span></div>
            <div class="hero-box sm"><span class="lbl">Uptime</span><span class="val">${pt(this.node.uptime_s)}</span></div>
            <div class="hero-box sm"><span class="lbl">Last Seen</span><span class="val">${this.node.last_seen_ago!=null?`${pt(this.node.last_seen_ago)}${this.node.is_bridge?"":" ago"}`:"-"}</span></div>
            ${this.node.chip_name?g`<div class="hero-box sm"><span class="lbl">Chip</span><span class="val">${this.node.chip_name}</span></div>`:y}
            <div class="hero-box sm"><span class="lbl">RSSI</span><span class="val">${this.node.rssi==null?"-":`${this.node.rssi}`}<span class="unit">dBm</span></span></div>
            <a class="hero-entities ${this.node.ha_device_id?"":"not-added"}" href="${this.node.ha_device_id?`/config/devices/device/${this.node.ha_device_id}`:"/config/integrations/dashboard/add?domain=esp_tree"}" target="_blank" rel="noopener"><span class="lbl">Entities</span><span class="val">${this.node.ha_device_id?"View in HA":"Not Yet Added"}</span></a>
          </div>
        </div>
      </section>

      <div class="layout">
        ${t?g`
              <section class="card config-card">
                <esp-device-config
                  .mac=${this.node.mac}
                  .online=${!!this.node.online}
                  .isRemote=${t}
                  .relayNodes=${e}
                  .relayEnabled=${!!this.node.relay_enabled}
                  @config-changed=${()=>void this.load(!1)}
                ></esp-device-config>
              </section>
              <section class="card">
                <esp-ota-box .mac=${this.node.mac} .node=${this.node} .currentJob=${this.currentJob} .showEditYaml=${t} @ota-changed=${()=>void this.load(!1)}></esp-ota-box>
              </section>
              <section class="layout-empty"></section>
            `:g`
              <section class="card">
                <esp-ota-box .mac=${this.node.mac} .node=${this.node} .currentJob=${this.currentJob} @ota-changed=${()=>void this.load(!1)}></esp-ota-box>
              </section>
            `}
        <section class="card history">
          <esp-flash-history .jobs=${this.history} @ota-changed=${()=>void this.load(!1)} @ota-reflash-result=${this.handleReflashResult}></esp-flash-history>
        </section>
        <section class="panel history">
          <esp-compile-history .jobs=${this.compileHistoryList} .mac=${this.mac}></esp-compile-history>
        </section>
        ${wo.includes(this.compileStatus)||this.compileStatus==="failed"?g`<section class="panel history">
              <esp-compile-log-viewer .mac=${this.mac} .visible=${!0}></esp-compile-log-viewer>
            </section>`:y}
      </div>
    `}};et.styles=we`
    .back {
      border: 1px solid var(--line);
      background: var(--surface);
      min-height: 36px;
      padding: 0 14px;
      font: inherit;
      font-weight: 500;
      border-radius: 8px;
      cursor: pointer;
      margin-bottom: 16px;
      font-size: 13px;
      transition: all 0.12s;
    }

    .back:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    .hero,
    .card {
      border: 1px solid var(--line);
      background: var(--surface);
      border-radius: 12px;
      box-shadow: var(--shadow);
    }

    .hero {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
      padding: 20px 24px;
      margin-bottom: 20px;
    }

    .hero-left {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .hero-left h2 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      line-height: 1;
      overflow-wrap: anywhere;
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .mac-suffix {
      font-size: 14px;
      font-weight: 400;
      color: var(--muted);
      font-family: monospace;
    }
    .hero-entities {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 6px 10px;
      min-width: 70px;
      text-decoration: none;
      color: inherit;
      transition: border-color 0.15s, background 0.15s;
    }
    .hero-entities:hover {
      background: #eef4ff;
      border-color: #93c5fd;
    }
    .hero-entities .lbl {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
    }
    .hero-entities .val {
      font-size: 13px;
      font-weight: 600;
    }
    .hero-entities.not-added {
      border-color: #fecaca;
      background: #fef2f2;
    }
    .hero-entities.not-added:hover {
      background: #fee2e2;
      border-color: #f87171;
    }
    .hero-entities.not-added .val {
      color: #dc2626;
      font-size: 10px;
      font-weight: 500;
    }

    .hero-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .hero-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 8px 14px;
      min-width: 80px;
    }

    .hero-box.sm {
      min-width: 70px;
      padding: 6px 10px;
    }

    .hero-box.sm .lbl {
      font-size: 9px;
    }

.hero-box.sm {
      min-width: 70px;
      padding: 6px 10px;
    }

    .hero-box.sm .lbl {
      font-size: 9px;
    }

.hero-box.sm .val {
      font-size: 13px;
    }

    .box-online {
      background: #dcfce7;
      border-color: #bbf7d0;
    }

    .box-online .lbl,
    .box-online .val {
      color: #166534;
    }

    .box-offline {
      background: #fef2f2;
      border-color: #fecaca;
    }

    .box-offline .lbl,
    .box-offline .val {
      color: #991b1b;
    }

    .hero-box .lbl {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 600;
      color: #94a3b8;
      margin-bottom: 2px;
    }

    .hero-box .val {
      font-size: 16px;
      font-weight: 700;
      color: var(--primary);
      display: flex;
      align-items: baseline;
      gap: 2px;
    }

    .hero-box .val .unit {
      font-size: 11px;
      font-weight: 500;
      color: #94a3b8;
    }

    .btn-edit-config {
      border: 1px solid #0f766e;
      background: #0f766e;
      color: #fff;
      min-height: 36px;
      padding: 0 16px;
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      border-radius: 8px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.12s;
      align-self: flex-start;
    }

    .btn-edit-config:hover {
      background: #0d5f58;
      border-color: #0d5f58;
    }

    .layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }

    .panel,
    .card {
      padding: 16px 20px;
    }

    .history {
      grid-column: 1 / -1;
    }

    .layout-empty {
      min-height: 1px;
    }

    .error {
      color: var(--danger);
      font-weight: 500;
      padding: 12px;
      border: 1px solid var(--danger);
      border-radius: 8px;
      background: #fef2f2;
    }

    @media (max-width: 900px) {
      .layout {
        grid-template-columns: 1fr;
      }
      .hero-stats {
        flex-wrap: wrap;
      }
    }

    @media (max-width: 500px) {
      .hero-stats {
        flex-direction: column;
      }
    }
  `;bt([Q({type:String})],et.prototype,"mac",2);bt([v()],et.prototype,"node",2);bt([v()],et.prototype,"topology",2);bt([v()],et.prototype,"currentJob",2);bt([v()],et.prototype,"history",2);bt([v()],et.prototype,"compileHistoryList",2);bt([v()],et.prototype,"compileStatus",2);bt([v()],et.prototype,"loading",2);bt([v()],et.prototype,"error",2);bt([Pd("esp-ota-box")],et.prototype,"otaBox",2);et=bt([ke("esp-device-detail")],et);var jg=Object.defineProperty,Kg=Object.getOwnPropertyDescriptor,le=(t,e,i,s)=>{for(var r=s>1?void 0:s?Kg(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&jg(e,i,r),r};let se=class extends de{constructor(){super(...arguments),this.autoInit=!1,this.config=null,this.configuredBridges=[],this.discoveredBridges=[],this.loading=!0,this.discovering=!1,this.saving=!1,this.error="",this.saved="",this.containerStatus=null,this.cleaningArtifacts=!1,this.artifactsMessage="",this.editingBridgeId=null,this.editApiKey="",this.newBridgeApiKey="",this.showManualEntry=!1,this.manualHost="",this.manualPort=80,this.manualApiKey="",this.showScanLog=!1,this.scanLogContent="",this.scanLogLoading=!1,this.restarting=!1,this.restartFeedback="",this.integrationPollTimer=null}connectedCallback(){super.connectedCallback(),this.load(),this.loadContainerStatus(),this.integrationPollTimer=setInterval(()=>void this.pollIntegrationStatus(),5e3),this.autoInit&&this.discover()}disconnectedCallback(){super.disconnectedCallback(),this.integrationPollTimer&&(clearInterval(this.integrationPollTimer),this.integrationPollTimer=null)}async pollIntegrationStatus(){try{this.config=await S.config()}catch{}}async restartHa(){this.restarting=!0,this.restartFeedback="";try{const t=await S.requestRestart();t.success?this.restartFeedback="Restart requested":this.restartFeedback=t.error||"Restart failed"}catch{this.restartFeedback="Restart failed"}finally{this.restarting=!1,setTimeout(()=>{this.restartFeedback=""},4e3)}}renderIntegrationStatus(){var h;const t=(h=this.config)==null?void 0:h.integration;if(!t)return g`<p class="int-status-note muted">Loading integration status...</p>`;const{installed:e,loaded:i,configured:s,connected:r,bridge_count:n,remote_count:o}=t,a=typeof t.remotes_online=="number",l=a?t.remotes_online:0,c=a?o-l:0;return e?i?!s&&!i?g`
        <div class="int-status-row">
          <span class="status-dot yellow"></span>
          <span>Integration not yet configured</span>
        </div>
        <div class="int-configure-hint">
          <strong>Add ESP-Tree integration</strong>
          <p>Go to <strong>Settings → Devices &amp; Services → Add Integration</strong> → search for <em>ESP-Tree</em></p>
        </div>
      `:r?g`
      <div class="int-connected-box">
        <div class="int-connected-header">
          <span class="status-dot green pulse"></span>
          <span class="int-connected-label">Connected v${t.version||"?"}</span>
        </div>
        <div class="int-connected-counts">
          ${n>0?g`<span>${n} ${n===1?"bridge":"bridges"}</span>`:y}
          ${a?g`
                ${l>0?g`<span>${l} ${l===1?"remote":"remotes"} online</span>`:y}
                ${c>0?g`<span class="muted">${c} offline</span>`:y}
                ${l===0&&c===0?g`<span>no remotes</span>`:y}
              `:g`<span>${o} ${o===1?"remote":"remotes"} known</span>`}
        </div>
      </div>
    `:g`
        <div class="int-status-row">
          <span class="status-dot gray"></span>
          <span>Bridge connection lost</span>
        </div>
      `:g`
        <div class="int-status-row">
          <span class="status-dot yellow"></span>
          <span>Integration installed but not yet loaded — Restart Home Assistant</span>
        </div>
        <button class="btn btn-primary" ?disabled=${this.restarting} @click=${this.restartHa}>
          ${this.restarting?"Restarting...":"Restart Home Assistant"}
        </button>
        ${this.restartFeedback?g`<p class="saved">${this.restartFeedback}</p>`:y}
      `:g`
        <div class="int-status-row">
          <span class="status-dot red"></span>
          <span>Integration files not found — Restart Home Assistant to complete installation</span>
        </div>
      `}async load(){this.loading=!0,this.error="";try{this.config=await S.config(),this.configuredBridges=await S.getBridges()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.loading=!1}}async loadContainerStatus(){try{this.containerStatus=await S.getContainerStatus()}catch{this.containerStatus=null}}isBridgeConnected(t){var i;if(typeof t.client_connected=="boolean")return t.client_connected;if(!((i=this.config)!=null&&i.active_bridge)||this.config.active_bridge.error)return!1;const e=this.config.active_bridge;return e.uuid===t.uuid||e.host===t.host&&e.port===t.port}bridgeSkippedReason(t){return(t.client_skipped_reason||"").trim()}isBridgeActive(t){return!!t.is_active}isSerial(t){return t.transport==="serial"}bridgeHostname(t){return this.isSerial(t)?"serial":t.hostname||"-"}bridgeAddress(t){return this.isSerial(t)?t.serial_port||"-":t.host||"-"}async discover(){this.discovering=!0,this.error="",this.newBridgeApiKey="";try{const t=await S.discoverBridges();this.discoveredBridges=t.bridges,this.discoveredBridges.length===0&&(this.error="No bridges found. Make sure your bridge is powered on and connected to the same network, then try again. You can also use Manual IP to connect directly.")}catch(t){const e=t instanceof Error?t.message:String(t);e==="timeout"?this.error="Scan timed out. Try again or use View Scan Log to see scanned IPs, or use Manual IP to connect directly.":e==="cancelled"?this.error="":this.error=e}finally{this.discovering=!1}}async triggerScan(){this.discovering=!0,this.error="",this.newBridgeApiKey="";try{const t=await S.triggerScan();!t.success&&t.error&&(this.error=t.error),await this.discover()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.discovering=!1}}async viewScanLog(){if(this.showScanLog){this.showScanLog=!1;return}this.scanLogLoading=!0,this.showScanLog=!0;try{this.scanLogContent=await S.getScanLog()||"(empty)"}catch(t){this.scanLogContent=t instanceof Error?t.message:String(t)}finally{this.scanLogLoading=!1}}async selectBridge(t){if(!this.newBridgeApiKey.trim()){this.error="API key is required";return}this.saving=!0,this.error="",this.saved="";try{await S.selectBridge(t.host,t.port,t.name,t.version,this.newBridgeApiKey,t.network_id,t.hostname),this.saved=`Connected to ${t.name||t.host}`,this.discoveredBridges=[],this.newBridgeApiKey="",await this.load()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.saving=!1}}async addManualBridge(){if(!this.manualHost.trim()){this.error="Host is required";return}if(!this.manualPort||this.manualPort<1||this.manualPort>65535){this.error="Valid port is required";return}this.saving=!0,this.error="",this.saved="";try{await S.addBridge(this.manualHost.trim(),this.manualPort,void 0,this.manualApiKey||"",""),this.saved=`Connected to ${this.manualHost}:${this.manualPort}`,this.showManualEntry=!1,this.manualHost="",this.manualPort=80,this.manualApiKey="",await this.load()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.saving=!1}}async deleteBridge(t){this.saving=!0,this.error="";try{await S.deleteBridge(t.uuid),this.saved="Bridge removed",await this.load()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.saving=!1}}async updateBridgeApiKey(t){if(!this.editApiKey.trim()){this.error="API key is required";return}this.saving=!0,this.error="";try{await S.updateBridge(t.uuid,void 0,void 0,void 0,this.editApiKey),this.saved=`API key updated for ${t.name||t.host}`,this.editingBridgeId=null,this.editApiKey="",await this.load()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.saving=!1}}startEditingBridge(t){this.editingBridgeId=t.uuid,this.editApiKey=t.api_key||""}cancelEditing(){this.editingBridgeId=null,this.editApiKey=""}async cleanArtifacts(){this.cleaningArtifacts=!0,this.artifactsMessage="";try{const e=((await S.cleanArtifacts()).total_bytes/(1024*1024)).toFixed(1);this.artifactsMessage=`Cleared ${e} MB of build cache. Next compile will be slower.`,this.loadContainerStatus()}catch(t){this.artifactsMessage=`Error: ${t instanceof Error?t.message:String(t)}`}finally{this.cleaningArtifacts=!1}}async activateBridge(t){this.saving=!0,this.error="",this.saved="";try{await S.activateBridge(t.uuid),this.saved=`Activated ${t.name||t.host}`,await this.load()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.saving=!1}}async deactivateBridge(t){this.saving=!0,this.error="",this.saved="";try{await S.deactivateBridge(t.uuid),this.saved=`Deactivated ${t.name||t.host}`,await this.load()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.saving=!1}}render(){var t,e,i,s;return this.loading?g`<section class="card">Loading settings...</section>`:g`
      <section class="card">
        <div class="title">
          <h2>Connection</h2>
        </div>

        <div class="actions">
          <button class="btn btn-primary" ?disabled=${this.discovering} @click=${this.triggerScan}>
            ${this.discovering?g`<span class="spinner"></span> Scanning...`:"Scan Network"}
          </button>
          <button class="btn" ?disabled=${this.saving} @click=${()=>this.showManualEntry=!this.showManualEntry}>
            ${this.showManualEntry?"Cancel":"Manual IP"}
          </button>
          <button class="btn" @click=${this.viewScanLog}>
            ${this.showScanLog?"Hide Scan Log":"View Scan Log"}
          </button>
        </div>

        ${this.showScanLog?g`
          <div class="scan-log">
            <h3>Scan Log</h3>
            ${this.scanLogLoading?g`<p class="info">Loading...</p>`:g`
              <pre class="scan-log-content">${this.scanLogContent}</pre>
            `}
          </div>
        `:y}

        ${this.showManualEntry?g`
          <div class="manual-entry">
            <div class="manual-form">
              <label>
                Host / IP
                <input type="text" placeholder="192.168.1.50 or hostname.local" .value=${this.manualHost} @input=${r=>this.manualHost=r.target.value} />
              </label>
              <label>
                Port
                <input type="number" min="1" max="65535" .value=${String(this.manualPort)} @input=${r=>this.manualPort=Number(r.target.value||80)} />
              </label>
              <label>
                API Key
                <input type="password" placeholder="API Key" .value=${this.manualApiKey} @input=${r=>this.manualApiKey=r.target.value} />
              </label>
            </div>
            <button class="btn btn-primary" ?disabled=${this.saving} @click=${this.addManualBridge}>Connect</button>
          </div>
        `:y}

        ${this.discovering?g`<p class="info">Scanning your network for bridges (8s)...</p>`:y}

        ${this.discoveredBridges.length>0?g`
          <div class="bridge-list">
            <h3>Discovered Bridges</h3>
            <table class="bridge-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Hostname</th>
                  <th>IP</th>
                  <th>Port</th>
                  <th>Network ID</th>
                  <th>API Key</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                ${this.discoveredBridges.map(r=>g`
                  <tr>
                    <td><strong>${r.name||r.host}</strong></td>
                    <td>${r.hostname||"-"}</td>
                    <td>${r.host}</td>
                    <td>${r.port}</td>
                    <td>${r.network_id||"-"}</td>
                    <td>
                      <input
                        type="password"
                        placeholder="API Key"
                        .value=${this.newBridgeApiKey}
                        @input=${n=>this.newBridgeApiKey=n.target.value}
                      />
                    </td>
                    <td>
                      <button class="btn btn-primary" ?disabled=${this.saving} @click=${()=>this.selectBridge(r)}>
                        Select
                      </button>
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        `:y}

        ${this.configuredBridges.length>0?g`
          <div class="bridge-list-container">
            <h3>Configured Bridges</h3>
            <table class="bridge-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Name</th>
                  <th>Hostname</th>
                  <th>IP</th>
                  <th>Port</th>
                  <th>Network ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.configuredBridges.map(r=>g`
                  <tr class="${this.isBridgeActive(r)?"active-row":""}">
                    <td>
                      <span class="bridge-status ${this.isBridgeConnected(r)?"connected":"disconnected"}">
                        ${this.isBridgeConnected(r)?"connected":"disconnected"}
                      </span>
                      ${this.isBridgeActive(r)?g`<span class="active-badge">Active</span>`:y}
                      ${this.bridgeSkippedReason(r)?g`<div class="bridge-skip-reason">${this.bridgeSkippedReason(r)}</div>`:y}
                    </td>
                    <td>
                      ${r.name||"-"}
                      ${this.isSerial(r)?g`<span class="active-badge">Serial</span>`:y}
                    </td>
                    <td>${this.bridgeHostname(r)}</td>
                    <td>${this.bridgeAddress(r)}</td>
                    <td>${this.isSerial(r)?"-":r.port||"-"}</td>
                    <td>${r.network_id||"-"}</td>
                    <td class="actions-cell">
                      ${this.editingBridgeId===r.uuid?g`
                        <input
                          type="password"
                          placeholder="API Key"
                          .value=${this.editApiKey}
                          @input=${n=>this.editApiKey=n.target.value}
                        />
                        <button class="btn btn-primary" ?disabled=${this.saving} @click=${()=>this.updateBridgeApiKey(r)}>Save</button>
                        <button class="btn" ?disabled=${this.saving} @click=${this.cancelEditing}>Cancel</button>
                      `:g`
                        ${this.isBridgeActive(r)?g`<button class="btn" ?disabled=${this.saving} @click=${()=>this.deactivateBridge(r)}>Deactivate</button>`:g`<button class="btn btn-primary" ?disabled=${this.saving} @click=${()=>this.activateBridge(r)}>Activate</button>`}
                        <button class="btn" ?disabled=${this.saving} @click=${()=>this.startEditingBridge(r)}>Edit API Key</button>
                        <button class="btn btn-danger" ?disabled=${this.saving} @click=${()=>this.deleteBridge(r)}>Delete</button>
                      `}
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        `:y}

        ${this.error?g`<p class="error">${this.error}</p>`:y}
        ${this.saved?g`<p class="saved">${this.saved}</p>`:y}
      </section>

      <section class="card integration-status-card">
        <div class="title">
          <h2>Integration Status</h2>
          
        </div>
        <div class="int-status-row-layout">
          ${this.renderIntegrationStatus()}
          <div class="actions">
            <a href="#/activity-log" class="btn">
              Activity Log
              <span class="sub">Bridge/remote/protobuf events</span>
            </a>
          </div>
        </div>
      </section>

      <section class="card">
        <div class="title">
          <h2>ESPHome</h2>
        </div>

        <div class="current">
          <div><span>Status</span><strong class=${(t=this.containerStatus)!=null&&t.available?"ok":"danger"}>${(e=this.containerStatus)!=null&&e.available?"Available":"Unavailable"}</strong></div>
          <div><span>ESPHome</span><strong>${((i=this.containerStatus)==null?void 0:i.tag)||"unknown"}</strong></div>
          ${(s=this.containerStatus)!=null&&s.error?g`<div><span>Error</span><strong>${this.containerStatus.error}</strong></div>`:y}
        </div>

        <div class="actions">
          <button class="btn btn-danger" ?disabled=${this.cleaningArtifacts} @click=${this.cleanArtifacts}>Clean build artifacts</button>
        </div>

        ${this.artifactsMessage?g`<p class="info">${this.artifactsMessage}</p>`:y}

        <p class="hint">Clean build artifacts removes PlatformIO cache and ESPHome build output. Useful for freeing space or resolving stale build state.</p>
      </section>
    `}};se.styles=we`
    .card {
      border: 1px solid var(--line);
      background: var(--surface);
      border-radius: 12px;
      box-shadow: var(--shadow);
      padding: 16px 20px;
      display: grid;
      gap: 16px;
      margin-bottom: 16px;
    }

    .title span,
    .current span {
      color: var(--primary);
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 600;
    }

    h2 {
      margin: 3px 0 0;
      font-size: 16px;
      font-weight: 600;
    }

    h3 {
      margin: 8px 0 4px;
      font-size: 13px;
      font-weight: 600;
      color: var(--muted);
    }

    .current {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 8px;
    }

    .current > div {
      background: #f8fafc;
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid #f1f5f9;
    }

    .current span {
      display: block;
      color: #94a3b8;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .current strong {
      display: block;
      margin-top: 4px;
      overflow-wrap: anywhere;
      font-size: 14px;
      font-weight: 500;
    }

    .ok { color: var(--ok); }
    .danger { color: var(--danger); }

    .bridge-list-container {
      border: 1px solid var(--line);
      background: var(--surface);
      border-radius: 12px;
      box-shadow: var(--shadow);
      padding: 16px 20px;
      margin-bottom: 16px;
    }

    .bridge-list {
      background: #f8fafc;
      border: 1px solid #f1f5f9;
      border-radius: 8px;
      padding: 12px;
    }

    .bridge-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    .bridge-table th {
      text-align: left;
      font-size: 11px;
      text-transform: uppercase;
      color: var(--muted);
      font-weight: 600;
      padding: 6px 8px;
      border-bottom: 2px solid var(--line);
    }

    .bridge-table td {
      padding: 8px;
      border-bottom: 1px solid #f1f5f9;
    }

    .bridge-table tr:last-child td {
      border-bottom: none;
    }

    .bridge-table .actions-cell {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
    }

    .bridge-table input[type="password"] {
      padding: 4px 8px;
      font-size: 12px;
      border: 1px solid var(--line);
      border-radius: 6px;
    }

    .bridge-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #f1f5f9;
      gap: 12px;
    }

    .bridge-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .bridge-item:first-child {
      padding-top: 0;
    }

    .bridge-item.default {
      background: #dcfce7;
      margin: -12px;
      padding: 10px 12px;
      border-radius: 8px;
    }

    .bridge-info {
      display: flex;
      flex-direction: row;
      gap: 12px;
      align-items: center;
    }

    .bridge-info strong {
      font-size: 14px;
      font-weight: 600;
    }

    .bridge-info span {
      font-size: 12px;
      color: var(--muted);
    }

    .bridge-info .version {
      color: var(--ok);
    }

    .bridge-info .via {
      font-size: 11px;
      text-transform: uppercase;
    }

    .bridge-status {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid;
    }

    .bridge-status.connected {
      color: var(--ok);
      border-color: var(--ok);
      background: #dcfce7;
    }

    .bridge-status.disconnected {
      color: var(--danger);
      border-color: var(--danger);
      background: #fee2e2;
    }

    /* Why a bridge has no client (e.g. "bridge has no api_key"). Without this the
       row looked healthy while no client was ever started. */
    .bridge-skip-reason {
      margin-top: 4px;
      font-size: 10px;
      line-height: 1.25;
      color: var(--danger);
      text-transform: none;
      font-weight: 500;
      max-width: 22ch;
    }

    .active-badge {
      color: var(--ok);
      background: #dcfce7;
      border: 1px solid var(--ok);
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 8px;
      text-transform: uppercase;
    }

    .bridge-form {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .manual-entry {
      background: #f8fafc;
      border: 1px solid #f1f5f9;
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .manual-form {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 100px;
      gap: 12px;
    }

    .manual-form label {
      display: grid;
      gap: 4px;
      font-weight: 500;
      font-size: 13px;
    }

    .manual-form input {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      min-height: 38px;
      padding: 8px 12px;
      font: inherit;
      font-size: 14px;
      background: var(--surface);
      color: var(--ink);
    }

    .manual-form input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(11,59,75,0.1);
    }

    .bridge-actions {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }

    .unavailable-note {
      background: #fef2f2;
      border: 1px solid var(--danger);
      padding: 12px;
      border-radius: 8px;
    }
    .unavailable-note strong {
      color: var(--danger);
      font-size: 14px;
      display: block;
      margin-bottom: 4px;
    }
    .unavailable-note p {
      margin: 2px 0;
      font-size: 12px;
      color: var(--ink);
    }

    .form {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 140px;
      gap: 12px;
    }

    label {
      display: grid;
      gap: 4px;
      font-weight: 500;
      font-size: 13px;
    }

    input[type="text"],
    input[type="password"] {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      min-height: 38px;
      padding: 8px 12px;
      font: inherit;
      font-size: 14px;
      background: var(--surface);
      color: var(--ink);
      transition: border-color 0.12s;
    }

    input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(11,59,75,0.1);
    }

    .actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: inherit;
      font-size: 13px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
      border: 1px solid var(--line);
      background: var(--surface);
      color: var(--ink);
      cursor: pointer;
      transition: all 0.12s;
      min-height: 38px;
    }

    .btn:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    a.btn {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
      text-decoration: none;
    }

    a.btn .sub {
      font-size: 10px;
      font-weight: 400;
      color: var(--muted);
      line-height: 1;
    }

    .btn-primary {
      background: var(--primary);
      color: #fff;
      border-color: var(--primary);
    }

    .btn-primary:hover {
      background: #0d4d5e;
    }

    .btn-danger {
      background: var(--danger);
      color: #fff;
      border-color: var(--danger);
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    button:disabled,
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error,
    .saved,
    .info {
      margin: 0;
      font-weight: 500;
      font-size: 13px;
    }

    .error {
      color: var(--danger);
      padding: 10px 12px;
      background: #fef2f2;
      border: 1px solid var(--danger);
      border-radius: 6px;
    }

    .saved {
      color: var(--ok);
      padding: 10px 12px;
      background: #dcfce7;
      border: 1px solid var(--ok);
      border-radius: 6px;
    }

    .info {
      color: var(--primary);
    }

    .hint {
      font-size: 11px;
      color: var(--muted);
      margin: 0;
    }

    .toggle-row {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .toggle {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }

    .toggle input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: var(--primary);
      cursor: pointer;
    }

    .toggle-label {
      font-weight: 500;
      font-size: 14px;
    }

    .scan-log {
      margin-top: 12px;
    }

    .scan-log h3 {
      margin: 0 0 8px;
      font-size: 14px;
      font-weight: 600;
    }

    .scan-log-content {
      background: #1e293b;
      color: #e2e8f0;
      padding: 12px;
      border-radius: 6px;
      font-family: 'Menlo', 'Consolas', monospace;
      font-size: 12px;
      line-height: 1.5;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-all;
      max-height: 400px;
      overflow-y: auto;
      margin: 0;
    }

    

    .int-status-row {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .status-dot.red { background: #ef4444; }
    .status-dot.yellow { background: #eab308; }
    .status-dot.gray { background: #9ca3af; }
    .status-dot.green { background: #22c55e; }

    .status-dot.green.pulse {
      animation: pulse-green 2s ease-in-out infinite;
    }

    @keyframes pulse-green {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(0.85); }
    }

    .int-status-note {
      font-size: 13px;
    }

    .int-configure-hint {
      margin-top: 8px;
      padding: 12px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #f1f5f9;
    }

    .int-configure-hint strong {
      display: block;
      font-size: 14px;
      margin-bottom: 4px;
    }

    .int-configure-hint p {
      margin: 0;
      font-size: 13px;
      color: #64748b;
    }

    .int-connected-box {
      border: 2px solid #22c55e;
      border-radius: 10px;
      padding: 14px 16px;
      background: #f0fdf4;
    }

    .int-connected-header {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .int-connected-label {
      font-size: 15px;
      font-weight: 600;
      color: #166534;
    }

    .int-connected-counts {
      margin-top: 6px;
      display: flex;
      gap: 16px;
      font-size: 13px;
      color: #15803d;
    }

    .int-status-row-layout {
      display: flex;
      gap: 16px;
      align-items: stretch;
    }

    .int-status-row-layout .actions {
      flex: 1;
      display: flex;
      align-items: center;
    }

    .muted {
      color: var(--muted);
    }

    @media (max-width: 760px) {
      .current,
      .form,
      .manual-form {
        grid-template-columns: 1fr;
      }

      .bridge-item,
      .bridge-form,
      .bridge-actions {
        align-items: stretch;
        flex-direction: column;
      }

      .bridge-info {
        align-items: flex-start;
        flex-direction: column;
        gap: 6px;
      }

      .int-status-row-layout {
        flex-direction: column;
      }
    }
  `;le([Q({type:Boolean})],se.prototype,"autoInit",2);le([v()],se.prototype,"config",2);le([v()],se.prototype,"configuredBridges",2);le([v()],se.prototype,"discoveredBridges",2);le([v()],se.prototype,"loading",2);le([v()],se.prototype,"discovering",2);le([v()],se.prototype,"saving",2);le([v()],se.prototype,"error",2);le([v()],se.prototype,"saved",2);le([v()],se.prototype,"containerStatus",2);le([v()],se.prototype,"cleaningArtifacts",2);le([v()],se.prototype,"artifactsMessage",2);le([v()],se.prototype,"editingBridgeId",2);le([v()],se.prototype,"editApiKey",2);le([v()],se.prototype,"newBridgeApiKey",2);le([v()],se.prototype,"showManualEntry",2);le([v()],se.prototype,"manualHost",2);le([v()],se.prototype,"manualPort",2);le([v()],se.prototype,"manualApiKey",2);le([v()],se.prototype,"showScanLog",2);le([v()],se.prototype,"scanLogContent",2);le([v()],se.prototype,"scanLogLoading",2);le([v()],se.prototype,"restarting",2);le([v()],se.prototype,"restartFeedback",2);se=le([ke("esp-settings")],se);var Xg=Object.defineProperty,Jg=Object.getOwnPropertyDescriptor,It=(t,e,i,s)=>{for(var r=s>1?void 0:s?Jg(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&Xg(e,i,r),r};const Yg=300,pc=new Set(["success","failed","aborted","rejoin_timeout","version_mismatch"]);let lt=class extends de{constructor(){super(...arguments),this.queueData=null,this.compileData=null,this.historyJobs=[],this.error="",this.busyJob=null,this.busyAction="",this.showAbortModal=!1,this.historyFilter="all",this.historyLimit=10,this.pollTimer=null,this.historyTimer=null}connectedCallback(){super.connectedCallback(),this.fetchQueue(),this.pollTimer=setInterval(()=>this.fetchQueue(),2e3),this.fetchHistory(),this.historyTimer=setInterval(()=>this.fetchHistory(),5e3)}disconnectedCallback(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null),this.historyTimer&&(clearInterval(this.historyTimer),this.historyTimer=null),super.disconnectedCallback()}async fetchQueue(){try{const[t,e]=await Promise.all([S.getQueue(),S.getCompileQueue()]);this.queueData=t,this.compileData=e}catch{}}async fetchHistory(){try{const t=await S.getAllHistory(100);this.historyJobs=t.jobs}catch{}}async pauseQueue(){this.busyAction="pause",this.error="";try{await S.pauseQueue(),await this.fetchQueue()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busyAction=""}}async resumeQueue(){this.busyAction="resume",this.error="";try{await S.resumeQueue(),await this.fetchQueue()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busyAction=""}}async abortQueuedJob(t){this.busyJob=t,this.error="";try{await S.abortQueuedJob(t),await this.fetchQueue()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.busyJob=null}}async abortCompileJob(t){this.busyJob=t,this.error="";try{await S.abortCompileJob(t),await this.fetchQueue()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.busyJob=null}}async moveUp(t){this.busyJob=t,this.error="";try{await S.reorderJobUp(t),await this.fetchQueue()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.busyJob=null}}async moveDown(t){this.busyJob=t,this.error="";try{await S.reorderJobDown(t),await this.fetchQueue()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.busyJob=null}}async abortActiveJob(){this.busyAction="abort-active",this.error="";try{if((await S.getQueue()).count>0){this.showAbortModal=!0;return}await S.abortOta(),await this.fetchQueue()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busyAction=""}}async abortActiveAndContinue(){this.showAbortModal=!1;try{await S.abortOta(),await this.fetchQueue()}catch(t){this.error=t instanceof Error?t.message:String(t)}}async abortActiveAndPause(){this.showAbortModal=!1;try{await S.abortOta(),await S.pauseQueue(),await this.fetchQueue()}catch(t){this.error=t instanceof Error?t.message:String(t)}}navigateToDevice(t){window.location.hash=`/device/${encodeURIComponent(t)}`}navigateToJob(t){window.location.hash=`/job/${t.id}?from=${encodeURIComponent("/queue")}`}labelFor(t){return t.device_label||t.parsed_esphome_name||t.esphome_name||t.mac}buildDisplayEntries(){const e=[...this.historyJobs.filter(s=>this.historyFilter==="all"?!0:(s.job_type||this.inferJobType(s))===this.historyFilter)].sort((s,r)=>(s.created_at??0)-(r.created_at??0)),i=[];for(let s=0;s<e.length;s++){const r=e[s],n=e[s+1],o=r.job_type||this.inferJobType(r);if(n&&o==="compile"&&(n.job_type||this.inferJobType(n))==="flash"&&r.mac===n.mac&&n.created_at-r.created_at<=Yg){const a=n.status==="success"&&r.status==="compile_success"?"success":"failed";i.push({type:"combined",compileJob:r,flashJob:n,label:this.labelFor(r),status:a,statusLabel:a==="success"?"Success":"Failed",created_at:n.created_at}),s++}else i.push({type:o,job:r,label:this.labelFor(r),status:r.status,statusLabel:r.status==="success"&&o==="flash"?"OTA Upload Success":r.status.replaceAll("_"," "),created_at:r.created_at})}return i.sort((s,r)=>r.created_at-s.created_at),i}inferJobType(t){return t.status==="compile_success"||t.status==="compile_queued"||t.status==="compiling"?"compile":(pc.has(t.status),"flash")}get statusStyles(){return{success:"background:#dcfce7;color:#15803d;",failed:"background:#fef2f2;color:#dc2626;",aborted:"background:#fef3c7;color:#b45309;",rejoin_timeout:"background:#fef3c7;color:#b45309;",version_mismatch:"background:#fef3c7;color:#b45309;",compile_success:"background:#dcfce7;color:#15803d;"}}render(){var d,f,u;const t=this.queueData,e=!!(t!=null&&t.active_job)&&!pc.has(t.active_job.status),i=(t==null?void 0:t.queued_jobs)??[],s=(t==null?void 0:t.paused)??!1,r=i.length+(e?1:0),n=((d=this.compileData)==null?void 0:d.active_job)??null,o=((f=this.compileData)==null?void 0:f.queued_jobs)??[],a=((u=this.compileData)==null?void 0:u.count)??0,l=this.buildDisplayEntries(),c=l.slice(0,this.historyLimit),h=l.length;return g`
      <div class="queue-page">
        <div class="queue-toolbar">
          <div class="toolbar-actions">
            ${s?g`<button class="btn btn-resume" ?disabled=${this.busyAction==="resume"} @click=${this.resumeQueue}>▶ Resume</button>`:g`<button class="btn btn-pause" ?disabled=${this.busyAction==="pause"} @click=${this.pauseQueue}>⏸ Pause</button>`}
            ${s?g`<span class="pause-badge">PAUSED</span>`:y}
          </div>
        </div>

        ${this.error?g`<p class="error">${this.error}</p>`:y}

        <!-- Compile Queue -->
        <div class="section-card">
          <div class="title-row">
            <h2>Compile Queue</h2>
          </div>
          <div class="section-content">
            ${a===0?g`<p class="empty">No compiles in progress or queued.</p>`:y}

            ${n?this.renderCompileRow(n,!0):y}
            ${o.map(p=>this.renderCompileRow(p,!1))}
          </div>
        </div>

        <!-- OTA Upload Queue -->
        <div class="section-card">
          <div class="title-row">
            <h2>OTA Upload Queue ${r>0?g`<span class="subtitle">${r} job${r!==1?"s":""}</span>`:""}</h2>
          </div>
          <div class="section-content">
            ${r===0&&!e?g`<p class="empty">No firmware flashes in progress or queued.</p>`:y}

            ${e||i.length>0?g`
                  <div class="table">
                    ${e&&t.active_job?this.renderOtaRow(t.active_job,1,i.length+1,!0):y}
                    ${i.map((p,m)=>this.renderOtaRow(p,m+(e?2:1),i.length+(e?1:0),!1))}
                  </div>
                `:y}
          </div>
        </div>

        <!-- Job History -->
        <div class="section-card">
          <div class="title-row">
            <h2>Job History <span class="subtitle">${this.historyJobs.length} total</span></h2>
          </div>
          <div class="section-content">
            <div class="history-tabs">
              <button class="history-tab ${this.historyFilter==="all"?"active":""}" @click=${()=>{this.historyFilter="all",this.historyLimit=10}}>All</button>
              <button class="history-tab ${this.historyFilter==="flash"?"active":""}" @click=${()=>{this.historyFilter="flash",this.historyLimit=10}}>Flash</button>
              <button class="history-tab ${this.historyFilter==="compile"?"active":""}" @click=${()=>{this.historyFilter="compile",this.historyLimit=10}}>Compile</button>
            </div>

            ${h===0?g`<p class="empty">No job history yet.</p>`:g`
                  <div class="table history-table">
                    ${c.map(p=>p.type==="combined"?this.renderCombinedRow(p):this.renderHistoryRow(p))}
                  </div>
                  ${h>this.historyLimit?g`<div class="show-more"><button @click=${()=>{this.historyLimit+=10}}>Show more (${h-this.historyLimit} older entries)</button></div>`:y}
                `}
          </div>
        </div>

        ${this.showAbortModal?this.renderAbortModal():y}
      </div>
    `}renderCompileRow(t,e){const i=this.busyJob===t.id,s=this.labelFor(t);return g`
      <article class="${e?"compile-active-row":"compile-queued-row"}">
        <div class="device-info clickable" @click=${()=>this.navigateToDevice(t.mac)}>
          <strong>${e?"⚙":""} ${s}</strong>
          <small>${e?"Compiling...":"Queued to compile"}</small>
        </div>
        <div class="progress-cell">
          <span class="status-pill ${e?"compiling":"queued"}">${e?"Compiling":"Queued"}</span>
        </div>
        <div class="actions">
          <button class="btn" @click=${()=>this.navigateToJob(t)}>View log</button>
          <button class="btn btn-abort" ?disabled=${i} @click=${()=>this.abortCompileJob(t.id)}>Abort</button>
          <button class="btn btn-icon" disabled title="Move up">▲</button>
          <button class="btn btn-icon" disabled title="Move down">▼</button>
        </div>
      </article>
    `}renderOtaRow(t,e,i,s){const r=this.busyJob===t.id,n=this.labelFor(t);if(s){const o=(t.bridge_state||t.status).replaceAll("_"," "),a=t.percent??0;return g`
        <article class="active-row">
          <div class="device-info clickable" @click=${()=>this.navigateToDevice(t.mac)}>
            <strong>① ${n}</strong>
            <small>${t.firmware_name||"firmware.ota.bin"}</small>
          </div>
          <div class="progress-cell">
            <div class="progress-wrap"><div class="progress-fill" style="width: ${a}%"></div></div>
            <span class="status-pill flashing">${o}</span> <span class="percent">${a}%</span>
          </div>
          <div class="actions">
            <button class="btn" @click=${()=>this.navigateToJob(t)}>View log</button>
            <button class="btn btn-abort" ?disabled=${this.busyAction==="abort-active"} @click=${this.abortActiveJob}>Abort</button>
            <button class="btn btn-icon" disabled title="Move up">▲</button>
            <button class="btn btn-icon" disabled title="Move down">▼</button>
          </div>
        </article>
      `}return g`
      <article class="queued-row">
        <div class="device-info clickable" @click=${()=>this.navigateToDevice(t.mac)}>
          <strong><span class="position-num">${e}.</span> ${n}</strong>
          <small>${t.firmware_name||"firmware.ota.bin"}${t.firmware_size?g` · ${Li(t.firmware_size)}`:y}</small>
        </div>
        <div class="progress-cell">
          <div class="progress-wrap queued"><div class="progress-fill queued" style="width: 0%"></div></div>
          <span class="status-pill queued">Queued</span>
        </div>
        <div class="actions">
          <button class="btn" @click=${()=>this.navigateToJob(t)}>View log</button>
          <button class="btn btn-abort" ?disabled=${r} @click=${()=>this.abortQueuedJob(t.id)}>Abort</button>
          <button class="btn btn-icon" ?disabled=${r||e<=2} @click=${()=>this.moveUp(t.id)}>▲</button>
          <button class="btn btn-icon" ?disabled=${r||e>=i} @click=${()=>this.moveDown(t.id)}>▼</button>
        </div>
      </article>
    `}renderHistoryRow(t){const e=t.job,i=this.statusStyles[t.status]||"",s=e.completed_at&&e.started_at?pt(e.completed_at-e.started_at):"";return g`
      <div class="history-row">
        <span class="type-badge type-${t.type}">${t.type.toUpperCase()}</span>
        <span class="device-label clickable" @click=${()=>this.navigateToDevice(e.mac)}>${t.label}</span>
        <span class="device-meta">${e.parsed_version?`v${e.parsed_version}`:e.firmware_name||""}</span>
        <span class="status-pill history-status" style=${i}>${t.statusLabel}</span>
        <span class="timestamp" title=${ms(e.created_at)}>${mn(e.created_at)}</span>
        <span class="duration">${s}</span>
        <button class="btn btn-sm" @click=${()=>this.navigateToJob(e)}>View log</button>
      </div>
    `}renderCombinedRow(t){const e=t.compileJob,i=t.flashJob,s=e.completed_at&&e.started_at?pt(e.completed_at-e.started_at):"",r=i.completed_at&&i.started_at?pt(i.completed_at-i.started_at):"",n=this.statusStyles[t.status]||"";return g`
      <div class="history-row combined-row" style="border-left: 3px solid ${t.status==="success"?"#15803d":"#dc2626"}">
        <span class="type-badge type-combined">
          <span class="c-compile">COMPILE</span><span class="c-flash">FLASH</span>
        </span>
        <span class="device-label clickable" @click=${()=>this.navigateToDevice(e.mac)}>${t.label}</span>
        <span class="device-meta">${e.parsed_version?`v${e.parsed_version}`:""} → OTA upload · ${s} + ${r}</span>
        <span class="status-pill history-status" style=${n}>${t.statusLabel}</span>
        <span class="timestamp" title=${ms(i.created_at)}>${mn(i.created_at)}</span>
        <span class="duration">${r}</span>
        <button class="btn btn-sm" @click=${()=>this.navigateToJob(i)}>View log</button>
      </div>
    `}renderAbortModal(){return g`
      <div class="modal-backdrop" @click=${()=>{this.showAbortModal=!1}}>
        <div class="modal" @click=${t=>t.stopPropagation()}>
          <h3>Other queued jobs waiting</h3>
          <p>Continue running the next queued job after aborting this one?</p>
          <div class="modal-actions">
            <button class="btn continue" @click=${this.abortActiveAndContinue}>Yes, continue queue</button>
            <button class="btn btn-abort" @click=${this.abortActiveAndPause}>No, pause queue</button>
            <button class="btn" @click=${()=>{this.showAbortModal=!1}}>Cancel</button>
          </div>
        </div>
      </div>
    `}};lt.styles=we`
    .section-card {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 12px;
      box-shadow: var(--shadow);
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--line);
      margin-bottom: 12px;
    }

    .title-row h2 {
      font-size: 15px;
      font-weight: 600;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .title-row .subtitle {
      color: var(--muted);
      font-size: 12px;
      font-weight: 400;
    }

    .section-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .pause-badge {
      background: var(--accent);
      color: #fff;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      border-radius: 20px;
    }

    .table {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    article {
      position: relative;
      display: grid;
      grid-template-columns: 1fr 180px auto;
      gap: 12px;
      align-items: center;
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 14px 18px;
      background: var(--surface);
      overflow: hidden;
    }

    article::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
    }

    .active-row::before {
      background: var(--primary);
    }

    .compile-active-row::before {
      background: #7c3aed;
    }

    .queued-row::before {
      background: var(--accent);
    }

    .compile-queued-row::before {
      background: var(--muted);
    }

    .position-num {
      color: var(--muted);
      font-weight: 500;
    }

    .status-pill {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .status-pill.flashing {
      background: #e0f2fe;
      color: #0369a1;
    }

    .status-pill.compiling {
      background: #ede9fe;
      color: #6d28d9;
    }

    .status-pill.queued {
      background: #fef3c7;
      color: #b45309;
    }

    .status-pill.history-status {
      font-size: 10px;
      padding: 2px 8px;
    }

    .device-info strong {
      display: block;
      overflow-wrap: anywhere;
      font-size: 14px;
      font-weight: 600;
    }

    .device-info.clickable {
      cursor: pointer;
    }

    .device-info.clickable:hover strong {
      text-decoration: underline;
    }

    .device-info small {
      color: var(--muted);
      font-size: 12px;
    }

    .percent {
      font-size: 11px;
      color: var(--muted);
    }

    .progress-cell {
      display: grid;
      gap: 4px;
    }

    .progress-wrap {
      width: 100%;
      height: 8px;
      background: var(--line);
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-wrap.queued {
      background: #fef3c7;
    }

    .progress-fill {
      height: 100%;
      background: var(--primary);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .progress-fill.queued {
      background: var(--accent);
    }

    .actions {
      display: flex;
      gap: 5px;
      align-items: center;
      justify-content: flex-end;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 3px;
      font-family: inherit;
      font-size: 11px;
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid var(--line);
      background: var(--surface);
      color: var(--ink);
      cursor: pointer;
      transition: all 0.12s;
      min-height: 26px;
      min-width: 26px;
      line-height: 1;
      white-space: nowrap;
    }

    .btn:hover {
      background: var(--primary);
      color: #fff;
      border-color: var(--primary);
    }

    .btn-icon {
      min-width: 26px;
      padding: 4px;
    }

    .btn-pause {
      background: var(--accent);
      color: #fff;
      border-color: var(--accent);
    }

    .btn-pause:hover {
      background: #e68a00;
    }

    .btn-resume {
      background: var(--primary);
      color: #fff;
      border-color: var(--primary);
    }

    .btn-resume:hover {
      background: #0d4d5e;
    }

    .btn-abort {
      background: var(--danger);
      color: #fff;
      border-color: var(--danger);
    }

    .btn-abort:hover {
      background: #dc2626;
    }

    .btn.continue {
      background: var(--primary);
      color: #fff;
      border-color: var(--primary);
    }

    button:disabled,
    .btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }

    button:disabled:hover,
    .btn:disabled:hover {
      background: var(--surface);
      color: var(--ink);
      border-color: var(--line);
    }

    .empty,
    .error {
      margin: 0;
      color: var(--muted);
      font-size: 13px;
    }

    .error {
      color: var(--danger);
      font-weight: 500;
      padding: 12px;
      border: 1px solid var(--danger);
      background: #fef2f2;
      border-radius: 8px;
    }

    @media (max-width: 720px) {
      article {
        grid-template-columns: 1fr;
        align-items: stretch;
      }
      .actions {
        justify-content: flex-start;
      }
    }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 20px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .modal h3 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .modal p {
      margin: 0 0 16px 0;
      font-size: 14px;
      color: var(--muted);
    }

    .modal-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .queue-page {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .queue-toolbar {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 8px;
      padding: 12px 0;
    }

    .history-tabs {
      display: flex;
      gap: 4px;
      margin-top: 12px;
      margin-bottom: 12px;
    }

    .history-tab {
      font-size: 12px;
      font-weight: 500;
      padding: 4px 14px;
      border-radius: 20px;
      border: 1px solid var(--line);
      background: var(--surface);
      color: var(--muted);
      cursor: pointer;
      font-family: inherit;
      transition: all 0.12s;
    }

    .history-tab.active {
      background: var(--ink);
      color: var(--surface);
      border-color: var(--ink);
    }

    .history-tab:hover:not(.active) {
      background: var(--line);
    }

    .history-table {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .history-row {
      display: grid;
      grid-template-columns: auto 1fr auto auto auto auto auto;
      gap: 8px;
      align-items: center;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--surface);
      padding: 6px 10px;
      font-size: 13px;
    }

    .history-row.combined-row {
      background: #fafcff;
    }

    .type-badge {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 4px;
      letter-spacing: 0.03em;
      min-width: 48px;
      text-align: center;
    }

    .type-flash {
      background: #e0f2fe;
      color: #0369a1;
    }

    .type-compile {
      background: #ede9fe;
      color: #6d28d9;
    }

    .type-combined {
      display: flex;
      align-items: center;
      padding: 0;
      overflow: hidden;
      border-radius: 4px;
    }

    .type-combined span {
      padding: 2px 4px;
      font-size: 9px;
      font-weight: 700;
      white-space: nowrap;
    }

    .type-combined .c-compile {
      background: #ede9fe;
      color: #6d28d9;
    }

    .type-combined .c-flash {
      background: #e0f2fe;
      color: #0369a1;
    }

    .device-label {
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .device-label.clickable {
      cursor: pointer;
    }

    .device-label.clickable:hover {
      text-decoration: underline;
    }

    .device-meta {
      color: var(--muted);
      font-size: 11px;
      white-space: nowrap;
    }

    .timestamp {
      color: var(--muted);
      font-size: 12px;
      white-space: nowrap;
    }

    .duration {
      color: var(--muted);
      font-size: 12px;
      white-space: nowrap;
    }

    .show-more {
      text-align: center;
      margin-top: 8px;
    }

    .show-more button {
      background: none;
      border: 1px solid var(--line);
      border-radius: 20px;
      padding: 6px 20px;
      font-size: 12px;
      font-weight: 500;
      color: var(--muted);
      cursor: pointer;
      font-family: inherit;
    }

    .show-more button:hover {
      background: var(--line);
    }
  `;It([v()],lt.prototype,"queueData",2);It([v()],lt.prototype,"compileData",2);It([v()],lt.prototype,"historyJobs",2);It([v()],lt.prototype,"error",2);It([v()],lt.prototype,"busyJob",2);It([v()],lt.prototype,"busyAction",2);It([v()],lt.prototype,"showAbortModal",2);It([v()],lt.prototype,"historyFilter",2);It([v()],lt.prototype,"historyLimit",2);lt=It([ke("esp-queue-page")],lt);let ra=[],Md=[];(()=>{let t="lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o".split(",").map(e=>e?parseInt(e,36):1);for(let e=0,i=0;e<t.length;e++)(e%2?Md:ra).push(i=i+t[e])})();function Gg(t){if(t<768)return!1;for(let e=0,i=ra.length;;){let s=e+i>>1;if(t<ra[s])i=s;else if(t>=Md[s])e=s+1;else return!0;if(e==i)return!1}}function gc(t){return t>=127462&&t<=127487}const mc=8205;function Zg(t,e,i=!0,s=!0){return(i?Ed:em)(t,e,s)}function Ed(t,e,i){if(e==t.length)return e;e&&Dd(t.charCodeAt(e))&&_d(t.charCodeAt(e-1))&&e--;let s=ko(t,e);for(e+=bc(s);e<t.length;){let r=ko(t,e);if(s==mc||r==mc||i&&Gg(r))e+=bc(r),s=r;else if(gc(r)){let n=0,o=e-2;for(;o>=0&&gc(ko(t,o));)n++,o-=2;if(n%2==0)break;e+=2}else break}return e}function em(t,e,i){for(;e>0;){let s=Ed(t,e-2,i);if(s<e)return s;e--}return 0}function ko(t,e){let i=t.charCodeAt(e);if(!_d(i)||e+1==t.length)return i;let s=t.charCodeAt(e+1);return Dd(s)?(i-55296<<10)+(s-56320)+65536:i}function Dd(t){return t>=56320&&t<57344}function _d(t){return t>=55296&&t<56320}function bc(t){return t<65536?1:2}class X{lineAt(e){if(e<0||e>this.length)throw new RangeError(`Invalid position ${e} in document of length ${this.length}`);return this.lineInner(e,!1,1,0)}line(e){if(e<1||e>this.lines)throw new RangeError(`Invalid line number ${e} in ${this.lines}-line document`);return this.lineInner(e,!0,1,0)}replace(e,i,s){[e,i]=bs(this,e,i);let r=[];return this.decompose(0,e,r,2),s.length&&s.decompose(0,s.length,r,3),this.decompose(i,this.length,r,1),At.from(r,this.length-(i-e)+s.length)}append(e){return this.replace(this.length,this.length,e)}slice(e,i=this.length){[e,i]=bs(this,e,i);let s=[];return this.decompose(e,i,s,0),At.from(s,i-e)}eq(e){if(e==this)return!0;if(e.length!=this.length||e.lines!=this.lines)return!1;let i=this.scanIdentical(e,1),s=this.length-this.scanIdentical(e,-1),r=new qs(this),n=new qs(e);for(let o=i,a=i;;){if(r.next(o),n.next(o),o=0,r.lineBreak!=n.lineBreak||r.done!=n.done||r.value!=n.value)return!1;if(a+=r.value.length,r.done||a>=s)return!0}}iter(e=1){return new qs(this,e)}iterRange(e,i=this.length){return new Bd(this,e,i)}iterLines(e,i){let s;if(e==null)s=this.iter();else{i==null&&(i=this.lines+1);let r=this.line(e).from;s=this.iterRange(r,Math.max(r,i==this.lines+1?this.length:i<=1?0:this.line(i-1).to))}return new Rd(s)}toString(){return this.sliceString(0)}toJSON(){let e=[];return this.flatten(e),e}constructor(){}static of(e){if(e.length==0)throw new RangeError("A document must have at least one line");return e.length==1&&!e[0]?X.empty:e.length<=32?new pe(e):At.from(pe.split(e,[]))}}class pe extends X{constructor(e,i=tm(e)){super(),this.text=e,this.length=i}get lines(){return this.text.length}get children(){return null}lineInner(e,i,s,r){for(let n=0;;n++){let o=this.text[n],a=r+o.length;if((i?s:a)>=e)return new im(r,a,s,o);r=a+1,s++}}decompose(e,i,s,r){let n=e<=0&&i>=this.length?this:new pe(vc(this.text,e,i),Math.min(i,this.length)-Math.max(0,e));if(r&1){let o=s.pop(),a=rn(n.text,o.text.slice(),0,n.length);if(a.length<=32)s.push(new pe(a,o.length+n.length));else{let l=a.length>>1;s.push(new pe(a.slice(0,l)),new pe(a.slice(l)))}}else s.push(n)}replace(e,i,s){if(!(s instanceof pe))return super.replace(e,i,s);[e,i]=bs(this,e,i);let r=rn(this.text,rn(s.text,vc(this.text,0,e)),i),n=this.length+s.length-(i-e);return r.length<=32?new pe(r,n):At.from(pe.split(r,[]),n)}sliceString(e,i=this.length,s=`
`){[e,i]=bs(this,e,i);let r="";for(let n=0,o=0;n<=i&&o<this.text.length;o++){let a=this.text[o],l=n+a.length;n>e&&o&&(r+=s),e<l&&i>n&&(r+=a.slice(Math.max(0,e-n),i-n)),n=l+1}return r}flatten(e){for(let i of this.text)e.push(i)}scanIdentical(){return 0}static split(e,i){let s=[],r=-1;for(let n of e)s.push(n),r+=n.length+1,s.length==32&&(i.push(new pe(s,r)),s=[],r=-1);return r>-1&&i.push(new pe(s,r)),i}}class At extends X{constructor(e,i){super(),this.children=e,this.length=i,this.lines=0;for(let s of e)this.lines+=s.lines}lineInner(e,i,s,r){for(let n=0;;n++){let o=this.children[n],a=r+o.length,l=s+o.lines-1;if((i?l:a)>=e)return o.lineInner(e,i,s,r);r=a+1,s=l+1}}decompose(e,i,s,r){for(let n=0,o=0;o<=i&&n<this.children.length;n++){let a=this.children[n],l=o+a.length;if(e<=l&&i>=o){let c=r&((o<=e?1:0)|(l>=i?2:0));o>=e&&l<=i&&!c?s.push(a):a.decompose(e-o,i-o,s,c)}o=l+1}}replace(e,i,s){if([e,i]=bs(this,e,i),s.lines<this.lines)for(let r=0,n=0;r<this.children.length;r++){let o=this.children[r],a=n+o.length;if(e>=n&&i<=a){let l=o.replace(e-n,i-n,s),c=this.lines-o.lines+l.lines;if(l.lines<c>>4&&l.lines>c>>6){let h=this.children.slice();return h[r]=l,new At(h,this.length-(i-e)+s.length)}return super.replace(n,a,l)}n=a+1}return super.replace(e,i,s)}sliceString(e,i=this.length,s=`
`){[e,i]=bs(this,e,i);let r="";for(let n=0,o=0;n<this.children.length&&o<=i;n++){let a=this.children[n],l=o+a.length;o>e&&n&&(r+=s),e<l&&i>o&&(r+=a.sliceString(e-o,i-o,s)),o=l+1}return r}flatten(e){for(let i of this.children)i.flatten(e)}scanIdentical(e,i){if(!(e instanceof At))return 0;let s=0,[r,n,o,a]=i>0?[0,0,this.children.length,e.children.length]:[this.children.length-1,e.children.length-1,-1,-1];for(;;r+=i,n+=i){if(r==o||n==a)return s;let l=this.children[r],c=e.children[n];if(l!=c)return s+l.scanIdentical(c,i);s+=l.length+1}}static from(e,i=e.reduce((s,r)=>s+r.length+1,-1)){let s=0;for(let u of e)s+=u.lines;if(s<32){let u=[];for(let p of e)p.flatten(u);return new pe(u,i)}let r=Math.max(32,s>>5),n=r<<1,o=r>>1,a=[],l=0,c=-1,h=[];function d(u){let p;if(u.lines>n&&u instanceof At)for(let m of u.children)d(m);else u.lines>o&&(l>o||!l)?(f(),a.push(u)):u instanceof pe&&l&&(p=h[h.length-1])instanceof pe&&u.lines+p.lines<=32?(l+=u.lines,c+=u.length+1,h[h.length-1]=new pe(p.text.concat(u.text),p.length+1+u.length)):(l+u.lines>r&&f(),l+=u.lines,c+=u.length+1,h.push(u))}function f(){l!=0&&(a.push(h.length==1?h[0]:At.from(h,c)),c=-1,l=h.length=0)}for(let u of e)d(u);return f(),a.length==1?a[0]:new At(a,i)}}X.empty=new pe([""],0);function tm(t){let e=-1;for(let i of t)e+=i.length+1;return e}function rn(t,e,i=0,s=1e9){for(let r=0,n=0,o=!0;n<t.length&&r<=s;n++){let a=t[n],l=r+a.length;l>=i&&(l>s&&(a=a.slice(0,s-r)),r<i&&(a=a.slice(i-r)),o?(e[e.length-1]+=a,o=!1):e.push(a)),r=l+1}return e}function vc(t,e,i){return rn(t,[""],e,i)}class qs{constructor(e,i=1){this.dir=i,this.done=!1,this.lineBreak=!1,this.value="",this.nodes=[e],this.offsets=[i>0?1:(e instanceof pe?e.text.length:e.children.length)<<1]}nextInner(e,i){for(this.done=this.lineBreak=!1;;){let s=this.nodes.length-1,r=this.nodes[s],n=this.offsets[s],o=n>>1,a=r instanceof pe?r.text.length:r.children.length;if(o==(i>0?a:0)){if(s==0)return this.done=!0,this.value="",this;i>0&&this.offsets[s-1]++,this.nodes.pop(),this.offsets.pop()}else if((n&1)==(i>0?0:1)){if(this.offsets[s]+=i,e==0)return this.lineBreak=!0,this.value=`
`,this;e--}else if(r instanceof pe){let l=r.text[o+(i<0?-1:0)];if(this.offsets[s]+=i,l.length>Math.max(0,e))return this.value=e==0?l:i>0?l.slice(e):l.slice(0,l.length-e),this;e-=l.length}else{let l=r.children[o+(i<0?-1:0)];e>l.length?(e-=l.length,this.offsets[s]+=i):(i<0&&this.offsets[s]--,this.nodes.push(l),this.offsets.push(i>0?1:(l instanceof pe?l.text.length:l.children.length)<<1))}}}next(e=0){return e<0&&(this.nextInner(-e,-this.dir),e=this.value.length),this.nextInner(e,this.dir)}}class Bd{constructor(e,i,s){this.value="",this.done=!1,this.cursor=new qs(e,i>s?-1:1),this.pos=i>s?e.length:0,this.from=Math.min(i,s),this.to=Math.max(i,s)}nextInner(e,i){if(i<0?this.pos<=this.from:this.pos>=this.to)return this.value="",this.done=!0,this;e+=Math.max(0,i<0?this.pos-this.to:this.from-this.pos);let s=i<0?this.pos-this.from:this.to-this.pos;e>s&&(e=s),s-=e;let{value:r}=this.cursor.next(e);return this.pos+=(r.length+e)*i,this.value=r.length<=s?r:i<0?r.slice(r.length-s):r.slice(0,s),this.done=!this.value,this}next(e=0){return e<0?e=Math.max(e,this.from-this.pos):e>0&&(e=Math.min(e,this.to-this.pos)),this.nextInner(e,this.cursor.dir)}get lineBreak(){return this.cursor.lineBreak&&this.value!=""}}class Rd{constructor(e){this.inner=e,this.afterBreak=!0,this.value="",this.done=!1}next(e=0){let{done:i,lineBreak:s,value:r}=this.inner.next(e);return i&&this.afterBreak?(this.value="",this.afterBreak=!1):i?(this.done=!0,this.value=""):s?this.afterBreak?this.value="":(this.afterBreak=!0,this.next()):(this.value=r,this.afterBreak=!1),this}get lineBreak(){return!1}}typeof Symbol<"u"&&(X.prototype[Symbol.iterator]=function(){return this.iter()},qs.prototype[Symbol.iterator]=Bd.prototype[Symbol.iterator]=Rd.prototype[Symbol.iterator]=function(){return this});class im{constructor(e,i,s,r){this.from=e,this.to=i,this.number=s,this.text=r}get length(){return this.to-this.from}}function bs(t,e,i){return e=Math.max(0,Math.min(t.length,e)),[e,Math.max(e,Math.min(t.length,i))]}function Ce(t,e,i=!0,s=!0){return Zg(t,e,i,s)}function sm(t){return t>=56320&&t<57344}function rm(t){return t>=55296&&t<56320}function ze(t,e){let i=t.charCodeAt(e);if(!rm(i)||e+1==t.length)return i;let s=t.charCodeAt(e+1);return sm(s)?(i-55296<<10)+(s-56320)+65536:i}function hl(t){return t<=65535?String.fromCharCode(t):(t-=65536,String.fromCharCode((t>>10)+55296,(t&1023)+56320))}function $t(t){return t<65536?1:2}const na=/\r\n?|\n/;var Ie=(function(t){return t[t.Simple=0]="Simple",t[t.TrackDel=1]="TrackDel",t[t.TrackBefore=2]="TrackBefore",t[t.TrackAfter=3]="TrackAfter",t})(Ie||(Ie={}));class Dt{constructor(e){this.sections=e}get length(){let e=0;for(let i=0;i<this.sections.length;i+=2)e+=this.sections[i];return e}get newLength(){let e=0;for(let i=0;i<this.sections.length;i+=2){let s=this.sections[i+1];e+=s<0?this.sections[i]:s}return e}get empty(){return this.sections.length==0||this.sections.length==2&&this.sections[1]<0}iterGaps(e){for(let i=0,s=0,r=0;i<this.sections.length;){let n=this.sections[i++],o=this.sections[i++];o<0?(e(s,r,n),r+=n):r+=o,s+=n}}iterChangedRanges(e,i=!1){oa(this,e,i)}get invertedDesc(){let e=[];for(let i=0;i<this.sections.length;){let s=this.sections[i++],r=this.sections[i++];r<0?e.push(s,r):e.push(r,s)}return new Dt(e)}composeDesc(e){return this.empty?e:e.empty?this:Ld(this,e)}mapDesc(e,i=!1){return e.empty?this:aa(this,e,i)}mapPos(e,i=-1,s=Ie.Simple){let r=0,n=0;for(let o=0;o<this.sections.length;){let a=this.sections[o++],l=this.sections[o++],c=r+a;if(l<0){if(c>e)return n+(e-r);n+=a}else{if(s!=Ie.Simple&&c>=e&&(s==Ie.TrackDel&&r<e&&c>e||s==Ie.TrackBefore&&r<e||s==Ie.TrackAfter&&c>e))return null;if(c>e||c==e&&i<0&&!a)return e==r||i<0?n:n+l;n+=l}r=c}if(e>r)throw new RangeError(`Position ${e} is out of range for changeset of length ${r}`);return n}touchesRange(e,i=e){for(let s=0,r=0;s<this.sections.length&&r<=i;){let n=this.sections[s++],o=this.sections[s++],a=r+n;if(o>=0&&r<=i&&a>=e)return r<e&&a>i?"cover":!0;r=a}return!1}toString(){let e="";for(let i=0;i<this.sections.length;){let s=this.sections[i++],r=this.sections[i++];e+=(e?" ":"")+s+(r>=0?":"+r:"")}return e}toJSON(){return this.sections}static fromJSON(e){if(!Array.isArray(e)||e.length%2||e.some(i=>typeof i!="number"))throw new RangeError("Invalid JSON representation of ChangeDesc");return new Dt(e)}static create(e){return new Dt(e)}}class ve extends Dt{constructor(e,i){super(e),this.inserted=i}apply(e){if(this.length!=e.length)throw new RangeError("Applying change set to a document with the wrong length");return oa(this,(i,s,r,n,o)=>e=e.replace(r,r+(s-i),o),!1),e}mapDesc(e,i=!1){return aa(this,e,i,!0)}invert(e){let i=this.sections.slice(),s=[];for(let r=0,n=0;r<i.length;r+=2){let o=i[r],a=i[r+1];if(a>=0){i[r]=a,i[r+1]=o;let l=r>>1;for(;s.length<l;)s.push(X.empty);s.push(o?e.slice(n,n+o):X.empty)}n+=o}return new ve(i,s)}compose(e){return this.empty?e:e.empty?this:Ld(this,e,!0)}map(e,i=!1){return e.empty?this:aa(this,e,i,!0)}iterChanges(e,i=!1){oa(this,e,i)}get desc(){return Dt.create(this.sections)}filter(e){let i=[],s=[],r=[],n=new sr(this);e:for(let o=0,a=0;;){let l=o==e.length?1e9:e[o++];for(;a<l||a==l&&n.len==0;){if(n.done)break e;let h=Math.min(n.len,l-a);Me(r,h,-1);let d=n.ins==-1?-1:n.off==0?n.ins:0;Me(i,h,d),d>0&&si(s,i,n.text),n.forward(h),a+=h}let c=e[o++];for(;a<c;){if(n.done)break e;let h=Math.min(n.len,c-a);Me(i,h,-1),Me(r,h,n.ins==-1?-1:n.off==0?n.ins:0),n.forward(h),a+=h}}return{changes:new ve(i,s),filtered:Dt.create(r)}}toJSON(){let e=[];for(let i=0;i<this.sections.length;i+=2){let s=this.sections[i],r=this.sections[i+1];r<0?e.push(s):r==0?e.push([s]):e.push([s].concat(this.inserted[i>>1].toJSON()))}return e}static of(e,i,s){let r=[],n=[],o=0,a=null;function l(h=!1){if(!h&&!r.length)return;o<i&&Me(r,i-o,-1);let d=new ve(r,n);a=a?a.compose(d.map(a)):d,r=[],n=[],o=0}function c(h){if(Array.isArray(h))for(let d of h)c(d);else if(h instanceof ve){if(h.length!=i)throw new RangeError(`Mismatched change set length (got ${h.length}, expected ${i})`);l(),a=a?a.compose(h.map(a)):h}else{let{from:d,to:f=d,insert:u}=h;if(d>f||d<0||f>i)throw new RangeError(`Invalid change range ${d} to ${f} (in doc of length ${i})`);let p=u?typeof u=="string"?X.of(u.split(s||na)):u:X.empty,m=p.length;if(d==f&&m==0)return;d<o&&l(),d>o&&Me(r,d-o,-1),Me(r,f-d,m),si(n,r,p),o=f}}return c(e),l(!a),a}static empty(e){return new ve(e?[e,-1]:[],[])}static fromJSON(e){if(!Array.isArray(e))throw new RangeError("Invalid JSON representation of ChangeSet");let i=[],s=[];for(let r=0;r<e.length;r++){let n=e[r];if(typeof n=="number")i.push(n,-1);else{if(!Array.isArray(n)||typeof n[0]!="number"||n.some((o,a)=>a&&typeof o!="string"))throw new RangeError("Invalid JSON representation of ChangeSet");if(n.length==1)i.push(n[0],0);else{for(;s.length<r;)s.push(X.empty);s[r]=X.of(n.slice(1)),i.push(n[0],s[r].length)}}}return new ve(i,s)}static createSet(e,i){return new ve(e,i)}}function Me(t,e,i,s=!1){if(e==0&&i<=0)return;let r=t.length-2;r>=0&&i<=0&&i==t[r+1]?t[r]+=e:r>=0&&e==0&&t[r]==0?t[r+1]+=i:s?(t[r]+=e,t[r+1]+=i):t.push(e,i)}function si(t,e,i){if(i.length==0)return;let s=e.length-2>>1;if(s<t.length)t[t.length-1]=t[t.length-1].append(i);else{for(;t.length<s;)t.push(X.empty);t.push(i)}}function oa(t,e,i){let s=t.inserted;for(let r=0,n=0,o=0;o<t.sections.length;){let a=t.sections[o++],l=t.sections[o++];if(l<0)r+=a,n+=a;else{let c=r,h=n,d=X.empty;for(;c+=a,h+=l,l&&s&&(d=d.append(s[o-2>>1])),!(i||o==t.sections.length||t.sections[o+1]<0);)a=t.sections[o++],l=t.sections[o++];e(r,c,n,h,d),r=c,n=h}}}function aa(t,e,i,s=!1){let r=[],n=s?[]:null,o=new sr(t),a=new sr(e);for(let l=-1;;){if(o.done&&a.len||a.done&&o.len)throw new Error("Mismatched change set lengths");if(o.ins==-1&&a.ins==-1){let c=Math.min(o.len,a.len);Me(r,c,-1),o.forward(c),a.forward(c)}else if(a.ins>=0&&(o.ins<0||l==o.i||o.off==0&&(a.len<o.len||a.len==o.len&&!i))){let c=a.len;for(Me(r,a.ins,-1);c;){let h=Math.min(o.len,c);o.ins>=0&&l<o.i&&o.len<=h&&(Me(r,0,o.ins),n&&si(n,r,o.text),l=o.i),o.forward(h),c-=h}a.next()}else if(o.ins>=0){let c=0,h=o.len;for(;h;)if(a.ins==-1){let d=Math.min(h,a.len);c+=d,h-=d,a.forward(d)}else if(a.ins==0&&a.len<h)h-=a.len,a.next();else break;Me(r,c,l<o.i?o.ins:0),n&&l<o.i&&si(n,r,o.text),l=o.i,o.forward(o.len-h)}else{if(o.done&&a.done)return n?ve.createSet(r,n):Dt.create(r);throw new Error("Mismatched change set lengths")}}}function Ld(t,e,i=!1){let s=[],r=i?[]:null,n=new sr(t),o=new sr(e);for(let a=!1;;){if(n.done&&o.done)return r?ve.createSet(s,r):Dt.create(s);if(n.ins==0)Me(s,n.len,0,a),n.next();else if(o.len==0&&!o.done)Me(s,0,o.ins,a),r&&si(r,s,o.text),o.next();else{if(n.done||o.done)throw new Error("Mismatched change set lengths");{let l=Math.min(n.len2,o.len),c=s.length;if(n.ins==-1){let h=o.ins==-1?-1:o.off?0:o.ins;Me(s,l,h,a),r&&h&&si(r,s,o.text)}else o.ins==-1?(Me(s,n.off?0:n.len,l,a),r&&si(r,s,n.textBit(l))):(Me(s,n.off?0:n.len,o.off?0:o.ins,a),r&&!o.off&&si(r,s,o.text));a=(n.ins>l||o.ins>=0&&o.len>l)&&(a||s.length>c),n.forward2(l),o.forward(l)}}}}class sr{constructor(e){this.set=e,this.i=0,this.next()}next(){let{sections:e}=this.set;this.i<e.length?(this.len=e[this.i++],this.ins=e[this.i++]):(this.len=0,this.ins=-2),this.off=0}get done(){return this.ins==-2}get len2(){return this.ins<0?this.len:this.ins}get text(){let{inserted:e}=this.set,i=this.i-2>>1;return i>=e.length?X.empty:e[i]}textBit(e){let{inserted:i}=this.set,s=this.i-2>>1;return s>=i.length&&!e?X.empty:i[s].slice(this.off,e==null?void 0:this.off+e)}forward(e){e==this.len?this.next():(this.len-=e,this.off+=e)}forward2(e){this.ins==-1?this.forward(e):e==this.ins?this.next():(this.ins-=e,this.off+=e)}}class Ei{constructor(e,i,s){this.from=e,this.to=i,this.flags=s}get anchor(){return this.flags&32?this.to:this.from}get head(){return this.flags&32?this.from:this.to}get empty(){return this.from==this.to}get assoc(){return this.flags&8?-1:this.flags&16?1:0}get bidiLevel(){let e=this.flags&7;return e==7?null:e}get goalColumn(){let e=this.flags>>6;return e==16777215?void 0:e}map(e,i=-1){let s,r;return this.empty?s=r=e.mapPos(this.from,i):(s=e.mapPos(this.from,1),r=e.mapPos(this.to,-1)),s==this.from&&r==this.to?this:new Ei(s,r,this.flags)}extend(e,i=e,s=0){if(e<=this.anchor&&i>=this.anchor)return C.range(e,i,void 0,void 0,s);let r=Math.abs(e-this.anchor)>Math.abs(i-this.anchor)?e:i;return C.range(this.anchor,r,void 0,void 0,s)}eq(e,i=!1){return this.anchor==e.anchor&&this.head==e.head&&this.goalColumn==e.goalColumn&&(!i||!this.empty||this.assoc==e.assoc)}toJSON(){return{anchor:this.anchor,head:this.head}}static fromJSON(e){if(!e||typeof e.anchor!="number"||typeof e.head!="number")throw new RangeError("Invalid JSON representation for SelectionRange");return C.range(e.anchor,e.head)}static create(e,i,s){return new Ei(e,i,s)}}class C{constructor(e,i){this.ranges=e,this.mainIndex=i}map(e,i=-1){return e.empty?this:C.create(this.ranges.map(s=>s.map(e,i)),this.mainIndex)}eq(e,i=!1){if(this.ranges.length!=e.ranges.length||this.mainIndex!=e.mainIndex)return!1;for(let s=0;s<this.ranges.length;s++)if(!this.ranges[s].eq(e.ranges[s],i))return!1;return!0}get main(){return this.ranges[this.mainIndex]}asSingle(){return this.ranges.length==1?this:new C([this.main],0)}addRange(e,i=!0){return C.create([e].concat(this.ranges),i?0:this.mainIndex+1)}replaceRange(e,i=this.mainIndex){let s=this.ranges.slice();return s[i]=e,C.create(s,this.mainIndex)}toJSON(){return{ranges:this.ranges.map(e=>e.toJSON()),main:this.mainIndex}}static fromJSON(e){if(!e||!Array.isArray(e.ranges)||typeof e.main!="number"||e.main>=e.ranges.length)throw new RangeError("Invalid JSON representation for EditorSelection");return new C(e.ranges.map(i=>Ei.fromJSON(i)),e.main)}static single(e,i=e){return new C([C.range(e,i)],0)}static create(e,i=0){if(e.length==0)throw new RangeError("A selection needs at least one range");for(let s=0,r=0;r<e.length;r++){let n=e[r];if(n.empty?n.from<=s:n.from<s)return C.normalized(e.slice(),i);s=n.to}return new C(e,i)}static cursor(e,i=0,s,r){return Ei.create(e,e,(i==0?0:i<0?8:16)|(s==null?7:Math.min(6,s))|(r??16777215)<<6)}static range(e,i,s,r,n){let o=(s??16777215)<<6|(r==null?7:Math.min(6,r));return!n&&e!=i&&(n=i<e?1:-1),i<e?Ei.create(i,e,48|o):Ei.create(e,i,(n?n<0?8:16:0)|o)}static normalized(e,i=0){let s=e[i];e.sort((r,n)=>r.from-n.from),i=e.indexOf(s);for(let r=1;r<e.length;r++){let n=e[r],o=e[r-1];if(n.empty?n.from<=o.to:n.from<o.to){let a=o.from,l=Math.max(n.to,o.to);r<=i&&i--,e.splice(--r,2,n.anchor>n.head?C.range(l,a):C.range(a,l))}}return new C(e,i)}}function Id(t,e){for(let i of t.ranges)if(i.to>e)throw new RangeError("Selection points outside of document")}let dl=0;class _{constructor(e,i,s,r,n){this.combine=e,this.compareInput=i,this.compare=s,this.isStatic=r,this.id=dl++,this.default=e([]),this.extensions=typeof n=="function"?n(this):n}get reader(){return this}static define(e={}){return new _(e.combine||(i=>i),e.compareInput||((i,s)=>i===s),e.compare||(e.combine?(i,s)=>i===s:fl),!!e.static,e.enables)}of(e){return new nn([],this,0,e)}compute(e,i){if(this.isStatic)throw new Error("Can't compute a static facet");return new nn(e,this,1,i)}computeN(e,i){if(this.isStatic)throw new Error("Can't compute a static facet");return new nn(e,this,2,i)}from(e,i){return i||(i=s=>s),this.compute([e],s=>i(s.field(e)))}}function fl(t,e){return t==e||t.length==e.length&&t.every((i,s)=>i===e[s])}class nn{constructor(e,i,s,r){this.dependencies=e,this.facet=i,this.type=s,this.value=r,this.id=dl++}dynamicSlot(e){var i;let s=this.value,r=this.facet.compareInput,n=this.id,o=e[n]>>1,a=this.type==2,l=!1,c=!1,h=[];for(let d of this.dependencies)d=="doc"?l=!0:d=="selection"?c=!0:(((i=e[d.id])!==null&&i!==void 0?i:1)&1)==0&&h.push(e[d.id]);return{create(d){return d.values[o]=s(d),1},update(d,f){if(l&&f.docChanged||c&&(f.docChanged||f.selection)||la(d,h)){let u=s(d);if(a?!yc(u,d.values[o],r):!r(u,d.values[o]))return d.values[o]=u,1}return 0},reconfigure:(d,f)=>{let u,p=f.config.address[n];if(p!=null){let m=yn(f,p);if(this.dependencies.every(b=>b instanceof _?f.facet(b)===d.facet(b):b instanceof _e?f.field(b,!1)==d.field(b,!1):!0)||(a?yc(u=s(d),m,r):r(u=s(d),m)))return d.values[o]=m,0}else u=s(d);return d.values[o]=u,1}}}}function yc(t,e,i){if(t.length!=e.length)return!1;for(let s=0;s<t.length;s++)if(!i(t[s],e[s]))return!1;return!0}function la(t,e){let i=!1;for(let s of e)Vs(t,s)&1&&(i=!0);return i}function nm(t,e,i){let s=i.map(l=>t[l.id]),r=i.map(l=>l.type),n=s.filter(l=>!(l&1)),o=t[e.id]>>1;function a(l){let c=[];for(let h=0;h<s.length;h++){let d=yn(l,s[h]);if(r[h]==2)for(let f of d)c.push(f);else c.push(d)}return e.combine(c)}return{create(l){for(let c of s)Vs(l,c);return l.values[o]=a(l),1},update(l,c){if(!la(l,n))return 0;let h=a(l);return e.compare(h,l.values[o])?0:(l.values[o]=h,1)},reconfigure(l,c){let h=la(l,s),d=c.config.facets[e.id],f=c.facet(e);if(d&&!h&&fl(i,d))return l.values[o]=f,0;let u=a(l);return e.compare(u,f)?(l.values[o]=f,0):(l.values[o]=u,1)}}}const Dr=_.define({static:!0});class _e{constructor(e,i,s,r,n){this.id=e,this.createF=i,this.updateF=s,this.compareF=r,this.spec=n,this.provides=void 0}static define(e){let i=new _e(dl++,e.create,e.update,e.compare||((s,r)=>s===r),e);return e.provide&&(i.provides=e.provide(i)),i}create(e){let i=e.facet(Dr).find(s=>s.field==this);return((i==null?void 0:i.create)||this.createF)(e)}slot(e){let i=e[this.id]>>1;return{create:s=>(s.values[i]=this.create(s),1),update:(s,r)=>{let n=s.values[i],o=this.updateF(n,r);return this.compareF(n,o)?0:(s.values[i]=o,1)},reconfigure:(s,r)=>{let n=s.facet(Dr),o=r.facet(Dr),a;return(a=n.find(l=>l.field==this))&&a!=o.find(l=>l.field==this)?(s.values[i]=a.create(s),1):r.config.address[this.id]!=null?(s.values[i]=r.field(this),0):(s.values[i]=this.create(s),1)}}}init(e){return[this,Dr.of({field:this,create:e})]}get extension(){return this}}const $i={lowest:4,low:3,default:2,high:1,highest:0};function _s(t){return e=>new Fd(e,t)}const ji={highest:_s($i.highest),high:_s($i.high),default:_s($i.default),low:_s($i.low),lowest:_s($i.lowest)};class Fd{constructor(e,i){this.inner=e,this.prec=i}}class Gn{of(e){return new ca(this,e)}reconfigure(e){return Gn.reconfigure.of({compartment:this,extension:e})}get(e){return e.config.compartments.get(this)}}class ca{constructor(e,i){this.compartment=e,this.inner=i}}class vn{constructor(e,i,s,r,n,o){for(this.base=e,this.compartments=i,this.dynamicSlots=s,this.address=r,this.staticValues=n,this.facets=o,this.statusTemplate=[];this.statusTemplate.length<s.length;)this.statusTemplate.push(0)}staticFacet(e){let i=this.address[e.id];return i==null?e.default:this.staticValues[i>>1]}static resolve(e,i,s){let r=[],n=Object.create(null),o=new Map;for(let f of om(e,i,o))f instanceof _e?r.push(f):(n[f.facet.id]||(n[f.facet.id]=[])).push(f);let a=Object.create(null),l=[],c=[];for(let f of r)a[f.id]=c.length<<1,c.push(u=>f.slot(u));let h=s==null?void 0:s.config.facets;for(let f in n){let u=n[f],p=u[0].facet,m=h&&h[f]||[];if(u.every(b=>b.type==0))if(a[p.id]=l.length<<1|1,fl(m,u))l.push(s.facet(p));else{let b=p.combine(u.map(x=>x.value));l.push(s&&p.compare(b,s.facet(p))?s.facet(p):b)}else{for(let b of u)b.type==0?(a[b.id]=l.length<<1|1,l.push(b.value)):(a[b.id]=c.length<<1,c.push(x=>b.dynamicSlot(x)));a[p.id]=c.length<<1,c.push(b=>nm(b,p,u))}}let d=c.map(f=>f(a));return new vn(e,o,d,a,l,n)}}function om(t,e,i){let s=[[],[],[],[],[]],r=new Map;function n(o,a){let l=r.get(o);if(l!=null){if(l<=a)return;let c=s[l].indexOf(o);c>-1&&s[l].splice(c,1),o instanceof ca&&i.delete(o.compartment)}if(r.set(o,a),Array.isArray(o))for(let c of o)n(c,a);else if(o instanceof ca){if(i.has(o.compartment))throw new RangeError("Duplicate use of compartment in extensions");let c=e.get(o.compartment)||o.inner;i.set(o.compartment,c),n(c,a)}else if(o instanceof Fd)n(o.inner,o.prec);else if(o instanceof _e)s[a].push(o),o.provides&&n(o.provides,a);else if(o instanceof nn)s[a].push(o),o.facet.extensions&&n(o.facet.extensions,$i.default);else{let c=o.extension;if(!c)throw new Error(`Unrecognized extension value in extension set (${o}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`);n(c,a)}}return n(t,$i.default),s.reduce((o,a)=>o.concat(a))}function Vs(t,e){if(e&1)return 2;let i=e>>1,s=t.status[i];if(s==4)throw new Error("Cyclic dependency between fields and/or facets");if(s&2)return s;t.status[i]=4;let r=t.computeSlot(t,t.config.dynamicSlots[i]);return t.status[i]=2|r}function yn(t,e){return e&1?t.config.staticValues[e>>1]:t.values[e>>1]}const Nd=_.define(),ha=_.define({combine:t=>t.some(e=>e),static:!0}),zd=_.define({combine:t=>t.length?t[0]:void 0,static:!0}),Hd=_.define(),Wd=_.define(),Ud=_.define(),qd=_.define({combine:t=>t.length?t[0]:!1});class Yt{constructor(e,i){this.type=e,this.value=i}static define(){return new am}}class am{of(e){return new Yt(this,e)}}class lm{constructor(e){this.map=e}of(e){return new H(this,e)}}class H{constructor(e,i){this.type=e,this.value=i}map(e){let i=this.type.map(this.value,e);return i===void 0?void 0:i==this.value?this:new H(this.type,i)}is(e){return this.type==e}static define(e={}){return new lm(e.map||(i=>i))}static mapEffects(e,i){if(!e.length)return e;let s=[];for(let r of e){let n=r.map(i);n&&s.push(n)}return s}}H.reconfigure=H.define();H.appendConfig=H.define();class ye{constructor(e,i,s,r,n,o){this.startState=e,this.changes=i,this.selection=s,this.effects=r,this.annotations=n,this.scrollIntoView=o,this._doc=null,this._state=null,s&&Id(s,i.newLength),n.some(a=>a.type==ye.time)||(this.annotations=n.concat(ye.time.of(Date.now())))}static create(e,i,s,r,n,o){return new ye(e,i,s,r,n,o)}get newDoc(){return this._doc||(this._doc=this.changes.apply(this.startState.doc))}get newSelection(){return this.selection||this.startState.selection.map(this.changes)}get state(){return this._state||this.startState.applyTransaction(this),this._state}annotation(e){for(let i of this.annotations)if(i.type==e)return i.value}get docChanged(){return!this.changes.empty}get reconfigured(){return this.startState.config!=this.state.config}isUserEvent(e){let i=this.annotation(ye.userEvent);return!!(i&&(i==e||i.length>e.length&&i.slice(0,e.length)==e&&i[e.length]=="."))}}ye.time=Yt.define();ye.userEvent=Yt.define();ye.addToHistory=Yt.define();ye.remote=Yt.define();function cm(t,e){let i=[];for(let s=0,r=0;;){let n,o;if(s<t.length&&(r==e.length||e[r]>=t[s]))n=t[s++],o=t[s++];else if(r<e.length)n=e[r++],o=e[r++];else return i;!i.length||i[i.length-1]<n?i.push(n,o):i[i.length-1]<o&&(i[i.length-1]=o)}}function Vd(t,e,i){var s;let r,n,o;return i?(r=e.changes,n=ve.empty(e.changes.length),o=t.changes.compose(e.changes)):(r=e.changes.map(t.changes),n=t.changes.mapDesc(e.changes,!0),o=t.changes.compose(r)),{changes:o,selection:e.selection?e.selection.map(n):(s=t.selection)===null||s===void 0?void 0:s.map(r),effects:H.mapEffects(t.effects,r).concat(H.mapEffects(e.effects,n)),annotations:t.annotations.length?t.annotations.concat(e.annotations):e.annotations,scrollIntoView:t.scrollIntoView||e.scrollIntoView}}function da(t,e,i){let s=e.selection,r=as(e.annotations);return e.userEvent&&(r=r.concat(ye.userEvent.of(e.userEvent))),{changes:e.changes instanceof ve?e.changes:ve.of(e.changes||[],i,t.facet(zd)),selection:s&&(s instanceof C?s:C.single(s.anchor,s.head)),effects:as(e.effects),annotations:r,scrollIntoView:!!e.scrollIntoView}}function Qd(t,e,i){let s=da(t,e.length?e[0]:{},t.doc.length);e.length&&e[0].filter===!1&&(i=!1);for(let n=1;n<e.length;n++){e[n].filter===!1&&(i=!1);let o=!!e[n].sequential;s=Vd(s,da(t,e[n],o?s.changes.newLength:t.doc.length),o)}let r=ye.create(t,s.changes,s.selection,s.effects,s.annotations,s.scrollIntoView);return dm(i?hm(r):r)}function hm(t){let e=t.startState,i=!0;for(let r of e.facet(Hd)){let n=r(t);if(n===!1){i=!1;break}Array.isArray(n)&&(i=i===!0?n:cm(i,n))}if(i!==!0){let r,n;if(i===!1)n=t.changes.invertedDesc,r=ve.empty(e.doc.length);else{let o=t.changes.filter(i);r=o.changes,n=o.filtered.mapDesc(o.changes).invertedDesc}t=ye.create(e,r,t.selection&&t.selection.map(n),H.mapEffects(t.effects,n),t.annotations,t.scrollIntoView)}let s=e.facet(Wd);for(let r=s.length-1;r>=0;r--){let n=s[r](t);n instanceof ye?t=n:Array.isArray(n)&&n.length==1&&n[0]instanceof ye?t=n[0]:t=Qd(e,as(n),!1)}return t}function dm(t){let e=t.startState,i=e.facet(Ud),s=t;for(let r=i.length-1;r>=0;r--){let n=i[r](t);n&&Object.keys(n).length&&(s=Vd(s,da(e,n,t.changes.newLength),!0))}return s==t?t:ye.create(e,t.changes,t.selection,s.effects,s.annotations,s.scrollIntoView)}const fm=[];function as(t){return t==null?fm:Array.isArray(t)?t:[t]}var ce=(function(t){return t[t.Word=0]="Word",t[t.Space=1]="Space",t[t.Other=2]="Other",t})(ce||(ce={}));const um=/[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;let fa;try{fa=new RegExp("[\\p{Alphabetic}\\p{Number}_]","u")}catch{}function pm(t){if(fa)return fa.test(t);for(let e=0;e<t.length;e++){let i=t[e];if(/\w/.test(i)||i>""&&(i.toUpperCase()!=i.toLowerCase()||um.test(i)))return!0}return!1}function gm(t){return e=>{if(!/\S/.test(e))return ce.Space;if(pm(e))return ce.Word;for(let i=0;i<t.length;i++)if(e.indexOf(t[i])>-1)return ce.Word;return ce.Other}}class K{constructor(e,i,s,r,n,o){this.config=e,this.doc=i,this.selection=s,this.values=r,this.status=e.statusTemplate.slice(),this.computeSlot=n,o&&(o._state=this);for(let a=0;a<this.config.dynamicSlots.length;a++)Vs(this,a<<1);this.computeSlot=null}field(e,i=!0){let s=this.config.address[e.id];if(s==null){if(i)throw new RangeError("Field is not present in this state");return}return Vs(this,s),yn(this,s)}update(...e){return Qd(this,e,!0)}applyTransaction(e){let i=this.config,{base:s,compartments:r}=i;for(let a of e.effects)a.is(Gn.reconfigure)?(i&&(r=new Map,i.compartments.forEach((l,c)=>r.set(c,l)),i=null),r.set(a.value.compartment,a.value.extension)):a.is(H.reconfigure)?(i=null,s=a.value):a.is(H.appendConfig)&&(i=null,s=as(s).concat(a.value));let n;i?n=e.startState.values.slice():(i=vn.resolve(s,r,this),n=new K(i,this.doc,this.selection,i.dynamicSlots.map(()=>null),(l,c)=>c.reconfigure(l,this),null).values);let o=e.startState.facet(ha)?e.newSelection:e.newSelection.asSingle();new K(i,e.newDoc,o,n,(a,l)=>l.update(a,e),e)}replaceSelection(e){return typeof e=="string"&&(e=this.toText(e)),this.changeByRange(i=>({changes:{from:i.from,to:i.to,insert:e},range:C.cursor(i.from+e.length)}))}changeByRange(e){let i=this.selection,s=e(i.ranges[0]),r=this.changes(s.changes),n=[s.range],o=as(s.effects);for(let a=1;a<i.ranges.length;a++){let l=e(i.ranges[a]),c=this.changes(l.changes),h=c.map(r);for(let f=0;f<a;f++)n[f]=n[f].map(h);let d=r.mapDesc(c,!0);n.push(l.range.map(d)),r=r.compose(h),o=H.mapEffects(o,h).concat(H.mapEffects(as(l.effects),d))}return{changes:r,selection:C.create(n,i.mainIndex),effects:o}}changes(e=[]){return e instanceof ve?e:ve.of(e,this.doc.length,this.facet(K.lineSeparator))}toText(e){return X.of(e.split(this.facet(K.lineSeparator)||na))}sliceDoc(e=0,i=this.doc.length){return this.doc.sliceString(e,i,this.lineBreak)}facet(e){let i=this.config.address[e.id];return i==null?e.default:(Vs(this,i),yn(this,i))}toJSON(e){let i={doc:this.sliceDoc(),selection:this.selection.toJSON()};if(e)for(let s in e){let r=e[s];r instanceof _e&&this.config.address[r.id]!=null&&(i[s]=r.spec.toJSON(this.field(e[s]),this))}return i}static fromJSON(e,i={},s){if(!e||typeof e.doc!="string")throw new RangeError("Invalid JSON representation for EditorState");let r=[];if(s){for(let n in s)if(Object.prototype.hasOwnProperty.call(e,n)){let o=s[n],a=e[n];r.push(o.init(l=>o.spec.fromJSON(a,l)))}}return K.create({doc:e.doc,selection:C.fromJSON(e.selection),extensions:i.extensions?r.concat([i.extensions]):r})}static create(e={}){let i=vn.resolve(e.extensions||[],new Map),s=e.doc instanceof X?e.doc:X.of((e.doc||"").split(i.staticFacet(K.lineSeparator)||na)),r=e.selection?e.selection instanceof C?e.selection:C.single(e.selection.anchor,e.selection.head):C.single(0);return Id(r,s.length),i.staticFacet(ha)||(r=r.asSingle()),new K(i,s,r,i.dynamicSlots.map(()=>null),(n,o)=>o.create(n),null)}get tabSize(){return this.facet(K.tabSize)}get lineBreak(){return this.facet(K.lineSeparator)||`
`}get readOnly(){return this.facet(qd)}phrase(e,...i){for(let s of this.facet(K.phrases))if(Object.prototype.hasOwnProperty.call(s,e)){e=s[e];break}return i.length&&(e=e.replace(/\$(\$|\d*)/g,(s,r)=>{if(r=="$")return"$";let n=+(r||1);return!n||n>i.length?s:i[n-1]})),e}languageDataAt(e,i,s=-1){let r=[];for(let n of this.facet(Nd))for(let o of n(this,i,s))Object.prototype.hasOwnProperty.call(o,e)&&r.push(o[e]);return r}charCategorizer(e){let i=this.languageDataAt("wordChars",e);return gm(i.length?i[0]:"")}wordAt(e){let{text:i,from:s,length:r}=this.doc.lineAt(e),n=this.charCategorizer(e),o=e-s,a=e-s;for(;o>0;){let l=Ce(i,o,!1);if(n(i.slice(l,o))!=ce.Word)break;o=l}for(;a<r;){let l=Ce(i,a);if(n(i.slice(a,l))!=ce.Word)break;a=l}return o==a?null:C.range(o+s,a+s)}}K.allowMultipleSelections=ha;K.tabSize=_.define({combine:t=>t.length?t[0]:4});K.lineSeparator=zd;K.readOnly=qd;K.phrases=_.define({compare(t,e){let i=Object.keys(t),s=Object.keys(e);return i.length==s.length&&i.every(r=>t[r]==e[r])}});K.languageData=Nd;K.changeFilter=Hd;K.transactionFilter=Wd;K.transactionExtender=Ud;Gn.reconfigure=H.define();function Ft(t,e,i={}){let s={};for(let r of t)for(let n of Object.keys(r)){let o=r[n],a=s[n];if(a===void 0)s[n]=o;else if(!(a===o||o===void 0))if(Object.hasOwnProperty.call(i,n))s[n]=i[n](a,o);else throw new Error("Config merge conflict for field "+n)}for(let r in e)s[r]===void 0&&(s[r]=e[r]);return s}class ci{eq(e){return this==e}range(e,i=e){return ua.create(e,i,this)}}ci.prototype.startSide=ci.prototype.endSide=0;ci.prototype.point=!1;ci.prototype.mapMode=Ie.TrackDel;function ul(t,e){return t==e||t.constructor==e.constructor&&t.eq(e)}let ua=class jd{constructor(e,i,s){this.from=e,this.to=i,this.value=s}static create(e,i,s){return new jd(e,i,s)}};function pa(t,e){return t.from-e.from||t.value.startSide-e.value.startSide}class pl{constructor(e,i,s,r){this.from=e,this.to=i,this.value=s,this.maxPoint=r}get length(){return this.to[this.to.length-1]}findIndex(e,i,s,r=0){let n=s?this.to:this.from;for(let o=r,a=n.length;;){if(o==a)return o;let l=o+a>>1,c=n[l]-e||(s?this.value[l].endSide:this.value[l].startSide)-i;if(l==o)return c>=0?o:a;c>=0?a=l:o=l+1}}between(e,i,s,r){for(let n=this.findIndex(i,-1e9,!0),o=this.findIndex(s,1e9,!1,n);n<o;n++)if(r(this.from[n]+e,this.to[n]+e,this.value[n])===!1)return!1}map(e,i){let s=[],r=[],n=[],o=-1,a=-1;for(let l=0;l<this.value.length;l++){let c=this.value[l],h=this.from[l]+e,d=this.to[l]+e,f,u;if(h==d){let p=i.mapPos(h,c.startSide,c.mapMode);if(p==null||(f=u=p,c.startSide!=c.endSide&&(u=i.mapPos(h,c.endSide),u<f)))continue}else if(f=i.mapPos(h,c.startSide),u=i.mapPos(d,c.endSide),f>u||f==u&&c.startSide>0&&c.endSide<=0)continue;(u-f||c.endSide-c.startSide)<0||(o<0&&(o=f),c.point&&(a=Math.max(a,u-f)),s.push(c),r.push(f-o),n.push(u-o))}return{mapped:s.length?new pl(r,n,s,a):null,pos:o}}}class V{constructor(e,i,s,r){this.chunkPos=e,this.chunk=i,this.nextLayer=s,this.maxPoint=r}static create(e,i,s,r){return new V(e,i,s,r)}get length(){let e=this.chunk.length-1;return e<0?0:Math.max(this.chunkEnd(e),this.nextLayer.length)}get size(){if(this.isEmpty)return 0;let e=this.nextLayer.size;for(let i of this.chunk)e+=i.value.length;return e}chunkEnd(e){return this.chunkPos[e]+this.chunk[e].length}update(e){let{add:i=[],sort:s=!1,filterFrom:r=0,filterTo:n=this.length}=e,o=e.filter;if(i.length==0&&!o)return this;if(s&&(i=i.slice().sort(pa)),this.isEmpty)return i.length?V.of(i):this;let a=new Kd(this,null,-1).goto(0),l=0,c=[],h=new jt;for(;a.value||l<i.length;)if(l<i.length&&(a.from-i[l].from||a.startSide-i[l].value.startSide)>=0){let d=i[l++];h.addInner(d.from,d.to,d.value)||c.push(d)}else a.rangeIndex==1&&a.chunkIndex<this.chunk.length&&(l==i.length||this.chunkEnd(a.chunkIndex)<i[l].from)&&(!o||r>this.chunkEnd(a.chunkIndex)||n<this.chunkPos[a.chunkIndex])&&h.addChunk(this.chunkPos[a.chunkIndex],this.chunk[a.chunkIndex])?a.nextChunk():((!o||r>a.to||n<a.from||o(a.from,a.to,a.value))&&(h.addInner(a.from,a.to,a.value)||c.push(ua.create(a.from,a.to,a.value))),a.next());return h.finishInner(this.nextLayer.isEmpty&&!c.length?V.empty:this.nextLayer.update({add:c,filter:o,filterFrom:r,filterTo:n}))}map(e){if(e.empty||this.isEmpty)return this;let i=[],s=[],r=-1;for(let o=0;o<this.chunk.length;o++){let a=this.chunkPos[o],l=this.chunk[o],c=e.touchesRange(a,a+l.length);if(c===!1)r=Math.max(r,l.maxPoint),i.push(l),s.push(e.mapPos(a));else if(c===!0){let{mapped:h,pos:d}=l.map(a,e);h&&(r=Math.max(r,h.maxPoint),i.push(h),s.push(d))}}let n=this.nextLayer.map(e);return i.length==0?n:new V(s,i,n||V.empty,r)}between(e,i,s){if(!this.isEmpty){for(let r=0;r<this.chunk.length;r++){let n=this.chunkPos[r],o=this.chunk[r];if(i>=n&&e<=n+o.length&&o.between(n,e-n,i-n,s)===!1)return}this.nextLayer.between(e,i,s)}}iter(e=0){return rr.from([this]).goto(e)}get isEmpty(){return this.nextLayer==this}static iter(e,i=0){return rr.from(e).goto(i)}static compare(e,i,s,r,n=-1){let o=e.filter(d=>d.maxPoint>0||!d.isEmpty&&d.maxPoint>=n),a=i.filter(d=>d.maxPoint>0||!d.isEmpty&&d.maxPoint>=n),l=xc(o,a,s),c=new Bs(o,l,n),h=new Bs(a,l,n);s.iterGaps((d,f,u)=>wc(c,d,h,f,u,r)),s.empty&&s.length==0&&wc(c,0,h,0,0,r)}static eq(e,i,s=0,r){r==null&&(r=999999999);let n=e.filter(h=>!h.isEmpty&&i.indexOf(h)<0),o=i.filter(h=>!h.isEmpty&&e.indexOf(h)<0);if(n.length!=o.length)return!1;if(!n.length)return!0;let a=xc(n,o),l=new Bs(n,a,0).goto(s),c=new Bs(o,a,0).goto(s);for(;;){if(l.to!=c.to||!ga(l.active,c.active)||l.point&&(!c.point||!ul(l.point,c.point)))return!1;if(l.to>r)return!0;l.next(),c.next()}}static spans(e,i,s,r,n=-1){let o=new Bs(e,null,n).goto(i),a=i,l=o.openStart;for(;;){let c=Math.min(o.to,s);if(o.point){let h=o.activeForPoint(o.to),d=o.pointFrom<i?h.length+1:o.point.startSide<0?h.length:Math.min(h.length,l);r.point(a,c,o.point,h,d,o.pointRank),l=Math.min(o.openEnd(c),h.length)}else c>a&&(r.span(a,c,o.active,l),l=o.openEnd(c));if(o.to>s)return l+(o.point&&o.to>s?1:0);a=o.to,o.next()}}static of(e,i=!1){let s=new jt;for(let r of e instanceof ua?[e]:i?mm(e):e)s.add(r.from,r.to,r.value);return s.finish()}static join(e){if(!e.length)return V.empty;let i=e[e.length-1];for(let s=e.length-2;s>=0;s--)for(let r=e[s];r!=V.empty;r=r.nextLayer)i=new V(r.chunkPos,r.chunk,i,Math.max(r.maxPoint,i.maxPoint));return i}}V.empty=new V([],[],null,-1);function mm(t){if(t.length>1)for(let e=t[0],i=1;i<t.length;i++){let s=t[i];if(pa(e,s)>0)return t.slice().sort(pa);e=s}return t}V.empty.nextLayer=V.empty;class jt{finishChunk(e){this.chunks.push(new pl(this.from,this.to,this.value,this.maxPoint)),this.chunkPos.push(this.chunkStart),this.chunkStart=-1,this.setMaxPoint=Math.max(this.setMaxPoint,this.maxPoint),this.maxPoint=-1,e&&(this.from=[],this.to=[],this.value=[])}constructor(){this.chunks=[],this.chunkPos=[],this.chunkStart=-1,this.last=null,this.lastFrom=-1e9,this.lastTo=-1e9,this.from=[],this.to=[],this.value=[],this.maxPoint=-1,this.setMaxPoint=-1,this.nextLayer=null}add(e,i,s){this.addInner(e,i,s)||(this.nextLayer||(this.nextLayer=new jt)).add(e,i,s)}addInner(e,i,s){let r=e-this.lastTo||s.startSide-this.last.endSide;if(r<=0&&(e-this.lastFrom||s.startSide-this.last.startSide)<0)throw new Error("Ranges must be added sorted by `from` position and `startSide`");return r<0?!1:(this.from.length==250&&this.finishChunk(!0),this.chunkStart<0&&(this.chunkStart=e),this.from.push(e-this.chunkStart),this.to.push(i-this.chunkStart),this.last=s,this.lastFrom=e,this.lastTo=i,this.value.push(s),s.point&&(this.maxPoint=Math.max(this.maxPoint,i-e)),!0)}addChunk(e,i){if((e-this.lastTo||i.value[0].startSide-this.last.endSide)<0)return!1;this.from.length&&this.finishChunk(!0),this.setMaxPoint=Math.max(this.setMaxPoint,i.maxPoint),this.chunks.push(i),this.chunkPos.push(e);let s=i.value.length-1;return this.last=i.value[s],this.lastFrom=i.from[s]+e,this.lastTo=i.to[s]+e,!0}finish(){return this.finishInner(V.empty)}finishInner(e){if(this.from.length&&this.finishChunk(!1),this.chunks.length==0)return e;let i=V.create(this.chunkPos,this.chunks,this.nextLayer?this.nextLayer.finishInner(e):e,this.setMaxPoint);return this.from=null,i}}function xc(t,e,i){let s=new Map;for(let n of t)for(let o=0;o<n.chunk.length;o++)n.chunk[o].maxPoint<=0&&s.set(n.chunk[o],n.chunkPos[o]);let r=new Set;for(let n of e)for(let o=0;o<n.chunk.length;o++){let a=s.get(n.chunk[o]);a!=null&&(i?i.mapPos(a):a)==n.chunkPos[o]&&!(i!=null&&i.touchesRange(a,a+n.chunk[o].length))&&r.add(n.chunk[o])}return r}class Kd{constructor(e,i,s,r=0){this.layer=e,this.skip=i,this.minPoint=s,this.rank=r}get startSide(){return this.value?this.value.startSide:0}get endSide(){return this.value?this.value.endSide:0}goto(e,i=-1e9){return this.chunkIndex=this.rangeIndex=0,this.gotoInner(e,i,!1),this}gotoInner(e,i,s){for(;this.chunkIndex<this.layer.chunk.length;){let r=this.layer.chunk[this.chunkIndex];if(!(this.skip&&this.skip.has(r)||this.layer.chunkEnd(this.chunkIndex)<e||r.maxPoint<this.minPoint))break;this.chunkIndex++,s=!1}if(this.chunkIndex<this.layer.chunk.length){let r=this.layer.chunk[this.chunkIndex].findIndex(e-this.layer.chunkPos[this.chunkIndex],i,!0);(!s||this.rangeIndex<r)&&this.setRangeIndex(r)}this.next()}forward(e,i){(this.to-e||this.endSide-i)<0&&this.gotoInner(e,i,!0)}next(){for(;;)if(this.chunkIndex==this.layer.chunk.length){this.from=this.to=1e9,this.value=null;break}else{let e=this.layer.chunkPos[this.chunkIndex],i=this.layer.chunk[this.chunkIndex],s=e+i.from[this.rangeIndex];if(this.from=s,this.to=e+i.to[this.rangeIndex],this.value=i.value[this.rangeIndex],this.setRangeIndex(this.rangeIndex+1),this.minPoint<0||this.value.point&&this.to-this.from>=this.minPoint)break}}setRangeIndex(e){if(e==this.layer.chunk[this.chunkIndex].value.length){if(this.chunkIndex++,this.skip)for(;this.chunkIndex<this.layer.chunk.length&&this.skip.has(this.layer.chunk[this.chunkIndex]);)this.chunkIndex++;this.rangeIndex=0}else this.rangeIndex=e}nextChunk(){this.chunkIndex++,this.rangeIndex=0,this.next()}compare(e){return this.from-e.from||this.startSide-e.startSide||this.rank-e.rank||this.to-e.to||this.endSide-e.endSide}}class rr{constructor(e){this.heap=e}static from(e,i=null,s=-1){let r=[];for(let n=0;n<e.length;n++)for(let o=e[n];!o.isEmpty;o=o.nextLayer)o.maxPoint>=s&&r.push(new Kd(o,i,s,n));return r.length==1?r[0]:new rr(r)}get startSide(){return this.value?this.value.startSide:0}goto(e,i=-1e9){for(let s of this.heap)s.goto(e,i);for(let s=this.heap.length>>1;s>=0;s--)So(this.heap,s);return this.next(),this}forward(e,i){for(let s of this.heap)s.forward(e,i);for(let s=this.heap.length>>1;s>=0;s--)So(this.heap,s);(this.to-e||this.value.endSide-i)<0&&this.next()}next(){if(this.heap.length==0)this.from=this.to=1e9,this.value=null,this.rank=-1;else{let e=this.heap[0];this.from=e.from,this.to=e.to,this.value=e.value,this.rank=e.rank,e.value&&e.next(),So(this.heap,0)}}}function So(t,e){for(let i=t[e];;){let s=(e<<1)+1;if(s>=t.length)break;let r=t[s];if(s+1<t.length&&r.compare(t[s+1])>=0&&(r=t[s+1],s++),i.compare(r)<0)break;t[s]=i,t[e]=r,e=s}}class Bs{constructor(e,i,s){this.minPoint=s,this.active=[],this.activeTo=[],this.activeRank=[],this.minActive=-1,this.point=null,this.pointFrom=0,this.pointRank=0,this.to=-1e9,this.endSide=0,this.openStart=-1,this.cursor=rr.from(e,i,s)}goto(e,i=-1e9){return this.cursor.goto(e,i),this.active.length=this.activeTo.length=this.activeRank.length=0,this.minActive=-1,this.to=e,this.endSide=i,this.openStart=-1,this.next(),this}forward(e,i){for(;this.minActive>-1&&(this.activeTo[this.minActive]-e||this.active[this.minActive].endSide-i)<0;)this.removeActive(this.minActive);this.cursor.forward(e,i)}removeActive(e){_r(this.active,e),_r(this.activeTo,e),_r(this.activeRank,e),this.minActive=kc(this.active,this.activeTo)}addActive(e){let i=0,{value:s,to:r,rank:n}=this.cursor;for(;i<this.activeRank.length&&(n-this.activeRank[i]||r-this.activeTo[i])>0;)i++;Br(this.active,i,s),Br(this.activeTo,i,r),Br(this.activeRank,i,n),e&&Br(e,i,this.cursor.from),this.minActive=kc(this.active,this.activeTo)}next(){let e=this.to,i=this.point;this.point=null;let s=this.openStart<0?[]:null;for(;;){let r=this.minActive;if(r>-1&&(this.activeTo[r]-this.cursor.from||this.active[r].endSide-this.cursor.startSide)<0){if(this.activeTo[r]>e){this.to=this.activeTo[r],this.endSide=this.active[r].endSide;break}this.removeActive(r),s&&_r(s,r)}else if(this.cursor.value)if(this.cursor.from>e){this.to=this.cursor.from,this.endSide=this.cursor.startSide;break}else{let n=this.cursor.value;if(!n.point)this.addActive(s),this.cursor.next();else if(i&&this.cursor.to==this.to&&this.cursor.from<this.cursor.to)this.cursor.next();else{this.point=n,this.pointFrom=this.cursor.from,this.pointRank=this.cursor.rank,this.to=this.cursor.to,this.endSide=n.endSide,this.cursor.next(),this.forward(this.to,this.endSide);break}}else{this.to=this.endSide=1e9;break}}if(s){this.openStart=0;for(let r=s.length-1;r>=0&&s[r]<e;r--)this.openStart++}}activeForPoint(e){if(!this.active.length)return this.active;let i=[];for(let s=this.active.length-1;s>=0&&!(this.activeRank[s]<this.pointRank);s--)(this.activeTo[s]>e||this.activeTo[s]==e&&this.active[s].endSide>=this.point.endSide)&&i.push(this.active[s]);return i.reverse()}openEnd(e){let i=0;for(let s=this.activeTo.length-1;s>=0&&this.activeTo[s]>e;s--)i++;return i}}function wc(t,e,i,s,r,n){t.goto(e),i.goto(s);let o=s+r,a=s,l=s-e,c=!!n.boundChange;for(let h=!1;;){let d=t.to+l-i.to,f=d||t.endSide-i.endSide,u=f<0?t.to+l:i.to,p=Math.min(u,o);if(t.point||i.point?(t.point&&i.point&&ul(t.point,i.point)&&ga(t.activeForPoint(t.to),i.activeForPoint(i.to))||n.comparePoint(a,p,t.point,i.point),h=!1):(h&&n.boundChange(a),p>a&&!ga(t.active,i.active)&&n.compareRange(a,p,t.active,i.active),c&&p<o&&(d||t.openEnd(u)!=i.openEnd(u))&&(h=!0)),u>o)break;a=u,f<=0&&t.next(),f>=0&&i.next()}}function ga(t,e){if(t.length!=e.length)return!1;for(let i=0;i<t.length;i++)if(t[i]!=e[i]&&!ul(t[i],e[i]))return!1;return!0}function _r(t,e){for(let i=e,s=t.length-1;i<s;i++)t[i]=t[i+1];t.pop()}function Br(t,e,i){for(let s=t.length-1;s>=e;s--)t[s+1]=t[s];t[e]=i}function kc(t,e){let i=-1,s=1e9;for(let r=0;r<e.length;r++)(e[r]-s||t[r].endSide-t[i].endSide)<0&&(i=r,s=e[r]);return i}function $s(t,e,i=t.length){let s=0;for(let r=0;r<i&&r<t.length;)t.charCodeAt(r)==9?(s+=e-s%e,r++):(s++,r=Ce(t,r));return s}function ma(t,e,i,s){for(let r=0,n=0;;){if(n>=e)return r;if(r==t.length)break;n+=t.charCodeAt(r)==9?i-n%i:1,r=Ce(t,r)}return s===!0?-1:t.length}const ba="ͼ",Sc=typeof Symbol>"u"?"__"+ba:Symbol.for(ba),va=typeof Symbol>"u"?"__styleSet"+Math.floor(Math.random()*1e8):Symbol("styleSet"),Cc=typeof globalThis<"u"?globalThis:typeof window<"u"?window:{};class hi{constructor(e,i){this.rules=[];let{finish:s}=i||{};function r(o){return/^@/.test(o)?[o]:o.split(/,\s*/)}function n(o,a,l,c){let h=[],d=/^@(\w+)\b/.exec(o[0]),f=d&&d[1]=="keyframes";if(d&&a==null)return l.push(o[0]+";");for(let u in a){let p=a[u];if(/&/.test(u))n(u.split(/,\s*/).map(m=>o.map(b=>m.replace(/&/,b))).reduce((m,b)=>m.concat(b)),p,l);else if(p&&typeof p=="object"){if(!d)throw new RangeError("The value of a property ("+u+") should be a primitive value.");n(r(u),p,h,f)}else p!=null&&h.push(u.replace(/_.*/,"").replace(/[A-Z]/g,m=>"-"+m.toLowerCase())+": "+p+";")}(h.length||f)&&l.push((s&&!d&&!c?o.map(s):o).join(", ")+" {"+h.join(" ")+"}")}for(let o in e)n(r(o),e[o],this.rules)}getRules(){return this.rules.join(`
`)}static newName(){let e=Cc[Sc]||1;return Cc[Sc]=e+1,ba+e.toString(36)}static mount(e,i,s){let r=e[va],n=s&&s.nonce;r?n&&r.setNonce(n):r=new bm(e,n),r.mount(Array.isArray(i)?i:[i],e)}}let Oc=new Map;class bm{constructor(e,i){let s=e.ownerDocument||e,r=s.defaultView;if(!e.head&&e.adoptedStyleSheets&&r.CSSStyleSheet){let n=Oc.get(s);if(n)return e[va]=n;this.sheet=new r.CSSStyleSheet,Oc.set(s,this)}else this.styleTag=s.createElement("style"),i&&this.styleTag.setAttribute("nonce",i);this.modules=[],e[va]=this}mount(e,i){let s=this.sheet,r=0,n=0;for(let o=0;o<e.length;o++){let a=e[o],l=this.modules.indexOf(a);if(l<n&&l>-1&&(this.modules.splice(l,1),n--,l=-1),l==-1){if(this.modules.splice(n++,0,a),s)for(let c=0;c<a.rules.length;c++)s.insertRule(a.rules[c],r++)}else{for(;n<l;)r+=this.modules[n++].rules.length;r+=a.rules.length,n++}}if(s)i.adoptedStyleSheets.indexOf(this.sheet)<0&&(i.adoptedStyleSheets=[this.sheet,...i.adoptedStyleSheets]);else{let o="";for(let l=0;l<this.modules.length;l++)o+=this.modules[l].getRules()+`
`;this.styleTag.textContent=o;let a=i.head||i;this.styleTag.parentNode!=a&&a.insertBefore(this.styleTag,a.firstChild)}}setNonce(e){this.styleTag&&this.styleTag.getAttribute("nonce")!=e&&this.styleTag.setAttribute("nonce",e)}}var di={8:"Backspace",9:"Tab",10:"Enter",12:"NumLock",13:"Enter",16:"Shift",17:"Control",18:"Alt",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",44:"PrintScreen",45:"Insert",46:"Delete",59:";",61:"=",91:"Meta",92:"Meta",106:"*",107:"+",108:",",109:"-",110:".",111:"/",144:"NumLock",145:"ScrollLock",160:"Shift",161:"Shift",162:"Control",163:"Control",164:"Alt",165:"Alt",173:"-",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},nr={48:")",49:"!",50:"@",51:"#",52:"$",53:"%",54:"^",55:"&",56:"*",57:"(",59:":",61:"+",173:"_",186:":",187:"+",188:"<",189:"_",190:">",191:"?",192:"~",219:"{",220:"|",221:"}",222:'"'},vm=typeof navigator<"u"&&/Mac/.test(navigator.platform),ym=typeof navigator<"u"&&/MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);for(var $e=0;$e<10;$e++)di[48+$e]=di[96+$e]=String($e);for(var $e=1;$e<=24;$e++)di[$e+111]="F"+$e;for(var $e=65;$e<=90;$e++)di[$e]=String.fromCharCode($e+32),nr[$e]=String.fromCharCode($e);for(var Co in di)nr.hasOwnProperty(Co)||(nr[Co]=di[Co]);function xm(t){var e=vm&&t.metaKey&&t.shiftKey&&!t.ctrlKey&&!t.altKey||ym&&t.shiftKey&&t.key&&t.key.length==1||t.key=="Unidentified",i=!e&&t.key||(t.shiftKey?nr:di)[t.keyCode]||t.key||"Unidentified";return i=="Esc"&&(i="Escape"),i=="Del"&&(i="Delete"),i=="Left"&&(i="ArrowLeft"),i=="Up"&&(i="ArrowUp"),i=="Right"&&(i="ArrowRight"),i=="Down"&&(i="ArrowDown"),i}function Z(){var t=arguments[0];typeof t=="string"&&(t=document.createElement(t));var e=1,i=arguments[1];if(i&&typeof i=="object"&&i.nodeType==null&&!Array.isArray(i)){for(var s in i)if(Object.prototype.hasOwnProperty.call(i,s)){var r=i[s];typeof r=="string"?t.setAttribute(s,r):r!=null&&(t[s]=r)}e++}for(;e<arguments.length;e++)Xd(t,arguments[e]);return t}function Xd(t,e){if(typeof e=="string")t.appendChild(document.createTextNode(e));else if(e!=null)if(e.nodeType!=null)t.appendChild(e);else if(Array.isArray(e))for(var i=0;i<e.length;i++)Xd(t,e[i]);else throw new RangeError("Unsupported child node: "+e)}let Le=typeof navigator<"u"?navigator:{userAgent:"",vendor:"",platform:""},ya=typeof document<"u"?document:{documentElement:{style:{}}};const xa=/Edge\/(\d+)/.exec(Le.userAgent),Jd=/MSIE \d/.test(Le.userAgent),wa=/Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Le.userAgent),Zn=!!(Jd||wa||xa),Ac=!Zn&&/gecko\/(\d+)/i.test(Le.userAgent),Oo=!Zn&&/Chrome\/(\d+)/.exec(Le.userAgent),$c="webkitFontSmoothing"in ya.documentElement.style,ka=!Zn&&/Apple Computer/.test(Le.vendor),Pc=ka&&(/Mobile\/\w+/.test(Le.userAgent)||Le.maxTouchPoints>2);var D={mac:Pc||/Mac/.test(Le.platform),windows:/Win/.test(Le.platform),linux:/Linux|X11/.test(Le.platform),ie:Zn,ie_version:Jd?ya.documentMode||6:wa?+wa[1]:xa?+xa[1]:0,gecko:Ac,gecko_version:Ac?+(/Firefox\/(\d+)/.exec(Le.userAgent)||[0,0])[1]:0,chrome:!!Oo,chrome_version:Oo?+Oo[1]:0,ios:Pc,android:/Android\b/.test(Le.userAgent),webkit:$c,webkit_version:$c?+(/\bAppleWebKit\/(\d+)/.exec(Le.userAgent)||[0,0])[1]:0,safari:ka,safari_version:ka?+(/\bVersion\/(\d+(\.\d+)?)/.exec(Le.userAgent)||[0,0])[1]:0,tabSize:ya.documentElement.style.tabSize!=null?"tab-size":"-moz-tab-size"};function gl(t,e){for(let i in t)i=="class"&&e.class?e.class+=" "+t.class:i=="style"&&e.style?e.style+=";"+t.style:e[i]=t[i];return e}const xn=Object.create(null);function ml(t,e,i){if(t==e)return!0;t||(t=xn),e||(e=xn);let s=Object.keys(t),r=Object.keys(e);if(s.length-0!=r.length-0)return!1;for(let n of s)if(n!=i&&(r.indexOf(n)==-1||t[n]!==e[n]))return!1;return!0}function wm(t,e){for(let i=t.attributes.length-1;i>=0;i--){let s=t.attributes[i].name;e[s]==null&&t.removeAttribute(s)}for(let i in e){let s=e[i];i=="style"?t.style.cssText=s:t.getAttribute(i)!=s&&t.setAttribute(i,s)}}function Tc(t,e,i){let s=!1;if(e)for(let r in e)i&&r in i||(s=!0,r=="style"?t.style.cssText="":t.removeAttribute(r));if(i)for(let r in i)e&&e[r]==i[r]||(s=!0,r=="style"?t.style.cssText=i[r]:t.setAttribute(r,i[r]));return s}function km(t){let e=Object.create(null);for(let i=0;i<t.attributes.length;i++){let s=t.attributes[i];e[s.name]=s.value}return e}class Gt{eq(e){return!1}updateDOM(e,i,s){return!1}compare(e){return this==e||this.constructor==e.constructor&&this.eq(e)}get estimatedHeight(){return-1}get lineBreaks(){return 0}ignoreEvent(e){return!0}coordsAt(e,i,s){return null}get isHidden(){return!1}get editable(){return!1}destroy(e){}}var Pe=(function(t){return t[t.Text=0]="Text",t[t.WidgetBefore=1]="WidgetBefore",t[t.WidgetAfter=2]="WidgetAfter",t[t.WidgetRange=3]="WidgetRange",t})(Pe||(Pe={}));class N extends ci{constructor(e,i,s,r){super(),this.startSide=e,this.endSide=i,this.widget=s,this.spec=r}get heightRelevant(){return!1}static mark(e){return new Sr(e)}static widget(e){let i=Math.max(-1e4,Math.min(1e4,e.side||0)),s=!!e.block;return i+=s&&!e.inlineOrder?i>0?3e8:-4e8:i>0?1e8:-1e8,new Ui(e,i,i,s,e.widget||null,!1)}static replace(e){let i=!!e.block,s,r;if(e.isBlockGap)s=-5e8,r=4e8;else{let{start:n,end:o}=Yd(e,i);s=(n?i?-3e8:-1:5e8)-1,r=(o?i?2e8:1:-6e8)+1}return new Ui(e,s,r,i,e.widget||null,!0)}static line(e){return new Cr(e)}static set(e,i=!1){return V.of(e,i)}hasHeight(){return this.widget?this.widget.estimatedHeight>-1:!1}}N.none=V.empty;class Sr extends N{constructor(e){let{start:i,end:s}=Yd(e);super(i?-1:5e8,s?1:-6e8,null,e),this.tagName=e.tagName||"span",this.attrs=e.class&&e.attributes?gl(e.attributes,{class:e.class}):e.class?{class:e.class}:e.attributes||xn}eq(e){return this==e||e instanceof Sr&&this.tagName==e.tagName&&ml(this.attrs,e.attrs)}range(e,i=e){if(e>=i)throw new RangeError("Mark decorations may not be empty");return super.range(e,i)}}Sr.prototype.point=!1;class Cr extends N{constructor(e){super(-2e8,-2e8,null,e)}eq(e){return e instanceof Cr&&this.spec.class==e.spec.class&&ml(this.spec.attributes,e.spec.attributes)}range(e,i=e){if(i!=e)throw new RangeError("Line decoration ranges must be zero-length");return super.range(e,i)}}Cr.prototype.mapMode=Ie.TrackBefore;Cr.prototype.point=!0;class Ui extends N{constructor(e,i,s,r,n,o){super(i,s,n,e),this.block=r,this.isReplace=o,this.mapMode=r?i<=0?Ie.TrackBefore:Ie.TrackAfter:Ie.TrackDel}get type(){return this.startSide!=this.endSide?Pe.WidgetRange:this.startSide<=0?Pe.WidgetBefore:Pe.WidgetAfter}get heightRelevant(){return this.block||!!this.widget&&(this.widget.estimatedHeight>=5||this.widget.lineBreaks>0)}eq(e){return e instanceof Ui&&Sm(this.widget,e.widget)&&this.block==e.block&&this.startSide==e.startSide&&this.endSide==e.endSide}range(e,i=e){if(this.isReplace&&(e>i||e==i&&this.startSide>0&&this.endSide<=0))throw new RangeError("Invalid range for replacement decoration");if(!this.isReplace&&i!=e)throw new RangeError("Widget decorations can only have zero-length ranges");return super.range(e,i)}}Ui.prototype.point=!0;function Yd(t,e=!1){let{inclusiveStart:i,inclusiveEnd:s}=t;return i==null&&(i=t.inclusive),s==null&&(s=t.inclusive),{start:i??e,end:s??e}}function Sm(t,e){return t==e||!!(t&&e&&t.compare(e))}function ls(t,e,i,s=0){let r=i.length-1;r>=0&&i[r]+s>=t?i[r]=Math.max(i[r],e):i.push(t,e)}class or extends ci{constructor(e,i){super(),this.tagName=e,this.attributes=i}eq(e){return e==this||e instanceof or&&this.tagName==e.tagName&&ml(this.attributes,e.attributes)}static create(e){return new or(e.tagName,e.attributes||xn)}static set(e,i=!1){return V.of(e,i)}}or.prototype.startSide=or.prototype.endSide=-1;function ar(t){let e;return t.nodeType==11?e=t.getSelection?t:t.ownerDocument:e=t,e.getSelection()}function Sa(t,e){return e?t==e||t.contains(e.nodeType!=1?e.parentNode:e):!1}function Qs(t,e){if(!e.anchorNode)return!1;try{return Sa(t,e.anchorNode)}catch{return!1}}function on(t){return t.nodeType==3?lr(t,0,t.nodeValue.length).getClientRects():t.nodeType==1?t.getClientRects():[]}function js(t,e,i,s){return i?Mc(t,e,i,s,-1)||Mc(t,e,i,s,1):!1}function fi(t){for(var e=0;;e++)if(t=t.previousSibling,!t)return e}function wn(t){return t.nodeType==1&&/^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(t.nodeName)}function Mc(t,e,i,s,r){for(;;){if(t==i&&e==s)return!0;if(e==(r<0?0:Kt(t))){if(t.nodeName=="DIV")return!1;let n=t.parentNode;if(!n||n.nodeType!=1)return!1;e=fi(t)+(r<0?0:1),t=n}else if(t.nodeType==1){if(t=t.childNodes[e+(r<0?-1:0)],t.nodeType==1&&t.contentEditable=="false")return!1;e=r<0?Kt(t):0}else return!1}}function Kt(t){return t.nodeType==3?t.nodeValue.length:t.childNodes.length}function kn(t,e){let i=e?t.left:t.right;return{left:i,right:i,top:t.top,bottom:t.bottom}}function Cm(t){let e=t.visualViewport;return e?{left:0,right:e.width,top:0,bottom:e.height}:{left:0,right:t.innerWidth,top:0,bottom:t.innerHeight}}function Gd(t,e){let i=e.width/t.offsetWidth,s=e.height/t.offsetHeight;return(i>.995&&i<1.005||!isFinite(i)||Math.abs(e.width-t.offsetWidth)<1)&&(i=1),(s>.995&&s<1.005||!isFinite(s)||Math.abs(e.height-t.offsetHeight)<1)&&(s=1),{scaleX:i,scaleY:s}}function Om(t,e,i,s,r,n,o,a){let l=t.ownerDocument,c=l.defaultView||window;for(let h=t,d=!1;h&&!d;)if(h.nodeType==1){let f,u=h==l.body,p=1,m=1;if(u)f=Cm(c);else{if(/^(fixed|sticky)$/.test(getComputedStyle(h).position)&&(d=!0),h.scrollHeight<=h.clientHeight&&h.scrollWidth<=h.clientWidth){h=h.assignedSlot||h.parentNode;continue}let k=h.getBoundingClientRect();({scaleX:p,scaleY:m}=Gd(h,k)),f={left:k.left,right:k.left+h.clientWidth*p,top:k.top,bottom:k.top+h.clientHeight*m}}let b=0,x=0;if(r=="nearest")e.top<f.top+o?(x=e.top-(f.top+o),i>0&&e.bottom>f.bottom+x&&(x=e.bottom-f.bottom+o)):e.bottom>f.bottom-o&&(x=e.bottom-f.bottom+o,i<0&&e.top-x<f.top&&(x=e.top-(f.top+o)));else{let k=e.bottom-e.top,O=f.bottom-f.top;x=(r=="center"&&k<=O?e.top+k/2-O/2:r=="start"||r=="center"&&i<0?e.top-o:e.bottom-O+o)-f.top}if(s=="nearest"?e.left<f.left+n?(b=e.left-(f.left+n),i>0&&e.right>f.right+b&&(b=e.right-f.right+n)):e.right>f.right-n&&(b=e.right-f.right+n,i<0&&e.left<f.left+b&&(b=e.left-(f.left+n))):b=(s=="center"?e.left+(e.right-e.left)/2-(f.right-f.left)/2:s=="start"==a?e.left-n:e.right-(f.right-f.left)+n)-f.left,b||x)if(u)c.scrollBy(b,x);else{let k=0,O=0;if(x){let R=h.scrollTop;h.scrollTop+=x/m,O=(h.scrollTop-R)*m}if(b){let R=h.scrollLeft;h.scrollLeft+=b/p,k=(h.scrollLeft-R)*p}e={left:e.left-k,top:e.top-O,right:e.right-k,bottom:e.bottom-O},k&&Math.abs(k-b)<1&&(s="nearest"),O&&Math.abs(O-x)<1&&(r="nearest")}if(u)break;(e.top<f.top||e.bottom>f.bottom||e.left<f.left||e.right>f.right)&&(e={left:Math.max(e.left,f.left),right:Math.min(e.right,f.right),top:Math.max(e.top,f.top),bottom:Math.min(e.bottom,f.bottom)}),h=h.assignedSlot||h.parentNode}else if(h.nodeType==11)h=h.host;else break}function Zd(t,e=!0){let i=t.ownerDocument,s=null,r=null;for(let n=t.parentNode;n&&!(n==i.body||(!e||s)&&r);)if(n.nodeType==1)!r&&n.scrollHeight>n.clientHeight&&(r=n),e&&!s&&n.scrollWidth>n.clientWidth&&(s=n),n=n.assignedSlot||n.parentNode;else if(n.nodeType==11)n=n.host;else break;return{x:s,y:r}}class Am{constructor(){this.anchorNode=null,this.anchorOffset=0,this.focusNode=null,this.focusOffset=0}eq(e){return this.anchorNode==e.anchorNode&&this.anchorOffset==e.anchorOffset&&this.focusNode==e.focusNode&&this.focusOffset==e.focusOffset}setRange(e){let{anchorNode:i,focusNode:s}=e;this.set(i,Math.min(e.anchorOffset,i?Kt(i):0),s,Math.min(e.focusOffset,s?Kt(s):0))}set(e,i,s,r){this.anchorNode=e,this.anchorOffset=i,this.focusNode=s,this.focusOffset=r}}let Ai=null;D.safari&&D.safari_version>=26&&(Ai=!1);function ef(t){if(t.setActive)return t.setActive();if(Ai)return t.focus(Ai);let e=[];for(let i=t;i&&(e.push(i,i.scrollTop,i.scrollLeft),i!=i.ownerDocument);i=i.parentNode);if(t.focus(Ai==null?{get preventScroll(){return Ai={preventScroll:!0},!0}}:void 0),!Ai){Ai=!1;for(let i=0;i<e.length;){let s=e[i++],r=e[i++],n=e[i++];s.scrollTop!=r&&(s.scrollTop=r),s.scrollLeft!=n&&(s.scrollLeft=n)}}}let Ec;function lr(t,e,i=e){let s=Ec||(Ec=document.createRange());return s.setEnd(t,i),s.setStart(t,e),s}function cs(t,e,i,s){let r={key:e,code:e,keyCode:i,which:i,cancelable:!0};s&&({altKey:r.altKey,ctrlKey:r.ctrlKey,shiftKey:r.shiftKey,metaKey:r.metaKey}=s);let n=new KeyboardEvent("keydown",r);n.synthetic=!0,t.dispatchEvent(n);let o=new KeyboardEvent("keyup",r);return o.synthetic=!0,t.dispatchEvent(o),n.defaultPrevented||o.defaultPrevented}function $m(t){for(;t;){if(t&&(t.nodeType==9||t.nodeType==11&&t.host))return t;t=t.assignedSlot||t.parentNode}return null}function Pm(t,e){let i=e.focusNode,s=e.focusOffset;if(!i||e.anchorNode!=i||e.anchorOffset!=s)return!1;for(s=Math.min(s,Kt(i));;)if(s){if(i.nodeType!=1)return!1;let r=i.childNodes[s-1];r.contentEditable=="false"?s--:(i=r,s=Kt(i))}else{if(i==t)return!0;s=fi(i),i=i.parentNode}}function tf(t){return t instanceof Window?t.pageYOffset>Math.max(0,t.document.documentElement.scrollHeight-t.innerHeight-4):t.scrollTop>Math.max(1,t.scrollHeight-t.clientHeight-4)}function sf(t,e){for(let i=t,s=e;;){if(i.nodeType==3&&s>0)return{node:i,offset:s};if(i.nodeType==1&&s>0){if(i.contentEditable=="false")return null;i=i.childNodes[s-1],s=Kt(i)}else if(i.parentNode&&!wn(i))s=fi(i),i=i.parentNode;else return null}}function rf(t,e){for(let i=t,s=e;;){if(i.nodeType==3&&s<i.nodeValue.length)return{node:i,offset:s};if(i.nodeType==1&&s<i.childNodes.length){if(i.contentEditable=="false")return null;i=i.childNodes[s],s=0}else if(i.parentNode&&!wn(i))s=fi(i)+1,i=i.parentNode;else return null}}class ft{constructor(e,i,s=!0){this.node=e,this.offset=i,this.precise=s}static before(e,i){return new ft(e.parentNode,fi(e),i)}static after(e,i){return new ft(e.parentNode,fi(e)+1,i)}}var ie=(function(t){return t[t.LTR=0]="LTR",t[t.RTL=1]="RTL",t})(ie||(ie={}));const qi=ie.LTR,bl=ie.RTL;function nf(t){let e=[];for(let i=0;i<t.length;i++)e.push(1<<+t[i]);return e}const Tm=nf("88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008"),Mm=nf("4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333"),Ca=Object.create(null),kt=[];for(let t of["()","[]","{}"]){let e=t.charCodeAt(0),i=t.charCodeAt(1);Ca[e]=i,Ca[i]=-e}function of(t){return t<=247?Tm[t]:1424<=t&&t<=1524?2:1536<=t&&t<=1785?Mm[t-1536]:1774<=t&&t<=2220?4:8192<=t&&t<=8204?256:64336<=t&&t<=65023?4:1}const Em=/[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\ufb50-\ufdff]/;class Tt{get dir(){return this.level%2?bl:qi}constructor(e,i,s){this.from=e,this.to=i,this.level=s}side(e,i){return this.dir==i==e?this.to:this.from}forward(e,i){return e==(this.dir==i)}static find(e,i,s,r){let n=-1;for(let o=0;o<e.length;o++){let a=e[o];if(a.from<=i&&a.to>=i){if(a.level==s)return o;(n<0||(r!=0?r<0?a.from<i:a.to>i:e[n].level>a.level))&&(n=o)}}if(n<0)throw new RangeError("Index out of range");return n}}function af(t,e){if(t.length!=e.length)return!1;for(let i=0;i<t.length;i++){let s=t[i],r=e[i];if(s.from!=r.from||s.to!=r.to||s.direction!=r.direction||!af(s.inner,r.inner))return!1}return!0}const te=[];function Dm(t,e,i,s,r){for(let n=0;n<=s.length;n++){let o=n?s[n-1].to:e,a=n<s.length?s[n].from:i,l=n?256:r;for(let c=o,h=l,d=l;c<a;c++){let f=of(t.charCodeAt(c));f==512?f=h:f==8&&d==4&&(f=16),te[c]=f==4?2:f,f&7&&(d=f),h=f}for(let c=o,h=l,d=l;c<a;c++){let f=te[c];if(f==128)c<a-1&&h==te[c+1]&&h&24?f=te[c]=h:te[c]=256;else if(f==64){let u=c+1;for(;u<a&&te[u]==64;)u++;let p=c&&h==8||u<i&&te[u]==8?d==1?1:8:256;for(let m=c;m<u;m++)te[m]=p;c=u-1}else f==8&&d==1&&(te[c]=1);h=f,f&7&&(d=f)}}}function _m(t,e,i,s,r){let n=r==1?2:1;for(let o=0,a=0,l=0;o<=s.length;o++){let c=o?s[o-1].to:e,h=o<s.length?s[o].from:i;for(let d=c,f,u,p;d<h;d++)if(u=Ca[f=t.charCodeAt(d)])if(u<0){for(let m=a-3;m>=0;m-=3)if(kt[m+1]==-u){let b=kt[m+2],x=b&2?r:b&4?b&1?n:r:0;x&&(te[d]=te[kt[m]]=x),a=m;break}}else{if(kt.length==189)break;kt[a++]=d,kt[a++]=f,kt[a++]=l}else if((p=te[d])==2||p==1){let m=p==r;l=m?0:1;for(let b=a-3;b>=0;b-=3){let x=kt[b+2];if(x&2)break;if(m)kt[b+2]|=2;else{if(x&4)break;kt[b+2]|=4}}}}}function Bm(t,e,i,s){for(let r=0,n=s;r<=i.length;r++){let o=r?i[r-1].to:t,a=r<i.length?i[r].from:e;for(let l=o;l<a;){let c=te[l];if(c==256){let h=l+1;for(;;)if(h==a){if(r==i.length)break;h=i[r++].to,a=r<i.length?i[r].from:e}else if(te[h]==256)h++;else break;let d=n==1,f=(h<e?te[h]:s)==1,u=d==f?d?1:2:s;for(let p=h,m=r,b=m?i[m-1].to:t;p>l;)p==b&&(p=i[--m].from,b=m?i[m-1].to:t),te[--p]=u;l=h}else n=c,l++}}}function Oa(t,e,i,s,r,n,o){let a=s%2?2:1;if(s%2==r%2)for(let l=e,c=0;l<i;){let h=!0,d=!1;if(c==n.length||l<n[c].from){let m=te[l];m!=a&&(h=!1,d=m==16)}let f=!h&&a==1?[]:null,u=h?s:s+1,p=l;e:for(;;)if(c<n.length&&p==n[c].from){if(d)break e;let m=n[c];if(!h)for(let b=m.to,x=c+1;;){if(b==i)break e;if(x<n.length&&n[x].from==b)b=n[x++].to;else{if(te[b]==a)break e;break}}if(c++,f)f.push(m);else{m.from>l&&o.push(new Tt(l,m.from,u));let b=m.direction==qi!=!(u%2);Aa(t,b?s+1:s,r,m.inner,m.from,m.to,o),l=m.to}p=m.to}else{if(p==i||(h?te[p]!=a:te[p]==a))break;p++}f?Oa(t,l,p,s+1,r,f,o):l<p&&o.push(new Tt(l,p,u)),l=p}else for(let l=i,c=n.length;l>e;){let h=!0,d=!1;if(!c||l>n[c-1].to){let m=te[l-1];m!=a&&(h=!1,d=m==16)}let f=!h&&a==1?[]:null,u=h?s:s+1,p=l;e:for(;;)if(c&&p==n[c-1].to){if(d)break e;let m=n[--c];if(!h)for(let b=m.from,x=c;;){if(b==e)break e;if(x&&n[x-1].to==b)b=n[--x].from;else{if(te[b-1]==a)break e;break}}if(f)f.push(m);else{m.to<l&&o.push(new Tt(m.to,l,u));let b=m.direction==qi!=!(u%2);Aa(t,b?s+1:s,r,m.inner,m.from,m.to,o),l=m.from}p=m.from}else{if(p==e||(h?te[p-1]!=a:te[p-1]==a))break;p--}f?Oa(t,p,l,s+1,r,f,o):p<l&&o.push(new Tt(p,l,u)),l=p}}function Aa(t,e,i,s,r,n,o){let a=e%2?2:1;Dm(t,r,n,s,a),_m(t,r,n,s,a),Bm(r,n,s,a),Oa(t,r,n,e,i,s,o)}function Rm(t,e,i){if(!t)return[new Tt(0,0,e==bl?1:0)];if(e==qi&&!i.length&&!Em.test(t))return lf(t.length);if(i.length)for(;t.length>te.length;)te[te.length]=256;let s=[],r=e==qi?0:1;return Aa(t,r,r,i,0,t.length,s),s}function lf(t){return[new Tt(0,t,0)]}let cf="";function Lm(t,e,i,s,r){var n;let o=s.head-t.from,a=Tt.find(e,o,(n=s.bidiLevel)!==null&&n!==void 0?n:-1,s.assoc),l=e[a],c=l.side(r,i);if(o==c){let f=a+=r?1:-1;if(f<0||f>=e.length)return null;l=e[a=f],o=l.side(!r,i),c=l.side(r,i)}let h=Ce(t.text,o,l.forward(r,i));(h<l.from||h>l.to)&&(h=c),cf=t.text.slice(Math.min(o,h),Math.max(o,h));let d=a==(r?e.length-1:0)?null:e[a+(r?1:-1)];return d&&h==c&&d.level+(r?0:1)<l.level?C.cursor(d.side(!r,i)+t.from,d.forward(r,i)?1:-1,d.level):C.cursor(h+t.from,l.forward(r,i)?-1:1,l.level)}function Im(t,e,i){for(let s=e;s<i;s++){let r=of(t.charCodeAt(s));if(r==1)return qi;if(r==2||r==4)return bl}return qi}const hf=_.define(),df=_.define(),ff=_.define(),uf=_.define(),$a=_.define(),pf=_.define(),gf=_.define(),vl=_.define(),yl=_.define(),mf=_.define({combine:t=>t.some(e=>e)}),bf=_.define({combine:t=>t.some(e=>e)}),vf=_.define();class hs{constructor(e,i,s,r,n,o=!1){this.range=e,this.y=i,this.x=s,this.yMargin=r,this.xMargin=n,this.isSnapshot=o}map(e){return e.empty?this:new hs(this.range.map(e),this.y,this.x,this.yMargin,this.xMargin,this.isSnapshot)}clip(e){return this.range.to<=e.doc.length?this:new hs(C.cursor(e.doc.length),this.y,this.x,this.yMargin,this.xMargin,this.isSnapshot)}}const Rr=H.define({map:(t,e)=>t.map(e)}),yf=H.define();function Ue(t,e,i){let s=t.facet(uf);s.length?s[0](e):window.onerror&&window.onerror(String(e),i,void 0,void 0,e)||(i?console.error(i+":",e):console.error(e))}const qt=_.define({combine:t=>t.length?t[0]:!0});let Fm=0;const ts=_.define({combine(t){return t.filter((e,i)=>{for(let s=0;s<i;s++)if(t[s].plugin==e.plugin)return!1;return!0})}});class me{constructor(e,i,s,r,n){this.id=e,this.create=i,this.domEventHandlers=s,this.domEventObservers=r,this.baseExtensions=n(this),this.extension=this.baseExtensions.concat(ts.of({plugin:this,arg:void 0}))}of(e){return this.baseExtensions.concat(ts.of({plugin:this,arg:e}))}static define(e,i){const{eventHandlers:s,eventObservers:r,provide:n,decorations:o}=i||{};return new me(Fm++,e,s,r,a=>{let l=[];return o&&l.push(eo.of(c=>{let h=c.plugin(a);return h?o(h):N.none})),n&&l.push(n(a)),l})}static fromClass(e,i){return me.define((s,r)=>new e(s,r),i)}}class Ao{constructor(e){this.spec=e,this.mustUpdate=null,this.value=null}get plugin(){return this.spec&&this.spec.plugin}update(e){if(this.value){if(this.mustUpdate){let i=this.mustUpdate;if(this.mustUpdate=null,this.value.update)try{this.value.update(i)}catch(s){if(Ue(i.state,s,"CodeMirror plugin crashed"),this.value.destroy)try{this.value.destroy()}catch{}this.deactivate()}}}else if(this.spec)try{this.value=this.spec.plugin.create(e,this.spec.arg)}catch(i){Ue(e.state,i,"CodeMirror plugin crashed"),this.deactivate()}return this}destroy(e){var i;if(!((i=this.value)===null||i===void 0)&&i.destroy)try{this.value.destroy()}catch(s){Ue(e.state,s,"CodeMirror plugin crashed")}}deactivate(){this.spec=this.value=null}}const xf=_.define(),xl=_.define(),eo=_.define(),wf=_.define(),wl=_.define(),Or=_.define(),kf=_.define();function Dc(t,e){let i=t.state.facet(kf);if(!i.length)return i;let s=i.map(n=>n instanceof Function?n(t):n),r=[];return V.spans(s,e.from,e.to,{point(){},span(n,o,a,l){let c=n-e.from,h=o-e.from,d=r;for(let f=a.length-1;f>=0;f--,l--){let u=a[f].spec.bidiIsolate,p;if(u==null&&(u=Im(e.text,c,h)),l>0&&d.length&&(p=d[d.length-1]).to==c&&p.direction==u)p.to=h,d=p.inner;else{let m={from:c,to:h,direction:u,inner:[]};d.push(m),d=m.inner}}}}),r}const Sf=_.define();function kl(t){let e=0,i=0,s=0,r=0;for(let n of t.state.facet(Sf)){let o=n(t);o&&(o.left!=null&&(e=Math.max(e,o.left)),o.right!=null&&(i=Math.max(i,o.right)),o.top!=null&&(s=Math.max(s,o.top)),o.bottom!=null&&(r=Math.max(r,o.bottom)))}return{left:e,right:i,top:s,bottom:r}}const Fs=_.define();class st{constructor(e,i,s,r){this.fromA=e,this.toA=i,this.fromB=s,this.toB=r}join(e){return new st(Math.min(this.fromA,e.fromA),Math.max(this.toA,e.toA),Math.min(this.fromB,e.fromB),Math.max(this.toB,e.toB))}addToSet(e){let i=e.length,s=this;for(;i>0;i--){let r=e[i-1];if(!(r.fromA>s.toA)){if(r.toA<s.fromA)break;s=s.join(r),e.splice(i-1,1)}}return e.splice(i,0,s),e}static extendWithRanges(e,i){if(i.length==0)return e;let s=[];for(let r=0,n=0,o=0;;){let a=r<e.length?e[r].fromB:1e9,l=n<i.length?i[n]:1e9,c=Math.min(a,l);if(c==1e9)break;let h=c+o,d=c,f=h;for(;;)if(n<i.length&&i[n]<=d){let u=i[n+1];n+=2,d=Math.max(d,u);for(let p=r;p<e.length&&e[p].fromB<=d;p++)o=e[p].toA-e[p].toB;f=Math.max(f,u+o)}else if(r<e.length&&e[r].fromB<=d){let u=e[r++];d=Math.max(d,u.toB),f=Math.max(f,u.toA),o=u.toA-u.toB}else break;s.push(new st(h,f,c,d))}return s}}class Sn{constructor(e,i,s){this.view=e,this.state=i,this.transactions=s,this.flags=0,this.startState=e.state,this.changes=ve.empty(this.startState.doc.length);for(let n of s)this.changes=this.changes.compose(n.changes);let r=[];this.changes.iterChangedRanges((n,o,a,l)=>r.push(new st(n,o,a,l))),this.changedRanges=r}static create(e,i,s){return new Sn(e,i,s)}get viewportChanged(){return(this.flags&4)>0}get viewportMoved(){return(this.flags&8)>0}get heightChanged(){return(this.flags&2)>0}get geometryChanged(){return this.docChanged||(this.flags&18)>0}get focusChanged(){return(this.flags&1)>0}get docChanged(){return!this.changes.empty}get selectionSet(){return this.transactions.some(e=>e.selection)}get empty(){return this.flags==0&&this.transactions.length==0}}const Nm=[];class ue{constructor(e,i,s=0){this.dom=e,this.length=i,this.flags=s,this.parent=null,e.cmTile=this}get breakAfter(){return this.flags&1}get children(){return Nm}isWidget(){return!1}get isHidden(){return!1}isComposite(){return!1}isLine(){return!1}isText(){return!1}isBlock(){return!1}get domAttrs(){return null}sync(e){if(this.flags|=2,this.flags&4){this.flags&=-5;let i=this.domAttrs;i&&wm(this.dom,i)}}toString(){return this.constructor.name+(this.children.length?`(${this.children})`:"")+(this.breakAfter?"#":"")}destroy(){this.parent=null}setDOM(e){this.dom=e,e.cmTile=this}get posAtStart(){return this.parent?this.parent.posBefore(this):0}get posAtEnd(){return this.posAtStart+this.length}posBefore(e,i=this.posAtStart){let s=i;for(let r of this.children){if(r==e)return s;s+=r.length+r.breakAfter}throw new RangeError("Invalid child in posBefore")}posAfter(e){return this.posBefore(e)+e.length}covers(e){return!0}coordsIn(e,i){return null}domPosFor(e,i){let s=fi(this.dom),r=this.length?e>0:i>0;return new ft(this.parent.dom,s+(r?1:0),e==0||e==this.length)}markDirty(e){this.flags&=-3,e&&(this.flags|=4),this.parent&&this.parent.flags&2&&this.parent.markDirty(!1)}get overrideDOMText(){return null}get root(){for(let e=this;e;e=e.parent)if(e instanceof io)return e;return null}static get(e){return e.cmTile}}class to extends ue{constructor(e){super(e,0),this._children=[]}isComposite(){return!0}get children(){return this._children}get lastChild(){return this.children.length?this.children[this.children.length-1]:null}append(e){this.children.push(e),e.parent=this}sync(e){if(this.flags&2)return;super.sync(e);let i=this.dom,s=null,r,n=(e==null?void 0:e.node)==i?e:null,o=0;for(let a of this.children){if(a.sync(e),o+=a.length+a.breakAfter,r=s?s.nextSibling:i.firstChild,n&&r!=a.dom&&(n.written=!0),a.dom.parentNode==i)for(;r&&r!=a.dom;)r=_c(r);else i.insertBefore(a.dom,r);s=a.dom}for(r=s?s.nextSibling:i.firstChild,n&&r&&(n.written=!0);r;)r=_c(r);this.length=o}}function _c(t){let e=t.nextSibling;return t.parentNode.removeChild(t),e}class io extends to{constructor(e,i){super(i),this.view=e}owns(e){for(;e;e=e.parent)if(e==this)return!0;return!1}isBlock(){return!0}nearest(e){for(;;){if(!e)return null;let i=ue.get(e);if(i&&this.owns(i))return i;e=e.parentNode}}blockTiles(e){for(let i=[],s=this,r=0,n=0;;)if(r==s.children.length){if(!i.length)return;s=s.parent,s.breakAfter&&n++,r=i.pop()}else{let o=s.children[r++];if(o instanceof Qt)i.push(r),s=o,r=0;else{let a=n+o.length,l=e(o,n);if(l!==void 0)return l;n=a+o.breakAfter}}}resolveBlock(e,i){let s,r=-1,n,o=-1;if(this.blockTiles((a,l)=>{let c=l+a.length;if(e>=l&&e<=c){if(a.isWidget()&&i>=-1&&i<=1){if(a.flags&32)return!0;a.flags&16&&(s=void 0)}(l<e||e==c&&(i<-1?a.length:a.covers(1)))&&(!s||!a.isWidget()&&s.isWidget())&&(s=a,r=e-l),(c>e||e==l&&(i>1?a.length:a.covers(-1)))&&(!n||!a.isWidget()&&n.isWidget())&&(n=a,o=e-l)}}),!s&&!n)throw new Error("No tile at position "+e);return s&&i<0||!n?{tile:s,offset:r}:{tile:n,offset:o}}}class Qt extends to{constructor(e,i){super(e),this.wrapper=i}isBlock(){return!0}covers(e){return this.children.length?e<0?this.children[0].covers(-1):this.lastChild.covers(1):!1}get domAttrs(){return this.wrapper.attributes}static of(e,i){let s=new Qt(i||document.createElement(e.tagName),e);return i||(s.flags|=4),s}}class vs extends to{constructor(e,i){super(e),this.attrs=i}isLine(){return!0}static start(e,i,s){let r=new vs(i||document.createElement("div"),e);return(!i||!s)&&(r.flags|=4),r}get domAttrs(){return this.attrs}resolveInline(e,i,s){let r=null,n=-1,o=null,a=-1;function l(h,d){for(let f=0,u=0;f<h.children.length&&u<=d;f++){let p=h.children[f],m=u+p.length;m>=d&&(p.isComposite()?l(p,d-u):(!o||o.isHidden&&(i>0||s&&Hm(o,p)))&&(m>d||p.flags&32)?(o=p,a=d-u):(u<d||p.flags&16&&!p.isHidden)&&(r=p,n=d-u)),u=m}}l(this,e);let c=(i<0?r:o)||r||o;return c?{tile:c,offset:c==r?n:a}:null}coordsIn(e,i){let s=this.resolveInline(e,i,!0);return s?s.tile.coordsIn(Math.max(0,s.offset),i):zm(this)}domIn(e,i){let s=this.resolveInline(e,i);if(s){let{tile:r,offset:n}=s;if(this.dom.contains(r.dom))return r.isText()?new ft(r.dom,Math.min(r.dom.nodeValue.length,n)):r.domPosFor(n,r.flags&16?1:r.flags&32?-1:i);let o=s.tile.parent,a=!1;for(let l of o.children){if(a)return new ft(l.dom,0);l==s.tile&&(a=!0)}}return new ft(this.dom,0)}}function zm(t){let e=t.dom.lastChild;if(!e)return t.dom.getBoundingClientRect();let i=on(e);return i[i.length-1]||null}function Hm(t,e){let i=t.coordsIn(0,1),s=e.coordsIn(0,1);return i&&s&&s.top<i.bottom}class We extends to{constructor(e,i){super(e),this.mark=i}get domAttrs(){return this.mark.attrs}static of(e,i){let s=new We(i||document.createElement(e.tagName),e);return i||(s.flags|=4),s}}class Di extends ue{constructor(e,i){super(e,i.length),this.text=i}sync(e){this.flags&2||(super.sync(e),this.dom.nodeValue!=this.text&&(e&&e.node==this.dom&&(e.written=!0),this.dom.nodeValue=this.text))}isText(){return!0}toString(){return JSON.stringify(this.text)}coordsIn(e,i){let s=this.dom.nodeValue.length;e>s&&(e=s);let r=e,n=e,o=0;e==0&&i<0||e==s&&i>=0?D.chrome||D.gecko||(e?(r--,o=1):n<s&&(n++,o=-1)):i<0?r--:n<s&&n++;let a=lr(this.dom,r,n).getClientRects();if(!a.length)return null;let l=a[(o?o<0:i>=0)?0:a.length-1];return D.safari&&!o&&l.width==0&&(l=Array.prototype.find.call(a,c=>c.width)||l),o?kn(l,o<0):l||null}static of(e,i){let s=new Di(i||document.createTextNode(e),e);return i||(s.flags|=2),s}}class Vi extends ue{constructor(e,i,s,r){super(e,i,r),this.widget=s}isWidget(){return!0}get isHidden(){return this.widget.isHidden}covers(e){return this.flags&48?!1:(this.flags&(e<0?64:128))>0}coordsIn(e,i){return this.coordsInWidget(e,i,!1)}coordsInWidget(e,i,s){let r=this.widget.coordsAt(this.dom,e,i);if(r)return r;if(s)return kn(this.dom.getBoundingClientRect(),this.length?e==0:i<=0);{let n=this.dom.getClientRects(),o=null;if(!n.length)return null;let a=this.flags&16?!0:this.flags&32?!1:e>0;for(let l=a?n.length-1:0;o=n[l],!(e>0?l==0:l==n.length-1||o.top<o.bottom);l+=a?-1:1);return kn(o,!a)}}get overrideDOMText(){if(!this.length)return X.empty;let{root:e}=this;if(!e)return X.empty;let i=this.posAtStart;return e.view.state.doc.slice(i,i+this.length)}destroy(){super.destroy(),this.widget.destroy(this.dom)}static of(e,i,s,r,n){return n||(n=e.toDOM(i),e.editable||(n.contentEditable="false")),new Vi(n,s,e,r)}}class Cn extends ue{constructor(e){let i=document.createElement("img");i.className="cm-widgetBuffer",i.setAttribute("aria-hidden","true"),super(i,0,e)}get isHidden(){return!0}get overrideDOMText(){return X.empty}coordsIn(e){return this.dom.getBoundingClientRect()}}class Wm{constructor(e){this.index=0,this.beforeBreak=!1,this.parents=[],this.tile=e}advance(e,i,s){let{tile:r,index:n,beforeBreak:o,parents:a}=this;for(;e||i>0;)if(r.isComposite())if(o){if(!e)break;s&&s.break(),e--,o=!1}else if(n==r.children.length){if(!e&&!a.length)break;s&&s.leave(r),o=!!r.breakAfter,{tile:r,index:n}=a.pop(),n++}else{let l=r.children[n],c=l.breakAfter;(i>0?l.length<=e:l.length<e)&&(!s||s.skip(l,0,l.length)!==!1||!l.isComposite)?(o=!!c,n++,e-=l.length):(a.push({tile:r,index:n}),r=l,n=0,s&&l.isComposite()&&s.enter(l))}else if(n==r.length)o=!!r.breakAfter,{tile:r,index:n}=a.pop(),n++;else if(e){let l=Math.min(e,r.length-n);s&&s.skip(r,n,n+l),e-=l,n+=l}else break;return this.tile=r,this.index=n,this.beforeBreak=o,this}get root(){return this.parents.length?this.parents[0].tile:this.tile}}class Um{constructor(e,i,s,r){this.from=e,this.to=i,this.wrapper=s,this.rank=r}}class qm{constructor(e,i,s){this.cache=e,this.root=i,this.blockWrappers=s,this.curLine=null,this.lastBlock=null,this.afterWidget=null,this.pos=0,this.wrappers=[],this.wrapperPos=0}addText(e,i,s,r){var n;this.flushBuffer();let o=this.ensureMarks(i,s),a=o.lastChild;if(a&&a.isText()&&!(a.flags&8)&&a.length+e.length<512){this.cache.reused.set(a,2);let l=o.children[o.children.length-1]=new Di(a.dom,a.text+e);l.parent=o}else o.append(r||Di.of(e,(n=this.cache.find(Di))===null||n===void 0?void 0:n.dom));this.pos+=e.length,this.afterWidget=null}addComposition(e,i){let s=this.curLine;s.dom!=i.line.dom&&(s.setDOM(this.cache.reused.has(i.line)?$o(i.line.dom):i.line.dom),this.cache.reused.set(i.line,2));let r=s;for(let a=i.marks.length-1;a>=0;a--){let l=i.marks[a],c=r.lastChild;if(c instanceof We&&c.mark.eq(l.mark))c.dom!=l.dom&&c.setDOM($o(l.dom)),r=c;else{if(this.cache.reused.get(l)){let d=ue.get(l.dom);d&&d.setDOM($o(l.dom))}let h=We.of(l.mark,l.dom);r.append(h),r=h}this.cache.reused.set(l,2)}let n=ue.get(e.text);n&&this.cache.reused.set(n,2);let o=new Di(e.text,e.text.nodeValue);o.flags|=8,r.append(o)}addInlineWidget(e,i,s){let r=this.afterWidget&&e.flags&48&&(this.afterWidget.flags&48)==(e.flags&48);r||this.flushBuffer();let n=this.ensureMarks(i,s);!r&&!(e.flags&16)&&n.append(this.getBuffer(1)),n.append(e),this.pos+=e.length,this.afterWidget=e}addMark(e,i,s){this.flushBuffer(),this.ensureMarks(i,s).append(e),this.pos+=e.length,this.afterWidget=null}addBlockWidget(e){this.getBlockPos().append(e),this.pos+=e.length,this.lastBlock=e,this.endLine()}continueWidget(e){let i=this.afterWidget||this.lastBlock;i.length+=e,this.pos+=e}addLineStart(e,i){var s;e||(e=Cf);let r=vs.start(e,i||((s=this.cache.find(vs))===null||s===void 0?void 0:s.dom),!!i);this.getBlockPos().append(this.lastBlock=this.curLine=r)}addLine(e){this.getBlockPos().append(e),this.pos+=e.length,this.lastBlock=e,this.endLine()}addBreak(){this.lastBlock.flags|=1,this.endLine(),this.pos++}addLineStartIfNotCovered(e){this.blockPosCovered()||this.addLineStart(e)}ensureLine(e){this.curLine||this.addLineStart(e)}ensureMarks(e,i){var s;let r=this.curLine;for(let n=e.length-1;n>=0;n--){let o=e[n],a;if(i>0&&(a=r.lastChild)&&a instanceof We&&a.mark.eq(o))r=a,i--;else{let l=We.of(o,(s=this.cache.find(We,c=>c.mark.eq(o)))===null||s===void 0?void 0:s.dom);r.append(l),r=l,i=0}}return r}endLine(){if(this.curLine){this.flushBuffer();let e=this.curLine.lastChild;(!e||!Bc(this.curLine,!1)||e.dom.nodeName!="BR"&&e.isWidget()&&!(D.ios&&Bc(this.curLine,!0)))&&this.curLine.append(this.cache.findWidget(Po,0,32)||new Vi(Po.toDOM(),0,Po,32)),this.curLine=this.afterWidget=null}}updateBlockWrappers(){this.wrapperPos>this.pos+1e4&&(this.blockWrappers.goto(this.pos),this.wrappers.length=0);for(let e=this.wrappers.length-1;e>=0;e--)this.wrappers[e].to<this.pos&&this.wrappers.splice(e,1);for(let e=this.blockWrappers;e.value&&e.from<=this.pos;e.next())if(e.to>=this.pos){let i=new Um(e.from,e.to,e.value,e.rank),s=this.wrappers.length;for(;s>0&&(this.wrappers[s-1].rank-i.rank||this.wrappers[s-1].to-i.to)<0;)s--;this.wrappers.splice(s,0,i)}this.wrapperPos=this.pos}getBlockPos(){var e;this.updateBlockWrappers();let i=this.root;for(let s of this.wrappers){let r=i.lastChild;if(s.from<this.pos&&r instanceof Qt&&r.wrapper.eq(s.wrapper))i=r;else{let n=Qt.of(s.wrapper,(e=this.cache.find(Qt,o=>o.wrapper.eq(s.wrapper)))===null||e===void 0?void 0:e.dom);i.append(n),i=n}}return i}blockPosCovered(){let e=this.lastBlock;return e!=null&&!e.breakAfter&&(!e.isWidget()||(e.flags&160)>0)}getBuffer(e){let i=2|(e<0?16:32),s=this.cache.find(Cn,void 0,1);return s&&(s.flags=i),s||new Cn(i)}flushBuffer(){this.afterWidget&&!(this.afterWidget.flags&32)&&(this.afterWidget.parent.append(this.getBuffer(-1)),this.afterWidget=null)}}class Vm{constructor(e){this.skipCount=0,this.text="",this.textOff=0,this.cursor=e.iter()}skip(e){this.textOff+e<=this.text.length?this.textOff+=e:(this.skipCount+=e-(this.text.length-this.textOff),this.text="",this.textOff=0)}next(e){if(this.textOff==this.text.length){let{value:r,lineBreak:n,done:o}=this.cursor.next(this.skipCount);if(this.skipCount=0,o)throw new Error("Ran out of text content when drawing inline views");this.text=r;let a=this.textOff=Math.min(e,r.length);return n?null:r.slice(0,a)}let i=Math.min(this.text.length,this.textOff+e),s=this.text.slice(this.textOff,i);return this.textOff=i,s}}const On=[Vi,vs,Di,We,Cn,Qt,io];for(let t=0;t<On.length;t++)On[t].bucket=t;class Qm{constructor(e){this.view=e,this.buckets=On.map(()=>[]),this.index=On.map(()=>0),this.reused=new Map}add(e){let i=e.constructor.bucket,s=this.buckets[i];s.length<6?s.push(e):s[this.index[i]=(this.index[i]+1)%6]=e}find(e,i,s=2){let r=e.bucket,n=this.buckets[r],o=this.index[r];for(let a=n.length-1;a>=0;a--){let l=(a+o)%n.length,c=n[l];if((!i||i(c))&&!this.reused.has(c))return n.splice(l,1),l<o&&this.index[r]--,this.reused.set(c,s),c}return null}findWidget(e,i,s){let r=this.buckets[0];if(r.length)for(let n=0,o=0;;n++){if(n==r.length){if(o)return null;o=1,n=0}let a=r[n];if(!this.reused.has(a)&&(o==0?a.widget.compare(e):a.widget.constructor==e.constructor&&e.updateDOM(a.dom,this.view,a.widget)))return r.splice(n,1),n<this.index[0]&&this.index[0]--,a.widget==e&&a.length==i&&(a.flags&497)==s?(this.reused.set(a,1),a):(this.reused.set(a,2),new Vi(a.dom,i,e,a.flags&-498|s))}}reuse(e){return this.reused.set(e,1),e}maybeReuse(e,i=2){if(!this.reused.has(e))return this.reused.set(e,i),e.dom}clear(){for(let e=0;e<this.buckets.length;e++)this.buckets[e].length=this.index[e]=0}}class jm{constructor(e,i,s,r,n){this.view=e,this.decorations=r,this.disallowBlockEffectsFor=n,this.openWidget=!1,this.openMarks=0,this.cache=new Qm(e),this.text=new Vm(e.state.doc),this.builder=new qm(this.cache,new io(e,e.contentDOM),V.iter(s)),this.cache.reused.set(i,2),this.old=new Wm(i),this.reuseWalker={skip:(o,a,l)=>{if(this.cache.add(o),o.isComposite())return!1},enter:o=>this.cache.add(o),leave:()=>{},break:()=>{}}}run(e,i){let s=i&&this.getCompositionContext(i.text);for(let r=0,n=0,o=0;;){let a=o<e.length?e[o++]:null,l=a?a.fromA:this.old.root.length;if(l>r){let c=l-r;this.preserve(c,!o,!a),r=l,n+=c}if(!a)break;i&&a.fromA<=i.range.fromA&&a.toA>=i.range.toA?(this.forward(a.fromA,i.range.fromA,i.range.fromA<i.range.toA?1:-1),this.emit(n,i.range.fromB),this.cache.clear(),this.builder.addComposition(i,s),this.text.skip(i.range.toB-i.range.fromB),this.forward(i.range.fromA,a.toA),this.emit(i.range.toB,a.toB)):(this.forward(a.fromA,a.toA),this.emit(n,a.toB)),n=a.toB,r=a.toA}return this.builder.curLine&&this.builder.endLine(),this.builder.root}preserve(e,i,s){let r=Jm(this.old),n=this.openMarks;this.old.advance(e,s?1:-1,{skip:(o,a,l)=>{if(o.isWidget())if(this.openWidget)this.builder.continueWidget(l-a);else{let c=l>0||a<o.length?Vi.of(o.widget,this.view,l-a,o.flags&496,this.cache.maybeReuse(o)):this.cache.reuse(o);c.flags&256?(c.flags&=-2,this.builder.addBlockWidget(c)):(this.builder.ensureLine(null),this.builder.addInlineWidget(c,r,n),n=r.length)}else if(o.isText())this.builder.ensureLine(null),!a&&l==o.length&&!this.cache.reused.has(o)?this.builder.addText(o.text,r,n,this.cache.reuse(o)):(this.cache.add(o),this.builder.addText(o.text.slice(a,l),r,n)),n=r.length;else if(o.isLine())o.flags&=-2,this.cache.reused.set(o,1),this.builder.addLine(o);else if(o instanceof Cn)this.cache.add(o);else if(o instanceof We)this.builder.ensureLine(null),this.builder.addMark(o,r,n),this.cache.reused.set(o,1),n=r.length;else return!1;this.openWidget=!1},enter:o=>{o.isLine()?this.builder.addLineStart(o.attrs,this.cache.maybeReuse(o)):(this.cache.add(o),o instanceof We&&r.unshift(o.mark)),this.openWidget=!1},leave:o=>{o.isLine()?r.length&&(r.length=n=0):o instanceof We&&(r.shift(),n=Math.min(n,r.length))},break:()=>{this.builder.addBreak(),this.openWidget=!1}}),this.text.skip(e)}emit(e,i){let s=null,r=this.builder,n=0,o=V.spans(this.decorations,e,i,{point:(a,l,c,h,d,f)=>{if(c instanceof Ui){if(this.disallowBlockEffectsFor[f]){if(c.block)throw new RangeError("Block decorations may not be specified via plugins");if(l>this.view.state.doc.lineAt(a).to)throw new RangeError("Decorations that replace line breaks may not be specified via plugins")}if(n=h.length,d>h.length)r.continueWidget(l-a);else{let u=c.widget||(c.block?ys.block:ys.inline),p=Km(c),m=this.cache.findWidget(u,l-a,p)||Vi.of(u,this.view,l-a,p);c.block?(c.startSide>0&&r.addLineStartIfNotCovered(s),r.addBlockWidget(m)):(r.ensureLine(s),r.addInlineWidget(m,h,d))}s=null}else s=Xm(s,c);l>a&&this.text.skip(l-a)},span:(a,l,c,h)=>{for(let d=a;d<l;){let f=this.text.next(Math.min(512,l-d));f==null?(r.addLineStartIfNotCovered(s),r.addBreak(),d++):(r.ensureLine(s),r.addText(f,c,d==a?h:c.length),d+=f.length),s=null}}});r.addLineStartIfNotCovered(s),this.openWidget=o>n,this.openMarks=o}forward(e,i,s=1){i-e<=10?this.old.advance(i-e,s,this.reuseWalker):(this.old.advance(5,-1,this.reuseWalker),this.old.advance(i-e-10,-1),this.old.advance(5,s,this.reuseWalker))}getCompositionContext(e){let i=[],s=null;for(let r=e.parentNode;;r=r.parentNode){let n=ue.get(r);if(r==this.view.contentDOM)break;n instanceof We?i.push(n):n!=null&&n.isLine()?s=n:n instanceof Qt||(r.nodeName=="DIV"&&!s&&r!=this.view.contentDOM?s=new vs(r,Cf):s||i.push(We.of(new Sr({tagName:r.nodeName.toLowerCase(),attributes:km(r)}),r)))}return{line:s,marks:i}}}function Bc(t,e){let i=s=>{for(let r of s.children)if((e?r.isText():r.length)||i(r))return!0;return!1};return i(t)}function Km(t){let e=t.isReplace?(t.startSide<0?64:0)|(t.endSide>0?128:0):t.startSide>0?32:16;return t.block&&(e|=256),e}const Cf={class:"cm-line"};function Xm(t,e){let i=e.spec.attributes,s=e.spec.class;return!i&&!s||(t||(t={class:"cm-line"}),i&&gl(i,t),s&&(t.class+=" "+s)),t}function Jm(t){let e=[];for(let i=t.parents.length;i>1;i--){let s=i==t.parents.length?t.tile:t.parents[i].tile;s instanceof We&&e.push(s.mark)}return e}function $o(t){let e=ue.get(t);return e&&e.setDOM(t.cloneNode()),t}class ys extends Gt{constructor(e){super(),this.tag=e}eq(e){return e.tag==this.tag}toDOM(){return document.createElement(this.tag)}updateDOM(e){return e.nodeName.toLowerCase()==this.tag}get isHidden(){return!0}}ys.inline=new ys("span");ys.block=new ys("div");const Po=new class extends Gt{toDOM(){return document.createElement("br")}get isHidden(){return!0}get editable(){return!0}};class Rc{constructor(e){this.view=e,this.decorations=[],this.blockWrappers=[],this.dynamicDecorationMap=[!1],this.domChanged=null,this.hasComposition=null,this.editContextFormatting=N.none,this.lastCompositionAfterCursor=!1,this.minWidth=0,this.minWidthFrom=0,this.minWidthTo=0,this.impreciseAnchor=null,this.impreciseHead=null,this.forceSelection=!1,this.lastUpdate=Date.now(),this.updateDeco(),this.tile=new io(e,e.contentDOM),this.updateInner([new st(0,0,0,e.state.doc.length)],null)}update(e){var i;let s=e.changedRanges;this.minWidth>0&&s.length&&(s.every(({fromA:h,toA:d})=>d<this.minWidthFrom||h>this.minWidthTo)?(this.minWidthFrom=e.changes.mapPos(this.minWidthFrom,1),this.minWidthTo=e.changes.mapPos(this.minWidthTo,1)):this.minWidth=this.minWidthFrom=this.minWidthTo=0),this.updateEditContextFormatting(e);let r=-1;this.view.inputState.composing>=0&&!this.view.observer.editContext&&(!((i=this.domChanged)===null||i===void 0)&&i.newSel?r=this.domChanged.newSel.head:!nb(e.changes,this.hasComposition)&&!e.selectionSet&&(r=e.state.selection.main.head));let n=r>-1?Gm(this.view,e.changes,r):null;if(this.domChanged=null,this.hasComposition){let{from:h,to:d}=this.hasComposition;s=new st(h,d,e.changes.mapPos(h,-1),e.changes.mapPos(d,1)).addToSet(s.slice())}this.hasComposition=n?{from:n.range.fromB,to:n.range.toB}:null,(D.ie||D.chrome)&&!n&&e&&e.state.doc.lines!=e.startState.doc.lines&&(this.forceSelection=!0);let o=this.decorations,a=this.blockWrappers;this.updateDeco();let l=tb(o,this.decorations,e.changes);l.length&&(s=st.extendWithRanges(s,l));let c=sb(a,this.blockWrappers,e.changes);return c.length&&(s=st.extendWithRanges(s,c)),n&&!s.some(h=>h.fromA<=n.range.fromA&&h.toA>=n.range.toA)&&(s=n.range.addToSet(s.slice())),this.tile.flags&2&&s.length==0?!1:(this.updateInner(s,n),e.transactions.length&&(this.lastUpdate=Date.now()),!0)}updateInner(e,i){this.view.viewState.mustMeasureContent=!0;let{observer:s}=this.view;s.ignore(()=>{if(i||e.length){let o=this.tile,a=new jm(this.view,o,this.blockWrappers,this.decorations,this.dynamicDecorationMap);i&&ue.get(i.text)&&a.cache.reused.set(ue.get(i.text),2),this.tile=a.run(e,i),Pa(o,a.cache.reused)}this.tile.dom.style.height=this.view.viewState.contentHeight/this.view.scaleY+"px",this.tile.dom.style.flexBasis=this.minWidth?this.minWidth+"px":"";let n=D.chrome||D.ios?{node:s.selectionRange.focusNode,written:!1}:void 0;this.tile.sync(n),n&&(n.written||s.selectionRange.focusNode!=n.node||!this.tile.dom.contains(n.node))&&(this.forceSelection=!0),this.tile.dom.style.height=""});let r=[];if(this.view.viewport.from||this.view.viewport.to<this.view.state.doc.length)for(let n of this.tile.children)n.isWidget()&&n.widget instanceof To&&r.push(n.dom);s.updateGaps(r)}updateEditContextFormatting(e){this.editContextFormatting=this.editContextFormatting.map(e.changes);for(let i of e.transactions)for(let s of i.effects)s.is(yf)&&(this.editContextFormatting=s.value)}updateSelection(e=!1,i=!1){(e||!this.view.observer.selectionRange.focusNode)&&this.view.observer.readSelectionRange();let{dom:s}=this.tile,r=this.view.root.activeElement,n=r==s,o=!n&&!(this.view.state.facet(qt)||s.tabIndex>-1)&&Qs(s,this.view.observer.selectionRange)&&!(r&&s.contains(r));if(!(n||i||o))return;let a=this.forceSelection;this.forceSelection=!1;let l=this.view.state.selection.main,c,h;if(l.empty?h=c=this.inlineDOMNearPos(l.anchor,l.assoc||1):(h=this.inlineDOMNearPos(l.head,l.head==l.from?1:-1),c=this.inlineDOMNearPos(l.anchor,l.anchor==l.from?1:-1)),D.gecko&&l.empty&&!this.hasComposition&&Ym(c)){let f=document.createTextNode("");this.view.observer.ignore(()=>c.node.insertBefore(f,c.node.childNodes[c.offset]||null)),c=h=new ft(f,0),a=!0}let d=this.view.observer.selectionRange;(a||!d.focusNode||(!js(c.node,c.offset,d.anchorNode,d.anchorOffset)||!js(h.node,h.offset,d.focusNode,d.focusOffset))&&!this.suppressWidgetCursorChange(d,l))&&(this.view.observer.ignore(()=>{D.android&&D.chrome&&s.contains(d.focusNode)&&rb(d.focusNode,s)&&(s.blur(),s.focus({preventScroll:!0}));let f=ar(this.view.root);if(f)if(l.empty){if(D.gecko){let u=Zm(c.node,c.offset);if(u&&u!=3){let p=(u==1?sf:rf)(c.node,c.offset);p&&(c=new ft(p.node,p.offset))}}f.collapse(c.node,c.offset),l.bidiLevel!=null&&f.caretBidiLevel!==void 0&&(f.caretBidiLevel=l.bidiLevel)}else if(f.extend){f.collapse(c.node,c.offset);try{f.extend(h.node,h.offset)}catch{}}else{let u=document.createRange();l.anchor>l.head&&([c,h]=[h,c]),u.setEnd(h.node,h.offset),u.setStart(c.node,c.offset),f.removeAllRanges(),f.addRange(u)}o&&this.view.root.activeElement==s&&(s.blur(),r&&r.focus())}),this.view.observer.setSelectionRange(c,h)),this.impreciseAnchor=c.precise?null:new ft(d.anchorNode,d.anchorOffset),this.impreciseHead=h.precise?null:new ft(d.focusNode,d.focusOffset)}suppressWidgetCursorChange(e,i){return this.hasComposition&&i.empty&&js(e.focusNode,e.focusOffset,e.anchorNode,e.anchorOffset)&&this.posFromDOM(e.focusNode,e.focusOffset)==i.head}enforceCursorAssoc(){if(this.hasComposition)return;let{view:e}=this,i=e.state.selection.main,s=ar(e.root),{anchorNode:r,anchorOffset:n}=e.observer.selectionRange;if(!s||!i.empty||!i.assoc||!s.modify)return;let o=this.lineAt(i.head,i.assoc);if(!o)return;let a=o.posAtStart;if(i.head==a||i.head==a+o.length)return;let l=this.coordsAt(i.head,-1),c=this.coordsAt(i.head,1);if(!l||!c||l.bottom>c.top)return;let h=this.domAtPos(i.head+i.assoc,i.assoc);s.collapse(h.node,h.offset),s.modify("move",i.assoc<0?"forward":"backward","lineboundary"),e.observer.readSelectionRange();let d=e.observer.selectionRange;e.docView.posFromDOM(d.anchorNode,d.anchorOffset)!=i.from&&s.collapse(r,n)}posFromDOM(e,i){let s=this.tile.nearest(e);if(!s)return this.tile.dom.compareDocumentPosition(e)&2?0:this.view.state.doc.length;let r=s.posAtStart;if(s.isComposite()){let n;if(e==s.dom)n=s.dom.childNodes[i];else{let o=Kt(e)==0?0:i==0?-1:1;for(;;){let a=e.parentNode;if(a==s.dom)break;o==0&&a.firstChild!=a.lastChild&&(e==a.firstChild?o=-1:o=1),e=a}o<0?n=e:n=e.nextSibling}if(n==s.dom.firstChild)return r;for(;n&&!ue.get(n);)n=n.nextSibling;if(!n)return r+s.length;for(let o=0,a=r;;o++){let l=s.children[o];if(l.dom==n)return a;a+=l.length+l.breakAfter}}else return s.isText()?e==s.dom?r+i:r+(i?s.length:0):r}domAtPos(e,i){let{tile:s,offset:r}=this.tile.resolveBlock(e,i);return s.isWidget()?s.domPosFor(e,i):s.domIn(r,i)}inlineDOMNearPos(e,i){let s,r=-1,n=!1,o,a=-1,l=!1;return this.tile.blockTiles((c,h)=>{if(c.isWidget()){if(c.flags&32&&h>=e)return!0;c.flags&16&&(n=!0)}else{let d=h+c.length;if(h<=e&&(s=c,r=e-h,n=d<e),d>=e&&!o&&(o=c,a=e-h,l=h>e),h>e&&o)return!0}}),!s&&!o?this.domAtPos(e,i):(n&&o?s=null:l&&s&&(o=null),s&&i<0||!o?s.domIn(r,i):o.domIn(a,i))}coordsAt(e,i){let{tile:s,offset:r}=this.tile.resolveBlock(e,i);return s.isWidget()?s.widget instanceof To?null:s.coordsInWidget(r,i,!0):s.coordsIn(r,i)}lineAt(e,i){let{tile:s}=this.tile.resolveBlock(e,i);return s.isLine()?s:null}coordsForChar(e){let{tile:i,offset:s}=this.tile.resolveBlock(e,1);if(!i.isLine())return null;function r(n,o){if(n.isComposite())for(let a of n.children){if(a.length>=o){let l=r(a,o);if(l)return l}if(o-=a.length,o<0)break}else if(n.isText()&&o<n.length){let a=Ce(n.text,o);if(a==o)return null;let l=lr(n.dom,o,a).getClientRects();for(let c=0;c<l.length;c++){let h=l[c];if(c==l.length-1||h.top<h.bottom&&h.left<h.right)return h}}return null}return r(i,s)}measureVisibleLineHeights(e){let i=[],{from:s,to:r}=e,n=this.view.contentDOM.clientWidth,o=n>Math.max(this.view.scrollDOM.clientWidth,this.minWidth)+1,a=-1,l=this.view.textDirection==ie.LTR,c=0,h=(d,f,u)=>{for(let p=0;p<d.children.length&&!(f>r);p++){let m=d.children[p],b=f+m.length,x=m.dom.getBoundingClientRect(),{height:k}=x;if(u&&!p&&(c+=x.top-u.top),m instanceof Qt)b>s&&h(m,f,x);else if(f>=s&&(c>0&&i.push(-c),i.push(k+c),c=0,o)){let O=m.dom.lastChild,R=O?on(O):[];if(R.length){let A=R[R.length-1],$=l?A.right-x.left:x.right-A.left;$>a&&(a=$,this.minWidth=n,this.minWidthFrom=f,this.minWidthTo=b)}}u&&p==d.children.length-1&&(c+=u.bottom-x.bottom),f=b+m.breakAfter}};return h(this.tile,0,null),i}textDirectionAt(e){let{tile:i}=this.tile.resolveBlock(e,1);return getComputedStyle(i.dom).direction=="rtl"?ie.RTL:ie.LTR}measureTextSize(){let e=this.tile.blockTiles(o=>{if(o.isLine()&&o.children.length&&o.length<=20){let a=0,l;for(let c of o.children){if(!c.isText()||/[^ -~]/.test(c.text))return;let h=on(c.dom);if(h.length!=1)return;a+=h[0].width,l=h[0].height}if(a)return{lineHeight:o.dom.getBoundingClientRect().height,charWidth:a/o.length,textHeight:l}}});if(e)return e;let i=document.createElement("div"),s,r,n;return i.className="cm-line",i.style.width="99999px",i.style.position="absolute",i.textContent="abc def ghi jkl mno pqr stu",this.view.observer.ignore(()=>{this.tile.dom.appendChild(i);let o=on(i.firstChild)[0];s=i.getBoundingClientRect().height,r=o&&o.width?o.width/27:7,n=o&&o.height?o.height:s,i.remove()}),{lineHeight:s,charWidth:r,textHeight:n}}computeBlockGapDeco(){let e=[],i=this.view.viewState;for(let s=0,r=0;;r++){let n=r==i.viewports.length?null:i.viewports[r],o=n?n.from-1:this.view.state.doc.length;if(o>s){let a=(i.lineBlockAt(o).bottom-i.lineBlockAt(s).top)/this.view.scaleY;e.push(N.replace({widget:new To(a),block:!0,inclusive:!0,isBlockGap:!0}).range(s,o))}if(!n)break;s=n.to+1}return N.set(e)}updateDeco(){let e=1,i=this.view.state.facet(eo).map(n=>(this.dynamicDecorationMap[e++]=typeof n=="function")?n(this.view):n),s=!1,r=this.view.state.facet(wl).map((n,o)=>{let a=typeof n=="function";return a&&(s=!0),a?n(this.view):n});for(r.length&&(this.dynamicDecorationMap[e++]=s,i.push(V.join(r))),this.decorations=[this.editContextFormatting,...i,this.computeBlockGapDeco(),this.view.viewState.lineGapDeco];e<this.decorations.length;)this.dynamicDecorationMap[e++]=!1;this.blockWrappers=this.view.state.facet(wf).map(n=>typeof n=="function"?n(this.view):n)}scrollIntoView(e){var i;if(e.isSnapshot){let h=this.view.viewState.lineBlockAt(e.range.head);this.view.scrollDOM.scrollTop=h.top-e.yMargin,this.view.scrollDOM.scrollLeft=e.xMargin;return}for(let h of this.view.state.facet(vf))try{if(h(this.view,e.range,e))return!0}catch(d){Ue(this.view.state,d,"scroll handler")}let{range:s}=e,r=this.coordsAt(s.head,(i=s.assoc)!==null&&i!==void 0?i:s.empty?0:s.head>s.anchor?-1:1),n;if(!r)return;!s.empty&&(n=this.coordsAt(s.anchor,s.anchor>s.head?-1:1))&&(r={left:Math.min(r.left,n.left),top:Math.min(r.top,n.top),right:Math.max(r.right,n.right),bottom:Math.max(r.bottom,n.bottom)});let o=kl(this.view),a={left:r.left-o.left,top:r.top-o.top,right:r.right+o.right,bottom:r.bottom+o.bottom},{offsetWidth:l,offsetHeight:c}=this.view.scrollDOM;if(Om(this.view.scrollDOM,a,s.head<s.anchor?-1:1,e.x,e.y,Math.max(Math.min(e.xMargin,l),-l),Math.max(Math.min(e.yMargin,c),-c),this.view.textDirection==ie.LTR),window.visualViewport&&window.innerHeight-window.visualViewport.height>1&&(r.top>window.pageYOffset+window.visualViewport.offsetTop+window.visualViewport.height||r.bottom<window.pageYOffset+window.visualViewport.offsetTop)){let h=this.view.docView.lineAt(s.head,1);h&&h.dom.scrollIntoView({block:"nearest"})}}lineHasWidget(e){let i=s=>s.isWidget()||s.children.some(i);return i(this.tile.resolveBlock(e,1).tile)}destroy(){Pa(this.tile)}}function Pa(t,e){let i=e==null?void 0:e.get(t);if(i!=1){i==null&&t.destroy();for(let s of t.children)Pa(s,e)}}function Ym(t){return t.node.nodeType==1&&t.node.firstChild&&(t.offset==0||t.node.childNodes[t.offset-1].contentEditable=="false")&&(t.offset==t.node.childNodes.length||t.node.childNodes[t.offset].contentEditable=="false")}function Of(t,e){let i=t.observer.selectionRange;if(!i.focusNode)return null;let s=sf(i.focusNode,i.focusOffset),r=rf(i.focusNode,i.focusOffset),n=s||r;if(r&&s&&r.node!=s.node){let a=ue.get(r.node);if(!a||a.isText()&&a.text!=r.node.nodeValue)n=r;else if(t.docView.lastCompositionAfterCursor){let l=ue.get(s.node);!l||l.isText()&&l.text!=s.node.nodeValue||(n=r)}}if(t.docView.lastCompositionAfterCursor=n!=s,!n)return null;let o=e-n.offset;return{from:o,to:o+n.node.nodeValue.length,node:n.node}}function Gm(t,e,i){let s=Of(t,i);if(!s)return null;let{node:r,from:n,to:o}=s,a=r.nodeValue;if(/[\n\r]/.test(a)||t.state.doc.sliceString(s.from,s.to)!=a)return null;let l=e.invertedDesc;return{range:new st(l.mapPos(n),l.mapPos(o),n,o),text:r}}function Zm(t,e){return t.nodeType!=1?0:(e&&t.childNodes[e-1].contentEditable=="false"?1:0)|(e<t.childNodes.length&&t.childNodes[e].contentEditable=="false"?2:0)}let eb=class{constructor(){this.changes=[]}compareRange(e,i){ls(e,i,this.changes)}comparePoint(e,i){ls(e,i,this.changes)}boundChange(e){ls(e,e,this.changes)}};function tb(t,e,i){let s=new eb;return V.compare(t,e,i,s),s.changes}class ib{constructor(){this.changes=[]}compareRange(e,i){ls(e,i,this.changes)}comparePoint(){}boundChange(e){ls(e,e,this.changes)}}function sb(t,e,i){let s=new ib;return V.compare(t,e,i,s),s.changes}function rb(t,e){for(let i=t;i&&i!=e;i=i.assignedSlot||i.parentNode)if(i.nodeType==1&&i.contentEditable=="false")return!0;return!1}function nb(t,e){let i=!1;return e&&t.iterChangedRanges((s,r)=>{s<e.to&&r>e.from&&(i=!0)}),i}class To extends Gt{constructor(e){super(),this.height=e}toDOM(){let e=document.createElement("div");return e.className="cm-gap",this.updateDOM(e),e}eq(e){return e.height==this.height}updateDOM(e){return e.style.height=this.height+"px",!0}get editable(){return!0}get estimatedHeight(){return this.height}ignoreEvent(){return!1}}function ob(t,e,i=1){let s=t.charCategorizer(e),r=t.doc.lineAt(e),n=e-r.from;if(r.length==0)return C.cursor(e);n==0?i=1:n==r.length&&(i=-1);let o=n,a=n;i<0?o=Ce(r.text,n,!1):a=Ce(r.text,n);let l=s(r.text.slice(o,a));for(;o>0;){let c=Ce(r.text,o,!1);if(s(r.text.slice(c,o))!=l)break;o=c}for(;a<r.length;){let c=Ce(r.text,a);if(s(r.text.slice(a,c))!=l)break;a=c}return C.range(o+r.from,a+r.from)}function ab(t,e,i,s,r){let n=Math.round((s-e.left)*t.defaultCharacterWidth);if(t.lineWrapping&&i.height>t.defaultLineHeight*1.5){let a=t.viewState.heightOracle.textHeight,l=Math.floor((r-i.top-(t.defaultLineHeight-a)*.5)/a);n+=l*t.viewState.heightOracle.lineLength}let o=t.state.sliceDoc(i.from,i.to);return i.from+ma(o,n,t.state.tabSize)}function Ta(t,e,i){let s=t.lineBlockAt(e);if(Array.isArray(s.type)){let r;for(let n of s.type){if(n.from>e)break;if(!(n.to<e)){if(n.from<e&&n.to>e)return n;(!r||n.type==Pe.Text&&(r.type!=n.type||(i<0?n.from<e:n.to>e)))&&(r=n)}}return r||s}return s}function lb(t,e,i,s){let r=Ta(t,e.head,e.assoc||-1),n=!s||r.type!=Pe.Text||!(t.lineWrapping||r.widgetLineBreaks)?null:t.coordsAtPos(e.assoc<0&&e.head>r.from?e.head-1:e.head);if(n){let o=t.dom.getBoundingClientRect(),a=t.textDirectionAt(r.from),l=t.posAtCoords({x:i==(a==ie.LTR)?o.right-1:o.left+1,y:(n.top+n.bottom)/2});if(l!=null)return C.cursor(l,i?-1:1)}return C.cursor(i?r.to:r.from,i?-1:1)}function Lc(t,e,i,s){let r=t.state.doc.lineAt(e.head),n=t.bidiSpans(r),o=t.textDirectionAt(r.from);for(let a=e,l=null;;){let c=Lm(r,n,o,a,i),h=cf;if(!c){if(r.number==(i?t.state.doc.lines:1))return a;h=`
`,r=t.state.doc.line(r.number+(i?1:-1)),n=t.bidiSpans(r),c=t.visualLineSide(r,!i)}if(l){if(!l(h))return a}else{if(!s)return c;l=s(h)}a=c}}function cb(t,e,i){let s=t.state.charCategorizer(e),r=s(i);return n=>{let o=s(n);return r==ce.Space&&(r=o),r==o}}function hb(t,e,i,s){let r=e.head,n=i?1:-1;if(r==(i?t.state.doc.length:0))return C.cursor(r,e.assoc);let o=e.goalColumn,a,l=t.contentDOM.getBoundingClientRect(),c=t.coordsAtPos(r,e.assoc||((e.empty?i:e.head==e.from)?1:-1)),h=t.documentTop;if(c)o==null&&(o=c.left-l.left),a=n<0?c.top:c.bottom;else{let p=t.viewState.lineBlockAt(r);o==null&&(o=Math.min(l.right-l.left,t.defaultCharacterWidth*(r-p.from))),a=(n<0?p.top:p.bottom)+h}let d=l.left+o,f=t.viewState.heightOracle.textHeight>>1,u=s??f;for(let p=0;;p+=f){let m=a+(u+p)*n,b=Ma(t,{x:d,y:m},!1,n);if(i?m>l.bottom:m<l.top)return C.cursor(b.pos,b.assoc);let x=t.coordsAtPos(b.pos,b.assoc),k=x?(x.top+x.bottom)/2:0;if(!x||(i?k>a:k<a))return C.cursor(b.pos,b.assoc,void 0,o)}}function Ks(t,e,i){for(;;){let s=0;for(let r of t)r.between(e-1,e+1,(n,o,a)=>{if(e>n&&e<o){let l=s||i||(e-n<o-e?-1:1);e=l<0?n:o,s=l}});if(!s)return e}}function Af(t,e){let i=null;for(let s=0;s<e.ranges.length;s++){let r=e.ranges[s],n=null;if(r.empty){let o=Ks(t,r.from,0);o!=r.from&&(n=C.cursor(o,-1))}else{let o=Ks(t,r.from,-1),a=Ks(t,r.to,1);(o!=r.from||a!=r.to)&&(n=C.range(r.from==r.anchor?o:a,r.from==r.head?o:a))}n&&(i||(i=e.ranges.slice()),i[s]=n)}return i?C.create(i,e.mainIndex):e}function Mo(t,e,i){let s=Ks(t.state.facet(Or).map(r=>r(t)),i.from,e.head>i.from?-1:1);return s==i.from?i:C.cursor(s,s<i.from?1:-1)}class Pt{constructor(e,i){this.pos=e,this.assoc=i}}function Ma(t,e,i,s){let r=t.contentDOM.getBoundingClientRect(),n=r.top+t.viewState.paddingTop,{x:o,y:a}=e,l=a-n,c;for(;;){if(l<0)return new Pt(0,1);if(l>t.viewState.docHeight)return new Pt(t.state.doc.length,-1);if(c=t.elementAtHeight(l),s==null)break;if(c.type==Pe.Text){if(s<0?c.to<t.viewport.from:c.from>t.viewport.to)break;let f=t.docView.coordsAt(s<0?c.from:c.to,s>0?-1:1);if(f&&(s<0?f.top<=l+n:f.bottom>=l+n))break}let d=t.viewState.heightOracle.textHeight/2;l=s>0?c.bottom+d:c.top-d}if(t.viewport.from>=c.to||t.viewport.to<=c.from){if(i)return null;if(c.type==Pe.Text){let d=ab(t,r,c,o,a);return new Pt(d,d==c.from?1:-1)}}if(c.type!=Pe.Text)return l<(c.top+c.bottom)/2?new Pt(c.from,1):new Pt(c.to,-1);let h=t.docView.lineAt(c.from,2);return(!h||h.length!=c.length)&&(h=t.docView.lineAt(c.from,-2)),new db(t,o,a,t.textDirectionAt(c.from)).scanTile(h,c.from)}class db{constructor(e,i,s,r){this.view=e,this.x=i,this.y=s,this.baseDir=r,this.line=null,this.spans=null}bidiSpansAt(e){return(!this.line||this.line.from>e||this.line.to<e)&&(this.line=this.view.state.doc.lineAt(e),this.spans=this.view.bidiSpans(this.line)),this}baseDirAt(e,i){let{line:s,spans:r}=this.bidiSpansAt(e);return r[Tt.find(r,e-s.from,-1,i)].level==this.baseDir}dirAt(e,i){let{line:s,spans:r}=this.bidiSpansAt(e);return r[Tt.find(r,e-s.from,-1,i)].dir}bidiIn(e,i){let{spans:s,line:r}=this.bidiSpansAt(e);return s.length>1||s.length&&(s[0].level!=this.baseDir||s[0].to+r.from<i)}scan(e,i){let s=0,r=e.length-1,n=new Set,o=this.bidiIn(e[0],e[r]),a,l,c=-1,h=1e9,d;e:for(;s<r;){let u=r-s,p=s+r>>1;t:if(n.has(p)){let b=s+Math.floor(Math.random()*u);for(let x=0;x<u;x++){if(!n.has(b)){p=b;break t}b++,b==r&&(b=s)}break e}n.add(p);let m=i(p);if(m)for(let b=0;b<m.length;b++){let x=m[b],k=0;if(!(x.width==0&&m.length>1)){if(x.bottom<this.y)(!a||a.bottom<x.bottom)&&(a=x),k=1;else if(x.top>this.y)(!l||l.top>x.top)&&(l=x),k=-1;else{let O=x.left>this.x?this.x-x.left:x.right<this.x?this.x-x.right:0,R=Math.abs(O);R<h&&(c=p,h=R,d=x),O&&(k=O<0==(this.baseDir==ie.LTR)?-1:1)}k==-1&&(!o||this.baseDirAt(e[p],1))?r=p:k==1&&(!o||this.baseDirAt(e[p+1],-1))&&(s=p+1)}}}if(!d){let u=a&&(!l||this.y-a.bottom<l.top-this.y)?a:l;return this.y=(u.top+u.bottom)/2,this.scan(e,i)}if(h){let{top:u,bottom:p}=d;if(a&&a.bottom>(u+u+p)/3)return this.y=a.bottom-1,this.scan(e,i);if(l&&l.top<(u+p+p)/3)return this.y=l.top+1,this.scan(e,i)}let f=(o?this.dirAt(e[c],1):this.baseDir)==ie.LTR;return{i:c,after:this.x>(d.left+d.right)/2==f}}scanText(e,i){let s=[];for(let n=0;n<e.length;n=Ce(e.text,n))s.push(i+n);s.push(i+e.length);let r=this.scan(s,n=>{let o=s[n]-i,a=s[n+1]-i;return lr(e.dom,o,a).getClientRects()});return r.after?new Pt(s[r.i+1],-1):new Pt(s[r.i],1)}scanTile(e,i){if(!e.length)return new Pt(i,1);if(e.children.length==1){let a=e.children[0];if(a.isText())return this.scanText(a,i);if(a.isComposite())return this.scanTile(a,i)}let s=[i];for(let a=0,l=i;a<e.children.length;a++)s.push(l+=e.children[a].length);let r=this.scan(s,a=>{let l=e.children[a];return l.flags&48?null:(l.dom.nodeType==1?l.dom:lr(l.dom,0,l.length)).getClientRects()}),n=e.children[r.i],o=s[r.i];return n.isText()?this.scanText(n,o):n.isComposite()?this.scanTile(n,o):r.after?new Pt(s[r.i+1],-1):new Pt(o,1)}}const Yi="￿";class fb{constructor(e,i){this.points=e,this.view=i,this.text="",this.lineSeparator=i.state.facet(K.lineSeparator)}append(e){this.text+=e}lineBreak(){this.text+=Yi}readRange(e,i){if(!e)return this;let s=e.parentNode;for(let r=e;;){this.findPointBefore(s,r);let n=this.text.length;this.readNode(r);let o=ue.get(r),a=r.nextSibling;if(a==i){o!=null&&o.breakAfter&&!a&&s!=this.view.contentDOM&&this.lineBreak();break}let l=ue.get(a);(o&&l?o.breakAfter:(o?o.breakAfter:wn(r))||wn(a)&&(r.nodeName!="BR"||o!=null&&o.isWidget())&&this.text.length>n)&&!pb(a,i)&&this.lineBreak(),r=a}return this.findPointBefore(s,i),this}readTextNode(e){let i=e.nodeValue;for(let s of this.points)s.node==e&&(s.pos=this.text.length+Math.min(s.offset,i.length));for(let s=0,r=this.lineSeparator?null:/\r\n?|\n/g;;){let n=-1,o=1,a;if(this.lineSeparator?(n=i.indexOf(this.lineSeparator,s),o=this.lineSeparator.length):(a=r.exec(i))&&(n=a.index,o=a[0].length),this.append(i.slice(s,n<0?i.length:n)),n<0)break;if(this.lineBreak(),o>1)for(let l of this.points)l.node==e&&l.pos>this.text.length&&(l.pos-=o-1);s=n+o}}readNode(e){let i=ue.get(e),s=i&&i.overrideDOMText;if(s!=null){this.findPointInside(e,s.length);for(let r=s.iter();!r.next().done;)r.lineBreak?this.lineBreak():this.append(r.value)}else e.nodeType==3?this.readTextNode(e):e.nodeName=="BR"?e.nextSibling&&this.lineBreak():e.nodeType==1&&this.readRange(e.firstChild,null)}findPointBefore(e,i){for(let s of this.points)s.node==e&&e.childNodes[s.offset]==i&&(s.pos=this.text.length)}findPointInside(e,i){for(let s of this.points)(e.nodeType==3?s.node==e:e.contains(s.node))&&(s.pos=this.text.length+(ub(e,s.node,s.offset)?i:0))}}function ub(t,e,i){for(;;){if(!e||i<Kt(e))return!1;if(e==t)return!0;i=fi(e)+1,e=e.parentNode}}function pb(t,e){let i;for(;!(t==e||!t);t=t.nextSibling){let s=ue.get(t);if(!(s!=null&&s.isWidget()))return!1;s&&(i||(i=[])).push(s)}if(i)for(let s of i){let r=s.overrideDOMText;if(r!=null&&r.length)return!1}return!0}class Ic{constructor(e,i){this.node=e,this.offset=i,this.pos=-1}}class gb{constructor(e,i,s,r){this.typeOver=r,this.bounds=null,this.text="",this.domChanged=i>-1;let{impreciseHead:n,impreciseAnchor:o}=e.docView,a=e.state.selection;if(e.state.readOnly&&i>-1)this.newSel=null;else if(i>-1&&(this.bounds=$f(e.docView.tile,i,s,0))){let l=n||o?[]:bb(e),c=new fb(l,e);c.readRange(this.bounds.startDOM,this.bounds.endDOM),this.text=c.text,this.newSel=vb(l,this.bounds.from)}else{let l=e.observer.selectionRange,c=n&&n.node==l.focusNode&&n.offset==l.focusOffset||!Sa(e.contentDOM,l.focusNode)?a.main.head:e.docView.posFromDOM(l.focusNode,l.focusOffset),h=o&&o.node==l.anchorNode&&o.offset==l.anchorOffset||!Sa(e.contentDOM,l.anchorNode)?a.main.anchor:e.docView.posFromDOM(l.anchorNode,l.anchorOffset),d=e.viewport;if((D.ios||D.chrome)&&a.main.empty&&c!=h&&(d.from>0||d.to<e.state.doc.length)){let f=Math.min(c,h),u=Math.max(c,h),p=d.from-f,m=d.to-u;(p==0||p==1||f==0)&&(m==0||m==-1||u==e.state.doc.length)&&(c=0,h=e.state.doc.length)}if(e.inputState.composing>-1&&a.ranges.length>1)this.newSel=a.replaceRange(C.range(h,c));else if(e.lineWrapping&&h==c&&!(a.main.empty&&a.main.head==c)&&e.inputState.lastTouchTime>Date.now()-100){let f=e.coordsAtPos(c,-1),u=0;f&&(u=e.inputState.lastTouchY<=f.bottom?-1:1),this.newSel=C.create([C.cursor(c,u)])}else this.newSel=C.single(h,c)}}}function $f(t,e,i,s){if(t.isComposite()){let r=-1,n=-1,o=-1,a=-1;for(let l=0,c=s,h=s;l<t.children.length;l++){let d=t.children[l],f=c+d.length;if(c<e&&f>i)return $f(d,e,i,c);if(f>=e&&r==-1&&(r=l,n=c),c>i&&d.dom.parentNode==t.dom){o=l,a=h;break}h=f,c=f+d.breakAfter}return{from:n,to:a<0?s+t.length:a,startDOM:(r?t.children[r-1].dom.nextSibling:null)||t.dom.firstChild,endDOM:o<t.children.length&&o>=0?t.children[o].dom:null}}else return t.isText()?{from:s,to:s+t.length,startDOM:t.dom,endDOM:t.dom.nextSibling}:null}function Pf(t,e){let i,{newSel:s}=e,{state:r}=t,n=r.selection.main,o=t.inputState.lastKeyTime>Date.now()-100?t.inputState.lastKeyCode:-1;if(e.bounds){let{from:a,to:l}=e.bounds,c=n.from,h=null;(o===8||D.android&&e.text.length<l-a)&&(c=n.to,h="end");let d=r.doc.sliceString(a,l,Yi),f,u;!n.empty&&n.from>=a&&n.to<=l&&(e.typeOver||d!=e.text)&&d.slice(0,n.from-a)==e.text.slice(0,n.from-a)&&d.slice(n.to-a)==e.text.slice(f=e.text.length-(d.length-(n.to-a)))?i={from:n.from,to:n.to,insert:X.of(e.text.slice(n.from-a,f).split(Yi))}:(u=Tf(d,e.text,c-a,h))&&(D.chrome&&o==13&&u.toB==u.from+2&&e.text.slice(u.from,u.toB)==Yi+Yi&&u.toB--,i={from:a+u.from,to:a+u.toA,insert:X.of(e.text.slice(u.from,u.toB).split(Yi))})}else s&&(!t.hasFocus&&r.facet(qt)||An(s,n))&&(s=null);if(!i&&!s)return!1;if((D.mac||D.android)&&i&&i.from==i.to&&i.from==n.head-1&&/^\. ?$/.test(i.insert.toString())&&t.contentDOM.getAttribute("autocorrect")=="off"?(s&&i.insert.length==2&&(s=C.single(s.main.anchor-1,s.main.head-1)),i={from:i.from,to:i.to,insert:X.of([i.insert.toString().replace("."," ")])}):r.doc.lineAt(n.from).to<n.to&&t.docView.lineHasWidget(n.to)&&t.inputState.insertingTextAt>Date.now()-50?i={from:n.from,to:n.to,insert:r.toText(t.inputState.insertingText)}:D.chrome&&i&&i.from==i.to&&i.from==n.head&&i.insert.toString()==`
 `&&t.lineWrapping&&(s&&(s=C.single(s.main.anchor-1,s.main.head-1)),i={from:n.from,to:n.to,insert:X.of([" "])}),i)return Sl(t,i,s,o);if(s&&!An(s,n)){let a=!1,l="select";return t.inputState.lastSelectionTime>Date.now()-50&&(t.inputState.lastSelectionOrigin=="select"&&(a=!0),l=t.inputState.lastSelectionOrigin,l=="select.pointer"&&(s=Af(r.facet(Or).map(c=>c(t)),s))),t.dispatch({selection:s,scrollIntoView:a,userEvent:l}),!0}else return!1}function Sl(t,e,i,s=-1){if(D.ios&&t.inputState.flushIOSKey(e))return!0;let r=t.state.selection.main;if(D.android&&(e.to==r.to&&(e.from==r.from||e.from==r.from-1&&t.state.sliceDoc(e.from,r.from)==" ")&&e.insert.length==1&&e.insert.lines==2&&cs(t.contentDOM,"Enter",13)||(e.from==r.from-1&&e.to==r.to&&e.insert.length==0||s==8&&e.insert.length<e.to-e.from&&e.to>r.head)&&cs(t.contentDOM,"Backspace",8)||e.from==r.from&&e.to==r.to+1&&e.insert.length==0&&cs(t.contentDOM,"Delete",46)))return!0;let n=e.insert.toString();t.inputState.composing>=0&&t.inputState.composing++;let o,a=()=>o||(o=mb(t,e,i));return t.state.facet(pf).some(l=>l(t,e.from,e.to,n,a))||t.dispatch(a()),!0}function mb(t,e,i){let s,r=t.state,n=r.selection.main,o=-1;if(e.from==e.to&&e.from<n.from||e.from>n.to){let l=e.from<n.from?-1:1,c=l<0?n.from:n.to,h=Ks(r.facet(Or).map(d=>d(t)),c,l);e.from==h&&(o=h)}if(o>-1)s={changes:e,selection:C.cursor(e.from+e.insert.length,-1)};else if(e.from>=n.from&&e.to<=n.to&&e.to-e.from>=(n.to-n.from)/3&&(!i||i.main.empty&&i.main.from==e.from+e.insert.length)&&t.inputState.composing<0){let l=n.from<e.from?r.sliceDoc(n.from,e.from):"",c=n.to>e.to?r.sliceDoc(e.to,n.to):"";s=r.replaceSelection(t.state.toText(l+e.insert.sliceString(0,void 0,t.state.lineBreak)+c))}else{let l=r.changes(e),c=i&&i.main.to<=l.newLength?i.main:void 0;if(r.selection.ranges.length>1&&(t.inputState.composing>=0||t.inputState.compositionPendingChange)&&e.to<=n.to+10&&e.to>=n.to-10){let h=t.state.sliceDoc(e.from,e.to),d,f=i&&Of(t,i.main.head);if(f){let p=e.insert.length-(e.to-e.from);d={from:f.from,to:f.to-p}}else d=t.state.doc.lineAt(n.head);let u=n.to-e.to;s=r.changeByRange(p=>{if(p.from==n.from&&p.to==n.to)return{changes:l,range:c||p.map(l)};let m=p.to-u,b=m-h.length;if(t.state.sliceDoc(b,m)!=h||m>=d.from&&b<=d.to)return{range:p};let x=r.changes({from:b,to:m,insert:e.insert}),k=p.to-n.to;return{changes:x,range:c?C.range(Math.max(0,c.anchor+k),Math.max(0,c.head+k)):p.map(x)}})}else s={changes:l,selection:c&&r.selection.replaceRange(c)}}let a="input.type";return(t.composing||t.inputState.compositionPendingChange&&t.inputState.compositionEndedAt>Date.now()-50)&&(t.inputState.compositionPendingChange=!1,a+=".compose",t.inputState.compositionFirstChange&&(a+=".start",t.inputState.compositionFirstChange=!1)),r.update(s,{userEvent:a,scrollIntoView:!0})}function Tf(t,e,i,s){let r=Math.min(t.length,e.length),n=0;for(;n<r&&t.charCodeAt(n)==e.charCodeAt(n);)n++;if(n==r&&t.length==e.length)return null;let o=t.length,a=e.length;for(;o>0&&a>0&&t.charCodeAt(o-1)==e.charCodeAt(a-1);)o--,a--;if(s=="end"){let l=Math.max(0,n-Math.min(o,a));i-=o+l-n}if(o<n&&t.length<e.length){let l=i<=n&&i>=o?n-i:0;n-=l,a=n+(a-o),o=n}else if(a<n){let l=i<=n&&i>=a?n-i:0;n-=l,o=n+(o-a),a=n}return{from:n,toA:o,toB:a}}function bb(t){let e=[];if(t.root.activeElement!=t.contentDOM)return e;let{anchorNode:i,anchorOffset:s,focusNode:r,focusOffset:n}=t.observer.selectionRange;return i&&(e.push(new Ic(i,s)),(r!=i||n!=s)&&e.push(new Ic(r,n))),e}function vb(t,e){if(t.length==0)return null;let i=t[0].pos,s=t.length==2?t[1].pos:i;return i>-1&&s>-1?C.single(i+e,s+e):null}function An(t,e){return e.head==t.main.head&&e.anchor==t.main.anchor}class yb{setSelectionOrigin(e){this.lastSelectionOrigin=e,this.lastSelectionTime=Date.now()}constructor(e){this.view=e,this.lastKeyCode=0,this.lastKeyTime=0,this.lastTouchTime=0,this.lastTouchX=0,this.lastTouchY=0,this.lastFocusTime=0,this.lastScrollTop=0,this.lastScrollLeft=0,this.lastWheelEvent=0,this.pendingIOSKey=void 0,this.tabFocusMode=-1,this.lastSelectionOrigin=null,this.lastSelectionTime=0,this.lastContextMenu=0,this.scrollHandlers=[],this.handlers=Object.create(null),this.composing=-1,this.compositionFirstChange=null,this.compositionEndedAt=0,this.compositionPendingKey=!1,this.compositionPendingChange=!1,this.insertingText="",this.insertingTextAt=0,this.mouseSelection=null,this.draggedContent=null,this.handleEvent=this.handleEvent.bind(this),this.notifiedFocused=e.hasFocus,D.safari&&e.contentDOM.addEventListener("input",()=>null),D.gecko&&Bb(e.contentDOM.ownerDocument)}handleEvent(e){!$b(this.view,e)||this.ignoreDuringComposition(e)||e.type=="keydown"&&this.keydown(e)||(this.view.updateState!=0?Promise.resolve().then(()=>this.runHandlers(e.type,e)):this.runHandlers(e.type,e))}runHandlers(e,i){let s=this.handlers[e];if(s){for(let r of s.observers)r(this.view,i);for(let r of s.handlers){if(i.defaultPrevented)break;if(r(this.view,i)){i.preventDefault();break}}}}ensureHandlers(e){let i=xb(e),s=this.handlers,r=this.view.contentDOM;for(let n in i)if(n!="scroll"){let o=!i[n].handlers.length,a=s[n];a&&o!=!a.handlers.length&&(r.removeEventListener(n,this.handleEvent),a=null),a||r.addEventListener(n,this.handleEvent,{passive:o})}for(let n in s)n!="scroll"&&!i[n]&&r.removeEventListener(n,this.handleEvent);this.handlers=i}keydown(e){if(this.lastKeyCode=e.keyCode,this.lastKeyTime=Date.now(),e.keyCode==9&&this.tabFocusMode>-1&&(!this.tabFocusMode||Date.now()<=this.tabFocusMode))return!0;if(this.tabFocusMode>0&&e.keyCode!=27&&Ef.indexOf(e.keyCode)<0&&(this.tabFocusMode=-1),D.android&&D.chrome&&!e.synthetic&&(e.keyCode==13||e.keyCode==8))return this.view.observer.delayAndroidKey(e.key,e.keyCode),!0;let i;return D.ios&&!e.synthetic&&!e.altKey&&!e.metaKey&&!e.shiftKey&&((i=Mf.find(s=>s.keyCode==e.keyCode))&&!e.ctrlKey||wb.indexOf(e.key)>-1&&e.ctrlKey)?(this.pendingIOSKey=i||e,setTimeout(()=>this.flushIOSKey(),250),!0):(e.keyCode!=229&&this.view.observer.forceFlush(),!1)}flushIOSKey(e){let i=this.pendingIOSKey;return!i||i.key=="Enter"&&e&&e.from<e.to&&/^\S+$/.test(e.insert.toString())?!1:(this.pendingIOSKey=void 0,cs(this.view.contentDOM,i.key,i.keyCode,i instanceof KeyboardEvent?i:void 0))}ignoreDuringComposition(e){return!/^key/.test(e.type)||e.synthetic?!1:this.composing>0?!0:D.safari&&!D.ios&&this.compositionPendingKey&&Date.now()-this.compositionEndedAt<100?(this.compositionPendingKey=!1,!0):!1}startMouseSelection(e){this.mouseSelection&&this.mouseSelection.destroy(),this.mouseSelection=e}update(e){this.view.observer.update(e),this.mouseSelection&&this.mouseSelection.update(e),this.draggedContent&&e.docChanged&&(this.draggedContent=this.draggedContent.map(e.changes)),e.transactions.length&&(this.lastKeyCode=this.lastSelectionTime=0)}destroy(){this.mouseSelection&&this.mouseSelection.destroy()}}function Fc(t,e){return(i,s)=>{try{return e.call(t,s,i)}catch(r){Ue(i.state,r)}}}function xb(t){let e=Object.create(null);function i(s){return e[s]||(e[s]={observers:[],handlers:[]})}for(let s of t){let r=s.spec,n=r&&r.plugin.domEventHandlers,o=r&&r.plugin.domEventObservers;if(n)for(let a in n){let l=n[a];l&&i(a).handlers.push(Fc(s.value,l))}if(o)for(let a in o){let l=o[a];l&&i(a).observers.push(Fc(s.value,l))}}for(let s in gt)i(s).handlers.push(gt[s]);for(let s in Qe)i(s).observers.push(Qe[s]);return e}const Mf=[{key:"Backspace",keyCode:8,inputType:"deleteContentBackward"},{key:"Enter",keyCode:13,inputType:"insertParagraph"},{key:"Enter",keyCode:13,inputType:"insertLineBreak"},{key:"Delete",keyCode:46,inputType:"deleteContentForward"}],wb="dthko",Ef=[16,17,18,20,91,92,224,225],Lr=6;function Ir(t){return Math.max(0,t)*.7+8}function kb(t,e){return Math.max(Math.abs(t.clientX-e.clientX),Math.abs(t.clientY-e.clientY))}class Sb{constructor(e,i,s,r){this.view=e,this.startEvent=i,this.style=s,this.mustSelect=r,this.scrollSpeed={x:0,y:0},this.scrolling=-1,this.lastEvent=i,this.scrollParents=Zd(e.contentDOM),this.atoms=e.state.facet(Or).map(o=>o(e));let n=e.contentDOM.ownerDocument;n.addEventListener("mousemove",this.move=this.move.bind(this)),n.addEventListener("mouseup",this.up=this.up.bind(this)),this.extend=i.shiftKey,this.multiple=e.state.facet(K.allowMultipleSelections)&&Cb(e,i),this.dragging=Ab(e,i)&&Bf(i)==1?null:!1}start(e){this.dragging===!1&&this.select(e)}move(e){if(e.buttons==0)return this.destroy();if(this.dragging||this.dragging==null&&kb(this.startEvent,e)<10)return;this.select(this.lastEvent=e);let i=0,s=0,r=0,n=0,o=this.view.win.innerWidth,a=this.view.win.innerHeight;this.scrollParents.x&&({left:r,right:o}=this.scrollParents.x.getBoundingClientRect()),this.scrollParents.y&&({top:n,bottom:a}=this.scrollParents.y.getBoundingClientRect());let l=kl(this.view);e.clientX-l.left<=r+Lr?i=-Ir(r-e.clientX):e.clientX+l.right>=o-Lr&&(i=Ir(e.clientX-o)),e.clientY-l.top<=n+Lr?s=-Ir(n-e.clientY):e.clientY+l.bottom>=a-Lr&&(s=Ir(e.clientY-a)),this.setScrollSpeed(i,s)}up(e){this.dragging==null&&this.select(this.lastEvent),this.dragging||e.preventDefault(),this.destroy()}destroy(){this.setScrollSpeed(0,0);let e=this.view.contentDOM.ownerDocument;e.removeEventListener("mousemove",this.move),e.removeEventListener("mouseup",this.up),this.view.inputState.mouseSelection=this.view.inputState.draggedContent=null}setScrollSpeed(e,i){this.scrollSpeed={x:e,y:i},e||i?this.scrolling<0&&(this.scrolling=setInterval(()=>this.scroll(),50)):this.scrolling>-1&&(clearInterval(this.scrolling),this.scrolling=-1)}scroll(){let{x:e,y:i}=this.scrollSpeed;e&&this.scrollParents.x&&(this.scrollParents.x.scrollLeft+=e,e=0),i&&this.scrollParents.y&&(this.scrollParents.y.scrollTop+=i,i=0),(e||i)&&this.view.win.scrollBy(e,i),this.dragging===!1&&this.select(this.lastEvent)}select(e){let{view:i}=this,s=Af(this.atoms,this.style.get(e,this.extend,this.multiple));(this.mustSelect||!s.eq(i.state.selection,this.dragging===!1))&&this.view.dispatch({selection:s,userEvent:"select.pointer"}),this.mustSelect=!1}update(e){e.transactions.some(i=>i.isUserEvent("input.type"))?this.destroy():this.style.update(e)&&setTimeout(()=>this.select(this.lastEvent),20)}}function Cb(t,e){let i=t.state.facet(hf);return i.length?i[0](e):D.mac?e.metaKey:e.ctrlKey}function Ob(t,e){let i=t.state.facet(df);return i.length?i[0](e):D.mac?!e.altKey:!e.ctrlKey}function Ab(t,e){let{main:i}=t.state.selection;if(i.empty)return!1;let s=ar(t.root);if(!s||s.rangeCount==0)return!0;let r=s.getRangeAt(0).getClientRects();for(let n=0;n<r.length;n++){let o=r[n];if(o.left<=e.clientX&&o.right>=e.clientX&&o.top<=e.clientY&&o.bottom>=e.clientY)return!0}return!1}function $b(t,e){if(!e.bubbles)return!0;if(e.defaultPrevented)return!1;for(let i=e.target,s;i!=t.contentDOM;i=i.parentNode)if(!i||i.nodeType==11||(s=ue.get(i))&&s.isWidget()&&!s.isHidden&&s.widget.ignoreEvent(e))return!1;return!0}const gt=Object.create(null),Qe=Object.create(null),Df=D.ie&&D.ie_version<15||D.ios&&D.webkit_version<604;function Pb(t){let e=t.dom.parentNode;if(!e)return;let i=e.appendChild(document.createElement("textarea"));i.style.cssText="position: fixed; left: -10000px; top: 10px",i.focus(),setTimeout(()=>{t.focus(),i.remove(),_f(t,i.value)},50)}function so(t,e,i){for(let s of t.facet(e))i=s(i,t);return i}function _f(t,e){e=so(t.state,vl,e);let{state:i}=t,s,r=1,n=i.toText(e),o=n.lines==i.selection.ranges.length;if(Ea!=null&&i.selection.ranges.every(l=>l.empty)&&Ea==n.toString()){let l=-1;s=i.changeByRange(c=>{let h=i.doc.lineAt(c.from);if(h.from==l)return{range:c};l=h.from;let d=i.toText((o?n.line(r++).text:e)+i.lineBreak);return{changes:{from:h.from,insert:d},range:C.cursor(c.from+d.length)}})}else o?s=i.changeByRange(l=>{let c=n.line(r++);return{changes:{from:l.from,to:l.to,insert:c.text},range:C.cursor(l.from+c.length)}}):s=i.replaceSelection(n);t.dispatch(s,{userEvent:"input.paste",scrollIntoView:!0})}Qe.scroll=t=>{t.inputState.lastScrollTop=t.scrollDOM.scrollTop,t.inputState.lastScrollLeft=t.scrollDOM.scrollLeft};Qe.wheel=Qe.mousewheel=t=>{t.inputState.lastWheelEvent=Date.now()};gt.keydown=(t,e)=>(t.inputState.setSelectionOrigin("select"),e.keyCode==27&&t.inputState.tabFocusMode!=0&&(t.inputState.tabFocusMode=Date.now()+2e3),!1);Qe.touchstart=(t,e)=>{let i=t.inputState,s=e.targetTouches[0];i.lastTouchTime=Date.now(),s&&(i.lastTouchX=s.clientX,i.lastTouchY=s.clientY),i.setSelectionOrigin("select.pointer")};Qe.touchmove=t=>{t.inputState.setSelectionOrigin("select.pointer")};gt.mousedown=(t,e)=>{if(t.observer.flush(),t.inputState.lastTouchTime>Date.now()-2e3)return!1;let i=null;for(let s of t.state.facet(ff))if(i=s(t,e),i)break;if(!i&&e.button==0&&(i=Mb(t,e)),i){let s=!t.hasFocus;t.inputState.startMouseSelection(new Sb(t,e,i,s)),s&&t.observer.ignore(()=>{ef(t.contentDOM);let n=t.root.activeElement;n&&!n.contains(t.contentDOM)&&n.blur()});let r=t.inputState.mouseSelection;if(r)return r.start(e),r.dragging===!1}else t.inputState.setSelectionOrigin("select.pointer");return!1};function Nc(t,e,i,s){if(s==1)return C.cursor(e,i);if(s==2)return ob(t.state,e,i);{let r=t.docView.lineAt(e,i),n=t.state.doc.lineAt(r?r.posAtEnd:e),o=r?r.posAtStart:n.from,a=r?r.posAtEnd:n.to;return a<t.state.doc.length&&a==n.to&&a++,C.range(o,a)}}const Tb=D.ie&&D.ie_version<=11;let zc=null,Hc=0,Wc=0;function Bf(t){if(!Tb)return t.detail;let e=zc,i=Wc;return zc=t,Wc=Date.now(),Hc=!e||i>Date.now()-400&&Math.abs(e.clientX-t.clientX)<2&&Math.abs(e.clientY-t.clientY)<2?(Hc+1)%3:1}function Mb(t,e){let i=t.posAndSideAtCoords({x:e.clientX,y:e.clientY},!1),s=Bf(e),r=t.state.selection;return{update(n){n.docChanged&&(i.pos=n.changes.mapPos(i.pos),r=r.map(n.changes))},get(n,o,a){let l=t.posAndSideAtCoords({x:n.clientX,y:n.clientY},!1),c,h=Nc(t,l.pos,l.assoc,s);if(i.pos!=l.pos&&!o){let d=Nc(t,i.pos,i.assoc,s),f=Math.min(d.from,h.from),u=Math.max(d.to,h.to);h=f<h.from?C.range(f,u,h.assoc):C.range(u,f,h.assoc)}return o?r.replaceRange(r.main.extend(h.from,h.to,h.assoc)):a&&s==1&&r.ranges.length>1&&(c=Eb(r,l.pos))?c:a?r.addRange(h):C.create([h])}}}function Eb(t,e){for(let i=0;i<t.ranges.length;i++){let{from:s,to:r}=t.ranges[i];if(s<=e&&r>=e)return C.create(t.ranges.slice(0,i).concat(t.ranges.slice(i+1)),t.mainIndex==i?0:t.mainIndex-(t.mainIndex>i?1:0))}return null}gt.dragstart=(t,e)=>{let{selection:{main:i}}=t.state;if(e.target.draggable){let r=t.docView.tile.nearest(e.target);if(r&&r.isWidget()){let n=r.posAtStart,o=n+r.length;(n>=i.to||o<=i.from)&&(i=C.range(n,o))}}let{inputState:s}=t;return s.mouseSelection&&(s.mouseSelection.dragging=!0),s.draggedContent=i,e.dataTransfer&&(e.dataTransfer.setData("Text",so(t.state,yl,t.state.sliceDoc(i.from,i.to))),e.dataTransfer.effectAllowed="copyMove"),!1};gt.dragend=t=>(t.inputState.draggedContent=null,!1);function Uc(t,e,i,s){if(i=so(t.state,vl,i),!i)return;let r=t.posAtCoords({x:e.clientX,y:e.clientY},!1),{draggedContent:n}=t.inputState,o=s&&n&&Ob(t,e)?{from:n.from,to:n.to}:null,a={from:r,insert:i},l=t.state.changes(o?[o,a]:a);t.focus(),t.dispatch({changes:l,selection:{anchor:l.mapPos(r,-1),head:l.mapPos(r,1)},userEvent:o?"move.drop":"input.drop"}),t.inputState.draggedContent=null}gt.drop=(t,e)=>{if(!e.dataTransfer)return!1;if(t.state.readOnly)return!0;let i=e.dataTransfer.files;if(i&&i.length){let s=Array(i.length),r=0,n=()=>{++r==i.length&&Uc(t,e,s.filter(o=>o!=null).join(t.state.lineBreak),!1)};for(let o=0;o<i.length;o++){let a=new FileReader;a.onerror=n,a.onload=()=>{/[\x00-\x08\x0e-\x1f]{2}/.test(a.result)||(s[o]=a.result),n()},a.readAsText(i[o])}return!0}else{let s=e.dataTransfer.getData("Text");if(s)return Uc(t,e,s,!0),!0}return!1};gt.paste=(t,e)=>{if(t.state.readOnly)return!0;t.observer.flush();let i=Df?null:e.clipboardData;return i?(_f(t,i.getData("text/plain")||i.getData("text/uri-list")),!0):(Pb(t),!1)};function Db(t,e){let i=t.dom.parentNode;if(!i)return;let s=i.appendChild(document.createElement("textarea"));s.style.cssText="position: fixed; left: -10000px; top: 10px",s.value=e,s.focus(),s.selectionEnd=e.length,s.selectionStart=0,setTimeout(()=>{s.remove(),t.focus()},50)}function _b(t){let e=[],i=[],s=!1;for(let r of t.selection.ranges)r.empty||(e.push(t.sliceDoc(r.from,r.to)),i.push(r));if(!e.length){let r=-1;for(let{from:n}of t.selection.ranges){let o=t.doc.lineAt(n);o.number>r&&(e.push(o.text),i.push({from:o.from,to:Math.min(t.doc.length,o.to+1)})),r=o.number}s=!0}return{text:so(t,yl,e.join(t.lineBreak)),ranges:i,linewise:s}}let Ea=null;gt.copy=gt.cut=(t,e)=>{if(!Qs(t.contentDOM,t.observer.selectionRange))return!1;let{text:i,ranges:s,linewise:r}=_b(t.state);if(!i&&!r)return!1;Ea=r?i:null,e.type=="cut"&&!t.state.readOnly&&t.dispatch({changes:s,scrollIntoView:!0,userEvent:"delete.cut"});let n=Df?null:e.clipboardData;return n?(n.clearData(),n.setData("text/plain",i),!0):(Db(t,i),!1)};const Rf=Yt.define();function Lf(t,e){let i=[];for(let s of t.facet(gf)){let r=s(t,e);r&&i.push(r)}return i.length?t.update({effects:i,annotations:Rf.of(!0)}):null}function If(t){setTimeout(()=>{let e=t.hasFocus;if(e!=t.inputState.notifiedFocused){let i=Lf(t.state,e);i?t.dispatch(i):t.update([])}},10)}Qe.focus=t=>{t.inputState.lastFocusTime=Date.now(),!t.scrollDOM.scrollTop&&(t.inputState.lastScrollTop||t.inputState.lastScrollLeft)&&(t.scrollDOM.scrollTop=t.inputState.lastScrollTop,t.scrollDOM.scrollLeft=t.inputState.lastScrollLeft),If(t)};Qe.blur=t=>{t.observer.clearSelectionRange(),If(t)};Qe.compositionstart=Qe.compositionupdate=t=>{t.observer.editContext||(t.inputState.compositionFirstChange==null&&(t.inputState.compositionFirstChange=!0),t.inputState.composing<0&&(t.inputState.composing=0))};Qe.compositionend=t=>{t.observer.editContext||(t.inputState.composing=-1,t.inputState.compositionEndedAt=Date.now(),t.inputState.compositionPendingKey=!0,t.inputState.compositionPendingChange=t.observer.pendingRecords().length>0,t.inputState.compositionFirstChange=null,D.chrome&&D.android?t.observer.flushSoon():t.inputState.compositionPendingChange?Promise.resolve().then(()=>t.observer.flush()):setTimeout(()=>{t.inputState.composing<0&&t.docView.hasComposition&&t.update([])},50))};Qe.contextmenu=t=>{t.inputState.lastContextMenu=Date.now()};gt.beforeinput=(t,e)=>{var i,s;if((e.inputType=="insertText"||e.inputType=="insertCompositionText")&&(t.inputState.insertingText=e.data,t.inputState.insertingTextAt=Date.now()),e.inputType=="insertReplacementText"&&t.observer.editContext){let n=(i=e.dataTransfer)===null||i===void 0?void 0:i.getData("text/plain"),o=e.getTargetRanges();if(n&&o.length){let a=o[0],l=t.posAtDOM(a.startContainer,a.startOffset),c=t.posAtDOM(a.endContainer,a.endOffset);return Sl(t,{from:l,to:c,insert:t.state.toText(n)},null),!0}}let r;if(D.chrome&&D.android&&(r=Mf.find(n=>n.inputType==e.inputType))&&(t.observer.delayAndroidKey(r.key,r.keyCode),r.key=="Backspace"||r.key=="Delete")){let n=((s=window.visualViewport)===null||s===void 0?void 0:s.height)||0;setTimeout(()=>{var o;(((o=window.visualViewport)===null||o===void 0?void 0:o.height)||0)>n+10&&t.hasFocus&&(t.contentDOM.blur(),t.focus())},100)}return D.ios&&e.inputType=="deleteContentForward"&&t.observer.flushSoon(),D.safari&&e.inputType=="insertText"&&t.inputState.composing>=0&&setTimeout(()=>Qe.compositionend(t,e),20),!1};const qc=new Set;function Bb(t){qc.has(t)||(qc.add(t),t.addEventListener("copy",()=>{}),t.addEventListener("cut",()=>{}))}const Vc=["pre-wrap","normal","pre-line","break-spaces"];let xs=!1;function Qc(){xs=!1}class Rb{constructor(e){this.lineWrapping=e,this.doc=X.empty,this.heightSamples={},this.lineHeight=14,this.charWidth=7,this.textHeight=14,this.lineLength=30}heightForGap(e,i){let s=this.doc.lineAt(i).number-this.doc.lineAt(e).number+1;return this.lineWrapping&&(s+=Math.max(0,Math.ceil((i-e-s*this.lineLength*.5)/this.lineLength))),this.lineHeight*s}heightForLine(e){return this.lineWrapping?(1+Math.max(0,Math.ceil((e-this.lineLength)/Math.max(1,this.lineLength-5))))*this.lineHeight:this.lineHeight}setDoc(e){return this.doc=e,this}mustRefreshForWrapping(e){return Vc.indexOf(e)>-1!=this.lineWrapping}mustRefreshForHeights(e){let i=!1;for(let s=0;s<e.length;s++){let r=e[s];r<0?s++:this.heightSamples[Math.floor(r*10)]||(i=!0,this.heightSamples[Math.floor(r*10)]=!0)}return i}refresh(e,i,s,r,n,o){let a=Vc.indexOf(e)>-1,l=Math.abs(i-this.lineHeight)>.3||this.lineWrapping!=a||Math.abs(s-this.charWidth)>.1;if(this.lineWrapping=a,this.lineHeight=i,this.charWidth=s,this.textHeight=r,this.lineLength=n,l){this.heightSamples={};for(let c=0;c<o.length;c++){let h=o[c];h<0?c++:this.heightSamples[Math.floor(h*10)]=!0}}return l}}class Lb{constructor(e,i){this.from=e,this.heights=i,this.index=0}get more(){return this.index<this.heights.length}}class dt{constructor(e,i,s,r,n){this.from=e,this.length=i,this.top=s,this.height=r,this._content=n}get type(){return typeof this._content=="number"?Pe.Text:Array.isArray(this._content)?this._content:this._content.type}get to(){return this.from+this.length}get bottom(){return this.top+this.height}get widget(){return this._content instanceof Ui?this._content.widget:null}get widgetLineBreaks(){return typeof this._content=="number"?this._content:0}join(e){let i=(Array.isArray(this._content)?this._content:[this]).concat(Array.isArray(e._content)?e._content:[e]);return new dt(this.from,this.length+e.length,this.top,this.height+e.height,i)}}var ne=(function(t){return t[t.ByPos=0]="ByPos",t[t.ByHeight=1]="ByHeight",t[t.ByPosNoHeight=2]="ByPosNoHeight",t})(ne||(ne={}));const an=.001;class Ne{constructor(e,i,s=2){this.length=e,this.height=i,this.flags=s}get outdated(){return(this.flags&2)>0}set outdated(e){this.flags=(e?2:0)|this.flags&-3}setHeight(e){this.height!=e&&(Math.abs(this.height-e)>an&&(xs=!0),this.height=e)}replace(e,i,s){return Ne.of(s)}decomposeLeft(e,i){i.push(this)}decomposeRight(e,i){i.push(this)}applyChanges(e,i,s,r){let n=this,o=s.doc;for(let a=r.length-1;a>=0;a--){let{fromA:l,toA:c,fromB:h,toB:d}=r[a],f=n.lineAt(l,ne.ByPosNoHeight,s.setDoc(i),0,0),u=f.to>=c?f:n.lineAt(c,ne.ByPosNoHeight,s,0,0);for(d+=u.to-c,c=u.to;a>0&&f.from<=r[a-1].toA;)l=r[a-1].fromA,h=r[a-1].fromB,a--,l<f.from&&(f=n.lineAt(l,ne.ByPosNoHeight,s,0,0));h+=f.from-l,l=f.from;let p=Cl.build(s.setDoc(o),e,h,d);n=$n(n,n.replace(l,c,p))}return n.updateHeight(s,0)}static empty(){return new Ye(0,0,0)}static of(e){if(e.length==1)return e[0];let i=0,s=e.length,r=0,n=0;for(;;)if(i==s)if(r>n*2){let a=e[i-1];a.break?e.splice(--i,1,a.left,null,a.right):e.splice(--i,1,a.left,a.right),s+=1+a.break,r-=a.size}else if(n>r*2){let a=e[s];a.break?e.splice(s,1,a.left,null,a.right):e.splice(s,1,a.left,a.right),s+=2+a.break,n-=a.size}else break;else if(r<n){let a=e[i++];a&&(r+=a.size)}else{let a=e[--s];a&&(n+=a.size)}let o=0;return e[i-1]==null?(o=1,i--):e[i]==null&&(o=1,s++),new Fb(Ne.of(e.slice(0,i)),o,Ne.of(e.slice(s)))}}function $n(t,e){return t==e?t:(t.constructor!=e.constructor&&(xs=!0),e)}Ne.prototype.size=1;const Ib=N.replace({});class Ff extends Ne{constructor(e,i,s){super(e,i),this.deco=s,this.spaceAbove=0}mainBlock(e,i){return new dt(i,this.length,e+this.spaceAbove,this.height-this.spaceAbove,this.deco||0)}blockAt(e,i,s,r){return this.spaceAbove&&e<s+this.spaceAbove?new dt(r,0,s,this.spaceAbove,Ib):this.mainBlock(s,r)}lineAt(e,i,s,r,n){let o=this.mainBlock(r,n);return this.spaceAbove?this.blockAt(0,s,r,n).join(o):o}forEachLine(e,i,s,r,n,o){e<=n+this.length&&i>=n&&o(this.lineAt(0,ne.ByPos,s,r,n))}setMeasuredHeight(e){let i=e.heights[e.index++];i<0?(this.spaceAbove=-i,i=e.heights[e.index++]):this.spaceAbove=0,this.setHeight(i)}updateHeight(e,i=0,s=!1,r){return r&&r.from<=i&&r.more&&this.setMeasuredHeight(r),this.outdated=!1,this}toString(){return`block(${this.length})`}}class Ye extends Ff{constructor(e,i,s){super(e,i,null),this.collapsed=0,this.widgetHeight=0,this.breaks=0,this.spaceAbove=s}mainBlock(e,i){return new dt(i,this.length,e+this.spaceAbove,this.height-this.spaceAbove,this.breaks)}replace(e,i,s){let r=s[0];return s.length==1&&(r instanceof Ye||r instanceof Ae&&r.flags&4)&&Math.abs(this.length-r.length)<10?(r instanceof Ae?r=new Ye(r.length,this.height,this.spaceAbove):r.height=this.height,this.outdated||(r.outdated=!1),r):Ne.of(s)}updateHeight(e,i=0,s=!1,r){return r&&r.from<=i&&r.more?this.setMeasuredHeight(r):(s||this.outdated)&&(this.spaceAbove=0,this.setHeight(Math.max(this.widgetHeight,e.heightForLine(this.length-this.collapsed))+this.breaks*e.lineHeight)),this.outdated=!1,this}toString(){return`line(${this.length}${this.collapsed?-this.collapsed:""}${this.widgetHeight?":"+this.widgetHeight:""})`}}class Ae extends Ne{constructor(e){super(e,0)}heightMetrics(e,i){let s=e.doc.lineAt(i).number,r=e.doc.lineAt(i+this.length).number,n=r-s+1,o,a=0;if(e.lineWrapping){let l=Math.min(this.height,e.lineHeight*n);o=l/n,this.length>n+1&&(a=(this.height-l)/(this.length-n-1))}else o=this.height/n;return{firstLine:s,lastLine:r,perLine:o,perChar:a}}blockAt(e,i,s,r){let{firstLine:n,lastLine:o,perLine:a,perChar:l}=this.heightMetrics(i,r);if(i.lineWrapping){let c=r+(e<i.lineHeight?0:Math.round(Math.max(0,Math.min(1,(e-s)/this.height))*this.length)),h=i.doc.lineAt(c),d=a+h.length*l,f=Math.max(s,e-d/2);return new dt(h.from,h.length,f,d,0)}else{let c=Math.max(0,Math.min(o-n,Math.floor((e-s)/a))),{from:h,length:d}=i.doc.line(n+c);return new dt(h,d,s+a*c,a,0)}}lineAt(e,i,s,r,n){if(i==ne.ByHeight)return this.blockAt(e,s,r,n);if(i==ne.ByPosNoHeight){let{from:u,to:p}=s.doc.lineAt(e);return new dt(u,p-u,0,0,0)}let{firstLine:o,perLine:a,perChar:l}=this.heightMetrics(s,n),c=s.doc.lineAt(e),h=a+c.length*l,d=c.number-o,f=r+a*d+l*(c.from-n-d);return new dt(c.from,c.length,Math.max(r,Math.min(f,r+this.height-h)),h,0)}forEachLine(e,i,s,r,n,o){e=Math.max(e,n),i=Math.min(i,n+this.length);let{firstLine:a,perLine:l,perChar:c}=this.heightMetrics(s,n);for(let h=e,d=r;h<=i;){let f=s.doc.lineAt(h);if(h==e){let p=f.number-a;d+=l*p+c*(e-n-p)}let u=l+c*f.length;o(new dt(f.from,f.length,d,u,0)),d+=u,h=f.to+1}}replace(e,i,s){let r=this.length-i;if(r>0){let n=s[s.length-1];n instanceof Ae?s[s.length-1]=new Ae(n.length+r):s.push(null,new Ae(r-1))}if(e>0){let n=s[0];n instanceof Ae?s[0]=new Ae(e+n.length):s.unshift(new Ae(e-1),null)}return Ne.of(s)}decomposeLeft(e,i){i.push(new Ae(e-1),null)}decomposeRight(e,i){i.push(null,new Ae(this.length-e-1))}updateHeight(e,i=0,s=!1,r){let n=i+this.length;if(r&&r.from<=i+this.length&&r.more){let o=[],a=Math.max(i,r.from),l=-1;for(r.from>i&&o.push(new Ae(r.from-i-1).updateHeight(e,i));a<=n&&r.more;){let h=e.doc.lineAt(a).length;o.length&&o.push(null);let d=r.heights[r.index++],f=0;d<0&&(f=-d,d=r.heights[r.index++]),l==-1?l=d:Math.abs(d-l)>=an&&(l=-2);let u=new Ye(h,d,f);u.outdated=!1,o.push(u),a+=h+1}a<=n&&o.push(null,new Ae(n-a).updateHeight(e,a));let c=Ne.of(o);return(l<0||Math.abs(c.height-this.height)>=an||Math.abs(l-this.heightMetrics(e,i).perLine)>=an)&&(xs=!0),$n(this,c)}else(s||this.outdated)&&(this.setHeight(e.heightForGap(i,i+this.length)),this.outdated=!1);return this}toString(){return`gap(${this.length})`}}class Fb extends Ne{constructor(e,i,s){super(e.length+i+s.length,e.height+s.height,i|(e.outdated||s.outdated?2:0)),this.left=e,this.right=s,this.size=e.size+s.size}get break(){return this.flags&1}blockAt(e,i,s,r){let n=s+this.left.height;return e<n?this.left.blockAt(e,i,s,r):this.right.blockAt(e,i,n,r+this.left.length+this.break)}lineAt(e,i,s,r,n){let o=r+this.left.height,a=n+this.left.length+this.break,l=i==ne.ByHeight?e<o:e<a,c=l?this.left.lineAt(e,i,s,r,n):this.right.lineAt(e,i,s,o,a);if(this.break||(l?c.to<a:c.from>a))return c;let h=i==ne.ByPosNoHeight?ne.ByPosNoHeight:ne.ByPos;return l?c.join(this.right.lineAt(a,h,s,o,a)):this.left.lineAt(a,h,s,r,n).join(c)}forEachLine(e,i,s,r,n,o){let a=r+this.left.height,l=n+this.left.length+this.break;if(this.break)e<l&&this.left.forEachLine(e,i,s,r,n,o),i>=l&&this.right.forEachLine(e,i,s,a,l,o);else{let c=this.lineAt(l,ne.ByPos,s,r,n);e<c.from&&this.left.forEachLine(e,c.from-1,s,r,n,o),c.to>=e&&c.from<=i&&o(c),i>c.to&&this.right.forEachLine(c.to+1,i,s,a,l,o)}}replace(e,i,s){let r=this.left.length+this.break;if(i<r)return this.balanced(this.left.replace(e,i,s),this.right);if(e>this.left.length)return this.balanced(this.left,this.right.replace(e-r,i-r,s));let n=[];e>0&&this.decomposeLeft(e,n);let o=n.length;for(let a of s)n.push(a);if(e>0&&jc(n,o-1),i<this.length){let a=n.length;this.decomposeRight(i,n),jc(n,a)}return Ne.of(n)}decomposeLeft(e,i){let s=this.left.length;if(e<=s)return this.left.decomposeLeft(e,i);i.push(this.left),this.break&&(s++,e>=s&&i.push(null)),e>s&&this.right.decomposeLeft(e-s,i)}decomposeRight(e,i){let s=this.left.length,r=s+this.break;if(e>=r)return this.right.decomposeRight(e-r,i);e<s&&this.left.decomposeRight(e,i),this.break&&e<r&&i.push(null),i.push(this.right)}balanced(e,i){return e.size>2*i.size||i.size>2*e.size?Ne.of(this.break?[e,null,i]:[e,i]):(this.left=$n(this.left,e),this.right=$n(this.right,i),this.setHeight(e.height+i.height),this.outdated=e.outdated||i.outdated,this.size=e.size+i.size,this.length=e.length+this.break+i.length,this)}updateHeight(e,i=0,s=!1,r){let{left:n,right:o}=this,a=i+n.length+this.break,l=null;return r&&r.from<=i+n.length&&r.more?l=n=n.updateHeight(e,i,s,r):n.updateHeight(e,i,s),r&&r.from<=a+o.length&&r.more?l=o=o.updateHeight(e,a,s,r):o.updateHeight(e,a,s),l?this.balanced(n,o):(this.height=this.left.height+this.right.height,this.outdated=!1,this)}toString(){return this.left+(this.break?" ":"-")+this.right}}function jc(t,e){let i,s;t[e]==null&&(i=t[e-1])instanceof Ae&&(s=t[e+1])instanceof Ae&&t.splice(e-1,3,new Ae(i.length+1+s.length))}const Nb=5;class Cl{constructor(e,i){this.pos=e,this.oracle=i,this.nodes=[],this.lineStart=-1,this.lineEnd=-1,this.covering=null,this.writtenTo=e}get isCovered(){return this.covering&&this.nodes[this.nodes.length-1]==this.covering}span(e,i){if(this.lineStart>-1){let s=Math.min(i,this.lineEnd),r=this.nodes[this.nodes.length-1];r instanceof Ye?r.length+=s-this.pos:(s>this.pos||!this.isCovered)&&this.nodes.push(new Ye(s-this.pos,-1,0)),this.writtenTo=s,i>s&&(this.nodes.push(null),this.writtenTo++,this.lineStart=-1)}this.pos=i}point(e,i,s){if(e<i||s.heightRelevant){let r=s.widget?s.widget.estimatedHeight:0,n=s.widget?s.widget.lineBreaks:0;r<0&&(r=this.oracle.lineHeight);let o=i-e;s.block?this.addBlock(new Ff(o,r,s)):(o||n||r>=Nb)&&this.addLineDeco(r,n,o)}else i>e&&this.span(e,i);this.lineEnd>-1&&this.lineEnd<this.pos&&(this.lineEnd=this.oracle.doc.lineAt(this.pos).to)}enterLine(){if(this.lineStart>-1)return;let{from:e,to:i}=this.oracle.doc.lineAt(this.pos);this.lineStart=e,this.lineEnd=i,this.writtenTo<e&&((this.writtenTo<e-1||this.nodes[this.nodes.length-1]==null)&&this.nodes.push(this.blankContent(this.writtenTo,e-1)),this.nodes.push(null)),this.pos>e&&this.nodes.push(new Ye(this.pos-e,-1,0)),this.writtenTo=this.pos}blankContent(e,i){let s=new Ae(i-e);return this.oracle.doc.lineAt(e).to==i&&(s.flags|=4),s}ensureLine(){this.enterLine();let e=this.nodes.length?this.nodes[this.nodes.length-1]:null;if(e instanceof Ye)return e;let i=new Ye(0,-1,0);return this.nodes.push(i),i}addBlock(e){this.enterLine();let i=e.deco;i&&i.startSide>0&&!this.isCovered&&this.ensureLine(),this.nodes.push(e),this.writtenTo=this.pos=this.pos+e.length,i&&i.endSide>0&&(this.covering=e)}addLineDeco(e,i,s){let r=this.ensureLine();r.length+=s,r.collapsed+=s,r.widgetHeight=Math.max(r.widgetHeight,e),r.breaks+=i,this.writtenTo=this.pos=this.pos+s}finish(e){let i=this.nodes.length==0?null:this.nodes[this.nodes.length-1];this.lineStart>-1&&!(i instanceof Ye)&&!this.isCovered?this.nodes.push(new Ye(0,-1,0)):(this.writtenTo<this.pos||i==null)&&this.nodes.push(this.blankContent(this.writtenTo,this.pos));let s=e;for(let r of this.nodes)r instanceof Ye&&r.updateHeight(this.oracle,s),s+=r?r.length:1;return this.nodes}static build(e,i,s,r){let n=new Cl(s,e);return V.spans(i,s,r,n,0),n.finish(s)}}function zb(t,e,i){let s=new Hb;return V.compare(t,e,i,s,0),s.changes}class Hb{constructor(){this.changes=[]}compareRange(){}comparePoint(e,i,s,r){(e<i||s&&s.heightRelevant||r&&r.heightRelevant)&&ls(e,i,this.changes,5)}}function Wb(t,e){let i=t.getBoundingClientRect(),s=t.ownerDocument,r=s.defaultView||window,n=Math.max(0,i.left),o=Math.min(r.innerWidth,i.right),a=Math.max(0,i.top),l=Math.min(r.innerHeight,i.bottom);for(let c=t.parentNode;c&&c!=s.body;)if(c.nodeType==1){let h=c,d=window.getComputedStyle(h);if((h.scrollHeight>h.clientHeight||h.scrollWidth>h.clientWidth)&&d.overflow!="visible"){let f=h.getBoundingClientRect();n=Math.max(n,f.left),o=Math.min(o,f.right),a=Math.max(a,f.top),l=Math.min(c==t.parentNode?r.innerHeight:l,f.bottom)}c=d.position=="absolute"||d.position=="fixed"?h.offsetParent:h.parentNode}else if(c.nodeType==11)c=c.host;else break;return{left:n-i.left,right:Math.max(n,o)-i.left,top:a-(i.top+e),bottom:Math.max(a,l)-(i.top+e)}}function Ub(t){let e=t.getBoundingClientRect(),i=t.ownerDocument.defaultView||window;return e.left<i.innerWidth&&e.right>0&&e.top<i.innerHeight&&e.bottom>0}function qb(t,e){let i=t.getBoundingClientRect();return{left:0,right:i.right-i.left,top:e,bottom:i.bottom-(i.top+e)}}class Eo{constructor(e,i,s,r){this.from=e,this.to=i,this.size=s,this.displaySize=r}static same(e,i){if(e.length!=i.length)return!1;for(let s=0;s<e.length;s++){let r=e[s],n=i[s];if(r.from!=n.from||r.to!=n.to||r.size!=n.size)return!1}return!0}draw(e,i){return N.replace({widget:new Vb(this.displaySize*(i?e.scaleY:e.scaleX),i)}).range(this.from,this.to)}}class Vb extends Gt{constructor(e,i){super(),this.size=e,this.vertical=i}eq(e){return e.size==this.size&&e.vertical==this.vertical}toDOM(){let e=document.createElement("div");return this.vertical?e.style.height=this.size+"px":(e.style.width=this.size+"px",e.style.height="2px",e.style.display="inline-block"),e}get estimatedHeight(){return this.vertical?this.size:-1}}class Kc{constructor(e,i){this.view=e,this.state=i,this.pixelViewport={left:0,right:window.innerWidth,top:0,bottom:0},this.inView=!0,this.paddingTop=0,this.paddingBottom=0,this.contentDOMWidth=0,this.contentDOMHeight=0,this.editorHeight=0,this.editorWidth=0,this.scaleX=1,this.scaleY=1,this.scrollOffset=0,this.scrolledToBottom=!1,this.scrollAnchorPos=0,this.scrollAnchorHeight=-1,this.scaler=Xc,this.scrollTarget=null,this.printing=!1,this.mustMeasureContent=!0,this.defaultTextDirection=ie.LTR,this.visibleRanges=[],this.mustEnforceCursorAssoc=!1;let s=i.facet(xl).some(r=>typeof r!="function"&&r.class=="cm-lineWrapping");this.heightOracle=new Rb(s),this.stateDeco=Jc(i),this.heightMap=Ne.empty().applyChanges(this.stateDeco,X.empty,this.heightOracle.setDoc(i.doc),[new st(0,0,0,i.doc.length)]);for(let r=0;r<2&&(this.viewport=this.getViewport(0,null),!!this.updateForViewport());r++);this.updateViewportLines(),this.lineGaps=this.ensureLineGaps([]),this.lineGapDeco=N.set(this.lineGaps.map(r=>r.draw(this,!1))),this.scrollParent=e.scrollDOM,this.computeVisibleRanges()}updateForViewport(){let e=[this.viewport],{main:i}=this.state.selection;for(let s=0;s<=1;s++){let r=s?i.head:i.anchor;if(!e.some(({from:n,to:o})=>r>=n&&r<=o)){let{from:n,to:o}=this.lineBlockAt(r);e.push(new Fr(n,o))}}return this.viewports=e.sort((s,r)=>s.from-r.from),this.updateScaler()}updateScaler(){let e=this.scaler;return this.scaler=this.heightMap.height<=7e6?Xc:new Ol(this.heightOracle,this.heightMap,this.viewports),e.eq(this.scaler)?0:2}updateViewportLines(){this.viewportLines=[],this.heightMap.forEachLine(this.viewport.from,this.viewport.to,this.heightOracle.setDoc(this.state.doc),0,0,e=>{this.viewportLines.push(Ns(e,this.scaler))})}update(e,i=null){this.state=e.state;let s=this.stateDeco;this.stateDeco=Jc(this.state);let r=e.changedRanges,n=st.extendWithRanges(r,zb(s,this.stateDeco,e?e.changes:ve.empty(this.state.doc.length))),o=this.heightMap.height,a=this.scrolledToBottom?null:this.scrollAnchorAt(this.scrollOffset);Qc(),this.heightMap=this.heightMap.applyChanges(this.stateDeco,e.startState.doc,this.heightOracle.setDoc(this.state.doc),n),(this.heightMap.height!=o||xs)&&(e.flags|=2),a?(this.scrollAnchorPos=e.changes.mapPos(a.from,-1),this.scrollAnchorHeight=a.top):(this.scrollAnchorPos=-1,this.scrollAnchorHeight=o);let l=n.length?this.mapViewport(this.viewport,e.changes):this.viewport;(i&&(i.range.head<l.from||i.range.head>l.to)||!this.viewportIsAppropriate(l))&&(l=this.getViewport(0,i));let c=l.from!=this.viewport.from||l.to!=this.viewport.to;this.viewport=l,e.flags|=this.updateForViewport(),(c||!e.changes.empty||e.flags&2)&&this.updateViewportLines(),(this.lineGaps.length||this.viewport.to-this.viewport.from>4e3)&&this.updateLineGaps(this.ensureLineGaps(this.mapLineGaps(this.lineGaps,e.changes))),e.flags|=this.computeVisibleRanges(e.changes),i&&(this.scrollTarget=i),!this.mustEnforceCursorAssoc&&(e.selectionSet||e.focusChanged)&&e.view.lineWrapping&&e.state.selection.main.empty&&e.state.selection.main.assoc&&!e.state.facet(bf)&&(this.mustEnforceCursorAssoc=!0)}measure(){let{view:e}=this,i=e.contentDOM,s=window.getComputedStyle(i),r=this.heightOracle,n=s.whiteSpace;this.defaultTextDirection=s.direction=="rtl"?ie.RTL:ie.LTR;let o=this.heightOracle.mustRefreshForWrapping(n)||this.mustMeasureContent==="refresh",a=i.getBoundingClientRect(),l=o||this.mustMeasureContent||this.contentDOMHeight!=a.height;this.contentDOMHeight=a.height,this.mustMeasureContent=!1;let c=0,h=0;if(a.width&&a.height){let{scaleX:A,scaleY:$}=Gd(i,a);(A>.005&&Math.abs(this.scaleX-A)>.005||$>.005&&Math.abs(this.scaleY-$)>.005)&&(this.scaleX=A,this.scaleY=$,c|=16,o=l=!0)}let d=(parseInt(s.paddingTop)||0)*this.scaleY,f=(parseInt(s.paddingBottom)||0)*this.scaleY;(this.paddingTop!=d||this.paddingBottom!=f)&&(this.paddingTop=d,this.paddingBottom=f,c|=18),this.editorWidth!=e.scrollDOM.clientWidth&&(r.lineWrapping&&(l=!0),this.editorWidth=e.scrollDOM.clientWidth,c|=16);let u=Zd(this.view.contentDOM,!1).y;u!=this.scrollParent&&(this.scrollParent=u,this.scrollAnchorHeight=-1,this.scrollOffset=0);let p=this.getScrollOffset();this.scrollOffset!=p&&(this.scrollAnchorHeight=-1,this.scrollOffset=p),this.scrolledToBottom=tf(this.scrollParent||e.win);let m=(this.printing?qb:Wb)(i,this.paddingTop),b=m.top-this.pixelViewport.top,x=m.bottom-this.pixelViewport.bottom;this.pixelViewport=m;let k=this.pixelViewport.bottom>this.pixelViewport.top&&this.pixelViewport.right>this.pixelViewport.left;if(k!=this.inView&&(this.inView=k,k&&(l=!0)),!this.inView&&!this.scrollTarget&&!Ub(e.dom))return 0;let O=a.width;if((this.contentDOMWidth!=O||this.editorHeight!=e.scrollDOM.clientHeight)&&(this.contentDOMWidth=a.width,this.editorHeight=e.scrollDOM.clientHeight,c|=16),l){let A=e.docView.measureVisibleLineHeights(this.viewport);if(r.mustRefreshForHeights(A)&&(o=!0),o||r.lineWrapping&&Math.abs(O-this.contentDOMWidth)>r.charWidth){let{lineHeight:$,charWidth:P,textHeight:z}=e.docView.measureTextSize();o=$>0&&r.refresh(n,$,P,z,Math.max(5,O/P),A),o&&(e.docView.minWidth=0,c|=16)}b>0&&x>0?h=Math.max(b,x):b<0&&x<0&&(h=Math.min(b,x)),Qc();for(let $ of this.viewports){let P=$.from==this.viewport.from?A:e.docView.measureVisibleLineHeights($);this.heightMap=(o?Ne.empty().applyChanges(this.stateDeco,X.empty,this.heightOracle,[new st(0,0,0,e.state.doc.length)]):this.heightMap).updateHeight(r,0,o,new Lb($.from,P))}xs&&(c|=2)}let R=!this.viewportIsAppropriate(this.viewport,h)||this.scrollTarget&&(this.scrollTarget.range.head<this.viewport.from||this.scrollTarget.range.head>this.viewport.to);return R&&(c&2&&(c|=this.updateScaler()),this.viewport=this.getViewport(h,this.scrollTarget),c|=this.updateForViewport()),(c&2||R)&&this.updateViewportLines(),(this.lineGaps.length||this.viewport.to-this.viewport.from>4e3)&&this.updateLineGaps(this.ensureLineGaps(o?[]:this.lineGaps,e)),c|=this.computeVisibleRanges(),this.mustEnforceCursorAssoc&&(this.mustEnforceCursorAssoc=!1,e.docView.enforceCursorAssoc()),c}get visibleTop(){return this.scaler.fromDOM(this.pixelViewport.top)}get visibleBottom(){return this.scaler.fromDOM(this.pixelViewport.bottom)}getViewport(e,i){let s=.5-Math.max(-.5,Math.min(.5,e/1e3/2)),r=this.heightMap,n=this.heightOracle,{visibleTop:o,visibleBottom:a}=this,l=new Fr(r.lineAt(o-s*1e3,ne.ByHeight,n,0,0).from,r.lineAt(a+(1-s)*1e3,ne.ByHeight,n,0,0).to);if(i){let{head:c}=i.range;if(c<l.from||c>l.to){let h=Math.min(this.editorHeight,this.pixelViewport.bottom-this.pixelViewport.top),d=r.lineAt(c,ne.ByPos,n,0,0),f;i.y=="center"?f=(d.top+d.bottom)/2-h/2:i.y=="start"||i.y=="nearest"&&c<l.from?f=d.top:f=d.bottom-h,l=new Fr(r.lineAt(f-1e3/2,ne.ByHeight,n,0,0).from,r.lineAt(f+h+1e3/2,ne.ByHeight,n,0,0).to)}}return l}mapViewport(e,i){let s=i.mapPos(e.from,-1),r=i.mapPos(e.to,1);return new Fr(this.heightMap.lineAt(s,ne.ByPos,this.heightOracle,0,0).from,this.heightMap.lineAt(r,ne.ByPos,this.heightOracle,0,0).to)}viewportIsAppropriate({from:e,to:i},s=0){if(!this.inView)return!0;let{top:r}=this.heightMap.lineAt(e,ne.ByPos,this.heightOracle,0,0),{bottom:n}=this.heightMap.lineAt(i,ne.ByPos,this.heightOracle,0,0),{visibleTop:o,visibleBottom:a}=this;return(e==0||r<=o-Math.max(10,Math.min(-s,250)))&&(i==this.state.doc.length||n>=a+Math.max(10,Math.min(s,250)))&&r>o-2*1e3&&n<a+2*1e3}mapLineGaps(e,i){if(!e.length||i.empty)return e;let s=[];for(let r of e)i.touchesRange(r.from,r.to)||s.push(new Eo(i.mapPos(r.from),i.mapPos(r.to),r.size,r.displaySize));return s}ensureLineGaps(e,i){let s=this.heightOracle.lineWrapping,r=s?1e4:2e3,n=r>>1,o=r<<1;if(this.defaultTextDirection!=ie.LTR&&!s)return[];let a=[],l=(h,d,f,u)=>{if(d-h<n)return;let p=this.state.selection.main,m=[p.from];p.empty||m.push(p.to);for(let x of m)if(x>h&&x<d){l(h,x-10,f,u),l(x+10,d,f,u);return}let b=jb(e,x=>x.from>=f.from&&x.to<=f.to&&Math.abs(x.from-h)<n&&Math.abs(x.to-d)<n&&!m.some(k=>x.from<k&&x.to>k));if(!b){if(d<f.to&&i&&s&&i.visibleRanges.some(O=>O.from<=d&&O.to>=d)){let O=i.moveToLineBoundary(C.cursor(d),!1,!0).head;O>h&&(d=O)}let x=this.gapSize(f,h,d,u),k=s||x<2e6?x:2e6;b=new Eo(h,d,x,k)}a.push(b)},c=h=>{if(h.length<o||h.type!=Pe.Text)return;let d=Qb(h.from,h.to,this.stateDeco);if(d.total<o)return;let f=this.scrollTarget?this.scrollTarget.range.head:null,u,p;if(s){let m=r/this.heightOracle.lineLength*this.heightOracle.lineHeight,b,x;if(f!=null){let k=zr(d,f),O=((this.visibleBottom-this.visibleTop)/2+m)/h.height;b=k-O,x=k+O}else b=(this.visibleTop-h.top-m)/h.height,x=(this.visibleBottom-h.top+m)/h.height;u=Nr(d,b),p=Nr(d,x)}else{let m=d.total*this.heightOracle.charWidth,b=r*this.heightOracle.charWidth,x=0;if(m>2e6)for(let $ of e)$.from>=h.from&&$.from<h.to&&$.size!=$.displaySize&&$.from*this.heightOracle.charWidth+x<this.pixelViewport.left&&(x=$.size-$.displaySize);let k=this.pixelViewport.left+x,O=this.pixelViewport.right+x,R,A;if(f!=null){let $=zr(d,f),P=((O-k)/2+b)/m;R=$-P,A=$+P}else R=(k-b)/m,A=(O+b)/m;u=Nr(d,R),p=Nr(d,A)}u>h.from&&l(h.from,u,h,d),p<h.to&&l(p,h.to,h,d)};for(let h of this.viewportLines)Array.isArray(h.type)?h.type.forEach(c):c(h);return a}gapSize(e,i,s,r){let n=zr(r,s)-zr(r,i);return this.heightOracle.lineWrapping?e.height*n:r.total*this.heightOracle.charWidth*n}updateLineGaps(e){Eo.same(e,this.lineGaps)||(this.lineGaps=e,this.lineGapDeco=N.set(e.map(i=>i.draw(this,this.heightOracle.lineWrapping))))}computeVisibleRanges(e){let i=this.stateDeco;this.lineGaps.length&&(i=i.concat(this.lineGapDeco));let s=[];V.spans(i,this.viewport.from,this.viewport.to,{span(n,o){s.push({from:n,to:o})},point(){}},20);let r=0;if(s.length!=this.visibleRanges.length)r=12;else for(let n=0;n<s.length&&!(r&8);n++){let o=this.visibleRanges[n],a=s[n];(o.from!=a.from||o.to!=a.to)&&(r|=4,e&&e.mapPos(o.from,-1)==a.from&&e.mapPos(o.to,1)==a.to||(r|=8))}return this.visibleRanges=s,r}lineBlockAt(e){return e>=this.viewport.from&&e<=this.viewport.to&&this.viewportLines.find(i=>i.from<=e&&i.to>=e)||Ns(this.heightMap.lineAt(e,ne.ByPos,this.heightOracle,0,0),this.scaler)}lineBlockAtHeight(e){return e>=this.viewportLines[0].top&&e<=this.viewportLines[this.viewportLines.length-1].bottom&&this.viewportLines.find(i=>i.top<=e&&i.bottom>=e)||Ns(this.heightMap.lineAt(this.scaler.fromDOM(e),ne.ByHeight,this.heightOracle,0,0),this.scaler)}getScrollOffset(){return(this.scrollParent==this.view.scrollDOM?this.scrollParent.scrollTop:(this.scrollParent?this.scrollParent.getBoundingClientRect().top:0)-this.view.contentDOM.getBoundingClientRect().top)*this.scaleY}scrollAnchorAt(e){let i=this.lineBlockAtHeight(e+8);return i.from>=this.viewport.from||this.viewportLines[0].top-e>200?i:this.viewportLines[0]}elementAtHeight(e){return Ns(this.heightMap.blockAt(this.scaler.fromDOM(e),this.heightOracle,0,0),this.scaler)}get docHeight(){return this.scaler.toDOM(this.heightMap.height)}get contentHeight(){return this.docHeight+this.paddingTop+this.paddingBottom}}class Fr{constructor(e,i){this.from=e,this.to=i}}function Qb(t,e,i){let s=[],r=t,n=0;return V.spans(i,t,e,{span(){},point(o,a){o>r&&(s.push({from:r,to:o}),n+=o-r),r=a}},20),r<e&&(s.push({from:r,to:e}),n+=e-r),{total:n,ranges:s}}function Nr({total:t,ranges:e},i){if(i<=0)return e[0].from;if(i>=1)return e[e.length-1].to;let s=Math.floor(t*i);for(let r=0;;r++){let{from:n,to:o}=e[r],a=o-n;if(s<=a)return n+s;s-=a}}function zr(t,e){let i=0;for(let{from:s,to:r}of t.ranges){if(e<=r){i+=e-s;break}i+=r-s}return i/t.total}function jb(t,e){for(let i of t)if(e(i))return i}const Xc={toDOM(t){return t},fromDOM(t){return t},scale:1,eq(t){return t==this}};function Jc(t){let e=t.facet(eo).filter(s=>typeof s!="function"),i=t.facet(wl).filter(s=>typeof s!="function");return i.length&&e.push(V.join(i)),e}class Ol{constructor(e,i,s){let r=0,n=0,o=0;this.viewports=s.map(({from:a,to:l})=>{let c=i.lineAt(a,ne.ByPos,e,0,0).top,h=i.lineAt(l,ne.ByPos,e,0,0).bottom;return r+=h-c,{from:a,to:l,top:c,bottom:h,domTop:0,domBottom:0}}),this.scale=(7e6-r)/(i.height-r);for(let a of this.viewports)a.domTop=o+(a.top-n)*this.scale,o=a.domBottom=a.domTop+(a.bottom-a.top),n=a.bottom}toDOM(e){for(let i=0,s=0,r=0;;i++){let n=i<this.viewports.length?this.viewports[i]:null;if(!n||e<n.top)return r+(e-s)*this.scale;if(e<=n.bottom)return n.domTop+(e-n.top);s=n.bottom,r=n.domBottom}}fromDOM(e){for(let i=0,s=0,r=0;;i++){let n=i<this.viewports.length?this.viewports[i]:null;if(!n||e<n.domTop)return s+(e-r)/this.scale;if(e<=n.domBottom)return n.top+(e-n.domTop);s=n.bottom,r=n.domBottom}}eq(e){return e instanceof Ol?this.scale==e.scale&&this.viewports.length==e.viewports.length&&this.viewports.every((i,s)=>i.from==e.viewports[s].from&&i.to==e.viewports[s].to):!1}}function Ns(t,e){if(e.scale==1)return t;let i=e.toDOM(t.top),s=e.toDOM(t.bottom);return new dt(t.from,t.length,i,s-i,Array.isArray(t._content)?t._content.map(r=>Ns(r,e)):t._content)}const Hr=_.define({combine:t=>t.join(" ")}),Da=_.define({combine:t=>t.indexOf(!0)>-1}),_a=hi.newName(),Nf=hi.newName(),zf=hi.newName(),Hf={"&light":"."+Nf,"&dark":"."+zf};function Ba(t,e,i){return new hi(e,{finish(s){return/&/.test(s)?s.replace(/&\w*/,r=>{if(r=="&")return t;if(!i||!i[r])throw new RangeError(`Unsupported selector: ${r}`);return i[r]}):t+" "+s}})}const Kb=Ba("."+_a,{"&":{position:"relative !important",boxSizing:"border-box","&.cm-focused":{outline:"1px dotted #212121"},display:"flex !important",flexDirection:"column"},".cm-scroller":{display:"flex !important",alignItems:"flex-start !important",fontFamily:"monospace",lineHeight:1.4,height:"100%",overflowX:"auto",position:"relative",zIndex:0,overflowAnchor:"none"},".cm-content":{margin:0,flexGrow:2,flexShrink:0,display:"block",whiteSpace:"pre",wordWrap:"normal",boxSizing:"border-box",minHeight:"100%",padding:"4px 0",outline:"none","&[contenteditable=true]":{WebkitUserModify:"read-write-plaintext-only"}},".cm-lineWrapping":{whiteSpace_fallback:"pre-wrap",whiteSpace:"break-spaces",wordBreak:"break-word",overflowWrap:"anywhere",flexShrink:1},"&light .cm-content":{caretColor:"black"},"&dark .cm-content":{caretColor:"white"},".cm-line":{display:"block",padding:"0 2px 0 6px"},".cm-layer":{position:"absolute",left:0,top:0,contain:"size style","& > *":{position:"absolute"}},"&light .cm-selectionBackground":{background:"#d9d9d9"},"&dark .cm-selectionBackground":{background:"#222"},"&light.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground":{background:"#d7d4f0"},"&dark.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground":{background:"#233"},".cm-cursorLayer":{pointerEvents:"none"},"&.cm-focused > .cm-scroller > .cm-cursorLayer":{animation:"steps(1) cm-blink 1.2s infinite"},"@keyframes cm-blink":{"0%":{},"50%":{opacity:0},"100%":{}},"@keyframes cm-blink2":{"0%":{},"50%":{opacity:0},"100%":{}},".cm-cursor, .cm-dropCursor":{borderLeft:"1.2px solid black",marginLeft:"-0.6px",pointerEvents:"none"},".cm-cursor":{display:"none"},"&dark .cm-cursor":{borderLeftColor:"#ddd"},".cm-selectionHandle":{backgroundColor:"currentColor",width:"1.5px"},".cm-selectionHandle-start::before, .cm-selectionHandle-end::before":{content:'""',backgroundColor:"inherit",borderRadius:"50%",width:"8px",height:"8px",position:"absolute",left:"-3.25px"},".cm-selectionHandle-start::before":{top:"-8px"},".cm-selectionHandle-end::before":{bottom:"-8px"},".cm-dropCursor":{position:"absolute"},"&.cm-focused > .cm-scroller > .cm-cursorLayer .cm-cursor":{display:"block"},".cm-iso":{unicodeBidi:"isolate"},".cm-announced":{position:"fixed",top:"-10000px"},"@media print":{".cm-announced":{display:"none"}},"&light .cm-activeLine":{backgroundColor:"#cceeff44"},"&dark .cm-activeLine":{backgroundColor:"#99eeff33"},"&light .cm-specialChar":{color:"red"},"&dark .cm-specialChar":{color:"#f78"},".cm-gutters":{flexShrink:0,display:"flex",height:"100%",boxSizing:"border-box",zIndex:200},".cm-gutters-before":{insetInlineStart:0},".cm-gutters-after":{insetInlineEnd:0},"&light .cm-gutters":{backgroundColor:"#f5f5f5",color:"#6c6c6c",border:"0px solid #ddd","&.cm-gutters-before":{borderRightWidth:"1px"},"&.cm-gutters-after":{borderLeftWidth:"1px"}},"&dark .cm-gutters":{backgroundColor:"#333338",color:"#ccc"},".cm-gutter":{display:"flex !important",flexDirection:"column",flexShrink:0,boxSizing:"border-box",minHeight:"100%",overflow:"hidden"},".cm-gutterElement":{boxSizing:"border-box"},".cm-lineNumbers .cm-gutterElement":{padding:"0 3px 0 5px",minWidth:"20px",textAlign:"right",whiteSpace:"nowrap"},"&light .cm-activeLineGutter":{backgroundColor:"#e2f2ff"},"&dark .cm-activeLineGutter":{backgroundColor:"#222227"},".cm-panels":{boxSizing:"border-box",position:"sticky",left:0,right:0,zIndex:300},"&light .cm-panels":{backgroundColor:"#f5f5f5",color:"black"},"&light .cm-panels-top":{borderBottom:"1px solid #ddd"},"&light .cm-panels-bottom":{borderTop:"1px solid #ddd"},"&dark .cm-panels":{backgroundColor:"#333338",color:"white"},".cm-dialog":{padding:"2px 19px 4px 6px",position:"relative","& label":{fontSize:"80%"}},".cm-dialog-close":{position:"absolute",top:"3px",right:"4px",backgroundColor:"inherit",border:"none",font:"inherit",fontSize:"14px",padding:"0"},".cm-tab":{display:"inline-block",overflow:"hidden",verticalAlign:"bottom"},".cm-widgetBuffer":{verticalAlign:"text-top",height:"1em",width:0,display:"inline"},".cm-placeholder":{color:"#888",display:"inline-block",verticalAlign:"top",userSelect:"none"},".cm-highlightSpace":{backgroundImage:"radial-gradient(circle at 50% 55%, #aaa 20%, transparent 5%)",backgroundPosition:"center"},".cm-highlightTab":{backgroundImage:`url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="20"><path stroke="%23888" stroke-width="1" fill="none" d="M1 10H196L190 5M190 15L196 10M197 4L197 16"/></svg>')`,backgroundSize:"auto 100%",backgroundPosition:"right 90%",backgroundRepeat:"no-repeat"},".cm-trailingSpace":{backgroundColor:"#ff332255"},".cm-button":{verticalAlign:"middle",color:"inherit",fontSize:"70%",padding:".2em 1em",borderRadius:"1px"},"&light .cm-button":{backgroundImage:"linear-gradient(#eff1f5, #d9d9df)",border:"1px solid #888","&:active":{backgroundImage:"linear-gradient(#b4b4b4, #d0d3d6)"}},"&dark .cm-button":{backgroundImage:"linear-gradient(#393939, #111)",border:"1px solid #888","&:active":{backgroundImage:"linear-gradient(#111, #333)"}},".cm-textfield":{verticalAlign:"middle",color:"inherit",fontSize:"70%",border:"1px solid silver",padding:".2em .5em"},"&light .cm-textfield":{backgroundColor:"white"},"&dark .cm-textfield":{border:"1px solid #555",backgroundColor:"inherit"}},Hf),Xb={childList:!0,characterData:!0,subtree:!0,attributes:!0,characterDataOldValue:!0},Do=D.ie&&D.ie_version<=11;class Jb{constructor(e){this.view=e,this.active=!1,this.editContext=null,this.selectionRange=new Am,this.selectionChanged=!1,this.delayedFlush=-1,this.resizeTimeout=-1,this.queue=[],this.delayedAndroidKey=null,this.flushingAndroidKey=-1,this.lastChange=0,this.scrollTargets=[],this.intersection=null,this.resizeScroll=null,this.intersecting=!1,this.gapIntersection=null,this.gaps=[],this.printQuery=null,this.parentCheck=-1,this.dom=e.contentDOM,this.observer=new MutationObserver(i=>{for(let s of i)this.queue.push(s);(D.ie&&D.ie_version<=11||D.ios&&e.composing)&&i.some(s=>s.type=="childList"&&s.removedNodes.length||s.type=="characterData"&&s.oldValue.length>s.target.nodeValue.length)?this.flushSoon():this.flush()}),window.EditContext&&D.android&&e.constructor.EDIT_CONTEXT!==!1&&!(D.chrome&&D.chrome_version<126)&&(this.editContext=new Gb(e),e.state.facet(qt)&&(e.contentDOM.editContext=this.editContext.editContext)),Do&&(this.onCharData=i=>{this.queue.push({target:i.target,type:"characterData",oldValue:i.prevValue}),this.flushSoon()}),this.onSelectionChange=this.onSelectionChange.bind(this),this.onResize=this.onResize.bind(this),this.onPrint=this.onPrint.bind(this),this.onScroll=this.onScroll.bind(this),window.matchMedia&&(this.printQuery=window.matchMedia("print")),typeof ResizeObserver=="function"&&(this.resizeScroll=new ResizeObserver(()=>{var i;((i=this.view.docView)===null||i===void 0?void 0:i.lastUpdate)<Date.now()-75&&this.onResize()}),this.resizeScroll.observe(e.scrollDOM)),this.addWindowListeners(this.win=e.win),this.start(),typeof IntersectionObserver=="function"&&(this.intersection=new IntersectionObserver(i=>{this.parentCheck<0&&(this.parentCheck=setTimeout(this.listenForScroll.bind(this),1e3)),i.length>0&&i[i.length-1].intersectionRatio>0!=this.intersecting&&(this.intersecting=!this.intersecting,this.intersecting!=this.view.inView&&this.onScrollChanged(document.createEvent("Event")))},{threshold:[0,.001]}),this.intersection.observe(this.dom),this.gapIntersection=new IntersectionObserver(i=>{i.length>0&&i[i.length-1].intersectionRatio>0&&this.onScrollChanged(document.createEvent("Event"))},{})),this.listenForScroll(),this.readSelectionRange()}onScrollChanged(e){this.view.inputState.runHandlers("scroll",e),this.intersecting&&this.view.measure()}onScroll(e){this.intersecting&&this.flush(!1),this.editContext&&this.view.requestMeasure(this.editContext.measureReq),this.onScrollChanged(e)}onResize(){this.resizeTimeout<0&&(this.resizeTimeout=setTimeout(()=>{this.resizeTimeout=-1,this.view.requestMeasure()},50))}onPrint(e){(e.type=="change"||!e.type)&&!e.matches||(this.view.viewState.printing=!0,this.view.measure(),setTimeout(()=>{this.view.viewState.printing=!1,this.view.requestMeasure()},500))}updateGaps(e){if(this.gapIntersection&&(e.length!=this.gaps.length||this.gaps.some((i,s)=>i!=e[s]))){this.gapIntersection.disconnect();for(let i of e)this.gapIntersection.observe(i);this.gaps=e}}onSelectionChange(e){let i=this.selectionChanged;if(!this.readSelectionRange()||this.delayedAndroidKey)return;let{view:s}=this,r=this.selectionRange;if(s.state.facet(qt)?s.root.activeElement!=this.dom:!Qs(this.dom,r))return;let n=r.anchorNode&&s.docView.tile.nearest(r.anchorNode);if(n&&n.isWidget()&&n.widget.ignoreEvent(e)){i||(this.selectionChanged=!1);return}(D.ie&&D.ie_version<=11||D.android&&D.chrome)&&!s.state.selection.main.empty&&r.focusNode&&js(r.focusNode,r.focusOffset,r.anchorNode,r.anchorOffset)?this.flushSoon():this.flush(!1)}readSelectionRange(){let{view:e}=this,i=ar(e.root);if(!i)return!1;let s=D.safari&&e.root.nodeType==11&&e.root.activeElement==this.dom&&Yb(this.view,i)||i;if(!s||this.selectionRange.eq(s))return!1;let r=Qs(this.dom,s);return r&&!this.selectionChanged&&e.inputState.lastFocusTime>Date.now()-200&&e.inputState.lastTouchTime<Date.now()-300&&Pm(this.dom,s)?(this.view.inputState.lastFocusTime=0,e.docView.updateSelection(),!1):(this.selectionRange.setRange(s),r&&(this.selectionChanged=!0),!0)}setSelectionRange(e,i){this.selectionRange.set(e.node,e.offset,i.node,i.offset),this.selectionChanged=!1}clearSelectionRange(){this.selectionRange.set(null,0,null,0)}listenForScroll(){this.parentCheck=-1;let e=0,i=null;for(let s=this.dom;s;)if(s.nodeType==1)!i&&e<this.scrollTargets.length&&this.scrollTargets[e]==s?e++:i||(i=this.scrollTargets.slice(0,e)),i&&i.push(s),s=s.assignedSlot||s.parentNode;else if(s.nodeType==11)s=s.host;else break;if(e<this.scrollTargets.length&&!i&&(i=this.scrollTargets.slice(0,e)),i){for(let s of this.scrollTargets)s.removeEventListener("scroll",this.onScroll);for(let s of this.scrollTargets=i)s.addEventListener("scroll",this.onScroll)}}ignore(e){if(!this.active)return e();try{return this.stop(),e()}finally{this.start(),this.clear()}}start(){this.active||(this.observer.observe(this.dom,Xb),Do&&this.dom.addEventListener("DOMCharacterDataModified",this.onCharData),this.active=!0)}stop(){this.active&&(this.active=!1,this.observer.disconnect(),Do&&this.dom.removeEventListener("DOMCharacterDataModified",this.onCharData))}clear(){this.processRecords(),this.queue.length=0,this.selectionChanged=!1}delayAndroidKey(e,i){var s;if(!this.delayedAndroidKey){let r=()=>{let n=this.delayedAndroidKey;n&&(this.clearDelayedAndroidKey(),this.view.inputState.lastKeyCode=n.keyCode,this.view.inputState.lastKeyTime=Date.now(),!this.flush()&&n.force&&cs(this.dom,n.key,n.keyCode))};this.flushingAndroidKey=this.view.win.requestAnimationFrame(r)}(!this.delayedAndroidKey||e=="Enter")&&(this.delayedAndroidKey={key:e,keyCode:i,force:this.lastChange<Date.now()-50||!!(!((s=this.delayedAndroidKey)===null||s===void 0)&&s.force)})}clearDelayedAndroidKey(){this.win.cancelAnimationFrame(this.flushingAndroidKey),this.delayedAndroidKey=null,this.flushingAndroidKey=-1}flushSoon(){this.delayedFlush<0&&(this.delayedFlush=this.view.win.requestAnimationFrame(()=>{this.delayedFlush=-1,this.flush()}))}forceFlush(){this.delayedFlush>=0&&(this.view.win.cancelAnimationFrame(this.delayedFlush),this.delayedFlush=-1),this.flush()}pendingRecords(){for(let e of this.observer.takeRecords())this.queue.push(e);return this.queue}processRecords(){let e=this.pendingRecords();e.length&&(this.queue=[]);let i=-1,s=-1,r=!1;for(let n of e){let o=this.readMutation(n);o&&(o.typeOver&&(r=!0),i==-1?{from:i,to:s}=o:(i=Math.min(o.from,i),s=Math.max(o.to,s)))}return{from:i,to:s,typeOver:r}}readChange(){let{from:e,to:i,typeOver:s}=this.processRecords(),r=this.selectionChanged&&Qs(this.dom,this.selectionRange);if(e<0&&!r)return null;e>-1&&(this.lastChange=Date.now()),this.view.inputState.lastFocusTime=0,this.selectionChanged=!1;let n=new gb(this.view,e,i,s);return this.view.docView.domChanged={newSel:n.newSel?n.newSel.main:null},n}flush(e=!0){if(this.delayedFlush>=0||this.delayedAndroidKey)return!1;e&&this.readSelectionRange();let i=this.readChange();if(!i)return this.view.requestMeasure(),!1;let s=this.view.state,r=Pf(this.view,i);return this.view.state==s&&(i.domChanged||i.newSel&&!An(this.view.state.selection,i.newSel.main))&&this.view.update([]),r}readMutation(e){let i=this.view.docView.tile.nearest(e.target);if(!i||i.isWidget())return null;if(i.markDirty(e.type=="attributes"),e.type=="childList"){let s=Yc(i,e.previousSibling||e.target.previousSibling,-1),r=Yc(i,e.nextSibling||e.target.nextSibling,1);return{from:s?i.posAfter(s):i.posAtStart,to:r?i.posBefore(r):i.posAtEnd,typeOver:!1}}else return e.type=="characterData"?{from:i.posAtStart,to:i.posAtEnd,typeOver:e.target.nodeValue==e.oldValue}:null}setWindow(e){e!=this.win&&(this.removeWindowListeners(this.win),this.win=e,this.addWindowListeners(this.win))}addWindowListeners(e){e.addEventListener("resize",this.onResize),this.printQuery?this.printQuery.addEventListener?this.printQuery.addEventListener("change",this.onPrint):this.printQuery.addListener(this.onPrint):e.addEventListener("beforeprint",this.onPrint),e.addEventListener("scroll",this.onScroll),e.document.addEventListener("selectionchange",this.onSelectionChange)}removeWindowListeners(e){e.removeEventListener("scroll",this.onScroll),e.removeEventListener("resize",this.onResize),this.printQuery?this.printQuery.removeEventListener?this.printQuery.removeEventListener("change",this.onPrint):this.printQuery.removeListener(this.onPrint):e.removeEventListener("beforeprint",this.onPrint),e.document.removeEventListener("selectionchange",this.onSelectionChange)}update(e){this.editContext&&(this.editContext.update(e),e.startState.facet(qt)!=e.state.facet(qt)&&(e.view.contentDOM.editContext=e.state.facet(qt)?this.editContext.editContext:null))}destroy(){var e,i,s;this.stop(),(e=this.intersection)===null||e===void 0||e.disconnect(),(i=this.gapIntersection)===null||i===void 0||i.disconnect(),(s=this.resizeScroll)===null||s===void 0||s.disconnect();for(let r of this.scrollTargets)r.removeEventListener("scroll",this.onScroll);this.removeWindowListeners(this.win),clearTimeout(this.parentCheck),clearTimeout(this.resizeTimeout),this.win.cancelAnimationFrame(this.delayedFlush),this.win.cancelAnimationFrame(this.flushingAndroidKey),this.editContext&&(this.view.contentDOM.editContext=null,this.editContext.destroy())}}function Yc(t,e,i){for(;e;){let s=ue.get(e);if(s&&s.parent==t)return s;let r=e.parentNode;e=r!=t.dom?r:i>0?e.nextSibling:e.previousSibling}return null}function Gc(t,e){let i=e.startContainer,s=e.startOffset,r=e.endContainer,n=e.endOffset,o=t.docView.domAtPos(t.state.selection.main.anchor,1);return js(o.node,o.offset,r,n)&&([i,s,r,n]=[r,n,i,s]),{anchorNode:i,anchorOffset:s,focusNode:r,focusOffset:n}}function Yb(t,e){if(e.getComposedRanges){let r=e.getComposedRanges(t.root)[0];if(r)return Gc(t,r)}let i=null;function s(r){r.preventDefault(),r.stopImmediatePropagation(),i=r.getTargetRanges()[0]}return t.contentDOM.addEventListener("beforeinput",s,!0),t.dom.ownerDocument.execCommand("indent"),t.contentDOM.removeEventListener("beforeinput",s,!0),i?Gc(t,i):null}class Gb{constructor(e){this.from=0,this.to=0,this.pendingContextChange=null,this.handlers=Object.create(null),this.composing=null,this.resetRange(e.state);let i=this.editContext=new window.EditContext({text:e.state.doc.sliceString(this.from,this.to),selectionStart:this.toContextPos(Math.max(this.from,Math.min(this.to,e.state.selection.main.anchor))),selectionEnd:this.toContextPos(e.state.selection.main.head)});this.handlers.textupdate=s=>{let r=e.state.selection.main,{anchor:n,head:o}=r,a=this.toEditorPos(s.updateRangeStart),l=this.toEditorPos(s.updateRangeEnd);e.inputState.composing>=0&&!this.composing&&(this.composing={contextBase:s.updateRangeStart,editorBase:a,drifted:!1});let c=l-a>s.text.length;a==this.from&&n<this.from?a=n:l==this.to&&n>this.to&&(l=n);let h=Tf(e.state.sliceDoc(a,l),s.text,(c?r.from:r.to)-a,c?"end":null);if(!h){let f=C.single(this.toEditorPos(s.selectionStart),this.toEditorPos(s.selectionEnd));An(f,r)||e.dispatch({selection:f,userEvent:"select"});return}let d={from:h.from+a,to:h.toA+a,insert:X.of(s.text.slice(h.from,h.toB).split(`
`))};if((D.mac||D.android)&&d.from==o-1&&/^\. ?$/.test(s.text)&&e.contentDOM.getAttribute("autocorrect")=="off"&&(d={from:a,to:l,insert:X.of([s.text.replace("."," ")])}),this.pendingContextChange=d,!e.state.readOnly){let f=this.to-this.from+(d.to-d.from+d.insert.length);Sl(e,d,C.single(this.toEditorPos(s.selectionStart,f),this.toEditorPos(s.selectionEnd,f)))}this.pendingContextChange&&(this.revertPending(e.state),this.setSelection(e.state)),d.from<d.to&&!d.insert.length&&e.inputState.composing>=0&&!/[\\p{Alphabetic}\\p{Number}_]/.test(i.text.slice(Math.max(0,s.updateRangeStart-1),Math.min(i.text.length,s.updateRangeStart+1)))&&this.handlers.compositionend(s)},this.handlers.characterboundsupdate=s=>{let r=[],n=null;for(let o=this.toEditorPos(s.rangeStart),a=this.toEditorPos(s.rangeEnd);o<a;o++){let l=e.coordsForChar(o);n=l&&new DOMRect(l.left,l.top,l.right-l.left,l.bottom-l.top)||n||new DOMRect,r.push(n)}i.updateCharacterBounds(s.rangeStart,r)},this.handlers.textformatupdate=s=>{let r=[];for(let n of s.getTextFormats()){let o=n.underlineStyle,a=n.underlineThickness;if(!/none/i.test(o)&&!/none/i.test(a)){let l=this.toEditorPos(n.rangeStart),c=this.toEditorPos(n.rangeEnd);if(l<c){let h=`text-decoration: underline ${/^[a-z]/.test(o)?o+" ":o=="Dashed"?"dashed ":o=="Squiggle"?"wavy ":""}${/thin/i.test(a)?1:2}px`;r.push(N.mark({attributes:{style:h}}).range(l,c))}}}e.dispatch({effects:yf.of(N.set(r))})},this.handlers.compositionstart=()=>{e.inputState.composing<0&&(e.inputState.composing=0,e.inputState.compositionFirstChange=!0)},this.handlers.compositionend=()=>{if(e.inputState.composing=-1,e.inputState.compositionFirstChange=null,this.composing){let{drifted:s}=this.composing;this.composing=null,s&&this.reset(e.state)}};for(let s in this.handlers)i.addEventListener(s,this.handlers[s]);this.measureReq={read:s=>{this.editContext.updateControlBounds(s.contentDOM.getBoundingClientRect());let r=ar(s.root);r&&r.rangeCount&&this.editContext.updateSelectionBounds(r.getRangeAt(0).getBoundingClientRect())}}}applyEdits(e){let i=0,s=!1,r=this.pendingContextChange;return e.changes.iterChanges((n,o,a,l,c)=>{if(s)return;let h=c.length-(o-n);if(r&&o>=r.to)if(r.from==n&&r.to==o&&r.insert.eq(c)){r=this.pendingContextChange=null,i+=h,this.to+=h;return}else r=null,this.revertPending(e.state);if(n+=i,o+=i,o<=this.from)this.from+=h,this.to+=h;else if(n<this.to){if(n<this.from||o>this.to||this.to-this.from+c.length>3e4){s=!0;return}this.editContext.updateText(this.toContextPos(n),this.toContextPos(o),c.toString()),this.to+=h}i+=h}),r&&!s&&this.revertPending(e.state),!s}update(e){let i=this.pendingContextChange,s=e.startState.selection.main;this.composing&&(this.composing.drifted||!e.changes.touchesRange(s.from,s.to)&&e.transactions.some(r=>!r.isUserEvent("input.type")&&r.changes.touchesRange(this.from,this.to)))?(this.composing.drifted=!0,this.composing.editorBase=e.changes.mapPos(this.composing.editorBase)):!this.applyEdits(e)||!this.rangeIsValid(e.state)?(this.pendingContextChange=null,this.reset(e.state)):(e.docChanged||e.selectionSet||i)&&this.setSelection(e.state),(e.geometryChanged||e.docChanged||e.selectionSet)&&e.view.requestMeasure(this.measureReq)}resetRange(e){let{head:i}=e.selection.main;this.from=Math.max(0,i-1e4),this.to=Math.min(e.doc.length,i+1e4)}reset(e){this.resetRange(e),this.editContext.updateText(0,this.editContext.text.length,e.doc.sliceString(this.from,this.to)),this.setSelection(e)}revertPending(e){let i=this.pendingContextChange;this.pendingContextChange=null,this.editContext.updateText(this.toContextPos(i.from),this.toContextPos(i.from+i.insert.length),e.doc.sliceString(i.from,i.to))}setSelection(e){let{main:i}=e.selection,s=this.toContextPos(Math.max(this.from,Math.min(this.to,i.anchor))),r=this.toContextPos(i.head);(this.editContext.selectionStart!=s||this.editContext.selectionEnd!=r)&&this.editContext.updateSelection(s,r)}rangeIsValid(e){let{head:i}=e.selection.main;return!(this.from>0&&i-this.from<500||this.to<e.doc.length&&this.to-i<500||this.to-this.from>1e4*3)}toEditorPos(e,i=this.to-this.from){e=Math.min(e,i);let s=this.composing;return s&&s.drifted?s.editorBase+(e-s.contextBase):e+this.from}toContextPos(e){let i=this.composing;return i&&i.drifted?i.contextBase+(e-i.editorBase):e-this.from}destroy(){for(let e in this.handlers)this.editContext.removeEventListener(e,this.handlers[e])}}class B{get state(){return this.viewState.state}get viewport(){return this.viewState.viewport}get visibleRanges(){return this.viewState.visibleRanges}get inView(){return this.viewState.inView}get composing(){return!!this.inputState&&this.inputState.composing>0}get compositionStarted(){return!!this.inputState&&this.inputState.composing>=0}get root(){return this._root}get win(){return this.dom.ownerDocument.defaultView||window}constructor(e={}){var i;this.plugins=[],this.pluginMap=new Map,this.editorAttrs={},this.contentAttrs={},this.bidiCache=[],this.destroyed=!1,this.updateState=2,this.measureScheduled=-1,this.measureRequests=[],this.contentDOM=document.createElement("div"),this.scrollDOM=document.createElement("div"),this.scrollDOM.tabIndex=-1,this.scrollDOM.className="cm-scroller",this.scrollDOM.appendChild(this.contentDOM),this.announceDOM=document.createElement("div"),this.announceDOM.className="cm-announced",this.announceDOM.setAttribute("aria-live","polite"),this.dom=document.createElement("div"),this.dom.appendChild(this.announceDOM),this.dom.appendChild(this.scrollDOM),e.parent&&e.parent.appendChild(this.dom);let{dispatch:s}=e;this.dispatchTransactions=e.dispatchTransactions||s&&(r=>r.forEach(n=>s(n,this)))||(r=>this.update(r)),this.dispatch=this.dispatch.bind(this),this._root=e.root||$m(e.parent)||document,this.viewState=new Kc(this,e.state||K.create(e)),e.scrollTo&&e.scrollTo.is(Rr)&&(this.viewState.scrollTarget=e.scrollTo.value.clip(this.viewState.state)),this.plugins=this.state.facet(ts).map(r=>new Ao(r));for(let r of this.plugins)r.update(this);this.observer=new Jb(this),this.inputState=new yb(this),this.inputState.ensureHandlers(this.plugins),this.docView=new Rc(this),this.mountStyles(),this.updateAttrs(),this.updateState=0,this.requestMeasure(),!((i=document.fonts)===null||i===void 0)&&i.ready&&document.fonts.ready.then(()=>{this.viewState.mustMeasureContent="refresh",this.requestMeasure()})}dispatch(...e){let i=e.length==1&&e[0]instanceof ye?e:e.length==1&&Array.isArray(e[0])?e[0]:[this.state.update(...e)];this.dispatchTransactions(i,this)}update(e){if(this.updateState!=0)throw new Error("Calls to EditorView.update are not allowed while an update is in progress");let i=!1,s=!1,r,n=this.state;for(let f of e){if(f.startState!=n)throw new RangeError("Trying to update state with a transaction that doesn't start from the previous state.");n=f.state}if(this.destroyed){this.viewState.state=n;return}let o=this.hasFocus,a=0,l=null;e.some(f=>f.annotation(Rf))?(this.inputState.notifiedFocused=o,a=1):o!=this.inputState.notifiedFocused&&(this.inputState.notifiedFocused=o,l=Lf(n,o),l||(a=1));let c=this.observer.delayedAndroidKey,h=null;if(c?(this.observer.clearDelayedAndroidKey(),h=this.observer.readChange(),(h&&!this.state.doc.eq(n.doc)||!this.state.selection.eq(n.selection))&&(h=null)):this.observer.clear(),n.facet(K.phrases)!=this.state.facet(K.phrases))return this.setState(n);r=Sn.create(this,n,e),r.flags|=a;let d=this.viewState.scrollTarget;try{this.updateState=2;for(let f of e){if(d&&(d=d.map(f.changes)),f.scrollIntoView){let{main:u}=f.state.selection,{x:p,y:m}=this.state.facet(B.cursorScrollMargin);d=new hs(u.empty?u:C.cursor(u.head,u.head>u.anchor?-1:1),"nearest","nearest",m,p)}for(let u of f.effects)u.is(Rr)&&(d=u.value.clip(this.state))}this.viewState.update(r,d),this.bidiCache=Pn.update(this.bidiCache,r.changes),r.empty||(this.updatePlugins(r),this.inputState.update(r)),i=this.docView.update(r),this.state.facet(Fs)!=this.styleModules&&this.mountStyles(),s=this.updateAttrs(),this.showAnnouncements(e),this.docView.updateSelection(i,e.some(f=>f.isUserEvent("select.pointer")))}finally{this.updateState=0}if(r.startState.facet(Hr)!=r.state.facet(Hr)&&(this.viewState.mustMeasureContent=!0),(i||s||d||this.viewState.mustEnforceCursorAssoc||this.viewState.mustMeasureContent)&&this.requestMeasure(),i&&this.docViewUpdate(),!r.empty)for(let f of this.state.facet($a))try{f(r)}catch(u){Ue(this.state,u,"update listener")}(l||h)&&Promise.resolve().then(()=>{l&&this.state==l.startState&&this.dispatch(l),h&&!Pf(this,h)&&c.force&&cs(this.contentDOM,c.key,c.keyCode)})}setState(e){if(this.updateState!=0)throw new Error("Calls to EditorView.setState are not allowed while an update is in progress");if(this.destroyed){this.viewState.state=e;return}this.updateState=2;let i=this.hasFocus;try{for(let s of this.plugins)s.destroy(this);this.viewState=new Kc(this,e),this.plugins=e.facet(ts).map(s=>new Ao(s)),this.pluginMap.clear();for(let s of this.plugins)s.update(this);this.docView.destroy(),this.docView=new Rc(this),this.inputState.ensureHandlers(this.plugins),this.mountStyles(),this.updateAttrs(),this.bidiCache=[]}finally{this.updateState=0}i&&this.focus(),this.requestMeasure()}updatePlugins(e){let i=e.startState.facet(ts),s=e.state.facet(ts);if(i!=s){let r=[];for(let n of s){let o=i.indexOf(n);if(o<0)r.push(new Ao(n));else{let a=this.plugins[o];a.mustUpdate=e,r.push(a)}}for(let n of this.plugins)n.mustUpdate!=e&&n.destroy(this);this.plugins=r,this.pluginMap.clear()}else for(let r of this.plugins)r.mustUpdate=e;for(let r=0;r<this.plugins.length;r++)this.plugins[r].update(this);i!=s&&this.inputState.ensureHandlers(this.plugins)}docViewUpdate(){for(let e of this.plugins){let i=e.value;if(i&&i.docViewUpdate)try{i.docViewUpdate(this)}catch(s){Ue(this.state,s,"doc view update listener")}}}measure(e=!0){if(this.destroyed)return;if(this.measureScheduled>-1&&this.win.cancelAnimationFrame(this.measureScheduled),this.observer.delayedAndroidKey){this.measureScheduled=-1,this.requestMeasure();return}this.measureScheduled=0,e&&this.observer.forceFlush();let i=null,s=this.viewState.scrollParent,r=this.viewState.getScrollOffset(),{scrollAnchorPos:n,scrollAnchorHeight:o}=this.viewState;Math.abs(r-this.viewState.scrollOffset)>1&&(o=-1),this.viewState.scrollAnchorHeight=-1;try{for(let a=0;;a++){if(o<0)if(tf(s||this.win))n=-1,o=this.viewState.heightMap.height;else{let u=this.viewState.scrollAnchorAt(r);n=u.from,o=u.top}this.updateState=1;let l=this.viewState.measure();if(!l&&!this.measureRequests.length&&this.viewState.scrollTarget==null)break;if(a>5){console.warn(this.measureRequests.length?"Measure loop restarted more than 5 times":"Viewport failed to stabilize");break}let c=[];l&4||([this.measureRequests,c]=[c,this.measureRequests]);let h=c.map(u=>{try{return u.read(this)}catch(p){return Ue(this.state,p),Zc}}),d=Sn.create(this,this.state,[]),f=!1;d.flags|=l,i?i.flags|=l:i=d,this.updateState=2,d.empty||(this.updatePlugins(d),this.inputState.update(d),this.updateAttrs(),f=this.docView.update(d),f&&this.docViewUpdate());for(let u=0;u<c.length;u++)if(h[u]!=Zc)try{let p=c[u];p.write&&p.write(h[u],this)}catch(p){Ue(this.state,p)}if(f&&this.docView.updateSelection(!0),!d.viewportChanged&&this.measureRequests.length==0){if(this.viewState.editorHeight)if(this.viewState.scrollTarget){this.docView.scrollIntoView(this.viewState.scrollTarget),this.viewState.scrollTarget=null,o=-1;continue}else{let p=((n<0?this.viewState.heightMap.height:this.viewState.lineBlockAt(n).top)-o)/this.scaleY;if((p>1||p<-1)&&(s==this.scrollDOM||this.hasFocus||Math.max(this.inputState.lastWheelEvent,this.inputState.lastTouchTime)>Date.now()-100)){r=r+p,s?s.scrollTop+=p:this.win.scrollBy(0,p),o=-1;continue}}break}}}finally{this.updateState=0,this.measureScheduled=-1}if(i&&!i.empty)for(let a of this.state.facet($a))a(i)}get themeClasses(){return _a+" "+(this.state.facet(Da)?zf:Nf)+" "+this.state.facet(Hr)}updateAttrs(){let e=eh(this,xf,{class:"cm-editor"+(this.hasFocus?" cm-focused ":" ")+this.themeClasses}),i={spellcheck:"false",autocorrect:"off",autocapitalize:"off",writingsuggestions:"false",translate:"no",contenteditable:this.state.facet(qt)?"true":"false",class:"cm-content",style:`${D.tabSize}: ${this.state.tabSize}`,role:"textbox","aria-multiline":"true"};this.state.readOnly&&(i["aria-readonly"]="true"),eh(this,xl,i);let s=this.observer.ignore(()=>{let r=Tc(this.contentDOM,this.contentAttrs,i),n=Tc(this.dom,this.editorAttrs,e);return r||n});return this.editorAttrs=e,this.contentAttrs=i,s}showAnnouncements(e){let i=!0;for(let s of e)for(let r of s.effects)if(r.is(B.announce)){i&&(this.announceDOM.textContent=""),i=!1;let n=this.announceDOM.appendChild(document.createElement("div"));n.textContent=r.value}}mountStyles(){this.styleModules=this.state.facet(Fs);let e=this.state.facet(B.cspNonce);hi.mount(this.root,this.styleModules.concat(Kb).reverse(),e?{nonce:e}:void 0)}readMeasured(){if(this.updateState==2)throw new Error("Reading the editor layout isn't allowed during an update");this.updateState==0&&this.measureScheduled>-1&&this.measure(!1)}requestMeasure(e){if(this.measureScheduled<0&&(this.measureScheduled=this.win.requestAnimationFrame(()=>this.measure())),e){if(this.measureRequests.indexOf(e)>-1)return;if(e.key!=null){for(let i=0;i<this.measureRequests.length;i++)if(this.measureRequests[i].key===e.key){this.measureRequests[i]=e;return}}this.measureRequests.push(e)}}plugin(e){let i=this.pluginMap.get(e);return(i===void 0||i&&i.plugin!=e)&&this.pluginMap.set(e,i=this.plugins.find(s=>s.plugin==e)||null),i&&i.update(this).value}get documentTop(){return this.contentDOM.getBoundingClientRect().top+this.viewState.paddingTop}get documentPadding(){return{top:this.viewState.paddingTop,bottom:this.viewState.paddingBottom}}get scaleX(){return this.viewState.scaleX}get scaleY(){return this.viewState.scaleY}elementAtHeight(e){return this.readMeasured(),this.viewState.elementAtHeight(e)}lineBlockAtHeight(e){return this.readMeasured(),this.viewState.lineBlockAtHeight(e)}get viewportLineBlocks(){return this.viewState.viewportLines}lineBlockAt(e){return this.viewState.lineBlockAt(e)}get contentHeight(){return this.viewState.contentHeight}moveByChar(e,i,s){return Mo(this,e,Lc(this,e,i,s))}moveByGroup(e,i){return Mo(this,e,Lc(this,e,i,s=>cb(this,e.head,s)))}visualLineSide(e,i){let s=this.bidiSpans(e),r=this.textDirectionAt(e.from),n=s[i?s.length-1:0];return C.cursor(n.side(i,r)+e.from,n.forward(!i,r)?1:-1)}moveToLineBoundary(e,i,s=!0){return lb(this,e,i,s)}moveVertically(e,i,s){return Mo(this,e,hb(this,e,i,s))}domAtPos(e,i=1){return this.docView.domAtPos(e,i)}posAtDOM(e,i=0){return this.docView.posFromDOM(e,i)}posAtCoords(e,i=!0){this.readMeasured();let s=Ma(this,e,i);return s&&s.pos}posAndSideAtCoords(e,i=!0){return this.readMeasured(),Ma(this,e,i)}coordsAtPos(e,i=1){this.readMeasured();let s=this.docView.coordsAt(e,i);if(!s||s.left==s.right)return s;let r=this.state.doc.lineAt(e),n=this.bidiSpans(r),o=n[Tt.find(n,e-r.from,-1,i)];return kn(s,o.dir==ie.LTR==i>0)}coordsForChar(e){return this.readMeasured(),this.docView.coordsForChar(e)}get defaultCharacterWidth(){return this.viewState.heightOracle.charWidth}get defaultLineHeight(){return this.viewState.heightOracle.lineHeight}get textDirection(){return this.viewState.defaultTextDirection}textDirectionAt(e){return!this.state.facet(mf)||e<this.viewport.from||e>this.viewport.to?this.textDirection:(this.readMeasured(),this.docView.textDirectionAt(e))}get lineWrapping(){return this.viewState.heightOracle.lineWrapping}bidiSpans(e){if(e.length>Zb)return lf(e.length);let i=this.textDirectionAt(e.from),s;for(let n of this.bidiCache)if(n.from==e.from&&n.dir==i&&(n.fresh||af(n.isolates,s=Dc(this,e))))return n.order;s||(s=Dc(this,e));let r=Rm(e.text,i,s);return this.bidiCache.push(new Pn(e.from,e.to,i,s,!0,r)),r}get hasFocus(){var e;return(this.dom.ownerDocument.hasFocus()||D.safari&&((e=this.inputState)===null||e===void 0?void 0:e.lastContextMenu)>Date.now()-3e4)&&this.root.activeElement==this.contentDOM}focus(){this.observer.ignore(()=>{ef(this.contentDOM),this.docView.updateSelection()})}setRoot(e){this._root!=e&&(this._root=e,this.observer.setWindow((e.nodeType==9?e:e.ownerDocument).defaultView||window),this.mountStyles())}destroy(){this.root.activeElement==this.contentDOM&&this.contentDOM.blur();for(let e of this.plugins)e.destroy(this);this.plugins=[],this.inputState.destroy(),this.docView.destroy(),this.dom.remove(),this.observer.destroy(),this.measureScheduled>-1&&this.win.cancelAnimationFrame(this.measureScheduled),this.destroyed=!0}static scrollIntoView(e,i={}){var s,r,n,o;return Rr.of(new hs(typeof e=="number"?C.cursor(e):e,(s=i.y)!==null&&s!==void 0?s:"nearest",(r=i.x)!==null&&r!==void 0?r:"nearest",(n=i.yMargin)!==null&&n!==void 0?n:5,(o=i.xMargin)!==null&&o!==void 0?o:5))}scrollSnapshot(){let{scrollTop:e,scrollLeft:i}=this.scrollDOM,s=this.viewState.scrollAnchorAt(e);return Rr.of(new hs(C.cursor(s.from),"start","start",s.top-e,i,!0))}setTabFocusMode(e){e==null?this.inputState.tabFocusMode=this.inputState.tabFocusMode<0?0:-1:typeof e=="boolean"?this.inputState.tabFocusMode=e?0:-1:this.inputState.tabFocusMode!=0&&(this.inputState.tabFocusMode=Date.now()+e)}static domEventHandlers(e){return me.define(()=>({}),{eventHandlers:e})}static domEventObservers(e){return me.define(()=>({}),{eventObservers:e})}static theme(e,i){let s=hi.newName(),r=[Hr.of(s),Fs.of(Ba(`.${s}`,e))];return i&&i.dark&&r.push(Da.of(!0)),r}static baseTheme(e){return ji.lowest(Fs.of(Ba("."+_a,e,Hf)))}static findFromDOM(e){var i;let s=e.querySelector(".cm-content"),r=s&&ue.get(s)||ue.get(e);return((i=r==null?void 0:r.root)===null||i===void 0?void 0:i.view)||null}}B.styleModule=Fs;B.inputHandler=pf;B.clipboardInputFilter=vl;B.clipboardOutputFilter=yl;B.scrollHandler=vf;B.focusChangeEffect=gf;B.perLineTextDirection=mf;B.exceptionSink=uf;B.updateListener=$a;B.editable=qt;B.mouseSelectionStyle=ff;B.dragMovesSelection=df;B.clickAddsSelectionRange=hf;B.decorations=eo;B.blockWrappers=wf;B.outerDecorations=wl;B.atomicRanges=Or;B.bidiIsolatedRanges=kf;B.cursorScrollMargin=_.define({combine:t=>{let e=5,i=5;for(let s of t)typeof s=="number"?e=i=s:{x:e,y:i}=s;return{x:e,y:i}}});B.scrollMargins=Sf;B.darkTheme=Da;B.cspNonce=_.define({combine:t=>t.length?t[0]:""});B.contentAttributes=xl;B.editorAttributes=xf;B.lineWrapping=B.contentAttributes.of({class:"cm-lineWrapping"});B.announce=H.define();const Zb=4096,Zc={};class Pn{constructor(e,i,s,r,n,o){this.from=e,this.to=i,this.dir=s,this.isolates=r,this.fresh=n,this.order=o}static update(e,i){if(i.empty&&!e.some(n=>n.fresh))return e;let s=[],r=e.length?e[e.length-1].dir:ie.LTR;for(let n=Math.max(0,e.length-10);n<e.length;n++){let o=e[n];o.dir==r&&!i.touchesRange(o.from,o.to)&&s.push(new Pn(i.mapPos(o.from,1),i.mapPos(o.to,-1),o.dir,o.isolates,!1,o.order))}return s}}function eh(t,e,i){for(let s=t.state.facet(e),r=s.length-1;r>=0;r--){let n=s[r],o=typeof n=="function"?n(t):n;o&&gl(o,i)}return i}const e0=D.mac?"mac":D.windows?"win":D.linux?"linux":"key";function t0(t,e){const i=t.split(/-(?!$)/);let s=i[i.length-1];s=="Space"&&(s=" ");let r,n,o,a;for(let l=0;l<i.length-1;++l){const c=i[l];if(/^(cmd|meta|m)$/i.test(c))a=!0;else if(/^a(lt)?$/i.test(c))r=!0;else if(/^(c|ctrl|control)$/i.test(c))n=!0;else if(/^s(hift)?$/i.test(c))o=!0;else if(/^mod$/i.test(c))e=="mac"?a=!0:n=!0;else throw new Error("Unrecognized modifier name: "+c)}return r&&(s="Alt-"+s),n&&(s="Ctrl-"+s),a&&(s="Meta-"+s),o&&(s="Shift-"+s),s}function Wr(t,e,i){return e.altKey&&(t="Alt-"+t),e.ctrlKey&&(t="Ctrl-"+t),e.metaKey&&(t="Meta-"+t),i!==!1&&e.shiftKey&&(t="Shift-"+t),t}const i0=ji.default(B.domEventHandlers({keydown(t,e){return Uf(Wf(e.state),t,e,"editor")}})),Al=_.define({enables:i0}),th=new WeakMap;function Wf(t){let e=t.facet(Al),i=th.get(e);return i||th.set(e,i=n0(e.reduce((s,r)=>s.concat(r),[]))),i}function s0(t,e,i){return Uf(Wf(t.state),e,t,i)}let ii=null;const r0=4e3;function n0(t,e=e0){let i=Object.create(null),s=Object.create(null),r=(o,a)=>{let l=s[o];if(l==null)s[o]=a;else if(l!=a)throw new Error("Key binding "+o+" is used both as a regular binding and as a multi-stroke prefix")},n=(o,a,l,c,h)=>{var d,f;let u=i[o]||(i[o]=Object.create(null)),p=a.split(/ (?!$)/).map(x=>t0(x,e));for(let x=1;x<p.length;x++){let k=p.slice(0,x).join(" ");r(k,!0),u[k]||(u[k]={preventDefault:!0,stopPropagation:!1,run:[O=>{let R=ii={view:O,prefix:k,scope:o};return setTimeout(()=>{ii==R&&(ii=null)},r0),!0}]})}let m=p.join(" ");r(m,!1);let b=u[m]||(u[m]={preventDefault:!1,stopPropagation:!1,run:((f=(d=u._any)===null||d===void 0?void 0:d.run)===null||f===void 0?void 0:f.slice())||[]});l&&b.run.push(l),c&&(b.preventDefault=!0),h&&(b.stopPropagation=!0)};for(let o of t){let a=o.scope?o.scope.split(" "):["editor"];if(o.any)for(let c of a){let h=i[c]||(i[c]=Object.create(null));h._any||(h._any={preventDefault:!1,stopPropagation:!1,run:[]});let{any:d}=o;for(let f in h)h[f].run.push(u=>d(u,Ra))}let l=o[e]||o.key;if(l)for(let c of a)n(c,l,o.run,o.preventDefault,o.stopPropagation),o.shift&&n(c,"Shift-"+l,o.shift,o.preventDefault,o.stopPropagation)}return i}let Ra=null;function Uf(t,e,i,s){Ra=e;let r=xm(e),n=ze(r,0),o=$t(n)==r.length&&r!=" ",a="",l=!1,c=!1,h=!1;ii&&ii.view==i&&ii.scope==s&&(a=ii.prefix+" ",Ef.indexOf(e.keyCode)<0&&(c=!0,ii=null));let d=new Set,f=b=>{if(b){for(let x of b.run)if(!d.has(x)&&(d.add(x),x(i)))return b.stopPropagation&&(h=!0),!0;b.preventDefault&&(b.stopPropagation&&(h=!0),c=!0)}return!1},u=t[s],p,m;return u&&(f(u[a+Wr(r,e,!o)])?l=!0:o&&(e.altKey||e.metaKey||e.ctrlKey)&&!(D.windows&&e.ctrlKey&&e.altKey)&&!(D.mac&&e.altKey&&!(e.ctrlKey||e.metaKey))&&(p=di[e.keyCode])&&p!=r?(f(u[a+Wr(p,e,!0)])||e.shiftKey&&(m=nr[e.keyCode])!=r&&m!=p&&f(u[a+Wr(m,e,!1)]))&&(l=!0):o&&e.shiftKey&&f(u[a+Wr(r,e,!0)])&&(l=!0),!l&&f(u._any)&&(l=!0)),c&&(l=!0),l&&h&&e.stopPropagation(),Ra=null,l}class Ii{constructor(e,i,s,r,n){this.className=e,this.left=i,this.top=s,this.width=r,this.height=n}draw(){let e=document.createElement("div");return e.className=this.className,this.adjust(e),e}update(e,i){return i.className!=this.className?!1:(this.adjust(e),!0)}adjust(e){e.style.left=this.left+"px",e.style.top=this.top+"px",this.width!=null&&(e.style.width=this.width+"px"),e.style.height=this.height+"px"}eq(e){return this.left==e.left&&this.top==e.top&&this.width==e.width&&this.height==e.height&&this.className==e.className}static forRange(e,i,s){if(s.empty){let r=e.coordsAtPos(s.head,s.assoc||1);if(!r)return[];let n=qf(e);return[new Ii(i,r.left-n.left,r.top-n.top,null,r.bottom-r.top)]}else return o0(e,i,s)}}function qf(t){let e=t.scrollDOM.getBoundingClientRect();return{left:(t.textDirection==ie.LTR?e.left:e.right-t.scrollDOM.clientWidth*t.scaleX)-t.scrollDOM.scrollLeft*t.scaleX,top:e.top-t.scrollDOM.scrollTop*t.scaleY}}function ih(t,e,i,s){let r=t.coordsAtPos(e,i*2);if(!r)return s;let n=t.dom.getBoundingClientRect(),o=(r.top+r.bottom)/2,a=t.posAtCoords({x:n.left+1,y:o}),l=t.posAtCoords({x:n.right-1,y:o});return a==null||l==null?s:{from:Math.max(s.from,Math.min(a,l)),to:Math.min(s.to,Math.max(a,l))}}function o0(t,e,i){if(i.to<=t.viewport.from||i.from>=t.viewport.to)return[];let s=Math.max(i.from,t.viewport.from),r=Math.min(i.to,t.viewport.to),n=t.textDirection==ie.LTR,o=t.contentDOM,a=o.getBoundingClientRect(),l=qf(t),c=o.querySelector(".cm-line"),h=c&&window.getComputedStyle(c),d=a.left+(h?parseInt(h.paddingLeft)+Math.min(0,parseInt(h.textIndent)):0),f=a.right-(h?parseInt(h.paddingRight):0),u=Ta(t,s,1),p=Ta(t,r,-1),m=u.type==Pe.Text?u:null,b=p.type==Pe.Text?p:null;if(m&&(t.lineWrapping||u.widgetLineBreaks)&&(m=ih(t,s,1,m)),b&&(t.lineWrapping||p.widgetLineBreaks)&&(b=ih(t,r,-1,b)),m&&b&&m.from==b.from&&m.to==b.to)return k(O(i.from,i.to,m));{let A=m?O(i.from,null,m):R(u,!1),$=b?O(null,i.to,b):R(p,!0),P=[];return(m||u).to<(b||p).from-(m&&b?1:0)||u.widgetLineBreaks>1&&A.bottom+t.defaultLineHeight/2<$.top?P.push(x(d,A.bottom,f,$.top)):A.bottom<$.top&&t.elementAtHeight((A.bottom+$.top)/2).type==Pe.Text&&(A.bottom=$.top=(A.bottom+$.top)/2),k(A).concat(P).concat(k($))}function x(A,$,P,z){return new Ii(e,A-l.left,$-l.top,Math.max(0,P-A),z-$)}function k({top:A,bottom:$,horizontal:P}){let z=[];for(let j=0;j<P.length;j+=2)z.push(x(P[j],A,P[j+1],$));return z}function O(A,$,P){let z=1e9,j=-1e9,ee=[];function q(J,re,Re,Ke,xt){let Oe=t.coordsAtPos(J,J==P.to?-2:2),tt=t.coordsAtPos(Re,Re==P.from?2:-2);!Oe||!tt||(z=Math.min(Oe.top,tt.top,z),j=Math.max(Oe.bottom,tt.bottom,j),xt==ie.LTR?ee.push(n&&re?d:Oe.left,n&&Ke?f:tt.right):ee.push(!n&&Ke?d:tt.left,!n&&re?f:Oe.right))}let F=A??P.from,G=$??P.to;for(let J of t.visibleRanges)if(J.to>F&&J.from<G)for(let re=Math.max(J.from,F),Re=Math.min(J.to,G);;){let Ke=t.state.doc.lineAt(re);for(let xt of t.bidiSpans(Ke)){let Oe=xt.from+Ke.from,tt=xt.to+Ke.from;if(Oe>=Re)break;tt>re&&q(Math.max(Oe,re),A==null&&Oe<=F,Math.min(tt,Re),$==null&&tt>=G,xt.dir)}if(re=Ke.to+1,re>=Re)break}return ee.length==0&&q(F,A==null,G,$==null,t.textDirection),{top:z,bottom:j,horizontal:ee}}function R(A,$){let P=a.top+($?A.top:A.bottom);return{top:P,bottom:P,horizontal:[]}}}function a0(t,e){return t.constructor==e.constructor&&t.eq(e)}class l0{constructor(e,i){this.view=e,this.layer=i,this.drawn=[],this.scaleX=1,this.scaleY=1,this.measureReq={read:this.measure.bind(this),write:this.draw.bind(this)},this.dom=e.scrollDOM.appendChild(document.createElement("div")),this.dom.classList.add("cm-layer"),i.above&&this.dom.classList.add("cm-layer-above"),i.class&&this.dom.classList.add(i.class),this.scale(),this.dom.setAttribute("aria-hidden","true"),this.setOrder(e.state),e.requestMeasure(this.measureReq),i.mount&&i.mount(this.dom,e)}update(e){e.startState.facet(ln)!=e.state.facet(ln)&&this.setOrder(e.state),(this.layer.update(e,this.dom)||e.geometryChanged)&&(this.scale(),e.view.requestMeasure(this.measureReq))}docViewUpdate(e){this.layer.updateOnDocViewUpdate!==!1&&e.requestMeasure(this.measureReq)}setOrder(e){let i=0,s=e.facet(ln);for(;i<s.length&&s[i]!=this.layer;)i++;this.dom.style.zIndex=String((this.layer.above?150:-1)-i)}measure(){return this.layer.markers(this.view)}scale(){let{scaleX:e,scaleY:i}=this.view;(e!=this.scaleX||i!=this.scaleY)&&(this.scaleX=e,this.scaleY=i,this.dom.style.transform=`scale(${1/e}, ${1/i})`)}draw(e){if(e.length!=this.drawn.length||e.some((i,s)=>!a0(i,this.drawn[s]))){let i=this.dom.firstChild,s=0;for(let r of e)r.update&&i&&r.constructor&&this.drawn[s].constructor&&r.update(i,this.drawn[s])?(i=i.nextSibling,s++):this.dom.insertBefore(r.draw(),i);for(;i;){let r=i.nextSibling;i.remove(),i=r}this.drawn=e,D.webkit&&(this.dom.style.display=this.dom.firstChild?"":"none")}}destroy(){this.layer.destroy&&this.layer.destroy(this.dom,this.view),this.dom.remove()}}const ln=_.define();function Vf(t){return[me.define(e=>new l0(e,t)),ln.of(t)]}const ws=_.define({combine(t){return Ft(t,{cursorBlinkRate:1200,drawRangeCursor:!0,iosSelectionHandles:!0},{cursorBlinkRate:(e,i)=>Math.min(e,i),drawRangeCursor:(e,i)=>e||i})}});function c0(t={}){return[ws.of(t),h0,d0,f0,bf.of(!0)]}function Qf(t){return t.startState.facet(ws)!=t.state.facet(ws)}const h0=Vf({above:!0,markers(t){let{state:e}=t,i=e.facet(ws),s=[];for(let r of e.selection.ranges){let n=r==e.selection.main;if(r.empty||i.drawRangeCursor&&!(n&&D.ios&&i.iosSelectionHandles)){let o=n?"cm-cursor cm-cursor-primary":"cm-cursor cm-cursor-secondary",a=r.empty?r:C.cursor(r.head,r.assoc);for(let l of Ii.forRange(t,o,a))s.push(l)}}return s},update(t,e){t.transactions.some(s=>s.selection)&&(e.style.animationName=e.style.animationName=="cm-blink"?"cm-blink2":"cm-blink");let i=Qf(t);return i&&sh(t.state,e),t.docChanged||t.selectionSet||i},mount(t,e){sh(e.state,t)},class:"cm-cursorLayer"});function sh(t,e){e.style.animationDuration=t.facet(ws).cursorBlinkRate+"ms"}const d0=Vf({above:!1,markers(t){let e=[],{main:i,ranges:s}=t.state.selection;for(let r of s)if(!r.empty)for(let n of Ii.forRange(t,"cm-selectionBackground",r))e.push(n);if(D.ios&&!i.empty&&t.state.facet(ws).iosSelectionHandles){for(let r of Ii.forRange(t,"cm-selectionHandle cm-selectionHandle-start",C.cursor(i.from,1)))e.push(r);for(let r of Ii.forRange(t,"cm-selectionHandle cm-selectionHandle-end",C.cursor(i.to,1)))e.push(r)}return e},update(t,e){return t.docChanged||t.selectionSet||t.viewportChanged||Qf(t)},class:"cm-selectionLayer"}),f0=ji.highest(B.theme({".cm-line":{"& ::selection, &::selection":{backgroundColor:"transparent !important"},caretColor:"transparent !important"},".cm-content":{caretColor:"transparent !important","& :focus":{caretColor:"initial !important","&::selection, & ::selection":{backgroundColor:"Highlight !important"}}}})),jf=H.define({map(t,e){return t==null?null:e.mapPos(t)}}),zs=_e.define({create(){return null},update(t,e){return t!=null&&(t=e.changes.mapPos(t)),e.effects.reduce((i,s)=>s.is(jf)?s.value:i,t)}}),u0=me.fromClass(class{constructor(t){this.view=t,this.cursor=null,this.measureReq={read:this.readPos.bind(this),write:this.drawCursor.bind(this)}}update(t){var e;let i=t.state.field(zs);i==null?this.cursor!=null&&((e=this.cursor)===null||e===void 0||e.remove(),this.cursor=null):(this.cursor||(this.cursor=this.view.scrollDOM.appendChild(document.createElement("div")),this.cursor.className="cm-dropCursor"),(t.startState.field(zs)!=i||t.docChanged||t.geometryChanged)&&this.view.requestMeasure(this.measureReq))}readPos(){let{view:t}=this,e=t.state.field(zs),i=e!=null&&t.coordsAtPos(e);if(!i)return null;let s=t.scrollDOM.getBoundingClientRect();return{left:i.left-s.left+t.scrollDOM.scrollLeft*t.scaleX,top:i.top-s.top+t.scrollDOM.scrollTop*t.scaleY,height:i.bottom-i.top}}drawCursor(t){if(this.cursor){let{scaleX:e,scaleY:i}=this.view;t?(this.cursor.style.left=t.left/e+"px",this.cursor.style.top=t.top/i+"px",this.cursor.style.height=t.height/i+"px"):this.cursor.style.left="-100000px"}}destroy(){this.cursor&&this.cursor.remove()}setDropPos(t){this.view.state.field(zs)!=t&&this.view.dispatch({effects:jf.of(t)})}},{eventObservers:{dragover(t){this.setDropPos(this.view.posAtCoords({x:t.clientX,y:t.clientY}))},dragleave(t){(t.target==this.view.contentDOM||!this.view.contentDOM.contains(t.relatedTarget))&&this.setDropPos(null)},dragend(){this.setDropPos(null)},drop(){this.setDropPos(null)}}});function p0(){return[zs,u0]}function rh(t,e,i,s,r){e.lastIndex=0;for(let n=t.iterRange(i,s),o=i,a;!n.next().done;o+=n.value.length)if(!n.lineBreak)for(;a=e.exec(n.value);)r(o+a.index,a)}function g0(t,e){let i=t.visibleRanges;if(i.length==1&&i[0].from==t.viewport.from&&i[0].to==t.viewport.to)return i;let s=[];for(let{from:r,to:n}of i)r=Math.max(t.state.doc.lineAt(r).from,r-e),n=Math.min(t.state.doc.lineAt(n).to,n+e),s.length&&s[s.length-1].to>=r?s[s.length-1].to=n:s.push({from:r,to:n});return s}class m0{constructor(e){const{regexp:i,decoration:s,decorate:r,boundary:n,maxLength:o=1e3}=e;if(!i.global)throw new RangeError("The regular expression given to MatchDecorator should have its 'g' flag set");if(this.regexp=i,r)this.addMatch=(a,l,c,h)=>r(h,c,c+a[0].length,a,l);else if(typeof s=="function")this.addMatch=(a,l,c,h)=>{let d=s(a,l,c);d&&h(c,c+a[0].length,d)};else if(s)this.addMatch=(a,l,c,h)=>h(c,c+a[0].length,s);else throw new RangeError("Either 'decorate' or 'decoration' should be provided to MatchDecorator");this.boundary=n,this.maxLength=o}createDeco(e){let i=new jt,s=i.add.bind(i);for(let{from:r,to:n}of g0(e,this.maxLength))rh(e.state.doc,this.regexp,r,n,(o,a)=>this.addMatch(a,e,o,s));return i.finish()}updateDeco(e,i){let s=1e9,r=-1;return e.docChanged&&e.changes.iterChanges((n,o,a,l)=>{l>=e.view.viewport.from&&a<=e.view.viewport.to&&(s=Math.min(a,s),r=Math.max(l,r))}),e.viewportMoved||r-s>1e3?this.createDeco(e.view):r>-1?this.updateRange(e.view,i.map(e.changes),s,r):i}updateRange(e,i,s,r){for(let n of e.visibleRanges){let o=Math.max(n.from,s),a=Math.min(n.to,r);if(a>=o){let l=e.state.doc.lineAt(o),c=l.to<a?e.state.doc.lineAt(a):l,h=Math.max(n.from,l.from),d=Math.min(n.to,c.to);if(this.boundary){for(;o>l.from;o--)if(this.boundary.test(l.text[o-1-l.from])){h=o;break}for(;a<c.to;a++)if(this.boundary.test(c.text[a-c.from])){d=a;break}}let f=[],u,p=(m,b,x)=>f.push(x.range(m,b));if(l==c)for(this.regexp.lastIndex=h-l.from;(u=this.regexp.exec(l.text))&&u.index<d-l.from;)this.addMatch(u,e,u.index+l.from,p);else rh(e.state.doc,this.regexp,h,d,(m,b)=>this.addMatch(b,e,m,p));i=i.update({filterFrom:h,filterTo:d,filter:(m,b)=>m<h||b>d,add:f})}}return i}}const La=/x/.unicode!=null?"gu":"g",b0=new RegExp(`[\0-\b
--­؜​‎‏\u2028\u2029‭‮⁦⁧⁩\uFEFF￹-￼]`,La),v0={0:"null",7:"bell",8:"backspace",10:"newline",11:"vertical tab",13:"carriage return",27:"escape",8203:"zero width space",8204:"zero width non-joiner",8205:"zero width joiner",8206:"left-to-right mark",8207:"right-to-left mark",8232:"line separator",8237:"left-to-right override",8238:"right-to-left override",8294:"left-to-right isolate",8295:"right-to-left isolate",8297:"pop directional isolate",8233:"paragraph separator",65279:"zero width no-break space",65532:"object replacement"};let _o=null;function y0(){var t;if(_o==null&&typeof document<"u"&&document.body){let e=document.body.style;_o=((t=e.tabSize)!==null&&t!==void 0?t:e.MozTabSize)!=null}return _o||!1}const cn=_.define({combine(t){let e=Ft(t,{render:null,specialChars:b0,addSpecialChars:null});return(e.replaceTabs=!y0())&&(e.specialChars=new RegExp("	|"+e.specialChars.source,La)),e.addSpecialChars&&(e.specialChars=new RegExp(e.specialChars.source+"|"+e.addSpecialChars.source,La)),e}});function x0(t={}){return[cn.of(t),w0()]}let nh=null;function w0(){return nh||(nh=me.fromClass(class{constructor(t){this.view=t,this.decorations=N.none,this.decorationCache=Object.create(null),this.decorator=this.makeDecorator(t.state.facet(cn)),this.decorations=this.decorator.createDeco(t)}makeDecorator(t){return new m0({regexp:t.specialChars,decoration:(e,i,s)=>{let{doc:r}=i.state,n=ze(e[0],0);if(n==9){let o=r.lineAt(s),a=i.state.tabSize,l=$s(o.text,a,s-o.from);return N.replace({widget:new O0((a-l%a)*this.view.defaultCharacterWidth/this.view.scaleX)})}return this.decorationCache[n]||(this.decorationCache[n]=N.replace({widget:new C0(t,n)}))},boundary:t.replaceTabs?void 0:/[^]/})}update(t){let e=t.state.facet(cn);t.startState.facet(cn)!=e?(this.decorator=this.makeDecorator(e),this.decorations=this.decorator.createDeco(t.view)):this.decorations=this.decorator.updateDeco(t,this.decorations)}},{decorations:t=>t.decorations}))}const k0="•";function S0(t){return t>=32?k0:t==10?"␤":String.fromCharCode(9216+t)}class C0 extends Gt{constructor(e,i){super(),this.options=e,this.code=i}eq(e){return e.code==this.code}toDOM(e){let i=S0(this.code),s=e.state.phrase("Control character")+" "+(v0[this.code]||"0x"+this.code.toString(16)),r=this.options.render&&this.options.render(this.code,s,i);if(r)return r;let n=document.createElement("span");return n.textContent=i,n.title=s,n.setAttribute("aria-label",s),n.className="cm-specialChar",n}ignoreEvent(){return!1}}class O0 extends Gt{constructor(e){super(),this.width=e}eq(e){return e.width==this.width}toDOM(){let e=document.createElement("span");return e.textContent="	",e.className="cm-tab",e.style.width=this.width+"px",e}ignoreEvent(){return!1}}function A0(){return P0}const $0=N.line({class:"cm-activeLine"}),P0=me.fromClass(class{constructor(t){this.decorations=this.getDeco(t)}update(t){(t.docChanged||t.selectionSet)&&(this.decorations=this.getDeco(t.view))}getDeco(t){let e=-1,i=[];for(let s of t.state.selection.ranges){let r=t.lineBlockAt(s.head);r.from>e&&(i.push($0.range(r.from)),e=r.from)}return N.set(i)}},{decorations:t=>t.decorations}),Ia=2e3;function T0(t,e,i){let s=Math.min(e.line,i.line),r=Math.max(e.line,i.line),n=[];if(e.off>Ia||i.off>Ia||e.col<0||i.col<0){let o=Math.min(e.off,i.off),a=Math.max(e.off,i.off);for(let l=s;l<=r;l++){let c=t.doc.line(l);c.length<=a&&n.push(C.range(c.from+o,c.to+a))}}else{let o=Math.min(e.col,i.col),a=Math.max(e.col,i.col);for(let l=s;l<=r;l++){let c=t.doc.line(l),h=ma(c.text,o,t.tabSize,!0);if(h<0)n.push(C.cursor(c.to));else{let d=ma(c.text,a,t.tabSize);n.push(C.range(c.from+h,c.from+d))}}}return n}function M0(t,e){let i=t.coordsAtPos(t.viewport.from);return i?Math.round(Math.abs((i.left-e)/t.defaultCharacterWidth)):-1}function oh(t,e){let i=t.posAtCoords({x:e.clientX,y:e.clientY},!1),s=t.state.doc.lineAt(i),r=i-s.from,n=r>Ia?-1:r==s.length?M0(t,e.clientX):$s(s.text,t.state.tabSize,i-s.from);return{line:s.number,col:n,off:r}}function E0(t,e){let i=oh(t,e),s=t.state.selection;return i?{update(r){if(r.docChanged){let n=r.changes.mapPos(r.startState.doc.line(i.line).from),o=r.state.doc.lineAt(n);i={line:o.number,col:i.col,off:Math.min(i.off,o.length)},s=s.map(r.changes)}},get(r,n,o){let a=oh(t,r);if(!a)return s;let l=T0(t.state,i,a);return l.length?o?C.create(l.concat(s.ranges)):C.create(l):s}}:null}function D0(t){let e=(i=>i.altKey&&i.button==0);return B.mouseSelectionStyle.of((i,s)=>e(s)?E0(i,s):null)}const _0={Alt:[18,t=>!!t.altKey],Control:[17,t=>!!t.ctrlKey],Shift:[16,t=>!!t.shiftKey],Meta:[91,t=>!!t.metaKey]},B0={style:"cursor: crosshair"};function R0(t={}){let[e,i]=_0[t.key||"Alt"],s=me.fromClass(class{constructor(r){this.view=r,this.isDown=!1}set(r){this.isDown!=r&&(this.isDown=r,this.view.update([]))}},{eventObservers:{keydown(r){this.set(r.keyCode==e||i(r))},keyup(r){(r.keyCode==e||!i(r))&&this.set(!1)},mousemove(r){this.set(i(r))}}});return[s,B.contentAttributes.of(r=>{var n;return!((n=r.plugin(s))===null||n===void 0)&&n.isDown?B0:null})]}const Ur="-10000px";class Kf{constructor(e,i,s,r){this.facet=i,this.createTooltipView=s,this.removeTooltipView=r,this.input=e.state.facet(i),this.tooltips=this.input.filter(o=>o);let n=null;this.tooltipViews=this.tooltips.map(o=>n=s(o,n))}update(e,i){var s;let r=e.state.facet(this.facet),n=r.filter(l=>l);if(r===this.input){for(let l of this.tooltipViews)l.update&&l.update(e);return!1}let o=[],a=i?[]:null;for(let l=0;l<n.length;l++){let c=n[l],h=-1;if(c){for(let d=0;d<this.tooltips.length;d++){let f=this.tooltips[d];f&&f.create==c.create&&(h=d)}if(h<0)o[l]=this.createTooltipView(c,l?o[l-1]:null),a&&(a[l]=!!c.above);else{let d=o[l]=this.tooltipViews[h];a&&(a[l]=i[h]),d.update&&d.update(e)}}}for(let l of this.tooltipViews)o.indexOf(l)<0&&(this.removeTooltipView(l),(s=l.destroy)===null||s===void 0||s.call(l));return i&&(a.forEach((l,c)=>i[c]=l),i.length=a.length),this.input=r,this.tooltips=n,this.tooltipViews=o,!0}}function L0(t){let e=t.dom.ownerDocument.documentElement;return{top:0,left:0,bottom:e.clientHeight,right:e.clientWidth}}const Bo=_.define({combine:t=>{var e,i,s;return{position:D.ios?"absolute":((e=t.find(r=>r.position))===null||e===void 0?void 0:e.position)||"fixed",parent:((i=t.find(r=>r.parent))===null||i===void 0?void 0:i.parent)||null,tooltipSpace:((s=t.find(r=>r.tooltipSpace))===null||s===void 0?void 0:s.tooltipSpace)||L0}}}),ah=new WeakMap,$l=me.fromClass(class{constructor(t){this.view=t,this.above=[],this.inView=!0,this.madeAbsolute=!1,this.lastTransaction=0,this.measureTimeout=-1;let e=t.state.facet(Bo);this.position=e.position,this.parent=e.parent,this.classes=t.themeClasses,this.createContainer(),this.measureReq={read:this.readMeasure.bind(this),write:this.writeMeasure.bind(this),key:this},this.resizeObserver=typeof ResizeObserver=="function"?new ResizeObserver(()=>this.measureSoon()):null,this.manager=new Kf(t,Pl,(i,s)=>this.createTooltip(i,s),i=>{this.resizeObserver&&this.resizeObserver.unobserve(i.dom),i.dom.remove()}),this.above=this.manager.tooltips.map(i=>!!i.above),this.intersectionObserver=typeof IntersectionObserver=="function"?new IntersectionObserver(i=>{Date.now()>this.lastTransaction-50&&i.length>0&&i[i.length-1].intersectionRatio<1&&this.measureSoon()},{threshold:[1]}):null,this.observeIntersection(),t.win.addEventListener("resize",this.measureSoon=this.measureSoon.bind(this)),this.maybeMeasure()}createContainer(){this.parent?(this.container=document.createElement("div"),this.container.style.position="relative",this.container.className=this.view.themeClasses,this.parent.appendChild(this.container)):this.container=this.view.dom}observeIntersection(){if(this.intersectionObserver){this.intersectionObserver.disconnect();for(let t of this.manager.tooltipViews)this.intersectionObserver.observe(t.dom)}}measureSoon(){this.measureTimeout<0&&(this.measureTimeout=setTimeout(()=>{this.measureTimeout=-1,this.maybeMeasure()},50))}update(t){t.transactions.length&&(this.lastTransaction=Date.now());let e=this.manager.update(t,this.above);e&&this.observeIntersection();let i=e||t.geometryChanged,s=t.state.facet(Bo);if(s.position!=this.position&&!this.madeAbsolute){this.position=s.position;for(let r of this.manager.tooltipViews)r.dom.style.position=this.position;i=!0}if(s.parent!=this.parent){this.parent&&this.container.remove(),this.parent=s.parent,this.createContainer();for(let r of this.manager.tooltipViews)this.container.appendChild(r.dom);i=!0}else this.parent&&this.view.themeClasses!=this.classes&&(this.classes=this.container.className=this.view.themeClasses);i&&this.maybeMeasure()}createTooltip(t,e){let i=t.create(this.view),s=e?e.dom:null;if(i.dom.classList.add("cm-tooltip"),t.arrow&&!i.dom.querySelector(".cm-tooltip > .cm-tooltip-arrow")){let r=document.createElement("div");r.className="cm-tooltip-arrow",i.dom.appendChild(r)}return i.dom.style.position=this.position,i.dom.style.top=Ur,i.dom.style.left="0px",this.container.insertBefore(i.dom,s),i.mount&&i.mount(this.view),this.resizeObserver&&this.resizeObserver.observe(i.dom),i}destroy(){var t,e,i;this.view.win.removeEventListener("resize",this.measureSoon);for(let s of this.manager.tooltipViews)s.dom.remove(),(t=s.destroy)===null||t===void 0||t.call(s);this.parent&&this.container.remove(),(e=this.resizeObserver)===null||e===void 0||e.disconnect(),(i=this.intersectionObserver)===null||i===void 0||i.disconnect(),clearTimeout(this.measureTimeout)}readMeasure(){let t=1,e=1,i=!1;if(this.position=="fixed"&&this.manager.tooltipViews.length){let{dom:n}=this.manager.tooltipViews[0];if(D.safari){let o=n.getBoundingClientRect();i=Math.abs(o.top+1e4)>1||Math.abs(o.left)>1}else i=!!n.offsetParent&&n.offsetParent!=this.container.ownerDocument.body}if(i||this.position=="absolute")if(this.parent){let n=this.parent.getBoundingClientRect();n.width&&n.height&&(t=n.width/this.parent.offsetWidth,e=n.height/this.parent.offsetHeight)}else({scaleX:t,scaleY:e}=this.view.viewState);let s=this.view.scrollDOM.getBoundingClientRect(),r=kl(this.view);return{visible:{left:s.left+r.left,top:s.top+r.top,right:s.right-r.right,bottom:s.bottom-r.bottom},parent:this.parent?this.container.getBoundingClientRect():this.view.dom.getBoundingClientRect(),pos:this.manager.tooltips.map((n,o)=>{let a=this.manager.tooltipViews[o];return a.getCoords?a.getCoords(n.pos):this.view.coordsAtPos(n.pos)}),size:this.manager.tooltipViews.map(({dom:n})=>n.getBoundingClientRect()),space:this.view.state.facet(Bo).tooltipSpace(this.view),scaleX:t,scaleY:e,makeAbsolute:i}}writeMeasure(t){var e;if(t.makeAbsolute){this.madeAbsolute=!0,this.position="absolute";for(let a of this.manager.tooltipViews)a.dom.style.position="absolute"}let{visible:i,space:s,scaleX:r,scaleY:n}=t,o=[];for(let a=0;a<this.manager.tooltips.length;a++){let l=this.manager.tooltips[a],c=this.manager.tooltipViews[a],{dom:h}=c,d=t.pos[a],f=t.size[a];if(!d||l.clip!==!1&&(d.bottom<=Math.max(i.top,s.top)||d.top>=Math.min(i.bottom,s.bottom)||d.right<Math.max(i.left,s.left)-.1||d.left>Math.min(i.right,s.right)+.1)){h.style.top=Ur;continue}let u=l.arrow?c.dom.querySelector(".cm-tooltip-arrow"):null,p=u?7:0,m=f.right-f.left,b=(e=ah.get(c))!==null&&e!==void 0?e:f.bottom-f.top,x=c.offset||F0,k=this.view.textDirection==ie.LTR,O=f.width>s.right-s.left?k?s.left:s.right-f.width:k?Math.max(s.left,Math.min(d.left-(u?14:0)+x.x,s.right-m)):Math.min(Math.max(s.left,d.left-m+(u?14:0)-x.x),s.right-m),R=this.above[a];!l.strictSide&&(R?d.top-b-p-x.y<s.top:d.bottom+b+p+x.y>s.bottom)&&R==s.bottom-d.bottom>d.top-s.top&&(R=this.above[a]=!R);let A=(R?d.top-s.top:s.bottom-d.bottom)-p;if(A<b&&c.resize!==!1){if(A<this.view.defaultLineHeight){h.style.top=Ur;continue}ah.set(c,b),h.style.height=(b=A)/n+"px"}else h.style.height&&(h.style.height="");let $=R?d.top-b-p-x.y:d.bottom+p+x.y,P=O+m;if(c.overlap!==!0)for(let z of o)z.left<P&&z.right>O&&z.top<$+b&&z.bottom>$&&($=R?z.top-b-2-p:z.bottom+p+2);if(this.position=="absolute"?(h.style.top=($-t.parent.top)/n+"px",lh(h,(O-t.parent.left)/r)):(h.style.top=$/n+"px",lh(h,O/r)),u){let z=d.left+(k?x.x:-x.x)-(O+14-7);u.style.left=z/r+"px"}c.overlap!==!0&&o.push({left:O,top:$,right:P,bottom:$+b}),h.classList.toggle("cm-tooltip-above",R),h.classList.toggle("cm-tooltip-below",!R),c.positioned&&c.positioned(t.space)}}maybeMeasure(){if(this.manager.tooltips.length&&(this.view.inView&&this.view.requestMeasure(this.measureReq),this.inView!=this.view.inView&&(this.inView=this.view.inView,!this.inView)))for(let t of this.manager.tooltipViews)t.dom.style.top=Ur}},{eventObservers:{scroll(){this.maybeMeasure()}}});function lh(t,e){let i=parseInt(t.style.left,10);(isNaN(i)||Math.abs(e-i)>1)&&(t.style.left=e+"px")}const I0=B.baseTheme({".cm-tooltip":{zIndex:500,boxSizing:"border-box"},"&light .cm-tooltip":{border:"1px solid #bbb",backgroundColor:"#f5f5f5"},"&light .cm-tooltip-section:not(:first-child)":{borderTop:"1px solid #bbb"},"&dark .cm-tooltip":{backgroundColor:"#333338",color:"white"},".cm-tooltip-arrow":{height:"7px",width:"14px",position:"absolute",zIndex:-1,overflow:"hidden","&:before, &:after":{content:"''",position:"absolute",width:0,height:0,borderLeft:"7px solid transparent",borderRight:"7px solid transparent"},".cm-tooltip-above &":{bottom:"-7px","&:before":{borderTop:"7px solid #bbb"},"&:after":{borderTop:"7px solid #f5f5f5",bottom:"1px"}},".cm-tooltip-below &":{top:"-7px","&:before":{borderBottom:"7px solid #bbb"},"&:after":{borderBottom:"7px solid #f5f5f5",top:"1px"}}},"&dark .cm-tooltip .cm-tooltip-arrow":{"&:before":{borderTopColor:"#333338",borderBottomColor:"#333338"},"&:after":{borderTopColor:"transparent",borderBottomColor:"transparent"}}}),F0={x:0,y:0},Pl=_.define({enables:[$l,I0]}),Tn=_.define({combine:t=>t.reduce((e,i)=>e.concat(i),[])});class ro{static create(e){return new ro(e)}constructor(e){this.view=e,this.mounted=!1,this.dom=document.createElement("div"),this.dom.classList.add("cm-tooltip-hover"),this.manager=new Kf(e,Tn,(i,s)=>this.createHostedView(i,s),i=>i.dom.remove())}createHostedView(e,i){let s=e.create(this.view);return s.dom.classList.add("cm-tooltip-section"),this.dom.insertBefore(s.dom,i?i.dom.nextSibling:this.dom.firstChild),this.mounted&&s.mount&&s.mount(this.view),s}mount(e){for(let i of this.manager.tooltipViews)i.mount&&i.mount(e);this.mounted=!0}positioned(e){for(let i of this.manager.tooltipViews)i.positioned&&i.positioned(e)}update(e){this.manager.update(e)}destroy(){var e;for(let i of this.manager.tooltipViews)(e=i.destroy)===null||e===void 0||e.call(i)}passProp(e){let i;for(let s of this.manager.tooltipViews){let r=s[e];if(r!==void 0){if(i===void 0)i=r;else if(i!==r)return}}return i}get offset(){return this.passProp("offset")}get getCoords(){return this.passProp("getCoords")}get overlap(){return this.passProp("overlap")}get resize(){return this.passProp("resize")}}const N0=Pl.compute([Tn],t=>{let e=t.facet(Tn);return e.length===0?null:{pos:Math.min(...e.map(i=>i.pos)),end:Math.max(...e.map(i=>{var s;return(s=i.end)!==null&&s!==void 0?s:i.pos})),create:ro.create,above:e[0].above,arrow:e.some(i=>i.arrow)}});class z0{constructor(e,i,s,r,n){this.view=e,this.source=i,this.field=s,this.setHover=r,this.hoverTime=n,this.hoverTimeout=-1,this.restartTimeout=-1,this.pending=null,this.lastMove={x:0,y:0,target:e.dom,time:0},this.checkHover=this.checkHover.bind(this),e.dom.addEventListener("mouseleave",this.mouseleave=this.mouseleave.bind(this)),e.dom.addEventListener("mousemove",this.mousemove=this.mousemove.bind(this))}update(){this.pending&&(this.pending=null,clearTimeout(this.restartTimeout),this.restartTimeout=setTimeout(()=>this.startHover(),20))}get active(){return this.view.state.field(this.field)}checkHover(){if(this.hoverTimeout=-1,this.active.length)return;let e=Date.now()-this.lastMove.time;e<this.hoverTime?this.hoverTimeout=setTimeout(this.checkHover,this.hoverTime-e):this.startHover()}startHover(){clearTimeout(this.restartTimeout);let{view:e,lastMove:i}=this,s=e.docView.tile.nearest(i.target);if(!s)return;let r,n=1;if(s.isWidget())r=s.posAtStart;else{if(r=e.posAtCoords(i),r==null)return;let a=e.coordsAtPos(r);if(!a||i.y<a.top||i.y>a.bottom||i.x<a.left-e.defaultCharacterWidth||i.x>a.right+e.defaultCharacterWidth)return;let l=e.bidiSpans(e.state.doc.lineAt(r)).find(h=>h.from<=r&&h.to>=r),c=l&&l.dir==ie.RTL?-1:1;n=i.x<a.left?-c:c}let o=this.source(e,r,n);if(o!=null&&o.then){let a=this.pending={pos:r};o.then(l=>{this.pending==a&&(this.pending=null,l&&!(Array.isArray(l)&&!l.length)&&e.dispatch({effects:this.setHover.of(Array.isArray(l)?l:[l])}))},l=>Ue(e.state,l,"hover tooltip"))}else o&&!(Array.isArray(o)&&!o.length)&&e.dispatch({effects:this.setHover.of(Array.isArray(o)?o:[o])})}get tooltip(){let e=this.view.plugin($l),i=e?e.manager.tooltips.findIndex(s=>s.create==ro.create):-1;return i>-1?e.manager.tooltipViews[i]:null}mousemove(e){var i,s;this.lastMove={x:e.clientX,y:e.clientY,target:e.target,time:Date.now()},this.hoverTimeout<0&&(this.hoverTimeout=setTimeout(this.checkHover,this.hoverTime));let{active:r,tooltip:n}=this;if(r.length&&n&&!H0(n.dom,e)||this.pending){let{pos:o}=r[0]||this.pending,a=(s=(i=r[0])===null||i===void 0?void 0:i.end)!==null&&s!==void 0?s:o;(o==a?this.view.posAtCoords(this.lastMove)!=o:!W0(this.view,o,a,e.clientX,e.clientY))&&(this.view.dispatch({effects:this.setHover.of([])}),this.pending=null)}}mouseleave(e){clearTimeout(this.hoverTimeout),this.hoverTimeout=-1;let{active:i}=this;if(i.length){let{tooltip:s}=this;s&&s.dom.contains(e.relatedTarget)?this.watchTooltipLeave(s.dom):this.view.dispatch({effects:this.setHover.of([])})}}watchTooltipLeave(e){let i=s=>{e.removeEventListener("mouseleave",i),this.active.length&&!this.view.dom.contains(s.relatedTarget)&&this.view.dispatch({effects:this.setHover.of([])})};e.addEventListener("mouseleave",i)}destroy(){clearTimeout(this.hoverTimeout),clearTimeout(this.restartTimeout),this.view.dom.removeEventListener("mouseleave",this.mouseleave),this.view.dom.removeEventListener("mousemove",this.mousemove)}}const qr=4;function H0(t,e){let{left:i,right:s,top:r,bottom:n}=t.getBoundingClientRect(),o;if(o=t.querySelector(".cm-tooltip-arrow")){let a=o.getBoundingClientRect();r=Math.min(a.top,r),n=Math.max(a.bottom,n)}return e.clientX>=i-qr&&e.clientX<=s+qr&&e.clientY>=r-qr&&e.clientY<=n+qr}function W0(t,e,i,s,r,n){let o=t.scrollDOM.getBoundingClientRect(),a=t.documentTop+t.documentPadding.top+t.contentHeight;if(o.left>s||o.right<s||o.top>r||Math.min(o.bottom,a)<r)return!1;let l=t.posAtCoords({x:s,y:r},!1);return l>=e&&l<=i}function U0(t,e={}){let i=H.define(),s=_e.define({create(){return[]},update(r,n){if(r.length&&(e.hideOnChange&&(n.docChanged||n.selection)?r=[]:e.hideOn&&(r=r.filter(o=>!e.hideOn(n,o))),n.docChanged)){let o=[];for(let a of r){let l=n.changes.mapPos(a.pos,-1,Ie.TrackDel);if(l!=null){let c=Object.assign(Object.create(null),a);c.pos=l,c.end!=null&&(c.end=n.changes.mapPos(c.end)),o.push(c)}}r=o}for(let o of n.effects)o.is(i)&&(r=o.value),o.is(q0)&&(r=[]);return r},provide:r=>Tn.from(r)});return{active:s,extension:[s,me.define(r=>new z0(r,t,s,i,e.hoverTime||300)),N0]}}function Xf(t,e){let i=t.plugin($l);if(!i)return null;let s=i.manager.tooltips.indexOf(e);return s<0?null:i.manager.tooltipViews[s]}const q0=H.define(),ch=_.define({combine(t){let e,i;for(let s of t)e=e||s.topContainer,i=i||s.bottomContainer;return{topContainer:e,bottomContainer:i}}});function Tl(t,e){let i=t.plugin(Jf),s=i?i.specs.indexOf(e):-1;return s>-1?i.panels[s]:null}const Jf=me.fromClass(class{constructor(t){this.input=t.state.facet(cr),this.specs=this.input.filter(i=>i),this.panels=this.specs.map(i=>i(t));let e=t.state.facet(ch);this.top=new Vr(t,!0,e.topContainer),this.bottom=new Vr(t,!1,e.bottomContainer),this.top.sync(this.panels.filter(i=>i.top)),this.bottom.sync(this.panels.filter(i=>!i.top));for(let i of this.panels)i.dom.classList.add("cm-panel"),i.mount&&i.mount()}update(t){let e=t.state.facet(ch);this.top.container!=e.topContainer&&(this.top.sync([]),this.top=new Vr(t.view,!0,e.topContainer)),this.bottom.container!=e.bottomContainer&&(this.bottom.sync([]),this.bottom=new Vr(t.view,!1,e.bottomContainer)),this.top.syncClasses(),this.bottom.syncClasses();let i=t.state.facet(cr);if(i!=this.input){let s=i.filter(l=>l),r=[],n=[],o=[],a=[];for(let l of s){let c=this.specs.indexOf(l),h;c<0?(h=l(t.view),a.push(h)):(h=this.panels[c],h.update&&h.update(t)),r.push(h),(h.top?n:o).push(h)}this.specs=s,this.panels=r,this.top.sync(n),this.bottom.sync(o);for(let l of a)l.dom.classList.add("cm-panel"),l.mount&&l.mount()}else for(let s of this.panels)s.update&&s.update(t)}destroy(){this.top.sync([]),this.bottom.sync([])}},{provide:t=>B.scrollMargins.of(e=>{let i=e.plugin(t);return i&&{top:i.top.scrollMargin(),bottom:i.bottom.scrollMargin()}})});class Vr{constructor(e,i,s){this.view=e,this.top=i,this.container=s,this.dom=void 0,this.classes="",this.panels=[],this.syncClasses()}sync(e){for(let i of this.panels)i.destroy&&e.indexOf(i)<0&&i.destroy();this.panels=e,this.syncDOM()}syncDOM(){if(this.panels.length==0){this.dom&&(this.dom.remove(),this.dom=void 0);return}if(!this.dom){this.dom=document.createElement("div"),this.dom.className=this.top?"cm-panels cm-panels-top":"cm-panels cm-panels-bottom",this.dom.style[this.top?"top":"bottom"]="0";let i=this.container||this.view.dom;i.insertBefore(this.dom,this.top?i.firstChild:null)}let e=this.dom.firstChild;for(let i of this.panels)if(i.dom.parentNode==this.dom){for(;e!=i.dom;)e=hh(e);e=e.nextSibling}else this.dom.insertBefore(i.dom,e);for(;e;)e=hh(e)}scrollMargin(){return!this.dom||this.container?0:Math.max(0,this.top?this.dom.getBoundingClientRect().bottom-Math.max(0,this.view.scrollDOM.getBoundingClientRect().top):Math.min(innerHeight,this.view.scrollDOM.getBoundingClientRect().bottom)-this.dom.getBoundingClientRect().top)}syncClasses(){if(!(!this.container||this.classes==this.view.themeClasses)){for(let e of this.classes.split(" "))e&&this.container.classList.remove(e);for(let e of(this.classes=this.view.themeClasses).split(" "))e&&this.container.classList.add(e)}}}function hh(t){let e=t.nextSibling;return t.remove(),e}const cr=_.define({enables:Jf});function V0(t,e){let i,s=new Promise(o=>i=o),r=o=>Q0(o,e,i);t.state.field(Ro,!1)?t.dispatch({effects:Yf.of(r)}):t.dispatch({effects:H.appendConfig.of(Ro.init(()=>[r]))});let n=Gf.of(r);return{close:n,result:s.then(o=>((t.win.queueMicrotask||(l=>t.win.setTimeout(l,10)))(()=>{t.state.field(Ro).indexOf(r)>-1&&t.dispatch({effects:n})}),o))}}const Ro=_e.define({create(){return[]},update(t,e){for(let i of e.effects)i.is(Yf)?t=[i.value].concat(t):i.is(Gf)&&(t=t.filter(s=>s!=i.value));return t},provide:t=>cr.computeN([t],e=>e.field(t))}),Yf=H.define(),Gf=H.define();function Q0(t,e,i){let s=e.content?e.content(t,()=>o(null)):null;if(!s){if(s=Z("form"),e.input){let a=Z("input",e.input);/^(text|password|number|email|tel|url)$/.test(a.type)&&a.classList.add("cm-textfield"),a.name||(a.name="input"),s.appendChild(Z("label",(e.label||"")+": ",a))}else s.appendChild(document.createTextNode(e.label||""));s.appendChild(document.createTextNode(" ")),s.appendChild(Z("button",{class:"cm-button",type:"submit"},e.submitLabel||"OK"))}let r=s.nodeName=="FORM"?[s]:s.querySelectorAll("form");for(let a=0;a<r.length;a++){let l=r[a];l.addEventListener("keydown",c=>{c.keyCode==27?(c.preventDefault(),o(null)):c.keyCode==13&&(c.preventDefault(),o(l))}),l.addEventListener("submit",c=>{c.preventDefault(),o(l)})}let n=Z("div",s,Z("button",{onclick:()=>o(null),"aria-label":t.state.phrase("close"),class:"cm-dialog-close",type:"button"},["×"]));e.class&&(n.className=e.class),n.classList.add("cm-dialog");function o(a){n.contains(n.ownerDocument.activeElement)&&t.focus(),i(a)}return{dom:n,top:e.top,mount:()=>{if(e.focus){let a;typeof e.focus=="string"?a=s.querySelector(e.focus):a=s.querySelector("input")||s.querySelector("button"),a&&"select"in a?a.select():a&&"focus"in a&&a.focus()}}}}class Xt extends ci{compare(e){return this==e||this.constructor==e.constructor&&this.eq(e)}eq(e){return!1}destroy(e){}}Xt.prototype.elementClass="";Xt.prototype.toDOM=void 0;Xt.prototype.mapMode=Ie.TrackBefore;Xt.prototype.startSide=Xt.prototype.endSide=-1;Xt.prototype.point=!0;const hn=_.define(),j0=_.define(),K0={class:"",renderEmptyElements:!1,elementStyle:"",markers:()=>V.empty,lineMarker:()=>null,widgetMarker:()=>null,lineMarkerChange:null,initialSpacer:null,updateSpacer:null,domEventHandlers:{},side:"before"},Xs=_.define();function X0(t){return[Zf(),Xs.of({...K0,...t})]}const dh=_.define({combine:t=>t.some(e=>e)});function Zf(t){return[J0]}const J0=me.fromClass(class{constructor(t){this.view=t,this.domAfter=null,this.prevViewport=t.viewport,this.dom=document.createElement("div"),this.dom.className="cm-gutters cm-gutters-before",this.dom.setAttribute("aria-hidden","true"),this.dom.style.minHeight=this.view.contentHeight/this.view.scaleY+"px",this.gutters=t.state.facet(Xs).map(e=>new uh(t,e)),this.fixed=!t.state.facet(dh);for(let e of this.gutters)e.config.side=="after"?this.getDOMAfter().appendChild(e.dom):this.dom.appendChild(e.dom);this.fixed&&(this.dom.style.position="sticky"),this.syncGutters(!1),t.scrollDOM.insertBefore(this.dom,t.contentDOM)}getDOMAfter(){return this.domAfter||(this.domAfter=document.createElement("div"),this.domAfter.className="cm-gutters cm-gutters-after",this.domAfter.setAttribute("aria-hidden","true"),this.domAfter.style.minHeight=this.view.contentHeight/this.view.scaleY+"px",this.domAfter.style.position=this.fixed?"sticky":"",this.view.scrollDOM.appendChild(this.domAfter)),this.domAfter}update(t){if(this.updateGutters(t)){let e=this.prevViewport,i=t.view.viewport,s=Math.min(e.to,i.to)-Math.max(e.from,i.from);this.syncGutters(s<(i.to-i.from)*.8)}if(t.geometryChanged){let e=this.view.contentHeight/this.view.scaleY+"px";this.dom.style.minHeight=e,this.domAfter&&(this.domAfter.style.minHeight=e)}this.view.state.facet(dh)!=!this.fixed&&(this.fixed=!this.fixed,this.dom.style.position=this.fixed?"sticky":"",this.domAfter&&(this.domAfter.style.position=this.fixed?"sticky":"")),this.prevViewport=t.view.viewport}syncGutters(t){let e=this.dom.nextSibling;t&&(this.dom.remove(),this.domAfter&&this.domAfter.remove());let i=V.iter(this.view.state.facet(hn),this.view.viewport.from),s=[],r=this.gutters.map(n=>new Y0(n,this.view.viewport,-this.view.documentPadding.top));for(let n of this.view.viewportLineBlocks)if(s.length&&(s=[]),Array.isArray(n.type)){let o=!0;for(let a of n.type)if(a.type==Pe.Text&&o){Fa(i,s,a.from);for(let l of r)l.line(this.view,a,s);o=!1}else if(a.widget)for(let l of r)l.widget(this.view,a)}else if(n.type==Pe.Text){Fa(i,s,n.from);for(let o of r)o.line(this.view,n,s)}else if(n.widget)for(let o of r)o.widget(this.view,n);for(let n of r)n.finish();t&&(this.view.scrollDOM.insertBefore(this.dom,e),this.domAfter&&this.view.scrollDOM.appendChild(this.domAfter))}updateGutters(t){let e=t.startState.facet(Xs),i=t.state.facet(Xs),s=t.docChanged||t.heightChanged||t.viewportChanged||!V.eq(t.startState.facet(hn),t.state.facet(hn),t.view.viewport.from,t.view.viewport.to);if(e==i)for(let r of this.gutters)r.update(t)&&(s=!0);else{s=!0;let r=[];for(let n of i){let o=e.indexOf(n);o<0?r.push(new uh(this.view,n)):(this.gutters[o].update(t),r.push(this.gutters[o]))}for(let n of this.gutters)n.dom.remove(),r.indexOf(n)<0&&n.destroy();for(let n of r)n.config.side=="after"?this.getDOMAfter().appendChild(n.dom):this.dom.appendChild(n.dom);this.gutters=r}return s}destroy(){for(let t of this.gutters)t.destroy();this.dom.remove(),this.domAfter&&this.domAfter.remove()}},{provide:t=>B.scrollMargins.of(e=>{let i=e.plugin(t);if(!i||i.gutters.length==0||!i.fixed)return null;let s=i.dom.offsetWidth*e.scaleX,r=i.domAfter?i.domAfter.offsetWidth*e.scaleX:0;return e.textDirection==ie.LTR?{left:s,right:r}:{right:s,left:r}})});function fh(t){return Array.isArray(t)?t:[t]}function Fa(t,e,i){for(;t.value&&t.from<=i;)t.from==i&&e.push(t.value),t.next()}class Y0{constructor(e,i,s){this.gutter=e,this.height=s,this.i=0,this.cursor=V.iter(e.markers,i.from)}addElement(e,i,s){let{gutter:r}=this,n=(i.top-this.height)/e.scaleY,o=i.height/e.scaleY;if(this.i==r.elements.length){let a=new eu(e,o,n,s);r.elements.push(a),r.dom.appendChild(a.dom)}else r.elements[this.i].update(e,o,n,s);this.height=i.bottom,this.i++}line(e,i,s){let r=[];Fa(this.cursor,r,i.from),s.length&&(r=r.concat(s));let n=this.gutter.config.lineMarker(e,i,r);n&&r.unshift(n);let o=this.gutter;r.length==0&&!o.config.renderEmptyElements||this.addElement(e,i,r)}widget(e,i){let s=this.gutter.config.widgetMarker(e,i.widget,i),r=s?[s]:null;for(let n of e.state.facet(j0)){let o=n(e,i.widget,i);o&&(r||(r=[])).push(o)}r&&this.addElement(e,i,r)}finish(){let e=this.gutter;for(;e.elements.length>this.i;){let i=e.elements.pop();e.dom.removeChild(i.dom),i.destroy()}}}class uh{constructor(e,i){this.view=e,this.config=i,this.elements=[],this.spacer=null,this.dom=document.createElement("div"),this.dom.className="cm-gutter"+(this.config.class?" "+this.config.class:"");for(let s in i.domEventHandlers)this.dom.addEventListener(s,r=>{let n=r.target,o;if(n!=this.dom&&this.dom.contains(n)){for(;n.parentNode!=this.dom;)n=n.parentNode;let l=n.getBoundingClientRect();o=(l.top+l.bottom)/2}else o=r.clientY;let a=e.lineBlockAtHeight(o-e.documentTop);i.domEventHandlers[s](e,a,r)&&r.preventDefault()});this.markers=fh(i.markers(e)),i.initialSpacer&&(this.spacer=new eu(e,0,0,[i.initialSpacer(e)]),this.dom.appendChild(this.spacer.dom),this.spacer.dom.style.cssText+="visibility: hidden; pointer-events: none")}update(e){let i=this.markers;if(this.markers=fh(this.config.markers(e.view)),this.spacer&&this.config.updateSpacer){let r=this.config.updateSpacer(this.spacer.markers[0],e);r!=this.spacer.markers[0]&&this.spacer.update(e.view,0,0,[r])}let s=e.view.viewport;return!V.eq(this.markers,i,s.from,s.to)||(this.config.lineMarkerChange?this.config.lineMarkerChange(e):!1)}destroy(){for(let e of this.elements)e.destroy()}}class eu{constructor(e,i,s,r){this.height=-1,this.above=0,this.markers=[],this.dom=document.createElement("div"),this.dom.className="cm-gutterElement",this.update(e,i,s,r)}update(e,i,s,r){this.height!=i&&(this.height=i,this.dom.style.height=i+"px"),this.above!=s&&(this.dom.style.marginTop=(this.above=s)?s+"px":""),G0(this.markers,r)||this.setMarkers(e,r)}setMarkers(e,i){let s="cm-gutterElement",r=this.dom.firstChild;for(let n=0,o=0;;){let a=o,l=n<i.length?i[n++]:null,c=!1;if(l){let h=l.elementClass;h&&(s+=" "+h);for(let d=o;d<this.markers.length;d++)if(this.markers[d].compare(l)){a=d,c=!0;break}}else a=this.markers.length;for(;o<a;){let h=this.markers[o++];if(h.toDOM){h.destroy(r);let d=r.nextSibling;r.remove(),r=d}}if(!l)break;l.toDOM&&(c?r=r.nextSibling:this.dom.insertBefore(l.toDOM(e),r)),c&&o++}this.dom.className=s,this.markers=i}destroy(){this.setMarkers(null,[])}}function G0(t,e){if(t.length!=e.length)return!1;for(let i=0;i<t.length;i++)if(!t[i].compare(e[i]))return!1;return!0}const Z0=_.define(),ev=_.define(),is=_.define({combine(t){return Ft(t,{formatNumber:String,domEventHandlers:{}},{domEventHandlers(e,i){let s=Object.assign({},e);for(let r in i){let n=s[r],o=i[r];s[r]=n?(a,l,c)=>n(a,l,c)||o(a,l,c):o}return s}})}});class Lo extends Xt{constructor(e){super(),this.number=e}eq(e){return this.number==e.number}toDOM(){return document.createTextNode(this.number)}}function Io(t,e){return t.state.facet(is).formatNumber(e,t.state)}const tv=Xs.compute([is],t=>({class:"cm-lineNumbers",renderEmptyElements:!1,markers(e){return e.state.facet(Z0)},lineMarker(e,i,s){return s.some(r=>r.toDOM)?null:new Lo(Io(e,e.state.doc.lineAt(i.from).number))},widgetMarker:(e,i,s)=>{for(let r of e.state.facet(ev)){let n=r(e,i,s);if(n)return n}return null},lineMarkerChange:e=>e.startState.facet(is)!=e.state.facet(is),initialSpacer(e){return new Lo(Io(e,ph(e.state.doc.lines)))},updateSpacer(e,i){let s=Io(i.view,ph(i.view.state.doc.lines));return s==e.number?e:new Lo(s)},domEventHandlers:t.facet(is).domEventHandlers,side:"before"}));function iv(t={}){return[is.of(t),Zf(),tv]}function ph(t){let e=9;for(;e<t;)e=e*10+9;return e}const sv=new class extends Xt{constructor(){super(...arguments),this.elementClass="cm-activeLineGutter"}},rv=hn.compute(["selection"],t=>{let e=[],i=-1;for(let s of t.selection.ranges){let r=t.doc.lineAt(s.head).from;r>i&&(i=r,e.push(sv.range(r)))}return V.of(e)});function nv(){return rv}const tu=1024;let ov=0;class Fo{constructor(e,i){this.from=e,this.to=i}}class W{constructor(e={}){this.id=ov++,this.perNode=!!e.perNode,this.deserialize=e.deserialize||(()=>{throw new Error("This node type doesn't define a deserialize function")}),this.combine=e.combine||null}add(e){if(this.perNode)throw new RangeError("Can't add per-node props to node types");return typeof e!="function"&&(e=je.match(e)),i=>{let s=e(i);return s===void 0?null:[this,s]}}}W.closedBy=new W({deserialize:t=>t.split(" ")});W.openedBy=new W({deserialize:t=>t.split(" ")});W.group=new W({deserialize:t=>t.split(" ")});W.isolate=new W({deserialize:t=>{if(t&&t!="rtl"&&t!="ltr"&&t!="auto")throw new RangeError("Invalid value for isolate: "+t);return t||"auto"}});W.contextHash=new W({perNode:!0});W.lookAhead=new W({perNode:!0});W.mounted=new W({perNode:!0});class Js{constructor(e,i,s,r=!1){this.tree=e,this.overlay=i,this.parser=s,this.bracketed=r}static get(e){return e&&e.props&&e.props[W.mounted.id]}}const av=Object.create(null);class je{constructor(e,i,s,r=0){this.name=e,this.props=i,this.id=s,this.flags=r}static define(e){let i=e.props&&e.props.length?Object.create(null):av,s=(e.top?1:0)|(e.skipped?2:0)|(e.error?4:0)|(e.name==null?8:0),r=new je(e.name||"",i,e.id,s);if(e.props){for(let n of e.props)if(Array.isArray(n)||(n=n(r)),n){if(n[0].perNode)throw new RangeError("Can't store a per-node prop on a node type");i[n[0].id]=n[1]}}return r}prop(e){return this.props[e.id]}get isTop(){return(this.flags&1)>0}get isSkipped(){return(this.flags&2)>0}get isError(){return(this.flags&4)>0}get isAnonymous(){return(this.flags&8)>0}is(e){if(typeof e=="string"){if(this.name==e)return!0;let i=this.prop(W.group);return i?i.indexOf(e)>-1:!1}return this.id==e}static match(e){let i=Object.create(null);for(let s in e)for(let r of s.split(" "))i[r]=e[s];return s=>{for(let r=s.prop(W.group),n=-1;n<(r?r.length:0);n++){let o=i[n<0?s.name:r[n]];if(o)return o}}}}je.none=new je("",Object.create(null),0,8);class Ml{constructor(e){this.types=e;for(let i=0;i<e.length;i++)if(e[i].id!=i)throw new RangeError("Node type ids should correspond to array positions when creating a node set")}extend(...e){let i=[];for(let s of this.types){let r=null;for(let n of e){let o=n(s);if(o){r||(r=Object.assign({},s.props));let a=o[1],l=o[0];l.combine&&l.id in r&&(a=l.combine(r[l.id],a)),r[l.id]=a}}i.push(r?new je(s.name,r,s.id,s.flags):s)}return new Ml(i)}}const Qr=new WeakMap,gh=new WeakMap;var fe;(function(t){t[t.ExcludeBuffers=1]="ExcludeBuffers",t[t.IncludeAnonymous=2]="IncludeAnonymous",t[t.IgnoreMounts=4]="IgnoreMounts",t[t.IgnoreOverlays=8]="IgnoreOverlays",t[t.EnterBracketed=16]="EnterBracketed"})(fe||(fe={}));class ge{constructor(e,i,s,r,n){if(this.type=e,this.children=i,this.positions=s,this.length=r,this.props=null,n&&n.length){this.props=Object.create(null);for(let[o,a]of n)this.props[typeof o=="number"?o:o.id]=a}}toString(){let e=Js.get(this);if(e&&!e.overlay)return e.tree.toString();let i="";for(let s of this.children){let r=s.toString();r&&(i&&(i+=","),i+=r)}return this.type.name?(/\W/.test(this.type.name)&&!this.type.isError?JSON.stringify(this.type.name):this.type.name)+(i.length?"("+i+")":""):i}cursor(e=0){return new za(this.topNode,e)}cursorAt(e,i=0,s=0){let r=Qr.get(this)||this.topNode,n=new za(r);return n.moveTo(e,i),Qr.set(this,n._tree),n}get topNode(){return new ot(this,0,0,null)}resolve(e,i=0){let s=hr(Qr.get(this)||this.topNode,e,i,!1);return Qr.set(this,s),s}resolveInner(e,i=0){let s=hr(gh.get(this)||this.topNode,e,i,!0);return gh.set(this,s),s}resolveStack(e,i=0){return hv(this,e,i)}iterate(e){let{enter:i,leave:s,from:r=0,to:n=this.length}=e,o=e.mode||0,a=(o&fe.IncludeAnonymous)>0;for(let l=this.cursor(o|fe.IncludeAnonymous);;){let c=!1;if(l.from<=n&&l.to>=r&&(!a&&l.type.isAnonymous||i(l)!==!1)){if(l.firstChild())continue;c=!0}for(;c&&s&&(a||!l.type.isAnonymous)&&s(l),!l.nextSibling();){if(!l.parent())return;c=!0}}}prop(e){return e.perNode?this.props?this.props[e.id]:void 0:this.type.prop(e)}get propValues(){let e=[];if(this.props)for(let i in this.props)e.push([+i,this.props[i]]);return e}balance(e={}){return this.children.length<=8?this:_l(je.none,this.children,this.positions,0,this.children.length,0,this.length,(i,s,r)=>new ge(this.type,i,s,r,this.propValues),e.makeTree||((i,s,r)=>new ge(je.none,i,s,r)))}static build(e){return dv(e)}}ge.empty=new ge(je.none,[],[],0);class El{constructor(e,i){this.buffer=e,this.index=i}get id(){return this.buffer[this.index-4]}get start(){return this.buffer[this.index-3]}get end(){return this.buffer[this.index-2]}get size(){return this.buffer[this.index-1]}get pos(){return this.index}next(){this.index-=4}fork(){return new El(this.buffer,this.index)}}class ui{constructor(e,i,s){this.buffer=e,this.length=i,this.set=s}get type(){return je.none}toString(){let e=[];for(let i=0;i<this.buffer.length;)e.push(this.childString(i)),i=this.buffer[i+3];return e.join(",")}childString(e){let i=this.buffer[e],s=this.buffer[e+3],r=this.set.types[i],n=r.name;if(/\W/.test(n)&&!r.isError&&(n=JSON.stringify(n)),e+=4,s==e)return n;let o=[];for(;e<s;)o.push(this.childString(e)),e=this.buffer[e+3];return n+"("+o.join(",")+")"}findChild(e,i,s,r,n){let{buffer:o}=this,a=-1;for(let l=e;l!=i&&!(iu(n,r,o[l+1],o[l+2])&&(a=l,s>0));l=o[l+3]);return a}slice(e,i,s){let r=this.buffer,n=new Uint16Array(i-e),o=0;for(let a=e,l=0;a<i;){n[l++]=r[a++],n[l++]=r[a++]-s;let c=n[l++]=r[a++]-s;n[l++]=r[a++]-e,o=Math.max(o,c)}return new ui(n,o,this.set)}}function iu(t,e,i,s){switch(t){case-2:return i<e;case-1:return s>=e&&i<e;case 0:return i<e&&s>e;case 1:return i<=e&&s>e;case 2:return s>e;case 4:return!0}}function hr(t,e,i,s){for(var r;t.from==t.to||(i<1?t.from>=e:t.from>e)||(i>-1?t.to<=e:t.to<e);){let o=!s&&t instanceof ot&&t.index<0?null:t.parent;if(!o)return t;t=o}let n=s?0:fe.IgnoreOverlays;if(s)for(let o=t,a=o.parent;a;o=a,a=o.parent)o instanceof ot&&o.index<0&&((r=a.enter(e,i,n))===null||r===void 0?void 0:r.from)!=o.from&&(t=a);for(;;){let o=t.enter(e,i,n);if(!o)return t;t=o}}class su{cursor(e=0){return new za(this,e)}getChild(e,i=null,s=null){let r=mh(this,e,i,s);return r.length?r[0]:null}getChildren(e,i=null,s=null){return mh(this,e,i,s)}resolve(e,i=0){return hr(this,e,i,!1)}resolveInner(e,i=0){return hr(this,e,i,!0)}matchContext(e){return Na(this.parent,e)}enterUnfinishedNodesBefore(e){let i=this.childBefore(e),s=this;for(;i;){let r=i.lastChild;if(!r||r.to!=i.to)break;r.type.isError&&r.from==r.to?(s=i,i=r.prevSibling):i=r}return s}get node(){return this}get next(){return this.parent}}class ot extends su{constructor(e,i,s,r){super(),this._tree=e,this.from=i,this.index=s,this._parent=r}get type(){return this._tree.type}get name(){return this._tree.type.name}get to(){return this.from+this._tree.length}nextChild(e,i,s,r,n=0){for(let o=this;;){for(let{children:a,positions:l}=o._tree,c=i>0?a.length:-1;e!=c;e+=i){let h=a[e],d=l[e]+o.from,f;if(!(!(n&fe.EnterBracketed&&h instanceof ge&&(f=Js.get(h))&&!f.overlay&&f.bracketed&&s>=d&&s<=d+h.length)&&!iu(r,s,d,d+h.length))){if(h instanceof ui){if(n&fe.ExcludeBuffers)continue;let u=h.findChild(0,h.buffer.length,i,s-d,r);if(u>-1)return new ri(new lv(o,h,e,d),null,u)}else if(n&fe.IncludeAnonymous||!h.type.isAnonymous||Dl(h)){let u;if(!(n&fe.IgnoreMounts)&&(u=Js.get(h))&&!u.overlay)return new ot(u.tree,d,e,o);let p=new ot(h,d,e,o);return n&fe.IncludeAnonymous||!p.type.isAnonymous?p:p.nextChild(i<0?h.children.length-1:0,i,s,r,n)}}}if(n&fe.IncludeAnonymous||!o.type.isAnonymous||(o.index>=0?e=o.index+i:e=i<0?-1:o._parent._tree.children.length,o=o._parent,!o))return null}}get firstChild(){return this.nextChild(0,1,0,4)}get lastChild(){return this.nextChild(this._tree.children.length-1,-1,0,4)}childAfter(e){return this.nextChild(0,1,e,2)}childBefore(e){return this.nextChild(this._tree.children.length-1,-1,e,-2)}prop(e){return this._tree.prop(e)}enter(e,i,s=0){let r;if(!(s&fe.IgnoreOverlays)&&(r=Js.get(this._tree))&&r.overlay){let n=e-this.from,o=s&fe.EnterBracketed&&r.bracketed;for(let{from:a,to:l}of r.overlay)if((i>0||o?a<=n:a<n)&&(i<0||o?l>=n:l>n))return new ot(r.tree,r.overlay[0].from+this.from,-1,this)}return this.nextChild(0,1,e,i,s)}nextSignificantParent(){let e=this;for(;e.type.isAnonymous&&e._parent;)e=e._parent;return e}get parent(){return this._parent?this._parent.nextSignificantParent():null}get nextSibling(){return this._parent&&this.index>=0?this._parent.nextChild(this.index+1,1,0,4):null}get prevSibling(){return this._parent&&this.index>=0?this._parent.nextChild(this.index-1,-1,0,4):null}get tree(){return this._tree}toTree(){return this._tree}toString(){return this._tree.toString()}}function mh(t,e,i,s){let r=t.cursor(),n=[];if(!r.firstChild())return n;if(i!=null){for(let o=!1;!o;)if(o=r.type.is(i),!r.nextSibling())return n}for(;;){if(s!=null&&r.type.is(s))return n;if(r.type.is(e)&&n.push(r.node),!r.nextSibling())return s==null?n:[]}}function Na(t,e,i=e.length-1){for(let s=t;i>=0;s=s.parent){if(!s)return!1;if(!s.type.isAnonymous){if(e[i]&&e[i]!=s.name)return!1;i--}}return!0}class lv{constructor(e,i,s,r){this.parent=e,this.buffer=i,this.index=s,this.start=r}}class ri extends su{get name(){return this.type.name}get from(){return this.context.start+this.context.buffer.buffer[this.index+1]}get to(){return this.context.start+this.context.buffer.buffer[this.index+2]}constructor(e,i,s){super(),this.context=e,this._parent=i,this.index=s,this.type=e.buffer.set.types[e.buffer.buffer[s]]}child(e,i,s){let{buffer:r}=this.context,n=r.findChild(this.index+4,r.buffer[this.index+3],e,i-this.context.start,s);return n<0?null:new ri(this.context,this,n)}get firstChild(){return this.child(1,0,4)}get lastChild(){return this.child(-1,0,4)}childAfter(e){return this.child(1,e,2)}childBefore(e){return this.child(-1,e,-2)}prop(e){return this.type.prop(e)}enter(e,i,s=0){if(s&fe.ExcludeBuffers)return null;let{buffer:r}=this.context,n=r.findChild(this.index+4,r.buffer[this.index+3],i>0?1:-1,e-this.context.start,i);return n<0?null:new ri(this.context,this,n)}get parent(){return this._parent||this.context.parent.nextSignificantParent()}externalSibling(e){return this._parent?null:this.context.parent.nextChild(this.context.index+e,e,0,4)}get nextSibling(){let{buffer:e}=this.context,i=e.buffer[this.index+3];return i<(this._parent?e.buffer[this._parent.index+3]:e.buffer.length)?new ri(this.context,this._parent,i):this.externalSibling(1)}get prevSibling(){let{buffer:e}=this.context,i=this._parent?this._parent.index+4:0;return this.index==i?this.externalSibling(-1):new ri(this.context,this._parent,e.findChild(i,this.index,-1,0,4))}get tree(){return null}toTree(){let e=[],i=[],{buffer:s}=this.context,r=this.index+4,n=s.buffer[this.index+3];if(n>r){let o=s.buffer[this.index+1];e.push(s.slice(r,n,o)),i.push(0)}return new ge(this.type,e,i,this.to-this.from)}toString(){return this.context.buffer.childString(this.index)}}function ru(t){if(!t.length)return null;let e=0,i=t[0];for(let n=1;n<t.length;n++){let o=t[n];(o.from>i.from||o.to<i.to)&&(i=o,e=n)}let s=i instanceof ot&&i.index<0?null:i.parent,r=t.slice();return s?r[e]=s:r.splice(e,1),new cv(r,i)}class cv{constructor(e,i){this.heads=e,this.node=i}get next(){return ru(this.heads)}}function hv(t,e,i){let s=t.resolveInner(e,i),r=null;for(let n=s instanceof ot?s:s.context.parent;n;n=n.parent)if(n.index<0){let o=n.parent;(r||(r=[s])).push(o.resolve(e,i)),n=o}else{let o=Js.get(n.tree);if(o&&o.overlay&&o.overlay[0].from<=e&&o.overlay[o.overlay.length-1].to>=e){let a=new ot(o.tree,o.overlay[0].from+n.from,-1,n);(r||(r=[s])).push(hr(a,e,i,!1))}}return r?ru(r):s}class za{get name(){return this.type.name}constructor(e,i=0){if(this.buffer=null,this.stack=[],this.index=0,this.bufferNode=null,this.mode=i&~fe.EnterBracketed,e instanceof ot)this.yieldNode(e);else{this._tree=e.context.parent,this.buffer=e.context;for(let s=e._parent;s;s=s._parent)this.stack.unshift(s.index);this.bufferNode=e,this.yieldBuf(e.index)}}yieldNode(e){return e?(this._tree=e,this.type=e.type,this.from=e.from,this.to=e.to,!0):!1}yieldBuf(e,i){this.index=e;let{start:s,buffer:r}=this.buffer;return this.type=i||r.set.types[r.buffer[e]],this.from=s+r.buffer[e+1],this.to=s+r.buffer[e+2],!0}yield(e){return e?e instanceof ot?(this.buffer=null,this.yieldNode(e)):(this.buffer=e.context,this.yieldBuf(e.index,e.type)):!1}toString(){return this.buffer?this.buffer.buffer.childString(this.index):this._tree.toString()}enterChild(e,i,s){if(!this.buffer)return this.yield(this._tree.nextChild(e<0?this._tree._tree.children.length-1:0,e,i,s,this.mode));let{buffer:r}=this.buffer,n=r.findChild(this.index+4,r.buffer[this.index+3],e,i-this.buffer.start,s);return n<0?!1:(this.stack.push(this.index),this.yieldBuf(n))}firstChild(){return this.enterChild(1,0,4)}lastChild(){return this.enterChild(-1,0,4)}childAfter(e){return this.enterChild(1,e,2)}childBefore(e){return this.enterChild(-1,e,-2)}enter(e,i,s=this.mode){return this.buffer?s&fe.ExcludeBuffers?!1:this.enterChild(1,e,i):this.yield(this._tree.enter(e,i,s))}parent(){if(!this.buffer)return this.yieldNode(this.mode&fe.IncludeAnonymous?this._tree._parent:this._tree.parent);if(this.stack.length)return this.yieldBuf(this.stack.pop());let e=this.mode&fe.IncludeAnonymous?this.buffer.parent:this.buffer.parent.nextSignificantParent();return this.buffer=null,this.yieldNode(e)}sibling(e){if(!this.buffer)return this._tree._parent?this.yield(this._tree.index<0?null:this._tree._parent.nextChild(this._tree.index+e,e,0,4,this.mode)):!1;let{buffer:i}=this.buffer,s=this.stack.length-1;if(e<0){let r=s<0?0:this.stack[s]+4;if(this.index!=r)return this.yieldBuf(i.findChild(r,this.index,-1,0,4))}else{let r=i.buffer[this.index+3];if(r<(s<0?i.buffer.length:i.buffer[this.stack[s]+3]))return this.yieldBuf(r)}return s<0?this.yield(this.buffer.parent.nextChild(this.buffer.index+e,e,0,4,this.mode)):!1}nextSibling(){return this.sibling(1)}prevSibling(){return this.sibling(-1)}atLastNode(e){let i,s,{buffer:r}=this;if(r){if(e>0){if(this.index<r.buffer.buffer.length)return!1}else for(let n=0;n<this.index;n++)if(r.buffer.buffer[n+3]<this.index)return!1;({index:i,parent:s}=r)}else({index:i,_parent:s}=this._tree);for(;s;{index:i,_parent:s}=s)if(i>-1)for(let n=i+e,o=e<0?-1:s._tree.children.length;n!=o;n+=e){let a=s._tree.children[n];if(this.mode&fe.IncludeAnonymous||a instanceof ui||!a.type.isAnonymous||Dl(a))return!1}return!0}move(e,i){if(i&&this.enterChild(e,0,4))return!0;for(;;){if(this.sibling(e))return!0;if(this.atLastNode(e)||!this.parent())return!1}}next(e=!0){return this.move(1,e)}prev(e=!0){return this.move(-1,e)}moveTo(e,i=0){for(;(this.from==this.to||(i<1?this.from>=e:this.from>e)||(i>-1?this.to<=e:this.to<e))&&this.parent(););for(;this.enterChild(1,e,i););return this}get node(){if(!this.buffer)return this._tree;let e=this.bufferNode,i=null,s=0;if(e&&e.context==this.buffer)e:for(let r=this.index,n=this.stack.length;n>=0;){for(let o=e;o;o=o._parent)if(o.index==r){if(r==this.index)return o;i=o,s=n+1;break e}r=this.stack[--n]}for(let r=s;r<this.stack.length;r++)i=new ri(this.buffer,i,this.stack[r]);return this.bufferNode=new ri(this.buffer,i,this.index)}get tree(){return this.buffer?null:this._tree._tree}iterate(e,i){for(let s=0;;){let r=!1;if(this.type.isAnonymous||e(this)!==!1){if(this.firstChild()){s++;continue}this.type.isAnonymous||(r=!0)}for(;;){if(r&&i&&i(this),r=this.type.isAnonymous,!s)return;if(this.nextSibling())break;this.parent(),s--,r=!0}}}matchContext(e){if(!this.buffer)return Na(this.node.parent,e);let{buffer:i}=this.buffer,{types:s}=i.set;for(let r=e.length-1,n=this.stack.length-1;r>=0;n--){if(n<0)return Na(this._tree,e,r);let o=s[i.buffer[this.stack[n]]];if(!o.isAnonymous){if(e[r]&&e[r]!=o.name)return!1;r--}}return!0}}function Dl(t){return t.children.some(e=>e instanceof ui||!e.type.isAnonymous||Dl(e))}function dv(t){var e;let{buffer:i,nodeSet:s,maxBufferLength:r=tu,reused:n=[],minRepeatType:o=s.types.length}=t,a=Array.isArray(i)?new El(i,i.length):i,l=s.types,c=0,h=0;function d(A,$,P,z,j,ee){let{id:q,start:F,end:G,size:J}=a,re=h,Re=c;if(J<0)if(a.next(),J==-1){let zt=n[q];P.push(zt),z.push(F-A);return}else if(J==-3){c=q;return}else if(J==-4){h=q;return}else throw new RangeError(`Unrecognized record size: ${J}`);let Ke=l[q],xt,Oe,tt=F-A;if(G-F<=r&&(Oe=b(a.pos-$,j))){let zt=new Uint16Array(Oe.size-Oe.skip),it=a.pos-Oe.size,wt=zt.length;for(;a.pos>it;)wt=x(Oe.start,zt,wt);xt=new ui(zt,G-Oe.start,s),tt=Oe.start-A}else{let zt=a.pos-J;a.next();let it=[],wt=[],ki=q>=o?q:-1,Ki=0,Mr=G;for(;a.pos>zt;)ki>=0&&a.id==ki&&a.size>=0?(a.end<=Mr-r&&(p(it,wt,F,Ki,a.end,Mr,ki,re,Re),Ki=it.length,Mr=a.end),a.next()):ee>2500?f(F,zt,it,wt):d(F,zt,it,wt,ki,ee+1);if(ki>=0&&Ki>0&&Ki<it.length&&p(it,wt,F,Ki,F,Mr,ki,re,Re),it.reverse(),wt.reverse(),ki>-1&&Ki>0){let tc=u(Ke,Re);xt=_l(Ke,it,wt,0,it.length,0,G-F,tc,tc)}else xt=m(Ke,it,wt,G-F,re-G,Re)}P.push(xt),z.push(tt)}function f(A,$,P,z){let j=[],ee=0,q=-1;for(;a.pos>$;){let{id:F,start:G,end:J,size:re}=a;if(re>4)a.next();else{if(q>-1&&G<q)break;q<0&&(q=J-r),j.push(F,G,J),ee++,a.next()}}if(ee){let F=new Uint16Array(ee*4),G=j[j.length-2];for(let J=j.length-3,re=0;J>=0;J-=3)F[re++]=j[J],F[re++]=j[J+1]-G,F[re++]=j[J+2]-G,F[re++]=re;P.push(new ui(F,j[2]-G,s)),z.push(G-A)}}function u(A,$){return(P,z,j)=>{let ee=0,q=P.length-1,F,G;if(q>=0&&(F=P[q])instanceof ge){if(!q&&F.type==A&&F.length==j)return F;(G=F.prop(W.lookAhead))&&(ee=z[q]+F.length+G)}return m(A,P,z,j,ee,$)}}function p(A,$,P,z,j,ee,q,F,G){let J=[],re=[];for(;A.length>z;)J.push(A.pop()),re.push($.pop()+P-j);A.push(m(s.types[q],J,re,ee-j,F-ee,G)),$.push(j-P)}function m(A,$,P,z,j,ee,q){if(ee){let F=[W.contextHash,ee];q=q?[F].concat(q):[F]}if(j>25){let F=[W.lookAhead,j];q=q?[F].concat(q):[F]}return new ge(A,$,P,z,q)}function b(A,$){let P=a.fork(),z=0,j=0,ee=0,q=P.end-r,F={size:0,start:0,skip:0};e:for(let G=P.pos-A;P.pos>G;){let J=P.size;if(P.id==$&&J>=0){F.size=z,F.start=j,F.skip=ee,ee+=4,z+=4,P.next();continue}let re=P.pos-J;if(J<0||re<G||P.start<q)break;let Re=P.id>=o?4:0,Ke=P.start;for(P.next();P.pos>re;){if(P.size<0)if(P.size==-3||P.size==-4)Re+=4;else break e;else P.id>=o&&(Re+=4);P.next()}j=Ke,z+=J,ee+=Re}return($<0||z==A)&&(F.size=z,F.start=j,F.skip=ee),F.size>4?F:void 0}function x(A,$,P){let{id:z,start:j,end:ee,size:q}=a;if(a.next(),q>=0&&z<o){let F=P;if(q>4){let G=a.pos-(q-4);for(;a.pos>G;)P=x(A,$,P)}$[--P]=F,$[--P]=ee-A,$[--P]=j-A,$[--P]=z}else q==-3?c=z:q==-4&&(h=z);return P}let k=[],O=[];for(;a.pos>0;)d(t.start||0,t.bufferStart||0,k,O,-1,0);let R=(e=t.length)!==null&&e!==void 0?e:k.length?O[0]+k[0].length:0;return new ge(l[t.topID],k.reverse(),O.reverse(),R)}const bh=new WeakMap;function dn(t,e){if(!t.isAnonymous||e instanceof ui||e.type!=t)return 1;let i=bh.get(e);if(i==null){i=1;for(let s of e.children){if(s.type!=t||!(s instanceof ge)){i=1;break}i+=dn(t,s)}bh.set(e,i)}return i}function _l(t,e,i,s,r,n,o,a,l){let c=0;for(let p=s;p<r;p++)c+=dn(t,e[p]);let h=Math.ceil(c*1.5/8),d=[],f=[];function u(p,m,b,x,k){for(let O=b;O<x;){let R=O,A=m[O],$=dn(t,p[O]);for(O++;O<x;O++){let P=dn(t,p[O]);if($+P>=h)break;$+=P}if(O==R+1){if($>h){let P=p[R];u(P.children,P.positions,0,P.children.length,m[R]+k);continue}d.push(p[R])}else{let P=m[O-1]+p[O-1].length-A;d.push(_l(t,p,m,R,O,A,P,null,l))}f.push(A+k-n)}}return u(e,i,s,r,0),(a||l)(d,f,o)}class Fi{constructor(e,i,s,r,n=!1,o=!1){this.from=e,this.to=i,this.tree=s,this.offset=r,this.open=(n?1:0)|(o?2:0)}get openStart(){return(this.open&1)>0}get openEnd(){return(this.open&2)>0}static addTree(e,i=[],s=!1){let r=[new Fi(0,e.length,e,0,!1,s)];for(let n of i)n.to>e.length&&r.push(n);return r}static applyChanges(e,i,s=128){if(!i.length)return e;let r=[],n=1,o=e.length?e[0]:null;for(let a=0,l=0,c=0;;a++){let h=a<i.length?i[a]:null,d=h?h.fromA:1e9;if(d-l>=s)for(;o&&o.from<d;){let f=o;if(l>=f.from||d<=f.to||c){let u=Math.max(f.from,l)-c,p=Math.min(f.to,d)-c;f=u>=p?null:new Fi(u,p,f.tree,f.offset+c,a>0,!!h)}if(f&&r.push(f),o.to>d)break;o=n<e.length?e[n++]:null}if(!h)break;l=h.toA,c=h.toA-h.toB}return r}}class nu{startParse(e,i,s){return typeof e=="string"&&(e=new fv(e)),s=s?s.length?s.map(r=>new Fo(r.from,r.to)):[new Fo(0,0)]:[new Fo(0,e.length)],this.createParse(e,i||[],s)}parse(e,i,s){let r=this.startParse(e,i,s);for(;;){let n=r.advance();if(n)return n}}}class fv{constructor(e){this.string=e}get length(){return this.string.length}chunk(e){return this.string.slice(e)}get lineChunks(){return!1}read(e,i){return this.string.slice(e,i)}}new W({perNode:!0});let uv=0,Wt=class Ha{constructor(e,i,s,r){this.name=e,this.set=i,this.base=s,this.modified=r,this.id=uv++}toString(){let{name:e}=this;for(let i of this.modified)i.name&&(e=`${i.name}(${e})`);return e}static define(e,i){let s=typeof e=="string"?e:"?";if(e instanceof Ha&&(i=e),i!=null&&i.base)throw new Error("Can not derive from a modified tag");let r=new Ha(s,[],null,[]);if(r.set.push(r),i)for(let n of i.set)r.set.push(n);return r}static defineModifier(e){let i=new Mn(e);return s=>s.modified.indexOf(i)>-1?s:Mn.get(s.base||s,s.modified.concat(i).sort((r,n)=>r.id-n.id))}},pv=0;class Mn{constructor(e){this.name=e,this.instances=[],this.id=pv++}static get(e,i){if(!i.length)return e;let s=i[0].instances.find(a=>a.base==e&&gv(i,a.modified));if(s)return s;let r=[],n=new Wt(e.name,r,e,i);for(let a of i)a.instances.push(n);let o=mv(i);for(let a of e.set)if(!a.modified.length)for(let l of o)r.push(Mn.get(a,l));return n}}function gv(t,e){return t.length==e.length&&t.every((i,s)=>i==e[s])}function mv(t){let e=[[]];for(let i=0;i<t.length;i++)for(let s=0,r=e.length;s<r;s++)e.push(e[s].concat(t[i]));return e.sort((i,s)=>s.length-i.length)}function ou(t){let e=Object.create(null);for(let i in t){let s=t[i];Array.isArray(s)||(s=[s]);for(let r of i.split(" "))if(r){let n=[],o=2,a=r;for(let d=0;;){if(a=="..."&&d>0&&d+3==r.length){o=1;break}let f=/^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(a);if(!f)throw new RangeError("Invalid path: "+r);if(n.push(f[0]=="*"?"":f[0][0]=='"'?JSON.parse(f[0]):f[0]),d+=f[0].length,d==r.length)break;let u=r[d++];if(d==r.length&&u=="!"){o=0;break}if(u!="/")throw new RangeError("Invalid path: "+r);a=r.slice(d)}let l=n.length-1,c=n[l];if(!c)throw new RangeError("Invalid path: "+r);let h=new dr(s,o,l>0?n.slice(0,l):null);e[c]=h.sort(e[c])}}return au.add(e)}const au=new W({combine(t,e){let i,s,r;for(;t||e;){if(!t||e&&t.depth>=e.depth?(r=e,e=e.next):(r=t,t=t.next),i&&i.mode==r.mode&&!r.context&&!i.context)continue;let n=new dr(r.tags,r.mode,r.context);i?i.next=n:s=n,i=n}return s}});class dr{constructor(e,i,s,r){this.tags=e,this.mode=i,this.context=s,this.next=r}get opaque(){return this.mode==0}get inherit(){return this.mode==1}sort(e){return!e||e.depth<this.depth?(this.next=e,this):(e.next=this.sort(e.next),e)}get depth(){return this.context?this.context.length:0}}dr.empty=new dr([],2,null);function lu(t,e){let i=Object.create(null);for(let n of t)if(!Array.isArray(n.tag))i[n.tag.id]=n.class;else for(let o of n.tag)i[o.id]=n.class;let{scope:s,all:r=null}=e||{};return{style:n=>{let o=r;for(let a of n)for(let l of a.set){let c=i[l.id];if(c){o=o?o+" "+c:c;break}}return o},scope:s}}function bv(t,e){let i=null;for(let s of t){let r=s.style(e);r&&(i=i?i+" "+r:r)}return i}function vv(t,e,i,s=0,r=t.length){let n=new yv(s,Array.isArray(e)?e:[e],i);n.highlightRange(t.cursor(),s,r,"",n.highlighters),n.flush(r)}class yv{constructor(e,i,s){this.at=e,this.highlighters=i,this.span=s,this.class=""}startSpan(e,i){i!=this.class&&(this.flush(e),e>this.at&&(this.at=e),this.class=i)}flush(e){e>this.at&&this.class&&this.span(this.at,e,this.class)}highlightRange(e,i,s,r,n){let{type:o,from:a,to:l}=e;if(a>=s||l<=i)return;o.isTop&&(n=this.highlighters.filter(u=>!u.scope||u.scope(o)));let c=r,h=xv(e)||dr.empty,d=bv(n,h.tags);if(d&&(c&&(c+=" "),c+=d,h.mode==1&&(r+=(r?" ":"")+d)),this.startSpan(Math.max(i,a),c),h.opaque)return;let f=e.tree&&e.tree.prop(W.mounted);if(f&&f.overlay){let u=e.node.enter(f.overlay[0].from+a,1),p=this.highlighters.filter(b=>!b.scope||b.scope(f.tree.type)),m=e.firstChild();for(let b=0,x=a;;b++){let k=b<f.overlay.length?f.overlay[b]:null,O=k?k.from+a:l,R=Math.max(i,x),A=Math.min(s,O);if(R<A&&m)for(;e.from<A&&(this.highlightRange(e,R,A,r,n),this.startSpan(Math.min(A,e.to),c),!(e.to>=O||!e.nextSibling())););if(!k||O>s)break;x=k.to+a,x>i&&(this.highlightRange(u.cursor(),Math.max(i,k.from+a),Math.min(s,x),"",p),this.startSpan(Math.min(s,x),c))}m&&e.parent()}else if(e.firstChild()){f&&(r="");do if(!(e.to<=i)){if(e.from>=s)break;this.highlightRange(e,i,s,r,n),this.startSpan(Math.min(s,e.to),c)}while(e.nextSibling());e.parent()}}}function xv(t){let e=t.type.prop(au);for(;e&&e.context&&!t.matchContext(e.context);)e=e.next;return e||null}const M=Wt.define,jr=M(),Zt=M(),vh=M(Zt),yh=M(Zt),ei=M(),Kr=M(ei),No=M(ei),Ot=M(),Ci=M(Ot),St=M(),Ct=M(),Wa=M(),Rs=M(Wa),Xr=M(),w={comment:jr,lineComment:M(jr),blockComment:M(jr),docComment:M(jr),name:Zt,variableName:M(Zt),typeName:vh,tagName:M(vh),propertyName:yh,attributeName:M(yh),className:M(Zt),labelName:M(Zt),namespace:M(Zt),macroName:M(Zt),literal:ei,string:Kr,docString:M(Kr),character:M(Kr),attributeValue:M(Kr),number:No,integer:M(No),float:M(No),bool:M(ei),regexp:M(ei),escape:M(ei),color:M(ei),url:M(ei),keyword:St,self:M(St),null:M(St),atom:M(St),unit:M(St),modifier:M(St),operatorKeyword:M(St),controlKeyword:M(St),definitionKeyword:M(St),moduleKeyword:M(St),operator:Ct,derefOperator:M(Ct),arithmeticOperator:M(Ct),logicOperator:M(Ct),bitwiseOperator:M(Ct),compareOperator:M(Ct),updateOperator:M(Ct),definitionOperator:M(Ct),typeOperator:M(Ct),controlOperator:M(Ct),punctuation:Wa,separator:M(Wa),bracket:Rs,angleBracket:M(Rs),squareBracket:M(Rs),paren:M(Rs),brace:M(Rs),content:Ot,heading:Ci,heading1:M(Ci),heading2:M(Ci),heading3:M(Ci),heading4:M(Ci),heading5:M(Ci),heading6:M(Ci),contentSeparator:M(Ot),list:M(Ot),quote:M(Ot),emphasis:M(Ot),strong:M(Ot),link:M(Ot),monospace:M(Ot),strikethrough:M(Ot),inserted:M(),deleted:M(),changed:M(),invalid:M(),meta:Xr,documentMeta:M(Xr),annotation:M(Xr),processingInstruction:M(Xr),definition:Wt.defineModifier("definition"),constant:Wt.defineModifier("constant"),function:Wt.defineModifier("function"),standard:Wt.defineModifier("standard"),local:Wt.defineModifier("local"),special:Wt.defineModifier("special")};for(let t in w){let e=w[t];e instanceof Wt&&(e.name=t)}lu([{tag:w.link,class:"tok-link"},{tag:w.heading,class:"tok-heading"},{tag:w.emphasis,class:"tok-emphasis"},{tag:w.strong,class:"tok-strong"},{tag:w.keyword,class:"tok-keyword"},{tag:w.atom,class:"tok-atom"},{tag:w.bool,class:"tok-bool"},{tag:w.url,class:"tok-url"},{tag:w.labelName,class:"tok-labelName"},{tag:w.inserted,class:"tok-inserted"},{tag:w.deleted,class:"tok-deleted"},{tag:w.literal,class:"tok-literal"},{tag:w.string,class:"tok-string"},{tag:w.number,class:"tok-number"},{tag:[w.regexp,w.escape,w.special(w.string)],class:"tok-string2"},{tag:w.variableName,class:"tok-variableName"},{tag:w.local(w.variableName),class:"tok-variableName tok-local"},{tag:w.definition(w.variableName),class:"tok-variableName tok-definition"},{tag:w.special(w.variableName),class:"tok-variableName2"},{tag:w.definition(w.propertyName),class:"tok-propertyName tok-definition"},{tag:w.typeName,class:"tok-typeName"},{tag:w.namespace,class:"tok-namespace"},{tag:w.className,class:"tok-className"},{tag:w.macroName,class:"tok-macroName"},{tag:w.propertyName,class:"tok-propertyName"},{tag:w.operator,class:"tok-operator"},{tag:w.comment,class:"tok-comment"},{tag:w.meta,class:"tok-meta"},{tag:w.invalid,class:"tok-invalid"},{tag:w.punctuation,class:"tok-punctuation"}]);var zo;const ss=new W;function wv(t){return _.define({combine:t?e=>e.concat(t):void 0})}const kv=new W;class ut{constructor(e,i,s=[],r=""){this.data=e,this.name=r,K.prototype.hasOwnProperty("tree")||Object.defineProperty(K.prototype,"tree",{get(){return De(this)}}),this.parser=i,this.extension=[pi.of(this),K.languageData.of((n,o,a)=>{let l=xh(n,o,a),c=l.type.prop(ss);if(!c)return[];let h=n.facet(c),d=l.type.prop(kv);if(d){let f=l.resolve(o-l.from,a);for(let u of d)if(u.test(f,n)){let p=n.facet(u.facet);return u.type=="replace"?p:p.concat(h)}}return h})].concat(s)}isActiveAt(e,i,s=-1){return xh(e,i,s).type.prop(ss)==this.data}findRegions(e){let i=e.facet(pi);if((i==null?void 0:i.data)==this.data)return[{from:0,to:e.doc.length}];if(!i||!i.allowsNesting)return[];let s=[],r=(n,o)=>{if(n.prop(ss)==this.data){s.push({from:o,to:o+n.length});return}let a=n.prop(W.mounted);if(a){if(a.tree.prop(ss)==this.data){if(a.overlay)for(let l of a.overlay)s.push({from:l.from+o,to:l.to+o});else s.push({from:o,to:o+n.length});return}else if(a.overlay){let l=s.length;if(r(a.tree,a.overlay[0].from+o),s.length>l)return}}for(let l=0;l<n.children.length;l++){let c=n.children[l];c instanceof ge&&r(c,n.positions[l]+o)}};return r(De(e),0),s}get allowsNesting(){return!0}}ut.setState=H.define();function xh(t,e,i){let s=t.facet(pi),r=De(t).topNode;if(!s||s.allowsNesting)for(let n=r;n;n=n.enter(e,i,fe.ExcludeBuffers|fe.EnterBracketed))n.type.isTop&&(r=n);return r}class En extends ut{constructor(e,i,s){super(e,i,[],s),this.parser=i}static define(e){let i=wv(e.languageData);return new En(i,e.parser.configure({props:[ss.add(s=>s.isTop?i:void 0)]}),e.name)}configure(e,i){return new En(this.data,this.parser.configure(e),i||this.name)}get allowsNesting(){return this.parser.hasWrappers()}}function De(t){let e=t.field(ut.state,!1);return e?e.tree:ge.empty}class Sv{constructor(e){this.doc=e,this.cursorPos=0,this.string="",this.cursor=e.iter()}get length(){return this.doc.length}syncTo(e){return this.string=this.cursor.next(e-this.cursorPos).value,this.cursorPos=e+this.string.length,this.cursorPos-this.string.length}chunk(e){return this.syncTo(e),this.string}get lineChunks(){return!0}read(e,i){let s=this.cursorPos-this.string.length;return e<s||i>=this.cursorPos?this.doc.sliceString(e,i):this.string.slice(e-s,i-s)}}let Ls=null;class Dn{constructor(e,i,s=[],r,n,o,a,l){this.parser=e,this.state=i,this.fragments=s,this.tree=r,this.treeLen=n,this.viewport=o,this.skipped=a,this.scheduleOn=l,this.parse=null,this.tempSkipped=[]}static create(e,i,s){return new Dn(e,i,[],ge.empty,0,s,[],null)}startParse(){return this.parser.startParse(new Sv(this.state.doc),this.fragments)}work(e,i){return i!=null&&i>=this.state.doc.length&&(i=void 0),this.tree!=ge.empty&&this.isDone(i??this.state.doc.length)?(this.takeTree(),!0):this.withContext(()=>{var s;if(typeof e=="number"){let r=Date.now()+e;e=()=>Date.now()>r}for(this.parse||(this.parse=this.startParse()),i!=null&&(this.parse.stoppedAt==null||this.parse.stoppedAt>i)&&i<this.state.doc.length&&this.parse.stopAt(i);;){let r=this.parse.advance();if(r)if(this.fragments=this.withoutTempSkipped(Fi.addTree(r,this.fragments,this.parse.stoppedAt!=null)),this.treeLen=(s=this.parse.stoppedAt)!==null&&s!==void 0?s:this.state.doc.length,this.tree=r,this.parse=null,this.treeLen<(i??this.state.doc.length))this.parse=this.startParse();else return!0;if(e())return!1}})}takeTree(){let e,i;this.parse&&(e=this.parse.parsedPos)>=this.treeLen&&((this.parse.stoppedAt==null||this.parse.stoppedAt>e)&&this.parse.stopAt(e),this.withContext(()=>{for(;!(i=this.parse.advance()););}),this.treeLen=e,this.tree=i,this.fragments=this.withoutTempSkipped(Fi.addTree(this.tree,this.fragments,!0)),this.parse=null)}withContext(e){let i=Ls;Ls=this;try{return e()}finally{Ls=i}}withoutTempSkipped(e){for(let i;i=this.tempSkipped.pop();)e=wh(e,i.from,i.to);return e}changes(e,i){let{fragments:s,tree:r,treeLen:n,viewport:o,skipped:a}=this;if(this.takeTree(),!e.empty){let l=[];if(e.iterChangedRanges((c,h,d,f)=>l.push({fromA:c,toA:h,fromB:d,toB:f})),s=Fi.applyChanges(s,l),r=ge.empty,n=0,o={from:e.mapPos(o.from,-1),to:e.mapPos(o.to,1)},this.skipped.length){a=[];for(let c of this.skipped){let h=e.mapPos(c.from,1),d=e.mapPos(c.to,-1);h<d&&a.push({from:h,to:d})}}}return new Dn(this.parser,i,s,r,n,o,a,this.scheduleOn)}updateViewport(e){if(this.viewport.from==e.from&&this.viewport.to==e.to)return!1;this.viewport=e;let i=this.skipped.length;for(let s=0;s<this.skipped.length;s++){let{from:r,to:n}=this.skipped[s];r<e.to&&n>e.from&&(this.fragments=wh(this.fragments,r,n),this.skipped.splice(s--,1))}return this.skipped.length>=i?!1:(this.reset(),!0)}reset(){this.parse&&(this.takeTree(),this.parse=null)}skipUntilInView(e,i){this.skipped.push({from:e,to:i})}static getSkippingParser(e){return new class extends nu{createParse(i,s,r){let n=r[0].from,o=r[r.length-1].to;return{parsedPos:n,advance(){let l=Ls;if(l){for(let c of r)l.tempSkipped.push(c);e&&(l.scheduleOn=l.scheduleOn?Promise.all([l.scheduleOn,e]):e)}return this.parsedPos=o,new ge(je.none,[],[],o-n)},stoppedAt:null,stopAt(){}}}}}isDone(e){e=Math.min(e,this.state.doc.length);let i=this.fragments;return this.treeLen>=e&&i.length&&i[0].from==0&&i[0].to>=e}static get(){return Ls}}function wh(t,e,i){return Fi.applyChanges(t,[{fromA:e,toA:i,fromB:e,toB:i}])}class ks{constructor(e){this.context=e,this.tree=e.tree}apply(e){if(!e.docChanged&&this.tree==this.context.tree)return this;let i=this.context.changes(e.changes,e.state),s=this.context.treeLen==e.startState.doc.length?void 0:Math.max(e.changes.mapPos(this.context.treeLen),i.viewport.to);return i.work(20,s)||i.takeTree(),new ks(i)}static init(e){let i=Math.min(3e3,e.doc.length),s=Dn.create(e.facet(pi).parser,e,{from:0,to:i});return s.work(20,i)||s.takeTree(),new ks(s)}}ut.state=_e.define({create:ks.init,update(t,e){for(let i of e.effects)if(i.is(ut.setState))return i.value;return e.startState.facet(pi)!=e.state.facet(pi)?ks.init(e.state):t.apply(e)}});let cu=t=>{let e=setTimeout(()=>t(),500);return()=>clearTimeout(e)};typeof requestIdleCallback<"u"&&(cu=t=>{let e=-1,i=setTimeout(()=>{e=requestIdleCallback(t,{timeout:400})},100);return()=>e<0?clearTimeout(i):cancelIdleCallback(e)});const Ho=typeof navigator<"u"&&(!((zo=navigator.scheduling)===null||zo===void 0)&&zo.isInputPending)?()=>navigator.scheduling.isInputPending():null,Cv=me.fromClass(class{constructor(e){this.view=e,this.working=null,this.workScheduled=0,this.chunkEnd=-1,this.chunkBudget=-1,this.work=this.work.bind(this),this.scheduleWork()}update(e){let i=this.view.state.field(ut.state).context;(i.updateViewport(e.view.viewport)||this.view.viewport.to>i.treeLen)&&this.scheduleWork(),(e.docChanged||e.selectionSet)&&(this.view.hasFocus&&(this.chunkBudget+=50),this.scheduleWork()),this.checkAsyncSchedule(i)}scheduleWork(){if(this.working)return;let{state:e}=this.view,i=e.field(ut.state);(i.tree!=i.context.tree||!i.context.isDone(e.doc.length))&&(this.working=cu(this.work))}work(e){this.working=null;let i=Date.now();if(this.chunkEnd<i&&(this.chunkEnd<0||this.view.hasFocus)&&(this.chunkEnd=i+3e4,this.chunkBudget=3e3),this.chunkBudget<=0)return;let{state:s,viewport:{to:r}}=this.view,n=s.field(ut.state);if(n.tree==n.context.tree&&n.context.isDone(r+1e5))return;let o=Date.now()+Math.min(this.chunkBudget,100,e&&!Ho?Math.max(25,e.timeRemaining()-5):1e9),a=n.context.treeLen<r&&s.doc.length>r+1e3,l=n.context.work(()=>Ho&&Ho()||Date.now()>o,r+(a?0:1e5));this.chunkBudget-=Date.now()-i,(l||this.chunkBudget<=0)&&(n.context.takeTree(),this.view.dispatch({effects:ut.setState.of(new ks(n.context))})),this.chunkBudget>0&&!(l&&!a)&&this.scheduleWork(),this.checkAsyncSchedule(n.context)}checkAsyncSchedule(e){e.scheduleOn&&(this.workScheduled++,e.scheduleOn.then(()=>this.scheduleWork()).catch(i=>Ue(this.view.state,i)).then(()=>this.workScheduled--),e.scheduleOn=null)}destroy(){this.working&&this.working()}isWorking(){return!!(this.working||this.workScheduled>0)}},{eventHandlers:{focus(){this.scheduleWork()}}}),pi=_.define({combine(t){return t.length?t[0]:null},enables:t=>[ut.state,Cv,B.contentAttributes.compute([t],e=>{let i=e.facet(t);return i&&i.name?{"data-language":i.name}:{}})]});class Ov{constructor(e,i=[]){this.language=e,this.support=i,this.extension=[e,i]}}const Av=_.define(),Bl=_.define({combine:t=>{if(!t.length)return"  ";let e=t[0];if(!e||/\S/.test(e)||Array.from(e).some(i=>i!=e[0]))throw new Error("Invalid indent unit: "+JSON.stringify(t[0]));return e}});function _n(t){let e=t.facet(Bl);return e.charCodeAt(0)==9?t.tabSize*e.length:e.length}function fr(t,e){let i="",s=t.tabSize,r=t.facet(Bl)[0];if(r=="	"){for(;e>=s;)i+="	",e-=s;r=" "}for(let n=0;n<e;n++)i+=r;return i}function Rl(t,e){t instanceof K&&(t=new no(t));for(let s of t.state.facet(Av)){let r=s(t,e);if(r!==void 0)return r}let i=De(t.state);return i.length>=e?$v(t,i,e):null}class no{constructor(e,i={}){this.state=e,this.options=i,this.unit=_n(e)}lineAt(e,i=1){let s=this.state.doc.lineAt(e),{simulateBreak:r,simulateDoubleBreak:n}=this.options;return r!=null&&r>=s.from&&r<=s.to?n&&r==e?{text:"",from:e}:(i<0?r<e:r<=e)?{text:s.text.slice(r-s.from),from:r}:{text:s.text.slice(0,r-s.from),from:s.from}:s}textAfterPos(e,i=1){if(this.options.simulateDoubleBreak&&e==this.options.simulateBreak)return"";let{text:s,from:r}=this.lineAt(e,i);return s.slice(e-r,Math.min(s.length,e+100-r))}column(e,i=1){let{text:s,from:r}=this.lineAt(e,i),n=this.countColumn(s,e-r),o=this.options.overrideIndentation?this.options.overrideIndentation(r):-1;return o>-1&&(n+=o-this.countColumn(s,s.search(/\S|$/))),n}countColumn(e,i=e.length){return $s(e,this.state.tabSize,i)}lineIndent(e,i=1){let{text:s,from:r}=this.lineAt(e,i),n=this.options.overrideIndentation;if(n){let o=n(r);if(o>-1)return o}return this.countColumn(s,s.search(/\S|$/))}get simulatedBreak(){return this.options.simulateBreak||null}}const hu=new W;function $v(t,e,i){let s=e.resolveStack(i),r=e.resolveInner(i,-1).resolve(i,0).enterUnfinishedNodesBefore(i);if(r!=s.node){let n=[];for(let o=r;o&&!(o.from<s.node.from||o.to>s.node.to||o.from==s.node.from&&o.type==s.node.type);o=o.parent)n.push(o);for(let o=n.length-1;o>=0;o--)s={node:n[o],next:s}}return du(s,t,i)}function du(t,e,i){for(let s=t;s;s=s.next){let r=Tv(s.node);if(r)return r(Ll.create(e,i,s))}return 0}function Pv(t){return t.pos==t.options.simulateBreak&&t.options.simulateDoubleBreak}function Tv(t){let e=t.type.prop(hu);if(e)return e;let i=t.firstChild,s;if(i&&(s=i.type.prop(W.closedBy))){let r=t.lastChild,n=r&&s.indexOf(r.name)>-1;return o=>fu(o,!0,1,void 0,n&&!Pv(o)?r.from:void 0)}return t.parent==null?Mv:null}function Mv(){return 0}class Ll extends no{constructor(e,i,s){super(e.state,e.options),this.base=e,this.pos=i,this.context=s}get node(){return this.context.node}static create(e,i,s){return new Ll(e,i,s)}get textAfter(){return this.textAfterPos(this.pos)}get baseIndent(){return this.baseIndentFor(this.node)}baseIndentFor(e){let i=this.state.doc.lineAt(e.from);for(;;){let s=e.resolve(i.from);for(;s.parent&&s.parent.from==s.from;)s=s.parent;if(Ev(s,e))break;i=this.state.doc.lineAt(s.from)}return this.lineIndent(i.from)}continue(){return du(this.context.next,this.base,this.pos)}}function Ev(t,e){for(let i=e;i;i=i.parent)if(t==i)return!0;return!1}function Dv(t){let e=t.node,i=e.childAfter(e.from),s=e.lastChild;if(!i)return null;let r=t.options.simulateBreak,n=t.state.doc.lineAt(i.from),o=r==null||r<=n.from?n.to:Math.min(n.to,r);for(let a=i.to;;){let l=e.childAfter(a);if(!l||l==s)return null;if(!l.type.isSkipped){if(l.from>=o)return null;let c=/^ */.exec(n.text.slice(i.to-n.from))[0].length;return{from:i.from,to:i.to+c}}a=l.to}}function kh({closing:t,align:e=!0,units:i=1}){return s=>fu(s,e,i,t)}function fu(t,e,i,s,r){let n=t.textAfter,o=n.match(/^\s*/)[0].length,a=s&&n.slice(o,o+s.length)==s||r==t.pos+o,l=e?Dv(t):null;return l?a?t.column(l.from):t.column(l.to):t.baseIndent+(a?0:t.unit*i)}const _v=200;function Bv(){return K.transactionFilter.of(t=>{if(!t.docChanged||!t.isUserEvent("input.type")&&!t.isUserEvent("input.complete"))return t;let e=t.startState.languageDataAt("indentOnInput",t.startState.selection.main.head);if(!e.length)return t;let i=t.newDoc,{head:s}=t.newSelection.main,r=i.lineAt(s);if(s>r.from+_v)return t;let n=i.sliceString(r.from,s);if(!e.some(c=>c.test(n)))return t;let{state:o}=t,a=-1,l=[];for(let{head:c}of o.selection.ranges){let h=o.doc.lineAt(c);if(h.from==a)continue;a=h.from;let d=Rl(o,h.from);if(d==null)continue;let f=/^\s*/.exec(h.text)[0],u=fr(o,d);f!=u&&l.push({from:h.from,to:h.from+f.length,insert:u})}return l.length?[t,{changes:l,sequential:!0}]:t})}const Rv=_.define(),uu=new W;function Lv(t){let e=t.firstChild,i=t.lastChild;return e&&e.to<i.from?{from:e.to,to:i.type.isError?t.to:i.from}:null}function Iv(t,e,i){let s=De(t);if(s.length<i)return null;let r=s.resolveStack(i,1),n=null;for(let o=r;o;o=o.next){let a=o.node;if(a.to<=i||a.from>i)continue;if(n&&a.from<e)break;let l=a.type.prop(uu);if(l&&(a.to<s.length-50||s.length==t.doc.length||!Fv(a))){let c=l(a,t);c&&c.from<=i&&c.from>=e&&c.to>i&&(n=c)}}return n}function Fv(t){let e=t.lastChild;return e&&e.to==t.to&&e.type.isError}function Bn(t,e,i){for(let s of t.facet(Rv)){let r=s(t,e,i);if(r)return r}return Iv(t,e,i)}function pu(t,e){let i=e.mapPos(t.from,1),s=e.mapPos(t.to,-1);return i>=s?void 0:{from:i,to:s}}const oo=H.define({map:pu}),Ar=H.define({map:pu});function gu(t){let e=[];for(let{head:i}of t.state.selection.ranges)e.some(s=>s.from<=i&&s.to>=i)||e.push(t.lineBlockAt(i));return e}const Qi=_e.define({create(){return N.none},update(t,e){e.isUserEvent("delete")&&e.changes.iterChangedRanges((i,s)=>t=Sh(t,i,s)),t=t.map(e.changes);for(let i of e.effects)if(i.is(oo)&&!Nv(t,i.value.from,i.value.to)){let{preparePlaceholder:s}=e.state.facet(vu),r=s?N.replace({widget:new Qv(s(e.state,i.value))}):Ch;t=t.update({add:[r.range(i.value.from,i.value.to)]})}else i.is(Ar)&&(t=t.update({filter:(s,r)=>i.value.from!=s||i.value.to!=r,filterFrom:i.value.from,filterTo:i.value.to}));return e.selection&&(t=Sh(t,e.selection.main.head)),t},provide:t=>B.decorations.from(t),toJSON(t,e){let i=[];return t.between(0,e.doc.length,(s,r)=>{i.push(s,r)}),i},fromJSON(t){if(!Array.isArray(t)||t.length%2)throw new RangeError("Invalid JSON for fold state");let e=[];for(let i=0;i<t.length;){let s=t[i++],r=t[i++];if(typeof s!="number"||typeof r!="number")throw new RangeError("Invalid JSON for fold state");e.push(Ch.range(s,r))}return N.set(e,!0)}});function Sh(t,e,i=e){let s=!1;return t.between(e,i,(r,n)=>{r<i&&n>e&&(s=!0)}),s?t.update({filterFrom:e,filterTo:i,filter:(r,n)=>r>=i||n<=e}):t}function Rn(t,e,i){var s;let r=null;return(s=t.field(Qi,!1))===null||s===void 0||s.between(e,i,(n,o)=>{(!r||r.from>n)&&(r={from:n,to:o})}),r}function Nv(t,e,i){let s=!1;return t.between(e,e,(r,n)=>{r==e&&n==i&&(s=!0)}),s}function mu(t,e){return t.field(Qi,!1)?e:e.concat(H.appendConfig.of(yu()))}const zv=t=>{for(let e of gu(t)){let i=Bn(t.state,e.from,e.to);if(i)return t.dispatch({effects:mu(t.state,[oo.of(i),bu(t,i)])}),!0}return!1},Hv=t=>{if(!t.state.field(Qi,!1))return!1;let e=[];for(let i of gu(t)){let s=Rn(t.state,i.from,i.to);s&&e.push(Ar.of(s),bu(t,s,!1))}return e.length&&t.dispatch({effects:e}),e.length>0};function bu(t,e,i=!0){let s=t.state.doc.lineAt(e.from).number,r=t.state.doc.lineAt(e.to).number;return B.announce.of(`${t.state.phrase(i?"Folded lines":"Unfolded lines")} ${s} ${t.state.phrase("to")} ${r}.`)}const Wv=t=>{let{state:e}=t,i=[];for(let s=0;s<e.doc.length;){let r=t.lineBlockAt(s),n=Bn(e,r.from,r.to);n&&i.push(oo.of(n)),s=(n?t.lineBlockAt(n.to):r).to+1}return i.length&&t.dispatch({effects:mu(t.state,i)}),!!i.length},Uv=t=>{let e=t.state.field(Qi,!1);if(!e||!e.size)return!1;let i=[];return e.between(0,t.state.doc.length,(s,r)=>{i.push(Ar.of({from:s,to:r}))}),t.dispatch({effects:i}),!0},qv=[{key:"Ctrl-Shift-[",mac:"Cmd-Alt-[",run:zv},{key:"Ctrl-Shift-]",mac:"Cmd-Alt-]",run:Hv},{key:"Ctrl-Alt-[",run:Wv},{key:"Ctrl-Alt-]",run:Uv}],Vv={placeholderDOM:null,preparePlaceholder:null,placeholderText:"…"},vu=_.define({combine(t){return Ft(t,Vv)}});function yu(t){return[Qi,Xv]}function xu(t,e){let{state:i}=t,s=i.facet(vu),r=o=>{let a=t.lineBlockAt(t.posAtDOM(o.target)),l=Rn(t.state,a.from,a.to);l&&t.dispatch({effects:Ar.of(l)}),o.preventDefault()};if(s.placeholderDOM)return s.placeholderDOM(t,r,e);let n=document.createElement("span");return n.textContent=s.placeholderText,n.setAttribute("aria-label",i.phrase("folded code")),n.title=i.phrase("unfold"),n.className="cm-foldPlaceholder",n.onclick=r,n}const Ch=N.replace({widget:new class extends Gt{toDOM(t){return xu(t,null)}}});class Qv extends Gt{constructor(e){super(),this.value=e}eq(e){return this.value==e.value}toDOM(e){return xu(e,this.value)}}const jv={openText:"⌄",closedText:"›",markerDOM:null,domEventHandlers:{},foldingChanged:()=>!1};class Wo extends Xt{constructor(e,i){super(),this.config=e,this.open=i}eq(e){return this.config==e.config&&this.open==e.open}toDOM(e){if(this.config.markerDOM)return this.config.markerDOM(this.open);let i=document.createElement("span");return i.textContent=this.open?this.config.openText:this.config.closedText,i.title=e.state.phrase(this.open?"Fold line":"Unfold line"),i}}function Kv(t={}){let e={...jv,...t},i=new Wo(e,!0),s=new Wo(e,!1),r=me.fromClass(class{constructor(o){this.from=o.viewport.from,this.markers=this.buildMarkers(o)}update(o){(o.docChanged||o.viewportChanged||o.startState.facet(pi)!=o.state.facet(pi)||o.startState.field(Qi,!1)!=o.state.field(Qi,!1)||De(o.startState)!=De(o.state)||e.foldingChanged(o))&&(this.markers=this.buildMarkers(o.view))}buildMarkers(o){let a=new jt;for(let l of o.viewportLineBlocks){let c=Rn(o.state,l.from,l.to)?s:Bn(o.state,l.from,l.to)?i:null;c&&a.add(l.from,l.from,c)}return a.finish()}}),{domEventHandlers:n}=e;return[r,X0({class:"cm-foldGutter",markers(o){var a;return((a=o.plugin(r))===null||a===void 0?void 0:a.markers)||V.empty},initialSpacer(){return new Wo(e,!1)},domEventHandlers:{...n,click:(o,a,l)=>{if(n.click&&n.click(o,a,l))return!0;let c=Rn(o.state,a.from,a.to);if(c)return o.dispatch({effects:Ar.of(c)}),!0;let h=Bn(o.state,a.from,a.to);return h?(o.dispatch({effects:oo.of(h)}),!0):!1}}}),yu()]}const Xv=B.baseTheme({".cm-foldPlaceholder":{backgroundColor:"#eee",border:"1px solid #ddd",color:"#888",borderRadius:".2em",margin:"0 1px",padding:"0 1px",cursor:"pointer"},".cm-foldGutter span":{padding:"0 1px",cursor:"pointer"}});class $r{constructor(e,i){this.specs=e;let s;function r(a){let l=hi.newName();return(s||(s=Object.create(null)))["."+l]=a,l}const n=typeof i.all=="string"?i.all:i.all?r(i.all):void 0,o=i.scope;this.scope=o instanceof ut?a=>a.prop(ss)==o.data:o?a=>a==o:void 0,this.style=lu(e.map(a=>({tag:a.tag,class:a.class||r(Object.assign({},a,{tag:null}))})),{all:n}).style,this.module=s?new hi(s):null,this.themeType=i.themeType}static define(e,i){return new $r(e,i||{})}}const Ua=_.define(),wu=_.define({combine(t){return t.length?[t[0]]:null}});function Uo(t){let e=t.facet(Ua);return e.length?e:t.facet(wu)}function ku(t,e){let i=[Yv],s;return t instanceof $r&&(t.module&&i.push(B.styleModule.of(t.module)),s=t.themeType),e!=null&&e.fallback?i.push(wu.of(t)):s?i.push(Ua.computeN([B.darkTheme],r=>r.facet(B.darkTheme)==(s=="dark")?[t]:[])):i.push(Ua.of(t)),i}class Jv{constructor(e){this.markCache=Object.create(null),this.tree=De(e.state),this.decorations=this.buildDeco(e,Uo(e.state)),this.decoratedTo=e.viewport.to}update(e){let i=De(e.state),s=Uo(e.state),r=s!=Uo(e.startState),{viewport:n}=e.view,o=e.changes.mapPos(this.decoratedTo,1);i.length<n.to&&!r&&i.type==this.tree.type&&o>=n.to?(this.decorations=this.decorations.map(e.changes),this.decoratedTo=o):(i!=this.tree||e.viewportChanged||r)&&(this.tree=i,this.decorations=this.buildDeco(e.view,s),this.decoratedTo=n.to)}buildDeco(e,i){if(!i||!this.tree.length)return N.none;let s=new jt;for(let{from:r,to:n}of e.visibleRanges)vv(this.tree,i,(o,a,l)=>{s.add(o,a,this.markCache[l]||(this.markCache[l]=N.mark({class:l})))},r,n);return s.finish()}}const Yv=ji.high(me.fromClass(Jv,{decorations:t=>t.decorations})),Gv=$r.define([{tag:w.meta,color:"#404740"},{tag:w.link,textDecoration:"underline"},{tag:w.heading,textDecoration:"underline",fontWeight:"bold"},{tag:w.emphasis,fontStyle:"italic"},{tag:w.strong,fontWeight:"bold"},{tag:w.strikethrough,textDecoration:"line-through"},{tag:w.keyword,color:"#708"},{tag:[w.atom,w.bool,w.url,w.contentSeparator,w.labelName],color:"#219"},{tag:[w.literal,w.inserted],color:"#164"},{tag:[w.string,w.deleted],color:"#a11"},{tag:[w.regexp,w.escape,w.special(w.string)],color:"#e40"},{tag:w.definition(w.variableName),color:"#00f"},{tag:w.local(w.variableName),color:"#30a"},{tag:[w.typeName,w.namespace],color:"#085"},{tag:w.className,color:"#167"},{tag:[w.special(w.variableName),w.macroName],color:"#256"},{tag:w.definition(w.propertyName),color:"#00c"},{tag:w.comment,color:"#940"},{tag:w.invalid,color:"#f00"}]),Zv=B.baseTheme({"&.cm-focused .cm-matchingBracket":{backgroundColor:"#328c8252"},"&.cm-focused .cm-nonmatchingBracket":{backgroundColor:"#bb555544"}}),Su=1e4,Cu="()[]{}",Ou=_.define({combine(t){return Ft(t,{afterCursor:!0,brackets:Cu,maxScanDistance:Su,renderMatch:iy})}}),ey=N.mark({class:"cm-matchingBracket"}),ty=N.mark({class:"cm-nonmatchingBracket"});function iy(t){let e=[],i=t.matched?ey:ty;return e.push(i.range(t.start.from,t.start.to)),t.end&&e.push(i.range(t.end.from,t.end.to)),e}function Oh(t){let e=[],i=t.facet(Ou);for(let s of t.selection.ranges){if(!s.empty)continue;let r=Mt(t,s.head,-1,i)||s.head>0&&Mt(t,s.head-1,1,i)||i.afterCursor&&(Mt(t,s.head,1,i)||s.head<t.doc.length&&Mt(t,s.head+1,-1,i));r&&(e=e.concat(i.renderMatch(r,t)))}return N.set(e,!0)}const sy=me.fromClass(class{constructor(t){this.paused=!1,this.decorations=Oh(t.state)}update(t){(t.docChanged||t.selectionSet||this.paused)&&(t.view.composing?(this.decorations=this.decorations.map(t.changes),this.paused=!0):(this.decorations=Oh(t.state),this.paused=!1))}},{decorations:t=>t.decorations}),ry=[sy,Zv];function ny(t={}){return[Ou.of(t),ry]}const oy=new W;function qa(t,e,i){let s=t.prop(e<0?W.openedBy:W.closedBy);if(s)return s;if(t.name.length==1){let r=i.indexOf(t.name);if(r>-1&&r%2==(e<0?1:0))return[i[r+e]]}return null}function Va(t){let e=t.type.prop(oy);return e?e(t.node):t}function Mt(t,e,i,s={}){let r=s.maxScanDistance||Su,n=s.brackets||Cu,o=De(t),a=o.resolveInner(e,i);for(let l=a;l;l=l.parent){let c=qa(l.type,i,n);if(c&&l.from<l.to){let h=Va(l);if(h&&(i>0?e>=h.from&&e<h.to:e>h.from&&e<=h.to))return ay(t,e,i,l,h,c,n)}}return ly(t,e,i,o,a.type,r,n)}function ay(t,e,i,s,r,n,o){let a=s.parent,l={from:r.from,to:r.to},c=0,h=a==null?void 0:a.cursor();if(h&&(i<0?h.childBefore(s.from):h.childAfter(s.to)))do if(i<0?h.to<=s.from:h.from>=s.to){if(c==0&&n.indexOf(h.type.name)>-1&&h.from<h.to){let d=Va(h);return{start:l,end:d?{from:d.from,to:d.to}:void 0,matched:!0}}else if(qa(h.type,i,o))c++;else if(qa(h.type,-i,o)){if(c==0){let d=Va(h);return{start:l,end:d&&d.from<d.to?{from:d.from,to:d.to}:void 0,matched:!1}}c--}}while(i<0?h.prevSibling():h.nextSibling());return{start:l,matched:!1}}function ly(t,e,i,s,r,n,o){if(i<0?!e:e==t.doc.length)return null;let a=i<0?t.sliceDoc(e-1,e):t.sliceDoc(e,e+1),l=o.indexOf(a);if(l<0||l%2==0!=i>0)return null;let c={from:i<0?e-1:e,to:i>0?e+1:e},h=t.doc.iterRange(e,i>0?t.doc.length:0),d=0;for(let f=0;!h.next().done&&f<=n;){let u=h.value;i<0&&(f+=u.length);let p=e+f*i;for(let m=i>0?0:u.length-1,b=i>0?u.length:-1;m!=b;m+=i){let x=o.indexOf(u[m]);if(!(x<0||s.resolveInner(p+m,1).type!=r))if(x%2==0==i>0)d++;else{if(d==1)return{start:c,end:{from:p+m,to:p+m+1},matched:x>>1==l>>1};d--}}i>0&&(f+=u.length)}return h.done?{start:c,matched:!1}:null}const cy=Object.create(null),Ah=[je.none],$h=[],Ph=Object.create(null),hy=Object.create(null);for(let[t,e]of[["variable","variableName"],["variable-2","variableName.special"],["string-2","string.special"],["def","variableName.definition"],["tag","tagName"],["attribute","attributeName"],["type","typeName"],["builtin","variableName.standard"],["qualifier","modifier"],["error","invalid"],["header","heading"],["property","propertyName"]])hy[t]=dy(cy,e);function qo(t,e){$h.indexOf(t)>-1||($h.push(t),console.warn(e))}function dy(t,e){let i=[];for(let a of e.split(" ")){let l=[];for(let c of a.split(".")){let h=t[c]||w[c];h?typeof h=="function"?l.length?l=l.map(h):qo(c,`Modifier ${c} used at start of tag`):l.length?qo(c,`Tag ${c} used as modifier`):l=Array.isArray(h)?h:[h]:qo(c,`Unknown highlighting tag ${c}`)}for(let c of l)i.push(c)}if(!i.length)return 0;let s=e.replace(/ /g,"_"),r=s+" "+i.map(a=>a.id),n=Ph[r];if(n)return n.id;let o=Ph[r]=je.define({id:Ah.length,name:s,props:[ou({[s]:i})]});return Ah.push(o),o.id}ie.RTL,ie.LTR;const fy=t=>{let{state:e}=t,i=e.doc.lineAt(e.selection.main.from),s=Fl(t.state,i.from);return s.line?uy(t):s.block?gy(t):!1};function Il(t,e){return({state:i,dispatch:s})=>{if(i.readOnly)return!1;let r=t(e,i);return r?(s(i.update(r)),!0):!1}}const uy=Il(vy,0),py=Il(Au,0),gy=Il((t,e)=>Au(t,e,by(e)),0);function Fl(t,e){let i=t.languageDataAt("commentTokens",e,1);return i.length?i[0]:{}}const Is=50;function my(t,{open:e,close:i},s,r){let n=t.sliceDoc(s-Is,s),o=t.sliceDoc(r,r+Is),a=/\s*$/.exec(n)[0].length,l=/^\s*/.exec(o)[0].length,c=n.length-a;if(n.slice(c-e.length,c)==e&&o.slice(l,l+i.length)==i)return{open:{pos:s-a,margin:a&&1},close:{pos:r+l,margin:l&&1}};let h,d;r-s<=2*Is?h=d=t.sliceDoc(s,r):(h=t.sliceDoc(s,s+Is),d=t.sliceDoc(r-Is,r));let f=/^\s*/.exec(h)[0].length,u=/\s*$/.exec(d)[0].length,p=d.length-u-i.length;return h.slice(f,f+e.length)==e&&d.slice(p,p+i.length)==i?{open:{pos:s+f+e.length,margin:/\s/.test(h.charAt(f+e.length))?1:0},close:{pos:r-u-i.length,margin:/\s/.test(d.charAt(p-1))?1:0}}:null}function by(t){let e=[];for(let i of t.selection.ranges){let s=t.doc.lineAt(i.from),r=i.to<=s.to?s:t.doc.lineAt(i.to);r.from>s.from&&r.from==i.to&&(r=i.to==s.to+1?s:t.doc.lineAt(i.to-1));let n=e.length-1;n>=0&&e[n].to>s.from?e[n].to=r.to:e.push({from:s.from+/^\s*/.exec(s.text)[0].length,to:r.to})}return e}function Au(t,e,i=e.selection.ranges){let s=i.map(n=>Fl(e,n.from).block);if(!s.every(n=>n))return null;let r=i.map((n,o)=>my(e,s[o],n.from,n.to));if(t!=2&&!r.every(n=>n))return{changes:e.changes(i.map((n,o)=>r[o]?[]:[{from:n.from,insert:s[o].open+" "},{from:n.to,insert:" "+s[o].close}]))};if(t!=1&&r.some(n=>n)){let n=[];for(let o=0,a;o<r.length;o++)if(a=r[o]){let l=s[o],{open:c,close:h}=a;n.push({from:c.pos-l.open.length,to:c.pos+c.margin},{from:h.pos-h.margin,to:h.pos+l.close.length})}return{changes:n}}return null}function vy(t,e,i=e.selection.ranges){let s=[],r=-1;e:for(let{from:n,to:o}of i){let a=s.length,l=1e9,c;for(let h=n;h<=o;){let d=e.doc.lineAt(h);if(c==null&&(c=Fl(e,d.from).line,!c))continue e;if(d.from>r&&(n==o||o>d.from)){r=d.from;let f=/^\s*/.exec(d.text)[0].length,u=f==d.length,p=d.text.slice(f,f+c.length)==c?f:-1;f<d.text.length&&f<l&&(l=f),s.push({line:d,comment:p,token:c,indent:f,empty:u,single:!1})}h=d.to+1}if(l<1e9)for(let h=a;h<s.length;h++)s[h].indent<s[h].line.text.length&&(s[h].indent=l);s.length==a+1&&(s[a].single=!0)}if(t!=2&&s.some(n=>n.comment<0&&(!n.empty||n.single))){let n=[];for(let{line:a,token:l,indent:c,empty:h,single:d}of s)(d||!h)&&n.push({from:a.from+c,insert:l+" "});let o=e.changes(n);return{changes:o,selection:e.selection.map(o,1)}}else if(t!=1&&s.some(n=>n.comment>=0)){let n=[];for(let{line:o,comment:a,token:l}of s)if(a>=0){let c=o.from+a,h=c+l.length;o.text[h-o.from]==" "&&h++,n.push({from:c,to:h})}return{changes:n}}return null}const Qa=Yt.define(),yy=Yt.define(),xy=_.define(),$u=_.define({combine(t){return Ft(t,{minDepth:100,newGroupDelay:500,joinToEvent:(e,i)=>i},{minDepth:Math.max,newGroupDelay:Math.min,joinToEvent:(e,i)=>(s,r)=>e(s,r)||i(s,r)})}}),Pu=_e.define({create(){return Et.empty},update(t,e){let i=e.state.facet($u),s=e.annotation(Qa);if(s){let l=qe.fromTransaction(e,s.selection),c=s.side,h=c==0?t.undone:t.done;return l?h=Ln(h,h.length,i.minDepth,l):h=Eu(h,e.startState.selection),new Et(c==0?s.rest:h,c==0?h:s.rest)}let r=e.annotation(yy);if((r=="full"||r=="before")&&(t=t.isolate()),e.annotation(ye.addToHistory)===!1)return e.changes.empty?t:t.addMapping(e.changes.desc);let n=qe.fromTransaction(e),o=e.annotation(ye.time),a=e.annotation(ye.userEvent);return n?t=t.addChanges(n,o,a,i,e):e.selection&&(t=t.addSelection(e.startState.selection,o,a,i.newGroupDelay)),(r=="full"||r=="after")&&(t=t.isolate()),t},toJSON(t){return{done:t.done.map(e=>e.toJSON()),undone:t.undone.map(e=>e.toJSON())}},fromJSON(t){return new Et(t.done.map(qe.fromJSON),t.undone.map(qe.fromJSON))}});function wy(t={}){return[Pu,$u.of(t),B.domEventHandlers({beforeinput(e,i){let s=e.inputType=="historyUndo"?Tu:e.inputType=="historyRedo"?ja:null;return s?(e.preventDefault(),s(i)):!1}})]}function ao(t,e){return function({state:i,dispatch:s}){if(!e&&i.readOnly)return!1;let r=i.field(Pu,!1);if(!r)return!1;let n=r.pop(t,i,e);return n?(s(n),!0):!1}}const Tu=ao(0,!1),ja=ao(1,!1),ky=ao(0,!0),Sy=ao(1,!0);class qe{constructor(e,i,s,r,n){this.changes=e,this.effects=i,this.mapped=s,this.startSelection=r,this.selectionsAfter=n}setSelAfter(e){return new qe(this.changes,this.effects,this.mapped,this.startSelection,e)}toJSON(){var e,i,s;return{changes:(e=this.changes)===null||e===void 0?void 0:e.toJSON(),mapped:(i=this.mapped)===null||i===void 0?void 0:i.toJSON(),startSelection:(s=this.startSelection)===null||s===void 0?void 0:s.toJSON(),selectionsAfter:this.selectionsAfter.map(r=>r.toJSON())}}static fromJSON(e){return new qe(e.changes&&ve.fromJSON(e.changes),[],e.mapped&&Dt.fromJSON(e.mapped),e.startSelection&&C.fromJSON(e.startSelection),e.selectionsAfter.map(C.fromJSON))}static fromTransaction(e,i){let s=rt;for(let r of e.startState.facet(xy)){let n=r(e);n.length&&(s=s.concat(n))}return!s.length&&e.changes.empty?null:new qe(e.changes.invert(e.startState.doc),s,void 0,i||e.startState.selection,rt)}static selection(e){return new qe(void 0,rt,void 0,void 0,e)}}function Ln(t,e,i,s){let r=e+1>i+20?e-i-1:0,n=t.slice(r,e);return n.push(s),n}function Cy(t,e){let i=[],s=!1;return t.iterChangedRanges((r,n)=>i.push(r,n)),e.iterChangedRanges((r,n,o,a)=>{for(let l=0;l<i.length;){let c=i[l++],h=i[l++];a>=c&&o<=h&&(s=!0)}}),s}function Oy(t,e){return t.ranges.length==e.ranges.length&&t.ranges.filter((i,s)=>i.empty!=e.ranges[s].empty).length===0}function Mu(t,e){return t.length?e.length?t.concat(e):t:e}const rt=[],Ay=200;function Eu(t,e){if(t.length){let i=t[t.length-1],s=i.selectionsAfter.slice(Math.max(0,i.selectionsAfter.length-Ay));return s.length&&s[s.length-1].eq(e)?t:(s.push(e),Ln(t,t.length-1,1e9,i.setSelAfter(s)))}else return[qe.selection([e])]}function $y(t){let e=t[t.length-1],i=t.slice();return i[t.length-1]=e.setSelAfter(e.selectionsAfter.slice(0,e.selectionsAfter.length-1)),i}function Vo(t,e){if(!t.length)return t;let i=t.length,s=rt;for(;i;){let r=Py(t[i-1],e,s);if(r.changes&&!r.changes.empty||r.effects.length){let n=t.slice(0,i);return n[i-1]=r,n}else e=r.mapped,i--,s=r.selectionsAfter}return s.length?[qe.selection(s)]:rt}function Py(t,e,i){let s=Mu(t.selectionsAfter.length?t.selectionsAfter.map(a=>a.map(e)):rt,i);if(!t.changes)return qe.selection(s);let r=t.changes.map(e),n=e.mapDesc(t.changes,!0),o=t.mapped?t.mapped.composeDesc(n):n;return new qe(r,H.mapEffects(t.effects,e),o,t.startSelection.map(n),s)}const Ty=/^(input\.type|delete)($|\.)/;class Et{constructor(e,i,s=0,r=void 0){this.done=e,this.undone=i,this.prevTime=s,this.prevUserEvent=r}isolate(){return this.prevTime?new Et(this.done,this.undone):this}addChanges(e,i,s,r,n){let o=this.done,a=o[o.length-1];return a&&a.changes&&!a.changes.empty&&e.changes&&(!s||Ty.test(s))&&(!a.selectionsAfter.length&&i-this.prevTime<r.newGroupDelay&&r.joinToEvent(n,Cy(a.changes,e.changes))||s=="input.type.compose")?o=Ln(o,o.length-1,r.minDepth,new qe(e.changes.compose(a.changes),Mu(H.mapEffects(e.effects,a.changes),a.effects),a.mapped,a.startSelection,rt)):o=Ln(o,o.length,r.minDepth,e),new Et(o,rt,i,s)}addSelection(e,i,s,r){let n=this.done.length?this.done[this.done.length-1].selectionsAfter:rt;return n.length>0&&i-this.prevTime<r&&s==this.prevUserEvent&&s&&/^select($|\.)/.test(s)&&Oy(n[n.length-1],e)?this:new Et(Eu(this.done,e),this.undone,i,s)}addMapping(e){return new Et(Vo(this.done,e),Vo(this.undone,e),this.prevTime,this.prevUserEvent)}pop(e,i,s){let r=e==0?this.done:this.undone;if(r.length==0)return null;let n=r[r.length-1],o=n.selectionsAfter[0]||(n.startSelection?n.startSelection.map(n.changes.invertedDesc,1):i.selection);if(s&&n.selectionsAfter.length)return i.update({selection:n.selectionsAfter[n.selectionsAfter.length-1],annotations:Qa.of({side:e,rest:$y(r),selection:o}),userEvent:e==0?"select.undo":"select.redo",scrollIntoView:!0});if(n.changes){let a=r.length==1?rt:r.slice(0,r.length-1);return n.mapped&&(a=Vo(a,n.mapped)),i.update({changes:n.changes,selection:n.startSelection,effects:n.effects,annotations:Qa.of({side:e,rest:a,selection:o}),filter:!1,userEvent:e==0?"undo":"redo",scrollIntoView:!0})}else return null}}Et.empty=new Et(rt,rt);const My=[{key:"Mod-z",run:Tu,preventDefault:!0},{key:"Mod-y",mac:"Mod-Shift-z",run:ja,preventDefault:!0},{linux:"Ctrl-Shift-z",run:ja,preventDefault:!0},{key:"Mod-u",run:ky,preventDefault:!0},{key:"Alt-u",mac:"Mod-Shift-u",run:Sy,preventDefault:!0}];function Ps(t,e){return C.create(t.ranges.map(e),t.mainIndex)}function vt(t,e){return t.update({selection:e,scrollIntoView:!0,userEvent:"select"})}function yt({state:t,dispatch:e},i){let s=Ps(t.selection,i);return s.eq(t.selection,!0)?!1:(e(vt(t,s)),!0)}function lo(t,e){return C.cursor(e?t.to:t.from)}function Du(t,e){return yt(t,i=>i.empty?t.moveByChar(i,e):lo(i,e))}function Be(t){return t.textDirectionAt(t.state.selection.main.head)==ie.LTR}const _u=t=>Du(t,!Be(t)),Bu=t=>Du(t,Be(t));function Ru(t,e){return yt(t,i=>i.empty?t.moveByGroup(i,e):lo(i,e))}const Ey=t=>Ru(t,!Be(t)),Dy=t=>Ru(t,Be(t));function _y(t,e,i){if(e.type.prop(i))return!0;let s=e.to-e.from;return s&&(s>2||/[^\s,.;:]/.test(t.sliceDoc(e.from,e.to)))||e.firstChild}function co(t,e,i){let s=De(t).resolveInner(e.head),r=i?W.closedBy:W.openedBy;for(let l=e.head;;){let c=i?s.childAfter(l):s.childBefore(l);if(!c)break;_y(t,c,r)?s=c:l=i?c.to:c.from}let n=s.type.prop(r),o,a;return n&&(o=i?Mt(t,s.from,1):Mt(t,s.to,-1))&&o.matched?a=i?o.end.to:o.end.from:a=i?s.to:s.from,C.cursor(a,i?-1:1)}const By=t=>yt(t,e=>co(t.state,e,!Be(t))),Ry=t=>yt(t,e=>co(t.state,e,Be(t)));function Lu(t,e){return yt(t,i=>{if(!i.empty)return lo(i,e);let s=t.moveVertically(i,e);return s.head!=i.head?s:t.moveToLineBoundary(i,e)})}const Iu=t=>Lu(t,!1),Fu=t=>Lu(t,!0);function Nu(t){let e=t.scrollDOM.clientHeight<t.scrollDOM.scrollHeight-2,i=0,s=0,r;if(e){for(let n of t.state.facet(B.scrollMargins)){let o=n(t);o!=null&&o.top&&(i=Math.max(o==null?void 0:o.top,i)),o!=null&&o.bottom&&(s=Math.max(o==null?void 0:o.bottom,s))}r=t.scrollDOM.clientHeight-i-s}else r=(t.dom.ownerDocument.defaultView||window).innerHeight;return{marginTop:i,marginBottom:s,selfScroll:e,height:Math.max(t.defaultLineHeight,r-5)}}function zu(t,e){let i=Nu(t),{state:s}=t,r=Ps(s.selection,o=>o.empty?t.moveVertically(o,e,i.height):lo(o,e));if(r.eq(s.selection))return!1;let n;if(i.selfScroll){let o=t.coordsAtPos(s.selection.main.head),a=t.scrollDOM.getBoundingClientRect(),l=a.top+i.marginTop,c=a.bottom-i.marginBottom;o&&o.top>l&&o.bottom<c&&(n=B.scrollIntoView(r.main.head,{y:"start",yMargin:o.top-l}))}return t.dispatch(vt(s,r),{effects:n}),!0}const Th=t=>zu(t,!1),Ka=t=>zu(t,!0);function xi(t,e,i){let s=t.lineBlockAt(e.head),r=t.moveToLineBoundary(e,i);if(r.head==e.head&&r.head!=(i?s.to:s.from)&&(r=t.moveToLineBoundary(e,i,!1)),!i&&r.head==s.from&&s.length){let n=/^\s*/.exec(t.state.sliceDoc(s.from,Math.min(s.from+100,s.to)))[0].length;n&&e.head!=s.from+n&&(r=C.cursor(s.from+n))}return r}const Ly=t=>yt(t,e=>xi(t,e,!0)),Iy=t=>yt(t,e=>xi(t,e,!1)),Fy=t=>yt(t,e=>xi(t,e,!Be(t))),Ny=t=>yt(t,e=>xi(t,e,Be(t))),zy=t=>yt(t,e=>C.cursor(t.lineBlockAt(e.head).from,1)),Hy=t=>yt(t,e=>C.cursor(t.lineBlockAt(e.head).to,-1));function Wy(t,e,i){let s=!1,r=Ps(t.selection,n=>{let o=Mt(t,n.head,-1)||Mt(t,n.head,1)||n.head>0&&Mt(t,n.head-1,1)||n.head<t.doc.length&&Mt(t,n.head+1,-1);if(!o||!o.end)return n;s=!0;let a=o.start.from==n.head?o.end.to:o.end.from;return C.cursor(a)});return s?(e(vt(t,r)),!0):!1}const Uy=({state:t,dispatch:e})=>Wy(t,e);function ht(t,e){let i=Ps(t.state.selection,s=>{let r=e(s);return C.range(s.anchor,r.head,r.goalColumn,r.bidiLevel||void 0,r.assoc)});return i.eq(t.state.selection)?!1:(t.dispatch(vt(t.state,i)),!0)}function Hu(t,e){return ht(t,i=>t.moveByChar(i,e))}const Wu=t=>Hu(t,!Be(t)),Uu=t=>Hu(t,Be(t));function qu(t,e){return ht(t,i=>t.moveByGroup(i,e))}const qy=t=>qu(t,!Be(t)),Vy=t=>qu(t,Be(t)),Qy=t=>ht(t,e=>co(t.state,e,!Be(t))),jy=t=>ht(t,e=>co(t.state,e,Be(t)));function Vu(t,e){return ht(t,i=>t.moveVertically(i,e))}const Qu=t=>Vu(t,!1),ju=t=>Vu(t,!0);function Ku(t,e){return ht(t,i=>t.moveVertically(i,e,Nu(t).height))}const Mh=t=>Ku(t,!1),Eh=t=>Ku(t,!0),Ky=t=>ht(t,e=>xi(t,e,!0)),Xy=t=>ht(t,e=>xi(t,e,!1)),Jy=t=>ht(t,e=>xi(t,e,!Be(t))),Yy=t=>ht(t,e=>xi(t,e,Be(t))),Gy=t=>ht(t,e=>C.cursor(t.lineBlockAt(e.head).from)),Zy=t=>ht(t,e=>C.cursor(t.lineBlockAt(e.head).to)),Dh=({state:t,dispatch:e})=>(e(vt(t,{anchor:0})),!0),_h=({state:t,dispatch:e})=>(e(vt(t,{anchor:t.doc.length})),!0),Bh=({state:t,dispatch:e})=>(e(vt(t,{anchor:t.selection.main.anchor,head:0})),!0),Rh=({state:t,dispatch:e})=>(e(vt(t,{anchor:t.selection.main.anchor,head:t.doc.length})),!0),ex=({state:t,dispatch:e})=>(e(t.update({selection:{anchor:0,head:t.doc.length},userEvent:"select"})),!0),tx=({state:t,dispatch:e})=>{let i=ho(t).map(({from:s,to:r})=>C.range(s,Math.min(r+1,t.doc.length)));return e(t.update({selection:C.create(i),userEvent:"select"})),!0},ix=({state:t,dispatch:e})=>{let i=Ps(t.selection,s=>{let r=De(t),n=r.resolveStack(s.from,1);if(s.empty){let o=r.resolveStack(s.from,-1);o.node.from>=n.node.from&&o.node.to<=n.node.to&&(n=o)}for(let o=n;o;o=o.next){let{node:a}=o;if((a.from<s.from&&a.to>=s.to||a.to>s.to&&a.from<=s.from)&&o.next)return C.range(a.to,a.from)}return s});return i.eq(t.selection)?!1:(e(vt(t,i)),!0)};function Xu(t,e){let{state:i}=t,s=i.selection,r=i.selection.ranges.slice();for(let n of i.selection.ranges){let o=i.doc.lineAt(n.head);if(e?o.to<t.state.doc.length:o.from>0)for(let a=n;;){let l=t.moveVertically(a,e);if(l.head<o.from||l.head>o.to){r.some(c=>c.head==l.head)||r.push(l);break}else{if(l.head==a.head)break;a=l}}}return r.length==s.ranges.length?!1:(t.dispatch(vt(i,C.create(r,r.length-1))),!0)}const sx=t=>Xu(t,!1),rx=t=>Xu(t,!0),nx=({state:t,dispatch:e})=>{let i=t.selection,s=null;return i.ranges.length>1?s=C.create([i.main]):i.main.empty||(s=C.create([C.cursor(i.main.head)])),s?(e(vt(t,s)),!0):!1};function Pr(t,e){if(t.state.readOnly)return!1;let i="delete.selection",{state:s}=t,r=s.changeByRange(n=>{let{from:o,to:a}=n;if(o==a){let l=e(n);l<o?(i="delete.backward",l=Jr(t,l,!1)):l>o&&(i="delete.forward",l=Jr(t,l,!0)),o=Math.min(o,l),a=Math.max(a,l)}else o=Jr(t,o,!1),a=Jr(t,a,!0);return o==a?{range:n}:{changes:{from:o,to:a},range:C.cursor(o,o<n.head?-1:1)}});return r.changes.empty?!1:(t.dispatch(s.update(r,{scrollIntoView:!0,userEvent:i,effects:i=="delete.selection"?B.announce.of(s.phrase("Selection deleted")):void 0})),!0)}function Jr(t,e,i){if(t instanceof B)for(let s of t.state.facet(B.atomicRanges).map(r=>r(t)))s.between(e,e,(r,n)=>{r<e&&n>e&&(e=i?n:r)});return e}const Ju=(t,e,i)=>Pr(t,s=>{let r=s.from,{state:n}=t,o=n.doc.lineAt(r),a,l;if(i&&!e&&r>o.from&&r<o.from+200&&!/[^ \t]/.test(a=o.text.slice(0,r-o.from))){if(a[a.length-1]=="	")return r-1;let c=$s(a,n.tabSize),h=c%_n(n)||_n(n);for(let d=0;d<h&&a[a.length-1-d]==" ";d++)r--;l=r}else l=Ce(o.text,r-o.from,e,e)+o.from,l==r&&o.number!=(e?n.doc.lines:1)?l+=e?1:-1:!e&&/[\ufe00-\ufe0f]/.test(o.text.slice(l-o.from,r-o.from))&&(l=Ce(o.text,l-o.from,!1,!1)+o.from);return l}),Xa=t=>Ju(t,!1,!0),Yu=t=>Ju(t,!0,!1),Gu=(t,e)=>Pr(t,i=>{let s=i.head,{state:r}=t,n=r.doc.lineAt(s),o=r.charCategorizer(s);for(let a=null;;){if(s==(e?n.to:n.from)){s==i.head&&n.number!=(e?r.doc.lines:1)&&(s+=e?1:-1);break}let l=Ce(n.text,s-n.from,e)+n.from,c=n.text.slice(Math.min(s,l)-n.from,Math.max(s,l)-n.from),h=o(c);if(a!=null&&h!=a)break;(c!=" "||s!=i.head)&&(a=h),s=l}return s}),Zu=t=>Gu(t,!1),ox=t=>Gu(t,!0),ax=t=>Pr(t,e=>{let i=t.lineBlockAt(e.head).to;return e.head<i?i:Math.min(t.state.doc.length,e.head+1)}),lx=t=>Pr(t,e=>{let i=t.moveToLineBoundary(e,!1).head;return e.head>i?i:Math.max(0,e.head-1)}),cx=t=>Pr(t,e=>{let i=t.moveToLineBoundary(e,!0).head;return e.head<i?i:Math.min(t.state.doc.length,e.head+1)}),hx=({state:t,dispatch:e})=>{if(t.readOnly)return!1;let i=t.changeByRange(s=>({changes:{from:s.from,to:s.to,insert:X.of(["",""])},range:C.cursor(s.from)}));return e(t.update(i,{scrollIntoView:!0,userEvent:"input"})),!0},dx=({state:t,dispatch:e})=>{if(t.readOnly)return!1;let i=t.changeByRange(s=>{if(!s.empty||s.from==0||s.from==t.doc.length)return{range:s};let r=s.from,n=t.doc.lineAt(r),o=r==n.from?r-1:Ce(n.text,r-n.from,!1)+n.from,a=r==n.to?r+1:Ce(n.text,r-n.from,!0)+n.from;return{changes:{from:o,to:a,insert:t.doc.slice(r,a).append(t.doc.slice(o,r))},range:C.cursor(a)}});return i.changes.empty?!1:(e(t.update(i,{scrollIntoView:!0,userEvent:"move.character"})),!0)};function ho(t){let e=[],i=-1;for(let s of t.selection.ranges){let r=t.doc.lineAt(s.from),n=t.doc.lineAt(s.to);if(!s.empty&&s.to==n.from&&(n=t.doc.lineAt(s.to-1)),i>=r.number){let o=e[e.length-1];o.to=n.to,o.ranges.push(s)}else e.push({from:r.from,to:n.to,ranges:[s]});i=n.number+1}return e}function ep(t,e,i){if(t.readOnly)return!1;let s=[],r=[];for(let n of ho(t)){if(i?n.to==t.doc.length:n.from==0)continue;let o=t.doc.lineAt(i?n.to+1:n.from-1),a=o.length+1;if(i){s.push({from:n.to,to:o.to},{from:n.from,insert:o.text+t.lineBreak});for(let l of n.ranges)r.push(C.range(Math.min(t.doc.length,l.anchor+a),Math.min(t.doc.length,l.head+a)))}else{s.push({from:o.from,to:n.from},{from:n.to,insert:t.lineBreak+o.text});for(let l of n.ranges)r.push(C.range(l.anchor-a,l.head-a))}}return s.length?(e(t.update({changes:s,scrollIntoView:!0,selection:C.create(r,t.selection.mainIndex),userEvent:"move.line"})),!0):!1}const fx=({state:t,dispatch:e})=>ep(t,e,!1),ux=({state:t,dispatch:e})=>ep(t,e,!0);function tp(t,e,i){if(t.readOnly)return!1;let s=[];for(let n of ho(t))i?s.push({from:n.from,insert:t.doc.slice(n.from,n.to)+t.lineBreak}):s.push({from:n.to,insert:t.lineBreak+t.doc.slice(n.from,n.to)});let r=t.changes(s);return e(t.update({changes:r,selection:t.selection.map(r,i?1:-1),scrollIntoView:!0,userEvent:"input.copyline"})),!0}const px=({state:t,dispatch:e})=>tp(t,e,!1),gx=({state:t,dispatch:e})=>tp(t,e,!0),mx=t=>{if(t.state.readOnly)return!1;let{state:e}=t,i=e.changes(ho(e).map(({from:r,to:n})=>(r>0?r--:n<e.doc.length&&n++,{from:r,to:n}))),s=Ps(e.selection,r=>{let n;if(t.lineWrapping){let o=t.lineBlockAt(r.head),a=t.coordsAtPos(r.head,r.assoc||1);a&&(n=o.bottom+t.documentTop-a.bottom+t.defaultLineHeight/2)}return t.moveVertically(r,!0,n)}).map(i);return t.dispatch({changes:i,selection:s,scrollIntoView:!0,userEvent:"delete.line"}),!0};function bx(t,e){if(/\(\)|\[\]|\{\}/.test(t.sliceDoc(e-1,e+1)))return{from:e,to:e};let i=De(t).resolveInner(e),s=i.childBefore(e),r=i.childAfter(e),n;return s&&r&&s.to<=e&&r.from>=e&&(n=s.type.prop(W.closedBy))&&n.indexOf(r.name)>-1&&t.doc.lineAt(s.to).from==t.doc.lineAt(r.from).from&&!/\S/.test(t.sliceDoc(s.to,r.from))?{from:s.to,to:r.from}:null}const Lh=ip(!1),vx=ip(!0);function ip(t){return({state:e,dispatch:i})=>{if(e.readOnly)return!1;let s=e.changeByRange(r=>{let{from:n,to:o}=r,a=e.doc.lineAt(n),l=!t&&n==o&&bx(e,n);t&&(n=o=(o<=a.to?a:e.doc.lineAt(o)).to);let c=new no(e,{simulateBreak:n,simulateDoubleBreak:!!l}),h=Rl(c,n);for(h==null&&(h=$s(/^\s*/.exec(e.doc.lineAt(n).text)[0],e.tabSize));o<a.to&&/\s/.test(a.text[o-a.from]);)o++;l?{from:n,to:o}=l:n>a.from&&n<a.from+100&&!/\S/.test(a.text.slice(0,n))&&(n=a.from);let d=["",fr(e,h)];return l&&d.push(fr(e,c.lineIndent(a.from,-1))),{changes:{from:n,to:o,insert:X.of(d)},range:C.cursor(n+1+d[1].length)}});return i(e.update(s,{scrollIntoView:!0,userEvent:"input"})),!0}}function Nl(t,e){let i=-1;return t.changeByRange(s=>{let r=[];for(let o=s.from;o<=s.to;){let a=t.doc.lineAt(o);a.number>i&&(s.empty||s.to>a.from)&&(e(a,r,s),i=a.number),o=a.to+1}let n=t.changes(r);return{changes:r,range:C.range(n.mapPos(s.anchor,1),n.mapPos(s.head,1))}})}const yx=({state:t,dispatch:e})=>{if(t.readOnly)return!1;let i=Object.create(null),s=new no(t,{overrideIndentation:n=>{let o=i[n];return o??-1}}),r=Nl(t,(n,o,a)=>{let l=Rl(s,n.from);if(l==null)return;/\S/.test(n.text)||(l=0);let c=/^\s*/.exec(n.text)[0],h=fr(t,l);(c!=h||a.from<n.from+c.length)&&(i[n.from]=l,o.push({from:n.from,to:n.from+c.length,insert:h}))});return r.changes.empty||e(t.update(r,{userEvent:"indent"})),!0},xx=({state:t,dispatch:e})=>t.readOnly?!1:(e(t.update(Nl(t,(i,s)=>{s.push({from:i.from,insert:t.facet(Bl)})}),{userEvent:"input.indent"})),!0),wx=({state:t,dispatch:e})=>t.readOnly?!1:(e(t.update(Nl(t,(i,s)=>{let r=/^\s*/.exec(i.text)[0];if(!r)return;let n=$s(r,t.tabSize),o=0,a=fr(t,Math.max(0,n-_n(t)));for(;o<r.length&&o<a.length&&r.charCodeAt(o)==a.charCodeAt(o);)o++;s.push({from:i.from+o,to:i.from+r.length,insert:a.slice(o)})}),{userEvent:"delete.dedent"})),!0),kx=t=>(t.setTabFocusMode(),!0),Sx=[{key:"Ctrl-b",run:_u,shift:Wu,preventDefault:!0},{key:"Ctrl-f",run:Bu,shift:Uu},{key:"Ctrl-p",run:Iu,shift:Qu},{key:"Ctrl-n",run:Fu,shift:ju},{key:"Ctrl-a",run:zy,shift:Gy},{key:"Ctrl-e",run:Hy,shift:Zy},{key:"Ctrl-d",run:Yu},{key:"Ctrl-h",run:Xa},{key:"Ctrl-k",run:ax},{key:"Ctrl-Alt-h",run:Zu},{key:"Ctrl-o",run:hx},{key:"Ctrl-t",run:dx},{key:"Ctrl-v",run:Ka}],Cx=[{key:"ArrowLeft",run:_u,shift:Wu,preventDefault:!0},{key:"Mod-ArrowLeft",mac:"Alt-ArrowLeft",run:Ey,shift:qy,preventDefault:!0},{mac:"Cmd-ArrowLeft",run:Fy,shift:Jy,preventDefault:!0},{key:"ArrowRight",run:Bu,shift:Uu,preventDefault:!0},{key:"Mod-ArrowRight",mac:"Alt-ArrowRight",run:Dy,shift:Vy,preventDefault:!0},{mac:"Cmd-ArrowRight",run:Ny,shift:Yy,preventDefault:!0},{key:"ArrowUp",run:Iu,shift:Qu,preventDefault:!0},{mac:"Cmd-ArrowUp",run:Dh,shift:Bh},{mac:"Ctrl-ArrowUp",run:Th,shift:Mh},{key:"ArrowDown",run:Fu,shift:ju,preventDefault:!0},{mac:"Cmd-ArrowDown",run:_h,shift:Rh},{mac:"Ctrl-ArrowDown",run:Ka,shift:Eh},{key:"PageUp",run:Th,shift:Mh},{key:"PageDown",run:Ka,shift:Eh},{key:"Home",run:Iy,shift:Xy,preventDefault:!0},{key:"Mod-Home",run:Dh,shift:Bh},{key:"End",run:Ly,shift:Ky,preventDefault:!0},{key:"Mod-End",run:_h,shift:Rh},{key:"Enter",run:Lh,shift:Lh},{key:"Mod-a",run:ex},{key:"Backspace",run:Xa,shift:Xa,preventDefault:!0},{key:"Delete",run:Yu,preventDefault:!0},{key:"Mod-Backspace",mac:"Alt-Backspace",run:Zu,preventDefault:!0},{key:"Mod-Delete",mac:"Alt-Delete",run:ox,preventDefault:!0},{mac:"Mod-Backspace",run:lx,preventDefault:!0},{mac:"Mod-Delete",run:cx,preventDefault:!0}].concat(Sx.map(t=>({mac:t.key,run:t.run,shift:t.shift}))),Ox=[{key:"Alt-ArrowLeft",mac:"Ctrl-ArrowLeft",run:By,shift:Qy},{key:"Alt-ArrowRight",mac:"Ctrl-ArrowRight",run:Ry,shift:jy},{key:"Alt-ArrowUp",run:fx},{key:"Shift-Alt-ArrowUp",run:px},{key:"Alt-ArrowDown",run:ux},{key:"Shift-Alt-ArrowDown",run:gx},{key:"Mod-Alt-ArrowUp",run:sx},{key:"Mod-Alt-ArrowDown",run:rx},{key:"Escape",run:nx},{key:"Mod-Enter",run:vx},{key:"Alt-l",mac:"Ctrl-l",run:tx},{key:"Mod-i",run:ix,preventDefault:!0},{key:"Mod-[",run:wx},{key:"Mod-]",run:xx},{key:"Mod-Alt-\\",run:yx},{key:"Shift-Mod-k",run:mx},{key:"Shift-Mod-\\",run:Uy},{key:"Mod-/",run:fy},{key:"Alt-A",run:py},{key:"Ctrl-m",mac:"Shift-Alt-m",run:kx}].concat(Cx),Ih=typeof String.prototype.normalize=="function"?t=>t.normalize("NFKD"):t=>t;class Ss{constructor(e,i,s=0,r=e.length,n,o){this.test=o,this.value={from:0,to:0,precise:!1},this.done=!1,this.matches=[],this.buffer="",this.bufferPos=0,this.iter=e.iterRange(s,r),this.bufferStart=s,this.normalize=n?a=>n(Ih(a)):Ih,this.query=this.normalize(i)}peek(){if(this.bufferPos==this.buffer.length){if(this.bufferStart+=this.buffer.length,this.iter.next(),this.iter.done)return-1;this.bufferPos=0,this.buffer=this.iter.value}return ze(this.buffer,this.bufferPos)}next(){for(;this.matches.length;)this.matches.pop();return this.nextOverlapping()}nextOverlapping(){for(;;){let e=this.peek();if(e<0)return this.done=!0,this;let i=hl(e),s=this.bufferStart+this.bufferPos;this.bufferPos+=$t(e);let r=this.normalize(i);if(r.length)for(let n=0,o=s,a=!0;;n++){let l=r.charCodeAt(n),c=this.match(l,o,a,this.bufferPos+this.bufferStart,n==r.length-1);if(c)return this.value=c,this;if(n==r.length-1)break;a&&n<i.length&&i.charCodeAt(n)==l?o++:a=!1}}}match(e,i,s,r,n){let o=null;for(let a=0;a<this.matches.length;){let l=this.matches[a],c=!1;this.query.charCodeAt(l.index)==e&&(l.index==this.query.length-1?o={from:l.from,to:r,precise:n&&l.precise}:(l.index++,c=!0)),c?a++:this.matches.splice(a,1)}return this.query.charCodeAt(0)==e&&(this.query.length==1?o={from:i,to:r,precise:s&&n}:this.matches.push({from:i,index:1,precise:s})),o&&this.test&&!this.test(o.from,o.to,this.buffer,this.bufferStart)&&(o=null),o}}typeof Symbol<"u"&&(Ss.prototype[Symbol.iterator]=function(){return this});const sp={from:-1,to:-1,match:/.*/.exec(""),precise:!0},zl="gm"+(/x/.unicode==null?"":"u");class rp{constructor(e,i,s,r=0,n=e.length){if(this.text=e,this.to=n,this.curLine="",this.done=!1,this.value=sp,/\\[sWDnr]|\n|\r|\[\^/.test(i))return new np(e,i,s,r,n);this.re=new RegExp(i,zl+(s!=null&&s.ignoreCase?"i":"")),this.test=s==null?void 0:s.test,this.iter=e.iter();let o=e.lineAt(r);this.curLineStart=o.from,this.matchPos=In(e,r),this.getLine(this.curLineStart)}getLine(e){this.iter.next(e),this.iter.lineBreak?this.curLine="":(this.curLine=this.iter.value,this.curLineStart+this.curLine.length>this.to&&(this.curLine=this.curLine.slice(0,this.to-this.curLineStart)),this.iter.next())}nextLine(){this.curLineStart=this.curLineStart+this.curLine.length+1,this.curLineStart>this.to?this.curLine="":this.getLine(0)}next(){for(let e=this.matchPos-this.curLineStart;;){this.re.lastIndex=e;let i=this.matchPos<=this.to&&this.re.exec(this.curLine);if(i){let s=this.curLineStart+i.index,r=s+i[0].length;if(this.matchPos=In(this.text,r+(s==r?1:0)),s==this.curLineStart+this.curLine.length&&this.nextLine(),(s<r||s>this.value.to)&&(!this.test||this.test(s,r,i)))return this.value={from:s,to:r,precise:!0,match:i},this;e=this.matchPos-this.curLineStart}else if(this.curLineStart+this.curLine.length<this.to)this.nextLine(),e=0;else return this.done=!0,this}}}const Qo=new WeakMap;class ds{constructor(e,i){this.from=e,this.text=i}get to(){return this.from+this.text.length}static get(e,i,s){let r=Qo.get(e);if(!r||r.from>=s||r.to<=i){let a=new ds(i,e.sliceString(i,s));return Qo.set(e,a),a}if(r.from==i&&r.to==s)return r;let{text:n,from:o}=r;return o>i&&(n=e.sliceString(i,o)+n,o=i),r.to<s&&(n+=e.sliceString(r.to,s)),Qo.set(e,new ds(o,n)),new ds(i,n.slice(i-o,s-o))}}class np{constructor(e,i,s,r,n){this.text=e,this.to=n,this.done=!1,this.value=sp,this.matchPos=In(e,r),this.re=new RegExp(i,zl+(s!=null&&s.ignoreCase?"i":"")),this.test=s==null?void 0:s.test,this.flat=ds.get(e,r,this.chunkEnd(r+5e3))}chunkEnd(e){return e>=this.to?this.to:this.text.lineAt(e).to}next(){for(;;){let e=this.re.lastIndex=this.matchPos-this.flat.from,i=this.re.exec(this.flat.text);if(i&&!i[0]&&i.index==e&&(this.re.lastIndex=e+1,i=this.re.exec(this.flat.text)),i){let s=this.flat.from+i.index,r=s+i[0].length;if((this.flat.to>=this.to||i.index+i[0].length<=this.flat.text.length-10)&&(!this.test||this.test(s,r,i)))return this.value={from:s,to:r,precise:!0,match:i},this.matchPos=In(this.text,r+(s==r?1:0)),this}if(this.flat.to==this.to)return this.done=!0,this;this.flat=ds.get(this.text,this.flat.from,this.chunkEnd(this.flat.from+this.flat.text.length*2))}}}typeof Symbol<"u"&&(rp.prototype[Symbol.iterator]=np.prototype[Symbol.iterator]=function(){return this});function Ax(t){try{return new RegExp(t,zl),!0}catch{return!1}}function In(t,e){if(e>=t.length)return e;let i=t.lineAt(e),s;for(;e<i.to&&(s=i.text.charCodeAt(e-i.from))>=56320&&s<57344;)e++;return e}const $x=t=>{let{state:e}=t,i=String(e.doc.lineAt(t.state.selection.main.head).number),{close:s,result:r}=V0(t,{label:e.phrase("Go to line"),input:{type:"text",name:"line",value:i},focus:!0,submitLabel:e.phrase("go")});return r.then(n=>{let o=n&&/^([+-])?(\d+)?(:\d+)?(%)?$/.exec(n.elements.line.value);if(!o){t.dispatch({effects:s});return}let a=e.doc.lineAt(e.selection.main.head),[,l,c,h,d]=o,f=h?+h.slice(1):0,u=c?+c:a.number;if(c&&d){let b=u/100;l&&(b=b*(l=="-"?-1:1)+a.number/e.doc.lines),u=Math.round(e.doc.lines*b)}else c&&l&&(u=u*(l=="-"?-1:1)+a.number);let p=e.doc.line(Math.max(1,Math.min(e.doc.lines,u))),m=C.cursor(p.from+Math.max(0,Math.min(f,p.length)));t.dispatch({effects:[s,B.scrollIntoView(m.from,{y:"center"})],selection:m})}),!0},Px={highlightWordAroundCursor:!1,minSelectionLength:1,maxMatches:100,wholeWords:!1},Tx=_.define({combine(t){return Ft(t,Px,{highlightWordAroundCursor:(e,i)=>e||i,minSelectionLength:Math.min,maxMatches:Math.min})}});function Mx(t){return[Rx,Bx]}const Ex=N.mark({class:"cm-selectionMatch"}),Dx=N.mark({class:"cm-selectionMatch cm-selectionMatch-main"});function Fh(t,e,i,s){return(i==0||t(e.sliceDoc(i-1,i))!=ce.Word)&&(s==e.doc.length||t(e.sliceDoc(s,s+1))!=ce.Word)}function _x(t,e,i,s){return t(e.sliceDoc(i,i+1))==ce.Word&&t(e.sliceDoc(s-1,s))==ce.Word}const Bx=me.fromClass(class{constructor(t){this.decorations=this.getDeco(t)}update(t){(t.selectionSet||t.docChanged||t.viewportChanged)&&(this.decorations=this.getDeco(t.view))}getDeco(t){let e=t.state.facet(Tx),{state:i}=t,s=i.selection;if(s.ranges.length>1)return N.none;let r=s.main,n,o=null;if(r.empty){if(!e.highlightWordAroundCursor)return N.none;let l=i.wordAt(r.head);if(!l)return N.none;o=i.charCategorizer(r.head),n=i.sliceDoc(l.from,l.to)}else{let l=r.to-r.from;if(l<e.minSelectionLength||l>200)return N.none;if(e.wholeWords){if(n=i.sliceDoc(r.from,r.to),o=i.charCategorizer(r.head),!(Fh(o,i,r.from,r.to)&&_x(o,i,r.from,r.to)))return N.none}else if(n=i.sliceDoc(r.from,r.to),!n)return N.none}let a=[];for(let l of t.visibleRanges){let c=new Ss(i.doc,n,l.from,l.to);for(;!c.next().done;){let{from:h,to:d}=c.value;if((!o||Fh(o,i,h,d))&&(r.empty&&h<=r.from&&d>=r.to?a.push(Dx.range(h,d)):(h>=r.to||d<=r.from)&&a.push(Ex.range(h,d)),a.length>e.maxMatches))return N.none}}return N.set(a)}},{decorations:t=>t.decorations}),Rx=B.baseTheme({".cm-selectionMatch":{backgroundColor:"#99ff7780"},".cm-searchMatch .cm-selectionMatch":{backgroundColor:"transparent"}}),Lx=({state:t,dispatch:e})=>{let{selection:i}=t,s=C.create(i.ranges.map(r=>t.wordAt(r.head)||C.cursor(r.head)),i.mainIndex);return s.eq(i)?!1:(e(t.update({selection:s})),!0)};function Ix(t,e){let{main:i,ranges:s}=t.selection,r=t.wordAt(i.head),n=r&&r.from==i.from&&r.to==i.to;for(let o=!1,a=new Ss(t.doc,e,s[s.length-1].to);;)if(a.next(),a.done){if(o)return null;a=new Ss(t.doc,e,0,Math.max(0,s[s.length-1].from-1)),o=!0}else{if(o&&s.some(l=>l.from==a.value.from))continue;if(n){let l=t.wordAt(a.value.from);if(!l||l.from!=a.value.from||l.to!=a.value.to)continue}return a.value}}const Fx=({state:t,dispatch:e})=>{let{ranges:i}=t.selection;if(i.some(n=>n.from===n.to))return Lx({state:t,dispatch:e});let s=t.sliceDoc(i[0].from,i[0].to);if(t.selection.ranges.some(n=>t.sliceDoc(n.from,n.to)!=s))return!1;let r=Ix(t,s);return r?(e(t.update({selection:t.selection.addRange(C.range(r.from,r.to),!1),effects:B.scrollIntoView(r.to)})),!0):!1},Ts=_.define({combine(t){return Ft(t,{top:!1,caseSensitive:!1,literal:!1,regexp:!1,wholeWord:!1,createPanel:e=>new Gx(e),scrollToMatch:e=>B.scrollIntoView(e)})}});class op{constructor(e){this.search=e.search,this.caseSensitive=!!e.caseSensitive,this.literal=!!e.literal,this.regexp=!!e.regexp,this.replace=e.replace||"",this.valid=!!this.search&&(!this.regexp||Ax(this.search)),this.unquoted=this.unquote(this.search),this.wholeWord=!!e.wholeWord,this.test=e.test}unquote(e){return this.literal?e:e.replace(/\\([nrt\\])/g,(i,s)=>s=="n"?`
`:s=="r"?"\r":s=="t"?"	":"\\")}eq(e){return this.search==e.search&&this.replace==e.replace&&this.caseSensitive==e.caseSensitive&&this.regexp==e.regexp&&this.wholeWord==e.wholeWord&&this.test==e.test}create(){return this.regexp?new qx(this):new Hx(this)}getCursor(e,i=0,s){let r=e.doc?e:K.create({doc:e});return s==null&&(s=r.doc.length),this.regexp?Zi(this,r,i,s):Gi(this,r,i,s)}}class ap{constructor(e){this.spec=e}}function Nx(t,e,i){return(s,r,n,o)=>{if(i&&!i(s,r,n,o))return!1;let a=s>=o&&r<=o+n.length?n.slice(s-o,r-o):e.doc.sliceString(s,r);return t(a,e,s,r)}}function Gi(t,e,i,s){let r;return t.wholeWord&&(r=zx(e.doc,e.charCategorizer(e.selection.main.head))),t.test&&(r=Nx(t.test,e,r)),new Ss(e.doc,t.unquoted,i,s,t.caseSensitive?void 0:n=>n.toLowerCase(),r)}function zx(t,e){return(i,s,r,n)=>((n>i||n+r.length<s)&&(n=Math.max(0,i-2),r=t.sliceString(n,Math.min(t.length,s+2))),(e(Fn(r,i-n))!=ce.Word||e(Nn(r,i-n))!=ce.Word)&&(e(Nn(r,s-n))!=ce.Word||e(Fn(r,s-n))!=ce.Word))}class Hx extends ap{constructor(e){super(e)}nextMatch(e,i,s){let r=Gi(this.spec,e,s,e.doc.length).nextOverlapping();if(r.done){let n=Math.min(e.doc.length,i+this.spec.unquoted.length);r=Gi(this.spec,e,0,n).nextOverlapping()}return r.done||r.value.from==i&&r.value.to==s?null:r.value}prevMatchInRange(e,i,s){for(let r=s;;){let n=Math.max(i,r-1e4-this.spec.unquoted.length),o=Gi(this.spec,e,n,r),a=null;for(;!o.nextOverlapping().done;)a=o.value;if(a)return a;if(n==i)return null;r-=1e4}}prevMatch(e,i,s){let r=this.prevMatchInRange(e,0,i);return r||(r=this.prevMatchInRange(e,Math.max(0,s-this.spec.unquoted.length),e.doc.length)),r&&(r.from!=i||r.to!=s)?r:null}getReplacement(e){return this.spec.unquote(this.spec.replace)}matchAll(e,i){let s=Gi(this.spec,e,0,e.doc.length),r=[];for(;!s.next().done;){if(r.length>=i)return null;r.push(s.value)}return r}highlight(e,i,s,r){let n=Gi(this.spec,e,Math.max(0,i-this.spec.unquoted.length),Math.min(s+this.spec.unquoted.length,e.doc.length));for(;!n.next().done;)r(n.value.from,n.value.to)}}function Wx(t,e,i){return(s,r,n)=>(!i||i(s,r,n))&&t(n[0],e,s,r)}function Zi(t,e,i,s){let r;return t.wholeWord&&(r=Ux(e.charCategorizer(e.selection.main.head))),t.test&&(r=Wx(t.test,e,r)),new rp(e.doc,t.search,{ignoreCase:!t.caseSensitive,test:r},i,s)}function Fn(t,e){return t.slice(Ce(t,e,!1),e)}function Nn(t,e){return t.slice(e,Ce(t,e))}function Ux(t){return(e,i,s)=>!s[0].length||(t(Fn(s.input,s.index))!=ce.Word||t(Nn(s.input,s.index))!=ce.Word)&&(t(Nn(s.input,s.index+s[0].length))!=ce.Word||t(Fn(s.input,s.index+s[0].length))!=ce.Word)}class qx extends ap{nextMatch(e,i,s){let r=Zi(this.spec,e,s,e.doc.length).next();return r.done&&(r=Zi(this.spec,e,0,i).next()),r.done?null:r.value}prevMatchInRange(e,i,s){for(let r=1;;r++){let n=Math.max(i,s-r*1e4),o=Zi(this.spec,e,n,s),a=null;for(;!o.next().done;)a=o.value;if(a&&(n==i||a.from>n+10))return a;if(n==i)return null}}prevMatch(e,i,s){return this.prevMatchInRange(e,0,i)||this.prevMatchInRange(e,s,e.doc.length)}getReplacement(e){return this.spec.unquote(this.spec.replace).replace(/\$([$&]|\d+)/g,(i,s)=>{if(s=="&")return e.match[0];if(s=="$")return"$";for(let r=s.length;r>0;r--){let n=+s.slice(0,r);if(n>0&&n<e.match.length)return e.match[n]+s.slice(r)}return i})}matchAll(e,i){let s=Zi(this.spec,e,0,e.doc.length),r=[];for(;!s.next().done;){if(r.length>=i)return null;r.push(s.value)}return r}highlight(e,i,s,r){let n=Zi(this.spec,e,Math.max(0,i-250),Math.min(s+250,e.doc.length));for(;!n.next().done;)r(n.value.from,n.value.to)}}const ur=H.define(),Hl=H.define(),oi=_e.define({create(t){return new jo(Ja(t).create(),null)},update(t,e){for(let i of e.effects)i.is(ur)?t=new jo(i.value.create(),t.panel):i.is(Hl)&&(t=new jo(t.query,i.value?Wl:null));return t},provide:t=>cr.from(t,e=>e.panel)});class jo{constructor(e,i){this.query=e,this.panel=i}}const Vx=N.mark({class:"cm-searchMatch"}),Qx=N.mark({class:"cm-searchMatch cm-searchMatch-selected"}),jx=me.fromClass(class{constructor(t){this.view=t,this.decorations=this.highlight(t.state.field(oi))}update(t){let e=t.state.field(oi);(e!=t.startState.field(oi)||t.docChanged||t.selectionSet||t.viewportChanged)&&(this.decorations=this.highlight(e))}highlight({query:t,panel:e}){if(!e||!t.spec.valid)return N.none;let{view:i}=this,s=new jt;for(let r=0,n=i.visibleRanges,o=n.length;r<o;r++){let{from:a,to:l}=n[r];for(;r<o-1&&l>n[r+1].from-500;)l=n[++r].to;t.highlight(i.state,a,l,(c,h)=>{let d=i.state.selection.ranges.some(f=>f.from==c&&f.to==h);s.add(c,h,d?Qx:Vx)})}return s.finish()}},{decorations:t=>t.decorations});function Tr(t){return e=>{let i=e.state.field(oi,!1);return i&&i.query.spec.valid?t(e,i):hp(e)}}const zn=Tr((t,{query:e})=>{let{to:i}=t.state.selection.main,s=e.nextMatch(t.state,i,i);if(!s)return!1;let r=C.single(s.from,s.to),n=t.state.facet(Ts);return t.dispatch({selection:r,effects:[Ul(t,s),n.scrollToMatch(r.main,t)],userEvent:"select.search"}),cp(t),!0}),Hn=Tr((t,{query:e})=>{let{state:i}=t,{from:s}=i.selection.main,r=e.prevMatch(i,s,s);if(!r)return!1;let n=C.single(r.from,r.to),o=t.state.facet(Ts);return t.dispatch({selection:n,effects:[Ul(t,r),o.scrollToMatch(n.main,t)],userEvent:"select.search"}),cp(t),!0}),Kx=Tr((t,{query:e})=>{let i=e.matchAll(t.state,1e3);return!i||!i.length?!1:(t.dispatch({selection:C.create(i.map(s=>C.range(s.from,s.to))),userEvent:"select.search.matches"}),!0)}),Xx=({state:t,dispatch:e})=>{let i=t.selection;if(i.ranges.length>1||i.main.empty)return!1;let{from:s,to:r}=i.main,n=[],o=0;for(let a=new Ss(t.doc,t.sliceDoc(s,r));!a.next().done;){if(n.length>1e3)return!1;a.value.from==s&&(o=n.length),n.push(C.range(a.value.from,a.value.to))}return e(t.update({selection:C.create(n,o),userEvent:"select.search.matches"})),!0},Nh=Tr((t,{query:e})=>{let{state:i}=t,{from:s,to:r}=i.selection.main;if(i.readOnly)return!1;let n=e.nextMatch(i,s,s);if(!n)return!1;let o=n,a=[],l,c,h=[];o.precise?o.from==s&&o.to==r&&(c=i.toText(e.getReplacement(o)),a.push({from:o.from,to:o.to,insert:c}),h.push(B.announce.of(i.phrase("replaced match on line $",i.doc.lineAt(s).number)+"."))):o=e.nextMatch(i,o.from,o.to);let d=t.state.changes(a);return o&&(l=C.single(o.from,o.to).map(d),h.push(Ul(t,o)),h.push(i.facet(Ts).scrollToMatch(l.main,t))),t.dispatch({changes:d,selection:l,effects:h,userEvent:"input.replace"}),!0}),Jx=Tr((t,{query:e})=>{if(t.state.readOnly)return!1;let i=[];for(let r of e.matchAll(t.state,1e9)){let{from:n,to:o,precise:a}=r;a&&i.push({from:n,to:o,insert:e.getReplacement(r)})}if(!i.length)return!1;let s=t.state.phrase("replaced $ matches",i.length)+".";return t.dispatch({changes:i,effects:B.announce.of(s),userEvent:"input.replace.all"}),!0});function Wl(t){return t.state.facet(Ts).createPanel(t)}function Ja(t,e){var i,s,r,n,o;let a=t.selection.main,l=a.empty||a.to>a.from+100?"":t.sliceDoc(a.from,a.to);if(e&&!l)return e;let c=t.facet(Ts);return new op({search:((i=e==null?void 0:e.literal)!==null&&i!==void 0?i:c.literal)?l:l.replace(/\n/g,"\\n"),caseSensitive:(s=e==null?void 0:e.caseSensitive)!==null&&s!==void 0?s:c.caseSensitive,literal:(r=e==null?void 0:e.literal)!==null&&r!==void 0?r:c.literal,regexp:(n=e==null?void 0:e.regexp)!==null&&n!==void 0?n:c.regexp,wholeWord:(o=e==null?void 0:e.wholeWord)!==null&&o!==void 0?o:c.wholeWord})}function lp(t){let e=Tl(t,Wl);return e&&e.dom.querySelector("[main-field]")}function cp(t){let e=lp(t);e&&e==t.root.activeElement&&e.select()}const hp=t=>{let e=t.state.field(oi,!1);if(e&&e.panel){let i=lp(t);if(i&&i!=t.root.activeElement){let s=Ja(t.state,e.query.spec);s.valid&&t.dispatch({effects:ur.of(s)}),i.focus(),i.select()}}else t.dispatch({effects:[Hl.of(!0),e?ur.of(Ja(t.state,e.query.spec)):H.appendConfig.of(ew)]});return!0},dp=t=>{let e=t.state.field(oi,!1);if(!e||!e.panel)return!1;let i=Tl(t,Wl);return i&&i.dom.contains(t.root.activeElement)&&t.focus(),t.dispatch({effects:Hl.of(!1)}),!0},Yx=[{key:"Mod-f",run:hp,scope:"editor search-panel"},{key:"F3",run:zn,shift:Hn,scope:"editor search-panel",preventDefault:!0},{key:"Mod-g",run:zn,shift:Hn,scope:"editor search-panel",preventDefault:!0},{key:"Escape",run:dp,scope:"editor search-panel"},{key:"Mod-Shift-l",run:Xx},{key:"Mod-Alt-g",run:$x},{key:"Mod-d",run:Fx,preventDefault:!0}];class Gx{constructor(e){this.view=e;let i=this.query=e.state.field(oi).query.spec;this.commit=this.commit.bind(this),this.searchField=Z("input",{value:i.search,placeholder:Xe(e,"Find"),"aria-label":Xe(e,"Find"),class:"cm-textfield",name:"search",form:"","main-field":"true",onchange:this.commit,onkeyup:this.commit}),this.replaceField=Z("input",{value:i.replace,placeholder:Xe(e,"Replace"),"aria-label":Xe(e,"Replace"),class:"cm-textfield",name:"replace",form:"",onchange:this.commit,onkeyup:this.commit}),this.caseField=Z("input",{type:"checkbox",name:"case",form:"",checked:i.caseSensitive,onchange:this.commit}),this.reField=Z("input",{type:"checkbox",name:"re",form:"",checked:i.regexp,onchange:this.commit}),this.wordField=Z("input",{type:"checkbox",name:"word",form:"",checked:i.wholeWord,onchange:this.commit});function s(r,n,o){return Z("button",{class:"cm-button",name:r,onclick:n,type:"button"},o)}this.dom=Z("div",{onkeydown:r=>this.keydown(r),class:"cm-search"},[this.searchField,s("next",()=>zn(e),[Xe(e,"next")]),s("prev",()=>Hn(e),[Xe(e,"previous")]),s("select",()=>Kx(e),[Xe(e,"all")]),Z("label",null,[this.caseField,Xe(e,"match case")]),Z("label",null,[this.reField,Xe(e,"regexp")]),Z("label",null,[this.wordField,Xe(e,"by word")]),...e.state.readOnly?[]:[Z("br"),this.replaceField,s("replace",()=>Nh(e),[Xe(e,"replace")]),s("replaceAll",()=>Jx(e),[Xe(e,"replace all")])],Z("button",{name:"close",onclick:()=>dp(e),"aria-label":Xe(e,"close"),type:"button"},["×"])])}commit(){let e=new op({search:this.searchField.value,caseSensitive:this.caseField.checked,regexp:this.reField.checked,wholeWord:this.wordField.checked,replace:this.replaceField.value});e.eq(this.query)||(this.query=e,this.view.dispatch({effects:ur.of(e)}))}keydown(e){s0(this.view,e,"search-panel")?e.preventDefault():e.keyCode==13&&e.target==this.searchField?(e.preventDefault(),(e.shiftKey?Hn:zn)(this.view)):e.keyCode==13&&e.target==this.replaceField&&(e.preventDefault(),Nh(this.view))}update(e){for(let i of e.transactions)for(let s of i.effects)s.is(ur)&&!s.value.eq(this.query)&&this.setQuery(s.value)}setQuery(e){this.query=e,this.searchField.value=e.search,this.replaceField.value=e.replace,this.caseField.checked=e.caseSensitive,this.reField.checked=e.regexp,this.wordField.checked=e.wholeWord}mount(){this.searchField.select()}get pos(){return 80}get top(){return this.view.state.facet(Ts).top}}function Xe(t,e){return t.state.phrase(e)}const Yr=30,Gr=/[\s\.,:;?!]/;function Ul(t,{from:e,to:i}){let s=t.state.doc.lineAt(e),r=t.state.doc.lineAt(i).to,n=Math.max(s.from,e-Yr),o=Math.min(r,i+Yr),a=t.state.sliceDoc(n,o);if(n!=s.from){for(let l=0;l<Yr;l++)if(!Gr.test(a[l+1])&&Gr.test(a[l])){a=a.slice(l);break}}if(o!=r){for(let l=a.length-1;l>a.length-Yr;l--)if(!Gr.test(a[l-1])&&Gr.test(a[l])){a=a.slice(0,l);break}}return B.announce.of(`${t.state.phrase("current match")}. ${a} ${t.state.phrase("on line")} ${s.number}.`)}const Zx=B.baseTheme({".cm-panel.cm-search":{padding:"2px 6px 4px",position:"relative","& [name=close]":{position:"absolute",top:"0",right:"4px",backgroundColor:"inherit",border:"none",font:"inherit",padding:0,margin:0},"& input, & button, & label":{margin:".2em .6em .2em 0"},"& input[type=checkbox]":{marginRight:".2em"},"& label":{fontSize:"80%",whiteSpace:"pre"}},"&light .cm-searchMatch":{backgroundColor:"#ffff0054"},"&dark .cm-searchMatch":{backgroundColor:"#00ffff8a"},"&light .cm-searchMatch-selected":{backgroundColor:"#ff6a0054"},"&dark .cm-searchMatch-selected":{backgroundColor:"#ff00ff8a"}}),ew=[oi,ji.low(jx),Zx];class fp{constructor(e,i,s,r){this.state=e,this.pos=i,this.explicit=s,this.view=r,this.abortListeners=[],this.abortOnDocChange=!1}tokenBefore(e){let i=De(this.state).resolveInner(this.pos,-1);for(;i&&e.indexOf(i.name)<0;)i=i.parent;return i?{from:i.from,to:this.pos,text:this.state.sliceDoc(i.from,this.pos),type:i.type}:null}matchBefore(e){let i=this.state.doc.lineAt(this.pos),s=Math.max(i.from,this.pos-250),r=i.text.slice(s-i.from,this.pos-i.from),n=r.search(up(e,!1));return n<0?null:{from:s+n,to:this.pos,text:r.slice(n)}}get aborted(){return this.abortListeners==null}addEventListener(e,i,s){e=="abort"&&this.abortListeners&&(this.abortListeners.push(i),s&&s.onDocChange&&(this.abortOnDocChange=!0))}}function zh(t){let e=Object.keys(t).join(""),i=/\w/.test(e);return i&&(e=e.replace(/\w/g,"")),`[${i?"\\w":""}${e.replace(/[^\w\s]/g,"\\$&")}]`}function tw(t){let e=Object.create(null),i=Object.create(null);for(let{label:r}of t){e[r[0]]=!0;for(let n=1;n<r.length;n++)i[r[n]]=!0}let s=zh(e)+zh(i)+"*$";return[new RegExp("^"+s),new RegExp(s)]}function iw(t){let e=t.map(r=>typeof r=="string"?{label:r}:r),[i,s]=e.every(r=>/^\w+$/.test(r.label))?[/\w*$/,/\w+$/]:tw(e);return r=>{let n=r.matchBefore(s);return n||r.explicit?{from:n?n.from:r.pos,options:e,validFor:i}:null}}class Hh{constructor(e,i,s,r){this.completion=e,this.source=i,this.match=s,this.score=r}}function Ni(t){return t.selection.main.from}function up(t,e){var i;let{source:s}=t,r=e&&s[0]!="^",n=s[s.length-1]!="$";return!r&&!n?t:new RegExp(`${r?"^":""}(?:${s})${n?"$":""}`,(i=t.flags)!==null&&i!==void 0?i:t.ignoreCase?"i":"")}const pp=Yt.define();function sw(t,e,i,s){let{main:r}=t.selection,n=i-r.from,o=s-r.from;return{...t.changeByRange(a=>{if(a!=r&&i!=s&&t.sliceDoc(a.from+n,a.from+o)!=t.sliceDoc(i,s))return{range:a};let l=t.toText(e);return{changes:{from:a.from+n,to:s==r.from?a.to:a.from+o,insert:l},range:C.cursor(a.from+n+l.length)}}),scrollIntoView:!0,userEvent:"input.complete"}}const Wh=new WeakMap;function rw(t){if(!Array.isArray(t))return t;let e=Wh.get(t);return e||Wh.set(t,e=iw(t)),e}const Wn=H.define(),pr=H.define();class nw{constructor(e){this.pattern=e,this.chars=[],this.folded=[],this.any=[],this.precise=[],this.byWord=[],this.score=0,this.matched=[];for(let i=0;i<e.length;){let s=ze(e,i),r=$t(s);this.chars.push(s);let n=e.slice(i,i+r),o=n.toUpperCase();this.folded.push(ze(o==n?n.toLowerCase():o,0)),i+=r}this.astral=e.length!=this.chars.length}ret(e,i){return this.score=e,this.matched=i,this}match(e){if(this.pattern.length==0)return this.ret(-100,[]);if(e.length<this.pattern.length)return null;let{chars:i,folded:s,any:r,precise:n,byWord:o}=this;if(i.length==1){let k=ze(e,0),O=$t(k),R=O==e.length?0:-100;if(k!=i[0])if(k==s[0])R+=-200;else return null;return this.ret(R,[0,O])}let a=e.indexOf(this.pattern);if(a==0)return this.ret(e.length==this.pattern.length?0:-100,[0,this.pattern.length]);let l=i.length,c=0;if(a<0){for(let k=0,O=Math.min(e.length,200);k<O&&c<l;){let R=ze(e,k);(R==i[c]||R==s[c])&&(r[c++]=k),k+=$t(R)}if(c<l)return null}let h=0,d=0,f=!1,u=0,p=-1,m=-1,b=/[a-z]/.test(e),x=!0;for(let k=0,O=Math.min(e.length,200),R=0;k<O&&d<l;){let A=ze(e,k);a<0&&(h<l&&A==i[h]&&(n[h++]=k),u<l&&(A==i[u]||A==s[u]?(u==0&&(p=k),m=k+1,u++):u=0));let $,P=A<255?A>=48&&A<=57||A>=97&&A<=122?2:A>=65&&A<=90?1:0:($=hl(A))!=$.toLowerCase()?1:$!=$.toUpperCase()?2:0;(!k||P==1&&b||R==0&&P!=0)&&(i[d]==A||s[d]==A&&(f=!0)?o[d++]=k:o.length&&(x=!1)),R=P,k+=$t(A)}return d==l&&o[0]==0&&x?this.result(-100+(f?-200:0),o,e):u==l&&p==0?this.ret(-200-e.length+(m==e.length?0:-100),[0,m]):a>-1?this.ret(-700-e.length,[a,a+this.pattern.length]):u==l?this.ret(-900-e.length,[p,m]):d==l?this.result(-100+(f?-200:0)+-700+(x?0:-1100),o,e):i.length==2?null:this.result((r[0]?-700:0)+-200+-1100,r,e)}result(e,i,s){let r=[],n=0;for(let o of i){let a=o+(this.astral?$t(ze(s,o)):1);n&&r[n-1]==o?r[n-1]=a:(r[n++]=o,r[n++]=a)}return this.ret(e-s.length,r)}}class ow{constructor(e){this.pattern=e,this.matched=[],this.score=0,this.folded=e.toLowerCase()}match(e){if(e.length<this.pattern.length)return null;let i=e.slice(0,this.pattern.length),s=i==this.pattern?0:i.toLowerCase()==this.folded?-200:null;return s==null?null:(this.matched=[0,i.length],this.score=s+(e.length==this.pattern.length?0:-100),this)}}const Se=_.define({combine(t){return Ft(t,{activateOnTyping:!0,activateOnCompletion:()=>!1,activateOnTypingDelay:100,selectOnOpen:!0,override:null,closeOnBlur:!0,maxRenderedOptions:100,defaultKeymap:!0,tooltipClass:()=>"",optionClass:()=>"",aboveCursor:!1,icons:!0,addToOptions:[],positionInfo:aw,filterStrict:!1,compareCompletions:(e,i)=>(e.sortText||e.label).localeCompare(i.sortText||i.label),interactionDelay:75,updateSyncTime:100},{defaultKeymap:(e,i)=>e&&i,closeOnBlur:(e,i)=>e&&i,icons:(e,i)=>e&&i,tooltipClass:(e,i)=>s=>Uh(e(s),i(s)),optionClass:(e,i)=>s=>Uh(e(s),i(s)),addToOptions:(e,i)=>e.concat(i),filterStrict:(e,i)=>e||i})}});function Uh(t,e){return t?e?t+" "+e:t:e}function aw(t,e,i,s,r,n){let o=t.textDirection==ie.RTL,a=o,l=!1,c="top",h,d,f=e.left-r.left,u=r.right-e.right,p=s.right-s.left,m=s.bottom-s.top;if(a&&f<Math.min(p,u)?a=!1:!a&&u<Math.min(p,f)&&(a=!0),p<=(a?f:u))h=Math.max(r.top,Math.min(i.top,r.bottom-m))-e.top,d=Math.min(400,a?f:u);else{l=!0,d=Math.min(400,(o?e.right:r.right-e.left)-30);let k=r.bottom-e.bottom;k>=m||k>e.top?h=i.bottom-e.top:(c="bottom",h=e.bottom-i.top)}let b=(e.bottom-e.top)/n.offsetHeight,x=(e.right-e.left)/n.offsetWidth;return{style:`${c}: ${h/b}px; max-width: ${d/x}px`,class:"cm-completionInfo-"+(l?o?"left-narrow":"right-narrow":a?"left":"right")}}const ql=H.define();function lw(t){let e=t.addToOptions.slice();return t.icons&&e.push({render(i){let s=document.createElement("div");return s.classList.add("cm-completionIcon"),i.type&&s.classList.add(...i.type.split(/\s+/g).map(r=>"cm-completionIcon-"+r)),s.setAttribute("aria-hidden","true"),s},position:20}),e.push({render(i,s,r,n){let o=document.createElement("span");o.className="cm-completionLabel";let a=i.displayLabel||i.label,l=0;for(let c=0;c<n.length;){let h=n[c++],d=n[c++];h>l&&o.appendChild(document.createTextNode(a.slice(l,h)));let f=o.appendChild(document.createElement("span"));f.appendChild(document.createTextNode(a.slice(h,d))),f.className="cm-completionMatchedText",l=d}return l<a.length&&o.appendChild(document.createTextNode(a.slice(l))),o},position:50},{render(i){if(!i.detail)return null;let s=document.createElement("span");return s.className="cm-completionDetail",s.textContent=i.detail,s},position:80}),e.sort((i,s)=>i.position-s.position).map(i=>i.render)}function Ko(t,e,i){if(t<=i)return{from:0,to:t};if(e<0&&(e=0),e<=t>>1){let r=Math.floor(e/i);return{from:r*i,to:(r+1)*i}}let s=Math.floor((t-e)/i);return{from:t-(s+1)*i,to:t-s*i}}class cw{constructor(e,i,s){this.view=e,this.stateField=i,this.applyCompletion=s,this.info=null,this.infoDestroy=null,this.placeInfoReq={read:()=>this.measureInfo(),write:l=>this.placeInfo(l),key:this},this.space=null,this.currentClass="";let r=e.state.field(i),{options:n,selected:o}=r.open,a=e.state.facet(Se);this.optionContent=lw(a),this.optionClass=a.optionClass,this.tooltipClass=a.tooltipClass,this.range=Ko(n.length,o,a.maxRenderedOptions),this.dom=document.createElement("div"),this.dom.className="cm-tooltip-autocomplete",this.updateTooltipClass(e.state),this.dom.addEventListener("mousedown",l=>{let{options:c}=e.state.field(i).open;for(let h=l.target,d;h&&h!=this.dom;h=h.parentNode)if(h.nodeName=="LI"&&(d=/-(\d+)$/.exec(h.id))&&+d[1]<c.length){this.applyCompletion(e,c[+d[1]]),l.preventDefault();return}if(l.target==this.list){let h=this.list.classList.contains("cm-completionListIncompleteTop")&&l.clientY<this.list.firstChild.getBoundingClientRect().top?this.range.from-1:this.list.classList.contains("cm-completionListIncompleteBottom")&&l.clientY>this.list.lastChild.getBoundingClientRect().bottom?this.range.to:null;h!=null&&(e.dispatch({effects:ql.of(h)}),l.preventDefault())}}),this.dom.addEventListener("focusout",l=>{let c=e.state.field(this.stateField,!1);c&&c.tooltip&&e.state.facet(Se).closeOnBlur&&l.relatedTarget!=e.contentDOM&&e.dispatch({effects:pr.of(null)})}),this.showOptions(n,r.id)}mount(){this.updateSel()}showOptions(e,i){this.list&&this.list.remove(),this.list=this.dom.appendChild(this.createListBox(e,i,this.range)),this.list.addEventListener("scroll",()=>{this.info&&this.view.requestMeasure(this.placeInfoReq)})}update(e){var i;let s=e.state.field(this.stateField),r=e.startState.field(this.stateField);if(this.updateTooltipClass(e.state),s!=r){let{options:n,selected:o,disabled:a}=s.open;(!r.open||r.open.options!=n)&&(this.range=Ko(n.length,o,e.state.facet(Se).maxRenderedOptions),this.showOptions(n,s.id)),this.updateSel(),a!=((i=r.open)===null||i===void 0?void 0:i.disabled)&&this.dom.classList.toggle("cm-tooltip-autocomplete-disabled",!!a)}}updateTooltipClass(e){let i=this.tooltipClass(e);if(i!=this.currentClass){for(let s of this.currentClass.split(" "))s&&this.dom.classList.remove(s);for(let s of i.split(" "))s&&this.dom.classList.add(s);this.currentClass=i}}positioned(e){this.space=e,this.info&&this.view.requestMeasure(this.placeInfoReq)}updateSel(){let e=this.view.state.field(this.stateField),i=e.open;(i.selected>-1&&i.selected<this.range.from||i.selected>=this.range.to)&&(this.range=Ko(i.options.length,i.selected,this.view.state.facet(Se).maxRenderedOptions),this.showOptions(i.options,e.id));let s=this.updateSelectedOption(i.selected);if(s){this.destroyInfo();let{completion:r}=i.options[i.selected],{info:n}=r;if(!n)return;let o=typeof n=="string"?document.createTextNode(n):n(r);if(!o)return;"then"in o?o.then(a=>{a&&this.view.state.field(this.stateField,!1)==e&&this.addInfoPane(a,r)}).catch(a=>Ue(this.view.state,a,"completion info")):(this.addInfoPane(o,r),s.setAttribute("aria-describedby",this.info.id))}}addInfoPane(e,i){this.destroyInfo();let s=this.info=document.createElement("div");if(s.className="cm-tooltip cm-completionInfo",s.id="cm-completionInfo-"+Math.floor(Math.random()*65535).toString(16),e.nodeType!=null)s.appendChild(e),this.infoDestroy=null;else{let{dom:r,destroy:n}=e;s.appendChild(r),this.infoDestroy=n||null}this.dom.appendChild(s),this.view.requestMeasure(this.placeInfoReq)}updateSelectedOption(e){let i=null;for(let s=this.list.firstChild,r=this.range.from;s;s=s.nextSibling,r++)s.nodeName!="LI"||!s.id?r--:r==e?s.hasAttribute("aria-selected")||(s.setAttribute("aria-selected","true"),i=s):s.hasAttribute("aria-selected")&&(s.removeAttribute("aria-selected"),s.removeAttribute("aria-describedby"));return i&&dw(this.list,i),i}measureInfo(){let e=this.dom.querySelector("[aria-selected]");if(!e||!this.info)return null;let i=this.dom.getBoundingClientRect(),s=this.info.getBoundingClientRect(),r=e.getBoundingClientRect(),n=this.space;if(!n){let o=this.dom.ownerDocument.documentElement;n={left:0,top:0,right:o.clientWidth,bottom:o.clientHeight}}return r.top>Math.min(n.bottom,i.bottom)-10||r.bottom<Math.max(n.top,i.top)+10?null:this.view.state.facet(Se).positionInfo(this.view,i,r,s,n,this.dom)}placeInfo(e){this.info&&(e?(e.style&&(this.info.style.cssText=e.style),this.info.className="cm-tooltip cm-completionInfo "+(e.class||"")):this.info.style.cssText="top: -1e6px")}createListBox(e,i,s){const r=document.createElement("ul");r.id=i,r.setAttribute("role","listbox"),r.setAttribute("aria-expanded","true"),r.setAttribute("aria-label",this.view.state.phrase("Completions")),r.addEventListener("mousedown",o=>{o.target==r&&o.preventDefault()});let n=null;for(let o=s.from;o<s.to;o++){let{completion:a,match:l}=e[o],{section:c}=a;if(c){let f=typeof c=="string"?c:c.name;if(f!=n&&(o>s.from||s.from==0))if(n=f,typeof c!="string"&&c.header)r.appendChild(c.header(c));else{let u=r.appendChild(document.createElement("completion-section"));u.textContent=f}}const h=r.appendChild(document.createElement("li"));h.id=i+"-"+o,h.setAttribute("role","option");let d=this.optionClass(a);d&&(h.className=d);for(let f of this.optionContent){let u=f(a,this.view.state,this.view,l);u&&h.appendChild(u)}}return s.from&&r.classList.add("cm-completionListIncompleteTop"),s.to<e.length&&r.classList.add("cm-completionListIncompleteBottom"),r}destroyInfo(){this.info&&(this.infoDestroy&&this.infoDestroy(),this.info.remove(),this.info=null)}destroy(){this.destroyInfo()}}function hw(t,e){return i=>new cw(i,t,e)}function dw(t,e){let i=t.getBoundingClientRect(),s=e.getBoundingClientRect(),r=i.height/t.offsetHeight;s.top<i.top?t.scrollTop-=(i.top-s.top)/r:s.bottom>i.bottom&&(t.scrollTop+=(s.bottom-i.bottom)/r)}function qh(t){return(t.boost||0)*100+(t.apply?10:0)+(t.info?5:0)+(t.type?1:0)}function fw(t,e){let i=[],s=null,r=null,n=h=>{i.push(h);let{section:d}=h.completion;if(d){s||(s=[]);let f=typeof d=="string"?d:d.name;s.some(u=>u.name==f)||s.push(typeof d=="string"?{name:f}:d)}},o=e.facet(Se);for(let h of t)if(h.hasResult()){let d=h.result.getMatch;if(h.result.filter===!1)for(let f of h.result.options)n(new Hh(f,h.source,d?d(f):[],1e9-i.length));else{let f=e.sliceDoc(h.from,h.to),u,p=o.filterStrict?new ow(f):new nw(f);for(let m of h.result.options)if(u=p.match(m.label)){let b=m.displayLabel?d?d(m,u.matched):[]:u.matched,x=u.score+(m.boost||0);if(n(new Hh(m,h.source,b,x)),typeof m.section=="object"&&m.section.rank==="dynamic"){let{name:k}=m.section;r||(r=Object.create(null)),r[k]=Math.max(x,r[k]||-1e9)}}}}if(s){let h=Object.create(null),d=0,f=(u,p)=>(u.rank==="dynamic"&&p.rank==="dynamic"?r[p.name]-r[u.name]:0)||(typeof u.rank=="number"?u.rank:1e9)-(typeof p.rank=="number"?p.rank:1e9)||(u.name<p.name?-1:1);for(let u of s.sort(f))d-=1e5,h[u.name]=d;for(let u of i){let{section:p}=u.completion;p&&(u.score+=h[typeof p=="string"?p:p.name])}}let a=[],l=null,c=o.compareCompletions;for(let h of i.sort((d,f)=>f.score-d.score||c(d.completion,f.completion))){let d=h.completion;!l||l.label!=d.label||l.detail!=d.detail||l.type!=null&&d.type!=null&&l.type!=d.type||l.apply!=d.apply||l.boost!=d.boost?a.push(h):qh(h.completion)>qh(l)&&(a[a.length-1]=h),l=h.completion}return a}class rs{constructor(e,i,s,r,n,o){this.options=e,this.attrs=i,this.tooltip=s,this.timestamp=r,this.selected=n,this.disabled=o}setSelected(e,i){return e==this.selected||e>=this.options.length?this:new rs(this.options,Vh(i,e),this.tooltip,this.timestamp,e,this.disabled)}static build(e,i,s,r,n,o){if(r&&!o&&e.some(c=>c.isPending))return r.setDisabled();let a=fw(e,i);if(!a.length)return r&&e.some(c=>c.isPending)?r.setDisabled():null;let l=i.facet(Se).selectOnOpen?0:-1;if(r&&r.selected!=l&&r.selected!=-1){let c=r.options[r.selected].completion;for(let h=0;h<a.length;h++)if(a[h].completion==c){l=h;break}}return new rs(a,Vh(s,l),{pos:e.reduce((c,h)=>h.hasResult()?Math.min(c,h.from):c,1e8),create:vw,above:n.aboveCursor},r?r.timestamp:Date.now(),l,!1)}map(e){return new rs(this.options,this.attrs,{...this.tooltip,pos:e.mapPos(this.tooltip.pos)},this.timestamp,this.selected,this.disabled)}setDisabled(){return new rs(this.options,this.attrs,this.tooltip,this.timestamp,this.selected,!0)}}class Un{constructor(e,i,s){this.active=e,this.id=i,this.open=s}static start(){return new Un(mw,"cm-ac-"+Math.floor(Math.random()*2e6).toString(36),null)}update(e){let{state:i}=e,s=i.facet(Se),n=(s.override||i.languageDataAt("autocomplete",Ni(i)).map(rw)).map(l=>(this.active.find(h=>h.source==l)||new nt(l,this.active.some(h=>h.state!=0)?1:0)).update(e,s));n.length==this.active.length&&n.every((l,c)=>l==this.active[c])&&(n=this.active);let o=this.open,a=e.effects.some(l=>l.is(Vl));o&&e.docChanged&&(o=o.map(e.changes)),e.selection||n.some(l=>l.hasResult()&&e.changes.touchesRange(l.from,l.to))||!uw(n,this.active)||a?o=rs.build(n,i,this.id,o,s,a):o&&o.disabled&&!n.some(l=>l.isPending)&&(o=null),!o&&n.every(l=>!l.isPending)&&n.some(l=>l.hasResult())&&(n=n.map(l=>l.hasResult()?new nt(l.source,0):l));for(let l of e.effects)l.is(ql)&&(o=o&&o.setSelected(l.value,this.id));return n==this.active&&o==this.open?this:new Un(n,this.id,o)}get tooltip(){return this.open?this.open.tooltip:null}get attrs(){return this.open?this.open.attrs:this.active.length?pw:gw}}function uw(t,e){if(t==e)return!0;for(let i=0,s=0;;){for(;i<t.length&&!t[i].hasResult();)i++;for(;s<e.length&&!e[s].hasResult();)s++;let r=i==t.length,n=s==e.length;if(r||n)return r==n;if(t[i++].result!=e[s++].result)return!1}}const pw={"aria-autocomplete":"list"},gw={};function Vh(t,e){let i={"aria-autocomplete":"list","aria-haspopup":"listbox","aria-controls":t};return e>-1&&(i["aria-activedescendant"]=t+"-"+e),i}const mw=[];function gp(t,e){if(t.isUserEvent("input.complete")){let s=t.annotation(pp);if(s&&e.activateOnCompletion(s))return 12}let i=t.isUserEvent("input.type");return i&&e.activateOnTyping?5:i?1:t.isUserEvent("delete.backward")?2:t.selection?8:t.docChanged?16:0}class nt{constructor(e,i,s=!1){this.source=e,this.state=i,this.explicit=s}hasResult(){return!1}get isPending(){return this.state==1}update(e,i){let s=gp(e,i),r=this;(s&8||s&16&&this.touches(e))&&(r=new nt(r.source,0)),s&4&&r.state==0&&(r=new nt(this.source,1)),r=r.updateFor(e,s);for(let n of e.effects)if(n.is(Wn))r=new nt(r.source,1,n.value);else if(n.is(pr))r=new nt(r.source,0);else if(n.is(Vl))for(let o of n.value)o.source==r.source&&(r=o);return r}updateFor(e,i){return this.map(e.changes)}map(e){return this}touches(e){return e.changes.touchesRange(Ni(e.state))}}class fs extends nt{constructor(e,i,s,r,n,o){super(e,3,i),this.limit=s,this.result=r,this.from=n,this.to=o}hasResult(){return!0}updateFor(e,i){var s;if(!(i&3))return this.map(e.changes);let r=this.result;r.map&&!e.changes.empty&&(r=r.map(r,e.changes));let n=e.changes.mapPos(this.from),o=e.changes.mapPos(this.to,1),a=Ni(e.state);if(a>o||!r||i&2&&(Ni(e.startState)==this.from||a<this.limit))return new nt(this.source,i&4?1:0);let l=e.changes.mapPos(this.limit);return bw(r.validFor,e.state,n,o)?new fs(this.source,this.explicit,l,r,n,o):r.update&&(r=r.update(r,n,o,new fp(e.state,a,!1)))?new fs(this.source,this.explicit,l,r,r.from,(s=r.to)!==null&&s!==void 0?s:Ni(e.state)):new nt(this.source,1,this.explicit)}map(e){return e.empty?this:(this.result.map?this.result.map(this.result,e):this.result)?new fs(this.source,this.explicit,e.mapPos(this.limit),this.result,e.mapPos(this.from),e.mapPos(this.to,1)):new nt(this.source,0)}touches(e){return e.changes.touchesRange(this.from,this.to)}}function bw(t,e,i,s){if(!t)return!1;let r=e.sliceDoc(i,s);return typeof t=="function"?t(r,i,s,e):up(t,!0).test(r)}const Vl=H.define({map(t,e){return t.map(i=>i.map(e))}}),He=_e.define({create(){return Un.start()},update(t,e){return t.update(e)},provide:t=>[Pl.from(t,e=>e.tooltip),B.contentAttributes.from(t,e=>e.attrs)]});function Ql(t,e){const i=e.completion.apply||e.completion.label;let s=t.state.field(He).active.find(r=>r.source==e.source);return s instanceof fs?(typeof i=="string"?t.dispatch({...sw(t.state,i,s.from,s.to),annotations:pp.of(e.completion)}):i(t,e.completion,s.from,s.to),!0):!1}const vw=hw(He,Ql);function Zr(t,e="option"){return i=>{let s=i.state.field(He,!1);if(!s||!s.open||s.open.disabled||Date.now()-s.open.timestamp<i.state.facet(Se).interactionDelay)return!1;let r=1,n;e=="page"&&(n=Xf(i,s.open.tooltip))&&(r=Math.max(2,Math.floor(n.dom.offsetHeight/n.dom.querySelector("li").offsetHeight)-1));let{length:o}=s.open.options,a=s.open.selected>-1?s.open.selected+r*(t?1:-1):t?0:o-1;return a<0?a=e=="page"?0:o-1:a>=o&&(a=e=="page"?o-1:0),i.dispatch({effects:ql.of(a)}),!0}}const yw=t=>{let e=t.state.field(He,!1);return t.state.readOnly||!e||!e.open||e.open.selected<0||e.open.disabled||Date.now()-e.open.timestamp<t.state.facet(Se).interactionDelay?!1:Ql(t,e.open.options[e.open.selected])},Xo=t=>t.state.field(He,!1)?(t.dispatch({effects:Wn.of(!0)}),!0):!1,xw=t=>{let e=t.state.field(He,!1);return!e||!e.active.some(i=>i.state!=0)?!1:(t.dispatch({effects:pr.of(null)}),!0)};class ww{constructor(e,i){this.active=e,this.context=i,this.time=Date.now(),this.updates=[],this.done=void 0}}const kw=50,Sw=1e3,Cw=me.fromClass(class{constructor(t){this.view=t,this.debounceUpdate=-1,this.running=[],this.debounceAccept=-1,this.pendingStart=!1,this.composing=0;for(let e of t.state.field(He).active)e.isPending&&this.startQuery(e)}update(t){let e=t.state.field(He),i=t.state.facet(Se);if(!t.selectionSet&&!t.docChanged&&t.startState.field(He)==e)return;let s=t.transactions.some(n=>{let o=gp(n,i);return o&8||(n.selection||n.docChanged)&&!(o&3)});for(let n=0;n<this.running.length;n++){let o=this.running[n];if(s||o.context.abortOnDocChange&&t.docChanged||o.updates.length+t.transactions.length>kw&&Date.now()-o.time>Sw){for(let a of o.context.abortListeners)try{a()}catch(l){Ue(this.view.state,l)}o.context.abortListeners=null,this.running.splice(n--,1)}else o.updates.push(...t.transactions)}this.debounceUpdate>-1&&clearTimeout(this.debounceUpdate),t.transactions.some(n=>n.effects.some(o=>o.is(Wn)))&&(this.pendingStart=!0);let r=this.pendingStart?50:i.activateOnTypingDelay;if(this.debounceUpdate=e.active.some(n=>n.isPending&&!this.running.some(o=>o.active.source==n.source))?setTimeout(()=>this.startUpdate(),r):-1,this.composing!=0)for(let n of t.transactions)n.isUserEvent("input.type")?this.composing=2:this.composing==2&&n.selection&&(this.composing=3)}startUpdate(){this.debounceUpdate=-1,this.pendingStart=!1;let{state:t}=this.view,e=t.field(He);for(let i of e.active)i.isPending&&!this.running.some(s=>s.active.source==i.source)&&this.startQuery(i);this.running.length&&e.open&&e.open.disabled&&(this.debounceAccept=setTimeout(()=>this.accept(),this.view.state.facet(Se).updateSyncTime))}startQuery(t){let{state:e}=this.view,i=Ni(e),s=new fp(e,i,t.explicit,this.view),r=new ww(t,s);this.running.push(r),Promise.resolve(t.source(s)).then(n=>{r.context.aborted||(r.done=n||null,this.scheduleAccept())},n=>{this.view.dispatch({effects:pr.of(null)}),Ue(this.view.state,n)})}scheduleAccept(){this.running.every(t=>t.done!==void 0)?this.accept():this.debounceAccept<0&&(this.debounceAccept=setTimeout(()=>this.accept(),this.view.state.facet(Se).updateSyncTime))}accept(){var t;this.debounceAccept>-1&&clearTimeout(this.debounceAccept),this.debounceAccept=-1;let e=[],i=this.view.state.facet(Se),s=this.view.state.field(He);for(let r=0;r<this.running.length;r++){let n=this.running[r];if(n.done===void 0)continue;if(this.running.splice(r--,1),n.done){let a=Ni(n.updates.length?n.updates[0].startState:this.view.state),l=Math.min(a,n.done.from+(n.active.explicit?0:1)),c=new fs(n.active.source,n.active.explicit,l,n.done,n.done.from,(t=n.done.to)!==null&&t!==void 0?t:a);for(let h of n.updates)c=c.update(h,i);if(c.hasResult()){e.push(c);continue}}let o=s.active.find(a=>a.source==n.active.source);if(o&&o.isPending)if(n.done==null){let a=new nt(n.active.source,0);for(let l of n.updates)a=a.update(l,i);a.isPending||e.push(a)}else this.startQuery(o)}(e.length||s.open&&s.open.disabled)&&this.view.dispatch({effects:Vl.of(e)})}},{eventHandlers:{blur(t){let e=this.view.state.field(He,!1);if(e&&e.tooltip&&this.view.state.facet(Se).closeOnBlur){let i=e.open&&Xf(this.view,e.open.tooltip);(!i||!i.dom.contains(t.relatedTarget))&&setTimeout(()=>this.view.dispatch({effects:pr.of(null)}),10)}},compositionstart(){this.composing=1},compositionend(){this.composing==3&&setTimeout(()=>this.view.dispatch({effects:Wn.of(!1)}),20),this.composing=0}}}),Ow=typeof navigator=="object"&&/Win/.test(navigator.platform),Aw=ji.highest(B.domEventHandlers({keydown(t,e){let i=e.state.field(He,!1);if(!i||!i.open||i.open.disabled||i.open.selected<0||t.key.length>1||t.ctrlKey&&!(Ow&&t.altKey)||t.metaKey)return!1;let s=i.open.options[i.open.selected],r=i.active.find(o=>o.source==s.source),n=s.completion.commitCharacters||r.result.commitCharacters;return n&&n.indexOf(t.key)>-1&&Ql(e,s),!1}})),$w=B.baseTheme({".cm-tooltip.cm-tooltip-autocomplete":{"& > ul":{fontFamily:"monospace",whiteSpace:"nowrap",overflow:"hidden auto",maxWidth_fallback:"700px",maxWidth:"min(700px, 95vw)",minWidth:"250px",maxHeight:"10em",height:"100%",listStyle:"none",margin:0,padding:0,"& > li, & > completion-section":{padding:"1px 3px",lineHeight:1.2},"& > li":{overflowX:"hidden",textOverflow:"ellipsis",cursor:"pointer"},"& > completion-section":{display:"list-item",borderBottom:"1px solid silver",paddingLeft:"0.5em",opacity:.7}}},"&light .cm-tooltip-autocomplete ul li[aria-selected]":{background:"#17c",color:"white"},"&light .cm-tooltip-autocomplete-disabled ul li[aria-selected]":{background:"#777"},"&dark .cm-tooltip-autocomplete ul li[aria-selected]":{background:"#347",color:"white"},"&dark .cm-tooltip-autocomplete-disabled ul li[aria-selected]":{background:"#444"},".cm-completionListIncompleteTop:before, .cm-completionListIncompleteBottom:after":{content:'"···"',opacity:.5,display:"block",textAlign:"center"},".cm-tooltip.cm-completionInfo":{position:"absolute",padding:"3px 9px",width:"max-content",maxWidth:"400px",boxSizing:"border-box",whiteSpace:"pre-line"},".cm-completionInfo.cm-completionInfo-left":{right:"100%"},".cm-completionInfo.cm-completionInfo-right":{left:"100%"},".cm-completionInfo.cm-completionInfo-left-narrow":{right:"30px"},".cm-completionInfo.cm-completionInfo-right-narrow":{left:"30px"},"&light .cm-snippetField":{backgroundColor:"#00000022"},"&dark .cm-snippetField":{backgroundColor:"#ffffff22"},".cm-snippetFieldPosition":{verticalAlign:"text-top",width:0,height:"1.15em",display:"inline-block",margin:"0 -0.7px -.7em",borderLeft:"1.4px dotted #888"},".cm-completionMatchedText":{textDecoration:"underline"},".cm-completionDetail":{marginLeft:"0.5em",fontStyle:"italic"},".cm-completionIcon":{fontSize:"90%",width:".8em",display:"inline-block",textAlign:"center",paddingRight:".6em",opacity:"0.6",boxSizing:"content-box"},".cm-completionIcon-function, .cm-completionIcon-method":{"&:after":{content:"'ƒ'"}},".cm-completionIcon-class":{"&:after":{content:"'○'"}},".cm-completionIcon-interface":{"&:after":{content:"'◌'"}},".cm-completionIcon-variable":{"&:after":{content:"'𝑥'"}},".cm-completionIcon-constant":{"&:after":{content:"'𝐶'"}},".cm-completionIcon-type":{"&:after":{content:"'𝑡'"}},".cm-completionIcon-enum":{"&:after":{content:"'∪'"}},".cm-completionIcon-property":{"&:after":{content:"'□'"}},".cm-completionIcon-keyword":{"&:after":{content:"'🔑︎'"}},".cm-completionIcon-namespace":{"&:after":{content:"'▢'"}},".cm-completionIcon-text":{"&:after":{content:"'abc'",fontSize:"50%",verticalAlign:"middle"}}}),gr={brackets:["(","[","{","'",'"'],before:")]}:;>",stringPrefixes:[]},_i=H.define({map(t,e){let i=e.mapPos(t,-1,Ie.TrackAfter);return i??void 0}}),jl=new class extends ci{};jl.startSide=1;jl.endSide=-1;const mp=_e.define({create(){return V.empty},update(t,e){if(t=t.map(e.changes),e.selection){let i=e.state.doc.lineAt(e.selection.main.head);t=t.update({filter:s=>s>=i.from&&s<=i.to})}for(let i of e.effects)i.is(_i)&&(t=t.update({add:[jl.range(i.value,i.value+1)]}));return t}});function Pw(){return[Mw,mp]}const Jo="()[]{}<>«»»«［］｛｝";function bp(t){for(let e=0;e<Jo.length;e+=2)if(Jo.charCodeAt(e)==t)return Jo.charAt(e+1);return hl(t<128?t:t+1)}function vp(t,e){return t.languageDataAt("closeBrackets",e)[0]||gr}const Tw=typeof navigator=="object"&&/Android\b/.test(navigator.userAgent),Mw=B.inputHandler.of((t,e,i,s)=>{if((Tw?t.composing:t.compositionStarted)||t.state.readOnly)return!1;let r=t.state.selection.main;if(s.length>2||s.length==2&&$t(ze(s,0))==1||e!=r.from||i!=r.to)return!1;let n=_w(t.state,s);return n?(t.dispatch(n),!0):!1}),Ew=({state:t,dispatch:e})=>{if(t.readOnly)return!1;let s=vp(t,t.selection.main.head).brackets||gr.brackets,r=null,n=t.changeByRange(o=>{if(o.empty){let a=Bw(t.doc,o.head);for(let l of s)if(l==a&&fo(t.doc,o.head)==bp(ze(l,0)))return{changes:{from:o.head-l.length,to:o.head+l.length},range:C.cursor(o.head-l.length)}}return{range:r=o}});return r||e(t.update(n,{scrollIntoView:!0,userEvent:"delete.backward"})),!r},Dw=[{key:"Backspace",run:Ew}];function _w(t,e){let i=vp(t,t.selection.main.head),s=i.brackets||gr.brackets;for(let r of s){let n=bp(ze(r,0));if(e==r)return n==r?Iw(t,r,s.indexOf(r+r+r)>-1,i):Rw(t,r,n,i.before||gr.before);if(e==n&&yp(t,t.selection.main.from))return Lw(t,r,n)}return null}function yp(t,e){let i=!1;return t.field(mp).between(0,t.doc.length,s=>{s==e&&(i=!0)}),i}function fo(t,e){let i=t.sliceString(e,e+2);return i.slice(0,$t(ze(i,0)))}function Bw(t,e){let i=t.sliceString(e-2,e);return $t(ze(i,0))==i.length?i:i.slice(1)}function Rw(t,e,i,s){let r=null,n=t.changeByRange(o=>{if(!o.empty)return{changes:[{insert:e,from:o.from},{insert:i,from:o.to}],effects:_i.of(o.to+e.length),range:C.range(o.anchor+e.length,o.head+e.length)};let a=fo(t.doc,o.head);return!a||/\s/.test(a)||s.indexOf(a)>-1?{changes:{insert:e+i,from:o.head},effects:_i.of(o.head+e.length),range:C.cursor(o.head+e.length)}:{range:r=o}});return r?null:t.update(n,{scrollIntoView:!0,userEvent:"input.type"})}function Lw(t,e,i){let s=null,r=t.changeByRange(n=>n.empty&&fo(t.doc,n.head)==i?{changes:{from:n.head,to:n.head+i.length,insert:i},range:C.cursor(n.head+i.length)}:s={range:n});return s?null:t.update(r,{scrollIntoView:!0,userEvent:"input.type"})}function Iw(t,e,i,s){let r=s.stringPrefixes||gr.stringPrefixes,n=null,o=t.changeByRange(a=>{if(!a.empty)return{changes:[{insert:e,from:a.from},{insert:e,from:a.to}],effects:_i.of(a.to+e.length),range:C.range(a.anchor+e.length,a.head+e.length)};let l=a.head,c=fo(t.doc,l),h;if(c==e){if(Qh(t,l))return{changes:{insert:e+e,from:l},effects:_i.of(l+e.length),range:C.cursor(l+e.length)};if(yp(t,l)){let f=i&&t.sliceDoc(l,l+e.length*3)==e+e+e?e+e+e:e;return{changes:{from:l,to:l+f.length,insert:f},range:C.cursor(l+f.length)}}}else{if(i&&t.sliceDoc(l-2*e.length,l)==e+e&&(h=jh(t,l-2*e.length,r))>-1&&Qh(t,h))return{changes:{insert:e+e+e+e,from:l},effects:_i.of(l+e.length),range:C.cursor(l+e.length)};if(t.charCategorizer(l)(c)!=ce.Word&&jh(t,l,r)>-1&&!Fw(t,l,e,r))return{changes:{insert:e+e,from:l},effects:_i.of(l+e.length),range:C.cursor(l+e.length)}}return{range:n=a}});return n?null:t.update(o,{scrollIntoView:!0,userEvent:"input.type"})}function Qh(t,e){let i=De(t).resolveInner(e+1);return i.parent&&i.from==e}function Fw(t,e,i,s){let r=De(t).resolveInner(e,-1),n=s.reduce((o,a)=>Math.max(o,a.length),0);for(let o=0;o<5;o++){let a=t.sliceDoc(r.from,Math.min(r.to,r.from+i.length+n)),l=a.indexOf(i);if(!l||l>-1&&s.indexOf(a.slice(0,l))>-1){let h=r.firstChild;for(;h&&h.from==r.from&&h.to-h.from>i.length+l;){if(t.sliceDoc(h.to-i.length,h.to)==i)return!1;h=h.firstChild}return!0}let c=r.to==e&&r.parent;if(!c)break;r=c}return!1}function jh(t,e,i){let s=t.charCategorizer(e);if(s(t.sliceDoc(e-1,e))!=ce.Word)return e;for(let r of i){let n=e-r.length;if(t.sliceDoc(n,e)==r&&s(t.sliceDoc(n-1,n))!=ce.Word)return n}return-1}function Nw(t={}){return[Aw,He,Se.of(t),Cw,zw,$w]}const xp=[{key:"Ctrl-Space",run:Xo},{mac:"Alt-`",run:Xo},{mac:"Alt-i",run:Xo},{key:"Escape",run:xw},{key:"ArrowDown",run:Zr(!0)},{key:"ArrowUp",run:Zr(!1)},{key:"PageDown",run:Zr(!0,"page")},{key:"PageUp",run:Zr(!1,"page")},{key:"Enter",run:yw}],zw=ji.highest(Al.computeN([Se],t=>t.facet(Se).defaultKeymap?[xp]:[]));class Kh{constructor(e,i,s){this.from=e,this.to=i,this.diagnostic=s}}class Pi{constructor(e,i,s){this.diagnostics=e,this.panel=i,this.selected=s}static init(e,i,s){let r=s.facet(mr).markerFilter;r&&(e=r(e,s));let n=e.slice().sort((u,p)=>u.from-p.from||u.to-p.to),o=new jt,a=[],l=0,c=s.doc.iter(),h=0,d=s.doc.length;for(let u=0;;){let p=u==n.length?null:n[u];if(!p&&!a.length)break;let m,b;if(a.length)m=l,b=a.reduce((O,R)=>Math.min(O,R.to),p&&p.from>m?p.from:1e8);else{if(m=p.from,m>d)break;b=p.to,a.push(p),u++}for(;u<n.length;){let O=n[u];if(O.from==m&&(O.to>O.from||O.to==m))a.push(O),u++,b=Math.min(O.to,b);else{b=Math.min(O.from,b);break}}b=Math.min(b,d);let x=!1;if(a.some(O=>O.from==m&&(O.to==b||b==d))&&(x=m==b,!x&&b-m<10)){let O=m-(h+c.value.length);O>0&&(c.next(O),h=m);for(let R=m;;){if(R>=b){x=!0;break}if(!c.lineBreak&&h+c.value.length>R)break;R=h+c.value.length,h+=c.value.length,c.next()}}let k=Zw(a);if(x)o.add(m,m,N.widget({widget:new Xw(k),diagnostics:a.slice()}));else{let O=a.reduce((R,A)=>A.markClass?R+" "+A.markClass:R,"");o.add(m,b,N.mark({class:"cm-lintRange cm-lintRange-"+k+O,diagnostics:a.slice(),inclusiveEnd:a.some(R=>R.to>b)}))}if(l=b,l==d)break;for(let O=0;O<a.length;O++)a[O].to<=l&&a.splice(O--,1)}let f=o.finish();return new Pi(f,i,gi(f))}}function gi(t,e=null,i=0){let s=null;return t.between(i,1e9,(r,n,{spec:o})=>{if(!(e&&o.diagnostics.indexOf(e)<0))if(!s)s=new Kh(r,n,e||o.diagnostics[0]);else{if(o.diagnostics.indexOf(s.diagnostic)<0)return!1;s=new Kh(s.from,n,s.diagnostic)}}),s}function Hw(t,e){let i=e.pos,s=e.end||i,r=t.state.facet(mr).hideOn(t,i,s);if(r!=null)return r;let n=t.startState.doc.lineAt(e.pos);return!!(t.effects.some(o=>o.is(wp))||t.changes.touchesRange(n.from,Math.max(n.to,s)))}function Ww(t,e){return t.field(Ge,!1)?e:e.concat(H.appendConfig.of(e1))}const wp=H.define(),Kl=H.define(),kp=H.define(),Ge=_e.define({create(){return new Pi(N.none,null,null)},update(t,e){if(e.docChanged&&t.diagnostics.size){let i=t.diagnostics.map(e.changes),s=null,r=t.panel;if(t.selected){let n=e.changes.mapPos(t.selected.from,1);s=gi(i,t.selected.diagnostic,n)||gi(i,null,n)}!i.size&&r&&e.state.facet(mr).autoPanel&&(r=null),t=new Pi(i,r,s)}for(let i of e.effects)if(i.is(wp)){let s=e.state.facet(mr).autoPanel?i.value.length?br.open:null:t.panel;t=Pi.init(i.value,s,e.state)}else i.is(Kl)?t=new Pi(t.diagnostics,i.value?br.open:null,t.selected):i.is(kp)&&(t=new Pi(t.diagnostics,t.panel,i.value));return t},provide:t=>[cr.from(t,e=>e.panel),B.decorations.from(t,e=>e.diagnostics)]}),Uw=N.mark({class:"cm-lintRange cm-lintRange-active"});function qw(t,e,i){let{diagnostics:s}=t.state.field(Ge),r,n=-1,o=-1;s.between(e-(i<0?1:0),e+(i>0?1:0),(l,c,{spec:h})=>{if(e>=l&&e<=c&&(l==c||(e>l||i>0)&&(e<c||i<0)))return r=h.diagnostics,n=l,o=c,!1});let a=t.state.facet(mr).tooltipFilter;return r&&a&&(r=a(r,t.state)),r?{pos:n,end:o,above:t.state.doc.lineAt(n).to<o,create(){return{dom:Vw(t,r)}}}:null}function Vw(t,e){return Z("ul",{class:"cm-tooltip-lint"},e.map(i=>Cp(t,i,!1)))}const Qw=t=>{let e=t.state.field(Ge,!1);(!e||!e.panel)&&t.dispatch({effects:Ww(t.state,[Kl.of(!0)])});let i=Tl(t,br.open);return i&&i.dom.querySelector(".cm-panel-lint ul").focus(),!0},Xh=t=>{let e=t.state.field(Ge,!1);return!e||!e.panel?!1:(t.dispatch({effects:Kl.of(!1)}),!0)},jw=t=>{let e=t.state.field(Ge,!1);if(!e)return!1;let i=t.state.selection.main,s=gi(e.diagnostics,null,i.to+1);return!s&&(s=gi(e.diagnostics,null,0),!s||s.from==i.from&&s.to==i.to)?!1:(t.dispatch({selection:{anchor:s.from,head:s.to},scrollIntoView:!0}),!0)},Kw=[{key:"Mod-Shift-m",run:Qw,preventDefault:!0},{key:"F8",run:jw}],mr=_.define({combine(t){return{sources:t.map(e=>e.source).filter(e=>e!=null),...Ft(t.map(e=>e.config),{delay:750,markerFilter:null,tooltipFilter:null,needsRefresh:null,hideOn:()=>null},{delay:Math.max,markerFilter:Jh,tooltipFilter:Jh,needsRefresh:(e,i)=>e?i?s=>e(s)||i(s):e:i,hideOn:(e,i)=>e?i?(s,r,n)=>e(s,r,n)||i(s,r,n):e:i,autoPanel:(e,i)=>e||i})}}});function Jh(t,e){return t?e?(i,s)=>e(t(i,s),s):t:e}function Sp(t){let e=[];if(t)e:for(let{name:i}of t){for(let s=0;s<i.length;s++){let r=i[s];if(/[a-zA-Z]/.test(r)&&!e.some(n=>n.toLowerCase()==r.toLowerCase())){e.push(r);continue e}}e.push("")}return e}function Cp(t,e,i){var s;let r=i?Sp(e.actions):[];return Z("li",{class:"cm-diagnostic cm-diagnostic-"+e.severity},Z("span",{class:"cm-diagnosticText"},e.renderMessage?e.renderMessage(t):e.message),(s=e.actions)===null||s===void 0?void 0:s.map((n,o)=>{let a=!1,l=u=>{if(u.preventDefault(),a)return;a=!0;let p=gi(t.state.field(Ge).diagnostics,e);p&&n.apply(t,p.from,p.to)},{name:c}=n,h=r[o]?c.indexOf(r[o]):-1,d=h<0?c:[c.slice(0,h),Z("u",c.slice(h,h+1)),c.slice(h+1)],f=n.markClass?" "+n.markClass:"";return Z("button",{type:"button",class:"cm-diagnosticAction"+f,onclick:l,onmousedown:l,"aria-label":` Action: ${c}${h<0?"":` (access key "${r[o]})"`}.`},d)}),e.source&&Z("div",{class:"cm-diagnosticSource"},e.source))}class Xw extends Gt{constructor(e){super(),this.sev=e}eq(e){return e.sev==this.sev}toDOM(){return Z("span",{class:"cm-lintPoint cm-lintPoint-"+this.sev})}}class Yh{constructor(e,i){this.diagnostic=i,this.id="item_"+Math.floor(Math.random()*4294967295).toString(16),this.dom=Cp(e,i,!0),this.dom.id=this.id,this.dom.setAttribute("role","option")}}class br{constructor(e){this.view=e,this.items=[];let i=r=>{if(!(r.ctrlKey||r.altKey||r.metaKey)){if(r.keyCode==27)Xh(this.view),this.view.focus();else if(r.keyCode==38||r.keyCode==33)this.moveSelection((this.selectedIndex-1+this.items.length)%this.items.length);else if(r.keyCode==40||r.keyCode==34)this.moveSelection((this.selectedIndex+1)%this.items.length);else if(r.keyCode==36)this.moveSelection(0);else if(r.keyCode==35)this.moveSelection(this.items.length-1);else if(r.keyCode==13)this.view.focus();else if(r.keyCode>=65&&r.keyCode<=90&&this.selectedIndex>=0){let{diagnostic:n}=this.items[this.selectedIndex],o=Sp(n.actions);for(let a=0;a<o.length;a++)if(o[a].toUpperCase().charCodeAt(0)==r.keyCode){let l=gi(this.view.state.field(Ge).diagnostics,n);l&&n.actions[a].apply(e,l.from,l.to)}}else return;r.preventDefault()}},s=r=>{for(let n=0;n<this.items.length;n++)this.items[n].dom.contains(r.target)&&this.moveSelection(n)};this.list=Z("ul",{tabIndex:0,role:"listbox","aria-label":this.view.state.phrase("Diagnostics"),onkeydown:i,onclick:s}),this.dom=Z("div",{class:"cm-panel-lint"},this.list,Z("button",{type:"button",name:"close","aria-label":this.view.state.phrase("close"),onclick:()=>Xh(this.view)},"×")),this.update()}get selectedIndex(){let e=this.view.state.field(Ge).selected;if(!e)return-1;for(let i=0;i<this.items.length;i++)if(this.items[i].diagnostic==e.diagnostic)return i;return-1}update(){let{diagnostics:e,selected:i}=this.view.state.field(Ge),s=0,r=!1,n=null,o=new Set;for(e.between(0,this.view.state.doc.length,(a,l,{spec:c})=>{for(let h of c.diagnostics){if(o.has(h))continue;o.add(h);let d=-1,f;for(let u=s;u<this.items.length;u++)if(this.items[u].diagnostic==h){d=u;break}d<0?(f=new Yh(this.view,h),this.items.splice(s,0,f),r=!0):(f=this.items[d],d>s&&(this.items.splice(s,d-s),r=!0)),i&&f.diagnostic==i.diagnostic?f.dom.hasAttribute("aria-selected")||(f.dom.setAttribute("aria-selected","true"),n=f):f.dom.hasAttribute("aria-selected")&&f.dom.removeAttribute("aria-selected"),s++}});s<this.items.length&&!(this.items.length==1&&this.items[0].diagnostic.from<0);)r=!0,this.items.pop();this.items.length==0&&(this.items.push(new Yh(this.view,{from:-1,to:-1,severity:"info",message:this.view.state.phrase("No diagnostics")})),r=!0),n?(this.list.setAttribute("aria-activedescendant",n.id),this.view.requestMeasure({key:this,read:()=>({sel:n.dom.getBoundingClientRect(),panel:this.list.getBoundingClientRect()}),write:({sel:a,panel:l})=>{let c=l.height/this.list.offsetHeight;a.top<l.top?this.list.scrollTop-=(l.top-a.top)/c:a.bottom>l.bottom&&(this.list.scrollTop+=(a.bottom-l.bottom)/c)}})):this.selectedIndex<0&&this.list.removeAttribute("aria-activedescendant"),r&&this.sync()}sync(){let e=this.list.firstChild;function i(){let s=e;e=s.nextSibling,s.remove()}for(let s of this.items)if(s.dom.parentNode==this.list){for(;e!=s.dom;)i();e=s.dom.nextSibling}else this.list.insertBefore(s.dom,e);for(;e;)i()}moveSelection(e){if(this.selectedIndex<0)return;let i=this.view.state.field(Ge),s=gi(i.diagnostics,this.items[e].diagnostic);s&&this.view.dispatch({selection:{anchor:s.from,head:s.to},scrollIntoView:!0,effects:kp.of(s)})}static open(e){return new br(e)}}function Jw(t,e='viewBox="0 0 40 40"'){return`url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ${e}>${encodeURIComponent(t)}</svg>')`}function en(t){return Jw(`<path d="m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0" stroke="${t}" fill="none" stroke-width=".7"/>`,'width="6" height="3"')}const Yw=B.baseTheme({".cm-diagnostic":{padding:"3px 6px 3px 8px",marginLeft:"-1px",display:"block",whiteSpace:"pre-wrap"},".cm-diagnostic-error":{borderLeft:"5px solid #d11"},".cm-diagnostic-warning":{borderLeft:"5px solid orange"},".cm-diagnostic-info":{borderLeft:"5px solid #999"},".cm-diagnostic-hint":{borderLeft:"5px solid #66d"},".cm-diagnosticAction":{font:"inherit",border:"none",padding:"2px 4px",backgroundColor:"#444",color:"white",borderRadius:"3px",marginLeft:"8px",cursor:"pointer"},".cm-diagnosticSource":{fontSize:"70%",opacity:.7},".cm-lintRange":{backgroundPosition:"left bottom",backgroundRepeat:"repeat-x",paddingBottom:"0.7px"},".cm-lintRange-error":{backgroundImage:en("#d11")},".cm-lintRange-warning":{backgroundImage:en("orange")},".cm-lintRange-info":{backgroundImage:en("#999")},".cm-lintRange-hint":{backgroundImage:en("#66d")},".cm-lintRange-active":{backgroundColor:"#ffdd9980"},".cm-tooltip-lint":{padding:0,margin:0},".cm-lintPoint":{position:"relative","&:after":{content:'""',position:"absolute",bottom:0,left:"-2px",borderLeft:"3px solid transparent",borderRight:"3px solid transparent",borderBottom:"4px solid #d11"}},".cm-lintPoint-warning":{"&:after":{borderBottomColor:"orange"}},".cm-lintPoint-info":{"&:after":{borderBottomColor:"#999"}},".cm-lintPoint-hint":{"&:after":{borderBottomColor:"#66d"}},".cm-panel.cm-panel-lint":{position:"relative","& ul":{maxHeight:"100px",overflowY:"auto","& [aria-selected]":{backgroundColor:"#ddd","& u":{textDecoration:"underline"}},"&:focus [aria-selected]":{background_fallback:"#bdf",backgroundColor:"Highlight",color_fallback:"white",color:"HighlightText"},"& u":{textDecoration:"none"},padding:0,margin:0},"& [name=close]":{position:"absolute",top:"0",right:"2px",background:"inherit",border:"none",font:"inherit",padding:0,margin:0}},"&dark .cm-lintRange-active":{backgroundColor:"#86714a80"},"&dark .cm-panel.cm-panel-lint ul":{"& [aria-selected]":{backgroundColor:"#2e343e"}}});function Gw(t){return t=="error"?4:t=="warning"?3:t=="info"?2:1}function Zw(t){let e="hint",i=1;for(let s of t){let r=Gw(s.severity);r>i&&(i=r,e=s.severity)}return e}const e1=[Ge,B.decorations.compute([Ge],t=>{let{selected:e,panel:i}=t.field(Ge);return!e||!i||e.from==e.to?N.none:N.set([Uw.range(e.from,e.to)])}),U0(qw,{hideOn:Hw}),Yw],t1=[iv(),nv(),x0(),wy(),Kv(),c0(),p0(),K.allowMultipleSelections.of(!0),Bv(),ku(Gv,{fallback:!0}),ny(),Pw(),Nw(),D0(),R0(),A0(),Mx(),Al.of([...Dw,...Ox,...Yx,...My,...qv,...xp,...Kw])];var Gh={};class qn{constructor(e,i,s,r,n,o,a,l,c,h=0,d){this.p=e,this.stack=i,this.state=s,this.reducePos=r,this.pos=n,this.score=o,this.buffer=a,this.bufferBase=l,this.curContext=c,this.lookAhead=h,this.parent=d}toString(){return`[${this.stack.filter((e,i)=>i%3==0).concat(this.state)}]@${this.pos}${this.score?"!"+this.score:""}`}static start(e,i,s=0){let r=e.parser.context;return new qn(e,[],i,s,s,0,[],0,r?new Zh(r,r.start):null,0,null)}get context(){return this.curContext?this.curContext.context:null}pushState(e,i){this.stack.push(this.state,i,this.bufferBase+this.buffer.length),this.state=e}reduce(e){var i;let s=e>>19,r=e&65535,{parser:n}=this.p,o=this.reducePos<this.pos-25&&this.setLookAhead(this.pos),a=n.dynamicPrecedence(r);if(a&&(this.score+=a),s==0){r<n.minRepeatTerm&&this.reducePos<this.pos&&(this.reducePos=this.pos),this.pushState(n.getGoto(this.state,r,!0),this.reducePos),r<n.minRepeatTerm&&this.storeNode(r,this.reducePos,this.reducePos,o?8:4,!0),this.reduceContext(r,this.reducePos);return}let l=this.stack.length-(s-1)*3-(e&262144?6:0),c=l?this.stack[l-2]:this.p.ranges[0].from;r<n.minRepeatTerm&&c==this.reducePos&&this.reducePos<this.pos&&(this.reducePos=this.pos);let h=this.reducePos-c;h>=2e3&&!(!((i=this.p.parser.nodeSet.types[r])===null||i===void 0)&&i.isAnonymous)&&(c==this.p.lastBigReductionStart?(this.p.bigReductionCount++,this.p.lastBigReductionSize=h):this.p.lastBigReductionSize<h&&(this.p.bigReductionCount=1,this.p.lastBigReductionStart=c,this.p.lastBigReductionSize=h));let d=l?this.stack[l-1]:0,f=this.bufferBase+this.buffer.length-d;if(r<n.minRepeatTerm||e&131072){let u=n.stateFlag(this.state,1)?this.pos:this.reducePos;this.storeNode(r,c,u,f+4,!0)}if(e&262144)this.state=this.stack[l];else{let u=this.stack[l-3];this.state=n.getGoto(u,r,!0)}for(;this.stack.length>l;)this.stack.pop();this.reduceContext(r,c)}storeNode(e,i,s,r=4,n=!1){if(e==0&&(!this.stack.length||this.stack[this.stack.length-1]<this.buffer.length+this.bufferBase)){let o=this.buffer.length;if(o>0&&this.buffer[o-4]==0&&this.buffer[o-1]>-1){if(i==s)return;if(this.buffer[o-2]>=i){this.buffer[o-2]=s;return}}}if(!n||this.pos==s)this.buffer.push(e,i,s,r);else{let o=this.buffer.length;if(o>0&&(this.buffer[o-4]!=0||this.buffer[o-1]<0)){let a=!1;for(let l=o;l>0&&this.buffer[l-2]>s;l-=4)if(this.buffer[l-1]>=0){a=!0;break}if(a)for(;o>0&&this.buffer[o-2]>s;)this.buffer[o]=this.buffer[o-4],this.buffer[o+1]=this.buffer[o-3],this.buffer[o+2]=this.buffer[o-2],this.buffer[o+3]=this.buffer[o-1],o-=4,r>4&&(r-=4)}this.buffer[o]=e,this.buffer[o+1]=i,this.buffer[o+2]=s,this.buffer[o+3]=r}}shift(e,i,s,r){if(e&131072)this.pushState(e&65535,this.pos);else if((e&262144)==0){let n=e,{parser:o}=this.p;this.pos=r;let a=o.stateFlag(n,1);!a&&(r>s||i<=o.maxNode)&&(this.reducePos=r),this.pushState(n,a?s:Math.min(s,this.reducePos)),this.shiftContext(i,s),i<=o.maxNode&&this.buffer.push(i,s,r,4)}else this.pos=r,this.shiftContext(i,s),i<=this.p.parser.maxNode&&this.buffer.push(i,s,r,4)}apply(e,i,s,r){e&65536?this.reduce(e):this.shift(e,i,s,r)}useNode(e,i){let s=this.p.reused.length-1;(s<0||this.p.reused[s]!=e)&&(this.p.reused.push(e),s++);let r=this.pos;this.reducePos=this.pos=r+e.length,this.pushState(i,r),this.buffer.push(s,r,this.reducePos,-1),this.curContext&&this.updateContext(this.curContext.tracker.reuse(this.curContext.context,e,this,this.p.stream.reset(this.pos-e.length)))}split(){let e=this,i=e.buffer.length;for(i&&e.buffer[i-4]==0&&(i-=4);i>0&&e.buffer[i-2]>e.reducePos;)i-=4;let s=e.buffer.slice(i),r=e.bufferBase+i;for(;e&&r==e.bufferBase;)e=e.parent;return new qn(this.p,this.stack.slice(),this.state,this.reducePos,this.pos,this.score,s,r,this.curContext,this.lookAhead,e)}recoverByDelete(e,i){let s=e<=this.p.parser.maxNode;s&&this.storeNode(e,this.pos,i,4),this.storeNode(0,this.pos,i,s?8:4),this.pos=this.reducePos=i,this.score-=190}canShift(e){for(let i=new i1(this);;){let s=this.p.parser.stateSlot(i.state,4)||this.p.parser.hasAction(i.state,e);if(s==0)return!1;if((s&65536)==0)return!0;i.reduce(s)}}recoverByInsert(e){if(this.stack.length>=300)return[];let i=this.p.parser.nextStates(this.state);if(i.length>8||this.stack.length>=120){let r=[];for(let n=0,o;n<i.length;n+=2)(o=i[n+1])!=this.state&&this.p.parser.hasAction(o,e)&&r.push(i[n],o);if(this.stack.length<120)for(let n=0;r.length<8&&n<i.length;n+=2){let o=i[n+1];r.some((a,l)=>l&1&&a==o)||r.push(i[n],o)}i=r}let s=[];for(let r=0;r<i.length&&s.length<4;r+=2){let n=i[r+1];if(n==this.state)continue;let o=this.split();o.pushState(n,this.pos),o.storeNode(0,o.pos,o.pos,4,!0),o.shiftContext(i[r],this.pos),o.reducePos=this.pos,o.score-=200,s.push(o)}return s}forceReduce(){let{parser:e}=this.p,i=e.stateSlot(this.state,5);if((i&65536)==0)return!1;if(!e.validAction(this.state,i)){let s=i>>19,r=i&65535,n=this.stack.length-s*3;if(n<0||e.getGoto(this.stack[n],r,!1)<0){let o=this.findForcedReduction();if(o==null)return!1;i=o}this.storeNode(0,this.pos,this.pos,4,!0),this.score-=100}return this.reducePos=this.pos,this.reduce(i),!0}findForcedReduction(){let{parser:e}=this.p,i=[],s=(r,n)=>{if(!i.includes(r))return i.push(r),e.allActions(r,o=>{if(!(o&393216))if(o&65536){let a=(o>>19)-n;if(a>1){let l=o&65535,c=this.stack.length-a*3;if(c>=0&&e.getGoto(this.stack[c],l,!1)>=0)return a<<19|65536|l}}else{let a=s(o,n+1);if(a!=null)return a}})};return s(this.state,0)}forceAll(){for(;!this.p.parser.stateFlag(this.state,2);)if(!this.forceReduce()){this.storeNode(0,this.pos,this.pos,4,!0);break}return this}get deadEnd(){if(this.stack.length!=3)return!1;let{parser:e}=this.p;return e.data[e.stateSlot(this.state,1)]==65535&&!e.stateSlot(this.state,4)}restart(){this.storeNode(0,this.pos,this.pos,4,!0),this.state=this.stack[0],this.stack.length=0}sameState(e){if(this.state!=e.state||this.stack.length!=e.stack.length)return!1;for(let i=0;i<this.stack.length;i+=3)if(this.stack[i]!=e.stack[i])return!1;return!0}get parser(){return this.p.parser}dialectEnabled(e){return this.p.parser.dialect.flags[e]}shiftContext(e,i){this.curContext&&this.updateContext(this.curContext.tracker.shift(this.curContext.context,e,this,this.p.stream.reset(i)))}reduceContext(e,i){this.curContext&&this.updateContext(this.curContext.tracker.reduce(this.curContext.context,e,this,this.p.stream.reset(i)))}emitContext(){let e=this.buffer.length-1;(e<0||this.buffer[e]!=-3)&&this.buffer.push(this.curContext.hash,this.pos,this.pos,-3)}emitLookAhead(){let e=this.buffer.length-1;(e<0||this.buffer[e]!=-4)&&this.buffer.push(this.lookAhead,this.pos,this.pos,-4)}updateContext(e){if(e!=this.curContext.context){let i=new Zh(this.curContext.tracker,e);i.hash!=this.curContext.hash&&this.emitContext(),this.curContext=i}}setLookAhead(e){return e<=this.lookAhead?!1:(this.emitLookAhead(),this.lookAhead=e,!0)}close(){this.curContext&&this.curContext.tracker.strict&&this.emitContext(),this.lookAhead>0&&this.emitLookAhead()}}class Zh{constructor(e,i){this.tracker=e,this.context=i,this.hash=e.strict?e.hash(i):0}}class i1{constructor(e){this.start=e,this.state=e.state,this.stack=e.stack,this.base=this.stack.length}reduce(e){let i=e&65535,s=e>>19;s==0?(this.stack==this.start.stack&&(this.stack=this.stack.slice()),this.stack.push(this.state,0,0),this.base+=3):this.base-=(s-1)*3;let r=this.start.p.parser.getGoto(this.stack[this.base-3],i,!0);this.state=r}}class Vn{constructor(e,i,s){this.stack=e,this.pos=i,this.index=s,this.buffer=e.buffer,this.index==0&&this.maybeNext()}static create(e,i=e.bufferBase+e.buffer.length){return new Vn(e,i,i-e.bufferBase)}maybeNext(){let e=this.stack.parent;e!=null&&(this.index=this.stack.bufferBase-e.bufferBase,this.stack=e,this.buffer=e.buffer)}get id(){return this.buffer[this.index-4]}get start(){return this.buffer[this.index-3]}get end(){return this.buffer[this.index-2]}get size(){return this.buffer[this.index-1]}next(){this.index-=4,this.pos-=4,this.index==0&&this.maybeNext()}fork(){return new Vn(this.stack,this.pos,this.index)}}function tn(t,e=Uint16Array){if(typeof t!="string")return t;let i=null;for(let s=0,r=0;s<t.length;){let n=0;for(;;){let o=t.charCodeAt(s++),a=!1;if(o==126){n=65535;break}o>=92&&o--,o>=34&&o--;let l=o-32;if(l>=46&&(l-=46,a=!0),n+=l,a)break;n*=46}i?i[r++]=n:i=new e(n)}return i}class fn{constructor(){this.start=-1,this.value=-1,this.end=-1,this.extended=-1,this.lookAhead=0,this.mask=0,this.context=0}}const ed=new fn;class s1{constructor(e,i){this.input=e,this.ranges=i,this.chunk="",this.chunkOff=0,this.chunk2="",this.chunk2Pos=0,this.next=-1,this.token=ed,this.rangeIndex=0,this.pos=this.chunkPos=i[0].from,this.range=i[0],this.end=i[i.length-1].to,this.readNext()}resolveOffset(e,i){let s=this.range,r=this.rangeIndex,n=this.pos+e;for(;n<s.from;){if(!r)return null;let o=this.ranges[--r];n-=s.from-o.to,s=o}for(;i<0?n>s.to:n>=s.to;){if(r==this.ranges.length-1)return null;let o=this.ranges[++r];n+=o.from-s.to,s=o}return n}clipPos(e){if(e>=this.range.from&&e<this.range.to)return e;for(let i of this.ranges)if(i.to>e)return Math.max(e,i.from);return this.end}peek(e){let i=this.chunkOff+e,s,r;if(i>=0&&i<this.chunk.length)s=this.pos+e,r=this.chunk.charCodeAt(i);else{let n=this.resolveOffset(e,1);if(n==null)return-1;if(s=n,s>=this.chunk2Pos&&s<this.chunk2Pos+this.chunk2.length)r=this.chunk2.charCodeAt(s-this.chunk2Pos);else{let o=this.rangeIndex,a=this.range;for(;a.to<=s;)a=this.ranges[++o];this.chunk2=this.input.chunk(this.chunk2Pos=s),s+this.chunk2.length>a.to&&(this.chunk2=this.chunk2.slice(0,a.to-s)),r=this.chunk2.charCodeAt(0)}}return s>=this.token.lookAhead&&(this.token.lookAhead=s+1),r}acceptToken(e,i=0){let s=i?this.resolveOffset(i,-1):this.pos;if(s==null||s<this.token.start)throw new RangeError("Token end out of bounds");this.token.value=e,this.token.end=s}acceptTokenTo(e,i){this.token.value=e,this.token.end=i}getChunk(){if(this.pos>=this.chunk2Pos&&this.pos<this.chunk2Pos+this.chunk2.length){let{chunk:e,chunkPos:i}=this;this.chunk=this.chunk2,this.chunkPos=this.chunk2Pos,this.chunk2=e,this.chunk2Pos=i,this.chunkOff=this.pos-this.chunkPos}else{this.chunk2=this.chunk,this.chunk2Pos=this.chunkPos;let e=this.input.chunk(this.pos),i=this.pos+e.length;this.chunk=i>this.range.to?e.slice(0,this.range.to-this.pos):e,this.chunkPos=this.pos,this.chunkOff=0}}readNext(){return this.chunkOff>=this.chunk.length&&(this.getChunk(),this.chunkOff==this.chunk.length)?this.next=-1:this.next=this.chunk.charCodeAt(this.chunkOff)}advance(e=1){for(this.chunkOff+=e;this.pos+e>=this.range.to;){if(this.rangeIndex==this.ranges.length-1)return this.setDone();e-=this.range.to-this.pos,this.range=this.ranges[++this.rangeIndex],this.pos=this.range.from}return this.pos+=e,this.pos>=this.token.lookAhead&&(this.token.lookAhead=this.pos+1),this.readNext()}setDone(){return this.pos=this.chunkPos=this.end,this.range=this.ranges[this.rangeIndex=this.ranges.length-1],this.chunk="",this.next=-1}reset(e,i){if(i?(this.token=i,i.start=e,i.lookAhead=e+1,i.value=i.extended=-1):this.token=ed,this.pos!=e){if(this.pos=e,e==this.end)return this.setDone(),this;for(;e<this.range.from;)this.range=this.ranges[--this.rangeIndex];for(;e>=this.range.to;)this.range=this.ranges[++this.rangeIndex];e>=this.chunkPos&&e<this.chunkPos+this.chunk.length?this.chunkOff=e-this.chunkPos:(this.chunk="",this.chunkOff=0),this.readNext()}return this}read(e,i){if(e>=this.chunkPos&&i<=this.chunkPos+this.chunk.length)return this.chunk.slice(e-this.chunkPos,i-this.chunkPos);if(e>=this.chunk2Pos&&i<=this.chunk2Pos+this.chunk2.length)return this.chunk2.slice(e-this.chunk2Pos,i-this.chunk2Pos);if(e>=this.range.from&&i<=this.range.to)return this.input.read(e,i);let s="";for(let r of this.ranges){if(r.from>=i)break;r.to>e&&(s+=this.input.read(Math.max(r.from,e),Math.min(r.to,i)))}return s}}class us{constructor(e,i){this.data=e,this.id=i}token(e,i){let{parser:s}=i.p;r1(this.data,e,i,this.id,s.data,s.tokenPrecTable)}}us.prototype.contextual=us.prototype.fallback=us.prototype.extend=!1;us.prototype.fallback=us.prototype.extend=!1;class uo{constructor(e,i={}){this.token=e,this.contextual=!!i.contextual,this.fallback=!!i.fallback,this.extend=!!i.extend}}function r1(t,e,i,s,r,n){let o=0,a=1<<s,{dialect:l}=i.p.parser;e:for(;(a&t[o])!=0;){let c=t[o+1];for(let u=o+3;u<c;u+=2)if((t[u+1]&a)>0){let p=t[u];if(l.allows(p)&&(e.token.value==-1||e.token.value==p||n1(p,e.token.value,r,n))){e.acceptToken(p);break}}let h=e.next,d=0,f=t[o+2];if(e.next<0&&f>d&&t[c+f*3-3]==65535){o=t[c+f*3-1];continue e}for(;d<f;){let u=d+f>>1,p=c+u+(u<<1),m=t[p],b=t[p+1]||65536;if(h<m)f=u;else if(h>=b)d=u+1;else{o=t[p+2],e.advance();continue e}}break}}function td(t,e,i){for(let s=e,r;(r=t[s])!=65535;s++)if(r==i)return s-e;return-1}function n1(t,e,i,s){let r=td(i,s,e);return r<0||td(i,s,t)<r}const Je=typeof process<"u"&&Gh&&/\bparse\b/.test(Gh.LOG);let Yo=null;function id(t,e,i){let s=t.cursor(fe.IncludeAnonymous);for(s.moveTo(e);;)if(!(i<0?s.childBefore(e):s.childAfter(e)))for(;;){if((i<0?s.to<e:s.from>e)&&!s.type.isError)return i<0?Math.max(0,Math.min(s.to-1,e-25)):Math.min(t.length,Math.max(s.from+1,e+25));if(i<0?s.prevSibling():s.nextSibling())break;if(!s.parent())return i<0?0:t.length}}class o1{constructor(e,i){this.fragments=e,this.nodeSet=i,this.i=0,this.fragment=null,this.safeFrom=-1,this.safeTo=-1,this.trees=[],this.start=[],this.index=[],this.nextFragment()}nextFragment(){let e=this.fragment=this.i==this.fragments.length?null:this.fragments[this.i++];if(e){for(this.safeFrom=e.openStart?id(e.tree,e.from+e.offset,1)-e.offset:e.from,this.safeTo=e.openEnd?id(e.tree,e.to+e.offset,-1)-e.offset:e.to;this.trees.length;)this.trees.pop(),this.start.pop(),this.index.pop();this.trees.push(e.tree),this.start.push(-e.offset),this.index.push(0),this.nextStart=this.safeFrom}else this.nextStart=1e9}nodeAt(e){if(e<this.nextStart)return null;for(;this.fragment&&this.safeTo<=e;)this.nextFragment();if(!this.fragment)return null;for(;;){let i=this.trees.length-1;if(i<0)return this.nextFragment(),null;let s=this.trees[i],r=this.index[i];if(r==s.children.length){this.trees.pop(),this.start.pop(),this.index.pop();continue}let n=s.children[r],o=this.start[i]+s.positions[r];if(o>e)return this.nextStart=o,null;if(n instanceof ge){if(o==e){if(o<this.safeFrom)return null;let a=o+n.length;if(a<=this.safeTo){let l=n.prop(W.lookAhead);if(!l||a+l<this.fragment.to)return n}}this.index[i]++,o+n.length>=Math.max(this.safeFrom,e)&&(this.trees.push(n),this.start.push(o),this.index.push(0))}else this.index[i]++,this.nextStart=o+n.length}}}class a1{constructor(e,i){this.stream=i,this.tokens=[],this.mainToken=null,this.actions=[],this.tokens=e.tokenizers.map(s=>new fn)}getActions(e){let i=0,s=null,{parser:r}=e.p,{tokenizers:n}=r,o=r.stateSlot(e.state,3),a=e.curContext?e.curContext.hash:0,l=0;for(let c=0;c<n.length;c++){if((1<<c&o)==0)continue;let h=n[c],d=this.tokens[c];if(!(s&&!h.fallback)&&((h.contextual||d.start!=e.pos||d.mask!=o||d.context!=a)&&(this.updateCachedToken(d,h,e),d.mask=o,d.context=a),d.lookAhead>d.end+25&&(l=Math.max(d.lookAhead,l)),d.value!=0)){let f=i;if(d.extended>-1&&(i=this.addActions(e,d.extended,d.end,i)),i=this.addActions(e,d.value,d.end,i),!h.extend&&(s=d,i>f))break}}for(;this.actions.length>i;)this.actions.pop();return l&&e.setLookAhead(l),!s&&e.pos==this.stream.end&&(s=new fn,s.value=e.p.parser.eofTerm,s.start=s.end=e.pos,i=this.addActions(e,s.value,s.end,i)),this.mainToken=s,this.actions}getMainToken(e){if(this.mainToken)return this.mainToken;let i=new fn,{pos:s,p:r}=e;return i.start=s,i.end=Math.min(s+1,r.stream.end),i.value=s==r.stream.end?r.parser.eofTerm:0,i}updateCachedToken(e,i,s){let r=this.stream.clipPos(s.pos);if(i.token(this.stream.reset(r,e),s),e.value>-1){let{parser:n}=s.p;for(let o=0;o<n.specialized.length;o++)if(n.specialized[o]==e.value){let a=n.specializers[o](this.stream.read(e.start,e.end),s);if(a>=0&&s.p.parser.dialect.allows(a>>1)){(a&1)==0?e.value=a>>1:e.extended=a>>1;break}}}else e.value=0,e.end=this.stream.clipPos(r+1)}putAction(e,i,s,r){for(let n=0;n<r;n+=3)if(this.actions[n]==e)return r;return this.actions[r++]=e,this.actions[r++]=i,this.actions[r++]=s,r}addActions(e,i,s,r){let{state:n}=e,{parser:o}=e.p,{data:a}=o;for(let l=0;l<2;l++)for(let c=o.stateSlot(n,l?2:1);;c+=3){if(a[c]==65535)if(a[c+1]==1)c=Ut(a,c+2);else{r==0&&a[c+1]==2&&(r=this.putAction(Ut(a,c+2),i,s,r));break}a[c]==i&&(r=this.putAction(Ut(a,c+1),i,s,r))}return r}}class l1{constructor(e,i,s,r){this.parser=e,this.input=i,this.ranges=r,this.recovering=0,this.nextStackID=9812,this.minStackPos=0,this.reused=[],this.stoppedAt=null,this.lastBigReductionStart=-1,this.lastBigReductionSize=0,this.bigReductionCount=0,this.stream=new s1(i,r),this.tokens=new a1(e,this.stream),this.topTerm=e.top[1];let{from:n}=r[0];this.stacks=[qn.start(this,e.top[0],n)],this.fragments=s.length&&this.stream.end-n>e.bufferLength*4?new o1(s,e.nodeSet):null}get parsedPos(){return this.minStackPos}advance(){let e=this.stacks,i=this.minStackPos,s=this.stacks=[],r,n;if(this.bigReductionCount>300&&e.length==1){let[o]=e;for(;o.forceReduce()&&o.stack.length&&o.stack[o.stack.length-2]>=this.lastBigReductionStart;);this.bigReductionCount=this.lastBigReductionSize=0}for(let o=0;o<e.length;o++){let a=e[o];for(;;){if(this.tokens.mainToken=null,a.pos>i)s.push(a);else{if(this.advanceStack(a,s,e))continue;{r||(r=[],n=[]),r.push(a);let l=this.tokens.getMainToken(a);n.push(l.value,l.end)}}break}}if(!s.length){let o=r&&d1(r);if(o)return Je&&console.log("Finish with "+this.stackID(o)),this.stackToTree(o);if(this.parser.strict)throw Je&&r&&console.log("Stuck with token "+(this.tokens.mainToken?this.parser.getName(this.tokens.mainToken.value):"none")),new SyntaxError("No parse at "+i);this.recovering||(this.recovering=5)}if(this.recovering&&r){let o=this.stoppedAt!=null&&r[0].pos>this.stoppedAt?r[0]:this.runRecovery(r,n,s);if(o)return Je&&console.log("Force-finish "+this.stackID(o)),this.stackToTree(o.forceAll())}if(this.recovering){let o=this.recovering==1?1:this.recovering*3;if(s.length>o)for(s.sort((a,l)=>l.score-a.score);s.length>o;)s.pop();s.some(a=>a.reducePos>i)&&this.recovering--}else if(s.length>1){e:for(let o=0;o<s.length-1;o++){let a=s[o];for(let l=o+1;l<s.length;l++){let c=s[l];if(a.sameState(c)||a.buffer.length>500&&c.buffer.length>500)if((a.score-c.score||a.buffer.length-c.buffer.length)>0)s.splice(l--,1);else{s.splice(o--,1);continue e}}}s.length>12&&(s.sort((o,a)=>a.score-o.score),s.splice(12,s.length-12))}this.minStackPos=s[0].pos;for(let o=1;o<s.length;o++)s[o].pos<this.minStackPos&&(this.minStackPos=s[o].pos);return null}stopAt(e){if(this.stoppedAt!=null&&this.stoppedAt<e)throw new RangeError("Can't move stoppedAt forward");this.stoppedAt=e}advanceStack(e,i,s){let r=e.pos,{parser:n}=this,o=Je?this.stackID(e)+" -> ":"";if(this.stoppedAt!=null&&r>this.stoppedAt)return e.forceReduce()?e:null;if(this.fragments){let c=e.curContext&&e.curContext.tracker.strict,h=c?e.curContext.hash:0;for(let d=this.fragments.nodeAt(r);d;){let f=this.parser.nodeSet.types[d.type.id]==d.type?n.getGoto(e.state,d.type.id):-1;if(f>-1&&d.length&&(!c||(d.prop(W.contextHash)||0)==h))return e.useNode(d,f),Je&&console.log(o+this.stackID(e)+` (via reuse of ${n.getName(d.type.id)})`),!0;if(!(d instanceof ge)||d.children.length==0||d.positions[0]>0)break;let u=d.children[0];if(u instanceof ge&&d.positions[0]==0)d=u;else break}}let a=n.stateSlot(e.state,4);if(a>0)return e.reduce(a),Je&&console.log(o+this.stackID(e)+` (via always-reduce ${n.getName(a&65535)})`),!0;if(e.stack.length>=8400)for(;e.stack.length>6e3&&e.forceReduce(););let l=this.tokens.getActions(e);for(let c=0;c<l.length;){let h=l[c++],d=l[c++],f=l[c++],u=c==l.length||!s,p=u?e:e.split(),m=this.tokens.mainToken;if(p.apply(h,d,m?m.start:p.pos,f),Je&&console.log(o+this.stackID(p)+` (via ${(h&65536)==0?"shift":`reduce of ${n.getName(h&65535)}`} for ${n.getName(d)} @ ${r}${p==e?"":", split"})`),u)return!0;p.pos>r?i.push(p):s.push(p)}return!1}advanceFully(e,i){let s=e.pos;for(;;){if(!this.advanceStack(e,null,null))return!1;if(e.pos>s)return sd(e,i),!0}}runRecovery(e,i,s){let r=null,n=!1;for(let o=0;o<e.length;o++){let a=e[o],l=i[o<<1],c=i[(o<<1)+1],h=Je?this.stackID(a)+" -> ":"";if(a.deadEnd&&(n||(n=!0,a.restart(),Je&&console.log(h+this.stackID(a)+" (restarted)"),this.advanceFully(a,s))))continue;let d=a.split(),f=h;for(let u=0;u<10&&d.forceReduce()&&(Je&&console.log(f+this.stackID(d)+" (via force-reduce)"),!this.advanceFully(d,s));u++)Je&&(f=this.stackID(d)+" -> ");for(let u of a.recoverByInsert(l))Je&&console.log(h+this.stackID(u)+" (via recover-insert)"),this.advanceFully(u,s);this.stream.end>a.pos?(c==a.pos&&(c++,l=0),a.recoverByDelete(l,c),Je&&console.log(h+this.stackID(a)+` (via recover-delete ${this.parser.getName(l)})`),sd(a,s)):(!r||r.score<d.score)&&(r=d)}return r}stackToTree(e){return e.close(),ge.build({buffer:Vn.create(e),nodeSet:this.parser.nodeSet,topID:this.topTerm,maxBufferLength:this.parser.bufferLength,reused:this.reused,start:this.ranges[0].from,length:e.pos-this.ranges[0].from,minRepeatType:this.parser.minRepeatTerm})}stackID(e){let i=(Yo||(Yo=new WeakMap)).get(e);return i||Yo.set(e,i=String.fromCodePoint(this.nextStackID++)),i+e}}function sd(t,e){for(let i=0;i<e.length;i++){let s=e[i];if(s.pos==t.pos&&s.sameState(t)){e[i].score<t.score&&(e[i]=t);return}}e.push(t)}class c1{constructor(e,i,s){this.source=e,this.flags=i,this.disabled=s}allows(e){return!this.disabled||this.disabled[e]==0}}const Go=t=>t;class h1{constructor(e){this.start=e.start,this.shift=e.shift||Go,this.reduce=e.reduce||Go,this.reuse=e.reuse||Go,this.hash=e.hash||(()=>0),this.strict=e.strict!==!1}}class Qn extends nu{constructor(e){if(super(),this.wrappers=[],e.version!=14)throw new RangeError(`Parser version (${e.version}) doesn't match runtime version (14)`);let i=e.nodeNames.split(" ");this.minRepeatTerm=i.length;for(let a=0;a<e.repeatNodeCount;a++)i.push("");let s=Object.keys(e.topRules).map(a=>e.topRules[a][1]),r=[];for(let a=0;a<i.length;a++)r.push([]);function n(a,l,c){r[a].push([l,l.deserialize(String(c))])}if(e.nodeProps)for(let a of e.nodeProps){let l=a[0];typeof l=="string"&&(l=W[l]);for(let c=1;c<a.length;){let h=a[c++];if(h>=0)n(h,l,a[c++]);else{let d=a[c+-h];for(let f=-h;f>0;f--)n(a[c++],l,d);c++}}}this.nodeSet=new Ml(i.map((a,l)=>je.define({name:l>=this.minRepeatTerm?void 0:a,id:l,props:r[l],top:s.indexOf(l)>-1,error:l==0,skipped:e.skippedNodes&&e.skippedNodes.indexOf(l)>-1}))),e.propSources&&(this.nodeSet=this.nodeSet.extend(...e.propSources)),this.strict=!1,this.bufferLength=tu;let o=tn(e.tokenData);this.context=e.context,this.specializerSpecs=e.specialized||[],this.specialized=new Uint16Array(this.specializerSpecs.length);for(let a=0;a<this.specializerSpecs.length;a++)this.specialized[a]=this.specializerSpecs[a].term;this.specializers=this.specializerSpecs.map(rd),this.states=tn(e.states,Uint32Array),this.data=tn(e.stateData),this.goto=tn(e.goto),this.maxTerm=e.maxTerm,this.tokenizers=e.tokenizers.map(a=>typeof a=="number"?new us(o,a):a),this.topRules=e.topRules,this.dialects=e.dialects||{},this.dynamicPrecedences=e.dynamicPrecedences||null,this.tokenPrecTable=e.tokenPrec,this.termNames=e.termNames||null,this.maxNode=this.nodeSet.types.length-1,this.dialect=this.parseDialect(),this.top=this.topRules[Object.keys(this.topRules)[0]]}createParse(e,i,s){let r=new l1(this,e,i,s);for(let n of this.wrappers)r=n(r,e,i,s);return r}getGoto(e,i,s=!1){let r=this.goto;if(i>=r[0])return-1;for(let n=r[i+1];;){let o=r[n++],a=o&1,l=r[n++];if(a&&s)return l;for(let c=n+(o>>1);n<c;n++)if(r[n]==e)return l;if(a)return-1}}hasAction(e,i){let s=this.data;for(let r=0;r<2;r++)for(let n=this.stateSlot(e,r?2:1),o;;n+=3){if((o=s[n])==65535)if(s[n+1]==1)o=s[n=Ut(s,n+2)];else{if(s[n+1]==2)return Ut(s,n+2);break}if(o==i||o==0)return Ut(s,n+1)}return 0}stateSlot(e,i){return this.states[e*6+i]}stateFlag(e,i){return(this.stateSlot(e,0)&i)>0}validAction(e,i){return!!this.allActions(e,s=>s==i?!0:null)}allActions(e,i){let s=this.stateSlot(e,4),r=s?i(s):void 0;for(let n=this.stateSlot(e,1);r==null;n+=3){if(this.data[n]==65535)if(this.data[n+1]==1)n=Ut(this.data,n+2);else break;r=i(Ut(this.data,n+1))}return r}nextStates(e){let i=[];for(let s=this.stateSlot(e,1);;s+=3){if(this.data[s]==65535)if(this.data[s+1]==1)s=Ut(this.data,s+2);else break;if((this.data[s+2]&1)==0){let r=this.data[s+1];i.some((n,o)=>o&1&&n==r)||i.push(this.data[s],r)}}return i}configure(e){let i=Object.assign(Object.create(Qn.prototype),this);if(e.props&&(i.nodeSet=this.nodeSet.extend(...e.props)),e.top){let s=this.topRules[e.top];if(!s)throw new RangeError(`Invalid top rule name ${e.top}`);i.top=s}return e.tokenizers&&(i.tokenizers=this.tokenizers.map(s=>{let r=e.tokenizers.find(n=>n.from==s);return r?r.to:s})),e.specializers&&(i.specializers=this.specializers.slice(),i.specializerSpecs=this.specializerSpecs.map((s,r)=>{let n=e.specializers.find(a=>a.from==s.external);if(!n)return s;let o=Object.assign(Object.assign({},s),{external:n.to});return i.specializers[r]=rd(o),o})),e.contextTracker&&(i.context=e.contextTracker),e.dialect&&(i.dialect=this.parseDialect(e.dialect)),e.strict!=null&&(i.strict=e.strict),e.wrap&&(i.wrappers=i.wrappers.concat(e.wrap)),e.bufferLength!=null&&(i.bufferLength=e.bufferLength),i}hasWrappers(){return this.wrappers.length>0}getName(e){return this.termNames?this.termNames[e]:String(e<=this.maxNode&&this.nodeSet.types[e].name||e)}get eofTerm(){return this.maxNode+1}get topNode(){return this.nodeSet.types[this.top[1]]}dynamicPrecedence(e){let i=this.dynamicPrecedences;return i==null?0:i[e]||0}parseDialect(e){let i=Object.keys(this.dialects),s=i.map(()=>!1);if(e)for(let n of e.split(" ")){let o=i.indexOf(n);o>=0&&(s[o]=!0)}let r=null;for(let n=0;n<i.length;n++)if(!s[n])for(let o=this.dialects[i[n]],a;(a=this.data[o++])!=65535;)(r||(r=new Uint8Array(this.maxTerm+1)))[a]=1;return new c1(e,s,r)}static deserialize(e){return new Qn(e)}}function Ut(t,e){return t[e]|t[e+1]<<16}function d1(t){let e=null;for(let i of t){let s=i.p.stoppedAt;(i.pos==i.p.stream.end||s!=null&&i.pos>s)&&i.p.parser.stateFlag(i.state,2)&&(!e||e.score<i.score)&&(e=i)}return e}function rd(t){if(t.external){let e=t.extend?1:0;return(i,s)=>t.external(i,s)<<1|e}return t.get}const es=63,nd=64,f1=1,u1=2,Op=3,p1=4,Ap=5,g1=6,m1=7,$p=65,b1=66,v1=8,y1=9,x1=10,w1=11,k1=12,Pp=13,S1=19,C1=20,O1=29,A1=33,$1=34,P1=47,T1=0,Xl=1,Ya=2,vr=3,Ga=4;class Ti{constructor(e,i,s){this.parent=e,this.depth=i,this.type=s,this.hash=(e?e.hash+e.hash<<8:0)+i+(i<<4)+s}}Ti.top=new Ti(null,-1,T1);function Ys(t,e){for(let i=0,s=e-t.pos-1;;s--,i++){let r=t.peek(s);if(Jt(r)||r==-1)return i}}function Za(t){return t==32||t==9}function Jt(t){return t==10||t==13}function Tp(t){return Za(t)||Jt(t)}function Bi(t){return t<0||Tp(t)}const M1=new h1({start:Ti.top,reduce(t,e){return t.type==vr&&(e==C1||e==$1)?t.parent:t},shift(t,e,i,s){if(e==Op)return new Ti(t,Ys(s,s.pos),Xl);if(e==$p||e==Ap)return new Ti(t,Ys(s,s.pos),Ya);if(e==es)return t.parent;if(e==S1||e==A1)return new Ti(t,0,vr);if(e==Pp&&t.type==Ga)return t.parent;if(e==P1){let r=/[1-9]/.exec(s.read(s.pos,i.pos));if(r)return new Ti(t,t.depth+ +r[0],Ga)}return t},hash(t){return t.hash}});function Cs(t,e,i=0){return t.peek(i)==e&&t.peek(i+1)==e&&t.peek(i+2)==e&&Bi(t.peek(i+3))}const E1=new uo((t,e)=>{if(t.next==-1&&e.canShift(nd))return t.acceptToken(nd);let i=t.peek(-1);if((Jt(i)||i<0)&&e.context.type!=vr){if(Cs(t,45))if(e.canShift(es))t.acceptToken(es);else return t.acceptToken(f1,3);if(Cs(t,46))if(e.canShift(es))t.acceptToken(es);else return t.acceptToken(u1,3);let s=0;for(;t.next==32;)s++,t.advance();(s<e.context.depth||s==e.context.depth&&e.context.type==Xl&&(t.next!=45||!Bi(t.peek(1))))&&t.next!=-1&&!Jt(t.next)&&t.next!=35&&t.acceptToken(es,-s)}},{contextual:!0}),D1=new uo((t,e)=>{if(e.context.type==vr){t.next==63&&(t.advance(),Bi(t.next)&&t.acceptToken(m1));return}if(t.next==45)t.advance(),Bi(t.next)&&t.acceptToken(e.context.type==Xl&&e.context.depth==Ys(t,t.pos-1)?p1:Op);else if(t.next==63)t.advance(),Bi(t.next)&&t.acceptToken(e.context.type==Ya&&e.context.depth==Ys(t,t.pos-1)?g1:Ap);else{let i=t.pos;for(;;)if(Za(t.next)){if(t.pos==i)return;t.advance()}else if(t.next==33)Mp(t);else if(t.next==38)el(t);else if(t.next==42){el(t);break}else if(t.next==39||t.next==34){if(Jl(t,!0))break;return}else if(t.next==91||t.next==123){if(!B1(t))return;break}else{Ep(t,!0,!1,0);break}for(;Za(t.next);)t.advance();if(t.next==58){if(t.pos==i&&e.canShift(O1))return;let s=t.peek(1);Bi(s)&&t.acceptTokenTo(e.context.type==Ya&&e.context.depth==Ys(t,i)?b1:$p,i)}}},{contextual:!0});function _1(t){return t>32&&t<127&&t!=34&&t!=37&&t!=44&&t!=60&&t!=62&&t!=92&&t!=94&&t!=96&&t!=123&&t!=124&&t!=125}function od(t){return t>=48&&t<=57||t>=97&&t<=102||t>=65&&t<=70}function ad(t,e){return t.next==37?(t.advance(),od(t.next)&&t.advance(),od(t.next)&&t.advance(),!0):_1(t.next)||e&&t.next==44?(t.advance(),!0):!1}function Mp(t){if(t.advance(),t.next==60){for(t.advance();;)if(!ad(t,!0)){t.next==62&&t.advance();break}}else for(;ad(t,!1););}function el(t){for(t.advance();!Bi(t.next)&&jn(t.next)!="f";)t.advance()}function Jl(t,e){let i=t.next,s=!1,r=t.pos;for(t.advance();;){let n=t.next;if(n<0)break;if(t.advance(),n==i)if(n==39)if(t.next==39)t.advance();else break;else break;else if(n==92&&i==34)t.next>=0&&t.advance();else if(Jt(n)){if(e)return!1;s=!0}else if(e&&t.pos>=r+1024)return!1}return!s}function B1(t){for(let e=[],i=t.pos+1024;;)if(t.next==91||t.next==123)e.push(t.next),t.advance();else if(t.next==39||t.next==34){if(!Jl(t,!0))return!1}else if(t.next==93||t.next==125){if(e[e.length-1]!=t.next-2)return!1;if(e.pop(),t.advance(),!e.length)return!0}else{if(t.next<0||t.pos>i||Jt(t.next))return!1;t.advance()}}const R1="iiisiiissisfissssssssssssisssiiissssssssssssssssssssssssssfsfssissssssssssssssssssssssssssfif";function jn(t){return t<33?"u":t>125?"s":R1[t-33]}function Zo(t,e){let i=jn(t);return i!="u"&&!(e&&i=="f")}function Ep(t,e,i,s){if(jn(t.next)=="s"||(t.next==63||t.next==58||t.next==45)&&Zo(t.peek(1),i))t.advance();else return!1;let r=t.pos;for(;;){let n=t.next,o=0,a=s+1;for(;Tp(n);){if(Jt(n)){if(e)return!1;a=0}else a++;n=t.peek(++o)}if(!(n>=0&&(n==58?Zo(t.peek(o+1),i):n==35?t.peek(o-1)!=32:Zo(n,i)))||!i&&a<=s||a==0&&!i&&(Cs(t,45,o)||Cs(t,46,o)))break;if(e&&jn(n)=="f")return!1;for(let c=o;c>=0;c--)t.advance();if(e&&t.pos>r+1024)return!1}return!0}const L1=new uo((t,e)=>{if(t.next==33)Mp(t),t.acceptToken(k1);else if(t.next==38||t.next==42){let i=t.next==38?x1:w1;el(t),t.acceptToken(i)}else t.next==39||t.next==34?(Jl(t,!1),t.acceptToken(y1)):Ep(t,!1,e.context.type==vr,e.context.depth)&&t.acceptToken(v1)}),I1=new uo((t,e)=>{let i=e.context.type==Ga?e.context.depth:-1,s=t.pos;e:for(;;){let r=0,n=t.next;for(;n==32;)n=t.peek(++r);if(!r&&(Cs(t,45,r)||Cs(t,46,r))||!Jt(n)&&(i<0&&(i=Math.max(e.context.depth+1,r)),r<i))break;for(;;){if(t.next<0)break e;let o=Jt(t.next);if(t.advance(),o)continue e;s=t.pos}}t.acceptTokenTo(Pp,s)}),F1=ou({DirectiveName:w.keyword,DirectiveContent:w.attributeValue,"DirectiveEnd DocEnd":w.meta,QuotedLiteral:w.string,BlockLiteralHeader:w.special(w.string),BlockLiteralContent:w.content,Literal:w.content,"Key/Literal Key/QuotedLiteral":w.definition(w.propertyName),"Anchor Alias":w.labelName,Tag:w.typeName,Comment:w.lineComment,": , -":w.separator,"?":w.punctuation,"[ ]":w.squareBracket,"{ }":w.brace}),N1=Qn.deserialize({version:14,states:"5lQ!ZQgOOO#PQfO'#CpO#uQfO'#DOOOQR'#Dv'#DvO$qQgO'#DRO%gQdO'#DUO%nQgO'#DUO&ROaO'#D[OOQR'#Du'#DuO&{QgO'#D^O'rQgO'#D`OOQR'#Dt'#DtO(iOqO'#DbOOQP'#Dj'#DjO(zQaO'#CmO)YQgO'#CmOOQP'#Cm'#CmQ)jQaOOQ)uQgOOQ]QgOOO*PQdO'#CrO*nQdO'#CtOOQO'#Dw'#DwO+]Q`O'#CxO+hQdO'#CwO+rQ`O'#CwOOQO'#Cv'#CvO+wQdO'#CvOOQO'#Cq'#CqO,UQ`O,59[O,^QfO,59[OOQR,59[,59[OOQO'#Cx'#CxO,eQ`O'#DPO,pQdO'#DPOOQO'#Dx'#DxO,zQdO'#DxO-XQ`O,59jO-aQfO,59jOOQR,59j,59jOOQR'#DS'#DSO-hQcO,59mO-sQgO'#DVO.TQ`O'#DVO.YQcO,59pOOQR'#DX'#DXO#|QfO'#DWO.hQcO'#DWOOQR,59v,59vO.yOWO,59vO/OOaO,59vO/WOaO,59vO/cQgO'#D_OOQR,59x,59xO0VQgO'#DaOOQR,59z,59zOOQP,59|,59|O0yOaO,59|O1ROaO,59|O1aOqO,59|OOQP-E7h-E7hO1oQgO,59XOOQP,59X,59XO2PQaO'#DeO2_QgO'#DeO2oQgO'#DkOOQP'#Dk'#DkQ)jQaOOO3PQdO'#CsOOQO,59^,59^O3kQdO'#CuOOQO,59`,59`OOQO,59c,59cO4VQdO,59cO4aQdO'#CzO4kQ`O'#CzOOQO,59b,59bOOQU,5:Q,5:QOOQR1G.v1G.vO4pQ`O1G.vOOQU-E7d-E7dO4xQdO,59kOOQO,59k,59kO5SQdO'#DQO5^Q`O'#DQOOQO,5:d,5:dOOQU,5:R,5:ROOQR1G/U1G/UO5cQ`O1G/UOOQU-E7e-E7eO5kQgO'#DhO5xQcO1G/XOOQR1G/X1G/XOOQR,59q,59qO6TQgO,59qO6eQdO'#DiO6lQgO'#DiO7PQcO1G/[OOQR1G/[1G/[OOQR,59r,59rO#|QfO,59rOOQR1G/b1G/bO7_OWO1G/bO7dOaO1G/bOOQR,59y,59yOOQR,59{,59{OOQP1G/h1G/hO7lOaO1G/hO7tOaO1G/hO8POaO1G/hOOQP1G.s1G.sO8_QgO,5:POOQP,5:P,5:POOQP,5:V,5:VOOQP-E7i-E7iOOQO,59_,59_OOQO,59a,59aOOQO1G.}1G.}OOQO,59f,59fO8oQdO,59fOOQR7+$b7+$bP,XQ`O'#DfOOQO1G/V1G/VOOQO,59l,59lO8yQdO,59lOOQR7+$p7+$pP9TQ`O'#DgOOQR'#DT'#DTOOQR,5:S,5:SOOQR-E7f-E7fOOQR7+$s7+$sOOQR1G/]1G/]O9YQgO'#DYO9jQ`O'#DYOOQR,5:T,5:TO#|QfO'#DZO9oQcO'#DZOOQR-E7g-E7gOOQR7+$v7+$vOOQR1G/^1G/^OOQR7+$|7+$|O:QOWO7+$|OOQP7+%S7+%SO:VOaO7+%SO:_OaO7+%SOOQP1G/k1G/kOOQO1G/Q1G/QOOQO1G/W1G/WOOQR,59t,59tO:jQgO,59tOOQR,59u,59uO#|QfO,59uOOQR<<Hh<<HhOOQP<<Hn<<HnO:zOaO<<HnOOQR1G/`1G/`OOQR1G/a1G/aOOQPAN>YAN>Y",stateData:";S~O!fOS!gOS^OS~OP_OQbORSOTUOWROXROYYOZZO[XOcPOqQO!PVO!V[O!cTO~O`cO~P]OVkOWROXROYeOZfO[dOcPOmhOqQO~OboO~P!bOVtOWROXROYeOZfO[dOcPOmrOqQO~OpwO~P#WORSOTUOWROXROYYOZZO[XOcPOqQO!PVO!cTO~OSvP!avP!bvP~P#|OWROXROYeOZfO[dOcPOqQO~OmzO~P%OOm!OOUzP!azP!bzP!dzP~P#|O^!SO!b!QO!f!TO!g!RO~ORSOTUOWROXROcPOqQO!PVO!cTO~OY!UOP!QXQ!QX!V!QX!`!QXS!QX!a!QX!b!QXU!QXm!QX!d!QX~P&aO[!WOP!SXQ!SX!V!SX!`!SXS!SX!a!SX!b!SXU!SXm!SX!d!SX~P&aO^!ZO!W![O!b!YO!f!]O!g!YO~OP!_O!V[OQaX!`aX~OPaXQaX!VaX!`aX~P#|OP!bOQ!cO!V[O~OP_O!V[O~P#|OWROXROY!fOcPOqQObfXmfXofXpfX~OWROXRO[!hOcPOqQObhXmhXohXphX~ObeXmlXoeX~ObkXokX~P%OOm!kO~Om!lObnPonP~P%OOb!pOo!oO~Ob!pO~P!bOm!sOosXpsX~OosXpsX~P%OOm!uOotPptP~P%OOo!xOp!yO~Op!yO~P#WOS!|O!a#OO!b#OO~OUyX!ayX!byX!dyX~P#|Om#QO~OU#SO!a#UO!b#UO!d#RO~Om#WOUzX!azX!bzX!dzX~O]#XO~O!b#XO!g#YO~O^#ZO!b#XO!g#YO~OP!RXQ!RX!V!RX!`!RXS!RX!a!RX!b!RXU!RXm!RX!d!RX~P&aOP!TXQ!TX!V!TX!`!TXS!TX!a!TX!b!TXU!TXm!TX!d!TX~P&aO!b#^O!g#^O~O^#_O!b#^O!f#`O!g#^O~O^#_O!W#aO!b#^O!g#^O~OPaaQaa!Vaa!`aa~P#|OP#cO!V[OQ!XX!`!XX~OP!XXQ!XX!V!XX!`!XX~P#|OP_O!V[OQ!_X!`!_X~P#|OWROXROcPOqQObgXmgXogXpgX~OWROXROcPOqQObiXmiXoiXpiX~Obkaoka~P%OObnXonX~P%OOm#kO~Ob#lOo!oO~Oosapsa~P%OOotXptX~P%OOm#pO~Oo!xOp#qO~OSwP!awP!bwP~P#|OS!|O!a#vO!b#vO~OUya!aya!bya!dya~P#|Om#xO~P%OOm#{OU}P!a}P!b}P!d}P~P#|OU#SO!a$OO!b$OO!d#RO~O]$QO~O!b$QO!g$RO~O!b$SO!g$SO~O^$TO!b$SO!g$SO~O^$TO!b$SO!f$UO!g$SO~OP!XaQ!Xa!V!Xa!`!Xa~P#|Obnaona~P%OOotapta~P%OOo!xO~OU|X!a|X!b|X!d|X~P#|Om$ZO~Om$]OU}X!a}X!b}X!d}X~O]$^O~O!b$_O!g$_O~O^$`O!b$_O!g$_O~OU|a!a|a!b|a!d|a~P#|O!b$cO!g$cO~O",goto:",]!mPPPPPPPPPPPPPPPPP!nPP!v#v#|$`#|$c$f$j$nP%VPPP!v%Y%^%a%{&O%a&R&U&X&_&b%aP&e&{&e'O'RPP']'a'g'm's'y(XPPPPPPPP(_)e*X+c,VUaObcR#e!c!{ROPQSTUXY_bcdehknrtvz!O!U!W!_!b!c!f!h!k!l!s!u!|#Q#R#S#W#c#k#p#x#{$Z$]QmPR!qnqfPQThknrtv!k!l!s!u#R#k#pR!gdR!ieTlPnTjPnSiPnSqQvQ{TQ!mkQ!trQ!vtR#y#RR!nkTsQvR!wt!RWOSUXY_bcz!O!U!W!_!b!c!|#Q#S#W#c#x#{$Z$]RySR#t!|R|TR|UQ!PUR#|#SR#z#RR#z#SyZOSU_bcz!O!_!b!c!|#Q#S#W#c#x#{$Z$]R!VXR!XYa]O^abc!a!c!eT!da!eQnPR!rnQvQR!{vQ!}yR#u!}Q#T|R#}#TW^Obc!cS!^^!aT!aa!eQ!eaR#f!eW`Obc!cQxSS}U#SQ!`_Q#PzQ#V!OQ#b!_Q#d!bQ#s!|Q#w#QQ$P#WQ$V#cQ$Y#xQ$[#{Q$a$ZR$b$]xZOSU_bcz!O!_!b!c!|#Q#S#W#c#x#{$Z$]Q!VXQ!XYQ#[!UR#]!W!QWOSUXY_bcz!O!U!W!_!b!c!|#Q#S#W#c#x#{$Z$]pfPQThknrtv!k!l!s!u#R#k#pQ!gdQ!ieQ#g!fR#h!hSgPn^pQTkrtv#RQ!jhQ#i!kQ#j!lQ#n!sQ#o!uQ$W#kR$X#pQuQR!zv",nodeNames:"⚠ DirectiveEnd DocEnd - - ? ? ? Literal QuotedLiteral Anchor Alias Tag BlockLiteralContent Comment Stream BOM Document ] [ FlowSequence Item Tagged Anchored Anchored Tagged FlowMapping Pair Key : Pair , } { FlowMapping Pair Pair BlockSequence Item Item BlockMapping Pair Pair Key Pair Pair BlockLiteral BlockLiteralHeader Tagged Anchored Anchored Tagged Directive DirectiveName DirectiveContent Document",maxTerm:74,context:M1,nodeProps:[["isolate",-3,8,9,14,""],["openedBy",18,"[",32,"{"],["closedBy",19,"]",33,"}"]],propSources:[F1],skippedNodes:[0],repeatNodeCount:6,tokenData:"-Y~RnOX#PXY$QYZ$]Z]#P]^$]^p#Ppq$Qqs#Pst$btu#Puv$yv|#P|}&e}![#P![!]'O!]!`#P!`!a'i!a!}#P!}#O*g#O#P#P#P#Q+Q#Q#o#P#o#p+k#p#q'i#q#r,U#r;'S#P;'S;=`#z<%l?HT#P?HT?HU,o?HUO#PQ#UU!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PQ#kTOY#PZs#Pt;'S#P;'S;=`#z<%lO#PQ#}P;=`<%l#P~$VQ!f~XY$Qpq$Q~$bO!g~~$gS^~OY$bZ;'S$b;'S;=`$s<%lO$b~$vP;=`<%l$bR%OX!WQOX%kXY#PZ]%k]^#P^p%kpq#hq;'S%k;'S;=`&_<%lO%kR%rX!WQ!VPOX%kXY#PZ]%k]^#P^p%kpq#hq;'S%k;'S;=`&_<%lO%kR&bP;=`<%l%kR&lUoP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR'VUmP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR'p[!PP!WQOY#PZp#Ppq#hq{#P{|(f|}#P}!O(f!O!R#P!R![)p![;'S#P;'S;=`#z<%lO#PR(mW!PP!WQOY#PZp#Ppq#hq!R#P!R![)V![;'S#P;'S;=`#z<%lO#PR)^U!PP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR)wY!PP!WQOY#PZp#Ppq#hq{#P{|)V|}#P}!O)V!O;'S#P;'S;=`#z<%lO#PR*nUcP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR+XUbP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR+rUqP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR,]UpP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR,vU`P!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#P",tokenizers:[E1,D1,L1,I1,0,1],topRules:{Stream:[0,15]},tokenPrec:0}),z1=En.define({name:"yaml",parser:N1.configure({props:[hu.add({Stream:t=>{for(let e=t.node.resolve(t.pos,-1);e&&e.to>=t.pos;e=e.parent){if(e.name=="BlockLiteralContent"&&e.from<e.to)return t.baseIndentFor(e);if(e.name=="BlockLiteral")return t.baseIndentFor(e)+t.unit;if(e.name=="BlockSequence"||e.name=="BlockMapping")return t.column(e.firstChild.from,1);if(e.name=="QuotedLiteral")return null;if(e.name=="Literal"){let i=t.column(e.from,1);if(i==t.lineIndent(e.from,1))return i;if(e.to>t.pos)return null}}return null},FlowMapping:kh({closing:"}"}),FlowSequence:kh({closing:"]"})}),uu.add({"FlowMapping FlowSequence":Lv,"Item Pair BlockLiteral":(t,e)=>({from:e.doc.lineAt(t.from).to,to:t.to})})]}),languageData:{commentTokens:{line:"#"},indentOnInput:/^\s*[\]\}]$/}});function H1(){return new Ov(z1)}const W1="#e5c07b",ld="#e06c75",U1="#56b6c2",q1="#ffffff",un="#abb2bf",tl="#7d8799",V1="#61afef",Q1="#98c379",cd="#d19a66",j1="#c678dd",K1="#21252b",hd="#2c313a",dd="#282c34",ea="#353a42",X1="#3E4451",fd="#528bff",J1=B.theme({"&":{color:un,backgroundColor:dd},".cm-content":{caretColor:fd},".cm-cursor, .cm-dropCursor":{borderLeftColor:fd},"&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":{backgroundColor:X1},".cm-panels":{backgroundColor:K1,color:un},".cm-panels.cm-panels-top":{borderBottom:"2px solid black"},".cm-panels.cm-panels-bottom":{borderTop:"2px solid black"},".cm-searchMatch":{backgroundColor:"#72a1ff59",outline:"1px solid #457dff"},".cm-searchMatch.cm-searchMatch-selected":{backgroundColor:"#6199ff2f"},".cm-activeLine":{backgroundColor:"#6699ff0b"},".cm-selectionMatch":{backgroundColor:"#aafe661a"},"&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket":{backgroundColor:"#bad0f847"},".cm-gutters":{backgroundColor:dd,color:tl,border:"none"},".cm-activeLineGutter":{backgroundColor:hd},".cm-foldPlaceholder":{backgroundColor:"transparent",border:"none",color:"#ddd"},".cm-tooltip":{border:"none",backgroundColor:ea},".cm-tooltip .cm-tooltip-arrow:before":{borderTopColor:"transparent",borderBottomColor:"transparent"},".cm-tooltip .cm-tooltip-arrow:after":{borderTopColor:ea,borderBottomColor:ea},".cm-tooltip-autocomplete":{"& > ul > li[aria-selected]":{backgroundColor:hd,color:un}}},{dark:!0}),Y1=$r.define([{tag:w.keyword,color:j1},{tag:[w.name,w.deleted,w.character,w.propertyName,w.macroName],color:ld},{tag:[w.function(w.variableName),w.labelName],color:V1},{tag:[w.color,w.constant(w.name),w.standard(w.name)],color:cd},{tag:[w.definition(w.name),w.separator],color:un},{tag:[w.typeName,w.className,w.number,w.changed,w.annotation,w.modifier,w.self,w.namespace],color:W1},{tag:[w.operator,w.operatorKeyword,w.url,w.escape,w.regexp,w.link,w.special(w.string)],color:U1},{tag:[w.meta,w.comment],color:tl},{tag:w.strong,fontWeight:"bold"},{tag:w.emphasis,fontStyle:"italic"},{tag:w.strikethrough,textDecoration:"line-through"},{tag:w.link,color:tl,textDecoration:"underline"},{tag:w.heading,fontWeight:"bold",color:ld},{tag:[w.atom,w.bool,w.special(w.variableName)],color:cd},{tag:[w.processingInstruction,w.string,w.inserted],color:Q1},{tag:w.invalid,color:q1}]),G1=[J1,ku(Y1)];var Z1=Object.defineProperty,ek=Object.getOwnPropertyDescriptor,Yl=(t,e,i,s)=>{for(var r=s>1?void 0:s?ek(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&Z1(e,i,r),r};function il(t){if(!t.includes("external_components:")||!t.includes("type: local")||!t.includes("/opt/esp-tree/components"))return!1;const e=t.match(/components:\s*\[([^\]]*)\]/);if(!e)return!1;const i=e[1];return!(!i.includes("esp_tree_common")||!i.includes("esp_tree_remote")&&!i.includes("esp_tree_bridge")&&!i.includes("espnow_82xx_remote"))}function ud(t){const e=[];return/(^|\s)!include\s/m.test(t)&&e.push("This config uses !include which is not supported. ESPHome compile will fail — only single-file configs are allowed."),/(^|\s)packages:/m.test(t)&&e.push("This config uses packages: which is not supported in V1. Each device must be a single YAML file."),il(t)||e.push("ESP-Tree external components are not configured. See the required configuration when saving or compiling."),e}let yr=class extends de{constructor(){super(...arguments),this.value="",this.readonly=!1,this.editorView=null,this._resizeObserver=null}disconnectedCallback(){this.destroyEditor(),super.disconnectedCallback()}destroyEditor(){this._resizeObserver&&(this._resizeObserver.disconnect(),this._resizeObserver=null),this.editorView&&(this.editorView.destroy(),this.editorView=null)}initEditor(){var i;this.destroyEditor();const t=(i=this.shadowRoot)==null?void 0:i.querySelector(".editor-container");if(!t)return;const e=K.create({doc:this.value,extensions:[t1,H1(),G1,K.readOnly.of(this.readonly),B.updateListener.of(s=>{s.docChanged&&(this.value=s.state.doc.toString(),this.dispatchEvent(new CustomEvent("content-change",{detail:{content:this.value,warnings:ud(this.value)},bubbles:!0,composed:!0})))})]});this.editorView=new B({state:e,parent:t}),this._resizeObserver=new ResizeObserver(()=>{var s;(s=this.editorView)==null||s.requestMeasure()}),this._resizeObserver.observe(t)}updated(t){t.has("readonly")?this.initEditor():this.editorView&&t.has("value")&&!t.get("value")&&this.initEditor()}firstUpdated(){this.initEditor()}getContent(){var t;return((t=this.editorView)==null?void 0:t.state.doc.toString())??this.value}getWarnings(){return ud(this.getContent())}render(){return g`<div class="editor-container"></div>`}};yr.styles=we`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      border: 1px solid var(--line);
      border-radius: 8px;
      overflow: hidden;
      overflow: clip;
    }
    .editor-container {
      min-height: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #282c34;
    }
    .editor-container .cm-editor {
      flex: 1;
      min-height: 0;
    }
    .editor-container .cm-editor .cm-scroller {
      font-family: ui-monospace, "SFMono-Regular", "Cascadia Code", "Liberation Mono", monospace;
      font-size: 13px;
      line-height: 1.5;
      overflow: auto;
    }
  `;Yl([Q({type:String})],yr.prototype,"value",2);Yl([Q({type:Boolean})],yr.prototype,"readonly",2);yr=Yl([ke("esp-config-editor")],yr);var tk=Object.defineProperty,ik=Object.getOwnPropertyDescriptor,he=(t,e,i,s)=>{for(var r=s>1?void 0:s?ik(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&tk(e,i,r),r};const sk=new Set(["queued","starting","announcing","transferring","verifying","transfer_success_waiting_rejoin"]),rk=new Set(["success","failed","aborted","rejoin_timeout","version_mismatch"]);function nk(t){const e=t.trim().toUpperCase().replace(/\s+/g,"");if(!e)return null;const i=["ESP8266","ESP32-C61","ESP32-C6","ESP32-C5","ESP32-C3","ESP32-C2","ESP32-H2","ESP32-P4","ESP32-S3","ESP32-S2","ESP32"];for(const s of i){const r=s.replace(/-/g,"");if(e.includes(s)||e.includes(r))return s}return null}function ok(t){const e=t||"";if(/^\s*esp8266\s*:/m.test(e))return"ESP8266";if(!/^\s*esp32\s*:/m.test(e))return null;const i=e.match(/^\s*variant\s*:\s*["']?([A-Za-z0-9_-]+)["']?\s*$/m),s=((i==null?void 0:i[1])||"").toUpperCase().replace(/_/g,"-");return s?s.includes("ESP32-C61")?"ESP32-C61":s.includes("ESP32-C6")?"ESP32-C6":s.includes("ESP32-C5")?"ESP32-C5":s.includes("ESP32-C3")?"ESP32-C3":s.includes("ESP32-C2")?"ESP32-C2":s.includes("ESP32-H2")?"ESP32-H2":s.includes("ESP32-P4")?"ESP32-P4":s.includes("ESP32-S3")?"ESP32-S3":s.includes("ESP32-S2")?"ESP32-S2":"ESP32":"ESP32"}let oe=class extends de{constructor(){super(...arguments),this.mac="",this.state="loading",this.device=null,this.config=null,this.editorContent="",this.saveIndicator="",this.hasUnsavedChanges=!1,this.error="",this.compilePhase="idle",this.topology=[],this.compileJobId=null,this.compileQueuePosition=null,this.preflight=null,this.chipUnknown=!1,this.yamlWarnings=[],this.showExternalComponentsFix=!1,this.showSecretsWarning=!1,this.missingSecrets=[],this.pendingAction=null,this.pendingAutoFlash=!1,this.showCompileLog=!0,this.compileStartedAt=null,this.flashIntent="none",this.browserFlashManifestUrl="",this.browserFlashFirmwareBlobUrl="",this.elapsedTimer=null,this.pollTimer=null,this.devicePollTimer=null}connectedCallback(){super.connectedCallback(),this.load()}disconnectedCallback(){this.stopPolling(),this.stopDevicePolling(),super.disconnectedCallback()}startPolling(){this.pollTimer||(this.pollTimer=setInterval(()=>this.pollCompileStatus(),2e3))}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}stopCompileLogViewer(){this.compileLogViewer&&(this.compileLogViewer.stopped=!0)}startDevicePolling(){this.devicePollTimer||(this.devicePollTimer=setInterval(()=>void this.pollDevice(),3e4))}stopDevicePolling(){this.devicePollTimer&&(clearInterval(this.devicePollTimer),this.devicePollTimer=null)}async pollDevice(){try{const t=await S.device(this.mac);this.device=t||{}}catch{}}get isCompilingActive(){return this.compilePhase==="compiling"||this.compilePhase==="compile_queued"}get browserSupportsUsbFlash(){return typeof window<"u"&&window.isSecureContext&&"serial"in navigator}get browserFlashChipFamily(){var e,i;const t=String(((e=this.preflight)==null?void 0:e.chip.new)||((i=this.device)==null?void 0:i.chip_name)||"");return nk(t)||ok(this.editorContent)}getElapsedTime(){if(!this.compileStartedAt)return"00:00";const t=Math.floor((Date.now()-this.compileStartedAt)/1e3),e=Math.floor(t/60).toString().padStart(2,"0"),i=(t%60).toString().padStart(2,"0");return`${e}:${i}`}startElapsedTimer(){this.stopElapsedTimer(),this.elapsedTimer=setInterval(()=>this.requestUpdate(),1e3)}stopElapsedTimer(){this.elapsedTimer&&(clearInterval(this.elapsedTimer),this.elapsedTimer=null)}async load(){this.state="loading";try{const[t,e,i]=await Promise.all([S.device(this.mac).catch(()=>null),S.getConfig(this.mac).catch(()=>null),S.topology().catch(()=>[])]);this.device=t||{},this.topology=i,this.startDevicePolling(),e&&e.has_config?(this.config=e,this.editorContent=this.config.content,this.hasUnsavedChanges=!1,this.state="editor"):this.state="no_config",await this.pollCompileStatus()}catch{this.state="no_config"}}clearBrowserFlashManifestUrl(){this.browserFlashManifestUrl&&(URL.revokeObjectURL(this.browserFlashManifestUrl),this.browserFlashManifestUrl=""),this.browserFlashFirmwareBlobUrl&&(URL.revokeObjectURL(this.browserFlashFirmwareBlobUrl),this.browserFlashFirmwareBlobUrl="")}async updateBrowserFlashManifestUrl(){var e,i,s,r;if(this.compilePhase!=="compiled")return;const t=this.browserFlashChipFamily;if(!t){this.clearBrowserFlashManifestUrl();return}try{const n=S.downloadFactoryBinary(this.mac),o=await fetch(n);if(!o.ok){this.clearBrowserFlashManifestUrl();return}const a=await o.blob(),l=URL.createObjectURL(a),c={name:String(((e=this.device)==null?void 0:e.esphome_name)||((i=this.device)==null?void 0:i.label)||this.mac),version:String(((s=this.device)==null?void 0:s.project_version)||((r=this.device)==null?void 0:r.firmware_version)||"compiled"),new_install_prompt_erase:!0,builds:[{chipFamily:t,parts:[{path:l,offset:0}]}]},h=new Blob([JSON.stringify(c)],{type:"application/json"}),d=URL.createObjectURL(h);this.clearBrowserFlashManifestUrl(),this.browserFlashManifestUrl=d,this.browserFlashFirmwareBlobUrl=l}catch{this.clearBrowserFlashManifestUrl()}}async pollCompileStatus(){try{const t=await S.getCompileStatus(this.mac);t.status==="compile_queued"?(this.compilePhase="compile_queued",this.compileJobId=t.job_id,this.compileQueuePosition=t.queue_position,this.startPolling()):t.status==="compiling"?(this.compilePhase="compiling",this.compileJobId=t.job_id,this.compileQueuePosition=null,this.startPolling()):sk.has(t.status)?(this.compilePhase="queued_for_flash",this.compileJobId=t.job_id,this.compileQueuePosition=t.queue_position,this.flashIntent="ota",this.startPolling(),window.location.hash=`/device/${encodeURIComponent(this.mac)}`):t.status==="compiled"?(this.compilePhase="compiled",this.compileJobId=t.job_id,this.compileQueuePosition=null,this.stopElapsedTimer(),this.updateBrowserFlashManifestUrl(),this.stopPolling(),this.flashIntent==="ota"&&(window.location.hash=`/device/${encodeURIComponent(this.mac)}`)):rk.has(t.status)&&(this.compilePhase="idle",this.compileJobId=null,this.compileQueuePosition=null,this.compileStartedAt=null,this.flashIntent="none",this.clearBrowserFlashManifestUrl(),this.stopElapsedTimer(),this.stopPolling(),this.stopCompileLogViewer())}catch{}}async createScaffold(){try{const t=await S.saveConfig(this.mac,"",!0);this.config=t,this.editorContent=t.content,this.chipUnknown=t.chip_unknown??!1,this.state="editor"}catch(t){this.error=t instanceof Error?t.message:String(t)}}async importYaml(){const t=document.createElement("input");t.type="file",t.accept=".yaml,.yml",t.onchange=async()=>{var i;const e=(i=t.files)==null?void 0:i[0];if(e)try{const s=await S.importConfig(this.mac,e);this.config=s,this.editorContent=s.content,this.state="editor"}catch(s){this.error=s instanceof Error?s.message:String(s)}},t.click()}async saveConfig(t=!1){if(!t&&!il(this.editorContent)){this.pendingAction="save",this.showExternalComponentsFix=!0;return}this.saveIndicator="Saving...";try{const e=await S.saveConfig(this.mac,this.editorContent);this.config=e,this.hasUnsavedChanges=!1,this.saveIndicator="Saved ✓",setTimeout(()=>{this.saveIndicator="",this.requestUpdate()},2e3)}catch(e){this.saveIndicator="",this.error=e instanceof Error?e.message:String(e)}}onEditorChange(t){const e=t.detail;this.editorContent=e.content,this.yamlWarnings=e.warnings??[],this.hasUnsavedChanges=this.config?this.editorContent!==this.config.content:!0}get isBridgeDevice(){var t;return!!((t=this.device)!=null&&t.is_bridge)}get isEsp8266Device(){var e;const t=String(((e=this.device)==null?void 0:e.chip_name)??"");return t==="ESP8266"||t==="ESP-01"||t==="ESP-12E"}get remoteComponentName(){return this.isBridgeDevice?"esp_tree_bridge":this.isEsp8266Device?"espnow_82xx_remote":"esp_tree_remote"}get externalComponentsFixYaml(){return`external_components:
  - source:
      type: local
      path: /opt/esp-tree/components
    components: [${this.remoteComponentName}, esp_tree_common]`}insertExternalComponentsFix(){const e=`
external_components:
  - source:
      type: local
      path: /opt/esp-tree/components
    components: [${this.remoteComponentName}, esp_tree_common]
`;let i=this.editorContent;i=this.removeExternalComponentsBlock(i);const s=i.split(`
`);let r=this.findBlockEnd(s,/^esphome:\s*$/);r<0&&(r=0);const n=this.findBlockEnd(s,/^(esp32|esp8266):\s*$/,r);for(n>r&&(r=n);r<s.length&&s[r].trim()==="";)r++;s.splice(r,0,...e.split(`
`)),this.editorContent=s.join(`
`)}removeExternalComponentsBlock(t){const e=t.split(`
`),i=e.findIndex(r=>/^external_components:\s*$/.test(r));if(i<0)return t;let s=i+1;for(;s<e.length&&(e[s].startsWith(" ")||e[s].startsWith("	")||e[s].trim()==="")&&!(e[s].trim()===""&&s+1<e.length&&!e[s+1].startsWith(" ")&&!e[s+1].startsWith("	"));)s++;for(;s<e.length&&e[s].trim()==="";)s++;return e.splice(i,s-i),e.join(`
`)}findBlockEnd(t,e,i=0){const s=t.findIndex((n,o)=>o>=i&&e.test(n));if(s<0)return-1;let r=s+1;for(;r<t.length&&(t[r].startsWith(" ")||t[r].startsWith("	"));)r++;return r}async applyExternalComponentsFix(){this.showExternalComponentsFix=!1,this.insertExternalComponentsFix(),this.yamlWarnings=[],this.hasUnsavedChanges=!0,this.requestUpdate();const t=this.pendingAction,e=this.pendingAutoFlash;this.pendingAction=null,this.pendingAutoFlash=!1,t==="save"?await this.saveConfig(!0):t==="compile"&&await this.queueCompile(e,!0)}async dismissExternalComponentsFix(){this.showExternalComponentsFix=!1;const t=this.pendingAction,e=this.pendingAutoFlash;this.pendingAction=null,this.pendingAutoFlash=!1,t==="save"?await this.saveConfig(!0):t==="compile"&&await this.queueCompile(e,!0)}async dismissSecretsWarning(){this.showSecretsWarning=!1;const t=this.pendingAction,e=this.pendingAutoFlash;this.pendingAction=null,this.pendingAutoFlash=!1,t==="compile"&&await this.queueCompile(e,!0)}goToSecretsFromWarning(){this.showSecretsWarning=!1,this.goToSecrets()}async checkForMissingSecrets(){try{return(await S.checkSecrets(this.editorContent)).missing_secrets}catch{return[]}}async queueCompile(t,e=!1){if(!(this.compilePhase==="compiling"||this.compilePhase==="compile_queued")){if(!e){const i=await this.checkForMissingSecrets();if(i.length>0){this.missingSecrets=i,this.pendingAction="compile",this.pendingAutoFlash=t,this.showSecretsWarning=!0;return}}if(!e&&!il(this.editorContent)){this.pendingAction="compile",this.pendingAutoFlash=t,this.showExternalComponentsFix=!0;return}this.hasUnsavedChanges&&await this.saveConfig(!0),this.compilePhase="compiling",this.compileStartedAt=Date.now(),this.startElapsedTimer(),this.error="",this.showCompileLog=!0;try{const i=await S.compileDevice(this.mac,t);this.compileJobId=i.job.id,this.preflight=i.preflight||null,i.job.status==="compile_queued"?(this.compilePhase="compile_queued",this.compileQueuePosition=i.queue_position):i.job.status==="compiling"&&(this.compilePhase="compiling",this.compileQueuePosition=null),this.startPolling()}catch(i){this.compilePhase="failed",this.compileStartedAt=null,this.stopElapsedTimer(),this.error=i instanceof Error?i.message:String(i)}}}async triggerCompile(){this.flashIntent="none",await this.queueCompile(!1)}async triggerOtaFlash(){this.flashIntent="ota",await this.queueCompile(!0)}async triggerBrowserFlashFlow(){this.flashIntent="browser",await this.queueCompile(!1)}async cancelCompile(){try{await S.cancelCompile(this.mac)}catch{}this.compilePhase="idle",this.compileJobId=null,this.compileQueuePosition=null,this.compileStartedAt=null,this.flashIntent="none",this.clearBrowserFlashManifestUrl(),this.stopElapsedTimer(),this.stopPolling()}goBack(){window.location.hash=`/device/${encodeURIComponent(this.mac)}`}goToTopology(){window.location.hash="/"}goToSecrets(){window.location.hash=`/secrets?from=${encodeURIComponent(window.location.hash)}`}updated(t){(t.has("compilePhase")||t.has("device")||t.has("preflight"))&&this.updateBrowserFlashManifestUrl()}render(){var c,h,d,f,u;const t=String(((c=this.device)==null?void 0:c.esphome_name)||((h=this.device)==null?void 0:h.label)||this.mac),e=String(((d=this.device)==null?void 0:d.chip_name)||"-"),i=this.topology.find(p=>ae(p.mac)===ae(this.mac)),s=(i==null?void 0:i.online)??!!((f=this.device)!=null&&f.online),r=this.device,o=!!!(r!=null&&r.is_bridge)&&((r==null?void 0:r.hops)??0)>0,a=this.browserFlashChipFamily,l=this.compilePhase==="compiled"&&!!this.browserFlashManifestUrl;return g`
      <div class="config-page" data-job-id=${this.compileJobId??""}>
        ${this.showExternalComponentsFix?g`
              <div class="ec-fix-backdrop" @click=${this.dismissExternalComponentsFix}>
                <div class="ec-fix-modal" @click=${p=>p.stopPropagation()}>
                  <h3>ESP-Tree External Components Required</h3>
                  <p>Your configuration is missing the required <code>external_components</code> block. ESP-Tree devices need the following:</p>
                  <pre class="ec-fix-snippet">${this.externalComponentsFixYaml}</pre>
                  <p class="ec-fix-hint">This must be present for ESP-Tree components to compile correctly.</p>
                  <div class="ec-fix-actions">
                    <button class="btn btn-primary" @click=${this.applyExternalComponentsFix}>Apply Fix</button>
                    <button class="btn" @click=${this.dismissExternalComponentsFix}>Cancel</button>
                  </div>
                </div>
              </div>
            `:y}
        ${this.showSecretsWarning?g`
              <div class="ec-fix-backdrop" @click=${this.dismissSecretsWarning}>
                <div class="ec-fix-modal" @click=${p=>p.stopPropagation()}>
                  <h3>Missing Secrets Warning</h3>
                  <p>Your configuration references secrets that are not defined in secrets.yaml:</p>
                  <ul class="missing-secrets-list">
                    ${this.missingSecrets.map(p=>g`<li><code>!secret ${p}</code></li>`)}
                  </ul>
                  <p class="ec-fix-hint">Add these secrets to your secrets.yaml file before compiling.</p>
                  <div class="ec-fix-actions">
                    <button class="btn" @click=${this.dismissSecretsWarning}>Try Anyway</button>
                    <button class="btn btn-primary" @click=${this.goToSecretsFromWarning}>Edit Secrets</button>
                  </div>
                </div>
              </div>
            `:y}
        <header class="config-header">
          <div class="back-buttons">
            <button class="back" @click=${this.goToTopology}>&#8592; Back to Topology</button>
            <button class="back" @click=${this.goBack}>&#8592; Back to Device Settings</button>
          </div>
          <div class="header-info">
            <h2>${t}${o?g`<span class="device-type-tag">Remote</span>`:y}</h2>
            <p>${this.mac} &middot; ${e} &middot; <span class=${s?"ok":"danger"}>${s?"online":"offline"}</span></p>
          </div>
          <button class="btn btn-edit-config" @click=${this.goToSecrets}>Secrets &#9881;</button>
        </header>

        ${this.state==="loading"?g`<div class="card">Loading config...</div>`:this.state==="no_config"?g`
                <div class="card no-config">
                  ${this.chipUnknown?g`
                    <div class="chip-error-banner">
                      <span>&#9888; Unsupported chip type detected. Ensure correct chip type is entered in topology settings before compiling.</span>
                      <button class="dismiss-btn" @click=${()=>{this.chipUnknown=!1}}>&#10005;</button>
                    </div>
                  `:y}
                  <h3>No configuration yet for this device.</h3>
                  <div class="no-config-actions">
                    <button class="btn btn-primary" @click=${this.createScaffold}>Create Config</button>
                    <button class="btn" @click=${this.importYaml}>Import YAML</button>
                  </div>
                  <p class="hint">Create Config generates a minimal scaffold populated from this device's topology data.</p>
                  <p class="hint">Import lets you upload an existing YAML file.</p>
                  ${this.error?g`<p class="error">${this.error}</p>`:y}
                </div>
              `:this.state==="editor"?g`
                    <div class="main-content">
                    ${this.isCompilingActive?g`
                          <div class="compile-focus-view">
                            <div class="compile-status-header">
                              <span class="compile-spinner">&#9696;</span>
                              <span>${this.compilePhase==="compile_queued"?`Queued at position ${this.compileQueuePosition!==null?this.compileQueuePosition:"?"}`:"Compiling firmware..."}</span>
                              <span class="compile-elapsed">${this.getElapsedTime()}</span>
                            </div>
                            <esp-compile-log-viewer
                              .mac=${this.mac}
                              .visible=${!0}
                              class="expanded-log"
                            ></esp-compile-log-viewer>
                          </div>
                        `:g`
                          <esp-config-editor
                            .value=${this.editorContent}
                            .readonly=${!1}
                            @content-change=${this.onEditorChange}
                          ></esp-config-editor>

                          ${this.yamlWarnings.length>0?g`<div class="yaml-warnings">${this.yamlWarnings.map(p=>g`<p>&#9888; ${p}</p>`)}</div>`:y}
                        `}
                    </div>

                    <esp-compile-log-viewer
                      .mac=${this.mac}
                      .visible=${(this.compilePhase==="queued_for_flash"||this.compilePhase==="failed")&&this.showCompileLog}
                      class="bottom-log"
                    ></esp-compile-log-viewer>

                    ${this.compilePhase==="compile_queued"?g`
                        <div class="queue-banner">
                          <strong>&#9203; Position ${this.compileQueuePosition!==null?this.compileQueuePosition:"?"} in compile queue</strong>
                          <small>Waiting for compile slot...</small>
                          <button class="cancel-btn" @click=${this.cancelCompile}>Cancel</button>
                        </div>
                      `:y}

                  <div class="action-bar">
                    <button class="btn btn-primary" @click=${this.saveConfig} ?disabled=${this.compilePhase==="compiling"||this.compilePhase==="compile_queued"}>
                      ${this.saveIndicator||(this.hasUnsavedChanges?"Save":"Saved ✓")}
                    </button>
                    ${this.compilePhase==="idle"||this.compilePhase==="failed"||this.compilePhase==="compiled"?g`
                          <button class="btn btn-success" ?disabled=${!this.config} @click=${this.triggerCompile}>Compile</button>
                          <button class="btn btn-primary" ?disabled=${!this.config} @click=${this.triggerOtaFlash}>Compile and Flash (OTA)</button>
                          <button class="btn" ?disabled=${!this.config} @click=${this.triggerBrowserFlashFlow}>Compile and Flash (USB via Browser)</button>
                        `:this.compilePhase==="compiling"||this.compilePhase==="compile_queued"?g`<button class="btn btn-danger" @click=${this.cancelCompile}>Cancel</button>`:y}
                  </div>

                  <div class="browser-flash-panel">
                    ${l?g`
                          <div class="browser-flash-actions">
                            <esp-web-install-button manifest=${this.browserFlashManifestUrl}>
                              <button slot="activate" class="btn btn-primary">Flash via Browser USB</button>
                              <span slot="unsupported">Open this page in Chrome or Edge over HTTPS to use browser USB flashing.</span>
                              <span slot="not-allowed">Browser USB flashing requires a secure HTTPS page.</span>
                            </esp-web-install-button>
                            <a class="btn" href=${S.downloadFactoryBinary(this.mac)} download>Download factory .bin</a>
                          </div>
                        `:g`
                          <div class="browser-flash-hint">
                            ${this.compilePhase==="compiled"&&!a?g`<p>Browser USB flash is unavailable because the chip family could not be determined for this build.</p>`:this.browserSupportsUsbFlash?g`<p>Compile the device first, then flash the resulting firmware through your browser here.</p>`:g`<p>Browser USB flash requires Chrome or Edge with Web Serial on an HTTPS page.</p>`}
                            <a class="btn" href=${S.downloadFactoryBinary(this.mac)} download ?hidden=${this.compilePhase!=="compiled"}>Download factory .bin</a>
                          </div>
                        `}
                  </div>

                  ${this.compilePhase==="compiling"?g`<p class="status-line">Status: compiling... <button class="cancel-link" @click=${this.cancelCompile}>Cancel</button></p>`:this.compilePhase==="compile_queued"?g`<p class="status-line">Status: waiting to compile (#${this.compileQueuePosition!==null?this.compileQueuePosition:"?"})</p>`:this.compilePhase==="queued_for_flash"?g`<p class="status-line">Status: OTA flash queued or running${this.compileQueuePosition!==null?` (#${this.compileQueuePosition})`:""}</p>`:g`<p class="status-line">Status: ${this.hasUnsavedChanges?"unsaved":"saved"}</p>`}

                  ${this.error&&this.compilePhase!=="compiling"?g`<p class="error">${this.error}</p>`:y}

                  ${this.compilePhase==="compiled"?g`
                        <div class="success-section">
                          <div class="success-banner">&#10003; Build successful</div>
                          <p class="build-info">${t} &middot; ready for flash</p>
                          ${(u=this.preflight)!=null&&u.has_warnings?g`
                                <div class="warnings">
                                  ${this.preflight.warnings.map(p=>g`<p>${p}</p>`)}
                                </div>
                              `:y}
                          ${this.flashIntent==="browser"?g`<p class="hint">Build complete. Connect the device by USB and use the browser flash control above.</p>`:g`<p class="hint">Firmware compiled. Use OTA or browser USB flash from the action bar above.</p>`}
                          <div class="download-links">
                            <a class="btn" href=${S.downloadFactoryBinary(this.mac)} download>Download .bin</a>
                            <a class="btn" href=${S.downloadCompileBinary(this.mac)} download>Download .ota.bin</a>
                          </div>
                        </div>
                      `:y}

                  ${this.compilePhase==="failed"?g`
                        <div class="fail-section">
                          <div class="fail-banner">
                            <span>&#10007; Build failed</span>
                            ${this.showCompileLog?g`<button class="close-logs-link" @click=${()=>{this.showCompileLog=!1}}>Hide logs</button>`:g`<button class="close-logs-link" @click=${()=>{this.showCompileLog=!0}}>Show logs</button>`}
                          </div>
                          <p class="hint">Fix the YAML above and try again. <button class="btn-link" @click=${this.cancelCompile}>Cancel</button></p>
                        </div>
                      `:y}
                `:y}
      </div>
    `}};oe.styles=we`
    .config-page {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
      color: var(--ink);
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    .config-header {
      display: flex;
      align-items: end;
      gap: 16px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--line);
    }
    .back-buttons {
      display: flex;
      gap: 8px;
    }
    .back {
      border: 1px solid var(--line);
      background: var(--surface);
      min-height: 36px;
      padding: 0 14px;
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      border-radius: 8px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.12s;
    }
    .back:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }
    .header-info {
      flex: 1;
      min-width: 0;
    }
    .header-info h2 {
      margin: 0;
      font-size: clamp(18px, 2.5vw, 26px);
      font-weight: 700;
      line-height: 1.1;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .header-info p {
      margin: 4px 0 0;
      font-size: 13px;
      color: var(--muted);
    }
    .ok { color: var(--ok); }
    .danger { color: var(--danger); }
    .device-type-tag {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      color: #475569;
      vertical-align: middle;
    }

    .card {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 12px;
      box-shadow: var(--shadow);
      padding: 20px 24px;
      margin-bottom: 16px;
    }
    .no-config {
      text-align: center;
    }
    .no-config h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 18px;
    }
    .no-config-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-bottom: 16px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: inherit;
      font-size: 13px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
      border: 1px solid var(--line);
      background: var(--surface);
      color: var(--ink);
      cursor: pointer;
      transition: all 0.12s;
      min-height: 38px;
    }
    .btn:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }
    .btn-primary {
      background: var(--primary);
      color: #fff;
      border-color: var(--primary);
    }
    .btn-primary:hover {
      background: #0d4d5e;
    }
    .btn-success {
      background: var(--ok);
      color: #fff;
      border-color: var(--ok);
    }
    .btn-success:hover {
      background: #16a34a;
    }
    .btn-danger {
      background: var(--danger);
      color: #fff;
      border-color: var(--danger);
    }
    .btn-danger:hover {
      background: #dc2626;
    }
    .btn-edit-config {
      border: 1px solid #0f766e;
      background: #0f766e;
      color: #fff;
    }
    .btn-edit-config:hover {
      background: #0d5f58;
      border-color: #0d5f58;
    }
    .hint {
      font-size: 12px;
      color: var(--muted);
      margin: 4px 0;
    }

    .yaml-warnings {
      border: 1px solid var(--accent);
      background: #fffbeb;
      border-radius: 8px;
      padding: 10px 14px;
      margin-top: 8px;
    }
    .yaml-warnings p {
      font-size: 12px;
      color: #7c3f00;
      margin: 4px 0;
      font-weight: 500;
    }

    .queue-banner {
      border: 1px solid var(--accent);
      background: #fffbeb;
      border-radius: 8px;
      padding: 12px 16px;
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .queue-banner strong {
      font-size: 14px;
      font-weight: 600;
    }
    .queue-banner small {
      color: var(--muted);
      font-size: 11px;
    }

    .action-bar {
      display: flex;
      gap: 8px;
      padding: 16px 0 8px;
      border-top: 1px solid var(--line);
      margin-top: 12px;
    }

    .cancel-link {
      border: 1px solid var(--danger);
      background: transparent;
      color: var(--danger);
      font: inherit;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .cancel-link:hover {
      background: var(--danger);
      color: white;
    }
    .btn-link {
      border: none;
      background: transparent;
      color: var(--primary);
      font: inherit;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      padding: 0 4px;
      text-decoration: underline;
    }
    .btn-link:hover {
      color: var(--ink);
    }
    .close-logs-link {
      margin-left: auto;
      border: 1px solid rgba(255,255,255,0.1);
      background: transparent;
      color: var(--muted);
      font: inherit;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      font-size: 10px;
      font-weight: 500;
      cursor: pointer;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .close-logs-link:hover {
      background: rgba(255,255,255,0.1);
      color: #fff;
    }

    .status-line {
      font-size: 11px;
      color: var(--muted);
      margin: 4px 0 0;
    }

    .success-section,
    .fail-section {
      margin-top: 10px;
    }
    .download-links {
      display: flex;
      gap: 8px;
      margin-top: 10px;
    }
    .success-banner {
      background: #dcfce7;
      color: #166534;
      border: 1px solid var(--ok);
      border-radius: 8px;
      padding: 8px 12px;
      font-weight: 600;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .fail-banner {
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid var(--danger);
      border-radius: 8px;
      padding: 8px 12px;
      font-weight: 600;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .build-info {
      font-size: 13px;
      color: var(--muted);
      margin: 6px 0;
    }
    .flash-actions {
      display: flex;
      gap: 8px;
      margin: 10px 0;
      flex-wrap: wrap;
    }
    .browser-flash-panel {
      border: 1px solid var(--line);
      background: #f8fafc;
      border-radius: 8px;
      padding: 12px;
      display: grid;
      gap: 10px;
      margin-top: 8px;
    }
    .browser-flash-copy strong {
      display: block;
      font-size: 13px;
      margin-bottom: 4px;
    }
    .browser-flash-copy p {
      margin: 0;
      font-size: 12px;
      color: var(--muted);
    }
    .browser-flash-actions,
    .browser-flash-hint {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }
    .browser-flash-hint p {
      margin: 0;
      font-size: 12px;
      color: var(--muted);
    }
    esp-web-install-button::part(button) {
      font: inherit;
    }
    .warnings {
      border-left: 4px solid var(--accent);
      background: #fffbeb;
      padding: 12px;
      border-radius: 6px;
      display: grid;
      gap: 8px;
      margin: 8px 0;
    }
    .warnings p {
      margin: 0;
      font-size: 13px;
      color: #7c3f00;
    }
    .warnings label {
      font-weight: 500;
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .error {
      color: var(--danger);
      font-size: 13px;
      font-weight: 500;
      padding: 10px 12px;
      background: #fef2f2;
      border: 1px solid var(--danger);
      border-radius: 6px;
    }

    .chip-error-banner {
      background: #fef2f2;
      border: 2px solid #b91c1c;
      color: #991b1b;
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 13px;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .chip-error-banner .dismiss-btn {
      background: transparent;
      border: none;
      font-size: 16px;
      cursor: pointer;
      color: #991b1b;
      padding: 0 4px;
      width: auto;
      min-height: auto;
      border-radius: 0;
      transform: none;
    }

    .chip-error-banner .dismiss-btn:hover {
      color: #7f1d1d;
      background: transparent;
      border-color: transparent;
      transform: none;
    }

    .compare-table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0;
      font-size: 13px;
    }
    .compare-table th,
    .compare-table td {
      border: 1px solid var(--line);
      padding: 8px 10px;
      text-align: left;
    }
    .compare-table th {
      background: #f8fafc;
      font-size: 11px;
      text-transform: uppercase;
      color: var(--muted);
      font-weight: 600;
    }
    .tag {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      margin-left: 4px;
    }
    .tag.match {
      background: #dcfce7;
      color: #166534;
    }
    .tag.mismatch {
      background: #fef2f2;
      color: #991b1b;
    }

    .compile-focus-view {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--line);
      border-radius: 8px;
      overflow: hidden;
      flex: 1;
      min-height: 0;
      background: #1a1b1e;
    }
    .compile-status-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      background: var(--primary);
      color: white;
      font-size: 13px;
      font-weight: 600;
    }
    .compile-spinner {
      font-size: 16px;
      animation: spin 1.5s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .compile-elapsed {
      margin-left: auto;
      font-family: ui-monospace, monospace;
      font-size: 12px;
      opacity: 0.85;
    }
    .expanded-log {
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }
    .expanded-log .log-body {
      height: 100%;
      max-height: none;
    }
    .main-content {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .bottom-log {
      margin-top: 8px;
    }
    .ec-fix-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.6);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ec-fix-modal {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 24px;
      max-width: 560px;
      width: 90%;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }
    .ec-fix-modal h3 { margin: 0 0 12px; font-size: 16px; }
    .ec-fix-modal p { margin: 8px 0; font-size: 13px; }
    .ec-fix-modal code { font-family: ui-monospace, monospace; font-size: 12px; }
    .ec-fix-snippet {
      background: #1e1e2e;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 12px;
      font-family: ui-monospace, monospace;
      font-size: 12px;
      white-space: pre-wrap;
      color: #a8d8a8;
      margin: 8px 0;
    }
    .ec-fix-hint { font-size: 12px; color: var(--muted); }
    .ec-fix-actions {
      display: flex;
      gap: 12px;
      margin-top: 16px;
      justify-content: flex-end;
    }
  `;he([Q({type:String})],oe.prototype,"mac",2);he([v()],oe.prototype,"state",2);he([v()],oe.prototype,"device",2);he([v()],oe.prototype,"config",2);he([v()],oe.prototype,"editorContent",2);he([v()],oe.prototype,"saveIndicator",2);he([v()],oe.prototype,"hasUnsavedChanges",2);he([v()],oe.prototype,"error",2);he([v()],oe.prototype,"compilePhase",2);he([v()],oe.prototype,"topology",2);he([v()],oe.prototype,"compileJobId",2);he([v()],oe.prototype,"compileQueuePosition",2);he([v()],oe.prototype,"preflight",2);he([v()],oe.prototype,"chipUnknown",2);he([v()],oe.prototype,"yamlWarnings",2);he([v()],oe.prototype,"showExternalComponentsFix",2);he([v()],oe.prototype,"showSecretsWarning",2);he([v()],oe.prototype,"missingSecrets",2);he([v()],oe.prototype,"showCompileLog",2);he([v()],oe.prototype,"compileStartedAt",2);he([v()],oe.prototype,"flashIntent",2);he([v()],oe.prototype,"browserFlashManifestUrl",2);he([Pd("esp-compile-log-viewer")],oe.prototype,"compileLogViewer",2);oe=he([ke("esp-config-page")],oe);var ak=Object.defineProperty,lk=Object.getOwnPropertyDescriptor,Ms=(t,e,i,s)=>{for(var r=s>1?void 0:s?lk(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&ak(e,i,r),r};let mi=class extends de{constructor(){super(...arguments),this.from="/",this.content="",this.saved=!1,this.loading=!0,this.error=""}connectedCallback(){super.connectedCallback(),this.load()}async load(){this.loading=!0;try{const t=await S.getSecrets();this.content=t.content,this.error=""}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.loading=!1}}async save(){this.saved=!1;try{await S.saveSecrets(this.content),this.saved=!0,this.error="",setTimeout(()=>{this.saved=!1,this.requestUpdate()},2e3)}catch(t){this.error=t instanceof Error?t.message:String(t)}}onInput(t){this.content=t.target.value}goBack(){window.location.hash=this.from}render(){const t=this.from==="/"?"topology":"device config";return g`
      <button class="back" @click=${this.goBack}>&#8592; Back to ${t}</button>
      <h2>Secrets</h2>
      ${this.loading?g`<div class="card">Loading...</div>`:g`
            <textarea
              class="secrets-textarea"
              .value=${this.content}
              @input=${this.onInput}
              spellcheck="false"
            ></textarea>
            <div class="actions">
              <button class="btn btn-edit-config" @click=${this.save}>Save</button>
              ${this.saved?g`<span class="saved">Saved &#10003;</span>`:y}
              ${this.error?g`<span class="error">${this.error}</span>`:y}
            </div>
            <div class="warnings">
              <p>&#9888; These secrets are stored in plaintext. Access is protected by Home Assistant ingress authentication.</p>
              <p>&#9888; Missing keys referenced by device configs will cause compile failures.</p>
            </div>
          `}
    `}};mi.styles=we`
    :host {
      display: block;
      color: var(--ink);
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    .back {
      border: 1px solid var(--line);
      background: var(--surface);
      min-height: 36px;
      padding: 0 14px;
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      border-radius: 8px;
      cursor: pointer;
      margin-bottom: 16px;
      transition: all 0.12s;
    }
    .back:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }
    h2 {
      margin: 0 0 12px;
      font-size: 24px;
      font-weight: 700;
    }
    .card {
      border: 1px solid var(--line);
      background: var(--surface);
      border-radius: 12px;
      box-shadow: var(--shadow);
      padding: 20px 24px;
      margin-bottom: 16px;
    }
    .secrets-textarea {
      width: 100%;
      min-height: 300px;
      border: 1px solid var(--line);
      background: #1a1b1e;
      color: #c0c5ce;
      font: inherit;
      font-size: 13px;
      line-height: 1.5;
      padding: 12px;
      resize: vertical;
      border-radius: 8px;
      box-sizing: border-box;
      font-family: ui-monospace, "SFMono-Regular", "Cascadia Code", "Liberation Mono", monospace;
    }
    .secrets-textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(11,59,75,0.1);
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 12px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: inherit;
      font-size: 13px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
      border: 1px solid var(--line);
      background: var(--surface);
      color: var(--ink);
      cursor: pointer;
      transition: all 0.12s;
    }
    .btn:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }
    .btn-primary {
      background: var(--primary);
      color: #fff;
      border-color: var(--primary);
    }
    .btn-primary:hover {
      background: #0d4d5e;
    }
    .btn-edit-config {
      border: 1px solid #0f766e;
      background: #0f766e;
      color: #fff;
    }
    .btn-edit-config:hover {
      background: #0d5f58;
      border-color: #0d5f58;
    }
    .saved { color: var(--ok); font-weight: 500; font-size: 13px; }
    .error { color: var(--danger); font-weight: 500; font-size: 13px; }
    .warnings {
      margin-top: 16px;
      padding: 10px 14px;
      border: 1px solid var(--line);
      border-radius: 8px;
      font-size: 12px;
      color: var(--muted);
    }
    .warnings p { margin: 4px 0; }
  `;Ms([Q({type:String})],mi.prototype,"from",2);Ms([v()],mi.prototype,"content",2);Ms([v()],mi.prototype,"saved",2);Ms([v()],mi.prototype,"loading",2);Ms([v()],mi.prototype,"error",2);mi=Ms([ke("esp-secrets-page")],mi);var ck=Object.defineProperty,hk=Object.getOwnPropertyDescriptor,wi=(t,e,i,s)=>{for(var r=s>1?void 0:s?hk(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&ck(e,i,r),r};const dk={compile_queued:"Queued for compile",compiling:"Compiling",compile_success:"Compile success",queued:"Queued for flash",starting:"Starting",announcing:"Waiting for device accept",transferring:"Transferring",verifying:"Verifying",transfer_success_waiting_rejoin:"Waiting for device rejoin",success:"Success",failed:"Failed",aborted:"Aborted",rejoin_timeout:"Rejoin timeout",version_mismatch:"Version mismatch"},fk={compile_queued:"⚙",compile_dequeued:"⚙",compiling:"⚙",compile_success:"✅",compile_failed:"❌",compile_output:"📋",compile_cancelled:"❌",flash_queued:"📦",flash_dequeued:"📦",flash_starting:"▶",flash_announcing:"⏳",flash_transferring:"📤",flash_progress:"📈",flash_verifying:"✅",flash_rejoin_waiting:"⏳",flash_rejoined:"🔄",flash_version_mismatch:"⚠",flash_rejoin_timeout:"⏰",flash_success:"✅",flash_failed:"❌",flash_aborted:"🛑",flash_start_failed:"❌",dequeue_retry:"🔄",dequeue_moved_back:"🔄",ota_start_retry:"🔄"},uk=["compile_success","success","failed","aborted","rejoin_timeout","version_mismatch"];let Rt=class extends de{constructor(){super(...arguments),this.jobId=0,this.from="/queue",this.job=null,this.logData=null,this.error="",this.loading=!0,this.expandedOutput=new Set,this.pollTimer=null}connectedCallback(){super.connectedCallback()}disconnectedCallback(){this.stopPolling(),super.disconnectedCallback()}updated(t){t.has("jobId")&&this.jobId&&(this.loading=!0,this.error="",this.fetchLog())}startPolling(){this.pollTimer||(this.pollTimer=setInterval(()=>this.fetchLog(),2e3))}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}async fetchJob(){var t;if(this.jobId)try{const e=(t=this.logData)==null?void 0:t.mac;if(e){const s=(await S.history(e)).jobs.find(r=>r.id===this.jobId);this.job=s||null}}catch{}}async fetchLog(){var t,e;if(this.jobId)try{this.logData=await S.jobLog(this.jobId),this.loading=!1,!this.job&&((t=this.logData)!=null&&t.mac)&&await this.fetchJob(),(e=this.logData)!=null&&e.is_terminal?this.stopPolling():this.startPolling()}catch(i){this.error=i instanceof Error?i.message:String(i),this.loading=!1,this.stopPolling()}}toggleOutput(t){const e=new Set(this.expandedOutput);e.has(t)?e.delete(t):e.add(t),this.expandedOutput=e}formatEventTime(t){return new Date(t*1e3).toLocaleTimeString()}renderEvent(t,e){const i=fk[t.type]||"•",s=this.formatEventTime(t.ts),r=t.type==="compile_output",n=this.expandedOutput.has(e),a={compile_success:"ok",flash_success:"ok",compile_failed:"danger",flash_failed:"danger",flash_aborted:"danger",flash_version_mismatch:"warn",flash_rejoin_timeout:"warn"}[t.type]||"";return g`
      <div class="event ${r?"event-output":""} ${a}">
        <div class="event-header" @click=${r?(()=>this.toggleOutput(e)):void 0}>
          <span class="event-icon">${i}</span>
          <span class="event-time">${s}</span>
          <span class="event-type">${t.type.replaceAll("_"," ")}</span>
          ${t.percent!=null?g`<span class="event-detail">${t.percent}%</span>`:y}
          ${t.error?g`<span class="event-error">${t.error}</span>`:y}
          ${t.reason?g`<span class="event-detail">${t.reason}</span>`:y}
          ${t.esphome_name?g`<span class="event-detail">${t.esphome_name}</span>`:y}
          ${t.firmware_name?g`<span class="event-detail">${t.firmware_name}</span>`:y}
          ${t.duration_s!=null?g`<span class="event-detail">took ${pt(t.duration_s)}</span>`:y}
          ${t.current_md5?g`<span class="event-detail">current running firmware MD5: ${t.current_md5}</span>`:y}
          ${t.md5?g`<span class="event-detail">New firmware MD5: ${t.md5}</span>`:y}
          ${t.rejoined_md5&&t.expected_md5?g`<span class="event-detail">running firmware MD5: ${t.rejoined_md5} expected MD5: ${t.expected_md5}</span>`:y}
          ${t.rejoined_md5&&!t.expected_md5?g`<span class="event-detail">running firmware MD5: ${t.rejoined_md5}</span>`:y}
          ${t.expected_md5&&!t.rejoined_md5?g`<span class="event-detail">expected MD5: ${t.expected_md5}</span>`:y}
          ${t.md5_match?g`<span class="event-tag ${t.md5_match==="match"?"ok":"warn"}">MD5 ${t.md5_match}</span>`:y}
          ${r?g`<span class="toggle">${n?"hide":"show output"}</span>`:y}
        </div>
        ${r&&n?g`<pre class="compile-output">${t.output||""}</pre>`:y}
      </div>
    `}render(){const t=this.logData,e=this.job,i=(t==null?void 0:t.log_events)||[],s=(t==null?void 0:t.status)||(e==null?void 0:e.status)||"",r=(t==null?void 0:t.is_terminal)??(e?uk.includes(e.status):!1),n=(e==null?void 0:e.parsed_esphome_name)||(e==null?void 0:e.esphome_name)||(e==null?void 0:e.firmware_name)||"Firmware",o=this.from||"/queue",a=o.startsWith("/device/")?"Device":o==="/queue"?"Queue":o.replace(/^\//,"");return g`
      <section>
        <div class="title-row">
          <a class="back-link" href="#${o}">&larr; ${a}</a>
          <div>
            <h2>${n}</h2>
          </div>
        </div>

        ${this.error?g`<p class="error">${this.error}</p>`:y}

        ${e?g`
          <div class="meta">
            <div class="meta-item">
              <small>Status</small>
              <span class="status-chip ${s}">${dk[s]||s.replaceAll("_"," ")}</span>
            </div>
            <div class="meta-item">
              <small>Device</small>
              <span>${e.mac}</span>
            </div>
            <div class="meta-item">
              <small>Size</small>
              <span>${Li(e.firmware_size)}</span>
            </div>
            ${e.started_at?g`
              <div class="meta-item">
                <small>Started</small>
                <span>${ms(e.started_at)}</span>
              </div>
            `:y}
            ${e.completed_at?g`
              <div class="meta-item">
                <small>Completed</small>
                <span>${ms(e.completed_at)}</span>
              </div>
            `:y}
            ${e.started_at&&e.completed_at?g`
              <div class="meta-item">
                <small>Duration</small>
                <span>${pt(e.completed_at-e.started_at)}</span>
              </div>
            `:y}
            ${e.error_msg?g`
              <div class="meta-item meta-full">
                <small>Error</small>
                <span class="error">${e.error_msg}</span>
              </div>
            `:y}
          </div>
        `:y}

        ${r?y:g`<div class="live-indicator">Live<span class="pulse"></span></div>`}

        <div class="log-header">
          <span class="label">Event Log</span>
          <span class="count">${i.length} events</span>
        </div>
        <div class="log-body">
          ${this.loading?g`<span class="empty">Loading...</span>`:i.length===0?g`<span class="empty">No events recorded for this job.</span>`:i.map((l,c)=>this.renderEvent(l,c))}
        </div>
      </section>
    `}};Rt.styles=we`
    section {
      display: grid;
      gap: 12px;
    }

    .title-row {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 8px;
    }

    .back-link {
      color: var(--primary);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
    }

    .back-link:hover {
      text-decoration: underline;
    }

    .title-row span {
      color: var(--primary);
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    h2 {
      margin: 2px 0 0;
      font-size: 16px;
      font-weight: 600;
    }

    .meta {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 8px 16px;
      border: 1px solid var(--line);
      background: var(--surface);
      border-radius: 8px;
      padding: 12px 16px;
    }

    .meta-item {
      display: grid;
      gap: 2px;
    }

    .meta-item small {
      color: var(--muted);
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 600;
    }

    .meta-item span {
      font-size: 13px;
    }

    .meta-full {
      grid-column: 1 / -1;
    }

    .status-chip {
      border: 1px solid var(--line);
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
      font-weight: 600;
      font-size: 11px;
    }

    .success {
      color: var(--ok);
    }

    .failed,
    .aborted {
      color: var(--danger);
    }

    .rejoin_timeout,
    .version_mismatch {
      color: var(--accent);
    }

    .live-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      color: var(--ok);
    }

    .pulse {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--ok);
      animation: blink 1.2s ease-in-out infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    .log-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: #25262b;
      border: 1px solid var(--line);
      border-bottom: none;
      border-radius: 8px 8px 0 0;
      margin-top: 4px;
    }

    .label {
      color: #9ba1a7;
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
    }

    .count {
      color: #64748b;
      font-size: 11px;
    }

    .log-body {
      background: #1a1b1e;
      border: 1px solid var(--line);
      border-top: none;
      border-radius: 0 0 8px 8px;
      max-height: 600px;
      overflow-y: auto;
      padding: 8px 0;
    }

    .empty {
      color: var(--muted);
      font-style: italic;
      font-size: 13px;
      display: block;
      padding: 16px 12px;
    }

    .event {
      padding: 4px 12px;
    }

    .event:hover {
      background: rgba(255,255,255,0.03);
    }

    .event.ok .event-type {
      color: var(--ok);
    }

    .event.danger .event-type,
    .event.danger .event-error {
      color: var(--danger);
    }

    .event.warn .event-type {
      color: var(--accent);
    }

    .event-output .event-header {
      cursor: pointer;
    }

    .event-header {
      display: flex;
      align-items: baseline;
      gap: 8px;
      flex-wrap: wrap;
    }

    .event-icon {
      font-size: 12px;
      width: 18px;
      text-align: center;
    }

    .event-time {
      color: #64748b;
      font-family: ui-monospace, 'SFMono-Regular', 'Cascadia Code', monospace;
      font-size: 12px;
    }

    .event-type {
      color: #c0c5ce;
      font-weight: 600;
      font-size: 12px;
    }

    .event-detail {
      color: #9ba1a7;
      font-size: 11px;
    }

    .event-tag {
      font-size: 11px;
      font-weight: 600;
      padding: 1px 6px;
      border-radius: 4px;
    }

    .event-tag.ok {
      color: var(--ok);
      background: color-mix(in srgb, var(--ok) 15%, transparent);
    }

    .event-tag.warn {
      color: var(--accent);
      background: color-mix(in srgb, var(--accent) 15%, transparent);
    }

    .event-error {
      color: var(--danger);
      font-size: 12px;
    }

    .toggle {
      color: var(--primary);
      font-size: 11px;
      cursor: pointer;
    }

    .compile-output {
      margin: 4px 0 4px 26px;
      color: #9ba1a7;
      font-family: ui-monospace, 'SFMono-Regular', 'Cascadia Code', monospace;
      font-size: 11px;
      line-height: 1.4;
      white-space: pre-wrap;
      word-break: break-all;
      max-height: 400px;
      overflow-y: auto;
      background: #111216;
      border-radius: 4px;
      padding: 8px;
    }

    .error {
      color: var(--danger);
      font-weight: 500;
      margin: 0;
    }

    @media (max-width: 720px) {
      .meta {
        grid-template-columns: 1fr;
      }
    }
  `;wi([Q({type:Number})],Rt.prototype,"jobId",2);wi([Q({type:String})],Rt.prototype,"from",2);wi([v()],Rt.prototype,"job",2);wi([v()],Rt.prototype,"logData",2);wi([v()],Rt.prototype,"error",2);wi([v()],Rt.prototype,"loading",2);wi([v()],Rt.prototype,"expandedOutput",2);Rt=wi([ke("esp-job-page")],Rt);var pk=Object.defineProperty,gk=Object.getOwnPropertyDescriptor,Es=(t,e,i,s)=>{for(var r=s>1?void 0:s?gk(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&pk(e,i,r),r};let bi=class extends de{constructor(){super(...arguments),this.logs=[],this.error="",this.loading=!0,this.fullscreen=!1,this.connected=!1,this.eventSource=null,this.handleFullscreenChange=()=>{this.fullscreen=!!document.fullscreenElement}}connectedCallback(){super.connectedCallback(),this.connect()}connect(){this.disconnect(),this.loading=!0,this.error="",this.logs=[],this.eventSource=S.activityLog(t=>{this.logs=[t,...this.logs],this.loading=!1,this.connected=!0,this.requestUpdate()},()=>{this.loading=!1},t=>{this.loading=!1,this.logs.length===0&&(this.error="Could not load activity log")})}disconnect(){this.eventSource&&(this.eventSource.close(),this.eventSource=null,this.connected=!1)}clearLogs(){this.logs=[]}downloadLog(){const t=this.logs.join(`
`),e=new Blob([t],{type:"text/plain"}),i=URL.createObjectURL(e),s=document.createElement("a");s.href=i,s.download="activity.log",s.click(),URL.revokeObjectURL(i)}toggleFullscreen(){var t,e;this.fullscreen?(e=document.exitFullscreen)==null||e.call(document):(t=this.requestFullscreen)==null||t.call(this)}firstUpdated(){document.addEventListener("fullscreenchange",this.handleFullscreenChange)}disconnectedCallback(){this.disconnect(),document.removeEventListener("fullscreenchange",this.handleFullscreenChange),super.disconnectedCallback()}renderLine(t){return g`<pre class="log-line">${t}</pre>`}render(){return g`
      <div class="page-header">
        <div class="header-left">
          <a href="#/settings" class="back-btn">\u2190 Back</a>
          <span class="title">Activity Log</span>
          ${this.connected?g`<span class="live-dot" title="Connected"></span>`:""}
        </div>
        <div class="header-controls">
          <button class="ctrl-btn" @click=${this.clearLogs}>Clear</button>
          <button class="ctrl-btn" @click=${this.downloadLog}>Download</button>
          <button class="ctrl-btn" @click=${this.toggleFullscreen}>
            ${this.fullscreen?"Collapse":"Fullscreen"}
          </button>
        </div>
      </div>
      <div class="log-body">
        ${this.error?g`<span class="error-msg">${this.error}</span>`:this.loading&&this.logs.length===0?g`<span class="empty">Loading...</span>`:this.logs.length===0?g`<span class="empty">No activity yet</span>`:this.logs.map(t=>this.renderLine(t))}
      </div>
    `}};bi.styles=we`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--bg);
      color: var(--text);
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    :host([hidden]) {
      display: none;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid var(--line);
      background: var(--surface);
      flex-shrink: 0;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .back-btn {
      color: var(--primary);
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background 0.12s;
    }
    .back-btn:hover {
      background: rgba(255,255,255,0.05);
    }
    .title {
      font-size: 15px;
      font-weight: 600;
    }
    .live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 6px #22c55e;
    }
    .header-controls {
      display: flex;
      gap: 6px;
    }
    .ctrl-btn {
      border: 1px solid rgba(255,255,255,0.1);
      background: transparent;
      color: var(--muted);
      font-family: inherit;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.12s;
    }
    .ctrl-btn:hover {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }
    .log-body {
      flex: 1;
      overflow-y: auto;
      padding: 12px 16px;
    }
    .log-line {
      margin: 0 0 2px 0;
      color: #c0c5ce;
      font-family: ui-monospace, "SFMono-Regular", "Cascadia Code", "Liberation Mono", monospace;
      font-size: 12px;
      line-height: 1.5;
      white-space: pre-wrap;
      word-break: break-all;
    }
    .empty, .error-msg {
      color: var(--muted);
      font-size: 13px;
      font-style: italic;
    }
    .error-msg {
      color: #ef4444;
    }

    :host(:fullscreen) {
      position: fixed;
      inset: 0;
      z-index: 9999;
    }
    :host(:fullscreen) .page-header {
      position: sticky;
      top: 0;
      z-index: 1;
    }
    :host(:fullscreen) .log-body {
      max-height: none;
      height: calc(100vh - 53px);
    }
  `;Es([v()],bi.prototype,"logs",2);Es([v()],bi.prototype,"error",2);Es([v()],bi.prototype,"loading",2);Es([v()],bi.prototype,"fullscreen",2);Es([v()],bi.prototype,"connected",2);bi=Es([ke("esp-activity-log-page")],bi);/*! js-yaml 4.1.1 https://github.com/nodeca/js-yaml @license MIT */function Dp(t){return typeof t>"u"||t===null}function mk(t){return typeof t=="object"&&t!==null}function bk(t){return Array.isArray(t)?t:Dp(t)?[]:[t]}function vk(t,e){var i,s,r,n;if(e)for(n=Object.keys(e),i=0,s=n.length;i<s;i+=1)r=n[i],t[r]=e[r];return t}function yk(t,e){var i="",s;for(s=0;s<e;s+=1)i+=t;return i}function xk(t){return t===0&&Number.NEGATIVE_INFINITY===1/t}var wk=Dp,kk=mk,Sk=bk,Ck=yk,Ok=xk,Ak=vk,Fe={isNothing:wk,isObject:kk,toArray:Sk,repeat:Ck,isNegativeZero:Ok,extend:Ak};function _p(t,e){var i="",s=t.reason||"(unknown reason)";return t.mark?(t.mark.name&&(i+='in "'+t.mark.name+'" '),i+="("+(t.mark.line+1)+":"+(t.mark.column+1)+")",!e&&t.mark.snippet&&(i+=`

`+t.mark.snippet),s+" "+i):s}function xr(t,e){Error.call(this),this.name="YAMLException",this.reason=t,this.mark=e,this.message=_p(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack||""}xr.prototype=Object.create(Error.prototype);xr.prototype.constructor=xr;xr.prototype.toString=function(e){return this.name+": "+_p(this,e)};var Vt=xr;function ta(t,e,i,s,r){var n="",o="",a=Math.floor(r/2)-1;return s-e>a&&(n=" ... ",e=s-a+n.length),i-s>a&&(o=" ...",i=s+a-o.length),{str:n+t.slice(e,i).replace(/\t/g,"→")+o,pos:s-e+n.length}}function ia(t,e){return Fe.repeat(" ",e-t.length)+t}function $k(t,e){if(e=Object.create(e||null),!t.buffer)return null;e.maxLength||(e.maxLength=79),typeof e.indent!="number"&&(e.indent=1),typeof e.linesBefore!="number"&&(e.linesBefore=3),typeof e.linesAfter!="number"&&(e.linesAfter=2);for(var i=/\r?\n|\r|\0/g,s=[0],r=[],n,o=-1;n=i.exec(t.buffer);)r.push(n.index),s.push(n.index+n[0].length),t.position<=n.index&&o<0&&(o=s.length-2);o<0&&(o=s.length-1);var a="",l,c,h=Math.min(t.line+e.linesAfter,r.length).toString().length,d=e.maxLength-(e.indent+h+3);for(l=1;l<=e.linesBefore&&!(o-l<0);l++)c=ta(t.buffer,s[o-l],r[o-l],t.position-(s[o]-s[o-l]),d),a=Fe.repeat(" ",e.indent)+ia((t.line-l+1).toString(),h)+" | "+c.str+`
`+a;for(c=ta(t.buffer,s[o],r[o],t.position,d),a+=Fe.repeat(" ",e.indent)+ia((t.line+1).toString(),h)+" | "+c.str+`
`,a+=Fe.repeat("-",e.indent+h+3+c.pos)+`^
`,l=1;l<=e.linesAfter&&!(o+l>=r.length);l++)c=ta(t.buffer,s[o+l],r[o+l],t.position-(s[o]-s[o+l]),d),a+=Fe.repeat(" ",e.indent)+ia((t.line+l+1).toString(),h)+" | "+c.str+`
`;return a.replace(/\n$/,"")}var Pk=$k,Tk=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],Mk=["scalar","sequence","mapping"];function Ek(t){var e={};return t!==null&&Object.keys(t).forEach(function(i){t[i].forEach(function(s){e[String(s)]=i})}),e}function Dk(t,e){if(e=e||{},Object.keys(e).forEach(function(i){if(Tk.indexOf(i)===-1)throw new Vt('Unknown option "'+i+'" is met in definition of "'+t+'" YAML type.')}),this.options=e,this.tag=t,this.kind=e.kind||null,this.resolve=e.resolve||function(){return!0},this.construct=e.construct||function(i){return i},this.instanceOf=e.instanceOf||null,this.predicate=e.predicate||null,this.represent=e.represent||null,this.representName=e.representName||null,this.defaultStyle=e.defaultStyle||null,this.multi=e.multi||!1,this.styleAliases=Ek(e.styleAliases||null),Mk.indexOf(this.kind)===-1)throw new Vt('Unknown kind "'+this.kind+'" is specified for "'+t+'" YAML type.')}var Ee=Dk;function pd(t,e){var i=[];return t[e].forEach(function(s){var r=i.length;i.forEach(function(n,o){n.tag===s.tag&&n.kind===s.kind&&n.multi===s.multi&&(r=o)}),i[r]=s}),i}function _k(){var t={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}},e,i;function s(r){r.multi?(t.multi[r.kind].push(r),t.multi.fallback.push(r)):t[r.kind][r.tag]=t.fallback[r.tag]=r}for(e=0,i=arguments.length;e<i;e+=1)arguments[e].forEach(s);return t}function sl(t){return this.extend(t)}sl.prototype.extend=function(e){var i=[],s=[];if(e instanceof Ee)s.push(e);else if(Array.isArray(e))s=s.concat(e);else if(e&&(Array.isArray(e.implicit)||Array.isArray(e.explicit)))e.implicit&&(i=i.concat(e.implicit)),e.explicit&&(s=s.concat(e.explicit));else throw new Vt("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");i.forEach(function(n){if(!(n instanceof Ee))throw new Vt("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(n.loadKind&&n.loadKind!=="scalar")throw new Vt("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(n.multi)throw new Vt("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),s.forEach(function(n){if(!(n instanceof Ee))throw new Vt("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var r=Object.create(sl.prototype);return r.implicit=(this.implicit||[]).concat(i),r.explicit=(this.explicit||[]).concat(s),r.compiledImplicit=pd(r,"implicit"),r.compiledExplicit=pd(r,"explicit"),r.compiledTypeMap=_k(r.compiledImplicit,r.compiledExplicit),r};var Bk=sl,Rk=new Ee("tag:yaml.org,2002:str",{kind:"scalar",construct:function(t){return t!==null?t:""}}),Lk=new Ee("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(t){return t!==null?t:[]}}),Ik=new Ee("tag:yaml.org,2002:map",{kind:"mapping",construct:function(t){return t!==null?t:{}}}),Fk=new Bk({explicit:[Rk,Lk,Ik]});function Nk(t){if(t===null)return!0;var e=t.length;return e===1&&t==="~"||e===4&&(t==="null"||t==="Null"||t==="NULL")}function zk(){return null}function Hk(t){return t===null}var Wk=new Ee("tag:yaml.org,2002:null",{kind:"scalar",resolve:Nk,construct:zk,predicate:Hk,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});function Uk(t){if(t===null)return!1;var e=t.length;return e===4&&(t==="true"||t==="True"||t==="TRUE")||e===5&&(t==="false"||t==="False"||t==="FALSE")}function qk(t){return t==="true"||t==="True"||t==="TRUE"}function Vk(t){return Object.prototype.toString.call(t)==="[object Boolean]"}var Qk=new Ee("tag:yaml.org,2002:bool",{kind:"scalar",resolve:Uk,construct:qk,predicate:Vk,represent:{lowercase:function(t){return t?"true":"false"},uppercase:function(t){return t?"TRUE":"FALSE"},camelcase:function(t){return t?"True":"False"}},defaultStyle:"lowercase"});function jk(t){return 48<=t&&t<=57||65<=t&&t<=70||97<=t&&t<=102}function Kk(t){return 48<=t&&t<=55}function Xk(t){return 48<=t&&t<=57}function Jk(t){if(t===null)return!1;var e=t.length,i=0,s=!1,r;if(!e)return!1;if(r=t[i],(r==="-"||r==="+")&&(r=t[++i]),r==="0"){if(i+1===e)return!0;if(r=t[++i],r==="b"){for(i++;i<e;i++)if(r=t[i],r!=="_"){if(r!=="0"&&r!=="1")return!1;s=!0}return s&&r!=="_"}if(r==="x"){for(i++;i<e;i++)if(r=t[i],r!=="_"){if(!jk(t.charCodeAt(i)))return!1;s=!0}return s&&r!=="_"}if(r==="o"){for(i++;i<e;i++)if(r=t[i],r!=="_"){if(!Kk(t.charCodeAt(i)))return!1;s=!0}return s&&r!=="_"}}if(r==="_")return!1;for(;i<e;i++)if(r=t[i],r!=="_"){if(!Xk(t.charCodeAt(i)))return!1;s=!0}return!(!s||r==="_")}function Yk(t){var e=t,i=1,s;if(e.indexOf("_")!==-1&&(e=e.replace(/_/g,"")),s=e[0],(s==="-"||s==="+")&&(s==="-"&&(i=-1),e=e.slice(1),s=e[0]),e==="0")return 0;if(s==="0"){if(e[1]==="b")return i*parseInt(e.slice(2),2);if(e[1]==="x")return i*parseInt(e.slice(2),16);if(e[1]==="o")return i*parseInt(e.slice(2),8)}return i*parseInt(e,10)}function Gk(t){return Object.prototype.toString.call(t)==="[object Number]"&&t%1===0&&!Fe.isNegativeZero(t)}var Zk=new Ee("tag:yaml.org,2002:int",{kind:"scalar",resolve:Jk,construct:Yk,predicate:Gk,represent:{binary:function(t){return t>=0?"0b"+t.toString(2):"-0b"+t.toString(2).slice(1)},octal:function(t){return t>=0?"0o"+t.toString(8):"-0o"+t.toString(8).slice(1)},decimal:function(t){return t.toString(10)},hexadecimal:function(t){return t>=0?"0x"+t.toString(16).toUpperCase():"-0x"+t.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),eS=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function tS(t){return!(t===null||!eS.test(t)||t[t.length-1]==="_")}function iS(t){var e,i;return e=t.replace(/_/g,"").toLowerCase(),i=e[0]==="-"?-1:1,"+-".indexOf(e[0])>=0&&(e=e.slice(1)),e===".inf"?i===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:e===".nan"?NaN:i*parseFloat(e,10)}var sS=/^[-+]?[0-9]+e/;function rS(t,e){var i;if(isNaN(t))switch(e){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===t)switch(e){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===t)switch(e){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(Fe.isNegativeZero(t))return"-0.0";return i=t.toString(10),sS.test(i)?i.replace("e",".e"):i}function nS(t){return Object.prototype.toString.call(t)==="[object Number]"&&(t%1!==0||Fe.isNegativeZero(t))}var oS=new Ee("tag:yaml.org,2002:float",{kind:"scalar",resolve:tS,construct:iS,predicate:nS,represent:rS,defaultStyle:"lowercase"}),aS=Fk.extend({implicit:[Wk,Qk,Zk,oS]}),lS=aS,Bp=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),Rp=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function cS(t){return t===null?!1:Bp.exec(t)!==null||Rp.exec(t)!==null}function hS(t){var e,i,s,r,n,o,a,l=0,c=null,h,d,f;if(e=Bp.exec(t),e===null&&(e=Rp.exec(t)),e===null)throw new Error("Date resolve error");if(i=+e[1],s=+e[2]-1,r=+e[3],!e[4])return new Date(Date.UTC(i,s,r));if(n=+e[4],o=+e[5],a=+e[6],e[7]){for(l=e[7].slice(0,3);l.length<3;)l+="0";l=+l}return e[9]&&(h=+e[10],d=+(e[11]||0),c=(h*60+d)*6e4,e[9]==="-"&&(c=-c)),f=new Date(Date.UTC(i,s,r,n,o,a,l)),c&&f.setTime(f.getTime()-c),f}function dS(t){return t.toISOString()}var fS=new Ee("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:cS,construct:hS,instanceOf:Date,represent:dS});function uS(t){return t==="<<"||t===null}var pS=new Ee("tag:yaml.org,2002:merge",{kind:"scalar",resolve:uS}),Gl=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function gS(t){if(t===null)return!1;var e,i,s=0,r=t.length,n=Gl;for(i=0;i<r;i++)if(e=n.indexOf(t.charAt(i)),!(e>64)){if(e<0)return!1;s+=6}return s%8===0}function mS(t){var e,i,s=t.replace(/[\r\n=]/g,""),r=s.length,n=Gl,o=0,a=[];for(e=0;e<r;e++)e%4===0&&e&&(a.push(o>>16&255),a.push(o>>8&255),a.push(o&255)),o=o<<6|n.indexOf(s.charAt(e));return i=r%4*6,i===0?(a.push(o>>16&255),a.push(o>>8&255),a.push(o&255)):i===18?(a.push(o>>10&255),a.push(o>>2&255)):i===12&&a.push(o>>4&255),new Uint8Array(a)}function bS(t){var e="",i=0,s,r,n=t.length,o=Gl;for(s=0;s<n;s++)s%3===0&&s&&(e+=o[i>>18&63],e+=o[i>>12&63],e+=o[i>>6&63],e+=o[i&63]),i=(i<<8)+t[s];return r=n%3,r===0?(e+=o[i>>18&63],e+=o[i>>12&63],e+=o[i>>6&63],e+=o[i&63]):r===2?(e+=o[i>>10&63],e+=o[i>>4&63],e+=o[i<<2&63],e+=o[64]):r===1&&(e+=o[i>>2&63],e+=o[i<<4&63],e+=o[64],e+=o[64]),e}function vS(t){return Object.prototype.toString.call(t)==="[object Uint8Array]"}var yS=new Ee("tag:yaml.org,2002:binary",{kind:"scalar",resolve:gS,construct:mS,predicate:vS,represent:bS}),xS=Object.prototype.hasOwnProperty,wS=Object.prototype.toString;function kS(t){if(t===null)return!0;var e=[],i,s,r,n,o,a=t;for(i=0,s=a.length;i<s;i+=1){if(r=a[i],o=!1,wS.call(r)!=="[object Object]")return!1;for(n in r)if(xS.call(r,n))if(!o)o=!0;else return!1;if(!o)return!1;if(e.indexOf(n)===-1)e.push(n);else return!1}return!0}function SS(t){return t!==null?t:[]}var CS=new Ee("tag:yaml.org,2002:omap",{kind:"sequence",resolve:kS,construct:SS}),OS=Object.prototype.toString;function AS(t){if(t===null)return!0;var e,i,s,r,n,o=t;for(n=new Array(o.length),e=0,i=o.length;e<i;e+=1){if(s=o[e],OS.call(s)!=="[object Object]"||(r=Object.keys(s),r.length!==1))return!1;n[e]=[r[0],s[r[0]]]}return!0}function $S(t){if(t===null)return[];var e,i,s,r,n,o=t;for(n=new Array(o.length),e=0,i=o.length;e<i;e+=1)s=o[e],r=Object.keys(s),n[e]=[r[0],s[r[0]]];return n}var PS=new Ee("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:AS,construct:$S}),TS=Object.prototype.hasOwnProperty;function MS(t){if(t===null)return!0;var e,i=t;for(e in i)if(TS.call(i,e)&&i[e]!==null)return!1;return!0}function ES(t){return t!==null?t:{}}var DS=new Ee("tag:yaml.org,2002:set",{kind:"mapping",resolve:MS,construct:ES}),_S=lS.extend({implicit:[fS,pS],explicit:[yS,CS,PS,DS]}),vi=Object.prototype.hasOwnProperty,Kn=1,Lp=2,Ip=3,Xn=4,sa=1,BS=2,gd=3,RS=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,LS=/[\x85\u2028\u2029]/,IS=/[,\[\]\{\}]/,Fp=/^(?:!|!!|![a-z\-]+!)$/i,Np=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function md(t){return Object.prototype.toString.call(t)}function _t(t){return t===10||t===13}function zi(t){return t===9||t===32}function Ve(t){return t===9||t===32||t===10||t===13}function ns(t){return t===44||t===91||t===93||t===123||t===125}function FS(t){var e;return 48<=t&&t<=57?t-48:(e=t|32,97<=e&&e<=102?e-97+10:-1)}function NS(t){return t===120?2:t===117?4:t===85?8:0}function zS(t){return 48<=t&&t<=57?t-48:-1}function bd(t){return t===48?"\0":t===97?"\x07":t===98?"\b":t===116||t===9?"	":t===110?`
`:t===118?"\v":t===102?"\f":t===114?"\r":t===101?"\x1B":t===32?" ":t===34?'"':t===47?"/":t===92?"\\":t===78?"":t===95?" ":t===76?"\u2028":t===80?"\u2029":""}function HS(t){return t<=65535?String.fromCharCode(t):String.fromCharCode((t-65536>>10)+55296,(t-65536&1023)+56320)}function zp(t,e,i){e==="__proto__"?Object.defineProperty(t,e,{configurable:!0,enumerable:!0,writable:!0,value:i}):t[e]=i}var Hp=new Array(256),Wp=new Array(256);for(var Xi=0;Xi<256;Xi++)Hp[Xi]=bd(Xi)?1:0,Wp[Xi]=bd(Xi);function WS(t,e){this.input=t,this.filename=e.filename||null,this.schema=e.schema||_S,this.onWarning=e.onWarning||null,this.legacy=e.legacy||!1,this.json=e.json||!1,this.listener=e.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=t.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function Up(t,e){var i={name:t.filename,buffer:t.input.slice(0,-1),position:t.position,line:t.line,column:t.position-t.lineStart};return i.snippet=Pk(i),new Vt(e,i)}function I(t,e){throw Up(t,e)}function Jn(t,e){t.onWarning&&t.onWarning.call(null,Up(t,e))}var vd={YAML:function(e,i,s){var r,n,o;e.version!==null&&I(e,"duplication of %YAML directive"),s.length!==1&&I(e,"YAML directive accepts exactly one argument"),r=/^([0-9]+)\.([0-9]+)$/.exec(s[0]),r===null&&I(e,"ill-formed argument of the YAML directive"),n=parseInt(r[1],10),o=parseInt(r[2],10),n!==1&&I(e,"unacceptable YAML version of the document"),e.version=s[0],e.checkLineBreaks=o<2,o!==1&&o!==2&&Jn(e,"unsupported YAML version of the document")},TAG:function(e,i,s){var r,n;s.length!==2&&I(e,"TAG directive accepts exactly two arguments"),r=s[0],n=s[1],Fp.test(r)||I(e,"ill-formed tag handle (first argument) of the TAG directive"),vi.call(e.tagMap,r)&&I(e,'there is a previously declared suffix for "'+r+'" tag handle'),Np.test(n)||I(e,"ill-formed tag prefix (second argument) of the TAG directive");try{n=decodeURIComponent(n)}catch{I(e,"tag prefix is malformed: "+n)}e.tagMap[r]=n}};function ai(t,e,i,s){var r,n,o,a;if(e<i){if(a=t.input.slice(e,i),s)for(r=0,n=a.length;r<n;r+=1)o=a.charCodeAt(r),o===9||32<=o&&o<=1114111||I(t,"expected valid JSON character");else RS.test(a)&&I(t,"the stream contains non-printable characters");t.result+=a}}function yd(t,e,i,s){var r,n,o,a;for(Fe.isObject(i)||I(t,"cannot merge mappings; the provided source object is unacceptable"),r=Object.keys(i),o=0,a=r.length;o<a;o+=1)n=r[o],vi.call(e,n)||(zp(e,n,i[n]),s[n]=!0)}function os(t,e,i,s,r,n,o,a,l){var c,h;if(Array.isArray(r))for(r=Array.prototype.slice.call(r),c=0,h=r.length;c<h;c+=1)Array.isArray(r[c])&&I(t,"nested arrays are not supported inside keys"),typeof r=="object"&&md(r[c])==="[object Object]"&&(r[c]="[object Object]");if(typeof r=="object"&&md(r)==="[object Object]"&&(r="[object Object]"),r=String(r),e===null&&(e={}),s==="tag:yaml.org,2002:merge")if(Array.isArray(n))for(c=0,h=n.length;c<h;c+=1)yd(t,e,n[c],i);else yd(t,e,n,i);else!t.json&&!vi.call(i,r)&&vi.call(e,r)&&(t.line=o||t.line,t.lineStart=a||t.lineStart,t.position=l||t.position,I(t,"duplicated mapping key")),zp(e,r,n),delete i[r];return e}function Zl(t){var e;e=t.input.charCodeAt(t.position),e===10?t.position++:e===13?(t.position++,t.input.charCodeAt(t.position)===10&&t.position++):I(t,"a line break is expected"),t.line+=1,t.lineStart=t.position,t.firstTabInLine=-1}function be(t,e,i){for(var s=0,r=t.input.charCodeAt(t.position);r!==0;){for(;zi(r);)r===9&&t.firstTabInLine===-1&&(t.firstTabInLine=t.position),r=t.input.charCodeAt(++t.position);if(e&&r===35)do r=t.input.charCodeAt(++t.position);while(r!==10&&r!==13&&r!==0);if(_t(r))for(Zl(t),r=t.input.charCodeAt(t.position),s++,t.lineIndent=0;r===32;)t.lineIndent++,r=t.input.charCodeAt(++t.position);else break}return i!==-1&&s!==0&&t.lineIndent<i&&Jn(t,"deficient indentation"),s}function po(t){var e=t.position,i;return i=t.input.charCodeAt(e),!!((i===45||i===46)&&i===t.input.charCodeAt(e+1)&&i===t.input.charCodeAt(e+2)&&(e+=3,i=t.input.charCodeAt(e),i===0||Ve(i)))}function ec(t,e){e===1?t.result+=" ":e>1&&(t.result+=Fe.repeat(`
`,e-1))}function US(t,e,i){var s,r,n,o,a,l,c,h,d=t.kind,f=t.result,u;if(u=t.input.charCodeAt(t.position),Ve(u)||ns(u)||u===35||u===38||u===42||u===33||u===124||u===62||u===39||u===34||u===37||u===64||u===96||(u===63||u===45)&&(r=t.input.charCodeAt(t.position+1),Ve(r)||i&&ns(r)))return!1;for(t.kind="scalar",t.result="",n=o=t.position,a=!1;u!==0;){if(u===58){if(r=t.input.charCodeAt(t.position+1),Ve(r)||i&&ns(r))break}else if(u===35){if(s=t.input.charCodeAt(t.position-1),Ve(s))break}else{if(t.position===t.lineStart&&po(t)||i&&ns(u))break;if(_t(u))if(l=t.line,c=t.lineStart,h=t.lineIndent,be(t,!1,-1),t.lineIndent>=e){a=!0,u=t.input.charCodeAt(t.position);continue}else{t.position=o,t.line=l,t.lineStart=c,t.lineIndent=h;break}}a&&(ai(t,n,o,!1),ec(t,t.line-l),n=o=t.position,a=!1),zi(u)||(o=t.position+1),u=t.input.charCodeAt(++t.position)}return ai(t,n,o,!1),t.result?!0:(t.kind=d,t.result=f,!1)}function qS(t,e){var i,s,r;if(i=t.input.charCodeAt(t.position),i!==39)return!1;for(t.kind="scalar",t.result="",t.position++,s=r=t.position;(i=t.input.charCodeAt(t.position))!==0;)if(i===39)if(ai(t,s,t.position,!0),i=t.input.charCodeAt(++t.position),i===39)s=t.position,t.position++,r=t.position;else return!0;else _t(i)?(ai(t,s,r,!0),ec(t,be(t,!1,e)),s=r=t.position):t.position===t.lineStart&&po(t)?I(t,"unexpected end of the document within a single quoted scalar"):(t.position++,r=t.position);I(t,"unexpected end of the stream within a single quoted scalar")}function VS(t,e){var i,s,r,n,o,a;if(a=t.input.charCodeAt(t.position),a!==34)return!1;for(t.kind="scalar",t.result="",t.position++,i=s=t.position;(a=t.input.charCodeAt(t.position))!==0;){if(a===34)return ai(t,i,t.position,!0),t.position++,!0;if(a===92){if(ai(t,i,t.position,!0),a=t.input.charCodeAt(++t.position),_t(a))be(t,!1,e);else if(a<256&&Hp[a])t.result+=Wp[a],t.position++;else if((o=NS(a))>0){for(r=o,n=0;r>0;r--)a=t.input.charCodeAt(++t.position),(o=FS(a))>=0?n=(n<<4)+o:I(t,"expected hexadecimal character");t.result+=HS(n),t.position++}else I(t,"unknown escape sequence");i=s=t.position}else _t(a)?(ai(t,i,s,!0),ec(t,be(t,!1,e)),i=s=t.position):t.position===t.lineStart&&po(t)?I(t,"unexpected end of the document within a double quoted scalar"):(t.position++,s=t.position)}I(t,"unexpected end of the stream within a double quoted scalar")}function QS(t,e){var i=!0,s,r,n,o=t.tag,a,l=t.anchor,c,h,d,f,u,p=Object.create(null),m,b,x,k;if(k=t.input.charCodeAt(t.position),k===91)h=93,u=!1,a=[];else if(k===123)h=125,u=!0,a={};else return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=a),k=t.input.charCodeAt(++t.position);k!==0;){if(be(t,!0,e),k=t.input.charCodeAt(t.position),k===h)return t.position++,t.tag=o,t.anchor=l,t.kind=u?"mapping":"sequence",t.result=a,!0;i?k===44&&I(t,"expected the node content, but found ','"):I(t,"missed comma between flow collection entries"),b=m=x=null,d=f=!1,k===63&&(c=t.input.charCodeAt(t.position+1),Ve(c)&&(d=f=!0,t.position++,be(t,!0,e))),s=t.line,r=t.lineStart,n=t.position,Os(t,e,Kn,!1,!0),b=t.tag,m=t.result,be(t,!0,e),k=t.input.charCodeAt(t.position),(f||t.line===s)&&k===58&&(d=!0,k=t.input.charCodeAt(++t.position),be(t,!0,e),Os(t,e,Kn,!1,!0),x=t.result),u?os(t,a,p,b,m,x,s,r,n):d?a.push(os(t,null,p,b,m,x,s,r,n)):a.push(m),be(t,!0,e),k=t.input.charCodeAt(t.position),k===44?(i=!0,k=t.input.charCodeAt(++t.position)):i=!1}I(t,"unexpected end of the stream within a flow collection")}function jS(t,e){var i,s,r=sa,n=!1,o=!1,a=e,l=0,c=!1,h,d;if(d=t.input.charCodeAt(t.position),d===124)s=!1;else if(d===62)s=!0;else return!1;for(t.kind="scalar",t.result="";d!==0;)if(d=t.input.charCodeAt(++t.position),d===43||d===45)sa===r?r=d===43?gd:BS:I(t,"repeat of a chomping mode identifier");else if((h=zS(d))>=0)h===0?I(t,"bad explicit indentation width of a block scalar; it cannot be less than one"):o?I(t,"repeat of an indentation width identifier"):(a=e+h-1,o=!0);else break;if(zi(d)){do d=t.input.charCodeAt(++t.position);while(zi(d));if(d===35)do d=t.input.charCodeAt(++t.position);while(!_t(d)&&d!==0)}for(;d!==0;){for(Zl(t),t.lineIndent=0,d=t.input.charCodeAt(t.position);(!o||t.lineIndent<a)&&d===32;)t.lineIndent++,d=t.input.charCodeAt(++t.position);if(!o&&t.lineIndent>a&&(a=t.lineIndent),_t(d)){l++;continue}if(t.lineIndent<a){r===gd?t.result+=Fe.repeat(`
`,n?1+l:l):r===sa&&n&&(t.result+=`
`);break}for(s?zi(d)?(c=!0,t.result+=Fe.repeat(`
`,n?1+l:l)):c?(c=!1,t.result+=Fe.repeat(`
`,l+1)):l===0?n&&(t.result+=" "):t.result+=Fe.repeat(`
`,l):t.result+=Fe.repeat(`
`,n?1+l:l),n=!0,o=!0,l=0,i=t.position;!_t(d)&&d!==0;)d=t.input.charCodeAt(++t.position);ai(t,i,t.position,!1)}return!0}function xd(t,e){var i,s=t.tag,r=t.anchor,n=[],o,a=!1,l;if(t.firstTabInLine!==-1)return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=n),l=t.input.charCodeAt(t.position);l!==0&&(t.firstTabInLine!==-1&&(t.position=t.firstTabInLine,I(t,"tab characters must not be used in indentation")),!(l!==45||(o=t.input.charCodeAt(t.position+1),!Ve(o))));){if(a=!0,t.position++,be(t,!0,-1)&&t.lineIndent<=e){n.push(null),l=t.input.charCodeAt(t.position);continue}if(i=t.line,Os(t,e,Ip,!1,!0),n.push(t.result),be(t,!0,-1),l=t.input.charCodeAt(t.position),(t.line===i||t.lineIndent>e)&&l!==0)I(t,"bad indentation of a sequence entry");else if(t.lineIndent<e)break}return a?(t.tag=s,t.anchor=r,t.kind="sequence",t.result=n,!0):!1}function KS(t,e,i){var s,r,n,o,a,l,c=t.tag,h=t.anchor,d={},f=Object.create(null),u=null,p=null,m=null,b=!1,x=!1,k;if(t.firstTabInLine!==-1)return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=d),k=t.input.charCodeAt(t.position);k!==0;){if(!b&&t.firstTabInLine!==-1&&(t.position=t.firstTabInLine,I(t,"tab characters must not be used in indentation")),s=t.input.charCodeAt(t.position+1),n=t.line,(k===63||k===58)&&Ve(s))k===63?(b&&(os(t,d,f,u,p,null,o,a,l),u=p=m=null),x=!0,b=!0,r=!0):b?(b=!1,r=!0):I(t,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),t.position+=1,k=s;else{if(o=t.line,a=t.lineStart,l=t.position,!Os(t,i,Lp,!1,!0))break;if(t.line===n){for(k=t.input.charCodeAt(t.position);zi(k);)k=t.input.charCodeAt(++t.position);if(k===58)k=t.input.charCodeAt(++t.position),Ve(k)||I(t,"a whitespace character is expected after the key-value separator within a block mapping"),b&&(os(t,d,f,u,p,null,o,a,l),u=p=m=null),x=!0,b=!1,r=!1,u=t.tag,p=t.result;else if(x)I(t,"can not read an implicit mapping pair; a colon is missed");else return t.tag=c,t.anchor=h,!0}else if(x)I(t,"can not read a block mapping entry; a multiline key may not be an implicit key");else return t.tag=c,t.anchor=h,!0}if((t.line===n||t.lineIndent>e)&&(b&&(o=t.line,a=t.lineStart,l=t.position),Os(t,e,Xn,!0,r)&&(b?p=t.result:m=t.result),b||(os(t,d,f,u,p,m,o,a,l),u=p=m=null),be(t,!0,-1),k=t.input.charCodeAt(t.position)),(t.line===n||t.lineIndent>e)&&k!==0)I(t,"bad indentation of a mapping entry");else if(t.lineIndent<e)break}return b&&os(t,d,f,u,p,null,o,a,l),x&&(t.tag=c,t.anchor=h,t.kind="mapping",t.result=d),x}function XS(t){var e,i=!1,s=!1,r,n,o;if(o=t.input.charCodeAt(t.position),o!==33)return!1;if(t.tag!==null&&I(t,"duplication of a tag property"),o=t.input.charCodeAt(++t.position),o===60?(i=!0,o=t.input.charCodeAt(++t.position)):o===33?(s=!0,r="!!",o=t.input.charCodeAt(++t.position)):r="!",e=t.position,i){do o=t.input.charCodeAt(++t.position);while(o!==0&&o!==62);t.position<t.length?(n=t.input.slice(e,t.position),o=t.input.charCodeAt(++t.position)):I(t,"unexpected end of the stream within a verbatim tag")}else{for(;o!==0&&!Ve(o);)o===33&&(s?I(t,"tag suffix cannot contain exclamation marks"):(r=t.input.slice(e-1,t.position+1),Fp.test(r)||I(t,"named tag handle cannot contain such characters"),s=!0,e=t.position+1)),o=t.input.charCodeAt(++t.position);n=t.input.slice(e,t.position),IS.test(n)&&I(t,"tag suffix cannot contain flow indicator characters")}n&&!Np.test(n)&&I(t,"tag name cannot contain such characters: "+n);try{n=decodeURIComponent(n)}catch{I(t,"tag name is malformed: "+n)}return i?t.tag=n:vi.call(t.tagMap,r)?t.tag=t.tagMap[r]+n:r==="!"?t.tag="!"+n:r==="!!"?t.tag="tag:yaml.org,2002:"+n:I(t,'undeclared tag handle "'+r+'"'),!0}function JS(t){var e,i;if(i=t.input.charCodeAt(t.position),i!==38)return!1;for(t.anchor!==null&&I(t,"duplication of an anchor property"),i=t.input.charCodeAt(++t.position),e=t.position;i!==0&&!Ve(i)&&!ns(i);)i=t.input.charCodeAt(++t.position);return t.position===e&&I(t,"name of an anchor node must contain at least one character"),t.anchor=t.input.slice(e,t.position),!0}function YS(t){var e,i,s;if(s=t.input.charCodeAt(t.position),s!==42)return!1;for(s=t.input.charCodeAt(++t.position),e=t.position;s!==0&&!Ve(s)&&!ns(s);)s=t.input.charCodeAt(++t.position);return t.position===e&&I(t,"name of an alias node must contain at least one character"),i=t.input.slice(e,t.position),vi.call(t.anchorMap,i)||I(t,'unidentified alias "'+i+'"'),t.result=t.anchorMap[i],be(t,!0,-1),!0}function Os(t,e,i,s,r){var n,o,a,l=1,c=!1,h=!1,d,f,u,p,m,b;if(t.listener!==null&&t.listener("open",t),t.tag=null,t.anchor=null,t.kind=null,t.result=null,n=o=a=Xn===i||Ip===i,s&&be(t,!0,-1)&&(c=!0,t.lineIndent>e?l=1:t.lineIndent===e?l=0:t.lineIndent<e&&(l=-1)),l===1)for(;XS(t)||JS(t);)be(t,!0,-1)?(c=!0,a=n,t.lineIndent>e?l=1:t.lineIndent===e?l=0:t.lineIndent<e&&(l=-1)):a=!1;if(a&&(a=c||r),(l===1||Xn===i)&&(Kn===i||Lp===i?m=e:m=e+1,b=t.position-t.lineStart,l===1?a&&(xd(t,b)||KS(t,b,m))||QS(t,m)?h=!0:(o&&jS(t,m)||qS(t,m)||VS(t,m)?h=!0:YS(t)?(h=!0,(t.tag!==null||t.anchor!==null)&&I(t,"alias node should not have any properties")):US(t,m,Kn===i)&&(h=!0,t.tag===null&&(t.tag="?")),t.anchor!==null&&(t.anchorMap[t.anchor]=t.result)):l===0&&(h=a&&xd(t,b))),t.tag===null)t.anchor!==null&&(t.anchorMap[t.anchor]=t.result);else if(t.tag==="?"){for(t.result!==null&&t.kind!=="scalar"&&I(t,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+t.kind+'"'),d=0,f=t.implicitTypes.length;d<f;d+=1)if(p=t.implicitTypes[d],p.resolve(t.result)){t.result=p.construct(t.result),t.tag=p.tag,t.anchor!==null&&(t.anchorMap[t.anchor]=t.result);break}}else if(t.tag!=="!"){if(vi.call(t.typeMap[t.kind||"fallback"],t.tag))p=t.typeMap[t.kind||"fallback"][t.tag];else for(p=null,u=t.typeMap.multi[t.kind||"fallback"],d=0,f=u.length;d<f;d+=1)if(t.tag.slice(0,u[d].tag.length)===u[d].tag){p=u[d];break}p||I(t,"unknown tag !<"+t.tag+">"),t.result!==null&&p.kind!==t.kind&&I(t,"unacceptable node kind for !<"+t.tag+'> tag; it should be "'+p.kind+'", not "'+t.kind+'"'),p.resolve(t.result,t.tag)?(t.result=p.construct(t.result,t.tag),t.anchor!==null&&(t.anchorMap[t.anchor]=t.result)):I(t,"cannot resolve a node with !<"+t.tag+"> explicit tag")}return t.listener!==null&&t.listener("close",t),t.tag!==null||t.anchor!==null||h}function GS(t){var e=t.position,i,s,r,n=!1,o;for(t.version=null,t.checkLineBreaks=t.legacy,t.tagMap=Object.create(null),t.anchorMap=Object.create(null);(o=t.input.charCodeAt(t.position))!==0&&(be(t,!0,-1),o=t.input.charCodeAt(t.position),!(t.lineIndent>0||o!==37));){for(n=!0,o=t.input.charCodeAt(++t.position),i=t.position;o!==0&&!Ve(o);)o=t.input.charCodeAt(++t.position);for(s=t.input.slice(i,t.position),r=[],s.length<1&&I(t,"directive name must not be less than one character in length");o!==0;){for(;zi(o);)o=t.input.charCodeAt(++t.position);if(o===35){do o=t.input.charCodeAt(++t.position);while(o!==0&&!_t(o));break}if(_t(o))break;for(i=t.position;o!==0&&!Ve(o);)o=t.input.charCodeAt(++t.position);r.push(t.input.slice(i,t.position))}o!==0&&Zl(t),vi.call(vd,s)?vd[s](t,s,r):Jn(t,'unknown document directive "'+s+'"')}if(be(t,!0,-1),t.lineIndent===0&&t.input.charCodeAt(t.position)===45&&t.input.charCodeAt(t.position+1)===45&&t.input.charCodeAt(t.position+2)===45?(t.position+=3,be(t,!0,-1)):n&&I(t,"directives end mark is expected"),Os(t,t.lineIndent-1,Xn,!1,!0),be(t,!0,-1),t.checkLineBreaks&&LS.test(t.input.slice(e,t.position))&&Jn(t,"non-ASCII line breaks are interpreted as content"),t.documents.push(t.result),t.position===t.lineStart&&po(t)){t.input.charCodeAt(t.position)===46&&(t.position+=3,be(t,!0,-1));return}if(t.position<t.length-1)I(t,"end of the stream or a document separator is expected");else return}function ZS(t,e){t=String(t),e=e||{},t.length!==0&&(t.charCodeAt(t.length-1)!==10&&t.charCodeAt(t.length-1)!==13&&(t+=`
`),t.charCodeAt(0)===65279&&(t=t.slice(1)));var i=new WS(t,e),s=t.indexOf("\0");for(s!==-1&&(i.position=s,I(i,"null byte is not allowed in input")),i.input+="\0";i.input.charCodeAt(i.position)===32;)i.lineIndent+=1,i.position+=1;for(;i.position<i.length-1;)GS(i);return i.documents}function eC(t,e){var i=ZS(t,e);if(i.length!==0){if(i.length===1)return i[0];throw new Vt("expected a single document in the stream, but found more")}}var tC=eC,iC={load:tC},sC=iC.load,rC=Object.defineProperty,nC=Object.getOwnPropertyDescriptor,L=(t,e,i,s)=>{for(var r=s>1?void 0:s?nC(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&rC(e,i,r),r};const Oi={"ESP32-C5":{label:"ESP32-C5 (esp32-c5-devkitc-1)",board_info:{platform:"esp32",board:"esp32-c5-devkitc-1",framework:"esp-idf",variant:"esp32c5"}},"ESP32-C6":{label:"ESP32-C6 (esp32-c6-devkitc)",board_info:{platform:"esp32",board:"esp32-c6-devkitc",framework:"esp-idf",variant:"esp32c6"}},"ESP32-S3":{label:"ESP32-S3 (esp32-s3-devkitc-1)",board_info:{platform:"esp32",board:"esp32-s3-devkitc-1",framework:"esp-idf",variant:"esp32s3"}},"ESP32-C3":{label:"ESP32-C3 (esp32-c3-devkitm-1)",board_info:{platform:"esp32",board:"esp32-c3-devkitm-1",framework:"esp-idf",variant:"esp32c3"}},"ESP32-S2":{label:"ESP32-S2 (esp32-s2-saola)",board_info:{platform:"esp32",board:"esp32-s2-saola",framework:"esp-idf",variant:"esp32s2"}},ESP32:{label:"ESP32 (esp32dev)",board_info:{platform:"esp32",board:"esp32dev",framework:"esp-idf"}},"ESP32-H2":{label:"ESP32-H2 (esp32-h2-devkitm-1)",board_info:{platform:"esp32",board:"esp32-h2-devkitm-1",framework:"esp-idf",variant:"esp32h2"}},"ESP32-C2":{label:"ESP32-C2 (esp32-c2-devkitm-1)",board_info:{platform:"esp32",board:"esp32-c2-devkitm-1",framework:"esp-idf",variant:"esp32c2"}}};function wd(t){if(!t)return null;const e=t.trim().toUpperCase().replace(/\s+/g,""),i=["ESP32-C61","ESP32-C6","ESP32-C5","ESP32-C3","ESP32-C2","ESP32-H2","ESP32-P4","ESP32-S3","ESP32-S2","ESP32"];for(const s of i){const r=s.replace(/-/g,"");if(e.includes(s)||e.includes(r))return s}return null}let E=class extends de{constructor(){super(...arguments),this.step1="choose",this.step1Choice="choose",this.step2="disabled",this.step3="disabled",this.discoveredBridges=[],this.bridgeError=null,this.manualHost="",this.manualPort=80,this.manualApiKey="",this.apiKeyInput="",this.selectedBridge=null,this.restartError=null,this.integrationError=null,this.runningIntegrationVersion=null,this.latestIntegrationVersion=null,this.integrationDetected=!1,this.bridgeApiStatus=null,this.statusPollTimer=null,this.integrationPollTimer=null,this.integrationFailures=0,this.pollingSeconds=0,this.discoveryTimer=null,this.discoveryTimeoutTimer=null,this.doneTimer=null,this.validatePollTimer=null,this.validateAttempts=0,this.activeBridgeUuid=null,this.bridgeHost=null,this.bridgePort=80,this.pollStartTime=0,this.lastIntegrationSetupAttemptAt=0,this.flashTab="discover",this.flashStage="config",this.flashName="espnow-bridge",this.flashNetworkId="",this.flashPsk="",this.flashWifiSsid="",this.flashWifiPassword="",this.flashApiKey="",this.flashEspnowMode="lr",this.flashOtaPassword="",this.flashChipName="",this.flashTransport="wifi",this.flashSerialPort="",this.flashSerialPorts=[],this.flashSerialPortScanning=!1,this.flashSerialFlashStatus="",this.flashSerialFlashError="",this.flashSerialFlashTimer=null,this.flashBoardInfo=null,this.flashBrowserDetecting=!1,this.flashBrowserDetectError="",this.flashDetectedChip="",this.flashSecretsWarning="",this.flashConfigError="",this.flashMac="",this.flashCompileLog="",this.flashCompilePercent=0,this.flashCompileStatus="",this.flashCompileError="",this.flashFlashError="",this.flashDetectElapsed=0,this.flashDetectError="",this.flashBrowserManifestUrl="",this.flashCompilePollTimer=null,this.flashDetectTimer=null,this.flashCompileLogEs=null,this.flashBrowserFirmwareBlobUrl="",this.serialPorts=[],this.serialScanning=!1,this.serialSelectedPort="",this.serialBaud=460800,this.serialApiKey="",this.serialName="",this.serialError=null}connectedCallback(){super.connectedCallback(),this.initFromBridgeConfig()}updated(t){var e;if(super.updated(t),t.has("flashCompileLog")){const i=(e=this.shadowRoot)==null?void 0:e.getElementById("flash-log-viewer");i&&(i.scrollTop=i.scrollHeight)}}async initFromBridgeConfig(){const t=await S.setupStatus();this.captureStatus(t);const e=this.integrationReady(t);t.bridge.configured?(this.activeBridgeUuid=t.bridge.uuid||null,this.bridgeHost=t.bridge.ip||null,t.bridge.connected?(this.step1="complete",this.startConfiguredBridgeFlow(t,e)):(this.step1="pending",this.validateAttempts=0,this.discoveryTimer&&(clearInterval(this.discoveryTimer),this.discoveryTimer=null),this.activeBridgeUuid&&S.bridgeReconnect(this.activeBridgeUuid),this.validatePollTimer=setInterval(()=>void this.pollValidateStatus(),1e3))):(this.step2!=="disabled"&&(this.step2="disabled"),this.step3!=="disabled"&&(this.step3="disabled"),this.step1="choose",this.step1Choice="choose",this.statusPollTimer=setInterval(()=>void this.pollStatus(),E.STATUS_POLL_INTERVAL_MS))}async startConfiguredBridgeFlow(t,e){t.restart.required?["restarting","polling","complete"].includes(this.step2)||(this.step2="ready"):(this.step2="complete",e?(this.step3="complete",this.onAllDone()):this.step3==="disabled"&&this.triggerIntegrationSetup()),this.statusPollTimer=setInterval(()=>void this.pollStatus(),E.STATUS_POLL_INTERVAL_MS)}get browserSupportsUsbFlash(){return typeof window<"u"&&window.isSecureContext&&"serial"in navigator}get flashChipFamily(){return wd(this.flashChipName)}clearFlashBrowserManifestUrl(){this.flashBrowserManifestUrl&&(URL.revokeObjectURL(this.flashBrowserManifestUrl),this.flashBrowserManifestUrl=""),this.flashBrowserFirmwareBlobUrl&&(URL.revokeObjectURL(this.flashBrowserFirmwareBlobUrl),this.flashBrowserFirmwareBlobUrl="")}async updateFlashBrowserManifestUrl(){if(!this.flashMac)return;const t=this.flashChipFamily;if(!t){this.clearFlashBrowserManifestUrl();return}try{const e=await fetch(S.downloadFactoryBinary(this.flashMac));if(!e.ok){this.clearFlashBrowserManifestUrl();return}const i=await e.blob(),s=URL.createObjectURL(i),r={name:this.flashName,version:"compiled",new_install_prompt_erase:!0,builds:[{chipFamily:t,parts:[{path:s,offset:0}]}]},n=new Blob([JSON.stringify(r)],{type:"application/json"}),o=URL.createObjectURL(n);this.clearFlashBrowserManifestUrl(),this.flashBrowserManifestUrl=o,this.flashBrowserFirmwareBlobUrl=s}catch{this.clearFlashBrowserManifestUrl()}}async pollValidateStatus(){if(this.step1!=="pending"){this.validatePollTimer&&(clearInterval(this.validatePollTimer),this.validatePollTimer=null);return}this.validateAttempts++;try{const t=await S.setupStatus();if(this.captureStatus(t),t.bridge.connected){this.step1="complete",this.validatePollTimer&&(clearInterval(this.validatePollTimer),this.validatePollTimer=null),this.startConfiguredBridgeFlow(t,this.integrationReady(t));return}}catch{}this.validateAttempts>=3&&(this.validatePollTimer&&(clearInterval(this.validatePollTimer),this.validatePollTimer=null),this.step1="error",this.startDiscovery(),this.statusPollTimer=setInterval(()=>void this.pollStatus(),E.STATUS_POLL_INTERVAL_MS))}disconnectedCallback(){this.statusPollTimer&&(clearInterval(this.statusPollTimer),this.statusPollTimer=null),this.integrationPollTimer&&(clearInterval(this.integrationPollTimer),this.integrationPollTimer=null),this.discoveryTimer&&(clearInterval(this.discoveryTimer),this.discoveryTimer=null),this.discoveryTimeoutTimer&&(clearTimeout(this.discoveryTimeoutTimer),this.discoveryTimeoutTimer=null),this.validatePollTimer&&(clearInterval(this.validatePollTimer),this.validatePollTimer=null),this.doneTimer&&(clearTimeout(this.doneTimer),this.doneTimer=null),this.flashCompilePollTimer&&(clearInterval(this.flashCompilePollTimer),this.flashCompilePollTimer=null),this.flashDetectTimer&&(clearInterval(this.flashDetectTimer),this.flashDetectTimer=null),this.flashCompileLogEs&&(this.flashCompileLogEs.close(),this.flashCompileLogEs=null),this.clearFlashBrowserManifestUrl(),super.disconnectedCallback()}async startDiscovery(){this.discoveryTimer&&(clearInterval(this.discoveryTimer),this.discoveryTimer=null),this.discoveryTimeoutTimer&&(clearTimeout(this.discoveryTimeoutTimer),this.discoveryTimeoutTimer=null),this.step1!=="complete"&&(this.step1="scanning"),this.bridgeError=null,await this.refreshDiscoveredBridges(),S.triggerScan().catch(t=>{const e=t instanceof Error?t.message:String(t);e.toLowerCase().includes("already")||(this.bridgeError=e)}),this.discoveryTimer=setInterval(()=>void this.refreshDiscoveredBridges(),2e3),this.discoveryTimeoutTimer=setTimeout(()=>{this.discoveryTimeoutTimer=null,this.discoveryTimer&&(clearInterval(this.discoveryTimer),this.discoveryTimer=null),this.step1==="scanning"&&(this.step1="error",this.bridgeError="No bridges found. Make sure your bridge is powered on and connected to the same network, then try again.")},E.MAX_DISCOVERY_DURATION_MS)}async refreshDiscoveredBridges(){if(!(this.step1==="complete"||this.step1==="connecting"||this.step1==="pending"))try{const t=await S.discoverBridges();this.discoveredBridges=t.bridges,this.discoveredBridges.length>0?(this.step1="found",this.bridgeError=null,this.discoveryTimer&&(clearInterval(this.discoveryTimer),this.discoveryTimer=null),this.discoveryTimeoutTimer&&(clearTimeout(this.discoveryTimeoutTimer),this.discoveryTimeoutTimer=null)):t.scanning?this.step1!=="error"&&(this.step1="scanning"):(this.step1="error",this.bridgeError="No bridges found. Make sure your bridge is powered on and connected to the same network, then try again.",this.discoveryTimer&&(clearInterval(this.discoveryTimer),this.discoveryTimer=null),this.discoveryTimeoutTimer&&(clearTimeout(this.discoveryTimeoutTimer),this.discoveryTimeoutTimer=null))}catch(t){this.bridgeError=t instanceof Error?t.message:String(t)}}async pollStatus(){try{const t=await S.setupStatus();this.captureStatus(t);const e=this.integrationReady(t);t.bridge.configured&&this.step1!=="pending"?(this.step1="complete",this.discoveryTimer&&(clearInterval(this.discoveryTimer),this.discoveryTimer=null),t.restart.required?["restarting","polling","complete"].includes(this.step2)||(this.step2="ready"):(this.step2="complete",!e&&this.step3==="disabled"&&this.triggerIntegrationSetup())):(this.step2!=="disabled"&&(this.step2="disabled"),this.step3!=="disabled"&&(this.step3="disabled")),t.bridge.configured&&!t.restart.required&&this.step2==="polling"&&(this.step2="complete",this.pollingSeconds=0,!e&&this.step3==="disabled"&&this.triggerIntegrationSetup()),e&&(this.step3="complete",this.integrationFailures=0,this.step1==="complete"&&this.step2==="complete"&&this.onAllDone()),this.step2==="polling"&&(this.pollingSeconds+=E.STATUS_POLL_INTERVAL_S)}catch{}}captureStatus(t){this.runningIntegrationVersion=t.integration.live_version||t.restart.running_version||t.integration.version||t.integration.runtime_version||null,this.latestIntegrationVersion=t.restart.latest_version||t.integration.latest_version||null,this.integrationDetected=!!(t.integration.loaded||t.integration.live_connected||t.integration.runtime_loaded||t.integration.entry_loaded||t.integration.ws_client_connected||t.integration.configured),t.bridge.ws_connected?this.bridgeApiStatus=`Bridge protobuf online: ${t.bridge.ip||t.bridge.hostname||"bridge"}`:this.bridgeApiStatus=null}integrationReady(t){const e=t.integration;return!!(e.configured||e.entry_loaded||e.ws_client_connected||e.loaded&&e.connected)&&!t.restart.required}async connectBridgeBySelect(t){if(!this.apiKeyInput.trim()){this.bridgeError="API key is required";return}this.step1="connecting",this.bridgeError=null;try{await S.selectBridge(t.host,t.port,t.name,t.version,this.apiKeyInput,t.network_id,t.hostname),this.step1="complete",this.step2="ready",this.pollStatus()}catch(e){this.step1="found",this.bridgeError=e instanceof Error?e.message:String(e)}}async connectManualBridge(){if(!this.manualHost.trim()){this.bridgeError="Host is required";return}this.step1="connecting",this.bridgeError=null;try{await S.addBridge(this.manualHost.trim(),this.manualPort,void 0,this.manualApiKey||"",""),this.step1="complete",this.step2="ready",this.pollStatus()}catch(t){this.step1=this.discoveredBridges.length>0?"found":"error",this.bridgeError=t instanceof Error?t.message:String(t)}}selectBridgeForApiKey(t){this.selectedBridge=t,this.discoveryTimer&&(clearInterval(this.discoveryTimer),this.discoveryTimer=null)}async handleRestart(){this.step2="restarting",this.restartError=null;try{const t=await S.requestRestart();t.success?(this.step2="polling",this.pollingSeconds=0):(this.step2="error",this.restartError=t.error||"Restart failed")}catch{this.step2="polling",this.pollingSeconds=0,this.restartError=null}}triggerIntegrationSetup(){["triggering","polling","complete"].includes(this.step3)||(this.step3="triggering",this.integrationError=null,this.integrationFailures=0,this.lastIntegrationSetupAttemptAt=Date.now(),S.integrationSetup().then(async t=>{const e=await S.setupStatus();if(this.captureStatus(e),this.integrationReady(e)){this.step3="complete",this.onAllDone();return}if(t.entry_created&&!t.restart_required){this.step3="complete",this.onAllDone();return}if(t.success&&!t.entry_created&&!t.restart_required){this.step3="fallback",this.integrationError="Integration created — restart Home Assistant first, then add ESP Tree in Devices & Services.";return}t.success?(this.step3="polling",this.pollStartTime=Date.now(),this.integrationPollTimer||(this.integrationPollTimer=setInterval(()=>void this.pollIntegrationForEntry(),E.STATUS_POLL_INTERVAL_MS))):(this.step3="error",this.integrationError=t.error||"Failed to set up integration")}).catch(t=>{this.step3="error",this.integrationError=t instanceof Error?t.message:String(t)}))}async pollIntegrationForEntry(){try{const t=await S.setupStatus();if(this.captureStatus(t),this.integrationFailures=0,this.integrationReady(t)){this.step3="complete",this.integrationPollTimer&&(clearInterval(this.integrationPollTimer),this.integrationPollTimer=null),this.onAllDone();return}const e=Date.now();if(e-this.lastIntegrationSetupAttemptAt>=1e4){this.lastIntegrationSetupAttemptAt=e;const i=await S.integrationSetup();if(i.entry_created&&!i.restart_required){this.step3="complete",this.integrationPollTimer&&(clearInterval(this.integrationPollTimer),this.integrationPollTimer=null),this.onAllDone();return}}Date.now()-this.pollStartTime>E.MAX_POLL_DURATION_MS&&(this.integrationPollTimer&&(clearInterval(this.integrationPollTimer),this.integrationPollTimer=null),this.step3="fallback")}catch{this.integrationFailures++,this.integrationFailures>=10&&(this.integrationPollTimer&&(clearInterval(this.integrationPollTimer),this.integrationPollTimer=null),this.step3="fallback")}}async onAllDone(){this.doneTimer||(this.doneTimer=setTimeout(()=>{this.doneTimer=null,window.location.hash="/"},2e3))}dismiss(){this.doneTimer&&(clearTimeout(this.doneTimer),this.doneTimer=null),this.dispatchEvent(new CustomEvent("setup-dismissed",{bubbles:!0,composed:!0})),window.location.hash="/"}retryDiscovery(){this.startDiscovery()}retryConnection(){this.step1="pending",this.validateAttempts=0,this.activeBridgeUuid&&S.bridgeReconnect(this.activeBridgeUuid),this.statusPollTimer&&(clearInterval(this.statusPollTimer),this.statusPollTimer=null),this.validatePollTimer=setInterval(()=>void this.pollValidateStatus(),1e3)}onChooseExistingBridge(){this.step1Choice="existing",this.flashTab="discover",this.startDiscovery()}onChooseNewBridge(){this.step1Choice="new",this.flashTab="flash",this.loadFlashWizardDefaults()}onBackToChoose(){this.step1Choice="choose",this.step1="choose",this.bridgeError=null}async loadFlashWizardDefaults(){try{const t=await S.getSecrets().catch(()=>null);t!=null&&t.content&&this.parseSecretsForFlash(t.content),this.flashApiKey||(this.flashApiKey=this.generateRandomBase64(18)),this.flashOtaPassword||(this.flashOtaPassword=this.generateRandomHex(16))}catch{this.flashApiKey||(this.flashApiKey=this.generateRandomBase64(18)),this.flashOtaPassword||(this.flashOtaPassword=this.generateRandomHex(16))}}parseSecretsForFlash(t){if(!(!t||!t.trim()))try{const e=sC(t);if(!e||typeof e!="object")return;const i=e,s=typeof i.wifi_ssid=="string"?i.wifi_ssid:"",r=typeof i.wifi_password=="string"?i.wifi_password:"",n=typeof i.ota_password=="string"?i.ota_password:"",o=typeof i.bridge_api_key=="string"?i.bridge_api_key:"",a=typeof i.espnow_network_id=="string"?i.espnow_network_id:"",l=typeof i.espnow_psk=="string"?i.espnow_psk:"";s&&(this.flashWifiSsid=s),r&&(this.flashWifiPassword=r),n&&(this.flashOtaPassword=n),o&&(this.flashApiKey=o),a&&(this.flashNetworkId=a),l&&(this.flashPsk=l),a||l?this.flashSecretsWarning="Existing network credentials detected. Changing Network ID or PSK will break communication with any existing remotes on this network.":this.flashSecretsWarning=""}catch{}}generateRandomBase64(t){const e=new Uint8Array(t);return crypto.getRandomValues(e),btoa(String.fromCharCode(...e)).replace(/[+/=]/g,"").slice(0,24)}generateRandomHex(t){const e=new Uint8Array(t);return crypto.getRandomValues(e),Array.from(e).map(i=>i.toString(16).padStart(2,"0")).join("")}async detectFlashBoardInBrowser(){this.flashBrowserDetecting=!0,this.flashBrowserDetectError="",this.flashDetectedChip="";let t=null;try{if(typeof window>"u"||!window.isSecureContext)throw new Error("Browser USB detection requires a secure HTTPS page");const e=navigator.serial;if(!e)throw new Error("Web Serial is not available. Use Chrome or Edge, or select the board manually");const i=await e.requestPort(),r=await import("https://unpkg.com/esptool-js@0.6.1/bundle.js");t=new r.Transport(i,!0);const n=new r.ESPLoader({transport:t,baudrate:115200,terminal:{clean:()=>{},writeLine:()=>{},write:()=>{}},debugLogging:!1}),o=String(await n.main()),a=wd(o);if(!a||!Oi[a])throw new Error(`Detected ${o}, but there is no supported board mapping for it`);this.flashChipName=a,this.flashBoardInfo=Oi[a].board_info,this.flashDetectedChip=o}catch(e){this.flashBrowserDetectError=e instanceof Error?e.message:String(e)}finally{if(t)try{await t.disconnect()}catch{}this.flashBrowserDetecting=!1}}onFlashChipChange(t){var e;this.flashChipName=t,this.flashBoardInfo=((e=Oi[t])==null?void 0:e.board_info)||null,this.flashDetectedChip="",this.flashBrowserDetectError=""}validateFlashConfig(){const t=[];return this.flashName.trim()||t.push("ESPHome Name is required"),/^[a-z][a-z0-9-]*$/.test(this.flashName.trim())||t.push("ESPHome Name must be lowercase letters, numbers, and hyphens"),this.flashNetworkId.trim()||t.push("ESP-NOW Network ID is required"),this.flashPsk.trim()||t.push("ESP-NOW PSK is required"),!this.flashWifiSsid.trim()&&this.flashTransport==="wifi"&&t.push("WiFi SSID is required"),!this.flashWifiPassword.trim()&&this.flashTransport==="wifi"&&t.push("WiFi Password is required"),/^[0-9a-fA-F]{64}$/.test(this.flashPsk.trim())||t.push("PSK must be 64 hex characters"),(!this.flashChipName||!Oi[this.flashChipName]||!this.flashBoardInfo)&&t.push("Board selection is required"),t.length>0?(this.flashConfigError=t.join(". ")+".",!1):(this.flashConfigError="",!0)}async onSubmitFlashConfig(){var e;if(!this.validateFlashConfig())return;this.flashStage="compiling",this.flashCompileLog="",this.flashCompilePercent=0,this.flashCompileStatus="",this.flashCompileError="",this.flashFlashError="",this.clearFlashBrowserManifestUrl();const t=this.flashBoardInfo||((e=Oi[this.flashChipName])==null?void 0:e.board_info)||{};try{const i=await S.submitFlashWizard({name:this.flashName.trim(),network_id:this.flashNetworkId.trim(),psk:this.flashPsk.trim(),wifi_ssid:this.flashWifiSsid.trim(),wifi_password:this.flashWifiPassword,api_key:this.flashApiKey,espnow_mode:this.flashEspnowMode,ota_password:this.flashOtaPassword,chip_name:this.flashChipName,board_info:t,transport:this.flashTransport,serial_port:this.flashTransport==="serial"?this.flashSerialPort:""});this.flashMac=i.mac,this.pollCompileStatus(),this.startCompileLogStream()}catch(i){this.flashCompileError=i instanceof Error?i.message:String(i),this.flashStage="error"}}async pollCompileStatus(){if(!(this.flashStage!=="compiling"||!this.flashMac)){try{const t=await S.getCompileStatus(this.flashMac),e=t.status||"";if(e==="idle"&&(this.flashCompileLog+=`[status: idle — waiting for compile job to start]
`),this.flashCompileStatus=e,this.flashCompilePercent=e==="compiled"?100:e==="failed"?0:e==="compile_queued"?t.queue_position!=null?Math.max(5,100-(t.queue_position||1)*10):5:e==="compiling"?Math.max(this.flashCompilePercent,10):Math.max(this.flashCompilePercent,2),e==="compiled"){this.flashCompilePercent=100,this.flashCompilePollTimer&&(clearInterval(this.flashCompilePollTimer),this.flashCompilePollTimer=null),this.flashCompileLogEs&&(this.flashCompileLogEs.close(),this.flashCompileLogEs=null),await this.updateFlashBrowserManifestUrl(),this.flashStage==="compiling"&&(this.flashStage="flashing");return}if(e==="failed"){this.flashCompileError=t.error||"Compilation failed",this.flashStage="error",this.cleanupFlashTimers();return}}catch(t){this.flashCompileLog+=`[poll error: ${t instanceof Error?t.message:String(t)}]
`}this.flashStage==="compiling"&&(this.flashCompilePollTimer=setTimeout(()=>void this.pollCompileStatus(),2e3))}}startCompileLogStream(){this.flashMac&&(this.flashCompileLogEs=S.streamCompileLogs(this.flashMac,t=>{this.flashCompileLog+=t+`
`},t=>{this.flashCompileLog+=`[SSE error: ${t.type||"connection failed"}]
`}))}get flashCompileStatusLabel(){return{idle:"Waiting to start...",compile_queued:"Queued for compilation...",compiling:"Compiling...",compiled:"Compile complete!",failed:"Compilation failed"}[this.flashCompileStatus]||this.flashCompileStatus}async scanFlashSerialPorts(){this.flashSerialPortScanning=!0;try{const t=await S.scanSerialPorts();this.flashSerialPorts=t,t.length===0&&(this.flashSerialFlashError="No serial ports found on the add-on host.")}catch(t){this.flashSerialFlashError=t instanceof Error?t.message:String(t)}finally{this.flashSerialPortScanning=!1}}async startSerialFlashFromWizard(){if(!(!this.flashMac||!this.flashSerialPort)){this.flashSerialFlashError="",this.flashSerialFlashStatus="flashing";try{await S.startSerialFlash(this.flashMac,this.flashSerialPort)}catch(t){this.flashSerialFlashError=t instanceof Error?t.message:String(t),this.flashSerialFlashStatus="failed";return}this.flashSerialFlashTimer=setInterval(()=>void this.pollSerialFlashStatus(),2e3)}}async pollSerialFlashStatus(){if(this.flashMac)try{const t=await S.getSerialFlashStatus(this.flashMac),e=t.status||"idle";this.flashSerialFlashStatus=e,(e==="success"||e==="failed")&&(this.flashSerialFlashTimer&&(clearInterval(this.flashSerialFlashTimer),this.flashSerialFlashTimer=null),e==="failed"&&(this.flashSerialFlashError=t.error||"Serial flash failed"))}catch{}}async startDetection(){if(this.flashStage="detecting",this.flashDetectElapsed=0,this.flashDetectError="",this.flashTransport==="serial")try{await S.finalizeFlashWizard()}catch{}else await S.triggerScan().catch(()=>{});this.flashDetectTimer=setInterval(()=>void this.pollFlashWizardStatus(),2e3)}async pollFlashWizardStatus(){if(this.flashStage!=="detecting"){this.flashDetectTimer&&(clearInterval(this.flashDetectTimer),this.flashDetectTimer=null);return}if(this.flashDetectElapsed+=2,this.flashDetectElapsed>=90){this.flashDetectTimer&&(clearInterval(this.flashDetectTimer),this.flashDetectTimer=null),this.flashDetectError=this.flashTransport==="serial"?"Bridge did not authenticate over serial within 90 seconds. Check the port is correct and the bridge is powered.":"Bridge not found within 90 seconds. Ensure the bridge is powered on and connected to WiFi.",this.flashStage="error";return}try{(await S.getFlashWizardStatus()).bridge_detected&&(this.flashDetectTimer&&(clearInterval(this.flashDetectTimer),this.flashDetectTimer=null),this.flashStage="complete",this.step1="complete",this.step2="ready",this.pollStatus())}catch{}}get flashBackLabel(){return this.flashStage==="detecting"||this.flashStage==="error"&&this.flashDetectError?"← Back to Flash":this.flashStage==="flashing"||this.flashStage==="compiling"||this.flashStage==="error"?"← Back to Configure":"← Back"}async handleFlashBack(){if(this.flashStage==="detecting"||this.flashStage==="error"&&this.flashDetectError){this.flashDetectTimer&&(clearInterval(this.flashDetectTimer),this.flashDetectTimer=null),this.flashDetectElapsed=0,this.flashDetectError="",this.flashStage="flashing";return}if(this.flashStage==="flashing"||this.flashStage==="error"){this.resetFlashWizard();return}if(this.flashStage==="compiling"){this.flashMac&&await S.cancelCompile(this.flashMac).catch(()=>{}),this.resetFlashWizard();return}this.onBackToChoose()}resetFlashWizard(){this.cleanupFlashTimers(),this.flashStage="config",this.flashCompileLog="",this.flashCompilePercent=0,this.flashCompileStatus="",this.flashCompileError="",this.flashFlashError="",this.flashDetectElapsed=0,this.flashDetectError="",this.flashMac="",this.flashConfigError=""}cleanupFlashTimers(){this.flashCompilePollTimer&&(clearInterval(this.flashCompilePollTimer),this.flashCompilePollTimer=null),this.flashDetectTimer&&(clearInterval(this.flashDetectTimer),this.flashDetectTimer=null),this.flashCompileLogEs&&(this.flashCompileLogEs.close(),this.flashCompileLogEs=null),this.clearFlashBrowserManifestUrl()}render(){return g`
      <div class="wizard-page">
        <header class="wizard-header">
          <div>
            <h1>ESP-Tree Setup</h1>
            <p class="tagline">Connect your ESP-NOW bridge and get started.</p>
          </div>
          <button class="dismiss-btn" @click=${this.dismiss}>Close and go to topology</button>
        </header>

        <div class="stepper">
          ${this.renderStep1()}
          ${this.renderStep2()}
          ${this.renderStep3()}
          ${this.renderDone()}
        </div>
      </div>
    `}renderStep1(){const t=this.step1==="complete"&&this.step2!=="disabled";return g`
      <div class="step ${t?"collapsed":""} ${this.step1==="complete"?"done":""} ${this.step1==="error"?"has-error":""}">
        <div class="step-header" @click=${()=>{t&&this.requestUpdate()}}>
          <span class="step-icon">
            ${this.step1==="choose"?"1":this.step1==="scanning"?g`<span class="spinner"></span>`:this.step1==="connecting"?g`<span class="spinner"></span>`:this.step1==="pending"?g`<span class="spinner"></span>`:this.step1==="complete"?"✅":this.step1==="error"?"❌":"1"}
          </span>
          <div class="step-title-area">
            <h2>Connect Your ESP32 Bridge</h2>
            <p class="step-summary">
              ${this.step1==="choose"?"Choose how to set up your bridge":this.step1==="scanning"?"Scanning for bridges on your network...":this.step1==="found"?`${this.discoveredBridges.length} bridge(s) found`:this.step1==="connecting"?"Connecting to bridge...":this.step1==="pending"?"Validating bridge connection...":this.step1==="complete"?"Bridge connected":this.step1==="error"?this.activeBridgeUuid?"Bridge offline":"No bridges found":""}
            </p>
          </div>
          ${t?g`<span class="collapse-icon">\u25B6</span>`:y}
        </div>

        ${t?y:g`
          <div class="step-body">
            ${this.step1==="choose"&&this.step1Choice==="choose"?g`
              <div class="choice-cards">
                <button class="choice-card" @click=${this.onChooseExistingBridge}>
                  <span class="choice-icon">\u{1F50C}</span>
                  <h3>I Already Have a Bridge</h3>
                  <p>Scan your network for an existing ESP-NOW bridge or enter its address manually.</p>
                </button>
                <button class="choice-card" @click=${this.onChooseNewBridge}>
                  <span class="choice-icon">\u{1F4E1}</span>
                  <h3>Set Up a New Bridge</h3>
                  <p>Flash ESP-NOW firmware onto a new ESP32 device and configure it.</p>
                </button>
              </div>
            `:y}

            ${this.step1Choice==="existing"&&this.step1!=="complete"?g`
              <div class="choice-back">
                <button class="btn btn-outline btn-sm" @click=${this.onBackToChoose}>\u2190 Back</button>
              </div>
              <div class="step-tabs">
                <button class="tab ${this.flashTab==="discover"?"active":""}" @click=${()=>this.flashTab="discover"}>Discover</button>
                <button class="tab ${this.flashTab==="manual"?"active":""}" @click=${()=>this.flashTab="manual"}>Manual</button>
                <button class="tab ${this.flashTab==="serial"?"active":""}" @click=${()=>this.flashTab="serial"}>Serial</button>
              </div>
              ${this.flashTab==="discover"?this.renderDiscoverTab():y}
              ${this.flashTab==="manual"?this.renderManualTab():y}
              ${this.flashTab==="serial"?this.renderSerialTab():y}
            `:y}

            ${this.step1Choice==="new"&&this.step1!=="complete"?g`
              <div class="choice-back">
                <button class="btn btn-outline btn-sm" @click=${()=>void this.handleFlashBack()}>${this.flashBackLabel}</button>
              </div>
              ${this.renderFlashTab()}
            `:y}

            ${this.step1==="complete"&&this.step2==="disabled"?g`
              <div class="complete-state">
                <span class="check">\u2705</span>
                <span>${this.bridgeApiStatus||"Bridge connected successfully"}</span>
              </div>
            `:y}
          </div>
        `}
      </div>
    `}renderDiscoverTab(){return g`
      ${this.step1==="scanning"||this.step1==="connecting"||this.step1==="pending"?g`
        <div class="scanning-state">
          <span class="spinner large"></span>
          <p>${this.step1==="scanning"?"Scanning for bridges on your network...":this.step1==="connecting"?"Connecting to bridge...":"Validating bridge connection..."}</p>
        </div>
      `:y}

      ${this.step1==="found"?g`
        ${this.discoveredBridges.length>0?g`
          <div class="bridge-list">
            ${this.discoveredBridges.map(t=>g`
              <div class="bridge-card">
                <div class="bridge-info">
                  <strong>${t.name||t.host}</strong>
                  <span>${t.hostname||t.host}:${t.port}</span>
                  ${t.network_id?g`<span class="net-id">Network: ${t.network_id}</span>`:y}
                </div>
                ${this.selectedBridge===t?g`
                  <div class="api-key-row">
                    <input
                      type="password"
                      placeholder="API Key"
                      .value=${this.apiKeyInput}
                      @input=${e=>this.apiKeyInput=e.target.value}
                    />
                    <button class="btn btn-primary" @click=${()=>this.connectBridgeBySelect(t)}>
                      Connect
                    </button>
                  </div>
                `:g`
                  <button class="btn btn-outline" @click=${()=>this.selectBridgeForApiKey(t)}>
                    Connect
                  </button>
                `}
              </div>
            `)}
          </div>
        `:y}
      `:y}

      ${this.step1==="pending"||this.step1==="error"&&this.activeBridgeUuid?g`
        <div class="bridge-list">
            <div class="bridge-card offline">
              <div class="bridge-info">
                <strong>${this.bridgeHost||"Bridge"}</strong>
                <span>${this.bridgeHost?`${this.bridgeHost}:${this.bridgePort}`:""}</span>
                <span class="net-id">Offline</span>
              </div>
              <button class="btn btn-outline" @click=${this.retryConnection}>
                Retry Connection
              </button>
            </div>
        </div>
      `:y}

      ${this.step1==="error"&&!this.activeBridgeUuid?g`
        <div class="error-block">
          <p>${this.bridgeError||"No bridges found on your network."}</p>
          <button class="btn btn-primary" @click=${this.retryDiscovery}>Rescan</button>
          <span class="hint">You can also try the Manual tab to connect by IP address.</span>
        </div>
      `:y}

      ${this.step1!=="connecting"&&this.step1!=="pending"&&this.step1!=="complete"&&!(this.step1==="error"&&!this.activeBridgeUuid)?g`
        ${this.bridgeError?g`
          <div class="error-block">
            <p>${this.bridgeError}</p>
            <button class="btn btn-outline" @click=${this.retryDiscovery}>Retry</button>
          </div>
        `:y}
      `:y}
    `}renderManualTab(){return g`
      <div class="manual-form">
        <label>
          Host / IP
          <input type="text" placeholder="192.168.1.50 or hostname.local" .value=${this.manualHost} @input=${t=>this.manualHost=t.target.value} />
        </label>
        <label>
          Port
          <input type="number" min="1" max="65535" .value=${String(this.manualPort)} @input=${t=>this.manualPort=Number(t.target.value||80)} />
        </label>
        <label>
          API Key
          <input type="password" placeholder="API Key (optional)" .value=${this.manualApiKey} @input=${t=>this.manualApiKey=t.target.value} />
        </label>
        <button class="btn btn-primary" @click=${this.connectManualBridge}>
          Connect
        </button>
      </div>
      ${this.bridgeError?g`
        <div class="error-block">
          <p>${this.bridgeError}</p>
          <button class="btn btn-outline" @click=${this.retryDiscovery}>Retry</button>
        </div>
      `:y}
    `}async scanSerialPorts(){this.serialScanning=!0,this.serialError=null;try{const t=await S.scanSerialPorts();this.serialPorts=t,t.length===0&&(this.serialError="No serial ports found.")}catch(t){this.serialError=t instanceof Error?t.message:String(t)}finally{this.serialScanning=!1}}async connectSerialBridge(){if(!this.serialSelectedPort){this.serialError="Select a serial port";return}this.serialError=null,this.step1="connecting";try{await S.addBridge("",80,this.serialName||void 0,this.serialApiKey||"","","serial",this.serialSelectedPort,this.serialBaud),this.step1="complete",this.step2="ready",this.pollStatus()}catch(t){this.step1="error",this.serialError=t instanceof Error?t.message:String(t)}}renderSerialTab(){return g`
      <div class="manual-form">
        <label>
          Serial Port
          <div class="flash-key-row">
            <select .value=${this.serialSelectedPort} @change=${t=>this.serialSelectedPort=t.target.value}>
              <option value="">-- Select port --</option>
              ${this.serialPorts.map(t=>g`
                <option value=${t.port} ?selected=${this.serialSelectedPort===t.port}>${t.port} — ${t.description}</option>
              `)}
            </select>
            <button class="btn btn-outline btn-sm" @click=${()=>void this.scanSerialPorts()} ?disabled=${this.serialScanning}>
              ${this.serialScanning?"Scanning...":"Scan Ports"}
            </button>
          </div>
        </label>
        <label>
          Baud Rate
          <input type="number" min="9600" max="921600" .value=${String(this.serialBaud)} @input=${t=>this.serialBaud=Number(t.target.value)||460800} />
        </label>
        <label>
          API Key
          <input type="password" placeholder="API Key (optional)" .value=${this.serialApiKey} @input=${t=>this.serialApiKey=t.target.value} />
        </label>
        <label>
          Name
          <input type="text" placeholder="Bridge name (optional)" .value=${this.serialName} @input=${t=>this.serialName=t.target.value} />
        </label>
        <button class="btn btn-primary" @click=${()=>void this.connectSerialBridge()} ?disabled=${this.serialScanning||!this.serialSelectedPort}>
          Connect
        </button>
      </div>
      ${this.serialError?g`
        <div class="error-block">
          <p>${this.serialError}</p>
          <button class="btn btn-outline" @click=${this.retryDiscovery}>Retry</button>
        </div>
      `:y}
    `}renderFlashTab(){var t;return this.flashStage!=="config"?this.renderFlashProgress():g`
      <div class="flash-stage-indicator">
        <span class="stage-dot active">Configure</span>
        <span class="stage-line"></span>
        <span class="stage-dot">Compile</span>
        <span class="stage-line"></span>
        <span class="stage-dot">Flash</span>
        <span class="stage-line"></span>
        <span class="stage-dot">Detect</span>
      </div>

      <div class="flash-form">
        ${this.flashSecretsWarning?g`
          <div class="flash-warning">${this.flashSecretsWarning}</div>
        `:y}
        ${this.flashConfigError?g`
          <div class="error-block"><p>${this.flashConfigError}</p></div>
        `:y}

        <label>
          ESPHome Name
          <input type="text" placeholder="espnow-bridge" .value=${this.flashName} @input=${e=>this.flashName=e.target.value} />
        </label>

        <label>
          ESP-NOW Network ID
          <input type="text" placeholder="ESP-NOW network name" .value=${this.flashNetworkId} @input=${e=>this.flashNetworkId=e.target.value} />
        </label>

        <label>
          ESP-NOW PSK (64 hex chars)
          <div class="flash-key-row">
            <input type="text" placeholder="32-byte hex key" .value=${this.flashPsk} @input=${e=>this.flashPsk=e.target.value} />
            <button class="btn btn-outline btn-sm" @click=${()=>this.flashPsk=this.generateRandomHex(32)}>Generate</button>
          </div>
        </label>

        <label>
          Transport
          <select .value=${this.flashTransport} @change=${e=>this.flashTransport=e.target.value==="serial"?"serial":"wifi"}>
            <option value="wifi">WiFi / MQTT</option>
            <option value="serial">Serial (USB-UART)</option>
          </select>
        </label>

        ${this.flashTransport==="wifi"?g`
          <label>
            WiFi SSID
            <input type="text" placeholder="WiFi network name" .value=${this.flashWifiSsid} @input=${e=>this.flashWifiSsid=e.target.value} />
          </label>

          <label>
            WiFi Password
            <input type="password" placeholder="WiFi password" .value=${this.flashWifiPassword} @input=${e=>this.flashWifiPassword=e.target.value} />
          </label>
        `:g`
          <div class="flash-warning">
            Serial transport: no WiFi credentials are needed. The bridge talks to the add-on over its
            UART0 pins (wired to a USB-UART adapter), and the console is pinned to the same UART so
            boot logs and panic backtraces stay readable.
          </div>
        `}

        <label>
          API Key <span class="muted">(will be remembered by addon)</span>
          <div class="flash-key-row">
            <input type="text" placeholder="Auto-generated" .value=${this.flashApiKey} @input=${e=>this.flashApiKey=e.target.value} />
            <button class="btn btn-outline btn-sm" @click=${()=>this.flashApiKey=this.generateRandomBase64(18)}>Generate</button>
          </div>
        </label>

        <label>
          ESP-NOW Mode
          <select .value=${this.flashEspnowMode} @change=${e=>this.flashEspnowMode=e.target.value}>
            <option value="lr">Long Range (LR)</option>
            <option value="regular">Regular</option>
          </select>
        </label>

        <label>
          OTA Password <span class="muted">(will be remembered by addon)</span>
          <div class="flash-key-row">
            <input type="text" placeholder="Auto-generated" .value=${this.flashOtaPassword} @input=${e=>this.flashOtaPassword=e.target.value} />
            <button class="btn btn-outline btn-sm" @click=${()=>this.flashOtaPassword=this.generateRandomHex(16)}>Generate</button>
          </div>
        </label>

        <label>
          Board
          <div class="flash-key-row">
            <select .value=${this.flashChipName} @change=${e=>this.onFlashChipChange(e.target.value)}>
              <option value="">-- Detect or select board --</option>
              ${Object.entries(Oi).map(([e,i])=>g`
                <option value=${e} ?selected=${this.flashChipName===e}>${i.label}</option>
              `)}
            </select>
            <button class="btn btn-outline btn-sm" @click=${()=>void this.detectFlashBoardInBrowser()} ?disabled=${this.flashBrowserDetecting}>
              ${this.flashBrowserDetecting?"Detecting...":"Detect Connected ESP"}
            </button>
          </div>
        </label>

        ${this.flashDetectedChip?g`
          <div class="chip-badge detected">Detected: ${this.flashDetectedChip} → ${((t=Oi[this.flashChipName])==null?void 0:t.label)||this.flashChipName}</div>
        `:y}
        ${this.flashBrowserDetectError?g`
          <div class="flash-warning">Automatic detection failed: ${this.flashBrowserDetectError}. You can select the board manually.</div>
        `:y}

        <div class="flash-warning">
          Connect the new ESP to this computer by USB and click Detect Connected ESP before compiling. Detection uses Web Serial in Chrome/Edge. Manual board selection is available as a fallback.
        </div>

        <button class="btn btn-primary" @click=${()=>this.onSubmitFlashConfig()} ?disabled=${!this.flashChipName||!this.flashName.trim()}>Compile Bridge Firmware</button>
      </div>
    `}renderFlashProgress(){const e=["config","compiling","flashing","detecting","complete"].indexOf(this.flashStage);return g`
      <div class="flash-stage-indicator">
        <span class="stage-dot ${e>0?"done":"active"}">Configure</span>
        <span class="stage-line ${e>0?"done":""}"></span>
        <span class="stage-dot ${e>1?"done":e===1?"active":""}">Compile</span>
        <span class="stage-line ${e>1?"done":""}"></span>
        <span class="stage-dot ${e>2?"done":e===2?"active":""}">Browser Flash</span>
        <span class="stage-line ${e>2?"done":""}"></span>
        <span class="stage-dot ${e>3?"done":e===3?"active":""}">Detect</span>
      </div>

      ${this.flashStage==="compiling"?g`
        <div class="flash-progress-area">
          <h3>Compiling Firmware</h3>
          <p class="muted">Building ESPHome firmware for ${this.flashName}...</p>
          ${this.flashCompileStatus?g`
            <p class="muted compile-status-label">${this.flashCompileStatusLabel}</p>
          `:y}
          ${this.flashCompilePercent>0?g`
            <div class="progress-bar-container">
              <div class="progress-bar" style="width: ${this.flashCompilePercent}%"></div>
            </div>
            <p class="muted">${this.flashCompilePercent}%</p>
          `:y}
          <div class="flash-log-viewer" id="flash-log-viewer">${this.flashCompileLog}</div>
        </div>
      `:y}

      ${this.flashStage==="flashing"?g`
        <div class="flash-progress-area">
          ${this.flashTransport==="serial"?g`
            <h3>Flash over Serial</h3>
            <p class="muted">Firmware is ready. Select the serial port the bridge is connected to and flash it from the add-on.</p>
            <div class="manual-form">
              <label>
                Serial Port
                <div class="flash-key-row">
                  <select .value=${this.flashSerialPort} @change=${i=>this.flashSerialPort=i.target.value}>
                    <option value="">-- Select port --</option>
                    ${this.flashSerialPorts.map(i=>g`
                      <option value=${i.port} ?selected=${this.flashSerialPort===i.port}>${i.port} — ${i.description}</option>
                    `)}
                  </select>
                  <button class="btn btn-outline btn-sm" @click=${()=>void this.scanFlashSerialPorts()} ?disabled=${this.flashSerialPortScanning}>
                    ${this.flashSerialPortScanning?"Scanning...":"Rescan"}
                  </button>
                </div>
              </label>
            </div>
            ${this.flashSerialFlashStatus==="flashing"?g`
              <div class="progress-bar-container"><div class="progress-bar" style="width: 100%"></div></div>
              <p class="muted">Flashing ${this.flashName}...</p>
            `:y}
            ${this.flashSerialFlashStatus==="success"?g`
              <div class="complete-state"><span class="check">\u2705</span><span>Flashed over serial.</span></div>
            `:y}
            ${this.flashSerialFlashStatus==="failed"?g`
              <div class="flash-warning">Serial flash failed: ${this.flashSerialFlashError||"see log"}</div>
            `:y}
            <div class="flash-error-actions">
              <button class="btn btn-outline" @click=${()=>void this.handleFlashBack()}>Back to Configure</button>
              <button class="btn btn-primary"
                @click=${()=>void this.startSerialFlashFromWizard()}
                ?disabled=${!this.flashSerialPort||this.flashSerialFlashStatus==="flashing"}>Flash over Serial</button>
              <button class="btn btn-primary"
                @click=${()=>void this.startDetection()}
                ?disabled=${!this.flashMac||this.flashSerialFlashStatus!=="success"}>I Flashed It, Connect Bridge</button>
            </div>
          `:g`
            <h3>Flash in Browser</h3>
            <p class="muted">Firmware is ready. Connect ${this.flashName} to this computer by USB and flash it from this page.</p>
            <div class="flash-browser-actions">
              ${this.flashBrowserManifestUrl?g`
                <esp-web-install-button manifest=${this.flashBrowserManifestUrl}>
                  <button slot="activate" class="btn btn-primary">Flash via Browser USB</button>
                  <span slot="unsupported">Open this page in Chrome or Edge over HTTPS to use browser USB flashing.</span>
                  <span slot="not-allowed">Browser USB flashing requires a secure HTTPS page.</span>
                </esp-web-install-button>
              `:g`
                <div class="flash-warning">
                  Browser USB flashing is not available for this build in the current tab. Download the factory binary and flash it with your preferred tool.
                </div>
              `}
              <a class="btn" href=${this.flashMac?S.downloadFactoryBinary(this.flashMac):"#"} download>Download factory .bin</a>
              <a class="btn" href=${this.flashMac?S.downloadCompileBinary(this.flashMac):"#"} download>Download .ota.bin</a>
            </div>
            <p class="muted">
              ${this.browserSupportsUsbFlash?"When the USB flash finishes and the bridge is powered on, continue to detection.":"Browser USB flashing is unavailable here. Flash the downloaded factory binary locally, then continue to detection."}
            </p>
            <div class="flash-error-actions">
              <button class="btn btn-outline" @click=${()=>void this.handleFlashBack()}>Back to Configure</button>
              <button class="btn btn-primary" @click=${()=>void this.startDetection()} ?disabled=${!this.flashMac}>I Flashed It, Detect Bridge</button>
            </div>
          `}
          ${this.flashCompileLog?g`
            <details class="flash-log-details">
              <summary>View Build Log</summary>
              <div class="flash-log-viewer">${this.flashCompileLog}</div>
            </details>
          `:y}
        </div>
      `:y}

      ${this.flashStage==="detecting"?g`
        <div class="flash-progress-area">
          <h3>${this.flashTransport==="serial"?"Connecting Bridge":"Detecting Bridge"}</h3>
          <p class="muted">${this.flashTransport==="serial"?`Starting the add-on's serial client (${this.flashDetectElapsed}s elapsed)...`:`Waiting for the bridge to come online (${this.flashDetectElapsed}s elapsed)...`}</p>
          <div class="scanning-state">
            <span class="spinner large"></span>
            <p>${this.flashTransport==="serial"?"Waiting for the bridge to authenticate over serial...":"Waiting for bridge to appear on network..."}</p>
          </div>
          <div class="flash-error-actions">
            <button class="btn btn-outline" @click=${()=>void this.handleFlashBack()}>Back to Flash</button>
          </div>
        </div>
      `:y}

      ${this.flashStage==="complete"?g`
        <div class="flash-progress-area">
          <div class="complete-state">
            <span class="check">\u2705</span>
            <span>Bridge detected and connected!</span>
          </div>
        </div>
      `:y}

      ${this.flashStage==="error"?g`
        <div class="flash-progress-area">
          <div class="error-block">
            <p>${this.flashCompileError||this.flashFlashError||this.flashDetectError||"An error occurred"}</p>
            <div class="flash-error-actions">
              <button class="btn btn-outline" @click=${()=>void this.handleFlashBack()}>${this.flashDetectError?"Back to Flash":"Back to Configure"}</button>
              ${this.flashDetectError?g`
                <button class="btn btn-outline" @click=${()=>{this.flashStage="detecting",this.flashDetectError="",this.startDetection()}}>Retry Scan</button>
                <button class="btn btn-outline" @click=${()=>{this.resetFlashWizard(),this.step1Choice="choose",this.step1="choose"}}>Skip</button>
              `:y}
            </div>
          </div>
          ${this.flashCompileLog?g`
            <details class="flash-log-details">
              <summary>View Log</summary>
              <div class="flash-log-viewer">${this.flashCompileLog}</div>
            </details>
          `:y}
        </div>
      `:y}
    `}renderStep2(){const t=this.step2==="complete"&&this.step3!=="disabled",e=this.runningIntegrationVersion||(this.integrationDetected?"detected, version unknown":"not loaded");return g`
      <div class="step ${this.step2==="disabled"?"locked":""} ${t?"collapsed":""} ${this.step2==="complete"?"done":""} ${this.step2==="error"?"has-error":""}">
        <div class="step-header">
          <span class="step-icon">
            ${this.step2==="disabled"?"🔒":this.step2==="restarting"?g`<span class="spinner"></span>`:this.step2==="polling"?g`<span class="spinner"></span>`:this.step2==="complete"?"✅":this.step2==="error"?"❌":"2"}
          </span>
          <div class="step-title-area">
            <h2>Restart Home Assistant</h2>
            <p class="step-summary">
              ${this.step2==="disabled"?"Complete step 1 first":this.step2==="ready"?"Home Assistant needs to restart to activate the integration":this.step2==="restarting"?"Restarting...":this.step2==="polling"?`Waiting for Home Assistant to come back online... (${this.pollingSeconds}s)`:this.step2==="complete"?"Home Assistant restarted successfully":this.step2==="error"?"Restart failed":""}
            </p>
          </div>
          ${t?g`<span class="collapse-icon">\u25B6</span>`:y}
        </div>

        ${t?y:g`
          <div class="step-body">
            ${this.step2==="disabled"?g`
              <p class="muted">Connect a bridge first to continue.</p>
            `:y}

            ${this.step2==="ready"?g`
              <p>
                Home Assistant needs to restart to activate the ESP Tree integration
                ${e==="not loaded"?g`
                  — it will be installed as version ${this.latestIntegrationVersion||"latest"}.
                `:g`
                  from ${e} to ${this.latestIntegrationVersion||"latest"}.
                `}
              </p>
              <button class="btn btn-primary" @click=${this.handleRestart}>
                Restart Home Assistant
              </button>
            `:y}

            ${this.step2==="restarting"?g`
              <div class="scanning-state">
                <span class="spinner large"></span>
                <p>Sending restart request...</p>
              </div>
            `:y}

            ${this.step2==="polling"?g`
              <div class="polling-state">
                <span class="spinner large"></span>
                <p>Waiting for Home Assistant to come back online...</p>
                ${this.pollingSeconds>40?g`
                  <p class="muted">Taking longer than expected. Check if Home Assistant restarted successfully.</p>
                `:y}
              </div>
            `:y}

            ${this.step2==="complete"?g`
              <div class="complete-state">
                <span class="check">\u2705</span>
                <span>
                  Home Assistant is running the ESP Tree integration
                  ${this.runningIntegrationVersion?` ${this.runningIntegrationVersion}`:""}
                </span>
              </div>
            `:y}

            ${this.step2==="error"&&this.restartError?g`
              <div class="error-block">
                <p>Restart failed: ${this.restartError}</p>
                <button class="btn btn-outline" @click=${this.handleRestart}>Retry</button>
              </div>
            `:y}
          </div>
        `}
      </div>
    `}renderStep3(){return g`
      <div class="step ${this.step3==="disabled"?"locked":""} ${this.step3==="complete"?"done":""}">
        <div class="step-header">
          <span class="step-icon">
            ${this.step3==="disabled"?"🔒":this.step3==="triggering"?g`<span class="spinner"></span>`:this.step3==="polling"?g`<span class="spinner"></span>`:this.step3==="complete"?"✅":this.step3==="fallback"?"⚠️":this.step3==="error"?"❌":"3"}
          </span>
          <div class="step-title-area">
            <h2>Add ESP Tree Integration</h2>
            <p class="step-summary">
              ${this.step3==="disabled"?"Complete step 2 first":this.step3==="triggering"?"Setting up the ESP Tree integration...":this.step3==="polling"?"Waiting for integration to activate...":this.step3==="complete"?"ESP Tree integration is active":this.step3==="fallback"?"Manual setup required":this.step3==="error"?"Could not set up integration":""}
            </p>
          </div>
        </div>

        <div class="step-body">
          ${this.step3==="disabled"?g`
            <p class="muted">Restart Home Assistant first to continue.</p>
          `:y}

          ${this.step3==="triggering"?g`
            <div class="scanning-state">
              <span class="spinner large"></span>
              <p>Setting up the ESP Tree integration...</p>
            </div>
          `:y}

          ${this.step3==="polling"?g`
            <div class="polling-state">
              <span class="spinner large"></span>
              <p>Waiting for integration to become active...</p>
            </div>
          `:y}

          ${this.step3==="complete"?g`
            <div class="complete-state">
              <span class="check">\u2705</span>
              <span>
                ESP Tree integration is active
                ${this.runningIntegrationVersion?` (${this.runningIntegrationVersion})`:""}
              </span>
            </div>
          `:y}

          ${this.step3==="fallback"?g`
            <div class="fallback-state">
              <p>Integration created — add it in Devices &amp; Services to activate:</p>
              <div class="fallback-actions">
                <button class="btn btn-outline" @click=${()=>window.open("/config/integrations/dashboard","_blank")}>
                  Open Devices &amp; Services
                </button>
                <button class="btn btn-outline" @click=${()=>window.open("/config/integrations/dashboard/add?domain=esp_tree","_blank")}>
                  Add ESP Tree Integration
                </button>
              </div>
              <button class="btn" @click=${()=>{this.integrationFailures=0,this.triggerIntegrationSetup()}}>
                Retry
              </button>
            </div>
          `:y}

          ${this.step3==="error"&&this.integrationError?g`
            <div class="error-block">
              <p>Could not set up integration automatically: ${this.integrationError}</p>
              <div class="fallback-actions">
                <button class="btn btn-outline" @click=${()=>window.open("/config/integrations/dashboard","_blank")}>
                  Open Devices &amp; Services
                </button>
                <button class="btn btn-outline" @click=${()=>window.open("/config/integrations/dashboard/add?domain=esp_tree","_blank")}>
                  Add ESP Tree Integration
                </button>
              </div>
              <button class="btn" @click=${()=>{this.integrationError=null,this.triggerIntegrationSetup()}}>
                Retry
              </button>
            </div>
          `:y}
        </div>
      </div>
    `}renderDone(){return this.step1!=="complete"||this.step2!=="complete"||this.step3!=="complete"?y:g`
      <div class="step done expanded">
        <div class="step-header">
          <span class="step-icon">\u2728</span>
          <div class="step-title-area">
            <h2>Setup Complete!</h2>
            <p class="step-summary">Redirecting to topology map...</p>
          </div>
        </div>
        <div class="step-body done-body">
          <button class="btn btn-primary" @click=${this.dismiss}>Go Now</button>
        </div>
      </div>
    `}};E.MAX_POLL_DURATION_MS=300*1e3;E.MAX_DISCOVERY_DURATION_MS=30*1e3;E.STATUS_POLL_INTERVAL_MS=1e3;E.STATUS_POLL_INTERVAL_S=E.STATUS_POLL_INTERVAL_MS/1e3;E.styles=we`
    :host {
      --bg: #f5f7fa;
      --surface: #ffffff;
      --ink: #1c1c1e;
      --muted: #64748b;
      --line: #e2e8f0;
      --primary: #0b3b4b;
      --accent: #f39c12;
      --danger: #ef4444;
      --ok: #22c55e;
      --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
      display: block;
      min-height: 100vh;
      background: var(--bg);
      color: var(--ink);
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }

    .wizard-page {
      max-width: 680px;
      margin: 0 auto;
      padding: 40px 24px;
    }

    .wizard-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 32px;
      padding-bottom: 20px;
      border-bottom: 2px solid var(--line);
    }

    .wizard-header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      color: var(--primary);
    }

    .tagline {
      margin: 6px 0 0;
      color: var(--muted);
      font-size: 15px;
    }

    .dismiss-btn {
      border: 1px solid var(--line);
      background: var(--surface);
      color: var(--muted);
      padding: 8px 16px;
      font: inherit;
      font-size: 13px;
      cursor: pointer;
      border-radius: 8px;
      white-space: nowrap;
      transition: all 0.15s;
    }

    .dismiss-btn:hover {
      border-color: var(--muted);
      color: var(--ink);
    }

    .stepper {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .step {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 12px;
      box-shadow: var(--shadow);
      overflow: hidden;
      transition: opacity 0.2s;
    }

    .step.locked {
      opacity: 0.55;
    }

    .step.done {
      border-color: var(--ok);
    }

    .step.has-error {
      border-color: var(--danger);
    }

    .step-header {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 18px 20px;
    }

    .step.collapsed .step-header {
      cursor: pointer;
    }

    .step-icon {
      flex-shrink: 0;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      background: #f1f5f9;
      border-radius: 50%;
      margin-top: 2px;
    }

    .step.complete .step-icon,
    .step.done .step-icon {
      background: #dcfce7;
    }

    .step-title-area {
      flex: 1;
    }

    .step-title-area h2 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .step-summary {
      margin: 4px 0 0;
      font-size: 13px;
      color: var(--muted);
    }

    .collapse-icon {
      font-size: 12px;
      color: var(--muted);
      margin-top: 6px;
    }

    .step-body {
      padding: 0 20px 20px 70px;
    }

    .step.collapsed .step-body {
      display: none;
    }

    .scanning-state,
    .polling-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 0;
      gap: 12px;
    }

    .scanning-state p,
    .polling-state p {
      margin: 0;
      font-size: 14px;
      color: var(--muted);
    }

    .complete-state {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 0;
      font-size: 14px;
      font-weight: 500;
      color: var(--ok);
    }

    .step-body.done-body {
      padding: 0 20px 20px 70px;
    }

    .step-body.done-body .btn {
      margin-top: 4px;
    }

    .check {
      font-size: 18px;
    }

    .bridge-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 16px;
    }

    .bridge-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      background: #f8fafc;
      border: 1px solid #f1f5f9;
      border-radius: 10px;
      gap: 12px;
      flex-wrap: wrap;
    }

    .bridge-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 13px;
    }

    .bridge-info strong {
      font-size: 14px;
    }

    .net-id {
      font-size: 11px;
      color: var(--muted);
      font-family: monospace;
    }

    .api-key-row {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .api-key-row input {
      padding: 6px 10px;
      font-size: 13px;
      border: 1px solid var(--line);
      border-radius: 6px;
      width: 180px;
    }

    .manual-toggle {
      margin-bottom: 12px;
    }

    .manual-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      background: #f8fafc;
      border: 1px solid #f1f5f9;
      border-radius: 10px;
      margin-bottom: 12px;
    }

    .manual-form label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 12px;
      font-weight: 600;
      color: var(--muted);
      text-transform: uppercase;
    }

    .manual-form input {
      padding: 8px 12px;
      font-size: 14px;
      border: 1px solid var(--line);
      border-radius: 8px;
      font-family: inherit;
    }

    .error-block {
      margin-top: 12px;
      padding: 12px 16px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
    }

    .error-block p {
      margin: 0 0 8px;
      color: var(--danger);
      font-size: 13px;
    }

    .error-block .hint {
      display: block;
      margin-top: 4px;
      font-size: 12px;
      color: #6b7280;
    }

    .fallback-state {
      padding: 16px;
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 8px;
      margin-top: 8px;
    }

    .fallback-state p {
      margin: 0 0 12px;
      font-size: 14px;
    }

    .fallback-actions {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }

    .btn {
      border: 1px solid var(--line);
      background: var(--surface);
      color: var(--ink);
      padding: 8px 16px;
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.15s;
    }

    .btn:hover {
      background: #f1f5f9;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background: var(--primary);
      color: #fff;
      border-color: var(--primary);
    }

    .btn-primary:hover {
      background: #0e4a5e;
    }

    .btn-outline {
      border-color: var(--primary);
      color: var(--primary);
      background: transparent;
    }

    .btn-outline:hover {
      background: rgba(11, 59, 75, 0.06);
    }

    .muted {
      color: var(--muted);
      font-size: 13px;
    }

    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 3px solid rgba(11, 59, 75, 0.2);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    .spinner.large {
      width: 32px;
      height: 32px;
      border-width: 4px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 600px) {
      .wizard-page {
        padding: 24px 16px;
      }

      .wizard-header {
        flex-direction: column;
        gap: 12px;
      }

      .step-body {
        padding: 0 16px 16px 54px;
      }

      .bridge-card {
        flex-direction: column;
        align-items: flex-start;
      }

      .flash-form label {
        font-size: 11px;
      }

      .flash-key-row {
        flex-direction: column;
      }

      .flash-port-row {
        flex-direction: column;
      }
    }

    .choice-cards {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .choice-card {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 16px;
      border: 2px solid var(--line);
      border-radius: 12px;
      background: var(--card);
      cursor: pointer;
      transition: all 0.15s;
      text-align: center;
      font: inherit;
      color: var(--ink);
    }

    .choice-card:hover {
      border-color: var(--primary);
      background: rgba(0, 0, 0, 0.02);
      transform: translateY(-1px);
    }

    .choice-icon {
      font-size: 32px;
      margin-bottom: 8px;
    }

    .choice-card h3 {
      margin: 0 0 8px 0;
      font-size: 15px;
      font-weight: 600;
    }

    .choice-card p {
      margin: 0;
      font-size: 13px;
      color: var(--muted);
      line-height: 1.4;
    }

    .choice-back {
      margin-bottom: 12px;
    }

    .step-tabs {
      display: flex;
      gap: 0;
      margin-bottom: 16px;
      border-bottom: 2px solid var(--line);
    }

    .tab {
      padding: 10px 18px;
      border: none;
      background: transparent;
      color: var(--muted);
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: all 0.15s;
    }

    .tab:hover {
      color: var(--ink);
    }

    .tab.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
    }

    .flash-form {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 16px;
      background: #f8fafc;
      border: 1px solid #f1f5f9;
      border-radius: 10px;
    }

    .flash-form label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 12px;
      font-weight: 600;
      color: var(--muted);
      text-transform: uppercase;
    }

    .flash-form input,
    .flash-form select {
      padding: 8px 12px;
      font-size: 14px;
      border: 1px solid var(--line);
      border-radius: 8px;
      font-family: inherit;
      background: var(--surface);
    }

    .flash-form select {
      cursor: pointer;
    }

    .flash-warning {
      padding: 10px 14px;
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 8px;
      font-size: 13px;
      color: #92400e;
    }

    .flash-key-row {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .flash-key-row input {
      flex: 1;
    }

    .flash-port-row {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .flash-port-row select {
      flex: 1;
    }

    .btn-sm {
      padding: 4px 10px;
      font-size: 12px;
    }

    .chip-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
    }

    .chip-badge.detected {
      background: #dcfce7;
      color: #166534;
      border: 1px solid #bbf7d0;
    }

    .chip-badge.detecting {
      background: #f0f9ff;
      color: var(--primary);
      border: 1px solid #bae6fd;
    }

    .chip-badge.error {
      background: #fef2f2;
      color: var(--danger);
      border: 1px solid #fecaca;
      flex-wrap: wrap;
    }

    .chip-board-info {
      font-size: 11px;
      color: var(--muted);
      font-weight: 400;
    }

    .flash-stage-indicator {
      display: flex;
      align-items: center;
      gap: 0;
      margin-bottom: 16px;
      padding: 12px 0;
    }

    .stage-dot {
      font-size: 12px;
      font-weight: 500;
      color: var(--muted);
      padding: 4px 10px;
      border-radius: 12px;
      white-space: nowrap;
    }

    .stage-dot.active {
      color: var(--primary);
      background: #e0f2fe;
      font-weight: 600;
    }

    .stage-dot.done {
      color: var(--ok);
      background: #dcfce7;
    }

    .stage-line {
      flex: 1;
      height: 2px;
      background: var(--line);
      min-width: 12px;
    }

    .stage-line.done {
      background: var(--ok);
    }

    .flash-progress-area {
      padding: 16px 0;
    }

    .flash-progress-area h3 {
      margin: 0 0 8px;
      font-size: 16px;
    }

    .flash-log-viewer {
      max-height: 200px;
      overflow-y: auto;
      font-family: monospace;
      font-size: 11px;
      background: #1e293b;
      color: #e2e8f0;
      padding: 12px;
      border-radius: 8px;
      white-space: pre-wrap;
      word-break: break-all;
      margin-top: 12px;
    }

    .compile-status-label {
      font-style: italic;
      margin: 4px 0;
    }

    .flash-error-actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
      flex-wrap: wrap;
    }

    .flash-log-details {
      margin-top: 12px;
    }

    .flash-log-details summary {
      cursor: pointer;
      font-size: 13px;
      color: var(--muted);
    }

    .progress-bar-container {
      width: 100%;
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
      margin: 8px 0;
    }

    .progress-bar {
      height: 100%;
      background: var(--primary);
      border-radius: 4px;
      transition: width 0.3s;
    }
  `;L([v()],E.prototype,"step1",2);L([v()],E.prototype,"step1Choice",2);L([v()],E.prototype,"step2",2);L([v()],E.prototype,"step3",2);L([v()],E.prototype,"discoveredBridges",2);L([v()],E.prototype,"bridgeError",2);L([v()],E.prototype,"manualHost",2);L([v()],E.prototype,"manualPort",2);L([v()],E.prototype,"manualApiKey",2);L([v()],E.prototype,"apiKeyInput",2);L([v()],E.prototype,"selectedBridge",2);L([v()],E.prototype,"restartError",2);L([v()],E.prototype,"integrationError",2);L([v()],E.prototype,"runningIntegrationVersion",2);L([v()],E.prototype,"latestIntegrationVersion",2);L([v()],E.prototype,"integrationDetected",2);L([v()],E.prototype,"bridgeApiStatus",2);L([v()],E.prototype,"statusPollTimer",2);L([v()],E.prototype,"integrationPollTimer",2);L([v()],E.prototype,"integrationFailures",2);L([v()],E.prototype,"pollingSeconds",2);L([v()],E.prototype,"flashTab",2);L([v()],E.prototype,"flashStage",2);L([v()],E.prototype,"flashName",2);L([v()],E.prototype,"flashNetworkId",2);L([v()],E.prototype,"flashPsk",2);L([v()],E.prototype,"flashWifiSsid",2);L([v()],E.prototype,"flashWifiPassword",2);L([v()],E.prototype,"flashApiKey",2);L([v()],E.prototype,"flashEspnowMode",2);L([v()],E.prototype,"flashOtaPassword",2);L([v()],E.prototype,"flashChipName",2);L([v()],E.prototype,"flashTransport",2);L([v()],E.prototype,"flashSerialPort",2);L([v()],E.prototype,"flashSerialPorts",2);L([v()],E.prototype,"flashSerialPortScanning",2);L([v()],E.prototype,"flashSerialFlashStatus",2);L([v()],E.prototype,"flashSerialFlashError",2);L([v()],E.prototype,"flashBoardInfo",2);L([v()],E.prototype,"flashBrowserDetecting",2);L([v()],E.prototype,"flashBrowserDetectError",2);L([v()],E.prototype,"flashDetectedChip",2);L([v()],E.prototype,"flashSecretsWarning",2);L([v()],E.prototype,"flashConfigError",2);L([v()],E.prototype,"flashMac",2);L([v()],E.prototype,"flashCompileLog",2);L([v()],E.prototype,"flashCompilePercent",2);L([v()],E.prototype,"flashCompileStatus",2);L([v()],E.prototype,"flashCompileError",2);L([v()],E.prototype,"flashFlashError",2);L([v()],E.prototype,"flashDetectElapsed",2);L([v()],E.prototype,"flashDetectError",2);L([v()],E.prototype,"flashBrowserManifestUrl",2);L([v()],E.prototype,"serialPorts",2);L([v()],E.prototype,"serialScanning",2);L([v()],E.prototype,"serialSelectedPort",2);L([v()],E.prototype,"serialBaud",2);L([v()],E.prototype,"serialApiKey",2);L([v()],E.prototype,"serialName",2);L([v()],E.prototype,"serialError",2);E=L([ke("esp-setup-wizard")],E);var oC=Object.defineProperty,aC=Object.getOwnPropertyDescriptor,Y=(t,e,i,s)=>{for(var r=s>1?void 0:s?aC(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&oC(e,i,r),r};let U=class extends de{constructor(){super(...arguments),this.name="espnow-remote",this.chips=[],this.chipName="",this.loadingChips=!1,this.detectingChip=!1,this.chipDetectionError="",this.detectedChipName="",this.networkId="",this.psk="",this.bridgeName="",this.credentialsComplete=!1,this.networkIdSource="",this.pskSource="",this.credentialsMismatch=!1,this.bridgeNetworkId="",this.loadingCredentials=!1,this.stage="config",this.error="",this.mac="",this.esphomeName="",this.compilePercent=0,this.compileStatus="",this.manifestUrl="",this.firmwareBlobUrl="",this.preparingManifest=!1,this.usbSupported=!0,this.haStatus="checking",this.haDeviceId="",this.haBusy=!1,this.haNotice="",this.haPollTimer=null,this.haPollAttempts=0,this.pollTimer=null}connectedCallback(){super.connectedCallback(),this.usbSupported=this.detectUsbSupport(),this.loadChips(),this.loadCredentials()}disconnectedCallback(){this.clearPoll(),this.clearHaPoll(),this.clearManifestUrls(),super.disconnectedCallback()}detectUsbSupport(){return!!navigator.serial&&window.isSecureContext}async detectChip(){this.chipDetectionError="",this.detectedChipName="",this.detectingChip=!0;let t=null;try{if(!this.detectUsbSupport())throw new Error("USB chip detection requires Chrome or Edge on a secure HTTPS page. You can select the chip manually instead.");const e=navigator.serial;if(!e)throw new Error("Web Serial is not available. Select the chip manually instead.");const i=await e.requestPort(),r=await import("https://unpkg.com/esptool-js@0.6.1/bundle.js");t=new r.Transport(i,!0);const n=new r.ESPLoader({transport:t,baudrate:115200,terminal:{clean:()=>{},writeLine:()=>{},write:()=>{}},debugLogging:!1}),o=String(await n.main()),a=o.trim().toUpperCase().replace(/\s+/g,""),c=["ESP32-C61","ESP32-C6","ESP32-C5","ESP32-C3","ESP32-C2","ESP32-H2","ESP32-P4","ESP32-S3","ESP32-S2","ESP32"].find(d=>a.includes(d)||a.includes(d.replace(/-/g,""))),h=c&&this.chips.find(d=>d.chip_name.toUpperCase()===c);if(!c||!h)throw new Error(`Detected ${o}, but this chip is not in the supported firmware list. Choose a supported chip manually.`);this.chipName=h.chip_name,this.detectedChipName=o}catch(e){this.chipDetectionError=e instanceof Error?e.message:String(e)}finally{if(t)try{await t.disconnect()}catch{}this.detectingChip=!1}}clearPoll(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}clearManifestUrls(){this.manifestUrl&&(URL.revokeObjectURL(this.manifestUrl),this.manifestUrl=""),this.firmwareBlobUrl&&(URL.revokeObjectURL(this.firmwareBlobUrl),this.firmwareBlobUrl="")}async loadChips(){this.loadingChips=!0;try{const t=await S.getChips();this.chips=t.chips??[]}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.loadingChips=!1}}async loadCredentials(){this.loadingCredentials=!0;try{const t=await S.getBridgeNetworkCredentials();this.networkId=t.network_id??"",this.psk=t.psk??"",this.bridgeName=t.bridge_name??"",this.credentialsComplete=!!t.complete,this.networkIdSource=t.network_id_source??"",this.pskSource=t.psk_source??"",this.credentialsMismatch=!!t.mismatch,this.bridgeNetworkId=t.bridge_network_id??""}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.loadingCredentials=!1}}get selectedChip(){return this.chips.find(t=>t.chip_name===this.chipName)}get chipFamily(){return this.chipName||null}canSubmit(){var t;return((t=this.selectedChip)==null?void 0:t.buildable)===!1?!1:!!(this.name.trim()&&this.chipName&&this.selectedChip&&this.networkId.trim()&&this.psk.trim())}async submit(){const t=this.selectedChip;if(!(!this.canSubmit()||!t)){this.error="",this.stage="compiling",this.compilePercent=0,this.compileStatus="";try{const e=await S.submitFlashWizard({name:this.name.trim(),network_id:this.networkId.trim(),psk:this.psk.trim(),wifi_ssid:"",wifi_password:"",api_key:"",espnow_mode:"lr",ota_password:"",chip_name:this.chipName,board_info:{platform:t.platform,board:t.board,framework:t.framework,...t.variant?{variant:t.variant}:{}},transport:"espnow",kind:"remote"});this.mac=e.mac,this.esphomeName=e.esphome_name,this.startCompilePoll()}catch(e){this.error=e instanceof Error?e.message:String(e),this.stage="error"}}}startCompilePoll(){this.clearPoll(),this.pollTimer=setInterval(()=>{this.pollCompile()},3e3),this.pollCompile()}async pollCompile(){if(this.mac)try{const t=await S.getCompileStatus(this.mac),e=t.status||"idle";if(this.compileStatus=e,e==="compiled"){this.compilePercent=100,this.clearPoll(),this.stage="ready",this.prepareManifest();return}if(e==="failed"){this.clearPoll(),this.error=t.error||"Compilation failed",this.stage="error";return}if(e==="compile_queued"){const i=t.queue_position??1;this.compilePercent=Math.max(5,100-i*10)}else e==="compiling"?this.compilePercent=Math.max(this.compilePercent,10):this.compilePercent=Math.max(this.compilePercent,2)}catch{}}get compileStatusLabel(){const t=this.esphomeName||this.name.trim();return this.compileStatus==="compile_queued"?`Queued to compile ${t}`:this.compileStatus==="idle"?"Waiting for the compiler":`Compiling ${t}`}async prepareManifest(){if(!this.mac)return;const t=this.chipFamily;if(!t){this.error="Could not determine the chip family for browser flashing.";return}this.preparingManifest=!0;try{const e=await fetch(S.downloadFactoryBinary(this.mac));if(!e.ok){this.error="Compiled, but no factory image is available for browser flashing. Check the queue page for the build log.";return}const i=URL.createObjectURL(await e.blob()),s={name:this.esphomeName||this.name.trim(),version:"compiled",new_install_prompt_erase:!0,builds:[{chipFamily:t,parts:[{path:i,offset:0}]}]},r=URL.createObjectURL(new Blob([JSON.stringify(s)],{type:"application/json"}));this.clearManifestUrls(),this.manifestUrl=r,this.firmwareBlobUrl=i}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.preparingManifest=!1}}async onBrowserFlashDone(){this.clearPoll();try{await S.finalizeFlashWizard()}catch{}this.clearManifestUrls(),this.stage="done",this.watchForHaIntegration()}watchForHaIntegration(){this.clearHaPoll(),this.haStatus="checking",this.haDeviceId="",this.haPollAttempts=0,this.checkHaIntegration(),this.haPollTimer=setInterval(()=>void this.checkHaIntegration(),U.HA_POLL_INTERVAL_MS)}clearHaPoll(){this.haPollTimer&&(clearInterval(this.haPollTimer),this.haPollTimer=null)}async checkHaIntegration(){if(this.mac){this.haPollAttempts+=1;try{const e=(await S.topology(!0)).find(i=>ae(i.mac)===ae(this.mac));if(!e)this.haStatus="waiting-for-join";else if(e.ha_device_id){this.haStatus="managed",this.haDeviceId=e.ha_device_id,this.clearHaPoll();return}else this.haStatus="unmanaged"}catch{this.haStatus="waiting-for-join"}this.haPollAttempts>=U.HA_POLL_MAX_ATTEMPTS&&this.clearHaPoll()}}async addToHomeAssistant(){if(!this.haBusy){this.haBusy=!0,this.haNotice="";try{const t=await S.integrationSetup();!t.success&&t.error&&(this.haNotice=t.error),await this.checkHaIntegration(),this.haStatus!=="managed"&&(this.haPollAttempts=0,this.clearHaPoll(),this.haPollTimer=setInterval(()=>void this.checkHaIntegration(),U.HA_POLL_INTERVAL_MS))}catch(t){this.haNotice=t instanceof Error?t.message:String(t)}finally{this.haBusy=!1}}}startOver(){this.clearPoll(),this.clearHaPoll(),this.stage="config",this.error="",this.compileStatus="",this.compilePercent=0,this.mac="",this.esphomeName="",this.haStatus="checking",this.haDeviceId="",this.haNotice=""}goTopology(){window.location.hash="/"}renderHaIntegrationStep(){return this.haStatus==="managed"?g`
        <div class="ha-step ha-ok">
          <span class="ha-icon">\u2705</span>
          <div>
            <strong>Added to Home Assistant</strong>
            <p class="hint">
              This remote's entities are available in Home Assistant.
            </p>
            <a class="btn" href=${`/config/devices/device/${this.haDeviceId}`} target="_blank" rel="noopener">
              Open device in Home Assistant
            </a>
          </div>
        </div>
      `:this.haStatus==="checking"||this.haStatus==="waiting-for-join"?g`
        <div class="ha-step">
          <span class="ha-icon"><span class="spinner"></span></span>
          <div>
            <strong>Waiting for the remote to join</strong>
            <p class="hint">
              Once the bridge sees it, this step adds it to Home Assistant so its entities appear.
            </p>
          </div>
        </div>
      `:g`
      <div class="ha-step ha-action">
        <span class="ha-icon">\u26A0\uFE0F</span>
        <div>
          <strong>Last step: add it to Home Assistant</strong>
          <p class="hint">
            The remote is on the mesh, but Home Assistant has no device for it yet, so its
            entities are not available. Add it here — the integration detects it
            automatically. (Adding it from Devices &amp; Services does not work; that page
            can only install the integration itself, which is already installed.)
          </p>
          ${this.haNotice?g`<p class="hint ha-error">${this.haNotice}</p>`:y}
          <button class="btn primary" ?disabled=${this.haBusy} @click=${()=>void this.addToHomeAssistant()}>
            ${this.haBusy?"Adding…":"Add to Home Assistant"}
          </button>
        </div>
      </div>
    `}credentialsLabel(){return this.loadingCredentials?"loading…":this.credentialsComplete?this.bridgeName?`from bridge ${this.bridgeName}`:"from secrets.yaml":"not configured"}sourceLabel(t){return!t||t==="missing"?"missing":`from ${t}`}render(){return g`
      <section class="card">
        <div class="card-header">
          <h2>Create Remote</h2>
          <button class="btn" @click=${this.goTopology}>Back to topology</button>
        </div>
        <div class="card-body">
          ${this.error?g`<div class="error">${this.error}</div>`:y}

          ${this.stage==="config"?g`
                <p class="hint">
                  Flashes a new ESP-NOW remote from this browser. Plug the remote into
                  <strong>this computer</strong> by USB — the add-on compiles the firmware, then
                  your browser writes it.
                </p>

                <label class="field">
                  <span>Device name</span>
                  <input
                    type="text"
                    .value=${this.name}
                    @input=${t=>{this.name=t.target.value}}
                  />
                </label>

                <label class="field">
                  <span>Chip</span>
                  <select
                    .value=${this.chipName}
                    @change=${t=>{this.chipName=t.target.value,this.detectedChipName=""}}
                    ?disabled=${this.loadingChips||this.chips.length===0}
                  >
                    ${this.loadingChips?g`<option value="">Loading chips…</option>`:g`<option value="">Select a chip…</option>`}
                    ${this.chips.map(t=>g`<option value=${t.chip_name} ?disabled=${t.buildable===!1} ?selected=${t.chip_name===this.chipName}>
                            ${t.chip_name} — ${t.board}${t.buildable===!1?" (not buildable)":""}
                          </option>`)}
                  </select>
                  <small class="hint">Connect the remote to this computer by USB, then detect the chip automatically or select it manually.</small>
                  ${this.selectedChip&&this.selectedChip.buildable===!1?g`<span class="hint warn-text">${this.selectedChip.unbuildable_reason}</span>`:y}
                </label>

                <div class="chip-detect">
                  <button class="btn" ?disabled=${this.detectingChip||this.loadingChips} @click=${()=>void this.detectChip()}>
                    ${this.detectingChip?"Detecting chip…":"Detect connected chip"}
                  </button>
                  ${this.detectedChipName?g`<span class="hint">Detected ${this.detectedChipName}; selected ${this.chipName}.</span>`:y}
                  ${this.chipDetectionError?g`<span class="hint warn-text">${this.chipDetectionError}</span>`:y}
                  ${this.usbSupported?y:g`<span class="hint">Automatic detection needs Chrome or Edge on a secure HTTPS page. Manual chip selection is available.</span>`}
                </div>

                <div class="creds ${this.credentialsComplete?"ok":"warn"}">
                  <div class="creds-row">
                    <strong>Network</strong>
                    <span>${this.credentialsLabel()}</span>
                  </div>
                  ${this.credentialsComplete?g`<div class="creds-row">
                          <span>Network ID <small class="src">${this.sourceLabel(this.networkIdSource)}</small></span>
                          <code>${this.networkId}</code>
                        </div>
                        <div class="creds-row">
                          <span>PSK <small class="src">${this.sourceLabel(this.pskSource)}</small></span>
                          <code>••••••••</code>
                        </div>`:g`<p class="hint">
                        No ESP-NOW credentials found${this.bridgeName?g` for bridge <strong>${this.bridgeName}</strong>`:y}.
                        A remote cannot join without them — configure a bridge first, or add
                        <code>espnow_network_id</code> and <code>espnow_psk</code> to secrets.yaml.
                      </p>`}
                  ${this.credentialsComplete?g`<p class="hint">
                        Taken from secrets.yaml so the remote matches what the bridge is running.
                      </p>`:y}
                  ${this.credentialsMismatch?g`<p class="hint warn-text">
                        Note: the saved bridge record says the network ID is
                        <code>${this.bridgeNetworkId}</code>, which disagrees with secrets.yaml.
                        The bridge firmware reads secrets.yaml, so that value is used here — but
                        the record is stale and worth correcting.
                      </p>`:y}
                </div>

                <button class="btn primary" ?disabled=${!this.canSubmit()} @click=${()=>void this.submit()}>
                  Compile firmware
                </button>
              `:y}

          ${this.stage==="compiling"?g`
                <div class="status">
                  <div class="spinner"></div>
                  <div>
                    <strong
                      >${this.compileStatusLabel}…${this.compilePercent>0?` ${this.compilePercent}%`:""}</strong
                    >
                    <p class="hint">This uses the add-on's own compiler. It can take a few minutes.</p>
                  </div>
                </div>
                <esp-compile-log-viewer .mac=${this.mac} .visible=${!0}></esp-compile-log-viewer>
              `:y}

          ${this.stage==="ready"?g`
                <div class="status">
                  <strong>Firmware compiled.</strong>
                  <p class="hint">Plug the remote into this computer by USB, then flash it below.</p>
                </div>
                ${this.preparingManifest?g`<div class="status"><div class="spinner"></div><span>Preparing firmware…</span></div>`:y}
                ${this.manifestUrl?g`
                      <esp-web-install-button manifest=${this.manifestUrl} @state-changed=${t=>{const e=t.detail;(e==null?void 0:e.state)==="FINISHED"&&this.onBrowserFlashDone()}}>
                        <button slot="activate" class="btn primary">Flash via Browser USB</button>
                        <span slot="unsupported"
                          >Open this page in Chrome or Edge over HTTPS to use browser USB flashing.</span
                        >
                        <span slot="not-allowed">Browser USB flashing requires a secure HTTPS page.</span>
                      </esp-web-install-button>
                    `:y}
                ${this.usbSupported?y:g`<div class="error">
                      This browser cannot flash over USB. Open the add-on in Chrome or Edge over HTTPS.
                    </div>`}
                <div class="actions">
                  <button class="btn" @click=${()=>void this.onBrowserFlashDone()}>
                    I've flashed it
                  </button>
                </div>
                <p class="hint">
                  The button above writes the firmware from this computer. If your browser cannot,
                  use the compiled .bin with your own tool, then continue.
                </p>
                ${this.mac?g`
                      <div class="actions download-actions">
                        <a class="btn" href=${S.downloadFactoryBinary(this.mac)} download>
                          Download factory .bin
                        </a>
                        <a class="btn" href=${S.downloadCompileBinary(this.mac)} download>
                          Download .ota.bin
                        </a>
                        <a class="btn" href=${"#/device/"+encodeURIComponent(this.mac)+"/config"}>
                          Edit config / YAML
                        </a>
                      </div>
                      <p class="hint">
                        <strong>Download factory .bin</strong> writes the whole image at offset 0
                        (bootloader + partitions + app) and is what a blank device needs — flash it
                        with your own tool at 0x0. The .ota.bin is an update image and cannot be
                        flashed to empty flash.
                      </p>
                    `:y}
              `:y}

          ${this.stage==="done"?g`
                <div class="status ok">
                  <strong>${this.esphomeName} flashed.</strong>
                  <p class="hint">
                    Power the remote. Once it joins, the bridge reports it and it appears in the
                    topology view automatically.
                  </p>
                </div>
                ${this.renderHaIntegrationStep()}
                <button class="btn primary" @click=${this.goTopology}>Go to topology</button>
              `:y}

          ${this.stage==="error"?g`
                <button class="btn" @click=${()=>this.startOver()}>Start over</button>
              `:y}
        </div>
      </section>
    `}};U.HA_POLL_INTERVAL_MS=5e3;U.HA_POLL_MAX_ATTEMPTS=12;U.styles=we`
    .card {
      background: var(--surface);
      border-radius: 12px;
      box-shadow: var(--shadow);
      border: 1px solid var(--line);
      margin-bottom: 20px;
    }

    /* Post-flash Home Assistant integration step. */
    .ha-step {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 16px;
      border: 1px solid var(--line);
      border-radius: 10px;
      background: var(--surface);
      margin: 0 0 16px;
    }

    .ha-step .ha-icon {
      font-size: 18px;
      line-height: 1.2;
      flex: 0 0 auto;
    }

    .ha-step strong {
      display: block;
      font-size: 14px;
      margin-bottom: 4px;
    }

    .ha-step .hint {
      margin: 0 0 10px;
    }

    .ha-step .hint:last-child {
      margin-bottom: 0;
    }

    .ha-step .btn {
      margin-top: 2px;
    }

    .ha-step.ha-ok {
      border-color: var(--ok, #2e7d32);
    }

    .ha-step.ha-action {
      border-color: var(--warn, #b26a00);
    }

    .ha-error {
      color: var(--err, #c62828);
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--line);
    }

    .card-header h2 {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
    }

    .card-body {
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 13px;
      font-weight: 500;
      color: var(--ink, #0f172a);
    }

    .chip-detect {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
    }

    input,
    select {
      font: inherit;
      font-size: 14px;
      padding: 8px 10px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fff;
      color: var(--ink, #0f172a);
      min-width: 180px;
    }

    .creds {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 13px;
    }

    .creds.ok {
      border-color: #bbf7d0;
      background: #f0fdf4;
    }

    .creds.warn {
      border-color: #fed7aa;
      background: #fffbeb;
    }

    .creds-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }

    .creds-row code {
      font-size: 12px;
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 2px 6px;
      max-width: 240px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .src {
      color: var(--muted, #64748b);
      font-size: 11px;
    }

    .warn-text {
      color: #b45309;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: inherit;
      font-size: 13px;
      font-weight: 500;
      padding: 8px 14px;
      border-radius: 8px;
      border: 1px solid var(--line);
      background: var(--surface, #fff);
      color: var(--ink, #0f172a);
      cursor: pointer;
      min-height: 36px;
      white-space: nowrap;
    }

    .btn:hover:not(:disabled) {
      background: #f8fafc;
    }

    .btn:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    .btn.primary {
      background: #0f766e;
      border-color: #0f766e;
      color: #fff;
    }

    .btn.primary:hover:not(:disabled) {
      background: #0d5f58;
    }

    .hint {
      margin: 0;
      color: var(--muted, #64748b);
      font-size: 13px;
      font-weight: 400;
      line-height: 1.5;
    }

    .error {
      background: #fef2f2;
      border: 1px solid var(--danger, #dc2626);
      color: var(--danger, #dc2626);
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 13px;
      font-weight: 400;
    }

    .status {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      font-size: 14px;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }

    /* Download / edit-config links sit under the flash action and must not be
       mistaken for the primary flash path. */
    .download-actions {
      margin-top: 4px;
      padding-top: 12px;
      border-top: 1px solid var(--line);
    }

    .download-actions a {
      text-decoration: none;
    }

    .status.ok strong {
      color: var(--ok, #15803d);
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid var(--line);
      border-top-color: var(--primary, #0f766e);
      border-radius: 50%;
      animation: spin 0.9s linear infinite;
      flex-shrink: 0;
      margin-top: 2px;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;Y([v()],U.prototype,"name",2);Y([v()],U.prototype,"chips",2);Y([v()],U.prototype,"chipName",2);Y([v()],U.prototype,"loadingChips",2);Y([v()],U.prototype,"detectingChip",2);Y([v()],U.prototype,"chipDetectionError",2);Y([v()],U.prototype,"detectedChipName",2);Y([v()],U.prototype,"networkId",2);Y([v()],U.prototype,"psk",2);Y([v()],U.prototype,"bridgeName",2);Y([v()],U.prototype,"credentialsComplete",2);Y([v()],U.prototype,"networkIdSource",2);Y([v()],U.prototype,"pskSource",2);Y([v()],U.prototype,"credentialsMismatch",2);Y([v()],U.prototype,"bridgeNetworkId",2);Y([v()],U.prototype,"loadingCredentials",2);Y([v()],U.prototype,"stage",2);Y([v()],U.prototype,"error",2);Y([v()],U.prototype,"mac",2);Y([v()],U.prototype,"esphomeName",2);Y([v()],U.prototype,"compilePercent",2);Y([v()],U.prototype,"compileStatus",2);Y([v()],U.prototype,"manifestUrl",2);Y([v()],U.prototype,"firmwareBlobUrl",2);Y([v()],U.prototype,"preparingManifest",2);Y([v()],U.prototype,"usbSupported",2);Y([v()],U.prototype,"haStatus",2);Y([v()],U.prototype,"haDeviceId",2);Y([v()],U.prototype,"haBusy",2);Y([v()],U.prototype,"haNotice",2);U=Y([ke("esp-remote-wizard")],U);var lC=Object.defineProperty,cC=Object.getOwnPropertyDescriptor,Nt=(t,e,i,s)=>{for(var r=s>1?void 0:s?cC(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&lC(e,i,r),r};let ct=class extends de{constructor(){super(...arguments),this.route=this.readRoute(),this.queueData=null,this.compileData=null,this.addonConnected=!0,this.bridgeConnected=null,this.bridgeConfigured=null,this.integrationLoaded=null,this.integrationConfigured=!1,this.restartRequired=!1,this.pollTimer=null,this.bridgeStreamHandle=null,this.setupDismissed=!1,this.onHashChange=()=>{this.route=this.readRoute()},this.onSetupDismissed=()=>{this.setupDismissed=!0}}connectedCallback(){super.connectedCallback(),window.addEventListener("hashchange",this.onHashChange),this.addEventListener("setup-dismissed",this.onSetupDismissed),this.bridgeStreamHandle=mg(t=>{this.bridgeConnected=t,this.fetchConfig()}),this.fetchQueue(),this.pollTimer=setInterval(()=>{this.fetchQueue(),this.fetchConfig(),this.checkRestartRequired()},3e3),this.fetchConfig(),this.checkRestartRequired(),this.maybeRedirectToSetup()}async checkRestartRequired(){var t,e;try{const i=await S.restartRequired();this.restartRequired=i.restart_required,this.integrationLoaded=((t=i.integration)==null?void 0:t.loaded)??this.integrationLoaded,this.integrationConfigured=((e=i.integration)==null?void 0:e.configured)??this.integrationConfigured}catch{this.restartRequired=!1}this.maybeRedirectToSetup()}async fetchConfig(){var t,e,i;try{const s=await S.config();this.integrationLoaded=((t=s.integration)==null?void 0:t.loaded)??null,this.integrationConfigured=((e=s.integration)==null?void 0:e.configured)??!1,this.bridgeConfigured=!!(s.active_bridge&&!s.active_bridge.error||(((i=s.integration)==null?void 0:i.bridge_count)??0)>0),this.addonConnected=!0}catch{this.addonConnected=!1,this.bridgeConfigured=!1}this.maybeRedirectToSetup()}needsSetup(){return this.bridgeConfigured===!1||this.restartRequired||!this.integrationConfigured&&this.integrationLoaded===!1}maybeRedirectToSetup(){this.needsSetup()&&this.route.name==="topology"&&!this.setupDismissed&&this.navigate("/setup")}disconnectedCallback(){var t;window.removeEventListener("hashchange",this.onHashChange),this.removeEventListener("setup-dismissed",this.onSetupDismissed),this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null),(t=this.bridgeStreamHandle)==null||t.close(),this.bridgeStreamHandle=null,super.disconnectedCallback()}async fetchQueue(){try{const[t,e]=await Promise.all([S.getQueue(),S.getCompileQueue()]);this.queueData=t,this.compileData=e,this.addonConnected=!0}catch{this.addonConnected=!1}}readRoute(){const t=window.location.hash.replace(/^#\/?/,"");if(t.startsWith("device/")){const e=t.slice(7);return e.endsWith("/config")?{name:"device-config",mac:decodeURIComponent(e.replace(/\/config$/,""))}:{name:"device",mac:decodeURIComponent(e)}}if(t.startsWith("job/")){const e=t.slice(4),[i,s]=e.split("?"),r=parseInt(i,10);let n="/queue";return s&&(n=new URLSearchParams(s).get("from")||"/queue"),{name:"job",jobId:r,from:n}}return t==="settings"?{name:"settings"}:t==="queue"?{name:"queue"}:t==="secrets"?{name:"secrets",from:"/"}:t.startsWith("secrets?")?{name:"secrets",from:new URLSearchParams(t.slice(7)).get("from")||"/"}:t==="activity-log"?{name:"activity-log"}:t==="setup"?{name:"setup"}:t==="add-remote"?{name:"remote-wizard"}:{name:"topology"}}navigate(t){window.location.hash=t}render(){if(this.route.name==="setup")return g`<esp-setup-wizard></esp-setup-wizard>`;const t=this.queueData,e=this.compileData,i=(t==null?void 0:t.count)??0,s=(e==null?void 0:e.count)??0,r=!!(t!=null&&t.active_job)&&!["success","failed","aborted","rejoin_timeout","version_mismatch"].includes(t.active_job.status),n=!!(e!=null&&e.active_job),o=(t==null?void 0:t.paused)??!1,a=r||i>0||n||s>0;return g`
      <div class="app-shell">
        ${this.addonConnected?y:g`<div class="connection-banner">Cannot reach addon</div>`}
        ${this.bridgeConnected===!1?g`<div class="connection-banner">Addon cannot reach bridge</div>`:y}

        <header>
          <div class="brand">
            <a class="brand-name" href="#/">ESP-Tree<small>Go where WiFi won't</small></a>
          </div>
          <div class="header-right">
            <nav>
              <button class=${this.route.name==="topology"||this.route.name==="remote-wizard"?"active":""} @click=${()=>this.navigate("/")}>Topology</button>
              <button class=${this.route.name==="queue"?"active":""} @click=${()=>this.navigate("/queue")}>
                Queue${a?g`<span class="badge ${n||r?"loading":""}">${o?"⏸ ":""}${i+s+(r?1:0)}</span>`:y}
              </button>
              <button class=${this.route.name==="settings"?"active":""} @click=${()=>this.navigate("/settings")}>Settings</button>
            </nav>
          </div>
        </header>
        <main>
          ${this.route.name==="remote-wizard"?g`<esp-remote-wizard></esp-remote-wizard>`:this.route.name==="topology"?g`<esp-topology-map @node-selected=${l=>this.navigate(`/device/${encodeURIComponent(l.detail)}`)}></esp-topology-map>`:this.route.name==="device"?g`<esp-device-detail .mac=${this.route.mac}></esp-device-detail>`:this.route.name==="device-config"?g`<esp-config-page .mac=${this.route.mac}></esp-config-page>`:this.route.name==="job"?g`<esp-job-page .jobId=${this.route.jobId} .from=${this.route.from}></esp-job-page>`:this.route.name==="queue"?g`<esp-queue-page></esp-queue-page>`:this.route.name==="secrets"?g`<esp-secrets-page .from=${this.route.from}></esp-secrets-page>`:this.route.name==="activity-log"?g`<esp-activity-log-page></esp-activity-log-page>`:g`<esp-settings></esp-settings>`}
        </main>
      </div>
    `}};ct.styles=we`
    :host {
      --bg: #f5f7fa;
      --surface: #ffffff;
      --ink: #1c1c1e;
      --muted: #64748b;
      --line: #e2e8f0;
      --primary: #0b3b4b;
      --accent: #f39c12;
      --danger: #ef4444;
      --ok: #22c55e;
      --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
      display: block;
      min-height: 100vh;
      background: var(--bg);
      color: var(--ink);
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }

    .app-shell {
      margin: 0 auto;
      padding: 24px;
    }

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--primary);
      color: #fff;
      padding: 0 24px;
      height: 56px;
      border-radius: 12px;
      margin-bottom: 24px;
      box-shadow: var(--shadow);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .brand-name,
    .brand-name:visited {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.3px;
      color: inherit;
      text-decoration: none;
    }

    .brand-name small {
      font-weight: 400;
      opacity: 0.7;
      font-size: 13px;
      margin-left: 6px;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    nav {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }

    nav button {
      border: none;
      background: rgba(255,255,255,0.08);
      color: rgba(255,255,255,0.8);
      min-height: 36px;
      padding: 0 16px;
      font: inherit;
      font-weight: 500;
      font-size: 14px;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.15s;
    }

    nav button:hover,
    nav button.active {
      background: rgba(255,255,255,0.18);
      color: #fff;
      font-weight: 600;
    }

    .badge {
      display: inline-block;
      margin-left: 5px;
      padding: 1px 7px;
      font-size: 10px;
      font-weight: 700;
      background: var(--accent);
      color: white;
      border-radius: 10px;
      vertical-align: middle;
    }

.badge.loading {
      position: relative;
      width: 24px;
      height: 24px;
      padding: 0;
      border-radius: 50%;
      background: transparent;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
    }

    .badge.loading::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 3px solid rgba(243, 156, 18, 0.3);
      border-top-color: var(--accent);
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .connection-banner {
      background: var(--danger);
      color: #fff;
      text-align: center;
      padding: 8px;
      font-weight: 600;
      font-size: 14px;
      border-radius: 8px;
      margin-bottom: 12px;
    }

    .info-banner {
      background: #1e40af;
      color: #fff;
      text-align: center;
      padding: 8px;
      font-weight: 600;
      font-size: 14px;
      border-radius: 8px;
      margin-bottom: 12px;
    }

    main {
    }

    @media (max-width: 720px) {
      .app-shell {
        padding: 12px;
      }
      header {
        flex-wrap: wrap;
        height: auto;
        padding: 12px 16px;
        gap: 8px;
      }
      nav {
        justify-content: flex-start;
      }
    }
  `;Nt([v()],ct.prototype,"route",2);Nt([v()],ct.prototype,"queueData",2);Nt([v()],ct.prototype,"compileData",2);Nt([v()],ct.prototype,"addonConnected",2);Nt([v()],ct.prototype,"bridgeConnected",2);Nt([v()],ct.prototype,"bridgeConfigured",2);Nt([v()],ct.prototype,"integrationLoaded",2);Nt([v()],ct.prototype,"integrationConfigured",2);Nt([v()],ct.prototype,"restartRequired",2);ct=Nt([ke("espnow-app")],ct);
//# sourceMappingURL=index-VsbuATPz.js.map

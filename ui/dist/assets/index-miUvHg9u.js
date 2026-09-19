(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function i(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(n){if(n.ep)return;n.ep=!0;const r=i(n);fetch(n.href,r)}})();/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const tr=globalThis,il=tr.ShadowRoot&&(tr.ShadyCSS===void 0||tr.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,sl=Symbol(),ec=new WeakMap;let xd=class{constructor(e,i,s){if(this._$cssResult$=!0,s!==sl)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=i}get styleSheet(){let e=this.o;const i=this.t;if(il&&e===void 0){const s=i!==void 0&&i.length===1;s&&(e=ec.get(i)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&ec.set(i,e))}return e}toString(){return this.cssText}};const Hp=t=>new xd(typeof t=="string"?t:t+"",void 0,sl),we=(t,...e)=>{const i=t.length===1?t[0]:e.reduce((s,n,r)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+t[r+1],t[0]);return new xd(i,t,sl)},Wp=(t,e)=>{if(il)t.adoptedStyleSheets=e.map(i=>i instanceof CSSStyleSheet?i:i.styleSheet);else for(const i of e){const s=document.createElement("style"),n=tr.litNonce;n!==void 0&&s.setAttribute("nonce",n),s.textContent=i.cssText,t.appendChild(s)}},tc=il?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let i="";for(const s of e.cssRules)i+=s.cssText;return Hp(i)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Up,defineProperty:qp,getOwnPropertyDescriptor:Vp,getOwnPropertyNames:Qp,getOwnPropertySymbols:jp,getPrototypeOf:Kp}=Object,si=globalThis,ic=si.trustedTypes,Xp=ic?ic.emptyScript:"",uo=si.reactiveElementPolyfillSupport,Ns=(t,e)=>t,fr={toAttribute(t,e){switch(e){case Boolean:t=t?Xp:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=t!==null;break;case Number:i=t===null?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch{i=null}}return i}},nl=(t,e)=>!Up(t,e),sc={attribute:!0,type:String,converter:fr,reflect:!1,useDefault:!1,hasChanged:nl};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),si.litPropertyMetadata??(si.litPropertyMetadata=new WeakMap);let ji=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,i=sc){if(i.state&&(i.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((i=Object.create(i)).wrapped=!0),this.elementProperties.set(e,i),!i.noAccessor){const s=Symbol(),n=this.getPropertyDescriptor(e,s,i);n!==void 0&&qp(this.prototype,e,n)}}static getPropertyDescriptor(e,i,s){const{get:n,set:r}=Vp(this.prototype,e)??{get(){return this[i]},set(o){this[i]=o}};return{get:n,set(o){const a=n==null?void 0:n.call(this);r==null||r.call(this,o),this.requestUpdate(e,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??sc}static _$Ei(){if(this.hasOwnProperty(Ns("elementProperties")))return;const e=Kp(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Ns("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ns("properties"))){const i=this.properties,s=[...Qp(i),...jp(i)];for(const n of s)this.createProperty(n,i[n])}const e=this[Symbol.metadata];if(e!==null){const i=litPropertyMetadata.get(e);if(i!==void 0)for(const[s,n]of i)this.elementProperties.set(s,n)}this._$Eh=new Map;for(const[i,s]of this.elementProperties){const n=this._$Eu(i,s);n!==void 0&&this._$Eh.set(n,i)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const i=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const n of s)i.unshift(tc(n))}else e!==void 0&&i.push(tc(e));return i}static _$Eu(e,i){const s=i.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(i=>i(this))}addController(e){var i;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((i=e.hostConnected)==null||i.call(e))}removeController(e){var i;(i=this._$EO)==null||i.delete(e)}_$E_(){const e=new Map,i=this.constructor.elementProperties;for(const s of i.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Wp(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostConnected)==null?void 0:s.call(i)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostDisconnected)==null?void 0:s.call(i)})}attributeChangedCallback(e,i,s){this._$AK(e,s)}_$ET(e,i){var r;const s=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,s);if(n!==void 0&&s.reflect===!0){const o=(((r=s.converter)==null?void 0:r.toAttribute)!==void 0?s.converter:fr).toAttribute(i,s.type);this._$Em=e,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(e,i){var r,o;const s=this.constructor,n=s._$Eh.get(e);if(n!==void 0&&this._$Em!==n){const a=s.getPropertyOptions(n),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((r=a.converter)==null?void 0:r.fromAttribute)!==void 0?a.converter:fr;this._$Em=n;const c=l.fromAttribute(i,a.type);this[n]=c??((o=this._$Ej)==null?void 0:o.get(n))??c,this._$Em=null}}requestUpdate(e,i,s,n=!1,r){var o;if(e!==void 0){const a=this.constructor;if(n===!1&&(r=this[e]),s??(s=a.getPropertyOptions(e)),!((s.hasChanged??nl)(r,i)||s.useDefault&&s.reflect&&r===((o=this._$Ej)==null?void 0:o.get(e))&&!this.hasAttribute(a._$Eu(e,s))))return;this.C(e,i,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,i,{useDefault:s,reflect:n,wrapped:r},o){s&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,o??i??this[e]),r!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(i=void 0),this._$AL.set(e,i)),n===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(i){Promise.reject(i)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}const n=this.constructor.elementProperties;if(n.size>0)for(const[r,o]of n){const{wrapped:a}=o,l=this[r];a!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,o,l)}}let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),(s=this._$EO)==null||s.forEach(n=>{var r;return(r=n.hostUpdate)==null?void 0:r.call(n)}),this.update(i)):this._$EM()}catch(n){throw e=!1,this._$EM(),n}e&&this._$AE(i)}willUpdate(e){}_$AE(e){var i;(i=this._$EO)==null||i.forEach(s=>{var n;return(n=s.hostUpdated)==null?void 0:n.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(i=>this._$ET(i,this[i]))),this._$EM()}updated(e){}firstUpdated(e){}};ji.elementStyles=[],ji.shadowRootOptions={mode:"open"},ji[Ns("elementProperties")]=new Map,ji[Ns("finalized")]=new Map,uo==null||uo({ReactiveElement:ji}),(si.reactiveElementVersions??(si.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const zs=globalThis,nc=t=>t,ur=zs.trustedTypes,rc=ur?ur.createPolicy("lit-html",{createHTML:t=>t}):void 0,wd="$lit$",Zt=`lit$${Math.random().toFixed(9).slice(2)}$`,kd="?"+Zt,Jp=`<${kd}>`,Fi=document,Js=()=>Fi.createComment(""),Ys=t=>t===null||typeof t!="object"&&typeof t!="function",rl=Array.isArray,Yp=t=>rl(t)||typeof(t==null?void 0:t[Symbol.iterator])=="function",po=`[ 	
\f\r]`,Ts=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,oc=/-->/g,ac=/>/g,wi=RegExp(`>|${po}(?:([^\\s"'>=/]+)(${po}*=${po}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),lc=/'/g,cc=/"/g,Sd=/^(?:script|style|textarea|title)$/i,Gp=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),g=Gp(1),ds=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),hc=new WeakMap,$i=Fi.createTreeWalker(Fi,129);function Cd(t,e){if(!rl(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return rc!==void 0?rc.createHTML(e):e}const Zp=(t,e)=>{const i=t.length-1,s=[];let n,r=e===2?"<svg>":e===3?"<math>":"",o=Ts;for(let a=0;a<i;a++){const l=t[a];let c,h,d=-1,f=0;for(;f<l.length&&(o.lastIndex=f,h=o.exec(l),h!==null);)f=o.lastIndex,o===Ts?h[1]==="!--"?o=oc:h[1]!==void 0?o=ac:h[2]!==void 0?(Sd.test(h[2])&&(n=RegExp("</"+h[2],"g")),o=wi):h[3]!==void 0&&(o=wi):o===wi?h[0]===">"?(o=n??Ts,d=-1):h[1]===void 0?d=-2:(d=o.lastIndex-h[2].length,c=h[1],o=h[3]===void 0?wi:h[3]==='"'?cc:lc):o===cc||o===lc?o=wi:o===oc||o===ac?o=Ts:(o=wi,n=void 0);const u=o===wi&&t[a+1].startsWith("/>")?" ":"";r+=o===Ts?l+Jp:d>=0?(s.push(c),l.slice(0,d)+wd+l.slice(d)+Zt+u):l+Zt+(d===-2?a:u)}return[Cd(t,r+(t[i]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]};class Gs{constructor({strings:e,_$litType$:i},s){let n;this.parts=[];let r=0,o=0;const a=e.length-1,l=this.parts,[c,h]=Zp(e,i);if(this.el=Gs.createElement(c,s),$i.currentNode=this.el.content,i===2||i===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(n=$i.nextNode())!==null&&l.length<a;){if(n.nodeType===1){if(n.hasAttributes())for(const d of n.getAttributeNames())if(d.endsWith(wd)){const f=h[o++],u=n.getAttribute(d).split(Zt),p=/([.?@])?(.*)/.exec(f);l.push({type:1,index:r,name:p[2],strings:u,ctor:p[1]==="."?tg:p[1]==="?"?ig:p[1]==="@"?sg:Xr}),n.removeAttribute(d)}else d.startsWith(Zt)&&(l.push({type:6,index:r}),n.removeAttribute(d));if(Sd.test(n.tagName)){const d=n.textContent.split(Zt),f=d.length-1;if(f>0){n.textContent=ur?ur.emptyScript:"";for(let u=0;u<f;u++)n.append(d[u],Js()),$i.nextNode(),l.push({type:2,index:++r});n.append(d[f],Js())}}}else if(n.nodeType===8)if(n.data===kd)l.push({type:2,index:r});else{let d=-1;for(;(d=n.data.indexOf(Zt,d+1))!==-1;)l.push({type:7,index:r}),d+=Zt.length-1}r++}}static createElement(e,i){const s=Fi.createElement("template");return s.innerHTML=e,s}}function fs(t,e,i=t,s){var o,a;if(e===ds)return e;let n=s!==void 0?(o=i._$Co)==null?void 0:o[s]:i._$Cl;const r=Ys(e)?void 0:e._$litDirective$;return(n==null?void 0:n.constructor)!==r&&((a=n==null?void 0:n._$AO)==null||a.call(n,!1),r===void 0?n=void 0:(n=new r(t),n._$AT(t,i,s)),s!==void 0?(i._$Co??(i._$Co=[]))[s]=n:i._$Cl=n),n!==void 0&&(e=fs(t,n._$AS(t,e.values),n,s)),e}class eg{constructor(e,i){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:i},parts:s}=this._$AD,n=((e==null?void 0:e.creationScope)??Fi).importNode(i,!0);$i.currentNode=n;let r=$i.nextNode(),o=0,a=0,l=s[0];for(;l!==void 0;){if(o===l.index){let c;l.type===2?c=new xn(r,r.nextSibling,this,e):l.type===1?c=new l.ctor(r,l.name,l.strings,this,e):l.type===6&&(c=new ng(r,this,e)),this._$AV.push(c),l=s[++a]}o!==(l==null?void 0:l.index)&&(r=$i.nextNode(),o++)}return $i.currentNode=Fi,n}p(e){let i=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,i),i+=s.strings.length-2):s._$AI(e[i])),i++}}class xn{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,i,s,n){this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=e,this._$AB=i,this._$AM=s,this.options=n,this._$Cv=(n==null?void 0:n.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const i=this._$AM;return i!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=i.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,i=this){e=fs(this,e,i),Ys(e)?e===v||e==null||e===""?(this._$AH!==v&&this._$AR(),this._$AH=v):e!==this._$AH&&e!==ds&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Yp(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==v&&Ys(this._$AH)?this._$AA.nextSibling.data=e:this.T(Fi.createTextNode(e)),this._$AH=e}$(e){var r;const{values:i,_$litType$:s}=e,n=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=Gs.createElement(Cd(s.h,s.h[0]),this.options)),s);if(((r=this._$AH)==null?void 0:r._$AD)===n)this._$AH.p(i);else{const o=new eg(n,this),a=o.u(this.options);o.p(i),this.T(a),this._$AH=o}}_$AC(e){let i=hc.get(e.strings);return i===void 0&&hc.set(e.strings,i=new Gs(e)),i}k(e){rl(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,n=0;for(const r of e)n===i.length?i.push(s=new xn(this.O(Js()),this.O(Js()),this,this.options)):s=i[n],s._$AI(r),n++;n<i.length&&(this._$AR(s&&s._$AB.nextSibling,n),i.length=n)}_$AR(e=this._$AA.nextSibling,i){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,i);e!==this._$AB;){const n=nc(e).nextSibling;nc(e).remove(),e=n}}setConnected(e){var i;this._$AM===void 0&&(this._$Cv=e,(i=this._$AP)==null||i.call(this,e))}}class Xr{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,i,s,n,r){this.type=1,this._$AH=v,this._$AN=void 0,this.element=e,this.name=i,this._$AM=n,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=v}_$AI(e,i=this,s,n){const r=this.strings;let o=!1;if(r===void 0)e=fs(this,e,i,0),o=!Ys(e)||e!==this._$AH&&e!==ds,o&&(this._$AH=e);else{const a=e;let l,c;for(e=r[0],l=0;l<r.length-1;l++)c=fs(this,a[s+l],i,l),c===ds&&(c=this._$AH[l]),o||(o=!Ys(c)||c!==this._$AH[l]),c===v?e=v:e!==v&&(e+=(c??"")+r[l+1]),this._$AH[l]=c}o&&!n&&this.j(e)}j(e){e===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class tg extends Xr{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===v?void 0:e}}class ig extends Xr{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==v)}}class sg extends Xr{constructor(e,i,s,n,r){super(e,i,s,n,r),this.type=5}_$AI(e,i=this){if((e=fs(this,e,i,0)??v)===ds)return;const s=this._$AH,n=e===v&&s!==v||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,r=e!==v&&(s===v||n);n&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var i;typeof this._$AH=="function"?this._$AH.call(((i=this.options)==null?void 0:i.host)??this.element,e):this._$AH.handleEvent(e)}}class ng{constructor(e,i,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){fs(this,e)}}const go=zs.litHtmlPolyfillSupport;go==null||go(Gs,xn),(zs.litHtmlVersions??(zs.litHtmlVersions=[])).push("3.3.2");const rg=(t,e,i)=>{const s=(i==null?void 0:i.renderBefore)??e;let n=s._$litPart$;if(n===void 0){const r=(i==null?void 0:i.renderBefore)??null;s._$litPart$=n=new xn(e.insertBefore(Js(),r),r,void 0,i??{})}return n._$AI(t),n};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Di=globalThis;let he=class extends ji{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var i;const e=super.createRenderRoot();return(i=this.renderOptions).renderBefore??(i.renderBefore=e.firstChild),e}update(e){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=rg(i,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return ds}};var yd;he._$litElement$=!0,he.finalized=!0,(yd=Di.litElementHydrateSupport)==null||yd.call(Di,{LitElement:he});const mo=Di.litElementPolyfillSupport;mo==null||mo({LitElement:he});(Di.litElementVersions??(Di.litElementVersions=[])).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ke=t=>(e,i)=>{i!==void 0?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const og={attribute:!0,type:String,converter:fr,reflect:!1,hasChanged:nl},ag=(t=og,e,i)=>{const{kind:s,metadata:n}=i;let r=globalThis.litPropertyMetadata.get(n);if(r===void 0&&globalThis.litPropertyMetadata.set(n,r=new Map),s==="setter"&&((t=Object.create(t)).wrapped=!0),r.set(i.name,t),s==="accessor"){const{name:o}=i;return{set(a){const l=e.get.call(this);e.set.call(this,a),this.requestUpdate(o,l,t,!0,a)},init(a){return a!==void 0&&this.C(o,void 0,t,a),a}}}if(s==="setter"){const{name:o}=i;return function(a){const l=this[o];e.call(this,a),this.requestUpdate(o,l,t,!0,a)}}throw Error("Unsupported decorator location: "+s)};function Q(t){return(e,i)=>typeof i=="object"?ag(t,e,i):((s,n,r)=>{const o=n.hasOwnProperty(r);return n.constructor.createProperty(r,s),o?Object.getOwnPropertyDescriptor(n,r):void 0})(t,e,i)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function y(t){return Q({...t,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const lg=(t,e,i)=>(i.configurable=!0,i.enumerable=!0,Reflect.decorate&&typeof e!="object"&&Object.defineProperty(t,e,i),i);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Od(t,e){return(i,s,n)=>{const r=o=>{var a;return((a=o.renderRoot)==null?void 0:a.querySelector(t))??null};return lg(i,s,{get(){return r(this)}})}}const cg=(()=>{const t=document.querySelector('meta[name="x-ingress-path"]');return t&&t.getAttribute("content")?t.getAttribute("content").replace(/\/+$/,""):""})(),hg=15e3,dg=3e4;let Mn=null,bo=null;function Ft(t){const e=cg||"";return t.startsWith("/")?e+t:e+"/"+t}function fg(t,e){if(!t)return null;if(e!=null&&e.includes("application/json"))return JSON.parse(t);try{return JSON.parse(t)}catch{return t}}async function M(t,e){const i=new AbortController,s=setTimeout(()=>i.abort("timeout"),hg);try{const n=await fetch(Ft(t),{...e,signal:i.signal,headers:(e==null?void 0:e.body)instanceof FormData?e.headers:{"Content-Type":"application/json",...(e==null?void 0:e.headers)||{}}});clearTimeout(s);const r=await n.text(),o=fg(r,n.headers.get("content-type"));if(!n.ok){let a=`${n.status} ${n.statusText}`;if(o&&typeof o=="object"){const l=o,c=l.detail,h=l.error;typeof c=="string"&&c?a=c:typeof h=="string"&&h&&(a=h)}else typeof o=="string"&&o&&(a=o);throw new Error(a)}return o}catch(n){if(clearTimeout(s),n instanceof DOMException&&n.name==="AbortError"){const r=i.signal.reason;throw new Error(r==="timeout"?"timeout":"cancelled")}throw n}}const C={config:()=>M("/api/config"),updateConfig:t=>M("/api/config",{method:"PUT",body:JSON.stringify(t)}),discoverBridges:()=>M("/api/bridge/discover"),triggerScan:()=>M("/api/bridge/scan",{method:"POST"}),getScanLog:()=>M("/api/bridge/scan-log"),getBridges:()=>M("/api/bridges"),scanSerialPorts:()=>M("/api/serial/ports").then(t=>t.ports),addBridge:(t,e=80,i,s,n,r="wifi",o,a=460800)=>M("/api/bridges",{method:"POST",body:JSON.stringify({host:t,port:e,name:i,api_key:s,hostname:n,transport:r,serial_port:o,baud:a})}),updateBridge:(t,e,i,s,n)=>M(`/api/bridges/${t}`,{method:"PUT",body:JSON.stringify({name:e,host:i,port:s,api_key:n})}),deleteBridge:t=>M(`/api/bridges/${t}`,{method:"DELETE"}),activateBridge:t=>M(`/api/bridges/${t}/activate`,{method:"PUT"}),deactivateBridge:t=>M(`/api/bridges/${t}/deactivate`,{method:"PUT"}),bridgeReconnect:t=>M(`/api/bridges/${t}/reconnect`,{method:"POST"}),selectBridge:(t,e,i,s,n,r,o)=>M("/api/bridge/select",{method:"POST",body:JSON.stringify({host:t,port:e,name:i,version:s,api_key:n,network_id:r,hostname:o})}),topology:(t=!1)=>{const e=Date.now();return!t&&Mn&&e-Mn.ts<dg?Promise.resolve(Mn.data):M("/api/bridge/topology.json").then(i=>(Mn={data:i,ts:e},i))},hideDevice:t=>M(`/api/topology/hide/${encodeURIComponent(t)}`,{method:"DELETE"}),unhideDevice:t=>M(`/api/topology/unhide/${encodeURIComponent(t)}`,{method:"POST"}),devices:()=>M("/api/devices"),device:t=>M(`/api/devices/${encodeURIComponent(t)}`),currentOta:()=>M("/api/ota/current"),currentOtaForDevice:t=>M(`/api/ota/current?mac=${encodeURIComponent(t)}`),uploadFirmware:(t,e)=>{const i=new FormData;return i.set("mac",t),i.set("file",e),M("/api/ota/upload",{method:"POST",body:i})},startOta:t=>M(`/api/ota/start/${t}`,{method:"POST"}),abortOta:()=>M("/api/ota/abort",{method:"POST"}),cancelPending:t=>M(`/api/ota/pending/${t}`,{method:"DELETE"}),getQueue:()=>M("/api/ota/queue"),getQueuePaused:()=>M("/api/ota/queue/paused"),pauseQueue:()=>M("/api/ota/queue/pause",{method:"POST"}),resumeQueue:()=>M("/api/ota/queue/resume",{method:"POST"}),abortQueuedJob:t=>M(`/api/ota/queue/${t}/abort`,{method:"POST"}),reorderJobUp:t=>M(`/api/ota/queue/${t}/up`,{method:"POST"}),reorderJobDown:t=>M(`/api/ota/queue/${t}/down`,{method:"POST"}),history:t=>M(`/api/ota/history/${encodeURIComponent(t)}`),jobLog:t=>M(`/api/ota/jobs/${t}/log`),retained:()=>M("/api/firmware/retained"),reflash:t=>M(`/api/ota/reflash/${t}`,{method:"POST"}),deleteRetained:t=>M(`/api/firmware/retained/${t}`,{method:"DELETE"}),getConfig:t=>M(`/api/devices/${encodeURIComponent(t)}/config`),saveConfig:(t,e,i)=>M(`/api/devices/${encodeURIComponent(t)}/config`,{method:"PUT",body:JSON.stringify({content:e,scaffold:i})}),deleteConfig:t=>M(`/api/devices/${encodeURIComponent(t)}/config`,{method:"DELETE"}),checkSecrets:t=>M("/api/secrets/check",{method:"POST",body:JSON.stringify({content:t})}),importConfig:(t,e)=>{if(typeof e=="string")return M(`/api/devices/${encodeURIComponent(t)}/config/import`,{method:"POST",body:JSON.stringify({content:e})});const i=new FormData;return i.set("file",e),M(`/api/devices/${encodeURIComponent(t)}/config/import`,{method:"POST",body:i})},getConfigStatus:t=>M(`/api/devices/${encodeURIComponent(t)}/config/status`),compileDevice:(t,e=!1)=>{const i=e?"?auto_flash=true":"";return M(`/api/devices/${encodeURIComponent(t)}/compile${i}`,{method:"POST"})},getCompileStatus:t=>M(`/api/devices/${encodeURIComponent(t)}/compile/status`),cancelCompile:t=>M(`/api/devices/${encodeURIComponent(t)}/compile/cancel`,{method:"POST"}),startCompileFlash:t=>M(`/api/devices/${encodeURIComponent(t)}/compile/start-flash`,{method:"POST"}),getCompileHistory:t=>M(`/api/devices/${encodeURIComponent(t)}/compile/history`),rebootDevice:t=>M(`/api/devices/${encodeURIComponent(t)}/reboot`,{method:"POST"}),setHeartbeatInterval:(t,e)=>M(`/api/devices/${encodeURIComponent(t)}/heartbeat`,{method:"POST",body:JSON.stringify({interval_seconds:e})}),forceRediscover:t=>M(`/api/devices/${encodeURIComponent(t)}/rediscover`,{method:"POST"}),setParentMac:(t,e,i=!0)=>M(`/api/devices/${encodeURIComponent(t)}/parent`,{method:"POST",body:JSON.stringify({parent_mac:e,clear:i})}),setRelay:(t,e)=>M(`/api/devices/${encodeURIComponent(t)}/relay`,{method:"POST",body:JSON.stringify({enable:e})}),getCompileQueue:()=>M("/api/compile/queue"),getCompileHistoryAll:(t=100)=>M(`/api/compile/history?limit=${t}`),abortCompileJob:t=>M(`/api/compile/queue/${t}/abort`,{method:"POST"}),getAllHistory:async(t=100)=>{const[e,i]=await Promise.all([M(`/api/ota/history?limit=${t}`),M(`/api/compile/history?limit=${t}`)]),s=[...e.jobs,...i.jobs];return s.sort((n,r)=>(r.created_at??0)-(n.created_at??0)),{jobs:s.slice(0,t)}},getSecrets:()=>M("/api/secrets"),saveSecrets:t=>M("/api/secrets",{method:"PUT",body:JSON.stringify({content:t})}),getContainerStatus:()=>M("/api/compile/container/status"),cleanArtifacts:()=>M("/api/compile/artifacts",{method:"DELETE"}),getSerialPorts:()=>M("/api/serial/ports"),startSerialFlash:(t,e)=>M(`/api/devices/${encodeURIComponent(t)}/flash/serial`,{method:"POST",body:JSON.stringify({port:e})}),getSerialFlashStatus:t=>M(`/api/devices/${encodeURIComponent(t)}/flash/serial/status`),cancelSerialFlash:t=>M(`/api/devices/${encodeURIComponent(t)}/flash/serial/cancel`,{method:"POST"}),restartRequired:()=>M("/api/restart-required"),requestRestart:()=>M("/api/restart",{method:"POST"}),setupStatus:()=>M("/api/setup-status"),integrationSetup:()=>M("/api/integration/setup",{method:"POST"}),detectChip:t=>M("/api/bridge/flash-wizard/detect-chip",{method:"POST",body:JSON.stringify({port:t})}),submitFlashWizard:t=>M("/api/bridge/flash-wizard/submit",{method:"POST",body:JSON.stringify(t)}),getFlashWizardStatus:()=>M("/api/bridge/flash-wizard/status"),streamCompileLogs(t,e,i){const s=Ft(`/api/devices/${encodeURIComponent(t)}/compile/logs`),n=new EventSource(s);return n.onmessage=r=>{e(r.data)},n.addEventListener("status",r=>{e(`[status: ${r.data}]`)}),n.addEventListener("exit",r=>{e(`[build exited with code ${r.data}]`)}),n.addEventListener("queue_position",r=>{e(`[queue position: ${r.data}]`)}),n.onerror=i,n},streamSerialFlashLogs(t,e,i,s){const n=Ft(`/api/devices/${encodeURIComponent(t)}/flash/serial/logs`),r=new EventSource(n);return r.onmessage=o=>{e(o.data)},r.addEventListener("status",o=>{i(o.data)}),r.onerror=s,r},downloadFactoryBinary(t){return Ft(`/api/devices/${encodeURIComponent(t)}/firmware/download`)},downloadCompileBinary(t){return Ft(`/api/devices/${encodeURIComponent(t)}/compile/firmware/download`)},downloadJobBinary(t){return Ft(`/api/jobs/${t}/firmware/download`)},activityLog(t,e,i){const s=Ft("/api/integration/activity"),n=new EventSource(s);return n.addEventListener("line",r=>{t(r.data)}),n.addEventListener("end",()=>{e()}),n.addEventListener("error",r=>{i(r)}),n.onerror=i,n}};function ug(t){let e=null,i=!1,s=1e3;const n=()=>{if(i)return;const r=Ft("/ws/topology");e=new WebSocket(r),e.onopen=()=>{s=1e3},e.onmessage=o=>{try{const a=JSON.parse(o.data);a.type==="bridge.connection"&&typeof a.payload=="object"&&a.payload!==null&&t(a.payload.connected)}catch{}},e.onclose=()=>{i||(setTimeout(n,s),s=Math.min(s*2,1e4))},e.onerror=()=>{e==null||e.close()}};return n(),{close(){i=!0,e==null||e.close()}}}function pg(t){let e=null,i=!1,s=1e3;const n=()=>{if(i)return;const r=Ft("/ws/topology");e=new WebSocket(r),e.onopen=()=>{s=1e3},e.onmessage=o=>{try{const a=JSON.parse(o.data);a&&a.type==="server_id"&&typeof a.value=="string"&&(bo!==null&&bo!==a.value&&location.reload(),bo=a.value),t(a)}catch{}},e.onclose=()=>{i||(setTimeout(n,s),s=Math.min(s*2,1e4))},e.onerror=()=>{e==null||e.close()}};return n(),{close(){i=!0,e==null||e.close()}}}function le(t){const e=t.replace(/[^0-9A-Fa-f]/g,"");return e.length!==12?t.trim().toUpperCase():e.match(/.{2}/g).join(":").toUpperCase()}function _i(t){const e=t||0;return e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/1024/1024).toFixed(2)} MB`}function us(t){return t?new Date(t*1e3).toLocaleString():"-"}function pr(t){if(!t)return"-";const e=Math.max(0,Math.floor((Date.now()-t*1e3)/1e3));return e<60?`${e}s ago`:e<3600?`${Math.floor(e/60)}m ago`:e<86400?`${Math.floor(e/3600)}h ago`:`${Math.floor(e/86400)}d ago`}function dt(t){if(t==null||t<0)return"";const e=Number(t);if(e<60)return`${Math.round(e)}s`;if(e<3600)return`${Math.floor(e/60)}m ${Math.round(e%60)}s`;if(e<86400){const r=Math.floor(e/3600),o=Math.floor(e%3600/60);return`${r}h ${o}m`}const i=Math.floor(e/86400);if(i<7){const r=e%86400,o=Math.floor(r/3600);return`${i}d ${o}h`}const s=Math.floor(i/7),n=i%7;return`${s}w ${n}d`}var gg=Object.defineProperty,mg=Object.getOwnPropertyDescriptor,Kt=(t,e,i,s)=>{for(var n=s>1?void 0:s?mg(e,i):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(n=(s?o(e,i,n):o(n))||n);return s&&n&&gg(e,i,n),n};let ft=class extends he{constructor(){super(...arguments),this.childNodesData=[],this.childMap=new Map,this.jobForMac=()=>null,this.configForMac=()=>null,this.onHideDevice=()=>{},this.isRoot=!1,this.isLast=!1}selectNode(){this.node.ha_device_id?window.open(`/config/devices/device/${this.node.ha_device_id}`,"_blank"):this.dispatchEvent(new CustomEvent("node-selected",{detail:this.node.mac,bubbles:!0,composed:!0}))}navigateTo(t){window.location.hash=t}rssiBars(t){return t==null?"-":t>=-50?"▂▄▆█":t>=-65?"▂▄▆":t>=-80?"▂▄":t>=-90?"▂":"▁"}childKey(t){return le(t.mac||"")}render(){const t=this.jobForMac(this.node.mac),e=!!t&&["starting","transferring","verifying","transfer_success_waiting_rejoin"].includes(t.status),i=!!t&&t.status==="queued",s=(t==null?void 0:t.percent)??0,n=this.childNodesData.length>0,r=(this.node.hops??0)>0,o=this.configForMac(this.node.mac),a=(o==null?void 0:o.config_state)??"no_config",l=a==="compiling",c=a==="compile_queued",h=(o==null?void 0:o.queue_position)??1;return g`
      <div class="tree-row">
        <div class="branch ${this.isRoot?"root":""}" aria-hidden="true"></div>
        <div class="tree-node ${this.node.online?"online":"offline"}" @click=${this.selectNode}>
          ${r?g`
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
            <span class="${this.node.online?"":"offline-metric"}">${this.node.online?dt(this.node.uptime_s):g`<button class="hide-pill" title="hide until back online" @click=${d=>{d.stopPropagation(),this.onHideDevice(this.node.mac)}}>✕ hide</button>`}</span>
            ${this.isRoot||this.node.last_seen_ago==null?g`<span class="pill-placeholder">—</span>`:g`<span class="last-seen">${dt(this.node.last_seen_ago)} ago</span>`}
            ${this.isRoot?g`<span class="pill-placeholder">—</span>`:this.node.online?g`<span title="${this.node.rssi!=null?`${this.node.rssi} dBm`:""}">${this.rssiBars(this.node.rssi)}${(this.node.hops??0)>0?`  ${this.node.hops}↷`:""}</span>`:g`<span class="offline-metric">${this.node.offline_reason||"offline"}</span>`}
            <span class="chip-name">${this.node.chip_name||"-"}</span>
          </span>
          ${r?g`
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
          ${r?g`
            <span class="action-buttons">
              <button class="icon-btn" title="Edit YAML config" @click=${d=>{d.stopPropagation(),this.navigateTo(`/device/${encodeURIComponent(this.node.mac)}/config`)}}>Edit YAML</button>
            </span>
          `:v}
        </div>
      </div>
      ${n?g`
            <div class="tree-child">
              ${this.childNodesData.map((d,f)=>g`
                  <esp-topology-node
                    .node=${d}
                    .childNodesData=${this.childMap.get(this.childKey(d))||[]}
                    .childMap=${this.childMap}
                    .jobForMac=${this.jobForMac}
                    .configForMac=${this.configForMac}
                    .onHideDevice=${this.onHideDevice}
                    .isLast=${f===this.childNodesData.length-1}
                  ></esp-topology-node>
                `)}
            </div>
          `:v}
    `}};ft.styles=we`
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
      grid-template-columns: 14px 10px minmax(180px, 1fr) 1fr auto auto;
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
      display: inline-flex;
      align-items: center;
      justify-content: center;
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
    }

    .icon-btn:hover {
      background: #0d5f58;
      border-color: #0d5f58;
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
      gap: 8px;
      font-size: 12px;
      color: var(--muted);
      justify-content: flex-end;
    }

    .metrics span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #f1f5f9;
      padding: 3px 8px;
      border-radius: 6px;
      white-space: nowrap;
      width: 76px;
      text-align: center;
    }

    .metrics span.offline-metric {
      background: var(--danger);
      color: #fff;
    }

    .hide-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 76px;
      padding: 3px 8px;
      border: none;
      border-radius: 6px;
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
      min-width: 72px;
    }

    .pill-placeholder {
      background: #f1f5f9;
      padding: 3px 8px;
      border-radius: 6px;
      width: 76px;
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
      padding: 2px 8px;
      border-radius: 6px;
      white-space: nowrap;
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

    @media (max-width: 840px) {
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
  `;Kt([Q({type:Object})],ft.prototype,"node",2);Kt([Q({type:Array})],ft.prototype,"childNodesData",2);Kt([Q({attribute:!1})],ft.prototype,"childMap",2);Kt([Q({attribute:!1})],ft.prototype,"jobForMac",2);Kt([Q({attribute:!1})],ft.prototype,"configForMac",2);Kt([Q({attribute:!1})],ft.prototype,"onHideDevice",2);Kt([Q({type:Boolean})],ft.prototype,"isRoot",2);Kt([Q({type:Boolean,reflect:!0})],ft.prototype,"isLast",2);ft=Kt([ke("esp-topology-node")],ft);var bg=Object.defineProperty,vg=Object.getOwnPropertyDescriptor,bi=(t,e,i,s)=>{for(var n=s>1?void 0:s?vg(e,i):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(n=(s?o(e,i,n):o(n))||n);return s&&n&&bg(e,i,n),n};let Dt=class extends he{constructor(){super(...arguments),this.topology=[],this.currentJob=null,this.queueData=null,this.configStatuses=new Map,this.loading=!0,this.error="",this.hiddenExpanded=!1}connectedCallback(){super.connectedCallback(),this.load(),this.stream=pg(t=>{(t.type==="topology.snapshot"||t.type==="topology.changed"||t.type==="remote.availability"||t.type==="bridge.heartbeat")&&this.load(!1,!0)})}disconnectedCallback(){var t;(t=this.stream)==null||t.close(),super.disconnectedCallback()}async load(t=!0,e=!1){t&&(this.loading=!0);try{const[i,s,n]=await Promise.all([C.topology(e),C.currentOta(),C.getQueue()]);this.topology=i,this.currentJob=s.job,this.queueData=n,this.error="";const r=i.filter(l=>(l.hops??0)>0).map(l=>C.getConfigStatus(l.mac).catch(()=>null)),o=await Promise.all(r),a=new Map;o.forEach(l=>{l&&a.set(le(l.mac),l)}),this.configStatuses=a}catch(i){this.error=i instanceof Error?i.message:String(i)}finally{this.loading=!1}}async handleHideDevice(t){try{await C.hideDevice(t),await this.load(!1,!0)}catch(e){console.error("Failed to hide device:",e)}}async handleUnhideDevice(t){try{await C.unhideDevice(t),await this.load(!1,!0)}catch(e){console.error("Failed to unhide device:",e)}}jobForMac(t){var s;const e=le(t);return this.currentJob&&le(this.currentJob.mac)===e?this.currentJob:(((s=this.queueData)==null?void 0:s.queued_jobs)??[]).find(n=>le(n.mac)===e)??null}configForMac(t){return this.configStatuses.get(le(t))??null}childKey(t){return le(t||"")}buildChildren(){const t=new Map;for(const i of this.topology){const s=this.childKey(i.parent_mac);if(!s)continue;const n=t.get(s)||[];n.push(i),t.set(s,n)}for(const i of t.values())i.sort((s,n)=>(s.friendly_name||s.label||s.esphome_name||s.mac).localeCompare(n.friendly_name||n.label||n.esphome_name||n.mac));return{root:this.topology.find(i=>(i.hops??0)===0)||this.topology.find(i=>!i.parent_mac)||this.topology[0]||null,childMap:t}}render(){const{root:t}=this.buildChildren(),e=this.topology.filter(n=>!n.hidden&&(n.hops??0)>0),i=this.topology.filter(n=>n.hidden),s=new Map;for(const n of e){const r=this.childKey(n.parent_mac);if(!r)continue;const o=s.get(r)||[];o.push(n),s.set(r,o)}for(const n of s.values())n.sort((r,o)=>(r.friendly_name||r.label||r.esphome_name||r.mac).localeCompare(o.friendly_name||o.label||o.esphome_name||o.mac));return g`
      ${this.error?g`<div class="error">${this.error}</div>`:v}
      ${this.loading?g`<div class="loading">Reading bridge topology...</div>`:v}
      ${!this.loading&&!t&&!this.error?g`<div class="loading">No topology data returned by the bridge.</div>`:v}
      ${t?g`
            <section class="card">
              <div class="card-header">
                <h2>${t.friendly_name||t.label||t.esphome_name||"Bridge"} Topology</h2>
                <button class="btn" @click=${()=>void this.load()}>Refresh</button>
              </div>
              <div class="card-body">
                <div class="tree-root">
                  <esp-topology-node
                    .node=${t}
                    .childNodesData=${s.get(this.childKey(t.mac))||[]}
                    .childMap=${s}
                    .jobForMac=${n=>this.jobForMac(n)}
                    .configForMac=${n=>this.configForMac(n)}
                    .onHideDevice=${n=>this.handleHideDevice(n)}
                    .isRoot=${!0}
                  ></esp-topology-node>
                </div>
              </div>
            </section>
          `:v}
      ${i.length>0?g`
            <section class="card hidden-section">
              <div class="card-header collapsible" @click=${()=>{this.hiddenExpanded=!this.hiddenExpanded}}>
                <h2>Hidden Devices (${i.length})</h2>
                <span class="expand-icon">${this.hiddenExpanded?"▼":"▶"}</span>
              </div>
              ${this.hiddenExpanded?g`
                    <div class="card-body">
                      <div class="hidden-devices">
                        ${i.map(n=>g`
                          <div class="hidden-device-row" @click=${()=>{window.location.hash=`/device/${encodeURIComponent(n.mac)}`}}>
                            <span class="status-dot offline"></span>
                            <span class="device-name">${n.friendly_name||n.esphome_name||n.label||n.mac}</span>
                            <span class="device-mac">${n.mac}</span>
                            <span class="device-status">${n.offline_reason||"offline"}</span>
                            <button class="restore-btn" @click=${r=>{r.stopPropagation(),this.handleUnhideDevice(n.mac)}}>Restore</button>
                          </div>
                        `)}
                      </div>
                    </div>
                  `:v}
            </section>
          `:v}
    `}};Dt.styles=we`
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
  `;bi([y()],Dt.prototype,"topology",2);bi([y()],Dt.prototype,"currentJob",2);bi([y()],Dt.prototype,"queueData",2);bi([y()],Dt.prototype,"configStatuses",2);bi([y()],Dt.prototype,"loading",2);bi([y()],Dt.prototype,"error",2);bi([y()],Dt.prototype,"hiddenExpanded",2);Dt=bi([ke("esp-topology-map")],Dt);var yg=Object.defineProperty,xg=Object.getOwnPropertyDescriptor,$e=(t,e,i,s)=>{for(var n=s>1?void 0:s?xg(e,i):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(n=(s?o(e,i,n):o(n))||n);return s&&n&&yg(e,i,n),n};let ve=class extends he{constructor(){super(...arguments),this.mac="",this.online=!1,this.isRemote=!1,this.relayNodes=[],this.relayEnabled=!1,this.busy="",this.heartbeatSeconds=60,this.selectedParent="",this.customParentMac="",this.showRelayModal=!1,this.showHeartbeatModal=!1,this.showParentModal=!1,this.parentDropdownOpen=!1,this.showConfirmModal="",this.confirmAction=null,this.toast=null}disconnectedCallback(){this.toastTimer&&window.clearTimeout(this.toastTimer),super.disconnectedCallback()}disabled(t=""){return!this.online||!!this.busy||!!t&&this.busy!==t}notify(t,e){this.toast={message:t,tone:e},this.toastTimer&&window.clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>{this.toast=null},4500)}configError(t,e,i){if(e===void 0){console.error("Unexpected config response:",i),this.notify(`${t} returned an unexpected response`,"error");return}const n={rejected:"Config Fail Device Rejected",busy:"Config Fail Device Busy",timeout:"Config Fail Device Timeout",no_session:"Config Fail No Session",not_remote:"Config Fail Not Remote",invalid_payload:"Config Fail Invalid Payload",unsupported:"Config Fail Unsupported"}[e]??`${t} returned ${e}`;this.notify(n,"error")}dispatchChanged(){this.dispatchEvent(new CustomEvent("config-changed",{bubbles:!0,composed:!0}))}reboot(){this.showConfirmModal="Reboot",this.confirmAction=()=>{this.busy="reboot",C.rebootDevice(this.mac).then(t=>{t.result==="ok"?(this.notify("Reboot command accepted","ok"),this.dispatchChanged()):this.configError(t.command,t.result,t)}).catch(t=>{this.notify(t instanceof Error?t.message:String(t),"error")}).finally(()=>{this.busy=""})}}rediscover(){this.showConfirmModal="Rediscover",this.confirmAction=()=>{this.busy="rediscover",C.forceRediscover(this.mac).then(t=>{t.result==="ok"?(this.notify("Rediscover command accepted","ok"),this.dispatchChanged()):this.configError(t.command,t.result,t)}).catch(t=>{this.notify(t instanceof Error?t.message:String(t),"error")}).finally(()=>{this.busy=""})}}applyHeartbeat(){const t=Math.trunc(Number(this.heartbeatSeconds));return t<5||t>3600?(this.notify("Heartbeat must be 5-3600 seconds","error"),Promise.resolve()):(console.log("[debug-modal] applyHeartbeat setting showHeartbeatModal=false"),this.showHeartbeatModal=!1,this.busy="heartbeat",C.setHeartbeatInterval(this.mac,t).then(e=>{e.result==="ok"?(this.notify("Heartbeat interval set","ok"),this.dispatchChanged()):this.configError(e.command,e.result,e)}).catch(e=>{this.notify(e instanceof Error?e.message:String(e),"error")}).finally(()=>{this.busy=""}))}applyParent(t){const e=le((this.customParentMac||this.selectedParent).trim());if(!/^[0-9A-F]{2}(:[0-9A-F]{2}){5}$/.test(e)){this.notify("Parent MAC is invalid","error");return}this.showParentModal=!1,this.busy="parent",C.setParentMac(this.mac,e,t).then(i=>{i.result==="ok"?(this.notify("Parent set","ok"),this.dispatchChanged()):this.configError(i.command,i.result,i)}).catch(i=>{this.notify(i instanceof Error?i.message:String(i),"error")}).finally(()=>{this.busy=""})}openRelayModal(){this.showRelayModal=!0}closeRelayModal(){this.showRelayModal=!1}applyRelayModal(t){this.showRelayModal=!1,this.busy="relay",C.setRelay(this.mac,t).then(e=>{if(e.result!==void 0&&!["no_session","timeout","rejected","busy","invalid_payload","not_remote"].includes(e.result)){const s=e.result==="ok"?t?"Relay Enabled Successfully":"Relay Disabled Successfully":e.result;this.notify(s,"ok"),this.dispatchChanged()}else this.configError(e.command,e.result,e)}).catch(e=>{this.notify(e instanceof Error?e.message:String(e),"error")}).finally(()=>{this.busy=""})}render(){return this.isRemote?g`
      <section class="config-panel">
        <div class="title-row">
          <div>
            <h2>Device Controls</h2>
          </div>
          ${this.busy?g`<small class="busy">${this.busy}</small>`:v}
        </div>

        ${this.online?v:g`<div class="offline">Device offline</div>`}

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

        ${this.showRelayModal?this.renderRelayModal():v}
        ${this.showHeartbeatModal?this.renderHeartbeatModal():v}
        ${this.showParentModal?this.renderParentModal():v}
        ${this.showConfirmModal?this.renderConfirmModal():v}

        ${this.toast?g`<div class="toast ${this.toast.tone}">${this.toast.message}</div>`:v}
      </section>
    `:v}renderRelayModal(){return g`
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
    `}handleBackdropClick(t){t.composedPath().some(i=>{var s;return(s=i.classList)==null?void 0:s.contains("modal")})||(this.showHeartbeatModal=!1,this.showParentModal=!1,this.showConfirmModal="")}renderParentModal(){const t=!!(this.customParentMac.trim()||this.selectedParent),e=this.relayNodes.filter(i=>le(i.mac)!==le(this.mac));return g`
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
                <option value=${le(i.mac)}>
                  ${i.friendly_name||i.esphome_name||i.label||le(i.mac)}
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
          `:v}
          ${this.customParentMac?g`<div class="custom-mac-display">Custom: ${this.customParentMac}</div>`:v}
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
    `}};ve.styles=we`
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
  `;$e([Q({type:String})],ve.prototype,"mac",2);$e([Q({type:Boolean})],ve.prototype,"online",2);$e([Q({type:Boolean})],ve.prototype,"isRemote",2);$e([Q({type:Array})],ve.prototype,"relayNodes",2);$e([Q({type:Boolean})],ve.prototype,"relayEnabled",2);$e([y()],ve.prototype,"busy",2);$e([y()],ve.prototype,"heartbeatSeconds",2);$e([y()],ve.prototype,"selectedParent",2);$e([y()],ve.prototype,"customParentMac",2);$e([y()],ve.prototype,"showRelayModal",2);$e([y()],ve.prototype,"showHeartbeatModal",2);$e([y()],ve.prototype,"showParentModal",2);$e([y()],ve.prototype,"parentDropdownOpen",2);$e([y()],ve.prototype,"showConfirmModal",2);$e([y()],ve.prototype,"confirmAction",2);$e([y()],ve.prototype,"toast",2);ve=$e([ke("esp-device-config")],ve);var wg=Object.defineProperty,kg=Object.getOwnPropertyDescriptor,ol=(t,e,i,s)=>{for(var n=s>1?void 0:s?kg(e,i):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(n=(s?o(e,i,n):o(n))||n);return s&&n&&wg(e,i,n),n};let Zs=class extends he{constructor(){super(...arguments),this.showAbort=!1}abort(){this.dispatchEvent(new CustomEvent("abort",{bubbles:!0,composed:!0}))}render(){const t=Math.max(0,Math.min(100,Number(this.job.percent||0))),i=["success","failed","aborted","rejoin_timeout","version_mismatch"].includes(this.job.status)?this.job.status==="success"?"progress-panel success":"progress-panel failure":"progress-panel",s=this.job.parsed_esphome_name||this.job.esphome_name||this.job.firmware_name||"firmware.ota.bin";return g`
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
          <div><dt>Size</dt><dd>${_i(this.job.firmware_size)}</dd></div>
          <div><dt>Started</dt><dd>${us(this.job.started_at)}</dd></div>
        </dl>
        ${this.job.error_msg?g`<p class="error">${this.job.error_msg}</p>`:v}
        ${this.showAbort?g`<button class="abort-btn" @click=${this.abort}>Abort</button>`:v}
      </section>
    `}};Zs.styles=we`
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
  `;ol([Q({type:Object})],Zs.prototype,"job",2);ol([Q({type:Boolean})],Zs.prototype,"showAbort",2);Zs=ol([ke("esp-ota-progress")],Zs);var Sg=Object.defineProperty,Cg=Object.getOwnPropertyDescriptor,pt=(t,e,i,s)=>{for(var n=s>1?void 0:s?Cg(e,i):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(n=(s?o(e,i,n):o(n))||n);return s&&n&&Sg(e,i,n),n};const dc=new Set(["success","failed","aborted","rejoin_timeout","version_mismatch"]);let Ye=class extends he{constructor(){super(...arguments),this.mac="",this.showEditYaml=!1,this.currentJob=null,this.pendingJob=null,this.preflight=null,this.acceptedWarnings=!1,this.busy=!1,this.error="",this.showAbortModal=!1}async upload(t){var s;const e=t.target,i=(s=e.files)==null?void 0:s[0];if(i){this.busy=!0,this.error="",this.acceptedWarnings=!1;try{const n=await C.uploadFirmware(this.mac,i);this.pendingJob=n.job,this.preflight=n.preflight||null,this.dispatchChanged()}catch(n){this.error=n instanceof Error?n.message:String(n)}finally{this.busy=!1,e.value=""}}}async start(){if(this.pendingJob){this.busy=!0,this.error="";try{(await C.startOta(this.pendingJob.id)).job.status==="queued"?(this.pendingJob=null,this.preflight=null,this.dispatchChanged()):(this.pendingJob=null,this.preflight=null,this.dispatchChanged())}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busy=!1}}}goToConfig(){window.location.hash=`/device/${encodeURIComponent(this.mac)}/config`}async abort(){var e,i,s;const t=((e=this.pendingJob)==null?void 0:e.id)??(((i=this.currentJob)==null?void 0:i.status)==="pending_confirm"?(s=this.currentJob)==null?void 0:s.id:null);if(t){this.pendingJob=null,this.preflight=null,this.acceptedWarnings=!1,this.busy=!0,this.error="";try{await C.cancelPending(t),this.dispatchChanged()}catch(n){this.error=n instanceof Error?n.message:String(n)}finally{this.busy=!1}return}try{if((await C.getQueue()).count>0){this.showAbortModal=!0;return}}catch{}this.pendingJob=null,this.preflight=null,this.acceptedWarnings=!1,this.busy=!0,this.error="";try{await C.abortOta(),this.dispatchChanged()}catch(n){this.error=n instanceof Error?n.message:String(n)}finally{this.busy=!1}}async abortQueued(){if(this.currentJob){this.busy=!0,this.error="";try{await C.abortQueuedJob(this.currentJob.id),this.dispatchChanged()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busy=!1}}}isJobDismissed(t){return sessionStorage.getItem(`esp_tree_ota_dismissed_${t}`)==="1"}dismissAndClear(){var t;((t=this.currentJob)==null?void 0:t.id)!=null&&sessionStorage.setItem(`esp_tree_ota_dismissed_${this.currentJob.id}`,"1"),this.requestUpdate()}dispatchChanged(){this.dispatchEvent(new CustomEvent("ota-changed",{bubbles:!0,composed:!0}))}render(){var c,h,d,f;const t=this.currentJob&&le(this.currentJob.mac)===le(this.mac),e=t&&this.currentJob&&dc.has(this.currentJob.status)?this.currentJob:null,i=t&&((c=this.currentJob)==null?void 0:c.status)==="compile_queued",s=t&&((h=this.currentJob)==null?void 0:h.status)==="compiling",n=t&&((d=this.currentJob)==null?void 0:d.status)==="queued",r=t&&this.currentJob&&!n&&!i&&!s&&this.currentJob.status!=="pending_confirm"&&!dc.has(this.currentJob.status),o=this.pendingJob,a=!!o&&(!((f=this.preflight)!=null&&f.has_warnings)||this.acceptedWarnings)&&!this.busy,l=!!e&&!this.isJobDismissed(e.id);return g`
      <section class="ota">
        <div class="title-row">
          <div>
            <h2>Firmware</h2>
          </div>
          ${t&&this.currentJob&&!e&&!l&&!n&&!i&&!s&&!o&&!r?g`<button class="btn btn-danger" ?disabled=${this.busy} @click=${this.abort}>Abort</button>`:v}
        </div>

        ${l&&e?this.renderFlashResult(e):g`
              ${i&&this.currentJob?this.renderCompileQueued(this.currentJob):v}
              ${s&&this.currentJob?this.renderCompiling(this.currentJob):v}
              ${n&&this.currentJob?this.renderQueued(this.currentJob):r&&this.currentJob?g`<esp-ota-progress .job=${this.currentJob} .showAbort=${!0} @abort=${this.abort}></esp-ota-progress>`:v}

              ${!o&&!n&&!r&&!i&&!s?g`
                    <div class="idle-controls">
                      ${this.showEditYaml?g`<button class="btn btn-edit-yaml" @click=${this.goToConfig}>Edit Firmware YAML</button>`:v}
                      <label class="upload ${this.busy?"busy":""}">
                        <input type="file" accept=".bin,.ota.bin,application/octet-stream" ?disabled=${this.busy} @change=${this.upload} />
                        <strong>${this.busy?"Processing firmware...":"Upload .ota.bin firmware to flash"}</strong>
                      </label>
                    </div>
                  `:v}

              ${o?this.renderPending(o,a):v}
            `}
        ${this.showAbortModal?this.renderAbortModal():v}
        ${this.error?g`<p class="error">${this.error}</p>`:v}
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
    `}async abortCompileQueuedJob(){if(this.currentJob){this.busy=!0,this.error="";try{await C.cancelCompile(this.mac),this.dispatchChanged()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busy=!1}}}async cancelCompile(){this.busy=!0,this.error="";try{await C.cancelCompile(this.mac),this.dispatchChanged()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busy=!1}}renderAbortModal(){return g`
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
    `}async abortAndContinue(){this.showAbortModal=!1,this.pendingJob=null,this.preflight=null,this.busy=!0;try{await C.abortOta(),this.dispatchChanged()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busy=!1}}async abortAndPause(){this.showAbortModal=!1,this.pendingJob=null,this.preflight=null,this.busy=!0;try{await C.abortOta(),await C.pauseQueue(),this.dispatchChanged()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busy=!1}}renderPending(t,e){const i=this.preflight,s=t.parsed_esphome_name||t.esphome_name||t.firmware_name||"Selected firmware",r=`tag ${i!=null&&i.name.match?"match":"mismatch"}`,o=i!=null&&i.name.match?"MATCH":"MISMATCH",l=`tag ${i!=null&&i.chip.match?"match":"mismatch"}`,c=i!=null&&i.chip.match?"MATCH":"MISMATCH",h=(i==null?void 0:i.build_date.status)||"unknown";let d="tag ",f="";return h==="same"?(d+="same",f="SAME"):h==="newer"?(d+="newer",f=`NEWER ${i==null?void 0:i.build_date.delta}`):h==="older"&&(d+="older",f=`OLDER ${i==null?void 0:i.build_date.delta}`),i!=null&&i.metadata_unavailable?g`
        <div class="pending">
          <h3>${s}</h3>
          <p class="meta-unavailable">Metadata not available for ESP8266 Arduino firmware.</p>
          <div class="meta-info">
            <span>Size: ${_i(t.firmware_size)}</span>
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
              <td>${(i==null?void 0:i.name.new)||"-"}<br><span class="${r}">${o}</span></td>
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
          <span>Size: ${_i(t.firmware_size)}</span>
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
            `:v}
        <div class="actions">
          <button class="btn btn-primary" ?disabled=${!e} @click=${this.start}>Flash</button>
          <button class="btn" ?disabled=${this.busy} @click=${this.abort}>Cancel</button>
        </div>
      </div>
    `}renderFlashResult(t){const e=t.status==="success",i=e?"success":"failure",s=e?"FLASH SUCCESSFUL":t.status.replaceAll("_"," ").toUpperCase(),n=e?"The device accepted the new firmware and rejoined the network.":t.error_msg||"The firmware update did not complete successfully.",r=t.parsed_esphome_name||t.esphome_name||t.firmware_name||"-",o=this.node.esphome_name||"-",a=r===o||r==="-"&&o==="-",l=t.parsed_build_date||"-",c=this.node.firmware_build_date||"-",h=l===c||l==="-"&&c==="-",d=t.parsed_chip_name||"-",f=this.node.chip_name||"-",u=d===f||d==="-"&&f==="-",p=t.firmware_md5||"-",m=this.node.firmware_md5||"-",b=p===m||p==="-"&&m==="-";return e?g`
        <div class="flash-result ${i}">
          <div class="result-banner">
            <span class="result-icon">✓</span>
            <span class="result-label">${s}</span>
          </div>
          <h3>${r}</h3>
          <p class="result-message">${n}</p>
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
        <h3>${r}</h3>
        <p class="result-message">${n}</p>
        <table class="compare-table">
          <thead>
            <tr><th>Field</th><th>Flashed</th><th>Device Now</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Name</td>
              <td>${r}</td>
              <td>${o} ${a?v:g`<span class="tag mismatch">CHANGED</span>`}</td>
            </tr>
            <tr>
              <td>Build Date</td>
              <td>${l}</td>
              <td>${c} ${h?v:g`<span class="tag mismatch">CHANGED</span>`}</td>
            </tr>
            <tr>
              <td>Chip Type</td>
              <td>${d}</td>
              <td>${f} ${u?v:g`<span class="tag mismatch">CHANGED</span>`}</td>
            </tr>
            <tr>
              <td>Firmware MD5</td>
              <td>${p}</td>
              <td>${m} ${b?v:g`<span class="tag mismatch">CHANGED</span>`}</td>
            </tr>
          </tbody>
        </table>
        <div class="meta-info">
          <span>Size: ${_i(t.firmware_size)}</span>
          ${t.completed_at?g`<span>Completed: ${us(t.completed_at)}</span>`:v}
        </div>
        <div class="actions">
          <button class="btn btn-primary" @click=${this.dismissAndClear}>Done</button>
        </div>
      </div>
    `}};Ye.styles=we`
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
  `;pt([Q({type:String})],Ye.prototype,"mac",2);pt([Q({type:Object})],Ye.prototype,"node",2);pt([Q({type:Boolean})],Ye.prototype,"showEditYaml",2);pt([Q({type:Object})],Ye.prototype,"currentJob",2);pt([y()],Ye.prototype,"pendingJob",2);pt([y()],Ye.prototype,"preflight",2);pt([y()],Ye.prototype,"acceptedWarnings",2);pt([y()],Ye.prototype,"busy",2);pt([y()],Ye.prototype,"error",2);pt([y()],Ye.prototype,"showAbortModal",2);Ye=pt([ke("esp-ota-box")],Ye);var Og=Object.defineProperty,Ag=Object.getOwnPropertyDescriptor,wn=(t,e,i,s)=>{for(var n=s>1?void 0:s?Ag(e,i):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(n=(s?o(e,i,n):o(n))||n);return s&&n&&Og(e,i,n),n};let Ni=class extends he{constructor(){super(...arguments),this.jobs=[],this.mac="",this.busyJob=null,this.error=""}retained(t){return!!t.firmware_path&&!!t.retained_until&&t.retained_until>Math.floor(Date.now()/1e3)}viewLog(t){const e=`/device/${encodeURIComponent(this.mac||t.mac)}`;window.location.hash=`/job/${t.id}?from=${encodeURIComponent(e)}`}async reflash(t){this.busyJob=t.id,this.error="";try{const e=await C.reflash(t.id);this.dispatchEvent(new CustomEvent("ota-reflash-result",{bubbles:!0,composed:!0,detail:{job:e.job,preflight:e.preflight}})),this.dispatchChanged()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.busyJob=null}}async deleteRetained(t){this.busyJob=t.id,this.error="";try{await C.deleteRetained(t.id),this.dispatchChanged()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.busyJob=null}}dispatchChanged(){this.dispatchEvent(new CustomEvent("ota-changed",{bubbles:!0,composed:!0}))}statusLabel(t){return t.status==="success"?"OTA Upload Success":t.status.replaceAll("_"," ")}statusStyle(t){return{success:"background:#dcfce7;color:#15803d;",failed:"background:#fef2f2;color:#dc2626;",aborted:"background:#fef3c7;color:#b45309;",rejoin_timeout:"background:#fef3c7;color:#b45309;",version_mismatch:"background:#fef3c7;color:#b45309;"}[t]||"background:#f1f5f9;color:#475569;"}render(){return g`
      <section>
        <div class="title-row">
          <div>
            <h2>Flash Log</h2>
          </div>
        </div>
        ${this.error?g`<p class="error">${this.error}</p>`:v}
        ${this.jobs.length?g`
              <div class="table">
                ${this.jobs.map(t=>{const e=t.completed_at&&t.started_at?dt(t.completed_at-t.started_at):"";return g`
                      <article>
                        <span class="device-info">
                          <strong>${t.parsed_esphome_name||t.esphome_name||t.firmware_name||"firmware.ota.bin"}</strong>
                          <span class="device-meta">${t.parsed_build_date||t.firmware_name||""}${t.firmware_size?g` · ${_i(t.firmware_size)}`:v}</span>
                          ${t.error_msg?g`<span class="error-msg" title=${t.error_msg}>!</span>`:v}
                        </span>
                        <span class="status-pill" style=${this.statusStyle(t.status)}>${this.statusLabel(t)}</span>
                        <span class="timestamp">${pr(t.created_at)}</span>
                        <span class="duration">${e}</span>
                        <div class="actions">
                          <button class="btn" @click=${()=>this.viewLog(t)}>View log</button>
                          ${this.retained(t)?g`
                                <button class="btn" ?disabled=${this.busyJob===t.id} @click=${()=>this.reflash(t)}>Flash again</button>
                                <button class="btn" ?disabled=${this.busyJob===t.id} @click=${()=>this.deleteRetained(t)}>Delete binary</button>
                              `:v}
                        </div>
                      </article>
                    `})}
              </div>
            `:g`<p class="empty">No flash history for this node yet.</p>`}
      </section>
    `}};Ni.styles=we`
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
  `;wn([Q({type:Array})],Ni.prototype,"jobs",2);wn([Q({type:String})],Ni.prototype,"mac",2);wn([y()],Ni.prototype,"busyJob",2);wn([y()],Ni.prototype,"error",2);Ni=wn([ke("esp-flash-history")],Ni);var $g=Object.defineProperty,Pg=Object.getOwnPropertyDescriptor,al=(t,e,i,s)=>{for(var n=s>1?void 0:s?Pg(e,i):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(n=(s?o(e,i,n):o(n))||n);return s&&n&&$g(e,i,n),n};let en=class extends he{constructor(){super(...arguments),this.jobs=[],this.mac=""}viewJobLog(t){const e=`/device/${encodeURIComponent(this.mac)}`;window.location.hash=`/job/${t.id}?from=${encodeURIComponent(e)}`}statusLabel(t){return t.status==="compile_success"?"compile success":t.status.replaceAll("_"," ")}statusStyle(t){return{compile_success:"background:#dcfce7;color:#15803d;",success:"background:#dcfce7;color:#15803d;",failed:"background:#fef2f2;color:#dc2626;"}[t]||"background:#f1f5f9;color:#475569;"}render(){const t=this.jobs.filter(e=>e.status==="compile_success"||e.status==="failed");return g`
      <section>
        <div class="title-row">
          <h2>Compile Log</h2>
        </div>
        ${t.length?g`
              <div class="table">
                ${t.map(e=>{const i=e.completed_at&&e.started_at?dt(e.completed_at-e.started_at):"";return g`
                      <article>
                        <span class="device-info">
                          <strong>${e.parsed_esphome_name||e.firmware_name||"compile"}</strong>
                          <span class="device-meta">v${e.parsed_version||"-"} / ${e.parsed_build_date||"-"}</span>
                          ${e.error_msg?g`<span class="error-msg" title=${e.error_msg}>!</span>`:v}
                        </span>
                        <span class="status-pill" style=${this.statusStyle(e.status)}>${this.statusLabel(e)}</span>
                        <span class="timestamp">${pr(e.created_at)}</span>
                        <span class="duration">${i}</span>
                        <div class="actions">
                          <button class="btn" @click=${()=>this.viewJobLog(e)}>View log</button>
                          <a class="btn" href=${C.downloadJobBinary(e.id)} target="_blank" rel="noopener">Download .bin</a>
                        </div>
                      </article>
                    `})}
              </div>
            `:g`<p class="empty">No compile history for this node yet.</p>`}
      </section>
    `}};en.styles=we`
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
  `;al([Q({type:Array})],en.prototype,"jobs",2);al([Q({type:String})],en.prototype,"mac",2);en=al([ke("esp-compile-history")],en);/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tg=t=>t.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Mg={CHILD:2},Eg=t=>(...e)=>({_$litDirective$:t,values:e});let Dg=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,i,s){this._$Ct=e,this._$AM=i,this._$Ci=s}_$AS(e,i){return this.update(e,i)}update(e,i){return this.render(...i)}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Hs=(t,e)=>{var s;const i=t._$AN;if(i===void 0)return!1;for(const n of i)(s=n._$AO)==null||s.call(n,e,!1),Hs(n,e);return!0},gr=t=>{let e,i;do{if((e=t._$AM)===void 0)break;i=e._$AN,i.delete(t),t=e}while((i==null?void 0:i.size)===0)},Ad=t=>{for(let e;e=t._$AM;t=e){let i=e._$AN;if(i===void 0)e._$AN=i=new Set;else if(i.has(t))break;i.add(t),Rg(e)}};function _g(t){this._$AN!==void 0?(gr(this),this._$AM=t,Ad(this)):this._$AM=t}function Bg(t,e=!1,i=0){const s=this._$AH,n=this._$AN;if(n!==void 0&&n.size!==0)if(e)if(Array.isArray(s))for(let r=i;r<s.length;r++)Hs(s[r],!1),gr(s[r]);else s!=null&&(Hs(s,!1),gr(s));else Hs(this,t)}const Rg=t=>{t.type==Mg.CHILD&&(t._$AP??(t._$AP=Bg),t._$AQ??(t._$AQ=_g))};class Lg extends Dg{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,i,s){super._$AT(e,i,s),Ad(this),this.isConnected=e._$AU}_$AO(e,i=!0){var s,n;e!==this.isConnected&&(this.isConnected=e,e?(s=this.reconnected)==null||s.call(this):(n=this.disconnected)==null||n.call(this)),i&&(Hs(this,e),gr(this))}setValue(e){if(Tg(this._$Ct))this._$Ct._$AI(e,this);else{const i=[...this._$Ct._$AH];i[this._$Ci]=e,this._$Ct._$AI(i,this,0)}}disconnected(){}reconnected(){}}const vo=new WeakMap,Ig=Eg(class extends Lg{render(t){return v}update(t,[e]){var s;const i=e!==this.G;return i&&this.G!==void 0&&this.rt(void 0),(i||this.lt!==this.ct)&&(this.G=e,this.ht=(s=t.options)==null?void 0:s.host,this.rt(this.ct=t.element)),v}rt(t){if(this.isConnected||(t=void 0),typeof this.G=="function"){const e=this.ht??globalThis;let i=vo.get(e);i===void 0&&(i=new WeakMap,vo.set(e,i)),i.get(this.G)!==void 0&&this.G.call(this.ht,void 0),i.set(this.G,t),t!==void 0&&this.G.call(this.ht,t)}else this.G.value=t}get lt(){var t,e;return typeof this.G=="function"?(t=vo.get(this.ht??globalThis))==null?void 0:t.get(this.G):(e=this.G)==null?void 0:e.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var Fg=Object.defineProperty,Ng=Object.getOwnPropertyDescriptor,Ss=(t,e,i,s)=>{for(var n=s>1?void 0:s?Ng(e,i):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(n=(s?o(e,i,n):o(n))||n);return s&&n&&Fg(e,i,n),n};const zg=100;let oi=class extends he{constructor(){super(...arguments),this.mac="",this.visible=!0,this.stopped=!1,this.logs=[],this.autoScroll=!0,this.eventSource=null,this._macObserved="",this.reconnectAttempts=0,this.reconnectDelay=1e3,this.pendingLogs=[],this.flushTimer=null,this.scrollTarget=null}connectedCallback(){super.connectedCallback(),this.visible&&this.connect()}disconnectedCallback(){this.disconnect(),super.disconnectedCallback()}updated(t){this.hidden=!this.visible,t.has("visible")&&(this.visible?this.connect():(this.flushLogs(),this.disconnect())),t.has("stopped")&&this.stopped&&(this.flushLogs(),this.disconnect()),t.has("mac")&&this.mac!==this._macObserved&&(this.logs=[],this.pendingLogs=[],this.reconnectAttempts=0,this.visible&&this.connect())}connect(){this.stopped||!this.visible||(this.disconnect(),this.mac&&(this._macObserved=this.mac,this.eventSource=C.streamCompileLogs(this.mac,t=>{if(this.pendingLogs.push(t),t==="[build exited with code 0]"||t==="[build exited with code 1]"||t==="[status: idle]"){this.flushLogs(),this.stopped=!0,this.disconnect();return}this.scheduleFlush()},t=>{this.handleStreamError(t)})))}handleStreamError(t){if(this.stopped||!this.visible)return;this.eventSource&&(this.eventSource.close(),this.eventSource=null),this.reconnectAttempts++;const e=this.reconnectDelay*Math.pow(2,Math.min(this.reconnectAttempts-1,10));setTimeout(()=>this.connect(),e)}disconnect(){this.eventSource&&(this.eventSource.close(),this.eventSource=null),this.reconnectAttempts=0}scrollToBottom(){this.scrollTarget&&(this.scrollTarget.scrollTop=this.scrollTarget.scrollHeight)}toggleAutoScroll(){this.autoScroll=!this.autoScroll}clearLogs(){this.logs=[],this.pendingLogs=[]}scheduleFlush(){this.flushTimer||(this.flushTimer=setTimeout(()=>this.flushLogs(),zg))}flushLogs(){if(this.flushTimer&&(clearTimeout(this.flushTimer),this.flushTimer=null),this.pendingLogs.length===0)return;const t=[...this.logs,...this.pendingLogs].slice(-800);this.pendingLogs=[],this.logs=t,this.autoScroll&&this.visible&&this.updateComplete.then(()=>this.scrollToBottom())}render(){return g`
      <div class="log-header">
        <span class="label">Build Log</span>
        <div class="controls">
          <button class="ctrl-btn" @click=${this.clearLogs}>Clear</button>
          <button class="ctrl-btn ${this.autoScroll?"active":""}" @click=${this.toggleAutoScroll}>
            ${this.autoScroll?"Auto-scroll ↓":"Scroll lock"}
          </button>
        </div>
      </div>
      <div class="log-body" ${Ig(t=>{this.scrollTarget=t})}>
        ${this.logs.length===0?g`<span class="empty">Waiting for build output...</span>`:g`<pre>${this.logs.join(`
`)}</pre>`}
      </div>
    `}};oi.styles=we`
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
  `;Ss([Q({type:String})],oi.prototype,"mac",2);Ss([Q({type:Boolean})],oi.prototype,"visible",2);Ss([Q({type:Boolean})],oi.prototype,"stopped",2);Ss([y()],oi.prototype,"logs",2);Ss([y()],oi.prototype,"autoScroll",2);oi=Ss([ke("esp-compile-log-viewer")],oi);var Hg=Object.defineProperty,Wg=Object.getOwnPropertyDescriptor,gt=(t,e,i,s)=>{for(var n=s>1?void 0:s?Wg(e,i):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(n=(s?o(e,i,n):o(n))||n);return s&&n&&Hg(e,i,n),n};const Ug=["queued","starting","transferring","verifying","transfer_success_waiting_rejoin"],yo=["compile_queued","compiling"];let Ge=class extends he{constructor(){super(...arguments),this.mac="",this.node=null,this.topology=[],this.currentJob=null,this.history=[],this.compileHistoryList=[],this.compileStatus="idle",this.loading=!0,this.error="",this.compileTimer=null}connectedCallback(){super.connectedCallback(),this.load(),this.schedulePoll()}disconnectedCallback(){this.timer&&window.clearInterval(this.timer),this.compileTimer&&window.clearInterval(this.compileTimer),super.disconnectedCallback()}schedulePoll(){this.timer&&window.clearInterval(this.timer);const e=this.currentJob&&Ug.includes(this.currentJob.status)?2e3:5e3;this.timer=window.setInterval(()=>void this.load(!1),e)}pollCompileStatus(){C.getCompileStatus(this.mac).then(t=>{this.compileStatus=t.status,yo.includes(t.status)?this.compileTimer||(this.compileTimer=setInterval(()=>this.pollCompileStatus(),3e3)):this.compileTimer&&(clearInterval(this.compileTimer),this.compileTimer=null)}).catch(()=>{})}handleReflashResult(t){this.otaBox.preflight=t.detail.preflight,this.load(!1)}updated(){this.schedulePoll()}async load(t=!0){t&&(this.loading=!0);try{const[e,i,s,n,r]=await Promise.all([C.topology(),C.currentOtaForDevice(this.mac),C.getQueue(),C.history(this.mac),C.getCompileHistory(this.mac)]);this.topology=e,this.node=e.find(c=>le(c.mac)===le(this.mac))||null;const o=le(this.mac),a=(s.queued_jobs??[]).find(c=>le(c.mac)===o)??null;i&&i.job&&le(i.job.mac)===o?this.currentJob=i.job:a?this.currentJob=a:this.currentJob=null,this.history=n.jobs,this.compileHistoryList=r.jobs,this.error="";const l=await C.getCompileStatus(this.mac).catch(()=>null);l&&(this.compileStatus=l.status),yo.includes(this.compileStatus)&&this.pollCompileStatus()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.loading=!1}}goBack(){window.location.hash="/"}render(){if(this.loading)return g`<div class="card">Loading device...</div>`;if(this.error)return g`<div class="card error">${this.error}</div>`;if(!this.node)return g`
        <div class="card">
          <button class="back" @click=${this.goBack}>Back</button>
          <p>Device ${this.mac} is not present in the current bridge topology.</p>
        </div>
      `;const t=!this.node.is_bridge&&(this.node.hops??0)>0,e=this.topology.filter(i=>!i.online||le(i.mac)===le(this.node.mac)?!1:!!i.is_bridge||!!i.can_relay||(i.hops??0)>0);return g`
      <button class="back" @click=${this.goBack}>Back to topology</button>
      <section class="hero">
        <div class="hero-left">
          <h2>${this.node.friendly_name||this.node.esphome_name||this.node.label||this.node.mac}<span class="mac-suffix"> ${this.node.mac}</span></h2>
          <div class="hero-stats">
            <div class="hero-box sm ${this.node.online?"box-online":"box-offline"}" title="${this.node.firmware_md5?`firmware MD5: ${this.node.firmware_md5}`:"firmware MD5: —"}"><span class="lbl">Status</span><span class="val">${this.node.online?"Online":this.node.offline_reason||"Offline"}</span></div>
            <div class="hero-box sm"><span class="lbl">Hops</span><span class="val">${this.node.hops??0}</span></div>
            <div class="hero-box sm"><span class="lbl">Uptime</span><span class="val">${dt(this.node.uptime_s)}</span></div>
            <div class="hero-box sm"><span class="lbl">Last Seen</span><span class="val">${this.node.last_seen_ago!=null?`${dt(this.node.last_seen_ago)}${this.node.is_bridge?"":" ago"}`:"-"}</span></div>
            ${this.node.chip_name?g`<div class="hero-box sm"><span class="lbl">Chip</span><span class="val">${this.node.chip_name}</span></div>`:v}
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
        ${yo.includes(this.compileStatus)||this.compileStatus==="failed"?g`<section class="panel history">
              <esp-compile-log-viewer .mac=${this.mac} .visible=${!0}></esp-compile-log-viewer>
            </section>`:v}
      </div>
    `}};Ge.styles=we`
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
  `;gt([Q({type:String})],Ge.prototype,"mac",2);gt([y()],Ge.prototype,"node",2);gt([y()],Ge.prototype,"topology",2);gt([y()],Ge.prototype,"currentJob",2);gt([y()],Ge.prototype,"history",2);gt([y()],Ge.prototype,"compileHistoryList",2);gt([y()],Ge.prototype,"compileStatus",2);gt([y()],Ge.prototype,"loading",2);gt([y()],Ge.prototype,"error",2);gt([Od("esp-ota-box")],Ge.prototype,"otaBox",2);Ge=gt([ke("esp-device-detail")],Ge);var qg=Object.defineProperty,Vg=Object.getOwnPropertyDescriptor,re=(t,e,i,s)=>{for(var n=s>1?void 0:s?Vg(e,i):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(n=(s?o(e,i,n):o(n))||n);return s&&n&&qg(e,i,n),n};let te=class extends he{constructor(){super(...arguments),this.autoInit=!1,this.config=null,this.configuredBridges=[],this.discoveredBridges=[],this.loading=!0,this.discovering=!1,this.saving=!1,this.error="",this.saved="",this.containerStatus=null,this.cleaningArtifacts=!1,this.artifactsMessage="",this.editingBridgeId=null,this.editApiKey="",this.newBridgeApiKey="",this.showManualEntry=!1,this.manualHost="",this.manualPort=80,this.manualApiKey="",this.showScanLog=!1,this.scanLogContent="",this.scanLogLoading=!1,this.restarting=!1,this.restartFeedback="",this.integrationPollTimer=null}connectedCallback(){super.connectedCallback(),this.load(),this.loadContainerStatus(),this.integrationPollTimer=setInterval(()=>void this.pollIntegrationStatus(),5e3),this.autoInit&&this.discover()}disconnectedCallback(){super.disconnectedCallback(),this.integrationPollTimer&&(clearInterval(this.integrationPollTimer),this.integrationPollTimer=null)}async pollIntegrationStatus(){try{this.config=await C.config()}catch{}}async restartHa(){this.restarting=!0,this.restartFeedback="";try{const t=await C.requestRestart();t.success?this.restartFeedback="Restart requested":this.restartFeedback=t.error||"Restart failed"}catch{this.restartFeedback="Restart failed"}finally{this.restarting=!1,setTimeout(()=>{this.restartFeedback=""},4e3)}}renderIntegrationStatus(){var a;const t=(a=this.config)==null?void 0:a.integration;if(!t)return g`<p class="int-status-note muted">Loading integration status...</p>`;const{installed:e,loaded:i,configured:s,connected:n,bridge_count:r,remote_count:o}=t;return e?i?!s&&!i?g`
        <div class="int-status-row">
          <span class="status-dot yellow"></span>
          <span>Integration not yet configured</span>
        </div>
        <div class="int-configure-hint">
          <strong>Add ESP-Tree integration</strong>
          <p>Go to <strong>Settings → Devices &amp; Services → Add Integration</strong> → search for <em>ESP-Tree</em></p>
        </div>
      `:n?g`
      <div class="int-connected-box">
        <div class="int-connected-header">
          <span class="status-dot green pulse"></span>
          <span class="int-connected-label">Connected v${t.version||"?"}</span>
        </div>
        <div class="int-connected-counts">
          ${r>0?g`<span>${r} ${r===1?"bridge":"bridges"}</span>`:v}
          ${o>0?g`<span>${o} ${o===1?"remote":"remotes"}</span>`:v}
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
        ${this.restartFeedback?g`<p class="saved">${this.restartFeedback}</p>`:v}
      `:g`
        <div class="int-status-row">
          <span class="status-dot red"></span>
          <span>Integration files not found — Restart Home Assistant to complete installation</span>
        </div>
      `}async load(){this.loading=!0,this.error="";try{this.config=await C.config(),this.configuredBridges=await C.getBridges()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.loading=!1}}async loadContainerStatus(){try{this.containerStatus=await C.getContainerStatus()}catch{this.containerStatus=null}}isBridgeConnected(t){var i;if(!((i=this.config)!=null&&i.active_bridge)||this.config.active_bridge.error)return!1;const e=this.config.active_bridge;return e.uuid===t.uuid||e.host===t.host&&e.port===t.port}isBridgeActive(t){return!!t.is_active}async discover(){this.discovering=!0,this.error="",this.newBridgeApiKey="";try{const t=await C.discoverBridges();this.discoveredBridges=t.bridges,this.discoveredBridges.length===0&&(this.error="No bridges found. Make sure your bridge is powered on and connected to the same network, then try again. You can also use Manual IP to connect directly.")}catch(t){const e=t instanceof Error?t.message:String(t);e==="timeout"?this.error="Scan timed out. Try again or use View Scan Log to see scanned IPs, or use Manual IP to connect directly.":e==="cancelled"?this.error="":this.error=e}finally{this.discovering=!1}}async triggerScan(){this.discovering=!0,this.error="",this.newBridgeApiKey="";try{const t=await C.triggerScan();!t.success&&t.error&&(this.error=t.error),await this.discover()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.discovering=!1}}async viewScanLog(){if(this.showScanLog){this.showScanLog=!1;return}this.scanLogLoading=!0,this.showScanLog=!0;try{this.scanLogContent=await C.getScanLog()||"(empty)"}catch(t){this.scanLogContent=t instanceof Error?t.message:String(t)}finally{this.scanLogLoading=!1}}async selectBridge(t){if(!this.newBridgeApiKey.trim()){this.error="API key is required";return}this.saving=!0,this.error="",this.saved="";try{await C.selectBridge(t.host,t.port,t.name,t.version,this.newBridgeApiKey,t.network_id,t.hostname),this.saved=`Connected to ${t.name||t.host}`,this.discoveredBridges=[],this.newBridgeApiKey="",await this.load()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.saving=!1}}async addManualBridge(){if(!this.manualHost.trim()){this.error="Host is required";return}if(!this.manualPort||this.manualPort<1||this.manualPort>65535){this.error="Valid port is required";return}this.saving=!0,this.error="",this.saved="";try{await C.addBridge(this.manualHost.trim(),this.manualPort,void 0,this.manualApiKey||"",""),this.saved=`Connected to ${this.manualHost}:${this.manualPort}`,this.showManualEntry=!1,this.manualHost="",this.manualPort=80,this.manualApiKey="",await this.load()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.saving=!1}}async deleteBridge(t){this.saving=!0,this.error="";try{await C.deleteBridge(t.uuid),this.saved="Bridge removed",await this.load()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.saving=!1}}async updateBridgeApiKey(t){if(!this.editApiKey.trim()){this.error="API key is required";return}this.saving=!0,this.error="";try{await C.updateBridge(t.uuid,void 0,void 0,void 0,this.editApiKey),this.saved=`API key updated for ${t.name||t.host}`,this.editingBridgeId=null,this.editApiKey="",await this.load()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.saving=!1}}startEditingBridge(t){this.editingBridgeId=t.uuid,this.editApiKey=t.api_key||""}cancelEditing(){this.editingBridgeId=null,this.editApiKey=""}async cleanArtifacts(){this.cleaningArtifacts=!0,this.artifactsMessage="";try{const e=((await C.cleanArtifacts()).total_bytes/(1024*1024)).toFixed(1);this.artifactsMessage=`Cleared ${e} MB of build cache. Next compile will be slower.`,this.loadContainerStatus()}catch(t){this.artifactsMessage=`Error: ${t instanceof Error?t.message:String(t)}`}finally{this.cleaningArtifacts=!1}}async activateBridge(t){this.saving=!0,this.error="",this.saved="";try{await C.activateBridge(t.uuid),this.saved=`Activated ${t.name||t.host}`,await this.load()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.saving=!1}}async deactivateBridge(t){this.saving=!0,this.error="",this.saved="";try{await C.deactivateBridge(t.uuid),this.saved=`Deactivated ${t.name||t.host}`,await this.load()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.saving=!1}}render(){var t,e,i,s;return this.loading?g`<section class="card">Loading settings...</section>`:g`
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
        `:v}

        ${this.showManualEntry?g`
          <div class="manual-entry">
            <div class="manual-form">
              <label>
                Host / IP
                <input type="text" placeholder="192.168.1.50 or hostname.local" .value=${this.manualHost} @input=${n=>this.manualHost=n.target.value} />
              </label>
              <label>
                Port
                <input type="number" min="1" max="65535" .value=${String(this.manualPort)} @input=${n=>this.manualPort=Number(n.target.value||80)} />
              </label>
              <label>
                API Key
                <input type="password" placeholder="API Key" .value=${this.manualApiKey} @input=${n=>this.manualApiKey=n.target.value} />
              </label>
            </div>
            <button class="btn btn-primary" ?disabled=${this.saving} @click=${this.addManualBridge}>Connect</button>
          </div>
        `:v}

        ${this.discovering?g`<p class="info">Scanning your network for bridges (8s)...</p>`:v}

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
                ${this.discoveredBridges.map(n=>g`
                  <tr>
                    <td><strong>${n.name||n.host}</strong></td>
                    <td>${n.hostname||"-"}</td>
                    <td>${n.host}</td>
                    <td>${n.port}</td>
                    <td>${n.network_id||"-"}</td>
                    <td>
                      <input
                        type="password"
                        placeholder="API Key"
                        .value=${this.newBridgeApiKey}
                        @input=${r=>this.newBridgeApiKey=r.target.value}
                      />
                    </td>
                    <td>
                      <button class="btn btn-primary" ?disabled=${this.saving} @click=${()=>this.selectBridge(n)}>
                        Select
                      </button>
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        `:v}

        ${this.configuredBridges.length>0?g`
          <div class="bridge-list-container">
            <h3>Configured Bridges</h3>
            <table class="bridge-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Hostname</th>
                  <th>IP</th>
                  <th>Port</th>
                  <th>Network ID</th>
                  <th>Discovery</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.configuredBridges.map(n=>g`
                  <tr class="${this.isBridgeActive(n)?"active-row":""}">
                    <td>
                      <span class="bridge-status ${this.isBridgeConnected(n)?"connected":"disconnected"}">
                        ${this.isBridgeConnected(n)?"connected":"disconnected"}
                      </span>
                      ${this.isBridgeActive(n)?g`<span class="active-badge">Active</span>`:v}
                    </td>
                    <td>${n.hostname||"-"}</td>
                    <td>${n.host}</td>
                    <td>${n.port}</td>
                    <td>${n.network_id||"-"}</td>
                    <td>${n.discovered_via}</td>
                    <td class="actions-cell">
                      ${this.editingBridgeId===n.uuid?g`
                        <input
                          type="password"
                          placeholder="API Key"
                          .value=${this.editApiKey}
                          @input=${r=>this.editApiKey=r.target.value}
                        />
                        <button class="btn btn-primary" ?disabled=${this.saving} @click=${()=>this.updateBridgeApiKey(n)}>Save</button>
                        <button class="btn" ?disabled=${this.saving} @click=${this.cancelEditing}>Cancel</button>
                      `:g`
                        ${this.isBridgeActive(n)?g`<button class="btn" ?disabled=${this.saving} @click=${()=>this.deactivateBridge(n)}>Deactivate</button>`:g`<button class="btn btn-primary" ?disabled=${this.saving} @click=${()=>this.activateBridge(n)}>Activate</button>`}
                        <button class="btn" ?disabled=${this.saving} @click=${()=>this.startEditingBridge(n)}>Edit API Key</button>
                        <button class="btn btn-danger" ?disabled=${this.saving} @click=${()=>this.deleteBridge(n)}>Delete</button>
                      `}
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        `:v}

        ${this.error?g`<p class="error">${this.error}</p>`:v}
        ${this.saved?g`<p class="saved">${this.saved}</p>`:v}
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
          ${(s=this.containerStatus)!=null&&s.error?g`<div><span>Error</span><strong>${this.containerStatus.error}</strong></div>`:v}
        </div>

        <div class="actions">
          <button class="btn btn-danger" ?disabled=${this.cleaningArtifacts} @click=${this.cleanArtifacts}>Clean build artifacts</button>
        </div>

        ${this.artifactsMessage?g`<p class="info">${this.artifactsMessage}</p>`:v}

        <p class="hint">Clean build artifacts removes PlatformIO cache and ESPHome build output. Useful for freeing space or resolving stale build state.</p>
      </section>
    `}};te.styles=we`
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
  `;re([Q({type:Boolean})],te.prototype,"autoInit",2);re([y()],te.prototype,"config",2);re([y()],te.prototype,"configuredBridges",2);re([y()],te.prototype,"discoveredBridges",2);re([y()],te.prototype,"loading",2);re([y()],te.prototype,"discovering",2);re([y()],te.prototype,"saving",2);re([y()],te.prototype,"error",2);re([y()],te.prototype,"saved",2);re([y()],te.prototype,"containerStatus",2);re([y()],te.prototype,"cleaningArtifacts",2);re([y()],te.prototype,"artifactsMessage",2);re([y()],te.prototype,"editingBridgeId",2);re([y()],te.prototype,"editApiKey",2);re([y()],te.prototype,"newBridgeApiKey",2);re([y()],te.prototype,"showManualEntry",2);re([y()],te.prototype,"manualHost",2);re([y()],te.prototype,"manualPort",2);re([y()],te.prototype,"manualApiKey",2);re([y()],te.prototype,"showScanLog",2);re([y()],te.prototype,"scanLogContent",2);re([y()],te.prototype,"scanLogLoading",2);re([y()],te.prototype,"restarting",2);re([y()],te.prototype,"restartFeedback",2);te=re([ke("esp-settings")],te);var Qg=Object.defineProperty,jg=Object.getOwnPropertyDescriptor,Bt=(t,e,i,s)=>{for(var n=s>1?void 0:s?jg(e,i):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(n=(s?o(e,i,n):o(n))||n);return s&&n&&Qg(e,i,n),n};const Kg=300,fc=new Set(["success","failed","aborted","rejoin_timeout","version_mismatch"]);let rt=class extends he{constructor(){super(...arguments),this.queueData=null,this.compileData=null,this.historyJobs=[],this.error="",this.busyJob=null,this.busyAction="",this.showAbortModal=!1,this.historyFilter="all",this.historyLimit=10,this.pollTimer=null,this.historyTimer=null}connectedCallback(){super.connectedCallback(),this.fetchQueue(),this.pollTimer=setInterval(()=>this.fetchQueue(),2e3),this.fetchHistory(),this.historyTimer=setInterval(()=>this.fetchHistory(),5e3)}disconnectedCallback(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null),this.historyTimer&&(clearInterval(this.historyTimer),this.historyTimer=null),super.disconnectedCallback()}async fetchQueue(){try{const[t,e]=await Promise.all([C.getQueue(),C.getCompileQueue()]);this.queueData=t,this.compileData=e}catch{}}async fetchHistory(){try{const t=await C.getAllHistory(100);this.historyJobs=t.jobs}catch{}}async pauseQueue(){this.busyAction="pause",this.error="";try{await C.pauseQueue(),await this.fetchQueue()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busyAction=""}}async resumeQueue(){this.busyAction="resume",this.error="";try{await C.resumeQueue(),await this.fetchQueue()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busyAction=""}}async abortQueuedJob(t){this.busyJob=t,this.error="";try{await C.abortQueuedJob(t),await this.fetchQueue()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.busyJob=null}}async abortCompileJob(t){this.busyJob=t,this.error="";try{await C.abortCompileJob(t),await this.fetchQueue()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.busyJob=null}}async moveUp(t){this.busyJob=t,this.error="";try{await C.reorderJobUp(t),await this.fetchQueue()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.busyJob=null}}async moveDown(t){this.busyJob=t,this.error="";try{await C.reorderJobDown(t),await this.fetchQueue()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.busyJob=null}}async abortActiveJob(){this.busyAction="abort-active",this.error="";try{if((await C.getQueue()).count>0){this.showAbortModal=!0;return}await C.abortOta(),await this.fetchQueue()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busyAction=""}}async abortActiveAndContinue(){this.showAbortModal=!1;try{await C.abortOta(),await this.fetchQueue()}catch(t){this.error=t instanceof Error?t.message:String(t)}}async abortActiveAndPause(){this.showAbortModal=!1;try{await C.abortOta(),await C.pauseQueue(),await this.fetchQueue()}catch(t){this.error=t instanceof Error?t.message:String(t)}}navigateToDevice(t){window.location.hash=`/device/${encodeURIComponent(t)}`}navigateToJob(t){window.location.hash=`/job/${t.id}?from=${encodeURIComponent("/queue")}`}labelFor(t){return t.device_label||t.parsed_esphome_name||t.esphome_name||t.mac}buildDisplayEntries(){const e=[...this.historyJobs.filter(s=>this.historyFilter==="all"?!0:(s.job_type||this.inferJobType(s))===this.historyFilter)].sort((s,n)=>(s.created_at??0)-(n.created_at??0)),i=[];for(let s=0;s<e.length;s++){const n=e[s],r=e[s+1],o=n.job_type||this.inferJobType(n);if(r&&o==="compile"&&(r.job_type||this.inferJobType(r))==="flash"&&n.mac===r.mac&&r.created_at-n.created_at<=Kg){const a=r.status==="success"&&n.status==="compile_success"?"success":"failed";i.push({type:"combined",compileJob:n,flashJob:r,label:this.labelFor(n),status:a,statusLabel:a==="success"?"Success":"Failed",created_at:r.created_at}),s++}else i.push({type:o,job:n,label:this.labelFor(n),status:n.status,statusLabel:n.status==="success"&&o==="flash"?"OTA Upload Success":n.status.replaceAll("_"," "),created_at:n.created_at})}return i.sort((s,n)=>n.created_at-s.created_at),i}inferJobType(t){return t.status==="compile_success"||t.status==="compile_queued"||t.status==="compiling"?"compile":(fc.has(t.status),"flash")}get statusStyles(){return{success:"background:#dcfce7;color:#15803d;",failed:"background:#fef2f2;color:#dc2626;",aborted:"background:#fef3c7;color:#b45309;",rejoin_timeout:"background:#fef3c7;color:#b45309;",version_mismatch:"background:#fef3c7;color:#b45309;",compile_success:"background:#dcfce7;color:#15803d;"}}render(){var d,f,u;const t=this.queueData,e=!!(t!=null&&t.active_job)&&!fc.has(t.active_job.status),i=(t==null?void 0:t.queued_jobs)??[],s=(t==null?void 0:t.paused)??!1,n=i.length+(e?1:0),r=((d=this.compileData)==null?void 0:d.active_job)??null,o=((f=this.compileData)==null?void 0:f.queued_jobs)??[],a=((u=this.compileData)==null?void 0:u.count)??0,l=this.buildDisplayEntries(),c=l.slice(0,this.historyLimit),h=l.length;return g`
      <div class="queue-page">
        <div class="queue-toolbar">
          <div class="toolbar-actions">
            ${s?g`<button class="btn btn-resume" ?disabled=${this.busyAction==="resume"} @click=${this.resumeQueue}>▶ Resume</button>`:g`<button class="btn btn-pause" ?disabled=${this.busyAction==="pause"} @click=${this.pauseQueue}>⏸ Pause</button>`}
            ${s?g`<span class="pause-badge">PAUSED</span>`:v}
          </div>
        </div>

        ${this.error?g`<p class="error">${this.error}</p>`:v}

        <!-- Compile Queue -->
        <div class="section-card">
          <div class="title-row">
            <h2>Compile Queue</h2>
          </div>
          <div class="section-content">
            ${a===0?g`<p class="empty">No compiles in progress or queued.</p>`:v}

            ${r?this.renderCompileRow(r,!0):v}
            ${o.map(p=>this.renderCompileRow(p,!1))}
          </div>
        </div>

        <!-- OTA Upload Queue -->
        <div class="section-card">
          <div class="title-row">
            <h2>OTA Upload Queue ${n>0?g`<span class="subtitle">${n} job${n!==1?"s":""}</span>`:""}</h2>
          </div>
          <div class="section-content">
            ${n===0&&!e?g`<p class="empty">No firmware flashes in progress or queued.</p>`:v}

            ${e||i.length>0?g`
                  <div class="table">
                    ${e&&t.active_job?this.renderOtaRow(t.active_job,1,i.length+1,!0):v}
                    ${i.map((p,m)=>this.renderOtaRow(p,m+(e?2:1),i.length+(e?1:0),!1))}
                  </div>
                `:v}
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
                  ${h>this.historyLimit?g`<div class="show-more"><button @click=${()=>{this.historyLimit+=10}}>Show more (${h-this.historyLimit} older entries)</button></div>`:v}
                `}
          </div>
        </div>

        ${this.showAbortModal?this.renderAbortModal():v}
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
    `}renderOtaRow(t,e,i,s){const n=this.busyJob===t.id,r=this.labelFor(t);if(s){const o=(t.bridge_state||t.status).replaceAll("_"," "),a=t.percent??0;return g`
        <article class="active-row">
          <div class="device-info clickable" @click=${()=>this.navigateToDevice(t.mac)}>
            <strong>① ${r}</strong>
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
          <strong><span class="position-num">${e}.</span> ${r}</strong>
          <small>${t.firmware_name||"firmware.ota.bin"}${t.firmware_size?g` · ${_i(t.firmware_size)}`:v}</small>
        </div>
        <div class="progress-cell">
          <div class="progress-wrap queued"><div class="progress-fill queued" style="width: 0%"></div></div>
          <span class="status-pill queued">Queued</span>
        </div>
        <div class="actions">
          <button class="btn" @click=${()=>this.navigateToJob(t)}>View log</button>
          <button class="btn btn-abort" ?disabled=${n} @click=${()=>this.abortQueuedJob(t.id)}>Abort</button>
          <button class="btn btn-icon" ?disabled=${n||e<=2} @click=${()=>this.moveUp(t.id)}>▲</button>
          <button class="btn btn-icon" ?disabled=${n||e>=i} @click=${()=>this.moveDown(t.id)}>▼</button>
        </div>
      </article>
    `}renderHistoryRow(t){const e=t.job,i=this.statusStyles[t.status]||"",s=e.completed_at&&e.started_at?dt(e.completed_at-e.started_at):"";return g`
      <div class="history-row">
        <span class="type-badge type-${t.type}">${t.type.toUpperCase()}</span>
        <span class="device-label clickable" @click=${()=>this.navigateToDevice(e.mac)}>${t.label}</span>
        <span class="device-meta">${e.parsed_version?`v${e.parsed_version}`:e.firmware_name||""}</span>
        <span class="status-pill history-status" style=${i}>${t.statusLabel}</span>
        <span class="timestamp" title=${us(e.created_at)}>${pr(e.created_at)}</span>
        <span class="duration">${s}</span>
        <button class="btn btn-sm" @click=${()=>this.navigateToJob(e)}>View log</button>
      </div>
    `}renderCombinedRow(t){const e=t.compileJob,i=t.flashJob,s=e.completed_at&&e.started_at?dt(e.completed_at-e.started_at):"",n=i.completed_at&&i.started_at?dt(i.completed_at-i.started_at):"",r=this.statusStyles[t.status]||"";return g`
      <div class="history-row combined-row" style="border-left: 3px solid ${t.status==="success"?"#15803d":"#dc2626"}">
        <span class="type-badge type-combined">
          <span class="c-compile">COMPILE</span><span class="c-flash">FLASH</span>
        </span>
        <span class="device-label clickable" @click=${()=>this.navigateToDevice(e.mac)}>${t.label}</span>
        <span class="device-meta">${e.parsed_version?`v${e.parsed_version}`:""} → OTA upload · ${s} + ${n}</span>
        <span class="status-pill history-status" style=${r}>${t.statusLabel}</span>
        <span class="timestamp" title=${us(i.created_at)}>${pr(i.created_at)}</span>
        <span class="duration">${n}</span>
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
    `}};rt.styles=we`
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
  `;Bt([y()],rt.prototype,"queueData",2);Bt([y()],rt.prototype,"compileData",2);Bt([y()],rt.prototype,"historyJobs",2);Bt([y()],rt.prototype,"error",2);Bt([y()],rt.prototype,"busyJob",2);Bt([y()],rt.prototype,"busyAction",2);Bt([y()],rt.prototype,"showAbortModal",2);Bt([y()],rt.prototype,"historyFilter",2);Bt([y()],rt.prototype,"historyLimit",2);rt=Bt([ke("esp-queue-page")],rt);let ia=[],$d=[];(()=>{let t="lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o".split(",").map(e=>e?parseInt(e,36):1);for(let e=0,i=0;e<t.length;e++)(e%2?$d:ia).push(i=i+t[e])})();function Xg(t){if(t<768)return!1;for(let e=0,i=ia.length;;){let s=e+i>>1;if(t<ia[s])i=s;else if(t>=$d[s])e=s+1;else return!0;if(e==i)return!1}}function uc(t){return t>=127462&&t<=127487}const pc=8205;function Jg(t,e,i=!0,s=!0){return(i?Pd:Yg)(t,e,s)}function Pd(t,e,i){if(e==t.length)return e;e&&Td(t.charCodeAt(e))&&Md(t.charCodeAt(e-1))&&e--;let s=xo(t,e);for(e+=gc(s);e<t.length;){let n=xo(t,e);if(s==pc||n==pc||i&&Xg(n))e+=gc(n),s=n;else if(uc(n)){let r=0,o=e-2;for(;o>=0&&uc(xo(t,o));)r++,o-=2;if(r%2==0)break;e+=2}else break}return e}function Yg(t,e,i){for(;e>0;){let s=Pd(t,e-2,i);if(s<e)return s;e--}return 0}function xo(t,e){let i=t.charCodeAt(e);if(!Md(i)||e+1==t.length)return i;let s=t.charCodeAt(e+1);return Td(s)?(i-55296<<10)+(s-56320)+65536:i}function Td(t){return t>=56320&&t<57344}function Md(t){return t>=55296&&t<56320}function gc(t){return t<65536?1:2}class K{lineAt(e){if(e<0||e>this.length)throw new RangeError(`Invalid position ${e} in document of length ${this.length}`);return this.lineInner(e,!1,1,0)}line(e){if(e<1||e>this.lines)throw new RangeError(`Invalid line number ${e} in ${this.lines}-line document`);return this.lineInner(e,!0,1,0)}replace(e,i,s){[e,i]=ps(this,e,i);let n=[];return this.decompose(0,e,n,2),s.length&&s.decompose(0,s.length,n,3),this.decompose(i,this.length,n,1),Ct.from(n,this.length-(i-e)+s.length)}append(e){return this.replace(this.length,this.length,e)}slice(e,i=this.length){[e,i]=ps(this,e,i);let s=[];return this.decompose(e,i,s,0),Ct.from(s,i-e)}eq(e){if(e==this)return!0;if(e.length!=this.length||e.lines!=this.lines)return!1;let i=this.scanIdentical(e,1),s=this.length-this.scanIdentical(e,-1),n=new Ws(this),r=new Ws(e);for(let o=i,a=i;;){if(n.next(o),r.next(o),o=0,n.lineBreak!=r.lineBreak||n.done!=r.done||n.value!=r.value)return!1;if(a+=n.value.length,n.done||a>=s)return!0}}iter(e=1){return new Ws(this,e)}iterRange(e,i=this.length){return new Ed(this,e,i)}iterLines(e,i){let s;if(e==null)s=this.iter();else{i==null&&(i=this.lines+1);let n=this.line(e).from;s=this.iterRange(n,Math.max(n,i==this.lines+1?this.length:i<=1?0:this.line(i-1).to))}return new Dd(s)}toString(){return this.sliceString(0)}toJSON(){let e=[];return this.flatten(e),e}constructor(){}static of(e){if(e.length==0)throw new RangeError("A document must have at least one line");return e.length==1&&!e[0]?K.empty:e.length<=32?new fe(e):Ct.from(fe.split(e,[]))}}class fe extends K{constructor(e,i=Gg(e)){super(),this.text=e,this.length=i}get lines(){return this.text.length}get children(){return null}lineInner(e,i,s,n){for(let r=0;;r++){let o=this.text[r],a=n+o.length;if((i?s:a)>=e)return new Zg(n,a,s,o);n=a+1,s++}}decompose(e,i,s,n){let r=e<=0&&i>=this.length?this:new fe(mc(this.text,e,i),Math.min(i,this.length)-Math.max(0,e));if(n&1){let o=s.pop(),a=ir(r.text,o.text.slice(),0,r.length);if(a.length<=32)s.push(new fe(a,o.length+r.length));else{let l=a.length>>1;s.push(new fe(a.slice(0,l)),new fe(a.slice(l)))}}else s.push(r)}replace(e,i,s){if(!(s instanceof fe))return super.replace(e,i,s);[e,i]=ps(this,e,i);let n=ir(this.text,ir(s.text,mc(this.text,0,e)),i),r=this.length+s.length-(i-e);return n.length<=32?new fe(n,r):Ct.from(fe.split(n,[]),r)}sliceString(e,i=this.length,s=`
`){[e,i]=ps(this,e,i);let n="";for(let r=0,o=0;r<=i&&o<this.text.length;o++){let a=this.text[o],l=r+a.length;r>e&&o&&(n+=s),e<l&&i>r&&(n+=a.slice(Math.max(0,e-r),i-r)),r=l+1}return n}flatten(e){for(let i of this.text)e.push(i)}scanIdentical(){return 0}static split(e,i){let s=[],n=-1;for(let r of e)s.push(r),n+=r.length+1,s.length==32&&(i.push(new fe(s,n)),s=[],n=-1);return n>-1&&i.push(new fe(s,n)),i}}class Ct extends K{constructor(e,i){super(),this.children=e,this.length=i,this.lines=0;for(let s of e)this.lines+=s.lines}lineInner(e,i,s,n){for(let r=0;;r++){let o=this.children[r],a=n+o.length,l=s+o.lines-1;if((i?l:a)>=e)return o.lineInner(e,i,s,n);n=a+1,s=l+1}}decompose(e,i,s,n){for(let r=0,o=0;o<=i&&r<this.children.length;r++){let a=this.children[r],l=o+a.length;if(e<=l&&i>=o){let c=n&((o<=e?1:0)|(l>=i?2:0));o>=e&&l<=i&&!c?s.push(a):a.decompose(e-o,i-o,s,c)}o=l+1}}replace(e,i,s){if([e,i]=ps(this,e,i),s.lines<this.lines)for(let n=0,r=0;n<this.children.length;n++){let o=this.children[n],a=r+o.length;if(e>=r&&i<=a){let l=o.replace(e-r,i-r,s),c=this.lines-o.lines+l.lines;if(l.lines<c>>4&&l.lines>c>>6){let h=this.children.slice();return h[n]=l,new Ct(h,this.length-(i-e)+s.length)}return super.replace(r,a,l)}r=a+1}return super.replace(e,i,s)}sliceString(e,i=this.length,s=`
`){[e,i]=ps(this,e,i);let n="";for(let r=0,o=0;r<this.children.length&&o<=i;r++){let a=this.children[r],l=o+a.length;o>e&&r&&(n+=s),e<l&&i>o&&(n+=a.sliceString(e-o,i-o,s)),o=l+1}return n}flatten(e){for(let i of this.children)i.flatten(e)}scanIdentical(e,i){if(!(e instanceof Ct))return 0;let s=0,[n,r,o,a]=i>0?[0,0,this.children.length,e.children.length]:[this.children.length-1,e.children.length-1,-1,-1];for(;;n+=i,r+=i){if(n==o||r==a)return s;let l=this.children[n],c=e.children[r];if(l!=c)return s+l.scanIdentical(c,i);s+=l.length+1}}static from(e,i=e.reduce((s,n)=>s+n.length+1,-1)){let s=0;for(let u of e)s+=u.lines;if(s<32){let u=[];for(let p of e)p.flatten(u);return new fe(u,i)}let n=Math.max(32,s>>5),r=n<<1,o=n>>1,a=[],l=0,c=-1,h=[];function d(u){let p;if(u.lines>r&&u instanceof Ct)for(let m of u.children)d(m);else u.lines>o&&(l>o||!l)?(f(),a.push(u)):u instanceof fe&&l&&(p=h[h.length-1])instanceof fe&&u.lines+p.lines<=32?(l+=u.lines,c+=u.length+1,h[h.length-1]=new fe(p.text.concat(u.text),p.length+1+u.length)):(l+u.lines>n&&f(),l+=u.lines,c+=u.length+1,h.push(u))}function f(){l!=0&&(a.push(h.length==1?h[0]:Ct.from(h,c)),c=-1,l=h.length=0)}for(let u of e)d(u);return f(),a.length==1?a[0]:new Ct(a,i)}}K.empty=new fe([""],0);function Gg(t){let e=-1;for(let i of t)e+=i.length+1;return e}function ir(t,e,i=0,s=1e9){for(let n=0,r=0,o=!0;r<t.length&&n<=s;r++){let a=t[r],l=n+a.length;l>=i&&(l>s&&(a=a.slice(0,s-n)),n<i&&(a=a.slice(i-n)),o?(e[e.length-1]+=a,o=!1):e.push(a)),n=l+1}return e}function mc(t,e,i){return ir(t,[""],e,i)}class Ws{constructor(e,i=1){this.dir=i,this.done=!1,this.lineBreak=!1,this.value="",this.nodes=[e],this.offsets=[i>0?1:(e instanceof fe?e.text.length:e.children.length)<<1]}nextInner(e,i){for(this.done=this.lineBreak=!1;;){let s=this.nodes.length-1,n=this.nodes[s],r=this.offsets[s],o=r>>1,a=n instanceof fe?n.text.length:n.children.length;if(o==(i>0?a:0)){if(s==0)return this.done=!0,this.value="",this;i>0&&this.offsets[s-1]++,this.nodes.pop(),this.offsets.pop()}else if((r&1)==(i>0?0:1)){if(this.offsets[s]+=i,e==0)return this.lineBreak=!0,this.value=`
`,this;e--}else if(n instanceof fe){let l=n.text[o+(i<0?-1:0)];if(this.offsets[s]+=i,l.length>Math.max(0,e))return this.value=e==0?l:i>0?l.slice(e):l.slice(0,l.length-e),this;e-=l.length}else{let l=n.children[o+(i<0?-1:0)];e>l.length?(e-=l.length,this.offsets[s]+=i):(i<0&&this.offsets[s]--,this.nodes.push(l),this.offsets.push(i>0?1:(l instanceof fe?l.text.length:l.children.length)<<1))}}}next(e=0){return e<0&&(this.nextInner(-e,-this.dir),e=this.value.length),this.nextInner(e,this.dir)}}class Ed{constructor(e,i,s){this.value="",this.done=!1,this.cursor=new Ws(e,i>s?-1:1),this.pos=i>s?e.length:0,this.from=Math.min(i,s),this.to=Math.max(i,s)}nextInner(e,i){if(i<0?this.pos<=this.from:this.pos>=this.to)return this.value="",this.done=!0,this;e+=Math.max(0,i<0?this.pos-this.to:this.from-this.pos);let s=i<0?this.pos-this.from:this.to-this.pos;e>s&&(e=s),s-=e;let{value:n}=this.cursor.next(e);return this.pos+=(n.length+e)*i,this.value=n.length<=s?n:i<0?n.slice(n.length-s):n.slice(0,s),this.done=!this.value,this}next(e=0){return e<0?e=Math.max(e,this.from-this.pos):e>0&&(e=Math.min(e,this.to-this.pos)),this.nextInner(e,this.cursor.dir)}get lineBreak(){return this.cursor.lineBreak&&this.value!=""}}class Dd{constructor(e){this.inner=e,this.afterBreak=!0,this.value="",this.done=!1}next(e=0){let{done:i,lineBreak:s,value:n}=this.inner.next(e);return i&&this.afterBreak?(this.value="",this.afterBreak=!1):i?(this.done=!0,this.value=""):s?this.afterBreak?this.value="":(this.afterBreak=!0,this.next()):(this.value=n,this.afterBreak=!1),this}get lineBreak(){return!1}}typeof Symbol<"u"&&(K.prototype[Symbol.iterator]=function(){return this.iter()},Ws.prototype[Symbol.iterator]=Ed.prototype[Symbol.iterator]=Dd.prototype[Symbol.iterator]=function(){return this});class Zg{constructor(e,i,s,n){this.from=e,this.to=i,this.number=s,this.text=n}get length(){return this.to-this.from}}function ps(t,e,i){return e=Math.max(0,Math.min(t.length,e)),[e,Math.max(e,Math.min(t.length,i))]}function xe(t,e,i=!0,s=!0){return Jg(t,e,i,s)}function em(t){return t>=56320&&t<57344}function tm(t){return t>=55296&&t<56320}function Fe(t,e){let i=t.charCodeAt(e);if(!tm(i)||e+1==t.length)return i;let s=t.charCodeAt(e+1);return em(s)?(i-55296<<10)+(s-56320)+65536:i}function ll(t){return t<=65535?String.fromCharCode(t):(t-=65536,String.fromCharCode((t>>10)+55296,(t&1023)+56320))}function Ot(t){return t<65536?1:2}const sa=/\r\n?|\n/;var Re=(function(t){return t[t.Simple=0]="Simple",t[t.TrackDel=1]="TrackDel",t[t.TrackBefore=2]="TrackBefore",t[t.TrackAfter=3]="TrackAfter",t})(Re||(Re={}));class Mt{constructor(e){this.sections=e}get length(){let e=0;for(let i=0;i<this.sections.length;i+=2)e+=this.sections[i];return e}get newLength(){let e=0;for(let i=0;i<this.sections.length;i+=2){let s=this.sections[i+1];e+=s<0?this.sections[i]:s}return e}get empty(){return this.sections.length==0||this.sections.length==2&&this.sections[1]<0}iterGaps(e){for(let i=0,s=0,n=0;i<this.sections.length;){let r=this.sections[i++],o=this.sections[i++];o<0?(e(s,n,r),n+=r):n+=o,s+=r}}iterChangedRanges(e,i=!1){na(this,e,i)}get invertedDesc(){let e=[];for(let i=0;i<this.sections.length;){let s=this.sections[i++],n=this.sections[i++];n<0?e.push(s,n):e.push(n,s)}return new Mt(e)}composeDesc(e){return this.empty?e:e.empty?this:_d(this,e)}mapDesc(e,i=!1){return e.empty?this:ra(this,e,i)}mapPos(e,i=-1,s=Re.Simple){let n=0,r=0;for(let o=0;o<this.sections.length;){let a=this.sections[o++],l=this.sections[o++],c=n+a;if(l<0){if(c>e)return r+(e-n);r+=a}else{if(s!=Re.Simple&&c>=e&&(s==Re.TrackDel&&n<e&&c>e||s==Re.TrackBefore&&n<e||s==Re.TrackAfter&&c>e))return null;if(c>e||c==e&&i<0&&!a)return e==n||i<0?r:r+l;r+=l}n=c}if(e>n)throw new RangeError(`Position ${e} is out of range for changeset of length ${n}`);return r}touchesRange(e,i=e){for(let s=0,n=0;s<this.sections.length&&n<=i;){let r=this.sections[s++],o=this.sections[s++],a=n+r;if(o>=0&&n<=i&&a>=e)return n<e&&a>i?"cover":!0;n=a}return!1}toString(){let e="";for(let i=0;i<this.sections.length;){let s=this.sections[i++],n=this.sections[i++];e+=(e?" ":"")+s+(n>=0?":"+n:"")}return e}toJSON(){return this.sections}static fromJSON(e){if(!Array.isArray(e)||e.length%2||e.some(i=>typeof i!="number"))throw new RangeError("Invalid JSON representation of ChangeDesc");return new Mt(e)}static create(e){return new Mt(e)}}class me extends Mt{constructor(e,i){super(e),this.inserted=i}apply(e){if(this.length!=e.length)throw new RangeError("Applying change set to a document with the wrong length");return na(this,(i,s,n,r,o)=>e=e.replace(n,n+(s-i),o),!1),e}mapDesc(e,i=!1){return ra(this,e,i,!0)}invert(e){let i=this.sections.slice(),s=[];for(let n=0,r=0;n<i.length;n+=2){let o=i[n],a=i[n+1];if(a>=0){i[n]=a,i[n+1]=o;let l=n>>1;for(;s.length<l;)s.push(K.empty);s.push(o?e.slice(r,r+o):K.empty)}r+=o}return new me(i,s)}compose(e){return this.empty?e:e.empty?this:_d(this,e,!0)}map(e,i=!1){return e.empty?this:ra(this,e,i,!0)}iterChanges(e,i=!1){na(this,e,i)}get desc(){return Mt.create(this.sections)}filter(e){let i=[],s=[],n=[],r=new tn(this);e:for(let o=0,a=0;;){let l=o==e.length?1e9:e[o++];for(;a<l||a==l&&r.len==0;){if(r.done)break e;let h=Math.min(r.len,l-a);Pe(n,h,-1);let d=r.ins==-1?-1:r.off==0?r.ins:0;Pe(i,h,d),d>0&&ti(s,i,r.text),r.forward(h),a+=h}let c=e[o++];for(;a<c;){if(r.done)break e;let h=Math.min(r.len,c-a);Pe(i,h,-1),Pe(n,h,r.ins==-1?-1:r.off==0?r.ins:0),r.forward(h),a+=h}}return{changes:new me(i,s),filtered:Mt.create(n)}}toJSON(){let e=[];for(let i=0;i<this.sections.length;i+=2){let s=this.sections[i],n=this.sections[i+1];n<0?e.push(s):n==0?e.push([s]):e.push([s].concat(this.inserted[i>>1].toJSON()))}return e}static of(e,i,s){let n=[],r=[],o=0,a=null;function l(h=!1){if(!h&&!n.length)return;o<i&&Pe(n,i-o,-1);let d=new me(n,r);a=a?a.compose(d.map(a)):d,n=[],r=[],o=0}function c(h){if(Array.isArray(h))for(let d of h)c(d);else if(h instanceof me){if(h.length!=i)throw new RangeError(`Mismatched change set length (got ${h.length}, expected ${i})`);l(),a=a?a.compose(h.map(a)):h}else{let{from:d,to:f=d,insert:u}=h;if(d>f||d<0||f>i)throw new RangeError(`Invalid change range ${d} to ${f} (in doc of length ${i})`);let p=u?typeof u=="string"?K.of(u.split(s||sa)):u:K.empty,m=p.length;if(d==f&&m==0)return;d<o&&l(),d>o&&Pe(n,d-o,-1),Pe(n,f-d,m),ti(r,n,p),o=f}}return c(e),l(!a),a}static empty(e){return new me(e?[e,-1]:[],[])}static fromJSON(e){if(!Array.isArray(e))throw new RangeError("Invalid JSON representation of ChangeSet");let i=[],s=[];for(let n=0;n<e.length;n++){let r=e[n];if(typeof r=="number")i.push(r,-1);else{if(!Array.isArray(r)||typeof r[0]!="number"||r.some((o,a)=>a&&typeof o!="string"))throw new RangeError("Invalid JSON representation of ChangeSet");if(r.length==1)i.push(r[0],0);else{for(;s.length<n;)s.push(K.empty);s[n]=K.of(r.slice(1)),i.push(r[0],s[n].length)}}}return new me(i,s)}static createSet(e,i){return new me(e,i)}}function Pe(t,e,i,s=!1){if(e==0&&i<=0)return;let n=t.length-2;n>=0&&i<=0&&i==t[n+1]?t[n]+=e:n>=0&&e==0&&t[n]==0?t[n+1]+=i:s?(t[n]+=e,t[n+1]+=i):t.push(e,i)}function ti(t,e,i){if(i.length==0)return;let s=e.length-2>>1;if(s<t.length)t[t.length-1]=t[t.length-1].append(i);else{for(;t.length<s;)t.push(K.empty);t.push(i)}}function na(t,e,i){let s=t.inserted;for(let n=0,r=0,o=0;o<t.sections.length;){let a=t.sections[o++],l=t.sections[o++];if(l<0)n+=a,r+=a;else{let c=n,h=r,d=K.empty;for(;c+=a,h+=l,l&&s&&(d=d.append(s[o-2>>1])),!(i||o==t.sections.length||t.sections[o+1]<0);)a=t.sections[o++],l=t.sections[o++];e(n,c,r,h,d),n=c,r=h}}}function ra(t,e,i,s=!1){let n=[],r=s?[]:null,o=new tn(t),a=new tn(e);for(let l=-1;;){if(o.done&&a.len||a.done&&o.len)throw new Error("Mismatched change set lengths");if(o.ins==-1&&a.ins==-1){let c=Math.min(o.len,a.len);Pe(n,c,-1),o.forward(c),a.forward(c)}else if(a.ins>=0&&(o.ins<0||l==o.i||o.off==0&&(a.len<o.len||a.len==o.len&&!i))){let c=a.len;for(Pe(n,a.ins,-1);c;){let h=Math.min(o.len,c);o.ins>=0&&l<o.i&&o.len<=h&&(Pe(n,0,o.ins),r&&ti(r,n,o.text),l=o.i),o.forward(h),c-=h}a.next()}else if(o.ins>=0){let c=0,h=o.len;for(;h;)if(a.ins==-1){let d=Math.min(h,a.len);c+=d,h-=d,a.forward(d)}else if(a.ins==0&&a.len<h)h-=a.len,a.next();else break;Pe(n,c,l<o.i?o.ins:0),r&&l<o.i&&ti(r,n,o.text),l=o.i,o.forward(o.len-h)}else{if(o.done&&a.done)return r?me.createSet(n,r):Mt.create(n);throw new Error("Mismatched change set lengths")}}}function _d(t,e,i=!1){let s=[],n=i?[]:null,r=new tn(t),o=new tn(e);for(let a=!1;;){if(r.done&&o.done)return n?me.createSet(s,n):Mt.create(s);if(r.ins==0)Pe(s,r.len,0,a),r.next();else if(o.len==0&&!o.done)Pe(s,0,o.ins,a),n&&ti(n,s,o.text),o.next();else{if(r.done||o.done)throw new Error("Mismatched change set lengths");{let l=Math.min(r.len2,o.len),c=s.length;if(r.ins==-1){let h=o.ins==-1?-1:o.off?0:o.ins;Pe(s,l,h,a),n&&h&&ti(n,s,o.text)}else o.ins==-1?(Pe(s,r.off?0:r.len,l,a),n&&ti(n,s,r.textBit(l))):(Pe(s,r.off?0:r.len,o.off?0:o.ins,a),n&&!o.off&&ti(n,s,o.text));a=(r.ins>l||o.ins>=0&&o.len>l)&&(a||s.length>c),r.forward2(l),o.forward(l)}}}}class tn{constructor(e){this.set=e,this.i=0,this.next()}next(){let{sections:e}=this.set;this.i<e.length?(this.len=e[this.i++],this.ins=e[this.i++]):(this.len=0,this.ins=-2),this.off=0}get done(){return this.ins==-2}get len2(){return this.ins<0?this.len:this.ins}get text(){let{inserted:e}=this.set,i=this.i-2>>1;return i>=e.length?K.empty:e[i]}textBit(e){let{inserted:i}=this.set,s=this.i-2>>1;return s>=i.length&&!e?K.empty:i[s].slice(this.off,e==null?void 0:this.off+e)}forward(e){e==this.len?this.next():(this.len-=e,this.off+=e)}forward2(e){this.ins==-1?this.forward(e):e==this.ins?this.next():(this.ins-=e,this.off+=e)}}class Pi{constructor(e,i,s){this.from=e,this.to=i,this.flags=s}get anchor(){return this.flags&32?this.to:this.from}get head(){return this.flags&32?this.from:this.to}get empty(){return this.from==this.to}get assoc(){return this.flags&8?-1:this.flags&16?1:0}get bidiLevel(){let e=this.flags&7;return e==7?null:e}get goalColumn(){let e=this.flags>>6;return e==16777215?void 0:e}map(e,i=-1){let s,n;return this.empty?s=n=e.mapPos(this.from,i):(s=e.mapPos(this.from,1),n=e.mapPos(this.to,-1)),s==this.from&&n==this.to?this:new Pi(s,n,this.flags)}extend(e,i=e,s=0){if(e<=this.anchor&&i>=this.anchor)return S.range(e,i,void 0,void 0,s);let n=Math.abs(e-this.anchor)>Math.abs(i-this.anchor)?e:i;return S.range(this.anchor,n,void 0,void 0,s)}eq(e,i=!1){return this.anchor==e.anchor&&this.head==e.head&&this.goalColumn==e.goalColumn&&(!i||!this.empty||this.assoc==e.assoc)}toJSON(){return{anchor:this.anchor,head:this.head}}static fromJSON(e){if(!e||typeof e.anchor!="number"||typeof e.head!="number")throw new RangeError("Invalid JSON representation for SelectionRange");return S.range(e.anchor,e.head)}static create(e,i,s){return new Pi(e,i,s)}}class S{constructor(e,i){this.ranges=e,this.mainIndex=i}map(e,i=-1){return e.empty?this:S.create(this.ranges.map(s=>s.map(e,i)),this.mainIndex)}eq(e,i=!1){if(this.ranges.length!=e.ranges.length||this.mainIndex!=e.mainIndex)return!1;for(let s=0;s<this.ranges.length;s++)if(!this.ranges[s].eq(e.ranges[s],i))return!1;return!0}get main(){return this.ranges[this.mainIndex]}asSingle(){return this.ranges.length==1?this:new S([this.main],0)}addRange(e,i=!0){return S.create([e].concat(this.ranges),i?0:this.mainIndex+1)}replaceRange(e,i=this.mainIndex){let s=this.ranges.slice();return s[i]=e,S.create(s,this.mainIndex)}toJSON(){return{ranges:this.ranges.map(e=>e.toJSON()),main:this.mainIndex}}static fromJSON(e){if(!e||!Array.isArray(e.ranges)||typeof e.main!="number"||e.main>=e.ranges.length)throw new RangeError("Invalid JSON representation for EditorSelection");return new S(e.ranges.map(i=>Pi.fromJSON(i)),e.main)}static single(e,i=e){return new S([S.range(e,i)],0)}static create(e,i=0){if(e.length==0)throw new RangeError("A selection needs at least one range");for(let s=0,n=0;n<e.length;n++){let r=e[n];if(r.empty?r.from<=s:r.from<s)return S.normalized(e.slice(),i);s=r.to}return new S(e,i)}static cursor(e,i=0,s,n){return Pi.create(e,e,(i==0?0:i<0?8:16)|(s==null?7:Math.min(6,s))|(n??16777215)<<6)}static range(e,i,s,n,r){let o=(s??16777215)<<6|(n==null?7:Math.min(6,n));return!r&&e!=i&&(r=i<e?1:-1),i<e?Pi.create(i,e,48|o):Pi.create(e,i,(r?r<0?8:16:0)|o)}static normalized(e,i=0){let s=e[i];e.sort((n,r)=>n.from-r.from),i=e.indexOf(s);for(let n=1;n<e.length;n++){let r=e[n],o=e[n-1];if(r.empty?r.from<=o.to:r.from<o.to){let a=o.from,l=Math.max(r.to,o.to);n<=i&&i--,e.splice(--n,2,r.anchor>r.head?S.range(l,a):S.range(a,l))}}return new S(e,i)}}function Bd(t,e){for(let i of t.ranges)if(i.to>e)throw new RangeError("Selection points outside of document")}let cl=0;class D{constructor(e,i,s,n,r){this.combine=e,this.compareInput=i,this.compare=s,this.isStatic=n,this.id=cl++,this.default=e([]),this.extensions=typeof r=="function"?r(this):r}get reader(){return this}static define(e={}){return new D(e.combine||(i=>i),e.compareInput||((i,s)=>i===s),e.compare||(e.combine?(i,s)=>i===s:hl),!!e.static,e.enables)}of(e){return new sr([],this,0,e)}compute(e,i){if(this.isStatic)throw new Error("Can't compute a static facet");return new sr(e,this,1,i)}computeN(e,i){if(this.isStatic)throw new Error("Can't compute a static facet");return new sr(e,this,2,i)}from(e,i){return i||(i=s=>s),this.compute([e],s=>i(s.field(e)))}}function hl(t,e){return t==e||t.length==e.length&&t.every((i,s)=>i===e[s])}class sr{constructor(e,i,s,n){this.dependencies=e,this.facet=i,this.type=s,this.value=n,this.id=cl++}dynamicSlot(e){var i;let s=this.value,n=this.facet.compareInput,r=this.id,o=e[r]>>1,a=this.type==2,l=!1,c=!1,h=[];for(let d of this.dependencies)d=="doc"?l=!0:d=="selection"?c=!0:(((i=e[d.id])!==null&&i!==void 0?i:1)&1)==0&&h.push(e[d.id]);return{create(d){return d.values[o]=s(d),1},update(d,f){if(l&&f.docChanged||c&&(f.docChanged||f.selection)||oa(d,h)){let u=s(d);if(a?!bc(u,d.values[o],n):!n(u,d.values[o]))return d.values[o]=u,1}return 0},reconfigure:(d,f)=>{let u,p=f.config.address[r];if(p!=null){let m=br(f,p);if(this.dependencies.every(b=>b instanceof D?f.facet(b)===d.facet(b):b instanceof Ee?f.field(b,!1)==d.field(b,!1):!0)||(a?bc(u=s(d),m,n):n(u=s(d),m)))return d.values[o]=m,0}else u=s(d);return d.values[o]=u,1}}}}function bc(t,e,i){if(t.length!=e.length)return!1;for(let s=0;s<t.length;s++)if(!i(t[s],e[s]))return!1;return!0}function oa(t,e){let i=!1;for(let s of e)Us(t,s)&1&&(i=!0);return i}function im(t,e,i){let s=i.map(l=>t[l.id]),n=i.map(l=>l.type),r=s.filter(l=>!(l&1)),o=t[e.id]>>1;function a(l){let c=[];for(let h=0;h<s.length;h++){let d=br(l,s[h]);if(n[h]==2)for(let f of d)c.push(f);else c.push(d)}return e.combine(c)}return{create(l){for(let c of s)Us(l,c);return l.values[o]=a(l),1},update(l,c){if(!oa(l,r))return 0;let h=a(l);return e.compare(h,l.values[o])?0:(l.values[o]=h,1)},reconfigure(l,c){let h=oa(l,s),d=c.config.facets[e.id],f=c.facet(e);if(d&&!h&&hl(i,d))return l.values[o]=f,0;let u=a(l);return e.compare(u,f)?(l.values[o]=f,0):(l.values[o]=u,1)}}}const En=D.define({static:!0});class Ee{constructor(e,i,s,n,r){this.id=e,this.createF=i,this.updateF=s,this.compareF=n,this.spec=r,this.provides=void 0}static define(e){let i=new Ee(cl++,e.create,e.update,e.compare||((s,n)=>s===n),e);return e.provide&&(i.provides=e.provide(i)),i}create(e){let i=e.facet(En).find(s=>s.field==this);return((i==null?void 0:i.create)||this.createF)(e)}slot(e){let i=e[this.id]>>1;return{create:s=>(s.values[i]=this.create(s),1),update:(s,n)=>{let r=s.values[i],o=this.updateF(r,n);return this.compareF(r,o)?0:(s.values[i]=o,1)},reconfigure:(s,n)=>{let r=s.facet(En),o=n.facet(En),a;return(a=r.find(l=>l.field==this))&&a!=o.find(l=>l.field==this)?(s.values[i]=a.create(s),1):n.config.address[this.id]!=null?(s.values[i]=n.field(this),0):(s.values[i]=this.create(s),1)}}}init(e){return[this,En.of({field:this,create:e})]}get extension(){return this}}const Ci={lowest:4,low:3,default:2,high:1,highest:0};function Ms(t){return e=>new Rd(e,t)}const qi={highest:Ms(Ci.highest),high:Ms(Ci.high),default:Ms(Ci.default),low:Ms(Ci.low),lowest:Ms(Ci.lowest)};class Rd{constructor(e,i){this.inner=e,this.prec=i}}class Jr{of(e){return new aa(this,e)}reconfigure(e){return Jr.reconfigure.of({compartment:this,extension:e})}get(e){return e.config.compartments.get(this)}}class aa{constructor(e,i){this.compartment=e,this.inner=i}}class mr{constructor(e,i,s,n,r,o){for(this.base=e,this.compartments=i,this.dynamicSlots=s,this.address=n,this.staticValues=r,this.facets=o,this.statusTemplate=[];this.statusTemplate.length<s.length;)this.statusTemplate.push(0)}staticFacet(e){let i=this.address[e.id];return i==null?e.default:this.staticValues[i>>1]}static resolve(e,i,s){let n=[],r=Object.create(null),o=new Map;for(let f of sm(e,i,o))f instanceof Ee?n.push(f):(r[f.facet.id]||(r[f.facet.id]=[])).push(f);let a=Object.create(null),l=[],c=[];for(let f of n)a[f.id]=c.length<<1,c.push(u=>f.slot(u));let h=s==null?void 0:s.config.facets;for(let f in r){let u=r[f],p=u[0].facet,m=h&&h[f]||[];if(u.every(b=>b.type==0))if(a[p.id]=l.length<<1|1,hl(m,u))l.push(s.facet(p));else{let b=p.combine(u.map(x=>x.value));l.push(s&&p.compare(b,s.facet(p))?s.facet(p):b)}else{for(let b of u)b.type==0?(a[b.id]=l.length<<1|1,l.push(b.value)):(a[b.id]=c.length<<1,c.push(x=>b.dynamicSlot(x)));a[p.id]=c.length<<1,c.push(b=>im(b,p,u))}}let d=c.map(f=>f(a));return new mr(e,o,d,a,l,r)}}function sm(t,e,i){let s=[[],[],[],[],[]],n=new Map;function r(o,a){let l=n.get(o);if(l!=null){if(l<=a)return;let c=s[l].indexOf(o);c>-1&&s[l].splice(c,1),o instanceof aa&&i.delete(o.compartment)}if(n.set(o,a),Array.isArray(o))for(let c of o)r(c,a);else if(o instanceof aa){if(i.has(o.compartment))throw new RangeError("Duplicate use of compartment in extensions");let c=e.get(o.compartment)||o.inner;i.set(o.compartment,c),r(c,a)}else if(o instanceof Rd)r(o.inner,o.prec);else if(o instanceof Ee)s[a].push(o),o.provides&&r(o.provides,a);else if(o instanceof sr)s[a].push(o),o.facet.extensions&&r(o.facet.extensions,Ci.default);else{let c=o.extension;if(!c)throw new Error(`Unrecognized extension value in extension set (${o}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`);r(c,a)}}return r(t,Ci.default),s.reduce((o,a)=>o.concat(a))}function Us(t,e){if(e&1)return 2;let i=e>>1,s=t.status[i];if(s==4)throw new Error("Cyclic dependency between fields and/or facets");if(s&2)return s;t.status[i]=4;let n=t.computeSlot(t,t.config.dynamicSlots[i]);return t.status[i]=2|n}function br(t,e){return e&1?t.config.staticValues[e>>1]:t.values[e>>1]}const Ld=D.define(),la=D.define({combine:t=>t.some(e=>e),static:!0}),Id=D.define({combine:t=>t.length?t[0]:void 0,static:!0}),Fd=D.define(),Nd=D.define(),zd=D.define(),Hd=D.define({combine:t=>t.length?t[0]:!1});class Xt{constructor(e,i){this.type=e,this.value=i}static define(){return new nm}}class nm{of(e){return new Xt(this,e)}}class rm{constructor(e){this.map=e}of(e){return new H(this,e)}}class H{constructor(e,i){this.type=e,this.value=i}map(e){let i=this.type.map(this.value,e);return i===void 0?void 0:i==this.value?this:new H(this.type,i)}is(e){return this.type==e}static define(e={}){return new rm(e.map||(i=>i))}static mapEffects(e,i){if(!e.length)return e;let s=[];for(let n of e){let r=n.map(i);r&&s.push(r)}return s}}H.reconfigure=H.define();H.appendConfig=H.define();class be{constructor(e,i,s,n,r,o){this.startState=e,this.changes=i,this.selection=s,this.effects=n,this.annotations=r,this.scrollIntoView=o,this._doc=null,this._state=null,s&&Bd(s,i.newLength),r.some(a=>a.type==be.time)||(this.annotations=r.concat(be.time.of(Date.now())))}static create(e,i,s,n,r,o){return new be(e,i,s,n,r,o)}get newDoc(){return this._doc||(this._doc=this.changes.apply(this.startState.doc))}get newSelection(){return this.selection||this.startState.selection.map(this.changes)}get state(){return this._state||this.startState.applyTransaction(this),this._state}annotation(e){for(let i of this.annotations)if(i.type==e)return i.value}get docChanged(){return!this.changes.empty}get reconfigured(){return this.startState.config!=this.state.config}isUserEvent(e){let i=this.annotation(be.userEvent);return!!(i&&(i==e||i.length>e.length&&i.slice(0,e.length)==e&&i[e.length]=="."))}}be.time=Xt.define();be.userEvent=Xt.define();be.addToHistory=Xt.define();be.remote=Xt.define();function om(t,e){let i=[];for(let s=0,n=0;;){let r,o;if(s<t.length&&(n==e.length||e[n]>=t[s]))r=t[s++],o=t[s++];else if(n<e.length)r=e[n++],o=e[n++];else return i;!i.length||i[i.length-1]<r?i.push(r,o):i[i.length-1]<o&&(i[i.length-1]=o)}}function Wd(t,e,i){var s;let n,r,o;return i?(n=e.changes,r=me.empty(e.changes.length),o=t.changes.compose(e.changes)):(n=e.changes.map(t.changes),r=t.changes.mapDesc(e.changes,!0),o=t.changes.compose(n)),{changes:o,selection:e.selection?e.selection.map(r):(s=t.selection)===null||s===void 0?void 0:s.map(n),effects:H.mapEffects(t.effects,n).concat(H.mapEffects(e.effects,r)),annotations:t.annotations.length?t.annotations.concat(e.annotations):e.annotations,scrollIntoView:t.scrollIntoView||e.scrollIntoView}}function ca(t,e,i){let s=e.selection,n=ns(e.annotations);return e.userEvent&&(n=n.concat(be.userEvent.of(e.userEvent))),{changes:e.changes instanceof me?e.changes:me.of(e.changes||[],i,t.facet(Id)),selection:s&&(s instanceof S?s:S.single(s.anchor,s.head)),effects:ns(e.effects),annotations:n,scrollIntoView:!!e.scrollIntoView}}function Ud(t,e,i){let s=ca(t,e.length?e[0]:{},t.doc.length);e.length&&e[0].filter===!1&&(i=!1);for(let r=1;r<e.length;r++){e[r].filter===!1&&(i=!1);let o=!!e[r].sequential;s=Wd(s,ca(t,e[r],o?s.changes.newLength:t.doc.length),o)}let n=be.create(t,s.changes,s.selection,s.effects,s.annotations,s.scrollIntoView);return lm(i?am(n):n)}function am(t){let e=t.startState,i=!0;for(let n of e.facet(Fd)){let r=n(t);if(r===!1){i=!1;break}Array.isArray(r)&&(i=i===!0?r:om(i,r))}if(i!==!0){let n,r;if(i===!1)r=t.changes.invertedDesc,n=me.empty(e.doc.length);else{let o=t.changes.filter(i);n=o.changes,r=o.filtered.mapDesc(o.changes).invertedDesc}t=be.create(e,n,t.selection&&t.selection.map(r),H.mapEffects(t.effects,r),t.annotations,t.scrollIntoView)}let s=e.facet(Nd);for(let n=s.length-1;n>=0;n--){let r=s[n](t);r instanceof be?t=r:Array.isArray(r)&&r.length==1&&r[0]instanceof be?t=r[0]:t=Ud(e,ns(r),!1)}return t}function lm(t){let e=t.startState,i=e.facet(zd),s=t;for(let n=i.length-1;n>=0;n--){let r=i[n](t);r&&Object.keys(r).length&&(s=Wd(s,ca(e,r,t.changes.newLength),!0))}return s==t?t:be.create(e,t.changes,t.selection,s.effects,s.annotations,s.scrollIntoView)}const cm=[];function ns(t){return t==null?cm:Array.isArray(t)?t:[t]}var oe=(function(t){return t[t.Word=0]="Word",t[t.Space=1]="Space",t[t.Other=2]="Other",t})(oe||(oe={}));const hm=/[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;let ha;try{ha=new RegExp("[\\p{Alphabetic}\\p{Number}_]","u")}catch{}function dm(t){if(ha)return ha.test(t);for(let e=0;e<t.length;e++){let i=t[e];if(/\w/.test(i)||i>""&&(i.toUpperCase()!=i.toLowerCase()||hm.test(i)))return!0}return!1}function fm(t){return e=>{if(!/\S/.test(e))return oe.Space;if(dm(e))return oe.Word;for(let i=0;i<t.length;i++)if(e.indexOf(t[i])>-1)return oe.Word;return oe.Other}}class j{constructor(e,i,s,n,r,o){this.config=e,this.doc=i,this.selection=s,this.values=n,this.status=e.statusTemplate.slice(),this.computeSlot=r,o&&(o._state=this);for(let a=0;a<this.config.dynamicSlots.length;a++)Us(this,a<<1);this.computeSlot=null}field(e,i=!0){let s=this.config.address[e.id];if(s==null){if(i)throw new RangeError("Field is not present in this state");return}return Us(this,s),br(this,s)}update(...e){return Ud(this,e,!0)}applyTransaction(e){let i=this.config,{base:s,compartments:n}=i;for(let a of e.effects)a.is(Jr.reconfigure)?(i&&(n=new Map,i.compartments.forEach((l,c)=>n.set(c,l)),i=null),n.set(a.value.compartment,a.value.extension)):a.is(H.reconfigure)?(i=null,s=a.value):a.is(H.appendConfig)&&(i=null,s=ns(s).concat(a.value));let r;i?r=e.startState.values.slice():(i=mr.resolve(s,n,this),r=new j(i,this.doc,this.selection,i.dynamicSlots.map(()=>null),(l,c)=>c.reconfigure(l,this),null).values);let o=e.startState.facet(la)?e.newSelection:e.newSelection.asSingle();new j(i,e.newDoc,o,r,(a,l)=>l.update(a,e),e)}replaceSelection(e){return typeof e=="string"&&(e=this.toText(e)),this.changeByRange(i=>({changes:{from:i.from,to:i.to,insert:e},range:S.cursor(i.from+e.length)}))}changeByRange(e){let i=this.selection,s=e(i.ranges[0]),n=this.changes(s.changes),r=[s.range],o=ns(s.effects);for(let a=1;a<i.ranges.length;a++){let l=e(i.ranges[a]),c=this.changes(l.changes),h=c.map(n);for(let f=0;f<a;f++)r[f]=r[f].map(h);let d=n.mapDesc(c,!0);r.push(l.range.map(d)),n=n.compose(h),o=H.mapEffects(o,h).concat(H.mapEffects(ns(l.effects),d))}return{changes:n,selection:S.create(r,i.mainIndex),effects:o}}changes(e=[]){return e instanceof me?e:me.of(e,this.doc.length,this.facet(j.lineSeparator))}toText(e){return K.of(e.split(this.facet(j.lineSeparator)||sa))}sliceDoc(e=0,i=this.doc.length){return this.doc.sliceString(e,i,this.lineBreak)}facet(e){let i=this.config.address[e.id];return i==null?e.default:(Us(this,i),br(this,i))}toJSON(e){let i={doc:this.sliceDoc(),selection:this.selection.toJSON()};if(e)for(let s in e){let n=e[s];n instanceof Ee&&this.config.address[n.id]!=null&&(i[s]=n.spec.toJSON(this.field(e[s]),this))}return i}static fromJSON(e,i={},s){if(!e||typeof e.doc!="string")throw new RangeError("Invalid JSON representation for EditorState");let n=[];if(s){for(let r in s)if(Object.prototype.hasOwnProperty.call(e,r)){let o=s[r],a=e[r];n.push(o.init(l=>o.spec.fromJSON(a,l)))}}return j.create({doc:e.doc,selection:S.fromJSON(e.selection),extensions:i.extensions?n.concat([i.extensions]):n})}static create(e={}){let i=mr.resolve(e.extensions||[],new Map),s=e.doc instanceof K?e.doc:K.of((e.doc||"").split(i.staticFacet(j.lineSeparator)||sa)),n=e.selection?e.selection instanceof S?e.selection:S.single(e.selection.anchor,e.selection.head):S.single(0);return Bd(n,s.length),i.staticFacet(la)||(n=n.asSingle()),new j(i,s,n,i.dynamicSlots.map(()=>null),(r,o)=>o.create(r),null)}get tabSize(){return this.facet(j.tabSize)}get lineBreak(){return this.facet(j.lineSeparator)||`
`}get readOnly(){return this.facet(Hd)}phrase(e,...i){for(let s of this.facet(j.phrases))if(Object.prototype.hasOwnProperty.call(s,e)){e=s[e];break}return i.length&&(e=e.replace(/\$(\$|\d*)/g,(s,n)=>{if(n=="$")return"$";let r=+(n||1);return!r||r>i.length?s:i[r-1]})),e}languageDataAt(e,i,s=-1){let n=[];for(let r of this.facet(Ld))for(let o of r(this,i,s))Object.prototype.hasOwnProperty.call(o,e)&&n.push(o[e]);return n}charCategorizer(e){let i=this.languageDataAt("wordChars",e);return fm(i.length?i[0]:"")}wordAt(e){let{text:i,from:s,length:n}=this.doc.lineAt(e),r=this.charCategorizer(e),o=e-s,a=e-s;for(;o>0;){let l=xe(i,o,!1);if(r(i.slice(l,o))!=oe.Word)break;o=l}for(;a<n;){let l=xe(i,a);if(r(i.slice(a,l))!=oe.Word)break;a=l}return o==a?null:S.range(o+s,a+s)}}j.allowMultipleSelections=la;j.tabSize=D.define({combine:t=>t.length?t[0]:4});j.lineSeparator=Id;j.readOnly=Hd;j.phrases=D.define({compare(t,e){let i=Object.keys(t),s=Object.keys(e);return i.length==s.length&&i.every(n=>t[n]==e[n])}});j.languageData=Ld;j.changeFilter=Fd;j.transactionFilter=Nd;j.transactionExtender=zd;Jr.reconfigure=H.define();function Rt(t,e,i={}){let s={};for(let n of t)for(let r of Object.keys(n)){let o=n[r],a=s[r];if(a===void 0)s[r]=o;else if(!(a===o||o===void 0))if(Object.hasOwnProperty.call(i,r))s[r]=i[r](a,o);else throw new Error("Config merge conflict for field "+r)}for(let n in e)s[n]===void 0&&(s[n]=e[n]);return s}class ai{eq(e){return this==e}range(e,i=e){return da.create(e,i,this)}}ai.prototype.startSide=ai.prototype.endSide=0;ai.prototype.point=!1;ai.prototype.mapMode=Re.TrackDel;function dl(t,e){return t==e||t.constructor==e.constructor&&t.eq(e)}let da=class qd{constructor(e,i,s){this.from=e,this.to=i,this.value=s}static create(e,i,s){return new qd(e,i,s)}};function fa(t,e){return t.from-e.from||t.value.startSide-e.value.startSide}class fl{constructor(e,i,s,n){this.from=e,this.to=i,this.value=s,this.maxPoint=n}get length(){return this.to[this.to.length-1]}findIndex(e,i,s,n=0){let r=s?this.to:this.from;for(let o=n,a=r.length;;){if(o==a)return o;let l=o+a>>1,c=r[l]-e||(s?this.value[l].endSide:this.value[l].startSide)-i;if(l==o)return c>=0?o:a;c>=0?a=l:o=l+1}}between(e,i,s,n){for(let r=this.findIndex(i,-1e9,!0),o=this.findIndex(s,1e9,!1,r);r<o;r++)if(n(this.from[r]+e,this.to[r]+e,this.value[r])===!1)return!1}map(e,i){let s=[],n=[],r=[],o=-1,a=-1;for(let l=0;l<this.value.length;l++){let c=this.value[l],h=this.from[l]+e,d=this.to[l]+e,f,u;if(h==d){let p=i.mapPos(h,c.startSide,c.mapMode);if(p==null||(f=u=p,c.startSide!=c.endSide&&(u=i.mapPos(h,c.endSide),u<f)))continue}else if(f=i.mapPos(h,c.startSide),u=i.mapPos(d,c.endSide),f>u||f==u&&c.startSide>0&&c.endSide<=0)continue;(u-f||c.endSide-c.startSide)<0||(o<0&&(o=f),c.point&&(a=Math.max(a,u-f)),s.push(c),n.push(f-o),r.push(u-o))}return{mapped:s.length?new fl(n,r,s,a):null,pos:o}}}class q{constructor(e,i,s,n){this.chunkPos=e,this.chunk=i,this.nextLayer=s,this.maxPoint=n}static create(e,i,s,n){return new q(e,i,s,n)}get length(){let e=this.chunk.length-1;return e<0?0:Math.max(this.chunkEnd(e),this.nextLayer.length)}get size(){if(this.isEmpty)return 0;let e=this.nextLayer.size;for(let i of this.chunk)e+=i.value.length;return e}chunkEnd(e){return this.chunkPos[e]+this.chunk[e].length}update(e){let{add:i=[],sort:s=!1,filterFrom:n=0,filterTo:r=this.length}=e,o=e.filter;if(i.length==0&&!o)return this;if(s&&(i=i.slice().sort(fa)),this.isEmpty)return i.length?q.of(i):this;let a=new Vd(this,null,-1).goto(0),l=0,c=[],h=new qt;for(;a.value||l<i.length;)if(l<i.length&&(a.from-i[l].from||a.startSide-i[l].value.startSide)>=0){let d=i[l++];h.addInner(d.from,d.to,d.value)||c.push(d)}else a.rangeIndex==1&&a.chunkIndex<this.chunk.length&&(l==i.length||this.chunkEnd(a.chunkIndex)<i[l].from)&&(!o||n>this.chunkEnd(a.chunkIndex)||r<this.chunkPos[a.chunkIndex])&&h.addChunk(this.chunkPos[a.chunkIndex],this.chunk[a.chunkIndex])?a.nextChunk():((!o||n>a.to||r<a.from||o(a.from,a.to,a.value))&&(h.addInner(a.from,a.to,a.value)||c.push(da.create(a.from,a.to,a.value))),a.next());return h.finishInner(this.nextLayer.isEmpty&&!c.length?q.empty:this.nextLayer.update({add:c,filter:o,filterFrom:n,filterTo:r}))}map(e){if(e.empty||this.isEmpty)return this;let i=[],s=[],n=-1;for(let o=0;o<this.chunk.length;o++){let a=this.chunkPos[o],l=this.chunk[o],c=e.touchesRange(a,a+l.length);if(c===!1)n=Math.max(n,l.maxPoint),i.push(l),s.push(e.mapPos(a));else if(c===!0){let{mapped:h,pos:d}=l.map(a,e);h&&(n=Math.max(n,h.maxPoint),i.push(h),s.push(d))}}let r=this.nextLayer.map(e);return i.length==0?r:new q(s,i,r||q.empty,n)}between(e,i,s){if(!this.isEmpty){for(let n=0;n<this.chunk.length;n++){let r=this.chunkPos[n],o=this.chunk[n];if(i>=r&&e<=r+o.length&&o.between(r,e-r,i-r,s)===!1)return}this.nextLayer.between(e,i,s)}}iter(e=0){return sn.from([this]).goto(e)}get isEmpty(){return this.nextLayer==this}static iter(e,i=0){return sn.from(e).goto(i)}static compare(e,i,s,n,r=-1){let o=e.filter(d=>d.maxPoint>0||!d.isEmpty&&d.maxPoint>=r),a=i.filter(d=>d.maxPoint>0||!d.isEmpty&&d.maxPoint>=r),l=vc(o,a,s),c=new Es(o,l,r),h=new Es(a,l,r);s.iterGaps((d,f,u)=>yc(c,d,h,f,u,n)),s.empty&&s.length==0&&yc(c,0,h,0,0,n)}static eq(e,i,s=0,n){n==null&&(n=999999999);let r=e.filter(h=>!h.isEmpty&&i.indexOf(h)<0),o=i.filter(h=>!h.isEmpty&&e.indexOf(h)<0);if(r.length!=o.length)return!1;if(!r.length)return!0;let a=vc(r,o),l=new Es(r,a,0).goto(s),c=new Es(o,a,0).goto(s);for(;;){if(l.to!=c.to||!ua(l.active,c.active)||l.point&&(!c.point||!dl(l.point,c.point)))return!1;if(l.to>n)return!0;l.next(),c.next()}}static spans(e,i,s,n,r=-1){let o=new Es(e,null,r).goto(i),a=i,l=o.openStart;for(;;){let c=Math.min(o.to,s);if(o.point){let h=o.activeForPoint(o.to),d=o.pointFrom<i?h.length+1:o.point.startSide<0?h.length:Math.min(h.length,l);n.point(a,c,o.point,h,d,o.pointRank),l=Math.min(o.openEnd(c),h.length)}else c>a&&(n.span(a,c,o.active,l),l=o.openEnd(c));if(o.to>s)return l+(o.point&&o.to>s?1:0);a=o.to,o.next()}}static of(e,i=!1){let s=new qt;for(let n of e instanceof da?[e]:i?um(e):e)s.add(n.from,n.to,n.value);return s.finish()}static join(e){if(!e.length)return q.empty;let i=e[e.length-1];for(let s=e.length-2;s>=0;s--)for(let n=e[s];n!=q.empty;n=n.nextLayer)i=new q(n.chunkPos,n.chunk,i,Math.max(n.maxPoint,i.maxPoint));return i}}q.empty=new q([],[],null,-1);function um(t){if(t.length>1)for(let e=t[0],i=1;i<t.length;i++){let s=t[i];if(fa(e,s)>0)return t.slice().sort(fa);e=s}return t}q.empty.nextLayer=q.empty;class qt{finishChunk(e){this.chunks.push(new fl(this.from,this.to,this.value,this.maxPoint)),this.chunkPos.push(this.chunkStart),this.chunkStart=-1,this.setMaxPoint=Math.max(this.setMaxPoint,this.maxPoint),this.maxPoint=-1,e&&(this.from=[],this.to=[],this.value=[])}constructor(){this.chunks=[],this.chunkPos=[],this.chunkStart=-1,this.last=null,this.lastFrom=-1e9,this.lastTo=-1e9,this.from=[],this.to=[],this.value=[],this.maxPoint=-1,this.setMaxPoint=-1,this.nextLayer=null}add(e,i,s){this.addInner(e,i,s)||(this.nextLayer||(this.nextLayer=new qt)).add(e,i,s)}addInner(e,i,s){let n=e-this.lastTo||s.startSide-this.last.endSide;if(n<=0&&(e-this.lastFrom||s.startSide-this.last.startSide)<0)throw new Error("Ranges must be added sorted by `from` position and `startSide`");return n<0?!1:(this.from.length==250&&this.finishChunk(!0),this.chunkStart<0&&(this.chunkStart=e),this.from.push(e-this.chunkStart),this.to.push(i-this.chunkStart),this.last=s,this.lastFrom=e,this.lastTo=i,this.value.push(s),s.point&&(this.maxPoint=Math.max(this.maxPoint,i-e)),!0)}addChunk(e,i){if((e-this.lastTo||i.value[0].startSide-this.last.endSide)<0)return!1;this.from.length&&this.finishChunk(!0),this.setMaxPoint=Math.max(this.setMaxPoint,i.maxPoint),this.chunks.push(i),this.chunkPos.push(e);let s=i.value.length-1;return this.last=i.value[s],this.lastFrom=i.from[s]+e,this.lastTo=i.to[s]+e,!0}finish(){return this.finishInner(q.empty)}finishInner(e){if(this.from.length&&this.finishChunk(!1),this.chunks.length==0)return e;let i=q.create(this.chunkPos,this.chunks,this.nextLayer?this.nextLayer.finishInner(e):e,this.setMaxPoint);return this.from=null,i}}function vc(t,e,i){let s=new Map;for(let r of t)for(let o=0;o<r.chunk.length;o++)r.chunk[o].maxPoint<=0&&s.set(r.chunk[o],r.chunkPos[o]);let n=new Set;for(let r of e)for(let o=0;o<r.chunk.length;o++){let a=s.get(r.chunk[o]);a!=null&&(i?i.mapPos(a):a)==r.chunkPos[o]&&!(i!=null&&i.touchesRange(a,a+r.chunk[o].length))&&n.add(r.chunk[o])}return n}class Vd{constructor(e,i,s,n=0){this.layer=e,this.skip=i,this.minPoint=s,this.rank=n}get startSide(){return this.value?this.value.startSide:0}get endSide(){return this.value?this.value.endSide:0}goto(e,i=-1e9){return this.chunkIndex=this.rangeIndex=0,this.gotoInner(e,i,!1),this}gotoInner(e,i,s){for(;this.chunkIndex<this.layer.chunk.length;){let n=this.layer.chunk[this.chunkIndex];if(!(this.skip&&this.skip.has(n)||this.layer.chunkEnd(this.chunkIndex)<e||n.maxPoint<this.minPoint))break;this.chunkIndex++,s=!1}if(this.chunkIndex<this.layer.chunk.length){let n=this.layer.chunk[this.chunkIndex].findIndex(e-this.layer.chunkPos[this.chunkIndex],i,!0);(!s||this.rangeIndex<n)&&this.setRangeIndex(n)}this.next()}forward(e,i){(this.to-e||this.endSide-i)<0&&this.gotoInner(e,i,!0)}next(){for(;;)if(this.chunkIndex==this.layer.chunk.length){this.from=this.to=1e9,this.value=null;break}else{let e=this.layer.chunkPos[this.chunkIndex],i=this.layer.chunk[this.chunkIndex],s=e+i.from[this.rangeIndex];if(this.from=s,this.to=e+i.to[this.rangeIndex],this.value=i.value[this.rangeIndex],this.setRangeIndex(this.rangeIndex+1),this.minPoint<0||this.value.point&&this.to-this.from>=this.minPoint)break}}setRangeIndex(e){if(e==this.layer.chunk[this.chunkIndex].value.length){if(this.chunkIndex++,this.skip)for(;this.chunkIndex<this.layer.chunk.length&&this.skip.has(this.layer.chunk[this.chunkIndex]);)this.chunkIndex++;this.rangeIndex=0}else this.rangeIndex=e}nextChunk(){this.chunkIndex++,this.rangeIndex=0,this.next()}compare(e){return this.from-e.from||this.startSide-e.startSide||this.rank-e.rank||this.to-e.to||this.endSide-e.endSide}}class sn{constructor(e){this.heap=e}static from(e,i=null,s=-1){let n=[];for(let r=0;r<e.length;r++)for(let o=e[r];!o.isEmpty;o=o.nextLayer)o.maxPoint>=s&&n.push(new Vd(o,i,s,r));return n.length==1?n[0]:new sn(n)}get startSide(){return this.value?this.value.startSide:0}goto(e,i=-1e9){for(let s of this.heap)s.goto(e,i);for(let s=this.heap.length>>1;s>=0;s--)wo(this.heap,s);return this.next(),this}forward(e,i){for(let s of this.heap)s.forward(e,i);for(let s=this.heap.length>>1;s>=0;s--)wo(this.heap,s);(this.to-e||this.value.endSide-i)<0&&this.next()}next(){if(this.heap.length==0)this.from=this.to=1e9,this.value=null,this.rank=-1;else{let e=this.heap[0];this.from=e.from,this.to=e.to,this.value=e.value,this.rank=e.rank,e.value&&e.next(),wo(this.heap,0)}}}function wo(t,e){for(let i=t[e];;){let s=(e<<1)+1;if(s>=t.length)break;let n=t[s];if(s+1<t.length&&n.compare(t[s+1])>=0&&(n=t[s+1],s++),i.compare(n)<0)break;t[s]=i,t[e]=n,e=s}}class Es{constructor(e,i,s){this.minPoint=s,this.active=[],this.activeTo=[],this.activeRank=[],this.minActive=-1,this.point=null,this.pointFrom=0,this.pointRank=0,this.to=-1e9,this.endSide=0,this.openStart=-1,this.cursor=sn.from(e,i,s)}goto(e,i=-1e9){return this.cursor.goto(e,i),this.active.length=this.activeTo.length=this.activeRank.length=0,this.minActive=-1,this.to=e,this.endSide=i,this.openStart=-1,this.next(),this}forward(e,i){for(;this.minActive>-1&&(this.activeTo[this.minActive]-e||this.active[this.minActive].endSide-i)<0;)this.removeActive(this.minActive);this.cursor.forward(e,i)}removeActive(e){Dn(this.active,e),Dn(this.activeTo,e),Dn(this.activeRank,e),this.minActive=xc(this.active,this.activeTo)}addActive(e){let i=0,{value:s,to:n,rank:r}=this.cursor;for(;i<this.activeRank.length&&(r-this.activeRank[i]||n-this.activeTo[i])>0;)i++;_n(this.active,i,s),_n(this.activeTo,i,n),_n(this.activeRank,i,r),e&&_n(e,i,this.cursor.from),this.minActive=xc(this.active,this.activeTo)}next(){let e=this.to,i=this.point;this.point=null;let s=this.openStart<0?[]:null;for(;;){let n=this.minActive;if(n>-1&&(this.activeTo[n]-this.cursor.from||this.active[n].endSide-this.cursor.startSide)<0){if(this.activeTo[n]>e){this.to=this.activeTo[n],this.endSide=this.active[n].endSide;break}this.removeActive(n),s&&Dn(s,n)}else if(this.cursor.value)if(this.cursor.from>e){this.to=this.cursor.from,this.endSide=this.cursor.startSide;break}else{let r=this.cursor.value;if(!r.point)this.addActive(s),this.cursor.next();else if(i&&this.cursor.to==this.to&&this.cursor.from<this.cursor.to)this.cursor.next();else{this.point=r,this.pointFrom=this.cursor.from,this.pointRank=this.cursor.rank,this.to=this.cursor.to,this.endSide=r.endSide,this.cursor.next(),this.forward(this.to,this.endSide);break}}else{this.to=this.endSide=1e9;break}}if(s){this.openStart=0;for(let n=s.length-1;n>=0&&s[n]<e;n--)this.openStart++}}activeForPoint(e){if(!this.active.length)return this.active;let i=[];for(let s=this.active.length-1;s>=0&&!(this.activeRank[s]<this.pointRank);s--)(this.activeTo[s]>e||this.activeTo[s]==e&&this.active[s].endSide>=this.point.endSide)&&i.push(this.active[s]);return i.reverse()}openEnd(e){let i=0;for(let s=this.activeTo.length-1;s>=0&&this.activeTo[s]>e;s--)i++;return i}}function yc(t,e,i,s,n,r){t.goto(e),i.goto(s);let o=s+n,a=s,l=s-e,c=!!r.boundChange;for(let h=!1;;){let d=t.to+l-i.to,f=d||t.endSide-i.endSide,u=f<0?t.to+l:i.to,p=Math.min(u,o);if(t.point||i.point?(t.point&&i.point&&dl(t.point,i.point)&&ua(t.activeForPoint(t.to),i.activeForPoint(i.to))||r.comparePoint(a,p,t.point,i.point),h=!1):(h&&r.boundChange(a),p>a&&!ua(t.active,i.active)&&r.compareRange(a,p,t.active,i.active),c&&p<o&&(d||t.openEnd(u)!=i.openEnd(u))&&(h=!0)),u>o)break;a=u,f<=0&&t.next(),f>=0&&i.next()}}function ua(t,e){if(t.length!=e.length)return!1;for(let i=0;i<t.length;i++)if(t[i]!=e[i]&&!dl(t[i],e[i]))return!1;return!0}function Dn(t,e){for(let i=e,s=t.length-1;i<s;i++)t[i]=t[i+1];t.pop()}function _n(t,e,i){for(let s=t.length-1;s>=e;s--)t[s+1]=t[s];t[e]=i}function xc(t,e){let i=-1,s=1e9;for(let n=0;n<e.length;n++)(e[n]-s||t[n].endSide-t[i].endSide)<0&&(i=n,s=e[n]);return i}function Cs(t,e,i=t.length){let s=0;for(let n=0;n<i&&n<t.length;)t.charCodeAt(n)==9?(s+=e-s%e,n++):(s++,n=xe(t,n));return s}function pa(t,e,i,s){for(let n=0,r=0;;){if(r>=e)return n;if(n==t.length)break;r+=t.charCodeAt(n)==9?i-r%i:1,n=xe(t,n)}return s===!0?-1:t.length}const ga="ͼ",wc=typeof Symbol>"u"?"__"+ga:Symbol.for(ga),ma=typeof Symbol>"u"?"__styleSet"+Math.floor(Math.random()*1e8):Symbol("styleSet"),kc=typeof globalThis<"u"?globalThis:typeof window<"u"?window:{};class li{constructor(e,i){this.rules=[];let{finish:s}=i||{};function n(o){return/^@/.test(o)?[o]:o.split(/,\s*/)}function r(o,a,l,c){let h=[],d=/^@(\w+)\b/.exec(o[0]),f=d&&d[1]=="keyframes";if(d&&a==null)return l.push(o[0]+";");for(let u in a){let p=a[u];if(/&/.test(u))r(u.split(/,\s*/).map(m=>o.map(b=>m.replace(/&/,b))).reduce((m,b)=>m.concat(b)),p,l);else if(p&&typeof p=="object"){if(!d)throw new RangeError("The value of a property ("+u+") should be a primitive value.");r(n(u),p,h,f)}else p!=null&&h.push(u.replace(/_.*/,"").replace(/[A-Z]/g,m=>"-"+m.toLowerCase())+": "+p+";")}(h.length||f)&&l.push((s&&!d&&!c?o.map(s):o).join(", ")+" {"+h.join(" ")+"}")}for(let o in e)r(n(o),e[o],this.rules)}getRules(){return this.rules.join(`
`)}static newName(){let e=kc[wc]||1;return kc[wc]=e+1,ga+e.toString(36)}static mount(e,i,s){let n=e[ma],r=s&&s.nonce;n?r&&n.setNonce(r):n=new pm(e,r),n.mount(Array.isArray(i)?i:[i],e)}}let Sc=new Map;class pm{constructor(e,i){let s=e.ownerDocument||e,n=s.defaultView;if(!e.head&&e.adoptedStyleSheets&&n.CSSStyleSheet){let r=Sc.get(s);if(r)return e[ma]=r;this.sheet=new n.CSSStyleSheet,Sc.set(s,this)}else this.styleTag=s.createElement("style"),i&&this.styleTag.setAttribute("nonce",i);this.modules=[],e[ma]=this}mount(e,i){let s=this.sheet,n=0,r=0;for(let o=0;o<e.length;o++){let a=e[o],l=this.modules.indexOf(a);if(l<r&&l>-1&&(this.modules.splice(l,1),r--,l=-1),l==-1){if(this.modules.splice(r++,0,a),s)for(let c=0;c<a.rules.length;c++)s.insertRule(a.rules[c],n++)}else{for(;r<l;)n+=this.modules[r++].rules.length;n+=a.rules.length,r++}}if(s)i.adoptedStyleSheets.indexOf(this.sheet)<0&&(i.adoptedStyleSheets=[this.sheet,...i.adoptedStyleSheets]);else{let o="";for(let l=0;l<this.modules.length;l++)o+=this.modules[l].getRules()+`
`;this.styleTag.textContent=o;let a=i.head||i;this.styleTag.parentNode!=a&&a.insertBefore(this.styleTag,a.firstChild)}}setNonce(e){this.styleTag&&this.styleTag.getAttribute("nonce")!=e&&this.styleTag.setAttribute("nonce",e)}}var ci={8:"Backspace",9:"Tab",10:"Enter",12:"NumLock",13:"Enter",16:"Shift",17:"Control",18:"Alt",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",44:"PrintScreen",45:"Insert",46:"Delete",59:";",61:"=",91:"Meta",92:"Meta",106:"*",107:"+",108:",",109:"-",110:".",111:"/",144:"NumLock",145:"ScrollLock",160:"Shift",161:"Shift",162:"Control",163:"Control",164:"Alt",165:"Alt",173:"-",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},nn={48:")",49:"!",50:"@",51:"#",52:"$",53:"%",54:"^",55:"&",56:"*",57:"(",59:":",61:"+",173:"_",186:":",187:"+",188:"<",189:"_",190:">",191:"?",192:"~",219:"{",220:"|",221:"}",222:'"'},gm=typeof navigator<"u"&&/Mac/.test(navigator.platform),mm=typeof navigator<"u"&&/MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);for(var Oe=0;Oe<10;Oe++)ci[48+Oe]=ci[96+Oe]=String(Oe);for(var Oe=1;Oe<=24;Oe++)ci[Oe+111]="F"+Oe;for(var Oe=65;Oe<=90;Oe++)ci[Oe]=String.fromCharCode(Oe+32),nn[Oe]=String.fromCharCode(Oe);for(var ko in ci)nn.hasOwnProperty(ko)||(nn[ko]=ci[ko]);function bm(t){var e=gm&&t.metaKey&&t.shiftKey&&!t.ctrlKey&&!t.altKey||mm&&t.shiftKey&&t.key&&t.key.length==1||t.key=="Unidentified",i=!e&&t.key||(t.shiftKey?nn:ci)[t.keyCode]||t.key||"Unidentified";return i=="Esc"&&(i="Escape"),i=="Del"&&(i="Delete"),i=="Left"&&(i="ArrowLeft"),i=="Up"&&(i="ArrowUp"),i=="Right"&&(i="ArrowRight"),i=="Down"&&(i="ArrowDown"),i}function Y(){var t=arguments[0];typeof t=="string"&&(t=document.createElement(t));var e=1,i=arguments[1];if(i&&typeof i=="object"&&i.nodeType==null&&!Array.isArray(i)){for(var s in i)if(Object.prototype.hasOwnProperty.call(i,s)){var n=i[s];typeof n=="string"?t.setAttribute(s,n):n!=null&&(t[s]=n)}e++}for(;e<arguments.length;e++)Qd(t,arguments[e]);return t}function Qd(t,e){if(typeof e=="string")t.appendChild(document.createTextNode(e));else if(e!=null)if(e.nodeType!=null)t.appendChild(e);else if(Array.isArray(e))for(var i=0;i<e.length;i++)Qd(t,e[i]);else throw new RangeError("Unsupported child node: "+e)}let Be=typeof navigator<"u"?navigator:{userAgent:"",vendor:"",platform:""},ba=typeof document<"u"?document:{documentElement:{style:{}}};const va=/Edge\/(\d+)/.exec(Be.userAgent),jd=/MSIE \d/.test(Be.userAgent),ya=/Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Be.userAgent),Yr=!!(jd||ya||va),Cc=!Yr&&/gecko\/(\d+)/i.test(Be.userAgent),So=!Yr&&/Chrome\/(\d+)/.exec(Be.userAgent),Oc="webkitFontSmoothing"in ba.documentElement.style,xa=!Yr&&/Apple Computer/.test(Be.vendor),Ac=xa&&(/Mobile\/\w+/.test(Be.userAgent)||Be.maxTouchPoints>2);var E={mac:Ac||/Mac/.test(Be.platform),windows:/Win/.test(Be.platform),linux:/Linux|X11/.test(Be.platform),ie:Yr,ie_version:jd?ba.documentMode||6:ya?+ya[1]:va?+va[1]:0,gecko:Cc,gecko_version:Cc?+(/Firefox\/(\d+)/.exec(Be.userAgent)||[0,0])[1]:0,chrome:!!So,chrome_version:So?+So[1]:0,ios:Ac,android:/Android\b/.test(Be.userAgent),webkit:Oc,webkit_version:Oc?+(/\bAppleWebKit\/(\d+)/.exec(Be.userAgent)||[0,0])[1]:0,safari:xa,safari_version:xa?+(/\bVersion\/(\d+(\.\d+)?)/.exec(Be.userAgent)||[0,0])[1]:0,tabSize:ba.documentElement.style.tabSize!=null?"tab-size":"-moz-tab-size"};function ul(t,e){for(let i in t)i=="class"&&e.class?e.class+=" "+t.class:i=="style"&&e.style?e.style+=";"+t.style:e[i]=t[i];return e}const vr=Object.create(null);function pl(t,e,i){if(t==e)return!0;t||(t=vr),e||(e=vr);let s=Object.keys(t),n=Object.keys(e);if(s.length-0!=n.length-0)return!1;for(let r of s)if(r!=i&&(n.indexOf(r)==-1||t[r]!==e[r]))return!1;return!0}function vm(t,e){for(let i=t.attributes.length-1;i>=0;i--){let s=t.attributes[i].name;e[s]==null&&t.removeAttribute(s)}for(let i in e){let s=e[i];i=="style"?t.style.cssText=s:t.getAttribute(i)!=s&&t.setAttribute(i,s)}}function $c(t,e,i){let s=!1;if(e)for(let n in e)i&&n in i||(s=!0,n=="style"?t.style.cssText="":t.removeAttribute(n));if(i)for(let n in i)e&&e[n]==i[n]||(s=!0,n=="style"?t.style.cssText=i[n]:t.setAttribute(n,i[n]));return s}function ym(t){let e=Object.create(null);for(let i=0;i<t.attributes.length;i++){let s=t.attributes[i];e[s.name]=s.value}return e}class Jt{eq(e){return!1}updateDOM(e,i,s){return!1}compare(e){return this==e||this.constructor==e.constructor&&this.eq(e)}get estimatedHeight(){return-1}get lineBreaks(){return 0}ignoreEvent(e){return!0}coordsAt(e,i,s){return null}get isHidden(){return!1}get editable(){return!1}destroy(e){}}var Ae=(function(t){return t[t.Text=0]="Text",t[t.WidgetBefore=1]="WidgetBefore",t[t.WidgetAfter=2]="WidgetAfter",t[t.WidgetRange=3]="WidgetRange",t})(Ae||(Ae={}));class N extends ai{constructor(e,i,s,n){super(),this.startSide=e,this.endSide=i,this.widget=s,this.spec=n}get heightRelevant(){return!1}static mark(e){return new kn(e)}static widget(e){let i=Math.max(-1e4,Math.min(1e4,e.side||0)),s=!!e.block;return i+=s&&!e.inlineOrder?i>0?3e8:-4e8:i>0?1e8:-1e8,new zi(e,i,i,s,e.widget||null,!1)}static replace(e){let i=!!e.block,s,n;if(e.isBlockGap)s=-5e8,n=4e8;else{let{start:r,end:o}=Kd(e,i);s=(r?i?-3e8:-1:5e8)-1,n=(o?i?2e8:1:-6e8)+1}return new zi(e,s,n,i,e.widget||null,!0)}static line(e){return new Sn(e)}static set(e,i=!1){return q.of(e,i)}hasHeight(){return this.widget?this.widget.estimatedHeight>-1:!1}}N.none=q.empty;class kn extends N{constructor(e){let{start:i,end:s}=Kd(e);super(i?-1:5e8,s?1:-6e8,null,e),this.tagName=e.tagName||"span",this.attrs=e.class&&e.attributes?ul(e.attributes,{class:e.class}):e.class?{class:e.class}:e.attributes||vr}eq(e){return this==e||e instanceof kn&&this.tagName==e.tagName&&pl(this.attrs,e.attrs)}range(e,i=e){if(e>=i)throw new RangeError("Mark decorations may not be empty");return super.range(e,i)}}kn.prototype.point=!1;class Sn extends N{constructor(e){super(-2e8,-2e8,null,e)}eq(e){return e instanceof Sn&&this.spec.class==e.spec.class&&pl(this.spec.attributes,e.spec.attributes)}range(e,i=e){if(i!=e)throw new RangeError("Line decoration ranges must be zero-length");return super.range(e,i)}}Sn.prototype.mapMode=Re.TrackBefore;Sn.prototype.point=!0;class zi extends N{constructor(e,i,s,n,r,o){super(i,s,r,e),this.block=n,this.isReplace=o,this.mapMode=n?i<=0?Re.TrackBefore:Re.TrackAfter:Re.TrackDel}get type(){return this.startSide!=this.endSide?Ae.WidgetRange:this.startSide<=0?Ae.WidgetBefore:Ae.WidgetAfter}get heightRelevant(){return this.block||!!this.widget&&(this.widget.estimatedHeight>=5||this.widget.lineBreaks>0)}eq(e){return e instanceof zi&&xm(this.widget,e.widget)&&this.block==e.block&&this.startSide==e.startSide&&this.endSide==e.endSide}range(e,i=e){if(this.isReplace&&(e>i||e==i&&this.startSide>0&&this.endSide<=0))throw new RangeError("Invalid range for replacement decoration");if(!this.isReplace&&i!=e)throw new RangeError("Widget decorations can only have zero-length ranges");return super.range(e,i)}}zi.prototype.point=!0;function Kd(t,e=!1){let{inclusiveStart:i,inclusiveEnd:s}=t;return i==null&&(i=t.inclusive),s==null&&(s=t.inclusive),{start:i??e,end:s??e}}function xm(t,e){return t==e||!!(t&&e&&t.compare(e))}function rs(t,e,i,s=0){let n=i.length-1;n>=0&&i[n]+s>=t?i[n]=Math.max(i[n],e):i.push(t,e)}class rn extends ai{constructor(e,i){super(),this.tagName=e,this.attributes=i}eq(e){return e==this||e instanceof rn&&this.tagName==e.tagName&&pl(this.attributes,e.attributes)}static create(e){return new rn(e.tagName,e.attributes||vr)}static set(e,i=!1){return q.of(e,i)}}rn.prototype.startSide=rn.prototype.endSide=-1;function on(t){let e;return t.nodeType==11?e=t.getSelection?t:t.ownerDocument:e=t,e.getSelection()}function wa(t,e){return e?t==e||t.contains(e.nodeType!=1?e.parentNode:e):!1}function qs(t,e){if(!e.anchorNode)return!1;try{return wa(t,e.anchorNode)}catch{return!1}}function nr(t){return t.nodeType==3?an(t,0,t.nodeValue.length).getClientRects():t.nodeType==1?t.getClientRects():[]}function Vs(t,e,i,s){return i?Pc(t,e,i,s,-1)||Pc(t,e,i,s,1):!1}function hi(t){for(var e=0;;e++)if(t=t.previousSibling,!t)return e}function yr(t){return t.nodeType==1&&/^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(t.nodeName)}function Pc(t,e,i,s,n){for(;;){if(t==i&&e==s)return!0;if(e==(n<0?0:Vt(t))){if(t.nodeName=="DIV")return!1;let r=t.parentNode;if(!r||r.nodeType!=1)return!1;e=hi(t)+(n<0?0:1),t=r}else if(t.nodeType==1){if(t=t.childNodes[e+(n<0?-1:0)],t.nodeType==1&&t.contentEditable=="false")return!1;e=n<0?Vt(t):0}else return!1}}function Vt(t){return t.nodeType==3?t.nodeValue.length:t.childNodes.length}function xr(t,e){let i=e?t.left:t.right;return{left:i,right:i,top:t.top,bottom:t.bottom}}function wm(t){let e=t.visualViewport;return e?{left:0,right:e.width,top:0,bottom:e.height}:{left:0,right:t.innerWidth,top:0,bottom:t.innerHeight}}function Xd(t,e){let i=e.width/t.offsetWidth,s=e.height/t.offsetHeight;return(i>.995&&i<1.005||!isFinite(i)||Math.abs(e.width-t.offsetWidth)<1)&&(i=1),(s>.995&&s<1.005||!isFinite(s)||Math.abs(e.height-t.offsetHeight)<1)&&(s=1),{scaleX:i,scaleY:s}}function km(t,e,i,s,n,r,o,a){let l=t.ownerDocument,c=l.defaultView||window;for(let h=t,d=!1;h&&!d;)if(h.nodeType==1){let f,u=h==l.body,p=1,m=1;if(u)f=wm(c);else{if(/^(fixed|sticky)$/.test(getComputedStyle(h).position)&&(d=!0),h.scrollHeight<=h.clientHeight&&h.scrollWidth<=h.clientWidth){h=h.assignedSlot||h.parentNode;continue}let k=h.getBoundingClientRect();({scaleX:p,scaleY:m}=Xd(h,k)),f={left:k.left,right:k.left+h.clientWidth*p,top:k.top,bottom:k.top+h.clientHeight*m}}let b=0,x=0;if(n=="nearest")e.top<f.top+o?(x=e.top-(f.top+o),i>0&&e.bottom>f.bottom+x&&(x=e.bottom-f.bottom+o)):e.bottom>f.bottom-o&&(x=e.bottom-f.bottom+o,i<0&&e.top-x<f.top&&(x=e.top-(f.top+o)));else{let k=e.bottom-e.top,O=f.bottom-f.top;x=(n=="center"&&k<=O?e.top+k/2-O/2:n=="start"||n=="center"&&i<0?e.top-o:e.bottom-O+o)-f.top}if(s=="nearest"?e.left<f.left+r?(b=e.left-(f.left+r),i>0&&e.right>f.right+b&&(b=e.right-f.right+r)):e.right>f.right-r&&(b=e.right-f.right+r,i<0&&e.left<f.left+b&&(b=e.left-(f.left+r))):b=(s=="center"?e.left+(e.right-e.left)/2-(f.right-f.left)/2:s=="start"==a?e.left-r:e.right-(f.right-f.left)+r)-f.left,b||x)if(u)c.scrollBy(b,x);else{let k=0,O=0;if(x){let R=h.scrollTop;h.scrollTop+=x/m,O=(h.scrollTop-R)*m}if(b){let R=h.scrollLeft;h.scrollLeft+=b/p,k=(h.scrollLeft-R)*p}e={left:e.left-k,top:e.top-O,right:e.right-k,bottom:e.bottom-O},k&&Math.abs(k-b)<1&&(s="nearest"),O&&Math.abs(O-x)<1&&(n="nearest")}if(u)break;(e.top<f.top||e.bottom>f.bottom||e.left<f.left||e.right>f.right)&&(e={left:Math.max(e.left,f.left),right:Math.min(e.right,f.right),top:Math.max(e.top,f.top),bottom:Math.min(e.bottom,f.bottom)}),h=h.assignedSlot||h.parentNode}else if(h.nodeType==11)h=h.host;else break}function Jd(t,e=!0){let i=t.ownerDocument,s=null,n=null;for(let r=t.parentNode;r&&!(r==i.body||(!e||s)&&n);)if(r.nodeType==1)!n&&r.scrollHeight>r.clientHeight&&(n=r),e&&!s&&r.scrollWidth>r.clientWidth&&(s=r),r=r.assignedSlot||r.parentNode;else if(r.nodeType==11)r=r.host;else break;return{x:s,y:n}}class Sm{constructor(){this.anchorNode=null,this.anchorOffset=0,this.focusNode=null,this.focusOffset=0}eq(e){return this.anchorNode==e.anchorNode&&this.anchorOffset==e.anchorOffset&&this.focusNode==e.focusNode&&this.focusOffset==e.focusOffset}setRange(e){let{anchorNode:i,focusNode:s}=e;this.set(i,Math.min(e.anchorOffset,i?Vt(i):0),s,Math.min(e.focusOffset,s?Vt(s):0))}set(e,i,s,n){this.anchorNode=e,this.anchorOffset=i,this.focusNode=s,this.focusOffset=n}}let Si=null;E.safari&&E.safari_version>=26&&(Si=!1);function Yd(t){if(t.setActive)return t.setActive();if(Si)return t.focus(Si);let e=[];for(let i=t;i&&(e.push(i,i.scrollTop,i.scrollLeft),i!=i.ownerDocument);i=i.parentNode);if(t.focus(Si==null?{get preventScroll(){return Si={preventScroll:!0},!0}}:void 0),!Si){Si=!1;for(let i=0;i<e.length;){let s=e[i++],n=e[i++],r=e[i++];s.scrollTop!=n&&(s.scrollTop=n),s.scrollLeft!=r&&(s.scrollLeft=r)}}}let Tc;function an(t,e,i=e){let s=Tc||(Tc=document.createRange());return s.setEnd(t,i),s.setStart(t,e),s}function os(t,e,i,s){let n={key:e,code:e,keyCode:i,which:i,cancelable:!0};s&&({altKey:n.altKey,ctrlKey:n.ctrlKey,shiftKey:n.shiftKey,metaKey:n.metaKey}=s);let r=new KeyboardEvent("keydown",n);r.synthetic=!0,t.dispatchEvent(r);let o=new KeyboardEvent("keyup",n);return o.synthetic=!0,t.dispatchEvent(o),r.defaultPrevented||o.defaultPrevented}function Cm(t){for(;t;){if(t&&(t.nodeType==9||t.nodeType==11&&t.host))return t;t=t.assignedSlot||t.parentNode}return null}function Om(t,e){let i=e.focusNode,s=e.focusOffset;if(!i||e.anchorNode!=i||e.anchorOffset!=s)return!1;for(s=Math.min(s,Vt(i));;)if(s){if(i.nodeType!=1)return!1;let n=i.childNodes[s-1];n.contentEditable=="false"?s--:(i=n,s=Vt(i))}else{if(i==t)return!0;s=hi(i),i=i.parentNode}}function Gd(t){return t instanceof Window?t.pageYOffset>Math.max(0,t.document.documentElement.scrollHeight-t.innerHeight-4):t.scrollTop>Math.max(1,t.scrollHeight-t.clientHeight-4)}function Zd(t,e){for(let i=t,s=e;;){if(i.nodeType==3&&s>0)return{node:i,offset:s};if(i.nodeType==1&&s>0){if(i.contentEditable=="false")return null;i=i.childNodes[s-1],s=Vt(i)}else if(i.parentNode&&!yr(i))s=hi(i),i=i.parentNode;else return null}}function ef(t,e){for(let i=t,s=e;;){if(i.nodeType==3&&s<i.nodeValue.length)return{node:i,offset:s};if(i.nodeType==1&&s<i.childNodes.length){if(i.contentEditable=="false")return null;i=i.childNodes[s],s=0}else if(i.parentNode&&!yr(i))s=hi(i)+1,i=i.parentNode;else return null}}class ct{constructor(e,i,s=!0){this.node=e,this.offset=i,this.precise=s}static before(e,i){return new ct(e.parentNode,hi(e),i)}static after(e,i){return new ct(e.parentNode,hi(e)+1,i)}}var ee=(function(t){return t[t.LTR=0]="LTR",t[t.RTL=1]="RTL",t})(ee||(ee={}));const Hi=ee.LTR,gl=ee.RTL;function tf(t){let e=[];for(let i=0;i<t.length;i++)e.push(1<<+t[i]);return e}const Am=tf("88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008"),$m=tf("4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333"),ka=Object.create(null),xt=[];for(let t of["()","[]","{}"]){let e=t.charCodeAt(0),i=t.charCodeAt(1);ka[e]=i,ka[i]=-e}function sf(t){return t<=247?Am[t]:1424<=t&&t<=1524?2:1536<=t&&t<=1785?$m[t-1536]:1774<=t&&t<=2220?4:8192<=t&&t<=8204?256:64336<=t&&t<=65023?4:1}const Pm=/[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\ufb50-\ufdff]/;class $t{get dir(){return this.level%2?gl:Hi}constructor(e,i,s){this.from=e,this.to=i,this.level=s}side(e,i){return this.dir==i==e?this.to:this.from}forward(e,i){return e==(this.dir==i)}static find(e,i,s,n){let r=-1;for(let o=0;o<e.length;o++){let a=e[o];if(a.from<=i&&a.to>=i){if(a.level==s)return o;(r<0||(n!=0?n<0?a.from<i:a.to>i:e[r].level>a.level))&&(r=o)}}if(r<0)throw new RangeError("Index out of range");return r}}function nf(t,e){if(t.length!=e.length)return!1;for(let i=0;i<t.length;i++){let s=t[i],n=e[i];if(s.from!=n.from||s.to!=n.to||s.direction!=n.direction||!nf(s.inner,n.inner))return!1}return!0}const Z=[];function Tm(t,e,i,s,n){for(let r=0;r<=s.length;r++){let o=r?s[r-1].to:e,a=r<s.length?s[r].from:i,l=r?256:n;for(let c=o,h=l,d=l;c<a;c++){let f=sf(t.charCodeAt(c));f==512?f=h:f==8&&d==4&&(f=16),Z[c]=f==4?2:f,f&7&&(d=f),h=f}for(let c=o,h=l,d=l;c<a;c++){let f=Z[c];if(f==128)c<a-1&&h==Z[c+1]&&h&24?f=Z[c]=h:Z[c]=256;else if(f==64){let u=c+1;for(;u<a&&Z[u]==64;)u++;let p=c&&h==8||u<i&&Z[u]==8?d==1?1:8:256;for(let m=c;m<u;m++)Z[m]=p;c=u-1}else f==8&&d==1&&(Z[c]=1);h=f,f&7&&(d=f)}}}function Mm(t,e,i,s,n){let r=n==1?2:1;for(let o=0,a=0,l=0;o<=s.length;o++){let c=o?s[o-1].to:e,h=o<s.length?s[o].from:i;for(let d=c,f,u,p;d<h;d++)if(u=ka[f=t.charCodeAt(d)])if(u<0){for(let m=a-3;m>=0;m-=3)if(xt[m+1]==-u){let b=xt[m+2],x=b&2?n:b&4?b&1?r:n:0;x&&(Z[d]=Z[xt[m]]=x),a=m;break}}else{if(xt.length==189)break;xt[a++]=d,xt[a++]=f,xt[a++]=l}else if((p=Z[d])==2||p==1){let m=p==n;l=m?0:1;for(let b=a-3;b>=0;b-=3){let x=xt[b+2];if(x&2)break;if(m)xt[b+2]|=2;else{if(x&4)break;xt[b+2]|=4}}}}}function Em(t,e,i,s){for(let n=0,r=s;n<=i.length;n++){let o=n?i[n-1].to:t,a=n<i.length?i[n].from:e;for(let l=o;l<a;){let c=Z[l];if(c==256){let h=l+1;for(;;)if(h==a){if(n==i.length)break;h=i[n++].to,a=n<i.length?i[n].from:e}else if(Z[h]==256)h++;else break;let d=r==1,f=(h<e?Z[h]:s)==1,u=d==f?d?1:2:s;for(let p=h,m=n,b=m?i[m-1].to:t;p>l;)p==b&&(p=i[--m].from,b=m?i[m-1].to:t),Z[--p]=u;l=h}else r=c,l++}}}function Sa(t,e,i,s,n,r,o){let a=s%2?2:1;if(s%2==n%2)for(let l=e,c=0;l<i;){let h=!0,d=!1;if(c==r.length||l<r[c].from){let m=Z[l];m!=a&&(h=!1,d=m==16)}let f=!h&&a==1?[]:null,u=h?s:s+1,p=l;e:for(;;)if(c<r.length&&p==r[c].from){if(d)break e;let m=r[c];if(!h)for(let b=m.to,x=c+1;;){if(b==i)break e;if(x<r.length&&r[x].from==b)b=r[x++].to;else{if(Z[b]==a)break e;break}}if(c++,f)f.push(m);else{m.from>l&&o.push(new $t(l,m.from,u));let b=m.direction==Hi!=!(u%2);Ca(t,b?s+1:s,n,m.inner,m.from,m.to,o),l=m.to}p=m.to}else{if(p==i||(h?Z[p]!=a:Z[p]==a))break;p++}f?Sa(t,l,p,s+1,n,f,o):l<p&&o.push(new $t(l,p,u)),l=p}else for(let l=i,c=r.length;l>e;){let h=!0,d=!1;if(!c||l>r[c-1].to){let m=Z[l-1];m!=a&&(h=!1,d=m==16)}let f=!h&&a==1?[]:null,u=h?s:s+1,p=l;e:for(;;)if(c&&p==r[c-1].to){if(d)break e;let m=r[--c];if(!h)for(let b=m.from,x=c;;){if(b==e)break e;if(x&&r[x-1].to==b)b=r[--x].from;else{if(Z[b-1]==a)break e;break}}if(f)f.push(m);else{m.to<l&&o.push(new $t(m.to,l,u));let b=m.direction==Hi!=!(u%2);Ca(t,b?s+1:s,n,m.inner,m.from,m.to,o),l=m.from}p=m.from}else{if(p==e||(h?Z[p-1]!=a:Z[p-1]==a))break;p--}f?Sa(t,p,l,s+1,n,f,o):p<l&&o.push(new $t(p,l,u)),l=p}}function Ca(t,e,i,s,n,r,o){let a=e%2?2:1;Tm(t,n,r,s,a),Mm(t,n,r,s,a),Em(n,r,s,a),Sa(t,n,r,e,i,s,o)}function Dm(t,e,i){if(!t)return[new $t(0,0,e==gl?1:0)];if(e==Hi&&!i.length&&!Pm.test(t))return rf(t.length);if(i.length)for(;t.length>Z.length;)Z[Z.length]=256;let s=[],n=e==Hi?0:1;return Ca(t,n,n,i,0,t.length,s),s}function rf(t){return[new $t(0,t,0)]}let of="";function _m(t,e,i,s,n){var r;let o=s.head-t.from,a=$t.find(e,o,(r=s.bidiLevel)!==null&&r!==void 0?r:-1,s.assoc),l=e[a],c=l.side(n,i);if(o==c){let f=a+=n?1:-1;if(f<0||f>=e.length)return null;l=e[a=f],o=l.side(!n,i),c=l.side(n,i)}let h=xe(t.text,o,l.forward(n,i));(h<l.from||h>l.to)&&(h=c),of=t.text.slice(Math.min(o,h),Math.max(o,h));let d=a==(n?e.length-1:0)?null:e[a+(n?1:-1)];return d&&h==c&&d.level+(n?0:1)<l.level?S.cursor(d.side(!n,i)+t.from,d.forward(n,i)?1:-1,d.level):S.cursor(h+t.from,l.forward(n,i)?-1:1,l.level)}function Bm(t,e,i){for(let s=e;s<i;s++){let n=sf(t.charCodeAt(s));if(n==1)return Hi;if(n==2||n==4)return gl}return Hi}const af=D.define(),lf=D.define(),cf=D.define(),hf=D.define(),Oa=D.define(),df=D.define(),ff=D.define(),ml=D.define(),bl=D.define(),uf=D.define({combine:t=>t.some(e=>e)}),pf=D.define({combine:t=>t.some(e=>e)}),gf=D.define();class as{constructor(e,i,s,n,r,o=!1){this.range=e,this.y=i,this.x=s,this.yMargin=n,this.xMargin=r,this.isSnapshot=o}map(e){return e.empty?this:new as(this.range.map(e),this.y,this.x,this.yMargin,this.xMargin,this.isSnapshot)}clip(e){return this.range.to<=e.doc.length?this:new as(S.cursor(e.doc.length),this.y,this.x,this.yMargin,this.xMargin,this.isSnapshot)}}const Bn=H.define({map:(t,e)=>t.map(e)}),mf=H.define();function He(t,e,i){let s=t.facet(hf);s.length?s[0](e):window.onerror&&window.onerror(String(e),i,void 0,void 0,e)||(i?console.error(i+":",e):console.error(e))}const Ht=D.define({combine:t=>t.length?t[0]:!0});let Rm=0;const Gi=D.define({combine(t){return t.filter((e,i)=>{for(let s=0;s<i;s++)if(t[s].plugin==e.plugin)return!1;return!0})}});class pe{constructor(e,i,s,n,r){this.id=e,this.create=i,this.domEventHandlers=s,this.domEventObservers=n,this.baseExtensions=r(this),this.extension=this.baseExtensions.concat(Gi.of({plugin:this,arg:void 0}))}of(e){return this.baseExtensions.concat(Gi.of({plugin:this,arg:e}))}static define(e,i){const{eventHandlers:s,eventObservers:n,provide:r,decorations:o}=i||{};return new pe(Rm++,e,s,n,a=>{let l=[];return o&&l.push(Gr.of(c=>{let h=c.plugin(a);return h?o(h):N.none})),r&&l.push(r(a)),l})}static fromClass(e,i){return pe.define((s,n)=>new e(s,n),i)}}class Co{constructor(e){this.spec=e,this.mustUpdate=null,this.value=null}get plugin(){return this.spec&&this.spec.plugin}update(e){if(this.value){if(this.mustUpdate){let i=this.mustUpdate;if(this.mustUpdate=null,this.value.update)try{this.value.update(i)}catch(s){if(He(i.state,s,"CodeMirror plugin crashed"),this.value.destroy)try{this.value.destroy()}catch{}this.deactivate()}}}else if(this.spec)try{this.value=this.spec.plugin.create(e,this.spec.arg)}catch(i){He(e.state,i,"CodeMirror plugin crashed"),this.deactivate()}return this}destroy(e){var i;if(!((i=this.value)===null||i===void 0)&&i.destroy)try{this.value.destroy()}catch(s){He(e.state,s,"CodeMirror plugin crashed")}}deactivate(){this.spec=this.value=null}}const bf=D.define(),vl=D.define(),Gr=D.define(),vf=D.define(),yl=D.define(),Cn=D.define(),yf=D.define();function Mc(t,e){let i=t.state.facet(yf);if(!i.length)return i;let s=i.map(r=>r instanceof Function?r(t):r),n=[];return q.spans(s,e.from,e.to,{point(){},span(r,o,a,l){let c=r-e.from,h=o-e.from,d=n;for(let f=a.length-1;f>=0;f--,l--){let u=a[f].spec.bidiIsolate,p;if(u==null&&(u=Bm(e.text,c,h)),l>0&&d.length&&(p=d[d.length-1]).to==c&&p.direction==u)p.to=h,d=p.inner;else{let m={from:c,to:h,direction:u,inner:[]};d.push(m),d=m.inner}}}}),n}const xf=D.define();function xl(t){let e=0,i=0,s=0,n=0;for(let r of t.state.facet(xf)){let o=r(t);o&&(o.left!=null&&(e=Math.max(e,o.left)),o.right!=null&&(i=Math.max(i,o.right)),o.top!=null&&(s=Math.max(s,o.top)),o.bottom!=null&&(n=Math.max(n,o.bottom)))}return{left:e,right:i,top:s,bottom:n}}const Ls=D.define();class tt{constructor(e,i,s,n){this.fromA=e,this.toA=i,this.fromB=s,this.toB=n}join(e){return new tt(Math.min(this.fromA,e.fromA),Math.max(this.toA,e.toA),Math.min(this.fromB,e.fromB),Math.max(this.toB,e.toB))}addToSet(e){let i=e.length,s=this;for(;i>0;i--){let n=e[i-1];if(!(n.fromA>s.toA)){if(n.toA<s.fromA)break;s=s.join(n),e.splice(i-1,1)}}return e.splice(i,0,s),e}static extendWithRanges(e,i){if(i.length==0)return e;let s=[];for(let n=0,r=0,o=0;;){let a=n<e.length?e[n].fromB:1e9,l=r<i.length?i[r]:1e9,c=Math.min(a,l);if(c==1e9)break;let h=c+o,d=c,f=h;for(;;)if(r<i.length&&i[r]<=d){let u=i[r+1];r+=2,d=Math.max(d,u);for(let p=n;p<e.length&&e[p].fromB<=d;p++)o=e[p].toA-e[p].toB;f=Math.max(f,u+o)}else if(n<e.length&&e[n].fromB<=d){let u=e[n++];d=Math.max(d,u.toB),f=Math.max(f,u.toA),o=u.toA-u.toB}else break;s.push(new tt(h,f,c,d))}return s}}class wr{constructor(e,i,s){this.view=e,this.state=i,this.transactions=s,this.flags=0,this.startState=e.state,this.changes=me.empty(this.startState.doc.length);for(let r of s)this.changes=this.changes.compose(r.changes);let n=[];this.changes.iterChangedRanges((r,o,a,l)=>n.push(new tt(r,o,a,l))),this.changedRanges=n}static create(e,i,s){return new wr(e,i,s)}get viewportChanged(){return(this.flags&4)>0}get viewportMoved(){return(this.flags&8)>0}get heightChanged(){return(this.flags&2)>0}get geometryChanged(){return this.docChanged||(this.flags&18)>0}get focusChanged(){return(this.flags&1)>0}get docChanged(){return!this.changes.empty}get selectionSet(){return this.transactions.some(e=>e.selection)}get empty(){return this.flags==0&&this.transactions.length==0}}const Lm=[];class de{constructor(e,i,s=0){this.dom=e,this.length=i,this.flags=s,this.parent=null,e.cmTile=this}get breakAfter(){return this.flags&1}get children(){return Lm}isWidget(){return!1}get isHidden(){return!1}isComposite(){return!1}isLine(){return!1}isText(){return!1}isBlock(){return!1}get domAttrs(){return null}sync(e){if(this.flags|=2,this.flags&4){this.flags&=-5;let i=this.domAttrs;i&&vm(this.dom,i)}}toString(){return this.constructor.name+(this.children.length?`(${this.children})`:"")+(this.breakAfter?"#":"")}destroy(){this.parent=null}setDOM(e){this.dom=e,e.cmTile=this}get posAtStart(){return this.parent?this.parent.posBefore(this):0}get posAtEnd(){return this.posAtStart+this.length}posBefore(e,i=this.posAtStart){let s=i;for(let n of this.children){if(n==e)return s;s+=n.length+n.breakAfter}throw new RangeError("Invalid child in posBefore")}posAfter(e){return this.posBefore(e)+e.length}covers(e){return!0}coordsIn(e,i){return null}domPosFor(e,i){let s=hi(this.dom),n=this.length?e>0:i>0;return new ct(this.parent.dom,s+(n?1:0),e==0||e==this.length)}markDirty(e){this.flags&=-3,e&&(this.flags|=4),this.parent&&this.parent.flags&2&&this.parent.markDirty(!1)}get overrideDOMText(){return null}get root(){for(let e=this;e;e=e.parent)if(e instanceof eo)return e;return null}static get(e){return e.cmTile}}class Zr extends de{constructor(e){super(e,0),this._children=[]}isComposite(){return!0}get children(){return this._children}get lastChild(){return this.children.length?this.children[this.children.length-1]:null}append(e){this.children.push(e),e.parent=this}sync(e){if(this.flags&2)return;super.sync(e);let i=this.dom,s=null,n,r=(e==null?void 0:e.node)==i?e:null,o=0;for(let a of this.children){if(a.sync(e),o+=a.length+a.breakAfter,n=s?s.nextSibling:i.firstChild,r&&n!=a.dom&&(r.written=!0),a.dom.parentNode==i)for(;n&&n!=a.dom;)n=Ec(n);else i.insertBefore(a.dom,n);s=a.dom}for(n=s?s.nextSibling:i.firstChild,r&&n&&(r.written=!0);n;)n=Ec(n);this.length=o}}function Ec(t){let e=t.nextSibling;return t.parentNode.removeChild(t),e}class eo extends Zr{constructor(e,i){super(i),this.view=e}owns(e){for(;e;e=e.parent)if(e==this)return!0;return!1}isBlock(){return!0}nearest(e){for(;;){if(!e)return null;let i=de.get(e);if(i&&this.owns(i))return i;e=e.parentNode}}blockTiles(e){for(let i=[],s=this,n=0,r=0;;)if(n==s.children.length){if(!i.length)return;s=s.parent,s.breakAfter&&r++,n=i.pop()}else{let o=s.children[n++];if(o instanceof Ut)i.push(n),s=o,n=0;else{let a=r+o.length,l=e(o,r);if(l!==void 0)return l;r=a+o.breakAfter}}}resolveBlock(e,i){let s,n=-1,r,o=-1;if(this.blockTiles((a,l)=>{let c=l+a.length;if(e>=l&&e<=c){if(a.isWidget()&&i>=-1&&i<=1){if(a.flags&32)return!0;a.flags&16&&(s=void 0)}(l<e||e==c&&(i<-1?a.length:a.covers(1)))&&(!s||!a.isWidget()&&s.isWidget())&&(s=a,n=e-l),(c>e||e==l&&(i>1?a.length:a.covers(-1)))&&(!r||!a.isWidget()&&r.isWidget())&&(r=a,o=e-l)}}),!s&&!r)throw new Error("No tile at position "+e);return s&&i<0||!r?{tile:s,offset:n}:{tile:r,offset:o}}}class Ut extends Zr{constructor(e,i){super(e),this.wrapper=i}isBlock(){return!0}covers(e){return this.children.length?e<0?this.children[0].covers(-1):this.lastChild.covers(1):!1}get domAttrs(){return this.wrapper.attributes}static of(e,i){let s=new Ut(i||document.createElement(e.tagName),e);return i||(s.flags|=4),s}}class gs extends Zr{constructor(e,i){super(e),this.attrs=i}isLine(){return!0}static start(e,i,s){let n=new gs(i||document.createElement("div"),e);return(!i||!s)&&(n.flags|=4),n}get domAttrs(){return this.attrs}resolveInline(e,i,s){let n=null,r=-1,o=null,a=-1;function l(h,d){for(let f=0,u=0;f<h.children.length&&u<=d;f++){let p=h.children[f],m=u+p.length;m>=d&&(p.isComposite()?l(p,d-u):(!o||o.isHidden&&(i>0||s&&Fm(o,p)))&&(m>d||p.flags&32)?(o=p,a=d-u):(u<d||p.flags&16&&!p.isHidden)&&(n=p,r=d-u)),u=m}}l(this,e);let c=(i<0?n:o)||n||o;return c?{tile:c,offset:c==n?r:a}:null}coordsIn(e,i){let s=this.resolveInline(e,i,!0);return s?s.tile.coordsIn(Math.max(0,s.offset),i):Im(this)}domIn(e,i){let s=this.resolveInline(e,i);if(s){let{tile:n,offset:r}=s;if(this.dom.contains(n.dom))return n.isText()?new ct(n.dom,Math.min(n.dom.nodeValue.length,r)):n.domPosFor(r,n.flags&16?1:n.flags&32?-1:i);let o=s.tile.parent,a=!1;for(let l of o.children){if(a)return new ct(l.dom,0);l==s.tile&&(a=!0)}}return new ct(this.dom,0)}}function Im(t){let e=t.dom.lastChild;if(!e)return t.dom.getBoundingClientRect();let i=nr(e);return i[i.length-1]||null}function Fm(t,e){let i=t.coordsIn(0,1),s=e.coordsIn(0,1);return i&&s&&s.top<i.bottom}class ze extends Zr{constructor(e,i){super(e),this.mark=i}get domAttrs(){return this.mark.attrs}static of(e,i){let s=new ze(i||document.createElement(e.tagName),e);return i||(s.flags|=4),s}}class Ti extends de{constructor(e,i){super(e,i.length),this.text=i}sync(e){this.flags&2||(super.sync(e),this.dom.nodeValue!=this.text&&(e&&e.node==this.dom&&(e.written=!0),this.dom.nodeValue=this.text))}isText(){return!0}toString(){return JSON.stringify(this.text)}coordsIn(e,i){let s=this.dom.nodeValue.length;e>s&&(e=s);let n=e,r=e,o=0;e==0&&i<0||e==s&&i>=0?E.chrome||E.gecko||(e?(n--,o=1):r<s&&(r++,o=-1)):i<0?n--:r<s&&r++;let a=an(this.dom,n,r).getClientRects();if(!a.length)return null;let l=a[(o?o<0:i>=0)?0:a.length-1];return E.safari&&!o&&l.width==0&&(l=Array.prototype.find.call(a,c=>c.width)||l),o?xr(l,o<0):l||null}static of(e,i){let s=new Ti(i||document.createTextNode(e),e);return i||(s.flags|=2),s}}class Wi extends de{constructor(e,i,s,n){super(e,i,n),this.widget=s}isWidget(){return!0}get isHidden(){return this.widget.isHidden}covers(e){return this.flags&48?!1:(this.flags&(e<0?64:128))>0}coordsIn(e,i){return this.coordsInWidget(e,i,!1)}coordsInWidget(e,i,s){let n=this.widget.coordsAt(this.dom,e,i);if(n)return n;if(s)return xr(this.dom.getBoundingClientRect(),this.length?e==0:i<=0);{let r=this.dom.getClientRects(),o=null;if(!r.length)return null;let a=this.flags&16?!0:this.flags&32?!1:e>0;for(let l=a?r.length-1:0;o=r[l],!(e>0?l==0:l==r.length-1||o.top<o.bottom);l+=a?-1:1);return xr(o,!a)}}get overrideDOMText(){if(!this.length)return K.empty;let{root:e}=this;if(!e)return K.empty;let i=this.posAtStart;return e.view.state.doc.slice(i,i+this.length)}destroy(){super.destroy(),this.widget.destroy(this.dom)}static of(e,i,s,n,r){return r||(r=e.toDOM(i),e.editable||(r.contentEditable="false")),new Wi(r,s,e,n)}}class kr extends de{constructor(e){let i=document.createElement("img");i.className="cm-widgetBuffer",i.setAttribute("aria-hidden","true"),super(i,0,e)}get isHidden(){return!0}get overrideDOMText(){return K.empty}coordsIn(e){return this.dom.getBoundingClientRect()}}class Nm{constructor(e){this.index=0,this.beforeBreak=!1,this.parents=[],this.tile=e}advance(e,i,s){let{tile:n,index:r,beforeBreak:o,parents:a}=this;for(;e||i>0;)if(n.isComposite())if(o){if(!e)break;s&&s.break(),e--,o=!1}else if(r==n.children.length){if(!e&&!a.length)break;s&&s.leave(n),o=!!n.breakAfter,{tile:n,index:r}=a.pop(),r++}else{let l=n.children[r],c=l.breakAfter;(i>0?l.length<=e:l.length<e)&&(!s||s.skip(l,0,l.length)!==!1||!l.isComposite)?(o=!!c,r++,e-=l.length):(a.push({tile:n,index:r}),n=l,r=0,s&&l.isComposite()&&s.enter(l))}else if(r==n.length)o=!!n.breakAfter,{tile:n,index:r}=a.pop(),r++;else if(e){let l=Math.min(e,n.length-r);s&&s.skip(n,r,r+l),e-=l,r+=l}else break;return this.tile=n,this.index=r,this.beforeBreak=o,this}get root(){return this.parents.length?this.parents[0].tile:this.tile}}class zm{constructor(e,i,s,n){this.from=e,this.to=i,this.wrapper=s,this.rank=n}}class Hm{constructor(e,i,s){this.cache=e,this.root=i,this.blockWrappers=s,this.curLine=null,this.lastBlock=null,this.afterWidget=null,this.pos=0,this.wrappers=[],this.wrapperPos=0}addText(e,i,s,n){var r;this.flushBuffer();let o=this.ensureMarks(i,s),a=o.lastChild;if(a&&a.isText()&&!(a.flags&8)&&a.length+e.length<512){this.cache.reused.set(a,2);let l=o.children[o.children.length-1]=new Ti(a.dom,a.text+e);l.parent=o}else o.append(n||Ti.of(e,(r=this.cache.find(Ti))===null||r===void 0?void 0:r.dom));this.pos+=e.length,this.afterWidget=null}addComposition(e,i){let s=this.curLine;s.dom!=i.line.dom&&(s.setDOM(this.cache.reused.has(i.line)?Oo(i.line.dom):i.line.dom),this.cache.reused.set(i.line,2));let n=s;for(let a=i.marks.length-1;a>=0;a--){let l=i.marks[a],c=n.lastChild;if(c instanceof ze&&c.mark.eq(l.mark))c.dom!=l.dom&&c.setDOM(Oo(l.dom)),n=c;else{if(this.cache.reused.get(l)){let d=de.get(l.dom);d&&d.setDOM(Oo(l.dom))}let h=ze.of(l.mark,l.dom);n.append(h),n=h}this.cache.reused.set(l,2)}let r=de.get(e.text);r&&this.cache.reused.set(r,2);let o=new Ti(e.text,e.text.nodeValue);o.flags|=8,n.append(o)}addInlineWidget(e,i,s){let n=this.afterWidget&&e.flags&48&&(this.afterWidget.flags&48)==(e.flags&48);n||this.flushBuffer();let r=this.ensureMarks(i,s);!n&&!(e.flags&16)&&r.append(this.getBuffer(1)),r.append(e),this.pos+=e.length,this.afterWidget=e}addMark(e,i,s){this.flushBuffer(),this.ensureMarks(i,s).append(e),this.pos+=e.length,this.afterWidget=null}addBlockWidget(e){this.getBlockPos().append(e),this.pos+=e.length,this.lastBlock=e,this.endLine()}continueWidget(e){let i=this.afterWidget||this.lastBlock;i.length+=e,this.pos+=e}addLineStart(e,i){var s;e||(e=wf);let n=gs.start(e,i||((s=this.cache.find(gs))===null||s===void 0?void 0:s.dom),!!i);this.getBlockPos().append(this.lastBlock=this.curLine=n)}addLine(e){this.getBlockPos().append(e),this.pos+=e.length,this.lastBlock=e,this.endLine()}addBreak(){this.lastBlock.flags|=1,this.endLine(),this.pos++}addLineStartIfNotCovered(e){this.blockPosCovered()||this.addLineStart(e)}ensureLine(e){this.curLine||this.addLineStart(e)}ensureMarks(e,i){var s;let n=this.curLine;for(let r=e.length-1;r>=0;r--){let o=e[r],a;if(i>0&&(a=n.lastChild)&&a instanceof ze&&a.mark.eq(o))n=a,i--;else{let l=ze.of(o,(s=this.cache.find(ze,c=>c.mark.eq(o)))===null||s===void 0?void 0:s.dom);n.append(l),n=l,i=0}}return n}endLine(){if(this.curLine){this.flushBuffer();let e=this.curLine.lastChild;(!e||!Dc(this.curLine,!1)||e.dom.nodeName!="BR"&&e.isWidget()&&!(E.ios&&Dc(this.curLine,!0)))&&this.curLine.append(this.cache.findWidget(Ao,0,32)||new Wi(Ao.toDOM(),0,Ao,32)),this.curLine=this.afterWidget=null}}updateBlockWrappers(){this.wrapperPos>this.pos+1e4&&(this.blockWrappers.goto(this.pos),this.wrappers.length=0);for(let e=this.wrappers.length-1;e>=0;e--)this.wrappers[e].to<this.pos&&this.wrappers.splice(e,1);for(let e=this.blockWrappers;e.value&&e.from<=this.pos;e.next())if(e.to>=this.pos){let i=new zm(e.from,e.to,e.value,e.rank),s=this.wrappers.length;for(;s>0&&(this.wrappers[s-1].rank-i.rank||this.wrappers[s-1].to-i.to)<0;)s--;this.wrappers.splice(s,0,i)}this.wrapperPos=this.pos}getBlockPos(){var e;this.updateBlockWrappers();let i=this.root;for(let s of this.wrappers){let n=i.lastChild;if(s.from<this.pos&&n instanceof Ut&&n.wrapper.eq(s.wrapper))i=n;else{let r=Ut.of(s.wrapper,(e=this.cache.find(Ut,o=>o.wrapper.eq(s.wrapper)))===null||e===void 0?void 0:e.dom);i.append(r),i=r}}return i}blockPosCovered(){let e=this.lastBlock;return e!=null&&!e.breakAfter&&(!e.isWidget()||(e.flags&160)>0)}getBuffer(e){let i=2|(e<0?16:32),s=this.cache.find(kr,void 0,1);return s&&(s.flags=i),s||new kr(i)}flushBuffer(){this.afterWidget&&!(this.afterWidget.flags&32)&&(this.afterWidget.parent.append(this.getBuffer(-1)),this.afterWidget=null)}}class Wm{constructor(e){this.skipCount=0,this.text="",this.textOff=0,this.cursor=e.iter()}skip(e){this.textOff+e<=this.text.length?this.textOff+=e:(this.skipCount+=e-(this.text.length-this.textOff),this.text="",this.textOff=0)}next(e){if(this.textOff==this.text.length){let{value:n,lineBreak:r,done:o}=this.cursor.next(this.skipCount);if(this.skipCount=0,o)throw new Error("Ran out of text content when drawing inline views");this.text=n;let a=this.textOff=Math.min(e,n.length);return r?null:n.slice(0,a)}let i=Math.min(this.text.length,this.textOff+e),s=this.text.slice(this.textOff,i);return this.textOff=i,s}}const Sr=[Wi,gs,Ti,ze,kr,Ut,eo];for(let t=0;t<Sr.length;t++)Sr[t].bucket=t;class Um{constructor(e){this.view=e,this.buckets=Sr.map(()=>[]),this.index=Sr.map(()=>0),this.reused=new Map}add(e){let i=e.constructor.bucket,s=this.buckets[i];s.length<6?s.push(e):s[this.index[i]=(this.index[i]+1)%6]=e}find(e,i,s=2){let n=e.bucket,r=this.buckets[n],o=this.index[n];for(let a=r.length-1;a>=0;a--){let l=(a+o)%r.length,c=r[l];if((!i||i(c))&&!this.reused.has(c))return r.splice(l,1),l<o&&this.index[n]--,this.reused.set(c,s),c}return null}findWidget(e,i,s){let n=this.buckets[0];if(n.length)for(let r=0,o=0;;r++){if(r==n.length){if(o)return null;o=1,r=0}let a=n[r];if(!this.reused.has(a)&&(o==0?a.widget.compare(e):a.widget.constructor==e.constructor&&e.updateDOM(a.dom,this.view,a.widget)))return n.splice(r,1),r<this.index[0]&&this.index[0]--,a.widget==e&&a.length==i&&(a.flags&497)==s?(this.reused.set(a,1),a):(this.reused.set(a,2),new Wi(a.dom,i,e,a.flags&-498|s))}}reuse(e){return this.reused.set(e,1),e}maybeReuse(e,i=2){if(!this.reused.has(e))return this.reused.set(e,i),e.dom}clear(){for(let e=0;e<this.buckets.length;e++)this.buckets[e].length=this.index[e]=0}}class qm{constructor(e,i,s,n,r){this.view=e,this.decorations=n,this.disallowBlockEffectsFor=r,this.openWidget=!1,this.openMarks=0,this.cache=new Um(e),this.text=new Wm(e.state.doc),this.builder=new Hm(this.cache,new eo(e,e.contentDOM),q.iter(s)),this.cache.reused.set(i,2),this.old=new Nm(i),this.reuseWalker={skip:(o,a,l)=>{if(this.cache.add(o),o.isComposite())return!1},enter:o=>this.cache.add(o),leave:()=>{},break:()=>{}}}run(e,i){let s=i&&this.getCompositionContext(i.text);for(let n=0,r=0,o=0;;){let a=o<e.length?e[o++]:null,l=a?a.fromA:this.old.root.length;if(l>n){let c=l-n;this.preserve(c,!o,!a),n=l,r+=c}if(!a)break;i&&a.fromA<=i.range.fromA&&a.toA>=i.range.toA?(this.forward(a.fromA,i.range.fromA,i.range.fromA<i.range.toA?1:-1),this.emit(r,i.range.fromB),this.cache.clear(),this.builder.addComposition(i,s),this.text.skip(i.range.toB-i.range.fromB),this.forward(i.range.fromA,a.toA),this.emit(i.range.toB,a.toB)):(this.forward(a.fromA,a.toA),this.emit(r,a.toB)),r=a.toB,n=a.toA}return this.builder.curLine&&this.builder.endLine(),this.builder.root}preserve(e,i,s){let n=jm(this.old),r=this.openMarks;this.old.advance(e,s?1:-1,{skip:(o,a,l)=>{if(o.isWidget())if(this.openWidget)this.builder.continueWidget(l-a);else{let c=l>0||a<o.length?Wi.of(o.widget,this.view,l-a,o.flags&496,this.cache.maybeReuse(o)):this.cache.reuse(o);c.flags&256?(c.flags&=-2,this.builder.addBlockWidget(c)):(this.builder.ensureLine(null),this.builder.addInlineWidget(c,n,r),r=n.length)}else if(o.isText())this.builder.ensureLine(null),!a&&l==o.length&&!this.cache.reused.has(o)?this.builder.addText(o.text,n,r,this.cache.reuse(o)):(this.cache.add(o),this.builder.addText(o.text.slice(a,l),n,r)),r=n.length;else if(o.isLine())o.flags&=-2,this.cache.reused.set(o,1),this.builder.addLine(o);else if(o instanceof kr)this.cache.add(o);else if(o instanceof ze)this.builder.ensureLine(null),this.builder.addMark(o,n,r),this.cache.reused.set(o,1),r=n.length;else return!1;this.openWidget=!1},enter:o=>{o.isLine()?this.builder.addLineStart(o.attrs,this.cache.maybeReuse(o)):(this.cache.add(o),o instanceof ze&&n.unshift(o.mark)),this.openWidget=!1},leave:o=>{o.isLine()?n.length&&(n.length=r=0):o instanceof ze&&(n.shift(),r=Math.min(r,n.length))},break:()=>{this.builder.addBreak(),this.openWidget=!1}}),this.text.skip(e)}emit(e,i){let s=null,n=this.builder,r=0,o=q.spans(this.decorations,e,i,{point:(a,l,c,h,d,f)=>{if(c instanceof zi){if(this.disallowBlockEffectsFor[f]){if(c.block)throw new RangeError("Block decorations may not be specified via plugins");if(l>this.view.state.doc.lineAt(a).to)throw new RangeError("Decorations that replace line breaks may not be specified via plugins")}if(r=h.length,d>h.length)n.continueWidget(l-a);else{let u=c.widget||(c.block?ms.block:ms.inline),p=Vm(c),m=this.cache.findWidget(u,l-a,p)||Wi.of(u,this.view,l-a,p);c.block?(c.startSide>0&&n.addLineStartIfNotCovered(s),n.addBlockWidget(m)):(n.ensureLine(s),n.addInlineWidget(m,h,d))}s=null}else s=Qm(s,c);l>a&&this.text.skip(l-a)},span:(a,l,c,h)=>{for(let d=a;d<l;){let f=this.text.next(Math.min(512,l-d));f==null?(n.addLineStartIfNotCovered(s),n.addBreak(),d++):(n.ensureLine(s),n.addText(f,c,d==a?h:c.length),d+=f.length),s=null}}});n.addLineStartIfNotCovered(s),this.openWidget=o>r,this.openMarks=o}forward(e,i,s=1){i-e<=10?this.old.advance(i-e,s,this.reuseWalker):(this.old.advance(5,-1,this.reuseWalker),this.old.advance(i-e-10,-1),this.old.advance(5,s,this.reuseWalker))}getCompositionContext(e){let i=[],s=null;for(let n=e.parentNode;;n=n.parentNode){let r=de.get(n);if(n==this.view.contentDOM)break;r instanceof ze?i.push(r):r!=null&&r.isLine()?s=r:r instanceof Ut||(n.nodeName=="DIV"&&!s&&n!=this.view.contentDOM?s=new gs(n,wf):s||i.push(ze.of(new kn({tagName:n.nodeName.toLowerCase(),attributes:ym(n)}),n)))}return{line:s,marks:i}}}function Dc(t,e){let i=s=>{for(let n of s.children)if((e?n.isText():n.length)||i(n))return!0;return!1};return i(t)}function Vm(t){let e=t.isReplace?(t.startSide<0?64:0)|(t.endSide>0?128:0):t.startSide>0?32:16;return t.block&&(e|=256),e}const wf={class:"cm-line"};function Qm(t,e){let i=e.spec.attributes,s=e.spec.class;return!i&&!s||(t||(t={class:"cm-line"}),i&&ul(i,t),s&&(t.class+=" "+s)),t}function jm(t){let e=[];for(let i=t.parents.length;i>1;i--){let s=i==t.parents.length?t.tile:t.parents[i].tile;s instanceof ze&&e.push(s.mark)}return e}function Oo(t){let e=de.get(t);return e&&e.setDOM(t.cloneNode()),t}class ms extends Jt{constructor(e){super(),this.tag=e}eq(e){return e.tag==this.tag}toDOM(){return document.createElement(this.tag)}updateDOM(e){return e.nodeName.toLowerCase()==this.tag}get isHidden(){return!0}}ms.inline=new ms("span");ms.block=new ms("div");const Ao=new class extends Jt{toDOM(){return document.createElement("br")}get isHidden(){return!0}get editable(){return!0}};class _c{constructor(e){this.view=e,this.decorations=[],this.blockWrappers=[],this.dynamicDecorationMap=[!1],this.domChanged=null,this.hasComposition=null,this.editContextFormatting=N.none,this.lastCompositionAfterCursor=!1,this.minWidth=0,this.minWidthFrom=0,this.minWidthTo=0,this.impreciseAnchor=null,this.impreciseHead=null,this.forceSelection=!1,this.lastUpdate=Date.now(),this.updateDeco(),this.tile=new eo(e,e.contentDOM),this.updateInner([new tt(0,0,0,e.state.doc.length)],null)}update(e){var i;let s=e.changedRanges;this.minWidth>0&&s.length&&(s.every(({fromA:h,toA:d})=>d<this.minWidthFrom||h>this.minWidthTo)?(this.minWidthFrom=e.changes.mapPos(this.minWidthFrom,1),this.minWidthTo=e.changes.mapPos(this.minWidthTo,1)):this.minWidth=this.minWidthFrom=this.minWidthTo=0),this.updateEditContextFormatting(e);let n=-1;this.view.inputState.composing>=0&&!this.view.observer.editContext&&(!((i=this.domChanged)===null||i===void 0)&&i.newSel?n=this.domChanged.newSel.head:!ib(e.changes,this.hasComposition)&&!e.selectionSet&&(n=e.state.selection.main.head));let r=n>-1?Xm(this.view,e.changes,n):null;if(this.domChanged=null,this.hasComposition){let{from:h,to:d}=this.hasComposition;s=new tt(h,d,e.changes.mapPos(h,-1),e.changes.mapPos(d,1)).addToSet(s.slice())}this.hasComposition=r?{from:r.range.fromB,to:r.range.toB}:null,(E.ie||E.chrome)&&!r&&e&&e.state.doc.lines!=e.startState.doc.lines&&(this.forceSelection=!0);let o=this.decorations,a=this.blockWrappers;this.updateDeco();let l=Gm(o,this.decorations,e.changes);l.length&&(s=tt.extendWithRanges(s,l));let c=eb(a,this.blockWrappers,e.changes);return c.length&&(s=tt.extendWithRanges(s,c)),r&&!s.some(h=>h.fromA<=r.range.fromA&&h.toA>=r.range.toA)&&(s=r.range.addToSet(s.slice())),this.tile.flags&2&&s.length==0?!1:(this.updateInner(s,r),e.transactions.length&&(this.lastUpdate=Date.now()),!0)}updateInner(e,i){this.view.viewState.mustMeasureContent=!0;let{observer:s}=this.view;s.ignore(()=>{if(i||e.length){let o=this.tile,a=new qm(this.view,o,this.blockWrappers,this.decorations,this.dynamicDecorationMap);i&&de.get(i.text)&&a.cache.reused.set(de.get(i.text),2),this.tile=a.run(e,i),Aa(o,a.cache.reused)}this.tile.dom.style.height=this.view.viewState.contentHeight/this.view.scaleY+"px",this.tile.dom.style.flexBasis=this.minWidth?this.minWidth+"px":"";let r=E.chrome||E.ios?{node:s.selectionRange.focusNode,written:!1}:void 0;this.tile.sync(r),r&&(r.written||s.selectionRange.focusNode!=r.node||!this.tile.dom.contains(r.node))&&(this.forceSelection=!0),this.tile.dom.style.height=""});let n=[];if(this.view.viewport.from||this.view.viewport.to<this.view.state.doc.length)for(let r of this.tile.children)r.isWidget()&&r.widget instanceof $o&&n.push(r.dom);s.updateGaps(n)}updateEditContextFormatting(e){this.editContextFormatting=this.editContextFormatting.map(e.changes);for(let i of e.transactions)for(let s of i.effects)s.is(mf)&&(this.editContextFormatting=s.value)}updateSelection(e=!1,i=!1){(e||!this.view.observer.selectionRange.focusNode)&&this.view.observer.readSelectionRange();let{dom:s}=this.tile,n=this.view.root.activeElement,r=n==s,o=!r&&!(this.view.state.facet(Ht)||s.tabIndex>-1)&&qs(s,this.view.observer.selectionRange)&&!(n&&s.contains(n));if(!(r||i||o))return;let a=this.forceSelection;this.forceSelection=!1;let l=this.view.state.selection.main,c,h;if(l.empty?h=c=this.inlineDOMNearPos(l.anchor,l.assoc||1):(h=this.inlineDOMNearPos(l.head,l.head==l.from?1:-1),c=this.inlineDOMNearPos(l.anchor,l.anchor==l.from?1:-1)),E.gecko&&l.empty&&!this.hasComposition&&Km(c)){let f=document.createTextNode("");this.view.observer.ignore(()=>c.node.insertBefore(f,c.node.childNodes[c.offset]||null)),c=h=new ct(f,0),a=!0}let d=this.view.observer.selectionRange;(a||!d.focusNode||(!Vs(c.node,c.offset,d.anchorNode,d.anchorOffset)||!Vs(h.node,h.offset,d.focusNode,d.focusOffset))&&!this.suppressWidgetCursorChange(d,l))&&(this.view.observer.ignore(()=>{E.android&&E.chrome&&s.contains(d.focusNode)&&tb(d.focusNode,s)&&(s.blur(),s.focus({preventScroll:!0}));let f=on(this.view.root);if(f)if(l.empty){if(E.gecko){let u=Jm(c.node,c.offset);if(u&&u!=3){let p=(u==1?Zd:ef)(c.node,c.offset);p&&(c=new ct(p.node,p.offset))}}f.collapse(c.node,c.offset),l.bidiLevel!=null&&f.caretBidiLevel!==void 0&&(f.caretBidiLevel=l.bidiLevel)}else if(f.extend){f.collapse(c.node,c.offset);try{f.extend(h.node,h.offset)}catch{}}else{let u=document.createRange();l.anchor>l.head&&([c,h]=[h,c]),u.setEnd(h.node,h.offset),u.setStart(c.node,c.offset),f.removeAllRanges(),f.addRange(u)}o&&this.view.root.activeElement==s&&(s.blur(),n&&n.focus())}),this.view.observer.setSelectionRange(c,h)),this.impreciseAnchor=c.precise?null:new ct(d.anchorNode,d.anchorOffset),this.impreciseHead=h.precise?null:new ct(d.focusNode,d.focusOffset)}suppressWidgetCursorChange(e,i){return this.hasComposition&&i.empty&&Vs(e.focusNode,e.focusOffset,e.anchorNode,e.anchorOffset)&&this.posFromDOM(e.focusNode,e.focusOffset)==i.head}enforceCursorAssoc(){if(this.hasComposition)return;let{view:e}=this,i=e.state.selection.main,s=on(e.root),{anchorNode:n,anchorOffset:r}=e.observer.selectionRange;if(!s||!i.empty||!i.assoc||!s.modify)return;let o=this.lineAt(i.head,i.assoc);if(!o)return;let a=o.posAtStart;if(i.head==a||i.head==a+o.length)return;let l=this.coordsAt(i.head,-1),c=this.coordsAt(i.head,1);if(!l||!c||l.bottom>c.top)return;let h=this.domAtPos(i.head+i.assoc,i.assoc);s.collapse(h.node,h.offset),s.modify("move",i.assoc<0?"forward":"backward","lineboundary"),e.observer.readSelectionRange();let d=e.observer.selectionRange;e.docView.posFromDOM(d.anchorNode,d.anchorOffset)!=i.from&&s.collapse(n,r)}posFromDOM(e,i){let s=this.tile.nearest(e);if(!s)return this.tile.dom.compareDocumentPosition(e)&2?0:this.view.state.doc.length;let n=s.posAtStart;if(s.isComposite()){let r;if(e==s.dom)r=s.dom.childNodes[i];else{let o=Vt(e)==0?0:i==0?-1:1;for(;;){let a=e.parentNode;if(a==s.dom)break;o==0&&a.firstChild!=a.lastChild&&(e==a.firstChild?o=-1:o=1),e=a}o<0?r=e:r=e.nextSibling}if(r==s.dom.firstChild)return n;for(;r&&!de.get(r);)r=r.nextSibling;if(!r)return n+s.length;for(let o=0,a=n;;o++){let l=s.children[o];if(l.dom==r)return a;a+=l.length+l.breakAfter}}else return s.isText()?e==s.dom?n+i:n+(i?s.length:0):n}domAtPos(e,i){let{tile:s,offset:n}=this.tile.resolveBlock(e,i);return s.isWidget()?s.domPosFor(e,i):s.domIn(n,i)}inlineDOMNearPos(e,i){let s,n=-1,r=!1,o,a=-1,l=!1;return this.tile.blockTiles((c,h)=>{if(c.isWidget()){if(c.flags&32&&h>=e)return!0;c.flags&16&&(r=!0)}else{let d=h+c.length;if(h<=e&&(s=c,n=e-h,r=d<e),d>=e&&!o&&(o=c,a=e-h,l=h>e),h>e&&o)return!0}}),!s&&!o?this.domAtPos(e,i):(r&&o?s=null:l&&s&&(o=null),s&&i<0||!o?s.domIn(n,i):o.domIn(a,i))}coordsAt(e,i){let{tile:s,offset:n}=this.tile.resolveBlock(e,i);return s.isWidget()?s.widget instanceof $o?null:s.coordsInWidget(n,i,!0):s.coordsIn(n,i)}lineAt(e,i){let{tile:s}=this.tile.resolveBlock(e,i);return s.isLine()?s:null}coordsForChar(e){let{tile:i,offset:s}=this.tile.resolveBlock(e,1);if(!i.isLine())return null;function n(r,o){if(r.isComposite())for(let a of r.children){if(a.length>=o){let l=n(a,o);if(l)return l}if(o-=a.length,o<0)break}else if(r.isText()&&o<r.length){let a=xe(r.text,o);if(a==o)return null;let l=an(r.dom,o,a).getClientRects();for(let c=0;c<l.length;c++){let h=l[c];if(c==l.length-1||h.top<h.bottom&&h.left<h.right)return h}}return null}return n(i,s)}measureVisibleLineHeights(e){let i=[],{from:s,to:n}=e,r=this.view.contentDOM.clientWidth,o=r>Math.max(this.view.scrollDOM.clientWidth,this.minWidth)+1,a=-1,l=this.view.textDirection==ee.LTR,c=0,h=(d,f,u)=>{for(let p=0;p<d.children.length&&!(f>n);p++){let m=d.children[p],b=f+m.length,x=m.dom.getBoundingClientRect(),{height:k}=x;if(u&&!p&&(c+=x.top-u.top),m instanceof Ut)b>s&&h(m,f,x);else if(f>=s&&(c>0&&i.push(-c),i.push(k+c),c=0,o)){let O=m.dom.lastChild,R=O?nr(O):[];if(R.length){let A=R[R.length-1],$=l?A.right-x.left:x.right-A.left;$>a&&(a=$,this.minWidth=r,this.minWidthFrom=f,this.minWidthTo=b)}}u&&p==d.children.length-1&&(c+=u.bottom-x.bottom),f=b+m.breakAfter}};return h(this.tile,0,null),i}textDirectionAt(e){let{tile:i}=this.tile.resolveBlock(e,1);return getComputedStyle(i.dom).direction=="rtl"?ee.RTL:ee.LTR}measureTextSize(){let e=this.tile.blockTiles(o=>{if(o.isLine()&&o.children.length&&o.length<=20){let a=0,l;for(let c of o.children){if(!c.isText()||/[^ -~]/.test(c.text))return;let h=nr(c.dom);if(h.length!=1)return;a+=h[0].width,l=h[0].height}if(a)return{lineHeight:o.dom.getBoundingClientRect().height,charWidth:a/o.length,textHeight:l}}});if(e)return e;let i=document.createElement("div"),s,n,r;return i.className="cm-line",i.style.width="99999px",i.style.position="absolute",i.textContent="abc def ghi jkl mno pqr stu",this.view.observer.ignore(()=>{this.tile.dom.appendChild(i);let o=nr(i.firstChild)[0];s=i.getBoundingClientRect().height,n=o&&o.width?o.width/27:7,r=o&&o.height?o.height:s,i.remove()}),{lineHeight:s,charWidth:n,textHeight:r}}computeBlockGapDeco(){let e=[],i=this.view.viewState;for(let s=0,n=0;;n++){let r=n==i.viewports.length?null:i.viewports[n],o=r?r.from-1:this.view.state.doc.length;if(o>s){let a=(i.lineBlockAt(o).bottom-i.lineBlockAt(s).top)/this.view.scaleY;e.push(N.replace({widget:new $o(a),block:!0,inclusive:!0,isBlockGap:!0}).range(s,o))}if(!r)break;s=r.to+1}return N.set(e)}updateDeco(){let e=1,i=this.view.state.facet(Gr).map(r=>(this.dynamicDecorationMap[e++]=typeof r=="function")?r(this.view):r),s=!1,n=this.view.state.facet(yl).map((r,o)=>{let a=typeof r=="function";return a&&(s=!0),a?r(this.view):r});for(n.length&&(this.dynamicDecorationMap[e++]=s,i.push(q.join(n))),this.decorations=[this.editContextFormatting,...i,this.computeBlockGapDeco(),this.view.viewState.lineGapDeco];e<this.decorations.length;)this.dynamicDecorationMap[e++]=!1;this.blockWrappers=this.view.state.facet(vf).map(r=>typeof r=="function"?r(this.view):r)}scrollIntoView(e){var i;if(e.isSnapshot){let h=this.view.viewState.lineBlockAt(e.range.head);this.view.scrollDOM.scrollTop=h.top-e.yMargin,this.view.scrollDOM.scrollLeft=e.xMargin;return}for(let h of this.view.state.facet(gf))try{if(h(this.view,e.range,e))return!0}catch(d){He(this.view.state,d,"scroll handler")}let{range:s}=e,n=this.coordsAt(s.head,(i=s.assoc)!==null&&i!==void 0?i:s.empty?0:s.head>s.anchor?-1:1),r;if(!n)return;!s.empty&&(r=this.coordsAt(s.anchor,s.anchor>s.head?-1:1))&&(n={left:Math.min(n.left,r.left),top:Math.min(n.top,r.top),right:Math.max(n.right,r.right),bottom:Math.max(n.bottom,r.bottom)});let o=xl(this.view),a={left:n.left-o.left,top:n.top-o.top,right:n.right+o.right,bottom:n.bottom+o.bottom},{offsetWidth:l,offsetHeight:c}=this.view.scrollDOM;if(km(this.view.scrollDOM,a,s.head<s.anchor?-1:1,e.x,e.y,Math.max(Math.min(e.xMargin,l),-l),Math.max(Math.min(e.yMargin,c),-c),this.view.textDirection==ee.LTR),window.visualViewport&&window.innerHeight-window.visualViewport.height>1&&(n.top>window.pageYOffset+window.visualViewport.offsetTop+window.visualViewport.height||n.bottom<window.pageYOffset+window.visualViewport.offsetTop)){let h=this.view.docView.lineAt(s.head,1);h&&h.dom.scrollIntoView({block:"nearest"})}}lineHasWidget(e){let i=s=>s.isWidget()||s.children.some(i);return i(this.tile.resolveBlock(e,1).tile)}destroy(){Aa(this.tile)}}function Aa(t,e){let i=e==null?void 0:e.get(t);if(i!=1){i==null&&t.destroy();for(let s of t.children)Aa(s,e)}}function Km(t){return t.node.nodeType==1&&t.node.firstChild&&(t.offset==0||t.node.childNodes[t.offset-1].contentEditable=="false")&&(t.offset==t.node.childNodes.length||t.node.childNodes[t.offset].contentEditable=="false")}function kf(t,e){let i=t.observer.selectionRange;if(!i.focusNode)return null;let s=Zd(i.focusNode,i.focusOffset),n=ef(i.focusNode,i.focusOffset),r=s||n;if(n&&s&&n.node!=s.node){let a=de.get(n.node);if(!a||a.isText()&&a.text!=n.node.nodeValue)r=n;else if(t.docView.lastCompositionAfterCursor){let l=de.get(s.node);!l||l.isText()&&l.text!=s.node.nodeValue||(r=n)}}if(t.docView.lastCompositionAfterCursor=r!=s,!r)return null;let o=e-r.offset;return{from:o,to:o+r.node.nodeValue.length,node:r.node}}function Xm(t,e,i){let s=kf(t,i);if(!s)return null;let{node:n,from:r,to:o}=s,a=n.nodeValue;if(/[\n\r]/.test(a)||t.state.doc.sliceString(s.from,s.to)!=a)return null;let l=e.invertedDesc;return{range:new tt(l.mapPos(r),l.mapPos(o),r,o),text:n}}function Jm(t,e){return t.nodeType!=1?0:(e&&t.childNodes[e-1].contentEditable=="false"?1:0)|(e<t.childNodes.length&&t.childNodes[e].contentEditable=="false"?2:0)}let Ym=class{constructor(){this.changes=[]}compareRange(e,i){rs(e,i,this.changes)}comparePoint(e,i){rs(e,i,this.changes)}boundChange(e){rs(e,e,this.changes)}};function Gm(t,e,i){let s=new Ym;return q.compare(t,e,i,s),s.changes}class Zm{constructor(){this.changes=[]}compareRange(e,i){rs(e,i,this.changes)}comparePoint(){}boundChange(e){rs(e,e,this.changes)}}function eb(t,e,i){let s=new Zm;return q.compare(t,e,i,s),s.changes}function tb(t,e){for(let i=t;i&&i!=e;i=i.assignedSlot||i.parentNode)if(i.nodeType==1&&i.contentEditable=="false")return!0;return!1}function ib(t,e){let i=!1;return e&&t.iterChangedRanges((s,n)=>{s<e.to&&n>e.from&&(i=!0)}),i}class $o extends Jt{constructor(e){super(),this.height=e}toDOM(){let e=document.createElement("div");return e.className="cm-gap",this.updateDOM(e),e}eq(e){return e.height==this.height}updateDOM(e){return e.style.height=this.height+"px",!0}get editable(){return!0}get estimatedHeight(){return this.height}ignoreEvent(){return!1}}function sb(t,e,i=1){let s=t.charCategorizer(e),n=t.doc.lineAt(e),r=e-n.from;if(n.length==0)return S.cursor(e);r==0?i=1:r==n.length&&(i=-1);let o=r,a=r;i<0?o=xe(n.text,r,!1):a=xe(n.text,r);let l=s(n.text.slice(o,a));for(;o>0;){let c=xe(n.text,o,!1);if(s(n.text.slice(c,o))!=l)break;o=c}for(;a<n.length;){let c=xe(n.text,a);if(s(n.text.slice(a,c))!=l)break;a=c}return S.range(o+n.from,a+n.from)}function nb(t,e,i,s,n){let r=Math.round((s-e.left)*t.defaultCharacterWidth);if(t.lineWrapping&&i.height>t.defaultLineHeight*1.5){let a=t.viewState.heightOracle.textHeight,l=Math.floor((n-i.top-(t.defaultLineHeight-a)*.5)/a);r+=l*t.viewState.heightOracle.lineLength}let o=t.state.sliceDoc(i.from,i.to);return i.from+pa(o,r,t.state.tabSize)}function $a(t,e,i){let s=t.lineBlockAt(e);if(Array.isArray(s.type)){let n;for(let r of s.type){if(r.from>e)break;if(!(r.to<e)){if(r.from<e&&r.to>e)return r;(!n||r.type==Ae.Text&&(n.type!=r.type||(i<0?r.from<e:r.to>e)))&&(n=r)}}return n||s}return s}function rb(t,e,i,s){let n=$a(t,e.head,e.assoc||-1),r=!s||n.type!=Ae.Text||!(t.lineWrapping||n.widgetLineBreaks)?null:t.coordsAtPos(e.assoc<0&&e.head>n.from?e.head-1:e.head);if(r){let o=t.dom.getBoundingClientRect(),a=t.textDirectionAt(n.from),l=t.posAtCoords({x:i==(a==ee.LTR)?o.right-1:o.left+1,y:(r.top+r.bottom)/2});if(l!=null)return S.cursor(l,i?-1:1)}return S.cursor(i?n.to:n.from,i?-1:1)}function Bc(t,e,i,s){let n=t.state.doc.lineAt(e.head),r=t.bidiSpans(n),o=t.textDirectionAt(n.from);for(let a=e,l=null;;){let c=_m(n,r,o,a,i),h=of;if(!c){if(n.number==(i?t.state.doc.lines:1))return a;h=`
`,n=t.state.doc.line(n.number+(i?1:-1)),r=t.bidiSpans(n),c=t.visualLineSide(n,!i)}if(l){if(!l(h))return a}else{if(!s)return c;l=s(h)}a=c}}function ob(t,e,i){let s=t.state.charCategorizer(e),n=s(i);return r=>{let o=s(r);return n==oe.Space&&(n=o),n==o}}function ab(t,e,i,s){let n=e.head,r=i?1:-1;if(n==(i?t.state.doc.length:0))return S.cursor(n,e.assoc);let o=e.goalColumn,a,l=t.contentDOM.getBoundingClientRect(),c=t.coordsAtPos(n,e.assoc||((e.empty?i:e.head==e.from)?1:-1)),h=t.documentTop;if(c)o==null&&(o=c.left-l.left),a=r<0?c.top:c.bottom;else{let p=t.viewState.lineBlockAt(n);o==null&&(o=Math.min(l.right-l.left,t.defaultCharacterWidth*(n-p.from))),a=(r<0?p.top:p.bottom)+h}let d=l.left+o,f=t.viewState.heightOracle.textHeight>>1,u=s??f;for(let p=0;;p+=f){let m=a+(u+p)*r,b=Pa(t,{x:d,y:m},!1,r);if(i?m>l.bottom:m<l.top)return S.cursor(b.pos,b.assoc);let x=t.coordsAtPos(b.pos,b.assoc),k=x?(x.top+x.bottom)/2:0;if(!x||(i?k>a:k<a))return S.cursor(b.pos,b.assoc,void 0,o)}}function Qs(t,e,i){for(;;){let s=0;for(let n of t)n.between(e-1,e+1,(r,o,a)=>{if(e>r&&e<o){let l=s||i||(e-r<o-e?-1:1);e=l<0?r:o,s=l}});if(!s)return e}}function Sf(t,e){let i=null;for(let s=0;s<e.ranges.length;s++){let n=e.ranges[s],r=null;if(n.empty){let o=Qs(t,n.from,0);o!=n.from&&(r=S.cursor(o,-1))}else{let o=Qs(t,n.from,-1),a=Qs(t,n.to,1);(o!=n.from||a!=n.to)&&(r=S.range(n.from==n.anchor?o:a,n.from==n.head?o:a))}r&&(i||(i=e.ranges.slice()),i[s]=r)}return i?S.create(i,e.mainIndex):e}function Po(t,e,i){let s=Qs(t.state.facet(Cn).map(n=>n(t)),i.from,e.head>i.from?-1:1);return s==i.from?i:S.cursor(s,s<i.from?1:-1)}class At{constructor(e,i){this.pos=e,this.assoc=i}}function Pa(t,e,i,s){let n=t.contentDOM.getBoundingClientRect(),r=n.top+t.viewState.paddingTop,{x:o,y:a}=e,l=a-r,c;for(;;){if(l<0)return new At(0,1);if(l>t.viewState.docHeight)return new At(t.state.doc.length,-1);if(c=t.elementAtHeight(l),s==null)break;if(c.type==Ae.Text){if(s<0?c.to<t.viewport.from:c.from>t.viewport.to)break;let f=t.docView.coordsAt(s<0?c.from:c.to,s>0?-1:1);if(f&&(s<0?f.top<=l+r:f.bottom>=l+r))break}let d=t.viewState.heightOracle.textHeight/2;l=s>0?c.bottom+d:c.top-d}if(t.viewport.from>=c.to||t.viewport.to<=c.from){if(i)return null;if(c.type==Ae.Text){let d=nb(t,n,c,o,a);return new At(d,d==c.from?1:-1)}}if(c.type!=Ae.Text)return l<(c.top+c.bottom)/2?new At(c.from,1):new At(c.to,-1);let h=t.docView.lineAt(c.from,2);return(!h||h.length!=c.length)&&(h=t.docView.lineAt(c.from,-2)),new lb(t,o,a,t.textDirectionAt(c.from)).scanTile(h,c.from)}class lb{constructor(e,i,s,n){this.view=e,this.x=i,this.y=s,this.baseDir=n,this.line=null,this.spans=null}bidiSpansAt(e){return(!this.line||this.line.from>e||this.line.to<e)&&(this.line=this.view.state.doc.lineAt(e),this.spans=this.view.bidiSpans(this.line)),this}baseDirAt(e,i){let{line:s,spans:n}=this.bidiSpansAt(e);return n[$t.find(n,e-s.from,-1,i)].level==this.baseDir}dirAt(e,i){let{line:s,spans:n}=this.bidiSpansAt(e);return n[$t.find(n,e-s.from,-1,i)].dir}bidiIn(e,i){let{spans:s,line:n}=this.bidiSpansAt(e);return s.length>1||s.length&&(s[0].level!=this.baseDir||s[0].to+n.from<i)}scan(e,i){let s=0,n=e.length-1,r=new Set,o=this.bidiIn(e[0],e[n]),a,l,c=-1,h=1e9,d;e:for(;s<n;){let u=n-s,p=s+n>>1;t:if(r.has(p)){let b=s+Math.floor(Math.random()*u);for(let x=0;x<u;x++){if(!r.has(b)){p=b;break t}b++,b==n&&(b=s)}break e}r.add(p);let m=i(p);if(m)for(let b=0;b<m.length;b++){let x=m[b],k=0;if(!(x.width==0&&m.length>1)){if(x.bottom<this.y)(!a||a.bottom<x.bottom)&&(a=x),k=1;else if(x.top>this.y)(!l||l.top>x.top)&&(l=x),k=-1;else{let O=x.left>this.x?this.x-x.left:x.right<this.x?this.x-x.right:0,R=Math.abs(O);R<h&&(c=p,h=R,d=x),O&&(k=O<0==(this.baseDir==ee.LTR)?-1:1)}k==-1&&(!o||this.baseDirAt(e[p],1))?n=p:k==1&&(!o||this.baseDirAt(e[p+1],-1))&&(s=p+1)}}}if(!d){let u=a&&(!l||this.y-a.bottom<l.top-this.y)?a:l;return this.y=(u.top+u.bottom)/2,this.scan(e,i)}if(h){let{top:u,bottom:p}=d;if(a&&a.bottom>(u+u+p)/3)return this.y=a.bottom-1,this.scan(e,i);if(l&&l.top<(u+p+p)/3)return this.y=l.top+1,this.scan(e,i)}let f=(o?this.dirAt(e[c],1):this.baseDir)==ee.LTR;return{i:c,after:this.x>(d.left+d.right)/2==f}}scanText(e,i){let s=[];for(let r=0;r<e.length;r=xe(e.text,r))s.push(i+r);s.push(i+e.length);let n=this.scan(s,r=>{let o=s[r]-i,a=s[r+1]-i;return an(e.dom,o,a).getClientRects()});return n.after?new At(s[n.i+1],-1):new At(s[n.i],1)}scanTile(e,i){if(!e.length)return new At(i,1);if(e.children.length==1){let a=e.children[0];if(a.isText())return this.scanText(a,i);if(a.isComposite())return this.scanTile(a,i)}let s=[i];for(let a=0,l=i;a<e.children.length;a++)s.push(l+=e.children[a].length);let n=this.scan(s,a=>{let l=e.children[a];return l.flags&48?null:(l.dom.nodeType==1?l.dom:an(l.dom,0,l.length)).getClientRects()}),r=e.children[n.i],o=s[n.i];return r.isText()?this.scanText(r,o):r.isComposite()?this.scanTile(r,o):n.after?new At(s[n.i+1],-1):new At(o,1)}}const Ki="￿";class cb{constructor(e,i){this.points=e,this.view=i,this.text="",this.lineSeparator=i.state.facet(j.lineSeparator)}append(e){this.text+=e}lineBreak(){this.text+=Ki}readRange(e,i){if(!e)return this;let s=e.parentNode;for(let n=e;;){this.findPointBefore(s,n);let r=this.text.length;this.readNode(n);let o=de.get(n),a=n.nextSibling;if(a==i){o!=null&&o.breakAfter&&!a&&s!=this.view.contentDOM&&this.lineBreak();break}let l=de.get(a);(o&&l?o.breakAfter:(o?o.breakAfter:yr(n))||yr(a)&&(n.nodeName!="BR"||o!=null&&o.isWidget())&&this.text.length>r)&&!db(a,i)&&this.lineBreak(),n=a}return this.findPointBefore(s,i),this}readTextNode(e){let i=e.nodeValue;for(let s of this.points)s.node==e&&(s.pos=this.text.length+Math.min(s.offset,i.length));for(let s=0,n=this.lineSeparator?null:/\r\n?|\n/g;;){let r=-1,o=1,a;if(this.lineSeparator?(r=i.indexOf(this.lineSeparator,s),o=this.lineSeparator.length):(a=n.exec(i))&&(r=a.index,o=a[0].length),this.append(i.slice(s,r<0?i.length:r)),r<0)break;if(this.lineBreak(),o>1)for(let l of this.points)l.node==e&&l.pos>this.text.length&&(l.pos-=o-1);s=r+o}}readNode(e){let i=de.get(e),s=i&&i.overrideDOMText;if(s!=null){this.findPointInside(e,s.length);for(let n=s.iter();!n.next().done;)n.lineBreak?this.lineBreak():this.append(n.value)}else e.nodeType==3?this.readTextNode(e):e.nodeName=="BR"?e.nextSibling&&this.lineBreak():e.nodeType==1&&this.readRange(e.firstChild,null)}findPointBefore(e,i){for(let s of this.points)s.node==e&&e.childNodes[s.offset]==i&&(s.pos=this.text.length)}findPointInside(e,i){for(let s of this.points)(e.nodeType==3?s.node==e:e.contains(s.node))&&(s.pos=this.text.length+(hb(e,s.node,s.offset)?i:0))}}function hb(t,e,i){for(;;){if(!e||i<Vt(e))return!1;if(e==t)return!0;i=hi(e)+1,e=e.parentNode}}function db(t,e){let i;for(;!(t==e||!t);t=t.nextSibling){let s=de.get(t);if(!(s!=null&&s.isWidget()))return!1;s&&(i||(i=[])).push(s)}if(i)for(let s of i){let n=s.overrideDOMText;if(n!=null&&n.length)return!1}return!0}class Rc{constructor(e,i){this.node=e,this.offset=i,this.pos=-1}}class fb{constructor(e,i,s,n){this.typeOver=n,this.bounds=null,this.text="",this.domChanged=i>-1;let{impreciseHead:r,impreciseAnchor:o}=e.docView,a=e.state.selection;if(e.state.readOnly&&i>-1)this.newSel=null;else if(i>-1&&(this.bounds=Cf(e.docView.tile,i,s,0))){let l=r||o?[]:pb(e),c=new cb(l,e);c.readRange(this.bounds.startDOM,this.bounds.endDOM),this.text=c.text,this.newSel=gb(l,this.bounds.from)}else{let l=e.observer.selectionRange,c=r&&r.node==l.focusNode&&r.offset==l.focusOffset||!wa(e.contentDOM,l.focusNode)?a.main.head:e.docView.posFromDOM(l.focusNode,l.focusOffset),h=o&&o.node==l.anchorNode&&o.offset==l.anchorOffset||!wa(e.contentDOM,l.anchorNode)?a.main.anchor:e.docView.posFromDOM(l.anchorNode,l.anchorOffset),d=e.viewport;if((E.ios||E.chrome)&&a.main.empty&&c!=h&&(d.from>0||d.to<e.state.doc.length)){let f=Math.min(c,h),u=Math.max(c,h),p=d.from-f,m=d.to-u;(p==0||p==1||f==0)&&(m==0||m==-1||u==e.state.doc.length)&&(c=0,h=e.state.doc.length)}if(e.inputState.composing>-1&&a.ranges.length>1)this.newSel=a.replaceRange(S.range(h,c));else if(e.lineWrapping&&h==c&&!(a.main.empty&&a.main.head==c)&&e.inputState.lastTouchTime>Date.now()-100){let f=e.coordsAtPos(c,-1),u=0;f&&(u=e.inputState.lastTouchY<=f.bottom?-1:1),this.newSel=S.create([S.cursor(c,u)])}else this.newSel=S.single(h,c)}}}function Cf(t,e,i,s){if(t.isComposite()){let n=-1,r=-1,o=-1,a=-1;for(let l=0,c=s,h=s;l<t.children.length;l++){let d=t.children[l],f=c+d.length;if(c<e&&f>i)return Cf(d,e,i,c);if(f>=e&&n==-1&&(n=l,r=c),c>i&&d.dom.parentNode==t.dom){o=l,a=h;break}h=f,c=f+d.breakAfter}return{from:r,to:a<0?s+t.length:a,startDOM:(n?t.children[n-1].dom.nextSibling:null)||t.dom.firstChild,endDOM:o<t.children.length&&o>=0?t.children[o].dom:null}}else return t.isText()?{from:s,to:s+t.length,startDOM:t.dom,endDOM:t.dom.nextSibling}:null}function Of(t,e){let i,{newSel:s}=e,{state:n}=t,r=n.selection.main,o=t.inputState.lastKeyTime>Date.now()-100?t.inputState.lastKeyCode:-1;if(e.bounds){let{from:a,to:l}=e.bounds,c=r.from,h=null;(o===8||E.android&&e.text.length<l-a)&&(c=r.to,h="end");let d=n.doc.sliceString(a,l,Ki),f,u;!r.empty&&r.from>=a&&r.to<=l&&(e.typeOver||d!=e.text)&&d.slice(0,r.from-a)==e.text.slice(0,r.from-a)&&d.slice(r.to-a)==e.text.slice(f=e.text.length-(d.length-(r.to-a)))?i={from:r.from,to:r.to,insert:K.of(e.text.slice(r.from-a,f).split(Ki))}:(u=Af(d,e.text,c-a,h))&&(E.chrome&&o==13&&u.toB==u.from+2&&e.text.slice(u.from,u.toB)==Ki+Ki&&u.toB--,i={from:a+u.from,to:a+u.toA,insert:K.of(e.text.slice(u.from,u.toB).split(Ki))})}else s&&(!t.hasFocus&&n.facet(Ht)||Cr(s,r))&&(s=null);if(!i&&!s)return!1;if((E.mac||E.android)&&i&&i.from==i.to&&i.from==r.head-1&&/^\. ?$/.test(i.insert.toString())&&t.contentDOM.getAttribute("autocorrect")=="off"?(s&&i.insert.length==2&&(s=S.single(s.main.anchor-1,s.main.head-1)),i={from:i.from,to:i.to,insert:K.of([i.insert.toString().replace("."," ")])}):n.doc.lineAt(r.from).to<r.to&&t.docView.lineHasWidget(r.to)&&t.inputState.insertingTextAt>Date.now()-50?i={from:r.from,to:r.to,insert:n.toText(t.inputState.insertingText)}:E.chrome&&i&&i.from==i.to&&i.from==r.head&&i.insert.toString()==`
 `&&t.lineWrapping&&(s&&(s=S.single(s.main.anchor-1,s.main.head-1)),i={from:r.from,to:r.to,insert:K.of([" "])}),i)return wl(t,i,s,o);if(s&&!Cr(s,r)){let a=!1,l="select";return t.inputState.lastSelectionTime>Date.now()-50&&(t.inputState.lastSelectionOrigin=="select"&&(a=!0),l=t.inputState.lastSelectionOrigin,l=="select.pointer"&&(s=Sf(n.facet(Cn).map(c=>c(t)),s))),t.dispatch({selection:s,scrollIntoView:a,userEvent:l}),!0}else return!1}function wl(t,e,i,s=-1){if(E.ios&&t.inputState.flushIOSKey(e))return!0;let n=t.state.selection.main;if(E.android&&(e.to==n.to&&(e.from==n.from||e.from==n.from-1&&t.state.sliceDoc(e.from,n.from)==" ")&&e.insert.length==1&&e.insert.lines==2&&os(t.contentDOM,"Enter",13)||(e.from==n.from-1&&e.to==n.to&&e.insert.length==0||s==8&&e.insert.length<e.to-e.from&&e.to>n.head)&&os(t.contentDOM,"Backspace",8)||e.from==n.from&&e.to==n.to+1&&e.insert.length==0&&os(t.contentDOM,"Delete",46)))return!0;let r=e.insert.toString();t.inputState.composing>=0&&t.inputState.composing++;let o,a=()=>o||(o=ub(t,e,i));return t.state.facet(df).some(l=>l(t,e.from,e.to,r,a))||t.dispatch(a()),!0}function ub(t,e,i){let s,n=t.state,r=n.selection.main,o=-1;if(e.from==e.to&&e.from<r.from||e.from>r.to){let l=e.from<r.from?-1:1,c=l<0?r.from:r.to,h=Qs(n.facet(Cn).map(d=>d(t)),c,l);e.from==h&&(o=h)}if(o>-1)s={changes:e,selection:S.cursor(e.from+e.insert.length,-1)};else if(e.from>=r.from&&e.to<=r.to&&e.to-e.from>=(r.to-r.from)/3&&(!i||i.main.empty&&i.main.from==e.from+e.insert.length)&&t.inputState.composing<0){let l=r.from<e.from?n.sliceDoc(r.from,e.from):"",c=r.to>e.to?n.sliceDoc(e.to,r.to):"";s=n.replaceSelection(t.state.toText(l+e.insert.sliceString(0,void 0,t.state.lineBreak)+c))}else{let l=n.changes(e),c=i&&i.main.to<=l.newLength?i.main:void 0;if(n.selection.ranges.length>1&&(t.inputState.composing>=0||t.inputState.compositionPendingChange)&&e.to<=r.to+10&&e.to>=r.to-10){let h=t.state.sliceDoc(e.from,e.to),d,f=i&&kf(t,i.main.head);if(f){let p=e.insert.length-(e.to-e.from);d={from:f.from,to:f.to-p}}else d=t.state.doc.lineAt(r.head);let u=r.to-e.to;s=n.changeByRange(p=>{if(p.from==r.from&&p.to==r.to)return{changes:l,range:c||p.map(l)};let m=p.to-u,b=m-h.length;if(t.state.sliceDoc(b,m)!=h||m>=d.from&&b<=d.to)return{range:p};let x=n.changes({from:b,to:m,insert:e.insert}),k=p.to-r.to;return{changes:x,range:c?S.range(Math.max(0,c.anchor+k),Math.max(0,c.head+k)):p.map(x)}})}else s={changes:l,selection:c&&n.selection.replaceRange(c)}}let a="input.type";return(t.composing||t.inputState.compositionPendingChange&&t.inputState.compositionEndedAt>Date.now()-50)&&(t.inputState.compositionPendingChange=!1,a+=".compose",t.inputState.compositionFirstChange&&(a+=".start",t.inputState.compositionFirstChange=!1)),n.update(s,{userEvent:a,scrollIntoView:!0})}function Af(t,e,i,s){let n=Math.min(t.length,e.length),r=0;for(;r<n&&t.charCodeAt(r)==e.charCodeAt(r);)r++;if(r==n&&t.length==e.length)return null;let o=t.length,a=e.length;for(;o>0&&a>0&&t.charCodeAt(o-1)==e.charCodeAt(a-1);)o--,a--;if(s=="end"){let l=Math.max(0,r-Math.min(o,a));i-=o+l-r}if(o<r&&t.length<e.length){let l=i<=r&&i>=o?r-i:0;r-=l,a=r+(a-o),o=r}else if(a<r){let l=i<=r&&i>=a?r-i:0;r-=l,o=r+(o-a),a=r}return{from:r,toA:o,toB:a}}function pb(t){let e=[];if(t.root.activeElement!=t.contentDOM)return e;let{anchorNode:i,anchorOffset:s,focusNode:n,focusOffset:r}=t.observer.selectionRange;return i&&(e.push(new Rc(i,s)),(n!=i||r!=s)&&e.push(new Rc(n,r))),e}function gb(t,e){if(t.length==0)return null;let i=t[0].pos,s=t.length==2?t[1].pos:i;return i>-1&&s>-1?S.single(i+e,s+e):null}function Cr(t,e){return e.head==t.main.head&&e.anchor==t.main.anchor}class mb{setSelectionOrigin(e){this.lastSelectionOrigin=e,this.lastSelectionTime=Date.now()}constructor(e){this.view=e,this.lastKeyCode=0,this.lastKeyTime=0,this.lastTouchTime=0,this.lastTouchX=0,this.lastTouchY=0,this.lastFocusTime=0,this.lastScrollTop=0,this.lastScrollLeft=0,this.lastWheelEvent=0,this.pendingIOSKey=void 0,this.tabFocusMode=-1,this.lastSelectionOrigin=null,this.lastSelectionTime=0,this.lastContextMenu=0,this.scrollHandlers=[],this.handlers=Object.create(null),this.composing=-1,this.compositionFirstChange=null,this.compositionEndedAt=0,this.compositionPendingKey=!1,this.compositionPendingChange=!1,this.insertingText="",this.insertingTextAt=0,this.mouseSelection=null,this.draggedContent=null,this.handleEvent=this.handleEvent.bind(this),this.notifiedFocused=e.hasFocus,E.safari&&e.contentDOM.addEventListener("input",()=>null),E.gecko&&Eb(e.contentDOM.ownerDocument)}handleEvent(e){!Cb(this.view,e)||this.ignoreDuringComposition(e)||e.type=="keydown"&&this.keydown(e)||(this.view.updateState!=0?Promise.resolve().then(()=>this.runHandlers(e.type,e)):this.runHandlers(e.type,e))}runHandlers(e,i){let s=this.handlers[e];if(s){for(let n of s.observers)n(this.view,i);for(let n of s.handlers){if(i.defaultPrevented)break;if(n(this.view,i)){i.preventDefault();break}}}}ensureHandlers(e){let i=bb(e),s=this.handlers,n=this.view.contentDOM;for(let r in i)if(r!="scroll"){let o=!i[r].handlers.length,a=s[r];a&&o!=!a.handlers.length&&(n.removeEventListener(r,this.handleEvent),a=null),a||n.addEventListener(r,this.handleEvent,{passive:o})}for(let r in s)r!="scroll"&&!i[r]&&n.removeEventListener(r,this.handleEvent);this.handlers=i}keydown(e){if(this.lastKeyCode=e.keyCode,this.lastKeyTime=Date.now(),e.keyCode==9&&this.tabFocusMode>-1&&(!this.tabFocusMode||Date.now()<=this.tabFocusMode))return!0;if(this.tabFocusMode>0&&e.keyCode!=27&&Pf.indexOf(e.keyCode)<0&&(this.tabFocusMode=-1),E.android&&E.chrome&&!e.synthetic&&(e.keyCode==13||e.keyCode==8))return this.view.observer.delayAndroidKey(e.key,e.keyCode),!0;let i;return E.ios&&!e.synthetic&&!e.altKey&&!e.metaKey&&!e.shiftKey&&((i=$f.find(s=>s.keyCode==e.keyCode))&&!e.ctrlKey||vb.indexOf(e.key)>-1&&e.ctrlKey)?(this.pendingIOSKey=i||e,setTimeout(()=>this.flushIOSKey(),250),!0):(e.keyCode!=229&&this.view.observer.forceFlush(),!1)}flushIOSKey(e){let i=this.pendingIOSKey;return!i||i.key=="Enter"&&e&&e.from<e.to&&/^\S+$/.test(e.insert.toString())?!1:(this.pendingIOSKey=void 0,os(this.view.contentDOM,i.key,i.keyCode,i instanceof KeyboardEvent?i:void 0))}ignoreDuringComposition(e){return!/^key/.test(e.type)||e.synthetic?!1:this.composing>0?!0:E.safari&&!E.ios&&this.compositionPendingKey&&Date.now()-this.compositionEndedAt<100?(this.compositionPendingKey=!1,!0):!1}startMouseSelection(e){this.mouseSelection&&this.mouseSelection.destroy(),this.mouseSelection=e}update(e){this.view.observer.update(e),this.mouseSelection&&this.mouseSelection.update(e),this.draggedContent&&e.docChanged&&(this.draggedContent=this.draggedContent.map(e.changes)),e.transactions.length&&(this.lastKeyCode=this.lastSelectionTime=0)}destroy(){this.mouseSelection&&this.mouseSelection.destroy()}}function Lc(t,e){return(i,s)=>{try{return e.call(t,s,i)}catch(n){He(i.state,n)}}}function bb(t){let e=Object.create(null);function i(s){return e[s]||(e[s]={observers:[],handlers:[]})}for(let s of t){let n=s.spec,r=n&&n.plugin.domEventHandlers,o=n&&n.plugin.domEventObservers;if(r)for(let a in r){let l=r[a];l&&i(a).handlers.push(Lc(s.value,l))}if(o)for(let a in o){let l=o[a];l&&i(a).observers.push(Lc(s.value,l))}}for(let s in ut)i(s).handlers.push(ut[s]);for(let s in qe)i(s).observers.push(qe[s]);return e}const $f=[{key:"Backspace",keyCode:8,inputType:"deleteContentBackward"},{key:"Enter",keyCode:13,inputType:"insertParagraph"},{key:"Enter",keyCode:13,inputType:"insertLineBreak"},{key:"Delete",keyCode:46,inputType:"deleteContentForward"}],vb="dthko",Pf=[16,17,18,20,91,92,224,225],Rn=6;function Ln(t){return Math.max(0,t)*.7+8}function yb(t,e){return Math.max(Math.abs(t.clientX-e.clientX),Math.abs(t.clientY-e.clientY))}class xb{constructor(e,i,s,n){this.view=e,this.startEvent=i,this.style=s,this.mustSelect=n,this.scrollSpeed={x:0,y:0},this.scrolling=-1,this.lastEvent=i,this.scrollParents=Jd(e.contentDOM),this.atoms=e.state.facet(Cn).map(o=>o(e));let r=e.contentDOM.ownerDocument;r.addEventListener("mousemove",this.move=this.move.bind(this)),r.addEventListener("mouseup",this.up=this.up.bind(this)),this.extend=i.shiftKey,this.multiple=e.state.facet(j.allowMultipleSelections)&&wb(e,i),this.dragging=Sb(e,i)&&Ef(i)==1?null:!1}start(e){this.dragging===!1&&this.select(e)}move(e){if(e.buttons==0)return this.destroy();if(this.dragging||this.dragging==null&&yb(this.startEvent,e)<10)return;this.select(this.lastEvent=e);let i=0,s=0,n=0,r=0,o=this.view.win.innerWidth,a=this.view.win.innerHeight;this.scrollParents.x&&({left:n,right:o}=this.scrollParents.x.getBoundingClientRect()),this.scrollParents.y&&({top:r,bottom:a}=this.scrollParents.y.getBoundingClientRect());let l=xl(this.view);e.clientX-l.left<=n+Rn?i=-Ln(n-e.clientX):e.clientX+l.right>=o-Rn&&(i=Ln(e.clientX-o)),e.clientY-l.top<=r+Rn?s=-Ln(r-e.clientY):e.clientY+l.bottom>=a-Rn&&(s=Ln(e.clientY-a)),this.setScrollSpeed(i,s)}up(e){this.dragging==null&&this.select(this.lastEvent),this.dragging||e.preventDefault(),this.destroy()}destroy(){this.setScrollSpeed(0,0);let e=this.view.contentDOM.ownerDocument;e.removeEventListener("mousemove",this.move),e.removeEventListener("mouseup",this.up),this.view.inputState.mouseSelection=this.view.inputState.draggedContent=null}setScrollSpeed(e,i){this.scrollSpeed={x:e,y:i},e||i?this.scrolling<0&&(this.scrolling=setInterval(()=>this.scroll(),50)):this.scrolling>-1&&(clearInterval(this.scrolling),this.scrolling=-1)}scroll(){let{x:e,y:i}=this.scrollSpeed;e&&this.scrollParents.x&&(this.scrollParents.x.scrollLeft+=e,e=0),i&&this.scrollParents.y&&(this.scrollParents.y.scrollTop+=i,i=0),(e||i)&&this.view.win.scrollBy(e,i),this.dragging===!1&&this.select(this.lastEvent)}select(e){let{view:i}=this,s=Sf(this.atoms,this.style.get(e,this.extend,this.multiple));(this.mustSelect||!s.eq(i.state.selection,this.dragging===!1))&&this.view.dispatch({selection:s,userEvent:"select.pointer"}),this.mustSelect=!1}update(e){e.transactions.some(i=>i.isUserEvent("input.type"))?this.destroy():this.style.update(e)&&setTimeout(()=>this.select(this.lastEvent),20)}}function wb(t,e){let i=t.state.facet(af);return i.length?i[0](e):E.mac?e.metaKey:e.ctrlKey}function kb(t,e){let i=t.state.facet(lf);return i.length?i[0](e):E.mac?!e.altKey:!e.ctrlKey}function Sb(t,e){let{main:i}=t.state.selection;if(i.empty)return!1;let s=on(t.root);if(!s||s.rangeCount==0)return!0;let n=s.getRangeAt(0).getClientRects();for(let r=0;r<n.length;r++){let o=n[r];if(o.left<=e.clientX&&o.right>=e.clientX&&o.top<=e.clientY&&o.bottom>=e.clientY)return!0}return!1}function Cb(t,e){if(!e.bubbles)return!0;if(e.defaultPrevented)return!1;for(let i=e.target,s;i!=t.contentDOM;i=i.parentNode)if(!i||i.nodeType==11||(s=de.get(i))&&s.isWidget()&&!s.isHidden&&s.widget.ignoreEvent(e))return!1;return!0}const ut=Object.create(null),qe=Object.create(null),Tf=E.ie&&E.ie_version<15||E.ios&&E.webkit_version<604;function Ob(t){let e=t.dom.parentNode;if(!e)return;let i=e.appendChild(document.createElement("textarea"));i.style.cssText="position: fixed; left: -10000px; top: 10px",i.focus(),setTimeout(()=>{t.focus(),i.remove(),Mf(t,i.value)},50)}function to(t,e,i){for(let s of t.facet(e))i=s(i,t);return i}function Mf(t,e){e=to(t.state,ml,e);let{state:i}=t,s,n=1,r=i.toText(e),o=r.lines==i.selection.ranges.length;if(Ta!=null&&i.selection.ranges.every(l=>l.empty)&&Ta==r.toString()){let l=-1;s=i.changeByRange(c=>{let h=i.doc.lineAt(c.from);if(h.from==l)return{range:c};l=h.from;let d=i.toText((o?r.line(n++).text:e)+i.lineBreak);return{changes:{from:h.from,insert:d},range:S.cursor(c.from+d.length)}})}else o?s=i.changeByRange(l=>{let c=r.line(n++);return{changes:{from:l.from,to:l.to,insert:c.text},range:S.cursor(l.from+c.length)}}):s=i.replaceSelection(r);t.dispatch(s,{userEvent:"input.paste",scrollIntoView:!0})}qe.scroll=t=>{t.inputState.lastScrollTop=t.scrollDOM.scrollTop,t.inputState.lastScrollLeft=t.scrollDOM.scrollLeft};qe.wheel=qe.mousewheel=t=>{t.inputState.lastWheelEvent=Date.now()};ut.keydown=(t,e)=>(t.inputState.setSelectionOrigin("select"),e.keyCode==27&&t.inputState.tabFocusMode!=0&&(t.inputState.tabFocusMode=Date.now()+2e3),!1);qe.touchstart=(t,e)=>{let i=t.inputState,s=e.targetTouches[0];i.lastTouchTime=Date.now(),s&&(i.lastTouchX=s.clientX,i.lastTouchY=s.clientY),i.setSelectionOrigin("select.pointer")};qe.touchmove=t=>{t.inputState.setSelectionOrigin("select.pointer")};ut.mousedown=(t,e)=>{if(t.observer.flush(),t.inputState.lastTouchTime>Date.now()-2e3)return!1;let i=null;for(let s of t.state.facet(cf))if(i=s(t,e),i)break;if(!i&&e.button==0&&(i=$b(t,e)),i){let s=!t.hasFocus;t.inputState.startMouseSelection(new xb(t,e,i,s)),s&&t.observer.ignore(()=>{Yd(t.contentDOM);let r=t.root.activeElement;r&&!r.contains(t.contentDOM)&&r.blur()});let n=t.inputState.mouseSelection;if(n)return n.start(e),n.dragging===!1}else t.inputState.setSelectionOrigin("select.pointer");return!1};function Ic(t,e,i,s){if(s==1)return S.cursor(e,i);if(s==2)return sb(t.state,e,i);{let n=t.docView.lineAt(e,i),r=t.state.doc.lineAt(n?n.posAtEnd:e),o=n?n.posAtStart:r.from,a=n?n.posAtEnd:r.to;return a<t.state.doc.length&&a==r.to&&a++,S.range(o,a)}}const Ab=E.ie&&E.ie_version<=11;let Fc=null,Nc=0,zc=0;function Ef(t){if(!Ab)return t.detail;let e=Fc,i=zc;return Fc=t,zc=Date.now(),Nc=!e||i>Date.now()-400&&Math.abs(e.clientX-t.clientX)<2&&Math.abs(e.clientY-t.clientY)<2?(Nc+1)%3:1}function $b(t,e){let i=t.posAndSideAtCoords({x:e.clientX,y:e.clientY},!1),s=Ef(e),n=t.state.selection;return{update(r){r.docChanged&&(i.pos=r.changes.mapPos(i.pos),n=n.map(r.changes))},get(r,o,a){let l=t.posAndSideAtCoords({x:r.clientX,y:r.clientY},!1),c,h=Ic(t,l.pos,l.assoc,s);if(i.pos!=l.pos&&!o){let d=Ic(t,i.pos,i.assoc,s),f=Math.min(d.from,h.from),u=Math.max(d.to,h.to);h=f<h.from?S.range(f,u,h.assoc):S.range(u,f,h.assoc)}return o?n.replaceRange(n.main.extend(h.from,h.to,h.assoc)):a&&s==1&&n.ranges.length>1&&(c=Pb(n,l.pos))?c:a?n.addRange(h):S.create([h])}}}function Pb(t,e){for(let i=0;i<t.ranges.length;i++){let{from:s,to:n}=t.ranges[i];if(s<=e&&n>=e)return S.create(t.ranges.slice(0,i).concat(t.ranges.slice(i+1)),t.mainIndex==i?0:t.mainIndex-(t.mainIndex>i?1:0))}return null}ut.dragstart=(t,e)=>{let{selection:{main:i}}=t.state;if(e.target.draggable){let n=t.docView.tile.nearest(e.target);if(n&&n.isWidget()){let r=n.posAtStart,o=r+n.length;(r>=i.to||o<=i.from)&&(i=S.range(r,o))}}let{inputState:s}=t;return s.mouseSelection&&(s.mouseSelection.dragging=!0),s.draggedContent=i,e.dataTransfer&&(e.dataTransfer.setData("Text",to(t.state,bl,t.state.sliceDoc(i.from,i.to))),e.dataTransfer.effectAllowed="copyMove"),!1};ut.dragend=t=>(t.inputState.draggedContent=null,!1);function Hc(t,e,i,s){if(i=to(t.state,ml,i),!i)return;let n=t.posAtCoords({x:e.clientX,y:e.clientY},!1),{draggedContent:r}=t.inputState,o=s&&r&&kb(t,e)?{from:r.from,to:r.to}:null,a={from:n,insert:i},l=t.state.changes(o?[o,a]:a);t.focus(),t.dispatch({changes:l,selection:{anchor:l.mapPos(n,-1),head:l.mapPos(n,1)},userEvent:o?"move.drop":"input.drop"}),t.inputState.draggedContent=null}ut.drop=(t,e)=>{if(!e.dataTransfer)return!1;if(t.state.readOnly)return!0;let i=e.dataTransfer.files;if(i&&i.length){let s=Array(i.length),n=0,r=()=>{++n==i.length&&Hc(t,e,s.filter(o=>o!=null).join(t.state.lineBreak),!1)};for(let o=0;o<i.length;o++){let a=new FileReader;a.onerror=r,a.onload=()=>{/[\x00-\x08\x0e-\x1f]{2}/.test(a.result)||(s[o]=a.result),r()},a.readAsText(i[o])}return!0}else{let s=e.dataTransfer.getData("Text");if(s)return Hc(t,e,s,!0),!0}return!1};ut.paste=(t,e)=>{if(t.state.readOnly)return!0;t.observer.flush();let i=Tf?null:e.clipboardData;return i?(Mf(t,i.getData("text/plain")||i.getData("text/uri-list")),!0):(Ob(t),!1)};function Tb(t,e){let i=t.dom.parentNode;if(!i)return;let s=i.appendChild(document.createElement("textarea"));s.style.cssText="position: fixed; left: -10000px; top: 10px",s.value=e,s.focus(),s.selectionEnd=e.length,s.selectionStart=0,setTimeout(()=>{s.remove(),t.focus()},50)}function Mb(t){let e=[],i=[],s=!1;for(let n of t.selection.ranges)n.empty||(e.push(t.sliceDoc(n.from,n.to)),i.push(n));if(!e.length){let n=-1;for(let{from:r}of t.selection.ranges){let o=t.doc.lineAt(r);o.number>n&&(e.push(o.text),i.push({from:o.from,to:Math.min(t.doc.length,o.to+1)})),n=o.number}s=!0}return{text:to(t,bl,e.join(t.lineBreak)),ranges:i,linewise:s}}let Ta=null;ut.copy=ut.cut=(t,e)=>{if(!qs(t.contentDOM,t.observer.selectionRange))return!1;let{text:i,ranges:s,linewise:n}=Mb(t.state);if(!i&&!n)return!1;Ta=n?i:null,e.type=="cut"&&!t.state.readOnly&&t.dispatch({changes:s,scrollIntoView:!0,userEvent:"delete.cut"});let r=Tf?null:e.clipboardData;return r?(r.clearData(),r.setData("text/plain",i),!0):(Tb(t,i),!1)};const Df=Xt.define();function _f(t,e){let i=[];for(let s of t.facet(ff)){let n=s(t,e);n&&i.push(n)}return i.length?t.update({effects:i,annotations:Df.of(!0)}):null}function Bf(t){setTimeout(()=>{let e=t.hasFocus;if(e!=t.inputState.notifiedFocused){let i=_f(t.state,e);i?t.dispatch(i):t.update([])}},10)}qe.focus=t=>{t.inputState.lastFocusTime=Date.now(),!t.scrollDOM.scrollTop&&(t.inputState.lastScrollTop||t.inputState.lastScrollLeft)&&(t.scrollDOM.scrollTop=t.inputState.lastScrollTop,t.scrollDOM.scrollLeft=t.inputState.lastScrollLeft),Bf(t)};qe.blur=t=>{t.observer.clearSelectionRange(),Bf(t)};qe.compositionstart=qe.compositionupdate=t=>{t.observer.editContext||(t.inputState.compositionFirstChange==null&&(t.inputState.compositionFirstChange=!0),t.inputState.composing<0&&(t.inputState.composing=0))};qe.compositionend=t=>{t.observer.editContext||(t.inputState.composing=-1,t.inputState.compositionEndedAt=Date.now(),t.inputState.compositionPendingKey=!0,t.inputState.compositionPendingChange=t.observer.pendingRecords().length>0,t.inputState.compositionFirstChange=null,E.chrome&&E.android?t.observer.flushSoon():t.inputState.compositionPendingChange?Promise.resolve().then(()=>t.observer.flush()):setTimeout(()=>{t.inputState.composing<0&&t.docView.hasComposition&&t.update([])},50))};qe.contextmenu=t=>{t.inputState.lastContextMenu=Date.now()};ut.beforeinput=(t,e)=>{var i,s;if((e.inputType=="insertText"||e.inputType=="insertCompositionText")&&(t.inputState.insertingText=e.data,t.inputState.insertingTextAt=Date.now()),e.inputType=="insertReplacementText"&&t.observer.editContext){let r=(i=e.dataTransfer)===null||i===void 0?void 0:i.getData("text/plain"),o=e.getTargetRanges();if(r&&o.length){let a=o[0],l=t.posAtDOM(a.startContainer,a.startOffset),c=t.posAtDOM(a.endContainer,a.endOffset);return wl(t,{from:l,to:c,insert:t.state.toText(r)},null),!0}}let n;if(E.chrome&&E.android&&(n=$f.find(r=>r.inputType==e.inputType))&&(t.observer.delayAndroidKey(n.key,n.keyCode),n.key=="Backspace"||n.key=="Delete")){let r=((s=window.visualViewport)===null||s===void 0?void 0:s.height)||0;setTimeout(()=>{var o;(((o=window.visualViewport)===null||o===void 0?void 0:o.height)||0)>r+10&&t.hasFocus&&(t.contentDOM.blur(),t.focus())},100)}return E.ios&&e.inputType=="deleteContentForward"&&t.observer.flushSoon(),E.safari&&e.inputType=="insertText"&&t.inputState.composing>=0&&setTimeout(()=>qe.compositionend(t,e),20),!1};const Wc=new Set;function Eb(t){Wc.has(t)||(Wc.add(t),t.addEventListener("copy",()=>{}),t.addEventListener("cut",()=>{}))}const Uc=["pre-wrap","normal","pre-line","break-spaces"];let bs=!1;function qc(){bs=!1}class Db{constructor(e){this.lineWrapping=e,this.doc=K.empty,this.heightSamples={},this.lineHeight=14,this.charWidth=7,this.textHeight=14,this.lineLength=30}heightForGap(e,i){let s=this.doc.lineAt(i).number-this.doc.lineAt(e).number+1;return this.lineWrapping&&(s+=Math.max(0,Math.ceil((i-e-s*this.lineLength*.5)/this.lineLength))),this.lineHeight*s}heightForLine(e){return this.lineWrapping?(1+Math.max(0,Math.ceil((e-this.lineLength)/Math.max(1,this.lineLength-5))))*this.lineHeight:this.lineHeight}setDoc(e){return this.doc=e,this}mustRefreshForWrapping(e){return Uc.indexOf(e)>-1!=this.lineWrapping}mustRefreshForHeights(e){let i=!1;for(let s=0;s<e.length;s++){let n=e[s];n<0?s++:this.heightSamples[Math.floor(n*10)]||(i=!0,this.heightSamples[Math.floor(n*10)]=!0)}return i}refresh(e,i,s,n,r,o){let a=Uc.indexOf(e)>-1,l=Math.abs(i-this.lineHeight)>.3||this.lineWrapping!=a||Math.abs(s-this.charWidth)>.1;if(this.lineWrapping=a,this.lineHeight=i,this.charWidth=s,this.textHeight=n,this.lineLength=r,l){this.heightSamples={};for(let c=0;c<o.length;c++){let h=o[c];h<0?c++:this.heightSamples[Math.floor(h*10)]=!0}}return l}}class _b{constructor(e,i){this.from=e,this.heights=i,this.index=0}get more(){return this.index<this.heights.length}}class lt{constructor(e,i,s,n,r){this.from=e,this.length=i,this.top=s,this.height=n,this._content=r}get type(){return typeof this._content=="number"?Ae.Text:Array.isArray(this._content)?this._content:this._content.type}get to(){return this.from+this.length}get bottom(){return this.top+this.height}get widget(){return this._content instanceof zi?this._content.widget:null}get widgetLineBreaks(){return typeof this._content=="number"?this._content:0}join(e){let i=(Array.isArray(this._content)?this._content:[this]).concat(Array.isArray(e._content)?e._content:[e]);return new lt(this.from,this.length+e.length,this.top,this.height+e.height,i)}}var se=(function(t){return t[t.ByPos=0]="ByPos",t[t.ByHeight=1]="ByHeight",t[t.ByPosNoHeight=2]="ByPosNoHeight",t})(se||(se={}));const rr=.001;class Ie{constructor(e,i,s=2){this.length=e,this.height=i,this.flags=s}get outdated(){return(this.flags&2)>0}set outdated(e){this.flags=(e?2:0)|this.flags&-3}setHeight(e){this.height!=e&&(Math.abs(this.height-e)>rr&&(bs=!0),this.height=e)}replace(e,i,s){return Ie.of(s)}decomposeLeft(e,i){i.push(this)}decomposeRight(e,i){i.push(this)}applyChanges(e,i,s,n){let r=this,o=s.doc;for(let a=n.length-1;a>=0;a--){let{fromA:l,toA:c,fromB:h,toB:d}=n[a],f=r.lineAt(l,se.ByPosNoHeight,s.setDoc(i),0,0),u=f.to>=c?f:r.lineAt(c,se.ByPosNoHeight,s,0,0);for(d+=u.to-c,c=u.to;a>0&&f.from<=n[a-1].toA;)l=n[a-1].fromA,h=n[a-1].fromB,a--,l<f.from&&(f=r.lineAt(l,se.ByPosNoHeight,s,0,0));h+=f.from-l,l=f.from;let p=kl.build(s.setDoc(o),e,h,d);r=Or(r,r.replace(l,c,p))}return r.updateHeight(s,0)}static empty(){return new Xe(0,0,0)}static of(e){if(e.length==1)return e[0];let i=0,s=e.length,n=0,r=0;for(;;)if(i==s)if(n>r*2){let a=e[i-1];a.break?e.splice(--i,1,a.left,null,a.right):e.splice(--i,1,a.left,a.right),s+=1+a.break,n-=a.size}else if(r>n*2){let a=e[s];a.break?e.splice(s,1,a.left,null,a.right):e.splice(s,1,a.left,a.right),s+=2+a.break,r-=a.size}else break;else if(n<r){let a=e[i++];a&&(n+=a.size)}else{let a=e[--s];a&&(r+=a.size)}let o=0;return e[i-1]==null?(o=1,i--):e[i]==null&&(o=1,s++),new Rb(Ie.of(e.slice(0,i)),o,Ie.of(e.slice(s)))}}function Or(t,e){return t==e?t:(t.constructor!=e.constructor&&(bs=!0),e)}Ie.prototype.size=1;const Bb=N.replace({});class Rf extends Ie{constructor(e,i,s){super(e,i),this.deco=s,this.spaceAbove=0}mainBlock(e,i){return new lt(i,this.length,e+this.spaceAbove,this.height-this.spaceAbove,this.deco||0)}blockAt(e,i,s,n){return this.spaceAbove&&e<s+this.spaceAbove?new lt(n,0,s,this.spaceAbove,Bb):this.mainBlock(s,n)}lineAt(e,i,s,n,r){let o=this.mainBlock(n,r);return this.spaceAbove?this.blockAt(0,s,n,r).join(o):o}forEachLine(e,i,s,n,r,o){e<=r+this.length&&i>=r&&o(this.lineAt(0,se.ByPos,s,n,r))}setMeasuredHeight(e){let i=e.heights[e.index++];i<0?(this.spaceAbove=-i,i=e.heights[e.index++]):this.spaceAbove=0,this.setHeight(i)}updateHeight(e,i=0,s=!1,n){return n&&n.from<=i&&n.more&&this.setMeasuredHeight(n),this.outdated=!1,this}toString(){return`block(${this.length})`}}class Xe extends Rf{constructor(e,i,s){super(e,i,null),this.collapsed=0,this.widgetHeight=0,this.breaks=0,this.spaceAbove=s}mainBlock(e,i){return new lt(i,this.length,e+this.spaceAbove,this.height-this.spaceAbove,this.breaks)}replace(e,i,s){let n=s[0];return s.length==1&&(n instanceof Xe||n instanceof Ce&&n.flags&4)&&Math.abs(this.length-n.length)<10?(n instanceof Ce?n=new Xe(n.length,this.height,this.spaceAbove):n.height=this.height,this.outdated||(n.outdated=!1),n):Ie.of(s)}updateHeight(e,i=0,s=!1,n){return n&&n.from<=i&&n.more?this.setMeasuredHeight(n):(s||this.outdated)&&(this.spaceAbove=0,this.setHeight(Math.max(this.widgetHeight,e.heightForLine(this.length-this.collapsed))+this.breaks*e.lineHeight)),this.outdated=!1,this}toString(){return`line(${this.length}${this.collapsed?-this.collapsed:""}${this.widgetHeight?":"+this.widgetHeight:""})`}}class Ce extends Ie{constructor(e){super(e,0)}heightMetrics(e,i){let s=e.doc.lineAt(i).number,n=e.doc.lineAt(i+this.length).number,r=n-s+1,o,a=0;if(e.lineWrapping){let l=Math.min(this.height,e.lineHeight*r);o=l/r,this.length>r+1&&(a=(this.height-l)/(this.length-r-1))}else o=this.height/r;return{firstLine:s,lastLine:n,perLine:o,perChar:a}}blockAt(e,i,s,n){let{firstLine:r,lastLine:o,perLine:a,perChar:l}=this.heightMetrics(i,n);if(i.lineWrapping){let c=n+(e<i.lineHeight?0:Math.round(Math.max(0,Math.min(1,(e-s)/this.height))*this.length)),h=i.doc.lineAt(c),d=a+h.length*l,f=Math.max(s,e-d/2);return new lt(h.from,h.length,f,d,0)}else{let c=Math.max(0,Math.min(o-r,Math.floor((e-s)/a))),{from:h,length:d}=i.doc.line(r+c);return new lt(h,d,s+a*c,a,0)}}lineAt(e,i,s,n,r){if(i==se.ByHeight)return this.blockAt(e,s,n,r);if(i==se.ByPosNoHeight){let{from:u,to:p}=s.doc.lineAt(e);return new lt(u,p-u,0,0,0)}let{firstLine:o,perLine:a,perChar:l}=this.heightMetrics(s,r),c=s.doc.lineAt(e),h=a+c.length*l,d=c.number-o,f=n+a*d+l*(c.from-r-d);return new lt(c.from,c.length,Math.max(n,Math.min(f,n+this.height-h)),h,0)}forEachLine(e,i,s,n,r,o){e=Math.max(e,r),i=Math.min(i,r+this.length);let{firstLine:a,perLine:l,perChar:c}=this.heightMetrics(s,r);for(let h=e,d=n;h<=i;){let f=s.doc.lineAt(h);if(h==e){let p=f.number-a;d+=l*p+c*(e-r-p)}let u=l+c*f.length;o(new lt(f.from,f.length,d,u,0)),d+=u,h=f.to+1}}replace(e,i,s){let n=this.length-i;if(n>0){let r=s[s.length-1];r instanceof Ce?s[s.length-1]=new Ce(r.length+n):s.push(null,new Ce(n-1))}if(e>0){let r=s[0];r instanceof Ce?s[0]=new Ce(e+r.length):s.unshift(new Ce(e-1),null)}return Ie.of(s)}decomposeLeft(e,i){i.push(new Ce(e-1),null)}decomposeRight(e,i){i.push(null,new Ce(this.length-e-1))}updateHeight(e,i=0,s=!1,n){let r=i+this.length;if(n&&n.from<=i+this.length&&n.more){let o=[],a=Math.max(i,n.from),l=-1;for(n.from>i&&o.push(new Ce(n.from-i-1).updateHeight(e,i));a<=r&&n.more;){let h=e.doc.lineAt(a).length;o.length&&o.push(null);let d=n.heights[n.index++],f=0;d<0&&(f=-d,d=n.heights[n.index++]),l==-1?l=d:Math.abs(d-l)>=rr&&(l=-2);let u=new Xe(h,d,f);u.outdated=!1,o.push(u),a+=h+1}a<=r&&o.push(null,new Ce(r-a).updateHeight(e,a));let c=Ie.of(o);return(l<0||Math.abs(c.height-this.height)>=rr||Math.abs(l-this.heightMetrics(e,i).perLine)>=rr)&&(bs=!0),Or(this,c)}else(s||this.outdated)&&(this.setHeight(e.heightForGap(i,i+this.length)),this.outdated=!1);return this}toString(){return`gap(${this.length})`}}class Rb extends Ie{constructor(e,i,s){super(e.length+i+s.length,e.height+s.height,i|(e.outdated||s.outdated?2:0)),this.left=e,this.right=s,this.size=e.size+s.size}get break(){return this.flags&1}blockAt(e,i,s,n){let r=s+this.left.height;return e<r?this.left.blockAt(e,i,s,n):this.right.blockAt(e,i,r,n+this.left.length+this.break)}lineAt(e,i,s,n,r){let o=n+this.left.height,a=r+this.left.length+this.break,l=i==se.ByHeight?e<o:e<a,c=l?this.left.lineAt(e,i,s,n,r):this.right.lineAt(e,i,s,o,a);if(this.break||(l?c.to<a:c.from>a))return c;let h=i==se.ByPosNoHeight?se.ByPosNoHeight:se.ByPos;return l?c.join(this.right.lineAt(a,h,s,o,a)):this.left.lineAt(a,h,s,n,r).join(c)}forEachLine(e,i,s,n,r,o){let a=n+this.left.height,l=r+this.left.length+this.break;if(this.break)e<l&&this.left.forEachLine(e,i,s,n,r,o),i>=l&&this.right.forEachLine(e,i,s,a,l,o);else{let c=this.lineAt(l,se.ByPos,s,n,r);e<c.from&&this.left.forEachLine(e,c.from-1,s,n,r,o),c.to>=e&&c.from<=i&&o(c),i>c.to&&this.right.forEachLine(c.to+1,i,s,a,l,o)}}replace(e,i,s){let n=this.left.length+this.break;if(i<n)return this.balanced(this.left.replace(e,i,s),this.right);if(e>this.left.length)return this.balanced(this.left,this.right.replace(e-n,i-n,s));let r=[];e>0&&this.decomposeLeft(e,r);let o=r.length;for(let a of s)r.push(a);if(e>0&&Vc(r,o-1),i<this.length){let a=r.length;this.decomposeRight(i,r),Vc(r,a)}return Ie.of(r)}decomposeLeft(e,i){let s=this.left.length;if(e<=s)return this.left.decomposeLeft(e,i);i.push(this.left),this.break&&(s++,e>=s&&i.push(null)),e>s&&this.right.decomposeLeft(e-s,i)}decomposeRight(e,i){let s=this.left.length,n=s+this.break;if(e>=n)return this.right.decomposeRight(e-n,i);e<s&&this.left.decomposeRight(e,i),this.break&&e<n&&i.push(null),i.push(this.right)}balanced(e,i){return e.size>2*i.size||i.size>2*e.size?Ie.of(this.break?[e,null,i]:[e,i]):(this.left=Or(this.left,e),this.right=Or(this.right,i),this.setHeight(e.height+i.height),this.outdated=e.outdated||i.outdated,this.size=e.size+i.size,this.length=e.length+this.break+i.length,this)}updateHeight(e,i=0,s=!1,n){let{left:r,right:o}=this,a=i+r.length+this.break,l=null;return n&&n.from<=i+r.length&&n.more?l=r=r.updateHeight(e,i,s,n):r.updateHeight(e,i,s),n&&n.from<=a+o.length&&n.more?l=o=o.updateHeight(e,a,s,n):o.updateHeight(e,a,s),l?this.balanced(r,o):(this.height=this.left.height+this.right.height,this.outdated=!1,this)}toString(){return this.left+(this.break?" ":"-")+this.right}}function Vc(t,e){let i,s;t[e]==null&&(i=t[e-1])instanceof Ce&&(s=t[e+1])instanceof Ce&&t.splice(e-1,3,new Ce(i.length+1+s.length))}const Lb=5;class kl{constructor(e,i){this.pos=e,this.oracle=i,this.nodes=[],this.lineStart=-1,this.lineEnd=-1,this.covering=null,this.writtenTo=e}get isCovered(){return this.covering&&this.nodes[this.nodes.length-1]==this.covering}span(e,i){if(this.lineStart>-1){let s=Math.min(i,this.lineEnd),n=this.nodes[this.nodes.length-1];n instanceof Xe?n.length+=s-this.pos:(s>this.pos||!this.isCovered)&&this.nodes.push(new Xe(s-this.pos,-1,0)),this.writtenTo=s,i>s&&(this.nodes.push(null),this.writtenTo++,this.lineStart=-1)}this.pos=i}point(e,i,s){if(e<i||s.heightRelevant){let n=s.widget?s.widget.estimatedHeight:0,r=s.widget?s.widget.lineBreaks:0;n<0&&(n=this.oracle.lineHeight);let o=i-e;s.block?this.addBlock(new Rf(o,n,s)):(o||r||n>=Lb)&&this.addLineDeco(n,r,o)}else i>e&&this.span(e,i);this.lineEnd>-1&&this.lineEnd<this.pos&&(this.lineEnd=this.oracle.doc.lineAt(this.pos).to)}enterLine(){if(this.lineStart>-1)return;let{from:e,to:i}=this.oracle.doc.lineAt(this.pos);this.lineStart=e,this.lineEnd=i,this.writtenTo<e&&((this.writtenTo<e-1||this.nodes[this.nodes.length-1]==null)&&this.nodes.push(this.blankContent(this.writtenTo,e-1)),this.nodes.push(null)),this.pos>e&&this.nodes.push(new Xe(this.pos-e,-1,0)),this.writtenTo=this.pos}blankContent(e,i){let s=new Ce(i-e);return this.oracle.doc.lineAt(e).to==i&&(s.flags|=4),s}ensureLine(){this.enterLine();let e=this.nodes.length?this.nodes[this.nodes.length-1]:null;if(e instanceof Xe)return e;let i=new Xe(0,-1,0);return this.nodes.push(i),i}addBlock(e){this.enterLine();let i=e.deco;i&&i.startSide>0&&!this.isCovered&&this.ensureLine(),this.nodes.push(e),this.writtenTo=this.pos=this.pos+e.length,i&&i.endSide>0&&(this.covering=e)}addLineDeco(e,i,s){let n=this.ensureLine();n.length+=s,n.collapsed+=s,n.widgetHeight=Math.max(n.widgetHeight,e),n.breaks+=i,this.writtenTo=this.pos=this.pos+s}finish(e){let i=this.nodes.length==0?null:this.nodes[this.nodes.length-1];this.lineStart>-1&&!(i instanceof Xe)&&!this.isCovered?this.nodes.push(new Xe(0,-1,0)):(this.writtenTo<this.pos||i==null)&&this.nodes.push(this.blankContent(this.writtenTo,this.pos));let s=e;for(let n of this.nodes)n instanceof Xe&&n.updateHeight(this.oracle,s),s+=n?n.length:1;return this.nodes}static build(e,i,s,n){let r=new kl(s,e);return q.spans(i,s,n,r,0),r.finish(s)}}function Ib(t,e,i){let s=new Fb;return q.compare(t,e,i,s,0),s.changes}class Fb{constructor(){this.changes=[]}compareRange(){}comparePoint(e,i,s,n){(e<i||s&&s.heightRelevant||n&&n.heightRelevant)&&rs(e,i,this.changes,5)}}function Nb(t,e){let i=t.getBoundingClientRect(),s=t.ownerDocument,n=s.defaultView||window,r=Math.max(0,i.left),o=Math.min(n.innerWidth,i.right),a=Math.max(0,i.top),l=Math.min(n.innerHeight,i.bottom);for(let c=t.parentNode;c&&c!=s.body;)if(c.nodeType==1){let h=c,d=window.getComputedStyle(h);if((h.scrollHeight>h.clientHeight||h.scrollWidth>h.clientWidth)&&d.overflow!="visible"){let f=h.getBoundingClientRect();r=Math.max(r,f.left),o=Math.min(o,f.right),a=Math.max(a,f.top),l=Math.min(c==t.parentNode?n.innerHeight:l,f.bottom)}c=d.position=="absolute"||d.position=="fixed"?h.offsetParent:h.parentNode}else if(c.nodeType==11)c=c.host;else break;return{left:r-i.left,right:Math.max(r,o)-i.left,top:a-(i.top+e),bottom:Math.max(a,l)-(i.top+e)}}function zb(t){let e=t.getBoundingClientRect(),i=t.ownerDocument.defaultView||window;return e.left<i.innerWidth&&e.right>0&&e.top<i.innerHeight&&e.bottom>0}function Hb(t,e){let i=t.getBoundingClientRect();return{left:0,right:i.right-i.left,top:e,bottom:i.bottom-(i.top+e)}}class To{constructor(e,i,s,n){this.from=e,this.to=i,this.size=s,this.displaySize=n}static same(e,i){if(e.length!=i.length)return!1;for(let s=0;s<e.length;s++){let n=e[s],r=i[s];if(n.from!=r.from||n.to!=r.to||n.size!=r.size)return!1}return!0}draw(e,i){return N.replace({widget:new Wb(this.displaySize*(i?e.scaleY:e.scaleX),i)}).range(this.from,this.to)}}class Wb extends Jt{constructor(e,i){super(),this.size=e,this.vertical=i}eq(e){return e.size==this.size&&e.vertical==this.vertical}toDOM(){let e=document.createElement("div");return this.vertical?e.style.height=this.size+"px":(e.style.width=this.size+"px",e.style.height="2px",e.style.display="inline-block"),e}get estimatedHeight(){return this.vertical?this.size:-1}}class Qc{constructor(e,i){this.view=e,this.state=i,this.pixelViewport={left:0,right:window.innerWidth,top:0,bottom:0},this.inView=!0,this.paddingTop=0,this.paddingBottom=0,this.contentDOMWidth=0,this.contentDOMHeight=0,this.editorHeight=0,this.editorWidth=0,this.scaleX=1,this.scaleY=1,this.scrollOffset=0,this.scrolledToBottom=!1,this.scrollAnchorPos=0,this.scrollAnchorHeight=-1,this.scaler=jc,this.scrollTarget=null,this.printing=!1,this.mustMeasureContent=!0,this.defaultTextDirection=ee.LTR,this.visibleRanges=[],this.mustEnforceCursorAssoc=!1;let s=i.facet(vl).some(n=>typeof n!="function"&&n.class=="cm-lineWrapping");this.heightOracle=new Db(s),this.stateDeco=Kc(i),this.heightMap=Ie.empty().applyChanges(this.stateDeco,K.empty,this.heightOracle.setDoc(i.doc),[new tt(0,0,0,i.doc.length)]);for(let n=0;n<2&&(this.viewport=this.getViewport(0,null),!!this.updateForViewport());n++);this.updateViewportLines(),this.lineGaps=this.ensureLineGaps([]),this.lineGapDeco=N.set(this.lineGaps.map(n=>n.draw(this,!1))),this.scrollParent=e.scrollDOM,this.computeVisibleRanges()}updateForViewport(){let e=[this.viewport],{main:i}=this.state.selection;for(let s=0;s<=1;s++){let n=s?i.head:i.anchor;if(!e.some(({from:r,to:o})=>n>=r&&n<=o)){let{from:r,to:o}=this.lineBlockAt(n);e.push(new In(r,o))}}return this.viewports=e.sort((s,n)=>s.from-n.from),this.updateScaler()}updateScaler(){let e=this.scaler;return this.scaler=this.heightMap.height<=7e6?jc:new Sl(this.heightOracle,this.heightMap,this.viewports),e.eq(this.scaler)?0:2}updateViewportLines(){this.viewportLines=[],this.heightMap.forEachLine(this.viewport.from,this.viewport.to,this.heightOracle.setDoc(this.state.doc),0,0,e=>{this.viewportLines.push(Is(e,this.scaler))})}update(e,i=null){this.state=e.state;let s=this.stateDeco;this.stateDeco=Kc(this.state);let n=e.changedRanges,r=tt.extendWithRanges(n,Ib(s,this.stateDeco,e?e.changes:me.empty(this.state.doc.length))),o=this.heightMap.height,a=this.scrolledToBottom?null:this.scrollAnchorAt(this.scrollOffset);qc(),this.heightMap=this.heightMap.applyChanges(this.stateDeco,e.startState.doc,this.heightOracle.setDoc(this.state.doc),r),(this.heightMap.height!=o||bs)&&(e.flags|=2),a?(this.scrollAnchorPos=e.changes.mapPos(a.from,-1),this.scrollAnchorHeight=a.top):(this.scrollAnchorPos=-1,this.scrollAnchorHeight=o);let l=r.length?this.mapViewport(this.viewport,e.changes):this.viewport;(i&&(i.range.head<l.from||i.range.head>l.to)||!this.viewportIsAppropriate(l))&&(l=this.getViewport(0,i));let c=l.from!=this.viewport.from||l.to!=this.viewport.to;this.viewport=l,e.flags|=this.updateForViewport(),(c||!e.changes.empty||e.flags&2)&&this.updateViewportLines(),(this.lineGaps.length||this.viewport.to-this.viewport.from>4e3)&&this.updateLineGaps(this.ensureLineGaps(this.mapLineGaps(this.lineGaps,e.changes))),e.flags|=this.computeVisibleRanges(e.changes),i&&(this.scrollTarget=i),!this.mustEnforceCursorAssoc&&(e.selectionSet||e.focusChanged)&&e.view.lineWrapping&&e.state.selection.main.empty&&e.state.selection.main.assoc&&!e.state.facet(pf)&&(this.mustEnforceCursorAssoc=!0)}measure(){let{view:e}=this,i=e.contentDOM,s=window.getComputedStyle(i),n=this.heightOracle,r=s.whiteSpace;this.defaultTextDirection=s.direction=="rtl"?ee.RTL:ee.LTR;let o=this.heightOracle.mustRefreshForWrapping(r)||this.mustMeasureContent==="refresh",a=i.getBoundingClientRect(),l=o||this.mustMeasureContent||this.contentDOMHeight!=a.height;this.contentDOMHeight=a.height,this.mustMeasureContent=!1;let c=0,h=0;if(a.width&&a.height){let{scaleX:A,scaleY:$}=Xd(i,a);(A>.005&&Math.abs(this.scaleX-A)>.005||$>.005&&Math.abs(this.scaleY-$)>.005)&&(this.scaleX=A,this.scaleY=$,c|=16,o=l=!0)}let d=(parseInt(s.paddingTop)||0)*this.scaleY,f=(parseInt(s.paddingBottom)||0)*this.scaleY;(this.paddingTop!=d||this.paddingBottom!=f)&&(this.paddingTop=d,this.paddingBottom=f,c|=18),this.editorWidth!=e.scrollDOM.clientWidth&&(n.lineWrapping&&(l=!0),this.editorWidth=e.scrollDOM.clientWidth,c|=16);let u=Jd(this.view.contentDOM,!1).y;u!=this.scrollParent&&(this.scrollParent=u,this.scrollAnchorHeight=-1,this.scrollOffset=0);let p=this.getScrollOffset();this.scrollOffset!=p&&(this.scrollAnchorHeight=-1,this.scrollOffset=p),this.scrolledToBottom=Gd(this.scrollParent||e.win);let m=(this.printing?Hb:Nb)(i,this.paddingTop),b=m.top-this.pixelViewport.top,x=m.bottom-this.pixelViewport.bottom;this.pixelViewport=m;let k=this.pixelViewport.bottom>this.pixelViewport.top&&this.pixelViewport.right>this.pixelViewport.left;if(k!=this.inView&&(this.inView=k,k&&(l=!0)),!this.inView&&!this.scrollTarget&&!zb(e.dom))return 0;let O=a.width;if((this.contentDOMWidth!=O||this.editorHeight!=e.scrollDOM.clientHeight)&&(this.contentDOMWidth=a.width,this.editorHeight=e.scrollDOM.clientHeight,c|=16),l){let A=e.docView.measureVisibleLineHeights(this.viewport);if(n.mustRefreshForHeights(A)&&(o=!0),o||n.lineWrapping&&Math.abs(O-this.contentDOMWidth)>n.charWidth){let{lineHeight:$,charWidth:P,textHeight:z}=e.docView.measureTextSize();o=$>0&&n.refresh(r,$,P,z,Math.max(5,O/P),A),o&&(e.docView.minWidth=0,c|=16)}b>0&&x>0?h=Math.max(b,x):b<0&&x<0&&(h=Math.min(b,x)),qc();for(let $ of this.viewports){let P=$.from==this.viewport.from?A:e.docView.measureVisibleLineHeights($);this.heightMap=(o?Ie.empty().applyChanges(this.stateDeco,K.empty,this.heightOracle,[new tt(0,0,0,e.state.doc.length)]):this.heightMap).updateHeight(n,0,o,new _b($.from,P))}bs&&(c|=2)}let R=!this.viewportIsAppropriate(this.viewport,h)||this.scrollTarget&&(this.scrollTarget.range.head<this.viewport.from||this.scrollTarget.range.head>this.viewport.to);return R&&(c&2&&(c|=this.updateScaler()),this.viewport=this.getViewport(h,this.scrollTarget),c|=this.updateForViewport()),(c&2||R)&&this.updateViewportLines(),(this.lineGaps.length||this.viewport.to-this.viewport.from>4e3)&&this.updateLineGaps(this.ensureLineGaps(o?[]:this.lineGaps,e)),c|=this.computeVisibleRanges(),this.mustEnforceCursorAssoc&&(this.mustEnforceCursorAssoc=!1,e.docView.enforceCursorAssoc()),c}get visibleTop(){return this.scaler.fromDOM(this.pixelViewport.top)}get visibleBottom(){return this.scaler.fromDOM(this.pixelViewport.bottom)}getViewport(e,i){let s=.5-Math.max(-.5,Math.min(.5,e/1e3/2)),n=this.heightMap,r=this.heightOracle,{visibleTop:o,visibleBottom:a}=this,l=new In(n.lineAt(o-s*1e3,se.ByHeight,r,0,0).from,n.lineAt(a+(1-s)*1e3,se.ByHeight,r,0,0).to);if(i){let{head:c}=i.range;if(c<l.from||c>l.to){let h=Math.min(this.editorHeight,this.pixelViewport.bottom-this.pixelViewport.top),d=n.lineAt(c,se.ByPos,r,0,0),f;i.y=="center"?f=(d.top+d.bottom)/2-h/2:i.y=="start"||i.y=="nearest"&&c<l.from?f=d.top:f=d.bottom-h,l=new In(n.lineAt(f-1e3/2,se.ByHeight,r,0,0).from,n.lineAt(f+h+1e3/2,se.ByHeight,r,0,0).to)}}return l}mapViewport(e,i){let s=i.mapPos(e.from,-1),n=i.mapPos(e.to,1);return new In(this.heightMap.lineAt(s,se.ByPos,this.heightOracle,0,0).from,this.heightMap.lineAt(n,se.ByPos,this.heightOracle,0,0).to)}viewportIsAppropriate({from:e,to:i},s=0){if(!this.inView)return!0;let{top:n}=this.heightMap.lineAt(e,se.ByPos,this.heightOracle,0,0),{bottom:r}=this.heightMap.lineAt(i,se.ByPos,this.heightOracle,0,0),{visibleTop:o,visibleBottom:a}=this;return(e==0||n<=o-Math.max(10,Math.min(-s,250)))&&(i==this.state.doc.length||r>=a+Math.max(10,Math.min(s,250)))&&n>o-2*1e3&&r<a+2*1e3}mapLineGaps(e,i){if(!e.length||i.empty)return e;let s=[];for(let n of e)i.touchesRange(n.from,n.to)||s.push(new To(i.mapPos(n.from),i.mapPos(n.to),n.size,n.displaySize));return s}ensureLineGaps(e,i){let s=this.heightOracle.lineWrapping,n=s?1e4:2e3,r=n>>1,o=n<<1;if(this.defaultTextDirection!=ee.LTR&&!s)return[];let a=[],l=(h,d,f,u)=>{if(d-h<r)return;let p=this.state.selection.main,m=[p.from];p.empty||m.push(p.to);for(let x of m)if(x>h&&x<d){l(h,x-10,f,u),l(x+10,d,f,u);return}let b=qb(e,x=>x.from>=f.from&&x.to<=f.to&&Math.abs(x.from-h)<r&&Math.abs(x.to-d)<r&&!m.some(k=>x.from<k&&x.to>k));if(!b){if(d<f.to&&i&&s&&i.visibleRanges.some(O=>O.from<=d&&O.to>=d)){let O=i.moveToLineBoundary(S.cursor(d),!1,!0).head;O>h&&(d=O)}let x=this.gapSize(f,h,d,u),k=s||x<2e6?x:2e6;b=new To(h,d,x,k)}a.push(b)},c=h=>{if(h.length<o||h.type!=Ae.Text)return;let d=Ub(h.from,h.to,this.stateDeco);if(d.total<o)return;let f=this.scrollTarget?this.scrollTarget.range.head:null,u,p;if(s){let m=n/this.heightOracle.lineLength*this.heightOracle.lineHeight,b,x;if(f!=null){let k=Nn(d,f),O=((this.visibleBottom-this.visibleTop)/2+m)/h.height;b=k-O,x=k+O}else b=(this.visibleTop-h.top-m)/h.height,x=(this.visibleBottom-h.top+m)/h.height;u=Fn(d,b),p=Fn(d,x)}else{let m=d.total*this.heightOracle.charWidth,b=n*this.heightOracle.charWidth,x=0;if(m>2e6)for(let $ of e)$.from>=h.from&&$.from<h.to&&$.size!=$.displaySize&&$.from*this.heightOracle.charWidth+x<this.pixelViewport.left&&(x=$.size-$.displaySize);let k=this.pixelViewport.left+x,O=this.pixelViewport.right+x,R,A;if(f!=null){let $=Nn(d,f),P=((O-k)/2+b)/m;R=$-P,A=$+P}else R=(k-b)/m,A=(O+b)/m;u=Fn(d,R),p=Fn(d,A)}u>h.from&&l(h.from,u,h,d),p<h.to&&l(p,h.to,h,d)};for(let h of this.viewportLines)Array.isArray(h.type)?h.type.forEach(c):c(h);return a}gapSize(e,i,s,n){let r=Nn(n,s)-Nn(n,i);return this.heightOracle.lineWrapping?e.height*r:n.total*this.heightOracle.charWidth*r}updateLineGaps(e){To.same(e,this.lineGaps)||(this.lineGaps=e,this.lineGapDeco=N.set(e.map(i=>i.draw(this,this.heightOracle.lineWrapping))))}computeVisibleRanges(e){let i=this.stateDeco;this.lineGaps.length&&(i=i.concat(this.lineGapDeco));let s=[];q.spans(i,this.viewport.from,this.viewport.to,{span(r,o){s.push({from:r,to:o})},point(){}},20);let n=0;if(s.length!=this.visibleRanges.length)n=12;else for(let r=0;r<s.length&&!(n&8);r++){let o=this.visibleRanges[r],a=s[r];(o.from!=a.from||o.to!=a.to)&&(n|=4,e&&e.mapPos(o.from,-1)==a.from&&e.mapPos(o.to,1)==a.to||(n|=8))}return this.visibleRanges=s,n}lineBlockAt(e){return e>=this.viewport.from&&e<=this.viewport.to&&this.viewportLines.find(i=>i.from<=e&&i.to>=e)||Is(this.heightMap.lineAt(e,se.ByPos,this.heightOracle,0,0),this.scaler)}lineBlockAtHeight(e){return e>=this.viewportLines[0].top&&e<=this.viewportLines[this.viewportLines.length-1].bottom&&this.viewportLines.find(i=>i.top<=e&&i.bottom>=e)||Is(this.heightMap.lineAt(this.scaler.fromDOM(e),se.ByHeight,this.heightOracle,0,0),this.scaler)}getScrollOffset(){return(this.scrollParent==this.view.scrollDOM?this.scrollParent.scrollTop:(this.scrollParent?this.scrollParent.getBoundingClientRect().top:0)-this.view.contentDOM.getBoundingClientRect().top)*this.scaleY}scrollAnchorAt(e){let i=this.lineBlockAtHeight(e+8);return i.from>=this.viewport.from||this.viewportLines[0].top-e>200?i:this.viewportLines[0]}elementAtHeight(e){return Is(this.heightMap.blockAt(this.scaler.fromDOM(e),this.heightOracle,0,0),this.scaler)}get docHeight(){return this.scaler.toDOM(this.heightMap.height)}get contentHeight(){return this.docHeight+this.paddingTop+this.paddingBottom}}class In{constructor(e,i){this.from=e,this.to=i}}function Ub(t,e,i){let s=[],n=t,r=0;return q.spans(i,t,e,{span(){},point(o,a){o>n&&(s.push({from:n,to:o}),r+=o-n),n=a}},20),n<e&&(s.push({from:n,to:e}),r+=e-n),{total:r,ranges:s}}function Fn({total:t,ranges:e},i){if(i<=0)return e[0].from;if(i>=1)return e[e.length-1].to;let s=Math.floor(t*i);for(let n=0;;n++){let{from:r,to:o}=e[n],a=o-r;if(s<=a)return r+s;s-=a}}function Nn(t,e){let i=0;for(let{from:s,to:n}of t.ranges){if(e<=n){i+=e-s;break}i+=n-s}return i/t.total}function qb(t,e){for(let i of t)if(e(i))return i}const jc={toDOM(t){return t},fromDOM(t){return t},scale:1,eq(t){return t==this}};function Kc(t){let e=t.facet(Gr).filter(s=>typeof s!="function"),i=t.facet(yl).filter(s=>typeof s!="function");return i.length&&e.push(q.join(i)),e}class Sl{constructor(e,i,s){let n=0,r=0,o=0;this.viewports=s.map(({from:a,to:l})=>{let c=i.lineAt(a,se.ByPos,e,0,0).top,h=i.lineAt(l,se.ByPos,e,0,0).bottom;return n+=h-c,{from:a,to:l,top:c,bottom:h,domTop:0,domBottom:0}}),this.scale=(7e6-n)/(i.height-n);for(let a of this.viewports)a.domTop=o+(a.top-r)*this.scale,o=a.domBottom=a.domTop+(a.bottom-a.top),r=a.bottom}toDOM(e){for(let i=0,s=0,n=0;;i++){let r=i<this.viewports.length?this.viewports[i]:null;if(!r||e<r.top)return n+(e-s)*this.scale;if(e<=r.bottom)return r.domTop+(e-r.top);s=r.bottom,n=r.domBottom}}fromDOM(e){for(let i=0,s=0,n=0;;i++){let r=i<this.viewports.length?this.viewports[i]:null;if(!r||e<r.domTop)return s+(e-n)/this.scale;if(e<=r.domBottom)return r.top+(e-r.domTop);s=r.bottom,n=r.domBottom}}eq(e){return e instanceof Sl?this.scale==e.scale&&this.viewports.length==e.viewports.length&&this.viewports.every((i,s)=>i.from==e.viewports[s].from&&i.to==e.viewports[s].to):!1}}function Is(t,e){if(e.scale==1)return t;let i=e.toDOM(t.top),s=e.toDOM(t.bottom);return new lt(t.from,t.length,i,s-i,Array.isArray(t._content)?t._content.map(n=>Is(n,e)):t._content)}const zn=D.define({combine:t=>t.join(" ")}),Ma=D.define({combine:t=>t.indexOf(!0)>-1}),Ea=li.newName(),Lf=li.newName(),If=li.newName(),Ff={"&light":"."+Lf,"&dark":"."+If};function Da(t,e,i){return new li(e,{finish(s){return/&/.test(s)?s.replace(/&\w*/,n=>{if(n=="&")return t;if(!i||!i[n])throw new RangeError(`Unsupported selector: ${n}`);return i[n]}):t+" "+s}})}const Vb=Da("."+Ea,{"&":{position:"relative !important",boxSizing:"border-box","&.cm-focused":{outline:"1px dotted #212121"},display:"flex !important",flexDirection:"column"},".cm-scroller":{display:"flex !important",alignItems:"flex-start !important",fontFamily:"monospace",lineHeight:1.4,height:"100%",overflowX:"auto",position:"relative",zIndex:0,overflowAnchor:"none"},".cm-content":{margin:0,flexGrow:2,flexShrink:0,display:"block",whiteSpace:"pre",wordWrap:"normal",boxSizing:"border-box",minHeight:"100%",padding:"4px 0",outline:"none","&[contenteditable=true]":{WebkitUserModify:"read-write-plaintext-only"}},".cm-lineWrapping":{whiteSpace_fallback:"pre-wrap",whiteSpace:"break-spaces",wordBreak:"break-word",overflowWrap:"anywhere",flexShrink:1},"&light .cm-content":{caretColor:"black"},"&dark .cm-content":{caretColor:"white"},".cm-line":{display:"block",padding:"0 2px 0 6px"},".cm-layer":{position:"absolute",left:0,top:0,contain:"size style","& > *":{position:"absolute"}},"&light .cm-selectionBackground":{background:"#d9d9d9"},"&dark .cm-selectionBackground":{background:"#222"},"&light.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground":{background:"#d7d4f0"},"&dark.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground":{background:"#233"},".cm-cursorLayer":{pointerEvents:"none"},"&.cm-focused > .cm-scroller > .cm-cursorLayer":{animation:"steps(1) cm-blink 1.2s infinite"},"@keyframes cm-blink":{"0%":{},"50%":{opacity:0},"100%":{}},"@keyframes cm-blink2":{"0%":{},"50%":{opacity:0},"100%":{}},".cm-cursor, .cm-dropCursor":{borderLeft:"1.2px solid black",marginLeft:"-0.6px",pointerEvents:"none"},".cm-cursor":{display:"none"},"&dark .cm-cursor":{borderLeftColor:"#ddd"},".cm-selectionHandle":{backgroundColor:"currentColor",width:"1.5px"},".cm-selectionHandle-start::before, .cm-selectionHandle-end::before":{content:'""',backgroundColor:"inherit",borderRadius:"50%",width:"8px",height:"8px",position:"absolute",left:"-3.25px"},".cm-selectionHandle-start::before":{top:"-8px"},".cm-selectionHandle-end::before":{bottom:"-8px"},".cm-dropCursor":{position:"absolute"},"&.cm-focused > .cm-scroller > .cm-cursorLayer .cm-cursor":{display:"block"},".cm-iso":{unicodeBidi:"isolate"},".cm-announced":{position:"fixed",top:"-10000px"},"@media print":{".cm-announced":{display:"none"}},"&light .cm-activeLine":{backgroundColor:"#cceeff44"},"&dark .cm-activeLine":{backgroundColor:"#99eeff33"},"&light .cm-specialChar":{color:"red"},"&dark .cm-specialChar":{color:"#f78"},".cm-gutters":{flexShrink:0,display:"flex",height:"100%",boxSizing:"border-box",zIndex:200},".cm-gutters-before":{insetInlineStart:0},".cm-gutters-after":{insetInlineEnd:0},"&light .cm-gutters":{backgroundColor:"#f5f5f5",color:"#6c6c6c",border:"0px solid #ddd","&.cm-gutters-before":{borderRightWidth:"1px"},"&.cm-gutters-after":{borderLeftWidth:"1px"}},"&dark .cm-gutters":{backgroundColor:"#333338",color:"#ccc"},".cm-gutter":{display:"flex !important",flexDirection:"column",flexShrink:0,boxSizing:"border-box",minHeight:"100%",overflow:"hidden"},".cm-gutterElement":{boxSizing:"border-box"},".cm-lineNumbers .cm-gutterElement":{padding:"0 3px 0 5px",minWidth:"20px",textAlign:"right",whiteSpace:"nowrap"},"&light .cm-activeLineGutter":{backgroundColor:"#e2f2ff"},"&dark .cm-activeLineGutter":{backgroundColor:"#222227"},".cm-panels":{boxSizing:"border-box",position:"sticky",left:0,right:0,zIndex:300},"&light .cm-panels":{backgroundColor:"#f5f5f5",color:"black"},"&light .cm-panels-top":{borderBottom:"1px solid #ddd"},"&light .cm-panels-bottom":{borderTop:"1px solid #ddd"},"&dark .cm-panels":{backgroundColor:"#333338",color:"white"},".cm-dialog":{padding:"2px 19px 4px 6px",position:"relative","& label":{fontSize:"80%"}},".cm-dialog-close":{position:"absolute",top:"3px",right:"4px",backgroundColor:"inherit",border:"none",font:"inherit",fontSize:"14px",padding:"0"},".cm-tab":{display:"inline-block",overflow:"hidden",verticalAlign:"bottom"},".cm-widgetBuffer":{verticalAlign:"text-top",height:"1em",width:0,display:"inline"},".cm-placeholder":{color:"#888",display:"inline-block",verticalAlign:"top",userSelect:"none"},".cm-highlightSpace":{backgroundImage:"radial-gradient(circle at 50% 55%, #aaa 20%, transparent 5%)",backgroundPosition:"center"},".cm-highlightTab":{backgroundImage:`url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="20"><path stroke="%23888" stroke-width="1" fill="none" d="M1 10H196L190 5M190 15L196 10M197 4L197 16"/></svg>')`,backgroundSize:"auto 100%",backgroundPosition:"right 90%",backgroundRepeat:"no-repeat"},".cm-trailingSpace":{backgroundColor:"#ff332255"},".cm-button":{verticalAlign:"middle",color:"inherit",fontSize:"70%",padding:".2em 1em",borderRadius:"1px"},"&light .cm-button":{backgroundImage:"linear-gradient(#eff1f5, #d9d9df)",border:"1px solid #888","&:active":{backgroundImage:"linear-gradient(#b4b4b4, #d0d3d6)"}},"&dark .cm-button":{backgroundImage:"linear-gradient(#393939, #111)",border:"1px solid #888","&:active":{backgroundImage:"linear-gradient(#111, #333)"}},".cm-textfield":{verticalAlign:"middle",color:"inherit",fontSize:"70%",border:"1px solid silver",padding:".2em .5em"},"&light .cm-textfield":{backgroundColor:"white"},"&dark .cm-textfield":{border:"1px solid #555",backgroundColor:"inherit"}},Ff),Qb={childList:!0,characterData:!0,subtree:!0,attributes:!0,characterDataOldValue:!0},Mo=E.ie&&E.ie_version<=11;class jb{constructor(e){this.view=e,this.active=!1,this.editContext=null,this.selectionRange=new Sm,this.selectionChanged=!1,this.delayedFlush=-1,this.resizeTimeout=-1,this.queue=[],this.delayedAndroidKey=null,this.flushingAndroidKey=-1,this.lastChange=0,this.scrollTargets=[],this.intersection=null,this.resizeScroll=null,this.intersecting=!1,this.gapIntersection=null,this.gaps=[],this.printQuery=null,this.parentCheck=-1,this.dom=e.contentDOM,this.observer=new MutationObserver(i=>{for(let s of i)this.queue.push(s);(E.ie&&E.ie_version<=11||E.ios&&e.composing)&&i.some(s=>s.type=="childList"&&s.removedNodes.length||s.type=="characterData"&&s.oldValue.length>s.target.nodeValue.length)?this.flushSoon():this.flush()}),window.EditContext&&E.android&&e.constructor.EDIT_CONTEXT!==!1&&!(E.chrome&&E.chrome_version<126)&&(this.editContext=new Xb(e),e.state.facet(Ht)&&(e.contentDOM.editContext=this.editContext.editContext)),Mo&&(this.onCharData=i=>{this.queue.push({target:i.target,type:"characterData",oldValue:i.prevValue}),this.flushSoon()}),this.onSelectionChange=this.onSelectionChange.bind(this),this.onResize=this.onResize.bind(this),this.onPrint=this.onPrint.bind(this),this.onScroll=this.onScroll.bind(this),window.matchMedia&&(this.printQuery=window.matchMedia("print")),typeof ResizeObserver=="function"&&(this.resizeScroll=new ResizeObserver(()=>{var i;((i=this.view.docView)===null||i===void 0?void 0:i.lastUpdate)<Date.now()-75&&this.onResize()}),this.resizeScroll.observe(e.scrollDOM)),this.addWindowListeners(this.win=e.win),this.start(),typeof IntersectionObserver=="function"&&(this.intersection=new IntersectionObserver(i=>{this.parentCheck<0&&(this.parentCheck=setTimeout(this.listenForScroll.bind(this),1e3)),i.length>0&&i[i.length-1].intersectionRatio>0!=this.intersecting&&(this.intersecting=!this.intersecting,this.intersecting!=this.view.inView&&this.onScrollChanged(document.createEvent("Event")))},{threshold:[0,.001]}),this.intersection.observe(this.dom),this.gapIntersection=new IntersectionObserver(i=>{i.length>0&&i[i.length-1].intersectionRatio>0&&this.onScrollChanged(document.createEvent("Event"))},{})),this.listenForScroll(),this.readSelectionRange()}onScrollChanged(e){this.view.inputState.runHandlers("scroll",e),this.intersecting&&this.view.measure()}onScroll(e){this.intersecting&&this.flush(!1),this.editContext&&this.view.requestMeasure(this.editContext.measureReq),this.onScrollChanged(e)}onResize(){this.resizeTimeout<0&&(this.resizeTimeout=setTimeout(()=>{this.resizeTimeout=-1,this.view.requestMeasure()},50))}onPrint(e){(e.type=="change"||!e.type)&&!e.matches||(this.view.viewState.printing=!0,this.view.measure(),setTimeout(()=>{this.view.viewState.printing=!1,this.view.requestMeasure()},500))}updateGaps(e){if(this.gapIntersection&&(e.length!=this.gaps.length||this.gaps.some((i,s)=>i!=e[s]))){this.gapIntersection.disconnect();for(let i of e)this.gapIntersection.observe(i);this.gaps=e}}onSelectionChange(e){let i=this.selectionChanged;if(!this.readSelectionRange()||this.delayedAndroidKey)return;let{view:s}=this,n=this.selectionRange;if(s.state.facet(Ht)?s.root.activeElement!=this.dom:!qs(this.dom,n))return;let r=n.anchorNode&&s.docView.tile.nearest(n.anchorNode);if(r&&r.isWidget()&&r.widget.ignoreEvent(e)){i||(this.selectionChanged=!1);return}(E.ie&&E.ie_version<=11||E.android&&E.chrome)&&!s.state.selection.main.empty&&n.focusNode&&Vs(n.focusNode,n.focusOffset,n.anchorNode,n.anchorOffset)?this.flushSoon():this.flush(!1)}readSelectionRange(){let{view:e}=this,i=on(e.root);if(!i)return!1;let s=E.safari&&e.root.nodeType==11&&e.root.activeElement==this.dom&&Kb(this.view,i)||i;if(!s||this.selectionRange.eq(s))return!1;let n=qs(this.dom,s);return n&&!this.selectionChanged&&e.inputState.lastFocusTime>Date.now()-200&&e.inputState.lastTouchTime<Date.now()-300&&Om(this.dom,s)?(this.view.inputState.lastFocusTime=0,e.docView.updateSelection(),!1):(this.selectionRange.setRange(s),n&&(this.selectionChanged=!0),!0)}setSelectionRange(e,i){this.selectionRange.set(e.node,e.offset,i.node,i.offset),this.selectionChanged=!1}clearSelectionRange(){this.selectionRange.set(null,0,null,0)}listenForScroll(){this.parentCheck=-1;let e=0,i=null;for(let s=this.dom;s;)if(s.nodeType==1)!i&&e<this.scrollTargets.length&&this.scrollTargets[e]==s?e++:i||(i=this.scrollTargets.slice(0,e)),i&&i.push(s),s=s.assignedSlot||s.parentNode;else if(s.nodeType==11)s=s.host;else break;if(e<this.scrollTargets.length&&!i&&(i=this.scrollTargets.slice(0,e)),i){for(let s of this.scrollTargets)s.removeEventListener("scroll",this.onScroll);for(let s of this.scrollTargets=i)s.addEventListener("scroll",this.onScroll)}}ignore(e){if(!this.active)return e();try{return this.stop(),e()}finally{this.start(),this.clear()}}start(){this.active||(this.observer.observe(this.dom,Qb),Mo&&this.dom.addEventListener("DOMCharacterDataModified",this.onCharData),this.active=!0)}stop(){this.active&&(this.active=!1,this.observer.disconnect(),Mo&&this.dom.removeEventListener("DOMCharacterDataModified",this.onCharData))}clear(){this.processRecords(),this.queue.length=0,this.selectionChanged=!1}delayAndroidKey(e,i){var s;if(!this.delayedAndroidKey){let n=()=>{let r=this.delayedAndroidKey;r&&(this.clearDelayedAndroidKey(),this.view.inputState.lastKeyCode=r.keyCode,this.view.inputState.lastKeyTime=Date.now(),!this.flush()&&r.force&&os(this.dom,r.key,r.keyCode))};this.flushingAndroidKey=this.view.win.requestAnimationFrame(n)}(!this.delayedAndroidKey||e=="Enter")&&(this.delayedAndroidKey={key:e,keyCode:i,force:this.lastChange<Date.now()-50||!!(!((s=this.delayedAndroidKey)===null||s===void 0)&&s.force)})}clearDelayedAndroidKey(){this.win.cancelAnimationFrame(this.flushingAndroidKey),this.delayedAndroidKey=null,this.flushingAndroidKey=-1}flushSoon(){this.delayedFlush<0&&(this.delayedFlush=this.view.win.requestAnimationFrame(()=>{this.delayedFlush=-1,this.flush()}))}forceFlush(){this.delayedFlush>=0&&(this.view.win.cancelAnimationFrame(this.delayedFlush),this.delayedFlush=-1),this.flush()}pendingRecords(){for(let e of this.observer.takeRecords())this.queue.push(e);return this.queue}processRecords(){let e=this.pendingRecords();e.length&&(this.queue=[]);let i=-1,s=-1,n=!1;for(let r of e){let o=this.readMutation(r);o&&(o.typeOver&&(n=!0),i==-1?{from:i,to:s}=o:(i=Math.min(o.from,i),s=Math.max(o.to,s)))}return{from:i,to:s,typeOver:n}}readChange(){let{from:e,to:i,typeOver:s}=this.processRecords(),n=this.selectionChanged&&qs(this.dom,this.selectionRange);if(e<0&&!n)return null;e>-1&&(this.lastChange=Date.now()),this.view.inputState.lastFocusTime=0,this.selectionChanged=!1;let r=new fb(this.view,e,i,s);return this.view.docView.domChanged={newSel:r.newSel?r.newSel.main:null},r}flush(e=!0){if(this.delayedFlush>=0||this.delayedAndroidKey)return!1;e&&this.readSelectionRange();let i=this.readChange();if(!i)return this.view.requestMeasure(),!1;let s=this.view.state,n=Of(this.view,i);return this.view.state==s&&(i.domChanged||i.newSel&&!Cr(this.view.state.selection,i.newSel.main))&&this.view.update([]),n}readMutation(e){let i=this.view.docView.tile.nearest(e.target);if(!i||i.isWidget())return null;if(i.markDirty(e.type=="attributes"),e.type=="childList"){let s=Xc(i,e.previousSibling||e.target.previousSibling,-1),n=Xc(i,e.nextSibling||e.target.nextSibling,1);return{from:s?i.posAfter(s):i.posAtStart,to:n?i.posBefore(n):i.posAtEnd,typeOver:!1}}else return e.type=="characterData"?{from:i.posAtStart,to:i.posAtEnd,typeOver:e.target.nodeValue==e.oldValue}:null}setWindow(e){e!=this.win&&(this.removeWindowListeners(this.win),this.win=e,this.addWindowListeners(this.win))}addWindowListeners(e){e.addEventListener("resize",this.onResize),this.printQuery?this.printQuery.addEventListener?this.printQuery.addEventListener("change",this.onPrint):this.printQuery.addListener(this.onPrint):e.addEventListener("beforeprint",this.onPrint),e.addEventListener("scroll",this.onScroll),e.document.addEventListener("selectionchange",this.onSelectionChange)}removeWindowListeners(e){e.removeEventListener("scroll",this.onScroll),e.removeEventListener("resize",this.onResize),this.printQuery?this.printQuery.removeEventListener?this.printQuery.removeEventListener("change",this.onPrint):this.printQuery.removeListener(this.onPrint):e.removeEventListener("beforeprint",this.onPrint),e.document.removeEventListener("selectionchange",this.onSelectionChange)}update(e){this.editContext&&(this.editContext.update(e),e.startState.facet(Ht)!=e.state.facet(Ht)&&(e.view.contentDOM.editContext=e.state.facet(Ht)?this.editContext.editContext:null))}destroy(){var e,i,s;this.stop(),(e=this.intersection)===null||e===void 0||e.disconnect(),(i=this.gapIntersection)===null||i===void 0||i.disconnect(),(s=this.resizeScroll)===null||s===void 0||s.disconnect();for(let n of this.scrollTargets)n.removeEventListener("scroll",this.onScroll);this.removeWindowListeners(this.win),clearTimeout(this.parentCheck),clearTimeout(this.resizeTimeout),this.win.cancelAnimationFrame(this.delayedFlush),this.win.cancelAnimationFrame(this.flushingAndroidKey),this.editContext&&(this.view.contentDOM.editContext=null,this.editContext.destroy())}}function Xc(t,e,i){for(;e;){let s=de.get(e);if(s&&s.parent==t)return s;let n=e.parentNode;e=n!=t.dom?n:i>0?e.nextSibling:e.previousSibling}return null}function Jc(t,e){let i=e.startContainer,s=e.startOffset,n=e.endContainer,r=e.endOffset,o=t.docView.domAtPos(t.state.selection.main.anchor,1);return Vs(o.node,o.offset,n,r)&&([i,s,n,r]=[n,r,i,s]),{anchorNode:i,anchorOffset:s,focusNode:n,focusOffset:r}}function Kb(t,e){if(e.getComposedRanges){let n=e.getComposedRanges(t.root)[0];if(n)return Jc(t,n)}let i=null;function s(n){n.preventDefault(),n.stopImmediatePropagation(),i=n.getTargetRanges()[0]}return t.contentDOM.addEventListener("beforeinput",s,!0),t.dom.ownerDocument.execCommand("indent"),t.contentDOM.removeEventListener("beforeinput",s,!0),i?Jc(t,i):null}class Xb{constructor(e){this.from=0,this.to=0,this.pendingContextChange=null,this.handlers=Object.create(null),this.composing=null,this.resetRange(e.state);let i=this.editContext=new window.EditContext({text:e.state.doc.sliceString(this.from,this.to),selectionStart:this.toContextPos(Math.max(this.from,Math.min(this.to,e.state.selection.main.anchor))),selectionEnd:this.toContextPos(e.state.selection.main.head)});this.handlers.textupdate=s=>{let n=e.state.selection.main,{anchor:r,head:o}=n,a=this.toEditorPos(s.updateRangeStart),l=this.toEditorPos(s.updateRangeEnd);e.inputState.composing>=0&&!this.composing&&(this.composing={contextBase:s.updateRangeStart,editorBase:a,drifted:!1});let c=l-a>s.text.length;a==this.from&&r<this.from?a=r:l==this.to&&r>this.to&&(l=r);let h=Af(e.state.sliceDoc(a,l),s.text,(c?n.from:n.to)-a,c?"end":null);if(!h){let f=S.single(this.toEditorPos(s.selectionStart),this.toEditorPos(s.selectionEnd));Cr(f,n)||e.dispatch({selection:f,userEvent:"select"});return}let d={from:h.from+a,to:h.toA+a,insert:K.of(s.text.slice(h.from,h.toB).split(`
`))};if((E.mac||E.android)&&d.from==o-1&&/^\. ?$/.test(s.text)&&e.contentDOM.getAttribute("autocorrect")=="off"&&(d={from:a,to:l,insert:K.of([s.text.replace("."," ")])}),this.pendingContextChange=d,!e.state.readOnly){let f=this.to-this.from+(d.to-d.from+d.insert.length);wl(e,d,S.single(this.toEditorPos(s.selectionStart,f),this.toEditorPos(s.selectionEnd,f)))}this.pendingContextChange&&(this.revertPending(e.state),this.setSelection(e.state)),d.from<d.to&&!d.insert.length&&e.inputState.composing>=0&&!/[\\p{Alphabetic}\\p{Number}_]/.test(i.text.slice(Math.max(0,s.updateRangeStart-1),Math.min(i.text.length,s.updateRangeStart+1)))&&this.handlers.compositionend(s)},this.handlers.characterboundsupdate=s=>{let n=[],r=null;for(let o=this.toEditorPos(s.rangeStart),a=this.toEditorPos(s.rangeEnd);o<a;o++){let l=e.coordsForChar(o);r=l&&new DOMRect(l.left,l.top,l.right-l.left,l.bottom-l.top)||r||new DOMRect,n.push(r)}i.updateCharacterBounds(s.rangeStart,n)},this.handlers.textformatupdate=s=>{let n=[];for(let r of s.getTextFormats()){let o=r.underlineStyle,a=r.underlineThickness;if(!/none/i.test(o)&&!/none/i.test(a)){let l=this.toEditorPos(r.rangeStart),c=this.toEditorPos(r.rangeEnd);if(l<c){let h=`text-decoration: underline ${/^[a-z]/.test(o)?o+" ":o=="Dashed"?"dashed ":o=="Squiggle"?"wavy ":""}${/thin/i.test(a)?1:2}px`;n.push(N.mark({attributes:{style:h}}).range(l,c))}}}e.dispatch({effects:mf.of(N.set(n))})},this.handlers.compositionstart=()=>{e.inputState.composing<0&&(e.inputState.composing=0,e.inputState.compositionFirstChange=!0)},this.handlers.compositionend=()=>{if(e.inputState.composing=-1,e.inputState.compositionFirstChange=null,this.composing){let{drifted:s}=this.composing;this.composing=null,s&&this.reset(e.state)}};for(let s in this.handlers)i.addEventListener(s,this.handlers[s]);this.measureReq={read:s=>{this.editContext.updateControlBounds(s.contentDOM.getBoundingClientRect());let n=on(s.root);n&&n.rangeCount&&this.editContext.updateSelectionBounds(n.getRangeAt(0).getBoundingClientRect())}}}applyEdits(e){let i=0,s=!1,n=this.pendingContextChange;return e.changes.iterChanges((r,o,a,l,c)=>{if(s)return;let h=c.length-(o-r);if(n&&o>=n.to)if(n.from==r&&n.to==o&&n.insert.eq(c)){n=this.pendingContextChange=null,i+=h,this.to+=h;return}else n=null,this.revertPending(e.state);if(r+=i,o+=i,o<=this.from)this.from+=h,this.to+=h;else if(r<this.to){if(r<this.from||o>this.to||this.to-this.from+c.length>3e4){s=!0;return}this.editContext.updateText(this.toContextPos(r),this.toContextPos(o),c.toString()),this.to+=h}i+=h}),n&&!s&&this.revertPending(e.state),!s}update(e){let i=this.pendingContextChange,s=e.startState.selection.main;this.composing&&(this.composing.drifted||!e.changes.touchesRange(s.from,s.to)&&e.transactions.some(n=>!n.isUserEvent("input.type")&&n.changes.touchesRange(this.from,this.to)))?(this.composing.drifted=!0,this.composing.editorBase=e.changes.mapPos(this.composing.editorBase)):!this.applyEdits(e)||!this.rangeIsValid(e.state)?(this.pendingContextChange=null,this.reset(e.state)):(e.docChanged||e.selectionSet||i)&&this.setSelection(e.state),(e.geometryChanged||e.docChanged||e.selectionSet)&&e.view.requestMeasure(this.measureReq)}resetRange(e){let{head:i}=e.selection.main;this.from=Math.max(0,i-1e4),this.to=Math.min(e.doc.length,i+1e4)}reset(e){this.resetRange(e),this.editContext.updateText(0,this.editContext.text.length,e.doc.sliceString(this.from,this.to)),this.setSelection(e)}revertPending(e){let i=this.pendingContextChange;this.pendingContextChange=null,this.editContext.updateText(this.toContextPos(i.from),this.toContextPos(i.from+i.insert.length),e.doc.sliceString(i.from,i.to))}setSelection(e){let{main:i}=e.selection,s=this.toContextPos(Math.max(this.from,Math.min(this.to,i.anchor))),n=this.toContextPos(i.head);(this.editContext.selectionStart!=s||this.editContext.selectionEnd!=n)&&this.editContext.updateSelection(s,n)}rangeIsValid(e){let{head:i}=e.selection.main;return!(this.from>0&&i-this.from<500||this.to<e.doc.length&&this.to-i<500||this.to-this.from>1e4*3)}toEditorPos(e,i=this.to-this.from){e=Math.min(e,i);let s=this.composing;return s&&s.drifted?s.editorBase+(e-s.contextBase):e+this.from}toContextPos(e){let i=this.composing;return i&&i.drifted?i.contextBase+(e-i.editorBase):e-this.from}destroy(){for(let e in this.handlers)this.editContext.removeEventListener(e,this.handlers[e])}}class _{get state(){return this.viewState.state}get viewport(){return this.viewState.viewport}get visibleRanges(){return this.viewState.visibleRanges}get inView(){return this.viewState.inView}get composing(){return!!this.inputState&&this.inputState.composing>0}get compositionStarted(){return!!this.inputState&&this.inputState.composing>=0}get root(){return this._root}get win(){return this.dom.ownerDocument.defaultView||window}constructor(e={}){var i;this.plugins=[],this.pluginMap=new Map,this.editorAttrs={},this.contentAttrs={},this.bidiCache=[],this.destroyed=!1,this.updateState=2,this.measureScheduled=-1,this.measureRequests=[],this.contentDOM=document.createElement("div"),this.scrollDOM=document.createElement("div"),this.scrollDOM.tabIndex=-1,this.scrollDOM.className="cm-scroller",this.scrollDOM.appendChild(this.contentDOM),this.announceDOM=document.createElement("div"),this.announceDOM.className="cm-announced",this.announceDOM.setAttribute("aria-live","polite"),this.dom=document.createElement("div"),this.dom.appendChild(this.announceDOM),this.dom.appendChild(this.scrollDOM),e.parent&&e.parent.appendChild(this.dom);let{dispatch:s}=e;this.dispatchTransactions=e.dispatchTransactions||s&&(n=>n.forEach(r=>s(r,this)))||(n=>this.update(n)),this.dispatch=this.dispatch.bind(this),this._root=e.root||Cm(e.parent)||document,this.viewState=new Qc(this,e.state||j.create(e)),e.scrollTo&&e.scrollTo.is(Bn)&&(this.viewState.scrollTarget=e.scrollTo.value.clip(this.viewState.state)),this.plugins=this.state.facet(Gi).map(n=>new Co(n));for(let n of this.plugins)n.update(this);this.observer=new jb(this),this.inputState=new mb(this),this.inputState.ensureHandlers(this.plugins),this.docView=new _c(this),this.mountStyles(),this.updateAttrs(),this.updateState=0,this.requestMeasure(),!((i=document.fonts)===null||i===void 0)&&i.ready&&document.fonts.ready.then(()=>{this.viewState.mustMeasureContent="refresh",this.requestMeasure()})}dispatch(...e){let i=e.length==1&&e[0]instanceof be?e:e.length==1&&Array.isArray(e[0])?e[0]:[this.state.update(...e)];this.dispatchTransactions(i,this)}update(e){if(this.updateState!=0)throw new Error("Calls to EditorView.update are not allowed while an update is in progress");let i=!1,s=!1,n,r=this.state;for(let f of e){if(f.startState!=r)throw new RangeError("Trying to update state with a transaction that doesn't start from the previous state.");r=f.state}if(this.destroyed){this.viewState.state=r;return}let o=this.hasFocus,a=0,l=null;e.some(f=>f.annotation(Df))?(this.inputState.notifiedFocused=o,a=1):o!=this.inputState.notifiedFocused&&(this.inputState.notifiedFocused=o,l=_f(r,o),l||(a=1));let c=this.observer.delayedAndroidKey,h=null;if(c?(this.observer.clearDelayedAndroidKey(),h=this.observer.readChange(),(h&&!this.state.doc.eq(r.doc)||!this.state.selection.eq(r.selection))&&(h=null)):this.observer.clear(),r.facet(j.phrases)!=this.state.facet(j.phrases))return this.setState(r);n=wr.create(this,r,e),n.flags|=a;let d=this.viewState.scrollTarget;try{this.updateState=2;for(let f of e){if(d&&(d=d.map(f.changes)),f.scrollIntoView){let{main:u}=f.state.selection,{x:p,y:m}=this.state.facet(_.cursorScrollMargin);d=new as(u.empty?u:S.cursor(u.head,u.head>u.anchor?-1:1),"nearest","nearest",m,p)}for(let u of f.effects)u.is(Bn)&&(d=u.value.clip(this.state))}this.viewState.update(n,d),this.bidiCache=Ar.update(this.bidiCache,n.changes),n.empty||(this.updatePlugins(n),this.inputState.update(n)),i=this.docView.update(n),this.state.facet(Ls)!=this.styleModules&&this.mountStyles(),s=this.updateAttrs(),this.showAnnouncements(e),this.docView.updateSelection(i,e.some(f=>f.isUserEvent("select.pointer")))}finally{this.updateState=0}if(n.startState.facet(zn)!=n.state.facet(zn)&&(this.viewState.mustMeasureContent=!0),(i||s||d||this.viewState.mustEnforceCursorAssoc||this.viewState.mustMeasureContent)&&this.requestMeasure(),i&&this.docViewUpdate(),!n.empty)for(let f of this.state.facet(Oa))try{f(n)}catch(u){He(this.state,u,"update listener")}(l||h)&&Promise.resolve().then(()=>{l&&this.state==l.startState&&this.dispatch(l),h&&!Of(this,h)&&c.force&&os(this.contentDOM,c.key,c.keyCode)})}setState(e){if(this.updateState!=0)throw new Error("Calls to EditorView.setState are not allowed while an update is in progress");if(this.destroyed){this.viewState.state=e;return}this.updateState=2;let i=this.hasFocus;try{for(let s of this.plugins)s.destroy(this);this.viewState=new Qc(this,e),this.plugins=e.facet(Gi).map(s=>new Co(s)),this.pluginMap.clear();for(let s of this.plugins)s.update(this);this.docView.destroy(),this.docView=new _c(this),this.inputState.ensureHandlers(this.plugins),this.mountStyles(),this.updateAttrs(),this.bidiCache=[]}finally{this.updateState=0}i&&this.focus(),this.requestMeasure()}updatePlugins(e){let i=e.startState.facet(Gi),s=e.state.facet(Gi);if(i!=s){let n=[];for(let r of s){let o=i.indexOf(r);if(o<0)n.push(new Co(r));else{let a=this.plugins[o];a.mustUpdate=e,n.push(a)}}for(let r of this.plugins)r.mustUpdate!=e&&r.destroy(this);this.plugins=n,this.pluginMap.clear()}else for(let n of this.plugins)n.mustUpdate=e;for(let n=0;n<this.plugins.length;n++)this.plugins[n].update(this);i!=s&&this.inputState.ensureHandlers(this.plugins)}docViewUpdate(){for(let e of this.plugins){let i=e.value;if(i&&i.docViewUpdate)try{i.docViewUpdate(this)}catch(s){He(this.state,s,"doc view update listener")}}}measure(e=!0){if(this.destroyed)return;if(this.measureScheduled>-1&&this.win.cancelAnimationFrame(this.measureScheduled),this.observer.delayedAndroidKey){this.measureScheduled=-1,this.requestMeasure();return}this.measureScheduled=0,e&&this.observer.forceFlush();let i=null,s=this.viewState.scrollParent,n=this.viewState.getScrollOffset(),{scrollAnchorPos:r,scrollAnchorHeight:o}=this.viewState;Math.abs(n-this.viewState.scrollOffset)>1&&(o=-1),this.viewState.scrollAnchorHeight=-1;try{for(let a=0;;a++){if(o<0)if(Gd(s||this.win))r=-1,o=this.viewState.heightMap.height;else{let u=this.viewState.scrollAnchorAt(n);r=u.from,o=u.top}this.updateState=1;let l=this.viewState.measure();if(!l&&!this.measureRequests.length&&this.viewState.scrollTarget==null)break;if(a>5){console.warn(this.measureRequests.length?"Measure loop restarted more than 5 times":"Viewport failed to stabilize");break}let c=[];l&4||([this.measureRequests,c]=[c,this.measureRequests]);let h=c.map(u=>{try{return u.read(this)}catch(p){return He(this.state,p),Yc}}),d=wr.create(this,this.state,[]),f=!1;d.flags|=l,i?i.flags|=l:i=d,this.updateState=2,d.empty||(this.updatePlugins(d),this.inputState.update(d),this.updateAttrs(),f=this.docView.update(d),f&&this.docViewUpdate());for(let u=0;u<c.length;u++)if(h[u]!=Yc)try{let p=c[u];p.write&&p.write(h[u],this)}catch(p){He(this.state,p)}if(f&&this.docView.updateSelection(!0),!d.viewportChanged&&this.measureRequests.length==0){if(this.viewState.editorHeight)if(this.viewState.scrollTarget){this.docView.scrollIntoView(this.viewState.scrollTarget),this.viewState.scrollTarget=null,o=-1;continue}else{let p=((r<0?this.viewState.heightMap.height:this.viewState.lineBlockAt(r).top)-o)/this.scaleY;if((p>1||p<-1)&&(s==this.scrollDOM||this.hasFocus||Math.max(this.inputState.lastWheelEvent,this.inputState.lastTouchTime)>Date.now()-100)){n=n+p,s?s.scrollTop+=p:this.win.scrollBy(0,p),o=-1;continue}}break}}}finally{this.updateState=0,this.measureScheduled=-1}if(i&&!i.empty)for(let a of this.state.facet(Oa))a(i)}get themeClasses(){return Ea+" "+(this.state.facet(Ma)?If:Lf)+" "+this.state.facet(zn)}updateAttrs(){let e=Gc(this,bf,{class:"cm-editor"+(this.hasFocus?" cm-focused ":" ")+this.themeClasses}),i={spellcheck:"false",autocorrect:"off",autocapitalize:"off",writingsuggestions:"false",translate:"no",contenteditable:this.state.facet(Ht)?"true":"false",class:"cm-content",style:`${E.tabSize}: ${this.state.tabSize}`,role:"textbox","aria-multiline":"true"};this.state.readOnly&&(i["aria-readonly"]="true"),Gc(this,vl,i);let s=this.observer.ignore(()=>{let n=$c(this.contentDOM,this.contentAttrs,i),r=$c(this.dom,this.editorAttrs,e);return n||r});return this.editorAttrs=e,this.contentAttrs=i,s}showAnnouncements(e){let i=!0;for(let s of e)for(let n of s.effects)if(n.is(_.announce)){i&&(this.announceDOM.textContent=""),i=!1;let r=this.announceDOM.appendChild(document.createElement("div"));r.textContent=n.value}}mountStyles(){this.styleModules=this.state.facet(Ls);let e=this.state.facet(_.cspNonce);li.mount(this.root,this.styleModules.concat(Vb).reverse(),e?{nonce:e}:void 0)}readMeasured(){if(this.updateState==2)throw new Error("Reading the editor layout isn't allowed during an update");this.updateState==0&&this.measureScheduled>-1&&this.measure(!1)}requestMeasure(e){if(this.measureScheduled<0&&(this.measureScheduled=this.win.requestAnimationFrame(()=>this.measure())),e){if(this.measureRequests.indexOf(e)>-1)return;if(e.key!=null){for(let i=0;i<this.measureRequests.length;i++)if(this.measureRequests[i].key===e.key){this.measureRequests[i]=e;return}}this.measureRequests.push(e)}}plugin(e){let i=this.pluginMap.get(e);return(i===void 0||i&&i.plugin!=e)&&this.pluginMap.set(e,i=this.plugins.find(s=>s.plugin==e)||null),i&&i.update(this).value}get documentTop(){return this.contentDOM.getBoundingClientRect().top+this.viewState.paddingTop}get documentPadding(){return{top:this.viewState.paddingTop,bottom:this.viewState.paddingBottom}}get scaleX(){return this.viewState.scaleX}get scaleY(){return this.viewState.scaleY}elementAtHeight(e){return this.readMeasured(),this.viewState.elementAtHeight(e)}lineBlockAtHeight(e){return this.readMeasured(),this.viewState.lineBlockAtHeight(e)}get viewportLineBlocks(){return this.viewState.viewportLines}lineBlockAt(e){return this.viewState.lineBlockAt(e)}get contentHeight(){return this.viewState.contentHeight}moveByChar(e,i,s){return Po(this,e,Bc(this,e,i,s))}moveByGroup(e,i){return Po(this,e,Bc(this,e,i,s=>ob(this,e.head,s)))}visualLineSide(e,i){let s=this.bidiSpans(e),n=this.textDirectionAt(e.from),r=s[i?s.length-1:0];return S.cursor(r.side(i,n)+e.from,r.forward(!i,n)?1:-1)}moveToLineBoundary(e,i,s=!0){return rb(this,e,i,s)}moveVertically(e,i,s){return Po(this,e,ab(this,e,i,s))}domAtPos(e,i=1){return this.docView.domAtPos(e,i)}posAtDOM(e,i=0){return this.docView.posFromDOM(e,i)}posAtCoords(e,i=!0){this.readMeasured();let s=Pa(this,e,i);return s&&s.pos}posAndSideAtCoords(e,i=!0){return this.readMeasured(),Pa(this,e,i)}coordsAtPos(e,i=1){this.readMeasured();let s=this.docView.coordsAt(e,i);if(!s||s.left==s.right)return s;let n=this.state.doc.lineAt(e),r=this.bidiSpans(n),o=r[$t.find(r,e-n.from,-1,i)];return xr(s,o.dir==ee.LTR==i>0)}coordsForChar(e){return this.readMeasured(),this.docView.coordsForChar(e)}get defaultCharacterWidth(){return this.viewState.heightOracle.charWidth}get defaultLineHeight(){return this.viewState.heightOracle.lineHeight}get textDirection(){return this.viewState.defaultTextDirection}textDirectionAt(e){return!this.state.facet(uf)||e<this.viewport.from||e>this.viewport.to?this.textDirection:(this.readMeasured(),this.docView.textDirectionAt(e))}get lineWrapping(){return this.viewState.heightOracle.lineWrapping}bidiSpans(e){if(e.length>Jb)return rf(e.length);let i=this.textDirectionAt(e.from),s;for(let r of this.bidiCache)if(r.from==e.from&&r.dir==i&&(r.fresh||nf(r.isolates,s=Mc(this,e))))return r.order;s||(s=Mc(this,e));let n=Dm(e.text,i,s);return this.bidiCache.push(new Ar(e.from,e.to,i,s,!0,n)),n}get hasFocus(){var e;return(this.dom.ownerDocument.hasFocus()||E.safari&&((e=this.inputState)===null||e===void 0?void 0:e.lastContextMenu)>Date.now()-3e4)&&this.root.activeElement==this.contentDOM}focus(){this.observer.ignore(()=>{Yd(this.contentDOM),this.docView.updateSelection()})}setRoot(e){this._root!=e&&(this._root=e,this.observer.setWindow((e.nodeType==9?e:e.ownerDocument).defaultView||window),this.mountStyles())}destroy(){this.root.activeElement==this.contentDOM&&this.contentDOM.blur();for(let e of this.plugins)e.destroy(this);this.plugins=[],this.inputState.destroy(),this.docView.destroy(),this.dom.remove(),this.observer.destroy(),this.measureScheduled>-1&&this.win.cancelAnimationFrame(this.measureScheduled),this.destroyed=!0}static scrollIntoView(e,i={}){var s,n,r,o;return Bn.of(new as(typeof e=="number"?S.cursor(e):e,(s=i.y)!==null&&s!==void 0?s:"nearest",(n=i.x)!==null&&n!==void 0?n:"nearest",(r=i.yMargin)!==null&&r!==void 0?r:5,(o=i.xMargin)!==null&&o!==void 0?o:5))}scrollSnapshot(){let{scrollTop:e,scrollLeft:i}=this.scrollDOM,s=this.viewState.scrollAnchorAt(e);return Bn.of(new as(S.cursor(s.from),"start","start",s.top-e,i,!0))}setTabFocusMode(e){e==null?this.inputState.tabFocusMode=this.inputState.tabFocusMode<0?0:-1:typeof e=="boolean"?this.inputState.tabFocusMode=e?0:-1:this.inputState.tabFocusMode!=0&&(this.inputState.tabFocusMode=Date.now()+e)}static domEventHandlers(e){return pe.define(()=>({}),{eventHandlers:e})}static domEventObservers(e){return pe.define(()=>({}),{eventObservers:e})}static theme(e,i){let s=li.newName(),n=[zn.of(s),Ls.of(Da(`.${s}`,e))];return i&&i.dark&&n.push(Ma.of(!0)),n}static baseTheme(e){return qi.lowest(Ls.of(Da("."+Ea,e,Ff)))}static findFromDOM(e){var i;let s=e.querySelector(".cm-content"),n=s&&de.get(s)||de.get(e);return((i=n==null?void 0:n.root)===null||i===void 0?void 0:i.view)||null}}_.styleModule=Ls;_.inputHandler=df;_.clipboardInputFilter=ml;_.clipboardOutputFilter=bl;_.scrollHandler=gf;_.focusChangeEffect=ff;_.perLineTextDirection=uf;_.exceptionSink=hf;_.updateListener=Oa;_.editable=Ht;_.mouseSelectionStyle=cf;_.dragMovesSelection=lf;_.clickAddsSelectionRange=af;_.decorations=Gr;_.blockWrappers=vf;_.outerDecorations=yl;_.atomicRanges=Cn;_.bidiIsolatedRanges=yf;_.cursorScrollMargin=D.define({combine:t=>{let e=5,i=5;for(let s of t)typeof s=="number"?e=i=s:{x:e,y:i}=s;return{x:e,y:i}}});_.scrollMargins=xf;_.darkTheme=Ma;_.cspNonce=D.define({combine:t=>t.length?t[0]:""});_.contentAttributes=vl;_.editorAttributes=bf;_.lineWrapping=_.contentAttributes.of({class:"cm-lineWrapping"});_.announce=H.define();const Jb=4096,Yc={};class Ar{constructor(e,i,s,n,r,o){this.from=e,this.to=i,this.dir=s,this.isolates=n,this.fresh=r,this.order=o}static update(e,i){if(i.empty&&!e.some(r=>r.fresh))return e;let s=[],n=e.length?e[e.length-1].dir:ee.LTR;for(let r=Math.max(0,e.length-10);r<e.length;r++){let o=e[r];o.dir==n&&!i.touchesRange(o.from,o.to)&&s.push(new Ar(i.mapPos(o.from,1),i.mapPos(o.to,-1),o.dir,o.isolates,!1,o.order))}return s}}function Gc(t,e,i){for(let s=t.state.facet(e),n=s.length-1;n>=0;n--){let r=s[n],o=typeof r=="function"?r(t):r;o&&ul(o,i)}return i}const Yb=E.mac?"mac":E.windows?"win":E.linux?"linux":"key";function Gb(t,e){const i=t.split(/-(?!$)/);let s=i[i.length-1];s=="Space"&&(s=" ");let n,r,o,a;for(let l=0;l<i.length-1;++l){const c=i[l];if(/^(cmd|meta|m)$/i.test(c))a=!0;else if(/^a(lt)?$/i.test(c))n=!0;else if(/^(c|ctrl|control)$/i.test(c))r=!0;else if(/^s(hift)?$/i.test(c))o=!0;else if(/^mod$/i.test(c))e=="mac"?a=!0:r=!0;else throw new Error("Unrecognized modifier name: "+c)}return n&&(s="Alt-"+s),r&&(s="Ctrl-"+s),a&&(s="Meta-"+s),o&&(s="Shift-"+s),s}function Hn(t,e,i){return e.altKey&&(t="Alt-"+t),e.ctrlKey&&(t="Ctrl-"+t),e.metaKey&&(t="Meta-"+t),i!==!1&&e.shiftKey&&(t="Shift-"+t),t}const Zb=qi.default(_.domEventHandlers({keydown(t,e){return zf(Nf(e.state),t,e,"editor")}})),Cl=D.define({enables:Zb}),Zc=new WeakMap;function Nf(t){let e=t.facet(Cl),i=Zc.get(e);return i||Zc.set(e,i=i0(e.reduce((s,n)=>s.concat(n),[]))),i}function e0(t,e,i){return zf(Nf(t.state),e,t,i)}let ei=null;const t0=4e3;function i0(t,e=Yb){let i=Object.create(null),s=Object.create(null),n=(o,a)=>{let l=s[o];if(l==null)s[o]=a;else if(l!=a)throw new Error("Key binding "+o+" is used both as a regular binding and as a multi-stroke prefix")},r=(o,a,l,c,h)=>{var d,f;let u=i[o]||(i[o]=Object.create(null)),p=a.split(/ (?!$)/).map(x=>Gb(x,e));for(let x=1;x<p.length;x++){let k=p.slice(0,x).join(" ");n(k,!0),u[k]||(u[k]={preventDefault:!0,stopPropagation:!1,run:[O=>{let R=ei={view:O,prefix:k,scope:o};return setTimeout(()=>{ei==R&&(ei=null)},t0),!0}]})}let m=p.join(" ");n(m,!1);let b=u[m]||(u[m]={preventDefault:!1,stopPropagation:!1,run:((f=(d=u._any)===null||d===void 0?void 0:d.run)===null||f===void 0?void 0:f.slice())||[]});l&&b.run.push(l),c&&(b.preventDefault=!0),h&&(b.stopPropagation=!0)};for(let o of t){let a=o.scope?o.scope.split(" "):["editor"];if(o.any)for(let c of a){let h=i[c]||(i[c]=Object.create(null));h._any||(h._any={preventDefault:!1,stopPropagation:!1,run:[]});let{any:d}=o;for(let f in h)h[f].run.push(u=>d(u,_a))}let l=o[e]||o.key;if(l)for(let c of a)r(c,l,o.run,o.preventDefault,o.stopPropagation),o.shift&&r(c,"Shift-"+l,o.shift,o.preventDefault,o.stopPropagation)}return i}let _a=null;function zf(t,e,i,s){_a=e;let n=bm(e),r=Fe(n,0),o=Ot(r)==n.length&&n!=" ",a="",l=!1,c=!1,h=!1;ei&&ei.view==i&&ei.scope==s&&(a=ei.prefix+" ",Pf.indexOf(e.keyCode)<0&&(c=!0,ei=null));let d=new Set,f=b=>{if(b){for(let x of b.run)if(!d.has(x)&&(d.add(x),x(i)))return b.stopPropagation&&(h=!0),!0;b.preventDefault&&(b.stopPropagation&&(h=!0),c=!0)}return!1},u=t[s],p,m;return u&&(f(u[a+Hn(n,e,!o)])?l=!0:o&&(e.altKey||e.metaKey||e.ctrlKey)&&!(E.windows&&e.ctrlKey&&e.altKey)&&!(E.mac&&e.altKey&&!(e.ctrlKey||e.metaKey))&&(p=ci[e.keyCode])&&p!=n?(f(u[a+Hn(p,e,!0)])||e.shiftKey&&(m=nn[e.keyCode])!=n&&m!=p&&f(u[a+Hn(m,e,!1)]))&&(l=!0):o&&e.shiftKey&&f(u[a+Hn(n,e,!0)])&&(l=!0),!l&&f(u._any)&&(l=!0)),c&&(l=!0),l&&h&&e.stopPropagation(),_a=null,l}class Bi{constructor(e,i,s,n,r){this.className=e,this.left=i,this.top=s,this.width=n,this.height=r}draw(){let e=document.createElement("div");return e.className=this.className,this.adjust(e),e}update(e,i){return i.className!=this.className?!1:(this.adjust(e),!0)}adjust(e){e.style.left=this.left+"px",e.style.top=this.top+"px",this.width!=null&&(e.style.width=this.width+"px"),e.style.height=this.height+"px"}eq(e){return this.left==e.left&&this.top==e.top&&this.width==e.width&&this.height==e.height&&this.className==e.className}static forRange(e,i,s){if(s.empty){let n=e.coordsAtPos(s.head,s.assoc||1);if(!n)return[];let r=Hf(e);return[new Bi(i,n.left-r.left,n.top-r.top,null,n.bottom-n.top)]}else return s0(e,i,s)}}function Hf(t){let e=t.scrollDOM.getBoundingClientRect();return{left:(t.textDirection==ee.LTR?e.left:e.right-t.scrollDOM.clientWidth*t.scaleX)-t.scrollDOM.scrollLeft*t.scaleX,top:e.top-t.scrollDOM.scrollTop*t.scaleY}}function eh(t,e,i,s){let n=t.coordsAtPos(e,i*2);if(!n)return s;let r=t.dom.getBoundingClientRect(),o=(n.top+n.bottom)/2,a=t.posAtCoords({x:r.left+1,y:o}),l=t.posAtCoords({x:r.right-1,y:o});return a==null||l==null?s:{from:Math.max(s.from,Math.min(a,l)),to:Math.min(s.to,Math.max(a,l))}}function s0(t,e,i){if(i.to<=t.viewport.from||i.from>=t.viewport.to)return[];let s=Math.max(i.from,t.viewport.from),n=Math.min(i.to,t.viewport.to),r=t.textDirection==ee.LTR,o=t.contentDOM,a=o.getBoundingClientRect(),l=Hf(t),c=o.querySelector(".cm-line"),h=c&&window.getComputedStyle(c),d=a.left+(h?parseInt(h.paddingLeft)+Math.min(0,parseInt(h.textIndent)):0),f=a.right-(h?parseInt(h.paddingRight):0),u=$a(t,s,1),p=$a(t,n,-1),m=u.type==Ae.Text?u:null,b=p.type==Ae.Text?p:null;if(m&&(t.lineWrapping||u.widgetLineBreaks)&&(m=eh(t,s,1,m)),b&&(t.lineWrapping||p.widgetLineBreaks)&&(b=eh(t,n,-1,b)),m&&b&&m.from==b.from&&m.to==b.to)return k(O(i.from,i.to,m));{let A=m?O(i.from,null,m):R(u,!1),$=b?O(null,i.to,b):R(p,!0),P=[];return(m||u).to<(b||p).from-(m&&b?1:0)||u.widgetLineBreaks>1&&A.bottom+t.defaultLineHeight/2<$.top?P.push(x(d,A.bottom,f,$.top)):A.bottom<$.top&&t.elementAtHeight((A.bottom+$.top)/2).type==Ae.Text&&(A.bottom=$.top=(A.bottom+$.top)/2),k(A).concat(P).concat(k($))}function x(A,$,P,z){return new Bi(e,A-l.left,$-l.top,Math.max(0,P-A),z-$)}function k({top:A,bottom:$,horizontal:P}){let z=[];for(let V=0;V<P.length;V+=2)z.push(x(P[V],A,P[V+1],$));return z}function O(A,$,P){let z=1e9,V=-1e9,G=[];function U(X,ie,_e,Qe,vt){let Se=t.coordsAtPos(X,X==P.to?-2:2),Ze=t.coordsAtPos(_e,_e==P.from?2:-2);!Se||!Ze||(z=Math.min(Se.top,Ze.top,z),V=Math.max(Se.bottom,Ze.bottom,V),vt==ee.LTR?G.push(r&&ie?d:Se.left,r&&Qe?f:Ze.right):G.push(!r&&Qe?d:Ze.left,!r&&ie?f:Se.right))}let F=A??P.from,J=$??P.to;for(let X of t.visibleRanges)if(X.to>F&&X.from<J)for(let ie=Math.max(X.from,F),_e=Math.min(X.to,J);;){let Qe=t.state.doc.lineAt(ie);for(let vt of t.bidiSpans(Qe)){let Se=vt.from+Qe.from,Ze=vt.to+Qe.from;if(Se>=_e)break;Ze>ie&&U(Math.max(Se,ie),A==null&&Se<=F,Math.min(Ze,_e),$==null&&Ze>=J,vt.dir)}if(ie=Qe.to+1,ie>=_e)break}return G.length==0&&U(F,A==null,J,$==null,t.textDirection),{top:z,bottom:V,horizontal:G}}function R(A,$){let P=a.top+($?A.top:A.bottom);return{top:P,bottom:P,horizontal:[]}}}function n0(t,e){return t.constructor==e.constructor&&t.eq(e)}class r0{constructor(e,i){this.view=e,this.layer=i,this.drawn=[],this.scaleX=1,this.scaleY=1,this.measureReq={read:this.measure.bind(this),write:this.draw.bind(this)},this.dom=e.scrollDOM.appendChild(document.createElement("div")),this.dom.classList.add("cm-layer"),i.above&&this.dom.classList.add("cm-layer-above"),i.class&&this.dom.classList.add(i.class),this.scale(),this.dom.setAttribute("aria-hidden","true"),this.setOrder(e.state),e.requestMeasure(this.measureReq),i.mount&&i.mount(this.dom,e)}update(e){e.startState.facet(or)!=e.state.facet(or)&&this.setOrder(e.state),(this.layer.update(e,this.dom)||e.geometryChanged)&&(this.scale(),e.view.requestMeasure(this.measureReq))}docViewUpdate(e){this.layer.updateOnDocViewUpdate!==!1&&e.requestMeasure(this.measureReq)}setOrder(e){let i=0,s=e.facet(or);for(;i<s.length&&s[i]!=this.layer;)i++;this.dom.style.zIndex=String((this.layer.above?150:-1)-i)}measure(){return this.layer.markers(this.view)}scale(){let{scaleX:e,scaleY:i}=this.view;(e!=this.scaleX||i!=this.scaleY)&&(this.scaleX=e,this.scaleY=i,this.dom.style.transform=`scale(${1/e}, ${1/i})`)}draw(e){if(e.length!=this.drawn.length||e.some((i,s)=>!n0(i,this.drawn[s]))){let i=this.dom.firstChild,s=0;for(let n of e)n.update&&i&&n.constructor&&this.drawn[s].constructor&&n.update(i,this.drawn[s])?(i=i.nextSibling,s++):this.dom.insertBefore(n.draw(),i);for(;i;){let n=i.nextSibling;i.remove(),i=n}this.drawn=e,E.webkit&&(this.dom.style.display=this.dom.firstChild?"":"none")}}destroy(){this.layer.destroy&&this.layer.destroy(this.dom,this.view),this.dom.remove()}}const or=D.define();function Wf(t){return[pe.define(e=>new r0(e,t)),or.of(t)]}const vs=D.define({combine(t){return Rt(t,{cursorBlinkRate:1200,drawRangeCursor:!0,iosSelectionHandles:!0},{cursorBlinkRate:(e,i)=>Math.min(e,i),drawRangeCursor:(e,i)=>e||i})}});function o0(t={}){return[vs.of(t),a0,l0,c0,pf.of(!0)]}function Uf(t){return t.startState.facet(vs)!=t.state.facet(vs)}const a0=Wf({above:!0,markers(t){let{state:e}=t,i=e.facet(vs),s=[];for(let n of e.selection.ranges){let r=n==e.selection.main;if(n.empty||i.drawRangeCursor&&!(r&&E.ios&&i.iosSelectionHandles)){let o=r?"cm-cursor cm-cursor-primary":"cm-cursor cm-cursor-secondary",a=n.empty?n:S.cursor(n.head,n.assoc);for(let l of Bi.forRange(t,o,a))s.push(l)}}return s},update(t,e){t.transactions.some(s=>s.selection)&&(e.style.animationName=e.style.animationName=="cm-blink"?"cm-blink2":"cm-blink");let i=Uf(t);return i&&th(t.state,e),t.docChanged||t.selectionSet||i},mount(t,e){th(e.state,t)},class:"cm-cursorLayer"});function th(t,e){e.style.animationDuration=t.facet(vs).cursorBlinkRate+"ms"}const l0=Wf({above:!1,markers(t){let e=[],{main:i,ranges:s}=t.state.selection;for(let n of s)if(!n.empty)for(let r of Bi.forRange(t,"cm-selectionBackground",n))e.push(r);if(E.ios&&!i.empty&&t.state.facet(vs).iosSelectionHandles){for(let n of Bi.forRange(t,"cm-selectionHandle cm-selectionHandle-start",S.cursor(i.from,1)))e.push(n);for(let n of Bi.forRange(t,"cm-selectionHandle cm-selectionHandle-end",S.cursor(i.to,1)))e.push(n)}return e},update(t,e){return t.docChanged||t.selectionSet||t.viewportChanged||Uf(t)},class:"cm-selectionLayer"}),c0=qi.highest(_.theme({".cm-line":{"& ::selection, &::selection":{backgroundColor:"transparent !important"},caretColor:"transparent !important"},".cm-content":{caretColor:"transparent !important","& :focus":{caretColor:"initial !important","&::selection, & ::selection":{backgroundColor:"Highlight !important"}}}})),qf=H.define({map(t,e){return t==null?null:e.mapPos(t)}}),Fs=Ee.define({create(){return null},update(t,e){return t!=null&&(t=e.changes.mapPos(t)),e.effects.reduce((i,s)=>s.is(qf)?s.value:i,t)}}),h0=pe.fromClass(class{constructor(t){this.view=t,this.cursor=null,this.measureReq={read:this.readPos.bind(this),write:this.drawCursor.bind(this)}}update(t){var e;let i=t.state.field(Fs);i==null?this.cursor!=null&&((e=this.cursor)===null||e===void 0||e.remove(),this.cursor=null):(this.cursor||(this.cursor=this.view.scrollDOM.appendChild(document.createElement("div")),this.cursor.className="cm-dropCursor"),(t.startState.field(Fs)!=i||t.docChanged||t.geometryChanged)&&this.view.requestMeasure(this.measureReq))}readPos(){let{view:t}=this,e=t.state.field(Fs),i=e!=null&&t.coordsAtPos(e);if(!i)return null;let s=t.scrollDOM.getBoundingClientRect();return{left:i.left-s.left+t.scrollDOM.scrollLeft*t.scaleX,top:i.top-s.top+t.scrollDOM.scrollTop*t.scaleY,height:i.bottom-i.top}}drawCursor(t){if(this.cursor){let{scaleX:e,scaleY:i}=this.view;t?(this.cursor.style.left=t.left/e+"px",this.cursor.style.top=t.top/i+"px",this.cursor.style.height=t.height/i+"px"):this.cursor.style.left="-100000px"}}destroy(){this.cursor&&this.cursor.remove()}setDropPos(t){this.view.state.field(Fs)!=t&&this.view.dispatch({effects:qf.of(t)})}},{eventObservers:{dragover(t){this.setDropPos(this.view.posAtCoords({x:t.clientX,y:t.clientY}))},dragleave(t){(t.target==this.view.contentDOM||!this.view.contentDOM.contains(t.relatedTarget))&&this.setDropPos(null)},dragend(){this.setDropPos(null)},drop(){this.setDropPos(null)}}});function d0(){return[Fs,h0]}function ih(t,e,i,s,n){e.lastIndex=0;for(let r=t.iterRange(i,s),o=i,a;!r.next().done;o+=r.value.length)if(!r.lineBreak)for(;a=e.exec(r.value);)n(o+a.index,a)}function f0(t,e){let i=t.visibleRanges;if(i.length==1&&i[0].from==t.viewport.from&&i[0].to==t.viewport.to)return i;let s=[];for(let{from:n,to:r}of i)n=Math.max(t.state.doc.lineAt(n).from,n-e),r=Math.min(t.state.doc.lineAt(r).to,r+e),s.length&&s[s.length-1].to>=n?s[s.length-1].to=r:s.push({from:n,to:r});return s}class u0{constructor(e){const{regexp:i,decoration:s,decorate:n,boundary:r,maxLength:o=1e3}=e;if(!i.global)throw new RangeError("The regular expression given to MatchDecorator should have its 'g' flag set");if(this.regexp=i,n)this.addMatch=(a,l,c,h)=>n(h,c,c+a[0].length,a,l);else if(typeof s=="function")this.addMatch=(a,l,c,h)=>{let d=s(a,l,c);d&&h(c,c+a[0].length,d)};else if(s)this.addMatch=(a,l,c,h)=>h(c,c+a[0].length,s);else throw new RangeError("Either 'decorate' or 'decoration' should be provided to MatchDecorator");this.boundary=r,this.maxLength=o}createDeco(e){let i=new qt,s=i.add.bind(i);for(let{from:n,to:r}of f0(e,this.maxLength))ih(e.state.doc,this.regexp,n,r,(o,a)=>this.addMatch(a,e,o,s));return i.finish()}updateDeco(e,i){let s=1e9,n=-1;return e.docChanged&&e.changes.iterChanges((r,o,a,l)=>{l>=e.view.viewport.from&&a<=e.view.viewport.to&&(s=Math.min(a,s),n=Math.max(l,n))}),e.viewportMoved||n-s>1e3?this.createDeco(e.view):n>-1?this.updateRange(e.view,i.map(e.changes),s,n):i}updateRange(e,i,s,n){for(let r of e.visibleRanges){let o=Math.max(r.from,s),a=Math.min(r.to,n);if(a>=o){let l=e.state.doc.lineAt(o),c=l.to<a?e.state.doc.lineAt(a):l,h=Math.max(r.from,l.from),d=Math.min(r.to,c.to);if(this.boundary){for(;o>l.from;o--)if(this.boundary.test(l.text[o-1-l.from])){h=o;break}for(;a<c.to;a++)if(this.boundary.test(c.text[a-c.from])){d=a;break}}let f=[],u,p=(m,b,x)=>f.push(x.range(m,b));if(l==c)for(this.regexp.lastIndex=h-l.from;(u=this.regexp.exec(l.text))&&u.index<d-l.from;)this.addMatch(u,e,u.index+l.from,p);else ih(e.state.doc,this.regexp,h,d,(m,b)=>this.addMatch(b,e,m,p));i=i.update({filterFrom:h,filterTo:d,filter:(m,b)=>m<h||b>d,add:f})}}return i}}const Ba=/x/.unicode!=null?"gu":"g",p0=new RegExp(`[\0-\b
--­؜​‎‏\u2028\u2029‭‮⁦⁧⁩\uFEFF￹-￼]`,Ba),g0={0:"null",7:"bell",8:"backspace",10:"newline",11:"vertical tab",13:"carriage return",27:"escape",8203:"zero width space",8204:"zero width non-joiner",8205:"zero width joiner",8206:"left-to-right mark",8207:"right-to-left mark",8232:"line separator",8237:"left-to-right override",8238:"right-to-left override",8294:"left-to-right isolate",8295:"right-to-left isolate",8297:"pop directional isolate",8233:"paragraph separator",65279:"zero width no-break space",65532:"object replacement"};let Eo=null;function m0(){var t;if(Eo==null&&typeof document<"u"&&document.body){let e=document.body.style;Eo=((t=e.tabSize)!==null&&t!==void 0?t:e.MozTabSize)!=null}return Eo||!1}const ar=D.define({combine(t){let e=Rt(t,{render:null,specialChars:p0,addSpecialChars:null});return(e.replaceTabs=!m0())&&(e.specialChars=new RegExp("	|"+e.specialChars.source,Ba)),e.addSpecialChars&&(e.specialChars=new RegExp(e.specialChars.source+"|"+e.addSpecialChars.source,Ba)),e}});function b0(t={}){return[ar.of(t),v0()]}let sh=null;function v0(){return sh||(sh=pe.fromClass(class{constructor(t){this.view=t,this.decorations=N.none,this.decorationCache=Object.create(null),this.decorator=this.makeDecorator(t.state.facet(ar)),this.decorations=this.decorator.createDeco(t)}makeDecorator(t){return new u0({regexp:t.specialChars,decoration:(e,i,s)=>{let{doc:n}=i.state,r=Fe(e[0],0);if(r==9){let o=n.lineAt(s),a=i.state.tabSize,l=Cs(o.text,a,s-o.from);return N.replace({widget:new k0((a-l%a)*this.view.defaultCharacterWidth/this.view.scaleX)})}return this.decorationCache[r]||(this.decorationCache[r]=N.replace({widget:new w0(t,r)}))},boundary:t.replaceTabs?void 0:/[^]/})}update(t){let e=t.state.facet(ar);t.startState.facet(ar)!=e?(this.decorator=this.makeDecorator(e),this.decorations=this.decorator.createDeco(t.view)):this.decorations=this.decorator.updateDeco(t,this.decorations)}},{decorations:t=>t.decorations}))}const y0="•";function x0(t){return t>=32?y0:t==10?"␤":String.fromCharCode(9216+t)}class w0 extends Jt{constructor(e,i){super(),this.options=e,this.code=i}eq(e){return e.code==this.code}toDOM(e){let i=x0(this.code),s=e.state.phrase("Control character")+" "+(g0[this.code]||"0x"+this.code.toString(16)),n=this.options.render&&this.options.render(this.code,s,i);if(n)return n;let r=document.createElement("span");return r.textContent=i,r.title=s,r.setAttribute("aria-label",s),r.className="cm-specialChar",r}ignoreEvent(){return!1}}class k0 extends Jt{constructor(e){super(),this.width=e}eq(e){return e.width==this.width}toDOM(){let e=document.createElement("span");return e.textContent="	",e.className="cm-tab",e.style.width=this.width+"px",e}ignoreEvent(){return!1}}function S0(){return O0}const C0=N.line({class:"cm-activeLine"}),O0=pe.fromClass(class{constructor(t){this.decorations=this.getDeco(t)}update(t){(t.docChanged||t.selectionSet)&&(this.decorations=this.getDeco(t.view))}getDeco(t){let e=-1,i=[];for(let s of t.state.selection.ranges){let n=t.lineBlockAt(s.head);n.from>e&&(i.push(C0.range(n.from)),e=n.from)}return N.set(i)}},{decorations:t=>t.decorations}),Ra=2e3;function A0(t,e,i){let s=Math.min(e.line,i.line),n=Math.max(e.line,i.line),r=[];if(e.off>Ra||i.off>Ra||e.col<0||i.col<0){let o=Math.min(e.off,i.off),a=Math.max(e.off,i.off);for(let l=s;l<=n;l++){let c=t.doc.line(l);c.length<=a&&r.push(S.range(c.from+o,c.to+a))}}else{let o=Math.min(e.col,i.col),a=Math.max(e.col,i.col);for(let l=s;l<=n;l++){let c=t.doc.line(l),h=pa(c.text,o,t.tabSize,!0);if(h<0)r.push(S.cursor(c.to));else{let d=pa(c.text,a,t.tabSize);r.push(S.range(c.from+h,c.from+d))}}}return r}function $0(t,e){let i=t.coordsAtPos(t.viewport.from);return i?Math.round(Math.abs((i.left-e)/t.defaultCharacterWidth)):-1}function nh(t,e){let i=t.posAtCoords({x:e.clientX,y:e.clientY},!1),s=t.state.doc.lineAt(i),n=i-s.from,r=n>Ra?-1:n==s.length?$0(t,e.clientX):Cs(s.text,t.state.tabSize,i-s.from);return{line:s.number,col:r,off:n}}function P0(t,e){let i=nh(t,e),s=t.state.selection;return i?{update(n){if(n.docChanged){let r=n.changes.mapPos(n.startState.doc.line(i.line).from),o=n.state.doc.lineAt(r);i={line:o.number,col:i.col,off:Math.min(i.off,o.length)},s=s.map(n.changes)}},get(n,r,o){let a=nh(t,n);if(!a)return s;let l=A0(t.state,i,a);return l.length?o?S.create(l.concat(s.ranges)):S.create(l):s}}:null}function T0(t){let e=(i=>i.altKey&&i.button==0);return _.mouseSelectionStyle.of((i,s)=>e(s)?P0(i,s):null)}const M0={Alt:[18,t=>!!t.altKey],Control:[17,t=>!!t.ctrlKey],Shift:[16,t=>!!t.shiftKey],Meta:[91,t=>!!t.metaKey]},E0={style:"cursor: crosshair"};function D0(t={}){let[e,i]=M0[t.key||"Alt"],s=pe.fromClass(class{constructor(n){this.view=n,this.isDown=!1}set(n){this.isDown!=n&&(this.isDown=n,this.view.update([]))}},{eventObservers:{keydown(n){this.set(n.keyCode==e||i(n))},keyup(n){(n.keyCode==e||!i(n))&&this.set(!1)},mousemove(n){this.set(i(n))}}});return[s,_.contentAttributes.of(n=>{var r;return!((r=n.plugin(s))===null||r===void 0)&&r.isDown?E0:null})]}const Wn="-10000px";class Vf{constructor(e,i,s,n){this.facet=i,this.createTooltipView=s,this.removeTooltipView=n,this.input=e.state.facet(i),this.tooltips=this.input.filter(o=>o);let r=null;this.tooltipViews=this.tooltips.map(o=>r=s(o,r))}update(e,i){var s;let n=e.state.facet(this.facet),r=n.filter(l=>l);if(n===this.input){for(let l of this.tooltipViews)l.update&&l.update(e);return!1}let o=[],a=i?[]:null;for(let l=0;l<r.length;l++){let c=r[l],h=-1;if(c){for(let d=0;d<this.tooltips.length;d++){let f=this.tooltips[d];f&&f.create==c.create&&(h=d)}if(h<0)o[l]=this.createTooltipView(c,l?o[l-1]:null),a&&(a[l]=!!c.above);else{let d=o[l]=this.tooltipViews[h];a&&(a[l]=i[h]),d.update&&d.update(e)}}}for(let l of this.tooltipViews)o.indexOf(l)<0&&(this.removeTooltipView(l),(s=l.destroy)===null||s===void 0||s.call(l));return i&&(a.forEach((l,c)=>i[c]=l),i.length=a.length),this.input=n,this.tooltips=r,this.tooltipViews=o,!0}}function _0(t){let e=t.dom.ownerDocument.documentElement;return{top:0,left:0,bottom:e.clientHeight,right:e.clientWidth}}const Do=D.define({combine:t=>{var e,i,s;return{position:E.ios?"absolute":((e=t.find(n=>n.position))===null||e===void 0?void 0:e.position)||"fixed",parent:((i=t.find(n=>n.parent))===null||i===void 0?void 0:i.parent)||null,tooltipSpace:((s=t.find(n=>n.tooltipSpace))===null||s===void 0?void 0:s.tooltipSpace)||_0}}}),rh=new WeakMap,Ol=pe.fromClass(class{constructor(t){this.view=t,this.above=[],this.inView=!0,this.madeAbsolute=!1,this.lastTransaction=0,this.measureTimeout=-1;let e=t.state.facet(Do);this.position=e.position,this.parent=e.parent,this.classes=t.themeClasses,this.createContainer(),this.measureReq={read:this.readMeasure.bind(this),write:this.writeMeasure.bind(this),key:this},this.resizeObserver=typeof ResizeObserver=="function"?new ResizeObserver(()=>this.measureSoon()):null,this.manager=new Vf(t,Al,(i,s)=>this.createTooltip(i,s),i=>{this.resizeObserver&&this.resizeObserver.unobserve(i.dom),i.dom.remove()}),this.above=this.manager.tooltips.map(i=>!!i.above),this.intersectionObserver=typeof IntersectionObserver=="function"?new IntersectionObserver(i=>{Date.now()>this.lastTransaction-50&&i.length>0&&i[i.length-1].intersectionRatio<1&&this.measureSoon()},{threshold:[1]}):null,this.observeIntersection(),t.win.addEventListener("resize",this.measureSoon=this.measureSoon.bind(this)),this.maybeMeasure()}createContainer(){this.parent?(this.container=document.createElement("div"),this.container.style.position="relative",this.container.className=this.view.themeClasses,this.parent.appendChild(this.container)):this.container=this.view.dom}observeIntersection(){if(this.intersectionObserver){this.intersectionObserver.disconnect();for(let t of this.manager.tooltipViews)this.intersectionObserver.observe(t.dom)}}measureSoon(){this.measureTimeout<0&&(this.measureTimeout=setTimeout(()=>{this.measureTimeout=-1,this.maybeMeasure()},50))}update(t){t.transactions.length&&(this.lastTransaction=Date.now());let e=this.manager.update(t,this.above);e&&this.observeIntersection();let i=e||t.geometryChanged,s=t.state.facet(Do);if(s.position!=this.position&&!this.madeAbsolute){this.position=s.position;for(let n of this.manager.tooltipViews)n.dom.style.position=this.position;i=!0}if(s.parent!=this.parent){this.parent&&this.container.remove(),this.parent=s.parent,this.createContainer();for(let n of this.manager.tooltipViews)this.container.appendChild(n.dom);i=!0}else this.parent&&this.view.themeClasses!=this.classes&&(this.classes=this.container.className=this.view.themeClasses);i&&this.maybeMeasure()}createTooltip(t,e){let i=t.create(this.view),s=e?e.dom:null;if(i.dom.classList.add("cm-tooltip"),t.arrow&&!i.dom.querySelector(".cm-tooltip > .cm-tooltip-arrow")){let n=document.createElement("div");n.className="cm-tooltip-arrow",i.dom.appendChild(n)}return i.dom.style.position=this.position,i.dom.style.top=Wn,i.dom.style.left="0px",this.container.insertBefore(i.dom,s),i.mount&&i.mount(this.view),this.resizeObserver&&this.resizeObserver.observe(i.dom),i}destroy(){var t,e,i;this.view.win.removeEventListener("resize",this.measureSoon);for(let s of this.manager.tooltipViews)s.dom.remove(),(t=s.destroy)===null||t===void 0||t.call(s);this.parent&&this.container.remove(),(e=this.resizeObserver)===null||e===void 0||e.disconnect(),(i=this.intersectionObserver)===null||i===void 0||i.disconnect(),clearTimeout(this.measureTimeout)}readMeasure(){let t=1,e=1,i=!1;if(this.position=="fixed"&&this.manager.tooltipViews.length){let{dom:r}=this.manager.tooltipViews[0];if(E.safari){let o=r.getBoundingClientRect();i=Math.abs(o.top+1e4)>1||Math.abs(o.left)>1}else i=!!r.offsetParent&&r.offsetParent!=this.container.ownerDocument.body}if(i||this.position=="absolute")if(this.parent){let r=this.parent.getBoundingClientRect();r.width&&r.height&&(t=r.width/this.parent.offsetWidth,e=r.height/this.parent.offsetHeight)}else({scaleX:t,scaleY:e}=this.view.viewState);let s=this.view.scrollDOM.getBoundingClientRect(),n=xl(this.view);return{visible:{left:s.left+n.left,top:s.top+n.top,right:s.right-n.right,bottom:s.bottom-n.bottom},parent:this.parent?this.container.getBoundingClientRect():this.view.dom.getBoundingClientRect(),pos:this.manager.tooltips.map((r,o)=>{let a=this.manager.tooltipViews[o];return a.getCoords?a.getCoords(r.pos):this.view.coordsAtPos(r.pos)}),size:this.manager.tooltipViews.map(({dom:r})=>r.getBoundingClientRect()),space:this.view.state.facet(Do).tooltipSpace(this.view),scaleX:t,scaleY:e,makeAbsolute:i}}writeMeasure(t){var e;if(t.makeAbsolute){this.madeAbsolute=!0,this.position="absolute";for(let a of this.manager.tooltipViews)a.dom.style.position="absolute"}let{visible:i,space:s,scaleX:n,scaleY:r}=t,o=[];for(let a=0;a<this.manager.tooltips.length;a++){let l=this.manager.tooltips[a],c=this.manager.tooltipViews[a],{dom:h}=c,d=t.pos[a],f=t.size[a];if(!d||l.clip!==!1&&(d.bottom<=Math.max(i.top,s.top)||d.top>=Math.min(i.bottom,s.bottom)||d.right<Math.max(i.left,s.left)-.1||d.left>Math.min(i.right,s.right)+.1)){h.style.top=Wn;continue}let u=l.arrow?c.dom.querySelector(".cm-tooltip-arrow"):null,p=u?7:0,m=f.right-f.left,b=(e=rh.get(c))!==null&&e!==void 0?e:f.bottom-f.top,x=c.offset||R0,k=this.view.textDirection==ee.LTR,O=f.width>s.right-s.left?k?s.left:s.right-f.width:k?Math.max(s.left,Math.min(d.left-(u?14:0)+x.x,s.right-m)):Math.min(Math.max(s.left,d.left-m+(u?14:0)-x.x),s.right-m),R=this.above[a];!l.strictSide&&(R?d.top-b-p-x.y<s.top:d.bottom+b+p+x.y>s.bottom)&&R==s.bottom-d.bottom>d.top-s.top&&(R=this.above[a]=!R);let A=(R?d.top-s.top:s.bottom-d.bottom)-p;if(A<b&&c.resize!==!1){if(A<this.view.defaultLineHeight){h.style.top=Wn;continue}rh.set(c,b),h.style.height=(b=A)/r+"px"}else h.style.height&&(h.style.height="");let $=R?d.top-b-p-x.y:d.bottom+p+x.y,P=O+m;if(c.overlap!==!0)for(let z of o)z.left<P&&z.right>O&&z.top<$+b&&z.bottom>$&&($=R?z.top-b-2-p:z.bottom+p+2);if(this.position=="absolute"?(h.style.top=($-t.parent.top)/r+"px",oh(h,(O-t.parent.left)/n)):(h.style.top=$/r+"px",oh(h,O/n)),u){let z=d.left+(k?x.x:-x.x)-(O+14-7);u.style.left=z/n+"px"}c.overlap!==!0&&o.push({left:O,top:$,right:P,bottom:$+b}),h.classList.toggle("cm-tooltip-above",R),h.classList.toggle("cm-tooltip-below",!R),c.positioned&&c.positioned(t.space)}}maybeMeasure(){if(this.manager.tooltips.length&&(this.view.inView&&this.view.requestMeasure(this.measureReq),this.inView!=this.view.inView&&(this.inView=this.view.inView,!this.inView)))for(let t of this.manager.tooltipViews)t.dom.style.top=Wn}},{eventObservers:{scroll(){this.maybeMeasure()}}});function oh(t,e){let i=parseInt(t.style.left,10);(isNaN(i)||Math.abs(e-i)>1)&&(t.style.left=e+"px")}const B0=_.baseTheme({".cm-tooltip":{zIndex:500,boxSizing:"border-box"},"&light .cm-tooltip":{border:"1px solid #bbb",backgroundColor:"#f5f5f5"},"&light .cm-tooltip-section:not(:first-child)":{borderTop:"1px solid #bbb"},"&dark .cm-tooltip":{backgroundColor:"#333338",color:"white"},".cm-tooltip-arrow":{height:"7px",width:"14px",position:"absolute",zIndex:-1,overflow:"hidden","&:before, &:after":{content:"''",position:"absolute",width:0,height:0,borderLeft:"7px solid transparent",borderRight:"7px solid transparent"},".cm-tooltip-above &":{bottom:"-7px","&:before":{borderTop:"7px solid #bbb"},"&:after":{borderTop:"7px solid #f5f5f5",bottom:"1px"}},".cm-tooltip-below &":{top:"-7px","&:before":{borderBottom:"7px solid #bbb"},"&:after":{borderBottom:"7px solid #f5f5f5",top:"1px"}}},"&dark .cm-tooltip .cm-tooltip-arrow":{"&:before":{borderTopColor:"#333338",borderBottomColor:"#333338"},"&:after":{borderTopColor:"transparent",borderBottomColor:"transparent"}}}),R0={x:0,y:0},Al=D.define({enables:[Ol,B0]}),$r=D.define({combine:t=>t.reduce((e,i)=>e.concat(i),[])});class io{static create(e){return new io(e)}constructor(e){this.view=e,this.mounted=!1,this.dom=document.createElement("div"),this.dom.classList.add("cm-tooltip-hover"),this.manager=new Vf(e,$r,(i,s)=>this.createHostedView(i,s),i=>i.dom.remove())}createHostedView(e,i){let s=e.create(this.view);return s.dom.classList.add("cm-tooltip-section"),this.dom.insertBefore(s.dom,i?i.dom.nextSibling:this.dom.firstChild),this.mounted&&s.mount&&s.mount(this.view),s}mount(e){for(let i of this.manager.tooltipViews)i.mount&&i.mount(e);this.mounted=!0}positioned(e){for(let i of this.manager.tooltipViews)i.positioned&&i.positioned(e)}update(e){this.manager.update(e)}destroy(){var e;for(let i of this.manager.tooltipViews)(e=i.destroy)===null||e===void 0||e.call(i)}passProp(e){let i;for(let s of this.manager.tooltipViews){let n=s[e];if(n!==void 0){if(i===void 0)i=n;else if(i!==n)return}}return i}get offset(){return this.passProp("offset")}get getCoords(){return this.passProp("getCoords")}get overlap(){return this.passProp("overlap")}get resize(){return this.passProp("resize")}}const L0=Al.compute([$r],t=>{let e=t.facet($r);return e.length===0?null:{pos:Math.min(...e.map(i=>i.pos)),end:Math.max(...e.map(i=>{var s;return(s=i.end)!==null&&s!==void 0?s:i.pos})),create:io.create,above:e[0].above,arrow:e.some(i=>i.arrow)}});class I0{constructor(e,i,s,n,r){this.view=e,this.source=i,this.field=s,this.setHover=n,this.hoverTime=r,this.hoverTimeout=-1,this.restartTimeout=-1,this.pending=null,this.lastMove={x:0,y:0,target:e.dom,time:0},this.checkHover=this.checkHover.bind(this),e.dom.addEventListener("mouseleave",this.mouseleave=this.mouseleave.bind(this)),e.dom.addEventListener("mousemove",this.mousemove=this.mousemove.bind(this))}update(){this.pending&&(this.pending=null,clearTimeout(this.restartTimeout),this.restartTimeout=setTimeout(()=>this.startHover(),20))}get active(){return this.view.state.field(this.field)}checkHover(){if(this.hoverTimeout=-1,this.active.length)return;let e=Date.now()-this.lastMove.time;e<this.hoverTime?this.hoverTimeout=setTimeout(this.checkHover,this.hoverTime-e):this.startHover()}startHover(){clearTimeout(this.restartTimeout);let{view:e,lastMove:i}=this,s=e.docView.tile.nearest(i.target);if(!s)return;let n,r=1;if(s.isWidget())n=s.posAtStart;else{if(n=e.posAtCoords(i),n==null)return;let a=e.coordsAtPos(n);if(!a||i.y<a.top||i.y>a.bottom||i.x<a.left-e.defaultCharacterWidth||i.x>a.right+e.defaultCharacterWidth)return;let l=e.bidiSpans(e.state.doc.lineAt(n)).find(h=>h.from<=n&&h.to>=n),c=l&&l.dir==ee.RTL?-1:1;r=i.x<a.left?-c:c}let o=this.source(e,n,r);if(o!=null&&o.then){let a=this.pending={pos:n};o.then(l=>{this.pending==a&&(this.pending=null,l&&!(Array.isArray(l)&&!l.length)&&e.dispatch({effects:this.setHover.of(Array.isArray(l)?l:[l])}))},l=>He(e.state,l,"hover tooltip"))}else o&&!(Array.isArray(o)&&!o.length)&&e.dispatch({effects:this.setHover.of(Array.isArray(o)?o:[o])})}get tooltip(){let e=this.view.plugin(Ol),i=e?e.manager.tooltips.findIndex(s=>s.create==io.create):-1;return i>-1?e.manager.tooltipViews[i]:null}mousemove(e){var i,s;this.lastMove={x:e.clientX,y:e.clientY,target:e.target,time:Date.now()},this.hoverTimeout<0&&(this.hoverTimeout=setTimeout(this.checkHover,this.hoverTime));let{active:n,tooltip:r}=this;if(n.length&&r&&!F0(r.dom,e)||this.pending){let{pos:o}=n[0]||this.pending,a=(s=(i=n[0])===null||i===void 0?void 0:i.end)!==null&&s!==void 0?s:o;(o==a?this.view.posAtCoords(this.lastMove)!=o:!N0(this.view,o,a,e.clientX,e.clientY))&&(this.view.dispatch({effects:this.setHover.of([])}),this.pending=null)}}mouseleave(e){clearTimeout(this.hoverTimeout),this.hoverTimeout=-1;let{active:i}=this;if(i.length){let{tooltip:s}=this;s&&s.dom.contains(e.relatedTarget)?this.watchTooltipLeave(s.dom):this.view.dispatch({effects:this.setHover.of([])})}}watchTooltipLeave(e){let i=s=>{e.removeEventListener("mouseleave",i),this.active.length&&!this.view.dom.contains(s.relatedTarget)&&this.view.dispatch({effects:this.setHover.of([])})};e.addEventListener("mouseleave",i)}destroy(){clearTimeout(this.hoverTimeout),clearTimeout(this.restartTimeout),this.view.dom.removeEventListener("mouseleave",this.mouseleave),this.view.dom.removeEventListener("mousemove",this.mousemove)}}const Un=4;function F0(t,e){let{left:i,right:s,top:n,bottom:r}=t.getBoundingClientRect(),o;if(o=t.querySelector(".cm-tooltip-arrow")){let a=o.getBoundingClientRect();n=Math.min(a.top,n),r=Math.max(a.bottom,r)}return e.clientX>=i-Un&&e.clientX<=s+Un&&e.clientY>=n-Un&&e.clientY<=r+Un}function N0(t,e,i,s,n,r){let o=t.scrollDOM.getBoundingClientRect(),a=t.documentTop+t.documentPadding.top+t.contentHeight;if(o.left>s||o.right<s||o.top>n||Math.min(o.bottom,a)<n)return!1;let l=t.posAtCoords({x:s,y:n},!1);return l>=e&&l<=i}function z0(t,e={}){let i=H.define(),s=Ee.define({create(){return[]},update(n,r){if(n.length&&(e.hideOnChange&&(r.docChanged||r.selection)?n=[]:e.hideOn&&(n=n.filter(o=>!e.hideOn(r,o))),r.docChanged)){let o=[];for(let a of n){let l=r.changes.mapPos(a.pos,-1,Re.TrackDel);if(l!=null){let c=Object.assign(Object.create(null),a);c.pos=l,c.end!=null&&(c.end=r.changes.mapPos(c.end)),o.push(c)}}n=o}for(let o of r.effects)o.is(i)&&(n=o.value),o.is(H0)&&(n=[]);return n},provide:n=>$r.from(n)});return{active:s,extension:[s,pe.define(n=>new I0(n,t,s,i,e.hoverTime||300)),L0]}}function Qf(t,e){let i=t.plugin(Ol);if(!i)return null;let s=i.manager.tooltips.indexOf(e);return s<0?null:i.manager.tooltipViews[s]}const H0=H.define(),ah=D.define({combine(t){let e,i;for(let s of t)e=e||s.topContainer,i=i||s.bottomContainer;return{topContainer:e,bottomContainer:i}}});function $l(t,e){let i=t.plugin(jf),s=i?i.specs.indexOf(e):-1;return s>-1?i.panels[s]:null}const jf=pe.fromClass(class{constructor(t){this.input=t.state.facet(ln),this.specs=this.input.filter(i=>i),this.panels=this.specs.map(i=>i(t));let e=t.state.facet(ah);this.top=new qn(t,!0,e.topContainer),this.bottom=new qn(t,!1,e.bottomContainer),this.top.sync(this.panels.filter(i=>i.top)),this.bottom.sync(this.panels.filter(i=>!i.top));for(let i of this.panels)i.dom.classList.add("cm-panel"),i.mount&&i.mount()}update(t){let e=t.state.facet(ah);this.top.container!=e.topContainer&&(this.top.sync([]),this.top=new qn(t.view,!0,e.topContainer)),this.bottom.container!=e.bottomContainer&&(this.bottom.sync([]),this.bottom=new qn(t.view,!1,e.bottomContainer)),this.top.syncClasses(),this.bottom.syncClasses();let i=t.state.facet(ln);if(i!=this.input){let s=i.filter(l=>l),n=[],r=[],o=[],a=[];for(let l of s){let c=this.specs.indexOf(l),h;c<0?(h=l(t.view),a.push(h)):(h=this.panels[c],h.update&&h.update(t)),n.push(h),(h.top?r:o).push(h)}this.specs=s,this.panels=n,this.top.sync(r),this.bottom.sync(o);for(let l of a)l.dom.classList.add("cm-panel"),l.mount&&l.mount()}else for(let s of this.panels)s.update&&s.update(t)}destroy(){this.top.sync([]),this.bottom.sync([])}},{provide:t=>_.scrollMargins.of(e=>{let i=e.plugin(t);return i&&{top:i.top.scrollMargin(),bottom:i.bottom.scrollMargin()}})});class qn{constructor(e,i,s){this.view=e,this.top=i,this.container=s,this.dom=void 0,this.classes="",this.panels=[],this.syncClasses()}sync(e){for(let i of this.panels)i.destroy&&e.indexOf(i)<0&&i.destroy();this.panels=e,this.syncDOM()}syncDOM(){if(this.panels.length==0){this.dom&&(this.dom.remove(),this.dom=void 0);return}if(!this.dom){this.dom=document.createElement("div"),this.dom.className=this.top?"cm-panels cm-panels-top":"cm-panels cm-panels-bottom",this.dom.style[this.top?"top":"bottom"]="0";let i=this.container||this.view.dom;i.insertBefore(this.dom,this.top?i.firstChild:null)}let e=this.dom.firstChild;for(let i of this.panels)if(i.dom.parentNode==this.dom){for(;e!=i.dom;)e=lh(e);e=e.nextSibling}else this.dom.insertBefore(i.dom,e);for(;e;)e=lh(e)}scrollMargin(){return!this.dom||this.container?0:Math.max(0,this.top?this.dom.getBoundingClientRect().bottom-Math.max(0,this.view.scrollDOM.getBoundingClientRect().top):Math.min(innerHeight,this.view.scrollDOM.getBoundingClientRect().bottom)-this.dom.getBoundingClientRect().top)}syncClasses(){if(!(!this.container||this.classes==this.view.themeClasses)){for(let e of this.classes.split(" "))e&&this.container.classList.remove(e);for(let e of(this.classes=this.view.themeClasses).split(" "))e&&this.container.classList.add(e)}}}function lh(t){let e=t.nextSibling;return t.remove(),e}const ln=D.define({enables:jf});function W0(t,e){let i,s=new Promise(o=>i=o),n=o=>U0(o,e,i);t.state.field(_o,!1)?t.dispatch({effects:Kf.of(n)}):t.dispatch({effects:H.appendConfig.of(_o.init(()=>[n]))});let r=Xf.of(n);return{close:r,result:s.then(o=>((t.win.queueMicrotask||(l=>t.win.setTimeout(l,10)))(()=>{t.state.field(_o).indexOf(n)>-1&&t.dispatch({effects:r})}),o))}}const _o=Ee.define({create(){return[]},update(t,e){for(let i of e.effects)i.is(Kf)?t=[i.value].concat(t):i.is(Xf)&&(t=t.filter(s=>s!=i.value));return t},provide:t=>ln.computeN([t],e=>e.field(t))}),Kf=H.define(),Xf=H.define();function U0(t,e,i){let s=e.content?e.content(t,()=>o(null)):null;if(!s){if(s=Y("form"),e.input){let a=Y("input",e.input);/^(text|password|number|email|tel|url)$/.test(a.type)&&a.classList.add("cm-textfield"),a.name||(a.name="input"),s.appendChild(Y("label",(e.label||"")+": ",a))}else s.appendChild(document.createTextNode(e.label||""));s.appendChild(document.createTextNode(" ")),s.appendChild(Y("button",{class:"cm-button",type:"submit"},e.submitLabel||"OK"))}let n=s.nodeName=="FORM"?[s]:s.querySelectorAll("form");for(let a=0;a<n.length;a++){let l=n[a];l.addEventListener("keydown",c=>{c.keyCode==27?(c.preventDefault(),o(null)):c.keyCode==13&&(c.preventDefault(),o(l))}),l.addEventListener("submit",c=>{c.preventDefault(),o(l)})}let r=Y("div",s,Y("button",{onclick:()=>o(null),"aria-label":t.state.phrase("close"),class:"cm-dialog-close",type:"button"},["×"]));e.class&&(r.className=e.class),r.classList.add("cm-dialog");function o(a){r.contains(r.ownerDocument.activeElement)&&t.focus(),i(a)}return{dom:r,top:e.top,mount:()=>{if(e.focus){let a;typeof e.focus=="string"?a=s.querySelector(e.focus):a=s.querySelector("input")||s.querySelector("button"),a&&"select"in a?a.select():a&&"focus"in a&&a.focus()}}}}class Qt extends ai{compare(e){return this==e||this.constructor==e.constructor&&this.eq(e)}eq(e){return!1}destroy(e){}}Qt.prototype.elementClass="";Qt.prototype.toDOM=void 0;Qt.prototype.mapMode=Re.TrackBefore;Qt.prototype.startSide=Qt.prototype.endSide=-1;Qt.prototype.point=!0;const lr=D.define(),q0=D.define(),V0={class:"",renderEmptyElements:!1,elementStyle:"",markers:()=>q.empty,lineMarker:()=>null,widgetMarker:()=>null,lineMarkerChange:null,initialSpacer:null,updateSpacer:null,domEventHandlers:{},side:"before"},js=D.define();function Q0(t){return[Jf(),js.of({...V0,...t})]}const ch=D.define({combine:t=>t.some(e=>e)});function Jf(t){return[j0]}const j0=pe.fromClass(class{constructor(t){this.view=t,this.domAfter=null,this.prevViewport=t.viewport,this.dom=document.createElement("div"),this.dom.className="cm-gutters cm-gutters-before",this.dom.setAttribute("aria-hidden","true"),this.dom.style.minHeight=this.view.contentHeight/this.view.scaleY+"px",this.gutters=t.state.facet(js).map(e=>new dh(t,e)),this.fixed=!t.state.facet(ch);for(let e of this.gutters)e.config.side=="after"?this.getDOMAfter().appendChild(e.dom):this.dom.appendChild(e.dom);this.fixed&&(this.dom.style.position="sticky"),this.syncGutters(!1),t.scrollDOM.insertBefore(this.dom,t.contentDOM)}getDOMAfter(){return this.domAfter||(this.domAfter=document.createElement("div"),this.domAfter.className="cm-gutters cm-gutters-after",this.domAfter.setAttribute("aria-hidden","true"),this.domAfter.style.minHeight=this.view.contentHeight/this.view.scaleY+"px",this.domAfter.style.position=this.fixed?"sticky":"",this.view.scrollDOM.appendChild(this.domAfter)),this.domAfter}update(t){if(this.updateGutters(t)){let e=this.prevViewport,i=t.view.viewport,s=Math.min(e.to,i.to)-Math.max(e.from,i.from);this.syncGutters(s<(i.to-i.from)*.8)}if(t.geometryChanged){let e=this.view.contentHeight/this.view.scaleY+"px";this.dom.style.minHeight=e,this.domAfter&&(this.domAfter.style.minHeight=e)}this.view.state.facet(ch)!=!this.fixed&&(this.fixed=!this.fixed,this.dom.style.position=this.fixed?"sticky":"",this.domAfter&&(this.domAfter.style.position=this.fixed?"sticky":"")),this.prevViewport=t.view.viewport}syncGutters(t){let e=this.dom.nextSibling;t&&(this.dom.remove(),this.domAfter&&this.domAfter.remove());let i=q.iter(this.view.state.facet(lr),this.view.viewport.from),s=[],n=this.gutters.map(r=>new K0(r,this.view.viewport,-this.view.documentPadding.top));for(let r of this.view.viewportLineBlocks)if(s.length&&(s=[]),Array.isArray(r.type)){let o=!0;for(let a of r.type)if(a.type==Ae.Text&&o){La(i,s,a.from);for(let l of n)l.line(this.view,a,s);o=!1}else if(a.widget)for(let l of n)l.widget(this.view,a)}else if(r.type==Ae.Text){La(i,s,r.from);for(let o of n)o.line(this.view,r,s)}else if(r.widget)for(let o of n)o.widget(this.view,r);for(let r of n)r.finish();t&&(this.view.scrollDOM.insertBefore(this.dom,e),this.domAfter&&this.view.scrollDOM.appendChild(this.domAfter))}updateGutters(t){let e=t.startState.facet(js),i=t.state.facet(js),s=t.docChanged||t.heightChanged||t.viewportChanged||!q.eq(t.startState.facet(lr),t.state.facet(lr),t.view.viewport.from,t.view.viewport.to);if(e==i)for(let n of this.gutters)n.update(t)&&(s=!0);else{s=!0;let n=[];for(let r of i){let o=e.indexOf(r);o<0?n.push(new dh(this.view,r)):(this.gutters[o].update(t),n.push(this.gutters[o]))}for(let r of this.gutters)r.dom.remove(),n.indexOf(r)<0&&r.destroy();for(let r of n)r.config.side=="after"?this.getDOMAfter().appendChild(r.dom):this.dom.appendChild(r.dom);this.gutters=n}return s}destroy(){for(let t of this.gutters)t.destroy();this.dom.remove(),this.domAfter&&this.domAfter.remove()}},{provide:t=>_.scrollMargins.of(e=>{let i=e.plugin(t);if(!i||i.gutters.length==0||!i.fixed)return null;let s=i.dom.offsetWidth*e.scaleX,n=i.domAfter?i.domAfter.offsetWidth*e.scaleX:0;return e.textDirection==ee.LTR?{left:s,right:n}:{right:s,left:n}})});function hh(t){return Array.isArray(t)?t:[t]}function La(t,e,i){for(;t.value&&t.from<=i;)t.from==i&&e.push(t.value),t.next()}class K0{constructor(e,i,s){this.gutter=e,this.height=s,this.i=0,this.cursor=q.iter(e.markers,i.from)}addElement(e,i,s){let{gutter:n}=this,r=(i.top-this.height)/e.scaleY,o=i.height/e.scaleY;if(this.i==n.elements.length){let a=new Yf(e,o,r,s);n.elements.push(a),n.dom.appendChild(a.dom)}else n.elements[this.i].update(e,o,r,s);this.height=i.bottom,this.i++}line(e,i,s){let n=[];La(this.cursor,n,i.from),s.length&&(n=n.concat(s));let r=this.gutter.config.lineMarker(e,i,n);r&&n.unshift(r);let o=this.gutter;n.length==0&&!o.config.renderEmptyElements||this.addElement(e,i,n)}widget(e,i){let s=this.gutter.config.widgetMarker(e,i.widget,i),n=s?[s]:null;for(let r of e.state.facet(q0)){let o=r(e,i.widget,i);o&&(n||(n=[])).push(o)}n&&this.addElement(e,i,n)}finish(){let e=this.gutter;for(;e.elements.length>this.i;){let i=e.elements.pop();e.dom.removeChild(i.dom),i.destroy()}}}class dh{constructor(e,i){this.view=e,this.config=i,this.elements=[],this.spacer=null,this.dom=document.createElement("div"),this.dom.className="cm-gutter"+(this.config.class?" "+this.config.class:"");for(let s in i.domEventHandlers)this.dom.addEventListener(s,n=>{let r=n.target,o;if(r!=this.dom&&this.dom.contains(r)){for(;r.parentNode!=this.dom;)r=r.parentNode;let l=r.getBoundingClientRect();o=(l.top+l.bottom)/2}else o=n.clientY;let a=e.lineBlockAtHeight(o-e.documentTop);i.domEventHandlers[s](e,a,n)&&n.preventDefault()});this.markers=hh(i.markers(e)),i.initialSpacer&&(this.spacer=new Yf(e,0,0,[i.initialSpacer(e)]),this.dom.appendChild(this.spacer.dom),this.spacer.dom.style.cssText+="visibility: hidden; pointer-events: none")}update(e){let i=this.markers;if(this.markers=hh(this.config.markers(e.view)),this.spacer&&this.config.updateSpacer){let n=this.config.updateSpacer(this.spacer.markers[0],e);n!=this.spacer.markers[0]&&this.spacer.update(e.view,0,0,[n])}let s=e.view.viewport;return!q.eq(this.markers,i,s.from,s.to)||(this.config.lineMarkerChange?this.config.lineMarkerChange(e):!1)}destroy(){for(let e of this.elements)e.destroy()}}class Yf{constructor(e,i,s,n){this.height=-1,this.above=0,this.markers=[],this.dom=document.createElement("div"),this.dom.className="cm-gutterElement",this.update(e,i,s,n)}update(e,i,s,n){this.height!=i&&(this.height=i,this.dom.style.height=i+"px"),this.above!=s&&(this.dom.style.marginTop=(this.above=s)?s+"px":""),X0(this.markers,n)||this.setMarkers(e,n)}setMarkers(e,i){let s="cm-gutterElement",n=this.dom.firstChild;for(let r=0,o=0;;){let a=o,l=r<i.length?i[r++]:null,c=!1;if(l){let h=l.elementClass;h&&(s+=" "+h);for(let d=o;d<this.markers.length;d++)if(this.markers[d].compare(l)){a=d,c=!0;break}}else a=this.markers.length;for(;o<a;){let h=this.markers[o++];if(h.toDOM){h.destroy(n);let d=n.nextSibling;n.remove(),n=d}}if(!l)break;l.toDOM&&(c?n=n.nextSibling:this.dom.insertBefore(l.toDOM(e),n)),c&&o++}this.dom.className=s,this.markers=i}destroy(){this.setMarkers(null,[])}}function X0(t,e){if(t.length!=e.length)return!1;for(let i=0;i<t.length;i++)if(!t[i].compare(e[i]))return!1;return!0}const J0=D.define(),Y0=D.define(),Zi=D.define({combine(t){return Rt(t,{formatNumber:String,domEventHandlers:{}},{domEventHandlers(e,i){let s=Object.assign({},e);for(let n in i){let r=s[n],o=i[n];s[n]=r?(a,l,c)=>r(a,l,c)||o(a,l,c):o}return s}})}});class Bo extends Qt{constructor(e){super(),this.number=e}eq(e){return this.number==e.number}toDOM(){return document.createTextNode(this.number)}}function Ro(t,e){return t.state.facet(Zi).formatNumber(e,t.state)}const G0=js.compute([Zi],t=>({class:"cm-lineNumbers",renderEmptyElements:!1,markers(e){return e.state.facet(J0)},lineMarker(e,i,s){return s.some(n=>n.toDOM)?null:new Bo(Ro(e,e.state.doc.lineAt(i.from).number))},widgetMarker:(e,i,s)=>{for(let n of e.state.facet(Y0)){let r=n(e,i,s);if(r)return r}return null},lineMarkerChange:e=>e.startState.facet(Zi)!=e.state.facet(Zi),initialSpacer(e){return new Bo(Ro(e,fh(e.state.doc.lines)))},updateSpacer(e,i){let s=Ro(i.view,fh(i.view.state.doc.lines));return s==e.number?e:new Bo(s)},domEventHandlers:t.facet(Zi).domEventHandlers,side:"before"}));function Z0(t={}){return[Zi.of(t),Jf(),G0]}function fh(t){let e=9;for(;e<t;)e=e*10+9;return e}const ev=new class extends Qt{constructor(){super(...arguments),this.elementClass="cm-activeLineGutter"}},tv=lr.compute(["selection"],t=>{let e=[],i=-1;for(let s of t.selection.ranges){let n=t.doc.lineAt(s.head).from;n>i&&(i=n,e.push(ev.range(n)))}return q.of(e)});function iv(){return tv}const Gf=1024;let sv=0;class Lo{constructor(e,i){this.from=e,this.to=i}}class W{constructor(e={}){this.id=sv++,this.perNode=!!e.perNode,this.deserialize=e.deserialize||(()=>{throw new Error("This node type doesn't define a deserialize function")}),this.combine=e.combine||null}add(e){if(this.perNode)throw new RangeError("Can't add per-node props to node types");return typeof e!="function"&&(e=Ve.match(e)),i=>{let s=e(i);return s===void 0?null:[this,s]}}}W.closedBy=new W({deserialize:t=>t.split(" ")});W.openedBy=new W({deserialize:t=>t.split(" ")});W.group=new W({deserialize:t=>t.split(" ")});W.isolate=new W({deserialize:t=>{if(t&&t!="rtl"&&t!="ltr"&&t!="auto")throw new RangeError("Invalid value for isolate: "+t);return t||"auto"}});W.contextHash=new W({perNode:!0});W.lookAhead=new W({perNode:!0});W.mounted=new W({perNode:!0});class Ks{constructor(e,i,s,n=!1){this.tree=e,this.overlay=i,this.parser=s,this.bracketed=n}static get(e){return e&&e.props&&e.props[W.mounted.id]}}const nv=Object.create(null);class Ve{constructor(e,i,s,n=0){this.name=e,this.props=i,this.id=s,this.flags=n}static define(e){let i=e.props&&e.props.length?Object.create(null):nv,s=(e.top?1:0)|(e.skipped?2:0)|(e.error?4:0)|(e.name==null?8:0),n=new Ve(e.name||"",i,e.id,s);if(e.props){for(let r of e.props)if(Array.isArray(r)||(r=r(n)),r){if(r[0].perNode)throw new RangeError("Can't store a per-node prop on a node type");i[r[0].id]=r[1]}}return n}prop(e){return this.props[e.id]}get isTop(){return(this.flags&1)>0}get isSkipped(){return(this.flags&2)>0}get isError(){return(this.flags&4)>0}get isAnonymous(){return(this.flags&8)>0}is(e){if(typeof e=="string"){if(this.name==e)return!0;let i=this.prop(W.group);return i?i.indexOf(e)>-1:!1}return this.id==e}static match(e){let i=Object.create(null);for(let s in e)for(let n of s.split(" "))i[n]=e[s];return s=>{for(let n=s.prop(W.group),r=-1;r<(n?n.length:0);r++){let o=i[r<0?s.name:n[r]];if(o)return o}}}}Ve.none=new Ve("",Object.create(null),0,8);class Pl{constructor(e){this.types=e;for(let i=0;i<e.length;i++)if(e[i].id!=i)throw new RangeError("Node type ids should correspond to array positions when creating a node set")}extend(...e){let i=[];for(let s of this.types){let n=null;for(let r of e){let o=r(s);if(o){n||(n=Object.assign({},s.props));let a=o[1],l=o[0];l.combine&&l.id in n&&(a=l.combine(n[l.id],a)),n[l.id]=a}}i.push(n?new Ve(s.name,n,s.id,s.flags):s)}return new Pl(i)}}const Vn=new WeakMap,uh=new WeakMap;var ce;(function(t){t[t.ExcludeBuffers=1]="ExcludeBuffers",t[t.IncludeAnonymous=2]="IncludeAnonymous",t[t.IgnoreMounts=4]="IgnoreMounts",t[t.IgnoreOverlays=8]="IgnoreOverlays",t[t.EnterBracketed=16]="EnterBracketed"})(ce||(ce={}));class ue{constructor(e,i,s,n,r){if(this.type=e,this.children=i,this.positions=s,this.length=n,this.props=null,r&&r.length){this.props=Object.create(null);for(let[o,a]of r)this.props[typeof o=="number"?o:o.id]=a}}toString(){let e=Ks.get(this);if(e&&!e.overlay)return e.tree.toString();let i="";for(let s of this.children){let n=s.toString();n&&(i&&(i+=","),i+=n)}return this.type.name?(/\W/.test(this.type.name)&&!this.type.isError?JSON.stringify(this.type.name):this.type.name)+(i.length?"("+i+")":""):i}cursor(e=0){return new Fa(this.topNode,e)}cursorAt(e,i=0,s=0){let n=Vn.get(this)||this.topNode,r=new Fa(n);return r.moveTo(e,i),Vn.set(this,r._tree),r}get topNode(){return new nt(this,0,0,null)}resolve(e,i=0){let s=cn(Vn.get(this)||this.topNode,e,i,!1);return Vn.set(this,s),s}resolveInner(e,i=0){let s=cn(uh.get(this)||this.topNode,e,i,!0);return uh.set(this,s),s}resolveStack(e,i=0){return av(this,e,i)}iterate(e){let{enter:i,leave:s,from:n=0,to:r=this.length}=e,o=e.mode||0,a=(o&ce.IncludeAnonymous)>0;for(let l=this.cursor(o|ce.IncludeAnonymous);;){let c=!1;if(l.from<=r&&l.to>=n&&(!a&&l.type.isAnonymous||i(l)!==!1)){if(l.firstChild())continue;c=!0}for(;c&&s&&(a||!l.type.isAnonymous)&&s(l),!l.nextSibling();){if(!l.parent())return;c=!0}}}prop(e){return e.perNode?this.props?this.props[e.id]:void 0:this.type.prop(e)}get propValues(){let e=[];if(this.props)for(let i in this.props)e.push([+i,this.props[i]]);return e}balance(e={}){return this.children.length<=8?this:El(Ve.none,this.children,this.positions,0,this.children.length,0,this.length,(i,s,n)=>new ue(this.type,i,s,n,this.propValues),e.makeTree||((i,s,n)=>new ue(Ve.none,i,s,n)))}static build(e){return lv(e)}}ue.empty=new ue(Ve.none,[],[],0);class Tl{constructor(e,i){this.buffer=e,this.index=i}get id(){return this.buffer[this.index-4]}get start(){return this.buffer[this.index-3]}get end(){return this.buffer[this.index-2]}get size(){return this.buffer[this.index-1]}get pos(){return this.index}next(){this.index-=4}fork(){return new Tl(this.buffer,this.index)}}class di{constructor(e,i,s){this.buffer=e,this.length=i,this.set=s}get type(){return Ve.none}toString(){let e=[];for(let i=0;i<this.buffer.length;)e.push(this.childString(i)),i=this.buffer[i+3];return e.join(",")}childString(e){let i=this.buffer[e],s=this.buffer[e+3],n=this.set.types[i],r=n.name;if(/\W/.test(r)&&!n.isError&&(r=JSON.stringify(r)),e+=4,s==e)return r;let o=[];for(;e<s;)o.push(this.childString(e)),e=this.buffer[e+3];return r+"("+o.join(",")+")"}findChild(e,i,s,n,r){let{buffer:o}=this,a=-1;for(let l=e;l!=i&&!(Zf(r,n,o[l+1],o[l+2])&&(a=l,s>0));l=o[l+3]);return a}slice(e,i,s){let n=this.buffer,r=new Uint16Array(i-e),o=0;for(let a=e,l=0;a<i;){r[l++]=n[a++],r[l++]=n[a++]-s;let c=r[l++]=n[a++]-s;r[l++]=n[a++]-e,o=Math.max(o,c)}return new di(r,o,this.set)}}function Zf(t,e,i,s){switch(t){case-2:return i<e;case-1:return s>=e&&i<e;case 0:return i<e&&s>e;case 1:return i<=e&&s>e;case 2:return s>e;case 4:return!0}}function cn(t,e,i,s){for(var n;t.from==t.to||(i<1?t.from>=e:t.from>e)||(i>-1?t.to<=e:t.to<e);){let o=!s&&t instanceof nt&&t.index<0?null:t.parent;if(!o)return t;t=o}let r=s?0:ce.IgnoreOverlays;if(s)for(let o=t,a=o.parent;a;o=a,a=o.parent)o instanceof nt&&o.index<0&&((n=a.enter(e,i,r))===null||n===void 0?void 0:n.from)!=o.from&&(t=a);for(;;){let o=t.enter(e,i,r);if(!o)return t;t=o}}class eu{cursor(e=0){return new Fa(this,e)}getChild(e,i=null,s=null){let n=ph(this,e,i,s);return n.length?n[0]:null}getChildren(e,i=null,s=null){return ph(this,e,i,s)}resolve(e,i=0){return cn(this,e,i,!1)}resolveInner(e,i=0){return cn(this,e,i,!0)}matchContext(e){return Ia(this.parent,e)}enterUnfinishedNodesBefore(e){let i=this.childBefore(e),s=this;for(;i;){let n=i.lastChild;if(!n||n.to!=i.to)break;n.type.isError&&n.from==n.to?(s=i,i=n.prevSibling):i=n}return s}get node(){return this}get next(){return this.parent}}class nt extends eu{constructor(e,i,s,n){super(),this._tree=e,this.from=i,this.index=s,this._parent=n}get type(){return this._tree.type}get name(){return this._tree.type.name}get to(){return this.from+this._tree.length}nextChild(e,i,s,n,r=0){for(let o=this;;){for(let{children:a,positions:l}=o._tree,c=i>0?a.length:-1;e!=c;e+=i){let h=a[e],d=l[e]+o.from,f;if(!(!(r&ce.EnterBracketed&&h instanceof ue&&(f=Ks.get(h))&&!f.overlay&&f.bracketed&&s>=d&&s<=d+h.length)&&!Zf(n,s,d,d+h.length))){if(h instanceof di){if(r&ce.ExcludeBuffers)continue;let u=h.findChild(0,h.buffer.length,i,s-d,n);if(u>-1)return new ii(new rv(o,h,e,d),null,u)}else if(r&ce.IncludeAnonymous||!h.type.isAnonymous||Ml(h)){let u;if(!(r&ce.IgnoreMounts)&&(u=Ks.get(h))&&!u.overlay)return new nt(u.tree,d,e,o);let p=new nt(h,d,e,o);return r&ce.IncludeAnonymous||!p.type.isAnonymous?p:p.nextChild(i<0?h.children.length-1:0,i,s,n,r)}}}if(r&ce.IncludeAnonymous||!o.type.isAnonymous||(o.index>=0?e=o.index+i:e=i<0?-1:o._parent._tree.children.length,o=o._parent,!o))return null}}get firstChild(){return this.nextChild(0,1,0,4)}get lastChild(){return this.nextChild(this._tree.children.length-1,-1,0,4)}childAfter(e){return this.nextChild(0,1,e,2)}childBefore(e){return this.nextChild(this._tree.children.length-1,-1,e,-2)}prop(e){return this._tree.prop(e)}enter(e,i,s=0){let n;if(!(s&ce.IgnoreOverlays)&&(n=Ks.get(this._tree))&&n.overlay){let r=e-this.from,o=s&ce.EnterBracketed&&n.bracketed;for(let{from:a,to:l}of n.overlay)if((i>0||o?a<=r:a<r)&&(i<0||o?l>=r:l>r))return new nt(n.tree,n.overlay[0].from+this.from,-1,this)}return this.nextChild(0,1,e,i,s)}nextSignificantParent(){let e=this;for(;e.type.isAnonymous&&e._parent;)e=e._parent;return e}get parent(){return this._parent?this._parent.nextSignificantParent():null}get nextSibling(){return this._parent&&this.index>=0?this._parent.nextChild(this.index+1,1,0,4):null}get prevSibling(){return this._parent&&this.index>=0?this._parent.nextChild(this.index-1,-1,0,4):null}get tree(){return this._tree}toTree(){return this._tree}toString(){return this._tree.toString()}}function ph(t,e,i,s){let n=t.cursor(),r=[];if(!n.firstChild())return r;if(i!=null){for(let o=!1;!o;)if(o=n.type.is(i),!n.nextSibling())return r}for(;;){if(s!=null&&n.type.is(s))return r;if(n.type.is(e)&&r.push(n.node),!n.nextSibling())return s==null?r:[]}}function Ia(t,e,i=e.length-1){for(let s=t;i>=0;s=s.parent){if(!s)return!1;if(!s.type.isAnonymous){if(e[i]&&e[i]!=s.name)return!1;i--}}return!0}class rv{constructor(e,i,s,n){this.parent=e,this.buffer=i,this.index=s,this.start=n}}class ii extends eu{get name(){return this.type.name}get from(){return this.context.start+this.context.buffer.buffer[this.index+1]}get to(){return this.context.start+this.context.buffer.buffer[this.index+2]}constructor(e,i,s){super(),this.context=e,this._parent=i,this.index=s,this.type=e.buffer.set.types[e.buffer.buffer[s]]}child(e,i,s){let{buffer:n}=this.context,r=n.findChild(this.index+4,n.buffer[this.index+3],e,i-this.context.start,s);return r<0?null:new ii(this.context,this,r)}get firstChild(){return this.child(1,0,4)}get lastChild(){return this.child(-1,0,4)}childAfter(e){return this.child(1,e,2)}childBefore(e){return this.child(-1,e,-2)}prop(e){return this.type.prop(e)}enter(e,i,s=0){if(s&ce.ExcludeBuffers)return null;let{buffer:n}=this.context,r=n.findChild(this.index+4,n.buffer[this.index+3],i>0?1:-1,e-this.context.start,i);return r<0?null:new ii(this.context,this,r)}get parent(){return this._parent||this.context.parent.nextSignificantParent()}externalSibling(e){return this._parent?null:this.context.parent.nextChild(this.context.index+e,e,0,4)}get nextSibling(){let{buffer:e}=this.context,i=e.buffer[this.index+3];return i<(this._parent?e.buffer[this._parent.index+3]:e.buffer.length)?new ii(this.context,this._parent,i):this.externalSibling(1)}get prevSibling(){let{buffer:e}=this.context,i=this._parent?this._parent.index+4:0;return this.index==i?this.externalSibling(-1):new ii(this.context,this._parent,e.findChild(i,this.index,-1,0,4))}get tree(){return null}toTree(){let e=[],i=[],{buffer:s}=this.context,n=this.index+4,r=s.buffer[this.index+3];if(r>n){let o=s.buffer[this.index+1];e.push(s.slice(n,r,o)),i.push(0)}return new ue(this.type,e,i,this.to-this.from)}toString(){return this.context.buffer.childString(this.index)}}function tu(t){if(!t.length)return null;let e=0,i=t[0];for(let r=1;r<t.length;r++){let o=t[r];(o.from>i.from||o.to<i.to)&&(i=o,e=r)}let s=i instanceof nt&&i.index<0?null:i.parent,n=t.slice();return s?n[e]=s:n.splice(e,1),new ov(n,i)}class ov{constructor(e,i){this.heads=e,this.node=i}get next(){return tu(this.heads)}}function av(t,e,i){let s=t.resolveInner(e,i),n=null;for(let r=s instanceof nt?s:s.context.parent;r;r=r.parent)if(r.index<0){let o=r.parent;(n||(n=[s])).push(o.resolve(e,i)),r=o}else{let o=Ks.get(r.tree);if(o&&o.overlay&&o.overlay[0].from<=e&&o.overlay[o.overlay.length-1].to>=e){let a=new nt(o.tree,o.overlay[0].from+r.from,-1,r);(n||(n=[s])).push(cn(a,e,i,!1))}}return n?tu(n):s}class Fa{get name(){return this.type.name}constructor(e,i=0){if(this.buffer=null,this.stack=[],this.index=0,this.bufferNode=null,this.mode=i&~ce.EnterBracketed,e instanceof nt)this.yieldNode(e);else{this._tree=e.context.parent,this.buffer=e.context;for(let s=e._parent;s;s=s._parent)this.stack.unshift(s.index);this.bufferNode=e,this.yieldBuf(e.index)}}yieldNode(e){return e?(this._tree=e,this.type=e.type,this.from=e.from,this.to=e.to,!0):!1}yieldBuf(e,i){this.index=e;let{start:s,buffer:n}=this.buffer;return this.type=i||n.set.types[n.buffer[e]],this.from=s+n.buffer[e+1],this.to=s+n.buffer[e+2],!0}yield(e){return e?e instanceof nt?(this.buffer=null,this.yieldNode(e)):(this.buffer=e.context,this.yieldBuf(e.index,e.type)):!1}toString(){return this.buffer?this.buffer.buffer.childString(this.index):this._tree.toString()}enterChild(e,i,s){if(!this.buffer)return this.yield(this._tree.nextChild(e<0?this._tree._tree.children.length-1:0,e,i,s,this.mode));let{buffer:n}=this.buffer,r=n.findChild(this.index+4,n.buffer[this.index+3],e,i-this.buffer.start,s);return r<0?!1:(this.stack.push(this.index),this.yieldBuf(r))}firstChild(){return this.enterChild(1,0,4)}lastChild(){return this.enterChild(-1,0,4)}childAfter(e){return this.enterChild(1,e,2)}childBefore(e){return this.enterChild(-1,e,-2)}enter(e,i,s=this.mode){return this.buffer?s&ce.ExcludeBuffers?!1:this.enterChild(1,e,i):this.yield(this._tree.enter(e,i,s))}parent(){if(!this.buffer)return this.yieldNode(this.mode&ce.IncludeAnonymous?this._tree._parent:this._tree.parent);if(this.stack.length)return this.yieldBuf(this.stack.pop());let e=this.mode&ce.IncludeAnonymous?this.buffer.parent:this.buffer.parent.nextSignificantParent();return this.buffer=null,this.yieldNode(e)}sibling(e){if(!this.buffer)return this._tree._parent?this.yield(this._tree.index<0?null:this._tree._parent.nextChild(this._tree.index+e,e,0,4,this.mode)):!1;let{buffer:i}=this.buffer,s=this.stack.length-1;if(e<0){let n=s<0?0:this.stack[s]+4;if(this.index!=n)return this.yieldBuf(i.findChild(n,this.index,-1,0,4))}else{let n=i.buffer[this.index+3];if(n<(s<0?i.buffer.length:i.buffer[this.stack[s]+3]))return this.yieldBuf(n)}return s<0?this.yield(this.buffer.parent.nextChild(this.buffer.index+e,e,0,4,this.mode)):!1}nextSibling(){return this.sibling(1)}prevSibling(){return this.sibling(-1)}atLastNode(e){let i,s,{buffer:n}=this;if(n){if(e>0){if(this.index<n.buffer.buffer.length)return!1}else for(let r=0;r<this.index;r++)if(n.buffer.buffer[r+3]<this.index)return!1;({index:i,parent:s}=n)}else({index:i,_parent:s}=this._tree);for(;s;{index:i,_parent:s}=s)if(i>-1)for(let r=i+e,o=e<0?-1:s._tree.children.length;r!=o;r+=e){let a=s._tree.children[r];if(this.mode&ce.IncludeAnonymous||a instanceof di||!a.type.isAnonymous||Ml(a))return!1}return!0}move(e,i){if(i&&this.enterChild(e,0,4))return!0;for(;;){if(this.sibling(e))return!0;if(this.atLastNode(e)||!this.parent())return!1}}next(e=!0){return this.move(1,e)}prev(e=!0){return this.move(-1,e)}moveTo(e,i=0){for(;(this.from==this.to||(i<1?this.from>=e:this.from>e)||(i>-1?this.to<=e:this.to<e))&&this.parent(););for(;this.enterChild(1,e,i););return this}get node(){if(!this.buffer)return this._tree;let e=this.bufferNode,i=null,s=0;if(e&&e.context==this.buffer)e:for(let n=this.index,r=this.stack.length;r>=0;){for(let o=e;o;o=o._parent)if(o.index==n){if(n==this.index)return o;i=o,s=r+1;break e}n=this.stack[--r]}for(let n=s;n<this.stack.length;n++)i=new ii(this.buffer,i,this.stack[n]);return this.bufferNode=new ii(this.buffer,i,this.index)}get tree(){return this.buffer?null:this._tree._tree}iterate(e,i){for(let s=0;;){let n=!1;if(this.type.isAnonymous||e(this)!==!1){if(this.firstChild()){s++;continue}this.type.isAnonymous||(n=!0)}for(;;){if(n&&i&&i(this),n=this.type.isAnonymous,!s)return;if(this.nextSibling())break;this.parent(),s--,n=!0}}}matchContext(e){if(!this.buffer)return Ia(this.node.parent,e);let{buffer:i}=this.buffer,{types:s}=i.set;for(let n=e.length-1,r=this.stack.length-1;n>=0;r--){if(r<0)return Ia(this._tree,e,n);let o=s[i.buffer[this.stack[r]]];if(!o.isAnonymous){if(e[n]&&e[n]!=o.name)return!1;n--}}return!0}}function Ml(t){return t.children.some(e=>e instanceof di||!e.type.isAnonymous||Ml(e))}function lv(t){var e;let{buffer:i,nodeSet:s,maxBufferLength:n=Gf,reused:r=[],minRepeatType:o=s.types.length}=t,a=Array.isArray(i)?new Tl(i,i.length):i,l=s.types,c=0,h=0;function d(A,$,P,z,V,G){let{id:U,start:F,end:J,size:X}=a,ie=h,_e=c;if(X<0)if(a.next(),X==-1){let It=r[U];P.push(It),z.push(F-A);return}else if(X==-3){c=U;return}else if(X==-4){h=U;return}else throw new RangeError(`Unrecognized record size: ${X}`);let Qe=l[U],vt,Se,Ze=F-A;if(J-F<=n&&(Se=b(a.pos-$,V))){let It=new Uint16Array(Se.size-Se.skip),et=a.pos-Se.size,yt=It.length;for(;a.pos>et;)yt=x(Se.start,It,yt);vt=new di(It,J-Se.start,s),Ze=Se.start-A}else{let It=a.pos-X;a.next();let et=[],yt=[],xi=U>=o?U:-1,Vi=0,Tn=J;for(;a.pos>It;)xi>=0&&a.id==xi&&a.size>=0?(a.end<=Tn-n&&(p(et,yt,F,Vi,a.end,Tn,xi,ie,_e),Vi=et.length,Tn=a.end),a.next()):G>2500?f(F,It,et,yt):d(F,It,et,yt,xi,G+1);if(xi>=0&&Vi>0&&Vi<et.length&&p(et,yt,F,Vi,F,Tn,xi,ie,_e),et.reverse(),yt.reverse(),xi>-1&&Vi>0){let Zl=u(Qe,_e);vt=El(Qe,et,yt,0,et.length,0,J-F,Zl,Zl)}else vt=m(Qe,et,yt,J-F,ie-J,_e)}P.push(vt),z.push(Ze)}function f(A,$,P,z){let V=[],G=0,U=-1;for(;a.pos>$;){let{id:F,start:J,end:X,size:ie}=a;if(ie>4)a.next();else{if(U>-1&&J<U)break;U<0&&(U=X-n),V.push(F,J,X),G++,a.next()}}if(G){let F=new Uint16Array(G*4),J=V[V.length-2];for(let X=V.length-3,ie=0;X>=0;X-=3)F[ie++]=V[X],F[ie++]=V[X+1]-J,F[ie++]=V[X+2]-J,F[ie++]=ie;P.push(new di(F,V[2]-J,s)),z.push(J-A)}}function u(A,$){return(P,z,V)=>{let G=0,U=P.length-1,F,J;if(U>=0&&(F=P[U])instanceof ue){if(!U&&F.type==A&&F.length==V)return F;(J=F.prop(W.lookAhead))&&(G=z[U]+F.length+J)}return m(A,P,z,V,G,$)}}function p(A,$,P,z,V,G,U,F,J){let X=[],ie=[];for(;A.length>z;)X.push(A.pop()),ie.push($.pop()+P-V);A.push(m(s.types[U],X,ie,G-V,F-G,J)),$.push(V-P)}function m(A,$,P,z,V,G,U){if(G){let F=[W.contextHash,G];U=U?[F].concat(U):[F]}if(V>25){let F=[W.lookAhead,V];U=U?[F].concat(U):[F]}return new ue(A,$,P,z,U)}function b(A,$){let P=a.fork(),z=0,V=0,G=0,U=P.end-n,F={size:0,start:0,skip:0};e:for(let J=P.pos-A;P.pos>J;){let X=P.size;if(P.id==$&&X>=0){F.size=z,F.start=V,F.skip=G,G+=4,z+=4,P.next();continue}let ie=P.pos-X;if(X<0||ie<J||P.start<U)break;let _e=P.id>=o?4:0,Qe=P.start;for(P.next();P.pos>ie;){if(P.size<0)if(P.size==-3||P.size==-4)_e+=4;else break e;else P.id>=o&&(_e+=4);P.next()}V=Qe,z+=X,G+=_e}return($<0||z==A)&&(F.size=z,F.start=V,F.skip=G),F.size>4?F:void 0}function x(A,$,P){let{id:z,start:V,end:G,size:U}=a;if(a.next(),U>=0&&z<o){let F=P;if(U>4){let J=a.pos-(U-4);for(;a.pos>J;)P=x(A,$,P)}$[--P]=F,$[--P]=G-A,$[--P]=V-A,$[--P]=z}else U==-3?c=z:U==-4&&(h=z);return P}let k=[],O=[];for(;a.pos>0;)d(t.start||0,t.bufferStart||0,k,O,-1,0);let R=(e=t.length)!==null&&e!==void 0?e:k.length?O[0]+k[0].length:0;return new ue(l[t.topID],k.reverse(),O.reverse(),R)}const gh=new WeakMap;function cr(t,e){if(!t.isAnonymous||e instanceof di||e.type!=t)return 1;let i=gh.get(e);if(i==null){i=1;for(let s of e.children){if(s.type!=t||!(s instanceof ue)){i=1;break}i+=cr(t,s)}gh.set(e,i)}return i}function El(t,e,i,s,n,r,o,a,l){let c=0;for(let p=s;p<n;p++)c+=cr(t,e[p]);let h=Math.ceil(c*1.5/8),d=[],f=[];function u(p,m,b,x,k){for(let O=b;O<x;){let R=O,A=m[O],$=cr(t,p[O]);for(O++;O<x;O++){let P=cr(t,p[O]);if($+P>=h)break;$+=P}if(O==R+1){if($>h){let P=p[R];u(P.children,P.positions,0,P.children.length,m[R]+k);continue}d.push(p[R])}else{let P=m[O-1]+p[O-1].length-A;d.push(El(t,p,m,R,O,A,P,null,l))}f.push(A+k-r)}}return u(e,i,s,n,0),(a||l)(d,f,o)}class Ri{constructor(e,i,s,n,r=!1,o=!1){this.from=e,this.to=i,this.tree=s,this.offset=n,this.open=(r?1:0)|(o?2:0)}get openStart(){return(this.open&1)>0}get openEnd(){return(this.open&2)>0}static addTree(e,i=[],s=!1){let n=[new Ri(0,e.length,e,0,!1,s)];for(let r of i)r.to>e.length&&n.push(r);return n}static applyChanges(e,i,s=128){if(!i.length)return e;let n=[],r=1,o=e.length?e[0]:null;for(let a=0,l=0,c=0;;a++){let h=a<i.length?i[a]:null,d=h?h.fromA:1e9;if(d-l>=s)for(;o&&o.from<d;){let f=o;if(l>=f.from||d<=f.to||c){let u=Math.max(f.from,l)-c,p=Math.min(f.to,d)-c;f=u>=p?null:new Ri(u,p,f.tree,f.offset+c,a>0,!!h)}if(f&&n.push(f),o.to>d)break;o=r<e.length?e[r++]:null}if(!h)break;l=h.toA,c=h.toA-h.toB}return n}}class iu{startParse(e,i,s){return typeof e=="string"&&(e=new cv(e)),s=s?s.length?s.map(n=>new Lo(n.from,n.to)):[new Lo(0,0)]:[new Lo(0,e.length)],this.createParse(e,i||[],s)}parse(e,i,s){let n=this.startParse(e,i,s);for(;;){let r=n.advance();if(r)return r}}}class cv{constructor(e){this.string=e}get length(){return this.string.length}chunk(e){return this.string.slice(e)}get lineChunks(){return!1}read(e,i){return this.string.slice(e,i)}}new W({perNode:!0});let hv=0,Nt=class Na{constructor(e,i,s,n){this.name=e,this.set=i,this.base=s,this.modified=n,this.id=hv++}toString(){let{name:e}=this;for(let i of this.modified)i.name&&(e=`${i.name}(${e})`);return e}static define(e,i){let s=typeof e=="string"?e:"?";if(e instanceof Na&&(i=e),i!=null&&i.base)throw new Error("Can not derive from a modified tag");let n=new Na(s,[],null,[]);if(n.set.push(n),i)for(let r of i.set)n.set.push(r);return n}static defineModifier(e){let i=new Pr(e);return s=>s.modified.indexOf(i)>-1?s:Pr.get(s.base||s,s.modified.concat(i).sort((n,r)=>n.id-r.id))}},dv=0;class Pr{constructor(e){this.name=e,this.instances=[],this.id=dv++}static get(e,i){if(!i.length)return e;let s=i[0].instances.find(a=>a.base==e&&fv(i,a.modified));if(s)return s;let n=[],r=new Nt(e.name,n,e,i);for(let a of i)a.instances.push(r);let o=uv(i);for(let a of e.set)if(!a.modified.length)for(let l of o)n.push(Pr.get(a,l));return r}}function fv(t,e){return t.length==e.length&&t.every((i,s)=>i==e[s])}function uv(t){let e=[[]];for(let i=0;i<t.length;i++)for(let s=0,n=e.length;s<n;s++)e.push(e[s].concat(t[i]));return e.sort((i,s)=>s.length-i.length)}function su(t){let e=Object.create(null);for(let i in t){let s=t[i];Array.isArray(s)||(s=[s]);for(let n of i.split(" "))if(n){let r=[],o=2,a=n;for(let d=0;;){if(a=="..."&&d>0&&d+3==n.length){o=1;break}let f=/^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(a);if(!f)throw new RangeError("Invalid path: "+n);if(r.push(f[0]=="*"?"":f[0][0]=='"'?JSON.parse(f[0]):f[0]),d+=f[0].length,d==n.length)break;let u=n[d++];if(d==n.length&&u=="!"){o=0;break}if(u!="/")throw new RangeError("Invalid path: "+n);a=n.slice(d)}let l=r.length-1,c=r[l];if(!c)throw new RangeError("Invalid path: "+n);let h=new hn(s,o,l>0?r.slice(0,l):null);e[c]=h.sort(e[c])}}return nu.add(e)}const nu=new W({combine(t,e){let i,s,n;for(;t||e;){if(!t||e&&t.depth>=e.depth?(n=e,e=e.next):(n=t,t=t.next),i&&i.mode==n.mode&&!n.context&&!i.context)continue;let r=new hn(n.tags,n.mode,n.context);i?i.next=r:s=r,i=r}return s}});class hn{constructor(e,i,s,n){this.tags=e,this.mode=i,this.context=s,this.next=n}get opaque(){return this.mode==0}get inherit(){return this.mode==1}sort(e){return!e||e.depth<this.depth?(this.next=e,this):(e.next=this.sort(e.next),e)}get depth(){return this.context?this.context.length:0}}hn.empty=new hn([],2,null);function ru(t,e){let i=Object.create(null);for(let r of t)if(!Array.isArray(r.tag))i[r.tag.id]=r.class;else for(let o of r.tag)i[o.id]=r.class;let{scope:s,all:n=null}=e||{};return{style:r=>{let o=n;for(let a of r)for(let l of a.set){let c=i[l.id];if(c){o=o?o+" "+c:c;break}}return o},scope:s}}function pv(t,e){let i=null;for(let s of t){let n=s.style(e);n&&(i=i?i+" "+n:n)}return i}function gv(t,e,i,s=0,n=t.length){let r=new mv(s,Array.isArray(e)?e:[e],i);r.highlightRange(t.cursor(),s,n,"",r.highlighters),r.flush(n)}class mv{constructor(e,i,s){this.at=e,this.highlighters=i,this.span=s,this.class=""}startSpan(e,i){i!=this.class&&(this.flush(e),e>this.at&&(this.at=e),this.class=i)}flush(e){e>this.at&&this.class&&this.span(this.at,e,this.class)}highlightRange(e,i,s,n,r){let{type:o,from:a,to:l}=e;if(a>=s||l<=i)return;o.isTop&&(r=this.highlighters.filter(u=>!u.scope||u.scope(o)));let c=n,h=bv(e)||hn.empty,d=pv(r,h.tags);if(d&&(c&&(c+=" "),c+=d,h.mode==1&&(n+=(n?" ":"")+d)),this.startSpan(Math.max(i,a),c),h.opaque)return;let f=e.tree&&e.tree.prop(W.mounted);if(f&&f.overlay){let u=e.node.enter(f.overlay[0].from+a,1),p=this.highlighters.filter(b=>!b.scope||b.scope(f.tree.type)),m=e.firstChild();for(let b=0,x=a;;b++){let k=b<f.overlay.length?f.overlay[b]:null,O=k?k.from+a:l,R=Math.max(i,x),A=Math.min(s,O);if(R<A&&m)for(;e.from<A&&(this.highlightRange(e,R,A,n,r),this.startSpan(Math.min(A,e.to),c),!(e.to>=O||!e.nextSibling())););if(!k||O>s)break;x=k.to+a,x>i&&(this.highlightRange(u.cursor(),Math.max(i,k.from+a),Math.min(s,x),"",p),this.startSpan(Math.min(s,x),c))}m&&e.parent()}else if(e.firstChild()){f&&(n="");do if(!(e.to<=i)){if(e.from>=s)break;this.highlightRange(e,i,s,n,r),this.startSpan(Math.min(s,e.to),c)}while(e.nextSibling());e.parent()}}}function bv(t){let e=t.type.prop(nu);for(;e&&e.context&&!t.matchContext(e.context);)e=e.next;return e||null}const T=Nt.define,Qn=T(),Yt=T(),mh=T(Yt),bh=T(Yt),Gt=T(),jn=T(Gt),Io=T(Gt),St=T(),ki=T(St),wt=T(),kt=T(),za=T(),Ds=T(za),Kn=T(),w={comment:Qn,lineComment:T(Qn),blockComment:T(Qn),docComment:T(Qn),name:Yt,variableName:T(Yt),typeName:mh,tagName:T(mh),propertyName:bh,attributeName:T(bh),className:T(Yt),labelName:T(Yt),namespace:T(Yt),macroName:T(Yt),literal:Gt,string:jn,docString:T(jn),character:T(jn),attributeValue:T(jn),number:Io,integer:T(Io),float:T(Io),bool:T(Gt),regexp:T(Gt),escape:T(Gt),color:T(Gt),url:T(Gt),keyword:wt,self:T(wt),null:T(wt),atom:T(wt),unit:T(wt),modifier:T(wt),operatorKeyword:T(wt),controlKeyword:T(wt),definitionKeyword:T(wt),moduleKeyword:T(wt),operator:kt,derefOperator:T(kt),arithmeticOperator:T(kt),logicOperator:T(kt),bitwiseOperator:T(kt),compareOperator:T(kt),updateOperator:T(kt),definitionOperator:T(kt),typeOperator:T(kt),controlOperator:T(kt),punctuation:za,separator:T(za),bracket:Ds,angleBracket:T(Ds),squareBracket:T(Ds),paren:T(Ds),brace:T(Ds),content:St,heading:ki,heading1:T(ki),heading2:T(ki),heading3:T(ki),heading4:T(ki),heading5:T(ki),heading6:T(ki),contentSeparator:T(St),list:T(St),quote:T(St),emphasis:T(St),strong:T(St),link:T(St),monospace:T(St),strikethrough:T(St),inserted:T(),deleted:T(),changed:T(),invalid:T(),meta:Kn,documentMeta:T(Kn),annotation:T(Kn),processingInstruction:T(Kn),definition:Nt.defineModifier("definition"),constant:Nt.defineModifier("constant"),function:Nt.defineModifier("function"),standard:Nt.defineModifier("standard"),local:Nt.defineModifier("local"),special:Nt.defineModifier("special")};for(let t in w){let e=w[t];e instanceof Nt&&(e.name=t)}ru([{tag:w.link,class:"tok-link"},{tag:w.heading,class:"tok-heading"},{tag:w.emphasis,class:"tok-emphasis"},{tag:w.strong,class:"tok-strong"},{tag:w.keyword,class:"tok-keyword"},{tag:w.atom,class:"tok-atom"},{tag:w.bool,class:"tok-bool"},{tag:w.url,class:"tok-url"},{tag:w.labelName,class:"tok-labelName"},{tag:w.inserted,class:"tok-inserted"},{tag:w.deleted,class:"tok-deleted"},{tag:w.literal,class:"tok-literal"},{tag:w.string,class:"tok-string"},{tag:w.number,class:"tok-number"},{tag:[w.regexp,w.escape,w.special(w.string)],class:"tok-string2"},{tag:w.variableName,class:"tok-variableName"},{tag:w.local(w.variableName),class:"tok-variableName tok-local"},{tag:w.definition(w.variableName),class:"tok-variableName tok-definition"},{tag:w.special(w.variableName),class:"tok-variableName2"},{tag:w.definition(w.propertyName),class:"tok-propertyName tok-definition"},{tag:w.typeName,class:"tok-typeName"},{tag:w.namespace,class:"tok-namespace"},{tag:w.className,class:"tok-className"},{tag:w.macroName,class:"tok-macroName"},{tag:w.propertyName,class:"tok-propertyName"},{tag:w.operator,class:"tok-operator"},{tag:w.comment,class:"tok-comment"},{tag:w.meta,class:"tok-meta"},{tag:w.invalid,class:"tok-invalid"},{tag:w.punctuation,class:"tok-punctuation"}]);var Fo;const es=new W;function vv(t){return D.define({combine:t?e=>e.concat(t):void 0})}const yv=new W;class ht{constructor(e,i,s=[],n=""){this.data=e,this.name=n,j.prototype.hasOwnProperty("tree")||Object.defineProperty(j.prototype,"tree",{get(){return Me(this)}}),this.parser=i,this.extension=[fi.of(this),j.languageData.of((r,o,a)=>{let l=vh(r,o,a),c=l.type.prop(es);if(!c)return[];let h=r.facet(c),d=l.type.prop(yv);if(d){let f=l.resolve(o-l.from,a);for(let u of d)if(u.test(f,r)){let p=r.facet(u.facet);return u.type=="replace"?p:p.concat(h)}}return h})].concat(s)}isActiveAt(e,i,s=-1){return vh(e,i,s).type.prop(es)==this.data}findRegions(e){let i=e.facet(fi);if((i==null?void 0:i.data)==this.data)return[{from:0,to:e.doc.length}];if(!i||!i.allowsNesting)return[];let s=[],n=(r,o)=>{if(r.prop(es)==this.data){s.push({from:o,to:o+r.length});return}let a=r.prop(W.mounted);if(a){if(a.tree.prop(es)==this.data){if(a.overlay)for(let l of a.overlay)s.push({from:l.from+o,to:l.to+o});else s.push({from:o,to:o+r.length});return}else if(a.overlay){let l=s.length;if(n(a.tree,a.overlay[0].from+o),s.length>l)return}}for(let l=0;l<r.children.length;l++){let c=r.children[l];c instanceof ue&&n(c,r.positions[l]+o)}};return n(Me(e),0),s}get allowsNesting(){return!0}}ht.setState=H.define();function vh(t,e,i){let s=t.facet(fi),n=Me(t).topNode;if(!s||s.allowsNesting)for(let r=n;r;r=r.enter(e,i,ce.ExcludeBuffers|ce.EnterBracketed))r.type.isTop&&(n=r);return n}class Tr extends ht{constructor(e,i,s){super(e,i,[],s),this.parser=i}static define(e){let i=vv(e.languageData);return new Tr(i,e.parser.configure({props:[es.add(s=>s.isTop?i:void 0)]}),e.name)}configure(e,i){return new Tr(this.data,this.parser.configure(e),i||this.name)}get allowsNesting(){return this.parser.hasWrappers()}}function Me(t){let e=t.field(ht.state,!1);return e?e.tree:ue.empty}class xv{constructor(e){this.doc=e,this.cursorPos=0,this.string="",this.cursor=e.iter()}get length(){return this.doc.length}syncTo(e){return this.string=this.cursor.next(e-this.cursorPos).value,this.cursorPos=e+this.string.length,this.cursorPos-this.string.length}chunk(e){return this.syncTo(e),this.string}get lineChunks(){return!0}read(e,i){let s=this.cursorPos-this.string.length;return e<s||i>=this.cursorPos?this.doc.sliceString(e,i):this.string.slice(e-s,i-s)}}let _s=null;class Mr{constructor(e,i,s=[],n,r,o,a,l){this.parser=e,this.state=i,this.fragments=s,this.tree=n,this.treeLen=r,this.viewport=o,this.skipped=a,this.scheduleOn=l,this.parse=null,this.tempSkipped=[]}static create(e,i,s){return new Mr(e,i,[],ue.empty,0,s,[],null)}startParse(){return this.parser.startParse(new xv(this.state.doc),this.fragments)}work(e,i){return i!=null&&i>=this.state.doc.length&&(i=void 0),this.tree!=ue.empty&&this.isDone(i??this.state.doc.length)?(this.takeTree(),!0):this.withContext(()=>{var s;if(typeof e=="number"){let n=Date.now()+e;e=()=>Date.now()>n}for(this.parse||(this.parse=this.startParse()),i!=null&&(this.parse.stoppedAt==null||this.parse.stoppedAt>i)&&i<this.state.doc.length&&this.parse.stopAt(i);;){let n=this.parse.advance();if(n)if(this.fragments=this.withoutTempSkipped(Ri.addTree(n,this.fragments,this.parse.stoppedAt!=null)),this.treeLen=(s=this.parse.stoppedAt)!==null&&s!==void 0?s:this.state.doc.length,this.tree=n,this.parse=null,this.treeLen<(i??this.state.doc.length))this.parse=this.startParse();else return!0;if(e())return!1}})}takeTree(){let e,i;this.parse&&(e=this.parse.parsedPos)>=this.treeLen&&((this.parse.stoppedAt==null||this.parse.stoppedAt>e)&&this.parse.stopAt(e),this.withContext(()=>{for(;!(i=this.parse.advance()););}),this.treeLen=e,this.tree=i,this.fragments=this.withoutTempSkipped(Ri.addTree(this.tree,this.fragments,!0)),this.parse=null)}withContext(e){let i=_s;_s=this;try{return e()}finally{_s=i}}withoutTempSkipped(e){for(let i;i=this.tempSkipped.pop();)e=yh(e,i.from,i.to);return e}changes(e,i){let{fragments:s,tree:n,treeLen:r,viewport:o,skipped:a}=this;if(this.takeTree(),!e.empty){let l=[];if(e.iterChangedRanges((c,h,d,f)=>l.push({fromA:c,toA:h,fromB:d,toB:f})),s=Ri.applyChanges(s,l),n=ue.empty,r=0,o={from:e.mapPos(o.from,-1),to:e.mapPos(o.to,1)},this.skipped.length){a=[];for(let c of this.skipped){let h=e.mapPos(c.from,1),d=e.mapPos(c.to,-1);h<d&&a.push({from:h,to:d})}}}return new Mr(this.parser,i,s,n,r,o,a,this.scheduleOn)}updateViewport(e){if(this.viewport.from==e.from&&this.viewport.to==e.to)return!1;this.viewport=e;let i=this.skipped.length;for(let s=0;s<this.skipped.length;s++){let{from:n,to:r}=this.skipped[s];n<e.to&&r>e.from&&(this.fragments=yh(this.fragments,n,r),this.skipped.splice(s--,1))}return this.skipped.length>=i?!1:(this.reset(),!0)}reset(){this.parse&&(this.takeTree(),this.parse=null)}skipUntilInView(e,i){this.skipped.push({from:e,to:i})}static getSkippingParser(e){return new class extends iu{createParse(i,s,n){let r=n[0].from,o=n[n.length-1].to;return{parsedPos:r,advance(){let l=_s;if(l){for(let c of n)l.tempSkipped.push(c);e&&(l.scheduleOn=l.scheduleOn?Promise.all([l.scheduleOn,e]):e)}return this.parsedPos=o,new ue(Ve.none,[],[],o-r)},stoppedAt:null,stopAt(){}}}}}isDone(e){e=Math.min(e,this.state.doc.length);let i=this.fragments;return this.treeLen>=e&&i.length&&i[0].from==0&&i[0].to>=e}static get(){return _s}}function yh(t,e,i){return Ri.applyChanges(t,[{fromA:e,toA:i,fromB:e,toB:i}])}class ys{constructor(e){this.context=e,this.tree=e.tree}apply(e){if(!e.docChanged&&this.tree==this.context.tree)return this;let i=this.context.changes(e.changes,e.state),s=this.context.treeLen==e.startState.doc.length?void 0:Math.max(e.changes.mapPos(this.context.treeLen),i.viewport.to);return i.work(20,s)||i.takeTree(),new ys(i)}static init(e){let i=Math.min(3e3,e.doc.length),s=Mr.create(e.facet(fi).parser,e,{from:0,to:i});return s.work(20,i)||s.takeTree(),new ys(s)}}ht.state=Ee.define({create:ys.init,update(t,e){for(let i of e.effects)if(i.is(ht.setState))return i.value;return e.startState.facet(fi)!=e.state.facet(fi)?ys.init(e.state):t.apply(e)}});let ou=t=>{let e=setTimeout(()=>t(),500);return()=>clearTimeout(e)};typeof requestIdleCallback<"u"&&(ou=t=>{let e=-1,i=setTimeout(()=>{e=requestIdleCallback(t,{timeout:400})},100);return()=>e<0?clearTimeout(i):cancelIdleCallback(e)});const No=typeof navigator<"u"&&(!((Fo=navigator.scheduling)===null||Fo===void 0)&&Fo.isInputPending)?()=>navigator.scheduling.isInputPending():null,wv=pe.fromClass(class{constructor(e){this.view=e,this.working=null,this.workScheduled=0,this.chunkEnd=-1,this.chunkBudget=-1,this.work=this.work.bind(this),this.scheduleWork()}update(e){let i=this.view.state.field(ht.state).context;(i.updateViewport(e.view.viewport)||this.view.viewport.to>i.treeLen)&&this.scheduleWork(),(e.docChanged||e.selectionSet)&&(this.view.hasFocus&&(this.chunkBudget+=50),this.scheduleWork()),this.checkAsyncSchedule(i)}scheduleWork(){if(this.working)return;let{state:e}=this.view,i=e.field(ht.state);(i.tree!=i.context.tree||!i.context.isDone(e.doc.length))&&(this.working=ou(this.work))}work(e){this.working=null;let i=Date.now();if(this.chunkEnd<i&&(this.chunkEnd<0||this.view.hasFocus)&&(this.chunkEnd=i+3e4,this.chunkBudget=3e3),this.chunkBudget<=0)return;let{state:s,viewport:{to:n}}=this.view,r=s.field(ht.state);if(r.tree==r.context.tree&&r.context.isDone(n+1e5))return;let o=Date.now()+Math.min(this.chunkBudget,100,e&&!No?Math.max(25,e.timeRemaining()-5):1e9),a=r.context.treeLen<n&&s.doc.length>n+1e3,l=r.context.work(()=>No&&No()||Date.now()>o,n+(a?0:1e5));this.chunkBudget-=Date.now()-i,(l||this.chunkBudget<=0)&&(r.context.takeTree(),this.view.dispatch({effects:ht.setState.of(new ys(r.context))})),this.chunkBudget>0&&!(l&&!a)&&this.scheduleWork(),this.checkAsyncSchedule(r.context)}checkAsyncSchedule(e){e.scheduleOn&&(this.workScheduled++,e.scheduleOn.then(()=>this.scheduleWork()).catch(i=>He(this.view.state,i)).then(()=>this.workScheduled--),e.scheduleOn=null)}destroy(){this.working&&this.working()}isWorking(){return!!(this.working||this.workScheduled>0)}},{eventHandlers:{focus(){this.scheduleWork()}}}),fi=D.define({combine(t){return t.length?t[0]:null},enables:t=>[ht.state,wv,_.contentAttributes.compute([t],e=>{let i=e.facet(t);return i&&i.name?{"data-language":i.name}:{}})]});class kv{constructor(e,i=[]){this.language=e,this.support=i,this.extension=[e,i]}}const Sv=D.define(),Dl=D.define({combine:t=>{if(!t.length)return"  ";let e=t[0];if(!e||/\S/.test(e)||Array.from(e).some(i=>i!=e[0]))throw new Error("Invalid indent unit: "+JSON.stringify(t[0]));return e}});function Er(t){let e=t.facet(Dl);return e.charCodeAt(0)==9?t.tabSize*e.length:e.length}function dn(t,e){let i="",s=t.tabSize,n=t.facet(Dl)[0];if(n=="	"){for(;e>=s;)i+="	",e-=s;n=" "}for(let r=0;r<e;r++)i+=n;return i}function _l(t,e){t instanceof j&&(t=new so(t));for(let s of t.state.facet(Sv)){let n=s(t,e);if(n!==void 0)return n}let i=Me(t.state);return i.length>=e?Cv(t,i,e):null}class so{constructor(e,i={}){this.state=e,this.options=i,this.unit=Er(e)}lineAt(e,i=1){let s=this.state.doc.lineAt(e),{simulateBreak:n,simulateDoubleBreak:r}=this.options;return n!=null&&n>=s.from&&n<=s.to?r&&n==e?{text:"",from:e}:(i<0?n<e:n<=e)?{text:s.text.slice(n-s.from),from:n}:{text:s.text.slice(0,n-s.from),from:s.from}:s}textAfterPos(e,i=1){if(this.options.simulateDoubleBreak&&e==this.options.simulateBreak)return"";let{text:s,from:n}=this.lineAt(e,i);return s.slice(e-n,Math.min(s.length,e+100-n))}column(e,i=1){let{text:s,from:n}=this.lineAt(e,i),r=this.countColumn(s,e-n),o=this.options.overrideIndentation?this.options.overrideIndentation(n):-1;return o>-1&&(r+=o-this.countColumn(s,s.search(/\S|$/))),r}countColumn(e,i=e.length){return Cs(e,this.state.tabSize,i)}lineIndent(e,i=1){let{text:s,from:n}=this.lineAt(e,i),r=this.options.overrideIndentation;if(r){let o=r(n);if(o>-1)return o}return this.countColumn(s,s.search(/\S|$/))}get simulatedBreak(){return this.options.simulateBreak||null}}const au=new W;function Cv(t,e,i){let s=e.resolveStack(i),n=e.resolveInner(i,-1).resolve(i,0).enterUnfinishedNodesBefore(i);if(n!=s.node){let r=[];for(let o=n;o&&!(o.from<s.node.from||o.to>s.node.to||o.from==s.node.from&&o.type==s.node.type);o=o.parent)r.push(o);for(let o=r.length-1;o>=0;o--)s={node:r[o],next:s}}return lu(s,t,i)}function lu(t,e,i){for(let s=t;s;s=s.next){let n=Av(s.node);if(n)return n(Bl.create(e,i,s))}return 0}function Ov(t){return t.pos==t.options.simulateBreak&&t.options.simulateDoubleBreak}function Av(t){let e=t.type.prop(au);if(e)return e;let i=t.firstChild,s;if(i&&(s=i.type.prop(W.closedBy))){let n=t.lastChild,r=n&&s.indexOf(n.name)>-1;return o=>cu(o,!0,1,void 0,r&&!Ov(o)?n.from:void 0)}return t.parent==null?$v:null}function $v(){return 0}class Bl extends so{constructor(e,i,s){super(e.state,e.options),this.base=e,this.pos=i,this.context=s}get node(){return this.context.node}static create(e,i,s){return new Bl(e,i,s)}get textAfter(){return this.textAfterPos(this.pos)}get baseIndent(){return this.baseIndentFor(this.node)}baseIndentFor(e){let i=this.state.doc.lineAt(e.from);for(;;){let s=e.resolve(i.from);for(;s.parent&&s.parent.from==s.from;)s=s.parent;if(Pv(s,e))break;i=this.state.doc.lineAt(s.from)}return this.lineIndent(i.from)}continue(){return lu(this.context.next,this.base,this.pos)}}function Pv(t,e){for(let i=e;i;i=i.parent)if(t==i)return!0;return!1}function Tv(t){let e=t.node,i=e.childAfter(e.from),s=e.lastChild;if(!i)return null;let n=t.options.simulateBreak,r=t.state.doc.lineAt(i.from),o=n==null||n<=r.from?r.to:Math.min(r.to,n);for(let a=i.to;;){let l=e.childAfter(a);if(!l||l==s)return null;if(!l.type.isSkipped){if(l.from>=o)return null;let c=/^ */.exec(r.text.slice(i.to-r.from))[0].length;return{from:i.from,to:i.to+c}}a=l.to}}function xh({closing:t,align:e=!0,units:i=1}){return s=>cu(s,e,i,t)}function cu(t,e,i,s,n){let r=t.textAfter,o=r.match(/^\s*/)[0].length,a=s&&r.slice(o,o+s.length)==s||n==t.pos+o,l=e?Tv(t):null;return l?a?t.column(l.from):t.column(l.to):t.baseIndent+(a?0:t.unit*i)}const Mv=200;function Ev(){return j.transactionFilter.of(t=>{if(!t.docChanged||!t.isUserEvent("input.type")&&!t.isUserEvent("input.complete"))return t;let e=t.startState.languageDataAt("indentOnInput",t.startState.selection.main.head);if(!e.length)return t;let i=t.newDoc,{head:s}=t.newSelection.main,n=i.lineAt(s);if(s>n.from+Mv)return t;let r=i.sliceString(n.from,s);if(!e.some(c=>c.test(r)))return t;let{state:o}=t,a=-1,l=[];for(let{head:c}of o.selection.ranges){let h=o.doc.lineAt(c);if(h.from==a)continue;a=h.from;let d=_l(o,h.from);if(d==null)continue;let f=/^\s*/.exec(h.text)[0],u=dn(o,d);f!=u&&l.push({from:h.from,to:h.from+f.length,insert:u})}return l.length?[t,{changes:l,sequential:!0}]:t})}const Dv=D.define(),hu=new W;function _v(t){let e=t.firstChild,i=t.lastChild;return e&&e.to<i.from?{from:e.to,to:i.type.isError?t.to:i.from}:null}function Bv(t,e,i){let s=Me(t);if(s.length<i)return null;let n=s.resolveStack(i,1),r=null;for(let o=n;o;o=o.next){let a=o.node;if(a.to<=i||a.from>i)continue;if(r&&a.from<e)break;let l=a.type.prop(hu);if(l&&(a.to<s.length-50||s.length==t.doc.length||!Rv(a))){let c=l(a,t);c&&c.from<=i&&c.from>=e&&c.to>i&&(r=c)}}return r}function Rv(t){let e=t.lastChild;return e&&e.to==t.to&&e.type.isError}function Dr(t,e,i){for(let s of t.facet(Dv)){let n=s(t,e,i);if(n)return n}return Bv(t,e,i)}function du(t,e){let i=e.mapPos(t.from,1),s=e.mapPos(t.to,-1);return i>=s?void 0:{from:i,to:s}}const no=H.define({map:du}),On=H.define({map:du});function fu(t){let e=[];for(let{head:i}of t.state.selection.ranges)e.some(s=>s.from<=i&&s.to>=i)||e.push(t.lineBlockAt(i));return e}const Ui=Ee.define({create(){return N.none},update(t,e){e.isUserEvent("delete")&&e.changes.iterChangedRanges((i,s)=>t=wh(t,i,s)),t=t.map(e.changes);for(let i of e.effects)if(i.is(no)&&!Lv(t,i.value.from,i.value.to)){let{preparePlaceholder:s}=e.state.facet(gu),n=s?N.replace({widget:new Uv(s(e.state,i.value))}):kh;t=t.update({add:[n.range(i.value.from,i.value.to)]})}else i.is(On)&&(t=t.update({filter:(s,n)=>i.value.from!=s||i.value.to!=n,filterFrom:i.value.from,filterTo:i.value.to}));return e.selection&&(t=wh(t,e.selection.main.head)),t},provide:t=>_.decorations.from(t),toJSON(t,e){let i=[];return t.between(0,e.doc.length,(s,n)=>{i.push(s,n)}),i},fromJSON(t){if(!Array.isArray(t)||t.length%2)throw new RangeError("Invalid JSON for fold state");let e=[];for(let i=0;i<t.length;){let s=t[i++],n=t[i++];if(typeof s!="number"||typeof n!="number")throw new RangeError("Invalid JSON for fold state");e.push(kh.range(s,n))}return N.set(e,!0)}});function wh(t,e,i=e){let s=!1;return t.between(e,i,(n,r)=>{n<i&&r>e&&(s=!0)}),s?t.update({filterFrom:e,filterTo:i,filter:(n,r)=>n>=i||r<=e}):t}function _r(t,e,i){var s;let n=null;return(s=t.field(Ui,!1))===null||s===void 0||s.between(e,i,(r,o)=>{(!n||n.from>r)&&(n={from:r,to:o})}),n}function Lv(t,e,i){let s=!1;return t.between(e,e,(n,r)=>{n==e&&r==i&&(s=!0)}),s}function uu(t,e){return t.field(Ui,!1)?e:e.concat(H.appendConfig.of(mu()))}const Iv=t=>{for(let e of fu(t)){let i=Dr(t.state,e.from,e.to);if(i)return t.dispatch({effects:uu(t.state,[no.of(i),pu(t,i)])}),!0}return!1},Fv=t=>{if(!t.state.field(Ui,!1))return!1;let e=[];for(let i of fu(t)){let s=_r(t.state,i.from,i.to);s&&e.push(On.of(s),pu(t,s,!1))}return e.length&&t.dispatch({effects:e}),e.length>0};function pu(t,e,i=!0){let s=t.state.doc.lineAt(e.from).number,n=t.state.doc.lineAt(e.to).number;return _.announce.of(`${t.state.phrase(i?"Folded lines":"Unfolded lines")} ${s} ${t.state.phrase("to")} ${n}.`)}const Nv=t=>{let{state:e}=t,i=[];for(let s=0;s<e.doc.length;){let n=t.lineBlockAt(s),r=Dr(e,n.from,n.to);r&&i.push(no.of(r)),s=(r?t.lineBlockAt(r.to):n).to+1}return i.length&&t.dispatch({effects:uu(t.state,i)}),!!i.length},zv=t=>{let e=t.state.field(Ui,!1);if(!e||!e.size)return!1;let i=[];return e.between(0,t.state.doc.length,(s,n)=>{i.push(On.of({from:s,to:n}))}),t.dispatch({effects:i}),!0},Hv=[{key:"Ctrl-Shift-[",mac:"Cmd-Alt-[",run:Iv},{key:"Ctrl-Shift-]",mac:"Cmd-Alt-]",run:Fv},{key:"Ctrl-Alt-[",run:Nv},{key:"Ctrl-Alt-]",run:zv}],Wv={placeholderDOM:null,preparePlaceholder:null,placeholderText:"…"},gu=D.define({combine(t){return Rt(t,Wv)}});function mu(t){return[Ui,Qv]}function bu(t,e){let{state:i}=t,s=i.facet(gu),n=o=>{let a=t.lineBlockAt(t.posAtDOM(o.target)),l=_r(t.state,a.from,a.to);l&&t.dispatch({effects:On.of(l)}),o.preventDefault()};if(s.placeholderDOM)return s.placeholderDOM(t,n,e);let r=document.createElement("span");return r.textContent=s.placeholderText,r.setAttribute("aria-label",i.phrase("folded code")),r.title=i.phrase("unfold"),r.className="cm-foldPlaceholder",r.onclick=n,r}const kh=N.replace({widget:new class extends Jt{toDOM(t){return bu(t,null)}}});class Uv extends Jt{constructor(e){super(),this.value=e}eq(e){return this.value==e.value}toDOM(e){return bu(e,this.value)}}const qv={openText:"⌄",closedText:"›",markerDOM:null,domEventHandlers:{},foldingChanged:()=>!1};class zo extends Qt{constructor(e,i){super(),this.config=e,this.open=i}eq(e){return this.config==e.config&&this.open==e.open}toDOM(e){if(this.config.markerDOM)return this.config.markerDOM(this.open);let i=document.createElement("span");return i.textContent=this.open?this.config.openText:this.config.closedText,i.title=e.state.phrase(this.open?"Fold line":"Unfold line"),i}}function Vv(t={}){let e={...qv,...t},i=new zo(e,!0),s=new zo(e,!1),n=pe.fromClass(class{constructor(o){this.from=o.viewport.from,this.markers=this.buildMarkers(o)}update(o){(o.docChanged||o.viewportChanged||o.startState.facet(fi)!=o.state.facet(fi)||o.startState.field(Ui,!1)!=o.state.field(Ui,!1)||Me(o.startState)!=Me(o.state)||e.foldingChanged(o))&&(this.markers=this.buildMarkers(o.view))}buildMarkers(o){let a=new qt;for(let l of o.viewportLineBlocks){let c=_r(o.state,l.from,l.to)?s:Dr(o.state,l.from,l.to)?i:null;c&&a.add(l.from,l.from,c)}return a.finish()}}),{domEventHandlers:r}=e;return[n,Q0({class:"cm-foldGutter",markers(o){var a;return((a=o.plugin(n))===null||a===void 0?void 0:a.markers)||q.empty},initialSpacer(){return new zo(e,!1)},domEventHandlers:{...r,click:(o,a,l)=>{if(r.click&&r.click(o,a,l))return!0;let c=_r(o.state,a.from,a.to);if(c)return o.dispatch({effects:On.of(c)}),!0;let h=Dr(o.state,a.from,a.to);return h?(o.dispatch({effects:no.of(h)}),!0):!1}}}),mu()]}const Qv=_.baseTheme({".cm-foldPlaceholder":{backgroundColor:"#eee",border:"1px solid #ddd",color:"#888",borderRadius:".2em",margin:"0 1px",padding:"0 1px",cursor:"pointer"},".cm-foldGutter span":{padding:"0 1px",cursor:"pointer"}});class An{constructor(e,i){this.specs=e;let s;function n(a){let l=li.newName();return(s||(s=Object.create(null)))["."+l]=a,l}const r=typeof i.all=="string"?i.all:i.all?n(i.all):void 0,o=i.scope;this.scope=o instanceof ht?a=>a.prop(es)==o.data:o?a=>a==o:void 0,this.style=ru(e.map(a=>({tag:a.tag,class:a.class||n(Object.assign({},a,{tag:null}))})),{all:r}).style,this.module=s?new li(s):null,this.themeType=i.themeType}static define(e,i){return new An(e,i||{})}}const Ha=D.define(),vu=D.define({combine(t){return t.length?[t[0]]:null}});function Ho(t){let e=t.facet(Ha);return e.length?e:t.facet(vu)}function yu(t,e){let i=[Kv],s;return t instanceof An&&(t.module&&i.push(_.styleModule.of(t.module)),s=t.themeType),e!=null&&e.fallback?i.push(vu.of(t)):s?i.push(Ha.computeN([_.darkTheme],n=>n.facet(_.darkTheme)==(s=="dark")?[t]:[])):i.push(Ha.of(t)),i}class jv{constructor(e){this.markCache=Object.create(null),this.tree=Me(e.state),this.decorations=this.buildDeco(e,Ho(e.state)),this.decoratedTo=e.viewport.to}update(e){let i=Me(e.state),s=Ho(e.state),n=s!=Ho(e.startState),{viewport:r}=e.view,o=e.changes.mapPos(this.decoratedTo,1);i.length<r.to&&!n&&i.type==this.tree.type&&o>=r.to?(this.decorations=this.decorations.map(e.changes),this.decoratedTo=o):(i!=this.tree||e.viewportChanged||n)&&(this.tree=i,this.decorations=this.buildDeco(e.view,s),this.decoratedTo=r.to)}buildDeco(e,i){if(!i||!this.tree.length)return N.none;let s=new qt;for(let{from:n,to:r}of e.visibleRanges)gv(this.tree,i,(o,a,l)=>{s.add(o,a,this.markCache[l]||(this.markCache[l]=N.mark({class:l})))},n,r);return s.finish()}}const Kv=qi.high(pe.fromClass(jv,{decorations:t=>t.decorations})),Xv=An.define([{tag:w.meta,color:"#404740"},{tag:w.link,textDecoration:"underline"},{tag:w.heading,textDecoration:"underline",fontWeight:"bold"},{tag:w.emphasis,fontStyle:"italic"},{tag:w.strong,fontWeight:"bold"},{tag:w.strikethrough,textDecoration:"line-through"},{tag:w.keyword,color:"#708"},{tag:[w.atom,w.bool,w.url,w.contentSeparator,w.labelName],color:"#219"},{tag:[w.literal,w.inserted],color:"#164"},{tag:[w.string,w.deleted],color:"#a11"},{tag:[w.regexp,w.escape,w.special(w.string)],color:"#e40"},{tag:w.definition(w.variableName),color:"#00f"},{tag:w.local(w.variableName),color:"#30a"},{tag:[w.typeName,w.namespace],color:"#085"},{tag:w.className,color:"#167"},{tag:[w.special(w.variableName),w.macroName],color:"#256"},{tag:w.definition(w.propertyName),color:"#00c"},{tag:w.comment,color:"#940"},{tag:w.invalid,color:"#f00"}]),Jv=_.baseTheme({"&.cm-focused .cm-matchingBracket":{backgroundColor:"#328c8252"},"&.cm-focused .cm-nonmatchingBracket":{backgroundColor:"#bb555544"}}),xu=1e4,wu="()[]{}",ku=D.define({combine(t){return Rt(t,{afterCursor:!0,brackets:wu,maxScanDistance:xu,renderMatch:Zv})}}),Yv=N.mark({class:"cm-matchingBracket"}),Gv=N.mark({class:"cm-nonmatchingBracket"});function Zv(t){let e=[],i=t.matched?Yv:Gv;return e.push(i.range(t.start.from,t.start.to)),t.end&&e.push(i.range(t.end.from,t.end.to)),e}function Sh(t){let e=[],i=t.facet(ku);for(let s of t.selection.ranges){if(!s.empty)continue;let n=Pt(t,s.head,-1,i)||s.head>0&&Pt(t,s.head-1,1,i)||i.afterCursor&&(Pt(t,s.head,1,i)||s.head<t.doc.length&&Pt(t,s.head+1,-1,i));n&&(e=e.concat(i.renderMatch(n,t)))}return N.set(e,!0)}const ey=pe.fromClass(class{constructor(t){this.paused=!1,this.decorations=Sh(t.state)}update(t){(t.docChanged||t.selectionSet||this.paused)&&(t.view.composing?(this.decorations=this.decorations.map(t.changes),this.paused=!0):(this.decorations=Sh(t.state),this.paused=!1))}},{decorations:t=>t.decorations}),ty=[ey,Jv];function iy(t={}){return[ku.of(t),ty]}const sy=new W;function Wa(t,e,i){let s=t.prop(e<0?W.openedBy:W.closedBy);if(s)return s;if(t.name.length==1){let n=i.indexOf(t.name);if(n>-1&&n%2==(e<0?1:0))return[i[n+e]]}return null}function Ua(t){let e=t.type.prop(sy);return e?e(t.node):t}function Pt(t,e,i,s={}){let n=s.maxScanDistance||xu,r=s.brackets||wu,o=Me(t),a=o.resolveInner(e,i);for(let l=a;l;l=l.parent){let c=Wa(l.type,i,r);if(c&&l.from<l.to){let h=Ua(l);if(h&&(i>0?e>=h.from&&e<h.to:e>h.from&&e<=h.to))return ny(t,e,i,l,h,c,r)}}return ry(t,e,i,o,a.type,n,r)}function ny(t,e,i,s,n,r,o){let a=s.parent,l={from:n.from,to:n.to},c=0,h=a==null?void 0:a.cursor();if(h&&(i<0?h.childBefore(s.from):h.childAfter(s.to)))do if(i<0?h.to<=s.from:h.from>=s.to){if(c==0&&r.indexOf(h.type.name)>-1&&h.from<h.to){let d=Ua(h);return{start:l,end:d?{from:d.from,to:d.to}:void 0,matched:!0}}else if(Wa(h.type,i,o))c++;else if(Wa(h.type,-i,o)){if(c==0){let d=Ua(h);return{start:l,end:d&&d.from<d.to?{from:d.from,to:d.to}:void 0,matched:!1}}c--}}while(i<0?h.prevSibling():h.nextSibling());return{start:l,matched:!1}}function ry(t,e,i,s,n,r,o){if(i<0?!e:e==t.doc.length)return null;let a=i<0?t.sliceDoc(e-1,e):t.sliceDoc(e,e+1),l=o.indexOf(a);if(l<0||l%2==0!=i>0)return null;let c={from:i<0?e-1:e,to:i>0?e+1:e},h=t.doc.iterRange(e,i>0?t.doc.length:0),d=0;for(let f=0;!h.next().done&&f<=r;){let u=h.value;i<0&&(f+=u.length);let p=e+f*i;for(let m=i>0?0:u.length-1,b=i>0?u.length:-1;m!=b;m+=i){let x=o.indexOf(u[m]);if(!(x<0||s.resolveInner(p+m,1).type!=n))if(x%2==0==i>0)d++;else{if(d==1)return{start:c,end:{from:p+m,to:p+m+1},matched:x>>1==l>>1};d--}}i>0&&(f+=u.length)}return h.done?{start:c,matched:!1}:null}const oy=Object.create(null),Ch=[Ve.none],Oh=[],Ah=Object.create(null),ay=Object.create(null);for(let[t,e]of[["variable","variableName"],["variable-2","variableName.special"],["string-2","string.special"],["def","variableName.definition"],["tag","tagName"],["attribute","attributeName"],["type","typeName"],["builtin","variableName.standard"],["qualifier","modifier"],["error","invalid"],["header","heading"],["property","propertyName"]])ay[t]=ly(oy,e);function Wo(t,e){Oh.indexOf(t)>-1||(Oh.push(t),console.warn(e))}function ly(t,e){let i=[];for(let a of e.split(" ")){let l=[];for(let c of a.split(".")){let h=t[c]||w[c];h?typeof h=="function"?l.length?l=l.map(h):Wo(c,`Modifier ${c} used at start of tag`):l.length?Wo(c,`Tag ${c} used as modifier`):l=Array.isArray(h)?h:[h]:Wo(c,`Unknown highlighting tag ${c}`)}for(let c of l)i.push(c)}if(!i.length)return 0;let s=e.replace(/ /g,"_"),n=s+" "+i.map(a=>a.id),r=Ah[n];if(r)return r.id;let o=Ah[n]=Ve.define({id:Ch.length,name:s,props:[su({[s]:i})]});return Ch.push(o),o.id}ee.RTL,ee.LTR;const cy=t=>{let{state:e}=t,i=e.doc.lineAt(e.selection.main.from),s=Ll(t.state,i.from);return s.line?hy(t):s.block?fy(t):!1};function Rl(t,e){return({state:i,dispatch:s})=>{if(i.readOnly)return!1;let n=t(e,i);return n?(s(i.update(n)),!0):!1}}const hy=Rl(gy,0),dy=Rl(Su,0),fy=Rl((t,e)=>Su(t,e,py(e)),0);function Ll(t,e){let i=t.languageDataAt("commentTokens",e,1);return i.length?i[0]:{}}const Bs=50;function uy(t,{open:e,close:i},s,n){let r=t.sliceDoc(s-Bs,s),o=t.sliceDoc(n,n+Bs),a=/\s*$/.exec(r)[0].length,l=/^\s*/.exec(o)[0].length,c=r.length-a;if(r.slice(c-e.length,c)==e&&o.slice(l,l+i.length)==i)return{open:{pos:s-a,margin:a&&1},close:{pos:n+l,margin:l&&1}};let h,d;n-s<=2*Bs?h=d=t.sliceDoc(s,n):(h=t.sliceDoc(s,s+Bs),d=t.sliceDoc(n-Bs,n));let f=/^\s*/.exec(h)[0].length,u=/\s*$/.exec(d)[0].length,p=d.length-u-i.length;return h.slice(f,f+e.length)==e&&d.slice(p,p+i.length)==i?{open:{pos:s+f+e.length,margin:/\s/.test(h.charAt(f+e.length))?1:0},close:{pos:n-u-i.length,margin:/\s/.test(d.charAt(p-1))?1:0}}:null}function py(t){let e=[];for(let i of t.selection.ranges){let s=t.doc.lineAt(i.from),n=i.to<=s.to?s:t.doc.lineAt(i.to);n.from>s.from&&n.from==i.to&&(n=i.to==s.to+1?s:t.doc.lineAt(i.to-1));let r=e.length-1;r>=0&&e[r].to>s.from?e[r].to=n.to:e.push({from:s.from+/^\s*/.exec(s.text)[0].length,to:n.to})}return e}function Su(t,e,i=e.selection.ranges){let s=i.map(r=>Ll(e,r.from).block);if(!s.every(r=>r))return null;let n=i.map((r,o)=>uy(e,s[o],r.from,r.to));if(t!=2&&!n.every(r=>r))return{changes:e.changes(i.map((r,o)=>n[o]?[]:[{from:r.from,insert:s[o].open+" "},{from:r.to,insert:" "+s[o].close}]))};if(t!=1&&n.some(r=>r)){let r=[];for(let o=0,a;o<n.length;o++)if(a=n[o]){let l=s[o],{open:c,close:h}=a;r.push({from:c.pos-l.open.length,to:c.pos+c.margin},{from:h.pos-h.margin,to:h.pos+l.close.length})}return{changes:r}}return null}function gy(t,e,i=e.selection.ranges){let s=[],n=-1;e:for(let{from:r,to:o}of i){let a=s.length,l=1e9,c;for(let h=r;h<=o;){let d=e.doc.lineAt(h);if(c==null&&(c=Ll(e,d.from).line,!c))continue e;if(d.from>n&&(r==o||o>d.from)){n=d.from;let f=/^\s*/.exec(d.text)[0].length,u=f==d.length,p=d.text.slice(f,f+c.length)==c?f:-1;f<d.text.length&&f<l&&(l=f),s.push({line:d,comment:p,token:c,indent:f,empty:u,single:!1})}h=d.to+1}if(l<1e9)for(let h=a;h<s.length;h++)s[h].indent<s[h].line.text.length&&(s[h].indent=l);s.length==a+1&&(s[a].single=!0)}if(t!=2&&s.some(r=>r.comment<0&&(!r.empty||r.single))){let r=[];for(let{line:a,token:l,indent:c,empty:h,single:d}of s)(d||!h)&&r.push({from:a.from+c,insert:l+" "});let o=e.changes(r);return{changes:o,selection:e.selection.map(o,1)}}else if(t!=1&&s.some(r=>r.comment>=0)){let r=[];for(let{line:o,comment:a,token:l}of s)if(a>=0){let c=o.from+a,h=c+l.length;o.text[h-o.from]==" "&&h++,r.push({from:c,to:h})}return{changes:r}}return null}const qa=Xt.define(),my=Xt.define(),by=D.define(),Cu=D.define({combine(t){return Rt(t,{minDepth:100,newGroupDelay:500,joinToEvent:(e,i)=>i},{minDepth:Math.max,newGroupDelay:Math.min,joinToEvent:(e,i)=>(s,n)=>e(s,n)||i(s,n)})}}),Ou=Ee.define({create(){return Tt.empty},update(t,e){let i=e.state.facet(Cu),s=e.annotation(qa);if(s){let l=We.fromTransaction(e,s.selection),c=s.side,h=c==0?t.undone:t.done;return l?h=Br(h,h.length,i.minDepth,l):h=Pu(h,e.startState.selection),new Tt(c==0?s.rest:h,c==0?h:s.rest)}let n=e.annotation(my);if((n=="full"||n=="before")&&(t=t.isolate()),e.annotation(be.addToHistory)===!1)return e.changes.empty?t:t.addMapping(e.changes.desc);let r=We.fromTransaction(e),o=e.annotation(be.time),a=e.annotation(be.userEvent);return r?t=t.addChanges(r,o,a,i,e):e.selection&&(t=t.addSelection(e.startState.selection,o,a,i.newGroupDelay)),(n=="full"||n=="after")&&(t=t.isolate()),t},toJSON(t){return{done:t.done.map(e=>e.toJSON()),undone:t.undone.map(e=>e.toJSON())}},fromJSON(t){return new Tt(t.done.map(We.fromJSON),t.undone.map(We.fromJSON))}});function vy(t={}){return[Ou,Cu.of(t),_.domEventHandlers({beforeinput(e,i){let s=e.inputType=="historyUndo"?Au:e.inputType=="historyRedo"?Va:null;return s?(e.preventDefault(),s(i)):!1}})]}function ro(t,e){return function({state:i,dispatch:s}){if(!e&&i.readOnly)return!1;let n=i.field(Ou,!1);if(!n)return!1;let r=n.pop(t,i,e);return r?(s(r),!0):!1}}const Au=ro(0,!1),Va=ro(1,!1),yy=ro(0,!0),xy=ro(1,!0);class We{constructor(e,i,s,n,r){this.changes=e,this.effects=i,this.mapped=s,this.startSelection=n,this.selectionsAfter=r}setSelAfter(e){return new We(this.changes,this.effects,this.mapped,this.startSelection,e)}toJSON(){var e,i,s;return{changes:(e=this.changes)===null||e===void 0?void 0:e.toJSON(),mapped:(i=this.mapped)===null||i===void 0?void 0:i.toJSON(),startSelection:(s=this.startSelection)===null||s===void 0?void 0:s.toJSON(),selectionsAfter:this.selectionsAfter.map(n=>n.toJSON())}}static fromJSON(e){return new We(e.changes&&me.fromJSON(e.changes),[],e.mapped&&Mt.fromJSON(e.mapped),e.startSelection&&S.fromJSON(e.startSelection),e.selectionsAfter.map(S.fromJSON))}static fromTransaction(e,i){let s=it;for(let n of e.startState.facet(by)){let r=n(e);r.length&&(s=s.concat(r))}return!s.length&&e.changes.empty?null:new We(e.changes.invert(e.startState.doc),s,void 0,i||e.startState.selection,it)}static selection(e){return new We(void 0,it,void 0,void 0,e)}}function Br(t,e,i,s){let n=e+1>i+20?e-i-1:0,r=t.slice(n,e);return r.push(s),r}function wy(t,e){let i=[],s=!1;return t.iterChangedRanges((n,r)=>i.push(n,r)),e.iterChangedRanges((n,r,o,a)=>{for(let l=0;l<i.length;){let c=i[l++],h=i[l++];a>=c&&o<=h&&(s=!0)}}),s}function ky(t,e){return t.ranges.length==e.ranges.length&&t.ranges.filter((i,s)=>i.empty!=e.ranges[s].empty).length===0}function $u(t,e){return t.length?e.length?t.concat(e):t:e}const it=[],Sy=200;function Pu(t,e){if(t.length){let i=t[t.length-1],s=i.selectionsAfter.slice(Math.max(0,i.selectionsAfter.length-Sy));return s.length&&s[s.length-1].eq(e)?t:(s.push(e),Br(t,t.length-1,1e9,i.setSelAfter(s)))}else return[We.selection([e])]}function Cy(t){let e=t[t.length-1],i=t.slice();return i[t.length-1]=e.setSelAfter(e.selectionsAfter.slice(0,e.selectionsAfter.length-1)),i}function Uo(t,e){if(!t.length)return t;let i=t.length,s=it;for(;i;){let n=Oy(t[i-1],e,s);if(n.changes&&!n.changes.empty||n.effects.length){let r=t.slice(0,i);return r[i-1]=n,r}else e=n.mapped,i--,s=n.selectionsAfter}return s.length?[We.selection(s)]:it}function Oy(t,e,i){let s=$u(t.selectionsAfter.length?t.selectionsAfter.map(a=>a.map(e)):it,i);if(!t.changes)return We.selection(s);let n=t.changes.map(e),r=e.mapDesc(t.changes,!0),o=t.mapped?t.mapped.composeDesc(r):r;return new We(n,H.mapEffects(t.effects,e),o,t.startSelection.map(r),s)}const Ay=/^(input\.type|delete)($|\.)/;class Tt{constructor(e,i,s=0,n=void 0){this.done=e,this.undone=i,this.prevTime=s,this.prevUserEvent=n}isolate(){return this.prevTime?new Tt(this.done,this.undone):this}addChanges(e,i,s,n,r){let o=this.done,a=o[o.length-1];return a&&a.changes&&!a.changes.empty&&e.changes&&(!s||Ay.test(s))&&(!a.selectionsAfter.length&&i-this.prevTime<n.newGroupDelay&&n.joinToEvent(r,wy(a.changes,e.changes))||s=="input.type.compose")?o=Br(o,o.length-1,n.minDepth,new We(e.changes.compose(a.changes),$u(H.mapEffects(e.effects,a.changes),a.effects),a.mapped,a.startSelection,it)):o=Br(o,o.length,n.minDepth,e),new Tt(o,it,i,s)}addSelection(e,i,s,n){let r=this.done.length?this.done[this.done.length-1].selectionsAfter:it;return r.length>0&&i-this.prevTime<n&&s==this.prevUserEvent&&s&&/^select($|\.)/.test(s)&&ky(r[r.length-1],e)?this:new Tt(Pu(this.done,e),this.undone,i,s)}addMapping(e){return new Tt(Uo(this.done,e),Uo(this.undone,e),this.prevTime,this.prevUserEvent)}pop(e,i,s){let n=e==0?this.done:this.undone;if(n.length==0)return null;let r=n[n.length-1],o=r.selectionsAfter[0]||(r.startSelection?r.startSelection.map(r.changes.invertedDesc,1):i.selection);if(s&&r.selectionsAfter.length)return i.update({selection:r.selectionsAfter[r.selectionsAfter.length-1],annotations:qa.of({side:e,rest:Cy(n),selection:o}),userEvent:e==0?"select.undo":"select.redo",scrollIntoView:!0});if(r.changes){let a=n.length==1?it:n.slice(0,n.length-1);return r.mapped&&(a=Uo(a,r.mapped)),i.update({changes:r.changes,selection:r.startSelection,effects:r.effects,annotations:qa.of({side:e,rest:a,selection:o}),filter:!1,userEvent:e==0?"undo":"redo",scrollIntoView:!0})}else return null}}Tt.empty=new Tt(it,it);const $y=[{key:"Mod-z",run:Au,preventDefault:!0},{key:"Mod-y",mac:"Mod-Shift-z",run:Va,preventDefault:!0},{linux:"Ctrl-Shift-z",run:Va,preventDefault:!0},{key:"Mod-u",run:yy,preventDefault:!0},{key:"Alt-u",mac:"Mod-Shift-u",run:xy,preventDefault:!0}];function Os(t,e){return S.create(t.ranges.map(e),t.mainIndex)}function mt(t,e){return t.update({selection:e,scrollIntoView:!0,userEvent:"select"})}function bt({state:t,dispatch:e},i){let s=Os(t.selection,i);return s.eq(t.selection,!0)?!1:(e(mt(t,s)),!0)}function oo(t,e){return S.cursor(e?t.to:t.from)}function Tu(t,e){return bt(t,i=>i.empty?t.moveByChar(i,e):oo(i,e))}function De(t){return t.textDirectionAt(t.state.selection.main.head)==ee.LTR}const Mu=t=>Tu(t,!De(t)),Eu=t=>Tu(t,De(t));function Du(t,e){return bt(t,i=>i.empty?t.moveByGroup(i,e):oo(i,e))}const Py=t=>Du(t,!De(t)),Ty=t=>Du(t,De(t));function My(t,e,i){if(e.type.prop(i))return!0;let s=e.to-e.from;return s&&(s>2||/[^\s,.;:]/.test(t.sliceDoc(e.from,e.to)))||e.firstChild}function ao(t,e,i){let s=Me(t).resolveInner(e.head),n=i?W.closedBy:W.openedBy;for(let l=e.head;;){let c=i?s.childAfter(l):s.childBefore(l);if(!c)break;My(t,c,n)?s=c:l=i?c.to:c.from}let r=s.type.prop(n),o,a;return r&&(o=i?Pt(t,s.from,1):Pt(t,s.to,-1))&&o.matched?a=i?o.end.to:o.end.from:a=i?s.to:s.from,S.cursor(a,i?-1:1)}const Ey=t=>bt(t,e=>ao(t.state,e,!De(t))),Dy=t=>bt(t,e=>ao(t.state,e,De(t)));function _u(t,e){return bt(t,i=>{if(!i.empty)return oo(i,e);let s=t.moveVertically(i,e);return s.head!=i.head?s:t.moveToLineBoundary(i,e)})}const Bu=t=>_u(t,!1),Ru=t=>_u(t,!0);function Lu(t){let e=t.scrollDOM.clientHeight<t.scrollDOM.scrollHeight-2,i=0,s=0,n;if(e){for(let r of t.state.facet(_.scrollMargins)){let o=r(t);o!=null&&o.top&&(i=Math.max(o==null?void 0:o.top,i)),o!=null&&o.bottom&&(s=Math.max(o==null?void 0:o.bottom,s))}n=t.scrollDOM.clientHeight-i-s}else n=(t.dom.ownerDocument.defaultView||window).innerHeight;return{marginTop:i,marginBottom:s,selfScroll:e,height:Math.max(t.defaultLineHeight,n-5)}}function Iu(t,e){let i=Lu(t),{state:s}=t,n=Os(s.selection,o=>o.empty?t.moveVertically(o,e,i.height):oo(o,e));if(n.eq(s.selection))return!1;let r;if(i.selfScroll){let o=t.coordsAtPos(s.selection.main.head),a=t.scrollDOM.getBoundingClientRect(),l=a.top+i.marginTop,c=a.bottom-i.marginBottom;o&&o.top>l&&o.bottom<c&&(r=_.scrollIntoView(n.main.head,{y:"start",yMargin:o.top-l}))}return t.dispatch(mt(s,n),{effects:r}),!0}const $h=t=>Iu(t,!1),Qa=t=>Iu(t,!0);function vi(t,e,i){let s=t.lineBlockAt(e.head),n=t.moveToLineBoundary(e,i);if(n.head==e.head&&n.head!=(i?s.to:s.from)&&(n=t.moveToLineBoundary(e,i,!1)),!i&&n.head==s.from&&s.length){let r=/^\s*/.exec(t.state.sliceDoc(s.from,Math.min(s.from+100,s.to)))[0].length;r&&e.head!=s.from+r&&(n=S.cursor(s.from+r))}return n}const _y=t=>bt(t,e=>vi(t,e,!0)),By=t=>bt(t,e=>vi(t,e,!1)),Ry=t=>bt(t,e=>vi(t,e,!De(t))),Ly=t=>bt(t,e=>vi(t,e,De(t))),Iy=t=>bt(t,e=>S.cursor(t.lineBlockAt(e.head).from,1)),Fy=t=>bt(t,e=>S.cursor(t.lineBlockAt(e.head).to,-1));function Ny(t,e,i){let s=!1,n=Os(t.selection,r=>{let o=Pt(t,r.head,-1)||Pt(t,r.head,1)||r.head>0&&Pt(t,r.head-1,1)||r.head<t.doc.length&&Pt(t,r.head+1,-1);if(!o||!o.end)return r;s=!0;let a=o.start.from==r.head?o.end.to:o.end.from;return S.cursor(a)});return s?(e(mt(t,n)),!0):!1}const zy=({state:t,dispatch:e})=>Ny(t,e);function at(t,e){let i=Os(t.state.selection,s=>{let n=e(s);return S.range(s.anchor,n.head,n.goalColumn,n.bidiLevel||void 0,n.assoc)});return i.eq(t.state.selection)?!1:(t.dispatch(mt(t.state,i)),!0)}function Fu(t,e){return at(t,i=>t.moveByChar(i,e))}const Nu=t=>Fu(t,!De(t)),zu=t=>Fu(t,De(t));function Hu(t,e){return at(t,i=>t.moveByGroup(i,e))}const Hy=t=>Hu(t,!De(t)),Wy=t=>Hu(t,De(t)),Uy=t=>at(t,e=>ao(t.state,e,!De(t))),qy=t=>at(t,e=>ao(t.state,e,De(t)));function Wu(t,e){return at(t,i=>t.moveVertically(i,e))}const Uu=t=>Wu(t,!1),qu=t=>Wu(t,!0);function Vu(t,e){return at(t,i=>t.moveVertically(i,e,Lu(t).height))}const Ph=t=>Vu(t,!1),Th=t=>Vu(t,!0),Vy=t=>at(t,e=>vi(t,e,!0)),Qy=t=>at(t,e=>vi(t,e,!1)),jy=t=>at(t,e=>vi(t,e,!De(t))),Ky=t=>at(t,e=>vi(t,e,De(t))),Xy=t=>at(t,e=>S.cursor(t.lineBlockAt(e.head).from)),Jy=t=>at(t,e=>S.cursor(t.lineBlockAt(e.head).to)),Mh=({state:t,dispatch:e})=>(e(mt(t,{anchor:0})),!0),Eh=({state:t,dispatch:e})=>(e(mt(t,{anchor:t.doc.length})),!0),Dh=({state:t,dispatch:e})=>(e(mt(t,{anchor:t.selection.main.anchor,head:0})),!0),_h=({state:t,dispatch:e})=>(e(mt(t,{anchor:t.selection.main.anchor,head:t.doc.length})),!0),Yy=({state:t,dispatch:e})=>(e(t.update({selection:{anchor:0,head:t.doc.length},userEvent:"select"})),!0),Gy=({state:t,dispatch:e})=>{let i=lo(t).map(({from:s,to:n})=>S.range(s,Math.min(n+1,t.doc.length)));return e(t.update({selection:S.create(i),userEvent:"select"})),!0},Zy=({state:t,dispatch:e})=>{let i=Os(t.selection,s=>{let n=Me(t),r=n.resolveStack(s.from,1);if(s.empty){let o=n.resolveStack(s.from,-1);o.node.from>=r.node.from&&o.node.to<=r.node.to&&(r=o)}for(let o=r;o;o=o.next){let{node:a}=o;if((a.from<s.from&&a.to>=s.to||a.to>s.to&&a.from<=s.from)&&o.next)return S.range(a.to,a.from)}return s});return i.eq(t.selection)?!1:(e(mt(t,i)),!0)};function Qu(t,e){let{state:i}=t,s=i.selection,n=i.selection.ranges.slice();for(let r of i.selection.ranges){let o=i.doc.lineAt(r.head);if(e?o.to<t.state.doc.length:o.from>0)for(let a=r;;){let l=t.moveVertically(a,e);if(l.head<o.from||l.head>o.to){n.some(c=>c.head==l.head)||n.push(l);break}else{if(l.head==a.head)break;a=l}}}return n.length==s.ranges.length?!1:(t.dispatch(mt(i,S.create(n,n.length-1))),!0)}const ex=t=>Qu(t,!1),tx=t=>Qu(t,!0),ix=({state:t,dispatch:e})=>{let i=t.selection,s=null;return i.ranges.length>1?s=S.create([i.main]):i.main.empty||(s=S.create([S.cursor(i.main.head)])),s?(e(mt(t,s)),!0):!1};function $n(t,e){if(t.state.readOnly)return!1;let i="delete.selection",{state:s}=t,n=s.changeByRange(r=>{let{from:o,to:a}=r;if(o==a){let l=e(r);l<o?(i="delete.backward",l=Xn(t,l,!1)):l>o&&(i="delete.forward",l=Xn(t,l,!0)),o=Math.min(o,l),a=Math.max(a,l)}else o=Xn(t,o,!1),a=Xn(t,a,!0);return o==a?{range:r}:{changes:{from:o,to:a},range:S.cursor(o,o<r.head?-1:1)}});return n.changes.empty?!1:(t.dispatch(s.update(n,{scrollIntoView:!0,userEvent:i,effects:i=="delete.selection"?_.announce.of(s.phrase("Selection deleted")):void 0})),!0)}function Xn(t,e,i){if(t instanceof _)for(let s of t.state.facet(_.atomicRanges).map(n=>n(t)))s.between(e,e,(n,r)=>{n<e&&r>e&&(e=i?r:n)});return e}const ju=(t,e,i)=>$n(t,s=>{let n=s.from,{state:r}=t,o=r.doc.lineAt(n),a,l;if(i&&!e&&n>o.from&&n<o.from+200&&!/[^ \t]/.test(a=o.text.slice(0,n-o.from))){if(a[a.length-1]=="	")return n-1;let c=Cs(a,r.tabSize),h=c%Er(r)||Er(r);for(let d=0;d<h&&a[a.length-1-d]==" ";d++)n--;l=n}else l=xe(o.text,n-o.from,e,e)+o.from,l==n&&o.number!=(e?r.doc.lines:1)?l+=e?1:-1:!e&&/[\ufe00-\ufe0f]/.test(o.text.slice(l-o.from,n-o.from))&&(l=xe(o.text,l-o.from,!1,!1)+o.from);return l}),ja=t=>ju(t,!1,!0),Ku=t=>ju(t,!0,!1),Xu=(t,e)=>$n(t,i=>{let s=i.head,{state:n}=t,r=n.doc.lineAt(s),o=n.charCategorizer(s);for(let a=null;;){if(s==(e?r.to:r.from)){s==i.head&&r.number!=(e?n.doc.lines:1)&&(s+=e?1:-1);break}let l=xe(r.text,s-r.from,e)+r.from,c=r.text.slice(Math.min(s,l)-r.from,Math.max(s,l)-r.from),h=o(c);if(a!=null&&h!=a)break;(c!=" "||s!=i.head)&&(a=h),s=l}return s}),Ju=t=>Xu(t,!1),sx=t=>Xu(t,!0),nx=t=>$n(t,e=>{let i=t.lineBlockAt(e.head).to;return e.head<i?i:Math.min(t.state.doc.length,e.head+1)}),rx=t=>$n(t,e=>{let i=t.moveToLineBoundary(e,!1).head;return e.head>i?i:Math.max(0,e.head-1)}),ox=t=>$n(t,e=>{let i=t.moveToLineBoundary(e,!0).head;return e.head<i?i:Math.min(t.state.doc.length,e.head+1)}),ax=({state:t,dispatch:e})=>{if(t.readOnly)return!1;let i=t.changeByRange(s=>({changes:{from:s.from,to:s.to,insert:K.of(["",""])},range:S.cursor(s.from)}));return e(t.update(i,{scrollIntoView:!0,userEvent:"input"})),!0},lx=({state:t,dispatch:e})=>{if(t.readOnly)return!1;let i=t.changeByRange(s=>{if(!s.empty||s.from==0||s.from==t.doc.length)return{range:s};let n=s.from,r=t.doc.lineAt(n),o=n==r.from?n-1:xe(r.text,n-r.from,!1)+r.from,a=n==r.to?n+1:xe(r.text,n-r.from,!0)+r.from;return{changes:{from:o,to:a,insert:t.doc.slice(n,a).append(t.doc.slice(o,n))},range:S.cursor(a)}});return i.changes.empty?!1:(e(t.update(i,{scrollIntoView:!0,userEvent:"move.character"})),!0)};function lo(t){let e=[],i=-1;for(let s of t.selection.ranges){let n=t.doc.lineAt(s.from),r=t.doc.lineAt(s.to);if(!s.empty&&s.to==r.from&&(r=t.doc.lineAt(s.to-1)),i>=n.number){let o=e[e.length-1];o.to=r.to,o.ranges.push(s)}else e.push({from:n.from,to:r.to,ranges:[s]});i=r.number+1}return e}function Yu(t,e,i){if(t.readOnly)return!1;let s=[],n=[];for(let r of lo(t)){if(i?r.to==t.doc.length:r.from==0)continue;let o=t.doc.lineAt(i?r.to+1:r.from-1),a=o.length+1;if(i){s.push({from:r.to,to:o.to},{from:r.from,insert:o.text+t.lineBreak});for(let l of r.ranges)n.push(S.range(Math.min(t.doc.length,l.anchor+a),Math.min(t.doc.length,l.head+a)))}else{s.push({from:o.from,to:r.from},{from:r.to,insert:t.lineBreak+o.text});for(let l of r.ranges)n.push(S.range(l.anchor-a,l.head-a))}}return s.length?(e(t.update({changes:s,scrollIntoView:!0,selection:S.create(n,t.selection.mainIndex),userEvent:"move.line"})),!0):!1}const cx=({state:t,dispatch:e})=>Yu(t,e,!1),hx=({state:t,dispatch:e})=>Yu(t,e,!0);function Gu(t,e,i){if(t.readOnly)return!1;let s=[];for(let r of lo(t))i?s.push({from:r.from,insert:t.doc.slice(r.from,r.to)+t.lineBreak}):s.push({from:r.to,insert:t.lineBreak+t.doc.slice(r.from,r.to)});let n=t.changes(s);return e(t.update({changes:n,selection:t.selection.map(n,i?1:-1),scrollIntoView:!0,userEvent:"input.copyline"})),!0}const dx=({state:t,dispatch:e})=>Gu(t,e,!1),fx=({state:t,dispatch:e})=>Gu(t,e,!0),ux=t=>{if(t.state.readOnly)return!1;let{state:e}=t,i=e.changes(lo(e).map(({from:n,to:r})=>(n>0?n--:r<e.doc.length&&r++,{from:n,to:r}))),s=Os(e.selection,n=>{let r;if(t.lineWrapping){let o=t.lineBlockAt(n.head),a=t.coordsAtPos(n.head,n.assoc||1);a&&(r=o.bottom+t.documentTop-a.bottom+t.defaultLineHeight/2)}return t.moveVertically(n,!0,r)}).map(i);return t.dispatch({changes:i,selection:s,scrollIntoView:!0,userEvent:"delete.line"}),!0};function px(t,e){if(/\(\)|\[\]|\{\}/.test(t.sliceDoc(e-1,e+1)))return{from:e,to:e};let i=Me(t).resolveInner(e),s=i.childBefore(e),n=i.childAfter(e),r;return s&&n&&s.to<=e&&n.from>=e&&(r=s.type.prop(W.closedBy))&&r.indexOf(n.name)>-1&&t.doc.lineAt(s.to).from==t.doc.lineAt(n.from).from&&!/\S/.test(t.sliceDoc(s.to,n.from))?{from:s.to,to:n.from}:null}const Bh=Zu(!1),gx=Zu(!0);function Zu(t){return({state:e,dispatch:i})=>{if(e.readOnly)return!1;let s=e.changeByRange(n=>{let{from:r,to:o}=n,a=e.doc.lineAt(r),l=!t&&r==o&&px(e,r);t&&(r=o=(o<=a.to?a:e.doc.lineAt(o)).to);let c=new so(e,{simulateBreak:r,simulateDoubleBreak:!!l}),h=_l(c,r);for(h==null&&(h=Cs(/^\s*/.exec(e.doc.lineAt(r).text)[0],e.tabSize));o<a.to&&/\s/.test(a.text[o-a.from]);)o++;l?{from:r,to:o}=l:r>a.from&&r<a.from+100&&!/\S/.test(a.text.slice(0,r))&&(r=a.from);let d=["",dn(e,h)];return l&&d.push(dn(e,c.lineIndent(a.from,-1))),{changes:{from:r,to:o,insert:K.of(d)},range:S.cursor(r+1+d[1].length)}});return i(e.update(s,{scrollIntoView:!0,userEvent:"input"})),!0}}function Il(t,e){let i=-1;return t.changeByRange(s=>{let n=[];for(let o=s.from;o<=s.to;){let a=t.doc.lineAt(o);a.number>i&&(s.empty||s.to>a.from)&&(e(a,n,s),i=a.number),o=a.to+1}let r=t.changes(n);return{changes:n,range:S.range(r.mapPos(s.anchor,1),r.mapPos(s.head,1))}})}const mx=({state:t,dispatch:e})=>{if(t.readOnly)return!1;let i=Object.create(null),s=new so(t,{overrideIndentation:r=>{let o=i[r];return o??-1}}),n=Il(t,(r,o,a)=>{let l=_l(s,r.from);if(l==null)return;/\S/.test(r.text)||(l=0);let c=/^\s*/.exec(r.text)[0],h=dn(t,l);(c!=h||a.from<r.from+c.length)&&(i[r.from]=l,o.push({from:r.from,to:r.from+c.length,insert:h}))});return n.changes.empty||e(t.update(n,{userEvent:"indent"})),!0},bx=({state:t,dispatch:e})=>t.readOnly?!1:(e(t.update(Il(t,(i,s)=>{s.push({from:i.from,insert:t.facet(Dl)})}),{userEvent:"input.indent"})),!0),vx=({state:t,dispatch:e})=>t.readOnly?!1:(e(t.update(Il(t,(i,s)=>{let n=/^\s*/.exec(i.text)[0];if(!n)return;let r=Cs(n,t.tabSize),o=0,a=dn(t,Math.max(0,r-Er(t)));for(;o<n.length&&o<a.length&&n.charCodeAt(o)==a.charCodeAt(o);)o++;s.push({from:i.from+o,to:i.from+n.length,insert:a.slice(o)})}),{userEvent:"delete.dedent"})),!0),yx=t=>(t.setTabFocusMode(),!0),xx=[{key:"Ctrl-b",run:Mu,shift:Nu,preventDefault:!0},{key:"Ctrl-f",run:Eu,shift:zu},{key:"Ctrl-p",run:Bu,shift:Uu},{key:"Ctrl-n",run:Ru,shift:qu},{key:"Ctrl-a",run:Iy,shift:Xy},{key:"Ctrl-e",run:Fy,shift:Jy},{key:"Ctrl-d",run:Ku},{key:"Ctrl-h",run:ja},{key:"Ctrl-k",run:nx},{key:"Ctrl-Alt-h",run:Ju},{key:"Ctrl-o",run:ax},{key:"Ctrl-t",run:lx},{key:"Ctrl-v",run:Qa}],wx=[{key:"ArrowLeft",run:Mu,shift:Nu,preventDefault:!0},{key:"Mod-ArrowLeft",mac:"Alt-ArrowLeft",run:Py,shift:Hy,preventDefault:!0},{mac:"Cmd-ArrowLeft",run:Ry,shift:jy,preventDefault:!0},{key:"ArrowRight",run:Eu,shift:zu,preventDefault:!0},{key:"Mod-ArrowRight",mac:"Alt-ArrowRight",run:Ty,shift:Wy,preventDefault:!0},{mac:"Cmd-ArrowRight",run:Ly,shift:Ky,preventDefault:!0},{key:"ArrowUp",run:Bu,shift:Uu,preventDefault:!0},{mac:"Cmd-ArrowUp",run:Mh,shift:Dh},{mac:"Ctrl-ArrowUp",run:$h,shift:Ph},{key:"ArrowDown",run:Ru,shift:qu,preventDefault:!0},{mac:"Cmd-ArrowDown",run:Eh,shift:_h},{mac:"Ctrl-ArrowDown",run:Qa,shift:Th},{key:"PageUp",run:$h,shift:Ph},{key:"PageDown",run:Qa,shift:Th},{key:"Home",run:By,shift:Qy,preventDefault:!0},{key:"Mod-Home",run:Mh,shift:Dh},{key:"End",run:_y,shift:Vy,preventDefault:!0},{key:"Mod-End",run:Eh,shift:_h},{key:"Enter",run:Bh,shift:Bh},{key:"Mod-a",run:Yy},{key:"Backspace",run:ja,shift:ja,preventDefault:!0},{key:"Delete",run:Ku,preventDefault:!0},{key:"Mod-Backspace",mac:"Alt-Backspace",run:Ju,preventDefault:!0},{key:"Mod-Delete",mac:"Alt-Delete",run:sx,preventDefault:!0},{mac:"Mod-Backspace",run:rx,preventDefault:!0},{mac:"Mod-Delete",run:ox,preventDefault:!0}].concat(xx.map(t=>({mac:t.key,run:t.run,shift:t.shift}))),kx=[{key:"Alt-ArrowLeft",mac:"Ctrl-ArrowLeft",run:Ey,shift:Uy},{key:"Alt-ArrowRight",mac:"Ctrl-ArrowRight",run:Dy,shift:qy},{key:"Alt-ArrowUp",run:cx},{key:"Shift-Alt-ArrowUp",run:dx},{key:"Alt-ArrowDown",run:hx},{key:"Shift-Alt-ArrowDown",run:fx},{key:"Mod-Alt-ArrowUp",run:ex},{key:"Mod-Alt-ArrowDown",run:tx},{key:"Escape",run:ix},{key:"Mod-Enter",run:gx},{key:"Alt-l",mac:"Ctrl-l",run:Gy},{key:"Mod-i",run:Zy,preventDefault:!0},{key:"Mod-[",run:vx},{key:"Mod-]",run:bx},{key:"Mod-Alt-\\",run:mx},{key:"Shift-Mod-k",run:ux},{key:"Shift-Mod-\\",run:zy},{key:"Mod-/",run:cy},{key:"Alt-A",run:dy},{key:"Ctrl-m",mac:"Shift-Alt-m",run:yx}].concat(wx),Rh=typeof String.prototype.normalize=="function"?t=>t.normalize("NFKD"):t=>t;class xs{constructor(e,i,s=0,n=e.length,r,o){this.test=o,this.value={from:0,to:0,precise:!1},this.done=!1,this.matches=[],this.buffer="",this.bufferPos=0,this.iter=e.iterRange(s,n),this.bufferStart=s,this.normalize=r?a=>r(Rh(a)):Rh,this.query=this.normalize(i)}peek(){if(this.bufferPos==this.buffer.length){if(this.bufferStart+=this.buffer.length,this.iter.next(),this.iter.done)return-1;this.bufferPos=0,this.buffer=this.iter.value}return Fe(this.buffer,this.bufferPos)}next(){for(;this.matches.length;)this.matches.pop();return this.nextOverlapping()}nextOverlapping(){for(;;){let e=this.peek();if(e<0)return this.done=!0,this;let i=ll(e),s=this.bufferStart+this.bufferPos;this.bufferPos+=Ot(e);let n=this.normalize(i);if(n.length)for(let r=0,o=s,a=!0;;r++){let l=n.charCodeAt(r),c=this.match(l,o,a,this.bufferPos+this.bufferStart,r==n.length-1);if(c)return this.value=c,this;if(r==n.length-1)break;a&&r<i.length&&i.charCodeAt(r)==l?o++:a=!1}}}match(e,i,s,n,r){let o=null;for(let a=0;a<this.matches.length;){let l=this.matches[a],c=!1;this.query.charCodeAt(l.index)==e&&(l.index==this.query.length-1?o={from:l.from,to:n,precise:r&&l.precise}:(l.index++,c=!0)),c?a++:this.matches.splice(a,1)}return this.query.charCodeAt(0)==e&&(this.query.length==1?o={from:i,to:n,precise:s&&r}:this.matches.push({from:i,index:1,precise:s})),o&&this.test&&!this.test(o.from,o.to,this.buffer,this.bufferStart)&&(o=null),o}}typeof Symbol<"u"&&(xs.prototype[Symbol.iterator]=function(){return this});const ep={from:-1,to:-1,match:/.*/.exec(""),precise:!0},Fl="gm"+(/x/.unicode==null?"":"u");class tp{constructor(e,i,s,n=0,r=e.length){if(this.text=e,this.to=r,this.curLine="",this.done=!1,this.value=ep,/\\[sWDnr]|\n|\r|\[\^/.test(i))return new ip(e,i,s,n,r);this.re=new RegExp(i,Fl+(s!=null&&s.ignoreCase?"i":"")),this.test=s==null?void 0:s.test,this.iter=e.iter();let o=e.lineAt(n);this.curLineStart=o.from,this.matchPos=Rr(e,n),this.getLine(this.curLineStart)}getLine(e){this.iter.next(e),this.iter.lineBreak?this.curLine="":(this.curLine=this.iter.value,this.curLineStart+this.curLine.length>this.to&&(this.curLine=this.curLine.slice(0,this.to-this.curLineStart)),this.iter.next())}nextLine(){this.curLineStart=this.curLineStart+this.curLine.length+1,this.curLineStart>this.to?this.curLine="":this.getLine(0)}next(){for(let e=this.matchPos-this.curLineStart;;){this.re.lastIndex=e;let i=this.matchPos<=this.to&&this.re.exec(this.curLine);if(i){let s=this.curLineStart+i.index,n=s+i[0].length;if(this.matchPos=Rr(this.text,n+(s==n?1:0)),s==this.curLineStart+this.curLine.length&&this.nextLine(),(s<n||s>this.value.to)&&(!this.test||this.test(s,n,i)))return this.value={from:s,to:n,precise:!0,match:i},this;e=this.matchPos-this.curLineStart}else if(this.curLineStart+this.curLine.length<this.to)this.nextLine(),e=0;else return this.done=!0,this}}}const qo=new WeakMap;class ls{constructor(e,i){this.from=e,this.text=i}get to(){return this.from+this.text.length}static get(e,i,s){let n=qo.get(e);if(!n||n.from>=s||n.to<=i){let a=new ls(i,e.sliceString(i,s));return qo.set(e,a),a}if(n.from==i&&n.to==s)return n;let{text:r,from:o}=n;return o>i&&(r=e.sliceString(i,o)+r,o=i),n.to<s&&(r+=e.sliceString(n.to,s)),qo.set(e,new ls(o,r)),new ls(i,r.slice(i-o,s-o))}}class ip{constructor(e,i,s,n,r){this.text=e,this.to=r,this.done=!1,this.value=ep,this.matchPos=Rr(e,n),this.re=new RegExp(i,Fl+(s!=null&&s.ignoreCase?"i":"")),this.test=s==null?void 0:s.test,this.flat=ls.get(e,n,this.chunkEnd(n+5e3))}chunkEnd(e){return e>=this.to?this.to:this.text.lineAt(e).to}next(){for(;;){let e=this.re.lastIndex=this.matchPos-this.flat.from,i=this.re.exec(this.flat.text);if(i&&!i[0]&&i.index==e&&(this.re.lastIndex=e+1,i=this.re.exec(this.flat.text)),i){let s=this.flat.from+i.index,n=s+i[0].length;if((this.flat.to>=this.to||i.index+i[0].length<=this.flat.text.length-10)&&(!this.test||this.test(s,n,i)))return this.value={from:s,to:n,precise:!0,match:i},this.matchPos=Rr(this.text,n+(s==n?1:0)),this}if(this.flat.to==this.to)return this.done=!0,this;this.flat=ls.get(this.text,this.flat.from,this.chunkEnd(this.flat.from+this.flat.text.length*2))}}}typeof Symbol<"u"&&(tp.prototype[Symbol.iterator]=ip.prototype[Symbol.iterator]=function(){return this});function Sx(t){try{return new RegExp(t,Fl),!0}catch{return!1}}function Rr(t,e){if(e>=t.length)return e;let i=t.lineAt(e),s;for(;e<i.to&&(s=i.text.charCodeAt(e-i.from))>=56320&&s<57344;)e++;return e}const Cx=t=>{let{state:e}=t,i=String(e.doc.lineAt(t.state.selection.main.head).number),{close:s,result:n}=W0(t,{label:e.phrase("Go to line"),input:{type:"text",name:"line",value:i},focus:!0,submitLabel:e.phrase("go")});return n.then(r=>{let o=r&&/^([+-])?(\d+)?(:\d+)?(%)?$/.exec(r.elements.line.value);if(!o){t.dispatch({effects:s});return}let a=e.doc.lineAt(e.selection.main.head),[,l,c,h,d]=o,f=h?+h.slice(1):0,u=c?+c:a.number;if(c&&d){let b=u/100;l&&(b=b*(l=="-"?-1:1)+a.number/e.doc.lines),u=Math.round(e.doc.lines*b)}else c&&l&&(u=u*(l=="-"?-1:1)+a.number);let p=e.doc.line(Math.max(1,Math.min(e.doc.lines,u))),m=S.cursor(p.from+Math.max(0,Math.min(f,p.length)));t.dispatch({effects:[s,_.scrollIntoView(m.from,{y:"center"})],selection:m})}),!0},Ox={highlightWordAroundCursor:!1,minSelectionLength:1,maxMatches:100,wholeWords:!1},Ax=D.define({combine(t){return Rt(t,Ox,{highlightWordAroundCursor:(e,i)=>e||i,minSelectionLength:Math.min,maxMatches:Math.min})}});function $x(t){return[Dx,Ex]}const Px=N.mark({class:"cm-selectionMatch"}),Tx=N.mark({class:"cm-selectionMatch cm-selectionMatch-main"});function Lh(t,e,i,s){return(i==0||t(e.sliceDoc(i-1,i))!=oe.Word)&&(s==e.doc.length||t(e.sliceDoc(s,s+1))!=oe.Word)}function Mx(t,e,i,s){return t(e.sliceDoc(i,i+1))==oe.Word&&t(e.sliceDoc(s-1,s))==oe.Word}const Ex=pe.fromClass(class{constructor(t){this.decorations=this.getDeco(t)}update(t){(t.selectionSet||t.docChanged||t.viewportChanged)&&(this.decorations=this.getDeco(t.view))}getDeco(t){let e=t.state.facet(Ax),{state:i}=t,s=i.selection;if(s.ranges.length>1)return N.none;let n=s.main,r,o=null;if(n.empty){if(!e.highlightWordAroundCursor)return N.none;let l=i.wordAt(n.head);if(!l)return N.none;o=i.charCategorizer(n.head),r=i.sliceDoc(l.from,l.to)}else{let l=n.to-n.from;if(l<e.minSelectionLength||l>200)return N.none;if(e.wholeWords){if(r=i.sliceDoc(n.from,n.to),o=i.charCategorizer(n.head),!(Lh(o,i,n.from,n.to)&&Mx(o,i,n.from,n.to)))return N.none}else if(r=i.sliceDoc(n.from,n.to),!r)return N.none}let a=[];for(let l of t.visibleRanges){let c=new xs(i.doc,r,l.from,l.to);for(;!c.next().done;){let{from:h,to:d}=c.value;if((!o||Lh(o,i,h,d))&&(n.empty&&h<=n.from&&d>=n.to?a.push(Tx.range(h,d)):(h>=n.to||d<=n.from)&&a.push(Px.range(h,d)),a.length>e.maxMatches))return N.none}}return N.set(a)}},{decorations:t=>t.decorations}),Dx=_.baseTheme({".cm-selectionMatch":{backgroundColor:"#99ff7780"},".cm-searchMatch .cm-selectionMatch":{backgroundColor:"transparent"}}),_x=({state:t,dispatch:e})=>{let{selection:i}=t,s=S.create(i.ranges.map(n=>t.wordAt(n.head)||S.cursor(n.head)),i.mainIndex);return s.eq(i)?!1:(e(t.update({selection:s})),!0)};function Bx(t,e){let{main:i,ranges:s}=t.selection,n=t.wordAt(i.head),r=n&&n.from==i.from&&n.to==i.to;for(let o=!1,a=new xs(t.doc,e,s[s.length-1].to);;)if(a.next(),a.done){if(o)return null;a=new xs(t.doc,e,0,Math.max(0,s[s.length-1].from-1)),o=!0}else{if(o&&s.some(l=>l.from==a.value.from))continue;if(r){let l=t.wordAt(a.value.from);if(!l||l.from!=a.value.from||l.to!=a.value.to)continue}return a.value}}const Rx=({state:t,dispatch:e})=>{let{ranges:i}=t.selection;if(i.some(r=>r.from===r.to))return _x({state:t,dispatch:e});let s=t.sliceDoc(i[0].from,i[0].to);if(t.selection.ranges.some(r=>t.sliceDoc(r.from,r.to)!=s))return!1;let n=Bx(t,s);return n?(e(t.update({selection:t.selection.addRange(S.range(n.from,n.to),!1),effects:_.scrollIntoView(n.to)})),!0):!1},As=D.define({combine(t){return Rt(t,{top:!1,caseSensitive:!1,literal:!1,regexp:!1,wholeWord:!1,createPanel:e=>new Xx(e),scrollToMatch:e=>_.scrollIntoView(e)})}});class sp{constructor(e){this.search=e.search,this.caseSensitive=!!e.caseSensitive,this.literal=!!e.literal,this.regexp=!!e.regexp,this.replace=e.replace||"",this.valid=!!this.search&&(!this.regexp||Sx(this.search)),this.unquoted=this.unquote(this.search),this.wholeWord=!!e.wholeWord,this.test=e.test}unquote(e){return this.literal?e:e.replace(/\\([nrt\\])/g,(i,s)=>s=="n"?`
`:s=="r"?"\r":s=="t"?"	":"\\")}eq(e){return this.search==e.search&&this.replace==e.replace&&this.caseSensitive==e.caseSensitive&&this.regexp==e.regexp&&this.wholeWord==e.wholeWord&&this.test==e.test}create(){return this.regexp?new Hx(this):new Fx(this)}getCursor(e,i=0,s){let n=e.doc?e:j.create({doc:e});return s==null&&(s=n.doc.length),this.regexp?Ji(this,n,i,s):Xi(this,n,i,s)}}class np{constructor(e){this.spec=e}}function Lx(t,e,i){return(s,n,r,o)=>{if(i&&!i(s,n,r,o))return!1;let a=s>=o&&n<=o+r.length?r.slice(s-o,n-o):e.doc.sliceString(s,n);return t(a,e,s,n)}}function Xi(t,e,i,s){let n;return t.wholeWord&&(n=Ix(e.doc,e.charCategorizer(e.selection.main.head))),t.test&&(n=Lx(t.test,e,n)),new xs(e.doc,t.unquoted,i,s,t.caseSensitive?void 0:r=>r.toLowerCase(),n)}function Ix(t,e){return(i,s,n,r)=>((r>i||r+n.length<s)&&(r=Math.max(0,i-2),n=t.sliceString(r,Math.min(t.length,s+2))),(e(Lr(n,i-r))!=oe.Word||e(Ir(n,i-r))!=oe.Word)&&(e(Ir(n,s-r))!=oe.Word||e(Lr(n,s-r))!=oe.Word))}class Fx extends np{constructor(e){super(e)}nextMatch(e,i,s){let n=Xi(this.spec,e,s,e.doc.length).nextOverlapping();if(n.done){let r=Math.min(e.doc.length,i+this.spec.unquoted.length);n=Xi(this.spec,e,0,r).nextOverlapping()}return n.done||n.value.from==i&&n.value.to==s?null:n.value}prevMatchInRange(e,i,s){for(let n=s;;){let r=Math.max(i,n-1e4-this.spec.unquoted.length),o=Xi(this.spec,e,r,n),a=null;for(;!o.nextOverlapping().done;)a=o.value;if(a)return a;if(r==i)return null;n-=1e4}}prevMatch(e,i,s){let n=this.prevMatchInRange(e,0,i);return n||(n=this.prevMatchInRange(e,Math.max(0,s-this.spec.unquoted.length),e.doc.length)),n&&(n.from!=i||n.to!=s)?n:null}getReplacement(e){return this.spec.unquote(this.spec.replace)}matchAll(e,i){let s=Xi(this.spec,e,0,e.doc.length),n=[];for(;!s.next().done;){if(n.length>=i)return null;n.push(s.value)}return n}highlight(e,i,s,n){let r=Xi(this.spec,e,Math.max(0,i-this.spec.unquoted.length),Math.min(s+this.spec.unquoted.length,e.doc.length));for(;!r.next().done;)n(r.value.from,r.value.to)}}function Nx(t,e,i){return(s,n,r)=>(!i||i(s,n,r))&&t(r[0],e,s,n)}function Ji(t,e,i,s){let n;return t.wholeWord&&(n=zx(e.charCategorizer(e.selection.main.head))),t.test&&(n=Nx(t.test,e,n)),new tp(e.doc,t.search,{ignoreCase:!t.caseSensitive,test:n},i,s)}function Lr(t,e){return t.slice(xe(t,e,!1),e)}function Ir(t,e){return t.slice(e,xe(t,e))}function zx(t){return(e,i,s)=>!s[0].length||(t(Lr(s.input,s.index))!=oe.Word||t(Ir(s.input,s.index))!=oe.Word)&&(t(Ir(s.input,s.index+s[0].length))!=oe.Word||t(Lr(s.input,s.index+s[0].length))!=oe.Word)}class Hx extends np{nextMatch(e,i,s){let n=Ji(this.spec,e,s,e.doc.length).next();return n.done&&(n=Ji(this.spec,e,0,i).next()),n.done?null:n.value}prevMatchInRange(e,i,s){for(let n=1;;n++){let r=Math.max(i,s-n*1e4),o=Ji(this.spec,e,r,s),a=null;for(;!o.next().done;)a=o.value;if(a&&(r==i||a.from>r+10))return a;if(r==i)return null}}prevMatch(e,i,s){return this.prevMatchInRange(e,0,i)||this.prevMatchInRange(e,s,e.doc.length)}getReplacement(e){return this.spec.unquote(this.spec.replace).replace(/\$([$&]|\d+)/g,(i,s)=>{if(s=="&")return e.match[0];if(s=="$")return"$";for(let n=s.length;n>0;n--){let r=+s.slice(0,n);if(r>0&&r<e.match.length)return e.match[r]+s.slice(n)}return i})}matchAll(e,i){let s=Ji(this.spec,e,0,e.doc.length),n=[];for(;!s.next().done;){if(n.length>=i)return null;n.push(s.value)}return n}highlight(e,i,s,n){let r=Ji(this.spec,e,Math.max(0,i-250),Math.min(s+250,e.doc.length));for(;!r.next().done;)n(r.value.from,r.value.to)}}const fn=H.define(),Nl=H.define(),ni=Ee.define({create(t){return new Vo(Ka(t).create(),null)},update(t,e){for(let i of e.effects)i.is(fn)?t=new Vo(i.value.create(),t.panel):i.is(Nl)&&(t=new Vo(t.query,i.value?zl:null));return t},provide:t=>ln.from(t,e=>e.panel)});class Vo{constructor(e,i){this.query=e,this.panel=i}}const Wx=N.mark({class:"cm-searchMatch"}),Ux=N.mark({class:"cm-searchMatch cm-searchMatch-selected"}),qx=pe.fromClass(class{constructor(t){this.view=t,this.decorations=this.highlight(t.state.field(ni))}update(t){let e=t.state.field(ni);(e!=t.startState.field(ni)||t.docChanged||t.selectionSet||t.viewportChanged)&&(this.decorations=this.highlight(e))}highlight({query:t,panel:e}){if(!e||!t.spec.valid)return N.none;let{view:i}=this,s=new qt;for(let n=0,r=i.visibleRanges,o=r.length;n<o;n++){let{from:a,to:l}=r[n];for(;n<o-1&&l>r[n+1].from-500;)l=r[++n].to;t.highlight(i.state,a,l,(c,h)=>{let d=i.state.selection.ranges.some(f=>f.from==c&&f.to==h);s.add(c,h,d?Ux:Wx)})}return s.finish()}},{decorations:t=>t.decorations});function Pn(t){return e=>{let i=e.state.field(ni,!1);return i&&i.query.spec.valid?t(e,i):ap(e)}}const Fr=Pn((t,{query:e})=>{let{to:i}=t.state.selection.main,s=e.nextMatch(t.state,i,i);if(!s)return!1;let n=S.single(s.from,s.to),r=t.state.facet(As);return t.dispatch({selection:n,effects:[Hl(t,s),r.scrollToMatch(n.main,t)],userEvent:"select.search"}),op(t),!0}),Nr=Pn((t,{query:e})=>{let{state:i}=t,{from:s}=i.selection.main,n=e.prevMatch(i,s,s);if(!n)return!1;let r=S.single(n.from,n.to),o=t.state.facet(As);return t.dispatch({selection:r,effects:[Hl(t,n),o.scrollToMatch(r.main,t)],userEvent:"select.search"}),op(t),!0}),Vx=Pn((t,{query:e})=>{let i=e.matchAll(t.state,1e3);return!i||!i.length?!1:(t.dispatch({selection:S.create(i.map(s=>S.range(s.from,s.to))),userEvent:"select.search.matches"}),!0)}),Qx=({state:t,dispatch:e})=>{let i=t.selection;if(i.ranges.length>1||i.main.empty)return!1;let{from:s,to:n}=i.main,r=[],o=0;for(let a=new xs(t.doc,t.sliceDoc(s,n));!a.next().done;){if(r.length>1e3)return!1;a.value.from==s&&(o=r.length),r.push(S.range(a.value.from,a.value.to))}return e(t.update({selection:S.create(r,o),userEvent:"select.search.matches"})),!0},Ih=Pn((t,{query:e})=>{let{state:i}=t,{from:s,to:n}=i.selection.main;if(i.readOnly)return!1;let r=e.nextMatch(i,s,s);if(!r)return!1;let o=r,a=[],l,c,h=[];o.precise?o.from==s&&o.to==n&&(c=i.toText(e.getReplacement(o)),a.push({from:o.from,to:o.to,insert:c}),h.push(_.announce.of(i.phrase("replaced match on line $",i.doc.lineAt(s).number)+"."))):o=e.nextMatch(i,o.from,o.to);let d=t.state.changes(a);return o&&(l=S.single(o.from,o.to).map(d),h.push(Hl(t,o)),h.push(i.facet(As).scrollToMatch(l.main,t))),t.dispatch({changes:d,selection:l,effects:h,userEvent:"input.replace"}),!0}),jx=Pn((t,{query:e})=>{if(t.state.readOnly)return!1;let i=[];for(let n of e.matchAll(t.state,1e9)){let{from:r,to:o,precise:a}=n;a&&i.push({from:r,to:o,insert:e.getReplacement(n)})}if(!i.length)return!1;let s=t.state.phrase("replaced $ matches",i.length)+".";return t.dispatch({changes:i,effects:_.announce.of(s),userEvent:"input.replace.all"}),!0});function zl(t){return t.state.facet(As).createPanel(t)}function Ka(t,e){var i,s,n,r,o;let a=t.selection.main,l=a.empty||a.to>a.from+100?"":t.sliceDoc(a.from,a.to);if(e&&!l)return e;let c=t.facet(As);return new sp({search:((i=e==null?void 0:e.literal)!==null&&i!==void 0?i:c.literal)?l:l.replace(/\n/g,"\\n"),caseSensitive:(s=e==null?void 0:e.caseSensitive)!==null&&s!==void 0?s:c.caseSensitive,literal:(n=e==null?void 0:e.literal)!==null&&n!==void 0?n:c.literal,regexp:(r=e==null?void 0:e.regexp)!==null&&r!==void 0?r:c.regexp,wholeWord:(o=e==null?void 0:e.wholeWord)!==null&&o!==void 0?o:c.wholeWord})}function rp(t){let e=$l(t,zl);return e&&e.dom.querySelector("[main-field]")}function op(t){let e=rp(t);e&&e==t.root.activeElement&&e.select()}const ap=t=>{let e=t.state.field(ni,!1);if(e&&e.panel){let i=rp(t);if(i&&i!=t.root.activeElement){let s=Ka(t.state,e.query.spec);s.valid&&t.dispatch({effects:fn.of(s)}),i.focus(),i.select()}}else t.dispatch({effects:[Nl.of(!0),e?fn.of(Ka(t.state,e.query.spec)):H.appendConfig.of(Yx)]});return!0},lp=t=>{let e=t.state.field(ni,!1);if(!e||!e.panel)return!1;let i=$l(t,zl);return i&&i.dom.contains(t.root.activeElement)&&t.focus(),t.dispatch({effects:Nl.of(!1)}),!0},Kx=[{key:"Mod-f",run:ap,scope:"editor search-panel"},{key:"F3",run:Fr,shift:Nr,scope:"editor search-panel",preventDefault:!0},{key:"Mod-g",run:Fr,shift:Nr,scope:"editor search-panel",preventDefault:!0},{key:"Escape",run:lp,scope:"editor search-panel"},{key:"Mod-Shift-l",run:Qx},{key:"Mod-Alt-g",run:Cx},{key:"Mod-d",run:Rx,preventDefault:!0}];class Xx{constructor(e){this.view=e;let i=this.query=e.state.field(ni).query.spec;this.commit=this.commit.bind(this),this.searchField=Y("input",{value:i.search,placeholder:je(e,"Find"),"aria-label":je(e,"Find"),class:"cm-textfield",name:"search",form:"","main-field":"true",onchange:this.commit,onkeyup:this.commit}),this.replaceField=Y("input",{value:i.replace,placeholder:je(e,"Replace"),"aria-label":je(e,"Replace"),class:"cm-textfield",name:"replace",form:"",onchange:this.commit,onkeyup:this.commit}),this.caseField=Y("input",{type:"checkbox",name:"case",form:"",checked:i.caseSensitive,onchange:this.commit}),this.reField=Y("input",{type:"checkbox",name:"re",form:"",checked:i.regexp,onchange:this.commit}),this.wordField=Y("input",{type:"checkbox",name:"word",form:"",checked:i.wholeWord,onchange:this.commit});function s(n,r,o){return Y("button",{class:"cm-button",name:n,onclick:r,type:"button"},o)}this.dom=Y("div",{onkeydown:n=>this.keydown(n),class:"cm-search"},[this.searchField,s("next",()=>Fr(e),[je(e,"next")]),s("prev",()=>Nr(e),[je(e,"previous")]),s("select",()=>Vx(e),[je(e,"all")]),Y("label",null,[this.caseField,je(e,"match case")]),Y("label",null,[this.reField,je(e,"regexp")]),Y("label",null,[this.wordField,je(e,"by word")]),...e.state.readOnly?[]:[Y("br"),this.replaceField,s("replace",()=>Ih(e),[je(e,"replace")]),s("replaceAll",()=>jx(e),[je(e,"replace all")])],Y("button",{name:"close",onclick:()=>lp(e),"aria-label":je(e,"close"),type:"button"},["×"])])}commit(){let e=new sp({search:this.searchField.value,caseSensitive:this.caseField.checked,regexp:this.reField.checked,wholeWord:this.wordField.checked,replace:this.replaceField.value});e.eq(this.query)||(this.query=e,this.view.dispatch({effects:fn.of(e)}))}keydown(e){e0(this.view,e,"search-panel")?e.preventDefault():e.keyCode==13&&e.target==this.searchField?(e.preventDefault(),(e.shiftKey?Nr:Fr)(this.view)):e.keyCode==13&&e.target==this.replaceField&&(e.preventDefault(),Ih(this.view))}update(e){for(let i of e.transactions)for(let s of i.effects)s.is(fn)&&!s.value.eq(this.query)&&this.setQuery(s.value)}setQuery(e){this.query=e,this.searchField.value=e.search,this.replaceField.value=e.replace,this.caseField.checked=e.caseSensitive,this.reField.checked=e.regexp,this.wordField.checked=e.wholeWord}mount(){this.searchField.select()}get pos(){return 80}get top(){return this.view.state.facet(As).top}}function je(t,e){return t.state.phrase(e)}const Jn=30,Yn=/[\s\.,:;?!]/;function Hl(t,{from:e,to:i}){let s=t.state.doc.lineAt(e),n=t.state.doc.lineAt(i).to,r=Math.max(s.from,e-Jn),o=Math.min(n,i+Jn),a=t.state.sliceDoc(r,o);if(r!=s.from){for(let l=0;l<Jn;l++)if(!Yn.test(a[l+1])&&Yn.test(a[l])){a=a.slice(l);break}}if(o!=n){for(let l=a.length-1;l>a.length-Jn;l--)if(!Yn.test(a[l-1])&&Yn.test(a[l])){a=a.slice(0,l);break}}return _.announce.of(`${t.state.phrase("current match")}. ${a} ${t.state.phrase("on line")} ${s.number}.`)}const Jx=_.baseTheme({".cm-panel.cm-search":{padding:"2px 6px 4px",position:"relative","& [name=close]":{position:"absolute",top:"0",right:"4px",backgroundColor:"inherit",border:"none",font:"inherit",padding:0,margin:0},"& input, & button, & label":{margin:".2em .6em .2em 0"},"& input[type=checkbox]":{marginRight:".2em"},"& label":{fontSize:"80%",whiteSpace:"pre"}},"&light .cm-searchMatch":{backgroundColor:"#ffff0054"},"&dark .cm-searchMatch":{backgroundColor:"#00ffff8a"},"&light .cm-searchMatch-selected":{backgroundColor:"#ff6a0054"},"&dark .cm-searchMatch-selected":{backgroundColor:"#ff00ff8a"}}),Yx=[ni,qi.low(qx),Jx];class cp{constructor(e,i,s,n){this.state=e,this.pos=i,this.explicit=s,this.view=n,this.abortListeners=[],this.abortOnDocChange=!1}tokenBefore(e){let i=Me(this.state).resolveInner(this.pos,-1);for(;i&&e.indexOf(i.name)<0;)i=i.parent;return i?{from:i.from,to:this.pos,text:this.state.sliceDoc(i.from,this.pos),type:i.type}:null}matchBefore(e){let i=this.state.doc.lineAt(this.pos),s=Math.max(i.from,this.pos-250),n=i.text.slice(s-i.from,this.pos-i.from),r=n.search(hp(e,!1));return r<0?null:{from:s+r,to:this.pos,text:n.slice(r)}}get aborted(){return this.abortListeners==null}addEventListener(e,i,s){e=="abort"&&this.abortListeners&&(this.abortListeners.push(i),s&&s.onDocChange&&(this.abortOnDocChange=!0))}}function Fh(t){let e=Object.keys(t).join(""),i=/\w/.test(e);return i&&(e=e.replace(/\w/g,"")),`[${i?"\\w":""}${e.replace(/[^\w\s]/g,"\\$&")}]`}function Gx(t){let e=Object.create(null),i=Object.create(null);for(let{label:n}of t){e[n[0]]=!0;for(let r=1;r<n.length;r++)i[n[r]]=!0}let s=Fh(e)+Fh(i)+"*$";return[new RegExp("^"+s),new RegExp(s)]}function Zx(t){let e=t.map(n=>typeof n=="string"?{label:n}:n),[i,s]=e.every(n=>/^\w+$/.test(n.label))?[/\w*$/,/\w+$/]:Gx(e);return n=>{let r=n.matchBefore(s);return r||n.explicit?{from:r?r.from:n.pos,options:e,validFor:i}:null}}class Nh{constructor(e,i,s,n){this.completion=e,this.source=i,this.match=s,this.score=n}}function Li(t){return t.selection.main.from}function hp(t,e){var i;let{source:s}=t,n=e&&s[0]!="^",r=s[s.length-1]!="$";return!n&&!r?t:new RegExp(`${n?"^":""}(?:${s})${r?"$":""}`,(i=t.flags)!==null&&i!==void 0?i:t.ignoreCase?"i":"")}const dp=Xt.define();function e1(t,e,i,s){let{main:n}=t.selection,r=i-n.from,o=s-n.from;return{...t.changeByRange(a=>{if(a!=n&&i!=s&&t.sliceDoc(a.from+r,a.from+o)!=t.sliceDoc(i,s))return{range:a};let l=t.toText(e);return{changes:{from:a.from+r,to:s==n.from?a.to:a.from+o,insert:l},range:S.cursor(a.from+r+l.length)}}),scrollIntoView:!0,userEvent:"input.complete"}}const zh=new WeakMap;function t1(t){if(!Array.isArray(t))return t;let e=zh.get(t);return e||zh.set(t,e=Zx(t)),e}const zr=H.define(),un=H.define();class i1{constructor(e){this.pattern=e,this.chars=[],this.folded=[],this.any=[],this.precise=[],this.byWord=[],this.score=0,this.matched=[];for(let i=0;i<e.length;){let s=Fe(e,i),n=Ot(s);this.chars.push(s);let r=e.slice(i,i+n),o=r.toUpperCase();this.folded.push(Fe(o==r?r.toLowerCase():o,0)),i+=n}this.astral=e.length!=this.chars.length}ret(e,i){return this.score=e,this.matched=i,this}match(e){if(this.pattern.length==0)return this.ret(-100,[]);if(e.length<this.pattern.length)return null;let{chars:i,folded:s,any:n,precise:r,byWord:o}=this;if(i.length==1){let k=Fe(e,0),O=Ot(k),R=O==e.length?0:-100;if(k!=i[0])if(k==s[0])R+=-200;else return null;return this.ret(R,[0,O])}let a=e.indexOf(this.pattern);if(a==0)return this.ret(e.length==this.pattern.length?0:-100,[0,this.pattern.length]);let l=i.length,c=0;if(a<0){for(let k=0,O=Math.min(e.length,200);k<O&&c<l;){let R=Fe(e,k);(R==i[c]||R==s[c])&&(n[c++]=k),k+=Ot(R)}if(c<l)return null}let h=0,d=0,f=!1,u=0,p=-1,m=-1,b=/[a-z]/.test(e),x=!0;for(let k=0,O=Math.min(e.length,200),R=0;k<O&&d<l;){let A=Fe(e,k);a<0&&(h<l&&A==i[h]&&(r[h++]=k),u<l&&(A==i[u]||A==s[u]?(u==0&&(p=k),m=k+1,u++):u=0));let $,P=A<255?A>=48&&A<=57||A>=97&&A<=122?2:A>=65&&A<=90?1:0:($=ll(A))!=$.toLowerCase()?1:$!=$.toUpperCase()?2:0;(!k||P==1&&b||R==0&&P!=0)&&(i[d]==A||s[d]==A&&(f=!0)?o[d++]=k:o.length&&(x=!1)),R=P,k+=Ot(A)}return d==l&&o[0]==0&&x?this.result(-100+(f?-200:0),o,e):u==l&&p==0?this.ret(-200-e.length+(m==e.length?0:-100),[0,m]):a>-1?this.ret(-700-e.length,[a,a+this.pattern.length]):u==l?this.ret(-900-e.length,[p,m]):d==l?this.result(-100+(f?-200:0)+-700+(x?0:-1100),o,e):i.length==2?null:this.result((n[0]?-700:0)+-200+-1100,n,e)}result(e,i,s){let n=[],r=0;for(let o of i){let a=o+(this.astral?Ot(Fe(s,o)):1);r&&n[r-1]==o?n[r-1]=a:(n[r++]=o,n[r++]=a)}return this.ret(e-s.length,n)}}class s1{constructor(e){this.pattern=e,this.matched=[],this.score=0,this.folded=e.toLowerCase()}match(e){if(e.length<this.pattern.length)return null;let i=e.slice(0,this.pattern.length),s=i==this.pattern?0:i.toLowerCase()==this.folded?-200:null;return s==null?null:(this.matched=[0,i.length],this.score=s+(e.length==this.pattern.length?0:-100),this)}}const ye=D.define({combine(t){return Rt(t,{activateOnTyping:!0,activateOnCompletion:()=>!1,activateOnTypingDelay:100,selectOnOpen:!0,override:null,closeOnBlur:!0,maxRenderedOptions:100,defaultKeymap:!0,tooltipClass:()=>"",optionClass:()=>"",aboveCursor:!1,icons:!0,addToOptions:[],positionInfo:n1,filterStrict:!1,compareCompletions:(e,i)=>(e.sortText||e.label).localeCompare(i.sortText||i.label),interactionDelay:75,updateSyncTime:100},{defaultKeymap:(e,i)=>e&&i,closeOnBlur:(e,i)=>e&&i,icons:(e,i)=>e&&i,tooltipClass:(e,i)=>s=>Hh(e(s),i(s)),optionClass:(e,i)=>s=>Hh(e(s),i(s)),addToOptions:(e,i)=>e.concat(i),filterStrict:(e,i)=>e||i})}});function Hh(t,e){return t?e?t+" "+e:t:e}function n1(t,e,i,s,n,r){let o=t.textDirection==ee.RTL,a=o,l=!1,c="top",h,d,f=e.left-n.left,u=n.right-e.right,p=s.right-s.left,m=s.bottom-s.top;if(a&&f<Math.min(p,u)?a=!1:!a&&u<Math.min(p,f)&&(a=!0),p<=(a?f:u))h=Math.max(n.top,Math.min(i.top,n.bottom-m))-e.top,d=Math.min(400,a?f:u);else{l=!0,d=Math.min(400,(o?e.right:n.right-e.left)-30);let k=n.bottom-e.bottom;k>=m||k>e.top?h=i.bottom-e.top:(c="bottom",h=e.bottom-i.top)}let b=(e.bottom-e.top)/r.offsetHeight,x=(e.right-e.left)/r.offsetWidth;return{style:`${c}: ${h/b}px; max-width: ${d/x}px`,class:"cm-completionInfo-"+(l?o?"left-narrow":"right-narrow":a?"left":"right")}}const Wl=H.define();function r1(t){let e=t.addToOptions.slice();return t.icons&&e.push({render(i){let s=document.createElement("div");return s.classList.add("cm-completionIcon"),i.type&&s.classList.add(...i.type.split(/\s+/g).map(n=>"cm-completionIcon-"+n)),s.setAttribute("aria-hidden","true"),s},position:20}),e.push({render(i,s,n,r){let o=document.createElement("span");o.className="cm-completionLabel";let a=i.displayLabel||i.label,l=0;for(let c=0;c<r.length;){let h=r[c++],d=r[c++];h>l&&o.appendChild(document.createTextNode(a.slice(l,h)));let f=o.appendChild(document.createElement("span"));f.appendChild(document.createTextNode(a.slice(h,d))),f.className="cm-completionMatchedText",l=d}return l<a.length&&o.appendChild(document.createTextNode(a.slice(l))),o},position:50},{render(i){if(!i.detail)return null;let s=document.createElement("span");return s.className="cm-completionDetail",s.textContent=i.detail,s},position:80}),e.sort((i,s)=>i.position-s.position).map(i=>i.render)}function Qo(t,e,i){if(t<=i)return{from:0,to:t};if(e<0&&(e=0),e<=t>>1){let n=Math.floor(e/i);return{from:n*i,to:(n+1)*i}}let s=Math.floor((t-e)/i);return{from:t-(s+1)*i,to:t-s*i}}class o1{constructor(e,i,s){this.view=e,this.stateField=i,this.applyCompletion=s,this.info=null,this.infoDestroy=null,this.placeInfoReq={read:()=>this.measureInfo(),write:l=>this.placeInfo(l),key:this},this.space=null,this.currentClass="";let n=e.state.field(i),{options:r,selected:o}=n.open,a=e.state.facet(ye);this.optionContent=r1(a),this.optionClass=a.optionClass,this.tooltipClass=a.tooltipClass,this.range=Qo(r.length,o,a.maxRenderedOptions),this.dom=document.createElement("div"),this.dom.className="cm-tooltip-autocomplete",this.updateTooltipClass(e.state),this.dom.addEventListener("mousedown",l=>{let{options:c}=e.state.field(i).open;for(let h=l.target,d;h&&h!=this.dom;h=h.parentNode)if(h.nodeName=="LI"&&(d=/-(\d+)$/.exec(h.id))&&+d[1]<c.length){this.applyCompletion(e,c[+d[1]]),l.preventDefault();return}if(l.target==this.list){let h=this.list.classList.contains("cm-completionListIncompleteTop")&&l.clientY<this.list.firstChild.getBoundingClientRect().top?this.range.from-1:this.list.classList.contains("cm-completionListIncompleteBottom")&&l.clientY>this.list.lastChild.getBoundingClientRect().bottom?this.range.to:null;h!=null&&(e.dispatch({effects:Wl.of(h)}),l.preventDefault())}}),this.dom.addEventListener("focusout",l=>{let c=e.state.field(this.stateField,!1);c&&c.tooltip&&e.state.facet(ye).closeOnBlur&&l.relatedTarget!=e.contentDOM&&e.dispatch({effects:un.of(null)})}),this.showOptions(r,n.id)}mount(){this.updateSel()}showOptions(e,i){this.list&&this.list.remove(),this.list=this.dom.appendChild(this.createListBox(e,i,this.range)),this.list.addEventListener("scroll",()=>{this.info&&this.view.requestMeasure(this.placeInfoReq)})}update(e){var i;let s=e.state.field(this.stateField),n=e.startState.field(this.stateField);if(this.updateTooltipClass(e.state),s!=n){let{options:r,selected:o,disabled:a}=s.open;(!n.open||n.open.options!=r)&&(this.range=Qo(r.length,o,e.state.facet(ye).maxRenderedOptions),this.showOptions(r,s.id)),this.updateSel(),a!=((i=n.open)===null||i===void 0?void 0:i.disabled)&&this.dom.classList.toggle("cm-tooltip-autocomplete-disabled",!!a)}}updateTooltipClass(e){let i=this.tooltipClass(e);if(i!=this.currentClass){for(let s of this.currentClass.split(" "))s&&this.dom.classList.remove(s);for(let s of i.split(" "))s&&this.dom.classList.add(s);this.currentClass=i}}positioned(e){this.space=e,this.info&&this.view.requestMeasure(this.placeInfoReq)}updateSel(){let e=this.view.state.field(this.stateField),i=e.open;(i.selected>-1&&i.selected<this.range.from||i.selected>=this.range.to)&&(this.range=Qo(i.options.length,i.selected,this.view.state.facet(ye).maxRenderedOptions),this.showOptions(i.options,e.id));let s=this.updateSelectedOption(i.selected);if(s){this.destroyInfo();let{completion:n}=i.options[i.selected],{info:r}=n;if(!r)return;let o=typeof r=="string"?document.createTextNode(r):r(n);if(!o)return;"then"in o?o.then(a=>{a&&this.view.state.field(this.stateField,!1)==e&&this.addInfoPane(a,n)}).catch(a=>He(this.view.state,a,"completion info")):(this.addInfoPane(o,n),s.setAttribute("aria-describedby",this.info.id))}}addInfoPane(e,i){this.destroyInfo();let s=this.info=document.createElement("div");if(s.className="cm-tooltip cm-completionInfo",s.id="cm-completionInfo-"+Math.floor(Math.random()*65535).toString(16),e.nodeType!=null)s.appendChild(e),this.infoDestroy=null;else{let{dom:n,destroy:r}=e;s.appendChild(n),this.infoDestroy=r||null}this.dom.appendChild(s),this.view.requestMeasure(this.placeInfoReq)}updateSelectedOption(e){let i=null;for(let s=this.list.firstChild,n=this.range.from;s;s=s.nextSibling,n++)s.nodeName!="LI"||!s.id?n--:n==e?s.hasAttribute("aria-selected")||(s.setAttribute("aria-selected","true"),i=s):s.hasAttribute("aria-selected")&&(s.removeAttribute("aria-selected"),s.removeAttribute("aria-describedby"));return i&&l1(this.list,i),i}measureInfo(){let e=this.dom.querySelector("[aria-selected]");if(!e||!this.info)return null;let i=this.dom.getBoundingClientRect(),s=this.info.getBoundingClientRect(),n=e.getBoundingClientRect(),r=this.space;if(!r){let o=this.dom.ownerDocument.documentElement;r={left:0,top:0,right:o.clientWidth,bottom:o.clientHeight}}return n.top>Math.min(r.bottom,i.bottom)-10||n.bottom<Math.max(r.top,i.top)+10?null:this.view.state.facet(ye).positionInfo(this.view,i,n,s,r,this.dom)}placeInfo(e){this.info&&(e?(e.style&&(this.info.style.cssText=e.style),this.info.className="cm-tooltip cm-completionInfo "+(e.class||"")):this.info.style.cssText="top: -1e6px")}createListBox(e,i,s){const n=document.createElement("ul");n.id=i,n.setAttribute("role","listbox"),n.setAttribute("aria-expanded","true"),n.setAttribute("aria-label",this.view.state.phrase("Completions")),n.addEventListener("mousedown",o=>{o.target==n&&o.preventDefault()});let r=null;for(let o=s.from;o<s.to;o++){let{completion:a,match:l}=e[o],{section:c}=a;if(c){let f=typeof c=="string"?c:c.name;if(f!=r&&(o>s.from||s.from==0))if(r=f,typeof c!="string"&&c.header)n.appendChild(c.header(c));else{let u=n.appendChild(document.createElement("completion-section"));u.textContent=f}}const h=n.appendChild(document.createElement("li"));h.id=i+"-"+o,h.setAttribute("role","option");let d=this.optionClass(a);d&&(h.className=d);for(let f of this.optionContent){let u=f(a,this.view.state,this.view,l);u&&h.appendChild(u)}}return s.from&&n.classList.add("cm-completionListIncompleteTop"),s.to<e.length&&n.classList.add("cm-completionListIncompleteBottom"),n}destroyInfo(){this.info&&(this.infoDestroy&&this.infoDestroy(),this.info.remove(),this.info=null)}destroy(){this.destroyInfo()}}function a1(t,e){return i=>new o1(i,t,e)}function l1(t,e){let i=t.getBoundingClientRect(),s=e.getBoundingClientRect(),n=i.height/t.offsetHeight;s.top<i.top?t.scrollTop-=(i.top-s.top)/n:s.bottom>i.bottom&&(t.scrollTop+=(s.bottom-i.bottom)/n)}function Wh(t){return(t.boost||0)*100+(t.apply?10:0)+(t.info?5:0)+(t.type?1:0)}function c1(t,e){let i=[],s=null,n=null,r=h=>{i.push(h);let{section:d}=h.completion;if(d){s||(s=[]);let f=typeof d=="string"?d:d.name;s.some(u=>u.name==f)||s.push(typeof d=="string"?{name:f}:d)}},o=e.facet(ye);for(let h of t)if(h.hasResult()){let d=h.result.getMatch;if(h.result.filter===!1)for(let f of h.result.options)r(new Nh(f,h.source,d?d(f):[],1e9-i.length));else{let f=e.sliceDoc(h.from,h.to),u,p=o.filterStrict?new s1(f):new i1(f);for(let m of h.result.options)if(u=p.match(m.label)){let b=m.displayLabel?d?d(m,u.matched):[]:u.matched,x=u.score+(m.boost||0);if(r(new Nh(m,h.source,b,x)),typeof m.section=="object"&&m.section.rank==="dynamic"){let{name:k}=m.section;n||(n=Object.create(null)),n[k]=Math.max(x,n[k]||-1e9)}}}}if(s){let h=Object.create(null),d=0,f=(u,p)=>(u.rank==="dynamic"&&p.rank==="dynamic"?n[p.name]-n[u.name]:0)||(typeof u.rank=="number"?u.rank:1e9)-(typeof p.rank=="number"?p.rank:1e9)||(u.name<p.name?-1:1);for(let u of s.sort(f))d-=1e5,h[u.name]=d;for(let u of i){let{section:p}=u.completion;p&&(u.score+=h[typeof p=="string"?p:p.name])}}let a=[],l=null,c=o.compareCompletions;for(let h of i.sort((d,f)=>f.score-d.score||c(d.completion,f.completion))){let d=h.completion;!l||l.label!=d.label||l.detail!=d.detail||l.type!=null&&d.type!=null&&l.type!=d.type||l.apply!=d.apply||l.boost!=d.boost?a.push(h):Wh(h.completion)>Wh(l)&&(a[a.length-1]=h),l=h.completion}return a}class ts{constructor(e,i,s,n,r,o){this.options=e,this.attrs=i,this.tooltip=s,this.timestamp=n,this.selected=r,this.disabled=o}setSelected(e,i){return e==this.selected||e>=this.options.length?this:new ts(this.options,Uh(i,e),this.tooltip,this.timestamp,e,this.disabled)}static build(e,i,s,n,r,o){if(n&&!o&&e.some(c=>c.isPending))return n.setDisabled();let a=c1(e,i);if(!a.length)return n&&e.some(c=>c.isPending)?n.setDisabled():null;let l=i.facet(ye).selectOnOpen?0:-1;if(n&&n.selected!=l&&n.selected!=-1){let c=n.options[n.selected].completion;for(let h=0;h<a.length;h++)if(a[h].completion==c){l=h;break}}return new ts(a,Uh(s,l),{pos:e.reduce((c,h)=>h.hasResult()?Math.min(c,h.from):c,1e8),create:g1,above:r.aboveCursor},n?n.timestamp:Date.now(),l,!1)}map(e){return new ts(this.options,this.attrs,{...this.tooltip,pos:e.mapPos(this.tooltip.pos)},this.timestamp,this.selected,this.disabled)}setDisabled(){return new ts(this.options,this.attrs,this.tooltip,this.timestamp,this.selected,!0)}}class Hr{constructor(e,i,s){this.active=e,this.id=i,this.open=s}static start(){return new Hr(u1,"cm-ac-"+Math.floor(Math.random()*2e6).toString(36),null)}update(e){let{state:i}=e,s=i.facet(ye),r=(s.override||i.languageDataAt("autocomplete",Li(i)).map(t1)).map(l=>(this.active.find(h=>h.source==l)||new st(l,this.active.some(h=>h.state!=0)?1:0)).update(e,s));r.length==this.active.length&&r.every((l,c)=>l==this.active[c])&&(r=this.active);let o=this.open,a=e.effects.some(l=>l.is(Ul));o&&e.docChanged&&(o=o.map(e.changes)),e.selection||r.some(l=>l.hasResult()&&e.changes.touchesRange(l.from,l.to))||!h1(r,this.active)||a?o=ts.build(r,i,this.id,o,s,a):o&&o.disabled&&!r.some(l=>l.isPending)&&(o=null),!o&&r.every(l=>!l.isPending)&&r.some(l=>l.hasResult())&&(r=r.map(l=>l.hasResult()?new st(l.source,0):l));for(let l of e.effects)l.is(Wl)&&(o=o&&o.setSelected(l.value,this.id));return r==this.active&&o==this.open?this:new Hr(r,this.id,o)}get tooltip(){return this.open?this.open.tooltip:null}get attrs(){return this.open?this.open.attrs:this.active.length?d1:f1}}function h1(t,e){if(t==e)return!0;for(let i=0,s=0;;){for(;i<t.length&&!t[i].hasResult();)i++;for(;s<e.length&&!e[s].hasResult();)s++;let n=i==t.length,r=s==e.length;if(n||r)return n==r;if(t[i++].result!=e[s++].result)return!1}}const d1={"aria-autocomplete":"list"},f1={};function Uh(t,e){let i={"aria-autocomplete":"list","aria-haspopup":"listbox","aria-controls":t};return e>-1&&(i["aria-activedescendant"]=t+"-"+e),i}const u1=[];function fp(t,e){if(t.isUserEvent("input.complete")){let s=t.annotation(dp);if(s&&e.activateOnCompletion(s))return 12}let i=t.isUserEvent("input.type");return i&&e.activateOnTyping?5:i?1:t.isUserEvent("delete.backward")?2:t.selection?8:t.docChanged?16:0}class st{constructor(e,i,s=!1){this.source=e,this.state=i,this.explicit=s}hasResult(){return!1}get isPending(){return this.state==1}update(e,i){let s=fp(e,i),n=this;(s&8||s&16&&this.touches(e))&&(n=new st(n.source,0)),s&4&&n.state==0&&(n=new st(this.source,1)),n=n.updateFor(e,s);for(let r of e.effects)if(r.is(zr))n=new st(n.source,1,r.value);else if(r.is(un))n=new st(n.source,0);else if(r.is(Ul))for(let o of r.value)o.source==n.source&&(n=o);return n}updateFor(e,i){return this.map(e.changes)}map(e){return this}touches(e){return e.changes.touchesRange(Li(e.state))}}class cs extends st{constructor(e,i,s,n,r,o){super(e,3,i),this.limit=s,this.result=n,this.from=r,this.to=o}hasResult(){return!0}updateFor(e,i){var s;if(!(i&3))return this.map(e.changes);let n=this.result;n.map&&!e.changes.empty&&(n=n.map(n,e.changes));let r=e.changes.mapPos(this.from),o=e.changes.mapPos(this.to,1),a=Li(e.state);if(a>o||!n||i&2&&(Li(e.startState)==this.from||a<this.limit))return new st(this.source,i&4?1:0);let l=e.changes.mapPos(this.limit);return p1(n.validFor,e.state,r,o)?new cs(this.source,this.explicit,l,n,r,o):n.update&&(n=n.update(n,r,o,new cp(e.state,a,!1)))?new cs(this.source,this.explicit,l,n,n.from,(s=n.to)!==null&&s!==void 0?s:Li(e.state)):new st(this.source,1,this.explicit)}map(e){return e.empty?this:(this.result.map?this.result.map(this.result,e):this.result)?new cs(this.source,this.explicit,e.mapPos(this.limit),this.result,e.mapPos(this.from),e.mapPos(this.to,1)):new st(this.source,0)}touches(e){return e.changes.touchesRange(this.from,this.to)}}function p1(t,e,i,s){if(!t)return!1;let n=e.sliceDoc(i,s);return typeof t=="function"?t(n,i,s,e):hp(t,!0).test(n)}const Ul=H.define({map(t,e){return t.map(i=>i.map(e))}}),Ne=Ee.define({create(){return Hr.start()},update(t,e){return t.update(e)},provide:t=>[Al.from(t,e=>e.tooltip),_.contentAttributes.from(t,e=>e.attrs)]});function ql(t,e){const i=e.completion.apply||e.completion.label;let s=t.state.field(Ne).active.find(n=>n.source==e.source);return s instanceof cs?(typeof i=="string"?t.dispatch({...e1(t.state,i,s.from,s.to),annotations:dp.of(e.completion)}):i(t,e.completion,s.from,s.to),!0):!1}const g1=a1(Ne,ql);function Gn(t,e="option"){return i=>{let s=i.state.field(Ne,!1);if(!s||!s.open||s.open.disabled||Date.now()-s.open.timestamp<i.state.facet(ye).interactionDelay)return!1;let n=1,r;e=="page"&&(r=Qf(i,s.open.tooltip))&&(n=Math.max(2,Math.floor(r.dom.offsetHeight/r.dom.querySelector("li").offsetHeight)-1));let{length:o}=s.open.options,a=s.open.selected>-1?s.open.selected+n*(t?1:-1):t?0:o-1;return a<0?a=e=="page"?0:o-1:a>=o&&(a=e=="page"?o-1:0),i.dispatch({effects:Wl.of(a)}),!0}}const m1=t=>{let e=t.state.field(Ne,!1);return t.state.readOnly||!e||!e.open||e.open.selected<0||e.open.disabled||Date.now()-e.open.timestamp<t.state.facet(ye).interactionDelay?!1:ql(t,e.open.options[e.open.selected])},jo=t=>t.state.field(Ne,!1)?(t.dispatch({effects:zr.of(!0)}),!0):!1,b1=t=>{let e=t.state.field(Ne,!1);return!e||!e.active.some(i=>i.state!=0)?!1:(t.dispatch({effects:un.of(null)}),!0)};class v1{constructor(e,i){this.active=e,this.context=i,this.time=Date.now(),this.updates=[],this.done=void 0}}const y1=50,x1=1e3,w1=pe.fromClass(class{constructor(t){this.view=t,this.debounceUpdate=-1,this.running=[],this.debounceAccept=-1,this.pendingStart=!1,this.composing=0;for(let e of t.state.field(Ne).active)e.isPending&&this.startQuery(e)}update(t){let e=t.state.field(Ne),i=t.state.facet(ye);if(!t.selectionSet&&!t.docChanged&&t.startState.field(Ne)==e)return;let s=t.transactions.some(r=>{let o=fp(r,i);return o&8||(r.selection||r.docChanged)&&!(o&3)});for(let r=0;r<this.running.length;r++){let o=this.running[r];if(s||o.context.abortOnDocChange&&t.docChanged||o.updates.length+t.transactions.length>y1&&Date.now()-o.time>x1){for(let a of o.context.abortListeners)try{a()}catch(l){He(this.view.state,l)}o.context.abortListeners=null,this.running.splice(r--,1)}else o.updates.push(...t.transactions)}this.debounceUpdate>-1&&clearTimeout(this.debounceUpdate),t.transactions.some(r=>r.effects.some(o=>o.is(zr)))&&(this.pendingStart=!0);let n=this.pendingStart?50:i.activateOnTypingDelay;if(this.debounceUpdate=e.active.some(r=>r.isPending&&!this.running.some(o=>o.active.source==r.source))?setTimeout(()=>this.startUpdate(),n):-1,this.composing!=0)for(let r of t.transactions)r.isUserEvent("input.type")?this.composing=2:this.composing==2&&r.selection&&(this.composing=3)}startUpdate(){this.debounceUpdate=-1,this.pendingStart=!1;let{state:t}=this.view,e=t.field(Ne);for(let i of e.active)i.isPending&&!this.running.some(s=>s.active.source==i.source)&&this.startQuery(i);this.running.length&&e.open&&e.open.disabled&&(this.debounceAccept=setTimeout(()=>this.accept(),this.view.state.facet(ye).updateSyncTime))}startQuery(t){let{state:e}=this.view,i=Li(e),s=new cp(e,i,t.explicit,this.view),n=new v1(t,s);this.running.push(n),Promise.resolve(t.source(s)).then(r=>{n.context.aborted||(n.done=r||null,this.scheduleAccept())},r=>{this.view.dispatch({effects:un.of(null)}),He(this.view.state,r)})}scheduleAccept(){this.running.every(t=>t.done!==void 0)?this.accept():this.debounceAccept<0&&(this.debounceAccept=setTimeout(()=>this.accept(),this.view.state.facet(ye).updateSyncTime))}accept(){var t;this.debounceAccept>-1&&clearTimeout(this.debounceAccept),this.debounceAccept=-1;let e=[],i=this.view.state.facet(ye),s=this.view.state.field(Ne);for(let n=0;n<this.running.length;n++){let r=this.running[n];if(r.done===void 0)continue;if(this.running.splice(n--,1),r.done){let a=Li(r.updates.length?r.updates[0].startState:this.view.state),l=Math.min(a,r.done.from+(r.active.explicit?0:1)),c=new cs(r.active.source,r.active.explicit,l,r.done,r.done.from,(t=r.done.to)!==null&&t!==void 0?t:a);for(let h of r.updates)c=c.update(h,i);if(c.hasResult()){e.push(c);continue}}let o=s.active.find(a=>a.source==r.active.source);if(o&&o.isPending)if(r.done==null){let a=new st(r.active.source,0);for(let l of r.updates)a=a.update(l,i);a.isPending||e.push(a)}else this.startQuery(o)}(e.length||s.open&&s.open.disabled)&&this.view.dispatch({effects:Ul.of(e)})}},{eventHandlers:{blur(t){let e=this.view.state.field(Ne,!1);if(e&&e.tooltip&&this.view.state.facet(ye).closeOnBlur){let i=e.open&&Qf(this.view,e.open.tooltip);(!i||!i.dom.contains(t.relatedTarget))&&setTimeout(()=>this.view.dispatch({effects:un.of(null)}),10)}},compositionstart(){this.composing=1},compositionend(){this.composing==3&&setTimeout(()=>this.view.dispatch({effects:zr.of(!1)}),20),this.composing=0}}}),k1=typeof navigator=="object"&&/Win/.test(navigator.platform),S1=qi.highest(_.domEventHandlers({keydown(t,e){let i=e.state.field(Ne,!1);if(!i||!i.open||i.open.disabled||i.open.selected<0||t.key.length>1||t.ctrlKey&&!(k1&&t.altKey)||t.metaKey)return!1;let s=i.open.options[i.open.selected],n=i.active.find(o=>o.source==s.source),r=s.completion.commitCharacters||n.result.commitCharacters;return r&&r.indexOf(t.key)>-1&&ql(e,s),!1}})),C1=_.baseTheme({".cm-tooltip.cm-tooltip-autocomplete":{"& > ul":{fontFamily:"monospace",whiteSpace:"nowrap",overflow:"hidden auto",maxWidth_fallback:"700px",maxWidth:"min(700px, 95vw)",minWidth:"250px",maxHeight:"10em",height:"100%",listStyle:"none",margin:0,padding:0,"& > li, & > completion-section":{padding:"1px 3px",lineHeight:1.2},"& > li":{overflowX:"hidden",textOverflow:"ellipsis",cursor:"pointer"},"& > completion-section":{display:"list-item",borderBottom:"1px solid silver",paddingLeft:"0.5em",opacity:.7}}},"&light .cm-tooltip-autocomplete ul li[aria-selected]":{background:"#17c",color:"white"},"&light .cm-tooltip-autocomplete-disabled ul li[aria-selected]":{background:"#777"},"&dark .cm-tooltip-autocomplete ul li[aria-selected]":{background:"#347",color:"white"},"&dark .cm-tooltip-autocomplete-disabled ul li[aria-selected]":{background:"#444"},".cm-completionListIncompleteTop:before, .cm-completionListIncompleteBottom:after":{content:'"···"',opacity:.5,display:"block",textAlign:"center"},".cm-tooltip.cm-completionInfo":{position:"absolute",padding:"3px 9px",width:"max-content",maxWidth:"400px",boxSizing:"border-box",whiteSpace:"pre-line"},".cm-completionInfo.cm-completionInfo-left":{right:"100%"},".cm-completionInfo.cm-completionInfo-right":{left:"100%"},".cm-completionInfo.cm-completionInfo-left-narrow":{right:"30px"},".cm-completionInfo.cm-completionInfo-right-narrow":{left:"30px"},"&light .cm-snippetField":{backgroundColor:"#00000022"},"&dark .cm-snippetField":{backgroundColor:"#ffffff22"},".cm-snippetFieldPosition":{verticalAlign:"text-top",width:0,height:"1.15em",display:"inline-block",margin:"0 -0.7px -.7em",borderLeft:"1.4px dotted #888"},".cm-completionMatchedText":{textDecoration:"underline"},".cm-completionDetail":{marginLeft:"0.5em",fontStyle:"italic"},".cm-completionIcon":{fontSize:"90%",width:".8em",display:"inline-block",textAlign:"center",paddingRight:".6em",opacity:"0.6",boxSizing:"content-box"},".cm-completionIcon-function, .cm-completionIcon-method":{"&:after":{content:"'ƒ'"}},".cm-completionIcon-class":{"&:after":{content:"'○'"}},".cm-completionIcon-interface":{"&:after":{content:"'◌'"}},".cm-completionIcon-variable":{"&:after":{content:"'𝑥'"}},".cm-completionIcon-constant":{"&:after":{content:"'𝐶'"}},".cm-completionIcon-type":{"&:after":{content:"'𝑡'"}},".cm-completionIcon-enum":{"&:after":{content:"'∪'"}},".cm-completionIcon-property":{"&:after":{content:"'□'"}},".cm-completionIcon-keyword":{"&:after":{content:"'🔑︎'"}},".cm-completionIcon-namespace":{"&:after":{content:"'▢'"}},".cm-completionIcon-text":{"&:after":{content:"'abc'",fontSize:"50%",verticalAlign:"middle"}}}),pn={brackets:["(","[","{","'",'"'],before:")]}:;>",stringPrefixes:[]},Mi=H.define({map(t,e){let i=e.mapPos(t,-1,Re.TrackAfter);return i??void 0}}),Vl=new class extends ai{};Vl.startSide=1;Vl.endSide=-1;const up=Ee.define({create(){return q.empty},update(t,e){if(t=t.map(e.changes),e.selection){let i=e.state.doc.lineAt(e.selection.main.head);t=t.update({filter:s=>s>=i.from&&s<=i.to})}for(let i of e.effects)i.is(Mi)&&(t=t.update({add:[Vl.range(i.value,i.value+1)]}));return t}});function O1(){return[$1,up]}const Ko="()[]{}<>«»»«［］｛｝";function pp(t){for(let e=0;e<Ko.length;e+=2)if(Ko.charCodeAt(e)==t)return Ko.charAt(e+1);return ll(t<128?t:t+1)}function gp(t,e){return t.languageDataAt("closeBrackets",e)[0]||pn}const A1=typeof navigator=="object"&&/Android\b/.test(navigator.userAgent),$1=_.inputHandler.of((t,e,i,s)=>{if((A1?t.composing:t.compositionStarted)||t.state.readOnly)return!1;let n=t.state.selection.main;if(s.length>2||s.length==2&&Ot(Fe(s,0))==1||e!=n.from||i!=n.to)return!1;let r=M1(t.state,s);return r?(t.dispatch(r),!0):!1}),P1=({state:t,dispatch:e})=>{if(t.readOnly)return!1;let s=gp(t,t.selection.main.head).brackets||pn.brackets,n=null,r=t.changeByRange(o=>{if(o.empty){let a=E1(t.doc,o.head);for(let l of s)if(l==a&&co(t.doc,o.head)==pp(Fe(l,0)))return{changes:{from:o.head-l.length,to:o.head+l.length},range:S.cursor(o.head-l.length)}}return{range:n=o}});return n||e(t.update(r,{scrollIntoView:!0,userEvent:"delete.backward"})),!n},T1=[{key:"Backspace",run:P1}];function M1(t,e){let i=gp(t,t.selection.main.head),s=i.brackets||pn.brackets;for(let n of s){let r=pp(Fe(n,0));if(e==n)return r==n?B1(t,n,s.indexOf(n+n+n)>-1,i):D1(t,n,r,i.before||pn.before);if(e==r&&mp(t,t.selection.main.from))return _1(t,n,r)}return null}function mp(t,e){let i=!1;return t.field(up).between(0,t.doc.length,s=>{s==e&&(i=!0)}),i}function co(t,e){let i=t.sliceString(e,e+2);return i.slice(0,Ot(Fe(i,0)))}function E1(t,e){let i=t.sliceString(e-2,e);return Ot(Fe(i,0))==i.length?i:i.slice(1)}function D1(t,e,i,s){let n=null,r=t.changeByRange(o=>{if(!o.empty)return{changes:[{insert:e,from:o.from},{insert:i,from:o.to}],effects:Mi.of(o.to+e.length),range:S.range(o.anchor+e.length,o.head+e.length)};let a=co(t.doc,o.head);return!a||/\s/.test(a)||s.indexOf(a)>-1?{changes:{insert:e+i,from:o.head},effects:Mi.of(o.head+e.length),range:S.cursor(o.head+e.length)}:{range:n=o}});return n?null:t.update(r,{scrollIntoView:!0,userEvent:"input.type"})}function _1(t,e,i){let s=null,n=t.changeByRange(r=>r.empty&&co(t.doc,r.head)==i?{changes:{from:r.head,to:r.head+i.length,insert:i},range:S.cursor(r.head+i.length)}:s={range:r});return s?null:t.update(n,{scrollIntoView:!0,userEvent:"input.type"})}function B1(t,e,i,s){let n=s.stringPrefixes||pn.stringPrefixes,r=null,o=t.changeByRange(a=>{if(!a.empty)return{changes:[{insert:e,from:a.from},{insert:e,from:a.to}],effects:Mi.of(a.to+e.length),range:S.range(a.anchor+e.length,a.head+e.length)};let l=a.head,c=co(t.doc,l),h;if(c==e){if(qh(t,l))return{changes:{insert:e+e,from:l},effects:Mi.of(l+e.length),range:S.cursor(l+e.length)};if(mp(t,l)){let f=i&&t.sliceDoc(l,l+e.length*3)==e+e+e?e+e+e:e;return{changes:{from:l,to:l+f.length,insert:f},range:S.cursor(l+f.length)}}}else{if(i&&t.sliceDoc(l-2*e.length,l)==e+e&&(h=Vh(t,l-2*e.length,n))>-1&&qh(t,h))return{changes:{insert:e+e+e+e,from:l},effects:Mi.of(l+e.length),range:S.cursor(l+e.length)};if(t.charCategorizer(l)(c)!=oe.Word&&Vh(t,l,n)>-1&&!R1(t,l,e,n))return{changes:{insert:e+e,from:l},effects:Mi.of(l+e.length),range:S.cursor(l+e.length)}}return{range:r=a}});return r?null:t.update(o,{scrollIntoView:!0,userEvent:"input.type"})}function qh(t,e){let i=Me(t).resolveInner(e+1);return i.parent&&i.from==e}function R1(t,e,i,s){let n=Me(t).resolveInner(e,-1),r=s.reduce((o,a)=>Math.max(o,a.length),0);for(let o=0;o<5;o++){let a=t.sliceDoc(n.from,Math.min(n.to,n.from+i.length+r)),l=a.indexOf(i);if(!l||l>-1&&s.indexOf(a.slice(0,l))>-1){let h=n.firstChild;for(;h&&h.from==n.from&&h.to-h.from>i.length+l;){if(t.sliceDoc(h.to-i.length,h.to)==i)return!1;h=h.firstChild}return!0}let c=n.to==e&&n.parent;if(!c)break;n=c}return!1}function Vh(t,e,i){let s=t.charCategorizer(e);if(s(t.sliceDoc(e-1,e))!=oe.Word)return e;for(let n of i){let r=e-n.length;if(t.sliceDoc(r,e)==n&&s(t.sliceDoc(r-1,r))!=oe.Word)return r}return-1}function L1(t={}){return[S1,Ne,ye.of(t),w1,I1,C1]}const bp=[{key:"Ctrl-Space",run:jo},{mac:"Alt-`",run:jo},{mac:"Alt-i",run:jo},{key:"Escape",run:b1},{key:"ArrowDown",run:Gn(!0)},{key:"ArrowUp",run:Gn(!1)},{key:"PageDown",run:Gn(!0,"page")},{key:"PageUp",run:Gn(!1,"page")},{key:"Enter",run:m1}],I1=qi.highest(Cl.computeN([ye],t=>t.facet(ye).defaultKeymap?[bp]:[]));class Qh{constructor(e,i,s){this.from=e,this.to=i,this.diagnostic=s}}class Oi{constructor(e,i,s){this.diagnostics=e,this.panel=i,this.selected=s}static init(e,i,s){let n=s.facet(gn).markerFilter;n&&(e=n(e,s));let r=e.slice().sort((u,p)=>u.from-p.from||u.to-p.to),o=new qt,a=[],l=0,c=s.doc.iter(),h=0,d=s.doc.length;for(let u=0;;){let p=u==r.length?null:r[u];if(!p&&!a.length)break;let m,b;if(a.length)m=l,b=a.reduce((O,R)=>Math.min(O,R.to),p&&p.from>m?p.from:1e8);else{if(m=p.from,m>d)break;b=p.to,a.push(p),u++}for(;u<r.length;){let O=r[u];if(O.from==m&&(O.to>O.from||O.to==m))a.push(O),u++,b=Math.min(O.to,b);else{b=Math.min(O.from,b);break}}b=Math.min(b,d);let x=!1;if(a.some(O=>O.from==m&&(O.to==b||b==d))&&(x=m==b,!x&&b-m<10)){let O=m-(h+c.value.length);O>0&&(c.next(O),h=m);for(let R=m;;){if(R>=b){x=!0;break}if(!c.lineBreak&&h+c.value.length>R)break;R=h+c.value.length,h+=c.value.length,c.next()}}let k=J1(a);if(x)o.add(m,m,N.widget({widget:new Q1(k),diagnostics:a.slice()}));else{let O=a.reduce((R,A)=>A.markClass?R+" "+A.markClass:R,"");o.add(m,b,N.mark({class:"cm-lintRange cm-lintRange-"+k+O,diagnostics:a.slice(),inclusiveEnd:a.some(R=>R.to>b)}))}if(l=b,l==d)break;for(let O=0;O<a.length;O++)a[O].to<=l&&a.splice(O--,1)}let f=o.finish();return new Oi(f,i,ui(f))}}function ui(t,e=null,i=0){let s=null;return t.between(i,1e9,(n,r,{spec:o})=>{if(!(e&&o.diagnostics.indexOf(e)<0))if(!s)s=new Qh(n,r,e||o.diagnostics[0]);else{if(o.diagnostics.indexOf(s.diagnostic)<0)return!1;s=new Qh(s.from,r,s.diagnostic)}}),s}function F1(t,e){let i=e.pos,s=e.end||i,n=t.state.facet(gn).hideOn(t,i,s);if(n!=null)return n;let r=t.startState.doc.lineAt(e.pos);return!!(t.effects.some(o=>o.is(vp))||t.changes.touchesRange(r.from,Math.max(r.to,s)))}function N1(t,e){return t.field(Je,!1)?e:e.concat(H.appendConfig.of(Y1))}const vp=H.define(),Ql=H.define(),yp=H.define(),Je=Ee.define({create(){return new Oi(N.none,null,null)},update(t,e){if(e.docChanged&&t.diagnostics.size){let i=t.diagnostics.map(e.changes),s=null,n=t.panel;if(t.selected){let r=e.changes.mapPos(t.selected.from,1);s=ui(i,t.selected.diagnostic,r)||ui(i,null,r)}!i.size&&n&&e.state.facet(gn).autoPanel&&(n=null),t=new Oi(i,n,s)}for(let i of e.effects)if(i.is(vp)){let s=e.state.facet(gn).autoPanel?i.value.length?mn.open:null:t.panel;t=Oi.init(i.value,s,e.state)}else i.is(Ql)?t=new Oi(t.diagnostics,i.value?mn.open:null,t.selected):i.is(yp)&&(t=new Oi(t.diagnostics,t.panel,i.value));return t},provide:t=>[ln.from(t,e=>e.panel),_.decorations.from(t,e=>e.diagnostics)]}),z1=N.mark({class:"cm-lintRange cm-lintRange-active"});function H1(t,e,i){let{diagnostics:s}=t.state.field(Je),n,r=-1,o=-1;s.between(e-(i<0?1:0),e+(i>0?1:0),(l,c,{spec:h})=>{if(e>=l&&e<=c&&(l==c||(e>l||i>0)&&(e<c||i<0)))return n=h.diagnostics,r=l,o=c,!1});let a=t.state.facet(gn).tooltipFilter;return n&&a&&(n=a(n,t.state)),n?{pos:r,end:o,above:t.state.doc.lineAt(r).to<o,create(){return{dom:W1(t,n)}}}:null}function W1(t,e){return Y("ul",{class:"cm-tooltip-lint"},e.map(i=>wp(t,i,!1)))}const U1=t=>{let e=t.state.field(Je,!1);(!e||!e.panel)&&t.dispatch({effects:N1(t.state,[Ql.of(!0)])});let i=$l(t,mn.open);return i&&i.dom.querySelector(".cm-panel-lint ul").focus(),!0},jh=t=>{let e=t.state.field(Je,!1);return!e||!e.panel?!1:(t.dispatch({effects:Ql.of(!1)}),!0)},q1=t=>{let e=t.state.field(Je,!1);if(!e)return!1;let i=t.state.selection.main,s=ui(e.diagnostics,null,i.to+1);return!s&&(s=ui(e.diagnostics,null,0),!s||s.from==i.from&&s.to==i.to)?!1:(t.dispatch({selection:{anchor:s.from,head:s.to},scrollIntoView:!0}),!0)},V1=[{key:"Mod-Shift-m",run:U1,preventDefault:!0},{key:"F8",run:q1}],gn=D.define({combine(t){return{sources:t.map(e=>e.source).filter(e=>e!=null),...Rt(t.map(e=>e.config),{delay:750,markerFilter:null,tooltipFilter:null,needsRefresh:null,hideOn:()=>null},{delay:Math.max,markerFilter:Kh,tooltipFilter:Kh,needsRefresh:(e,i)=>e?i?s=>e(s)||i(s):e:i,hideOn:(e,i)=>e?i?(s,n,r)=>e(s,n,r)||i(s,n,r):e:i,autoPanel:(e,i)=>e||i})}}});function Kh(t,e){return t?e?(i,s)=>e(t(i,s),s):t:e}function xp(t){let e=[];if(t)e:for(let{name:i}of t){for(let s=0;s<i.length;s++){let n=i[s];if(/[a-zA-Z]/.test(n)&&!e.some(r=>r.toLowerCase()==n.toLowerCase())){e.push(n);continue e}}e.push("")}return e}function wp(t,e,i){var s;let n=i?xp(e.actions):[];return Y("li",{class:"cm-diagnostic cm-diagnostic-"+e.severity},Y("span",{class:"cm-diagnosticText"},e.renderMessage?e.renderMessage(t):e.message),(s=e.actions)===null||s===void 0?void 0:s.map((r,o)=>{let a=!1,l=u=>{if(u.preventDefault(),a)return;a=!0;let p=ui(t.state.field(Je).diagnostics,e);p&&r.apply(t,p.from,p.to)},{name:c}=r,h=n[o]?c.indexOf(n[o]):-1,d=h<0?c:[c.slice(0,h),Y("u",c.slice(h,h+1)),c.slice(h+1)],f=r.markClass?" "+r.markClass:"";return Y("button",{type:"button",class:"cm-diagnosticAction"+f,onclick:l,onmousedown:l,"aria-label":` Action: ${c}${h<0?"":` (access key "${n[o]})"`}.`},d)}),e.source&&Y("div",{class:"cm-diagnosticSource"},e.source))}class Q1 extends Jt{constructor(e){super(),this.sev=e}eq(e){return e.sev==this.sev}toDOM(){return Y("span",{class:"cm-lintPoint cm-lintPoint-"+this.sev})}}class Xh{constructor(e,i){this.diagnostic=i,this.id="item_"+Math.floor(Math.random()*4294967295).toString(16),this.dom=wp(e,i,!0),this.dom.id=this.id,this.dom.setAttribute("role","option")}}class mn{constructor(e){this.view=e,this.items=[];let i=n=>{if(!(n.ctrlKey||n.altKey||n.metaKey)){if(n.keyCode==27)jh(this.view),this.view.focus();else if(n.keyCode==38||n.keyCode==33)this.moveSelection((this.selectedIndex-1+this.items.length)%this.items.length);else if(n.keyCode==40||n.keyCode==34)this.moveSelection((this.selectedIndex+1)%this.items.length);else if(n.keyCode==36)this.moveSelection(0);else if(n.keyCode==35)this.moveSelection(this.items.length-1);else if(n.keyCode==13)this.view.focus();else if(n.keyCode>=65&&n.keyCode<=90&&this.selectedIndex>=0){let{diagnostic:r}=this.items[this.selectedIndex],o=xp(r.actions);for(let a=0;a<o.length;a++)if(o[a].toUpperCase().charCodeAt(0)==n.keyCode){let l=ui(this.view.state.field(Je).diagnostics,r);l&&r.actions[a].apply(e,l.from,l.to)}}else return;n.preventDefault()}},s=n=>{for(let r=0;r<this.items.length;r++)this.items[r].dom.contains(n.target)&&this.moveSelection(r)};this.list=Y("ul",{tabIndex:0,role:"listbox","aria-label":this.view.state.phrase("Diagnostics"),onkeydown:i,onclick:s}),this.dom=Y("div",{class:"cm-panel-lint"},this.list,Y("button",{type:"button",name:"close","aria-label":this.view.state.phrase("close"),onclick:()=>jh(this.view)},"×")),this.update()}get selectedIndex(){let e=this.view.state.field(Je).selected;if(!e)return-1;for(let i=0;i<this.items.length;i++)if(this.items[i].diagnostic==e.diagnostic)return i;return-1}update(){let{diagnostics:e,selected:i}=this.view.state.field(Je),s=0,n=!1,r=null,o=new Set;for(e.between(0,this.view.state.doc.length,(a,l,{spec:c})=>{for(let h of c.diagnostics){if(o.has(h))continue;o.add(h);let d=-1,f;for(let u=s;u<this.items.length;u++)if(this.items[u].diagnostic==h){d=u;break}d<0?(f=new Xh(this.view,h),this.items.splice(s,0,f),n=!0):(f=this.items[d],d>s&&(this.items.splice(s,d-s),n=!0)),i&&f.diagnostic==i.diagnostic?f.dom.hasAttribute("aria-selected")||(f.dom.setAttribute("aria-selected","true"),r=f):f.dom.hasAttribute("aria-selected")&&f.dom.removeAttribute("aria-selected"),s++}});s<this.items.length&&!(this.items.length==1&&this.items[0].diagnostic.from<0);)n=!0,this.items.pop();this.items.length==0&&(this.items.push(new Xh(this.view,{from:-1,to:-1,severity:"info",message:this.view.state.phrase("No diagnostics")})),n=!0),r?(this.list.setAttribute("aria-activedescendant",r.id),this.view.requestMeasure({key:this,read:()=>({sel:r.dom.getBoundingClientRect(),panel:this.list.getBoundingClientRect()}),write:({sel:a,panel:l})=>{let c=l.height/this.list.offsetHeight;a.top<l.top?this.list.scrollTop-=(l.top-a.top)/c:a.bottom>l.bottom&&(this.list.scrollTop+=(a.bottom-l.bottom)/c)}})):this.selectedIndex<0&&this.list.removeAttribute("aria-activedescendant"),n&&this.sync()}sync(){let e=this.list.firstChild;function i(){let s=e;e=s.nextSibling,s.remove()}for(let s of this.items)if(s.dom.parentNode==this.list){for(;e!=s.dom;)i();e=s.dom.nextSibling}else this.list.insertBefore(s.dom,e);for(;e;)i()}moveSelection(e){if(this.selectedIndex<0)return;let i=this.view.state.field(Je),s=ui(i.diagnostics,this.items[e].diagnostic);s&&this.view.dispatch({selection:{anchor:s.from,head:s.to},scrollIntoView:!0,effects:yp.of(s)})}static open(e){return new mn(e)}}function j1(t,e='viewBox="0 0 40 40"'){return`url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ${e}>${encodeURIComponent(t)}</svg>')`}function Zn(t){return j1(`<path d="m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0" stroke="${t}" fill="none" stroke-width=".7"/>`,'width="6" height="3"')}const K1=_.baseTheme({".cm-diagnostic":{padding:"3px 6px 3px 8px",marginLeft:"-1px",display:"block",whiteSpace:"pre-wrap"},".cm-diagnostic-error":{borderLeft:"5px solid #d11"},".cm-diagnostic-warning":{borderLeft:"5px solid orange"},".cm-diagnostic-info":{borderLeft:"5px solid #999"},".cm-diagnostic-hint":{borderLeft:"5px solid #66d"},".cm-diagnosticAction":{font:"inherit",border:"none",padding:"2px 4px",backgroundColor:"#444",color:"white",borderRadius:"3px",marginLeft:"8px",cursor:"pointer"},".cm-diagnosticSource":{fontSize:"70%",opacity:.7},".cm-lintRange":{backgroundPosition:"left bottom",backgroundRepeat:"repeat-x",paddingBottom:"0.7px"},".cm-lintRange-error":{backgroundImage:Zn("#d11")},".cm-lintRange-warning":{backgroundImage:Zn("orange")},".cm-lintRange-info":{backgroundImage:Zn("#999")},".cm-lintRange-hint":{backgroundImage:Zn("#66d")},".cm-lintRange-active":{backgroundColor:"#ffdd9980"},".cm-tooltip-lint":{padding:0,margin:0},".cm-lintPoint":{position:"relative","&:after":{content:'""',position:"absolute",bottom:0,left:"-2px",borderLeft:"3px solid transparent",borderRight:"3px solid transparent",borderBottom:"4px solid #d11"}},".cm-lintPoint-warning":{"&:after":{borderBottomColor:"orange"}},".cm-lintPoint-info":{"&:after":{borderBottomColor:"#999"}},".cm-lintPoint-hint":{"&:after":{borderBottomColor:"#66d"}},".cm-panel.cm-panel-lint":{position:"relative","& ul":{maxHeight:"100px",overflowY:"auto","& [aria-selected]":{backgroundColor:"#ddd","& u":{textDecoration:"underline"}},"&:focus [aria-selected]":{background_fallback:"#bdf",backgroundColor:"Highlight",color_fallback:"white",color:"HighlightText"},"& u":{textDecoration:"none"},padding:0,margin:0},"& [name=close]":{position:"absolute",top:"0",right:"2px",background:"inherit",border:"none",font:"inherit",padding:0,margin:0}},"&dark .cm-lintRange-active":{backgroundColor:"#86714a80"},"&dark .cm-panel.cm-panel-lint ul":{"& [aria-selected]":{backgroundColor:"#2e343e"}}});function X1(t){return t=="error"?4:t=="warning"?3:t=="info"?2:1}function J1(t){let e="hint",i=1;for(let s of t){let n=X1(s.severity);n>i&&(i=n,e=s.severity)}return e}const Y1=[Je,_.decorations.compute([Je],t=>{let{selected:e,panel:i}=t.field(Je);return!e||!i||e.from==e.to?N.none:N.set([z1.range(e.from,e.to)])}),z0(H1,{hideOn:F1}),K1],G1=[Z0(),iv(),b0(),vy(),Vv(),o0(),d0(),j.allowMultipleSelections.of(!0),Ev(),yu(Xv,{fallback:!0}),iy(),O1(),L1(),T0(),D0(),S0(),$x(),Cl.of([...T1,...kx,...Kx,...$y,...Hv,...bp,...V1])];var Jh={};class Wr{constructor(e,i,s,n,r,o,a,l,c,h=0,d){this.p=e,this.stack=i,this.state=s,this.reducePos=n,this.pos=r,this.score=o,this.buffer=a,this.bufferBase=l,this.curContext=c,this.lookAhead=h,this.parent=d}toString(){return`[${this.stack.filter((e,i)=>i%3==0).concat(this.state)}]@${this.pos}${this.score?"!"+this.score:""}`}static start(e,i,s=0){let n=e.parser.context;return new Wr(e,[],i,s,s,0,[],0,n?new Yh(n,n.start):null,0,null)}get context(){return this.curContext?this.curContext.context:null}pushState(e,i){this.stack.push(this.state,i,this.bufferBase+this.buffer.length),this.state=e}reduce(e){var i;let s=e>>19,n=e&65535,{parser:r}=this.p,o=this.reducePos<this.pos-25&&this.setLookAhead(this.pos),a=r.dynamicPrecedence(n);if(a&&(this.score+=a),s==0){n<r.minRepeatTerm&&this.reducePos<this.pos&&(this.reducePos=this.pos),this.pushState(r.getGoto(this.state,n,!0),this.reducePos),n<r.minRepeatTerm&&this.storeNode(n,this.reducePos,this.reducePos,o?8:4,!0),this.reduceContext(n,this.reducePos);return}let l=this.stack.length-(s-1)*3-(e&262144?6:0),c=l?this.stack[l-2]:this.p.ranges[0].from;n<r.minRepeatTerm&&c==this.reducePos&&this.reducePos<this.pos&&(this.reducePos=this.pos);let h=this.reducePos-c;h>=2e3&&!(!((i=this.p.parser.nodeSet.types[n])===null||i===void 0)&&i.isAnonymous)&&(c==this.p.lastBigReductionStart?(this.p.bigReductionCount++,this.p.lastBigReductionSize=h):this.p.lastBigReductionSize<h&&(this.p.bigReductionCount=1,this.p.lastBigReductionStart=c,this.p.lastBigReductionSize=h));let d=l?this.stack[l-1]:0,f=this.bufferBase+this.buffer.length-d;if(n<r.minRepeatTerm||e&131072){let u=r.stateFlag(this.state,1)?this.pos:this.reducePos;this.storeNode(n,c,u,f+4,!0)}if(e&262144)this.state=this.stack[l];else{let u=this.stack[l-3];this.state=r.getGoto(u,n,!0)}for(;this.stack.length>l;)this.stack.pop();this.reduceContext(n,c)}storeNode(e,i,s,n=4,r=!1){if(e==0&&(!this.stack.length||this.stack[this.stack.length-1]<this.buffer.length+this.bufferBase)){let o=this.buffer.length;if(o>0&&this.buffer[o-4]==0&&this.buffer[o-1]>-1){if(i==s)return;if(this.buffer[o-2]>=i){this.buffer[o-2]=s;return}}}if(!r||this.pos==s)this.buffer.push(e,i,s,n);else{let o=this.buffer.length;if(o>0&&(this.buffer[o-4]!=0||this.buffer[o-1]<0)){let a=!1;for(let l=o;l>0&&this.buffer[l-2]>s;l-=4)if(this.buffer[l-1]>=0){a=!0;break}if(a)for(;o>0&&this.buffer[o-2]>s;)this.buffer[o]=this.buffer[o-4],this.buffer[o+1]=this.buffer[o-3],this.buffer[o+2]=this.buffer[o-2],this.buffer[o+3]=this.buffer[o-1],o-=4,n>4&&(n-=4)}this.buffer[o]=e,this.buffer[o+1]=i,this.buffer[o+2]=s,this.buffer[o+3]=n}}shift(e,i,s,n){if(e&131072)this.pushState(e&65535,this.pos);else if((e&262144)==0){let r=e,{parser:o}=this.p;this.pos=n;let a=o.stateFlag(r,1);!a&&(n>s||i<=o.maxNode)&&(this.reducePos=n),this.pushState(r,a?s:Math.min(s,this.reducePos)),this.shiftContext(i,s),i<=o.maxNode&&this.buffer.push(i,s,n,4)}else this.pos=n,this.shiftContext(i,s),i<=this.p.parser.maxNode&&this.buffer.push(i,s,n,4)}apply(e,i,s,n){e&65536?this.reduce(e):this.shift(e,i,s,n)}useNode(e,i){let s=this.p.reused.length-1;(s<0||this.p.reused[s]!=e)&&(this.p.reused.push(e),s++);let n=this.pos;this.reducePos=this.pos=n+e.length,this.pushState(i,n),this.buffer.push(s,n,this.reducePos,-1),this.curContext&&this.updateContext(this.curContext.tracker.reuse(this.curContext.context,e,this,this.p.stream.reset(this.pos-e.length)))}split(){let e=this,i=e.buffer.length;for(i&&e.buffer[i-4]==0&&(i-=4);i>0&&e.buffer[i-2]>e.reducePos;)i-=4;let s=e.buffer.slice(i),n=e.bufferBase+i;for(;e&&n==e.bufferBase;)e=e.parent;return new Wr(this.p,this.stack.slice(),this.state,this.reducePos,this.pos,this.score,s,n,this.curContext,this.lookAhead,e)}recoverByDelete(e,i){let s=e<=this.p.parser.maxNode;s&&this.storeNode(e,this.pos,i,4),this.storeNode(0,this.pos,i,s?8:4),this.pos=this.reducePos=i,this.score-=190}canShift(e){for(let i=new Z1(this);;){let s=this.p.parser.stateSlot(i.state,4)||this.p.parser.hasAction(i.state,e);if(s==0)return!1;if((s&65536)==0)return!0;i.reduce(s)}}recoverByInsert(e){if(this.stack.length>=300)return[];let i=this.p.parser.nextStates(this.state);if(i.length>8||this.stack.length>=120){let n=[];for(let r=0,o;r<i.length;r+=2)(o=i[r+1])!=this.state&&this.p.parser.hasAction(o,e)&&n.push(i[r],o);if(this.stack.length<120)for(let r=0;n.length<8&&r<i.length;r+=2){let o=i[r+1];n.some((a,l)=>l&1&&a==o)||n.push(i[r],o)}i=n}let s=[];for(let n=0;n<i.length&&s.length<4;n+=2){let r=i[n+1];if(r==this.state)continue;let o=this.split();o.pushState(r,this.pos),o.storeNode(0,o.pos,o.pos,4,!0),o.shiftContext(i[n],this.pos),o.reducePos=this.pos,o.score-=200,s.push(o)}return s}forceReduce(){let{parser:e}=this.p,i=e.stateSlot(this.state,5);if((i&65536)==0)return!1;if(!e.validAction(this.state,i)){let s=i>>19,n=i&65535,r=this.stack.length-s*3;if(r<0||e.getGoto(this.stack[r],n,!1)<0){let o=this.findForcedReduction();if(o==null)return!1;i=o}this.storeNode(0,this.pos,this.pos,4,!0),this.score-=100}return this.reducePos=this.pos,this.reduce(i),!0}findForcedReduction(){let{parser:e}=this.p,i=[],s=(n,r)=>{if(!i.includes(n))return i.push(n),e.allActions(n,o=>{if(!(o&393216))if(o&65536){let a=(o>>19)-r;if(a>1){let l=o&65535,c=this.stack.length-a*3;if(c>=0&&e.getGoto(this.stack[c],l,!1)>=0)return a<<19|65536|l}}else{let a=s(o,r+1);if(a!=null)return a}})};return s(this.state,0)}forceAll(){for(;!this.p.parser.stateFlag(this.state,2);)if(!this.forceReduce()){this.storeNode(0,this.pos,this.pos,4,!0);break}return this}get deadEnd(){if(this.stack.length!=3)return!1;let{parser:e}=this.p;return e.data[e.stateSlot(this.state,1)]==65535&&!e.stateSlot(this.state,4)}restart(){this.storeNode(0,this.pos,this.pos,4,!0),this.state=this.stack[0],this.stack.length=0}sameState(e){if(this.state!=e.state||this.stack.length!=e.stack.length)return!1;for(let i=0;i<this.stack.length;i+=3)if(this.stack[i]!=e.stack[i])return!1;return!0}get parser(){return this.p.parser}dialectEnabled(e){return this.p.parser.dialect.flags[e]}shiftContext(e,i){this.curContext&&this.updateContext(this.curContext.tracker.shift(this.curContext.context,e,this,this.p.stream.reset(i)))}reduceContext(e,i){this.curContext&&this.updateContext(this.curContext.tracker.reduce(this.curContext.context,e,this,this.p.stream.reset(i)))}emitContext(){let e=this.buffer.length-1;(e<0||this.buffer[e]!=-3)&&this.buffer.push(this.curContext.hash,this.pos,this.pos,-3)}emitLookAhead(){let e=this.buffer.length-1;(e<0||this.buffer[e]!=-4)&&this.buffer.push(this.lookAhead,this.pos,this.pos,-4)}updateContext(e){if(e!=this.curContext.context){let i=new Yh(this.curContext.tracker,e);i.hash!=this.curContext.hash&&this.emitContext(),this.curContext=i}}setLookAhead(e){return e<=this.lookAhead?!1:(this.emitLookAhead(),this.lookAhead=e,!0)}close(){this.curContext&&this.curContext.tracker.strict&&this.emitContext(),this.lookAhead>0&&this.emitLookAhead()}}class Yh{constructor(e,i){this.tracker=e,this.context=i,this.hash=e.strict?e.hash(i):0}}class Z1{constructor(e){this.start=e,this.state=e.state,this.stack=e.stack,this.base=this.stack.length}reduce(e){let i=e&65535,s=e>>19;s==0?(this.stack==this.start.stack&&(this.stack=this.stack.slice()),this.stack.push(this.state,0,0),this.base+=3):this.base-=(s-1)*3;let n=this.start.p.parser.getGoto(this.stack[this.base-3],i,!0);this.state=n}}class Ur{constructor(e,i,s){this.stack=e,this.pos=i,this.index=s,this.buffer=e.buffer,this.index==0&&this.maybeNext()}static create(e,i=e.bufferBase+e.buffer.length){return new Ur(e,i,i-e.bufferBase)}maybeNext(){let e=this.stack.parent;e!=null&&(this.index=this.stack.bufferBase-e.bufferBase,this.stack=e,this.buffer=e.buffer)}get id(){return this.buffer[this.index-4]}get start(){return this.buffer[this.index-3]}get end(){return this.buffer[this.index-2]}get size(){return this.buffer[this.index-1]}next(){this.index-=4,this.pos-=4,this.index==0&&this.maybeNext()}fork(){return new Ur(this.stack,this.pos,this.index)}}function er(t,e=Uint16Array){if(typeof t!="string")return t;let i=null;for(let s=0,n=0;s<t.length;){let r=0;for(;;){let o=t.charCodeAt(s++),a=!1;if(o==126){r=65535;break}o>=92&&o--,o>=34&&o--;let l=o-32;if(l>=46&&(l-=46,a=!0),r+=l,a)break;r*=46}i?i[n++]=r:i=new e(r)}return i}class hr{constructor(){this.start=-1,this.value=-1,this.end=-1,this.extended=-1,this.lookAhead=0,this.mask=0,this.context=0}}const Gh=new hr;class ew{constructor(e,i){this.input=e,this.ranges=i,this.chunk="",this.chunkOff=0,this.chunk2="",this.chunk2Pos=0,this.next=-1,this.token=Gh,this.rangeIndex=0,this.pos=this.chunkPos=i[0].from,this.range=i[0],this.end=i[i.length-1].to,this.readNext()}resolveOffset(e,i){let s=this.range,n=this.rangeIndex,r=this.pos+e;for(;r<s.from;){if(!n)return null;let o=this.ranges[--n];r-=s.from-o.to,s=o}for(;i<0?r>s.to:r>=s.to;){if(n==this.ranges.length-1)return null;let o=this.ranges[++n];r+=o.from-s.to,s=o}return r}clipPos(e){if(e>=this.range.from&&e<this.range.to)return e;for(let i of this.ranges)if(i.to>e)return Math.max(e,i.from);return this.end}peek(e){let i=this.chunkOff+e,s,n;if(i>=0&&i<this.chunk.length)s=this.pos+e,n=this.chunk.charCodeAt(i);else{let r=this.resolveOffset(e,1);if(r==null)return-1;if(s=r,s>=this.chunk2Pos&&s<this.chunk2Pos+this.chunk2.length)n=this.chunk2.charCodeAt(s-this.chunk2Pos);else{let o=this.rangeIndex,a=this.range;for(;a.to<=s;)a=this.ranges[++o];this.chunk2=this.input.chunk(this.chunk2Pos=s),s+this.chunk2.length>a.to&&(this.chunk2=this.chunk2.slice(0,a.to-s)),n=this.chunk2.charCodeAt(0)}}return s>=this.token.lookAhead&&(this.token.lookAhead=s+1),n}acceptToken(e,i=0){let s=i?this.resolveOffset(i,-1):this.pos;if(s==null||s<this.token.start)throw new RangeError("Token end out of bounds");this.token.value=e,this.token.end=s}acceptTokenTo(e,i){this.token.value=e,this.token.end=i}getChunk(){if(this.pos>=this.chunk2Pos&&this.pos<this.chunk2Pos+this.chunk2.length){let{chunk:e,chunkPos:i}=this;this.chunk=this.chunk2,this.chunkPos=this.chunk2Pos,this.chunk2=e,this.chunk2Pos=i,this.chunkOff=this.pos-this.chunkPos}else{this.chunk2=this.chunk,this.chunk2Pos=this.chunkPos;let e=this.input.chunk(this.pos),i=this.pos+e.length;this.chunk=i>this.range.to?e.slice(0,this.range.to-this.pos):e,this.chunkPos=this.pos,this.chunkOff=0}}readNext(){return this.chunkOff>=this.chunk.length&&(this.getChunk(),this.chunkOff==this.chunk.length)?this.next=-1:this.next=this.chunk.charCodeAt(this.chunkOff)}advance(e=1){for(this.chunkOff+=e;this.pos+e>=this.range.to;){if(this.rangeIndex==this.ranges.length-1)return this.setDone();e-=this.range.to-this.pos,this.range=this.ranges[++this.rangeIndex],this.pos=this.range.from}return this.pos+=e,this.pos>=this.token.lookAhead&&(this.token.lookAhead=this.pos+1),this.readNext()}setDone(){return this.pos=this.chunkPos=this.end,this.range=this.ranges[this.rangeIndex=this.ranges.length-1],this.chunk="",this.next=-1}reset(e,i){if(i?(this.token=i,i.start=e,i.lookAhead=e+1,i.value=i.extended=-1):this.token=Gh,this.pos!=e){if(this.pos=e,e==this.end)return this.setDone(),this;for(;e<this.range.from;)this.range=this.ranges[--this.rangeIndex];for(;e>=this.range.to;)this.range=this.ranges[++this.rangeIndex];e>=this.chunkPos&&e<this.chunkPos+this.chunk.length?this.chunkOff=e-this.chunkPos:(this.chunk="",this.chunkOff=0),this.readNext()}return this}read(e,i){if(e>=this.chunkPos&&i<=this.chunkPos+this.chunk.length)return this.chunk.slice(e-this.chunkPos,i-this.chunkPos);if(e>=this.chunk2Pos&&i<=this.chunk2Pos+this.chunk2.length)return this.chunk2.slice(e-this.chunk2Pos,i-this.chunk2Pos);if(e>=this.range.from&&i<=this.range.to)return this.input.read(e,i);let s="";for(let n of this.ranges){if(n.from>=i)break;n.to>e&&(s+=this.input.read(Math.max(n.from,e),Math.min(n.to,i)))}return s}}class hs{constructor(e,i){this.data=e,this.id=i}token(e,i){let{parser:s}=i.p;tw(this.data,e,i,this.id,s.data,s.tokenPrecTable)}}hs.prototype.contextual=hs.prototype.fallback=hs.prototype.extend=!1;hs.prototype.fallback=hs.prototype.extend=!1;class ho{constructor(e,i={}){this.token=e,this.contextual=!!i.contextual,this.fallback=!!i.fallback,this.extend=!!i.extend}}function tw(t,e,i,s,n,r){let o=0,a=1<<s,{dialect:l}=i.p.parser;e:for(;(a&t[o])!=0;){let c=t[o+1];for(let u=o+3;u<c;u+=2)if((t[u+1]&a)>0){let p=t[u];if(l.allows(p)&&(e.token.value==-1||e.token.value==p||iw(p,e.token.value,n,r))){e.acceptToken(p);break}}let h=e.next,d=0,f=t[o+2];if(e.next<0&&f>d&&t[c+f*3-3]==65535){o=t[c+f*3-1];continue e}for(;d<f;){let u=d+f>>1,p=c+u+(u<<1),m=t[p],b=t[p+1]||65536;if(h<m)f=u;else if(h>=b)d=u+1;else{o=t[p+2],e.advance();continue e}}break}}function Zh(t,e,i){for(let s=e,n;(n=t[s])!=65535;s++)if(n==i)return s-e;return-1}function iw(t,e,i,s){let n=Zh(i,s,e);return n<0||Zh(i,s,t)<n}const Ke=typeof process<"u"&&Jh&&/\bparse\b/.test(Jh.LOG);let Xo=null;function ed(t,e,i){let s=t.cursor(ce.IncludeAnonymous);for(s.moveTo(e);;)if(!(i<0?s.childBefore(e):s.childAfter(e)))for(;;){if((i<0?s.to<e:s.from>e)&&!s.type.isError)return i<0?Math.max(0,Math.min(s.to-1,e-25)):Math.min(t.length,Math.max(s.from+1,e+25));if(i<0?s.prevSibling():s.nextSibling())break;if(!s.parent())return i<0?0:t.length}}class sw{constructor(e,i){this.fragments=e,this.nodeSet=i,this.i=0,this.fragment=null,this.safeFrom=-1,this.safeTo=-1,this.trees=[],this.start=[],this.index=[],this.nextFragment()}nextFragment(){let e=this.fragment=this.i==this.fragments.length?null:this.fragments[this.i++];if(e){for(this.safeFrom=e.openStart?ed(e.tree,e.from+e.offset,1)-e.offset:e.from,this.safeTo=e.openEnd?ed(e.tree,e.to+e.offset,-1)-e.offset:e.to;this.trees.length;)this.trees.pop(),this.start.pop(),this.index.pop();this.trees.push(e.tree),this.start.push(-e.offset),this.index.push(0),this.nextStart=this.safeFrom}else this.nextStart=1e9}nodeAt(e){if(e<this.nextStart)return null;for(;this.fragment&&this.safeTo<=e;)this.nextFragment();if(!this.fragment)return null;for(;;){let i=this.trees.length-1;if(i<0)return this.nextFragment(),null;let s=this.trees[i],n=this.index[i];if(n==s.children.length){this.trees.pop(),this.start.pop(),this.index.pop();continue}let r=s.children[n],o=this.start[i]+s.positions[n];if(o>e)return this.nextStart=o,null;if(r instanceof ue){if(o==e){if(o<this.safeFrom)return null;let a=o+r.length;if(a<=this.safeTo){let l=r.prop(W.lookAhead);if(!l||a+l<this.fragment.to)return r}}this.index[i]++,o+r.length>=Math.max(this.safeFrom,e)&&(this.trees.push(r),this.start.push(o),this.index.push(0))}else this.index[i]++,this.nextStart=o+r.length}}}class nw{constructor(e,i){this.stream=i,this.tokens=[],this.mainToken=null,this.actions=[],this.tokens=e.tokenizers.map(s=>new hr)}getActions(e){let i=0,s=null,{parser:n}=e.p,{tokenizers:r}=n,o=n.stateSlot(e.state,3),a=e.curContext?e.curContext.hash:0,l=0;for(let c=0;c<r.length;c++){if((1<<c&o)==0)continue;let h=r[c],d=this.tokens[c];if(!(s&&!h.fallback)&&((h.contextual||d.start!=e.pos||d.mask!=o||d.context!=a)&&(this.updateCachedToken(d,h,e),d.mask=o,d.context=a),d.lookAhead>d.end+25&&(l=Math.max(d.lookAhead,l)),d.value!=0)){let f=i;if(d.extended>-1&&(i=this.addActions(e,d.extended,d.end,i)),i=this.addActions(e,d.value,d.end,i),!h.extend&&(s=d,i>f))break}}for(;this.actions.length>i;)this.actions.pop();return l&&e.setLookAhead(l),!s&&e.pos==this.stream.end&&(s=new hr,s.value=e.p.parser.eofTerm,s.start=s.end=e.pos,i=this.addActions(e,s.value,s.end,i)),this.mainToken=s,this.actions}getMainToken(e){if(this.mainToken)return this.mainToken;let i=new hr,{pos:s,p:n}=e;return i.start=s,i.end=Math.min(s+1,n.stream.end),i.value=s==n.stream.end?n.parser.eofTerm:0,i}updateCachedToken(e,i,s){let n=this.stream.clipPos(s.pos);if(i.token(this.stream.reset(n,e),s),e.value>-1){let{parser:r}=s.p;for(let o=0;o<r.specialized.length;o++)if(r.specialized[o]==e.value){let a=r.specializers[o](this.stream.read(e.start,e.end),s);if(a>=0&&s.p.parser.dialect.allows(a>>1)){(a&1)==0?e.value=a>>1:e.extended=a>>1;break}}}else e.value=0,e.end=this.stream.clipPos(n+1)}putAction(e,i,s,n){for(let r=0;r<n;r+=3)if(this.actions[r]==e)return n;return this.actions[n++]=e,this.actions[n++]=i,this.actions[n++]=s,n}addActions(e,i,s,n){let{state:r}=e,{parser:o}=e.p,{data:a}=o;for(let l=0;l<2;l++)for(let c=o.stateSlot(r,l?2:1);;c+=3){if(a[c]==65535)if(a[c+1]==1)c=zt(a,c+2);else{n==0&&a[c+1]==2&&(n=this.putAction(zt(a,c+2),i,s,n));break}a[c]==i&&(n=this.putAction(zt(a,c+1),i,s,n))}return n}}class rw{constructor(e,i,s,n){this.parser=e,this.input=i,this.ranges=n,this.recovering=0,this.nextStackID=9812,this.minStackPos=0,this.reused=[],this.stoppedAt=null,this.lastBigReductionStart=-1,this.lastBigReductionSize=0,this.bigReductionCount=0,this.stream=new ew(i,n),this.tokens=new nw(e,this.stream),this.topTerm=e.top[1];let{from:r}=n[0];this.stacks=[Wr.start(this,e.top[0],r)],this.fragments=s.length&&this.stream.end-r>e.bufferLength*4?new sw(s,e.nodeSet):null}get parsedPos(){return this.minStackPos}advance(){let e=this.stacks,i=this.minStackPos,s=this.stacks=[],n,r;if(this.bigReductionCount>300&&e.length==1){let[o]=e;for(;o.forceReduce()&&o.stack.length&&o.stack[o.stack.length-2]>=this.lastBigReductionStart;);this.bigReductionCount=this.lastBigReductionSize=0}for(let o=0;o<e.length;o++){let a=e[o];for(;;){if(this.tokens.mainToken=null,a.pos>i)s.push(a);else{if(this.advanceStack(a,s,e))continue;{n||(n=[],r=[]),n.push(a);let l=this.tokens.getMainToken(a);r.push(l.value,l.end)}}break}}if(!s.length){let o=n&&lw(n);if(o)return Ke&&console.log("Finish with "+this.stackID(o)),this.stackToTree(o);if(this.parser.strict)throw Ke&&n&&console.log("Stuck with token "+(this.tokens.mainToken?this.parser.getName(this.tokens.mainToken.value):"none")),new SyntaxError("No parse at "+i);this.recovering||(this.recovering=5)}if(this.recovering&&n){let o=this.stoppedAt!=null&&n[0].pos>this.stoppedAt?n[0]:this.runRecovery(n,r,s);if(o)return Ke&&console.log("Force-finish "+this.stackID(o)),this.stackToTree(o.forceAll())}if(this.recovering){let o=this.recovering==1?1:this.recovering*3;if(s.length>o)for(s.sort((a,l)=>l.score-a.score);s.length>o;)s.pop();s.some(a=>a.reducePos>i)&&this.recovering--}else if(s.length>1){e:for(let o=0;o<s.length-1;o++){let a=s[o];for(let l=o+1;l<s.length;l++){let c=s[l];if(a.sameState(c)||a.buffer.length>500&&c.buffer.length>500)if((a.score-c.score||a.buffer.length-c.buffer.length)>0)s.splice(l--,1);else{s.splice(o--,1);continue e}}}s.length>12&&(s.sort((o,a)=>a.score-o.score),s.splice(12,s.length-12))}this.minStackPos=s[0].pos;for(let o=1;o<s.length;o++)s[o].pos<this.minStackPos&&(this.minStackPos=s[o].pos);return null}stopAt(e){if(this.stoppedAt!=null&&this.stoppedAt<e)throw new RangeError("Can't move stoppedAt forward");this.stoppedAt=e}advanceStack(e,i,s){let n=e.pos,{parser:r}=this,o=Ke?this.stackID(e)+" -> ":"";if(this.stoppedAt!=null&&n>this.stoppedAt)return e.forceReduce()?e:null;if(this.fragments){let c=e.curContext&&e.curContext.tracker.strict,h=c?e.curContext.hash:0;for(let d=this.fragments.nodeAt(n);d;){let f=this.parser.nodeSet.types[d.type.id]==d.type?r.getGoto(e.state,d.type.id):-1;if(f>-1&&d.length&&(!c||(d.prop(W.contextHash)||0)==h))return e.useNode(d,f),Ke&&console.log(o+this.stackID(e)+` (via reuse of ${r.getName(d.type.id)})`),!0;if(!(d instanceof ue)||d.children.length==0||d.positions[0]>0)break;let u=d.children[0];if(u instanceof ue&&d.positions[0]==0)d=u;else break}}let a=r.stateSlot(e.state,4);if(a>0)return e.reduce(a),Ke&&console.log(o+this.stackID(e)+` (via always-reduce ${r.getName(a&65535)})`),!0;if(e.stack.length>=8400)for(;e.stack.length>6e3&&e.forceReduce(););let l=this.tokens.getActions(e);for(let c=0;c<l.length;){let h=l[c++],d=l[c++],f=l[c++],u=c==l.length||!s,p=u?e:e.split(),m=this.tokens.mainToken;if(p.apply(h,d,m?m.start:p.pos,f),Ke&&console.log(o+this.stackID(p)+` (via ${(h&65536)==0?"shift":`reduce of ${r.getName(h&65535)}`} for ${r.getName(d)} @ ${n}${p==e?"":", split"})`),u)return!0;p.pos>n?i.push(p):s.push(p)}return!1}advanceFully(e,i){let s=e.pos;for(;;){if(!this.advanceStack(e,null,null))return!1;if(e.pos>s)return td(e,i),!0}}runRecovery(e,i,s){let n=null,r=!1;for(let o=0;o<e.length;o++){let a=e[o],l=i[o<<1],c=i[(o<<1)+1],h=Ke?this.stackID(a)+" -> ":"";if(a.deadEnd&&(r||(r=!0,a.restart(),Ke&&console.log(h+this.stackID(a)+" (restarted)"),this.advanceFully(a,s))))continue;let d=a.split(),f=h;for(let u=0;u<10&&d.forceReduce()&&(Ke&&console.log(f+this.stackID(d)+" (via force-reduce)"),!this.advanceFully(d,s));u++)Ke&&(f=this.stackID(d)+" -> ");for(let u of a.recoverByInsert(l))Ke&&console.log(h+this.stackID(u)+" (via recover-insert)"),this.advanceFully(u,s);this.stream.end>a.pos?(c==a.pos&&(c++,l=0),a.recoverByDelete(l,c),Ke&&console.log(h+this.stackID(a)+` (via recover-delete ${this.parser.getName(l)})`),td(a,s)):(!n||n.score<d.score)&&(n=d)}return n}stackToTree(e){return e.close(),ue.build({buffer:Ur.create(e),nodeSet:this.parser.nodeSet,topID:this.topTerm,maxBufferLength:this.parser.bufferLength,reused:this.reused,start:this.ranges[0].from,length:e.pos-this.ranges[0].from,minRepeatType:this.parser.minRepeatTerm})}stackID(e){let i=(Xo||(Xo=new WeakMap)).get(e);return i||Xo.set(e,i=String.fromCodePoint(this.nextStackID++)),i+e}}function td(t,e){for(let i=0;i<e.length;i++){let s=e[i];if(s.pos==t.pos&&s.sameState(t)){e[i].score<t.score&&(e[i]=t);return}}e.push(t)}class ow{constructor(e,i,s){this.source=e,this.flags=i,this.disabled=s}allows(e){return!this.disabled||this.disabled[e]==0}}const Jo=t=>t;class aw{constructor(e){this.start=e.start,this.shift=e.shift||Jo,this.reduce=e.reduce||Jo,this.reuse=e.reuse||Jo,this.hash=e.hash||(()=>0),this.strict=e.strict!==!1}}class qr extends iu{constructor(e){if(super(),this.wrappers=[],e.version!=14)throw new RangeError(`Parser version (${e.version}) doesn't match runtime version (14)`);let i=e.nodeNames.split(" ");this.minRepeatTerm=i.length;for(let a=0;a<e.repeatNodeCount;a++)i.push("");let s=Object.keys(e.topRules).map(a=>e.topRules[a][1]),n=[];for(let a=0;a<i.length;a++)n.push([]);function r(a,l,c){n[a].push([l,l.deserialize(String(c))])}if(e.nodeProps)for(let a of e.nodeProps){let l=a[0];typeof l=="string"&&(l=W[l]);for(let c=1;c<a.length;){let h=a[c++];if(h>=0)r(h,l,a[c++]);else{let d=a[c+-h];for(let f=-h;f>0;f--)r(a[c++],l,d);c++}}}this.nodeSet=new Pl(i.map((a,l)=>Ve.define({name:l>=this.minRepeatTerm?void 0:a,id:l,props:n[l],top:s.indexOf(l)>-1,error:l==0,skipped:e.skippedNodes&&e.skippedNodes.indexOf(l)>-1}))),e.propSources&&(this.nodeSet=this.nodeSet.extend(...e.propSources)),this.strict=!1,this.bufferLength=Gf;let o=er(e.tokenData);this.context=e.context,this.specializerSpecs=e.specialized||[],this.specialized=new Uint16Array(this.specializerSpecs.length);for(let a=0;a<this.specializerSpecs.length;a++)this.specialized[a]=this.specializerSpecs[a].term;this.specializers=this.specializerSpecs.map(id),this.states=er(e.states,Uint32Array),this.data=er(e.stateData),this.goto=er(e.goto),this.maxTerm=e.maxTerm,this.tokenizers=e.tokenizers.map(a=>typeof a=="number"?new hs(o,a):a),this.topRules=e.topRules,this.dialects=e.dialects||{},this.dynamicPrecedences=e.dynamicPrecedences||null,this.tokenPrecTable=e.tokenPrec,this.termNames=e.termNames||null,this.maxNode=this.nodeSet.types.length-1,this.dialect=this.parseDialect(),this.top=this.topRules[Object.keys(this.topRules)[0]]}createParse(e,i,s){let n=new rw(this,e,i,s);for(let r of this.wrappers)n=r(n,e,i,s);return n}getGoto(e,i,s=!1){let n=this.goto;if(i>=n[0])return-1;for(let r=n[i+1];;){let o=n[r++],a=o&1,l=n[r++];if(a&&s)return l;for(let c=r+(o>>1);r<c;r++)if(n[r]==e)return l;if(a)return-1}}hasAction(e,i){let s=this.data;for(let n=0;n<2;n++)for(let r=this.stateSlot(e,n?2:1),o;;r+=3){if((o=s[r])==65535)if(s[r+1]==1)o=s[r=zt(s,r+2)];else{if(s[r+1]==2)return zt(s,r+2);break}if(o==i||o==0)return zt(s,r+1)}return 0}stateSlot(e,i){return this.states[e*6+i]}stateFlag(e,i){return(this.stateSlot(e,0)&i)>0}validAction(e,i){return!!this.allActions(e,s=>s==i?!0:null)}allActions(e,i){let s=this.stateSlot(e,4),n=s?i(s):void 0;for(let r=this.stateSlot(e,1);n==null;r+=3){if(this.data[r]==65535)if(this.data[r+1]==1)r=zt(this.data,r+2);else break;n=i(zt(this.data,r+1))}return n}nextStates(e){let i=[];for(let s=this.stateSlot(e,1);;s+=3){if(this.data[s]==65535)if(this.data[s+1]==1)s=zt(this.data,s+2);else break;if((this.data[s+2]&1)==0){let n=this.data[s+1];i.some((r,o)=>o&1&&r==n)||i.push(this.data[s],n)}}return i}configure(e){let i=Object.assign(Object.create(qr.prototype),this);if(e.props&&(i.nodeSet=this.nodeSet.extend(...e.props)),e.top){let s=this.topRules[e.top];if(!s)throw new RangeError(`Invalid top rule name ${e.top}`);i.top=s}return e.tokenizers&&(i.tokenizers=this.tokenizers.map(s=>{let n=e.tokenizers.find(r=>r.from==s);return n?n.to:s})),e.specializers&&(i.specializers=this.specializers.slice(),i.specializerSpecs=this.specializerSpecs.map((s,n)=>{let r=e.specializers.find(a=>a.from==s.external);if(!r)return s;let o=Object.assign(Object.assign({},s),{external:r.to});return i.specializers[n]=id(o),o})),e.contextTracker&&(i.context=e.contextTracker),e.dialect&&(i.dialect=this.parseDialect(e.dialect)),e.strict!=null&&(i.strict=e.strict),e.wrap&&(i.wrappers=i.wrappers.concat(e.wrap)),e.bufferLength!=null&&(i.bufferLength=e.bufferLength),i}hasWrappers(){return this.wrappers.length>0}getName(e){return this.termNames?this.termNames[e]:String(e<=this.maxNode&&this.nodeSet.types[e].name||e)}get eofTerm(){return this.maxNode+1}get topNode(){return this.nodeSet.types[this.top[1]]}dynamicPrecedence(e){let i=this.dynamicPrecedences;return i==null?0:i[e]||0}parseDialect(e){let i=Object.keys(this.dialects),s=i.map(()=>!1);if(e)for(let r of e.split(" ")){let o=i.indexOf(r);o>=0&&(s[o]=!0)}let n=null;for(let r=0;r<i.length;r++)if(!s[r])for(let o=this.dialects[i[r]],a;(a=this.data[o++])!=65535;)(n||(n=new Uint8Array(this.maxTerm+1)))[a]=1;return new ow(e,s,n)}static deserialize(e){return new qr(e)}}function zt(t,e){return t[e]|t[e+1]<<16}function lw(t){let e=null;for(let i of t){let s=i.p.stoppedAt;(i.pos==i.p.stream.end||s!=null&&i.pos>s)&&i.p.parser.stateFlag(i.state,2)&&(!e||e.score<i.score)&&(e=i)}return e}function id(t){if(t.external){let e=t.extend?1:0;return(i,s)=>t.external(i,s)<<1|e}return t.get}const Yi=63,sd=64,cw=1,hw=2,kp=3,dw=4,Sp=5,fw=6,uw=7,Cp=65,pw=66,gw=8,mw=9,bw=10,vw=11,yw=12,Op=13,xw=19,ww=20,kw=29,Sw=33,Cw=34,Ow=47,Aw=0,jl=1,Xa=2,bn=3,Ja=4;class Ai{constructor(e,i,s){this.parent=e,this.depth=i,this.type=s,this.hash=(e?e.hash+e.hash<<8:0)+i+(i<<4)+s}}Ai.top=new Ai(null,-1,Aw);function Xs(t,e){for(let i=0,s=e-t.pos-1;;s--,i++){let n=t.peek(s);if(jt(n)||n==-1)return i}}function Ya(t){return t==32||t==9}function jt(t){return t==10||t==13}function Ap(t){return Ya(t)||jt(t)}function Ei(t){return t<0||Ap(t)}const $w=new aw({start:Ai.top,reduce(t,e){return t.type==bn&&(e==ww||e==Cw)?t.parent:t},shift(t,e,i,s){if(e==kp)return new Ai(t,Xs(s,s.pos),jl);if(e==Cp||e==Sp)return new Ai(t,Xs(s,s.pos),Xa);if(e==Yi)return t.parent;if(e==xw||e==Sw)return new Ai(t,0,bn);if(e==Op&&t.type==Ja)return t.parent;if(e==Ow){let n=/[1-9]/.exec(s.read(s.pos,i.pos));if(n)return new Ai(t,t.depth+ +n[0],Ja)}return t},hash(t){return t.hash}});function ws(t,e,i=0){return t.peek(i)==e&&t.peek(i+1)==e&&t.peek(i+2)==e&&Ei(t.peek(i+3))}const Pw=new ho((t,e)=>{if(t.next==-1&&e.canShift(sd))return t.acceptToken(sd);let i=t.peek(-1);if((jt(i)||i<0)&&e.context.type!=bn){if(ws(t,45))if(e.canShift(Yi))t.acceptToken(Yi);else return t.acceptToken(cw,3);if(ws(t,46))if(e.canShift(Yi))t.acceptToken(Yi);else return t.acceptToken(hw,3);let s=0;for(;t.next==32;)s++,t.advance();(s<e.context.depth||s==e.context.depth&&e.context.type==jl&&(t.next!=45||!Ei(t.peek(1))))&&t.next!=-1&&!jt(t.next)&&t.next!=35&&t.acceptToken(Yi,-s)}},{contextual:!0}),Tw=new ho((t,e)=>{if(e.context.type==bn){t.next==63&&(t.advance(),Ei(t.next)&&t.acceptToken(uw));return}if(t.next==45)t.advance(),Ei(t.next)&&t.acceptToken(e.context.type==jl&&e.context.depth==Xs(t,t.pos-1)?dw:kp);else if(t.next==63)t.advance(),Ei(t.next)&&t.acceptToken(e.context.type==Xa&&e.context.depth==Xs(t,t.pos-1)?fw:Sp);else{let i=t.pos;for(;;)if(Ya(t.next)){if(t.pos==i)return;t.advance()}else if(t.next==33)$p(t);else if(t.next==38)Ga(t);else if(t.next==42){Ga(t);break}else if(t.next==39||t.next==34){if(Kl(t,!0))break;return}else if(t.next==91||t.next==123){if(!Ew(t))return;break}else{Pp(t,!0,!1,0);break}for(;Ya(t.next);)t.advance();if(t.next==58){if(t.pos==i&&e.canShift(kw))return;let s=t.peek(1);Ei(s)&&t.acceptTokenTo(e.context.type==Xa&&e.context.depth==Xs(t,i)?pw:Cp,i)}}},{contextual:!0});function Mw(t){return t>32&&t<127&&t!=34&&t!=37&&t!=44&&t!=60&&t!=62&&t!=92&&t!=94&&t!=96&&t!=123&&t!=124&&t!=125}function nd(t){return t>=48&&t<=57||t>=97&&t<=102||t>=65&&t<=70}function rd(t,e){return t.next==37?(t.advance(),nd(t.next)&&t.advance(),nd(t.next)&&t.advance(),!0):Mw(t.next)||e&&t.next==44?(t.advance(),!0):!1}function $p(t){if(t.advance(),t.next==60){for(t.advance();;)if(!rd(t,!0)){t.next==62&&t.advance();break}}else for(;rd(t,!1););}function Ga(t){for(t.advance();!Ei(t.next)&&Vr(t.next)!="f";)t.advance()}function Kl(t,e){let i=t.next,s=!1,n=t.pos;for(t.advance();;){let r=t.next;if(r<0)break;if(t.advance(),r==i)if(r==39)if(t.next==39)t.advance();else break;else break;else if(r==92&&i==34)t.next>=0&&t.advance();else if(jt(r)){if(e)return!1;s=!0}else if(e&&t.pos>=n+1024)return!1}return!s}function Ew(t){for(let e=[],i=t.pos+1024;;)if(t.next==91||t.next==123)e.push(t.next),t.advance();else if(t.next==39||t.next==34){if(!Kl(t,!0))return!1}else if(t.next==93||t.next==125){if(e[e.length-1]!=t.next-2)return!1;if(e.pop(),t.advance(),!e.length)return!0}else{if(t.next<0||t.pos>i||jt(t.next))return!1;t.advance()}}const Dw="iiisiiissisfissssssssssssisssiiissssssssssssssssssssssssssfsfssissssssssssssssssssssssssssfif";function Vr(t){return t<33?"u":t>125?"s":Dw[t-33]}function Yo(t,e){let i=Vr(t);return i!="u"&&!(e&&i=="f")}function Pp(t,e,i,s){if(Vr(t.next)=="s"||(t.next==63||t.next==58||t.next==45)&&Yo(t.peek(1),i))t.advance();else return!1;let n=t.pos;for(;;){let r=t.next,o=0,a=s+1;for(;Ap(r);){if(jt(r)){if(e)return!1;a=0}else a++;r=t.peek(++o)}if(!(r>=0&&(r==58?Yo(t.peek(o+1),i):r==35?t.peek(o-1)!=32:Yo(r,i)))||!i&&a<=s||a==0&&!i&&(ws(t,45,o)||ws(t,46,o)))break;if(e&&Vr(r)=="f")return!1;for(let c=o;c>=0;c--)t.advance();if(e&&t.pos>n+1024)return!1}return!0}const _w=new ho((t,e)=>{if(t.next==33)$p(t),t.acceptToken(yw);else if(t.next==38||t.next==42){let i=t.next==38?bw:vw;Ga(t),t.acceptToken(i)}else t.next==39||t.next==34?(Kl(t,!1),t.acceptToken(mw)):Pp(t,!1,e.context.type==bn,e.context.depth)&&t.acceptToken(gw)}),Bw=new ho((t,e)=>{let i=e.context.type==Ja?e.context.depth:-1,s=t.pos;e:for(;;){let n=0,r=t.next;for(;r==32;)r=t.peek(++n);if(!n&&(ws(t,45,n)||ws(t,46,n))||!jt(r)&&(i<0&&(i=Math.max(e.context.depth+1,n)),n<i))break;for(;;){if(t.next<0)break e;let o=jt(t.next);if(t.advance(),o)continue e;s=t.pos}}t.acceptTokenTo(Op,s)}),Rw=su({DirectiveName:w.keyword,DirectiveContent:w.attributeValue,"DirectiveEnd DocEnd":w.meta,QuotedLiteral:w.string,BlockLiteralHeader:w.special(w.string),BlockLiteralContent:w.content,Literal:w.content,"Key/Literal Key/QuotedLiteral":w.definition(w.propertyName),"Anchor Alias":w.labelName,Tag:w.typeName,Comment:w.lineComment,": , -":w.separator,"?":w.punctuation,"[ ]":w.squareBracket,"{ }":w.brace}),Lw=qr.deserialize({version:14,states:"5lQ!ZQgOOO#PQfO'#CpO#uQfO'#DOOOQR'#Dv'#DvO$qQgO'#DRO%gQdO'#DUO%nQgO'#DUO&ROaO'#D[OOQR'#Du'#DuO&{QgO'#D^O'rQgO'#D`OOQR'#Dt'#DtO(iOqO'#DbOOQP'#Dj'#DjO(zQaO'#CmO)YQgO'#CmOOQP'#Cm'#CmQ)jQaOOQ)uQgOOQ]QgOOO*PQdO'#CrO*nQdO'#CtOOQO'#Dw'#DwO+]Q`O'#CxO+hQdO'#CwO+rQ`O'#CwOOQO'#Cv'#CvO+wQdO'#CvOOQO'#Cq'#CqO,UQ`O,59[O,^QfO,59[OOQR,59[,59[OOQO'#Cx'#CxO,eQ`O'#DPO,pQdO'#DPOOQO'#Dx'#DxO,zQdO'#DxO-XQ`O,59jO-aQfO,59jOOQR,59j,59jOOQR'#DS'#DSO-hQcO,59mO-sQgO'#DVO.TQ`O'#DVO.YQcO,59pOOQR'#DX'#DXO#|QfO'#DWO.hQcO'#DWOOQR,59v,59vO.yOWO,59vO/OOaO,59vO/WOaO,59vO/cQgO'#D_OOQR,59x,59xO0VQgO'#DaOOQR,59z,59zOOQP,59|,59|O0yOaO,59|O1ROaO,59|O1aOqO,59|OOQP-E7h-E7hO1oQgO,59XOOQP,59X,59XO2PQaO'#DeO2_QgO'#DeO2oQgO'#DkOOQP'#Dk'#DkQ)jQaOOO3PQdO'#CsOOQO,59^,59^O3kQdO'#CuOOQO,59`,59`OOQO,59c,59cO4VQdO,59cO4aQdO'#CzO4kQ`O'#CzOOQO,59b,59bOOQU,5:Q,5:QOOQR1G.v1G.vO4pQ`O1G.vOOQU-E7d-E7dO4xQdO,59kOOQO,59k,59kO5SQdO'#DQO5^Q`O'#DQOOQO,5:d,5:dOOQU,5:R,5:ROOQR1G/U1G/UO5cQ`O1G/UOOQU-E7e-E7eO5kQgO'#DhO5xQcO1G/XOOQR1G/X1G/XOOQR,59q,59qO6TQgO,59qO6eQdO'#DiO6lQgO'#DiO7PQcO1G/[OOQR1G/[1G/[OOQR,59r,59rO#|QfO,59rOOQR1G/b1G/bO7_OWO1G/bO7dOaO1G/bOOQR,59y,59yOOQR,59{,59{OOQP1G/h1G/hO7lOaO1G/hO7tOaO1G/hO8POaO1G/hOOQP1G.s1G.sO8_QgO,5:POOQP,5:P,5:POOQP,5:V,5:VOOQP-E7i-E7iOOQO,59_,59_OOQO,59a,59aOOQO1G.}1G.}OOQO,59f,59fO8oQdO,59fOOQR7+$b7+$bP,XQ`O'#DfOOQO1G/V1G/VOOQO,59l,59lO8yQdO,59lOOQR7+$p7+$pP9TQ`O'#DgOOQR'#DT'#DTOOQR,5:S,5:SOOQR-E7f-E7fOOQR7+$s7+$sOOQR1G/]1G/]O9YQgO'#DYO9jQ`O'#DYOOQR,5:T,5:TO#|QfO'#DZO9oQcO'#DZOOQR-E7g-E7gOOQR7+$v7+$vOOQR1G/^1G/^OOQR7+$|7+$|O:QOWO7+$|OOQP7+%S7+%SO:VOaO7+%SO:_OaO7+%SOOQP1G/k1G/kOOQO1G/Q1G/QOOQO1G/W1G/WOOQR,59t,59tO:jQgO,59tOOQR,59u,59uO#|QfO,59uOOQR<<Hh<<HhOOQP<<Hn<<HnO:zOaO<<HnOOQR1G/`1G/`OOQR1G/a1G/aOOQPAN>YAN>Y",stateData:";S~O!fOS!gOS^OS~OP_OQbORSOTUOWROXROYYOZZO[XOcPOqQO!PVO!V[O!cTO~O`cO~P]OVkOWROXROYeOZfO[dOcPOmhOqQO~OboO~P!bOVtOWROXROYeOZfO[dOcPOmrOqQO~OpwO~P#WORSOTUOWROXROYYOZZO[XOcPOqQO!PVO!cTO~OSvP!avP!bvP~P#|OWROXROYeOZfO[dOcPOqQO~OmzO~P%OOm!OOUzP!azP!bzP!dzP~P#|O^!SO!b!QO!f!TO!g!RO~ORSOTUOWROXROcPOqQO!PVO!cTO~OY!UOP!QXQ!QX!V!QX!`!QXS!QX!a!QX!b!QXU!QXm!QX!d!QX~P&aO[!WOP!SXQ!SX!V!SX!`!SXS!SX!a!SX!b!SXU!SXm!SX!d!SX~P&aO^!ZO!W![O!b!YO!f!]O!g!YO~OP!_O!V[OQaX!`aX~OPaXQaX!VaX!`aX~P#|OP!bOQ!cO!V[O~OP_O!V[O~P#|OWROXROY!fOcPOqQObfXmfXofXpfX~OWROXRO[!hOcPOqQObhXmhXohXphX~ObeXmlXoeX~ObkXokX~P%OOm!kO~Om!lObnPonP~P%OOb!pOo!oO~Ob!pO~P!bOm!sOosXpsX~OosXpsX~P%OOm!uOotPptP~P%OOo!xOp!yO~Op!yO~P#WOS!|O!a#OO!b#OO~OUyX!ayX!byX!dyX~P#|Om#QO~OU#SO!a#UO!b#UO!d#RO~Om#WOUzX!azX!bzX!dzX~O]#XO~O!b#XO!g#YO~O^#ZO!b#XO!g#YO~OP!RXQ!RX!V!RX!`!RXS!RX!a!RX!b!RXU!RXm!RX!d!RX~P&aOP!TXQ!TX!V!TX!`!TXS!TX!a!TX!b!TXU!TXm!TX!d!TX~P&aO!b#^O!g#^O~O^#_O!b#^O!f#`O!g#^O~O^#_O!W#aO!b#^O!g#^O~OPaaQaa!Vaa!`aa~P#|OP#cO!V[OQ!XX!`!XX~OP!XXQ!XX!V!XX!`!XX~P#|OP_O!V[OQ!_X!`!_X~P#|OWROXROcPOqQObgXmgXogXpgX~OWROXROcPOqQObiXmiXoiXpiX~Obkaoka~P%OObnXonX~P%OOm#kO~Ob#lOo!oO~Oosapsa~P%OOotXptX~P%OOm#pO~Oo!xOp#qO~OSwP!awP!bwP~P#|OS!|O!a#vO!b#vO~OUya!aya!bya!dya~P#|Om#xO~P%OOm#{OU}P!a}P!b}P!d}P~P#|OU#SO!a$OO!b$OO!d#RO~O]$QO~O!b$QO!g$RO~O!b$SO!g$SO~O^$TO!b$SO!g$SO~O^$TO!b$SO!f$UO!g$SO~OP!XaQ!Xa!V!Xa!`!Xa~P#|Obnaona~P%OOotapta~P%OOo!xO~OU|X!a|X!b|X!d|X~P#|Om$ZO~Om$]OU}X!a}X!b}X!d}X~O]$^O~O!b$_O!g$_O~O^$`O!b$_O!g$_O~OU|a!a|a!b|a!d|a~P#|O!b$cO!g$cO~O",goto:",]!mPPPPPPPPPPPPPPPPP!nPP!v#v#|$`#|$c$f$j$nP%VPPP!v%Y%^%a%{&O%a&R&U&X&_&b%aP&e&{&e'O'RPP']'a'g'm's'y(XPPPPPPPP(_)e*X+c,VUaObcR#e!c!{ROPQSTUXY_bcdehknrtvz!O!U!W!_!b!c!f!h!k!l!s!u!|#Q#R#S#W#c#k#p#x#{$Z$]QmPR!qnqfPQThknrtv!k!l!s!u#R#k#pR!gdR!ieTlPnTjPnSiPnSqQvQ{TQ!mkQ!trQ!vtR#y#RR!nkTsQvR!wt!RWOSUXY_bcz!O!U!W!_!b!c!|#Q#S#W#c#x#{$Z$]RySR#t!|R|TR|UQ!PUR#|#SR#z#RR#z#SyZOSU_bcz!O!_!b!c!|#Q#S#W#c#x#{$Z$]R!VXR!XYa]O^abc!a!c!eT!da!eQnPR!rnQvQR!{vQ!}yR#u!}Q#T|R#}#TW^Obc!cS!^^!aT!aa!eQ!eaR#f!eW`Obc!cQxSS}U#SQ!`_Q#PzQ#V!OQ#b!_Q#d!bQ#s!|Q#w#QQ$P#WQ$V#cQ$Y#xQ$[#{Q$a$ZR$b$]xZOSU_bcz!O!_!b!c!|#Q#S#W#c#x#{$Z$]Q!VXQ!XYQ#[!UR#]!W!QWOSUXY_bcz!O!U!W!_!b!c!|#Q#S#W#c#x#{$Z$]pfPQThknrtv!k!l!s!u#R#k#pQ!gdQ!ieQ#g!fR#h!hSgPn^pQTkrtv#RQ!jhQ#i!kQ#j!lQ#n!sQ#o!uQ$W#kR$X#pQuQR!zv",nodeNames:"⚠ DirectiveEnd DocEnd - - ? ? ? Literal QuotedLiteral Anchor Alias Tag BlockLiteralContent Comment Stream BOM Document ] [ FlowSequence Item Tagged Anchored Anchored Tagged FlowMapping Pair Key : Pair , } { FlowMapping Pair Pair BlockSequence Item Item BlockMapping Pair Pair Key Pair Pair BlockLiteral BlockLiteralHeader Tagged Anchored Anchored Tagged Directive DirectiveName DirectiveContent Document",maxTerm:74,context:$w,nodeProps:[["isolate",-3,8,9,14,""],["openedBy",18,"[",32,"{"],["closedBy",19,"]",33,"}"]],propSources:[Rw],skippedNodes:[0],repeatNodeCount:6,tokenData:"-Y~RnOX#PXY$QYZ$]Z]#P]^$]^p#Ppq$Qqs#Pst$btu#Puv$yv|#P|}&e}![#P![!]'O!]!`#P!`!a'i!a!}#P!}#O*g#O#P#P#P#Q+Q#Q#o#P#o#p+k#p#q'i#q#r,U#r;'S#P;'S;=`#z<%l?HT#P?HT?HU,o?HUO#PQ#UU!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PQ#kTOY#PZs#Pt;'S#P;'S;=`#z<%lO#PQ#}P;=`<%l#P~$VQ!f~XY$Qpq$Q~$bO!g~~$gS^~OY$bZ;'S$b;'S;=`$s<%lO$b~$vP;=`<%l$bR%OX!WQOX%kXY#PZ]%k]^#P^p%kpq#hq;'S%k;'S;=`&_<%lO%kR%rX!WQ!VPOX%kXY#PZ]%k]^#P^p%kpq#hq;'S%k;'S;=`&_<%lO%kR&bP;=`<%l%kR&lUoP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR'VUmP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR'p[!PP!WQOY#PZp#Ppq#hq{#P{|(f|}#P}!O(f!O!R#P!R![)p![;'S#P;'S;=`#z<%lO#PR(mW!PP!WQOY#PZp#Ppq#hq!R#P!R![)V![;'S#P;'S;=`#z<%lO#PR)^U!PP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR)wY!PP!WQOY#PZp#Ppq#hq{#P{|)V|}#P}!O)V!O;'S#P;'S;=`#z<%lO#PR*nUcP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR+XUbP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR+rUqP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR,]UpP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR,vU`P!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#P",tokenizers:[Pw,Tw,_w,Bw,0,1],topRules:{Stream:[0,15]},tokenPrec:0}),Iw=Tr.define({name:"yaml",parser:Lw.configure({props:[au.add({Stream:t=>{for(let e=t.node.resolve(t.pos,-1);e&&e.to>=t.pos;e=e.parent){if(e.name=="BlockLiteralContent"&&e.from<e.to)return t.baseIndentFor(e);if(e.name=="BlockLiteral")return t.baseIndentFor(e)+t.unit;if(e.name=="BlockSequence"||e.name=="BlockMapping")return t.column(e.firstChild.from,1);if(e.name=="QuotedLiteral")return null;if(e.name=="Literal"){let i=t.column(e.from,1);if(i==t.lineIndent(e.from,1))return i;if(e.to>t.pos)return null}}return null},FlowMapping:xh({closing:"}"}),FlowSequence:xh({closing:"]"})}),hu.add({"FlowMapping FlowSequence":_v,"Item Pair BlockLiteral":(t,e)=>({from:e.doc.lineAt(t.from).to,to:t.to})})]}),languageData:{commentTokens:{line:"#"},indentOnInput:/^\s*[\]\}]$/}});function Fw(){return new kv(Iw)}const Nw="#e5c07b",od="#e06c75",zw="#56b6c2",Hw="#ffffff",dr="#abb2bf",Za="#7d8799",Ww="#61afef",Uw="#98c379",ad="#d19a66",qw="#c678dd",Vw="#21252b",ld="#2c313a",cd="#282c34",Go="#353a42",Qw="#3E4451",hd="#528bff",jw=_.theme({"&":{color:dr,backgroundColor:cd},".cm-content":{caretColor:hd},".cm-cursor, .cm-dropCursor":{borderLeftColor:hd},"&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":{backgroundColor:Qw},".cm-panels":{backgroundColor:Vw,color:dr},".cm-panels.cm-panels-top":{borderBottom:"2px solid black"},".cm-panels.cm-panels-bottom":{borderTop:"2px solid black"},".cm-searchMatch":{backgroundColor:"#72a1ff59",outline:"1px solid #457dff"},".cm-searchMatch.cm-searchMatch-selected":{backgroundColor:"#6199ff2f"},".cm-activeLine":{backgroundColor:"#6699ff0b"},".cm-selectionMatch":{backgroundColor:"#aafe661a"},"&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket":{backgroundColor:"#bad0f847"},".cm-gutters":{backgroundColor:cd,color:Za,border:"none"},".cm-activeLineGutter":{backgroundColor:ld},".cm-foldPlaceholder":{backgroundColor:"transparent",border:"none",color:"#ddd"},".cm-tooltip":{border:"none",backgroundColor:Go},".cm-tooltip .cm-tooltip-arrow:before":{borderTopColor:"transparent",borderBottomColor:"transparent"},".cm-tooltip .cm-tooltip-arrow:after":{borderTopColor:Go,borderBottomColor:Go},".cm-tooltip-autocomplete":{"& > ul > li[aria-selected]":{backgroundColor:ld,color:dr}}},{dark:!0}),Kw=An.define([{tag:w.keyword,color:qw},{tag:[w.name,w.deleted,w.character,w.propertyName,w.macroName],color:od},{tag:[w.function(w.variableName),w.labelName],color:Ww},{tag:[w.color,w.constant(w.name),w.standard(w.name)],color:ad},{tag:[w.definition(w.name),w.separator],color:dr},{tag:[w.typeName,w.className,w.number,w.changed,w.annotation,w.modifier,w.self,w.namespace],color:Nw},{tag:[w.operator,w.operatorKeyword,w.url,w.escape,w.regexp,w.link,w.special(w.string)],color:zw},{tag:[w.meta,w.comment],color:Za},{tag:w.strong,fontWeight:"bold"},{tag:w.emphasis,fontStyle:"italic"},{tag:w.strikethrough,textDecoration:"line-through"},{tag:w.link,color:Za,textDecoration:"underline"},{tag:w.heading,fontWeight:"bold",color:od},{tag:[w.atom,w.bool,w.special(w.variableName)],color:ad},{tag:[w.processingInstruction,w.string,w.inserted],color:Uw},{tag:w.invalid,color:Hw}]),Xw=[jw,yu(Kw)];var Jw=Object.defineProperty,Yw=Object.getOwnPropertyDescriptor,Xl=(t,e,i,s)=>{for(var n=s>1?void 0:s?Yw(e,i):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(n=(s?o(e,i,n):o(n))||n);return s&&n&&Jw(e,i,n),n};function el(t){if(!t.includes("external_components:")||!t.includes("type: local")||!t.includes("/opt/esp-tree/components"))return!1;const e=t.match(/components:\s*\[([^\]]*)\]/);if(!e)return!1;const i=e[1];return!(!i.includes("esp_tree_common")||!i.includes("esp_tree_remote")&&!i.includes("esp_tree_bridge")&&!i.includes("espnow_82xx_remote"))}function dd(t){const e=[];return/(^|\s)!include\s/m.test(t)&&e.push("This config uses !include which is not supported. ESPHome compile will fail — only single-file configs are allowed."),/(^|\s)packages:/m.test(t)&&e.push("This config uses packages: which is not supported in V1. Each device must be a single YAML file."),el(t)||e.push("ESP-Tree external components are not configured. See the required configuration when saving or compiling."),e}let vn=class extends he{constructor(){super(...arguments),this.value="",this.readonly=!1,this.editorView=null,this._resizeObserver=null}disconnectedCallback(){this.destroyEditor(),super.disconnectedCallback()}destroyEditor(){this._resizeObserver&&(this._resizeObserver.disconnect(),this._resizeObserver=null),this.editorView&&(this.editorView.destroy(),this.editorView=null)}initEditor(){var i;this.destroyEditor();const t=(i=this.shadowRoot)==null?void 0:i.querySelector(".editor-container");if(!t)return;const e=j.create({doc:this.value,extensions:[G1,Fw(),Xw,j.readOnly.of(this.readonly),_.updateListener.of(s=>{s.docChanged&&(this.value=s.state.doc.toString(),this.dispatchEvent(new CustomEvent("content-change",{detail:{content:this.value,warnings:dd(this.value)},bubbles:!0,composed:!0})))})]});this.editorView=new _({state:e,parent:t}),this._resizeObserver=new ResizeObserver(()=>{var s;(s=this.editorView)==null||s.requestMeasure()}),this._resizeObserver.observe(t)}updated(t){t.has("readonly")?this.initEditor():this.editorView&&t.has("value")&&!t.get("value")&&this.initEditor()}firstUpdated(){this.initEditor()}getContent(){var t;return((t=this.editorView)==null?void 0:t.state.doc.toString())??this.value}getWarnings(){return dd(this.getContent())}render(){return g`<div class="editor-container"></div>`}};vn.styles=we`
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
  `;Xl([Q({type:String})],vn.prototype,"value",2);Xl([Q({type:Boolean})],vn.prototype,"readonly",2);vn=Xl([ke("esp-config-editor")],vn);var Gw=Object.defineProperty,Zw=Object.getOwnPropertyDescriptor,ae=(t,e,i,s)=>{for(var n=s>1?void 0:s?Zw(e,i):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(n=(s?o(e,i,n):o(n))||n);return s&&n&&Gw(e,i,n),n};const ek=new Set(["queued","starting","announcing","transferring","verifying","transfer_success_waiting_rejoin"]),tk=new Set(["success","failed","aborted","rejoin_timeout","version_mismatch"]);function ik(t){const e=t.trim().toUpperCase().replace(/\s+/g,"");if(!e)return null;const i=["ESP8266","ESP32-C61","ESP32-C6","ESP32-C5","ESP32-C3","ESP32-C2","ESP32-H2","ESP32-P4","ESP32-S3","ESP32-S2","ESP32"];for(const s of i){const n=s.replace(/-/g,"");if(e.includes(s)||e.includes(n))return s}return null}function sk(t){const e=t||"";if(/^\s*esp8266\s*:/m.test(e))return"ESP8266";if(!/^\s*esp32\s*:/m.test(e))return null;const i=e.match(/^\s*variant\s*:\s*["']?([A-Za-z0-9_-]+)["']?\s*$/m),s=((i==null?void 0:i[1])||"").toUpperCase().replace(/_/g,"-");return s?s.includes("ESP32-C61")?"ESP32-C61":s.includes("ESP32-C6")?"ESP32-C6":s.includes("ESP32-C5")?"ESP32-C5":s.includes("ESP32-C3")?"ESP32-C3":s.includes("ESP32-C2")?"ESP32-C2":s.includes("ESP32-H2")?"ESP32-H2":s.includes("ESP32-P4")?"ESP32-P4":s.includes("ESP32-S3")?"ESP32-S3":s.includes("ESP32-S2")?"ESP32-S2":"ESP32":"ESP32"}let ne=class extends he{constructor(){super(...arguments),this.mac="",this.state="loading",this.device=null,this.config=null,this.editorContent="",this.saveIndicator="",this.hasUnsavedChanges=!1,this.error="",this.compilePhase="idle",this.topology=[],this.compileJobId=null,this.compileQueuePosition=null,this.preflight=null,this.chipUnknown=!1,this.yamlWarnings=[],this.showExternalComponentsFix=!1,this.showSecretsWarning=!1,this.missingSecrets=[],this.pendingAction=null,this.pendingAutoFlash=!1,this.showCompileLog=!0,this.compileStartedAt=null,this.flashIntent="none",this.browserFlashManifestUrl="",this.browserFlashFirmwareBlobUrl="",this.elapsedTimer=null,this.pollTimer=null,this.devicePollTimer=null}connectedCallback(){super.connectedCallback(),this.load()}disconnectedCallback(){this.stopPolling(),this.stopDevicePolling(),super.disconnectedCallback()}startPolling(){this.pollTimer||(this.pollTimer=setInterval(()=>this.pollCompileStatus(),2e3))}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}stopCompileLogViewer(){this.compileLogViewer&&(this.compileLogViewer.stopped=!0)}startDevicePolling(){this.devicePollTimer||(this.devicePollTimer=setInterval(()=>void this.pollDevice(),3e4))}stopDevicePolling(){this.devicePollTimer&&(clearInterval(this.devicePollTimer),this.devicePollTimer=null)}async pollDevice(){try{const t=await C.device(this.mac);this.device=t||{}}catch{}}get isCompilingActive(){return this.compilePhase==="compiling"||this.compilePhase==="compile_queued"}get browserSupportsUsbFlash(){return typeof window<"u"&&window.isSecureContext&&"serial"in navigator}get browserFlashChipFamily(){var e,i;const t=String(((e=this.preflight)==null?void 0:e.chip.new)||((i=this.device)==null?void 0:i.chip_name)||"");return ik(t)||sk(this.editorContent)}getElapsedTime(){if(!this.compileStartedAt)return"00:00";const t=Math.floor((Date.now()-this.compileStartedAt)/1e3),e=Math.floor(t/60).toString().padStart(2,"0"),i=(t%60).toString().padStart(2,"0");return`${e}:${i}`}startElapsedTimer(){this.stopElapsedTimer(),this.elapsedTimer=setInterval(()=>this.requestUpdate(),1e3)}stopElapsedTimer(){this.elapsedTimer&&(clearInterval(this.elapsedTimer),this.elapsedTimer=null)}async load(){this.state="loading";try{const[t,e,i]=await Promise.all([C.device(this.mac).catch(()=>null),C.getConfig(this.mac).catch(()=>null),C.topology().catch(()=>[])]);this.device=t||{},this.topology=i,this.startDevicePolling(),e&&e.has_config?(this.config=e,this.editorContent=this.config.content,this.hasUnsavedChanges=!1,this.state="editor"):this.state="no_config",await this.pollCompileStatus()}catch{this.state="no_config"}}clearBrowserFlashManifestUrl(){this.browserFlashManifestUrl&&(URL.revokeObjectURL(this.browserFlashManifestUrl),this.browserFlashManifestUrl=""),this.browserFlashFirmwareBlobUrl&&(URL.revokeObjectURL(this.browserFlashFirmwareBlobUrl),this.browserFlashFirmwareBlobUrl="")}async updateBrowserFlashManifestUrl(){var e,i,s,n;if(this.compilePhase!=="compiled")return;const t=this.browserFlashChipFamily;if(!t){this.clearBrowserFlashManifestUrl();return}try{const r=C.downloadFactoryBinary(this.mac),o=await fetch(r);if(!o.ok){this.clearBrowserFlashManifestUrl();return}const a=await o.blob(),l=URL.createObjectURL(a),c={name:String(((e=this.device)==null?void 0:e.esphome_name)||((i=this.device)==null?void 0:i.label)||this.mac),version:String(((s=this.device)==null?void 0:s.project_version)||((n=this.device)==null?void 0:n.firmware_version)||"compiled"),new_install_prompt_erase:!0,builds:[{chipFamily:t,parts:[{path:l,offset:0}]}]},h=new Blob([JSON.stringify(c)],{type:"application/json"}),d=URL.createObjectURL(h);this.clearBrowserFlashManifestUrl(),this.browserFlashManifestUrl=d,this.browserFlashFirmwareBlobUrl=l}catch{this.clearBrowserFlashManifestUrl()}}async pollCompileStatus(){try{const t=await C.getCompileStatus(this.mac);t.status==="compile_queued"?(this.compilePhase="compile_queued",this.compileJobId=t.job_id,this.compileQueuePosition=t.queue_position,this.startPolling()):t.status==="compiling"?(this.compilePhase="compiling",this.compileJobId=t.job_id,this.compileQueuePosition=null,this.startPolling()):ek.has(t.status)?(this.compilePhase="queued_for_flash",this.compileJobId=t.job_id,this.compileQueuePosition=t.queue_position,this.flashIntent="ota",this.startPolling(),window.location.hash=`/device/${encodeURIComponent(this.mac)}`):t.status==="compiled"?(this.compilePhase="compiled",this.compileJobId=t.job_id,this.compileQueuePosition=null,this.stopElapsedTimer(),this.updateBrowserFlashManifestUrl(),this.stopPolling(),this.flashIntent==="ota"&&(window.location.hash=`/device/${encodeURIComponent(this.mac)}`)):tk.has(t.status)&&(this.compilePhase="idle",this.compileJobId=null,this.compileQueuePosition=null,this.compileStartedAt=null,this.flashIntent="none",this.clearBrowserFlashManifestUrl(),this.stopElapsedTimer(),this.stopPolling(),this.stopCompileLogViewer())}catch{}}async createScaffold(){try{const t=await C.saveConfig(this.mac,"",!0);this.config=t,this.editorContent=t.content,this.chipUnknown=t.chip_unknown??!1,this.state="editor"}catch(t){this.error=t instanceof Error?t.message:String(t)}}async importYaml(){const t=document.createElement("input");t.type="file",t.accept=".yaml,.yml",t.onchange=async()=>{var i;const e=(i=t.files)==null?void 0:i[0];if(e)try{const s=await C.importConfig(this.mac,e);this.config=s,this.editorContent=s.content,this.state="editor"}catch(s){this.error=s instanceof Error?s.message:String(s)}},t.click()}async saveConfig(t=!1){if(!t&&!el(this.editorContent)){this.pendingAction="save",this.showExternalComponentsFix=!0;return}this.saveIndicator="Saving...";try{const e=await C.saveConfig(this.mac,this.editorContent);this.config=e,this.hasUnsavedChanges=!1,this.saveIndicator="Saved ✓",setTimeout(()=>{this.saveIndicator="",this.requestUpdate()},2e3)}catch(e){this.saveIndicator="",this.error=e instanceof Error?e.message:String(e)}}onEditorChange(t){const e=t.detail;this.editorContent=e.content,this.yamlWarnings=e.warnings??[],this.hasUnsavedChanges=this.config?this.editorContent!==this.config.content:!0}get isBridgeDevice(){var t;return!!((t=this.device)!=null&&t.is_bridge)}get isEsp8266Device(){var e;const t=String(((e=this.device)==null?void 0:e.chip_name)??"");return t==="ESP8266"||t==="ESP-01"||t==="ESP-12E"}get remoteComponentName(){return this.isBridgeDevice?"esp_tree_bridge":this.isEsp8266Device?"espnow_82xx_remote":"esp_tree_remote"}get externalComponentsFixYaml(){return`external_components:
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
`);let n=this.findBlockEnd(s,/^esphome:\s*$/);n<0&&(n=0);const r=this.findBlockEnd(s,/^(esp32|esp8266):\s*$/,n);for(r>n&&(n=r);n<s.length&&s[n].trim()==="";)n++;s.splice(n,0,...e.split(`
`)),this.editorContent=s.join(`
`)}removeExternalComponentsBlock(t){const e=t.split(`
`),i=e.findIndex(n=>/^external_components:\s*$/.test(n));if(i<0)return t;let s=i+1;for(;s<e.length&&(e[s].startsWith(" ")||e[s].startsWith("	")||e[s].trim()==="")&&!(e[s].trim()===""&&s+1<e.length&&!e[s+1].startsWith(" ")&&!e[s+1].startsWith("	"));)s++;for(;s<e.length&&e[s].trim()==="";)s++;return e.splice(i,s-i),e.join(`
`)}findBlockEnd(t,e,i=0){const s=t.findIndex((r,o)=>o>=i&&e.test(r));if(s<0)return-1;let n=s+1;for(;n<t.length&&(t[n].startsWith(" ")||t[n].startsWith("	"));)n++;return n}async applyExternalComponentsFix(){this.showExternalComponentsFix=!1,this.insertExternalComponentsFix(),this.yamlWarnings=[],this.hasUnsavedChanges=!0,this.requestUpdate();const t=this.pendingAction,e=this.pendingAutoFlash;this.pendingAction=null,this.pendingAutoFlash=!1,t==="save"?await this.saveConfig(!0):t==="compile"&&await this.queueCompile(e,!0)}async dismissExternalComponentsFix(){this.showExternalComponentsFix=!1;const t=this.pendingAction,e=this.pendingAutoFlash;this.pendingAction=null,this.pendingAutoFlash=!1,t==="save"?await this.saveConfig(!0):t==="compile"&&await this.queueCompile(e,!0)}async dismissSecretsWarning(){this.showSecretsWarning=!1;const t=this.pendingAction,e=this.pendingAutoFlash;this.pendingAction=null,this.pendingAutoFlash=!1,t==="compile"&&await this.queueCompile(e,!0)}goToSecretsFromWarning(){this.showSecretsWarning=!1,this.goToSecrets()}async checkForMissingSecrets(){try{return(await C.checkSecrets(this.editorContent)).missing_secrets}catch{return[]}}async queueCompile(t,e=!1){if(!(this.compilePhase==="compiling"||this.compilePhase==="compile_queued")){if(!e){const i=await this.checkForMissingSecrets();if(i.length>0){this.missingSecrets=i,this.pendingAction="compile",this.pendingAutoFlash=t,this.showSecretsWarning=!0;return}}if(!e&&!el(this.editorContent)){this.pendingAction="compile",this.pendingAutoFlash=t,this.showExternalComponentsFix=!0;return}this.hasUnsavedChanges&&await this.saveConfig(!0),this.compilePhase="compiling",this.compileStartedAt=Date.now(),this.startElapsedTimer(),this.error="",this.showCompileLog=!0;try{const i=await C.compileDevice(this.mac,t);this.compileJobId=i.job.id,this.preflight=i.preflight||null,i.job.status==="compile_queued"?(this.compilePhase="compile_queued",this.compileQueuePosition=i.queue_position):i.job.status==="compiling"&&(this.compilePhase="compiling",this.compileQueuePosition=null),this.startPolling()}catch(i){this.compilePhase="failed",this.compileStartedAt=null,this.stopElapsedTimer(),this.error=i instanceof Error?i.message:String(i)}}}async triggerCompile(){this.flashIntent="none",await this.queueCompile(!1)}async triggerOtaFlash(){this.flashIntent="ota",await this.queueCompile(!0)}async triggerBrowserFlashFlow(){this.flashIntent="browser",await this.queueCompile(!1)}async cancelCompile(){try{await C.cancelCompile(this.mac)}catch{}this.compilePhase="idle",this.compileJobId=null,this.compileQueuePosition=null,this.compileStartedAt=null,this.flashIntent="none",this.clearBrowserFlashManifestUrl(),this.stopElapsedTimer(),this.stopPolling()}goBack(){window.location.hash=`/device/${encodeURIComponent(this.mac)}`}goToTopology(){window.location.hash="/"}goToSecrets(){window.location.hash=`/secrets?from=${encodeURIComponent(window.location.hash)}`}updated(t){(t.has("compilePhase")||t.has("device")||t.has("preflight"))&&this.updateBrowserFlashManifestUrl()}render(){var c,h,d,f,u;const t=String(((c=this.device)==null?void 0:c.esphome_name)||((h=this.device)==null?void 0:h.label)||this.mac),e=String(((d=this.device)==null?void 0:d.chip_name)||"-"),i=this.topology.find(p=>le(p.mac)===le(this.mac)),s=(i==null?void 0:i.online)??!!((f=this.device)!=null&&f.online),n=this.device,o=!!!(n!=null&&n.is_bridge)&&((n==null?void 0:n.hops)??0)>0,a=this.browserFlashChipFamily,l=this.compilePhase==="compiled"&&!!this.browserFlashManifestUrl;return g`
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
            `:v}
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
            `:v}
        <header class="config-header">
          <div class="back-buttons">
            <button class="back" @click=${this.goToTopology}>&#8592; Back to Topology</button>
            <button class="back" @click=${this.goBack}>&#8592; Back to Device Settings</button>
          </div>
          <div class="header-info">
            <h2>${t}${o?g`<span class="device-type-tag">Remote</span>`:v}</h2>
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
                  `:v}
                  <h3>No configuration yet for this device.</h3>
                  <div class="no-config-actions">
                    <button class="btn btn-primary" @click=${this.createScaffold}>Create Config</button>
                    <button class="btn" @click=${this.importYaml}>Import YAML</button>
                  </div>
                  <p class="hint">Create Config generates a minimal scaffold populated from this device's topology data.</p>
                  <p class="hint">Import lets you upload an existing YAML file.</p>
                  ${this.error?g`<p class="error">${this.error}</p>`:v}
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

                          ${this.yamlWarnings.length>0?g`<div class="yaml-warnings">${this.yamlWarnings.map(p=>g`<p>&#9888; ${p}</p>`)}</div>`:v}
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
                      `:v}

                  <div class="action-bar">
                    <button class="btn btn-primary" @click=${this.saveConfig} ?disabled=${this.compilePhase==="compiling"||this.compilePhase==="compile_queued"}>
                      ${this.saveIndicator||(this.hasUnsavedChanges?"Save":"Saved ✓")}
                    </button>
                    ${this.compilePhase==="idle"||this.compilePhase==="failed"||this.compilePhase==="compiled"?g`
                          <button class="btn btn-success" ?disabled=${!this.config} @click=${this.triggerCompile}>Compile</button>
                          <button class="btn btn-primary" ?disabled=${!this.config} @click=${this.triggerOtaFlash}>Compile and Flash (OTA)</button>
                          <button class="btn" ?disabled=${!this.config} @click=${this.triggerBrowserFlashFlow}>Compile and Flash (USB via Browser)</button>
                        `:this.compilePhase==="compiling"||this.compilePhase==="compile_queued"?g`<button class="btn btn-danger" @click=${this.cancelCompile}>Cancel</button>`:v}
                  </div>

                  <div class="browser-flash-panel">
                    ${l?g`
                          <div class="browser-flash-actions">
                            <esp-web-install-button manifest=${this.browserFlashManifestUrl}>
                              <button slot="activate" class="btn btn-primary">Flash via Browser USB</button>
                              <span slot="unsupported">Open this page in Chrome or Edge over HTTPS to use browser USB flashing.</span>
                              <span slot="not-allowed">Browser USB flashing requires a secure HTTPS page.</span>
                            </esp-web-install-button>
                            <a class="btn" href=${C.downloadFactoryBinary(this.mac)} download>Download factory .bin</a>
                          </div>
                        `:g`
                          <div class="browser-flash-hint">
                            ${this.compilePhase==="compiled"&&!a?g`<p>Browser USB flash is unavailable because the chip family could not be determined for this build.</p>`:this.browserSupportsUsbFlash?g`<p>Compile the device first, then flash the resulting firmware through your browser here.</p>`:g`<p>Browser USB flash requires Chrome or Edge with Web Serial on an HTTPS page.</p>`}
                            <a class="btn" href=${C.downloadFactoryBinary(this.mac)} download ?hidden=${this.compilePhase!=="compiled"}>Download factory .bin</a>
                          </div>
                        `}
                  </div>

                  ${this.compilePhase==="compiling"?g`<p class="status-line">Status: compiling... <button class="cancel-link" @click=${this.cancelCompile}>Cancel</button></p>`:this.compilePhase==="compile_queued"?g`<p class="status-line">Status: waiting to compile (#${this.compileQueuePosition!==null?this.compileQueuePosition:"?"})</p>`:this.compilePhase==="queued_for_flash"?g`<p class="status-line">Status: OTA flash queued or running${this.compileQueuePosition!==null?` (#${this.compileQueuePosition})`:""}</p>`:g`<p class="status-line">Status: ${this.hasUnsavedChanges?"unsaved":"saved"}</p>`}

                  ${this.error&&this.compilePhase!=="compiling"?g`<p class="error">${this.error}</p>`:v}

                  ${this.compilePhase==="compiled"?g`
                        <div class="success-section">
                          <div class="success-banner">&#10003; Build successful</div>
                          <p class="build-info">${t} &middot; ready for flash</p>
                          ${(u=this.preflight)!=null&&u.has_warnings?g`
                                <div class="warnings">
                                  ${this.preflight.warnings.map(p=>g`<p>${p}</p>`)}
                                </div>
                              `:v}
                          ${this.flashIntent==="browser"?g`<p class="hint">Build complete. Connect the device by USB and use the browser flash control above.</p>`:g`<p class="hint">Firmware compiled. Use OTA or browser USB flash from the action bar above.</p>`}
                          <div class="download-links">
                            <a class="btn" href=${C.downloadFactoryBinary(this.mac)} download>Download .bin</a>
                            <a class="btn" href=${C.downloadCompileBinary(this.mac)} download>Download .ota.bin</a>
                          </div>
                        </div>
                      `:v}

                  ${this.compilePhase==="failed"?g`
                        <div class="fail-section">
                          <div class="fail-banner">
                            <span>&#10007; Build failed</span>
                            ${this.showCompileLog?g`<button class="close-logs-link" @click=${()=>{this.showCompileLog=!1}}>Hide logs</button>`:g`<button class="close-logs-link" @click=${()=>{this.showCompileLog=!0}}>Show logs</button>`}
                          </div>
                          <p class="hint">Fix the YAML above and try again. <button class="btn-link" @click=${this.cancelCompile}>Cancel</button></p>
                        </div>
                      `:v}
                `:v}
      </div>
    `}};ne.styles=we`
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
  `;ae([Q({type:String})],ne.prototype,"mac",2);ae([y()],ne.prototype,"state",2);ae([y()],ne.prototype,"device",2);ae([y()],ne.prototype,"config",2);ae([y()],ne.prototype,"editorContent",2);ae([y()],ne.prototype,"saveIndicator",2);ae([y()],ne.prototype,"hasUnsavedChanges",2);ae([y()],ne.prototype,"error",2);ae([y()],ne.prototype,"compilePhase",2);ae([y()],ne.prototype,"topology",2);ae([y()],ne.prototype,"compileJobId",2);ae([y()],ne.prototype,"compileQueuePosition",2);ae([y()],ne.prototype,"preflight",2);ae([y()],ne.prototype,"chipUnknown",2);ae([y()],ne.prototype,"yamlWarnings",2);ae([y()],ne.prototype,"showExternalComponentsFix",2);ae([y()],ne.prototype,"showSecretsWarning",2);ae([y()],ne.prototype,"missingSecrets",2);ae([y()],ne.prototype,"showCompileLog",2);ae([y()],ne.prototype,"compileStartedAt",2);ae([y()],ne.prototype,"flashIntent",2);ae([y()],ne.prototype,"browserFlashManifestUrl",2);ae([Od("esp-compile-log-viewer")],ne.prototype,"compileLogViewer",2);ne=ae([ke("esp-config-page")],ne);var nk=Object.defineProperty,rk=Object.getOwnPropertyDescriptor,$s=(t,e,i,s)=>{for(var n=s>1?void 0:s?rk(e,i):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(n=(s?o(e,i,n):o(n))||n);return s&&n&&nk(e,i,n),n};let pi=class extends he{constructor(){super(...arguments),this.from="/",this.content="",this.saved=!1,this.loading=!0,this.error=""}connectedCallback(){super.connectedCallback(),this.load()}async load(){this.loading=!0;try{const t=await C.getSecrets();this.content=t.content,this.error=""}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.loading=!1}}async save(){this.saved=!1;try{await C.saveSecrets(this.content),this.saved=!0,this.error="",setTimeout(()=>{this.saved=!1,this.requestUpdate()},2e3)}catch(t){this.error=t instanceof Error?t.message:String(t)}}onInput(t){this.content=t.target.value}goBack(){window.location.hash=this.from}render(){const t=this.from==="/"?"topology":"device config";return g`
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
              ${this.saved?g`<span class="saved">Saved &#10003;</span>`:v}
              ${this.error?g`<span class="error">${this.error}</span>`:v}
            </div>
            <div class="warnings">
              <p>&#9888; These secrets are stored in plaintext. Access is protected by Home Assistant ingress authentication.</p>
              <p>&#9888; Missing keys referenced by device configs will cause compile failures.</p>
            </div>
          `}
    `}};pi.styles=we`
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
  `;$s([Q({type:String})],pi.prototype,"from",2);$s([y()],pi.prototype,"content",2);$s([y()],pi.prototype,"saved",2);$s([y()],pi.prototype,"loading",2);$s([y()],pi.prototype,"error",2);pi=$s([ke("esp-secrets-page")],pi);var ok=Object.defineProperty,ak=Object.getOwnPropertyDescriptor,yi=(t,e,i,s)=>{for(var n=s>1?void 0:s?ak(e,i):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(n=(s?o(e,i,n):o(n))||n);return s&&n&&ok(e,i,n),n};const lk={compile_queued:"Queued for compile",compiling:"Compiling",compile_success:"Compile success",queued:"Queued for flash",starting:"Starting",announcing:"Waiting for device accept",transferring:"Transferring",verifying:"Verifying",transfer_success_waiting_rejoin:"Waiting for device rejoin",success:"Success",failed:"Failed",aborted:"Aborted",rejoin_timeout:"Rejoin timeout",version_mismatch:"Version mismatch"},ck={compile_queued:"⚙",compile_dequeued:"⚙",compiling:"⚙",compile_success:"✅",compile_failed:"❌",compile_output:"📋",compile_cancelled:"❌",flash_queued:"📦",flash_dequeued:"📦",flash_starting:"▶",flash_announcing:"⏳",flash_transferring:"📤",flash_progress:"📈",flash_verifying:"✅",flash_rejoin_waiting:"⏳",flash_rejoined:"🔄",flash_version_mismatch:"⚠",flash_rejoin_timeout:"⏰",flash_success:"✅",flash_failed:"❌",flash_aborted:"🛑",flash_start_failed:"❌",dequeue_retry:"🔄",dequeue_moved_back:"🔄",ota_start_retry:"🔄"},hk=["compile_success","success","failed","aborted","rejoin_timeout","version_mismatch"];let _t=class extends he{constructor(){super(...arguments),this.jobId=0,this.from="/queue",this.job=null,this.logData=null,this.error="",this.loading=!0,this.expandedOutput=new Set,this.pollTimer=null}connectedCallback(){super.connectedCallback()}disconnectedCallback(){this.stopPolling(),super.disconnectedCallback()}updated(t){t.has("jobId")&&this.jobId&&(this.loading=!0,this.error="",this.fetchLog())}startPolling(){this.pollTimer||(this.pollTimer=setInterval(()=>this.fetchLog(),2e3))}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}async fetchJob(){var t;if(this.jobId)try{const e=(t=this.logData)==null?void 0:t.mac;if(e){const s=(await C.history(e)).jobs.find(n=>n.id===this.jobId);this.job=s||null}}catch{}}async fetchLog(){var t,e;if(this.jobId)try{this.logData=await C.jobLog(this.jobId),this.loading=!1,!this.job&&((t=this.logData)!=null&&t.mac)&&await this.fetchJob(),(e=this.logData)!=null&&e.is_terminal?this.stopPolling():this.startPolling()}catch(i){this.error=i instanceof Error?i.message:String(i),this.loading=!1,this.stopPolling()}}toggleOutput(t){const e=new Set(this.expandedOutput);e.has(t)?e.delete(t):e.add(t),this.expandedOutput=e}formatEventTime(t){return new Date(t*1e3).toLocaleTimeString()}renderEvent(t,e){const i=ck[t.type]||"•",s=this.formatEventTime(t.ts),n=t.type==="compile_output",r=this.expandedOutput.has(e),a={compile_success:"ok",flash_success:"ok",compile_failed:"danger",flash_failed:"danger",flash_aborted:"danger",flash_version_mismatch:"warn",flash_rejoin_timeout:"warn"}[t.type]||"";return g`
      <div class="event ${n?"event-output":""} ${a}">
        <div class="event-header" @click=${n?(()=>this.toggleOutput(e)):void 0}>
          <span class="event-icon">${i}</span>
          <span class="event-time">${s}</span>
          <span class="event-type">${t.type.replaceAll("_"," ")}</span>
          ${t.percent!=null?g`<span class="event-detail">${t.percent}%</span>`:v}
          ${t.error?g`<span class="event-error">${t.error}</span>`:v}
          ${t.reason?g`<span class="event-detail">${t.reason}</span>`:v}
          ${t.esphome_name?g`<span class="event-detail">${t.esphome_name}</span>`:v}
          ${t.firmware_name?g`<span class="event-detail">${t.firmware_name}</span>`:v}
          ${t.duration_s!=null?g`<span class="event-detail">took ${dt(t.duration_s)}</span>`:v}
          ${t.current_md5?g`<span class="event-detail">current running firmware MD5: ${t.current_md5}</span>`:v}
          ${t.md5?g`<span class="event-detail">New firmware MD5: ${t.md5}</span>`:v}
          ${t.rejoined_md5&&t.expected_md5?g`<span class="event-detail">running firmware MD5: ${t.rejoined_md5} expected MD5: ${t.expected_md5}</span>`:v}
          ${t.rejoined_md5&&!t.expected_md5?g`<span class="event-detail">running firmware MD5: ${t.rejoined_md5}</span>`:v}
          ${t.expected_md5&&!t.rejoined_md5?g`<span class="event-detail">expected MD5: ${t.expected_md5}</span>`:v}
          ${t.md5_match?g`<span class="event-tag ${t.md5_match==="match"?"ok":"warn"}">MD5 ${t.md5_match}</span>`:v}
          ${n?g`<span class="toggle">${r?"hide":"show output"}</span>`:v}
        </div>
        ${n&&r?g`<pre class="compile-output">${t.output||""}</pre>`:v}
      </div>
    `}render(){const t=this.logData,e=this.job,i=(t==null?void 0:t.log_events)||[],s=(t==null?void 0:t.status)||(e==null?void 0:e.status)||"",n=(t==null?void 0:t.is_terminal)??(e?hk.includes(e.status):!1),r=(e==null?void 0:e.parsed_esphome_name)||(e==null?void 0:e.esphome_name)||(e==null?void 0:e.firmware_name)||"Firmware",o=this.from||"/queue",a=o.startsWith("/device/")?"Device":o==="/queue"?"Queue":o.replace(/^\//,"");return g`
      <section>
        <div class="title-row">
          <a class="back-link" href="#${o}">&larr; ${a}</a>
          <div>
            <h2>${r}</h2>
          </div>
        </div>

        ${this.error?g`<p class="error">${this.error}</p>`:v}

        ${e?g`
          <div class="meta">
            <div class="meta-item">
              <small>Status</small>
              <span class="status-chip ${s}">${lk[s]||s.replaceAll("_"," ")}</span>
            </div>
            <div class="meta-item">
              <small>Device</small>
              <span>${e.mac}</span>
            </div>
            <div class="meta-item">
              <small>Size</small>
              <span>${_i(e.firmware_size)}</span>
            </div>
            ${e.started_at?g`
              <div class="meta-item">
                <small>Started</small>
                <span>${us(e.started_at)}</span>
              </div>
            `:v}
            ${e.completed_at?g`
              <div class="meta-item">
                <small>Completed</small>
                <span>${us(e.completed_at)}</span>
              </div>
            `:v}
            ${e.started_at&&e.completed_at?g`
              <div class="meta-item">
                <small>Duration</small>
                <span>${dt(e.completed_at-e.started_at)}</span>
              </div>
            `:v}
            ${e.error_msg?g`
              <div class="meta-item meta-full">
                <small>Error</small>
                <span class="error">${e.error_msg}</span>
              </div>
            `:v}
          </div>
        `:v}

        ${n?v:g`<div class="live-indicator">Live<span class="pulse"></span></div>`}

        <div class="log-header">
          <span class="label">Event Log</span>
          <span class="count">${i.length} events</span>
        </div>
        <div class="log-body">
          ${this.loading?g`<span class="empty">Loading...</span>`:i.length===0?g`<span class="empty">No events recorded for this job.</span>`:i.map((l,c)=>this.renderEvent(l,c))}
        </div>
      </section>
    `}};_t.styles=we`
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
  `;yi([Q({type:Number})],_t.prototype,"jobId",2);yi([Q({type:String})],_t.prototype,"from",2);yi([y()],_t.prototype,"job",2);yi([y()],_t.prototype,"logData",2);yi([y()],_t.prototype,"error",2);yi([y()],_t.prototype,"loading",2);yi([y()],_t.prototype,"expandedOutput",2);_t=yi([ke("esp-job-page")],_t);var dk=Object.defineProperty,fk=Object.getOwnPropertyDescriptor,Ps=(t,e,i,s)=>{for(var n=s>1?void 0:s?fk(e,i):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(n=(s?o(e,i,n):o(n))||n);return s&&n&&dk(e,i,n),n};let gi=class extends he{constructor(){super(...arguments),this.logs=[],this.error="",this.loading=!0,this.fullscreen=!1,this.connected=!1,this.eventSource=null,this.handleFullscreenChange=()=>{this.fullscreen=!!document.fullscreenElement}}connectedCallback(){super.connectedCallback(),this.connect()}connect(){this.disconnect(),this.loading=!0,this.error="",this.logs=[],this.eventSource=C.activityLog(t=>{this.logs=[t,...this.logs],this.loading=!1,this.connected=!0,this.requestUpdate()},()=>{this.loading=!1},t=>{this.loading=!1,this.logs.length===0&&(this.error="Could not load activity log")})}disconnect(){this.eventSource&&(this.eventSource.close(),this.eventSource=null,this.connected=!1)}clearLogs(){this.logs=[]}downloadLog(){const t=this.logs.join(`
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
    `}};gi.styles=we`
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
  `;Ps([y()],gi.prototype,"logs",2);Ps([y()],gi.prototype,"error",2);Ps([y()],gi.prototype,"loading",2);Ps([y()],gi.prototype,"fullscreen",2);Ps([y()],gi.prototype,"connected",2);gi=Ps([ke("esp-activity-log-page")],gi);/*! js-yaml 4.1.1 https://github.com/nodeca/js-yaml @license MIT */function Tp(t){return typeof t>"u"||t===null}function uk(t){return typeof t=="object"&&t!==null}function pk(t){return Array.isArray(t)?t:Tp(t)?[]:[t]}function gk(t,e){var i,s,n,r;if(e)for(r=Object.keys(e),i=0,s=r.length;i<s;i+=1)n=r[i],t[n]=e[n];return t}function mk(t,e){var i="",s;for(s=0;s<e;s+=1)i+=t;return i}function bk(t){return t===0&&Number.NEGATIVE_INFINITY===1/t}var vk=Tp,yk=uk,xk=pk,wk=mk,kk=bk,Sk=gk,Le={isNothing:vk,isObject:yk,toArray:xk,repeat:wk,isNegativeZero:kk,extend:Sk};function Mp(t,e){var i="",s=t.reason||"(unknown reason)";return t.mark?(t.mark.name&&(i+='in "'+t.mark.name+'" '),i+="("+(t.mark.line+1)+":"+(t.mark.column+1)+")",!e&&t.mark.snippet&&(i+=`

`+t.mark.snippet),s+" "+i):s}function yn(t,e){Error.call(this),this.name="YAMLException",this.reason=t,this.mark=e,this.message=Mp(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack||""}yn.prototype=Object.create(Error.prototype);yn.prototype.constructor=yn;yn.prototype.toString=function(e){return this.name+": "+Mp(this,e)};var Wt=yn;function Zo(t,e,i,s,n){var r="",o="",a=Math.floor(n/2)-1;return s-e>a&&(r=" ... ",e=s-a+r.length),i-s>a&&(o=" ...",i=s+a-o.length),{str:r+t.slice(e,i).replace(/\t/g,"→")+o,pos:s-e+r.length}}function ea(t,e){return Le.repeat(" ",e-t.length)+t}function Ck(t,e){if(e=Object.create(e||null),!t.buffer)return null;e.maxLength||(e.maxLength=79),typeof e.indent!="number"&&(e.indent=1),typeof e.linesBefore!="number"&&(e.linesBefore=3),typeof e.linesAfter!="number"&&(e.linesAfter=2);for(var i=/\r?\n|\r|\0/g,s=[0],n=[],r,o=-1;r=i.exec(t.buffer);)n.push(r.index),s.push(r.index+r[0].length),t.position<=r.index&&o<0&&(o=s.length-2);o<0&&(o=s.length-1);var a="",l,c,h=Math.min(t.line+e.linesAfter,n.length).toString().length,d=e.maxLength-(e.indent+h+3);for(l=1;l<=e.linesBefore&&!(o-l<0);l++)c=Zo(t.buffer,s[o-l],n[o-l],t.position-(s[o]-s[o-l]),d),a=Le.repeat(" ",e.indent)+ea((t.line-l+1).toString(),h)+" | "+c.str+`
`+a;for(c=Zo(t.buffer,s[o],n[o],t.position,d),a+=Le.repeat(" ",e.indent)+ea((t.line+1).toString(),h)+" | "+c.str+`
`,a+=Le.repeat("-",e.indent+h+3+c.pos)+`^
`,l=1;l<=e.linesAfter&&!(o+l>=n.length);l++)c=Zo(t.buffer,s[o+l],n[o+l],t.position-(s[o]-s[o+l]),d),a+=Le.repeat(" ",e.indent)+ea((t.line+l+1).toString(),h)+" | "+c.str+`
`;return a.replace(/\n$/,"")}var Ok=Ck,Ak=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],$k=["scalar","sequence","mapping"];function Pk(t){var e={};return t!==null&&Object.keys(t).forEach(function(i){t[i].forEach(function(s){e[String(s)]=i})}),e}function Tk(t,e){if(e=e||{},Object.keys(e).forEach(function(i){if(Ak.indexOf(i)===-1)throw new Wt('Unknown option "'+i+'" is met in definition of "'+t+'" YAML type.')}),this.options=e,this.tag=t,this.kind=e.kind||null,this.resolve=e.resolve||function(){return!0},this.construct=e.construct||function(i){return i},this.instanceOf=e.instanceOf||null,this.predicate=e.predicate||null,this.represent=e.represent||null,this.representName=e.representName||null,this.defaultStyle=e.defaultStyle||null,this.multi=e.multi||!1,this.styleAliases=Pk(e.styleAliases||null),$k.indexOf(this.kind)===-1)throw new Wt('Unknown kind "'+this.kind+'" is specified for "'+t+'" YAML type.')}var Te=Tk;function fd(t,e){var i=[];return t[e].forEach(function(s){var n=i.length;i.forEach(function(r,o){r.tag===s.tag&&r.kind===s.kind&&r.multi===s.multi&&(n=o)}),i[n]=s}),i}function Mk(){var t={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}},e,i;function s(n){n.multi?(t.multi[n.kind].push(n),t.multi.fallback.push(n)):t[n.kind][n.tag]=t.fallback[n.tag]=n}for(e=0,i=arguments.length;e<i;e+=1)arguments[e].forEach(s);return t}function tl(t){return this.extend(t)}tl.prototype.extend=function(e){var i=[],s=[];if(e instanceof Te)s.push(e);else if(Array.isArray(e))s=s.concat(e);else if(e&&(Array.isArray(e.implicit)||Array.isArray(e.explicit)))e.implicit&&(i=i.concat(e.implicit)),e.explicit&&(s=s.concat(e.explicit));else throw new Wt("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");i.forEach(function(r){if(!(r instanceof Te))throw new Wt("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(r.loadKind&&r.loadKind!=="scalar")throw new Wt("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(r.multi)throw new Wt("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),s.forEach(function(r){if(!(r instanceof Te))throw new Wt("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var n=Object.create(tl.prototype);return n.implicit=(this.implicit||[]).concat(i),n.explicit=(this.explicit||[]).concat(s),n.compiledImplicit=fd(n,"implicit"),n.compiledExplicit=fd(n,"explicit"),n.compiledTypeMap=Mk(n.compiledImplicit,n.compiledExplicit),n};var Ek=tl,Dk=new Te("tag:yaml.org,2002:str",{kind:"scalar",construct:function(t){return t!==null?t:""}}),_k=new Te("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(t){return t!==null?t:[]}}),Bk=new Te("tag:yaml.org,2002:map",{kind:"mapping",construct:function(t){return t!==null?t:{}}}),Rk=new Ek({explicit:[Dk,_k,Bk]});function Lk(t){if(t===null)return!0;var e=t.length;return e===1&&t==="~"||e===4&&(t==="null"||t==="Null"||t==="NULL")}function Ik(){return null}function Fk(t){return t===null}var Nk=new Te("tag:yaml.org,2002:null",{kind:"scalar",resolve:Lk,construct:Ik,predicate:Fk,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});function zk(t){if(t===null)return!1;var e=t.length;return e===4&&(t==="true"||t==="True"||t==="TRUE")||e===5&&(t==="false"||t==="False"||t==="FALSE")}function Hk(t){return t==="true"||t==="True"||t==="TRUE"}function Wk(t){return Object.prototype.toString.call(t)==="[object Boolean]"}var Uk=new Te("tag:yaml.org,2002:bool",{kind:"scalar",resolve:zk,construct:Hk,predicate:Wk,represent:{lowercase:function(t){return t?"true":"false"},uppercase:function(t){return t?"TRUE":"FALSE"},camelcase:function(t){return t?"True":"False"}},defaultStyle:"lowercase"});function qk(t){return 48<=t&&t<=57||65<=t&&t<=70||97<=t&&t<=102}function Vk(t){return 48<=t&&t<=55}function Qk(t){return 48<=t&&t<=57}function jk(t){if(t===null)return!1;var e=t.length,i=0,s=!1,n;if(!e)return!1;if(n=t[i],(n==="-"||n==="+")&&(n=t[++i]),n==="0"){if(i+1===e)return!0;if(n=t[++i],n==="b"){for(i++;i<e;i++)if(n=t[i],n!=="_"){if(n!=="0"&&n!=="1")return!1;s=!0}return s&&n!=="_"}if(n==="x"){for(i++;i<e;i++)if(n=t[i],n!=="_"){if(!qk(t.charCodeAt(i)))return!1;s=!0}return s&&n!=="_"}if(n==="o"){for(i++;i<e;i++)if(n=t[i],n!=="_"){if(!Vk(t.charCodeAt(i)))return!1;s=!0}return s&&n!=="_"}}if(n==="_")return!1;for(;i<e;i++)if(n=t[i],n!=="_"){if(!Qk(t.charCodeAt(i)))return!1;s=!0}return!(!s||n==="_")}function Kk(t){var e=t,i=1,s;if(e.indexOf("_")!==-1&&(e=e.replace(/_/g,"")),s=e[0],(s==="-"||s==="+")&&(s==="-"&&(i=-1),e=e.slice(1),s=e[0]),e==="0")return 0;if(s==="0"){if(e[1]==="b")return i*parseInt(e.slice(2),2);if(e[1]==="x")return i*parseInt(e.slice(2),16);if(e[1]==="o")return i*parseInt(e.slice(2),8)}return i*parseInt(e,10)}function Xk(t){return Object.prototype.toString.call(t)==="[object Number]"&&t%1===0&&!Le.isNegativeZero(t)}var Jk=new Te("tag:yaml.org,2002:int",{kind:"scalar",resolve:jk,construct:Kk,predicate:Xk,represent:{binary:function(t){return t>=0?"0b"+t.toString(2):"-0b"+t.toString(2).slice(1)},octal:function(t){return t>=0?"0o"+t.toString(8):"-0o"+t.toString(8).slice(1)},decimal:function(t){return t.toString(10)},hexadecimal:function(t){return t>=0?"0x"+t.toString(16).toUpperCase():"-0x"+t.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),Yk=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function Gk(t){return!(t===null||!Yk.test(t)||t[t.length-1]==="_")}function Zk(t){var e,i;return e=t.replace(/_/g,"").toLowerCase(),i=e[0]==="-"?-1:1,"+-".indexOf(e[0])>=0&&(e=e.slice(1)),e===".inf"?i===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:e===".nan"?NaN:i*parseFloat(e,10)}var eS=/^[-+]?[0-9]+e/;function tS(t,e){var i;if(isNaN(t))switch(e){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===t)switch(e){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===t)switch(e){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(Le.isNegativeZero(t))return"-0.0";return i=t.toString(10),eS.test(i)?i.replace("e",".e"):i}function iS(t){return Object.prototype.toString.call(t)==="[object Number]"&&(t%1!==0||Le.isNegativeZero(t))}var sS=new Te("tag:yaml.org,2002:float",{kind:"scalar",resolve:Gk,construct:Zk,predicate:iS,represent:tS,defaultStyle:"lowercase"}),nS=Rk.extend({implicit:[Nk,Uk,Jk,sS]}),rS=nS,Ep=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),Dp=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function oS(t){return t===null?!1:Ep.exec(t)!==null||Dp.exec(t)!==null}function aS(t){var e,i,s,n,r,o,a,l=0,c=null,h,d,f;if(e=Ep.exec(t),e===null&&(e=Dp.exec(t)),e===null)throw new Error("Date resolve error");if(i=+e[1],s=+e[2]-1,n=+e[3],!e[4])return new Date(Date.UTC(i,s,n));if(r=+e[4],o=+e[5],a=+e[6],e[7]){for(l=e[7].slice(0,3);l.length<3;)l+="0";l=+l}return e[9]&&(h=+e[10],d=+(e[11]||0),c=(h*60+d)*6e4,e[9]==="-"&&(c=-c)),f=new Date(Date.UTC(i,s,n,r,o,a,l)),c&&f.setTime(f.getTime()-c),f}function lS(t){return t.toISOString()}var cS=new Te("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:oS,construct:aS,instanceOf:Date,represent:lS});function hS(t){return t==="<<"||t===null}var dS=new Te("tag:yaml.org,2002:merge",{kind:"scalar",resolve:hS}),Jl=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function fS(t){if(t===null)return!1;var e,i,s=0,n=t.length,r=Jl;for(i=0;i<n;i++)if(e=r.indexOf(t.charAt(i)),!(e>64)){if(e<0)return!1;s+=6}return s%8===0}function uS(t){var e,i,s=t.replace(/[\r\n=]/g,""),n=s.length,r=Jl,o=0,a=[];for(e=0;e<n;e++)e%4===0&&e&&(a.push(o>>16&255),a.push(o>>8&255),a.push(o&255)),o=o<<6|r.indexOf(s.charAt(e));return i=n%4*6,i===0?(a.push(o>>16&255),a.push(o>>8&255),a.push(o&255)):i===18?(a.push(o>>10&255),a.push(o>>2&255)):i===12&&a.push(o>>4&255),new Uint8Array(a)}function pS(t){var e="",i=0,s,n,r=t.length,o=Jl;for(s=0;s<r;s++)s%3===0&&s&&(e+=o[i>>18&63],e+=o[i>>12&63],e+=o[i>>6&63],e+=o[i&63]),i=(i<<8)+t[s];return n=r%3,n===0?(e+=o[i>>18&63],e+=o[i>>12&63],e+=o[i>>6&63],e+=o[i&63]):n===2?(e+=o[i>>10&63],e+=o[i>>4&63],e+=o[i<<2&63],e+=o[64]):n===1&&(e+=o[i>>2&63],e+=o[i<<4&63],e+=o[64],e+=o[64]),e}function gS(t){return Object.prototype.toString.call(t)==="[object Uint8Array]"}var mS=new Te("tag:yaml.org,2002:binary",{kind:"scalar",resolve:fS,construct:uS,predicate:gS,represent:pS}),bS=Object.prototype.hasOwnProperty,vS=Object.prototype.toString;function yS(t){if(t===null)return!0;var e=[],i,s,n,r,o,a=t;for(i=0,s=a.length;i<s;i+=1){if(n=a[i],o=!1,vS.call(n)!=="[object Object]")return!1;for(r in n)if(bS.call(n,r))if(!o)o=!0;else return!1;if(!o)return!1;if(e.indexOf(r)===-1)e.push(r);else return!1}return!0}function xS(t){return t!==null?t:[]}var wS=new Te("tag:yaml.org,2002:omap",{kind:"sequence",resolve:yS,construct:xS}),kS=Object.prototype.toString;function SS(t){if(t===null)return!0;var e,i,s,n,r,o=t;for(r=new Array(o.length),e=0,i=o.length;e<i;e+=1){if(s=o[e],kS.call(s)!=="[object Object]"||(n=Object.keys(s),n.length!==1))return!1;r[e]=[n[0],s[n[0]]]}return!0}function CS(t){if(t===null)return[];var e,i,s,n,r,o=t;for(r=new Array(o.length),e=0,i=o.length;e<i;e+=1)s=o[e],n=Object.keys(s),r[e]=[n[0],s[n[0]]];return r}var OS=new Te("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:SS,construct:CS}),AS=Object.prototype.hasOwnProperty;function $S(t){if(t===null)return!0;var e,i=t;for(e in i)if(AS.call(i,e)&&i[e]!==null)return!1;return!0}function PS(t){return t!==null?t:{}}var TS=new Te("tag:yaml.org,2002:set",{kind:"mapping",resolve:$S,construct:PS}),MS=rS.extend({implicit:[cS,dS],explicit:[mS,wS,OS,TS]}),mi=Object.prototype.hasOwnProperty,Qr=1,_p=2,Bp=3,jr=4,ta=1,ES=2,ud=3,DS=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,_S=/[\x85\u2028\u2029]/,BS=/[,\[\]\{\}]/,Rp=/^(?:!|!!|![a-z\-]+!)$/i,Lp=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function pd(t){return Object.prototype.toString.call(t)}function Et(t){return t===10||t===13}function Ii(t){return t===9||t===32}function Ue(t){return t===9||t===32||t===10||t===13}function is(t){return t===44||t===91||t===93||t===123||t===125}function RS(t){var e;return 48<=t&&t<=57?t-48:(e=t|32,97<=e&&e<=102?e-97+10:-1)}function LS(t){return t===120?2:t===117?4:t===85?8:0}function IS(t){return 48<=t&&t<=57?t-48:-1}function gd(t){return t===48?"\0":t===97?"\x07":t===98?"\b":t===116||t===9?"	":t===110?`
`:t===118?"\v":t===102?"\f":t===114?"\r":t===101?"\x1B":t===32?" ":t===34?'"':t===47?"/":t===92?"\\":t===78?"":t===95?" ":t===76?"\u2028":t===80?"\u2029":""}function FS(t){return t<=65535?String.fromCharCode(t):String.fromCharCode((t-65536>>10)+55296,(t-65536&1023)+56320)}function Ip(t,e,i){e==="__proto__"?Object.defineProperty(t,e,{configurable:!0,enumerable:!0,writable:!0,value:i}):t[e]=i}var Fp=new Array(256),Np=new Array(256);for(var Qi=0;Qi<256;Qi++)Fp[Qi]=gd(Qi)?1:0,Np[Qi]=gd(Qi);function NS(t,e){this.input=t,this.filename=e.filename||null,this.schema=e.schema||MS,this.onWarning=e.onWarning||null,this.legacy=e.legacy||!1,this.json=e.json||!1,this.listener=e.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=t.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function zp(t,e){var i={name:t.filename,buffer:t.input.slice(0,-1),position:t.position,line:t.line,column:t.position-t.lineStart};return i.snippet=Ok(i),new Wt(e,i)}function L(t,e){throw zp(t,e)}function Kr(t,e){t.onWarning&&t.onWarning.call(null,zp(t,e))}var md={YAML:function(e,i,s){var n,r,o;e.version!==null&&L(e,"duplication of %YAML directive"),s.length!==1&&L(e,"YAML directive accepts exactly one argument"),n=/^([0-9]+)\.([0-9]+)$/.exec(s[0]),n===null&&L(e,"ill-formed argument of the YAML directive"),r=parseInt(n[1],10),o=parseInt(n[2],10),r!==1&&L(e,"unacceptable YAML version of the document"),e.version=s[0],e.checkLineBreaks=o<2,o!==1&&o!==2&&Kr(e,"unsupported YAML version of the document")},TAG:function(e,i,s){var n,r;s.length!==2&&L(e,"TAG directive accepts exactly two arguments"),n=s[0],r=s[1],Rp.test(n)||L(e,"ill-formed tag handle (first argument) of the TAG directive"),mi.call(e.tagMap,n)&&L(e,'there is a previously declared suffix for "'+n+'" tag handle'),Lp.test(r)||L(e,"ill-formed tag prefix (second argument) of the TAG directive");try{r=decodeURIComponent(r)}catch{L(e,"tag prefix is malformed: "+r)}e.tagMap[n]=r}};function ri(t,e,i,s){var n,r,o,a;if(e<i){if(a=t.input.slice(e,i),s)for(n=0,r=a.length;n<r;n+=1)o=a.charCodeAt(n),o===9||32<=o&&o<=1114111||L(t,"expected valid JSON character");else DS.test(a)&&L(t,"the stream contains non-printable characters");t.result+=a}}function bd(t,e,i,s){var n,r,o,a;for(Le.isObject(i)||L(t,"cannot merge mappings; the provided source object is unacceptable"),n=Object.keys(i),o=0,a=n.length;o<a;o+=1)r=n[o],mi.call(e,r)||(Ip(e,r,i[r]),s[r]=!0)}function ss(t,e,i,s,n,r,o,a,l){var c,h;if(Array.isArray(n))for(n=Array.prototype.slice.call(n),c=0,h=n.length;c<h;c+=1)Array.isArray(n[c])&&L(t,"nested arrays are not supported inside keys"),typeof n=="object"&&pd(n[c])==="[object Object]"&&(n[c]="[object Object]");if(typeof n=="object"&&pd(n)==="[object Object]"&&(n="[object Object]"),n=String(n),e===null&&(e={}),s==="tag:yaml.org,2002:merge")if(Array.isArray(r))for(c=0,h=r.length;c<h;c+=1)bd(t,e,r[c],i);else bd(t,e,r,i);else!t.json&&!mi.call(i,n)&&mi.call(e,n)&&(t.line=o||t.line,t.lineStart=a||t.lineStart,t.position=l||t.position,L(t,"duplicated mapping key")),Ip(e,n,r),delete i[n];return e}function Yl(t){var e;e=t.input.charCodeAt(t.position),e===10?t.position++:e===13?(t.position++,t.input.charCodeAt(t.position)===10&&t.position++):L(t,"a line break is expected"),t.line+=1,t.lineStart=t.position,t.firstTabInLine=-1}function ge(t,e,i){for(var s=0,n=t.input.charCodeAt(t.position);n!==0;){for(;Ii(n);)n===9&&t.firstTabInLine===-1&&(t.firstTabInLine=t.position),n=t.input.charCodeAt(++t.position);if(e&&n===35)do n=t.input.charCodeAt(++t.position);while(n!==10&&n!==13&&n!==0);if(Et(n))for(Yl(t),n=t.input.charCodeAt(t.position),s++,t.lineIndent=0;n===32;)t.lineIndent++,n=t.input.charCodeAt(++t.position);else break}return i!==-1&&s!==0&&t.lineIndent<i&&Kr(t,"deficient indentation"),s}function fo(t){var e=t.position,i;return i=t.input.charCodeAt(e),!!((i===45||i===46)&&i===t.input.charCodeAt(e+1)&&i===t.input.charCodeAt(e+2)&&(e+=3,i=t.input.charCodeAt(e),i===0||Ue(i)))}function Gl(t,e){e===1?t.result+=" ":e>1&&(t.result+=Le.repeat(`
`,e-1))}function zS(t,e,i){var s,n,r,o,a,l,c,h,d=t.kind,f=t.result,u;if(u=t.input.charCodeAt(t.position),Ue(u)||is(u)||u===35||u===38||u===42||u===33||u===124||u===62||u===39||u===34||u===37||u===64||u===96||(u===63||u===45)&&(n=t.input.charCodeAt(t.position+1),Ue(n)||i&&is(n)))return!1;for(t.kind="scalar",t.result="",r=o=t.position,a=!1;u!==0;){if(u===58){if(n=t.input.charCodeAt(t.position+1),Ue(n)||i&&is(n))break}else if(u===35){if(s=t.input.charCodeAt(t.position-1),Ue(s))break}else{if(t.position===t.lineStart&&fo(t)||i&&is(u))break;if(Et(u))if(l=t.line,c=t.lineStart,h=t.lineIndent,ge(t,!1,-1),t.lineIndent>=e){a=!0,u=t.input.charCodeAt(t.position);continue}else{t.position=o,t.line=l,t.lineStart=c,t.lineIndent=h;break}}a&&(ri(t,r,o,!1),Gl(t,t.line-l),r=o=t.position,a=!1),Ii(u)||(o=t.position+1),u=t.input.charCodeAt(++t.position)}return ri(t,r,o,!1),t.result?!0:(t.kind=d,t.result=f,!1)}function HS(t,e){var i,s,n;if(i=t.input.charCodeAt(t.position),i!==39)return!1;for(t.kind="scalar",t.result="",t.position++,s=n=t.position;(i=t.input.charCodeAt(t.position))!==0;)if(i===39)if(ri(t,s,t.position,!0),i=t.input.charCodeAt(++t.position),i===39)s=t.position,t.position++,n=t.position;else return!0;else Et(i)?(ri(t,s,n,!0),Gl(t,ge(t,!1,e)),s=n=t.position):t.position===t.lineStart&&fo(t)?L(t,"unexpected end of the document within a single quoted scalar"):(t.position++,n=t.position);L(t,"unexpected end of the stream within a single quoted scalar")}function WS(t,e){var i,s,n,r,o,a;if(a=t.input.charCodeAt(t.position),a!==34)return!1;for(t.kind="scalar",t.result="",t.position++,i=s=t.position;(a=t.input.charCodeAt(t.position))!==0;){if(a===34)return ri(t,i,t.position,!0),t.position++,!0;if(a===92){if(ri(t,i,t.position,!0),a=t.input.charCodeAt(++t.position),Et(a))ge(t,!1,e);else if(a<256&&Fp[a])t.result+=Np[a],t.position++;else if((o=LS(a))>0){for(n=o,r=0;n>0;n--)a=t.input.charCodeAt(++t.position),(o=RS(a))>=0?r=(r<<4)+o:L(t,"expected hexadecimal character");t.result+=FS(r),t.position++}else L(t,"unknown escape sequence");i=s=t.position}else Et(a)?(ri(t,i,s,!0),Gl(t,ge(t,!1,e)),i=s=t.position):t.position===t.lineStart&&fo(t)?L(t,"unexpected end of the document within a double quoted scalar"):(t.position++,s=t.position)}L(t,"unexpected end of the stream within a double quoted scalar")}function US(t,e){var i=!0,s,n,r,o=t.tag,a,l=t.anchor,c,h,d,f,u,p=Object.create(null),m,b,x,k;if(k=t.input.charCodeAt(t.position),k===91)h=93,u=!1,a=[];else if(k===123)h=125,u=!0,a={};else return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=a),k=t.input.charCodeAt(++t.position);k!==0;){if(ge(t,!0,e),k=t.input.charCodeAt(t.position),k===h)return t.position++,t.tag=o,t.anchor=l,t.kind=u?"mapping":"sequence",t.result=a,!0;i?k===44&&L(t,"expected the node content, but found ','"):L(t,"missed comma between flow collection entries"),b=m=x=null,d=f=!1,k===63&&(c=t.input.charCodeAt(t.position+1),Ue(c)&&(d=f=!0,t.position++,ge(t,!0,e))),s=t.line,n=t.lineStart,r=t.position,ks(t,e,Qr,!1,!0),b=t.tag,m=t.result,ge(t,!0,e),k=t.input.charCodeAt(t.position),(f||t.line===s)&&k===58&&(d=!0,k=t.input.charCodeAt(++t.position),ge(t,!0,e),ks(t,e,Qr,!1,!0),x=t.result),u?ss(t,a,p,b,m,x,s,n,r):d?a.push(ss(t,null,p,b,m,x,s,n,r)):a.push(m),ge(t,!0,e),k=t.input.charCodeAt(t.position),k===44?(i=!0,k=t.input.charCodeAt(++t.position)):i=!1}L(t,"unexpected end of the stream within a flow collection")}function qS(t,e){var i,s,n=ta,r=!1,o=!1,a=e,l=0,c=!1,h,d;if(d=t.input.charCodeAt(t.position),d===124)s=!1;else if(d===62)s=!0;else return!1;for(t.kind="scalar",t.result="";d!==0;)if(d=t.input.charCodeAt(++t.position),d===43||d===45)ta===n?n=d===43?ud:ES:L(t,"repeat of a chomping mode identifier");else if((h=IS(d))>=0)h===0?L(t,"bad explicit indentation width of a block scalar; it cannot be less than one"):o?L(t,"repeat of an indentation width identifier"):(a=e+h-1,o=!0);else break;if(Ii(d)){do d=t.input.charCodeAt(++t.position);while(Ii(d));if(d===35)do d=t.input.charCodeAt(++t.position);while(!Et(d)&&d!==0)}for(;d!==0;){for(Yl(t),t.lineIndent=0,d=t.input.charCodeAt(t.position);(!o||t.lineIndent<a)&&d===32;)t.lineIndent++,d=t.input.charCodeAt(++t.position);if(!o&&t.lineIndent>a&&(a=t.lineIndent),Et(d)){l++;continue}if(t.lineIndent<a){n===ud?t.result+=Le.repeat(`
`,r?1+l:l):n===ta&&r&&(t.result+=`
`);break}for(s?Ii(d)?(c=!0,t.result+=Le.repeat(`
`,r?1+l:l)):c?(c=!1,t.result+=Le.repeat(`
`,l+1)):l===0?r&&(t.result+=" "):t.result+=Le.repeat(`
`,l):t.result+=Le.repeat(`
`,r?1+l:l),r=!0,o=!0,l=0,i=t.position;!Et(d)&&d!==0;)d=t.input.charCodeAt(++t.position);ri(t,i,t.position,!1)}return!0}function vd(t,e){var i,s=t.tag,n=t.anchor,r=[],o,a=!1,l;if(t.firstTabInLine!==-1)return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=r),l=t.input.charCodeAt(t.position);l!==0&&(t.firstTabInLine!==-1&&(t.position=t.firstTabInLine,L(t,"tab characters must not be used in indentation")),!(l!==45||(o=t.input.charCodeAt(t.position+1),!Ue(o))));){if(a=!0,t.position++,ge(t,!0,-1)&&t.lineIndent<=e){r.push(null),l=t.input.charCodeAt(t.position);continue}if(i=t.line,ks(t,e,Bp,!1,!0),r.push(t.result),ge(t,!0,-1),l=t.input.charCodeAt(t.position),(t.line===i||t.lineIndent>e)&&l!==0)L(t,"bad indentation of a sequence entry");else if(t.lineIndent<e)break}return a?(t.tag=s,t.anchor=n,t.kind="sequence",t.result=r,!0):!1}function VS(t,e,i){var s,n,r,o,a,l,c=t.tag,h=t.anchor,d={},f=Object.create(null),u=null,p=null,m=null,b=!1,x=!1,k;if(t.firstTabInLine!==-1)return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=d),k=t.input.charCodeAt(t.position);k!==0;){if(!b&&t.firstTabInLine!==-1&&(t.position=t.firstTabInLine,L(t,"tab characters must not be used in indentation")),s=t.input.charCodeAt(t.position+1),r=t.line,(k===63||k===58)&&Ue(s))k===63?(b&&(ss(t,d,f,u,p,null,o,a,l),u=p=m=null),x=!0,b=!0,n=!0):b?(b=!1,n=!0):L(t,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),t.position+=1,k=s;else{if(o=t.line,a=t.lineStart,l=t.position,!ks(t,i,_p,!1,!0))break;if(t.line===r){for(k=t.input.charCodeAt(t.position);Ii(k);)k=t.input.charCodeAt(++t.position);if(k===58)k=t.input.charCodeAt(++t.position),Ue(k)||L(t,"a whitespace character is expected after the key-value separator within a block mapping"),b&&(ss(t,d,f,u,p,null,o,a,l),u=p=m=null),x=!0,b=!1,n=!1,u=t.tag,p=t.result;else if(x)L(t,"can not read an implicit mapping pair; a colon is missed");else return t.tag=c,t.anchor=h,!0}else if(x)L(t,"can not read a block mapping entry; a multiline key may not be an implicit key");else return t.tag=c,t.anchor=h,!0}if((t.line===r||t.lineIndent>e)&&(b&&(o=t.line,a=t.lineStart,l=t.position),ks(t,e,jr,!0,n)&&(b?p=t.result:m=t.result),b||(ss(t,d,f,u,p,m,o,a,l),u=p=m=null),ge(t,!0,-1),k=t.input.charCodeAt(t.position)),(t.line===r||t.lineIndent>e)&&k!==0)L(t,"bad indentation of a mapping entry");else if(t.lineIndent<e)break}return b&&ss(t,d,f,u,p,null,o,a,l),x&&(t.tag=c,t.anchor=h,t.kind="mapping",t.result=d),x}function QS(t){var e,i=!1,s=!1,n,r,o;if(o=t.input.charCodeAt(t.position),o!==33)return!1;if(t.tag!==null&&L(t,"duplication of a tag property"),o=t.input.charCodeAt(++t.position),o===60?(i=!0,o=t.input.charCodeAt(++t.position)):o===33?(s=!0,n="!!",o=t.input.charCodeAt(++t.position)):n="!",e=t.position,i){do o=t.input.charCodeAt(++t.position);while(o!==0&&o!==62);t.position<t.length?(r=t.input.slice(e,t.position),o=t.input.charCodeAt(++t.position)):L(t,"unexpected end of the stream within a verbatim tag")}else{for(;o!==0&&!Ue(o);)o===33&&(s?L(t,"tag suffix cannot contain exclamation marks"):(n=t.input.slice(e-1,t.position+1),Rp.test(n)||L(t,"named tag handle cannot contain such characters"),s=!0,e=t.position+1)),o=t.input.charCodeAt(++t.position);r=t.input.slice(e,t.position),BS.test(r)&&L(t,"tag suffix cannot contain flow indicator characters")}r&&!Lp.test(r)&&L(t,"tag name cannot contain such characters: "+r);try{r=decodeURIComponent(r)}catch{L(t,"tag name is malformed: "+r)}return i?t.tag=r:mi.call(t.tagMap,n)?t.tag=t.tagMap[n]+r:n==="!"?t.tag="!"+r:n==="!!"?t.tag="tag:yaml.org,2002:"+r:L(t,'undeclared tag handle "'+n+'"'),!0}function jS(t){var e,i;if(i=t.input.charCodeAt(t.position),i!==38)return!1;for(t.anchor!==null&&L(t,"duplication of an anchor property"),i=t.input.charCodeAt(++t.position),e=t.position;i!==0&&!Ue(i)&&!is(i);)i=t.input.charCodeAt(++t.position);return t.position===e&&L(t,"name of an anchor node must contain at least one character"),t.anchor=t.input.slice(e,t.position),!0}function KS(t){var e,i,s;if(s=t.input.charCodeAt(t.position),s!==42)return!1;for(s=t.input.charCodeAt(++t.position),e=t.position;s!==0&&!Ue(s)&&!is(s);)s=t.input.charCodeAt(++t.position);return t.position===e&&L(t,"name of an alias node must contain at least one character"),i=t.input.slice(e,t.position),mi.call(t.anchorMap,i)||L(t,'unidentified alias "'+i+'"'),t.result=t.anchorMap[i],ge(t,!0,-1),!0}function ks(t,e,i,s,n){var r,o,a,l=1,c=!1,h=!1,d,f,u,p,m,b;if(t.listener!==null&&t.listener("open",t),t.tag=null,t.anchor=null,t.kind=null,t.result=null,r=o=a=jr===i||Bp===i,s&&ge(t,!0,-1)&&(c=!0,t.lineIndent>e?l=1:t.lineIndent===e?l=0:t.lineIndent<e&&(l=-1)),l===1)for(;QS(t)||jS(t);)ge(t,!0,-1)?(c=!0,a=r,t.lineIndent>e?l=1:t.lineIndent===e?l=0:t.lineIndent<e&&(l=-1)):a=!1;if(a&&(a=c||n),(l===1||jr===i)&&(Qr===i||_p===i?m=e:m=e+1,b=t.position-t.lineStart,l===1?a&&(vd(t,b)||VS(t,b,m))||US(t,m)?h=!0:(o&&qS(t,m)||HS(t,m)||WS(t,m)?h=!0:KS(t)?(h=!0,(t.tag!==null||t.anchor!==null)&&L(t,"alias node should not have any properties")):zS(t,m,Qr===i)&&(h=!0,t.tag===null&&(t.tag="?")),t.anchor!==null&&(t.anchorMap[t.anchor]=t.result)):l===0&&(h=a&&vd(t,b))),t.tag===null)t.anchor!==null&&(t.anchorMap[t.anchor]=t.result);else if(t.tag==="?"){for(t.result!==null&&t.kind!=="scalar"&&L(t,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+t.kind+'"'),d=0,f=t.implicitTypes.length;d<f;d+=1)if(p=t.implicitTypes[d],p.resolve(t.result)){t.result=p.construct(t.result),t.tag=p.tag,t.anchor!==null&&(t.anchorMap[t.anchor]=t.result);break}}else if(t.tag!=="!"){if(mi.call(t.typeMap[t.kind||"fallback"],t.tag))p=t.typeMap[t.kind||"fallback"][t.tag];else for(p=null,u=t.typeMap.multi[t.kind||"fallback"],d=0,f=u.length;d<f;d+=1)if(t.tag.slice(0,u[d].tag.length)===u[d].tag){p=u[d];break}p||L(t,"unknown tag !<"+t.tag+">"),t.result!==null&&p.kind!==t.kind&&L(t,"unacceptable node kind for !<"+t.tag+'> tag; it should be "'+p.kind+'", not "'+t.kind+'"'),p.resolve(t.result,t.tag)?(t.result=p.construct(t.result,t.tag),t.anchor!==null&&(t.anchorMap[t.anchor]=t.result)):L(t,"cannot resolve a node with !<"+t.tag+"> explicit tag")}return t.listener!==null&&t.listener("close",t),t.tag!==null||t.anchor!==null||h}function XS(t){var e=t.position,i,s,n,r=!1,o;for(t.version=null,t.checkLineBreaks=t.legacy,t.tagMap=Object.create(null),t.anchorMap=Object.create(null);(o=t.input.charCodeAt(t.position))!==0&&(ge(t,!0,-1),o=t.input.charCodeAt(t.position),!(t.lineIndent>0||o!==37));){for(r=!0,o=t.input.charCodeAt(++t.position),i=t.position;o!==0&&!Ue(o);)o=t.input.charCodeAt(++t.position);for(s=t.input.slice(i,t.position),n=[],s.length<1&&L(t,"directive name must not be less than one character in length");o!==0;){for(;Ii(o);)o=t.input.charCodeAt(++t.position);if(o===35){do o=t.input.charCodeAt(++t.position);while(o!==0&&!Et(o));break}if(Et(o))break;for(i=t.position;o!==0&&!Ue(o);)o=t.input.charCodeAt(++t.position);n.push(t.input.slice(i,t.position))}o!==0&&Yl(t),mi.call(md,s)?md[s](t,s,n):Kr(t,'unknown document directive "'+s+'"')}if(ge(t,!0,-1),t.lineIndent===0&&t.input.charCodeAt(t.position)===45&&t.input.charCodeAt(t.position+1)===45&&t.input.charCodeAt(t.position+2)===45?(t.position+=3,ge(t,!0,-1)):r&&L(t,"directives end mark is expected"),ks(t,t.lineIndent-1,jr,!1,!0),ge(t,!0,-1),t.checkLineBreaks&&_S.test(t.input.slice(e,t.position))&&Kr(t,"non-ASCII line breaks are interpreted as content"),t.documents.push(t.result),t.position===t.lineStart&&fo(t)){t.input.charCodeAt(t.position)===46&&(t.position+=3,ge(t,!0,-1));return}if(t.position<t.length-1)L(t,"end of the stream or a document separator is expected");else return}function JS(t,e){t=String(t),e=e||{},t.length!==0&&(t.charCodeAt(t.length-1)!==10&&t.charCodeAt(t.length-1)!==13&&(t+=`
`),t.charCodeAt(0)===65279&&(t=t.slice(1)));var i=new NS(t,e),s=t.indexOf("\0");for(s!==-1&&(i.position=s,L(i,"null byte is not allowed in input")),i.input+="\0";i.input.charCodeAt(i.position)===32;)i.lineIndent+=1,i.position+=1;for(;i.position<i.length-1;)XS(i);return i.documents}function YS(t,e){var i=JS(t,e);if(i.length!==0){if(i.length===1)return i[0];throw new Wt("expected a single document in the stream, but found more")}}var GS=YS,ZS={load:GS},eC=ZS.load,tC=Object.defineProperty,iC=Object.getOwnPropertyDescriptor,I=(t,e,i,s)=>{for(var n=s>1?void 0:s?iC(e,i):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(n=(s?o(e,i,n):o(n))||n);return s&&n&&tC(e,i,n),n};const Rs={"ESP32-C5":{label:"ESP32-C5 (esp32-c5-devkitc-1)",board_info:{platform:"esp32",board:"esp32-c5-devkitc-1",framework:"esp-idf",variant:"esp32c5"}},"ESP32-C6":{label:"ESP32-C6 (esp32-c6-devkitc)",board_info:{platform:"esp32",board:"esp32-c6-devkitc",framework:"esp-idf",variant:"esp32c6"}},"ESP32-S3":{label:"ESP32-S3 (esp32-s3-devkitc-1)",board_info:{platform:"esp32",board:"esp32-s3-devkitc-1",framework:"esp-idf",variant:"esp32s3"}},"ESP32-C3":{label:"ESP32-C3 (esp32-c3-devkitm-1)",board_info:{platform:"esp32",board:"esp32-c3-devkitm-1",framework:"esp-idf",variant:"esp32c3"}},"ESP32-S2":{label:"ESP32-S2 (esp32-s2-saola)",board_info:{platform:"esp32",board:"esp32-s2-saola",framework:"esp-idf",variant:"esp32s2"}},ESP32:{label:"ESP32 (esp32dev)",board_info:{platform:"esp32",board:"esp32dev",framework:"esp-idf"}},"ESP32-H2":{label:"ESP32-H2 (esp32-h2-devkitm-1)",board_info:{platform:"esp32",board:"esp32-h2-devkitm-1",framework:"esp-idf",variant:"esp32h2"}},"ESP32-C2":{label:"ESP32-C2 (esp32-c2-devkitm-1)",board_info:{platform:"esp32",board:"esp32-c2-devkitm-1",framework:"esp-idf",variant:"esp32c2"}}};function sC(t){if(!t)return null;const e=t.trim().toUpperCase().replace(/\s+/g,""),i=["ESP32-C61","ESP32-C6","ESP32-C5","ESP32-C3","ESP32-C2","ESP32-H2","ESP32-P4","ESP32-S3","ESP32-S2","ESP32"];for(const s of i){const n=s.replace(/-/g,"");if(e.includes(s)||e.includes(n))return s}return null}let B=class extends he{constructor(){super(...arguments),this.step1="choose",this.step1Choice="choose",this.step2="disabled",this.step3="disabled",this.discoveredBridges=[],this.bridgeError=null,this.manualHost="",this.manualPort=80,this.manualApiKey="",this.apiKeyInput="",this.selectedBridge=null,this.restartError=null,this.integrationError=null,this.runningIntegrationVersion=null,this.latestIntegrationVersion=null,this.integrationDetected=!1,this.bridgeApiStatus=null,this.statusPollTimer=null,this.integrationPollTimer=null,this.integrationFailures=0,this.pollingSeconds=0,this.discoveryTimer=null,this.discoveryTimeoutTimer=null,this.doneTimer=null,this.validatePollTimer=null,this.validateAttempts=0,this.activeBridgeUuid=null,this.bridgeHost=null,this.bridgePort=80,this.pollStartTime=0,this.lastIntegrationSetupAttemptAt=0,this.flashTab="discover",this.flashStage="config",this.flashName="espnow-bridge",this.flashNetworkId="",this.flashPsk="",this.flashWifiSsid="",this.flashWifiPassword="",this.flashApiKey="",this.flashEspnowMode="lr",this.flashOtaPassword="",this.flashChipName="",this.flashBoardInfo=null,this.flashBrowserDetecting=!1,this.flashBrowserDetectError="",this.flashDetectedChip="",this.flashSecretsWarning="",this.flashConfigError="",this.flashMac="",this.flashCompileLog="",this.flashCompilePercent=0,this.flashCompileStatus="",this.flashCompileError="",this.flashFlashError="",this.flashDetectElapsed=0,this.flashDetectError="",this.flashBrowserManifestUrl="",this.flashCompilePollTimer=null,this.flashDetectTimer=null,this.flashCompileLogEs=null,this.flashBrowserFirmwareBlobUrl="",this.serialPorts=[],this.serialScanning=!1,this.serialSelectedPort="",this.serialBaud=460800,this.serialApiKey="",this.serialName="",this.serialError=null}connectedCallback(){super.connectedCallback(),this.initFromBridgeConfig()}updated(t){var e;if(super.updated(t),t.has("flashCompileLog")){const i=(e=this.shadowRoot)==null?void 0:e.getElementById("flash-log-viewer");i&&(i.scrollTop=i.scrollHeight)}}async initFromBridgeConfig(){const t=await C.setupStatus();this.captureStatus(t);const e=this.integrationReady(t);t.bridge.configured?(this.activeBridgeUuid=t.bridge.uuid||null,this.bridgeHost=t.bridge.ip||null,t.bridge.connected?(this.step1="complete",this.startConfiguredBridgeFlow(t,e)):(this.step1="pending",this.validateAttempts=0,this.discoveryTimer&&(clearInterval(this.discoveryTimer),this.discoveryTimer=null),this.activeBridgeUuid&&C.bridgeReconnect(this.activeBridgeUuid),this.validatePollTimer=setInterval(()=>void this.pollValidateStatus(),1e3))):(this.step2!=="disabled"&&(this.step2="disabled"),this.step3!=="disabled"&&(this.step3="disabled"),this.step1="choose",this.step1Choice="choose",this.statusPollTimer=setInterval(()=>void this.pollStatus(),B.STATUS_POLL_INTERVAL_MS))}async startConfiguredBridgeFlow(t,e){t.restart.required?["restarting","polling","complete"].includes(this.step2)||(this.step2="ready"):(this.step2="complete",e?(this.step3="complete",this.onAllDone()):this.step3==="disabled"&&this.triggerIntegrationSetup()),this.statusPollTimer=setInterval(()=>void this.pollStatus(),B.STATUS_POLL_INTERVAL_MS)}get browserSupportsUsbFlash(){return typeof window<"u"&&window.isSecureContext&&"serial"in navigator}get flashChipFamily(){return sC(this.flashChipName)}clearFlashBrowserManifestUrl(){this.flashBrowserManifestUrl&&(URL.revokeObjectURL(this.flashBrowserManifestUrl),this.flashBrowserManifestUrl=""),this.flashBrowserFirmwareBlobUrl&&(URL.revokeObjectURL(this.flashBrowserFirmwareBlobUrl),this.flashBrowserFirmwareBlobUrl="")}async updateFlashBrowserManifestUrl(){if(!this.flashMac)return;const t=this.flashChipFamily;if(!t){this.clearFlashBrowserManifestUrl();return}try{const e=await fetch(C.downloadFactoryBinary(this.flashMac));if(!e.ok){this.clearFlashBrowserManifestUrl();return}const i=await e.blob(),s=URL.createObjectURL(i),n={name:this.flashName,version:"compiled",new_install_prompt_erase:!0,builds:[{chipFamily:t,parts:[{path:s,offset:0}]}]},r=new Blob([JSON.stringify(n)],{type:"application/json"}),o=URL.createObjectURL(r);this.clearFlashBrowserManifestUrl(),this.flashBrowserManifestUrl=o,this.flashBrowserFirmwareBlobUrl=s}catch{this.clearFlashBrowserManifestUrl()}}async pollValidateStatus(){if(this.step1!=="pending"){this.validatePollTimer&&(clearInterval(this.validatePollTimer),this.validatePollTimer=null);return}this.validateAttempts++;try{const t=await C.setupStatus();if(this.captureStatus(t),t.bridge.connected){this.step1="complete",this.validatePollTimer&&(clearInterval(this.validatePollTimer),this.validatePollTimer=null),this.startConfiguredBridgeFlow(t,this.integrationReady(t));return}}catch{}this.validateAttempts>=3&&(this.validatePollTimer&&(clearInterval(this.validatePollTimer),this.validatePollTimer=null),this.step1="error",this.startDiscovery(),this.statusPollTimer=setInterval(()=>void this.pollStatus(),B.STATUS_POLL_INTERVAL_MS))}disconnectedCallback(){this.statusPollTimer&&(clearInterval(this.statusPollTimer),this.statusPollTimer=null),this.integrationPollTimer&&(clearInterval(this.integrationPollTimer),this.integrationPollTimer=null),this.discoveryTimer&&(clearInterval(this.discoveryTimer),this.discoveryTimer=null),this.discoveryTimeoutTimer&&(clearTimeout(this.discoveryTimeoutTimer),this.discoveryTimeoutTimer=null),this.validatePollTimer&&(clearInterval(this.validatePollTimer),this.validatePollTimer=null),this.doneTimer&&(clearTimeout(this.doneTimer),this.doneTimer=null),this.flashCompilePollTimer&&(clearInterval(this.flashCompilePollTimer),this.flashCompilePollTimer=null),this.flashDetectTimer&&(clearInterval(this.flashDetectTimer),this.flashDetectTimer=null),this.flashCompileLogEs&&(this.flashCompileLogEs.close(),this.flashCompileLogEs=null),this.clearFlashBrowserManifestUrl(),super.disconnectedCallback()}async startDiscovery(){this.discoveryTimer&&(clearInterval(this.discoveryTimer),this.discoveryTimer=null),this.discoveryTimeoutTimer&&(clearTimeout(this.discoveryTimeoutTimer),this.discoveryTimeoutTimer=null),this.step1!=="complete"&&(this.step1="scanning"),this.bridgeError=null,await this.refreshDiscoveredBridges(),C.triggerScan().catch(t=>{const e=t instanceof Error?t.message:String(t);e.toLowerCase().includes("already")||(this.bridgeError=e)}),this.discoveryTimer=setInterval(()=>void this.refreshDiscoveredBridges(),2e3),this.discoveryTimeoutTimer=setTimeout(()=>{this.discoveryTimeoutTimer=null,this.discoveryTimer&&(clearInterval(this.discoveryTimer),this.discoveryTimer=null),this.step1==="scanning"&&(this.step1="error",this.bridgeError="No bridges found. Make sure your bridge is powered on and connected to the same network, then try again.")},B.MAX_DISCOVERY_DURATION_MS)}async refreshDiscoveredBridges(){if(!(this.step1==="complete"||this.step1==="connecting"||this.step1==="pending"))try{const t=await C.discoverBridges();this.discoveredBridges=t.bridges,this.discoveredBridges.length>0?(this.step1="found",this.bridgeError=null,this.discoveryTimer&&(clearInterval(this.discoveryTimer),this.discoveryTimer=null),this.discoveryTimeoutTimer&&(clearTimeout(this.discoveryTimeoutTimer),this.discoveryTimeoutTimer=null)):t.scanning?this.step1!=="error"&&(this.step1="scanning"):(this.step1="error",this.bridgeError="No bridges found. Make sure your bridge is powered on and connected to the same network, then try again.",this.discoveryTimer&&(clearInterval(this.discoveryTimer),this.discoveryTimer=null),this.discoveryTimeoutTimer&&(clearTimeout(this.discoveryTimeoutTimer),this.discoveryTimeoutTimer=null))}catch(t){this.bridgeError=t instanceof Error?t.message:String(t)}}async pollStatus(){try{const t=await C.setupStatus();this.captureStatus(t);const e=this.integrationReady(t);t.bridge.configured&&this.step1!=="pending"?(this.step1="complete",this.discoveryTimer&&(clearInterval(this.discoveryTimer),this.discoveryTimer=null),t.restart.required?["restarting","polling","complete"].includes(this.step2)||(this.step2="ready"):(this.step2="complete",!e&&this.step3==="disabled"&&this.triggerIntegrationSetup())):(this.step2!=="disabled"&&(this.step2="disabled"),this.step3!=="disabled"&&(this.step3="disabled")),t.bridge.configured&&!t.restart.required&&this.step2==="polling"&&(this.step2="complete",this.pollingSeconds=0,!e&&this.step3==="disabled"&&this.triggerIntegrationSetup()),e&&(this.step3="complete",this.integrationFailures=0,this.step1==="complete"&&this.step2==="complete"&&this.onAllDone()),this.step2==="polling"&&(this.pollingSeconds+=B.STATUS_POLL_INTERVAL_S)}catch{}}captureStatus(t){this.runningIntegrationVersion=t.integration.live_version||t.restart.running_version||t.integration.version||t.integration.runtime_version||null,this.latestIntegrationVersion=t.restart.latest_version||t.integration.latest_version||null,this.integrationDetected=!!(t.integration.loaded||t.integration.live_connected||t.integration.runtime_loaded||t.integration.entry_loaded||t.integration.ws_client_connected||t.integration.configured),t.bridge.ws_connected?this.bridgeApiStatus=`Bridge protobuf online: ${t.bridge.ip||t.bridge.hostname||"bridge"}`:this.bridgeApiStatus=null}integrationReady(t){const e=t.integration;return!!(e.configured||e.entry_loaded||e.ws_client_connected||e.loaded&&e.connected)&&!t.restart.required}async connectBridgeBySelect(t){if(!this.apiKeyInput.trim()){this.bridgeError="API key is required";return}this.step1="connecting",this.bridgeError=null;try{await C.selectBridge(t.host,t.port,t.name,t.version,this.apiKeyInput,t.network_id,t.hostname),this.step1="complete",this.step2="ready",this.pollStatus()}catch(e){this.step1="found",this.bridgeError=e instanceof Error?e.message:String(e)}}async connectManualBridge(){if(!this.manualHost.trim()){this.bridgeError="Host is required";return}this.step1="connecting",this.bridgeError=null;try{await C.addBridge(this.manualHost.trim(),this.manualPort,void 0,this.manualApiKey||"",""),this.step1="complete",this.step2="ready",this.pollStatus()}catch(t){this.step1=this.discoveredBridges.length>0?"found":"error",this.bridgeError=t instanceof Error?t.message:String(t)}}selectBridgeForApiKey(t){this.selectedBridge=t,this.discoveryTimer&&(clearInterval(this.discoveryTimer),this.discoveryTimer=null)}async handleRestart(){this.step2="restarting",this.restartError=null;try{const t=await C.requestRestart();t.success?(this.step2="polling",this.pollingSeconds=0):(this.step2="error",this.restartError=t.error||"Restart failed")}catch{this.step2="polling",this.pollingSeconds=0,this.restartError=null}}triggerIntegrationSetup(){["triggering","polling","complete"].includes(this.step3)||(this.step3="triggering",this.integrationError=null,this.integrationFailures=0,this.lastIntegrationSetupAttemptAt=Date.now(),C.integrationSetup().then(async t=>{const e=await C.setupStatus();if(this.captureStatus(e),this.integrationReady(e)){this.step3="complete",this.onAllDone();return}if(t.entry_created&&!t.restart_required){this.step3="complete",this.onAllDone();return}if(t.success&&!t.entry_created&&!t.restart_required){this.step3="fallback",this.integrationError="Integration created — restart Home Assistant first, then add ESP Tree in Devices & Services.";return}t.success?(this.step3="polling",this.pollStartTime=Date.now(),this.integrationPollTimer||(this.integrationPollTimer=setInterval(()=>void this.pollIntegrationForEntry(),B.STATUS_POLL_INTERVAL_MS))):(this.step3="error",this.integrationError=t.error||"Failed to set up integration")}).catch(t=>{this.step3="error",this.integrationError=t instanceof Error?t.message:String(t)}))}async pollIntegrationForEntry(){try{const t=await C.setupStatus();if(this.captureStatus(t),this.integrationFailures=0,this.integrationReady(t)){this.step3="complete",this.integrationPollTimer&&(clearInterval(this.integrationPollTimer),this.integrationPollTimer=null),this.onAllDone();return}const e=Date.now();if(e-this.lastIntegrationSetupAttemptAt>=1e4){this.lastIntegrationSetupAttemptAt=e;const i=await C.integrationSetup();if(i.entry_created&&!i.restart_required){this.step3="complete",this.integrationPollTimer&&(clearInterval(this.integrationPollTimer),this.integrationPollTimer=null),this.onAllDone();return}}Date.now()-this.pollStartTime>B.MAX_POLL_DURATION_MS&&(this.integrationPollTimer&&(clearInterval(this.integrationPollTimer),this.integrationPollTimer=null),this.step3="fallback")}catch{this.integrationFailures++,this.integrationFailures>=10&&(this.integrationPollTimer&&(clearInterval(this.integrationPollTimer),this.integrationPollTimer=null),this.step3="fallback")}}async onAllDone(){this.doneTimer||(this.doneTimer=setTimeout(()=>{this.doneTimer=null,window.location.hash="/"},2e3))}dismiss(){this.doneTimer&&(clearTimeout(this.doneTimer),this.doneTimer=null),this.dispatchEvent(new CustomEvent("setup-dismissed",{bubbles:!0,composed:!0})),window.location.hash="/"}retryDiscovery(){this.startDiscovery()}retryConnection(){this.step1="pending",this.validateAttempts=0,this.activeBridgeUuid&&C.bridgeReconnect(this.activeBridgeUuid),this.statusPollTimer&&(clearInterval(this.statusPollTimer),this.statusPollTimer=null),this.validatePollTimer=setInterval(()=>void this.pollValidateStatus(),1e3)}onChooseExistingBridge(){this.step1Choice="existing",this.flashTab="discover",this.startDiscovery()}onChooseNewBridge(){this.step1Choice="new",this.flashTab="flash",this.loadFlashWizardDefaults()}onBackToChoose(){this.step1Choice="choose",this.step1="choose",this.bridgeError=null}async loadFlashWizardDefaults(){try{const t=await C.getSecrets().catch(()=>null);t!=null&&t.content&&this.parseSecretsForFlash(t.content),this.flashApiKey||(this.flashApiKey=this.generateRandomBase64(18)),this.flashOtaPassword||(this.flashOtaPassword=this.generateRandomHex(16))}catch{this.flashApiKey||(this.flashApiKey=this.generateRandomBase64(18)),this.flashOtaPassword||(this.flashOtaPassword=this.generateRandomHex(16))}}parseSecretsForFlash(t){if(!(!t||!t.trim()))try{const e=eC(t);if(!e||typeof e!="object")return;const i=e,s=typeof i.wifi_ssid=="string"?i.wifi_ssid:"",n=typeof i.wifi_password=="string"?i.wifi_password:"",r=typeof i.ota_password=="string"?i.ota_password:"",o=typeof i.bridge_api_key=="string"?i.bridge_api_key:"",a=typeof i.espnow_network_id=="string"?i.espnow_network_id:"",l=typeof i.espnow_psk=="string"?i.espnow_psk:"";s&&(this.flashWifiSsid=s),n&&(this.flashWifiPassword=n),r&&(this.flashOtaPassword=r),o&&(this.flashApiKey=o),a&&(this.flashNetworkId=a),l&&(this.flashPsk=l),a||l?this.flashSecretsWarning="Existing network credentials detected. Changing Network ID or PSK will break communication with any existing remotes on this network.":this.flashSecretsWarning=""}catch{}}generateRandomBase64(t){const e=new Uint8Array(t);return crypto.getRandomValues(e),btoa(String.fromCharCode(...e)).replace(/[+/=]/g,"").slice(0,24)}generateRandomHex(t){const e=new Uint8Array(t);return crypto.getRandomValues(e),Array.from(e).map(i=>i.toString(16).padStart(2,"0")).join("")}async detectFlashBoardInBrowser(){this.flashBrowserDetecting=!0,this.flashBrowserDetectError="",this.flashDetectedChip="",this.requestUpdate();let t=null;try{if(typeof window>"u"||!window.isSecureContext)throw new Error("Browser USB detection requires a secure HTTPS page");const e=navigator.serial;if(!e)throw new Error("Web Serial is not available. Use Chrome or Edge, or select the board manually");const i=await e.requestPort(),s="https://unpkg.com/esptool-js@0.6.1/bundle.js",n=await import(s);t=new n.Transport(i,!0);const r=new n.ESPLoader({transport:t,baudrate:115200,terminal:{clean:()=>{},writeLine:()=>{},write:()=>{}},debugLogging:!1}),o=String(await r.main()),a=sC(o);if(!a||!Rs[a])throw new Error(`Detected ${o}, but there is no supported board mapping for it`);this.flashChipName=a,this.flashBoardInfo=Rs[a].board_info,this.flashDetectedChip=o}catch(e){this.flashBrowserDetectError=e instanceof Error?e.message:String(e)}finally{if(t)try{await t.disconnect()}catch{}this.flashBrowserDetecting=!1,this.requestUpdate()}}onFlashChipChange(t){var e;this.flashChipName=t,this.flashBoardInfo=((e=Rs[t])==null?void 0:e.board_info)||null,this.flashDetectedChip="",this.flashBrowserDetectError=""}validateFlashConfig(){const t=[];return this.flashName.trim()||t.push("ESPHome Name is required"),/^[a-z][a-z0-9-]*$/.test(this.flashName.trim())||t.push("ESPHome Name must be lowercase letters, numbers, and hyphens"),this.flashNetworkId.trim()||t.push("ESP-NOW Network ID is required"),this.flashPsk.trim()||t.push("ESP-NOW PSK is required"),this.flashWifiSsid.trim()||t.push("WiFi SSID is required"),this.flashWifiPassword.trim()||t.push("WiFi Password is required"),/^[0-9a-fA-F]{64}$/.test(this.flashPsk.trim())||t.push("PSK must be 64 hex characters"),(!this.flashChipName||!Rs[this.flashChipName]||!this.flashBoardInfo)&&t.push("Board selection is required"),t.length>0?(this.flashConfigError=t.join(". ")+".",!1):(this.flashConfigError="",!0)}async onSubmitFlashConfig(){var e;if(!this.validateFlashConfig())return;this.flashStage="compiling",this.flashCompileLog="",this.flashCompilePercent=0,this.flashCompileStatus="",this.flashCompileError="",this.flashFlashError="",this.clearFlashBrowserManifestUrl();const t=this.flashBoardInfo||((e=Rs[this.flashChipName])==null?void 0:e.board_info)||{};try{const i=await C.submitFlashWizard({name:this.flashName.trim(),network_id:this.flashNetworkId.trim(),psk:this.flashPsk.trim(),wifi_ssid:this.flashWifiSsid.trim(),wifi_password:this.flashWifiPassword,api_key:this.flashApiKey,espnow_mode:this.flashEspnowMode,ota_password:this.flashOtaPassword,chip_name:this.flashChipName,board_info:t});this.flashMac=i.mac,this.pollCompileStatus(),this.startCompileLogStream()}catch(i){this.flashCompileError=i instanceof Error?i.message:String(i),this.flashStage="error"}}async pollCompileStatus(){if(!(this.flashStage!=="compiling"||!this.flashMac)){try{const t=await C.getCompileStatus(this.flashMac),e=t.status||"";if(e==="idle"&&(this.flashCompileLog+=`[status: idle — waiting for compile job to start]
`),this.flashCompileStatus=e,this.flashCompilePercent=e==="compiled"?100:e==="failed"?0:e==="compile_queued"?t.queue_position!=null?Math.max(5,100-(t.queue_position||1)*10):5:e==="compiling"?Math.max(this.flashCompilePercent,10):Math.max(this.flashCompilePercent,2),e==="compiled"){this.flashCompilePercent=100,this.flashCompilePollTimer&&(clearInterval(this.flashCompilePollTimer),this.flashCompilePollTimer=null),this.flashCompileLogEs&&(this.flashCompileLogEs.close(),this.flashCompileLogEs=null),await this.updateFlashBrowserManifestUrl(),this.flashStage==="compiling"&&(this.flashStage="flashing");return}if(e==="failed"){this.flashCompileError=t.error||"Compilation failed",this.flashStage="error",this.cleanupFlashTimers();return}}catch(t){this.flashCompileLog+=`[poll error: ${t instanceof Error?t.message:String(t)}]
`}this.flashStage==="compiling"&&(this.flashCompilePollTimer=setTimeout(()=>void this.pollCompileStatus(),2e3))}}startCompileLogStream(){this.flashMac&&(this.flashCompileLogEs=C.streamCompileLogs(this.flashMac,t=>{this.flashCompileLog+=t+`
`},t=>{this.flashCompileLog+=`[SSE error: ${t.type||"connection failed"}]
`}))}get flashCompileStatusLabel(){return{idle:"Waiting to start...",compile_queued:"Queued for compilation...",compiling:"Compiling...",compiled:"Compile complete!",failed:"Compilation failed"}[this.flashCompileStatus]||this.flashCompileStatus}async startDetection(){this.flashStage="detecting",this.flashDetectElapsed=0,this.flashDetectError="",await C.triggerScan().catch(()=>{}),this.flashDetectTimer=setInterval(()=>void this.pollFlashWizardStatus(),2e3)}async pollFlashWizardStatus(){if(this.flashStage!=="detecting"){this.flashDetectTimer&&(clearInterval(this.flashDetectTimer),this.flashDetectTimer=null);return}if(this.flashDetectElapsed+=2,this.flashDetectElapsed>=90){this.flashDetectTimer&&(clearInterval(this.flashDetectTimer),this.flashDetectTimer=null),this.flashDetectError="Bridge not found within 90 seconds. Ensure the bridge is powered on and connected to WiFi.",this.flashStage="error";return}try{(await C.getFlashWizardStatus()).bridge_detected&&(this.flashDetectTimer&&(clearInterval(this.flashDetectTimer),this.flashDetectTimer=null),this.flashStage="complete",this.step1="complete",this.step2="ready",this.pollStatus())}catch{}}resetFlashWizard(){this.cleanupFlashTimers(),this.flashStage="config",this.flashCompileLog="",this.flashCompilePercent=0,this.flashCompileStatus="",this.flashCompileError="",this.flashFlashError="",this.flashDetectElapsed=0,this.flashDetectError="",this.flashMac="",this.flashConfigError=""}cleanupFlashTimers(){this.flashCompilePollTimer&&(clearInterval(this.flashCompilePollTimer),this.flashCompilePollTimer=null),this.flashDetectTimer&&(clearInterval(this.flashDetectTimer),this.flashDetectTimer=null),this.flashCompileLogEs&&(this.flashCompileLogEs.close(),this.flashCompileLogEs=null),this.clearFlashBrowserManifestUrl()}render(){return g`
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
          ${t?g`<span class="collapse-icon">\u25B6</span>`:v}
        </div>

        ${t?v:g`
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
            `:v}

            ${this.step1Choice==="existing"&&this.step1!=="complete"?g`
              <div class="choice-back">
                <button class="btn btn-outline btn-sm" @click=${this.onBackToChoose}>\u2190 Back</button>
              </div>
              <div class="step-tabs">
                <button class="tab ${this.flashTab==="discover"?"active":""}" @click=${()=>this.flashTab="discover"}>Discover</button>
                <button class="tab ${this.flashTab==="manual"?"active":""}" @click=${()=>this.flashTab="manual"}>Manual</button>
                <button class="tab ${this.flashTab==="serial"?"active":""}" @click=${()=>this.flashTab="serial"}>Serial</button>
              </div>
              ${this.flashTab==="discover"?this.renderDiscoverTab():v}
              ${this.flashTab==="manual"?this.renderManualTab():v}
              ${this.flashTab==="serial"?this.renderSerialTab():v}
            `:v}

            ${this.step1Choice==="new"&&this.step1!=="complete"?g`
              <div class="choice-back">
                <button class="btn btn-outline btn-sm" @click=${this.onBackToChoose}>\u2190 Back</button>
              </div>
              ${this.renderFlashTab()}
            `:v}

            ${this.step1==="complete"&&this.step2==="disabled"?g`
              <div class="complete-state">
                <span class="check">\u2705</span>
                <span>${this.bridgeApiStatus||"Bridge connected successfully"}</span>
              </div>
            `:v}
          </div>
        `}
      </div>
    `}renderDiscoverTab(){return g`
      ${this.step1==="scanning"||this.step1==="connecting"||this.step1==="pending"?g`
        <div class="scanning-state">
          <span class="spinner large"></span>
          <p>${this.step1==="scanning"?"Scanning for bridges on your network...":this.step1==="connecting"?"Connecting to bridge...":"Validating bridge connection..."}</p>
        </div>
      `:v}

      ${this.step1==="found"?g`
        ${this.discoveredBridges.length>0?g`
          <div class="bridge-list">
            ${this.discoveredBridges.map(t=>g`
              <div class="bridge-card">
                <div class="bridge-info">
                  <strong>${t.name||t.host}</strong>
                  <span>${t.hostname||t.host}:${t.port}</span>
                  ${t.network_id?g`<span class="net-id">Network: ${t.network_id}</span>`:v}
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
        `:v}
      `:v}

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
      `:v}

      ${this.step1==="error"&&!this.activeBridgeUuid?g`
        <div class="error-block">
          <p>${this.bridgeError||"No bridges found on your network."}</p>
          <button class="btn btn-primary" @click=${this.retryDiscovery}>Rescan</button>
          <span class="hint">You can also try the Manual tab to connect by IP address.</span>
        </div>
      `:v}

      ${this.step1!=="connecting"&&this.step1!=="pending"&&this.step1!=="complete"&&!(this.step1==="error"&&!this.activeBridgeUuid)?g`
        ${this.bridgeError?g`
          <div class="error-block">
            <p>${this.bridgeError}</p>
            <button class="btn btn-outline" @click=${this.retryDiscovery}>Retry</button>
          </div>
        `:v}
      `:v}
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
      `:v}
    `}async scanSerialPorts(){this.serialScanning=!0,this.serialError=null;try{const t=await C.scanSerialPorts();this.serialPorts=t,t.length===0&&(this.serialError="No serial ports found.")}catch(t){this.serialError=t instanceof Error?t.message:String(t)}finally{this.serialScanning=!1}}async connectSerialBridge(){if(!this.serialSelectedPort){this.serialError="Select a serial port";return}this.serialError=null,this.step1="connecting";try{await C.addBridge("",80,this.serialName||void 0,this.serialApiKey||"","","serial",this.serialSelectedPort,this.serialBaud),this.step1="complete",this.step2="ready",this.pollStatus()}catch(t){this.step1="error",this.serialError=t instanceof Error?t.message:String(t)}}renderSerialTab(){return g`
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
      `:v}
    `}renderFlashTab(){return this.flashStage!=="config"?this.renderFlashProgress():g`
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
        `:v}
        ${this.flashConfigError?g`
          <div class="error-block"><p>${this.flashConfigError}</p></div>
        `:v}

        <label>
          ESPHome Name
          <input type="text" placeholder="espnow-bridge" .value=${this.flashName} @input=${t=>this.flashName=t.target.value} />
        </label>

        <label>
          ESP-NOW Network ID
          <input type="text" placeholder="ESP-NOW network name" .value=${this.flashNetworkId} @input=${t=>this.flashNetworkId=t.target.value} />
        </label>

        <label>
          ESP-NOW PSK (64 hex chars)
          <div class="flash-key-row">
            <input type="text" placeholder="32-byte hex key" .value=${this.flashPsk} @input=${t=>this.flashPsk=t.target.value} />
            <button class="btn btn-outline btn-sm" @click=${()=>this.flashPsk=this.generateRandomHex(32)}>Generate</button>
          </div>
        </label>

        <label>
          WiFi SSID
          <input type="text" placeholder="WiFi network name" .value=${this.flashWifiSsid} @input=${t=>this.flashWifiSsid=t.target.value} />
        </label>

        <label>
          WiFi Password
          <input type="password" placeholder="WiFi password" .value=${this.flashWifiPassword} @input=${t=>this.flashWifiPassword=t.target.value} />
        </label>

        <label>
          API Key <span class="muted">(will be remembered by addon)</span>
          <div class="flash-key-row">
            <input type="text" placeholder="Auto-generated" .value=${this.flashApiKey} @input=${t=>this.flashApiKey=t.target.value} />
            <button class="btn btn-outline btn-sm" @click=${()=>this.flashApiKey=this.generateRandomBase64(18)}>Generate</button>
          </div>
        </label>

        <label>
          ESP-NOW Mode
          <select .value=${this.flashEspnowMode} @change=${t=>this.flashEspnowMode=t.target.value}>
            <option value="lr">Long Range (LR)</option>
            <option value="regular">Regular</option>
          </select>
        </label>

        <label>
          OTA Password <span class="muted">(will be remembered by addon)</span>
          <div class="flash-key-row">
            <input type="text" placeholder="Auto-generated" .value=${this.flashOtaPassword} @input=${t=>this.flashOtaPassword=t.target.value} />
            <button class="btn btn-outline btn-sm" @click=${()=>this.flashOtaPassword=this.generateRandomHex(16)}>Generate</button>
          </div>
        </label>

        <label>
          Board
          <div class="flash-key-row">
            <select .value=${this.flashChipName} @change=${t=>this.onFlashChipChange(t.target.value)}>
              <option value="">-- Detect or select board --</option>
              ${Object.entries(Rs).map(([t,e])=>g`
                <option value=${t} ?selected=${this.flashChipName===t}>${e.label}</option>
              `)}
            </select>
            <button class="btn btn-outline btn-sm" @click=${()=>void this.detectFlashBoardInBrowser()} ?disabled=${this.flashBrowserDetecting}>
              ${this.flashBrowserDetecting?"Detecting...":"Detect Connected ESP"}
            </button>
          </div>
        </label>

        ${this.flashDetectedChip?g`<div class="chip-badge detected">Detected: ${this.flashDetectedChip} → ${(Rs[this.flashChipName]||{}).label||this.flashChipName}</div>`:v}
        ${this.flashBrowserDetectError?g`<div class="flash-warning">Automatic detection failed: ${this.flashBrowserDetectError}. You can select the board manually.</div>`:v}

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
          `:v}
          ${this.flashCompilePercent>0?g`
            <div class="progress-bar-container">
              <div class="progress-bar" style="width: ${this.flashCompilePercent}%"></div>
            </div>
            <p class="muted">${this.flashCompilePercent}%</p>
          `:v}
          <div class="flash-log-viewer" id="flash-log-viewer">${this.flashCompileLog}</div>
        </div>
      `:v}

      ${this.flashStage==="flashing"?g`
        <div class="flash-progress-area">
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
            <a class="btn" href=${this.flashMac?C.downloadFactoryBinary(this.flashMac):"#"} download>Download factory .bin</a>
            <a class="btn" href=${this.flashMac?C.downloadCompileBinary(this.flashMac):"#"} download>Download .ota.bin</a>
          </div>
          <p class="muted">
            ${this.browserSupportsUsbFlash?"When the USB flash finishes and the bridge is powered on, continue to detection.":"Browser USB flashing is unavailable here. Flash the downloaded factory binary locally, then continue to detection."}
          </p>
          <div class="flash-error-actions">
            <button class="btn btn-outline" @click=${()=>this.resetFlashWizard()}>Back to Config</button>
            <button class="btn btn-primary" @click=${()=>void this.startDetection()} ?disabled=${!this.flashMac}>I Flashed It, Detect Bridge</button>
          </div>
          ${this.flashCompileLog?g`
            <details class="flash-log-details">
              <summary>View Build Log</summary>
              <div class="flash-log-viewer">${this.flashCompileLog}</div>
            </details>
          `:v}
        </div>
      `:v}

      ${this.flashStage==="detecting"?g`
        <div class="flash-progress-area">
          <h3>Detecting Bridge</h3>
          <p class="muted">Waiting for the bridge to come online (${this.flashDetectElapsed}s elapsed)...</p>
          <div class="scanning-state">
            <span class="spinner large"></span>
            <p>Waiting for bridge to appear on network...</p>
          </div>
        </div>
      `:v}

      ${this.flashStage==="complete"?g`
        <div class="flash-progress-area">
          <div class="complete-state">
            <span class="check">\u2705</span>
            <span>Bridge detected and connected!</span>
          </div>
        </div>
      `:v}

      ${this.flashStage==="error"?g`
        <div class="flash-progress-area">
          <div class="error-block">
            <p>${this.flashCompileError||this.flashFlashError||this.flashDetectError||"An error occurred"}</p>
            <div class="flash-error-actions">
              <button class="btn btn-outline" @click=${()=>this.resetFlashWizard()}>Back to Config</button>
              ${this.flashDetectError?g`
                <button class="btn btn-outline" @click=${()=>{this.flashStage="detecting",this.flashDetectError="",this.startDetection()}}>Retry Scan</button>
                <button class="btn btn-outline" @click=${()=>{this.resetFlashWizard(),this.step1Choice="choose",this.step1="choose"}}>Skip</button>
              `:v}
            </div>
          </div>
          ${this.flashCompileLog?g`
            <details class="flash-log-details">
              <summary>View Log</summary>
              <div class="flash-log-viewer">${this.flashCompileLog}</div>
            </details>
          `:v}
        </div>
      `:v}
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
          ${t?g`<span class="collapse-icon">\u25B6</span>`:v}
        </div>

        ${t?v:g`
          <div class="step-body">
            ${this.step2==="disabled"?g`
              <p class="muted">Connect a bridge first to continue.</p>
            `:v}

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
            `:v}

            ${this.step2==="restarting"?g`
              <div class="scanning-state">
                <span class="spinner large"></span>
                <p>Sending restart request...</p>
              </div>
            `:v}

            ${this.step2==="polling"?g`
              <div class="polling-state">
                <span class="spinner large"></span>
                <p>Waiting for Home Assistant to come back online...</p>
                ${this.pollingSeconds>40?g`
                  <p class="muted">Taking longer than expected. Check if Home Assistant restarted successfully.</p>
                `:v}
              </div>
            `:v}

            ${this.step2==="complete"?g`
              <div class="complete-state">
                <span class="check">\u2705</span>
                <span>
                  Home Assistant is running the ESP Tree integration
                  ${this.runningIntegrationVersion?` ${this.runningIntegrationVersion}`:""}
                </span>
              </div>
            `:v}

            ${this.step2==="error"&&this.restartError?g`
              <div class="error-block">
                <p>Restart failed: ${this.restartError}</p>
                <button class="btn btn-outline" @click=${this.handleRestart}>Retry</button>
              </div>
            `:v}
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
          `:v}

          ${this.step3==="triggering"?g`
            <div class="scanning-state">
              <span class="spinner large"></span>
              <p>Setting up the ESP Tree integration...</p>
            </div>
          `:v}

          ${this.step3==="polling"?g`
            <div class="polling-state">
              <span class="spinner large"></span>
              <p>Waiting for integration to become active...</p>
            </div>
          `:v}

          ${this.step3==="complete"?g`
            <div class="complete-state">
              <span class="check">\u2705</span>
              <span>
                ESP Tree integration is active
                ${this.runningIntegrationVersion?` (${this.runningIntegrationVersion})`:""}
              </span>
            </div>
          `:v}

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
          `:v}

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
          `:v}
        </div>
      </div>
    `}renderDone(){return this.step1!=="complete"||this.step2!=="complete"||this.step3!=="complete"?v:g`
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
    `}};B.MAX_POLL_DURATION_MS=300*1e3;B.MAX_DISCOVERY_DURATION_MS=30*1e3;B.STATUS_POLL_INTERVAL_MS=1e3;B.STATUS_POLL_INTERVAL_S=B.STATUS_POLL_INTERVAL_MS/1e3;B.styles=we`
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
  `;I([y()],B.prototype,"step1",2);I([y()],B.prototype,"step1Choice",2);I([y()],B.prototype,"step2",2);I([y()],B.prototype,"step3",2);I([y()],B.prototype,"discoveredBridges",2);I([y()],B.prototype,"bridgeError",2);I([y()],B.prototype,"manualHost",2);I([y()],B.prototype,"manualPort",2);I([y()],B.prototype,"manualApiKey",2);I([y()],B.prototype,"apiKeyInput",2);I([y()],B.prototype,"selectedBridge",2);I([y()],B.prototype,"restartError",2);I([y()],B.prototype,"integrationError",2);I([y()],B.prototype,"runningIntegrationVersion",2);I([y()],B.prototype,"latestIntegrationVersion",2);I([y()],B.prototype,"integrationDetected",2);I([y()],B.prototype,"bridgeApiStatus",2);I([y()],B.prototype,"statusPollTimer",2);I([y()],B.prototype,"integrationPollTimer",2);I([y()],B.prototype,"integrationFailures",2);I([y()],B.prototype,"pollingSeconds",2);I([y()],B.prototype,"flashTab",2);I([y()],B.prototype,"flashStage",2);I([y()],B.prototype,"flashName",2);I([y()],B.prototype,"flashNetworkId",2);I([y()],B.prototype,"flashPsk",2);I([y()],B.prototype,"flashWifiSsid",2);I([y()],B.prototype,"flashWifiPassword",2);I([y()],B.prototype,"flashApiKey",2);I([y()],B.prototype,"flashEspnowMode",2);I([y()],B.prototype,"flashOtaPassword",2);I([y()],B.prototype,"flashChipName",2);I([y()],B.prototype,"flashBoardInfo",2);I([y()],B.prototype,"flashSecretsWarning",2);I([y()],B.prototype,"flashConfigError",2);I([y()],B.prototype,"flashMac",2);I([y()],B.prototype,"flashCompileLog",2);I([y()],B.prototype,"flashCompilePercent",2);I([y()],B.prototype,"flashCompileStatus",2);I([y()],B.prototype,"flashCompileError",2);I([y()],B.prototype,"flashFlashError",2);I([y()],B.prototype,"flashDetectElapsed",2);I([y()],B.prototype,"flashDetectError",2);I([y()],B.prototype,"flashBrowserManifestUrl",2);I([y()],B.prototype,"serialPorts",2);I([y()],B.prototype,"serialScanning",2);I([y()],B.prototype,"serialSelectedPort",2);I([y()],B.prototype,"serialBaud",2);I([y()],B.prototype,"serialApiKey",2);I([y()],B.prototype,"serialName",2);I([y()],B.prototype,"serialError",2);B=I([ke("esp-setup-wizard")],B);var nC=Object.defineProperty,rC=Object.getOwnPropertyDescriptor,Lt=(t,e,i,s)=>{for(var n=s>1?void 0:s?rC(e,i):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(n=(s?o(e,i,n):o(n))||n);return s&&n&&nC(e,i,n),n};let ot=class extends he{constructor(){super(...arguments),this.route=this.readRoute(),this.queueData=null,this.compileData=null,this.addonConnected=!0,this.bridgeConnected=null,this.bridgeConfigured=null,this.integrationLoaded=null,this.integrationConfigured=!1,this.restartRequired=!1,this.pollTimer=null,this.bridgeStreamHandle=null,this.setupDismissed=!1,this.onHashChange=()=>{this.route=this.readRoute()},this.onSetupDismissed=()=>{this.setupDismissed=!0}}connectedCallback(){super.connectedCallback(),window.addEventListener("hashchange",this.onHashChange),this.addEventListener("setup-dismissed",this.onSetupDismissed),this.bridgeStreamHandle=ug(t=>{this.bridgeConnected=t,this.fetchConfig()}),this.fetchQueue(),this.pollTimer=setInterval(()=>{this.fetchQueue(),this.fetchConfig(),this.checkRestartRequired()},3e3),this.fetchConfig(),this.checkRestartRequired(),this.maybeRedirectToSetup()}async checkRestartRequired(){var t,e;try{const i=await C.restartRequired();this.restartRequired=i.restart_required,this.integrationLoaded=((t=i.integration)==null?void 0:t.loaded)??this.integrationLoaded,this.integrationConfigured=((e=i.integration)==null?void 0:e.configured)??this.integrationConfigured}catch{this.restartRequired=!1}this.maybeRedirectToSetup()}async fetchConfig(){var t,e,i;try{const s=await C.config();this.integrationLoaded=((t=s.integration)==null?void 0:t.loaded)??null,this.integrationConfigured=((e=s.integration)==null?void 0:e.configured)??!1,this.bridgeConfigured=!!(s.active_bridge&&!s.active_bridge.error||(((i=s.integration)==null?void 0:i.bridge_count)??0)>0),this.addonConnected=!0}catch{this.addonConnected=!1,this.bridgeConfigured=!1}this.maybeRedirectToSetup()}needsSetup(){return this.bridgeConfigured===!1||this.restartRequired||!this.integrationConfigured&&this.integrationLoaded===!1}maybeRedirectToSetup(){this.needsSetup()&&this.route.name==="topology"&&!this.setupDismissed&&this.navigate("/setup")}disconnectedCallback(){var t;window.removeEventListener("hashchange",this.onHashChange),this.removeEventListener("setup-dismissed",this.onSetupDismissed),this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null),(t=this.bridgeStreamHandle)==null||t.close(),this.bridgeStreamHandle=null,super.disconnectedCallback()}async fetchQueue(){try{const[t,e]=await Promise.all([C.getQueue(),C.getCompileQueue()]);this.queueData=t,this.compileData=e,this.addonConnected=!0}catch{this.addonConnected=!1}}readRoute(){const t=window.location.hash.replace(/^#\/?/,"");if(t.startsWith("device/")){const e=t.slice(7);return e.endsWith("/config")?{name:"device-config",mac:decodeURIComponent(e.replace(/\/config$/,""))}:{name:"device",mac:decodeURIComponent(e)}}if(t.startsWith("job/")){const e=t.slice(4),[i,s]=e.split("?"),n=parseInt(i,10);let r="/queue";return s&&(r=new URLSearchParams(s).get("from")||"/queue"),{name:"job",jobId:n,from:r}}return t==="settings"?{name:"settings"}:t==="queue"?{name:"queue"}:t==="secrets"?{name:"secrets",from:"/"}:t.startsWith("secrets?")?{name:"secrets",from:new URLSearchParams(t.slice(7)).get("from")||"/"}:t==="activity-log"?{name:"activity-log"}:t==="setup"?{name:"setup"}:{name:"topology"}}navigate(t){window.location.hash=t}render(){if(this.route.name==="setup")return g`<esp-setup-wizard></esp-setup-wizard>`;const t=this.queueData,e=this.compileData,i=(t==null?void 0:t.count)??0,s=(e==null?void 0:e.count)??0,n=!!(t!=null&&t.active_job)&&!["success","failed","aborted","rejoin_timeout","version_mismatch"].includes(t.active_job.status),r=!!(e!=null&&e.active_job),o=(t==null?void 0:t.paused)??!1,a=n||i>0||r||s>0;return g`
      <div class="app-shell">
        ${this.addonConnected?v:g`<div class="connection-banner">Cannot reach addon</div>`}
        ${this.bridgeConnected===!1?g`<div class="connection-banner">Addon cannot reach bridge</div>`:v}

        <header>
          <div class="brand">
            <a class="brand-name" href="#/">ESP-Tree<small>Go where WiFi won't</small></a>
          </div>
          <div class="header-right">
            <nav>
              <button class=${this.route.name==="topology"?"active":""} @click=${()=>this.navigate("/")}>Topology</button>
              <button class=${this.route.name==="queue"?"active":""} @click=${()=>this.navigate("/queue")}>
                Queue${a?g`<span class="badge ${r||n?"loading":""}">${o?"⏸ ":""}${i+s+(n?1:0)}</span>`:v}
              </button>
              <button class=${this.route.name==="settings"?"active":""} @click=${()=>this.navigate("/settings")}>Settings</button>
            </nav>
          </div>
        </header>
        <main>
          ${this.route.name==="topology"?g`<esp-topology-map @node-selected=${l=>this.navigate(`/device/${encodeURIComponent(l.detail)}`)}></esp-topology-map>`:this.route.name==="device"?g`<esp-device-detail .mac=${this.route.mac}></esp-device-detail>`:this.route.name==="device-config"?g`<esp-config-page .mac=${this.route.mac}></esp-config-page>`:this.route.name==="job"?g`<esp-job-page .jobId=${this.route.jobId} .from=${this.route.from}></esp-job-page>`:this.route.name==="queue"?g`<esp-queue-page></esp-queue-page>`:this.route.name==="secrets"?g`<esp-secrets-page .from=${this.route.from}></esp-secrets-page>`:this.route.name==="activity-log"?g`<esp-activity-log-page></esp-activity-log-page>`:g`<esp-settings></esp-settings>`}
        </main>
      </div>
    `}};ot.styles=we`
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
  `;Lt([y()],ot.prototype,"route",2);Lt([y()],ot.prototype,"queueData",2);Lt([y()],ot.prototype,"compileData",2);Lt([y()],ot.prototype,"addonConnected",2);Lt([y()],ot.prototype,"bridgeConnected",2);Lt([y()],ot.prototype,"bridgeConfigured",2);Lt([y()],ot.prototype,"integrationLoaded",2);Lt([y()],ot.prototype,"integrationConfigured",2);Lt([y()],ot.prototype,"restartRequired",2);ot=Lt([ke("espnow-app")],ot);
//# sourceMappingURL=index-miUvHg9u.js.map

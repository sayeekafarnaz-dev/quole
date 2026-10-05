import {readFileSync,writeFileSync} from 'node:fs';
import {openings} from '../server/knowledge.js';
const widget=readFileSync(new URL('../public/widget.js',import.meta.url),'utf8');
const literal=value=>JSON.stringify(value).replace(/</g,'\\u003c');
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Quole — isolated offline preview</title><style>
body{margin:0;padding:32px;background:#F7F6F2;color:#00132D;font:16px Arial,sans-serif}main{max-width:680px}h1{font:36px Georgia,serif}p{line-height:1.6}nav{display:flex;gap:16px;flex-wrap:wrap}a{color:#00132D}aside{border:1px solid #DCDAD1;padding:14px;border-radius:8px;background:white}label{display:block;margin:16px 0}input,select{font:inherit;padding:8px;max-width:100%}footer{margin-top:100vh;color:#8A8474}@media(max-width:600px){body{padding:20px}h1{font-size:27px}}
</style></head><body><main><p>LOCAL PREVIEW · NO LIVE WEBSITE CHANGES</p><h1>Quole in the bottom-right corner</h1><p>This page runs the actual widget code. The chat opens above its launcher. Minimise it to inspect the resting position, then scroll the page: the launcher stays fixed.</p><aside>The original Quole glasses have not been supplied. The labelled rectangle is temporary. No replacement character is drawn. AI requests are disabled in this offline preview.</aside><nav><a href="?site=qlogue">Qlogue</a><a href="?site=adubio">adubio</a><a href="?site=pruque">PruQue</a></nav><label>Existing page form <input aria-label="Existing page form" placeholder="Host-page control"></label><p>For mobile, open this file in a mobile browser or narrow your browser window. This is a standalone test page, not a reproduction of any live website.</p><footer>Page scroll test</footer></main><script>
const openings=${literal(openings)};
const chosen=new URLSearchParams(location.search).get('site');const site=Object.hasOwn(openings,chosen)?chosen:'qlogue';
const originalFetch=window.fetch.bind(window);
window.fetch=async(url,options)=>{
 if(String(url).startsWith('https://quole.preview.invalid/api/config'))return new Response(JSON.stringify({site,opening:openings[site],development:true,assetUrl:null,privacyUrl:'../public/privacy.html'}),{status:200,headers:{'Content-Type':'application/json'}});
 if(String(url).startsWith('https://quole.preview.invalid/api/chat'))return new Response(JSON.stringify({error:'Offline preview: AI sending is disabled. No message has been transmitted.'}),{status:503,headers:{'Content-Type':'application/json'}});
 return originalFetch(url,options);
};
const loader=document.createElement('script');loader.dataset.site=site;
// Inline execution of the real widget. The property supplies its endpoint without loading a remote script.
Object.defineProperty(loader,'src',{value:'https://quole.preview.invalid/widget.js'});
loader.textContent=${literal(widget)};document.body.append(loader);
setTimeout(()=>{const root=document.querySelector('quole-assistant');if(root){root.shadowRoot.querySelector('.privacy').href='../public/privacy.html';root.shadowRoot.querySelector('.launcher').click();}},0);
</script></body></html>`;
writeFileSync(new URL('../preview/index.html',import.meta.url),html);
console.log('Built preview/index.html from the current widget. Offline configuration; no live AI requests.');

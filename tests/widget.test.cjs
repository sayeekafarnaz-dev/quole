const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require(process.env.QUOLE_JSDOM_PATH || 'jsdom');
const source=fs.readFileSync(require('node:path').join(__dirname,'../public/widget.js'),'utf8');
async function fixture(site='qlogue',opts={}){
 const dom=new JSDOM('<!doctype html><html><body><input id="existing"></body></html>',{url:'http://localhost:4310/demo.html',runScripts:'dangerously'});
 const w=dom.window;let posts=[];
 w.AbortSignal=AbortSignal;
 if(opts.saved)w.sessionStorage.setItem(`quole-v1-${site}`,JSON.stringify(opts.saved));
 w.fetch=async(url,init)=>{
  if(url.includes('/api/config'))return {ok:true,json:async()=>({opening:`Hello from ${site}`,development:true,privacyUrl:'/privacy.html',assetUrl:opts.asset || null})};
  posts.push(JSON.parse(init.body));return {ok:!opts.fail,json:async()=>opts.fail?{error:'Service unavailable'}:{answer:opts.answer || 'Test reply: https://pruque.com and enquiries@qlogue.com'}};
 };
 const script=w.document.createElement('script');script.src='http://localhost:4310/widget.js';script.dataset.site=site;
 Object.defineProperty(w.document,'currentScript',{value:script,configurable:true});
 w.eval(source);await new Promise(r=>setImmediate(r));
 const shadow=w.document.querySelector('quole-assistant').shadowRoot;
 return {dom,w,shadow,posts,$:s=>shadow.querySelector(s)};
}
async function send(f,text){f.$('input[type=checkbox]').checked=true;f.$('input[type=text]').value=text;f.$('form').dispatchEvent(new f.w.Event('submit',{bubbles:true,cancelable:true}));await new Promise(r=>setImmediate(r));}
test('all three sites get correct opening, placeholder and accessible controls',async()=>{for(const site of ['qlogue','adubio','pruque']){const f=await fixture(site);try{assert.match(f.$('.messages').textContent,new RegExp(site));assert.match(f.$('.placeholder').textContent,/DEV PLACEHOLDER/);assert.equal(f.$('.panel').hidden,true);assert.equal(f.$('.launcher').getAttribute('aria-label'),'Ask Quole');assert.equal(f.$('.messages').getAttribute('role'),'log');}finally{f.dom.window.close();}}});
test('open, minimise and Escape restore keyboard focus without affecting host form',async()=>{const f=await fixture();try{f.$('.launcher').click();assert.equal(f.$('.panel').hidden,false);assert.equal(f.shadow.activeElement,f.$('input[type=text]'));f.$('input[type=text]').dispatchEvent(new f.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(f.$('.panel').hidden,true);assert.equal(f.shadow.activeElement,f.$('.launcher'));assert.ok(f.w.document.querySelector('#existing'));}finally{f.dom.window.close();}});
test('consent prevents sending and successful response carries multi-turn history',async()=>{const f=await fixture();try{f.$('input[type=text]').value='hello';f.$('form').dispatchEvent(new f.w.Event('submit',{cancelable:true}));await new Promise(r=>setImmediate(r));assert.equal(f.posts.length,0);await send(f,'Tell me about PruQue');await send(f,'What about licensing?');assert.equal(f.posts.length,2);assert.equal(f.posts[1].messages.length,3);assert.equal(f.posts[1].messages[1].role,'assistant');assert.equal(f.$('a[href="https://pruque.com"]').target,'_blank');assert.ok(f.$('a[href="mailto:enquiries@qlogue.com"]'));assert.ok(f.w.sessionStorage.getItem('quole-v1-qlogue'));}finally{f.dom.window.close();}});
test('session restore, expiry and clear',async()=>{const messages=[{role:'user',content:'Earlier question'},{role:'assistant',content:'Earlier answer'}];const f=await fixture('qlogue',{saved:{updated:Date.now(),messages}});try{assert.match(f.$('.messages').textContent,/Earlier answer/);f.$('.clear').click();assert.doesNotMatch(f.$('.messages').textContent,/Earlier answer/);assert.equal(f.w.sessionStorage.getItem('quole-v1-qlogue'),null);}finally{f.dom.window.close();}const stale=await fixture('qlogue',{saved:{updated:Date.now()-31*60000,messages}});try{assert.doesNotMatch(stale.$('.messages').textContent,/Earlier answer/);}finally{stale.dom.window.close();}});
test('error preserves input and avoids storing failed turns',async()=>{const f=await fixture('adubio',{fail:true});try{await send(f,'retry me');assert.match(f.$('.status').textContent,/Service unavailable/);assert.equal(f.$('input[type=text]').value,'retry me');assert.equal(f.w.sessionStorage.getItem('quole-v1-adubio'),null);assert.equal(f.$('.send').disabled,false);}finally{f.dom.window.close();}});
test('model markup remains text and unsafe URLs are not linked',async()=>{const f=await fixture('qlogue',{answer:'<img src=x onerror=alert(1)> https://evil.example/phish'});try{await send(f,'hello');assert.equal(f.$('.messages img'),null);assert.equal(f.$('a[href="https://evil.example/phish"]'),null);assert.match(f.$('.messages').textContent,/<img/);}finally{f.dom.window.close();}});
test('supplied asset replaces development placeholder without redesign',async()=>{const f=await fixture('qlogue',{asset:'https://assets.example/original-quole.svg'});try{assert.equal(f.$('.placeholder'),null);assert.equal(f.$('.launcher img').src,'https://assets.example/original-quole.svg');assert.equal(f.$('.launcher img').alt,'Quole glasses');}finally{f.dom.window.close();}});
test('styles include fixed desktop placement, mobile safe areas and reduced motion',async()=>{const f=await fixture();try{const css=f.$('style').textContent;assert.match(css,/position:fixed;right:24px;bottom:24px/);assert.match(css,/safe-area-inset-bottom/);assert.match(css,/prefers-reduced-motion:reduce/);assert.match(css,/100dvh/);assert.match(css,/\.controls\{[^}]*min-height:0;overflow-y:auto/);}finally{f.dom.window.close();}});

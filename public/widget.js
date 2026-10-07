(() => {
 'use strict';
 const script=document.currentScript;
 if(!script || document.querySelector('quole-assistant')) return;
 const endpoint=new URL(script.src).origin;
 const hostSites={'qlogue.com':'qlogue','www.qlogue.com':'qlogue','adubio.ai':'adubio','www.adubio.ai':'adubio','pruque.com':'pruque','www.pruque.com':'pruque'};
 const site=script.dataset.site || hostSites[location.hostname];
 if(!['qlogue','adubio','pruque'].includes(site)) return;
 const root=document.createElement('quole-assistant');
 const shadow=root.attachShadow({mode:'open'});
 const ttl=30*60*1000, key=`quole-v1-${site}`;
 let config, history=[], lastActive=Date.now(), busy=false, challengeId;
 try {const saved=JSON.parse(sessionStorage.getItem(key));if(saved && Date.now()-saved.updated<ttl && Array.isArray(saved.messages)) {history=saved.messages.filter(m=>m && ['user','assistant'].includes(m.role) && typeof m.content==='string' && m.content.length<=4000).slice(-14);lastActive=saved.updated;}else sessionStorage.removeItem(key);} catch {}
 const persist=()=>{lastActive=Date.now();try{sessionStorage.setItem(key,JSON.stringify({updated:lastActive,messages:history}));}catch{}};
 shadow.innerHTML=`<style>

 :host{
  all:initial;
  position:fixed;
  right:24px;
  bottom:24px;
  z-index:2147483000;
  font:14px 'DM Sans',Arial,sans-serif;
  color:#00132D;
  --mobile-bottom:16px;
 }

 *{box-sizing:border-box}
 button,input{font:inherit}
 button,a,input{touch-action:manipulation}
 button{cursor:pointer}
 button:disabled{cursor:wait;opacity:.6}

 button:focus-visible,
 input:focus-visible,
 a:focus-visible{
  outline:2px solid #9C5A3C;
  outline-offset:2px;
 }

 .launcher{
  display:block;
  opacity:0;
  visibility:hidden;
  transition:opacity .15s ease;
  margin-left:auto;
  border:0;
  background:transparent;
  padding:4px;
  color:#00132D;
  min-height:44px;
  min-width:44px;
 }

 .launcher img{
  width:68px;
  max-height:46px;
  object-fit:contain;
  display:block;
  transition:transform .18s ease;
 }

 .launcher.ready{
  opacity:1;
  visibility:visible;
 }

 .launcher:hover img{
  transform:translateY(-1px);
 }

 :host(.open) .launcher{
  visibility:hidden;
 }

 .placeholder{
  display:block;
  padding:8px;
  border:1px dashed #8A8474;
  background:#F7F6F2;
  font-size:11px;
  width:100px;
 }

 .panel{
  position:absolute;
  right:0;
  bottom:0;
  width:360px;
  height:auto;
  max-height:min(540px,calc(100dvh - 100px));
  display:flex;
  flex-direction:column;
  background:#F7F6F2;
  border:1px solid rgba(0,19,45,.10);
  border-radius:18px;
  box-shadow:0 18px 55px rgba(0,19,45,.13);
  overflow:hidden;
 }

 [hidden]{display:none!important}

 /* Compact before the visitor starts a conversation */
 .messages-wrap{
  position:relative;
  flex:0 1 auto;
  min-height:145px;
  max-height:220px;
  overflow:hidden;
  display:flex;
  flex-direction:column;
  background:#F7F6F2;
  transition:max-height .22s ease,min-height .22s ease;
 }

 :host(.active-chat) .messages-wrap{
  flex:1 1 auto;
  min-height:300px;
  max-height:405px;
 }

 .floating-close{
  position:absolute;
  top:11px;
  right:11px;
  z-index:4;
  width:28px;
  height:28px;
  padding:0;
  display:grid;
  place-items:center;
  border:1px solid rgba(0,19,45,.10);
  border-radius:999px;
  background:rgba(247,246,242,.94);
  color:#00132D;
  font-size:15px;
  line-height:1;
 }

 .floating-close:hover{
  background:#EFEEE8;
 }

 .messages{
  flex:1 1 auto;
  min-height:0;
  width:100%;
  overflow-y:auto;
  overflow-x:hidden;
  padding:45px 16px 46px;
  overscroll-behavior:contain;
  background:#F7F6F2;
  scrollbar-width:thin;
 }

 /* Assistant answers are intentionally flat rather than chat bubbles */
 .message{
  display:block;
  width:auto;
  max-width:100%;
  min-width:0;
  margin:0 0 12px;
  padding:3px 5px 9px;
  border:0;
  border-radius:0;
  background:transparent;
  color:#00132D;
  line-height:1.5;
  white-space:pre-wrap;
  overflow-wrap:anywhere;
  word-break:break-word;
 }

 /* Visitor messages get only a quiet tonal distinction */
 .message.user{
  width:max-content;
  max-width:88%;
  margin:2px 0 14px auto;
  padding:9px 12px;
  border-radius:12px;
  background:#E9ECE8;
  color:#00132D;
 }

 .message.user strong{
  display:none;
 }

 .message-mascot{
  display:inline-block;
  width:35px;
  height:18px;
  object-fit:contain;
  vertical-align:middle;
  margin:0 3px 1px 0;
 }

 .response-prefix{
  display:inline-flex;
  align-items:center;
  vertical-align:middle;
  margin-right:4px;
 }

 .response-colon{
  font-weight:500;
 }

 .message a{
  color:inherit;
  text-decoration:underline;
  text-underline-offset:2px;
 }

 .message-tools{
  position:absolute;
  right:12px;
  bottom:10px;
  display:flex;
  gap:6px;
  align-items:center;
  z-index:2;
 }

 .message-tools a,
 .message-tools .clear{
  width:27px;
  height:27px;
  min-height:27px;
  padding:0;
  display:grid;
  place-items:center;
  border:1px solid rgba(0,19,45,.08);
  border-radius:999px;
  background:rgba(247,246,242,.96);
  color:#00132D;
 }

 .message-tools a:hover,
 .message-tools .clear:hover{
  background:#EFEEE8;
 }

 .controls{
  flex:0 0 auto;
  padding:9px 11px 10px;
  border-top:1px solid rgba(0,19,45,.07);
  background:#F7F6F2;
 }

 .status{
  font-size:9px;
  line-height:1.2;
  color:#9C5A3C;
  min-height:0;
  margin:0 0 3px;
 }

 .status:empty{
  display:none;
 }

 .entry{
  display:flex;
  gap:9px;
  align-items:center;
 }

 input[type=text]{
  width:100%;
  min-width:0;
  height:38px;
  border:1px solid rgba(0,19,45,.12);
  border-radius:11px;
  background:#FFFFFF;
  color:#00132D;
  padding:0 12px;
  font:500 12px 'DM Sans',Arial,sans-serif;
  box-shadow:none;
 }

 input[type=text]::placeholder{
  color:#8A8474;
  opacity:1;
 }

 .send{
  height:38px;
  border:0;
  border-radius:10px;
  background:#9C5A3C;
  color:#FFFFFF;
  padding:0 14px;
  font:600 12px 'DM Sans',Arial,sans-serif;
 }

 .notice{
  font-size:10px;
  line-height:1.3;
  color:#6F6A5E;
  margin:5px 0 3px;
 }

 .consent{
  display:flex;
  gap:5px;
  align-items:flex-start;
  margin:0;
  color:#8A8474;
  font:500 8.5px 'DM Sans',Arial,sans-serif;
  line-height:1.2;
 }

 .consent input{
  margin:0;
  min-width:13px;
  min-height:13px;
  width:13px;
  height:13px;
 }

 .consent a{
  color:#8A8474;
 }

 .challenge{
  max-height:70px;
  overflow:auto;
 }

 @media(max-width:600px){
  :host{
   right:max(12px,env(safe-area-inset-right));
   bottom:calc(
    max(var(--mobile-bottom),env(safe-area-inset-bottom))
    + var(--quole-bottom-offset,0px)
   );
  }

  .panel{
   width:min(350px,calc(100vw - 24px));
   max-height:calc(100dvh - 100px - var(--quole-bottom-offset,0px));
  }

  .messages-wrap{
   min-height:135px;
   max-height:205px;
  }

  :host(.active-chat) .messages-wrap{
   min-height:280px;
   max-height:390px;
  }

  .launcher img{
   width:64px;
  }
 }

 @media(prefers-reduced-motion:reduce){
  *{
   transition:none!important;
   animation:none!important;
  }
 }

</style>
 <section class="panel" hidden role="dialog" aria-label="Website assistant" aria-modal="false"><button type="button" class="close floating-close" aria-label="Minimise">−</button>
 <div class="messages-wrap">
 <div class="messages" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions"></div>
 <div class="message-tools">
   <a href="mailto:enquiries@qlogue.com" aria-label="Contact Qlogue" title="Contact Qlogue">
     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
       <path d="M3 6.5h18v11H3v-11Z" stroke="currentColor" stroke-width="1.6"/>
       <path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
     </svg>
   </a>
   <button type="button" class="clear" aria-label="Clear conversation" title="Clear conversation">
     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
       <path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
     </svg>
   </button>
 </div>
</div>
 <div class="controls"><p class="status" role="status"></p><div class="challenge"></div><form><div class="entry"><input type="text" maxlength="2000" placeholder="Ask anything..." aria-label="Message" required><button class="send" type="submit">Send</button></div>
 <p class="notice">AI-generated. Please don't share confidential, personal or client information.</p>
 <label class="consent consent-bottom"><input type="checkbox" required> <span>I agree to send my messages to Qlogue’s external AI processor. <a class="privacy" target="_blank" rel="noopener noreferrer">Privacy information</a></span></label>
 </form></div></section>
 <button type="button" class="launcher" aria-label="Ask Quole" aria-expanded="false"><span class="placeholder" aria-hidden="true"></span></button>`;
 const $=sel=>shadow.querySelector(sel);
 const panel=$('.panel'), launcher=$('.launcher'), log=$('.messages'), status=$('.status'), input=$('input[type=text]'), consent=$('input[type=checkbox]');
 const safeUrl=value=>{try{const url=new URL(value,endpoint);return ['https:','http:'].includes(url.protocol)?url.href:null;}catch{return null;}};
 function add(role,text){
  const el=document.createElement('div');el.className=`message ${role}`;
  if(role==='user'){
   const label=document.createElement('strong');
   label.textContent='You';
   el.append(label);
  } else {
   const prefix=document.createElement('span');
   prefix.className='response-prefix';

   const mascot=document.createElement('img');
   mascot.className='message-mascot';
   mascot.alt='';
   mascot.src=safeUrl(config?.assetUrl) || `${endpoint}/quole.png`;

   const colon=document.createElement('span');
   colon.className='response-colon';
   colon.textContent=':';

   prefix.append(mascot,colon);
   el.append(prefix);
  }
  // No model-produced HTML. Only known ecosystem domains become clickable.
  for(const part of text.split(/(https:\/\/[^\s]+|enquiries@qlogue\.com)/g)){
   const clean=part.replace(/[.,;!?)]*$/,'');
   let href=clean==='enquiries@qlogue.com'?'mailto:enquiries@qlogue.com':null;
   try{if(new URL(clean).protocol==='https:' && Object.hasOwn(hostSites,new URL(clean).hostname))href=clean;}catch{}
   if(href){const a=document.createElement('a');a.href=href;a.textContent=clean;a.target='_blank';a.rel='noopener noreferrer';el.append(a,part.slice(clean.length));}else el.append(document.createTextNode(part));
  }
  log.append(el);log.scrollTop=log.scrollHeight;
 }
 function render(){
  log.replaceChildren();
  root.classList.toggle('active-chat',history.length>0);
  if(config)add('assistant',config.opening);
  for(const m of history)add(m.role,m.content);
}
 function expire(){if(Date.now()-lastActive>=ttl){history=[];try{sessionStorage.removeItem(key);}catch{}render();status.textContent='Conversation cleared after 30 minutes of inactivity.';lastActive=Date.now();}}
 function toggle(open){expire();panel.hidden=!open;root.classList.toggle('open',open);launcher.setAttribute('aria-expanded',String(open));if(open){input.focus();}else launcher.focus();}
 launcher.addEventListener('click',()=>toggle(panel.hidden));$('.close').addEventListener('click',()=>toggle(false));
 shadow.addEventListener('keydown',e=>{if(e.key==='Escape' && !panel.hidden){e.preventDefault();toggle(false);}});
 $('.clear').addEventListener('click',()=>{
  if(busy)return;
  history=[];
  try{sessionStorage.removeItem(key);}catch{}
  render();
  status.textContent='Conversation cleared.';
  setTimeout(()=>{if(status.textContent==='Conversation cleared.')status.textContent='';},1400);
  input.focus();
});
 setInterval(expire,60000);
 let turnstileLoading;
 function verification(){
  if(!config.turnstileSiteKey)return Promise.resolve(null);
  if(!turnstileLoading)turnstileLoading=new Promise((resolve,reject)=>{
   if(window.turnstile)return resolve();
   const tag=document.createElement('script');tag.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';tag.onload=resolve;tag.onerror=()=>reject(new Error('Verification could not load.'));document.head.append(tag);
  });
  return turnstileLoading.then(()=>new Promise((resolve,reject)=>{
   if(challengeId!==undefined)window.turnstile.remove(challengeId);
   const timer=setTimeout(()=>reject(new Error('Verification timed out. Please try again.')),60000);
   challengeId=window.turnstile.render($('.challenge'),{sitekey:config.turnstileSiteKey,action:'quole',callback:token=>{clearTimeout(timer);resolve(token);},'error-callback':()=>{clearTimeout(timer);reject(new Error('Verification failed. Please try again.'));},'expired-callback':()=>{clearTimeout(timer);reject(new Error('Verification expired. Please try again.'));}});
  }));
 }
 $('form').addEventListener('submit',async e=>{
  e.preventDefault();expire();const text=input.value.trim();if(busy || !text || !consent.checked)return;
  if(!config){status.textContent='Quole is unavailable. Please email enquiries@qlogue.com.';return;}
  busy=true;$('.send').disabled=true;$('.clear').disabled=true;status.textContent='Quole is thinking…';
  const prior=history.slice(-14);
  const messages=[...prior,{role:'user',content:text}];
  root.classList.add('active-chat');
  add('user',text);
  input.value='';
  try{
   const challenge=await verification();
   const response=await fetch(`${endpoint}/api/chat?site=${site}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages,challenge}),credentials:'omit',signal:AbortSignal.timeout(35000)});
   const result=await response.json();if(!response.ok)throw new Error(result.error || 'Quole is unavailable.');
   if(typeof result.answer!=='string')throw new Error('Quole is unavailable.');
   history=[...messages,{role:'assistant',content:result.answer.slice(0,2000)}].slice(-14);persist();add('assistant',result.answer);status.textContent='';
  }catch(error){status.textContent=error.name==='TimeoutError'?'Quole took too long. Please try again or email enquiries@qlogue.com.':error.message;input.value=text;render();}
  finally{busy=false;$('.send').disabled=false;$('.clear').disabled=false;if(challengeId!==undefined){window.turnstile.remove(challengeId);challengeId=undefined;}if(!panel.hidden)input.focus();}
 });
 // Integration can offset the launcher above an existing mobile navigation/CTA.
 if(/^\d{1,3}$/.test(script.dataset.bottomOffset || '')) root.style.setProperty('--quole-bottom-offset',`${script.dataset.bottomOffset}px`);
 (document.body || document.documentElement).append(root);
 fetch(`${endpoint}/api/config?site=${site}`,{credentials:'omit',signal:AbortSignal.timeout(10000)}).then(async response=>{
  if(!response.ok)throw new Error('Quole could not load. Please email enquiries@qlogue.com.');config=await response.json();
  $('.privacy').href=safeUrl(config.privacyUrl) || `${endpoint}/privacy.html`;
  if(config.fontCssUrl){const href=safeUrl(config.fontCssUrl);if(href){const link=document.createElement('link');link.rel='stylesheet';link.href=href;shadow.prepend(link);}}
  if(config.assetUrl){
   const src=safeUrl(config.assetUrl);
   if(src){
    const launcherImg=document.createElement('img');
    launcherImg.alt='';
    launcherImg.onload=()=>{
      launcher.classList.add('ready');
    };
    launcherImg.onerror=()=>{
      launcher.classList.remove('ready');
    };
    launcherImg.src=src;
    $('.placeholder').replaceWith(launcherImg);

    const headerSlot=$('.header-mascot-slot');
    if(headerSlot){
      const headerImg=document.createElement('img');
      headerImg.className='header-mascot';
      headerImg.alt='';
      headerImg.src=src;
      headerSlot.replaceWith(headerImg);
    }
   }
  }
  if(!config.assetUrl && !config.development){root.remove();return;}
  render();if(window!==window.top)status.textContent='Embedded frame: position is relative to this section. Site-wide integration requires confirmation.';
 }).catch(error=>{status.textContent=error.message;$('.privacy').href=`${endpoint}/privacy.html`;});
})();

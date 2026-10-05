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
 :host{all:initial;position:fixed;right:24px;bottom:24px;z-index:2147483000;font:14px 'DM Sans',sans-serif;color:#00132D;--mobile-bottom:16px}
 *{box-sizing:border-box}button,input{font:inherit}button,a,input{touch-action:manipulation}button{cursor:pointer}button:disabled{cursor:wait;opacity:.6}
 button:focus-visible,input:focus-visible,a:focus-visible{outline:3px solid #9C5A3C;outline-offset:3px}
 .launcher{display:block;margin-left:auto;border:0;background:transparent;padding:6px;color:#00132D;position:relative;min-height:44px;min-width:44px}
 .launcher img{width:72px;max-height:50px;object-fit:contain;display:block;transition:transform .18s ease}
 .launcher[aria-expanded=true] img{transform:rotate(-3deg)}
:host(.open) .launcher{visibility:hidden}
:host(.open) .panel{bottom:0}
 .placeholder{display:block;padding:8px;border:1px dashed #8A8474;background:#F7F6F2;font-size:11px;width:110px;line-height:1.4}
 .panel{position:absolute;right:0;bottom:calc(100% + 12px);width:370px;height:min(570px,calc(100dvh - 130px));display:flex;flex-direction:column;background:#F5F5EF;border:1px solid #DCDAD1;border-radius:14px;box-shadow:0 8px 32px #00132D26;overflow:hidden}
 [hidden]{display:none!important}

.floating-close{
  position:absolute;
  top:10px;
  right:10px;
  z-index:4;
  width:34px;
  height:34px;
  padding:0;
  display:grid;
  place-items:center;
  border:1px solid #DCDAD1;
  border-radius:7px;
  background:rgba(247,246,242,.94);
  color:#00132D;
  font-size:18px;
  line-height:1;
}

.floating-close:hover{
  background:#F7F6F2;
}










header button,.clear{border:1px solid #DCDAD1;background:transparent;border-radius:6px;color:#00132D;min-height:34px;padding:5px 8px}
 .messages-wrap{
  position:relative;
  flex:1 1 auto;
  min-height:0;
  overflow:hidden;
  display:flex;
  flex-direction:column;
  background:#F5F5EF;
}
.message-tools{
  position:absolute;
  right:10px;
  bottom:10px;
  display:flex;
  gap:8px;
  align-items:center;
  z-index:2;
}
.message-tools a,
.message-tools .clear{
  width:30px;
  height:30px;
  min-height:30px;
  padding:0;
  display:grid;
  place-items:center;
  border:1px solid rgba(247,246,242,.55);
  border-radius:7px;
  background:rgba(247,246,242,.94);
  color:#00132D;
}
.message-tools a:hover,
.message-tools .clear:hover{
  background:#F7F6F2;
}
.messages{
  flex:1 1 auto;
  min-height:0;
  width:100%;
  overflow-y:auto;
  overflow-x:hidden;
  padding:54px 14px 52px;
  overscroll-behavior:contain;
  background:rgba(98,107,59,0.04);
  scrollbar-gutter:stable;
}.message{
  display:block;
  width:auto;
  max-width:calc(100% - 20px);
  min-width:0;
  line-height:1.55;
  padding:12px 14px;
  border:1px solid #DCDAD1;
  border-radius:9px;
  margin:0 20px 12px 0;
  white-space:pre-wrap;
  overflow-wrap:anywhere;
  word-break:break-word;
  background:#F7F6F2;
  color:#00132D;
}
.message.user{
  margin:0 0 12px 20px;
  max-width:calc(100% - 20px);
  background:#E9ECE8;
  color:#00132D;
  border-color:#D2D5CF;
}.message strong{display:block;font-size:11px;opacity:.8;margin-bottom:4px}
.message-mascot{
  display:inline-block;
  width:42px;
  height:22px;
  object-fit:contain;
  vertical-align:middle;
  margin:0 2px 1px 0;
}
.response-prefix{
  display:inline-flex;
  align-items:center;
  vertical-align:middle;
  margin-right:4px;
}
.response-colon{
  font-weight:600;
  margin-left:0;
}
.message a{color:inherit;text-decoration:underline}
 .controls{
  flex:0 0 auto;
  padding:7px 10px 8px;
  border-top:1px solid #DCDAD1;
  min-height:0;
  overflow:visible;
  background:#F5F5EF;
}.status{font-size:9px;line-height:1.2;color:#9C5A3C;min-height:11px;margin:0 0 3px}.entry{display:flex;gap:6px}input[type=text]{width:100%;min-width:0;border:1px solid #DCDAD1;border-radius:7px;background:white;color:#00132D;padding:7px 10px;font:500 13px 'DM Sans',Arial,sans-serif}.send{border:0;border-radius:7px;background:#9C5A3C;color:white;padding:8px 11px}
 .notice{font-size:9px;line-height:1.25;color:#6F6A5E;margin:5px 0 3px}.consent{font:500 8.5px 'DM Sans',Arial,sans-serif;line-height:1.2;display:flex;gap:5px;align-items:flex-start;color:#8A8474;margin-top:2px}.consent input{margin:0;min-width:13px;min-height:13px;width:13px;height:13px}
.consent-bottom{margin-top:2px;padding-top:0;border-top:0;color:#8A8474;font-size:9px;line-height:1.2}
.consent-bottom a{color:#8A8474}.links{display:flex;gap:14px;align-items:center;flex-wrap:wrap;font-size:11px}a{color:#00132D}.clear{min-height:30px;padding:4px 6px;font-size:11px}.challenge{max-height:80px;overflow:auto}
 @media(max-width:600px){:host{right:max(12px,env(safe-area-inset-right));bottom:calc(max(var(--mobile-bottom),env(safe-area-inset-bottom)) + var(--quole-bottom-offset,0px))}.panel{width:min(370px,calc(100vw - 24px));height:min(550px,calc(100dvh - 140px - var(--quole-bottom-offset,0px)))}.launcher img{width:72px}.placeholder{width:90px}}
 @media(prefers-reduced-motion:reduce){
  *{transition:none!important;animation:none!important}
  .launcher[aria-expanded=true] img{transform:none}
  .header-mascot{animation:none!important}
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
 <p class="notice">AI-generated. Please don’t share confidential information.</p>
 <label class="consent consent-bottom"><input type="checkbox" required> <span>I agree to send my messages to Qlogue’s external AI processor. <a class="privacy" target="_blank" rel="noopener noreferrer">Privacy information</a></span></label>
 </form></div></section>
 <button type="button" class="launcher" aria-label="Open assistant" aria-expanded="false"><span class="placeholder">DEV PLACEHOLDER<br>Replace with original Quole asset</span></button>`;
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
 function render(){log.replaceChildren();if(config)add('assistant',config.opening);for(const m of history)add(m.role,m.content);}
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
  const prior=history.slice(-14);const messages=[...prior,{role:'user',content:text}];add('user',text);input.value='';
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
    launcherImg.alt='Quole glasses';
    launcherImg.src=src;
    launcherImg.onerror=()=>{status.textContent='Quole character could not load.';};
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

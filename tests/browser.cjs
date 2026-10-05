// Real Chrome/Chromium rendering; responses are mocked, no live sites are loaded.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require(process.env.QUOLE_PLAYWRIGHT_PATH || 'playwright');
const results=path.resolve(__dirname,'../test-results/browser');
fs.mkdirSync(results,{recursive:true});
const report={generatedAt:new Date().toISOString(),provider:'mocked',checks:[],status:'running'};
const save=()=>fs.writeFileSync(path.join(results,'report.json'),JSON.stringify(report,null,2));
let browser,context;
async function check(name,fn){await fn();report.checks.push({name,status:'passed'});save();}
(async()=>{
 browser=process.env.QUOLE_CHROME_CDP_URL
  ?await chromium.connectOverCDP(process.env.QUOLE_CHROME_CDP_URL)
  :await chromium.launch({headless:true,...(process.env.QUOLE_CHROME_CHANNEL?{channel:process.env.QUOLE_CHROME_CHANNEL}:{})});
 try{
  context=await browser.newContext({viewport:{width:1440,height:900}});
  let posts=[],fail=false;
  const {openings}=await import('../server/knowledge.js');
  await context.route('http://localhost:4310/**',async route=>{
   const url=new URL(route.request().url());
   if(url.pathname==='/widget.js')return route.fulfill({contentType:'text/javascript',body:fs.readFileSync(path.join(__dirname,'../public/widget.js'),'utf8')});
   if(url.pathname==='/api/config')return route.fulfill({json:{opening:openings[url.searchParams.get('site')],development:true,privacyUrl:'/privacy.html'}});
   if(url.pathname==='/api/chat'){
    posts.push(route.request().postDataJSON());
    return fail?route.fulfill({status:503,json:{error:'Test service unavailable'}}):route.fulfill({json:{answer:'Test response: PruQue — https://pruque.com. Contact enquiries@qlogue.com.'}});
   }
   return route.fulfill({contentType:'text/html',body:fs.readFileSync(path.join(__dirname,'../public/demo.html'),'utf8')});
  });
  const page=await context.newPage();
  const launcher=()=>page.getByRole('button',{name:'Ask Quole',exact:true});
  const message=()=>page.getByRole('textbox',{name:'Message to Quole'});
  async function open(site){await page.goto(`http://localhost:4310/demo.html?site=${site}`);await launcher().click();await page.getByRole('log').getByText(openings[site],{exact:false}).waitFor();}
  for(const site of Object.keys(openings)){
   await check(`${site}: fixed launcher, opening and desktop screenshots`,async()=>{
    await open(site);
    const css=await page.locator('quole-assistant').evaluate(el=>{const s=getComputedStyle(el);return {position:s.position,right:s.right,bottom:s.bottom};});
    assert.deepEqual(css,{position:'fixed',right:'24px',bottom:'24px'});
    await page.screenshot({path:path.join(results,`${site}-desktop-open.png`)});
    await page.getByRole('button',{name:'Minimise Quole'}).click();
    const initial=await launcher().boundingBox();await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
    const after=await launcher().boundingBox();assert.equal(initial.x,after.x);assert.equal(initial.y,after.y);
    await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:path.join(results,`${site}-desktop-closed.png`)});await launcher().click();
   });
   await check(`${site}: multi-turn, contacts, keyboard and host form`,async()=>{
    await page.getByRole('checkbox').check();await message().fill('Tell me about PruQue');await page.getByRole('button',{name:'Send',exact:true}).click();
    await page.getByRole('log').getByText('Test response:',{exact:false}).waitFor();
    assert.equal(await page.getByRole('link',{name:'https://pruque.com'}).getAttribute('href'),'https://pruque.com');
    assert.equal(await page.getByRole('link',{name:'Contact Qlogue',exact:true}).getAttribute('href'),'mailto:enquiries@qlogue.com');
    await message().fill('And licensing?');await page.getByRole('button',{name:'Send',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('quole-assistant').shadowRoot.querySelectorAll('.message.user').length===2 && !document.querySelector('quole-assistant').shadowRoot.querySelector('.send').disabled);
    assert.equal(posts.at(-1).messages.length,3);
    await page.keyboard.press('Escape');assert.equal(await launcher().getAttribute('aria-expanded'),'false');assert.ok(await launcher().evaluate(el=>el.getRootNode().activeElement===el));
    await page.keyboard.press('Enter');assert.equal(await launcher().getAttribute('aria-expanded'),'true');assert.ok(await message().evaluate(el=>el.getRootNode().activeElement===el));
    await page.keyboard.press('Tab');assert.equal(await page.getByRole('button',{name:'Send',exact:true}).evaluate(el=>el.getRootNode().activeElement===el),true);
    await page.getByRole('button',{name:'Minimise Quole'}).click();await page.getByRole('textbox',{name:'Existing form control'}).fill('Host form still works');
    assert.equal(await page.getByRole('textbox',{name:'Existing form control'}).inputValue(),'Host form still works');
   });
   await check(`${site}: navigation history and clear`,async()=>{
    await page.goto(`http://localhost:4310/demo.html?site=${site}&page=second`);await launcher().click();await page.getByRole('log').getByText('And licensing?',{exact:true}).waitFor();
    await page.getByRole('button',{name:'Clear conversation'}).click();assert.equal(await page.getByRole('log').getByText('Test response:',{exact:false}).count(),0);
   });
  }
  for(const size of [{width:360,height:640},{width:375,height:667},{width:390,height:844},{width:768,height:1024},{width:844,height:390}]){
   await check(`responsive bounds and scroll ${size.width}×${size.height}`,async()=>{
    await page.setViewportSize(size);await open('qlogue');
    const box=await page.getByRole('dialog').boundingBox();assert.ok(box.x>=0 && box.x+box.width<=size.width && box.y>=0 && box.y+box.height<=size.height);
    const scroller=await page.getByRole('log').evaluate(el=>({overflow:getComputedStyle(el).overflowY,height:el.clientHeight}));assert.equal(scroller.overflow,'auto');assert.ok(scroller.height>0);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.screenshot({path:path.join(results,`mobile-${size.width}x${size.height}-open.png`)});
    await page.getByRole('button',{name:'Minimise Quole'}).click();await page.screenshot({path:path.join(results,`mobile-${size.width}x${size.height}-closed.png`)});
   });
  }
  await check('real mobile browser context, touch and responsive panel',async()=>{
   const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:3});
   await mobile.route('http://localhost:4310/**',async route=>{const url=new URL(route.request().url());if(url.pathname==='/api/config')return route.fulfill({json:{opening:openings.qlogue,development:true,privacyUrl:'/privacy.html'}});return route.fulfill({contentType:url.pathname==='/widget.js'?'text/javascript':'text/html',body:fs.readFileSync(path.join(__dirname,url.pathname==='/widget.js'?'../public/widget.js':'../public/demo.html'),'utf8')});});
   try{const p=await mobile.newPage();await p.goto('http://localhost:4310/demo.html?site=qlogue');await p.getByRole('button',{name:'Ask Quole',exact:true}).tap();await p.getByRole('log').getByText(openings.qlogue,{exact:false}).waitFor();const b=await p.getByRole('dialog').boundingBox();assert.ok(b.x>=0 && b.x+b.width<=390 && b.y>=0 && b.y+b.height<=844);await p.screenshot({path:path.join(results,'mobile-touch-390x844.png')});}finally{await mobile.close();}
  });
  await check('consent, failure and retry',async()=>{
   await page.setViewportSize({width:1440,height:900});await open('qlogue');const before=posts.length;await message().fill('Check consent');await page.getByRole('button',{name:'Send',exact:true}).click();assert.equal(posts.length,before);
   fail=true;await page.getByRole('checkbox').check();await page.getByRole('button',{name:'Send',exact:true}).click();await page.getByRole('status').getByText('Test service unavailable',{exact:true}).waitFor();assert.equal(await message().inputValue(),'Check consent');assert.equal(await page.getByRole('button',{name:'Send',exact:true}).isDisabled(),false);fail=false;
  });
  await check('reduced motion computed styles',async()=>{
   await page.emulateMedia({reducedMotion:'reduce'});
   assert.equal(await page.locator('quole-assistant').evaluate(el=>getComputedStyle(el.shadowRoot.querySelector('.launcher')).animationName),'none');
   assert.equal(await page.locator('quole-assistant').evaluate(el=>getComputedStyle(el.shadowRoot.querySelector('.launcher')).transitionDuration),'0s');
  });
  report.status='passed';save();console.log(`${report.checks.length} browser checks passed. Screenshots/report: ${results}. AI responses mocked.`);
 }finally{if(context)await context.close();if(browser)await browser.close();}
})().catch(error=>{
 report.status=report.checks.length?'failed':'blocked';report.reason=process.env.QUOLE_CHROME_CDP_URL?'Remote Chrome connection/test failed; inspect locally without sharing endpoint credentials.':String(error.message).slice(0,1500);save();console.error(`Browser suite ${report.status}; see test-results/browser/report.json.`);process.exitCode=1;
});

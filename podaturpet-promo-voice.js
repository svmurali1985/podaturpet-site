/* Optional browser narration. No paid API, microphone, recording or customer data. */
(() => {
 'use strict';
 const video=document.querySelector('.biz-promo-video'),button=document.querySelector('.promo-sound-toggle'),select=document.querySelector('.promo-voice-language'),status=document.querySelector('.promo-sound-status');
 if(!video||!button||!select||!status)return;
 const scripts=window.PodaturpetPromoNarration||{},speech=window.speechSynthesis;
 const names={en:'English',ta:'தமிழ்',hi:'हिन्दी',te:'తెలుగు',kn:'ಕನ್ನಡ',ml:'മലയാളം',ar:'العربية',ms:'Bahasa Melayu',zh:'中文',fr:'Français',de:'Deutsch',es:'Español',pt:'Português',ja:'日本語',ko:'한국어',ru:'Русский',fi:'Suomi',si:'සිංහල'};
 let voices=[],enabled=false,scene=-1,done=true,holding=false,internalSeek=false,generation=0;
 const tamil=()=>document.documentElement.lang.startsWith('ta');
 const sayStatus=(en,ta)=>{status.textContent=tamil()?ta:en;};
 function voiceFor(code){return voices.find(v=>v.localService&&v.lang.toLowerCase().split('-')[0]===code)||voices.find(v=>v.lang.toLowerCase().split('-')[0]===code);}
 function fillVoices(){
  voices=speech?.getVoices?.()||[];
  const wanted=select.value|| (tamil()?'ta':'en');select.replaceChildren();
  Object.entries(names).forEach(([code,name])=>{const o=document.createElement('option');o.value=code;o.textContent=name+(voiceFor(code)?'':' — '+(tamil()?'குரல் இல்லை':'no voice'));o.disabled=!voiceFor(code);select.append(o);});
  select.value=wanted;select.disabled=!voices.some(v=>scripts[v.lang.toLowerCase().split('-')[0]]);
 }
 function drawButton(){
  const label=button.querySelector('[data-site-en]');label.dataset.siteEn=enabled?'Sound off':'Sound on';label.dataset.siteTa=enabled?'ஒலியை நிறுத்துங்கள்':'ஒலியை இயக்குங்கள்';label.textContent=tamil()?label.dataset.siteTa:label.dataset.siteEn;button.setAttribute('aria-pressed',String(enabled));
 }
 function stopVoice(){generation++;speech?.cancel?.();done=true;holding=false;scene=-1;}
 function nextScene(){
  if(!enabled||!holding)return;holding=false;
  if(scene>=6){video.pause();return;}
  internalSeek=true;video.currentTime=(scene+1)*3;
  const playing=video.play();playing?.catch?.(()=>{});narrate(scene+1);
 }
 function narrate(index){
  if(!enabled||index===scene)return;
  const code=select.value,voice=voiceFor(code);scene=index;done=true;video.volume=voice?0.28:0.9;
  if(!voice||!speech||!window.SpeechSynthesisUtterance){sayStatus('Music on. This voice is unavailable on your device; captions remain visible.','இசை ஒலிக்கிறது. இந்த மொழிக் குரல் சாதனத்தில் இல்லை; வசனங்களைப் படிக்கலாம்.');return;}
  speech.cancel();const token=++generation;done=false;
  const utter=new SpeechSynthesisUtterance(scripts[code][index]);utter.voice=voice;utter.lang=voice.lang;utter.rate=1;utter.volume=1;
  utter.onend=()=>{if(token!==generation)return;done=true;nextScene();};
  utter.onerror=()=>{if(token!==generation)return;done=true;holding=false;video.volume=0.9;sayStatus('Music is available. Voice playback was unavailable; use captions or select another voice.','இசை கிடைக்கிறது. குரலை இயக்க முடியவில்லை; வசனங்களைப் படிக்கவும் அல்லது வேறு குரலைத் தேர்வுசெய்யவும்.');const p=video.play();p?.catch?.(()=>{});};
  speech.speak(utter);sayStatus('Music + '+names[code]+' voice. Pause or Sound off at any time.','இசை + '+names[code]+' குரல். எப்போது வேண்டுமானாலும் நிறுத்தலாம்.');
 }
 button.hidden=false;fillVoices();speech?.addEventListener?.('voiceschanged',fillVoices);
 button.addEventListener('click',()=>{
  enabled=!enabled;
  if(!enabled){const wasHolding=holding;stopVoice();video.muted=true;video.loop=true;if(wasHolding){const p=video.play();p?.catch?.(()=>{});}sayStatus('Sound off. You can keep watching the animation.','ஒலி நிறுத்தப்பட்டது. அனிமேஷனைத் தொடர்ந்து பார்க்கலாம்.');}
  else{video.muted=false;video.volume=.3;video.loop=false;if(video.ended||video.currentTime>=20.9)video.currentTime=0;scene=-1;const p=video.play();p?.catch?.(()=>sayStatus('Press Play animation to continue.','தொடர அனிமேஷனை இயக்குங்கள்.'));narrate(Math.min(6,Math.floor(video.currentTime/3)));}
  drawButton();
 });
 select.addEventListener('change',()=>{if(enabled){stopVoice();narrate(Math.min(6,Math.floor(video.currentTime/3)));}});
 video.addEventListener('timeupdate',()=>{
  if(!enabled||holding)return;
  if(!done&&scene>=0&&video.currentTime>=(scene+1)*3-.45){holding=true;video.pause();return;}
  const index=Math.min(6,Math.floor(video.currentTime/3));narrate(index);
 });
 video.addEventListener('pause',()=>{if(enabled&&!holding)speech?.pause?.();});
 video.addEventListener('play',()=>{if(enabled){speech?.resume?.();if(scene<0)narrate(Math.min(6,Math.floor(video.currentTime/3)));}});
 video.addEventListener('seeked',()=>{if(internalSeek){internalSeek=false;return;}if(!enabled)return;stopVoice();if(!video.paused)narrate(Math.min(6,Math.floor(video.currentTime/3)));});
 document.addEventListener('podaturpet:language',()=>{drawButton();fillVoices();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&enabled){enabled=false;stopVoice();video.muted=true;video.loop=true;drawButton();}});
 window.addEventListener('pagehide',stopVoice,{once:true});drawButton();
})();

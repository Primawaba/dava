// Delegated descriptions also cover controls rebuilt during play.
export function installHover(){
 const tip=document.createElement('div');tip.id='game-hover';tip.setAttribute('role','tooltip');tip.hidden=true;document.body.append(tip);let owner=null,timer=null,previous=null;
 const migrate=root=>{if(root.nodeType!==1&&root!==document)return;const nodes=[...(root.matches?.('[title]')?[root]:[]),...root.querySelectorAll('[title]')];for(const el of nodes){const text=el.getAttribute('title');if(text)el.dataset.tooltip=text;el.removeAttribute('title');}};
 const hide=()=>{clearTimeout(timer);tip.hidden=true;if(owner){if(previous===null)owner.removeAttribute('aria-describedby');else owner.setAttribute('aria-describedby',previous);}owner=null;};
 const show=el=>{hide();if(!el?.isConnected||!el.dataset.tooltip)return;owner=el;previous=el.getAttribute('aria-describedby');el.setAttribute('aria-describedby',[previous,tip.id].filter(Boolean).join(' '));tip.textContent=el.dataset.tooltip;tip.hidden=false;const box=el.getBoundingClientRect(),rect=tip.getBoundingClientRect(),margin=10;tip.style.left=Math.max(margin,Math.min(innerWidth-rect.width-margin,box.left+(box.width-rect.width)/2))+'px';tip.style.top=Math.max(margin,box.top>=rect.height+margin?box.top-rect.height-8:Math.min(innerHeight-rect.height-margin,box.bottom+8))+'px';};
 migrate(document);new MutationObserver(records=>{for(const r of records){if(r.type==='attributes')migrate(r.target);else for(const n of r.addedNodes)migrate(n);}if(owner&&!owner.isConnected)hide();}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['title']});
 document.addEventListener('pointerover',e=>{if(e.pointerType==='touch')return;const el=e.target.closest('[data-tooltip]');if(el===owner)return;hide();if(el)timer=setTimeout(()=>show(el),220);});
 document.addEventListener('pointerout',e=>{const el=e.target.closest('[data-tooltip]');if(el&&!el.contains(e.relatedTarget))hide();});
 document.addEventListener('focusin',e=>{if(e.target.matches(':focus-visible'))show(e.target.closest('[data-tooltip]'));});
 document.addEventListener('focusout',hide);document.addEventListener('pointerdown',hide,true);document.addEventListener('click',hide,true);document.addEventListener('scroll',hide,true);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!tip.hidden){e.preventDefault();e.stopPropagation();hide();}},true);window.addEventListener('resize',hide);
 return {hide};
}

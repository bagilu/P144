'use strict';
// All pages remain in the project root. Fragment links resolve against the page URL.
function initializeP144Header(host) {
  const name=location.pathname.split('/').pop()||'index.html';
  const groups={ 'p41.html':'p4.html','p42.html':'p4.html','p43.html':'p4.html','p51.html':'p5.html','p52.html':'p5.html','p53.html':'p5.html','p54.html':'p5.html','p61.html':'p6.html','p62.html':'p6.html','p63.html':'p6.html','p64.html':'p6.html' };
  const active=groups[name]||name;
  host.querySelectorAll('.p144-main-nav a').forEach(link=>{
    const href=link.getAttribute('href');
    if(href===name)link.setAttribute('aria-current','page');
    else if(href===active)link.setAttribute('aria-current','true');
    else link.removeAttribute('aria-current');
  });
  const button=host.querySelector('.p144-menu-toggle'),nav=host.querySelector('#main-nav');
  if(!button||!nav)return;
  const toggles=[...host.querySelectorAll('.p144-submenu-toggle')];
  const panelFor=toggle=>host.querySelector('#'+toggle.getAttribute('aria-controls'));
  const setOpen=(toggle,open)=>{toggle.setAttribute('aria-expanded',String(open));panelFor(toggle).hidden=!open};
  const closeAll=()=>toggles.forEach(toggle=>setOpen(toggle,false));
  const close=()=>{button.setAttribute('aria-expanded','false');nav.classList.remove('p144-menu-open');closeAll()};
  button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));nav.classList.toggle('p144-menu-open',open);if(!open)closeAll()});
  toggles.forEach(toggle=>{
    toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';closeAll();setOpen(toggle,open)});
    toggle.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();closeAll();setOpen(toggle,true);panelFor(toggle).querySelector('a').focus()}});
  });
  document.addEventListener('click',event=>{if(!nav.contains(event.target)&&event.target!==button&&!button.contains(event.target))closeAll()});
  nav.addEventListener('focusout',event=>{if(!nav.contains(event.relatedTarget))closeAll()});
  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape')return;
    const expanded=toggles.find(toggle=>toggle.getAttribute('aria-expanded')==='true');
    if(expanded){event.preventDefault();closeAll();expanded.focus();return}
    if(button.getAttribute('aria-expanded')==='true'){close();button.focus()}
  });
}
async function loadP144Fragment(id,path,initialize) {
  const host=document.getElementById(id);if(!host)return false;
  host.setAttribute('aria-busy','true');
  try {
    const response=await fetch(path);if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const markup=await response.text();
    const template=document.createElement('template');template.innerHTML=markup;
    const selector=id==='site-header'?'header.p144-site-header':'footer.p144-academic-footer';
    if(!template.content.querySelector(selector))throw new Error('Invalid layout fragment');
    host.replaceChildren(template.content);
    if(initialize)initialize(host);
    return true;
  } catch(error) {
    // Keep readable navigation and department identity when offline or fetch is blocked.
    console.warn(`P144: unable to load ${path}`,error);
    return false;
  } finally {host.setAttribute('aria-busy','false')}
}
window.p144LayoutReady=Promise.all([
  loadP144Fragment('site-header','includes/header.html',initializeP144Header),
  loadP144Fragment('site-footer','includes/footer.html')
]);

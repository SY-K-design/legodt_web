document.querySelectorAll('.header-tools a').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));
document.querySelector('.sub-scroll-top')?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
document.querySelectorAll('.swatches button').forEach(btn=>btn.addEventListener('click',()=>{const row=btn.parentElement;row.querySelectorAll('button').forEach(b=>b.classList.remove('active'));btn.classList.add('active')}));

// Invert the scroll-top SVG when the fixed button physically overlaps the footer.
const subScrollTopBtn=document.querySelector('.sub-scroll-top');
const subFooter=document.querySelector('.sub-footer');
function syncSubScrollTopFooter(){
  if(!subScrollTopBtn || !subFooter) return;
  const b=subScrollTopBtn.getBoundingClientRect();
  const f=subFooter.getBoundingClientRect();
  const overlaps=b.bottom>f.top && b.top<f.bottom && b.right>f.left && b.left<f.right;
  document.body.classList.toggle('scrolltop-over-footer',overlaps);
}
window.addEventListener('scroll',syncSubScrollTopFooter,{passive:true});
window.addEventListener('resize',syncSubScrollTopFooter);
syncSubScrollTopFooter();

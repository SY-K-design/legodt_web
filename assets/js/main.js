const cube=document.querySelector('.cube');
const buttons=[...document.querySelectorAll('.face-btn')];
const statusEl=document.querySelector('.status');
const descEl=document.querySelector('.hero-desc');
const navLinks=[...document.querySelectorAll('.topnav a')];
const views=[
  {x:-10,y:0},{x:-10,y:-90},{x:-10,y:-180},{x:-10,y:90},{x:-100,y:0},{x:80,y:0}
];
const descriptions=[
  '투명하게 만나는 새로운 루프 텀블러',
  '작아진 루프, 더 커진 즐거움',
  '포켓몬과 함께 떠나는 여행',
  '고르고 즐기는 나만의 텀블러, 루프 텀블러 모듈',
  '텀꾸 하트 & 튜브 키링 컬렉션',
  '심플하고 유니크한 루프 텀블러 멀티'
];
let timer=null, randomTimer=null, current=0;
function showFace(i,manual=false){
  current=i;
  const v=views[i];
  cube.style.transform=`rotateX(${v.x}deg) rotateY(${v.y}deg)`;
  buttons.forEach((b,n)=>b.classList.toggle('active',n===i));
  if(descEl) descEl.textContent=descriptions[i];
  if(statusEl) statusEl.textContent=manual?`FACE ${i+1} · AUTO ROTATION RESUMES IN 4 SEC`:`AUTO ROTATION · FACE ${i+1}`;
}
function randomFace(){let next;do{next=Math.floor(Math.random()*6)}while(next===current);showFace(next,false)}
function startAuto(){clearInterval(randomTimer);randomTimer=setInterval(randomFace,2200)}
function pauseAndResume(){clearInterval(randomTimer);clearTimeout(timer);timer=setTimeout(startAuto,4000)}
buttons.forEach((btn,i)=>btn.addEventListener('click',()=>{showFace(i,true);pauseAndResume()}));
navLinks.forEach(link=>link.addEventListener('click',()=>{navLinks.forEach(a=>a.classList.remove('active'));link.classList.add('active');}));
showFace(0,false);startAuto();
document.addEventListener('visibilitychange',()=>document.hidden?clearInterval(randomTimer):startAuto());

// ===== SECTION 2 : PRODUCT =====
const productSection=document.querySelector('#product');
const productSlides=[...document.querySelectorAll('.product-slide')];
const slideDots=[...document.querySelectorAll('.slide-dot')];
const productIcons=[...document.querySelectorAll('.product-icon')];
const scrollTopBtn=document.querySelector('.scroll-top-btn');
let productSlide=0, productSlideTimer=null;
function showProductSlide(i){
  productSlide=(i+productSlides.length)%productSlides.length;
  productSlides.forEach((s,n)=>s.classList.toggle('active',n===productSlide));
  slideDots.forEach((d,n)=>d.classList.toggle('active',n===productSlide));
}
function startProductSlides(){clearInterval(productSlideTimer);productSlideTimer=setInterval(()=>showProductSlide(productSlide+1),4200)}
slideDots.forEach((dot,i)=>dot.addEventListener('click',()=>{showProductSlide(i);startProductSlides()}));
productIcons.forEach(link=>{
  const img=link.querySelector('img');
  link.addEventListener('mouseenter',()=>img.src=link.dataset.hover);
  link.addEventListener('mouseleave',()=>img.src=link.dataset.off);
  link.addEventListener('click',e=>e.preventDefault());
});
if(productSection){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting && entry.intersectionRatio>.25){
        productSection.classList.add('icons-entered');
      }
    });
  },{threshold:[0,.25,.55]});
  observer.observe(productSection);
}
if(scrollTopBtn) scrollTopBtn.addEventListener('click',()=>document.querySelector('#home').scrollIntoView({behavior:'smooth'}));
// Explicit section navigation
const homeNav=document.querySelector('.topnav a[href="index.html"]');
const productNav=document.querySelector('.topnav a[href="#product"]');
if(homeNav) homeNav.addEventListener('click',e=>{e.preventDefault();document.querySelector('#home').scrollIntoView({behavior:'smooth'});});
if(productNav) productNav.addEventListener('click',e=>{e.preventDefault();productSection.scrollIntoView({behavior:'smooth'});});
showProductSlide(0);startProductSlides();

// ===== Section-aware fixed header =====
// Keep HOME / PRODUCT state and header inversion synced to actual scroll position.
const syncSectionHeader=()=>{
  if(!productSection) return;
  const headerH=document.querySelector('.site-header')?.offsetHeight||0;
  const productTop=productSection.getBoundingClientRect().top;
  const inProduct=productTop<=headerH+24;
  document.body.classList.toggle('section2-visible',inProduct);
  if(homeNav) homeNav.classList.toggle('active',!inProduct);
  if(productNav) productNav.classList.toggle('active',inProduct);
};
window.addEventListener('scroll',syncSectionHeader,{passive:true});
window.addEventListener('resize',syncSectionHeader);
syncSectionHeader();

// Header utility icons are visual mock links only; keep href="#" without navigation.
document.querySelectorAll('.header-tools a[href="#"]').forEach(link=>{
  link.addEventListener('click',e=>e.preventDefault());
});

// ===== SECTION 3 : STORY stacking cards + SECTION 4 =====
const storySection=document.querySelector('#story');
const contactSection=document.querySelector('#contact');
const storyNav=document.querySelector('.topnav a[href="#story"]');
const contactNav=document.querySelector('.topnav a[href="#contact"]');
const storyCards=[...document.querySelectorAll('.story-card')];
const storyName=document.querySelector('.story-product-name span');
const storyNames=['레이지선데이 스프볼','레이지선데이 파스타볼','레이지선데이 미니볼','레고트의 시그니처 아이템_1','레고트의 시그니처 아이템_2'];
if(storyNav) storyNav.addEventListener('click',e=>{e.preventDefault();storySection?.scrollIntoView({behavior:'smooth'});});
if(contactNav) contactNav.addEventListener('click',e=>{e.preventDefault();contactSection?.scrollIntoView({behavior:'smooth'});});
document.querySelectorAll('.story-more,.contact-more').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));
function syncAllSections(){
  const headerH=document.querySelector('.site-header')?.offsetHeight||0;
  const y=headerH+40;
  const s2=productSection?.getBoundingClientRect();
  const s3=storySection?.getBoundingClientRect();
  const s4=contactSection?.getBoundingClientRect();
  let section='home';
  if(s4 && s4.top<=y) section='contact'; else if(s3 && s3.top<=y) section='story'; else if(s2 && s2.top<=y) section='product';
  document.body.classList.toggle('section2-visible',section==='product');
  document.body.classList.toggle('section3-visible',section==='story');
  document.body.classList.toggle('section4-visible',section==='contact');
  [[homeNav,'home'],[productNav,'product'],[storyNav,'story'],[contactNav,'contact']].forEach(([a,k])=>a?.classList.toggle('active',k===section));
  if(storyCards.length && storyName){
    let active=0;
    storyCards.forEach((card,i)=>{ if(card.getBoundingClientRect().top <= Math.max(180,innerHeight*.38)) active=i; });
    storyName.textContent=storyNames[active];
  }
}
window.addEventListener('scroll',syncAllSections,{passive:true});
window.addEventListener('resize',syncAllSections);
syncAllSections();

// Footer overlap: invert the fixed scroll-top arrow only while it sits on the black footer.
const siteFooter=document.querySelector('.site-footer');
function syncScrollTopFooterContrast(){
  if(!scrollTopBtn || !siteFooter) return;
  const b=scrollTopBtn.getBoundingClientRect();
  const f=siteFooter.getBoundingClientRect();
  const cx=b.left+b.width/2, cy=b.top+b.height/2;
  const overlaps=cx>=f.left && cx<=f.right && cy>=f.top && cy<=f.bottom;
  document.body.classList.toggle('scrolltop-over-footer',overlaps);
}
window.addEventListener('scroll',syncScrollTopFooterContrast,{passive:true});
window.addEventListener('resize',syncScrollTopFooterContrast);
syncScrollTopFooterContrast();

// ===== Cube subpage links: route through the stable, non-rotating scene =====
const cubeScene=cube.closest('.scene');
const cubeLinks=[...cube.querySelectorAll('.face a')];
if(cubeScene){
  cubeScene.addEventListener('click',(e)=>{
    // Keyboard activation retains the focused link's destination.
    // Pointer clicks use the selected face even if 3D hit-testing finds another face.
    const focusedLink=e.detail===0 ? e.target.closest?.('.face a') : null;
    const link=focusedLink || cubeLinks[current];
    const href=link?.getAttribute('href');
    if(!href) return;
    e.preventDefault();
    e.stopPropagation();
    window.open(href, '_blank', 'noopener');
  },true);
}

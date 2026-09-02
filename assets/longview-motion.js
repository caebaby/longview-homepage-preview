(function(){
  if(!document.documentElement.classList.contains('motion-mode')) return;

  var reducedMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var progress=document.createElement('div');
  progress.className='motion-progress';
  progress.setAttribute('aria-hidden','true');
  document.body.appendChild(progress);

  function makeDisclosureGroup(selector,initialIndex){
    var items=Array.prototype.slice.call(document.querySelectorAll(selector));
    if(!items.length) return;
    var hoverCapable=window.matchMedia&&window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    function openItem(item,allowCollapse){
      var willOpen=!(allowCollapse&&item.classList.contains('is-open'));
      items.forEach(function(candidate){
        var active=candidate===item&&willOpen;
        candidate.classList.toggle('is-open',active);
        candidate.setAttribute('aria-expanded',active?'true':'false');
      });
    }

    items.forEach(function(item,index){
      item.setAttribute('tabindex','0');
      item.setAttribute('role','button');
      item.setAttribute('aria-expanded','false');
      item.addEventListener('click',function(){openItem(item,true)});
      item.addEventListener('keydown',function(event){
        if(event.key==='Enter'||event.key===' '){event.preventDefault();openItem(item,true)}
        if(event.key==='ArrowDown'||event.key==='ArrowRight'){
          event.preventDefault();items[(index+1)%items.length].focus();
        }
        if(event.key==='ArrowUp'||event.key==='ArrowLeft'){
          event.preventDefault();items[(index-1+items.length)%items.length].focus();
        }
      });
      if(hoverCapable){
        item.addEventListener('pointerenter',function(){openItem(item,false)});
        item.addEventListener('pointerleave',function(){
          item.classList.remove('is-open');
          item.setAttribute('aria-expanded','false');
        });
      }
      item.addEventListener('focusin',function(){openItem(item,false)});
      item.addEventListener('focusout',function(event){
        if(!item.contains(event.relatedTarget)){
          item.classList.remove('is-open');
          item.setAttribute('aria-expanded','false');
        }
      });
    });
    if(initialIndex>=0)openItem(items[Math.min(initialIndex,items.length-1)],false);
  }

  makeDisclosureGroup('.pain-card',-1);
  makeDisclosureGroup('.svc-card',-1);

  var hero=document.querySelector('.lv-hero');
  var story=document.querySelector('.lv-story-sec');
  var trust=document.querySelector('.trust-bar');
  if(story&&trust&&story.previousElementSibling!==trust)story.parentNode.insertBefore(trust,story);
  var painSection=document.querySelector('.pain-sec');
  var painWrap=painSection&&painSection.querySelector(':scope > .wrap');
  var painCta=painWrap&&painWrap.querySelector('.pain-cta-stage');
  if(painSection&&painCta)painSection.appendChild(painCta);
  var assessmentSection=document.querySelector('.slider-sec');
  var assessmentPanel=assessmentSection&&assessmentSection.querySelector('.section');
  if(assessmentPanel&&window.STAGES&&window.setStage){
    assessmentSection.classList.add('is-awaiting-stage');
    var assessmentGuide=document.createElement('div');
    assessmentGuide.className='lv-assessment-guide';
    assessmentGuide.innerHTML='<ol class="lv-assessment-steps"><li><b>Step 1.</b><span class="lv-assessment-guide-copy">Select your current phase</span></li><li><b>Step 2.</b><span>Answer questions</span></li><li><b>Step 3.</b><span>Get the clarity you need</span></li></ol>';
    var assessmentGuideCopy=assessmentGuide.querySelector('.lv-assessment-guide-copy');
    var assessmentSwitcher=document.createElement('div');
    assessmentSwitcher.className='lv-assessment-switcher';
    assessmentSwitcher.setAttribute('role','tablist');
    assessmentSwitcher.setAttribute('aria-label','Choose your career stage');
    function clearAssessmentPreview(){
      Array.prototype.forEach.call(assessmentSwitcher.children,function(option){option.classList.remove('is-preview')});
      assessmentSection.classList.remove('is-hovering-stage');
      assessmentGuideCopy.textContent='Select your current phase';
    }
    function previewAssessmentOption(button){
      Array.prototype.forEach.call(assessmentSwitcher.children,function(option){option.classList.toggle('is-preview',option===button)});
      assessmentSection.classList.add('is-hovering-stage');
      assessmentGuideCopy.textContent='Click to choose this phase.';
    }
    window.STAGES.forEach(function(stageItem,index){
      var button=document.createElement('button');
      button.type='button';
      button.className='lv-assessment-option';
      button.setAttribute('role','tab');
      button.setAttribute('aria-selected','false');
      button.style.setProperty('--stage-index',index);
      button.innerHTML='<span>'+stageItem.name+'</span><small>'+stageItem.years+'</small><em class="lv-assessment-action">Select&nbsp;&rarr;</em>';
      button.addEventListener('pointerenter',function(event){if(event.pointerType!=='touch')previewAssessmentOption(button)});
      button.addEventListener('focusin',function(){previewAssessmentOption(button)});
      button.addEventListener('click',function(){window.setStage(index,true)});
      assessmentSwitcher.appendChild(button);
    });
    assessmentSwitcher.addEventListener('pointerleave',clearAssessmentPreview);
    assessmentSwitcher.addEventListener('focusout',function(event){
      if(!assessmentSwitcher.contains(event.relatedTarget))clearAssessmentPreview();
    });
    assessmentPanel.parentNode.insertBefore(assessmentGuide,assessmentPanel);
    assessmentPanel.parentNode.insertBefore(assessmentSwitcher,assessmentPanel);
    var originalSetStage=window.setStage;
    function syncAssessmentStage(index){
      Array.prototype.forEach.call(assessmentSwitcher.children,function(button,buttonIndex){
        var active=buttonIndex===index;
        var action=button.querySelector('.lv-assessment-action');
        button.classList.toggle('is-active',active);
        button.setAttribute('aria-selected',active?'true':'false');
        button.tabIndex=index<0||active?0:-1;
        if(action)action.innerHTML=active?'Selected&nbsp;&#10003;':'Select&nbsp;&rarr;';
      });
    }
    window.setStage=function(index,animate){
      originalSetStage(index,animate);
      assessmentSection.classList.remove('is-awaiting-stage');
      syncAssessmentStage(index);
      if(window.openAssess)window.openAssess();
    };
    syncAssessmentStage(-1);
  }
  var processSection=document.querySelector('.process-sec');
  var reelsSection=document.querySelector('.lv-reels-sec');
  if(reelsSection&&!reelsSection.querySelector('.lv-reels-head')){
    var reelsWrap=reelsSection.querySelector('.wrap');
    var reelsRail=reelsSection.querySelector('.lv-reel-rail');
    var reelsHead=document.createElement('div');
    reelsHead.className='lv-reels-head';
    reelsHead.innerHTML='<div><p class="eyebrow-label">LONGVIEW PERSPECTIVES</p><h2 class="lv-reels-title">Straight answers for the decisions in front of you.</h2></div><p class="lv-reels-intro">Short answers from the advisors who work through these decisions every day.</p>';
    if(reelsWrap&&reelsRail)reelsWrap.insertBefore(reelsHead,reelsRail);
  }
  var processAssessmentReminder=document.querySelector('.assessment-reminder--process');
  var processSequenceEnd=processAssessmentReminder||processSection;
  if(processSequenceEnd&&reelsSection&&processSequenceEnd.nextElementSibling!==reelsSection){
    processSequenceEnd.parentNode.insertBefore(reelsSection,processSequenceEnd.nextElementSibling);
  }
  var ticking=false;
  function updateMotion(){
    ticking=false;
    var scrollTop=window.scrollY||document.documentElement.scrollTop;
    var scrollRange=Math.max(document.documentElement.scrollHeight-window.innerHeight,1);
    document.documentElement.style.setProperty('--page-progress',(scrollTop/scrollRange).toFixed(4));
    if(reducedMotion) return;
    if(hero){
      var heroRect=hero.getBoundingClientRect();
      var heroProgress=Math.max(0,Math.min(1,-heroRect.top/Math.max(heroRect.height,1)));
      hero.style.setProperty('--hero-shift',(heroProgress*42).toFixed(1)+'px');
    }
    if(story){
      var storyRect=story.getBoundingClientRect();
      var storyProgress=Math.max(-1,Math.min(1,(window.innerHeight/2-(storyRect.top+storyRect.height/2))/window.innerHeight));
      story.style.setProperty('--story-drift',(storyProgress*22).toFixed(1)+'px');
      story.style.setProperty('--story-drift-opposite',(storyProgress*-8).toFixed(1)+'px');
    }
  }
  function requestMotion(){
    if(ticking)return;
    ticking=true;
    requestAnimationFrame(updateMotion);
  }
  window.addEventListener('scroll',requestMotion,{passive:true});
  window.addEventListener('resize',requestMotion);
  updateMotion();
})();

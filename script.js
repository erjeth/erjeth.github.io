(function(){
  var progressBar = document.querySelector('.progress-bar');
  function updateProgress(){
    if(!progressBar) return;
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  var tabs = document.querySelectorAll('.tabs-inner a');
  var sections = Array.prototype.map.call(tabs, function(a){
    return document.getElementById(a.dataset.tab);
  });

  function setActive(id){
    tabs.forEach(function(a){
      a.classList.toggle('active', a.dataset.tab === id);
    });
  }

  if('IntersectionObserver' in window){
    var navObserver = new IntersectionObserver(function(entries){
      var visible = entries.filter(function(e){ return e.isIntersecting; });
      if(visible.length){
        visible.sort(function(a,b){ return b.intersectionRatio - a.intersectionRatio; });
        setActive(visible[0].target.id);
      }
    }, { rootMargin: '-72px 0px -60% 0px', threshold: [0, 0.1, 0.25, 0.5] });
    sections.forEach(function(s){ if(s) navObserver.observe(s); });

    var revealObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function(el){ revealObserver.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in-view'); });
  }
  setActive(sections[0] ? sections[0].id : 'tugas-1');

  document.querySelectorAll('.copy-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var pre = btn.closest('.code-wrap').querySelector('pre');
      var text = pre.innerText;
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(function(){
          showCopied(btn);
        });
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try{ document.execCommand('copy'); } catch(e){}
        document.body.removeChild(ta);
        showCopied(btn);
      }
    });
  });
  function showCopied(btn){
    var original = btn.textContent;
    btn.textContent = 'Disalin!';
    btn.classList.add('copied');
    setTimeout(function(){
      btn.textContent = original;
      btn.classList.remove('copied');
    }, 1500);
  }
})();

(function(){
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  document.getElementById("year").textContent = new Date().getFullYear();

  /* Mobile nav */
  var hamburgerBtn = document.getElementById("hamburgerBtn");
  var mobilePanel = document.getElementById("mobilePanel");
  function closeMenu(){
    mobilePanel.classList.remove("open");
    hamburgerBtn.classList.remove("open");
    hamburgerBtn.setAttribute("aria-expanded","false");
  }
  hamburgerBtn.addEventListener("click", function(){
    var isOpen = mobilePanel.classList.toggle("open");
    hamburgerBtn.classList.toggle("open", isOpen);
    hamburgerBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  mobilePanel.querySelectorAll("a").forEach(function(a){ a.addEventListener("click", closeMenu); });

  /* Typing effect */
  var phrases = ["Salesforce Certified Professional", "CRM Consultant", "Trailblazer"];
  var typeTarget = document.getElementById("typeTarget");
  if (reduceMotion){
    typeTarget.textContent = phrases[0];
  } else {
    var pIndex = 0, cIndex = 0, deleting = false;
    function tick(){
      var current = phrases[pIndex];
      if (!deleting){
        cIndex++;
        typeTarget.textContent = current.slice(0, cIndex);
        if (cIndex === current.length){ deleting = true; setTimeout(tick, 1400); return; }
      } else {
        cIndex--;
        typeTarget.textContent = current.slice(0, cIndex);
        if (cIndex === 0){ deleting = false; pIndex = (pIndex + 1) % phrases.length; }
      }
      setTimeout(tick, deleting ? 35 : 65);
    }
    tick();
  }

  /* Fade-up reveal, one-shot */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)){
    revealEls.forEach(function(el){ el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){ entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach(function(el){ io.observe(el); });
  }

  /* Directional reveal for skills: enters from left/right going down,
     retreats the same direction when scrolled back above it */
  var xEls = document.querySelectorAll(".reveal-x");
  if (reduceMotion || !("IntersectionObserver" in window)){
    xEls.forEach(function(el){ el.classList.add("in"); });
  } else {
    var ioX = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add("in");
        } else if (entry.boundingClientRect.top > 0){
          entry.target.classList.remove("in");
        }
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -40px 0px" });
    xEls.forEach(function(el){ ioX.observe(el); });
  }

  /* Cert card 3D tilt */
  if (!reduceMotion && !coarsePointer){
    document.querySelectorAll(".cert-card").forEach(function(card){
      card.addEventListener("mousemove", function(e){
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left, y = e.clientY - rect.top;
        var rotateX = ((rect.height / 2) - y) / 10;
        var rotateY = (x - (rect.width / 2)) / 10;
        card.style.transform = "perspective(1000px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) scale3d(1.015,1.015,1.015)";
      });
      card.addEventListener("mouseleave", function(){
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
      });
    });
  }

  /* Glass panel spotlight tracking */
  document.querySelectorAll(".glass-panel").forEach(function(panel){
    panel.addEventListener("mousemove", function(e){
      var r = panel.getBoundingClientRect();
      panel.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
      panel.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
    });
  });

  
  /* Contact form (static hosting — no backend) */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  form.addEventListener("submit", function(e){
    e.preventDefault();
    var name = document.getElementById("cf-name").value.trim();
    var email = document.getElementById("cf-email").value.trim();
    var message = document.getElementById("cf-message").value.trim();
    if (!name || !email || !message){
      status.style.color = "#e5645a";
      status.textContent = "> error: all fields are required";
      return;
    }
    var subject = encodeURIComponent("Portfolio contact from " + name);
    var body = encodeURIComponent(message + "\n\nFrom: " + name + " (" + email + ")");
    window.location.href = "mailto:kirankrishnakr7@gmail.com?subject=" + subject + "&body=" + body;
    status.style.color = "";
    status.textContent = "> opening mail client...";
    form.reset();
  });
})();
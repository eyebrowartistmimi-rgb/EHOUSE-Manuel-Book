(function () {
  "use strict";

  var IMG_DIR = "assets/images/";
  var MAX_PAGES_PROBE = 300; // 将来ページが増えても自動で拾えるように十分大きい上限にしてあります

  var bookEl = document.getElementById("book");
  var loadingEl = document.getElementById("loading");
  var dotsEl = document.getElementById("dots");
  var counterEl = document.getElementById("counter");
  var hintEl = document.getElementById("hint");
  var prevBtn = document.getElementById("prevBtn");
  var nextBtn = document.getElementById("nextBtn");

  var pages = [];      // { el, flipped }
  var current = 0;      // 次にめくる（まだ開いていない）ページのインデックス
  var animating = false;
  var hintDismissed = false;

  function pad(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  function imageExists(src) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () { resolve(true); };
      img.onerror = function () { resolve(false); };
      img.src = src;
    });
  }

  function findPageFiles() {
    var found = [];
    var i = 1;

    function step() {
      if (i > MAX_PAGES_PROBE) {
        return Promise.resolve(found);
      }
      var src = IMG_DIR + "page-" + pad(i) + ".jpg";
      return imageExists(src).then(function (ok) {
        if (!ok) {
          return found;
        }
        found.push(src);
        i += 1;
        return step();
      });
    }

    return step();
  }

  function buildBook(srcList) {
    var total = srcList.length;

    srcList.forEach(function (src, idx) {
      var pageEl = document.createElement("div");
      pageEl.className = "page";
      pageEl.style.zIndex = total - idx;

      var front = document.createElement("div");
      front.className = "page__front";
      front.style.backgroundImage = "url(" + src + ")";

      var num = document.createElement("div");
      num.className = "page__num";
      num.textContent = (idx + 1) + " / " + total;
      front.appendChild(num);

      var back = document.createElement("div");
      back.className = "page__back";

      pageEl.appendChild(front);
      pageEl.appendChild(back);

      pageEl.addEventListener("click", function (evt) {
        dismissHint();
        var rect = bookEl.getBoundingClientRect();
        var x = evt.clientX - rect.left;
        if (x > rect.width / 2) {
          goNext();
        } else {
          goPrev();
        }
      });

      bookEl.appendChild(pageEl);
      pages.push({ el: pageEl, flipped: false });
    });

    updateUI();
  }

  function dismissHint() {
    if (!hintDismissed) {
      hintDismissed = true;
      hintEl.classList.add("hidden");
    }
  }

  function buildDots(total) {
    for (var i = 0; i < total; i++) {
      (function (idx) {
        var dot = document.createElement("div");
        dot.className = "dot";
        dot.addEventListener("click", function () {
          dismissHint();
          goToPage(idx);
        });
        dotsEl.appendChild(dot);
      })(i);
    }
  }

  function updateUI() {
    var total = pages.length;
    var dots = dotsEl.children;
    for (var i = 0; i < dots.length; i++) {
      dots[i].classList.toggle("active", i === Math.min(current, total - 1));
    }
    var shown = Math.min(current + 1, total);
    counterEl.textContent = shown + " / " + total;
    prevBtn.disabled = current <= 0;
    nextBtn.disabled = current >= total;
  }

  function goNext() {
    if (animating || current >= pages.length) return;
    animating = true;
    pages[current].el.classList.add("flipped");
    pages[current].el.style.zIndex = pages.length + current + 1;
    pages[current].flipped = true;
    current += 1;
    updateUI();
    setTimeout(function () { animating = false; }, 900);
  }

  function goPrev() {
    if (animating || current <= 0) return;
    animating = true;
    current -= 1;
    pages[current].el.classList.remove("flipped");
    pages[current].el.style.zIndex = pages.length - current;
    pages[current].flipped = false;
    updateUI();
    setTimeout(function () { animating = false; }, 900);
  }

  function goToPage(idx) {
    if (animating) return;
    if (idx > current) {
      var target = idx + 1;
      var iv = setInterval(function () {
        if (current >= target || current >= pages.length) {
          clearInterval(iv);
          return;
        }
        goNext();
      }, 60);
    } else if (idx < current) {
      var target2 = idx;
      var iv2 = setInterval(function () {
        if (current <= target2 || current <= 0) {
          clearInterval(iv2);
          return;
        }
        goPrev();
      }, 60);
    }
  }

  prevBtn.addEventListener("click", function () { dismissHint(); goPrev(); });
  nextBtn.addEventListener("click", function () { dismissHint(); goNext(); });

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { dismissHint(); goNext(); }
    if (e.key === "ArrowLeft") { dismissHint(); goPrev(); }
  });

  var touchStartX = null;
  bookEl.addEventListener("touchstart", function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  bookEl.addEventListener("touchend", function (e) {
    if (touchStartX === null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      dismissHint();
      if (dx < 0) { goNext(); } else { goPrev(); }
    }
    touchStartX = null;
  }, { passive: true });

  findPageFiles().then(function (srcList) {
    if (loadingEl) loadingEl.remove();

    if (srcList.length === 0) {
      bookEl.innerHTML =
        '<div class="loading">assets/images/ に page-01.jpg から連番で画像を入れてください</div>';
      return;
    }

    buildBook(srcList);
    buildDots(srcList.length);
    updateUI();

    setTimeout(function () {
      if (!hintDismissed) hintEl.classList.add("hidden");
    }, 5000);
  });
})();

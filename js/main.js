/* Mobil menü ve açılır menü davranışları. */
(function () {
  'use strict';

  /* Küçük yardımcılar */
  var sec  = function (s, k) { return (k || document).querySelector(s); };
  var hepsi = function (s, k) { return Array.prototype.slice.call((k || document).querySelectorAll(s)); };

  var ustcubuk   = sec('.ustcubuk');
  if (!ustcubuk) { return; }                 // Sayfada menü yoksa devam etme

  var menu       = sec('#ana-menu', ustcubuk);
  var hamburger  = sec('#hamburger', ustcubuk);
  var acilirBtnlar = hepsi('.acilir-buton', ustcubuk);

  /* 1. Mobil menü */
  function menuyuKapat() {
    if (!menu || !hamburger) { return; }
    menu.classList.remove('acik');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  function menuyuAcKapat() {
    if (!menu || !hamburger) { return; }
    var acik = menu.classList.toggle('acik');
    hamburger.setAttribute('aria-expanded', acik ? 'true' : 'false');
  }

  if (hamburger && menu) {
    hamburger.addEventListener('click', menuyuAcKapat);
  }

  /* 2. Açılır menüler */
  function tumAcilirlariKapat(haric) {
    acilirBtnlar.forEach(function (btn) {
      if (btn === haric) { return; }
      var kutu = document.getElementById(btn.getAttribute('aria-controls'));
      if (kutu) { kutu.classList.remove('acik'); }
      btn.setAttribute('aria-expanded', 'false');
    });
  }

  acilirBtnlar.forEach(function (btn) {
    var kutu = document.getElementById(btn.getAttribute('aria-controls'));
    if (!kutu) { return; }                   // Açılır alan yoksa bu düğmeyi atla

    /* Düğmeye basılınca açılır alanı değiştir */
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var acikMi = kutu.classList.contains('acik');
      tumAcilirlariKapat(btn);
      kutu.classList.toggle('acik', !acikMi);
      btn.setAttribute('aria-expanded', !acikMi ? 'true' : 'false');
    });

    /* Aşağı okla ilk bağlantıya geç */
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        tumAcilirlariKapat(btn);
        kutu.classList.add('acik');
        btn.setAttribute('aria-expanded', 'true');
        var ilk = kutu.querySelector('a');
        if (ilk) { ilk.focus(); }
      }
    });

    /* Menüden çıkınca açılır alanı kapat */
    kutu.addEventListener('focusout', function () {
      window.setTimeout(function () {
        if (!kutu.contains(document.activeElement) && document.activeElement !== btn) {
          kutu.classList.remove('acik');
          btn.setAttribute('aria-expanded', 'false');
        }
      }, 0);
    });
  });

  /* Menü dışına tıklanınca açık alanları kapat */
  document.addEventListener('click', function (e) {
    if (ustcubuk.contains(e.target)) { return; }
    tumAcilirlariKapat(null);
  });

  /* Escape ile menüyü kapat ve odağı geri getir */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') { return; }

    var acikBtn = acilirBtnlar.filter(function (b) {
      return b.getAttribute('aria-expanded') === 'true';
    })[0];

    if (acikBtn) {
      tumAcilirlariKapat(null);
      acikBtn.focus();                       // Odağı düğmeye geri getir
      return;
    }

    if (menu && menu.classList.contains('acik')) {
      menuyuKapat();
      if (hamburger) { hamburger.focus(); }
    }
  });

  /* 3. Bağlantı seçilince menüyü kapat */
  if (menu) {
    hepsi('a', menu).forEach(function (a) {
      a.addEventListener('click', function () {
        menuyuKapat();
        tumAcilirlariKapat(null);
      });
    });
  }

  /* Geniş ekrana geçince mobil menüyü kapat */
  var genis = window.matchMedia('(min-width: 901px)');
  var sifirla = function (mq) { if (mq.matches) { menuyuKapat(); } };
  if (genis.addEventListener) {
    genis.addEventListener('change', sifirla);
  } else if (genis.addListener) {
    genis.addListener(sifirla);              // Eski tarayıcılarda da çalışsın
  }
})();

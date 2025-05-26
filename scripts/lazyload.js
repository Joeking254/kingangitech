document.addEventListener("DOMContentLoaded", function() {
  const lazyElements = document.querySelectorAll('.lazy');

  const lazyLoad = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(lazyLoad, {
    root: null,
    rootMargin: "0px",
    threshold: 0.1
  });

  lazyElements.forEach(el => {
    observer.observe(el);
  });
});

export const vVisible = {
    mounted(el, binding) {
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            binding.value();
            observer.unobserve(el);
          }
        });
      }, { threshold: [0.1] }); 
  
      observer.observe(el);
    },
    unmounted(el) {
      if (el._observer) {
        el._observer.disconnect();
      }
    }
};
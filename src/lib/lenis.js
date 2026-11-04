// Shared Lenis instance, so components (e.g. the mobile menu) can pause scrolling.
let instance = null;
export const setLenis = (lenis) => {
  instance = lenis;
};
export const getLenis = () => instance;

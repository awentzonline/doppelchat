class RateLimiter {
  constructor() {
    this.buckets = {};
  }
  shouldLimit(key, delay) {
    let last = this.buckets[key];
    let now = new Date();
    if (last) {
      let dt = now - last;
      return dt < delay;
    }
    return false;
  }
  used(key) {
    this.buckets[key] = new Date();
  }
  attempt(key, delay, f) {
    if (!this.shouldLimit(key, delay)) {
      f();
      this.used(key);
    }
  }
}

const rateLimiter = new RateLimiter();

export default rateLimiter;

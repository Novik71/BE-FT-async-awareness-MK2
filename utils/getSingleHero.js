module.exports = function(cb) {
  setTimeout(() => {
    cb(null, 'BATMAN');
  }, Math.random() * 2000);
};

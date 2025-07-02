// Placeholder for heavy processing logic
self.onmessage = function (e) {
  const result = e.data.map((item) => item * 2); // Example logic
  self.postMessage(result);
};

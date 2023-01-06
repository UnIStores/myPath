const proxy = require("http-proxy-middleware");

// src/setupProxy.js
module.exports = function (app) {
  console.log("1");
  app.use(
    proxy("/api", {
      target: "https://localhost:8080", // 비즈니스 서버 URL 설정
      changeOrigin: true,
    })
  );
};

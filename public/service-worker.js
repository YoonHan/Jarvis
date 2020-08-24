/* eslint-disable no-undef */

// .js 파일은 네트워크 우선
workbox.routing.registerRoute(/.*\.js/, workbox.strategies.networkFirst());

// .css 파일은 caching 된 자원을 우선적으로 사용하지만 가능한 빨리 해당 캐시를 refresh 한다.
workbox.routing.registerRoute(
  /.*\.css/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "css-cache",
  })
);

// .png 등의 이미지 리소스는 caching 된 것을 우선적으로 사용하나, 캐시의 유효기간을 설정해 놓는다.
// 자주 바뀌지 않거나 최신 상태로 유지할 필요가 없는 리소스에 적합한 전략
workbox.routing.registerRoute(
  /.*\.(?:png|jpg|jpeg|svg|gif)/,
  workbox.strategies.cacheFirst({
    cacheName: "image-cache",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 20,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  })
);

// 웹 폰트 리소스도 캐싱 해 놓는다.
workbox.routing.registerRoute(
  new RegExp("https://fonts.(?:googleapis|gstatic).com/(.*)"),
  workbox.strategies.cacheFirst({
    cacheName: "googleapis",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 30,
      }),
    ],
  })
);

const CACHE_NAME = 'appscuola-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

if(!self.define){let e,s={};const i=(i,t)=>(i=new URL(i+".js",t).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn't register its module`);return e})));self.define=(t,a)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let n={};const o=e=>i(e,c),r={module:{uri:c},exports:n,require:o};s[c]=Promise.all(t.map((e=>r[e]||o(e)))).then((e=>(a(...e),n)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"c54154429a91586134a9b9ee1531fd32"},{url:"/_next/static/2bFydt0tiJciUFoATg5YK/_buildManifest.js",revision:"c155cce658e53418dec34664328b51ac"},{url:"/_next/static/2bFydt0tiJciUFoATg5YK/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/109-ff405b2948f3b0e7.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/117-d126aad3976c786f.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/145-baa62ad05e78a823.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/152-7c77266bea932e66.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/466-57eae62fb7ac0b23.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/54a60aa6-1bf791bf03f297f9.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/648-0bd16bf8c87cd4a3.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/70e0d97a-d7e90a12669aa821.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/847-0504a2ab35d19fb7.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/942-b98e236aa8552a4e.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/969-e8d629d3dc0d2d7c.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/981-83c86053bb18b290.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/app/_not-found/page-a147d8c6aa4a260f.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/app/articles/ar-learning/page-96c838867ebbdb20.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/app/articles/flashcards-techniques/page-213ad3163e119feb.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/app/articles/page-e1392e2cdf2c57b5.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/app/articles/pwa-education/page-4bae6077de3d2218.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/app/dashboard/ai/page-5ea551e2715a666f.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/app/dashboard/calendar/page-41401376e80d9ba8.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/app/dashboard/flashcards/page-03e2ff191e3b5853.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/app/dashboard/layout-c2be2948aee6f2f3.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/app/dashboard/loading-5091425537e019a4.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/app/dashboard/not-found-f1b70743a723b287.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/app/dashboard/notes/page-e1373900f088d8d7.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/app/dashboard/page-bcb45d5a7722c17c.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/app/dashboard/settings/page-ad3bc6efd44e2555.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/app/dashboard/tasks/page-b1b96bfb8fa78663.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/app/layout-66ec64503c77aa14.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/app/page-946f0236205b2b19.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/fd9d1056-eec3fa58fd24e1fd.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/framework-244f580fb294f19a.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/main-11238e0ac80a9e68.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/main-app-e48ae00eef583771.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/pages/_app-158b926467bf1cd8.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/pages/_error-7ba65e1336b92748.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-2a76aad9c16120dc.js",revision:"2bFydt0tiJciUFoATg5YK"},{url:"/_next/static/css/17cf9c15c64ad7c1.css",revision:"17cf9c15c64ad7c1"},{url:"/_next/static/css/20720a659c31249d.css",revision:"20720a659c31249d"},{url:"/_next/static/css/51953f69c0a6b120.css",revision:"51953f69c0a6b120"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/_redirects",revision:"f1f6e1d3b7143d4abcad7be3cd3a529d"},{url:"/icon.png",revision:"7215ee9c7d9dc229d2921a40e899ec5f"},{url:"/icons/icon-192x192.png",revision:"7215ee9c7d9dc229d2921a40e899ec5f"},{url:"/icons/icon-512x512.png",revision:"7215ee9c7d9dc229d2921a40e899ec5f"},{url:"/images/articles/ar-learning.jpg",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"/images/articles/flashcards-techniques.jpg",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"/images/articles/pwa-education.jpg",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"/manifest.json",revision:"7a418c7828e97045d8a6c513b64df53b"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:i,state:t})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));

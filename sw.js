const workboxVersion = '5.1.3';

importScripts(`https://storage.googleapis.com/workbox-cdn/releases/${workboxVersion}/workbox-sw.js`);

workbox.core.setCacheNameDetails({ prefix: "yuhi" });

workbox.core.skipWaiting();

workbox.core.clientsClaim();

workbox.precaching.precacheAndRoute([{"revision":"e7cba64dadd91ed833f35b4d8b05e52d","url":"./algolia.json"},{"revision":"74c8ab2952281d59ff577a5b5da719fe","url":"./css/meme.min.dbb4ffa7ad5658cb5a74e25919c4a3df87cc376532f215da70431a392d5dbbd7.css"},{"revision":"5ebdc6fd7bea29688b90f23b795a3b43","url":"./fonts/glyph-correction.ttf"},{"revision":"12ce5c2c4380aafb8317470f8479cbfb","url":"./fonts/glyph-correction.woff"},{"revision":"8d2a4fd8cbf836428792bdd7f92af172","url":"./fonts/glyph-correction.woff2"},{"revision":"eff61c2f97b602dcb9f4df1fa2309de2","url":"./fonts/iconfont/iconfont.ttf"},{"revision":"07e77b7f833bd8b3dc326d03fa1a1147","url":"./fonts/iconfont/iconfont.woff"},{"revision":"637d2790c65021d1096789ee3885ea5d","url":"./js/meme.min.f62090ee5e9c25e818d517f779f19cc5355ac715cbe2b2318aa5e4d0e7e3b52f.js"},{"revision":"12fb10dd1de3f4a88ea414aa2a44c538","url":"./manifest.json"}]);

workbox.precaching.cleanupOutdatedCaches();

// Images
workbox.routing.registerRoute(
    /\.(?:png|jpg|jpeg|gif|bmp|webp|svg|ico)$/,
    new workbox.strategies.CacheFirst({
        cacheName: "images",
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 30
            }),
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [0, 200]
            })
        ]
    })
);

// Fonts
workbox.routing.registerRoute(
    /\.(?:eot|ttf|woff|woff2)$/,
    new workbox.strategies.CacheFirst({
        cacheName: "fonts",
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 30
            }),
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [0, 200]
            })
        ]
    })
);

// Google Fonts
workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets"
    })
);
workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    new workbox.strategies.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 30
            }),
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [0, 200]
            })
        ]
    })
);

// Static Libraries
workbox.routing.registerRoute(
    /^https:\/\/cdn\.jsdelivr\.net/,
    new workbox.strategies.CacheFirst({
        cacheName: "static-libs",
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 30
            }),
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [0, 200]
            })
        ]
    })
);

workbox.googleAnalytics.initialize();


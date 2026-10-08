// 오프라인에서도 앱이 열리도록 파일을 기기에 저장해 두는 서비스 워커(선택 기능)
const CACHE = 'todoApp-v1';
const FILES = ['./', './index.html', './manifest.json', './icon.svg', './icon-192.png', './icon-512.png'];

// 설치 시: 필요한 파일을 미리 저장
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
  self.skipWaiting();
});

// 활성화 시: 이전 버전 저장소 정리
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});

// 요청 시: 저장된 파일 우선, 없으면 네트워크
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});

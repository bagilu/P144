(() => {
  const gallery = document.getElementById('campus-gallery');
  const status = document.getElementById('campus-gallery-status');
  if (!gallery || !status) return;

  const shuffle = (items) => {
    for (let i = items.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  };

  fetch('data/campus-life-photos.json')
    .then((response) => {
      if (!response.ok) throw new Error('photo data unavailable');
      return response.json();
    })
    .then((photos) => {
      shuffle(photos).forEach((photo, index) => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'p144-campus-photo';
        card.setAttribute('aria-pressed', 'false');
        card.setAttribute('aria-label', `${photo.caption}；點選放大`);
        card.style.setProperty('--photo-tilt', `${(Math.random() * 4 - 2).toFixed(1)}deg`);
        card.style.setProperty('--photo-lift', `${Math.round(Math.random() * 22)}px`);
        card.style.setProperty('--photo-order', index);

        const image = document.createElement('img');
        image.src = photo.src;
        image.alt = photo.caption;
        image.loading = 'lazy';
        image.decoding = 'async';

        const caption = document.createElement('span');
        caption.className = 'p144-campus-photo-caption';
        caption.textContent = photo.caption;
        card.append(image, caption);

        card.addEventListener('click', () => {
          const shouldExpand = !card.classList.contains('is-expanded');
          gallery.querySelectorAll('.p144-campus-photo.is-expanded').forEach((item) => {
            item.classList.remove('is-expanded');
            item.setAttribute('aria-pressed', 'false');
            item.setAttribute('aria-label', `${item.querySelector('img').alt}；點選放大`);
          });
          if (shouldExpand) {
            card.classList.add('is-expanded');
            card.setAttribute('aria-pressed', 'true');
            card.setAttribute('aria-label', `${photo.caption}；已放大，點選縮回`);
          }
        });
        gallery.append(card);
      });
      status.textContent = `共 ${photos.length} 張照片，點選可放大檢視。`;
    })
    .catch(() => {
      status.textContent = '照片暫時無法載入，請稍後再試。';
    });
})();

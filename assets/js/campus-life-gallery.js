(() => {
  const gallery = document.getElementById('campus-gallery');
  const status = document.getElementById('campus-gallery-status');
  const dialog = document.getElementById('campus-photo-dialog');
  const largeImage = document.getElementById('campus-photo-large');
  const largeCaption = document.getElementById('campus-photo-large-caption');
  const closeButton = dialog?.querySelector('.p144-campus-photo-close');
  if (!gallery || !status || !dialog || !largeImage || !largeCaption) return;

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
      shuffle(photos).forEach((photo) => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'p144-campus-photo';
        card.setAttribute('aria-haspopup', 'dialog');
        card.setAttribute('aria-label', `${photo.caption}；檢視大圖`);

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
          largeImage.src = photo.src;
          largeImage.alt = photo.caption;
          largeCaption.textContent = photo.caption;
          dialog.showModal();
          closeButton?.focus();
        });
        gallery.append(card);
      });
      status.textContent = `目前收錄 ${photos.length} 張照片；新增照片後會自動延伸排列。`;
    })
    .catch(() => {
      status.textContent = '照片暫時無法載入，請稍後再試。';
    });

  closeButton?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog || event.target === largeImage) dialog.close();
  });
  dialog.addEventListener('close', () => {
    largeImage.removeAttribute('src');
    largeImage.alt = '';
  });
})();

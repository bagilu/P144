(() => {
  const root = document.querySelector("[data-research-page]");
  if (!root) return;
  const list = root.querySelector("#research-list");
  const count = root.querySelector("#research-count");
  const search = root.querySelector("#research-search");
  const author = root.querySelector("#research-author");
  const year = root.querySelector("#research-year");
  const sort = root.querySelector("#research-sort");
  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[ch]);
  const recordsURL = "data/research.json";

  fetch(recordsURL)
    .then((response) => {
      if (!response.ok) throw new Error("研究資料載入失敗");
      return response.json();
    })
    .then((records) => {
      const years = [...new Set(records.map((item) => Number(item.year)))].sort((a, b) => b - a);
      years.forEach((value) => {
        const option = document.createElement("option");
        option.value = String(value);
        option.textContent = String(value);
        year.append(option);
      });

      function render() {
        const query = search.value.trim().toLocaleLowerCase();
        const chosenAuthor = author.value;
        const chosenYear = year.value;
        const sorted = records.filter((item) => {
          const matchesAuthor = !chosenAuthor || item.author === chosenAuthor;
          const matchesYear = !chosenYear || String(item.year) === chosenYear;
          const haystack = [item.id, item.title, item.author, item.year, item.description, item.citation].join(" ").toLocaleLowerCase();
          return matchesAuthor && matchesYear && (!query || haystack.includes(query));
        }).sort((a, b) => {
          if (sort.value === "year-asc") return a.year - b.year || a.id.localeCompare(b.id);
          if (sort.value === "author") return a.author.localeCompare(b.author, "zh-Hant") || b.year - a.year;
          if (sort.value === "title") return a.title.localeCompare(b.title);
          return b.year - a.year || a.id.localeCompare(b.id);
        });

        count.textContent = "目前顯示 " + sorted.length + " 筆研究成果";
        list.innerHTML = sorted.length ? sorted.map((item) => `
          <article class="p144-research-record">
            <div class="p144-research-record-meta">
              <span class="p144-research-record-id">${escapeHTML(item.id)}</span>
              <span>${escapeHTML(item.year)} 年</span>
              ${item.status ? `<span class="p144-research-status">${escapeHTML(item.status)}</span>` : ""}
            </div>
            <h2>${escapeHTML(item.title)}</h2>
            <p class="p144-research-record-author">作者：${escapeHTML(item.author)}</p>
            <h3>研究內容</h3>
            <p class="p144-research-description">${escapeHTML(item.description)}</p>
            <details class="p144-research-source">
              <summary>APA 書目與來源</summary>
              <p class="p144-research-citation">${escapeHTML(item.citation)}</p>
              <div class="p144-research-source-links">
                <a href="${escapeHTML(item.pure)}" target="_blank" rel="noopener noreferrer">查看 PURE 著作頁 ↗</a>
                ${item.doi ? `<a href="${escapeHTML(item.doi)}" target="_blank" rel="noopener noreferrer">查看 DOI ↗</a>` : ""}
              </div>
            </details>
          </article>`).join("") : '<p class="p144-research-empty">沒有符合條件的研究成果，請調整搜尋或篩選條件。</p>';
      }

      [search, author, year, sort].forEach((control) => control.addEventListener(control === search ? "input" : "change", render));
      render();
    })
    .catch(() => {
      count.textContent = "研究資料暫時無法載入。";
      list.innerHTML = '<p class="p144-research-empty">請稍後重新整理頁面。</p>';
    });
})();
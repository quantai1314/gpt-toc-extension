// Run in a real browser, without dependencies or a ChatGPT login.
document.addEventListener('DOMContentLoaded', async () => {
  const main = document.querySelector('main');
  const results = document.getElementById('results');
  const passed = [];
  const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const headings = () => Array.from(document.querySelectorAll('.toc-text'), e => e.textContent);
  const waitFor = async (predicate, attempts = 60) => {
    for (let i = 0; i < attempts; i++) {
      if (predicate()) return;
      await pause(50);
    }
    throw new Error('Timed out waiting for TOC update');
  };
  const check = async (name, run) => {
    await run();
    passed.push(name);
    results.textContent = passed.map(name => `PASS ${name}`).join('\n');
  };
  const modern = (prompt, title) => `
    <div data-user-message-bubble="true">${prompt}</div>
    <div data-content-search-unit-key="turn:assistant">
      <h4 class="sr-only" data-conversation-role="assistant">ChatGPT said:</h4>
      <div data-chatgpt-selection-message-id="message">
        <div data-markdown-text-style="assistant-message"><h2>${title}</h2></div>
      </div>
    </div>`;
  try {
    await check('English outline labels and translated numeric placeholders are usable', async () => {
      assert(document.getElementById('toc-title').textContent.trim() === 'Shigang · Outline', 'English brand title missing');
      assert(document.querySelector('#chatgpt-toc-toggle span').textContent === 'Outline', 'English entry missing');
      assert(shigangMessage('summary', 2, 5) === '2 responses · 5 headings', 'English counts or placeholders broken');
      assert(shigangMessage('headingCount', 3) === '3 headings', 'English heading count broken');
    });
    await check('Chinese outline labels preserve user content and restore English fallback', async () => {
      document.documentElement.lang = 'zh-CN';
      main.innerHTML = modern('Original user prompt', 'Untranslated heading');
      await waitFor(() => headings().includes('Untranslated heading'));
      assert(document.getElementById('toc-summary').textContent === '1 段回答 · 1 个标题', 'Chinese numeric placeholders broken');
      assert(document.querySelector('.toc-group-title').textContent.includes('问题'), 'Chinese prompt label missing');
      assert(document.querySelector('.toc-group-prompt').textContent === 'Original user prompt', 'User content translated unexpectedly');
      document.documentElement.lang = 'en';
      main.replaceChildren();
      await waitFor(() => document.querySelector('.toc-empty')?.textContent === 'No responses found');
    });
    await check('Empty page initializes without waiting for a reply', async () => {
      assert(document.querySelector('.toc-empty').textContent === 'No responses found', 'Missing empty state');
    });
    await check('Current ChatGPT markup without legacy role attributes', async () => {
      main.innerHTML = modern('Current prompt', 'Current heading');
      await waitFor(() => headings().includes('Current heading'));
      assert(headings().length === 1, 'Screen-reader role heading leaked into TOC');
      assert(document.querySelector('.toc-group-prompt').textContent === 'Current prompt', 'Prompt missing');
    });
    await check('Legacy markup and nested modern markup do not duplicate replies', async () => {
      main.innerHTML = '<div data-message-author-role="user">Legacy prompt</div><div data-message-author-role="assistant"><div data-markdown-text-style="assistant-message"><h2>Legacy heading</h2><h3>Child heading</h3></div></div>';
      await waitFor(() => headings().includes('Legacy heading'));
      assert(document.querySelectorAll('.toc-group-header').length === 1, 'Duplicated reply');
      assert(headings().length === 2, 'Headings missing');
    });
    await check('One prompt can have multiple replies and markdown blocks', async () => {
      main.innerHTML = modern('First prompt', 'First heading') + '<div data-markdown-text-style="assistant-message"><h2>Second reply</h2></div>';
      main.querySelector('[data-chatgpt-selection-message-id]').insertAdjacentHTML('beforeend', '<div data-markdown-text-style="assistant-message"><h3>Another block</h3></div>');
      await waitFor(() => headings().includes('Second reply'));
      assert(document.querySelectorAll('.toc-group-header').length === 2, 'Blocks not grouped by message');
      assert(Array.from(document.querySelectorAll('.toc-group-prompt')).every(e => e.textContent === 'First prompt'), 'Prompt paired by array index');
    });
    await check('User headings and unrelated markdown are excluded', async () => {
      main.innerHTML = '<div class="markdown"><h2>Unrelated</h2></div><div data-user-message-bubble="true"><h2>User heading</h2></div><div data-markdown-text-style="assistant-message"><h2>Assistant only</h2></div>';
      await waitFor(() => headings().includes('Assistant only'));
      assert(headings().join() === 'Assistant only', 'Included non-assistant headings');
    });
    await check('Earlier replies update even when the last reply is unchanged', async () => {
      main.innerHTML = modern('Prompt', 'Earlier') + '<div data-markdown-text-style="assistant-message"><h2>Unchanged last reply</h2></div>';
      await waitFor(() => headings().includes('Earlier'));
      main.querySelector('h2').firstChild.data = 'Edited earlier heading';
      await waitFor(() => headings().includes('Edited earlier heading'));
    });
    await check('Streaming text, heading insertion, and heading removal update', async () => {
      const reply = main.querySelector('[data-markdown-text-style]');
      reply.insertAdjacentHTML('beforeend', '<h3>Streaming</h3>');
      await waitFor(() => headings().includes('Streaming'));
      reply.querySelector('h3').firstChild.data = 'Streaming complete';
      await waitFor(() => headings().includes('Streaming complete'));
      reply.querySelector('h3').remove();
      await waitFor(() => !headings().includes('Streaming complete'));
    });
    await check('Opening the sidebar refreshes immediately', async () => {
      main.innerHTML = modern('Open prompt', 'Immediate refresh');
      document.getElementById('chatgpt-toc-toggle').click();
      assert(headings().includes('Immediate refresh'), 'Open did not refresh');
    });
    await check('HTML-looking prompts and headings remain literal text', async () => {
      main.innerHTML = modern('&lt;img src=x&gt;', '&lt;b&gt;literal&lt;/b&gt; &amp; text');
      await waitFor(() => headings().includes('<b>literal</b> & text'));
      assert(!document.querySelector('#toc-content img, #toc-content b'), 'Text interpreted as HTML');
    });
    await check('Rendered Markdown formatting is preserved without copying links or handlers', async () => {
      main.innerHTML = modern('<em>Rich prompt</em>', '<strong>Bold</strong> <em>italic</em> <code>size</code> <sup>2</sup> <a href="javascript:void(0)" onclick="void(0)">link text</a><img src="data:," onerror="void(0)"><button>Copy control</button>');
      await waitFor(() => document.querySelector('.toc-text strong'));
      assert(document.querySelector('.toc-group-prompt em'), 'Prompt format lost');
      for (const tag of ['strong', 'em', 'code', 'sup']) assert(document.querySelector(`.toc-text ${tag}`), `Lost ${tag}`);
      assert(document.querySelector('.toc-text').textContent.includes('link text'), 'Link text lost');
      assert(!document.querySelector('.toc-text a, .toc-text img, .toc-text button, .toc-text [onclick], .toc-text [onerror]'), 'Unsafe elements copied');
    });
    const fraction = '<math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mfrac><msup><mi>x</mi><mn>2</mn></msup><mi>y</mi></mfrac></mrow><annotation encoding="application/x-tex">\\frac{x^2}{y}</annotation><annotation-xml encoding="text/html"><img src="data:," onerror="void(0)"></annotation-xml></semantics></math>';
    await check('KaTeX formulas render once with fractions and powers, without TeX annotations', async () => {
      main.innerHTML = modern('Math prompt', `Fraction <span data-math-source="formula"><span class="katex"><span class="katex-mathml">${fraction}</span><span class="katex-html" aria-hidden="true">DUPLICATE</span></span></span>`);
      await waitFor(() => document.querySelector('.toc-text mfrac'));
      assert(document.querySelectorAll('.toc-text math').length === 1, 'Formula duplicated');
      assert(document.querySelector('.toc-text msup'), 'Power lost');
      assert(!document.querySelector('.toc-text annotation, .toc-text annotation-xml, .toc-text img, .toc-text .katex-html'), 'Hidden math output copied');
      assert(!document.querySelector('.toc-text').textContent.includes('DUPLICATE') && !document.querySelector('.toc-text').textContent.includes('\\frac'), 'Formula source leaked');
      assert(document.querySelector('.toc-text math').namespaceURI === 'http://www.w3.org/1998/Math/MathML', 'MathML namespace lost');
      let jumped = false;
      main.querySelector('h2').scrollIntoView = () => { jumped = true; };
      document.querySelector('.toc-text mi').dispatchEvent(new MouseEvent('click', { bubbles: true }));
      assert(jumped, 'Clicking a formula does not navigate');
    });
    await check('Native MathML and MathJax assistive MathML preserve matrices and remove attributes', async () => {
      main.innerHTML = modern('Native math', '<mjx-container><mjx-assistive-mml aria-hidden="true"><math><mtable columnalign="center" onclick="void(0)" style="color:red"><mtr><mtd><mi>a</mi></mtd><mtd><mi>b</mi></mtd></mtr></mtable></math></mjx-assistive-mml><span aria-hidden="true">Visual duplicate</span></mjx-container>');
      await waitFor(() => document.querySelector('.toc-text mtable'));
      const table = document.querySelector('.toc-text mtable');
      assert(table.getAttribute('columnalign') === 'center', 'Matrix alignment lost');
      assert(!table.hasAttribute('onclick') && !table.hasAttribute('style'), 'Unsafe math attributes copied');
      assert(document.querySelector('.toc-text').textContent === 'ab', 'MathJax formula duplicated');
    });
    await check('Same-text formatting changes and late math rendering update the directory', async () => {
      main.innerHTML = modern('Formatting', 'Same words');
      await waitFor(() => headings().includes('Same words'));
      main.querySelector('h2').innerHTML = '<strong>Same words</strong>';
      await waitFor(() => document.querySelector('.toc-text strong'));
      main.querySelector('h2').innerHTML = '<span data-math-source="x">x</span>';
      await waitFor(() => headings().includes('x'));
      main.querySelector('h2 span').innerHTML = '<span class="katex"><span class="katex-mathml"><math><mi>x</mi></math></span><span aria-hidden="true">x</span></span>';
      await waitFor(() => document.querySelector('.toc-text math'));
      main.querySelector('mi').setAttribute('mathvariant', 'normal');
      await waitFor(() => document.querySelector('.toc-text mi')?.getAttribute('mathvariant') === 'normal');
    });
    await check('Prompt formulas stay complete and long formulas fit inside the sidebar', async () => {
      // Keep the source formula horizontally scrollable, as in a rendered chat.
      // Otherwise it occupies the entire viewport and correctly closes the adaptive sidebar.
      main.innerHTML = modern('P'.repeat(198) + fraction + ' trailing text', `<span style="display:block;max-width:100%;overflow-x:auto"><math><mrow>${'<mi>x</mi><mo>+</mo>'.repeat(80)}<mn>1</mn></mrow></math></span>`);
      await waitFor(() => document.querySelector('.toc-text math mo'));
      assert(document.querySelector('.toc-group-prompt mfrac msup'), 'Prompt formula was cut');
      assert(document.querySelector('.toc-group-prompt').textContent.endsWith('…'), 'Prompt length limit missing');
      const wrapper = document.querySelector('.toc-text .toc-math');
      assert(wrapper.scrollWidth > wrapper.clientWidth, 'Long formula has no horizontal scrolling');
      const sidebar = document.getElementById('chatgpt-toc-sidebar');
      assert(sidebar.scrollWidth <= sidebar.clientWidth + 1, 'Formula expands sidebar width');
    });
    await check('Same-text DOM replacement refreshes navigation targets', async () => {
      main.innerHTML = modern('Navigation', 'Target');
      await waitFor(() => headings().includes('Target'));
      const oldHeading = main.querySelector('h2');
      main.innerHTML = modern('Navigation', 'Target');
      const newHeading = main.querySelector('h2');
      let target = null;
      oldHeading.scrollIntoView = () => { target = oldHeading; };
      newHeading.scrollIntoView = () => { target = newHeading; };
      await pause(350);
      document.querySelector('.toc-item').click();
      assert(target === newHeading, 'Navigation points to removed DOM');
    });
    await check('Replies without headings have a distinct empty state', async () => {
      main.innerHTML = '<div data-markdown-text-style="assistant-message"><p>Plain answer</p></div>';
      await waitFor(() => document.querySelector('.toc-empty')?.textContent === 'No headings in this response');
    });
    await check('Navigation clears collapse state even when reply text matches', async () => {
      main.innerHTML = modern('Same prompt', 'Same heading');
      await waitFor(() => headings().includes('Same heading'));
      document.querySelector('.toc-group-collapse-icon').click();
      assert(document.querySelector('.toc-group-content').style.display === 'none', 'Collapse failed');
      history.pushState({}, '', 'regression-other');
      await waitFor(() => document.querySelector('.toc-group-content').style.display === 'block');
      history.replaceState({}, '', 'regression.html');
    });
    await check('Removing all replies clears stale TOC entries', async () => {
      main.replaceChildren();
      await waitFor(() => document.querySelector('.toc-empty')?.textContent === 'No responses found');
      assert(headings().length === 0, 'Stale headings');
    });
    await check('Late role attributes trigger detection', async () => {
      main.innerHTML = '<div id="late-reply"><h2>Late reply</h2></div>';
      await pause(300);
      main.firstElementChild.setAttribute('data-markdown-text-style', 'assistant-message');
      await waitFor(() => headings().includes('Late reply'));
    });
    await check('TOC mutations do not trigger an observer rendering loop', async () => {
      main.innerHTML = modern('Stable prompt', 'Stable heading');
      await waitFor(() => headings().includes('Stable heading'));
      let writes = 0;
      const observer = new MutationObserver(() => writes++);
      observer.observe(document.getElementById('toc-content'), { childList: true, subtree: true });
      main.querySelector('h2').insertAdjacentHTML('afterend', '<p>Body-only change</p>');
      await pause(650);
      observer.disconnect();
      assert(writes === 0, `Unnecessary TOC renders: ${writes}`);
    });
    const cachedWorkspace = document.createElement('div');
    cachedWorkspace.style.display = 'none';
    cachedWorkspace.innerHTML = `<main style="width:2000px">${modern('Cached prompt', 'Cached old heading')}</main>`;
    const nextWorkspace = document.createElement('div');
    nextWorkspace.style.display = 'none';
    nextWorkspace.innerHTML = `<main>${modern('Next prompt', 'Next chat heading')}</main>`;
    const nextMain = nextWorkspace.querySelector('main');
    main.before(cachedWorkspace);
    main.after(nextWorkspace);
    await check('Inactive cached main before the active chat is excluded', async () => {
      main.innerHTML = modern('Active prompt', 'Active chat heading');
      await waitFor(() => headings().includes('Active chat heading'));
      assert(headings().join() === 'Active chat heading', 'Read a cached hidden workspace');
    });
    await check('URL-first chat switch waits for the visible workspace and keeps width preference', async () => {
      const panel = document.getElementById('chatgpt-toc-sidebar');
      panel.querySelector('.toc-width-reset').click();
      panel.querySelector('.toc-resize-handle').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      panel.querySelector('.toc-group-collapse-icon').click();
      history.pushState({}, '', 'regression-next-chat');
      // The new URL arrives before ChatGPT finishes changing workspace visibility.
      await pause(1100);
      main.style.display = 'none';
      nextWorkspace.style.display = 'block';
      await waitFor(() => headings().join() === 'Next chat heading');
      assert(panel.querySelector('.toc-group-content').style.display === 'block', 'Old collapse state leaked into new chat');
      assert(Math.round(panel.getBoundingClientRect().width) === 320, 'Chat switch lost preferred width');
    });
    await check('Cached workspace switch updates even without a URL or message mutation', async () => {
      nextWorkspace.style.display = 'none';
      main.style.display = '';
      await waitFor(() => headings().join() === 'Active chat heading');
      assert(!headings().includes('Next chat heading'), 'Previous chat entries remained');
    });
    await check('Empty active workspace clears old entries then indexes asynchronously loaded replies', async () => {
      nextMain.replaceChildren();
      main.style.display = 'none';
      nextWorkspace.style.display = 'block';
      history.pushState({}, '', 'regression-empty-chat');
      await waitFor(() => document.querySelector('.toc-empty')?.textContent === 'No responses found');
      assert(headings().length === 0, 'Kept hidden old headings while new chat was empty');
      nextMain.innerHTML = modern('Loaded prompt', 'Asynchronously loaded heading');
      await waitFor(() => headings().join() === 'Asynchronously loaded heading');
      nextWorkspace.remove();
      cachedWorkspace.remove();
      main.style.display = '';
      history.replaceState({}, '', 'regression.html');
      await waitFor(() => headings().join() === 'Active chat heading');
      document.querySelector('.toc-width-reset').click();
    });
    const sidebar = document.getElementById('chatgpt-toc-sidebar');
    const toggle = document.getElementById('chatgpt-toc-toggle');
    const content = document.getElementById('toc-content');
    const handle = sidebar.querySelector('.toc-resize-handle');
    const isOpen = () => sidebar.getAttribute('aria-hidden') === 'false';
    await check('Adaptive width leaves space beside the actual answer', async () => {
      await waitFor(isOpen);
      sidebar.querySelector('.toc-width-reset').click();
      await pause(60);
      const answer = main.querySelector('[data-markdown-text-style]');
      assert(sidebar.getBoundingClientRect().left >= answer.getBoundingClientRect().right + 15, 'Sidebar overlaps answer');
      assert(Math.round(sidebar.getBoundingClientRect().width) === 300, 'Automatic width is not 300px');
    });
    await check('Keyboard resizing remembers width and reset removes the preference', async () => {
      handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      assert(Math.round(sidebar.getBoundingClientRect().width) === 320, 'Resize did not widen sidebar');
      assert(JSON.parse(localStorage.getItem('chatgptTocWidth')) === 320, 'Width not saved');
      sidebar.querySelector('.toc-width-reset').click();
      assert(localStorage.getItem('chatgptTocWidth') === null, 'Reset did not remove saved width');
    });
    await check('Insufficient space closes safely and restores requested width when space returns', async () => {
      handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      const oldWidth = main.style.width;
      main.style.width = `${document.documentElement.clientWidth - 120}px`;
      await waitFor(() => !isOpen());
      assert(sidebar.inert, 'Closed sidebar still receives keyboard focus');
      assert(toggle.classList.contains('toc-compact'), 'Missing compact entry');
      main.style.width = oldWidth;
      await waitFor(isOpen);
      assert(Math.round(sidebar.getBoundingClientRect().width) === 320, 'Preferred width was lost');
      sidebar.querySelector('.toc-width-reset').click();
    });
    await check('Wide visible tables are avoided and clipped code does not consume extra space', async () => {
      const answer = main.querySelector('[data-markdown-text-style]');
      const oldWidth = main.style.width;
      main.style.width = '240px';
      const safeWidth = Math.min(700, document.documentElement.clientWidth - 430);
      answer.insertAdjacentHTML('beforeend', `<table style="width:${safeWidth}px"><tr><td>Wide table</td></tr></table><div style="width:240px;overflow-x:auto"><pre style="width:2000px">Long code</pre></div>`);
      await pause(350);
      await waitFor(isOpen);
      assert(sidebar.getBoundingClientRect().left >= answer.querySelector('table').getBoundingClientRect().right + 15, 'Visible table overlaps sidebar');
      answer.querySelector('table').remove();
      await pause(350);
      assert(isOpen(), 'Clipped code incorrectly hides the sidebar');
      answer.lastElementChild.remove();
      main.style.width = oldWidth;
    });
    await check('Clicks navigate without directory or body highlighting', async () => {
      const target = main.querySelector('h2');
      let jumped = false;
      target.scrollIntoView = () => { jumped = true; };
      document.querySelector('.toc-item').click();
      assert(jumped, 'Heading click failed');
      assert(!sidebar.querySelector('.toc-active, [aria-current]'), 'Directory highlight remains');
      assert(target.style.backgroundColor === '', 'Body highlight remains');
      document.querySelector('.toc-group-header').click();
      assert(main.querySelector('[data-markdown-text-style]').style.backgroundColor === '', 'Response highlight remains');
    });
    const alignHeading = index => {
      const target = main.querySelectorAll('h2')[index];
      main.scrollTop += target.getBoundingClientRect().top - main.getBoundingClientRect().top - 48;
    };
    const directoryItemVisible = index => {
      const rect = sidebar.querySelector(`.toc-item[data-heading="${index}"]`).getBoundingClientRect();
      const bounds = content.getBoundingClientRect();
      return rect.top >= bounds.top && rect.bottom <= bounds.bottom;
    };
    await check('Directory follows a nested conversation scroll down and up without moving the body', async () => {
      main.style.height = '360px';
      main.style.overflowY = 'auto';
      main.innerHTML = `<div data-markdown-text-style="assistant-message">${Array.from({ length: 60 }, (_, i) => `<section style="height:260px"><h2>Reading section ${i}</h2><p>Body ${i}</p></section>`).join('')}</div>`;
      await waitFor(() => headings().length === 60);
      alignHeading(55);
      const bodyPosition = main.scrollTop;
      await waitFor(() => directoryItemVisible(55));
      assert(content.scrollTop > 0, 'Directory did not follow downward');
      assert(main.scrollTop === bodyPosition, 'Following moved the conversation');
      main.scrollTop = 0;
      await waitFor(() => directoryItemVisible(0));
      assert(!sidebar.querySelector('.toc-active, [aria-current]'), 'Following adds highlighting');
    });
    await check('Manual directory browsing pauses following until conversation scroll resumes', async () => {
      alignHeading(55);
      await waitFor(() => directoryItemVisible(55));
      content.dispatchEvent(new WheelEvent('wheel', { deltaY: -500, bubbles: true }));
      content.scrollTop = 0;
      main.querySelector('p').textContent = 'Updated body while browsing outline';
      await pause(350);
      assert(content.scrollTop === 0, 'Automatic following interrupted manual browsing');
      main.scrollTop += 15;
      await waitFor(() => directoryItemVisible(55));
    });
    await check('Following a folded response preserves the user collapse choice', async () => {
      sidebar.querySelector('.toc-group-collapse-icon').click();
      main.scrollTop -= 20;
      await pause(100);
      assert(sidebar.querySelector('.toc-group-content').style.display === 'none', 'Following reopened a folded response');
      sidebar.querySelector('.toc-group-collapse-icon').click();
    });
    await check('Streaming outline rebuild preserves manual directory scroll', async () => {
      content.dispatchEvent(new WheelEvent('wheel', { deltaY: 1, bubbles: true }));
      content.scrollTop = 180;
      main.querySelector('h2').textContent = 'Updated reading section';
      await waitFor(() => headings().includes('Updated reading section'));
      assert(content.scrollTop === 180, 'Streaming reset manual directory position');
    });
    await check('Explicit close stays closed after layout changes', async () => {
      document.getElementById('toc-close').click();
      main.style.width = '500px';
      await pause(100);
      assert(!isOpen(), 'Layout change reopened explicitly closed sidebar');
      toggle.click();
      await waitFor(isOpen);
    });
    const toc = globalThis.__shigangTOCInstance;
    document.getElementById('toc-close').click();
    let fixtureNumber = 0;
    const answer = (id, title) => `<div data-content-search-unit-key="${id}:assistant"><div data-chatgpt-selection-message-id="${id}"><div data-markdown-text-style="assistant-message"><h2>${title}</h2></div></div></div>`;
    const turn = (id, title, extra = '') => `<div data-turn-key="${id}"><div data-talvt-turn-state="complete"><div data-user-message-bubble>Prompt ${id}</div>${extra}${answer(id, title)}</div></div>`;
    const resetTurns = html => {
      history.replaceState({}, '', `regression-turns-${++fixtureNumber}`);
      main.innerHTML = html;
      main.scrollTop = 0;
      toc.refreshOutline();
    };
    await check('Thinking and tool activities produce one pending turn, with no reasoning headings', async () => {
      resetTurns('<div data-turn-key="thinking"><div data-talvt-turn-state="running"><div data-user-message-bubble>Thinking prompt</div><div data-markdown-text-style="assistant-message" data-markdown-text-tone="primary"><h2>Reasoning heading</h2></div><div data-markdown-text-style="assistant-message" data-markdown-text-tone="tertiary">Tool activity</div><div data-markdown-text-style="assistant-message">More reasoning</div></div></div>');
      await waitFor(() => document.querySelector('.toc-empty')?.textContent === 'Thinking or generating a response…');
      assert(toc.responseGroups.length === 1 && headings().length === 0, 'Thinking fragments counted as answers');
    });
    await check('Final answer replaces pending state and expanding reasoning never duplicates it', async () => {
      const state = main.querySelector('[data-talvt-turn-state]');
      state.insertAdjacentHTML('beforeend', answer('final', 'Final heading'));
      state.setAttribute('data-talvt-turn-state', 'complete');
      await waitFor(() => headings().join() === 'Final heading');
      state.insertAdjacentHTML('afterbegin', '<div data-markdown-text-style="assistant-message"><h3>Expanded reasoning</h3></div>');
      await pause(300);
      assert(toc.responseGroups.length === 1 && headings().join() === 'Final heading', 'Expanded thinking leaked into answer outline');
    });
    await check('Multiple final markdown blocks in one Work turn do not duplicate answers', async () => {
      main.querySelector('[data-chatgpt-selection-message-id]').insertAdjacentHTML('beforeend', '<div data-markdown-text-style="assistant-message"><h3>Second final block</h3></div>');
      await waitFor(() => headings().includes('Second final block'));
      assert(toc.responseGroups.length === 1 && headings().length === 2, 'Answer blocks duplicated');
    });
    await check('An interrupted response recovers automatically when its retry arrives', async () => {
      resetTurns('<div data-turn-key="retry"><div data-talvt-turn-state="error"><div data-user-message-bubble>Retry prompt</div><div role="alert">Temporary error</div></div></div>');
      await waitFor(() => document.querySelector('.toc-empty')?.textContent === 'Response interrupted · waiting for a retry');
      main.firstElementChild.innerHTML = `<div data-talvt-turn-state="complete"><div data-user-message-bubble>Retry prompt</div>${answer('retry-message', 'Recovered answer')}</div>`;
      await waitFor(() => headings().join() === 'Recovered answer');
      assert(toc.responseGroups.length === 1, 'Retry created duplicate group');
    });
    await check('A render exception is retried without requiring close and reopen', async () => {
      const render = toc.updateTOC;
      let failures = 0;
      toc.updateTOC = function () {
        if (!failures++) throw new Error('Simulated one-time render failure');
        return render.call(this);
      };
      try {
        // Keep the sidebar open so the watchdog also catches missing mutations.
        toc.openRequested = true;
        toc.historyScannedRoot = main;
        main.querySelector('h2').textContent = 'Recovered from render error';
        await waitFor(() => headings().join() === 'Recovered from render error');
        assert(failures >= 2, 'Failed rendering was never retried');
      } finally {
        toc.updateTOC = render;
        toc.openRequested = false;
      }
    });
    await check('Virtualized turn content retains its outline and prompt after unloading', async () => {
      resetTurns(turn('older', 'Older heading') + turn('newer', 'Newer heading'));
      await waitFor(() => headings().length === 2);
      main.firstElementChild.replaceChildren();
      await pause(350);
      assert(headings().join('|') === 'Older heading|Newer heading', 'Unloading deleted the old outline');
      assert(document.querySelector('.toc-group-prompt').textContent === 'Prompt older', 'Cached prompt lost');
      assert(Array.from(toc.turnCache.values()).every(group => !group.messageElement && !group.promptElement), 'Cache holds detached transcript nodes');
    });
    await check('Loading earlier history preserves chronological order and collapse choices', async () => {
      document.querySelector('.toc-group-collapse-icon').click();
      main.insertAdjacentHTML('afterbegin', turn('oldest', 'Oldest heading'));
      await waitFor(() => headings().length === 3);
      assert(headings().join('|') === 'Oldest heading|Older heading|Newer heading', 'Prepended history is out of order');
      assert(document.querySelectorAll('.toc-group-content')[1].style.display === 'none', 'History prepend moved a collapsed choice to another turn');
    });
    await check('Cached heading navigation reloads the turn before scrolling to a live heading', async () => {
      const oldTurn = main.querySelector('[data-turn-key="older"]');
      Array.from(main.children).forEach(wrapper => { wrapper.style.height = '600px'; });
      setTimeout(() => { oldTurn.innerHTML = `<div data-user-message-bubble>Prompt older</div>${answer('older', 'Older heading')}`; }, 150);
      await toc.navigateToGroup(toc.responseGroups.findIndex(group => group.key === 'turn:older'), 0);
      assert(Math.abs(oldTurn.querySelector('h2').getBoundingClientRect().top - main.getBoundingClientRect().top) < 3, 'Cached heading never aligned to the remounted target');
    });
    await check('Regenerating a turn replaces its headings rather than retaining stale ones', async () => {
      main.querySelector('[data-turn-key="newer"]').innerHTML = `<div data-user-message-bubble>Prompt newer</div>${answer('regenerated-id', 'Regenerated heading')}`;
      await waitFor(() => headings().includes('Regenerated heading'));
      assert(!headings().includes('Newer heading') && toc.responseGroups.length === 3, 'Old regenerated response retained');
    });
    await check('Conversation navigation clears cached unloaded turns', async () => {
      resetTurns(turn('different-chat', 'Different chat only'));
      assert(headings().join() === 'Different chat only', 'History cache leaked into another conversation');
    });
    const virtualCount = 12;
    let virtualize = null;
    const prepareVirtualHistory = () => {
      resetTurns(Array.from({ length: virtualCount }, (_, i) => `<div data-turn-key="virtual-${i}" style="height:600px;flex-shrink:0"></div>`).join(''));
      virtualize = () => {
        const current = Math.floor(main.scrollTop / 600);
        Array.from(main.children).forEach((wrapper, i) => {
          const mounted = Math.abs(i - current) <= 1;
          if (mounted && !wrapper.firstElementChild) wrapper.innerHTML = `<div data-talvt-turn-state="complete"><div data-user-message-bubble>Virtual prompt ${i}</div>${answer(`virtual-message-${i}`, `Virtual heading ${i}`)}</div>`;
          if (!mounted && wrapper.firstElementChild) wrapper.replaceChildren();
        });
      };
      main.addEventListener('scroll', virtualize);
      main.scrollTop = 6000;
      virtualize();
      toc.refreshOutline();
    };
    await check('Opening automatically scans virtual history and restores the reading position', async () => {
      prepareVirtualHistory();
      const originalTop = main.scrollTop;
      toggle.click();
      await waitFor(() => toc.historyScan, 80);
      await waitFor(() => !toc.historyScan, 300);
      assert(toc.responseGroups.length === virtualCount, `Loaded only ${toc.responseGroups.length} virtual turns`);
      assert(headings().join('|') === Array.from({ length: virtualCount }, (_, i) => `Virtual heading ${i}`).join('|'), 'History order incomplete');
      assert(Math.abs(main.scrollTop - originalTop) < 2, 'History scan did not restore reading position');
      assert(!toc.historyStatus, 'Finished scan incorrectly marked partial');
    });
    await check('A real virtualized heading click mounts and navigates to older content', async () => {
      await toc.navigateToGroup(0, 0);
      await pause(150);
      assert(main.scrollTop < 100, 'Click failed to reach older history');
      assert(main.querySelector('[data-turn-key="virtual-0"] h2')?.isConnected, 'Navigated to a detached heading');
    });
    await check('A user scroll cancels history scanning without restoring over their new position', async () => {
      const scan = toc.loadHistory();
      await pause(1150);
      main.dispatchEvent(new WheelEvent('wheel', { deltaY: 500, bubbles: true }));
      main.scrollTop = 3000;
      await scan;
      assert(Math.abs(main.scrollTop - 3000) < 2, 'Scan overrode user scrolling');
      assert(toc.historyStatus === 'historyPartial', 'Interrupted scan has no recovery status');
      assert(toc.historyResumeTop > 0, 'Paused scan lost its progress');
      await pause(1100);
      assert(!toc.historyScan, 'Watchdog restarted a user-cancelled scan');
    });
    await check('The refresh button retries a paused history scan without closing the sidebar', async () => {
      document.querySelector('.toc-refresh').click();
      await waitFor(() => toc.historyScan);
      await waitFor(() => !toc.historyScan, 300);
      assert(!toc.historyStatus && isOpen(), 'Refresh did not complete history scan in the open sidebar');
    });
    main.removeEventListener('scroll', virtualize);
    document.getElementById('toc-close').click();
    const windowCount = 16;
    let rankOffset = 0;
    let prefixHeight = 0;
    let mountedRange = '';
    let windowHost;
    const renderWindow = () => {
      const current = Math.max(0, Math.min(windowCount - 1, Math.floor((main.scrollTop - prefixHeight) / 600)));
      const start = Math.max(0, current - 1);
      const end = Math.min(windowCount - 1, current + 2);
      const range = `${start}:${end}:${prefixHeight}:${rankOffset}`;
      if (range === mountedRange) return;
      mountedRange = range;
      windowHost.style.height = `${prefixHeight + windowCount * 600}px`;
      windowHost.innerHTML = Array.from({ length: end - start + 1 }, (_, j) => {
        const i = start + j;
        return `<div data-turn-key="window-${i}" style="position:absolute;top:${prefixHeight + i * 600}px;height:600px;width:100%"><div data-content-search-turn-key="fallback-turn-${rankOffset + i}"><div data-talvt-turn-state="complete"><div data-user-message-bubble>Window prompt ${i}</div>${answer(`window-message-${i}`, `Window heading ${i}`)}</div></div></div>`;
      }).join('');
    };
    const prepareMovingWindow = () => {
      toc.openRequested = false;
      mountedRange = '';
      rankOffset = 0;
      prefixHeight = 0;
      resetTurns('<div id="virtual-window" style="position:relative;height:9600px"></div>');
      windowHost = main.firstElementChild;
      main.addEventListener('scroll', renderWindow);
      main.scrollTop = 7200;
      renderWindow();
      toc.refreshOutline();
      main.scrollTop = 0;
      renderWindow();
      toc.refreshOutline();
      toc.historyScannedRoot = main;
    };
    const windowGroup = index => toc.responseGroups.findIndex(group => group.key === `turn:window-${index}`);
    const windowTarget = index => main.querySelector(`[data-turn-key="window-${index}"] h2`);
    const alignedWindow = index => windowTarget(index)?.isConnected && Math.abs(windowTarget(index).getBoundingClientRect().top - main.getBoundingClientRect().top) < 3;
    await check('Completely removed virtual windows keep page rank order rather than discovery order', async () => {
      prepareMovingWindow();
      assert(toc.responseGroups.map(group => group.rank).join() === '0,1,2,11,12,13,14', 'Replaced virtual windows rotated chronological order');
    });
    await check('A stale pixel coordinate is corrected by finding the actual ranked virtual window', async () => {
      toc.turnCache.get('turn:window-12').position = 120;
      const trace = [];
      const refresh = toc.refreshOutline;
      toc.refreshOutline = function () {
        refresh.call(this);
        trace.push({ top: main.scrollTop, rank: this.turnCache.get('turn:window-12')?.rank,
          mounted: Array.from(main.querySelectorAll('[data-content-search-turn-key]'), e => e.getAttribute('data-content-search-turn-key')) });
      };
      try { await toc.navigateToGroup(windowGroup(12), 0); }
      finally { toc.refreshOutline = refresh; }
      assert(alignedWindow(12), `Stale cached pixels could not locate the requested turn: ${JSON.stringify([...trace.slice(0,20), ...trace.slice(-4)])}`);
      const position = main.scrollTop;
      await pause(500);
      assert(alignedWindow(12) && Math.abs(main.scrollTop - position) < 3, 'Target jumped back after navigation completed');
    });
    await check('Delayed height measurement and scroll-anchor restoration do not undo a heading jump', async () => {
      const target = windowTarget(12);
      const jump = toc.navigateToGroup(windowGroup(12), 0);
      setTimeout(() => {
        prefixHeight = 900;
        renderWindow();
        // Model the host restoring its old anchor after measuring a new window.
        main.scrollTop = 0;
      }, 250);
      await jump;
      assert(alignedWindow(12), 'Host layout restoration won over the final heading target');
      assert(windowTarget(12) !== target, 'Fixture did not replace the target DOM');
    });
    await check('Temporarily hidden remount content does not erase cached headings', async () => {
      const source = main.querySelector('[data-turn-key="window-12"] [data-chatgpt-selection-message-id]');
      source.hidden = true;
      toc.refreshOutline();
      assert(toc.responseGroups[windowGroup(12)].headingHTML.length === 1, 'Hidden remount overwrote a complete outline with zero headings');
      const jump = toc.navigateToGroup(windowGroup(12), 0);
      setTimeout(() => { source.hidden = false; }, 250);
      await jump;
      assert(alignedWindow(12), 'Did not wait for the hidden heading to become ready');
    });
    await check('History prefix rebasing shifts cached ranks using a stable overlapping turn', async () => {
      const cachedRank = toc.turnCache.get('turn:window-0').rank;
      rankOffset = 20;
      renderWindow();
      toc.refreshOutline();
      assert(toc.turnCache.get('turn:window-0').rank === cachedRank + 20, 'Unloaded turn ranks did not follow the newly prepended history');
    });
    await check('A heading click takes ownership from history scanning without a return-to-origin race', async () => {
      toc.openRequested = true;
      const scanning = toc.loadHistory();
      await pause(150);
      await toc.navigateToGroup(windowGroup(12), 0);
      await scanning;
      await pause(400);
      assert(alignedWindow(12) && !toc.historyScan, 'History cleanup restored the pre-click reading position');
    });
    await check('A newer click cancels the earlier virtual-target lookup', async () => {
      const first = toc.navigateToGroup(windowGroup(0), 0);
      await pause(160);
      const second = toc.navigateToGroup(windowGroup(12), 0);
      await Promise.all([first, second]);
      assert(alignedWindow(12), 'An older navigation task overrode the newer click');
    });
    await check('Manual conversation scrolling cancels pending heading alignment', async () => {
      const jump = toc.navigateToGroup(windowGroup(0), 0);
      main.dispatchEvent(new WheelEvent('wheel', { bubbles: true, deltaY: 500 }));
      main.scrollTop = 3000;
      await jump;
      await pause(400);
      assert(Math.abs(main.scrollTop - 3000) < 3 && !toc.navigation, 'Pending heading navigation fought the user scroll');
    });
    main.removeEventListener('scroll', renderWindow);
    await check('Invalidated extension i18n falls back once and subsequent outline updates keep working', async () => {
      const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'chrome');
      let calls = 0;
      try {
        Object.defineProperty(globalThis, 'chrome', { configurable: true, value: {
          i18n: { getMessage() { calls++; throw new Error('Extension context invalidated.'); } }
        } });
        document.documentElement.lang = 'en';
        assert(shigangMessage('summary', 2, 3) === '2 responses · 3 headings', 'Invalidation did not fall back to the bundled catalog');
        resetTurns(turn('after-reload', 'Outline survives invalidation'));
        for (let i = 0; i < 5; i++) toc.refreshOutline();
        assert(headings().join() === 'Outline survives invalidation', 'Invalidation broke outline rendering');
        document.documentElement.lang = 'zh-CN';
        assert(shigangMessage('summary', 2, 3) === '2 段回答 · 3 个标题', 'Chinese fallback placeholders broke');
        assert(calls === 1, `Invalidated API was called repeatedly: ${calls}`);
      } finally {
        if (descriptor) Object.defineProperty(globalThis, 'chrome', descriptor);
        else delete globalThis.chrome;
        document.documentElement.lang = 'en';
      }
    });
    results.textContent += `\n\n${passed.length} tests passed.`;
    document.title = `PASS: ${passed.length} TOC regression tests`;
  } catch (error) {
    results.textContent += `\nFAIL: ${error.stack}`;
    document.title = 'FAIL: TOC regression tests';
  }
});

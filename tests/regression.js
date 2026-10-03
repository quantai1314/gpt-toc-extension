// Run in a real browser, without dependencies or a ChatGPT login.
document.addEventListener('DOMContentLoaded', async () => {
  const main = document.querySelector('main');
  const results = document.getElementById('results');
  const passed = [];
  const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const headings = () => Array.from(document.querySelectorAll('.toc-text'), e => e.textContent);
  const waitFor = async predicate => {
    for (let i = 0; i < 60; i++) {
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
      main.innerHTML = modern('P'.repeat(198) + fraction + ' trailing text', `<math><mrow>${'<mi>x</mi><mo>+</mo>'.repeat(80)}<mn>1</mn></mrow></math>`);
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
    results.textContent += `\n\n${passed.length} tests passed.`;
    document.title = `PASS: ${passed.length} TOC regression tests`;
  } catch (error) {
    results.textContent += `\nFAIL: ${error.stack}`;
    document.title = 'FAIL: TOC regression tests';
  }
});

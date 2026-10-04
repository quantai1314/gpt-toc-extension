// ChatGPT Table of Contents Extension
class ChatGPTTOC {
  constructor() {
    this.sidebar = null;
    this.isVisible = false;
    this.headings = [];
    this.responseGroups = [];
    this.collapsedHeadings = new Set(); // Track collapsed headings by groupIndex-headingIndex
    this.collapsedGroups = new Set(); // Track collapsed groups by groupIndex
    this.rightArrowSVG = '<svg width="12" height="12" viewBox="0 0 12 12" style="vertical-align:middle"><polyline points="4,3 8,6 4,9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    this.downArrowSVG = '<svg width="12" height="12" viewBox="0 0 12 12" style="vertical-align:middle"><polyline points="3,4 6,8 9,4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    this.isDarkMode = false;
    this.lastPath = location.pathname;
    this.conversationRoot = null;
    this.lastTOCSignature = null;
    this.preferredWidth = null;
    this.maxSidebarWidth = 420;
    this.openRequested = false;
    this.followPaused = false;
    this.framePending = false;
    this.layoutPending = false;
    this.contentRoots = [];
    this.widthStorageKey = 'chatgptTocWidth';
    this.init();
  }

  init() {
    // Create and inject sidebar
    this.createSidebar();
    
    // Add toggle button
    this.addToggleButton();

    this.extractHeadings();
    
    // Start observing for content changes
    this.observeContentChanges();
    
    // Start observing for theme changes
    this.observeThemeChanges();
    this.observeReadingPosition();
    this.loadWidthPreference();
  }

  createSidebar() {
    // Create sidebar container
    this.sidebar = document.createElement('div');
    this.sidebar.id = 'chatgpt-toc-sidebar';
    this.sidebar.setAttribute('role', 'complementary');
    this.sidebar.setAttribute('aria-labelledby', 'toc-title');
    this.sidebar.setAttribute('aria-describedby', 'toc-content');
    this.sidebar.setAttribute('aria-hidden', 'true');
    this.sidebar.inert = true;
    this.sidebar.innerHTML = `
      <div class="toc-resize-handle" role="separator" aria-label="调整目录宽度" aria-orientation="vertical" tabindex="0"></div>
      <div class="toc-header">
        <div class="toc-heading-block">
          <div class="toc-eyebrow">CONVERSATION OUTLINE</div>
          <h3 id="toc-title" class="toc-title">对话目录 <span class="toc-title-dot"></span></h3>
        </div>
        <button class="toc-close" id="toc-close" aria-label="Close table of contents">×</button>
      </div>
      <div class="toc-summary" id="toc-summary">正在整理对话…</div>
      <div class="toc-content" id="toc-content" role="region" aria-label="Table of contents navigation">
        <div class="toc-loading">Loading...</div>
      </div>
      <div class="toc-footer"><span class="toc-status-dot"></span> <span>随正文跟随</span><button class="toc-width-reset" type="button" title="恢复自动宽度">自动宽度</button></div>
    `;
    
    document.body.appendChild(this.sidebar);
    this.setupWidthControls();
    
    // Initialize theme
    this.updateTheme();
    
    // Add close button functionality
    const closeButton = document.getElementById('toc-close');
    closeButton.addEventListener('click', () => {
      this.toggleSidebar();
    });
    
    // Add keyboard support for close button
    closeButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleSidebar();
      }
    });


    // Attach event delegation for collapse/expand and scroll only once
    const tocContent = document.getElementById('toc-content');
    tocContent.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.toc-item')) {
        e.preventDefault();
        e.target.click();
      }
    });
    tocContent.addEventListener('click', (e) => {
      const collapseIcon = e.target.closest('.toc-collapse-icon');
      if (collapseIcon) {
        const tocItem = collapseIcon.closest('.toc-item');
        if (!tocItem) return;
        const groupIndex = parseInt(tocItem.getAttribute('data-group'));
        const headingIndex = parseInt(tocItem.getAttribute('data-heading'));
        const collapseKey = `${groupIndex}-${headingIndex}`;
        if (this.collapsedHeadings.has(collapseKey)) {
          this.collapsedHeadings.delete(collapseKey);
        } else {
          this.collapsedHeadings.add(collapseKey);
        }
        tocItem.classList.toggle('collapsed');
        this.toggleSubheadings(tocItem, groupIndex, headingIndex);
        // Update the icon
        const icon = tocItem.querySelector('.toc-collapse-icon');
        if (icon) {
          icon.innerHTML = tocItem.classList.contains('collapsed') ? this.rightArrowSVG : this.downArrowSVG;
        }
        return;
      }
      // If not collapse icon, check for toc-item (scroll)
      const tocItem = e.target.closest('.toc-item');
      if (tocItem) {
        const groupIndex = parseInt(tocItem.getAttribute('data-group'));
        const headingIndex = parseInt(tocItem.getAttribute('data-heading'));
        this.scrollToHeading(groupIndex, headingIndex);
      }
    });
  }
  addToggleButton() {
    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.id = 'chatgpt-toc-toggle';
    toggleButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M7 5h10M7 10h10M7 15h6M3 5h.01M3 10h.01M3 15h.01" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg><span>目录</span>';
    toggleButton.title = 'Open Table of Contents';
    toggleButton.setAttribute('aria-label', 'Toggle table of contents sidebar');
    toggleButton.setAttribute('aria-expanded', 'false');
    toggleButton.setAttribute('aria-controls', 'chatgpt-toc-sidebar');
    
    toggleButton.addEventListener('click', () => {
      this.toggleSidebar();
    });
    
    toggleButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleSidebar();
      }
    });
    
    
    document.body.appendChild(toggleButton);
    // Ensure button is visible if sidebar is hidden
    toggleButton.style.display = this.isVisible ? 'none' : '';
  }

  toggleSidebar() {
    this.openRequested = !this.openRequested;
    if (this.openRequested) {
      this.followPaused = false;
      this.extractHeadings();
    }
    this.updateLayout();
    this.syncReadingPosition();
    if (this.isVisible) document.getElementById('toc-close').focus();
  }

  setSidebarVisible(visible) {
    this.isVisible = visible;
    this.sidebar.style.transform = visible ? 'translateX(0)' : 'translateX(calc(100% + 32px))';
    this.sidebar.inert = !visible;
    this.sidebar.setAttribute('aria-hidden', String(!visible));
    const toggleButton = document.getElementById('chatgpt-toc-toggle');
    if (toggleButton) {
      toggleButton.setAttribute('aria-expanded', String(visible));
      toggleButton.style.display = visible ? 'none' : '';
    }
  }

  // Preferences use extension storage. Standalone local previews use their own origin.
  previewStorageAvailable() {
    return location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(location.hostname);
  }

  async loadWidthPreference() {
    try {
      const stored = globalThis.chrome?.storage?.local
        ? (await chrome.storage.local.get(this.widthStorageKey))[this.widthStorageKey]
        : this.previewStorageAvailable() ? JSON.parse(localStorage.getItem(this.widthStorageKey)) : null;
      if (typeof stored === 'number' && Number.isFinite(stored)) {
        this.preferredWidth = Math.max(220, Math.min(420, stored));
      }
    } catch (_) { /* Storage may be disabled; sizing still works for this page. */ }
    this.scheduleReadingUpdate(true);
  }

  async saveWidthPreference() {
    try {
      if (globalThis.chrome?.storage?.local) {
        if (this.preferredWidth === null) await chrome.storage.local.remove(this.widthStorageKey);
        else await chrome.storage.local.set({ [this.widthStorageKey]: this.preferredWidth });
      } else if (this.previewStorageAvailable()) {
        if (this.preferredWidth === null) localStorage.removeItem(this.widthStorageKey);
        else localStorage.setItem(this.widthStorageKey, JSON.stringify(this.preferredWidth));
      }
    } catch (_) { /* Do not interrupt navigation if preferences cannot be saved. */ }
  }

  setupWidthControls() {
    const handle = this.sidebar.querySelector('.toc-resize-handle');
    let drag = null;
    handle.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      event.preventDefault();
      drag = { x: event.clientX, width: this.sidebar.getBoundingClientRect().width };
      handle.setPointerCapture(event.pointerId);
      this.sidebar.classList.add('toc-resizing');
    });
    handle.addEventListener('pointermove', event => {
      if (!drag) return;
      this.preferredWidth = Math.max(220, Math.min(this.maxSidebarWidth, drag.width + drag.x - event.clientX));
      this.updateLayout();
    });
    const finishDrag = () => {
      if (!drag) return;
      drag = null;
      this.sidebar.classList.remove('toc-resizing');
      this.saveWidthPreference();
    };
    handle.addEventListener('pointerup', finishDrag);
    handle.addEventListener('pointercancel', finishDrag);
    handle.addEventListener('lostpointercapture', finishDrag);
    handle.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home'].includes(event.key)) return;
      event.preventDefault();
      this.preferredWidth = event.key === 'Home' ? null : Math.max(220, Math.min(this.maxSidebarWidth,
        this.sidebar.getBoundingClientRect().width + (event.key === 'ArrowLeft' ? 20 : -20)));
      this.updateLayout();
      this.saveWidthPreference();
    });
    this.sidebar.querySelector('.toc-width-reset').addEventListener('click', () => {
      this.preferredWidth = null;
      this.updateLayout();
      this.saveWidthPreference();
    });
  }

  refreshLayoutTargets() {
    const main = this.conversationRoot;
    const roots = new Set(main ? main.querySelectorAll(
      '[data-markdown-text-style="assistant-message"], [data-message-author-role="assistant"] .markdown, [data-user-message-bubble]'
    ) : []);
    for (const group of this.responseGroups) {
      if (![...roots].some(root => group.messageElement.contains(root))) roots.add(group.messageElement);
      if (group.promptElement && !group.promptElement.querySelector('[data-user-message-bubble]')) roots.add(group.promptElement);
    }
    this.contentRoots = [...roots];
    this.widthObserver?.disconnect();
    if (main) this.widthObserver?.observe(main);
    for (const root of this.contentRoots) this.widthObserver?.observe(root);
    this.scheduleReadingUpdate(true);
  }

  updateLayout() {
    const viewportWidth = document.documentElement.clientWidth;
    const edge = viewportWidth <= 600 ? 8 : 16;
    let right = 0;
    for (const root of this.contentRoots) {
      // Include wide code, tables, images and formulas, but respect clipping containers.
      for (const element of [root, ...root.querySelectorAll('pre, table, math, img, svg, canvas, code')]) {
        const rect = element.getBoundingClientRect();
        if (!rect.width || !rect.height) continue;
        let boundary = rect.right;
        for (let parent = element.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
          if (/(auto|scroll|hidden|clip)/.test(getComputedStyle(parent).overflowX)) {
            boundary = Math.min(boundary, parent.getBoundingClientRect().right);
          }
        }
        right = Math.max(right, boundary);
      }
    }
    this.maxSidebarWidth = Math.max(0, Math.min(420, Math.floor(viewportWidth - right - edge - 16)));
    const width = Math.min(this.preferredWidth ?? 300, this.maxSidebarWidth);
    this.sidebar.style.width = `${Math.max(0, width)}px`;
    const handle = this.sidebar.querySelector('.toc-resize-handle');
    handle.setAttribute('aria-valuemin', '220');
    handle.setAttribute('aria-valuemax', String(this.maxSidebarWidth));
    handle.setAttribute('aria-valuenow', String(Math.round(width)));
    const reset = this.sidebar.querySelector('.toc-width-reset');
    reset.disabled = this.preferredWidth === null;
    const wasVisible = this.isVisible;
    this.setSidebarVisible(this.openRequested && width >= 220);
    const toggle = document.getElementById('chatgpt-toc-toggle');
    if (toggle) {
      const cramped = this.maxSidebarWidth < 220;
      toggle.classList.toggle('toc-compact', cramped);
      toggle.title = cramped ? '右侧空间不足，目录已收起；扩大窗口或缩小页面后可展开' : '打开目录';
      // Keep the compact entry near the page header rather than over the answer.
      toggle.style.top = cramped ? '8px' : '80px';
      if (wasVisible && !this.isVisible && this.sidebar.contains(document.activeElement)) toggle.focus({ preventScroll: true });
    }
  }

  scheduleReadingUpdate(layout = false) {
    this.layoutPending ||= layout;
    if (this.framePending) return;
    this.framePending = true;
    requestAnimationFrame(() => {
      this.framePending = false;
      if (this.layoutPending) {
        this.layoutPending = false;
        this.updateLayout();
      }
      this.syncReadingPosition();
    });
  }

  observeReadingPosition() {
    const content = document.getElementById('toc-content');
    const pauseFollowing = () => { this.followPaused = true; };
    content.addEventListener('wheel', pauseFollowing, { passive: true });
    content.addEventListener('pointerdown', pauseFollowing);
    content.addEventListener('keydown', event => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) pauseFollowing();
    });
    // Scroll does not bubble; capture also covers ChatGPT's nested scroll container.
    document.addEventListener('scroll', event => {
      if (event.target instanceof Element && event.target.closest('#chatgpt-toc-sidebar')) return;
      if (event.target !== document && event.target !== document.scrollingElement &&
          !this.contentRoots.some(root => event.target instanceof Element && event.target.contains(root))) return;
      this.followPaused = false;
      this.scheduleReadingUpdate();
    }, { capture: true, passive: true });
    window.addEventListener('resize', () => this.scheduleReadingUpdate(true));
    window.visualViewport?.addEventListener('resize', () => this.scheduleReadingUpdate(true));
    this.widthObserver = new ResizeObserver(() => this.scheduleReadingUpdate(true));
    this.refreshLayoutTargets();
  }

  syncReadingPosition() {
    if (!this.isVisible || this.followPaused || !this.responseGroups.length) return;
    let readingTop = 80;
    const firstMessage = this.responseGroups[0].messageElement;
    for (let parent = firstMessage.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
      if (/(auto|scroll)/.test(getComputedStyle(parent).overflowY) && parent.scrollHeight > parent.clientHeight) {
        readingTop = Math.max(80, parent.getBoundingClientRect().top + 48);
        break;
      }
    }
    let current = null;
    let nearest = null;
    for (let groupIndex = 0; groupIndex < this.responseGroups.length; groupIndex++) {
      const group = this.responseGroups[groupIndex];
      const targets = [{ element: group.promptElement || group.messageElement, headingIndex: null },
        ...group.headings.map((element, headingIndex) => ({ element, headingIndex }))];
      for (const target of targets) {
        const rect = target.element.getBoundingClientRect();
        if (!rect.height) continue;
        const entry = { groupIndex, headingIndex: target.headingIndex, top: rect.top };
        if (rect.top <= readingTop && (!current || rect.top >= current.top)) current = entry;
        if (rect.top > readingTop && (!nearest || rect.top < nearest.top)) nearest = entry;
      }
    }
    const entry = current || nearest;
    if (!entry) return;
    let item = entry.headingIndex === null
      ? this.sidebar.querySelector(`.toc-group-header[data-group="${entry.groupIndex}"]`)
      : this.sidebar.querySelector(`.toc-item[data-group="${entry.groupIndex}"][data-heading="${entry.headingIndex}"]`);
    // Follow the nearest visible ancestor without reopening a user's folded branches.
    while (item && !item.getClientRects().length) {
      const children = item.closest('.toc-children');
      item = children ? children.previousElementSibling : this.sidebar.querySelector(`.toc-group-header[data-group="${entry.groupIndex}"]`);
    }
    if (!item) return;
    const content = document.getElementById('toc-content');
    const bounds = content.getBoundingClientRect();
    const rect = item.getBoundingClientRect();
    if (rect.top < bounds.top + 12 || rect.bottom > bounds.bottom - 12) {
      // Scroll only the directory, never an ancestor or the conversation.
      content.scrollTop += rect.top - bounds.top - Math.max(12, (bounds.height - rect.height) / 2);
    }
  }

  findConversationRoot() {
    // ChatGPT caches inactive workspaces in the DOM behind display:none ancestors.
    // Prefer the latest rendered main, including an empty one while a new chat loads.
    return Array.from(document.querySelectorAll('main')).reverse().find(main =>
      !main.closest('[hidden], [aria-hidden="true"], [inert]') &&
      main.getClientRects().length > 0 &&
      !['hidden', 'collapse'].includes(getComputedStyle(main).visibility)
    ) || null;
  }

  extractHeadings() {
    const root = this.findConversationRoot();
    if (this.lastPath !== location.pathname || this.conversationRoot !== root) {
      this.lastPath = location.pathname;
      this.conversationRoot = root;
      this.collapsedGroups.clear();
      this.collapsedHeadings.clear();
      this.lastTOCSignature = null;
      this.followPaused = false;
      document.getElementById('toc-content').scrollTop = 0;
    }
    // Keep legacy support, but also recognize the current ChatGPT markup.
    // Do not collect generic .markdown elements: user messages can contain them too.
    const candidates = root ? Array.from(root.querySelectorAll(
      '[data-message-author-role="assistant"], [data-markdown-text-style="assistant-message"]'
    )) : [];
    const messages = new Set(candidates.map(message =>
      message.closest('[data-message-author-role="assistant"]') ||
      message.closest('[data-chatgpt-selection-message-id]') || message
    ));
    const userPrompts = root ? Array.from(root.querySelectorAll(
      '[data-message-author-role="user"], [data-user-message-bubble]'
    )) : [];
    const groups = [];
    messages.forEach(message => {
      // Match the preceding prompt in DOM order, not by array index (one prompt
      // can have several assistant messages, and old turns may be virtualized).
      let promptElement = null;
      for (const user of userPrompts) {
        if (user.compareDocumentPosition(message) & Node.DOCUMENT_POSITION_FOLLOWING) {
          promptElement = user;
        }
      }
      const promptHTML = promptElement ? this.renderInlineContent(promptElement, 200) : '';
      // Find headings within this specific message
      const headings = Array.from(message.querySelectorAll('h1, h2, h3, h4, h5, h6'))
        .filter(heading => !heading.matches('.sr-only, [data-conversation-role]') &&
          !heading.closest('[hidden], [aria-hidden="true"]'));
      // Get a preview of the message content for the group title
      const previewHTML = promptHTML ? '' : this.renderInlineContent(message, 50);
      groups.push({
        messageIndex: groups.length,
        messageElement: message,
        promptElement: promptElement,
        headings: headings,
        promptHTML,
        previewHTML,
        headingHTML: headings.map(heading => this.renderInlineContent(heading))
      });
    });
    const signature = JSON.stringify(groups.map(group => [
      group.promptHTML, group.previewHTML,
      group.headings.map((heading, i) => [heading.tagName, group.headingHTML[i]])
    ]));
    const sameTargets = groups.length === this.responseGroups.length && groups.every((group, i) => {
      const previous = this.responseGroups[i];
      return group.messageElement === previous.messageElement &&
        group.promptElement === previous.promptElement &&
        group.headings.length === previous.headings.length &&
        group.headings.every((heading, j) => heading === previous.headings[j]);
    });
    this.responseGroups = groups;
    // Flatten all headings for backward compatibility
    this.headings = this.responseGroups.flatMap(group => group.headings);
    this.refreshLayoutTargets();
    if (sameTargets && signature === this.lastTOCSignature) return;
    this.lastTOCSignature = signature;
    this.updateTOC();
  }

  renderInlineContent(source, maxLength = Infinity) {
    // Read the already-rendered Markdown, without copying site controls, URLs,
    // event handlers or arbitrary styles into the clickable directory.
    const inlineTags = new Set(['strong', 'b', 'em', 'i', 'code', 's', 'del', 'sub', 'sup', 'br']);
    const skippedTags = new Set(['script', 'style', 'iframe', 'object', 'embed', 'img',
      'svg', 'button', 'input', 'textarea', 'select', 'annotation', 'annotation-xml']);
    const mathTags = new Set(['math', 'semantics', 'mrow', 'mi', 'mn', 'mo', 'mtext',
      'mspace', 'mfrac', 'msup', 'msub', 'msubsup', 'msqrt', 'mroot', 'mover', 'munder',
      'munderover', 'mtable', 'mtr', 'mtd', 'menclose', 'mpadded', 'mphantom', 'mstyle',
      'mmultiscripts', 'mprescripts', 'none']);
    const mathAttributes = new Set(['mathvariant', 'stretchy', 'fence', 'separator',
      'form', 'lspace', 'rspace', 'linethickness', 'accent', 'accentunder', 'movablelimits',
      'largeop', 'scriptlevel', 'displaystyle', 'columnalign', 'rowalign', 'columnspacing',
      'rowspacing', 'rowspan', 'columnspan', 'notation', 'width', 'height', 'depth', 'voffset']);
    const cleanMath = node => {
      if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.textContent);
      if (node.nodeType !== Node.ELEMENT_NODE || !mathTags.has(node.localName)) return null;
      const copy = document.createElementNS('http://www.w3.org/1998/Math/MathML', node.localName);
      for (const attribute of node.attributes) {
        if (mathAttributes.has(attribute.name) && /^[\w\s+.,%()|\-]+$/.test(attribute.value)) {
          copy.setAttribute(attribute.name, attribute.value);
        }
      }
      for (const child of node.childNodes) {
        const clean = cleanMath(child);
        if (clean) copy.appendChild(clean);
      }
      return copy;
    };
    let length = 0;
    let truncated = false;
    const appendText = (text, target) => {
      if (length + text.length > maxLength) truncated = true;
      const visible = text.slice(0, Math.max(0, maxLength - length));
      target.appendChild(document.createTextNode(visible));
      length += visible.length;
    };
    const visit = (node, target) => {
      if (node.nodeType === Node.TEXT_NODE) { appendText(node.textContent, target); return; }
      if (node.nodeType !== Node.ELEMENT_NODE || skippedTags.has(node.localName)) return;
      // KaTeX includes MathML, a TeX annotation and visual HTML for one formula.
      // Copy only the MathML expression: Chrome renders it without KaTeX assets.
      if (node.matches('math, .katex, .katex-display, mjx-container, [data-math-source]')) {
        const math = node.matches('math') ? node : node.querySelector('math');
        if (math) {
          if (length >= maxLength) { truncated = true; return; }
          const wrapper = document.createElement('span');
          wrapper.className = 'toc-math';
          const clean = cleanMath(math);
          clean.setAttribute('display', 'inline');
          wrapper.appendChild(clean);
          // A formula is indivisible; never cut through a fraction or matrix.
          length += clean.textContent.length;
          target.appendChild(wrapper);
          return;
        }
        if (node.hasAttribute('data-math-source')) {
          appendText(node.getAttribute('data-math-source'), target);
          return;
        }
      }
      if (node.matches('[hidden], [aria-hidden="true"], .sr-only, [data-conversation-role]')) return;
      const copy = inlineTags.has(node.localName) ? document.createElement(node.localName) : target;
      for (const child of node.childNodes) visit(child, copy);
      if (copy !== target) target.appendChild(copy);
    };
    const output = document.createElement('span');
    for (const child of source.childNodes) visit(child, output);
    if (truncated) output.appendChild(document.createTextNode('…'));
    return output.innerHTML.trim();
  }

  updateTOC() {
    const tocContent = document.getElementById('toc-content');
    const previousScrollTop = tocContent.scrollTop;
    document.getElementById('toc-summary').textContent = `${this.responseGroups.length} 段回答 · ${this.headings.length} 个标题`;
    if (this.responseGroups.length === 0) {
      tocContent.innerHTML = '<div class="toc-empty">No responses found</div>';
      return;
    }
    let tocHTML = '';
    this.responseGroups.forEach((group, groupIndex) => {
      const isGroupCollapsed = this.collapsedGroups.has(groupIndex);
      tocHTML += `
        <div class="toc-group-header toc-group-header-clickable" data-group="${groupIndex}">
          <div class="toc-group-text">
            <span class="toc-group-title"><span class="toc-group-number">${String(groupIndex + 1).padStart(2, '0')}</span> 问题 <span class="toc-group-count">${group.headings.length} 个标题</span></span>
            <span class="toc-group-prompt">${group.promptHTML || group.previewHTML || '新回答'}</span>
          </div>
          <span class="toc-group-collapse-icon">${isGroupCollapsed ? this.rightArrowSVG : this.downArrowSVG}</span>
        </div>
      `;
      // Render headings as a nested tree
      tocHTML += `<div class="toc-group-content" data-group="${groupIndex}" style="display:${isGroupCollapsed ? 'none' : 'block'};">${group.headings.length ? this.renderHeadingsTree(group.headings, groupIndex) : '<div class="toc-empty">No headings in this response</div>'}</div>`;
      if (groupIndex < this.responseGroups.length - 1) {
        tocHTML += '<div class="toc-group-separator"></div>';
      }
    });
    tocContent.innerHTML = tocHTML;
    tocContent.scrollTop = previousScrollTop;
    this.scheduleReadingUpdate();
    // Group header click toggles collapse and scrolls to response
    const groupHeaders = tocContent.querySelectorAll('.toc-group-header-clickable');
    groupHeaders.forEach((header) => {
      header.addEventListener('click', (e) => {
        // Don't trigger if clicking on the collapse icon
        if (e.target.closest('.toc-group-collapse-icon')) {
          return;
        }
        const groupIndex = parseInt(header.getAttribute('data-group'));
        this.scrollToResponse(groupIndex);
      });
    });
    
    // Add collapse icon functionality
    const collapseIcons = tocContent.querySelectorAll('.toc-group-collapse-icon');
    collapseIcons.forEach((icon) => {
      icon.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering the header click
        const groupHeader = icon.closest('.toc-group-header');
        const groupIndex = parseInt(groupHeader.getAttribute('data-group'));
        this.toggleGroupCollapse(groupIndex);
      });
    });
  }

  renderHeadingsTree(headings, groupIndex) {
    // Build a tree structure from flat headings array
    const tree = [];
    const stack = [];
    headings.forEach((heading, i) => {
      const node = {
        index: i,
        level: parseInt(heading.tagName.charAt(1)),
        html: this.responseGroups[groupIndex].headingHTML[i],
        children: [],
        heading
      };
      while (stack.length && stack[stack.length - 1].level >= node.level) {
        stack.pop();
      }
      if (stack.length) {
        stack[stack.length - 1].children.push(node);
      } else {
        tree.push(node);
      }
      stack.push(node);
    });
    // Recursively render tree
    const renderNodes = (nodes, depth = 0) => {
      let html = '';
      nodes.forEach((node) => {
        const collapseKey = `${groupIndex}-${node.index}`;
        const isCollapsed = this.collapsedHeadings.has(collapseKey);
        const hasSub = node.children.length > 0;
        html += `<div class="toc-item toc-h${node.level}${isCollapsed ? ' collapsed' : ''}" role="button" tabindex="0" data-group="${groupIndex}" data-heading="${node.index}" style="--toc-depth: ${depth};">
          <span class="toc-text">${node.html}</span>
          ${hasSub ? `<span class="toc-collapse-icon">${isCollapsed ? this.rightArrowSVG : this.downArrowSVG}</span>` : ''}
        </div>`;
        if (hasSub) {
          html += `<div class="toc-children" style="display:${isCollapsed ? 'none' : 'block'};">${renderNodes(node.children, depth + 1)}</div>`;
        }
      });
      return html;
    };
    return renderNodes(tree);
  }

  toggleSubheadings(tocItem, groupIndex, headingIndex) {
    // Find the next sibling .toc-children and toggle its display
    const children = tocItem.nextElementSibling;
    if (children && children.classList.contains('toc-children')) {
      children.style.display = children.style.display === 'none' ? 'block' : 'none';
    }
  }

  scrollToResponse(groupIndex) {
    if (this.responseGroups[groupIndex] && this.responseGroups[groupIndex].messageElement) {
      const message = this.responseGroups[groupIndex].promptElement ? this.responseGroups[groupIndex].promptElement : this.responseGroups[groupIndex].messageElement;
      message.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  toggleGroupCollapse(groupIndex) {
    if (this.collapsedGroups.has(groupIndex)) {
      this.collapsedGroups.delete(groupIndex);
    } else {
      this.collapsedGroups.add(groupIndex);
    }
    
    // Update the UI
    const groupHeader = document.querySelector(`[data-group="${groupIndex}"].toc-group-header`);
    const groupContent = document.querySelector(`.toc-group-content[data-group="${groupIndex}"]`);
    const collapseIcon = groupHeader?.querySelector('.toc-group-collapse-icon');
    
    if (groupContent && collapseIcon) {
      const isCollapsed = this.collapsedGroups.has(groupIndex);
      groupContent.style.display = isCollapsed ? 'none' : 'block';
      collapseIcon.innerHTML = isCollapsed ? this.rightArrowSVG : this.downArrowSVG;
    }
  }

  scrollToHeading(groupIndex, headingIndex) {
    if (this.responseGroups[groupIndex] && this.responseGroups[groupIndex].headings[headingIndex]) {
      const heading = this.responseGroups[groupIndex].headings[headingIndex];
      
      // Smooth scroll to the heading
      heading.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
    }
  }

  observeContentChanges() {
    let refreshTimer = null;
    this.contentObserver = new MutationObserver(mutations => {
      const changed = mutations.some(mutation => {
        const element = mutation.target.nodeType === Node.ELEMENT_NODE
          ? mutation.target : mutation.target.parentElement;
        return element && !element.closest('#chatgpt-toc-sidebar, #chatgpt-toc-toggle');
      });
      // Throttle instead of debounce so streaming replies still update regularly.
      if (!changed || refreshTimer !== null) return;
      refreshTimer = setTimeout(() => {
        refreshTimer = null;
        this.extractHeadings();
      }, 200);
    });
    this.contentObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['data-message-author-role', 'data-markdown-text-style',
        'data-user-message-bubble', 'data-chatgpt-selection-message-id', 'hidden', 'aria-hidden',
        'class', 'style', 'data-math-source', 'mathvariant', 'displaystyle']
    });
    // SPA navigation can change the URL without changing the rendered text.
    setInterval(() => {
      if (this.lastPath !== location.pathname) this.extractHeadings();
    }, 1000);
  }

  detectDarkMode() {
    if (document.documentElement.classList.contains('dark') || document.documentElement.dataset.theme === 'dark') return true;
    if (document.documentElement.classList.contains('light') || document.documentElement.dataset.theme === 'light') return false;
    // Check if the system/browser prefers dark color scheme
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  updateTheme() {
    const wasDarkMode = this.isDarkMode;
    this.isDarkMode = this.detectDarkMode();
    
    if (wasDarkMode !== this.isDarkMode && this.sidebar) {
      if (this.isDarkMode) {
        this.sidebar.classList.add('dark-mode');
      } else {
        this.sidebar.classList.remove('dark-mode');
      }
    }

    const toggleButton = document.getElementById('chatgpt-toc-toggle');
    if (toggleButton) {
      toggleButton.classList.toggle('dark-mode', this.isDarkMode);
    }
  }

  observeThemeChanges() {
    // Initial theme detection
    this.updateTheme();
    const themeObserver = new MutationObserver(() => this.updateTheme());
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    
    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        this.updateTheme();
      });
    }
  }
}

// Initialize the extension when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ChatGPTTOC();
  });
} else {
  new ChatGPTTOC();
} 

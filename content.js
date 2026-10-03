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
    this.lastTOCSignature = null;
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
  }

  createSidebar() {
    // Create sidebar container
    this.sidebar = document.createElement('div');
    this.sidebar.id = 'chatgpt-toc-sidebar';
    this.sidebar.setAttribute('role', 'dialog');
    this.sidebar.setAttribute('aria-labelledby', 'toc-title');
    this.sidebar.setAttribute('aria-describedby', 'toc-content');
    this.sidebar.innerHTML = `
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
      <div class="toc-footer"><span class="toc-status-dot"></span> 点击标题，回到上下文 <span class="toc-footer-mark">TOC</span></div>
    `;
    
    document.body.appendChild(this.sidebar);
    
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
    this.isVisible = !this.isVisible;
    this.sidebar.style.transform = this.isVisible ? 'translateX(0)' : 'translateX(calc(100% + 32px))';
    
    // Update accessibility attributes
    const toggleButton = document.getElementById('chatgpt-toc-toggle');
    if (toggleButton) {
      toggleButton.setAttribute('aria-expanded', this.isVisible.toString());
      // Show/hide the button based on sidebar visibility
      toggleButton.style.display = this.isVisible ? 'none' : '';
    }
    
    // Focus management for accessibility
    if (this.isVisible) {
      this.extractHeadings();
      // Focus the close button when opening
      const closeButton = document.getElementById('toc-close');
      if (closeButton) {
        closeButton.focus();
      }
    }
  }

  extractHeadings() {
    if (this.lastPath !== location.pathname) {
      this.lastPath = location.pathname;
      this.collapsedGroups.clear();
      this.collapsedHeadings.clear();
      this.lastTOCSignature = null;
    }
    const root = document.querySelector('main');
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
      // Optionally highlight the message
      message.style.backgroundColor = '#e3f2fd';
      message.style.transition = 'background-color 0.3s ease';
      setTimeout(() => {
        message.style.backgroundColor = '';
      }, 2000);
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
      this.sidebar.querySelectorAll('.toc-item').forEach(item => {
        const selected = item.dataset.group === String(groupIndex) && item.dataset.heading === String(headingIndex);
        item.classList.toggle('toc-active', selected);
        if (selected) item.setAttribute('aria-current', 'location');
        else item.removeAttribute('aria-current');
      });
      const heading = this.responseGroups[groupIndex].headings[headingIndex];
      
      // Smooth scroll to the heading
      heading.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Highlight the heading briefly
      heading.style.backgroundColor = '#ffeb3b';
      heading.style.transition = 'background-color 0.3s ease';
      
      setTimeout(() => {
        heading.style.backgroundColor = '';
      }, 2000);
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
        'class', 'data-math-source', 'mathvariant', 'displaystyle']
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

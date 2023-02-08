(function () {
  'use strict';
  try {
    if (typeof document != 'undefined') {
      var e = document.createElement('style');
      e.appendChild(document.createTextNode('')), document.head.appendChild(e);
    }
  } catch (t) {
    console.error('vite-plugin-css-injected-by-js', t);
  }
})();
var outline = (function (exports) {
  'use strict';
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) =>
    key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : (obj[key] = value);
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== 'symbol' ? key + '' : key, value);
    return value;
  };

  function deepMerge(target, source) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
    return target;
  }
  function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }
  const getHeaderNumber = (node) => {
    return Number(node.nodeName.slice(-1));
  };
  const nodeAddAnchorName = (node, tagNodeIndex) => {
    node.setAttribute('data-id', tagNodeIndex);
  };
  class Tree {
    constructor(options) {
      __publicField(this, 'treeData', { children: [], nodeName: '' });
      __publicField(this, 'options');
      __publicField(this, 'wrapClassName');
      __publicField(this, 'activeItemClassName');
      __publicField(this, 'generatorTree', () => {
        const prefix = this.options.prefix;
        const wrapClassName = this.wrapClassName;
        const outlineItemClass = `${prefix}-outline-item`;
        const activeItemClassName = this.activeItemClassName;
        const wrap = document.createElement('div');
        wrap.className = wrapClassName;
        wrap.setAttribute('style', `display: none`);
        const padding = 10;
        const { domStr: closedomStr, style: closeStyle } = this.generatorClose();
        let ele = `${closedomStr}<div class='${prefix}-header'>outlint</div><ul class = "${prefix}-tree">`;
        const traverse = (nodeList, level) => {
          nodeList.forEach((node) => {
            const textNodeHtml = `${node.innerText} <span style='font-weight: 600'>${node.children ? `(${node.children.length})` : ''}</span>`;
            const aElement =
              level == 0 ? `<a class="has-arrow" aria-expanded="true" >${textNodeHtml}</a>` : `<a aria-expanded="true" >${textNodeHtml}</a>`;
            ele = ele + `<li style="padding-left:${padding * level}px" class='${outlineItemClass}' data-tag='${node.tagNodeIndex}'>${aElement}</li>`;
            if (node.children) {
              traverse(node.children, level + 1);
            }
          });
        };
        if (this.treeData.children) {
          traverse(this.treeData.children, 1);
        }
        ele += '</ul>';
        wrap.innerHTML = ele;
        const treeStyle = `
      ${closeStyle}
      .${outlineItemClass} {
        list-style-type: none;
        cursor: pointer
      }
      .${outlineItemClass} a {
        color: #333;
        text-decoration: none;
        font-size: 14px;
        cursor: pointer
      }
      .outlineTitle{
        font-weight: 500;
        padding: 1.333rem 0;
        margin: 0 1.667rem;
        font-size: 16px;
        line-height: 2rem;
        color: #1d2129;
        border-bottom: 1px solid #e4e6eb;
      }
      .${wrapClassName} {
        padding: 16px 8px;
        background-color: white;
        position: fixed;
        top: 0;
        right:0;
        height: calc(100vh);
        width: 300px;
        z-index: 10002;
        overflow: auto;
        border-left: 1px solid #d0d7de;
      }
      .${prefix}-tree {
        margin-top: 16px;
      }
      .${prefix}-header {
        font-weight: 600;
        font-size: 16px;
      }
      // @media (prefers-color-scheme: dark) {
      //   ._${prefix}-tree-wrap {
      //     background-color: black;
      //     color: white
      //   }
      //   .${prefix}-outline-item a {
      //     color: white;
      //   }
      // }
      .${activeItemClassName} a {
        color: var(--primary-color, red)
      }
      
      @media (prefers-color-scheme: light) {
        
      }
      .${prefix}-icon:after {
        color: var(--toggler-color-text);
        content: "";
        font-size: 15px;
        top: 0px;
        width: 16px;
        display: inline-block;
        font-weight: 400;
        position: relative;
        font-variant: normal;
      }
     
    `;
        return { node: wrap, style: treeStyle };
      });
      __publicField(this, 'getTagNodeIndex', (index) => {
        return `${this.options.prefix}-${index}`;
      });
      __publicField(this, 'getAllTags', () => {
        const contentDomId = this.options.contentId;
        const headsTag = this.options.headerTags;
        const queryStr = headsTag.map((item) => `${contentDomId} ${item}`).join(',');
        const curTagNodes = document.querySelectorAll(queryStr);
        return Array.from(curTagNodes).map((curr, index) => {
          const { nodeName, innerText } = curr;
          const dataId = curr.dataset.id;
          const headNumber = getHeaderNumber(curr);
          const item = {
            // ...curr,
            nodeName,
            headNumber,
            innerText,
            tagNodeIndex: dataId || this.getTagNodeIndex(index),
            children: []
          };
          if (!dataId) {
            nodeAddAnchorName(curr, item.tagNodeIndex);
          }
          return item;
        });
      });
      this.options = options;
      this.wrapClassName = `_${this.options.prefix}-tree-wrap`;
      this.activeItemClassName = `${this.options.prefix}-item-active`;
    }
    getClassNames() {
      const { prefix } = this.options;
      const wrapClassName = `_${prefix}-tree-wrap`;
      const activeItemClassName = `${prefix}-item-active`;
      const outlineItemClass = `${prefix}-outline-item`;
      return {
        wrapClassName,
        activeItemClassName,
        outlineItemClass,
        closeClassName: `${prefix}-close`
      };
    }
    generatorClose() {
      const { closeClassName } = this.getClassNames();
      const str = `<span class='${closeClassName}'>
    <svg t="1661342858920" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7263" width="15" height="15"><path d="M563.8 512l262.5-312.9c4.4-5.2 0.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9c-4.4 5.2-0.7 13.1 6.1 13.1h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" p-id="7264"></path></svg>
    </span>`;
      const style = `
      .${closeClassName} {
        position: absolute;
        top: 12px;
        right: 12px
      }
    `;
      return { domStr: str, style };
    }
    // 123 23 234 或者 134 234
    getTags() {
      const curTagNodes = this.getAllTags();
      let lastItem = this.treeData;
      if (curTagNodes.length) {
        curTagNodes.forEach((curr, index) => {
          const item = curr;
          let prevNode = index !== 0 ? curTagNodes[index - 1] : null;
          if (prevNode) {
            const prevNodeNumber = getHeaderNumber(prevNode);
            const currNodeNumber = getHeaderNumber(curr);
            if (prevNodeNumber < currNodeNumber) {
              lastItem.children = [curr];
            } else if (prevNodeNumber == currNodeNumber) {
              const target = findParant(lastItem.tagNodeIndex, this.treeData);
              if (target) {
                target.children.push(item);
              } else {
                this.treeData.children.push(item);
              }
            } else {
              const sameNumberItem = findTargetPathByPrevIndex(curr, lastItem.tagNodeIndex, this.treeData);
              const parent = findParant(sameNumberItem.tagNodeIndex, this.treeData);
              if (parent) {
                parent.children.push(item);
              } else {
                this.treeData.children.push(item);
              }
            }
          } else {
            lastItem.children = [item];
          }
          lastItem = item;
        });
      }
    }
  }
  const findParant = (prevNodeIndex, treeData) => {
    const stack = [];
    let target;
    const find = (list) => {
      for (var index = 0; index < list.length; index++) {
        const item = list[index];
        stack.push(item);
        if (item.tagNodeIndex === prevNodeIndex) {
          target = item;
          break;
        } else if (item.children) {
          find(item.children);
        }
        if (!target) {
          stack.pop();
        }
      }
    };
    find(treeData.children);
    return stack[stack.length - 2];
  };
  const findTargetPathByPrevIndex = (curr, prevNodeIndex, treeData) => {
    const number = getHeaderNumber(curr);
    const stack = [];
    let prevData;
    const find = (list) => {
      list.forEach((item, index) => {
        stack.push(item);
        if (item.tagNodeIndex === prevNodeIndex) {
          prevData = item;
        } else if (item.children) {
          find(item.children);
        }
        if (!prevData) {
          stack.pop();
        }
      });
    };
    find(treeData.children);
    const tr = () => {
      return stack.find((item) => item.headNumber === number);
    };
    let sameNumberItem;
    const temArr = new Array(prevData.headNumber - number).fill('');
    temArr.forEach(() => {
      const result = tr();
      if (result) {
        sameNumberItem = result;
        return;
      }
    });
    if (sameNumberItem) {
      return sameNumberItem;
    }
    return prevData;
  };
  class ElementClass {
    constructor(el, className, props) {
      __publicField(this, 'el');
      if (typeof el === 'string') {
        this.el = document.createElement(el);
      } else {
        this.el = el;
      }
      this.el.className = className;
      Object.keys(props).forEach((propKey) => {
        this.el.setAttribute(propKey, props[propKey]);
      });
    }
    setStyle(name, value) {
      if (name && this.el) {
        this.el.style[name] = value;
      }
    }
    hide() {
      this.setStyle('display', 'none');
    }
    show() {
      this.setStyle('display', 'block');
    }
    active(activeClassName = 'active') {
      var _a;
      (_a = this.el) == null ? void 0 : _a.classList.add(activeClassName);
    }
    addEvent(eventName, eventFunc) {
      var _a;
      (_a = this.el) == null ? void 0 : _a.addEventListener(eventName, eventFunc);
    }
    remove() {
      var _a;
      (_a = this.el) == null ? void 0 : _a.remove();
    }
    child(arg) {
      var _a;
      let ele = arg;
      if (typeof arg === 'string') {
        ele = document.createTextNode(arg);
      } else if (arg instanceof ElementClass) {
        ele = arg.el;
      }
      (_a = this.el) == null ? void 0 : _a.appendChild(ele);
      return this;
    }
    innerHTML(html) {
      if (this.el) {
        this.el.innerHTML = html;
      }
    }
  }
  const h = (el, className = '', props = {}) => new ElementClass(el, className, props);
  const defaultOptions = {
    headerTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    contentId: ['article', 'main', 'body'],
    prefix: 'js'
  };
  let styleHtml = `
  :root {
    --toggler-color-bg: #f5f5f5;
    --color-border-default: #e6e6e6;
  }
  @media (prefers-color-scheme: dark) {
    --toggler-color-bg: dard;
  }
  a {
    decorator: none;
  }
`;
  function setStyle(innerStyle) {
    styleHtml += innerStyle;
  }
  const defaultPriorityIds = ['article', 'main', 'body'];
  class Outline {
    //@ts-ignore
    constructor(el, options) {
      __publicField(this, 'tree');
      __publicField(this, 'options');
      __publicField(this, 'domId');
      __publicField(this, 'styleDomId');
      // 不同网页情况的适配
      __publicField(this, 'getDefaultOptions', () => {
        let headerTags = defaultOptions.headerTags;
        const host = window.location.host;
        if (host.startsWith('aliyuque')) {
          const headTagPrefix = 'ne-h';
          headerTags = new Array(6).map((item, index) => `${headTagPrefix}${index}`);
        }
        let contentId;
        contentId = defaultPriorityIds.find((selector) => {
          return document.querySelector(selector);
        });
        return { headerTags, contentId, prefix: defaultOptions.prefix };
      });
      __publicField(this, 'init', (el) => {
        const allTags = this.tree.getAllTags();
        if (!allTags.length) {
          return;
        }
        this.clear();
        this.tree.getTags();
        if (el);
        else {
          this.generatorDom();
          this.insertStyle();
          this.events();
        }
      });
      __publicField(this, 'events', () => {
        var _a, _b;
        const { outlineItemClass, toggleClassName, wrapClassName, closeClassName } = this.getClassNames();
        document.querySelectorAll(`.${outlineItemClass}`).forEach((item) => {
          const handleClick = () => {
            const tag = item.dataset.tag;
            const target = getHeadingEleByDataId(tag);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
            }
            this.activeHandler();
          };
          item.addEventListener('click', handleClick);
        });
        window.addEventListener('scroll', this.activeHandler);
        (_a = document.querySelector(`.${toggleClassName}`)) == null
          ? void 0
          : _a.addEventListener('mouseenter', () => {
              var _a2, _b2;
              (_a2 = document.querySelector(`.${wrapClassName}`)) == null ? void 0 : _a2.style.setProperty('display', 'block');
              (_b2 = document.querySelector(`.${toggleClassName}`)) == null ? void 0 : _b2.style.setProperty('display', 'none');
            });
        (_b = document.querySelector(`.${closeClassName}`)) == null
          ? void 0
          : _b.addEventListener('click', () => {
              var _a2, _b2;
              (_a2 = document.querySelector(`.${wrapClassName}`)) == null ? void 0 : _a2.style.setProperty('display', 'none');
              (_b2 = document.querySelector(`.${toggleClassName}`)) == null ? void 0 : _b2.style.setProperty('display', 'block');
            });
      });
      __publicField(this, 'getClassNames', () => {
        const { prefix } = this.options;
        return {
          ...this.tree.getClassNames(),
          outlineItemClass: `${prefix}-outline-item`,
          toggleClassName: `${prefix}-toggle`
        };
      });
      __publicField(this, 'activeHandler', () => {
        var _a;
        const { outlineItemClass, activeItemClassName } = this.getClassNames();
        const tags = this.tree.getAllTags();
        document.querySelectorAll(`.${outlineItemClass}`).forEach((node) => {
          node.classList.remove(activeItemClassName);
        });
        let lastDisNode;
        let viewFirstEleDis;
        const viewFirstEleIndex = tags.findIndex((tag) => {
          const ele = getHeadingEleByDataId(tag.tagNodeIndex);
          const dis = ele.getBoundingClientRect().top;
          viewFirstEleDis = dis;
          return dis > 0;
        });
        if (viewFirstEleIndex == -1) {
          lastDisNode == null ? void 0 : lastDisNode[tags.length - 1];
        }
        if (viewFirstEleIndex == 0) {
          lastDisNode = tags[0];
        }
        if (viewFirstEleIndex > 0) {
          if (viewFirstEleDis && viewFirstEleDis < 50) {
            lastDisNode = tags[viewFirstEleIndex];
          } else {
            lastDisNode = tags[viewFirstEleIndex - 1];
          }
        }
        if (lastDisNode) {
          (_a = getOutlineItemByDataTag(lastDisNode.tagNodeIndex)) == null ? void 0 : _a.classList.add(activeItemClassName);
        }
      });
      __publicField(this, 'generatorDom', () => {
        const body = document.querySelector('body');
        const outlineEle = h('div', '', { id: this.domId });
        const { node: treeNode, style: treeStyle } = this.tree.generatorTree();
        outlineEle.child(treeNode);
        setStyle(treeStyle);
        const { node: toggleEle, style: toggleStyle } = this.generatorToggle();
        setStyle(toggleStyle);
        outlineEle.child(toggleEle);
        body == null ? void 0 : body.appendChild(outlineEle.el);
      });
      __publicField(this, 'generatorToggle', () => {
        const prefix = this.options.prefix;
        const toggleClassName = `${prefix}-toggle`;
        const html = `
    <div class="${toggleClassName}" style="display: block"> 
      <i class="${prefix}-toggle-icon" role="button"></i> 
      <div class="${prefix}-toggle__brand"><span>O</span>outline</div>  
      <div class="${prefix}-toggle__mover"></div> 
    </div>`;
        const toggleStyle = `
    .${toggleClassName} {
      --toggler-color-bg: #fff;
      --toggler-color-text: #6a6a6a;
      color: var(--color-fg-default,#24292f);
      background-color: var(--toggler-color-bg);
      box-shadow: 0 2px 8px var(--color-border-default,var(--color-border-primary));
      opacity: 1;
      line-height: 1;
      position: fixed;
      right: 0;
      top: 50vh;
      text-align: center;
      width: 30px;
      z-index: 1000000001;
      cursor: pointer;
      border-radius: 0px 6px 6px 0px;
      border-width: 1.5px 1.5px 1.5px;
      border-style: solid solid solid none;
      border-color: rgb(207, 215, 223) rgb(207, 215, 223) rgb(207, 215, 223);
      border-image: initial;
      border-left: none;
      padding: 2px 0px 32px;
      transition: right 0.25s ease-in 0.2s, opacity 0.35s ease-in 0.2s;
    }
    .${prefix}-toggle-icon {
      position: relative;
      opacity: 0.65;
      pointer-events: none;
      top: 5px;
    }
    .${prefix}-toggle-icon::before {
      // color: var(--toggler-color-text);
      // content: "";
      // font-size: 15px;
      // top: 0px;
      // width: 16px;
      // display: inline-block;
      // font-weight: 400;
      // position: relative;
      // font-variant: normal;
  }
    .${prefix}-toggle__brand {
      color: var(--toggler-color-text);
      display: inline-block;
      pointer-events: none;
      font-size: 14px;
      position: relative;
      top: 10px;
      transform: rotate(-180deg);
      writing-mode: tb-rl;
    }
    .${prefix}-toggle__brand > span {
      color: rgb(255, 92, 0) !important;
    }
    .${prefix}-toggle__mover {
      position: absolute;
      margin-left: 1px;
      bottom: -2px;
      left: -2px;
      right: -2px;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 24px;
      vertical-align: middle;
      user-select: none;
      cursor: move;
      opacity: 0.4;
      transition: opacity 0.1s ease 0s;
    }
    .${prefix}-toggle__mover::before {
      content: "";
      height: 2px;
      min-height: 2px;
      width: 12px;
      display: block;
      background-color: var(--toggler-color-text);
      border-radius: 1px;
    }
    .${prefix}-toggle__mover::after {
      margin-top: 2px;
    }
    .${prefix}-toggle__mover::after {
      content: "";
      height: 2px;
      min-height: 2px;
      width: 12px;
      display: block;
      background-color: var(--toggler-color-text);
      border-radius: 1px;
    }
  
  `;
        const toggleWrap = document.createElement('div');
        toggleWrap.innerHTML = html;
        return { node: toggleWrap, style: toggleStyle };
      });
      __publicField(this, 'insertStyle', () => {
        const styleEl = h('style', '', { id: this.styleDomId });
        styleEl.innerHTML(styleHtml);
        const head = document.querySelector('head');
        if (head) {
          const headEl = h(head);
          headEl.child(styleEl);
        }
      });
      __publicField(this, 'onLoad', () => {
        window.addEventListener('load', () => {
          const allTags = this.tree.getAllTags();
          let times = 0;
          let interval;
          if (!allTags.length) {
            interval = setInterval(() => {
              times = times + 1;
              if (times >= 3) {
                clearInterval(interval);
              }
              this.init();
            }, 500);
            return;
          }
        });
      });
      __publicField(this, 'clear', () => {
        const styleDom = document.querySelector(`#${this.styleDomId}`);
        const bodyDom = document.querySelector(`#${this.domId}`);
        if (styleDom) {
          styleDom.remove();
        }
        if (bodyDom) {
          bodyDom.remove();
        }
      });
      const adaptedOptions = this.getDefaultOptions();
      this.options = deepMerge(adaptedOptions, options);
      this.domId = `${this.options.prefix}-outline`;
      this.styleDomId = `${this.options.prefix}-style`;
      this.tree = new Tree(this.options);
      this.init(el);
    }
  }
  function getOutlineItemByDataTag(tag) {
    return document.querySelector(`[data-tag=${tag}]`);
  }
  function getHeadingEleByDataId(id) {
    return document.querySelector(`[data-id=${id}]`);
  }
  const outline2 = (el, options = {}) => new Outline(el, options);
  if (window) {
    window.js_outline = outline2;
  }
  exports.default = Outline;
  exports.outline = outline2;
  Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: 'Module' } });
  return exports;
})({});

if (window.js_outline) {
  window.js_outline().onLoad();
}

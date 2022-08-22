let headsTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

let treeData = {};

const prefix = 'xjs';

const wrapClassName = `_${prefix}-tree-wrap`;
const domId = `${prefix}-outline`;
const getHeaderNumber = (node) => {
  return node.nodeName.slice(1);
};

// 对不同网站做处理
const getContentDomId = function () {
  const { host } = window.location;
  let contentId = '';
  switch (host) {
    case 'github.com':
    case 'juejin.im':
    case 'zhuanlan.zhihu.com':
      contentId = 'article';
      break;
    default:
      contentId = 'body';
      break;
  }
  return contentId;
};

// 上个节点的父元素
const findParant = (prevNodeIndex) => {
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
  // target 的上个一个元素是父元素
  return stack[stack.length - 2];
};

/**
 * 上个元素的链路中找到当前和当前 header number 一样的元素
 * @param {*} curr 当前 header 节点
 * @param {*} prevNodeIndex // 上一个元素的 index
 * @returns
 */
const findTargetPathByPrevIndex = (curr, prevNodeIndex) => {
  const number = getHeaderNumber(curr);
  // 上个元素的链路元素
  const stack = [];
  // 上个元素的链路 index, 方面找到对应的节点
  const pathStack = [];
  let prevData;
  const find = (list) => {
    list.forEach((item, index) => {
      stack.push(item);
      pathStack.push(index);
      if (item.tagNodeIndex === prevNodeIndex) {
        prevData = item;
        return item;
      } else if (item.children) {
        find(item.children);
      }
      if (!prevData) {
        stack.pop();
        pathStack.pop();
      }
    });
  };
  find(treeData.children);

  const tr = (targetNumber) => {
    return stack.find((item) => item.headNumber === number);
  };

  let sameNumberItem;
  // 找到当前 header number, 没有则当前 number 往上 + 1 再找
  const temArr = new Array(prevData.headNumber - number).fill('');
  temArr.forEach((item, index) => {
    const result = tr(number + index);
    if (result) {
      sameNumberItem = result;
      return;
    }
  });

  if (sameNumberItem) {
    // sameNumber 的父元素
    return sameNumberItem;
  }
  // 没找到则返回上个元素
  return prevData;
};

const nodeAddAnchorName = (node, tagNodeIndex) => {
  node.setAttribute('data-id', tagNodeIndex);
};

const getTagNodeIndex = (index) => {
  return `xjs-${index}`;
};

const getAllTags = () => {
  const contentDomId = getContentDomId();
  const queryStr = headsTag.map((item) => `${contentDomId} ${item}`).join(',');
  const curTagNodes = document.querySelectorAll(queryStr);
  return Array.from(curTagNodes).map((curr, index) => {
    const { nodeName, innerText } = curr;
    const dataId = curr.dataset.id;
    const headNumber = nodeName.replace('H', '');
    const item =  {
      ...curr,
      nodeName,
      headNumber,
      innerText,
      tagNodeIndex: dataId || getTagNodeIndex(index),
    };
    if (!dataId) {
      nodeAddAnchorName(curr, item.tagNodeIndex);
    }
    return item
  }) 
}
// 123 23 234 或者 134 234
function getTags() {
  const curTagNodes = getAllTags()
  let lastItem = treeData;
  if (curTagNodes.length) {
    curTagNodes.forEach((curr, index) => {
      const { nodeName, innerText } = curr;  
      const item = curr
      let prevNode = index !== 0 ? curTagNodes[index - 1] : null;
      if (prevNode) {
        const prevNodeNumber = getHeaderNumber(prevNode);
        const currNodeNumber = getHeaderNumber(curr);
        // 1 > 2 | 1 > 3 | 1 > 4 前一个节点的 children 的第一个元素就当前元素, 对于 1 > 3 > 4 > 2 > 3 的情况 2 和 3 是平级的，所以找父元素不是当前元素减 1 则 找 当前元素 -2 的节点
        if (prevNodeNumber < currNodeNumber) {
          lastItem.children = [curr];
          // 1 > 2 > 2 上个元素的 children 加上这个元素
        } else if (prevNodeNumber == currNodeNumber) {
          const target = findParant(lastItem.tagNodeIndex);
          if (target) {
            target.children.push(item);
          } else {
            // 第一和二个节点都是 h1
            treeData.children.push(item);
          }
          //  123 23 中间 3 -> 2 的情况，找父元素不是当前元素减 1 则 找 当前元素 -2 的节点
        } else {
          // 如果当前 header 小于 前一个，需要找到前一个的父级中和当前 header 相同的元素，找到该元素的父级元素 push 当前 item
          // 找到和当前 number - 1 相等元素 push item
          const sameNumberItem = findTargetPathByPrevIndex(curr, lastItem.tagNodeIndex);
          const parent = findParant(sameNumberItem.tagNodeIndex);
          // 没找到父元素则放到上个元素的 children 中
          if (parent) {
            parent.children.push(item);
          } else {
            treeData.children.push(item);
          }
        }
      } else {
        lastItem.children = [item];
      }
      lastItem = item;
    });
  }
}

function generatorToggle() {
  const html = `
  <div class="${prefix}-toggle" style="display: block"> 
    <i class="${prefix}-toggle-icon" role="button"></i> 
    <div class="${prefix}-toggle__brand"><span>O</span>outline</div>  
    <div class="${prefix}-toggle__mover"></div> 
  </div>`;

  const toggleStyle = `
  .${prefix}-toggle {
    --toggler-color-bg: #fff;
    --toggler-color-text: #6a6a6a;
    color: var(--color-fg-default,#24292f);
    background-color: var(--toggler-color-bg);
    box-shadow: 0 2px 8px var(--color-border-default,var(--color-border-primary));
    opacity: 1;
    line-height: 1;
    position: absolute;
    let: 0;
    top: var(--${prefix}-toggler-y,33%);
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
}

const outlineItemClass = `${prefix}-outline-item`;

const generatorTree = () => {
  const wrap = document.createElement('div');
  wrap.className = wrapClassName;
  wrap.setAttribute('style', `display: none`);
  const padding = 10;
  let ele = '<ul id = "metismenu">';

  const traverse = (nodeList, level) => {
    nodeList.forEach((node) => {
      const textNodeHtml = `${node.innerText} <span style='font-weight: 600'>${node.children ? `(${node.children.length})` : ''}</span>`;
      const aElement =
        level == 0
          ? `<a class="has-arrow" aria-expanded="true" href='#${node.tagNodeIndex}'>${textNodeHtml}</a>`
          : `<a aria-expanded="true" href='#${node.tagNodeIndex}'>${textNodeHtml}</a>`;
      ele = ele + `<li style="padding-left:${padding * level}px" class='${outlineItemClass}' data-tag='${node.tagNodeIndex}'>${aElement}</li>`;
      if (node.children) {
        traverse(node.children, level + 1);
      }
    });
  };
  traverse(treeData.children, 1);
  ele += '</ul>';
  wrap.innerHTML = ele;

  // const style = document.createElement('style');
  const treeStyle = `
    .${prefix}-outline-item a {
      color: #333;
      text-decoration: none;
      font-size: 14px;
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
      z-index: 9999;
      overflow: auto;
      border-left: 1px solid #d0d7de;
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
};

function generatorDom() {
  const body = document.querySelector('body');
  const outlineEle = document.createElement('div');
  outlineEle.id = domId;

  // const ul = document.createElement('ul');
  // ul.id = 'metismenu'
  // console.log('treeData', treeData);

  // 目录展示
  const { node: treeNode, style: treeStyle } = generatorTree();

  outlineEle.appendChild(treeNode);

  setStyle(treeStyle);

  // toggleEle
  const { node: toggleEle, style: toggleStyle } = generatorToggle();
  toggleEle.addEventListener('mouseenter', () => {
    treeNode.style.setProperty('display', 'block');
  });
  setStyle(toggleStyle);
  outlineEle.appendChild(toggleEle);
  body.appendChild(outlineEle);
}

let styleHtml = `
  :root {
    --toggler-color-bg: #f5f5f5;
    --color-border-default: #e6e6e6;
  }
  @media (prefers-color-scheme: dark) {
    --toggler-color-bg: dard;
  }
`;
function setStyle(innerStyle) {
  styleHtml += innerStyle;
}

function insertScript(src) {
  const script = document.createElement('script');
  script.src = src;
  document.querySelector('body').appendChild(script);
}
function insertCss(src) {
  const link = document.createElement('link');
  link.href = src;
  link.rel = 'stylesheet';
  document.querySelector('body').appendChild(link);
}

const styleDomId = `${prefix}-style`;
function insertStyle() {
  const styleEle = document.createElement('style');
  styleEle.innerHTML = styleHtml;
  styleEle.setAttribute('id', styleDomId);
  document.querySelector('head').appendChild(styleEle);
}

const clear = () => {
  const styleDom = document.querySelector(`#${styleDomId}`);
  const bodyDom = document.querySelector(`#${domId}`);
  if (styleDom) {
    styleDom.remove();
  }
  if (bodyDom) {
    bodyDom.remove();
  }
};

function activeHandler() {
  const tags = getAllTags()
  let lastDisNode = null
  let minDis
  tags.forEach((tag) => {
    const dis = 1
    if(minDis !== undefined && dis < minDis ) {
      lastDisNode = tag
    }
  })

}

function events() {
  document.querySelectorAll(`.${outlineItemClass}`).forEach((item) => {
    item.addEventListener('click', (e) => {
      const tag = item.dataset.tag;
      const target = document.querySelector(`[data-id="${tag}"]`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  // window.addEventListener('scroll', activeHandler)
}

function init() {
  console.log('outline init begin');
  const allTags = getAllTags()
  if(!allTags.length) {
    console.log('没有 heading 标签');
    return
  }
  clear();
  getTags();
  generatorDom();
  insertStyle();
  events();
  console.log($('#metismenu'));

  $('#metismenu').metisMenu;
}
init();
function _get(object, path) {
  let currObj;
  while (path.length) {
    const key = path.shift();
    currObj = object[key];
  }
  return currObj;
}

function _set(object, path, value) {
  let obj = object;
  const len = path.length;
  while (path.length) {
    const key = path.shift();
    if (path.length === 0) {
      obj[key] = value;
    } else {
      if (typeof key === 'number') {
        obj = obj[key] ? obj[key] : [];
      } else if (typeof key === 'string') {
        obj = obj[key] ? obj[key] : {};
      }
    }
  }
}

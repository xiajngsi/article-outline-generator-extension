let headsTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

let treeData = {};

const wrapClassName = '_xjs-tree-wrap';
const getHeaderNumber = (node) => {
  return node.nodeName.slice(1);
};

// 对不同网站做处理
function getContentDomId() {
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
}

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

// 123 23 234 或者 134 234
function getTags() {
  const contentDomId = getContentDomId();
  const queryStr = headsTag.map((item) => `${contentDomId} ${item}`).join(',');
  const curTagNodes = document.querySelectorAll(queryStr);
  let lastItem = treeData;
  if (curTagNodes.length) {
    curTagNodes.forEach((curr, index) => {
      const { nodeName, innerText } = curr;
      const headNumber = nodeName.replace('H', '');
      const item = {
        nodeName,
        headNumber,
        innerText,
        tagNodeIndex: index,
        flag: true
      };
      let prevNode = index !== 0 ? curTagNodes[index - 1] : null;
      if (prevNode) {
        const prevNodeNumber = getHeaderNumber(prevNode);
        const currNodeNumber = getHeaderNumber(curr);
        // 1 > 2 | 1 > 3 | 1 > 4 前一个节点的 children 的第一个元素就当前元素, 对于 1 > 3 > 4 > 2 > 3 的情况 2 和 3 是平级的，所以找父元素不是当前元素减 1 则 找 当前元素 -2 的节点
        if (prevNodeNumber < currNodeNumber) {
          lastItem.children = [item];
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

function generatorTree() {
  if (document.querySelector(wrapClassName)) {
    document.querySelector(wrapClassName).remove();
  }
  const body = document.querySelector('body');
  const wrap = document.createElement('div');
  wrap.className = wrapClassName;
  const padding = 10;
  let ele = '';

  const traverse = (nodeList, level) => {
    nodeList.forEach((node) => {
      ele = ele + `<div style="padding-left:${padding * level}px">${node.innerText}</div>`;
      if (node.children) {
        traverse(node.children, level + 1);
      }
    });
  };
  traverse(treeData.children, 1);
  wrap.innerHTML = ele;
  body.appendChild(wrap);
}

function insertStyle() {
  const style = document.createElement('style');
  style.innerHTML = `
    ._xjs-tree-wrap {
      background-color: white;
      position: fixed;
      top: 0;
      left:0;
      height: calc(100vh - 50px);
      width: 300px;
      z-index: 9999;
      overflow: auto
    }
    @media (prefers-color-scheme: dark) {
      ._xjs-tree-wrap {
        background-color: black;
        color: white
      }
    }
    
    @media (prefers-color-scheme: light) {
      
    }
   
  `;
  document.querySelector('header').appendChild(style);
}

function insertScript(src) {
  const script = document.createElement('script');
  script.src = src;
  document.querySelector('body').appendChild(script);
}

function init() {
  insertScript('https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js');
  insertStyle();
  getTags();
  generatorTree();
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

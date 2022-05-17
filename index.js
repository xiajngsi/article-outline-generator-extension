let headsTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

let treeData = [];

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
// 123 23 234
function getTags() {
  const contentDomId = getContentDomId();
  const queryStr = headsTag.map((item) => `${contentDomId} ${item}`).join(',');
  const curTagNodes = document.querySelectorAll(queryStr);
  let parentNode = treeData;
  if (curTagNodes.length) {
    curTagNodes.forEach((curr, index) => {
      const { nodeName, innerText } = curr;
      const headNumber = nodeName.replace('H', '');
      const item = {
        nodeName,
        innerText,
        children: []
      };
      let prevNode = index !== 0 ? curTagNodes[index - 1] : null;

      if (prevNode) {
        const prevNodeNumber = getHeaderNumber(prevNode);
        const currNodeNumber = getHeaderNumber(curr);
        if (prevNodeNumber < currNodeNumber) {
          if (parentNode.children) {
            parentNode = parentNode.children[parentNode.children.length - 1];
          }
          parentNode.children = [item];
        } else if (prevNodeNumber == currNodeNumber) {
          if (parentNode.children) {
            parentNode.children.push(item);
          } else {
            parentNode = item;
            treeData.push(item);
          }
        } else {
          treeData.push(item);
          parentNode = item;
        }
      } else {
        parentNode = item;
        treeData.push(item);
      }
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
  traverse(treeData, 1);
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

function init() {
  insertStyle();
  getTags(treeData, 1);
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

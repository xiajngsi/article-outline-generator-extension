let headsTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

let treeData = [];

const getHeaderNumber = (node) => {
  return node.nodeName.slice(1);
};

function getTags() {
  const curTagNodes = document.querySelectorAll(headsTag.join(','));
  let parentNode = null;
  if (curTagNodes.length) {
    curTagNodes.forEach((curr, index) => {
      const { nodeName, innerText } = curr;
      const headNumber = nodeName.replace('H', '');
      const item = {
        nodeName,
        innerText
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
  const body = document.querySelector('body');
  const wrap = document.createElement('div');
  wrap.className = 'tree-wrap';
  const padding = 20;
  let ele;

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
    .tree-wrap {
      background-color: white;
      position: fixed;
      top: 0;
      left:0;
      height: calc(100vh - 50px);
      width: 500px;
      z-index: 9999;
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

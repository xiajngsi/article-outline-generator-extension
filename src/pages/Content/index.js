import { matchPattern } from 'browser-extension-url-match'
import { printLine } from './modules/print';
import { init } from './modules/outline';
import populateSectionData from './util/populateSectionData';
import createNav from './util/createNav';
import setupClickHandlers from './setupClickHandlers';
import setupScrollHandler from './setupScrollHandler';
import setupResizeHandler from './setupResizeHandler';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

// TODO 域名内的默认显示,   可以通过配置文件来配置
let domains = {
    juejin: {url:'https://juejin.cn/post/*', selector: 'article-content'},
    github: {url: 'https://github.com/*/*', selector:'#readme'}
};
const currentDomain = window.location.href;
let isDomainMatch = false;
let dom
for (const domain of Object.values(domains)) {
    const matcher = matchPattern(domain.url);
    const result = matcher.match(currentDomain)    
    if (result) {
        isDomainMatch = true;
        if(domain.selector.indexOf('#') === 0){
            dom = document.getElementById(domain.selector.substring(1))
        }
        if(domain.selector.indexOf('.') === 0){
            const doms = document.getElementsByClassName(domain.selector.substring(1))
            if(doms) dom = doms[0]
        }
        break;
    }
}
if (isDomainMatch) {
    generateNav(dom);
}else{
    console.log('This site is not matched, so outliner not work');
}

function generateNav(dom = document.body) {
    const settings = {
        sections: 'h2',
        // insertTarget: elem,
        insertLocation: 'before',
        easingStyle: 'easeOutQuad',
        updateHistory: true
}
// 构造位置数据
const sectionsDom = dom.querySelectorAll('h2')
const h2List = populateSectionData(sectionsDom, settings)

const callData = {
    settings,
    data: h2List,
    nav: createNav(h2List)
}
// 初始化结构
init(callData.nav)
// console.log(h2List);
setupScrollHandler(callData);
setupClickHandlers(callData);
setupResizeHandler(callData);
}


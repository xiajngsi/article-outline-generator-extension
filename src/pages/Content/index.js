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


// 构造位置数据
const sectionsDom = document.querySelectorAll('h2')
const settings = {
        sections: 'h2',
        // insertTarget: elem,
        insertLocation: 'before',
        easingStyle: 'easeOutQuad',
        updateHistory: true
    }
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
// clickHandler = setupClickHandlers(this);
//   resizeHandler = setupResizeHandler(this);



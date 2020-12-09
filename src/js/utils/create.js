export default function create(element) {
  let htmlElement = null;
  if (element.tagName) {
    htmlElement = document.createElement(element.tagName);
  } else {
    throw new Error(`Can't create ${element.tagName}, give a proper tag name!`);
  }

  if (element.children && Array.isArray(element.children)) {
    element.children.forEach((childElement) => childElement && htmlElement.append(childElement));
  } else if (element.children && typeof element.children === 'object') {
    htmlElement.appendChild(element.children);
  } else if (element.children && typeof element.children === 'string') {
    htmlElement.innerHTML = element.children;
  }

  if (element.parent) {
    element.parent.append(htmlElement);
  }

  if (element.classNames) htmlElement.classList.add(...element.classNames.split(' '));

  if (element.dataAttr && element.dataAttr.length) {
    element.dataAttr.forEach(([attrName, attrValue]) => {
      if (attrName === '') {
        htmlElement.setAttribute(attrName, '');
      }
      if (attrName.match(/value|id|placeholder|href|src|type|for/)) {
        htmlElement.setAttribute(attrName, attrValue);
      } else {
        htmlElement.dataset[attrName] = attrValue;
      }
    });
  }

  return htmlElement;
}

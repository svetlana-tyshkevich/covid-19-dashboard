export default function create({
  tagName, classNames, children, parent, dataAttr,
}) {
  let htmlElement = null;
  if (tagName) {
    htmlElement = document.createElement(tagName);
  } else {
    throw new Error(`Can't create ${tagName}, give a proper tag name!`);
  }

  if (children && Array.isArray(children)) {
    children.forEach((childElement) => childElement && htmlElement.append(childElement));
  } else if (children && typeof children === 'object') {
    htmlElement.appendChild(children);
  } else if (children && typeof children === 'string') {
    htmlElement.innerHTML = children;
  }

  if (parent) {
    parent.append(htmlElement);
  }

  if (classNames) htmlElement.classList.add(...classNames.split(' '));

  if (dataAttr && dataAttr.length) {
    dataAttr.forEach(([attrName, attrValue]) => {
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

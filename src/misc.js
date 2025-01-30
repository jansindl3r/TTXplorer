export function isOnlyTextNode(element) {
  return element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE && element.childNodes[0].textContent.trim().length > 0;
}

export function getColumnsKeys(data) {
  return [
    ...[...data.children].reduce((acc, child) => {
      if (isOnlyTextNode(child)) {
        acc.add("textContent");
      }
      [...child.attributes].forEach((attribute) => {
        if (attribute.specified) {
          acc.add(attribute.name);
        }
      });
      return acc;
    }, new Set()),
  ];
}

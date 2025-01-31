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

export function changeColor(color, amount) { // #FFF not supportet rather use #FFFFFF
  const clamp = (val) => Math.min(Math.max(val, 0), 0xFF)
  const fill = (str) => ('00' + str).slice(-2)

  const num = parseInt(color.substr(1), 16)
  const red = clamp((num >> 16) + amount)
  const green = clamp(((num >> 8) & 0x00FF) + amount)
  const blue = clamp((num & 0x0000FF) + amount)
  return '#' + fill(red.toString(16)) + fill(green.toString(16)) + fill(blue.toString(16))
}

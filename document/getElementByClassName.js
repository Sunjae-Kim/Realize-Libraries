var getElementsByClassName = function(className) {

  function checkNode(node) {
    if (node.hasAttribute("class")) {
      const c = " " + node.className + " ";
       if (c.indexOf(" " + className + " ") != -1)
         return NodeFilter.FILTER_ACCEPT;
    }
    return NodeFilter.FILTER_SKIP;
  }

  const treeWalker = document.createTreeWalker(document.documentElement, 
    NodeFilter.SHOW_ELEMENT, checkNode, true);

  const result = [];

  if (treeWalker) {
    let node = treeWalker.nextNode();
    while (node) {
      result.push(node);
      node = treeWalker.nextNode();
    }
  }

  return result;
};

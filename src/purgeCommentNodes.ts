export default function purgeCommentNodes(root: Node) {
    if (!root.childNodes) {
        return;
    }

    for (let i = 0; i < root.childNodes.length; i++) {
        const node = root.childNodes.item(i);

        if (node.nodeName === '#comment') {
            root.removeChild(node);
        } else {
            purgeCommentNodes(node);
        }
    }
}
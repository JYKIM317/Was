const PostNavigation = (id, children = []) => {
    const childrenNode = children.join("\n");
    return `<div class="post-navigation" id="${id}">
        ${childrenNode}
    </div>`;
}

export { PostNavigation }
const PostInfo = (author, createAt, viewCount) => {
    return `<div class="post-info">
        <span>작성자: ${author}</span>
        <span>작성일자: ${createAt}</span>
        <span>조회: ${viewCount}</span>
    </div>`;
}

const PostContent = (content) => {
    return `<div class="post-content">
        ${content}
    </div>`;
}

const PostNavigation = (id, children = []) => {
    const childrenNode = children.join("\n");
    return `<div class="post-navigation" id="${id}">
        ${childrenNode}
    </div>`;
}

export { PostInfo, PostContent, PostNavigation }
const PostInfo = (author, createAt, viewCount) => {
    return `<div class="post-info">
        <span>작성자: ${author}</span>
        <span>작성일자: ${createAt}</span>
        <span>조회: ${viewCount}</span>
    </div>`;
}

const PostContent = (children = []) => {
    const childrenNode = children.join("\n");
    return `<div class="post-content">
        ${childrenNode}
    </div>`;
}

const ImageContent = (image, contentType) => {
    return `<img id="post-content-image" src="data:${contentType};base64,${image}" alt="image" />`;
}

const PostNavigation = (id, children = []) => {
    const childrenNode = children.join("\n");
    return `<div class="post-navigation" id="${id}">
        ${childrenNode}
    </div>`;
}

export { PostInfo, PostContent, PostNavigation, ImageContent }
const Board = (children = []) => {
    const childrenNode = children.join("\n");
    return `<div class="vertical-hug-frame" id="board">
    ${childrenNode}
    </div>`;
}

const PostTable = (children = []) => {
    const childrenNode = children.join("\n");
    return `<div class="post-table">
    ${childrenNode}
    </div>`;
}

const PostElement = (data, id) => {
    return `<div class="post-element" id="${id}">
        ${PostTitle(data.title)}
        ${PostAuthor(data.author)}
        ${PostCreateAt(data.createAt)}
        ${PostViewCount(data.view)}
    </div>`;
}

const PostTitle = (title) => {
    return `<div class="post-element-title">
        ${title}
    </div>`;
}

const PostAuthor = (author) => {
    return `<div class="post-element-author">
        ${author}
    </div>`;
}

const PostCreateAt = (createAt) => {
    return `<div class="post-element-create-at">
        ${createAt}
    </div>`;
}

const PostViewCount = (viewCount) => {
    return `<div class="post-element-view-count">
        ${viewCount}
    </div>`;
}

const BoardNavigation = (children = []) => {
    const childrenNode = children.join("\n");
    return `<div class="board-navigation">
        ${childrenNode}
    </div>`;
}

export { Board, PostTable, PostElement, BoardNavigation }
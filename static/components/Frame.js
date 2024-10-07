
const Navigation = (title, children = []) => {
    const childrenNode = children.join("\n");
    return `<div class="navigation">
        <h3>${title}</h3>
        ${childrenNode}
    </div>`;
}

const Information = (title, id, children = []) => {
    const childrenNode = children.join("\n");
    return `<div class="information" id="${id}">
        <h1>${title}</h1>
        ${childrenNode}
    </div>`;
}

const HugFrame = (id, children = []) => {
    const childrenNode = children.join("\n");
    return `<div class="hug-frame" id="${id}">
        ${childrenNode}
    </div>`;
}

export { Navigation, Information, HugFrame }
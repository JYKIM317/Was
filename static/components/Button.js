
const SmallButton = (text, id) => {
    return `<button class="button small" id="${id}">
        ${text}
    </button>`;
};

const LargeButton = (text, id) => {
    return `<button class="button large" id="${id}">
        ${text}
    </button>`;
}

export { SmallButton, LargeButton }
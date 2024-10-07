
const InputBox = (
    id,
    label,
    type,
    placeholder,
    required = true,
) => {
    return `<div class="input-container" id="${id}">
        <label>${label}</label>
        <input type="${type}" placeholder="${placeholder}" required="${required}"/>
    </div>`;
};

export { InputBox }
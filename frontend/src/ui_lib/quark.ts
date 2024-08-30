type Attributes = { [key: string]: any }

export type Quark = HTMLElement

/**
 * Creates a new HTML element, sets its attributes, and appends it to the parent element.
 *
 * @param {Quark} parent - The parent element to which the new element will be appended.
 * @param {string} tagName - The tag name of the new HTML element (e.g., 'div', 'span').
 * @param {string} [className=''] - The class name to be assigned to the new element. Defaults to an empty string.
 * @param {Attributes} [attributes={}] - An object containing key-value pairs of attributes to be set on the new element. Defaults to an empty object.
 * @param {(q: Quark) => void} [q] - An optional callback function to be executed with the new element as its argument.
 * @returns {HTMLElement} The newly created HTML element.
 */
export function QuarkFunction(parent: Quark, tagName: string, className: string, attributes: Attributes, q?: (q: Quark) => void): Quark

/**
 * Creates a new HTML element, sets its attributes, and appends it to the parent element.
 *
 * @param {Quark} parent - The parent element to which the new element will be appended.
 * @param {string} tagName - The tag name of the new HTML element (e.g., 'div', 'span').
 * @param {string} [className=''] - The class name to be assigned to the new element. Defaults to an empty string.
 * @param {Attributes} [attributes={}] - An object containing key-value pairs of attributes to be set on the new element. Defaults to an empty object.
 * @param {string} [innerText] - An optional string to be set as the inner text of the new element.
 * @returns {HTMLElement} The newly created HTML element.
 */
export function QuarkFunction(parent: Quark, tagName: string, className: string, attributes: Attributes, innerText?: string): Quark

export function QuarkFunction(parent: Quark, tagName: string, className: string = '', attributes: Attributes = {}, qOrInnerText?: ((q: Quark) => void) | string): Quark {
    const element = document.createElement(tagName);

    element.className = className;

    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
    }

    parent.appendChild(element);

    if (typeof qOrInnerText === 'function') {
        qOrInnerText(element);
    } else if (typeof qOrInnerText === 'string') {
        element.innerText = qOrInnerText;
    }

    return element;
}
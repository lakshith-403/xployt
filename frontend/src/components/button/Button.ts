import './../../styles/Button.scss';

// Define the types for the props
interface ButtonProps {
    text: string;
    variant?: 'primary' | 'secondary' | 'alt';
    onClick?: () => void;
    style?: Partial<CSSStyleDeclaration>;
    padding?: string;
    margin?: string;
    textColor?: string;
    className?: string;
}

export function createButton({
    text,
    variant = 'primary',
    onClick,
    style,
    padding,
    margin,
    textColor,
    className,
}: ButtonProps): HTMLButtonElement {
    // Create a button element
    const button = document.createElement('button');

    // Determine the appropriate class based on the variant
    const getButtonClass = (): string => {
        switch (variant) {
            case 'secondary':
                return 'button-secondary';
            case 'primary':
                return 'button-primary';
            case 'alt':
                return 'button-alt';
            default:
                return 'button-primary';
        }
    };

    // Set the className
    button.className = `custom-button ${getButtonClass()} ${className || ''}`;

    // Apply the styles
    if (style) {
        Object.assign(button.style, style);
    }

    if (padding) button.style.padding = padding;
    if (margin) button.style.margin = margin;
    if (textColor) button.style.color = textColor;

    // Set the text content
    button.textContent = text;

    // Attach the onClick handler if provided
    if (onClick) {
        button.addEventListener('click', onClick);
    }

    return button;
}

// Example usage
const myButton = createButton({
    text: 'Click Me',
    variant: 'primary',
    onClick: () => alert('Button clicked!'),
    style: { backgroundColor: 'blue' },
    padding: '10px 20px',
    margin: '5px',
    textColor: 'white',
    className: 'my-custom-class',
});

// Append the button to the body or another container element
document.body.appendChild(myButton);

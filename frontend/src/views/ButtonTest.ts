import { createButton } from './../components/button/Button'; // Import the function from where it is defined
import { View, ViewHandler } from "../ui_lib/view"

class TestCreateButtonView extends View {
  constructor(params: any) {
    super();
  }

  render() {
    // Function to test the `createButton` functionality
    function testCreateButton() {
      // Test case 1: Create a primary button
    const primaryButton = createButton({
      text: 'Primary Button',
      variant: 'primary',
      onClick: () => console.log('Primary Button Clicked'),
    });

      // Assert button creation
      console.assert(primaryButton.tagName === 'BUTTON', 'Primary Button should be a button element');
      console.assert(primaryButton.className.includes('button-primary'), 'Primary Button should have the "button-primary" class');
      console.assert(primaryButton.textContent === 'Primary Button', 'Primary Button should have correct text content');

      // Append to body for manual inspection
      document.body.appendChild(primaryButton);

      // Simulate a click event
      primaryButton.click();

      // Test case 2: Create a secondary button with no styles
      const secondaryButton = createButton({
        text: 'Secondary Button',
        variant: 'secondary',
        onClick: () => console.log('Secondary Button Clicked'),
      });

      // Assert button creation
      console.assert(secondaryButton.tagName === 'BUTTON', 'Secondary Button should be a button element');
      console.assert(secondaryButton.className.includes('button-secondary'), 'Secondary Button should have the "button-secondary" class');
      console.assert(secondaryButton.textContent === 'Secondary Button', 'Secondary Button should have correct text content');

      // Append to body for manual inspection
      document.body.appendChild(secondaryButton);

      // Simulate a click event
      secondaryButton.click();

      // Test case 3: Create a button with an alternative variant
      const altButton = createButton({
        text: 'Alt Button',
        variant: 'alt',
        onClick: () => console.log('Alt Button Clicked'),
        style: { backgroundColor: 'green' },
      });

      // Assert button creation
      console.assert(altButton.tagName === 'BUTTON', 'Alt Button should be a button element');
      console.assert(altButton.className.includes('button-alt'), 'Alt Button should have the "button-alt" class');
      console.assert(altButton.textContent === 'Alt Button', 'Alt Button should have correct text content');

      // Append to body for manual inspection
      document.body.appendChild(altButton);

      // Simulate a click event
      altButton.click();

      console.log('All test cases passed!');
    }

    // Execute the test function
    testCreateButton();
  }
}

export const testCreateButtonViewHandler = new ViewHandler('/button', TestCreateButtonView);
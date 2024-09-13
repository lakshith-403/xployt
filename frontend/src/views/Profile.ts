import { Quark, QuarkFunction as $ } from "../ui_lib/quark";
import { View, ViewHandler } from "../ui_lib/view";
import { TextField } from "../components/text_field/base";
import { IconButton } from "../components/button/icon.button";
import { Button, ButtonType } from "../components/button/base";
import "./Profile.scss";

export class ProfileView extends View {
  constructor() {
    super();
  }

  public render(q: Quark): void {
    $(q, 'div', 'profile-view', {}, (q) => {
      // Header row
      $(q, 'div', 'profile-header', {}, (q) => {
        $(q, 'h1', '', {}, 'Hello Lakshith!');
        
        $(q, 'div', 'profile-picture-container', {}, (q) => {
          $(q, 'img', 'profile-picture', { src: 'path/to/profile-picture.jpg', alt: '' });
          
          $(q, 'div', 'profile-picture-button-container', {}, (q) => {
            new IconButton({
              label: '',
              icon: 'fa fa-camera',
              onClick: () => console.log('Change profile picture'),
            }).render(q);
          });
        });
      });

      // Profile details
      $(q, 'div', 'profile-details', {}, (q) => {
        new TextField({ label: 'Name' }).render(q);
        new TextField({ label: 'Email', type: 'email' }).render(q);
        new TextField({ label: 'Phone Number', type: 'tel' }).render(q);
      });

      // Save button
      $(q, 'div', 'save-button-container', {}, (q) => {
        new Button({
          label: 'Save Changes',
          type: ButtonType.PRIMARY,
          onClick: () => console.log('Save changes'),
        }).render(q);
      });
    });
  }
}

export const profileViewHandler = new ViewHandler('', ProfileView);
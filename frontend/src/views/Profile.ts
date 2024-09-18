import { Quark, QuarkFunction as $ } from "../ui_lib/quark";
import { View, ViewHandler } from "../ui_lib/view";
import { TextField } from "../components/text_field/base";
import { IconButton } from "../components/button/icon.button";
import { Button, ButtonType } from "../components/button/base";
import "./Profile.scss";
import { CollapsibleBase } from "../components/Collapsible/collap.base";

export class ProfileView extends View {

  private userInfoCollapsible: CollapsibleBase;
  private fundsCollapsible: CollapsibleBase;


  constructor() {
    super();
    this.userInfoCollapsible = new CollapsibleBase("User Info", "user-info");
    this.fundsCollapsible = new CollapsibleBase("Funds", "funds");
  }

  public render(q: Quark): void {
    $(q, 'div', 'profile-view', {}, (q) => {
      // Header row
      $(q, 'div', 'profile-header', {}, (q) => {
        $(q, 'h1', '', {}, 'Hello Lakshith!');
        $(q, 'div', 'profile-picture-container', {}, (q) => {
          $(q, 'img', 'profile-picture', { src: 'https://picsum.photos/id/237/200/300', alt: '' });
          
          $(q, 'div', 'profile-picture-button-container', {}, (q) => {
            new IconButton({
              label: '',
              icon: 'fa fa-camera',
              onClick: () => console.log('Change profile picture'),
            }).render(q);
          });
        });
      });

      this.userInfoCollapsible.render(q);
      this.fundsCollapsible.render(q);
    });

    $(this.userInfoCollapsible.content!, 'div', 'user-info-content', {}, (q) => {
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

    $(this.fundsCollapsible.content!, 'div', 'funds-content', {}, (q) => {
      $(q, 'div', 'funds-details', {}, (q) => {
        $(q, 'div', 'fund-box', {}, (q) => {
          $(q, 'h2', 'title', {}, 'Amount Remaining');
          $(q, 'p', 'amount', {}, '$1000');
        });

        $(q, 'div', 'fund-box', {}, (q) => {
          $(q, 'h2', 'title', {}, 'Amount Spent');
          $(q, 'p', 'amount', {}, '$1300');
        });

        $(q, 'div', 'fund-box button-container', {}, (q) => {
          new Button({
            label: 'Add Funds',
            type: ButtonType.PRIMARY,
            onClick: () => console.log('Add funds'),
          }).render(q);

          new Button({
            label: 'View Transactions',
            type: ButtonType.SECONDARY,
            onClick: () => console.log('Withdraw funds'),
          }).render(q);
        });
      });
    });
  }
}

export const profileViewHandler = new ViewHandler('', ProfileView);
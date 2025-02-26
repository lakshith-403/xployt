import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import LoadingScreen from '@components/loadingScreen/loadingScreen';
import './basicInfo.scss';
import {User} from "@data/user";
import {Project} from "@data/common/cache/project.cache";
import UserCard from "@components/UserCard";

export default class BasicInfoComponent {
  private currentUser: User = {} as User;
  private project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  async loadData(): Promise<void> {
    // try {
    //   this.currentUser = await CACHE_STORE.getUser().get();
    //
    //   this.projectTeam.projectLead = fullTeam.projectLead;
    //   if (this.currentUser.type === 'Hacker') {
    //     this.projectTeam.assignedValidator = fullTeam.validators[0];
    //   }
    //   console.log('Project Team', this.projectTeam);
    // } catch (error) {
    //   console.error('Failed to load project data', error);
    // }
  }

  async render(q: Quark): Promise<void> {
    const loading = new LoadingScreen(q);
    loading.show();

    await this.loadData();
    loading.hide();

    $(q, 'div', '', { id: 'basic-info' }, (q) => {
      $(q, 'div', 'section-content', {}, (q) => {
        $(q, 'div', '', {}, (q) => {
          $(q, 'span', '', {}, (q) => {
            $(q, 'p', 'key', {}, 'Client');
            $(q, 'p', 'value', {}, this.project.clientId);
          });
          $(q, 'span', '', {}, (q) => {
            $(q, 'p', 'key', {}, 'Access Link');
            $(q, 'a', 'key link', { href: '#', target: '_blank' }, (q) => {
                $(q, 'p', 'value', {}, 'www.example.com');
            });
          });
        });
        $(q, 'div', '', {}, (q) => {
          if (this.currentUser.type !== 'ProjectLead') {
            // new Card({
            //   title: 'Project Lead',
            //   content: $(q, 'div', 'description', {}, (q) => {
            //     $(q, 'span', '', {}, (q) => {
            //       $(q, 'p', 'value', {}, this.projectTeam.projectLead.name);
            //     });
            //     $(q, 'p', 'value link', {}, this.projectTeam.projectLead.email);
            //   }),
            // }).render(q);
            console.log("LeadID", this.project.leadId);
            new UserCard(this.project.leadId, 'lead', 'card', 'Project Lead').render(q);
          }
          if (this.currentUser.type === 'Hacker') {
            // new Card({
            //   title: 'Assigned Validator',
            //   content: $(q, 'div', 'description', {}, (q) => {
            //     $(q, 'span', '', {}, (q) => {
            //       $(q, 'p', 'value', {}, this.projectTeam.assignedValidator.name);
            //     });
            //     $(q, 'p', 'value link', {}, this.projectTeam.assignedValidator.email);
            //   }),
            // }).render(q);
            //   new UserCard(this.project.)
          }
        });
      });
    });
  }
}

function convertToTitleCase(input: string): string {
  const words = input.replace(/([A-Z])/g, ' $1').trim();
  return words.replace(/\w\S*/g, (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}
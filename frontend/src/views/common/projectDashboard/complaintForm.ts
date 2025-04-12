import { View, ViewHandler } from '@ui_lib/view';
import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { FormTextField } from '@/components/text_field/form.text_field';
import { FormButton } from '@/components/button/form.button';
import { ButtonType } from '@/components/button/base';
import NETWORK from '@/data/network/network';
import { router } from '@/ui_lib/router';
import { modalAlertForErrors } from '@/main';
import ModalManager, { setContent } from '@/components/ModalManager/ModalManager';
import { CACHE_STORE } from '@data/cache';
import { ProjectTeamCache, ProjectTeam } from '@data/common/cache/projectTeam.cache';
import LoadingScreen from '@components/loadingScreen/loadingScreen';
import { Checkbox } from '@/components/checkboxManager/checkbox';

class ComplaintForm extends View {
  private titleField: FormTextField;
  private notesField: FormTextField;
  private projectId: string;
  private projectTeam: ProjectTeam = {} as ProjectTeam;
  private readonly projectTeamCache: ProjectTeamCache;
  private selectedTeamMembers: Set<string> = new Set();
  private teamCheckboxes: { [key: string]: Checkbox } = {};

  constructor(params: any) {
    super();
    this.projectId = params.projectId;
    this.projectTeamCache = CACHE_STORE.getProjectTeam(this.projectId) as ProjectTeamCache;

    this.titleField = new FormTextField({
      label: 'Complaint Title',
      placeholder: 'Enter complaint title',
      name: 'title',
    });

    this.notesField = new FormTextField({
      label: 'Notes',
      placeholder: 'Enter complaint details',
      name: 'notes',
      type: 'textarea',
    });
  }

  private async loadData(): Promise<void> {
    try {
      this.projectTeam = await this.projectTeamCache.load(this.projectId);
    } catch (error) {
      console.error('Failed to load project team data:', error);
    }
  }

  private createTeamCheckbox(id: string, name: string, role: string): Checkbox {
    return new Checkbox({
      label: `${name} (${role})`,
      checked: false,
      onChange: (checked) => {
        if (checked) {
          this.selectedTeamMembers.add(id);
        } else {
          this.selectedTeamMembers.delete(id);
        }
      },
    });
  }

  private async handleSubmit(): Promise<void> {
    try {
      const formData = {
        title: this.titleField.getValue(),
        notes: this.notesField.getValue(),
        projectId: this.projectId,
        teamMembers: Array.from(this.selectedTeamMembers),
      };

      await NETWORK.post('/api/complaints', formData, { showLoading: true });
      router.navigateTo(`/projects/${this.projectId}`);
    } catch (error: any) {
      setContent(modalAlertForErrors, {
        '.modal-title': 'Error',
        '.modal-message': `Failed to submit complaint: ${error.message}`,
        '.modal-data': error.data,
        '.modal-servletClass': error.servlet,
        '.modal-url': error.uri,
      });
      ModalManager.show('alertForErrors', modalAlertForErrors, true);
    }
  }

  async render(q: Quark): Promise<void> {
    const loading = new LoadingScreen(q);
    loading.show();

    await this.loadData();
    loading.hide();

    $(q, 'div', 'complaint-form container', {}, (q) => {
      $(q, 'h1', 'title text-center', {}, 'Submit Complaint');

      $(q, 'div', 'form-container', {}, (q) => {
        $(q, 'div', 'form-field', {}, (q) => {
          this.titleField.render(q);
        });

        $(q, 'div', 'form-field', {}, (q) => {
          this.notesField.render(q);
        });

        $(q, 'div', 'team-selection', {}, (q) => {
          $(q, 'h3', 'team-title', {}, 'Select Team Members to Notify');

          const hackers = this.projectTeam.getHackersWithoutId();
          const validators = this.projectTeam.getValidatorsWithoutId();

          if (hackers.length > 0) {
            $(q, 'div', 'team-section', {}, (q) => {
              $(q, 'h4', 'section-title', {}, 'Hackers');
              hackers.forEach((hacker: any) => {
                const checkbox = this.createTeamCheckbox(hacker.id, hacker.name, 'Hacker');
                this.teamCheckboxes[hacker.id] = checkbox;
                $(q, 'div', 'team-member', {}, (q) => {
                  checkbox.render(q);
                });
              });
            });
          }

          if (validators.length > 0) {
            $(q, 'div', 'team-section', {}, (q) => {
              $(q, 'h4', 'section-title', {}, 'Validators');
              validators.forEach((validator: any) => {
                const checkbox = this.createTeamCheckbox(validator.id, validator.name, 'Validator');
                this.teamCheckboxes[validator.id] = checkbox;
                $(q, 'div', 'team-member', {}, (q) => {
                  checkbox.render(q);
                });
              });
            });
          }
        });

        $(q, 'div', 'form-actions', {}, (q) => {
          const submitButton = new FormButton({
            label: 'Submit',
            onClick: () => this.handleSubmit(),
            type: ButtonType.PRIMARY,
          });
          submitButton.render(q);
        });
      });
    });
  }
}

export const complaintFormViewHandler = new ViewHandler('/{projectId}/complaint', ComplaintForm);

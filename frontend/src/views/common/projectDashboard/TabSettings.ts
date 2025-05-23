import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { User, UserCache } from '@data/user';
import { CACHE_STORE } from '@data/cache';
import { Popup } from '@components/popup/popup.base';
import { TypeToConfirm } from '@components/typeToConfirm/typeToConfirm';
import { Project, ProjectCache } from '@data/common/cache/project.cache';
import { ProjectsClientCache } from '@data/client/cache/projects.cache';
import ModalManager, { setContent } from '@components/ModalManager/ModalManager';
import { modalAlertOnlyOK } from '@main';

export default class TabSettings {
  private user!: User;
  private userCache: UserCache;
  private projectId: string;
  private projectCache: ProjectCache;
  private clientProjectCache: ProjectsClientCache;
  private project!: Project;
  private closeProjectSetting!: Quark;

  constructor(projectId: string) {
    this.userCache = CACHE_STORE.getUser();
    this.projectId = projectId;
    this.projectCache = CACHE_STORE.getProject(projectId);
    this.clientProjectCache = CACHE_STORE.getClientProjects(projectId);
  }

  private renderSelect(q: Quark): void {
    let select = $(q, 'select', 'hello', (q: any) => {});

    const hackerOption = document.createElement('option');
    hackerOption.value = 'hacker';
    hackerOption.textContent = 'Hacker';
    select.appendChild(hackerOption);

    const mentorOption = document.createElement('option');
    mentorOption.value = 'mentor';
    mentorOption.textContent = 'Mentor';
    select.appendChild(mentorOption);

    select.addEventListener('change', (event) => {
      const selectedValue = (event.target as HTMLSelectElement).value;
      console.log('Selected value:', selectedValue);
    });
  }

  private renderRadio(q: Quark): void {
    let radio = $(
      q,
      'input',
      '',
      {
        type: 'radio',
        name: 'role',
        value: 'hacker',
      },
      (q) => {}
    );
    let radio2 = $(
      q,
      'input',
      '',
      {
        type: 'radio',
        name: 'role',
        value: 'mentor',
      },
      (q) => {}
    );
    radio.addEventListener('change', () => {
      console.log('radio: ');
      console.log((radio as HTMLInputElement).checked);

      console.log('radio 2:');
      console.log((radio2 as HTMLInputElement).checked);
    });
    radio2.addEventListener('change', () => {
      console.log((radio2 as HTMLInputElement).checked);
    });
  }

  private async loadData(): Promise<void> {
    try {
      this.user = await this.userCache.get();
      this.project = await this.projectCache.get();
    } catch (error) {
      console.error('Failed to load project data:', error);
    }
  }

  private async closeProject(): Promise<void> {
    const project = await this.clientProjectCache.closeProject(this.projectId);
    if (!project) {
      setContent(modalAlertOnlyOK, {
        '.modal-title': 'Error',
        '.modal-message': 'Failed to close project.',
      });
      await ModalManager.show('alertOnlyOK', modalAlertOnlyOK);
      console.error('Failed to close project');
      return;
    }
    console.log('Project closed');
  }

  private renderDeleteProjectButton(): void {
    this.closeProjectSetting.innerHTML = '';
    $(this.closeProjectSetting, 'div', 'container', {}, (q) => {
      this.project.state != 'Closed' && $(q, 'div', '', {}, 'Close Project');
      new Popup({
        overlayContent: $(q, 'div', '', {}, (q) => {
          $(q, 'h3', '', {}, 'Are you sure?');
          $(q, 'p', '', {}, 'This will close the project and no more vulnerability report submissions will be allowed.');
          new TypeToConfirm('I agree to close this project', () => {
            this.closeProject();
          }).render(q);
        }),
        label: 'DELETE PROJECT',
      }).render(q);
    });
  }

  async render(q: Quark): Promise<void> {
    await this.loadData();

    if (this.user.type !== 'Client') {
      $(q, 'p', 'text-center', {}, 'You are not authorized to view this page');
      return;
    }
    $(q, 'div', 'project-settings', {}, (q) => {
      $(q, 'h1', 'text-center heading-1', {}, 'Project Settings');
      this.closeProjectSetting = $(q, 'div', '', {}, (q) => {});
      this.renderDeleteProjectButton();
    });
  }
}

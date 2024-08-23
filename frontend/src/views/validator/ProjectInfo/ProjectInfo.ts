import { QuarkFunction as $, Quark } from '../../../ui_lib/quark';
import { View, ViewHandler } from '../../../ui_lib/view';
import './projectInfo.scss';
import {
  ProjectInfo,
  ProjectInfoCacheMock,
} from '../../../data/validator/projectInfo';
import { UserCache, UserCacheMock } from '../../../data/user';
import { CACHE_STORE } from '../../../data/cache';

class ProjectInfoView implements View {
  params: { projectId: string };
  projectCache: ProjectInfoCacheMock;
  ProjectInformation: ProjectInfo | {} = {};

  constructor(params: { projectId: string }) {
    this.params = params;
    this.projectCache = CACHE_STORE.getProjectInfo(this.params.projectId);
    console.log('param is', params);
  }

  async loadProjectData(): Promise<void> {
    try {
      this.ProjectInformation = await this.projectCache.get(
        false,
        this.params.projectId
      );
    } catch (error) {
      console.error('Failed to load project data:', error);
    }
  }
  selectedButton: string = 'Prohect Information';
  ProjectScope = { Scope: 'This is a scope' };
  ProjectTeam = { Team: 'This is a team' };
  rightChild: HTMLElement | null = null;
  buttons: HTMLElement[] = [];

  setSelectedButton(button: HTMLElement): void {
    this.selectedButton = button.innerHTML;
  }

  updateRightChild(q: Quark, selected: string): void {
    this.rightChild!.innerHTML = '';
    if (selected === 'Project Information') {
      // console.log(this.ProjectInformation);
      $(q, 'h2', 'section-title', {}, (q) => {
        q.innerHTML = 'Project Information';
      });
      for (const [key, value] of Object.entries(this.ProjectInformation)) {
        $(q, 'div', 'row', {}, (q) => {
          $(q, 'span', 'key', {}, (q) => {
            q.innerHTML = key;
          });
          $(q, 'span', 'value', {}, (q) => {
            q.innerHTML = value;
          });
        });
      }
    } else if (selected === 'Project Scope') {
      $(q, 'h2', 'section-title', {}, (q) => {
        q.innerHTML = 'Project Scope';
      });
      for (const [key, value] of Object.entries(this.ProjectScope)) {
        $(q, 'div', 'row', {}, (q) => {
          $(q, 'span', 'key', {}, (q) => {
            q.innerHTML = key;
          });
          $(q, 'span', 'value', {}, (q) => {
            q.innerHTML = value;
          });
        });
      }
    } else if (selected === 'Project Team') {
      $(q, 'h2', 'section-title', {}, (q) => {
        q.innerHTML = 'Project  Team';
      });
      for (const [key, value] of Object.entries(this.ProjectTeam)) {
        $(q, 'div', 'row', {}, (q) => {
          $(q, 'span', 'key', {}, (q) => {
            q.innerHTML = key;
          });
          $(q, 'span', 'value', {}, (q) => {
            q.innerHTML = value;
          });
        });
      }
    }
  }
  createButton = (text: string, q: Quark, selected?: string) => {
    $(q, 'button', 'section-button', {}, (q) => {
      q.innerHTML = text;
      this.buttons.push(q);
      if (selected) {
        q.classList.add('selected');
      }
      q.addEventListener('click', () => {
        this.buttons.forEach((button) => button.classList.remove('selected'));
        q.classList.add('selected');
        console.log(q);
        this.updateRightChild(this.rightChild!, q.innerHTML);
      });
    });
  };
  async render(q: Quark): Promise<void> {
    const waiting = $(q, 'div', 'loading-screen', {}, (q) => {
      $(q, 'div', 'spinner', {}, (q) => {});
    });
    await this.loadProjectData();
    waiting.innerHTML = '';
    waiting.remove();
    // $(waiting, 'div', 'loading-screen', {}, (q) => {
    //   q.innerHTML = '';
    // });
    $(q, 'div', 'project-info validator', {}, (q) => {
      $(q, 'div', 'container', {}, (q) => {
        $(q, 'div', 'header', {}, (q) => {
          this.createButton('Project Information', q, 'selected');
          this.createButton('Project Scope', q);
          this.createButton('Project Team', q);
        });

        this.rightChild = $(q, 'div', 'body', {}, (q) => {});

        this.updateRightChild(this.rightChild!, 'Project Information');
      });
    });
  }
}

export const projectInfoViewHandler = new ViewHandler(
  '/project/{projectId}',
  ProjectInfoView
);

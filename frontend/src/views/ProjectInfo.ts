import { QuarkFunction as $, Quark } from '../ui_lib/quark';
import { View, ViewHandler } from '../ui_lib/view';
import './../styles/projectInfo.scss';
import { Project, ProjectCacheMock } from '../data/project';

class ProjectInfoView implements View {
  params: { type: string };
  projectCache: ProjectCacheMock;
  ProjectInformation: Project | {} = {};

  constructor(params: { type: string }) {
    this.params = params;
    this.projectCache = new ProjectCacheMock();
  }

    async loadProjectData(): Promise<void> {
    try {
      this.ProjectInformation = await this.projectCache.get();
    } catch (error) {
      console.error("Failed to load project data:", error);
    }
  }
  selectedButton: string = "Prohect Information";
  ProjectScope = {"Scope": "This is a scope"};
  ProjectTeam = {"Team": "This is a team"};

  setSelectedButton(button: HTMLElement): void {
    this.selectedButton = button.innerHTML;
  }
  rightChild: HTMLElement | null = null;


  updateRightChild(q: Quark, selected: string):void {
    this.rightChild.innerHTML = "";
    if (selected === "Project Information") {
      console.log(this.ProjectInformation);
      $(q, 'h2', 'section-title', {}, (q) => {
        q.innerHTML = "Project Information";
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
    } else if (selected === "Project Scope") {
         $(q, 'h2', 'section-title', {}, (q) => {
        q.innerHTML = "Project Scope";
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
    } else if (selected === "Project Team") {
         $(q, 'h2', 'section-title', {}, (q) => {
        q.innerHTML = "Project  Team";
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
  buttons: HTMLElement[] = [];
  createButton = (text: string, q: Quark, selected?: string) => {
    $(q, 'button', 'section-button', {}, (q) => {
      q.innerHTML = text;
      this.buttons.push(q);
      if (selected) {
        q.classList.add("selected");
      }
      q.addEventListener('click', () => {
        this.buttons.forEach((button) =>
          button.classList.remove('selected')
        );
        q.classList.add('selected');
        console.log(q);
        this.updateRightChild(this.rightChild!, q.innerHTML);
      });
    });
  };
  async render(q: Quark): Promise<void> {

    await this.loadProjectData();
    $(q, 'div', 'project-info validator', {}, (q) => {
      $(q, 'div', 'container', {}, (q) => {
        $(q, 'div', 'left child', {}, (q) => {
        

            this.createButton('Project Information', q,  "selected");
            this.createButton('Project Scope', q);
            this.createButton('Project Team', q);
      
        });

        this.rightChild = $(q, 'div', 'right child', {}, (q) => {
     
        });

        this.updateRightChild(this.rightChild!, "Project Information");
      });
    });
  }
  
}

export const projectInfoViewHandler = new ViewHandler('/project', ProjectInfoView);

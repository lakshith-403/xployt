import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { ContentItem } from '@components/table/clickable.table';
import { ProjectBrief } from '@data/common/cache/projects.cache';
import { router } from '@ui_lib/router';
import { CustomTable } from '@components/table/customTable';

export class dashHackerProjects {
  private readonly userId: string;
  private projects: ProjectBrief[] = [];
  private tableContent: ContentItem[] = [];
  private tableHeaders = ['ID', 'Title', 'Start Date'];

  constructor(userId: string, projects: ProjectBrief[]) {
    this.userId = userId;
    this.projects = projects;

    this.projects.forEach((project) => {
      this.tableContent.push({
        id: project.id,
        title: project.title,
        startDate: project.startDate,
      });
    });
  }

  private setTableContent(): void {}

  render(q: Quark): void {
    this.setTableContent();
    $(q, 'h2', '', {}, 'Projects');
    new CustomTable({
      content: this.tableContent,
      options: {
        cellClassName: 'cursor-pointer',
        noDataMessage: 'No projects to show',
        callback: (project) => {
          router.navigateTo(`/projects/${project.id.toString()}`);
        },
      },
      className: '',
      headers: this.tableHeaders,
    }).render(q);
  }
}

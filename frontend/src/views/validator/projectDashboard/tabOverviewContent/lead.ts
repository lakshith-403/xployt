import { Quark, QuarkFunction as $ } from '@/ui_lib/quark';
import { ProjectOverviewLead, ProjectOverviewLeadCacheMock } from '@/data/projectLead/cache/projectOverview';
import './lead.scss';
import { CACHE_STORE } from '@/data/cache';
import { ClientCacheMock } from '@/data/projectLead/cache/client.cache';
import { Client } from '@/data/projectLead/cache/client.cache';
import { FormButton } from '@/components/button/form.button';
import { ButtonType } from '@/components/button/base';
import { router } from '@/ui_lib/router';
export default class Lead {
  private projectOverviewLead!: ProjectOverviewLead;
  private projectOverviewCache: ProjectOverviewLeadCacheMock;
  private clientCache!: ClientCacheMock;
  private client!: Client;
  constructor(private projectId: string) {
    console.log('at lead.ts constructor');
    console.log('this.projectId', this.projectId);
    this.projectOverviewCache = CACHE_STORE.getLeadProjectOverview(this.projectId);
  }
  private async loadData(): Promise<void> {
    this.projectOverviewLead = await this.projectOverviewCache.get(true, this.projectId);
    this.clientCache = CACHE_STORE.getClient(this.projectOverviewLead.clientId.toString());
    this.client = await this.clientCache.get();
    console.log('at lead.ts');
    console.log('this.client', this.client);
    console.log('this.projectOverviewLead', this.projectOverviewLead);
    console.log('this.projectId', this.projectId);
    console.log('this.projectOverviewCache', this.projectOverviewCache);
  }
  async render(q: Quark): Promise<void> {
    await this.loadData();
    $(q, 'div', 'overview lead', {}, (q) => {
      $(q, 'div', 'info', {}, (q) => {
        $(q, 'div', 'info-item', {}, (q) => {
          $(q, 'span', 'label', {}, 'Client');
          $(q, 'span', '', {}, this.client.clientName);
        });
        $(q, 'div', 'info-item', {}, (q) => {
          $(q, 'span', 'label', {}, 'Access link');
          $(q, 'span', '', {}, (q) => {
            $(q, 'a', '', {}, this.projectOverviewLead.accessLink);
          });
        });
      });
      // $(q, 'div', 'team', {}, (q) => {
      //   $(q, 'span', '', {}, 'Team');
      // });
      $(q, 'div', '', {}, (q) => {
        $(q, 'div', 'label', {}, 'description');
        $(q, 'p', '', {}, this.projectOverviewLead.description);
      });
      console.log(this.projectOverviewLead.status);
      if (this.projectOverviewLead.status === 'Pending') {
        $(q, 'div', 'label', {}, 'Status');
        $(q, 'span', '', {}, 'Pending');
        $(q, 'div', '', {}, (q) => {
          const verifyButton = new FormButton({
            label: 'Verify Project',
            type: ButtonType.PRIMARY,
            onClick: () => {
              console.log('Verify Project');
              router.navigateTo(`/projects/${this.projectId}/verify`);
            },
          });
          verifyButton.render(q);
        });
      } else if (this.projectOverviewLead.status === 'Unconfigured') {
        $(q, 'div', 'label', {}, 'Status');
        $(q, 'span', '', {}, 'Unconfigured');
        // $(q, 'div', '', {}, (q) => {
        // });
        $(q, 'div', 'label', {}, 'Configure Project');
        $(q, 'div', '', {}, (q) => {
          const configureButton = new FormButton({
            label: 'Configure Project',
            type: ButtonType.PRIMARY,
            onClick: () => {
              console.log('Configure Project');
              router.navigateTo(`/projects/${this.projectId}/configure`);
            },
          });
          configureButton.render(q);
        });
      } else if (this.projectOverviewLead.status === 'Active') {
        $(q, 'div', 'label', {}, 'Status');
        $(q, 'span', '', {}, 'Active');
      } else if (this.projectOverviewLead.status === 'Completed') {
        $(q, 'div', 'label', {}, 'Status');
        $(q, 'span', '', {}, 'Completed');
      } else if (this.projectOverviewLead.status === 'Cancelled') {
        $(q, 'div', 'label', {}, 'Status');
        $(q, 'span', '', {}, 'Cancelled');
      } else {
        $(q, 'div', 'label', {}, 'Status');
        $(q, 'span', '', {}, 'Unknown');
      }
    });
  }
}

import { Quark, QuarkFunction as $ } from '@/ui_lib/quark';
import { ProjectOverviewLead, ProjectOverviewLeadCacheMock } from '@/data/projectLead/cache/projectOverview';
import './lead.scss';
import { CACHE_STORE } from '@/data/cache';
import { ClientCacheMock } from '@/data/projectLead/cache/client.cache';
import { Client } from '@/data/projectLead/cache/client.cache';

export default class Lead {
  private projectOverviewLead!: ProjectOverviewLead;
  private projectOverviewCache: ProjectOverviewLeadCacheMock;
  private clientCache!: ClientCacheMock;
  private client!: Client;
  constructor(private projectId: string) {
    this.projectOverviewCache = CACHE_STORE.getLeadProjectOverview(this.projectId);
  }
  private async loadData(): Promise<void> {
    this.projectOverviewLead = await this.projectOverviewCache.get();
    this.clientCache = CACHE_STORE.getClient(this.projectOverviewLead.clientId.toString());
    this.client = await this.clientCache.get();
  }
  async render(q: Quark): Promise<void> {
    await this.loadData();
    $(q, 'div', 'overview lead', {}, (q) => {
      $(q, 'div', 'info', {}, (q) => {
        $(q, 'div', 'info-item', {}, (q) => {
          $(q, 'span', '', {}, 'Client');
          $(q, 'span', '', {}, this.client.clientName);
        });
        $(q, 'div', 'info-item', {}, (q) => {
          $(q, 'span', '', {}, 'Access link');
          $(q, 'span', '', {}, (q) => {
            $(q, 'a', '', {}, this.projectOverviewLead.accessLink);
          });
        });
      });
      $(q, 'div', 'team', {}, (q) => {
        $(q, 'span', '', {}, 'Team');
      });
    });
  }
}

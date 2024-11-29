import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { PriceCard } from '@components/card/card.base';
import { tableBase } from '@components/table/table.base';
import '../../tabOverview.scss';

export class OverviewPayments {
    private earnings: { title: string; amount: number }[] = [
        {
            title: 'Total Price Pool',
            amount: 50.0,
        },
        {
            title: 'Total Expenditure',
            amount: 20.0,
        },
    ];
    private paymentTemplate: Record<string, any>[] = [
        {
            severity: 'High',
            amount: 50,
            reports: 2,
        },
        {
            severity: 'Medium',
            amount: 35,
            reports: 0,
        },
        {
            severity: 'Low',
            amount: 25,
            reports: 0,
        },
        {
            severity: 'Basic',
            amount: 20,
            reports: 1,
        },
    ];

    constructor(private readonly projectId: string) {
        this.projectId = projectId;
    }

    async render(q: Quark): Promise<void> {
        $(q, 'div', 'section-content', {}, (q) => {
            $(q, 'div', 'summary', {}, (q) => {
                this.earnings.forEach((item) => {
                    new PriceCard({
                        title: item.title,
                        amount: item.amount,
                    }).render(q);
                });
            });
            $(q, 'div', '', {}, (q) => {
                new tableBase(this.paymentTemplate, ['Severity', 'Amount', 'Reports']).render(q);
            });
        });
    }
}

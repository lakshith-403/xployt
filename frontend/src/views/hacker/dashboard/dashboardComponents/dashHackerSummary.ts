import {QuarkFunction as $, Quark} from '@ui_lib/quark';
import {PriceCard} from "@components/card/card.base";

export class dashHackerSummary {
    render(q: Quark): void {
        q.innerHTML='';
        $(q, 'div', 'hacker-dashboard', {}, (q) => {
            $(q, 'div', 'summary', {}, (q) => {
                new PriceCard({
                    title: 'Total Earnings',
                    amount: 580,
                }).render(q);
                new PriceCard({
                    title: 'Pending Earnings',
                    amount: 20,
                }).render(q);
                new PriceCard({
                    title: 'Current Project Earnings',
                    amount: 20,
                }).render(q);
            })
        });
    }
}
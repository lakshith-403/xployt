import {QuarkFunction as $, Quark} from '@ui_lib/quark';
import {Card, PriceCard} from "@components/card/card.base";
import {Button} from "@components/button/base";
import {router} from "@ui_lib/router";

export class dashClientSummary {
    render(q: Quark): void {
        q.innerHTML='';
        $(q, 'div', 'hacker-dashboard', {}, (q) => {
            $(q, 'div', 'summary', {}, (q) => {
                new PriceCard({
                    title: 'Total Expenses',
                    amount: 580,
                }).render(q);
                new PriceCard({
                    title: 'Current Project Earnings',
                    amount: 20,
                }).render(q);
                new Card({
                    title: 'Request a Project',
                    content: $(q, 'div', '', {}, (q) => {
                        new Button({
                            label: "Request a Project",
                            onClick: () => {
                                router.navigateTo('/project-request')
                            }
                        }).render(q);
                    }),
                }).render(q);
            })
        });
    }
}
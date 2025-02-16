import {QuarkFunction as $, Quark} from '@ui_lib/quark';
import {Card, PriceCard} from "@components/card/card.base";
import {Button} from "@components/button/base";
import {router} from "@ui_lib/router";
import {IconButton} from "@components/button/icon.button";

export class dashClientSummary {
    private container: Quark | null = null;
    private totalExp: PriceCard;
    private currentEarnings: PriceCard;
    private requestProjectBtn: IconButton;

    constructor() {
        this.totalExp = new PriceCard({
            title: 'Total Expenses',
            amount: 580,
        });
        this.currentEarnings = new PriceCard({
            title: 'Current Project Earnings',
            amount: 20,
        });
        this.requestProjectBtn = new IconButton({
            icon: 'fa-solid fa-plus fa-xl',
            label: "",
            onClick: () => {
                router.navigateTo('/client/project-request')
            }
        })
    }

    render(q: Quark): void {
        q.innerHTML = '';
        $(q, 'div', 'hacker-dashboard', {}, (q) => {
            $(q, 'div', 'summary', {}, (q) => {
                this.container = q;
                this.totalExp.render(this.container)
                this.currentEarnings.render(this.container)
                new Card({
                    title: 'Request a Project',
                    content: $(q, 'div', 'req-btn', {}, (q) => {
                        this.requestProjectBtn.render(q);
                    }),
                }).render(q);
            })
        });
    }
}
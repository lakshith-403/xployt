import { Quark, QuarkFunction as $ } from '@/ui_lib/quark';
import { View, ViewHandler } from '@/ui_lib/view';
import { CACHE_STORE } from '@/data/cache';
import { UserCache } from '@/data/user';
import { Transaction } from '@/data/finance/cache/finance.cache';
import { Button, ButtonType } from '@/components/button/base';
import { financeEndpoints } from '@/data/finance/network/finance.network';
import { CustomTable } from '@/components/table/customTable';
import { Response } from '@/data/network/network';
import modalManager, { convertToDom } from '@/components/ModalManager/ModalManager';
import LoadingScreen from '@/components/loadingScreen/loadingScreen';
import './payments.scss';

export class PaymentView extends View {
  private userCache: UserCache = CACHE_STORE.getUser();
  private userId: number = 0;
  private balance: number = 0;
  private transactions: Transaction[] = [];
  private transactionTable: CustomTable | null = null;
  private balanceElement: HTMLElement | null = null;
  private transactionTableContainer: HTMLElement | null = null;
  private loadingScreen: LoadingScreen | null = null;

  constructor() {
    super();
    modalManager.includeModal('payment-notification', {
      '.modal-button.button-confirm': () => {
        modalManager.hide('payment-notification');
      },
    });
  }

  public async render(q: Quark): Promise<void> {
    this.loadingScreen = new LoadingScreen(q);
    this.loadingScreen.show();

    try {
      const user = await this.userCache.get();
      this.userId = Number(user.id);

      await this.loadFinanceData();

      q.innerHTML = '';

      $(q, 'div', 'payments-container', {}, (q) => {
        $(q, 'div', 'payments-header', {}, (q) => {
          $(q, 'h1', '', {}, 'Payment Management');

          this.balanceElement = $(q, 'div', 'balance-container', {}, (q) => {
            $(q, 'span', 'balance-label', {}, 'Current Balance:');
            $(q, 'span', 'balance-amount', {}, `$${this.balance.toFixed(2)}`);
          });
        });

        $(q, 'div', 'payment-actions', {}, (q) => {
          this.renderDepositForm(q);
          this.renderWithdrawForm(q);
        });

        $(q, 'div', 'transactions-section', {}, (q) => {
          $(q, 'h2', '', {}, 'Transaction History');
          $(q, 'div', 'transactions-table-container', {}, (q) => {
            this.transactionTableContainer = q;
            this.renderTransactionTable(q);
          });
        });
      });
    } catch (error) {
      console.error('Error rendering payment view:', error);
      q.innerHTML = '';
      $(q, 'div', 'error-container', {}, 'Failed to load payment information. Please try again later.');
    } finally {
      if (this.loadingScreen) {
        this.loadingScreen.hide();
      }
    }
  }

  private async loadFinanceData(): Promise<void> {
    try {
      const financeData = await CACHE_STORE.getFinance(this.userId).get();
      this.balance = financeData.balance.balance;
      this.transactions = financeData.transactions;

      console.log('Current balance:', this.balance);
      console.log('Transactions:', this.transactions);
    } catch (error) {
      console.error('Failed to load finance data:', error);
      this.balance = 0;
      this.transactions = [];
    }
  }

  private showNotification(title: string, message: string, isError: boolean = false): void {
    const modalContent = `
      <div class="modal-body">
        <div class="modal-title">${title}</div>
        <div class="modal-message">${message}</div>
        <div class="modal-buttons">
          <button type="button" class="modal-button button-confirm ${isError ? 'button-tertiary' : 'button-primary'}">OK</button>
        </div>
      </div>
    `;

    modalManager.show('payment-notification', modalContent);
  }

  private renderDepositForm(q: Quark): void {
    $(q, 'div', 'payment-form deposit-form', {}, (q) => {
      $(q, 'h3', '', {}, 'Add Funds');

      const amountInput = $(q, 'input', '', {
        type: 'number',
        min: '0.01',
        step: '0.01',
        placeholder: 'Amount',
      }) as HTMLInputElement;

      const descriptionInput = $(q, 'input', '', {
        type: 'text',
        placeholder: 'Description',
      }) as HTMLInputElement;

      const depositButton = new Button({
        label: 'Deposit',
        onClick: async (e) => {
          e.preventDefault();

          const amount = parseFloat(amountInput.value);
          const description = descriptionInput.value.trim();

          if (isNaN(amount) || amount <= 0) {
            this.showNotification('Validation Error', 'Please enter a valid amount', true);
            return;
          }

          if (!description) {
            this.showNotification('Validation Error', 'Please enter a description', true);
            return;
          }

          try {
            depositButton.disabled = true;
            LoadingScreen.show();

            const response = await financeEndpoints.addFunds(this.userId, amount, description);

            if (response.is_successful) {
              amountInput.value = '';
              descriptionInput.value = '';

              // Invalidate cache and reload data
              CACHE_STORE.getFinance(this.userId).invalidate_cache();
              await this.loadFinanceData();
              this.updateBalanceDisplay();

              this.showNotification('Success', 'Funds added successfully');

              this.renderTransactionTable(this.transactionTableContainer!);
            } else {
              this.showNotification('Error', `Failed to deposit funds: ${response.error || 'Unknown error'}`, true);
            }
          } catch (error) {
            console.error('Error depositing funds:', error);
            this.showNotification('Error', 'Failed to deposit funds. Please try again later.', true);
          } finally {
            depositButton.disabled = false;
            LoadingScreen.hide();
          }
        },
        type: ButtonType.PRIMARY,
      });

      depositButton.render(q);
    });
  }

  private renderWithdrawForm(q: Quark): void {
    $(q, 'div', 'payment-form withdraw-form', {}, (q) => {
      $(q, 'h3', '', {}, 'Withdraw Funds');

      const amountInput = $(q, 'input', '', {
        type: 'number',
        min: '0.01',
        step: '0.01',
        placeholder: 'Amount',
      }) as HTMLInputElement;

      const descriptionInput = $(q, 'input', '', {
        type: 'text',
        placeholder: 'Description',
      }) as HTMLInputElement;

      const withdrawButton = new Button({
        label: 'Withdraw',
        onClick: async (e) => {
          e.preventDefault();

          const amount = parseFloat(amountInput.value);
          const description = descriptionInput.value.trim();

          if (isNaN(amount) || amount <= 0) {
            this.showNotification('Validation Error', 'Please enter a valid amount', true);
            return;
          }

          if (amount > this.balance) {
            this.showNotification('Validation Error', 'Insufficient funds', true);
            return;
          }

          if (!description) {
            this.showNotification('Validation Error', 'Please enter a description', true);
            return;
          }

          try {
            withdrawButton.disabled = true;
            LoadingScreen.show();

            const response = await financeEndpoints.withdrawFunds(this.userId, amount, description);

            if (response.is_successful) {
              amountInput.value = '';
              descriptionInput.value = '';

              // Invalidate cache and reload data
              CACHE_STORE.getFinance(this.userId).invalidate_cache();
              await this.loadFinanceData();
              this.updateBalanceDisplay();

              this.showNotification('Success', 'Funds withdrawn successfully');

              // Re-render the transaction table
              this.renderTransactionTable(this.transactionTableContainer!);
            } else {
              this.showNotification('Error', `Failed to withdraw funds: ${response.error || 'Unknown error'}`, true);
            }
          } catch (error) {
            console.error('Error withdrawing funds:', error);
            this.showNotification('Error', 'Failed to withdraw funds. Please try again later.', true);
          } finally {
            withdrawButton.disabled = false;
            LoadingScreen.hide();
          }
        },
        type: ButtonType.TERTIARY,
      });

      withdrawButton.render(q);
    });
  }

  private renderTransactionTable(q: Quark): void {
    q.innerHTML = '';
    const formattedTransactions = this.transactions.map((transaction) => {
      const date = new Date(transaction.timestamp);
      const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

      return {
        id: transaction.transactionId,
        date: formattedDate,
        type: transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1).toLowerCase(),
        amount: `$${Math.abs(transaction.amount).toFixed(2)}`,
        description: transaction.description,
      };
    });

    this.transactionTable = new CustomTable({
      content: formattedTransactions,
      headers: ['ID', 'Date', 'Type', 'Amount', 'Description'],
      className: 'transactions-table',
      options: {
        noDataMessage: 'No transactions found',
        orderKeys: ['id', 'date', 'type', 'amount', 'description'],
      },
    });

    this.transactionTable.render(q);
  }

  private updateBalanceDisplay(): void {
    if (this.balanceElement) {
      const amountElement = this.balanceElement.querySelector('.balance-amount');
      if (amountElement) {
        amountElement.textContent = `$${this.balance.toFixed(2)}`;
      }
    }
  }
}

export const paymentViewHandler = new ViewHandler('payments', PaymentView);

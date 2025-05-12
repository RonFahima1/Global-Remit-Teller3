/**
 * Mock Receipt Templates
 * Sample data for receipt templates
 */

import { ReceiptTemplate, ReceiptTemplateType } from '@/types/receipt';

/**
 * Mock receipt templates data
 */
export const mockReceiptTemplates: ReceiptTemplate[] = [
  {
    id: '1',
    name: 'Standard Receipt',
    type: ReceiptTemplateType.STANDARD,
    isDefault: true,
    htmlTemplate: `
      <div class="receipt">
        <div class="receipt-header">
          <img src="{{logoUrl}}" alt="{{companyName}}" class="logo" />
          <h1>{{companyName}}</h1>
        </div>
        <div class="receipt-title">
          <h2>Transaction Receipt</h2>
          <p>{{transactionDate}}</p>
        </div>
        <div class="receipt-details">
          <div class="detail-row">
            <span class="label">Transaction ID:</span>
            <span class="value">{{transactionId}}</span>
          </div>
          <div class="detail-row">
            <span class="label">Type:</span>
            <span class="value">{{transactionType}}</span>
          </div>
          <div class="detail-row">
            <span class="label">Status:</span>
            <span class="value status-{{status}}">{{status}}</span>
          </div>
        </div>
        <div class="receipt-section">
          <h3>Sender</h3>
          <div class="detail-row">
            <span class="label">Name:</span>
            <span class="value">{{senderName}}</span>
          </div>
          <div class="detail-row">
            <span class="label">Phone:</span>
            <span class="value">{{senderPhone}}</span>
          </div>
        </div>
        <div class="receipt-section">
          <h3>Receiver</h3>
          <div class="detail-row">
            <span class="label">Name:</span>
            <span class="value">{{receiverName}}</span>
          </div>
          <div class="detail-row">
            <span class="label">Phone:</span>
            <span class="value">{{receiverPhone}}</span>
          </div>
        </div>
        <div class="receipt-section">
          <h3>Amount</h3>
          <div class="detail-row">
            <span class="label">Amount:</span>
            <span class="value">{{amount}} {{sourceCurrency}}</span>
          </div>
          <div class="detail-row">
            <span class="label">Fee:</span>
            <span class="value">{{fee}} {{sourceCurrency}}</span>
          </div>
          <div class="detail-row total">
            <span class="label">Total:</span>
            <span class="value">{{totalAmount}} {{sourceCurrency}}</span>
          </div>
          {{#if exchangeRate}}
          <div class="detail-row">
            <span class="label">Exchange Rate:</span>
            <span class="value">1 {{sourceCurrency}} = {{exchangeRate}} {{destinationCurrency}}</span>
          </div>
          <div class="detail-row">
            <span class="label">Recipient Gets:</span>
            <span class="value">{{receiverAmount}} {{destinationCurrency}}</span>
          </div>
          {{/if}}
        </div>
        <div class="receipt-footer">
          <p>{{footerText}}</p>
          <p class="reference">Reference: {{referenceNumber}}</p>
        </div>
      </div>
    `,
    cssTemplate: `
      .receipt {
        font-family: {{fontFamily}}, Arial, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }
      .receipt-header {
        text-align: center;
        margin-bottom: 20px;
        border-bottom: 2px solid {{primaryColor}};
        padding-bottom: 10px;
      }
      .logo {
        max-width: 150px;
        max-height: 80px;
      }
      .receipt-title {
        text-align: center;
        margin-bottom: 20px;
      }
      .receipt-details, .receipt-section {
        margin-bottom: 20px;
      }
      .detail-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
        padding: 5px 0;
        border-bottom: 1px dotted #eee;
      }
      .label {
        font-weight: bold;
        color: #555;
      }
      .value {
        text-align: right;
      }
      .total {
        font-weight: bold;
        font-size: 1.1em;
        border-top: 1px solid #ddd;
        border-bottom: 2px solid #ddd;
        padding: 10px 0;
        margin-top: 10px;
      }
      .receipt-section h3 {
        color: {{primaryColor}};
        border-bottom: 1px solid {{primaryColor}};
        padding-bottom: 5px;
      }
      .receipt-footer {
        text-align: center;
        margin-top: 30px;
        font-size: 0.9em;
        color: #777;
        border-top: 1px solid #ddd;
        padding-top: 20px;
      }
      .reference {
        font-family: monospace;
        margin-top: 10px;
      }
      .status-completed {
        color: green;
      }
      .status-pending {
        color: orange;
      }
      .status-failed {
        color: red;
      }
    `,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    createdBy: 'system',
    supportedLanguages: ['en', 'es', 'fr', 'ar', 'zh']
  },
  {
    id: '2',
    name: 'Compact Receipt',
    type: ReceiptTemplateType.COMPACT,
    isDefault: true,
    htmlTemplate: `
      <div class="receipt compact">
        <div class="receipt-header">
          <img src="{{logoUrl}}" alt="{{companyName}}" class="logo" />
          <h1>{{companyName}}</h1>
        </div>
        <div class="receipt-content">
          <div class="transaction-id">{{transactionId}}</div>
          <div class="transaction-date">{{transactionDate}}</div>
          <div class="transaction-status status-{{status}}">{{status}}</div>
          
          <div class="parties">
            <div class="sender">
              <span class="label">From:</span>
              <span class="name">{{senderName}}</span>
            </div>
            <div class="arrow">→</div>
            <div class="receiver">
              <span class="label">To:</span>
              <span class="name">{{receiverName}}</span>
            </div>
          </div>
          
          <div class="amount-section">
            <div class="amount">{{amount}} {{sourceCurrency}}</div>
            <div class="fee">Fee: {{fee}} {{sourceCurrency}}</div>
            <div class="total">Total: {{totalAmount}} {{sourceCurrency}}</div>
            {{#if exchangeRate}}
            <div class="exchange">
              <div class="rate">Rate: 1 {{sourceCurrency}} = {{exchangeRate}} {{destinationCurrency}}</div>
              <div class="receiver-amount">Recipient gets: {{receiverAmount}} {{destinationCurrency}}</div>
            </div>
            {{/if}}
          </div>
          
          <div class="reference">Ref: {{referenceNumber}}</div>
        </div>
        <div class="receipt-footer">
          <p>{{footerText}}</p>
        </div>
      </div>
    `,
    cssTemplate: `
      .receipt.compact {
        font-family: {{fontFamily}}, Arial, sans-serif;
        max-width: 400px;
        margin: 0 auto;
        padding: 15px;
        border: 1px solid #ddd;
        box-shadow: 0 0 5px rgba(0,0,0,0.1);
      }
      .receipt-header {
        text-align: center;
        margin-bottom: 15px;
        border-bottom: 1px solid {{primaryColor}};
        padding-bottom: 10px;
      }
      .receipt-header h1 {
        font-size: 1.2em;
        margin: 5px 0;
      }
      .logo {
        max-width: 100px;
        max-height: 50px;
      }
      .receipt-content {
        font-size: 0.9em;
      }
      .transaction-id {
        font-family: monospace;
        text-align: center;
        margin-bottom: 5px;
      }
      .transaction-date {
        text-align: center;
        font-size: 0.8em;
        color: #777;
        margin-bottom: 10px;
      }
      .transaction-status {
        text-align: center;
        font-weight: bold;
        margin-bottom: 15px;
        padding: 3px;
        border-radius: 3px;
      }
      .status-completed {
        color: white;
        background-color: green;
      }
      .status-pending {
        color: white;
        background-color: orange;
      }
      .status-failed {
        color: white;
        background-color: red;
      }
      .parties {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        padding: 10px;
        background-color: #f9f9f9;
        border-radius: 5px;
      }
      .sender, .receiver {
        display: flex;
        flex-direction: column;
      }
      .label {
        font-size: 0.8em;
        color: #777;
      }
      .name {
        font-weight: bold;
      }
      .arrow {
        font-size: 1.5em;
        color: {{primaryColor}};
      }
      .amount-section {
        text-align: center;
        margin-bottom: 15px;
        padding: 10px;
        background-color: #f9f9f9;
        border-radius: 5px;
      }
      .amount {
        font-size: 1.5em;
        font-weight: bold;
        color: {{primaryColor}};
        margin-bottom: 5px;
      }
      .fee, .total {
        font-size: 0.8em;
      }
      .total {
        font-weight: bold;
        margin-top: 5px;
      }
      .exchange {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px dashed #ddd;
        font-size: 0.8em;
      }
      .reference {
        text-align: center;
        font-family: monospace;
        margin-bottom: 15px;
        padding: 5px;
        background-color: #f0f0f0;
        border-radius: 3px;
      }
      .receipt-footer {
        text-align: center;
        font-size: 0.7em;
        color: #777;
        border-top: 1px solid #ddd;
        padding-top: 10px;
      }
    `,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    createdBy: 'system',
    supportedLanguages: ['en', 'es', 'fr', 'ar', 'zh']
  },
  {
    id: '3',
    name: 'Detailed Receipt',
    type: ReceiptTemplateType.DETAILED,
    isDefault: true,
    htmlTemplate: `
      <div class="receipt detailed">
        <!-- Template content for detailed receipt -->
        <!-- This would be more extensive with additional fields -->
      </div>
    `,
    cssTemplate: `
      /* CSS for detailed receipt */
    `,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    createdBy: 'system',
    supportedLanguages: ['en', 'es', 'fr']
  },
  {
    id: '4',
    name: 'Custom Receipt',
    type: ReceiptTemplateType.CUSTOM,
    isDefault: false,
    htmlTemplate: `
      <div class="receipt custom">
        <!-- Template content for custom receipt -->
      </div>
    `,
    cssTemplate: `
      /* CSS for custom receipt */
    `,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    createdBy: 'user-1',
    supportedLanguages: ['en']
  }
];

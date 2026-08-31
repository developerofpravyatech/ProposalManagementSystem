import React from 'react';
import { CreditCard } from 'lucide-react';
import { Card } from '../common/Card';

export function PricingTable({ proposal }) {
  const lineItems = proposal.lineItems || proposal.line_items || [];
  const symbol = proposal.currency_symbol || '$';
  const currency = proposal.currency || 'USD';

  const subtotal = lineItems.reduce((acc, item) => acc + (item.subtotal || 0), 0);
  const totalAmount = proposal.amount || subtotal;

  return (
    <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-display">Commercials & Investment Breakdown</h3>
          <p className="text-xs text-slate-500">Transparent milestone-based pricing structure</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Investment</span>
          <span className="text-2xl font-black font-mono text-brand-700">
            {symbol}{totalAmount.toLocaleString()} {currency}
          </span>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Deliverable & Scope</th>
              <th className="px-4 py-3 text-center">Qty</th>
              <th className="px-4 py-3 text-right">Unit Rate</th>
              <th className="px-4 py-3 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {lineItems.map((item, idx) => (
              <tr key={item.id || idx} className="hover:bg-slate-50/50">
                <td className="px-4 py-3.5 font-mono text-xs text-brand-600 font-bold">
                  {String(idx + 1).padStart(2, '0')}
                </td>
                <td className="px-4 py-3.5">
                  <div className="font-bold text-slate-900 text-sm">{item.title}</div>
                  {item.description && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                  )}
                </td>
                <td className="px-4 py-3.5 text-center font-mono text-xs text-slate-600 font-semibold">
                  {item.quantity}
                </td>
                <td className="px-4 py-3.5 text-right font-mono text-xs text-slate-600 font-semibold">
                  {symbol}{(item.unit_price || 0).toLocaleString()}
                </td>
                <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900 text-sm">
                  {symbol}{(item.subtotal || 0).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Investment Summary Block */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <CreditCard className="w-4 h-4 text-brand-600" />
            Billing & Invoicing Terms
          </div>
          <p className="text-xs text-slate-500 max-w-lg leading-relaxed">
            {proposal.terms || "Standard payment schedule: 50% advance to initiate sprint development, 30% upon staging review, 20% on final production deployment & acceptance."}
          </p>
        </div>

        <div className="text-right shrink-0 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Payable</span>
          <span className="text-2xl font-black font-mono text-slate-900">
            {symbol}{totalAmount.toLocaleString()}
          </span>
          <span className="text-[10px] text-brand-600 ml-1 font-bold">{currency}</span>
        </div>
      </div>
    </Card>
  );
}

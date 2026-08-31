import React from 'react';
import { CreditCard, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Card } from '../common/Card';

export function PricingTable({ proposal }) {
  const lineItems = proposal.lineItems || proposal.line_items || [];
  const symbol = proposal.currency_symbol || '$';
  const currency = proposal.currency || 'USD';

  const subtotal = lineItems.reduce((acc, item) => acc + (item.subtotal || 0), 0);
  const totalAmount = proposal.amount || subtotal;

  return (
    <Card className="space-y-6 border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white font-display">Commercials & Investment Breakdown</h3>
          <p className="text-xs text-slate-400">Transparent milestone-based pricing structure</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 block">Total Investment</span>
          <span className="text-2xl font-extrabold font-mono text-white text-gradient-brand">
            {symbol}{totalAmount.toLocaleString()} {currency}
          </span>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-white/[0.02] text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-white/10">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Deliverable & Scope</th>
              <th className="px-4 py-3 text-center">Qty</th>
              <th className="px-4 py-3 text-right">Unit Rate</th>
              <th className="px-4 py-3 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {lineItems.map((item, idx) => (
              <tr key={item.id || idx} className="hover:bg-white/[0.01]">
                <td className="px-4 py-3.5 font-mono text-xs text-brand-400 font-bold">
                  {String(idx + 1).padStart(2, '0')}
                </td>
                <td className="px-4 py-3.5">
                  <div className="font-bold text-white text-sm">{item.title}</div>
                  {item.description && (
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                  )}
                </td>
                <td className="px-4 py-3.5 text-center font-mono text-xs text-slate-300">
                  {item.quantity}
                </td>
                <td className="px-4 py-3.5 text-right font-mono text-xs text-slate-300">
                  {symbol}{(item.unit_price || 0).toLocaleString()}
                </td>
                <td className="px-4 py-3.5 text-right font-mono font-bold text-white text-sm">
                  {symbol}{(item.subtotal || 0).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Investment Summary Block */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <CreditCard className="w-4 h-4 text-brand-400" />
            Billing & Invoicing Terms
          </div>
          <p className="text-xs text-slate-400 max-w-lg">
            {proposal.terms || "Standard payment schedule: 50% advance to initiate sprint development, 30% upon staging review, 20% on final production deployment & acceptance."}
          </p>
        </div>

        <div className="text-right shrink-0 bg-brand-950/40 px-5 py-3 rounded-xl border border-brand-500/20">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Payable</span>
          <span className="text-2xl font-black font-mono text-white">
            {symbol}{totalAmount.toLocaleString()}
          </span>
          <span className="text-[10px] text-brand-300 ml-1 font-semibold">{currency}</span>
        </div>
      </div>
    </Card>
  );
}

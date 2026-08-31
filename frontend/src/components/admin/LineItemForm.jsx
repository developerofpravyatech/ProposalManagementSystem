import React from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';

export function LineItemForm({
  lineItems = [],
  onChange,
  currency = 'USD',
  onCurrencyChange,
  taxRate = 0,
  onTaxChange,
  discountRate = 0,
  onDiscountChange,
  contractDuration = '12 Months',
  onDurationChange,
  renewalDate,
  onRenewalDateChange,
}) {
  const currencies = [
    { value: 'USD', label: 'USD ($) — US Dollar', symbol: '$' },
    { value: 'INR', label: 'INR (₹) — Indian Rupee', symbol: '₹' },
    { value: 'AED', label: 'AED (د.إ) — UAE Dirham', symbol: 'AED ' },
    { value: 'EUR', label: 'EUR (€) — Euro', symbol: '€' },
    { value: 'GBP', label: 'GBP (£) — British Pound', symbol: '£' },
  ];

  const durations = [
    { value: '3 Months', label: '3 Months (Quarterly)' },
    { value: '6 Months', label: '6 Months (Semi-Annual)' },
    { value: '12 Months', label: '12 Months (1 Year)' },
    { value: '24 Months', label: '24 Months (2 Years)' },
    { value: 'One-Time', label: 'One-Time Project Delivery' },
  ];

  const currentSymbol = currencies.find((c) => c.value === currency)?.symbol || '$';

  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      title: '',
      description: '',
      quantity: 1,
      unit_price: 0,
      subtotal: 0,
    };
    onChange([...lineItems, newItem]);
  };

  const handleRemoveItem = (id) => {
    if (lineItems.length <= 1) return;
    onChange(lineItems.filter((item) => item.id !== id));
  };

  const handleItemChange = (id, field, val) => {
    const updated = lineItems.map((item) => {
      if (item.id === id) {
        const itemVal = { ...item, [field]: val };
        const qty = field === 'quantity' ? Number(val) : item.quantity;
        const price = field === 'unit_price' ? Number(val) : item.unit_price;
        itemVal.subtotal = (qty || 0) * (price || 0);
        return itemVal;
      }
      return item;
    });
    onChange(updated);
  };

  // Calculations
  const rawSubtotal = lineItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  const discountAmount = (rawSubtotal * (Number(discountRate) || 0)) / 100;
  const taxableAmount = rawSubtotal - discountAmount;
  const taxAmount = (taxableAmount * (Number(taxRate) || 0)) / 100;
  const grandTotal = taxableAmount + taxAmount;

  return (
    <div className="space-y-6">
      {/* Top Settings Bar: Currency & Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <Select
          label="Proposal Currency"
          options={currencies}
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value)}
        />
        <Select
          label="Contract Duration"
          options={durations}
          value={contractDuration}
          onChange={(e) => onDurationChange(e.target.value)}
        />
        <Input
          label="Contract Renewal Date"
          type="date"
          icon={Calendar}
          value={renewalDate || ''}
          onChange={(e) => onRenewalDateChange(e.target.value)}
        />
      </div>

      {/* Dynamic Line Items List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Commercial Line Items
          </h4>
          <Button
            type="button"
            size="sm"
            variant="outline"
            icon={Plus}
            onClick={handleAddItem}
          >
            Add Line Item
          </Button>
        </div>

        {lineItems.map((item, index) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 relative group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                Item #{index + 1}
              </span>
              {lineItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6">
                <Input
                  placeholder="Deliverable Title (e.g. Cloud Infrastructure Setup)"
                  value={item.title}
                  onChange={(e) => handleItemChange(item.id, 'title', e.target.value)}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  type="number"
                  min="1"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  type="number"
                  min="0"
                  placeholder={`Rate (${currentSymbol})`}
                  value={item.unit_price}
                  onChange={(e) => handleItemChange(item.id, 'unit_price', e.target.value)}
                  required
                />
              </div>
              <div className="sm:col-span-2 flex items-center justify-end sm:justify-center">
                <div className="text-right sm:text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Subtotal</span>
                  <span className="font-mono font-black text-slate-900 text-sm">
                    {currentSymbol}
                    {(item.subtotal || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <Input
              placeholder="Scope description & key deliverables for this item..."
              value={item.description}
              onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Summary Calculations Footer */}
      <div className="p-5 rounded-2xl bg-brand-50/50 border border-brand-200/80 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Discount Rate (%)"
            type="number"
            min="0"
            max="100"
            value={discountRate}
            onChange={(e) => onDiscountChange(e.target.value)}
          />
          <Input
            label="Tax / GST Rate (%)"
            type="number"
            min="0"
            max="100"
            value={taxRate}
            onChange={(e) => onTaxChange(e.target.value)}
          />
        </div>

        <div className="border-t border-brand-200 pt-3 space-y-1.5 text-xs text-slate-700 font-medium">
          <div className="flex justify-between">
            <span>Raw Subtotal:</span>
            <span className="font-mono text-slate-900 font-bold">{currentSymbol}{rawSubtotal.toLocaleString()}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-rose-600 font-semibold">
              <span>Discount ({discountRate}%):</span>
              <span className="font-mono">-{currentSymbol}{discountAmount.toLocaleString()}</span>
            </div>
          )}
          {taxAmount > 0 && (
            <div className="flex justify-between text-slate-700 font-semibold">
              <span>Tax ({taxRate}%):</span>
              <span className="font-mono">+{currentSymbol}{taxAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-base font-bold text-slate-900 pt-2 border-t border-brand-200">
            <span>Grand Total Investment:</span>
            <span className="font-mono text-2xl text-brand-700 font-black">
              {currentSymbol}{grandTotal.toLocaleString()} {currency}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Copy, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input, Textarea } from '../common/Input';
import { useToast } from '../../context/ToastContext';

export function WhatsAppModal({ isOpen, onClose, proposal }) {
  const { addToast } = useToast();
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (proposal) {
      const cleanPhone = (proposal.phone || '').replace(/[^0-9+]/g, '');
      setPhone(cleanPhone);

      const origin = window.location.origin;
      const clientUrl = `${origin}/p/${proposal.token}`;

      let msg = '';
      if (proposal.proposal_type === 'profile') {
        msg = `Hello ${proposal.client_name},\n\nThank you for connecting with *PRAVYA TECH*. Here is our official Company Profile & Capability Deck for your review:\n\n🔗 ${clientUrl}\n\nPlease feel free to explore our case studies and reach out if you have any questions.\n\nBest regards,\nPRAVYA TECH Team`;
      } else {
        msg = `Hello ${proposal.client_name},\n\nWe have prepared the customized proposal & quotation for *${proposal.project_title}*:\n\n📄 *Proposal #:* ${proposal.proposal_number}\n💰 *Investment:* ${proposal.currency_symbol || '$'}${proposal.amount ? proposal.amount.toLocaleString() : '0'} ${proposal.currency || ''}\n🔗 *Secure Proposal Link:* ${clientUrl}\n\nYou can review the line items, download the full PDF, or sign off directly through the link above.\n\nLooking forward to collaborating!\n\nBest regards,\nPRAVYA TECH Team`;
      }
      setMessage(msg);
    }
  }, [proposal]);

  if (!proposal) return null;

  const handleSendWhatsApp = () => {
    const rawPhone = phone.replace(/[^0-9]/g, '');
    const encodedText = encodeURIComponent(message);
    const url = rawPhone ? `https://wa.me/${rawPhone}?text=${encodedText}` : `https://wa.me/?text=${encodedText}`;
    window.open(url, '_blank');
    addToast('Opening WhatsApp...', 'success');
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    addToast('WhatsApp message template copied!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="1-Click WhatsApp Proposal Sharing"
      subtitle={`Share official proposal with ${proposal.client_name} (${proposal.company_name})`}
    >
      <div className="space-y-4">
        <Input
          label="Client WhatsApp / Phone Number (with country code)"
          placeholder="+919876543210 or +1234567890"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <Textarea
          label="Custom WhatsApp Message Template"
          rows={7}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <Button
            variant="outline"
            type="button"
            icon={copied ? Check : Copy}
            onClick={handleCopyMessage}
            className="w-full sm:w-auto"
          >
            {copied ? 'Copied' : 'Copy Text'}
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="ghost"
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="whatsapp"
              type="button"
              icon={Send}
              onClick={handleSendWhatsApp}
              className="w-full sm:w-auto"
            >
              Launch WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

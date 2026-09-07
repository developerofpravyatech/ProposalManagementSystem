import React from 'react';
import { Download, MessageSquare, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

export function ClientHeader({
  proposal,
  onDownloadPdf,
  onOpenWhatsApp,
  onOpenAcceptModal,
  isDownloading = false
}) {
  const isAccepted = proposal.status === 'accepted';
  const isQuotation = proposal.type === 'quotation_proposal';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 sm:px-8 py-3.5 transition-all shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Verification */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-950 p-[1px] shadow-sm flex items-center justify-center border border-slate-900">
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center font-display font-black text-white text-base">
              P<span className="text-brand-500">T</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-slate-900 tracking-tight text-base">
                PRAVYA TECH
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3 h-3" /> Verified Proposal
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono font-medium">
              {proposal.proposal_no} • Prepared for {proposal.company_name}
            </p>
          </div>
        </div>

        {/* Action Buttons (Desktop & Tablet) */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            icon={Download}
            isLoading={isDownloading}
            onClick={onDownloadPdf}
          >
            Download PDF
          </Button>

          <Button
            size="sm"
            variant="whatsapp"
            icon={MessageSquare}
            onClick={onOpenWhatsApp}
          >
            WhatsApp Support
          </Button>

          {isQuotation && (
            isAccepted ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-sm">
                <CheckCircle className="w-4 h-4" />
                Quotation Accepted
              </div>
            ) : (
              <Button
                size="sm"
                variant="primary"
                icon={Sparkles}
                onClick={onOpenAcceptModal}
              >
                Accept Quotation
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  );
}


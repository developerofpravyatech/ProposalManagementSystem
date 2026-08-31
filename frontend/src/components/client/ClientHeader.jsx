import React from 'react';
import { Download, MessageSquare, CheckCircle, ShieldCheck, Sparkles, FileText } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export function ClientHeader({
  proposal,
  onDownloadPdf,
  onOpenWhatsApp,
  onOpenAcceptModal,
  isDownloading = false
}) {
  const isAccepted = proposal.status === 'accepted';
  const isQuotation = proposal.proposal_type === 'quotation';

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Verification */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 p-[1px] shadow-glow-brand flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center font-display font-extrabold text-white text-base">
              P<span className="text-cyan-400">T</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-white tracking-tight text-sm sm:text-base">
                PRAVYA TECH
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" /> Verified Proposal
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              {proposal.proposal_number} • Prepared for {proposal.company_name}
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
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-glow-emerald">
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

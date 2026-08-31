import React from 'react';
import { Download, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

export function FloatingDock({
  proposal,
  onDownloadPdf,
  onOpenWhatsApp,
  onOpenAcceptModal,
  isDownloading
}) {
  const isAccepted = proposal.status === 'accepted';
  const isQuotation = proposal.proposal_type === 'quotation';

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 p-3 md:hidden bg-white/95 backdrop-blur-2xl border-t border-slate-200 shadow-2xl">
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        <Button
          size="sm"
          variant="outline"
          icon={Download}
          isLoading={isDownloading}
          onClick={onDownloadPdf}
          className="flex-1 text-xs px-2 shadow-sm"
        >
          PDF
        </Button>

        <Button
          size="sm"
          variant="whatsapp"
          icon={MessageSquare}
          onClick={onOpenWhatsApp}
          className="flex-1 text-xs px-2"
        >
          WhatsApp
        </Button>

        {isQuotation && (
          isAccepted ? (
            <div className="flex-1 flex items-center justify-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold py-2 rounded-xl border border-emerald-200 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
            </div>
          ) : (
            <Button
              size="sm"
              variant="primary"
              icon={Sparkles}
              onClick={onOpenAcceptModal}
              className="flex-1 text-xs px-2"
            >
              Accept
            </Button>
          )
        )}
      </div>
    </div>
  );
}

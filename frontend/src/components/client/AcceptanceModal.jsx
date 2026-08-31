import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, ShieldCheck, PenTool, Type, Eraser } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { publicApi } from '../../api/publicApi';
import { useToast } from '../../context/ToastContext';

export function AcceptanceModal({ isOpen, onClose, proposal, onAccepted }) {
  const { addToast } = useToast();
  const [signerName, setSignerName] = useState('');
  const [signerTitle, setSignerTitle] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [signMode, setSignMode] = useState('type'); // 'type' or 'draw'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  if (!proposal) return null;

  // Trigger celebration confetti
  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: 0.2, y: 0.7 } });
      confetti({ ...defaults, particleCount, origin: { x: 0.8, y: 0.7 } });
    }, 250);
  };

  // Drawing canvas logic
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#6366F1';
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleAccept = async (e) => {
    e.preventDefault();
    if (!signerName.trim()) {
      addToast('Please enter your full name', 'error');
      return;
    }
    if (!agreedToTerms) {
      addToast('Please agree to the proposal terms & conditions', 'error');
      return;
    }

    let signatureData = signerName;
    if (signMode === 'draw' && canvasRef.current) {
      signatureData = canvasRef.current.toDataURL();
    }

    setIsSubmitting(true);
    try {
      await publicApi.acceptQuotation(proposal.token, {
        accepted_by: `${signerName} (${signerTitle || 'Authorized Signatory'})`,
        signature_data: signatureData,
        terms_agreed: true
      });

      triggerConfetti();
      addToast('Quotation successfully accepted & signed!', 'success');
      onAccepted?.();
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to accept proposal', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Accept & Sign Proposal"
      subtitle={`Formal acceptance for Proposal #${proposal.proposal_number}`}
    >
      <form onSubmit={handleAccept} className="space-y-4">
        <div className="p-3.5 rounded-xl bg-brand-950/40 border border-brand-500/20 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400">Total Approved Amount:</span>
            <div className="text-base font-bold font-mono text-white mt-0.5">
              {proposal.currency_symbol || '$'}{proposal.amount ? proposal.amount.toLocaleString() : '0'} {proposal.currency || 'USD'}
            </div>
          </div>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Legally Binding Digital Acceptance
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Authorized Signer Full Name"
            placeholder="e.g. Sarah Jenkins"
            value={signerName}
            onChange={(e) => setSignerName(e.target.value)}
            required
          />
          <Input
            label="Designation / Job Title"
            placeholder="e.g. Chief Executive Officer"
            value={signerTitle}
            onChange={(e) => setSignerTitle(e.target.value)}
          />
        </div>

        {/* Signature Pad */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Digital Signature
            </label>
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setSignMode('type')}
                className={`px-2 py-1 text-[11px] rounded-md font-medium transition-all ${
                  signMode === 'type' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Type className="w-3 h-3 inline mr-1" /> Type Name
              </button>
              <button
                type="button"
                onClick={() => setSignMode('draw')}
                className={`px-2 py-1 text-[11px] rounded-md font-medium transition-all ${
                  signMode === 'draw' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <PenTool className="w-3 h-3 inline mr-1" /> Draw
              </button>
            </div>
          </div>

          {signMode === 'type' ? (
            <div className="h-24 rounded-xl bg-slate-900/90 border border-slate-800 p-4 flex items-center justify-center">
              <span className="font-serif italic text-2xl text-brand-300 font-bold tracking-wide">
                {signerName || 'Your Name Signature'}
              </span>
            </div>
          ) : (
            <div className="relative rounded-xl bg-slate-900/90 border border-slate-800 overflow-hidden">
              <canvas
                ref={canvasRef}
                width={500}
                height={120}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-28 cursor-crosshair bg-slate-950"
              />
              <button
                type="button"
                onClick={clearCanvas}
                className="absolute top-2 right-2 text-[10px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg border border-slate-700 flex items-center gap-1"
              >
                <Eraser className="w-3 h-3" /> Clear
              </button>
            </div>
          )}
        </div>

        {/* Terms Checkbox */}
        <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 rounded text-brand-500 focus:ring-brand-500 bg-slate-950 border-slate-700"
          />
          <span className="text-xs text-slate-300 leading-relaxed">
            I hereby confirm authorization on behalf of <strong className="text-white">{proposal.company_name}</strong> to accept this proposal and enter into contract for the scope & payment schedule outlined herein.
          </span>
        </label>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={Sparkles}
            isLoading={isSubmitting}
          >
            Confirm & Sign Acceptance
          </Button>
        </div>
      </form>
    </Modal>
  );
}

import React, { useState, useRef } from 'react';
import { X, ShieldAlert, CheckCircle2, UploadCloud } from 'lucide-react';
import { playClickSound } from '../utils/audio';
import { useGsapModal } from '../utils/gsapAnimations';

interface KycModalProps {
  isVerified: boolean;
  onVerify: () => void;
  onClose: () => void;
}

export const KycModal: React.FC<KycModalProps> = ({
  isVerified,
  onVerify,
  onClose,
}) => {
  const [docType, setDocType] = useState('id_card');
  const [submitted, setSubmitted] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);

  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useGsapModal(backdropRef, panelRef, 'up');

  const handleSubmit = () => {
    playClickSound();
    setSubmitted(true);
    setTimeout(() => {
      onVerify();
      setSubmitted(false);
    }, 1200);
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex flex-col bg-slate-900/60 backdrop-blur-2xl select-none overflow-hidden"
    >
      {/* Full Screen Glass Container */}
      <div
        ref={panelRef}
        className="w-full h-full flex flex-col bg-white/92 backdrop-blur-3xl shadow-2xl overflow-hidden relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base text-slate-900">KYC Verification</span>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-8 max-w-2xl mx-auto w-full space-y-4 overflow-y-auto">
          {isVerified ? (
            <div className="py-8 text-center">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Identity Verified</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Your TradoWix profile is fully verified with unrestricted trading, deposits, and withdrawal privileges.
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Return to Terminal
              </button>
            </div>
          ) : (
            <>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs">
                Complete rapid ID verification to unlock real-money automated withdrawals.
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Document Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'id_card', label: 'National ID' },
                    { id: 'passport', label: 'Passport' },
                    { id: 'license', label: 'Driver License' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      onClick={() => {
                        playClickSound();
                        setDocType(d.id);
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        docType === d.id
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => {
                  playClickSound();
                  setFileSelected(true);
                }}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                  fileSelected
                    ? 'border-emerald-400 bg-emerald-50/40'
                    : 'border-slate-200 hover:border-indigo-400 bg-slate-50/50'
                }`}
              >
                <UploadCloud className={`w-8 h-8 mx-auto mb-2 ${fileSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="text-xs font-bold text-slate-700 block">
                  {fileSelected ? 'Document front_and_back_id.jpg ready for verification' : 'Click to attach document front & back'}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">JPG, PNG or PDF (Max 10MB)</span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitted}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {submitted ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying details...</span>
                  </>
                ) : (
                  <span>Verify Account Now</span>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

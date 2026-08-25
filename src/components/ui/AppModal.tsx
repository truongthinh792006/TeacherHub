import React from 'react';
import { ModalConfig } from '../../types';

interface AppModalProps {
  modalConfig: ModalConfig;
  closeModal: () => void;
}

export function AppModal({ modalConfig, closeModal }: AppModalProps) {
  if (!modalConfig.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
          {modalConfig.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed whitespace-pre-line">
          {modalConfig.message}
        </p>
        <div className="flex gap-3 justify-end">
          {modalConfig.type === 'confirm' && (
            <button
              onClick={closeModal}
              className="px-5 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 min-h-[44px]"
            >
              Hủy
            </button>
          )}
          <button
            onClick={() => {
              if (modalConfig.onConfirm) modalConfig.onConfirm();
              closeModal();
            }}
            className={`px-5 py-2.5 rounded-xl font-medium min-h-[44px] text-white ${
              modalConfig.type === 'confirm'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {modalConfig.type === 'confirm' ? 'Xác nhận' : 'Đóng'}
          </button>
        </div>
      </div>
    </div>
  );
}

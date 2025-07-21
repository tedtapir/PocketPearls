import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface Modal {
  title: string;
  body: string;
}

export const ModalSystem: React.FC = () => {
  const [modal, setModal] = useState<Modal | null>(null);

  useEffect(() => {
    const handleShowModal = (event: CustomEvent) => {
      const { title, body } = event.detail;
      setModal({ title, body });
    };

    window.addEventListener('showModal', handleShowModal as EventListener);
    return () => window.removeEventListener('showModal', handleShowModal as EventListener);
  }, []);

  if (!modal) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#1A1A28] to-[#101018] rounded-3xl p-8 max-w-md w-full border-2 border-[#33FFCA]/30">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{modal.title}</h2>
          <button
            onClick={() => setModal(null)}
            className="text-gray-400 hover:text-[#33FFCA] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="text-center mb-6">
          <p className="text-[#33FFCA] text-lg">{modal.body}</p>
        </div>
        
        <button
          onClick={() => setModal(null)}
          className="w-full bg-gradient-to-r from-[#33FFCA] to-[#2DDDB3] text-black font-bold py-3 rounded-2xl transition-all duration-200 transform hover:scale-105"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
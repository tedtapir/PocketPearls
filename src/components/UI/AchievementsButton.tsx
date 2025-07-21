import React, { useState } from 'react';
import { Trophy, X } from 'lucide-react';
import { usePearl } from '../../state/pearlStore';

export const AchievementsButton: React.FC = () => {
  const { achievements } = usePearl();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-3 rounded-full shadow-lg hover:scale-105 transition-transform"
      >
        <Trophy className="w-6 h-6" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#1A1A28] to-[#101018] rounded-3xl p-8 max-w-md w-full border-2 border-[#33FFCA]/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Achievements</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-[#33FFCA] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-3">
              {achievements.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No achievements yet. Keep caring for Pearl!
                </p>
              ) : (
                achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Trophy className="w-6 h-6 text-yellow-400" />
                      <span className="text-white font-semibold">{achievement}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-6 bg-gradient-to-r from-[#33FFCA] to-[#2DDDB3] text-black font-bold py-3 rounded-2xl transition-all duration-200 transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
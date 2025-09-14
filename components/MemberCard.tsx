import React, { useState } from 'react';
import type { Member } from '../types';

interface MemberCardProps {
  member: Member;
  onUpdateAmount: (memberId: number, amount: number) => void;
  onUpdateStudentId: (memberId: number, studentId: string) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, onUpdateAmount, onUpdateStudentId }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [studentId, setStudentId] = useState<string>(member.studentId || '');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(inputValue);

    if (isNaN(amount) || amount <= 0) {
      setError('请输入一个有效的正数金额。');
      return;
    }
    
    setError(null);
    onUpdateAmount(member.id, amount);
    setInputValue('');
  };

  const handleStudentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentId(e.target.value);
  };

  const handleStudentIdBlur = () => {
    onUpdateStudentId(member.id, studentId);
  };

  return (
    <div className="relative bg-gray-800 rounded-xl shadow-lg hover:shadow-cyan-500/20 border border-gray-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      <input
        type="text"
        value={studentId}
        onChange={handleStudentIdChange}
        onBlur={handleStudentIdBlur}
        placeholder="输入学号"
        aria-label={`Student ID for ${member.name}`}
        className="absolute top-4 right-4 w-28 px-2 py-1 text-xs bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
      />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4 pt-8">
          <h3 className="text-2xl font-bold text-cyan-400">{member.name}</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-1">累计报销总额</p>
          <p className="text-4xl font-mono font-extrabold text-white">
            ¥{member.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor={`amount-${member.id}`} className="sr-only">
              Amount to add for {member.name}
            </label>
            <input
              id={`amount-${member.id}`}
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="输入报销金额"
              step="0.01"
              min="0.01"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-600 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
            disabled={!inputValue}
          >
            确认添加
          </button>
        </form>
      </div>
    </div>
  );
};

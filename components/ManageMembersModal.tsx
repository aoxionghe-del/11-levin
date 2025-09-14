import React, { useState } from 'react';
import type { Member } from '../types';

interface ManageMembersModalProps {
  members: Member[];
  onAdd: (name: string, studentId: string) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}

export const ManageMembersModal: React.FC<ManageMembersModalProps> = ({ members, onAdd, onDelete, onClose }) => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !studentId.trim()) {
      setError('姓名和学号不能为空。');
      return;
    }
    setError('');
    onAdd(name.trim(), studentId.trim());
    setName('');
    setStudentId('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-cyan-300">管理成员</h2>
            <button onClick={onClose} className="text-gray-400 text-3xl leading-none hover:text-white" aria-label="Close modal">&times;</button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-3">添加新成员</h3>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="姓名"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="学号 (必填)"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full bg-cyan-600 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-colors"
              >
                添加成员
              </button>
            </form>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-3">当前成员列表</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {members.map(member => (
                <div key={member.id} className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
                  <div>
                    <p className="font-semibold text-white">{member.name}</p>
                    <p className="text-sm text-gray-400">{member.studentId}</p>
                  </div>
                  <button
                    onClick={() => onDelete(member.id)}
                    className="text-red-400 hover:text-red-300 font-semibold"
                    aria-label={`Delete ${member.name}`}
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

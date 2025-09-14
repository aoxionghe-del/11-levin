import React, { useState, useCallback, useMemo } from 'react';
import type { Member, ReimbursementRecord } from './types';
import { INITIAL_MEMBERS } from './constants';
import { MemberCard } from './components/MemberCard';
import { ManageMembersModal } from './components/ManageMembersModal';

// Component for the reimbursement tracker screen
const ReimbursementTracker: React.FC<{
  initialMembers: Member[];
  onFinish: (total: number) => void;
  onBack: () => void;
  onUpdateStudentId: (memberId: number, studentId: string) => void;
}> = ({ initialMembers, onFinish, onBack, onUpdateStudentId: onUpdateGlobalStudentId }) => {
  const [members, setMembers] = useState<Member[]>(() => JSON.parse(JSON.stringify(initialMembers)));

  const handleUpdateAmount = useCallback((memberId: number, amountToAdd: number) => {
    setMembers(currentMembers =>
      currentMembers.map(member =>
        member.id === memberId
          ? { ...member, totalAmount: member.totalAmount + amountToAdd }
          : member
      )
    );
  }, []);

  const handleUpdateStudentId = useCallback((memberId: number, studentId: string) => {
    // Update local state for the current session's view
    setMembers(currentMembers =>
      currentMembers.map(member =>
        member.id === memberId ? { ...member, studentId } : member
      )
    );
    // Update global state for persistence across sessions
    onUpdateGlobalStudentId(memberId, studentId);
  }, [onUpdateGlobalStudentId]);

  const totalReimbursement = useMemo(() => members.reduce((sum, member) => sum + member.totalAmount, 0), [members]);
  
  const handleFinishClick = () => {
    if (totalReimbursement > 0) {
      onFinish(totalReimbursement);
    } else {
      onBack();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
          Team Reimbursement Tracker
        </h1>
        <p className="text-gray-400 mt-2">小组报销金额记录器</p>
      </header>

      <div className="mb-10 p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700">
          <h2 className="text-2xl font-bold text-cyan-300 mb-2">Total Group Reimbursement</h2>
          <p className="text-5xl font-mono font-extrabold text-white">
              ¥{totalReimbursement.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map(member => (
          <MemberCard
            key={member.id}
            member={member}
            onUpdateAmount={handleUpdateAmount}
            onUpdateStudentId={handleUpdateStudentId}
          />
        ))}
      </div>

      <div className="mt-12 flex justify-center gap-4">
        <button
          onClick={onBack}
          className="bg-gray-600 text-white font-bold py-3 px-8 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 transition-colors duration-200"
        >
          返回
        </button>
        <button
          onClick={handleFinishClick}
          className="bg-green-600 text-white font-bold py-3 px-8 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-colors duration-200"
        >
          完成并保存记录
        </button>
      </div>
    </div>
  );
};


// Component for the Home screen
const Home: React.FC<{ 
  onStart: (selectedMembers: Member[]) => void; 
  history: ReimbursementRecord[];
  allMembers: Member[];
  onManageMembers: () => void;
}> = ({ onStart, history, allMembers, onManageMembers }) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [copiedMemberId, setCopiedMemberId] = useState<number | null>(null);

  const toggleMemberSelection = (memberId: number) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(memberId)) {
        newSet.delete(memberId);
      } else {
        newSet.add(memberId);
      }
      return newSet;
    });
  };

  const handleStart = () => {
    if (selectedIds.size > 0) {
      const selectedMembers = allMembers.filter(m => selectedIds.has(m.id)).map(m => ({...m, totalAmount: 0}));
      onStart(selectedMembers);
    }
  };
  
  const handleCopy = (e: React.MouseEvent, studentId: string, memberId: number) => {
    e.stopPropagation();
    navigator.clipboard.writeText(studentId);
    setCopiedMemberId(memberId);
    setTimeout(() => {
        setCopiedMemberId(null);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
          Reimbursement Home
        </h1>
        <p className="text-gray-400 mt-2">报销主页</p>
      </header>
      
      <div className="mb-8 p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700">
        <h2 className="text-2xl font-bold text-cyan-300 mb-4">第一步: 选择参与报销的成员</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {allMembers.map(member => {
            const isSelected = selectedIds.has(member.id);
            return (
              <button
                key={member.id}
                onClick={() => toggleMemberSelection(member.id)}
                className={`p-4 rounded-lg text-center transition-all duration-200 border-2 flex flex-col justify-center items-center h-28 ${
                  isSelected 
                    ? 'bg-cyan-600 border-cyan-400 shadow-lg shadow-cyan-500/30' 
                    : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                }`}
              >
                <span className="font-bold text-white text-lg mb-1">{member.name}</span>
                {member.studentId && (
                  <div className="flex items-center justify-center text-xs text-gray-300">
                    <span className="font-mono">{member.studentId}</span>
                    <span 
                      className="ml-2 p-1 rounded-full cursor-pointer hover:bg-gray-500/50"
                      onClick={(e) => handleCopy(e, member.studentId!, member.id)}
                      aria-label={`Copy student ID for ${member.name}`}
                    >
                      {copiedMemberId === member.id ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </span>
                  </div>
                )}
              </button>
            )
          })}
        </div>
        <div className="text-center mt-6">
          <button onClick={onManageMembers} className="text-cyan-400 hover:text-cyan-300 underline">
            管理成员名单
          </button>
        </div>
      </div>
      
      <div className="text-center mb-12">
        <button 
          onClick={handleStart}
          disabled={selectedIds.size === 0}
          className="bg-cyan-600 text-white font-bold py-4 px-10 text-xl rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-cyan-500/20 disabled:bg-gray-600 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
        >
          开启报销流程 ({selectedIds.size} 人已选)
        </button>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-cyan-300 mb-6 text-center">报销历史记录</h2>
        {history.length === 0 ? (
          <p className="text-center text-gray-500">暂无历史记录。</p>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto">
            {history.map(record => (
              <div key={record.id} className="bg-gray-800/70 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
                <p className="text-gray-300">{record.date}</p>
                <p className="text-2xl font-mono font-bold text-white">
                  ¥{record.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Main App component to act as a router
const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'tracker'>('home');
  const [history, setHistory] = useState<ReimbursementRecord[]>([]);
  const [allMembers, setAllMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [membersForTracker, setMembersForTracker] = useState<Member[]>([]);
  const [isManagingMembers, setIsManagingMembers] = useState(false);

  const handleStart = (selectedMembers: Member[]) => {
    setMembersForTracker(selectedMembers);
    setView('tracker');
  };

  const handleFinish = (totalAmount: number) => {
    const newRecord: ReimbursementRecord = {
      id: new Date().toISOString(),
      date: new Date().toLocaleString('zh-CN', { dateStyle: 'short', timeStyle: 'short'}),
      totalAmount,
    };
    setHistory(prev => [newRecord, ...prev]);
    setView('home');
  };

  const handleBack = () => {
    setView('home');
  };

  const handleAddMember = (name: string, studentId: string) => {
    setAllMembers(prev => {
      const newMember: Member = {
        id: Date.now(), // simple unique id
        name,
        studentId,
        totalAmount: 0,
      };
      return [...prev, newMember];
    });
  };

  const handleDeleteMember = (id: number) => {
    setAllMembers(prev => prev.filter(member => member.id !== id));
  };

  const handleUpdateMemberStudentId = (memberId: number, studentId: string) => {
    setAllMembers(prevMembers => 
      prevMembers.map(member => 
        member.id === memberId ? { ...member, studentId } : member
      )
    );
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {view === 'home' ? (
        <Home 
          onStart={handleStart} 
          history={history} 
          allMembers={allMembers} 
          onManageMembers={() => setIsManagingMembers(true)}
        />
      ) : (
        <ReimbursementTracker 
          initialMembers={membersForTracker} 
          onFinish={handleFinish} 
          onBack={handleBack} 
          onUpdateStudentId={handleUpdateMemberStudentId}
        />
      )}
      {isManagingMembers && (
        <ManageMembersModal
          members={allMembers}
          onAdd={handleAddMember}
          onDelete={handleDeleteMember}
          onClose={() => setIsManagingMembers(false)}
        />
      )}
    </div>
  );
};

export default App;
'use client';

import { useEffect, useState } from 'react';
import { Home, Plus, Settings, Archive, Search, Tag, Users, Calendar, Pencil, Trash2, Folder, MessageSquare } from 'lucide-react';
import { useProfileStore } from '@/store/profileStore';

interface Profile {
  id: string;
  name: string;
  members: any[];
  boards: any[];
  tags: string[];
}

export function ProfileDashboard() {
  const {
    profiles,
    currentProfileId,
    setCurrentProfile,
    createProfile,
    renameProfile,
    deleteProfile,
    addMember,
    addBoard,
    addPost,
  } = useProfileStore();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'members' | 'boards' | 'tags' | 'search'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newProfileName, setNewProfileName] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newBoardName, setNewBoardName] = useState('');
  const [newPostText, setNewPostText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const currentProfile = profiles.find(p => p.id === currentProfileId);

  const handleAddProfile = () => {
    if (!newProfileName.trim()) return;
    createProfile(newProfileName);
    setNewProfileName('');
  };

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    if (!currentProfile) return;
    addMember(currentProfile.id, { name: newMemberName, pronouns: '', avatar: '🧠', color: '#64748b', description: '' });
    setNewMemberName('');
  };

  const handleAddBoard = () => {
    if (!newBoardName.trim()) return;
    if (!currentProfile) return;
    addBoard(currentProfile.id, newBoardName);
    setNewBoardName('');
  };

  const handleAddPost = () => {
    if (!newPostText.trim()) return;
    if (!currentProfile) return;
    addPost(currentProfile.id, 'general', newPostText);
    setNewPostText('');
  };

  const filteredBoards = currentProfile?.boards.filter(board => 
    board.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (!currentProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-4xl font-semibold mb-4">Patchwork</h1>
          <p className="text-slate-500 mb-8">A place for complicated minds.</p>
          
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
            <h2 className="font-medium mb-4">Create your first world</h2>
            <input
              type="text"
              value={newProfileName}
              onChange={e => setNewProfileName(e.target.value)}
              placeholder="My World"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-blue-500"
              onKeyDown={e => e.key === 'Enter' && handleAddProfile()}
            />
            <button
              onClick={handleAddProfile}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium"
            >
              Create World
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <div className={`bg-white border-r border-slate-200 flex flex-col transition-all ${sidebarOpen ? 'w-72' : 'w-16'}`}>
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-3">
            {sidebarOpen && <h1 className="text-2xl font-semibold text-blue-600">Patchwork</h1>}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-slate-600">
            {sidebarOpen ? '⟨' : '⟩'}
          </button>
        </div>

        <nav className="flex-1 overflow-auto py-4">
          <div className="px-4 mb-2">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-1">
              <Home className="w-4 h-4" />
              {sidebarOpen && <span>DASHBOARD</span>}
            </div>
          </div>

          <div className="px-3">
            {profiles.map(profile => (
              <button
                key={profile.id}
                onClick={() => setCurrentProfile(profile.id)}
                className={`w-full text-left px-4 py-3 rounded-2xl mb-1 text-sm flex items-center gap-3 transition-colors ${profile.id === currentProfileId ? 'bg-slate-100 text-blue-600' : 'hover:bg-slate-50'}`}
              >
                <Folder className="w-4 h-4" />
                {sidebarOpen && <span>{profile.name}</span>}
              </button>
            ))}
          </div>

          <div className="px-4 mt-8 mb-2">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-1">
              <Users className="w-4 h-4" />
              {sidebarOpen && <span>MEMBERS</span>}
            </div>
            <div className="space-y-1">
              {currentProfile.members.map(member => (
                <div key={member.id} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: member.color + '20', color: member.color }}>
                    {member.avatar}
                  </div>
                  {sidebarOpen && <span>{member.name}</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 mt-8 mb-2">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-1">
              <Folder className="w-4 h-4" />
              {sidebarOpen && <span>BOARDS</span>}
            </div>
            <div className="space-y-1">
              {currentProfile.boards.map(board => (
                <button
                  key={board.id}
                  className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 text-slate-600 hover:bg-slate-50 rounded-xl"
                >
                  <MessageSquare className="w-4 h-4" />
                  {sidebarOpen && <span>{board.name}</span>}
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleAddProfile}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-2xl"
          >
            <Plus className="w-4 h-4" />
            {sidebarOpen && <span>New World</span>}
          </button>
          <button
            onClick={() => { /* archive flow */ }}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-2xl mt-2"
          >
            <Archive className="w-4 h-4" />
            {sidebarOpen && <span>Archive</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-14 border-b bg-white flex items-center px-6 justify-between flex-shrink-0">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-5 py-1.5 rounded-3xl text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`px-5 py-1.5 rounded-3xl text-sm font-medium transition-colors ${activeTab === 'members' ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                Members
              </button>
              <button
                onClick={() => setActiveTab('boards')}
                className={`px-5 py-1.5 rounded-3xl text-sm font-medium transition-colors ${activeTab === 'boards' ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                Boards
              </button>
              <button
                onClick={() => setActiveTab('tags')}
                className={`px-5 py-1.5 rounded-3xl text-sm font-medium transition-colors ${activeTab === 'tags' ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                Tags
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`px-5 py-1.5 rounded-3xl text-sm font-medium transition-colors ${activeTab === 'search' ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-100 rounded-3xl px-3 py-1 text-sm">
              <span className="font-medium">@{currentProfile.name.toLowerCase().replace(/\s+/g, '')}</span>
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-2xl">
              <Settings className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-3xl font-semibold mb-8">Dashboard — {currentProfile.name}</h2>
              
              <div className="dashboard-grid">
                {/* Pinned / Quick Actions */}
                <div className="widget p-6">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button onClick={handleAddMember} className="w-full text-left px-5 py-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-sm flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      Add New Member
                    </button>
                    <button onClick={handleAddBoard} className="w-full text-left px-5 py-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-sm flex items-center gap-3">
                      <Folder className="w-5 h-5 text-blue-600" />
                      New Board
                    </button>
                  </div>
                </div>

                {/* Recent Boards */}
                <div className="widget p-6">
                  <h3 className="font-medium mb-4">Recent Boards</h3>
                  <div className="space-y-2">
                    {filteredBoards.slice(0, 4).map(board => (
                      <div key={board.id} className="px-4 py-3 hover:bg-slate-50 rounded-2xl text-sm flex items-center gap-3">
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        {board.name}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Post */}
                <div className="widget p-6">
                  <h3 className="font-medium mb-4">Quick Note</h3>
                  <textarea
                    value={newPostText}
                    onChange={e => setNewPostText(e.target.value)}
                    placeholder="Write something..."
                    className="w-full h-32 border border-slate-200 rounded-3xl p-4 text-sm focus:outline-none focus:border-blue-500 resize-none"
                  />
                  <button
                    onClick={handleAddPost}
                    className="mt-4 w-full bg-blue-600 text-white py-3 rounded-2xl text-sm font-medium"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-semibold">Members</h2>
                <button onClick={handleAddMember} className="bg-blue-600 text-white px-6 py-2 rounded-3xl text-sm font-medium flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Member
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProfile.members.map(member => (
                  <div key={member.id} className="bg-white rounded-3xl p-6 border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                        style={{ backgroundColor: member.color + '20', color: member.color }}
                      >
                        {member.avatar}
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-slate-500">{member.pronouns}</div>
                      </div>
                    </div>
                    {member.description && <p className="mt-4 text-sm text-slate-600">{member.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'boards' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-semibold">Boards</h2>
                <button onClick={handleAddBoard} className="bg-blue-600 text-white px-6 py-2 rounded-3xl text-sm font-medium flex items-center gap-2">
                  <Plus className="w-4 h-4" /> New Board
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBoards.map(board => (
                  <div key={board.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100">
                    <div className="board-header">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{board.name}</span>
                    </div>
                    <div className="board-content">
                      <p className="text-xs text-slate-400">{board.posts.length} posts</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tags' && (
            <div>
              <h2 className="text-3xl font-semibold mb-8">Tags</h2>
              <div className="flex flex-wrap gap-3">
                {currentProfile.tags.map(tag => (
                  <div key={tag} className="bg-slate-100 hover:bg-blue-100 px-5 py-2 rounded-3xl text-sm cursor-pointer">
                    #{tag}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'search' && (
            <div>
              <h2 className="text-3xl font-semibold mb-8">Search</h2>
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search posts, members, boards..."
                    className="w-full bg-white border border-slate-200 rounded-3xl px-6 py-4 pl-14 text-sm focus:outline-none"
                  />
                  <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

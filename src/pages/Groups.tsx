
import { useState } from 'react';
import Header from '../components/Header';
import GroupSidebar from '../components/GroupSidebar';
import GroupContent from '../components/GroupContent';
import { PlusCircle } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  memberCount: number;
  isOwned: boolean;
}

const Groups = () => {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const handleGroupSelect = (group: Group) => {
    setSelectedGroup(group);
  };
  
  const handleCreateGroup = () => {
    setShowCreateModal(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex flex-col">
        <div className="container px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Groups</h1>
          <p className="text-muted-foreground">
            Create and join study groups to collaborate with others.
          </p>
        </div>
        
        <div className="flex-1 flex flex-col md:flex-row">
          <GroupSidebar 
            onGroupSelect={handleGroupSelect} 
            onCreateGroup={handleCreateGroup}
            selectedGroup={selectedGroup}
          />
          
          {selectedGroup ? (
            <GroupContent group={selectedGroup} />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-muted/20">
              <div className="text-center max-w-md p-8">
                <div className="w-16 h-16 bg-quiz-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlusCircle className="h-8 w-8 text-quiz-darkBlue" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Select or Create a Group</h2>
                <p className="text-muted-foreground mb-6">
                  Choose a group from the sidebar or create a new one to get started.
                </p>
                <button 
                  className="btn-primary mx-auto"
                  onClick={handleCreateGroup}
                >
                  Create New Group
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 animate-scale-in">
            <h2 className="text-xl font-semibold mb-4">Create New Group</h2>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="groupName" className="block text-sm font-medium mb-1">
                  Group Name
                </label>
                <input
                  id="groupName"
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter group name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="groupDescription" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  id="groupDescription"
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter group description"
                ></textarea>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 border border-border rounded-md"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;

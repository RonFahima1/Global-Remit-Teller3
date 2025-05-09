'use client';

import { useState } from 'react';
import TransactionTable from '@/components/transactions/TransactionTable';
import { useCurrentUser } from '@/context/CurrentUserContext';
import { canApproveKYC, canEditComplianceFlags } from '@/utils/permissions';

const mockClient = {
  id: 'CL1001',
  name: 'Jane Smith',
  email: 'jane.smith@email.com',
  phone: '+1 555-1234',
  status: 'active',
  kycStatus: 'approved',
  complianceFlags: [],
  limits: { daily: 5000, monthly: 20000, usedToday: 1200, usedThisMonth: 8000 },
  notes: ['VIP client', 'Prefers email contact'],
};

const mockTransactions = [
  { id: 'TXN1001', date: '2024-03-15T10:30:00', type: 'remittance', amount: 500, currency: 'USD', status: 'completed', client: 'Jane Smith', description: 'Send to Alex Morgan' },
  { id: 'TXN1002', date: '2024-03-14T15:45:00', type: 'remittance', amount: 200, currency: 'EUR', status: 'pending', client: 'Jane Smith', description: 'Receive from Sarah Chen' },
];

const mockDocuments = [
  { id: 1, name: 'passport.pdf', status: 'approved', url: '#' },
  { id: 2, name: 'utility_bill.jpg', status: 'pending', url: '#' },
];

const mockKycDocs = [
  { id: 1, name: 'passport.pdf', status: 'pending', url: '#' },
  { id: 2, name: 'utility_bill.jpg', status: 'approved', url: '#' },
];

const mockKycAuditTrail = [
  { id: 1, date: '2024-03-15 11:00', user: 'compliance1', action: 'Approved passport.pdf', comment: 'All details match.' },
  { id: 2, date: '2024-03-15 10:50', user: 'compliance1', action: 'Rejected utility_bill.jpg', comment: 'Address does not match client.' },
];

const flagColors = [
  { label: 'Red', value: 'red-600' },
  { label: 'Yellow', value: 'yellow-500' },
  { label: 'Blue', value: 'blue-600' },
  { label: 'Gray', value: 'gray-500' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="bg-white rounded-lg border p-4">{children}</div>
    </div>
  );
}

function TransactionDetailsModal({ txn, onClose }: { txn: any; onClose: () => void }) {
  if (!txn) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] max-w-[90vw]">
        <h2 className="text-xl font-bold mb-2">Transaction Details</h2>
        <pre className="text-xs bg-gray-100 rounded p-2 mb-4 overflow-x-auto">{JSON.stringify(txn, null, 2)}</pre>
        <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default function ClientProfilePage() {
  const user = useCurrentUser();
  const [activeTab, setActiveTab] = useState('transactions');
  const [selectedTxn, setSelectedTxn] = useState<any | null>(null);
  const [documents, setDocuments] = useState(mockDocuments);
  const [uploading, setUploading] = useState(false);
  const [notes, setNotes] = useState<{ id: number; text: string; created: string }[]>([
    { id: 1, text: 'VIP client', created: '2024-03-15 10:00' },
    { id: 2, text: 'Prefers email contact', created: '2024-03-15 10:05' },
  ]);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [kycDocs, setKycDocs] = useState(mockKycDocs);
  const [reviewComment, setReviewComment] = useState('');
  const [kycAuditTrail] = useState(mockKycAuditTrail);
  const [flags, setFlags] = useState([
    { id: 1, label: 'High Risk', color: 'red-600', comment: 'Large volume, unusual activity' },
  ]);
  const [newFlagLabel, setNewFlagLabel] = useState('');
  const [newFlagColor, setNewFlagColor] = useState(flagColors[0].value);
  const [newFlagComment, setNewFlagComment] = useState('');
  const [editingFlagId, setEditingFlagId] = useState<number | null>(null);
  const [editingFlagLabel, setEditingFlagLabel] = useState('');
  const [editingFlagColor, setEditingFlagColor] = useState(flagColors[0].value);
  const [editingFlagComment, setEditingFlagComment] = useState('');

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setTimeout(() => {
      setDocuments(docs => [
        ...docs,
        { id: Date.now(), name: file.name, status: 'pending', url: '#' }
      ]);
      setUploading(false);
    }, 1000);
  }

  function handleDeleteDoc(id: number) {
    setDocuments(docs => docs.filter(doc => doc.id !== id));
  }

  function handleAddNote() {
    if (!newNote.trim()) return;
    setNotes(n => [
      { id: Date.now(), text: newNote, created: new Date().toLocaleString() },
      ...n,
    ]);
    setNewNote('');
  }

  function handleDeleteNote(id: number) {
    setNotes(n => n.filter(note => note.id !== id));
  }

  function handleEditNote(id: number, text: string) {
    setEditingNoteId(id);
    setEditingText(text);
  }

  function handleSaveEditNote(id: number) {
    setNotes(n => n.map(note => note.id === id ? { ...note, text: editingText } : note));
    setEditingNoteId(null);
    setEditingText('');
  }

  function handleKycApprove(id: number) {
    setKycDocs(docs => docs.map(doc => doc.id === id ? { ...doc, status: 'approved' } : doc));
  }

  function handleKycReject(id: number) {
    setKycDocs(docs => docs.map(doc => doc.id === id ? { ...doc, status: 'rejected' } : doc));
  }

  function handleAddFlag() {
    if (!newFlagLabel.trim()) return;
    setFlags(f => [
      { id: Date.now(), label: newFlagLabel, color: newFlagColor, comment: newFlagComment },
      ...f,
    ]);
    setNewFlagLabel('');
    setNewFlagColor(flagColors[0].value);
    setNewFlagComment('');
  }

  function handleDeleteFlag(id: number) {
    setFlags(f => f.filter(flag => flag.id !== id));
  }

  function handleEditFlag(flag: any) {
    setEditingFlagId(flag.id);
    setEditingFlagLabel(flag.label);
    setEditingFlagColor(flag.color);
    setEditingFlagComment(flag.comment);
  }

  function handleSaveEditFlag(id: number) {
    setFlags(f => f.map(flag => flag.id === id ? { ...flag, label: editingFlagLabel, color: editingFlagColor, comment: editingFlagComment } : flag));
    setEditingFlagId(null);
    setEditingFlagLabel('');
    setEditingFlagColor(flagColors[0].value);
    setEditingFlagComment('');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">{mockClient.name}</h1>
          <div className="text-gray-600 text-sm">{mockClient.email} · {mockClient.phone}</div>
          <div className="mt-1 text-xs">
            <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-700 mr-2">{mockClient.status}</span>
            <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-700">KYC: {mockClient.kycStatus}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded bg-blue-600 text-white">Edit</button>
          <button className="px-4 py-2 rounded bg-gray-200 text-gray-800">Block</button>
        </div>
      </div>
      <div className="flex gap-4 mb-6 border-b">
        <button className={`py-2 px-4 -mb-px border-b-2 ${activeTab==='transactions' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-gray-600'}`} onClick={()=>setActiveTab('transactions')}>Transactions</button>
        <button className={`py-2 px-4 -mb-px border-b-2 ${activeTab==='documents' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-gray-600'}`} onClick={()=>setActiveTab('documents')}>Documents</button>
        <button className={`py-2 px-4 -mb-px border-b-2 ${activeTab==='limits' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-gray-600'}`} onClick={()=>setActiveTab('limits')}>Limits</button>
        <button className={`py-2 px-4 -mb-px border-b-2 ${activeTab==='notes' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-gray-600'}`} onClick={()=>setActiveTab('notes')}>Notes</button>
        <button className={`py-2 px-4 -mb-px border-b-2 ${activeTab==='kyc' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-gray-600'}`} onClick={()=>setActiveTab('kyc')}>KYC/Compliance</button>
      </div>
      {activeTab === 'transactions' && (
        <Section title="Transaction History">
          <TransactionTable transactions={mockTransactions} onRowClick={setSelectedTxn} />
          {selectedTxn && (
            <TransactionDetailsModal txn={selectedTxn} onClose={() => setSelectedTxn(null)} />
          )}
        </Section>
      )}
      {activeTab === 'documents' && (
        <Section title="Documents">
          <div className="mb-4 flex items-center gap-4">
            <input type="file" onChange={handleFileUpload} disabled={uploading} />
            {uploading && <span className="text-blue-600 text-sm">Uploading...</span>}
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr key={doc.id} className="border-t">
                  <td className="p-2">{doc.name}</td>
                  <td className="p-2 capitalize">{doc.status}</td>
                  <td className="p-2 flex gap-2">
                    <a href={doc.url} download className="text-blue-600 hover:underline">Download</a>
                    <button onClick={() => handleDeleteDoc(doc.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
              {documents.length === 0 && (
                <tr><td colSpan={3} className="text-center text-gray-400 py-4">No documents uploaded.</td></tr>
              )}
            </tbody>
          </table>
        </Section>
      )}
      {activeTab === 'limits' && (
        <Section title="Limits">
          <div className="mb-2">Daily Limit: <b>${mockClient.limits.daily.toLocaleString()}</b> (Used: ${mockClient.limits.usedToday.toLocaleString()})</div>
          <div>Monthly Limit: <b>${mockClient.limits.monthly.toLocaleString()}</b> (Used: ${mockClient.limits.usedThisMonth.toLocaleString()})</div>
        </Section>
      )}
      {activeTab === 'notes' && (
        <Section title="Notes">
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="Add a note..."
              className="border rounded px-2 py-1 text-sm flex-1"
              onKeyDown={e => { if (e.key === 'Enter') handleAddNote(); }}
            />
            <button
              onClick={handleAddNote}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Add
            </button>
          </div>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            {notes.map(note => (
              <li key={note.id} className="flex items-center gap-2">
                {editingNoteId === note.id ? (
                  <>
                    <input
                      type="text"
                      value={editingText}
                      onChange={e => setEditingText(e.target.value)}
                      className="border rounded px-2 py-1 text-sm flex-1"
                      onKeyDown={e => { if (e.key === 'Enter') handleSaveEditNote(note.id); }}
                    />
                    <button onClick={() => handleSaveEditNote(note.id)} className="text-green-600 hover:underline">Save</button>
                    <button onClick={() => setEditingNoteId(null)} className="text-gray-500 hover:underline">Cancel</button>
                  </>
                ) : (
                  <>
                    <span>{note.text}</span>
                    <span className="text-xs text-gray-400 ml-2">({note.created})</span>
                    <button onClick={() => handleEditNote(note.id, note.text)} className="text-blue-600 hover:underline ml-2">Edit</button>
                    <button onClick={() => handleDeleteNote(note.id)} className="text-red-600 hover:underline ml-2">Delete</button>
                  </>
                )}
              </li>
            ))}
            {notes.length === 0 && <li className="text-gray-400">No notes yet.</li>}
          </ul>
        </Section>
      )}
      {activeTab === 'kyc' && (
        <Section title="KYC / Compliance">
          <div className="mb-2">KYC Status: <b>{mockClient.kycStatus}</b></div>
          <div className="mb-2">Compliance Flags: {mockClient.complianceFlags.length === 0 ? 'None' : mockClient.complianceFlags.join(', ')}</div>
          <div className="mb-4 font-semibold">KYC Documents</div>
          <table className="w-full text-sm mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {kycDocs.map(doc => (
                <tr key={doc.id} className="border-t">
                  <td className="p-2">{doc.name}</td>
                  <td className="p-2 capitalize">{doc.status}</td>
                  <td className="p-2 flex gap-2">
                    <a href={doc.url} download className="text-blue-600 hover:underline">Download</a>
                    {doc.status === 'pending' && canApproveKYC(user) && <>
                      <button onClick={() => handleKycApprove(doc.id)} className="text-green-600 hover:underline">Approve</button>
                      <button onClick={() => handleKycReject(doc.id)} className="text-red-600 hover:underline">Reject</button>
                    </>}
                  </td>
                </tr>
              ))}
              {kycDocs.length === 0 && (
                <tr><td colSpan={3} className="text-center text-gray-400 py-4">No KYC documents uploaded.</td></tr>
              )}
            </tbody>
          </table>
          <div className="mb-2 font-semibold">Review Comment</div>
          <textarea
            value={reviewComment}
            onChange={e => setReviewComment(e.target.value)}
            placeholder="Add a comment for KYC review..."
            className="border rounded px-2 py-1 text-sm w-full mb-2"
            rows={2}
            disabled={!canApproveKYC(user)}
          />
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded" disabled={!canApproveKYC(user)}>Approve All</button>
            <button className="px-4 py-2 bg-red-600 text-white rounded" disabled={!canApproveKYC(user)}>Reject All</button>
          </div>
          <div className="mb-6" />
          <div className="mb-2 font-semibold">Compliance Flags</div>
          <div className="mb-4 flex gap-2 items-end">
            <input
              type="text"
              value={newFlagLabel}
              onChange={e => setNewFlagLabel(e.target.value)}
              placeholder="Flag label (e.g. High Risk)"
              className="border rounded px-2 py-1 text-sm"
              disabled={!canEditComplianceFlags(user)}
            />
            <select
              value={newFlagColor}
              onChange={e => setNewFlagColor(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
              disabled={!canEditComplianceFlags(user)}
            >
              {flagColors.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <input
              type="text"
              value={newFlagComment}
              onChange={e => setNewFlagComment(e.target.value)}
              placeholder="Comment (optional)"
              className="border rounded px-2 py-1 text-sm flex-1"
              disabled={!canEditComplianceFlags(user)}
            />
            <button onClick={handleAddFlag} className="px-3 py-1 bg-blue-600 text-white rounded" disabled={!canEditComplianceFlags(user)}>Add</button>
          </div>
          <ul className="space-y-2 mb-6">
            {flags.map(flag => (
              <li key={flag.id} className="flex items-center gap-2">
                {editingFlagId === flag.id ? (
                  <>
                    <input
                      type="text"
                      value={editingFlagLabel}
                      onChange={e => setEditingFlagLabel(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                      disabled={!canEditComplianceFlags(user)}
                    />
                    <select
                      value={editingFlagColor}
                      onChange={e => setEditingFlagColor(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                      disabled={!canEditComplianceFlags(user)}
                    >
                      {flagColors.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={editingFlagComment}
                      onChange={e => setEditingFlagComment(e.target.value)}
                      className="border rounded px-2 py-1 text-sm flex-1"
                      disabled={!canEditComplianceFlags(user)}
                    />
                    <button onClick={() => handleSaveEditFlag(flag.id)} className="text-green-600 hover:underline" disabled={!canEditComplianceFlags(user)}>Save</button>
                    <button onClick={() => setEditingFlagId(null)} className="text-gray-500 hover:underline">Cancel</button>
                  </>
                ) : (
                  <>
                    <span className={`inline-block px-2 py-0.5 rounded bg-${flag.color} text-white text-xs font-semibold`}>{flag.label}</span>
                    {flag.comment && <span className="text-xs text-gray-500 ml-2">({flag.comment})</span>}
                    {canEditComplianceFlags(user) && <>
                      <button onClick={() => handleEditFlag(flag)} className="text-blue-600 hover:underline ml-2">Edit</button>
                      <button onClick={() => handleDeleteFlag(flag.id)} className="text-red-600 hover:underline ml-2">Delete</button>
                    </>}
                  </>
                )}
              </li>
            ))}
            {flags.length === 0 && <li className="text-gray-400">No compliance flags.</li>}
          </ul>
          <div className="mb-4 font-semibold">KYC Documents</div>
          <table className="w-full text-sm mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {kycDocs.map(doc => (
                <tr key={doc.id} className="border-t">
                  <td className="p-2">{doc.name}</td>
                  <td className="p-2 capitalize">{doc.status}</td>
                  <td className="p-2 flex gap-2">
                    <a href={doc.url} download className="text-blue-600 hover:underline">Download</a>
                    {doc.status === 'pending' && canApproveKYC(user) && <>
                      <button onClick={() => handleKycApprove(doc.id)} className="text-green-600 hover:underline">Approve</button>
                      <button onClick={() => handleKycReject(doc.id)} className="text-red-600 hover:underline">Reject</button>
                    </>}
                  </td>
                </tr>
              ))}
              {kycDocs.length === 0 && (
                <tr><td colSpan={3} className="text-center text-gray-400 py-4">No KYC documents uploaded.</td></tr>
              )}
            </tbody>
          </table>
          <div className="mb-2 font-semibold">Review Comment</div>
          <textarea
            value={reviewComment}
            onChange={e => setReviewComment(e.target.value)}
            placeholder="Add a comment for KYC review..."
            className="border rounded px-2 py-1 text-sm w-full mb-2"
            rows={2}
            disabled={!canApproveKYC(user)}
          />
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded" disabled={!canApproveKYC(user)}>Approve All</button>
            <button className="px-4 py-2 bg-red-600 text-white rounded" disabled={!canApproveKYC(user)}>Reject All</button>
          </div>
          <div className="mb-2 font-semibold">KYC/Compliance Audit Trail</div>
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Date</th>
                <th className="p-2">User</th>
                <th className="p-2">Action</th>
                <th className="p-2">Comment</th>
              </tr>
            </thead>
            <tbody>
              {kycAuditTrail.map(entry => (
                <tr key={entry.id} className="border-t">
                  <td className="p-2">{entry.date}</td>
                  <td className="p-2">{entry.user}</td>
                  <td className="p-2">{entry.action}</td>
                  <td className="p-2">{entry.comment}</td>
                </tr>
              ))}
              {kycAuditTrail.length === 0 && (
                <tr><td colSpan={4} className="text-center text-gray-400 py-4">No audit trail entries.</td></tr>
              )}
            </tbody>
          </table>
        </Section>
      )}
    </div>
  );
} 
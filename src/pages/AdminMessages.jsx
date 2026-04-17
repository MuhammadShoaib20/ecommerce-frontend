import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaEnvelope, FaCalendarAlt, FaTrash, FaEnvelopeOpen, FaInbox, FaUsers } from 'react-icons/fa';
import { getAllContactsAPI, getAllSubscriptionsAPI, deleteContactAPI, deleteSubscriptionAPI } from '../services/api';
import AdminNav from '../components/admin/AdminNav';

const AdminMessages = () => {
  const [contacts, setContacts] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('contacts');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [contactsRes, subsRes] = await Promise.all([
        getAllContactsAPI(),
        getAllSubscriptionsAPI()
      ]);
      setContacts(contactsRes.data.contacts || []);
      setSubscriptions(subsRes.data.subscriptions || []);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await deleteContactAPI(id);
      setContacts(prev => prev.filter(c => c._id !== id));
      toast.success('Message deleted');
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const handleDeleteSubscription = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) return;
    try {
      await deleteSubscriptionAPI(id);
      setSubscriptions(prev => prev.filter(s => s._id !== id));
      toast.success('Subscription deleted');
    } catch (error) {
      toast.error('Failed to delete subscription');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Messages & Subscriptions</h1>
              <p className="mt-1 text-sm text-gray-500">Manage incoming contact requests and newsletter subscribers.</p>
            </div>
            {/* Stats Pills */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm">
                <FaInbox className="text-blue-500 text-sm" />
                <span className="text-sm font-bold text-gray-700">{contacts.length}</span>
                <span className="text-xs text-gray-400 font-medium">Inquiries</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm">
                <FaUsers className="text-blue-500 text-sm" />
                <span className="text-sm font-bold text-gray-700">{subscriptions.length}</span>
                <span className="text-xs text-gray-400 font-medium">Subscribers</span>
              </div>
            </div>
          </div>
        </div>

        <AdminNav />

        {/* Tab Bar */}
        <div className="mt-6 mb-6 flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              activeTab === 'contacts'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FaInbox size={13} />
            Contact Inquiries
            <span className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'contacts' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
            }`}>
              {contacts.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              activeTab === 'subscriptions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FaUsers size={13} />
            Subscribers
            <span className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'subscriptions' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
            }`}>
              {subscriptions.length}
            </span>
          </button>
        </div>

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            {contacts.length === 0 ? (
              <EmptyState message="No contact messages yet." />
            ) : (
              contacts.map(contact => (
                <div
                  key={contact._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      
                      {/* Avatar */}
                      <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-base border border-blue-100">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                          <span className="font-bold text-gray-900 text-sm">{contact.name}</span>
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          >
                            {contact.email}
                          </a>
                          <span className="ml-auto flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                            <FaCalendarAlt size={10} />
                            {formatDate(contact.createdAt)}
                          </span>
                        </div>

                        <p className="text-sm font-semibold text-gray-800 mb-3">{contact.subject}</p>

                        <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-3">
                          <p className="text-sm text-gray-600 leading-relaxed">{contact.message}</p>
                        </div>
                      </div>

                      {/* Delete Action */}
                      <div className="flex-shrink-0 sm:ml-2">
                        <button
                          onClick={() => handleDeleteContact(contact._id)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-400 bg-gray-50 rounded-xl hover:bg-red-50 hover:text-red-500 border border-gray-100 hover:border-red-100 transition-all duration-200"
                        >
                          <FaTrash size={11} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div>
            {subscriptions.length === 0 ? (
              <EmptyState message="No subscribers yet." />
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Subscribed On</th>
                        <th className="px-6 py-3 text-right text-xs font-black text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {subscriptions.map(sub => (
                        <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                <FaEnvelope className="text-blue-400 text-xs" />
                              </div>
                              <span className="text-sm font-medium text-gray-800">{sub.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-500 font-medium">{formatDate(sub.createdAt)}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDeleteSubscription(sub._id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                            >
                              <FaTrash size={10} />
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                  <p className="text-xs text-gray-400 font-medium">{subscriptions.length} subscriber{subscriptions.length !== 1 ? 's' : ''} total</p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 py-20 px-8 text-center">
    <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
      <FaEnvelopeOpen className="text-gray-300 text-2xl" />
    </div>
    <h3 className="text-base font-bold text-gray-700 mb-1">Nothing here yet</h3>
    <p className="text-sm text-gray-400">{message}</p>
  </div>
);

export default AdminMessages;
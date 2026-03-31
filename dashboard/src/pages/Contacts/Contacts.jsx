import { useEffect, useState } from 'react';
import { FiMail, FiTrash2, FiCheckCircle, FiInbox, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaCircle } from 'react-icons/fa';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

const LIMIT = 10;

const Contacts = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [unreadCount, setUnreadCount] = useState(0);
    const [selected, setSelected] = useState(null);

    const fetchQueries = async (pg = 1) => {
        setLoading(true);
        try {
            const res = await api.get(`/contact?page=${pg}&limit=${LIMIT}`);
            const d = res.data;
            setQueries(d.data);
            setTotalPages(d.totalPages);
            setTotal(d.total);
            setUnreadCount(d.unreadCount);
            setPage(pg);
        } catch (err) {
            toast.error('Failed to load queries');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueries(1);
    }, []);

    const handleMarkRead = async (id, e) => {
        e?.stopPropagation();
        try {
            await api.put(`/contact/${id}/read`);
            setQueries(prev => prev.map(q => q._id === id ? { ...q, isRead: true } : q));
            setUnreadCount(prev => Math.max(0, prev - 1));
            if (selected?._id === id) setSelected(prev => ({ ...prev, isRead: true }));
            toast.success('Marked as read');
        } catch {
            toast.error('Failed to mark as read');
        }
    };

    const handleDelete = async (id, e) => {
        e?.stopPropagation();
        if (!window.confirm('Delete this query?')) return;
        try {
            await api.delete(`/contact/${id}`);
            setQueries(prev => prev.filter(q => q._id !== id));
            setTotal(prev => prev - 1);
            if (selected?._id === id) setSelected(null);
            toast.success('Deleted');
        } catch {
            toast.error('Failed to delete');
        }
    };

    const handleSelect = async (query) => {
        setSelected(query);
        if (!query.isRead) {
            await handleMarkRead(query._id);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Contact Queries</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {total} total message{total !== 1 ? 's' : ''}
                        {unreadCount > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                                {unreadCount} unread
                            </span>
                        )}
                    </p>
                </div>
                <div className="w-10 h-10 bg-orange-50 flex items-center justify-center rounded-xl">
                    <FiInbox className="text-orange-600" size={20} />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Query List */}
                <div className="lg:w-1/2 xl:w-2/5">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="flex justify-center py-16">
                                <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : queries.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <FiMail size={40} className="mx-auto mb-3 opacity-30" />
                                <p className="text-sm font-medium">No queries yet</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {queries.map(query => (
                                    <li
                                        key={query._id}
                                        onClick={() => handleSelect(query)}
                                        className={`flex items-start gap-3 p-4 cursor-pointer transition-colors hover:bg-orange-50 ${selected?._id === query._id ? 'bg-orange-50 border-l-4 border-orange-500' : ''
                                            }`}
                                    >
                                        {/* Unread dot */}
                                        <div className="mt-1 shrink-0">
                                            {!query.isRead ? (
                                                <FaCircle className="text-orange-500" size={8} />
                                            ) : (
                                                <div className="w-2 h-2" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className={`text-sm truncate ${query.isRead ? 'font-medium text-gray-700' : 'font-bold text-gray-900'}`}>
                                                    {query.name}
                                                </p>
                                                <span className="text-[10px] text-gray-400 shrink-0">
                                                    {new Date(query.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate">{query.email}</p>
                                            <p className="text-xs text-gray-400 truncate mt-0.5">{query.subject}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-1 shrink-0">
                                            {!query.isRead && (
                                                <button
                                                    onClick={(e) => handleMarkRead(query._id, e)}
                                                    className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Mark as read"
                                                >
                                                    <FiCheckCircle size={14} />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => handleDelete(query._id, e)}
                                                className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <FiTrash2 size={14} />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                                <p className="text-xs text-gray-500">
                                    Page {page} of {totalPages}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => fetchQueries(page - 1)}
                                        disabled={page === 1}
                                        className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <FiChevronLeft size={16} />
                                    </button>
                                    <button
                                        onClick={() => fetchQueries(page + 1)}
                                        disabled={page === totalPages}
                                        className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <FiChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Detail Pane */}
                <div className="lg:flex-1">
                    {selected ? (
                        <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
                            {/* Meta */}
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{selected.name}</h2>
                                    <a href={`mailto:${selected.email}`} className="text-sm text-orange-600 hover:underline">
                                        {selected.email}
                                    </a>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    {!selected.isRead && (
                                        <button
                                            onClick={() => handleMarkRead(selected._id)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors"
                                        >
                                            <FiCheckCircle size={13} /> Mark Read
                                        </button>
                                    )}
                                    <button
                                        onClick={(e) => handleDelete(selected._id, e)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                                    >
                                        <FiTrash2 size={13} /> Delete
                                    </button>
                                </div>
                            </div>

                            {/* Subject & Date */}
                            <div className="flex flex-wrap gap-3">
                                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                                    {selected.subject}
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                    {new Date(selected.createdAt).toLocaleString('en-US', {
                                        year: 'numeric', month: 'short', day: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </span>
                                {selected.isRead && (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1">
                                        <FiCheckCircle size={11} /> Read
                                    </span>
                                )}
                            </div>

                            {/* Message */}
                            <div className="border-t border-gray-100 pt-5">
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Message</p>
                                <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                            </div>

                            {/* Reply */}
                            <div className="border-t border-gray-100 pt-4">
                                <a
                                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white text-sm font-bold rounded-xl hover:bg-orange-700 transition-colors"
                                >
                                    <FiMail size={15} /> Reply via Email
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm flex flex-col items-center justify-center py-20 text-center">
                            <FiMail size={40} className="text-gray-200 mb-4" />
                            <p className="text-gray-400 text-sm font-medium">Select a query to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contacts;

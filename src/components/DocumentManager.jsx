import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, CheckCircle, AlertCircle, Clock, Edit, Save, X } from 'lucide-react';
import DocumentUpload from './DocumentUpload';

const DocumentManager = () => {
  const [documents, setDocuments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      fetchDocuments();
    }
  }, [selectedEmployee, currentPage]);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/employees', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEmployees(data.employees || []);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        employee_id: selectedEmployee,
        page: currentPage,
        per_page: 10
      });

      const response = await fetch(`/api/documents?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
        setTotalPages(data.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = () => {
    fetchDocuments();
  };

  const handleDownload = async (documentId, filename) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/documents/${documentId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const handleEdit = (document) => {
    setEditingDocument(document.document_id);
    setEditForm({
      training_topic: document.training_topic || '',
      training_method: document.training_method || '',
      training_date: document.training_date || '',
      training_duration: document.training_duration || '',
      attendance_status: document.attendance_status || '',
      completion_status: document.completion_status || '',
      score: document.score || '',
      instructor: document.instructor || '',
      location: document.location || ''
    });
  };

  const handleSave = async (documentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/documents/${documentId}/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        setEditingDocument(null);
        setEditForm({});
        fetchDocuments();
      }
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  const handleCancel = () => {
    setEditingDocument(null);
    setEditForm({});
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Document Manager</h2>
      </div>

      {/* Employee Selection */}
      <div className="bg-white p-6 rounded-lg shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Employee
        </label>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Choose an employee...</option>
          {employees.map((employee) => (
            <option key={employee.employee_id} value={employee.employee_id}>
              {employee.badge_number} - {employee.first_name} {employee.last_name}
            </option>
          ))}
        </select>
      </div>

      {/* Document Upload */}
      {selectedEmployee && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Upload Training Documents
          </h3>
          <DocumentUpload
            employeeId={selectedEmployee}
            onUploadComplete={handleUploadComplete}
          />
        </div>
      )}

      {/* Documents List */}
      {selectedEmployee && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Employee Documents
            </h3>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading documents...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No documents found for this employee.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {documents.map((document) => (
                <div key={document.document_id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-6 h-6 text-gray-400" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {document.original_filename}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Uploaded on {formatDate(document.upload_date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(document.processing_status)}
                      <span className="text-xs text-gray-600 capitalize">
                        {document.processing_status}
                      </span>
                    </div>
                  </div>

                  {/* Extracted Information */}
                  {document.ocr_processed && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h5 className="text-sm font-medium text-gray-900 mb-3">
                        Extracted Training Information
                        {document.verified && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </span>
                        )}
                      </h5>

                      {editingDocument === document.document_id ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Training Topic
                            </label>
                            <input
                              type="text"
                              value={editForm.training_topic}
                              onChange={(e) => setEditForm({...editForm, training_topic: e.target.value})}
                              className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Training Method
                            </label>
                            <input
                              type="text"
                              value={editForm.training_method}
                              onChange={(e) => setEditForm({...editForm, training_method: e.target.value})}
                              className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Training Date
                            </label>
                            <input
                              type="date"
                              value={editForm.training_date}
                              onChange={(e) => setEditForm({...editForm, training_date: e.target.value})}
                              className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Duration (hours)
                            </label>
                            <input
                              type="number"
                              step="0.5"
                              value={editForm.training_duration}
                              onChange={(e) => setEditForm({...editForm, training_duration: e.target.value})}
                              className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Attendance Status
                            </label>
                            <select
                              value={editForm.attendance_status}
                              onChange={(e) => setEditForm({...editForm, attendance_status: e.target.value})}
                              className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="">Select...</option>
                              <option value="Present">Present</option>
                              <option value="Absent">Absent</option>
                              <option value="Partial">Partial</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Completion Status
                            </label>
                            <select
                              value={editForm.completion_status}
                              onChange={(e) => setEditForm({...editForm, completion_status: e.target.value})}
                              className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="">Select...</option>
                              <option value="Passed">Passed</option>
                              <option value="Failed">Failed</option>
                              <option value="Completed">Completed</option>
                              <option value="In Progress">In Progress</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Score (%)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={editForm.score}
                              onChange={(e) => setEditForm({...editForm, score: e.target.value})}
                              className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Instructor
                            </label>
                            <input
                              type="text"
                              value={editForm.instructor}
                              onChange={(e) => setEditForm({...editForm, instructor: e.target.value})}
                              className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Location
                            </label>
                            <input
                              type="text"
                              value={editForm.location}
                              onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                              className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Topic:</span>
                            <span className="ml-2 text-gray-900">{document.training_topic || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Method:</span>
                            <span className="ml-2 text-gray-900">{document.training_method || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Date:</span>
                            <span className="ml-2 text-gray-900">{formatDate(document.training_date)}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Duration:</span>
                            <span className="ml-2 text-gray-900">
                              {document.training_duration ? `${document.training_duration} hours` : 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Attendance:</span>
                            <span className="ml-2 text-gray-900">{document.attendance_status || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Status:</span>
                            <span className="ml-2 text-gray-900">{document.completion_status || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Score:</span>
                            <span className="ml-2 text-gray-900">
                              {document.score ? `${document.score}%` : 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Instructor:</span>
                            <span className="ml-2 text-gray-900">{document.instructor || 'N/A'}</span>
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-medium text-gray-700">Location:</span>
                            <span className="ml-2 text-gray-900">{document.location || 'N/A'}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownload(document.document_id, document.original_filename)}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </button>
                      {document.ocr_confidence && (
                        <span className="text-xs text-gray-500">
                          OCR Confidence: {Math.round(document.ocr_confidence)}%
                        </span>
                      )}
                    </div>

                    {document.ocr_processed && (
                      <div className="flex items-center space-x-2">
                        {editingDocument === document.document_id ? (
                          <>
                            <button
                              onClick={() => handleSave(document.document_id)}
                              className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200"
                            >
                              <Save className="w-3 h-3 mr-1" />
                              Save
                            </button>
                            <button
                              onClick={handleCancel}
                              className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEdit(document)}
                            className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentManager;


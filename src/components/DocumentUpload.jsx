import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';

const DocumentUpload = ({ employeeId, onUploadComplete }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    if (!employeeId) {
      setError('Please select an employee first');
      return;
    }

    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/tiff', 'image/bmp'];
      const maxSize = 16 * 1024 * 1024; // 16MB
      
      if (!validTypes.includes(file.type)) {
        setError(`Invalid file type: ${file.name}. Allowed types: PDF, JPG, PNG, TIFF, BMP`);
        return false;
      }
      
      if (file.size > maxSize) {
        setError(`File too large: ${file.name}. Maximum size is 16MB`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    setError('');
    setUploading(true);
    setUploadProgress(0);

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      await uploadFile(file);
      setUploadProgress(((i + 1) / validFiles.length) * 100);
    }

    setUploading(false);
    setUploadProgress(0);
    
    if (onUploadComplete) {
      onUploadComplete();
    }
  };

  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('employee_id', employeeId);

      const token = localStorage.getItem('token');
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();
      
      setUploadedFiles(prev => [...prev, {
        id: result.document_id,
        name: file.name,
        status: result.processing_status,
        uploadTime: new Date().toLocaleTimeString()
      }]);

    } catch (error) {
      console.error('Upload error:', error);
      setError(`Failed to upload ${file.name}: ${error.message}`);
    }
  };

  const removeUploadedFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'OCR Complete';
      case 'processing':
        return 'Processing...';
      case 'error':
        return 'Processing Error';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.tiff,.bmp"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        <div className="space-y-4">
          <Upload className="w-12 h-12 text-gray-400 mx-auto" />
          <div>
            <p className="text-lg font-medium text-gray-900">
              Drop training documents here
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or click to browse files
            </p>
          </div>
          <div className="text-xs text-gray-400">
            Supported formats: PDF, JPG, PNG, TIFF, BMP (max 16MB each)
          </div>
        </div>

        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm font-medium text-gray-900">
                Uploading and processing documents...
              </p>
              <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Recently Uploaded</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      Uploaded at {file.uploadTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(file.status)}
                    <span className="text-xs text-gray-600">
                      {getStatusText(file.status)}
                    </span>
                  </div>
                  <button
                    onClick={() => removeUploadedFile(file.id)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          How Document Processing Works
        </h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Upload scanned training documents (certificates, attendance sheets, etc.)</li>
          <li>• OCR automatically extracts training topic, method, and attendance info</li>
          <li>• Review and verify the extracted information before saving</li>
          <li>• Documents are linked to the selected employee's training record</li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentUpload;


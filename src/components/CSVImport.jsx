import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle, X, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const CSVImport = () => {
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [validating, setValidating] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setImportResult(null);
        setValidationResult(null);
      } else {
        alert('Please select a CSV file.');
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setImportResult(null);
      setValidationResult(null);
    }
  };

  const downloadTemplate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/csv/template', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'employee_import_template.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to download template');
      }
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Failed to download template');
    }
  };

  const validateFile = async () => {
    if (!file) return;

    setValidating(true);
    setValidationResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await fetch('/api/csv/validate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();
      setValidationResult(result);
    } catch (error) {
      console.error('Error validating file:', error);
      setValidationResult({
        success: false,
        error: 'Failed to validate file'
      });
    } finally {
      setValidating(false);
    }
  };

  const importFile = async () => {
    if (!file) return;

    setImporting(true);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await fetch('/api/csv/import/employees', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();
      setImportResult(result);
    } catch (error) {
      console.error('Error importing file:', error);
      setImportResult({
        success: false,
        error: 'Failed to import file'
      });
    } finally {
      setImporting(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setImportResult(null);
    setValidationResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">CSV Import</h2>
          <p className="text-gray-600">Import employee data from CSV files</p>
        </div>
        <Button onClick={downloadTemplate} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Template
        </Button>
      </div>

      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-6">
          {/* File Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload CSV File
              </CardTitle>
              <CardDescription>
                Select or drag and drop a CSV file containing employee data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : file
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">{file.name}</p>
                        <p className="text-sm text-green-600">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFile}
                        className="ml-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button
                        onClick={validateFile}
                        disabled={validating}
                        variant="outline"
                      >
                        {validating ? 'Validating...' : 'Validate File'}
                      </Button>
                      <Button
                        onClick={importFile}
                        disabled={importing}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {importing ? 'Importing...' : 'Import Data'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        Drop your CSV file here, or{' '}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="text-blue-600 hover:text-blue-700 underline"
                        >
                          browse
                        </button>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Maximum file size: 10MB
                      </p>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          {/* Validation Results */}
          {validationResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {validationResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  Validation Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {validationResult.success ? (
                  <div className="space-y-4">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        File structure is valid and ready for import.
                      </AlertDescription>
                    </Alert>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Rows: {validationResult.file_info.rows}</p>
                        <p className="font-medium">Columns: {validationResult.file_info.columns.length}</p>
                      </div>
                      <div>
                        <p className="font-medium">Required columns:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {validationResult.file_info.required_columns.map(col => (
                            <Badge key={col} variant="secondary">{col}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {validationResult.error}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Import Results */}
          {importResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {importResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  Import Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {importResult.success ? (
                  <div className="space-y-4">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        {importResult.message}
                      </AlertDescription>
                    </Alert>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{importResult.processed}</p>
                        <p className="text-sm text-blue-800">Processed</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{importResult.successful}</p>
                        <p className="text-sm text-green-800">Successful</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-2xl font-bold text-red-600">{importResult.failed}</p>
                        <p className="text-sm text-red-800">Failed</p>
                      </div>
                    </div>

                    {importResult.failed_imports && importResult.failed_imports.length > 0 && (
                      <div>
                        <h4 className="font-medium text-red-800 mb-2">Failed Imports:</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {importResult.failed_imports.map((failure, index) => (
                            <div key={index} className="bg-red-50 p-2 rounded text-sm">
                              <p className="font-medium">Row {failure.row}:</p>
                              <ul className="list-disc list-inside text-red-700">
                                {failure.errors.map((error, errorIndex) => (
                                  <li key={errorIndex}>{error}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {importResult.error}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="requirements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                CSV Format Requirements
              </CardTitle>
              <CardDescription>
                Follow these guidelines to ensure successful data import
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Required Columns</h4>
                <div className="flex flex-wrap gap-2">
                  {['first_name', 'last_name', 'badge_number', 'rank_title', 'department_unit'].map(col => (
                    <Badge key={col} variant="default">{col}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Optional Columns</h4>
                <div className="flex flex-wrap gap-2">
                  {['contact_info', 'hire_date', 'certification_expiry', 'specialties'].map(col => (
                    <Badge key={col} variant="secondary">{col}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Validation Rules</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• <strong>Names:</strong> Letters, spaces, hyphens, apostrophes, and periods only</li>
                  <li>• <strong>Badge Number:</strong> Must be unique, alphanumeric with hyphens and spaces allowed</li>
                  <li>• <strong>Rank:</strong> Must be a valid police rank (Officer, Sergeant, Detective, etc.)</li>
                  <li>• <strong>Email:</strong> Valid email format if provided in contact_info</li>
                  <li>• <strong>Dates:</strong> Use YYYY-MM-DD format for hire_date and certification_expiry</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">File Requirements</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• File format: CSV (.csv)</li>
                  <li>• Maximum file size: 10MB</li>
                  <li>• First row must contain column headers</li>
                  <li>• UTF-8 encoding recommended</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CSVImport;


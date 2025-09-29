import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Mail, FileText, Users, CheckCircle } from 'lucide-react';

const CertificateManager = ({ user, token }) => {
  const [certificates, setCertificates] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user.role === 'viewer') {
      fetchEmployeeCertificates();
    } else {
      fetchTrainingEvents();
    }
  }, [user]);

  const fetchEmployeeCertificates = async () => {
    try {
      // For viewers, get their own certificates
      const response = await fetch(`/api/employees/${user.employee_id}/certificates`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCertificates(data.certificates || []);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    }
  };

  const fetchTrainingEvents = async () => {
    try {
      const response = await fetch('/api/training-events', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setEvents(data || []);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const downloadCertificate = async (eventId, employeeId) => {
    try {
      const response = await fetch(`/api/events/${eventId}/employees/${employeeId}/certificate`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `certificate_${eventId}_${employeeId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setMessage('Certificate downloaded successfully');
      } else {
        const data = await response.json();
        setMessage(data.message || 'Failed to download certificate');
      }
    } catch (error) {
      setMessage('Error downloading certificate');
    }
  };

  const sendCertificateEmail = async (eventId, employeeId) => {
    setLoading(true);
    try {
      const response = await fetch('/api/email/certificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          event_id: eventId,
          employee_id: employeeId,
        }),
      });
      
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Error sending certificate email');
    } finally {
      setLoading(false);
    }
  };

  const sendBulkCertificates = async (eventId) => {
    setLoading(true);
    try {
      const response = await fetch('/api/email/certificates/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          event_id: eventId,
        }),
      });
      
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Error sending bulk certificates');
    } finally {
      setLoading(false);
    }
  };

  if (user.role === 'viewer') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">My Certificates</h2>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-4 h-4 mr-1" />
            Viewer Access
          </Badge>
        </div>

        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4">
          {certificates.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No certificates available yet.</p>
                  <p className="text-sm">Complete training courses to earn certificates.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            certificates.map((cert, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{cert.course_name}</h3>
                      <p className="text-sm text-gray-600">
                        Completed: {new Date(cert.completion_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      onClick={() => downloadCertificate(cert.event_id, user.employee_id)}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Certificate Management</h2>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Users className="w-4 h-4 mr-1" />
          {user.role === 'admin' ? 'Admin' : 'Editor'} Access
        </Badge>
      </div>

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {events.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No training events found.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          events.map((event) => (
            <Card key={event.event_id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{event.course_name}</span>
                  <Badge variant={event.status === 'Completed' ? 'default' : 'secondary'}>
                    {event.status}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {new Date(event.event_date_time).toLocaleDateString()} • {event.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <p>Attendees: {event.attendees?.length || 0}</p>
                    <p>Instructor(s): {event.instructors}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => sendBulkCertificates(event.event_id)}
                      disabled={loading || event.status !== 'Completed'}
                      className="flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Email All Certificates
                    </Button>
                  </div>
                </div>
                
                {event.attendees && event.attendees.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium text-sm">Attendees:</h4>
                    <div className="space-y-1">
                      {event.attendees.map((attendee) => (
                        <div key={attendee.employee_id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="text-sm">
                            <span className="font-medium">{attendee.name}</span>
                            <Badge 
                              variant={attendee.completion_status === 'Passed' ? 'default' : 'secondary'}
                              className="ml-2"
                            >
                              {attendee.completion_status}
                            </Badge>
                          </div>
                          {attendee.completion_status === 'Passed' && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadCertificate(event.event_id, attendee.employee_id)}
                              >
                                <Download className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => sendCertificateEmail(event.event_id, attendee.employee_id)}
                                disabled={loading}
                              >
                                <Mail className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CertificateManager;


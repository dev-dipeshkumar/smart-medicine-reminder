'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Phone,
  Ambulance,
  AlertTriangle,
  Plus,
  Trash2,
  User,
  Heart,
  Siren,
  MapPin,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
}

export default function EmergencyPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [sendingAlert, setSendingAlert] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await api.get('/emergency/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/emergency/contacts', newContact);
      setNewContact({ name: '', phone: '', relationship: '' });
      setShowAddModal(false);
      fetchContacts();
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await api.delete(`/emergency/contacts/${id}`);
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleSendAlert = async () => {
    setSendingAlert(true);
    try {
      await api.post('/emergency/alert', {
        message: alertMessage || 'Emergency! I need immediate help!',
        location: 'User location'
      });
      setShowAlertModal(false);
      setAlertMessage('');
      alert('Emergency alert sent to your contacts!');
    } catch (error) {
      console.error('Error sending alert:', error);
    } finally {
      setSendingAlert(false);
    }
  };

  const emergencyNumbers = [
    { number: '108', label: 'Ambulance', icon: Ambulance, color: 'bg-red-500 hover:bg-red-600' },
    { number: '112', label: 'Emergency', icon: Siren, color: 'bg-orange-500 hover:bg-orange-600' },
    { number: '102', label: 'Medical', icon: Heart, color: 'bg-pink-500 hover:bg-pink-600' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Emergency Services</h1>
          <p className="text-gray-500 mt-1">Quick access to emergency help</p>
        </div>

        {/* Emergency Call Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {emergencyNumbers.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.number}
                href={`tel:${item.number}`}
                className={`${item.color} text-white rounded-2xl p-6 transition-all hover:shadow-lg group`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold mb-1">{item.number}</p>
                    <p className="text-white/80">{item.label}</p>
                  </div>
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Send Alert Button */}
        <Button
          onClick={() => setShowAlertModal(true)}
          className="w-full bg-red-600 hover:bg-red-700 h-auto py-6 rounded-2xl"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold">SEND EMERGENCY ALERT</p>
              <p className="text-red-100">Notify your emergency contacts immediately</p>
            </div>
          </div>
        </Button>

        {/* Emergency Contacts */}
        <Card className="border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-[#0284c7]" />
              <CardTitle>Emergency Contacts</CardTitle>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-[#0284c7] hover:bg-[#0369a1]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {contacts.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">No emergency contacts</h3>
                <p className="text-gray-500 mb-4">Add contacts who should be notified in case of emergency</p>
                <Button onClick={() => setShowAddModal(true)} className="bg-[#0284c7] hover:bg-[#0369a1]">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Contact
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {contacts.map((contact) => (
                  <div key={contact.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#e0f2fe] rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-[#0284c7]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{contact.name}</h3>
                        <p className="text-sm text-gray-500">{contact.relationship}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteContact(contact.id)}
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Important Info */}
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Important Information</AlertTitle>
          <AlertDescription className="text-yellow-700">
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>In case of life-threatening emergency, call 108 or 112 immediately</li>
              <li>Keep your emergency contacts updated</li>
              <li>Include your location when sending emergency alerts</li>
              <li>This app is for assistance only - always call emergency services for serious situations</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Add Contact Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Emergency Contact</DialogTitle>
              <DialogDescription>
                Add a contact who will be notified in case of emergency.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddContact} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="contactName">Name</Label>
                <Input
                  id="contactName"
                  type="text"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  placeholder="Contact name"
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Phone Number</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  placeholder="Phone number"
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="contactRelationship">Relationship</Label>
                <Input
                  id="contactRelationship"
                  type="text"
                  value={newContact.relationship}
                  onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                  placeholder="e.g., Family, Friend, Doctor"
                  className="mt-2"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-[#0284c7] hover:bg-[#0369a1]">
                  Add Contact
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Send Alert Modal */}
        <Dialog open={showAlertModal} onOpenChange={setShowAlertModal}>
          <DialogContent>
            <DialogHeader>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <DialogTitle className="text-center">Send Emergency Alert</DialogTitle>
              <DialogDescription className="text-center">
                This will notify all your emergency contacts
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="alertMessage">Message (Optional)</Label>
                <Textarea
                  id="alertMessage"
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  rows={3}
                  placeholder="Describe your emergency situation..."
                  className="mt-2"
                />
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>Your location will be included in the alert</p>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowAlertModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleSendAlert}
                  disabled={sendingAlert}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {sendingAlert ? 'Sending...' : 'Send Alert'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

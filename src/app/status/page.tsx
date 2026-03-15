'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Pill,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  time: string;
  frequency: string;
}

interface HistoryRecord {
  date: string;
  status: string;
  medicineName: string;
  dosage: string;
}

export default function MedicineStatusPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const displayDate = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  useEffect(() => {
    fetchMedicines();
    fetchHistory();
  }, []);

  useEffect(() => {
    if (medicines.length > 0) {
      fetchStatusForDate(selectedDate);
    }
  }, [selectedDate, medicines]);

  const fetchMedicines = async () => {
    try {
      const response = await api.get('/medicines');
      setMedicines(response.data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  const fetchStatusForDate = async (date: Date) => {
    const dateStr = formatDate(date);
    const statusPromises = medicines.map(med =>
      api.get(`/medicine-status/${med.id}?date=${dateStr}`)
    );

    try {
      const results = await Promise.all(statusPromises);
      const newStatusMap: Record<string, string> = {};
      medicines.forEach((med, index) => {
        newStatusMap[med.id] = results[index].data.status;
      });
      setStatusMap(newStatusMap);
    } catch (error) {
      console.error('Error fetching status:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await api.get('/medicine-history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleStatusUpdate = async (medicineId: string, status: string) => {
    try {
      await api.post('/medicine-status', {
        medicineId,
        date: formatDate(selectedDate),
        status
      });
      fetchStatusForDate(selectedDate);
      fetchHistory();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const isToday = formatDate(selectedDate) === formatDate(new Date());

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0284c7]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Medicine Status</h1>
          <p className="text-gray-500 mt-1">Track your daily medication intake</p>
        </div>

        <Tabs defaultValue="today" className="w-full">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="today" className="data-[state=active]:bg-[#0284c7] data-[state=active]:text-white">
              Daily Tracker
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#0284c7] data-[state=active]:text-white">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="mt-6 space-y-4">
            {/* Date Navigator */}
            <Card className="border-gray-100">
              <CardContent className="p-4 flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => changeDate(-1)}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#0284c7]" />
                  <span className="font-semibold text-gray-800">
                    {isToday ? 'Today' : displayDate(selectedDate)}
                  </span>
                  <Input
                    type="date"
                    value={formatDate(selectedDate)}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="w-40"
                  />
                </div>
                <Button variant="ghost" size="icon" onClick={() => changeDate(1)}>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </CardContent>
            </Card>

            {/* Medicine List */}
            {medicines.length === 0 ? (
              <Card className="border-gray-100">
                <CardContent className="p-8 text-center">
                  <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700">No medicines added</h3>
                  <p className="text-gray-500">Add medicines to start tracking</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {medicines.map((medicine) => {
                  const status = statusMap[medicine.id];
                  return (
                    <Card key={medicine.id} className="border-gray-100 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              status === 'taken' ? 'bg-green-100' :
                              status === 'skipped' ? 'bg-red-100' : 'bg-[#e0f2fe]'
                            }`}>
                              <Pill className={`w-6 h-6 ${
                                status === 'taken' ? 'text-green-600' :
                                status === 'skipped' ? 'text-red-600' : 'text-[#0284c7]'
                              }`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">{medicine.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <Clock className="w-4 h-4" />
                                <span>{medicine.time}</span>
                                <span className="text-gray-300">|</span>
                                <span>{medicine.dosage}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {status === 'taken' ? (
                              <span className="flex items-center gap-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
                                <CheckCircle className="w-4 h-4" /> Taken
                              </span>
                            ) : status === 'skipped' ? (
                              <span className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium">
                                <XCircle className="w-4 h-4" /> Skipped
                              </span>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusUpdate(medicine.id, 'taken')}
                                  className="bg-green-500 hover:bg-green-600"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" /> Take
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleStatusUpdate(medicine.id, 'skipped')}
                                >
                                  <XCircle className="w-4 h-4 mr-1" /> Skip
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card className="border-gray-100">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <History className="w-5 h-5 text-[#0284c7]" />
                  <CardTitle>Medicine History</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {history.length === 0 ? (
                  <div className="p-8 text-center">
                    <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No history recorded yet</p>
                  </div>
                ) : (
                  <ScrollArea className="h-96">
                    <div className="divide-y divide-gray-100">
                      {history.map((record, index) => (
                        <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              record.status === 'taken' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              {record.status === 'taken' ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{record.medicineName}</p>
                              <p className="text-sm text-gray-500">{record.dosage}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-700">{record.date}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              record.status === 'taken'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {record.status === 'taken' ? 'Taken' : 'Skipped'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

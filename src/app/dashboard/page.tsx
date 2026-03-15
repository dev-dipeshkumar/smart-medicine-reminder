'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/utils/api';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import {
  Pill,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  AlertCircle,
  ArrowRight,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  time: string;
  frequency: string;
  startDate: string;
  endDate?: string;
}

interface Stats {
  total: number;
  taken: number;
  skipped: number;
  pending: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [todayStatus, setTodayStatus] = useState<Record<string, string>>({});
  const [stats, setStats] = useState<Stats>({ total: 0, taken: 0, skipped: 0, pending: 0 });
  const [dataLoading, setDataLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Only fetch data if user is authenticated
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch medicines
      const medicinesRes = await api.get('/medicines');
      setMedicines(medicinesRes.data);

      // Fetch status for each medicine
      if (medicinesRes.data.length > 0) {
        const statusPromises = medicinesRes.data.map((med: Medicine) =>
          api.get(`/medicine-status/${med.id}?date=${today}`)
        );
        const statusResults = await Promise.all(statusPromises);

        const statusMap: Record<string, string> = {};
        let taken = 0, skipped = 0, pending = 0;

        medicinesRes.data.forEach((med: Medicine, index: number) => {
          const status = statusResults[index].data.status;
          statusMap[med.id] = status;
          if (status === 'taken') taken++;
          else if (status === 'skipped') skipped++;
          else pending++;
        });

        setTodayStatus(statusMap);
        setStats({
          total: medicinesRes.data.length,
          taken,
          skipped,
          pending
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleStatusUpdate = async (medicineId: string, status: string) => {
    try {
      await api.post('/medicine-status', {
        medicineId,
        date: today,
        status
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (dataLoading) {
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
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] rounded-2xl p-6 md:p-8 text-white shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-[#bae6fd]">
            Here&apos;s your medicine schedule for today
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-[#e0f2fe]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#e0f2fe] flex items-center justify-center">
                  <Pill className="w-5 h-5 text-[#0284c7]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-xl font-bold text-gray-800">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Taken</p>
                  <p className="text-xl font-bold text-green-600">{stats.taken}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-xl font-bold text-orange-600">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Skipped</p>
                  <p className="text-xl font-bold text-red-600">{stats.skipped}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Medicines */}
        <Card className="border-[#e0f2fe]">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#0284c7]" />
              <CardTitle className="text-lg">Today&apos;s Medicines</CardTitle>
            </div>
            <Link
              href="/medicines"
              className="text-sm text-[#0284c7] hover:text-[#0369a1] font-medium flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {medicines.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-[#e0f2fe] rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-[#0284c7]" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">No medicines added yet</h3>
                <p className="text-gray-500 mb-4">Start tracking your medications by adding them</p>
                <Link href="/medicines/add">
                  <Button className="bg-[#0284c7] hover:bg-[#0369a1]">
                    <Pill className="w-4 h-4 mr-2" />
                    Add Medicine
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {medicines.map((medicine) => {
                  const status = todayStatus[medicine.id];
                  return (
                    <div key={medicine.id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${status === 'taken' ? 'bg-green-100' : status === 'skipped' ? 'bg-red-100' : 'bg-[#e0f2fe]'}`}>
                            <Pill className={`w-6 h-6 ${status === 'taken' ? 'text-green-600' : status === 'skipped' ? 'text-red-600' : 'text-[#0284c7]'}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{medicine.name}</h3>
                            <p className="text-sm text-gray-500">{medicine.dosage} • {medicine.time}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {status === 'taken' ? (
                            <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                              <CheckCircle className="w-4 h-4" /> Taken
                            </span>
                          ) : status === 'skipped' ? (
                            <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                              <XCircle className="w-4 h-4" /> Skipped
                            </span>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleStatusUpdate(medicine.id, 'taken')}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                Take
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleStatusUpdate(medicine.id, 'skipped')}
                              >
                                Skip
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/ai-assistant"
            className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-5 text-white hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">AI Health Assistant</h3>
                <p className="text-sm text-purple-100">Get health tips and medicine info</p>
              </div>
            </div>
          </Link>

          <Link
            href="/emergency"
            className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-5 text-white hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Emergency Services</h3>
                <p className="text-sm text-red-100">Quick access to emergency help</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}

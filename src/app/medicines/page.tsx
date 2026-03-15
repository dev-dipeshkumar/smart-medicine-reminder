'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Plus,
  Pill,
  Clock,
  Calendar,
  Edit2,
  Trash2,
  AlertCircle,
  Search,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  time: string;
  frequency: string;
  startDate: string;
  endDate?: string;
}

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await api.get('/medicines');
      setMedicines(response.data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/medicines/${id}`);
      setMedicines(medicines.filter(m => m.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting medicine:', error);
    }
  };

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Medicines</h1>
            <p className="text-gray-500 mt-1">Manage your medications</p>
          </div>
          <Link href="/medicines/add">
            <Button className="bg-[#0284c7] hover:bg-[#0369a1]">
              <Plus className="w-5 h-5 mr-2" />
              Add Medicine
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12"
          />
        </div>

        {/* Medicines Grid */}
        {medicines.length === 0 ? (
          <Card className="border-gray-100">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-[#e0f2fe] rounded-full flex items-center justify-center mx-auto mb-4">
                <Pill className="w-10 h-10 text-[#0284c7]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No medicines yet</h3>
              <p className="text-gray-500 mb-6">Add your first medicine to start tracking</p>
              <Link href="/medicines/add">
                <Button className="bg-[#0284c7] hover:bg-[#0369a1]">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Medicine
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : filteredMedicines.length === 0 ? (
          <Card className="border-gray-100">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700">No medicines found</h3>
              <p className="text-gray-500">Try adjusting your search</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMedicines.map((medicine) => (
              <Card
                key={medicine.id}
                className="border-gray-100 hover:shadow-lg transition-all group"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-[#e0f2fe] rounded-xl flex items-center justify-center">
                      <Pill className="w-6 h-6 text-[#0284c7]" />
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => router.push(`/medicines/edit/${medicine.id}`)}
                        className="p-2 text-gray-400 hover:text-[#0284c7] hover:bg-[#e0f2fe] rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(medicine.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-800 text-lg mb-1">{medicine.name}</h3>
                  <p className="text-[#0284c7] font-medium mb-4">{medicine.dosage}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{medicine.time}</span>
                      <span className="px-2 py-0.5 bg-[#e0f2fe] text-[#0284c7] rounded-full text-xs">
                        {medicine.frequency}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{medicine.startDate}</span>
                      {medicine.endDate && (
                        <>
                          <ChevronRight className="w-3 h-3 text-gray-400" />
                          <span>{medicine.endDate}</span>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Medicine?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. All tracking history will also be deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}

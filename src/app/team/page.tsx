'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { useStore } from '@/store/useStore';
import { useToast } from '@/components/ui/Toast';
import { formatIndianPhone, cn } from '@/lib/utils';
import {
  UserCheck,
  Plus,
  Clock,
  Calendar,
  Phone,
  Scissors,
  Edit2,
  CheckCircle2,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Staff } from '@/types';
import Link from 'next/link';

export default function TeamPage() {
  const { staff, services, addStaff, updateStaff } = useStore();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('+91 98192 55005');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('19:30');

  const openAddModal = () => {
    setEditingStaff(null);
    setName('');
    setRole('Senior Stylist');
    setPhone('+91 98192 55005');
    setStartTime('10:00');
    setEndTime('19:30');
    setIsModalOpen(true);
  };

  const openEditModal = (st: Staff) => {
    setEditingStaff(st);
    setName(st.name);
    setRole(st.role);
    setPhone(st.phone);
    setStartTime(st.workingHours.start);
    setEndTime(st.workingHours.end);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingStaff) {
      updateStaff(editingStaff.id, {
        name,
        role,
        phone,
        workingHours: {
          start: startTime,
          end: endTime,
          days: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
      });
      toast({
        title: 'Staff Member Updated',
        description: `${name}'s schedule and role saved.`,
        type: 'success',
      });
    } else {
      addStaff({
        name,
        role,
        color: '#0f766e',
        serviceIds: ['srv-1', 'srv-2'],
        workingHours: {
          start: startTime,
          end: endTime,
          days: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        active: true,
        phone,
      });
      toast({
        title: 'Staff Member Added',
        description: `${name} has been added to your salon roster.`,
        type: 'success',
      });
    }

    setIsModalOpen(false);
  };

  return (
    <AppShell pageTitle="Team">
      <PageHeader
        title="Salon Team & Stylists"
        subtitle="Manage working hours, assigned specialties, and daily booking schedules."
        actions={
          <Button
            variant="primary"
            size="md"
            onClick={openAddModal}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Staff Member
          </Button>
        }
      />

      {/* Team Roster Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {staff.map((st) => (
          <Card key={st.id} className="p-5 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-white shadow-subtle"
                  style={{ backgroundColor: st.color }}
                >
                  {st.initials}
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  Active
                </span>
              </div>

              <div className="mt-3">
                <h3 className="text-base font-bold text-foreground">{st.name}</h3>
                <p className="text-xs text-muted-foreground">{st.role}</p>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span>{formatIndianPhone(st.phone)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>{st.workingHours.start} – {st.workingHours.end}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>{st.workingHours.days.join(', ')}</span>
                </div>
              </div>

              <div className="mt-4 p-2.5 rounded-apple bg-surface-muted/50 border border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Bookings Today:</span>
                <span className="font-bold text-foreground tabular-nums">
                  {st.appointmentsTodayCount} visits
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60 flex items-center justify-between">
              <Link
                href="/calendar"
                className="text-xs font-semibold text-primary hover:underline"
              >
                View Calendar →
              </Link>
              <Button variant="ghost" size="sm" onClick={() => openEditModal(st)} leftIcon={<Edit2 className="w-3.5 h-3.5" />}>
                Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add / Edit Staff Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="relative z-10 w-full max-w-md rounded-apple-2xl border border-border bg-surface p-6 shadow-floating space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-base font-bold text-foreground">
                  {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <Input
                  label="Staff Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g. Rohan Deshmukh"
                  required
                />

                <Input
                  label="Role / Title"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="E.g. Senior Colorist"
                  required
                />

                <Input
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98192 XXXXX"
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Shift Start"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                  <Input
                    label="Shift End"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>

                <div className="pt-3 border-t border-border flex justify-end gap-2.5">
                  <Button variant="secondary" size="md" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="md" type="submit">
                    {editingStaff ? 'Save Changes' : 'Add Staff'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}

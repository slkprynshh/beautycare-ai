'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { useStore } from '@/store/useStore';
import { useToast } from '@/components/ui/Toast';
import { formatINR } from '@/lib/utils';
import {
  Plus,
  Sparkles,
  Edit2,
  CheckCircle2,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Service } from '@/types';

export default function ServicesPage() {
  const { services, addService, updateService } = useStore();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Hair' | 'Face & Skin' | 'Hands & Feet' | 'Spa & Body' | 'Treatments'>('Hair');
  const [durationMinutes, setDurationMinutes] = useState('45');
  const [price, setPrice] = useState('850');
  const [typicalReturnDays, setTypicalReturnDays] = useState('30');
  const [reminderTemplate, setReminderTemplate] = useState('Hi {name}, your appointment with {staff} is confirmed for {time}.');

  const openAddModal = () => {
    setEditingService(null);
    setName('');
    setCategory('Hair');
    setDurationMinutes('45');
    setPrice('850');
    setTypicalReturnDays('30');
    setReminderTemplate('Hi {name}, your appointment with {staff} is confirmed for {time}.');
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setName(service.name);
    setCategory(service.category);
    setDurationMinutes(String(service.durationMinutes));
    setPrice(String(service.price));
    setTypicalReturnDays(String(service.typicalReturnDays));
    setReminderTemplate(service.reminderCopyTemplate);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingService) {
      updateService(editingService.id, {
        name,
        category,
        durationMinutes: Number(durationMinutes),
        price: Number(price),
        typicalReturnDays: Number(typicalReturnDays),
        reminderCopyTemplate: reminderTemplate,
      });
      toast({
        title: 'Service Updated',
        description: `${name} return cycle set to ${typicalReturnDays} days.`,
        type: 'success',
      });
    } else {
      addService({
        name,
        category,
        durationMinutes: Number(durationMinutes),
        price: Number(price),
        typicalReturnDays: Number(typicalReturnDays),
        active: true,
        staffIds: ['staff-1', 'staff-2'],
        reminderCopyTemplate: reminderTemplate,
      });
      toast({
        title: 'New Service Added',
        description: `${name} added to your salon catalog.`,
        type: 'success',
      });
    }

    setIsModalOpen(false);
  };

  return (
    <AppShell pageTitle="Services">
      <PageHeader
        title="Service Catalog & Return Cycles"
        subtitle="Define service pricing, durations, and return cycles for automated WhatsApp rebooking nudges."
        actions={
          <Button
            variant="primary"
            size="md"
            onClick={openAddModal}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add New Service
          </Button>
        }
      />

      {/* Return Interval Educational Banner */}
      <div className="mb-6 p-4 rounded-apple-xl bg-gradient-to-br from-teal-500/10 via-surface to-surface border border-primary/20 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-foreground block">
            How Return Cycles Power Automated Recovery:
          </span>
          <p className="text-muted-foreground mt-0.5 leading-relaxed">
            When a customer finishes a service (e.g. Balayage, 45 days), VertOps calculates their exact return date. Once that threshold approaches, our deterministic automation dispatches a polite WhatsApp reminder without you having to remember.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((srv) => (
          <Card key={srv.id} className="p-5 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-colors">
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {srv.category}
                </span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  {srv.bookingCount} bookings
                </span>
              </div>

              <h3 className="text-base font-bold text-foreground mt-2">{srv.name}</h3>

              <div className="grid grid-cols-2 gap-2 text-xs mt-3 pt-3 border-t border-border/60">
                <div>
                  <span className="text-[11px] text-muted-foreground block">Duration</span>
                  <span className="font-semibold text-foreground">{srv.durationMinutes} mins</span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">Price</span>
                  <span className="font-bold text-foreground tabular-nums">{formatINR(srv.price)}</span>
                </div>
              </div>

              <div className="mt-3 p-2.5 rounded-apple bg-surface-muted/50 border border-border text-xs">
                <span className="text-[11px] text-muted-foreground block font-medium">Typical Return Cycle</span>
                <span className="font-bold text-foreground tabular-nums">
                  Every {srv.typicalReturnDays} days
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60 flex items-center justify-between">
              <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Auto-Nudge Active
              </span>
              <Button variant="ghost" size="sm" onClick={() => openEditModal(srv)} leftIcon={<Edit2 className="w-3.5 h-3.5" />}>
                Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add / Edit Service Modal */}
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
              className="relative z-10 w-full max-w-lg rounded-apple-2xl border border-border bg-surface p-6 shadow-floating space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-base font-bold text-foreground">
                  {editingService ? 'Edit Service' : 'Add New Salon Service'}
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
                  label="Service Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g. Express Keratin Treatment"
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <Select
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                  >
                    <option value="Hair">Hair</option>
                    <option value="Face & Skin">Face & Skin</option>
                    <option value="Hands & Feet">Hands & Feet</option>
                    <option value="Spa & Body">Spa & Body</option>
                    <option value="Treatments">Treatments</option>
                  </Select>

                  <Input
                    label="Duration (Minutes)"
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Price in INR (₹)"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                  <Input
                    label="Typical Return Interval (Days)"
                    type="number"
                    value={typicalReturnDays}
                    onChange={(e) => setTypicalReturnDays(e.target.value)}
                    helperText="Days before auto WhatsApp nudge"
                    required
                  />
                </div>

                <Textarea
                  label="WhatsApp Reminder Message Template"
                  value={reminderTemplate}
                  onChange={(e) => setReminderTemplate(e.target.value)}
                  rows={2}
                />

                <div className="pt-3 border-t border-border flex justify-end gap-2.5">
                  <Button variant="secondary" size="md" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="md" type="submit">
                    {editingService ? 'Save Changes' : 'Create Service'}
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

'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { PageEntrance, StatCard } from '@/components/design-system';
import {
  UserCircle,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  CreditCard,
  BookOpen,
  Calendar,
  Edit3,
  Check,
  X,
  Shield,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════ */

interface Profile {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  studentProfile?: {
    studentId: string;
    name: string;
    semester: number | null;
    phone: string | null;
    avatar: string | null;
    department: { name: string; code: string } | null;
    program: { name: string; code: string } | null;
    membership?: {
      membershipNumber: string;
      issueDate: string;
      expiryDate: string;
      status: string;
      borrowingLimit: number;
    } | null;
  } | null;
  facultyProfile?: {
    employeeId: string;
    designation: string | null;
    department: { name: string; code: string } | null;
  } | null;
}

export function ProfileClient({
  profile,
  activeBorrowCount,
}: {
  profile: Profile;
  activeBorrowCount: number;
}) {
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneValue, setPhoneValue] = useState(profile.studentProfile?.phone ?? '');
  const [saving, setSaving] = useState(false);

  const student = profile.studentProfile;
  const faculty = profile.facultyProfile;
  const isStudent = profile.role === 'STUDENT';
  const displayName = student?.name ?? faculty?.designation ?? profile.email;
  const initials = displayName.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  const handleSavePhone = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/dashboard/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneValue }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Phone number updated');
        setEditingPhone(false);
      } else {
        toast.error('Failed to update');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const membership = student?.membership;

  return (
    <div className="space-y-8 max-w-3xl">
      <PageEntrance>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your library account and academic information</p>
        </div>
      </PageEntrance>

      {/* Profile Card */}
      <div className="rounded-2xl border border-border/60 bg-surface overflow-hidden">
        {/* Header with avatar area */}
        <div className="bg-gradient-navy px-6 py-8 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Avatar */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl font-bold text-navy-foreground">
              {initials}
            </div>
            <div className="text-navy-foreground">
              <h2 className="text-xl font-bold">{displayName}</h2>
              <p className="mt-1 text-sm text-navy-foreground/60">{profile.email}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium">
                  <Shield className="size-3" />
                  {profile.role}
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium">
                  {isStudent ? <GraduationCap className="size-3" /> : <Building2 className="size-3" />}
                  {isStudent
                    ? `Semester ${student?.semester ?? '—'}`
                    : faculty?.designation ?? 'Faculty'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Academic Info */}
            <div className="space-y-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Academic Information</h3>

              {isStudent && student ? (
                <>
                  <InfoRow icon={<CreditCard className="size-4" />} label="Student ID" value={student.studentId} />
                  <InfoRow icon={<GraduationCap className="size-4" />} label="Program" value={student.program?.name ?? '—'} />
                  <InfoRow icon={<Building2 className="size-4" />} label="Department" value={student.department?.name ?? '—'} />
                  <InfoRow icon={<GraduationCap className="size-4" />} label="Semester" value={String(student.semester ?? '—')} />
                </>
              ) : faculty ? (
                <>
                  <InfoRow icon={<CreditCard className="size-4" />} label="Employee ID" value={faculty.employeeId} />
                  <InfoRow icon={<Building2 className="size-3.5" />} label="Department" value={faculty.department?.name ?? '—'} />
                  <InfoRow icon={<UserCircle className="size-3.5" />} label="Designation" value={faculty.designation ?? '—'} />
                </>
              ) : null}
            </div>

            {/* Contact & Library */}
            <div className="space-y-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact & Library</h3>

              <InfoRow icon={<Mail className="size-4" />} label="Email" value={profile.email} />

              {/* Phone with edit */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-muted-foreground">
                  <Phone className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  {editingPhone ? (
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="tel"
                        value={phoneValue}
                        onChange={(e) => setPhoneValue(e.target.value)}
                        className="h-8 rounded-lg border border-border/70 bg-surface px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="+92-XXX-XXXXXXX"
                      />
                      <button
                        onClick={handleSavePhone}
                        disabled={saving}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors"
                      >
                        <Check className="size-4" />
                      </button>
                      <button
                        onClick={() => { setEditingPhone(false); setPhoneValue(student?.phone ?? ''); }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="mt-0.5 text-sm font-medium text-foreground">{student?.phone ?? 'Not set'}</p>
                      <button
                        onClick={() => setEditingPhone(true)}
                        className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors"
                      >
                        <Edit3 className="size-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {membership && (
                <>
                  <InfoRow
                    icon={<CreditCard className="size-4" />}
                    label="Library Card"
                    value={membership.membershipNumber}
                  />
                  <InfoRow
                    icon={<Calendar className="size-4" />}
                    label="Membership Expires"
                    value={formatDate(membership.expiryDate)}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Account Stats */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
        <StatCard
          icon={<BookOpen className="size-5" />}
          value={activeBorrowCount}
          label="Active Loans"
        />
        {membership && (
          <StatCard
            icon={<CreditCard className="size-5" />}
            value={`${activeBorrowCount}/${membership.borrowingLimit}`}
            label="Borrowing Limit"
          />
        )}
        <StatCard
          icon={<Calendar className="size-5" />}
          value={formatDate(profile.createdAt)}
          label="Member Since"
        />
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-muted-foreground">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
}

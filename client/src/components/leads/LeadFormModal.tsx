import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { LEAD_SOURCES, LEAD_STATUSES, type Lead } from '@/types/lead';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  status: z.enum(LEAD_STATUSES),
  source: z.enum(LEAD_SOURCES),
});

export type LeadFormValues = z.infer<typeof schema>;

interface LeadFormModalProps {
  open: boolean;
  initial?: Lead | null;
  submitting?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSubmit: (values: LeadFormValues) => Promise<void> | void;
}

const DEFAULTS: LeadFormValues = {
  name: '',
  email: '',
  status: 'New',
  source: 'Website',
};

export function LeadFormModal({
  open,
  initial,
  submitting,
  errorMessage,
  onClose,
  onSubmit,
}: LeadFormModalProps): JSX.Element {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULTS,
  });

  useEffect(() => {
    if (open) {
      reset(
        initial
          ? {
              name: initial.name,
              email: initial.email,
              status: initial.status,
              source: initial.source,
            }
          : DEFAULTS,
      );
    }
  }, [open, initial, reset]);

  const submit = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Edit lead' : 'New lead'}
      footer={
        <>
          <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" form="lead-form" className="btn-primary" disabled={submitting}>
            {submitting ? 'Saving…' : initial ? 'Save changes' : 'Create lead'}
          </button>
        </>
      }
    >
      <form id="lead-form" onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="lf-name">
            Name
          </label>
          <input id="lf-name" className="input" {...register('name')} />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="lf-email">
            Email
          </label>
          <input id="lf-email" type="email" className="input" {...register('email')} />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="lf-status">
              Status
            </label>
            <select id="lf-status" className="input" {...register('status')}>
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="lf-source">
              Source
            </label>
            <select id="lf-source" className="input" {...register('source')}>
              {LEAD_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {errorMessage && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200">
            {errorMessage}
          </p>
        )}
      </form>
    </Modal>
  );
}

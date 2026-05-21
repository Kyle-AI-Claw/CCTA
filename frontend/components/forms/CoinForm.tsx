import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Camera } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import type { CoinFormData, Coin } from '../../types';

export interface CoinFormProps {
  onSubmit: (data: CoinFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Coin;
}

const coinSchema = z.object({
  name: z.string().optional(),
  denomination: z.string().optional(),
  year: z.number().int().optional(),
  mintMark: z.string().optional(),
  country: z.string().optional(),
  metal: z.string().optional(),
  grade: z.string().optional(),
  purchasedDate: z.string().optional(),
  purchasePrice: z.number().optional(),
  notes: z.string().optional(),
  description: z.string().optional(),
});

export type CoinFormSchema = z.infer<typeof coinSchema>;

export function CoinForm({ onSubmit: onSubmitHandler, onCancel, initialData }: CoinFormProps) {
  const [images, setImages] = useState<{ front: File | null; back: File | null }>({
    front: initialData?.frontImage || null,
    back: initialData?.backImage || null,
  });
  const [preview, setPreview] = useState<{ front: string | null; back: string | null }>({
    front: initialData?.frontImage ? URL.createObjectURL(initialData.frontImage) : null,
    back: initialData?.backImage ? URL.createObjectURL(initialData.backImage) : null,
  });

  const form = useForm<CoinFormSchema>({
    resolver: zodResolver(coinSchema),
    defaultValues: {
      name: initialData?.name || '',
      denomination: initialData?.denomination || '',
      year: initialData?.year || undefined,
      mintMark: initialData?.mintMark || '',
      country: initialData?.country || '',
      metal: initialData?.metal || '',
      grade: initialData?.grade || '',
      purchasedDate: initialData?.purchasedDate || '',
      purchasePrice: initialData?.purchasePrice || undefined,
      notes: initialData?.notes || '',
      description: initialData?.description || '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      setImages({ ...images, [side]: file });
      setPreview({ ...preview, [side]: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (data: CoinFormSchema) => {
    const formData: CoinFormData = {
      name: data.name,
      denomination: data.denomination,
      year: data.year,
      mintMark: data.mintMark,
      country: data.country,
      metal: data.metal,
      grade: data.grade,
      purchasedDate: data.purchasedDate,
      purchasePrice: data.purchasePrice,
      notes: data.notes,
      description: data.description,
    };

    await onSubmitHandler(formData);
  };

  useEffect(() => {
    return () => {
      // Cleanup object URLs on unmount
      Object.values(preview).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, []);

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(form.getValues()); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input {...form.register('name')} placeholder="Coin name" />
          {form.formState.errors.name && <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="denomination">Denomination</Label>
          <Input {...form.register('denomination')} placeholder="e.g., $1, 10¢" />
          {form.formState.errors.denomination && <p className="text-red-500 text-sm">{form.formState.errors.denomination.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input type="number" {...form.register('year')} placeholder="2024" />
          {form.formState.errors.year && <p className="text-red-500 text-sm">{form.formState.errors.year.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mintMark">Mint Mark</Label>
          <Input {...form.register('mintMark')} placeholder="e.g., P, D, S" />
          {form.formState.errors.mintMark && <p className="text-red-500 text-sm">{form.formState.errors.mintMark.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input {...form.register('country')} placeholder="e.g., USA" />
          {form.formState.errors.country && <p className="text-red-500 text-sm">{form.formState.errors.country.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="metal">Metal</Label>
          <Input {...form.register('metal')} placeholder="e.g., Copper, Silver, Gold" />
          {form.formState.errors.metal && <p className="text-red-500 text-sm">{form.formState.errors.metal.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="grade">Grade</Label>
          <Input {...form.register('grade')} placeholder="e.g., MS-63, VF-35" />
          {form.formState.errors.grade && <p className="text-red-500 text-sm">{form.formState.errors.grade.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="purchasedDate">Purchased Date</Label>
          <Input type="date" {...form.register('purchasedDate')} />
          {form.formState.errors.purchasedDate && <p className="text-red-500 text-sm">{form.formState.errors.purchasedDate.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
          <Input type="number" step="0.01" {...form.register('purchasePrice')} placeholder="0.00" />
          {form.formState.errors.purchasePrice && <p className="text-red-500 text-sm">{form.formState.errors.purchasePrice.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea {...form.register('notes')} placeholder="Additional notes about this coin" rows={3} />
        {form.formState.errors.notes && <p className="text-red-500 text-sm">{form.formState.errors.notes.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea {...form.register('description')} placeholder="Detailed description" rows={4} />
        {form.formState.errors.description && <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>}
      </div>

      {/* Image Upload Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Front Image</Label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, 'front')}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100
            "
          />
          {preview.front && (
            <div className="mt-2">
              <img src={preview.front} alt="Front preview" className="max-w-full h-auto rounded-lg" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Back Image</Label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, 'back')}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100
            "
          />
          {preview.back && (
            <div className="mt-2">
              <img src={preview.back} alt="Back preview" className="max-w-full h-auto rounded-lg" />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Coin
        </Button>
      </div>
    </form>
  );
}

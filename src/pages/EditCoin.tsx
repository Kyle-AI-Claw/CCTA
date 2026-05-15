import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../hooks/useAuth';
import { useCoins } from '../hooks/useCoins';
import { CoinForm } from '../components/forms/CoinForm';
import type { Coin } from '../types';

export function EditCoin() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateCoin } = useCoins();
  const [coin, setCoin] = useState<Coin | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (id && user) {
      fetchCoinById(id);
    }
  }, [id, user]);

  const fetchCoinById = async (id: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/coins/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCoin(data.data || data);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error('Failed to fetch coin:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: CoinFormData) => {
    try {
      await updateCoin(id!, data);
    } catch (err) {
      console.error('Failed to update coin:', err);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading coin...</p>
        </div>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-destructive/10 border border-destructive/20">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive">Coin not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Collection
        </Button>
        <h1 className="text-3xl font-bold">Edit Coin</h1>
        <p className="text-muted-foreground mt-1">{coin.name || 'Unnamed Coin'}</p>
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CoinForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              initialData={coin}
            />
          </Card>
        </div>
      )}

      {/* View Coin (when not in modal) */}
      {!isModalOpen && (
        <div className="bg-muted/50 rounded-lg p-6 text-center">
          <p className="text-muted-foreground mb-4">To edit this coin, click the Edit button in the coin list</p>
          <Button onClick={() => setIsModalOpen(true)}>
            Open Edit Form
          </Button>
        </div>
      )}
    </div>
  );
}

interface CoinFormData {
  name?: string;
  denomination?: string;
  year?: number;
  mintMark?: string;
  country?: string;
  metal?: string;
  grade?: string;
  purchasedDate?: string;
  purchasePrice?: number;
  notes?: string;
  description?: string;
}

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Tag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../hooks/useAuth';
import { config } from '../config';
import type { Coin } from '../types';

export function CoinDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [coin, setCoin] = useState<Coin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCoinDetails(id);
    }
  }, [id]);

  const fetchCoinDetails = async (coinId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiUrl}/coins/${coinId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch coin details');
      }

      const data = await response.json();
      setCoin(data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch coin details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (coin) {
      navigate(`/coins/edit/${coin.id}`);
    }
  };

  const handleDelete = async () => {
    if (!coin) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiUrl}/coins/${coin.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to delete coin');
      }

      // Navigate back to coins list
      navigate(-1);
    } catch (err: any) {
      setError(err.message || 'Failed to delete coin');
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price?: number) => {
    if (!price) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading coin details...</p>
        </div>
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-destructive/10 border border-destructive/20">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive">{error || 'Coin not found'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user owns this coin
  const isOwner = user?.id === coin.userId;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Collection
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{coin.name || 'Unnamed Coin'}</h1>
            {coin.denomination && (
              <p className="text-muted-foreground text-lg">{coin.denomination}</p>
            )}
          </div>
          {isOwner && (
            <div className="flex gap-2">
              <Button onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-destructive">
              Are you sure you want to delete this coin? This action cannot be undone.
            </p>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleDelete} variant="destructive">
                Confirm Delete
              </Button>
              <Button onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Images</h2>
              <div className="space-y-4">
                {coin.frontImagePath && (
                  <div>
                    <img
                      src={`${config.apiUrl}/images/${coin.frontImagePath}`}
                      alt={coin.name || 'Coin'}
                      className="w-full rounded-lg border"
                    />
                    <p className="text-sm text-muted-foreground mt-2">Front</p>
                  </div>
                )}
                {coin.backImagePath && (
                  <div>
                    <img
                      src={`${config.apiUrl}/images/${coin.backImagePath}`}
                      alt={coin.name || 'Coin'}
                      className="w-full rounded-lg border"
                    />
                    <p className="text-sm text-muted-foreground mt-2">Back</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {coin.description && (
            <Card className="mt-8">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{coin.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {coin.notes && (
            <Card className="mt-8">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Notes</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{coin.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Year</p>
                  <p className="font-medium">{coin.year || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Denomination</p>
                  <p className="font-medium">{coin.denomination || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Country</p>
                  <p className="font-medium">{coin.country || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Metal</p>
                  <p className="font-medium">{coin.metal || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Grade</p>
                  <p className="font-medium">{coin.grade || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mint Mark</p>
                  <p className="font-medium">{coin.mintMark || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Info */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Financial Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Purchase Date</p>
                  <p className="font-medium">{formatDate(coin.purchasedDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Purchase Price</p>
                  <p className="font-medium text-lg">{formatPrice(coin.purchasePrice)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Value</p>
                  <p className="font-medium text-lg text-primary">
                    {!coin.purchasedDate || !coin.purchasePrice ? (
                      <span className="text-muted-foreground">N/A</span>
                    ) : (
                      formatPrice(coin.purchasePrice)
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Tags</h2>
                <Tag className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex flex-wrap gap-2">
                {coin.tags?.length > 0 ? (
                  coin.tags.map((tagItem) => (
                    <Badge key={tagItem.tag.id} variant="secondary">
                      {tagItem.tag.name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No tags assigned</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Collection Info */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Collection</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Added to Collection</p>
                  <p className="font-medium">{formatDate(coin.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Tags</p>
                  <p className="font-medium">{coin._count?.tags || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

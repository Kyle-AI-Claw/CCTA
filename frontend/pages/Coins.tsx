import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useCoins } from '../hooks/useCoins';
import { CoinCard } from '../components/CoinCard';
import { CoinForm } from '../components/forms/CoinForm';
import type { Coin } from '../types';

export function Coins() {
  const navigate = useNavigate();
  const { coins, loading, error, fetchCoins, createCoin } = useCoins();
  const [search, setSearch] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoin, setEditingCoin] = useState<Coin | null>(null);

  useEffect(() => {
    fetchCoins();
  }, []);

  useEffect(() => {
    fetchCoins({
      search,
      country: filterCountry || undefined,
      year: filterYear ? parseInt(filterYear) : undefined,
    });
  }, [search, filterCountry, filterYear]);

  const handleSubmit = async (data: any) => {
    try {
      await createCoin(data);
      setIsModalOpen(false);
      setEditingCoin(null);
      fetchCoins();
    } catch (err) {
      console.error('Failed to save coin:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this coin?')) {
      try {
        await deleteCoin(id);
        fetchCoins();
      } catch (err) {
        console.error('Failed to delete coin:', err);
      }
    }
  };

  const handleView = (coin: Coin) => {
    navigate(`/coins/detail/${coin.id}`);
  };

  const handleEdit = (coin: Coin) => {
    navigate(`/coins/edit/${coin.id}`);
  };

  const countries = Array.from(new Set(coins.filter(c => c.country).map(c => c.country)));
  const years = Array.from(new Set(coins.filter(c => c.year).map(c => c.year))).sort((a, b) => b - a);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Collection</h1>
          <p className="text-muted-foreground mt-1">
            {coins.length} coins in your collection
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Coin
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search coins..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Input
                placeholder="Filter by country..."
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Filter by year..."
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coin Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading coins...</p>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-6 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      ) : coins.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No coins in your collection yet</p>
          <p className="text-muted-foreground text-sm mt-2">
            Click "Add Coin" to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {coins.map((coin) => (
            <CoinCard
              key={coin.id}
              coin={coin}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="pt-6">
              <CoinForm
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsModalOpen(false);
                  setEditingCoin(null);
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

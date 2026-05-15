import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Coins, Globe, Calendar, PieChart } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { useAuth } from '../hooks/useAuth';
import { useCoins } from '../hooks/useCoins';

interface Coin {
  id: string;
  name?: string;
  denomination?: string;
  year?: number;
  mintMark?: string;
  country?: string;
  metal?: string;
  grade?: string;
  purchasePrice?: number;
}

export interface StatsData {
  totalCoins: number;
  byCountry: Record<string, number>;
  byYear: Record<string, number>;
  byMetal: Record<string, number>;
  byGrade: Record<string, number>;
  totalValue: number;
  updatedAt?: string;
}

export function Stats() {
  const { user } = useAuth();
  const { fetchCoins } = useCoins();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<StatsData>({
    totalCoins: 0,
    byCountry: {},
    byYear: {},
    byMetal: {},
    byGrade: {},
    totalValue: 0,
  });
  const [coins, setCoins] = useState<Coin[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const statsData = data.data || data;
        setStats({
          totalCoins: statsData.totalCoins || 0,
          byCountry: statsData.byCountry || {},
          byYear: statsData.byYear || {},
          byMetal: statsData.byMetal || {},
          byGrade: statsData.byGrade || {},
          totalValue: statsData.totalValue || 0,
        });
        
        // Get coins for chart data
        const coinsResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/coins?limit=500`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (coinsResponse.ok) {
          const coinsData = await coinsResponse.json();
          const coinsList = coinsData.data.coins || [];
          setCoins(coinsList);
          
          // Create chart data
          const yearCounts: Record<string, number> = {};
          coinsList.forEach((coin: Coin) => {
            if (coin.year) {
              const yearKey = coin.year.toString();
              yearCounts[yearKey] = (yearCounts[yearKey] || 0) + 1;
            }
          });
          
          const yearData = Object.entries(yearCounts)
            .sort(([, a], [, b]) => parseInt(a) - parseInt(b))
            .map(([year, count]: [string, number]) => ({ year, count }))
            .sort((a, b) => parseInt(b.year) - parseInt(a.year));
          
          setChartData(yearData);
        }
        
        const totalValue = coinsList.reduce((sum: number, coin: Coin) => {
          return sum + (coin.purchasePrice || 0);
        }, 0);
        
        setStats({
          ...statsData,
          totalValue,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  const formatPrice = (price?: number) => {
    if (!price) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-destructive/10 border border-destructive/20">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sortedYears = Object.keys(stats.byYear).map(Number).sort((a, b) => b - a);
  const decadeCounts: Record<string, number> = {};
  const decadeYears: Record<string, any[]> = {};

  // Group years by decade for charts
  sortedYears.forEach((year) => {
    const decade = Math.floor(year / 10) * 10;
    decadeCounts[decade.toString()] = (decadeCounts[decade.toString()] || 0) + (stats.byYear[year.toString()] || 0);
    if (!decadeYears[decade.toString()]) {
      decadeYears[decade.toString()] = [];
    }
    decadeYears[decade.toString()].push({ year, count: stats.byYear[year.toString()] || 0 });
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Collection Statistics</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your coin collection
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Coins</p>
                <p className="text-3xl font-bold text-primary">{stats.totalCoins}</p>
              </div>
              <Coins className="h-12 w-12 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Countries</p>
                <p className="text-3xl font-bold text-primary">
                  {Object.keys(stats.byCountry).length}
                </p>
              </div>
              <Globe className="h-12 w-12 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Metal Types</p>
                <p className="text-3xl font-bold text-primary">
                  {Object.keys(stats.byMetal).length}
                </p>
              </div>
              <PieChart className="h-12 w-12 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(stats.totalValue)}
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-primary/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Country Distribution */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Coins by Country</h2>
            {Object.keys(stats.byCountry).length === 0 ? (
              <p className="text-muted-foreground">No countries recorded yet</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(stats.byCountry)
                  .sort(([, a], [, b]) => b - a)
                  .map(([country, count]: [string, number]) => (
                    <div key={country} className="flex items-center justify-between">
                      <span className="text-sm">{country}</span>
                      <span className="text-sm font-medium">{count} coins</span>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Year Distribution */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Coins by Year</h2>
            {sortedYears.length === 0 ? (
              <p className="text-muted-foreground">No years recorded yet</p>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Oldest: {sortedYears[0]}</span>
                  <span>Newest: {sortedYears[sortedYears.length - 1]}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Decade Count</span>
                  <span className="font-medium">
                    {Object.entries(decadeCounts)
                      .sort(([, a], [, b]) => b - a)
                      .map(([decade, count]: [string, number]) => `${decade}s: ${count}`).join(' | ')}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Metal Distribution */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Coins by Metal</h2>
            {Object.keys(stats.byMetal).length === 0 ? (
              <p className="text-muted-foreground">No metals recorded yet</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(stats.byMetal)
                  .sort(([, a], [, b]) => b - a)
                  .map(([metal, count]: [string, number]) => (
                    <div key={metal} className="flex items-center justify-between">
                      <span className="text-sm">{metal}</span>
                      <span className="text-sm font-medium">{count} coins</span>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Coins by Grade</h2>
            {Object.keys(stats.byGrade).length === 0 ? (
              <p className="text-muted-foreground">No grades recorded yet</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(stats.byGrade)
                  .sort(([, a], [, b]) => b - a)
                  .map(([grade, count]: [string, number]) => (
                    <div key={grade} className="flex items-center justify-between">
                      <span className="text-sm">{grade}</span>
                      <span className="text-sm font-medium">{count} coins</span>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Additions */}
      <Card className="mt-8">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Recent Additions</h2>
          {coins.length === 0 ? (
            <p className="text-muted-foreground">No coins in collection</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {coins.slice(0, 8).map((coin) => (
                <div key={coin.id} className="border rounded-lg p-3">
                  <p className="font-medium text-sm truncate">{coin.name || 'Unnamed Coin'}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {coin.denomination || coin.year?.toString() || 'No details'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

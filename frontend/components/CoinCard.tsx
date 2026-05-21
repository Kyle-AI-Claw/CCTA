import { useState } from 'react';
import { MoreHorizontal, Trash2, Edit as EditIcon, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import type { Coin } from '../types';

interface CoinCardProps {
  coin: Coin;
  onEdit: (coin: Coin) => void;
  onDelete: (id: string) => void;
  onView?: (coin: Coin) => void;
}

export function CoinCard({ coin, onEdit, onDelete, onView }: CoinCardProps) {
  const [showActions, setShowActions] = useState(false);

  formatDate = (date?: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {coin.frontImagePath ? (
          <img
            src={`${import.meta.env.VITE_.VITE_API_URL || 'http://localhost:3000'}/api/images/${coin.frontImagePath}`}
            alt={coin.name || 'Coin'}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageIcon className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setShowActions(!showActions)}
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg">{coin.name || 'Unnamed Coin'}</h3>
        {coin.denomination && (
          <p className="text-sm text-muted-foreground">{coin.denomination}</p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
        {coin.year && (
          <Badge variant="secondary">Year {coin.year}</Badge>
        )}
        {coin.country && (
          <Badge variant="secondary">{coin.country}</Badge>
        )}
        {coin.metal && (
          <Badge variant="secondary">{coin.metal}</Badge>
        )}
        {coin.grade && (
          <Badge variant="secondary">{coin.grade}</Badge>
        )}
      </CardFooter>

      {/* Actions Dropdown */}
      {showActions && (
        <div className="absolute top-12 right-2 z-10">
          <div className="flex flex-col gap-2 bg-popover p-2 rounded-md shadow-lg">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onView?.(coin);
                setShowActions(false);
              }}
              className="w-full justify-start"
            >
              <EyeIcon className="mr-2 h-4 w-4" />
              View
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onEdit(coin);
                setShowActions(false);
              }}
              className="w-full justify-start"
            >
              <EditIcon className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
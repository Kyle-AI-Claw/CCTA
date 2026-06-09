import { useState, useEffect } from 'react';
import { Shield, Tag, Plus, Trash2, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../hooks/useAuth';
import { config } from '../config';
import type { Tag as TagType } from '../types';

export function TagManager() {
  const { user } = useAuth();
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTagName, setNewTagName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTags();
    }
  }, [user]);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${config.apiUrl}/tags`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTags(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch tags:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${config.apiUrl}/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newTagName.trim(),
        }),
      });

      if (response.ok) {
        const newTag = await response.json();
        setTags(prev => [...prev, newTag.data]);
        setNewTagName('');
        setIsAdding(false);
        fetchTags();
      }
    } catch (err) {
      console.error('Failed to create tag:', err);
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (!window.confirm('Delete this tag?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      await fetch(`${config.apiUrl}/tags/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTags(prev => prev.filter(tag => tag.id !== id));
      fetchTags();
    } catch (err) {
      console.error('Failed to delete tag:', err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Loading tags...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tag Manager</h1>
        <p className="text-muted-foreground mt-1">
          Organize your coins with tags
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="tagName">Tag Name</Label>
              <Input
                id="tagName"
                placeholder="e.g., Proof, BU, Early Release"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              />
            </div>
            <Button onClick={handleAddTag} disabled={!newTagName.trim()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Tag
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tags.map((tag) => (
          <Card key={tag.id}>
            <CardContent className="pt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  <Tag className="mr-2 h-4 w-4" />
                  {tag.name}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteTag(tag.id)}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {tags.length === 0 && (
        <Card className="mt-8">
          <CardContent className="pt-6 text-center text-muted-foreground">
            <Shield className="mx-auto h-12 w-12 mb-4 opacity-20" />
            <p>No tags yet</p>
            <p className="text-sm mt-2">
              Add tags to organize your coin collection
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

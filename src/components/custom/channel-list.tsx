'use client';

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ChannelCard } from "./channel-card"
import { categories } from "@/data/categories"
import { useState, useEffect } from "react"
import { Menu, Star } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Channel {
  id: string;
  name: string;
  url: string;
  logo: string;
}

export function ChannelList() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [playingChannel, setPlayingChannel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Channel[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('favoriteChannels');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favoriteChannels', JSON.stringify(favorites));
  }, [favorites]);

  // Fetch channels
  useEffect(() => {
    const fetchChannels = async () => {
      const category = categories.find(c => c.id === selectedCategory);
      if (category) {
        const response = await fetch(category.url);
        const data = await response.text();
        const lines = data.split('\n');
        const parsedChannels: Channel[] = [];
        
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('#EXTINF')) {
            const logoMatch = lines[i].match(/tvg-logo="([^"]*)"/)
            const logo = logoMatch ? logoMatch[1] : '';
            const name = lines[i].split(',')[1] || '';
            const url = lines[i + 1] || '';
            if (name && url) {
              parsedChannels.push({ 
                id: `${selectedCategory}-${i}`,
                name, 
                url,
                logo 
              });
            }
          }
        }
        setChannels(parsedChannels);
      }
    };

    fetchChannels();
  }, [selectedCategory]);

  const toggleFavorite = (channel: Channel) => {
    setFavorites(prev => {
      const isFavorite = prev.some(fav => fav.id === channel.id);
      if (isFavorite) {
        return prev.filter(fav => fav.id !== channel.id);
      }
      return [...prev, channel];
    });
  };

  const filteredChannels = channels.filter(channel =>
    channel.name?.toLowerCase().includes(searchQuery?.toLowerCase() || '')
  );

  const filteredFavorites = favorites.filter(channel =>
    channel.name?.toLowerCase().includes(searchQuery?.toLowerCase() || '')
  );
// After existing filteredFavorites definition, add:
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex">
    {/* Mobile Hamburger Button */}
    <div className="p-2 md:hidden">
      <button onClick={() => setIsSidebarOpen(prev => !prev)} className="p-2 border rounded">
        <Menu className="h-6 w-6" />
      </button>
    </div>
    {/* Sidebar */}
    <div className={`flex flex-col w-64 border-r h-screen ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setSelectedCategory('favorites')}
            >
              <Star className="h-4 w-4 mr-2" />
              Favoritos ({favorites.length})
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <Input
          type="text"
          placeholder="Buscar canales..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm mb-4"
        />

        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {selectedCategory === 'favorites' 
              ? filteredFavorites.map((channel) => (
                  <ChannelCard
                    key={channel.id}
                    {...channel}
                    playingChannel={playingChannel}
                    setPlayingChannel={setPlayingChannel}
                    isFavorite={true}
                    onToggleFavorite={toggleFavorite}
                  />
                ))
              : filteredChannels.map((channel) => (
                  <ChannelCard
                    key={channel.id}
                    {...channel}
                    playingChannel={playingChannel}
                    setPlayingChannel={setPlayingChannel}
                    isFavorite={favorites.some(fav => fav.id === channel.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))
            }
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
'use client';

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ChannelCard } from "./channel-card"
import { categories } from "@/data/categories"
import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { Input } from "@/components/ui/input"

export function ChannelList() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [channels, setChannels] = useState<any[]>([]);
  const [playingChannel, setPlayingChannel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    const fetchChannels = async () => {
      const category = categories.find(c => c.id === selectedCategory);
      if (category) {
        const response = await fetch(category.url);
        const data = await response.text();
        const lines = data.split('\n');
        const parsedChannels = [];
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('#EXTINF')) {

              const logoMatch = lines[i].match(/tvg-logo="([^"]*)"/)
              const logo = logoMatch ? logoMatch[1] : '';
              
              const name = lines[i].split(',')[1];
              const url = lines[i + 1];
              parsedChannels.push({ 
                  name, 
                  url,
                  logo 
              });
          }
      }
        setChannels(parsedChannels);
      }
    };

    fetchChannels();
  }, [selectedCategory]);

  return (
    <div className="flex">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex flex-col w-64 border-r h-screen">
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
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

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="outline" size="icon" className="ml-2 mt-2">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <ScrollArea className="h-full">
            <div className="space-y-1 p-2">
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
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Buscar canales..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <ScrollArea className="h-[calc(100vh-6rem)]"> {/* Adjusted height to account for search bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {channels
              .filter(channel =>
                channel.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((channel, index) => (
                <ChannelCard
                  key={channel.id || index}
                  id={channel.id || index.toString()}
                  name={channel.name}
                  url={channel.url}
                  logo={channel.logo}
                  playingChannel={playingChannel}
                  setPlayingChannel={setPlayingChannel}
                />
              ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
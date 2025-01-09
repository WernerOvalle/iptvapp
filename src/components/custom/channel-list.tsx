'use client';

import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChannelCard } from "./channel-card"
import { categories } from "@/data/categories"
import { useState, useEffect } from "react"

export function ChannelList() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [channels, setChannels] = useState<any[]>([]);

  useEffect(() => {
    const fetchChannels = async () => {
      const category = categories.find(c => c.id === selectedCategory);
      if (category) {
        const response = await fetch(category.url);
        const data = await response.text();
        // Parse m3u8 playlist and extract channels
        // This is a simplified version
        const lines = data.split('\n');
        const parsedChannels = [];
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('#EXTINF')) {
            const name = lines[i].split(',')[1];
            const url = lines[i + 1];
            parsedChannels.push({ name, url });
          }
        }
        setChannels(parsedChannels);
      }
    };

    fetchChannels();
  }, [selectedCategory]);

  return (
    <Tabs defaultValue={categories[0].id} onValueChange={setSelectedCategory}>
      <TabsList className="grid grid-cols-7 w-full">
        {categories.map((category) => (
          <TabsTrigger key={category.id} value={category.id}>
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {categories.map((category) => (
        <TabsContent key={category.id} value={category.id}>
          <ScrollArea className="h-[calc(100vh-8rem)] w-full px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {channels.map((channel, index) => (
                <ChannelCard
                  key={index}
                  name={channel.name}
                  url={channel.url}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  )
}
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
    <Tabs defaultValue={categories[0].id} onValueChange={setSelectedCategory} className="w-full max-w-[1200px] mx-auto px-4">
    <div className="flex justify-center w-full">
      <TabsList className="flex overflow-x-auto gap-2 max-w-full mb-4 justify-center">
        {categories.map((category) => (
          <TabsTrigger 
            key={category.id} 
            value={category.id}
            className="whitespace-nowrap flex-shrink-0"
          >
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>{categories.map((category) => (
        <TabsContent 
          key={category.id} 
          value={category.id}
          className="w-full"
        >
          <ScrollArea className="h-[calc(100vh-8rem)] w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
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
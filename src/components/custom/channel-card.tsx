'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { VideoPlayer } from "./video-player"

interface ChannelCardProps {
  name: string;
  url: string;
}

export function ChannelCard({ name, url }: ChannelCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        {isPlaying ? (
          <div className="aspect-video">
            <VideoPlayer src={url} />
          </div>
        ) : (
          <Button 
            onClick={() => setIsPlaying(true)}
            className="w-full"
          >
            Ver Ahora
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
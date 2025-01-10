'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VideoPlayer } from "./video-player"

interface ChannelCardProps {
  id: string;
  name: string;
  url: string;
  playingChannel: string | null;
  setPlayingChannel: (id: string | null) => void;
}

export function ChannelCard({ id, name, url, playingChannel, setPlayingChannel }: ChannelCardProps) {
  const isPlaying = playingChannel === id;

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
            onClick={() => setPlayingChannel(id)}
            className="w-full"
          >
            Ver Ahora
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
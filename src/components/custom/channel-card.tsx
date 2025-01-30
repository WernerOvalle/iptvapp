// src/components/custom/channel-card.tsx
import { Star } from 'lucide-react' // Add this import
import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VideoPlayer } from "./video-player"

interface ChannelCardProps {
  id: string;
  name: string;
  url: string;
  logo: string;
  playingChannel: string | null;
  setPlayingChannel: (id: string | null) => void;
  isFavorite: boolean;
  onToggleFavorite: (channel: { id: string; name: string; url: string; logo: string }) => void;
}

export function ChannelCard({ 
  id, 
  name, 
  url, 
  logo, 
  playingChannel, 
  setPlayingChannel,
  isFavorite,
  onToggleFavorite 
}: ChannelCardProps) {
  const isPlaying = playingChannel === id;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="w-16 h-16 relative">
          {logo ? (
            <Image
              src={logo}
              alt={name}
              fill
              className="object-contain"
              sizes="(max-width: 64px) 100vw, 64px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md">
              <span className="text-gray-400 text-sm">No Logo</span>
            </div>
          )}
        </div>
        <div className="flex flex-1 items-center justify-between">
          <CardTitle className="text-lg">{name}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleFavorite({ id, name, url, logo })}
            className={isFavorite ? "text-yellow-500" : "text-gray-400"}
          >
            <Star className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isPlaying ? (
          <div className="aspect-video">
            <VideoPlayer src={url} />
          </div>
        ) : (
          <Button
            className="w-full"
            onClick={() => setPlayingChannel(id)}
          >
            Ver Ahora
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
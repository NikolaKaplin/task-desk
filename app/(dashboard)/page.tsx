import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ImageIcon, Video } from "lucide-react";
import { getPosts, getUserInfo, getUserInfoById } from "../actions";

type ContentBlock = {
  type: "text" | "image";
  content: string;
};

type Post = {
  id: number;
  name: string;
  authorId: number;
  content: string;
  createdAt: Date;
};

export default async function Home() {
  const posts: Post = await getPosts();
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-400">Altergemu Hub</h1>
          <Link href="/post">
            <Button className="bg-green-500 hover:bg-green-600 text-white">
              Создать пост
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold text-green-400 mb-6">
            Посты команды
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function NewsCard({ title, description, category }) {
  return (
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <CardTitle className="text-green-400">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300">{description}</p>
      </CardContent>
      <CardFooter>
        <Badge variant="secondary" className="bg-green-600 text-white">
          {category}
        </Badge>
      </CardFooter>
    </Card>
  );
}

async function PostCard({ id, title, author, createdAt, content, video }: Post) {
  const authorInfo = await getUserInfoById(author)
  const jsonContent = JSON.parse(content)
  const firstImageBlock = jsonContent.contentBlocks.find((block) => block.type === "image");
  const excerpt =
  jsonContent.description.slice(0, 100) + "...";

  return (
    <Card className="bg-gray-800 border-gray-700 text-white overflow-hidden">
      <div className="relative h-48">
        {firstImageBlock ? (
          <img
            src={firstImageBlock.content || "/placeholder.svg"}
            alt={title}
            layout="fill"
            objectFit="cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-700">
            <ImageIcon className="w-12 h-12 text-gray-500" />
          </div>
        )}
      </div>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={authorInfo.avatar} alt={authorInfo.firstName} />
            <AvatarFallback>{authorInfo.firstName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-green-400">{title}</CardTitle>
            <p className="text-sm text-gray-400">
              {authorInfo.firstName} • {createdAt.toDateString()}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300">{excerpt}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Link
          href={`/post/${id}`}
          className="text-green-400 hover:text-green-300 transition-colors"
        >
          Читать далее
        </Link>
        <div className="flex space-x-2">
          {firstImageBlock && <ImageIcon className="w-5 h-5 text-gray-400" />}
          {video && <Video className="w-5 h-5 text-gray-400" />}
        </div>
      </CardFooter>
    </Card>
  );
}



const posts: Post[] = [
  {
    id: 1,
    title: "Оптимизация производительности React-приложений",
    author: {
      name: "Анна Иванова",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "10 мая 2023",
    contentBlocks: [
      {
        type: "text",
        content:
          "В этой статье мы рассмотрим несколько эффективных способов оптимизации производительности React-приложений.",
      },
      {
        type: "image",
        content:
          "https://avatars.mds.yandex.net/get-kinopoisk-image/6201401/62e9b64b-b59f-4dea-b27e-4d3fe0fd76b4/600x900",
      },
      {
        type: "text",
        content:
          "Мы обсудим использование React.memo, useCallback и useMemo для предотвращения ненужных ререндеров.",
      },
      {
        type: "image",
        content:
          "https://pic.rutube.ru/video/ee/6a/ee6aed915edb4bcdc18ec72d52584fd7.jpg",
      },
    ],
    video: "/placeholder.mp4",
  },
  {
    id: 2,
    title: "Введение в GraphQL",
    author: {
      name: "Петр Сидоров",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "5 мая 2023",
    contentBlocks: [
      {
        type: "text",
        content:
          "GraphQL - это мощный язык запросов для API. Давайте разберемся, почему он становится все более популярным.",
      },
      {
        type: "image",
        content:
          "https://pic.rutube.ru/video/ee/6a/ee6aed915edb4bcdc18ec72d52584fd7.jpg",
      },
    ],
  },
  {
    id: 3,
    title: "Микросервисы на Go",
    author: {
      name: "Мария Петрова",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "1 мая 2023",
    contentBlocks: [
      {
        type: "text",
        content:
          "Go становится все более популярным для построения микросервисных архитектур. Рассмотрим основные преимущества.",
      },
      {
        type: "image",
        content:
          "https://avatars.mds.yandex.net/get-kinopoisk-image/1600647/886786c0-c93a-4034-b8a8-a7300fe97250/600x900",
      },
    ],
  },
];

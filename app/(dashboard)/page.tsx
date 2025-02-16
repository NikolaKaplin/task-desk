import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ImageIcon, Plus, Video } from "lucide-react";
import { getPosts, getUserInfoById } from "../actions";

type Post = {
  id: number;
  title: string;
  name: string;
  authorId: number;
  content: string;
  createdAt: Date;
  video: string;
  postStatus: string;
};

export default async function Home() {
  const posts: Post[] = (await getPosts()).filter(
    (post) => post.postStatus === "APPROVED"
  );

  return (
    <div className="min-h-screen text-white">
      <div className="fixed bottom-8 right-8 lg:hidden z-50">
        <Link href="/post">
          <Button className="bg-gray-800 hover:bg-transparent text-white h-[80px] w-[80px] rounded-full shadow-lg flex items-center justify-center">
            <img
              src="https://img.icons8.com/?size=96&id=A0MYENUyCEId&format=png"
              alt=""
              className="min-w-[80px] min-h-[80px]"
            />
          </Button>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CreatePostCard />
            {posts.map((post) => (
              <PostCard
                title={post.name}
                authorId={post.authorId}
                video={JSON.parse(post.content).video}
                key={post.id}
                {...post}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function CreatePostCard() {
  return (
    <Link href="/post" className="hidden lg:block">
      <Card className="bg-gray-800 border-gray-700 text-white overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:border-indigo-400 group">
        <div className="relative h-[23vh] bg-gray-700 flex items-center justify-center">
          <div className="m-5 absolute inset-0 border-2 border-dashed border-green-400 rounded-2xl group-hover:border-indigo-400 transition-colors duration-300"></div>
          <Plus className="w-16 h-16 text-green-400 group-hover:text-indigo-400 transition-colors duration-300" />
        </div>
        <CardContent className="p-4 flex flex-col justify-between h-[calc(100%-23vh)]">
          <h3 className="text-xl font-semibold text-green-400 group-hover:text-indigo-400 transition-colors duration-300 mb-2">
            Создать новый пост
          </h3>
          <p className="text-gray-400 flex-grow">
            Поделитесь своими мыслями и идеями с сообществом, чтобы мы могли
            вдохновиться вашими инновационными подходами и вместе создать что-то
            действительно уникальное и полезное для всех.
          </p>
          <div className="mt-4 text-green-400 group-hover:text-indigo-400 transition-colors duration-300">
            Нажмите, чтобы начать
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

async function PostCard({
  id,
  title,
  authorId,
  createdAt,
  content,
  video,
  postStatus,
}: Post) {
  const authorInfo = await getUserInfoById(authorId);
  const jsonContent = JSON.parse(content);
  const firstImageBlock = jsonContent.contentBlocks.find(
    (block) => block.type === "image"
  );
  const excerpt = jsonContent.description.slice(0, 100) + "...";

  return (
    <Card className="bg-gray-800 border-gray-700 text-white overflow-hidden relative">
      <div className="relative h-56">
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
          {video !== null ? <Video className="w-5 h-5 text-gray-400" /> : null}
        </div>
      </CardFooter>
    </Card>
  );
}

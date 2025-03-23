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
import { ImageIcon, Plus, Video, Edit } from "lucide-react";
import { getPosts, getUserInfoById } from "../../actions";
import { getUserSession } from "@/lib/get-session-server";

type Post = {
  id: number;
  name: string;
  authorId: number;
  content: string;
  createdAt: Date;
  postStatus: string;
};

interface EditorJSBlock {
  id: string;
  type: string;
  data: any;
}

export default async function Home() {
  const posts: Post[] = (await getPosts()).filter(
    (post) => post.postStatus === "RN"
  );

  const currentUser = await getUserSession();

  return (
    <div className="min-h-screen text-white">
      <div className="fixed bottom-8 right-8 lg:hidden z-50">
        <Link href="/post">
          <Button className=" text-white h-[80px] w-[80px] rounded-full shadow-lg flex items-center justify-center">
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
            {posts.map((post) => (
              <PostCard key={post.id} post={post} currentUser={currentUser} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

async function PostCard({
  post,
  currentUser,
}: {
  post: Post;
  currentUser: any;
}) {
  const { id, name, authorId, createdAt, content } = post;
  const authorInfo = await getUserInfoById(authorId);

  const parsedContent = JSON.parse(content);

  const description = parsedContent.description || "";
  const excerpt =
    description.length > 100 ? description.slice(0, 100) + "..." : description;

  const hasVideo =
    parsedContent.video !== null && parsedContent.video !== undefined;

  let firstImage = null;
  if (parsedContent.content && parsedContent.content.blocks) {
    const imageBlock = parsedContent.content.blocks.find(
      (block: EditorJSBlock) => block.type === "image"
    );

    if (imageBlock) {
      firstImage = imageBlock.data.file?.url || imageBlock.data.url;
    }
  } else if (parsedContent.contentBlocks) {
    const imageBlock = parsedContent.contentBlocks.find(
      (block: any) => block.type === "image"
    );

    if (imageBlock) {
      firstImage = imageBlock.content;
    }
  }

  const canEdit =
    currentUser &&
    (currentUser.id === authorId || currentUser.role === "ADMIN");

  return (
    <Card className="bg-gray-800 border-gray-700 text-white overflow-hidden relative">
      <div className="relative h-56">
        {firstImage ? (
          <img
            src={firstImage || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-700">
            <ImageIcon className="w-12 h-12 text-gray-500" />
          </div>
        )}

        {canEdit && (
          <Link
            href={`/post/edit/${id}`}
            className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 p-2 rounded-full hover:bg-opacity-100 transition-all"
          >
            <Edit className="w-5 h-5 text-green-400" />
          </Link>
        )}
      </div>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={authorInfo.avatar} alt={authorInfo.firstName} />
            <AvatarFallback>{authorInfo.firstName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-green-400">{name}</CardTitle>
            <p className="text-sm text-gray-400">
              {authorInfo.firstName} •{" "}
              {new Date(createdAt).toLocaleDateString()}
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
          {firstImage && <ImageIcon className="w-5 h-5 text-gray-400" />}
          {hasVideo && <Video className="w-5 h-5 text-gray-400" />}
        </div>
      </CardFooter>
    </Card>
  );
}

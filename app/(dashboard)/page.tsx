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
import { getPosts, getUserInfoById } from "../actions";
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

interface EditorJSContent {
  time: number;
  blocks: EditorJSBlock[];
  version: string;
}

export default async function Home() {
  const posts: Post[] = (await getPosts()).filter(
    (post) => post.postStatus === "APPROVED"
  );

  // Get current user for edit permission check
  const currentUser = await getUserSession();

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
              <PostCard key={post.id} post={post} currentUser={currentUser} />
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
  post,
  currentUser,
}: {
  post: Post;
  currentUser: any;
}) {
  const { id, name, authorId, createdAt, content } = post;
  const authorInfo = await getUserInfoById(authorId);

  // Parse the content JSON
  const parsedContent = JSON.parse(content);

  // Get description from the parsed content
  const description = parsedContent.description || "";
  const excerpt =
    description.length > 100 ? description.slice(0, 100) + "..." : description;

  // Check for video
  const hasVideo =
    parsedContent.video !== null && parsedContent.video !== undefined;

  // Find the first image in EditorJS blocks
  let firstImage = null;
  if (parsedContent.content && parsedContent.content.blocks) {
    // New EditorJS format
    const imageBlock = parsedContent.content.blocks.find(
      (block: EditorJSBlock) => block.type === "image"
    );

    if (imageBlock) {
      firstImage = imageBlock.data.file?.url || imageBlock.data.url;
    }
  } else if (parsedContent.contentBlocks) {
    // Legacy format for backward compatibility
    const imageBlock = parsedContent.contentBlocks.find(
      (block: any) => block.type === "image"
    );

    if (imageBlock) {
      firstImage = imageBlock.content;
    }
  }

  // Check if user can edit this post (author or admin)
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

        {/* Edit button for authors and admins */}
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

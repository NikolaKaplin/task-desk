"use client";

import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getPostById, getUserInfoById } from "@/app/actions";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

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

interface Post {
  name: string;
  description: string;
  author: string;
  authorId: number;
  createdAt: string;
  content: EditorJSContent;
  video?: string;
}

interface Author {
  firstName: string;
  lastName: string;
  avatar: string;
}

export default function PostPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const pathname = usePathname();
  const postId = pathname?.split("/").pop();
  const {toast} = useToast()
  useEffect(() => {
    async function fetchPost() {
      if (postId) {
        const fetchedPost = await getPostById(postId);
        if (fetchedPost) {
          const parsedPost = JSON.parse(fetchedPost.content);
          setPost(parsedPost);
          const authorData = await getUserInfoById(fetchedPost.authorId);
          setAuthor(authorData);
        }
      }
    }
    fetchPost();
  }, [postId]);

  if (!post || !author) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen  text-white py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-green-400 mb-4">
            {post.name}
          </h1>
          <p className="text-xl text-gray-300 mb-6">{post.description}</p>
          <div className="flex items-center">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={author.avatar}
                alt={`${author.firstName} ${author.lastName}`}
              />
              <AvatarFallback>
                {author.firstName[0]}
                {author.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <p className="text-lg font-medium text-gray-200">
                {author.firstName} {author.lastName}
              </p>
              <p className="text-sm text-gray-400">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                  locale: ru,
                })}
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-8">
          {/* Render EditorJS content */}
          {post.content &&
            post.content.blocks &&
            post.content.blocks.map((block, index) => (
              <RenderBlock key={block.id || index} block={block} />
            ))}

          {post.video && (
            <div className="mt-8 rounded-lg overflow-hidden">
              <video
                controls
                className="w-full h-full object-cover"
                style={{ aspectRatio: "16/9" }}
              >
                <source src={post.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

function RenderBlock({ block }: { block: EditorJSBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p
          className="text-gray-300 text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: block.data.text }}
        />
      );

    case "header":
      const HeaderTag = `h${block.data.level}` as keyof JSX.IntrinsicElements;
      return (
        <HeaderTag
          className={`font-bold text-gray-100 ${
            block.data.level === 2
              ? "text-3xl mt-8 mb-4"
              : block.data.level === 3
              ? "text-2xl mt-6 mb-3"
              : "text-xl mt-5 mb-2"
          }`}
        >
          {block.data.text}
        </HeaderTag>
      );

    case "list":
      const ListTag = block.data.style === "ordered" ? "ol" : "ul";
      return (
        <ListTag
          className={`text-gray-300 text-lg leading-relaxed ml-6 ${
            block.data.style === "ordered" ? "list-decimal" : "list-disc"
          }`}
        >
          {block.data.items.map((item: string, i: number) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ListTag>
      );

    case "image":
      return (
        <figure className="my-8">
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={block.data.file?.url || block.data.url || "/placeholder.svg"}
              alt={block.data.caption || "Post image"}
              className="w-full object-cover transition-transform duration-300"
              style={{ maxHeight: "600px" }}
            />
          </div>
          {block.data.caption && (
            <figcaption className="text-center text-gray-400 mt-2">
              {block.data.caption}
            </figcaption>
          )}
        </figure>
      );

    case "delimiter":
      return <hr className="my-8 border-gray-600" />;

    case "quote":
      return (
        <blockquote className="border-l-4 border-green-400 pl-4 py-2 my-6 text-gray-300 italic">
          <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
          {block.data.caption && (
            <footer className="text-gray-400 mt-2">
              — {block.data.caption}
            </footer>
          )}
        </blockquote>
      );

    case "code":
      return (
        <pre className="bg-gray-800 p-4 rounded-md overflow-x-auto my-6">
          <code className="text-gray-300 text-sm">{block.data.code}</code>
        </pre>
      );

    default:
      if (block.type === "text") {
        return (
          <p className="text-gray-300 text-lg leading-relaxed">
            {block.data || block.content}
          </p>
        );
      }
      return (
        <div className="text-gray-300 text-lg">
          {JSON.stringify(block.data)}
        </div>
      );
  }
}

function LoadingSkeleton() {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-12 w-3/4 bg-gray-600 animate-pulse" />
        <Skeleton className="h-6 w-full bg-gray-600 animate-pulse" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full bg-gray-600 animate-pulse" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 bg-gray-600 animate-pulse" />
            <Skeleton className="h-3 w-24 bg-gray-600 animate-pulse" />
          </div>
        </div>
        <Skeleton className="h-64 w-full bg-gray-600 animate-pulse" />
        <Skeleton className="h-4 w-full bg-gray-600 animate-pulse" />
        <Skeleton className="h-4 w-5/6 bg-gray-600 animate-pulse" />
        <Skeleton className="h-4 w-4/6 bg-gray-600 animate-pulse" />
      </div>
    </div>
  );
}

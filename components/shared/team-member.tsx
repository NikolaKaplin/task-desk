import Link from "next/link";

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  bio: string;
}

export function TeamMember({ name, role, image, bio }: TeamMemberProps) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:scale-105">
      <Link
        href={`/team/${name.toLowerCase().replace(" ", "-")}`}
        className="block"
      >
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover object-center transition-transform duration-300 ease-in-out hover:scale-110"
          />
        </div>
      </Link>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{name}</h2>
        <p className="text-blue-400 mb-4">{role}</p>
        <p className="text-gray-300">{bio}</p>
      </div>
    </div>
  );
}

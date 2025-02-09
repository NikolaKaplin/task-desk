import Link from "next/link";
import Image from "next/image";

interface TeamMemberProps {
  firstName: string;
  lastName: string;
  avatar: string;
  bio: string;
  devStatus: string;
}
export function TeamMember({
  firstName,
  lastName,
  avatar,
  bio,
  devStatus,
}: TeamMemberProps) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:scale-105">
      <Link
        href={`/team/${firstName.replace(" ", "-")}-${lastName.replace(
          " ",
          "-"
        )}`}
        className="block"
      >
        <div className="aspect-square overflow-hidden">
          <img
            src={avatar}
            alt={firstName}
            className="w-full h-full object-cover object-center transition-transform duration-300 ease-in-out hover:scale-110"
          />
        </div>
      </Link>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">
          {firstName} {lastName}
        </h2>
        <p className="text-blue-400 mb-4">
          {devStatus ? devStatus.split(",").join(", ") : ""}
        </p>
        <p className="text-gray-300">{bio}</p>
      </div>
    </div>
  );
}

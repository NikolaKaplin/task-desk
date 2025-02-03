import { getUsers } from "@/app/actions";
import { TeamMember } from "@/components/shared/team-member";

export default async function TeamPage() {
  const teamMembers = await getUsers();
  return (
    <div className=" min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header className="py-16 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Познакомьтесь с командой Altergemu!
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Мы — увлеченные разработчики игр, стремящиеся создавать незабываемые
          игровые впечатления.
        </p>
      </header>

      <main className="container mx-auto px-4 ">
        <div className="grid grid-cols-1 md:grid-cols-2 pb-6 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMember key={index} {...member} />
          ))}
        </div>
      </main>
    </div>
  );
}

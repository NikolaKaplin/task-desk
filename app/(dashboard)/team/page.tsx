import { TeamMember } from "@/components/shared/team-member";
import Image from "next/image";

const teamMembers = [
  {
    name: "Павел Дуров",
    role: "Backend Developer",
    image:
      "https://cdnn21.img.ria.ru/images/07e8/08/1b/1968767608_0:0:1081:810_768x0_80_0_0_b17d32282f9a75577bd924779fbd8dca.jpg",
    bio: " Pavel Durov - Russian entrepreneur and programmer, best known for being the founder of the social networking site VK, and of the messaging app Telegram. He is also the founder of the technology company Telegram Messenger Inc.",
  },
  {
    name: "Дэн Абрамов",
    role: "Backend Developer",
    image: "https://github.com/gaearon.png",
    bio: "dan's expertise in game engine architecture and optimization ensures our games run smoothly across multiple platforms.",
  },
  {
    name: "Ivan Sokolov",
    role: "Lead Programmer",
    image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c",
    bio: "Ivan's expertise in game engine architecture and optimization ensures our games run smoothly across multiple platforms.",
  },
  {
    name: "Natasha Ivanova",
    role: "Narrative Designer",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
    bio: "Natasha weaves compelling stories and creates memorable characters that resonate with players long after they've finished the game.",
  },
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header className="py-16 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Познакомьтесь с командой Altergemu!
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Мы — увлеченные разработчики игр, стремящиеся создавать незабываемые
          игровые впечатления.
        </p>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMember key={index} {...member} />
          ))}
        </div>
      </main>

      <section className="bg-gray-800 py-16 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Are you passionate about game development? We're always looking for
            talented individuals to join our creative team.
          </p>
          <a
            href="#"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            View Open Positions
          </a>
        </div>
      </section>
    </div>
  );
}

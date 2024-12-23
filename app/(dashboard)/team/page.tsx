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
    name: "Theo T3",
    role: "Lead Programmer",
    image:
      "https://yt3.googleusercontent.com/Y6jut5A-dhWRlv7W81kGxVFPtZGjZN97IhBP75uLnx2AVV7ZEJUUUxBKHlFw9GcwILxkz1E_cLc=s900-c-k-c0x00ffffff-no-rj",
    bio: "Ivan's expertise in game engine architecture and optimization ensures our games run smoothly across multiple platforms.",
  },
  {
    name: "Primeagean",
    role: "Game Designer",
    image:
      "https://yt3.googleusercontent.com/ytc/AIdro_laY82JAzs_2edBDxrxLgLWshhMK04SpAqOfoEzexOBZg=s900-c-k-c0x00ffffff-no-rj",
    bio: "Natasha weaves compelling stories and creates memorable characters that resonate with players long after they've finished the game.",
  },
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
    name: "Theo T3",
    role: "Lead Programmer",
    image:
      "https://yt3.googleusercontent.com/Y6jut5A-dhWRlv7W81kGxVFPtZGjZN97IhBP75uLnx2AVV7ZEJUUUxBKHlFw9GcwILxkz1E_cLc=s900-c-k-c0x00ffffff-no-rj",
    bio: "Ivan's expertise in game engine architecture and optimization ensures our games run smoothly across multiple platforms.",
  },
  {
    name: "Primeagean",
    role: "Game Designer",
    image:
      "https://yt3.googleusercontent.com/ytc/AIdro_laY82JAzs_2edBDxrxLgLWshhMK04SpAqOfoEzexOBZg=s900-c-k-c0x00ffffff-no-rj",
    bio: "Natasha weaves compelling stories and creates memorable characters that resonate with players long after they've finished the game.",
  },
];

export default function TeamPage() {
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

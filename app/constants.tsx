import {
  Brain,
  FolderKanban,
  House,
  Icon,
  ListTodo,
  ShieldCheck,
  UserRoundCog,
  UsersRound,
} from "lucide-react";
import { NavItems, TutorItems } from "./types";
import { countUnverifiedUsers } from "./actions";
import { Task } from "./(dashboard)/projects/[tasks]/page";
import { HiMiniSquare3Stack3D } from "react-icons/hi2";

export const navItems: NavItems[] = [
  {
    title: "Home",
    icon: <House />,
    path: "home",
  },
  {
    title: "Profile",
    icon: <UserRoundCog />,
    path: "profile",
  },
  {
    title: "Team",
    icon: <UsersRound />,
    path: "team",
  },
  {
    title: "My tasks",
    icon: <ListTodo />,
    path: "tasks",
  },
  {
    title: "Projects",
    icon: <FolderKanban />,
    path: "projects",
  },
  {
    title: "Chat GPT",
    icon: <Brain />,
    path: "chat",
  },
  {
    title: "3D Models",
    icon: <HiMiniSquare3Stack3D />,
    path: "models",
  },
  {
    title: "Admin",
    icon: <ShieldCheck />,
    path: "admin",
    hiddenFor: ["UNVERIFIED", "USER"],
    indicatorHandler: countUnverifiedUsers,
  },
];

export const softwareDevelopers = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile Developer",
  "Game Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Data Engineer",
  "Machine Learning Engineer",
  "Quality Assurance Engineer",
  "UI/UX Designer",
  "Systems Analyst",
  "Embedded Systems Developer",
  "Cloud Engineer",
  "Blockchain Developer",
  "Security Engineer",
  "Game Designer",
  "Database Administrator",
  "Windows Destroyer",
];

export const initialTasks: Task[] = [
  {
    id: "1",
    name: "Design mockups",
    description: "Create initial design mockups",
    performers: ["John Doe"],
    status: "ISSUE",
    image:
      "https://avatars.dzeninfra.ru/get-zen_doc/1873182/pub_605c73f132b80a09c6213a69_605c9d537271d71bc031ae17/scale_1200",
  },
  {
    id: "2",
    name: "Frontend development",
    description: "Implement the frontend",
    performers: ["Jane Smith"],
    status: "IN PROGRESS",
    image:
      "https://avatars.dzeninfra.ru/get-zen_doc/1873182/pub_605c73f132b80a09c6213a69_605c9d537271d71bc031ae17/scale_1200",
  },
  {
    id: "3",
    name: "Backend API",
    description: "Develop the backend API",
    performers: ["Bob Johnson"],
    status: "REVIEW",
    image:
      "https://avatars.dzeninfra.ru/get-zen_doc/1873182/pub_605c73f132b80a09c6213a69_605c9d537271d71bc031ae17/scale_1200",
  },
  {
    id: "4",
    name: "Testing",
    description: "Perform QA testing",
    performers: ["Alice Williams"],
    status: "COMPLETED",
    image:
      "https://avatars.dzeninfra.ru/get-zen_doc/1873182/pub_605c73f132b80a09c6213a69_605c9d537271d71bc031ae17/scale_1200",
  },
  {
    id: "5",
    name: "Design mockups",
    description: "Create initial design mockups",
    performers: ["John Doe"],
    status: "ISSUED",
    image:
      "https://avatars.dzeninfra.ru/get-zen_doc/1873182/pub_605c73f132b80a09c6213a69_605c9d537271d71bc031ae17/scale_1200",
  },
  {
    id: "6",
    name: "Frontend development",
    description: "Implement the frontend",
    performers: ["Jane Smith"],
    status: "PROCESSING",
    image:
      "https://avatars.dzeninfra.ru/get-zen_doc/1873182/pub_605c73f132b80a09c6213a69_605c9d537271d71bc031ae17/scale_1200",
  },
  {
    id: "7",
    name: "Backend API",
    description: "Develop the backend API",
    performers: ["Bob Johnson"],
    status: "REVIEW",
    image:
      "https://avatars.dzeninfra.ru/get-zen_doc/1873182/pub_605c73f132b80a09c6213a69_605c9d537271d71bc031ae17/scale_1200",
  },
  {
    id: "8",
    name: "Testing",
    description: "Perform QA testing",
    performers: ["Alice Williams"],
    status: "COMPLETED",
    image:
      "https://avatars.dzeninfra.ru/get-zen_doc/1873182/pub_605c73f132b80a09c6213a69_605c9d537271d71bc031ae17/scale_1200",
  },
];

export const listIds = [
  {
    name: "ISSUED",
    description: "Ещё не начато",
    colors: ["bg-green-300", "border-green-800"],
  },
  {
    name: "PROCESSING",
    description: "Активно идёт работа.",
    colors: ["bg-yellow-300", "border-yellow-800"],
  },
  {
    name: "REVIEW",
    description: "Проверяется, форматируется.",
    colors: ["bg-red-300", "border-red-800"],
  },
  {
    name: "DONE",
    description: "Полностью выполнено",
    colors: ["bg-purple-300", "border-purple-800"],
  },
] as const;

export const tutorialSlides: TutorItems[] = [
  {
    title: "Приветствуем вас на нашем сайте",
    description:
      "Наша команда специализируется на веб разработке, а так же разработке игр на игровом движке UE5",
    image: "https://storage.yandexcloud.net/altergemu-team/tutorial/page1.webp",
  },
  {
    title: "Первым делом заполните свой профиль",
    description:
      "Просьба использовать свои имя и фамилию, ники иногда бывает тяжело зпоминать или выговаривать, это так же относится к нашему Discord серверу. Так же поставьте аватар, заполните информацию о себе и выберите вашу специализацию. Активируйте Public profile если хотите отображаться на нашем публичном сайте-визитке.",
    image: "https://storage.yandexcloud.net/altergemu-team/tutorial/page2.png",
  },
  {
    title: "Создавайте командные проекты",
    description:
      "При помощи простого и понятного индерфейса вы можете создавать проекты и назначать исполнителей.",
    image: "https://storage.yandexcloud.net/altergemu-team/tutorial/page3.png",
  },
  {
    title: "Управляйте задачами легко и быстро",
    description:
      "Вы можете создавать новые задачи, назначать испольнителей, дедлайны, подробное описание, а так же перетягивать их между колонками чтобы менять их статус выполнения.",
    image: "https://storage.yandexcloud.net/altergemu-team/tutorial/page4.png",
  },
  {
    title: "Используйте возможности ИИ по полной",
    description:
      "С нами в вашем распоряжении 4 текстовых модели, а так же одна, которая может генерировать простые 3д модели для заднего фона, что может облегчить вам работу.",
    image: "https://storage.yandexcloud.net/altergemu-team/tutorial/page5.png",
  },
  {
    title: "Будьте ответственны",
    description:
      "Каждую пятницу практически всгда в 19:00 проводится созвон, где мы обсуждаем успехи каждого из участников, процесс выполнения задач, какие либо вопросы или проблемы, связанные с выполнением задач.",
    image: "https://storage.yandexcloud.net/altergemu-team/tutorial/page6.jpg",
  },
  {
    title: "Добро пожаловать в Altergemu!",
    description:
      "Вы готовы прокачать свои навыки и производить прекрасные продукты на свет.",
    image: "https://storage.yandexcloud.net/altergemu-team/tutorial/page1.webp",
    isLastSlide: true,
  },
] as const;

export const models = [
  { id: "llama_70b" },
  { id: "llama_8b" },
  { id: "mixtral" },
  { id: "gemma" },
];

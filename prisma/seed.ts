import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create test users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "alice@example.com" },
      update: {},
      create: {
        email: "alice@example.com",
        name: "Alice Johnson",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
        isOnline: true,
        points: 150,
      },
    }),
    prisma.user.upsert({
      where: { email: "bob@example.com" },
      update: {},
      create: {
        email: "bob@example.com",
        name: "Bob Smith",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
        isOnline: false,
        points: 200,
      },
    }),
    prisma.user.upsert({
      where: { email: "carol@example.com" },
      update: {},
      create: {
        email: "carol@example.com",
        name: "Carol White",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=carol",
        isOnline: true,
        points: 175,
      },
    }),
  ]);

  const [alice, bob, carol] = users;

  // Create posts and tasks with new schema
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        type: "post",
        content: [
          {
            text: "Just finished building my portfolio site!",
            tags: ["#webdev", "#portfolio", "#react"],
            link: "https://myportfolio.com",
          },
        ],
        image: "https://example.com/image.jpg",
        authorId: alice.id,
        createdAt: new Date("2025-05-26T12:00:00.000Z"),
        updatedAt: new Date("2025-05-26T12:30:00.000Z"),
      },
    }),
    prisma.post.create({
      data: {
        type: "post",
        content: [
          {
            text: "Exploring TypeScript generics today!",
            tags: ["#typescript", "#generics", "#learning"],
            link: "https://typescriptlang.org",
          },
        ],
        image: "https://picsum.photos/seed/post2/800/600",
        authorId: bob.id,
        createdAt: new Date("2025-05-27T10:00:00.000Z"),
        updatedAt: new Date("2025-05-27T10:30:00.000Z"),
      },
    }),
    prisma.post.create({
      data: {
        type: "post",
        content: [
          {
            text: "Read a great article on async/await in JS.",
            tags: ["#javascript", "#asyncawait"],
            link: "https://blog.example.com/async-await",
          },
        ],
        image: "https://picsum.photos/seed/post3/800/600",
        authorId: carol.id,
        createdAt: new Date("2025-05-28T09:00:00.000Z"),
        updatedAt: new Date("2025-05-28T09:30:00.000Z"),
      },
    }),
    prisma.post.create({
      data: {
        type: "post",
        content: [
          {
            text: "Launched my first npm package!",
            tags: ["#npm", "#opensource"],
            link: "https://npmjs.com/package/my-package",
          },
        ],
        image: "https://picsum.photos/seed/post4/800/600",
        authorId: alice.id,
        createdAt: new Date("2025-05-29T11:00:00.000Z"),
        updatedAt: new Date("2025-05-29T11:30:00.000Z"),
      },
    }),
    prisma.post.create({
      data: {
        type: "post",
        content: [
          {
            text: "Attended a React conference, learned a lot!",
            tags: ["#react", "#conference"],
            link: "https://reactconf.com",
          },
        ],
        image: "https://picsum.photos/seed/post5/800/600",
        authorId: bob.id,
        createdAt: new Date("2025-05-30T14:00:00.000Z"),
        updatedAt: new Date("2025-05-30T14:30:00.000Z"),
      },
    }),
    prisma.post.create({
      data: {
        type: "task",
        content: [
          {
            title: "Finish React Project",
            description: "Complete the final module and deploy to Vercel.",
            dueDate: "2025-06-01T23:59:59.000Z",
            points: 100,
            bidAmount: 50,
            requirements: ["Figma design", "Responsive layout", "Modern look"],
          },
        ],
        image: "",
        authorId: bob.id,
        createdAt: new Date("2025-05-27T09:00:00.000Z"),
        updatedAt: new Date("2025-05-27T09:00:00.000Z"),
      },
    }),
    prisma.post.create({
      data: {
        type: "task",
        content: [
          {
            title: "Write blog post on Prisma seeding",
            description:
              "Share tips and tricks for seeding databases with Prisma.",
            dueDate: "2025-06-02T18:00:00.000Z",
          },
        ],
        image: "",
        authorId: carol.id,
        createdAt: new Date("2025-05-28T12:00:00.000Z"),
        updatedAt: new Date("2025-05-28T12:00:00.000Z"),
      },
    }),
    prisma.post.create({
      data: {
        type: "task",
        content: [
          {
            title: "Update portfolio with new projects",
            description: "Add recent work and refresh the design.",
            dueDate: "2025-06-03T20:00:00.000Z",
            points: 100,
            bidAmount: 50,
            requirements: ["Figma design", "Responsive layout", "Modern look"],
          },
        ],
        image: "",
        authorId: alice.id,
        createdAt: new Date("2025-05-29T15:00:00.000Z"),
        updatedAt: new Date("2025-05-29T15:00:00.000Z"),
      },
    }),
    prisma.post.create({
      data: {
        type: "task",
        content: [
          {
            title: "Refactor authentication flow",
            description: "Improve security and user experience.",
            dueDate: "2025-06-04T17:00:00.000Z",
            points: 100,
            bidAmount: 50,
            requirements: ["Figma design", "Responsive layout", "Modern look"],
          },
        ],
        image: "",
        authorId: bob.id,
        createdAt: new Date("2025-05-30T10:00:00.000Z"),
        updatedAt: new Date("2025-05-30T10:00:00.000Z"),
      },
    }),
    prisma.post.create({
      data: {
        type: "task",
        content: [
          {
            title: "Organize team meeting",
            description: "Schedule and prepare agenda for next sprint.",
            dueDate: "2025-06-05T09:00:00.000Z",
            points: 100,
            bidAmount: 50,
            requirements: ["Figma design", "Responsive layout", "Modern look"],
          },
        ],
        image: "",
        authorId: carol.id,
        createdAt: new Date("2025-05-31T08:00:00.000Z"),
        updatedAt: new Date("2025-05-31T08:00:00.000Z"),
      },
    }),
  ]);

  // Create comments
  await Promise.all([
    prisma.comment.create({
      data: {
        content: "That's awesome! What technologies did you use?",
        userId: bob.id,
        postId: posts[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "React is great for building UIs!",
        userId: carol.id,
        postId: posts[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "The view looks amazing! Where is this?",
        userId: alice.id,
        postId: posts[1].id,
      },
    }),
  ]);

  // Create likes
  await Promise.all([
    prisma.like.create({
      data: {
        userId: bob.id,
        postId: posts[0].id,
      },
    }),
    prisma.like.create({
      data: {
        userId: carol.id,
        postId: posts[0].id,
      },
    }),
    prisma.like.create({
      data: {
        userId: alice.id,
        postId: posts[1].id,
      },
    }),
  ]);

  // Create follows
  await Promise.all([
    prisma.follow.create({
      data: {
        followerId: bob.id,
        followingId: alice.id,
      },
    }),
    prisma.follow.create({
      data: {
        followerId: carol.id,
        followingId: alice.id,
      },
    }),
    prisma.follow.create({
      data: {
        followerId: alice.id,
        followingId: bob.id,
      },
    }),
  ]);

  // Create chat rooms

  console.log("Seed data created successfully!");
  console.log("Created users:", users);
  console.log("Created posts:", posts);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

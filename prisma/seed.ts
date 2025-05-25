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

  // Create posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        content:
          "Just finished building my first React application! 🚀 #coding #webdev",
        authorId: alice.id,
        image: "https://picsum.photos/seed/post1/800/600",
      },
    }),
    prisma.post.create({
      data: {
        content: "Beautiful day for a hike! 🏃‍♂️ #nature #outdoors",
        authorId: bob.id,
        image: "https://picsum.photos/seed/post2/800/600",
      },
    }),
    prisma.post.create({
      data: {
        content:
          "Check out this amazing recipe I tried today! 👨‍🍳 #cooking #foodie",
        authorId: carol.id,
        image: "https://picsum.photos/seed/post3/800/600",
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
  const chatRooms = await Promise.all([
    // One-on-one chat between Alice and Bob
    prisma.chatRoom.create({
      data: {
        isGroup: false,
        participants: {
          connect: [{ id: alice.id }, { id: bob.id }],
        },
        messages: {
          create: [
            {
              encryptedContent: "Hey Bob, how's the project going?",
              senderId: alice.id,
              createdAt: new Date(Date.now() - 3600000), // 1 hour ago
            },
            {
              encryptedContent: "Going great! Just finished the frontend",
              senderId: bob.id,
              createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
            },
          ],
        },
      },
    }),
    // Group chat with all users
    prisma.chatRoom.create({
      data: {
        name: "Project Team",
        isGroup: true,
        participants: {
          connect: users.map((user) => ({ id: user.id })),
        },
        messages: {
          create: [
            {
              encryptedContent: "Welcome everyone to the project team chat!",
              senderId: alice.id,
              createdAt: new Date(Date.now() - 7200000), // 2 hours ago
            },
            {
              encryptedContent: "Thanks for adding me!",
              senderId: bob.id,
              createdAt: new Date(Date.now() - 3600000), // 1 hour ago
            },
            {
              encryptedContent: "Excited to work with everyone!",
              senderId: carol.id,
              createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
            },
          ],
        },
      },
    }),
  ]);

  console.log("Seed data created successfully!");
  console.log("Created users:", users);
  console.log("Created posts:", posts);
  console.log("Created chat rooms:", chatRooms);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

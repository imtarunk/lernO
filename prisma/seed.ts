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

  // Create follows
  await Promise.all([
    prisma.follow.upsert({
      where: {
        followerId_followingId: { followerId: bob.id, followingId: alice.id },
      },
      update: {},
      create: { followerId: bob.id, followingId: alice.id },
    }),
    prisma.follow.upsert({
      where: {
        followerId_followingId: { followerId: carol.id, followingId: alice.id },
      },
      update: {},
      create: { followerId: carol.id, followingId: alice.id },
    }),
    prisma.follow.upsert({
      where: {
        followerId_followingId: { followerId: alice.id, followingId: bob.id },
      },
      update: {},
      create: { followerId: alice.id, followingId: bob.id },
    }),
  ]);

  // Create chat rooms

  // --- Seed Courses ---
  const courses = await Promise.all([
    prisma.course.create({
      data: {
        title: "Learn Figma",
        description:
          "Master the basics and advanced features of Figma for UI/UX design.",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
        duration: 390, // 6h 30min in minutes
        level: "Beginner",
        category: "Design",
        tags: ["figma", "ui", "ux", "design"],
        isPublic: true,
        isFeatured: true,
        isFree: true,
        User: { connect: { id: alice.id } },
      },
    }),
    prisma.course.create({
      data: {
        title: "Analog photography",
        description: "Explore the art and science of analog photography.",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/3/3f/Analog_camera_icon.svg",
        duration: 195, // 3h 15min
        level: "Intermediate",
        category: "Photography",
        tags: ["photography", "analog", "camera"],
        isPublic: true,
        isFeatured: false,
        isFree: false,
        User: { connect: { id: bob.id } },
      },
    }),
    prisma.course.create({
      data: {
        title: "Master Instagram",
        description: "Grow your brand and audience on Instagram.",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
        duration: 460, // 7h 40min
        level: "Intermediate",
        category: "Social Media",
        tags: ["instagram", "social", "marketing"],
        isPublic: true,
        isFeatured: true,
        isFree: false,
        User: { connect: { id: carol.id } },
      },
    }),
    prisma.course.create({
      data: {
        title: "Basics of drawing",
        description: "Learn the fundamentals of drawing from scratch.",
        image: "https://img.icons8.com/ios-filled/50/000000/pencil-tip.png",
        duration: 690, // 11h 30min
        level: "Beginner",
        category: "Art",
        tags: ["drawing", "art", "sketch"],
        isPublic: true,
        isFeatured: false,
        isFree: true,
        User: { connect: { id: alice.id } },
      },
    }),
    prisma.course.create({
      data: {
        title: "Photoshop - Essence",
        description: "Essential Photoshop skills for creators and designers.",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg",
        duration: 335, // 5h 35min
        level: "Beginner",
        category: "Design",
        tags: ["photoshop", "design", "editing"],
        isPublic: true,
        isFeatured: false,
        isFree: false,
        User: { connect: { id: bob.id } },
      },
    }),
  ]);

  // --- Seed Course Progress ---
  await Promise.all([
    prisma.courseProgress.create({
      data: {
        courseId: courses[0].id, // Learn Figma
        userId: users[0].id, // Alice
        progress: 83,
      },
    }),
    prisma.courseProgress.create({
      data: {
        courseId: courses[1].id, // Analog photography
        userId: users[1].id, // Bob
        progress: 40,
      },
    }),
    prisma.courseProgress.create({
      data: {
        courseId: courses[2].id, // Master Instagram
        userId: users[2].id, // Carol
        progress: 100,
      },
    }),
  ]);

  // --- Seed Course Content ---
  await Promise.all([
    prisma.courseContent.create({
      data: {
        courseId: courses[0].id,
        content: [
          {
            title: "Introduction to Figma",
            type: "video",
            url: "https://youtu.be/figma-intro",
          },
          {
            title: "Designing your first UI",
            type: "article",
            url: "https://figma.com/blog/first-ui",
          },
        ],
      },
    }),
    prisma.courseContent.create({
      data: {
        courseId: courses[1].id,
        content: [
          {
            title: "History of Analog Photography",
            type: "video",
            url: "https://youtu.be/analog-history",
          },
          {
            title: "Camera Basics",
            type: "article",
            url: "https://photography.com/camera-basics",
          },
        ],
      },
    }),
    prisma.courseContent.create({
      data: {
        courseId: courses[2].id,
        content: [
          {
            title: "Instagram for Beginners",
            type: "video",
            url: "https://youtu.be/insta-beginners",
          },
          {
            title: "Growing Your Audience",
            type: "article",
            url: "https://instagram.com/grow",
          },
        ],
      },
    }),
    // ...repeat for other courses as desired
  ]);

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

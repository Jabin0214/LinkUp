using Microsoft.EntityFrameworkCore;
using Models;
using System.Security.Cryptography;
using System.Text;
using BCrypt.Net;

namespace Data
{
    public static class DataSeeder
    {
        public static async Task SeedAsync(UserContext context)
        {
            // 检查是否已有数据
            if (context.Users.Any())
            {
                Console.WriteLine("数据库已有数据，跳过数据初始化");
                return;
            }

            Console.WriteLine("开始插入完整的示例数据...");

            // 创建示例用户
            var users = new List<User>
            {
                new User
                {
                    Username = "alice_chen",
                    Email = "alice@example.com",
                    PasswordHash = HashPassword("password123"),
                    FirstName = "Alice",
                    LastName = "Chen",
                    university = "Stanford University",
                    CreatedAt = DateTime.UtcNow.AddDays(-30),
                    IsActive = true
                },
                new User
                {
                    Username = "bob_smith",
                    Email = "bob@example.com",
                    PasswordHash = HashPassword("password123"),
                    FirstName = "Bob",
                    LastName = "Smith",
                    university = "MIT",
                    CreatedAt = DateTime.UtcNow.AddDays(-25),
                    IsActive = true
                },
                new User
                {
                    Username = "carol_wang",
                    Email = "carol@example.com",
                    PasswordHash = HashPassword("password123"),
                    FirstName = "Carol",
                    LastName = "Wang",
                    university = "Harvard University",
                    CreatedAt = DateTime.UtcNow.AddDays(-20),
                    IsActive = true
                },
                new User
                {
                    Username = "david_lee",
                    Email = "david@example.com",
                    PasswordHash = HashPassword("password123"),
                    FirstName = "David",
                    LastName = "Lee",
                    university = "UC Berkeley",
                    CreatedAt = DateTime.UtcNow.AddDays(-15),
                    IsActive = true
                },
                new User
                {
                    Username = "emma_johnson",
                    Email = "emma@example.com",
                    PasswordHash = HashPassword("password123"),
                    FirstName = "Emma",
                    LastName = "Johnson",
                    university = "Oxford University",
                    CreatedAt = DateTime.UtcNow.AddDays(-10),
                    IsActive = true
                },
                new User
                {
                    Username = "frank_kim",
                    Email = "frank@example.com",
                    PasswordHash = HashPassword("password123"),
                    FirstName = "Frank",
                    LastName = "Kim",
                    university = "Tokyo University",
                    CreatedAt = DateTime.UtcNow.AddDays(-8),
                    IsActive = true
                },
                new User
                {
                    Username = "grace_liu",
                    Email = "grace@example.com",
                    PasswordHash = HashPassword("password123"),
                    FirstName = "Grace",
                    LastName = "Liu",
                    university = "Tsinghua University",
                    CreatedAt = DateTime.UtcNow.AddDays(-6),
                    IsActive = true
                },
                new User
                {
                    Username = "henry_brown",
                    Email = "henry@example.com",
                    PasswordHash = HashPassword("password123"),
                    FirstName = "Henry",
                    LastName = "Brown",
                    university = "Cambridge University",
                    CreatedAt = DateTime.UtcNow.AddDays(-5),
                    IsActive = true
                }
            };

            context.Users.AddRange(users);
            await context.SaveChangesAsync();
            Console.WriteLine($"插入了 {users.Count} 个用户");

            // 创建技能板
            var skillBoards = new List<SkillBoard>
            {
                new SkillBoard
                {
                    UserId = users[0].Id,
                    Introduction = "Passionate AI/ML engineer with 3+ years of experience in building intelligent systems. I love creating solutions that make a real impact on people's lives.",
                    Direction = "AI & Machine Learning",
                    CreatedAt = DateTime.UtcNow.AddDays(-28),
                    UpdatedAt = DateTime.UtcNow.AddDays(-2)
                },
                new SkillBoard
                {
                    UserId = users[1].Id,
                    Introduction = "Full-stack developer focusing on scalable web applications. Always excited to learn new technologies and best practices.",
                    Direction = "Web Development",
                    CreatedAt = DateTime.UtcNow.AddDays(-23),
                    UpdatedAt = DateTime.UtcNow.AddDays(-1)
                },
                new SkillBoard
                {
                    UserId = users[2].Id,
                    Introduction = "Mobile app developer with a passion for creating beautiful, user-friendly experiences. Sustainability advocate.",
                    Direction = "Mobile Development",
                    CreatedAt = DateTime.UtcNow.AddDays(-18),
                    UpdatedAt = DateTime.UtcNow.AddDays(-3)
                },
                new SkillBoard
                {
                    UserId = users[3].Id,
                    Introduction = "Blockchain enthusiast and smart contract developer. Building the future of decentralized applications.",
                    Direction = "Blockchain & Web3",
                    CreatedAt = DateTime.UtcNow.AddDays(-13),
                    UpdatedAt = DateTime.UtcNow.AddDays(-1)
                },
                new SkillBoard
                {
                    UserId = users[4].Id,
                    Introduction = "Frontend developer with strong UX/UI design skills. I believe in creating inclusive and accessible digital experiences.",
                    Direction = "Frontend & UX Design",
                    CreatedAt = DateTime.UtcNow.AddDays(-8),
                    UpdatedAt = DateTime.UtcNow.AddDays(-2)
                },
                new SkillBoard
                {
                    UserId = users[5].Id,
                    Introduction = "Data scientist specializing in computer vision and deep learning. Love working with large datasets and finding hidden patterns.",
                    Direction = "Data Science & CV",
                    CreatedAt = DateTime.UtcNow.AddDays(-6),
                    UpdatedAt = DateTime.UtcNow.AddDays(-1)
                },
                new SkillBoard
                {
                    UserId = users[6].Id,
                    Introduction = "Backend engineer with expertise in microservices and cloud architecture. DevOps enthusiast.",
                    Direction = "Backend & Cloud",
                    CreatedAt = DateTime.UtcNow.AddDays(-4),
                    UpdatedAt = DateTime.UtcNow.AddDays(-1)
                },
                new SkillBoard
                {
                    UserId = users[7].Id,
                    Introduction = "Game developer and AR/VR specialist. Creating immersive experiences that blur the line between digital and reality.",
                    Direction = "Game Development & AR/VR",
                    CreatedAt = DateTime.UtcNow.AddDays(-3),
                    UpdatedAt = DateTime.UtcNow.AddDays(-1)
                }
            };

            context.SkillBoards.AddRange(skillBoards);
            await context.SaveChangesAsync();
            Console.WriteLine($"插入了 {skillBoards.Count} 个技能板");

            // 创建技能板项目
            var skillBoardItems = new List<SkillBoardItem>
            {
                // Alice的技能 (AI/ML)
                new SkillBoardItem { SkillBoardId = skillBoards[0].Id, Type = "skill", Content = "Python", Level = "Expert", Order = 1 },
                new SkillBoardItem { SkillBoardId = skillBoards[0].Id, Type = "skill", Content = "TensorFlow", Level = "Proficient", Order = 2 },
                new SkillBoardItem { SkillBoardId = skillBoards[0].Id, Type = "skill", Content = "PyTorch", Level = "Proficient", Order = 3 },
                new SkillBoardItem { SkillBoardId = skillBoards[0].Id, Type = "skill", Content = "Machine Learning", Level = "Expert", Order = 4 },
                new SkillBoardItem { SkillBoardId = skillBoards[0].Id, Type = "skill", Content = "Deep Learning", Level = "Proficient", Order = 5 },
                new SkillBoardItem { SkillBoardId = skillBoards[0].Id, Type = "link", Content = "GitHub Profile", Url = "https://github.com/alice-chen", Order = 1 },
                new SkillBoardItem { SkillBoardId = skillBoards[0].Id, Type = "link", Content = "LinkedIn", Url = "https://linkedin.com/in/alice-chen-ai", Order = 2 },
                new SkillBoardItem { SkillBoardId = skillBoards[0].Id, Type = "link", Content = "Personal Blog", Url = "https://alice-ai-blog.com", Order = 3 },

                // Bob的技能 (Web Dev)
                new SkillBoardItem { SkillBoardId = skillBoards[1].Id, Type = "skill", Content = "JavaScript", Level = "Expert", Order = 1 },
                new SkillBoardItem { SkillBoardId = skillBoards[1].Id, Type = "skill", Content = "React", Level = "Expert", Order = 2 },
                new SkillBoardItem { SkillBoardId = skillBoards[1].Id, Type = "skill", Content = "Node.js", Level = "Proficient", Order = 3 },
                new SkillBoardItem { SkillBoardId = skillBoards[1].Id, Type = "skill", Content = "TypeScript", Level = "Proficient", Order = 4 },
                new SkillBoardItem { SkillBoardId = skillBoards[1].Id, Type = "skill", Content = "MongoDB", Level = "Familiar", Order = 5 },
                new SkillBoardItem { SkillBoardId = skillBoards[1].Id, Type = "link", Content = "Portfolio Website", Url = "https://bob-smith-dev.com", Order = 1 },
                new SkillBoardItem { SkillBoardId = skillBoards[1].Id, Type = "link", Content = "GitHub", Url = "https://github.com/bob-smith", Order = 2 },

                // Carol的技能 (Mobile)
                new SkillBoardItem { SkillBoardId = skillBoards[2].Id, Type = "skill", Content = "React Native", Level = "Expert", Order = 1 },
                new SkillBoardItem { SkillBoardId = skillBoards[2].Id, Type = "skill", Content = "Flutter", Level = "Proficient", Order = 2 },
                new SkillBoardItem { SkillBoardId = skillBoards[2].Id, Type = "skill", Content = "Swift", Level = "Familiar", Order = 3 },
                new SkillBoardItem { SkillBoardId = skillBoards[2].Id, Type = "skill", Content = "UI/UX Design", Level = "Proficient", Order = 4 },
                new SkillBoardItem { SkillBoardId = skillBoards[2].Id, Type = "link", Content = "App Store Apps", Url = "https://apps.apple.com/developer/carol-wang", Order = 1 },
                new SkillBoardItem { SkillBoardId = skillBoards[2].Id, Type = "link", Content = "Dribbble", Url = "https://dribbble.com/carol-designs", Order = 2 },

                // David的技能 (Blockchain)
                new SkillBoardItem { SkillBoardId = skillBoards[3].Id, Type = "skill", Content = "Solidity", Level = "Expert", Order = 1 },
                new SkillBoardItem { SkillBoardId = skillBoards[3].Id, Type = "skill", Content = "Web3.js", Level = "Proficient", Order = 2 },
                new SkillBoardItem { SkillBoardId = skillBoards[3].Id, Type = "skill", Content = "Smart Contracts", Level = "Expert", Order = 3 },
                new SkillBoardItem { SkillBoardId = skillBoards[3].Id, Type = "skill", Content = "Ethereum", Level = "Proficient", Order = 4 },
                new SkillBoardItem { SkillBoardId = skillBoards[3].Id, Type = "link", Content = "DeFi Projects", Url = "https://github.com/david-blockchain", Order = 1 },
                new SkillBoardItem { SkillBoardId = skillBoards[3].Id, Type = "link", Content = "Medium Articles", Url = "https://medium.com/@david-blockchain", Order = 2 },

                // Emma的技能 (Frontend/UX)
                new SkillBoardItem { SkillBoardId = skillBoards[4].Id, Type = "skill", Content = "Vue.js", Level = "Expert", Order = 1 },
                new SkillBoardItem { SkillBoardId = skillBoards[4].Id, Type = "skill", Content = "CSS/SCSS", Level = "Expert", Order = 2 },
                new SkillBoardItem { SkillBoardId = skillBoards[4].Id, Type = "skill", Content = "Figma", Level = "Proficient", Order = 3 },
                new SkillBoardItem { SkillBoardId = skillBoards[4].Id, Type = "skill", Content = "User Research", Level = "Familiar", Order = 4 },
                new SkillBoardItem { SkillBoardId = skillBoards[4].Id, Type = "link", Content = "Design Portfolio", Url = "https://emma-ux.design", Order = 1 },
                new SkillBoardItem { SkillBoardId = skillBoards[4].Id, Type = "link", Content = "Behance", Url = "https://behance.net/emma-johnson", Order = 2 },

                // Frank的技能 (Data Science)
                new SkillBoardItem { SkillBoardId = skillBoards[5].Id, Type = "skill", Content = "Python", Level = "Expert", Order = 1 },
                new SkillBoardItem { SkillBoardId = skillBoards[5].Id, Type = "skill", Content = "OpenCV", Level = "Proficient", Order = 2 },
                new SkillBoardItem { SkillBoardId = skillBoards[5].Id, Type = "skill", Content = "Pandas", Level = "Expert", Order = 3 },
                new SkillBoardItem { SkillBoardId = skillBoards[5].Id, Type = "skill", Content = "Computer Vision", Level = "Proficient", Order = 4 },
                new SkillBoardItem { SkillBoardId = skillBoards[5].Id, Type = "link", Content = "Kaggle Profile", Url = "https://kaggle.com/frank-cv", Order = 1 },
                new SkillBoardItem { SkillBoardId = skillBoards[5].Id, Type = "link", Content = "Research Papers", Url = "https://scholar.google.com/frank-kim", Order = 2 },

                // Grace的技能 (Backend/Cloud)
                new SkillBoardItem { SkillBoardId = skillBoards[6].Id, Type = "skill", Content = "Java", Level = "Expert", Order = 1 },
                new SkillBoardItem { SkillBoardId = skillBoards[6].Id, Type = "skill", Content = "Spring Boot", Level = "Expert", Order = 2 },
                new SkillBoardItem { SkillBoardId = skillBoards[6].Id, Type = "skill", Content = "AWS", Level = "Proficient", Order = 3 },
                new SkillBoardItem { SkillBoardId = skillBoards[6].Id, Type = "skill", Content = "Docker", Level = "Proficient", Order = 4 },
                new SkillBoardItem { SkillBoardId = skillBoards[6].Id, Type = "skill", Content = "Kubernetes", Level = "Familiar", Order = 5 },
                new SkillBoardItem { SkillBoardId = skillBoards[6].Id, Type = "link", Content = "Tech Blog", Url = "https://grace-backend.blog", Order = 1 },
                new SkillBoardItem { SkillBoardId = skillBoards[6].Id, Type = "link", Content = "AWS Certifications", Url = "https://aws.amazon.com/verification", Order = 2 },

                // Henry的技能 (Game Dev/AR/VR)
                new SkillBoardItem { SkillBoardId = skillBoards[7].Id, Type = "skill", Content = "Unity", Level = "Expert", Order = 1 },
                new SkillBoardItem { SkillBoardId = skillBoards[7].Id, Type = "skill", Content = "C#", Level = "Expert", Order = 2 },
                new SkillBoardItem { SkillBoardId = skillBoards[7].Id, Type = "skill", Content = "ARKit", Level = "Proficient", Order = 3 },
                new SkillBoardItem { SkillBoardId = skillBoards[7].Id, Type = "skill", Content = "Unreal Engine", Level = "Familiar", Order = 4 },
                new SkillBoardItem { SkillBoardId = skillBoards[7].Id, Type = "link", Content = "Game Portfolio", Url = "https://henry-games.com", Order = 1 },
                new SkillBoardItem { SkillBoardId = skillBoards[7].Id, Type = "link", Content = "Unity Asset Store", Url = "https://assetstore.unity.com/publishers/henry", Order = 2 }
            };

            context.SkillBoardItems.AddRange(skillBoardItems);
            await context.SaveChangesAsync();
            Console.WriteLine($"插入了 {skillBoardItems.Count} 个技能板项目");

            // 创建示例项目
            var projects = new List<Project>
            {
                new Project
                {
                    Title = "AI-Powered Study Assistant",
                    Description = "Building an intelligent study assistant that helps students organize their learning materials, create study schedules, and track progress. We're looking for developers passionate about education technology and AI integration.",
                    CreatorId = users[0].Id,
                    Status = "Recruiting",
                    Category = "AI/Machine Learning",
                    RequiredSkills = "Python,Machine Learning,React,Node.js",
                    MaxMembers = 6,
                    StartDate = DateTime.UtcNow.AddDays(7),
                    EndDate = DateTime.UtcNow.AddDays(90),
                    ContactInfo = "alice@example.com | Discord: alice_chen#1234",
                    CreatedAt = DateTime.UtcNow.AddDays(-5),
                    UpdatedAt = DateTime.UtcNow.AddDays(-5)
                },
                new Project
                {
                    Title = "Campus Social Network",
                    Description = "Creating a modern social platform specifically designed for university students. Features include study groups, event planning, resource sharing, and academic collaboration tools.",
                    CreatorId = users[1].Id,
                    Status = "Recruiting",
                    Category = "Web Development",
                    RequiredSkills = "React,Node.js,MongoDB,TypeScript",
                    MaxMembers = 8,
                    StartDate = DateTime.UtcNow.AddDays(10),
                    EndDate = DateTime.UtcNow.AddDays(120),
                    ContactInfo = "bob@example.com | Slack: bob.smith",
                    CreatedAt = DateTime.UtcNow.AddDays(-4),
                    UpdatedAt = DateTime.UtcNow.AddDays(-4)
                },
                new Project
                {
                    Title = "Sustainable Living Tracker",
                    Description = "Mobile app that helps users track their carbon footprint, discover eco-friendly alternatives, and connect with local sustainability initiatives. Join us in making a positive environmental impact!",
                    CreatorId = users[2].Id,
                    Status = "InProgress",
                    Category = "Mobile App",
                    RequiredSkills = "React Native,JavaScript,Firebase,UI/UX Design",
                    MaxMembers = 5,
                    StartDate = DateTime.UtcNow.AddDays(-14),
                    EndDate = DateTime.UtcNow.AddDays(60),
                    ContactInfo = "carol@example.com | Instagram: @carol_codes",
                    CreatedAt = DateTime.UtcNow.AddDays(-18),
                    UpdatedAt = DateTime.UtcNow.AddDays(-2)
                },
                new Project
                {
                    Title = "Blockchain Voting System",
                    Description = "Developing a secure, transparent voting system using blockchain technology. Perfect for student government elections and organizational decision-making. Looking for developers interested in decentralized technologies.",
                    CreatorId = users[3].Id,
                    Status = "Recruiting",
                    Category = "Blockchain",
                    RequiredSkills = "Solidity,Web3,JavaScript,Smart Contracts",
                    MaxMembers = 4,
                    StartDate = DateTime.UtcNow.AddDays(14),
                    EndDate = DateTime.UtcNow.AddDays(100),
                    ContactInfo = "david@example.com | Telegram: @david_blockchain",
                    CreatedAt = DateTime.UtcNow.AddDays(-3),
                    UpdatedAt = DateTime.UtcNow.AddDays(-3)
                },
                new Project
                {
                    Title = "Mental Health Support Platform",
                    Description = "Creating a comprehensive mental health platform with mood tracking, peer support groups, professional counseling resources, and wellness activities. Our goal is to make mental health support more accessible.",
                    CreatorId = users[4].Id,
                    Status = "Recruiting",
                    Category = "Web Development",
                    RequiredSkills = "Vue.js,Python,PostgreSQL,API Development",
                    MaxMembers = 7,
                    StartDate = DateTime.UtcNow.AddDays(5),
                    EndDate = DateTime.UtcNow.AddDays(85),
                    ContactInfo = "emma@example.com | WhatsApp: +1-555-0123",
                    CreatedAt = DateTime.UtcNow.AddDays(-6),
                    UpdatedAt = DateTime.UtcNow.AddDays(-6)
                },
                new Project
                {
                    Title = "AR Museum Experience",
                    Description = "Developing an augmented reality application that brings museum exhibits to life. Visitors can point their phones at artifacts to see interactive 3D models, historical recreations, and detailed information.",
                    CreatorId = users[7].Id,
                    Status = "InProgress",
                    Category = "Mobile App",
                    RequiredSkills = "Unity,C#,ARKit,ARCore,3D Modeling",
                    MaxMembers = 6,
                    StartDate = DateTime.UtcNow.AddDays(-7),
                    EndDate = DateTime.UtcNow.AddDays(75),
                    ContactInfo = "henry@example.com | LinkedIn: henry-ar-dev",
                    CreatedAt = DateTime.UtcNow.AddDays(-12),
                    UpdatedAt = DateTime.UtcNow.AddDays(-1)
                },
                new Project
                {
                    Title = "Smart City Dashboard",
                    Description = "Building a comprehensive dashboard for city planners and residents to visualize traffic patterns, air quality, energy usage, and other urban metrics. Contributing to smarter, more sustainable cities.",
                    CreatorId = users[5].Id,
                    Status = "Recruiting",
                    Category = "Data Science",
                    RequiredSkills = "Python,Data Visualization,React,API Integration",
                    MaxMembers = 5,
                    StartDate = DateTime.UtcNow.AddDays(12),
                    EndDate = DateTime.UtcNow.AddDays(95),
                    ContactInfo = "frank@example.com | GitHub: frank-data-viz",
                    CreatedAt = DateTime.UtcNow.AddDays(-2),
                    UpdatedAt = DateTime.UtcNow.AddDays(-2)
                },
                new Project
                {
                    Title = "Microservices E-commerce Platform",
                    Description = "Building a scalable e-commerce platform using microservices architecture. Focus on high availability, load balancing, and cloud-native technologies.",
                    CreatorId = users[6].Id,
                    Status = "Recruiting",
                    Category = "Backend Development",
                    RequiredSkills = "Java,Spring Boot,AWS,Docker,Kubernetes",
                    MaxMembers = 6,
                    StartDate = DateTime.UtcNow.AddDays(8),
                    EndDate = DateTime.UtcNow.AddDays(110),
                    ContactInfo = "grace@example.com | Discord: grace_backend#9876",
                    CreatedAt = DateTime.UtcNow.AddDays(-7),
                    UpdatedAt = DateTime.UtcNow.AddDays(-7)
                }
            };

            context.Projects.AddRange(projects);
            await context.SaveChangesAsync();
            Console.WriteLine($"插入了 {projects.Count} 个项目");

            // 创建项目成员关系
            var projectMembers = new List<ProjectMember>();

            // 为每个项目添加创建者作为成员
            foreach (var project in projects)
            {
                projectMembers.Add(new ProjectMember
                {
                    ProjectId = project.Id,
                    UserId = project.CreatorId,
                    Role = "Creator",
                    JoinMessage = "",
                    JoinedAt = project.CreatedAt
                });
            }

            // 添加一些其他成员
            projectMembers.AddRange(new List<ProjectMember>
            {
                // AI Study Assistant 项目的成员
                new ProjectMember
                {
                    ProjectId = projects[0].Id,
                    UserId = users[1].Id,
                    Role = "Member",
                    JoinMessage = "I'm excited to contribute to this AI education project!",
                    JoinedAt = DateTime.UtcNow.AddDays(-3)
                },
                new ProjectMember
                {
                    ProjectId = projects[0].Id,
                    UserId = users[5].Id,
                    Role = "Member",
                    JoinMessage = "Looking forward to working on the ML components.",
                    JoinedAt = DateTime.UtcNow.AddDays(-2)
                },

                // Campus Social Network 项目的成员
                new ProjectMember
                {
                    ProjectId = projects[1].Id,
                    UserId = users[2].Id,
                    Role = "Member",
                    JoinMessage = "Great idea! I can help with mobile development.",
                    JoinedAt = DateTime.UtcNow.AddDays(-2)
                },
                new ProjectMember
                {
                    ProjectId = projects[1].Id,
                    UserId = users[4].Id,
                    Role = "Member",
                    JoinMessage = "Interested in the UX/UI design aspects.",
                    JoinedAt = DateTime.UtcNow.AddDays(-1)
                },

                // Sustainable Living Tracker 项目的成员
                new ProjectMember
                {
                    ProjectId = projects[2].Id,
                    UserId = users[0].Id,
                    Role = "Member",
                    JoinMessage = "Love the environmental focus! Happy to help with AI features.",
                    JoinedAt = DateTime.UtcNow.AddDays(-12)
                },
                new ProjectMember
                {
                    ProjectId = projects[2].Id,
                    UserId = users[4].Id,
                    Role = "Member",
                    JoinMessage = "Can contribute to UI/UX design.",
                    JoinedAt = DateTime.UtcNow.AddDays(-8)
                },

                // AR Museum Experience 项目的成员
                new ProjectMember
                {
                    ProjectId = projects[5].Id,
                    UserId = users[0].Id,
                    Role = "Member",
                    JoinMessage = "Exciting AR project! I can help with AI integration.",
                    JoinedAt = DateTime.UtcNow.AddDays(-10)
                },
                new ProjectMember
                {
                    ProjectId = projects[5].Id,
                    UserId = users[2].Id,
                    Role = "Member",
                    JoinMessage = "Would love to work on the mobile development aspects.",
                    JoinedAt = DateTime.UtcNow.AddDays(-8)
                },

                // Microservices E-commerce 项目的成员
                new ProjectMember
                {
                    ProjectId = projects[7].Id,
                    UserId = users[1].Id,
                    Role = "Member",
                    JoinMessage = "Great architecture approach! I can help with frontend.",
                    JoinedAt = DateTime.UtcNow.AddDays(-5)
                },
                new ProjectMember
                {
                    ProjectId = projects[7].Id,
                    UserId = users[5].Id,
                    Role = "Member",
                    JoinMessage = "Interested in the data analytics part.",
                    JoinedAt = DateTime.UtcNow.AddDays(-4)
                }
            });

            context.ProjectMembers.AddRange(projectMembers);
            await context.SaveChangesAsync();
            Console.WriteLine($"插入了 {projectMembers.Count} 个项目成员关系");

            // 创建好友关系
            var friends = new List<Friend>
            {
                // Alice 和其他人的好友关系
                new Friend { UserId = users[0].Id, FriendUserId = users[1].Id, CreatedAt = DateTime.UtcNow.AddDays(-20) },
                new Friend { UserId = users[1].Id, FriendUserId = users[0].Id, CreatedAt = DateTime.UtcNow.AddDays(-20) },

                new Friend { UserId = users[0].Id, FriendUserId = users[2].Id, CreatedAt = DateTime.UtcNow.AddDays(-15) },
                new Friend { UserId = users[2].Id, FriendUserId = users[0].Id, CreatedAt = DateTime.UtcNow.AddDays(-15) },

                new Friend { UserId = users[0].Id, FriendUserId = users[5].Id, CreatedAt = DateTime.UtcNow.AddDays(-10) },
                new Friend { UserId = users[5].Id, FriendUserId = users[0].Id, CreatedAt = DateTime.UtcNow.AddDays(-10) },

                // Bob 的好友关系
                new Friend { UserId = users[1].Id, FriendUserId = users[3].Id, CreatedAt = DateTime.UtcNow.AddDays(-18) },
                new Friend { UserId = users[3].Id, FriendUserId = users[1].Id, CreatedAt = DateTime.UtcNow.AddDays(-18) },

                new Friend { UserId = users[1].Id, FriendUserId = users[4].Id, CreatedAt = DateTime.UtcNow.AddDays(-12) },
                new Friend { UserId = users[4].Id, FriendUserId = users[1].Id, CreatedAt = DateTime.UtcNow.AddDays(-12) },

                // Carol 的好友关系
                new Friend { UserId = users[2].Id, FriendUserId = users[4].Id, CreatedAt = DateTime.UtcNow.AddDays(-14) },
                new Friend { UserId = users[4].Id, FriendUserId = users[2].Id, CreatedAt = DateTime.UtcNow.AddDays(-14) },

                new Friend { UserId = users[2].Id, FriendUserId = users[7].Id, CreatedAt = DateTime.UtcNow.AddDays(-8) },
                new Friend { UserId = users[7].Id, FriendUserId = users[2].Id, CreatedAt = DateTime.UtcNow.AddDays(-8) },

                // David 的好友关系
                new Friend { UserId = users[3].Id, FriendUserId = users[6].Id, CreatedAt = DateTime.UtcNow.AddDays(-11) },
                new Friend { UserId = users[6].Id, FriendUserId = users[3].Id, CreatedAt = DateTime.UtcNow.AddDays(-11) },

                // Frank 和 Grace 的好友关系
                new Friend { UserId = users[5].Id, FriendUserId = users[6].Id, CreatedAt = DateTime.UtcNow.AddDays(-6) },
                new Friend { UserId = users[6].Id, FriendUserId = users[5].Id, CreatedAt = DateTime.UtcNow.AddDays(-6) },

                // Emma 和 Henry 的好友关系
                new Friend { UserId = users[4].Id, FriendUserId = users[7].Id, CreatedAt = DateTime.UtcNow.AddDays(-5) },
                new Friend { UserId = users[7].Id, FriendUserId = users[4].Id, CreatedAt = DateTime.UtcNow.AddDays(-5) }
            };

            context.Friends.AddRange(friends);
            await context.SaveChangesAsync();
            Console.WriteLine($"插入了 {friends.Count} 个好友关系");

            // 创建好友请求
            var friendRequests = new List<FriendRequest>
            {
                new FriendRequest
                {
                    SenderId = users[0].Id,
                    ReceiverId = users[3].Id,
                    Message = "Hi David! I saw your blockchain voting project and would love to connect. I think AI and blockchain could work well together!",
                    Status = "Pending",
                    CreatedAt = DateTime.UtcNow.AddDays(-2)
                },
                new FriendRequest
                {
                    SenderId = users[7].Id,
                    ReceiverId = users[5].Id,
                    Message = "Hey Frank! I'm working on AR visualization and think your CV expertise could be really valuable. Want to collaborate?",
                    Status = "Pending",
                    CreatedAt = DateTime.UtcNow.AddDays(-1)
                },
                new FriendRequest
                {
                    SenderId = users[6].Id,
                    ReceiverId = users[1].Id,
                    Message = "Hi Bob! I noticed you're into full-stack development. I could use some frontend help on my microservices project.",
                    Status = "Pending",
                    CreatedAt = DateTime.UtcNow.AddHours(-12)
                },
                new FriendRequest
                {
                    SenderId = users[3].Id,
                    ReceiverId = users[4].Id,
                    Message = "Hello Emma! Love your UX design work. I think good design is crucial for blockchain adoption. Let's connect!",
                    Status = "Rejected",
                    CreatedAt = DateTime.UtcNow.AddDays(-5),
                    ResponsedAt = DateTime.UtcNow.AddDays(-4)
                },
                new FriendRequest
                {
                    SenderId = users[5].Id,
                    ReceiverId = users[2].Id,
                    Message = "Hi Carol! Your sustainability app is amazing. I'd love to contribute some data analysis features.",
                    Status = "Accepted",
                    CreatedAt = DateTime.UtcNow.AddDays(-9),
                    ResponsedAt = DateTime.UtcNow.AddDays(-8)
                }
            };

            context.FriendRequests.AddRange(friendRequests);
            await context.SaveChangesAsync();
            Console.WriteLine($"插入了 {friendRequests.Count} 个好友请求");

            // 创建消息
            var messages = new List<Message>
            {
                // Alice 和 Bob 的对话
                new Message
                {
                    SenderId = users[0].Id,
                    ReceiverId = users[1].Id,
                    Content = "Hey Bob! How's the campus social network project going?",
                    CreatedAt = DateTime.UtcNow.AddDays(-3),
                    IsRead = true,
                    ReadAt = DateTime.UtcNow.AddDays(-3).AddHours(2)
                },
                new Message
                {
                    SenderId = users[1].Id,
                    ReceiverId = users[0].Id,
                    Content = "Hi Alice! It's going well, we just finished the user authentication system. Your AI study assistant sounds fascinating too!",
                    CreatedAt = DateTime.UtcNow.AddDays(-3).AddHours(2),
                    IsRead = true,
                    ReadAt = DateTime.UtcNow.AddDays(-3).AddHours(3)
                },
                new Message
                {
                    SenderId = users[0].Id,
                    ReceiverId = users[1].Id,
                    Content = "Thanks! I think there could be some interesting collaboration opportunities between our projects. Maybe we could integrate study group features?",
                    CreatedAt = DateTime.UtcNow.AddDays(-3).AddHours(3),
                    IsRead = true,
                    ReadAt = DateTime.UtcNow.AddDays(-2)
                },
                new Message
                {
                    SenderId = users[1].Id,
                    ReceiverId = users[0].Id,
                    Content = "That's a great idea! Let's schedule a call to discuss this further. Are you free this weekend?",
                    CreatedAt = DateTime.UtcNow.AddDays(-2),
                    IsRead = false
                },

                // Carol 和 Emma 的对话
                new Message
                {
                    SenderId = users[2].Id,
                    ReceiverId = users[4].Id,
                    Content = "Emma, I love the UX mockups you shared! The sustainability tracker is looking amazing.",
                    CreatedAt = DateTime.UtcNow.AddDays(-5),
                    IsRead = true,
                    ReadAt = DateTime.UtcNow.AddDays(-5).AddHours(1)
                },
                new Message
                {
                    SenderId = users[4].Id,
                    ReceiverId = users[2].Id,
                    Content = "Thank you Carol! I really enjoyed working on the user flow. The eco-friendly theme was inspiring to design for.",
                    CreatedAt = DateTime.UtcNow.AddDays(-5).AddHours(1),
                    IsRead = true,
                    ReadAt = DateTime.UtcNow.AddDays(-4)
                },
                new Message
                {
                    SenderId = users[2].Id,
                    ReceiverId = users[4].Id,
                    Content = "Would you be interested in joining my mental health platform project as well? I think your design skills would be perfect for it.",
                    CreatedAt = DateTime.UtcNow.AddDays(-4),
                    IsRead = true,
                    ReadAt = DateTime.UtcNow.AddDays(-4).AddHours(3)
                },
                new Message
                {
                    SenderId = users[4].Id,
                    ReceiverId = users[2].Id,
                    Content = "I'd love to! Mental health is such an important topic. Let's discuss the project requirements.",
                    CreatedAt = DateTime.UtcNow.AddDays(-4).AddHours(3),
                    IsRead = false
                },

                // Frank 和 Grace 的对话
                new Message
                {
                    SenderId = users[5].Id,
                    ReceiverId = users[6].Id,
                    Content = "Grace, your microservices architecture looks solid! I'm particularly interested in the data pipeline design.",
                    CreatedAt = DateTime.UtcNow.AddDays(-2),
                    IsRead = true,
                    ReadAt = DateTime.UtcNow.AddDays(-2).AddHours(4)
                },
                new Message
                {
                    SenderId = users[6].Id,
                    ReceiverId = users[5].Id,
                    Content = "Thanks Frank! I could really use your data science expertise for the analytics service. Want to collaborate?",
                    CreatedAt = DateTime.UtcNow.AddDays(-2).AddHours(4),
                    IsRead = true,
                    ReadAt = DateTime.UtcNow.AddDays(-1)
                },
                new Message
                {
                    SenderId = users[5].Id,
                    ReceiverId = users[6].Id,
                    Content = "Absolutely! I just joined your project. Looking forward to working together.",
                    CreatedAt = DateTime.UtcNow.AddDays(-1),
                    IsRead = false
                },

                // David 和 Bob 的对话
                new Message
                {
                    SenderId = users[3].Id,
                    ReceiverId = users[1].Id,
                    Content = "Bob, have you ever worked with blockchain integration in web apps?",
                    CreatedAt = DateTime.UtcNow.AddHours(-8),
                    IsRead = true,
                    ReadAt = DateTime.UtcNow.AddHours(-6)
                },
                new Message
                {
                    SenderId = users[1].Id,
                    ReceiverId = users[3].Id,
                    Content = "Not extensively, but I'm really interested in learning! Your voting system project looks really cool.",
                    CreatedAt = DateTime.UtcNow.AddHours(-6),
                    IsRead = false
                },

                // Henry 和 Alice 的对话
                new Message
                {
                    SenderId = users[7].Id,
                    ReceiverId = users[0].Id,
                    Content = "Alice, the AR museum project is coming along nicely! Thanks for helping with the AI image recognition features.",
                    CreatedAt = DateTime.UtcNow.AddHours(-4),
                    IsRead = false
                }
            };

            context.Messages.AddRange(messages);
            await context.SaveChangesAsync();
            Console.WriteLine($"插入了 {messages.Count} 条消息");

            Console.WriteLine("======================================");
            Console.WriteLine("完整示例数据插入完成！");
            Console.WriteLine("======================================");
            Console.WriteLine("用户登录信息：");
            Console.WriteLine("======================================");
            foreach (var user in users)
            {
                Console.WriteLine($"用户名: {user.Username}");
                Console.WriteLine($"邮箱: {user.Email}");
                Console.WriteLine($"密码: password123");
                Console.WriteLine($"姓名: {user.FirstName} {user.LastName}");
                Console.WriteLine($"大学: {user.university}");
                Console.WriteLine("--------------------------------------");
            }
            Console.WriteLine("======================================");
            Console.WriteLine("数据统计：");
            Console.WriteLine($"• 用户: {users.Count}");
            Console.WriteLine($"• 技能板: {skillBoards.Count}");
            Console.WriteLine($"• 技能板项目: {skillBoardItems.Count}");
            Console.WriteLine($"• 项目: {projects.Count}");
            Console.WriteLine($"• 项目成员: {projectMembers.Count}");
            Console.WriteLine($"• 好友关系: {friends.Count}");
            Console.WriteLine($"• 好友请求: {friendRequests.Count}");
            Console.WriteLine($"• 消息: {messages.Count}");
            Console.WriteLine("======================================");
        }

        private static string HashPassword(string password)
        {
            // 使用与AuthService相同的BCrypt哈希方法
            return BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12);
        }
    }
}
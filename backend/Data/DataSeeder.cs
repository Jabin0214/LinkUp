using Microsoft.EntityFrameworkCore;
using Models;
using System.Security.Cryptography;
using System.Text;

namespace Data
{
    public static class DataSeeder
    {
        public static async Task SeedAsync(UserContext context)
        {
            // 检查是否已有数据
            if (context.Users.Any() || context.Projects.Any())
            {
                Console.WriteLine("数据库已有数据，跳过数据初始化");
                return;
            }

            Console.WriteLine("开始插入示例数据...");

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
                }
            };

            context.Users.AddRange(users);
            await context.SaveChangesAsync();

            Console.WriteLine($"插入了 {users.Count} 个用户");

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
                    CreatorId = users[0].Id,
                    Status = "InProgress",
                    Category = "Mobile App",
                    RequiredSkills = "Unity,C#,ARKit,ARCore,3D Modeling",
                    MaxMembers = 6,
                    StartDate = DateTime.UtcNow.AddDays(-7),
                    EndDate = DateTime.UtcNow.AddDays(75),
                    ContactInfo = "alice@example.com | LinkedIn: alice-chen-ar",
                    CreatedAt = DateTime.UtcNow.AddDays(-12),
                    UpdatedAt = DateTime.UtcNow.AddDays(-1)
                },
                new Project
                {
                    Title = "Smart City Dashboard",
                    Description = "Building a comprehensive dashboard for city planners and residents to visualize traffic patterns, air quality, energy usage, and other urban metrics. Contributing to smarter, more sustainable cities.",
                    CreatorId = users[1].Id,
                    Status = "Recruiting",
                    Category = "Data Science",
                    RequiredSkills = "Python,Data Visualization,React,API Integration",
                    MaxMembers = 5,
                    StartDate = DateTime.UtcNow.AddDays(12),
                    EndDate = DateTime.UtcNow.AddDays(95),
                    ContactInfo = "bob@example.com | GitHub: bob-smith-data",
                    CreatedAt = DateTime.UtcNow.AddDays(-2),
                    UpdatedAt = DateTime.UtcNow.AddDays(-2)
                },
                new Project
                {
                    Title = "Language Exchange Platform",
                    Description = "Creating a platform where people can practice languages with native speakers through video calls, text chat, and interactive exercises. Perfect for international students and language enthusiasts.",
                    CreatorId = users[2].Id,
                    Status = "Recruiting",
                    Category = "Web Development",
                    RequiredSkills = "Angular,Node.js,WebRTC,Socket.io",
                    MaxMembers = 6,
                    StartDate = DateTime.UtcNow.AddDays(8),
                    EndDate = DateTime.UtcNow.AddDays(110),
                    ContactInfo = "carol@example.com | Discord: carol_linguist#5678",
                    CreatedAt = DateTime.UtcNow.AddDays(-7),
                    UpdatedAt = DateTime.UtcNow.AddDays(-7)
                },
                new Project
                {
                    Title = "Fitness Gamification App",
                    Description = "Turning fitness into a game! Users can complete challenges, earn rewards, compete with friends, and track their progress in a fun, engaging way. Looking for developers who are passionate about health and gaming.",
                    CreatorId = users[3].Id,
                    Status = "InProgress",
                    Category = "Mobile App",
                    RequiredSkills = "Flutter,Dart,Firebase,Gamification",
                    MaxMembers = 4,
                    StartDate = DateTime.UtcNow.AddDays(-10),
                    EndDate = DateTime.UtcNow.AddDays(50),
                    ContactInfo = "david@example.com | Strava: david_fitness_dev",
                    CreatedAt = DateTime.UtcNow.AddDays(-15),
                    UpdatedAt = DateTime.UtcNow.AddDays(-3)
                },
                new Project
                {
                    Title = "Open Source Code Editor",
                    Description = "Contributing to an open-source code editor with advanced features like AI-powered code completion, collaborative editing, and plugin ecosystem. Great opportunity to contribute to the developer community.",
                    CreatorId = users[4].Id,
                    Status = "Recruiting",
                    Category = "Open Source",
                    RequiredSkills = "TypeScript,Electron,VSCode API,Git",
                    MaxMembers = 8,
                    StartDate = DateTime.UtcNow.AddDays(15),
                    EndDate = DateTime.UtcNow.AddDays(150),
                    ContactInfo = "emma@example.com | GitHub: emma-opensource",
                    CreatedAt = DateTime.UtcNow.AddDays(-1),
                    UpdatedAt = DateTime.UtcNow.AddDays(-1)
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
                    UserId = users[3].Id,
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
                    JoinMessage = "Great idea! I can help with frontend development.",
                    JoinedAt = DateTime.UtcNow.AddDays(-2)
                },
                new ProjectMember
                {
                    ProjectId = projects[1].Id,
                    UserId = users[4].Id,
                    Role = "Member",
                    JoinMessage = "Interested in the backend architecture.",
                    JoinedAt = DateTime.UtcNow.AddDays(-1)
                },

                // Sustainable Living Tracker 项目的成员
                new ProjectMember
                {
                    ProjectId = projects[2].Id,
                    UserId = users[0].Id,
                    Role = "Member",
                    JoinMessage = "Love the environmental focus! Happy to help.",
                    JoinedAt = DateTime.UtcNow.AddDays(-12)
                },
                new ProjectMember
                {
                    ProjectId = projects[2].Id,
                    UserId = users[4].Id,
                    Role = "Member",
                    JoinMessage = "Can contribute to UI/UX design.",
                    JoinedAt = DateTime.UtcNow.AddDays(-8)
                }
            });

            context.ProjectMembers.AddRange(projectMembers);
            await context.SaveChangesAsync();

            Console.WriteLine($"插入了 {projectMembers.Count} 个项目成员关系");
            Console.WriteLine("示例数据插入完成！");
        }

        private static string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }
    }
}
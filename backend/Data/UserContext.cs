using Microsoft.EntityFrameworkCore;

namespace Data
{
    public class UserContext : DbContext
    {
        public UserContext(DbContextOptions<UserContext> options)
            : base(options)
        {
        }

        public DbSet<Models.User> Users { get; set; } = default!;
        public DbSet<Models.SkillBoard> SkillBoards { get; set; } = default!;
        public DbSet<Models.SkillItem> SkillItems { get; set; } = default!;
        public DbSet<Models.LinkItem> LinkItems { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Models.User>(entity =>
            {
                entity.HasKey(e => e.Id);

                // Required fields
                entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PasswordHash).IsRequired();

                // Optional fields
                entity.Property(e => e.FirstName).HasMaxLength(50);
                entity.Property(e => e.LastName).HasMaxLength(50);
                entity.Property(e => e.university).HasMaxLength(100);

                // Default values
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.IsActive).HasDefaultValue(true);

                // Indexes for performance and uniqueness
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.CreatedAt);
                entity.HasIndex(e => e.IsActive);
            });

            // SkillBoard配置
            modelBuilder.Entity<Models.SkillBoard>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Introduction).HasMaxLength(1000);
                entity.Property(e => e.Direction).HasMaxLength(100);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

                // 一个用户只能有一个技能板
                entity.HasIndex(e => e.UserId).IsUnique();

                // 外键关系
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(e => e.Skills)
                    .WithOne(e => e.SkillBoard)
                    .HasForeignKey(e => e.SkillBoardId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(e => e.Links)
                    .WithOne(e => e.SkillBoard)
                    .HasForeignKey(e => e.SkillBoardId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // SkillItem配置
            modelBuilder.Entity<Models.SkillItem>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Language).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Level).IsRequired().HasMaxLength(20);

                entity.HasIndex(e => new { e.SkillBoardId, e.Order });
            });

            // LinkItem配置
            modelBuilder.Entity<Models.LinkItem>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Title).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Url).IsRequired().HasMaxLength(500);

                entity.HasIndex(e => new { e.SkillBoardId, e.Order });
            });
        }
    }
}
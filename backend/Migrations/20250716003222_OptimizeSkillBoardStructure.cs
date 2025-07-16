using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class OptimizeSkillBoardStructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LinkItems");

            migrationBuilder.DropTable(
                name: "SkillItems");

            migrationBuilder.CreateTable(
                name: "SkillBoardItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SkillBoardId = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Level = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Url = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Order = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SkillBoardItems", x => x.Id);
                    table.CheckConstraint("CK_SkillBoardItem_LinkUrl", "(Type = 'link' AND Url IS NOT NULL) OR Type != 'link'");
                    table.CheckConstraint("CK_SkillBoardItem_SkillLevel", "(Type = 'skill' AND Level IS NOT NULL) OR Type != 'skill'");
                    table.CheckConstraint("CK_SkillBoardItem_Type", "Type IN ('skill', 'link')");
                    table.ForeignKey(
                        name: "FK_SkillBoardItems_SkillBoards_SkillBoardId",
                        column: x => x.SkillBoardId,
                        principalTable: "SkillBoards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SkillBoardItems_CreatedAt",
                table: "SkillBoardItems",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_SkillBoardItems_SkillBoardId_Type_Order",
                table: "SkillBoardItems",
                columns: new[] { "SkillBoardId", "Type", "Order" });

            migrationBuilder.CreateIndex(
                name: "IX_SkillBoardItems_Type",
                table: "SkillBoardItems",
                column: "Type");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SkillBoardItems");

            migrationBuilder.CreateTable(
                name: "LinkItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SkillBoardId = table.Column<int>(type: "int", nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Url = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LinkItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LinkItems_SkillBoards_SkillBoardId",
                        column: x => x.SkillBoardId,
                        principalTable: "SkillBoards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SkillItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SkillBoardId = table.Column<int>(type: "int", nullable: false),
                    Language = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Level = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SkillItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SkillItems_SkillBoards_SkillBoardId",
                        column: x => x.SkillBoardId,
                        principalTable: "SkillBoards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LinkItems_SkillBoardId_Order",
                table: "LinkItems",
                columns: new[] { "SkillBoardId", "Order" });

            migrationBuilder.CreateIndex(
                name: "IX_SkillItems_SkillBoardId_Order",
                table: "SkillItems",
                columns: new[] { "SkillBoardId", "Order" });
        }
    }
}

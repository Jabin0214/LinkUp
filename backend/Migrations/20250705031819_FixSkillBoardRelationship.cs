using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class FixSkillBoardRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SkillBoards_Users_UserId1",
                table: "SkillBoards");

            migrationBuilder.DropIndex(
                name: "IX_SkillBoards_UserId1",
                table: "SkillBoards");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "SkillBoards");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId1",
                table: "SkillBoards",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SkillBoards_UserId1",
                table: "SkillBoards",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_SkillBoards_Users_UserId1",
                table: "SkillBoards",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}

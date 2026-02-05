using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sapienza.Leads.Migrations
{
    /// <inheritdoc />
    public partial class Added_Search_Entity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppSearches",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Criterios = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    ResultadosContagem = table.Column<int>(type: "integer", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppSearches", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppSearches_TenantId",
                table: "AppSearches",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_AppSearches_UserId",
                table: "AppSearches",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppSearches");
        }
    }
}

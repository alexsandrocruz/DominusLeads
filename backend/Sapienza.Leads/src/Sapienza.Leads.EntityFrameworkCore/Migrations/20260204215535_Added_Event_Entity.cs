using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sapienza.Leads.Migrations
{
    /// <inheritdoc />
    public partial class Added_Event_Entity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppEvents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    LeadId = table.Column<Guid>(type: "uuid", nullable: false),
                    Tipo = table.Column<int>(type: "integer", nullable: false),
                    Titulo = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: false),
                    Cor = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    Icone = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    Timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppEvents", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppEvents_LeadId",
                table: "AppEvents",
                column: "LeadId");

            migrationBuilder.CreateIndex(
                name: "IX_AppEvents_TenantId",
                table: "AppEvents",
                column: "TenantId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppEvents");
        }
    }
}

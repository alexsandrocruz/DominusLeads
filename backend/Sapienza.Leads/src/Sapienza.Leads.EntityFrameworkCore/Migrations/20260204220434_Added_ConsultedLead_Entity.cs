using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sapienza.Leads.Migrations
{
    /// <inheritdoc />
    public partial class Added_ConsultedLead_Entity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppConsultedLeads",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    RawJson = table.Column<string>(type: "character varying(8000)", maxLength: 8000, nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppConsultedLeads", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppConsultedLeads_TenantId",
                table: "AppConsultedLeads",
                column: "TenantId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppConsultedLeads");
        }
    }
}

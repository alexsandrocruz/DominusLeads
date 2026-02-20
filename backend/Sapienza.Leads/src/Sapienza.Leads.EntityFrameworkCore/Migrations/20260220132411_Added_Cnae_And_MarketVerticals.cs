using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sapienza.Leads.Migrations
{
    /// <inheritdoc />
    public partial class Added_Cnae_And_MarketVerticals : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "NomeFantasia",
                table: "AppLeads",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(256)",
                oldMaxLength: 256);

            migrationBuilder.AlterColumn<string>(
                name: "Cnpj",
                table: "AppLeads",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(14)",
                oldMaxLength: 14);

            migrationBuilder.CreateTable(
                name: "AppCnaes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Descricao = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    Nivel = table.Column<int>(type: "integer", nullable: false),
                    ParentId = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppCnaes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppMarketVerticals",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    Icone = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    ExtraProperties = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppMarketVerticals", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppMarketVerticalCnaes",
                columns: table => new
                {
                    MarketVerticalId = table.Column<Guid>(type: "uuid", nullable: false),
                    CnaeId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppMarketVerticalCnaes", x => new { x.MarketVerticalId, x.CnaeId });
                    table.ForeignKey(
                        name: "FK_AppMarketVerticalCnaes_AppMarketVerticals_MarketVerticalId",
                        column: x => x.MarketVerticalId,
                        principalTable: "AppMarketVerticals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppCnaes");

            migrationBuilder.DropTable(
                name: "AppMarketVerticalCnaes");

            migrationBuilder.DropTable(
                name: "AppMarketVerticals");

            migrationBuilder.AlterColumn<string>(
                name: "NomeFantasia",
                table: "AppLeads",
                type: "character varying(256)",
                maxLength: 256,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(256)",
                oldMaxLength: 256,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Cnpj",
                table: "AppLeads",
                type: "character varying(14)",
                maxLength: 14,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20);
        }
    }
}

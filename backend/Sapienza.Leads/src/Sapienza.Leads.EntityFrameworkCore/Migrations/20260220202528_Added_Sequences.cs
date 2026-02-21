using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sapienza.Leads.Migrations
{
    /// <inheritdoc />
    public partial class Added_Sequences : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppSequenceExecutions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    SequenceId = table.Column<Guid>(type: "uuid", nullable: false),
                    LeadId = table.Column<Guid>(type: "uuid", nullable: false),
                    CurrentStepIndex = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    NextActionAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    LastClassification = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    LastReply = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    ExtraProperties = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppSequenceExecutions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppSequences",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    Nome = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    ExtraProperties = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppSequences", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppStepExecutions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SequenceExecutionId = table.Column<Guid>(type: "uuid", nullable: false),
                    StepIndex = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    ExecutedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Result = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppStepExecutions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppStepExecutions_AppSequenceExecutions_SequenceExecutionId",
                        column: x => x.SequenceExecutionId,
                        principalTable: "AppSequenceExecutions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppSequenceSteps",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SequenceId = table.Column<Guid>(type: "uuid", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Config = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppSequenceSteps", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppSequenceSteps_AppSequences_SequenceId",
                        column: x => x.SequenceId,
                        principalTable: "AppSequences",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppSequenceExecutions_LeadId",
                table: "AppSequenceExecutions",
                column: "LeadId");

            migrationBuilder.CreateIndex(
                name: "IX_AppSequenceExecutions_SequenceId",
                table: "AppSequenceExecutions",
                column: "SequenceId");

            migrationBuilder.CreateIndex(
                name: "IX_AppSequenceExecutions_Status_NextActionAt",
                table: "AppSequenceExecutions",
                columns: new[] { "Status", "NextActionAt" });

            migrationBuilder.CreateIndex(
                name: "IX_AppSequenceExecutions_TenantId",
                table: "AppSequenceExecutions",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_AppSequences_TenantId",
                table: "AppSequences",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_AppSequenceSteps_SequenceId",
                table: "AppSequenceSteps",
                column: "SequenceId");

            migrationBuilder.CreateIndex(
                name: "IX_AppStepExecutions_SequenceExecutionId",
                table: "AppStepExecutions",
                column: "SequenceExecutionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppSequenceSteps");

            migrationBuilder.DropTable(
                name: "AppStepExecutions");

            migrationBuilder.DropTable(
                name: "AppSequences");

            migrationBuilder.DropTable(
                name: "AppSequenceExecutions");
        }
    }
}

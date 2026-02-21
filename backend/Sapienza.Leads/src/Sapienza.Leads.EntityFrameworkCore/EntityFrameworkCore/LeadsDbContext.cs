using Microsoft.EntityFrameworkCore;
using Volo.Abp.AuditLogging.EntityFrameworkCore;
using Volo.Abp.BackgroundJobs.EntityFrameworkCore;
using Volo.Abp.BlobStoring.Database.EntityFrameworkCore;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.Modeling;
using Volo.Abp.FeatureManagement.EntityFrameworkCore;
using Volo.Abp.Identity;
using Volo.Abp.Identity.EntityFrameworkCore;
using Volo.Abp.PermissionManagement.EntityFrameworkCore;
using Volo.Abp.SettingManagement.EntityFrameworkCore;
using Volo.Abp.OpenIddict.EntityFrameworkCore;
using Volo.Abp.TenantManagement;
using Volo.Abp.TenantManagement.EntityFrameworkCore;
using Sapienza.Leads.Leads;
using Sapienza.Leads.Credits;
using Sapienza.Leads.Searches;
using Sapienza.Leads.Events;
using Sapienza.Leads.Market;
using Sapienza.Leads.Sequences;
using Sapienza.Leads.Campaigns;

namespace Sapienza.Leads.EntityFrameworkCore;

[ReplaceDbContext(typeof(IIdentityDbContext))]
[ReplaceDbContext(typeof(ITenantManagementDbContext))]
[ConnectionStringName("Default")]
public class LeadsDbContext :
    AbpDbContext<LeadsDbContext>,
    ITenantManagementDbContext,
    IIdentityDbContext
{
    /* Add DbSet properties for your Aggregate Roots / Entities here. */
    public DbSet<Lead> Leads { get; set; }
    public DbSet<Credit> Credits { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<Search> Searches { get; set; }
    public DbSet<Event> Events { get; set; }
    public DbSet<ConsultedLead> ConsultedLeads { get; set; }
    public DbSet<Cnae> Cnaes { get; set; }
    public DbSet<MarketVertical> MarketVerticals { get; set; }
    public DbSet<Sequence> Sequences { get; set; }
    public DbSet<SequenceStep> SequenceSteps { get; set; }
    public DbSet<SequenceExecution> SequenceExecutions { get; set; }
    public DbSet<StepExecution> StepExecutions { get; set; }

    // Campaigns
    public DbSet<Campaign> Campaigns { get; set; }
    public DbSet<CampaignLead> CampaignLeads { get; set; }



    #region Entities from the modules

    /* Notice: We only implemented IIdentityProDbContext and ISaasDbContext
     * and replaced them for this DbContext. This allows you to perform JOIN
     * queries for the entities of these modules over the repositories easily. You
     * typically don't need that for other modules. But, if you need, you can
     * implement the DbContext interface of the needed module and use ReplaceDbContext
     * attribute just like IIdentityProDbContext and ISaasDbContext.
     *
     * More info: Replacing a DbContext of a module ensures that the related module
     * uses this DbContext on runtime. Otherwise, it will use its own DbContext class.
     */

    // Identity
    public DbSet<IdentityUser> Users { get; set; }
    public DbSet<IdentityRole> Roles { get; set; }
    public DbSet<IdentityClaimType> ClaimTypes { get; set; }
    public DbSet<OrganizationUnit> OrganizationUnits { get; set; }
    public DbSet<IdentitySecurityLog> SecurityLogs { get; set; }
    public DbSet<IdentityLinkUser> LinkUsers { get; set; }
    public DbSet<IdentityUserDelegation> UserDelegations { get; set; }
    public DbSet<IdentitySession> Sessions { get; set; }

    // Tenant Management
    public DbSet<Tenant> Tenants { get; set; }
    public DbSet<TenantConnectionString> TenantConnectionStrings { get; set; }

    #endregion

    public LeadsDbContext(DbContextOptions<LeadsDbContext> options)
        : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        /* Include modules to your migration db context */

        builder.ConfigurePermissionManagement();
        builder.ConfigureSettingManagement();
        builder.ConfigureBackgroundJobs();
        builder.ConfigureAuditLogging();
        builder.ConfigureFeatureManagement();
        builder.ConfigureIdentity();
        builder.ConfigureOpenIddict();
        builder.ConfigureTenantManagement();
        builder.ConfigureBlobStoring();
        
        /* Configure your own tables/entities inside here */

        builder.Entity<Lead>(b =>
        {
            b.ToTable(LeadsConsts.DbTablePrefix + "Leads", LeadsConsts.DbSchema);
            b.ConfigureByConvention(); 
            b.Property(x => x.Cnpj).IsRequired().HasMaxLength(LeadConsts.MaxCnpjLength);
            b.Property(x => x.CnaePrincipal).IsRequired().HasMaxLength(LeadConsts.MaxCnaeLength);
            b.Property(x => x.RazaoSocial).IsRequired().HasMaxLength(LeadConsts.MaxRazaoSocialLength);
            b.Property(x => x.NomeFantasia).HasMaxLength(LeadConsts.MaxNomeFantasiaLength);
            b.Property(x => x.Email).HasMaxLength(LeadConsts.MaxEmailLength);
            b.Property(x => x.Telefone).HasMaxLength(LeadConsts.MaxTelefoneLength);
            b.Property(x => x.Uf).HasMaxLength(LeadConsts.MaxUfLength);

            b.HasIndex(x => new { x.TenantId, x.Cnpj }).IsUnique();
        });

        builder.Entity<Credit>(b =>
        {
            b.ToTable(LeadsConsts.DbTablePrefix + "Credits", LeadsConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.SaldoAtual).HasColumnType("decimal(18,2)");
            
            b.HasMany(x => x.Transactions).WithOne().HasForeignKey(x => x.CreditId).IsRequired();
        });

        builder.Entity<Transaction>(b =>
        {
            b.ToTable(LeadsConsts.DbTablePrefix + "Transactions", LeadsConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.Valor).HasColumnType("decimal(18,2)");
            b.Property(x => x.Descricao).IsRequired().HasMaxLength(CreditConsts.MaxDescricaoLength);
        });

        builder.Entity<Search>(b =>
        {
            b.ToTable(LeadsConsts.DbTablePrefix + "Searches", LeadsConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.Criterios).IsRequired().HasMaxLength(SearchConsts.MaxCriteriosLength);
            b.HasIndex(x => x.TenantId);
            b.HasIndex(x => x.UserId);
        });

        builder.Entity<Event>(b =>
        {
            b.ToTable(LeadsConsts.DbTablePrefix + "Events", LeadsConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.Titulo).IsRequired().HasMaxLength(EventConsts.MaxTituloLength);
            b.Property(x => x.Descricao).IsRequired().HasMaxLength(EventConsts.MaxDescricaoLength);
            b.Property(x => x.Cor).HasMaxLength(EventConsts.MaxCorLength);
            b.Property(x => x.Icone).HasMaxLength(EventConsts.MaxIconeLength);
            
            b.HasIndex(x => x.LeadId);
            b.HasIndex(x => x.TenantId);
        });

        builder.Entity<ConsultedLead>(b =>
        {
            b.ToTable(LeadsConsts.DbTablePrefix + "ConsultedLeads", LeadsConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.RawJson).IsRequired().HasMaxLength(MarketConsts.MaxRawJsonLength);
            b.HasIndex(x => x.TenantId);
        });

        builder.Entity<Cnae>(b =>
        {
            b.ToTable(LeadsConsts.DbTablePrefix + "Cnaes", LeadsConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.Descricao).IsRequired().HasMaxLength(MarketConsts.MaxCnaeDescricaoLength);
            b.Property(x => x.ParentId).HasMaxLength(MarketConsts.MaxCnaeIdLength);
        });

        builder.Entity<MarketVertical>(b =>
        {
            b.ToTable(LeadsConsts.DbTablePrefix + "MarketVerticals", LeadsConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.Nome).IsRequired().HasMaxLength(MarketConsts.MaxVerticalNomeLength);
            b.Property(x => x.Descricao).HasMaxLength(MarketConsts.MaxVerticalDescricaoLength);
            b.Property(x => x.Icone).HasMaxLength(MarketConsts.MaxVerticalIconeLength);

            b.HasMany(x => x.Cnaes).WithOne().HasForeignKey(x => x.MarketVerticalId).IsRequired();
        });

        builder.Entity<MarketVerticalCnae>(b =>
        {
            b.ToTable(LeadsConsts.DbTablePrefix + "MarketVerticalCnaes", LeadsConsts.DbSchema);
            b.ConfigureByConvention();
            b.HasKey(x => new { x.MarketVerticalId, x.CnaeId });
        });

        // Sequence Builder
        builder.Entity<Sequence>(b =>
        {
            b.ToTable(LeadsConsts.DbTablePrefix + "Sequences", LeadsConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.Nome).IsRequired().HasMaxLength(200);
            b.Property(x => x.Descricao).HasMaxLength(1000);
            b.HasMany(x => x.Steps).WithOne().HasForeignKey(x => x.SequenceId).IsRequired();
            b.HasIndex(x => x.TenantId);
        });

        builder.Entity<SequenceStep>(b =>
        {
            b.ToTable(LeadsConsts.DbTablePrefix + "SequenceSteps", LeadsConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.Config).HasMaxLength(4000);
        });

        builder.Entity<SequenceExecution>(b =>
        {
            b.ToTable(LeadsConsts.DbTablePrefix + "SequenceExecutions", LeadsConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.LastClassification).HasMaxLength(100);
            b.Property(x => x.LastReply).HasMaxLength(4000);
            b.HasMany(x => x.StepExecutions).WithOne().HasForeignKey(x => x.SequenceExecutionId).IsRequired();
            b.HasIndex(x => x.TenantId);
            b.HasIndex(x => x.SequenceId);
            b.HasIndex(x => x.LeadId);
            b.HasIndex(x => new { x.Status, x.NextActionAt });
        });

        builder.Entity<StepExecution>(b =>
        {
            b.ToTable(LeadsConsts.DbTablePrefix + "StepExecutions", LeadsConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.Result).HasMaxLength(4000);
        });

        // Campaigns
        builder.Entity<Campaign>(b =>
        {
            b.ToTable(LeadsConsts.DbTablePrefix + "Campaigns", LeadsConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.Name).IsRequired().HasMaxLength(200);
            b.Property(x => x.Description).HasMaxLength(1000);
            b.HasOne(x => x.Sequence).WithMany().HasForeignKey(x => x.SequenceId).IsRequired();
            b.HasMany(x => x.Leads).WithOne().HasForeignKey(x => x.CampaignId).IsRequired();
            b.HasIndex(x => x.TenantId);
        });

        builder.Entity<CampaignLead>(b =>
        {
            b.ToTable(LeadsConsts.DbTablePrefix + "CampaignLeads", LeadsConsts.DbSchema);
            b.ConfigureByConvention();
            b.HasOne(x => x.Lead).WithMany().HasForeignKey(x => x.LeadId).IsRequired();
            b.HasIndex(x => new { x.CampaignId, x.LeadId }).IsUnique();
        });
    }
}

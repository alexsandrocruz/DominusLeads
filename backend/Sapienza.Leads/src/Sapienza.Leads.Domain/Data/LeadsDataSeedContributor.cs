using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Identity;
using Volo.Abp.Uow;

namespace Sapienza.Leads.Data;

/// <summary>
/// Seeds custom roles (Vendedor, Viewer) for the Dominus Leads platform.
/// The default 'admin' role is seeded by ABP Identity automatically.
/// </summary>
public class LeadsDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IdentityRoleManager _roleManager;
    private readonly ILogger<LeadsDataSeedContributor> _logger;

    public LeadsDataSeedContributor(
        IdentityRoleManager roleManager,
        ILogger<LeadsDataSeedContributor> logger)
    {
        _roleManager = roleManager;
        _logger = logger;
    }

    [UnitOfWork]
    public virtual async Task SeedAsync(DataSeedContext context)
    {
        await CreateRoleIfNotExistsAsync("Vendedor", isPublic: true);
        await CreateRoleIfNotExistsAsync("Viewer", isPublic: true);
    }

    private async Task CreateRoleIfNotExistsAsync(string roleName, bool isPublic = false)
    {
        var role = await _roleManager.FindByNameAsync(roleName);
        if (role != null)
        {
            return;
        }

        role = new IdentityRole(Guid.NewGuid(), roleName)
        {
            IsPublic = isPublic
        };

        var result = await _roleManager.CreateAsync(role);
        if (result.Succeeded)
        {
            _logger.LogInformation("Created role: {RoleName}", roleName);
        }
        else
        {
            _logger.LogWarning("Failed to create role {RoleName}: {Errors}",
                roleName, string.Join(", ", result.Errors));
        }
    }
}

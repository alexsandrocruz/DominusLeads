using Sapienza.Leads.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;

namespace Sapienza.Leads.Permissions;

public class LeadsPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(LeadsPermissions.GroupName);

        //Define your own permissions here. Example:
        //myGroup.AddPermission(LeadsPermissions.MyPermission1, L("Permission:MyPermission1"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<LeadsResource>(name);
    }
}

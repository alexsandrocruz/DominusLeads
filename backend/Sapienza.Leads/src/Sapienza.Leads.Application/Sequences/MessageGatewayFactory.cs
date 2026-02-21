using System;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.DependencyInjection;

namespace Sapienza.Leads.Sequences;

public interface IMessageGatewayFactory
{
    IMessageGateway GetGateway(string provider);
}

public class MessageGatewayFactory : IMessageGatewayFactory, ITransientDependency
{
    private readonly IServiceProvider _serviceProvider;

    public MessageGatewayFactory(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public IMessageGateway GetGateway(string provider)
    {
        if (string.IsNullOrEmpty(provider) || provider.Equals("evolution", StringComparison.OrdinalIgnoreCase))
        {
            return _serviceProvider.GetRequiredService<EvolutionMessageGateway>();
        }

        if (provider.Equals("twilio", StringComparison.OrdinalIgnoreCase))
        {
            return _serviceProvider.GetRequiredService<TwilioMessageGateway>();
        }

        // Default or unknown
        return _serviceProvider.GetRequiredService<EvolutionMessageGateway>();
    }
}

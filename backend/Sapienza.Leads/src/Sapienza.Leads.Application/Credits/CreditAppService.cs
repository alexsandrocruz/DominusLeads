using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace Sapienza.Leads.Credits;

[AllowAnonymous]
public class CreditAppService : ApplicationService, ICreditAppService
{
    private readonly IRepository<Credit, Guid> _creditRepository;

    public CreditAppService(IRepository<Credit, Guid> creditRepository)
    {
        _creditRepository = creditRepository;
    }

    public async Task<CreditDto> GetAsync()
    {
        var credit = await GetOrCreateCurrentCreditAsync();
        var mapper = new LeadsApplicationMappers();
        return mapper.Map(credit);
    }

    public async Task AddCreditAsync(AddCreditDto input)
    {
        var credit = await GetOrCreateCurrentCreditAsync();

        credit.AddTransaction(
            GuidGenerator.Create(),
            TransactionType.Recarga,
            input.Valor,
            input.Descricao,
            TransactionStatus.Confirmado // No MVP confirmamos direto, em prod seria via webhook
        );

        await _creditRepository.UpdateAsync(credit, autoSave: true);
    }

    // Método para débito (pode ser chamado por outros AppServices)
    public async Task DebitAsync(DebitCreditDto input)
    {
        var credit = await GetOrCreateCurrentCreditAsync();

        credit.AddTransaction(
            GuidGenerator.Create(),
            TransactionType.ConsumoExtracao,
            -input.Valor, // Valor negativo para débito
            input.Descricao
        );

        await _creditRepository.UpdateAsync(credit, autoSave: true);
    }

    private async Task<Credit> GetOrCreateCurrentCreditAsync()
    {
        var queryable = await _creditRepository.WithDetailsAsync(x => x.Transactions);
        var credit = await AsyncExecuter.FirstOrDefaultAsync(queryable, x => x.TenantId == CurrentTenant.Id);

        if (credit == null)
        {
            credit = new Credit(GuidGenerator.Create(), CurrentTenant.Id);
            // Give 1000 credits for initial testing
            credit.AddTransaction(GuidGenerator.Create(), TransactionType.Recarga, 1000, "Saldo Inicial (Teste)", TransactionStatus.Confirmado);
            await _creditRepository.InsertAsync(credit, autoSave: true);
        }

        return credit;
    }
}

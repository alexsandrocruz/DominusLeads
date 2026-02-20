using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace Sapienza.Leads.Leads;

[AllowAnonymous]
public class LeadAppService :
    CrudAppService<
        Lead,
        LeadDto,
        Guid,
        PagedAndSortedResultRequestDto,
        CreateUpdateLeadDto>,
    ILeadAppService
{
    public LeadAppService(IRepository<Lead, Guid> repository)
        : base(repository)
    {
    }

    protected override Task<LeadDto> MapToGetOutputDtoAsync(Lead entity)
    {
        var mapper = new LeadsApplicationMappers();
        return Task.FromResult(mapper.Map(entity));
    }

    protected override Task<Lead> MapToEntityAsync(CreateUpdateLeadDto createInput)
    {
        var lead = new Lead(
            GuidGenerator.Create(),
            createInput.Cnpj,
            createInput.CnaePrincipal,
            createInput.RazaoSocial,
            createInput.NomeFantasia,
            createInput.Status,
            createInput.Score,
            createInput.Origem,
            CurrentTenant.Id
        );

        lead.SetContactInfo(createInput.Email, createInput.Telefone);
        lead.SetAddress(
            createInput.Logradouro,
            createInput.Numero,
            createInput.Bairro,
            createInput.Cidade,
            createInput.Uf,
            createInput.Cep
        );

        return Task.FromResult(lead);
    }

    protected override Task MapToEntityAsync(CreateUpdateLeadDto updateInput, Lead entity)
    {
        var mapper = new LeadsApplicationMappers();
        mapper.Map(updateInput, entity);
        return Task.CompletedTask;
    }
}
